# NEXUS by Taurus AI — Enterprise Platform Repo Design (PRD)

**Status:** Approved · **Date:** 2026-06-24 · **Branch:** `feat/nexosync-to-nexus-rebrand`
**Owner:** TAURUS AI Corp.
**Operating brand:** NEXUS by Taurus AI
**Canonical source of truth for naming:** `docs/superpowers/specs/2026-06-09-platform-rename-source-of-truth.md`

---

## 1. Executive summary

NEXUS by Taurus AI is the platform product of TAURUS AI CORP — an AI-powered marketing-automation and creative-design ecosystem that sells **four vertical products** to clients, all built on one shared AI core:

- **Nexus Social** — social-media management dashboard ("Social Media Orchestra")
- **Nexus Creative** — AI campaign studio ("Ads & Campaign DevOps")
- **Nexus Intel** — business intelligence ("Business Intelligence")
- **Nexus Freelance** — secure freelancer design workspace

Today the platform lives in a single flat git repo (`Taurus-Ai-Corp/Nexus`) with a numbered portfolio taxonomy (`00-…` → `10-…`) plus several loose top-level folders, an **empty `02-AGENTS/` stub**, **stale npm-workspaces**, and **two separate products vendored in** despite having their own GitHub repos. A brand migration (NeoVibe / NeoSync / BizFlow → NEXUS) is ~70% complete in docs and partly complete in code.

This PRD defines the **target enterprise repo topology** (a hybrid: one Nexus monorepo as source of truth + sibling product repos referenced, not vendored) and a **full six-wave migration plan** to get there. It also specifies the client-facing experience, the six automated pipelines, and the governance/CI/deploy model.

**Decisions locked (2026-06-24):**
1. **Topology — Hybrid:** one `Nexus` monorepo (`core/` + `verticals/*` + `platform/`) + sibling repos (Agency OS, MaterCare, GRIDERA) referenced.
2. **Verticals in scope:** Social, Creative, Intel, Freelance (each gets landing + dashboard + subdomain).
3. **Migration scope:** target architecture + full migration plan (de-vendor, consolidate, fill core).

---

## 2. Background & current-state audit

**Scale:** 10,831 tracked files · 1,951 folders · 1,686 markdown docs · 82 commits · 2 contributors (Taurus AI Corp, Effin Fernandez). Single git repo, no submodules. Branch `feat/nexosync-to-nexus-rebrand`.

**Numbered taxonomy (intended skeleton):**
`00-PRODUCT-PLANNING · 01-STRATEGY · 01-CORE-PLATFORM · 02-AGENTS · 03-CLIENT-MANAGEMENT · 04-CONTENT-MARKETING · 04-PRODUCT-DEPLOYMENT · 05-DATABASES · 06-WORKFLOWS · 07-API-ROUTES · 08-DOCUMENTATION · 09-ASSETS · 10-CONFIG`

**Loose folders outside the taxonomy:** `Nexus _ Platform Devops/`, `SWARM SR Internal Analysis/`, `social-suite-dashboard/`, `taurus-nexus-creative/`, `taurus-agency-os/`, `matercare-ElderCare_SaaS/`, `mater_maria_assets/`, `arcads_alternatives_research/`.

**Vertical maturity (the core finding):**

| Vertical | Landing | Dashboard | Existing code | Status |
|---|---|---|---|---|
| Social | ❌ | ✅ | `social-suite-dashboard/{web,api,nlp}` (React/AntD + FastAPI + NLP) | Operational dashboard; no public landing |
| Creative | ✅ (`nexus.taurusai.io`) | ⚠️ API only | `nexus-creative-editorial/` + `nexus-studio` creative agents | Live site + Stripe + API; studio dashboard to formalize |
| Intel | ❌ | ❌ (unlabeled code exists) | `nexus-backend/analytics-dashboard`, `taurus-analytics-platform`, `Business-Intelligence/` | Ghost vertical — only in marketing copy; promote existing code |
| Freelance | ❌ | ⚠️ skeleton | `neovibe-freelance-saas` skeleton + `nexus-freelance` agent | Mid-built; build from skeleton |

**Three structural problems this PRD resolves:**
1. **`02-AGENTS/` is an empty stub** — one placeholder Dockerfile, git-untracked. Real agents (~7,000 files) are scattered across `nexus-studio/agents/`, `nexus-backend/agents/`, `06-WORKFLOWS/Taurus-AI-Agent-Registry/`. No Nexus-Social/Creative/Intel agent folder exists.
2. **Stale npm-workspaces** — root `package.json` declares `01-CORE-PLATFORM/nexus-frontend` (doesn't exist) and `nexus-studio` (no root package.json); excludes `nexus-backend`. Dev/build scripts broken.
3. **Vendored separate products** — `taurus-agency-os/` and `matercare-ElderCare_SaaS/` each have their own GitHub remotes but are copied into Nexus.

**Where the plans live today (consolidated into this PRD):**

| Plan type | Current location |
|---|---|
| Brand architecture / naming source-of-truth | `docs/superpowers/specs/{2026-05-18-taurus-ai-brand-architecture,2026-06-09-platform-rename-source-of-truth,2026-03-21-neovibe-business-structure-design}.md` |
| Rebrand execution | `docs/superpowers/plans/{2026-05-18-nexosync-to-nexus-rebrand,2026-05-19-master-rename-orchestration,2026-05-18-github-org-cleanup}.md` |
| Master technical architecture | `Nexus _ Platform Devops/ARCHITECTURE.md` (27-service, 3-tier AI-routing spec) |
| Agent integration | `01-CORE-PLATFORM/nexus-studio/AGENT_INTEGRATION_PLAN.md` (duplicated at `nexus-backend/`) |
| Launch / lead-gen | `06-WORKFLOWS/Taurus-AI-Agent-Registry/LAUNCH_STRATEGY_LEADGEN_PLAN.md` |
| Nexus Creative GTM | `SWARM SR Internal Analysis/nexus-creative-editorial/{ENTERPRISE-GTM-PLAN,PRODUCT,META-ADS-CREATIVE-PACK,google-ads-plan}.md` |
| Security / launch readiness | `Nexus _ Platform Devops/{SECURITY_REMEDIATION_PLAN,LAUNCH_CHECKLIST}.md` |

---

## 3. Goals & non-goals

**Goals**
- Establish NEXUS as one enterprise platform product with four shippable verticals, each with its own landing + dashboard + subdomain.
- Replace the flat numbered+loose layout with a `core/` + `verticals/` + `platform/` topology that makes shared code genuinely shared and vertical code genuinely independent.
- Fill the empty agents layer by consolidating scattered agent code into `core/agents/` with vertical tags.
- De-vendor Agency OS and MaterCare into their own repos; reference them from the platform portfolio.
- Finish the NeoVibe/NeoSync/BizFlow → NEXUS rebrand across the tree.
- Fix workspaces/CI so `dev`/`build`/`test`/`lint` work per package.
- Define the client-facing experience and six pipelines so the platform is sellable end-to-end.

**Non-goals (this PRD)**
- Building new client portals (Mater Maria etc. stay under `clients/` unchanged).
- Re-architecting GRIDERA/Comply (separate product line; referenced only).
- Choosing new AI model providers (OpenRouter/Ollama/HF routing stays as-is).
- Pricing/revenue modeling (covered by `01-STRATEGY/product-catalog` and the business-structure spec).

---

## 4. Brand architecture (multi-level portfolio)

```
L0  TAURUS AI Corp.            (corporate entity — legal docs, invoices, NDAs only)
       │
L1  NEXUS by Taurus AI               (platform product → nexus.taurusai.io)
       │
L2  Nexus Social   Nexus Creative   Nexus Intel   Nexus Freelance
    (vertical sub-brands, each own subdomain + landing + dashboard,
     all visually descending from one shared core/design-system)
       │
L3  Sibling products (same corp, SEPARATE repos, referenced not vendored):
    Agency OS · MaterCare · GRIDERA (Comply/Lend/Pay → q-grid.net)
```

**Naming rule (executable):** NeoVibe, NeoSync, BizFlow, GridDB are **retired → NEXUS** (per `2026-06-09-platform-rename-source-of-truth.md`). Surviving brands: NEXUS, GRIDERA, NEOFLOW™, Noverm, Brivera, Crivera, Nebula. A pre-commit/lint rule flags any new `NeoVibe|NeoSync|BizFlow|GridDB` token outside an explicit allowlist.

**Corporate vs operating brand rule:** legal/government docs = "TAURUS AI Corp."; client-facing/marketing/SaaS = "Nexus by Taurus AI". Never mixed.

---

## 5. Target repo topology

```
Taurus-Ai-Corp/                              (GitHub org)
├── Nexus/                                   ← THE platform monorepo (source of truth)
│   ├── platform/                            root brand site → nexus.taurusai.io
│   ├── core/                                shared layers every vertical imports
│   │   ├── agents/                          ← consolidates scattered agent code; fills 02-AGENTS
│   │   ├── db/                              ← was 05-DATABASES (supabase/pgvector/…)
│   │   ├── workflows/                       ← was 06-WORKFLOWS (N8N, agent registry)
│   │   ├── api/                             ← was 07-API-ROUTES (shared REST/event routes)
│   │   ├── design-system/                   shared UI kit + brand tokens
│   │   └── shared-libs/                     @taurus/agent-handoff, handoff schemas, types
│   ├── verticals/
│   │   ├── social/      landing + dashboard → social.nexus.taurusai.io
│   │   ├── creative/    landing + studio    → nexus.taurusai.io (creative)
│   │   ├── intel/       landing + BI dash   → intel.nexus.taurusai.io
│   │   └── freelance/   landing + workspace → freelance.nexus.taurusai.io
│   ├── clients/                            ← was 03-CLIENT-MANAGEMENT
│   ├── marketing/                          ← was 04-CONTENT-MARKETING
│   ├── planning/                           ← was 00-PRODUCT-PLANNING + 01-STRATEGY
│   ├── docs/                               ← was 08-DOCUMENTATION + docs/superpowers/*
│   ├── assets/                             ← was 09-ASSETS
│   ├── config/                             ← was 10-CONFIG + infra/CI
│   ├── package.json
│   ├── pnpm-workspace.yaml
│   └── turbo.json
│
├── agency-os/         own repo (referenced from Nexus, NOT vendored)
├── matercare/         own repo
└── gridera/           own repo  (GRIDERA/Comply/Lend/Pay — q-grid.net)
```

### Current → target mapping

| Today | Tomorrow |
|---|---|
| `01-CORE-PLATFORM/nexus-backend` + `nexus-studio` | split → `core/*` (shared) + `verticals/creative` + `verticals/intel` |
| `02-AGENTS/` (empty stub) | deleted; real agents → `core/agents/` |
| `05-DATABASES/`, `06-WORKFLOWS/`, `07-API-ROUTES/` | `core/db`, `core/workflows`, `core/api` |
| `social-suite-dashboard/` + `Nexus _ Platform Devops/social-suite-dashboard` | `verticals/social` |
| `SWARM SR Internal Analysis/nexus-creative-editorial` + `taurus-nexus-creative` | `verticals/creative` |
| `nexus-backend/analytics-dashboard` + `taurus-analytics-platform` + `Business-Intelligence/` | `verticals/intel` |
| `04-PRODUCT-DEPLOYMENT/neovibe-freelance-saas` + `nexus-freelance` agent | `verticals/freelance` |
| `taurus-agency-os/`, `matercare-ElderCare_SaaS/` | **de-vendored** → sibling repos |
| `03-CLIENT-MANAGEMENT` | `clients/` |
| `00/01/04(content)/08/09/10` | `planning/`, `marketing/`, `docs/`, `assets/`, `config/` |
| `Nexus _ Platform Devops/ARCHITECTURE.md` etc. | `docs/architecture/` |

---

## 6. Shared `core/`

`core/` is what makes "one platform, many verticals" real. Each vertical imports `@nexus/core-*` packages instead of reimplementing.

| Package | Contents | Absorbs from |
|---|---|---|
| `core/agents` | Agent registry + vertical tags (Social/Creative/Intel/Freelance) + master orchestrator + MCP integrations | `nexus-studio/agents/`, `nexus-backend/agents/`, `06-WORKFLOWS/Taurus-AI-Agent-Registry/` |
| `core/db` | Supabase/Postgres+pgvector schemas, migrations, init SQL | `05-DATABASES/` |
| `core/workflows` | N8N workflows, agent registry runtime, hybrid orchestrator | `06-WORKFLOWS/` |
| `core/api` | Shared REST + WebSocket + event routes (`/api/nexus/*`, `/api/agents/orchestrate`) | `07-API-ROUTES/` + `nexus-backend` route surface |
| `core/design-system` | UI kit, brand tokens, components (descends from existing NeoVibe/BizFlow design lounge) | `nexus-studio/NeoVibe_DESIGN_LOUNGE` assets |
| `core/shared-libs` | `@taurus/agent-handoff` schemas, types, audit/metrics middleware | `packages/taurus-agent-handoff` (HEDERA repo) |

**Agents layer:** `core/agents/` is organized by vertical tag plus a `shared/` bucket for cross-vertical agents (SEO, content, analytics, research). The master orchestrator runs the 6-phase execution loop and emits a signed Heiro/Hedera receipt per phase.

---

## 7. Verticals

Each vertical is a self-contained workspace: `landing/` (public site) + `app/` (dashboard/studio) + `api/` (vertical-specific routes) + `agents/` (vertical-specific agents), importing `@nexus/core-*`.

### 7.1 Nexus Social — `verticals/social` → `social.nexus.taurusai.io`
- **What:** Social-media orchestra. Manage Meta Business Suite + Instagram + Nexus campaigns via natural-language commands (NLP intent + entity extraction → endpoint → payload → campaign).
- **Source:** `social-suite-dashboard/{web,api,nlp}` (React/AntD + FastAPI + Node NLP).
- **Surfaces:** operational dashboard (exists) + new marketing landing.
- **Agents:** social_media_manager, twitter_agents, Meta/IG campaign agents.

### 7.2 Nexus Creative — `verticals/creative` → `nexus.taurusai.io` (creative)
- **What:** AI campaign studio. Brief → finished campaign concept (image direction, video, copy, platform plan, deliverables).
- **Source:** `nexus-creative-editorial/` (live Vercel site + serverless API: ai/stripe/veo/imagen/leads/webhook) + `taurus-nexus-creative` CLI + `nexus-studio` creative agents.
- **Surfaces:** marketing landing (exists) + creative studio dashboard (formalize the campaign-pipeline into an authenticated studio).
- **Agents:** vertex_ai_creative, onlook_visual, vibe_marketing, ai_content_generator.
- **Trust:** C2PA provenance tags on AI-generated assets.

### 7.3 Nexus Intel — `verticals/intel` → `intel.nexus.taurusai.io`
- **What:** Business intelligence. Leads, analytics, brand-in-AI-search monitoring, reports, alerts.
- **Source:** promote the **unlabeled** `nexus-backend/analytics-dashboard` (React/TS, Recharts) + `taurus-analytics-platform` (Express + Mongo + Redis) + `Business-Intelligence/` into a real vertical.
- **Surfaces:** marketing landing (new) + BI dashboard (promote existing).
- **Agents:** trend_analyzer, deep_researcher, candidate_analyzer, performance-analytics, market-research.
- **Note:** lowest-effort vertical to launch — the code already exists; this is naming + surfacing work.

### 7.4 Nexus Freelance — `verticals/freelance` → `freelance.nexus.taurusai.io`
- **What:** Secure freelancer design workspace. Clerk admin-approval auth, AI image/video generation (HF FLUX.1), Pinecone RAG knowledge base, interactive design playground, code export.
- **Source:** `04-PRODUCT-DEPLOYMENT/neovibe-freelance-saas` skeleton + `nexus-freelance` agent (4 sub-agents: design, image-gen, knowledge-retrieval, code-export).
- **Surfaces:** marketing landing (new) + workspace dashboard (build from skeleton).
- **Agents:** design, image-generator, knowledge-retrieval, code-exporter.

---

## 8. Client-facing attributes & experience

### 8.1 Client-facing attributes

| Attribute | Description |
|---|---|
| One brand, four products | All verticals share `core/design-system` — same colors, fonts, logo family. Adding a second product feels like one platform. |
| Landing page per product | `nexus.taurusai.io`, `social.`, `intel.`, `freelance.nexus.taurusai.io` — each with product explainer + Start CTA. |
| Dashboard per product | The authenticated app the client works in (Creative studio, Social command center, Intel BI, Freelance workspace). |
| Sign-up + billing | Clerk auth → Stripe checkout → workspace. (Creative already wires Stripe: "Starter Campaign", "Studio".) |
| Private client workspace | On becoming a client, a Google Drive folder auto-creates with 5 subfolders (Contracts, Project Docs, Assets, Reports, Proposals) via the GWS Bridge. |
| Human BDM | A Business Development Manager is assigned and named in the workspace (e.g. Praveen Varkey — Kerala market). |
| Provenance & trust | C2PA "made with AI" tags on generated media; "TAURUS AI Corp." on legal docs. |
| Audit trail | Every agent action signed + logged immutably on Heiro/Hedera; client can prove what happened. |

### 8.2 Client journey (PetPawSphere, Dubai pet brand)

1. **Discovery** — sees a Nexus Social ad → lands on `nexus.taurusai.io`.
2. **Pick product** — chooses Creative (AI Campaign Studio) → Start.
3. **Sign up + pay** — Clerk → Stripe ("Starter Campaign") → workspace created.
4. **Onboarding** — Drive folder spins up; BDM assigned; kickoff brief collected.
5. **Use** — types brief: *"9:16 video ad for our UAE dog-food launch, luxury tone"* → Creative agents generate image direction, video (Veo/WAN), captions, posting plan.
6. **Review + approve** — sees assets, approves/requests changes; approved assets get C2PA tags.
7. **Distribute** — one click → Meta/Google Ads via the Social + Intel pipelines.
8. **Measure** — next morning opens Intel → leads, CPL, conversions, "is PetPawSphere in AI search?"
9. **Upsell** — BDM sees spend on Creative+Social but not Intel → proposes Intel; logged in Proposals folder.

---

## 9. Pipelines (six automated conveyor belts)

A pipeline = input → automated steps → output. The client only ever touches the top of each belt.

| Pipeline | Input → Output | Plain terms |
|---|---|---|
| **Creative** | brief → generated images/video/copy → approved campaign | "Make me an ad" → finished, ready-to-post ad |
| **Social** | natural-language command → Meta/IG campaign → scheduled posts → engagement | "Post a reel Friday" → posted + tracked |
| **Intel** | data sources (ads, web, AI-search) → analytics dashboard → reports + alerts | Raw numbers → a dashboard that tells you what to do next |
| **Lead** | web scrape → CRM → personalized outreach | Find prospects → email them (`04-CONTENT-MARKETING/leads-*` packs) |
| **Orchestration** | task → master orchestrator picks agents → 6-phase handoff → signed receipt | The brain deciding which AI worker does which step |
| **Deploy** | code push → lint → test → build → deploy → verify | Engineer ships → goes live safely on the product's subdomain |

**Orchestration detail:** master orchestrator runs a 6-phase execution loop; agents hand off via `@taurus/agent-handoff` typed schemas (14 contracts); each phase emits a Heiro/Hedera-signed receipt for audit. This is the NARO (agentic RAG orchestrator) model already documented in `03-CLIENT-MANAGEMENT/.../PLAN-Hy3-Agentic-Orchestration.md`.

**Error handling (client-visible):** pipeline failures surface as in-dashboard actionable cards ("Creative generation failed — retry / contact BDM"), never raw stack traces. Backend retries with exponential backoff; unrecoverable failures escalate to the assigned BDM and log a signed incident record.

---

## 10. Migration plan (six waves)

Wave order is deliberate — each wave leaves the repo in a working state.

### Wave 1 — De-vendor separate products
- Verify sibling repos exist on GitHub (`Taurus-Ai-Corp/agency-os`, `Taurus-Ai-Corp/matercare-homes`).
- `git rm -r taurus-agency-os/ matercare-ElderCare_SaaS/` from Nexus.
- Add `docs/portfolio.md` referencing sibling repos + their deploy URLs.
- Mater Maria client portal stays under `clients/` (it's a client deliverable, not a product).

### Wave 2 — Carve `core/`
- Create `core/{agents,db,workflows,api,design-system,shared-libs}`.
- `git mv 05-DATABASES core/db`; `git mv 06-WORKFLOWS core/workflows`; `git mv 07-API-ROUTES core/api`.
- Consolidate `nexus-studio/agents/` + `nexus-backend/agents/` + `06-WORKFLOWS/Taurus-AI-Agent-Registry/` into `core/agents/` with vertical tags.
- Delete the `02-AGENTS/` stub.

### Wave 3 — Stand up verticals
- Create `verticals/{social,creative,intel,freelance}` each with `landing/ app/ api/ agents/`.
- `git mv social-suite-dashboard verticals/social` (+ reconcile `Nexus _ Platform Devops/social-suite-dashboard`).
- `git mv "SWARM SR Internal Analysis/nexus-creative-editorial" verticals/creative`; fold `taurus-nexus-creative` CLI in.
- Promote `nexus-backend/analytics-dashboard` + `taurus-analytics-platform` + `Business-Intelligence/` → `verticals/intel`.
- Move `neovibe-freelance-saas` skeleton → `verticals/freelance`.

### Wave 4 — Relocate support layers
- `git mv 03-CLIENT-MANAGEMENT clients`; `git mv 04-CONTENT-MARKETING marketing`; `00-PRODUCT-PLANNING`+`01-STRATEGY` → `planning`; `08-DOCUMENTATION` → `docs`; `09-ASSETS` → `assets`; `10-CONFIG` → `config`.
- Fold `Nexus _ Platform Devops/{ARCHITECTURE,SECURITY_REMEDIATION_PLAN,LAUNCH_CHECKLIST}.md` → `docs/architecture/`.
- Resolve `SWARM SR Internal Analysis/` residue + `arcads_alternatives_research/` → `marketing/research/`.

### Wave 5 — Fix workspaces & CI
- Replace stale npm-workspaces with `pnpm-workspace.yaml` + `turbo.json` covering `core/*` + `verticals/*` + `platform`.
- Root `package.json` scripts: `dev`, `build`, `test`, `lint` per package via Turbo task hashing.
- Per-vertical Vercel project + `vercel.json` at each vertical root.
- GitHub Actions matrix: lint/test/build per changed package; `security-auditor` + `docker-compose-validator` agents on PRs.

### Wave 6 — Rebrand sweep + surface gaps
- Finish NeoVibe/NeoSync/BizFlow → NEXUS renames across the tree (per `master-rename-orchestration` wave plan).
- Add brand-rule lint/pre-commit check.
- Build missing surfaces: Social landing, Creative studio dashboard, Intel landing+dashboard, Freelance landing.
- Wire subdomains in Vercel: `social.`, `intel.`, `freelance.nexus.taurusai.io`.

---

## 11. Governance, workspaces, CI/CD, deploy

- **Workspaces:** pnpm + Turborepo. `core/*` and `verticals/*` are packages; `@nexus/core-*` are importable shared packages.
- **Deploy:** Vercel per vertical (own project + subdomain, `vercel.json` at vertical root); `core/*` backend services on Oracle Cloud Free Tier (Hyperswitch/Lago/n8n); Heiro/Hedera for immutable audit; BSV for tamper-proof docs.
- **CI:** GitHub Actions matrix — lint/test/build per changed package via Turbo task hashing; `security-auditor` + `docker-compose-validator` agents on PRs.
- **Brand-rule enforcement:** pre-commit/lint check flagging `NeoVibe|NeoSync|BizFlow|GridDB` outside an allowlist.
- **Branch strategy:** `main` → PR → merge; vertical feature branches; client sites on their own branches (e.g. `feat/nexosync-to-nexus-rebrand`).
- **Stack:** FastAPI (Python 3.12) + Next.js 16/React 19 + Vite + Tailwind 4; Supabase/Postgres+pgvector + Redis; OpenRouter/Ollama/HF 3-tier AI routing; Heiro (`@hiero-ledger/sdk`); `@taurus/agent-handoff`.

---

## 12. Risks & open questions

| Risk | Mitigation |
|---|---|
| De-vendoring loses in-flight changes in vendored copies | Verify sibling repos are current before `git rm`; diff vendored copy vs remote first |
| Agent consolidation (~7,000 files) breaks imports | Wave 2 behind a feature branch; run orchestrator tests after move; keep `AGENT_INTEGRATION_PLAN` as the registry checklist |
| Stale workspaces hide breakage until Wave 5 | Wave 5 immediately follows Waves 2-4; CI gate catches import errors |
| Rebrand sweep touches client portals | Allowlist client-facing legacy names; client portals under `clients/` are out of scope for rename |
| Intel "promotion" may reveal the analytics code is incomplete | Treat Intel as Phase-gated: landing first, dashboard behind a feature flag until hardened |

**Open questions (to resolve before Wave 6):**
- Confirm `Taurus-Ai-Corp/agency-os` GitHub repo exists (matercare confirmed at `matercare-homes.git`).
- Decide whether Nexus Freelance is a paid vertical or a free internal tool.
- Confirm subdomain scheme (`social.nexus.taurusai.io` vs `nexus.taurusai.io/social`).

---

## 13. References

- `docs/superpowers/specs/2026-06-09-platform-rename-source-of-truth.md` — canonical naming
- `docs/superpowers/specs/2026-05-18-taurus-ai-brand-architecture.md` — brand architecture
- `docs/superpowers/specs/2026-03-21-neovibe-business-structure-design.md` — business structure
- `docs/superpowers/plans/2026-05-19-master-rename-orchestration.md` — rebrand waves
- `Nexus _ Platform Devops/ARCHITECTURE.md` — master technical architecture
- `01-CORE-PLATFORM/nexus-studio/AGENT_INTEGRATION_PLAN.md` — agent integration
- `06-WORKFLOWS/Taurus-AI-Agent-Registry/LAUNCH_STRATEGY_LEADGEN_PLAN.md` — launch plan
- `SWARM SR Internal Analysis/nexus-creative-editorial/PRODUCT.md` — Creative product brief
- `GEMINI_CONTINUATION_PROMPT.md`, `README.md` — platform overview + phase roadmap

---

*This PRD is the source of truth for the Nexus enterprise repo. Implementation follows via the writing-plans skill; no code/migration is executed until the Wave plan is approved.*