# NeoSync → Nexus Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the live NeoSync product (social-suite-dashboard.vercel.app) to Nexus, updating all references, configs, and documentation.

**Architecture:** Rename the product from NeoSync to Nexus across: Next.js app configs, environment variables, package.json, Vercel deployment, GitHub repo, and all internal documentation references.

**Tech Stack:** Next.js 16, Tailwind v4, Vercel, GitHub Actions

---

## Task 1: Update Next.js App Configuration

**Files:**
- Modify: `01-CORE-PLATFORM/bizflow-backend/frontend/neovibe-studio/src/app/layout.tsx:1-20`
- Modify: `01-CORE-PLATFORM/bizflow-backend/frontend/neovibe-studio/package.json`
- Modify: `01-CORE-PLATFORM/bizflow-backend/frontend/neovibe-studio/.env.example`

- [ ] **Step 1: Backup current configs**

Run: `cd /Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform && git add -A && git status`

- [ ] **Step 2: Update package.json name**

Modify `package.json`:
```json
{
  "name": "nexus",
  "version": "1.0.0",
  "description": "Social media management, marketing automation, and business analytics platform by Taurus AI",
  ...
}
```

- [ ] **Step 3: Update .env.example**

Modify `.env.example`:
```
# Nexus Platform Configuration
NEXT_PUBLIC_APP_NAME="Nexus"
NEXT_PUBLIC_APP_TAGLINE="Everything connected."
NEXUS_API_URL=https://api.nexus.ai
```

- [ ] **Step 4: Update layout.tsx**

Modify `layout.tsx` to use Nexus branding:
```tsx
import { Nexus } from "lucide-react"

export const metadata = {
  title: "Nexus — Social Media Management by Taurus AI",
  description: "Everything connected. Social media, marketing, analytics.",
}
```

- [ ] **Step 5: Create git branch**

```bash
git checkout -b feat/nexosync-to-nexus-rebrand
```

---

## Task 2: Rename GitHub Repository

**Files:**
- Modify: GitHub repo settings (via gh CLI)

- [ ] **Step 1: Rename repo via GitHub CLI**

Run:
```bash
gh api repos/Taurus-Ai-Corp/NeoSync --method PATCH --field name=Nexus --field description="Social media management, marketing automation, and business analytics by Taurus AI"
```

Expected: `{"name": "Nexus", ...}`

- [ ] **Step 2: Update local git remote**

```bash
cd 01-CORE-PLATFORM/bizflow-backend/frontend/neovibe-studio
git remote set-url origin https://github.com/Taurus-Ai-Corp/Nexus.git
```

- [ ] **Step 3: Commit the config changes**

```bash
git add package.json .env.example src/app/layout.tsx
git commit -m "feat(rebrand): NeoSync → Nexus
- Update package.json name to 'nexus'
- Add Nexus env var prefix (NEXUS_*)
- Update layout metadata
- Update imports/icons
Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3: Update Vercel Deployment

**Files:**
- Modify: Vercel project settings via CLI

- [ ] **Step 1: Install Vercel CLI if needed**

Run: `npm i -g vercel`

- [ ] **Step 2: Link project**

Run: `vercel link --yes`

- [ ] **Step 3: Rename project**

Run: `vercel project rename nexus --yes`

- [ ] **Step 4: Update project environment variables**

Run:
```bash
vercel env add NEXT_PUBLIC_APP_NAME
# Enter: Nexus

vercel env add NEXT_PUBLIC_APP_TAGLINE
# Enter: Everything connected.

vercel env add NEXUS_API_URL
# Enter: https://api.nexus.ai
```

- [ ] **Step 5: Push to trigger deployment**

```bash
git push origin feat/nexosync-to-nexus-rebrand
```

---

## Task 4: Update Documentation

**Files:**
- Modify: `FINAL_PLATFORM_SUMMARY.md`
- Modify: `PLATFORM_COMPLETION_SUMMARY.md`
- Modify: `NeoSync™ _ Platform Devops/` directory rename

- [ ] **Step 1: Rename NeoSync directory**

```bash
mv "NeoSync™ _ Platform Devops" "Nexus _ Platform Devops"
```

- [ ] **Step 2: Update platform summary docs**

In `FINAL_PLATFORM_SUMMARY.md` and `PLATFORM_COMPLETION_SUMMARY.md`:
- Replace "NeoSync" → "Nexus"
- Replace "neovibe-studio" → "nexus"
- Update description to reflect new brand

- [ ] **Step 3: Update CLAUDE.md references**

In `/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/CLAUDE.md`:
- Update any NeoSync references to Nexus

- [ ] **Step 4: Commit documentation changes**

```bash
git add -A
git commit -m "docs: update all NeoSync references to Nexus
Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5: Update Memory/Agent Files

**Files:**
- Modify: `~/.claude/projects/-Users-taurus-ai-Documents-BizFlow-NeoVibe-Platform/memory/MEMORY.md`
- Modify: `~/.claude/agents/neovibe-freelance.md`

- [ ] **Step 1: Update memory file**

In MEMORY.md:
- Find "NeoSync" → Replace with "Nexus"
- Update description to reflect rebrand

- [ ] **Step 2: Rename agent file**

```bash
mv ~/.claude/agents/neovibe-freelance.md ~/.claude/agents/nexus-freelance.md
```

- [ ] **Step 3: Update agent content**

In the renamed file, update:
- Name: "neovibe-freelance" → "nexus-freelance"
- All NeoSync references → Nexus

---

## Task 6: Verify and Finalize

**Files:**
- Verify: social-suite-dashboard.vercel.app loads correctly
- Verify: GitHub repo name updated
- Verify: All docs reference Nexus

- [ ] **Step 1: Check deployment**

Run: `vercel ls` — confirm "nexus" project exists

- [ ] **Step 2: Check GitHub**

Run: `gh repo view Taurus-Ai-Corp/Nexus --json name,description`

Expected: `"name": "Nexus"`, description contains "by Taurus AI"

- [ ] **Step 3: Check running app**

Visit: https://social-suite-dashboard.vercel.app (should redirect or show Nexus branding)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete NeoSync → Nexus rebrand
- All configs updated
- GitHub repo renamed
- Vercel project renamed
- Docs updated
Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [ ] All Next.js configs updated (package.json, .env.example, layout.tsx)
- [ ] GitHub repo renamed to "Nexus"
- [ ] Vercel project renamed to "nexus"
- [ ] All environment variables use NEXUS_* prefix
- [ ] Documentation updated (FINAL_PLATFORM_SUMMARY.md, CLAUDE.md, MEMORY.md)
- [ ] Agent file renamed and updated
- [ ] Directory renamed from "NeoSync™ _ Platform Devops" to "Nexus _ Platform Devops"
- [ ] Branch pushed and PR ready

---

**Plan complete and saved to:** `docs/superpowers/plans/2026-05-18-nexosync-to-nexus-rebrand.md`

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**