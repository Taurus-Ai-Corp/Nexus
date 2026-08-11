"""Vertex Imagen adapter — image generation via Vertex AI.

Same known limitation as `vertex_veo.py`: `credential.reveal()` here is a
`GOOGLE_APPLICATION_CREDENTIALS` file path forwarded as an opaque bearer
value, not a real OAuth access token. See that module's docstring for why
this is a documented leftover rather than a fix made in this stage.
"""

from __future__ import annotations

from ..tenancy import CredentialResolution, Provider
from .base import GenerationAdapter, GenerationError, GenerationRequest, GenerationResult, redact

_ENDPOINT = "https://us-central1-aiplatform.googleapis.com/v1/{model}:predict"


class VertexImagenAdapter(GenerationAdapter):
    provider = Provider.VERTEX_IMAGEN

    def __init__(self, transport=None, *, model: str = "imagen-3.0") -> None:
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
                redact(f"vertex imagen generation failed: {exc}", secret)
            ) from exc

        predictions = body.get("predictions") or []
        image_uri = predictions[0].get("imageUri") if predictions else None

        return GenerationResult(
            provider=self.provider,
            output_url=image_uri,
            output_text=None,
            raw_usage=body.get("metadata", {}),
        )
