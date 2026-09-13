"""
POST /api/free/generate — the free tier's front door.

The endpoint tests exist separately from test_free_tier.py because the counting
rules and the door fail in different ways. The rules were correct here while the
door still handed out unlimited generations: `_ensure_monthly_grant` guarded on
`balance <= 0`, so the moment an allowance was spent it granted a fresh one. Two
generations, then two more, forever — and every individual response looked right.

It was caught by asking for THREE generations instead of two. Any test that
stopped at the quota would have passed.
"""

from __future__ import annotations

import sys
import types
from pathlib import Path

import pytest

sys.modules.setdefault("numpy", types.ModuleType("numpy"))
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from api import free_tier  # noqa: E402
from fastapi import FastAPI  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from services.providers.base import GenerationError, GenerationResult  # noqa: E402
from services.tenancy import FREE_TIER_MONTHLY_GENERATIONS, Provider  # noqa: E402

PROMPT = "a ramadan menu campaign for a dubai cafe"


class _FakeGemini:
    """Never touches the network, so these tests never spend real free quota."""

    def __init__(self, *a, **k) -> None:
        pass

    async def generate(self, request, credential, **kw):  # noqa: ANN001
        return GenerationResult(
            provider=Provider.GEMINI, output_url=None, output_text=f"[ok] {request.prompt[:30]}"
        )


class _FailingGemini:
    def __init__(self, *a, **k) -> None:
        pass

    async def generate(self, request, credential, **kw):  # noqa: ANN001
        raise GenerationError("provider returned 503")


@pytest.fixture
def client(monkeypatch):
    """A fresh app AND a fresh ledger per test.

    The module-level ledger and grant-key set are process-global, so without
    resetting them the second test in a file inherits the first one's spent
    quota and fails for the wrong reason.
    """
    monkeypatch.setenv("FREE_TIER_API_KEY", "free-key-for-test")
    free_tier._ledger = type(free_tier._ledger)()
    free_tier._granted_keys = set()
    free_tier.generate_and_bill.__globals__["ADAPTERS"][Provider.GEMINI] = _FakeGemini
    app = FastAPI()
    app.include_router(free_tier.router)
    return TestClient(app)


def _generate(c, email=" Bob@Example.com ", prompt=PROMPT):
    return c.post("/api/free/generate", json={"email": email.strip(), "prompt": prompt})


# --------------------------------------------------------------------------
# The cap — the test that caught the unlimited bug
# --------------------------------------------------------------------------

def test_quota_stays_exhausted_and_does_not_refill(client):
    """Deliberately asks for one MORE than the allowance twice over.

    Stopping at the quota would have passed against the broken version, because
    the re-grant only became visible on the call after the allowance ran out.
    """
    for i in range(FREE_TIER_MONTHLY_GENERATIONS):
        r = _generate(client)
        assert r.status_code == 200, r.text
        assert r.json()["remaining_this_month"] == FREE_TIER_MONTHLY_GENERATIONS - 1 - i

    for _ in range(2):  # twice: a re-grant would only show on the second
        r = _generate(client)
        assert r.status_code == 402, "the free tier must stay exhausted, not refill"
        assert r.json()["detail"]["error"] == "monthly_free_quota_exhausted"


def test_each_email_has_its_own_quota(client):
    for _ in range(FREE_TIER_MONTHLY_GENERATIONS):
        _generate(client, email="bob@example.com")
    assert _generate(client, email="bob@example.com").status_code == 402
    assert _generate(client, email="alice@example.com").status_code == 200


def test_email_case_and_whitespace_do_not_buy_a_second_quota(client):
    for _ in range(FREE_TIER_MONTHLY_GENERATIONS):
        _generate(client, email="bob@example.com")
    # Same person, different spelling — must NOT get a fresh allowance.
    assert client.post(
        "/api/free/generate", json={"email": "BOB@Example.COM", "prompt": PROMPT}
    ).status_code == 402


# --------------------------------------------------------------------------
# Failure must not cost the user an attempt
# --------------------------------------------------------------------------

def test_provider_failure_refunds_the_attempt(client):
    free_tier.generate_and_bill.__globals__["ADAPTERS"][Provider.GEMINI] = _FailingGemini
    r = _generate(client)
    assert r.status_code == 502

    free_tier.generate_and_bill.__globals__["ADAPTERS"][Provider.GEMINI] = _FakeGemini
    ok = _generate(client)
    assert ok.status_code == 200
    assert ok.json()["remaining_this_month"] == FREE_TIER_MONTHLY_GENERATIONS - 1, (
        "the failed attempt must not have been charged against the allowance"
    )


# --------------------------------------------------------------------------
# Configuration and input
# --------------------------------------------------------------------------

def test_missing_free_key_is_503_and_never_falls_back(monkeypatch):
    """Absent FREE_TIER_API_KEY must disable the tier, not quietly bill the
    company by reaching for the platform key."""
    monkeypatch.delenv("FREE_TIER_API_KEY", raising=False)
    monkeypatch.setenv("GEMINI_API_KEY", "PLATFORM-KEY-DO-NOT-SPEND")
    free_tier._ledger = type(free_tier._ledger)()
    free_tier._granted_keys = set()
    app = FastAPI()
    app.include_router(free_tier.router)
    r = TestClient(app).post("/api/free/generate", json={"email": "x@y.com", "prompt": PROMPT})
    assert r.status_code == 503
    assert "PLATFORM-KEY-DO-NOT-SPEND" not in r.text


@pytest.mark.parametrize("bad", ["notanemail", "", "@", "a b@c"])
def test_invalid_email_is_rejected_before_any_work(client, bad):
    r = client.post("/api/free/generate", json={"email": bad, "prompt": PROMPT})
    assert r.status_code == 422


def test_prompt_length_is_bounded(client):
    assert client.post(
        "/api/free/generate", json={"email": "a@b.com", "prompt": "x"}
    ).status_code == 422
    assert client.post(
        "/api/free/generate", json={"email": "a@b.com", "prompt": "x" * 5000}
    ).status_code == 422


# --------------------------------------------------------------------------
# The quota endpoint
# --------------------------------------------------------------------------

def test_quota_endpoint_reports_without_granting(client):
    """Checking your balance must not create one, or a poller gets free credits."""
    before = client.get("/api/free/quota", params={"email": "new@example.com"})
    assert before.json()["remaining_this_month"] == 0
    assert before.json()["monthly_allowance"] == FREE_TIER_MONTHLY_GENERATIONS
    assert _generate(client, email="new@example.com").status_code == 200
    after = client.get("/api/free/quota", params={"email": "new@example.com"})
    assert after.json()["remaining_this_month"] == FREE_TIER_MONTHLY_GENERATIONS - 1


def test_successful_response_carries_the_generated_text(client):
    body = _generate(client).json()
    assert body["text"].startswith("[ok]")
    assert body["monthly_allowance"] == FREE_TIER_MONTHLY_GENERATIONS
