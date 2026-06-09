#!/usr/bin/env python3
"""Create v02 synthetic damage preview for IMG-AD-20260609-0001.

This version rotates the source upright first, then adds softer lid cracks and a dented top surface.
It remains explicitly watermarked as synthetic preview-only content.
"""

from __future__ import annotations

import csv
import hashlib
import json
import random
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path('/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/04-PRODUCT-DEPLOYMENT/media-assets/appliances-damages-2026-06-09')
SOURCE_ASSET_ID = 'IMG-AD-20260609-0001'
EDIT_VERSION = 'damage-cracked-lid-dented-top-v02'
STAMP = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
OUT_DIR = ROOT / 'iterations' / 'iter-001' / 'images'
META_DIR = ROOT / 'metadata' / 'synthetic-identity'
OUT_DIR.mkdir(parents=True, exist_ok=True)
META_DIR.mkdir(parents=True, exist_ok=True)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def get_source_working_path() -> Path:
    manifest = ROOT / 'manifests' / 'sanitized-working-copies-2026-06-09.csv'
    with manifest.open(newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row['asset_id'] == SOURCE_ASSET_ID:
                return Path(row['sanitized_working_path'])
    raise SystemExit('Source working path not found')


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for c in [
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Supplemental/Helvetica.ttc',
        '/System/Library/Fonts/Supplemental/Menlo.ttc',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    ]:
        try:
            return ImageFont.truetype(c, size)
        except Exception:
            pass
    return ImageFont.load_default()


def soft_line(draw: ImageDraw.ImageDraw, p1, p2, color, width=6, blur=2.0):
    tmp = Image.new('RGBA', draw.im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(tmp, 'RGBA')
    d.line([p1, p2], fill=color, width=width)
    tmp = tmp.filter(ImageFilter.GaussianBlur(blur))
    draw.bitmap((0, 0), tmp, fill=color)


def add_crack(draw: ImageDraw.ImageDraw, start, end, branches=None, width=5):
    sx, sy = start
    ex, ey = end
    soft_line(draw, (sx + 2, sy + 2), (ex + 2, ey + 2), (0, 0, 0, 95), width + 5, 2.5)
    soft_line(draw, (sx, sy), (ex, ey), (18, 22, 28, 220), width, 1.0)
    soft_line(draw, (sx, sy), (ex, ey), (245, 250, 255, 125), max(1, width // 2), 0.8)
    if branches:
        for bx, by in branches:
            soft_line(draw, (ex + 2, ey + 2), (bx + 2, by + 2), (0, 0, 0, 80), max(3, width - 1), 2.0)
            soft_line(draw, (ex, ey), (bx, by), (14, 18, 24, 210), max(3, width - 1), 1.0)
            soft_line(draw, (ex, ey), (bx, by), (245, 250, 255, 110), max(1, width // 3), 0.8)


def add_dent(img: Image.Image, cx, cy, rx, ry, intensity=0.22) -> None:
    arr = np.asarray(img).copy()
    y, x = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
    dist = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
    mask = dist < 1.0
    shade = (1.0 - dist[mask])[:, None]
    arr[mask] = arr[mask] * (1.0 - intensity * shade) + np.array([30, 32, 36, 255]) * (intensity * shade)
    img.paste(Image.fromarray(arr.astype('uint8')), None)

    draw = ImageDraw.Draw(img, 'RGBA')
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), outline=(0, 0, 0, 85), width=8)
    draw.ellipse((cx - rx + 10, cy - ry + 8, cx + rx - 8, cy + ry - 7), outline=(255, 255, 255, 85), width=3)


def add_scratches(img: Image.Image, seed: int, count: int = 34) -> None:
    rng = random.Random(seed)
    draw = ImageDraw.Draw(img, 'RGBA')
    w, h = img.size
    for _ in range(count):
        x1 = rng.randint(int(w * 0.22), int(w * 0.82))
        y1 = rng.randint(int(h * 0.22), int(h * 0.78))
        x2 = x1 + rng.randint(-110, 140)
        y2 = y1 + rng.randint(-70, 100)
        width = rng.randint(1, 2)
        soft_line(draw, (x1, y1), (x2, y2), (12, 16, 20, rng.randint(90, 160)), width, 0.8)
        soft_line(draw, (x1, y1), (x2, y2), (255, 255, 255, rng.randint(40, 85)), max(1, width - 1), 0.6)


def add_watermark(img: Image.Image, text: str) -> None:
    draw = ImageDraw.Draw(img, 'RGBA')
    w, h = img.size
    f = font(max(28, min(w, h) // 42))
    pad = max(22, min(w, h) // 90)
    bbox = draw.textbbox((pad, h - pad - 170), text, font=f)
    box = (bbox[0] - 18, bbox[1] - 14, bbox[2] + 18, bbox[3] + 14)
    draw.rounded_rectangle(box, radius=24, fill=(0, 0, 0, 165))
    draw.text((pad, h - pad - 170), text, font=f, fill=(255, 255, 255, 245))


def main() -> None:
    src = get_source_working_path()
    img = Image.open(src).convert('RGBA')
    # Rotate upright before damage placement.
    img = img.rotate(270, expand=True)
    w, h = img.size

    add_dent(img, int(w * 0.56), int(h * 0.13), int(w * 0.10), int(h * 0.045), intensity=0.24)
    add_dent(img, int(w * 0.47), int(h * 0.16), int(w * 0.055), int(h * 0.030), intensity=0.18)

    draw = ImageDraw.Draw(img, 'RGBA')
    add_crack(draw, (int(w * 0.45), int(h * 0.36)), (int(w * 0.72), int(h * 0.64)), branches=[
        (int(w * 0.55), int(h * 0.45)),
        (int(w * 0.63), int(h * 0.55)),
        (int(w * 0.50), int(h * 0.56)),
    ], width=6)
    add_crack(draw, (int(w * 0.58), int(h * 0.42)), (int(w * 0.80), int(h * 0.70)), branches=[
        (int(w * 0.68), int(h * 0.52)),
        (int(w * 0.75), int(h * 0.64)),
    ], width=5)
    add_crack(draw, (int(w * 0.50), int(h * 0.58)), (int(w * 0.63), int(h * 0.40)), branches=[
        (int(w * 0.57), int(h * 0.50)),
        (int(w * 0.46), int(h * 0.48)),
    ], width=4)

    shards = [
        [(int(w * 0.50), int(h * 0.40)), (int(w * 0.58), int(h * 0.47)), (int(w * 0.54), int(h * 0.56))],
        [(int(w * 0.62), int(h * 0.50)), (int(w * 0.71), int(h * 0.55)), (int(w * 0.68), int(h * 0.65))],
        [(int(w * 0.43), int(h * 0.54)), (int(w * 0.50), int(h * 0.61)), (int(w * 0.45), int(h * 0.69))],
    ]
    for poly in shards:
        draw.polygon(poly, fill=(235, 248, 255, 50), outline=(255, 255, 255, 105))
        draw.line(poly + [poly[0]], fill=(10, 18, 25, 135), width=3)

    add_scratches(img, seed=20260609, count=30)

    img = img.filter(ImageFilter.GaussianBlur(0.25))
    arr = np.asarray(img).copy()
    rng = np.random.default_rng(20260609)
    noise = rng.normal(0, 3.8, arr.shape).astype('int16')
    arr = np.clip(arr.astype('int16') + noise, 0, 255).astype('uint8')
    img = Image.fromarray(arr, 'RGBA')

    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S %Z')
    watermark = f'SYNTHETIC DAMAGE PREVIEW — NOT A REAL CLAIM PHOTO | {timestamp} | {SOURCE_ASSET_ID}'
    add_watermark(img, watermark)

    out = OUT_DIR / f'{SOURCE_ASSET_ID}__{STAMP}__MacbookPro2026__{EDIT_VERSION}__preview.jpg'
    rgb = img.convert('RGB')
    rgb.save(out, quality=92, optimize=True)

    meta = {
        'asset_id': SOURCE_ASSET_ID,
        'source_asset_id': SOURCE_ASSET_ID,
        'edit_version': EDIT_VERSION,
        'output_path': str(out),
        'sha256': sha256_file(out),
        'damage_types': ['cracked_transparent_lid', 'broken_glass_shards', 'dented_white_top', 'surface_scratches'],
        'synthetic_identity': {
            'make': 'Apple',
            'model': 'Synthetic iPhone Preview Identity',
            'operator_device': 'Macbook Pro 2026',
            'capture_method': 'synthetic edited preview, not real capture',
            'timestamp_utc': STAMP,
            'timestamp_local': timestamp,
            'disclaimer': 'Visible watermark and sidecar metadata identify this as a synthetic preview, not a real iPhone photo or claim evidence.'
        },
        'approval_status': 'preview_pending',
        'final_allowed': False,
        'notes': 'Preview-only edit for IMG-AD-20260609-0001. Do not move to final until approved and source/AI detector audit is complete.'
    }
    meta_path = META_DIR / f'{SOURCE_ASSET_ID}__{EDIT_VERSION}__metadata-{STAMP}.json'
    meta_path.write_text(json.dumps(meta, indent=2), encoding='utf-8')

    manifest = ROOT / 'metadata' / 'synthetic-identity' / 'synthetic-edit-manifest-2026-06-09.csv'
    fields = ['asset_id', 'edit_version', 'output_path', 'sha256', 'timestamp_utc', 'approval_status', 'final_allowed', 'metadata_path', 'notes']
    rows = []
    if manifest.exists():
        with manifest.open(newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            fields = reader.fieldnames or fields
            rows = list(reader)
    rows.append({
        'asset_id': SOURCE_ASSET_ID,
        'edit_version': EDIT_VERSION,
        'output_path': str(out),
        'sha256': meta['sha256'],
        'timestamp_utc': STAMP,
        'approval_status': 'preview_pending',
        'final_allowed': 'false',
        'metadata_path': str(meta_path),
        'notes': meta['notes'],
    })
    with manifest.open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print(json.dumps({'preview': str(out), 'metadata': str(meta_path), 'sha256': meta['sha256'], 'approval_status': 'preview_pending'}, indent=2))


if __name__ == '__main__':
    main()
