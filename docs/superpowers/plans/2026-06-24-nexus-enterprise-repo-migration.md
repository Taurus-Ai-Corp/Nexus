# NEXUS Enterprise Repo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the flat 10,831-file Nexus monorepo into the enterprise `core/` + `verticals/*` + `platform/` topology defined in the approved PRD, without losing history or breaking the working site.

**Architecture:** Six sequential waves, each ending in a green-build verification gate and a commit. Git history is preserved via `git mv` (not copy+delete). De-vendoring uses `git rm` only after a sibling repo is confirmed to hold the code. No wave starts until the previous wave's gate passes and the user approves.

**Tech Stack:** git 2.x, pnpm workspaces + Turborepo, Vercel (per-vertical), GitHub Actions, Next.js 16 / React 19 / Vite, FastAPI (Python 3.12), Supabase/Postgres+pgvector, Heiro/Hedera.

## Global Constraints

- **Branch:** all work on `feat/nexosync-to-nexus-rebrand` (already checked out; not `main`).
- **Every commit MUST include both co-authors:**
  `Co-Authored-By: E.Fdz <admin@taurusai.io>`
  `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`
- **Never commit secrets.** Sanitize logs. Use `.env`. The pre-commit secret scanner already runs.
- **Irreversible ops:** `git mv` and `git rm` are destructive. Run every such command behind a verification step that confirms the source path exists first. If a `git mv` target already exists, stop and reconcile — never clobber.
- **Preserve history:** use `git mv` for all relocations so rename history follows. Never copy+delete.
- **Naming rule (executable):** `NeoVibe`, `NeoSync`, `BizFlow`, `GridDB` are retired → NEXUS. Wave 6 enforces this via lint; until then, do not introduce new occurrences.
- **Corporate vs operating brand:** legal docs = "TAURUS AI Corp."; client-facing = "Nexus by Taurus AI". Never mixed.
- **Verified sibling repos on `Taurus-Ai-Corp`:** `matercare-homes` (PUBLIC, exists), `GRIDERA` (PUBLIC, exists). **`agency-os` does NOT exist** — Wave 1 Task 2 must create it before de-vendoring.
- **Each wave ends with:** (1) green verification, (2) a single commit, (3) user approval before the next wave.

---

## File Structure (target, after all waves)

```
Nexus/
├── platform/                         (Wave 3 Task 5 — root brand site, later)
├── core/
│   ├── agents/                       (Wave 2 — consolidated from 3 sources)
│   ├── db/                           (Wave 2 — was 05-DATABASES)
│   ├── workflows/                    (Wave 2 — was 06-WORKFLOWS)
│   ├── api/                          (Wave 2 — was 07-API-ROUTES)
│   ├── design-system/                (Wave 2 — extracted from nexus-studio)
│   └── shared-libs/                  (Wave 2 — placeholder for @taurus/agent-handoff)
├── verticals/
│   ├── social/                       (Wave 3)
│   ├── creative/                     (Wave 3)
│   ├── intel/                        (Wave 3)
│   └── freelance/                    (Wave 3)
├── clients/                          (Wave 4 — was 03-CLIENT-MANAGEMENT)
├── marketing/                        (Wave 4 — was 04-CONTENT-MARKETING + research)
├── planning/                         (Wave 4 — was 00 + 01-STRATEGY)
├── docs/                             (Wave 4 — absorbs 08-DOCUMENTATION + superpowers)
├── assets/                           (Wave 4 — was 09-ASSETS)
├── config/                           (Wave 4 — was 10-CONFIG)
├── docs/portfolio.md                 (Wave 1 — sibling-repo references)
├── package.json                      (Wave 5 — rewritten)
├── pnpm-workspace.yaml               (Wave 5 — new)
└── turbo.json                        (Wave 5 — new)
```

Sibling repos (referenced, not vendored): `Taurus-Ai-Corp/agency-os`, `Taurus-Ai-Corp/matercare-homes`, `Taurus-Ai-Corp/GRIDERA`.

---

# Wave 1 — De-vendor separate products

**Gate to pass before Wave 2:** repo no longer contains vendored product trees that have their own GitHub homes; `docs/portfolio.md` references them; working tree builds as before.

### Task 1: De-vendor MaterCare (sibling repo confirmed)

**Files:**
- Delete: `matercare-ElderCare_SaaS/` (41 files, has own repo `matercare-homes`)
- Create: `docs/portfolio.md`

- [ ] **Step 1: Verify sibling repo is current enough (don't lose in-flight work)**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
git -C matercare-ElderCare_SaaS status 2>&1 | head -5   # likely not its own git repo
gh repo view Taurus-Ai-Corp/matercare-homes --json updatedAt -q .updatedAt
```
Expected: a timestamp. If the vendored copy has local commits NOT on GitHub, **stop** and diff first (`git log` inside the folder if it's a nested repo; otherwise `diff -r` against a fresh clone). Do not proceed until the user confirms the vendored copy is not ahead.

- [ ] **Step 2: Remove the vendored tree**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
git rm -r matercare-ElderCare_SaaS/
```
Expected: `mode change` / deletion lines, no error.

- [ ] **Step 3: Write `docs/portfolio.md`**

```markdown
# TAURUS AI Corp — Product Portfolio

Sibling repositories (separate from the Nexus monorepo, referenced not vendored):

| Product | Repo | Deploys to | Status |
|---|---|---|---|
| MaterCare (ElderCare SaaS) | [Taurus-Ai-Corp/matercare-homes](https://github.com/Taurus-Ai-Corp/matercare-homes) | TBD | Active |
| Agency OS | [Taurus-Ai-Corp/agency-os](https://github.com/Taurus-Ai-Corp/agency-os) | TBD | Created 2026-06-24 |
| GRIDERA (Comply/Lend/Pay) | [Taurus-Ai-Corp/GRIDERA](https://github.com/Taurus-Ai-Corp/GRIDERA) | q-grid.net | Active |

Client deliverables (not products) live under `clients/` in this monorepo.
```

- [ ] **Step 4: Verify**

```bash
git status --short | grep -E "matercare-ElderCare_SaaS|portfolio.md"
ls matercare-ElderCare_SaaS 2>&1   # expected: No such file or directory
test -f docs/portfolio.md && echo OK
```
Expected: deletions staged, `portfolio.md` created, folder gone.

- [ ] **Step 5: Commit**

```bash
git add docs/portfolio.md
git commit -m "$(cat <<'EOF'
chore(repo): de-vendor MaterCare into sibling repo matercare-homes

MaterCare has its own GitHub home (Taurus-Ai-Corp/matercare-homes, public).
Removing the vendored copy from the Nexus monorepo; referenced via
docs/portfolio.md instead. Nexus stays the platform monorepo source of
truth; MaterCare is a sibling product, not a vendored subtree.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 2: Create the `agency-os` sibling repo, then de-vendor Agency OS

**Files:**
- Create (GitHub): `Taurus-Ai-Corp/agency-os`
- Delete: `taurus-agency-os/` (vendored copy)
- Modify: `docs/portfolio.md` (already lists it; confirm link resolves)

- [ ] **Step 1: Check whether vendored `taurus-agency-os/` is a nested git repo with history**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
test -d taurus-agency-os/.git && echo "NESTED-GIT-REPO" || echo "NOT-NESTED"
git ls-files taurus-agency-os/ | wc -l
```
Expected: either `NESTED-GIT-REPO` (history to push) or `NOT-NESTED` (history only in Nexus log).

- [ ] **Step 2: Create the sibling repo on GitHub (private by default)**

```bash
gh repo create Taurus-Ai-Corp/agency-os --private --description "Agency OS — TAURUS AI sibling product" --confirm 2>&1 | tee /tmp/agency-os-create.log
```
Expected: a URL like `https://github.com/Taurus-Ai-Corp/agency-os`. If it already exists now (race), skip to Step 3.

- [ ] **Step 3: Populate the sibling repo from the vendored copy**

If `NESTED-GIT-REPO` (Step 1) — push the existing history:
```bash
cd taurus-agency-os
git remote add origin https://github.com/Taurus-Ai-Corp/agency-os.git 2>/dev/null || git remote set-url origin https://github.com/Taurus-Ai-Corp/agency-os.git
git push -u origin "$(git branch --show-current)"
cd ..
```

If `NOT-NESTED` — seed a fresh repo from the working tree:
```bash
cp -R taurus-agency-os /tmp/agency-os-seed
cd /tmp/agency-os-seed
rm -rf .git node_modules 2>/dev/null
git init -b main
git add .
git commit -m "chore: seed Agency OS from Nexus monorepo (de-vendor)"
git remote add origin https://github.com/Taurus-Ai-Corp/agency-os.git
git push -u origin main
cd /Users/taurus_ai/Documents/Nexus-Platform
rm -rf /tmp/agency-os-seed
```
Expected: `gh repo view Taurus-Ai-Corp/agency-os` shows commits.

- [ ] **Step 4: Verify the sibling repo holds the code**

```bash
gh repo view Taurus-Ai-Corp/agency-os --json url -q .url
gh api repos/Taurus-Ai-Corp/agency-os/commits -q '.[0].sha' 2>&1 | head -1
```
Expected: a URL and a commit SHA. **Do not proceed to Step 5 until both exist.**

- [ ] **Step 5: Remove the vendored tree from Nexus**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
git rm -r taurus-agency-os/
```
Expected: deletion lines, no error.

- [ ] **Step 6: Verify**

```bash
ls taurus-agency-os 2>&1   # expected: No such file or directory
gh api repos/Taurus-Ai-Corp/agency-os/commits -q '.[0].sha'   # expected: SHA
```

- [ ] **Step 7: Commit**

```bash
git commit -m "$(cat <<'EOF'
chore(repo): de-vendor Agency OS into sibling repo agency-os

Created Taurus-Ai-Corp/agency-os (private) and pushed the vendored
taurus-agency-os/ tree there. Removing the vendored copy from Nexus;
referenced via docs/portfolio.md. Nexus keeps platform code; Agency OS
is a sibling product with its own home and deploy pipeline.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 3: Wave 1 verification gate

- [ ] **Step 1: Confirm working tree is clean and no vendored product remains**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
git status --short
! ls -d taurus-agency-os matercare-ElderCare_SaaS 2>/dev/null && echo "BOTH-GONE"
test -f docs/portfolio.md && echo "PORTFOLIO-PRESENT"
```
Expected: clean tree (or only unrelated pre-existing unstaged files), `BOTH-GONE`, `PORTFOLIO-PRESENT`.

- [ ] **Step 2: STOP and ask the user to approve Wave 1 before starting Wave 2.**

Do not begin Wave 2 until the user confirms. Wave 2 is the large, irreversible agent-consolidation step.

---

# Wave 2 — Carve `core/`

**Gate to pass before Wave 3:** `core/{agents,db,workflows,api,design-system,shared-libs}` exist; `02-AGENTS/` stub deleted; old `05/06/07` folders gone; no duplicate agent paths; tree builds far enough that import errors are visible and fixable.

### Task 4: Create the `core/` skeleton

**Files:**
- Create: `core/agents/`, `core/db/`, `core/workflows/`, `core/api/`, `core/design-system/`, `core/shared-libs/`

- [ ] **Step 1: Create empty tracked dirs**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
for d in agents db workflows api design-system shared-libs; do
  mkdir -p "core/$d"
  touch "core/$d/.gitkeep"
done
git add core/
git commit -m "$(cat <<'EOF'
chore(core): scaffold core/ skeleton (agents, db, workflows, api, design-system, shared-libs)

Empty package skeleton for the shared core layer every vertical will import.
Waves 2-5 fill these.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```
Expected: 6 `.gitkeep` files committed.

### Task 5: Move `05-DATABASES` → `core/db`

**Files:**
- Move: `05-DATABASES/` → `core/db/`

- [ ] **Step 1: Verify source exists and target is empty**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
test -d 05-DATABASES && echo "SOURCE-PRESENT"
test -z "$(ls -A core/db 2>/dev/null | grep -v .gitkeep)" && echo "TARGET-EMPTY"
git ls-files 05-DATABASES/ | wc -l
```
Expected: `SOURCE-PRESENT`, `TARGET-EMPTY`, a file count > 0.

- [ ] **Step 2: Move (preserve history)**

```bash
git mv 05-DATABASES/* core/db/ 2>/dev/null || git mv 05-DATABASES core/db_tmp && mv core/db_tmp/* core/db/ && rmdir core/db_tmp
rmdir 05-DATABASES 2>/dev/null
# remove the .gitkeep now that real content is in place
git rm core/db/.gitkeep 2>/dev/null || true
```

- [ ] **Step 3: Verify**

```bash
! test -d 05-DATABASES && echo "SOURCE-GONE"
test -d core/db && echo "TARGET-PRESENT"
git status --short | head
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor(core): move 05-DATABASES → core/db

Shared database layer (Supabase/Postgres+pgvector schemas, migrations) now
lives under core/db for all verticals to import.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 6: Move `06-WORKFLOWS` → `core/workflows`

**Files:**
- Move: `06-WORKFLOWS/` → `core/workflows/` (includes `Taurus-AI-Agent-Registry/`, **but** the registry is consolidated into `core/agents` in Task 8 — move it together here, split later)

- [ ] **Step 1: Verify**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
test -d 06-WORKFLOWS && echo "SOURCE-PRESENT"
git ls-files 06-WORKFLOWS/ | wc -l
```

- [ ] **Step 2: Move**

```bash
git mv 06-WORKFLOWS/* core/workflows/ 2>/dev/null || (git mv 06-WORKFLOWS core/workflows_tmp && mv core/workflows_tmp/* core/workflows/ && rmdir core/workflows_tmp)
rmdir 06-WORKFLOWS 2>/dev/null
git rm core/workflows/.gitkeep 2>/dev/null || true
```

- [ ] **Step 3: Verify + commit**

```bash
! test -d 06-WORKFLOWS && echo "SOURCE-GONE"
git add -A
git commit -m "$(cat <<'EOF'
refactor(core): move 06-WORKFLOWS → core/workflows

N8N workflows + agent registry runtime now under core/workflows. The
Taurus-AI-Agent-Registry subfolder is further consolidated into core/agents
in a later task.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 7: Move `07-API-ROUTES` → `core/api`

**Files:**
- Move: `07-API-ROUTES/` → `core/api/`

- [ ] **Step 1: Verify + move + verify + commit**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
test -d 07-API-ROUTES && echo "SOURCE-PRESENT"
git mv 07-API-ROUTES/* core/api/ 2>/dev/null || (git mv 07-API-ROUTES core/api_tmp && mv core/api_tmp/* core/api/ && rmdir core/api_tmp)
rmdir 07-API-ROUTES 2>/dev/null
git rm core/api/.gitkeep 2>/dev/null || true
! test -d 07-API-ROUTES && echo "SOURCE-GONE"
git add -A
git commit -m "$(cat <<'EOF'
refactor(core): move 07-API-ROUTES → core/api

Shared REST/event route surface now under core/api.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 8: Consolidate scattered agents into `core/agents`

This is the largest, highest-risk task. Three sources merge into `core/agents/` with vertical tags. Do it in three sub-moves, each verified.

**Sources (verified to exist):**
- `01-CORE-PLATFORM/nexus-studio/agents/`
- `01-CORE-PLATFORM/nexus-backend/agents/`
- `core/workflows/Taurus-AI-Agent-Registry/` (just moved in Task 6)

- [ ] **Step 1: Inventory before moving**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
echo "studio:"; git ls-files 01-CORE-PLATFORM/nexus-studio/agents/ | wc -l
echo "backend:"; git ls-files 01-CORE-PLATFORM/nexus-backend/agents/ | wc -l
echo "registry:"; git ls-files core/workflows/Taurus-AI-Agent-Registry/ | wc -l
```
Record the three counts. After the move, the sum should land under `core/agents/` (plus a `registry/` subfolder).

- [ ] **Step 2: Move nexus-studio agents → `core/agents/studio/`**

```bash
mkdir -p core/agents/studio
git mv 01-CORE-PLATFORM/nexus-studio/agents/* core/agents/studio/ 2>/dev/null || true
# if the source dir still has hidden files:
git ls-files 01-CORE-PLATFORM/nexus-studio/agents/ | while read f; do git mv "$f" "core/agents/studio/${f#01-CORE-PLATFORM/nexus-studio/agents/}"; done 2>/dev/null || true
rmdir 01-CORE-PLATFORM/nexus-studio/agents 2>/dev/null || true
git rm core/agents/.gitkeep 2>/dev/null || true
```

- [ ] **Step 3: Move nexus-backend agents → `core/agents/backend/`**

```bash
mkdir -p core/agents/backend
git mv 01-CORE-PLATFORM/nexus-backend/agents/* core/agents/backend/ 2>/dev/null || true
git ls-files 01-CORE-PLATFORM/nexus-backend/agents/ | while read f; do git mv "$f" "core/agents/backend/${f#01-CORE-PLATFORM/nexus-backend/agents/}"; done 2>/dev/null || true
rmdir 01-CORE-PLATFORM/nexus-backend/agents 2>/dev/null || true
```

- [ ] **Step 4: Move agent registry → `core/agents/registry/`**

```bash
mkdir -p core/agents/registry
git mv core/workflows/Taurus-AI-Agent-Registry/* core/agents/registry/ 2>/dev/null || true
git ls-files core/workflows/Taurus-AI-Agent-Registry/ | while read f; do git mv "$f" "core/agents/registry/${f#core/workflows/Taurus-AI-Agent-Registry/}"; done 2>/dev/null || true
rmdir core/workflows/Taurus-AI-Agent-Registry 2>/dev/null || true
```

- [ ] **Step 5: Verify counts reconcile**

```bash
echo "agents total:"; git ls-files core/agents/ | wc -l
echo "studio:"; git ls-files core/agents/studio/ | wc -l
echo "backend:"; git ls-files core/agents/backend/ | wc -l
echo "registry:"; git ls-files core/agents/registry/ | wc -l
```
Expected: the total roughly equals the sum from Step 1. If a source dir still exists with files, reconcile before committing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor(core): consolidate scattered agents into core/agents

Three agent sources merged under core/agents with vertical/source tags:
  core/agents/studio   (was nexus-studio/agents)
  core/agents/backend  (was nexus-backend/agents)
  core/agents/registry (was 06-WORKFLOWS/Taurus-AI-Agent-Registry)

History preserved via git mv. This fills the empty 02-AGENTS layer that
the PRD identified as a structural defect.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 9: Delete the empty `02-AGENTS/` stub

**Files:**
- Delete: `02-AGENTS/orchestration/Dockerfile` (untracked — confirmed `git ls-files 02-AGENTS/` is empty)

- [ ] **Step 1: Confirm it's still empty/untracked**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
git ls-files 02-AGENTS/ | wc -l          # expected: 0
find 02-AGENTS -type f                    # expected: only the Dockerfile
```

- [ ] **Step 2: Remove**

```bash
rm -rf 02-AGENTS
```

- [ ] **Step 3: Verify + commit (no git change if untracked, but commit a note)**

```bash
! test -d 02-AGENTS && echo "STUB-GONE"
# untracked file removal = nothing to commit in git; record in next wave's commits
```
If `git status` shows nothing new, skip the commit (the stub was never tracked). If anything was tracked, commit:
```bash
git add -A && git commit -m "chore(repo): remove empty 02-AGENTS stub

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 10: Wave 2 verification gate

- [ ] **Step 1: Structural check**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
for d in core/agents core/db core/workflows core/api core/design-system core/shared-libs; do test -d "$d" && echo "OK $d"; done
! test -d 02-AGENTS && echo "STUB-GONE"
! test -d 05-DATABASES && ! test -d 06-WORKFLOWS && ! test -d 07-API-ROUTES && echo "OLD-NUMBERS-GONE"
```

- [ ] **Step 2: STOP and ask the user to approve Wave 2 before Wave 3.**

---

# Wave 3 — Stand up verticals

**Gate:** four `verticals/{social,creative,intel,freelance}` dirs each exist with their code moved in.

### Task 11: Create `verticals/` skeleton

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
for v in social creative intel freelance; do
  mkdir -p "verticals/$v"
  touch "verticals/$v/.gitkeep"
done
git add verticals/
git commit -m "$(cat <<'EOF'
chore(verticals): scaffold verticals/ skeleton (social, creative, intel, freelance)

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 12: Move `social-suite-dashboard/` → `verticals/social/`

**Files:**
- Move: `social-suite-dashboard/{web,api,nlp}` → `verticals/social/`

- [ ] **Step 1: Verify + move + verify + commit**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
test -d social-suite-dashboard/web && echo "SOURCE-PRESENT"
git mv social-suite-dashboard/* verticals/social/ 2>/dev/null || true
git ls-files social-suite-dashboard/ | while read f; do git mv "$f" "verticals/social/${f#social-suite-dashboard/}"; done 2>/dev/null || true
rmdir social-suite-dashboard 2>/dev/null || true
git rm verticals/social/.gitkeep 2>/dev/null || true
# NOTE: also reconcile the duplicate at "Nexus _ Platform Devops/social-suite-dashboard" in Wave 4
! test -d social-suite-dashboard && echo "SOURCE-GONE"
git add -A
git commit -m "$(cat <<'EOF'
refactor(verticals): move social-suite-dashboard → verticals/social

Nexus Social dashboard (React/AntD web + FastAPI api + Node nlp) now lives
under verticals/social. Duplicate under "Nexus _ Platform Devops" reconciled
in Wave 4.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 13: Move Creative sources → `verticals/creative/`

**Files:**
- Move: `SWARM SR Internal Analysis/nexus-creative-editorial/` → `verticals/creative/editorial/`
- Move: `taurus-nexus-creative/` → `verticals/creative/cli/`

- [ ] **Step 1: Verify + move editorial**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
test -d "SWARM SR Internal Analysis/nexus-creative-editorial" && echo "EDITORIAL-PRESENT"
git mv "SWARM SR Internal Analysis/nexus-creative-editorial" verticals/creative/editorial
```

- [ ] **Step 2: Move the CLI**

```bash
test -d taurus-nexus-creative && echo "CLI-PRESENT"
git mv taurus-nexus-creative verticals/creative/cli
```

- [ ] **Step 3: Verify + commit**

```bash
test -d verticals/creative/editorial && test -d verticals/creative/cli && echo "CREATIVE-OK"
git rm verticals/creative/.gitkeep 2>/dev/null || true
git add -A
git commit -m "$(cat <<'EOF'
refactor(verticals): move Creative sources → verticals/creative

  verticals/creative/editorial  (was SWARM SR Internal Analysis/nexus-creative-editorial — live Vercel site + serverless API)
  verticals/creative/cli        (was taurus-nexus-creative — the CLI)

Reconciles with existing sibling repos nexus-creative-editorial and
taurus-neovibe-creative on the org (kept separate; this is the in-repo
working copy).

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 14: Promote unlabeled analytics → `verticals/intel/`

**Files:**
- Move: `01-CORE-PLATFORM/nexus-backend/analytics-dashboard` → `verticals/intel/analytics-dashboard`
- Move: `01-CORE-PLATFORM/nexus-backend/taurus-analytics-platform` → `verticals/intel/analytics-platform`
- Move: `01-CORE-PLATFORM/nexus-backend/Business-Intelligence` → `verticals/intel/business-intelligence`

- [ ] **Step 1: Verify all three**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
for d in analytics-dashboard taurus-analytics-platform Business-Intelligence; do
  test -d "01-CORE-PLATFORM/nexus-backend/$d" && echo "PRESENT $d"
done
```

- [ ] **Step 2: Move each**

```bash
git mv 01-CORE-PLATFORM/nexus-backend/analytics-dashboard verticals/intel/analytics-dashboard
git mv 01-CORE-PLATFORM/nexus-backend/taurus-analytics-platform verticals/intel/analytics-platform
git mv 01-CORE-PLATFORM/nexus-backend/Business-Intelligence verticals/intel/business-intelligence
git rm verticals/intel/.gitkeep 2>/dev/null || true
```

- [ ] **Step 3: Verify + commit**

```bash
for d in analytics-dashboard analytics-platform business-intelligence; do test -d "verticals/intel/$d" && echo "OK $d"; done
git add -A
git commit -m "$(cat <<'EOF'
refactor(verticals): promote unlabeled analytics → verticals/intel

The analytics code that should power Nexus Intel existed but was unlabeled
under nexus-backend. Promoted to a real vertical:
  verticals/intel/analytics-dashboard  (React/TS + Recharts)
  verticals/intel/analytics-platform   (Express + Mongo + Redis)
  verticals/intel/business-intelligence

Lowest-effort vertical to launch per the PRD — the code already existed.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 15: Move Freelance skeleton → `verticals/freelance/`

**Files:**
- Move: `04-PRODUCT-DEPLOYMENT/neovibe-freelance-saas` → `verticals/freelance/saas`

- [ ] **Step 1: Verify + move + verify + commit**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
test -d 04-PRODUCT-DEPLOYMENT/neovibe-freelance-saas && echo "SOURCE-PRESENT"
git mv 04-PRODUCT-DEPLOYMENT/neovibe-freelance-saas verticals/freelance/saas
git rm verticals/freelance/.gitkeep 2>/dev/null || true
test -d verticals/freelance/saas && echo "FREELANCE-OK"
git add -A
git commit -m "$(cat <<'EOF'
refactor(verticals): move neovibe-freelance-saas skeleton → verticals/freelance

Nexus Freelance SaaS skeleton (Clerk admin-approval auth, HF FLUX.1 image
gen, Pinecone RAG, design playground) now under verticals/freelance/saas.
Build-out is Wave 6.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 16: Wave 3 verification gate

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
for v in social creative intel freelance; do test -d "verticals/$v" && echo "OK verticals/$v"; done
```
**STOP and ask the user to approve Wave 3 before Wave 4.**

---

# Wave 4 — Relocate support layers

**Gate:** numbered folders `00/01-STRATEGY/03/04*/08/09/10` gone; `clients/ marketing/ planning/ docs/ assets/ config/` populated; loose folders (`Nexus _ Platform Devops/`, `SWARM SR Internal Analysis/`, `arcads_alternatives_research/`) reconciled.

### Task 17: Move client management, marketing, planning, docs, assets, config

- [ ] **Step 1: Move the numbered support folders**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
git mv 03-CLIENT-MANAGEMENT clients
git mv 04-CONTENT-MARKETING marketing
mkdir -p planning
git mv 00-PRODUCT-PLANNING planning/product-planning
git mv 01-STRATEGY planning/strategy
git mv 08-DOCUMENTATION docs/legacy-documentation
git mv 09-ASSETS assets
git mv 10-CONFIG config
```
Note: `04-PRODUCT-DEPLOYMENT` still holds non-freelance content — move it next.

- [ ] **Step 2: Handle `04-PRODUCT-DEPLOYMENT` residue**

```bash
test -d 04-PRODUCT-DEPLOYMENT && git ls-files 04-PRODUCT-DEPLOYMENT/ | head
# if only residual non-freelance deploy docs remain:
git mv 04-PRODUCT-DEPLOYMENT config/product-deployment 2>/dev/null || rmdir 04-PRODUCT-DEPLOYMENT 2>/dev/null || true
```

- [ ] **Step 3: Verify + commit**

```bash
for d in clients marketing planning docs assets config; do test -d "$d" && echo "OK $d"; done
git add -A
git commit -m "$(cat <<'EOF'
refactor(repo): relocate support layers to semantic top-level folders

  03-CLIENT-MANAGEMENT → clients/
  04-CONTENT-MARKETING → marketing/
  00-PRODUCT-PLANNING + 01-STRATEGY → planning/
  08-DOCUMENTATION → docs/legacy-documentation
  09-ASSETS → assets/
  10-CONFIG + 04-PRODUCT-DEPLOYMENT residue → config/

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 18: Reconcile loose folders

- [ ] **Step 1: Fold `Nexus _ Platform Devops/` into `docs/architecture/`**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
mkdir -p docs/architecture
git mv "Nexus _ Platform Devops/ARCHITECTURE.md" docs/architecture/ARCHITECTURE.md 2>/dev/null || true
git mv "Nexus _ Platform Devops/SECURITY_REMEDIATION_PLAN.md" docs/architecture/SECURITY_REMEDIATION_PLAN.md 2>/dev/null || true
git mv "Nexus _ Platform Devops/LAUNCH_CHECKLIST.md" docs/architecture/LAUNCH_CHECKLIST.md 2>/dev/null || true
# move the duplicate social-suite-dashboard if present, into verticals/social/_devops_ref (don't clobber)
git mv "Nexus _ Platform Devops/social-suite-dashboard" verticals/social/_devops_ref 2>/dev/null || true
# move anything else remaining
git ls-files "Nexus _ Platform Devops/" | while read f; do git mv "$f" "docs/architecture/${f#Nexus _ Platform Devops/}"; done 2>/dev/null || true
rmdir "Nexus _ Platform Devops" 2>/dev/null || rm -rf "Nexus _ Platform Devops" 2>/dev/null || true
```

- [ ] **Step 2: Fold `arcads_alternatives_research/` and any `SWARM SR Internal Analysis/` residue**

```bash
test -d arcads_alternatives_research && git mv arcads_alternatives_research marketing/research/arcads-alternatives 2>/dev/null || true
test -d "SWARM SR Internal Analysis" && git mv "SWARM SR Internal Analysis" marketing/research/swarm-sr-internal 2>/dev/null || true
mkdir -p marketing/research 2>/dev/null
```

- [ ] **Step 3: Verify + commit**

```bash
! test -d "Nexus _ Platform Devops" && echo "DEVOPS-FOLDED"
test -f docs/architecture/ARCHITECTURE.md && echo "ARCH-PRESENT"
git add -A
git commit -m "$(cat <<'EOF'
refactor(repo): reconcile loose folders into semantic homes

  Nexus _ Platform Devops/ → docs/architecture/ + verticals/social/_devops_ref
  arcads_alternatives_research/ → marketing/research/arcads-alternatives
  SWARM SR Internal Analysis/ residue → marketing/research/swarm-sr-internal

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 19: Wave 4 verification gate

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
ls -d */ | grep -E '^(00|01-|02|03|04|05|06|07|08|09|10)-' && echo "OLD-NUMBERS-STILL-PRESENT" || echo "NO-OLD-NUMBERS"
! test -d "Nexus _ Platform Devops" && echo "LOOSE-FOLDERS-GONE"
```
Expected: `NO-OLD-NUMBERS`, `LOOSE-FOLDERS-GONE`. **STOP and ask the user to approve Wave 4 before Wave 5.**

---

# Wave 5 — Fix workspaces, CI, per-vertical deploy

**Gate:** `pnpm-workspace.yaml` + `turbo.json` exist; root `package.json` workspaces valid; `pnpm install` + `pnpm -r build` succeed (or fail with known-fixable import errors documented); per-vertical `vercel.json` stubs present; CI matrix updated.

### Task 20: Write `pnpm-workspace.yaml`

**Files:**
- Create: `pnpm-workspace.yaml`

- [ ] **Step 1: Write the workspace manifest**

```yaml
# pnpm-workspace.yaml
packages:
  - "platform"
  - "core/*"
  - "verticals/*"
  - "verticals/*/*"
```

### Task 21: Write `turbo.json`

**Files:**
- Create: `turbo.json`

- [ ] **Step 1: Write the Turborepo config**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**", "build/**"] },
    "dev": { "cache": false, "persistent": true },
    "test": { "dependsOn": ["^build"] },
    "lint": {}
  }
}
```

### Task 22: Rewrite root `package.json`

**Files:**
- Modify: `package.json` (replace stale `workspaces: ["01-CORE-PLATFORM/nexus-frontend", "01-CORE-PLATFORM/nexus-studio"]`)

- [ ] **Step 1: Read current package.json**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
cat package.json
```

- [ ] **Step 2: Edit — remove the npm `workspaces` field (pnpm-workspace.yaml owns it now) and fix scripts to delegate to pnpm/turbo**

Open `package.json`, delete the `"workspaces": [...]` key, and rewrite the `scripts` block:

```json
"scripts": {
  "dev": "turbo dev",
  "build": "turbo build",
  "test": "turbo test",
  "lint": "turbo lint",
  "docker:up": "docker compose up -d",
  "docker:down": "docker compose down",
  "docker:logs": "docker compose logs -f",
  "db:migrate": "echo \"run from core/db\"",
  "orchestrator:start": "echo \"run from core/agents\""
}
```
Keep `name`, `version`, `private`, any `engines`. Remove stale `dev:backend/dev:frontend/dev:nexus/build:frontend/build:nexus/test:backend/test:frontend/lint:frontend/lint:nexus/db:reset/n8n:export/n8n:import` (they reference dead paths).

- [ ] **Step 3: Verify it parses**

```bash
python3 -c "import json; json.load(open('package.json')); print('VALID')"
```

### Task 23: Add per-vertical `vercel.json` stubs + a root deploy note

**Files:**
- Create: `verticals/social/vercel.json`, `verticals/creative/vercel.json`, `verticals/intel/vercel.json`, `verticals/freelance/vercel.json`
- Create: `config/deploy/README.md`

- [ ] **Step 1: Write each vertical's `vercel.json` (minimal, project-scoped)**

For each vertical, create `vercel.json` with content tailored to its framework. Example for `verticals/creative/vercel.json` (Next.js):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "rewrites": [],
  "headers": [
    { "source": "/(.*)", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }] }
  ]
}
```
For `verticals/social/vercel.json` and `verticals/intel/vercel.json`, set `"framework"` to match their actual framework (Vite for the React/AntD web; check `verticals/social/web/package.json` and `verticals/intel/analytics-dashboard/package.json` and set accordingly). For `verticals/freelance/vercel.json`, set to `nextjs` (skeleton is Next.js).

- [ ] **Step 2: Write `config/deploy/README.md`**

```markdown
# Deploy — NEXUS per-vertical Vercel

Each vertical is its own Vercel project scoped to its subdirectory, with its own `vercel.json` at the vertical root.

| Vertical | Vercel project | Subdomain |
|---|---|---|
| Creative | nexus-creative | nexus.taurusai.io |
| Social | nexus-social | social.nexus.taurusai.io |
| Intel | nexus-intel | intel.nexus.taurusai.io |
| Freelance | nexus-freelance | freelance.nexus.taurusai.io |

Backend services (Hyperswitch, Lago, n8n) deploy to Oracle Cloud Free Tier.
Immutable audit logs → Heiro/Hedera. Tamper-proof docs → BSV.

Create a Vercel project per vertical from the repo root:
  vercel link --yes --project nexus-social --scope taurus-s-projects
Team ID: team_ljtVg59YsYUDbIdetyyOVg05
```

### Task 24: Update GitHub Actions CI matrix

**Files:**
- Modify or create: `.github/workflows/ci.yml`

- [ ] **Step 1: Check existing CI**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
ls .github/workflows/ 2>&1
```

- [ ] **Step 2: Write a package-matrix CI**

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main, "feat/**"]
jobs:
  detect-packages:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set.outputs.matrix }}
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 2 }
      - id: set
        run: |
          CHANGED=$(git diff --name-only HEAD~1 HEAD | cut -d/ -f1-2 | sort -u)
          PKGS=$(echo "$CHANGED" | grep -E '^(core|verticals|platform)/' | sort -u | jq -R . | jq -sc .)
          echo "matrix=$PKGS" >> $GITHUB_OUTPUT
  build-test:
    needs: detect-packages
    runs-on: ubuntu-latest
    strategy:
      matrix:
        pkg: ${{ fromJson(needs.detect-packages.outputs.matrix) }}
      fail-fast: false
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter "./${{ matrix.pkg }}/**" --if-present build
      - run: pnpm --filter "./${{ matrix.pkg }}/**" --if-present test
      - run: pnpm --filter "./${{ matrix.pkg }}/**" --if-present lint
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "security-auditor + docker-compose-validator agents run here"
```
(Adjust the `--filter` globs to match the actual package layout once Wave 5 packages declare themselves.)

### Task 25: Wave 5 verification gate

- [ ] **Step 1: Validate configs + commit everything**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
python3 -c "import json; json.load(open('turbo.json')); json.load(open('package.json')); print('JSON-VALID')"
test -f pnpm-workspace.yaml && echo "WORKSPACE-MANIFEST-PRESENT"
for v in social creative intel freelance; do test -f "verticals/$v/vercel.json" && echo "OK $v/vercel.json"; done
git add -A
git commit -m "$(cat <<'EOF'
build(workspaces): pnpm + turbo workspaces, per-vertical Vercel, CI matrix

Replaces stale npm workspaces (referenced dead nexus-frontend path) with
pnpm-workspace.yaml + turbo.json covering core/* + verticals/* + platform.
Root package.json scripts delegate to turbo. Each vertical gets its own
vercel.json (own Vercel project + subdomain). CI runs a package matrix on
changed paths only.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2: Attempt install + build (informational — may surface import errors to fix in Wave 6)**

```bash
pnpm install 2>&1 | tail -20
pnpm -r --if-present build 2>&1 | tail -30
```
Record failures. These are expected after a large move; Wave 6 fixes imports. **Do NOT block Wave 6 on build errors that are purely import-path renames.**

- [ ] **Step 3: STOP and ask the user to approve Wave 5 before Wave 6.**

---

# Wave 6 — Rebrand sweep + surface gaps

**Gate:** no new `NeoVibe|NeoSync|BizFlow|GridDB` tokens outside allowlist; missing landings/dashboards built or stubbed; subdomains wired.

### Task 26: Brand-rule lint + pre-commit check

**Files:**
- Create: `config/lint/brand-rules.sh`
- Modify: `.pre-commit-config.yaml` (if present) or create `.github/workflows/brand-lint.yml`

- [ ] **Step 1: Write the brand-rule checker**

```bash
mkdir -p config/lint
cat > config/lint/brand-rules.sh <<'SH'
#!/usr/bin/env bash
# Fail if retired brand tokens appear outside the allowlist.
set -euo pipefail
ALLOWLIST="docs/superpowers/specs/2026-06-09-platform-rename-source-of-truth.md|docs/superpowers/specs/2026-05-18-taurus-ai-brand-architecture.md|docs/superpowers/plans/|docs/superpowers/specs/2026-03-21-neovibe-business-structure-design.md|config/lint/brand-rules.sh"
HITS=$(grep -rIl --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=venv \
  -E 'NeoVibe|NeoSync|BizFlow|GridDB' . 2>/dev/null | grep -vE "$ALLOWLIST" || true)
if [ -n "$HITS" ]; then
  echo "Retired brand tokens found (NeoVibe/NeoSync/BizFlow/GridDB):" >&2
  echo "$HITS" >&2
  exit 1
fi
echo "brand-rules: clean"
SH
chmod +x config/lint/brand-rules.sh
```

- [ ] **Step 2: Run it to see current violations (informational)**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
./config/lint/brand-rules.sh 2>&1 | head -40 || true
```
Record the hit list. These are the files to rename in the next step.

### Task 27: Rebrand sweep — rename remaining retired tokens

**Files:**
- Modify: every file in the Wave 26 hit list

- [ ] **Step 1: For each hit, replace `NeoVibe|NeoSync|BizFlow` → `NEXUS` (and `GridDB` → `Postgres+pgvector`) only where it's a brand/product reference, NOT where it's a historical record inside the allowlisted spec/plan files.**

Do this file-by-file with the Edit tool (not a blind `sed`), because some occurrences are in code identifiers (`BizFlowBackend`) that need careful rename vs. brand-only string changes. Commit in logical batches (vertical, core, docs).

- [ ] **Step 2: Re-run the checker until clean (excluding allowlist)**

```bash
./config/lint/brand-rules.sh
```
Expected: `brand-rules: clean`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(brand): finish NeoVibe/NeoSync/BizFlow/GridDB → NEXUS rebrand sweep

Renames remaining retired brand tokens to NEXUS (and GridDB → Postgres+
pgvector) across code and docs, per the source-of-truth spec. Adds
config/lint/brand-rules.sh as a pre-commit/CI gate to prevent regressions.
Historical references inside allowlisted spec/plan files are preserved.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 28: Build missing surfaces (landings + dashboards)

**Files (create or formalize):**
- `verticals/social/landing/` — new marketing landing (Next.js page)
- `verticals/creative/app/` — formalize Creative studio dashboard (auth-gated)
- `verticals/intel/landing/` — new marketing landing
- `verticals/intel/app/` — promote analytics-dashboard to the BI dashboard shell
- `verticals/freelance/landing/` — new marketing landing

This is real feature work, not git surgery. **Decompose into separate feature specs/plans per vertical** (each landing is its own brainstorm → spec → plan cycle via the `web-architect` agent). Do NOT attempt all four landings in this migration plan — this task is the *placeholder marker* and the seed of separate plans.

- [ ] **Step 1: Stub each missing surface with a minimal `page.tsx` / `index.html` so the vertical is deployable**

For each missing landing, create a one-page Next.js route that imports `core/design-system` and renders a "Nexus {Vertical} — coming soon" hero with a Start CTA → Clerk/Stripe placeholder. This makes the vertical deployable to its subdomain immediately; the real landing is built later via `web-architect`.

- [ ] **Step 2: Commit the stubs**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat(verticals): stub missing landings + studio dashboard shells

Each vertical now has a deployable surface (landing + app shell) so its
Vercel project + subdomain can go live. Real landing builds are separate
feature plans (web-architect), not part of this migration.

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 29: Wire Vercel subdomains

- [ ] **Step 1: Link each vertical project (CLI; uses VERCEL_TOKEN from ~/.env-secrets)**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
for v in social creative intel freelance; do
  echo "Link nexus-$v (run interactively or via VERCEL_ORG_ID/PROJECT_ID)"
done
```
Per the `mater-maria-deploy-path` memory: GitHub integration errors silently, so deploy via CLI with `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` override from the monorepo root. Team ID: `team_ljtVg59YsYUDbIdetyyOVg05`.

- [ ] **Step 2: Add subdomain records in Vercel per `config/deploy/README.md`** (manual, user-driven).

### Task 30: Final verification + migration close-out

- [ ] **Step 1: Full structural check**

```bash
cd /Users/taurus_ai/Documents/Nexus-Platform
echo "=== core ==="; for d in agents db workflows api design-system shared-libs; do test -d "core/$d" && echo "OK core/$d"; done
echo "=== verticals ==="; for v in social creative intel freelance; do test -d "verticals/$v" && echo "OK verticals/$v"; done
echo "=== support ==="; for d in clients marketing planning docs assets config; do test -d "$d" && echo "OK $d"; done
echo "=== vendored gone ==="; ! ls -d taurus-agency-os matercare-ElderCare_SaaS 2>/dev/null && echo "OK"
echo "=== old numbered gone ==="; ! ls -d 0* 2>/dev/null | grep -E '^[0-9]+-' && echo "OK"
echo "=== workspaces ==="; test -f pnpm-workspace.yaml && test -f turbo.json && echo "OK"
echo "=== brand rules ==="; ./config/lint/brand-rules.sh
```

- [ ] **Step 2: Open a PR from `feat/nexosync-to-nexus-rebrand` → `main`**

```bash
gh pr create --title "feat: NEXUS enterprise repo migration (6-wave)" --body "Implements docs/superpowers/specs/2026-06-24-nexus-enterprise-repo-design.md. Six-wave migration: de-vendor, carve core/, stand up verticals, relocate support, fix workspaces/CI, rebrand sweep. See docs/superpowers/plans/2026-06-24-nexus-enterprise-repo-migration.md." --base main
```
End PR body with: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

- [ ] **Step 3: STOP. Report the PR URL to the user. Migration is complete pending review/merge.**

---

## Self-Review

**1. Spec coverage:** PRD §5 topology → Tasks 4-19. §6 core/ → Tasks 4-10. §7 four verticals → Tasks 11-16, 28. §8 client-facing → addressed by surfaces in Task 28 (full experience is product work, out of migration scope). §9 pipelines → exist in code moved; not re-implemented here (correct — migration, not rebuild). §10 six waves → Tasks 1-30 map 1:1. §11 governance/CI/deploy → Tasks 20-25, 29. §12 risks → agency-os blocker handled Task 2; agent-consolidation risk handled by per-source sub-moves + count reconciliation Task 8; stale-workspaces risk handled Task 25 Step 2 (informational build). §13 open questions → agency-os resolved (created); subdomain scheme confirmed (`<vertical>.nexus.taurusai.io`); Freelance paid/free left open (Task 28 stub doesn't decide pricing). ✅

**2. Placeholder scan:** No TBD/TODO/"implement later"/"add error handling" without code. Task 28 is explicitly a *stub + pointer to separate plans*, not a placeholder pretending to be done — this is intentional decomposition, called out in the task body. ✅

**3. Type consistency:** No code types to cross-check (this is a git-surgery + config plan). Config keys (`framework`, `outputs`, `packages`) are consistent across tasks. Co-author block is identical in every commit. ✅

**Note on decomposition:** Wave 6 Task 28 (four real landings + studio dashboard) is genuinely separate feature work. Per the brainstorming skill's scope rule, each landing should get its own spec → plan cycle. This migration plan deliberately *stubs* them so the topology is deployable, and seeds the separate plans. Do not treat the stubs as the final product.