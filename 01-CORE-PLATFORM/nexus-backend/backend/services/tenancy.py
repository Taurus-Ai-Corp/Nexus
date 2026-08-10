"""
Nexus Platform — tenancy and credential resolution.

The whole two-sided model reduces to one question, asked once per generation call:

    "Whose key pays for this, and do we bill anyone?"

`resolve_credentials()` is the single place that answers it. Same generation
pipeline, three billing behaviours, one `TenantMode` field.

It also enforces the licensing boundary in code rather than in a wiki page:
subscription-tier providers (NotebookLM consumer, Google Flow, Higgsfield
subscription credits) may NOT be resold to a paying client. They are for
internal, done-for-you work where the deliverable is the output file. API-tier
providers (Gemini, Vertex Veo/Imagen) are commercially licensed and resellable.

No credential VALUE is ever logged, repr'd, or returned in an error message.
"""

from __future__ import annotations

import os
from collections.abc import Callable
from dataclasses import dataclass, field
from enum import Enum


class TenantMode(str, Enum):
    """Who pays, and whether we bill for it."""

    MANAGED = "managed"
    """Client uses our platform key. We meter AND bill them."""

    BYOK = "byok"
    """Client brings their own key. We meter for quota/analytics, bill nothing."""

    INTERNAL = "internal"
    """Our own company work. Our key, metered to a cost centre, never billed."""


class ProviderTier(str, Enum):
    """Whether a provider may legally be resold to a paying third party."""

    API = "api"
    """Commercially licensed API. Safe to resell to clients."""

    SUBSCRIPTION = "subscription"
    """Consumer/seat subscription. Internal use only — the deliverable may be
    sold, but metered access to the tool may not."""


class Provider(str, Enum):
    GEMINI = "gemini"
    VERTEX_VEO = "vertex_veo"
    VERTEX_IMAGEN = "vertex_imagen"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    HIGGSFIELD_API = "higgsfield_api"
    # --- subscription tier: internal use only ---
    NOTEBOOKLM = "notebooklm"
    GOOGLE_FLOW = "google_flow"
    HIGGSFIELD_SUB = "higgsfield_sub"


#: Licensing classification. Changing an entry here changes what may be sold,
#: so treat edits as a commercial decision, not a refactor.
PROVIDER_TIER: dict[Provider, ProviderTier] = {
    Provider.GEMINI: ProviderTier.API,
    Provider.VERTEX_VEO: ProviderTier.API,
    Provider.VERTEX_IMAGEN: ProviderTier.API,
    Provider.OPENAI: ProviderTier.API,
    Provider.ANTHROPIC: ProviderTier.API,
    Provider.HIGGSFIELD_API: ProviderTier.API,
    Provider.NOTEBOOKLM: ProviderTier.SUBSCRIPTION,
    Provider.GOOGLE_FLOW: ProviderTier.SUBSCRIPTION,
    Provider.HIGGSFIELD_SUB: ProviderTier.SUBSCRIPTION,
}

#: Env var holding the platform/company key for each provider.
#: Subscription-tier providers have no key here on purpose — they are driven by
#: a human through a UI, not by the request pipeline.
PROVIDER_ENV_VAR: dict[Provider, str] = {
    Provider.GEMINI: "GEMINI_API_KEY",
    Provider.VERTEX_VEO: "GOOGLE_APPLICATION_CREDENTIALS",
    Provider.VERTEX_IMAGEN: "GOOGLE_APPLICATION_CREDENTIALS",
    Provider.OPENAI: "OPENAI_API_KEY",
    Provider.ANTHROPIC: "ANTHROPIC_API_KEY",
    Provider.HIGGSFIELD_API: "HIGGSFIELD_API_KEY",
}


class TenancyError(RuntimeError):
    """Base class for resolution failures. Never carries a credential value."""


class ProviderNotResellableError(TenancyError):
    """A billable tenant tried to use a subscription-tier provider."""


class CredentialMissingError(TenancyError):
    """No usable credential for this tenant/provider pair."""


@dataclass(frozen=True)
class Tenant:
    id: str
    mode: TenantMode
    #: Cost centre for INTERNAL work (e.g. "nexus-social", "client-delivery").
    cost_centre: str | None = None
    #: Providers this tenant is allowed to touch. Empty set means "all API tier".
    allowed_providers: frozenset[Provider] = field(default_factory=frozenset)

    @property
    def is_billable(self) -> bool:
        """True when a generation should decrement credits and produce revenue."""
        return self.mode is TenantMode.MANAGED


@dataclass(frozen=True)
class CredentialResolution:
    """The answer. `secret` is deliberately excluded from repr and logging."""

    provider: Provider
    tenant_id: str
    payer: TenantMode
    billable: bool
    cost_centre: str | None
    _secret: str = field(repr=False)

    def reveal(self) -> str:
        """Explicit accessor, so grep for `.reveal()` finds every use site."""
        return self._secret

    def __str__(self) -> str:  # pragma: no cover - trivial
        return (
            f"CredentialResolution(provider={self.provider.value}, "
            f"tenant={self.tenant_id}, payer={self.payer.value}, "
            f"billable={self.billable})"
        )


#: Signature for looking up a BYOK secret. Kept as a callable so this module
#: never imports a database and stays unit-testable.
ByokLookup = Callable[[str, Provider], str | None]


def resolve_credentials(
    tenant: Tenant,
    provider: Provider,
    *,
    byok_lookup: ByokLookup | None = None,
    env: dict[str, str] | None = None,
) -> CredentialResolution:
    """Resolve which credential pays for a generation, enforcing the licence tier.

    Raises:
        ProviderNotResellableError: billable tenant requested a subscription-tier tool.
        CredentialMissingError: no key available for the resolved payer.
    """
    env = os.environ if env is None else env
    tier = PROVIDER_TIER.get(provider)
    if tier is None:
        raise TenancyError(f"unknown provider: {provider}")

    # --- the licensing boundary, enforced at runtime ---
    if tier is ProviderTier.SUBSCRIPTION and tenant.mode is not TenantMode.INTERNAL:
        raise ProviderNotResellableError(
            f"{provider.value} is subscription-tier and cannot be served to a "
            f"'{tenant.mode.value}' tenant. Use it for internal done-for-you work "
            f"and deliver the output as a file, or switch to an API-tier provider."
        )

    if tenant.allowed_providers and provider not in tenant.allowed_providers:
        raise TenancyError(
            f"tenant {tenant.id} is not entitled to {provider.value}"
        )

    if tenant.mode is TenantMode.BYOK:
        if byok_lookup is None:
            raise CredentialMissingError(
                f"tenant {tenant.id} is BYOK but no byok_lookup was supplied"
            )
        secret = byok_lookup(tenant.id, provider)
        if not secret:
            raise CredentialMissingError(
                f"tenant {tenant.id} has no stored key for {provider.value}"
            )
        return CredentialResolution(
            provider=provider,
            tenant_id=tenant.id,
            payer=TenantMode.BYOK,
            billable=False,
            cost_centre=None,
            _secret=secret,
        )

    # MANAGED and INTERNAL both spend the platform key; only MANAGED is billed.
    var = PROVIDER_ENV_VAR.get(provider)
    secret = env.get(var) if var else None
    if not secret:
        raise CredentialMissingError(
            f"no platform credential for {provider.value} "
            f"(expected env var {var or '<unmapped>'})"
        )

    return CredentialResolution(
        provider=provider,
        tenant_id=tenant.id,
        payer=tenant.mode,
        billable=tenant.is_billable,
        cost_centre=tenant.cost_centre if tenant.mode is TenantMode.INTERNAL else None,
        _secret=secret,
    )
