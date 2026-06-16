#!/usr/bin/env python3
"""
Nexus Creative — Multi-Provider Image Generation Pipeline

Primary provider: Google Cloud Vertex AI Imagen 3
Fallbacks: DALL-E 3, Replicate, fal.ai, Stability, Midjourney
Prompt enhancement: NVIDIA LLM (free tier) or Perplexity Sonar
Final fallback: HTML/SVG placeholder

Usage:
  source ~/.env-secrets
  python3 generate-images.py --prompt "Luxury penthouse at golden hour" --title real-estate-hero --output assets

The script outputs:
  - assets/{title}.png (if Vertex or a paid provider succeeds)
  - assets/{title}.json (original + enhanced prompt + provider)
  - assets/{title}.html (only if no image provider succeeds)
"""

import argparse
import base64
import json
import os
import re
import sys
from pathlib import Path

import requests


def get_env_keys():
    return {
        "openai": os.environ.get("OPENAI_API_KEY", ""),
        "replicate": os.environ.get("REPLICATE_API_TOKEN", ""),
        "fal": os.environ.get("FAL_KEY", ""),
        "stability": os.environ.get("STABILITY_API_KEY", ""),
        "midjourney": os.environ.get("MIDJOURNEY_API_KEY", ""),
        "nvidia": os.environ.get("NVIDIA_API_KEY", ""),
        "perplexity": os.environ.get("PERPLEXITY_API_KEY", ""),
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
    'PERPLEXITY_API_KEY': os.environ.get('PERPLEXITY_API_KEY',''),
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


def perplexity_enhance_prompt(prompt: str, perplexity_key: str) -> str:
    """Use Perplexity Sonar to research campaign references and expand the prompt."""
    if not perplexity_key:
        return prompt
    url = "https://api.perplexity.ai/chat/completions"
    headers = {"Authorization": f"Bearer {perplexity_key}", "Content-Type": "application/json"}
    system = "You are a fashion and luxury campaign researcher. Expand the user's brief into an ultra-detailed image-generation prompt. Include lighting, camera lens, styling, mood, color grade, and 1-2 real-world editorial reference cues. Output only the prompt, no commentary."
    payload = {
        "model": "sonar",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": f"Brief: {prompt}\n\nWrite one ultra-realistic editorial campaign image prompt:"}
        ],
        "max_tokens": 400,
        "temperature": 0.5,
    }
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=60)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Perplexity prompt enhancement failed: {e}", file=sys.stderr)
        return prompt


def nvidia_enhance_prompt(prompt: str, nvidia_key: str) -> str:
    """Use NVIDIA chat LLM to expand a brief into a richer image prompt."""
    if not nvidia_key:
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


def generate_vertex(prompt: str, output_file: str, project_id: str = None, location: str = "us-central1", model_id: str = "imagen-3.0-generate-002"):
    """Generate image with Google Cloud Vertex AI Imagen 3."""
    import vertexai
    from vertexai.preview.vision_models import ImageGenerationModel

    project_id = project_id or os.environ.get("GOOGLE_CLOUD_PROJECT") or "project-0ae56a62-0f0a-4d8a-9b7"
    vertexai.init(project=project_id, location=location)
    model = ImageGenerationModel.from_pretrained(model_id)
    images = model.generate_images(
        prompt=prompt,
        number_of_images=1,
        aspect_ratio="1:1",
        safety_filter_level="block_some"
    )
    images[0].save(location=output_file, include_generation_parameters=False)
    return output_file


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
    import time
    for _ in range(60):
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
    url = "https://api.imaginepro.ai/api/v1/midjourney/imagine"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"prompt": prompt}
    r = requests.post(url, headers=headers, json=payload, timeout=30)
    r.raise_for_status()
    data = r.json()
    task_id = data.get("taskId") or data.get("id")
    if not task_id:
        raise RuntimeError(f"No task ID: {data}")
    import time
    for _ in range(60):
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


def generate_campaign_image(prompt: str, output_dir: str, title: str, project_id: str = None):
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
    if keys.get("perplexity"):
        print("Enhancing prompt with Perplexity Sonar...")
        enhanced = perplexity_enhance_prompt(prompt, keys["perplexity"])
    elif keys.get("nvidia"):
        print("Enhancing prompt with NVIDIA LLM...")
        enhanced = nvidia_enhance_prompt(prompt, keys["nvidia"])

    json_file.write_text(json.dumps({"original": prompt, "enhanced": enhanced, "provider": None}, indent=2), encoding='utf-8')

    # 1. Try Vertex AI Imagen 3 first
    try:
        print("Trying Vertex AI Imagen 3...")
        generate_vertex(enhanced, str(png_file), project_id=project_id)
        meta = json.loads(json_file.read_text())
        meta["provider"] = "vertex-imagen-3"
        json_file.write_text(json.dumps(meta, indent=2), encoding='utf-8')
        print(f"  Saved PNG: {png_file}")
        return png_file
    except Exception as e:
        print(f"  Vertex AI failed: {e}")

    # 2. Paid provider fallback chain
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
            print(f"  Saved PNG: {png_file}")
            return png_file
        except Exception as e:
            print(f"  {name} failed: {e}")

    # Fallback: HTML placeholder
    print("No paid image provider available. Creating HTML placeholder...")
    create_html_placeholder(enhanced, str(html_file), title)
    meta = json.loads(json_file.read_text())
    meta["provider"] = "html-placeholder"
    meta["html"] = str(html_file)
    json_file.write_text(json.dumps(meta, indent=2), encoding='utf-8')
    print(f"  Saved placeholder: {html_file}")
    print("\nTo get real PNGs, add a paid key: OPENAI_API_KEY, REPLICATE_API_TOKEN, FAL_KEY, STABILITY_API_KEY, MIDJOURNEY_API_KEY, or ensure Vertex AI billing is enabled.")
    return html_file


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", required=True, help="Image prompt or campaign brief")
    parser.add_argument("--title", default="Campaign Visual", help="Output filename slug")
    parser.add_argument("--output", default="assets", help="Output directory")
    parser.add_argument("--project", default=os.environ.get("GOOGLE_CLOUD_PROJECT", "project-0ae56a62-0f0a-4d8a-9b7"), help="Google Cloud project ID")
    args = parser.parse_args()

    generate_campaign_image(args.prompt, args.output, args.title, project_id=args.project)


if __name__ == "__main__":
    main()
