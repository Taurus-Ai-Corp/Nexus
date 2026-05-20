# Nexus — Campaign Brief (Media Buyer Plan)

## Objective

**Primary**: Lead Generation via Meta-hosted instant form. Form captures: name, email, primary tool today (Figma / Webflow / Framer / Adobe / other), team size (solo / 2-5 / 6+), country.

**Why instant form, not Conversions-to-trial**: Nexus's signup is admin-gated (Clerk approval queue). Until free-trial signup is end-to-end verified — Clerk approval flow + Stripe/billing wired + landing page Pixel events firing — running on a Conversions objective would burn budget feeding the algo half-broken events. Instant form is the conservative ship. Upgrade path: once trial signup is live and 50+ trials have fired through the Pixel, duplicate the campaign as Conversions-objective and run them side-by-side for two weeks before retiring the lead form.

## Funnel Stage

- **Cold prospecting** (2 of 3 ad sets): Kerala cold + UAE cold. ~75% of budget.
- **Warm retargeting** (1 of 3 ad sets): 30-day site visitors + video 25%-viewers. ~25% of budget. Smaller pool, but designers research before they apply — the warm pool is where the lead actually closes.

## Optimization Event

- **LEADS** (instant form fill) for cold ad sets.
- **LEADS** for warm too in week 1. Reassess at day 14 — if warm has enough volume (50+ form fills), switch warm optimization to a deeper event like `complete_application` (server-side via Conversion API) so the algo learns who actually finishes the curated application, not just the easy form.

## Bid Strategy

- **Lowest Cost** (no bid cap) for first 14 days. Budget is small ($60/day total). A bid cap on small budgets starves the algo and stretches learning phase past the test window.
- **Cost Cap** consideration at day 14+ once we have a CPL benchmark. If Kerala cold is converting at $7 CPL and UAE cold at $13, we'd cap UAE at $15 to prevent runaway and let Kerala uncapped.

## Pacing

- **Standard delivery** (not accelerated). Accelerated only ever makes sense with very short flights or news-tied creative.
- Daily budget, not lifetime. Daily lets us pause/edit per-ad-set without resetting the lifetime pacing curve.

## Budgets

| Ad set | Daily | Monthly |
|---|---|---|
| Kerala — Cold | $20 | ~$600 |
| UAE — Cold | $25 | ~$750 |
| Warm — Retargeting | $15 | ~$450 |
| **Total** | **$60** | **~$1,800** |

UAE gets a slightly higher daily because UAE auctions are 2-3x more expensive than Kerala — the higher daily keeps UAE from getting starved out and stuck in learning.

## Learning Phase Exit Criteria

Meta exits learning at 50 optimization events in 7 days per ad set. With expected CPLs:

- Kerala cold @ $20/day, $7 CPL → ~85 leads in 7 days → exits learning cleanly.
- UAE cold @ $25/day, $13 CPL → ~13 leads in 7 days → **WILL stay stuck in learning** without consolidation. Mitigation: keep UAE on broad creative-stack (all 5 ads in rotation) instead of split-testing — gives the algo more event volume per ad set.
- Warm @ $15/day → small pool, expect partial learning. That's fine — warm is for closing, not algo training.

If an ad set is still in learning at day 14, consolidate or kill. Do NOT add budget to a learning-phase ad set hoping to push it through — that resets learning.

## Test / Scale Plan

- **Days 1-14**: Single campaign, 3 ad sets, 5 creatives in rotation, no edits except killing dead creative (CTR <0.7% after 1,000 impressions).
- **Day 14 review**: Compute CPL by ad set + by creative. Identify the 1-2 winning angles.
- **Days 15-28 (if signal differs by geo)**: Split Kerala-cold and UAE-cold into separate campaigns with their own budgets. Promote winning creatives only. Kill bottom-2 creatives.
- **Day 28+ scale**: If CPL holds, expand by 20%/week (not 2x — Meta penalizes step-function budget jumps with re-learning). Add lookalikes seeded from the lead list (1% LAL Kerala, 1% LAL UAE).

## Pixel + Conversion API Requirements

Critical because the admin-approval gate decouples form-fill from real value:

- **Browser Pixel events** (already standard): `PageView`, `Lead` (on form submit), `ViewContent` (pricing/features sections).
- **Conversion API server events** (NEW — engineering must build): `account_approved` (fires when admin approves), `account_activated` (fires on first playground action), `subscription_started` (fires on first paid invoice). All sent server-side with the original `event_id` matched to the Pixel `Lead` event for dedup.
- Without server CAPI, Meta's algo will optimize for "people who fill forms" — which selects for tire-kickers, not approvable designers. Server CAPI is the difference between $13 CPL of junk leads and $13 CPL of real applicants.

## Brand & Compliance Notes

- Operating brand on creatives = "Nexus" (NOT "TAURUS AI Corp" or "FZCO"). Customer-facing.
- Lead form privacy URL must point to Nexus's privacy policy, not the corporate FZCO entity.
- UAE: Meta does not require a special license for SaaS lead-gen, but creative cannot make unverifiable claims. Avoid "fastest", "best", "guaranteed".
- India: DPDP Act 2023 — privacy URL + lawful-basis disclosure required on the form.
