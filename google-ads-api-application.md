# Google Ads API Developer Token Application
## Taurus AI Corp FZCO

---

## 1. Company Information

| Field | Value |
|-------|-------|
| **Legal Entity Name** | Taurus AI Corp FZCO |
| **License Number** | IFZA License #68122 |
| **Jurisdiction** | Dubai, United Arab Emirates (IFZA Free Zone) |
| **Registered Address** | IFZA, Dubai Silicon Oasis, Dubai, UAE |
| **Website** | https://nexus.taurusai.io |
| **Contact Email** | admin@taurusai.io |
| **Business Type** | AI-powered creative technology (SaaS) |

---

## 2. Application Overview

Taurus AI Corp FZCO operates **Nexus Creative**, an AI-powered platform that generates campaign assets (image prompts, headlines, platform-specific copy) for brands and agencies. We are applying for a Google Ads API Developer Token to read performance data from our clients' Google Ads accounts, enabling our AI to optimize future campaign asset generation based on real-world performance signals.

---

## 3. Use Case Description

### Problem
Brands and agencies spend significant time and budget on creative production for ad campaigns. After launching campaigns, there is no automated feedback loop between ad performance data (CTR, ROAS, conversion rates) and the creative production pipeline. This means the next round of campaign assets is often created without data-driven insights from previous campaigns.

### Solution
Nexus Creative bridges this gap by:
1. Reading Google Ads performance metrics (impressions, clicks, CTR, conversions, ROAS, cost) from client-linked accounts
2. Analyzing which creative themes, headlines, and visual styles drive the best performance
3. Using these insights to optimize AI-generated campaign assets for future campaigns

### Data Access Requested
We request **read-only** access to the following Google Ads API resources:
- **Campaign** performance data (status, budget, bidding strategy)
- **Ad Group** performance metrics
- **Ad** creative performance (headline CTR, description effectiveness)
- **Keyword** performance (quality score, search term relevance)
- **Asset** performance (image/video engagement metrics when available)

### What We Will NOT Do
- Create, update, or pause campaigns, ad groups, or ads
- Modify budgets or bidding strategies
- Upload creative assets directly to Google Ads
- Access any data beyond what is necessary for performance analysis
- Share client data between accounts or with third parties

---

## 4. API Access Level Requested

**Basic Access (Production)**

We require Basic access rather than Standard because:
- We only perform read operations (no mutate operations)
- Our estimated API call volume is well within Basic access limits (<5,000 operations/day across all client accounts)
- We do not need to create or modify any Google Ads entities
- Our access pattern is periodic batch reads (daily sync of performance metrics), not continuous high-frequency polling

---

## 5. Technical Architecture

### System Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│  Client Google   │────▶│  Google Ads API   │────▶│  Nexus Creative │
│  Ads Account     │     │  (read-only)      │     │  Backend        │
└─────────────────┘     └──────────────────┘     └───────┬────────┘
                                                          │
                                                          ▼
                                                 ┌────────────────┐
                                                 │  AI Analysis    │
                                                 │  Engine          │
                                                 └───────┬────────┘
                                                         │
                                                         ▼
                                                 ┌────────────────┐
                                                 │  Optimized       │
                                                 │  Campaign Assets │
                                                 └────────────────┘
```

### Component Details

**1. Google Ads API Integration Layer** (Node.js / Vercel Serverless)
- Authenticates via OAuth2 using the Google Ads API client library
- Uses the `GoogleAdsService.Search` method for read-only queries
- Supports multiple client accounts via manager account (MCC) hierarchy
- Rate-limited to stay within API quota (max 5 requests/second, daily sync windows)

**2. Performance Data Pipeline**
- Daily scheduled sync (via cron / Vercel Cron) at 06:00 UTC
- Fetches previous-day metrics: impressions, clicks, CTR, conversions, conversion_value, cost, ROAS
- Stores normalized data in PostgreSQL (Drizzle ORM)
- Anonymizes data at rest; only aggregate performance signals feed the AI engine

**3. AI Analysis Engine**
- Receives performance signals as structured input
- Correlates creative attributes (headline style, visual theme, CTA type) with performance
- Generates optimized creative briefs and prompts for future assets
- Does NOT directly modify any Google Ads entity

**4. Client Authorization Flow**
- Clients authorize Nexus via OAuth2 consent screen
- Scope: `https://www.googleapis.com/auth/adwords.readonly`
- Access tokens stored encrypted; refreshed automatically
- Clients can revoke access at any time from their Google Account settings

### API Query Examples

```sql
-- Campaign performance (daily aggregate)
SELECT
  campaign.name,
  campaign.status,
  metrics.impressions,
  metrics.clicks,
  metrics.ctr,
  metrics.conversions,
  metrics.cost_micros,
  segments.date
FROM campaign
WHERE segments.date DURING YESTERDAY

-- Ad creative performance
SELECT
  ad_group_ad.ad.name,
  ad_group_ad.ad.type,
  ad_group_ad.ad.text_ad.headline,
  metrics.clicks,
  metrics.ctr,
  metrics.conversions
FROM ad_group_ad
WHERE segments.date DURING LAST_7_DAYS
```

### Technology Stack
- **Runtime**: Vercel Serverless Functions (Node.js 18+)
- **API Client**: `google-ads-api` (npm) or `google-ads-node`
- **Database**: PostgreSQL (Neon / Supabase)
- **ORM**: Drizzle ORM with TypeScript
- **OAuth**: NextAuth.js with Google provider
- **Deployment**: Vercel with edge functions and cron triggers

---

## 6. Compliance with Google Ads API Policies

### 6.1 Acceptable Use
- We only access data that clients have explicitly authorized via OAuth2 consent
- Our use case (reading performance data to improve creative outputs) falls within the "analytics and reporting" category
- We do not scrape, clone, or redistribute Google Ads data

### 6.2 Data Handling
- Client data is isolated per-account (no cross-account data sharing)
- Performance data is encrypted at rest (AES-256) and in transit (TLS 1.3)
- Data retention: 90 days for raw metrics, indefinitely for aggregated/anonymized insights
- Clients can request data deletion at any time (GDPR Article 17 compliance)
- No data is sold, shared, or transferred to third parties

### 6.3 Rate Limits & Quotas
- We respect all Google Ads API rate limits and quota
- Implement exponential backoff on 429 / 503 responses
- Use `google-ads-api` built-in retry logic
- Monitor quota usage via `developer_token` limit headers

### 6.4 Authentication & Security
- OAuth2 with read-only scope (`adwords.readonly`)
- Refresh tokens stored encrypted (AWS KMS / Vercel Encrypted Env Vars)
- No write access to any Google Ads account
- Regular security audits of OAuth token storage

### 6.5 Client Consent
- Each client must explicitly authorize Nexus via the Google OAuth consent screen
- The consent screen clearly states: "Nexus Creative will read your Google Ads performance data to optimize AI-generated campaign assets"
- Clients can revoke access at any time via Google Account Settings or by contacting admin@taurusai.io

### 6.6 Prohibited Use
We confirm we will NOT:
- Create or modify any Google Ads entities (campaigns, ad groups, ads, keywords)
- Use the API for competitive intelligence or ad spy tools
- Resell or redistribute Google Ads data
- Access client accounts without explicit OAuth authorization
- Attempt to circumvent API quotas or rate limits

---

## 7. Testing Plan

### Pre-Launch Testing
1. Use Google Ads API with test accounts to verify read-only operations
2. Validate OAuth2 flow end-to-end with sandbox accounts
3. Confirm rate limit handling with simulated load
4. Test data isolation between client accounts
5. Verify error handling for expired/revoked tokens

### Production Rollout
1. Onboard 3 pilot clients with existing Google Ads accounts
2. Monitor API usage for 14 days
3. Verify no mutate operations are accidentally triggered
4. Document any edge cases in data sync

---

## 8. Additional Information

### Why Google Ads API (not just UI exports)?
- Automated daily sync eliminates manual CSV exports
- Structured API responses enable real-time AI optimization
- Multi-account support scales with our client base
- API data is more reliable and timely than manual reports

### Business Justification
- Nexus Creative serves fashion, real estate, F&B, and beauty brands in the UAE and globally
- Reading Google Ads performance data allows us to close the feedback loop between ad spend and creative quality
- This directly improves our clients' ROAS and campaign effectiveness

### Prior Experience
- Taurus AI has been building AI-powered tools since 2024
- Our development team has experience with OAuth2 integrations (Google Workspace, Stripe)
- We have reviewed the Google Ads API documentation and terms of service in full

---

## 9. Application Checklist

- [ ] Company verification document (IFZA License #68122) attached
- [ ] App registration created in Google Cloud Console
- [ ] OAuth consent screen configured with `adwords.readonly` scope
- [ ] Developer token requested via Google Ads API Center
- [ ] Test account access verified
- [ ] MCP/manager account (MCC) set up for multi-client access

---

## 10. Contact Information

| Role | Name | Email |
|------|------|-------|
| Technical Contact | Taurus AI Engineering | admin@taurusai.io |
| Business Contact | Taurus AI Corp FZCO | admin@taurusai.io |
| Legal Contact | Taurus AI Corp FZCO | admin@taurusai.io |

---

*Application prepared by Taurus AI Corp FZCO for Google Ads API Basic Access (Production).*
*Last updated: 2026-06-16*
