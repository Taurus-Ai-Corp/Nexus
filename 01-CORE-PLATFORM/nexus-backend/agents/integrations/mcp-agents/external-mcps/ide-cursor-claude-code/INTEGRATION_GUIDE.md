# Claude Code MCP Server - Integration Guide

This guide provides step-by-step instructions for integrating the Claude Code MCP Server with VS Code and Cursor.

## Prerequisites

- Node.js 18.0.0 or higher
- Anthropic API key
- VS Code or Cursor with MCP support
- Git (for version control)

## Quick Start

### 1. Installation

```bash
# Navigate to the agent directory
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/ide-cursor-claude-code"

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Environment Setup

```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY="your-anthropic-api-key-here"

# Optional: Set other environment variables
export NODE_ENV="development"
export LOG_LEVEL="info"
```

### 3. Test the Installation

```bash
# Run the test script
node test-server.js
```

### 4. Configure MCP in VS Code/Cursor

#### For VS Code:

1. Open VS Code settings (Cmd/Ctrl + ,)
2. Search for "MCP" or "Model Context Protocol"
3. Add the following configuration:

```json
{
  "mcp.servers": {
    "claude-code-cursor": {
      "command": "node",
      "args": ["dist/server.js"],
      "cwd": "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/ide-cursor-claude-code",
      "env": {
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

#### For Cursor:

1. Open Cursor settings
2. Navigate to MCP configuration
3. Add the server configuration:

```json
{
  "mcpServers": {
    "claude-code-cursor": {
      "command": "node",
      "args": ["dist/server.js"],
      "cwd": "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/ide-cursor-claude-code",
      "env": {
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

## Detailed Integration Steps

### Step 1: Project Setup

1. **Clone or Download the Agent**
   ```bash
   # If using git
   git clone <repository-url>
   cd ide-cursor-claude-code
   
   # Or navigate to the existing directory
   cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/ide-cursor-claude-code"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Installation**
   ```bash
   npm list
   ```

### Step 2: Build Configuration

1. **TypeScript Configuration**
   - The project includes a `tsconfig.json` with optimal settings
   - No additional configuration needed

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Verify Build**
   ```bash
   ls -la dist/
   # Should show compiled JavaScript files
   ```

### Step 3: Environment Configuration

1. **Create Environment File**
   ```bash
   cp env.example .env
   ```

2. **Edit Environment Variables**
   ```bash
   # Edit .env file
   nano .env
   
   # Add your API key
   ANTHROPIC_API_KEY=your-actual-api-key-here
   ```

3. **Load Environment Variables**
   ```bash
   source .env
   ```

### Step 4: MCP Server Configuration

1. **VS Code Integration**

   Create or edit your VS Code settings:
   
   **Global Settings** (`~/.vscode/settings.json`):
   ```json
   {
     "mcp.servers": {
       "claude-code-cursor": {
         "command": "node",
         "args": ["dist/server.js"],
         "cwd": "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/ide-cursor-claude-code",
         "env": {
           "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
         }
       }
     }
   }
   ```

   **Workspace Settings** (`.vscode/settings.json` in your project):
   ```json
   {
     "mcp.servers": {
       "claude-code-cursor": {
         "command": "node",
         "args": ["dist/server.js"],
         "cwd": "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/ide-cursor-claude-code",
         "env": {
           "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
         }
       }
     }
   }
   ```

2. **Cursor Integration**

   Create or edit your Cursor configuration:
   
   **Global Configuration** (`~/.cursor/mcp.json`):
   ```json
   {
     "mcpServers": {
       "claude-code-cursor": {
         "command": "node",
         "args": ["dist/server.js"],
         "cwd": "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/ide-cursor-claude-code",
         "env": {
           "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
         }
       }
     }
   }
   ```

### Step 5: Testing the Integration

1. **Run Test Script**
   ```bash
   node test-server.js
   ```

2. **Manual Testing**
   ```bash
   # Start the server manually
   npm start
   
   # In another terminal, test MCP connection
   # (This depends on your MCP client setup)
   ```

3. **Verify in IDE**
   - Open VS Code/Cursor
   - Check that MCP tools are available
   - Try using a tool like "analyze_code"

### Step 6: Usage Examples

1. **Code Analysis**
   - Select code in your editor
   - Use the "analyze_code" tool
   - Review the analysis results

2. **Code Generation**
   - Use the "generate_code" tool
   - Provide requirements
   - Get generated code

3. **Code Refactoring**
   - Select code to refactor
   - Use the "refactor_code" tool
   - Apply the refactored code

## Troubleshooting

### Common Issues

1. **"ANTHROPIC_API_KEY not found"**
   - Ensure the environment variable is set
   - Check that the API key is valid
   - Restart your IDE after setting the variable

2. **"Module not found" errors**
   - Run `npm install` to install dependencies
   - Run `npm run build` to compile TypeScript
   - Check that the `dist/` directory exists

3. **MCP connection failed**
   - Verify the server configuration
   - Check that the server is running
   - Review the logs for error messages

4. **Tool execution errors**
   - Check input parameters
   - Verify file paths are correct
   - Ensure code content is valid

### Debug Mode

Enable debug logging:

```bash
export LOG_LEVEL=debug
node test-server.js
```

### Logs

Check logs for detailed error information:

```bash
# Server logs
npm start 2>&1 | tee server.log

# Test logs
node test-server.js 2>&1 | tee test.log
```

## Advanced Configuration

### Custom Model Selection

```bash
export CLAUDE_MODEL="claude-3-5-sonnet-20241022"
```

### Rate Limiting

```bash
export RATE_LIMIT_REQUESTS=100
export RATE_LIMIT_WINDOW=60000
```

### Caching

```bash
export CACHE_TTL=3600
export CACHE_MAX_SIZE=1000
```

## Security Considerations

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables
   - Consider using a secrets management system

2. **Network Security**
   - Use HTTPS for API calls
   - Implement proper authentication
   - Monitor API usage

3. **Code Security**
   - Validate all inputs
   - Sanitize user-provided content
   - Implement proper error handling

## Performance Optimization

1. **Caching**
   - Enable response caching
   - Use appropriate TTL values
   - Monitor cache hit rates

2. **Rate Limiting**
   - Implement request throttling
   - Monitor API usage
   - Handle rate limit errors gracefully

3. **Resource Management**
   - Monitor memory usage
   - Implement proper cleanup
   - Use connection pooling

## Monitoring and Maintenance

1. **Health Checks**
   - Implement health check endpoints
   - Monitor server status
   - Set up alerts

2. **Logging**
   - Use structured logging
   - Implement log rotation
   - Monitor error rates

3. **Updates**
   - Keep dependencies updated
   - Monitor for security updates
   - Test updates in staging

## Support and Resources

- **Documentation**: See README.md for detailed API documentation
- **Examples**: Check examples/usage-examples.md for usage patterns
- **Issues**: Create issues in the project repository
- **Community**: Join the Anthropic community for support

## Next Steps

1. **Explore Tools**: Try different tools to understand their capabilities
2. **Customize**: Modify tools for your specific needs
3. **Integrate**: Add the server to your development workflow
4. **Contribute**: Help improve the project

---

**Happy Coding with Claude Code! 🚀**
