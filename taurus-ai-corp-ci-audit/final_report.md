# Taurus-Ai-Corp GRIDERA / Q-GRID CI/CD Audit Report

Date: 2026-06-25
Org: Taurus-Ai-Corp
Scope: 21 repositories related to GRIDERA / Q-GRID product family

## Executive Summary

- **Repos audited:** 21
- **Repos with active CI:** 10
- **Repos with no CI:** 11
- **Recent CI failures (last 20 runs):** GRIDERA (14), gridera-migrate (17), Quantum-Shield-NFT (11), gridera-asset (2), gridera-lend (2), infra.q-grid.in (2)
- **PRs opened/updated by this audit:** 12
- **Metadata fixes applied:** 4 repos

## Per-Repo Status

### 1. GRIDERA (public, active)
- **CI:** 1 workflow (`ci.yml`) active; runs on push/PR to `main`.
- **Health:** Currently failing. Last 20 runs: 14 failure, 5 success, 1 queued.
- **Failures found:**
  - Latest `main` push (run 28183143642) fails at `comply#build` because `packages/db/dist/guard-keys.js` imports `node:crypto` and gets bundled into Next.js Edge Runtime by `apps/comply/src/lib/auth.ts`.
  - Run 28182952360 failed because both `middleware.ts` and `proxy.ts` existed in `src/src/` (fixed in later commit, but surfaced an incorrect source-root path issue).
  - PR #12 (`fix/gridera-branding`) fails CI — likely lockfile/package-name mismatch after rename.
  - CI uses Node 20 with pnpm cache, which is correct, but monorepo build order/type-check still breaks on Edge Runtime crypto.
- **Fixes applied:** README already present; no direct code change made.
- **Open PRs:** #12 (branding), #6 (pnpm-lock sync), #4 (public verify), #3 (legal pkg + ADR), #2 (P0 UX/QA).
- **Recommended next steps:**
  - Merge PR #6 (pnpm-lock sync) after verifying it resolves the build issue.
  - Split `@taurus/db` so that `node:crypto`-dependent guard keys are only imported in Node.js routes/middleware, not from Edge Runtime `auth.ts`.
  - Consider pinning Next.js 16 build warnings (`images.domains` deprecated, `middleware` convention).

### 2. gridera-scan-cli (public, active)
- **CI:** None.
- **Health:** No runs.
- **Fixes applied:**
  - Added starter Python CI workflow via PR #1.
  - Updated repo description.
- **Open PRs:** #1 (branding + CI).
- **Recommended next steps:** Merge PR #1; add real tests and lint config.

### 3. gridera-migrate (public, active)
- **CI:** 2 workflows (`ci.yml`, `deploy-playground.yml`).
- **Health:** Failing. Last 20 runs: 17 failure, 3 success. The same commit repeated many failures on 2026-04-14, and PR #1 (`fix/gridera-branding`) currently fails.
- **Failures found:** `ci.yml` uses `npm ci` + `npm run build`; root may lack lockfile or have branding rename mismatch.
- **Fixes applied:** None (branding PR in flight).
- **Open PRs:** #1.
- **Recommended next steps:** Review PR #1 failure log; ensure `package-lock.json` matches `package.json` after rename; switch to pnpm if monorepo uses pnpm elsewhere.

### 4. gridera-migrate-sdk (public, active)
- **CI:** None.
- **Health:** No runs.
- **Fixes applied:**
  - Added pnpm-based TypeScript CI via PR #1.
  - Updated repo description.
- **Open PRs:** #1 (branding + CI).
- **Recommended next steps:** Merge PR #1; populate tests.

### 5. gridera-asset (public, transferred)
- **CI:** 2 workflows (`ci.yml`, `npm-publish-oidc.yml`).
- **Health:** Failing. Last 2 runs failed.
- **Failures found:**
  - No `package-lock.json` in repo, but workflow used `npm install` and `npm run test` without `--if-present`; earlier run used `upload-artifact@v3` (now deprecated/brownout).
- **Fixes applied:**
  - Updated workflow to `npm ci` and kept `--if-present` for tests via PR #1.
  - Updated repo description.
- **Open PRs:** #1.
- **Recommended next steps:** Merge PR #1; add a lockfile or commit `package-lock.json`; evaluate npm-publish-oidc.yml for trust publisher setup on npm.

### 6. gridera-lend (private, transferred)
- **CI:** 1 workflow (`ci.yml`).
- **Health:** Failing. Last 2 runs failed.
- **Failures found:**
  - Workflow installs pnpm v9 but the commit message suggests the order of `pnpm/action-setup` vs `actions/setup-node` was incorrect at least once (pnpm must be installed before setup-node with `cache: pnpm`).
  - Workflow has a Postgres service but tests may not wait for DB readiness.
- **Fixes applied:**
  - Updated repo description.
- **Open PRs:** None.
- **Recommended next steps:** Add `pg_isready` health check to Postgres service; verify DATABASE_URL is valid in CI; ensure `prepare` husky install does not fail in CI (`HUSKY=0` env).

### 7. gridera-comply (private, archived)
- **CI:** 15 workflows.
- **Health:** Healthy for an archived repo (last 20: 15 success, 3 failure, 2 skipped). Dependabot PRs trigger CI.
- **Fixes applied:** None (archived; no changes without approval).
- **Recommended next steps:** Keep archived; consider adding note in README pointing to GRIDERA.

### 8. LENDGRID (private, empty duplicate of gridera-lend)
- **CI:** None.
- **Health:** No code, no runs.
- **Fixes applied:** None.
- **Recommended next steps:** Do not delete without approval. Add a minimal README redirecting to `gridera-lend` or archive after stakeholder confirmation.

### 9. Q-GRID.NET (private, archived)
- **CI:** 1 workflow (`ci.yml`).
- **Health:** Archived; last runs were cancelled/failure during bulk cleanup on 2026-04-14.
- **Fixes applied:** None.
- **Recommended next steps:** No action; remains archived.

### 10. Quantum-Shield-NFT (public, active)
- **CI:** 10 workflows.
- **Health:** Mixed. CI pipeline mostly passes; `Security Scan` schedule fails every Monday because `SNYK_TOKEN` secret is missing.
- **Failures found:**
  - Snyk steps in `security-scan.yml` fail with `SNYK-0005` authentication error.
  - `node-version: '20'` is fine but GitHub warns about Node 20 deprecation by 2026-09-16.
- **Fixes applied:**
  - Opened PR #31 to gate Snyk test/monitor on `SNYK_TOKEN` presence so scheduled runs skip gracefully when secret is absent.
  - No metadata changes needed (already rich).
- **Open PRs:** #31 plus many dependabot/security PRs.
- **Recommended next steps:**
  - Merge PR #31.
  - Add `SNYK_TOKEN` org/repo secret if Snyk scanning is desired.
  - Review and merge dependabot action bumps (#2-#6) and major deps.

### 11. Quantum_Bio_Foundry_IP_VAULT (private, active)
- **CI:** None (now PR #2 adds starter CI).
- **Health:** No runs.
- **Fixes applied:** Added starter Python CI via PR #2.
- **Open PRs:** #1 (feat: Posner-PAC engine), #2 (starter CI).
- **Recommended next steps:** Merge PR #2; add real tests and lint config after PR #1.

### 12. quantum-readiness-scanner (public, archived)
- **CI:** None.
- **Health:** No runs.
- **Fixes applied:** None (archived).
- **Recommended next steps:** No action.

### 13. infra.q-grid.in (private, active)
- **CI:** 1 workflow (`ci.yml`).
- **Health:** Mostly success (18/20), but 2 failures around 2026-03-19.
- **Failures found:** Likely branding/lockfile issues during cleanup.
- **Fixes applied:** None.
- **Open PRs:** #3 (hardcoded DB password + secret-scanning).
- **Recommended next steps:** Merge PR #3 for security; review `ci.yml` for Node/pnpm version alignment.

### 14. quantum-infrastructure-demo (private, active)
- **CI:** None (now PR #1 adds minimal HTML validation).
- **Health:** Single initial success, no workflow file now.
- **Fixes applied:** Added minimal HTML validation CI via PR #1.
- **Open PRs:** #1.
- **Recommended next steps:** Merge PR #1 if demo is still maintained.

### 15. hedera-quantum-ecosystem (private, active)
- **CI:** None (now PR #1 adds minimal HTML validation).
- **Health:** Single initial success historically.
- **Fixes applied:** Added minimal HTML validation CI via PR #1.
- **Open PRs:** #1.
- **Recommended next steps:** Merge PR #1 if demo is still maintained.

### 16. quantum-bio-foundry-vault (private, active)
- **CI:** None (now PR #1 adds starter CI).
- **Health:** No runs.
- **Fixes applied:** Added starter Python CI via PR #1.
- **Open PRs:** #1.
- **Recommended next steps:** Merge PR #1.

### 17. quantumrupee-demo-public (private, active)
- **CI:** 1 workflow (likely Pages deploy).
- **Health:** Healthy — 19 success, 1 cancelled in last 20.
- **Fixes applied:** None.
- **Recommended next steps:** No urgent action.

### 18. q-grid-ip (private, active)
- **CI:** None.
- **Health:** Empty repository.
- **Fixes applied:** None.
- **Recommended next steps:** Confirm whether this placeholder is still needed; do not delete without approval.

### 19. quantum-rupee-fraud-detection (private, active)
- **CI:** None (now PR #1 adds starter CI).
- **Health:** No runs.
- **Fixes applied:** Added starter Python CI via PR #1.
- **Open PRs:** #1.
- **Recommended next steps:** Merge PR #1.

### 20. quantum-rupee-offline-cbdc (private, active)
- **CI:** None (now PR #1 adds starter CI).
- **Health:** No runs.
- **Fixes applied:** Added starter Python CI via PR #1.
- **Open PRs:** #1.
- **Recommended next steps:** Merge PR #1.

### 21. quantum-rupee-zk-kyc (private, active)
- **CI:** None (now PR #1 adds starter CI).
- **Health:** No runs.
- **Fixes applied:** Added starter Python CI via PR #1.
- **Open PRs:** #1.
- **Recommended next steps:** Merge PR #1.

## Common Failure Patterns Observed

1. **Lockfile/package manager mismatch** — GRIDERA/gridera-migrate/gridera-asset failures tied to pnpm/npm/lockfile state.
2. **Deprecated GitHub Actions / Node versions** — `upload-artifact@v3`, Node 20 deprecation warnings across many repos.
3. **Missing secrets causing scheduled job failures** — Quantum-Shield-NFT Snyk monitor/test fail every Monday without `SNYK_TOKEN`.
4. **pnpm ordering** — gridera-lend initially had pnpm installed after setup-node; later commit fixed.
5. **Edge Runtime bundling `node:crypto`** — GRIDERA `comply` app imports package that pulls Node-only code into Next.js Edge/middleware.
6. **No CI at all** — 11 repos have no GitHub Actions, including newly public/active tools.
7. **Missing metadata** — Several transferred repos lacked descriptions; now updated for gridera-scan-cli, gridera-migrate-sdk, gridera-asset, gridera-lend.

## Fixes Applied in This Audit

| Repo | Fix | PR / Action |
|------|-----|-------------|
| Quantum-Shield-NFT | Gate Snyk scan on `SNYK_TOKEN` presence | PR #31 |
| gridera-scan-cli | Add Python CI starter | PR #1 |
| gridera-migrate-sdk | Add pnpm TypeScript CI starter | PR #1 |
| gridera-asset | Use `npm ci` and `--if-present` for tests | PR #1 |
| Quantum_Bio_Foundry_IP_VAULT | Add starter Python CI | PR #2 |
| quantum-bio-foundry-vault | Add starter Python CI | PR #1 |
| quantum-rupee-fraud-detection | Add starter Python CI | PR #1 |
| quantum-rupee-offline-cbdc | Add starter Python CI | PR #1 |
| quantum-rupee-zk-kyc | Add starter Python CI | PR #1 |
| quantum-infrastructure-demo | Add minimal HTML validation CI | PR #1 |
| hedera-quantum-ecosystem | Add minimal HTML validation CI | PR #1 |
| gridera-scan-cli | Updated repo description | Direct |
| gridera-migrate-sdk | Updated repo description | Direct |
| gridera-asset | Updated repo description | Direct |
| gridera-lend | Updated repo description | Direct |

## Recommended Next Steps (Priority)

1. **GRIDERA** — Resolve the Edge Runtime `node:crypto` import by splitting `@taurus/db` exports; merge PR #6 after verification.
2. **gridera-migrate / gridera-migrate-sdk / gridera-scan-cli / gridera-asset** — Merge branding + CI PRs; ensure package names, lockfiles, and READMEs are consistent.
3. **Quantum-Shield-NFT** — Merge PR #31; add `SNYK_TOKEN` secret if Snyk is intended; triage dependabot PRs.
4. **gridera-lend** — Fix Postgres readiness and Husky install in CI; add `--health-cmd pg_isready` to service.
5. **CI coverage gap** — Add minimal CI to Quantum_Bio_Foundry_IP_VAULT, quantum-bio-foundry-vault, and the three `quantum-rupee-*` IP repos if they receive content updates.
6. **Repository hygiene** — Decide what to do with empty/duplicate repos `LENDGRID` and `q-grid-ip` (no deletion without approval).

## Artifacts

- Audit data: `/Users/taurus_ai/Documents/Nexus-Platform/taurus-ai-corp-ci-audit/raw_audit.json`
- Fixes log: `/Users/taurus_ai/Documents/Nexus-Platform/taurus-ai-corp-ci-audit/fixes.json`
- Workflow cache: `/Users/taurus_ai/Documents/Nexus-Platform/taurus-ai-corp-ci-audit/workflows/`
