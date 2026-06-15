#!/usr/bin/env python3
"""
Nexus Creative — Campaign Image Generation Pipeline

Generates campaign hero images from the prompt reference files.
Supports multiple backends (configure one at a time):
  - openai  → DALL-E 3 (best quality, ~$0.04–0.08 per 1024x1024 image)
  - flux    → fal.ai or Replicate Flux ( configure endpoint )
  - stability → Stability AI

Usage:
  export OPENAI_API_KEY=...
  python3 generate-campaign-images.py --backend openai --prompt prompts.md --output ./assets

Free alternative:
  Use the inline SVG placeholders in index.html until you have budget for paid generation.
"""

import argparse
import os
import re
import sys
import json
import base64
from pathlib import Path

try:
    import requests
except ImportError:
    requests = None


def extract_prompts(md_path: str) -> dict:
    text = Path(md_path).read_text(encoding='utf-8')
    # Split by Prompt A / Prompt B headers
    prompts = {}
    sections = re.split(r'\n## Prompt [A-Z]', text)
    for section in sections[1:]:
        title_match = re.search(r'^\s*[-–]\s*(.+)', section)
        if not title_match:
            continue
        title = title_match.group(1).strip()
        body_match = re.search(r'\*\*Full prompt:\*\*\s*(.+?)(?=\n\*\*Style tags|\Z)', section, re.S)
        if body_match:
            prompt = re.sub(r'\s+', ' ', body_match.group(1).strip())
            prompts[title] = prompt
    return prompts


def generate_openai(prompt: str, output_file: str, size: str = "1024x1024"):
    if requests is None:
        raise RuntimeError("requests library not installed")
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set")

    url = "https://api.openai.com/v1/images/generations"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": size,
        "response_format": "b64_json"
    }
    r = requests.post(url, headers=headers, json=payload, timeout=120)
    r.raise_for_status()
    data = r.json()
    b64 = data["data"][0]["b64_json"]
    Path(output_file).write_bytes(base64.b64decode(b64))
    return output_file


def generate_flux(prompt: str, output_file: str, endpoint: str = None):
    """Generic Flux/Replicate-compatible endpoint. Set FAL_KEY or REPLICATE_API_TOKEN."""
    if requests is None:
        raise RuntimeError("requests library not installed")
    if endpoint is None:
        endpoint = os.environ.get("FLUX_ENDPOINT", "https://fal.run/fal-ai/flux/dev")
    token = os.environ.get("FAL_KEY") or os.environ.get("REPLICATE_API_TOKEN")
    if not token:
        raise RuntimeError("FAL_KEY or REPLICATE_API_TOKEN not set")
    headers = {"Authorization": f"Key {token}", "Content-Type": "application/json"}
    payload = {"prompt": prompt, "image_size": "landscape_4_3"}
    r = requests.post(endpoint, headers=headers, json=payload, timeout=180)
    r.raise_for_status()
    data = r.json()
    image_url = data.get("images", [{}])[0].get("url") or data.get("output", "")
    if not image_url:
        raise RuntimeError(f"Unexpected Flux response: {data}")
    img = requests.get(image_url, timeout=120)
    img.raise_for_status()
    Path(output_file).write_bytes(img.content)
    return output_file


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--backend", choices=["openai", "flux", "stability"], default="openai")
    parser.add_argument("--prompt", default="prompts.md")
    parser.add_argument("--output", default="assets")
    parser.add_argument("--size", default="1024x1024")
    args = parser.parse_args()

    out_dir = Path(args.output)
    out_dir.mkdir(parents=True, exist_ok=True)

    prompts = extract_prompts(args.prompt)
    if not prompts:
        print("No prompts found in", args.prompt)
        sys.exit(1)

    print(f"Found {len(prompts)} campaigns. Backend: {args.backend}")
    for slug, prompt in prompts.items():
        safe = re.sub(r'[^a-z0-9]+', '-', slug.lower()).strip('-')
        outfile = out_dir / f"{safe}.png"
        print(f"\nGenerating: {slug} → {outfile}")
        try:
            if args.backend == "openai":
                generate_openai(prompt, str(outfile), args.size)
            elif args.backend == "flux":
                generate_flux(prompt, str(outfile))
            else:
                raise NotImplementedError(f"Backend {args.backend} not implemented")
            print("  ✓ saved")
        except Exception as e:
            print(f"  ✗ failed: {e}")

    print(f"\nDone. Images in: {out_dir.resolve()}")


if __name__ == "__main__":
    main()
