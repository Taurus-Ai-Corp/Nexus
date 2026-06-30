# Security & Safety Review: git diff main...HEAD

**Repository:** /Users/taurus_ai/Documents/Nexus-Platform  
**Branch range:** main...HEAD  
**Commit count:** 35 commits  
**Files changed:** 9,529 files  
**Net insertions/deletions:** +2,298,708 / -9,620  
**Review scope:** security, secrets, destructive operations, binaries, subprocess safety, and gitleaks/pre-commit hygiene.

## Verdict: FAIL (needs remediation before merge)

The cleanup work itself is constructive, but the diff is **massive, noisy, and includes a large amount of pre-existing (and newly copied) unsafe code, hardcoded credentials, and binary bloat**. Because the branch is effectively a monorepo-wide snapshot that touches ~10k files, the security review must treat the full diff as incoming changes. Several existing credentials that are now part of HEAD have rotated into the diff, and the repository contains duplicated copies that magnify the leak surface. The branch cannot be considered safe to merge until the listed critical flaws are resolved.

## Critical Flaws

- **Hardcoded API key in source.** `01-CORE-PLATFORM/nexus-backend/08-shared/scripts/jina_converter_utils.py` (and its numbered duplicates `2.py`/`3.py`/`4.py`) contains a real-looking Jina API key: `jina_492c48beb31643e3b5a81c4052fa0628fS7ORRidO2zZAueI2W9OgX1QPDML`. The same key is also in `url_to_md_json_converter.py` and duplicates. This must be rotated immediately and replaced with an environment variable.
- **Anthropic-style key in debug file.** `01-CORE-PLATFORM/nexus-backend/debug-api-error.py` (and `2.py`/`3.py`/`4.py`/`5.py`/`6.py`/`7.py`) contains `api_key="sk-ant...pwAA"`. Even if truncated, this is a committed secret pattern and must be removed.
- **Numbered duplicate explosion amplifies secrets exposure.** The diff adds ~1,500 files with names like `file 2.py`, `file 3.py`, etc. Each duplicate copies the original secrets, meaning the leaked Jina/Anthropic keys are replicated across multiple paths, surviving a naive deletion of one file.
- **Token query strings in workflow filenames.** Files under `taurus-ai-corp-ci-audit/workflows/...` have names such as `ci.yml?token=BS4FZW2SVTVOIORN5OG2BA3KHVJWZAA`. Query-string tokens in path names are still stored in git and can be exposed; these appear to be GitHub raw token parameters and should be removed or redacted.
- **Worktree copy of a feature branch is being committed.** `.worktrees/comply-redirect-feat/` is a full git-worktree checkout embedded in the main repo. It duplicates hundreds of files (including binaries and config) and should not be merged into the main branch.

## Warnings

- **Massive binary additions.** The diff adds ~1,188 binary files, including ~606 PNGs, ~245 WEBPs, ~186 JPEGs, and ~57 MP4s. Many are screenshots and Playwright snapshots (`.playwright-mcp/`) that contain UI state and may inadvertently capture PII or session data. Several files exceed 1 MB; the repository gained multi-megabyte assets that will permanently bloat history.
- **Noisy `2` suffix files everywhere.** Beyond Python duplicates, the diff contains thousands of `*. 2.*` files (e.g., `.claude/agents/security-auditor 2.md`, `.gitattributes 2`, `package-lock 2.json`, `footer_1440 2.png`). These are macOS/IDE artifact duplicates and should be purged.
- **Destructive scripts exist, though the new cleanup scanner is safe.** Pre-existing scripts such as `taurus-ai-corp-ci-audit/add_missing_ci.py` and `fix_ci.py` use `subprocess.run(..., shell=isinstance(cmd, str))`, which can invoke shell parsing if passed a string. New cleanup scripts (`repo_cleanup_dry_run.py`, `audit_agent_scripts.py`) use fixed command lists and only read/hash files, which is safe.
- **Default/placeholder secrets in `.env.example`.** Values like `JWT_SECRET_KEY=your-j...ucti`, `AWS_ACCESS_KEY_ID=your-aws-access-key`, and `GITHUB_TOKEN=***` are placeholders, but the diff did not introduce a `.env.example` validator to ensure users change them before deployment.
- **New contact API is mostly safe but could leak internal errors.** `platform/api/contact.js` escapes HTML before injecting user data, uses `rejectUnauthorized: true`, and has a honeypot field. However, on SMTP failure it returns `err.message` to the client, which can leak transport details. It also trusts `req.headers['referer']` without validation.
- **Gitleaks allowlist is insufficient.** `.gitleaks.toml` only ignores dependency/build folders and does not add custom rules for the leaked Jina key pattern or the `?token=...` filenames. `.pre-commit-config.yaml` is reasonable but the ruff/eslint config paths may not exist in all sub-projects, causing local hook failures.

## Suggestions

1. **Rotate the leaked Jina and Anthropic keys**, remove all copies, and move key loading to environment variables or a secret manager.
2. **Delete all `* \d+.ext` numbered duplicates**, `*. 2.*` macOS artifacts, and the `.worktrees/` subtree before merging.
3. **Add a custom gitleaks rule** for `jina_` and `sk-ant` tokens and extend the allowlist to skip `.worktrees/` and numbered duplicate patterns.
4. **Run a secrets scan** (`gitleaks detect --no-git` and `truffleHog filesystem`) on the working tree and confirm zero findings.
5. **Sanitize the contact handler error response** to avoid returning raw SMTP errors; log the detail server-side only.
6. **Consider splitting this giant branch** into focused PRs (platform site, agent audit, hermes plans, de-vendoring) so real security issues are not buried under thousands of asset files.
7. **Add a pre-merge CI step** that blocks files with `?token=` in the name and files matching `* \d+.*` duplicates.
8. **Review `.env.example`** to add stronger placeholder warnings and a startup guard that refuses to run with default secrets.

## Files of Note (reviewed directly)

- `scripts/repo_cleanup_dry_run.py` — SAFE (read-only dry run, no deletions).
- `scripts/audit_agent_scripts.py` — SAFE (classifies only, archives after approval).
- `scripts/cloud_parliament_review.py` — MOSTLY SAFE (loads API keys from `~/.env-secrets`, but hardcodes provider endpoints; consider env-based model selection).
- `tests/test_repo_cleanup.py`, `tests/test_agent_script_audit.py`, `tests/test_cloud_parliament.py` — SAFE but minimal; they assert file existence rather than behavior.
- `.gitleaks.toml` — NEEDS IMPROVEMENT (see above).
- `.pre-commit-config.yaml` — ACCEPTABLE.
- `platform/api/contact.js` — NEEDS MINOR HARDENING (error-leak, referer trust).

## Bottom Line

The cleanup intent is good, but the branch currently ships too much legacy risk alongside the improvements. Remediate the hardcoded secrets, purge duplicate and worktree files, and tighten gitleaks/pre-commit rules before this can be considered for merge.
