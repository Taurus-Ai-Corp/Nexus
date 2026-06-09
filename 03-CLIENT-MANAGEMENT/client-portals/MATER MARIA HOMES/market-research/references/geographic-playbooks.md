# Geographic Playbooks

## India (Kerala-Specific)

### Regulatory
- RERA (Real Estate Regulatory Authority) registration mandatory for all property marketing
- DPDP Act 2023 compliance for digital marketing and data collection
- GST on real estate: 5% without ITC for residential
- FEMA regulations for NRI property investment
- RBI guidelines for NRI repatriation of sale proceeds

### Payment
- Razorpay for INR collection (recommended for Kerala market)
- UPI integration for local payments
- NEFT/RTGS for large NRI transfers
- Escrow account structure for investor protection

### Hosting
- Vercel (primary) — fast global CDN, good for NRI audience
- AWS Mumbai region for India-specific compliance
- Cloudflare for DDoS and edge caching

### Compliance Checklist
- [ ] RERA registration number on all marketing materials
- [ ] DPDP Act 2023 privacy policy and consent mechanisms
- [ ] GST registration and invoicing
- [ ] FEMA compliance for NRI transactions
- [ ] ISO 9001 certification (if claimed)
- [ ] Diocese/religious body endorsement documentation

---

## UAE / Gulf (NRI Source Market)

### Regulatory
- No direct restrictions on marketing Indian real estate to UAE residents
- ADGM/DIFC regulations if establishing UAE entity for marketing
- UAE data protection law compliance for lead collection

### Payment
- AED to INR conversion via exchange houses
- Wire transfer to Indian escrow accounts
- Crypto payments NOT recommended (regulatory risk)

### Hosting
- Vercel edge network covers UAE well
- Consider AWS Dubai region for latency-sensitive features

### Compliance Checklist
- [ ] Arabic language option (optional but recommended)
- [ ] UAE contact number (provided — +971 505786471)
- [ ] Gulf-specific marketing disclaimers
- [ ] Ramadan-sensitive campaign timing

---

## UK / Europe

### Regulatory
- GDPR compliance for EU/UK data subjects
- FCA regulations if offering investment advice
- Unfair Trading Regulations 2008 (UK) for property marketing claims

### Payment
- GBP to INR via bank transfer
- Wise (formerly TransferWise) for cost-effective transfers
- Consider multi-currency pricing display

### Hosting
- Vercel London edge node
- GDPR-compliant analytics (Plausible or Fathom instead of Google Analytics)

### Compliance Checklist
- [ ] GDPR privacy policy and cookie consent
- [ ] Right to erasure process
- [ ] Data processing agreement with vendors
- [ ] UK contact number (provided — +44 7723306974)

---

## USA / Canada

### Regulatory
- CAN-SPAM Act for email marketing
- CCPA (California) / PIPEDA (Canada) for data privacy
- SEC regulations if offering investment securities (not applicable for real estate)
- State-specific real estate marketing laws

### Payment
- USD/CAD to INR wire transfer
- ACH for US-origin transfers
- Consider Stripe for deposit collection (if US entity exists)

### Hosting
- Vercel US edge nodes
- AWS US-East for backup

### Compliance Checklist
- [ ] CAN-SPAM unsubscribe mechanism
- [ ] CCPA/PIPEDA privacy disclosures
- [ ] US/Canada contact numbers (USA: TBD, Canada: +1 4038708524)
- [ ] FTC endorsement guidelines if using testimonials

---

## Australia

### Regulatory
- Australian Consumer Law (ACL) for marketing claims
- Spam Act 2003 for electronic marketing
- Privacy Act 1988 (APPs)

### Payment
- AUD to INR via bank transfer
- Consider local representative for trust-building

### Hosting
- Vercel Sydney edge node

### Compliance Checklist
- [ ] ACL-compliant marketing (no misleading claims)
- [ ] Spam Act consent for email
- [ ] Australian contact numbers (+61 415934654, +61 432896323)

---

## General NRI Marketing Compliance

### Required Disclaimers (All Markets)
- "This is not investment advice. Past performance does not guarantee future results."
- "RERA registration: [number]"
- "Subject to availability. Prices subject to change."
- "Images are representative. Actual residences may vary."

### Data Collection Consent
- Explicit opt-in for all marketing communications
- Separate consent for WhatsApp (India DPDP Act requirement)
- Clear privacy policy link on all forms
- Easy unsubscribe in every communication

### Cross-Border Data Transfer
- India DPDP Act 2023: Data fiduciaries must ensure cross-border transfer safeguards
- GDPR: Adequacy decisions or Standard Contractual Clauses
- Solution: Store Indian lead data in India (AWS Mumbai), use EU/US data only for analytics

---

*Reference for map-your-market skill*
