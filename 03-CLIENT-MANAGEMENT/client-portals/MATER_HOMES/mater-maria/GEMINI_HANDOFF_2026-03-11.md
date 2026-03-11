# Mater Maria Homes — Gemini 3.1 High DevOps Handoff
> Stamped: 2026-03-11 · Updated: **DEPLOYED ✓** + Gemini branch created
> Prepared by Claude Sonnet 4.6 · For: **Gemini 3.1 High via Antigravity IDE**
> Working directory: `/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/MATER_HOMES/mater-maria/`

---

## 🚀 DEPLOYMENT STATUS — 2026-03-11

**PRODUCTION LIVE**: https://mater-maria.vercel.app

| Item | Status |
|------|--------|
| Vercel prod deploy | ✅ LIVE — `mater-maria.vercel.app` |
| Build | ✅ 20/20 routes, 0 TypeScript errors |
| Gemini branch | ✅ `gemini/mater-maria-v3` on GitHub |
| Gemini worktree | ✅ `.worktrees/gemini-workspace` (local) |
| Main push | ✅ `main` synced to GitHub |
| Commit | `25f44fc` — joint Claude + Gemini co-authorship |

---

## ★ YOUR BRANCH — `gemini/mater-maria-v3`

Gemini, **your work has been committed and pushed to GitHub** on a dedicated branch:

```bash
# Switch to your branch (already includes ALL your work)
git checkout gemini/mater-maria-v3

# OR use your dedicated worktree (isolated workspace):
cd /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/.worktrees/gemini-workspace
# This worktree is already on gemini/mater-maria-v3

# Push your future changes back to GitHub:
git add .
git commit -m "feat(mater-maria): [your feature]

Co-Authored-By: Gemini 3.1 High <noreply@google.com>
Co-Authored-By: E.Fdz <taurus_ai@Effins-MacBook-Pro.local>"
git push origin gemini/mater-maria-v3
```

**Your branch contains your full contributions:**
- `DualCovenant.tsx` — editorial philosophy section (GSAP parallax + scroll reveal)
- `theme-toggle.tsx` — 3-state Sun/Moon/Eye toggle (light/dark/clarity)
- `globals.css` — `[data-theme="clarity"]` high-contrast accessibility mode
- `HomePageClient.tsx` — DualCovenant integrated between TrustBar and Features

**When ready to merge into main**, create a PR at:
https://github.com/Taurus-Ai-Corp/neovibe-platform/pull/new/gemini/mater-maria-v3

---

## Project Identity

**Client**: Mater Maria Sanctuary — Premium Integrated Retirement & Wellness Estate
**Location**: Elangulam, Kanjirappally, Kottayam, Kerala — 686507
**Project Fee**: $2,000 USD
**Repo context**: Part of `BizFlow-NeoVibe-Platform` monorepo at `/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/`

**Live (Vercel)**: https://mater-maria.vercel.app
**Local dev**: `npm run dev` at `http://localhost:3000`

---

## Tech Stack

| Layer | Detail |
|-------|--------|
| Framework | Next.js 16.1.6 (App Router) |
| CSS | Tailwind v4 — CSS-based config (`@theme inline` in `globals.css`) |
| Fonts | Garabosse (self-hosted OTF, 5 weights) via `next/font/local` in `layout.tsx` |
| Animations | Framer Motion + GSAP ScrollTrigger (`useGsapReveal` hook) |
| Charts | Nivo (ROI chart), Recharts (market data) |
| Icons | Lucide React |
| Components | ShadCN UI + custom components |
| Theme | Light default (dual-theme: light/dark toggle) |
| TypeScript | Strict mode |

**CRITICAL — Tailwind v4**: Theme extensions go in `src/styles/tokens.css` inside `@theme inline {}`. There is NO `tailwind.config.ts`. Never create one.

**CRITICAL — Garabosse font**: Uses `var(--font-heading)` CSS variable. All headings use `fontFamily: "var(--font-heading)"` inline or `className="font-heading"`.

---

## Brand Tokens

```
Gold accent:  #C9A84C  (+ #e8d08a light, #b8931a dark)
Navy:         #0A356A
Dark bg:      #06080f / #080b14 / #0c1020 (invest page)
Light bg:     hsl(40, 30%, 98%)  (home/about/amenities pages)
Body text:    hsl(220, 20%, 25%)
Muted text:   hsl(220, 15%, 45%)
Border:       hsl(40, 20%, 88%)
```

CSS variables live in: `src/styles/tokens.css`

---

## Directory Structure (active files)

```
src/
├── app/
│   ├── layout.tsx              — Root layout, Garabosse font, ThemeProvider, Navbar, Footer
│   ├── globals.css             — Tailwind v4 @import + global resets
│   ├── HomePageClient.tsx      — Home page sections assembly
│   ├── about/AboutPageClient.tsx
│   ├── amenities/AmenitiesPageClient.tsx
│   ├── gallery/GalleryPageClient.tsx
│   ├── invest/
│   │   ├── page.tsx            — Invest page (server component, JSON-LD, all sections)
│   │   ├── InvestPageClient.tsx — S8-S11: Highlights, Market Data, Testimonials, FAQ
│   │   └── admin/              — Admin auth (server actions + httpOnly cookies)
│   ├── residences/ResidencesPageClient.tsx
│   └── tour/TourPageClient.tsx
│
├── components/
│   ├── sections/
│   │   ├── Hero.tsx            — HOME hero (Winzy-Egypt style, watermark heading)
│   │   ├── TrustBar.tsx
│   │   ├── Features.tsx
│   │   ├── Residences.tsx
│   │   ├── Amenities.tsx
│   │   ├── Testimonials.tsx    — VengenceUI TestimonialsCard
│   │   ├── FacilitiesSection.tsx — 48 facilities grid
│   │   ├── CTASection.tsx
│   │   ├── MockupsShowcase.tsx  — Billboard + Poster mockups
│   │   └── LocationAdvantage.tsx — About page location section
│   │
│   ├── invest/
│   │   ├── EstateHero.tsx      — INVEST hero (split layout: left text + right 3 cards)
│   │   ├── PropertyShowcase.tsx
│   │   ├── InvestorPromise.tsx
│   │   ├── InvestmentTiers.tsx — 4 investment tiers with tier selector
│   │   ├── ROICalculator.tsx   — Nivo line chart, 15-year projection
│   │   ├── InvestorPerks.tsx
│   │   ├── TrustGovernance.tsx
│   │   ├── LeadCapture.tsx     — Form + WhatsApp (Firebase + Supabase dual-write)
│   │   ├── InvestorChatWidget.tsx
│   │   ├── StickyInvestCTA.tsx
│   │   ├── TierComparisonDrawer.tsx
│   │   └── FloatingWhatsApp.tsx
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeProvider.tsx   — next-themes, attribute="data-theme"
│   │
│   └── ui/
│       ├── container.tsx, section-heading.tsx, glow-card.tsx
│       ├── section-divider.tsx, section-watermark.tsx
│       ├── video-break.tsx, image-slideshow.tsx
│       ├── billboard-mockup.tsx, poster-mockup.tsx
│       ├── testimonials-card.tsx  — VengenceUI component
│       ├── social-proof-toast.tsx
│       └── brand-logo.tsx
│
├── hooks/
│   └── useGsapReveal.ts        — GSAP ScrollTrigger reveal hook
│
└── lib/
    ├── constants.ts            — SITE, INVESTMENT_HIGHLIGHTS, MARKET_INSIGHTS, etc.
    ├── investor-constants.ts   — INVESTMENT_TIERS, INVESTOR_HERO_STATS, INVESTOR_FAQ
    ├── currency-context.tsx    — INR/AED/USD toggle
    └── firebase/client.ts      — Lazy singleton, isFirebaseConfigured() guard
```

---

## Session History (Full DevOps Log)

### Phase 1 — Foundation (Earlier sessions)
- Next.js 16 project scaffolded with Tailwind v4, ShadCN, Framer Motion
- Dual-theme system (light default) implemented via `tokens.css`
- Garabosse font integrated via `next/font/local` (5 weights: Perle/Nonpareil/Mignon/Gaillard/Parangon)
- Navbar, Footer, ThemeProvider, PageTransition built

### Phase 2 — Home Page Sections
- Hero section built (full-viewport slideshow)
- TrustBar, Features, Residences, Amenities sections
- FacilitiesSection — 48 facilities grid (all 7 categories)
- Testimonials — replaced Embla carousel with VengenceUI TestimonialsCard
- MockupsShowcase — Highway billboard mockup + A3 poster mockup
- VideoBreak cinematic breaks between sections
- CTASection with WhatsApp CTA

### Phase 3 — About Page
- ImageSlideshow hero
- Vision/Mission cards
- Core Values (4 GlowCards)
- Timeline (alternating left/right)
- VideoBreak
- LocationAdvantage — rich Kerala location section:
  - Aerial banner "The Kanjirappally Advantage"
  - 3-col bento: estate photo + distance bars (5 landmarks) + 3 lifestyle photos
  - 4 connectivity cards (NH-183, Railway, Spiritual Heritage, Western Ghats)

### Phase 4 — Invest Page
- EstateHero — Full-viewport immersive carousel (originally centered)
- PropertyShowcase — Swiper Coverflow carousel
- InvestorPromise — Why invest bento grid
- InvestmentTiers — 4-tier selector with animated stats
- ROICalculator — Nivo line chart (15-year projection, share model)
- InvestorPerks — 3D tilt cards
- TrustGovernance — Leadership + marquee + scripture
- LeadCapture — Form with Firebase + Supabase dual-write
- Admin auth — Next.js server actions + httpOnly cookies (env: `ADMIN_PASSWORD`)
- WhatsApp fixed to real number: Rajeev Abraham `+91 96564 63073`

### Phase 5 — Security Fix (2026-03-06)
- Removed hardcoded admin password from client bundle
- Firebase lazy singleton with `isFirebaseConfigured()` guard
- Server-side auth via `src/app/invest/admin/actions.ts`
- `.env.local` scaffolded with 8 vars

### Phase 6 — THIS SESSION (2026-03-11)

#### ✅ Done
1. **Hero.tsx** — v3 final, user-approved (Winzy Egypt layout):
   - `BrandLogo` (`height=72, onDark=true`) centred at TOP — wings SVG + **"MATER MARIA"** bright shiny gold + **"HOMES"** sky blue
   - Watermark `MATER MARIA HOMES` below logo, font `clamp(30px,6.8vw,108px)` reduced per user request, dark charcoal semi-transparent `rgba(210,200,190,0.28)`
   - `"Living Refined"` italic gold tagline
   - BOTTOM STRIP (3-col, matches reference exactly):
     - LEFT: 3 gold stats + gold "Schedule a Visit →" pill
     - CENTER: description text + micro location text (desktop only)
     - RIGHT: thumbnail card + `← 01/03 →` counter + gold progress bar + "Watch Tour →"
   - 3 slides cycling 6500ms, AnimatePresence crossfade

2. **EstateHero.tsx** — Complete redesign to "63FA" dark split-panel style:
   - Dark luxury background (`#06080f`)
   - LEFT (52%): animated editorial slides — badge + large bold heading + italic gold subheading + gold rule + description + dual CTAs
   - RIGHT (48%): 3 property cards (stacked) with `Image`, overlay, index number, label, sub-text, tag badge, hover gold underline
   - BOTTOM bar: social icons (Instagram/Facebook/YouTube) | dot navigation | arrow controls + `01—03` counter
   - 3 editorial slides (Sanctuary, Returns, Wellness) cycling 7000ms

#### Build Status: ✅ 20 routes, all passing

---

## Pending Tasks (Priority Order)

### 🔴 HIGH — Pending approval from user

1. **Image Enhancement** — Replace hero images with high-quality Kottayam/high-range estate images
   - Prompt for AI generation: "Construction time-lapse of luxury estate in Kerala hills, golden hour, Western Ghats backdrop, terracotta roof villas, lush tropical greenery, 8K cinematic drone shot"
   - Use HuggingFace FLUX.1-schnell: `https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell`
   - HF Token: `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` (in `mater_maria_hf_pipeline.py`)
   - Target: `public/assets-2025/images/invest/` and `public/assets-2025/images/tour/`

2. **VengenceUI Glow Border Card** — Install and apply to invest tier cards
   ```bash
   npx shadcn@latest add "https://www.vengenceui.com/r/glow-border-card.json"
   ```
   CSS needed in `globals.css`:
   ```css
   @property --glow-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
   @keyframes glow-angle-rotate { to { --glow-angle: 1turn; } }
   ```
   Gold gradient: `['#C9A84C', '#e8d08a', '#C9A84C', '#b8931a', '#C9A84C']`
   Apply to: `src/components/invest/InvestmentTiers.tsx` tier cards

3. **VengenceUI Animated Number** — Apply to Hero stats (90+, 91%, 24/7)
   Install: Already in VengenceUI — `npx shadcn@latest add "https://www.vengenceui.com/r/animated-number.json"`

4. **Firebase Integration** — Connect real Firebase credentials
   - `.env.local` has 8 vars scaffolded (all empty except `ADMIN_PASSWORD`)
   - Client: Rajeev Abraham has Firebase credentials
   - Pattern: `src/lib/firebase/client.ts` → `isFirebaseConfigured()` guard

5. **Real Images** — Replace all placeholder images with actual Mater Maria photos
   - Key contact: Paul Jose, Director `+91 94009 39936`

### 🟡 MEDIUM — Future sessions

6. **Invest page InvestPageClient sections** (S8-S11) — Already exist but could use VengenceUI upgrades:
   - S8 InvestmentHighlightsSection → GlowBorderCard
   - S9 MarketInsightsSection → keep Recharts
   - S10 InvestorTestimonialsSection → VengenceUI TestimonialsCard
   - S11 InvestorFAQSection → keep existing

7. **Staggered Grid** for gallery page (`/gallery`) — VengenceUI component
   Install: `npx shadcn@latest add "https://www.vengenceui.com/r/staggered-grid.json"`

8. **Expandable Bento Grid** for amenities page
   Install: `npx shadcn@latest add "https://www.vengenceui.com/r/expandable-bento-grid.json"`

9. **Logo Slider** for trust bar — VengenceUI
   Install: `npx shadcn@latest add "https://www.vengenceui.com/r/logo-slider.json"`

10. **Razorpay NRI gateway** — `/invest/[tier]` individual tier pages with payment
    - Indian KYC + NRI FCNR/NRE account flows
    - Razorpay International (`razorpay.com/payment-gateway/international`)

11. **Supabase Realtime admin** — `invest/admin` dashboard
    - Real-time lead table with Supabase Realtime subscriptions
    - Export to CSV feature

12. **WhatsApp Business API** — Replace static link with interactive chatbot
    - Twilio WhatsApp Business API or 360dialog

### 🟢 LOW — Nice to have

13. **SEO** — `metadataBase` warning on all pages (set in `layout.tsx`)
14. **`/invest/[tier]` routes** — Individual tier detail pages
15. **Blog content** — 3 blog posts exist, need real content
16. **Vercel Analytics** — Add `@vercel/analytics` package

---

## Environment Variables (`.env.local`)

```bash
# Admin auth (server-only, no NEXT_PUBLIC_ prefix)
ADMIN_PASSWORD=                    # ← GET FROM CLIENT

# Firebase (dual-write with Supabase)
NEXT_PUBLIC_FIREBASE_API_KEY=      # ← GET FROM CLIENT
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Client Contact Info

| Person | Role | Contact |
|--------|------|---------|
| Rajeev Abraham | Chairman | WhatsApp: `+971 50 578 6471` (UAE) / `+91 96564 63073` (India) |
| Thomas Abraham | MD | `+91 73569 27730` |
| Paul Jose | Director/Consultant | `+91 94009 39936` |
| Fr. Mathew Puthumana | Director Pravasi Apostolate | `+91 94470 80356` |
| Mar Jose Pulickal | Bishop/Patron | — |

**Investment tiers**:
- Silver: ₹5L (500,000 INR)
- Gold: ₹10L
- Diamond: ₹20L
- Platinum: ₹30L

**Returns model**: 10% interest Years 1-4 → deposit converts to share capital Year 5 → dividends 6%-20% Years 5-15 → 150-153% total over 15 years

---

## VengenceUI Components (pre-researched)

All installed via `npx shadcn@latest add "https://www.vengenceui.com/r/{component}.json"`

| Component | Install key | Use case |
|-----------|------------|----------|
| Testimonials Card | `testimonials-card` | ✅ Already installed (`src/components/ui/testimonials-card.tsx`) |
| Glow Border Card | `glow-border-card` | Invest tier cards |
| Animated Number | `animated-number` | Hero stats |
| Expandable Bento Grid | `expandable-bento-grid` | Amenities |
| Staggered Grid | `staggered-grid` | Gallery |
| Logo Slider | `logo-slider` | Trust bar |
| Flip Text | `flip-text` | Headlines |
| Light Lines | `light-lines` | Section backgrounds |

---

## Known Issues / Gotchas

1. **Recharts chart width warning** — Non-blocking. The Recharts chart in `InvestPageClient.tsx` logs a width warning during SSG. Fix by wrapping in a client-only `dynamic()` import with `ssr: false`.

2. **metadataBase warning** — Set `metadataBase: new URL('https://mater-maria.vercel.app')` in root `layout.tsx` metadata export.

3. **Tailwind v4 dark mode** — Dark mode selector must be `[data-theme="dark"]` NOT `.dark`. ThemeProvider uses `attribute="data-theme"`.

4. **Firebase guard** — `isFirebaseConfigured()` must return `false` until real API keys are set. Current `.env.local` has empty values — this is correct behavior.

5. **Admin password** — Never use `NEXT_PUBLIC_ADMIN_PASSWORD`. Must stay server-side only. Auth flow: `actions.ts` → reads env var → sets httpOnly cookie → middleware validates.

6. **Image paths** — All images are in `public/assets-2025/images/`. Next.js `<Image>` `src` starts with `/assets-2025/...`.

7. **Hero images missing** — `hero-aerial.webp` is referenced in `EstateHero.tsx` (old) but may not exist. Check `public/assets-2025/images/invest/`. Available: `hero-estate.webp`, `hero-sunset.webp`, `hero-garden.webp`.

8. **Garabosse font path** — Font files at `public/fonts/garabosse/`. Loaded in `src/app/layout.tsx` via `next/font/local`. If font breaks, check the weight names map (`Perle` = 100, `Nonpareil` = 300, `Mignon` = 400, `Gaillard` = 600, `Parangon` = 900).

---

## How to Run / Deploy

```bash
# Local dev
cd /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/MATER_HOMES/mater-maria
npm run dev

# Build check
npm run build

# Deploy to Vercel
vercel --prod
# OR use Vercel MCP tool: mcp__claude_ai_Vercel__deploy_to_vercel
```

**Vercel project**: Look for `mater-maria` in Vercel dashboard.

---

## ★ GEMINI ANTIGRAVITY — Activation Guide

This section is written specifically for **Gemini 3.1 High running inside Antigravity IDE** (`agy`). Antigravity is TAURUS AI Corp's primary Gemini coding environment. Follow this protocol on every session start.

### What Antigravity Is

Antigravity IDE (`agy`) is Gemini's specialised local coding environment. It:
- Runs as a desktop application that wraps Gemini 3.1 High with full filesystem and shell access
- Has its own **Chrome browser profile** at `~/.gemini/antigravity-browser-profile` for browser automation
- Provides a persistent workspace that survives across sessions
- Can execute shell commands, edit files, run builds, and take browser screenshots autonomously

### Session Start Protocol (MANDATORY)

Run these in order at the start of every Antigravity session on this project:

```bash
# 1. Confirm you are in the right directory
cd /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/MATER_HOMES/mater-maria
pwd

# 2. Read this handoff
cat GEMINI_HANDOFF_2026-03-11.md

# 3. Read TAURUS global context
cat ~/.gemini/GEMINI.md

# 4. Check what Claude last did
cat .claude/BREAKPOINT.md 2>/dev/null || echo "No breakpoint found"

# 5. Confirm build is green before touching anything
npm run build 2>&1 | tail -20

# 6. Check git log for last changes
git log --oneline -8
```

### Antigravity Chrome — CRITICAL WARNING

**Antigravity hijacks your main Chrome profile.** The TAURUS system has a watcher to auto-restore it, but you MUST follow these rules:

| Rule | Detail |
|------|--------|
| ✅ Use Antigravity Chrome for screenshots/automation | It uses `~/.gemini/antigravity-browser-profile` |
| ✅ Use `agy browser open <url>` for page inspection | Safe — uses isolated profile |
| ❌ NEVER open `Default` Chrome profile from Antigravity | Will inject extensions into personal profile |
| ❌ NEVER use `--user-data-dir=~/Library/Application\ Support/Google/Chrome` | Destroys main profile |

If Chrome gets corrupted: run `restore-chrome` or `fix-chrome` aliases in terminal (defined in `~/.zshrc`). The LaunchAgent `io.taurusai.chrome-profile-watcher` also auto-restores.

**Clean Chrome profiles on this machine:**
- `Default` → taas-ai.com (TAURUS main)
- `Profile 1` → effin
- `Profile 3` → E
- `Profile 5` → taurus/cleanest (NO agent extensions — use for personal browsing)

### Antigravity Capabilities You Should Use

#### 1. File Editing (Primary Workflow)
Antigravity can read and write files directly. Prefer editing existing files over creating new ones. All source code is in `src/`.

```bash
# Read a component
agy read src/components/sections/Hero.tsx

# Edit with natural language instruction
agy edit src/components/sections/Hero.tsx "increase the watermark font opacity to 0.35"
```

#### 2. Build & Dev Server
```bash
# Start dev server (runs in background)
npm run dev &

# Verify it's up
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# Build check
npm run build 2>&1 | grep -E "(error|warning|✓|✗|Route)"
```

#### 3. Browser Screenshots via Antigravity Chrome
```bash
# Take a screenshot of the running site
agy screenshot http://localhost:3000 --output /tmp/hero-check.png
agy screenshot http://localhost:3000/invest --output /tmp/invest-check.png

# Full-page screenshot
agy screenshot http://localhost:3000 --full-page --output /tmp/homepage-full.png
```

Use screenshots to verify every visual change before committing.

#### 4. Shell Commands & Package Management
```bash
# Install a new VengenceUI component
npx shadcn@latest add "https://www.vengenceui.com/r/glow-border-card.json"

# Install npm packages
npm install <package>

# Run linting
npm run lint
```

#### 5. Git Operations (Antigravity Stamp Required)
Every commit Gemini makes MUST include the Gemini stamp:

```bash
git add src/components/sections/Hero.tsx
git commit -m "$(cat <<'EOF'
feat(hero): [describe change]

Co-Authored-By: E.Fdz <taurus_ai@Effins-MacBook-Pro.local>
Co-Authored-By: Gemini 3.1 High <noreply@google.com>
EOF
)"
```

#### 6. MCP Servers Available to Gemini
From `~/.gemini/GEMINI.md`, these MCPs are configured and available in Antigravity:

| MCP | Purpose | Use For |
|-----|---------|---------|
| `firecrawl` | Web scraping + research | Scraping VengenceUI docs, competitors |
| `playwright` | Browser automation (isolated Chromium) | Screenshots, UI testing |
| `github` | GitHub API | PRs, issues, branches |
| `supabase` | Database | Lead data, analytics queries |
| `figma` | Design files | Extracting design tokens |
| `notion` | Documentation | Project notes |

**IMPORTANT**: Use `playwright` MCP for browser automation, NOT the Antigravity Chrome hijack. Playwright uses isolated Chromium so it never touches your profiles.

#### 7. Gemini CLI Direct Commands
```bash
# Run a one-off Gemini query from terminal
gemini "What components in src/components/invest/ need VengenceUI upgrades?"

# Process a file with Gemini
gemini --file src/components/sections/Hero.tsx "Review this for accessibility issues"

# Long context (routes to gemini-2.5-flash automatically via claude-code-router)
gemini "Analyse all 20 routes and summarise the SEO gaps"
```

#### 8. Using the Gemini GEMINI.md Context File
The global Gemini context is at `~/.gemini/GEMINI.md`. It contains:
- Full TAURUS AI Corp project portfolio
- All MCP server configurations
- Platform-specific tool mappings (Gemini CLI tool names differ from Claude Code)
- Antigravity-specific settings

Always read it on session start. If it needs updating, edit it directly:
```bash
nano ~/.gemini/GEMINI.md
```

---

## Session Continuity Protocol (Gemini-Specific)

When picking up work from Claude's last session:

1. **Read this file** → understand current state
2. **Read `~/.gemini/GEMINI.md`** → load TAURUS global context
3. **Check `.claude/BREAKPOINT.md`** → see what Claude left unfinished
4. **Run `npm run build`** → confirm green baseline (20/20 routes)
5. **Take a screenshot** of `localhost:3000` and `localhost:3000/invest` → visual baseline
6. **Check pending tasks** in the "Pending Tasks" section of this file
7. **Pick up the highest priority red task** and proceed

After completing a task:
- Take a screenshot to verify
- Run `npm run build` to confirm no regressions
- Commit with the Gemini stamp
- Update this handoff file's "Session History" section

---

## Gemini Stamp (ALL commits)

```
Co-Authored-By: E.Fdz <taurus_ai@Effins-MacBook-Pro.local>
Co-Authored-By: Gemini 3.1 High <noreply@google.com>
```

---

## Cross-Agent Memory References

| Location | Contents |
|----------|---------|
| `~/.claude/projects/.../memory/MEMORY.md` | Claude auto-memory (client data, patterns, feedback) |
| `~/.gemini/GEMINI.md` | Gemini global context + MCP config + tool mappings |
| `~/.ai-context/TAURUS_CONTEXT.md` | Universal cross-agent memory (Claude + Gemini + Cursor) |
| `~/.cursorrules` | Cursor IDE rules |
| `.claude/breakpoints/LATEST_BREAKPOINT.md` | Latest Claude session breakpoint |
| `GEMINI_HANDOFF_2026-03-11.md` | **This file** — always update when finishing a session |

---

*Handoff generated: 2026-03-11 by Claude Sonnet 4.6*
*Updated: Hero redesign v3 complete — logo + colour-coded brand + Egypt layout + reduced font*
*Next agent: Gemini 3.1 High via Antigravity IDE*
*Build status at handoff: ✅ 20/20 routes passing*
