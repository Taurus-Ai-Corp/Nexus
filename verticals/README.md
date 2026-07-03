# verticals/

Per-product application code, one subtree per Nexus vertical. Target structure
(PRD `docs/superpowers/specs/2026-06-24-nexus-enterprise-repo-design.md`):

```
verticals/
  social/      # social-suite (antd) — LIVE deploy, migrate behind Vercel gate
  creative/    # creative-editorial + studio products
  intel/       # analytics / BI (ghost vertical — promote later)
  freelance/   # onboarding-portal + freelance skeleton
```

Each vertical is an independently deployable unit. Vercel `rootDirectory` is
scoped per vertical via the Vercel API in Wave 5 — NOT via `vercel.json` at root.

## Wave 3 status (2026-07-03)

- `freelance/onboarding-portal/` — MOVED (from `03-CLIENT-MANAGEMENT/`), not
  deployed, eslint-clean (0 errors). First safe move.
- `social/`, `creative/`, `intel/` — scaffold only. Product code moves are
  GATED behind per-app Vercel rootDirectory + HTTP 200 checks (Wave 5) because
  the source dirs are either independently deployed or nested sibling repos.

## Non-goals

No `@taurus/*` PQC/Hedera packages here (GRIDERA-contamination guard in CI).
Nexus consumes published `@taurus/*` as external versioned deps if ever needed.