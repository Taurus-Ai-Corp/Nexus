# LinkedIn Jobs Posting API Access Request Guide

## Overview

This document provides instructions for requesting LinkedIn Jobs Posting API access for TAURUS AI platforms.

## ⚠️ Critical Update: Current API Access Status

**Important:** LinkedIn is currently **NOT accepting new partnerships** for the Job Posting API directly. The official documentation states:

> "We are currently not accepting new partnerships for LinkedIn's Job Posting API. If you would like to gain access to LinkedIn's Job Posting APIs please request access to Apply Connect."

### Recommended Path: Apply Connect

**Apply Connect** is LinkedIn's recommended path for accessing job posting capabilities. Apply Connect provides:
- Job posting API access
- Onsite apply functionality
- Integration with ATS systems
- Currently accepting new partner applications

**Apply Connect Documentation:** https://learn.microsoft.com/en-us/linkedin/talent/apply-connect

## Request Process

### Option A: Apply Connect (Recommended)

1. **Review Apply Connect Documentation**
   - URL: https://learn.microsoft.com/en-us/linkedin/talent/apply-connect
   - Understand integration requirements and capabilities

2. **Submit Apply Connect Application**
   - Contact LinkedIn Business Development
   - Request Apply Connect partner access
   - Provide TAURUS AI use case details

3. **Complete Partner Onboarding**
   - Follow LinkedIn's partner onboarding process
   - Sign API agreement
   - Receive API credentials

### Option B: Partner Application Form (Alternative)

**Form URL:** https://business.linkedin.com/talent-solutions/ats-partners/partner-application

**Required Information:**
- First name, Last name, Email
- Company Name: TAURUS AI CORP
- Company Website: https://taurusai.io
- Company Description: Select "Other" or appropriate category
- Integration Interest: Check "Job Postings" and "Apply Connect"
- Customer regions: North America
- Company HQ: North America
- Customer count: Provide actual number
- Daily active jobs: Estimate based on co-op posting frequency (10-20/month)
- List of 5 largest customers (with LinkedIn company page links)
- Partnership rationale: Describe multi-platform co-op automation use case

### Step 1: Contact LinkedIn Business Development

**Contact Information:**
- LinkedIn Business Development Team
- Email: business-solutions@linkedin.com
- Website: https://business.linkedin.com/talent-solutions/contact-us

### Step 2: Complete Partner Onboarding Form

**Required Information:**
- Company Name: TAURUS AI CORP
- Use Case: Multi-platform co-op position automation for TAURUS AI platforms
- Platforms: BizFlow AI, Nexus Creative, AssetGrid Crypto, OrionGrid RWA
- Expected Volume: 10-20 job postings per month across all platforms
- Integration Type: Automated job posting via API for co-op/internship positions

### Step 3: Submit Application

**Application Details:**
- **Use Case Description:**
  "TAURUS AI CORP operates multiple business platforms (BizFlow AI Orchestration, Nexus Creative Studio, AssetGrid Crypto Platform, and OrionGrid RWA Platform) and requires automated job posting capabilities for co-op and internship positions. We need to programmatically create, update, and manage job postings across these platforms with consistent branding and optimized content."

- **Technical Requirements:**
  - Jobs Posting API access
  - OAuth2 scopes: `r_jobs`, `w_jobs`
  - Company Page admin access
  - API rate limits appropriate for 10-20 postings/month

- **Compliance:**
  - All job postings will comply with LinkedIn's job posting guidelines
  - No discriminatory language
  - Accurate and truthful job descriptions
  - Proper company page association

### Step 4: Reference Documentation

- LinkedIn Jobs API Terms: https://www.linkedin.com/legal/l/job-posting-api-terms
- LinkedIn Jobs API Overview: https://learn.microsoft.com/en-us/linkedin/talent/job-postings/api/overview
- LinkedIn Developer Portal: https://www.linkedin.com/developers/

### Step 5: Follow Up

After submitting the application:
1. Monitor email for LinkedIn's response (typically 5-10 business days)
2. Complete any additional vetting requirements
3. Sign API agreement if approved
4. Receive API credentials and access tokens

## Next Steps After Approval

Once API access is approved:
1. Update environment variables with new credentials
2. Test API connection in sandbox environment
3. Implement job posting automation
4. Create first co-op position posting
5. Monitor and iterate based on performance

## Current Status

- [ ] Application submitted
- [ ] LinkedIn response received
- [ ] API credentials obtained
- [ ] Sandbox testing completed
- [ ] Production access granted

## Notes

- LinkedIn Jobs Posting API requires partner approval and is not publicly available
- **Current Status:** Direct Job Posting API partnerships are not being accepted
- **Recommended Path:** Apply Connect is the current recommended integration path
- Approval process typically takes 2-4 weeks after application submission
- System can be built in parallel while waiting for approval
- Fallback to manual posting available if API access is delayed

## Alternative Integration Options

If direct API access is not available:

1. **Apply Connect Integration** (Recommended by LinkedIn)
   - Provides job posting capabilities
   - Includes onsite apply functionality
   - Currently accepting applications

2. **XML Feed Integration**
   - Alternative to API for job distribution
   - Documentation: https://learn.microsoft.com/en-us/linkedin/talent/job-postings/xml-feeds

3. **Manual Posting with Automation**
   - Use automation tools to assist manual posting
   - Maintain consistency through templates

4. **Third-Party Job Distribution Services**
   - Integrate with job distribution platforms
   - May provide LinkedIn integration capabilities

