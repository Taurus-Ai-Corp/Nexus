# Atlassian API Token Creation Guide

## 🔐 **Step-by-Step Process**

### **Step 1: Complete Email Verification**
1. **Check your email** for the verification code from Atlassian
2. **Enter the 8-digit code** in the text box on the current page
3. **Click "Verify"** to proceed to the API token management page

### **Step 2: Create API Token**
Once verified, you'll be redirected to the API token management page:

1. **Click "Create API token"** button
2. **Enter a descriptive label**: `Genspark MCP Integration`
3. **Click "Create"** to generate the token
4. **Copy the token immediately** (it won't be shown again)

### **Step 3: Update master.env File**
Replace the placeholder in your `master.env` file:

```bash
# Replace this line:
ATLASSIAN_API_TOKEN=your_atlassian_api_token

# With your actual token:
ATLASSIAN_API_TOKEN=ATATT3xFfGF0...
```

### **Step 4: Configure Stash Settings**
Based on your requirements, update these settings:

```bash
# Primary Stash Configuration
STASH_URL=https://stash.taurus.ai
STASH_USERNAME=Taurus-ai
STASH_API_TOKEN=your_atlassian_api_token

# Alternative Stash Configuration (if different instance)
# STASH_URL=https://stash.yourcompany.com
# STASH_USERNAME=your_username
# STASH_API_TOKEN=your_token
```

## 🎯 **Current Status**

- ✅ **Atlassian Domain**: `taurus.atlassian.net` (verified accessible)
- ✅ **Email**: `Taurus.ai@taas-ai.com` (confirmed)
- ⏳ **API Token**: Waiting for verification code completion
- ⏳ **Stash Configuration**: Ready to update with your token

## 📋 **Next Steps After Getting Token**

1. **Update master.env** with your actual API token
2. **Restart Cursor** to load the new configuration
3. **Test the integration** with your Atlassian services

## 🔧 **MCP Servers Ready**

- **Genspark MCP**: ✅ Ready for system browsing
- **Firecrawl MCP**: ✅ Ready for web scraping
- **Perplexity MCP**: ✅ Ready for AI-powered research

All MCP servers are configured and ready to assist with your Atlassian integration once you complete the API token creation process.

---
*Guide created: 2025-01-15*
*Status: Waiting for verification code completion*





