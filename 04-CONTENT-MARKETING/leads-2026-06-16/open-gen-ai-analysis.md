# Anil-matcha / Open-Generative-AI — Ad Creative Analysis

Repo: https://github.com/Anil-matcha/Open-Generative-AI
Cloned to: /tmp/open-generative-ai/

================================================================
1. WHAT THIS REPO ACTUALLY IS
================================================================

Despite the name, this is NOT a dedicated "ad creative" generator. It is a
generic, model-agnostic generative media studio (Vite + React + Tailwind)
that wraps Muapi.ai's API for 200+ image/video/audio models. Think
"open-source ComfyUI-web replacement" rather than "Madgicx / Pencil /
AdCreative.ai".

The README is mostly marketing. The ad-specific component lives at:
  packages/studio/src/components/MarketingStudio.jsx
  packages/studio/src/muapi.js  (line 151: generateMarketingStudioAd)

It is one of ~14 "studios" inside the app (Image, Video, Cinema, Lip Sync,
Vibe Motion, Workflow, Agent, Apps, Design Agent, MCP/CLI, etc.). The
Marketing Studio is a thin shell on top of a single video model:
  endpoint: seedance-2-vip-omni-reference  (or 1080p variant)

So the "techniques for ad creative" question reduces to:
  - What does the Marketing Studio's UX scaffold force the user to do?
  - How is the prompt compiled before being sent to Seedance?
  - What reference assets and presets are pre-bundled?

================================================================
2. THE ACTUAL TECHNIQUES (NOT THE MARKETING COPY)
================================================================

A. PRE-BUNDLED "VIDEO FORMAT PRESETS" (the most stealable thing)
---------------------------------------------------------------
File: MarketingStudio.jsx, lines 80-88
Hard-coded UGC-style reference videos hosted on Cloudfront:

  const ASSETS = {
    ugc: [
      { id: 1, name: "UGC",              url: ".../ugc.mp4" },
      { id: 2, name: "Tutorial",         url: ".../ugc_how_to.mp4" },
      { id: 3, name: "Unboxing",         url: ".../ugc_unboxing.mp4" },
      { id: 4, name: "Hyper Motion",     url: ".../hyper-motion-mini.mp4" },
      { id: 5, name: "Product Review",   url: ".../product_review.mp4" },
      { id: 6, name: "TV Spot",          url: ".../tv-spot-mini.mp4" }
    ]
  };

These are passed as `video_files: [params.videoUrl]` to the model. So
the user picks a *format archetype* (Unboxing, Tutorial, Product Review)
rather than describing one. The model imitates the motion, pacing, and
camera language of the reference clip, then layers the user's product
and prompt on top.

WHY THIS MATTERS: This is the single biggest reason their output is
"recognizable as an ad" instead of "looks like a random AI video". The
reference video bakes in a known ad grammar (Unboxing = hands + product
reveal, Tutorial = talking head + demo, TV Spot = hero shot + voiceover
pacing). A normal buyer can read these formats. They cannot read a
cinematic Mars landscape.

STEAL: build a preset library of 6-10 ad format reference clips (UGC,
Unboxing, Before/After, Testimonial, Demo, Founder Story, etc.) and
let the user pick one. Pass the chosen clip as a style/structure
reference to the video model.


B. PRE-BUNDLED "AVATAR PRESETS" (named on-camera talent)
--------------------------------------------------------
File: MarketingStudio.jsx, lines 70-79
8 named human avatars (Priya, Elena, Kai, Sora, Minji, Margot, Niko,
Jin) with diverse-appearing Cloudfront URLs. These are the "talent"
options the user can drop into their ad by typing @image2.

The PLACEHOLDER SYNTAX in the prompt is the clever part:

  placeholder="Describe your ad script... Use @image1 for product,
               @image2 for avatar."

Images are passed in this order: [productImage, avatarImage, ...refs]
=> the model receives them as @image1 (slot 1) and @image2 (slot 2).

WHY THIS MATTERS: Generic AI prompts say "a woman holding the product"
and the model invents a woman who may not match the brand's actual
audience. By giving the user a CURATED set of named avatars and a
typed token to reference them by, you constrain the output to a
known-good person. This is exactly how UGC platforms like Arcads,
Creatify, and AdsGen work — and the open-source version of the trick
is literally just a dropdown of 8 URLs.

STEAL: ship a "Talent" dropdown of 10-20 reference photos (with
licensing) and teach users the @image1/@image2 convention.


C. CINEMATIC CAMERA COMPILER (the "looks expensive" trick)
----------------------------------------------------------
File: src/lib/promptUtils.js, function buildNanoBananaPrompt()
This is the most sophisticated prompt-engineering block in the entire
repo. It compiles a Camera + Lens + Focal length + Aperture choice
into a single injected phrase:

  return parts.filter(p => p && p.trim() !== "")
    .join(", ");
  // "basePrompt, shot on a grand format 70mm film camera,
  //  using a warm-toned cinema prime lens at 50mm
  //  (standard portrait perspective), aperture f/1.4,
  //  shallow depth of field, creamy bokeh, cinematic lighting,
  //  natural color science, high dynamic range,
  //  professional photography, ultra-detailed, 8K resolution"

Backed by 4 lookup tables:
  CAMERA_MAP       (6 cameras, e.g. "Grand Format 70mm Film")
  LENS_MAP         (11 lenses, e.g. "Warm Cinema Prime")
  FOCAL_PERSPECTIVE (8mm -> 85mm -> "ultra-wide" ... "classic portrait")
  APERTURE_EFFECT  (f/1.4 -> "creamy bokeh", f/11 -> "deep focus clarity")

WHY THIS MATTERS: Buyers don't know what "shot on ARRI Alexa with a
Cooke S4 50mm at T1.4" means, but they DO know the LOOK. By mapping
named UI controls (dropdown of "Warm Cinema Prime") to specific
cinematography vocabulary that the model has been trained on
extensively, the output stops looking like stock footage and starts
looking like a paid production. This is the difference between
"3D render of a moisturizer bottle on a gray background" and "a
moisturizer bottle on a marble vanity, soft window light, shallow
depth of field, 4K cinematic".

The cinema studio ships 20 real reference .webp thumbnails for
cameras, lenses, f-stops (public/assets/cinema/...) so the user
sees what they're choosing.

STEAL: build the same 4 lookup tables and a compilePrompt() function.
Even if you only do 3 cameras + 4 lenses + 3 f-stops, you instantly
elevate output quality. The user-facing labels stay simple ("Warm
Cinematic", "Sharp Product", "Dreamy Soft") — the magic is in the
mapping.


D. @image1/@image2 PROMPT PLACEHOLDERS (typed token convention)
---------------------------------------------------------------
File: MarketingStudio.jsx, line 460
  "Describe your ad script... Use @image1 for product, @image2 for avatar."

This is a TINY detail but it's how the user controls *which reference
image gets used for what purpose* in a single prompt. Without it, users
write "the product in the first image is held by the person in the
second image" and models lose the binding 50% of the time. With it,
the model receives images_list = [product, avatar, ...refs] and the
user can write "@image1 on a marble counter while @image2 applies it"
and the binding is preserved.

STEAL: add @image1...@imageN syntax to your prompt input. Document it
on the textarea placeholder. It will pay for itself in user trust.


E. PERSISTENT LOCAL DRAFT (saves the half-written ad)
-----------------------------------------------------
File: MarketingStudio.jsx, lines 260-281
Every keystroke debounces to localStorage under key
"hg_marketing_studio_persistent" with full state (prompt, params,
uploads, history). On reload, everything is restored.

WHY THIS MATTERS: Ad creative is iterative. The user types a script,
generates, hates it, tweaks, regenerates. A lost draft after a refresh
is a conversion killer. The repo treats draft persistence as
table-stakes.

STEAL: persist prompt + product image + format choice on every change
with a 500ms debounce. localStorage key with a version suffix so you
can invalidate.


F. STRICT VALIDATION BEFORE LAUNCH
----------------------------------
File: MarketingStudio.jsx, lines 326-328
  if (!prompt.trim()) return alert("Please enter an ad script.");
  if (!productImage) return alert("Please upload a product image.");

The model NEEDS both a product image and a prompt. Generic AI ad
generators usually let you submit "nothing" and you get a pretty but
useless image of a product that isn't your product. By hard-failing
with a specific message ("Please upload a product image"), the
output is always anchored to the user's actual product. This is why
their ads look like ads and not like AI art.

STEAL: never let the model generate without an explicit product/
brand reference image. Refuse with a clear message.


G. MULITPLE REFERENCE IMAGES (up to 14)
---------------------------------------
File: MarketingStudio.jsx, line 240 (additionalImages, max 6 in UI,
8 with the two primary slots)
README: "Multi-image input — feed up to 14 reference images into
compatible models"

WHY THIS MATTERS: Real ads blend the product + the packaging + a
lifestyle photo + a logo + a result shot. One product image is not
enough. The 14-image cap is what lets the same generator produce
"unboxing", "before/after", and "lifestyle" variants of the same
product without re-prompting.

STEAL: allow 5+ reference slots (product, packaging, lifestyle, logo,
result/after) instead of one.


================================================================
3. WHAT IT DOES NOT DO (don't waste time copying)
================================================================

- No system prompt that pre-conditions the LLM as "expert direct-
  response copywriter" or anything like that. The user's text goes
  straight to the video model.
- No copy formula (PAS, AIDA, BAB). The user writes their own script.
  The repo assumes the prompt IS the script.
- No headline generator, no CTA library, no offer framing.
- No A/B variant generator. One prompt = one video.
- No brand guidelines / brand voice memory.
- No scoring ("this ad will convert better than that ad").
- No analytics or feedback loop.

The repo is a TOOL, not a STRATEGY. It gives the user better raw
materials (format presets, avatar library, camera compiler, typed
placeholders) and lets the user supply the rest. That is exactly
why the output "feels" more like an ad than a vanilla prompt — the
raw materials are already ad-shaped.

================================================================
4. PRIORITIZED STEAL LIST (what to build first)
================================================================

  1. [HIGH IMPACT, LOW EFFORT] Format preset library
     6-10 short reference clips labeled (UGC, Unboxing, Tutorial,
     Testimonial, Demo, Before/After, Founder Story, Product Hero).
     User picks one -> passed to model as style reference.
     This alone fixes 60% of the "looks like AI, not like an ad"
     problem.

  2. [HIGH IMPACT, LOW EFFORT] Camera/Lens prompt compiler
     Port buildNanoBananaPrompt() from src/lib/promptUtils.js.
     Even 3 cameras + 4 lenses + 3 apertures is a massive upgrade.

  3. [HIGH IMPACT, LOW EFFORT] @image1..@imageN placeholder convention
     Ship it on the textarea. Document it in the placeholder text.

  4. [MEDIUM IMPACT, LOW EFFORT] Named avatar library
     8-15 reference photos with names, used as @image2.

  5. [MEDIUM IMPACT, LOW EFFORT] Persistent local draft
     500ms debounce to localStorage with versioned key.

  6. [MEDIUM IMPACT, MEDIUM EFFORT] Multiple reference slots
     5+ image inputs (product, packaging, lifestyle, logo, after).

  7. [HIGH IMPACT, HIGH EFFORT] A real copy framework
     This is the part the repo DOES NOT have. The user's prompt is
     raw text. A 3-line copy scaffold like
     "HOOK (1s): <pattern interrupt>
      PROBLEM (3s): <specific pain>
      DEMO (5s): <product in use, @image1>
      PROOF (2s): <result, @image5>
      CTA (1s): <specific offer>"
     would dramatically improve output quality. This repo doesn't do
     it, so the next differentiation is to add it.

================================================================
5. KEY FILE PATHS (for follow-up reads)
================================================================

  /tmp/open-generative-ai/packages/studio/src/components/MarketingStudio.jsx
    -> The whole ad studio UI (601 lines, very readable)
  /tmp/open-generative-ai/packages/studio/src/muapi.js:151
    -> generateMarketingStudioAd() — minimal 8-line wrapper
  /tmp/open-generative-ai/src/lib/promptUtils.js
    -> buildNanoBananaPrompt() + the 4 lookup tables
  /tmp/open-generative-ai/public/assets/cinema/
    -> 20 .webp reference thumbnails for cameras, lenses, f-stops
  /tmp/open-generative-ai/README.md
    -> Marketing context, model list, "Infinite Budget" philosophy

================================================================
ONE-LINE SUMMARY
================================================================
Open-Generative-AI's ad output is more recognizable than generic AI
ads because they pre-bundle *ad-shaped raw materials* (UGC format
presets, named avatars, a camera/lens prompt compiler, typed
@image1/@imageN placeholders) and require the user to provide a real
product image before generating. The "secret" is not a better prompt —
it's a better toolbox.
