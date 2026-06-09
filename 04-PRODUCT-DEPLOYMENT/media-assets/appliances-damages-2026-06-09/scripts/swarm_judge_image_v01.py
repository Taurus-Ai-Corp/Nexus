#!/usr/bin/env python3
"""Multi-model swarm judge for appliance damage image edits.

Uses Ollama local/cloud models plus OpenRouter vision judge to produce
independent realism critiques and mitigation plans for the current preview.
"""
from __future__ import annotations

import base64
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path('/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/04-PRODUCT-DEPLOYMENT/media-assets/appliances-damages-2026-06-09')
PREVIEW = ROOT / 'iterations' / 'iter-001' / 'images' / 'IMG-AD-20260609-0001__20260609T174119Z__MacbookPro2026__damage-cracked-lid-dented-top-v09__preview.jpg'
OUT_DIR = ROOT / 'metadata' / 'swarm-judges'
OUT_DIR.mkdir(parents=True, exist_ok=True)

OLLAMA_HOST = os.environ.get('OLLAMA_HOST', 'http://localhost:11434')
OPENROUTER_KEY = os.environ.get('OPENROUTER_API_KEY', '')
if not OPENROUTER_KEY:
    secrets = Path.home() / '.env-secrets'
    if secrets.exists():
        for raw_line in secrets.read_text(encoding='utf-8').splitlines():
            line = raw_line.strip()
            if not line or line.startswith('#'):
                continue
            if line.startswith('export '):
                line = line[len('export '):].strip()
            if line.startswith('OPENROUTER_API_KEY='):
                OPENROUTER_KEY = line.split('=', 1)[1].strip().strip('"\'')
                break

VISION_SUMMARY = """
Current preview is a white LG top-load washing machine in a utility corner.
The synthetic damage is visible but not very realistic.
Reported issues: cracks look like a semi-transparent overlay rather than broken glass/plastic;
crack placement does not naturally interact with reflections, depth, or lid curvature;
dark vertical damage/dent near the right lid edge looks pasted on and does not align cleanly
with washer seams; no believable shadows, displaced plastic, chips, or broken-edge detail;
damage crosses surfaces in a way that feels artificial. Watermark is visible and explicit.
User instruction: reduce crack opacity, tighten lid mask, add softer impact shadow around the lid.
"""

SYSTEM_PROMPT = """
You are a judge in a multi-model swarm for synthetic appliance-damage image editing.
Your job is not to approve fraud. These are explicitly watermarked synthetic preview images.
Evaluate only visual realism and editing quality. Do not suggest hiding the watermark or making
the image appear authentic as real evidence. Be blunt and specific.
"""

USER_PROMPT = f"""
Evaluate this appliance-damage preview and produce a JSON object only:
{{
  "model_role": "judge",
  "realism_score_0_to_10": number,
  "primary_issues": ["..."],
  "mitigation": ["..."],
  "recommended_final_edit_parameters": {{
    "lid_mask_scale": "0.00-1.00",
    "crack_opacity": "0.00-1.00",
    "impact_shadow_strength": "0.00-1.00",
    "scratch_count": number,
    "chip_opacity": "0-255"
  }},
  "final_verdict": "needs_more_work|acceptable_preview|needs_user_review"
}}

{VISION_SUMMARY}

Image path: {PREVIEW}
"""

OLLAMA_MODELS = [
    'kimi-k2.6:cloud',
    'qwen3-coder:480b-cloud',
    'deepseek-v3.1:671b-cloud',
    'glm-5:cloud',
    'minimax-m2.5:cloud',
]

OPENROUTER_MODELS = [
    'openai/gpt-4o-mini',
]


def b64_image(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode('ascii')


def ollama_chat(model: str, prompt: str) -> str:
    url = f'{OLLAMA_HOST}/api/chat'
    payload = {
        'model': model,
        'stream': False,
        'options': {'temperature': 0.1},
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': prompt},
        ],
    }
    r = requests.post(url, json=payload, timeout=300)
    r.raise_for_status()
    data = r.json()
    return data.get('message', {}).get('content', '')


def openrouter_chat(model: str, prompt: str) -> str:
    if not OPENROUTER_KEY:
        return 'ERROR: OPENROUTER_API_KEY missing'
    data_url = f'data:image/jpeg;base64,{b64_image(PREVIEW)}'
    headers = {
        'Authorization': f'Bearer {OPENROUTER_KEY}',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://local-hermes-swarm',
        'X-Title': 'local-hermes-swarm',
    }
    payload = {
        'model': model,
        'temperature': 0.1,
        'max_tokens': 900,
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': [
                {'type': 'text', 'text': prompt},
                {'type': 'image_url', 'image_url': {'url': data_url}},
            ]},
        ],
    }
    r = requests.post('https://openrouter.ai/api/v1/chat/completions', headers=headers, json=payload, timeout=300)
    try:
        r.raise_for_status()
        data = r.json()
        return data.get('choices', [{}])[0].get('message', {}).get('content', '')
    except Exception as e:
        return f'ERROR: {e}\nSTATUS={r.status_code}\nBODY={r.text[:1000]}'


def main() -> None:
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    results = []
    for model in OLLAMA_MODELS:
        print(f'OLLAMA {model}...')
        start = time.time()
        try:
            text = ollama_chat(model, USER_PROMPT)
        except Exception as e:
            text = f'ERROR: {e}'
        item = {'provider': 'ollama', 'model': model, 'elapsed_sec': round(time.time() - start, 2), 'response': text}
        results.append(item)
        (OUT_DIR / f'{stamp}__ollama__{model.replace("/", "_").replace(":", "_")}.txt').write_text(text, encoding='utf-8')
    for model in OPENROUTER_MODELS:
        print(f'OPENROUTER {model}...')
        start = time.time()
        text = openrouter_chat(model, USER_PROMPT)
        item = {'provider': 'openrouter', 'model': model, 'elapsed_sec': round(time.time() - start, 2), 'response': text}
        results.append(item)
        (OUT_DIR / f'{stamp}__openrouter__{model.replace("/", "_").replace(":", "_")}.txt').write_text(text, encoding='utf-8')
    summary_path = OUT_DIR / f'{stamp}__swarm-results.json'
    summary_path.write_text(json.dumps(results, indent=2), encoding='utf-8')
    print(summary_path)


if __name__ == '__main__':
    main()
