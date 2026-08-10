"""
Nexus Platform — usage metering and the job ledger.

The one modelling rule that matters:

    Every job records BOTH what we paid the provider (`cost_cents`) AND what the
    client paid us (`billed_credits`). Store only one and margin becomes
    permanently uncomputable — you cannot reconstruct it later.

Credits are the client-facing unit. Clients buy "a 60-second product video",
not "Veo tokens", so the credit price is set per *workflow*, not per model.
That keeps pricing stable when you swap the model underneath.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import UTC, datetime
from decimal import ROUND_HALF_UP, Decimal
from enum import Enum

from .tenancy import CredentialResolution, Provider, TenantMode


class JobStatus(str, Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"


#: Client-facing credit price per workflow. These are BUSINESS decisions, set
#: deliberately, not derived from provider cost at request time.
WORKFLOW_CREDITS: dict[str, int] = {
    "social_post": 1,
    "image_generation": 2,
    "slide_deck": 5,
    "short_video_15s": 20,
    "product_video_60s": 60,
}

#: Sentinel: provider rates change often and are NOT baked in here as fact.
#: Populate from config//pricing sync and set `verified_on` when you confirm.
UNVERIFIED: None = None


@dataclass(frozen=True)
class ProviderRate:
    """Cost model for one provider. `verified_on` is None until a human checks."""

    provider: Provider
    cents_per_unit: Decimal
    unit: str
    verified_on: str | None = UNVERIFIED

    def cost_for(self, units: Decimal | int | float) -> int:
        """Cost in whole cents, rounded half-up. Never returns negative."""
        cents = self.cents_per_unit * Decimal(str(units))
        return max(0, int(cents.quantize(Decimal("1"), rounding=ROUND_HALF_UP)))


@dataclass
class JobRecord:
    """One generation. The unit of both billing and cost attribution."""

    tenant_id: str
    provider: Provider
    workflow: str
    payer: TenantMode
    billable: bool
    status: JobStatus = JobStatus.PENDING
    cost_cents: int = 0
    """What WE paid the provider. Always recorded, even for BYOK and INTERNAL."""
    billed_credits: int = 0
    """What the CLIENT paid us. Zero unless the tenant is billable."""
    cost_centre: str | None = None
    job_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    error: str | None = None

    def margin_cents(self, cents_per_credit: int) -> int:
        """Revenue minus cost. Negative means the job lost money."""
        return (self.billed_credits * cents_per_credit) - self.cost_cents


class InsufficientCreditsError(RuntimeError):
    """Tenant lacks the credit balance for this workflow."""


class Ledger:
    """In-memory ledger. Swap the two `_persist`/`_balance` hooks for Supabase.

    Deliberately not coupled to a database so the billing rules stay testable.
    """

    def __init__(self, cents_per_credit: int = 25) -> None:
        self.cents_per_credit = cents_per_credit
        self.jobs: list[JobRecord] = []
        self._balances: dict[str, int] = {}

    # ---- balance management -------------------------------------------------

    def grant_credits(self, tenant_id: str, credits: int) -> int:
        if credits < 0:
            raise ValueError("credits must be non-negative")
        self._balances[tenant_id] = self._balances.get(tenant_id, 0) + credits
        return self._balances[tenant_id]

    def balance(self, tenant_id: str) -> int:
        return self._balances.get(tenant_id, 0)

    # ---- the job lifecycle --------------------------------------------------

    def open_job(
        self, resolution: CredentialResolution, workflow: str
    ) -> JobRecord:
        """Reserve credits and open a job. Raises before any provider call."""
        if workflow not in WORKFLOW_CREDITS:
            raise KeyError(f"unpriced workflow: {workflow}")
        price = WORKFLOW_CREDITS[workflow]

        if resolution.billable:
            available = self.balance(resolution.tenant_id)
            if available < price:
                raise InsufficientCreditsError(
                    f"tenant {resolution.tenant_id} needs {price} credits for "
                    f"'{workflow}' but holds {available}"
                )
            self._balances[resolution.tenant_id] = available - price

        job = JobRecord(
            tenant_id=resolution.tenant_id,
            provider=resolution.provider,
            workflow=workflow,
            payer=resolution.payer,
            billable=resolution.billable,
            billed_credits=price if resolution.billable else 0,
            cost_centre=resolution.cost_centre,
        )
        self.jobs.append(job)
        return job

    def close_job(
        self,
        job: JobRecord,
        *,
        cost_cents: int,
        status: JobStatus = JobStatus.SUCCEEDED,
        error: str | None = None,
    ) -> JobRecord:
        """Record the real provider cost. Refunds credits on failure."""
        job.cost_cents = max(0, cost_cents)
        job.status = status
        job.error = error

        if status is JobStatus.FAILED and job.billable and job.billed_credits:
            # Never charge for a failed generation.
            self._balances[job.tenant_id] = (
                self.balance(job.tenant_id) + job.billed_credits
            )
            job.billed_credits = 0
        return job

    # ---- reporting ----------------------------------------------------------

    def margin_report(self) -> dict[str, int]:
        """Totals across the ledger, in cents. Internal work shows as pure cost."""
        revenue = sum(
            j.billed_credits * self.cents_per_credit
            for j in self.jobs
            if j.status is JobStatus.SUCCEEDED
        )
        cost = sum(j.cost_cents for j in self.jobs)
        internal = sum(
            j.cost_cents for j in self.jobs if j.payer is TenantMode.INTERNAL
        )
        return {
            "revenue_cents": revenue,
            "cost_cents": cost,
            "margin_cents": revenue - cost,
            "internal_cost_cents": internal,
        }
