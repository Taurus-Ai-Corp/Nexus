"""
Free tier: 2 generations per email per calendar month, never billed.

These tests exist because the free tier has exactly two ways to fail silently,
and neither produces an error:

  1. It stops capping. `open_job()` decremented only when `resolution.billable`,
     and a FREE job is not billable — so before the quota/billing split every
     free generation was free AND unlimited. Nothing raised; the counter simply
     never moved.
  2. It starts charging. If free work ever lands in `billed_credits`, the margin
     view reports revenue that does not exist.

Owner decisions, 2026-09-13: 2/month, email required, Gemini free quota, and a
dedicated FREE_TIER_API_KEY rather than the platform key.
"""

from __future__ import annotations

import sys
import types
from datetime import UTC, datetime
from pathlib import Path

import pytest

# services/__init__.py imports vector_retrieval, which hard-imports numpy even
# though turbovec is optional. Stub it so this module is testable without the
# whole scientific stack.
sys.modules.setdefault("numpy", types.ModuleType("numpy"))
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from services.metering import (  # noqa: E402
    WORKFLOW_CREDITS,
    InsufficientCreditsError,
    JobStatus,
    Ledger,
)
from services.tenancy import (  # noqa: E402
    FREE_TIER_ENV_VAR,
    FREE_TIER_MONTHLY_GENERATIONS,
    CredentialMissingError,
    Provider,
    ProviderNotResellableError,
    TenancyError,
    Tenant,
    TenantMode,
    free_tier_grant_key,
    free_tier_tenant,
    resolve_credentials,
)

FREE_ENV = {FREE_TIER_ENV_VAR: "free-key", "GEMINI_API_KEY": "PLATFORM-KEY"}
EMAIL = "bob@example.com"
WORKFLOW = "social_post"


def _granted_ledger(tenant: Tenant) -> Ledger:
    led = Ledger()
    led.grant_credits(tenant.id, FREE_TIER_MONTHLY_GENERATIONS)
    return led


# --------------------------------------------------------------------------
# The cap
# --------------------------------------------------------------------------

def test_free_tier_allows_exactly_the_monthly_quota_then_stops():
    tenant = free_tier_tenant(EMAIL)
    res = resolve_credentials(tenant, Provider.GEMINI, env=FREE_ENV)
    led = _granted_ledger(tenant)

    per_call = WORKFLOW_CREDITS[WORKFLOW]
    allowed = FREE_TIER_MONTHLY_GENERATIONS // per_call
    for _ in range(allowed):
        job = led.open_job(res, WORKFLOW)
        led.close_job(job, cost_cents=0)

    assert led.balance(tenant.id) == 0
    with pytest.raises(InsufficientCreditsError):
        led.open_job(res, WORKFLOW)


def test_free_job_consumes_quota_but_earns_nothing():
    """The whole point of splitting the flag. Regression guard for the bug where
    open_job() keyed the decrement off `billable` and free was uncapped."""
    tenant = free_tier_tenant(EMAIL)
    res = resolve_credentials(tenant, Provider.GEMINI, env=FREE_ENV)
    assert res.consumes_quota is True
    assert res.billable is False

    led = _granted_ledger(tenant)
    before = led.balance(tenant.id)
    job = led.open_job(res, WORKFLOW)
    led.close_job(job, cost_cents=9)

    assert led.balance(tenant.id) == before - WORKFLOW_CREDITS[WORKFLOW], (
        "a free generation must decrement the allowance"
    )
    assert job.billed_credits == 0, "free work must never be recorded as revenue"
    assert job.quota_credits == WORKFLOW_CREDITS[WORKFLOW]
    assert led.margin_report()["revenue_cents"] == 0


def test_failed_free_generation_returns_the_attempt():
    """A provider error must not cost the user one of two monthly tries."""
    tenant = free_tier_tenant(EMAIL)
    res = resolve_credentials(tenant, Provider.GEMINI, env=FREE_ENV)
    led = _granted_ledger(tenant)

    job = led.open_job(res, WORKFLOW)
    assert led.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS - 1
    led.close_job(job, cost_cents=0, status=JobStatus.FAILED, error="provider 503")
    assert led.balance(tenant.id) == FREE_TIER_MONTHLY_GENERATIONS


# --------------------------------------------------------------------------
# The key
# --------------------------------------------------------------------------

def test_free_tier_never_spends_the_platform_key():
    res = resolve_credentials(free_tier_tenant(EMAIL), Provider.GEMINI, env=FREE_ENV)
    assert res.reveal() == "free-key"
    assert res.reveal() != FREE_ENV["GEMINI_API_KEY"]
    assert res.payer is TenantMode.FREE


def test_free_tier_refuses_to_fall_back_to_the_platform_key():
    """Absent FREE_TIER_API_KEY must fail loudly, not quietly bill the company."""
    with pytest.raises(CredentialMissingError):
        resolve_credentials(
            free_tier_tenant(EMAIL), Provider.GEMINI, env={"GEMINI_API_KEY": "PLATFORM"}
        )


def test_credential_value_never_appears_in_repr():
    res = resolve_credentials(free_tier_tenant(EMAIL), Provider.GEMINI, env=FREE_ENV)
    assert "free-key" not in repr(res)
    assert "free-key" not in str(res)


# --------------------------------------------------------------------------
# The licensing boundary
# --------------------------------------------------------------------------

def test_free_tier_cannot_touch_subscription_providers():
    """Stricter than INTERNAL: a free user is a member of the public, which no
    consumer subscription licence contemplates."""
    with pytest.raises(ProviderNotResellableError):
        resolve_credentials(free_tier_tenant(EMAIL), Provider.NOTEBOOKLM, env=FREE_ENV)


def test_free_tier_is_restricted_to_its_one_provider():
    with pytest.raises(TenancyError):
        resolve_credentials(free_tier_tenant(EMAIL), Provider.OPENAI, env=FREE_ENV)


# --------------------------------------------------------------------------
# The monthly reset, which is a string and not a cron job
# --------------------------------------------------------------------------

def test_grant_key_is_stable_within_a_month_and_changes_across_months():
    sep = datetime(2026, 9, 30, 23, 59, tzinfo=UTC)
    oct_ = datetime(2026, 10, 1, 0, 1, tzinfo=UTC)
    assert free_tier_grant_key(EMAIL, now=sep) == free_tier_grant_key(EMAIL, now=sep)
    assert free_tier_grant_key(EMAIL, now=sep) != free_tier_grant_key(EMAIL, now=oct_)


def test_grant_key_normalises_email_case_and_whitespace():
    """Otherwise Bob@x.com and bob@x.com are two quotas for one person."""
    a = free_tier_grant_key("  Bob@Example.COM ", now=datetime(2026, 9, 1, tzinfo=UTC))
    b = free_tier_grant_key("bob@example.com", now=datetime(2026, 9, 1, tzinfo=UTC))
    assert a == b


def test_tenant_id_normalises_too():
    assert free_tier_tenant("Bob@Example.com").id == free_tier_tenant("bob@example.com").id


@pytest.mark.parametrize("bad", ["", "   ", "notanemail", "@", "a"])
def test_rejects_things_that_are_not_email_addresses(bad):
    with pytest.raises(TenancyError):
        free_tier_tenant(bad)


# --------------------------------------------------------------------------
# The other modes must be unchanged by the split
# --------------------------------------------------------------------------

def test_paying_tenant_still_both_billed_and_counted():
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    res = resolve_credentials(tenant, Provider.GEMINI, env=FREE_ENV)
    assert res.billable is True and res.consumes_quota is True

    led = Ledger()
    led.grant_credits("acme", 5)
    job = led.open_job(res, WORKFLOW)
    led.close_job(job, cost_cents=3)
    assert job.billed_credits == WORKFLOW_CREDITS[WORKFLOW]
    assert led.margin_report()["revenue_cents"] > 0


def test_internal_work_is_still_uncapped():
    """INTERNAL must not have acquired a quota by accident."""
    tenant = Tenant(id="us", mode=TenantMode.INTERNAL, cost_centre="nexus-social")
    res = resolve_credentials(tenant, Provider.GEMINI, env=FREE_ENV)
    assert res.consumes_quota is False

    led = Ledger()  # deliberately no grant
    for _ in range(5):
        job = led.open_job(res, WORKFLOW)
        led.close_job(job, cost_cents=1)
    assert led.balance("us") == 0


def test_byok_consumes_nothing_of_ours():
    tenant = Tenant(id="byok-co", mode=TenantMode.BYOK)
    res = resolve_credentials(
        tenant, Provider.GEMINI, byok_lookup=lambda *_: "client-key", env=FREE_ENV
    )
    assert res.billable is False and res.consumes_quota is False
    assert res.reveal() == "client-key"
