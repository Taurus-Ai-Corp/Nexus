# ENG-NV-001 — Implement Meta Conversions API (CAPI) for NeoVibe with Quality-Gated Optimization

**Priority:** P0 (campaigns cannot ship without this; misconfigured optimization = burned budget)
**Estimated effort:** 5 engineer-days (3 dev + 1 Clerk webhook integration + 1 QA/staging)
**Owner:** TBD — engineering manager to assign (suggest: full-stack engineer with Clerk webhook + Next.js App Router experience)
**Blocks:**
- NeoVibe paid acquisition launch (Meta + Instagram)
- NeoVibe lookalike audience generation (lookalike-1% off `account_activated`, not `lead_submitted`)
- All Meta retargeting cohorts past the awareness layer

---

## Background

NeoVibe has a multi-stage admission funnel that breaks Meta's default optimization model. The product is gated by Clerk admin-approval — a user signs up, an internal admin reviews and approves the account, the user logs in for the first time, and only then can they generate designs (the activation event). Approval rate sits around 50% (we screen for serious freelancers, not random tire-kickers), and trial-to-paid conversion is approximately 25%. If Meta's optimization signal is `lead_submitted` (form fill), the algorithm is training on a population where 87.5% of "conversions" never become real users — they're rejected, ghost the onboarding, or never convert past trial. Meta's Advantage+ bidder will happily find more of those people, scaling our acquisition spend on high-volume low-quality cohorts.

The math is unambiguous on $10K/month ad spend: with `lead_submitted` as the optimization event at a $40 CPL, we get ~250 leads/month, of which ~125 get approved, ~31 activate, ~8 convert to paid. Effective CAC = $1,250. With CAPI firing `account_approved` and `account_activated` server-side as the optimization events, Meta's bidder shifts spend to cohorts that look like real customers, not form-fillers. Industry benchmarks (Vercel/Linear/Stripe SaaS comparable) show 40–55% CAC reduction within 30 days when switching from top-of-funnel to mid-funnel CAPI events. Conservative estimate: CAC drops to $700–800 within 60 days, freeing $4–5K/month of effective spend or letting us scale acquisition 1.6x at flat budget.

There's also a privacy/iOS angle. NeoVibe's primary acquisition geos (US, EU, UK, India for early adopters) skew iOS — design freelancers are disproportionately Mac/iOS users. iOS Safari ITP and Mail Privacy Protection collapse browser-side pixel reliability the same way they hurt Mater Maria, and the new iOS 17+ Link Tracking Protection strips `fbclid` from URLs in private browsing and Mail. CAPI is the only way to maintain attribution fidelity for this audience, full stop. This ticket builds the Pixel + CAPI stack and wires the Clerk admin-approval webhook to fire the optimization event server-side — the single most consequential change to NeoVibe's paid-acquisition economics.

---

## Acceptance Criteria

- [ ] Server-side event `Lead` fires within 2 seconds of signup form submit, deduplicated against client-side Pixel `Lead` event via shared `event_id` (UUID v4)
- [ ] Server-side event `account_approved` (custom event) fires when a Clerk webhook delivers `user.updated` with metadata flag `approval_status: "approved"` set by an admin
- [ ] Server-side event `account_activated` (custom event) fires the first time an approved user completes their first design generation (`first_design_generated_at` is set in user metadata)
- [ ] Server-side event `Subscribe` fires on first successful trial-to-paid conversion (Stripe/Hyperswitch webhook handler)
- [ ] PII fields (`em`, `ph`, `fn`, `ln`, `external_id`) are SHA-256 hashed (lowercased, trimmed, E.164 for phone) before transmission. `external_id` = SHA-256(Clerk user ID)
- [ ] Test events visible in Meta Events Manager → Test Events tab using `META_TEST_EVENT_CODE` for at least the dev and staging environments
- [ ] Clerk webhook signature verified via `svix` library — webhooks with bad signatures rejected with 401, never processed
- [ ] CAPI failures never block, throw, or delay the user-facing flow — errors logged to PostHog and Sentry only
- [ ] All four standard/custom events (`Lead`, `account_approved`, `account_activated`, `Subscribe`) appear in Events Manager with deduplication rate ≥40% (where applicable) and Match Quality ≥7.0 within 14 days of launch
- [ ] CAPI events feature-flagged behind `NEXT_PUBLIC_CAPI_ENABLED` (client) and `CAPI_ENABLED` (server)
- [ ] Cookie consent banner state checked before any client-side Pixel fires; CAPI events fire regardless of cookie consent (legal review confirms server-side first-party events are permissible under GDPR legitimate interest for service operation, with user opt-out honored)
- [ ] Unit tests cover hash function, event payload builder, and Clerk webhook signature verification
- [ ] End-to-end test: synthetic signup → admin approval (via Clerk API mock) → first design generation → all three events visible in Test Events tab in correct order

---

## Required Environment Variables

Add to Vercel project (Production, Preview, Development scopes) and to local `.env.local`:

```
NEXT_PUBLIC_META_PIXEL_ID=          # Public, used by client Pixel
META_CAPI_ACCESS_TOKEN=             # SECRET — system-user token, no expiry
META_TEST_EVENT_CODE=                # TESTXXXXX in dev/staging only; UNSET in production
META_CAPI_API_VERSION=v19.0
META_CAPI_DATASET_ID=                # Optional — only if Dataset (not Pixel) is used
CAPI_ENABLED=true
NEXT_PUBLIC_CAPI_ENABLED=true

CLERK_SECRET_KEY=                    # already present in repo
CLERK_WEBHOOK_SIGNING_SECRET=        # SECRET — from Clerk Dashboard → Webhooks → Endpoint
                                    # Use svix library for verification
STRIPE_WEBHOOK_SECRET=               # if Stripe integration; alternative: HYPERSWITCH_WEBHOOK_SECRET

NEXT_PUBLIC_PRICING_TRIAL_VALUE=49   # USD — value field on `Subscribe` event
                                    # represents predicted MRR for ROAS optimization
```

`META_CAPI_ACCESS_TOKEN`, `CLERK_WEBHOOK_SIGNING_SECRET`, and `STRIPE_WEBHOOK_SECRET` MUST be flagged as Sensitive in Vercel and never appear in the client bundle. CI grep check on `.next/static/` for token prefixes — zero matches required.

---

## Implementation Plan — File-by-File

### File: `src/lib/meta/capi.ts` (NEW)

Identical pattern to the Mater Maria CAPI utility (this is a reusable shared shape — consider extracting to an internal package later, out of scope for this ticket). Exports:

- `sendCapiEvent(eventName, eventData, userData, options)` — POSTs single event to `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`
- `hashUserData(userData)` — SHA-256 hashes PII fields
- `normalizePhone(raw)` — E.164
- `normalizeEmail(raw)` — lowercase, trim
- `buildFbc(fbclid, eventTime)` — reconstruct fbc from fbclid

Implementation rules: 3-second timeout via AbortController, one retry on 5xx, never throws (errors → PostHog `meta_capi_error` + Sentry breadcrumb), respects `CAPI_ENABLED` flag.

### File: `src/lib/meta/types.ts` (NEW)

TypeScript types for `EventData`, `UserData`, `RawUserData`, `HashedUserData`, `CapiResult`, `NeoVibeCustomEvent` (union of `'account_approved' | 'account_activated'`).

### File: `src/lib/meta/pixel.ts` (NEW)

Client helper exporting `firePixelEvent(eventName, eventId, eventData)` calling `window.fbq('track', eventName, eventData, { eventID: eventId })`.

### File: `app/layout.tsx` (MODIFY)

Inject Meta Pixel base code via Next.js `<Script strategy="afterInteractive">`. Initialize `fbq('init', NEXT_PUBLIC_META_PIXEL_ID)` and `fbq('track', 'PageView')` on mount, gated on cookie consent.

### Lead form submission

Likely paths (confirm during scoping — the studio app structure under `01-CORE-PLATFORM/neovibe-studio/NeoVibe_DESIGN_LOUNGE/BIizflow_supernova_OCT_8/src/app/` lacks a signup route yet):

#### File: `app/(marketing)/signup/page.tsx` (NEW or MODIFY)

If a signup form lives here, modify; if not yet built, this ticket includes scaffolding the marketing-side capture form that hands off to Clerk's hosted signup. Generate `event_id` on submit, pass to Clerk via `unsafeMetadata: { signup_event_id }` so the server-side event-id can match the client-side Pixel event-id later.

#### File: `app/api/leads/capture/route.ts` (NEW)

POST handler:
1. Validate body (zod)
2. Persist lead to DB (Pinecone metadata or primary DB — confirm with team)
3. Read `client_ip_address`, `client_user_agent`, `fbp`, `fbc`, `fbclid`, `event_id`
4. Fire `sendCapiEvent('Lead', { content_name: 'neovibe_signup', value: 0, currency: 'USD' }, hashedUserData, { eventId })`
5. Return 200 with lead ID

Pass `custom_data.admin_approval_pending: true` so reporting can segment Pre-Approval vs Post-Approval leads (NOT used as an optimization filter — Meta's bidder doesn't filter on `custom_data` flags, this is for reporting only).

### Clerk webhook integration (CRITICAL — highest-risk step)

#### File: `app/api/clerk/webhook/route.ts` (NEW)

This is the single most important file in the ticket. Misconfiguring this means Meta optimizes on the wrong event.

POST handler:
1. Read raw body and Svix signature headers (`svix-id`, `svix-timestamp`, `svix-signature`)
2. Verify with `svix` library using `CLERK_WEBHOOK_SIGNING_SECRET`. Bad signature → return 401 immediately
3. Switch on `event.type`:
   - `user.created` → fire `sendCapiEvent('CompleteRegistration', { content_name: 'clerk_account_created' }, userData, { eventId: event.data.id })` — this is for cohort tracking, not the primary optimization event
   - `user.updated` → check `event.data.public_metadata.approval_status`:
     - If transitioned to `'approved'` (compare against previous state stored in our DB or use `event.data.public_metadata.approved_at` timestamp): fire `sendCapiEvent('account_approved', { content_name: 'admin_approval', value: NEXT_PUBLIC_PRICING_TRIAL_VALUE, currency: 'USD' }, userData, { eventId: 'approval_' + event.data.id })`
     - If transitioned to `'rejected'`: fire `sendCapiEvent('account_rejected', ...)` for negative-signal training (advanced — flag for v2)
   - Other event types: ignore
4. Always return 200 to Clerk (avoid retry storms). Log unexpected event types to Sentry only

User data construction: `em` from `event.data.email_addresses[0].email_address`, `external_id` from `event.data.id` (Clerk user ID, hashed), `fn`/`ln` from `event.data.first_name`/`last_name`. We do NOT have client_ip_address or fbp/fbc here (this is a Meta→our-server webhook, no client context) — use only the hashed PII fields. EMQ will be slightly lower than `Lead` event but still meets the ≥6.5 threshold given strong email + external_id signal.

**Critical correctness check:** If the user has not yet consented to marketing tracking, do NOT fire CAPI events from the webhook. Read consent state from user metadata (`event.data.public_metadata.marketing_consent`) — must be set during signup form. This is the legal gate.

### Activation event

Define "activation" as: **first successful design generation by an approved user**. Rationale: this is the strongest leading indicator of paid conversion (data-team analysis required to confirm — placeholder definition until product owner confirms; see Open Questions).

#### File: `app/api/designs/generate/route.ts` (MODIFY — assume exists; if route is named differently, the engineer should grep for `pinecone` or `huggingface` calls and locate the design-generation handler)

After successful generation:
1. Read `currentUser` from Clerk (`@clerk/nextjs/server`)
2. Check `user.publicMetadata.first_design_generated_at` — if absent, this is the activation event
3. Set `first_design_generated_at = new Date().toISOString()` via `clerkClient.users.updateUserMetadata`
4. Fire `sendCapiEvent('account_activated', { content_name: 'first_design_generated', value: NEXT_PUBLIC_PRICING_TRIAL_VALUE, currency: 'USD' }, userData, { eventId: 'activation_' + user.id })`
5. Continue with normal response (CAPI runs in `after()` / `waitUntil()` so it doesn't add latency)

### Subscribe event (paid conversion)

#### File: `app/api/billing/webhook/route.ts` (NEW or MODIFY — Stripe or Hyperswitch)

On `customer.subscription.created` or equivalent Hyperswitch event:
1. Verify webhook signature (`STRIPE_WEBHOOK_SECRET` or Hyperswitch HMAC)
2. Look up Clerk user via `customer.metadata.clerk_user_id`
3. Fire `sendCapiEvent('Subscribe', { value: subscription.amount, currency: subscription.currency, predicted_ltv: subscription.amount * 12 }, userData, { eventId: 'sub_' + subscription.id })`

This is the ROAS-optimization event. Once `Subscribe` has 50+ conversions/week in Events Manager, Meta Ads Manager can run Highest-Value bidding on it.

---

## Testing Protocol

### Local
- Set `META_TEST_EVENT_CODE` and `CAPI_ENABLED=true` in `.env.local`
- Run `pnpm dev`, complete signup → confirm `Lead` event in Test Events tab within 5s
- Use Clerk Dashboard → Webhooks → "Send test event" to fire a `user.updated` payload with `approval_status: 'approved'` → confirm `account_approved` lands
- Trigger a design generation → confirm `account_activated` lands (only on first generation; subsequent should NOT fire — verify the metadata flag works)
- Use Stripe CLI / Hyperswitch test mode → fire subscription.created → confirm `Subscribe` lands

### Staging
- Vercel preview deploy with `META_TEST_EVENT_CODE`
- Configure Clerk webhook endpoint in Clerk Dashboard pointing at preview URL `/api/clerk/webhook`
- Run end-to-end: 5 real signups → admin approves 3 in Clerk Dashboard → all 3 `account_approved` events land → 2 of 3 generate first design → 2 `account_activated` events land
- Assert the 2 rejected/abandoned users do NOT generate `account_approved` or `account_activated`

### Production rollout
- Remove `META_TEST_EVENT_CODE`
- Configure Clerk webhook endpoint pointing at production URL
- Enable feature flag at 10% of signups (PostHog or Vercel Edge Config). Note: at low signup volume, 10% canary may not produce statistically meaningful event volume — consider 50% canary instead
- Monitor Events Manager → Diagnostics for 7 days
- Day 14: Match Quality ≥7.0 → switch the campaign optimization goal in Ads Manager from `Lead` → `account_approved`
- Day 30: if `Subscribe` has ≥50 weekly conversions, additionally enable Highest-Value bidding on `Subscribe` for high-intent retargeting cohorts

---

## Privacy & Security

- All PII (`em`, `ph`, `fn`, `ln`, `external_id`) SHA-256 hashed (lowercase hex, no salt) before transmission per Meta CAPI v19.0+ spec. `fbp`, `fbc`, `client_ip_address`, `client_user_agent` sent in plaintext per Meta requirement
- `external_id` = SHA-256 of Clerk user ID — gives Meta a stable cross-event identifier without leaking the raw ID
- GDPR / CCPA compliance: the `marketing_consent` field on Clerk user metadata is the legal gate. CAPI events from the Clerk webhook handler MUST check this flag before firing. Document this in the privacy policy as "first-party server events for service-related signals (account approval, activation) sent to advertising partners under legitimate interest with opt-out available"
- `META_CAPI_ACCESS_TOKEN`, `CLERK_WEBHOOK_SIGNING_SECRET`, `STRIPE_WEBHOOK_SECRET` stored only in Vercel Environment Variables, Sensitive flag enabled, never in source, never client-bundle. CI grep check enforces this
- Webhook signature verification mandatory on both `/api/clerk/webhook` (svix) and `/api/billing/webhook` (Stripe/Hyperswitch HMAC). Use `crypto.timingSafeEqual`. No exceptions
- Add `META_CAPI_ACCESS_TOKEN` and `CLERK_WEBHOOK_SIGNING_SECRET` to the project's secret-rotation runbook — rotate every 180 days
- Audit log: every CAPI event posted writes a row to PostHog with `event_name`, `event_id`, `user_id_hashed`, `success`, `timestamp` — needed for GDPR Article 30 records of processing

---

## Rollout Plan

1. **Dev:** Land code behind `CAPI_ENABLED=false`. Default off in `.env.example`
2. **Staging:** Enable `CAPI_ENABLED=true` and `META_TEST_EVENT_CODE` on a Vercel preview branch. Run staging test protocol
3. **Production canary (50% of signups):** PostHog feature flag `meta-capi-enabled`. NeoVibe signup volume is not yet high enough to justify a 10% canary — go straight to 50%. `META_TEST_EVENT_CODE` UNSET in production
4. **Monitor (3 days):** Events Manager → Diagnostics; PostHog `meta_capi_error` rate <0.5%; Clerk webhook delivery rate >99% (failed deliveries surface in Clerk Dashboard → Webhooks → Logs)
5. **100% rollout (Day 4):** if zero P1 errors and Match Quality climbing, ramp to 100%
6. **Optimization-event switch (Day 14):** in Meta Ads Manager, change campaign optimization from `Lead` to `account_approved`. Expect 2-week learning phase reset — coordinate with media-buyer to pause spend ramp during this window
7. **Optional second switch (Day 45):** if `Subscribe` has ≥50 conversions/week, enable Highest-Value bidding on retargeting campaigns

---

## Open Questions for PM/Product

- **What event signals "activation"?** This ticket assumes "first successful design generation" based on usage analysis intuition, but PM/product owner must confirm. Alternative candidates: first export, first project saved, day-2 return visit, first share. The choice materially affects which cohort Meta optimizes for. **Block on this answer before staging deploy** — wrong choice means we burn ad spend training on the wrong signal
- **Trial value field:** Should we send `value` on `Subscribe` events (enables Meta ROAS bidding) or omit it for privacy? Recommended: send actual transaction value, not predicted LTV. Predicted LTV is brittle and inflates Meta's bid recommendations
- **Rejected accounts as negative signal:** Should we fire a custom `account_rejected` event so Meta's bidder learns to deprioritize people who look like rejected applicants? This is an advanced pattern — flag for v2 once core events are stable
- **Marketing consent at signup:** Where does the user grant consent to "share signals with advertising partners"? Confirm with legal/PM that the signup form includes an explicit consent checkbox stored as `public_metadata.marketing_consent` on the Clerk user. If absent, this ticket scope expands by ~0.5 engineer-day to add the consent UI and store the flag
- **Single Pixel or per-geo Pixel?** Same question as Mater Maria. Single Pixel is simpler; multi-Pixel gives the optimizer cleaner per-region signals at the cost of more Datasets to manage. Default to single Pixel; revisit at $50K/month spend
- **Pinecone-backed cohort enrichment:** Could we enrich CAPI `custom_data` with embedding-cluster IDs from Pinecone (e.g. `design_persona_cluster: "logo_designer"`) to give Meta signal about user intent type? Out of scope for this ticket but high-value follow-up
