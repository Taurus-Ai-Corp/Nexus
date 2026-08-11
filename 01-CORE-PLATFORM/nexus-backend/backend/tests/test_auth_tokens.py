"""Tests for the auth-function-shadowing fix (`backend/auth.py`).

Covers:
  - `create_access_token` sets the `type` claim and honours
    `ACCESS_TOKEN_EXPIRE_MINUTES` (default and env-var override).
  - The `AUTH_ACCEPT_LEGACY_TOKENS` deprecation window: a type-less token is
    accepted when the flag is on, rejected (401) when it is off, and a
    present-but-wrong `type` is always rejected regardless of the flag.
  - The `jwt.JWTError` -> `jwt.PyJWTError` regression fix: malformed tokens
    and tokens signed with the wrong secret must 401, not 500/AttributeError.
  - All 401s carry `WWW-Authenticate: Bearer`.
  - `hash_password` / `verify_password` round-trip.

Run:  python -m pytest backend/tests/test_auth_tokens.py -q
"""

from __future__ import annotations

import importlib
import logging
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

import jwt
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# auth.py raises RuntimeError at import time if JWT_SECRET_KEY is unset, so
# this must be set before the first `import auth`. 64 bytes to avoid PyJWT's
# InsecureKeyLengthWarning noise.
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-auth-tests-only-" + "x" * 32)

import auth  # noqa: E402
from fastapi import HTTPException  # noqa: E402
from fastapi.security import HTTPAuthorizationCredentials  # noqa: E402


def _creds(token: str) -> HTTPAuthorizationCredentials:
    return HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)


def _raw_token(payload: dict, secret: str | None = None, algorithm: str | None = None) -> str:
    """Build a JWT bypassing create_access_token, so we control every claim
    (e.g. to simulate a pre-fix token that has no `type` claim)."""
    return jwt.encode(payload, secret or auth.SECRET_KEY, algorithm=algorithm or auth.ALGORITHM)


# ---------------------------------------------------------------------------
# create_access_token: type claim + expiry (default and env override)
# ---------------------------------------------------------------------------


def test_create_access_token_sets_type_claim():
    token, _expire = auth.create_access_token({"sub": "user-1"})
    payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
    assert payload["type"] == "access_token"
    assert payload["sub"] == "user-1"


def test_create_access_token_honours_default_expiry_minutes(monkeypatch):
    monkeypatch.delenv("ACCESS_TOKEN_EXPIRE_MINUTES", raising=False)
    importlib.reload(auth)
    try:
        assert auth.ACCESS_TOKEN_EXPIRE_MINUTES == 15, (
            "in-code default must stay 15 per design doc §4.3 — the ramp is deploy config"
        )
        _token, expire = auth.create_access_token({"sub": "user-1"})
        delta = expire - datetime.utcnow()
        assert timedelta(minutes=14) < delta <= timedelta(minutes=15)
    finally:
        importlib.reload(auth)


def test_create_access_token_honours_env_override_expiry_minutes(monkeypatch):
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120")
    importlib.reload(auth)
    try:
        assert auth.ACCESS_TOKEN_EXPIRE_MINUTES == 120
        _token, expire = auth.create_access_token({"sub": "user-1"})
        delta = expire - datetime.utcnow()
        assert timedelta(minutes=119) < delta <= timedelta(minutes=120)
    finally:
        monkeypatch.delenv("ACCESS_TOKEN_EXPIRE_MINUTES", raising=False)
        importlib.reload(auth)


# ---------------------------------------------------------------------------
# Deprecation window: AUTH_ACCEPT_LEGACY_TOKENS
# ---------------------------------------------------------------------------


def test_verify_token_accepts_legacy_token_when_flag_on(monkeypatch):
    monkeypatch.setattr(auth, "AUTH_ACCEPT_LEGACY_TOKENS", True)
    legacy_token = _raw_token(
        {"sub": "user-legacy", "exp": datetime.utcnow() + timedelta(hours=1)}
    )
    user_id = auth.verify_token(_creds(legacy_token))
    assert user_id == "user-legacy"


def test_verify_token_rejects_legacy_token_when_flag_off(monkeypatch):
    """This is the test that proves the deprecation window can actually be
    closed (design doc §4.4 step 4)."""
    monkeypatch.setattr(auth, "AUTH_ACCEPT_LEGACY_TOKENS", False)
    legacy_token = _raw_token(
        {"sub": "user-legacy", "exp": datetime.utcnow() + timedelta(hours=1)}
    )
    with pytest.raises(HTTPException) as exc_info:
        auth.verify_token(_creds(legacy_token))
    assert exc_info.value.status_code == 401
    assert exc_info.value.headers.get("WWW-Authenticate") == "Bearer"


@pytest.mark.parametrize("flag", [True, False])
def test_verify_token_rejects_wrong_type_regardless_of_flag(monkeypatch, flag):
    monkeypatch.setattr(auth, "AUTH_ACCEPT_LEGACY_TOKENS", flag)
    wrong_type_token = _raw_token(
        {
            "sub": "user-1",
            "type": "refresh",
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
    )
    with pytest.raises(HTTPException) as exc_info:
        auth.verify_token(_creds(wrong_type_token))
    assert exc_info.value.status_code == 401
    assert exc_info.value.headers.get("WWW-Authenticate") == "Bearer"


def test_legacy_token_acceptance_is_logged(monkeypatch, caplog):
    monkeypatch.setattr(auth, "AUTH_ACCEPT_LEGACY_TOKENS", True)
    legacy_token = _raw_token(
        {"sub": "user-legacy", "exp": datetime.utcnow() + timedelta(hours=1)}
    )
    with caplog.at_level(logging.INFO, logger="auth"):
        auth.verify_token(_creds(legacy_token))
    matching = [r for r in caplog.records if "legacy token accepted" in r.message]
    assert len(matching) == 1
    assert "user-legacy" in matching[0].message
    # No credential/token VALUE may be logged (only sub/exp).
    assert legacy_token not in matching[0].message


def test_new_token_does_not_trigger_legacy_log(monkeypatch, caplog):
    monkeypatch.setattr(auth, "AUTH_ACCEPT_LEGACY_TOKENS", True)
    token, _expire = auth.create_access_token({"sub": "user-new"})
    with caplog.at_level(logging.INFO, logger="auth"):
        auth.verify_token(_creds(token))
    matching = [r for r in caplog.records if "legacy token accepted" in r.message]
    assert matching == [], "a token with a type claim must never hit the legacy log path"


# ---------------------------------------------------------------------------
# jwt.JWTError -> jwt.PyJWTError regression (would 500 on the unfixed code)
# ---------------------------------------------------------------------------


def test_verify_token_expired_returns_401_not_500():
    expired_token = auth.create_access_token(
        {"sub": "user-1"}, expires_delta=timedelta(minutes=-5)
    )[0]
    with pytest.raises(HTTPException) as exc_info:
        auth.verify_token(_creds(expired_token))
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Token has expired"
    assert exc_info.value.headers.get("WWW-Authenticate") == "Bearer"


def test_verify_token_malformed_token_returns_401_not_500():
    """Regression test for the `jwt.JWTError` bug (auth.py:117 pre-fix).
    PyJWT 2.13.0 has no `JWTError` attribute; the buggy code raised
    AttributeError while handling this, turning a 401 into a 500. Confirmed
    to fail against the unfixed code by temporarily reverting
    `except jwt.PyJWTError` back to `except jwt.JWTError` and re-running
    this test — see the implementation report for the transcript."""
    garbage = "not.a.real-jwt-token-at-all"
    with pytest.raises(HTTPException) as exc_info:
        auth.verify_token(_creds(garbage))
    assert exc_info.value.status_code == 401
    assert exc_info.value.headers.get("WWW-Authenticate") == "Bearer"


def test_verify_token_wrong_secret_returns_401_not_500():
    """Same regression as above, via a token signed with a different secret
    (bad-signature path, not just malformed-structure)."""
    wrong_secret_token = _raw_token(
        {"sub": "user-1", "type": "access_token", "exp": datetime.utcnow() + timedelta(hours=1)},
        secret="a-completely-different-secret-" + "y" * 32,
    )
    with pytest.raises(HTTPException) as exc_info:
        auth.verify_token(_creds(wrong_secret_token))
    assert exc_info.value.status_code == 401
    assert exc_info.value.headers.get("WWW-Authenticate") == "Bearer"


# ---------------------------------------------------------------------------
# /ws shares the same verifier (verify_token_string) — no silent divergence
# ---------------------------------------------------------------------------


def test_verify_token_string_shares_type_rule_with_verify_token(monkeypatch):
    """main.py's /ws handler calls auth.verify_token_string() instead of
    decoding the token itself, so it must enforce the exact same type-claim
    rule as verify_token (design doc §2.5 / §3 item 4)."""
    monkeypatch.setattr(auth, "AUTH_ACCEPT_LEGACY_TOKENS", False)
    legacy_token = _raw_token(
        {"sub": "user-legacy", "exp": datetime.utcnow() + timedelta(hours=1)}
    )
    with pytest.raises(HTTPException) as exc_info:
        auth.verify_token_string(legacy_token)
    assert exc_info.value.status_code == 401

    monkeypatch.setattr(auth, "AUTH_ACCEPT_LEGACY_TOKENS", True)
    assert auth.verify_token_string(legacy_token) == "user-legacy"


# ---------------------------------------------------------------------------
# hash_password / verify_password
# ---------------------------------------------------------------------------


def test_hash_password_verify_password_round_trip():
    hashed = auth.hash_password("correct horse battery staple")
    assert auth.verify_password("correct horse battery staple", hashed) is True


def test_verify_password_rejects_wrong_password():
    hashed = auth.hash_password("correct horse battery staple")
    assert auth.verify_password("wrong password", hashed) is False
