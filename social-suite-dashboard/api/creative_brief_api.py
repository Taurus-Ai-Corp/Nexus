#!/usr/bin/env python3
"""
Stub creative brief API for Nexus Creative landing page integration.
Run with: uvicorn creative_brief_api:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def generate_demo_brief(brief: str) -> dict:
    industry = "fashion"
    if any(k in brief.lower() for k in ["sunglass", "beach", "summer", "sport"]):
        industry = "sport_luxury"
    elif any(k in brief.lower() for k in ["real estate", "property", "apartment", "villa", "penthouse"]):
        industry = "real_estate"
    elif any(k in brief.lower() for k in ["food", "restaurant", "cafe", "chef"]):
        industry = "food"
    elif any(k in brief.lower() for k in ["beauty", "skincare", "makeup", "salon"]):
        industry = "beauty"

    prompts = {
        "fashion": "Ultra-realistic high-fashion editorial studio portrait... [Nordic tech-street prompt]",
        "sport_luxury": "Ultra-realistic luxury summer sunglasses campaign... [Tropical sport-luxury prompt]",
        "real_estate": "Ultra-realistic luxury real estate campaign photography of a modern Dubai penthouse terrace at golden hour...",
        "food": "Ultra-realistic food photography of a signature dish on a marble table, soft window light, shallow depth of field...",
        "beauty": "Ultra-realistic beauty campaign close-up of glowing skin with minimal makeup, soft diffused studio light...",
    }

    return {
        "headline": brief[:50] + "..." if len(brief) > 50 else brief,
        "image_prompt": prompts.get(industry, prompts["fashion"]),
        "platform_plan": "Instagram + Google Display",
        "mood": "Premium editorial" if industry == "fashion" else "Aspirational " + industry.replace("_", " ") + " grade",
        "deliverables": "hero image prompt, 3 copy variants, shot list, posting schedule",
    }


@app.post("/creative-brief")
def creative_brief(brief: str = Body(..., embed=True)):
    return generate_demo_brief(brief)


@app.get("/health")
def health():
    return {"status": "ok"}
