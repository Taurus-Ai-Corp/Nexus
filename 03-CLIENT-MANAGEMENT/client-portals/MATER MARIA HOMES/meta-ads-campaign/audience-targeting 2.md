# Audience Targeting — Mater Maria Investor Campaign (v3 Geo Pivot)

> **Revised 2026-05-08 — geographic pivot from GCC to Kerala + global Malayali diaspora.** Per client direction, the campaign no longer targets GCC residents (UAE/Saudi/Qatar/Kuwait/Bahrain/Oman). Focus now:
> - **Kerala (India)** — homebase market: families investing for elderly parents, returning professionals, local high-net-worth.
> - **United States** — ~150K-200K Malayalis (Houston/Chicago/NYC/Dallas/Atlanta/SF Bay/DC/Edison-NJ).
> - **United Kingdom** — ~25K Malayalis (London/Manchester/Birmingham — NHS-heavy).
> - **Australia** — ~30K Malayalis (Sydney/Melbourne/Perth).
> - **New Zealand** — smaller diaspora, primarily Auckland.
>
> This is a structural pivot: different CPM economics (US is 3-5x more expensive than GCC was; Kerala is 5-8x cheaper), different language strategy (Malayalam locale flag works for Kerala homebase but most US/UK/AUS Malayalees use English locale on devices), and stricter HOUSING enforcement (US is the *origin* of Meta's HOUSING category — strictest enforcement in the world; UK/AUS/NZ apply equivalent civil-rights rules).
>
> All audiences continue to declare HOUSING at the campaign level (`--special-ad-categories '["HOUSING"]'`). All exclude an uploaded customer-list custom audience of existing Mater Maria depositors, employees, and clergy contacts.

---

## 1. Diaspora + Kerala — Cold (Prospecting) — HOUSING-COMPLIANT

```json
{
  "name": "MM_DiasporaAndKerala_Cold_v3_HOUSING",
  "special_ad_category": "HOUSING",
  "geo_locations": {
    "countries": ["IN", "US", "GB", "AU", "NZ"],
    "regions": [
      {"key": "Kerala", "name": "Kerala", "country": "IN"}
    ],
    "cities_with_radius_km": [
      {"name": "Houston, TX", "radius": 40},
      {"name": "Chicago, IL", "radius": 40},
      {"name": "New York, NY", "radius": 40},
      {"name": "Dallas, TX", "radius": 40},
      {"name": "Atlanta, GA", "radius": 40},
      {"name": "San Francisco Bay Area, CA", "radius": 40},
      {"name": "Washington, DC", "radius": 40},
      {"name": "Edison, NJ", "radius": 40},
      {"name": "London, UK", "radius": 40},
      {"name": "Manchester, UK", "radius": 40},
      {"name": "Birmingham, UK", "radius": 40},
      {"name": "Sydney, Australia", "radius": 40},
      {"name": "Melbourne, Australia", "radius": 40},
      {"name": "Perth, Australia", "radius": 40},
      {"name": "Auckland, New Zealand", "radius": 40}
    ],
    "location_types": ["home", "recent"]
  },
  "age_min": 18,
  "age_max": 65,
  "genders": [1, 2],
  "locales": ["ml_IN", "en_IN", "en_US", "en_GB", "en_AU", "en_NZ"],
  "targeting_logic": {
    "ALLOWED_BROAD_INTERESTS_OR": [
      { "field": "interests", "values": ["Kerala", "Malayalam cinema", "Malayalam language", "Manorama Online", "Mathrubhumi", "Asianet"] }
    ]
  },
  "exclusions": {
    "custom_audiences": ["MM_Existing_Customers_Upload", "MM_Employees_Clergy_Upload"]
  },
  "estimated_reach": "8.5M – 16.5M (Meta estimate, blended across 5 jurisdictions; Kerala anchors ~80% of raw reach, US Malayali concentrations ~10%, UK + AUS + NZ ~5% combined; remainder is widening from non-Malayali residents in those geos who match cultural-language interests).",
  "advantage_audience": false,
  "detailed_targeting_expansion": false,
  "notes": "Geographic pivot v3 (2026-05-08): replaces v2's GCC-only targeting with Kerala homebase + global Malayali diaspora (US, UK, AUS, NZ). Three implications: (1) Cost variance widens — Kerala CPL ~₹200-500, US CPL ~$10-25 (₹830-2,100), UK ~£6-14 (₹630-1,470), AUS ~A$8-18 (₹420-950), NZ ~NZ$8-15 (₹390-730). Budget-weighted blended CPL likely ₹500-1,500 if even per-country split; ₹700-1,800 if US-heavy. (2) Language strategy splits: ml_IN locale captures Kerala homebase reliably; diaspora users typically run device locale in English (en_US/en_GB/en_AU/en_NZ) so Malayalam-locale targeting alone misses them. We include both. (3) Meta's HOUSING category is enforced more strictly in US/UK/AUS than it was in GCC — US is the original 2022 HUD-Meta settlement jurisdiction. Faith-affiliation interests (Catholic Church, Syro-Malabar Catholic Church) remain EXCLUDED from the audience layer per policy-compliance.md § 1; faith expression stays in creative copy only. 'Asianet' added to the cultural anchor set — covers TV-watching diaspora across all 5 markets where Malayalam-cinema/Manorama interest IDs have variable Meta-taxonomy availability."
}
```

**Why this layering (HOUSING + diaspora version):**

- **Geo split — state-level for Kerala, city-radius for diaspora**: Kerala state region (`Kerala, IN`) captures ~30M residents which Meta narrows by other layers. City-radius targeting in US/UK/AUS/NZ captures known Malayali concentrations rather than spending on those countries broadly — Houston, Chicago, NYC and the others are where the diaspora actually lives.
- **Locales**: include Malayalam (`ml_IN`) for Kerala homebase. Add English locales for each diaspora country (`en_US`, `en_GB`, `en_AU`, `en_NZ`) because most US/UK/AUS Malayalees run their devices in English locale, not Malayalam. Including Malayalam locale alone would miss most of the diaspora.
- **Age 18-65**: Meta's HOUSING default. Cannot narrow further — same constraint as v2.
- **Cultural-language interests**: Kerala, Malayalam cinema, Malayalam language, Manorama Online, Mathrubhumi, plus Asianet (added in v3). These are language/culture anchors, NOT housing/credit/employment proxies — they survive HOUSING review in all 5 jurisdictions.
- **Exclusion list**: same first-party-data exclusions (existing customers, employees, clergy). HOUSING permits owned-data exclusions.

**VERIFY AT LAUNCH:**

- Whether all six cultural-language interest IDs (`Kerala`, `Malayalam cinema`, `Malayalam language`, `Manorama Online`, `Mathrubhumi`, `Asianet`) exist in Meta's interest taxonomy *in each of the 5 target countries* — interest availability varies. Pre-flight test: build the audience in Ads Manager, check estimated reach narrows when each interest is added/removed per country.
- Whether Meta enforces the US 15-mile / EU 17 km HOUSING radius floor uniformly in IN/AU/NZ. We default to 40 km city radii for all diaspora cities — safely above any floor.
- Per-country reach split — if US delivery dominates due to city-targeting density, lock budget by country in week 2 to avoid budget concentration in one market.

---

## 2. Site Visitors — Warm (Retargeting) — UNCHANGED FROM v2

Owned-data signals; HOUSING allows custom audiences from owned data without restriction. No geo change required at the audience level — Pixel-fired site visits from all 5 target countries flow into this audience automatically.

```json
{
  "name": "MM_SiteVisitors_Warm_60d_v3_HOUSING",
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
  "estimated_reach": "Will populate post-launch. Realistic seed: 5K–12K after week 1 of cold spend (range broader than v2's GCC estimate because diaspora cold cast is wider).",
  "notes": "All retargeting signals are first-party (own pixel, own ads, own pages). HOUSING permits custom audiences from owned data without restriction. Composition unchanged from v2 — only the parent campaign's country list differs."
}
```

---

## 3. Lead Form Openers — Hot (Retargeting) — UNCHANGED FROM v2

Owned engagement custom audience; HOUSING-allowed.

```json
{
  "name": "MM_LeadFormOpeners_NoSubmit_Hot_v3_HOUSING",
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
    "notes": "Fire from /invest when user adjusts ROI sliders or selects a tier. Highest-intent signal, fully owned data, fully HOUSING-allowed."
  },
  "exclusions": {
    "custom_audiences": ["MM_LeadFormSubmitters_All_Time", "MM_Existing_Customers_Upload"]
  },
  "estimated_reach": "Tiny — 800 to 2,500 by end of week 2. Tiny IS the point. Run frequency to 5-7/wk on this audience without guilt; these are fence-sitters who need one more nudge.",
  "notes": "Pair with the ROI-First creative variant + a soft 'still thinking it over?' angle. Frequency cap NOT applied — we want repeated touches here. HOUSING does not restrict engagement custom audiences from owned forms — composition unchanged from v2."
}
```

---

## 4. Special Ad Audience (HOUSING-restricted Lookalike equivalent) — WEEK 2+ ROLLOUT, NOW PER-COUNTRY

Under HOUSING, classic Lookalike is unavailable. Special Ad Audience is the equivalent restricted similar-audience flow (seeded from owned data, model excludes age/gender/ZIP signals). v3 splits SAA per country since seed audience now spans 5 jurisdictions.

```json
[
  {"name": "MM_SAA_LeadFormSubmitters_1pct_IN_v3", "special_ad_category": "HOUSING", "type": "special_ad_audience", "seed_audience": "MM_LeadFormSubmitters_All_Time", "lookalike_spec": {"country": "IN", "ratio": 0.01, "type": "similarity"}},
  {"name": "MM_SAA_LeadFormSubmitters_1pct_US_v3", "special_ad_category": "HOUSING", "type": "special_ad_audience", "seed_audience": "MM_LeadFormSubmitters_All_Time", "lookalike_spec": {"country": "US", "ratio": 0.01, "type": "similarity"}},
  {"name": "MM_SAA_LeadFormSubmitters_1pct_GB_v3", "special_ad_category": "HOUSING", "type": "special_ad_audience", "seed_audience": "MM_LeadFormSubmitters_All_Time", "lookalike_spec": {"country": "GB", "ratio": 0.01, "type": "similarity"}},
  {"name": "MM_SAA_LeadFormSubmitters_1pct_AU_v3", "special_ad_category": "HOUSING", "type": "special_ad_audience", "seed_audience": "MM_LeadFormSubmitters_All_Time", "lookalike_spec": {"country": "AU", "ratio": 0.01, "type": "similarity"}},
  {"name": "MM_SAA_LeadFormSubmitters_1pct_NZ_v3", "special_ad_category": "HOUSING", "type": "special_ad_audience", "seed_audience": "MM_LeadFormSubmitters_All_Time", "lookalike_spec": {"country": "NZ", "ratio": 0.01, "type": "similarity"}}
]
```

**Build sequence:**
- Week 1: skip — not enough seed submitters yet.
- Week 2 (≥100 submitters total): build SAA 1% per country, starting with the 2-3 markets that delivered the most leads in week 1 (typically IN + US for this audience profile). Launch each as its own ad set at currency-localized ₹1,500/day equivalent.
- Week 3: build SAA 2% in winning markets if 1% performs within 1.3x of cold ad set CPL.
- Week 4: SAA 5% for upper-funnel volume scaling, in top markets only.

---

## Cross-Audience Notes (HOUSING-aware, v3 geo)

- **HOUSING enforcement strictness varies by country**: US is strictest (origin jurisdiction); UK applies the Equality Act 2010 framework; AUS the Racial Discrimination Act 1975 + Australian Privacy Principles; NZ the Human Rights Act 1993; India enforcement is more lenient at the regulatory level but Meta applies HOUSING globally for any account that touches US user data. Treat HOUSING as mandatory across all 5.
- **Detailed Targeting Expansion**: Meta force-disables under HOUSING. Confirm OFF on all ad sets via manual review before unpausing.
- **Advantage+ Placements**: ON for all audiences. HOUSING does not restrict placements.
- **Language strategy**: Malayalam (`ml_IN`) is most reliable for Kerala homebase. Diaspora users mostly run English locales — rely on cultural-language interest layers + city-radius targeting for diaspora qualification rather than locale alone.
- **Existing customer exclusion**: upload via CSV before launch. Hash on email + phone (E.164). Refresh monthly.
- **Lookalike → Special Ad Audience**: anywhere campaign-brief or KPI dashboard says "Lookalike" / "LAL", read as "Special Ad Audience (SAA)" under HOUSING.
- **CPL variance is much wider in v3 than v2** — Kerala is 5-8x cheaper than US. Plan budget allocation by country (don't let auto-optimization drift all spend to cheapest country, which would skew lead quality toward homebase-only). Recommended week-1 budget split: 40% IN, 30% US, 15% UK, 10% AU, 5% NZ — adjust in week 2 based on lead quality (SQL conversion rate by country).
- **Currency**: campaign-brief and CLI commands use INR for the buyer (Mater Maria is Indian-incorporated). Reporting to client should show per-country breakdown in local currency (USD/GBP/AUD/NZD) for clarity.
- **US +1 phone handling has changed status**: under v2 (GCC focus), `+1` numbers were edge-case snowbirds. Under v3, US is a primary target market — expect ~30% of leads to provide `+1` numbers. Meta's marketing-template block on `+1` (since 2025-04-01) means the WhatsApp bot CANNOT send outbound to US leads; they MUST route to manual sales follow-up. This is now the primary lead-handling path for ~30% of v3 lead volume, not an edge case. Sales-desk capacity planning required. See `whatsapp-bot-flow.md § 5` and `policy-compliance.md § 3`.
