# Mater Maria Sanctuary — Meta Ads Campaign Blueprint

**Status:** Blueprint only. Nothing live. All CLI commands ship with `--status PAUSED`.
**Scope:** Lead generation for the share-based investor program at https://matermariahomes.com/invest
**Audience (v3 — 2026-05-08 geo pivot):** Kerala homebase + global Malayali diaspora across United States, United Kingdom, Australia, New Zealand. HOUSING-mandated age range 18-65 (cannot narrow). See `audience-targeting.md` for layered targeting under HOUSING constraints.

## Campaign Objective

Drive qualified investor leads (Silver/Gold/Diamond/Platinum tiers, ₹5L-₹30L) into the funnel via Meta Lead Forms + on-site form fills. The campaign sells *legacy plus return*, not real estate — share capital + 10% interest + dividends + a Kerala home for the next chapter.

## Recommended Budget

- **Test phase (Week 1-2):** ₹50,000 total (~$600 / AED 2,200) split across three ad sets.
- **Steady-state monthly:** ₹3,00,000 to ₹4,50,000 / month (~$3,600-$5,400 / AED 13,200-19,800) once learning phase exits.
- Cold prospecting carries ~65% of spend, retargeting ~25%, hot lead-form openers ~10%.

## Expected Lead Volume

- **Test phase target CPL (HOUSING-mode + v3 geo blended):** ₹600-₹1,400 (Meta Lead Form), ₹1,400-₹2,800 (on-site /invest conversions). Per-country variance is wide: Kerala ~₹200-500, US ~$10-25, UK ~£6-14, AUS ~A$8-18, NZ ~NZ$8-15. See `kpi-dashboard.md` for breakdown.
- **Week 1 leads:** 35-80 raw leads at blended ~₹900 CPL (lower volume than v2's GCC-only estimate due to HOUSING-mode audience widening + multi-currency CPM averaging).
- **Steady-state:** 250-500 leads/month — of which roughly 8-15% will be sales-qualified investor inquiries (20-75 SQLs). US-derived leads carry highest LTV per ticket; Kerala-derived leads carry highest volume per spend.

## File Index

| File | Purpose |
|------|---------|
| `campaign-brief.md` | Full media-buyer plan: objective, optimization, bid strategy, learning phase, scaling. |
| `audience-targeting.md` | Three saved audiences (Cold / Warm / Hot) with layered logic and exclusions. |
| `creative-variants.md` | Five distinct ad angles with hooks, primary text, visual briefs. |
| `cli-commands.sh` | Executable bash blueprint. PAUSED-only. `# VERIFY:` notes where CLI flags are unconfirmed. |
| `kpi-dashboard.md` | Week 1 monitoring rules, kill rules, weekly client report template, week 2-4 evolution. |

## What To Do Next

1. **Install and authenticate the CLI**: `pip install meta-ads`, then export `ACCESS_TOKEN` and `AD_ACCOUNT_ID` (`act_NNNN…` format). Verify the CLI flag names against the installed version and resolve every `# VERIFY:` comment in `cli-commands.sh`.
2. **Stand up the Pixel + Conversion API** on `/invest` with events for `Lead`, `CompleteRegistration`, and `ViewContent` before going live — without server-side events the LEADS optimization will under-deliver.
3. **Approve creative + legal**: confirm the bishop's likeness usage with the Patron's office, run all five copy variants past Rajeev Abraham, and have the Meta Lead Form questions reviewed by counsel for INR/USD/GBP/AUD/NZD disclosure language across the 5 target jurisdictions.
