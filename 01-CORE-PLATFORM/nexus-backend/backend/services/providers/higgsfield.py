"""Higgsfield API adapter — the commercially-licensed API tier only.

Not to be confused with `Provider.HIGGSFIELD_SUB` (subscription tier), which
has no adapter in this package and must never get one — see
`orchestrator.ADAPTERS` and the module docstring in `orchestrator.py`.
"""

from __future__ import annotations

from ..tenancy import CredentialResolution, Provider
from .base import GenerationAdapter, GenerationError, GenerationRequest, GenerationResult, redact

_ENDPOINT = "https://api.higgsfield.ai/v1/generate"


class HiggsfieldApiAdapter(GenerationAdapter):
    provider = Provider.HIGGSFIELD_API

    async def generate(
        self, request: GenerationRequest, *, credential: CredentialResolution
    ) -> GenerationResult:
        secret = credential.reveal()
        headers = {"Authorization": f"Bearer {secret}", "content-type": "application/json"}
        payload = {"prompt": request.prompt, **request.params}
        try:
            body = await self._transport.post_json(_ENDPOINT, headers=headers, json=payload)
        except Exception as exc:
            raise GenerationError(
                redact(f"higgsfield api generation failed: {exc}", secret)
            ) from exc

        return GenerationResult(
            provider=self.provider,
            output_url=body.get("output_url"),
            output_text=None,
            raw_usage=body.get("usage", {}),
        )
