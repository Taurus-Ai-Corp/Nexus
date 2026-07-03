# verticals/intel

Analytics / business-intelligence vertical (ghost vertical — promote later).

## Wave 3 status: BLOCKED on lint

Candidate source: `01-CORE-PLATFORM/nexus-backend/analytics-dashboard/` (97
tracked Python files, not deployed, no nested `.git`).

BLOCKER: `ruff check` reports **69 errors** (66 unsafe-fixable) under
`01-CORE-PLATFORM/nexus-backend/pyproject.toml`. Staging the dir triggers the
ruff pre-commit hook, which blocks the commit — same mechanism as the
`06-WORKFLOWS/` engine files. Move is deferred pending a user decision:
fix the 69 errors, or reclassify the dir as residue.

`taurus-analytics-platform/` and `Business-Intelligence/` referenced in the PRD
do not exist in the current tree.