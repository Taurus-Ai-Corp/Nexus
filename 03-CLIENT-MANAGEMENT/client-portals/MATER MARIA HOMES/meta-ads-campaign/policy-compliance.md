# Mater Maria — Meta Ads Policy & Compliance Checklist

> One-stop pre-launch policy review. The current campaign blueprint (campaign-brief.md, audience-targeting.md, creative-variants.md, cli-commands.sh) **cannot ship as written** — multiple items below are launch-blocking. Sections 1, 2, and 3 are the most material risk surfaces.
>
> Owner column: BDM (Rajeev/Praveen) · Counsel · Eng · Creative · Client (Mater Maria board / patron office). Items flagged "BLOCKS LAUNCH" must be cleared before unpausing the campaign in `cli-commands.sh § 6`.
>
> Verified against Meta Business Help Center, MeitY DPDP Rules 2025, SEBI Master Circular for IAs (Jun 2025), UAE CMA framework effective 2026-01-01, and WhatsApp Business Messaging Policy 2026. Where ambiguity exists it is marked "VERIFY AT LAUNCH" rather than guessed.

---

## Section 1 — Meta Special Ad Category: HOUSING (LAUNCH-BLOCKING)

### Why HOUSING applies

Meta's Special Ad Category policy classifies any ad that "promotes or directly links to housing opportunities or related services" as HOUSING — and this explicitly includes **fractional/share-based real-estate investment instruments where the underlying asset is residential property and the buyer obtains right of residence / use**. Mater Maria's tier program meets this on three counts:

1. The four tiers (Silver–Platinum) entitle the holder to event-hall and guest-house residence rights.
2. The instrument's underlying value is the 90 residential units at the Elangulam estate.
3. Marketing copy in `creative-variants.md` (V1, V4, V5) directly references the residences as the call-to-purchase.

The 2022 HUD–Meta settlement that created HOUSING is U.S.-origin, but Meta enforces the category **globally** for any ad served from accounts that touch U.S. user data — and our pixel + GCC delivery surface guarantees that. Treat HOUSING as mandatory.

### Targeting restrictions activated by HOUSING

- [ ] **No detailed-demographic targeting** — income brackets, household composition, life events (retirement, marriage), employer, job title, education level all become unavailable.
- [ ] **No interest targeting based on housing/credit/employment proxies** — "Real estate investing", "Property investment", "Mutual funds", "Wealth management", "Retirement planning", "Senior living", "Pension" listed in `audience-targeting.md § 1` will be **rejected by Meta** the moment HOUSING is declared.
- [ ] **Location radius minimum 15 mi (24 km) US / 17 km EU** — pin-and-radius city targeting must respect the floor. For our GCC city targeting (Dubai, Abu Dhabi, Doha, Riyadh, Kuwait City, Manama, Muscat) treat 25 km as the safe default. **VERIFY AT LAUNCH** whether Meta enforces the 15 mi floor in GCC or applies regional rules — Meta has not published a country-by-country floor table; recommend pre-flight confirmation with the Meta account rep.
- [ ] **No lookalike audiences** seeded from age/gender protected attributes — under HOUSING, Meta replaces classic LAL with the "Special Ad Audience" (older terminology) / equivalent restricted Advantage+ flow. Week-2 LAL plan in `campaign-brief.md` must be reworked to use only owned-data seed + neutral signals.
- [ ] **No "Detailed Targeting Expansion"** — Meta force-disables the toggle. Already OFF in our blueprint (good); keep it off explicitly.
- [ ] **Age targeting fixed at 18+** — current 40–65 band must widen to 18–65+ (or open-ended). Acceptable trade-off; HOUSING removes age as a delivery filter regardless.
- [ ] **No gender targeting** — already set to both in our blueprint.

### Concrete rework needed in `audience-targeting.md`

The current "GCC NRI — Cold" audience **will fail Meta review** as written. Rework:

- [ ] **Remove** `behaviors`: `Expats (India)`, `Expats (lives away from hometown)` — expat behaviors are derived from employer/movement signals and are pulled in HOUSING.
- [ ] **Remove** all interest layers tied to retirement, finance, real-estate, pension.
- [ ] **Remove** `interests_excluded`: `Job hunting`, `College students`.
- [ ] **Keep** location (countries: AE, SA, QA, KW, BH, OM, IN with 25 km city radii where city-level), language (Malayalam + English locales), age 18+, gender all.
- [ ] **Keep** custom audiences sourced from owned data: Mater Maria depositor list, IG/FB engagers, /invest site visitors, video-thru viewers, lead-form openers — these remain legal under HOUSING because they derive from the advertiser's first-party signals, not protected demographics.
- [ ] **Allowable interest layers under HOUSING (broad cultural anchors only)**: `Kerala`, `Malayalam cinema`, `Malayalam language`, `Manorama Online`, `Mathrubhumi` — these are cultural-language interests, not housing/credit/employment proxies. **VERIFY AT LAUNCH** — Meta may still flag `Catholic Church` / `Syro-Malabar Catholic Church` as a religious-affiliation proxy under broader civil-rights restrictions; recommend dropping them from the audience layer and reserving faith expression for creative copy only.
- [ ] **Reach impact**: Expect 4–8x widening of the cold pool with corresponding CPL inflation (₹400–₹700 baseline → ₹900–₹1,400 likely). Update `campaign-brief.md § Pacing` and `kpi-dashboard.md` baselines accordingly.

### Declaring HOUSING in the CLI

- [ ] In `cli-commands.sh § 1 (CAMPAIGN)`, change `--special-ad-categories '[]'` to `--special-ad-categories '["HOUSING"]'`.
- [ ] **VERIFY AT LAUNCH** — some `meta-ads` CLI versions expect `--special-ad-category-country` for country-specific declaration; pass `["AE","SA","QA","KW","BH","OM","IN"]` if required.
- [ ] HOUSING is set at **campaign creation time and cannot be changed later** without deleting the campaign. Confirm before running the create call.

**Owner:** BDM + Counsel  ·  **Status:** BLOCKS LAUNCH

---

## Section 2 — Financial-product disclosures (LAUNCH-BLOCKING)

The instrument is a hybrid share + deposit with a 15-year escalating-dividend structure. Every claim about returns triggers regulator overlap: **SEBI (India residence advertising), UAE CMA (formerly SCA, effective 2026-01-01), and Meta's own "deceptive content" / "financial products" policy.**

### India — SEBI

- [ ] Mater Maria is structured as a private share-and-deposit instrument, not a publicly-listed security — but **any Indian residence (and many GCC NRIs are still Indian tax residents)** seeing the ad falls within SEBI's advertisement code reach if the entity issuing the share is Indian-incorporated.
- [ ] **Mandatory standard warning** in legible font (min 10pt or equivalent on-screen) on every creative: *"Investment in securities market are subject to market risks. Read all the related documents carefully before investing."* No additions, no deletions, no creative paraphrasing.
- [ ] **No claim of guaranteed/assured returns.** Current creative line in V2 — *"Total returns model out at 150–153% over the fifteen-year horizon"* — must be reframed as a **projection, not a promise**. Suggested rewrite: *"Modeled returns of approximately 150% over the 15-year share-cycle horizon, subject to project performance and dividend declarations. Past projections do not guarantee future returns."*
- [ ] **No superlative language** ("best", "highest", "guaranteed", "risk-free") — SEBI explicitly bars these in 2023+ enforcement actions.
- [ ] **PaRRVA verification (May 2026 onward)** — if any past-performance figures are shown (e.g., dividend history of any prior phase), SEBI now requires verification through the Past Risk & Return Verification Agency. Mater Maria has no operating history yet, so this is not currently triggered, but **flag for next phase**.
- [ ] **Issuer identity disclosure** — every creative footer must include the legal entity name issuing the shares + a link to the offer document hosted at `matermariahomes.com/invest/offer-document`.

### UAE — Capital Market Authority (CMA, formerly SCA)

- [ ] As of **2026-01-01**, the UAE has reconstituted SCA as the CMA under federal law, with **explicit extraterritorial reach over cross-border financial activity that has UAE domestic impact**. Marketing a foreign (Indian) share instrument to UAE residents falls squarely under CMA's expanded perimeter.
- [ ] **Category 5 (Marketing & Promotions) license** is required for any party promoting foreign securities to UAE residents. Existing SCA Cat-5 licensees have a transition window until 2027-01-01; a new licensee must apply through the CMA. **CONFIRM** whether Mater Maria, the appointed marketing partner, or the GCC introducer (Rajeev Abraham) holds Cat-5 — if none do, this is a **launch-blocker for AE delivery** and the campaign must either (a) exclude AE/GCC SCA-jurisdiction countries or (b) appoint a Cat-5 licensee as record-of-marketing.
- [ ] **Foreign-issuer disclosure** — even for unlisted securities marketed cross-border, the CMA expects material-information disclosure parity. Offer document must be available in English (and Arabic where reasonable) at the same URL referenced in ad creative.

### Required ad-text disclaimers (final consolidated set)

Place in the ad copy footer (visible without "see more" expansion) on every creative:

> *Investments subject to market risk. Returns are projected, not guaranteed. Read the offer document at matermariahomes.com/invest before investing. Issued by [LEGAL ENTITY NAME], regulated as applicable in jurisdiction of issue.*

- [ ] Replace the current line *"Investments subject to risk. See offer document."* in `creative-variants.md` and `cli-commands.sh § 3` for all five variants.

### Third-party financial sign-off

- [ ] **Required:** A SEBI-registered Investment Adviser or Research Analyst (or a Cat-5 licensee in UAE) must review and sign off on the 150–153% projection, the 10% interest claim, and the dividend-escalation table **before any creative ships**.
- [ ] File the sign-off (PDF + email chain) in `03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/legal/financial-review-2026/` for audit trail.

**Owner:** Counsel + Client (Mater Maria board)  ·  **Status:** BLOCKS LAUNCH

---

## Section 3 — WhatsApp Business + Bot Automation Compliance (LAUNCH-BLOCKING for the bot path)

The lead form is paired with an automated WhatsApp follow-up on `+91 94470 80356`. WhatsApp Business Messaging Policy (2026) and DPDP Act 2023 both gate this path.

### WhatsApp Business policy

- [ ] **Explicit opt-in is required before the bot sends the first message.** The user supplying their phone number on the lead form is **not** sufficient unless the form clearly tells them they will receive WhatsApp messages.
- [ ] **Consent text on the lead form**, placed **above** the submit button (must be the user's deliberate action, not pre-checked):

  > *☐ Yes, I consent to receive follow-up messages on WhatsApp from Mater Maria Sanctuary at the number I have provided. I understand the first response may come from an automated assistant and that I can reply STOP to opt out at any time.*

- [ ] **24-hour customer-service window rule** — once the user messages first, the business has 24 hours to reply with free-form messages. Outside this window, only **pre-approved Template Messages** can be sent. Plan the bot's outbound flow accordingly: the post-form welcome must use a **Marketing or Utility template** approved by Meta in advance.
- [ ] **Template approval** — submit the welcome message, the ROI-calculator follow-up, and the appointment-booking nudge as Marketing-category templates via Meta Business Manager. Approval typically takes 1–24 hours.
- [ ] **Opt-out honor** — on receipt of `STOP`, `UNSUBSCRIBE`, `OPT OUT` (English) or equivalents, the bot must (a) immediately stop messaging, (b) store the suppression in a persistent table, (c) confirm to the user that messaging has stopped. The Firebase + Supabase write path must include a `whatsapp_opt_out_at` column.
- [ ] **Bot-disclosure requirement** — the very first bot message must identify itself as automated. Suggested first line: *"Hi! This is the Mater Maria automated assistant. A team member will follow up personally within 24 hours. Reply STOP to opt out."*
- [ ] **No purchased / scraped phone lists** — the bot must only message numbers that came in via the consented lead form. Period.
- [ ] **U.S. number block (since 2025-04-01)** — Meta paused all marketing template messages to +1 numbers. If any GCC lead provides a U.S. number (snowbird NRIs occasionally do), the bot must skip outbound and route to manual sales follow-up.

### India — DPDP Act 2023

- [ ] **DPDP Rules notified 2025-11-13.** Phase 1 (DPB constitution) is live; Phase 2 (substantive obligations including notice/consent/withdrawal mechanics) becomes binding **2026-11-13**. Treat the campaign as if Phase 2 is already in force — DPB has signaled retroactive scrutiny.
- [ ] **Free, specific, informed, unambiguous consent** — generic "I agree to terms" is not enough. The lead form must list:
  - the categories of personal data being collected (name, phone, email, country, investment-tier interest);
  - the **purposes** for each (lead qualification, WhatsApp follow-up, email nurture, financial-due-diligence call);
  - the data fiduciary's identity (Mater Maria legal entity);
  - the contact for grievance redressal (file a Data Protection Officer email — recommend `dpo@matermariahomes.com`).
- [ ] **Withdrawal as easy as consent** — the privacy page must include a one-click "Withdraw consent" button that triggers deletion / suppression across Firebase, Supabase, the WhatsApp opt-out table, and Meta's pixel suppression list.
- [ ] **Notice in English and Malayalam** — the data-fiduciary notice must be available in English and any of the 22 Eighth-Schedule languages on user request. Malayalam covers our audience.
- [ ] **Children's data** — set the minimum age for consent at 18 on the form. DPDP requires verifiable parental consent for under-18; we have no business reason to collect minor data.
- [ ] **Cross-border transfer** — Mater Maria stores leads in Firebase (Google, US-region) and Supabase (region TBD). **VERIFY AT LAUNCH** the Supabase project region; recommend an India-region project (`ap-south-1`) and configure Firebase to use `asia-south1`. Transfer to permitted countries is allowed under the Rules; document the transfer basis in the privacy notice.

### UAE PDPL

- [ ] UAE has no DPDP-equivalent extraterritorial reach to match India, but Federal Decree-Law No. 45 of 2021 (PDPL) governs processing of UAE residents' data. Same consent + withdrawal architecture satisfies both — build once, comply twice.

**Owner:** Counsel + Eng  ·  **Status:** BLOCKS LAUNCH for WhatsApp bot path; non-blocking for ad delivery if bot is held back to v2.

---

## Section 4 — Likeness, Faith, and Trust-Stack content

### Bishop Mar Jose Pulickal — likeness consent

- [ ] **Written, signed consent** on file before any creative featuring the bishop's name, image, voice, or likeness ships. Required scope:
  - Name and image use in paid digital advertising on Meta surfaces (FB, IG, Reels);
  - Geographic scope: GCC + India + global re-share;
  - Duration: minimum 24 months from campaign launch with renewal option;
  - Right of revocation with 30-day takedown SLA on the Mater Maria side.
- [ ] File location: `03-CLIENT-MANAGEMENT/client-portals/MATER MARIA HOMES/legal/likeness-consents/bishop-pulickal-2026.pdf`.
- [ ] **Same consent template** for: Fr. Mathew Puthumana, Rajeev Abraham, Thomas Abraham, Paul Jose if their names or likenesses appear in any creative or landing-page testimonial.

### Faith-aligned creative — GCC restrictions

- [ ] **UAE & Saudi Arabia paid-media climate**: Meta itself permits religious imagery, but UAE federal law on "promotion of religion other than Islam" creates real risk for explicit Christian symbolism in paid placements served to local Muslim audiences. **Recommended posture**:
  - Variant V3 ("Faith & Community") **runs in India geo only** during the test phase. Do not include AE / SA / KW / QA in the V3 ad-set delivery.
  - For GCC delivery, use V1 / V2 / V4 / V5 (legacy, ROI, healthcare, exclusivity) — all faith-neutral.
  - In `cli-commands.sh § 4` add per-ad geo-overrides or split V3 into a separate India-only ad set.
- [ ] **Symbolism review** — no crucifixes, no scripture overlays, no Marian iconography in any creative served outside India. The chapel-adjacent shot in V3 should crop to landscape/architecture rather than recognizable religious symbols.
- [ ] **No explicit calls to faith** in the CTA copy ("for the faithful", "blessed by the bishop", "pray over your investment"). These will draw "deceptive religious appeal" rejections in Meta's Spirituality & Religious Beliefs policy review.

**Owner:** Creative + Counsel  ·  **Status:** BLOCKS LAUNCH for V3 GCC delivery; non-blocking for India-only V3.

---

## Section 5 — Landing-page legal hygiene

`matermariahomes.com/invest` and surrounding routes must include:

- [ ] **Privacy Policy** (`/privacy`) — DPDP-compliant, lists data categories, purposes, fiduciary identity, DPO contact, withdrawal mechanism, retention period, cross-border transfer countries.
- [ ] **Terms of Service** (`/terms`).
- [ ] **Investment Risk Disclosure** (`/invest/risk-disclosure`) — full risk recital, including: capital is not guaranteed; dividends depend on project performance; lock-in periods; redemption mechanics; tax implications for NRI investors; jurisdiction of dispute resolution.
- [ ] **Cookie Policy** (`/cookies`) — Meta Pixel and CAPI explicitly disclosed; user can opt out of pixel firing.
- [ ] **Pixel + Conversions API consent banner** — for EU traffic and GCC traffic from EU-resident expats. Use a CMP that gates pixel firing until consent is given.
- [ ] **"We received your info" / thank-you page** at `/invest/thank-you` — required by Meta lead-form policy when form completion drives an off-platform redirect.
- [ ] **Lead-form questions audit** — current Meta Instant Form must NOT request:
  - National ID / Aadhaar / Emirates ID — illegal under DPDP without explicit purpose, illegal under Meta policy;
  - Passport number — same;
  - Bank account number / NRE/NRO account number — illegal pre-disclosure;
  - Financial net worth — Meta policy bars this on lead forms.
  - Permitted: name, email, mobile (E.164), country of residence, indicative tier interest (Silver/Gold/Diamond/Platinum), preferred contact window. **Anything beyond this is gated to a follow-up call by the sales desk, not the lead form.**

**Owner:** Eng + Counsel  ·  **Status:** Privacy / Risk / Cookie pages BLOCK LAUNCH; thank-you page BLOCKS LAUNCH; pixel banner blocks EU delivery only.

---

## Section 6 — Pre-launch checklist (consolidated)

| # | Item | Owner | Blocks launch |
|---|---|---|---|
| 1 | Set `--special-ad-categories '["HOUSING"]'` in cli-commands.sh § 1 | BDM | Y |
| 2 | Rework `audience-targeting.md § 1` — strip expat behaviors, retirement/finance/real-estate interests | BDM | Y |
| 3 | Drop Catholic interest cluster from audience layer; relocate faith messaging to creative only | BDM | Y |
| 4 | Widen age band to 18+ in all three audiences | BDM | Y |
| 5 | Confirm GCC city radius floor with Meta rep (default 25 km) | BDM | Y |
| 6 | Rewrite ROI claim in V2 from "Total returns model out at 150–153%" to projection language | Creative | Y |
| 7 | Replace footer disclaimer with consolidated SEBI-compliant version on all 5 creatives | Creative | Y |
| 8 | SEBI-IA / Cat-5 licensee sign-off on financial projections (PDF on file) | Counsel + Client | Y |
| 9 | Confirm Cat-5 marketing license held by Mater Maria or appointed marketing partner; else exclude AE/GCC | Counsel + Client | Y |
| 10 | Lead-form consent text added with WhatsApp checkbox above submit | Eng | Y |
| 11 | WhatsApp templates (welcome, ROI follow-up, booking nudge) submitted to Meta + approved | Eng + BDM | Y |
| 12 | Bot first-message identifies as automated; STOP keyword honored; opt-out persistence built | Eng | Y |
| 13 | DPDP-compliant privacy notice published at `/privacy` (English + Malayalam available) | Counsel + Eng | Y |
| 14 | DPO contact (`dpo@matermariahomes.com`) live and monitored | Client | Y |
| 15 | One-click "withdraw consent" mechanism wired to Firebase + Supabase + WhatsApp opt-out table | Eng | Y |
| 16 | Supabase project moved to `ap-south-1`; Firebase set to `asia-south1`; transfers documented | Eng | Y |
| 17 | Bishop Pulickal likeness consent on file (24-month scope, revocable) | Counsel + Client | Y |
| 18 | Other on-creative individuals (Fr. Puthumana, Rajeev, Thomas, Paul) likeness consents on file | Counsel + Client | Y |
| 19 | V3 (Faith & Community) ad set restricted to India geo only; symbolism reviewed | Creative + BDM | Y |
| 20 | Investment Risk Disclosure page published at `/invest/risk-disclosure` | Counsel + Eng | Y |
| 21 | Cookie Policy + CMP banner gating Pixel/CAPI for EU/EEA traffic | Eng | Partial (EU only) |
| 22 | Lead form audited — no Aadhaar / Emirates ID / passport / bank fields requested | Eng | Y |
| 23 | "We received your info" thank-you page live at `/invest/thank-you` | Eng | Y |
| 24 | Standard SEBI risk warning visible on every creative (10pt+ legible) | Creative | Y |
| 25 | LAL plan in `campaign-brief.md § Test/Scale` reworked to use HOUSING-compatible seed only | BDM | Y |
| 26 | If any AI-generated imagery is used (e.g., architectural renders, video B-roll), label disclosure planned per Meta AI-info policy | Creative | Y |
| 27 | Media-budget baselines in `campaign-brief.md` and `kpi-dashboard.md` revised upward for HOUSING-induced CPL inflation (1.5–2x) | BDM | N (advisory) |
| 28 | Final creative + targeting walkthrough with Meta account rep before unpause | BDM | N (strongly recommended) |

**Top-3 launch-blocking risks** (do not unpause until cleared):

1. **HOUSING category undeclared + audience built on prohibited demographics** — campaign will be auto-rejected or, worse, deliver and trigger a Meta civil-rights enforcement action.
2. **150–153% return claim with no SEBI-IA / CMA-Cat-5 sign-off** — exposes Mater Maria's directors personally under SEBI Sec 12A misleading-advertisement provisions and UAE CMA cross-border enforcement.
3. **WhatsApp bot live without explicit form consent + approved templates + bot-disclosure** — first complaint to Meta or a DPDP grievance cell takes the WhatsApp number down within 48 hours and brands the FB Page as a policy-violator (bleeds quality score across the campaign).

---

## Sources

- [Meta Housing Ads 2026 — Geo-Targeting Under Special Ad Category](https://mediastrobe.medium.com/meta-housing-ads-2026-the-complete-guide-to-geo-targeting-under-special-ad-category-restrictions-c008de7252ca)
- [Meta Special Ad Categories — official policy summary](https://leadenforce.com/blog/meta-special-ad-category-what-it-is-and-how-to-stay-compliant)
- [WhatsApp Business Messaging Policy 2026](https://whatsboost.in/blog/whatsapp-business-messaging-policy-a-complete-guide-for-2026)
- [Meta — Get opt-in for WhatsApp (developer docs)](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in)
- [DPDP Rules 2025 / 2026 Compliance — Rainmaker](https://rainmaker.co.in/dpdp-rules-2025-compliance-2026-faqs-for-indian-companies/)
- [Hogan Lovells — India Consent Management Rules under DPDP](https://www.hoganlovells.com/en/publications/india-publishes-consent-management-rules-under-digital-personal-data-protection-act)
- [SEBI Master Circular for Investment Advisers (June 2025)](https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/44017/SEBI-issued-Master-Circular-for-Investment-Advisers-JUN272025.pdf)
- [SEBI Advertisement Code — Lexology](https://www.lexology.com/library/detail.aspx?g=d1aafbb4-64df-4677-ab75-64b73b6faa14)
- [UAE CMA framework — Al Tamimi (Jan 2026)](https://www.tamimi.com/news/uae-capital-market-regulatory-overhaul-key-changes-from-1-january-2026/)
- [UAE CMA Category 5 marketing license guide](https://www.zitadelleag.com/news/sca-category-5-authorization-in-the-uae-marketing-promotions-license-explained)
- [Meta — How AI-generated images in ads are identified and labeled](https://www.meta.com/help/artificial-intelligence/355108217670024/)
