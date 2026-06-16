# Google Ads Account Setup — Enterprise B2B Execution Guide

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

## Campaign A — Enterprise AI Marketing Platform (Dubai/GCC)
1. Click **Campaigns** → **New campaign**
2. Select **Leads** as the goal
3. Choose **Search**
4. Name: `Enterprise AI Marketing — Dubai GCC`
5. Locations: **Dubai, Abu Dhabi, Riyadh, Jeddah, Doha, Manama, Muscat** (GCC metros)
6. Languages: English, Arabic
7. Bidding: **Maximize conversions** (or **Manual CPC** at AED 5–10 if no conversion history)
8. Daily budget: **AED 45**
9. Ad group name: `Enterprise Marketing Automation UAE`
10. Keywords (add as phrase + exact match):
    - `"AI ad agency Dubai"`
    - `"enterprise marketing automation UAE"`
    - `"campaign optimization platform GCC"`
    - `"AI creative studio Dubai"`
    - `"marketing automation enterprise Dubai"`
    - `"ad performance optimization UAE"`
    - `[AI ad agency Dubai]`
    - `[enterprise marketing automation UAE]`
    - `[campaign optimization platform GCC]`
11. Responsive search ad:
    - H1: Enterprise AI Campaign Platform — Dubai
    - H2: Cut Ad Production Time by 90%
    - H3: Request Enterprise Audit
    - Desc 1: Nexus Creative turns briefs into production-ready campaign assets in minutes, not weeks.
    - Desc 2: Brands in Dubai & GCC use our AI to outperform agency timelines. View a private demo.
    - Final URL: https://nexus.taurusai.io

## Campaign B — Marketing Decision-Makers (GCC)
- Name: `Marketing Leaders — GCC Enterprise`
- Locations: Dubai, Abu Dhabi, Riyadh, Jeddah, Doha, Manama, Muscat
- Daily budget: AED 40
- Ad group: `CMO Marketing Tech Dubai`
- Keywords:
  - `"AI campaign optimization enterprise"`
  - `"marketing automation platform Dubai"`
  - `"enterprise ad performance GCC"`
  - `"B2B marketing automation UAE"`
  - `"AI creative platform for brands"`
  - `[marketing automation platform Dubai]`
  - `[enterprise ad performance GCC]`
- Ad:
  - H1: AI Campaign Studio for Enterprise
  - H2: ROI Proof of Concept in 15 Min
  - H3: View Private Demo
  - Desc 1: Replace weeks of agency turnaround with AI-generated campaign kits. Proven in Dubai.
  - Desc 2: Free enterprise audit — we run your worst campaign through our AI and show you the uplift.
  - Final URL: https://nexus.taurusai.io

## Campaign C — Agency & White-Label Partners (GCC)
- Name: `Agency Partners — GCC White-Label`
- Locations: Dubai, Abu Dhabi, Riyadh, Jeddah, Doha, Manama, Muscat
- Daily budget: AED 35
- Ad group: `Agency White Label Dubai`
- Keywords:
  - `"white label marketing automation Dubai"`
  - `"AI creative white label GCC"`
  - `"agency campaign automation UAE"`
  - `"AI ad production for agencies Dubai"`
  - `"marketing automation reseller UAE"`
  - `[AI creative white label GCC]`
- Ad:
  - H1: White-Label AI Campaign Studio
  - H2: Your Brand, Our Engine
  - H3: Schedule Executive Briefing
  - Desc 1: Deliver agency-grade campaigns at 10x speed. White-label AI for your clients.
  - Desc 2: Dedicated model tuning, API access, SLA. Built for agencies in Dubai & GCC.
  - Final URL: https://nexus.taurusai.io

## Conversion tracking
Before launching ads, replace `G-XXXXXXXXXX` in `index.html` and `real-estate/index.html` with a real GA4 measurement ID.

Add these events via Google Tag:
- `view_private_demo` — when "View Private Demo" is clicked
- `request_enterprise_audit` — when "Request Enterprise Audit" is clicked
- `schedule_executive_briefing` — when "Schedule Executive Briefing" is clicked
- `start_poc` — when "Start Proof of Concept" is clicked
- `start_enterprise_plan` — when "Start Enterprise Plan" is clicked
- `calendly_booking` — when a Calendly booking is completed (via Calendly event callback)

## Launch checklist
- [ ] Account created in Expert Mode
- [ ] Billing method added
- [ ] 3 campaigns built with enterprise keywords
- [ ] GA4 tag installed
- [ ] Conversion events configured (6 enterprise events)
- [ ] Calendly embed active on landing page
- [ ] Campaigns set to **Paused** until you review
- [ ] Daily budget capped at AED 120 total
- [ ] Negative keyword list applied: `free`, `job`, `internship`, `software engineer`, `AI engineer`, `tutorial`, `course`, `how to`, `DIY`, `open source`

## First-week optimization
- Day 1–2: let campaigns run without changes
- Day 3: review Search terms, add negative keywords from the list above
- Day 7: pause keywords with CTR < 1.5%
- Day 14: increase budget on campaigns with CTR > 3% and enterprise audit form submissions
- Day 21: review cost-per-enterprise-audit; aim for < AED 150 per qualified booking
