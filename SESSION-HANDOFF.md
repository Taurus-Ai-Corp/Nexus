# Nexus-Platform Session Handoff

> **Purpose:** Let the next TAURUS AI Corp agent session resume this Nexus-Platform
> cleanup exactly where it stopped. Read this FIRST, then read the plan
> (`~/.claude/plans/snoopy-snacking-hinton.md`) and the PRD
> (`docs/superpowers/specs/2026-06-24-nexus-enterprise-repo-design.md`).
> **Last verified:** 2026-07-09. **Do NOT commit this file without explicit "yes".**

---

## 1. Where the work stopped (verified 2026-06-30)

- **Repo:** `/Users/taurus_ai/Documents/Nexus-Platform/` (own git repo — `cd` here for ALL git).
- **Branch:** `feat/nexosync-to-nexus-rebrand`
- **HEAD:** `cef7928` — `chore(repo): reclassify analytics-dashboard to planning/ + track lint configs (Wave 3, Option B)`
- **Unpushed (4 commits ahead of origin):** `cef7928`, `dfeb786`, `f1778a3`, `c63ee41`
- **Origin/main:** `b187947` (last known)
- **Working tree:** 12 modified, 0 staged, 49 untracked — **needs user triage** (modified submodules Motia/anthropic-cookbook/klavis/sim/awesome-ai-apps; untracked `.py` in `00-PRODUCT-PLANNING/realtime-ai-agent-openrouter/`, `external-mcps/`, `.playwright-mcp/` snapshots, `AGENTS.md`, `merge-unified-skills/`, muthoot research JSON).

> ⚠️ **Iron Law (verification-before-completion):** the 4 unpushed commits are verified via `git log --oneline @{u}..HEAD`. Do not claim "pushed" without re-running that command.

---

## 2. The six-wave plan (approved PRD + Wave 0)

Source of truth: `~/.claude/plans/snoopy-snacking-hinton.md` (executes the approved PRD `docs/superpowers/specs/2026-06-24-nexus-enterprise-repo-design.md`).

| Wave | Status | Notes |
|------|--------|-------|
| **0 — Secret-leak remediation** | 🔶 ENUMERATION DONE, ROTATE+PURGE GATED | `master.env.backup.20251119_053744` (7826B, 63 entries/28 providers) **still tracked in index** — `git rm --cached` NOT yet run (gated on "yes"). `social-suite-dashboard/web/.env{,.production}` verified NOT in history. Rotation checklist at `SECURITY-ROTATION-CHECKLIST.md` (gitignored, not committed). |
| **1 — De-vendor siblings** | ✅ DONE in commits `7cb599d`+`77ce0c2` | `taurus-agency-os/`, `matercare-ElderCare_SaaS/`, GRIDERA/Quantum-Shield clones removed. |
| **2 — Carve `core/`** | ✅ DONE | `4c67647` carved `core/{agents,db,design-system}`; `a42cf7f` purged 37 venv artifacts; `c63ee41` aligned `.gitignore`; `f1778a3` reconciled root `package.json`. |
| **3 — Stand up verticals/**** | 🔶 PARTIAL | `dfeb786` scaffolded `verticals/` + moved `onboarding-portal`→`freelance/` (eslint-clean). `cef7928` reclassified `analytics-dashboard`→`planning/` (residue). **social/creative GATED on Wave 5** (live Vercel deploys). See each `verticals/*/README.md`. |
| **4 — Relocate support layers** | ⬜ NOT STARTED | `platform/`, `clients/`, `marketing/`, `planning/`, `docs/`, `assets/`, `config/` + `pnpm-workspace.yaml` + `turbo.json`. |
| **5 — CI + Vercel scoping + org hygiene** | ⬜ NOT STARTED | Per-vertical `rootDirectory` + `nodeVersion:"20.x"` via Vercel API; fix `neosync-dashboard` mismatch; GRIDERA-contamination CI grep guard; matrix CI; org-level security defaults. |
| **6 — Rebrand sweep + merge** | ⬜ NOT STARTED | NeoVibe/NeoSync/BizFlow/GridDB → NEXUS; rendered-brand verify (DOM, not source grep); **GATED merge to main**. |

---

## 3. Wave 0 — the critical path (secrets still live)

**Only one file is in git history with live secrets:**
- `01-CORE-PLATFORM/nexus-backend/agents/integrations/mcp-agents/master.env.backup.20251119_053744`
  - Tracked (confirmed 3 ways), 1 commit in history, 63 key=value entries across 28 provider groups.
  - The root `.gitignore` has `**/master.env*` + `**/*.env.backup.*` (lines 20–24) but **gitignore does not apply to already-tracked files** — the file stays committed until `git rm --cached` + commit.

**Critical filtering applied (NOT "rotate 63 keys"):**
- **17 rotate** (real high-value live secrets: PERPLEXITY, ANTHROPIC, OPENAI, SLACK, GITHUB PAT, VERCEL, HUGGINGFACE, APIFY, ATLASSIAN, RESend, Brevo, etc.)
- **5 verify** (may be expired/rotated already — check provider console)
- **6 placeholder** (`xxx`/`your-key`/`TODO` — not live)
- **3 identifier** (account IDs, not secrets)
- **26 config** (URLs/paths/models — not credentials)
- **6 other** (low-risk)
- **Cross-service reuse detected:** ATLASSIAN_API_TOKEN == STASH_API_TOKEN (last-4 `…2C39`) — same credential, two services.
- **Dedupes:** ANTHROPIC == ANTHROPIC_API_KEY_NEOVIBE (`…DAAA`); PERPLEXITY same; APIFY same.

**Full categorized checklist (last-4 masked, never full values):**
`SECURITY-ROTATION-CHECKLIST.md` — gitignored via `.gitignore:233`, verified `git check-ignore -v` + `git add --dry-run .` skips it.

### Next steps (each gated on explicit "yes")
1. **Rotate first** (user-driven, interactive — `!`-prefix in prompt for logins): reissue the 17 live keys at their providers; update all consumers before revoking old.
2. **Untrack the leak file:** `git rm --cached -- "$LEAK"` + commit (Task #15, GATED). This stops future commits but does NOT purge history.
3. **Purge history:** `git filter-repo` (preferred) removing the file from all commits; backup repo first; force-push only after explicit "yes" AND after confirming no collaborator has unpushed work on affected branches (Task #8, GATED).
4. **Verify:** `git log --all -S '<rotated-key-prefix>'` → no hits; `gitleaks`/`trufflehog` clean; providers confirm old revoked.

---

## 4. Vercel ↔ repo map (verified this session via API)

Team `taurus-s-projects` (`team_ljtVg59YsYUDbIdetyyOVg05`), 67 projects total.

**Nexus-product projects:**
| Project | rootDirectory | nodeVersion | Note |
|---------|---------------|-------------|------|
| `neosync-dashboard` | `web` | 24.x | ⚠️ **BROKEN** — no `web/` folder at repo root. `.vercel/project.json` links here with stale `projectName`. Fix in Wave 5. |
| `nexus-platform` | (root) | 20.x | OK |
| `nexus-social-suite` | (its own repo) | 20.x | Live; Wave 3 social move is GATED on its `rootDirectory` (Wave 5). |
| `nexus-social-api` | — | 20.x | — |
| `nexus-creative-editorial` | (nested repo) | 20.x | Live; Wave 3 creative GATED. |
| `kayarattan` | `01-CORE-PLATFORM/nexus-studio/kayarattan` | 20.x | Live; Wave 3 creative GATED on Wave 5 rootDirectory update. |
| `mater-maria` | `mater-maria/` | 20.x | Live; Wave 4 moves to `clients/mater-maria/` behind rootDirectory update. |
| `bizflow-backend` | — | 20.x | Retired brand (BizFlow → NEXUS), no deploy. |

**GRIDERA siblings (same team, do NOT touch — referenced not vendored):**
`comply` (eu.q-grid.net), `landing` (q-grid.net), `guard` (guard-beryl) — all deploy from `q-grid-platform/` repo.

**Drift/warnings:** nodeVersion 24.x→20.x corrections needed on a few; one project (`bizflow-multilayer-website`) on a DIFFERENT team (`team_W9BmPAf58fyObddq2KF0dI7r`); duplicate `.vercel/project.json` links to clean up in Wave 5.

---

## 5. Hard constraints (carry verbatim into every session)

1. **Never break a live deploy/link.** Every `git mv` of a deployed dir is followed by a Vercel `rootDirectory`/route check before push; keep old paths serving until new ones verify HTTP 200.
2. **Never commit/push/force-push without explicit "yes".** Questions are not instructions. History rewrite (Wave 0) and final Wave 6 merge each need a SEPARATE explicit approval.
3. **Both co-authors on EVERY commit:**
   `Co-Authored-By: E.Fdz <admin@taurusai.io>`
   `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`
4. **Rotate before purge.** Rotate leaked keys FIRST, then rewrite history. A purged-but-unrotated key is still live in an attacker's clone.
5. **No GRIDERA code in `nexus-core`.** CI grep guard (Wave 5) rejects `@noble/post-quantum|ml-dsa|ml-kem|@hiero-ledger|@hashgraph|pqc` under `core/` or `verticals/`. GRIDERA (`q-grid-platform/`, PQC/Quantum/Hedera) is a SIBLING product line — referenced, never vendored/forked/cherry-picked.
6. **Nexus is a downstream consumer only** of any GRIDERA `@taurus/*` package — use as external versioned deps, never inline.
7. **HEDERA is not a git repo** — run git INSIDE `Nexus-Platform/`. Shell cwd resets to HEDERA after every Bash call → `cd` inline each time.
8. **Never auto-push to Google Workspace.** GWS is opt-in (`/gws`) only.
9. **Brand rule:** NEVER write "Q-GRID Comply" → use GRIDERA|Comply. Nexus retired brands: NeoVibe/NeoSync/BizFlow/GridDB → NEXUS.
10. **Verify rendered brand/copy against RENDERED build output**, not source grep + tsc (per `feedback_verify_rendered_brand`).
11. **No present-tense for unbuilt features.** No boating. Be brutally honest.
12. **Iron Law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.

---

## 6. Task ledger

| # | Task | Status | Gate |
|---|------|--------|------|
| 1–6 | Waves 1–2 (de-vendor, carve core) | ✅ DONE | — |
| 7 | Fix `.gitignore` holes | ✅ patterns added — BUT leak file still tracked (see #15) | — |
| 8 | Wave 0 purge history + force-push | ⬜ GATED | rotate 17 keys + explicit "yes" |
| 11 | Wave 3 blockers 4 (social split) & 5 (kayarattan/mater-maria) | 🔶 GATED on Wave 5 | — |
| 12 | Wave 4 — relocate support layers + workspace wiring | ⬜ | — |
| 13 | Wave 5 — Vercel scoping, neosync fix, CI guard, eslint peer-dep | ⬜ | — |
| 14 | Wave 6 — rebrand sweep + GATED merge to main | ⬜ GATED | explicit "yes" |
| 15 | `git rm --cached` leak file + commit to untrack | ⬜ GATED | explicit "yes" (it's a commit) |
| — | Push 4 unpushed commits (incl. `cef7928`) | ⬜ GATED | explicit "yes" |
| — | Triage 12 modified / 49 untracked in dirty tree | ⬜ | user decision needed |

---

## 7. Open decisions waiting on the user

1. **Push the 4 unpushed commits?** (incl. `cef7928` Wave 3 Option B). GATED.
2. **Triage the dirty tree** (modified submodules + 49 untracked) — stage/ignore/discard?
3. **Begin Wave 0 rotation?** (interactive provider logins — `!`-prefix in prompt).
4. **Approve `git rm --cached` + commit** to untrack the leak file (Task #15)?
5. **CLAUDE.md update** — see quality report in this session's transcript; targeted additions proposed (migration context, no-GRIDERA rule, co-author rule, Vercel gotchas, repo-map fix, Heiro-section review). GATED on "yes".

---

## 8. Quick re-entry commands

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
git branch --show-current                    # feat/nexosync-to-nexus-rebrand
git log --oneline @{u}..HEAD                 # the 4 unpushed commits
git ls-files -- '01-CORE-PLATFORM/nexus-backend/agents/integrations/mcp-agents/master.env.backup.20251119_053744'   # confirms still tracked
git check-ignore -v SECURITY-ROTATION-CHECKLIST.md   # confirms gitignored
```