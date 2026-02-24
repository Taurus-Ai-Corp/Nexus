# LinkedIn Jobs Posting Guide

Complete guide for posting co-op positions to LinkedIn using the TAURUS AI automation system.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Platform-Specific Guides](#platform-specific-guides)
5. [API Reference](#api-reference)
6. [Workflow Automation](#workflow-automation)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Overview

The LinkedIn Jobs Posting system provides end-to-end automation for creating and posting co-op positions across all TAURUS platforms:

- **BizFlow** - AI Orchestration co-op positions
- **NeoVibe** - Creative Marketing co-op positions
- **AssetGrid** - Blockchain & Crypto co-op positions
- **OrionGrid** - RWA Blockchain co-op positions

### Features

- AI-powered job description generation
- Platform-specific templates
- Automatic infographic generation
- LinkedIn Jobs API integration
- N8N workflow automation
- Multi-platform posting support

## Prerequisites

### 1. LinkedIn Jobs API Access

⚠️ **Important:** LinkedIn Jobs Posting API requires partner approval. **Currently, LinkedIn is NOT accepting new partnerships for the Job Posting API directly.** 

**Recommended Path:** Apply Connect is LinkedIn's recommended integration path. See [LINKEDIN_JOBS_API_ACCESS_REQUEST.md](./LINKEDIN_JOBS_API_ACCESS_REQUEST.md) for complete details and application process.

**Current Status:**
- Direct Job Posting API partnerships: Not accepting new applications
- Apply Connect: Currently accepting applications (recommended)
- Partner Application Form: Alternative path (may have delays)

### 2. Environment Configuration

**Template File:** `08-shared/secrets/.env.linkedin-jobs-template`

Copy the template and configure your credentials:

```bash
# Copy template
cp 08-shared/secrets/.env.linkedin-jobs-template 08-shared/secrets/.env

# Edit .env file with your credentials
```

Set the following environment variables in `08-shared/secrets/.env`:

```bash
# LinkedIn Jobs API
LINKEDIN_JOBS_API_ENABLED=false  # Set to true after API approval
LINKEDIN_JOBS_API_TOKEN=your_jobs_api_token  # Provided after approval
LINKEDIN_COMPANY_ID=your_company_id  # TAURUS AI CORP LinkedIn Company ID
LINKEDIN_ACCESS_TOKEN=your_access_token  # OAuth access token
LINKEDIN_CLIENT_ID=your_client_id  # From LinkedIn Developer App
LINKEDIN_CLIENT_SECRET=your_client_secret  # From LinkedIn Developer App
LINKEDIN_PERSON_ID=your_person_id  # LinkedIn Person ID for job poster

# Optional: Vertex AI for enhanced descriptions
VERTEX_AI_PROJECT_ID=your_project_id
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_ACCESS_TOKEN=your_vertex_ai_token
```

### 3. Required Dependencies

```bash
pip install aiohttp pydantic pillow python-dotenv fastapi uvicorn
```

## Quick Start

### Method 1: Using MCP Server Tools

```python
from mcp_servers.linkedin.tools import linkedin_create_coop_position

# Create a co-op position for BizFlow
result = await linkedin_create_coop_position(
    platform="BizFlow",
    customizations={
        "duration": "4 months",
        "startDate": "2025-05-01"
    },
    post_to_linkedin=True
)
```

### Method 2: Using the Unified API

```bash
# Build co-op position
curl -X POST http://localhost:8000/api/linkedin/jobs/build-coop \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "BizFlow",
    "customizations": {
      "duration": "4 months"
    }
  }'

# Post to LinkedIn
curl -X POST http://localhost:8000/api/linkedin/jobs/post \
  -H "Content-Type: application/json" \
  -d @job_posting.json
```

### Method 3: Using N8N Workflows

1. Import workflow: `linkedin-coop-posting-workflow.json`
2. Configure platform and customizations
3. Trigger workflow manually or on schedule
4. Monitor results via notifications

## Platform-Specific Guides

### BizFlow Co-op Positions

**Target Audience:** Computer Science, Software Engineering students

**Key Skills:**
- Python programming
- FastAPI/web frameworks
- AI/ML concepts
- Cloud computing

**Example:**
```python
result = await build_coop_position(
    platform="BizFlow",
    customizations={
        "title": "AI Orchestration Co-op Student - BizFlow Platform",
        "duration": "8 months",
        "workLocationType": "HYBRID"
    }
)
```

### NeoVibe Co-op Positions

**Target Audience:** Marketing, Communications, Design students

**Key Skills:**
- Content creation
- Social media marketing
- Graphic design
- Brand management

**Example:**
```python
result = await build_coop_position(
    platform="NeoVibe",
    customizations={
        "duration": "4 months",
        "workLocationType": "REMOTE"
    }
)
```

### AssetGrid Co-op Positions

**Target Audience:** Computer Science, Blockchain, Finance students

**Key Skills:**
- Blockchain development
- Smart contracts (Solidity)
- Web3 technologies
- Cryptocurrency trading

**Example:**
```python
result = await build_coop_position(
    platform="AssetGrid",
    customizations={
        "duration": "4-8 months",
        "workLocationType": "REMOTE"
    }
)
```

### OrionGrid Co-op Positions

**Target Audience:** Computer Science, Finance, Blockchain students

**Key Skills:**
- RWA tokenization
- Smart contracts
- Regulatory compliance
- Asset management

**Example:**
```python
result = await build_coop_position(
    platform="OrionGrid",
    customizations={
        "duration": "8 months",
        "workLocationType": "HYBRID"
    }
)
```

## API Reference

### Build Co-op Position

**Endpoint:** `POST /api/linkedin/jobs/build-coop`

**Request:**
```json
{
  "platform": "BizFlow",
  "customizations": {
    "duration": "4 months",
    "startDate": "2025-05-01",
    "location": {
      "country": "US",
      "city": "San Francisco"
    }
  }
}
```

**Response:**
```json
{
  "platform": "BizFlow",
  "job_data": { ... },
  "linkedin_format": { ... },
  "template_used": "bizflow_coop_template.json",
  "enhanced": true
}
```

### Post Job to LinkedIn

**Endpoint:** `POST /api/linkedin/jobs/post`

**Request:**
```json
{
  "title": "AI Orchestration Co-op Student",
  "description": "...",
  "location": {
    "country": "US",
    "city": "San Francisco"
  },
  "employmentType": "INTERNSHIP",
  "workLocationType": "HYBRID",
  "skills": ["Python", "FastAPI", "AI/ML"]
}
```

### Generate Infographic

**Endpoint:** `POST /api/linkedin/jobs/generate-infographic`

**Request:**
```json
{
  "job_data": { ... },
  "platform": "BizFlow",
  "output_format": "png"
}
```

**Response:**
```json
{
  "success": true,
  "filepath": "/path/to/infographic.png",
  "filename": "bizflow_coop_ai_orchestration_20250127_120000.png",
  "format": "png",
  "dimensions": [1200, 1600]
}
```

### List Job Postings

**Endpoint:** `GET /api/linkedin/jobs?status=LISTED&limit=10`

**Response:**
```json
{
  "job_postings": [ ... ],
  "count": 5,
  "paging": { ... },
  "success": true
}
```

### Update Job Posting

**Endpoint:** `PATCH /api/linkedin/jobs/{job_id}`

**Request:**
```json
{
  "updates": {
    "status": "CLOSED",
    "description": "Updated description..."
  }
}
```

### Close Job Posting

**Endpoint:** `POST /api/linkedin/jobs/{job_id}/close`

## Workflow Automation

### N8N Workflows

#### Single Platform Posting

1. **Workflow:** `linkedin-coop-posting-workflow.json`
2. **Steps:**
   - Load platform template
   - Generate AI-enhanced description
   - Create infographic
   - Post to LinkedIn
   - Share on company page
   - Notify stakeholders

#### Multi-Platform Posting

1. **Workflow:** `multi-platform-job-poster.json`
2. **Steps:**
   - Iterate through all platforms
   - Build and post each position
   - Collect results
   - Send summary notification

### Scheduling

Set up scheduled triggers in N8N:
- Weekly co-op position refresh
- Monthly multi-platform posting
- Quarterly position updates

## Best Practices

### Job Descriptions

1. **Length:** 200-500 words (minimum 100 characters)
2. **Structure:**
   - Clear job title
   - Platform overview
   - Key responsibilities
   - Learning opportunities
   - Requirements
   - Benefits
3. **Keywords:** Include relevant skills and technologies
4. **Tone:** Professional yet approachable

### Infographics

1. **Dimensions:** 1200x1600 pixels (LinkedIn optimal)
2. **Content:**
   - Platform branding
   - Job title and key details
   - Skills visualization
   - Benefits highlights
3. **Format:** PNG (recommended) or JPG

### Posting Strategy

1. **Timing:** Post on Tuesday-Thursday, 9 AM - 12 PM
2. **Frequency:** 1-2 positions per platform per month
3. **Promotion:** Share on company page and relevant groups
4. **Monitoring:** Track views and applications weekly

### Compliance

1. **Non-discrimination:** Ensure inclusive language
2. **Accuracy:** All information must be truthful
3. **Completeness:** Include all required fields
4. **Updates:** Keep postings current and relevant

## Troubleshooting

### Common Issues

#### Jobs API Not Available

**Error:** "LinkedIn Jobs API is not enabled"

**Solution:**
1. Check `LINKEDIN_JOBS_API_ENABLED=true` in environment
2. Verify API access approval status
3. Ensure `LINKEDIN_JOBS_API_TOKEN` is set

#### Company ID Missing

**Error:** "LINKEDIN_COMPANY_ID not found"

**Solution:**
1. Get company ID from LinkedIn Company Page
2. Set `LINKEDIN_COMPANY_ID` in environment
3. Format: Numeric ID only (not URN)

#### Description Too Short

**Error:** "Description too short: X characters (minimum 100)"

**Solution:**
1. Use AI enhancement to expand description
2. Add more details about responsibilities
3. Include learning opportunities section

#### Infographic Generation Fails

**Error:** "Pillow not available"

**Solution:**
1. Install Pillow: `pip install pillow`
2. Use text template fallback
3. Check file permissions for output directory

### Debug Mode

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Support

For issues or questions:
1. Check logs in `08-shared/logs/`
2. Review API documentation
3. Contact TAURUS AI support team

## Examples

### Complete Workflow Example

```python
import asyncio
from coop_builder import build_coop_position
from infographic_generator import generate_job_infographic
from tools.jobs import create_job_posting

async def post_coop_position(platform: str):
    # 1. Build co-op position
    result = await build_coop_position(platform)
    
    # 2. Generate infographic
    infographic = await generate_job_infographic(
        result["job_data"],
        platform
    )
    
    # 3. Post to LinkedIn
    posting = await create_job_posting(result["linkedin_format"])
    
    # 4. Return results
    return {
        "platform": platform,
        "job_id": posting["id"],
        "infographic": infographic["filepath"],
        "success": True
    }

# Run for all platforms
platforms = ["BizFlow", "NeoVibe", "AssetGrid", "OrionGrid"]
results = await asyncio.gather(*[
    post_coop_position(p) for p in platforms
])
```

## Next Steps

1. **Request API Access:** Follow [LINKEDIN_JOBS_API_ACCESS_REQUEST.md](./LINKEDIN_JOBS_API_ACCESS_REQUEST.md)
2. **Configure Environment:** Set up all required credentials
3. **Test Integration:** Create a test posting
4. **Set Up Automation:** Import and configure N8N workflows
5. **Monitor Performance:** Track posting metrics and optimize

---

**Last Updated:** January 27, 2025  
**Version:** 1.0.0

