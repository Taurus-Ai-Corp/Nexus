#!/usr/bin/env python3
"""
NEXUS Image Generation Pipeline — HuggingFace FLUX.1-schnell + Perplexity Enhancement
Generates photorealistic images for the Tera Gillen-Petrozzi demo samples.

Usage:
  source ~/.env-secrets
  python3 generate_images.py

Output: assets/*.png + assets/*.json (metadata)
"""

import json, os, re, subprocess, sys, time
from pathlib import Path

import requests

ASSETS = Path("assets")
ASSETS.mkdir(exist_ok=True)

HF_MODEL = "black-forest-labs/FLUX.1-schnell"
HF_URL = f"https://router.huggingface.co/hf-inference/models/{HF_MODEL}"

PHOTO_PREFIX = (
    "Shot on iPhone 17 Pro Max, natural everyday photography, candid moment, "
    "real human with natural skin texture, visible pores, fine lines and natural imperfections, "
    "no artificial lighting, available light only, no airbrushing, no CGI, no AI artifacts, "
    "natural color temperature, realistic shadows, authentic appearance, "
    "real photograph not computer generated, organic skin tones, "
)

HEADSHOT_SUFFIX = (
    "natural skin texture, visible pores, subtle wrinkles, natural hair strands, "
    "no airbrushing, minimal makeup, real person, candid expression, "
    "iPhone 17 Pro Max portrait mode, natural depth of field, realistic colors, "
    "everyday authentic look, not AI generated, real photograph quality",
)

PROMPTS = [
    ("headshot-fashion",
     f"{PHOTO_PREFIX}Close-up headshot of a woman in her late 30s with warm brown eyes and shoulder-length dark hair, "
     f"dark professional top against softly blurred background, natural window light from the side, "
     f"relaxed confident expression with slight natural smile, catch lights in eyes, "
     f"portrait mode, natural skin finish, realistic skin texture, candid moment, {HEADSHOT_SUFFIX}"),

    ("headshot-chiaroscuro",
     f"{PHOTO_PREFIX}Natural light black and white portrait of a woman in her late 30s, "
     f"seated by a window with soft daylight coming from one side creating natural shadow play, "
     f"three-quarter angle, leaning slightly forward, thoughtful expression, "
     f"monochrome filter, natural skin texture visible, realistic shadows, "
     f"casual indoor setting, authentic moment, {HEADSHOT_SUFFIX}"),

    ("headshot-ceo",
     f"{PHOTO_PREFIX}Candid professional portrait of a woman in her late 30s standing in a bright modern office, "
     f"wearing a navy blazer and light blouse, relaxed pose with one hand in pocket, "
     f"warm genuine smile, natural office environment with soft ambient light, "
     f"approachable professional look, real workplace setting, natural expression, "
     f"caught in a genuine moment, {HEADSHOT_SUFFIX}"),

    ("brand-board",
     f"Brand identity board flat lay for 'Cherish Inc', financial coaching brand for millennial women, "
     f"3x3 grid arranged on cream paper surface, featuring logo mark with abstract C, "
     f"color swatches in ink terracotta warm paper and muted border, typography DM Serif Display and Jakarta Sans, "
     f"brand tagline 'Financial freedom starts within', mockups of website on laptop, "
     f"printed journal and bookmark, natural daylight flat lay photography, soft shadows, "
     f"clean simple composition, realistic product mockups, high detail"),

    ("book-thrive",
     f"{PHOTO_PREFIX}Product photo of a hardcover book titled 'Thrive' on a wooden table near a window, "
     f"book slightly open with pages catching daylight, dried eucalyptus sprig beside it, "
     f"white coffee mug nearby, warm earthy tones, natural daylight from window, "
     f"casual lifestyle flat lay, realistic shadows and highlights, cozy warm atmosphere, "
     f"natural color palette terracotta and cream, everyday setting, {HEADSHOT_SUFFIX}"),

    ("financial-freedom",
     f"{PHOTO_PREFIX}Creative still life: an open hand with coins floating upward, "
     f"warm golden light from below, dark background, coins frozen mid-air with natural motion blur, "
     f"realistic lighting, coins with natural metallic sheen, "
     f"top portion of frame empty for text, artistic concept photography, "
     f"natural shadows, realistic materials, authentic look"),

    ("popup-kiosk",
     f"Architectural concept render of a small boutique pop-up shop shaped like a letter C, "
     f"warm terracotta and cream exterior with subtle brass metal trim, "
     f"glass front windows showing warm wooden interior with seating area, "
     f"soft ambient lighting, minimalist modern design, clean lines, "
     f"pure background, realistic architectural visualization, natural materials"),

    ("brand-figurine",
     f"Tilt-shift miniature effect photo of a small posable figure of a woman in a blazer, "
     f"holding a miniature book in one hand and a tiny coffee cup in the other, "
     f"standing on a plain light surface, soft natural lighting from above, "
     f"small soft shadow beneath, realistic miniature photography, shallow depth of field, "
     f"toy photography style, natural lighting, realistic scale"),

    ("magazine-cover",
     f"{PHOTO_PREFIX}Candid outdoor shot of a local farmers market on a sunny late afternoon, "
     f"wooden stalls with fresh vegetables flowers and baked goods, "
     f"people browsing casually in everyday summer clothes, warm golden sunlight, "
     f"natural expressions and interactions, realistic community scene, "
     f"clean sky area at top for magazine masthead overlay, "
     f"warm amber and green tones, authentic small town atmosphere, {HEADSHOT_SUFFIX}"),
]

def get_env(keys):
    script = (
        'set -a; source ~/.env-secrets 2>/dev/null || true; set +a; '
        'python3 << \'PYEOF\'\n'
        'import os, json\n'
        'print(json.dumps({k: os.environ.get(k, "") for k in %s}))\n'
        'PYEOF\n'
    ) % json.dumps(keys)
    res = subprocess.run(["bash", "-c", script], capture_output=True, text=True)
    for line in reversed(res.stdout.split("\n")):
        try: return json.loads(line)
        except: pass
    return {}

def enhance_prompt(prompt, key):
    if not key: return prompt
    url = "https://api.perplexity.ai/chat/completions"
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    system = (
        "You are an iPhone photographer. Expand this brief into a natural-looking image-generation prompt. "
        "CRITICAL: The result must look like a real photo taken on an iPhone 17 Pro Max, not AI generated. "
        "Use everyday natural lighting, candid compositions, realistic skin texture with visible pores and fine lines, "
        "natural color temperature, no artificial or dramatic lighting, no CGI, no plastic look, no AI artifacts. "
        "Think candid iPhone photography, not studio photography. Output only the prompt, no commentary."
    )
    payload = {
        "model": "sonar",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": f"Brief: {prompt}\n\nWrite one photorealistic image prompt:"}
        ],
        "max_tokens": 600, "temperature": 0.5,
    }
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=60)
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"  Perplexity failed: {e}")
        return prompt

def generate_hf(enhanced, slug, hf_token):
    headers = {
        "Authorization": f"Bearer {hf_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": enhanced,
        "parameters": {
            "guidance_scale": 3.0,
            "num_inference_steps": 8,
            "target_size": {"width": 1024, "height": 1024},
        }
    }
    r = requests.post(HF_URL, headers=headers, json=payload, timeout=180)
    r.raise_for_status()
    content_type = r.headers.get("Content-Type", "")
    if "image" not in content_type:
        raise RuntimeError(f"Unexpected response type: {content_type}, body: {r.text[:200]}")
    out = ASSETS / f"{slug}.png"
    from PIL import Image
    import io
    img = Image.open(io.BytesIO(r.content))
    img.save(out, "PNG")
    return out, r.content

def main():
    env = get_env(["GEMINI_API_KEY", "PERPLEXITY_API_KEY", "HF_TOKEN"])
    perplexity_key = env.get("PERPLEXITY_API_KEY")
    hf_token = env.get("HF_TOKEN")

    if not hf_token:
        print("ERROR: HF_TOKEN not found in env")
        sys.exit(1)

    print(f"HF_TOKEN: {hf_token[:12]}...")
    print(f"Perplexity: {'found' if perplexity_key else 'missing'}")
    print(f"Model: {HF_MODEL}")
    print(f"8 steps, guidance 3.0, iPhone 17 Pro Max aesthetic")
    print(f"Output dir: {ASSETS.resolve()}")
    print()

    regenerate = input("Regenerate ALL images (y/N)? ").strip().lower() == 'y'
    if not regenerate:
        print("Skipping regeneration.")
        return

    for slug, prompt in PROMPTS:
        print(f"\n=== {slug} ===")
        png = ASSETS / f"{slug}.png"

        print(f"  Prompt: {prompt[:80]}...")

        enhanced = enhance_prompt(prompt, perplexity_key)
        print(f"  Enhanced ({len(enhanced)} chars)")

        json_path = ASSETS / f"{slug}.json"
        meta = {
            "slug": slug, "original": prompt, "enhanced": enhanced,
            "provider": HF_MODEL, "status": "generating",
            "params": {"steps": 8, "guidance": 5.0, "size": "1024x768"}
        }
        json_path.write_text(json.dumps(meta, indent=2))

        try:
            result_path, raw = generate_hf(enhanced, slug, hf_token)
            print(f"  Saved: {result_path} ({result_path.stat().st_size/1024:.0f}KB)")
            meta["status"] = "completed"
            meta["raw_size_bytes"] = len(raw)
            json_path.write_text(json.dumps(meta, indent=2))
        except Exception as e:
            print(f"  Failed: {e}")
            meta["status"] = "failed"
            meta["error"] = str(e)
            json_path.write_text(json.dumps(meta, indent=2))

        time.sleep(0.5)

    print("\n=== Complete ===")
    pngs = list(ASSETS.glob("*.png"))
    print(f"Generated {len(pngs)} images")
    for p in pngs:
        print(f"  {p.name} ({p.stat().st_size/1024:.0f}KB)")

if __name__ == "__main__":
    main()
