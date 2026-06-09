# 🚀 Quick LinkedIn Automation Setup Guide

## ✅ Step 1: N8N Server Running
**Status: COMPLETE** ✅  
N8N is running at: http://localhost:5678

## 📥 Step 2: Import Jack's LinkedIn Workflow

### Import Instructions:
1. **Open N8N**: http://localhost:5678
2. **Login Credentials**:
   - Username: `admin`
   - Password: `password`
3. **Import Process**:
   - Click "Import from File" (top right)
   - Select file: `03-integrations/n8n-workflows/linkedin-automation/$10,000 LinkedIn agent.json`
   - Click "Import Workflow"

### What Gets Imported:
- ✅ **LinkedIn Content Master Agent** (Main orchestrator)
- ✅ **Research Agent** (Web research + audience targeting)
- ✅ **Performance Agent** (LinkedIn history analysis)
- ✅ **Script Agent** (Content creation)
- ✅ **Hook Agent** (250+ viral hooks database)

## 🔑 Step 3: Configure API Keys

After importing, you'll need to add these API keys to the workflow nodes:

### Required API Keys:
1. **OpenRouter API Key**
   - Node: "OpenRouter Chat Model"
   - Used for: GPT-4 and Claude access
   - Get key at: https://openrouter.ai/keys

2. **Anthropic API Key**
   - Node: "Anthropic Chat Model1" (Hook Agent)
   - Used for: Claude 4 Sonnet hook optimization
   - Get key at: https://console.anthropic.com/

3. **Tavily API Key**
   - Node: "Tavily" (Research Agent)
   - Used for: Web search and research
   - Get key at: https://tavily.com/

4. **Google OAuth Setup**
   - Node: "Get a document in Google Docs"
   - Used for: Accessing audience avatar data
   - Setup: Google Cloud Console OAuth2

### How to Add API Keys:
1. Click on each node that shows a red error indicator
2. Click "Create New Credential" or select existing credential
3. Enter your API key and save
4. Test the connection

## 🧪 Step 4: Test Your LinkedIn Automation

### Test Workflow:
1. **Activate the Workflow**: Click the toggle switch to "Active"
2. **Send Test Content**: Use the webhook URL or manual trigger
3. **Sample Test Content**:
   ```
   Small businesses are finally getting access to enterprise-level AI tools.
   The playing field is leveling, and the results are incredible.
   Here's what I learned implementing AI for 50+ small businesses...
   ```

### Expected Output:
- ✅ **Optimized LinkedIn Post**: Professional, engaging format
- ✅ **3 Alternative Hooks**: From 250+ proven examples
- ✅ **Research Insights**: Current trends and data
- ✅ **Performance Insights**: Based on your LinkedIn history

## 🔄 Workflow Process Flow:

```
Content Input
      ↓
Research Agent (Tavily + Google Docs)
      ↓
Performance Agent (LinkedIn Analysis)
      ↓
Script Agent (Content Creation)
      ↓  
Hook Agent (250+ Viral Hooks)
      ↓
Optimized LinkedIn Post + 3 Hook Variants
```

## 📊 Integration with BizFlow:

Your BizFlow **Vertex AI Creative** agent will enhance this workflow by:
- Pre-processing content for maximum engagement
- Adding cultural intelligence and brand voice
- Optimizing for visual storytelling
- Providing SEO enhancements

## 🛠️ Troubleshooting:

### Common Issues:
- **Red nodes**: Missing API keys - add credentials
- **Timeout errors**: Increase timeout in node settings
- **Google Docs access**: Ensure OAuth is properly configured
- **Hook generation fails**: Check Anthropic API key

### Support:
- Check N8N execution logs in the web interface
- Test individual nodes by clicking "Test step"
- Verify all API keys are valid and have sufficient credits

## 🎯 Next Steps:

1. Complete the API key setup
2. Test with sample content
3. Configure your audience avatar document
4. Start automating your LinkedIn content creation!

---

**Your LinkedIn automation empire is almost ready! 🚀**