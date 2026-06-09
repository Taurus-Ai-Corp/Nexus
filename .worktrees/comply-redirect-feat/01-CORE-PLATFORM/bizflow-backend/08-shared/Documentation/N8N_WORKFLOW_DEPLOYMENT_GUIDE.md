# N8N Workflow Deployment Guide

This guide provides instructions for deploying LinkedIn job posting automation workflows in N8N.

## Prerequisites

1. **N8N Instance Access**
   - N8N instance is running and accessible
   - You have admin/editor access to N8N
   - N8N version 1.0+ (recommended)

2. **LinkedIn API Credentials**
   - LinkedIn Jobs API access approved
   - API credentials configured
   - Environment variables set

3. **Workflow Files**
   - `linkedin-coop-posting-workflow.json` - Single platform workflow
   - `multi-platform-job-poster.json` - Multi-platform workflow

## Workflow Files Location

Workflow files are located at:
```
03-integrations/N8N/n8n-workflows/linkedin-automation/
├── linkedin-coop-posting-workflow.json
└── multi-platform-job-poster.json
```

## Deployment Steps

### Step 1: Access N8N Instance

1. Navigate to your N8N instance URL
   - Example: `http://localhost:5678` (local)
   - Example: `https://n8n.yourdomain.com` (hosted)

2. Sign in with your credentials

### Step 2: Import Workflow

#### Option A: Import via UI

1. Click **"Workflows"** in the left sidebar
2. Click **"Import from File"** or **"+"** button
3. Select the workflow JSON file:
   - `linkedin-coop-posting-workflow.json` (for single platform)
   - `multi-platform-job-poster.json` (for multi-platform)
4. Click **"Import"**

#### Option B: Import via API

```bash
# Using curl
curl -X POST \
  http://localhost:5678/api/v1/workflows \
  -H "Content-Type: application/json" \
  -H "X-N8N-API-KEY: your_api_key" \
  -d @linkedin-coop-posting-workflow.json
```

### Step 3: Configure Credentials

After importing, configure the following credentials:

#### LinkedIn API Credentials

1. Click on any **LinkedIn** node in the workflow
2. Click **"Credential to connect with"** dropdown
3. Click **"Create New Credential"** or select existing
4. Fill in credential details:

   **Credential Type:** HTTP Request / OAuth2

   **Required Fields:**
   - **Access Token:** `{{ $env.LINKEDIN_JOBS_API_TOKEN }}`
   - **Client ID:** `{{ $env.LINKEDIN_CLIENT_ID }}`
   - **Client Secret:** `{{ $env.LINKEDIN_CLIENT_SECRET }}`
   - **Company ID:** `{{ $env.LINKEDIN_COMPANY_ID }}`

   **Note:** Use N8N environment variables or credential store for sensitive values.

#### Platform-Specific Settings

Configure platform-specific nodes:

1. **BizFlow Platform Node**
   - Platform: `BizFlow`
   - Template: `bizflow_coop_template.json`

2. **Nexus Platform Node**
   - Platform: `Nexus`
   - Template: `nexus_coop_template.json`

3. **AssetGrid Platform Node**
   - Platform: `AssetGrid`
   - Template: `assetgrid_coop_template.json`

4. **OrionGrid Platform Node**
   - Platform: `OrionGrid`
   - Template: `oriongrid_coop_template.json`

### Step 4: Configure Workflow Settings

#### Single Platform Workflow (`linkedin-coop-posting-workflow.json`)

**Settings:**
- **Name:** LinkedIn Co-op Posting - [Platform Name]
- **Active:** Toggle to enable/disable
- **Error Workflow:** Set error handling workflow (optional)

**Trigger Configuration:**
- **Manual Trigger:** Click "Execute Workflow" to run manually
- **Schedule Trigger:** Set cron expression for automated runs
- **Webhook Trigger:** Configure webhook URL for external triggers

#### Multi-Platform Workflow (`multi-platform-job-poster.json`)

**Settings:**
- **Name:** Multi-Platform Job Poster
- **Active:** Toggle to enable/disable
- **Error Workflow:** Set error handling workflow (optional)

**Platform Selection:**
- Configure which platforms to post to
- Set platform-specific customizations
- Configure posting schedule per platform

### Step 5: Test Workflow

#### Test Single Platform Workflow

1. Click **"Execute Workflow"** button
2. Select platform from dropdown (if applicable)
3. Review execution log
4. Verify job posting created on LinkedIn

#### Test Multi-Platform Workflow

1. Click **"Execute Workflow"** button
2. Select platforms to post to
3. Review execution log for each platform
4. Verify all job postings created successfully

### Step 6: Activate Workflow

1. Toggle **"Active"** switch to enable workflow
2. Configure trigger (schedule, webhook, etc.)
3. Monitor first automated execution
4. Review logs and verify success

## Workflow Configuration Details

### LinkedIn Co-op Posting Workflow

**Purpose:** Post a single co-op position for one platform

**Nodes:**
1. **Trigger** - Manual/Schedule/Webhook
2. **Platform Selection** - Select platform (BizFlow, Nexus, etc.)
3. **Load Template** - Load platform-specific template
4. **Generate Description** - AI-powered description generation
5. **Create Infographic** - Generate job posting infographic
6. **Post to LinkedIn** - Create job posting via API
7. **Share on Company Page** - Share job posting on LinkedIn
8. **Send Notification** - Notify stakeholders

**Input Parameters:**
- `platform` (required): Platform name
- `customizations` (optional): Custom job details
- `post_to_linkedin` (optional): Auto-post flag

**Output:**
- Job posting ID
- LinkedIn job URL
- Infographic path
- Posting status

### Multi-Platform Job Poster Workflow

**Purpose:** Post co-op positions for multiple platforms simultaneously

**Nodes:**
1. **Trigger** - Manual/Schedule/Webhook
2. **Platform List** - List of platforms to post to
3. **Loop Platforms** - Iterate through platforms
4. **Load Template** - Load platform-specific template
5. **Generate Description** - AI-powered description generation
6. **Create Infographic** - Generate job posting infographic
7. **Post to LinkedIn** - Create job posting via API
8. **Collect Results** - Aggregate posting results
9. **Send Summary** - Send summary notification

**Input Parameters:**
- `platforms` (required): Array of platform names
- `customizations` (optional): Platform-specific customizations
- `post_to_linkedin` (optional): Auto-post flag

**Output:**
- Array of job posting results
- Summary statistics
- Error reports (if any)

## Environment Variables in N8N

Configure these environment variables in N8N:

```bash
# LinkedIn API Configuration
LINKEDIN_JOBS_API_ENABLED=true
LINKEDIN_JOBS_API_TOKEN=your_token
LINKEDIN_COMPANY_ID=your_company_id
LINKEDIN_ACCESS_TOKEN=your_access_token
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_PERSON_ID=your_person_id

# Optional: Vertex AI
VERTEX_AI_PROJECT_ID=your_project_id
VERTEX_AI_LOCATION=us-central1
```

**Setting Environment Variables:**

1. **N8N Cloud:**
   - Go to Settings > Environment Variables
   - Add each variable

2. **Self-Hosted N8N:**
   - Set in `.env` file or system environment
   - Restart N8N after changes

## Scheduling Workflows

### Schedule Single Platform Posting

**Cron Expression Examples:**
- Daily at 9 AM: `0 9 * * *`
- Weekly on Monday: `0 9 * * 1`
- Monthly on 1st: `0 9 1 * *`

### Schedule Multi-Platform Posting

**Cron Expression:**
- All platforms daily: `0 9 * * *`
- Staggered posting: Use delay nodes between platforms

## Monitoring and Logging

### View Execution History

1. Click on workflow
2. Click **"Executions"** tab
3. Review execution logs
4. Check for errors or warnings

### Error Handling

Workflows include error handling nodes:
- **Error Node:** Catches and logs errors
- **Retry Logic:** Automatic retries for transient failures
- **Notification:** Alerts on critical errors

### Success Metrics

Monitor these metrics:
- Job posting creation success rate
- API response times
- Error frequency
- Platform-specific success rates

## Troubleshooting

### Workflow Not Executing

**Symptoms:** Workflow doesn't run when triggered

**Solutions:**
1. Check workflow is **Active**
2. Verify trigger configuration
3. Check N8N logs for errors
4. Verify credentials are valid

### API Authentication Errors

**Symptoms:** 401 or 403 errors from LinkedIn API

**Solutions:**
1. Verify access token is valid
2. Check token expiration
3. Verify API access is approved
4. Check credential configuration

### Template Not Found

**Symptoms:** Error loading job template

**Solutions:**
1. Verify template files exist
2. Check file paths in workflow
3. Verify template JSON is valid
4. Check file permissions

### Infographic Generation Fails

**Symptoms:** Infographic node fails

**Solutions:**
1. Check image generation dependencies
2. Verify output directory exists
3. Check disk space
4. Review error logs

## Best Practices

1. **Test Before Production**
   - Always test workflows in test environment first
   - Use dry-run mode when available
   - Verify with test job postings

2. **Monitor Regularly**
   - Check execution logs daily
   - Monitor error rates
   - Review job posting quality

3. **Keep Credentials Secure**
   - Use N8N credential store
   - Never commit credentials to version control
   - Rotate credentials regularly

4. **Handle Errors Gracefully**
   - Implement retry logic
   - Send error notifications
   - Log errors for debugging

5. **Optimize Performance**
   - Use parallel execution where possible
   - Cache templates and data
   - Monitor API rate limits

## Support

For issues or questions:
1. Review workflow execution logs
2. Check N8N documentation
3. Review LinkedIn API status
4. Contact TAURUS AI support team

---

**Last Updated:** January 27, 2025  
**Status:** Ready for deployment after API approval

