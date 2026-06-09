# GitHub Organization Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clean up Taur-Ai-Corp GitHub organization, map all repos to brand architecture, fix CI/CD pipelines, and establish clean deployment workflow.

**Architecture:** Audit all existing repos, rename/move to match brand structure, clean up GitHub Actions, establish deployment conventions.

---

## Task 1: Audit Current GitHub State

**Files:**
- Create: `docs/github-audit-current-state.md`

- [ ] **Step 1: List all repos**

Run:
```bash
gh repo list Taurus-Ai-Corp --limit 100 --json name,description,visibility,updatedAt
```

Expected output: List of all repos with metadata

- [ ] **Step 2: Export to audit doc**

Create table mapping current repo → target brand:

| Current Name | Brand | Target Name | Action |
|--------------|-------|-------------|--------|
| Comply.Q-Grid | GRIDERA | GRIDERA-Comply | Rename |
| Q-Grid.net | GRIDERA | GRIDERA-main | Rename |
| ... | ... | ... | ... |

- [ ] **Step 3: Identify orphaned repos**

Find repos with no clear brand assignment — mark for archive or deletion.

---

## Task 2: Rename Repos to Brand Structure

**Files:**
- Modify: Various repo names

- [ ] **Step 1: Rename compliance repos**

```bash
gh api repos/Taurus-Ai-Corp/Q-Grid.net --method PATCH --field name=GRIDERA-main
gh api repos/Taurus-Ai-Corp/Comply.Q-Grid --method PATCH --field name=GRIDERA-Comply
gh api repos/Taurus-Ai-Corp/q-grid-eu --method PATCH --field name=GRIDERA-EU
```

- [ ] **Step 2: Create new org structure**

```bash
gh repo create Taurus-Ai-Corp/Nexus --clone --private --description "Social media management, marketing automation, and analytics by Taurus AI"
gh repo create Taurus-Ai-Corp/Noverm-devops --clone --private --description "Devops automation and CI/CD platform by Taurus AI"
gh repo create Taurus-Ai-Corp/Noverm-performance --clone --private --description "Marketing performance and ROI optimization"
```

- [ ] **Step 3: Archive orphaned repos**

```bash
gh repo edit Taurus-Ai-Corp/OLD-REPO-NAME --visibility private
# Mark for archive (no delete yet — verify first)
```

---

## Task 3: Setup GitHub Actions CI/CD

**Files:**
- Create: `.github/workflows/ci.yml` (per repo)
- Modify: `.github/workflows/deploy-vercel.yml`

- [ ] **Step 1: Create standard CI workflow**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

- [ ] **Step 2: Create deploy workflow**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

- [ ] **Step 3: Add to GRIDERA repo**

```bash
cd GRIDERA-main
mkdir -p .github/workflows
cp /path/to/ci.yml .github/workflows/ci.yml
git add .github/workflows/ci.yml
git commit -m "ci: add standard CI workflow
Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4: Configure Branch Protection

**Files:**
- Modify: `.github/branch-protection.yml`

- [ ] **Step 1: Setup branch protection for main**

```bash
gh api repos/Taurus-Ai-Corp/GRIDERA-main/branches/main/protection \
  --method PUT \
  -f required_status_checks='{"strict": true, "contexts": ["ci"]}' \
  -f enforce_admins=true \
  -f required_reviewers=0 \
  -f dismissal_restrictions='{}'
```

- [ ] **Step 2: Enable required reviews**

```bash
gh api repos/Taurus-Ai-Corp/GRIDERA-main/branches/main/protection \
  --method PUT \
  -f required_reviewers='{"dismiss_stale_reviews": true, "require_code_owner_reviews": true}'
```

---

## Task 5: Setup GitHub Teams

**Files:**
- Create: `.github/teams.yml`

- [ ] **Step 1: Create team structure**

```bash
gh api orgs/Taurus-Ai-Corp/teams --method POST \
  -f name="gridera-team" \
  -f description="GRIDERA product team" \
  -f privacy="closed"

gh api orgs/Taurus-Ai-Corp/teams --method POST \
  -f name="nexus-team" \
  -f description="Nexus product team" \
  -f privacy="closed"

gh api orgs/Taurus-Ai-Corp/teams --method POST \
  -f name="novem-team" \
  -f description="Noverm product team" \
  -f privacy="closed"
```

- [ ] **Step 2: Add members**

```bash
# Add members to teams (replace OWNER with actual username)
gh api teams Taurus-Ai-Corp/gridera-team/memberships --method POST -f member="OWNER" -f role="maintainer"
```

---

## Task 6: Document GitHub Conventions

**Files:**
- Create: `docs/github-conventions.md`

- [ ] **Step 1: Create conventions doc**

```markdown
# TAURUS AI Corp GitHub Conventions

## Repo Naming Convention
- Use kebab-case: `gridera-comply`, `nexus-analytics`
- Format: `{product}-{feature}` or `{brand}-{subproduct}`

## Branch Naming
- `main` — Production-ready
- `develop` — Integration branch
- `feature/{description}` — New features
- `fix/{description}` — Bug fixes
- `chore/{description}` — Maintenance

## Commit Messages
```
feat({scope}): {description}
fix({scope}): {description}
docs({scope}): {description}
chore({scope}): {description}
```

## PR Requirements
- All PRs require 1 reviewer approval
- CI must pass
- Branch must be up-to-date with target

## Deployment Pipeline
1. Feature branch → develop (auto-deploy to staging)
2. develop → main (auto-deploy to production)
3. Hotfixes bypass develop, go directly to main
```

---

**Plan complete and saved to:** `docs/superpowers/plans/2026-05-18-github-org-cleanup.md`

**Which execution approach?**