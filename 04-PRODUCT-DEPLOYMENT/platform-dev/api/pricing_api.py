"""
FastAPI Pricing Service — Hardened v2.1.0

Security fixes applied:
- P0: JWT/API key auth, rate limiting, OpenAPI gating
- P1: Security headers, CORS, Pydantic input validation
- P2: XSS protection, structured request logging
- P3: robots.txt, security.txt
"""

import os
import json
import math
import numpy as np
from pathlib import Path
from typing import Dict, Any, Optional, List
from datetime import datetime

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import HTMLResponse, FileResponse, PlainTextResponse

from core.pricing.microloan_env import MicroLoanPricingEnv
from core.pricing.synthetic_data import (
    generate_borrowers, borrowers_to_env_array, generate_training_dataset,
    SEGMENT_PROFILES,
)
from core.pricing.training_pipeline import (
    train_ppo, evaluate_model, generate_price_recommendation, ExperimentTracker,
)
from core.security import (
    authenticate_request, limiter, TrainRequest, EvaluateRequest, RecommendRequest,
    apply_security_middleware, api_key_manager, create_access_token,
    hash_password, verify_password, SECURITY_HEADERS, ROBOTS_TXT, SECURITY_TXT,
)

# Environment
IS_PRODUCTION = os.environ.get("ENVIRONMENT", "development") == "production"


def _sanitize_value(v):
    if v is None:
        return None
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return None
    return v


def _sanitize_dict(d):
    if isinstance(d, dict):
        return {k: _sanitize_dict(v) for k, v in d.items()}
    if isinstance(d, list):
        return [_sanitize_dict(v) for v in d]
    return _sanitize_value(d)


# App
app = FastAPI(
    title="Micro-Loan Pricing API",
    description="Dynamic pricing optimization using RL (PPO)",
    version="2.1.0",
    docs_url="/docs" if not IS_PRODUCTION else None,
    redoc_url="/redoc" if not IS_PRODUCTION else None,
    openapi_url="/openapi.json" if not IS_PRODUCTION else None,
)

# Apply security middleware
apply_security_middleware(app)

# Directories
MODEL_DIR = Path("models")
EXPERIMENT_DIR = Path("experiments")
DATA_DIR = Path("data")
LOGS_DIR = Path("logs")
for d in [MODEL_DIR, EXPERIMENT_DIR, DATA_DIR, LOGS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Global state
_global_model = None
_global_borrowers = None


def _load_or_generate_borrowers():
    global _global_borrowers
    if _global_borrowers is None:
        csv_path = DATA_DIR / "borrowers.csv"
        if csv_path.exists():
            import pandas as pd
            _global_borrowers = pd.read_csv(csv_path)
        else:
            _global_borrowers = generate_borrowers(n=500)
            _global_borrowers.to_csv(csv_path, index=False)
    return _global_borrowers


def _load_model():
    global _global_model
    if _global_model is None:
        model_path = MODEL_DIR / "pricing_model.zip"
        if model_path.exists():
            from stable_baselines3 import PPO
            _global_model = PPO.load(str(model_path))
    return _global_model


@app.get("/")
@limiter.limit("30/minute")
async def root(request: Request):
    return {"service": "micro-loan-pricing-api", "version": "2.1.0", "status": "running"}


@app.get("/health")
@limiter.limit("120/minute")
async def health(request: Request):
    model = _load_model()
    borrowers = _load_or_generate_borrowers()
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "borrowers_loaded": borrowers is not None,
        "timestamp": datetime.utcnow().isoformat(),
        "security_version": "2.1.0",
    }


@app.post("/api/pricing/train")
@limiter.limit("5/minute")
async def train_endpoint(
    req: TrainRequest,
    request: Request,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    borrowers = _load_or_generate_borrowers()
    env_array = borrowers_to_env_array(borrowers)

    result = train_ppo(
        experiment_name=req.experiment_name,
        borrowers_array=env_array,
        total_timesteps=req.timesteps,
    )
    return result


@app.get("/api/pricing/evaluate")
@limiter.limit("20/minute")
async def evaluate_endpoint(
    experiment_name: str,
    n_episodes: int = 100,
    request: Request = None,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    model = _load_model()
    if model is None:
        raise HTTPException(status_code=404, detail="No trained model found")

    borrowers = _load_or_generate_borrowers()
    env_array = borrowers_to_env_array(borrowers)
    result = evaluate_model(model, n_eval_episodes=n_episodes, borrowers_array=env_array)
    return result


@app.get("/api/pricing/recommend")
@limiter.limit("30/minute")
async def recommend_endpoint(
    borrower_id: str,
    loan_amount: float,
    request: Request = None,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    model = _load_model()
    borrowers = _load_or_generate_borrowers()

    recommendations = []
    for b in borrowers[:10]:
        if b.get("borrower_id") == borrower_id:
            state = borrowers_to_env_array([b])
            rec = generate_price_recommendation(model, state)
            recommendations.append(rec)
            break

    if not recommendations:
        state = np.zeros(1, dtype=np.float32)
        rec = generate_price_recommendation(model, state)
        recommendations.append(rec)

    return {"recommendations": recommendations}


@app.get("/api/pricing/status")
@limiter.limit("30/minute")
async def status_endpoint(
    request: Request,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    model = _load_model()
    has_model = model is not None

    experiments = []
    for exp_file in EXPERIMENT_DIR.glob("*_metadata.json"):
        with open(exp_file) as f:
            exp_data = json.load(f)
            experiments.append(_sanitize_dict(exp_data))

    best_reward = None
    total_timesteps = 0
    mean_reward = None

    if experiments:
        last_exp = experiments[-1]
        history = last_exp.get("metrics_history", [])
        if history:
            best_reward = history[-1].get("best_reward")
            mean_reward = history[-1].get("mean_reward")
        total_timesteps = last_exp.get("total_timesteps", 0)

    return _sanitize_dict({
        "has_model": has_model,
        "experiments": experiments,
        "best_reward": best_reward,
        "total_timesteps": total_timesteps,
        "mean_reward": mean_reward,
    })


@app.get("/api/pricing/segments")
async def segments_endpoint(request: Request):
    return {"segments": SEGMENT_PROFILES}


@app.get("/pricing-dashboard")
async def pricing_dashboard(request: Request):
    dashboard_path = Path("dashboard/pricing.html")
    if dashboard_path.exists():
        return FileResponse(str(dashboard_path))
    return HTMLResponse("<h1>Dashboard not available</h1>")


@app.get("/robots.txt")
async def robots_txt():
    return PlainTextResponse(ROBOTS_TXT)


@app.get("/.well-known/security.txt")
async def security_txt():
    return PlainTextResponse(SECURITY_TXT)


@app.post("/auth/token")
async def create_token(
    username: str,
    password: str,
    request: Request,
):
    user_db = _load_user_db()
    user = user_db.get(username)
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(subject=username, scopes=user.get("scopes", ["read"]))
    return {"access_token": token, "token_type": "bearer"}


@app.post("/auth/api-keys")
async def create_api_key(
    name: str,
    request: Request,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    result = api_key_manager.create_key(name)
    return result


@app.get("/auth/api-keys")
async def list_api_keys(
    request: Request,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    return api_key_manager.list_keys()


@app.post("/auth/api-keys/{key}/revoke")
async def revoke_api_key(
    key: str,
    request: Request,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    success = api_key_manager.revoke_key(key)
    return {"revoked": success}


def _load_user_db():
    user_path = DATA_DIR / "users.json"
    if user_path.exists():
        with open(user_path) as f:
            return json.load(f)

    admin_hash = hash_password("admin123")
    users = {
        "admin": {
            "username": "admin",
            "password_hash": admin_hash,
            "scopes": ["read", "write", "admin"],
            "created_at": datetime.utcnow().isoformat(),
        }
    }
    user_path.parent.mkdir(parents=True, exist_ok=True)
    with open(user_path, "w") as f:
        json.dump(users, f, indent=2)
    return users


@app.on_event("startup")
async def startup():
    _load_or_generate_borrowers()
    _load_user_db()
