"""
POST /api/free/generate — the free tier's front door.

The endpoint tests exist separately from test_free_tier.py because the counting
rules and the door fail in different ways. The rules were correct here while the
door still handed out unlimited generations: `_ensure_monthly_grant` guarded on
`balance <= 0`, so the moment an allowance was spent it granted a fresh one. Two
generations, then two more, forever — and every individual response looked right.

It was caught by asking for THREE generations instead of two. Any test that
stopped at the quota would have passed.

Every test here drives the endpoint through an ASYNC ledger, because that is
what production now uses (`SupabaseLedger`) and because the failure mode is
silent: a forgotten `await` on an async method yields a coroutine object, which
is truthy and is not an int. `remaining_this_month` would then be garbage and a
`balance()` comparison would never raise — it would just stop capping. Driving
a synchronous fake here would have tested a ledger nothing in production uses.

The SQL itself is covered by tests/test_free_tier_postgres.py against a real
Postgres, which is where the `quota_credits` and idempotency behaviour can
actually be proven.
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
from services.metering import Ledger  # noqa: E402
from services.providers.base import GenerationError, GenerationResult  # noqa: E402
from services.tenancy import FREE_TIER_MONTHLY_GENERATIONS, Provider  # noqa: E402

PROMPT = "a ramadan menu campaign for a dubai cafe"


class _AsyncLedger:
    """Async stand-in for SupabaseLedger, over the real in-memory Ledger.

    Only two things are faked: the coroutine interface, and the idempotency key
    that Postgres enforces with a UNIQUE index. Everything else — the decrement,
    the refund, the quota/billing split — is the real `metering.Ledger`, so
    these tests cannot pass by virtue of an agreeable mock.
    """

    def __init__(self) -> None:
        self._inner = Ledger()
        self._keys: set[str] = set()

    async def balance(self, tenant_id: str) -> int:
        return self._inner.balance(tenant_id)

    async def grant_credits(
        self,
        tenant_id: str,
        credits: int,
        *,
        reason: str = "manual_grant",
        idempotency_key: str | None = None,
    ) -> int:
        # Mirrors the UNIQUE index: a replayed key adds nothing and does not error.
        if idempotency_key is not None:
            if idempotency_key in self._keys:
                return self._inner.balance(tenant_id)
            self._keys.add(idempotency_key)
        return self._inner.grant_credits(tenant_id, credits)

    async def open_job(self, resolution, workflow):  # noqa: ANN001
        return self._inner.open_job(resolution, workflow)

    async def close_job(self, job, **kw):  # noqa: ANN001
        return self._inner.close_job(job, **kw)


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

    `free_tier._ledger` is a process-global cache, so without resetting it the
    second test in a file inherits the first one's spent quota and fails for the
    wrong reason.
    """
    monkeypatch.setenv("FREE_TIER_API_KEY", "free-key-for-test")
    free_tier._ledger = _AsyncLedger()
    free_tier.generate_and_bill.__globals__["ADAPTERS"][Provider.GEMINI] = _FakeGemini
    app = FastAPI()
    app.include_router(free_tier.router)
    yield TestClient(app)
    free_tier._ledger = None


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


def test_remaining_is_an_integer_not_a_coroutine(client):
    """Guards the specific way an un-awaited async ledger fails.

    `remaining_this_month = ledger.balance(...)` without `await` yields a
    coroutine: truthy, never equal to any int, and silently non-decreasing. The
    response model would reject it here — which is the point of asserting it
    rather than trusting that it would have been noticed.
    """
    body = _generate(client).json()
    assert isinstance(body["remaining_this_month"], int)
    assert body["remaining_this_month"] == FREE_TIER_MONTHLY_GENERATIONS - 1


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
    free_tier._ledger = _AsyncLedger()
    app = FastAPI()
    app.include_router(free_tier.router)
    r = TestClient(app).post("/api/free/generate", json={"email": "x@y.com", "prompt": PROMPT})
    assert r.status_code == 503
    assert "PLATFORM-KEY-DO-NOT-SPEND" not in r.text
    free_tier._ledger = None


def test_missing_database_url_disables_the_tier_rather_than_forgetting(monkeypatch):
    """No DATABASE_URL must be a 503, NOT a silent fall back to a process-local
    ledger.

    An in-memory fallback is the failure this whole swap exists to remove: it
    works perfectly in every test and in local development, and in production it
    resets every user's allowance on every deploy while reporting success.
    """
    monkeypatch.setenv("FREE_TIER_API_KEY", "free-key-for-test")
    monkeypatch.delenv("DATABASE_URL", raising=False)
    free_tier._ledger = None
    app = FastAPI()
    app.include_router(free_tier.router)
    c = TestClient(app)

    r = c.post("/api/free/generate", json={"email": "x@y.com", "prompt": PROMPT})
    assert r.status_code == 503
    assert c.get("/api/free/quota", params={"email": "x@y.com"}).status_code == 503


def test_database_url_errors_never_leak_the_connection_string(monkeypatch):
    """A password in DATABASE_URL must not reach the client via an error body."""
    monkeypatch.setenv("FREE_TIER_API_KEY", "free-key-for-test")
    monkeypatch.setenv(
        "DATABASE_URL", "postgresql://u:SUPER-SECRET-PW@nonexistent.invalid:5432/db"
    )
    free_tier._ledger = None
    app = FastAPI()
    app.include_router(free_tier.router)
    r = TestClient(app).post(
        "/api/free/generate", json={"email": "x@y.com", "prompt": PROMPT}
    )
    assert r.status_code == 503
    assert "SUPER-SECRET-PW" not in r.text
    free_tier._ledger = None


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("postgresql://u:p@h:5432/d", "postgresql+asyncpg://u:p@h:5432/d"),
        ("postgres://u:p@h:5432/d", "postgresql+asyncpg://u:p@h:5432/d"),
        # Already-qualified URLs are left exactly alone, including other drivers.
        ("postgresql+asyncpg://u:p@h/d", "postgresql+asyncpg://u:p@h/d"),
        ("postgresql+psycopg://u:p@h/d", "postgresql+psycopg://u:p@h/d"),
    ],
)
def test_supabase_style_urls_are_normalised_to_an_async_driver(raw, expected):
    """Supabase's dashboard hands out `postgresql://`, which create_async_engine
    rejects. Without this the tier 503s at the first request with a message that
    points nowhere useful."""
    assert free_tier._async_db_url(raw) == expected


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


# --------------------------------------------------------------------------
# The grant itself
# --------------------------------------------------------------------------

def test_grant_is_issued_once_per_month_with_the_month_in_the_key(client):
    """The monthly reset is this key and nothing else — no cron, no scheduler.

    Asserting the key's shape matters because the UNIQUE index is what enforces
    the cap: a key without the month would grant once and never again, and a key
    without the email would grant once for everybody.
    """
    for _ in range(FREE_TIER_MONTHLY_GENERATIONS + 1):
        _generate(client, email="bob@example.com")

    keys = free_tier._ledger._keys
    assert len(keys) == 1, "one grant per email per month, however many requests"
    key = next(iter(keys))
    assert key.startswith("free:bob@example.com:")
    assert len(key.rsplit(":", 1)[1]) == 7, "key must carry YYYY-MM"
