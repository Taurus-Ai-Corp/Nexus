# 🔑 API Keys Setup Guide
## TAURUS AI CORP. - Design AI & Webflow Integration

**Security Notice**: Never commit API keys to version control. Always use environment variables.

---

## 🎯 **REQUIRED API KEYS**

### **1. Design AI Configuration (Optional - Free Services)**
- **OpenAI API Key**: Optional for enhanced AI features
- **Anthropic API Key**: Optional for Claude integration
- **Hugging Face API Key**: Optional for local models

### **2. Webflow API Keys (Your Existing Credentials)**
- **Service**: Webflow API
- **Where to get**: [Webflow Developer Portal](https://developers.webflow.com/)
- **Environment Variables**:
  - `WEBFLOW_ACCESS_TOKEN`: Your personal access token
  - `WEBFLOW_SITE_ID`: Your site ID from Webflow dashboard
  - `WEBFLOW_CLIENT_ID`: OAuth client ID
  - `WEBFLOW_CLIENT_SECRET`: OAuth client secret

### **3. Figma API Key**
- **Service**: Figma API
- **Where to get**: [Figma Account Settings](https://www.figma.com/settings)
- **Environment Variable**: `FIGMA_ACCESS_TOKEN`
- **Format**: `figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🔧 **SETUP INSTRUCTIONS**

### **Step 1: Create Environment File**
```bash
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS-AI-EMPIRE/BizFlow-Orchestrator/agents/integrations/mcp-agents/"
cp design_ai_webflow.env .env
```

### **Step 2: Edit Environment File**
Open `.env` file and replace placeholder values:

```env
# MiniMax AI Configuration
MINIMAX_API_KEY=mm-your_actual_minimax_api_key_here
MINIMAX_GLOBAL_HOST=https://api.minimax.io
MINIMAX_MODEL=minimax-01

# Webflow Configuration
WEBFLOW_ACCESS_TOKEN=your_actual_webflow_access_token_here
WEBFLOW_SITE_ID=your_actual_webflow_site_id_here
WEBFLOW_CLIENT_ID=your_actual_webflow_client_id_here
WEBFLOW_CLIENT_SECRET=your_actual_webflow_client_secret_here
WEBFLOW_REDIRECT_URI=http://localhost:8168/callback

# Figma Integration
FIGMA_ACCESS_TOKEN=your_actual_figma_token_here
FIGMA_FILE_KEY=your_actual_figma_file_key_here

# Tailwind CSS Configuration
TAILWIND_CONFIG_PATH=/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/Archives/old-projects/BACKUP_OLD_DIRECTORIES/BizFlow-Vibe-Marketing-Ecosystem/mcp-agents/tailwind-mcp/tokens

# Design System Configuration
DESIGN_SYSTEM_PATH=/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS-AI-EMPIRE/Web-Platforms/webflow-integration/design-system

# MCP Server Configuration
MCP_SERVER_HOST=localhost
MCP_SERVER_PORT=8000
MCP_SERVER_DEBUG=True

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=minimax_webflow_integration.log
```

---

## 🔍 **HOW TO FIND YOUR API KEYS**

### **Design AI Configuration (Optional)**
The Design AI MCP works completely free without any API keys. Optional keys for enhanced features:

**OpenAI API Key (Optional):**
1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create account or log in
3. Generate new API key
4. Copy the key (starts with `sk-`)

**Anthropic API Key (Optional):**
1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Create account or log in
3. Generate new API key
4. Copy the key

### **Webflow API Keys (Your Existing Setup)**
1. Visit [https://developers.webflow.com/](https://developers.webflow.com/)
2. Sign up or log in to your Webflow account
3. Go to "Personal Access Tokens"
4. Create a new token with required permissions
5. Copy the token

**For Site ID:**
1. Go to your Webflow dashboard
2. Select your site
3. Go to Site Settings > General
4. Copy the Site ID

**For OAuth Credentials:**
1. Go to [Webflow Developer Portal](https://developers.webflow.com/)
2. Create a new application
3. Set redirect URI to `http://localhost:8168/callback`
4. Copy Client ID and Client Secret

### **Figma API Key**
1. Visit [https://www.figma.com/settings](https://www.figma.com/settings)
2. Scroll down to "Personal Access Tokens"
3. Generate a new token
4. Copy the token (starts with `figd_`)

**For Figma File Key:**
1. Open your Figma file
2. Copy the file ID from the URL
3. Example: `https://www.figma.com/file/ABC123DEF456/My-Design` → `ABC123DEF456`

---

## 🧪 **TESTING YOUR API KEYS**

### **Test MiniMax AI**
```bash
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS-AI-EMPIRE/BizFlow-Orchestrator/agents/integrations/mcp-agents/minimax-mcp"
source ../../../Development-Tools/minimax_webflow_env/bin/activate
python minimax_ai_mcp.py
```

### **Test Webflow Integration**
```bash
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS-AI-EMPIRE/BizFlow-Orchestrator/agents/integrations/mcp-agents/webflow-mcp"
source ../../../Development-Tools/minimax_webflow_env/bin/activate
python webflow_design_mcp.py
```

---

## 🔒 **SECURITY BEST PRACTICES**

### **Environment File Security**
1. **Never commit `.env` files** to version control
2. **Add `.env` to `.gitignore`**
3. **Use different keys** for development and production
4. **Rotate keys regularly**
5. **Use least privilege principle**

### **Key Management**
1. **Store keys securely** (use password managers)
2. **Limit API key permissions** to minimum required
3. **Monitor key usage** regularly
4. **Revoke unused keys** immediately
5. **Use environment variables** in production

---

## 🚀 **QUICK START COMMANDS**

### **1. Create Environment File**
```bash
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS-AI-EMPIRE/BizFlow-Orchestrator/agents/integrations/mcp-agents/"
touch .env
```

### **2. Edit Environment File**
```bash
nano .env
# Add your actual API keys here
```

### **3. Test Configuration**
```bash
source ../../../Development-Tools/minimax_webflow_env/bin/activate
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('MiniMax Key:', 'SET' if os.getenv('MINIMAX_API_KEY') else 'NOT SET')"
```

### **4. Run MCP Servers**
```bash
# Test MiniMax MCP
cd minimax-mcp && python minimax_ai_mcp.py

# Test Webflow MCP
cd ../webflow-mcp && python webflow_design_mcp.py
```

---

## 📞 **SUPPORT & TROUBLESHOOTING**

### **Common Issues**
1. **Invalid API Key**: Check key format and permissions
2. **Rate Limiting**: Implement exponential backoff
3. **Network Issues**: Check firewall and proxy settings
4. **Authentication Errors**: Verify OAuth flow completion

### **Debug Mode**
Set `MCP_SERVER_DEBUG=True` in your `.env` file for detailed logging.

---

## 🎯 **NEXT STEPS**

1. **Get your API keys** from the respective services
2. **Create `.env` file** with your actual keys
3. **Test the integration** using the test commands
4. **Update Cursor MCP settings** with the new configuration
5. **Deploy to production** when ready

---

**🔑 Your API keys are the gateway to powerful AI and design automation capabilities!**
