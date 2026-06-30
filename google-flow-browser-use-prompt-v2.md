# Google Flow / Gemini Omni — Browser Agent Instructions v2
## PetPawSphere Launch Campaign — Advanced Omni Techniques

Target profile: `effinfernandez@gmail.com` Chrome profile, already open at https://labs.google/fx/tools/flow

---

## GOOGLE FLOW UI PATTERN

Google Flow uses a **prompt tree** interface:

1. **List the Details**
   - Start by entering the main subject of your image/video.
   - Continue adding as many details and subdetails to your prompt tree as you like.

2. **AI Writes the Rest**
   - Flow translates your prompt tree into an optimized generation prompt.

3. **Make Edits**
   - After generation, edit the prompt tree.
   - Flow interprets the changes and creates a targeted edit prompt for the next output.

Use this tree structure for every asset. Build layers: subject → setting → lighting → camera → motion → brand lock.

---

## BRAND & CAST LOCK

**Brand Identity:**
- Name: PetPawSphere
- Colors: warm paper `#f5f0e4`, green `#00843D`, red `#CE1126`, black `#0e0e0e`
- Tagline: "Where every paw finds its trusted path."
- Market: UAE-first, Arabic-English bilingual, premium but approachable, PDPL-aware

**Recurring Cast (create these as persistent characters in Flow):**
1. **Amina** — Emirati pet owner, 28, warm, tech-savvy. Hijab in warm paper tone, soft natural makeup, casual linen outfit, relaxed smile, modern Dubai apartment. Voice: friendly, confident, bilingual Arabic-English.
2. **Khalid** — Verified breeder, 35, professional, trustworthy. Neat beard, polo shirt in PetPawSphere green. Voice: authoritative, calm, Arabic-first.
3. **Luna** — Cream Persian kitten, big green eyes, paw raised, playful, warm paper backdrop.
4. **Simba** — Golden retriever, happy expression, collar with subtle green accent, Dubai park.

---

## 4 ADVANCED TECHNIQUES — USE ALL OF THEM

### 1. Anchor Technique (R2V Consistency)
Expert users anchor generation with multiple reference images — up to 7 with Omni Flash.

For each PetPawSphere scene, upload these anchors before prompting:
- **Character portrait** of Amina / Khalid (or use the recurring cast)
- **Pet reference** of Luna / Simba
- **Style reference** — warm paper + green + red palette
- **Product reference** — iPhone showing PetPawSphere app UI
- **Setting reference** — modern Dubai apartment interior or clean breeder facility
- **Lighting reference** — soft natural window light
- **Composition reference** — vertical 9:16 framing

This guarantees brand consistency across every generated clip.

### 2. Precision Interpolation
Use **First Frame + Last Frame** references together to control the exact start and end of a motion transition.

PetPawSphere interpolation examples:
- **Hero match:** First frame = Amina holds phone. Last frame = phone screen shows "94% match — Persian kitten" with green check.
- **Breeder trust:** First frame = Khalid speaks to camera. Last frame = close-up of phone showing MOCCAE Verified badge.
- **Family moment:** First frame = family on sofa with Simba. Last frame = Amina smiling at care reminder on phone.

Use this for smooth, intentional motion paths that pure text-to-video may miss.

### 3. V2V Style Transfer
Take a simple real video and use **Omni Flash Video Editing** to transform its aesthetic while keeping the original movement.

PetPawSphere uses:
- Record a simple 9:16 phone video of a pet or owner in a living room/breeder facility.
- Apply Flow V2V to transform it into the PetPawSphere premium warm-paper + green branded world.
- Preserve movement, replace lighting, color grade, and add subtle logo presence.

This is the fastest path to authentic UGC-style assets with brand polish.

### 4. Systematic Storyboarding
Before generating full clips, generate a **3×3 visual grid** for each scene.

For each PetPawSphere scene:
1. Build a prompt tree for 9 key frames (3×3).
2. Lock lighting, camera angle, and cast across all 9.
3. Review the grid for visual logic and consistency.
4. Select the best 3-4 frames.
5. Use those as First/Last Frame anchors and style references for the final 8-10s video.

This ensures the final sequence feels like cohesive film, not random clips.

---

## SCENE GENERATION CHECKLIST

Generate these 3 core scenes. Each is 9:16 vertical, 8-10 seconds, 1080×1920.

### Scene 1: hero_match
**Prompt tree:**
- Main subject: @Amina holding iPhone
- Subdetail: screen displays PetPawSphere AI breed detection
- Subdetail: result card shows "94% match — Persian kitten"
- Setting: modern Dubai apartment living room, warm paper tones
- Lighting: soft natural window light, late afternoon
- Camera: handheld smartphone vertical 9:16, close-up of phone + Amina
- Motion: Amina smiles, taps phone, result pops up with green check animation

**Techniques:**
- Anchor: Amina portrait, Persian kitten reference, app UI reference
- Interpolation: First frame = phone down, Last frame = result on screen
- Style: warm paper + green brand grade

### Scene 2: breeder_trust
**Prompt tree:**
- Main subject: @Khalid in clean breeder facility
- Subdetail: gestures toward phone showing breeder profile
- Subdetail: green shield badge reads "MOCCAE Verified" in Arabic + English
- Setting: bright, hygienic pet facility with warm neutral tones
- Lighting: clean overhead + soft fill
- Camera: vertical 9:16, medium shot
- Motion: Khalid turns phone toward camera, badge animates in

**Techniques:**
- Anchor: Khalid portrait, facility reference, badge graphic reference
- Interpolation: First frame = Khalid speaking, Last frame = badge fills screen
- V2V: optionally record real breeder footage and transfer style

### Scene 3: family_moment
**Prompt tree:**
- Main subject: Emirati family on warm paper-toned sofa
- Subdetail: @Simba golden retriever rests head on child's lap
- Subdetail: @Amina smiles holding phone showing PetPawSphere care reminder
- Setting: premium Dubai family living room
- Lighting: golden-hour natural window light
- Camera: vertical 9:16, wide enough to show family + pet
- Motion: gentle, slow, emotional moment — child pets Simba, Amina looks at phone

**Techniques:**
- Anchor: family reference, Simba reference, living room reference
- Interpolation: First frame = family settling, Last frame = Amina shows reminder UI
- Storyboard: 3×3 grid of emotional beats before full clip

---

## POST-PRODUCTION IN FLOW

After generation, apply these Flow tools:

1. **Video Resizer** → force output to 9:16 vertical, 1080×1920
2. **Type Overlays** → add bilingual CTA:
   - Arabic: "اكتشف توأم حيوانك الأليف" (Discover your pet's perfect match)
   - English: "Find your pet's trusted match"
3. **Shader Effects** → warm premium grade, lift shadows toward warm paper, green pop on badges
4. **Image Editor** → export 4:5 still frames from the best video moments for Meta feed ads
5. **Storyboard Studio** → arrange final 3 scenes into a 30s launch sequence if needed

---

## EXPORT & FERRY BACK TO NEXUS

1. Download all final assets to:
   `~/Downloads/petpawsphere_flow_assets/`

2. Name files:
   - `hero_match_v1.mp4`
   - `breeder_trust_v1.mp4`
   - `family_moment_v1.mp4`
   - `hero_match_thumb_4x5.png`
   - `breeder_trust_thumb_4x5.png`

3. Upload videos to a temporary host or use a local file-server to create public URLs.

4. For each asset, POST to Nexus:
   ```
   POST https://nexus.taurusai.io/api/campaign-pipeline
   Content-Type: application/json

   {
     "action": "omni_ingest",
     "asset_url": "https://your-temporary-host/petpawsphere_hero_match_v1.mp4",
     "filename": "petpawsphere_hero_match_v1.mp4",
     "scene": "hero_match",
     "prompt_hash": "flow-v2-anchor-interpolation",
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

5. Confirm response contains:
   ```json
   { "status": "success", "asset": { "id": "omni-asset-..." } }
   ```

6. Optional — log performance feedback after deployment:
   ```
   POST https://nexus.taurusai.io/api/campaign-pipeline
   { "action": "omni_feedback", "brief_id": "...", "asset_id": "...", "platform": "meta", "spend": 100, "impressions": 10000, "clicks": 200, "conversions": 10 }
   ```

---

## SAFETY & QUALITY RULES

- Do not generate people in immodest clothing, alcohol, gambling, or political content.
- Keep Arabic text Modern Standard Arabic, safe for UAE audience.
- All text/CTA within central 84% safe zone for vertical video.
- Avoid platform UI chrome (iOS status bar, home indicator) in final exports.
- If a Flow tool fails, skip it and continue with the rest.

---

## REPORT BACK

After completion, return a summary:
1. Which Flow project/session was created
2. Which recurring cast members were set up
3. Which scenes were generated and exported
4. Which advanced techniques were used per scene
5. Nexus asset IDs returned from omni_ingest
6. Any custom tools built inside Flow
