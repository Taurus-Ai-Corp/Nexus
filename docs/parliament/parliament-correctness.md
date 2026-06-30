# Correctness / TDD Review — NEXUS Repo Cleanup Branch

**Repo:** `/Users/taurus_ai/Documents/Nexus-Platform`  
**Diff:** `git diff main...HEAD`  
**Verdict:** ❌ **FAIL** — the branch lands useful tooling and tests, but the primary cleanup test still fails and the committed MANIFEST contradicts the worktree state.

---

## What the diff contains

New files scoped by the task are present and tracked:

- `tests/test_repo_cleanup.py` — failing test for numbered duplicate files.
- `scripts/repo_cleanup_dry_run.py` — SHA-256 scanner, no deletion.
- `tests/test_agent_script_audit.py` — asserts no untracked numbered duplicates and manifest exists.
- `scripts/audit_agent_scripts.py` — untracked `.py` classifier.
- `06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md` — generated audit table.
- `scripts/cloud_parliament_review.py` + `tests/test_cloud_parliament.py` — parliament runner and smoke tests.
- `tests/test_hermes_plan_structure.py` — `.hermes` NEXUS plan validation.
- `docs/plans/2026-06-30-nexus-cleanup-hermes-agent-audit.md` — implementation plan.
- `.hermes/nexus/` — new NEXUS plans plus `README.md`.
- `.hermes/archive/2026-04-26-bizflow-neovibe-phase2/` — archived stale plans.

---

## Test execution results

Ran:

```bash
python3 -m pytest tests/test_repo_cleanup.py tests/test_agent_script_audit.py \
                  tests/test_cloud_parliament.py tests/test_hermes_plan_structure.py -v
```

Result: **1 failed, 7 passed**

| Test | Result |
|------|--------|
| `test_duplicate_numbered_files_do_not_exist` | **FAIL** — finds 2,258 numbered files |
| `test_no_untracked_numbered_duplicates_remain` | PASS |
| `test_agent_registry_has_manifest` | PASS |
| `test_script_exists` | PASS |
| `test_build_prompt_from_fake_diff` | PASS |
| `test_git_diff_main_head_exists` | PASS |
| `test_hermes_plan_directory_exists_with_nexus_content` | PASS |
| `test_no_stale_neosync_bizflow_references` | PASS |

---

## Critical flaws (branch does not meet its own Definition of Done)

1. **Primary TDD test still fails.** `tests/test_repo_cleanup.py` was committed to fail and was never driven to pass. The plan promises 1,606 duplicates removed; the working tree currently contains 2,258 numbered duplicates. This is the central correctness gate of the branch and it is red.
2. **Committed MANIFEST is empty.** The tracked `06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md` reports 0 KEEP / 0 MERGE / 0 DELETE, even though `git status --short` shows hundreds of untracked `.py` files under `06-WORKFLOWS/`, `01-CORE-PLATFORM/nexus-backend/agents/`, `04-PRODUCT-DEPLOYMENT/platform-dev/`, etc. The audit script either was not run against the current worktree or its output was not committed. The committed file is effectively a stub and does not match the plan’s expected output.

---

## Warnings

- **Duplicate directories with numeric suffixes.** `.hermes/product_management 2/`, `.hermes/development_plans 2/`, and `.hermes/NEOFLOW™ 2/` exist and are untracked. They are not captured by the file-extension regex used in `test_repo_cleanup.py` or `repo_cleanup_dry_run.py`, so the scanner undercounts the duplicate problem.
- **Dry-run scanner may count many non-identical groups.** The repo has root-level numbered files such as `package 6.json`, `package-lock 8.json`, `research_muthoot 7.py`, and many nested numbered duplicates that differ from their canonical versions. The plan’s assumption of 443 identical groups / 8 different groups is stale relative to the current tree.
- **Hard-coded root path.** All tests and scripts embed `ROOT = '/Users/taurus_ai/Documents/Nexus-Platform'`. They cannot be run in a CI container or a different checkout without editing source.
- **`repo_cleanup_dry_run.py` is not fully exercised by tests.** It is only exercised indirectly by `test_repo_cleanup.py`, and that test checks the final state, not the scanner’s structured output. There is no test asserting `scan()` returns the expected JSON schema, identical/different grouping, or that the tool never mutates the filesystem.
- **`cloud_parliament_review.py` imports `aiohttp` lazily and is network-dependent.** The existing tests only verify the prompt builder and that the git diff command returns non-empty output. They do not verify provider call success or JSON parsing. This is acceptable as a smoke-test suite, but it does not prove the parliament actually functions.
- **`audit_agent_scripts.py` lacks tests.** No unit tests verify `_inspect_head`, `_is_merge_candidate`, `_is_untracked`, or the structured JSON/Markdown output. The plan explicitly says TDD for every Python helper script, yet this script ships without tests.
- **Stale `.worktrees/` content inflates `git status`.** The audit script deliberately skips `.worktrees/`, which is correct, but the worktree files still create visual noise that can confuse human review.

---

## Suggestions

1. **Drive `test_repo_cleanup.py` to green before merge.** Either delete the confirmed identical numbered copies or narrow the test scope to committed files only. The current test asserts the entire working tree, which is impossible to satisfy until the cleanup script is actually run with a delete flag.
2. **Regenerate and commit a real MANIFEST.** Run `scripts/audit_agent_scripts.py` and commit the resulting `06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md`. Add a test that checks the manifest contains at least one row and that the row count equals the number of untracked `.py` files it scanned.
3. **Add tests for scanner return values.** Assert `repo_cleanup_dry_run.scan()` returns keys `root`, `total_numbered`, `identical_groups`, `different_groups`, `removable_count`, and that the same script run does not delete files (e.g. re-run and assert file count unchanged).
4. **Add unit tests for `audit_agent_scripts.py`.** Create synthetic untracked files in a temporary clone or use `monkeypatch` to mock `git status` and `git ls-files`, then verify the classifier returns expected KEEP/MERGE/DELETE decisions.
5. **Normalize hard-coded paths.** Use `Path(__file__).resolve().parents[1]` (for `tests/`) and `Path(__file__).resolve().parents[2]` (for `scripts/`) or `os.environ.get('NEXUS_ROOT', ...)` so the tooling is portable.
6. **Extend duplicate detection to directories.** The ` 2` directories under `.hermes/` are also cleanup artifacts and should be addressed or explicitly exempted in the test/dry-run.
7. **Archive the approved DELETE files.** The plan’s definition of done requires DELETE files to be moved to `.hermes/archive/deleted-agent-scripts-2026-06-30/` rather than left in the worktree as untracked files.
8. **Run the cloud parliament before merge.** The parliament runner is present but there is no evidence in `/tmp/parliament-consensus.md` that it was executed. If keys are unavailable, document that in the review.

---

## Bottom line

The branch establishes the right testing *shape* and adds valuable non-destructive scanners, but it has not completed the cleanup it was created to perform. The failing `test_repo_cleanup.py` and empty committed MANIFEST are blockers. Fix those two issues, add the missing scanner tests, and re-run the full suite before considering the branch ready for parliament review and merge.
