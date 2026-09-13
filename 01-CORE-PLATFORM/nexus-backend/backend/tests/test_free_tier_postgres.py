"""
The free tier against a REAL Postgres. Skipped unless NEXUS_TEST_DB_URL is set.

This file exists because the two things the ledger swap was for cannot be
proven anywhere else:

  1. **The cap survives a restart.** That is the entire reason the in-memory
     ledger had to go, and no amount of in-process testing can demonstrate it —
     a fake that forgets when you tell it to forget proves nothing about a fake
     that forgets when the process dies.
  2. **The SQL is right.** `SupabaseLedger.open_job` passed `quota_credits` in
     its parameter dict but never listed the column or a `:quota_credits`
     placeholder in the INSERT. SQLAlchemy drops an unbound parameter from a
     `text()` construct silently — no warning, no error — so the column took its
     default of 0. Against 0003's `free_must_consume_quota` that made EVERY free
     generation a 500; on the paying path nothing objected at all and the
     allowance consumed was recorded as zero forever. Neither the unit tests nor
     the async fake could see it. Postgres saw it immediately.

Setup:

    createdb nexus_test
    psql nexus_test -f 05-DATABASES/supabase-migrations/migrations/0001_credits.sql
    psql nexus_test -f 05-DATABASES/supabase-migrations/migrations/0002_generation_jobs.sql
    psql nexus_test -f 05-DATABASES/supabase-migrations/migrations/0003_free_tier_quota.sql
    export NEXUS_TEST_DB_URL=postgresql+asyncpg://$(whoami)@127.0.0.1:5432/nexus_test
    python -m pytest backend/tests/test_free_tier_postgres.py -q
"""

from __future__ import annotations

import asyncio
import os
import sys
import types
import uuid
from pathlib import Path

import pytest

sys.modules.setdefault("numpy", types.ModuleType("numpy"))
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

DB_URL = os.getenv("NEXUS_TEST_DB_URL")
pytestmark = pytest.mark.skipif(
    not DB_URL, reason="NEXUS_TEST_DB_URL not set — integration test"
)

if DB_URL:
    import httpx
    from api import free_tier
    from fastapi import FastAPI
    from services.ledger_supabase import SupabaseLedger
    from services.metering import InsufficientCreditsError, JobStatus
    from services.providers.base import GenerationError, GenerationResult
    from services.tenancy import (
        FREE_TIER_MONTHLY_GENERATIONS,
        Provider,
        free_tier_grant_key,
        free_tier_tenant,
        resolve_credentials,
    )
    from sqlalchemy import text
    from sqlalchemy.ext.asyncio import create_async_engine

ENV = {"FREE_TIER_API_KEY": "free-key-for-test"}
WORKFLOW = "social_post"
PROMPT = "a ramadan menu campaign for a dubai cafe"


def _email() -> str:
    """A fresh address per test, so tests cannot inherit each other's quota."""
    return f"free-{uuid.uuid4().hex[:12]}@example.com"


@pytest.fixture
async def engine():
    eng = create_async_engine(DB_URL, pool_pre_ping=True)
    yield eng
    await eng.dispose()


@pytest.fixture
async def ledger(engine):
    return SupabaseLedger(engine)


class _FakeGemini:
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


# --------------------------------------------------------------------------
# The regression that the swap would otherwise have shipped
# --------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_free_job_satisfies_the_schema_and_records_the_quota_it_spent(ledger, engine):
    """Direct guard on the dropped `:quota_credits` placeholder.

    Before the fix this raised CheckViolationError on
    `free_must_consume_quota`, because the column silently defaulted to 0.
    """
    email = _email()
    tenant = free_tier_tenant(email)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)
    await ledger.grant_credits(
        tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=free_tier_grant_key(email)
    )

    job = await ledger.open_job(res, WORKFLOW)

    async with engine.connect() as conn:
        row = (
            await conn.execute(
                text(
                    "select payer, billable, billed_credits, quota_credits "
                    "from generation_jobs where job_id = :j"
                ),
                {"j": job.job_id},
            )
        ).first()

    payer, billable, billed, quota = row
    assert payer == "free"
    assert billable is False
    assert billed == 0, "free work must never be recorded as revenue"
    assert quota > 0, "a free job must record the allowance it consumed"
    assert quota == job.quota_credits, "the stored row must agree with the returned record"


@pytest.mark.asyncio
async def test_paying_job_also_stores_its_quota(ledger, engine):
    """The same dropped parameter silently zeroed quota_credits on the paying
    path, where no constraint objects. It would have looked fine forever."""
    from services.tenancy import Tenant, TenantMode

    tenant = Tenant(id=f"acme-{uuid.uuid4().hex[:8]}", mode=TenantMode.MANAGED)
    res = resolve_credentials(tenant, Provider.GEMINI, env={"GEMINI_API_KEY": "k"})
    await ledger.grant_credits(tenant.id, 10)
    job = await ledger.open_job(res, WORKFLOW)

    async with engine.connect() as conn:
        quota = (
            await conn.execute(
                text("select quota_credits from generation_jobs where job_id = :j"),
                {"j": job.job_id},
            )
        ).scalar()
    assert quota == job.quota_credits > 0


# --------------------------------------------------------------------------
# The cap, and the reason the ledger was swapped at all
# --------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_quota_survives_a_restart(engine):
    """THE headline test for this change.

    A second `SupabaseLedger` on a second engine stands in for the process that
    comes up after a deploy. With the in-memory ledger this user would have got
    a fresh allowance here — which is what "two per month" actually meant in
    production, and nothing about it would have looked wrong.
    """
    email = _email()
    tenant = free_tier_tenant(email)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)
    key = free_tier_grant_key(email)

    first = SupabaseLedger(engine)
    await first.grant_credits(tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=key)
    for _ in range(FREE_TIER_MONTHLY_GENERATIONS):
        job = await first.open_job(res, WORKFLOW)
        await first.close_job(job, cost_cents=0)
    assert await first.balance(tenant.id) == 0

    # ---- the process restarts ----
    restarted_engine = create_async_engine(DB_URL, pool_pre_ping=True)
    try:
        after = SupabaseLedger(restarted_engine)
        assert await after.balance(tenant.id) == 0, "the spent quota must still be spent"

        # The new process re-runs the monthly grant on the next request, exactly
        # as the endpoint does. The UNIQUE key must make it a no-op.
        await after.grant_credits(
            tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=key
        )
        assert await after.balance(tenant.id) == 0, (
            "a restart must not hand out a fresh allowance"
        )
        with pytest.raises(InsufficientCreditsError):
            await after.open_job(res, WORKFLOW)
    finally:
        await restarted_engine.dispose()


@pytest.mark.asyncio
async def test_a_new_month_grants_again(ledger):
    """The monthly reset is a string, not a cron job — so prove the string works."""
    from datetime import UTC, datetime

    email = _email()
    tenant = free_tier_tenant(email)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)

    sep = free_tier_grant_key(email, now=datetime(2026, 9, 15, tzinfo=UTC))
    oct_ = free_tier_grant_key(email, now=datetime(2026, 10, 1, tzinfo=UTC))
    assert sep != oct_

    await ledger.grant_credits(tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=sep)
    for _ in range(FREE_TIER_MONTHLY_GENERATIONS):
        await ledger.close_job(await ledger.open_job(res, WORKFLOW), cost_cents=0)
    assert await ledger.balance(tenant.id) == 0

    await ledger.grant_credits(tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=oct_)
    assert await ledger.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS


@pytest.mark.asyncio
async def test_concurrent_first_requests_grant_once_and_neither_errors(ledger):
    """Two simultaneous first requests from one new user.

    The original `select ... then insert` lost this race on the first attempt:
    both callers saw no row, both inserted, and the UNIQUE index turned the
    loser into an unhandled IntegrityError — a 500 for a user whose only mistake
    was double-clicking. The balance was right; the response was not.
    """
    email = _email()
    tenant = free_tier_tenant(email)
    key = free_tier_grant_key(email)

    results = await asyncio.gather(
        *(
            ledger.grant_credits(tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=key)
            for _ in range(4)
        ),
        return_exceptions=True,
    )
    errors = [r for r in results if isinstance(r, BaseException)]
    assert not errors, f"a replayed grant must be a no-op, not an error: {errors}"
    assert await ledger.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS


@pytest.mark.asyncio
async def test_failed_job_returns_the_attempt_durably(ledger):
    email = _email()
    tenant = free_tier_tenant(email)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)
    await ledger.grant_credits(
        tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=free_tier_grant_key(email)
    )

    job = await ledger.open_job(res, WORKFLOW)
    assert await ledger.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS - 1
    await ledger.close_job(job, cost_cents=0, status=JobStatus.FAILED, error="provider 503")
    assert await ledger.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS


# --------------------------------------------------------------------------
# End to end, through the actual HTTP endpoint, on the actual database
# --------------------------------------------------------------------------

@pytest.fixture
async def api(engine, monkeypatch):
    """The real router over the real ledger. httpx/ASGI rather than TestClient
    so the engine and the requests share one event loop."""
    monkeypatch.setenv("FREE_TIER_API_KEY", "free-key-for-test")
    free_tier._ledger = SupabaseLedger(engine)
    free_tier.generate_and_bill.__globals__["ADAPTERS"][Provider.GEMINI] = _FakeGemini
    app = FastAPI()
    app.include_router(free_tier.router)
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://t") as c:
        yield c
    free_tier._ledger = None


@pytest.mark.asyncio
async def test_endpoint_caps_at_the_allowance_on_real_postgres(api):
    """The same three-requests-for-a-two-request-quota shape that caught the
    unlimited bug, now against the database that will actually serve it."""
    email = _email()
    body = {"email": email, "prompt": PROMPT}

    for i in range(FREE_TIER_MONTHLY_GENERATIONS):
        r = await api.post("/api/free/generate", json=body)
        assert r.status_code == 200, r.text
        assert r.json()["remaining_this_month"] == FREE_TIER_MONTHLY_GENERATIONS - 1 - i

    for _ in range(2):
        r = await api.post("/api/free/generate", json=body)
        assert r.status_code == 402, "the free tier must stay exhausted, not refill"
        assert r.json()["detail"]["error"] == "monthly_free_quota_exhausted"


@pytest.mark.asyncio
async def test_endpoint_quota_lookup_does_not_grant(api):
    email = _email()
    r = await api.get("/api/free/quota", params={"email": email})
    assert r.status_code == 200
    assert r.json()["remaining_this_month"] == 0, "checking a balance must not create one"

    await api.post("/api/free/generate", json={"email": email, "prompt": PROMPT})
    r = await api.get("/api/free/quota", params={"email": email})
    assert r.json()["remaining_this_month"] == FREE_TIER_MONTHLY_GENERATIONS - 1


@pytest.mark.asyncio
async def test_endpoint_refunds_a_provider_failure_on_real_postgres(api):
    email = _email()
    body = {"email": email, "prompt": PROMPT}
    free_tier.generate_and_bill.__globals__["ADAPTERS"][Provider.GEMINI] = _FailingGemini
    assert (await api.post("/api/free/generate", json=body)).status_code == 502

    free_tier.generate_and_bill.__globals__["ADAPTERS"][Provider.GEMINI] = _FakeGemini
    ok = await api.post("/api/free/generate", json=body)
    assert ok.status_code == 200
    assert ok.json()["remaining_this_month"] == FREE_TIER_MONTHLY_GENERATIONS - 1, (
        "a provider failure must not cost the user an attempt"
    )


@pytest.mark.asyncio
async def test_free_traffic_never_becomes_revenue(api, ledger):
    """`margin_report` reads billed_credits. Free work must move the quota and
    leave revenue untouched."""
    before = (await ledger.margin_report())["revenue_cents"]
    await api.post("/api/free/generate", json={"email": _email(), "prompt": PROMPT})
    assert (await ledger.margin_report())["revenue_cents"] == before


# --------------------------------------------------------------------------
# The rollover cap (owner decision 2026-09-13)
# --------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_idle_months_refresh_the_allowance_instead_of_stacking(ledger):
    """A year of not using the product must leave 2 waiting, not 24."""
    email = _email()
    tenant = free_tier_tenant(email)
    for month in range(1, 13):
        await ledger.top_up_to(
            tenant.id,
            FREE_TIER_MONTHLY_GENERATIONS,
            reason="free_monthly",
            idempotency_key=f"free:{email}:2026-{month:02d}",
        )
    assert await ledger.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS


@pytest.mark.asyncio
async def test_a_partly_spent_allowance_is_topped_back_up_not_doubled(ledger):
    """Spend one in September; October must restore to the cap, not add a full
    allowance on top of the leftover."""
    email = _email()
    tenant = free_tier_tenant(email)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)

    await ledger.top_up_to(
        tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=f"free:{email}:2026-09"
    )
    await ledger.close_job(await ledger.open_job(res, WORKFLOW), cost_cents=0)
    assert await ledger.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS - 1

    await ledger.top_up_to(
        tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=f"free:{email}:2026-10"
    )
    assert await ledger.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS


@pytest.mark.asyncio
async def test_a_zero_top_up_still_consumes_the_month_key(ledger):
    """The trap. If "nothing to add" skips the write, the month's key is never
    claimed and the month re-opens the moment the balance is spent — two
    allowances in one month from code that looks correct at every step."""
    email = _email()
    tenant = free_tier_tenant(email)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)
    key = f"free:{email}:2026-09"

    # Starts the month already full.
    await ledger.grant_credits(tenant.id, FREE_TIER_MONTHLY_GENERATIONS)
    assert await ledger.top_up_to(tenant.id, FREE_TIER_MONTHLY_GENERATIONS,
                                  idempotency_key=key) == FREE_TIER_MONTHLY_GENERATIONS

    for _ in range(FREE_TIER_MONTHLY_GENERATIONS):
        await ledger.close_job(await ledger.open_job(res, WORKFLOW), cost_cents=0)
    assert await ledger.balance(tenant.id) == 0

    # Same month, same key: must add nothing.
    await ledger.top_up_to(tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=key)
    assert await ledger.balance(tenant.id) == 0, "the month's key was already spent"
    with pytest.raises(InsufficientCreditsError):
        await ledger.open_job(res, WORKFLOW)


@pytest.mark.asyncio
async def test_top_up_never_reduces_a_larger_balance(ledger):
    """A promotional or support grant above the cap must survive the monthly
    top-up. "Cap the rollover" means stop accruing, not claw back."""
    email = _email()
    tenant = free_tier_tenant(email)
    await ledger.grant_credits(tenant.id, 10, reason="support_credit")
    await ledger.top_up_to(
        tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=f"free:{email}:2026-09"
    )
    assert await ledger.balance(tenant.id) == 10


@pytest.mark.asyncio
async def test_concurrent_top_ups_apply_once(ledger):
    """Four simultaneous first requests. The FOR UPDATE row lock plus the
    UNIQUE key must leave exactly one allowance and zero errors."""
    email = _email()
    tenant = free_tier_tenant(email)
    key = f"free:{email}:2026-09"
    results = await asyncio.gather(
        *(
            ledger.top_up_to(tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=key)
            for _ in range(4)
        ),
        return_exceptions=True,
    )
    errors = [r for r in results if isinstance(r, BaseException)]
    assert not errors, f"concurrent top-ups must not error: {errors}"
    assert await ledger.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS


@pytest.mark.asyncio
async def test_endpoint_gives_two_a_month_across_a_month_boundary(api, ledger):
    """End to end: the cap holds through a simulated month rollover."""
    email = _email()
    tenant = free_tier_tenant(email)
    body = {"email": email, "prompt": PROMPT}

    for _ in range(FREE_TIER_MONTHLY_GENERATIONS):
        assert (await api.post("/api/free/generate", json=body)).status_code == 200
    assert (await api.post("/api/free/generate", json=body)).status_code == 402

    # Next month arrives: the endpoint would use a new key, so do the same.
    await ledger.top_up_to(
        tenant.id, FREE_TIER_MONTHLY_GENERATIONS, idempotency_key=f"free:{email}:2099-01"
    )
    assert await ledger.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS, (
        "a new month restores exactly the allowance"
    )
