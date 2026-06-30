CLAUDE-ADS REPO ANALYSIS
========================
Repo: https://github.com/AgriciDaniel/claude-ads
Version analyzed: v1.7.1 (2026-05-18), MIT license
Local clone: /tmp/claude-ads/

WHAT THIS REPO ACTUALLY IS
--------------------------
The marketing copy says "Paid Advertising Audit & Optimization Skill" and that
is the headline. But buried inside is a tightly engineered ad-CREATIVE pipeline
worth stealing. It is a Claude Code "Agent Skill" with a 3-layer architecture:

  1. /ads dna        -> scrape a website, output brand-profile.json
  2. /ads create     -> produce campaign-brief.md (concepts + copy frameworks)
  3. /ads generate   -> banana/MCP image generation -> ad-assets/
  4. /ads photoshoot -> 5-style product photography pipeline

That 4-stage pipeline is the gold. It is essentially a deterministic,
prompt-engineered assembly line for paid social/search creative. The
"audit" pieces (250+ checks, scoring rubric, Andromeda similarity rules)
are useful too, but for OUR purposes (AI-generated ad creative) the
creative-pipeline skills are the relevant surface.

The repo is opinionated about Meta Andromeda, TikTok Symphony, Google AI
Max, and post-iOS privacy stacks. It assumes the operator has Claude Code
+ banana MCP + nanobanana (Gemini image gen). Those are interchangeable;
the underlying prompt contracts are what we steal.

THE FIVE-STEP CREATIVE PIPELINE (THE ACTUAL LOOP)
-------------------------------------------------
  brand-profile.json  ──>  campaign-brief.md  ──>  ad-assets/*.png

brand-profile.json schema (extract from ads-dna/SKILL.md):
  - voice (six 1-10 axes: formal_casual, rational_emotional, playful_serious,
    bold_subtle, traditional_innovative, expert_accessible) + 3 adjectives
  - colors (primary/secondary/forbidden/background/text as hex)
  - typography (heading_font, body_font, pairing)
  - imagery (style, subjects, composition, forbidden list)
  - aesthetic (mood_keywords, texture, negative_space)
  - target_audience (age_range, profession, pain_points, aspirations)
  - screenshots[] (Playwright captures of homepage/product/about)

campaign-brief.md schema (ads-create/SKILL.md):
  ## Brand DNA Summary
  ## Audit Context                (optional: weakness-targeted concepts)
  ## Campaign Concepts            (3-5, each with hypothesis, primary message,
                                  tone, copy framework, two visual directions,
                                  platforms, CTA, audit-finding addressed)
  ## Copy Deck                    (headlines, primary text, CTAs per
                                  concept x platform, char-count shown)
  ## Image Generation Briefs      (one per concept x platform: prompt,
                                  dimensions, banana domain mode,
                                  safe-zone notes)
  ## Next Steps

ad-assets/ tree:
  ./ad-assets/[platform]/[concept-slug]/[format]-[WxH]-v[N].png
  Three variants per brief: v1 base, v2 alt angle, v3 different lighting.
  A hero image is generated first and used as the consistency anchor for
  every other image in the campaign. This is the killer detail: it solves
  the "5 images from 5 generations that don't look like the same brand"
  problem.

WHAT MAKES THE APPROACH DIFFERENT
---------------------------------
1. Brand DNA is a STRUCTURED JSON OBJECT, not a vibe. Six numerical voice
   axes map deterministically to visual descriptors via voice-to-style.md.
   That mapping is the trick; without it, every image gen is a guess.

2. Every image prompt is built with a 5-COMPONENT FORMULA:
     [SUBJECT] + [ACTION] + [LOCATION/CONTEXT] + [COMPOSITION] + [STYLE]
   Brand colors lead. Copy zones are reserved per-platform ("bottom 30%
   minimal for copy overlay" on Meta, "right 40% clean" on YouTube).
   "no text, no labels, no readable words" is appended by default because
   image models hallucinate glyphs. This avoids the "KEYWORISNG" garbage
   that plagues naive image-gen workflows.

3. Copy is FRAMEWORK-DRIVEN, not freestyle. Six proven frameworks
   (AIDA, PAS, BAB, 4P, FAB, Star-Story-Solution) are picked by
   audience temperature + goal, then applied to every variant. Two
   variants per platform (primary + alternative framework) for A/B
   testing out of the box.

4. AUDIT-INFORMED CREATIVE. If an audit report exists, at least 2 of 3+
   concepts must directly address a weakness (creative fatigue, low
   branded CTR, format diversity gap). This is the missing link in most
   AI creative pipelines: it grounds concepts in actual account pain.

5. META ANDROMEDA / TIKTOK DIVERSITY RULES BAKED IN. The repo enforces
   "100 minor variations (color swaps) perform no better than 10 genuinely
   distinct creatives." Concepts must be different in MESSAGING ANGLE,
   not just visual treatment. Similarity >60% triggers Meta clustering
   and suppression. This is the rule most teams violate.

6. CHARACTER-LIMIT DISCIPLINE WITH COUNT VERIFICATION. Every headline is
   shown with its char count next to it. Platform limits are hardcoded
   per-network (Meta 40 headline / 125 primary, Google 30/90, LinkedIn
   70/100, TikTok 100/25, YouTube 100/15). This is a small thing that
   saves a huge amount of rework.

7. REFRESH CADENCE BY PLATFORM IS QUANTIFIED:
     TikTok every 7-10 days, Meta 14-21, LinkedIn 4-6 weeks,
     Google Search 8-12, YouTube 4-8. Fatigue thresholds: CTR >20%
     decline over 14d, frequency >5 prospecting or >12 retargeting.
   Most creative systems pretend creative is one-and-done.

TOP 5 TECHNIQUES TO STEAL (PRIORITY ORDER)
------------------------------------------
1. BRAND-VOICE-TO-VISUAL-STYLE MAPPING (voice-to-style.md)
   Six voice axes (1-10) -> fixed visual descriptors per range. Build the
   mapping table ONCE; reference it in every prompt. Eliminates the
   "describe the brand in 3 adjectives and pray" failure mode.

2. 5-COMPONENT IMAGE PROMPT FORMULA (visual-designer.md)
   Subject + Action + Location + Composition + Style. Mandatory append:
   hex-color lead-in, "no text, no labels, no readable words", and a
   per-platform copy-zone clause. Cap at 80 words. This alone fixes 80%
   of bad image-gen output.

3. FRAMEWORK-DRIVEN COPY WITH CHAR-COUNT VERIFICATION (copy-frameworks.md)
   Pick framework by audience temp + goal. Use the per-platform template
   strings (e.g., PAS Meta: "[Problem]. [Agitate]. [Solution with brand].").
   Show the char count next to every line. Generate two framework
   variants per platform for native A/B. Six frameworks; covers every
   common campaign type.

4. HERO-FIRST CONSISTENCY ANCHOR (visual-designer.md)
   Generate one hero image first. Pass it as reference input to every
   subsequent generation. All campaign assets share palette, lighting
   direction, and tone. Single biggest visual-consistency lever.

5. AUDIT-INFORMED CONCEPT GROUNDING + ANDROMEDA DIVERSITY DISCIPLINE
   If audit data exists, at least 2 of 3+ concepts must directly target a
   measured weakness. Enforce distinct messaging ANGLES (pain point,
   social proof, offer, demo, education), not just visual variations.
   This is the rule that separates "AI made 100 ads" from "AI made 10
   genuinely different ads that work."

USEFUL EXTRAS WORTH GRABBING
----------------------------
- 5-style product photography template (ads-photoshoot/SKILL.md):
  Studio, Floating, Ingredient, In Use, Lifestyle. Each with a base
  prompt template, composition rules, and domain-mode selection. Ready
  to drop into any product-led workflow.

- Per-platform safe zones with ASCII diagrams (meta-creative-specs.md,
  tiktok-creative-specs.md). Use the 900x1000px cross-platform safe
  area as the universal rule.

- E-commerce playbook (ecommerce-creative.md): 5 campaign types
  (Product Launch, Sale, Seasonal, Retargeting, Brand Awareness) each
  with required assets, platform priority, banana domain mode, aspect
  ratios, copy framework, and budget %.

- Fatigue signals table (ads-creative/SKILL.md): CTR>20% in 14d,
  frequency>5 prospecting, watch<3s on TikTok, engagement>30% drop.
  Pair with refresh cadence above to drive a production loop.

- Quality gate rubric for generated images (1-10 by brand alignment,
  composition, platform fit; regen if <6).

IMPLEMENTATION NOTES FOR NEXUS
------------------------------
- We don't need to import the whole repo. Extract the prompts/templates
  and run them as our own prompt contracts inside our existing pipeline.
- The brand-profile.json schema is the right normalization target.
  Ingest any brand data (URL scrape, manual entry, or competitor research)
  into that shape, then run every downstream creative through the same
  pipeline.
- The visual-designer 5-component formula should be a hard-coded prompt
  builder function, not freeform. Same for copy-writer's per-platform
  templates.
- Hero-image consistency anchor maps directly to image-to-image / ref-
  image features in current image APIs (Imagen, FLUX Redux, SDXL IP-
  Adapter, Gemini reference input). One small wrapper, big visual win.
- The thinking-framework (10 principles: OBSERVE/LISTEN/THINK/CONNECT/
  FEEL/ACCEPT/CREATE/GROW) is more philosophy than technique, but the
  "spec compliance without emotional pull is a fail" anti-pattern is a
  useful guardrail to encode in QA.