# Audience Targeting — Mater Maria NRI Investor Campaign (HOUSING-Compliant Rebuild)

> **Revised 2026-05-07 under Meta Special Ad Category: HOUSING.** The campaign declares `--special-ad-categories '["HOUSING"]'` at creation (see `cli-commands.sh § 1`). HOUSING strips out detailed-demographic, behavior-based, and housing/credit/employment-proxy targeting — the audiences below are rebuilt to comply. Original v1 (Expat behavior + retirement/finance interests + 40-65 age band) **would have been rejected by Meta review**.
>
> **Reach trade-off:** the cold pool widens 4-8x compared to v1 because Meta forces a broader cast. CPL inflates correspondingly (₹600-₹1,400 expected vs. v1's ₹400-₹700). Volume per ₹ is the cost of HOUSING compliance.
>
> All three audiences exclude an uploaded customer-list custom audience of existing Mater Maria depositors, employees, and clergy contacts (first-party data exclusions remain allowed under HOUSING).

---

## 1. GCC NRI — Cold (Prospecting) — HOUSING-COMPLIANT

```json
{
  "name": "MM_GCC_NRI_Cold_v2_HOUSING",
  "special_ad_category": "HOUSING",
  "geo_locations": {
    "countries": ["AE", "SA", "QA", "KW", "BH", "OM"],
    "location_types": ["home", "recent"],
    "city_radius_km_min": 25
  },
  "age_min": 18,
  "age_max": 65,
  "genders": [1, 2],
  "locales": ["ml_IN", "en_IN", "en_GB", "en_US"],
  "targeting_logic": {
    "ALLOWED_BROAD_INTERESTS_OR": [
      { "field": "interests", "values": ["Kerala", "Malayalam cinema", "Malayalam language", "Manorama Online", "Mathrubhumi"] }
    ]
  },
  "exclusions": {
    "custom_audiences": ["MM_Existing_Customers_Upload", "MM_Employees_Clergy_Upload"]
  },
  "estimated_reach": "8M–15M (Meta estimate, GCC-wide; Malayalam-locale filter is the primary narrowing signal under HOUSING constraints)",
  "advantage_audience": false,
  "detailed_targeting_expansion": false,
  "notes": "HOUSING removes every layer that made v1 sharp. What's left is essentially: GCC-located + Malayalam-speaking + culturally Kerala-aware. We intentionally KEEP the cultural-language interest cluster (Kerala, Malayalam cinema/language, Manorama, Mathrubhumi) because these are language/culture anchors, NOT housing/credit/employment proxies — they survive HOUSING review. Faith-affiliation interests (Catholic Church, Syro-Malabar Catholic Church) are EXCLUDED from the audience layer per policy-compliance.md § 1; faith expression is reserved for creative copy and is not used as a delivery filter."
}
```

**Why this layering (HOUSING version):**

- **Geo + 25 km radius**: HOUSING enforces a 15-mile (24 km) minimum location radius. Setting 25 km gives us safety margin and matches realistic commute/lifestyle clusters around Dubai, Doha, Riyadh, etc.
- **Locale (ml_IN)**: the most reliable HOUSING-legal signal for "Malayalee" — Meta classifies device/account language as user preference, not protected demographic.
- **Age 18-65**: Meta's HOUSING default — cannot narrow further. The 40-65 band from v1 is not enforceable; treat lower-band budget waste as the cost of compliance.
- **Cultural-language interests as OR cluster**: optional but useful — viewers of Malayalam media in GCC are 5-10x more likely to be Malayalee NRIs than the broad geo+locale alone. Keeping this layer light (interests only, no behaviors) reduces flag risk.

**VERIFY AT LAUNCH:**

- Whether Meta enforces the US 15-mile radius floor in GCC delivery, or applies regional rules. Pre-flight with the Meta account rep recommended.
- Whether `Manorama Online` and `Mathrubhumi` interest IDs exist in the Meta interest taxonomy as of 2026 — these have been removed from interest libraries periodically; if rejected, fall back to broader anchors (`Kerala`, `Malayalam language` are stable).

---

## 2. Site Visitors — Warm (Retargeting) — HOUSING-COMPLIANT

```json
{
  "name": "MM_SiteVisitors_Warm_60d_v2_HOUSING",
  "special_ad_category": "HOUSING",
  "type": "website_custom_audience",
  "rules": {
    "OR": [
      { "event": "PageView", "url_contains": "/invest", "retention_days": 60 },
      { "event": "ViewContent", "retention_days": 60 },
      { "event": "InstantExperienceClicks", "retention_days": 60 }
    ]
  },
  "additional_layered_audiences_OR": [
    { "type": "video_viewers", "criterion": "ThruPlay or 50%+ watched", "video_ids": ["<all campaign video ad creative IDs>"], "retention_days": 60 },
    { "type": "ig_engagers", "page_id": "<MaterMariaSanctuary_IG>", "retention_days": 90 },
    { "type": "fb_engagers", "page_id": "<MaterMariaSanctuary_FB>", "retention_days": 90 }
  ],
  "exclusions": {
    "custom_audiences": [
      "MM_LeadFormSubmitters_All_Time",
      "MM_Existing_Customers_Upload"
    ]
  },
  "estimated_reach": "Will populate post-launch. Realistic seed: 8K–15K after week 1 of cold spend (similar to v1 — owned-data signals are HOUSING-allowed and unaffected by the targeting reform).",
  "notes": "All retargeting signals here are first-party (own pixel, own ads, own pages). HOUSING permits custom audiences from owned data without restriction — no demographic re-stacking is allowed on top, but we weren't doing any. Audience composition unchanged from v1; only the campaign-level HOUSING flag differs."
}
```

---

## 3. Lead Form Openers — Hot (Retargeting) — HOUSING-COMPLIANT

```json
{
  "name": "MM_LeadFormOpeners_NoSubmit_Hot_v2_HOUSING",
  "special_ad_category": "HOUSING",
  "type": "engagement_custom_audience",
  "source": "instant_form",
  "rules": {
    "INCLUDE": [
      { "event": "lead_form_opened", "form_ids": ["<MM_Investor_LeadForm_v1>"], "retention_days": 90 }
    ],
    "EXCLUDE": [
      { "event": "lead_form_submitted", "form_ids": ["<MM_Investor_LeadForm_v1>"], "retention_days": 90 }
    ]
  },
  "additional_signal_OR": {
    "pixel_custom_event": "ROICalculatorInteracted",
    "retention_days": 30,
    "notes": "Fire this from /invest when user adjusts ROI sliders or selects a tier. Highest-intent signal we have — and fully owned data, fully HOUSING-allowed."
  },
  "exclusions": {
    "custom_audiences": ["MM_LeadFormSubmitters_All_Time", "MM_Existing_Customers_Upload"]
  },
  "estimated_reach": "Tiny — 800 to 2,500 by end of week 2. Tiny IS the point. Run frequency to 5-7/wk on this audience without guilt; these are fence-sitters who need one more nudge.",
  "notes": "Pair this audience with the ROI-First creative variant + a soft 'still thinking it over?' angle. Frequency cap NOT applied — we want repeated touches here. HOUSING does not restrict engagement custom audiences from owned forms — composition unchanged from v1."
}
```

---

## 4. Special Ad Audience (HOUSING-restricted Lookalike equivalent) — WEEK 2+ ROLLOUT

```json
{
  "name": "MM_SAA_LeadFormSubmitters_1pct_v2_HOUSING",
  "special_ad_category": "HOUSING",
  "type": "special_ad_audience",
  "seed_audience": "MM_LeadFormSubmitters_All_Time",
  "lookalike_spec": {
    "country": "AE",
    "ratio": 0.01,
    "type": "similarity"
  },
  "notes": "Under HOUSING, classic Lookalike Audience is unavailable. Meta replaces it with the Special Ad Audience (older terminology) / restricted Advantage+ similar-audience flow. The seed (own lead-form submitters) is allowed; the model is just barred from using age/gender/ZIP signals. Match size is typically 20-40% smaller than classic LAL at the same percentage. Build per-country (one SAA seed per major GCC country) once we have ≥100 lead-form submitters, expected end of week 2."
}
```

**Build sequence:**
- Week 1: skip — not enough seed submitters yet.
- Week 2 (≥100 submitters): build SAA 1% per country (UAE, Saudi, Qatar — top 3 by submitter volume). Launch each as its own ad set at ₹1,500/day.
- Week 3: build SAA 2% if 1% is performing within 1.3x of cold ad set CPL.
- Week 4: SAA 5% for upper-funnel volume scaling.

---

## Cross-Audience Notes (HOUSING-aware)

- **Special Ad Category declaration:** ALL ad sets inherit HOUSING from the campaign-level flag. Nothing additional to set per-audience; Meta enforces the constraint downstream.
- **Detailed Targeting Expansion:** Meta force-disables under HOUSING. Confirm OFF on all ad sets via a manual review pass before unpausing.
- **Advantage+ Placements:** ON for all audiences (let Meta optimize FB Feed, IG Feed, IG Stories, Reels — exclude Audience Network and Right Column). HOUSING does not restrict placements, only audience-targeting layers.
- **Language targeting:** Malayalam (`ml_IN`) included where available in Meta's locale list; English locales added because GCC professionals interact in English on social. Malayalam phrases used as accents inside English creative copy — see `creative-variants.md`.
- **Existing customer exclusion list:** upload via CSV before launch. Hash on email + phone (E.164). Refresh monthly. HOUSING permits owned-data exclusion lists without restriction.
- **Lookalike → Special Ad Audience naming:** anywhere the campaign-brief or KPI dashboard says "Lookalike" / "LAL", read as "Special Ad Audience (SAA)" under HOUSING. Math is similar; performance modestly degraded; legality is the gate.
- **Audience size reality check:** v2 cold reach (8M-15M) is intentionally broader than v1 (1.6M-2.4M). The trade-off is more impressions reaching non-Malayalee GCC residents, with creative selection (Malayalam phrases, Kerala visual language, Bishop trust-stack) doing the qualification work that audience targeting used to. Plan for week-1 CTR to be lower (target 1.0-1.8% rather than 1.5-2.5%) and CPL higher (₹600-₹1,400 rather than ₹400-₹700). Both are fine outcomes for a HOUSING-mode launch.
