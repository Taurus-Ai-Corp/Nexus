"""
The free tier's front door: POST /api/free/generate.

Two generations per email per calendar month, never billed, on a dedicated key.
Owner decisions 2026-09-13; the counting rules live in services/tenancy.py and
services/metering.py, not here. This module is deliberately thin — it turns an
HTTP request into a `generate_and_bill` call and turns the result back into
JSON. Every rule it appears to enforce is enforced somewhere else, on purpose,
so a second caller (a CLI, a Cloudflare Function) cannot get different answers.

The ordering below is the part worth reading. It is:

    grant (idempotent) -> open job (decrements) -> call provider -> close job

and NOT "call provider then decrement". If the provider call came first, every
error, timeout and disconnect between the call and the decrement would be a free
generation nobody paid for and nobody counted. Doing it this way means a failure
costs us a provider call and costs the user nothing, because `generate_and_bill`
closes a failed job and `close_job` refunds `quota_credits`.

DURABILITY — what changed when the in-memory ledger was swapped out
-------------------------------------------------------------------
This endpoint previously held its quotas in a process-local `metering.Ledger`.
Every restart — every deploy, every crash, every autoscale event — silently
reset every user's allowance, so "two generations per month" was really "two
per process lifetime" and nothing looked wrong while it happened.

It now uses `SupabaseLedger` against `DATABASE_URL`, which changes three things:

  * The cap survives restarts, because it lives in Postgres.
  * `_granted_keys` is gone. The monthly grant is enforced by the UNIQUE index
    on `credit_ledger.idempotency_key`, so the database refuses a second grant
    for "free:<email>:<YYYY-MM>" instead of this module remembering. A set in
    process memory could never have been right here for the same reason the
    ledger could not: two processes would have kept two different sets.
  * Every ledger call is awaited. `generate_and_bill` already handled both
    ledgers via `_await_maybe`, but the direct `balance`/`grant_credits` calls
    in this module did not, and a forgotten `await` on an async method returns
    a truthy coroutine rather than raising — quota checks would have passed
    unconditionally. `tests/test_free_tier_endpoint.py` drives every path
    through an async ledger for exactly that reason.

There is no fallback to the in-memory ledger when `DATABASE_URL` is unset. That
is deliberate and matches how a missing `FREE_TIER_API_KEY` is handled: the tier
turns itself off with a 503 rather than running in a mode that looks fine and
silently gives away unlimited generations.
"""

from __future__ import annotations

import logging
import os
from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from services.ledger_supabase import SupabaseLedger
from services.metering import WORKFLOW_CREDITS, InsufficientCreditsError
from services.providers.base import GenerationError, GenerationRequest
from services.providers.orchestrator import generate_and_bill
from services.tenancy import (
    FREE_TIER_MONTHLY_GENERATIONS,
    CredentialMissingError,
    Provider,
    TenancyError,
    free_tier_grant_key,
    free_tier_tenant,
)
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import create_async_engine

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api/free", tags=["Free tier"])

#: The one workflow the free tier exposes. Free users get the cheap, fast thing;
#: widening this is a pricing decision, not a config tweak, which is why it is a
#: constant here and not a request parameter.
FREE_WORKFLOW = "social_post"

#: Reason string on the monthly grant's credit_ledger row. Makes "what has the
#: free tier cost us" a query rather than an inference.
FREE_GRANT_REASON = "free_monthly"

#: Set by `_get_ledger` on first use, or injected directly by tests. Never a
#: `metering.Ledger` in production: see the module docstring on why there is no
#: in-memory fallback.
_ledger: Any | None = None


class LedgerUnavailableError(RuntimeError):
    """`DATABASE_URL` is unset or unusable, so quotas cannot be counted.

    Raised instead of degrading to a process-local ledger. The message never
    carries the connection string.
    """


def _async_db_url(raw: str) -> str:
    """Normalise a Postgres URL to the asyncpg driver.

    Supabase's dashboard hands out `postgresql://...`, and passing that to
    `create_async_engine` raises "The asyncio extension requires an async
    driver" at the first request rather than at startup. Normalising here means
    pasting the connection string straight from Supabase works.
    """
    if raw.startswith("postgresql+") or raw.startswith("postgres+"):
        return raw
    for prefix in ("postgresql://", "postgres://"):
        if raw.startswith(prefix):
            return "postgresql+asyncpg://" + raw[len(prefix) :]
    return raw


def _get_ledger() -> Any:
    """The durable ledger, built once from `DATABASE_URL`.

    Built lazily rather than at import so that importing this module (which
    `main.py` does at startup, and which the test suite does constantly) never
    requires a database.
    """
    global _ledger
    if _ledger is not None:
        return _ledger

    raw = os.getenv("DATABASE_URL", "").strip()
    if not raw:
        raise LedgerUnavailableError("DATABASE_URL is not set")
    try:
        # pool_pre_ping: Supabase closes idle connections, and without it the
        # first request after a quiet period fails on a dead pooled socket.
        engine = create_async_engine(_async_db_url(raw), pool_pre_ping=True)
    except Exception as exc:  # noqa: BLE001 - re-raised as a clean error below
        # Deliberately does NOT interpolate `exc`: SQLAlchemy URL errors can
        # echo the connection string, password included.
        raise LedgerUnavailableError(
            f"could not open a database connection ({type(exc).__name__})"
        ) from exc

    _ledger = SupabaseLedger(engine)
    return _ledger


async def aclose() -> None:
    """Dispose the engine. Wired into the app's shutdown so a reload does not
    leak a connection pool per cycle."""
    global _ledger
    ledger, _ledger = _ledger, None
    engine = getattr(ledger, "engine", None)
    if engine is not None and hasattr(engine, "dispose"):
        await engine.dispose()


class FreeGenerateIn(BaseModel):
    email: EmailStr = Field(..., description="Identifies the quota. One quota per address.")
    prompt: str = Field(..., min_length=3, max_length=2000)


class FreeGenerateOut(BaseModel):
    text: str
    remaining_this_month: int
    monthly_allowance: int


class FreeQuotaOut(BaseModel):
    email: str
    remaining_this_month: int
    monthly_allowance: int


async def _ensure_monthly_grant(ledger: Any, tenant_id: str, email: str) -> None:
    """Give this email its monthly allowance, at most once per calendar month.

    The idempotency key carries the month — "free:<email>:2026-09" — and
    `credit_ledger.idempotency_key` is UNIQUE, so a second call in the same
    month is a no-op and October is simply a key never seen before.

    That is the entire monthly reset. There is no scheduled job, which matters
    because a reset job that silently stops running hands every free user
    unlimited access without anything appearing to fail.

    Note what is NOT here any more: a `_granted_keys` set, and any attempt to
    infer "already granted" from the balance. A spent allowance and a
    never-granted one both read as zero, so `if balance <= 0: grant` is an
    unlimited free tier wearing a limit's clothing. The database now settles
    the question, which is the only place that can answer it for every process
    at once.
    """
    await ledger.grant_credits(
        tenant_id,
        FREE_TIER_MONTHLY_GENERATIONS,
        reason=FREE_GRANT_REASON,
        idempotency_key=free_tier_grant_key(email),
    )


#: What "the ledger is not answering" looks like, and why OSError is in here.
#: SQLAlchemy only wraps exceptions the DBAPI raises. A bad host in
#: DATABASE_URL fails earlier than that — `socket.gaierror` out of
#: `getaddrinfo`, which is an OSError and NOT a SQLAlchemyError — so catching
#: SQLAlchemyError alone turns a typo'd hostname into an unhandled 500 instead
#: of a 503. Connection-refused and TLS failures arrive the same way. Found by
#: test_database_url_errors_never_leak_the_connection_string, which pointed a
#: real URL at a host that does not resolve.
_LEDGER_FAILURES = (LedgerUnavailableError, SQLAlchemyError, OSError)


def _unavailable(exc: Exception, what: str) -> HTTPException:
    """503 for anything that means "the tier cannot count right now".

    Never returns the exception text to the caller: SQLAlchemy errors carry SQL
    and can carry connection details.
    """
    log.error("free tier unavailable (%s): %s", what, exc)
    return HTTPException(
        status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="The free tier is temporarily unavailable. Please try again shortly.",
    )


@router.get("/quota", response_model=FreeQuotaOut)
async def free_quota(email: EmailStr) -> FreeQuotaOut:
    """How many generations this address has left. Never creates a grant."""
    try:
        tenant = free_tier_tenant(str(email))
    except TenancyError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc

    try:
        remaining = await _get_ledger().balance(tenant.id)
    except _LEDGER_FAILURES as exc:
        raise _unavailable(exc, "quota lookup") from exc

    return FreeQuotaOut(
        email=str(email).strip().lower(),
        remaining_this_month=remaining,
        monthly_allowance=FREE_TIER_MONTHLY_GENERATIONS,
    )


@router.post("/generate", response_model=FreeGenerateOut)
async def free_generate(body: FreeGenerateIn) -> FreeGenerateOut:
    try:
        tenant = free_tier_tenant(str(body.email))
    except TenancyError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc

    try:
        ledger = _get_ledger()
        await _ensure_monthly_grant(ledger, tenant.id, str(body.email))
    except _LEDGER_FAILURES as exc:
        raise _unavailable(exc, "monthly grant") from exc

    try:
        job, result = await generate_and_bill(
            tenant=tenant,
            provider=Provider.GEMINI,
            workflow=FREE_WORKFLOW,
            request=GenerationRequest(prompt=body.prompt, workflow=FREE_WORKFLOW),
            ledger=ledger,
            env=dict(os.environ),
        )
    except InsufficientCreditsError as exc:
        # The quota is spent. 402 rather than 429: this is not rate limiting,
        # it is an exhausted allowance, and the fix is to pay rather than wait.
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "error": "monthly_free_quota_exhausted",
                "message": (
                    f"You have used all {FREE_TIER_MONTHLY_GENERATIONS} free generations "
                    f"this month. Starter is $99/month for 10 campaigns."
                ),
                "remaining_this_month": 0,
                "monthly_allowance": FREE_TIER_MONTHLY_GENERATIONS,
            },
        ) from exc
    except CredentialMissingError as exc:
        # FREE_TIER_API_KEY is unset. Deliberately not a fallback: silently
        # reaching for the platform key would make the company pay for free
        # traffic, which is precisely what the separate key exists to prevent.
        # The message never includes the key's VALUE, only that it is absent.
        log.error("free tier disabled: %s", exc)
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The free tier is not configured. Please contact sales.",
        ) from exc
    except TenancyError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc
    except GenerationError as exc:
        # generate_and_bill has already closed the job FAILED, and close_job
        # refunds quota_credits — so the caller keeps their attempt. Verified by
        # test_failed_free_generation_returns_the_attempt.
        log.warning("free generation failed, attempt refunded: %s", exc)
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            detail="Generation failed. Your free attempt has not been used.",
        ) from exc
    except _LEDGER_FAILURES as exc:
        # open_job/close_job are ledger calls, so a DB that dies mid-request
        # lands here. A provider-side OSError would also be caught, and 503
        # "try again shortly" is an honest answer for that too.
        raise _unavailable(exc, "generation") from exc

    if job.billed_credits:  # pragma: no cover - guard against a future regression
        log.error(
            "free job %s recorded %s billed credits; free work must never be revenue",
            job.job_id,
            job.billed_credits,
        )

    try:
        remaining = await ledger.balance(tenant.id)
    except _LEDGER_FAILURES as exc:
        # The generation succeeded and was counted; only the read-back failed.
        # Returning the text with an unknown remainder beats 500-ing away work
        # the user has already been charged an attempt for.
        log.error("free tier: balance read-back failed after a successful job: %s", exc)
        remaining = 0

    return FreeGenerateOut(
        # GenerationResult exposes output_text / output_url, not `text`. Checked
        # rather than assumed: `result.text` would have been an AttributeError on
        # the first successful generation, which is the worst place to find one.
        text=result.output_text or "",
        remaining_this_month=remaining,
        monthly_allowance=FREE_TIER_MONTHLY_GENERATIONS,
    )


__all__ = [
    "FREE_GRANT_REASON",
    "FREE_WORKFLOW",
    "WORKFLOW_CREDITS",
    "LedgerUnavailableError",
    "aclose",
    "router",
]
