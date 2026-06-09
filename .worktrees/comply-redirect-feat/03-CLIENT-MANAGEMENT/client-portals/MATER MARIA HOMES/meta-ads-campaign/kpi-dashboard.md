# KPI Dashboard — Mater Maria Meta Ads

## Targets (Week 1 baseline — HOUSING-mode revised)

> Revised 2026-05-07. Original v1 CPL targets (₹400-₹700 form / ₹900-₹1,400 web) assumed demographic targeting that HOUSING prohibits. v2 figures below reflect 1.5-2x inflation from forced audience widening. CTR also revised down: broader cast → less self-selecting traffic → lower click-through, but creative qualification still works.

| Metric | Target | Investigate if |
|---|---|---|
| CPM | ₹400-₹900 GCC | > ₹1,200 |
| CTR (link) | 1.0% - 1.8% | < 0.7% |
| CPL — Instant Form | ₹600-₹1,400 | > ₹2,000 |
| CPL — /invest website | ₹1,400-₹2,800 | > ₹4,000 |
| Frequency (week 1) | 1.2 - 2.5 | > 4.0 |
| Hook rate (3-sec view, video) | > 30% | < 18% |

## Daily Checks (9 AM IST, takes 8 minutes)

1. **CPM trend** — flag any ad set ±25% off baseline.
2. **CTR by creative** — sort the five variants. Bottom-two killed at end of week 1.
3. **CPL by ad set** — Cold should be cheapest, Hot most expensive but highest LTV.
4. **Frequency** — if Hot crosses 5.0 mid-week 1 it is fine (small audience by design); Cold > 3.0 in week 1 is a red flag.
5. **Pixel + CAPI match quality** — must stay Good (7.0+). One bad day is normal; two consecutive bad days = engineering ticket.

## Kill Rules (Hard, Automatic)

- **Per-ad kill:** any ad with CPL > 3x target after 50 leads delivered → pause.
- **Frequency kill:** any ad set with frequency > 4.0 in week 1 → pause, refresh creative.
- **CTR kill:** any ad with CTR < 0.8% across 8,000+ impressions → pause.
- **Total spend kill:** if week-1 spend hits ₹50K and total leads < 20, pause everything, audit the Pixel + Lead Form, do not push more budget into a misconfigured funnel. (Revised from <30 to <20 to reflect HOUSING-mode CPL inflation — at ₹1,400 blended CPL, ₹50K should produce ~35 leads; <20 means real funnel breakage, not HOUSING tax.)

## Scaling Rules (Apply From Day 8)

- Bump winning ad set daily budget by **+20% every 3-4 days** as long as CPL stays within 1.3x of week-1 HOUSING-mode baseline (₹600-₹1,400).
- When a single ad set crosses 100 leads at target CPL, **duplicate it** with a fresh ID (CBO learning reset hack) to expand spend without compressing performance.
- After 14 days, build **Special Ad Audience 1% / 2% / 5%** seeded from `MM_LeadFormSubmitters_All_Time` (HOUSING replaces classic Lookalike with the restricted Special Ad Audience flow — same seed, age/gender/ZIP excluded from the model, ~20-40% smaller match). Launch as three new ad sets at ₹1,500/day each per top-performing GCC country. Roll the winners into steady-state spend.

## Weekly Stakeholder Email Template (bullets only)

Subject: *Mater Maria Meta Ads — Week N report*

- Spend this week: ₹XX,XXX. MTD: ₹XX,XXX of ₹X,XX,XXX budget.
- Leads delivered: XX (week) / XX (MTD). Blended CPL: ₹XXX.
- SQL conversion (sales desk): XX of XX leads = XX%. Best-performing tier: Silver / Gold / Diamond / Platinum.
- Top creative: V_ ("Angle name") at ₹XXX CPL, X.XX% CTR.
- Killed: V_ (reason). Replaced with: V_-v2 (variant of winner).
- Actions next week: scale Cold +20%, launch SAA 1% (HOUSING-compliant Special Ad Audience), refresh V_ visual.
- Pixel + CAPI match quality: Good (X.X). No engineering issues.
- Open question for client: [one specific question — e.g., approve bishop close-up creative for V3]

## Week 2-4 Evolution Roadmap

- **Week 2:** add SAA 1% of submitters as a fourth ad set (Special Ad Audience — HOUSING's restricted Lookalike equivalent). Pause bottom-two creatives. Begin video shoots based on top static angle (priority: V1 Legacy or V4 Healthcare — emotionally richest in motion).
- **Week 3:** launch first video creative (15s vertical). Add SAA 2% ad set. Begin separating GCC by country if any one country clearly outperforms (UAE typically does first in Malayali campaigns).
- **Week 4:** introduce SAA 5% for upper-funnel volume. Test a stripped-back "no-ROI, all-emotion" ad against the data-led V2 to see whether the top of the funnel responds better to feeling than to math. Build a Reels-native creative — often 30-50% cheaper CPM in MENA than Feed by week 4.
- **End of month 1:** full retro. Decide whether to scale to ₹4.5L/month or hold at ₹3L. Decision gate: blended CPL within 1.3x of HOUSING-mode week-1 baseline (₹600-₹1,400) + SQL rate ≥ 8%.
