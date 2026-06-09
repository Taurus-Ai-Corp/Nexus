#!/usr/bin/env python3
"""Create v14 visible damage preview for IMG-AD-20260609-0001.

Uses the real Wikimedia fractured-glass reference, extracts only crack/reflection
lines, warps those lines into the top-loader glass lid polygon, and adds visible
neutral gray dents/scuffs/cracks on the washer body. No green shade/cast, no
broken-window background scene, frame, or shade is pasted into the washer image.
"""

from __future__ import annotations

import csv
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path('/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/04-PRODUCT-DEPLOYMENT/media-assets/appliances-damages-2026-06-09')
SOURCE_ASSET_ID = 'IMG-AD-20260609-0001'
EDIT_VERSION = 'damage-visible-washer-neutral-v14'
STAMP = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
OUT_DIR = ROOT / 'iterations' / 'iter-001' / 'images'
META_DIR = ROOT / 'metadata' / 'synthetic-identity'
TEXTURE_PATH = ROOT / 'assets' / 'online-textures' / 'wikimedia-glass-cobweb.jpg'
OUT_DIR.mkdir(parents=True, exist_ok=True)
META_DIR.mkdir(parents=True, exist_ok=True)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def get_source_working_path() -> Path:
    return ROOT / 'working' / 'iphone-clicked' / 'images' / 'IMG-AD-20260609-0001__20260609T153946Z__MacbookPro2026__source-connection-pending__working.jpg'


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
    p0 = np.array([quad[0], quad[1]], dtype=float)
    p1 = np.array([quad[2], quad[3]], dtype=float)
    p2 = np.array([quad[4], quad[5]], dtype=float)
    p3 = np.array([quad[6], quad[7]], dtype=float)
    left = p0 + (p3 - p0) * fy
    right = p1 + (p2 - p1) * fy
    return tuple(int(round(x)) for x in left + (right - left) * fx)


def create_lid_mask(size, quad, feather=3):
    mask = Image.new('L', size, 0)
    d = ImageDraw.Draw(mask, 'L')
    d.polygon(quad_pts(quad), fill=255)
    if feather:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    return mask


def compute_perspective_coeffs(src_pts, dst_pts):
    """Return PIL PERSPECTIVE coefficients mapping source -> destination."""
    src = np.array(src_pts, dtype='float64')
    dst = np.array(dst_pts, dtype='float64')
    a = []
    b = []
    for (xs, ys), (xd, yd) in zip(src, dst):
        a.append([xs, ys, 1, 0, 0, 0, -xs * xd, -ys * xd])
        b.append(xd)
        a.append([0, 0, 0, xs, ys, 1, -xs * yd, -ys * yd])
        b.append(yd)
    h = np.linalg.solve(np.array(a), np.array(b))
    return tuple(float(x) for x in h)


def warp_layer(img: Image.Image, quad, layer: Image.Image, opacity=0.45):
    if opacity < 1:
        alpha = layer.getchannel('A').point(lambda p: int(p * opacity))
        layer = layer.copy()
        layer.putalpha(alpha)
    src_pts = [(0, 0), (layer.width, 0), (layer.width, layer.height), (0, layer.height)]
    dst_pts = quad_pts(quad)
    coeffs = compute_perspective_coeffs(src_pts, dst_pts)
    warped = layer.transform(img.size, Image.Transform.PERSPECTIVE, data=coeffs, resample=Image.Resampling.BICUBIC)
    lid_mask = create_lid_mask(img.size, quad, feather=4)
    warped_alpha = ImageChops.multiply(warped.getchannel('A'), lid_mask)
    warped.putalpha(warped_alpha)
    img.alpha_composite(warped)


def fade_layer_edges(layer: Image.Image, margin=0.08):
    alpha = layer.getchannel('A')
    arr = np.asarray(alpha).astype('float32')
    h, w = arr.shape
    y, x = np.mgrid[0:h, 0:w]
    edge = np.minimum.reduce([
        x / max(1, margin * w),
        (w - 1 - x) / max(1, margin * w),
        y / max(1, margin * h),
        (h - 1 - y) / max(1, margin * h),
    ])
    edge = np.clip(edge, 0, 1)
    alpha.putdata((arr * edge).astype('uint8').ravel())
    layer.putalpha(alpha)


def extract_crack_reflection_layers(texture_path: Path, size=(1600, 1200)):
    """Extract only crack/reflection lines from the real fractured-glass photo.

    The background scene is intentionally discarded. The extraction uses local
    contrast/high-frequency crack edges, not the scene pixels.
    """
    tex = Image.open(texture_path).convert('RGB')
    w, h = tex.size
    # Use central dense fractured-glass area; avoid any edge/background framing.
    crop_box = (int(w * 0.08), int(h * 0.08), int(w * 0.92), int(h * 0.92))
    tex = tex.crop(crop_box).resize(size, Image.Resampling.BICUBIC)

    gray = ImageOps.grayscale(tex)
    gray_arr = np.asarray(gray).astype('float32')

    # Local contrast isolates the crack network and suppresses the blurred scene.
    blurred = gray.filter(ImageFilter.GaussianBlur(9))
    blurred_arr = np.asarray(blurred).astype('float32')
    contrast = np.abs(gray_arr - blurred_arr)

    # Bright refractive crack edges.
    bright_alpha = np.clip((gray_arr - 145) * 1.65, 0, 255).astype('uint8')
    bright_alpha = np.maximum(bright_alpha, np.clip((contrast - 24) * 4.0, 0, 255).astype('uint8'))

    # Dark crack cores/shadow edges.
    dark_alpha = np.clip((contrast - 28) * 5.2, 0, 255).astype('uint8')

    # Thin/dilate lightly so the extracted pattern behaves like glass fracture lines.
    bright = Image.fromarray(bright_alpha, 'L')
    dark = Image.fromarray(dark_alpha, 'L')
    bright = bright.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    dark = dark.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))

    # Save debug extraction for audit.
    debug = Image.new('RGB', (size[0] * 2, size[1]), (20, 22, 25))
    debug.paste(ImageOps.autocontrast(Image.fromarray(contrast.astype('uint8'))), (0, 0))
    dimg = Image.new('RGBA', size, (0, 0, 0, 0))
    dimg.putalpha(dark)
    bimg = Image.new('RGBA', size, (0, 0, 0, 0))
    bimg.putalpha(bright)
    debug.paste(dimg.convert('RGB'), (size[0], 0))
    debug_path = ROOT / 'metadata' / 'synthetic-identity' / f'{SOURCE_ASSET_ID}__{EDIT_VERSION}__crack-extract-debug.jpg'
    debug_path.parent.mkdir(parents=True, exist_ok=True)
    debug.save(debug_path, quality=92, optimize=True)

    # Build RGBA layers: dark crack cores + pale reflective fracture lines.
    dark_layer = Image.new('RGBA', size, (0, 0, 0, 0))
    dark_layer.putalpha(dark)
    dark_layer = ImageChops.multiply(dark_layer, Image.new('RGBA', size, (3, 6, 9, 255)))

    bright_layer = Image.new('RGBA', size, (0, 0, 0, 0))
    bright_layer.putalpha(bright)
    bright_layer = ImageChops.multiply(bright_layer, Image.new('RGBA', size, (230, 248, 255, 255)))

    dark_layer = dark_layer.filter(ImageFilter.GaussianBlur(0.35))
    bright_layer = bright_layer.filter(ImageFilter.GaussianBlur(0.45))
    fade_layer_edges(dark_layer, margin=0.10)
    fade_layer_edges(bright_layer, margin=0.10)
    return dark_layer, bright_layer


def add_soft_impact_shadow(img: Image.Image, quad, strength=0.12):
    arr = np.asarray(img).copy()
    x0, y0, x1, y1, x2, y2, x3, y3 = quad
    xs = [x0, x1, x2, x3]
    ys = [y0, y1, y2, y3]
    cx = sum(xs) / 4.0
    cy = sum(ys) / 4.0
    rx = max(1.0, (max(xs) - min(xs)) * 0.28)
    ry = max(1.0, (max(ys) - min(ys)) * 0.22)
    y, x = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
    dist = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
    shadow = np.clip((1.0 - dist) * strength, 0, strength)
    mask = (dist < 1.0).astype('float32')
    poly = np.asarray(create_lid_mask(img.size, quad, feather=2)).astype('float32') / 255.0
    shadow *= mask * poly
    arr = arr.astype('float32')
    arr[..., :3] = arr[..., :3] * (1.0 - shadow[..., None] * 0.75)
    img.paste(Image.fromarray(np.clip(arr, 0, 255).astype('uint8')), None)


def add_inside_chips(img: Image.Image, quad):
    """Add visible chips/scuffs inside the lid glass polygon only."""
    lid_mask = create_lid_mask(img.size, quad, feather=3)
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, 'RGBA')
    chip_points = [
        (0.47, 0.43, 18),
        (0.52, 0.40, 12),
        (0.56, 0.47, 10),
        (0.36, 0.52, 9),
        (0.66, 0.58, 9),
        (0.49, 0.45, 22),
    ]
    for fx, fy, r in chip_points:
        px, py = qpoint(quad, fx, fy)
        d.ellipse((px - r, py - r, px + r, py + r), fill=(0, 0, 0, 115))
        d.ellipse((px - r + 3, py - r + 3, px + r - 2, py + r - 2), fill=(255, 255, 255, 55))
    layer_alpha = ImageChops.multiply(layer.getchannel('A'), lid_mask)
    layer.putalpha(layer_alpha)
    img.alpha_composite(layer)


def add_radial_cracks(img: Image.Image, quad):
    """Draw visible radial cracks from one impact point, clipped to lid glass."""
    lid_mask = create_lid_mask(img.size, quad, feather=2)
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, 'RGBA')
    impact = qpoint(quad, 0.48, 0.43)
    endpoints = [
        (0.18, 0.20), (0.31, 0.16), (0.43, 0.14), (0.61, 0.18),
        (0.77, 0.27), (0.84, 0.40), (0.78, 0.57), (0.64, 0.76),
        (0.48, 0.82), (0.30, 0.73), (0.19, 0.61), (0.25, 0.48),
        (0.39, 0.55), (0.57, 0.64), (0.68, 0.49), (0.55, 0.33),
    ]
    for fx, fy in endpoints:
        ex, ey = qpoint(quad, fx, fy)
        # Slight jaggedness makes it look like glass, not a perfect CAD line.
        mx = int(impact[0] + (ex - impact[0]) * 0.55 + np.random.default_rng(20260609).normal(0, 10))
        my = int(impact[1] + (ey - impact[1]) * 0.55 + np.random.default_rng(20260609).normal(0, 10))
        d.line([impact, (mx, my), (ex, ey)], fill=(0, 0, 0, 175), width=4)
        d.line([impact, (mx, my), (ex, ey)], fill=(245, 252, 255, 115), width=2)
    d.ellipse((impact[0] - 26, impact[1] - 26, impact[0] + 26, impact[1] + 26), fill=(0, 0, 0, 165))
    d.ellipse((impact[0] - 16, impact[1] - 16, impact[0] + 16, impact[1] + 16), fill=(255, 255, 255, 65))
    layer_alpha = ImageChops.multiply(layer.getchannel('A'), lid_mask)
    layer.putalpha(layer_alpha)
    img.alpha_composite(layer)


def create_washer_damage_mask(img: Image.Image):
    """Mask the white washer body/control-panel surfaces, not the room."""
    arr = np.asarray(img.convert('RGB'))
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    lum = (r.astype('float32') + g.astype('float32') + b.astype('float32')) / 3.0
    sat = arr.max(axis=2).astype('float32') - arr.min(axis=2).astype('float32')
    y = np.mgrid[0:img.height, 0:img.width][0]
    white = (lum > 185) & (sat < 75) & (y > img.height * 0.20)
    mask = Image.fromarray((white.astype('uint8') * 255), 'L')
    mask = mask.filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(7))

    clip = Image.new('L', img.size, 0)
    d = ImageDraw.Draw(clip, 'L')
    poly = [
        (int(img.width * 0.08), int(img.height * 0.22)),
        (int(img.width * 0.92), int(img.height * 0.20)),
        (int(img.width * 0.96), int(img.height * 0.98)),
        (int(img.width * 0.04), int(img.height * 0.98)),
    ]
    d.polygon(poly, fill=255)
    mask = ImageChops.multiply(mask, clip)
    return mask.filter(ImageFilter.GaussianBlur(2))


def add_elliptical_dent(img: Image.Image, cx, cy, rx, ry, mask, strength=0.34):
    arr = np.asarray(img).copy()
    y, x = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
    dist = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
    m = np.clip(1.0 - dist, 0, 1).astype('float32') * (np.asarray(mask) / 255.0).astype('float32')
    shadow = m * strength
    highlight = np.clip(1.0 - np.sqrt(((x - (cx - rx * 0.35)) / (rx * 0.75)) ** 2 + ((y - (cy - ry * 0.42)) / (ry * 0.75)) ** 2), 0, 1)
    highlight *= (np.asarray(mask) / 255.0).astype('float32') * 0.18
    arr = arr.astype('float32')
    arr[..., :3] = arr[..., :3] * (1.0 - shadow[..., None] * 0.85)
    arr[..., :3] = arr[..., :3] + highlight[..., None] * 65.0
    img.paste(Image.fromarray(np.clip(arr, 0, 255).astype('uint8')), None)


def add_jagged_crack(img: Image.Image, points, mask, color=(0, 0, 0, 190), width=8):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, 'RGBA')
    d.line(points, fill=color, width=width)
    d.line(points, fill=(255, 255, 255, 85), width=max(1, width // 2))
    layer_alpha = ImageChops.multiply(layer.getchannel('A'), mask)
    layer.putalpha(layer_alpha)
    img.alpha_composite(layer)


def add_visible_washer_body_damage(img: Image.Image):
    """Add visible dents/scuffs/cracks on the washer body, clipped to washer."""
    mask = create_washer_damage_mask(img)
    # Large dent on front-right cabinet panel, clearly on the washer.
    add_elliptical_dent(img, int(img.width * 0.70), int(img.height * 0.58), int(img.width * 0.13), int(img.height * 0.18), mask, strength=0.38)
    add_jagged_crack(img, [
        (int(img.width * 0.66), int(img.height * 0.45)),
        (int(img.width * 0.69), int(img.height * 0.50)),
        (int(img.width * 0.67), int(img.height * 0.55)),
        (int(img.width * 0.73), int(img.height * 0.62)),
        (int(img.width * 0.70), int(img.height * 0.70)),
    ], mask, color=(0, 0, 0, 210), width=9)
    add_jagged_crack(img, [
        (int(img.width * 0.73), int(img.height * 0.56)),
        (int(img.width * 0.78), int(img.height * 0.59)),
        (int(img.width * 0.75), int(img.height * 0.65)),
    ], mask, color=(0, 0, 0, 185), width=6)

    # Smaller dent/scuff cluster lower front-left, still on washer body.
    add_elliptical_dent(img, int(img.width * 0.36), int(img.height * 0.76), int(img.width * 0.09), int(img.height * 0.12), mask, strength=0.26)
    add_jagged_crack(img, [
        (int(img.width * 0.33), int(img.height * 0.72)),
        (int(img.width * 0.35), int(img.height * 0.76)),
        (int(img.width * 0.34), int(img.height * 0.81)),
    ], mask, color=(0, 0, 0, 180), width=7)

    # Visible chip on top-right lid rim/top surface, clipped to washer mask.
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, 'RGBA')
    px, py = int(img.width * 0.70), int(img.height * 0.29)
    d.ellipse((px - 55, py - 25, px + 45, py + 35), fill=(0, 0, 0, 165))
    d.ellipse((px - 38, py - 18, px + 22, py + 18), fill=(255, 255, 255, 95))
    layer_alpha = ImageChops.multiply(layer.getchannel('A'), mask)
    layer.putalpha(layer_alpha)
    img.alpha_composite(layer)


def neutralize_green_damage_cast(img: Image.Image, source: Image.Image):
    """Remove any green cast only from pixels changed by the damage edit."""
    src = np.asarray(source.convert('RGB')).astype('int16')
    out = np.asarray(img.convert('RGB')).astype('int16')
    diff = np.abs(out - src).max(axis=2)
    # Exclude bottom watermark and keep only edited pixels.
    y = np.mgrid[0:out.shape[0], 0:out.shape[1]][0]
    changed = (diff > 18) & (y < out.shape[0] - 280)
    green_cast = changed & (out[..., 1] > out[..., 0] + 8) & (out[..., 1] > out[..., 2] + 8)
    if green_cast.any():
        out[green_cast, 1] = ((out[green_cast, 0] + out[green_cast, 2]) / 2.0).astype('int16')
    # If the edited region still has a green bias, pull it back to neutral.
    edited = out[changed]
    if edited.size:
        delta = int(edited[:, 1].mean() - (edited[:, 0].mean() + edited[:, 2].mean()) / 2.0)
        if delta > 6:
            out[changed, 1] = np.clip(out[changed, 1] - delta, 0, 255)
    img.paste(Image.fromarray(np.clip(out, 0, 255).astype('uint8')), None)


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
    clean_source = img.convert('RGB').copy()
    w, h = img.size

    # Top-loader glass lid quad. The inward scale keeps chips/dents inside the
    # transparent glass and off the white rim/front cabinet/control panel.
    raw_lid_quad = [
        int(w * 0.24), int(h * 0.25),
        int(w * 0.72), int(h * 0.24),
        int(w * 0.75), int(h * 0.62),
        int(w * 0.20), int(h * 0.66),
    ]
    lid_quad = scale_quad_inward(raw_lid_quad, scale=0.72)

    add_soft_impact_shadow(img, lid_quad, strength=0.28)

    dark_layer, bright_layer = extract_crack_reflection_layers(TEXTURE_PATH)
    # Higher opacity than v12 so the real glass fracture is actually visible.
    warp_layer(img, lid_quad, dark_layer, opacity=0.68)
    warp_layer(img, lid_quad, bright_layer, opacity=0.52)
    add_radial_cracks(img, lid_quad)
    add_inside_chips(img, lid_quad)
    add_visible_washer_body_damage(img)

    # Very light camera/noise compression to blend the extracted fracture lines.
    img = img.filter(ImageFilter.GaussianBlur(0.08))
    arr = np.asarray(img).copy()
    rng = np.random.default_rng(20260609)
    noise = rng.normal(0, 1.4, arr.shape).astype('int16')
    arr = np.clip(arr.astype('int16') + noise, 0, 255).astype('uint8')
    img = Image.fromarray(arr, 'RGBA')
    neutralize_green_damage_cast(img, clean_source)

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
        'damage_types': ['real_fractured_glass_crack_lines_warped_to_lid', 'visible_radial_glass_cracks', 'inside_glass_impact_chips', 'visible_neutral_gray_washer_body_dents', 'washer_body_cracks', 'washer_top_rim_chip'],
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
                'source_url': 'https://commons.wikimedia.org/wiki/File:Glass_cobweb.jpg',
                'license_note': 'Wikimedia Commons featured picture; verify final license before external publication.',
                'extraction_note': 'Only local-contrast crack/reflection lines were extracted. The background scene, frame, shade, and window context were not pasted.'
            }
        ],
        'approval_status': 'preview_pending',
        'final_allowed': False,
        'lid_quad_after_inward_scale_0_72': lid_quad,
        'notes': 'Preview-only edit for IMG-AD-20260609-0001. Uses real fractured-glass crack pattern extracted from Wikimedia Glass cobweb reference, warped to the top-loader glass lid polygon with visible opacity. Adds visible radial glass cracks, chips inside the lid glass area, and visible neutral-gray dents/scuffs/cracks on the washer body/top rim. Green cast removed from edited pixels. No broken-window background scene, frame, shade, or green shade is included.'
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

    print(json.dumps({'preview': str(out), 'metadata': str(meta_path), 'debug': str(ROOT / 'metadata' / 'synthetic-identity' / f'{SOURCE_ASSET_ID}__{EDIT_VERSION}__crack-extract-debug.jpg'), 'sha256': meta['sha256'], 'approval_status': 'preview_pending'}, indent=2))


if __name__ == '__main__':
    main()
