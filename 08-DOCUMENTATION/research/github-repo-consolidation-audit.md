# GitHub Org Consolidation Audit — Taurus-Ai-Corp

**Date:** 2026-08-24
**Scope:** 81 repos in `Taurus-Ai-Corp` + 9 repos under the personal account `Taas-ai` (89 rows; `matercare-homes` exists in both).
**Status:** READ-ONLY evidence pass. Nothing was deleted, archived, renamed, or modified. Every retirement call below is a *recommendation* for the owner.

**Evidence labelling used throughout:**
- **[V]** = verified by reading the git tree / file contents / byte-level SHA comparison.
- **[I]** = inferred from repo description or metadata only, not opened.

---

## 0. Headline findings

1. **`Nexus` is confirmed as the canonical repo.** [V] No better base exists.
2. **`taurus-neovibe-creative` is not what its name says.** [V] Its description reads "NeoVibe™ — AI-powered marketing automation & content generation." Its actual content is `@taurus-ai/dev-config` — an npm CLI that installs Claude Code / OpenCode agents and hooks. The *contents* are already correctly branded "Nexus Dev Config"; only the repo name and description carry the dead brand. <!-- brand-allow: quotes the real repo name / real file docstring as an audit finding -->
3. **Almost nothing would be lost by retirement — but not for the reason it looks like.** [V] The valuable content of `nexus-creative-editorial` and `taurus-neovibe-creative` does exist on this machine — and is **untracked**. See §5, which is the most important section of this report.
4. **One live Stripe webhook secret and ~15 live third-party API credentials are committed to org repos.** [V] These need rotation *regardless of* whether the repos are retired. See §6.
5. **34 repos are safe to retire**, 21 belong to GRIDERA, 16 to other product lines, 8 are client work, 6 need a decision.

### Bucket counts

| Bucket | Count |
|---|---|
| CANONICAL | 1 |
| MERGE | 3 |
| UNCLEAR | 6 |
| DEAD (safe to retire) | 34 |
| CLIENT (do not touch) | 8 |
| GRIDERA (do not touch) | 21 |
| OTHER-PRODUCT (do not touch) | 16 |

> **Bucket deviation, flagged deliberately.** The brief offered `GRIDERA` as the "separate product line, leave alone" bucket. Filing the SENTINEL / Bio-Foundry repos there would violate the taxonomy's explicit rule that SENTINEL and GRIDERA must never be conflated ("The old 'GRIDERA SENTINEL / Giskard' AI-audit definition is DEAD"). Those repos, plus the upstream Hiero forks and the corporate-site repos, are filed under **OTHER-PRODUCT**. Operationally it means the same thing: leave alone.

---

## 1. Is `Nexus` the right canonical repo?

**Yes. [V]** Three independent confirmations:

| Check | Result |
|---|---|
| Local working copy remote | `https://github.com/Taurus-Ai-Corp/Nexus.git` |
| Vercel `nexus-platform` production aliases | `nexus.taurusai.io` + 3 `*.vercel.app` aliases |
| Vercel prod deploy provenance | `gitCommitSha 555e0c5d8c29a1efb726f426dc2e57de2f3ecc3f`, ref `feat/unify-nexus-creative-campaigns` — **resolves in `Taurus-Ai-Corp/Nexus`** via `gh api repos/Taurus-Ai-Corp/Nexus/commits/555e0c5…` |

Two caveats worth recording:

- The Vercel project has **`link: null`** — there is no Git integration. Deploys are CLI deploys, and the last one carried **`gitDirty: 1`**. This is exactly the drift the repo's own `platform/tests/deploy-safety.test.js` was written to catch. `git log` is not a record of what is live.
- **No competing base exists.** `neovibe-platform` is the only other repo with the same monorepo shape, and it is a **strict git ancestor** — `git merge-base --is-ancestor 4724811c901a0ef5a20430345618b685ce3a38f8 HEAD` returns true. [V] It is behind, not parallel.

---

## 2. Full classification table

| Repo | Owner | Bucket | Last push | Size | Vis | Reason |
|---|---|---|---|---|---|---|
| `Nexus` | Taurus-Ai-Corp | **CANONICAL** | 2026-08-25 | 1560.9 MB | public | Live NEXUS platform repo. Verified: local NEXUS-CORE remote = this repo; Vercel `nexus-platform` prod deploy sha 555e0c5 resolves in this repo. |
| `nexus-creative-editorial` | Taurus-Ai-Corp | **MERGE** | 2026-06-18 | 36.5 MB | private | Direct ancestor of `platform/`. prompt-bible.mjs, campaign-pipeline.js, petpawsphere campaign all byte-identical to committed platform/ files. Residue = GTM docs + C2PA + Stripe metering scripts. HOLDS A LIVE STRIPE WEBHOOK SECRET. |
| `taurus-neovibe-creative` | Taurus-Ai-Corp | **MERGE** | 2026-07-06 | 273 KB | private | MISLEADING NAME/DESCRIPTION. Content is `@taurus-ai/dev-config` ("Nexus Dev Config") npm CLI - already correctly branded internally. assets/ (70 files) and docs/licensing/ (7 files) byte-identical to local 09-ASSETS/assets + 08-DOCUMENTATION/legal/licensing. Only src/ TS CLI is unique. |
| `social-media-orchestra` | Taurus-Ai-Corp | **MERGE** | 2026-07-13 | 175 KB | private | Real CrewAI multi-agent backend (conductor/content/examiner/research crews), RAG pipeline, OSINT+scraper+platform-adapter tools, MCP server. Natural Nexus Social backend. Checked out and ACTIVE at HEDERA/social-media-orchestra (pending/ queue dated 2026-08-24). Carries ORCA dead-brand in frontend/components/orca/. |
| `gemini-integration` | Taurus-Ai-Corp | **UNCLEAR** | 2026-02-13 | 19.0 MB | private | 19MB GenMedia/MCP bridge (claude-genmedia-bridge.py, genmedia_tools.py, mcp-servers/, orchestrator/). Need: is this superseded by the 6 GenMedia Go MCP servers in the current stack? |
| `claude-skills` | Taurus-Ai-Corp | **UNCLEAR** | 2026-02-13 | 8.8 MB | private | 9MB, two dirs (dev-browser, gpt-runner). Need: are these superseded by the ~60 skills now in ~/.claude/skills/? |
| `nexus-local` | Taurus-Ai-Corp | **UNCLEAR** | 2026-03-22 | 461 KB | private | Source of truth for NEXUS Voice Assistant (backend/src 33 files, frontend, hf-space, .planning/phases, 5 CI workflows). Not part of the nexus.taurusai.io site. Need: is the voice assistant still a product line? Not in the 5-SKU taxonomy. |
| `hedera-orchestrator-private` | Taurus-Ai-Corp | **UNCLEAR** | 2026-02-13 | 210 KB | private | CLAUDE.md lists HEDERA/hedera-orchestrator as Foundation-stage. Need: relationship between this private repo and the HEDERA working copy. |
| `strategic-intelligence` | Taurus-Ai-Corp | **UNCLEAR** | 2026-02-19 | 184 KB | private | 184KB analyses/geo-verticals/source-docs, self-described as auto-referenced for investor due diligence. Need: still cited by any live process? |
| `multi-agent-pipeline` | Taurus-Ai-Corp | **UNCLEAR** | 2026-02-13 | 57 KB | private | 57KB DAG pipeline + roast_bot.py + recon.py. CLAUDE.md lists HEDERA/multi_agent_pipeline as Built & Tested. Need: is the org repo or the HEDERA working copy authoritative? |
| `neovibe-platform` | Taurus-Ai-Corp | **DEAD** | 2026-05-08 | 881.7 MB | private | VERIFIED strict git ancestor of NEXUS-CORE HEAD (`git merge-base --is-ancestor 4724811 HEAD` = true). Same numbered-directory monorepo, pre-rename. Nothing unique. HOLDS ~15 LIVE CREDENTIALS. |
| `documentation` | Taas-ai | **DEAD** | 2025-10-22 | 174.7 MB | public | Fork of upstream Nextcloud documentation (178MB). Unrelated to any product. |
| `taurus-editions-2026-static` | Taurus-Ai-Corp | **DEAD** | 2026-08-04 | 147.8 MB | private | Byte-for-byte size duplicate (151353KB) of public taurus-editions-2026, same asset filenames. Redundant copy. |
| `Taurusai.io` | Taurus-Ai-Corp | **DEAD** | 2026-03-19 | 79.2 MB | private | Superseded by taurus-ai-corp-website. README still says "parent company of Q-GRID" (banned brand). Contains 6 code hits for the BLOCKED taas-ai.com domain. |
| `opsflow-taurusai` | Taurus-Ai-Corp | **DEAD** | 2026-02-13 | 65.3 MB | private | Taxonomy: DORMANT concept, one commit 2026-02-13, @taurus/opsflow never published, not in the sellable-products list. Content is pitch decks + PRD markdown, not code. |
| `bizflow` | Taurus-Ai-Corp | **DEAD** | 2026-02-13 | 9.0 MB | private | Dead brand (BizFlow -> OpsFlow, and OpsFlow itself is dormant). Next.js/Prisma app, one push 2026-02-13. |
| `gridera-orchestration-engine` | Taurus-Ai-Corp | **DEAD** | 2026-04-14 | 1.0 MB | private / ARCHIVED | Already archived; superseded by the GRIDERA monorepo. |
| `innovative-ideas-docs` | Taurus-Ai-Corp | **DEAD** | 2026-02-14 | 282 KB | private / ARCHIVED | Already archived. 282KB docs. |
| `agency-os` | Taurus-Ai-Corp | **DEAD** | 2026-06-25 | 103 KB | private | 53 blobs, single push 2026-06-25, "sibling product" with no taxonomy entry. Superseded by Nexus Creative/Nexus Flow. |
| `multi-ai-devops` | Taurus-Ai-Corp | **DEAD** | 2026-02-13 | 53 KB | private / ARCHIVED | Already archived. 53KB. |
| `taurus-bizflow-competitive-intelligence` | Taurus-Ai-Corp | **DEAD** | 2025-12-05 | 45 KB | private | Dead brand. 45KB stub. Nexus Intel is the live surface. |
| `taurus-assetgrid-demo-portal` | Taurus-Ai-Corp | **DEAD** | 2025-12-05 | 39 KB | private | AssetGrid explicitly demoted in taxonomy (DECISION D4, STALE_DOC_AUDIT_2026-07-22: "AssetGrid doesn't exist"). 39KB stub. |
| `taurus-bizflow-ai` | Taurus-Ai-Corp | **DEAD** | 2025-12-05 | 38 KB | private | Dead brand. Description mislabels it GRIDERA|Flow; taxonomy has no such product. 38KB stub. |
| `demo-repository` | Taurus-Ai-Corp | **DEAD** | 2025-12-05 | 35 KB | private | 35KB sample/pattern repo. |
| `taurus-oriongrid-rwa` | Taurus-Ai-Corp | **DEAD** | 2025-12-05 | 34 KB | private | OrionGrid explicitly demoted (concept only, not in any codebase). 34KB stub. |
| `huggingface-spaces` | Taurus-Ai-Corp | **DEAD** | 2026-02-14 | 30 KB | private / ARCHIVED | Already archived. 30KB config. |
| `ml-pipeline` | Taurus-Ai-Corp | **DEAD** | 2026-02-14 | 23 KB | private / ARCHIVED | Already archived. 23KB. |
| `gridera-battlecard-demo` | Taurus-Ai-Corp | **DEAD** | 2026-03-04 | 9 KB | private | 9KB demo stub. |
| `quantum-readiness-scanner` | Taurus-Ai-Corp | **DEAD** | 2026-03-22 | 8 KB | public / ARCHIVED | Already archived; superseded by gridera-scan-cli + GRIDERA monorepo. |
| `Taas.ai` | Taas-ai | **DEAD** | 2026-06-18 | 7 KB | public | Built on the BLOCKED taas-ai.com domain. Content is LICENSE + README + a Taas.ai-main.zip blob. |
| `hedera-quantum-ecosystem` | Taurus-Ai-Corp | **DEAD** | 2026-06-25 | 5 KB | private | 5KB demo stub. |
| `quantum-infrastructure-demo` | Taurus-Ai-Corp | **DEAD** | 2026-06-25 | 5 KB | private | 5KB demo stub. |
| `Abliterated-Colab` | Taurus-Ai-Corp | **DEAD** | 2026-06-04 | 5 KB | private | 5KB Colab scratch, unrelated to any product line. |
| `gridera-5-platforms-demo` | Taurus-Ai-Corp | **DEAD** | 2026-03-04 | 5 KB | private | 5KB demo stub. Platform count is wrong vs current taxonomy. |
| `automation-empire-demo` | Taurus-Ai-Corp | **DEAD** | 2026-03-04 | 5 KB | private | 5KB demo stub, 2026-03-04, "AI Automation Empire" is the retired org framing CLAUDE.md flags as stale. |
| `rwa-regulatory-map-demo` | Taurus-Ai-Corp | **DEAD** | 2026-03-04 | 4 KB | private | 4KB demo stub. |
| `NEXUS-LOCAL-VOICE-ASSISTANT` | Taurus-Ai-Corp | **DEAD** | 2026-03-22 | 1 KB | private | Self-declared orphan: its own README says "This repo is an orphan. The source of truth is nexus-local." Single file (README.md). |
| `fraud-detection-demo-private` | Taurus-Ai-Corp | **DEAD** | 2026-03-22 | 1 KB | private | 1KB HuggingFace demo stub; superseded by quantum-rupee-fraud-detection. |
| `OBIDIEN` | Taurus-Ai-Corp | **DEAD** | 2026-08-11 | empty | private | EMPTY repo (git tree returns 409 Git Repository is empty). Real OBIDIEN work lives at HEDERA/OBIDIEN on disk. |
| `gridera-conference` | Taurus-Ai-Corp | **DEAD** | 2026-08-10 | empty | private | EMPTY repo (409). Placeholder only. |
| `global-bio-foundry-public` | Taurus-Ai-Corp | **DEAD** | 2026-03-04 | empty | private | EMPTY repo (409). |
| `LENDGRID` | Taurus-Ai-Corp | **DEAD** | 2026-01-31 | empty | private | EMPTY repo (409). GRIDERA|Lend is roadmap-only with no PRD. |
| `q-grid-ip` | Taurus-Ai-Corp | **DEAD** | 2025-12-11 | empty | private | EMPTY repo (409). |
| `BotCom.TaurusAI` | Taas-ai | **DEAD** | 2026-06-18 | empty | private | EMPTY (0KB). |
| `mater-maria-homes-pvt` | Taurus-Ai-Corp | **CLIENT** | 2026-07-14 | 519.8 MB | private | Mater Maria Homes client site/investor platform. |
| `mater-maria-homes` | Taurus-Ai-Corp | **CLIENT** | 2026-05-16 | 313.9 MB | private / ARCHIVED | Mater Maria - already archived. |
| `petpawsphere` | Taas-ai | **CLIENT** | 2026-06-18 | 1.6 MB | public | UAE pet platform - the client behind platform/campaigns/petpawsphere-2026-06-17. |
| `Nexus-Real-Estate` | Taas-ai | **CLIENT** | 2026-06-18 | 1.1 MB | public | Dubai property assessment toolkit. NOTE: taxonomy flags property-assessment-toolkit as still shipping on Vercel under the dead BizFlow brand with no contracting entity assigned - reopen that, do not retire. |
| `efs-humzh-engagement` | Taurus-Ai-Corp | **CLIENT** | 2026-05-07 | 1.1 MB | private | EFS/Humzh CPA-CRA client engagement. |
| `propertyvet-background-system` | Taurus-Ai-Corp | **CLIENT** | 2026-02-04 | 270 KB | private | Tenant/background verification tooling. |
| `matercare-homes` | Taurus-Ai-Corp | **CLIENT** | 2026-06-25 | 81 KB | public | MaterCare eldercare client platform. |
| `matercare-homes` | Taas-ai | **CLIENT** | 2026-06-18 | 1 KB | public | Personal mirror of the org matercare-homes repo (1KB). |
| `GRIDERA` | Taurus-Ai-Corp | **GRIDERA** | 2026-08-17 | 113.2 MB | public | Canonical GRIDERA monorepo. |
| `Quantum-Shield-NFT` | Taurus-Ai-Corp | **GRIDERA** | 2026-06-25 | 22.0 MB | public | GRIDERA Q-SaaS ecosystem. |
| `gridera-infra-india` | Taurus-Ai-Corp | **GRIDERA** | 2026-03-19 | 15.1 MB | private | GRIDERA India / q-grid.in. |
| `quantumrupee-demo-public` | Taurus-Ai-Corp | **GRIDERA** | 2026-02-14 | 10.1 MB | private | GRIDERA|Pay demo. |
| `gridera-comply` | Taurus-Ai-Corp | **GRIDERA** | 2026-08-22 | 3.6 MB | private | GRIDERA|Comply Gen 2. NOTE: contains infrastructure/dify/.env.dify. |
| `hedera-docs` | Taurus-Ai-Corp | **GRIDERA** | 2026-02-14 | 2.5 MB | private | GRIDERA platform documentation. |
| `actus-hackathon-2025` | Taurus-Ai-Corp | **GRIDERA** | 2026-02-14 | 1.4 MB | private | ACTUS hackathon submission, GRIDERA/Hedera line. |
| `taurus-cli` | Taurus-Ai-Corp | **GRIDERA** | 2026-02-28 | 814 KB | private | `taurus-cli` binary - FROZEN identifier in taxonomy. Hedera + PQC ops. |
| `gridera-migrate` | Taurus-Ai-Corp | **GRIDERA** | 2026-06-25 | 792 KB | public | GRIDERA|Migrate. |
| `bre-india-anchor-lending` | Taurus-Ai-Corp | **GRIDERA** | 2026-02-14 | 260 KB | private | India lending BRE, GRIDERA|Lend adjacency. |
| `india-debt-recovery` | Taurus-Ai-Corp | **GRIDERA** | 2026-02-14 | 147 KB | private | India compliance module, GRIDERA|Pay adjacency. |
| `gridera-migrate-sdk` | Taurus-Ai-Corp | **GRIDERA** | 2026-06-25 | 121 KB | public | GRIDERA|Migrate SDK. |
| `GRID-PAY.Indian.Fintech.DeFi.Rural.Zk-KYC.Blockchain.AML.CBDC` | Taurus-Ai-Corp | **GRIDERA** | 2025-12-05 | 80 KB | private | GRIDERA|Pay India. |
| `gridera-scan-cli` | Taurus-Ai-Corp | **GRIDERA** | 2026-06-25 | 76 KB | public | GRIDERA|Scan CLI. |
| `taurus-regulatory-arbitrage` | Taurus-Ai-Corp | **GRIDERA** | 2026-02-13 | 43 KB | private | GRIDERA RegArb tools. |
| `quantum-rupee-zk-kyc` | Taurus-Ai-Corp | **GRIDERA** | 2026-06-25 | 39 KB | private | GRIDERA IP defensive publication. |
| `quantum-rupee-fraud-detection` | Taurus-Ai-Corp | **GRIDERA** | 2026-06-25 | 39 KB | private | GRIDERA IP defensive publication. |
| `quantum-rupee-offline-cbdc` | Taurus-Ai-Corp | **GRIDERA** | 2026-06-25 | 38 KB | private | GRIDERA IP defensive publication. |
| `gridera-lend` | Taurus-Ai-Corp | **GRIDERA** | 2026-06-18 | 36 KB | private | GRIDERA|Lend. |
| `regulatory-arbitrage-intelligence` | Taurus-Ai-Corp | **GRIDERA** | 2026-01-28 | 10 KB | private | GRIDERA RegArb OSS. |
| `gridera-asset` | Taurus-Ai-Corp | **GRIDERA** | 2026-06-25 | 7 KB | public | GRIDERA product line. |
| `global-bio-foundry` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-08-24 | 527.6 MB | private | SENTINEL / Bio-Foundry. Separate product line - taxonomy forbids conflating with GRIDERA. |
| `quantum-bio-foundry-vault` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-06-25 | 526.3 MB | private | SENTINEL IP vault (patents/prior art). |
| `taurus-ai-corp-website` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-08-04 | 150.4 MB | public | Live TAURUS AI Corp corporate site. Zero taas-ai.com references (verified). |
| `taurus-editions-2026` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-08-05 | 147.8 MB | public | Public editions microsite w/ 151MB brand video assets. |
| `bio-foundry-web` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-05-31 | 61.4 MB | private | Bio-Foundry landing pages. |
| `hiero-cli` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-03-25 | 22.8 MB | public | Upstream Hiero fork. |
| `hiero-improvement-proposals` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-03-26 | 9.5 MB | public | Upstream Hiero fork. |
| `taurus-gcfd-tracker` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-04-08 | 1.1 MB | public | ONLY public shipping SENTINEL artifact (Apache-2.0, live on GitHub + HuggingFace). |
| `MONAD-Gate-` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-07-25 | 634 KB | public | MONAD | Gate concept repo, public. |
| `.github` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-08-24 | 381 KB | public | Org-wide community health files. Active 2026-08-24. |
| `Quantum_Bio_Foundry_IP_VAULT` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-06-25 | 295 KB | private | SENTINEL IP vault. |
| `Agentic-parliament-api` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2026-08-20 | 51 KB | private | Model Parliament consensus API, Hedera HCS. Active 2026-08-20. |
| `obidien-lab` | Taas-ai | **OTHER-PRODUCT** | 2026-08-19 | 45 KB | private | OBIDIEN research (personal). Active 2026-08-19. |
| `awesome-hedera` | Taas-ai | **OTHER-PRODUCT** | 2026-04-08 | 33 KB | public | Upstream fork (personal). |
| `awesome-hedera` | Taurus-Ai-Corp | **OTHER-PRODUCT** | 2025-02-10 | 32 KB | public | Upstream Hedera fork. |
| `Taas-ai` | Taas-ai | **OTHER-PRODUCT** | 2026-03-25 | 1 KB | public | GitHub profile README. |

---

## 3. Cherry-pick list — ranked by value

Method: every blob SHA in the candidate repo was compared against the corresponding file in the local NEXUS-CORE working tree using `git hash-object`. "Already present" below means **byte-identical**, not "similar".

### Rank 1 — `taurus-neovibe-creative` → the `@taurus-ai/dev-config` CLI source

**The only genuinely unique code in that repo.** [V] 10 files, ~24 KB:

```
src/cli.ts                 (2,177 B)   src/lib/convert.ts   (3,708 B)  <- Claude Code -> OpenCode agent conversion
src/commands/init.ts       (1,850 B)   src/lib/copy.ts      (4,167 B)
src/commands/install.ts    (3,543 B)   src/lib/logger.ts    (1,129 B)
src/commands/update.ts     (4,835 B)   src/lib/merge.ts     (2,428 B)  <- oh-my-opencode.json model-config merge
tsup.config.ts / tsconfig.json / package.json      src/lib/paths.ts    (1,843 B)
```

Why it beats what exists: NEXUS-CORE has the CLI's **payload** (`09-ASSETS/assets/`, 70 files) but not the **installer**. Without `src/`, the 14 agents / 27 commands / 5 security hooks / GSAP skill are a folder nobody can install into a new project. `lib/convert.ts` is the only Claude Code to OpenCode agent translator in the whole estate. The local directory `taurus-nexus-creative/` at NEXUS-CORE root **exists but is completely empty** [V] — someone intended this merge and it never happened.

*Already present, do not re-copy:* `assets/**` (70/70 byte-identical to `09-ASSETS/assets/`) and `docs/licensing/**` (7/7 byte-identical to `08-DOCUMENTATION/legal/licensing/`). `.claude-commands/` (12 files) is an internal duplicate of `assets/shared/commands-project/`.

*Skip:* `creative_agents/ai_content_generator.py` — a 6.5 KB stub whose docstring reads "NeoVibe Creative Platform … Revenue Potential: $3M+ annually". Dead brand plus an invented revenue figure. No value. <!-- brand-allow: quotes the real repo name / real file docstring as an audit finding -->

### Rank 2 — `social-media-orchestra` → CrewAI backend for Nexus Social

[V] The most substantial *reusable product code* in the audit. 89 blobs. Unique against NEXUS-CORE:

| Path | What it is | Why it beats what's there |
|---|---|---|
| `backend/agents/conductor/{agent,workflow,prompts}.py` (32 KB) | Orchestration crew | No equivalent |
| `backend/agents/content/{crew,copywriter,visual_designer,video_producer,prompt_engineer}.py` (50 KB) | Content crew | Nothing comparable in `platform/` or `nexus-backend` |
| `backend/agents/examiner/{linkedin,twitter}_examiner.py` (20 KB) | Post *analysis* agents | NEXUS-CORE's Agent-Reach has `channels/linkedin.py` + `twitter.py` but those **post**; these **evaluate**. Complementary, not duplicate |
| `backend/agents/research/{market_research,trend_analysis,competitor_intel}.py` (28 KB) | Research crew | No equivalent |
| `backend/rag/{pipeline,retriever,vector_store,embeddings}.py` (26 KB) | Full RAG stack | `nexus-backend/backend/services/vector_retrieval.py` is a single turbovec-backed module that degrades to empty results. This is a complete pipeline |
| `backend/tools/osint/spiderfoot_tool.py`, `scrapers/{apify,firecrawl,playwright}_tool.py` | Tool adapters | No equivalent |
| `backend/mcp/server.py` (11 KB) | MCP server exposing the crews | No equivalent |

**Caveat — this repo is NOT dormant.** [V] It is checked out at `HEDERA/social-media-orchestra` with a live working queue (`pending/queue-2026-08-24-*.json`, dated today) and local commits ahead of `origin/main`. Do not retire it. The decision is *merge into Nexus as the Nexus Social backend* vs *keep as a standalone repo*.

**Blocker before any merge:** `frontend/components/orca/{OrcaAnimation,OrcaLogo,OrcaParticles}.tsx` + `index.ts` (23 KB) carry the **ORCA dead brand**. The repo's pre-commit brand guard will reject them. Rename to Nexus Social or drop the frontend and take the backend only.

### Rank 3 — `nexus-creative-editorial` → GTM + provenance + billing residue

[V] Byte-level comparison against **committed** `platform/` files shows the core is already merged:

| File | Status vs `platform/` |
|---|---|
| `lib/prompt-bible.mjs` | **IDENTICAL** |
| `api/campaign-pipeline.js`, `api/ai.js`, `api/imagen.js`, `api/leads.js`, `api/webhook.js` | **IDENTICAL** |
| `assets/campaigns/*` (11 files incl. 5 PNGs) | **IDENTICAL** |
| `campaigns/petpawsphere-2026-06-17/**` (7 PNGs, 3 MP4s, 14 docs/JSON) | **IDENTICAL** — and these *are* committed under `platform/campaigns/` |
| `api/neural-score.js`, `api/neural-refine.js` | Consolidated into `platform/api/neural.js` — its header cites both source filenames |
| `api/research.js`, `api/veo.js`, `api/tribe-colab.js`, `api/prompt-bible.js` | Consolidated into `platform/api/extras.js` — header cites all four. This was the Vercel 12-function-cap consolidation |
| `agency.html`, `dogfood.html`, `colab.html`, `thanks.html`, `case-studies.html`, `world-cup-2026.html` | Present under `platform/campaigns/` (evolved, not identical) |

Genuinely not in the committed canonical repo, ranked:

1. **C2PA content provenance** — `scripts/embed_c2pa.py` (7.2 KB) + `C2PA-IMPLEMENTATION.md` (5.5 KB). Signs AI-generated campaign imagery with C2PA provenance. **Zero implementation anywhere else in the estate** [V] — the only other `c2pa` hits are prose mentions in planning docs. Highest genuine-novelty item in this repo.
2. **Stripe metered-billing setup** — `setup_metered_billing.py` (10.3 KB), `setup_stripe_links.py` (5.0 KB), `stripe-integration-guide.md` (2.5 KB). Creates the Stripe meters/products/prices that `nexus-backend/backend/services/metering.py` is designed to bill against. The backend has the ledger; this has the provisioning.
3. **GTM document set** (~90 KB) — `GTM-OMNICHANNEL-PLAYBOOK.md` (17.1 KB), `NOVEL-B2B-APPROACH.md` (15.8 KB), `ENTERPRISE-GTM-PLAN.md` (12.4 KB), `TRIBE-INTEGRATION-STRATEGY.md` (11.9 KB), `META-ADS-CREATIVE-PACK.md` (11.5 KB), `novel-b2b-marketing-insights.md` (10.0 KB), `outreach-{ready-to-send,campaign-package,copy}.md`.
4. **Google Ads launch kit** (~28 KB) — `google-ads-api-application.md` (10.7 KB), `google-ads-click-build-sheet.md` (8.2 KB), `google-ads-setup-guide.md` (5.4 KB), `google-ads-plan.md` (3.8 KB).
5. **`tribev2_inference.ipynb`** (10.5 KB) — the RunPod TRIBE v2 notebook. `platform/api/neural.js` calls this as its Tier-1 path and falls back to heuristics without it.
6. **`.github/workflows/campaign-deploy.yml`** (2.2 KB) — campaign deploy CI. Note `Nexus`'s own `ci.yml` exists only on the feature branch, not `origin/main`.
7. **`real-estate/`** (`index.html` 21 KB + `DESIGN.md` + `prompts.md`) and **`agent-reach-cookie-helper.py`** + 2 Agent-Reach guides.

**Skip:** `server.log` (439 B), `test_vertex_image.{py,png}` (1.1 MB scratch output), `metered-billing.env` / `stripe-links.env` (see the secrets section).

---

## 4. Safe to retire — 34 repos, with what would be lost

### Loses nothing at all — empty repos (5)
`OBIDIEN`, `gridera-conference`, `LENDGRID`, `q-grid-ip`, `global-bio-foundry-public` — all return HTTP 409 `Git Repository is empty` [V]. **Lost: nothing.** Note `OBIDIEN`'s real 4.8 GB codebase lives at `HEDERA/OBIDIEN` on disk and has never been pushed — retiring the empty repo does not touch it, but that code has **no remote backup**.

### Loses nothing — verified superseded (3)
| Repo | Lost |
|---|---|
| `neovibe-platform` (902 MB) | **Nothing.** Verified strict git ancestor of NEXUS-CORE HEAD. Same numbered-directory monorepo, pre-rename. Retire only *after* the credential rotation below |
| `NEXUS-LOCAL-VOICE-ASSISTANT` | **Nothing.** Its own README: "This repo is an orphan. The source of truth is `nexus-local`." Sole file is that README |
| `taurus-editions-2026-static` (151 MB) | **Nothing.** Identical `diskUsage` (151,353 KB) and identical asset filenames to the public `taurus-editions-2026` [V] |

### Loses only dead-brand stubs (6)
`bizflow` (9.2 MB, Next.js/Prisma, one push 2026-02-13), `taurus-bizflow-ai` (38 KB), `taurus-bizflow-competitive-intelligence` (45 KB), `taurus-assetgrid-demo-portal` (39 KB), `taurus-oriongrid-rwa` (34 KB), `opsflow-taurusai` (66 MB).

**Lost:** From `opsflow-taurusai`, three PowerPoint decks (`OpsFlow-PitchDeck-{FINAL,V1,V2-TaurusBrand}.pptx`) and ~18 strategy markdown files [V, top-level tree only — not opened]. Everything else is dead-brand scaffolding. AssetGrid and OrionGrid are explicitly demoted in the taxonomy ("AssetGrid doesn't exist… These are concept names").

### Loses only demo stubs (7)
`automation-empire-demo` (5 KB), `gridera-5-platforms-demo` (5 KB), `gridera-battlecard-demo` (9 KB), `rwa-regulatory-map-demo` (4 KB), `hedera-quantum-ecosystem` (5 KB), `quantum-infrastructure-demo` (5 KB), `demo-repository` (35 KB). **Lost: nothing of substance** — all are single-page demo artifacts from 2025-12/2026-03 [I, from size + description]. `automation-empire-demo` and `gridera-5-platforms-demo` additionally encode the retired "AI Empire" org framing and a wrong platform count.

### Already archived — retirement is a formality (6)
`multi-ai-devops`, `ml-pipeline`, `innovative-ideas-docs`, `huggingface-spaces`, `quantum-readiness-scanner`, `gridera-orchestration-engine`. **Lost: nothing** — already `isArchived: true` and already superseded by the GRIDERA monorepo / `gridera-scan-cli`.

### Blocked-domain and misc (7)
| Repo | Lost |
|---|---|
| `Taurusai.io` (81 MB) | Superseded by `taurus-ai-corp-website`. **6 code hits for the BLOCKED `taas-ai.com` domain** [V]; README still says "parent company of Q-GRID" (banned brand). Retiring actively removes a brand-guard liability |
| `Taas-ai/Taas.ai` (personal, 7 KB) | Built on the blocked `taas-ai.com`. Content is `LICENSE` + `README.md` + a `Taas.ai-main.zip` blob [V] |
| `Taas-ai/BotCom.TaurusAI` | **Nothing** — 0 KB, empty |
| `Taas-ai/documentation` (178 MB) | **Nothing** — a fork of upstream Nextcloud docs, unrelated to any product. Largest single space win in the audit |
| `agency-os` (103 KB) | 53 blobs, one push 2026-06-25, no taxonomy entry. Superseded by Nexus Creative / Nexus Flow [I — top-level tree only] |
| `fraud-detection-demo-private` (1 KB) | **Nothing** — superseded by `quantum-rupee-fraud-detection` |
| `Abliterated-Colab` (5 KB) | **Nothing** — Colab scratch, no product line |

---

## 5. Does NEXUS-CORE already have everything? — the real gap

**No, and the gap is not the one it appears to be.**

The first-order answer is reassuring: the valuable content of `nexus-creative-editorial` is sitting at `08-DOCUMENTATION/research/swarm-sr/nexus-creative-editorial/` (a near-complete copy — 8 files missing, 12 evolved), and the `taurus-neovibe-creative` payload is at `09-ASSETS/assets/` and `08-DOCUMENTATION/legal/licensing/`.

**That reassurance is false. None of it is committed.** [V]

| Path | Files on disk | Files tracked in git |
|---|---|---|
| `08-DOCUMENTATION/` | 6,165 | **6** |
| `08-DOCUMENTATION/research/` | 7,064 | **0** |
| `08-DOCUMENTATION/research/swarm-sr/` | (whole vendored copy) | **0** |
| `08-DOCUMENTATION/legal/licensing/` | 7 | **0** |
| `09-ASSETS/assets/` | 70 | **0** |

`git check-ignore` returns nothing for these paths and `git status` reports them as `?? untracked` — they are **not gitignored, just never committed** [V]. The 6 files that *are* tracked under `08-DOCUMENTATION/` are all dead-brand legacy (`NeoVibe … Business Structure & Strategy.pdf`, `bizflow_fullstack_prd.md`, …). <!-- brand-allow: quotes the real repo name / real file docstring as an audit finding -->

### Consequence for the retirement decision

Right now, for the C2PA scripts, the GTM set, the Google Ads kit, the TRIBE notebook, the licensing/CLA pack, and the dev-config asset library, there are exactly **two copies in existence**: the source repo on GitHub, and one untracked folder on one laptop. Retiring the source repos before committing would reduce that to one — with no remote backup and no version history.

**Recommended sequence — commit first, retire second:**

1. Commit `09-ASSETS/assets/**` (70 files) and `08-DOCUMENTATION/legal/licensing/**` (7 files).
2. Commit the `08-DOCUMENTATION/research/swarm-sr/nexus-creative-editorial/` residue listed in Rank 3 — **excluding `metered-billing.env` and `stripe-links.env`**, and excluding `server.log` and `test_vertex_image.*`.
3. Cherry-pick `taurus-neovibe-creative/src/**` + build config into the empty `taurus-nexus-creative/` directory.
4. Rotate the credentials listed below.
5. *Only then* retire.

### Genuine functional gaps these repos fill

| Gap in NEXUS-CORE | Filled by |
|---|---|
| No C2PA provenance signing for AI-generated campaign imagery | `nexus-creative-editorial/scripts/embed_c2pa.py` |
| Stripe meters/products exist in prod but no provisioning script is committed | `nexus-creative-editorial/setup_metered_billing.py` |
| `09-ASSETS/assets/` payload has no installer | `taurus-neovibe-creative/src/` |
| RAG is a single degrade-to-empty module | `social-media-orchestra/backend/rag/` (4 modules) |
| Social channels can post but cannot evaluate | `social-media-orchestra/backend/agents/examiner/` |
| No multi-agent content/research crews | `social-media-orchestra/backend/agents/{content,research,conductor}/` |

### Unrelated drift worth flagging
`web/` is tracked in `Nexus` HEAD (Vite/React app, ~20+ files incl. `BizFlowPanel.jsx`) but **does not exist on disk** [V]. Consistent with the mid-reorganisation state CLAUDE.md documents. Not a retirement question, but someone should decide whether `web/` is live.

---

## 6. Secrets exposure — rotate before any retirement

Values were never printed or recorded. Only path, key name, prefix, and length were inspected.

### CRITICAL — live credentials, rotate now

**`Taurus-Ai-Corp/neovibe-platform`** — `01-CORE-PLATFORM/bizflow-backend/agents/integrations/mcp-agents/.env.subscription` [V]

Real-looking values (correct vendor prefix + plausible length). Placeholder-valued keys in the same file are excluded.

| Key | Type | Evidence |
|---|---|---|
| `PERPLEXITY_API_KEY`, `…_BIZFLOW`, `…_NEOVIBE` | Perplexity API key x3 | prefix `pplx`, 53 chars — present |
| `OPENAI_API_KEY` | OpenAI project key | prefix `sk-p`, 164 chars — present |
| `OPENROUTER_API_KEY_SONNET35`, `…_SONNET4` | OpenRouter x2 | prefix `sk-o`, 73 chars — present |
| `FIRECRAWL_API_KEY` | Firecrawl | prefix `fc-4`, 35 chars — present |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub PAT | prefix `ghp_`, 40 chars — present |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | prefix `GOCS`, 35 chars — present |
| `GOOGLE_CLIENT_ID` | Google OAuth client id | 72 chars — present |
| `SLACK_BOT_TOKEN` / `SLACK_USER_TOKEN` | Slack x2 | prefix `xoxb` / `xoxp` — present |
| `NOTION_API_KEY` | Notion integration secret | prefix `secr`, 31 chars — present |
| `FIGMA_ACCESS_TOKEN` | Figma PAT | prefix `figd`, 45 chars — present |
| `WEBFLOW_ACCESS_TOKEN`, `WEBFLOW_CLIENT_ID`, `WEBFLOW_CLIENT_SECRET` | Webflow x3 | 64 chars each — present |
| `SUPABASE_URL` + `SUPABASE_ANON_KEY` | Supabase | JWT, prefix `eyJh`, 208 chars — present |

The same Webflow triple is duplicated at `01-CORE-PLATFORM/bizflow-backend/subdomains/bizflow.taurusai.io/agents/integrations/mcp-agents/design_ai_webflow.env` [V].

**`Taurus-Ai-Corp/nexus-creative-editorial`** — `metered-billing.env` [V]

| Key | Type | Evidence |
|---|---|---|
| `STRIPE_WEBHOOK_SECRET` | **Stripe webhook signing secret** | prefix `whsec_`, 38 chars — present. **A real secret, not an identifier** |
| `STRIPE_*_METER_ID` / `PRODUCT_ID` / `PRICE_ID` (8 keys) | Stripe object identifiers | prefixes `mtr`/`prod`/`price` — not secrets, but they map the live billing config |
| `STRIPE_WEBHOOK_ENDPOINT_ID` | Stripe endpoint id | prefix `we_` — identifier |

`stripe-links.env` holds two live Stripe Checkout URLs (`NEXUS_STARTER_CHECKOUT_URL`, `NEXUS_STUDIO_CHECKOUT_URL`) — not secrets, but live payment endpoints [V].

> **Both files also exist untracked on disk** at `08-DOCUMENTATION/research/swarm-sr/nexus-creative-editorial/`. Confirmed **not tracked** in `Nexus` [V] — but they are also **not gitignored**, so a careless `git add 08-DOCUMENTATION/` would commit a live Stripe webhook secret into the canonical repo. **Add an ignore rule before doing the commit work above.**

### Rotation checklist
- [ ] Stripe webhook signing secret — roll the endpoint secret, update the Vercel env var, then redeploy with the force flag (required whenever env vars change)
- [ ] OpenAI project key, OpenRouter x2, Perplexity x3, Firecrawl
- [ ] GitHub PAT (`ghp_`) — highest blast radius, it can reach this org
- [ ] Google OAuth client secret, Slack bot + user tokens, Notion, Figma PAT
- [ ] Webflow access token + client secret (duplicated in two files — rotate once, purge both)
- [ ] Supabase anon key — review; anon keys are public-by-design *if* RLS is enforced. Confirm RLS before deciding
- [ ] Add `*.env` (excluding `*.env.example`) to `.gitignore` covering `08-DOCUMENTATION/research/`

### LOW — no action beyond awareness
| Location | Finding |
|---|---|
| `Nexus` `web/.env`, `web/.env.production` | `VITE_API_URL`, `VITE_POSTHOG_HOST`, and `VITE_POSTHOG_KEY` — prefix `phc_`, 47 chars. `phc_` is PostHog's **public project key**, designed to ship in client bundles. Not a rotation item. (Had it been `phx_`, a personal API key, it would be critical.) Still: these are `VITE_`-prefixed, so nothing sensitive can ever go in them |
| `gridera-comply` `infrastructure/dify/.env.dify` | Present, **not opened** — GRIDERA repo, out of scope per the brief. Flagged so the GRIDERA owner can check it [V that the file exists; contents uninspected] |
| `neovibe-platform` `.env.bak.*` x2 (cal_scheduling_agent) | Vendored third-party sample; values are literal placeholders (`"your…"`, empty) [V]. No action |

---

## 7. DO NOT TOUCH

**GRIDERA product line (21)** — `GRIDERA`, `gridera-comply`, `gridera-asset`, `gridera-migrate`, `gridera-migrate-sdk`, `gridera-scan-cli`, `gridera-lend`, `gridera-infra-india`, `quantum-rupee-zk-kyc`, `quantum-rupee-offline-cbdc`, `quantum-rupee-fraud-detection`, `quantumrupee-demo-public`, `Quantum-Shield-NFT`, `taurus-regulatory-arbitrage`, `regulatory-arbitrage-intelligence`, `GRID-PAY.Indian.Fintech.DeFi.Rural.Zk-KYC.Blockchain.AML.CBDC`, `hedera-docs`, `india-debt-recovery`, `bre-india-anchor-lending`, `actus-hackathon-2025`, `taurus-cli`.

> `taurus-cli` is a **FROZEN identifier** in the taxonomy — the binary name must not change.

**SENTINEL / Bio-Foundry (5)** — `global-bio-foundry`, `quantum-bio-foundry-vault`, `Quantum_Bio_Foundry_IP_VAULT`, `taurus-gcfd-tracker`, `bio-foundry-web`.

> `taurus-gcfd-tracker` is the **only public shipping SENTINEL artifact** (Apache-2.0, live on GitHub + HuggingFace, CI passing). The IP vaults hold timestamped prior art for unfiled patents — retiring or altering them could damage a priority claim. **Highest-consequence do-not-touch in this audit.**

**Client work (8)** — `mater-maria-homes-pvt`, `mater-maria-homes` (already archived), `matercare-homes` (org + personal mirror), `efs-humzh-engagement`, `propertyvet-background-system`, `Taas-ai/Nexus-Real-Estate`, `Taas-ai/petpawsphere`.

> `Nexus-Real-Estate` is the property-assessment toolkit the taxonomy flags as **still shipping on Vercel under the dead BizFlow brand, with no contracting entity assigned** after the UAE entity was retired 2026-08-08. That is an open commercial/legal question — **reopen it, do not retire the repo.**
> `petpawsphere` is the client behind the committed `platform/campaigns/petpawsphere-2026-06-17/` campaign.

**Corporate / active / upstream (8)** — `taurus-ai-corp-website` (live corporate site; **zero** `taas-ai.com` references, verified), `taurus-editions-2026`, `.github` (org health files, active 2026-08-24), `Agentic-parliament-api` (active 2026-08-20), `MONAD-Gate-`, `Taas-ai/obidien-lab` (active 2026-08-19), `Taas-ai/Taas-ai` (profile README), and the upstream forks `hiero-improvement-proposals`, `hiero-cli`, `awesome-hedera` (org + personal).

---

## 8. UNCLEAR — 6 repos needing a decision

| Repo | Size | What I'd need to decide |
|---|---|---|
| `nexus-local` | 461 KB | Source of truth for the NEXUS Voice Assistant (`backend/src` 33 files, frontend, `hf-space/`, `.planning/phases/` 32 files, 5 CI workflows). **It is not part of `nexus.taurusai.io` and the voice assistant is not one of the 5 NEXUS SKUs.** Question for the owner: is it a product, or research? If a product it needs a taxonomy entry; if research it can move to a workspace. Note `NEXUS-LOCAL-VOICE-ASSISTANT` points here, so retire that orphan *first* either way |
| `gemini-integration` | 19 MB | GenMedia/MCP bridge — `claude-genmedia-bridge.py`, `genmedia_tools.py`, `mcp-servers/`, `orchestrator/`, `streaming/`. Is this superseded by the 6 GenMedia Go MCP servers already in the live stack, or is it the glue that drives them? |
| `claude-skills` | 9 MB | Two dirs: `dev-browser`, `gpt-runner`. Are these superseded by the ~60 skills now in `~/.claude/skills/`? Neither name appears there |
| `multi-agent-pipeline` | 57 KB | DAG pipeline + `roast_bot.py` + `recon.py`. CLAUDE.md lists `HEDERA/multi_agent_pipeline` as "Built & Tested". Which is authoritative — the org repo or the HEDERA working copy? |
| `hedera-orchestrator-private` | 210 KB | CLAUDE.md lists `HEDERA/hedera-orchestrator` as "Foundation" stage. Same question: repo vs working copy |
| `strategic-intelligence` | 184 KB | `analyses/`, `geo-verticals/`, `source-docs/`; self-describes as "auto-referenced for strategic decisions and investor due-diligence". Is anything still reading it? If yes it's a do-not-touch; if no it's an archive candidate |

A common thread: four of these six exist as both an org repo and a live `HEDERA/` working copy. Establishing which side is authoritative would resolve most of this bucket at once.

---

## 9. Recommended order of operations

1. **Rotate** every credential in the secrets section. Independent of everything else, and overdue.
2. **Add the ignore rule** for `*.env` under `08-DOCUMENTATION/research/` so step 3 cannot leak the Stripe webhook secret.
3. **Commit the untracked salvage**: `09-ASSETS/assets/**`, `08-DOCUMENTATION/legal/licensing/**`, and the `nexus-creative-editorial` residue from Rank 3.
4. **Cherry-pick** `taurus-neovibe-creative/src/**` into the empty `taurus-nexus-creative/`.
5. **Decide** the `social-media-orchestra` question (merge as Nexus Social backend vs keep standalone). Either way, resolve the ORCA brand-guard blocker first.
6. **Then retire** the 34 DEAD repos — starting with the 5 empty ones and the 6 already-archived ones, which carry zero risk.
7. **Resolve** the 6 UNCLEAR repos, ideally by settling repo-vs-`HEDERA`-working-copy authority in one pass.

---

*Read-only audit. No repository was deleted, archived, renamed, or otherwise modified. No secret value was printed or recorded.*
