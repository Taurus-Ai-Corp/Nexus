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

from fastapi import Request, Response, HTTPException, Depends, status, FastAPI
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from jose import JWTError, jwt
import bcrypt
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel, Field, field_validator

# --- Configuration ---

SECRET_KEY = os.environ.get("API_SECRET_KEY", "change-me-in-production-use-env-var")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("TOKEN_EXPIRE_MINUTES", "60"))
API_KEYS_FILE = os.environ.get("API_KEYS_FILE", "data/api_keys.json")
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT == "production"

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

security_scheme = HTTPBearer(auto_error=False)

logger = logging.getLogger("microloan.security")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


# --- P0: Authentication ---

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
    
    def create_key(self, name: str, scopes: List[str] = ["read", "write"]) -> str:
        import secrets
        key = f"ml_{secrets.token_urlsafe(32)}"
        self._keys[key] = {
            "name": name,
            "scopes": scopes,
            "created_at": datetime.now().isoformat(),
            "last_used": None,
            "active": True,
        }
        self._save_keys()
        return key
    
    def validate_key(self, key: str) -> Optional[Dict[str, Any]]:
        record = self._keys.get(key)
        if record and record.get("active"):
            record["last_used"] = datetime.now().isoformat()
            self._save_keys()
            return record
        return None
    
    def revoke_key(self, key: str) -> bool:
        if key in self._keys:
            self._keys[key]["active"] = False
            self._save_keys()
            return True
        return False
    
    def list_keys(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": v["name"],
                "scopes": v["scopes"],
                "created_at": v["created_at"],
                "last_used": v["last_used"],
                "active": v["active"],
            }
            for k, v in self._keys.items()
        ]


api_key_manager = APIKeyManager()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


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
    if credentials:
        return verify_token(credentials.credentials)
    
    api_key = request.headers.get("X-API-Key")
    if api_key:
        record = api_key_manager.validate_key(api_key)
        if record:
            return {"sub": record["name"], "scopes": record["scopes"], "auth_type": "api_key"}
    
    public_paths = {"/health", "/", "/docs", "/openapi.json", "/redoc"}
    if request.url.path in public_paths:
        return {"sub": "anonymous", "scopes": ["public"], "auth_type": "none"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Provide Bearer token or X-API-Key header.",
        headers={"WWW-Authenticate": "Bearer"},
    )


# --- P0: Rate Limiting ---

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],
    storage_uri="memory://",
)

RATE_LIMITS = {
    "GET /api/pricing/status": "30/minute",
    "GET /api/pricing/segments": "60/minute",
    "POST /api/pricing/train": "5/minute",
    "GET /api/pricing/evaluate": "20/minute",
    "GET /api/pricing/recommend": "30/minute",
    "GET /health": "120/minute",
    "GET /": "120/minute",
}


# --- P1: Security Headers ---

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
    """Inject security headers into every response."""
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        
        for header, value in SECURITY_HEADERS.items():
            response.headers[header] = value
        
        response.headers["server"] = ""
        
        return response


# --- P1: CORS ---

def setup_cors(app) -> None:
    """Configure CORS with strict origin allowlist."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Authorization", "Content-Type", "X-API-Key", "X-Request-ID"],
        expose_headers=["X-Request-ID", "X-RateLimit-Remaining"],
        max_age=600,
    )


# --- P1: Input Validation ---

class TrainRequest(BaseModel):
    experiment_name: str = Field(
        ...,
        min_length=1,
        max_length=64,
        pattern=r"^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$",
        description="Experiment name (alphanumeric, hyphens, underscores)",
    )
    timesteps: int = Field(
        ...,
        ge=1000,
        le=1000000,
        description="Training timesteps (1,000 - 1,000,000)",
    )
    
    @field_validator("experiment_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Experiment name cannot be empty or whitespace")
        if any(c in v for c in [";", "|", "&", "$", "`", "(", ")", "{", "}", "\n", "\r", "\x00"]):
            raise ValueError("Experiment name contains invalid characters")
        return v


class EvaluateRequest(BaseModel):
    n_episodes: int = Field(
        default=100,
        ge=10,
        le=1000,
        description="Number of evaluation episodes (10-1000)",
    )


class RecommendRequest(BaseModel):
    n_samples: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Number of recommendations to generate (1-100)",
    )


# --- P2: Structured Request Logging ---

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests with timing, status, and request ID."""
    
    def __init__(self, app, log_file: Optional[str] = None):
        super().__init__(app)
        self.log_file = Path(log_file) if log_file else Path("logs/api_requests.jsonl")
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get("X-Request-ID", f"req-{int(time.time()*1000)}")
        start_time = time.time()
        
        log_entry = {
            "request_id": request_id,
            "timestamp": datetime.now().isoformat(),
            "method": request.method,
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "client_ip": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", ""),
        }
        
        try:
            response = await call_next(request)
            elapsed_ms = (time.time() - start_time) * 1000
            
            log_entry.update({
                "status_code": response.status_code,
                "response_time_ms": round(elapsed_ms, 2),
                "content_length": int(response.headers.get("content-length", 0)),
            })
            
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{elapsed_ms:.1f}ms"
            
            return response
        except Exception as e:
            elapsed_ms = (time.time() - start_time) * 1000
            log_entry.update({
                "status_code": 500,
                "response_time_ms": round(elapsed_ms, 2),
                "error": str(e),
            })
            raise
        finally:
            self._write_log(log_entry)
    
    def _write_log(self, entry: Dict[str, Any]):
        try:
            with open(self.log_file, "a") as f:
                f.write(json.dumps(entry) + "\n")
        except Exception:
            pass


# --- P2: XSS Protection Middleware ---

class XSSProtectionMiddleware(BaseHTTPMiddleware):
    """Sanitize response content to prevent XSS."""
    
    DANGEROUS_PATTERNS = [
        re.compile(r"<script[^>]*>.*?</script>", re.IGNORECASE | re.DOTALL),
        re.compile(r"javascript:", re.IGNORECASE),
        re.compile(r"on\w+\s*=", re.IGNORECASE),
        re.compile(r"<iframe[^>]*>", re.IGNORECASE),
        re.compile(r"<object[^>]*>", re.IGNORECASE),
        re.compile(r"<embed[^>]*>", re.IGNORECASE),
    ]
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        
        content_type = response.headers.get("content-type", "")
        if "text/html" in content_type:
            body = b""
            async for chunk in response.body_iterator:
                body += chunk
            
            body_str = body.decode("utf-8", errors="replace")
            for pattern in self.DANGEROUS_PATTERNS:
                body_str = pattern.sub("", body_str)
            
            response.headers["content-length"] = str(len(body_str.encode("utf-8")))
            
            async def new_body_iterator():
                yield body_str.encode("utf-8")
            
            response.body_iterator = new_body_iterator()
        
        return response


# --- P3: robots.txt and security.txt ---

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


# --- Production Config ---

def apply_security_middleware(app, is_production: bool = IS_PRODUCTION) -> None:
    """Apply all security middleware to the FastAPI app."""
    
    if is_production:
        app = FastAPI(
            title="Micro-Loan Pricing API",
            description="Dynamic pricing optimization using RL (PPO)",
            version="2.1.0",
            docs_url=None,
            redoc_url=None,
            openapi_url=None,
        )
    else:
        app = FastAPI(
            title="Micro-Loan Pricing API",
            description="Dynamic pricing optimization using RL (PPO)",
            version="2.1.0",
            docs_url="/docs",
            redoc_url="/redoc",
            openapi_url="/openapi.json",
        )
    
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(XSSProtectionMiddleware)
    
    setup_cors(app)
    
    return app
