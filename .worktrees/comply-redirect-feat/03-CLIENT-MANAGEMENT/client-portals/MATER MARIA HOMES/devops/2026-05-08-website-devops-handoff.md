# Mater Maria Website Devops Handoff — 2026-05-08

> **Handoff to next session.** This document captures everything needed to continue website devops on `matermariahomes.com` after a major content/strategy session on 2026-05-07 → 2026-05-08. Read top to bottom; the integration with NotebookLM "NeoVibe — Mater Maria Homes" is the load-bearing piece.

---

## TL;DR for the next agent / engineer

Three workstreams, in order of priority:

1. **Build + deploy** the updated mater-maria Next.js site to push the new unified WhatsApp/phone number (`+91 94470 80356`) live. Source files are updated; deployed HTML still serves OLD numbers from `.next/` build artifacts and any cached PDF brochures in Drive.
2. **Upload the session's new documents + the existing financial model XLS** to the NotebookLM "NeoVibe — Mater Maria Homes" notebook so the team can query the policy/audience/financial corpus in natural language.
3. **Apply the geo pivot** (v3) across any deployed assets that reference GCC-specific copy — primarily the investor PDF brochure, the OG/social-share images, and any cached SEO descriptions.

---

## 1. Current State of `matermariahomes.com`

**Codebase location:** `/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/mater-maria/` (folder renamed from `MATER_HOMES` on 2026-05-07; spaces in path now require shell quoting).

**Stack:** Next.js 16.1.6, React 19, Tailwind v4, ShadCN, Framer Motion. Deployed on Vercel (verify project name + environment).

**Last known deploy state (per memory + commit history):**
- Commit before this session: `0ecb62a` — Edit prevalidation hook for Claude Code (no functional site changes)
- Last functional deploy: from `gemini/mater-maria-v3` branch (per `GEMINI_HANDOFF_2026-03-11.md`)
- Build status: 18 routes passing as of 2026-03-01 breakpoint

**What's currently live but stale:**
- Phone numbers in compiled HTML/JS chunks: still showing OLD UAE `+971 50 578 6471` and India `+91 96564 63073`. Source updated to `+91 94470 80356`; deploy required.
- PDF brochure cached in Google Drive: contains OLD numbers.
- OG images / social-share previews: may reference GCC-specific positioning ("for the GCC diaspora") if such images exist in `public/`.
- Audience copy on `/invest`: if any visible copy mentions "GCC NRIs" or specific Gulf countries, it needs to align with the v3 geo pivot (Kerala + US/UK/AUS/NZ).

---

## 2. Source Changes That Need Deploy

These are committed to `main` as of `fbb5870`:

### Phone number consolidation (8 source files)
All updated from old dual UAE/India numbers to unified `+91 94470 80356`:
- `mater-maria/src/lib/constants.ts` — central source of truth
- `mater-maria/src/components/invest/EstateHero.tsx` — WhatsApp click handler
- `mater-maria/src/components/invest/LeadCapture.tsx` — both UAE + India constants now point to unified line
- `mater-maria/src/components/invest/FloatingWhatsApp.tsx` — floating button
- `mater-maria/src/components/layout/StickyBottomBar.tsx` — sticky CTA bar
- `mater-maria/src/app/api/investor-chat/route.ts` — chatbot system prompt + responses
- `mater-maria/src/lib/pdf/brochure.tsx` — PDF brochure footer + contact page

### Path references
- `devops/2026-05-06-domain-handoff.md`
- `devops/scripts/post-cutover-verify.sh`
- `mater-maria/GEMINI_HANDOFF_2026-03-11.md`

All references to old folder name `MATER_HOMES` updated to `MATER MARIA HOMES`.

### Deploy procedure (next session, after pulling main)

```bash
cd "/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/mater-maria"
git pull origin main
npm install               # if any dependencies changed; otherwise skip
npm run build             # verify all 18 routes still pass
npm run lint              # confirm no regressions

# Then deploy via Vercel
vercel deploy --prod      # or use the project's existing deploy command

# Post-deploy verification
./devops/scripts/post-cutover-verify.sh    # (this script needs to be checked
                                            # — confirm it grep-checks for the
                                            # new number `9447080356`)
```

**Verification checklist after deploy:**
- [ ] `curl -s https://matermariahomes.com/invest | grep "9447080356"` returns hits
- [ ] `curl -s https://matermariahomes.com/invest | grep "9656463073"` returns ZERO (old number gone)
- [ ] WhatsApp floating button click opens `wa.me/919447080356` URL
- [ ] PDF brochure download link still works AND contains new number (regenerate if cached)

---

## 3. Image / Asset Additions and Updates

**Existing assets in `mater-maria/public/assets-2025/images/`** (confirmed via git status):
- `about/` — estate-aerial.webp, mm-aerial-estate.webp
- `amenities/` — amphitheatre, care-resident, chef-dining, poolside-community, yoga-pavilion, yoga-meditation
- `gallery/` — kanjirappally_town, kerala-backwaters-sunset, kochi-heritage, kottayam_rubber_plantations, multiple `mmh-kmg-b00X` shots, wayanad-mist, western_ghats_kanjirappally
- `invest/` — cultural-hall, farm, fitness, garden-pathway, hero-aerial, hero-estate, hero-garden, hero-sunset, meditation, og-invest

**Status:** All these `.webp` files were tracked through the folder rename (R-status in git). They serve correctly post-rename. No content changes needed unless re-shot for diaspora positioning.

**Pending creative shoots (per campaign-brief.md week 2-4 plan):**
- Video creative shoots for V1 (Legacy) and V4 (Healthcare) — emotionally richest in motion
- 15s vertical Reels-native creative for week 3
- Per-country localized imagery if budget supports (e.g., Houston Malayali community shot, London family shot)

**OG / social-share images:**
- `og-invest.webp` exists; verify the embedded text/copy doesn't reference GCC. If it does, regenerate with the v3 geo positioning (Kerala homebase + global Malayali diaspora).

---

## 4. XLS Sheet Integration

**The "Financial model XLS"** — referenced in MEMORY.md as "9 sheets — PRIVATE, strategic disclosure only."

**Where to find it:** Likely in `03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/financials/` or `mater-maria/docs/` — verify exact location by listing those directories. If not in repo, may be in client's Google Drive folder.

**What it contains (per memory):** Share + deposit hybrid model, 10% interest years 1-4, dividend escalation 6%-20% years 5-15, 150% modeled returns over 15 years, 9 sheets total.

**Integration tasks:**
1. **Locate the XLS** — `find` it in the client folder structure or pull from Drive.
2. **DO NOT commit it to git unless approved by counsel** — it is marked PRIVATE / strategic disclosure only.
3. **Upload to NotebookLM** as a source (see Section 5 below) so the team can query financial questions in natural language without exposing the sheet broadly.
4. **Verify alignment** with the projection language in `meta-ads-campaign/creative-variants.md` V2 — the verbatim disclaimer says "Modeled returns of approximately 150% over the 15-year share-cycle horizon." The XLS should produce this number when run; if it produces 153% or 148%, the creative copy needs alignment.
5. **PDF brochure regeneration** — `mater-maria/src/lib/pdf/brochure.tsx` references the financial model implicitly. After source changes (new phone number) the brochure needs a regenerated PDF at `public/assets/brochure.pdf` or wherever it's served. Check the brochure generation pipeline.

---

## 5. NotebookLM Integration — "NeoVibe — Mater Maria Homes"

**This is the major new integration for this engagement.** The notebook becomes the source-of-truth knowledge base for the entire Mater Maria client engagement — every campaign decision, policy interpretation, financial query, and stakeholder report can be grounded in it.

### Notebook details

- **Notebook name:** "NeoVibe — Mater Maria Homes"
- **URL:** https://notebooklm.google.com/notebook/f7a05840-e353-48fa-b99d-48e07023d4d3
- **Notebook ID:** `f7a05840-e353-48fa-b99d-48e07023d4d3`

### Sources to upload (priority order)

#### Tier 1 — CORE corpus (upload first)

The 9 files in `MATER MARIA HOMES/meta-ads-campaign/`:
1. `README.md` — campaign overview
2. `campaign-brief.md` — full media-buyer plan (HOUSING + v3 geo)
3. `audience-targeting.md` — v3 audience layers (Kerala + diaspora)
4. `creative-variants.md` — 5 ad variants with verbatim compliance footers
5. `creative-grade.md` — Agent A's per-variant scoring
6. `cli-commands.sh` — executable bash blueprint (PAUSED throughout)
7. `kpi-dashboard.md` — week 1+ monitoring rules
8. `policy-compliance.md` — 6-section compliance checklist (HOUSING + SEBI + UAE-CMA legacy + DPDP + WhatsApp Business + likeness + landing-page hygiene)
9. `engineering-ticket-CAPI.md` — Conversion API engineering spec
10. `whatsapp-bot-flow.md` — WhatsApp bot integration spec

#### Tier 2 — Project context

11. `mater-maria/docs/plans/2026-02-28-mater-maria-design.md` — design doc
12. `mater-maria/docs/plans/2026-02-28-mater-maria-implementation.md` — 38-task implementation plan
13. `mater-maria/GEMINI_HANDOFF_2026-03-11.md` — historical context handoff
14. `mater-maria/README.md` — codebase overview

#### Tier 3 — Financials and strategic

15. The financial model XLS (9 sheets) — PRIVATE, strategic disclosure only
16. The investor PDF brochure (`public/assets/brochure.pdf` or equivalent)
17. Any client-provided strategy docs in `MATER MARIA HOMES/`

### How to upload (using the project's `notebooklm` CLI)

Per CLAUDE.md, the project uses the `notebooklm` CLI (located at `/opt/homebrew/bin/notebooklm`, pip package `notebooklm-py`):

```bash
# 1. Switch to the Mater Maria notebook
notebooklm use f7a05840-e353-48fa-b99d-48e07023d4d3

# 2. Verify session
notebooklm status

# 3. Upload Tier 1 sources (loop through the 10 campaign files)
ROOT="/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/meta-ads-campaign"
for f in "$ROOT"/*.md "$ROOT"/*.sh; do
  notebooklm source add "$f"
  echo "Uploaded: ${f##*/}"
done

# 4. Upload Tier 2
notebooklm source add "/Users/taurus_ai/.../mater-maria/docs/plans/2026-02-28-mater-maria-design.md"
notebooklm source add "/Users/taurus_ai/.../mater-maria/docs/plans/2026-02-28-mater-maria-implementation.md"
notebooklm source add "/Users/taurus_ai/.../mater-maria/GEMINI_HANDOFF_2026-03-11.md"
notebooklm source add "/Users/taurus_ai/.../mater-maria/README.md"

# 5. Upload Tier 3 — financial XLS via Drive integration (per CLAUDE.md)
# If the XLS is in Google Drive:
notebooklm source add-drive <FILE_ID> --mime-type google-sheets

# Or if it's a local .xlsx file:
notebooklm source add "/path/to/financial-model.xlsx"

# 6. Verify all sources loaded
notebooklm sources list
```

**Auth note:** if `notebooklm` returns "auth expired", run `notebooklm login` interactively (the CLI requires a TTY).

### Use cases for the integrated notebook

Once sources are uploaded, the team can query:

- **Policy questions:** "What's our SEBI disclosure language for the V2 ROI hook?" → returns verbatim from policy-compliance.md
- **Audience questions:** "What's our expected CPL in the UK?" → returns from audience-targeting.md + kpi-dashboard.md
- **Financial questions:** "What dividend percentage applies in year 7?" → reads from the XLS
- **Cross-references:** "Which creative variants have HOUSING-required disclaimers?" → cross-checks creative-variants.md and policy-compliance.md
- **Stakeholder reports:** Generate audio overviews (`notebooklm generate audio`) for client meetings, or briefing notes (`notebooklm generate report "Mater Maria Q2 launch readiness"`).

### Generation workflows

```bash
# Generate audio walkthrough of the campaign blueprint (for client briefings)
notebooklm generate audio "Walk me through the Mater Maria campaign strategy at a CEO level"

# Generate a stakeholder-friendly report
notebooklm generate report "Mater Maria Meta Ads launch readiness as of 2026-05-08"

# Generate an infographic
notebooklm generate infographic "Mater Maria 4-tier investor program returns"

# Download artifacts locally + push to Drive
notebooklm download report --to-drive
```

---

## 6. Step-by-Step Instructions for Next Session

```
Session goal: Deploy site updates + integrate session corpus into NotebookLM

Step 1 — Pull latest main
    cd "/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform"
    git pull origin main
    git log --oneline -5
    # Confirm fbb5870 (the meta-ads commit) is in history

Step 2 — Build + verify the site
    cd "03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/mater-maria"
    npm install
    npm run build
    # Confirm 18+ routes pass; check for any errors related to constants.ts
    # or LeadCapture changes

Step 3 — Deploy to Vercel
    vercel deploy --prod
    # Capture the deploy URL for verification

Step 4 — Post-deploy verification
    curl -s https://matermariahomes.com/invest | grep "9447080356"
    # Should return matches; if not, deploy didn't propagate the new number

    curl -s https://matermariahomes.com/invest | grep "9656463073"
    # Should return ZERO; old number must be gone

Step 5 — Regenerate brochure PDF (if it's a build artifact)
    # Check if mater-maria/src/lib/pdf/brochure.tsx is rendered at build time
    # or on-demand. If build-time, the deploy already regenerated it.
    # If on-demand, trigger a regeneration:
    curl -s https://matermariahomes.com/invest/brochure | head -100
    # Then re-upload to Drive's "Mater Maria — Investor Brochures" folder

Step 6 — NotebookLM upload
    notebooklm use f7a05840-e353-48fa-b99d-48e07023d4d3
    notebooklm status
    # If auth expired: ! notebooklm login (interactive, in user's terminal)

    # Run the Tier 1 upload loop from Section 5 above
    # Verify with: notebooklm sources list

Step 7 — XLS upload (carefully)
    # Locate the financial model XLS first:
    find "/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES" -name "*.xlsx" -o -name "*.xls"
    # If not in repo, check Google Drive "Mater Maria — Strategic" folder via gws-bridge
    gws-bridge status
    # Upload to NotebookLM (Drive route preferred for PRIVATE files):
    notebooklm source add-drive <FILE_ID> --mime-type google-sheets

Step 8 — Generate first audio overview
    notebooklm generate audio "Walk me through the Mater Maria Meta Ads campaign blueprint, audience strategy, and HOUSING compliance status"
    notebooklm download audio --to-drive

Step 9 — Update MEMORY.md with session outcome
    # Note in user's auto-memory:
    # - Site deployed at <date>
    # - NotebookLM corpus loaded
    # - Brochure regenerated and uploaded
```

---

## 7. Open Questions / Blockers for Next Session

### Blocking (cannot proceed without resolution)

1. **`[LEGAL ENTITY NAME]` placeholder in 5 ad creatives** — counsel must confirm the issuing entity name before any creative ships to Meta. Currently a literal placeholder.
2. **Financial model XLS location** — confirm whether it's in the repo, in Drive, or only on a stakeholder's machine. NotebookLM upload depends on availability.
3. **Vercel deploy access** — confirm the next session has Vercel CLI auth + project access. If not: `vercel login` first.
4. **NotebookLM auth state** — the CLI may need re-authentication. Plan for an interactive `notebooklm login` step.

### Non-blocking (can proceed in parallel)

5. **UK ASA + Australian ASIC disclosure language** — under v3 geo pivot, UK and AUS regulatory frameworks now apply for return-claim creative. Counsel should review whether the SEBI standard warning + consolidated disclaimer already cover ASA/ASIC requirements, or if additional jurisdictional disclaimers are needed.
6. **Per-country brochure variants** — should the PDF brochure include per-country tax/dispute-resolution language for IN/US/GB/AU/NZ readers? Counsel call.
7. **Three optional engineering polish items** flagged on `whatsapp-bot-flow.md` (STOP-vs-window precedence note, `phone_sha256` index, opt-out throughput question) — engineering may apply when picking up the bot ticket.
8. **NotebookLM access permissions** — does the notebook need to be shared with Mater Maria stakeholders directly, or do they query through TAURUS AI as proxy? Clarify with Rajeev Abraham.

---

## 8. Reference

- **Repo:** `/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/`
- **Site source:** `03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/mater-maria/`
- **Campaign blueprint:** `03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/meta-ads-campaign/`
- **NotebookLM notebook:** https://notebooklm.google.com/notebook/f7a05840-e353-48fa-b99d-48e07023d4d3
- **Live site:** https://matermariahomes.com (verify Vercel project)
- **Last commit:** `fbb5870` on main (`feat(meta-ads): MM + NeoVibe blueprints + HOUSING/SEBI/DPDP compliance`)
- **Primary contact:** Rajeev Abraham, +91 94470 80356 (unified WhatsApp bot line)
- **Memory file:** `/Users/taurus_ai/.claude/projects/-Users-taurus-ai-Documents-BizFlow-NeoVibe-Platform/memory/MEMORY.md`

---

**End of handoff.** Next session: read top-to-bottom, then execute Section 6 step-by-step.
