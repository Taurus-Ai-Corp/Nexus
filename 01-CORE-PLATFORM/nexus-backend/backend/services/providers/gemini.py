"""Gemini adapter — text/multimodal generation via the Generative Language API."""

from __future__ import annotations

from typing import Any

from ..tenancy import CredentialResolution, Provider
from .base import GenerationAdapter, GenerationError, GenerationRequest, GenerationResult, redact

_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


def _first_text(body: dict[str, Any]) -> str | None:
    candidates = body.get("candidates") or []
    if not candidates:
        return None
    parts = (candidates[0].get("content") or {}).get("parts") or []
    for part in parts:
        text = part.get("text")
        if text:
            return text
    return None


class GeminiAdapter(GenerationAdapter):
    provider = Provider.GEMINI

    def __init__(self, transport=None, *, model: str = "gemini-1.5-flash") -> None:
        super().__init__(transport)
        self._model = model

    async def generate(
        self, request: GenerationRequest, *, credential: CredentialResolution
    ) -> GenerationResult:
        secret = credential.reveal()
        url = _ENDPOINT.format(model=self._model)
        headers = {"x-goog-api-key": secret, "content-type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": request.prompt}]}],
            **request.params,
        }
        try:
            body = await self._transport.post_json(url, headers=headers, json=payload)
        except Exception as exc:
            raise GenerationError(
                redact(f"gemini generation failed: {exc}", secret)
            ) from exc

        return GenerationResult(
            provider=self.provider,
            output_url=None,
            output_text=_first_text(body),
            raw_usage=body.get("usageMetadata", {}),
        )
