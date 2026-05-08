# NeoVibe — Audience Targeting

Three saved audiences. All exclude an uploaded **Customer List** custom audience (`neovibe_existing_users.csv` — emails of approved users + paying customers). Existing-user list must be hashed before upload (Meta does this client-side via the standard hashed-CSV flow).

---

## 1. Kerala Designers — Cold

```jsonc
{
  "name": "Kerala Designers — Cold",
  "geo": {
    "countries": ["IN"],
    "cities": [
      { "name": "Kochi",       "region": "Kerala", "radius_km": 25 },
      { "name": "Trivandrum",  "region": "Kerala", "radius_km": 25 },
      { "name": "Kozhikode",   "region": "Kerala", "radius_km": 20 },
      { "name": "Thrissur",    "region": "Kerala", "radius_km": 20 }
    ],
    "location_type": ["home", "recent"]
  },
  "demographics": {
    "age_min": 25,
    "age_max": 40,
    "languages": ["English", "Malayalam"]
  },
  "detailed_targeting": {
    "and": [
      {
        "or_interests": [
          "Figma (software)",
          "Adobe Creative Cloud",
          "Webflow",
          "Framer (software)",
          "Graphic design",
          "User experience design",
          "Web design"
        ]
      },
      {
        "or_behaviors": [
          "Small business owners",
          "Online purchase: design tools",
          "Frequent travelers"
        ]
      }
    ]
  },
  "exclusions": {
    "custom_audiences": ["neovibe_existing_users"],
    "interests": ["Students (university)"]
  },
  "estimated_reach_note": "Likely 80K-150K monthly active. Kerala designer pool is small but dense — avoid widening radius, signal degrades fast outside the 4 cities."
}
```

**Logic**: AND'd interest stack ensures we hit people who self-identify with at least one design tool, layered with a behavior signal that filters for working professionals (not students copying Figma tutorials). `Frequent travelers` is the cheap proxy for the Kerala-to-Gulf freelancer slice — many serve UAE clients remotely.

---

## 2. UAE Designers — Cold

```jsonc
{
  "name": "UAE Designers — Cold",
  "geo": {
    "countries": ["AE"],
    "cities": [
      { "name": "Dubai",     "radius_km": 30 },
      { "name": "Abu Dhabi", "radius_km": 25 },
      { "name": "Sharjah",   "radius_km": 20 }
    ],
    "location_type": ["home", "recent"]
  },
  "demographics": {
    "age_min": 25,
    "age_max": 40,
    "languages": ["English", "Arabic", "Hindi", "Malayalam"]
  },
  "detailed_targeting": {
    "and": [
      {
        "or_interests": [
          "Figma (software)",
          "Adobe Creative Cloud",
          "Webflow",
          "Framer (software)",
          "Graphic design",
          "User experience design",
          "Branding",
          "Freelance"
        ]
      },
      {
        "or_behaviors": [
          "Small business owners",
          "Online purchase: design tools",
          "Expats (lived in UAE / from India)",
          "Expats (lived in UAE / from Philippines)",
          "Engaged shoppers"
        ]
      }
    ]
  },
  "exclusions": {
    "custom_audiences": ["neovibe_existing_users"],
    "interests": ["Students (university)"]
  },
  "estimated_reach_note": "Likely 200K-350K monthly active. Higher CPM than Kerala (3x typical). The expat-from-India layer is intentional — that's a high-fit slice for NeoVibe given Kerala-Gulf design freelance corridor."
}
```

**Logic**: Wider language stack reflects UAE's actual designer market. Expat behavior filters bring CPM down vs untargeted UAE — and they over-index on Kerala/Indian freelancers who already know Figma + work cross-border. `Engaged shoppers` is added (vs Kerala) because UAE Meta auction is more competitive and we need the algo to find people likely to take a CTA action.

---

## 3. Site Visitors — Warm Retargeting

```jsonc
{
  "name": "NeoVibe Warm — Site Visitors + Video Engagers (30d)",
  "type": "custom_audience",
  "sources": [
    {
      "type": "website",
      "rule": "URL contains: neovibe.taurusai.io",
      "retention_days": 30
    },
    {
      "type": "video",
      "rule": "Watched 25% or more",
      "video_ids": ["<all NeoVibe video creatives from this campaign>"],
      "retention_days": 30
    },
    {
      "type": "instagram_engagement",
      "rule": "Engaged with NeoVibe IG profile or post",
      "retention_days": 30
    }
  ],
  "geo": {
    "countries": ["IN", "AE"],
    "regions": ["Kerala", "Dubai", "Abu Dhabi", "Sharjah"]
  },
  "exclusions": {
    "custom_audiences": [
      "neovibe_existing_users",
      "neovibe_lead_form_completed_30d"
    ]
  },
  "estimated_reach_note": "Starts ~0 on day 1 — populates as cold campaign drives traffic. Expect ~3K-8K reachable warm pool by day 14 if cold delivers 200K+ impressions."
}
```

**Logic**: Three-source warm pool = site visitors + video 25%-completers + IG engagers. Wider than just-site-visitors so warm doesn't starve in week 1 when cold is still warming up traffic. Excludes anyone who already filled the form (no point retargeting them through ads — they're in the email/Clerk approval flow).

---

## Notes on Meta's Detailed Targeting Deprecation

Meta has been pruning interest categories quarterly. If `Webflow` or `Framer (software)` returns "low audience" or 404 at runtime, fall back to broader anchors: `User experience design`, `Web design`, `Graphic design`. Do not use lookalikes in week 1 — wait until we have 100+ leads to seed a 1% LAL.

## Exclusion File Schema

`neovibe_existing_users.csv` — minimum columns (Meta will hash on upload):

```
email,phone,country
designer1@example.com,+919876543210,IN
designer2@example.com,+971501234567,AE
```

Pull this from Clerk + Stripe combined: `clerk.users` UNION `stripe.customers`. Refresh weekly.
