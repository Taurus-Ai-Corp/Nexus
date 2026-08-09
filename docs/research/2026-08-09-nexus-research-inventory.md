# NEXUS research inventory + synthesis

**Date:** 2026-08-09 · **Scope:** NEXUS platform only. GRIDERA / Q-Grid / Comply / SENTINEL /
OBIDIEN / DEFQUAN / bio-foundry are owned elsewhere and excluded.

**Date warning:** a taxonomy find-and-replace swept the repo on 2026-08-08/09 and rewrote mtimes
across dozens of files. **Every date below is the date stated inside the document**, not the
filesystem timestamp. Sorting by mtime produces a wrong ranking.

---

## Part 1 — Synthesis

### 1.1 The single most important finding

**The July critique was right, and the reason is configuration, not code.**

`08-DOCUMENTATION/Nexus-Platform-Brutal-Critique-2026-07-10.md` concluded Nexus was *"a marketing-
materials company masquerading as a SaaS product"* — payments broken, generation APIs dead. The
plan required checking that claim rather than repeating it. Checked:

**The code is real.** Nine API handlers, 124–389 lines each, env-driven, real outbound `fetch`
calls, essentially no stubs or TODOs. `stripe.js` correctly reads six price IDs from environment.
This is not scaffolding.

**The environment is empty.** The `nexus-platform` Vercel project has **6 environment variables,
all SMTP** (`SMTP_HOST/PORT/USER/PASS`, `EMAIL_FROM`, `LEAD_RECIPIENT_EMAIL`).

| Handler | Env vars needed | Configured? | Consequence |
|---|---|---|---|
| `contact.js` | SMTP ×7 | ✅ yes | contact form works |
| `stripe.js` | `STRIPE_SECRET_KEY` + 6 price IDs | ❌ **none** | **checkout cannot start** |
| `imagen.js` | 8 | ❌ none | image generation dead |
| `ai.js`, `neural.js`, `extras.js`, `campaign-pipeline.js`, `leads.js`, `webhook.js` | 1–2 each | ❌ none | dead |

So the diagnosis sharpens usefully: **Nexus is one credentials-configuration pass away from
having a working payment and generation layer.** That is a materially different problem from
"the product doesn't exist", and much cheaper to fix.

Related: the Stripe `success_url` 404 fixed in `f5c3c5b` was real but moot — checkout could
never have reached it without `STRIPE_SECRET_KEY`.

### 1.2 The canonical chain

Read in this order; everything else is superseded.

1. `~/.ai-context/taxonomy/TAXONOMY.toml` v1.1.0 — machine-readable source of truth.
2. `docs/plans/2026-08-09-nexus-taxonomy-and-entity-change.md` — current architecture + entity.
3. `docs/design/2026-08-02-taurus-design-system-v2-nexus-slice.md` — visual identity.
4. `docs/plans/2026-08-09-vercel-project-audit.md` — deployment reality.

Superseded: the 4-vertical enterprise PRD (2026-06-24), the website rebuild plan (2026-06-25,
banner added), the brand architecture spec (2026-05-18, still says Dubai).

### 1.3 Design system — resolved

**Nexus emitter is `#4F7DF3` on void `#04060C`.** Full reasoning in
`docs/design/2026-08-09-nexus-design-system-conflict.md`. Short version: the competing violet
`#7c5cff` comes from a plan that was **never executed** (none of its deliverables exist), and the
third candidate is a Mater Maria client system mis-named "nexus-design-system" that hijacks the
trigger phrase. Adoption cost is measured in `2026-08-09-nexus-token-gap-analysis.md` — it is a
redesign, not a token swap.

### 1.4 NotebookLM is empty for Nexus

52 notebooks; the 5 most Nexus-sounding titles yielded **nothing about the platform** — one name
collision ("NEXUS_ A Blueprint for Local AI Voice Assistant" is DecentraVoice), two Q-GRID
strategy corpora, one Q-GRID brand corpus, one general design-trend set. Detail in
`notebooks/2026-08-09-notebooklm-nexus-harvest.md`. **Recommendation: stop looking there.**

### 1.5 Unreconciled product decision — Nexus Vector

`docs/pricing-intel/nexus-vector-keyword-matrix-2026-07-22.md` (34 KB) plus three turbovec
analyses propose **Nexus Vector**, a managed private vector-search API, with competitor pricing
against Pinecone/Weaviate/Qdrant/Chroma and a full ad-group → landing-page structure.

**It appears in no version of the taxonomy** — not the 4-vertical PRD, not the 7-vertical plan,
not `TAXONOMY.toml`. Either a real sixth product line was researched and dropped without record,
or substantial keyword/pricing work was done for something never approved. **Needs a decision.**

### 1.6 Contradictions still open

- **Flow.** `TAXONOMY.toml` says roadmap, "not in site nav." Production ships it as one of five
  public products, in the hero and nav dropdown. Blocks the pending rebase.
- **Campaign vs Creative.** `/campaigns/` and `/creative/` both render
  `<title>Nexus Creative — AI Campaign Studio</title>`. Two nav entries, one product.
- **Two "Nexus design systems"** in agent-space — see 1.3.

---

## Part 2 — Inventory

`C` = content date. **Bold** = current. Everything not listed as current is superseded or
reference-only.

### Design & brand

| Artifact | C | Summary | Status |
|---|---|---|---|
| **`docs/design/source/TAURUS-AI-Design-System-v2.dc.html`** | 2026-08-02 | DTCG 2025.10 multi-brand token architecture; Nexus = PLATFORM 02 | **current** |
| **`docs/design/2026-08-02-…-nexus-slice.md`** | 2026-08-09 | Nexus extract of the above | **current** |
| **`docs/design/2026-08-09-nexus-token-gap-analysis.md`** | 2026-08-09 | 4 accents → 1 emitter, 7 fonts → 2 | **current** |
| **`docs/design/2026-08-09-nexus-design-system-conflict.md`** | 2026-08-09 | three-way resolution | **current** |
| `docs/design/source/TAURUS-AI-Brand-Kit.dc.html` | 2026-08-02 | corporate brand kit companion | reference |
| `~/.claude/plans/sprightly-puzzling-blanket.md` Rev A | 2026-08-03 | violet `#7c5cff`; never executed; names retired FZCO | **superseded** |
| `~/.claude/skills/nexus-design-system/` | 2026-05-19 | Mater Maria palette under a Nexus name | **mis-named — rename proposed** |
| `platform/assets/css/design-system.css` | 2026-08-08 | shipping tokens; matches no spec cleanly | shipping, non-conformant |
| `SWARM SR Internal Analysis/landing-page/DESIGN.md` | 2026-06-15 | 3D scroll landing spec, Geist 72px | superseded |

### Architecture & strategy

| Artifact | C | Summary | Status |
|---|---|---|---|
| **`~/.ai-context/taxonomy/TAXONOMY.toml`** v1.1.0 | 2026-08-09 | source of truth | **current** |
| **`docs/plans/2026-08-09-nexus-taxonomy-and-entity-change.md`** | 2026-08-09 | entity → Canada; 4→7 verticals; do-not-deploy warning | **current** |
| **`docs/plans/2026-08-09-vercel-project-audit.md`** | 2026-08-09 | 69 projects, 13 live, 2 P1 defects | **current** |
| `docs/superpowers/plans/2026-07-28-supabase-credit-metering.md` | 2026-07-28 | credit metering / billing (27 KB) | active, unbuilt |
| `PRD-CONSOLIDATION-PLAN.md` | 2026-07-24 | one repo → one project → 5 verticals; "DO NOT EXECUTE" | partly overtaken |
| `NEXUS_PLATFORM_MARKETING_APPROACH_DISCOVERY.md` | 2026-07-24 | B2B GTM vs $1.7M Y1 target | active |
| `NEXUS_CAMPAIGN_BIBLE_INTEGRATION.md` | 2026-07-24 | per-vertical ad briefs, $59 vs $127 CPL | active |
| `08-DOCUMENTATION/Nexus-Platform-Brutal-Critique-2026-07-10.md` | 2026-07-10 | see §1.1 — cause now identified | **still substantially true** |
| `08-DOCUMENTATION/Nexus-Novel-Pipeline-Architecture-2026-07-10.md` | 2026-07-10 | proposed fix for the above | unbuilt |
| `docs/superpowers/specs/2026-06-24-nexus-enterprise-repo-design.md` | 2026-06-24 | 4-vertical PRD, largest single spec | **superseded** |
| `docs/plans/2026-06-25-nexus-platform-website-rebuild.md` | 2026-06-25 | carries superseded banner | **superseded** |
| `docs/superpowers/specs/2026-05-18-taurus-ai-brand-architecture.md` | 2026-05-18 | still places Nexus under Dubai | **stale** |

### Research & competitive intel

| Artifact | C | Summary | Status |
|---|---|---|---|
| `docs/pricing-intel/nexus-vector-keyword-matrix-2026-07-22.md` | 2026-07-22 | Nexus Vector keyword + pricing matrix | **unreconciled — §1.5** |
| `SWARM SR Internal Analysis/2026-07-22-turbovec/*` | 2026-07-22 | 3 docs behind Nexus Vector | unreconciled |
| `docs/pricing-intel/nexus-5-product-competitive-intel-2026-07-18.md` | 2026-07-18 | zero-fabrication intel; recorded nexus.taurusai.io NXDOMAIN | reference |
| `docs/pricing-intel/wave1-fable-verify-2026-07-18.md` | 2026-07-18 | verification pass on the above | reference |
| `docs/pricing-intel/deploy-verification-2026-07-18.md` | — | **0 bytes** — reads as done, is not | **empty stub** |
| `SWARM SR Internal Analysis/01-SWARM-SR-REVENUE-SYNTHESIS.md` | 2026-06-15 | AED/₹ pricing tiers, Dubai/Kerala SMB thesis | still drives site pricing |
| `~/Downloads/Nexus {landing,Pricing,Booking Method,Real estate}.pdf` + `Real outcomes…` | 2026-07-12 | reference PDFs the critique measures against | reference |

### NotebookLM

| ID | Title | C | Verdict |
|---|---|---|---|
| `8bdca22c` | NEXUS_ A Blueprint for Local AI Voice Assistant | 2026-03-12 | ❌ name collision (DecentraVoice) |
| `5ff0b3dd` | TAURUS AI — Brand Design System | 2026-04-19 | ⚠️ corporate/GRIDERA lineage only |
| `bb76efa6` | [NeoVibe] SuperDesign and Memories AI | 2026-04-29 | ⚠️ design trends; anti-grid contradicts v2 §05 | <!-- brand-allow -->
| `969c126c` | TAURUS AI STRATEGIC INTELLIGENCE | 2026-08-08 | ❌ Q-GRID |
| `974d4cab` | LinkedIn GTM Playbook | 2026-08-08 | ❌ Q-GRID |

### Confirmed absent

Searched and empty, so they need not be searched again: `TAURUS-LOCAL-WORKSPACE` (no recent Nexus
material), `HEDERA` (GRIDERA only — except `social-media-orchestra/`, the future Nexus Orchestra
codebase), `Desktop/SOCIAL MEDIA ORCHESTRA/` (active but producing GRIDERA GTM),
`~/.claude/memory/` (empty), `.notebooklm*` dirs (auth/profile state only).

---

## Recommended next decisions

1. **Set the missing Vercel env vars** (§1.1). Highest value-to-effort ratio available — it is
   the difference between a brochure and a product.
2. **Rule on Flow** — public product or roadmap? Blocks the page rebase.
3. **Rule on Nexus Vector** (§1.5) — real product line, or archive the research?
4. **Approve the skill rename** so "Nexus design system" stops resolving to Mater Maria.
5. **Then** decide how far to take Design System v2 adoption.
