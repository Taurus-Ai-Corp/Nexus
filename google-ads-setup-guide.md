# Google Ads Account Setup — Click-by-Click Execution Guide

## Account creation (5 minutes)
1. Open an incognito browser and go to https://ads.google.com
2. Sign in with **admin@taurusai.io** (or the Google account you want to own the ads account)
3. On the welcome page, look for **"Switch to Expert Mode"** in the bottom-left corner and click it
4. Choose **"Create an account without a campaign"**
5. Fill in:
   - **Country:** United Arab Emirates
   - **Time zone:** (GMT+04:00) Abu Dhabi, Muscat
   - **Currency:** United Arab Emirates Dirham (AED)
   - **Account name:** Nexus Creative by Taurus AI
6. Click **Submit**

## Billing (add only when ready to spend)
1. Go to Tools & Settings → Billing → Settings
2. Click **Add payment method**
3. Use a company card or the WIO business banking card
4. Set a **monthly account limit** of AED 2,700 to stay within the test budget

## Campaign A — Dubai Creative Agencies
1. Click **Campaigns** → **New campaign**
2. Select **Sales** or **Leads** as the goal
3. Choose **Search**
4. Name: `Creative Agencies — Dubai`
5. Locations: **Dubai, United Arab Emirates**
6. Languages: English, Arabic
7. Bidding: **Maximize conversions** (or **Manual CPC** at AED 3–6 if no conversion history)
8. Daily budget: **AED 30**
9. Ad group name: `AI Creative Agency Dubai`
10. Keywords (add as phrase + exact match):
    - `"AI creative agency Dubai"`
    - `"fashion campaign studio Dubai"`
    - `"luxury brand content Dubai"`
    - `"AI generated campaign brief"`
    - `[AI creative studio Dubai]`
11. Responsive search ad:
    - H1: AI Campaign Studio for Dubai Brands
    - H2: Brief to Image Prompt in Minutes
    - H3: Book a Free Creative Audit
    - Desc 1: Nexus Creative turns one sentence into campaign assets.
    - Desc 2: Fashion, real estate, F&B, beauty. Try the free prompt lab.
    - Final URL: https://nexus.taurusai.io

## Campaign B — Dubai Real Estate Marketing
- Name: `Real Estate Marketing — Dubai`
- Locations: Dubai
- Daily budget: AED 30
- Ad group: `Property Campaign Dubai`
- Keywords:
  - `"real estate marketing Dubai"`
  - `"property campaign creative Dubai"`
  - `"luxury property photoshoot Dubai"`
  - `"real estate social media Dubai"`
  - `[property marketing agency Dubai]`
- Ad:
  - H1: Property Campaigns in Hours
  - H2: AI Briefs for Dubai Real Estate
  - H3: Get a Free Property Audit
  - Desc 1: Hero shots, lifestyle frames, launch copy from one brief.
  - Desc 2: See examples for Downtown Dubai penthouses.
  - Final URL: https://nexus.taurusai.io/real-estate

## Campaign C — Fashion / Beauty / F&B
- Name: `Fashion Beauty F&B — Dubai`
- Locations: Dubai
- Daily budget: AED 30
- Ad group: `Fashion Campaign Dubai`
- Keywords:
  - `"fashion campaign creative Dubai"`
  - `"beauty brand content Dubai"`
  - `"AI product photography Dubai"`
  - `"luxury campaign brief Dubai"`
  - `[AI fashion campaign Dubai]`
- Ad:
  - H1: AI Campaign Briefs for Brands
  - H2: Fashion, Beauty, F&B, Real Estate
  - H3: Try the Free Prompt Lab
  - Desc 1: Generate image prompts, headlines, and platform plans.
  - Desc 2: Built in Dubai by Taurus AI.
  - Final URL: https://nexus.taurusai.io

## Conversion tracking
Before launching ads, replace `G-XXXXXXXXXX` in `index.html` and `real-estate/index.html` with a real GA4 measurement ID.

Add these events via Google Tag:
- `generate_brief_click` — when "Generate brief" is clicked
- `audit_book_click` — when "Book free audit" is clicked
- `pricing_inquiry` — when a pricing button is clicked

## Launch checklist
- [ ] Account created in Expert Mode
- [ ] Billing method added
- [ ] 3 campaigns built
- [ ] GA4 tag installed
- [ ] Conversion events configured
- [ ] Campaigns set to **Paused** until you review
- [ ] Daily budget capped at AED 90 total

## First-week optimization
- Day 1–2: let campaigns run without changes
- Day 3: review Search terms, add negative keywords: `free`, `job`, `internship`, `software engineer`, `AI engineer`
- Day 7: pause keywords with CTR < 1%
- Day 14: increase budget on campaigns with CTR > 3% and demo clicks
