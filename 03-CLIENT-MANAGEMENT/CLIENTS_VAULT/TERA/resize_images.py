#!/usr/bin/env python3
"""Resize real photos to web-friendly JPEGs at 2000px max dimension."""

import pathlib
from PIL import Image

ASSETS = pathlib.Path("/Users/taurus_ai/Documents/Nexus-Platform/03-CLIENT-MANAGEMENT/CLIENTS_VAULT/TERA/assets")
MAX_DIM = 2000

mapping = {
    "headshot-fashion": "headshot-fashion.jpeg",
    "headshot-chiaroscuro": "headshot-chiaroscuro.jpeg",
    "headshot-ceo": "headshot-ceo.jpeg",
    "brand-board": "brand-board.jpeg",
    "book-thrive": "book-thrive.jpeg",
    "financial-freedom": "financial-freedom.jpeg",
    "popup-kiosk": "popup-kiosk.jpeg",
    "brand-figurine": "brand-figurine.jpeg",
    "magazine-cover": "magazine-cover.png",
}

for name, filename in mapping.items():
    src = ASSETS / filename
    dst = ASSETS / f"{name}.jpg"

    img = Image.open(src)
    # Convert RGBA/P to RGB for JPEG
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    w, h = img.size
    if max(w, h) > MAX_DIM:
        ratio = MAX_DIM / max(w, h)
        new_w, new_h = int(w * ratio), int(h * ratio)
        img = img.resize((new_w, new_h), Image.LANCZOS)
    img.save(dst, "JPEG", quality=92, optimize=True)

    old_kb = src.stat().st_size // 1024
    new_kb = dst.stat().st_size // 1024
    new_w, new_h = img.size
    print(f"{name}: {old_kb}KB -> {new_kb}KB ({new_w}x{new_h})")

print("\nDone.")
