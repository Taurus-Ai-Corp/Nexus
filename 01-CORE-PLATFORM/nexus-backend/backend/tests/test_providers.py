"""Tests for the async generation-adapter layer (`services/providers/`).

Run:  python -m pytest backend/tests/test_providers.py -q --asyncio-mode=auto

No test in this file makes a real network call or needs an API key: every
adapter is constructed with a `FakeTransport` that returns canned JSON (or
raises) in-process.
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.metering import (  # noqa: E402
    CostBasis,
    InsufficientCreditsError,
    JobStatus,
    Ledger,
)
from services.providers import (  # noqa: E402
    ADAPTERS,
    PROVIDER_RATES,
    GeminiAdapter,
    GenerationError,
    GenerationRequest,
    HiggsfieldApiAdapter,
    VertexImagenAdapter,
    VertexVeoAdapter,
    generate_and_bill,
)
from services.tenancy import (  # noqa: E402
    Provider,
    ProviderNotResellableError,
    Tenant,
    TenantMode,
)

ENV = {
    "GEMINI_API_KEY": "platform-gemini-key",
    "GOOGLE_APPLICATION_CREDENTIALS": "/secrets/vertex-sa.json",
    "HIGGSFIELD_API_KEY": "platform-higgsfield-key",
    "OPENAI_API_KEY": "platform-openai-key",
}


class FakeTransport:
    """Records every call it receives and never touches the network."""

    def __init__(self, response: dict[str, Any] | None = None, *, fail: Exception | None = None):
        self.response = response or {}
        self.fail = fail
        self.calls: list[dict[str, Any]] = []

    async def post_json(self, url, *, headers, json, timeout=60.0):
        self.calls.append({"url": url, "headers": dict(headers), "json": json})
        if self.fail is not None:
            raise self.fail
        return self.response


class FakeAsyncLedger:
    """Minimal async stand-in for `SupabaseLedger`'s interface, in-memory only.

    Exists so `generate_and_bill`'s async-ledger branch (`_await_maybe`
    awaiting a coroutine) is exercised without a live Postgres.
    """

    def __init__(self) -> None:
        self._inner = Ledger()
        self.jobs = self._inner.jobs

    def grant_credits(self, tenant_id: str, credits: int) -> int:
        return self._inner.grant_credits(tenant_id, credits)

    def balance(self, tenant_id: str) -> int:
        return self._inner.balance(tenant_id)

    async def open_job(self, resolution, workflow):
        return self._inner.open_job(resolution, workflow)

    async def close_job(self, job, *, cost_cents, status=JobStatus.SUCCEEDED, error=None):
        return self._inner.close_job(job, cost_cents=cost_cents, status=status, error=error)


# --------------------------------------------------------------------------
# Hard constraint 1 — the subscription-tier boundary must not be routed around
# --------------------------------------------------------------------------


@pytest.mark.parametrize(
    "provider",
    [Provider.NOTEBOOKLM, Provider.GOOGLE_FLOW, Provider.HIGGSFIELD_SUB],
)
@pytest.mark.asyncio
async def test_managed_tenant_requesting_subscription_provider_is_blocked(provider):
    ledger = Ledger()
    ledger.grant_credits("acme", 100)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    transport = FakeTransport(response={"ok": True})
    # No adapter is even registered for a subscription provider, so pass one
    # explicitly to prove resolve_credentials still raises before it is used.
    adapter = GeminiAdapter(transport)

    with pytest.raises(ProviderNotResellableError):
        await generate_and_bill(
            tenant=tenant,
            provider=provider,
            workflow="social_post",
            request=GenerationRequest(prompt="hello", workflow="social_post"),
            ledger=ledger,
            adapter=adapter,
            env=ENV,
        )

    assert ledger.jobs == [], "no job row may be opened for a blocked provider"
    assert transport.calls == [], "no provider call may be made for a blocked provider"
    assert ledger.balance("acme") == 100, "credits must be untouched"


def test_subscription_providers_have_no_registered_adapter():
    """There is no code path in ADAPTERS that could reach a provider call for
    a subscription-tier provider, even if a caller forgot to pass one."""
    assert Provider.NOTEBOOKLM not in ADAPTERS
    assert Provider.GOOGLE_FLOW not in ADAPTERS
    assert Provider.HIGGSFIELD_SUB not in ADAPTERS


# --------------------------------------------------------------------------
# Hard constraint 2 — everything is async, injected transport, no network
# --------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_generate_and_bill_success_with_sync_ledger():
    ledger = Ledger(cents_per_credit=25)
    ledger.grant_credits("acme", 10)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    transport = FakeTransport(
        response={
            "candidates": [{"content": {"parts": [{"text": "generated caption"}]}}],
            "usageMetadata": {"totalTokenCount": 42},
        }
    )
    adapter = GeminiAdapter(transport)

    job, result = await generate_and_bill(
        tenant=tenant,
        provider=Provider.GEMINI,
        workflow="social_post",
        request=GenerationRequest(prompt="write a caption", workflow="social_post"),
        ledger=ledger,
        adapter=adapter,
        env=ENV,
    )

    assert len(transport.calls) == 1
    assert job.status is JobStatus.SUCCEEDED
    assert job.cost_cents == 0, "no verified rate exists, cost must not be invented"
    assert job.cost_basis is CostBasis.UNVERIFIED
    assert job.error is None, (
        "error must stay null on success — it must not be overloaded to carry "
        "the rate-unverified marker, or `error is not null` matches every "
        "successful job"
    )
    assert result.output_text == "generated caption"
    assert result.raw_usage == {"totalTokenCount": 42}
    assert ledger.balance("acme") == 9, "credits still debited even at cost_cents=0"


@pytest.mark.asyncio
async def test_generate_and_bill_success_with_async_ledger():
    """Proves the same orchestration function works against an async ledger
    (SupabaseLedger's shape) via `_await_maybe`, not a second code path."""
    ledger = FakeAsyncLedger()
    ledger.grant_credits("acme", 10)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    transport = FakeTransport(response={"output_url": "https://cdn.example/out.mp4"})
    adapter = HiggsfieldApiAdapter(transport)

    job, result = await generate_and_bill(
        tenant=tenant,
        provider=Provider.HIGGSFIELD_API,
        workflow="social_post",
        request=GenerationRequest(prompt="make a clip", workflow="social_post"),
        ledger=ledger,
        adapter=adapter,
        env=ENV,
    )

    assert job.status is JobStatus.SUCCEEDED
    assert result.output_url == "https://cdn.example/out.mp4"
    assert ledger.balance("acme") == 9


# --------------------------------------------------------------------------
# Hard constraint 3 — never charge for a failed generation
# --------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_provider_failure_refunds_and_never_bills():
    ledger = Ledger()
    ledger.grant_credits("acme", 60)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    transport = FakeTransport(fail=RuntimeError("provider timed out"))
    adapter = VertexVeoAdapter(transport)

    with pytest.raises(GenerationError):
        await generate_and_bill(
            tenant=tenant,
            provider=Provider.VERTEX_VEO,
            workflow="short_video_15s",
            request=GenerationRequest(prompt="a video", workflow="short_video_15s"),
            ledger=ledger,
            adapter=adapter,
            env=ENV,
        )

    assert len(ledger.jobs) == 1
    job = ledger.jobs[0]
    assert job.status is JobStatus.FAILED
    assert job.cost_cents == 0
    assert job.billed_credits == 0, "must never charge for a failed generation"
    assert ledger.balance("acme") == 60, "credits refunded"
    assert job.error is not None and "provider timed out" in job.error, (
        "error must carry the real exception text"
    )


@pytest.mark.asyncio
async def test_error_field_is_not_overloaded_by_success_marker():
    """Regression guard: `error` must never be non-null on a SUCCEEDED job.

    Previously `generate_and_bill` stamped every successful job's `error`
    field with `RATE_UNVERIFIED:<provider>`, so any query/alert using the
    obvious predicate (`error is not null`) matched 100% of successful jobs.
    The unverified-rate signal must live in `cost_basis`, not `error`.
    """
    ledger = Ledger(cents_per_credit=25)
    ledger.grant_credits("acme", 10)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)

    ok_transport = FakeTransport(
        response={
            "candidates": [{"content": {"parts": [{"text": "ok"}]}}],
            "usageMetadata": {"totalTokenCount": 1},
        }
    )
    ok_job, _ = await generate_and_bill(
        tenant=tenant,
        provider=Provider.GEMINI,
        workflow="social_post",
        request=GenerationRequest(prompt="hi", workflow="social_post"),
        ledger=ledger,
        adapter=GeminiAdapter(ok_transport),
        env=ENV,
    )
    assert ok_job.status is JobStatus.SUCCEEDED
    assert ok_job.error is None
    assert ok_job.cost_basis is CostBasis.UNVERIFIED

    fail_transport = FakeTransport(fail=RuntimeError("boom"))
    with pytest.raises(GenerationError):
        await generate_and_bill(
            tenant=tenant,
            provider=Provider.GEMINI,
            workflow="social_post",
            request=GenerationRequest(prompt="hi", workflow="social_post"),
            ledger=ledger,
            adapter=GeminiAdapter(fail_transport),
            env=ENV,
        )
    failed_job = ledger.jobs[-1]
    assert failed_job.status is JobStatus.FAILED
    assert failed_job.error is not None and "boom" in failed_job.error, (
        "error must carry the real exception text"
    )


@pytest.mark.asyncio
async def test_insufficient_credits_raised_before_any_provider_call():
    ledger = Ledger()
    ledger.grant_credits("acme", 1)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    transport = FakeTransport(response={"predictions": [{"imageUri": "x"}]})
    adapter = VertexImagenAdapter(transport)

    with pytest.raises(InsufficientCreditsError):
        await generate_and_bill(
            tenant=tenant,
            provider=Provider.VERTEX_IMAGEN,
            workflow="image_generation",
            request=GenerationRequest(prompt="a logo", workflow="image_generation"),
            ledger=ledger,
            adapter=adapter,
            env=ENV,
        )

    assert transport.calls == [], "no provider call before credits are reserved"


# --------------------------------------------------------------------------
# Hard constraint 4 — no invented prices
# --------------------------------------------------------------------------


def test_every_provider_rate_is_unverified():
    assert PROVIDER_RATES, "registry should not be empty"
    for rate in PROVIDER_RATES.values():
        assert rate.verified_on is None, (
            f"{rate.provider.value} has a verified_on set — no human confirmed this price"
        )


# --------------------------------------------------------------------------
# Hard constraint 6 — no credential value is ever logged, repr'd, or raised
# --------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_secret_never_appears_in_raised_exception():
    ledger = Ledger()
    ledger.grant_credits("acme", 10)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    secret = ENV["GEMINI_API_KEY"]
    # Simulate a transport error that echoes back the request it failed on,
    # the way a real HTTP client's exception message sometimes does.
    transport = FakeTransport(fail=RuntimeError(f"connection refused for key={secret}"))
    adapter = GeminiAdapter(transport)

    with pytest.raises(GenerationError) as exc_info:
        await generate_and_bill(
            tenant=tenant,
            provider=Provider.GEMINI,
            workflow="social_post",
            request=GenerationRequest(prompt="hi", workflow="social_post"),
            ledger=ledger,
            adapter=adapter,
            env=ENV,
        )

    assert secret not in str(exc_info.value)
    assert secret not in ledger.jobs[0].error


@pytest.mark.asyncio
async def test_secret_sent_as_header_not_logged_in_transport_call():
    """The transport call itself is the only place the secret should appear —
    proving the adapter puts it in a header, not in the URL or job records."""
    ledger = Ledger()
    ledger.grant_credits("acme", 10)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)
    secret = ENV["GEMINI_API_KEY"]
    transport = FakeTransport(response={"candidates": []})
    adapter = GeminiAdapter(transport)

    job, _ = await generate_and_bill(
        tenant=tenant,
        provider=Provider.GEMINI,
        workflow="social_post",
        request=GenerationRequest(prompt="hi", workflow="social_post"),
        ledger=ledger,
        adapter=adapter,
        env=ENV,
    )

    call = transport.calls[0]
    assert secret not in call["url"]
    assert secret not in str(job)
    assert secret not in repr(job)
    assert secret == call["headers"]["x-goog-api-key"], "key travels as a header, not logged"


# --------------------------------------------------------------------------
# Adapter shape / unmapped provider
# --------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_unmapped_provider_without_explicit_adapter_raises_generation_error():
    ledger = Ledger()
    ledger.grant_credits("acme", 10)
    tenant = Tenant(id="acme", mode=TenantMode.MANAGED)

    with pytest.raises(GenerationError, match="no generation adapter registered"):
        await generate_and_bill(
            tenant=tenant,
            provider=Provider.OPENAI,
            workflow="social_post",
            request=GenerationRequest(prompt="hi", workflow="social_post"),
            ledger=ledger,
            env=ENV,
        )

    assert ledger.jobs == [], "adapter lookup failure must not open a job"
