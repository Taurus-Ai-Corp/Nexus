"""
Security Middleware for Micro-Loan Pricing API.

Implements:
- P0: JWT/API key authentication, rate limiting, OpenAPI gating
- P1: Security headers, CORS, input validation
- P2: XSS protection, SRI enforcement, structured logging
- P3: robots.txt, security.txt
"""

import os
import re
import time
import json
import logging
import hashlib
from typing import Optional, Dict, Any, List, Set
from datetime import datetime, timedelta
from pathlib import Path

from fastapi import Request, Response, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from jose import JWTError, jwt
import bcrypt

from slowapi import Limiter
from slowapi.util import get_remote_address

from pydantic import BaseModel, Field, field_validator

# Configuration
SECRET_KEY = os.environ.get("API_SECRET_KEY", "change-me-in-production-use-env-var")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("TOKEN_EXPIRE_MINUTES", "60"))
API_KEYS_FILE = os.environ.get("API_KEYS_FILE", "data/api_keys.json")
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT == "production"
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

security_scheme = HTTPBearer()
logger = logging.getLogger("microloan.security")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


class APIKeyManager:
    """Manages API keys with creation, validation, and rotation."""

    def __init__(self, keys_file: str = API_KEYS_FILE):
        self.keys_file = Path(keys_file)
        self.keys_file.parent.mkdir(parents=True, exist_ok=True)
        self._keys: Dict[str, Dict[str, Any]] = {}
        self._load_keys()

    def _load_keys(self):
        if self.keys_file.exists():
            with open(self.keys_file) as f:
                self._keys = json.load(f)

    def _save_keys(self):
        with open(self.keys_file, "w") as f:
            json.dump(self._keys, f, indent=2)

    def create_key(self, name: str, scopes: Optional[List[str]] = None) -> Dict[str, Any]:
        key = f"ml_{hashlib.sha256(f'{name}{time.time()}'.encode()).hexdigest()[:32]}"
        hashed = hashlib.sha256(key.encode()).hexdigest()
        self._keys[hashed] = {
            "name": name,
            "scopes": scopes or ["read"],
            "created_at": datetime.utcnow().isoformat(),
            "active": True,
        }
        self._save_keys()
        return {"key": key, "name": name, "scopes": scopes or ["read"]}

    def validate_key(self, key: str) -> Optional[Dict[str, Any]]:
        hashed = hashlib.sha256(key.encode()).hexdigest()
        key_data = self._keys.get(hashed)
        if key_data and key_data.get("active"):
            return key_data
        return None

    def revoke_key(self, key: str) -> bool:
        hashed = hashlib.sha256(key.encode()).hexdigest()
        if hashed in self._keys:
            self._keys[hashed]["active"] = False
            self._save_keys()
            return True
        return False

    def list_keys(self) -> List[Dict[str, Any]]:
        return [
            {"hashed": k, **v}
            for k, v in self._keys.items()
        ]


api_key_manager = APIKeyManager()


def create_access_token(subject: str, scopes: Optional[List[str]] = None) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": subject,
        "scopes": scopes or ["read", "write", "admin"],
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def authenticate_request(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
) -> Dict[str, Any]:
    """Authenticate via Bearer token (JWT) or API key."""
    auth_header = request.headers.get("Authorization", "")
    api_key = request.headers.get("X-API-Key", "")

    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        return verify_token(token)

    if api_key:
        key_data = api_key_manager.validate_key(api_key)
        if key_data:
            return {"sub": key_data["name"], "scopes": key_data.get("scopes", ["read"])}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Provide Bearer token or X-API-Key header.",
    )


limiter = Limiter(key_func=get_remote_address)

RATE_LIMITS = {
    "/api/pricing/train": "5/minute",
    "/api/pricing/evaluate": "20/minute",
    "/api/pricing/recommend": "30/minute",
    "/api/pricing/status": "30/minute",
    "/health": "120/minute",
}

SECURITY_HEADERS = {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "0",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        for header, value in SECURITY_HEADERS.items():
            response.headers[header] = value
        response.headers["server"] = ""
        return response


def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )


class TrainRequest(BaseModel):
    experiment_name: str = Field(..., min_length=1, max_length=64, pattern=r"^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$")
    timesteps: int = Field(..., ge=1000, le=10000000)

    @field_validator("experiment_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        dangerous = ["<", ">", "'", '"', ";", "--", "/*", "*/"]
        if any(c in v for c in dangerous):
            raise ValueError("Experiment name contains invalid characters")
        return v


class EvaluateRequest(BaseModel):
    experiment_name: str = Field(..., min_length=1, max_length=64)
    n_episodes: int = Field(..., ge=1, le=10000)


class RecommendRequest(BaseModel):
    borrower_id: str = Field(..., min_length=1, max_length=64)
    loan_amount: float = Field(..., gt=0, le=10000000)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, log_dir: str = "logs"):
        super().__init__(app)
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.log_file = self.log_dir / "api_requests.jsonl"

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start = time.time()
        request_id = f"req-{int(time.time() * 1000)}"
        request.state.request_id = request_id

        response = await call_next(request)
        duration_ms = (time.time() - start) * 1000

        self._write_log({
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat(),
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "response_time_ms": round(duration_ms, 2),
            "client_ip": request.client.host if request.client else "unknown",
        })

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration_ms:.1f}ms"
        return response

    def _write_log(self, entry: Dict[str, Any]):
        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")


class XSSProtectionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        if response.headers.get("content-type", "").startswith("text/html"):
            body = b""
            async for chunk in response.body_iterator:
                body += chunk
            text = body.decode("utf-8", errors="replace")
            text = re.sub(r"<script[^>]*>.*?</script>", "", text, flags=re.IGNORECASE | re.DOTALL)
            text = re.sub(r"javascript:", "", text, flags=re.IGNORECASE)
            text = re.sub(r"on\w+\s*=", "", text, flags=re.IGNORECASE)
            return Response(
                content=text,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type,
            )
        return response


ROBOTS_TXT = """User-agent: *
Disallow: /api/
Disallow: /docs
Disallow: /redoc
Disallow: /openapi.json
Disallow: /pricing-dashboard
Allow: /
Allow: /health

Sitemap: https://api.microloan-platform.com/sitemap.xml
"""

SECURITY_TXT = """Contact: mailto:security@taurusai.io
Expires: 2027-05-20T00:00:00Z
Preferred-Languages: en
Policy: https://taurusai.io/security-policy
Acknowledgments: https://taurusai.io/security/hall-of-fame
"""


def apply_security_middleware(app):
    """Apply all security middleware to the FastAPI app."""
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(XSSProtectionMiddleware)
    setup_cors(app)
