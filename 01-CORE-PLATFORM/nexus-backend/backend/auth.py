#!/usr/bin/env python3
"""
TAURUS AI CORP - Authentication and Authorization
JWT-based authentication with multi-tenant support
"""

import jwt
import bcrypt
import hashlib
import hmac
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        'JWT_SECRET_KEY environment variable is required. Generate with: python -c "import secrets; print(secrets.token_urlsafe(64))"'
    )
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer()


def verify_telegram_auth(auth_data: Dict[str, Any], bot_token: str) -> bool:
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


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> tuple:
    """Create JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "iat": datetime.utcnow(), "type": "access_token"})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Verify JWT token and return user ID"""
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM]
        )

        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Check token type
        token_type = payload.get("type")
        if token_type != "access_token":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
