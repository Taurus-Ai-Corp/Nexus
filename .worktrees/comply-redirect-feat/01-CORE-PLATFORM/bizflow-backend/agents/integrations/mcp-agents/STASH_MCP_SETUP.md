# Stash MCP Server Setup Guide

## Overview
This guide covers the setup and configuration of the Stash MCP Server for Cursor IDE integration. The server provides seamless access to Atlassian Stash and Bitbucket repositories directly from Cursor.

## Features
- List repositories and projects
- Browse branches and commits
- Manage pull requests
- View repository information
- Create new pull requests
- Support for both legacy Stash and modern Bitbucket

## Prerequisites
- Node.js 18.0.0 or higher
- Access to Atlassian Stash or Bitbucket instance
- Appropriate authentication credentials

## Installation

### 1. Install Dependencies
Navigate to the MCP agents directory and install dependencies:

```bash
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents"
npm install
```

### 2. Environment Configuration
Add the following environment variables to your `master.env` file:

```bash
# Stash Configuration (Legacy)
STASH_URL=https://stash.yourcompany.com
STASH_USERNAME=your_username
STASH_PASSWORD=your_password
STASH_API_TOKEN=your_api_token

# Bitbucket Configuration (Modern)
BITBUCKET_URL=https://bitbucket.org
BITBUCKET_USERNAME=your_username
BITBUCKET_APP_PASSWORD=your_app_password
```

### 3. Authentication Setup

#### For Stash (Legacy):
1. Generate an API token from your Stash instance
2. Set `STASH_URL` to your Stash instance URL
3. Set `STASH_USERNAME` and `STASH_API_TOKEN`

#### For Bitbucket (Modern):
1. Create an App Password in Bitbucket settings
2. Set `BITBUCKET_URL` (usually `https://bitbucket.org` for cloud)
3. Set `BITBUCKET_USERNAME` and `BITBUCKET_APP_PASSWORD`

## Configuration

### Cursor MCP Configuration
The Stash MCP server has been added to your Cursor configuration at `/Users/user/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "stash-mcp-server": {
      "command": "node",
      "args": [
        "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/stash-mcp-server.js"
      ],
      "env": {
        "STASH_URL": "${STASH_URL}",
        "STASH_USERNAME": "${STASH_USERNAME}",
        "STASH_PASSWORD": "${STASH_PASSWORD}",
        "STASH_API_TOKEN": "${STASH_API_TOKEN}",
        "BITBUCKET_URL": "${BITBUCKET_URL}",
        "BITBUCKET_USERNAME": "${BITBUCKET_USERNAME}",
        "BITBUCKET_APP_PASSWORD": "${BITBUCKET_APP_PASSWORD}"
      }
    }
  }
}
```

## Available Tools

### 1. List Repositories
```javascript
// List all repositories
await stash.list_repositories()

// List repositories in a specific project
await stash.list_repositories({ projectKey: "PROJ" })
```

### 2. Get Repository Information
```javascript
await stash.get_repository_info({
  repositorySlug: "my-repo",
  projectKey: "PROJ"
})
```

### 3. List Branches
```javascript
await stash.list_branches({
  repositorySlug: "my-repo",
  projectKey: "PROJ"
})
```

### 4. Get Commit Information
```javascript
await stash.get_commit_info({
  repositorySlug: "my-repo",
  projectKey: "PROJ",
  commitId: "abc123def456"
})
```

### 5. List Pull Requests
```javascript
// List all pull requests
await stash.list_pull_requests({
  repositorySlug: "my-repo",
  projectKey: "PROJ"
})

// List open pull requests only
await stash.list_pull_requests({
  repositorySlug: "my-repo",
  projectKey: "PROJ",
  state: "OPEN"
})
```

### 6. Create Pull Request
```javascript
await stash.create_pull_request({
  repositorySlug: "my-repo",
  projectKey: "PROJ",
  title: "Add new feature",
  description: "This PR adds a new authentication feature",
  fromRef: "feature/auth",
  toRef: "main"
})
```

## Usage Examples

### Browse Repository Structure
```
User: "Show me all repositories in the PROJ project"
Assistant: [Uses stash.list_repositories with projectKey: "PROJ"]
```

### Check Recent Commits
```
User: "What are the recent commits in the main branch of my-repo?"
Assistant: [Uses stash.list_branches and stash.get_commit_info]
```

### Create Pull Request
```
User: "Create a pull request from feature-branch to main for my-repo"
Assistant: [Uses stash.create_pull_request with appropriate parameters]
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify your credentials in the environment variables
   - Check if your API token has the necessary permissions
   - Ensure the URL format is correct

2. **Server Not Starting**
   - Check Node.js version (requires 18.0.0+)
   - Verify all dependencies are installed
   - Check the server logs for error messages

3. **Repository Not Found**
   - Verify the project key and repository slug
   - Check if you have access to the repository
   - Ensure the repository exists

### Debug Mode
Run the server in debug mode for detailed logging:

```bash
npm run dev
```

### Logs
Check Cursor's MCP logs for detailed error information and debugging.

## Security Notes

- Never commit credentials to version control
- Use environment variables for all sensitive information
- Regularly rotate API tokens and passwords
- Ensure proper permissions are set on the MCP server files

## Support

For issues with the Stash MCP server:
1. Check the troubleshooting section above
2. Review Cursor's MCP documentation
3. Check the server logs for error details
4. Verify your Stash/Bitbucket instance accessibility

## Updates

To update the Stash MCP server:
1. Pull the latest changes
2. Run `npm install` to update dependencies
3. Restart Cursor to load the updated server

---
*Configuration updated: 2025-01-15*
*Total MCP servers: 17*





