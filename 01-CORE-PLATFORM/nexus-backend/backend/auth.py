#!/usr/bin/env python3
"""
TAURUS AI CORP - Authentication and Authorization
JWT-based authentication with multi-tenant support
"""

import hashlib
import hmac
import logging
import os
from datetime import datetime, timedelta
from typing import Any

import bcrypt
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

logger = logging.getLogger(__name__)

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY environment variable is required. Generate with: "
        'python -c "import secrets; print(secrets.token_urlsafe(64))"'
    )
ALGORITHM = "HS256"
# Canonical default is 15 minutes. Overridable by env var so the expiry ramp
# (design doc §4.3, Phase 1/2/3) is deploy config, not a code change — the
# in-code default stays 15 and is only ever changed by an env var override.
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Deprecation-window flag (design doc §4.1). Default true for the initial
# cutover so tokens issued before this fix (24h expiry, no `type` claim)
# keep working until they drain naturally; must be flipped to false (design
# doc §4.4) once the "legacy token accepted" log line has stopped appearing.
AUTH_ACCEPT_LEGACY_TOKENS = os.getenv("AUTH_ACCEPT_LEGACY_TOKENS", "true").strip().lower() in (
    "1",
    "true",
    "yes",
    "on",
)

security = HTTPBearer()


def verify_telegram_auth(auth_data: dict[str, Any], bot_token: str) -> bool:
    """
    Verifies the data received from the Telegram Login Widget.
    Implementation of: https://core.telegram.org/widgets/login#checking-authorization
    """
    try:
        if "hash" not in auth_data:
            return False

        check_hash = auth_data.pop("hash")

        # Data-check-string: alphabetically sorted key=value pairs joined by \n
        data_check_list = []
        for key, value in sorted(auth_data.items()):
            if value is not None:
                data_check_list.append(f"{key}={value}")

        data_check_string = "\n".join(data_check_list)

        # secret_key = SHA256(<bot_token>)
        secret_key = hashlib.sha256(bot_token.encode()).digest()

        # hmac_hash = hex(HMAC_SHA256(data_check_string, secret_key))
        hmac_hash = hmac.new(
            secret_key, data_check_string.encode(), hashlib.sha256
        ).hexdigest()

        # Security check: matches hash and recent auth (within 24 hours)
        if hmac_hash == check_hash:
            # Check if auth_date is within 24 hours to prevent replay attacks
            auth_date = int(auth_data.get("auth_date", 0))
            if (datetime.utcnow().timestamp() - auth_date) < 86400:
                return True

        return False
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> tuple:
    """Create JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "iat": datetime.utcnow(), "type": "access_token"})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire


def _decode_and_check_token(token: str) -> str:
    """Core JWT validation shared by every auth entrypoint (HTTP and
    WebSocket). Decodes `token`, validates `sub` and the `type` claim
    (honouring the `AUTH_ACCEPT_LEGACY_TOKENS` deprecation window per design
    doc §4.1/§4.2), and returns the user ID. Raises HTTPException(401) with
    a `WWW-Authenticate: Bearer` header on any failure.

    Both `verify_token` (the FastAPI dependency used by the 9 REST
    endpoints) and `verify_token_string` (used by the `/ws` WebSocket
    handler) call this so the two paths cannot silently diverge again.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Check token type. A PRESENT-but-wrong type is always rejected,
        # regardless of the legacy flag. An ABSENT claim (tokens issued
        # before this claim existed) is only grandfathered in while
        # AUTH_ACCEPT_LEGACY_TOKENS is true — this is the deprecation
        # window described in design doc §4.1.
        token_type = payload.get("type")
        if token_type is None:
            if not AUTH_ACCEPT_LEGACY_TOKENS:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid token type",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            # Legacy path taken — log sub/exp only, never the token value
            # or any credential material (design doc §4.2).
            logger.info(
                "legacy token accepted (no type claim) for sub=%s exp=%s",
                user_id,
                payload.get("exp"),
            )
        elif token_type != "access_token":  # noqa: S105
            raise HTTPException(
                status_code=401,
                detail="Invalid token type",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id

    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=401,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    except jwt.PyJWTError as exc:
        # PyJWT 2.13.0 has no `JWTError` attribute (that name is
        # python-jose's) — using it here would raise AttributeError while
        # handling a JWT error, turning a 401 into an unhandled 500.
        # jwt.PyJWTError is the correct base class for "any other invalid
        # token" (bad signature, malformed, wrong algorithm, garbage input).
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Verify JWT token (FastAPI dependency) and return user ID"""
    return _decode_and_check_token(credentials.credentials)


def verify_token_string(token: str) -> str:
    """Verify a raw JWT string and return the user ID.

    For non-HTTP callers that cannot use the `Depends(verify_token)`
    pattern — currently the `/ws` WebSocket handler in main.py, which reads
    the token from a query parameter instead of an Authorization header.
    Shares `_decode_and_check_token` with `verify_token` so `/ws` enforces
    the exact same type-claim and legacy-window rules as the 9 REST
    endpoints (design doc §2.5 / §3 item 4) instead of silently diverging.

    Raises the same HTTPException(401, headers={"WWW-Authenticate":
    "Bearer"}) as `verify_token` on failure. Callers outside an HTTP
    request/response cycle (e.g. a WebSocket handler) must catch it
    themselves and translate it into their own close/error semantics.
    """
    return _decode_and_check_token(token)


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
