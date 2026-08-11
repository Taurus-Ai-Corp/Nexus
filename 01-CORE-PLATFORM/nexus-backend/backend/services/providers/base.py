"""
Shared shapes for the generation-adapter layer.

`GenerationAdapter` is the one interface every provider adapter implements.
`HttpTransport` is the seam that makes adapters testable: adapters never touch
`aiohttp` (or any network library) directly, they call `self._transport`. The
default transport (`AiohttpTransport`) does real I/O; tests inject a fake that
returns canned JSON with no network access and no API keys.

Credential discipline matches `tenancy.py`: adapters only ever call
`credential.reveal()` at the point they build a request header, never store
the revealed value, and redact it out of any exception text via `_redact`
before it can reach a log line, a raised error, or a job's `error` field.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Protocol

from ..tenancy import CredentialResolution, Provider


class GenerationError(RuntimeError):
    """A provider call failed. Never carries a credential value."""


def redact(text: str, *secrets: str | None) -> str:
    """Strip any known secret value out of a string before it is raised/logged."""
    for secret in secrets:
        if secret:
            text = text.replace(secret, "***")
    return text


@dataclass(frozen=True)
class GenerationRequest:
    """Provider-agnostic generation request. `params` carries provider-specific
    knobs (e.g. `aspect_ratio`, `duration_s`) so adapters stay narrow."""

    prompt: str
    workflow: str
    params: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class GenerationResult:
    """What an adapter hands back to the orchestrator.

    `cost_cents` and `rate_verified` are decided by the orchestrator's pricing
    policy (see `rates.py`), not by the adapter — the adapter only reports what
    the provider actually returned. `raw_usage` is kept verbatim so a human can
    compute a real cost retroactively once a rate is confirmed, without needing
    to change this module first.
    """

    provider: Provider
    output_url: str | None
    output_text: str | None
    raw_usage: dict[str, Any] = field(default_factory=dict)


class HttpTransport(Protocol):
    """The only way an adapter is allowed to reach the network.

    Injectable so tests never make a real request. Implementations must be
    non-blocking (`async def`) — no `requests`, no sync socket calls.
    """

    async def post_json(
        self,
        url: str,
        *,
        headers: dict[str, str],
        json: dict[str, Any],
        timeout: float = 60.0,
    ) -> dict[str, Any]:
        """POST `json` to `url`, return the parsed JSON response body.

        Must raise `GenerationError` (or let a lower-level exception propagate)
        on a non-2xx response or transport failure.
        """
        ...


class AiohttpTransport:
    """Default `HttpTransport`. Opens one short-lived session per call.

    Never imported by test code — tests construct adapters with a fake
    transport instead, so this class makes no network call under `pytest`.
    """

    async def post_json(
        self,
        url: str,
        *,
        headers: dict[str, str],
        json: dict[str, Any],
        timeout: float = 60.0,
    ) -> dict[str, Any]:
        import aiohttp

        client_timeout = aiohttp.ClientTimeout(total=timeout)
        async with aiohttp.ClientSession(timeout=client_timeout) as session:
            async with session.post(url, headers=headers, json=json) as resp:
                body = await resp.json()
                if resp.status >= 400:
                    raise GenerationError(
                        f"provider returned HTTP {resp.status} for {url.split('?')[0]}"
                    )
                return body


class GenerationAdapter(ABC):
    """One adapter per API-tier provider. All I/O is async and goes through
    the injected `HttpTransport` so the layer is testable without a network."""

    provider: Provider

    def __init__(self, transport: HttpTransport | None = None) -> None:
        self._transport: HttpTransport = transport or AiohttpTransport()

    @abstractmethod
    async def generate(
        self, request: GenerationRequest, *, credential: CredentialResolution
    ) -> GenerationResult:
        """Run one generation. Must raise `GenerationError` on provider failure
        and must never let `credential.reveal()` reach the exception text."""
        raise NotImplementedError
