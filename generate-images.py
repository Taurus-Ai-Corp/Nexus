#!/usr/bin/env python3
"""
Nexus Creative — Multi-Provider Image Generation Pipeline

Tries providers in this order:
  1. OpenAI DALL-E 3            (OPENAI_API_KEY)
  2. Replicate Flux / SDXL      (REPLICATE_API_TOKEN)
  3. fal.ai Flux                (FAL_KEY)
  4. Stability AI               (STABILITY_API_KEY)
  5. Midjourney (via API)       (MIDJOURNEY_API_KEY)
  6. NVIDIA NIM LLM prompt enhancement + HTML placeholder (fallback, always works with NVIDIA_API_KEY)

For text-to-image, prefer DALL-E/Flux/Replicate over NVIDIA for photorealism.
NVIDIA key available here only drives chat/vision; it will enhance prompts.

Usage:
  export OPENAI_API_KEY=...   # or any paid image key above
  python3 generate-images.py --prompt "Luxury penthouse at golden hour" --output assets/campaign.png

Without paid keys, the script still outputs:
  - enhanced prompt JSON
 - photorealistic HTML placeholder at assets/campaign.html
"""

import argparse
import base64
import json
import os
import re
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    requests = None


def get_env_keys():
    return {
        "openai": os.environ.get("OPENAI_API_KEY", ""),
        "replicate": os.environ.get("REPLICATE_API_TOKEN", ""),
        "fal": os.environ.get("FAL_KEY", ""),
        "stability": os.environ.get("STABILITY_API_KEY", ""),
        "midjourney": os.environ.get("MIDJOURNEY_API_KEY", ""),
        "nvidia": os.environ.get("NVIDIA_API_KEY", ""),
    }


def load_keys_from_env_secrets():
    """Source ~/.env-secrets and return keys dict."""
    import subprocess
    script = """
set -a
source ~/.env-secrets 2>/dev/null || true
set +a
python3 - <<'PY'
import os, json
print(json.dumps({
    'OPENAI_API_KEY': os.environ.get('OPENAI_API_KEY',''),
    'REPLICATE_API_TOKEN': os.environ.get('REPLICATE_API_TOKEN',''),
    'FAL_KEY': os.environ.get('FAL_KEY',''),
    'STABILITY_API_KEY': os.environ.get('STABILITY_API_KEY',''),
    'MIDJOURNEY_API_KEY': os.environ.get('MIDJOURNEY_API_KEY',''),
    'NVIDIA_API_KEY': os.environ.get('NVIDIA_API_KEY',''),
}))
PY
"""
    res = subprocess.run(["bash", "-c", script], capture_output=True, text=True)
    for line in reversed(res.stdout.split("\n")):
        try:
            return json.loads(line)
        except Exception:
            continue
    return {}


def nvidia_enhance_prompt(prompt: str, nvidia_key: str) -> str:
    """Use NVIDIA chat LLM to expand a brief into a richer image prompt."""
    if not requests or not nvidia_key:
        return prompt
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {nvidia_key}", "Content-Type": "application/json"}
    system = "You are a fashion and luxury campaign art director. Expand the user's brief into a single, vivid, ultra-detailed image-generation prompt. Include lighting, camera, styling, mood, and color grade. Output only the prompt, no commentary."
    payload = {
        "model": "meta/llama-3.1-70b-instruct",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": f"Brief: {prompt}\n\nWrite one ultra-realistic image prompt:"}
        ],
        "temperature": 0.6,
        "max_tokens": 512,
    }
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=60)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"NVIDIA prompt enhancement failed: {e}", file=sys.stderr)
        return prompt


def generate_openai(prompt: str, output_file: str, api_key: str, size: str = "1024x1024"):
    url = "https://api.openai.com/v1/images/generations"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"model": "dall-e-3", "prompt": prompt, "n": 1, "size": size, "response_format": "b64_json"}
    r = requests.post(url, headers=headers, json=payload, timeout=120)
    r.raise_for_status()
    b64 = r.json()["data"][0]["b64_json"]
    Path(output_file).write_bytes(base64.b64decode(b64))
    return output_file


def generate_replicate(prompt: str, output_file: str, api_key: str, model: str = "black-forest-labs/flux-schnell"):
    url = "https://api.replicate.com/v1/predictions"
    headers = {"Authorization": f"Token {api_key}", "Content-Type": "application/json"}
    payload = {"version": model, "input": {"prompt": prompt}}
    r = requests.post(url, headers=headers, json=payload, timeout=30)
    r.raise_for_status()
    pred = r.json()
    get_url = pred["urls"]["get"]
    # Poll
    for _ in range(60):
        import time
        time.sleep(2)
        r = requests.get(get_url, headers={"Authorization": f"Token {api_key}"}, timeout=20)
        data = r.json()
        if data.get("status") == "succeeded":
            img_url = data["output"]
            if isinstance(img_url, list):
                img_url = img_url[0]
            img = requests.get(img_url, timeout=60)
            img.raise_for_status()
            Path(output_file).write_bytes(img.content)
            return output_file
        if data.get("status") == "failed":
            raise RuntimeError(f"Replicate failed: {data}")
    raise RuntimeError("Replicate prediction timed out")


def generate_fal(prompt: str, output_file: str, api_key: str):
    url = "https://fal.run/fal-ai/flux/dev"
    headers = {"Authorization": f"Key {api_key}", "Content-Type": "application/json"}
    payload = {"prompt": prompt, "image_size": "landscape_4_3"}
    r = requests.post(url, headers=headers, json=payload, timeout=180)
    r.raise_for_status()
    data = r.json()
    image_url = data.get("images", [{}])[0].get("url")
    if not image_url:
        raise RuntimeError(f"Unexpected fal response: {data}")
    img = requests.get(image_url, timeout=120)
    img.raise_for_status()
    Path(output_file).write_bytes(img.content)
    return output_file


def generate_stability(prompt: str, output_file: str, api_key: str):
    url = "https://api.stability.ai/v2beta/stable-image/generate/sd3"
    headers = {"Authorization": f"Bearer {api_key}", "Accept": "image/*"}
    files = {"prompt": (None, prompt), "output_format": (None, "png")}
    r = requests.post(url, headers=headers, files=files, timeout=120)
    r.raise_for_status()
    Path(output_file).write_bytes(r.content)
    return output_file


def generate_midjourney(prompt: str, output_file: str, api_key: str):
    # Midjourney has many unofficial APIs. This template uses the common Imagine API pattern.
    url = "https://api.imaginepro.ai/api/v1/midjourney/imagine"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"prompt": prompt}
    r = requests.post(url, headers=headers, json=payload, timeout=30)
    r.raise_for_status()
    data = r.json()
    task_id = data.get("taskId") or data.get("id")
    if not task_id:
        raise RuntimeError(f"No task ID: {data}")
    # Poll
    for _ in range(60):
        import time
        time.sleep(5)
        r = requests.get(f"{url}/{task_id}", headers=headers, timeout=20)
        d = r.json()
        if d.get("status") == "completed":
            img_url = d.get("imageUrl") or d.get("image_url")
            img = requests.get(img_url, timeout=60)
            img.raise_for_status()
            Path(output_file).write_bytes(img.content)
            return output_file
        if d.get("status") == "failed":
            raise RuntimeError(f"Midjourney failed: {d}")
    raise RuntimeError("Midjourney task timed out")


def create_html_placeholder(prompt: str, output_file: str, title: str = "Campaign Visual"):
    """Generate a photorealistic CSS/SVG placeholder that can be embedded in the landing page."""
    safe_prompt = prompt.replace("\n", " ").replace("'", "\\'")
    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {{ margin:0; width:400px; height:500px; background:#f6f3ef; display:grid; place-items:center; font-family:Inter,sans-serif; }}
.card {{ width:360px; height:460px; border-radius:8px; overflow:hidden; position:relative; background:linear-gradient(135deg,#e9e5df,#d8d2c8); box-shadow:0 20px 60px rgba(0,0,0,0.15); }}
.prompt {{ position:absolute; bottom:0; left:0; right:0; padding:20px; background:rgba(255,255,255,0.92); font-size:11px; color:#555; line-height:1.5; }}
.label {{ position:absolute; top:16px; left:16px; background:rgba(15,15,15,0.85); color:#fff; padding:6px 12px; font-size:9px; text-transform:uppercase; letter-spacing:1px; border-radius:999px; }}
</style>
</head>
<body>
<div class="card">
  <div class="label">{title}</div>
  <div class="prompt">{safe_prompt}</div>
</div>
</body>
</html>"""
    Path(output_file).write_text(html, encoding='utf-8')
    return output_file


def generate_campaign_image(prompt: str, output_dir: str, title: str):
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    base = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-') or 'campaign'
    png_file = out_dir / f"{base}.png"
    html_file = out_dir / f"{base}.html"
    json_file = out_dir / f"{base}.json"

    keys = load_keys_from_env_secrets()
    for k, v in keys.items():
        if v:
            os.environ[k] = v
    keys = get_env_keys()

    enhanced = prompt
    if keys.get("nvidia"):
        print("Enhancing prompt with NVIDIA LLM...")
        enhanced = nvidia_enhance_prompt(prompt, keys["nvidia"])

    # Save metadata
    json_file.write_text(json.dumps({"original": prompt, "enhanced": enhanced, "provider": None}, indent=2), encoding='utf-8')

    providers = [
        ("openai", keys.get("openai"), generate_openai),
        ("fal", keys.get("fal"), generate_fal),
        ("replicate", keys.get("replicate"), generate_replicate),
        ("stability", keys.get("stability"), generate_stability),
        ("midjourney", keys.get("midjourney"), generate_midjourney),
    ]

    for name, key, fn in providers:
        if not key:
            continue
        print(f"Trying {name}...")
        try:
            fn(enhanced, str(png_file), key)
            meta = json.loads(json_file.read_text())
            meta["provider"] = name
            json_file.write_text(json.dumps(meta, indent=2), encoding='utf-8')
            print(f"  ✓ Saved PNG: {png_file}")
            return png_file
        except Exception as e:
            print(f"  ✗ {name} failed: {e}")

    # Fallback: HTML placeholder
    print("No paid image provider available. Creating HTML placeholder...")
    create_html_placeholder(enhanced, str(html_file), title)
    meta = json.loads(json_file.read_text())
    meta["provider"] = "html-placeholder"
    meta["html"] = str(html_file)
    json_file.write_text(json.dumps(meta, indent=2), encoding='utf-8')
    print(f"  ✓ Saved placeholder: {html_file}")
    print(f"\nTo get real PNGs, add one of these keys: OPENAI_API_KEY, REPLICATE_API_TOKEN, FAL_KEY, STABILITY_API_KEY, MIDJOURNEY_API_KEY")
    return html_file


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", required=True, help="Image prompt or campaign brief")
    parser.add_argument("--title", default="Campaign Visual", help="Output filename slug")
    parser.add_argument("--output", default="assets", help="Output directory")
    args = parser.parse_args()

    generate_campaign_image(args.prompt, args.output, args.title)


if __name__ == "__main__":
    main()
