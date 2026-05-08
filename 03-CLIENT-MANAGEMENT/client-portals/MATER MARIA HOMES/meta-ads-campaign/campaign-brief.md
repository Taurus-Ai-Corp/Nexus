# Campaign Brief — Mater Maria NRI Investor Lead Gen Q2 2026

> **HOUSING Special Ad Category — declared at campaign level.** This campaign promotes a residential-real-estate-backed share program; Meta classifies it as HOUSING. Implications cascade through audience design and CPL economics — see `audience-targeting.md` (rebuilt v2) and the revised CPL benchmarks in §Pacing and §Learning Phase Exit Criteria below. The ₹400-₹700 CPL target from the original blueprint is no longer applicable; expect ₹600-₹1,400 (1.5-2x inflation) due to HOUSING-forced audience widening.

## Objective

Generate qualified investor leads for the four-tier share program (Silver ₹5L → Platinum ₹30L) from Malayali NRIs working in the GCC. Primary conversion is a form fill on `/invest` (full ROI calculator + tier selection). A Meta-hosted **Instant Lead Form** runs as the fallback/parallel path so we capture intent even from users on slow connections or who bounce from the landing page. Post-submit, leads route to Firebase + Supabase, then to the Mater Maria sales desk (Rajeev Abraham primary, Thomas Abraham secondary), with Fr. Mathew Puthumana looped in for diaspora-faith-context inquiries.

## Funnel Stage — Cold + Warm + Hot Stack

- **Cold prospecting** (~65% spend): GCC adults 18-65, locale-filtered to Malayalam + English, narrowed by allowable cultural-language interest cluster (Kerala, Malayalam cinema/language, Manorama, Mathrubhumi). HOUSING removes the demographic layers v1 relied on (age 40-65 band, Expat behaviors, retirement/finance/real-estate interests) — broader cast, sharper creative does the qualification work. See `audience-targeting.md § 1`.
- **Warm retargeting** (~25%): /invest visitors last 60 days, video viewers ≥50%, Instagram engagers last 90 days. Owned-data signals — unchanged by HOUSING.
- **Hot retargeting** (~10%): Lead-form openers who didn't submit, plus ROI-calculator interactors fired via Pixel custom event. Owned-data — unchanged by HOUSING.

## Optimization Event — LEADS vs CONVERSIONS

Recommend **LEAD_GENERATION objective with optimization for LEADS** at launch using the Meta Instant Form as the primary on-platform conversion. Reasoning: until the Pixel + CAPI on `/invest` is verified to fire `Lead` reliably across Safari iOS (where most GCC users live), website CONVERSIONS optimization will misfire and waste the first ₹15K of spend in the learning phase. After 7 days of clean Pixel data, duplicate the campaign with **OUTCOME_LEADS / website conversions** and run head-to-head — keep the winner.

## Bid Strategy

Launch with **Lowest Cost (no bid cap)** so Meta can find the cheapest qualified leads and exit learning phase quickly. After 50+ conversions per ad set, switch the cold ad set to **Cost Cap** at 1.2x the observed CPL to defend unit economics as we scale. Never use Bid Cap for lead gen at this volume — too brittle.

## Pacing & Daily Budget

- **Cold ad set:** ₹4,000/day (~$48 / AED 175)
- **Warm retargeting ad set:** ₹2,000/day (~$24 / AED 88)
- **Hot retargeting ad set:** ₹1,200/day (~$14 / AED 53)
- **Test phase total:** ₹50,400 over 7 days (~$605 / AED 2,200)
- Daily budgets, not lifetime — gives more pacing flexibility and easier kill rules. Standard delivery, not accelerated.

## Learning Phase Exit Criteria

50 optimization events per ad set within a rolling 7-day window. Until that threshold is hit, **no creative swaps, no audience edits, no budget changes >20%** — every edit resets learning. The cold ad set should hit 50 leads in **9-14 days at ₹600-₹1,400 CPL** (HOUSING-mode estimate; v1's 6-9 day / ₹400-₹700 figure assumed targetable demographics that Meta no longer permits). Warm and hot will take longer due to smaller pools, which is expected.

## Test → Scale Plan (2-week test → 4-week scale)

- **Week 1:** Launch all 5 creatives flat across cold ad set. Daily eyeball at 9 AM IST.
- **End of week 1:** Pause bottom 2 creatives by CTR + CPL. Keep top 3.
- **Week 2:** Add **Special Ad Audience 1%** of lead-form submitters as a fourth ad set (small budget, ₹1,500/day). Under HOUSING, classic Lookalike is unavailable — Special Ad Audience is the equivalent restricted similar-audience flow (seeded from owned data, but model excludes age/gender/ZIP signals). Match size typically 20-40% smaller than classic LAL. Build per-country (UAE, Saudi, Qatar) once ≥100 submitters land. Begin video creative shoots.
- **Weeks 3-4:** Scale winning ad set by +20% every 3-4 days as long as CPL stays within 1.3x of HOUSING-mode baseline (₹600-₹1,400). Introduce SAA 2% and 5% ad sets. Total monthly spend climbs to ₹3-4.5L; expected lead volume ~50-65% of v1's pre-HOUSING projection at the inflated CPL — re-budget against revised lead-volume targets in `kpi-dashboard.md`.

## Pixel & Conversion API Requirements (NON-NEGOTIABLE)

- Standard events on `/invest`: `PageView`, `ViewContent` (on tier card hover), `Lead` (on form submit), `CompleteRegistration` (on full ROI calculator interaction + email capture).
- **Conversion API server-side** is mandatory — iOS 14.5+ has gutted client-side Pixel reliability; without CAPI, optimization is blind for ~40% of GCC Apple users.
- Match quality target: **Good (7.0+)** — pass hashed email, phone (E.164), country, city, FBC/FBP cookies.
- Test events before flipping any ad set off PAUSED. Use Events Manager → Test Events.

## Catalog Needs

None. This is lead-gen, not catalog/DPA. Skip Commerce Manager entirely for this campaign.
