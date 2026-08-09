# Plan: Rebuild `nexus-web` as `platform/` — Nexus by Taurus AI (4-vertical architecture)

> **SUPERSEDED 2026-08-09** -- this document locks the platform to exactly four verticals
> (Social/Creative/Intel/Freelance) and keeps Agency OS as a sibling product. Both are no
> longer true, and the contracting entity has moved from the UAE FZCO to TAURUS AI Corp.
> (Canada). See `docs/plans/2026-08-09-nexus-taxonomy-and-entity-change.md`.

**Date:** 2026-06-25  
**Based on:** `docs/superpowers/specs/2026-06-24-nexus-enterprise-repo-design.md` (red / latest PRD)  
**Branch:** `feat/nexosync-to-nexus-rebrand` (do not touch `main` directly)  
**Goal:** Delete the stale `nexus-web/` tree (wrong product taxonomy: NEXUS/GRIDERA/NEOFLOW) and replace it with a new `platform/` root brand site that correctly sells the four NEXUS verticals: **Social, Creative, Intel, Freelance**.

---

## Why the old site is wrong

`nexus-web/` was built to a stale PRD (`prd_website_launch.md`) that treated the portfolio as three flagships: NEXUS, GRIDERA, and NEOFLOW. The approved 2026-06-24 PRD says:

- **NEXUS** is the single platform product (`nexus.taurusai.io`).
- Its four verticals are **Social, Creative, Intel, Freelance**.
- **GRIDERA**, **Agency OS**, and **MaterCare** are **sibling products in separate repos** — not part of Nexus.
- **NEOFLOW** is not a NEXUS vertical in the current architecture.

Therefore `nexus-web/` misleads visitors and must be replaced.

---

## Multi-modal research summary (SWARM + superpowers)

I read the SWARM SR Internal Analysis and superpowers docs. The facts that must shape the new site:

### From SWARM `01-SWARM-SR-REVENUE-SYNTHESIS.md`
- Fastest path to revenue = package existing **Nexus Social Suite + AI content engine** into a **local-business AI marketing service** for **Dubai and Kerala SMBs**.
- Pricing matrix:
  - Starter: AED 299 / ₹6,999 — 2 channels, 8 posts/mo
  - Growth: AED 599 / ₹13,999 — 4 channels, 20 posts/mo, Meta ads, WhatsApp replies
  - Pro: AED 1,199 / ₹27,999 — 6 channels, unlimited posts, multi-location
- Upsells: AI agent orchestration ($2k–$5k setup + $500–$1,500/mo) and blockchain/PQC consulting ($2.5k–$10k).
- SR-Swarm is **credibility**, not a paid product yet.

### From SWARM `03-competitor-gap-research.md`
- Competitors (Hootsuite, Sprout, Buffer, Simplified) are generic, expensive, and not localized.
- Nexus gaps to own:
  1. AI agent orchestration, not just scheduling
  2. Localization (UAE Arabic/English, India Malayalam/Kannada/Hindi)
  3. SMB-friendly pricing ($49–$199/mo equivalent)
  4. Vertical play for salons, clinics, cafés, real estate
  5. Hybrid AI + human-lite service
  6. Proof-of-results dashboard

### From SWARM `nexus-creative-editorial/PRODUCT.md` + `ENTERPRISE-GTM-PLAN.md`
- Nexus Creative = AI campaign studio.
- **Core offer:** "Dead Campaign Resurrection" — free 15-min POC using the prospect's own worst-performing campaign.
- Pricing:
  - POC: $99 one-time
  - Studio: $399/mo unlimited
  - Custom/Agency: $1,500+/mo white-label
- ICPs: Dubai creative agencies, real estate marketers, F&B brand managers, SMB owners.
- Anti-references: generic SaaS templates, dark-tech purple glow, emoji grids.

### From `docs/superpowers/specs/2026-06-24-nexus-enterprise-repo-design.md`
- Target topology: `core/` + `verticals/{social,creative,intel,freelance}` + `platform/`.
- Client journey example: PetPawSphere (Dubai pet brand) discovers Nexus → chooses Creative → signs up via Clerk → Stripe → workspace → Drive folder → BDM assigned.
- Six pipelines: Creative, Social, Intel, Lead, Orchestration, Deploy.

### From `docs/superpowers/specs/2026-05-18-taurus-ai-brand-architecture.md`
- Client-facing brand: **"Nexus by Taurus AI"**
- Legal entity: **"TAURUS AI Corp."** (invoices, contracts, footer)
- Never mix the two.

---

## Target architecture

```
nexus-web/                    ← DELETE (stale)
platform/                     ← NEW root brand site → nexus.taurusai.io
├── index.html                ← Platform landing: hero + 4 vertical cards + unified CTA
├── social/
│   └── index.html            ← Nexus Social landing → nexus.taurusai.io/social
├── creative/
│   └── index.html            ← Nexus Creative landing → nexus.taurusai.io/creative
├── intel/
│   └── index.html            ← Nexus Intel landing → nexus.taurusai.io/intel
├── freelance/
│   └── index.html            ← Nexus Freelance landing → nexus.taurusai.io/freelance
├── about.html                ← Company, mission, entity vs brand
├── contact.html              ← Demo form + direct channels
├── pricing.html              ← Unified + vertical-specific tiers
├── case-studies.html         ← Social proof (stub, filled from real wins)
├── assets/
│   ├── css/design-system.css ← Shared tokens: colors, typography, components
│   ├── js/main.js            ← Nav, reveal, tab, form, mobile menu
│   └── img/                  ← Logos, product screenshots, patterns
└── vercel.json               ← Clean URLs, cache headers, security headers
```

The four vertical landing pages share one `design-system.css` and one `main.js` for consistency. Each page is self-contained static HTML (works from `file://` and Vercel) but uses the shared assets.

---

## Phase-by-phase implementation

### Phase 0 — Audit & confirm destruction (15 min)
1. Snapshot `nexus-web/` file list + size (already done: 9 HTML pages, assets, 128 KB).
2. Extract reusable design tokens from `nexus-web/assets/css/styles.css` (dark theme, Geist/Inter fonts, reveal animations) to carry into `platform/assets/css/design-system.css`.
3. **User confirmation:** delete `nexus-web/` entirely. Nothing inside it is needed for the new architecture; the new design language should match the SWARM Creative editorial aesthetic (warm paper palette for Creative, dark glass for platform).

### Phase 1 — Delete stale `nexus-web` (5 min)
1. `git rm -r nexus-web/`
2. Commit with both co-authors:
   - `Co-Authored-By: E.Fdz <admin@taurusai.io>`
   - `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`
3. Verify folder is gone and deletion is staged.

### Phase 2 — Scaffold `platform/` (20 min)
1. Create `platform/` directory tree.
2. Write shared `platform/assets/css/design-system.css`:
   - Dark glass platform theme (inherited from old `nexus-web` but cleaned).
   - Warm editorial theme variant used only on Creative pages.
   - Tokens: colors, typography, buttons, cards, nav, footer, code blocks, tables.
3. Write `platform/assets/js/main.js`: mobile nav, scroll reveal, FAQ accordion, form demo handler, code tabs.
4. Write `platform/vercel.json`:
   - Clean URLs (`/social` → `/social/index.html`, etc.)
   - Long cache for `/assets/*`
   - Security headers.

### Phase 3 — Build the four vertical landings (90 min)
Each page follows the same anatomy:
- Nav with brand + vertical links + CTA.
- Hero: one-sentence value prop + subhead + two CTAs.
- Pain / solution section.
- Feature grid (3–6 cards).
- "How it works" workflow (3–4 steps).
- Proof / metrics section.
- Pricing card.
- Final CTA band.
- Footer with legal entity.

#### 3.1 `platform/index.html` — Platform home
- Hero: "One platform, four AI workforces."
- Four large product cards linking to `/social/`, `/creative/`, `/intel/`, `/freelance/`.
- Trust bar: TAURUS AI Corp., Heiro/Hedera audit, C2PA provenance.
- Unified CTA: "Book a 15-min AI marketing audit" (primary revenue motion from SWARM).

#### 3.2 `platform/social/index.html` — Nexus Social
- Positioning: "AI agent orchestra for social, WhatsApp, and Google Business — built for Dubai and Kerala SMBs."
- Pricing: Starter/Growth/Pro in AED/₹ (from SWARM).
- Features: NLP command panel, Meta/Instagram campaign agent, WhatsApp reply agent, Google Business Profile posts, monthly leads/reviews dashboard.
- CTA: "Get a free content plan" or "Book audit".

#### 3.3 `platform/creative/index.html` — Nexus Creative
- Positioning: "AI campaign studio — brief to platform-ready campaign in 24 hours."
- Hero offer: "$99 Dead Campaign Resurrection" (15-min screen share).
- Pricing: POC $99, Studio $399/mo, Custom/Agency $1,500+/mo.
- Features: brand memory & tone lock, image/video direction, copy, platform plan, C2PA provenance.
- ICPs: agencies, real estate, F&B, SMBs.
- Tracking: Meta Pixel + LinkedIn Insight + Google tag placeholders (from GTM playbook).

#### 3.4 `platform/intel/index.html` — Nexus Intel
- Positioning: "Proof-of-results dashboard — leads, reviews, map views, AI-search visibility."
- Features: lead tracker, CPL/ROAS analytics, brand-in-AI-search monitoring, reports + alerts.
- CTA: "See your dashboard" → maps to existing `analytics-dashboard`.

#### 3.5 `platform/freelance/index.html` — Nexus Freelance
- Positioning: "Secure freelancer design workspace with AI generation and RAG knowledge base."
- Features: Clerk admin-approval auth, HF FLUX.1 image gen, Pinecone RAG, design playground, code export.
- CTA: "Request workspace access".

### Phase 4 — Shared pages (30 min)
1. `platform/about.html` — mission, team principles, entity vs brand rule.
2. `platform/contact.html` — demo form, Cal.com link, email, WhatsApp.
3. `platform/pricing.html` — unified comparison table + per-vertical pricing cards.
4. `platform/case-studies.html` — stub with 3 expected case studies (agency, real estate, F&B) to be filled after first wins.

### Phase 5 — Backend/API integration points (20 min)
1. Each landing CTA posts to a demo lead handler (static form → webhook stub).
2. Add `data-vertical` attributes and UTM params for tracking.
3. Add API route placeholders pointing to the real vertical code paths:
   - Social → `verticals/social` (or current `social-suite-dashboard`)
   - Creative → `verticals/creative/editorial/api/`
   - Intel → `verticals/intel/analytics-dashboard/`
   - Freelance → `verticals/freelance/saas/`
4. Document integration in `platform/README.md`.

### Phase 6 — Verify & deploy (20 min)
1. Local serve: `cd platform && python3 -m http.server 8080`.
2. Check all 9 pages render, nav links work, mobile menu works, forms validate.
3. Run Lighthouse (baseline 90+ performance/accessibility).
4. Deploy to Vercel from `platform/` with `vercel deploy --prod`.
5. Verify clean URLs and security headers.
6. Commit everything with co-authors.

---

## Deliverables

| Deliverable | Location |
|---|---|
| Deleted stale site | `nexus-web/` removed |
| New platform site | `platform/` |
| Shared design system | `platform/assets/css/design-system.css` |
| Shared JS | `platform/assets/js/main.js` |
| Platform home | `platform/index.html` |
| Social landing | `platform/social/index.html` |
| Creative landing | `platform/creative/index.html` |
| Intel landing | `platform/intel/index.html` |
| Freelance landing | `platform/freelance/index.html` |
| About / Contact / Pricing / Case studies | `platform/{about,contact,pricing,case-studies}.html` |
| Vercel config | `platform/vercel.json` |
| README | `platform/README.md` |

---

## Immediate revenue hooks (Logo Ops)

- Primary CTA everywhere: **"Book a free 15-min AI marketing audit"** (from SWARM).
- Social page leads with AED/₹ pricing for Dubai/Kerala SMBs.
- Creative page leads with **"Dead Campaign Resurrection — $99"** POC.
- Pricing page surfaces all four verticals so a prospect can self-select.
- Contact/demo form feeds into the existing lead pipeline (`04-CONTENT-MARKETING/leads-*` or GWS Client Tracker).

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Deleting `nexus-web` loses deployable site temporarily | New `platform/` is built and deployed in the same session. |
| Old PRD references still scattered | Add `platform/README.md` with the correct taxonomy; rebrand sweep follows separately. |
| Vertical backend code not fully migrated yet | Landings link to current real paths (`social-suite-dashboard`, `nexus-creative-editorial`, etc.) and include "Request access" CTAs so sales can start before dashboards are public. |
| Design inconsistency between verticals | Shared `design-system.css` is the single source of truth; only Creative gets a warm editorial variant. |
| User already frustrated by delay | Keep plan concise, execute immediately after approval, avoid further doc sprawl. |

---

## Approval needed

1. Confirm: delete `nexus-web/` entirely and replace with `platform/`.
2. Confirm: use the four-vertical taxonomy (Social / Creative / Intel / Freelance) and remove GRIDERA/NEOFLOW from this site.
3. Confirm: deploy from `platform/` to Vercel on the current branch.

Once approved, I will execute Phase 1 immediately and keep each phase under 30 minutes.
