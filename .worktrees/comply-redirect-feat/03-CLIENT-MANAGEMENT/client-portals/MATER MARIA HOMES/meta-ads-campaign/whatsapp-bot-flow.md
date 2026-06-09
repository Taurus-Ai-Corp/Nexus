# Mater Maria — WhatsApp Bot Flow & DPDP Consent Specification

> **Owner:** Engineering + Counsel (co-owned)
> **Status:** **BLOCKS BOT LAUNCH ONLY.** Paid Meta ad campaigns may run without the bot — leads can land in Firebase / Supabase and be worked manually while this spec ships. The bot stays dark until every acceptance criterion below is checked.
> **Bot line:** `+91 94470 80356` (Rajeev Abraham, WhatsApp Business API)
> **Related files:** `policy-compliance.md` (Sections 3 + 4 — authoritative source for all verbatim copy below), `engineering-ticket-CAPI.md` (owns webhook signature verification + CAPI event firing), `audience-targeting.md` and `creative-variants.md` (lead-form upstream).

## Division of Responsibilities (READ FIRST)

This spec and `engineering-ticket-CAPI.md` are paired. Do not duplicate.

**`engineering-ticket-CAPI.md` owns:** webhook signature verification (HMAC-SHA256, `x-hub-signature-256`, `crypto.timingSafeEqual`), inbound envelope parsing (`entry[].changes[].value.messages[]`), firing `WhatsAppClick` / `WhatsAppReply` CAPI events into Meta.

**This file owns:** lead-form consent UI (§1), Meta template content + approval (§2), STOP-keyword handler + suppression (§3), 24-hour CS window state machine (§4), US-number block (§5), DPDP withdraw-consent fan-out (§6), cross-border transfer compliance (§7).

The CAPI ticket implements the *plumbing*; this ticket implements the *consent + content + suppression law layer* that wraps it.

---

## Background

A submitted `/invest` lead should get an automated WhatsApp acknowledgement on `+91 94470 80356` within seconds, with human follow-up inside 24 hours. Two regimes gate this: **WhatsApp Business Messaging Policy 2026** (explicit opt-in, bot-disclosure, template approvals, STOP honor, 24h CS window, US-number block) and **DPDP Act 2023** (Rules notified 2025-11-13, Phase 2 binding 2026-11-13 — free/specific/informed/unambiguous consent, withdrawal as easy as consent, DPO contact, cross-border transfer disclosure). A single complaint to Meta or the Data Protection Board takes the number down inside 48 hours and brands the FB Page as a policy violator, dragging quality score across the campaign.

---

## Acceptance Criteria

- [ ] Consent checkbox renders above the submit button, **unchecked by default**, verbatim text from policy L98–100.
- [ ] Submit button disabled until checkbox checked and a valid E.164 phone entered.
- [ ] Checkbox state stamped on lead record (`whatsapp_consent_at`, `whatsapp_consent_text_hash`, `whatsapp_consent_ip_hash`).
- [ ] Three Meta templates approved: Welcome (Marketing), ROI follow-up (Marketing), Booking nudge (Utility) — English + Malayalam each.
- [ ] First outbound uses the approved Welcome template with verbatim text from policy L105.
- [ ] STOP handler trips on all 5 phrases (`STOP`, `UNSUBSCRIBE`, `OPT OUT`, `STOP MESSAGES`, `MAITRI VENDA`), case-insensitive substring match.
- [ ] On STOP: outbound halted, suppression row written, confirmation Utility template sent, hashed phone uploaded to Meta Custom Audience exclusion — all four complete.
- [ ] 24h CS window state machine refreshes on every inbound; outbound outside window is template-only.
- [ ] `+1` recipients skip outbound and route to Slack + email manual sales escalation.
- [ ] `/privacy/withdraw-consent` page live with single-click button; fan-out hits all 5 destinations within 24h SLA.
- [ ] DPO mailbox `dpo@matermariahomes.com` provisioned and monitored.
- [ ] Firebase region `asia-south1`, Supabase `ap-south-1`, transfer basis disclosed in `/privacy`.
- [ ] All env vars provisioned in Vercel, sensitive ones flagged Sensitive.
- [ ] All schema changes applied to Firestore and Supabase.
- [ ] Privacy notice live in English (`/privacy`) and Malayalam (`/privacy/ml`).

---

## Section 1 — Lead-form Consent UI

Lives in `src/components/invest/LeadCapture.tsx` (modify, do not replace).

### 1.1 Verbatim consent text (policy L98–100)

A native HTML `<input type="checkbox">` (not a custom toggle, not pre-checked) sits **above** the submit button. Label text is exact:

> ☐ Yes, I consent to receive follow-up messages on WhatsApp from Mater Maria Sanctuary at the number I have provided. I understand the first response may come from an automated assistant and that I can reply STOP to opt out at any time.

### 1.2 Component changes

Add local state `const [whatsappConsent, setWhatsappConsent] = useState(false)`. Submit handler short-circuits with a toast if `!whatsappConsent` — never call the API without consent. Submit button: `disabled={!whatsappConsent || !isValidE164(phone)}`. Stamp the lead record with `whatsapp_consent: true`, `whatsapp_consent_at`, `whatsapp_consent_text_hash: sha256(VERBATIM_CONSENT_TEXT)` (audit trail of which copy version was agreed to), `whatsapp_consent_ip_hash` (DPDP-grade evidence of free, informed consent).

### 1.3 Companion DPDP notice (same form)

Below the checkbox, an expandable "What data we collect" disclosure lists: categories (name, phone, email, country, indicative tier interest), purposes (lead qualification, WhatsApp follow-up, financial-due-diligence call), data fiduciary (Mater Maria legal entity — confirm with Counsel), grievance contact `dpo@matermariahomes.com`, link to `/privacy/withdraw-consent`. A second mandatory checkbox confirms the user is **18 or older** (DPDP requires verifiable parental consent for minors; we do not collect minor data).

---

## Section 2 — Bot-disclosure First Message + Meta Template Approvals

### 2.1 Verbatim first-message text (policy L105)

The Welcome template body, sent as the first outbound after consent capture, is exact:

> Hi! This is the Mater Maria automated assistant. A team member will follow up personally within 24 hours. Reply STOP to opt out.

Must be Meta-approved as **Marketing** category before it ships. Outbound-first sends to a freshly-consented user mandate a pre-approved template under the 24-hour CS window rule.

### 2.2 Three templates required

Submit all three through Meta Business Manager → WhatsApp Manager → Message Templates. Approval typically lands in 1–24 hours. If rejected: revise and resubmit; bot launch waits until all three are `APPROVED`.

| # | Name | Category | Languages | Trigger | Body (parameters) |
|---|---|---|---|---|---|
| 1 | `mater_maria_welcome` | Marketing | `en`, `ml` | T+0s on consented lead submit | Verbatim text from §2.1. No parameters. |
| 2 | `mater_maria_roi_followup` | Marketing | `en`, `ml` | T+0s if `roi_calculator_engaged_at` is set | "Hi {{1}}, you modeled returns for the {{2}} tier on our investor calculator. Here's the full 15-year breakdown: {{3}}. Reply STOP to opt out." |
| 3 | `mater_maria_booking_nudge` | Utility | `en`, `ml` | T+24h if `last_user_message_at` is null and not opted out | "Hi {{1}}, would you like to book a 15-minute call about the {{2}} tier? {{3}} Reply STOP to opt out." |

Welcome and ROI follow-up are **Marketing**; Booking nudge is **Utility**. `{{1}}` is Meta's literal placeholder syntax. Malayalam variants reviewed by a native speaker; Counsel approves both. **If rejected:** drop to manual sales outreach for that variant — never substitute unapproved free-form text — then re-submit with revised copy.

### 2.3 Template payload shape (Welcome)

```json
{ "messaging_product": "whatsapp", "to": "<E.164>", "type": "template",
  "template": { "name": "mater_maria_welcome", "language": { "code": "en" } } }
```

POST to `https://graph.facebook.com/v19.0/{WHATSAPP_PHONE_NUMBER_ID}/messages` with `Authorization: Bearer ${WHATSAPP_ACCESS_TOKEN}`. Stamp the response `messages[0].id` on the conversation row as `last_outbound_template_message_id`.

---

## Section 3 — STOP-keyword Handler

### 3.1 Trigger phrases (case-insensitive substring match on inbound `text.body`)

1. `STOP`
2. `UNSUBSCRIBE`
3. `OPT OUT`
4. `STOP MESSAGES`
5. `MAITRI VENDA` — Malayalam approximation (literal: "no more messages"). **VERIFY AT LAUNCH** with native speaker; alternatives include `സന്ദേശങ്ങൾ വേണ്ട`. Counsel confirms final list before deploy.

Match logic: lowercase the inbound body, lowercase each phrase, check `body.includes(phrase)`. Any hit triggers the four actions below.

### 3.2 On detection, fire all four actions atomically

1. **Halt outbound.** Stamp `whatsapp_opt_out_at = now()` on the suppression row first; the outbound dispatcher reads this on every send and short-circuits if non-null.
2. **Persist suppression.** Write to `whatsapp_opt_outs` (Supabase Postgres — recommended over Firestore for queryability). Insert `phone_e164`, `phone_sha256`, `opt_out_at`, `opt_out_source: 'stop_keyword'`, `inbound_message_id`.
3. **Send confirmation.** Dispatch a `mater_maria_optout_confirm` Utility template (submit alongside the three in §2.2, batch the approvals). Body: "You have been unsubscribed from Mater Maria messages. We will not contact you on WhatsApp again. To re-subscribe, please visit matermariahomes.com/invest." Permitted as Utility — Meta treats this as a transactional acknowledgement, not promotional.
4. **Suppress on Meta paid surface.** Hash the phone (SHA-256, lowercase E.164 with no `+` or spaces) and upload to Custom Audience `mater_maria_optout_suppression`. Configure all live ad sets to exclude this audience. DPDP "withdraw consent" is total, not just on WhatsApp.

All four must complete or the operation is logged for retry; never partial-fail silently.

---

## Section 4 — 24-hour Customer-Service Window

### 4.1 The rule

Once the user sends an inbound, the business has **24 hours** from that timestamp to send free-form replies. Outside the window, only Meta-approved Marketing/Utility templates may be sent. The window resets on every new inbound.

### 4.2 Implementation

A `whatsapp_conversations` table in Supabase Postgres tracks per-phone state (see "Required Database Schema Changes" for the full DDL). The webhook handler (in `engineering-ticket-CAPI.md`) calls a new helper `refreshCsWindow(phoneE164, inboundMessageAt)` that upserts `last_user_message_at`. Every outbound dispatch reads the row, computes `now() - last_user_message_at`:

- If `< 24h` and `whatsapp_opt_out_at IS NULL`: free-form is permitted.
- Else: only approved templates from §2.2 may be sent.

The dispatcher is the single chokepoint for outbound; no other code path may post to the WhatsApp Cloud API. The rule is enforceable in one function.

---

## Section 5 — US-number Block (since 2025-04-01)

Meta paused all marketing-template messages to `+1` numbers on 2025-04-01 (policy L107). The outbound dispatcher guards: if `recipient.startsWith('+1')`, skip and call `notifySalesDeskManual({ phone, reason: 'us_number_block', leadId })` — posts to Slack `SLACK_SALES_CHANNEL_ID` **and** emails `sales@matermariahomes.com`. Stamp `outbound_blocked_us_number: true` on the lead.

---

## Section 6 — DPDP Withdraw-consent Wiring (LOAD-BEARING)

DPDP Act 2023 requires withdrawal of consent to be **as easy as giving it**. A buried form in a footer is non-compliant; a labelled button on a dedicated page is.

### 6.1 The page

`matermariahomes.com/privacy/withdraw-consent`. Single-page form. Fields: email **or** phone E.164 (either looks up the lead), optional reason (500-char cap), submit button labelled **"Withdraw my consent and delete my data"**. Server action POSTs to `/api/dpdp/withdraw-consent`. Page renders: "Your withdrawal has been received. We will complete deletion within 24 hours and email confirmation."

### 6.2 Five-system fan-out

Target SLA 24h; DPDP ceiling 30d. Handler writes a `dpdp_withdrawal_request` row immediately, then processes the five steps as a queued job (BullMQ on Upstash Redis or Supabase pg-boss — eng call).

1. **Firebase Firestore.** Soft-delete: stamp `dpdp_withdrawn_at`, mask `name`, `email`, `phone` to `[withdrawn]`. Doc persists for audit; PII does not.
2. **Supabase Postgres.** On `leads`, set `dpdp_withdrawn_at = now()`, mask PII columns to `'[withdrawn]'`. Hashed columns (`phone_sha256`, `email_sha256`) retained for future de-dup.
3. **WhatsApp opt-out table.** Insert into `whatsapp_opt_outs` with `opt_out_source: 'dpdp_withdrawal'`.
4. **Meta CAPI suppression.** Upload `phone_sha256` and `email_sha256` to Custom Audience `mater_maria_optout_suppression` (same audience as §3.2 step 4). **VERIFY AT LAUNCH:** Meta's preferred pattern for HOUSING ads is hashed-user upload to a Custom Audience set as an ad-set exclusion; alternative is a CAPI "Suppression" custom event. Eng confirms exact API call with Meta rep.
5. **Email nurture.** If a downstream email tool is wired (Postmark / Resend / Mailchimp — TBD), call its unsubscribe endpoint. Else no-op and stamp `email_unsubscribe_status: 'no_provider'`.

Handler returns 202 Accepted immediately. Confirmation email lands when all five complete; partial-failure escalates to DPO.

### 6.3 Privacy notice and DPO

`/privacy` lists DPO contact `dpo@matermariahomes.com`. `/privacy/ml` is the Malayalam translation, accessible via a language toggle. The "Withdraw consent" button is linked from `/privacy`, the lead form footer, **and** every WhatsApp template footer where character budget permits.

---

## Section 7 — Cross-border Transfer Compliance

DPDP Section 16 requires disclosure of cross-border transfers. Mater Maria stores leads in Firebase (Google Cloud) and Supabase. Both default to US-region; we move both to India before launch.

- [ ] Firebase Firestore location set to `asia-south1` (Mumbai). Verify in Firebase Console → Project Settings → General → "Default GCP resource location". Set at project creation and cannot be changed for existing DBs — if currently elsewhere, create a new project, migrate, update env vars.
- [ ] Supabase project region confirmed as `ap-south-1` (Mumbai). If elsewhere, create a new project in `ap-south-1`, migrate via `pg_dump` / `pg_restore`, swap connection strings.
- [ ] `/privacy` lists transfer basis and destination countries: "Personal data is stored in Mumbai, India (Google Cloud asia-south1, Supabase ap-south-1). Limited service-provider processing may occur on Meta's infrastructure (United States) for paid-media optimization; this transfer is permitted under the DPDP Rules' notified-countries framework."
- [ ] Vercel hosting region set to `bom1` (Mumbai) or `sin1` (Singapore). Confirm under Project → Settings → Functions → Region.
- [ ] **VERIFY AT LAUNCH:** Whether the Government of India has gazetted its final list of restricted-transfer countries under DPDP Section 16. As of 2026-05 the list is not published; Counsel monitors.

---

## Required Environment Variables

Sensitive vars must be flagged Sensitive in Vercel and never exposed to the client bundle (verify with `npm run build && grep -r "WHATSAPP_ACCESS\|APP_SECRET" .next/static/` — zero matches required).

| Var | Sensitive | Purpose |
|---|---|---|
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | No | WABA identifier for template-management API |
| `WHATSAPP_PHONE_NUMBER_ID` | No | Meta phone-number-id for `+91 94470 80356` |
| `WHATSAPP_ACCESS_TOKEN` | Yes | System-user permanent token; Bearer auth for Cloud API |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Yes | Echoed during Meta GET-handshake |
| `WHATSAPP_APP_SECRET` | Yes | HMAC-SHA256 key for `x-hub-signature-256` (used by CAPI ticket) |
| `DPO_EMAIL` | No | `dpo@matermariahomes.com`; grievance mailbox |
| `SALES_DESK_EMAIL` | No | `sales@matermariahomes.com`; manual fallback recipient |
| `SLACK_SALES_CHANNEL_ID`, `SLACK_BOT_TOKEN` | Token: Yes | US-number block + manual escalation channel |
| `META_CAPI_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` | Token: Yes | Custom Audience suppression upload (re-used from CAPI ticket) |
| `MATER_MARIA_LEGAL_ENTITY` | No | Data-fiduciary identity for privacy notice |

---

## Required Database Schema Changes

### Firebase Firestore — `leads` collection, new fields per doc

`whatsapp_consent: boolean`, `whatsapp_consent_at: Timestamp`, `whatsapp_consent_text_hash: string`, `whatsapp_consent_ip_hash: string`, `dpdp_withdrawn_at: Timestamp | null`, `outbound_blocked_us_number: boolean`, `roi_calculator_engaged_at: Timestamp | null` (written by the ROI calculator component on `/invest`).

### Supabase Postgres

```sql
create table whatsapp_opt_outs (
  phone_e164 text primary key,
  phone_sha256 text not null,
  opt_out_at timestamptz not null default now(),
  opt_out_source text not null check (opt_out_source in ('stop_keyword','dpdp_withdrawal','manual')),
  inbound_message_id text
);

create table whatsapp_conversations (
  phone_e164 text primary key,
  phone_sha256 text not null,
  last_user_message_at timestamptz,
  last_outbound_at timestamptz,
  last_outbound_was_template boolean,
  last_outbound_template_message_id text
);

create table dpdp_withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  email text, phone_e164 text, reason text,
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  firebase_done boolean default false, supabase_done boolean default false,
  whatsapp_done boolean default false, meta_done boolean default false,
  email_unsub_done boolean default false
);

alter table leads
  add column whatsapp_consent boolean default false,
  add column whatsapp_consent_at timestamptz,
  add column whatsapp_consent_text_hash text,
  add column dpdp_withdrawn_at timestamptz,
  add column phone_sha256 text,
  add column email_sha256 text;
```

---

## Required Routes / Handlers

**NEW (this spec):**
- `src/app/privacy/withdraw-consent/page.tsx` — server-rendered withdrawal form.
- `src/app/api/dpdp/withdraw-consent/route.ts` — POST handler; queues 5-system fan-out.
- `src/app/privacy/page.tsx` + `src/app/privacy/ml/page.tsx` — DPDP privacy notice (English + Malayalam).
- `src/lib/whatsapp/dispatcher.ts` — single chokepoint outbound dispatcher; reads `whatsapp_opt_outs` and `whatsapp_conversations` before every send; enforces US-block, 24h window, template-only outside window.
- `src/lib/whatsapp/stop-handler.ts` — invoked from webhook; runs the four §3.2 actions.
- `src/lib/meta/suppression-audience.ts` — uploads hashed phone/email to `mater_maria_optout_suppression` Custom Audience.

**EXISTING (referenced, not modified by this spec):**
- `src/app/api/whatsapp/webhook/route.ts` — owned by `engineering-ticket-CAPI.md`. **This spec adds two callsites** in the inbound message handler: (a) `refreshCsWindow(phoneE164, messageAt)` on every inbound, (b) `stopHandler.check(phoneE164, body, inboundMessageId)` before any downstream processing. Both helpers live in this spec's lib files; the webhook imports them.

---

## Open Questions for Product / Counsel

1. **Final Malayalam STOP keyword.** `MAITRI VENDA` is engineering's best transliteration; native-speaker confirmation needed before deploy. Alternatives: `സന്ദേശങ്ങൾ വേണ്ട`, `നിർത്തുക`. Counsel + native reviewer locks the list.
2. **Mater Maria legal entity name.** Required for the privacy notice's "data fiduciary" disclosure and every creative footer (`creative-variants.md` references the gap). Counsel confirms with the Mater Maria board.
3. **Email nurture provider.** §6.2 step 5 no-ops without one. PM picks Postmark / Resend / Mailchimp or accepts the no-op for v1.
4. **Booking-link source for `{{3}}`.** Calendly / Cal.com / on-site `/book` route — PM picks.
5. **DPDP withdrawal SLA on partial-failure.** Target 24h, ceiling 30d. Bubble Meta-API-down as DPO escalation immediately, or auto-retry silently for 24h then escalate? Counsel + Eng align.
6. **Meta suppression mechanism.** §6.2 step 4 lists Custom Audience exclusion as primary, "Suppression" CAPI event as alternative. Eng confirms the exact pattern with Meta rep — only one needs to ship v1.

---

## Estimated Engineer-Days

| Workstream | Days |
|---|---|
| Lead-form consent UI + lead-record stamping (§1) | 1 |
| Three Meta template submissions + Malayalam translation + approval cycles | 1 eng |
| Outbound dispatcher: US-block + 24h window + opt-out check | 2 |
| STOP handler + suppression + confirmation template + Custom Audience upload (§3) | 1.5 |
| `whatsapp_conversations` schema + webhook callsites (§4) | 0.5 |
| `/privacy/withdraw-consent` page + handler + 5-system fan-out queue (§6) | 2.5 |
| `/privacy` + `/privacy/ml` notices (eng wiring; Counsel content parallel) | 1 |
| Firebase + Supabase + Vercel region migration (§7) | 1 |
| E2E testing, Playwright UI, DPDP withdrawal walkthrough | 1.5 |
| **Total engineering** | **~12 engineer-days** |

Critical path is Meta template approval (1–24h per template, sequential if rejected) and Counsel sign-off on the Malayalam privacy notice — calendar-time gates, not eng effort.
