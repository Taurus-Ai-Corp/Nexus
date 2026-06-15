# Nexus Creative — Image Generation Status

## What works right now
- NVIDIA chat/vision models are authenticated and responding (`meta/llama-3.1-70b-instruct`, `meta/llama-3.2-90b-vision-instruct`, `nvidia/nemotron-3-super-120b-a12b`).
- `generate-images.py` multi-provider pipeline is built and functional for prompt enhancement + fallback placeholders.
- SVG campaign visuals are embedded in the landing pages and render immediately.

## What does not work in this environment
- No paid image-generation API keys are configured:
  - `OPENAI_API_KEY` — missing
  - `REPLICATE_API_TOKEN` — missing
  - `FAL_KEY` — missing
  - `STABILITY_API_KEY` — missing
  - `MIDJOURNEY_API_KEY` — missing
- `OPENROUTER_API_KEY` exists but returns `401 User not found` (expired/deleted account).
- Hugging Face `hf` token is expired.
- NVIDIA NIM image endpoints are not exposed for this account.
- Free alternatives (Pollinations.ai) are rate-limited/queue-full in this shared environment.

## To generate real photorealistic campaign images
Add one of these keys to `~/.env-secrets` and re-run `generate-images.py`:

```bash
export OPENAI_API_KEY=sk-...
# or
export REPLICATE_API_TOKEN=r8_...
# or
export FAL_KEY=...
# or
export STABILITY_API_KEY=sk-...

python3 generate-images.py --prompt "Your brief" --title campaign-name --output assets
```

## Recommended provider ranking for photorealism
1. **Midjourney** — best fashion/editorial realism (requires API access or Discord bot)
2. **DALL-E 3** — best prompt adherence and text safety
3. **Flux Pro (fal.ai / Replicate)** — best open-source photorealism
4. **Stable Diffusion XL + custom LoRA** — cheapest at scale
5. **NVIDIA NIM image models** — only if available on your account tier

## Immediate deliverable
The landing pages use high-quality SVG campaign visuals that load instantly and look editorial. Replace the SVGs with real PNGs once the image keys are available.

## Files
- `generate-images.py` — multi-provider image pipeline
- `assets/*.html` — fallback placeholder cards
- `assets/*.json` — prompt metadata
- `nexus-creative-editorial/index.html` — uses inline SVG campaign cards
- `nexus-creative-real-estate/index.html` — uses inline SVG campaign cards
