"""Tests for the tenancy + metering layer.

Run:  python -m pytest backend/tests/test_tenancy_metering.py -q
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.metering import (  # noqa: E402
    WORKFLOW_CREDITS,
    InsufficientCreditsError,
    JobStatus,
    Ledger,
    ProviderRate,
)
from services.tenancy import (  # noqa: E402
    CredentialMissingError,
    Provider,
    ProviderNotResellableError,
    Tenant,
    TenantMode,
    resolve_credentials,
)

ENV = {
    "GEMINI_API_KEY": "platform-gemini-key",
    "HIGGSFIELD_API_KEY": "platform-higgsfield-key",
}


# --------------------------------------------------------------------------
# The licensing boundary — the rule that protects the accounts
# --------------------------------------------------------------------------


@pytest.mark.parametrize(
    "provider",
    [Provider.NOTEBOOKLM, Provider.GOOGLE_FLOW, Provider.HIGGSFIELD_SUB],
)
@pytest.mark.parametrize("mode", [TenantMode.MANAGED, TenantMode.BYOK])
def test_subscription_providers_cannot_serve_paying_tenants(provider, mode):
    tenant = Tenant(id="acme", mode=mode)
    with pytest.raises(ProviderNotResellableError):
        resolve_credentials(tenant, provider, env=ENV)


@pytest.mark.parametrize(
    "provider",
    [Provider.NOTEBOOKLM, Provider.GOOGLE_FLOW, Provider.HIGGSFIELD_SUB],
)
def test_subscription_providers_are_allowed_for_internal_work(provider):
    tenant = Tenant(id="taurus", mode=TenantMode.INTERNAL, cost_centre="delivery")
    # Internal use is permitted but still has no pipeline key — these tools are
    # human-driven, so CredentialMissingError is the correct, non-licensing failure.
    with pytest.raises(CredentialMissingError):
        resolve_credentials(tenant, provider, env=ENV)


# --------------------------------------------------------------------------
# Credential resolution
# --------------------------------------------------------------------------


def test_managed_tenant_uses_platform_key_and_is_billable():
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)
    assert res.reveal() == "platform-gemini-key"
    assert res.billable is True
    assert res.payer is TenantMode.MANAGED


def test_byok_tenant_uses_own_key_and_is_not_billable():
    tenant = Tenant(id="bring", mode=TenantMode.BYOK)
    res = resolve_credentials(
        tenant,
        Provider.GEMINI,
        byok_lookup=lambda t, p: "client-owned-key",
        env=ENV,
    )
    assert res.reveal() == "client-owned-key"
    assert res.billable is False


def test_internal_tenant_is_not_billable_and_keeps_cost_centre():
    tenant = Tenant(id="taurus", mode=TenantMode.INTERNAL, cost_centre="nexus-social")
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)
    assert res.billable is False
    assert res.cost_centre == "nexus-social"


def test_secret_never_appears_in_repr_or_str():
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)
    assert "platform-gemini-key" not in repr(res)
    assert "platform-gemini-key" not in str(res)


def test_entitlement_is_enforced():
    tenant = Tenant(
        id="acme",
        mode=TenantMode.MANAGED,
        allowed_providers=frozenset({Provider.GEMINI}),
    )
    with pytest.raises(Exception, match="not entitled"):
        resolve_credentials(tenant, Provider.HIGGSFIELD_API, env=ENV)


def test_missing_platform_key_raises_without_leaking_var_value():
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    with pytest.raises(CredentialMissingError) as exc:
        resolve_credentials(tenant, Provider.OPENAI, env=ENV)
    assert "OPENAI_API_KEY" in str(exc.value)


# --------------------------------------------------------------------------
# Metering
# --------------------------------------------------------------------------


def test_managed_job_debits_credits_and_records_both_sides():
    ledger = Ledger(cents_per_credit=25)
    ledger.grant_credits("acme", 100)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)

    job = ledger.open_job(res, "slide_deck")
    assert ledger.balance("acme") == 100 - WORKFLOW_CREDITS["slide_deck"]

    ledger.close_job(job, cost_cents=40)
    assert job.billed_credits == 5
    assert job.cost_cents == 40
    # 5 credits x 25c = 125c revenue, 40c cost => 85c margin
    assert job.margin_cents(25) == 85


def test_internal_job_costs_money_but_bills_nothing():
    ledger = Ledger()
    tenant = Tenant(id="taurus", mode=TenantMode.INTERNAL, cost_centre="delivery")
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)

    job = ledger.open_job(res, "image_generation")
    ledger.close_job(job, cost_cents=17)
    assert job.billed_credits == 0
    assert job.cost_cents == 17
    assert ledger.margin_report()["internal_cost_cents"] == 17


def test_failed_job_refunds_credits():
    ledger = Ledger()
    ledger.grant_credits("acme", 60)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)

    job = ledger.open_job(res, "short_video_15s")
    assert ledger.balance("acme") == 40
    ledger.close_job(job, cost_cents=12, status=JobStatus.FAILED, error="timeout")
    assert ledger.balance("acme") == 60, "credits must be refunded on failure"
    assert job.billed_credits == 0
    assert job.cost_cents == 12, "we still paid the provider"


def test_insufficient_credits_raises_before_any_provider_call():
    ledger = Ledger()
    ledger.grant_credits("acme", 3)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    res = resolve_credentials(tenant, Provider.GEMINI, env=ENV)
    with pytest.raises(InsufficientCreditsError):
        ledger.open_job(res, "product_video_60s")
    assert ledger.balance("acme") == 3, "balance untouched on rejection"


def test_byok_job_is_metered_but_free():
    ledger = Ledger()
    tenant = Tenant(id="bring", mode=TenantMode.BYOK)
    res = resolve_credentials(
        tenant, Provider.GEMINI, byok_lookup=lambda t, p: "k", env=ENV
    )
    job = ledger.open_job(res, "social_post")
    ledger.close_job(job, cost_cents=0)
    assert job.billed_credits == 0
    assert ledger.balance("bring") == 0


def test_provider_rate_rounds_half_up_and_flags_unverified():
    rate = ProviderRate(Provider.GEMINI, cents_per_unit=__import__(
        "decimal").Decimal("0.5"), unit="1k_tokens")
    assert rate.cost_for(1) == 1  # 0.5 -> 1, half-up
    assert rate.verified_on is None, "rates must be explicitly verified by a human"
