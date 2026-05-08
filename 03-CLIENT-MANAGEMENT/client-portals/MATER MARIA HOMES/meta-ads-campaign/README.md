# Mater Maria Sanctuary — Meta Ads Campaign Blueprint

**Status:** Blueprint only. Nothing live. All CLI commands ship with `--status PAUSED`.
**Scope:** Lead generation for the share-based investor program at https://matermariahomes.com/invest
**Audience:** Malayali NRI diaspora across UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman — ages 40-65.

## Campaign Objective

Drive qualified investor leads (Silver/Gold/Diamond/Platinum tiers, ₹5L-₹30L) into the funnel via Meta Lead Forms + on-site form fills. The campaign sells *legacy plus return*, not real estate — share capital + 10% interest + dividends + a Kerala home for the next chapter.

## Recommended Budget

- **Test phase (Week 1-2):** ₹50,000 total (~$600 / AED 2,200) split across three ad sets.
- **Steady-state monthly:** ₹3,00,000 to ₹4,50,000 / month (~$3,600-$5,400 / AED 13,200-19,800) once learning phase exits.
- Cold prospecting carries ~65% of spend, retargeting ~25%, hot lead-form openers ~10%.

## Expected Lead Volume

- **Test phase target CPL:** ₹400-₹700 (Meta Lead Form), ₹900-₹1,400 (on-site /invest conversions).
- **Week 1 leads:** 60-110 raw leads at ~₹500 blended CPL.
- **Steady-state:** 350-650 leads/month — of which roughly 8-15% will be sales-qualified investor inquiries (28-95 SQLs).

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
3. **Approve creative + legal**: confirm the bishop's likeness usage with the Patron's office, run all five copy variants past Rajeev Abraham, and have the Meta Lead Form questions reviewed by counsel for AED/USD/INR disclosure language.
