"""
Pricing policy for the generation-adapter layer.

`metering.ProviderRate` already carries the rule that matters: `verified_on`
stays `None` until a human confirms a real price. This module does not break
that rule and does not work around it — it follows the more conservative of
the two honest options the assignment allows:

    "derive cost_cents from usage the provider actually returns", OR
    "record cost_cents=0 with an explicit machine-readable 'rate unverified'
     marker on the job"

This module picks the **second** option. No adapter here has a confirmed
provider price, and per-token/per-second pricing pages change without notice,
so deriving a number from `raw_usage` today would just be an invented rate
wearing a usage-based costume. Every job closed through `generate_and_bill`
is billed `cost_cents=0` and stamped with `JobRecord.cost_basis =
CostBasis.UNVERIFIED` (see `metering.py` and `orchestrator.py`) — `error`
stays `None` on success, so a null-checking query still means "this job
failed". `GenerationResult.raw_usage` still carries whatever usage the
provider reported, unmodified, so a human who confirms a real
`cents_per_unit` can backfill true cost later without touching this module's
billing path.

`PROVIDER_RATES` exists as the registration point for that future rate, not
as a price list. Every entry's `cents_per_unit` is the explicit sentinel
`Decimal("0")` — never a plausible-looking number — and every entry's
`verified_on` is `None`. Do not fill in a number here without a human
confirming it and setting `verified_on`.
"""

from __future__ import annotations

from decimal import Decimal

from ..metering import ProviderRate
from ..tenancy import Provider

#: Registration point for a confirmed price. Every value is an explicit
#: "not yet priced" sentinel (`cents_per_unit=0`, `verified_on=None`) — see
#: module docstring. Filling in a plausible number without human
#: confirmation is exactly the mistake this file exists to prevent.
PROVIDER_RATES: dict[Provider, ProviderRate] = {
    Provider.GEMINI: ProviderRate(
        Provider.GEMINI, cents_per_unit=Decimal("0"), unit="unverified"
    ),
    Provider.VERTEX_VEO: ProviderRate(
        Provider.VERTEX_VEO, cents_per_unit=Decimal("0"), unit="unverified"
    ),
    Provider.VERTEX_IMAGEN: ProviderRate(
        Provider.VERTEX_IMAGEN, cents_per_unit=Decimal("0"), unit="unverified"
    ),
    Provider.HIGGSFIELD_API: ProviderRate(
        Provider.HIGGSFIELD_API, cents_per_unit=Decimal("0"), unit="unverified"
    ),
}
