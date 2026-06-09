# 🔐 Google Admin MCP OAuth2 Setup Guide

## Overview
This guide helps you set up OAuth2 authentication for the Google Admin MCP server to manage your Google Workspace users.

## Prerequisites
- Google Workspace Admin account
- Admin Directory API enabled
- Node.js 20.0.0 or higher

## Step 1: Enable Google Admin Directory API

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Google Workspace project
3. Go to "APIs & Services" > "Library"

### 1.2 Enable Admin Directory API
1. Search for "Admin SDK API"
2. Click on "Admin SDK API"
3. Click "Enable"

## Step 2: Create OAuth2 Credentials

### 2.1 Go to Credentials
1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"

### 2.2 Configure OAuth Client
1. Application type: "Web application"
2. Name: "TAURUS AI CORP Google Admin MCP"
3. Authorized redirect URIs: `http://localhost:8080/callback`
4. Click "Create"

### 2.3 Save Credentials
1. Copy the Client ID and Client Secret
2. Add them to your `master.env` file:
```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8080/callback
GOOGLE_WORKSPACE_DOMAIN=your_domain.com
```

## Step 3: Get OAuth2 Access Token

### 3.1 Use OAuth2 Playground
1. Go to [Google OAuth2 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret

### 3.2 Configure Scopes
In "Step 1", add these scopes:
```
https://www.googleapis.com/auth/admin.directory.user
https://www.googleapis.com/auth/admin.directory.user.readonly
https://www.googleapis.com/auth/admin.directory.user.alias
```

### 3.3 Authorize and Get Token
1. Click "Authorize APIs"
2. Sign in with your Google Workspace Admin account
3. Grant all requested permissions
4. In "Step 2", click "Exchange authorization code for tokens"
5. Copy the "Access token" and "Refresh token"

### 3.4 Add Tokens to Environment
Add to your `master.env` file:
```bash
GOOGLE_ACCESS_TOKEN=your_access_token_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

## Step 4: Test the Integration

### 4.1 Install Dependencies
```bash
cd external-mcps/google-admin-mcp
npm install
```

### 4.2 Test MCP Server
```bash
node server.js
```

### 4.3 Test with MCP Client
```python
# Test the Google Admin MCP
python google_admin_mcp_integrator.py
```

## Step 5: Configure Cursor MCP

### 5.1 Add to Cursor MCP Config
Add this to your Cursor MCP configuration:

```json
{
    "mcpServers": {
        "google-admin": {
            "command": "node",
            "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/google-admin-mcp/server.js"],
            "env": {
                "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
                "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
                "GOOGLE_REDIRECT_URI": "${GOOGLE_REDIRECT_URI}",
                "GOOGLE_ACCESS_TOKEN": "${GOOGLE_ACCESS_TOKEN}",
                "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}",
                "GOOGLE_WORKSPACE_DOMAIN": "${GOOGLE_WORKSPACE_DOMAIN}"
            }
        }
    }
}
```

## Available Tools

### 1. List Users
```python
# List all users in your domain
result = await mcp_client.call_tool("list_users", {
    "domain": "your_domain.com",
    "maxResults": 50
})
```

### 2. Get User Details
```python
# Get detailed information about a user
result = await mcp_client.call_tool("get_user", {
    "userKey": "user@your_domain.com"
})
```

### 3. Create User
```python
# Create a new user
result = await mcp_client.call_tool("create_user", {
    "primaryEmail": "newuser@your_domain.com",
    "givenName": "John",
    "familyName": "Doe"
})
```

### 4. Suspend User
```python
# Suspend a user account
result = await mcp_client.call_tool("suspend_user", {
    "userKey": "user@your_domain.com"
})
```

### 5. Unsuspend User
```python
# Unsuspend a user account
result = await mcp_client.call_tool("unsuspend_user", {
    "userKey": "user@your_domain.com"
})
```

## Security Best Practices

### 1. Token Management
- Store tokens securely in environment variables
- Never commit tokens to version control
- Rotate tokens regularly (every 90 days)

### 2. Access Control
- Use least privilege principle for OAuth scopes
- Monitor token usage and access patterns
- Implement proper error handling

### 3. Password Security
- Generated passwords are 12+ characters
- Include uppercase, lowercase, numbers, and special characters
- Users must change password on first login

## Troubleshooting

### Common Issues

#### 1. "Authentication failed" Error
- **Cause**: Invalid or expired OAuth2 token
- **Solution**: Refresh the access token using OAuth2 Playground
- **Prevention**: Set up automatic token refresh

#### 2. "Insufficient permissions" Error
- **Cause**: Missing required OAuth scopes
- **Solution**: Add missing scopes in OAuth2 Playground
- **Prevention**: Use comprehensive scope list

#### 3. "Domain not found" Error
- **Cause**: Incorrect GOOGLE_WORKSPACE_DOMAIN setting
- **Solution**: Verify domain name in master.env
- **Prevention**: Use exact domain name from Google Workspace

#### 4. "API not enabled" Error
- **Cause**: Admin Directory API not enabled
- **Solution**: Enable Admin Directory API in Google Cloud Console
- **Prevention**: Verify API status before setup

### Debug Mode
Enable debug logging:
```bash
export GOOGLE_ADMIN_MCP_DEBUG=true
```

## Support Resources

### Google Admin SDK
- [Admin SDK Documentation](https://developers.google.com/admin-sdk)
- [Directory API Reference](https://developers.google.com/admin-sdk/directory/reference/rest)
- [OAuth2 Scopes](https://developers.google.com/admin-sdk/directory/v1/guides/authorizing)

### MCP Integration
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Google Admin MCP Repository](https://github.com/securitylortech/google-admin-mcp)

---
Generated by TAURUS AI CORP MCP Integration System
2025-09-15 04:55:39
