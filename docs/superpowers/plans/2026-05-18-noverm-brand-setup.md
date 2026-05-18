# Noverm Brand Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish Noverm as the new devops/performance brand, replacing the "Hermes" naming concept.

**Architecture:** Create new GitHub org structure, Vercel/Railway projects, and brand documentation for Noverm.

**Tech Stack:** Next.js, Railway, Vercel, GitHub Actions

---

## Task 1: Create GitHub Repository Structure

**Files:**
- Create: `Taurus-Ai-Corp/Noverm` org setup
- Create: `Taurus-Ai-Corp/Noverm-devops`
- Create: `Taurus-Ai-Corp/Noverm-performance`

- [ ] **Step 1: Create GitHub team for Noverm**

Run:
```bash
gh api repos/Taurus-Ai-Corp --method POST --field name=Noverm-devops --field description="Devops automation and CI/CD platform by Taurus AI" --field private=true
```

- [ ] **Step 2: Create devops repo**

Run:
```bash
gh repo create Taurus-Ai-Corp/Noverm-devops --clone --private
```

- [ ] **Step 3: Create performance repo**

Run:
```bash
gh repo create Taurus-Ai-Corp/Noverm-performance --clone --private
```

---

## Task 2: Create Brand Documentation

**Files:**
- Create: `docs/brands/novem/README.md`
- Create: `docs/brands/novem/guidelines.md`

- [ ] **Step 1: Create brand doc**

```markdown
# Noverm Brand Guidelines

**Tagline:** "Velocity meets precision."
**Parent:** Taurus AI Corp FZCO
**Endorsement:** "Noverm by Taurus AI"

## Sub-Products
- Noverm | Devops — CI/CD pipelines, deployment automation
- Noverm | Performance — Marketing performance, ROI optimization

## Colors
- Primary: #0A0F1C (Deep Navy)
- Accent: #00D9FF (Electric Cyan)
- Secondary: #6366F1 (Indigo)

## Typography
- Headlines: Inter (700)
- Body: Inter (400)
- Monospace: JetBrains Mono

## Domain Strategy
- noverm.io — Main site
- noverm.dev — Devops platform
- dev.noxum.io — Development environment
```

- [ ] **Step 2: Create brand guidelines**

Document logo usage, color palette, typography, and voice/tone.

---

## Task 3: Setup Railway Project

**Files:**
- Create: `Taurus-Ai-Corp/Noverm-devops` Railway config

- [ ] **Step 1: Initialize Railway project**

Run: `railway init --name noverm-devops --org Taurus-Ai-Corp`

- [ ] **Step 2: Add PostgreSQL database**

Run: `railway add --database postgres`

- [ ] **Step 3: Configure deployment**

Add `railway.json`:
```json
{
  "build": {
    "builder": "nixpacks",
    "node": "18"
  },
  "deploy": {
    "numInstances": 2,
    "restartPolicy": "on-failure"
  }
}
```

---

## Task 4: Setup Vercel Project

**Files:**
- Create: `Taurus-Ai-Corp/Noverm-performance` Vercel project

- [ ] **Step 1: Link to Vercel**

Run: `cd Noverm-performance && vercel link --yes`

- [ ] **Step 2: Configure project**

Run: `vercel project rename noverm-performance --yes`

- [ ] **Step 3: Add environment variables**

```bash
vercel env add NEXT_PUBLIC_APP_NAME "Noverm"
vercel env add NEXT_PUBLIC_APP_TAGLINE "Velocity meets precision."
vercel env add NOVERM_API_URL "https://api.noxerm.io"
```

---

## Task 5: Create Landing Page

**Files:**
- Create: `Taurus-Ai-Corp/Noverm-devops/src/app/page.tsx`
- Create: `Taurus-Ai-Corp/Noverm-devops/src/app/layout.tsx`

- [ ] **Step 1: Create Next.js app structure**

```bash
mkdir -p Noverm-devops/src/app
cd Noverm-devops
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

- [ ] **Step 2: Create landing page**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0F1C]">
      <header className="p-6">
        <h1 className="text-4xl font-bold text-white">
          Noverm <span className="text-[#00D9FF]">by Taurus AI</span>
        </h1>
        <p className="text-xl text-gray-400 mt-2">Velocity meets precision.</p>
      </header>
    </main>
  )
}
```

- [ ] **Step 3: Deploy**

```bash
vercel --prod
```

---

## Task 6: Trademark Documentation

**Files:**
- Create: `docs/legal/trademarks/novem-trademark-filing.md`

- [ ] **Step 1: Document trademark intent**

```markdown
# Noverm Trademark Filing

**Intent:** File trademark for Noverm in UAE + Canada + EU
**Priority:** HIGH
**Timeline:** Before July 2026

**Classes:** 042 (Software), 035 (Business services)

**Rationale:** Noverm is clean — no conflicts found. File immediately.
```

---

**Plan complete and saved to:** `docs/superpowers/plans/2026-05-18-noverm-brand-setup.md`

**Which execution approach?**