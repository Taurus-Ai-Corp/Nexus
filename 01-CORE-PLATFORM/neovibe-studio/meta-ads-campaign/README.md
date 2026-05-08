# NeoVibe — Meta Ads Campaign Blueprint

**Status**: BLUEPRINT ONLY — no ads will run. All CLI commands ship `--status PAUSED`.
**Owner**: TAURUS AI Corp / NeoVibe operating brand
**Author intent**: Lead-gen test for freelance designers + small studios in Kerala (IN) and UAE.
**Quarter**: Q2 2026

---

## ASSUMPTIONS TO VALIDATE BEFORE LAUNCH

These are gaps in available context. Do NOT unpause campaigns until each is resolved:

1. **Pricing tier is unconfirmed.** Plan assumes freemium with a paid tier at ~$29-49/month. CAC math, kill rules, and budget all depend on this. Confirm actual price points and trial length before flighting.
2. **Funnel mechanic is unconfirmed.** Don't yet know if free trial signup is wired through Clerk + billing. Default objective is **Lead Generation (instant form)** — no dependency on Stripe/Clerk billing being live. Switch to Conversions/free-trial only when signup-to-trial is verified end-to-end.
3. **Landing/destination URL is unconfirmed.** Assumes `https://neovibe.taurusai.io`. Confirm the canonical URL, that the Pixel + Conversion API are firing, and that the page loads <2s on mid-tier mobile in Kochi/Dubai.
4. **Admin-approval gate stretches the funnel.** Signup is curated (not open). Lead → approved-account → activated-paid is days-to-weeks, not minutes. CPL targets and learning-phase economics in `kpi-dashboard.md` reflect this. Conversion API server events for `account_approved` and `account_activated` are CRITICAL for the algo to learn — flag this for engineering before unpause.

---

## Executive Summary

- **Objective**: Lead form fills (Meta-hosted instant form). Upgrade to free-trial Conversions once billing is wired.
- **Audience**: Freelance designers and 2-5-person studios, age 25-40, in Kerala (Kochi/Trivandrum/Kozhikode/Thrissur) and UAE (Dubai/Abu Dhabi/Sharjah). Layered Figma/Adobe CC/Webflow/Framer interests + small-business-owner behaviors.
- **Budget recommendation**: **$1,800/month total** for the first month ($60/day across 3 ad sets). Sits inside the $1,500-$3,000 SaaS-test envelope — wide enough to escape learning phase on the warm set, tight enough that a bad creative isn't catastrophic.
- **Expected lead volume**: **120-260 leads/month** at a CPL of $7-$15 (Kerala cheaper, UAE pricier). Wide range deliberate — designer-targeted CPL on Meta varies 3x between Kerala and Dubai feeds.
- **Test horizon**: 14 days at $60/day before any scale decision. Geo-split (Kerala-only vs UAE-only) only if signal materially diverges.

---

## File Index

| File | Purpose |
|---|---|
| `README.md` | This file. Exec summary + assumptions. |
| `campaign-brief.md` | Full media-buyer plan. Objective, funnel, pacing, learning phase, conversion API requirements. |
| `audience-targeting.md` | Three saved audiences (Kerala cold, UAE cold, warm retargeting) with layered logic + exclusions. |
| `creative-variants.md` | Five ad variants with hooks, primary text, CTAs, visual briefs. |
| `cli-commands.sh` | Bash script: 1 campaign + 3 ad sets + 5 ads. All PAUSED. |
| `kpi-dashboard.md` | Week-1 monitoring plan, kill rules, scaling triggers. |

---

## What To Do Next

- **Validate the 4 assumptions above.** Pricing, signup wiring, landing URL, conversion API. Do not unpause without all four.
- **Provision a separate Meta ad account.** Don't co-mingle NeoVibe spend with Mater Maria — different audiences, different attribution windows, different LTV. Set `AD_ACCOUNT_ID` to the new `act_NNNNN` before running `cli-commands.sh`.
- **Review `creative-variants.md` with one freelance designer in Kerala AND one in Dubai before flighting.** Five minutes of qualitative feedback will catch the marketing-speak this brief is trying to avoid. Designers smell BS in 1.5 seconds.
