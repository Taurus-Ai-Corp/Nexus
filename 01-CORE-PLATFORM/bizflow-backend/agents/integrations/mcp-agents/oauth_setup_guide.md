# 🔐 OAuth Setup Guide for MCP Connectors

## **Complete Guide to Setting Up OAuth Tokens for MCP Business Integration**

---

## 📋 **OVERVIEW**

This guide will help you set up OAuth tokens for all the MCP connectors used in the TAURUS AI CORP business integration system.

---

## 🎯 **REQUIRED OAUTH TOKENS**

### **Google Services** (Gmail, Calendar, Drive)
- **Token Name**: `GOOGLE_OAUTH_TOKEN`
- **Services**: Gmail, Google Calendar, Google Drive
- **Setup Time**: 10-15 minutes

### **Microsoft Services** (Teams, Outlook, SharePoint)
- **Token Name**: `MICROSOFT_OAUTH_TOKEN`
- **Services**: Microsoft Teams, Outlook Calendar, Outlook Email, SharePoint
- **Setup Time**: 15-20 minutes

### **Dropbox** (File Management)
- **Token Name**: `DROPBOX_OAUTH_TOKEN`
- **Services**: Dropbox file management and sharing
- **Setup Time**: 5-10 minutes

---

## 🔧 **GOOGLE OAUTH SETUP**

### **Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name: "TAURUS AI CORP MCP Integration"
4. Click "Create"

### **Step 2: Enable APIs**
1. Go to "APIs & Services" > "Library"
2. Enable these APIs:
   - Gmail API
   - Google Calendar API
   - Google Drive API

### **Step 3: Create OAuth Credentials**
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Name: "MCP Business Integrator"
5. Authorized redirect URIs: `http://localhost:8080/callback`
6. Click "Create"

### **Step 4: Get OAuth Token**
1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. In "Step 1", add these scopes:
   ```
   https://www.googleapis.com/auth/gmail.readonly
   https://www.googleapis.com/auth/gmail.modify
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   https://www.googleapis.com/auth/drive
   https://www.googleapis.com/auth/drive.file
   ```
6. Click "Authorize APIs"
7. Sign in with your Google account
8. Click "Allow" for all permissions
9. In "Step 2", click "Exchange authorization code for tokens"
10. Copy the "Access token" value

### **Step 5: Add to Environment**
Add this to your `master.env` file:
```env
GOOGLE_OAUTH_TOKEN=ya29.a0AfH6SMC...your_token_here
```

---

## 🔧 **MICROSOFT OAUTH SETUP**

### **Step 1: Register Azure Application**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Name: "TAURUS AI CORP MCP Integration"
5. Supported account types: "Accounts in this organizational directory only"
6. Redirect URI: `http://localhost:8080/callback`
7. Click "Register"

### **Step 2: Configure API Permissions**
1. Go to "API permissions"
2. Click "Add a permission"
3. Add these Microsoft Graph permissions:
   - `Calendars.ReadWrite`
   - `Mail.ReadWrite`
   - `Files.ReadWrite.All`
   - `Team.ReadBasic.All`
   - `Sites.ReadWrite.All`
4. Click "Grant admin consent"

### **Step 3: Create Client Secret**
1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Description: "MCP Integration Secret"
4. Expires: "24 months"
5. Click "Add"
6. Copy the secret value (you won't see it again!)

### **Step 4: Get OAuth Token**
1. Go to [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
2. Sign in with your Microsoft account
3. Click "Modify permissions"
4. Add all the permissions from Step 2
5. Click "Consent"
6. Copy the access token from the request

### **Step 5: Add to Environment**
Add this to your `master.env` file:
```env
MICROSOFT_OAUTH_TOKEN=eyJ0eXAiOiJKV1QiLCJub25jZSI6...your_token_here
```

---

## 🔧 **DROPBOX OAUTH SETUP**

### **Step 1: Create Dropbox App**
1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Click "Create app"
3. Choose "Scoped access"
4. Choose "Full Dropbox" or "App folder"
5. Name: "TAURUS AI CORP MCP Integration"
6. Click "Create app"

### **Step 2: Configure App Settings**
1. Go to "Permissions" tab
2. Enable these permissions:
   - `files.metadata.read`
   - `files.metadata.write`
   - `files.content.read`
   - `files.content.write`
   - `sharing.read`
   - `sharing.write`
3. Go to "OAuth 2" tab
4. Add redirect URI: `http://localhost:8080/callback`

### **Step 3: Get OAuth Token**
1. Go to [Dropbox OAuth Playground](https://www.dropbox.com/oauth2/authorize)
2. Use your app key and secret
3. Add redirect URI: `http://localhost:8080/callback`
4. Add scopes: `files.metadata.read files.metadata.write files.content.read files.content.write sharing.read sharing.write`
5. Authorize the app
6. Copy the access token

### **Step 5: Add to Environment**
Add this to your `master.env` file:
```env
DROPBOX_OAUTH_TOKEN=sl.B1234567890abcdef...your_token_here
```

---

## 🧪 **TESTING YOUR SETUP**

### **Test Script**
Run this to test your OAuth tokens:

```bash
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents"
python mcp_examples.py
```

### **Expected Output**
```
🚀 MCP Business Integration Examples
==================================================
This script demonstrates various MCP connector workflows
for TAURUS AI CORP business automation.

🧪 Testing All Connectors
----------------------------------------
Testing gmail...
  ✅ gmail - Working
Testing calendar...
  ✅ calendar - Working
Testing drive...
  ✅ drive - Working
Testing dropbox...
  ✅ dropbox - Working
Testing teams...
  ✅ teams - Working
Testing outlook_calendar...
  ✅ outlook_calendar - Working
Testing outlook_email...
  ✅ outlook_email - Working
Testing sharepoint...
  ✅ sharepoint - Working
```

---

## 🔒 **SECURITY BEST PRACTICES**

### **Token Management**
1. **Never commit tokens to version control**
2. **Use environment variables only**
3. **Rotate tokens regularly** (every 90 days)
4. **Use least privilege principle**
5. **Monitor token usage**

### **Environment Security**
```env
# In master.env - NEVER commit this file
GOOGLE_OAUTH_TOKEN=your_google_token_here
MICROSOFT_OAUTH_TOKEN=your_microsoft_token_here
DROPBOX_OAUTH_TOKEN=your_dropbox_token_here

# Add to .gitignore
master.env
*.env
```

### **Token Rotation Script**
```python
# token_rotation.py
import os
from datetime import datetime, timedelta

def check_token_expiry():
    """Check if tokens need rotation"""
    # Implement token expiry checking
    pass

def rotate_tokens():
    """Rotate expired tokens"""
    # Implement token rotation
    pass
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **"Invalid token" Error**
- **Cause**: Token expired or invalid
- **Solution**: Regenerate token using OAuth playground
- **Prevention**: Set up token rotation

#### **"Insufficient permissions" Error**
- **Cause**: Missing required scopes
- **Solution**: Add missing permissions in OAuth setup
- **Prevention**: Use comprehensive scope list

#### **"Redirect URI mismatch" Error**
- **Cause**: Wrong redirect URI in OAuth app
- **Solution**: Update redirect URI in app settings
- **Prevention**: Use consistent redirect URIs

#### **"Rate limit exceeded" Error**
- **Cause**: Too many API calls
- **Solution**: Implement rate limiting and retry logic
- **Prevention**: Monitor API usage

### **Debug Mode**
Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## 📞 **SUPPORT RESOURCES**

### **Google APIs**
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Reference](https://developers.google.com/gmail/api)
- [Google Calendar API Reference](https://developers.google.com/calendar/api)
- [Google Drive API Reference](https://developers.google.com/drive/api)

### **Microsoft Graph**
- [Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/)
- [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
- [Azure AD App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

### **Dropbox API**
- [Dropbox API Documentation](https://www.dropbox.com/developers/documentation)
- [Dropbox OAuth Guide](https://www.dropbox.com/developers/reference/oauth-guide)

---

## ✅ **CHECKLIST**

### **Google Setup**
- [ ] Google Cloud Project created
- [ ] Gmail API enabled
- [ ] Google Calendar API enabled
- [ ] Google Drive API enabled
- [ ] OAuth credentials created
- [ ] OAuth token obtained
- [ ] Token added to master.env

### **Microsoft Setup**
- [ ] Azure app registered
- [ ] Microsoft Graph permissions added
- [ ] Client secret created
- [ ] OAuth token obtained
- [ ] Token added to master.env

### **Dropbox Setup**
- [ ] Dropbox app created
- [ ] App permissions configured
- [ ] OAuth token obtained
- [ ] Token added to master.env

### **Testing**
- [ ] All connectors tested
- [ ] Workflow examples run successfully
- [ ] Business report generated
- [ ] Security measures implemented

---

**Once you complete this setup, your MCP Business Integrator will be ready to automate your business workflows! 🚀**
