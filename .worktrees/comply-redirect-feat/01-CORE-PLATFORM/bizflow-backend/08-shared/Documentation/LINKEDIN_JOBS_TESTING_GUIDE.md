# LinkedIn Jobs API Testing Guide

This guide provides comprehensive testing procedures for the LinkedIn Jobs API integration.

## Prerequisites

1. **API Access Approved**
   - LinkedIn Jobs API access must be approved
   - API credentials received from LinkedIn
   - Environment variables configured

2. **Environment Setup**
   - Python 3.8+ installed
   - Required dependencies installed
   - `.env` file configured with credentials

## Testing Checklist

### Phase 1: Environment Validation

- [ ] All required environment variables are set
- [ ] `LINKEDIN_JOBS_API_ENABLED=true` is set
- [ ] Access tokens are valid
- [ ] Company ID is correct

**Command:**
```bash
python 08-shared/scripts/validate_environment.py
```

**Expected Output:**
```
✓ All required environment variables are configured!
✓ Environment is ready for LinkedIn Jobs API usage.
```

### Phase 2: API Connection Test

- [ ] API endpoint is accessible
- [ ] Authentication is working
- [ ] API permissions are correct

**Command:**
```bash
python 08-shared/scripts/test_linkedin_api_connection.py
```

**Expected Output:**
```
✓ Successfully connected to LinkedIn Jobs API
ℹ Company ID: 12345678
ℹ API response received successfully
```

**Common Issues:**
- **401 Unauthorized**: Check access token validity
- **403 Forbidden**: API may not be enabled or partner approval needed
- **Network Error**: Check internet connection and firewall settings

### Phase 3: Job Posting Creation Test (Dry Run)

- [ ] Job data structure is valid
- [ ] CoOpPositionBuilder works correctly
- [ ] Data formatting is correct

**Command:**
```bash
python 08-shared/scripts/test_job_posting_creation.py --dry-run
```

**Expected Output:**
```
✓ CoOpPositionBuilder test successful
✓ Job data structure is valid
ℹ Dry run completed - no actual job posting was created
```

### Phase 4: Job Posting Creation Test (Live)

⚠️ **Warning:** This will create an actual job posting on LinkedIn.

- [ ] Test job posting is created successfully
- [ ] Job appears on LinkedIn
- [ ] Job details are correct

**Command:**
```bash
python 08-shared/scripts/test_job_posting_creation.py
```

**Expected Output:**
```
✓ Successfully created test job posting
ℹ Job ID: urn:li:jobPosting:1234567890
ℹ Job posting created successfully!
```

**After Testing:**
1. Verify job appears on LinkedIn company page
2. Check job details are correct
3. **Delete test job posting** after validation

### Phase 5: Integration Testing

- [ ] MCP server tools work correctly
- [ ] REST API endpoints function properly
- [ ] N8N workflows execute successfully

**MCP Server Test:**
```python
from mcp_servers.linkedin.tools.jobs import create_job_posting

job_data = {
    "title": "Test Position",
    "description": "Test description",
    "location": {"country": "ca", "city": "Toronto"},
    "employmentType": "INTERNSHIP"
}

result = await create_job_posting(job_data)
print(result)
```

**REST API Test:**
```bash
curl -X POST http://localhost:8000/api/linkedin/jobs/build-coop \
  -H "Content-Type: application/json" \
  -d '{"platform": "BizFlow"}'
```

## Test Scripts Reference

### validate_environment.py

Validates all required environment variables are set and properly formatted.

**Usage:**
```bash
python 08-shared/scripts/validate_environment.py
```

**Checks:**
- Required variables are set
- Variable formats are correct
- API is enabled
- Optional variables are configured

### test_linkedin_api_connection.py

Tests basic connectivity to LinkedIn Jobs API.

**Usage:**
```bash
python 08-shared/scripts/test_linkedin_api_connection.py
```

**Tests:**
- API endpoint accessibility
- Authentication validity
- API permissions
- Basic API response

### test_job_posting_creation.py

Tests creating a job posting on LinkedIn.

**Usage:**
```bash
# Dry run (validation only)
python 08-shared/scripts/test_job_posting_creation.py --dry-run

# Live test (creates actual posting)
python 08-shared/scripts/test_job_posting_creation.py
```

**Tests:**
- CoOpPositionBuilder functionality
- Job data structure validation
- API job creation
- Response handling

## Error Handling Procedures

### Authentication Errors (401)

**Symptoms:**
- "Authentication failed" error
- 401 status code

**Solutions:**
1. Verify access token is valid
2. Check token expiration
3. Regenerate token if needed
4. Verify token has correct scopes (`r_jobs`, `w_jobs`)

### Authorization Errors (403)

**Symptoms:**
- "Access forbidden" error
- 403 status code

**Solutions:**
1. Verify API access is approved
2. Check partner agreement status
3. Contact LinkedIn support if needed
4. Verify company ID is correct

### Validation Errors

**Symptoms:**
- "Invalid job posting data" error
- Pydantic validation errors

**Solutions:**
1. Check job data structure
2. Verify required fields are present
3. Validate data formats (dates, locations, etc.)
4. Review job posting guidelines

### Network Errors

**Symptoms:**
- Connection timeout
- Network unreachable

**Solutions:**
1. Check internet connection
2. Verify firewall settings
3. Check LinkedIn API status
4. Retry with exponential backoff

## Rollback Procedures

### If Test Job Posting Created

1. **Delete via API:**
   ```python
   from mcp_servers.linkedin.tools.jobs import close_job_posting
   await close_job_posting("job_id")
   ```

2. **Delete via LinkedIn UI:**
   - Go to LinkedIn Company Page
   - Navigate to Jobs section
   - Find test job posting
   - Delete manually

### If Environment Misconfigured

1. **Disable API:**
   ```bash
   # In .env file
   LINKEDIN_JOBS_API_ENABLED=false
   ```

2. **Remove Invalid Credentials:**
   - Clear invalid tokens
   - Re-run validation script
   - Reconfigure with correct values

## Best Practices

1. **Always Test in Dry Run First**
   - Use `--dry-run` flag for initial testing
   - Validate data structure before live API calls

2. **Use Test Company Page**
   - Create test jobs on test company page
   - Avoid cluttering production company page

3. **Monitor API Rate Limits**
   - Check rate limit headers in responses
   - Implement rate limiting in production code

4. **Keep Test Jobs Clean**
   - Delete test postings after validation
   - Use clear test job titles
   - Document test job IDs

5. **Log All API Calls**
   - Log requests and responses
   - Track errors and retries
   - Monitor API usage

## Troubleshooting

### Script Not Found

**Error:** `python: can't open file '08-shared/scripts/...'`

**Solution:**
```bash
# Run from project root
cd "/Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/TAURUS-BUSINESS-INTELLIGENCE-HUB/TAURUS AI CORP/BizFlow-Agentic_Intelligent_Orchestrator"
python 08-shared/scripts/validate_environment.py
```

### Import Errors

**Error:** `ModuleNotFoundError: No module named '...'`

**Solution:**
1. Check Python path is correct
2. Verify dependencies are installed
3. Check import paths in scripts

### Environment Variables Not Loaded

**Error:** Variables not found even though `.env` exists

**Solution:**
1. Verify `.env` file location
2. Check file permissions
3. Ensure variables are not commented out
4. Verify no syntax errors in `.env` file

## Next Steps After Successful Testing

1. **Production Deployment**
   - Configure production credentials
   - Set up monitoring
   - Implement error alerts

2. **Workflow Integration**
   - Import N8N workflows
   - Configure triggers
   - Test end-to-end automation

3. **Documentation**
   - Document any customizations
   - Update runbooks
   - Create operational procedures

## Support

For issues or questions:
1. Review this testing guide
2. Check LinkedIn API documentation
3. Review error logs
4. Contact TAURUS AI support team

---

**Last Updated:** January 27, 2025  
**Status:** Ready for API approval and testing

