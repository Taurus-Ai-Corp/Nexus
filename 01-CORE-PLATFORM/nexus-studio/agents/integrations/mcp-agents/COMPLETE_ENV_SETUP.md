# 🔐 Complete Environment Setup for Enhanced MCP Agents

## Overview
This guide helps you set up all the environment variables needed for your enhanced BizFlow MCP ecosystem.

## 📋 **Required Environment Variables**

### **Design & Development Tools**
```bash
# Figma Integration
FIGMA_ACCESS_TOKEN=your_figma_token_here

# Design Tokens Path
DESIGN_TOKENS_PATH=/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/BizFlow-Vibe-Marketing-Ecosystem/mcp-agents/design-tokens-mcp/tokens
```

### **Google Services (Gmail & Google Sheets)**
```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### **Communication & Collaboration**
```bash
# Slack Integration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token-here
SLACK_USER_TOKEN=xoxp-your-slack-user-token-here

# Notion Integration
NOTION_API_KEY=secret_your_notion_api_key_here
```

### **Business & CRM Tools**
```bash
# HubSpot CRM
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here

# Airtable Database
AIRTABLE_ACCESS_TOKEN=your_airtable_access_token_here

# Linear Project Management
LINEAR_API_KEY=your_linear_api_key_here
```

### **Development Tools**
```bash
# GitHub Integration
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
```

## 🚀 **Quick Setup Instructions**

### **Step 1: Copy Configuration to Cursor**
1. Open Cursor IDE
2. Press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows/Linux)
3. Type "Preferences: Open Settings (JSON)"
4. Copy the ENTIRE contents from `enhanced-cursor-mcp-config.json`
5. Paste it into your Cursor settings JSON file

### **Step 2: Set Up Environment Variables**
1. Create a `.env` file in your project root
2. Copy the environment variables above
3. Replace the placeholder values with your actual tokens

### **Step 3: Restart Cursor**
- Completely close and reopen Cursor for MCP agents to load

## 🔑 **How to Get API Tokens**

### **Figma Access Token**
1. Go to https://figma.com
2. Go to Settings → Account → Personal access tokens
3. Create new token
4. Copy the token

### **Google OAuth (Gmail & Sheets)**
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable Gmail API and Google Sheets API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Copy Client ID and Client Secret

### **Slack Tokens**
1. Go to https://api.slack.com/apps
2. Create new app or select existing
3. Go to OAuth & Permissions
4. Copy Bot User OAuth Token (xoxb-...)
5. Copy User OAuth Token (xoxp-...)

### **Notion API Key**
1. Go to https://notion.so/my-integrations
2. Create new integration
3. Copy the Internal Integration Token

### **HubSpot Access Token**
1. Go to HubSpot Developer Account
2. Create private app
3. Copy access token

### **Airtable Access Token**
1. Go to https://airtable.com/account
2. Generate personal access token
3. Copy the token

### **Linear API Key**
1. Go to Linear Settings → API
2. Create personal API key
3. Copy the key

### **GitHub Personal Access Token**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select required scopes
4. Copy the token

## ✅ **Testing Your Setup**

After configuration, test these commands in Cursor:

### **Design Tools**
- `@figma help`
- `@tailwind help`
- `@design-tokens help`
- `@components help`
- `@icons help`

### **Automation Tools**
- `@playwright help`

### **Business Tools**
- `@gmail help`
- `@google-sheets help`
- `@slack help`
- `@notion help`
- `@hubspot help`
- `@airtable help`
- `@linear help`
- `@github-klavis help`

## 🎯 **Priority Setup (Start Here)**

If you want to start with the most important agents:

1. **Essential for Design Work:**
   - Figma MCP
   - Tailwind MCP
   - Components MCP

2. **Essential for Business:**
   - GitHub MCP
   - Notion MCP
   - Slack MCP

3. **Advanced Business Automation:**
   - Gmail MCP
   - HubSpot MCP
   - Airtable MCP

## 🛠️ **Troubleshooting**

### **Agent Not Responding**
1. Check Cursor settings are saved correctly
2. Verify environment variables are set
3. Restart Cursor completely
4. Check agent file paths are correct

### **Permission Errors**
1. Verify API tokens have correct permissions
2. Check token expiration dates
3. Ensure OAuth apps have required scopes

### **File Path Issues**
1. Verify all file paths in configuration are absolute
2. Check that MCP agent files exist at specified locations
3. Ensure all scripts are executable

## 📞 **Support**

If you need help:
1. Check individual MCP agent logs
2. Verify API token permissions
3. Test agents individually
4. Review MCP protocol documentation

---

**🎉 Once configured, you'll have a powerful AI-driven business automation system!**






