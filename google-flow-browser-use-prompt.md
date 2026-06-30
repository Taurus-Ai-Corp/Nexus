
# Browser-Use Instructions for Google Flow / Google Omni

## Goal
Use your already-open Chrome profile (effinfernandez@gmail.com) with Google Flow/Omni to generate campaign assets for PetPawSphere and export them for Nexus backend ingestion.

## Before You Start
1. Ensure you are logged into https://labs.google/fx/tools/flow with effinfernandez@gmail.com
2. Ensure Google AI Plus subscription is active
3. Have the Nexus campaign assets ready:
   - Hero image: hero_emirati_woman_golden_retriever.png
   - Breeder image: breeder_verified_persian_kitten.png
   - AI detection image: ai_breed_detection_v2.png
   - Family map image: family_uae_map.png

## Step-by-Step Flow Session

### Step 1 — Create New Project
- Click "Create with Google Flow"
- Name project: "PetPawSphere Launch Campaign — June 2026"
- Click "New Flow Session"

### Step 2 — Set Up Recurring Cast
- In the agent chat, type:
  "Create a recurring cast for this project:
  1. Amina — friendly Emirati woman, late 20s, olive-green blouse, warm smile
  2. Khalid — professional male breeder, early 40s, white kandura, trustworthy
  3. Luna — fluffy Persian kitten, blue eyes, cream fur
  4. Simba — golden retriever puppy, happy, energetic"
- Upload the hero image as Amina's visual base
- Upload breeder image as Khalid's visual base
- Upload Persian kitten image as Luna's visual base
- Upload golden retriever image as Simba's visual base (use any if not available)

### Step 3 — Generate Hero Video
- In the prompt box, type:
  "@Amina is sitting on a modern beige sofa in a Dubai apartment, holding a smartphone showing the PetPawSphere app with a golden retriever match on screen. Warm natural light, cinematic, 9:16 vertical, premium but approachable. 8 seconds."
- Click Generate
- Wait for Veo to render
- Download the best variation

### Step 4 — Generate Breeder Trust Video
- Type:
  "@Khalid stands in a clean premium pet nursery holding @Luna the Persian kitten. A glowing "MOCCAE Verified" badge appears on screen. Soft studio lighting, professional, trustworthy, 9:16 vertical, 8 seconds."
- Generate and download

### Step 5 — Generate AI Breed Detection Showcase
- Type:
  "Close-up of a smartphone screen in @Amina's hand. The phone camera points at @Luna. The screen shows AI breed detection results: 'Persian — 98% match'. Holographic UI, warm beige background, cinematic, 9:16 vertical, 8 seconds."
- Generate and download

### Step 6 — Apply Edits and Overlays
- Select the hero video
- Open the "Type Overlays" tool
- Add text: "Find your perfect match" (English) and " encuentra tu compañero perfecto" if needed — for UAE use Arabic when available
- Use "Video Resizer" to confirm 9:16
- Apply "Shader Effects" with warm filter to match brand colors #f5f0e4, #00843D, #CE1126

### Step 7 — Export All Assets
- Download each final video as MP4
- Download any generated still images as PNG
- Save to: /Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/nexus-creative-editorial/campaigns/petpawsphere-2026-06-17/google-flow-assets/

### Step 8 — Return Assets to Nexus
- Run the Nexus ingest command or upload via gws-bridge:
  gws drive files create --json '{"name": "PetPawSphere Google Flow Assets", "parents": ["DRIVE_FOLDER_ID"]}' --upload /path/to/asset
- Or place in the local campaign folder and notify the agent

## Pro Tips from Google Flow
- Use @character_name to summon recurring cast
- Use the agent to brainstorm variations: "Give me 3 different hooks for this scene"
- Create custom tools for repetitive tasks (e.g., "PetPawSphere 9:16 Ad Pack")
- Save successful prompts as templates
- Use Video Resizer before download to ensure correct aspect ratio
- Use natural language for complex edits: "Make the background warmer and add a subtle lens flare"

## What to Avoid
- Do not rely on headless automation for export — download manually or use Chrome extension automation
- Do not use generated assets in paid ads until you verify Google's commercial usage terms
- Do not exceed your Google AI Plus generation quotas

## Expected Outputs
- 3-5 vertical MP4 videos (8 sec each)
- 2-4 still image variants
- 1 custom Flow tool template for future PetPawSphere campaigns
