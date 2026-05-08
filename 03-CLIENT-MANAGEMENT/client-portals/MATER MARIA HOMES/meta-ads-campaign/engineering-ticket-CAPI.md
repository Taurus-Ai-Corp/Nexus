# ENG-MM-001 — Implement Meta Conversions API (CAPI) for Mater Maria Investor Funnel

**Priority:** P0 (campaigns cannot ship without this)
**Estimated effort:** 4 engineer-days (3 dev + 1 QA/staging verification)
**Owner:** TBD — engineering manager to assign (suggest: senior full-stack engineer, Next.js + Node)
**Blocks:**
- Mater Maria diaspora + Kerala paid social launch (Meta Lead/Conversion campaign — IN/US/GB/AU/NZ per v3 geo pivot 2026-05-08; replaces prior GCC scope)
- Mater Maria Special Ad Audience seeding (HOUSING-restricted similar-audience model, requires CAPI events as seed signal)
- All Meta Lead Ads, brochure-download conversion campaigns, and WhatsApp click-to-chat campaigns

---

## Background

Mater Maria's Meta campaign is targeting Kerala homebase + global Malayali diaspora (US/UK/AUS/NZ — v3 geo pivot 2026-05-08), where iOS Safari traffic share is even higher than under the prior GCC scope (US skews ~55% iOS, AUS ~50%, UK ~40%, IN ~25%). Browser-side Meta Pixel events on iOS are heavily degraded by ITP (Intelligent Tracking Prevention) and ETP (Enhanced Tracking Protection): third-party cookies are blocked, `_fbp` first-party cookie is capped at 7 days, and a meaningful share of pixel beacons are silently dropped. The practical impact is that Meta's optimizer sees only a fraction of real conversions, and CPL inflates 30–60% on iOS-skewed audiences while the algorithm trains on the wrong signal — it over-spends on cohorts that happen to be visible (Android) rather than cohorts that actually convert (iOS NRIs with high HNI propensity).

The Mater Maria funnel also has three off-property events that the pixel literally cannot capture: WhatsApp click-to-chat (the click leaves our domain), brochure PDF download (anonymous file fetch on Vercel CDN with no DOM context), and WhatsApp business-account replies (happens on Meta's own infra, not our site). All three are stronger lead-quality signals than form-fills — a prospect who actively requests a brochure or replies on WhatsApp is dramatically more likely to convert to a 5L–30L investor than someone who fills out the lead form and goes silent. Without CAPI we are ad-spending on the weakest signal we have.

The fix is Meta Conversions API: server-side event posting via `https://graph.facebook.com/v19.0/{PIXEL_ID}/events`, deduplicated against the client-side pixel via shared `event_id`. CAPI bypasses ITP/ETP entirely, captures off-property events server-side, and lets us tell Meta which leads were actually high-quality (replied on WhatsApp, downloaded brochure, advanced in chatbot). Conservative model on $5K/month ad spend: untreated CPL ≈ AED 110, with CAPI + lead-quality optimization CPL drops to AED 65–75 within 14 days (Match Quality ≥7.0). That is roughly $1.5K/month of waste recovered on the pilot campaign alone, and the gap widens as spend scales. This ticket is the prerequisite to running any optimized Meta campaign for this client.

---

## Acceptance Criteria

- [ ] Server-side event `Lead` fires within 2 seconds of the investor lead form submit, deduplicated against the client-side pixel `Lead` event via shared `event_id` (UUID v4, generated on the client and forwarded to the server action)
- [ ] PII fields (`em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`, `external_id`) are SHA-256 hashed (lowercased, trimmed, E.164 for phone) before transmission — verified by inspecting the outgoing request payload
- [ ] Non-PII fields (`fbp`, `fbc`, `client_ip_address`, `client_user_agent`) are sent in plaintext per Meta spec — `fbc` is reconstructed server-side from the `fbclid` query param if the cookie is missing
- [ ] Test events visible in Meta Events Manager → Test Events tab using `META_TEST_EVENT_CODE` for at least the dev and staging environments
- [ ] Custom event `WhatsAppClick` fires via CAPI on every click of `FloatingWhatsApp.tsx`, `EstateHero.tsx` WhatsApp button, and `StickyBottomBar.tsx` WhatsApp CTA, with `content_name` = source component
- [ ] Custom event `BrochureDownload` fires via CAPI when the brochure PDF route in `src/lib/pdf/brochure.tsx` returns a successful response
- [ ] Custom event `WhatsAppReply` fires via CAPI from the WhatsApp Business webhook handler when an inbound message is received from a lead phone number
- [ ] CAPI events feature-flagged behind `NEXT_PUBLIC_CAPI_ENABLED` (client) and `CAPI_ENABLED` (server) — both must be true to fire
- [ ] CAPI failures never block, throw, or delay the user-facing flow (form submit, brochure download) — errors logged to PostHog and console only
- [ ] All CAPI calls use a 3-second timeout via `AbortController`; failures retry once with 500ms backoff
- [ ] DPDP / GDPR consent banner state is checked before any pixel or CAPI event fires (read from existing consent cookie / context)
- [ ] Match Quality score in Events Manager reaches ≥7.0 within 14 days of production launch (verification step, not blocking initial ship)
- [ ] Event Match Quality (EMQ) for `Lead` event ≥6.5 within 7 days
- [ ] Unit tests cover the hash function (RFC-compliant SHA-256, lowercase hex, no salt) and the event payload builder
- [ ] Integration test fires a synthetic `Lead` event against `test_event_code` and asserts 200 response from Graph API

---

## Required Environment Variables

Add to Vercel project (Production, Preview, Development scopes) and to local `.env.local`:

```
NEXT_PUBLIC_META_PIXEL_ID=          # Public, also used by client-side Pixel script
META_CAPI_ACCESS_TOKEN=             # SECRET, server-only. Generate in Meta Events Manager
                                    # → Data Sources → [Pixel] → Settings → Conversions API
                                    # → Generate Access Token. Mark as "system user" token
                                    # for long-lived (no expiry) — never use a 60-day user token.
META_TEST_EVENT_CODE=                # e.g. TEST12345 — used in dev/staging to route events
                                    # to Test Events tab without polluting Match Quality.
                                    # MUST be unset in production env.
META_CAPI_API_VERSION=v19.0         # Pinned Graph API version (do not auto-upgrade)
META_CAPI_DATASET_ID=                # Optional — only needed if using a Dataset (vs. Pixel) ID
CAPI_ENABLED=true                   # Server feature flag
NEXT_PUBLIC_CAPI_ENABLED=true       # Client feature flag
WHATSAPP_WEBHOOK_VERIFY_TOKEN=      # SECRET — for Meta webhook handshake (WhatsApp Business)
WHATSAPP_APP_SECRET=                 # SECRET — verifies inbound webhook payload signature
```

`META_CAPI_ACCESS_TOKEN` and `WHATSAPP_APP_SECRET` MUST be flagged as Sensitive in Vercel and never exposed to the client bundle. Confirm with `npm run build && grep -r "META_CAPI" .next/static/` — must return zero matches.

---

## Implementation Plan — File-by-File

### File: `src/lib/meta/capi.ts` (NEW)

Core CAPI utility. Exports:

- `sendCapiEvent(eventName: string, eventData: EventData, userData: UserData, options?: { eventId?: string; testEventCode?: string }): Promise<CapiResult>` — posts a single event to Graph API
- `hashUserData(userData: RawUserData): HashedUserData` — SHA-256 hashes PII fields (em, ph, fn, ln, ct, st, zp, country, external_id), passes through non-PII (fbp, fbc, client_ip_address, client_user_agent)
- `normalizePhone(raw: string): string` — strip non-digits, prepend country code if missing (default +91 for IN, +971 for AE based on form locale)
- `normalizeEmail(raw: string): string` — lowercase, trim
- `buildFbc(fbclid: string | null, eventTime: number): string | null` — reconstruct `fbc` from URL param when cookie absent: `fb.1.{eventTime}.{fbclid}`

Implementation rules:
- Endpoint: `https://graph.facebook.com/${META_CAPI_API_VERSION}/${PIXEL_ID}/events?access_token=${TOKEN}`
- Payload shape: `{ data: [{ event_name, event_time, event_id, action_source, event_source_url, user_data, custom_data }], test_event_code? }`
- `action_source` defaults to `"website"`; for WhatsApp webhook events use `"chat"`; for brochure use `"website"`
- `event_time` = unix seconds (NOT ms)
- Use `fetch` with `AbortController` (3s timeout) and one retry on network/5xx
- On error: post breadcrumb to PostHog `meta_capi_error` and `console.error` — never `throw`
- Read `CAPI_ENABLED` env flag — short-circuit return `{ skipped: true }` if false

### File: `src/lib/meta/types.ts` (NEW)

TypeScript types for `EventData`, `UserData`, `RawUserData`, `HashedUserData`, `CapiResult`. Strict — no `any`.

### File: `src/lib/meta/pixel.ts` (NEW)

Thin client-side helper exporting `firePixelEvent(eventName, eventId, eventData)` that calls `window.fbq('track', eventName, eventData, { eventID: eventId })`. The `eventID` (camelcase) is the dedup key Meta uses to match client + server. Reads `NEXT_PUBLIC_CAPI_ENABLED` + consent cookie before firing.

### File: `src/app/layout.tsx` (MODIFY)

Add Meta Pixel base code in `<head>` (Next.js Script component, `strategy="afterInteractive"`). Already-present analytics scripts stay. Pixel must initialize with `fbq('init', NEXT_PUBLIC_META_PIXEL_ID)` and fire `PageView` once on mount, gated on consent.

### File: `src/components/invest/LeadCapture.tsx` (MODIFY)

Currently uses React 19 `useActionState`. Changes:
1. Generate `event_id = crypto.randomUUID()` on submit (before calling the server action)
2. Pass `event_id` through `FormData` as a hidden field
3. After server action returns success: call `firePixelEvent('Lead', event_id, { content_name: 'investor_lead_form', value: tier_value, currency: 'AED' })`
4. Capture `_fbp` and `_fbc` cookies + extract `fbclid` from URL — pass through FormData so the server action can forward them to CAPI

### File: `src/app/invest/actions.ts` (NEW — split from `admin/actions.ts`)

New server action `submitInvestorLead(formData)`:
1. Parse + validate form (zod schema — already pattern in repo)
2. Write to Firebase Firestore + Supabase (existing dual-write logic, lifted from current LeadCapture submit handler)
3. Read client `event_id`, `fbp`, `fbc`, `fbclid` from FormData
4. Read `client_ip_address` from `headers().get('x-forwarded-for')?.split(',')[0]` and `client_user_agent` from `headers().get('user-agent')`
5. Fire `sendCapiEvent('Lead', { value, currency: 'AED', content_name: 'investor_lead_form', tier_id }, hashedUserData, { eventId, testEventCode })` — `await` but don't fail the action if it errors
6. Return success regardless of CAPI status

### File: `src/components/invest/FloatingWhatsApp.tsx` (MODIFY)

On WhatsApp click handler:
1. Generate `event_id`
2. Fire client-side `firePixelEvent('Contact', event_id, { content_name: 'whatsapp_floating' })`
3. Call new server route `POST /api/meta/whatsapp-click` with `{ event_id, source: 'floating', fbp, fbc, fbclid }`
4. Use `navigator.sendBeacon` to ensure the request fires before navigation to wa.me

Mirror the same pattern in `src/components/invest/EstateHero.tsx` (source: `hero_cta`) and `src/components/invest/StickyInvestCTA.tsx` (source: `sticky_bar`).

### File: `src/app/api/meta/whatsapp-click/route.ts` (NEW)

POST handler. Reads body + headers (IP, UA), calls `sendCapiEvent('Contact', { content_name: 'whatsapp_${source}' }, userData, { eventId })`. Returns 204 No Content. Use Edge runtime (`export const runtime = 'edge'`) for sub-100ms response.

### File: `src/lib/pdf/brochure.tsx` (caller MODIFY)

The brochure download route handler (likely `src/app/api/brochure/route.ts` — confirm during implementation) must, after returning the PDF response, fire `sendCapiEvent('Lead', { content_name: 'brochure_download', content_category: 'brochure' }, userData, { eventId })` in the background using `waitUntil()` or `after()` (Next.js 16 App Router pattern). User-data is whatever email/phone was collected in the gate form (if present); otherwise just `client_ip_address` + `client_user_agent` + `fbp`/`fbc`.

### File: `src/app/api/whatsapp/webhook/route.ts` (NEW)

WhatsApp Business webhook for the unified bot line `+91 94470 80356` (Rajeev Abraham, primary contact + WhatsApp Business API line as of 2026-05-07; replaces prior split UAE/India numbers). Fr. Mathew Puthumana's current number is TO BE CONFIRMED separately and is NOT part of this integration.

- `GET` handler: verify-token handshake using `WHATSAPP_WEBHOOK_VERIFY_TOKEN` (Meta requirement at registration)
- `POST` handler:
  1. Verify `x-hub-signature-256` against `WHATSAPP_APP_SECRET` (HMAC SHA-256). Reject 401 on mismatch.
  2. Parse webhook envelope: `entry[].changes[].value.messages[]`
  3. For each inbound message: extract `from` (phone), check against Firestore leads collection (match by phone)
  4. If match: fire `sendCapiEvent('WhatsAppReply', { content_name: 'whatsapp_reply', lead_matched: true }, { ph: hashedPhone, external_id: hashedFirestoreLeadId, country: 'in_or_ae' }, { eventId: messageId })`
  5. Always return 200 (Meta retries indefinitely on non-200)

This event is the high-quality signal Meta should optimize on for retargeting and lookalike-1% audiences.

### File: `src/app/api/investor-chat/route.ts` (MODIFY)

When the chat advances past message 3 (engaged session signal), fire `sendCapiEvent('CompleteRegistration', { content_name: 'chat_engaged' }, userData, { eventId })`. Threshold tunable via `CHAT_ENGAGEMENT_TURN_THRESHOLD` env var (default 3).

---

## Testing Protocol

### Local
- Set `META_TEST_EVENT_CODE=TESTXXXXX` and `CAPI_ENABLED=true` in `.env.local`
- Run `pnpm dev`, submit a lead form, click WhatsApp, download brochure
- In Events Manager → Test Events tab, confirm 3 events appear within 5 seconds
- Inspect Network tab → outgoing `/api/meta/*` payload — confirm hashed PII (64-char hex strings)

### Staging
- Vercel preview deploy with `META_TEST_EVENT_CODE` set
- Run 10 real submits across iOS Safari, Android Chrome, Desktop Chrome
- All 10 must appear in Test Events tab with both `Browser` and `Server` source markers (proves dedup is reachable, not yet effective)
- Trigger WhatsApp webhook by sending a real message to the bot number from a phone matching a recently-submitted lead — confirm `WhatsAppReply` event lands

### Production rollout
- Remove `META_TEST_EVENT_CODE` from production env
- Enable feature flags `CAPI_ENABLED=true` for 10% of traffic via Vercel Edge Config or PostHog flag
- Monitor Events Manager → Diagnostics tab for 72 hours: zero "Server Event Errors" critical, zero "Hash Mismatch" warnings
- Day 7: check Match Quality score per event. `Lead` ≥7.0 = green light to ramp to 100%
- Day 14: confirm Event Match Quality stable, deduplication rate (server events with matching client event) ≥60% — this is the metric proving the fix is working

---

## Privacy & Security

- All PII (`em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`, `external_id`) MUST be SHA-256 hashed (lowercase hex, no salt) before transmission per Meta CAPI v19.0+ spec. `fbp`, `fbc`, `client_ip_address`, `client_user_agent` are sent in plaintext per Meta requirement
- Phone numbers normalized to E.164 (e.g., `+919447080356`, no spaces or dashes) BEFORE hashing — hashing a non-normalized number yields zero match rate
- Email lowercased + trimmed before hashing
- `META_CAPI_ACCESS_TOKEN` stored only in Vercel Environment Variables (Sensitive flag enabled), never in source, never in client bundle. CI check: build artifact grep returns zero hits for the token prefix
- DPDP Act 2023 (India) and GDPR (EU NRIs) consent gating: read existing consent cookie before firing any pixel or CAPI event. If user has not consented to "marketing/analytics", short-circuit both client + server. Server action checks `consent` field in FormData (set by client based on cookie state)
- Webhook signature verification mandatory on `/api/whatsapp/webhook` — HMAC SHA-256 of raw body using `WHATSAPP_APP_SECRET`. Use `crypto.timingSafeEqual` for comparison
- Add `META_CAPI_ACCESS_TOKEN` to the project's secret-rotation runbook — rotate every 180 days

---

## Rollout Plan

1. **Dev:** Land code behind `CAPI_ENABLED=false` (default off in `.env.example`). Land merged to `main`, deployed to preview env only
2. **Staging:** Set `CAPI_ENABLED=true` and `META_TEST_EVENT_CODE` on a Vercel preview branch. Run staging test protocol above
3. **Production canary:** Enable for 10% of traffic via PostHog feature flag `meta-capi-enabled` (cohort: 10% of visitors). `META_TEST_EVENT_CODE` UNSET in production
4. **Monitor (3 days):** Events Manager → Diagnostics tab; PostHog dashboard for `meta_capi_error` rate (must stay <0.5% of submits)
5. **Ramp:** 10% → 50% → 100% over 5 days assuming Match Quality climbs above 7.0 and zero P1 errors
6. **Post-launch (Day 14):** Enable Lead Quality optimization in Meta Ads Manager — switch the campaign optimization goal from "Lead" to "WhatsAppReply" once the custom event has ≥50 conversions in 7 days (Meta minimum for optimization)

---

## Open Questions for PM/Product

- **Value attribution:** Should we send `value` (in AED) on the `Lead` event tied to the selected investor tier (5L = ~AED 22K, 30L = ~AED 132K)? This enables Meta ROAS optimization but exposes deal sizing to Meta's bidding model. Recommend: send `value` but flag it as `predicted_ltv` not actual revenue
- **WhatsApp lead-match strategy:** When a webhook reply arrives from a phone number not in our Firestore leads collection, do we fire `WhatsAppReply` anyway (treating cold WhatsApp DMs as a separate signal) or drop the event? Default: drop, but PM may want both
- **Geo split:** Under v3 (Kerala + diaspora), do we want separate Pixels per country/region (IN, US/GB/AU/NZ as one diaspora bucket, or each country separately) to train distinct Special Ad Audience models, or one shared Pixel with `country` user_data segmentation? Single Pixel is simpler; multi-Pixel gives better optimizer signal at the cost of multiple Datasets to maintain. Recommend single shared Pixel for v3 launch, split only if SAA performance varies dramatically by country in week 4+ data.
- **Investor chat as conversion event:** Confirm with marketing whether `CompleteRegistration` on chat-engaged is the right standard event name, or if we should use a custom `ChatEngaged` event. Standard events get better optimizer treatment; custom events give cleaner reporting
- **Consent UX gap:** Does `matermariahomes.com` currently have a DPDP/GDPR consent banner, or are we building it as part of this ticket? If absent, this ticket scope expands by ~1 engineer-day
