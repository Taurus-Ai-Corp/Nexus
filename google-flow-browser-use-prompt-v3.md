# Google Flow / Gemini Omni — Browser Agent Instructions v3
## PetPawSphere Launch Campaign — UI-Discovered + Advanced Techniques

Target profile: `effinfernandez@gmail.com` Chrome profile, already signed in to Google Flow at https://labs.google/fx/tools/flow

---

## WHAT I DISCOVERED ABOUT THE PUBLIC UI

The public Flow page confirms these labels exist in the product:
- Main entry: **"Create with Google Flow"**
- Core workflow: **Plan → Create → Refine**
- Top navigation: **Overview | Models | Capabilities | Tools | Flow Sessions | Pricing**
- Models: **Gemini Omni**, **Nano Banana**, **Veo 3.1**
- Built-in tools:
  - **Type Overlays** — add animated text to videos
  - **Video Resizer** — resize videos into any aspect ratio
  - **Image Editor**
  - **Storyboard Studio** — write script, create cast, visualize storyboard
  - **Shader Effects** — apply visual filters
  - **Mockup** — comp images into environments
  - **Ribbit** — perform videos live to beat
  - **Converge** — render sketches
  - **Character X-ray** — develop characters and backstory
  - **pixelBento** — lo-fi / glitch post-processing
  - **Grid Architect** — create image grids and extract images
  - **Scout360** — capture 360° environment from image
- Subscription tiers: Google AI Plus, Pro, Ultra

Because the authenticated app loads dynamically, you must discover exact buttons/fields visually. Use the labels above as search targets.

---

## GOOGLE FLOW PROMPT-TREE WORKFLOW

Google Flow uses a three-step tree UI:

1. **List the Details**
   - Type the main subject first.
   - Add details and subdetails as nested tree nodes.

2. **AI Writes the Rest**
   - Flow converts the tree into an optimized generation prompt.

3. **Make Edits**
   - Edit any tree node.
   - Flow creates a targeted edit prompt for the next generation.

Build every PetPawSphere asset as a tree:
```
Subject: @Amina holding iPhone
├── Product: PetPawSphere app screen
│   └── Detail: "94% match — Persian kitten" green check
├── Cast: @Amina (recurring)
├── Pet: @Luna Persian kitten reference
├── Setting: modern Dubai apartment living room
├── Lighting: soft natural window light, warm paper tones
├── Camera: handheld smartphone, vertical 9:16, close-up
└── Motion: Amina smiles → taps phone → result pops up
```

---

## BRAND & CAST LOCK

**Brand:**
- Name: PetPawSphere
- Colors: warm paper `#f5f0e4`, green `#00843D`, red `#CE1126`, black `#0e0e0e`
- Tagline: "Where every paw finds its trusted path."
- Market: UAE-first, Arabic-English bilingual, premium but approachable

**Recurring Cast (create in Flow's cast/character system):**
1. **Amina** — Emirati pet owner, 28, warm, tech-savvy. Hijab warm paper tone, linen outfit, modern Dubai apartment. Bilingual Arabic-English voice.
2. **Khalid** — Verified breeder, 35, neat beard, PetPawSphere green polo. Arabic-first authoritative voice.
3. **Luna** — Cream Persian kitten, green eyes, playful.
4. **Simba** — Golden retriever, green-accent collar, Dubai park.

---

## 4 ADVANCED TECHNIQUES — APPLY TO EVERY SCENE

### 1. Anchor Technique (R2V Consistency)
Upload reference images before prompting. Omni Flash supports up to 7 anchors.

Anchor set per scene:
- Cast portrait (Amina/Khalid)
- Pet reference (Luna/Simba)
- Product reference (iPhone showing PetPawSphere UI)
- Style reference (warm paper + green + red mood board)
- Setting reference (Dubai apartment / breeder facility)
- Lighting reference (soft window light)
- Composition reference (9:16 framing guide)

### 2. Precision Interpolation
Use **First Frame** and **Last Frame** references to control motion start/end.

Scene interpolations:
- hero_match: Frame 1 = Amina holds phone → Frame 2 = screen shows "94% match" green check
- breeder_trust: Frame 1 = Khalid speaks → Frame 2 = MOCCAE Verified badge fills screen
- family_moment: Frame 1 = family settles on sofa → Frame 2 = Amina smiles at care reminder

### 3. V2V Style Transfer
Record a simple real 9:16 phone video, then use **Omni Flash Video Editing** / **Refine** to transform it into PetPawSphere branded aesthetic while keeping movement.

Best use cases:
- Real pet footage → warm-paper branded UGC clip
- Real breeder facility footage → clean MOCCAE trust scene
- Real family sofa moment → premium lifestyle scene

### 4. Systematic Storyboarding
Before full video, generate a **3×3 image grid** for each scene.

Steps:
1. Build 9-frame prompt tree covering all emotional/camera beats.
2. Use **Grid Architect** or manual 3×3 image generation.
3. Lock lighting and cast across all 9 frames.
4. Select the strongest frames.
5. Use selected frames as First/Last Frame anchors for final 8-10s videos.

---

## STEP-BY-STEP WORKFLOW

### Step 0: Enter Google Flow
1. Ensure you are on the `effinfernandez@gmail.com` profile.
2. Navigate to https://labs.google/fx/tools/flow if not already open.
3. Look for and click the main CTA: **"Create with Google Flow"** or **"Try in Google Flow"**.

### Step 1: Create Project
1. Inside the authenticated app, look for **"New"**, **"New project"**, or a plus icon.
2. Create project named: `PetPawSphere Launch Campaign — June 2026`.
3. If Flow asks for a brief/prompt, paste the tagline: "Where every paw finds its trusted path."

### Step 2: Create Recurring Cast
1. Look for **"Cast"**, **"Characters"**, **"Recurring cast"**, or **Character X-ray** tool.
2. Add each cast member with:
   - Name
   - Description (use look/voice details above)
   - Reference photo if available
3. Save as persistent cast.

### Step 3: Generate Storyboard Grids
For each scene, build a 3×3 prompt tree and generate images first.

Use **Storyboard Studio** or **Grid Architect** if available; otherwise generate 9 individual images.

Scene grids to generate:
- hero_match_grid
- breeder_trust_grid
- family_moment_grid

### Step 4: Generate Videos with Anchors + Interpolation
For each scene:
1. Start a new video generation.
2. Upload anchors (cast, pet, product, style, setting, lighting, composition).
3. Set First Frame and Last Frame from the storyboard grid.
4. Paste the optimized prompt tree into the generation field.
5. Request 9:16 vertical, 8-10 seconds, premium cinematic style.

Scene prompts:

**hero_match:**
```
@Amina holds iPhone. Screen shows PetPawSphere AI breed detection. Result card reads "94% match — Persian kitten" with green check. Modern Dubai apartment living room, warm paper tones, soft natural window light. Handheld smartphone vertical 9:16 close-up. Amina smiles, taps phone, result pops up.
```

**breeder_trust:**
```
@Khalid stands in clean modern pet facility, gestures toward phone. Phone screen shows breeder profile with green shield badge reading "MOCCAE Verified" in Arabic and English. Neutral warm lighting. Vertical 9:16 medium shot. Trustworthy, calm, Arabic-first tone.
```

**family_moment:**
```
Emirati family on warm paper-toned sofa. @Simba golden retriever rests head on child's lap. @Amina smiles holding phone showing PetPawSphere care reminder. Premium Dubai family living room, golden-hour window light. Vertical 9:16 wide shot. Gentle, emotional, slow motion.
```

### Step 5: Refine with Built-in Tools
For each generated video:
1. **Video Resizer** → 9:16, 1080×1920
2. **Type Overlays** → add bilingual CTA:
   - Arabic: "اكتشف توأم حيوانك الأليف"
   - English: "Find your pet's trusted match"
3. **Shader Effects** → warm premium grade, lift shadows to warm paper, pop green on badges
4. **Image Editor** → export best still frames as 4:5 or 1:1 images for feed ads

### Step 6: Build Custom Tools (Optional)
If Flow supports "Create tools using natural language", build:
- **PetPawSphere Ad Pack** — 3 video variants from one product shot
- **MOCCAE Trust Badge Overlay** — adds verified badge to breeder scenes
- **Arabic Text Overlay** — adds bilingual CTA with safe padding
- **Vertical 9:16 Resizer** — one-click crop to 1080×1920 with brand padding

### Step 7: Export
1. Download final assets to:
   `~/Downloads/petpawsphere_flow_assets/`
2. Name files:
   - `petpawsphere_hero_match_v1.mp4`
   - `petpawsphere_breeder_trust_v1.mp4`
   - `petpawsphere_family_moment_v1.mp4`
   - `petpawsphere_hero_match_4x5.png`
   - `petpawsphere_breeder_trust_4x5.png`
   - `petpawsphere_family_moment_4x5.png`

### Step 8: Ferry to Nexus
For each asset, POST:
```
POST https://nexus.taurusai.io/api/campaign-pipeline
Content-Type: application/json

{
  "action": "omni_ingest",
  "asset_url": "https://your-host/petpawsphere_hero_match_v1.mp4",
  "filename": "petpawsphere_hero_match_v1.mp4",
  "scene": "hero_match",
  "prompt_hash": "flow-v3-anchor-interpolation-storyboard",
  "metadata": {
    "client": "PetPawSphere",
    "platform": "Google Flow / Gemini Omni",
    "techniques": ["anchor", "interpolation", "v2v", "storyboard"],
    "cast": ["amina"],
    "aspect_ratio": "9:16",
    "duration_seconds": 8
  }
}
```

Confirm response:
```json
{ "status": "success", "asset": { "id": "omni-asset-..." } }
```

---

## DISCOVERY COMMANDS FOR THE BROWSER AGENT

If a label is not immediately visible, instruct the agent:
- "Click the main CTA labeled 'Create with Google Flow'."
- "Look for a 'New project' button or plus icon in the top-left or top-right."
- "Search the page for text 'Cast', 'Characters', or 'Recurring cast'."
- "Look under the 'Tools' tab for Video Resizer, Type Overlays, and Shader Effects."
- "If you see a 'Plan' tab, open it to create the storyboard."
- "For downloads, look for a download icon, three-dot menu, or 'Export' button on each generated asset."

---

## SAFETY & QUALITY RULES

- No immodest clothing, alcohol, gambling, or political content.
- Arabic text: Modern Standard Arabic, UAE-appropriate.
- Keep all text/CTA inside the central 84% safe zone of 9:16 video.
- No iOS/Android status bar or home indicator in final exports.
- If a tool is missing or fails, skip it and continue.

---

## REPORT BACK

After completion, return:
1. Flow project/session name and URL if available
2. Which cast members were successfully created
3. Which scenes were generated and which techniques were used per scene
4. Final filenames and local paths
5. Nexus asset IDs returned from omni_ingest
6. Any custom tools built inside Flow
7. Any UI labels or selectors discovered that differ from this guide
