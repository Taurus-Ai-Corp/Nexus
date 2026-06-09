# Mater Maria `/invest` Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Next.js App Router `/invest` page (11 sections) + `/api/lead` + `/api/whatsapp` Edge route handlers that deliver an email-with-PDF and a WhatsApp template message in parallel within 5 seconds of every form submission.

**Architecture:** Next.js 16 App Router on Vercel. Two Edge route handlers (`app/api/lead/route.ts`, `app/api/whatsapp/route.ts`) call Resend + Meta Graph API in parallel via `Promise.allSettled`. Static-style `/invest` page composed of 11 sections, sharing the brand-color system already defined in `globals.css`. Three form touch-points (hero mini, brochure micro, final full) all POST to the same lead endpoint. No DB; lead data is logged to Edge console + delivered via two channels.

**Tech Stack:** Next.js 16 (App Router, Edge runtime), Zod (validation), React Hook Form (form state), Resend (transactional email + PDF attachment), Meta Graph API v21.0 (WhatsApp Cloud), Tailwind v4 + ShadCN tokens (already on the project).

**Spec:** `docs/superpowers/specs/2026-05-11-mater-maria-invest-page-design.md`

---

## File map

| Path | Action | Responsibility |
|---|---|---|
| `package.json` | modify | Add `resend` dep |
| `vercel.json` | modify | Remove `/invest` redirect that currently 308s to landing |
| `src/lib/lead-schema.ts` | create | Zod schema for `LeadPayload` + types |
| `src/lib/email-template.ts` | create | Pure function returning HTML email body string |
| `src/lib/whatsapp-payload.ts` | create | Pure function returning Meta Graph API request body |
| `src/app/api/lead/route.ts` | create | POST handler — validate + fan-out to Resend & Meta |
| `src/app/api/whatsapp/route.ts` | create | GET (Meta webhook verify) + POST (event log) |
| `src/app/invest/page.tsx` | replace | New 11-section page replacing the existing 4-tier-Diamond version |
| `src/app/invest/sections/Hero.tsx` | create | Section 1 + hero mini-form |
| `src/app/invest/sections/WhyNow.tsx` | create | Section 2 narrative + stat strip |
| `src/app/invest/sections/Tiers.tsx` | create | Section 3 — 3 tier cards with multi-currency |
| `src/app/invest/sections/RoiCalculator.tsx` | create | Section 4 — interactive slider + chart |
| `src/app/invest/sections/Estate.tsx` | create | Section 5 — 6-card masonry gallery |
| `src/app/invest/sections/Governance.tsx` | create | Section 6 — 9 board cards |
| `src/app/invest/sections/SpiritualFoundation.tsx` | create | Section 7 — Polynesian Blue scripture band |
| `src/app/invest/sections/Faq.tsx` | create | Section 8 — 8 collapsibles, CSS-only |
| `src/app/invest/sections/BrochureCta.tsx` | create | Section 9 — micro-form |
| `src/app/invest/sections/FinalLeadForm.tsx` | create | Section 10 — full form |
| `src/app/invest/sections/Footer.tsx` | create | Section 11 — legal entity + CIN |
| `src/app/globals.css` | modify | Add `--brand-blue` + `--brand-blue-deep` CSS vars |
| `public/brochures/mater-maria-investor-deck.pdf` | add | Brochure to attach to email |
| `.env.example` | modify | Document `RESEND_API_KEY`, `WA_TOKEN`, `WA_PHONE_ID`, `WA_WEBHOOK_VERIFY_TOKEN` |

---

## Task 1: Pre-flight — build sanity + dep install

**Files:**
- Modify: `package.json`
- Modify: `.env.example`

- [ ] **Step 1.1: Verify current Next.js build passes**

Run: `cd "/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/mater-maria" && npm run build`
Expected: Build succeeds, 18+ routes compile, no errors. If it fails, fix the build before proceeding (likely missing Garabosse fonts or import errors).

- [ ] **Step 1.2: Install Resend SDK**

Run: `npm install resend@^4.0.0`
Expected: Adds `resend` to `package.json` dependencies. Lock file updates.

- [ ] **Step 1.3: Add env vars to `.env.example`**

Append to `.env.example`:
```
# Lead pipeline — /api/lead
RESEND_API_KEY=re_xxx
WA_TOKEN=EAAxxx
WA_PHONE_ID=1234567890
WA_WEBHOOK_VERIFY_TOKEN=mater_maria_2026_verify_xxx
```

- [ ] **Step 1.4: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore(mater-maria): add resend + env vars for /invest lead pipeline

Co-Authored-By: E.Fdz <admin@taurusai.io>
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Lead schema (`src/lib/lead-schema.ts`)

**Files:**
- Create: `src/lib/lead-schema.ts`

- [ ] **Step 2.1: Write the schema**

Create `src/lib/lead-schema.ts`:
```typescript
import { z } from 'zod';

export const TierEnum = z.enum(['silver', 'gold', 'platinum', 'undecided']);
export type Tier = z.infer<typeof TierEnum>;

export const SourceEnum = z.enum([
  'hero-mini',
  'brochure-micro',
  'final-full',
  'tier-card-button',
]);
export type Source = z.infer<typeof SourceEnum>;

export const LeadPayloadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, 'Phone must be E.164 format, e.g. +919876543210'),
  tier: TierEnum.default('undecided'),
  message: z.string().trim().max(500).optional(),
  source: SourceEnum.default('final-full'),
});

export type LeadPayload = z.infer<typeof LeadPayloadSchema>;

export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

export function getTierLabel(tier: Tier): string {
  if (tier === 'undecided') return 'residence programme';
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
```

- [ ] **Step 2.2: Verify TypeScript compiles**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "(lead-schema|error TS)" | head -20`
Expected: No errors mentioning `lead-schema.ts`.

- [ ] **Step 2.3: Quick correctness check (one-liner)**

Run:
```bash
node --experimental-strip-types -e "
import {LeadPayloadSchema} from './src/lib/lead-schema.ts';
const ok = LeadPayloadSchema.safeParse({name:'Sarah K',email:'s@x.com',phone:'+919876543210',tier:'gold',source:'hero-mini'});
const bad = LeadPayloadSchema.safeParse({name:'A',email:'not-email',phone:'9876543210'});
console.log('ok:', ok.success);
console.log('bad:', bad.success === false ? bad.error.issues.map(i=>i.path.join('.')+': '+i.message) : 'unexpectedly passed');
"
```
Expected:
```
ok: true
bad: [ 'name: Too small...', 'email: Invalid email', 'phone: Phone must be E.164...' ]
```

- [ ] **Step 2.4: Commit**

```bash
git add src/lib/lead-schema.ts
git commit -m "feat(mater-maria): add LeadPayload zod schema for /api/lead"
```

---

## Task 3: Email template builder (`src/lib/email-template.ts`)

**Files:**
- Create: `src/lib/email-template.ts`

- [ ] **Step 3.1: Write the template builder**

Create `src/lib/email-template.ts`:
```typescript
import type { LeadPayload } from './lead-schema';
import { getFirstName, getTierLabel } from './lead-schema';

export function emailTemplate(lead: LeadPayload): { subject: string; html: string } {
  const firstName = getFirstName(lead.name);
  const tierLabel = getTierLabel(lead.tier);

  const subject = `Welcome to Mater Maria, ${firstName}`;

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#FFFBF5;font-family:Helvetica,Arial,sans-serif;color:#333">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="600" style="max-width:600px;background:#FFFBF5;border:1px solid rgba(0,0,0,.08);border-radius:12px;overflow:hidden">
        <tr><td style="background:#224C98;padding:24px;text-align:center;color:#fff;font-family:Georgia,serif">
          <div style="font-size:14px;letter-spacing:.2em;opacity:.85">MATER MARIA HOMES</div>
          <div style="font-size:13px;font-style:italic;margin-top:4px;color:#C09B5E">Living Refined</div>
        </td></tr>
        <tr><td style="padding:32px 32px 8px">
          <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:400;font-size:28px;color:#191D23">Dear ${escapeHtml(firstName)},</h1>
          <p style="margin:0 0 16px;line-height:1.7;font-size:16px">Thank you for your interest in Mater Maria Homes — a sanctuary of grace, peace, and dignity, crafted for those who have walked life's journey with faith and strength.</p>
          <p style="margin:0 0 24px;line-height:1.7;font-size:16px">Attached is our complete investor information deck. It covers:</p>
          <ul style="margin:0 0 24px;padding-left:20px;line-height:1.9;font-size:15px">
            <li>The Silver, Gold, and Platinum share-deposit programmes</li>
            <li>The 15-year ROI model (150–153% projected returns)</li>
            <li>Estate amenities, medical infrastructure, and chapel plans</li>
            <li>Founder profiles and governance structure</li>
          </ul>
          <p style="margin:0 0 16px;line-height:1.7;font-size:16px">A member of our team will be in touch within 2 hours regarding the <strong>${escapeHtml(tierLabel)}</strong> details. In the meantime, reach us instantly on WhatsApp:</p>
          <p style="margin:0 0 24px;text-align:center"><a href="https://wa.me/919447080356?text=Hello%20Mater%20Maria" style="display:inline-block;background:#C09B5E;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:16px">💬 WhatsApp +91 94470 80356</a></p>
        </td></tr>
        <tr><td style="padding:16px 32px 8px;border-top:1px solid rgba(0,0,0,.06)">
          <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:14px;color:#C09B5E;text-align:center;line-height:1.6">"He will cover you with His feathers, and under His wings you will find refuge."<br><span style="font-size:12px;opacity:.7;font-style:normal">— Psalm 91:4</span></p>
        </td></tr>
        <tr><td style="padding:24px 32px;background:#F7F2E9;font-size:12px;color:rgba(25,29,35,.6);line-height:1.6">
          <strong style="color:#191D23">Mater Maria Wellness Homes Pvt. Ltd.</strong><br>
          P.B. No: 22, Kanjirapally, Kottayam, Kerala 686507, India<br>
          +91 94470 80356 · <a href="mailto:info@matermariahomes.com" style="color:#C09B5E">info@matermariahomes.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
```

- [ ] **Step 3.2: Render once to preview HTML**

Run:
```bash
node --experimental-strip-types -e "
import {emailTemplate} from './src/lib/email-template.ts';
const {subject, html} = emailTemplate({name:'Sarah Kumar',email:'s@x.com',phone:'+919876543210',tier:'gold',source:'hero-mini'});
console.log('Subject:', subject);
console.log('HTML len:', html.length);
require('fs').writeFileSync('/tmp/email-preview.html', html);
console.log('Wrote /tmp/email-preview.html — open in browser to preview');
"
open /tmp/email-preview.html
```
Expected: Browser opens showing branded email with "Dear Sarah", gold WhatsApp button, blue header, Psalm 91:4 quote, legal entity footer.

- [ ] **Step 3.3: Commit**

```bash
git add src/lib/email-template.ts
git commit -m "feat(mater-maria): add transactional email template for lead welcome"
```

---

## Task 4: WhatsApp payload builder (`src/lib/whatsapp-payload.ts`)

**Files:**
- Create: `src/lib/whatsapp-payload.ts`

- [ ] **Step 4.1: Write the payload builder**

Create `src/lib/whatsapp-payload.ts`:
```typescript
import type { LeadPayload } from './lead-schema';
import { getFirstName, getTierLabel } from './lead-schema';

export function whatsappPayload(lead: LeadPayload) {
  return {
    messaging_product: 'whatsapp' as const,
    to: lead.phone.replace(/^\+/, ''),
    type: 'template' as const,
    template: {
      name: 'investor_welcome',
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: getFirstName(lead.name) },
            { type: 'text', text: getTierLabel(lead.tier) },
          ],
        },
      ],
    },
  };
}
```

- [ ] **Step 4.2: Sanity-check payload shape**

Run:
```bash
node --experimental-strip-types -e "
import {whatsappPayload} from './src/lib/whatsapp-payload.ts';
const p = whatsappPayload({name:'Sarah Kumar',email:'s@x.com',phone:'+919876543210',tier:'undecided',source:'final-full'});
console.log(JSON.stringify(p, null, 2));
"
```
Expected output (note: `to` strips the `+`, `tier=undecided` becomes `residence programme`):
```json
{
  "messaging_product": "whatsapp",
  "to": "919876543210",
  "type": "template",
  "template": {
    "name": "investor_welcome",
    "language": { "code": "en" },
    "components": [
      { "type": "body", "parameters": [
        { "type": "text", "text": "Sarah" },
        { "type": "text", "text": "residence programme" }
      ]}
    ]
  }
}
```

- [ ] **Step 4.3: Commit**

```bash
git add src/lib/whatsapp-payload.ts
git commit -m "feat(mater-maria): add WhatsApp Cloud API payload builder"
```

---

## Task 5: `/api/lead` Edge route handler

**Files:**
- Create: `src/app/api/lead/route.ts`

- [ ] **Step 5.1: Write the handler**

Create `src/app/api/lead/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { LeadPayloadSchema } from '@/lib/lead-schema';
import { emailTemplate } from '@/lib/email-template';
import { whatsappPayload } from '@/lib/whatsapp-payload';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const BROCHURE_URL =
  'https://matermariahomes.com/brochures/mater-maria-investor-deck.pdf';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = LeadPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }
  const lead = parsed.data;

  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendEmail(lead),
    sendWhatsApp(lead),
  ]);

  const emailOk = emailResult.status === 'fulfilled' && emailResult.value.ok;
  const whatsappOk =
    whatsappResult.status === 'fulfilled' && whatsappResult.value.ok;

  // Log to Edge console for postmortem; visible in `vercel logs`
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      lead: { ...lead, email: redact(lead.email), phone: redact(lead.phone) },
      delivery: { email: emailOk, whatsapp: whatsappOk },
      diag: {
        emailStatus:
          emailResult.status === 'fulfilled'
            ? emailResult.value.status
            : 'rejected',
        whatsappStatus:
          whatsappResult.status === 'fulfilled'
            ? whatsappResult.value.status
            : 'rejected',
      },
    })
  );

  if (!emailOk && !whatsappOk) {
    return NextResponse.json({ error: 'both_channels_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, email: emailOk, whatsapp: whatsappOk });
}

async function sendEmail(lead: ReturnType<typeof LeadPayloadSchema.parse>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, status: 'missing_RESEND_API_KEY' as const };

  const { subject, html } = emailTemplate(lead);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Mater Maria Homes <noreply@matermariahomes.com>',
      to: [lead.email],
      bcc: ['praveenissacs@gmail.com'],
      subject,
      html,
      attachments: [
        {
          filename: 'Mater-Maria-Investor-Deck.pdf',
          path: BROCHURE_URL,
        },
      ],
    }),
  });

  return { ok: res.ok, status: String(res.status) };
}

async function sendWhatsApp(lead: ReturnType<typeof LeadPayloadSchema.parse>) {
  const token = process.env.WA_TOKEN;
  const phoneId = process.env.WA_PHONE_ID;
  if (!token || !phoneId) {
    return { ok: false, status: 'missing_WA_env' as const };
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(whatsappPayload(lead)),
    }
  );

  return { ok: res.ok, status: String(res.status) };
}

function redact(s: string): string {
  if (s.length <= 6) return '***';
  return s.slice(0, 2) + '***' + s.slice(-2);
}
```

- [ ] **Step 5.2: Verify TypeScript still compiles**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "(api/lead|error TS)" | head -10`
Expected: No errors mentioning `api/lead/route.ts`.

- [ ] **Step 5.3: Start dev server**

Run (background): `npm run dev`
Wait until `localhost:3000` is ready (~10s).

- [ ] **Step 5.4: Smoke-test with curl — invalid input**

Run:
```bash
curl -s -X POST http://localhost:3000/api/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"A"}' | python3 -m json.tool
```
Expected: HTTP 400 with `{"error": "validation_failed", "issues": [...]}` showing required field errors.

- [ ] **Step 5.5: Smoke-test with curl — valid input, missing env**

Run:
```bash
curl -s -X POST http://localhost:3000/api/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test@example.com","phone":"+919876543210","tier":"gold","source":"hero-mini"}' \
  | python3 -m json.tool
```
Expected: HTTP 502 with `{"error": "both_channels_failed"}` since RESEND_API_KEY and WA_TOKEN are not set locally. Check `npm run dev` logs for the JSON log line confirming validation passed.

- [ ] **Step 5.6: Stop dev server, commit**

Kill `npm run dev`.
```bash
git add src/app/api/lead/route.ts
git commit -m "feat(mater-maria): add /api/lead Edge handler with parallel email+whatsapp delivery"
```

---

## Task 6: `/api/whatsapp` webhook handler

**Files:**
- Create: `src/app/api/whatsapp/route.ts`

- [ ] **Step 6.1: Write the handler**

Create `src/app/api/whatsapp/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Meta hits this on subscribe; we echo `hub.challenge` if token matches.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const expected = process.env.WA_WEBHOOK_VERIFY_TOKEN;
  if (mode === 'subscribe' && token && expected && token === expected) {
    return new Response(challenge ?? '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  return new Response('forbidden', { status: 403 });
}

// Meta posts inbound events here. v1: log + ack 200.
export async function POST(req: Request) {
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    /* meta sometimes sends empty bodies on health pings */
  }
  console.log('wa-webhook', JSON.stringify({ ts: new Date().toISOString(), body }));
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6.2: Smoke-test verification**

Run (background): `npm run dev`
Run: `curl -s "http://localhost:3000/api/whatsapp?hub.mode=subscribe&hub.verify_token=test&hub.challenge=hello"`
Expected: `forbidden` (because WA_WEBHOOK_VERIFY_TOKEN is unset).

Run: `WA_WEBHOOK_VERIFY_TOKEN=test npm run dev` (kill prior; restart)
Then: `curl -s "http://localhost:3000/api/whatsapp?hub.mode=subscribe&hub.verify_token=test&hub.challenge=hello"`
Expected: `hello` returned as plain text, HTTP 200.

- [ ] **Step 6.3: Smoke-test event POST**

Run: `curl -s -X POST http://localhost:3000/api/whatsapp -H 'Content-Type: application/json' -d '{"object":"whatsapp_business_account","entry":[]}'`
Expected: `{"ok": true}` and dev-server log shows the body.

- [ ] **Step 6.4: Stop dev, commit**

```bash
git add src/app/api/whatsapp/route.ts
git commit -m "feat(mater-maria): add /api/whatsapp Meta webhook handler (verify + event log)"
```

---

## Task 7: Add brand-blue CSS vars + remove blocking redirect

**Files:**
- Modify: `src/app/globals.css`
- Modify: `vercel.json`

- [ ] **Step 7.1: Locate the `:root` block in `globals.css`**

Run: `grep -n -E "(:root|--accent-gold)" src/app/globals.css | head -10`
Note the line numbers for `:root` and where the existing `--accent-gold` lives.

- [ ] **Step 7.2: Add brand-blue tokens**

Edit `src/app/globals.css` — inside the `:root` block where `--accent-gold` lives, immediately after the gold tokens, add:
```css
  --brand-blue: #224C98;
  --brand-blue-deep: #006394;
  --brand-blue-glow: rgba(34,76,152,0.15);
```

If using `@theme inline` (Tailwind v4), add same tokens there as well — match existing pattern.

- [ ] **Step 7.3: Remove the `/invest` redirect from `vercel.json`**

The redirect currently sends `/invest` to `/index-landing.html#tiers`, which would intercept our new page.

Edit `vercel.json` — remove this line from the `redirects` array:
```json
{ "source": "/invest", "destination": "/index-landing.html#tiers", "permanent": true },
```

Keep all other redirects. The `/investors` redirect can stay (still points to anchor) — only remove `/invest`.

- [ ] **Step 7.4: Verify Next.js build still passes**

Run: `npm run build`
Expected: Build succeeds. The existing `/invest/page.tsx` (4-tier-Diamond version) will be replaced in Task 8, but for now it still builds.

- [ ] **Step 7.5: Commit**

```bash
git add src/app/globals.css vercel.json
git commit -m "feat(mater-maria): add Polynesian Blue tokens + remove /invest redirect"
```

---

## Task 8: Replace `/invest/page.tsx` skeleton + Hero section

**Files:**
- Replace: `src/app/invest/page.tsx`
- Create: `src/app/invest/sections/Hero.tsx`

- [ ] **Step 8.1: Inspect the existing `/invest` page**

Run: `wc -l src/app/invest/page.tsx; head -20 src/app/invest/page.tsx`
Note what's there. We're replacing the entire page export.

- [ ] **Step 8.2: Create the page shell**

Replace `src/app/invest/page.tsx` entirely with:
```typescript
import type { Metadata } from 'next';
import { Hero } from './sections/Hero';

export const metadata: Metadata = {
  title: 'Investor Programme | Mater Maria Homes — Living Refined',
  description:
    'A board-supervised share-deposit programme with 10% annual interest and 150–153% projected 15-year returns. Silver, Gold, Platinum tiers from ₹10L.',
  openGraph: {
    title: 'Mater Maria Homes — Investor Programme',
    description:
      'Sacred protection. Returns refined. 15-year share-deposit programme in Kerala.',
    type: 'website',
    url: 'https://matermariahomes.com/invest',
  },
};

export default function InvestPage() {
  return (
    <main className="invest-page" style={{ background: 'var(--bg-body, #FFFBF5)' }}>
      <Hero />
      {/* Sections 2–11 added in subsequent tasks */}
    </main>
  );
}
```

- [ ] **Step 8.3: Create the Hero section**

Create `src/app/invest/sections/Hero.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeadPayloadSchema, type LeadPayload } from '@/lib/lead-schema';

export function Hero() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadPayload>({
    resolver: zodResolver(LeadPayloadSchema),
    defaultValues: { tier: 'undecided', source: 'hero-mini' },
  });

  const onSubmit = async (data: LeadPayload) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'hero-mini' }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || `HTTP ${res.status}`);
        setStatus('error');
        return;
      }
      setStatus('ok');
      reset();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'network');
      setStatus('error');
    }
  };

  return (
    <section
      id="hero"
      style={{
        background:
          'linear-gradient(135deg, var(--brand-blue-deep, #006394) 0%, var(--brand-blue, #224C98) 100%)',
        color: '#fff',
        padding: 'clamp(80px,12vw,140px) clamp(20px,5vw,60px)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div
          style={{
            fontSize: 14,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold-light, #D4B77A)',
            marginBottom: 24,
          }}
        >
          ◇ Investor Programme · Kerala
        </div>
        <h1
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '.02em',
            margin: '0 0 24px',
            maxWidth: 900,
          }}
        >
          Sacred protection.<br />
          <em style={{ color: 'var(--accent-gold-light, #D4B77A)' }}>Returns refined.</em>
        </h1>
        <p style={{ fontSize: 'clamp(16px,2vw,20px)', lineHeight: 1.6, maxWidth: 720, margin: '0 0 32px', opacity: 0.92 }}>
          A share-deposit model with 10% annual interest for 4 years, then 6%–20% escalating dividends through year 15. Backed by faith, governance, and 100% solar net-zero design.
        </p>

        {/* Trust pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
          {[
            { t: '10% interest', s: 'Years 1–4' },
            { t: '150–153%', s: '15-yr return' },
            { t: '90 residences', s: 'Board-led' },
            { t: 'Pala Diocese', s: 'Patronage' },
          ].map((p, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 100, padding: '10px 18px', fontSize: 13 }}>
              <strong>{p.t}</strong> · <span style={{ opacity: 0.8 }}>{p.s}</span>
            </div>
          ))}
        </div>

        {/* Mini-form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 16, padding: 24, maxWidth: 640 }}
        >
          {status === 'ok' ? (
            <div style={{ padding: 16, textAlign: 'center', fontSize: 16, lineHeight: 1.6 }}>
              ✓ Thank you. Your investor deck is on its way to your inbox.<br />
              <span style={{ fontSize: 14, opacity: 0.85 }}>Praveen will WhatsApp you within 2 hours.</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <input
                  {...register('name')}
                  placeholder="Your name"
                  style={inputStyle}
                  aria-label="Your name"
                />
                <input
                  {...register('phone')}
                  placeholder="+91 98765 43210"
                  style={inputStyle}
                  aria-label="WhatsApp number with country code"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <input
                  {...register('email')}
                  placeholder="email@example.com"
                  style={inputStyle}
                  type="email"
                  aria-label="Email"
                />
                <select {...register('tier')} style={inputStyle} aria-label="Tier of interest">
                  <option value="undecided">Tier — undecided</option>
                  <option value="silver">Silver (₹10L)</option>
                  <option value="gold">Gold (₹20L) — Best Value</option>
                  <option value="platinum">Platinum (₹30L) — Premium</option>
                </select>
              </div>
              {(errors.name || errors.email || errors.phone) && (
                <div style={{ fontSize: 13, color: '#FFD9D9', marginBottom: 12 }}>
                  {errors.name?.message || errors.email?.message || errors.phone?.message}
                </div>
              )}
              {status === 'error' && (
                <div style={{ fontSize: 13, color: '#FFD9D9', marginBottom: 12 }}>
                  {errorMsg === 'both_channels_failed'
                    ? 'Delivery is delayed — WhatsApp +91 94470 80356 directly. We have your details.'
                    : `Something went wrong: ${errorMsg}`}
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  style={{ background: 'var(--accent-gold, #C09B5E)', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase', opacity: status === 'submitting' ? 0.6 : 1 }}
                >
                  {status === 'submitting' ? 'Sending…' : 'Get the investor deck →'}
                </button>
                <a
                  href="https://wa.me/919447080356?text=Hello%2C%20I%27m%20interested%20in%20the%20Mater%20Maria%20investor%20programme."
                  target="_blank"
                  rel="noopener"
                  style={{ background: 'rgba(255,255,255,.15)', color: '#fff', textDecoration: 'none', borderRadius: 8, padding: '14px 24px', fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  💬 WhatsApp
                </a>
              </div>
            </>
          )}
        </form>

        <p style={{ marginTop: 48, fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(14px,1.6vw,18px)', color: 'var(--accent-gold-light, #D4B77A)', maxWidth: 640, lineHeight: 1.6 }}>
          "He will cover you with His feathers, and under His wings you will find refuge." — Psalm 91:4
        </p>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.92)',
  border: 'none',
  borderRadius: 8,
  padding: '12px 14px',
  fontSize: 15,
  color: '#191D23',
  outline: 'none',
};
```

- [ ] **Step 8.4: Build + visual check**

Run: `npm run build && npm run dev` (background)
Open: `open http://localhost:3000/invest`
Expected: Polynesian Blue hero, gold "Returns refined" italic, 4 trust pills, mini-form with 4 fields, gold CTA button, Psalm 91:4 quote at bottom.

- [ ] **Step 8.5: Submit form locally (validation only, env unset)**

In the browser: fill name "Test", email "test@example.com", phone "+919876543210", tier "Gold". Click submit.
Expected: Sees the error fallback ("Delivery is delayed — WhatsApp +91 94470 80356 directly. We have your details.") because env vars aren't set. Form state behaves correctly.

- [ ] **Step 8.6: Stop dev, commit**

```bash
git add src/app/invest/page.tsx src/app/invest/sections/Hero.tsx
git commit -m "feat(mater-maria): /invest hero section with mini-form (4 fields) + Psalm 91:4"
```

---

## Task 9: Sections 2–4 (Why Now, Tiers, ROI Calculator)

**Files:**
- Create: `src/app/invest/sections/WhyNow.tsx`
- Create: `src/app/invest/sections/Tiers.tsx`
- Create: `src/app/invest/sections/RoiCalculator.tsx`
- Modify: `src/app/invest/page.tsx` (add imports)

- [ ] **Step 9.1: Create `WhyNow.tsx`**

Create `src/app/invest/sections/WhyNow.tsx`:
```typescript
export function WhyNow() {
  const stats = [
    { n: '11,000+', l: 'NRI-Kerala households retiring back to India each year', s: 'KMC 2024' },
    { n: '18+ yrs', l: 'Average runway of NRI retirement savings in legacy real estate', s: 'industry est.' },
    { n: '2026', l: 'First board-approved share-deposit retirement model in central Travancore', s: 'Mater Maria' },
  ];
  return (
    <section id="why-now" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)', background: 'var(--bg-beige, #F7F2E9)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 20 }}>The case for now</div>
        <h2 style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.15, letterSpacing: '-1px', color: 'var(--text-heading, #191D23)', maxWidth: 880, margin: '0 0 32px' }}>
          The largest reverse-migration of Kerala diaspora retirees in two decades — and almost no investor-grade product to receive them.
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(25,29,35,.7)', maxWidth: 880, marginBottom: 48 }}>
          Kerala has the highest concentration of NRI returnees in India. Most return to legacy real-estate or family land — illiquid, ungoverned, and stripped of community. Mater Maria offers a board-supervised share-deposit programme purpose-built for this audience: predictable yield in years 1–4, escalating dividends through year 15, and a residence-eligible covenant for those who want to retire on the estate itself.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ borderTop: '2px solid var(--accent-gold)', paddingTop: 16 }}>
              <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 300, color: 'var(--text-heading)', letterSpacing: '-1px' }}>{s.n}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(25,29,35,.7)', marginTop: 8 }}>{s.l}</div>
              <div style={{ fontSize: 12, color: 'rgba(25,29,35,.45)', marginTop: 4, fontStyle: 'italic' }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 9.2: Create `Tiers.tsx`**

Create `src/app/invest/sections/Tiers.tsx`:
```typescript
'use client';

const TIERS = [
  {
    id: 'silver',
    name: 'Silver',
    inr: '₹10,00,000',
    fx: '$12K · £9.5K · A$18K · NZ$19.5K',
    badge: null,
    perks: [
      '10% annual interest (Years 1–4)',
      '6% → 14% dividends (Years 5–15)',
      'Guest room 2 days/yr',
      'Event hall ½ day/yr',
    ],
    roi: '~150% over 15 years',
  },
  {
    id: 'gold',
    name: 'Gold',
    inr: '₹20,00,000',
    fx: '$24K · £19K · A$36K · NZ$39K',
    badge: 'Best Value',
    perks: [
      '10% annual interest (Years 1–4)',
      '8% → 16% dividends (Years 5–15)',
      'Guest room 3 days/yr',
      'Event hall 1 day/yr',
    ],
    roi: '150% headline ROI',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    inr: '₹30,00,000',
    fx: '$36K · £28.5K · A$54K · NZ$59K',
    badge: 'Premium',
    perks: [
      '10% annual interest (Years 1–4)',
      '10% → 20% dividends (Years 5–15)',
      'Guest room 4 days/yr',
      'Event hall 2 days/yr',
    ],
    roi: '153% headline ROI',
  },
] as const;

export function Tiers() {
  const choose = (tierId: string) => {
    // Pre-select tier in final form
    const finalForm = document.getElementById('final-form-tier') as HTMLSelectElement | null;
    if (finalForm) finalForm.value = tierId;
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section id="tiers" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)', background: 'var(--bg-body, #FFFBF5)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 20, textAlign: 'center' }}>The three tiers</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.4rem,5vw,3.6rem)', fontWeight: 400, textAlign: 'center', color: 'var(--text-heading)', marginBottom: 16 }}>
          Choose your <em style={{ color: 'var(--accent-gold)' }}>covenant</em>
        </h2>
        <p style={{ textAlign: 'center', fontSize: 17, color: 'rgba(25,29,35,.65)', maxWidth: 720, margin: '0 auto 64px', lineHeight: 1.6 }}>
          Every tier returns capital with interest in Years 1–4, then escalating dividends through Year 15.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {TIERS.map((t) => (
            <div key={t.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 16, padding: '40px 28px 28px', position: 'relative', boxShadow: t.badge === 'Best Value' ? '0 12px 36px rgba(192,155,94,.18)' : 'none' }}>
              {t.badge && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-gold)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '6px 18px', borderRadius: 100 }}>{t.badge}</div>
              )}
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.8rem', color: 'var(--text-heading)', margin: '8px 0 4px' }}>{t.name}</h3>
              <div style={{ fontSize: '2.4rem', fontWeight: 300, color: 'var(--text-heading)', letterSpacing: '-1px', marginBottom: 4 }}>{t.inr}</div>
              <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: 'rgba(25,29,35,.55)', marginBottom: 20 }}>{t.fx}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', borderTop: '1px solid rgba(0,0,0,.06)', paddingTop: 20 }}>
                {t.perks.map((p, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'rgba(25,29,35,.75)', padding: '8px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--accent-gold)' }}>✓</span>{p}
                  </li>
                ))}
              </ul>
              <button onClick={() => choose(t.id)} style={{ width: '100%', background: t.badge === 'Best Value' ? 'var(--accent-gold)' : 'transparent', color: t.badge === 'Best Value' ? '#fff' : 'var(--text-heading)', border: t.badge === 'Best Value' ? 'none' : '1.5px solid rgba(0,0,0,.15)', borderRadius: 8, padding: '14px 20px', fontSize: 14, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Choose {t.name} →
              </button>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'rgba(25,29,35,.5)', fontFamily: 'ui-monospace, monospace', letterSpacing: '.05em' }}>{t.roi}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 9.3: Create `RoiCalculator.tsx`**

Create `src/app/invest/sections/RoiCalculator.tsx`:
```typescript
'use client';
import { useMemo, useState } from 'react';

const RATES = {
  silver:   { interest: 0.10, divStart: 0.06, divEnd: 0.14, principal: 1000000 },
  gold:     { interest: 0.10, divStart: 0.08, divEnd: 0.16, principal: 2000000 },
  platinum: { interest: 0.10, divStart: 0.10, divEnd: 0.20, principal: 3000000 },
} as const;

type TierId = keyof typeof RATES;

export function RoiCalculator() {
  const [tier, setTier] = useState<TierId>('gold');
  const [years, setYears] = useState(15);

  const projection = useMemo(() => {
    const r = RATES[tier];
    let cumulative = 0;
    const annual: { year: number; payout: number; cumulative: number }[] = [];
    for (let y = 1; y <= years; y++) {
      let payout: number;
      if (y <= 4) {
        payout = r.principal * r.interest;
      } else {
        const span = 15 - 5;
        const frac = (y - 5) / span;
        const rate = r.divStart + (r.divEnd - r.divStart) * frac;
        payout = r.principal * rate;
      }
      cumulative += payout;
      annual.push({ year: y, payout, cumulative });
    }
    const total = r.principal + cumulative;
    return { annual, total, principal: r.principal, returnPct: ((total - r.principal) / r.principal) * 100 };
  }, [tier, years]);

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
  const maxBar = Math.max(...projection.annual.map((a) => a.payout));

  return (
    <section id="roi" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)', background: 'var(--bg-beige, #F7F2E9)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 20, textAlign: 'center' }}>Run the numbers</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.2rem,4.5vw,3.2rem)', fontWeight: 400, textAlign: 'center', color: 'var(--text-heading)', marginBottom: 48 }}>
          15-year <em style={{ color: 'var(--accent-gold)' }}>projection</em>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 16, marginBottom: 48 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(25,29,35,.6)', marginBottom: 8 }}>Tier</label>
            <select value={tier} onChange={(e) => setTier(e.target.value as TierId)} style={selectStyle}>
              <option value="silver">Silver (₹10L)</option>
              <option value="gold">Gold (₹20L)</option>
              <option value="platinum">Platinum (₹30L)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(25,29,35,.6)', marginBottom: 8 }}>Hold for</label>
            <input type="range" min={5} max={15} value={years} onChange={(e) => setYears(parseInt(e.target.value, 10))} style={{ width: '100%' }} />
            <div style={{ fontSize: 14, color: 'rgba(25,29,35,.7)', marginTop: 6 }}>{years} years</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(25,29,35,.6)', marginBottom: 8 }}>Total at Year {years}</label>
            <div style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: 'var(--text-heading)', fontWeight: 300, letterSpacing: '-1px' }}>₹{fmt(projection.total)}</div>
            <div style={{ fontSize: 14, color: 'var(--accent-gold)', fontWeight: 600 }}>+{projection.returnPct.toFixed(0)}% on capital</div>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 200, padding: '20px 0', borderBottom: '1px solid rgba(0,0,0,.08)' }}>
          {projection.annual.map((a) => (
            <div key={a.year} title={`Year ${a.year}: ₹${fmt(a.payout)}`} style={{ flex: 1, height: `${(a.payout / maxBar) * 100}%`, background: a.year <= 4 ? 'var(--brand-blue, #224C98)' : 'var(--accent-gold, #C09B5E)', borderRadius: '4px 4px 0 0', transition: 'height .3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(25,29,35,.55)', marginTop: 8, fontFamily: 'ui-monospace, monospace' }}>
          {projection.annual.map((a) => <span key={a.year}>Y{a.year}</span>)}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(25,29,35,.55)', textAlign: 'center', marginTop: 16 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--brand-blue)', borderRadius: 2, marginRight: 6 }}></span>Interest (Y1–Y4)
          &nbsp;&nbsp;
          <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--accent-gold)', borderRadius: 2, marginRight: 6 }}></span>Dividends (Y5+)
        </div>
      </div>
    </section>
  );
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: '#fff',
  border: '1px solid rgba(0,0,0,.12)',
  borderRadius: 8,
  padding: '12px 14px',
  fontSize: 15,
  color: '#191D23',
  outline: 'none',
};
```

- [ ] **Step 9.4: Wire all 3 sections into the page**

Edit `src/app/invest/page.tsx`. Replace the body of `InvestPage`:
```typescript
import { Hero } from './sections/Hero';
import { WhyNow } from './sections/WhyNow';
import { Tiers } from './sections/Tiers';
import { RoiCalculator } from './sections/RoiCalculator';

// ... keep `metadata` block ...

export default function InvestPage() {
  return (
    <main className="invest-page" style={{ background: 'var(--bg-body, #FFFBF5)' }}>
      <Hero />
      <WhyNow />
      <Tiers />
      <RoiCalculator />
    </main>
  );
}
```

- [ ] **Step 9.5: Build + visual check**

Run: `npm run build && npm run dev` (background)
Open: `open http://localhost:3000/invest`
Expected:
  - Hero unchanged from Task 8
  - WhyNow section: cream background, 3-stat strip, narrative paragraph
  - Tiers section: 3 cards, Gold has gold "Best Value" badge + gold button
  - ROI Calculator: tier select, year slider, animated bar chart with blue+gold bars

- [ ] **Step 9.6: Interaction check**

In Tiers: click "Choose Gold". Page should scroll to `#contact` (not yet built — error console may say it scrolled but found no element). That's OK for now — will be fixed in Task 11.
In ROI Calc: change tier and slider — bars update smoothly, total updates.

- [ ] **Step 9.7: Stop dev, commit**

```bash
git add src/app/invest/page.tsx src/app/invest/sections/WhyNow.tsx src/app/invest/sections/Tiers.tsx src/app/invest/sections/RoiCalculator.tsx
git commit -m "feat(mater-maria): /invest sections 2-4 — Why Now, Tiers, ROI calculator"
```

---

## Task 10: Sections 5–7 (Estate, Governance, Spiritual Foundation)

**Files:**
- Create: `src/app/invest/sections/Estate.tsx`
- Create: `src/app/invest/sections/Governance.tsx`
- Create: `src/app/invest/sections/SpiritualFoundation.tsx`
- Modify: `src/app/invest/page.tsx`

- [ ] **Step 10.1: Create `Estate.tsx`** with 6-card masonry grid

Create `src/app/invest/sections/Estate.tsx`:
```typescript
const FACILITIES = [
  { t: 'Chapel', d: 'Diocesan-compliant exterior + interior. Daily Mass.', img: '/assets-2025/images/estate/chapel.jpg' },
  { t: 'Medical Wing', d: '8-bed ICU, on-site doctors, MMT Hospital annexure.', img: '/assets-2025/images/estate/medical.jpg' },
  { t: 'Dining Hall', d: '220-seat refectory + organic central kitchen.', img: '/assets-2025/images/estate/dining.jpg' },
  { t: 'Villas', d: 'Fusion of Kerala vernacular + Mediterranean.', img: '/assets-2025/images/estate/villas.jpg' },
  { t: 'Yoga & Ayurveda', d: 'Treatment block + meditation halls.', img: '/assets-2025/images/estate/yoga.jpg' },
  { t: 'Orchards & Ponds', d: 'Tropical fruit, private fishing, water-rechargeable wells.', img: '/assets-2025/images/estate/orchard.jpg' },
];

export function Estate() {
  return (
    <section id="estate" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)', background: 'var(--bg-body)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 20 }}>The estate</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.2rem,4.5vw,3.2rem)', fontWeight: 400, color: 'var(--text-heading)', marginBottom: 48, maxWidth: 720 }}>
          90 residences across <em style={{ color: 'var(--accent-gold)' }}>a sanctuary built for retirement, not return.</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 24 }}>
          {FACILITIES.map((f, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,.08)' }}>
              <div style={{ aspectRatio: '4/3', background: `linear-gradient(135deg, var(--brand-blue-deep), var(--brand-blue))`, backgroundImage: `url(${f.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: 20 }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.4rem', color: 'var(--text-heading)', margin: '0 0 8px' }}>{f.t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(25,29,35,.7)', margin: 0 }}>{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Note: if the `/assets-2025/images/estate/*.jpg` files don't exist, the gradient fallback shows. The chapel render will be added later (XLSX noted Diocesan brief required).

- [ ] **Step 10.2: Create `Governance.tsx`** with 9 board cards

Create `src/app/invest/sections/Governance.tsx`:
```typescript
const BOARD = [
  { name: 'Mar Jose Pulickal', role: 'Patron · Bishop of Pala', img: '/assets-2025/images/board/bishop.jpg', isPatron: true },
  { name: 'Rajeev Abraham', role: 'Chairman & Global Coordinator', img: '/assets-2025/images/board/rajeev-abraham.jpg' },
  { name: 'Thomas Abraham', role: 'Managing Director', img: '/assets-2025/images/board/thomas-abraham.jpg' },
  { name: 'Paul Jose', role: 'Director, Projects', img: '/assets-2025/images/board/paul-jose.jpg' },
  { name: 'Fr Mathew Puthumana', role: 'Global Director', img: '/assets-2025/images/board/fr-puthumana.jpg' },
  { name: 'Fr Kollamkunnel', role: 'Director, Diocesan Liaison', img: '/assets-2025/images/board/fr-kollamkunnel.jpg' },
  { name: 'Jobin George', role: 'Director', img: '/assets-2025/images/board/jobin-george.jpg' },
  { name: 'Charles C. Jose', role: 'Director', img: '/assets-2025/images/board/charles-jose.jpg' },
  { name: 'Binoj Kurian', role: 'Director', img: '/assets-2025/images/board/binoj-kurian.jpg' },
];

export function Governance() {
  return (
    <section id="governance" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)', background: 'var(--bg-beige)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 20, textAlign: 'center' }}>Governance</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.2rem,4.5vw,3.2rem)', fontWeight: 400, color: 'var(--text-heading)', marginBottom: 48, textAlign: 'center' }}>
          Under the <em style={{ color: 'var(--accent-gold)' }}>patronage of the Diocese of Pala.</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 20 }}>
          {BOARD.map((b, i) => (
            <div key={i} style={{ textAlign: 'center', padding: b.isPatron ? '24px 16px' : '16px', background: b.isPatron ? '#fff' : 'transparent', borderRadius: b.isPatron ? 16 : 0, border: b.isPatron ? '2px solid var(--accent-gold)' : 'none' }}>
              <div style={{ width: 96, height: 96, margin: '0 auto 12px', borderRadius: '50%', background: `linear-gradient(135deg, var(--brand-blue-deep), var(--brand-blue))`, backgroundImage: `url(${b.img})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '3px solid var(--accent-gold)' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 4 }}>{b.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(25,29,35,.6)', lineHeight: 1.4 }}>{b.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 10.3: Create `SpiritualFoundation.tsx`** — Polynesian Blue scripture band

Create `src/app/invest/sections/SpiritualFoundation.tsx`:
```typescript
export function SpiritualFoundation() {
  return (
    <section id="foundation" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)', background: 'linear-gradient(135deg, var(--brand-blue-deep) 0%, var(--brand-blue) 100%)', color: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-gold-light, #D4B77A)', marginBottom: 20 }}>Foundation</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, marginBottom: 64, maxWidth: 800, marginInline: 'auto' }}>
          Built on the promise of <em style={{ color: 'var(--accent-gold-light)' }}>protection.</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 40, textAlign: 'left' }}>
          <div style={{ borderTop: '2px solid var(--accent-gold-light)', paddingTop: 24 }}>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic', fontSize: '1.4rem', lineHeight: 1.5, color: '#fff', margin: '0 0 16px' }}>
              "He will cover you with His feathers, and under His wings you will find refuge."
            </p>
            <div style={{ fontSize: 13, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--accent-gold-light)' }}>— Psalm 91:4</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.78)', marginTop: 16 }}>The wings in our mark are not decoration. They are the verse made visible — the promise that those who walk our covenant will not walk alone.</p>
          </div>
          <div style={{ borderTop: '2px solid var(--accent-gold-light)', paddingTop: 24 }}>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic', fontSize: '1.4rem', lineHeight: 1.5, color: '#fff', margin: '0 0 16px' }}>
              "Those who trust in the Lord shall renew their strength."
            </p>
            <div style={{ fontSize: 13, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--accent-gold-light)' }}>— Isaiah 40:31</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.78)', marginTop: 16 }}>Mater Maria is for those who have walked life's journey with faith and strength. The land remembers; the wings remain.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 10.4: Wire the 3 sections**

Edit `src/app/invest/page.tsx` — add to imports and JSX in order:
```typescript
import { Estate } from './sections/Estate';
import { Governance } from './sections/Governance';
import { SpiritualFoundation } from './sections/SpiritualFoundation';

// In JSX, append after <RoiCalculator />:
<Estate />
<Governance />
<SpiritualFoundation />
```

- [ ] **Step 10.5: Build + visual check**

Run: `npm run build && npm run dev` (background)
Open: `open http://localhost:3000/invest`
Expected: Page now shows 7 sections in order. The Polynesian Blue spiritual band at the bottom is the strongest visual moment — verify the gradient renders correctly and the gold quote borders contrast cleanly against the blue.

- [ ] **Step 10.6: Stop dev, commit**

```bash
git add src/app/invest/page.tsx src/app/invest/sections/Estate.tsx src/app/invest/sections/Governance.tsx src/app/invest/sections/SpiritualFoundation.tsx
git commit -m "feat(mater-maria): /invest sections 5-7 — Estate, Governance, Spiritual Foundation"
```

---

## Task 11: Sections 8–11 (FAQ, Brochure CTA, Final Form, Footer)

**Files:**
- Create: `src/app/invest/sections/Faq.tsx`
- Create: `src/app/invest/sections/BrochureCta.tsx`
- Create: `src/app/invest/sections/FinalLeadForm.tsx`
- Create: `src/app/invest/sections/Footer.tsx`
- Modify: `src/app/invest/page.tsx`

- [ ] **Step 11.1: Create `Faq.tsx`** — 8 collapsibles via `<details>`/`<summary>` (no JS framework)

Create `src/app/invest/sections/Faq.tsx`:
```typescript
const FAQS = [
  {
    q: 'When does the deposit convert to share capital?',
    a: 'At the end of year 5. Until then, you receive 10% annual interest on the deposit portion. From year 6, you receive dividends instead.',
  },
  {
    q: 'Can I redeem my share capital before year 15?',
    a: 'Share capital is liquid after year 5. We facilitate buyback through the board at fair market value within 90 days of formal request.',
  },
  {
    q: 'How are NRI investors taxed?',
    a: 'NRI returns are paid via NRO account in INR. Interest is taxed at 30% TDS; dividends are taxed at 20% TDS. Final liability depends on your country of residence and any tax treaty (most major jurisdictions credit Indian TDS).',
  },
  {
    q: 'What is the residency option?',
    a: 'Gold and Platinum tier investors hold a covenant that converts to residency rights for one named beneficiary at any point after year 5, with right of refusal across the 90-residence estate.',
  },
  {
    q: 'Who supervises governance?',
    a: 'The Diocese of Pala holds patronage with formal sign-off rights on chapel design, master plan, and any material covenant change. Day-to-day governance is the Board of Directors. Our quarterly board minutes are available on request to investors.',
  },
  {
    q: 'What happens if the development is delayed?',
    a: 'Interest accrual begins at deposit receipt, not at occupancy. Construction delays do not affect your year-1 yield.',
  },
  {
    q: 'Is the land already acquired?',
    a: 'Yes. The 28-acre parcel in Elangulam, Kanjirappally is fully acquired and registered to Mater Maria Wellness Homes Pvt. Ltd., with clear title and zoning permissions.',
  },
  {
    q: 'How do I exit early if my circumstances change?',
    a: 'Years 1–4: 100% deposit refund minus interest received. Year 5+: share buyback at fair market value within 90 days.',
  },
];

export function Faq() {
  return (
    <section id="faq" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)', background: 'var(--bg-body)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 20, textAlign: 'center' }}>Questions</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.2rem,4.5vw,3.2rem)', fontWeight: 400, color: 'var(--text-heading)', marginBottom: 48, textAlign: 'center' }}>
          Eight things <em style={{ color: 'var(--accent-gold)' }}>investors ask first.</em>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid rgba(0,0,0,.08)' }}>
          {FAQS.map((f, i) => (
            <details key={i} style={{ borderBottom: '1px solid rgba(0,0,0,.08)', padding: '20px 0', cursor: 'pointer' }}>
              <summary style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-heading)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                {f.q}
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'ui-monospace, monospace' }}>+</span>
              </summary>
              <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: 'rgba(25,29,35,.72)' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 11.2: Create `BrochureCta.tsx`** — micro-form (2 fields)

Create `src/app/invest/sections/BrochureCta.tsx`:
```typescript
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeadPayloadSchema, type LeadPayload } from '@/lib/lead-schema';

export function BrochureCta() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadPayload>({
    resolver: zodResolver(LeadPayloadSchema),
    defaultValues: { name: 'Brochure Request', tier: 'undecided', source: 'brochure-micro' },
  });

  const onSubmit = async (data: LeadPayload) => {
    setStatus('submitting');
    const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, source: 'brochure-micro' }) });
    setStatus(res.ok ? 'ok' : 'error');
    if (res.ok) reset();
  };

  return (
    <section id="brochure" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)', background: 'var(--bg-beige)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 20 }}>The deck</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 400, color: 'var(--text-heading)', marginBottom: 16 }}>
          Get the complete <em style={{ color: 'var(--accent-gold)' }}>investor deck</em>
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(25,29,35,.7)', marginBottom: 32, lineHeight: 1.6 }}>
          22 pages · full financial model · tier comparison · governance · estate plans
        </p>
        {status === 'ok' ? (
          <div style={{ padding: 24, background: '#fff', borderRadius: 12, border: '1px solid var(--accent-gold)' }}>
            ✓ Sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, maxWidth: 600, margin: '0 auto' }}>
            <input {...register('email')} type="email" placeholder="Email" style={inputStyle} aria-label="Email" />
            <input {...register('phone')} placeholder="+91 98765 43210" style={inputStyle} aria-label="WhatsApp number" />
            <button disabled={status === 'submitting'} style={{ background: 'var(--accent-gold)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: '.05em', textTransform: 'uppercase' }}>
              {status === 'submitting' ? '…' : 'Send'}
            </button>
            {(errors.email || errors.phone) && <div style={{ gridColumn: '1/-1', fontSize: 13, color: '#c63', textAlign: 'left' }}>{errors.email?.message || errors.phone?.message}</div>}
            {status === 'error' && <div style={{ gridColumn: '1/-1', fontSize: 13, color: '#c63', textAlign: 'left' }}>Delivery delayed — WhatsApp +91 94470 80356.</div>}
          </form>
        )}
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = { background: '#fff', border: '1px solid rgba(0,0,0,.12)', borderRadius: 8, padding: '12px 14px', fontSize: 15, color: '#191D23', outline: 'none' };
```

- [ ] **Step 11.3: Create `FinalLeadForm.tsx`** — full 6-field form

Create `src/app/invest/sections/FinalLeadForm.tsx`:
```typescript
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeadPayloadSchema, type LeadPayload } from '@/lib/lead-schema';

export function FinalLeadForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadPayload>({
    resolver: zodResolver(LeadPayloadSchema),
    defaultValues: { tier: 'undecided', source: 'final-full' },
  });

  const onSubmit = async (data: LeadPayload) => {
    setStatus('submitting');
    const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, source: 'final-full' }) });
    setStatus(res.ok ? 'ok' : 'error');
    if (res.ok) reset();
  };

  return (
    <section id="contact" style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,60px)', background: 'var(--bg-body)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 20, textAlign: 'center' }}>Talk to us</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 400, color: 'var(--text-heading)', marginBottom: 16, textAlign: 'center' }}>
          Begin the <em style={{ color: 'var(--accent-gold)' }}>conversation.</em>
        </h2>
        <p style={{ textAlign: 'center', fontSize: 16, color: 'rgba(25,29,35,.7)', marginBottom: 40 }}>
          Praveen Thampi, our BDM, will reach you within 2 hours during 9am–6pm IST.
        </p>
        {status === 'ok' ? (
          <div style={{ padding: 32, background: 'var(--bg-beige)', borderRadius: 16, border: '1px solid var(--accent-gold)', textAlign: 'center' }}>
            ✓ Thank you. The investor deck is on its way to your inbox, and Praveen will WhatsApp you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
              <input {...register('name')} placeholder="Full name" style={inputStyle} aria-label="Full name" />
              <input {...register('email')} type="email" placeholder="Email" style={inputStyle} aria-label="Email" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
              <input {...register('phone')} placeholder="+91 98765 43210" style={inputStyle} aria-label="WhatsApp number with country code" />
              <select {...register('tier')} id="final-form-tier" style={inputStyle} aria-label="Tier of interest">
                <option value="undecided">Tier — undecided</option>
                <option value="silver">Silver (₹10L)</option>
                <option value="gold">Gold (₹20L) — Best Value</option>
                <option value="platinum">Platinum (₹30L) — Premium</option>
              </select>
            </div>
            <textarea {...register('message')} placeholder="Anything we should know before we call? (Optional)" rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }} aria-label="Message" />
            {(errors.name || errors.email || errors.phone) && <div style={{ fontSize: 13, color: '#c63' }}>{errors.name?.message || errors.email?.message || errors.phone?.message}</div>}
            {status === 'error' && <div style={{ fontSize: 13, color: '#c63' }}>Delivery delayed — WhatsApp +91 94470 80356 directly. We have your details.</div>}
            <button disabled={status === 'submitting'} style={{ background: 'var(--accent-gold)', color: '#fff', border: 'none', borderRadius: 8, padding: '16px 32px', fontSize: 15, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {status === 'submitting' ? 'Sending…' : 'Begin the conversation →'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = { background: '#fff', border: '1px solid rgba(0,0,0,.12)', borderRadius: 8, padding: '14px 16px', fontSize: 15, color: '#191D23', outline: 'none', width: '100%' };
```

- [ ] **Step 11.4: Create `Footer.tsx`**

Create `src/app/invest/sections/Footer.tsx`:
```typescript
export function Footer() {
  return (
    <footer style={{ padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,60px) 32px', background: '#191D23', color: 'rgba(255,255,255,.65)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, color: '#fff', marginBottom: 8 }}>Mater Maria Wellness Homes Pvt. Ltd.</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              CIN: U43299KL2025PC09000<br />
              P.B. No: 22, Kanjirapally<br />
              Kottayam, Kerala 686507<br />
              India
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--accent-gold-light)', marginBottom: 12 }}>Contact</div>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <a href="tel:+919447080356" style={{ color: '#fff', textDecoration: 'none' }}>+91 94470 80356</a><br />
              <a href="mailto:info@matermariahomes.com" style={{ color: 'var(--accent-gold-light)', textDecoration: 'none' }}>info@matermariahomes.com</a><br />
              <a href="https://wa.me/919447080356" target="_blank" rel="noopener" style={{ color: '#fff', textDecoration: 'none' }}>💬 WhatsApp</a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--accent-gold-light)', marginBottom: 12 }}>Quick links</div>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <a href="#tiers" style={{ color: 'rgba(255,255,255,.75)', textDecoration: 'none', display: 'block' }}>The 3 tiers</a>
              <a href="#roi" style={{ color: 'rgba(255,255,255,.75)', textDecoration: 'none', display: 'block' }}>ROI calculator</a>
              <a href="#faq" style={{ color: 'rgba(255,255,255,.75)', textDecoration: 'none', display: 'block' }}>FAQ</a>
              <a href="/index-landing.html" style={{ color: 'rgba(255,255,255,.75)', textDecoration: 'none', display: 'block' }}>Home page</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 24, fontSize: 12, textAlign: 'center', color: 'rgba(255,255,255,.5)' }}>
          © 2026 Mater Maria Homes · Living Refined · "Under His wings you will find refuge."
        </div>
      </div>
    </footer>
  );
}
```

NOTE on CIN: Footer currently shows `U43299KL2025PC09000`. **Verify with Praveen before launch** — see spec §10b. Update with the correct full CIN once confirmed.

- [ ] **Step 11.5: Wire all 4 sections**

Edit `src/app/invest/page.tsx`:
```typescript
import { Faq } from './sections/Faq';
import { BrochureCta } from './sections/BrochureCta';
import { FinalLeadForm } from './sections/FinalLeadForm';
import { Footer } from './sections/Footer';

// In JSX, append after <SpiritualFoundation />:
<Faq />
<BrochureCta />
<FinalLeadForm />
<Footer />
```

- [ ] **Step 11.6: Build + full-page check**

Run: `npm run build && npm run dev` (background)
Open: `open http://localhost:3000/invest`
Expected: All 11 sections render top-to-bottom. FAQ items expand on click. Forms render. Footer shows legal entity name and links.

Run an end-to-end interaction test:
1. Scroll to Tiers section, click "Choose Gold" — should scroll to `#contact` and the final-form tier select should show "Gold".
2. Fill the final form with valid data, submit — expect 502 error fallback (env unset locally).
3. Open browser DevTools network tab, verify the POST to `/api/lead` includes `source: "final-full"`.

- [ ] **Step 11.7: Stop dev, commit**

```bash
git add src/app/invest/page.tsx src/app/invest/sections/Faq.tsx src/app/invest/sections/BrochureCta.tsx src/app/invest/sections/FinalLeadForm.tsx src/app/invest/sections/Footer.tsx
git commit -m "feat(mater-maria): /invest sections 8-11 — FAQ, brochure CTA, final form, footer"
```

---

## Task 12: Add the brochure PDF + deploy

**Files:**
- Add: `public/brochures/mater-maria-investor-deck.pdf`

- [ ] **Step 12.1: Stage the brochure**

The interim PDF lives at `~/Downloads/mater-maria-fixed/Mater_Maria_Homes_Living_Refined_v2_2026-05-09.pdf` (18 MB, verified clean for canonical numbers). Per spec §10b "Known unknowns," this may be replaced with a dedicated investor-deck variant; if so, swap before launch.

```bash
mkdir -p public/brochures
cp ~/Downloads/mater-maria-fixed/Mater_Maria_Homes_Living_Refined_v2_2026-05-09.pdf public/brochures/mater-maria-investor-deck.pdf
```

- [ ] **Step 12.2: Build with brochure included**

Run: `npm run build`
Expected: Build succeeds. The brochure is a static asset under `public/` so it ships as-is.

- [ ] **Step 12.3: Deploy preview**

Run: `vercel deploy 2>&1 | tail -10`
Note the preview URL (e.g. `mater-maria-xxx.vercel.app`).

- [ ] **Step 12.4: Verify brochure URL responds**

Run: `curl -sI <preview-url>/brochures/mater-maria-investor-deck.pdf | head -3`
Expected: `HTTP/2 200`, `content-type: application/pdf`, `content-length: ~18000000`.

- [ ] **Step 12.5: Visual check on the deployed `/invest`**

Open: `open <preview-url>/invest`
Run a tap-through:
1. Hero looks right (Polynesian Blue gradient)
2. Trust pills, scripture quote present
3. Tiers section renders 3 cards, Gold has badge + gold button
4. ROI calc moves smoothly
5. Estate cards render (with gradient fallback for any missing image)
6. Governance 9 cards, Bishop highlighted
7. Spiritual Foundation: blue band, gold-bordered quotes
8. FAQ accordion works
9. Brochure micro-form 2 fields
10. Final form 6 fields
11. Footer with legal entity name

- [ ] **Step 12.6: Commit + promote to production**

```bash
git add public/brochures/mater-maria-investor-deck.pdf
git commit -m "feat(mater-maria): add interim investor deck PDF for /invest brochure delivery"
vercel deploy --prod 2>&1 | tail -5
```
Expected: Production deploy succeeds. `mater-maria.vercel.app/invest` now serves the new page.

---

## Task 13: Configure secrets + Resend domain + E2E

**Files:** none (Vercel env vars + Resend dashboard)

**This task is gated on Meta Business verification** (separate workstream, ~2-day clock). Tasks 1–12 are runnable without Meta verification — the only thing that won't work is the actual WhatsApp send. Email + form submission work as soon as Resend is configured.

- [ ] **Step 13.1: Create a Resend account at resend.com**

Sign up with `admin@taurusai.io`. Free tier is sufficient.

- [ ] **Step 13.2: Add `matermariahomes.com` as a sending domain**

In Resend → Domains → Add. Choose region (closest = `ap-southeast` from Kerala).
Resend will display TXT records: SPF, DKIM, MX (optional). Note these.

- [ ] **Step 13.3: Add DKIM records to Google Cloud DNS**

In Google Cloud Console → Cloud DNS → `matermariahomes.com` zone:
- Add the `resend._domainkey` TXT record from Resend (verbatim, including the trailing dot).
- Verify the existing SPF `v=spf1 include:_spf.google.com include:sendgrid.net ~all` — if Resend says to add `include:_spf.resend.com`, **merge** it (don't replace). The final record should be: `v=spf1 include:_spf.google.com include:sendgrid.net include:_spf.resend.com ~all`.
- Click Verify in Resend.

Expected: Resend marks the domain verified within 10 minutes.

- [ ] **Step 13.4: Generate Resend API key**

Resend → API Keys → Create. Scope: `Sending access`. Copy the `re_xxx` key.

- [ ] **Step 13.5: Set Vercel env vars**

Run:
```bash
vercel env add RESEND_API_KEY production
# Paste the re_xxx key when prompted
vercel env add RESEND_API_KEY preview
# Same value
```

(WA env vars added later in Task 14 once Meta verification completes.)

- [ ] **Step 13.6: Redeploy to pick up env**

Run: `vercel deploy --prod 2>&1 | tail -3`

- [ ] **Step 13.7: E2E test — submit real lead, expect real email**

Open: `<prod-url>/invest`
Fill the final form:
- Name: Test User
- Email: **Your own email address** (you receive it)
- Phone: +919876543210 (still won't trigger WhatsApp until Task 14)
- Tier: Gold
- Message: "Test from Task 13.7"

Submit.

Expected: Within 30 seconds you receive an email from `Mater Maria Homes <noreply@matermariahomes.com>` with subject "Welcome to Mater Maria, Test" and the brochure attached. The page shows the success state. Praveen receives a BCC.

- [ ] **Step 13.8: Check delivery logs**

Resend → Logs. Verify the send is logged with status `delivered`.
Run: `vercel logs <prod-url> 2>&1 | head -50` — verify the Edge Function logged the redacted lead payload.

- [ ] **Step 13.9: Commit a note in CHANGELOG / project memory**

(Optional) Add a memory note recording the Resend domain verification + DKIM record details for future debugging.

---

## Task 14: Meta WhatsApp wiring (after Meta verification)

**Files:** none (Meta dashboard + Vercel env)

**Prerequisite:** Meta Business verification approved (separate workstream, see project task #25). This task assumes you have a verified WhatsApp Business Account with phone number `+91 94470 80356` provisioned.

- [ ] **Step 14.1: Find your WhatsApp Phone ID**

Meta Business → WhatsApp Manager → Phone Numbers. Click on `+91 94470 80356`. Copy the Phone ID (a numeric string).

- [ ] **Step 14.2: Generate a permanent access token**

Meta Business → System Users → Add → "MaterMaria-WA-System" → Assign asset (WhatsApp Business Account) with full control. Generate a token, scope `whatsapp_business_messaging`. **No expiry**. Copy the `EAAxxx...` token.

- [ ] **Step 14.3: Create the `investor_welcome` template**

WhatsApp Manager → Message Templates → New.
- Name: `investor_welcome`
- Category: **MARKETING**
- Language: English
- Body:
```
Hello {{1}}!

Welcome to Mater Maria Homes. We've sent the full investor deck to your email — including the {{2}} tier details you asked about.

Praveen Thampi (our BDM) will personally call you within 2 hours during 9am–6pm IST.

Quick links:
- Brochure: matermariahomes.com/brochures/mater-maria-investor-deck.pdf
- Tier comparison: matermariahomes.com/invest#tiers
- Estate tour: matermariahomes.com/invest#estate

Reply here anytime. Talk soon!
- Mater Maria Homes
```
Submit for approval. Expected: 1–24 hours.

- [ ] **Step 14.4: Configure the webhook URL**

WhatsApp Manager → Configuration → Webhooks → Edit.
- Callback URL: `https://matermariahomes.com/api/whatsapp` (or `mater-maria.vercel.app/api/whatsapp` until DNS flips)
- Verify Token: a long random string (e.g., generate with `openssl rand -hex 32`)
- Subscribe to: `messages` field

- [ ] **Step 14.5: Set Vercel env vars**

```bash
vercel env add WA_TOKEN production            # paste EAAxxx token
vercel env add WA_TOKEN preview
vercel env add WA_PHONE_ID production         # paste Phone ID numeric
vercel env add WA_PHONE_ID preview
vercel env add WA_WEBHOOK_VERIFY_TOKEN production  # paste verify token
vercel env add WA_WEBHOOK_VERIFY_TOKEN preview
```

- [ ] **Step 14.6: Redeploy and test webhook handshake**

Run: `vercel deploy --prod 2>&1 | tail -3`
In Meta Manager → Webhooks → click "Verify and save".
Expected: Verification succeeds (Meta GETs our endpoint with the challenge token; we echo it).

- [ ] **Step 14.7: E2E test — submit real lead, expect WhatsApp message**

Open: `<prod-url>/invest`. Fill the hero mini-form:
- Name: Test User
- Email: **Your own email**
- Phone: **Your own WhatsApp number, in E.164** (e.g. `+919876543210`)
- Tier: Platinum

Submit. Expected:
1. Email arrives within 30 seconds (as in Task 13).
2. WhatsApp message from `+91 94470 80356` arrives on your phone within 30 seconds: "Hello [FirstName]! Welcome to Mater Maria Homes…"

- [ ] **Step 14.8: Verify Meta logs**

WhatsApp Manager → Logs → Messages. Verify the send is logged.

---

## Task 15: Final QA, accessibility, and Lighthouse

**Files:** any tweaks needed

- [ ] **Step 15.1: Lighthouse audit**

In Chrome DevTools → Lighthouse → Mobile + Desktop runs.
Targets per spec §11:
- Performance ≥ 85
- Accessibility ≥ 90
- Best Practices ≥ 90
- SEO ≥ 90

Fix any high-severity issues (likely candidates: missing alt text on placeholder images, large CLS from web-font swap).

- [ ] **Step 15.2: Mobile (375px) visual check**

Use Chrome DevTools device emulation → iPhone SE. Walk through all 11 sections. Confirm:
- Hero form stacks vertically on mobile (2-col → 1-col grids)
- Tier cards stack
- ROI calculator chart still readable
- Footer columns stack
- All buttons remain tappable (min 44x44 px)

- [ ] **Step 15.3: Tablet (768px) visual check**

Same drill. Confirm 2-col layouts where appropriate.

- [ ] **Step 15.4: Desktop (1440px) visual check**

Confirm max-width containers don't stretch absurdly wide. Tier cards stay readable.

- [ ] **Step 15.5: Final commit**

```bash
git add -A
git commit -m "feat(mater-maria): /invest page launch-ready — QA pass complete"
```

---

## Done

When all 15 tasks complete:
- `/invest` page is live on `mater-maria.vercel.app/invest` (and `matermariahomes.com/invest` after DNS flip)
- Form submissions trigger email + WhatsApp within 30 seconds
- Lead data is logged in Vercel logs + Resend logs + Meta WhatsApp logs (3 systems of record)
- Page passes mobile/tablet/desktop QA + Lighthouse targets

**Next-phase tasks (out of scope for this plan, captured here for the backlog):**
- Google Sheet CRM logging (when Praveen requests)
- Razorpay / Stripe / Hyperswitch for tier deposit checkout
- A/B test hero copy variants
- Multi-language (Hindi, Malayalam)
- Replace brochure PDF with dedicated investor-grade deck (vs. the marketing deck currently shipped)
- Replace `/invest/admin` (the current Next.js admin route on the project) or rebuild it for this new page's leads
