# Awesome AI Apps MCP Integration

This directory contains MCP (Model Context Protocol) servers from the [arindam200/awesome-ai-apps](https://github.com/arindam200/awesome-ai-apps) repository, integrated into your Claude Code environment.

## 🚀 Available MCP Servers

### 1. Email MCP Server (`email-mcp`)
- **Purpose**: Send emails via Gmail SMTP
- **Location**: `mcp_ai_agents/custom_mcp_server/`
- **Features**:
  - Configure sender details
  - Send emails to recipients
  - Gmail integration with app passwords

### 2. Documentation MCP (`docs-mcp`)
- **Purpose**: Documentation Q&A agent with AI-powered responses
- **Location**: `mcp_ai_agents/docs_qna_agent/`
- **Features**:
  - Answer questions about documentation
  - AI-powered document analysis
  - Nebius AI integration

### 3. GitHub Official MCP (`github-official`)
- **Purpose**: Official GitHub MCP server (Docker-based)
- **Requirements**: Docker
- **Features**:
  - Repository insights
  - Issue and PR management
  - GitHub API integration

### 4. MCP Starter (`mcp-starter`)
- **Purpose**: GitHub repository analyzer starter template
- **Location**: `mcp_ai_agents/mcp_starter/`
- **Features**:
  - Repository analysis
  - GitHub integration
  - Starter template for custom MCP development

## 📦 Setup Instructions

1. **Run the setup script**:
   ```bash
   ./setup-awesome-ai-mcps.sh
   ```

2. **Configure environment variables**:
   - Copy `.env.template` to `.env`
   - Fill in your API keys and tokens:
     - Gmail app password for email MCP
     - GitHub personal access token
     - Nebius API key (if using AI features)

3. **Configure Claude Code**:
   - The MCP servers are already added to your enhanced configuration:
   ```
   /Users/user/Documents/TAURUS AI Corp./CURSOR Projects/BizFlow-Vibe-Marketing-Ecosystem/mcp-agents/enhanced-cursor-mcp-config.json
   ```

## 🔧 Configuration Details

### Email MCP Configuration
```json
{
  "email-mcp": {
    "command": "python3",
    "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/.claude/awesome-AI-Apps/mcp_ai_agents/custom_mcp_server/mcp-server.py"],
    "env": {
      "SENDER_NAME": "Your Name",
      "SENDER_EMAIL": "your-email@gmail.com",
      "SENDER_PASSKEY": "your-app-password"
    }
  }
}
```

### GitHub Official MCP Configuration
```json
{
  "github-official": {
    "command": "docker",
    "args": [
      "run", "-i", "--rm",
      "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
      "ghcr.io/github/github-mcp-server"
    ],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
    }
  }
}
```

## 🔑 Required API Keys

1. **Gmail App Password**: 
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate an app password for "Mail"

2. **GitHub Personal Access Token**:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Create a token with `repo`, `read:org`, and `read:user` scopes

3. **Nebius API Key** (optional):
   - Required for AI-powered features
   - Sign up at [Nebius AI Studio](https://studio.nebius.ai/)

## 🛠️ Usage Examples

### Email MCP
```python
# Configure email settings
mcp_tools.configure_email(
    sender_name="Your Name",
    sender_email="your@gmail.com", 
    sender_passkey="app_password"
)

# Send an email
mcp_tools.send_email(
    receiver_email="recipient@example.com",
    subject="Hello from MCP",
    body="This email was sent via MCP!"
)
```

### GitHub MCP
```python
# Get repository information
repo_info = mcp_tools.get_repository("owner/repo")

# List issues
issues = mcp_tools.list_issues("owner/repo")

# Get pull requests
prs = mcp_tools.list_pull_requests("owner/repo")
```

## 📁 Directory Structure

```
.claude/awesome-AI-Apps/
├── mcp_ai_agents/
│   ├── custom_mcp_server/         # Email MCP server
│   ├── docs_qna_agent/           # Documentation Q&A MCP
│   ├── github_mcp_agent/         # GitHub MCP client
│   └── mcp_starter/              # MCP starter template
├── setup-awesome-ai-mcps.sh     # Setup script
├── .env.template                 # Environment template
└── README-MCP-INTEGRATION.md     # This file
```

## 🔍 Troubleshooting

1. **Email MCP not working**:
   - Verify Gmail app password is correct
   - Ensure 2FA is enabled on Gmail account
   - Check sender email and name configuration

2. **GitHub MCP not working**:
   - Verify GitHub token has correct permissions
   - For Docker version, ensure Docker is running
   - Check token scopes include `repo` access

3. **Python import errors**:
   - Run: `python3 -m pip install fastmcp mcp python-dotenv`
   - Ensure Python 3.8+ is installed

## 📚 Additional Resources

- [Original Awesome AI Apps Repository](https://github.com/arindam200/awesome-ai-apps)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Claude Code Documentation](https://claude.ai/code)

## 🤝 Contributing

To add more MCP servers from the awesome-ai-apps collection:

1. Install dependencies for the specific MCP server
2. Add configuration to `enhanced-cursor-mcp-config.json`
3. Update this README with usage instructions
4. Test the integration

## 📄 License

This integration follows the MIT License from the original awesome-ai-apps repository.