# Mater Maria — `/invest` Investor Deep-Dive Page — Design Spec

**Date**: 2026-05-11
**Status**: Approved by stakeholder (E. Fdz / taurus.ai@taas-ai.com), pending implementation plan
**Architecture choice**: Option A — All-Vercel serverless (Edge Functions)
**Live target**: `https://matermariahomes.com/invest` (and `https://mater-maria.vercel.app/invest` for staging)

---

## 1. Problem & goals

Page 1 (`index-landing.html`) is a marketing landing page optimized for first-impression and broad-funnel email/WhatsApp capture. Page 2 (`/invest`) is needed because:

- Investors arriving with mid- and high-commercial-intent (clicked through Meta ads, WhatsApp links, referrals) need a single page that fully answers: **tier specifics, returns model, governance, spiritual fit, FAQ, and a no-friction commitment path.**
- The existing landing page has tier cards but no calculator, no FAQ, no granular per-tier perks, no faith narrative, and no committed lead-capture flow.
- The product needs a **lead-conversion engine** — current state is click-to-WhatsApp only; many leads bounce before initiating chat.

**Success criteria**:
1. Time-to-first-WhatsApp-message drops from "visitor must initiate" to "<5 seconds after form submit (system initiates)".
2. Every form submission delivers PDF brochure via email + WhatsApp template message within <60s.
3. Lead capture rate (form submits / unique visitors) targets 8%+ on this page (vs. ~1% industry baseline for landing).
4. Page is fully static + edge-functioned — no DB, no Node server, free-tier throughout (1k leads/mo capacity).

---

## 2. Architecture overview

```
┌────────────────────────────┐      ┌──────────────────────────────┐
│  /invest (static HTML)     │POST  │  /api/lead (Edge Function)   │
│  - 11 sections             │ ───→ │  validate → fan out parallel │
│  - 3 form touch-points     │      │                              │
│  - same brand system as P1 │      │  ├── Resend  (email + PDF)   │
│  - vanilla JS for ROI calc │      │  ├── Meta API (WhatsApp tpl) │
└────────────────────────────┘      │  └── return JSON status      │
                                    └──────────────────────────────┘

┌────────────────────────────┐      ┌──────────────────────────────┐
│  Meta webhook (inbound)    │ ───→ │  /api/whatsapp (Edge)        │
│  visitor replies on WA     │      │  acknowledge + log to console │
└────────────────────────────┘      └──────────────────────────────┘
```

- **Same Vercel project** as the existing landing site. No new infra.
- **Routes** (added to existing `vercel.json`):
  - `/invest` and `/invest/` → `/invest/index.html` (static)
  - `/api/lead` → POST handler (Edge runtime)
  - `/api/whatsapp` → GET (verification) + POST (events) handler (Edge runtime)
- **Brochure**: `/brochures/mater-maria-investor-deck.pdf` — static asset, attached to email + linked in WhatsApp template
- **Secrets**: `RESEND_API_KEY`, `WA_TOKEN`, `WA_PHONE_ID`, `WA_WEBHOOK_VERIFY_TOKEN` (Vercel env vars, prod + preview scopes)

---

## 3. Page sitemap (sections 1–11)

| # | Section | Anchor | Purpose | Form? |
|---|---|---|---|---|
| 1 | ATF Hero | `#hero` | 8-second pitch + Psalm 91:4 + mini-form (name + WhatsApp + tier) | ✅ mini |
| 2 | Why Now | `#why-now` | 90-sec narrative + 3-stat strip + Bishop quote | — |
| 3 | The 3 Tiers | `#tiers` | Silver/Gold/Platinum cards w/ INR + USD/GBP/AUD/NZD + per-tier perks + "Choose tier" CTA (pre-fills final form) | — |
| 4 | ROI Calculator | `#roi` | Interactive: select tier + years → animated bar chart + readout | — |
| 5 | The Estate | `#estate` | 6-card masonry: chapel, medical, dining, villas, yoga, fishing. **No infinity pool. No glass-walls aesthetic.** | — |
| 6 | Governance | `#governance` | 9 board cards from `TEAM.zip` (Bishop centered, others orbit) | — |
| 7 | Spiritual Foundation | `#foundation` | Polynesian Blue band, white serif. Psalm 91:4 + Isaiah 40:31. | — |
| 8 | FAQ | `#faq` | 8 collapsible Q&A | — |
| 9 | Brochure CTA | `#brochure` | Single button + 2-field micro-form (email + phone) → triggers `/api/lead` | ✅ micro |
| 10 | Final Lead Form | `#contact` | Full form (name, email, phone, tier, message, best-time) | ✅ full |
| 11 | Footer | `#footer` | Legal entity, CIN, address, contact, repeated CTAs | — |

**Form touch-point strategy** (3 forms total):
- Hero mini-form: lowest friction (3 fields). Captures top-of-funnel.
- Tier card "Choose this tier" buttons: **not a form**, they scroll to final form with `tier` pre-selected.
- Final form: highest-intent (6 fields). Sales-ready leads.
- Brochure micro-form: pure "I want the deck" intent (2 fields). Email-only capture.

All four entry points POST to the same `/api/lead` Edge Function with a `source` flag for analytics.

---

## 4. Visual & brand system

Honors the brand book where strategically additive, preserves the current gold-on-cream conversion aesthetic.

### Colors
| Token | Hex | Role | Brand-book source |
|---|---|---|---|
| `--bg-body` | `#FFFBF5` | Page background | (current) |
| `--text-primary` | `#333333` | Body text | (current) |
| `--accent-gold` | `#C09B5E` | Primary CTA, accents | (current) |
| `--brand-blue` | `#224C98` | **NEW** — hero gradient anchor, spiritual section bg, tier-button hover | Brand book §Primary Colour System ("Polynesian Blue") |
| `--brand-blue-deep` | `#006394` | **NEW** — hero gradient deep | Brand book §Primary Colour ("Golden Brown" label — values are deep teal-blue) |

### Typography
- `--font-display`: Inter Tight (kept — modern feel; not in brand book but compatible)
- `--font-serif`: Cormorant Garamond (kept — italic accents)
- `--font-helv`: Helvetica Neue (per brand book §Typography — used for section headings, form fields)
- `--font-didot`: Didot (per brand book §Typography — used for logo-style display moments)

### Imagery rules (per Paul Jose's XLSX)
- ✅ Chapel (Diocesan-compliant exterior + interior)
- ✅ Medical (clinical view, 8-bed ICU, doctor portrait)
- ✅ Dining (220-seat hall, kitchen)
- ✅ Villa (fusion of traditional Kerala vernacular + Mediterranean accents)
- ✅ Yoga / Ayurveda hall
- ✅ Fishing pond / orchard
- ❌ Infinity pool
- ❌ Modern glass-wall aesthetic
- ❌ Generic stock imagery

### Spiritual elements
- Psalm 91:4 appears in hero subtitle (small italic, gold)
- Isaiah 40:31 appears in Section 7 (Polynesian Blue band, white serif)
- "Living Refined" tagline in footer
- "MM Wings of Protection" symbol acknowledged in Section 7 caption

---

## 5. The `/api/lead` Edge Function

### Contract
```typescript
POST /api/lead
Content-Type: application/json

{
  "name":    string  (required, 2-80 chars),
  "email":   string  (required, RFC5322),
  "phone":   string  (required, E.164 format, e.g. "+919876543210"),
  "tier":    "silver" | "gold" | "platinum" | "undecided",
  "message": string  (optional, max 500 chars),
  "source":  "hero-mini" | "brochure-micro" | "final-full" | "tier-card-button"
}

→ 200 { ok: true, email: boolean, whatsapp: boolean }
→ 400 { error: string }  (missing/invalid fields)
→ 500 { error: string }  (both channels failed — extremely rare)
```

### Behavior
1. Parse + validate JSON body (E.164 phone, RFC5322 email, required fields).
2. **In parallel** via `Promise.allSettled`:
   - Call Resend API with: `from: noreply@matermariahomes.com`, `to: lead.email`, `bcc: praveenissacs@gmail.com` (Praveen Isaac — confirmed via Gmail signature), `subject: Welcome to Mater Maria, <firstName>`, `html: <emailTemplate(lead)>`, `attachments: [mater-maria-investor-deck.pdf]`
   - Call Meta Graph API with WhatsApp template `investor_welcome` (pre-approved), language `en`, parameters: firstName, tier
3. Return JSON with per-channel success booleans. **Always 200** unless both channels fail — the form must succeed even if delivery has a hiccup. We have the lead's data and can retry server-side.
4. **NO Google Sheet write in this version** (per "Dual-channel: Email + WhatsApp only" decision). To be added later if Praveen requests CRM.

### Validation rules
- Phone must match `^\+[1-9]\d{7,14}$` (E.164)
- Email must match standard regex (good-enough validation; final check happens at Resend)
- Tier must be one of 4 enums; default to `undecided` if missing
- Strip HTML tags from `message` before passing into email template
- All POSTs over HTTPS (Vercel default)

### Failure modes
| Scenario | Behavior |
|---|---|
| Invalid input | 400 with clear field name in error message |
| Resend down | Log to console, return 200 with `email: false` — form shows "Email delivery delayed, you'll receive shortly. WhatsApp message sent now." |
| Meta API down | Log to console, return 200 with `whatsapp: false` — form shows "WhatsApp message will arrive shortly. Email is on its way." |
| Both down | 500 — form shows "Something went wrong — please WhatsApp +91 94470 80356 directly. We have your details." |
| Network timeout (>10s) | Edge function timeout → return 504 → same fallback message |

---

## 6. The `/api/whatsapp` Edge Function (webhook)

Required by Meta for WhatsApp Cloud API integration.

### GET (verification)
On Meta dashboard config, Meta sends `GET /api/whatsapp?hub.mode=subscribe&hub.verify_token=<token>&hub.challenge=<challenge>`. Function returns `<challenge>` as plain text if `verify_token` matches our `WA_WEBHOOK_VERIFY_TOKEN` env. Otherwise 403.

### POST (events)
Meta delivers inbound message events. v1 of this function: log to console, return 200. v2 (future): trigger conversation routing / Praveen notification.

---

## 7. Email template

Plain HTML (no framework). Inline styles for max email-client compatibility.

```
Subject: Welcome to Mater Maria, {firstName}

---
Brand bar — Polynesian Blue with white MM wings logo

Body — cream background, dark text:
  "Dear {firstName},
   Thank you for your interest in Mater Maria Homes — a sanctuary..."

Three-row attachment notice card:
  "Attached: The complete investor deck (22 pages)"
  → bullet list of what's inside

WhatsApp CTA card:
  "Reach us instantly on WhatsApp: +91 94470 80356"

Scripture footer (italic, gold):
  "He will cover you with His feathers..." — Psalm 91:4

Legal footer:
  Mater Maria Wellness Homes Pvt. Ltd.
  CIN: U43299KL2025PC09???
  P.B. No: 22, Kanjirapally, Kottayam, Kerala 686507
```

Variable: `{firstName}` is `lead.name.split(' ')[0]`.

---

## 8. WhatsApp template (pre-approved by Meta)

Template name: `investor_welcome`
Category: **MARKETING** (not utility — we're offering a product)
Language: `en`

```
Hello {{1}}!

Welcome to Mater Maria Homes. We've sent the full investor deck to your
email — including the {{2}} tier details you asked about.

Praveen Thampi (our BDM) will personally call you within 2 hours during
9am–6pm IST.

Quick links:
- Brochure: matermariahomes.com/brochures/investor-deck.pdf
- Tier comparison: matermariahomes.com/invest#tiers
- Estate tour video: matermariahomes.com/invest#estate

Reply here anytime. Talk soon!
- Mater Maria Homes
```

Parameters: `{{1}} = firstName`, `{{2}} = tier name (capitalized)`. If `lead.tier === 'undecided'`, `{{2}}` is substituted with the phrase **"residence programme"** — keeps the sentence grammatical without forcing a tier choice on uncommitted leads.

---

## 9. Critical-path dependencies

| Dep | Owner | Blocker? | Time |
|---|---|---|---|
| Meta Business verification (PAN/CIN/utility bill) | E. Fdz + Praveen | 🔴 YES — gates WhatsApp Cloud API entirely | ~2 days approval |
| WhatsApp phone provisioning to `+91 94470 80356` | Meta (post-verification) | 🔴 YES | ~30 min |
| Pre-approval of `investor_welcome` template | Meta (post-verification) | 🔴 YES | ~24 hours |
| Resend account + DKIM TXT records on Google Cloud DNS | Claude (drafts) + user (pastes) | 🟡 needed before first email | ~30 min |
| Brochure PDF — final version | Praveen sends OR NotebookLM-regenerates | 🟡 needed for email attachment | ~1 hour |
| `/invest` page implementation | Claude | — | ~1 day |
| API routes implementation | Claude | — | ~half day |
| End-to-end test (real Meta send to real number) | Claude + user | — | ~30 min |

**Action**: start Meta Business verification immediately, in parallel with `/invest` page build. Code can be ready and dormant while waiting for approval.

---

## 10. Out of scope (deferred)

- Google Sheet CRM logging (per "Dual-channel only" decision)
- Praveen personal-line ping on his WhatsApp (different number — see governance section)
- Multi-language (English-only v1)
- Razorpay / Stripe checkout for tier deposits (separate epic)
- A/B test variants of the hero copy
- Analytics beyond what Vercel and Meta provide natively

---

## 10b. Known unknowns (resolve before implementation)

- **Full CIN**: Brand-book stationery shows partial OCR of `U43299KL2025PC09???`. Need full CIN (~21 chars total). Ask Praveen or check ROC filing on `mca.gov.in`.
- **Bishop quote** for Section 2 ("Why Now"): need to either commission from Bishop Mar Jose Pulickal or draft + send for review.
- **Final brochure PDF**: We have a regenerated draft at `~/Downloads/mater-maria-fixed/Mater_Maria_Homes_Living_Refined_v2_2026-05-09.pdf` (18 MB, 15 pages). User may want to commission a dedicated investor-deck variant rather than use the marketing deck. Confirm before email-attaching.
- **Chapel render**: per Paul Jose's XLSX, "Diocesan brief" needed before commissioning chapel imagery. Bishop sign-off path required.
- **Resend domain DKIM**: Resend will generate TXT records when account is verified — we paste them into Google Cloud DNS (separate from Vercel A-record flip).

## 11. Definition of done

- [ ] `/invest` page renders correctly on mobile (375px), tablet (768px), desktop (1440px)
- [ ] All 4 form entry points POST to `/api/lead` and receive 200
- [ ] Real lead submission triggers Resend email arriving within 5s with PDF attached
- [ ] Real lead submission triggers Meta WhatsApp template message arriving within 5s
- [ ] Meta webhook verifies successfully and accepts inbound events
- [ ] ROI calculator renders chart and updates on tier+year change
- [ ] Tier card "Choose this tier" buttons pre-select the tier in the final form
- [ ] FAQ accordion expand/collapse works without JS framework
- [ ] Footer shows full legal entity + CIN + address
- [ ] Page passes Lighthouse: Performance ≥85, Accessibility ≥90, Best Practices ≥90, SEO ≥90
- [ ] Spec self-review completed; user has approved the spec
