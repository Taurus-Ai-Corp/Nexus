# Google Flow / Gemini Omni — Browser Agent Instructions v4
## PetPawSphere Launch Campaign — Verified from Live Session

Last verified from a live Google Flow session (Jun 18, 2026, project "PetPawSphere Launch Campaign").

Target profile: `effinfernandez@gmail.com` Chrome profile, signed in to https://labs.google/fx/tools/flow

---

## WHAT ACTUALLY WORKS IN GOOGLE FLOW RIGHT NOW

The following features were confirmed working in the live session:
- **Persistent Characters** — reusable cast members under a Characters section
- **Multi-image anchors** — attach reference images to a generation
- **Prompt tree UI** — List the Details → AI Writes the Rest → Make Edits
- **Omni Flash 9:16 video** — 8-second vertical clips
- **Variant generation** — request x2; some may fail but are not charged
- **Edit prompt box** — describe edits and regenerate

The following were claimed by the in-app assistant as "insider secrets" but are NOT guaranteed / were not visible in this build:
- Video Resizer
- Type Overlays
- Shader Effects
- Storyboard Studio
- Mockup/Ribbit/Converge/pixelBento/Grid Architect/Scout360
- Dedicated V2V Omni Flash Video Editing panel
- Precision interpolation / First-Last frame controls
- Systematic 3×3 storyboarding

Use them only if you can literally see them in your session. Otherwise rely on the confirmed features above.

---

## BRAND & CAST LOCK

**Brand:**
- Name: PetPawSphere
- Colors: warm paper `#f5f0e4`, green `#00843D`, red `#CE1126`, black `#0e0e0e`
- Tagline: "Where every paw finds its trusted path."
- Market: UAE-first, Arabic-English bilingual, premium but approachable

**Confirmed recurring cast already created:**
1. **Amina** — Emirati pet owner, 28, warm, tech-savvy. Hijab warm paper tone, linen outfit, modern Dubai apartment. Bilingual Arabic-English voice.
2. **Luna** — Cream Persian kitten, big green eyes, playful.

**Still create if missing:**
3. **Khalid** — Verified breeder, 35, neat beard, PetPawSphere green polo. Arabic-first authoritative voice.
4. **Simba** — Golden retriever, green-accent collar, Dubai park.

---

## PROMPT-TREE WORKFLOW

Google Flow uses a three-step tree:

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
├── Pet: @Luna (recurring)
├── Setting: modern Dubai apartment living room
├── Lighting: soft natural window light, warm paper tones
├── Camera: handheld smartphone, vertical 9:16, close-up
└── Motion: Amina smiles → taps phone → result pops up
```

---

## SCENES TO GENERATE

### breeder_trust (DONE — REVISE POSITIONING)
Status: 9:16, 8s, Omni Flash, Khalid anchors. Two variants produced, cleanest kept.

Messaging issue: the kept clip shows "PetPawSphere Dubai • Happy Homes" signage, which implies PetPawSphere owns a facility. That is incorrect.

Correct positioning: PetPawSphere is the AI app/platform. The facility belongs to Khalid, an independent licensed breeder partner. PetPawSphere provides branded merchandise (green polo, M1 materials). PetPawSphere does NOT hold breeding licenses.

Suggested edit prompt for the "Describe your edits" box:
```
Reframe the scene: this is Khalid, an independent licensed breeder partner, inside HIS OWN facility. He is wearing PetPawSphere branded merchandise. The PetPawSphere logo should appear only on the phone screen as the app, and on his polo. Remove or replace any signage that says "PetPawSphere Dubai • Happy Homes" or implies PetPawSphere owns the facility. Keep the clean modern facility, the cream Persian kitten, and the in-app green trust badge.
```

### family_moment (NEXT)
Prompt tree and file updated in /Users/taurus_ai/Documents/Nexus-Platform/google-flow-agent-prompt-family_moment.txt with the corrected positioning.

Key rules for family_moment:
- Home belongs to the family, not PetPawSphere
- PetPawSphere appears only as the AI app on the phone
- No clinic/facility signage
- Care reminder is an in-app graphic, not an official credential

### hero_match (DONE)
Status: 9:16, 8s, Amina + app UI anchors. This scene is already correct because it shows the app at home.

---

## STEP-BY-STEP WORKFLOW

### Step 0: Enter the right project
1. Ensure you are on the `effinfernandez@gmail.com` profile.
2. Open https://labs.google/fx/tools/flow
3. Select the existing project: **"PetPawSphere Launch Campaign — 2026-06"** (or whatever name appears).

### Step 1: Verify / complete recurring cast
1. Look for **"Characters"** or **"Cast"** section.
2. Confirm Amina and Luna exist.
3. If missing, add Khalid and Simba with descriptions above.
4. Anchor each new character to a reference image if available.

### Step 2: Generate breeder_trust
1. Start a new generation inside the project.
2. Attach anchors: Khalid character, MOCCAE badge reference image (optional), warm-paper/green style reference.
3. Paste prompt tree above.
4. Request **x2 variants**, 9:16, 8s, Omni Flash.
5. Wait. One may fail; that is expected and not charged.

### Step 3: Generate family_moment
1. Repeat Step 2 with the family_moment prompt tree.
2. Request x2 variants, 9:16, 10s.

### Step 4: Refine hero_match (optional)
1. Open the existing hero_match clip.
2. Use the **"Describe your edits"** box.
3. Example edit prompts:
   - "Add a bilingual text overlay: Arabic 'اكتشف توأم حيوانك الأليف' and English 'Find your pet's trusted match' in clean modern sans-serif, centered lower third, safe zone."
   - "Make the green checkmark animate larger and hold on screen 1 second longer."
   - "Apply a warm premium color grade: lift shadows to warm paper, deepen greens."

### Step 5: Export final assets
1. Download each finished clip.
2. Save to:
   `~/Downloads/petpawsphere_flow_assets/`
3. Name files:
   - `petpawsphere_hero_match_v2.mp4` (if edited)
   - `petpawsphere_breeder_trust_v1.mp4`
   - `petpawsphere_family_moment_v1.mp4`

---

## DISCOVERY RULES

Only use features you can actually see:
- If "Type Overlays" or "Video Resizer" are not visible, generate clips with text baked into the prompt tree instead.
- If a feature is grayed out, skip it.
- If the assistant invents feature names, ignore them unless you can locate them in the UI.

---

## NEXUS HANDOFF — DO THIS SAFELY

After assets are local, the user (not the browser agent) should:

1. Upload each MP4 to a public file host or Vercel asset folder.
2. POST to the Nexus pipeline:

```
POST https://nexus.taurusai.io/api/campaign-pipeline
Content-Type: application/json

{
  "action": "omni_ingest",
  "asset_url": "https://your-host/petpawsphere_breeder_trust_v1.mp4",
  "filename": "petpawsphere_breeder_trust_v1.mp4",
  "scene": "breeder_trust",
  "prompt_hash": "flow-v4-prompt-tree-anchor",
  "metadata": {
    "client": "PetPawSphere",
    "platform": "Google Flow / Gemini Omni",
    "techniques": ["prompt_tree", "persistent_characters", "multi_image_anchors"],
    "cast": ["khalid"],
    "aspect_ratio": "9:16",
    "duration_seconds": 8
  }
}
```

Do the same for `hero_match` and `family_moment`.

---

## REPORT BACK

After completion, return:
1. Which scenes generated successfully and which variants failed
2. Which characters were reused vs newly created
3. Any edits applied to hero_match
4. Local filenames and paths
5. Confirmation that the Nexus POST step is left to the user for security
