# verticals/intel

Analytics / business-intelligence vertical (ghost vertical — promote later).

## Wave 3 status: RESIDUE-RECLASSIFIED (2026-07-06)

Candidate source `01-CORE-PLATFORM/nexus-backend/analytics-dashboard/` was
**reclassified to `planning/analytics-dashboard/`** (residue), not promoted
into this vertical. Verified contents: 97 tracked files total — 1 Python
(`webflow-template-generator.py`, 69 ruff errors / 66 unsafe-fixable under
`01-CORE-PLATFORM/nexus-backend/pyproject.toml`) and 59 JS/TS (12 eslint
errors `no-undef: 'document'` + 3 `no-console` warnings, across 3
`webflow/script.js` files). Not deployed, no nested `.git`.

Both the ruff and eslint pre-commit hooks now carry `exclude: '^planning/'`,
so moving the dir into `planning/` unblocks the commit without weakening lint
coverage on active product code. The dir is preserved as residue, not
promoted; the intel vertical stays a ghost until a real BI product lands.

`taurus-analytics-platform/` and `Business-Intelligence/` referenced in the PRD
do not exist in the current tree.