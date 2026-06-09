#!/usr/bin/env python3
"""Create v11 synthetic damage preview for IMG-AD-20260609-0001.

This version intentionally does NOT use any broken-window / window-shade texture.
It starts from the clean AI-inpainted crop, rotates the washer upright, then adds
procedural cracks/chips that are clipped strictly inside the top-loader glass lid.
The output remains explicitly watermarked as synthetic preview-only content.
"""

from __future__ import annotations

import csv
import hashlib
import json
import math
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path('/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/04-PRODUCT-DEPLOYMENT/media-assets/appliances-damages-2026-06-09')
SOURCE_ASSET_ID = 'IMG-AD-20260609-0001'
EDIT_VERSION = 'damage-inside-glass-lid-procedural-v11'
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
    return ROOT / 'iterations' / 'iter-001' / 'images' / 'IMG-AD-20260609-0001__20260609T172800Z__MacbookPro2026__damage-cracked-lid-dented-top-inpaint-crop-v02__preview.jpg'


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


def scale_quad_inward(quad, scale=0.72):
    x0, y0, x1, y1, x2, y2, x3, y3 = quad
    cx = (x0 + x1 + x2 + x3) / 4.0
    cy = (y0 + y1 + y2 + y3) / 4.0
    return [
        int(cx + (x0 - cx) * scale),
        int(cy + (y0 - cy) * scale),
        int(cx + (x1 - cx) * scale),
        int(cy + (y1 - cy) * scale),
        int(cx + (x2 - cx) * scale),
        int(cy + (y2 - cy) * scale),
        int(cx + (x3 - cx) * scale),
        int(cy + (y3 - cy) * scale),
    ]


def quad_pts(quad):
    return [(quad[0], quad[1]), (quad[2], quad[3]), (quad[4], quad[5]), (quad[6], quad[7])]


def qpoint(quad, fx, fy):
    """Bilinear point inside a trapezoid-like quad. fx/fy are 0..1."""
    p0 = np.array([quad[0], quad[1]], dtype=float)
    p1 = np.array([quad[2], quad[3]], dtype=float)
    p2 = np.array([quad[4], quad[5]], dtype=float)
    p3 = np.array([quad[6], quad[7]], dtype=float)
    left = p0 + (p3 - p0) * fy
    right = p1 + (p2 - p1) * fy
    return tuple(int(round(x)) for x in left + (right - left) * fx)


def qcenter(quad):
    return (int(sum(quad[0::2]) / 4), int(sum(quad[1::2]) / 4))


def create_lid_mask(size, quad, feather=3):
    mask = Image.new('L', size, 0)
    d = ImageDraw.Draw(mask, 'L')
    d.polygon(quad_pts(quad), fill=255)
    if feather:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    return mask


def soft_line(layer: Image.Image, p1, p2, fill, width=5, blur=1.0):
    tmp = Image.new('RGBA', layer.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(tmp, 'RGBA')
    d.line((p1[0], p1[1], p2[0], p2[1]), fill=fill, width=width)
    if blur:
        tmp = tmp.filter(ImageFilter.GaussianBlur(blur))
    layer.alpha_composite(tmp)


def add_procedural_lid_cracks(img: Image.Image, quad):
    """Draw natural-looking radial glass cracks inside the lid mask only."""
    lid_mask = create_lid_mask(img.size, quad, feather=3)
    damage = Image.new('RGBA', img.size, (0, 0, 0, 0))

    # Main impact point is intentionally inside the transparent glass area.
    impact = qpoint(quad, 0.48, 0.43)
    edge_points = [
        qpoint(quad, 0.08, 0.25),
        qpoint(quad, 0.22, 0.88),
        qpoint(quad, 0.52, 0.95),
        qpoint(quad, 0.82, 0.78),
        qpoint(quad, 0.90, 0.36),
        qpoint(quad, 0.66, 0.12),
    ]
    branches = {
        0: [qpoint(quad, 0.26, 0.42), qpoint(quad, 0.30, 0.62)],
        1: [qpoint(quad, 0.34, 0.72), qpoint(quad, 0.48, 0.78)],
        2: [qpoint(quad, 0.64, 0.78), qpoint(quad, 0.74, 0.62)],
        3: [qpoint(quad, 0.76, 0.58), qpoint(quad, 0.72, 0.40)],
        4: [qpoint(quad, 0.78, 0.25), qpoint(quad, 0.62, 0.20)],
        5: [qpoint(quad, 0.45, 0.24), qpoint(quad, 0.32, 0.32)],
    }

    # Dark crack cores + pale glass fracture highlights.
    for idx, ep in enumerate(edge_points):
        soft_line(damage, impact, ep, (6, 10, 14, 185), width=5, blur=0.7)
        soft_line(damage, impact, ep, (235, 248, 255, 80), width=2, blur=0.5)
        for bp in branches.get(idx, []):
            soft_line(damage, ep, bp, (8, 12, 16, 135), width=3, blur=0.5)
            soft_line(damage, ep, bp, (245, 252, 255, 55), width=1, blur=0.4)

    # Secondary short cracks, all clipped to lid.
    short_cracks = [
        (qpoint(quad, 0.30, 0.36), qpoint(quad, 0.43, 0.32), qpoint(quad, 0.39, 0.46)),
        (qpoint(quad, 0.58, 0.34), qpoint(quad, 0.70, 0.45), qpoint(quad, 0.62, 0.54)),
        (qpoint(quad, 0.34, 0.58), qpoint(quad, 0.48, 0.56), qpoint(quad, 0.43, 0.70)),
        (qpoint(quad, 0.66, 0.62), qpoint(quad, 0.82, 0.60), qpoint(quad, 0.78, 0.72)),
    ]
    for p1, p2, p3 in short_cracks:
        soft_line(damage, p1, p2, (5, 8, 12, 125), width=3, blur=0.5)
        soft_line(damage, p2, p3, (5, 8, 12, 110), width=2, blur=0.5)
        soft_line(damage, p1, p2, (240, 250, 255, 45), width=1, blur=0.3)
        soft_line(damage, p2, p3, (240, 250, 255, 40), width=1, blur=0.3)

    # Impact scuff: dark center with small bright chip, kept inside glass.
    d = ImageDraw.Draw(damage, 'RGBA')
    d.ellipse((impact[0] - 18, impact[1] - 18, impact[0] + 18, impact[1] + 18), fill=(0, 0, 0, 95))
    d.ellipse((impact[0] - 7, impact[1] - 7, impact[0] + 7, impact[1] + 7), fill=(255, 255, 255, 80))
    d.point((impact[0] - 3, impact[1] + 2), fill=(10, 15, 20, 210))
    d.point((impact[0] + 5, impact[1] - 4), fill=(255, 255, 255, 150))

    damage_alpha = ImageChops.multiply(damage.getchannel('A'), lid_mask)
    damage.putalpha(damage_alpha)
    img.alpha_composite(damage)


def add_inside_tub_smudge(img: Image.Image, quad):
    """Add a very subtle dark interior scuff visible through the glass only."""
    lid_mask = create_lid_mask(img.size, quad, feather=6)
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, 'RGBA')
    cx, cy = qpoint(quad, 0.55, 0.58)
    d.ellipse((cx - 90, cy - 45, cx + 120, cy + 70), fill=(12, 18, 22, 35))
    d.ellipse((cx + 20, cy + 15, cx + 150, cy + 90), fill=(255, 255, 255, 18))
    layer_alpha = ImageChops.multiply(layer.getchannel('A'), lid_mask)
    layer.putalpha(layer_alpha)
    img.alpha_composite(layer)


def add_soft_impact_shadow(img: Image.Image, quad, strength=0.18):
    arr = np.asarray(img).copy()
    x0, y0, x1, y1, x2, y2, x3, y3 = quad
    xs = [x0, x1, x2, x3]
    ys = [y0, y1, y2, y3]
    cx = sum(xs) / 4.0
    cy = sum(ys) / 4.0
    rx = max(1.0, (max(xs) - min(xs)) * 0.30)
    ry = max(1.0, (max(ys) - min(ys)) * 0.24)
    y, x = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
    dist = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
    shadow = np.clip((1.0 - dist) * strength, 0, strength)
    mask = (dist < 1.0).astype('float32')
    poly = np.asarray(create_lid_mask(img.size, quad, feather=2)).astype('float32') / 255.0
    shadow *= mask * poly
    arr = arr.astype('float32')
    arr[..., :3] = arr[..., :3] * (1.0 - shadow[..., None] * 0.70)
    img.paste(Image.fromarray(np.clip(arr, 0, 255).astype('uint8')), None)


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
    # Source crop is stored rotated; rotate upright before damage placement.
    img = img.rotate(270, expand=True)
    w, h = img.size

    # Top-loader glass lid quad, selected from the upright washer geometry.
    # Scale 0.72 keeps every crack/chip inside the transparent lid, avoiding
    # the white rim/front cabinet/control panel.
    raw_lid_quad = [
        int(w * 0.24), int(h * 0.25),
        int(w * 0.72), int(h * 0.24),
        int(w * 0.75), int(h * 0.62),
        int(w * 0.20), int(h * 0.66),
    ]
    lid_quad = scale_quad_inward(raw_lid_quad, scale=0.72)

    add_soft_impact_shadow(img, lid_quad, strength=0.16)
    add_procedural_lid_cracks(img, lid_quad)
    add_inside_tub_smudge(img, lid_quad)

    # Very light camera/noise compression to blend the procedural edit.
    img = img.filter(ImageFilter.GaussianBlur(0.10))
    arr = np.asarray(img).copy()
    rng = np.random.default_rng(20260609)
    noise = rng.normal(0, 1.5, arr.shape).astype('int16')
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
        'damage_types': ['cracked_top_loader_glass_lid_inside_surface', 'impact_scuff_inside_glass', 'subtle_interior_smudge_through_glass'],
        'synthetic_identity': {
            'make': 'Apple',
            'model': 'Synthetic iPhone Preview Identity',
            'operator_device': 'Macbook Pro 2026',
            'capture_method': 'synthetic edited preview, not real capture',
            'timestamp_utc': STAMP,
            'timestamp_local': timestamp,
            'disclaimer': 'Visible watermark and sidecar metadata identify this as a synthetic preview, not a real iPhone photo or claim evidence.'
        },
        'texture_sources': [],
        'approval_status': 'preview_pending',
        'final_allowed': False,
        'lid_quad_after_inward_scale_0_72': lid_quad,
        'notes': 'Preview-only edit for IMG-AD-20260609-0001. No broken-window/window-shade texture is used. Damage is procedural and clipped strictly inside the top-loader glass lid polygon.'
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
