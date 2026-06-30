#!/usr/bin/env python3
"""Create a clearly watermarked synthetic damage preview for IMG-AD-20260609-0001.

This script intentionally adds a visible watermark and writes sidecar metadata so the output
is not mistaken for a real iPhone claim photo.
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
EDIT_VERSION = 'damage-cracked-lid-dented-top-v01'
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
    raise SystemExit('Source working path not found for IMG-AD-20260609-0001')


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Supplemental/Helvetica.ttc',
        '/System/Library/Fonts/Supplemental/Menlo.ttc',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    ]
    for c in candidates:
        try:
            return ImageFont.truetype(c, size)
        except Exception:
            pass
    return ImageFont.load_default()


def add_crack(img: Image.Image, start, end, branches=None, width=7) -> None:
    draw = ImageDraw.Draw(img, 'RGBA')
    shadow = ImageDraw.Draw(img, 'RGBA')
    sx, sy = start
    ex, ey = end
    shadow.line((sx + 3, sy + 3, ex + 3, ey + 3), fill=(0, 0, 0, 90), width=width + 4)
    draw.line((sx, sy, ex, ey), fill=(15, 20, 25, 220), width=width)
    draw.line((sx, sy, ex, ey), fill=(235, 245, 255, 150), width=max(2, width // 2))
    if branches:
        for bx, by in branches:
            shadow.line((ex + 3, ey + 3, bx + 3, by + 3), fill=(0, 0, 0, 70), width=max(3, width - 2))
            draw.line((ex, ey, bx, by), fill=(10, 15, 20, 210), width=max(3, width - 2))
            draw.line((ex, ey, bx, by), fill=(240, 250, 255, 130), width=max(1, width // 3))


def add_dent(img: Image.Image, cx, cy, rx, ry, intensity=0.22) -> None:
    arr = np.asarray(img).copy()
    y, x = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
    dist = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
    mask = dist < 1.0
    shade = (1.0 - dist[mask])[:, None]
    arr[mask] = arr[mask] * (1.0 - intensity * shade) + np.array([35, 38, 42, 25]) * (intensity * shade)
    img.paste(Image.fromarray(arr.astype('uint8')), None)

    draw = ImageDraw.Draw(img, 'RGBA')
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), outline=(0, 0, 0, 70), width=8)
    draw.ellipse((cx - rx + 12, cy - ry + 10, cx + rx - 10, cy + ry - 8), outline=(255, 255, 255, 90), width=3)


def add_scratches(img: Image.Image, seed: int, count: int = 38) -> None:
    rng = random.Random(seed)
    draw = ImageDraw.Draw(img, 'RGBA')
    w, h = img.size
    for _ in range(count):
        x1 = rng.randint(int(w * 0.35), int(w * 0.82))
        y1 = rng.randint(int(h * 0.20), int(h * 0.58))
        x2 = x1 + rng.randint(-140, 180)
        y2 = y1 + rng.randint(-80, 120)
        width = rng.randint(1, 3)
        draw.line((x1, y1, x2, y2), fill=(20, 25, 30, rng.randint(110, 190)), width=width)
        draw.line((x1, y1, x2, y2), fill=(255, 255, 255, rng.randint(45, 100)), width=max(1, width - 1))


def add_watermark(img: Image.Image, text: str) -> None:
    draw = ImageDraw.Draw(img, 'RGBA')
    w, h = img.size
    f = font(max(28, min(w, h) // 38))
    padding = max(24, min(w, h) // 80)
    bbox = draw.textbbox((padding, h - padding - 170), text, font=f)
    box = (bbox[0] - 18, bbox[1] - 14, bbox[2] + 18, bbox[3] + 14)
    draw.rounded_rectangle(box, radius=24, fill=(0, 0, 0, 155))
    draw.text((padding, h - padding - 170), text, font=f, fill=(255, 255, 255, 245))


def main() -> None:
    src = get_source_working_path()
    img = Image.open(src).convert('RGBA')
    w, h = img.size

    # Damage placement is normalized so it adapts to the source image size.
    # Target: LG top-load washer: cracked transparent lid + dented white top/control area.
    add_dent(img, int(w * 0.57), int(h * 0.23), int(w * 0.11), int(h * 0.055), intensity=0.26)
    add_dent(img, int(w * 0.48), int(h * 0.30), int(w * 0.055), int(h * 0.035), intensity=0.18)

    add_crack(img, (int(w * 0.45), int(h * 0.39)), (int(w * 0.73), int(h * 0.66)), branches=[
        (int(w * 0.56), int(h * 0.49)),
        (int(w * 0.64), int(h * 0.59)),
        (int(w * 0.50), int(h * 0.58)),
    ], width=8)
    add_crack(img, (int(w * 0.58), int(h * 0.45)), (int(w * 0.82), int(h * 0.72)), branches=[
        (int(w * 0.69), int(h * 0.55)),
        (int(w * 0.76), int(h * 0.66)),
    ], width=6)
    add_crack(img, (int(w * 0.52), int(h * 0.62)), (int(w * 0.64), int(h * 0.43)), branches=[
        (int(w * 0.58), int(h * 0.53)),
        (int(w * 0.48), int(h * 0.50)),
    ], width=5)

    # Broken-glass shard highlights on the transparent lid.
    draw = ImageDraw.Draw(img, 'RGBA')
    shards = [
        [(int(w * 0.50), int(h * 0.42)), (int(w * 0.59), int(h * 0.48)), (int(w * 0.55), int(h * 0.57))],
        [(int(w * 0.62), int(h * 0.52)), (int(w * 0.72), int(h * 0.56)), (int(w * 0.69), int(h * 0.66))],
        [(int(w * 0.43), int(h * 0.55)), (int(w * 0.51), int(h * 0.62)), (int(w * 0.45), int(h * 0.70))],
    ]
    for poly in shards:
        draw.polygon(poly, fill=(235, 248, 255, 55), outline=(255, 255, 255, 120))
        draw.line(poly + [poly[0]], fill=(10, 18, 25, 150), width=4)

    add_scratches(img, seed=20260609, count=46)

    # Mild global phone-photo compression/noise to keep it realistic but not over-polished.
    img = img.filter(ImageFilter.GaussianBlur(0.35))
    arr = np.asarray(img).copy()
    rng = np.random.default_rng(20260609)
    noise = rng.normal(0, 4.5, arr.shape).astype('int16')
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
