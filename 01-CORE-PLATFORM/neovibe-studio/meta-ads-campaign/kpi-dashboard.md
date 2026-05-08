# NeoVibe — Week 1 KPI Dashboard & Decision Rules

## Daily Check (10 min, mornings)

Pull insights at the ad-set level, last 7d:

```bash
meta ads insights get \
  --account-id "$AD_ACCOUNT_ID" \
  --level adset \
  --time-range last_7d \
  --fields "adset_name,impressions,clicks,ctr,cpc,reach,frequency,actions,cost_per_action_type,spend" \
  --output json --limit 10
```

Track in a spreadsheet, one row per ad-set per day:

| Metric | Kerala Cold target | UAE Cold target | Warm target |
|---|---|---|---|
| CPM | $2-5 | $8-15 | $5-12 |
| CTR (link) | >1.0% | >0.9% | >1.5% |
| CPL (form fill) | **$5-10** | **$10-18** | **$4-9** |
| Frequency | <2.0 (week 1) | <2.0 | <3.5 |
| Cost per Approved Account (server CAPI) | $20-40 | $40-75 | $15-35 |

## CPL Benchmarks vs. CAC Math

Targeting freelance designers, expected behavior:

- Form fill is cheap-ish ($5-18 range above) — designers click on a clean creative.
- BUT: admin-approval gate filters ~50-60% out. Real CAC = `CPL ÷ approval_rate ÷ trial_to_paid_rate`.
- **Pricing assumption** (UNVERIFIED): $39/mo paid tier, ~12 month average retention = $468 LTV.
- Working backwards: if CAC < ~$155 (33% of LTV), unit economics work.
  - Kerala: $7 CPL ÷ 0.5 approval ÷ 0.25 trial-to-paid = **$56 CAC** → comfortable.
  - UAE: $13 CPL ÷ 0.5 ÷ 0.25 = **$104 CAC** → tight but viable.
- **CAC payback period at $39/mo**: Kerala ~1.4 months, UAE ~2.7 months. Both inside the typical 3-6 month SaaS threshold.

If pricing turns out to be $29 (not $39), cut every CAC ceiling by 25%. If $49, raise by 25%. **This math reruns the moment pricing is confirmed.**

## Kill Rules (per creative)

After 1,000 impressions on any single ad:

- **CTR < 0.7%**: pause the creative. Don't try to "give it more time" — Meta's algo has already decided.
- **CPL > 2x ad-set target after 50 impressions of form-fill events**: pause.
- **Frequency > 4.0 in week 1 with no leads**: pause — audience is saturated on a creative they're not engaging with.

After 7 days at the ad-set level:

- If ad set CPL > 1.5x target AND no creative inside it has CTR > 1.0%: kill the ad set, reallocate budget.
- If learning phase isn't exited (Meta's UI shows "Learning Limited"): consolidate creatives, do NOT add budget.

## Scaling Rules

Once we have 14 days of data AND CPL is at-or-under target:

- **Step 1 — within Kerala/UAE**: raise daily budget by 20% per week, never more. Step-function increases reset learning.
- **Step 2 — geo expansion**: only after 30 days of stable performance. Test order, with separate ad sets at $20/day each:
  1. Bangalore + Mumbai + Delhi (India tier-1 designer hubs).
  2. Saudi Arabia (Riyadh, Jeddah) — similar regulatory/audience profile to UAE.
  3. UK (London) — high English-fluency designer market, premium CPM.
  4. US (NYC, LA, SF) — only when CAC ceiling proves it. US CPM is 5-8x Kerala.
- **Step 3 — lookalikes**: at 100+ approved accounts, seed 1% LAL Kerala and 1% LAL UAE from the approved-account list (NOT the lead-fill list — lead-fillers include rejected applicants).

## Conversion API Note (CRITICAL — engineering must wire)

The form-fill `Lead` event is shallow. Meta's algo will optimize for whoever clicks fastest, which is NOT who NeoVibe's curation team approves. To fix this, fire server-side events via the Conversion API:

| Event | Trigger | Fire from |
|---|---|---|
| `Lead` | form submit | Pixel (browser) — already standard |
| `account_approved` | Clerk admin approves applicant | Server (CAPI) — NEW |
| `account_activated` | First playground action by approved user | Server (CAPI) — NEW |
| `subscription_started` | Stripe `invoice.paid` webhook | Server (CAPI) — NEW |

Match each server event to the original Lead via `event_id` (UUID generated at form submit, persisted in Clerk metadata). Without this match, Meta dedups conservatively and the deeper events get ignored.

**Engineering ticket should land before week 2 of flighting** — week 1 we're stuck optimizing on shallow form-fill. That's acceptable as a learning-phase prior; week 2+ without server CAPI is wasted spend.

## Weekly Review Cadence

- **Day 7**: Creative-level review. Pause bottom 1-2 creatives. Reallocate within existing budgets.
- **Day 14**: Ad-set decision. Geo-split if signal diverges. Switch warm to deeper optimization event.
- **Day 30**: Scaling decision. CAC vs LTV check. Lookalike seeding. Geo expansion go/no-go.
