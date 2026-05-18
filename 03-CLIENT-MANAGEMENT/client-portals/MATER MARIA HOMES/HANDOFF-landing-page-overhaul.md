# Mater Maria Homes — Landing Page Overhaul Handoff

> **Created**: 2026-05-16 | **Source**: `inputs/mater-maria-edits.xlsx` + stakeholder brief | **Target**: `public/index-landing.html` (1952 lines)
> **Deploy URL**: `https://mater-maria-fbh52r370-taurus-s-projects.vercel.app/index-landing.html`
> **Custom Domain**: `www.matermariahomes.com` (Squarespace, GWS email configured)

---

## Sheet-to-Question Mapping

| Question | Answer |
|----------|--------|
| Which sheet lists the website's color codes? | **EFFIN&PRAVEEN** — `#000000` (nav black), `#1e4f92` (hover blue) |
| Where are the homepage structural edits outlined? | **RAJEEV COMMENTS** — 18 sections, row-by-row instructions |
| Which sheet contains the image file asset directory? | **Images proposed** — 33 rows, categorized by building block + stage |
| Where are interior page edits? | **PAGE EDITS** — Estate, Services/Facilities, button additions |
| Where are design constraints? | **Notes** — Traditional/Mediterranean fusion, cost-effective, minimize glass |

## XLSX Sheets Summary (5 sheets, 1073 total rows)

| Sheet | Rows | Cols | Purpose |
|-------|------|------|---------|
| `RAJEEV COMMENTS` | 1005 | 27 | Homepage section-by-section edit instructions (PRIMARY) |
| `PAGE EDITS` | 1001 | 28 | Interior page changes (Estate, Services, buttons) |
| `Images proposed` | 34 | 6 | Asset pipeline — image categories, filenames, stages |
| `Notes` | 21 | 3 | Design principles — fusion style, cost constraints, furniture prefs |
| `EFFIN&PRAVEEN` | 12 | 26 | Color codes, UI component styling directives |

---

## Phase 0: Global Theme Updates

**Source**: EFFIN&PRAVEEN + RAJEEV COMMENTS Home Section 05

### CSS Variables to Add/Modify in `:root` (line ~126)

```css
--nav-black: #000000;          /* Top Navigation background */
--hover-blue: #1e4f92;         /* Invest button hover, section hover, ticker BG */
--font-helv: 'Helvetica Neue', Helvetica, Arial, sans-serif;  /* Ticker font */
```

### Global Changes
- [ ] Navbar background → `#000000` (solid state already exists, ensure transparent state also dark)
- [ ] All button hover states → `#1e4f92` (currently `--accent-gold`)
- [ ] Ticker/animation bar BG → `#1e4f92`, font → Helvetica Neue, text color → white

---

## Phase 1: Homepage Structural Overhaul (RAJEEV COMMENTS)

### New Page Order (after edits)

| Order | Section | Source | Status |
|-------|---------|--------|--------|
| 1 | Hero (Section 01) | Modified | Keep, edit buttons + copy |
| 2 | Vision & Mission (Section 04) | Moved UP | Was Section 04, now Section 02 |
| 3 | Running Ticker (Section 05) | Modified | Edit colors + content |
| 4 | Stats Bar (Section 06) | Modified | Edit content, black BG |
| 5 | Amenities/Ecosystem (Section 07) | Modified | Rename, restructure |
| 6 | Residence Types (Section 08) | Modified | Update per sheet |
| 7 | Strategic Location (Section 11) | Modified | Keep heading, update content |
| 8 | Investment Tiers (Section 13) | Modified | Update per sheet |
| 9 | "Where Every Life Is Honoured" (Section 02) | **MOVED** | Was Section 02, now before Get In Touch |
| 10 | Get In Touch (Section 17) | Modified | BG image, edit heading |
| 11 | Country Coordinators (NEW) | From sheet | Add to footer area |

### Sections to REMOVE Entirely

| Section | Current Name | Line Range (approx) |
|---------|-------------|---------------------|
| 03 | "Our Story" | Remove heading + "A community where..." paragraph |
| 09 | Blueprints / Floor Plans | Remove full section |
| 10 | Sustainability Circle | Remove full section |
| 12 | Construction Timeline | Remove full section |
| 14 | Governance | Remove from home (move to About page) |
| 15 | FAQ Section | Remove full section |
| 16 | "They Gave You Everything..." | Remove full section |

---

## Phase 2: Section-by-Section Edit Specifications

### Section 01 — Hero (lines ~200-400)

| Element | Current | New | Action |
|---------|---------|-----|--------|
| Top-right button | Existing | **EXPLORE NOW** | Change text, hover `#1e4f92` |
| Bottom button 1 | Existing | **ENQUIRE NOW** | Change text, hover `#1e4f92` |
| Bottom button 2 | Existing | **INVEST NOW** | Add new button, hover `#1e4f92` |
| Background color | Current | `#1e4f92` | Change BG color |
| Heading | Current | **Living Refined** | Update copy |
| Subheading | Current | **Precision Wellness Living** | Update copy |

### Section 02 — "Where Every Life Is Honoured..." (lines ~400-500)

| Action | Detail |
|--------|--------|
| **MOVE** | Relocate entire section to immediately before "Get In Touch" (was Section 02, now Section 09 in new order) |
| Background | Change to `#1e4f92` |

### Section 03 — "Our Story" (lines ~500-600)

| Element | Action |
|---------|--------|
| "Our Story" heading | **REMOVE** |
| "Nestled within the serene..." paragraph | **KEEP** |
| "A community where residents..." paragraph | **REMOVE** |
| "Discover More" button | **REMOVE** |

### Section 04 — Vision & Mission (lines ~600-700)

| Action | Detail |
|--------|--------|
| **MOVE UP** | Now Section 02 in new order (right after Hero) |
| Vision image | **CHANGE** — use `Family-mmh-mission02.png` from assets |
| Mission image | **CHANGE** — use `mission-image.png` from assets |

### Section 05 — Running Animation Ticker (lines ~700-800)

| Element | Current | New |
|---------|---------|-----|
| Background color | Current | `#1e4f92` |
| Font color | Current | White `#FFFFFF` |
| Font family | Current | **Helvetica Neue** |
| "100% Solar Net-Zero" | Present | **REMOVE** |
| "ISO 9001 Certified" | Present | **REMOVE** |
| "Board-Supervised Governance" | Present | **REMOVE** |
| "RERA Compliant" | Present | **REMOVE** |
| "24/7 On-Campus Medical" | Present | **REMOVE** |
| "24/7 Medical Facilities" | — | **ADD** |
| "AI-Powered Smart Homes" | Present | **KEEP** |
| "Diocese of Kanjirappally" | Present | **KEEP** |

### Section 06 — Stats Bar (lines ~800-900)

| Element | Current | New |
|---------|---------|-----|
| Background | Current | **Black `#000000`** |
| Content | "90+ Premium Residences \| 48 World-Class Facilities" | **UPDATE** per Google Sheet MMH-08.04.2026 |
| Content 2 | "8+ Acres of Greenery \| 7+ Nearby Hospitals" | **UPDATE** per Google Sheet |

### Section 07 — Amenities/Ecosystem (lines ~900-1100)

| Element | Action |
|---------|--------|
| "Estate" subheading | **REMOVE** |
| "A Glimpse of Living Refined" | **REMOVE** |
| New heading | **"World-Class Amenities"** |
| Background | **Black `#000000`** |
| "Core Values / The Mater Maria Ecosystem" copy | **REMOVE ALL** |
| New heading for ecosystem | **"Mater Maria Ecosystem"** |
| Image blocks | Keep only **4 sections** (was 7) |
| Carousel animation | Update per Images proposed sheet |

### Section 08 — Residence Types (lines ~1100-1200)

| Element | Action |
|---------|--------|
| "Launching Soon · Phase 1 / Six Residence Types..." | **REMOVE FULL** |
| Residence types list | **UPDATE** per Google Sheet MMH-08.04.2026 |
| "Independent Villa 2026 3 BHK" | **REMOVE** |
| "Deluxe Villa 2028 3 BHK" | **REMOVE** |
| New residence types | Add per sheet data |

### Section 09 — Blueprints (REMOVE)
**Action**: Delete entire section

### Section 10 — Sustainability (REMOVE)
**Action**: Delete entire section

### Section 11 — Strategic Location (lines ~1200-1300)

| Element | Action |
|---------|--------|
| Small heading | **REMOVE** |
| "Strategic Location \| Seamless Accessibility." | **KEEP** as main heading |
| Content | **UPDATE** per Google Doc "MMH WEBSITE Content 09May2026" |

### Section 12 — Construction Timeline (REMOVE)
**Action**: Delete entire section

### Section 13 — Investment Tiers (lines ~1300-1400)

| Element | Action |
|---------|--------|
| "Investment Opportunity" | **REMOVE** |
| "Choose Your Tier" | **REMOVE** |
| "Board-supervised governance..." | **REMOVE** |
| New heading | **"Investment Plan \| Choose Your Tier"** |
| Tier cards (Platinum/Gold/Silver) | **UPDATE** per Google Sheet MMH-08.04.2026 |

### Section 14 — Governance (REMOVE from home)
**Action**: Remove from homepage. Move to About Us internal page (Row 8 of sheet).

### Section 15 — FAQ (REMOVE)
**Action**: Delete entire section

### Section 16 — "They Gave You Everything..." (REMOVE)
**Action**: Delete entire section

### Section 17 — Get In Touch (lines ~1270-1320)

| Element | Action |
|---------|--------|
| "Get in Touch" small heading | **REMOVE** |
| Main heading | Change to **"Get In Touch"** |
| "Whether you're securing a dignified home..." | **KEEP** |
| Background | **ADD BG IMAGE** |
| "Diocese of Kanjirappally" badge | **REMOVE** |
| "RERA Compliant ISO 9001" badge | **REMOVE** |
| Phone +91 96564 63073 | **REMOVE** |
| Email Info@matermariahomes.com | **REMOVE** |
| Contact form | **KEEP** (fix Web3Forms key separately) |

### Section 18 — Country Coordinators (NEW)

**Source**: Country Contacts tab (from stakeholder brief — not in XLSX, provided separately)

Add to footer area with coordinator data:
- Australia, Canada, Italy, UAE, UK, US, etc.
- Each with name, country code, phone number

---

## Phase 3: Navbar Update

| Element | Current | New |
|---------|---------|-----|
| Background | Transparent → white on scroll | **Black `#000000`** |
| Menu items | Current set | **About, Features, Residences, Invest, Contact** |
| "About" link | — | **NEW** — links to internal About page |

---

## Phase 4: About Page (NEW Internal Page)

**Source**: About Sec 01 rows from stakeholder brief

Create `public/about.html` (or Next.js route if migrating):

| Row | Content | Action |
|-----|---------|--------|
| 1 | About Details | **ADD** |
| 2 | About Content | **Refer Google Doc** "MMH WEBSITE Content 09May2026" |
| 3 | Governance | **ADD** (moved from home Section 14) |
| 4-7 | Board-Supervised, ISO 9001, Excellence, RERA | **REMOVE** |
| 8 | Spiritual & Pastoral Leadership | **KEEP** |
| 9 | Executive Board of Directors | **KEEP** |
| 10 | Core Investors | **ADD** with photos (check Images tab) |
| 11 | ISO 9001 certified... | **REMOVE** (duplicate) |

---

## Phase 5: Image Asset Pipeline

**Source**: Images proposed sheet (33 rows) + local assets

### Key Image Mappings

| Category | Image Reference | Stage | Local Path |
|----------|----------------|-------|------------|
| Administrative | 4 storied building outside | 2nd | `assets-2025/images/` |
| Reception | MMH Recep 03 | 1st | `assets-2025/images/` |
| Medical | MMH-N-0012 | 1st | `assets-2025/images/estate/medical.jpg` |
| Chapel | Outside + Interior | 2nd/1st | `assets-2025/images/estate/chapel.jpg` |
| Club House | 3BHK luxury MMH 01 | 1st | `assets-2025/images/` |
| Ayurveda | Dhara thoni massage | 1st | `assets-2025/images/` |
| Balcony | A004 | 1st | `assets-2025/images/` |
| Gate | Main Gate reminder | — | `assets-2025/images/` |

### Existing Asset Directories
- `public/assets-2025/images/` — hero slides, renders, estate images
- `public/assets-2025/images/estate/` — chapel, medical, dining, villas, yoga, orchard
- `public/images/amenities/` — webp amenity images
- `public/images/gallery/` — location gallery images
- `public/images/tour/` — aerial and ground tour images
- `public/fonts/` — Garabosse font files

### Images NOT Relevant
- Swimming Pool / Infinite pool — marked "Not Relevant" in sheet

---

## Phase 6: Design Constraints (Notes sheet)

| Constraint | Detail |
|------------|--------|
| Style | Fusion of Traditional Mediterranean |
| Cost | Cost-effective throughout |
| Glass walls | **Minimize** — high cost, high temperature, expensive maintenance |
| Outside moulding | **Minimize** — highly expensive masonry & painting |
| Furniture | **Wooden type preferred**, less upholstery |
| Upholstery | High maintenance, replacement needed every 7-8 years |
| Balcony | More wood, less upholstery |

---

## Phase 7: PAGE EDITS (Interior Pages)

| Page | Edit | Detail |
|------|------|--------|
| Investor & Residence | Image update | `MMH-Change001.png` |
| The Estate | Remove subheading | Remove "Estate", change "A Glimpse of Living Refined" → "Amenities" |
| Services & Facilities | Image swap | Medical, Recreational, Residential Unit, Spiritual, General, Bed Room, Sustainable |
| Global | Remove heading | "Launching Soon" heading to be removed |
| Global | Add button | "Refer a friend" button |
| Section 6 | Remove | "3 BHK Deluxe Villa" to be removed |
| Global | Highlight | Enable and highlight Amenities |

---

## Phase 8: Critical Launch Fixes (Phase 1 only)

| # | Issue | Fix |
|---|-------|-----|
| 1 | Web3Forms access_key sends to wrong email | Replace `a8414144-...` with key tied to `Info@matermariahomes.com` |
| 2 | OG URLs point to old Vercel deployment | Update to `fbh52r370` URL |
| 3 | Form success says "24 hours" | Change to "2 hours" per spec |
| 4 | Governance footer link broken (`#`) | Link to new About page |
| 5 | No analytics | Wire PostHog if key available |

---

## Phase 9: Phase 2 Plumbing Integration (Hybrid Option C)

### Current State
- `src/lib/lead-schema.ts` — Zod schema ✅ committed
- `src/lib/email-template.ts` — HTML email builder ✅ committed
- `src/lib/whatsapp-payload.ts` — Meta API payload ✅ committed
- `resend` SDK — installed in `package.json` ✅ committed

### Integration Path
1. Landing page form currently POSTs to Web3Forms (static HTML)
2. When `/invest` page ships (Phase 2), form can ALSO POST to `/api/lead`
3. Dual-channel: Web3Forms email (immediate) + Resend+WhatsApp (when API routes ready)
4. No changes needed to landing page form for Phase 1 — just fix the Web3Forms key

---

## Execution Order

1. **Phase 0** — Global CSS variables (5 min)
2. **Phase 1** — Remove 7 sections, reorder remaining (30 min)
3. **Phase 2** — Section-by-section edits (2 hours)
4. **Phase 3** — Navbar update (10 min)
5. **Phase 4** — About page creation (1 hour)
6. **Phase 5** — Image asset swaps (1 hour)
7. **Phase 6** — Design constraint verification (ongoing)
8. **Phase 7** — Interior page edits (30 min)
9. **Phase 8** — Critical launch fixes (15 min)
10. **Build + deploy** — `npm run build` + push to Vercel

---

## Agentic Verification Checklist

After each phase, verify:
- [ ] `npm run build` succeeds (no errors)
- [ ] Local dev server renders correctly at `localhost:3000/index-landing.html`
- [ ] Mobile responsive (375px viewport)
- [ ] All removed sections are gone (no orphaned HTML)
- [ ] All new sections render with correct content
- [ ] Color codes match: `#000000` nav, `#1e4f92` hover/blue
- [ ] Font is Helvetica Neue on ticker
- [ ] Navigation links work (About, Features, Residences, Invest, Contact)
- [ ] Form submits successfully (Web3Forms)
- [ ] WhatsApp floating button works
- [ ] Country coordinators display in footer
