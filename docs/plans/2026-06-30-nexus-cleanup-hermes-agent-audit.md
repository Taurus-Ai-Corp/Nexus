# NEXUS Repo Cleanup, .hermes Rebuild, and Agent Audit Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task. Use test-driven-development for every code task. Use cloud-only multi-model parliament (NVIDIA NIM primary, OpenRouter fallback) for final verification.

**Goal:** Clean the Nexus-Platform repository of duplicate generated files, rebuild the `.hermes` plan directory for the current NEXUS scope, and audit untracked agent scripts for keep vs delete.

**Architecture:** In-place repo surgery. No external deploy. Preserve committed history. All destructive operations require explicit human approval and run through dry-run first.

**Tech Stack:** Git, Python 3, bash, cloud LLM parliament (NIM/OpenRouter/Claude/GPT).

---

## Pre-conditions / Safety Rules

1. NO `git push` to origin without human approval.
2. NO file deletion without dry-run preview + human confirmation.
3. TDD for every Python helper script.
4. Cloud-only LLM inference for swarm analysis (no local Ollama/llama.cpp/vLLM).
5. Before each destructive task, subagent must report exactly what will change and ask for `PROCEED`.

---

## Task A: Clean Duplicate Numbered Files

**Objective:** Remove 1,606 identical numbered-duplicate files (`file 2.py`, `file 3.py`, etc.) while preserving the canonical `file.py` and inspecting the 8 non-identical groups.

### Task A1: Write failing test for duplicate cleanup

**Files:**
- Create: `tests/test_repo_cleanup.py`

**Step 1: Write failing test**

```python
import os, re, subprocess, pytest

ROOT = '/Users/taurus_ai/Documents/Nexus-Platform'

def _find_numbered_files(root):
    numbered = []
    for dirpath, _, filenames in os.walk(root):
        if '/node_modules' in dirpath or '/.git' in dirpath:
            continue
        for f in filenames:
            if re.search(r' \d+\.(py|js|ts|jsx|tsx|json|yml|yaml|md|html|css|txt)$', f):
                numbered.append(os.path.join(dirpath, f))
    return numbered

def test_duplicate_numbered_files_do_not_exist():
    numbered = _find_numbered_files(ROOT)
    assert numbered == [], f"Found {len(numbered)} numbered duplicate files: {numbered[:10]}..."
```

**Step 2: Run test to verify failure**

Run: `python3 -m pytest tests/test_repo_cleanup.py -v`
Expected: FAIL — reports 1,815 numbered files exist.

**Step 3: Build dry-run tool**

Create: `scripts/repo_cleanup_dry_run.py`

Requirements:
- Group numbered files by canonical base name.
- Compute SHA-256 of each group.
- Print identical groups and the 8 different groups with hashes.
- Do NOT delete anything.

**Step 4: Run dry-run and show output**

Run: `python3 scripts/repo_cleanup_dry_run.py > /tmp/cleanup-dry-run.txt`
Expected: prints 443 identical groups and 8 different groups.

**Step 5: Commit test + dry-run tool**

```bash
git add tests/test_repo_cleanup.py scripts/repo_cleanup_dry_run.py
git commit -m "test(repo-cleanup): add failing test and dry-run tool for duplicate numbered files"
```

### Task A2: Human approval gate

**Objective:** Present dry-run summary to user and ask for `PROCEED` before deletion.

Output format:
```
Identical duplicate groups: 443
Total removable copies: 1,606
Different duplicate groups: 8 (requires manual inspection)
Top affected directories:
  - Nexus _ Platform Devops/code: 77 copies
  - 01-CORE-PLATFORM/nexus-backend/agents/integrations/mcp-agents: 64 copies
  - 06-WORKFLOWS/Taurus-AI-Agent-Registry/agents: 44 copies
  ...

APPROVE deletion of 1,606 identical numbered copies? (yes/no/inspect)
```

**Subagent must wait for user response.**

### Task A3: Delete identical duplicates

**Objective:** Delete only the confirmed identical copies, leaving the canonical file.

**Step 1: Implement deletion script**

Modify `scripts/repo_cleanup_dry_run.py` to accept `--delete-confirmed` flag. When passed, it deletes every numbered copy that is byte-identical to the canonical file. It does NOT delete different groups.

**Step 2: Run with human approval**

Run: `python3 scripts/repo_cleanup_dry_run.py --delete-confirmed`
Expected: 1,606 files deleted. Test still fails because 8 different groups + root-level package duplicates remain.

**Step 3: Handle different groups manually**

For each of the 8 different groups:
- Identify the most recent / highest-numbered version.
- If it differs from canonical, print diff summary and ask user whether to replace canonical or keep separate.
- Do NOT auto-overwrite canonical files.

**Step 4: Verify test progresses**

Run: `python3 -m pytest tests/test_repo_cleanup.py -v`
Expected: After all duplicate files resolved, PASS.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore(repo): remove 1,606 identical numbered duplicate files"
```

---

## Task B: Rebuild `.hermes` Plan Directory for Current NEXUS Scope

**Objective:** Replace stale NeoSync/BizFlow-era `.hermes` plans with a NEXUS-centric plan tree that matches the current platform structure in `CLAUDE.md`.

### Task B1: Write failing test for .hermes structure

**Files:**
- Create: `tests/test_hermes_plan_structure.py`

**Step 1: Write failing test**

```python
import os, re
import pytest

ROOT = '/Users/taurus_ai/Documents/Nexus-Platform'
HERMES = os.path.join(ROOT, '.hermes')

def _list_md_files(path):
    out = []
    if os.path.isdir(path):
        for dirpath, _, filenames in os.walk(path):
            for f in filenames:
                if f.endswith('.md'):
                    out.append(os.path.join(dirpath, f))
    return out

def test_hermes_plan_directory_exists_with_nexus_content():
    assert os.path.isdir(HERMES), f".hermes dir missing at {HERMES}"
    md_files = _list_md_files(HERMES)
    assert len(md_files) >= 3, f"Expected >=3 .md files in .hermes, found {len(md_files)}"
    contents = ' '.join(open(f).read() for f in md_files)
    assert 'NEXUS' in contents or 'Nexus' in contents, "Plans must reference NEXUS scope"
    assert 'platform/' in contents or 'nexus.taurusai.io' in contents, "Plans must reference NEXUS marketing site"

def test_no_stale_neosync_bizflow_references():
    md_files = _list_md_files(HERMES)
    stale = []
    for f in md_files:
        text = open(f).read()
        if re.search(r'\bNeoSync\b|\bBizFlow\b|\bNeoVibe\b', text):
            stale.append(f)
    assert stale == [], f"Stale brand references in: {stale}"
```

**Step 2: Run test to verify failure**

Run: `python3 -m pytest tests/test_hermes_plan_structure.py -v`
Expected: FAIL — stale NeoSync/BizFlow references exist in `.hermes/product_management/2026-04-26_014342-prd-bizflow-neovibe-phase2.md`.

### Task B2: Create new NEXUS .hermes plan files

**Files to create:**
- `.hermes/nexus/README.md` — index of current NEXUS plans.
- `.hermes/nexus/platform/2026-06-30-website-rebuild.md` — plan for `platform/` marketing site.
- `.hermes/nexus/platform/2026-06-30-contact-smtp.md` — plan for Brevo/OpenSend contact backend.
- `.hermes/nexus/agents/2026-06-30-agent-registry-cleanup.md` — plan for Taurus-AI-Agent-Registry cleanup.

Each plan must reference:
- Current repo structure from `CLAUDE.md`
- `platform/` static site
- `01-CORE-PLATFORM/`, `03-CLIENT-MANAGEMENT/`, `06-WORKFLOWS/`
- Cloud-only inference rule
- Human-in-the-loop gates

**Step 3: Archive stale plans**

Move old files to `.hermes/archive/2026-04-26-bizflow-neovibe-phase2/` instead of deleting. Update README with archive location.

**Step 4: Run test to verify pass**

Run: `python3 -m pytest tests/test_hermes_plan_structure.py -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add -A
git commit -m "docs(.hermes): rebuild NEXUS plan directory and archive stale NeoSync/BizFlow plans"
```

---

## Task C: Audit Untracked Agent Scripts

**Objective:** Classify untracked files under `06-WORKFLOWS/Taurus-AI-Agent-Registry/` and related paths into KEEP, MERGE, or DELETE, then act on them.

### Task C1: Write failing test for untracked script audit

**Files:**
- Create: `tests/test_agent_script_audit.py`

**Step 1: Write failing test**

```python
import os, subprocess, pytest, re

ROOT = '/Users/taurus_ai/Documents/Nexus-Platform'

def _untracked_files():
    lines = subprocess.run(['git','-C',ROOT,'status','--short'], capture_output=True, text=True).stdout.splitlines()
    return [line[3:] for line in lines if line.startswith('??')]

def test_no_untracked_numbered_duplicates_remain():
    untracked = _untracked_files()
    numbered = [f for f in untracked if re.search(r' \d+\.[a-z]+$', f)]
    assert numbered == [], f"Untracked numbered duplicates remain: {numbered[:10]}"

def test_agent_registry_has_manifest():
    manifest = os.path.join(ROOT, '06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md')
    assert os.path.exists(manifest), f"Missing MANIFEST.md for agent registry"
```

**Step 2: Run test to verify failure**

Run: `python3 -m pytest tests/test_agent_script_audit.py -v`
Expected: FAIL — MANIFEST.md missing, numbered duplicates exist (after Task A should be gone but this test ensures it stays gone).

### Task C2: Build audit scanner

**Files:**
- Create: `scripts/audit_agent_scripts.py`

Requirements:
- Walk `06-WORKFLOWS/`, `04-PRODUCT-DEPLOYMENT/platform-dev/`, `01-CORE-PLATFORM/nexus-backend/agents/`, `social-suite-dashboard/`.
- For each untracked `.py` file, inspect first 20 lines for `class`, `def main`, `async def`, import summary.
- Categorize:
  - **KEEP** — unique, referenced, or has `__main__`/entry point.
  - **MERGE** — similar to an existing committed file (suggest merge).
  - **DELETE** — numbered duplicate, empty, or trivial stub.
- Output JSON to `/tmp/agent-audit-report.json` and human-readable Markdown to `06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md`.

**Step 3: Run scanner**

Run: `python3 scripts/audit_agent_scripts.py`
Expected: creates `06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md` with KEEP/MERGE/DELETE table.

**Step 4: Human approval gate**

Present summary to user:
```
Agent script audit complete.
KEEP: N files
MERGE: N files
DELETE: N files

APPROVE moving DELETE files to .hermes/archive/deleted-agent-scripts-2026-06-30/? (yes/no/inspect)
```

**Step 5: Move approved DELETE files to archive**

Do not `rm`; move to `.hermes/archive/deleted-agent-scripts-2026-06-30/`. This preserves history and keeps git from seeing them.

**Step 6: Verify test passes**

Run: `python3 -m pytest tests/test_agent_script_audit.py -v`
Expected: PASS.

**Step 7: Commit**

```bash
git add -A
git commit -m "chore(agents): audit untracked scripts, add MANIFEST, archive deletions"
```

---

## Task D: Cloud-Only Multi-Model Parliament Review

**Objective:** Run a cloud-only parliament over the final diff to catch any issues before the user merges.

### Task D1: Build parliament runner

**Files:**
- Create: `scripts/cloud_parliament_review.py`

Requirements:
- Read the diff of the working branch vs `main` from `git diff main...HEAD`.
- Build verification prompt:
  ```
  Review the following repository changes for:
  - Security risks (exposed secrets, unsafe subprocess, SQL injection, XSS)
  - Safety risks (destructive file operations, data loss, missing backups)
  - Correctness (tests actually verify intended behavior, no tautologies)
  - Cloud-only compliance (no local model references in new code)
  - Git hygiene (no secrets in diff, no massive binary additions)

  Output JSON with keys: critical_flaws[], warnings[], suggestions[], overall_pass boolean.
  ```
- Call cloud endpoints only:
  - NVIDIA NIM `nvidia/nemotron-3-ultra-550b-a55b` (primary)
  - NVIDIA NIM `nvidia/qwen2.5-coder-32b-instruct`
  - OpenRouter `openai/gpt-oss-20b:free`
  - Anthropic `claude-3-5-sonnet-20241022`
  - OpenAI `gpt-4o-mini`
- Save per-model outputs to `/tmp/parliament-<model>.md` and consensus to `/tmp/parliament-consensus.md`.

**Step 2: Run parliament**

Run: `python3 scripts/cloud_parliament_review.py`
Expected: produces `/tmp/parliament-consensus.md`.

**Step 3: Report to user**

Print:
- Overall pass/fail
- Critical flaws (if any)
- Warnings
- Suggestions

If critical flaws exist, halt and ask user before any further action.

---

## Final Verification

Run full test suite:

```bash
python3 -m pytest tests/ -q
```

Expected: all tests pass.

---

## Task Order & Human Gates

1. A1 (TDD test + dry-run tool) → no human gate
2. A2 (human approval) → **STOP for approval**
3. A3 (delete duplicates + inspect diffs)
4. B1 (TDD test for .hermes) → no human gate
5. B2-B4 (rebuild .hermes)
6. C1-C3 (audit scanner + manifest) → no human gate
7. C4 (human approval) → **STOP for approval**
8. C5-C7 (archive deletions)
9. D1-D3 (cloud parliament review)
10. Final full test run

---

## Definition of Done

- [ ] 1,606 identical numbered duplicates removed.
- [ ] 8 different duplicate groups inspected and resolved (canonical preserved or updated with approval).
- [ ] `.hermes/` rebuilt with NEXUS plans, old plans archived.
- [ ] `06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md` exists with KEEP/MERGE/DELETE decisions.
- [ ] DELETE files archived, not permanently removed.
- [ ] Cloud parliament consensus report saved.
- [ ] All new Python scripts have tests.
- [ ] Full test suite passes.
- [ ] No destructive git push performed.
