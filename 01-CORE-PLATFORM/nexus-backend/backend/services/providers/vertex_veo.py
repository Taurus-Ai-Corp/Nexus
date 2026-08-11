"""Vertex Veo adapter — video generation via Vertex AI.

Known limitation (leftover, not fixed in this stage): `tenancy.PROVIDER_ENV_VAR`
maps both `VERTEX_VEO` and `VERTEX_IMAGEN` to `GOOGLE_APPLICATION_CREDENTIALS`,
i.e. a path to a service-account JSON key, not a bearer token. Real Vertex AI
calls need an OAuth access token exchanged from that service account (ADC /
`google-auth`), which is not a dependency of this repo and is out of scope for
this stage (`tenancy.py` is frozen — see the assignment). This adapter forwards
`credential.reveal()` as an opaque `Authorization: Bearer` value so the
adapter/orchestration contract (transport injection, error handling, no
credential leakage) is exercised end-to-end; wiring real ADC token exchange is
a follow-up, not a redesign of this layer.
"""

from __future__ import annotations

from ..tenancy import CredentialResolution, Provider
from .base import GenerationAdapter, GenerationError, GenerationRequest, GenerationResult, redact

_ENDPOINT = "https://us-central1-aiplatform.googleapis.com/v1/{model}:predict"


class VertexVeoAdapter(GenerationAdapter):
    provider = Provider.VERTEX_VEO

    def __init__(self, transport=None, *, model: str = "veo-2.0") -> None:
        super().__init__(transport)
        self._model = model

    async def generate(
        self, request: GenerationRequest, *, credential: CredentialResolution
    ) -> GenerationResult:
        secret = credential.reveal()
        url = _ENDPOINT.format(model=self._model)
        headers = {"Authorization": f"Bearer {secret}", "content-type": "application/json"}
        payload = {
            "instances": [{"prompt": request.prompt}],
            "parameters": request.params,
        }
        try:
            body = await self._transport.post_json(url, headers=headers, json=payload)
        except Exception as exc:
            raise GenerationError(
                redact(f"vertex veo generation failed: {exc}", secret)
            ) from exc

        predictions = body.get("predictions") or []
        video_uri = predictions[0].get("videoUri") if predictions else None

        return GenerationResult(
            provider=self.provider,
            output_url=video_uri,
            output_text=None,
            raw_usage=body.get("metadata", {}),
        )
