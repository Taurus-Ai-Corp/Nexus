
# Nexus + Google Flow / Google Omni Integration Architecture

## Core Insight
Google Flow is a browser-first creative studio with no official API. The integration pattern is NOT a direct server-to-server API. Instead, it is a Human-in-the-Loop + Asset-Ferry architecture:
- Nexus backend sends structured creative briefs to the user/agent
- Agent opens Google Flow in the browser, executes prompts, downloads assets
- Assets are uploaded back to Nexus backend for storage, tagging, approval, and campaign deployment
- Over time, successful prompts are templated and reused

## Novel Architecture: "Omni Creative Loop"

```
┌─────────────────┐     brief     ┌──────────────────────┐
│  Nexus Backend  │──────────────▶│  Browser Agent / User  │
│  (campaign kit) │               │  (Google Flow tab)     │
└─────────────────┘               └──────────────────────┘
         ▲                                    │
         │     downloaded assets             │ prompts + references
         │     (video, image, edits)         │
         └────────────────────────────────────┘
                  Google Cloud Storage / Drive / Vercel Blob
```

## Layer 1 — Brief Generator (Nexus Backend)
Transforms campaign kit into Google Flow-optimized prompt blocks:
- Scene-by-scene video prompts
- Character sheet (@character_name) definitions
- Image reference selection
- Voice/persona settings
- Negative prompts and style lock
- Output format: JSON brief → Markdown card → Browser-use instruction

## Layer 2 — Browser Agent (Human or Automation)
Receives brief and performs in Google Flow:
1. Create new project / Flow Session
2. Set up recurring cast (characters + voices)
3. Upload reference images from Nexus assets
4. Enter prompts into chat/agent box
5. Generate video/image variations
6. Apply edits with natural language
7. Download best outputs
8. Return assets to Nexus

## Layer 3 — Asset Ingestion Pipeline (Nexus Backend)
- Upload to GCS / Drive / Vercel Blob
- Run vision compliance check (when available)
- Tag with campaign ID, model, prompt hash, A/B test variant
- Convert to delivery formats (9:16 MP4, square, 16:9)
- Inject into Meta/Google Ads via API

## Layer 4 — Feedback & Prompt Evolution
- Track performance per prompt template
- Winning prompts become reusable "Omni tools" inside Google Flow
- Feed conversion data back to brief generator

## Integration Endpoints Needed in Nexus
- POST /api/omni/brief — generate Google Flow brief from campaign
- POST /api/omni/ingest — receive downloaded asset + metadata
- GET /api/omni/templates — list proven Flow prompt templates
- POST /api/omni/feedback — log ad performance per prompt

## Recommended Workflow for PetPawSphere
1. Use existing CAMPAIGN-PLAYBOOK.md as input
2. Generate a 5-scene Flow Session brief for launch
3. Create recurring cast: "Amina" (Emirati pet owner, 28), "Khalid" (breeder), Persian kitten, golden retriever
4. Generate hero video: Amina + phone + breed detection UI
5. Generate breeder trust video: Khalid + verified badge
6. Edit with Video Resizer for 9:16, add Type Overlays
7. Download, ingest to Nexus, deploy to Meta/TikTok

## Tools to Build Inside Google Flow (Natural Language)
- "PetPawSphere Ad Pack" — generates 3 video variants from one product shot
- "MOCCAE Trust Badge Overlay" — adds verified breeder graphic
- "Arabic Text Overlay" — adds bilingual CTA
- "Vertical 9:16 Resizer" — one-click format conversion
