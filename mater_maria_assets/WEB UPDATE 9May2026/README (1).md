# MATER MARIA — UI/UX UPDATE FILES

## Files Generated

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | Complete audit of all changes across 18 sections |
| `globals.css` | Global styles with CSS variables (#1e4f92, #000000, Helvetica Neue) |
| `animations.css` | Marquee & carousel keyframe animations |
| `page.tsx` | **Updated Homepage** — all structural changes applied |
| `about_page.tsx` | **New About Page** — governance moved here |

## How To Use

### 1. Backup your current files
```bash
cp app/page.tsx app/page.tsx.backup
cp app/globals.css app/globals.css.backup
```

### 2. Replace globals.css
Copy the contents of `globals.css` into your `app/globals.css` (or merge with existing Tailwind directives).

### 3. Add animations
Copy `animations.css` contents into `app/globals.css` or import as a separate file.

### 4. Replace Homepage
Rename `page.tsx` → `app/page.tsx`

### 5. Create About Page
Create folder `app/about/` and place `about_page.tsx` as `app/about/page.tsx`

### 6. Image Assets
Place all images in `/public/images/` with **exact filenames** (case-sensitive):

**Home Banners:**
- Home_Banner_01.jpg
- Home_Banner_02.png
- Home_Banner_03.png
- Home_Banner_04.jpg
- Home_Banner_05.jpg
- Home_Banner_07.jpg
- Home_Banner_08.jpg

**Vision/Mission:**
- Family-mmh-mission02.png
- mission-image.png

**Amenities A001:**
- mater-maria-sunset.png
- mater-maria-sunset-001.png
- PersonalisedHealthcare.jpg
- MMH-gate-004.png
- luxury-interior-005.png
- Ayurveda-006.png
- mmh-003.jpeg

**Amenities A002:**
- signature-living001.png
- Medical-care002.png
- smart-home.jpg
- Buggie.png
- Medical-Campus005.jpeg
- hospitality-006.jpg
- Health-Monitoring.png

**Amenities A003 (4 only):**
- MMT-Hospital-001.png
- Family-time-002.png
- Reception-003.png
- Hospitality-004.png

**Unused (do not copy):**
- Structural-Stewardship-005.png
- Ayurveda-006(1).png
- Solar-Garden-007.png
- Reception-002.png

### 7. TODOs in Code (marked clearly)
These sections need content from your Google Docs/Sheets:
- Residence types list → `MMH-08.04.2026`
- Strategic Location content → `MMH WEBSITE Content 09May2026`
- About page content → `MMH WEBSITE Content 09May2026`
- Investment tiers → `MMH-08.04.2026`
- Core Investors photos → attached images

### 8. Run locally
```bash
npm run dev
```

### 9. Deploy
```bash
vercel --prod
```

## Sections Removed from Homepage
- Section 09: Blueprints
- Section 10: Sustainability
- Section 12: Construction Timeline
- Section 14: Governance (moved to /about)
- Section 15: FAQ
- Section 16: "They Gave You Everything..."

## Sections Restructured
- Section 02: Moved to before Get In Touch
- Section 07: "Estate" → "World-Class Amenities" + "Mater Maria Ecosystem"
- Section 08: Removed villa blocks, added "Residence Types"
- Section 13: New heading "Investment Plan | Choose Your Tier"
- Section 17: Simplified, removed contact details, added BG image
- Section 18: Added Country Coordinators grid

## Color Reference
| Element | Hex |
|---------|-----|
| Nav Background | #000000 |
| Primary Blue (hover) | #1e4f92 |
| Marquee Background | #1e4f92 |
| Marquee Text | #ffffff |
| Global Font | Helvetica Neue |
