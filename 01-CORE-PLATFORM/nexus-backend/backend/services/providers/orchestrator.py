"""
The one orchestration entry point: `generate_and_bill`.

Runs the mandatory flow exactly as specified, in exactly this order, with no
early exit that skips a step:

    resolve_credentials(...) -> ledger.open_job(...) -> await adapter.generate(...)
    -> ledger.close_job(...)

Ledger compatibility — sync AND async, one function, not two: `metering.Ledger`
is a plain synchronous class (`open_job`/`close_job` return a `JobRecord`
directly); `ledger_supabase.SupabaseLedger` is async (those same calls return a
coroutine). Rather than branch on `isinstance` or maintain two near-identical
functions, `_await_maybe` checks `inspect.isawaitable` on the *return value* of
each call and awaits only when there is something to await. That is not a
hack around the type difference, it is the natural consequence of calling a
sync function and an async function the same way in Python: `f(...)` always
runs synchronously up to its first `await`/`return`, and only an `async def`
hands back an awaitable. Both ledgers are exercised in `test_providers.py`
(the real in-memory `Ledger`, and a minimal async fake standing in for
`SupabaseLedger` so the test suite does not need a live Postgres).

Licensing boundary: `resolve_credentials` is called first, unguarded, and its
exceptions are never caught here. A `ProviderNotResellableError` for a
billable tenant requesting a subscription-tier provider propagates straight
out of this function before `ledger.open_job` is ever called and before any
adapter is constructed or touched. `ADAPTERS` below has no entry for
`NOTEBOOKLM`, `GOOGLE_FLOW`, or `HIGGSFIELD_SUB` — there is no code path in
this module that can reach a provider call for them.

Pricing: see `rates.py`. Every job this function closes is billed
`cost_cents=0`; successful jobs carry `JobRecord.cost_basis = CostBasis.UNVERIFIED`
so the zero cost is machine-distinguishable from a verified free rate, without
overloading `JobRecord.error` (which stays `None` on success, exactly as any
other successful job, and holds the real exception text on failure).
"""

from __future__ import annotations

import inspect
from typing import Any, Protocol

from ..metering import CostBasis, JobRecord, JobStatus
from ..tenancy import ByokLookup, CredentialResolution, Provider, Tenant, resolve_credentials
from .base import GenerationAdapter, GenerationError, GenerationRequest, GenerationResult
from .gemini import GeminiAdapter
from .higgsfield import HiggsfieldApiAdapter
from .vertex_imagen import VertexImagenAdapter
from .vertex_veo import VertexVeoAdapter

#: API-tier adapters only. Deliberately excludes NOTEBOOKLM, GOOGLE_FLOW, and
#: HIGGSFIELD_SUB — those are subscription-tier and `resolve_credentials`
#: already raises `ProviderNotResellableError` for any billable tenant that
#: requests them. There is no adapter registered for them here for a caller
#: to reach even by mistake; adding one would be the bypass this stage is
#: explicitly forbidden from building.
ADAPTERS: dict[Provider, type[GenerationAdapter]] = {
    Provider.GEMINI: GeminiAdapter,
    Provider.VERTEX_VEO: VertexVeoAdapter,
    Provider.VERTEX_IMAGEN: VertexImagenAdapter,
    Provider.HIGGSFIELD_API: HiggsfieldApiAdapter,
}


class _LedgerLike(Protocol):
    """Structurally matches both `metering.Ledger` and
    `ledger_supabase.SupabaseLedger`. Return type is `Any` because one is a
    `JobRecord` and the other a coroutine resolving to one — `_await_maybe`
    reconciles that at the call site."""

    def open_job(self, resolution: CredentialResolution, workflow: str) -> Any: ...

    def close_job(
        self,
        job: JobRecord,
        *,
        cost_cents: int,
        status: JobStatus = JobStatus.SUCCEEDED,
        error: str | None = None,
    ) -> Any: ...


async def _await_maybe(value: Any) -> Any:
    """Await `value` only if it's awaitable. Makes one call site work for both
    the sync `Ledger` and the async `SupabaseLedger` — see module docstring."""
    if inspect.isawaitable(value):
        return await value
    return value


async def generate_and_bill(
    *,
    tenant: Tenant,
    provider: Provider,
    workflow: str,
    request: GenerationRequest,
    ledger: _LedgerLike,
    adapter: GenerationAdapter | None = None,
    byok_lookup: ByokLookup | None = None,
    env: dict[str, str] | None = None,
) -> tuple[JobRecord, GenerationResult]:
    """Run one billed generation end-to-end. See module docstring for the flow.

    `adapter` should normally be injected by the caller (with its transport
    already set to a fake in tests, or to the default `AiohttpTransport` in
    production). If omitted, an adapter is looked up in `ADAPTERS` and
    constructed with the default transport — callers that need a fake
    transport in tests must pass `adapter=` explicitly.

    Raises:
        ProviderNotResellableError, CredentialMissingError, TenancyError:
            from `resolve_credentials`, before any job is opened.
        InsufficientCreditsError: from `ledger.open_job`, before any
            provider call is made.
        GenerationError: re-raised from the adapter after the job has been
            closed as `JobStatus.FAILED` with `cost_cents=0` (never billed).
    """
    # Unguarded on purpose, and deliberately the FIRST thing this function
    # does — before any adapter is looked up or constructed, before any job
    # is opened. This is the licensing boundary; nothing below this line runs
    # unless resolve_credentials permits the tenant/provider pair.
    resolution = resolve_credentials(tenant, provider, byok_lookup=byok_lookup, env=env)

    if adapter is None:
        adapter_cls = ADAPTERS.get(provider)
        if adapter_cls is None:
            raise GenerationError(f"no generation adapter registered for {provider.value}")
        adapter = adapter_cls()

    job = await _await_maybe(ledger.open_job(resolution, workflow))

    try:
        result = await adapter.generate(request, credential=resolution)
    except Exception as exc:
        await _await_maybe(
            ledger.close_job(job, cost_cents=0, status=JobStatus.FAILED, error=str(exc))
        )
        raise

    await _await_maybe(
        ledger.close_job(
            job,
            cost_cents=0,
            status=JobStatus.SUCCEEDED,
            error=None,
        )
    )
    # `close_job` mutates and returns the same `job` object for both the sync
    # `Ledger` and `SupabaseLedger` (see their implementations); `cost_basis`
    # is intentionally not a `close_job` parameter — it is not persisted to
    # the database (no column for it), so it is set on the in-process record
    # after the durable write succeeds.
    job.cost_basis = CostBasis.UNVERIFIED
    return job, result
