"""
Postgres/Supabase-backed ledger — the persistent counterpart to `metering.Ledger`.

Same lifecycle (`open_job` -> provider call -> `close_job`), but async and
durable. Two properties matter more than anything else here:

1. **The credit debit is atomic.** Balance is decremented with a single
   conditional UPDATE:

       update credits set balance = balance - :n where ... and balance >= :n

   Postgres takes a row lock for the duration, so two concurrent requests for
   the last credit cannot both succeed. Reading the balance and then writing it
   back would race; this does not. `credits.balance` also carries a
   `check (balance >= 0)` as a second line of defence.

2. **Nothing blocks the event loop.** Every method is `async` and awaits the
   SQLAlchemy async engine. This matters because the surrounding FastAPI app is
   asyncio — a synchronous DB call here would serialise every request.

Schema: supabase/migrations/0001_credits.sql + 0002_generation_jobs.sql.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from .metering import WORKFLOW_CREDITS, InsufficientCreditsError, JobRecord, JobStatus
from .tenancy import CredentialResolution, Provider, TenantMode


class SupabaseLedger:
    """Durable ledger. Interface mirrors `metering.Ledger`, but awaitable."""

    def __init__(self, engine: AsyncEngine, cents_per_credit: int = 25) -> None:
        self.engine = engine
        self.cents_per_credit = cents_per_credit

    # ---- balances -----------------------------------------------------------

    async def balance(self, tenant_id: str) -> int:
        async with self.engine.connect() as conn:
            row = (
                await conn.execute(
                    text("select balance from credits where customer_key = :k"),
                    {"k": tenant_id},
                )
            ).first()
        return int(row[0]) if row else 0

    async def grant_credits(
        self,
        tenant_id: str,
        credits: int,
        *,
        reason: str = "manual_grant",
        idempotency_key: str | None = None,
    ) -> int:
        """Add credits. Supplying `idempotency_key` makes a replay a no-op.

        Used by the Stripe webhook, where the same event can be delivered twice.
        """
        if credits < 0:
            raise ValueError("credits must be non-negative")

        async with self.engine.begin() as conn:
            if idempotency_key:
                seen = (
                    await conn.execute(
                        text(
                            "select 1 from credit_ledger "
                            "where idempotency_key = :i limit 1"
                        ),
                        {"i": idempotency_key},
                    )
                ).first()
                if seen:
                    row = (
                        await conn.execute(
                            text(
                                "select balance from credits where customer_key = :k"
                            ),
                            {"k": tenant_id},
                        )
                    ).first()
                    return int(row[0]) if row else 0

            row = (
                await conn.execute(
                    text(
                        "insert into credits (customer_key, balance) "
                        "values (:k, :n) "
                        "on conflict (customer_key) do update "
                        "set balance = credits.balance + excluded.balance, "
                        "    updated_at = now() "
                        "returning balance"
                    ),
                    {"k": tenant_id, "n": credits},
                )
            ).first()

            await conn.execute(
                text(
                    "insert into credit_ledger "
                    "(customer_key, delta, reason, idempotency_key) "
                    "values (:k, :d, :r, :i)"
                ),
                {"k": tenant_id, "d": credits, "r": reason, "i": idempotency_key},
            )
        return int(row[0])

    # ---- job lifecycle ------------------------------------------------------

    async def open_job(
        self, resolution: CredentialResolution, workflow: str
    ) -> JobRecord:
        """Atomically reserve credits and insert the job row.

        Raises `InsufficientCreditsError` before any provider call is made.
        """
        if workflow not in WORKFLOW_CREDITS:
            raise KeyError(f"unpriced workflow: {workflow}")
        price = WORKFLOW_CREDITS[workflow]
        job_id = str(uuid.uuid4())

        async with self.engine.begin() as conn:
            if resolution.billable:
                # Single conditional UPDATE — the whole point. No read-then-write.
                debited = (
                    await conn.execute(
                        text(
                            "update credits set balance = balance - :n, "
                            "       updated_at = now() "
                            " where customer_key = :k and balance >= :n "
                            "returning balance"
                        ),
                        {"k": resolution.tenant_id, "n": price},
                    )
                ).first()
                if debited is None:
                    raise InsufficientCreditsError(
                        f"tenant {resolution.tenant_id} needs {price} credits for "
                        f"'{workflow}' but holds too few"
                    )
                await conn.execute(
                    text(
                        "insert into credit_ledger (customer_key, delta, reason) "
                        "values (:k, :d, :r)"
                    ),
                    {"k": resolution.tenant_id, "d": -price, "r": f"job:{workflow}"},
                )

            await conn.execute(
                text(
                    "insert into generation_jobs "
                    "(job_id, tenant_id, provider, workflow, payer, billable, "
                    " status, billed_credits, cost_centre) "
                    "values (:job_id, :tenant_id, :provider, :workflow, :payer, "
                    "        :billable, 'pending', :billed_credits, :cost_centre)"
                ),
                {
                    "job_id": job_id,
                    "tenant_id": resolution.tenant_id,
                    "provider": resolution.provider.value,
                    "workflow": workflow,
                    "payer": resolution.payer.value,
                    "billable": resolution.billable,
                    "billed_credits": price if resolution.billable else 0,
                    "cost_centre": resolution.cost_centre,
                },
            )

        return JobRecord(
            tenant_id=resolution.tenant_id,
            provider=resolution.provider,
            workflow=workflow,
            payer=resolution.payer,
            billable=resolution.billable,
            billed_credits=price if resolution.billable else 0,
            cost_centre=resolution.cost_centre,
            job_id=job_id,
            created_at=datetime.now(UTC),
        )

    async def close_job(
        self,
        job: JobRecord,
        *,
        cost_cents: int,
        status: JobStatus = JobStatus.SUCCEEDED,
        error: str | None = None,
    ) -> JobRecord:
        """Persist the real provider cost. Refunds credits when the job failed."""
        cost_cents = max(0, cost_cents)
        refund = (
            job.billed_credits
            if (status is JobStatus.FAILED and job.billable and job.billed_credits)
            else 0
        )

        async with self.engine.begin() as conn:
            if refund:
                await conn.execute(
                    text(
                        "update credits set balance = balance + :n, "
                        "       updated_at = now() where customer_key = :k"
                    ),
                    {"k": job.tenant_id, "n": refund},
                )
                await conn.execute(
                    text(
                        "insert into credit_ledger (customer_key, delta, reason) "
                        "values (:k, :d, :r)"
                    ),
                    {"k": job.tenant_id, "d": refund, "r": f"refund:{job.workflow}"},
                )

            await conn.execute(
                text(
                    "update generation_jobs "
                    "   set status = :s, cost_cents = :c, error = :e, "
                    "       billed_credits = :bc, closed_at = now() "
                    " where job_id = :job_id"
                ),
                {
                    "s": status.value,
                    "c": cost_cents,
                    "e": error,
                    "bc": 0 if refund else job.billed_credits,
                    "job_id": job.job_id,
                },
            )

        job.cost_cents = cost_cents
        job.status = status
        job.error = error
        if refund:
            job.billed_credits = 0
        return job

    # ---- reporting ----------------------------------------------------------

    #: Both variants are complete literals — nothing is interpolated into SQL.
    _MARGIN_SELECT = (
        "select "
        "  coalesce(sum(case when status = 'succeeded' "
        "                    then billed_credits else 0 end), 0), "
        "  coalesce(sum(cost_cents), 0), "
        "  coalesce(sum(case when payer = 'internal' "
        "                    then cost_cents else 0 end), 0) "
        "from generation_jobs"
    )
    _MARGIN_ALL = _MARGIN_SELECT
    _MARGIN_BY_TENANT = _MARGIN_SELECT + " where tenant_id = :t"

    async def margin_report(self, tenant_id: str | None = None) -> dict[str, int]:
        """Revenue counts succeeded jobs; cost counts all of them."""
        query = self._MARGIN_BY_TENANT if tenant_id else self._MARGIN_ALL
        params = {"t": tenant_id} if tenant_id else {}
        async with self.engine.connect() as conn:
            row = (await conn.execute(text(query), params)).first()

        credits, cost, internal = int(row[0]), int(row[1]), int(row[2])
        revenue = credits * self.cents_per_credit
        return {
            "revenue_cents": revenue,
            "cost_cents": cost,
            "margin_cents": revenue - cost,
            "internal_cost_cents": internal,
        }


__all__ = [
    "InsufficientCreditsError",
    "JobStatus",
    "Provider",
    "SupabaseLedger",
    "TenantMode",
]
