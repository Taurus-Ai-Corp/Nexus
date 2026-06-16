#!/usr/bin/env python3
"""Batch generate Nexus Creative campaign images using Vertex AI Imagen 3."""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from generate_images import generate_campaign_image

CAMPAIGNS = [
    {
        "title": "nordic-editorial-01",
        "prompt": "Editorial fashion campaign photo for a luxury Scandinavian skincare brand, warm natural daylight, model with bare shoulders holding a frosted glass bottle, soft beige linen backdrop, minimalist styling, shot on medium format film, muted earth tones, Vogue Nordic aesthetic",
    },
    {
        "title": "sport-luxury-01",
        "prompt": "Sporty luxury summer campaign photo, tanned model wearing oversized black sunglasses and a white linen shirt, sitting on a vintage racing boat deck, golden Mediterranean sunlight, deep blue sea background, 1980s Riviera mood, shot on 35mm film, high-end fashion editorial",
    },
    {
        "title": "dubai-real-estate-01",
        "prompt": "Luxury Dubai penthouse interior at golden hour, floor-to-ceiling windows overlooking Burj Khalifa skyline, warm travertine marble, bronze accents, designer furniture, soft sunset light, architectural photography, Sotheby's real estate campaign aesthetic",
    },
    {
        "title": "cafe-lifestyle-01",
        "prompt": "Premium specialty coffee shop campaign photo in Dubai, barista pouring latte art, warm morning light through large windows, minimal Japanese interior design, oak and concrete textures, customers in soft focus, editorial food photography, Kinfolk magazine aesthetic",
    },
    {
        "title": "nexus-hero-01",
        "prompt": "Abstract editorial hero image for an AI creative agency, paper textures, soft shadow play, warm cream and ochre tones, minimalist geometric shapes, studio photography, calm luxury mood, no text",
    },
]

OUTPUT_DIR = "assets/campaigns"
PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "project-0ae56a62-0f0a-4d8a-9b7")

if __name__ == "__main__":
    for c in CAMPAIGNS:
        print(f"\n=== {c['title']} ===")
        generate_campaign_image(c["prompt"], OUTPUT_DIR, c["title"], project_id=PROJECT_ID)
