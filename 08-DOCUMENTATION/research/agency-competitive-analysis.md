# Competitive Design Analysis — Top-Tier Agency & Studio Marketing Sites

**Prepared for:** Nexus Creative marketing site redesign (`nexus.taurusai.io`)
**Date of research:** 2026-08-24 (all sites loaded and read on this date unless noted)
**Method:** Each site was loaded in a real browser engine. Two capture paths were used:
headless Chromium (viewport 1440px wide) for archival screenshots and rendered-DOM extraction
of nav text, heading order, media element counts and footer text; and the browser-use MCP
driver (real windowed Chrome, WebGL enabled) for sites that refuse or fail under headless.
Nothing in this document is written from memory — where a site could not be fully loaded,
that is stated explicitly and marked **UNVERIFIED**.

**Screenshots:** `08-DOCUMENTATION/research/screenshots/`

---

## 1. Coverage and honesty notes

**16 sites loaded successfully** (target was 8–12; the extra were kept because several
returned partial data).

| Site | Load result |
|---|---|
| Pentagram | Full — screenshot + rendered DOM |
| R/GA | Full — screenshot + rendered DOM |
| AREA 17 | Full — screenshot + rendered DOM + full-flow capture |
| Instrument | Full — screenshot + rendered DOM + full-flow capture |
| Work & Co | Full — screenshot + rendered DOM |
| COLLINS | Full — screenshot + rendered DOM + full-flow capture |
| Wolff Olins | Full — screenshot + rendered DOM + full-flow capture |
| BASIC/DEPT | Full — screenshot + rendered DOM |
| Huge | Full — screenshot + rendered DOM |
| DEPT | Full — screenshot + rendered DOM |
| AKQA | Full — screenshot + rendered DOM |
| Kurppa Hosk | Full — screenshot + rendered DOM |
| Locomotive | Rendered DOM only (headless screenshot timed out) |
| Hello Monday | Rendered DOM only (headless screenshot returned blank) |
| Koto | Partial — real-browser screenshots (hero + section 2); DOM dump timed out twice |
| Active Theory | Partial — real-browser screenshot of hero only |
| Resn | Partial — real-browser screenshot of WebGL intro only |
| DesignStudio | **No longer an agency site** — see below |

### Things that were NOT what was expected

- **DesignStudio no longer exists as a site.** `https://design.studio/` (read 2026-08-24)
  serves only a full-screen rebrand splash: the wordmark "DesignStudio", the line
  "DESIGN WILL BE COMMODITISED. CREATIVITY WILL ENDURE.", "IS NOW", an oversized italic
  serif "FURTHER", and a single outlined button "VISIT FURTHER". The button's `href` is
  `https://www.further.group/`. There is no work, no nav, no footer. It is excluded from the
  structural comparison. (Note: `further.co` is an unrelated Los Angeles agency, not this.)
- **Active Theory blocks headless browsers outright** — headless Chromium receives a page
  titled "Not Supported" with the single `h1` "Your browser is not supported". Only the
  windowed browser rendered the real site. Its below-fold structure is **UNVERIFIED**.
- **Resn** (`resn.co.nz`) renders a gated WebGL intro sequence ("Resn · Creative Studio /
  Est. 2004") that had not handed off to page content within the observation window. Its
  nav, section order and footer are **UNVERIFIED**.
- **Koto** — `koto.studio` 301-redirects to `koto.com`. Two rendered-DOM dumps timed out at
  180s; hero and second section were read from the live browser instead. Sections below the
  second are **UNVERIFIED**.
- **Locomotive** and **Hello Monday** produced clean DOM extractions but no usable
  screenshot; their visual treatment is described only where the DOM is unambiguous.
- Bruce Mau, Antinomy and "Basic" as a standalone brand were not analysed. BASIC is now
  **BASIC/DEPT®** (a DEPT company) — verified from its own footer and title tag.

---

## 2. Per-site findings

### Pentagram — `https://www.pentagram.com/` (read 2026-08-24)
- **Nav:** Fixed white bar, always visible. Logo left. 5 text items right — Work, About,
  News, Contact, Archive — plus a search icon. **No CTA button of any kind.**
- **Hero:** No headline. No value proposition. A full-bleed rotating case-study carousel
  (12 dot indicators) with the project name and one descriptive line bottom-left
  ("ICD Beauty — Brand identity and packaging for the Seoul-based beauty brand…").
  A small centered pill control reads "We design [Everything ▾] for [Everyone ▾]" —
  a filter, not a headline.
- **Media:** Extremely heavy. Rendered DOM contains 186 `<img>`, 202 `<picture>`, 767
  `<source>` and 23 `<video>` elements. Real photography and case imagery throughout.
- **Section order:** carousel → editorial feature ("The Secret Life of Things") → discipline
  and sector filters → repeating "N latest [Discipline] projects" grids (Brand Identity,
  Motion Graphics & Film, …) → footer.
- **Work presentation:** Dense multi-row grids, dozens of projects visible, organised by
  discipline rather than curated to a top five.
- **Conversion asks:** Essentially none in the body. Contact appears in the nav and in the
  footer as four office emails.
- **Footer:** Very heavy. Latest news items with dates, four offices with direct new-business
  emails (london@, newyork@, austin@, info@pentagram.de), open positions with job titles,
  newsletter signup with success/error states, social links.

### R/GA — `https://rga.com/` (read 2026-08-24)
- **Nav:** Fixed. Red/black R/GA mark left. 6 items right — Work, Services, About Us,
  Careers, News, Contact. No CTA button.
- **Hero:** Black background. Giant white uppercase **sans** headline over 4 lines,
  9 words: "AN INDEPENDENT CREATIVE INNOVATION COMPANY FOR THE INTELLIGENCE AGE". Cap height
  is roughly 10% of viewport height per line; the block fills over half the fold. A small
  right-aligned subhead sits well below: "We design intelligent brand systems that help
  businesses get ahead." No hero imagery above the fold.
- **Media:** 11 `<video>`, 8 `<img>` — video-led case tiles, not stock photography.
- **Section order:** hero statement → WORK (Google Health, Nike All Conditions World, TADA,
  Moncler) → WHAT WE DO → NEWS → footer.
- **Conversion asks:** Nav Contact only; no in-body CTA blocks observed.
- **Footer:** Light. Nine country/region codes (AR AU BR DE ID JP SG UK US), three socials,
  Our companies, legal links, Press & Media, Scam Alert.

### AREA 17 — `https://area17.com/` (read 2026-08-24)
- **Nav:** Fixed, minimal. "A/" mark left. 5 items right — Clients, Capabilities, Culture,
  Contact, Latest. No CTA button.
- **Hero:** White. Large **sans** `h1`, 3 lines, 16 words: "We partner with the world's most
  influential organizations to realize their vision and achieve their greatest impact."
  Set below a full viewport-height of whitespace; a full-bleed photograph begins immediately
  under it, cropped by the fold.
- **Media:** 77 `<img>`, 4 `<video>`. Real photography.
- **Section order:** hero statement → capability statement ("We're consultants and
  craftspeople…") → Industries we serve → Latest updates (5 articles) → Newsletter sign-up →
  **"Let's start talking"** → footer.
- **Conversion asks:** Two, both late — a newsletter block and a dedicated "Let's start
  talking / Get in touch" block immediately above the footer.
- **Footer:** Medium. "Let's explore how we can help you achieve your goals" + Get in touch,
  newsletter, LinkedIn, Instagram, DEI, Privacy, © AREA 17, "Version française".

### Instrument — `https://www.instrument.com/` (read 2026-08-24) — **most directly relevant**
- **Nav:** **Floating pill nav.** Three individual pills left (WORK, SERVICES, ABOUT), three
  right (CAREERS, LATEST, CONTACT), and a centered running announcement between them:
  "MEET PLAYSPACE: INSTRUMENT'S ARCHIVE OF CREATIVE EXPERIMENTS. PLAY NOW →". On the live
  site the centered slot also carries "CAMPAIGN US WINNERS: DESIGN STUDIO AGENCY OF THE YEAR
  2026! SEE MORE →". The CTA is the *rightmost pill*, "CONTACT".
- **Hero:** Colossal black wordmark "INSTRUMENT" set edge-to-edge (letterforms ~13% of
  viewport height), then a full-bleed lime-green video panel with a play button and a
  marquee strip: "New York · Remote · Making the Complex Simple · Since 2005 · Portland".
  No sentence-form headline in the hero.
- **Typography mix — important:** the hero wordmark is a heavy grotesque, but the positioning
  statement directly beneath it is set in an **editorial serif**: "We're a digital-first
  design agency where creativity meets technology." followed by a black pill CTA
  "View All Work →". Serif reappears at scale later as the oversized word "Shape" in the
  Our Purpose section.
- **Media:** 26 `<img>`, 20 `<picture>`, 20 `<source>`. Real product/campaign photography
  (Notion billboard, ŌURA on sand, Feeld on red).
- **Section order (verified visually, top to bottom):**
  1. Pill nav + announcement
  2. Wordmark + video reel hero
  3. **Serif positioning statement + "View All Work" CTA**
  4. **Recent Work** — 4-up grid with filter pills (ALL / BRAND / MARKETING / PRODUCT)
  5. **Client Roster** — logo strip (Nordstrom, Google, Salesforce, ServiceNow, Levi's, Marriott)
  6. **Services** — split text/photo, CTA "See our offerings"
  7. **Recent Recognition** — award logos (The Drum, Awwwards, Webby, Fast Company, Shorty, Clio)
  8. **Our Purpose** — "Shape a better future." + oversized serif "Shape"
  9. News & Noteworthy
  10. Newsletter — "Liner Notes"
  11. Get in touch
  12. Footer
- **Conversion asks:** Four — nav CONTACT pill, "View All Work", "See our offerings",
  and the closing "Get in touch / Start a Project".
- **Footer:** Heavy. Start a Project, Join the Team, Press & Media, Drop Us a Note, full
  sitemap, socials, legal, Supply Chain Statement.

### Work & Co — `https://work.co/` (read 2026-08-24)
- **Nav:** **None.** No conventional header nav exists. The logo lockup reads
  "WORK &CO / Part of Accenture Song". Navigation is deferred to an **"Index"** section near
  the bottom (Select Clients, Practice Areas, Outcomes, Process, Leadership, News & Insights,
  Careers) plus a link labelled "Visit main navigation page" (`/grid/`).
- **Hero:** Left column holds the logo; right column holds a **sans** `h1` on 2 lines,
  8 words: "We solve complex problems through design & technology". Directly beneath it, a
  **serif** press pull-quote — "Entrusted with digital product innovation by companies like
  Apple, Google, Nike." — attributed "— Fast Company", then a red "Learn more" text link.
  **Third-party proof is inside the hero itself.**
- **Media:** Light — 6 `<img>`, 4 `<picture>`, 12 `<source>`.
- **Section order:** Introduction (hero + press quote) → Latest (JW Anderson's Digital
  Redesign) → Updates (4 items) → Index → Stay Informed → footer.
- **Conversion asks:** Soft. No "book a call" button; "Learn more" and "See the work" links.
- **Footer:** Effectively replaced by the Index + Stay Informed blocks. Office list is under
  Careers (Brooklyn, Portland, São Paulo, Rio, Belgrade, Copenhagen, Atlanta, Los Angeles).

### COLLINS — `https://www.wearecollins.com/` (read 2026-08-24) — **closest to our good page**
- **Nav:** Almost nothing. Small "COLLINS" wordmark top-left, a hamburger icon top-right.
  Zero visible items. The menu holds only 3: Case Studies, Programs, Arts & Culture.
- **Hero:** Off-white. A single centered **serif** line — **"Rewrite your worth."** — three
  words, and nothing else. It floats in the vertical middle of a very tall first screen with
  enormous whitespace above and below.
- **Proof immediately after the hero:** a quiet centered strip reading "8x Agency of the Year"
  with eight laurel-wreath award marks — AdAge 2026, 2025, 2024, 2023, D&AD 2021, AdAge 2021,
  2020, 2019.
- **Media:** Only 14 `<img>`, 0 `<video>`. But the images are huge, full-bleed, and
  art-directed (the first is a saturated print-object photograph).
- **Section order:** serif hero → award proof strip → full-bleed case imagery →
  Programs → Case Studies → Arts & Culture → footer.
- **Conversion asks:** One, in the footer: "Work with us" + `info@wearecollins.com` with an
  "Email copied" affordance.
- **Footer:** Light-medium. Case Studies, Programs, Arts & Culture, Work with us, Team,
  Careers, Press, Keep up to date, X, LinkedIn, Instagram.

### Wolff Olins — `https://www.wolffolins.com/` (read 2026-08-24)
- **Nav:** Thin fixed white bar. Wordmark left, 4 items right — Work, About, News, Contact —
  plus a search icon. No CTA button.
- **Hero:** **No headline at all.** A full-bleed art-directed photograph of a case study
  (Lloyds — a café table, phone showing the new identity, hard sunlight, shadow typography)
  with only the client name "Lloyds" set small bottom-left. The work *is* the hero.
- **Media:** 23 `<img>`, 5 `<video>`. Photography-first.
- **Section order:** full-bleed work hero (rotating through Blank Street, Sandals & Beaches,
  Benefit, Ubisoft Anno, Lloyds, Decathlon, Bite Back, Patreon, LG, NY Botanical Garden,
  Bergdorf Goodman, The Met) → **Our Ambition** → **Selected Work** (5 curated cases) →
  **Featured News** (8 items) → footer.
- **Conversion asks:** One — "Talk to us or ask us anything. / Contact Us" directly above
  the footer.
- **Footer:** Light. Back to top, Contact Us, Cookie Policy, Privacy Notice, LinkedIn, X,
  Instagram, YouTube, Archive.

### BASIC/DEPT® — `https://basicagency.com/` (read 2026-08-24)
- **Nav:** Fixed over the video. Wordmark "BASIC/DEPT®" left, 6 items centered — WORK, ABOUT,
  NEWS, THINKING, CAREERS, CONTACT — and a "…" overflow menu right (Initiatives). No CTA button.
- **Hero:** Full-bleed cinematic video (a runner on an LA street, golden hour, shallow depth
  of field). **No headline.** The only overlay is a white circular button — "WATCH REEL" —
  and a small mark "BASIC/DEPT® 2010–∞".
- **Media:** 23 `<img>`, 23 `<picture>`, 2 `<video>`, 60 `<svg>`.
- **Section order:** video reel hero → positioning statement (`h3`: "BASIC/DEPT® is a global
  branding and digital design agency building products, services, and eCommerce experiences
  that turn cultural values into company value.") → **Featured Engagements** →
  **Featured News** → footer.
- **Conversion asks:** One — `biz@basicagency.com` in the footer.
- **Footer:** Heavy. New-business email, newsletter, 4 socials, Initiatives (Applied,
  Brandbeats, Moves, B®/Good), **8 offices** (San Diego, New York, Bay Area, St. Louis,
  Amsterdam, London, Berlin, Argentina), tagline "Easy to understand, impossible to ignore.™"

### Koto — `https://koto.com/` (read 2026-08-24; `koto.studio` 301s here)
- **Nav:** Fixed bar at top of page. Yellow Koto mark left, 6 items — WORK, ABOUT, SERVICES,
  LATEST, CAREERS, CONTACT — and, at far right, a **live UTC clock** ("22:06 UTC-4") plus a
  grid icon. **On scroll the entire nav collapses into a compact dark floating pill**
  showing just the mark and the current section ("KOTO | HOME").
- **Hero:** Full-bleed autoplaying video (with a pause control bottom-right) and a two-line
  **sans** headline bottom-left, 5 words: "We're Koto" / "The Creative Company", the second
  line in grey.
- **Section 2:** A large two-tone sans manifesto paragraph where the emphasis is carried by
  white vs grey text rather than weight: "We make ambitious ideas for ambitious […] offices,
  one studio, united by optimism, collaboration, and craft. Find us in Los Angeles, New York,
  London, Berlin and Sydney." followed by full-bleed case video (Instagram).
- **Page height:** 6100px at 1512px wide.
- Sections below this point, CTA count and footer are **UNVERIFIED** (DOM dump timed out).

### Huge — `https://www.hugeinc.com/` (read 2026-08-24)
- **Nav:** Two tiles top-left — magenta "Huge" and black "Menu" — and a **black pill CTA
  top-right reading "Let's talk ↗"**. This is one of only three sites in the set with an
  explicit button CTA in the header.
- **Hero:** A WebGL/3D rotating cube whose faces are team photographs. No headline above the
  fold.
- **Media:** 31 `<img>`, 8 `<picture>`, 2 `<canvas>`, 86 `<svg>`.
- **Section order:** 3D hero → **Who we are** ("Future-defining firsts.") → **What we do**
  (6 numbered services: Brand strategy & design 01 … AI activation 06) → **We believe**
  (Powered by LIVE, "And industry-leading alliances.") → **Our work** (Google, NBCU,
  McDonald's, UNC Health, Android, LPGA, Hublot, Planet Fitness) → **an inline full case
  study** for Google with Services / Overview / **Results (1B, 100+, 12Y)** / Key moments →
  "Your new ambition starts here." → Careers → Ideas (5 articles) → newsletter → footer.
- **Notable:** Huge is the only site in the set that puts a **quantified results block**
  (1B / 100+ / 12Y) on the homepage.
- **Conversion asks:** Four+ — header "Let's talk", a "Chat With Us" panel with a real
  new-business form (First/Last name, Email, Company, "Tell us a little bit more"),
  "Your new ambition starts here.", and a footer email capture.
- **Footer:** Very heavy. Four routed mailboxes (business@, jobs@, press@, hello@), email
  capture, Channels, Legalities, Contact, and three office addresses (New York, Chicago, London).

### DEPT® — `https://www.deptagency.com/` (read 2026-08-24)
- **Nav:** Fixed. 4 items left with a dropdown — What we do ▾, Work, Insights, Culture —
  centered DEPT® asterisk logo, and top-right a search icon plus a **grey pill CTA "CONTACT"**.
- **Hero:** Giant uppercase **sans** `h1` "THE GROWTH INVENTION COMPANY" in two-tone
  (black + rust), centered, followed by a pill button "VIEW ALL WORK" and then work tiles.
  (A cookie modal covered the middle of the fold during capture — screenshot is annotated.)
- **Section order:** hero → DEPTIFY: AI ORCHESTRATION FOR THE AGENTIC ERA → AI Transformation
  → Work → ON OUR MIND → footer.
- **Conversion asks:** Three — header CONTACT pill, "VIEW ALL WORK", footer "Get in touch with us".
- **Footer:** Medium, and unusual: it leads with the **sub-brand roster** — Basic/DEPT®,
  Dogstudio/DEPT®, Hello Monday/DEPT®, Studio Dumbar/DEPT® — then Change location, About,
  Careers, Impact Report, newsletter, Get in touch, Instagram, LinkedIn, TikTok.

### AKQA — `https://www.akqa.com/` (read 2026-08-24)
- **Nav:** Not present in the initial fold capture; the rendered DOM exposes About, Work,
  Careers, Studios, Contact (plus Perspectives, AKQA Companies, Sustainability, News).
  Header behaviour on scroll is **UNVERIFIED**.
- **Hero:** An enormous **serif** headline — "IMAGINE WHAT'S NEXT" — set edge-to-edge across
  the full viewport width in a high-contrast didone-style face, cap height roughly 10% of
  viewport height, sitting directly above a cinematic video still (a Volvo reveal, audience
  phones raised in the dark). Three words. This is the single closest analogue in the set to
  an oversized editorial serif headline over real photography.
- **Media:** 10 `<video>`, 17 `<img>`.
- **Section order:** serif headline + film → rotating case teasers written as full sentences
  ("A world first. A new category of writing instrument. Introducing Digital Paper for
  Montblanc ↘", UPS, Sounds Right, Nestlé Goodnes) → **THE FRONTIER AGENCY** →
  **Latest & Greatest** → **At the frontier of gaming** → footer.
- **Conversion asks:** One, and it is typographic rather than a button — the footer opens
  with "What's your / next frontier?".
- **Footer:** Light. That question, then Privacy, Cookie Policy, Perspectives, AKQA Companies,
  Sustainability, News.

### Kurppa Hosk — `https://kurppahosk.com/` (Stockholm; read 2026-08-24)
- **Nav:** Thin bar. Left: "Kurppa Hosk | Part of Eidra". Centered: the KH monogram.
  Right: Work, News, About, Contact (+ Menu). No CTA button.
- **Hero:** No headline. Three iPhone mockups on a pale grey field, each playing a different
  piece of art-directed fashion campaign video (& Other Stories, "New Year Jewelery",
  "SHOP NOW"). Product-in-context photography carries the entire fold.
- **Media:** Heaviest video load in the set — 116 `<img>` and **42 `<video>`**.
- **Section order:** work-first, one client per block — Scania → Bungie → Zalando →
  Bob Beauté → LlamaCon × Meta → Nike → International → then news items (new brand offering,
  "Kurppa Hosk is growing", Kurppa Hosk Communications, Red Dot Awards, Aira) → **"Create Great"**
  → footer.
- **Conversion asks:** Effectively one, in the footer, but **named**: "For new business
  enquiries contact **Jonas Pålsson**" — a person, not a form.
- **Footer:** Very heavy. Five offices with **street addresses and a named contact each**
  (Stockholm/Måns Jacobsson Hosk, New York/Alexander Kouznetsov, Chicago/Clemens Brandt,
  Oslo/Sanda Zahirovic, London/Paul Harrop), business enquiries, careers, named press
  contact (Katja Lilja), socials, legal.

### Locomotive — `https://locomotive.ca/en` (Montréal; read 2026-08-24 — DOM only)
- **Nav:** Wordmark "Locomotive®" left; items Work, Agency, Careers, Store; a **"Let's talk"**
  CTA; a Menu control and a "Français" language toggle.
- **Hero:** `h1` reads "🔶 Locomotive® Digital-first Design Agency🍺🔞" — emoji are used as
  structural punctuation inside headings and the footer address. Deliberately irreverent.
- **Media:** Light — 7 `<img>`, 1 `<video>`, 2 `<canvas>`.
- **Section order:** hero → **Featured work** (Lightship, Wolverine Worldwide, The Drake Hotel,
  Dulcedo, Scout Motors) → All Work → **Extras (13)** → Articles → **Culture** → **Store**
  (real merch: "Pros de l'internet" T-shirt and sand hat) → footer.
- **Conversion asks:** Two — nav "Let's talk" and a footer newsletter.
- **Footer:** Heavy and playful. Full menu, socials (incl. Behance and GitHub), external
  products (Locomotive Scroll, Annual trips, Dynasty), street address, phone, newsletter.
- Visual treatment **UNVERIFIED** (screenshot timed out).

### Hello Monday / DEPT® — `https://www.hellomonday.com/` (Copenhagen/NY; read 2026-08-24 — DOM only)
- **Nav:** Work, Services, About, Stories, Product + socials. No CTA button in the header.
- **Hero:** `h3` "We make digital (and magical)…" above an `h1` that is a **rotating category
  word** — captured mid-cycle as "Branding".
- **Section order:** hero → an extremely long single-column stream of ~35 case studies
  (Google Gemini, Bang & Olufsen, Strava Year In Sport, Netflix, OPPO, Lyft, T-Mobile,
  YouTube…) → footer. The homepage is essentially the entire portfolio.
- **Conversion asks:** Four, all in the footer, each routed to a different intent:
  "Want to collaborate? → Work with us / newbusiness@", "Want to say hi? → General inquiries /
  hello@", "Want to join us? → Become a Mondayteer", "Want to learn? → Become an intern".
- **Footer:** Heavy. Four intents + four offices with addresses and phone numbers
  (New York, Copenhagen, Aarhus, Amsterdam).

### Active Theory — `https://activetheory.net/` (read 2026-08-24 — hero only)
- **Nav:** A **literal floating pill** — a single glowing, rounded, semi-transparent capsule
  in the **top-right corner** containing exactly **two items separated by a rule:
  "WORK — CONTACT"**. Nothing else. No logo in the bar.
- **Hero:** Full-screen dark WebGL scene — an iridescent 3D "a" mark suspended in a particle
  field with a jellyfish-like form drifting past. No headline, no copy.
- Everything below the fold is **UNVERIFIED** (site refuses headless rendering).

### Resn — `https://resn.co.nz/` (read 2026-08-24 — intro only)
- Renders a gated WebGL intro: a shattering dark polyhedron with the centered line
  "Resn · Creative Studio / Est. 2004". No nav, no chrome, no scroll affordance during
  observation. Structure **UNVERIFIED**.

---

## 3. Comparison table

Sites are ordered roughly from most editorial/restrained to most engineered.
"Fold copy" = words of headline visible above the fold.

| Site | Nav pattern | Nav items | Header CTA | Hero type | Fold copy | Serif/Sans | Photo / video / 3D | Conversion asks | Footer weight |
|---|---|---|---|---|---|---|---|---|---|
| **COLLINS** | Wordmark + hamburger | 0 visible (3 in menu) | none | Centered serif line, vast whitespace | 3 words | **Serif** | Photo (few, huge, art-directed) | 1 (footer email) | Light-med |
| **AKQA** | Minimal (UNVERIFIED on scroll) | 5 | none | Oversized serif over cinematic film | 3 words | **Serif** | Video-led | 1 (typographic) | Light |
| **Wolff Olins** | Thin fixed bar | 4 + search | none | Full-bleed case photograph, no headline | 0 words | Sans | **Photo** | 1 | Light |
| **BASIC/DEPT** | Fixed over video | 6 + overflow | none | Full-bleed cinematic video + "WATCH REEL" | 0 words | Sans | **Video** | 1 | Heavy |
| **Kurppa Hosk** | Thin bar, centered mark | 4 | none | Device mockups playing campaign film | 0 words | Sans | **Photo + video (42)** | 1 (named person) | Very heavy |
| **Pentagram** | Fixed white bar | 5 + search | none | Case carousel, 12 slides | 0 words | Sans | **Photo (huge volume)** | ~0 in body | Very heavy |
| **Instrument** | **Floating pills (3 L + 3 R + announcement)** | 6 | CONTACT pill | Wordmark + video reel | 1 word (wordmark) | **Both** — grotesque wordmark, **serif positioning line** | Photo + video | 4 | Heavy |
| **Koto** | Fixed bar → **collapses to pill on scroll** | 6 + live clock | none | Full-bleed video + bottom-left headline | 5 words | Sans | **Video** | UNVERIFIED | UNVERIFIED |
| **Active Theory** | **Floating pill, top-right, 2 items** | 2 | CONTACT (in pill) | Full-screen WebGL | 0 words | Sans (mono) | **3D/WebGL** | UNVERIFIED | UNVERIFIED |
| **R/GA** | Fixed bar | 6 | none | Giant sans statement on black | 9 words | Sans | Video tiles | ~1 | Light |
| **AREA 17** | Fixed bar | 5 | none | Sans statement + photo below | 16 words | Sans | Photo | 2 | Medium |
| **Work & Co** | **None** (Index at bottom) | 0 | none | Sans statement + **press quote in hero** | 8 words + quote | Sans + serif quote | Light | soft links only | Index block |
| **DEPT** | Fixed, centered logo | 4 (+dropdown) | CONTACT pill | Two-tone giant sans | 4 words | Sans | Video/photo tiles | 3 | Medium |
| **Huge** | Tiles + **"Let's talk ↗" pill** | 5 (behind Menu) | **Let's talk** | 3D photo cube (WebGL) | 0 words | Sans | **3D + photo** | 4+ (incl. form) | Very heavy |
| **Hello Monday** | Fixed bar | 5 | none | Rotating category word | ~5 words | Sans | Photo/video stream | 4 (all footer) | Heavy |
| **Locomotive** | Bar + "Let's talk" | 4 | **Let's talk** | Emoji-punctuated wordmark line | ~6 words | Sans | Light | 2 | Heavy |

---

## 4. Synthesis

### 4.1 The dominant section order

Across the twelve sites whose full flow was verified, the sequence converges hard:

```
1. HERO            — brand or work, almost never a feature pitch
2. POSITIONING     — one sentence, what we are / who we serve
3. PROOF           — award marks, client logos, or a press quote
4. WORK            — the largest section on the page, by far
5. SERVICES        — what you can buy, named plainly
6. POV / CULTURE   — purpose, beliefs, thinking, news
7. SINGLE CTA      — one closing ask, often typographic
8. HEAVY FOOTER    — offices, named humans, routed mailboxes, careers
```

Steps 2 and 3 swap in about a third of cases (COLLINS and Work & Co both put proof
*before* any positioning — COLLINS with its "8x Agency of the Year" laurel strip, Work & Co
with the Fast Company quote inside the hero itself).

**What the ordering is doing psychologically.** The order is a status sequence, not a
persuasion funnel. A funnel says *here is your problem, here is my solution, here is the
button*. These sites say something different, in four moves:

1. **Hero = confidence signal.** Leading with a case photograph (Wolff Olins), a reel
   (BASIC/DEPT), a carousel (Pentagram) or three words (COLLINS) is a costly signal. Only a
   firm that is not worried about being understood can afford to explain nothing. Explaining
   yourself immediately reads as needing the work.
2. **Proof before pitch.** Awards and client logos arrive before any list of services. This
   inverts normal SaaS ordering and it is deliberate: it moves the visitor's question from
   "are they any good?" to "can I afford them?" before a single capability is described.
3. **Work as the argument.** Work occupies more vertical space than everything else combined.
   Nobody argues that they do good work — they show twenty pieces of it and let the reader
   conclude it. The services list comes *after* the work, so it reads as a menu for a
   customer who has already decided, not as a pitch to one who hasn't.
4. **One ask, late, and quiet.** A single conversion point at the bottom implies the reader
   will get there if they belong there. AKQA's entire ask is the phrase "What's your next
   frontier?" — no button. Kurppa Hosk's is a person's name. Scarcity of asking is itself a
   status claim.

### 4.2 What the top tier does that the mid-tier does not

Every item below was observed on at least three sites in this set.

1. **They lead with an image, not a sentence.** Six of sixteen have **zero words** of headline
   above the fold (Wolff Olins, BASIC/DEPT, Kurppa Hosk, Pentagram, Active Theory, Huge).
   The median across the whole set is **3–5 words**. Nobody is above 16.
2. **Real, art-directed, commissioned photography — never stock, never CSS.** Pentagram
   serves 186 images and 202 `<picture>` elements. Kurppa Hosk serves 42 videos. Wolff Olins'
   hero is a lit still life. There is **not one terminal mockup, gradient card or icon grid
   in the entire set.**
3. **Named humans and street addresses in the footer.** Kurppa Hosk lists five offices, each
   with an address *and* a named contact. Pentagram lists four office emails. Hello Monday
   lists four offices with phone numbers. Huge routes four separate mailboxes. Mid-tier sites
   use one contact form and no address — the footer is where a firm proves it is a real
   organisation with a lease.
4. **Restraint in the conversion ask.** Nine of sixteen have **no CTA button in the header at
   all**. Only Huge, DEPT and Locomotive put a button there. Median asks per page ≈ 2.
5. **Serif is used as a status marker, not as body copy.** Where serif appears it is doing one
   of two jobs: the single largest statement on the page (COLLINS "Rewrite your worth.",
   AKQA "IMAGINE WHAT'S NEXT", Instrument's oversized "Shape") or a borrowed-credibility
   pull-quote (Work & Co's Fast Company line, Instrument's positioning sentence). It is never
   the default UI face.
6. **Whitespace at a scale that looks like a mistake.** COLLINS' three-word headline sits in
   the middle of a screen with roughly a full viewport of empty space above it. AREA 17 pushes
   its `h1` below a full screen of nothing. Density reads as cheap.
7. **The nav is a filing system, not a funnel.** 4–6 items, plain nouns (Work, About, News,
   Contact). No "Solutions", no "Platform", no "Resources" mega-menu.
8. **Motion is used once, expensively.** A hero reel or a WebGL scene — then the page settles
   down. Nobody animates every section on scroll.

### 4.3 Where a floating pill nav + oversized editorial serif + real photography sits

**Verdict: competitive and current — with one caveat.** Each of the three elements was
independently verified in this set, and two of them appear together on Instrument, which is a
current Design Studio Agency of the Year winner (per its own site banner, read 2026-08-24).

- **Floating pill nav — ahead of the median, not dated.** Instrument runs six discrete pills.
  Active Theory runs a literal glowing two-item capsule. Koto's full-width bar *collapses into*
  a pill on scroll. That is three of sixteen using the pattern natively and it skews toward the
  more design-forward end of the set (Instrument, Active Theory) rather than the traditional
  end (Pentagram, Wolff Olins). It is a live 2026 pattern, not a 2021 leftover.
- **Oversized editorial serif — verified at the very top of the set.** COLLINS' entire homepage
  hero is one centred serif line. AKQA's is a viewport-wide didone. Instrument sets its
  positioning statement in serif directly under the wordmark. This is arguably the *highest*
  status typographic move currently in play, because it is the one that most clearly signals
  "we are not a technology company."
- **Real cinematic product photography — table stakes, not differentiation.** Every single
  top-tier site in this set is photography- or film-led. Having it does not make our good page
  special; **not** having it on the other pages is what makes them read as mid-tier.

**The caveat:** these three elements are the *style layer*. What our good page has in common
with COLLINS and AKQA is the surface. What it likely does not yet have is the **structure** in
§4.1 — the proof strip, the work section that dwarfs everything else, the restrained single
ask, the heavy footer with real addresses. A serif headline over a photograph with a
developer-marketing body below it will read as a costume. The pixels are already competitive;
the sequence is the gap.

### 4.4 Recommendations, in priority order

**P0 — Reorder every page to the verified sequence.** This is free and it is the single
biggest change. Hero → positioning (one sentence) → proof → work → services → POV → one CTA →
heavy footer. Today's generic pages almost certainly run hero → features → CTA → features →
CTA, which is the SaaS funnel, and it is the thing that reads as mid-tier regardless of how
good the typography is.

**P1 — Delete every terminal mockup, CSS card and icon grid; replace with real campaign
imagery.** Zero of sixteen top-tier sites use any of these. For Nexus Creative specifically
this is unusually easy: the product *makes campaign creative*, so the output is the
photography. Show generated campaigns full-bleed at the size Wolff Olins shows Lloyds. An AI
campaign studio that illustrates itself with a terminal window is arguing against its own
product.

**P2 — Build a proof strip and place it immediately after the hero.** COLLINS' award laurels,
Instrument's six-logo client roster, Work & Co's press quote. Use only what is true — real
client logos if they exist, a real press mention if one exists, or real usage/output numbers.
If none of those exist yet, use nothing rather than invented badges; an empty slot is less
damaging than a fake one. Note that Huge is the only site in the set that shows quantified
results (1B / 100+ / 12Y), so a metrics block is defensible but is not the norm.

**P3 — Make Work the largest section on every page, and curate it to five.** Wolff Olins
shows five in "Selected Work". Locomotive shows five in "Featured work". Instrument shows a
4-up filterable grid. Full-bleed or large-grid, one client per block, client name + one line
of description — the Pentagram carousel caption pattern ("ICD Beauty — Brand identity and
packaging for the Seoul-based beauty brand merging biotechnology with daily rituals") is a
good model for that line.

**P4 — Cut the conversion asks down to two, and move them late.** One in the nav (a single
pill — "Contact" like Instrument, or "Let's talk" like Huge and Locomotive), and one closing
block above the footer. Remove mid-page CTA repetition. The median in this set is two asks;
nine of sixteen have no header button at all.

**P5 — Rebuild the footer as a credibility asset.** This is the cheapest high-status signal
available and it is currently almost certainly the weakest part of the site. Include: a real
street address (2261 Marentette Ave, Windsor ON — TAURUS AI Corp. is a real federally
incorporated Canadian company and should say so), routed mailboxes rather than one generic
form (new business / careers / press / general — the Huge and Hello Monday pattern), a named
new-business contact (the Kurppa Hosk pattern), careers, and a newsletter. Pentagram, Kurppa
Hosk, Hello Monday, BASIC/DEPT and Huge all do this; the light-footer sites (R/GA, AKQA,
Wolff Olins) can afford not to because their names already carry the credibility.

**P6 — Standardise the nav to 4–6 plain nouns and keep the pill.** The pill is fine — keep it.
What matters is the item count and the vocabulary. Every site in this set uses plain nouns
(Work, About, News, Contact, Careers, Services). Consider Koto's scroll behaviour — full bar
at rest, collapsing to a compact pill on scroll — as a way to get both discoverability and the
floating-pill aesthetic.

**P7 — Cut fold copy to under 10 words and add a full viewport of whitespace.** Median across
the set is 3–5 words. R/GA's 9-word headline is the *upper* end. AREA 17's 16 words is the
outlier. Whatever the current hero copy is, it is probably three times too long.

**P8 — Use motion exactly once per page.** A single hero reel or one WebGL moment, then let
the page be still. Nobody in this set animates every section.

---

## 5. Sources

All URLs below were loaded and read on **2026-08-24**.

| Site | URL | Result |
|---|---|---|
| Pentagram | https://www.pentagram.com/ | Full |
| R/GA | https://rga.com/ | Full |
| AREA 17 | https://area17.com/ | Full |
| Instrument | https://www.instrument.com/ | Full |
| Work & Co | https://work.co/ | Full |
| COLLINS | https://www.wearecollins.com/ | Full |
| Wolff Olins | https://www.wolffolins.com/ | Full |
| BASIC/DEPT® | https://basicagency.com/ | Full |
| Huge | https://www.hugeinc.com/ | Full |
| DEPT® | https://www.deptagency.com/ | Full |
| AKQA | https://www.akqa.com/ | Full |
| Kurppa Hosk | https://kurppahosk.com/ | Full |
| Locomotive | https://locomotive.ca/en | DOM only |
| Hello Monday | https://www.hellomonday.com/ | DOM only |
| Koto | https://koto.com/ (via 301 from https://koto.studio/) | Partial |
| Active Theory | https://activetheory.net/ | Hero only |
| Resn | https://resn.co.nz/ | Intro only |
| DesignStudio | https://design.studio/ | Rebrand splash → https://www.further.group/ |

### Screenshot index — `08-DOCUMENTATION/research/screenshots/`

| File | What it shows |
|---|---|
| `pentagram-hero.png` | Fixed nav, case carousel, "We design Everything for Everyone" filter pill |
| `rga-hero.png` | 6-item nav, 9-word giant sans headline on black |
| `area17-hero.png` | "A/" mark, 5-item nav, 16-word sans `h1`, photo below fold |
| `area17-flow.png` | AREA 17 full-page flow |
| `instrument-hero.png` | **Floating pill nav** (3 left + 3 right + announcement), wordmark, lime video panel |
| `instrument-flow.png` | **Full canonical section flow** — serif positioning → work grid → client roster → services → recognition → purpose |
| `workco-hero.png` | No nav; sans headline + Fast Company serif pull-quote in the hero |
| `collins-hero.png` | **Serif hero "Rewrite your worth." + 8-award laurel proof strip** |
| `collins-flow.png` | COLLINS whitespace rhythm, hero → proof → full-bleed case imagery |
| `wolffolins-hero.png` | **Headline-free full-bleed case photograph (Lloyds)**, 4-item nav |
| `wolffolins-flow.png` | Wolff Olins full-page flow |
| `basic-hero.png` | Cinematic video hero, "WATCH REEL" circle, 6-item nav |
| `huge-hero.png` | Huge/Menu tiles, **"Let's talk ↗" pill CTA**, 3D photo cube |
| `dept-hero.png` | 4-item nav + centered logo + CONTACT pill; two-tone giant sans (cookie modal visible) |
| `akqa-hero.png` | **Viewport-wide serif "IMAGINE WHAT'S NEXT" over cinematic film** |
| `kurppahosk-hero.png` | Device mockups playing campaign film; centered monogram nav |
| `activetheory-headless-blocked.png` | The "browser not supported" page headless Chromium receives — evidence for the UNVERIFIED marking, **not** the real site |
| `designstudio-rebrand-splash.png` | design.studio's "DesignStudio IS NOW FURTHER" splash |

Screenshots of Koto, Active Theory (real) and Resn were viewed live through the browser-use
MCP driver and are described in §2; those frames were not written to disk because that driver
returns images inline rather than to a file path.
