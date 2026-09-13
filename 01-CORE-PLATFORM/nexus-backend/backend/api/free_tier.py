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
"""

from __future__ import annotations

import logging
import os

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from services.metering import WORKFLOW_CREDITS, InsufficientCreditsError, Ledger
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

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api/free", tags=["Free tier"])

#: The one workflow the free tier exposes. Free users get the cheap, fast thing;
#: widening this is a pricing decision, not a config tweak, which is why it is a
#: constant here and not a request parameter.
FREE_WORKFLOW = "social_post"

#: Process-local ledger. Adequate for local development, and WRONG for anything
#: real: it forgets every quota when the process restarts, so two generations
#: becomes two generations *per deploy*. Swap for SupabaseLedger (which already
#: implements the same interface and carries the UNIQUE idempotency_key that
#: makes the monthly grant safe) before this is exposed to the public.
#: Tracked as the single blocker on the endpoint being production-usable.
_ledger = Ledger()

#: Grant keys already issued, e.g. "free:bob@example.com:2026-09".
#:
#: This exists because the in-memory Ledger has no idempotency key, and the
#: obvious substitute is wrong in a way that is invisible until someone counts.
#: Guarding the grant on `balance <= 0` re-grants the moment the allowance is
#: spent — "balance is zero" and "never granted this month" look identical from
#: the balance alone — so every free user got two generations, then two more,
#: forever. Caught by running three generations instead of two.
#:
#: SupabaseLedger does not need this: credit_ledger.idempotency_key is UNIQUE, so
#: the database refuses the second grant itself.
_granted_keys: set[str] = set()


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


def _ensure_monthly_grant(tenant_id: str, email: str) -> None:
    """Give this email its monthly allowance, at most once per calendar month.

    The idempotency key carries the month — "free:<email>:2026-09" — and the
    durable ledger's `credit_ledger.idempotency_key` is UNIQUE, so a second call
    in the same month is a no-op and October is simply a key never seen before.

    That is the entire monthly reset. There is no scheduled job, which matters
    because a reset job that silently stops running hands every free user
    unlimited access without anything appearing to fail.

    The in-memory Ledger has no idempotency key, so the key is tracked here in
    `_granted_keys`. It must NOT be inferred from the balance: a spent allowance
    and a never-granted one both read as zero, so `if balance <= 0: grant` hands
    out a fresh two every time the old two run out. That is an unlimited free
    tier wearing a limit's clothing, and nothing about it looks wrong in a log.
    """
    key = free_tier_grant_key(email)
    if key in _granted_keys:
        return
    _granted_keys.add(key)
    log.info("free tier: granting monthly allowance", extra={"grant_key": key})
    _ledger.grant_credits(tenant_id, FREE_TIER_MONTHLY_GENERATIONS)


@router.get("/quota", response_model=FreeQuotaOut)
async def free_quota(email: EmailStr) -> FreeQuotaOut:
    """How many generations this address has left. Never creates a grant."""
    try:
        tenant = free_tier_tenant(str(email))
    except TenancyError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc
    return FreeQuotaOut(
        email=str(email).strip().lower(),
        remaining_this_month=_ledger.balance(tenant.id),
        monthly_allowance=FREE_TIER_MONTHLY_GENERATIONS,
    )


@router.post("/generate", response_model=FreeGenerateOut)
async def free_generate(body: FreeGenerateIn) -> FreeGenerateOut:
    try:
        tenant = free_tier_tenant(str(body.email))
    except TenancyError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc

    _ensure_monthly_grant(tenant.id, str(body.email))

    try:
        job, result = await generate_and_bill(
            tenant=tenant,
            provider=Provider.GEMINI,
            workflow=FREE_WORKFLOW,
            request=GenerationRequest(prompt=body.prompt, workflow=FREE_WORKFLOW),
            ledger=_ledger,
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
        # FREE_TIER_API_KEY is unset. A 500, deliberately: silently falling back
        # to the platform key would make the company pay for free traffic, which
        # is precisely what the separate key exists to prevent. The message never
        # includes the key name's VALUE, only that it is absent.
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

    if job.billed_credits:  # pragma: no cover - guard against a future regression
        log.error(
            "free job %s recorded %s billed credits; free work must never be revenue",
            job.job_id,
            job.billed_credits,
        )

    return FreeGenerateOut(
        # GenerationResult exposes output_text / output_url, not `text`. Checked
        # rather than assumed: `result.text` would have been an AttributeError on
        # the first successful generation, which is the worst place to find one.
        text=result.output_text or "",
        remaining_this_month=_ledger.balance(tenant.id),
        monthly_allowance=FREE_TIER_MONTHLY_GENERATIONS,
    )


__all__ = ["router", "FREE_WORKFLOW", "WORKFLOW_CREDITS"]
