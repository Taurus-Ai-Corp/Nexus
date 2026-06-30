#!/usr/bin/env python3
"""Download real photographs from Pexels free stock photo CDN."""

import requests
import pathlib
import time

ASSETS_DIR = pathlib.Path(__file__).parent / "assets"
ASSETS_DIR.mkdir(exist_ok=True)

# Real photos mapped to our 9 image slots
# All from Pexels free stock photography (CC0 / Pexels license - free for commercial use)
IMAGES = {
    "headshot-fashion": {
        "url": "https://images.pexels.com/photos/33539340/pexels-photo-33539340/free-photo-of-professional-woman-in-black-suit-smiling.jpeg",
        "credit": "Photo by RDNE Stock project: https://www.pexels.com/photo/professional-woman-in-black-suit-smiling-33539340/",
    },
    "headshot-chiaroscuro": {
        "url": "https://images.pexels.com/photos/36623223/pexels-photo-36623223/free-photo-of-profile-portrait-of-woman-with-dramatic-lighting.jpeg",
        "credit": "Photo by Emre Bilgic: https://www.pexels.com/photo/profile-portrait-of-woman-with-dramatic-lighting-36623220/",
    },
    "headshot-ceo": {
        "url": "https://images.pexels.com/photos/30004320/pexels-photo-30004320/free-photo-of-professional-headshot-of-smiling-woman-in-black-top.jpeg",
        "credit": "Photo by ProlificPeople: https://www.pexels.com/photo/professional-headshot-of-smiling-woman-in-black-top-30004320/",
    },
    "brand-board": {
        "url": "https://images.pexels.com/photos/8564800/pexels-photo-8564800.jpeg",
        "credit": "Photo by Karolina Grabowska: https://www.pexels.com/photo/magazine-cutouts-and-sticky-notes-8564800/",
    },
    "book-thrive": {
        "url": "https://images.pexels.com/photos/5720786/pexels-photo-5720786.jpeg",
        "credit": "Photo by Sora Shimazaki: https://www.pexels.com/photo/books-and-a-coffee-cup-on-the-table-5720786/",
    },
    "financial-freedom": {
        "url": "https://images.pexels.com/photos/7080555/pexels-photo-7080555.jpeg",
        "credit": "Photo by RDNE Stock project: https://www.pexels.com/photo/gold-coins-in-person-s-hands-7080555/",
    },
    "popup-kiosk": {
        "url": "https://images.pexels.com/photos/34845994/pexels-photo-34845994/free-photo-of-street-vendor-at-night-market-booth-selling-crafts.jpeg",
        "credit": "Photo by Tonderue: https://www.pexels.com/photo/street-vendor-at-night-market-booth-selling-crafts-34845994/",
    },
    "brand-figurine": {
        "url": "https://images.pexels.com/photos/11344029/pexels-photo-11344029.jpeg",
        "credit": "Photo by Karolina Grabowska: https://www.pexels.com/photo/a-white-ceramic-woman-figurine-11344029/",
    },
    "magazine-cover": {
        "url": "https://images.pexels.com/photos/34105301/pexels-photo-34105301/free-photo-of-person-holding-vogue-magazine-in-studio-setting.png",
        "credit": "Photo by cottonbro studio: https://www.pexels.com/photo/person-holding-vogue-magazine-in-studio-setting-34105301/",
    },
}

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "image/avif,image/webp,image/jpeg,image/png,*/*",
    "Accept-Language": "en-US,en;q=0.9",
}

for name, info in IMAGES.items():
    url = info["url"]
    # Determine extension from URL
    ext = url.rsplit(".", 1)[-1].split("?")[0]
    output_path = ASSETS_DIR / f"{name}.{ext}"

    if output_path.exists() and output_path.stat().st_size > 10000:
        print(f"[SKIP] {name} already exists ({output_path.stat().st_size // 1024}KB)")
        continue

    print(f"[DL] {name} -> {output_path.name}")
    try:
        resp = requests.get(url, headers=headers, timeout=60, allow_redirects=True)
        if resp.status_code == 200:
            output_path.write_bytes(resp.content)
            size_kb = len(resp.content) // 1024
            print(f"  OK ({size_kb}KB)")
        else:
            print(f"  FAIL HTTP {resp.status_code}")
            # Try fallback URL format
            fallback = url.replace("/pexels-photo-", "/pexels-photo-").replace(
                url.rsplit("/", 1)[-1], f"pexels-photo-{url.split('photo-')[1].split('/')[0]}.jpg"
            )
            print(f"  Trying fallback: {fallback}")
            resp = requests.get(fallback, headers=headers, timeout=60, allow_redirects=True)
            if resp.status_code == 200:
                output_path.write_bytes(resp.content)
                size_kb = len(resp.content) // 1024
                print(f"  OK via fallback ({size_kb}KB)")
            else:
                print(f"  FALLBACK ALSO FAILED HTTP {resp.status_code}")
    except Exception as e:
        print(f"  ERROR: {e}")

    time.sleep(0.5)

print("\nDone! Listing assets:")
for f in sorted(ASSETS_DIR.iterdir()):
    if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png", ".gif", ".webp"):
        print(f"  {f.name} ({f.stat().st_size // 1024}KB)")
