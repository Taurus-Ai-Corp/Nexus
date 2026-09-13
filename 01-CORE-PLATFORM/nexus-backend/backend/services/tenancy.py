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
from datetime import UTC, datetime
from enum import Enum


class TenantMode(str, Enum):
    """Who pays, and whether we bill for it."""

    MANAGED = "managed"
    """Client uses our platform key. We meter AND bill them."""

    BYOK = "byok"
    """Client brings their own key. We meter for quota/analytics, bill nothing."""

    INTERNAL = "internal"
    """Our own company work. Our key, metered to a cost centre, never billed."""

    FREE = "free"
    """Prospect on the free tier. A dedicated FREE_TIER_API_KEY, metered against a
    hard monthly quota, never billed.

    Deliberately NOT a variant of INTERNAL, even though neither is billed. They
    differ on the two things that matter:

      * Key. INTERNAL spends the company platform key. FREE spends its own, so a
        spike or an abuse run throttles free traffic ALONE and leaves paying work
        and internal work untouched. Same reason you do not put the shop float in
        the same drawer as the takings.
      * Ceiling. INTERNAL is uncapped and costed to a cost centre after the fact.
        FREE is capped BEFORE the call — 2 generations per calendar month per
        email — because an uncapped free tier is just an unbilled paid tier.

    Like INTERNAL it may not touch SUBSCRIPTION-tier providers, but for a stricter
    reason: INTERNAL is barred from reselling metered access, whereas FREE is
    serving an anonymous member of the public, which no consumer subscription
    licence contemplates at all.
    """


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

#: The free tier spends this key and only this key. Keep it distinct from
#: GEMINI_API_KEY even if both point at the same Google project today — the
#: separation is what lets you revoke, rotate or rate-limit free traffic without
#: touching paying work, and what makes free-tier spend legible on its own line.
FREE_TIER_ENV_VAR = "FREE_TIER_API_KEY"

#: Free work is costed here rather than to a client. It is a real cost, just not
#: a billable one, and burying it in "unattributed" is how a free tier quietly
#: becomes expensive.
FREE_TIER_COST_CENTRE = "free-tier"

#: Generations a free email may hold. Owner decision, 2026-09-13; capped rather
#: than accumulating on 2026-09-13 by a second owner decision.
#:
#: This is a CEILING, not a monthly increment. The month's grant tops the
#: balance UP to this number, it does not add this number — so an email that
#: never generates still holds 2, not 2 per idle month. Adding would have meant
#: someone who signed up and waited a year arrived with 24 free generations.
#:
#: The reset is not a scheduled job: grants carry the idempotency key
#: "free:<email>:<YYYY-MM>", and credit_ledger.idempotency_key is UNIQUE, so the
#: same email is topped up at most once per month and the new month simply has
#: a new key. Nothing to schedule means nothing to fail to run.
FREE_TIER_MONTHLY_GENERATIONS = 2

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
        """True when a generation produces REVENUE.

        Note this is no longer the same question as `consumes_quota`. It used to
        be, and that conflation is what would have made the free tier unlimited:
        `open_job()` decremented only when billable, so a non-billable FREE job
        took nothing from its allowance.
        """
        return self.mode is TenantMode.MANAGED

    @property
    def consumes_quota(self) -> bool:
        """True when a generation should DECREMENT the tenant's allowance.

        Two different questions, deliberately separated:

            is_billable     -> did this earn money?
            consumes_quota  -> did this use up what the tenant was given?

        MANAGED answers yes to both. FREE answers yes only here: a free
        generation costs the free key real quota and must count against the 2/month,
        but it must never appear as revenue or it corrupts the margin view that
        rates.py and the generation_margin SQL view exist to protect.

        BYOK is no on both — the client's own key is paying, so there is nothing
        of ours to use up. INTERNAL is no on both by design: company work is
        costed to a cost centre after the fact, not capped in advance.
        """
        return self.mode in (TenantMode.MANAGED, TenantMode.FREE)


@dataclass(frozen=True)
class CredentialResolution:
    """The answer. `secret` is deliberately excluded from repr and logging."""

    provider: Provider
    tenant_id: str
    payer: TenantMode
    billable: bool
    #: Decrement the tenant's allowance for this job. Separate from `billable`:
    #: a FREE job consumes quota and earns nothing. Defaulted so existing
    #: constructions keep their old meaning (billable implies counted).
    consumes_quota: bool
    cost_centre: str | None
    _secret: str = field(repr=False)

    def reveal(self) -> str:
        """Explicit accessor, so grep for `.reveal()` finds every use site."""
        return self._secret

    def __str__(self) -> str:  # pragma: no cover - trivial
        return (
            f"CredentialResolution(provider={self.provider.value}, "
            f"tenant={self.tenant_id}, payer={self.payer.value}, "
            f"billable={self.billable}, consumes_quota={self.consumes_quota})"
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
            consumes_quota=False,  # client's own key pays; nothing of ours to use up
            cost_centre=None,
            _secret=secret,
        )

    if tenant.mode is TenantMode.FREE:
        # A dedicated key, never the platform one. The whole point of the free
        # tier is that its worst day cannot become a paying customer's worst day:
        # if free traffic is abused or simply succeeds, it exhausts FREE_TIER_API_KEY
        # and nothing else. Reusing the platform key would couple them.
        #
        # This deliberately ignores PROVIDER_ENV_VAR: the free tier is one key for
        # one provider by design. Free users get the cheap fast model, not a menu.
        secret = env.get(FREE_TIER_ENV_VAR)
        if not secret:
            raise CredentialMissingError(
                f"tenant {tenant.id} is on the free tier but {FREE_TIER_ENV_VAR} "
                f"is not set. Set it to a key whose quota you are willing to give "
                f"away, and never to the platform key."
            )
        return CredentialResolution(
            provider=provider,
            tenant_id=tenant.id,
            payer=TenantMode.FREE,
            billable=False,
            consumes_quota=True,  # the whole point: free is capped, not unlimited
            cost_centre=FREE_TIER_COST_CENTRE,
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
        consumes_quota=tenant.consumes_quota,
        cost_centre=tenant.cost_centre if tenant.mode is TenantMode.INTERNAL else None,
        _secret=secret,
    )


def free_tier_tenant(email: str) -> Tenant:
    """A Tenant for one free-tier email.

    The email IS the tenant id. There is no account, no row to create ahead of
    time, and no signup table: the ledger's customer_key does that work already.
    Normalised to lowercase so Bob@x.com and bob@x.com are one person and not
    two quotas.
    """
    normalised = email.strip().lower()
    if "@" not in normalised or len(normalised) < 3:
        raise TenancyError(f"not an email address: {email!r}")
    return Tenant(
        id=f"free:{normalised}",
        mode=TenantMode.FREE,
        cost_centre=FREE_TIER_COST_CENTRE,
        # Free users get exactly one provider. Widening this is a pricing
        # decision, not a config tweak.
        allowed_providers=frozenset({Provider.GEMINI}),
    )


def free_tier_grant_key(email: str, *, now: datetime | None = None) -> str:
    """Idempotency key for this email's monthly free grant.

    This single string is the entire monthly-reset mechanism. Because
    credit_ledger.idempotency_key is UNIQUE, granting with
    "free:<email>:2026-09" succeeds once and is a no-op every other time that
    month; October produces "free:<email>:2026-10", a key that has never been
    seen, so the grant lands again.

    There is no cron, no reset job and no "did the monthly task run?" question —
    which matters because a reset job that silently stops running gives every
    free user unlimited access without anything failing.

    UTC deliberately: a local-timezone month boundary would hand a second monthly
    grant to anyone who travels, or to everyone if the server moves region.
    """
    normalised = email.strip().lower()
    stamp = (now or datetime.now(UTC)).strftime("%Y-%m")
    return f"free:{normalised}:{stamp}"
