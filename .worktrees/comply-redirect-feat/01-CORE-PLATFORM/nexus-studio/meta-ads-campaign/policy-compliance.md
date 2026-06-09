# Nexus — Meta Ads Policy & Compliance Checklist

> One-stop pre-launch policy review for the Nexus lead-gen campaign (Kerala + UAE designers, admin-gated SaaS). Nexus does **not** trigger any Special Ad Category — it's a general business SaaS — so most of the work is around honesty in claims, AI-creative disclosure, DPDP/PDPL data handling, and the admin-approval gating being transparent on the lead form.
>
> Owner column: BDM · Eng · Creative · Counsel. Items flagged "BLOCKS LAUNCH" must clear before unpausing the campaign in `cli-commands.sh`.
>
> Verified against Meta Business Help Center (May 2026), MeitY DPDP Rules 2025, UAE PDPL (Federal Decree-Law No. 45 of 2021).

---

## Section 1 — Standard Meta Ads policy

### Special Ad Category — N/A

- [ ] Confirm `--special-ad-categories '[]'` (empty array) in `cli-commands.sh`. Nexus is a productivity SaaS for working freelancers — no housing, no credit, no employment, no social-issues / elections / politics content. The "Apply for early access" CTA is **not** an employment offer in the regulated sense (it's a SaaS application gate, not a job).

### Honesty-in-claims review

- [ ] **Variant 2** *"AI that actually ships code … 90 seconds from brief to a component you can drop into a client repo"* — verifiable claim required. Eng must confirm the median brief-to-component time on a representative test set is ≤90s; if it's 2 min, change copy to "in minutes" or "under two minutes". Meta's Misleading Claims policy rejects ads that materially overstate measurable performance.
- [ ] **Variant 4** *"Get paid Tuesday"* — colloquial enough that Meta likely won't flag, but it implies guaranteed income. **VERIFY AT LAUNCH** with Meta rep or pre-soft-launch ad review; safe rewrite: *"Get to invoiceable work faster."*
- [ ] **Variant 5** *"Free for the first 200 designers"* — scarcity claim is fine **if it's true and tracked**. The lead form must wire a counter to a real `early_access_seat` table; the moment seat 200 is filled, the creative is paused. False scarcity = Meta deceptive-content rejection on appeal.
- [ ] **No** "guaranteed", "best", "fastest", "unlimited", "instant" — already self-imposed in voice rules; reaffirm during creative QA.
- [ ] **48-hour approval claim** (V2, V5) — must reflect real ops SLA. If admin-approval is currently 72h on average, change copy to match. Misalignment between ad copy and actual experience is a top driver of low Customer Feedback Score (CFS), which throttles delivery.

### AI-generated creative disclosure (Meta 2026 rules)

Meta now requires "AI info" labeling on any creative where AI tools generated or materially modified visual subjects. Undisclosed AI is currently the cause of ~14% of ad rejections platform-wide.

- [ ] **Variant 1 visual** (split-screen of 7 chaotic tabs vs Nexus workspace) — if produced via Midjourney/DALL-E/Imagen, disclose. If shot/composed in Figma + screenshot, no disclosure needed.
- [ ] **Variant 2 visual** (screen-recording of playground morphing into Tailwind JSX) — likely real product capture, no disclosure needed. Confirm.
- [ ] **Variant 3 visual** (clean dark UI + "Approved" badge) — real product UI; no disclosure.
- [ ] **Variant 4 visual** (3-frame storyboard) — if AI-generated frames, disclose.
- [ ] **Variant 5 visual** (designer at coffee shop, "real not stock") — if licensed stock or real photography, no disclosure. If AI-generated portrait of a synthetic person, **mandatory disclosure** and may also fall under Meta's photorealistic-AI-human label which surfaces next to "Sponsored".
- [ ] **Process** — for any AI-touched creative, set the AI-content flag in Ads Manager → Creative Hub or pass `ai_generated_content` in the API creative spec when supported. **VERIFY AT LAUNCH** the exact CLI flag in the installed `meta-ads` package; the API surface for self-disclosure is still maturing as of early 2026.

### Restricted-content scan

- [ ] No prohibited categories (drugs, weapons, adult, financial scams) — N/A.
- [ ] No before/after personal-transformation imagery — N/A.
- [ ] No personal-attribute callouts ("Are you a struggling designer?") — already followed.

**Owner:** Creative + BDM  ·  **Status:** Items 1–4 BLOCK LAUNCH (claims accuracy + AI disclosure); rest are advisory.

---

## Section 2 — India DPDP Act 2023 compliance

### Lead-form consent text

- [ ] The Meta Instant Form Privacy Policy URL must point to a published Nexus privacy notice that satisfies DPDP § 5 (notice requirements):
  - data categories collected (name, email, primary tool, team size, country);
  - purposes (early-access qualification, admin review, onboarding emails, occasional product updates);
  - data fiduciary identity (operating brand: Nexus by Taurus AI; legal entity: TAURUS AI CORP - FZCO);
  - DPO contact email (recommend `dpo@nexus.taurusai.io`);
  - retention period;
  - withdrawal mechanism.
- [ ] **Custom-question consent line on the Instant Form**, placed before submit:

  > *I consent to TAURUS AI CORP processing the information above to evaluate my early-access application and contact me about Nexus. I can withdraw consent at any time at nexus.taurusai.io/privacy.*

### Withdrawal of consent

- [ ] One-click "Delete my early-access application" button on `/privacy` and inside the Clerk dashboard once approved. Clicking it must:
  1. Delete the lead row from Supabase / Postgres / Clerk (whichever stores the pre-approval lead);
  2. Remove the email from the marketing list (Mailchimp / Resend / whatever is used);
  3. Add the hashed email to Meta's pixel suppression list so future delivery skips the user.
- [ ] Withdrawal must be **as easy as consent** (DPDP requirement) — same number of clicks, no login wall for unapproved leads.

### Right to access

- [ ] DPO inbox monitored; access requests answered within 30 days. Even if volume is low, ops SLA must be documented.

### Data localization

- [ ] DPDP doesn't enforce hard localization (unlike RBI for fintech), but cross-border transfer must be documented. Nexus stores data in:
  - **Clerk** (US) — auth + user records;
  - **Supabase** (region TBD) — application/lead data;
  - **Meta** (US/EU) — Meta-hosted Instant Form leads before they sync to Supabase.
- [ ] Document each in the privacy policy. **VERIFY AT LAUNCH** the Supabase project region; recommend `ap-south-1` for Indian leads or document the chosen region as the data-transfer destination.

**Owner:** Eng + Counsel  ·  **Status:** Privacy notice + consent text + withdrawal mechanism BLOCK LAUNCH.

---

## Section 3 — UAE PDPL compliance

UAE Federal Decree-Law No. 45 of 2021 (Personal Data Protection Law) governs processing of UAE residents' data.

### Cross-border transfer rules

- [ ] PDPL Art. 22–23 permits transfer to countries with "adequate protection" or under specific safeguards (consent, contractual safeguards). Document the basis of each Nexus transfer (Clerk → US, Supabase → wherever) in the same privacy notice used for India.
- [ ] If processing rises to "high-risk" per PDPL standards (it does not here — small-scale SaaS lead capture), a Data Protection Impact Assessment would be required. Nexus is below the threshold. Re-assess if user volume crosses 10K active accounts.

### Marketing consent specificity

- [ ] PDPL Art. 5 requires specific, informed, freely-given consent for processing — same standard as DPDP. The single consent line drafted in Section 2 above satisfies both regimes.
- [ ] **Separate marketing-emails consent** is good practice (not strictly required for this lead form, since the primary purpose IS evaluation + contact). If Nexus later starts a separate newsletter, that's a new consent.

**Owner:** Counsel  ·  **Status:** Non-blocking — same consent architecture as DPDP satisfies UAE.

---

## Section 4 — Admin-approval gate transparency

The Clerk admin-approval step is the load-bearing UX surprise. Meta's "Lead Quality" / Customer Feedback Score policy will punish ads where landing-page experience materially diverges from the ad's promise. Set expectations on the form, not after.

- [ ] **Lead form description text** (the field above the questions):

  > *Nexus is application-only and approval typically takes up to 48 hours. After you submit, we'll review your portfolio context and email you with a decision. If approved, you'll get a setup link the same day.*

- [ ] **Thank-you screen** — restate the 48h timeline + give a manageable expectation about the email sender domain so leads don't filter our approval email as spam:

  > *Thanks. Watch for an email from hello@nexus.taurusai.io within 48 hours.*

- [ ] **Email approval cadence audit** — pull the last 30 days of approval times. If P90 is 72h, the ad copy and form text must say 72h, not 48h. Closing the gap between promise and reality is the single biggest lever for protecting CFS.
- [ ] **Rejection emails** are permitted under Meta policy but should be human-tone and offer a re-application window. V5's "or tell you why not" promise must be honored — silence on rejection is worse than honest rejection in CFS terms.

**Owner:** BDM + Creative + Eng  ·  **Status:** Form description + thank-you copy BLOCK LAUNCH.

---

## Section 5 — Pre-launch checklist (consolidated)

| # | Item | Owner | Blocks launch |
|---|---|---|---|
| 1 | Confirm `--special-ad-categories '[]'` in cli-commands.sh; no SAC declaration needed | BDM | Y |
| 2 | Verify "90 seconds brief→component" claim with real measurement; rewrite if median >90s | Eng + Creative | Y |
| 3 | Verify "48-hour approval" claim against last-30-days P90 admin SLA; align copy to reality | BDM + Eng | Y |
| 4 | Wire `early_access_seat` counter to Variant 5; pause creative when seat 200 fills | Eng | Y |
| 5 | Audit each variant's visual for AI-tool involvement; flag AI-info disclosure where applicable | Creative | Y |
| 6 | Confirm Variant 5's "designer at coffee shop" image is real photo or licensed stock — not synthetic person | Creative | Y |
| 7 | Publish DPDP+PDPL-compliant privacy notice at `nexus.taurusai.io/privacy` | Counsel + Eng | Y |
| 8 | Add custom-question consent line to Meta Instant Form (above submit) | Eng | Y |
| 9 | Set Privacy Policy URL on Instant Form to the published `/privacy` page | Eng | Y |
| 10 | DPO inbox `dpo@nexus.taurusai.io` live and routed | BDM | Y |
| 11 | One-click "Delete my early-access application" mechanism wired across Clerk + Supabase + email list + Meta suppression | Eng | Y |
| 12 | Supabase project region confirmed (recommend `ap-south-1`) and documented in privacy notice | Eng | Y |
| 13 | Lead-form description text sets the 48h-or-actual approval expectation | Creative + BDM | Y |
| 14 | Thank-you screen restates timeline + sender-email domain | Creative + Eng | Y |
| 15 | Rejection-email template drafted (human tone, re-application window) | Creative + BDM | Y |
| 16 | Lead-form question audit — no national ID, passport, or financial-net-worth fields | Eng | Y |
| 17 | Pixel + CAPI server events tested (`PageView`, `Lead`, `account_approved`, `account_activated`) | Eng | Y |
| 18 | Cookie banner / CMP gating Pixel firing for EU traffic if applicable | Eng | Partial (EU only) |
| 19 | Brand on creative confirmed as "Nexus", not "TAURUS AI CORP - FZCO" or "Taurus AI" | Creative | Y |
| 20 | Customer Feedback Score baseline established post-launch — re-evaluate creative if CFS drops below 3.0 | BDM | N (post-launch) |

**Top launch-blocking risk:**

1. **Admin-approval expectation mismatch.** If the ad promises 48h approval and the actual admin SLA is 72h+, Nexus will accumulate negative-feedback signals fast (Meta surfaces this as Customer Feedback Score). At small budgets this manifests as rapid CPM inflation and eventual ad-account warnings. Fix is cheap — measure the real SLA, write the real number on the ad and the form. Do this first.

The DPDP / PDPL items are bureaucratic but each is a small build; together they are ~1 day of eng + counsel time. The AI-disclosure scan is a 30-minute creative review. None of these individually block launch; collectively they must all be cleared before the campaign goes live.

---

## Sources

- [Meta Special Ad Categories — official policy summary](https://leadenforce.com/blog/meta-special-ad-category-what-it-is-and-how-to-stay-compliant)
- [Meta Ads Policy Update March 2026](https://www.auditsocials.com/blog/meta-ad-policy-updates-2026-guide)
- [Meta — How AI-generated images in ads are identified and labeled](https://www.meta.com/help/artificial-intelligence/355108217670024/)
- [Meta's AI Disclosure Rules: What Advertisers Must Know](https://www.adamigo.ai/blog/meta-ai-disclosure-rules-advertisers-know)
- [DPDP Rules 2025 / 2026 Compliance — Rainmaker](https://rainmaker.co.in/dpdp-rules-2025-compliance-2026-faqs-for-indian-companies/)
- [DPDP Act: What Digital Marketers in India Must Know in 2026 — FirstLaunch](https://firstlaunch.in/blog/dpdp-act-marketers-2026/)
- [DLA Piper — Data Protection Laws of the World: India](https://www.dlapiperdataprotection.com/?t=law&c=IN)
