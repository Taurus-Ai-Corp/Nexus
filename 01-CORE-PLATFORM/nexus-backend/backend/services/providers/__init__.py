"""
Nexus Platform — async generation-adapter layer over the API-tier providers.

Wraps Gemini, Vertex Veo, Vertex Imagen, and the Higgsfield API behind one
`GenerationAdapter` interface and a single orchestration entry point,
`generate_and_bill`, that enforces the existing tenancy + metering contract:

    resolve_credentials(...) -> ledger.open_job(...) -> await adapter.generate(...)
    -> ledger.close_job(...)

Pricing policy (full reasoning in `rates.py`): no provider price is invented
here. Every `ProviderRate` in `PROVIDER_RATES` carries `verified_on=None` and
the explicit sentinel `cents_per_unit=Decimal("0")` — never a plausible-looking
real number. Every job closed through `generate_and_bill` is billed
`cost_cents=0` and, on success, stamped with `JobRecord.cost_basis =
CostBasis.UNVERIFIED` (see `metering.py`), until a human confirms a real rate.
`JobRecord.error` stays `None` on success, exactly like any other job.

Subscription-tier providers (`NOTEBOOKLM`, `GOOGLE_FLOW`, `HIGGSFIELD_SUB`)
have no adapter in this package on purpose — see `orchestrator.ADAPTERS`.
"""

from .base import (
    AiohttpTransport,
    GenerationAdapter,
    GenerationError,
    GenerationRequest,
    GenerationResult,
    HttpTransport,
)
from .gemini import GeminiAdapter
from .higgsfield import HiggsfieldApiAdapter
from .orchestrator import ADAPTERS, generate_and_bill
from .rates import PROVIDER_RATES
from .vertex_imagen import VertexImagenAdapter
from .vertex_veo import VertexVeoAdapter

__all__ = [
    "ADAPTERS",
    "PROVIDER_RATES",
    "AiohttpTransport",
    "GenerationAdapter",
    "GenerationError",
    "GenerationRequest",
    "GenerationResult",
    "GeminiAdapter",
    "HiggsfieldApiAdapter",
    "HttpTransport",
    "VertexImagenAdapter",
    "VertexVeoAdapter",
    "generate_and_bill",
]
