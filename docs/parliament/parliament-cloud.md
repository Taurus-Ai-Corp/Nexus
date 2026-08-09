# Cloud-Only Compliance & Git/Brand Hygiene Review

Repo: /Users/taurus_ai/Documents/Nexus-Platform
Diff: `main...HEAD`
Date: 2026-06-30
Scope: CLOUD-ONLY / BRAND / GIT HYGIENE

## VERDICT: FAIL

The cleanup work itself is directionally correct and cloud-only compliant, but the branch diff is contaminated with large numbers of untracked duplicate files, worktree artifacts, vendored submodules, and binary additions that violate git hygiene. The repo cannot be considered clean for merge until the untracked duplicate-file test passes and the diff set is pruned to the intended cleanup scope.

---

## Critical Flaws

- **2,258 numbered duplicate files still exist in the working tree.** `tests/test_repo_cleanup.py::test_duplicate_numbered_files_do_not_exist` fails on `partnership_research 5.py`, `research_muthoot 7.py`, `package-lock 4.json`, `targeted_research 3.py`, `package 6.json`, and ~2,250 more. The dry-run tool exists but deletion has not been executed, so the repository is not actually cleaned.
- **The diff contains an entire linked worktree as untracked content.** `.worktrees/comply-redirect-feat/` appears in `main...HEAD`, which means git is treating the worktree checkout as new files rather than metadata. This is a git-hygiene violation and will bloat the merge enormously.
- **Massive binary and lock-file duplication.** `.playwright-mcp/*.png` numbered duplicates (e.g. `footer_1440 2.png`, `hero_1440 2.png`), many `package-lock N.json`, `package N.json`, and root-level `.png` screenshots are included in the diff. These should be de-duplicated, ignored, or moved to LFS/artifact storage, not committed.
- **`.gitattributes 2` is an untracked numbered duplicate** of `.gitattributes`. It should be removed before merge.
- **763 untracked files remain** (`git status --short` `??`), far exceeding the intended cleanup additions. The branch diff stat reports 9,529 files and +2.3M/-9.6K lines, which is inconsistent with a scoped cleanup.

## Warnings

- **Subprocess usage in new code is read-only.** `scripts/repo_cleanup_dry_run.py`, `scripts/audit_agent_scripts.py`, and `scripts/cloud_parliament_review.py` use `subprocess.run` only for `git status`, `git ls-files`, `git diff`, and `date`. No `shell=True`, no `os.system`, no destructive commands are invoked. Acceptable.
- **No local model references in the new cleanup code.** Searches for `ollama`, `llama.cpp`, `vLLM`, `AutoModelForCausalLM`, and `transformers` in `scripts/`, `tests/`, `.hermes/nexus/`, and the new docs plans return clean except for the intentional negative-test mention in `tests/test_cloud_parliament.py` and the cloud-only prompt text in `scripts/cloud_parliament_review.py`.
- **Brand split is documented correctly.** `.hermes/nexus/README.md` states: client-facing = "Nexus by Taurus AI"; legal entity = "TAURUS AI Corp.". <!-- brand-allow -->The new NEXUS plans avoid stale NeoSync/BizFlow/NeoVibe references, and the stale plans are archived under `.hermes/archive/2026-04-26-bizflow-neovibe-phase2/`.
- **Commit co-authors are present** on the platform contact commits (`1695e73`, `1ba9c7d`, `64e3c2c`, etc.) but are missing from the cleanup commits (`4e6bd48`, `40e86c8`, `07371cc`). Per project hygiene, the cleanup commits should also carry `Co-Authored-By` trailers.
- **Agent MANIFEST is empty.** `06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md` reports KEEP=0, MERGE=0, DELETE=0 because `scripts/audit_agent_scripts.py` filters to untracked `.py` files and currently finds none in the committed diff. The test passes, but the manifest does not yet reflect real audit decisions.

## Suggestions

1. **Run the deletion phase of the cleanup.** Execute `scripts/repo_cleanup_dry_run.py --delete-confirmed` after reviewing its `/tmp/cleanup-dry-run.json` output, then inspect the 8 different groups manually. Re-run `tests/test_repo_cleanup.py` until it passes.
2. **Remove `.worktrees/comply-redirect-feat/` from the diff.** Register it as a proper git worktree (`git worktree add`) rather than letting its contents be treated as untracked additions.
3. **Add or update `.gitignore`** to exclude `.playwright-mcp/`, `*.png` screenshots, `package-lock *.json` numbered copies, and numbered duplicate lock files.
4. **Delete `.gitattributes 2`.** It is an obvious duplicate.
5. **Amend or follow up the cleanup commits** with `Co-Authored-By: E.Fdz <admin@taurusai.io>` and model co-author trailers to match the platform commits.
6. **Confirm or add a GRIDERA| pre-commit/lint rule.** The project spec requires a brand-rule check flagging `NeoVibe|NeoSync|BizFlow|GridDB` outside an allowlist; the current branch does not add that enforcement.
7. **Re-run `git diff main...HEAD --stat`** after the above and verify it is in the low-hundreds of files, not 9,529.

---

## Cloud-Only Compliance Checklist

- [x] New Python scripts use only cloud API endpoints (OpenRouter, NVIDIA NIM).
- [x] No `ollama run`, `llama.cpp`, `vLLM`, `AutoModelForCausalLM`, or `transformers` imports in new code.
- [x] New plans explicitly forbid local model references.
- [x] No destructive shell/subprocess calls in new code.
- [ ] Git diff is clean enough to merge (FAIL: 2,258 duplicates + worktree artifacts remain).

---

*Review produced by cloud-only static analysis of `git diff main...HEAD` in /Users/taurus_ai/Documents/Nexus-Platform.*
