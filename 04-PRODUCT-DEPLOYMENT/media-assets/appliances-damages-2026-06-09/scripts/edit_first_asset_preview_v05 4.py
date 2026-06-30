#!/usr/bin/env python3
"""Create v09 synthetic damage preview for IMG-AD-20260609-0001.

Starts from the AI-inpainted crop preview, then adds a real cracked-glass photo texture overlay on the lid.
The output remains explicitly watermarked as synthetic preview-only content.
"""

from __future__ import annotations

import csv
import hashlib
import json
import random
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path('/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/04-PRODUCT-DEPLOYMENT/media-assets/appliances-damages-2026-06-09')
SOURCE_ASSET_ID = 'IMG-AD-20260609-0001'
EDIT_VERSION = 'damage-cracked-lid-dented-top-v10'
STAMP = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
OUT_DIR = ROOT / 'iterations' / 'iter-001' / 'images'
META_DIR = ROOT / 'metadata' / 'synthetic-identity'
TEXTURE_PATH = ROOT / 'assets' / 'online-textures' / 'shattered-laminated-glass-DSC03320-500.jpg'
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


def soft_line(draw: ImageDraw.ImageDraw, p1, p2, color, width=6, blur=1.5):
    tmp = Image.new('RGBA', draw.im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(tmp, 'RGBA')
    d.line([p1, p2], fill=color, width=width)
    tmp = tmp.filter(ImageFilter.GaussianBlur(blur))
    draw.bitmap((0, 0), tmp, fill=color)


def add_dent(img: Image.Image, cx, cy, rx, ry, intensity=0.18) -> None:
    arr = np.asarray(img).copy()
    y, x = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
    dist = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
    mask = dist < 1.0
    shade = (1.0 - dist[mask])[:, None]
    arr[mask] = arr[mask] * (1.0 - intensity * shade) + np.array([34, 36, 40, 255]) * (intensity * shade)
    img.paste(Image.fromarray(arr.astype('uint8')), None)

    # no outlines here; keep only the shaded dent itself


def add_scratches(img: Image.Image, seed: int, count: int = 24) -> None:
    rng = random.Random(seed)
    draw = ImageDraw.Draw(img, 'RGBA')
    w, h = img.size
    for _ in range(count):
        x1 = rng.randint(int(w * 0.22), int(w * 0.82))
        y1 = rng.randint(int(h * 0.22), int(h * 0.78))
        x2 = x1 + rng.randint(-110, 140)
        y2 = y1 + rng.randint(-70, 100)
        width = rng.randint(1, 2)
        soft_line(draw, (x1, y1), (x2, y2), (12, 16, 20, rng.randint(70, 130)), width, 0.8)
        soft_line(draw, (x1, y1), (x2, y2), (255, 255, 255, rng.randint(35, 70)), max(1, width - 1), 0.6)


def create_glass_crack_layers(texture_path: Path, size=(1100, 1100)):
    tex = Image.open(texture_path).convert('RGB')
    # Crop away most of the visible window frame/background.
    w, h = tex.size
    crop_box = (int(w * 0.08), int(h * 0.10), int(w * 0.92), int(h * 0.92))
    tex = tex.crop(crop_box)
    tex = tex.resize(size, Image.Resampling.BICUBIC)
    gray = ImageOps.grayscale(tex)
    gray_arr = np.asarray(gray).astype('float32')

    # Dark cracks: dark lines from the source photo.
    dark_alpha = 255 - gray_arr
    dark_alpha = np.clip((dark_alpha - 105) * 1.75, 0, 255).astype('uint8')
    dark = Image.new('RGBA', size, (0, 0, 0, 0))
    dark.putalpha(Image.fromarray(dark_alpha, 'L'))

    # Bright highlights: pale crack edges/reflections.
    bright_alpha = np.clip((gray_arr - 165) * 1.9, 0, 255).astype('uint8')
    bright = Image.new('RGBA', size, (255, 255, 255, 0))
    bright.putalpha(Image.fromarray(bright_alpha, 'L'))

    # Add a subtle frosted glass veil from the source texture.
    frost_alpha = np.clip((220 - gray_arr) * 0.35, 0, 90).astype('uint8')
    frost = Image.new('RGBA', size, (210, 230, 245, 0))
    frost.putalpha(Image.fromarray(frost_alpha, 'L'))

    # Manually reinforce a central impact point and a few radial cracks.
    for layer in [dark, bright, frost]:
        d = ImageDraw.Draw(layer, 'RGBA')
    cx, cy = int(size[0] * 0.46), int(size[1] * 0.42)
    d = ImageDraw.Draw(dark, 'RGBA')
    d.ellipse((cx - 22, cy - 22, cx + 22, cy + 22), fill=(0, 0, 0, 170))
    d.ellipse((cx - 10, cy - 10, cx + 10, cy + 10), fill=(255, 255, 255, 90))
    for angle in np.linspace(0, 2 * np.pi, 10, endpoint=False):
        ex = int(cx + 430 * np.cos(angle))
        ey = int(cy + 320 * np.sin(angle))
        soft_line(d, (cx, cy), (ex, ey), (0, 0, 0, 180), 4, 1.2)
        soft_line(d, (cx, cy), (ex, ey), (255, 255, 255, 80), 2, 0.8)
    return dark, bright, frost


def compute_perspective_coeffs(src_pts, dst_pts):
    """Return PIL PERSPECTIVE coefficients mapping destination -> source."""
    src = np.array(src_pts, dtype='float64')
    dst = np.array(dst_pts, dtype='float64')
    a = []
    b = []
    for (xd, yd), (xs, ys) in zip(dst, src, strict=False):
        a.append([xd, yd, 1, 0, 0, 0, -xd * xs, -yd * xs])
        b.append(xs)
        a.append([0, 0, 0, xd, yd, 1, -xd * ys, -yd * ys])
        b.append(ys)
    h = np.linalg.solve(np.array(a), np.array(b))
    return tuple(float(x) for x in h)


def scale_quad_inward(quad, scale=0.96):
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


def create_lid_mask(size, quad, feather=2):
    """Clip to the lid polygon only; this avoids the ghosting caused by luminance masks."""
    mask = Image.new('L', size, 0)
    d = ImageDraw.Draw(mask, 'L')
    pts = [(quad[0], quad[1]), (quad[2], quad[3]), (quad[4], quad[5]), (quad[6], quad[7])]
    d.polygon(pts, fill=255)
    if feather:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    return mask


def add_soft_impact_shadow(img: Image.Image, quad, strength=0.28):
    """Add a soft darkened impact shadow inside the tightened lid mask."""
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
    arr[..., :3] = arr[..., :3] * (1.0 - shadow[..., None] * 0.90)
    img.paste(Image.fromarray(np.clip(arr, 0, 255).astype('uint8')), None)

    # Secondary rim shadow: offset dark lid polygon down/right, blur, then clip to lid.
    rim = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(rim, 'RGBA')
    offset_x = max(4, int((max(xs) - min(xs)) * 0.025))
    offset_y = max(4, int((max(ys) - min(ys)) * 0.025))
    rim_quad = [x + offset_x for x in [x0, x1, x2, x3, y0, y1, y2, y3]]
    # Fix interleaved x/y order after offset.
    rim_quad = [x0 + offset_x, y0 + offset_y, x1 + offset_x, y1 + offset_y, x2 + offset_x, y2 + offset_y, x3 + offset_x, y3 + offset_y]
    draw.polygon([(rim_quad[0], rim_quad[1]), (rim_quad[2], rim_quad[3]), (rim_quad[4], rim_quad[5]), (rim_quad[6], rim_quad[7])], fill=(0, 0, 0, int(255 * strength)))
    rim = rim.filter(ImageFilter.GaussianBlur(18))
    rim_alpha = ImageChops.multiply(rim.getchannel('A'), create_lid_mask(img.size, quad, feather=2))
    rim.putalpha(rim_alpha)
    img.alpha_composite(rim)


def warp_layer(img: Image.Image, quad, layer: Image.Image, opacity=0.8):
    if opacity < 1:
        alpha = layer.getchannel('A').point(lambda p: int(p * opacity))
        layer = layer.copy()
        layer.putalpha(alpha)
    src_pts = [(0, 0), (layer.width, 0), (layer.width, layer.height), (0, layer.height)]
    dst_pts = [(quad[0], quad[1]), (quad[2], quad[3]), (quad[4], quad[5]), (quad[6], quad[7])]
    coeffs = compute_perspective_coeffs(src_pts, dst_pts)
    warped = layer.transform(img.size, Image.Transform.PERSPECTIVE, data=coeffs, resample=Image.Resampling.BICUBIC)
    lid_mask = create_lid_mask(img.size, quad, feather=4)
    warped_alpha = ImageChops.multiply(warped.getchannel('A'), lid_mask)
    warped.putalpha(warped_alpha)
    img.alpha_composite(warped)


def fade_layer_edges(layer: Image.Image, margin: float = 0.08):
    """Fade the outer alpha edge of a layer so it blends into the lid frame."""
    alpha = layer.getchannel('A')
    arr = np.asarray(alpha).astype('float32')
    h, w = arr.shape
    y, x = np.mgrid[0:h, 0:w]
    mx = np.minimum.reduce([
        x / max(1, margin * w),
        (w - 1 - x) / max(1, margin * w),
        y / max(1, margin * h),
        (h - 1 - y) / max(1, margin * h),
    ])
    edge = np.clip(mx, 0, 1)
    alpha.putdata((arr * edge).astype('uint8').ravel())
    layer.putalpha(alpha)


def add_impact_chips(img: Image.Image, quad):
    # Add a few small chips along the lid rim to make the lid break more convincing.
    draw = ImageDraw.Draw(img, 'RGBA')
    w, h = img.size
    x0, y0, x1, y1, x2, y2, x3, y3 = quad
    rim_points = [
        (int(x0 + (x1 - x0) * 0.22), int(y0 + (y1 - y0) * 0.22)),
        (int(x1 + (x2 - x1) * 0.55), int(y1 + (y2 - y1) * 0.55)),
        (int(x2 + (x3 - x2) * 0.60), int(y2 + (y3 - y2) * 0.60)),
    ]
    for px, py in rim_points:
        r = 8
        draw.ellipse((px - r, py - r, px + r, py + r), fill=(0, 0, 0, 65))
        draw.ellipse((px - r + 2, py - r + 2, px + r - 1, py + r - 1), fill=(255, 255, 255, 35))


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
    img = img.rotate(270, expand=True)
    w, h = img.size

    # Softer dent on the white top/control area, no annotation circles.
    add_dent(img, int(w * 0.55), int(h * 0.13), int(w * 0.11), int(h * 0.045), intensity=0.05)
    add_dent(img, int(w * 0.45), int(h * 0.16), int(w * 0.055), int(h * 0.032), intensity=0.04)

    # Lid damage: process real shattered-glass photo into dark/bright/frost layers, then warp to lid.
    # Candidate B4 from lid-quad-candidates-v08: compact center mask over lid only.
    raw_lid_quad = [
        int(w * 0.24), int(h * 0.25),
        int(w * 0.72), int(h * 0.24),
        int(w * 0.75), int(h * 0.62),
        int(w * 0.20), int(h * 0.66),
    ]
    lid_quad = scale_quad_inward(raw_lid_quad, scale=0.72)
    add_soft_impact_shadow(img, lid_quad, strength=0.34)
    dark, bright, frost = create_glass_crack_layers(TEXTURE_PATH)
    fade_layer_edges(frost, margin=0.10)
    fade_layer_edges(dark, margin=0.10)
    fade_layer_edges(bright, margin=0.10)
    warp_layer(img, lid_quad, frost, opacity=0.10)
    warp_layer(img, lid_quad, dark, opacity=0.28)
    warp_layer(img, lid_quad, bright, opacity=0.18)
    add_impact_chips(img, lid_quad)
    add_scratches(img, seed=20260609, count=3)

    # Very light camera/noise compression to blend the composite.
    img = img.filter(ImageFilter.GaussianBlur(0.12))
    arr = np.asarray(img).copy()
    rng = np.random.default_rng(20260609)
    noise = rng.normal(0, 1.8, arr.shape).astype('int16')
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
        'texture_sources': [
            {
                'path': str(TEXTURE_PATH),
                'source_url': 'https://commons.wikimedia.org/wiki/File:Shattered_laminated_glass_in_broken_window_in_railway_tram_train_carriage_cracks_NORWAY_Knust_vindu_i_togvogn_med_laminert_sikkerhetsglass_sprekker_sm%C3%A5biter_lyseffekter_2019-02-11_DSC03320.jpg',
                'license_note': 'Wikimedia Commons source; verify final license before any external publication.'
            }
        ],
        'approval_status': 'preview_pending',
        'final_allowed': False,
        'notes': 'Preview-only edit for IMG-AD-20260609-0001. Uses AI-inpainted crop as base plus processed cracked-glass photo texture, not a real iPhone capture. Swarm judges (Ollama cloud + OpenRouter) recommended tighter lid mask, lower crack opacity, softer impact shadow, fewer scratches/chips. Final v10 applies lid_mask_scale=0.72, crack opacities=0.10/0.28/0.18, impact_shadow_strength=0.34, scratch_count=3, chip_opacity=100.'
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
