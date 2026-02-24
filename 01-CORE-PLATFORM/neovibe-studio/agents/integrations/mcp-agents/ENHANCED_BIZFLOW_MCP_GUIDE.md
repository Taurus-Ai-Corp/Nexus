# 🚀 Enhanced BizFlow MCP Ecosystem Guide

## Overview
This guide provides comprehensive setup instructions for the enhanced BizFlow ecosystem with integrated MCP (Model Context Protocol) agents for Taurus AI Corp. The system now includes powerful business automation tools, development aids, and workflow management capabilities.

## 📁 Repository Structure

```
mcp-agents/
├── external-mcps/          # External MCP agent repositories
│   ├── anthropic-cookbook/ # Anthropic examples and patterns
│   ├── klavis/            # Klavis unified MCP servers
│   ├── motia/             # Motia workflow automation
│   ├── playwright-mcp/    # Microsoft Playwright automation
│   ├── sim/               # SimStudio AI tools
│   └── stagewise/         # Stagewise development tools
├── original agents/        # Your custom MCP agents
│   ├── figma-mcp/
│   ├── tailwind-mcp/
│   ├── design-tokens-mcp/
│   ├── component-library-mcp/
│   └── icon-assets-mcp/
└── configurations/         # Setup files
    ├── enhanced-cursor-mcp-config.json
    └── ENHANCED_BIZFLOW_MCP_GUIDE.md
```

## 🛠️ Available MCP Agents

### Development & Design Tools
1. **Figma MCP** - Design file integration
   - Extract design tokens from Figma
   - Get component specifications
   - Access file metadata
   
2. **Tailwind MCP** - CSS framework optimization
   - Generate Tailwind components
   - Optimize class combinations
   - Suggest responsive classes
   
3. **Design Tokens MCP** - Design system management
   - Generate CSS/SCSS variables
   - Export tokens for JavaScript
   - Validate token structure
   
4. **Component Library MCP** - UI component management
   - Generate reusable components
   - Create component variants
   - Validate accessibility compliance
   
5. **Icon Assets MCP** - Icon and asset management
   - Retrieve optimized icons
   - Generate icon components
   - SVG optimization

### Browser Automation
6. **Microsoft Playwright MCP** - Web automation
   - Automate web interactions
   - Extract page data
   - Run browser-based tests
   - Form submissions and interactions

### Business Integration Tools (Klavis)
7. **Gmail MCP** - Email management
   - Send/receive emails
   - Manage labels and threads
   - Search and filter messages
   
8. **Google Sheets MCP** - Spreadsheet operations
   - Read/write spreadsheet data
   - Manage worksheets
   - Data analysis and formatting
   
9. **Slack MCP** - Team communication
   - Send messages to channels/users
   - Manage channels and users
   - Search message history
   
10. **Notion MCP** - Documentation and project management
    - Create and update pages
    - Manage databases
    - Search content across workspace
    
11. **HubSpot MCP** - CRM integration
    - Manage contacts and companies
    - Track deals and opportunities
    - Create and update tickets
    
12. **Airtable MCP** - Database management
    - Manage records and tables
    - Query and filter data
    - Handle relationships between tables
    
13. **Linear MCP** - Issue tracking
    - Create and update issues
    - Manage projects and teams
    - Track progress and comments
    
14. **GitHub MCP (Klavis)** - Advanced code management
    - Repository management
    - Pull request operations
    - Issue tracking and code scanning

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18 or newer
- Python 3.12+ (recommended)
- Access tokens for relevant services

### Environment Variables Setup

Create a `.env` file in your project root:

```bash
# Design Tools
FIGMA_ACCESS_TOKEN=your_figma_token_here
DESIGN_TOKENS_PATH=/path/to/tokens

# Google Services
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Communication
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_USER_TOKEN=xoxp-your-slack-user-token

# Project Management
NOTION_API_KEY=secret_your_notion_api_key
LINEAR_API_KEY=your_linear_api_key

# CRM & Marketing
HUBSPOT_ACCESS_TOKEN=your_hubspot_token
AIRTABLE_ACCESS_TOKEN=your_airtable_token

# Code Management
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
```

### Claude Code CLI Setup

For the easiest setup, use Claude Code CLI:

```bash
# Install Playwright MCP
claude mcp add playwright npx @playwright/mcp@latest

# Add other agents manually through Cursor settings
```

### Cursor Configuration

Copy the configuration from `enhanced-cursor-mcp-config.json` to your Cursor MCP settings:

1. Open Cursor IDE
2. Go to Settings → Extensions → MCP
3. Add the server configurations from the enhanced config file
4. Set appropriate environment variables

## 🎯 BizFlow Use Cases

### Marketing & Sales Automation
- **Lead Management**: Use HubSpot MCP to automatically update contact records
- **Email Campaigns**: Gmail MCP for personalized outreach
- **Social Analytics**: Track engagement across platforms
- **Content Creation**: Generate marketing materials with design tools

### Project Management
- **Task Automation**: Linear MCP for issue tracking
- **Documentation**: Notion MCP for project documentation  
- **Team Communication**: Slack MCP for automated notifications
- **Progress Tracking**: Airtable MCP for project databases

### Development Workflow
- **Code Reviews**: GitHub MCP for automated PR management
- **UI Development**: Figma + Tailwind MCPs for design-to-code
- **Testing**: Playwright MCP for automated browser testing
- **Component Libraries**: Component Library MCP for reusable assets

### Data Management
- **Analytics**: Google Sheets MCP for data processing
- **Reporting**: Generate automated reports across platforms
- **Integration**: Connect data between different business tools
- **Backup & Sync**: Automated data synchronization

## 🧪 Testing Your Setup

### Quick Tests

1. **Test Playwright MCP**:
   ```bash
   cd external-mcps/playwright-mcp
   npm run build
   echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {"tools": {}}, "clientInfo": {"name": "test", "version": "1.0.0"}}}' | node index.js
   ```

2. **Test Klavis MCPs**:
   ```bash
   cd external-mcps/klavis/mcp_servers/notion
   python server.py
   ```

3. **Test Original MCPs**:
   ```bash
   cd tailwind-mcp
   echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {"tools": {}}, "clientInfo": {"name": "test", "version": "1.0.0"}}}' | node index.js
   ```

### Integration Testing

Use Claude Code to test functionality:
- "Generate a Tailwind button component"
- "Create a new Notion page for project planning" 
- "Send a Slack message to the team channel"
- "Extract data from this Google Sheet"

## 🔒 Security & Best Practices

### API Key Management
- Store sensitive tokens in environment variables
- Use OAuth where possible instead of static tokens
- Regularly rotate access tokens
- Limit scope permissions to minimum required

### Access Control
- Configure workspace-specific permissions
- Monitor MCP agent usage and access logs
- Set up alerts for unusual activity
- Regular security audits of connected services

### Development Guidelines
- Test MCP agents in development environment first
- Use version control for configuration files
- Document any custom modifications
- Follow the principle of least privilege

## 🚀 Advanced Features

### Workflow Automation
- Chain multiple MCP agents for complex workflows
- Use conditional logic based on business rules
- Set up automated triggers and responses
- Create custom business process automations

### Custom Agent Development
- Extend existing MCP agents with custom functionality
- Create domain-specific agents for your business needs
- Integrate with internal APIs and systems
- Build reusable agent libraries

### Monitoring & Analytics
- Track agent usage and performance metrics
- Set up alerting for failed operations
- Monitor API rate limits and usage patterns
- Generate reports on automation effectiveness

## 🆘 Troubleshooting

### Common Issues

1. **Port Conflicts**: Many Klavis MCPs run on port 5000
   - Solution: Configure different ports in environment variables
   
2. **Authentication Errors**: Invalid or expired tokens
   - Solution: Refresh tokens and update environment variables
   
3. **Module Not Found**: Missing dependencies or build artifacts
   - Solution: Run `npm install` and `npm run build` in relevant directories

4. **Permission Denied**: Insufficient API permissions
   - Solution: Check and update API scopes and permissions

### Getting Help

- Check individual MCP server README files
- Review official MCP documentation
- Test agents individually before integration
- Monitor logs for detailed error messages

## 📈 Future Enhancements

### Planned Additions
- Additional Klavis MCP servers (Discord, Stripe, Shopify)
- Custom Taurus AI-specific MCP agents
- Enhanced workflow orchestration tools
- Real-time collaboration features
- Advanced analytics and reporting

### Integration Roadmap
- Connect with existing BizFlow systems
- Add support for more business platforms
- Develop industry-specific agent packages
- Enhanced security and compliance features

---

**Status**: ✅ Ready for Production Use  
**Last Updated**: August 28, 2025  
**Maintained By**: Taurus AI Corp Development Team