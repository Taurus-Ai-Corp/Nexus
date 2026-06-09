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
from pathlib import Path
from typing import Dict, Any, Optional, List
from datetime import datetime

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import HTMLResponse, FileResponse, PlainTextResponse

from core.pricing.microloan_env import MicroLoanPricingEnv
from core.pricing.synthetic_data import (
    generate_borrowers,
    borrowers_to_env_array,
    generate_training_dataset,
    SEGMENT_PROFILES,
)
from core.pricing.training_pipeline import (
    train_ppo,
    evaluate_model,
    generate_price_recommendation,
)
from core.security import (
    authenticate_request,
    limiter,
    TrainRequest,
    EvaluateRequest,
    RecommendRequest,
    apply_security_middleware,
    api_key_manager,
    create_access_token,
    hash_password,
    verify_password,
    SECURITY_HEADERS,
    ROBOTS_TXT,
    SECURITY_TXT,
)

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

app = FastAPI(
    title="Micro-Loan Pricing API",
    description="Dynamic pricing optimization using RL (PPO)",
    version="2.1.0",
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)

from core.security import SecurityHeadersMiddleware, RequestLoggingMiddleware, XSSProtectionMiddleware, setup_cors

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(XSSProtectionMiddleware)
setup_cors(app)

MODEL_DIR = Path("models")
EXPERIMENT_DIR = Path("experiments")
DATA_DIR = Path("data")
LOGS_DIR = Path("logs")
MODEL_DIR.mkdir(exist_ok=True)
EXPERIMENT_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

_global_model = None
_global_borrowers = None


def _load_or_generate_borrowers():
    global _global_borrowers
    if _global_borrowers is None:
        csv_path = DATA_DIR / "training_borrowers.csv"
        if csv_path.exists():
            import pandas as pd
            df = pd.read_csv(csv_path)
            _global_borrowers = borrowers_to_env_array(df)
        else:
            _global_borrowers = generate_training_dataset(n=5000, seed=42)
    return _global_borrowers


def _load_model():
    global _global_model
    if _global_model is None:
        from stable_baselines3 import PPO
        model_path = MODEL_DIR / "baseline_pricing_v1_final.zip"
        if model_path.exists():
            _global_model = PPO.load(str(model_path))
        else:
            raise HTTPException(status_code=404, detail="Model not trained yet")
    return _global_model


@app.get("/")
@limiter.limit("120/minute")
async def root(request: Request):
    return {"status": "ok", "service": "Micro-Loan Pricing API", "version": "2.1.0"}


@app.get("/health")
@limiter.limit("120/minute")
async def health(request: Request):
    return {
        "status": "healthy",
        "model_loaded": _global_model is not None,
        "borrowers_loaded": _global_borrowers is not None,
        "timestamp": datetime.now().isoformat(),
        "security_version": "2.1.0",
    }


@app.post("/api/pricing/train")
@limiter.limit("5/minute")
async def train_endpoint(
    request: Request,
    body: TrainRequest,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    if "write" not in auth.get("scopes", []) and auth.get("auth_type") != "none":
        raise HTTPException(status_code=403, detail="Write access required")
    
    borrowers = _load_or_generate_borrowers()
    
    model, tracker = train_ppo(
        experiment_name=body.experiment_name,
        borrowers_array=borrowers,
        total_timesteps=body.timesteps,
        n_envs=4,
        log_dir=str(EXPERIMENT_DIR),
        save_dir=str(MODEL_DIR),
    )
    
    global _global_model
    _global_model = model
    
    return {
        "status": "completed",
        "experiment_name": body.experiment_name,
        "timesteps": body.timesteps,
        "best_reward": tracker.best_mean_reward,
    }


@app.get("/api/pricing/evaluate")
@limiter.limit("20/minute")
async def evaluate_endpoint(
    request: Request,
    n_episodes: int = 100,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    if n_episodes < 10 or n_episodes > 1000:
        raise HTTPException(status_code=400, detail="n_episodes must be between 10 and 1000")
    
    model = _load_model()
    borrowers = _load_or_generate_borrowers()
    
    metrics = evaluate_model(model, n_episodes, borrowers)
    
    metadata_path = EXPERIMENT_DIR / "baseline_pricing_v1_metadata.json"
    best_reward = None
    metrics_history = None
    if metadata_path.exists():
        with open(metadata_path) as f:
            meta = json.load(f)
            best_reward = meta.get("final_best_reward")
            metrics_history = meta.get("metrics_history")
    
    return {
        **metrics,
        "best_reward": best_reward,
        "metrics_history": metrics_history,
    }


@app.get("/api/pricing/recommend")
@limiter.limit("30/minute")
async def recommend_endpoint(
    request: Request,
    n_samples: int = 10,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    if n_samples < 1 or n_samples > 100:
        raise HTTPException(status_code=400, detail="n_samples must be between 1 and 100")
    
    model = _load_model()
    borrowers = _load_or_generate_borrowers()
    
    import pandas as pd
    csv_path = DATA_DIR / "training_borrowers.csv"
    df = pd.read_csv(csv_path) if csv_path.exists() else None
    
    recommendations = []
    indices = np.random.choice(len(borrowers), size=min(n_samples, len(borrowers)), replace=False)
    
    for idx in indices:
        state = borrowers[idx]
        rec = generate_price_recommendation(model, state)
        
        if df is not None:
            row = df.iloc[idx]
            rec["borrower_id"] = row.get("borrower_id", f"BL{idx:06d}")
            rec["segment"] = row.get("segment", "unknown")
            rec["credit_score"] = float(row.get("credit_score", 0.5))
        
        recommendations.append(rec)
    
    return {"recommendations": recommendations}


@app.get("/api/pricing/status")
@limiter.limit("30/minute")
async def status_endpoint(
    request: Request,
    auth: Dict[str, Any] = Depends(authenticate_request),
):
    experiments = []
    for meta_file in EXPERIMENT_DIR.glob("*_metadata.json"):
        with open(meta_file) as f:
            experiments.append(json.load(f))
    
    has_model = (MODEL_DIR / "baseline_pricing_v1_final.zip").exists()
    
    best_reward = None
    total_timesteps = None
    mean_reward = None
    
    if experiments:
        latest = experiments[-1]
        best_reward = latest.get("final_best_reward")
        total_timesteps = latest.get("total_timesteps")
    
    return _sanitize_dict({
        "has_model": has_model,
        "experiments": experiments,
        "best_reward": best_reward,
        "total_timesteps": total_timesteps,
        "mean_reward": mean_reward,
    })


@app.get("/api/pricing/segments")
@limiter.limit("60/minute")
async def segments_endpoint(request: Request):
    return {"segments": SEGMENT_PROFILES}


@app.get("/pricing-dashboard")
async def pricing_dashboard(request: Request):
    dashboard_path = Path("dashboard") / "pricing.html"
    if dashboard_path.exists():
        return FileResponse(str(dashboard_path))
    raise HTTPException(status_code=404, detail="Dashboard not found")


@app.get("/robots.txt")
async def robots_txt():
    return PlainTextResponse(ROBOTS_TXT, media_type="text/plain")


@app.get("/.well-known/security.txt")
async def security_txt():
    return PlainTextResponse(SECURITY_TXT, media_type="text/plain")


@app.post("/auth/token")
@limiter.limit("10/minute")
async def create_token(request: Request, username: str = "", password: str = ""):
    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")
    
    user_db = _load_user_db()
    user = user_db.get(username)
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": username, "scopes": user["scopes"]})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/auth/api-keys")
@limiter.limit("5/minute")
async def create_api_key(request: Request, name: str, auth: Dict[str, Any] = Depends(authenticate_request)):
    if "admin" not in auth.get("scopes", []):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    key = api_key_manager.create_key(name)
    return {"api_key": key, "name": name}


@app.get("/auth/api-keys")
@limiter.limit("10/minute")
async def list_api_keys(request: Request, auth: Dict[str, Any] = Depends(authenticate_request)):
    if "admin" not in auth.get("scopes", []):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return {"keys": api_key_manager.list_keys()}


@app.post("/auth/api-keys/{key}/revoke")
@limiter.limit("5/minute")
async def revoke_api_key(key: str, request: Request, auth: Dict[str, Any] = Depends(authenticate_request)):
    if "admin" not in auth.get("scopes", []):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if api_key_manager.revoke_key(key):
        return {"status": "revoked"}
    raise HTTPException(status_code=404, detail="Key not found")


def _load_user_db() -> Dict[str, Any]:
    db_path = DATA_DIR / "users.json"
    if db_path.exists():
        with open(db_path) as f:
            return json.load(f)
    default_user = "admin"
    default_pass = hash_password("admin123")
    users = {
        default_user: {
            "hashed_password": default_pass,
            "scopes": ["read", "write", "admin"],
        }
    }
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with open(db_path, "w") as f:
        json.dump(users, f, indent=2)
    return users


@app.on_event("startup")
async def startup():
    _load_or_generate_borrowers()
    try:
        _load_model()
    except HTTPException:
        pass
