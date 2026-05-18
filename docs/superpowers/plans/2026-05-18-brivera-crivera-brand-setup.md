# Brivera + Crivera Brand Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish Brivera (payments/integration) and Crivera (analytics/visualization) as new product brands alongside GRIDERA.

**Architecture:** Create initial repo structure, landing pages, and trademark documentation for both brands.

**Tech Stack:** Next.js, Vercel, GitHub Actions

---

## Task 1: Create GitHub Repositories

**Files:**
- Create: `Taurus-Ai-Corp/Brivera` (org repo)
- Create: `Taurus-Ai-Corp/Brivera-Pay`
- Create: `Taurus-Ai-Corp/Brivera-Sync`
- Create: `Taurus-Ai-Corp/Crivera` (org repo)
- Create: `Taurus-Ai-Corp/Crivera-Insights`
- Create: `Taurus-Ai-Corp/Crivera-Vizard`
- Create: `Taurus-Ai-Corp/Crivera-Verify`

- [ ] **Step 1: Create Brivera repos**

```bash
gh repo create Taurus-Ai-Corp/Brivera --clone --private --description "Payments and integration orchestration by Taurus AI"
gh repo create Taurus-Ai-Corp/Brivera-Pay --clone --private --description "Payment processing and transaction APIs"
gh repo create Taurus-Ai-Corp/Brivera-Sync --clone --private --description "Platform integration and orchestration"
```

- [ ] **Step 2: Create Crivera repos**

```bash
gh repo create Taurus-Ai-Corp/Crivera --clone --private --description "Analytics, visualization, and verification by Taurus AI"
gh repo create Taurus-Ai-Corp/Crivera-Insights --clone --private --description "Business intelligence and dashboards"
gh repo create Taurus-Ai-Corp/Crivera-Vizard --clone --private --description "Data visualization tools"
gh repo create Taurus-Ai-Corp/Crivera-Verify --clone --private --description "Verification and audit trail platform"
```

---

## Task 2: Create Brivera Landing Page

**Files:**
- Create: `Brivera/src/app/page.tsx`
- Create: `Brivera/src/app/layout.tsx`
- Create: `Brivera/src/app/api/health/route.ts`

- [ ] **Step 1: Initialize Next.js app**

```bash
mkdir -p Brivera/src/app/api/health
cd Brivera
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --use-npm
```

- [ ] **Step 2: Create layout**

```tsx
export const metadata = {
  title: "Brivera — Payments & Integration by Taurus AI",
  description: "Bridges built, not broken. Payment processing and platform integration.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0F1C] text-white">
        <header className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">
            Brivera <span className="text-[#00D9FF]">by Taurus AI</span>
          </h1>
          <p className="text-gray-400">Bridges built, not broken.</p>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create landing page**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <section className="max-w-4xl mx-auto py-20">
        <h2 className="text-5xl font-bold mb-4">Brivera | Pay</h2>
        <p className="text-xl text-gray-400 mb-8">Payment processing, transaction APIs, financial integration.</p>

        <h2 className="text-5xl font-bold mb-4 mt-12">Brivera | Sync</h2>
        <p className="text-xl text-gray-400">Platform integration, orchestration, seamless connections.</p>
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Create health API**

```typescript
export async function GET() {
  return Response.json({ status: "healthy", product: "Brivera" })
}
```

- [ ] **Step 5: Deploy to Vercel**

```bash
vercel --prod
```

---

## Task 3: Create Crivera Landing Page

**Files:**
- Create: `Crivera/src/app/page.tsx`
- Create: `Crivera/src/app/layout.tsx`
- Create: `Crivera/src/app/api/health/route.ts`

- [ ] **Step 1: Initialize Next.js app**

```bash
mkdir -p Crivera/src/app/api/health
cd Crivera
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --use-npm
```

- [ ] **Step 2: Create layout**

```tsx
export const metadata = {
  title: "Crivera — Analytics & Verification by Taurus AI",
  description: "Clarity in every byte. Analytics, visualization, and audit trails.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0F1C] text-white">
        <header className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">
            Crivera <span className="text-[#00D9FF]">by Taurus AI</span>
          </h1>
          <p className="text-gray-400">Clarity in every byte.</p>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create landing page**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <section className="max-w-4xl mx-auto py-20">
        <h2 className="text-5xl font-bold mb-4">Crivera | Insights</h2>
        <p className="text-xl text-gray-400 mb-8">Business intelligence, dashboards, data-driven decisions.</p>

        <h2 className="text-5xl font-bold mb-4 mt-12">Crivera | Vizard</h2>
        <p className="text-xl text-gray-400 mb-8">Data visualization tools that bring clarity.</p>

        <h2 className="text-5xl font-bold mb-4 mt-12">Crivera | Verify</h2>
        <p className="text-xl text-gray-400">Verification, audit trails, transparent compliance.</p>
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Deploy to Vercel**

```bash
vercel --prod
```

---

## Task 4: Create Trademark Filing Documentation

**Files:**
- Create: `docs/legal/trademarks/brivera-trademark-filing.md`
- Create: `docs/legal/trademarks/crivera-trademark-filing.md`

- [ ] **Step 1: Create Brivera trademark doc**

```markdown
# Brivera Trademark Filing

**Intent:** File trademark for Brivera in UAE + Canada + EU
**Priority:** HIGH
**Timeline:** Before August 2026

**Classes:** 036 (Financial services), 042 (Software), 035 (Business services)

**Sub-products:**
- Brivera | Pay — Payment processing
- Brivera | Sync — Integration orchestration

**Status:** MEDIUM RISK — BRIVERA OÜ (Estonia) exists but different vertical. Crivera Technologies (e-learning) exists but different market.

**Action:** File with product-specific modifiers to distinguish.
```

- [ ] **Step 2: Create Crivera trademark doc**

```markdown
# Crivera Trademark Filing

**Intent:** File trademark for Crivera in UAE + Canada + EU
**Priority:** HIGH
**Timeline:** Before August 2026

**Classes:** 042 (Software), 035 (Business services), 009 (Data processing)

**Sub-products:**
- Crivera | Insights — Business intelligence
- Crivera | Vizard — Data visualization
- Crivera | Verify — Verification and audit

**Status:** MEDIUM RISK — Crivera Technologies (e-learning) exists but different market.

**Action:** File with product-specific modifiers to distinguish.
```

---

## Task 5: Update Brand Architecture Document

**Files:**
- Modify: `docs/superpowers/specs/2026-05-18-taurus-ai-brand-architecture.md`

- [ ] **Step 1: Add Brivera/Crivera details**

Update the document with:
- Full product descriptions
- Landing page URLs (once deployed)
- GitHub repo links

---

**Plan complete and saved to:** `docs/superpowers/plans/2026-05-18-brivera-crivera-brand-setup.md`

**Which execution approach?**