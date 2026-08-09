PetPawSphere should launch in four tightly managed phases: 2 weeks of pre-launch setup, a 1-week soft launch focused on fast learning and revenue, 2–4 weeks of controlled scaling, then a Month 2+ sustain phase with regional expansion and LTV optimization. Structuring launches into clear pre-, launch, and post-launch stages is consistent with best practice in high-performing product launches.[1][2]

---

## 0. Core Strategy & Assumptions

**Business model (for this plan):**

- Revenue in first 30–60 days comes from:
  - **Verified breeders** – paid listing / per-qualified-lead fee.
  - **Pet services (vets, groomers, trainers, sitters)** – lead packages or subscription.
  - Medium-term: **pet owners** may pay for premium matching/concierge.

**Primary launch city focus (first 4 weeks):**

- **Dubai + Abu Dhabi** (then expand to rest of UAE after Week 4).

**Primary acquisition channels (first 4 weeks):**

- Paid: **Meta (Facebook/Instagram)**, **Google Search**, **TikTok**, **LinkedIn (for partners)**.
- Organic/direct: Instagram, TikTok, WhatsApp, direct outreach to **breeders/vets/pet shops**.

---

## 1. Team, Roles & Tools

### 1.1 Core Launch Team (minimum viable)

| Role | Core responsibilities | Time commitment (first 4 weeks) |
|------|------------------------|---------------------------------|
| Founder / GM | Final approvals, pricing, partnerships, key sales calls | 30–50% |
| Growth Lead (you) | Owns this playbook, ads, funnel, analytics, daily standup | 100% |
| Performance Marketer | Campaign setup, optimization, reporting | 80–100% |
| Designer (Arabic/English capable) | Ad creatives, landing visuals, social content | 50% |
| Full-stack dev / app dev | Tracking, pixels, events, landing changes | 50% |
| Sales/Success (1–2 people) | Lead calling, WhatsApp, onboarding breeders | 100% |
| Compliance/Legal (fractional) | PDPL, ToS, privacy, contracts | On-demand |

### 1.2 Required Tools & Approximate Monthly Cost (AED)

| Function | Recommended options (pick 1 each) | Est. monthly |
|---------|------------------------------------|--------------|
| Ads platforms | Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads | Your media spend (e.g. 20,000–60,000) |
| Tag manager & analytics | Google Tag Manager, GA4 (free) | 0 |
| App analytics & events | Firebase (free tier) | 0–100 |
| CRM & pipeline | HubSpot Starter / Pipedrive / Zoho CRM | 200–600 |
| Email marketing | Brevo / MailerLite / Klaviyo | 100–400 |
| SMS & WhatsApp | Unifonic / Infobip / Twilio / WhatsApp Business API provider | 300–1,500 (usage-based) |
| Design & collaboration | Figma / Canva Pro, Notion / Asana for tasks | 50–200 |
| Heatmaps & session replay | Hotjar / Microsoft Clarity | 0–200 |
| Call tracking (optional) | CallRail / similar | 200–600 |

---

## 2. PHASE 1 – PRE‑LAUNCH (Week −2 to 0)

### 2.1 Legal & Accounting Setup for Ads (Week −2)

**Objective:** Be fully ready to spend on all major ad platforms without delays.

**Checklist – UAE & platform basics**

- Company:
  - Trade license valid and on hand (PDF).
  - Corporate bank account active.
  - VAT registration (if applicable), TRN available.

- Meta Business:
  - Create **Meta Business Manager** in company name.
  - Add company legal name, address, TRN.
  - Upload trade license & ID documents for **Business Verification**.
  - Set **billing country = UAE**, **currency = AED**.
  - Add at least **2 payment methods**:
    - Primary: company credit card/debit card.
    - Backup: second card or PayPal (if available).
  - Add at least **2 admins** (founder + growth lead).

- Google Ads:
  - Create account with company email.
  - Set country = UAE, currency = AED, time zone = GST.
  - Choose **manual payments** (if you want stricter control) or automatic.
  - Add company card; set daily budget caps.

- TikTok Ads:
  - Create Business Center.
  - Add billing info, card, set AED currency.

- LinkedIn Ads:
  - Connect to company page.
  - Set card and billing in AED.

- Domain & brand:
  - Purchase domain(s): e.g. **.ae** + **.com** versions.
  - Configure **domain verification**:
    - Meta: add DNS TXT record or HTML upload.
    - Google: via Search Console.
    - TikTok & LinkedIn: pixel/tag verification as needed.

**Decision gate – before Week −1:**

- All ad accounts created, payment methods added, domain verified in Meta & Google.
- At least one backup payment method per platform.

---

### 2.2 Technical Tracking Setup (Week −2 to −1)

**Objective:** Correct, privacy-compliant tracking from day 1.

**Tracking stack**

- **Web/app**:
  - Google Tag Manager (GTM) installed on:
    - Marketing site/landing pages.
    - Web app (if separate).
  - GA4 property configured via GTM.

- **Meta Pixel**:
  - Create Meta Pixel in Business Manager.
  - Implement via GTM.
  - Standard events:
    - `PageView` (all pages).
    - `ViewContent` (key info pages like breeder profiles, pet details).
    - `Lead` (form submission, WhatsApp click for lead).
    - `CompleteRegistration` (breeder account created).
    - `Purchase` or `Subscribe` (any paid plan, use AED currency).

- **Meta Conversions API**:
  - Server-side tracking using:
    - Either backend integration (Node/PHP/etc.) or GTM server container.
  - Pass:
    - Event name, timestamp, value, currency, user identifiers (hashed email, phone, fbp/fbc when possible).
  - Test with Meta’s **Test Events** tool.

- **Google Ads & GA4**:
  - Link GA4 and Google Ads.
  - Import conversions from GA4 or use Google Ads tags.
  - Conversions to track:
    - Lead form submission.
    - Breeder signup.
    - Payment completed / checkout.

- **LinkedIn Insight Tag**:
  - Install via GTM.
  - Define conversions:
    - B2B partner lead (vet/groomer/breeder application).
    - Download or brochure view if you have one.

- **TikTok Pixel**:
  - Install via GTM.
  - Events: `ViewContent`, `SubmitForm`, `CompletePayment`.

- **App event tracking** (if mobile app):
  - Integrate **Firebase SDK** into iOS/Android builds.
  - Map key events:
    - App install, sign-up.
    - First pet profile created.
    - First breeder contact initiated.
    - Payment events.
  - Connect Firebase to:
    - Google Ads (for app campaigns).
    - BigQuery or CRM if needed.

**Validation checklist**

- Use Chrome Tag Assistant / Meta Pixel Helper / TikTok Pixel Helper:
  - Confirm events fire on correct URLs.
  - Confirm no duplicate events.
  - Check correct currency (AED) and dynamic values.

**Decision gate – end of Week −1:**

- All key events firing and showing in ad platforms’ event managers.
- At least one **test lead** and one **test purchase** recorded per channel.

---

### 2.3 Landing Page Requirements & QC (Week −1)

**Goal:** Launch with 1–2 high-converting landing pages for each core audience.

**Must-have pages**

- **Landing A – Pet Owners** (matching/care):
  - Main promise: “Find trusted, verified breeders & pet care in the UAE.”
  - Above the fold:
    - Clear headline.
    - 1–2-line value prop.
    - Primary CTA: “Get early access” / “Find a verified breeder”.
    - WhatsApp CTA for fast contact.
  - Social proof: early breeders, vets, testimonials (even if from pilot users).
  - Trust badges: “Verified breeders”, “PDPL compliant”, secure payments.
  - FAQ about:
    - Animal welfare standards.
    - How PetPawSphere vets breeders.
    - Fees (transparent).

- **Landing B – Breeders & Pet Services**:
  - Headline: “Get pre-qualified pet owners in the UAE – no fake inquiries.”
  - Highlight:
    - Verification standards.
    - Lead quality & vetting.
    - Pricing: per lead / subscription (choose simple model at launch).
  - CTA:
    - “Apply as a verified breeder”.
  - Simple form (name, business name, emirate, WhatsApp, website/Instagram).
  - Mention compliance with UAE laws/municipality regulations.

**Design & UX checklist**

- Fast (LCP < 3s on mobile), host in UAE or close regionally (e.g. GCC DC).
- Mobile-first layout (80%+ of traffic).
- Clear **Arabic / English language toggle**.
- Forms:
  - 4–7 fields max.
  - Inline error messages.
  - Thank-you page with next steps & WhatsApp link.

- Tracking:
  - All main CTAs tagged with GTM events.
  - UTM parameters on all paid links.

**Decision gate – before Soft Launch:**

- At least 1 specific landing page per core audience (Owner, Breeder/Service) tested on mobile.
- Forms tested end-to-end, including CRM capture and notification.

---

### 2.4 Creative Asset Production & Workflow (Week −2 to 0)

**Objective:** Have enough quality creatives to test without creative bottleneck.

**Asset list**

- **Meta/TikTok ads:**
  - 6–8 static images (Arabic & English variants).
  - 4–6 short videos (15–30s):
    - 2 for pet owners (emotion + trust).
    - 2 for breeders/services (business value).
  - 3–4 ad copy variants per audience in both languages.

- **Google Ads:**
  - 3–5 responsive search ad sets:
    - Keywords like “puppies for sale Dubai”, “verified dog breeder UAE”, “cat adoption Dubai”, “pet sitter Dubai”.
  - 1–2 Performance Max asset groups with images & headlines.

- **Organic:**
  - 10–15 Instagram posts.
  - 5–8 TikTok/Reels ideas.
  - 2–3 carousel posts explaining the verification process.

**Approval workflow**

1. Growth lead creates **Creative Brief**:
   - Objective (e.g. lead gen for breeders in Dubai).
   - Target audience.
   - Key messages.
   - Format, specs, language.
2. Designer produces **V1** in Figma/Canva.
3. Internal review:
   - Growth lead: messaging & CRO.
   - Legal: ensures no violation of **animal sale / live animal advertising rules** for each platform.
4. Founder final approval.
5. Export & naming convention:
   - `PLATFORM_AUDIENCE_OFFER_LANG_VERSION`  
     e.g. `META_BREEDER_LEADGEN_AR_V1`.

---

### 2.5 Email/SMS/CRM Setup (Week −1 to 0)

**Objective:** No lead is lost; all leads nurtured automatically.

**CRM pipeline**

Create pipelines for:

- **Pet Owner Leads**
  - New lead.
  - Contacted (WhatsApp/call).
  - Match suggested.
  - Match accepted.
  - Paid/Completed.

- **Breeder/Service Leads**
  - New applicant.
  - Under verification.
  - Approved.
  - Onboarded (listing live).
  - Paying / Active.

**Automations**

- Email (and WhatsApp where possible):
  - Pet owner:
    - Welcome email (immediate).
    - Education & trust sequence (3–4 emails over 7 days).
  - Breeder/service:
    - Application received (immediate).
    - Verification steps & required docs.
    - Pricing & early-bird incentive.

- SMS/WhatsApp:
  - Instant notification for high-intent actions:
    - Lead submitted.
    - Payment link sent.

- Internal:
  - New lead triggers:
    - Slack/WhatsApp notification in sales channel.
    - Assignment to sales/success owner.

---

### 2.6 Arabic Localization & PDPL Compliance (Week −1)

**Arabic & RTL**

- All key pages & ads available in **Modern Standard Arabic** tuned for UAE.
- Right-to-left rendering:
  - Menus, bullets, alignment.
  - Ensure no broken layouts on mobile.
- Numbers:
  - Prices shown as AED with both English numerals and optionally Arabic.

**PDPL & privacy checklist (UAE Personal Data Protection Law)**

- Explicit **consent checkbox** on all forms:
  - “I consent to the processing of my personal data in accordance with the Privacy Policy.”
- **Privacy Policy** page:
  - Data collected (name, phone, pet preferences, etc.).
  - Purpose of processing (matching, marketing, analytics).
  - Data retention periods.
  - Data subject rights (access, correction, deletion).
  - Contact for data requests.
- **Cookie consent**:
  - Banner outlining use of tracking pixels & analytics.
  - Ability to accept/reject non-essential cookies.
- Data minimization:
  - Only collect fields required for matching/onboarding.
- DPA (data processing agreements) with:
  - CRM provider.
  - Email/SMS providers.
  - Hosting provider.

**Decision gate – Launch readiness (end of Week 0):**

- All legal docs live (Privacy, Terms, Breeder Agreement).
- PDPL-compliant forms & consent.
- Bilingual key pages & top creatives.

---

## 3. PHASE 2 – SOFT LAUNCH (Week 1)

**Goal:** Validate messaging, channels, and offer; close first deals quickly.

### 3.1 Campaigns to Launch First & Why

Priority is **lead gen + revenue feedback loop within 7 days**:

1. **Meta (Facebook/Instagram) – Lead Generation & Website Conversion**
   - Best for broad awareness + lead gen for both owners and breeders.
   - Use both **Lead Ads** (native forms) and **Website Conversion** campaigns.

2. **Google Search – High Intent**
   - Capture active seekers: “puppy for sale Dubai”, “Maltese breeder UAE”, “cat adoption Abu Dhabi”.

3. **Direct Outreach – Breeders & Services**
   - Build supply quickly and monetize via paid listings/lead packages.
   - Instagram DMs, WhatsApp, phone calls to:
     - Known breeders.
     - Vet clinics, groomers, pet shops.

4. **Organic Instagram/TikTok**
   - Show social proof and community.
   - Cross-link from paid ads for credibility.

### 3.2 Exact Campaign Setup & Daily Budgets (example starting point)

Assume **initial test budget = 20,000 AED for first 2 weeks**.

**Meta – Pet Owners (UAE)**

- Campaign: **Conversions – Leads**
  - Objective: `Lead` event on Owner landing page.
  - Daily budget: **300 AED**.
  - Ad sets (2–3):
    - Targeting:
      - Location: Dubai + Abu Dhabi.
      - Age: 21–45.
      - Interests: Dogs, Cats, Pets, Pet adoption, specific breeds.
      - Language: English & Arabic (split ad sets).
    - Placements: Advantage+ placements (remove Audience Network if quality low).
  - Creatives:
    - 2–3 static image ads.
    - 2 video ads (Max 30s).

- Campaign: **Lead Ads – Instant Forms**
  - Daily budget: **200 AED**.
  - Targeting similar to above.
  - Form questions:
    - Pet type, breed preference, timeline to adopt, budget range, WhatsApp.

**Meta – Breeders & Services**

- Campaign: **Lead Generation**
  - Daily budget: **250 AED**.
  - Targeting:
    - Interests: Pet business, dog breeding, vet, small business owners.
    - Look at competitor pages (if any) via interest stacking.
    - Geographic: Dubai, Abu Dhabi, Sharjah.
  - Offer:
    - “Limited early-bird: 3 months free listing / discounted lead price”.

**Google Search – Intent Campaigns**

- Campaign 1: “Pet purchase & adoption” (Owners)
  - Daily budget: **250 AED**.
  - Match types:
    - +puppy +for +sale +dubai
    - +dog +breeder +uae
    - +cat +adoption +dubai
  - Bidding: Maximize conversions with a starting CPC bid cap if needed.
  - Location: UAE (or Dubai/Abu Dhabi initially).

- Campaign 2: “Breeders & services recruitment”
  - Daily budget: **100 AED**.
  - Keywords:
    - +dog +breeder +dubai +advertise
    - +vet +clinic +marketing +uae
    - +pet +groomer +leads

**Total daily budget soft launch (Week 1):** ~1,100–1,300 AED/day.  
Scale up/down based on early performance and cash constraints.

### 3.3 Monitoring Plan – First 48 Hours

**Day 1–2 monitoring cadence**

- Check every 3–4 hours:
  - Delivery (impressions).
  - CTR (link).
  - CPC.
  - Early leads & CPL (if any).
  - Disapprovals or policy warnings.

**Initial benchmark thresholds (rough)**

- Meta:
  - CTR (link) target: **>1%**.
  - CPC: **<3 AED** (owners), **<5 AED** (breeders B2B).
  - CPL: **<40–70 AED** (owners) and **<70–120 AED** (breeders), adjust based on pricing.

- Google Search:
  - CTR: **>5%**.
  - CPC: will vary; aim to keep below **8–10 AED** initially.
  - Conversion rate from click to lead: **>8–12%**.

**If below thresholds after 1,000 impressions/ad set:**

- Low CTR:
  - Swap creatives first.
  - Test more direct headlines: “Verified breeders only”, “No puppy mills.”
- No conversions:
  - Check landing page (form issues, tracking).
  - Try Meta Lead Ads to remove landing friction.

### 3.4 When to Kill or Scale an Ad Set

**Kill / pause rules**

- After **2,000–3,000 impressions** and **no leads**:
  - Pause ad set or ad; fix creatives/offers.
- After **10–15 clicks** and **0 leads**:
  - Check landing UX & form; if fine, pause keyword/ad and rework angle.
- CTR (link) **<0.5%** for 48 hours:
  - Kill ad (creative mismatch).

**Scale rules (per ad set)**

- If:
  - ≥10–15 leads, CPL **≤ your target**, stable for **3 days**.
- Then:
  - Increase budget by **max 20% per day** to avoid breaking algorithm learning.

For the whole campaign, if blended CPL is comfortably profitable (back-calculated from revenue per breeder/owner), you can aggregate scale by 20–30% every 2–3 days.

### 3.5 Lead Handling & Response SLAs

**Pet Owners**

- SLA:
  - WhatsApp/webchat leads: respond **within 5 minutes** during working hours.
  - Form leads: respond **within 30 minutes**.
- Process:
  - Automated WhatsApp greeting + quick intake questions.
  - Sales/Success uses script to:
    - Confirm pet type & expectations.
    - Explain verification & matching.
    - Offer 1–2 breeder options or wait time estimate.

**Breeders/Services**

- SLA:
  - Respond **within 2 hours** business time; same-day call if high potential.
- Process:
  - Qualify:
    - Type of animals/services.
    - Compliance with local laws.
    - Facility location & license.
  - Send:
    - Verification requirements list.
    - Price sheet + early-bird incentive.
  - Book onboarding call (video/phone) within 24–48 hours.

### 3.6 First Customer Onboarding Flow

**Breeder onboarding (revenue critical)**

1. Application submitted.
2. Within 2 hours:
   - Personal WhatsApp message + confirmation email.
3. Within 24 hours:
   - Verification call (10–20 minutes).
   - Collect documents (license, facility photos, vaccination protocols).
4. Approve/Reject:
   - If approve, send:
     - Terms & Conditions.
     - Payment link for listing/lead credits.
5. After payment:
   - Create breeder profile in platform.
   - Provide:
     - “Welcome pack” PDF.
     - Guidelines on communication with leads.
     - SLA expectations (response times).

**Pet owner onboarding**

- Immediately after lead:
  - Automated email + WhatsApp.
- Within 12 hours:
  - Human follow-up with 1–2 matched options or timeline.
- If premium concierge is paid:
  - White-glove support; allocate specific account manager.

---

## 4. PHASE 3 – SCALE (Weeks 2–4)

**Goal:** Systematically grow spend & volume while improving CPL/CPA and quality.

### 4.1 Weekly Optimization Checklist

Run this every **Monday & Thursday**:

- **Account level**
  - Check disapproved ads & policy issues.
  - Confirm tracking consistency (no drops in conversion events).
- **Creative**
  - Identify top 20% of creatives by:
    - CTR, CPL, lead quality (downstream).
  - Duplicate best angles into new formats:
    - Static → video → carousel.
- **Audience**
  - Test:
    - Lookalikes (breeders & owners who converted).
    - Broad targeting (especially on Meta).
  - Remove underperforming interests/keywords.
- **Bidding**
  - Test bid strategies:
    - Meta: Cost cap vs. lowest cost.
    - Google: Target CPA vs. Maximize conversions.
- **Landing pages**
  - Review heatmaps (Hotjar):
    - Scroll depth.
    - Drop-off on forms.
  - A/B test:
    - Headline.
    - Social proof section.
    - Short vs. longer forms.
- **Sales & quality**
  - Review conversion from lead → paying customer.
  - Identify any channels causing low-quality leads.

### 4.2 Budget Scaling Rules (20% Rule)

- For **winning campaigns** (meeting CPL & quality targets for 5–7 days):
  - Increase daily budgets by **20%** every 2–3 days.
- For **platform split** (example by Week 4 if results are good):
  - Meta: 40–50% of paid budget.
  - Google: 20–30%.
  - TikTok: 10–20%.
  - LinkedIn: 10–15% (primarily for B2B partners).

Adjust based on actual performance.

### 4.3 Adding TikTok, LinkedIn, Google (if not already)

**TikTok Ads (Week 2)**

- Campaign: Lead gen / traffic for pet owners:
  - Short, emotional videos, UGC style.
  - Daily budget: start **150–250 AED**.
  - Target: UAE, 18–35, pet interests.
- Creative: Focus on cute pets + “verified & safe” message.

**LinkedIn (Week 3)**

- Objective: Recruit **vets, groomers, pet brands, insurance**.
- Campaign: Lead gen.
  - Target:
    - Job titles: Veterinarian, Clinic Manager, Pet Groomer, Pet Store Owner.
    - Location: UAE.
  - Daily budget: **150–200 AED**.

**Google – expand (Week 2–3)**

- Add:
  - Performance Max with breeder & owner assets.
  - More specific breed keywords.
  - “Pet matchmaking” / “verified breeders”.

### 4.4 Retargeting Setup (Week 2)

Create retargeting audiences:

- Website visitors last 30 days.
- Lead form opens but not submitted (Meta).
- Engaged with Instagram & TikTok (video views, profile visits).
- Breeder applicants who haven’t completed verification.

**Retargeting campaigns**

- Meta & TikTok:
  - Daily budget: **10–20%** of platform spend.
  - Creative:
    - Social proof (testimonials).
    - Stronger offers (limited-time promotion).
    - “Still looking for the right pet? We’re here.”

- Google:
  - Display remarketing for visitors who viewed breeder pages.

### 4.5 Influencer & Partnership Outreach (Weeks 2–4)

**Targets**

- Micro-influencers (5k–50k followers) in:
  - Pet niche, lifestyle, family, UAE moms groups.
- Partners:
  - Vet clinics, pet shops, pet cafes, adoption shelters.

**Outreach process**

- Prepare **partnership one-pager**:
  - What is PetPawSphere.
  - Benefits: new clients, revenue share, support animal welfare.
- Offer examples:
  - Free listing + commission per lead.
  - Exclusive referral codes for influencers.
- Track:
  - Each influencer with custom UTM and code.
  - Evaluate on cost per lead / cost per paying user.

### 4.6 PR & Content Distribution (Weeks 3–4)

- Prepare **press kit**:
  - Company boilerplate.
  - Founder story.
  - High-quality images.
  - Quotes on animal welfare, verified breeders.
- Pitch:
  - UAE tech/startup media.
  - Pet community blogs/groups.
- Publish:
  - 1–2 long-form articles on your own blog (educational, not salesy).
  - Distribute via:
    - Email list.
    - LinkedIn posts.
    - WhatsApp broadcast (where appropriate).

---

## 5. PHASE 4 – SUSTAIN (Month 2+)

### 5.1 Weekly Optimization Cadence

**Every week:**

- 30–60 min **growth standup**:
  - Review previous week’s core metrics (see KPI section).
  - Decide 1–2 experiments (new offers, new creatives, or new audience tests).
- Campaign hygiene:
  - Pause ads with rising CPL.
  - Refresh 20–30% of creatives weekly (especially on Meta/TikTok).
- Funnel review:
  - Lead → Opp → Paid conversion by channel.
  - Fix leaks (e.g., slow response, confusing onboarding).

### 5.2 LTV/CAC Tracking

- Define cohorts:
  - By channel (Meta, Google, TikTok, Organic).
  - By segment (breeder, vet, groomer, pet owner).
- Track:
  - **CAC** = Total spend / # paying customers by segment.
  - **LTV**:
    - Monthly revenue per customer × expected lifetime (months).
- Aim:
  - LTV/CAC ratio **> 3** for core segments over time.
- Use CRM + accounting tool integration to generate monthly reports.

### 5.3 GCC Expansion (Saudi Arabia, Qatar, Kuwait)

**Sequencing (Month 3–6)**

1. **Market validation:**
   - Desktop research on regulations for pet sales and breeding.
   - Identify key cities:
     - Saudi: Riyadh, Jeddah, Dammam.
     - Qatar: Doha.
     - Kuwait: Kuwait City.
2. **Local compliance:**
   - Adapt privacy/legal to local laws (especially Saudi PDPL).
   - Check ad platform restrictions for live animals in each country.
3. **Go-to-market:**
   - Launch **breeder/service recruitment** campaigns first (supply).
   - Then owner campaigns once critical mass of verified breeders.

### 5.4 Enterprise & Government Outreach

Targets:

- Municipalities & government vet services.
- Animal welfare organizations, shelters, NGOs.
- Corporate partners (pet insurance, banks, real estate with pet-friendly buildings).

Approach:

- Prepare **enterprise deck**:
  - Data and insights on pet ownership, animal welfare.
  - How PetPawSphere can support stricter welfare standards & traceability.
- Propose pilots:
  - Verified breeder registry projects.
  - Co-branded adoption/awareness campaigns.

### 5.5 Case Studies & Testimonials

- After first **10–20 successful matches** and **5–10 paying breeders**:
  - Collect:
    - Before/after metrics (leads, sales).
    - Qualitative quotes.
  - Create:
    - 1-page PDF case studies.
    - Video testimonials (30–60s).
- Use in:
  - Retargeting ads.
  - Sales decks.
  - PR and website.

---

## 6. Success Metrics & KPI Dashboard

### 6.1 Core Metrics by Funnel Stage

| Stage | Metric | Target (to adjust after 4 weeks) |
|-------|--------|-----------------------------------|
| Reach | Impressions, unique reach | Healthy growth, no cap on frequency >3 in first week |
| Click | CTR (link) | Meta >1%, Google search >5% |
| Lead | CPL (owners) | Start <70 AED, aim <40 AED |
| Lead | CPL (breeders/services) | Start <120 AED, aim <80 AED |
| Sales | Lead → paying breeder | ≥20–30% |
| Revenue | ARPU per breeder/month | Defined by your pricing |
| Efficiency | CAC | Tied to LTV; target LTV/CAC ≥3 |
| Quality | Complaints / refunds / welfare issues | As low as possible; monitored weekly |

### 6.2 Simple Dashboard Structure

In a spreadsheet/BI tool, track weekly by channel:

- Spend.
- Clicks.
- Leads.
- CPL.
- Paying customers.
- CAC.
- Revenue from that cohort.
- LTV-to-date (once you have 3+ months of data).

---

## 7. Daily