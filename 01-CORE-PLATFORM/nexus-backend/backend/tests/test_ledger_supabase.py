"""Integration tests for SupabaseLedger against a real Postgres.

Skipped unless NEXUS_TEST_DB_URL is set, because atomicity cannot be proven
against a mock — the whole point is the database's row lock.

    createdb nexus_test
    psql nexus_test -f supabase/migrations/0001_credits.sql
    psql nexus_test -f supabase/migrations/0002_generation_jobs.sql
    export NEXUS_TEST_DB_URL=postgresql+asyncpg://postgres@127.0.0.1:5432/nexus_test
    python -m pytest backend/tests/test_ledger_supabase.py -q
"""

from __future__ import annotations

import asyncio
import os
import sys
import uuid
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

DB_URL = os.getenv("NEXUS_TEST_DB_URL")
pytestmark = pytest.mark.skipif(
    not DB_URL, reason="NEXUS_TEST_DB_URL not set — integration test"
)

if DB_URL:
    from services.ledger_supabase import SupabaseLedger
    from services.metering import InsufficientCreditsError, JobStatus
    from services.tenancy import Provider, Tenant, TenantMode, resolve_credentials
    from sqlalchemy import text
    from sqlalchemy.ext.asyncio import create_async_engine

ENV = {"GEMINI_API_KEY": "platform-key"}


def _tenant(mode=None, **kw):
    return Tenant(id=f"t-{uuid.uuid4().hex[:10]}", mode=mode or TenantMode.MANAGED, **kw)


@pytest.fixture
async def ledger():
    engine = create_async_engine(DB_URL, pool_pre_ping=True)
    yield SupabaseLedger(engine, cents_per_credit=25)
    await engine.dispose()


@pytest.mark.asyncio
async def test_grant_and_balance(ledger):
    t = _tenant()
    assert await ledger.balance(t.id) == 0
    assert await ledger.grant_credits(t.id, 40) == 40
    assert await ledger.balance(t.id) == 40


@pytest.mark.asyncio
async def test_grant_is_idempotent_on_replayed_key(ledger):
    t = _tenant()
    key = f"evt_{uuid.uuid4().hex[:12]}"
    assert await ledger.grant_credits(t.id, 10, idempotency_key=key) == 10
    # Stripe redelivers the same event — must not double-credit.
    assert await ledger.grant_credits(t.id, 10, idempotency_key=key) == 10
    assert await ledger.balance(t.id) == 10


@pytest.mark.asyncio
async def test_managed_job_debits_and_records_both_sides(ledger):
    t = _tenant()
    await ledger.grant_credits(t.id, 100)
    res = resolve_credentials(t, Provider.GEMINI, env=ENV)

    job = await ledger.open_job(res, "slide_deck")
    assert await ledger.balance(t.id) == 95

    await ledger.close_job(job, cost_cents=40)
    report = await ledger.margin_report(t.id)
    assert report["revenue_cents"] == 125  # 5 credits x 25c
    assert report["cost_cents"] == 40
    assert report["margin_cents"] == 85


@pytest.mark.asyncio
async def test_insufficient_credits_leaves_balance_untouched(ledger):
    t = _tenant()
    await ledger.grant_credits(t.id, 3)
    res = resolve_credentials(t, Provider.GEMINI, env=ENV)
    with pytest.raises(InsufficientCreditsError):
        await ledger.open_job(res, "product_video_60s")  # costs 60
    assert await ledger.balance(t.id) == 3


@pytest.mark.asyncio
async def test_failed_job_refunds_but_keeps_cost(ledger):
    t = _tenant()
    await ledger.grant_credits(t.id, 60)
    res = resolve_credentials(t, Provider.GEMINI, env=ENV)

    job = await ledger.open_job(res, "short_video_15s")  # 20 credits
    assert await ledger.balance(t.id) == 40
    await ledger.close_job(job, cost_cents=12, status=JobStatus.FAILED, error="timeout")

    assert await ledger.balance(t.id) == 60, "must refund on failure"
    report = await ledger.margin_report(t.id)
    assert report["revenue_cents"] == 0, "failed job earns nothing"
    assert report["cost_cents"] == 12, "but we still paid the provider"


@pytest.mark.asyncio
async def test_internal_job_costs_without_billing(ledger):
    t = _tenant(mode=TenantMode.INTERNAL, cost_centre="client-delivery")
    res = resolve_credentials(t, Provider.GEMINI, env=ENV)
    job = await ledger.open_job(res, "image_generation")
    await ledger.close_job(job, cost_cents=17)

    report = await ledger.margin_report(t.id)
    assert report["revenue_cents"] == 0
    assert report["internal_cost_cents"] == 17


@pytest.mark.asyncio
async def test_concurrent_spend_cannot_oversell_the_last_credit(ledger):
    """The reason this layer exists. Ten racers, one credit's worth of budget.

    A read-then-write implementation lets several through here.
    """
    t = _tenant()
    await ledger.grant_credits(t.id, 1)  # exactly one 'social_post'
    res = resolve_credentials(t, Provider.GEMINI, env=ENV)

    async def attempt():
        try:
            await ledger.open_job(res, "social_post")
            return "ok"
        except InsufficientCreditsError:
            return "rejected"

    results = await asyncio.gather(*(attempt() for _ in range(10)))
    assert results.count("ok") == 1, f"oversold: {results}"
    assert results.count("rejected") == 9
    assert await ledger.balance(t.id) == 0


@pytest.mark.asyncio
async def test_db_rejects_billing_a_non_billable_job(ledger):
    """The billed_only_when_billable constraint, independent of app logic."""
    engine = ledger.engine
    with pytest.raises(Exception, match="billed_only_when_billable"):
        async with engine.begin() as conn:
            await conn.execute(
                text(
                    "insert into generation_jobs "
                    "(job_id, tenant_id, provider, workflow, payer, billable, "
                    " billed_credits) values "
                    "(:i, 'x', 'gemini', 'social_post', 'internal', false, 5)"
                ),
                {"i": str(uuid.uuid4())},
            )


@pytest.mark.asyncio
async def test_balance_check_constraint_blocks_negative(ledger):
    t = _tenant()
    await ledger.grant_credits(t.id, 1)
    with pytest.raises(Exception):  # noqa: B017 - any DB error is acceptable here
        async with ledger.engine.begin() as conn:
            await conn.execute(
                text("update credits set balance = -1 where customer_key = :k"),
                {"k": t.id},
            )
