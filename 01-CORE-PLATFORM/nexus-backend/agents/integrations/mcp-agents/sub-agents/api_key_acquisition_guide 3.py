#!/usr/bin/env python3
"""
API Key Acquisition Guide Generator
Master Orchestrator Sub-Agent for MCP API Keys Fix System

This agent generates comprehensive guides for acquiring all required API keys
with step-by-step instructions and direct links.
"""

from datetime import datetime
from pathlib import Path


class APIKeyAcquisitionGuideGenerator:
    """Generates comprehensive API key acquisition guides"""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.guide_data = self._load_guide_data()

    def _load_guide_data(self) -> dict:
        """Load comprehensive API key acquisition data"""
        return {
            "high_priority": {
                "PERPLEXITY_API_KEY": {
                    "service": "Perplexity AI",
                    "description": "AI-powered search and research platform",
                    "website": "https://www.perplexity.ai/",
                    "signup_url": "https://www.perplexity.ai/settings/api",
                    "pricing": "Free tier available, Pro plans start at $20/month",
                    "steps": [
                        "1. Visit https://www.perplexity.ai/",
                        "2. Click 'Sign Up' and create an account",
                        "3. Go to Settings > API",
                        "4. Click 'Create API Key'",
                        "5. Copy the generated key",
                        "6. Replace 'your_perplexity_key_here' in your .env file"
                    ],
                    "key_format": "pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["AI-powered search", "MCP integration", "Research automation"]
                },
                "FIRECRAWL_API_KEY": {
                    "service": "Firecrawl",
                    "description": "Web scraping and content extraction service",
                    "website": "https://firecrawl.dev/",
                    "signup_url": "https://firecrawl.dev/app",
                    "pricing": "Free tier available, Pro plans start at $25/month",
                    "steps": [
                        "1. Visit https://firecrawl.dev/",
                        "2. Click 'Get Started' and sign up",
                        "3. Go to your dashboard",
                        "4. Navigate to 'API Keys' section",
                        "5. Click 'Generate New Key'",
                        "6. Copy the generated key",
                        "7. Replace 'your_firecrawl_key_here' in your .env file"
                    ],
                    "key_format": "fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["Web scraping", "Content analysis", "MCP integration"]
                },
                "ANTHROPIC_API_KEY": {
                    "service": "Anthropic Claude",
                    "description": "Advanced AI assistant and language model",
                    "website": "https://www.anthropic.com/",
                    "signup_url": "https://console.anthropic.com/",
                    "pricing": "Pay-per-use, $5-15 per million tokens",
                    "steps": [
                        "1. Visit https://www.anthropic.com/",
                        "2. Click 'Get Started' and create an account",
                        "3. Go to https://console.anthropic.com/",
                        "4. Navigate to 'API Keys' section",
                        "5. Click 'Create Key'",
                        "6. Copy the generated key",
                        "7. Replace 'your_anthropic_key_here' in your .env file"
                    ],
                    "key_format": "sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["Claude AI integration", "MCP integration", "Advanced AI features"]
                },
                "OPENAI_API_KEY": {
                    "service": "OpenAI",
                    "description": "ChatGPT and GPT models API",
                    "website": "https://openai.com/",
                    "signup_url": "https://platform.openai.com/api-keys",
                    "pricing": "Pay-per-use, $0.002-0.06 per 1K tokens",
                    "steps": [
                        "1. Visit https://openai.com/",
                        "2. Click 'Sign Up' and create an account",
                        "3. Go to https://platform.openai.com/api-keys",
                        "4. Click 'Create new secret key'",
                        "5. Copy the generated key",
                        "6. Replace 'your_openai_key_here' in your .env file"
                    ],
                    "key_format": "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["ChatGPT integration", "MCP integration", "AI text generation"]
                }
            },
            "medium_priority": {
                "FIGMA_ACCESS_TOKEN": {
                    "service": "Figma",
                    "description": "Design collaboration and prototyping platform",
                    "website": "https://www.figma.com/",
                    "signup_url": "https://www.figma.com/settings",
                    "pricing": "Free tier available, Professional $12/month",
                    "steps": [
                        "1. Visit https://www.figma.com/",
                        "2. Sign up or log in to your account",
                        "3. Go to Settings > Account",
                        "4. Scroll down to 'Personal access tokens'",
                        "5. Click 'Create new token'",
                        "6. Give it a name (e.g., 'MCP Integration')",
                        "7. Copy the generated token",
                        "8. Replace 'your_figma_token_here' in your .env file"
                    ],
                    "key_format": "figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["Design file access", "Figma integration", "Design token extraction"]
                },
                "GOOGLE_CLIENT_ID": {
                    "service": "Google Cloud Console",
                    "description": "Google OAuth credentials for Gmail/Sheets integration",
                    "website": "https://console.cloud.google.com/",
                    "signup_url": "https://console.cloud.google.com/apis/credentials",
                    "pricing": "Free tier available, usage-based pricing",
                    "steps": [
                        "1. Visit https://console.cloud.google.com/",
                        "2. Create a new project or select existing",
                        "3. Go to APIs & Services > Credentials",
                        "4. Click 'Create Credentials' > 'OAuth client ID'",
                        "5. Configure OAuth consent screen if needed",
                        "6. Select 'Web application' as application type",
                        "7. Add authorized redirect URIs",
                        "8. Copy the Client ID",
                        "9. Replace 'your_google_client_id_here' in your .env file"
                    ],
                    "key_format": "xxxxxxxxxxxxxxxx.apps.googleusercontent.com",
                    "required_for": ["Gmail integration", "Google Sheets", "Google services"]
                },
                "GOOGLE_CLIENT_SECRET": {
                    "service": "Google Cloud Console",
                    "description": "Google OAuth secret for Gmail/Sheets integration",
                    "website": "https://console.cloud.google.com/",
                    "signup_url": "https://console.cloud.google.com/apis/credentials",
                    "pricing": "Free tier available, usage-based pricing",
                    "steps": [
                        "1. Follow steps for GOOGLE_CLIENT_ID above",
                        "2. After creating OAuth client ID",
                        "3. Click on the created credential",
                        "4. Copy the Client Secret",
                        "5. Replace 'your_google_client_secret_here' in your .env file"
                    ],
                    "key_format": "GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["Gmail integration", "Google Sheets", "Google services"]
                },
                "SLACK_BOT_TOKEN": {
                    "service": "Slack API",
                    "description": "Slack bot for automation and notifications",
                    "website": "https://api.slack.com/",
                    "signup_url": "https://api.slack.com/apps",
                    "pricing": "Free tier available, paid plans for advanced features",
                    "steps": [
                        "1. Visit https://api.slack.com/apps",
                        "2. Click 'Create New App'",
                        "3. Choose 'From scratch'",
                        "4. Enter app name and select workspace",
                        "5. Go to 'OAuth & Permissions'",
                        "6. Add required scopes (chat:write, channels:read, etc.)",
                        "7. Install app to workspace",
                        "8. Copy 'Bot User OAuth Token'",
                        "9. Replace 'xoxb-your-slack-bot-token-here' in your .env file"
                    ],
                    "key_format": "xoxb-xxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["Slack automation", "Notifications", "Team communication"]
                },
                "NOTION_API_KEY": {
                    "service": "Notion API",
                    "description": "Notion workspace integration and automation",
                    "website": "https://www.notion.so/",
                    "signup_url": "https://www.notion.so/my-integrations",
                    "pricing": "Free tier available, Plus $8/month",
                    "steps": [
                        "1. Visit https://www.notion.so/",
                        "2. Sign up or log in to your account",
                        "3. Go to https://www.notion.so/my-integrations",
                        "4. Click 'New integration'",
                        "5. Enter name and select workspace",
                        "6. Copy the 'Internal Integration Token'",
                        "7. Replace 'secret_your_notion_api_key_here' in your .env file"
                    ],
                    "key_format": "secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["Notion workspace", "Documentation", "Knowledge management"]
                }
            },
            "low_priority": {
                "HUBSPOT_ACCESS_TOKEN": {
                    "service": "HubSpot",
                    "description": "CRM and marketing automation platform",
                    "website": "https://www.hubspot.com/",
                    "signup_url": "https://developers.hubspot.com/docs/api/private-apps",
                    "pricing": "Free tier available, paid plans start at $45/month",
                    "steps": [
                        "1. Visit https://www.hubspot.com/",
                        "2. Sign up for a free account",
                        "3. Go to Settings > Integrations > Private Apps",
                        "4. Click 'Create a private app'",
                        "5. Configure scopes and permissions",
                        "6. Copy the 'Access Token'",
                        "7. Replace 'your_hubspot_access_token_here' in your .env file"
                    ],
                    "key_format": "pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                    "required_for": ["CRM integration", "Lead management", "Marketing automation"]
                },
                "AIRTABLE_ACCESS_TOKEN": {
                    "service": "Airtable",
                    "description": "Database and collaboration platform",
                    "website": "https://airtable.com/",
                    "signup_url": "https://airtable.com/create/tokens",
                    "pricing": "Free tier available, Plus $10/month",
                    "steps": [
                        "1. Visit https://airtable.com/",
                        "2. Sign up or log in to your account",
                        "3. Go to https://airtable.com/create/tokens",
                        "4. Click 'Create new token'",
                        "5. Enter name and select scopes",
                        "6. Copy the generated token",
                        "7. Replace 'your_airtable_access_token_here' in your .env file"
                    ],
                    "key_format": "patxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxx",
                    "required_for": ["Database management", "Data storage", "Collaboration"]
                },
                "LINEAR_API_KEY": {
                    "service": "Linear",
                    "description": "Project management and issue tracking",
                    "website": "https://linear.app/",
                    "signup_url": "https://linear.app/settings/api",
                    "pricing": "Free tier available, paid plans start at $8/month",
                    "steps": [
                        "1. Visit https://linear.app/",
                        "2. Sign up or log in to your account",
                        "3. Go to Settings > API",
                        "4. Click 'Create API Key'",
                        "5. Enter name and select permissions",
                        "6. Copy the generated key",
                        "7. Replace 'your_linear_api_key_here' in your .env file"
                    ],
                    "key_format": "lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["Project management", "Issue tracking", "Team collaboration"]
                },
                "GITHUB_PERSONAL_ACCESS_TOKEN": {
                    "service": "GitHub",
                    "description": "Git repository hosting and collaboration",
                    "website": "https://github.com/",
                    "signup_url": "https://github.com/settings/tokens",
                    "pricing": "Free for public repos, paid for private",
                    "steps": [
                        "1. Visit https://github.com/",
                        "2. Sign up or log in to your account",
                        "3. Go to Settings > Developer settings > Personal access tokens",
                        "4. Click 'Generate new token' > 'Generate new token (classic)'",
                        "5. Select scopes (repo, workflow, etc.)",
                        "6. Copy the generated token",
                        "7. Replace 'your_github_token_here' in your .env file"
                    ],
                    "key_format": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "required_for": ["GitHub integration", "Repository access", "CI/CD"]
                }
            }
        }

    def generate_comprehensive_guide(self) -> str:
        """Generate comprehensive API key acquisition guide"""
        print("📚 Generating API Key Acquisition Guide...")

        guide_content = f"""# 🔑 TAURUS AI CORP - API Keys Acquisition Guide

Generated by Master Orchestrator - API Keys Fix System
Date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## 🚨 CRITICAL PRIORITY - REQUIRED FOR MCP FUNCTIONALITY

These API keys are essential for MCP (Model Context Protocol) integration and must be configured first.

"""

        # High Priority Keys
        for key_name, data in self.guide_data["high_priority"].items():
            guide_content += self._generate_key_section(key_name, data, "🚨")

        guide_content += "\n## 🟡 MEDIUM PRIORITY - WORKFLOW INTEGRATIONS\n\n"

        # Medium Priority Keys
        for key_name, data in self.guide_data["medium_priority"].items():
            guide_content += self._generate_key_section(key_name, data, "🟡")

        guide_content += "\n## 🟢 LOW PRIORITY - BUSINESS TOOLS\n\n"

        # Low Priority Keys
        for key_name, data in self.guide_data["low_priority"].items():
            guide_content += self._generate_key_section(key_name, data, "🟢")

        # Add implementation section
        guide_content += self._generate_implementation_section()

        return guide_content

    def _generate_key_section(self, key_name: str, data: dict, priority_icon: str) -> str:
        """Generate a section for a specific API key"""
        section = f"""### {priority_icon} {key_name}

**Service:** {data['service']}  
**Description:** {data['description']}  
**Website:** {data['website']}  
**Pricing:** {data['pricing']}  
**Key Format:** `{data['key_format']}`  
**Required For:** {', '.join(data['required_for'])}

#### Steps to Get API Key:

"""

        for step in data['steps']:
            section += f"{step}\n"

        section += f"""
**Direct Link:** {data['signup_url']}

---
"""

        return section

    def _generate_implementation_section(self) -> str:
        """Generate implementation instructions section"""
        return """
## 🚀 IMPLEMENTATION INSTRUCTIONS

### Step 1: Update Your Environment File

1. Open your master environment file:
   ```
   /Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/master.env
   ```

2. Replace all placeholder values with your actual API keys:
   ```bash
   # Example:
   PERPLEXITY_API_KEY=pplx-your-actual-key-here
   FIRECRAWL_API_KEY=fc-your-actual-key-here
   # ... and so on
   ```

### Step 2: Test Your Configuration

Run the API Key Validation Agent to test all your keys:
```bash
python sub-agents/api_key_validator.py
```

### Step 3: Update MCP Configuration

The MCP configuration files will automatically reference your environment variables.

### Step 4: Restart Cursor IDE

After updating your API keys, restart Cursor IDE to load the new configuration.

## 🔒 SECURITY BEST PRACTICES

1. **Never commit .env files to version control**
2. **Use strong, unique API keys**
3. **Rotate keys regularly**
4. **Limit API key permissions to minimum required**
5. **Monitor API usage and costs**
6. **Use environment-specific keys (dev/staging/prod)**

## 🆘 TROUBLESHOOTING

### Common Issues:

1. **Invalid API Key Format**
   - Check the key format in the guide above
   - Ensure no extra spaces or characters

2. **Permission Denied**
   - Verify the API key has correct permissions
   - Check if the service requires additional setup

3. **Rate Limiting**
   - Check your API usage limits
   - Consider upgrading your plan if needed

4. **MCP Connection Issues**
   - Ensure all high-priority keys are configured
   - Check Cursor IDE MCP settings
   - Restart Cursor IDE after changes

### Getting Help:

- Check the service documentation for each API
- Contact support for the specific service
- Review the Master Orchestrator logs for detailed error messages

## 📊 PRIORITY IMPLEMENTATION ORDER

1. **Start with High Priority keys** (PERPLEXITY, FIRECRAWL, ANTHROPIC, OPENAI)
2. **Add Medium Priority keys** as needed for your workflows
3. **Configure Low Priority keys** for business tools

## ✅ COMPLETION CHECKLIST

- [ ] All high-priority API keys configured
- [ ] Environment file updated with real keys
- [ ] API Key Validation Agent passes all tests
- [ ] MCP configuration updated
- [ ] Cursor IDE restarted
- [ ] All integrations working correctly

---

*This guide was generated automatically by the Master Orchestrator API Keys Fix System.*
"""

    def save_guide(self, content: str) -> Path:
        """Save the guide to a file"""
        guide_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "API_KEYS_ACQUISITION_GUIDE.md"

        with open(guide_file, 'w') as f:
            f.write(content)

        print(f"📚 Guide saved to: {guide_file}")
        return guide_file

    def generate_quick_reference(self) -> str:
        """Generate a quick reference card"""
        quick_ref = f"""# 🔑 API Keys Quick Reference

Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## High Priority (Required for MCP)

| Key | Service | Format | Status |
|-----|---------|--------|--------|
"""

        for key_name, data in self.guide_data["high_priority"].items():
            quick_ref += f"| {key_name} | {data['service']} | `{data['key_format']}` | ⏳ Pending |\n"

        quick_ref += "\n## Medium Priority\n\n| Key | Service | Format | Status |\n|-----|---------|--------|--------|\n"

        for key_name, data in self.guide_data["medium_priority"].items():
            quick_ref += f"| {key_name} | {data['service']} | `{data['key_format']}` | ⏳ Pending |\n"

        quick_ref += "\n## Low Priority\n\n| Key | Service | Format | Status |\n|-----|---------|--------|--------|\n"

        for key_name, data in self.guide_data["low_priority"].items():
            quick_ref += f"| {key_name} | {data['service']} | `{data['key_format']}` | ⏳ Pending |\n"

        return quick_ref

def main():
    """Main execution function"""
    project_root = "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects"

    generator = APIKeyAcquisitionGuideGenerator(project_root)

    # Generate comprehensive guide
    guide_content = generator.generate_comprehensive_guide()
    guide_file = generator.save_guide(guide_content)

    # Generate quick reference
    quick_ref = generator.generate_quick_reference()
    quick_ref_file = generator.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "API_KEYS_QUICK_REFERENCE.md"

    with open(quick_ref_file, 'w') as f:
        f.write(quick_ref)

    print(f"📋 Quick reference saved to: {quick_ref_file}")
    print("\n✅ API Key Acquisition Guide generated successfully!")
    print(f"📚 Full guide: {guide_file}")
    print(f"📋 Quick reference: {quick_ref_file}")

    return guide_file, quick_ref_file

if __name__ == "__main__":
    main()
