#!/usr/bin/env python3
"""
Google Admin MCP Integrator
Integrates Google Workspace Admin Directory API with your MCP ecosystem
"""

import os
import json
import asyncio
import requests
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv('master.env')

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class GoogleAdminMCPIntegrator:
    """Google Admin MCP Integration for TAURUS AI CORP"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.google_admin_dir = self.project_root / "external-mcps" / "google-admin-mcp"
        
        # Google Admin API configuration
        self.google_client_id = os.getenv('GOOGLE_CLIENT_ID')
        self.google_client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        self.google_redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:8080/callback')
        self.google_workspace_domain = os.getenv('GOOGLE_WORKSPACE_DOMAIN')
        self.google_access_token = os.getenv('GOOGLE_ACCESS_TOKEN')
        self.google_refresh_token = os.getenv('GOOGLE_REFRESH_TOKEN')
        
        # MCP server configuration
        self.mcp_server_config = {
            "name": "google-admin-mcp",
            "description": "Google Workspace Admin Directory API management",
            "version": "1.0.0",
            "capabilities": {
                "tools": True,
                "resources": False,
                "prompts": False
            },
            "tools": [
                {
                    "name": "list_users",
                    "description": "List all users in the Google Workspace domain",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "domain": {
                                "type": "string",
                                "description": "Domain to list users from (optional)"
                            },
                            "maxResults": {
                                "type": "number",
                                "description": "Maximum number of results to return (default: 100)"
                            }
                        }
                    }
                },
                {
                    "name": "get_user",
                    "description": "Get detailed information about a specific user",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "userKey": {
                                "type": "string",
                                "description": "User's email address or unique ID"
                            }
                        },
                        "required": ["userKey"]
                    }
                },
                {
                    "name": "create_user",
                    "description": "Create a new user in Google Workspace",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "primaryEmail": {
                                "type": "string",
                                "description": "Primary email address for the new user"
                            },
                            "givenName": {
                                "type": "string",
                                "description": "User's first name"
                            },
                            "familyName": {
                                "type": "string",
                                "description": "User's last name"
                            },
                            "password": {
                                "type": "string",
                                "description": "Password for the new user (optional, will generate if not provided)"
                            }
                        },
                        "required": ["primaryEmail", "givenName", "familyName"]
                    }
                },
                {
                    "name": "suspend_user",
                    "description": "Suspend a user account",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "userKey": {
                                "type": "string",
                                "description": "User's email address or unique ID"
                            }
                        },
                        "required": ["userKey"]
                    }
                },
                {
                    "name": "unsuspend_user",
                    "description": "Unsuspend a user account",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "userKey": {
                                "type": "string",
                                "description": "User's email address or unique ID"
                            }
                        },
                        "required": ["userKey"]
                    }
                }
            ]
        }
    
    async def setup_google_admin_mcp(self) -> Dict[str, Any]:
        """Setup Google Admin MCP server"""
        logger.info("🔐 Setting up Google Admin MCP...")
        
        try:
            # Check if we have required credentials
            if not self.google_client_id or not self.google_client_secret:
                return {
                    "success": False,
                    "error": "Google OAuth2 credentials not found. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in master.env",
                    "setup_required": True
                }
            
            # Create MCP server configuration
            await self._create_mcp_server_config()
            
            # Test Google Admin API access
            test_result = await self._test_google_admin_api()
            
            return {
                "success": True,
                "message": "Google Admin MCP setup completed",
                "test_result": test_result,
                "config_path": str(self.google_admin_dir / "mcp-server.json")
            }
            
        except Exception as e:
            logger.error(f"Google Admin MCP setup failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _create_mcp_server_config(self):
        """Create MCP server configuration file"""
        logger.info("⚙️ Creating MCP server configuration...")
        
        # Ensure directory exists
        self.google_admin_dir.mkdir(parents=True, exist_ok=True)
        
        # Create package.json
        package_json = {
            "name": "google-admin-mcp",
            "version": "1.0.0",
            "description": "Google Workspace Admin Directory API MCP Server",
            "main": "server.js",
            "type": "module",
            "scripts": {
                "start": "node server.js",
                "dev": "node --watch server.js"
            },
            "dependencies": {
                "@modelcontextprotocol/sdk": "^0.5.0",
                "googleapis": "^128.0.0",
                "dotenv": "^16.3.1"
            },
            "keywords": ["mcp", "google", "admin", "workspace"],
            "author": "TAURUS AI CORP",
            "license": "MIT"
        }
        
        with open(self.google_admin_dir / "package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        
        # Create server.js
        server_js = '''#!/usr/bin/env node
/**
 * Google Admin MCP Server
 * Manages Google Workspace users via Admin Directory API
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

class GoogleAdminMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: "google-admin-mcp",
                version: "1.0.0",
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );
        
        this.setupToolHandlers();
        this.setupGoogleAuth();
    }
    
    setupGoogleAuth() {
        // Google OAuth2 configuration
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        // Set credentials if available
        if (process.env.GOOGLE_ACCESS_TOKEN) {
            this.oauth2Client.setCredentials({
                access_token: process.env.GOOGLE_ACCESS_TOKEN,
                refresh_token: process.env.GOOGLE_REFRESH_TOKEN
            });
        }
        
        this.admin = google.admin({ version: 'directory_v1', auth: this.oauth2Client });
    }
    
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "list_users",
                        description: "List all users in the Google Workspace domain",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: "Domain to list users from (optional)"
                                },
                                maxResults: {
                                    type: "number",
                                    description: "Maximum number of results to return (default: 100)"
                                }
                            }
                        }
                    },
                    {
                        name: "get_user",
                        description: "Get detailed information about a specific user",
                        inputSchema: {
                            type: "object",
                            properties: {
                                userKey: {
                                    type: "string",
                                    description: "User's email address or unique ID"
                                }
                            },
                            required: ["userKey"]
                        }
                    },
                    {
                        name: "create_user",
                        description: "Create a new user in Google Workspace",
                        inputSchema: {
                            type: "object",
                            properties: {
                                primaryEmail: {
                                    type: "string",
                                    description: "Primary email address for the new user"
                                },
                                givenName: {
                                    type: "string",
                                    description: "User's first name"
                                },
                                familyName: {
                                    type: "string",
                                    description: "User's last name"
                                },
                                password: {
                                    type: "string",
                                    description: "Password for the new user (optional, will generate if not provided)"
                                }
                            },
                            required: ["primaryEmail", "givenName", "familyName"]
                        }
                    },
                    {
                        name: "suspend_user",
                        description: "Suspend a user account",
                        inputSchema: {
                            type: "object",
                            properties: {
                                userKey: {
                                    type: "string",
                                    description: "User's email address or unique ID"
                                }
                            },
                            required: ["userKey"]
                        }
                    },
                    {
                        name: "unsuspend_user",
                        description: "Unsuspend a user account",
                        inputSchema: {
                            type: "object",
                            properties: {
                                userKey: {
                                    type: "string",
                                    description: "User's email address or unique ID"
                                }
                            },
                            required: ["userKey"]
                        }
                    }
                ]
            };
        });
        
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            
            try {
                switch (name) {
                    case "list_users":
                        return await this.listUsers(args);
                    case "get_user":
                        return await this.getUser(args);
                    case "create_user":
                        return await this.createUser(args);
                    case "suspend_user":
                        return await this.suspendUser(args);
                    case "unsuspend_user":
                        return await this.unsuspendUser(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error.message}`
                        }
                    ]
                };
            }
        });
    }
    
    async listUsers(args) {
        const { domain, maxResults = 100 } = args;
        
        try {
            const response = await this.admin.users.list({
                domain: domain || process.env.GOOGLE_WORKSPACE_DOMAIN,
                maxResults: maxResults,
                orderBy: 'email'
            });
            
            const users = response.data.users || [];
            
            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${users.length} users:\\n\\n` +
                              users.map(user => 
                                `• ${user.primaryEmail} (${user.name?.fullName || 'No name'}) - ${user.suspended ? 'Suspended' : 'Active'}`
                              ).join('\\n')
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to list users: ${error.message}`);
        }
    }
    
    async getUser(args) {
        const { userKey } = args;
        
        try {
            const response = await this.admin.users.get({
                userKey: userKey
            });
            
            const user = response.data;
            
            return {
                content: [
                    {
                        type: "text",
                        text: `User Details:\\n` +
                              `• Email: ${user.primaryEmail}\\n` +
                              `• Name: ${user.name?.fullName || 'Not set'}\\n` +
                              `• Status: ${user.suspended ? 'Suspended' : 'Active'}\\n` +
                              `• Last Login: ${user.lastLoginTime || 'Never'}\\n` +
                              `• Creation Time: ${user.creationTime || 'Unknown'}`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }
    
    async createUser(args) {
        const { primaryEmail, givenName, familyName, password } = args;
        
        try {
            // Generate secure password if not provided
            const userPassword = password || this.generateSecurePassword();
            
            const userData = {
                primaryEmail: primaryEmail,
                name: {
                    givenName: givenName,
                    familyName: familyName
                },
                password: userPassword,
                changePasswordAtNextLogin: true
            };
            
            const response = await this.admin.users.insert({
                requestBody: userData
            });
            
            return {
                content: [
                    {
                        type: "text",
                        text: `User created successfully!\\n` +
                              `• Email: ${primaryEmail}\\n` +
                              `• Name: ${givenName} ${familyName}\\n` +
                              `• Password: ${userPassword}\\n` +
                              `• Note: User must change password on first login`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
    
    async suspendUser(args) {
        const { userKey } = args;
        
        try {
            await this.admin.users.update({
                userKey: userKey,
                requestBody: {
                    suspended: true
                }
            });
            
            return {
                content: [
                    {
                        type: "text",
                        text: `User ${userKey} has been suspended successfully.`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to suspend user: ${error.message}`);
        }
    }
    
    async unsuspendUser(args) {
        const { userKey } = args;
        
        try {
            await this.admin.users.update({
                userKey: userKey,
                requestBody: {
                    suspended: false
                }
            });
            
            return {
                content: [
                    {
                        type: "text",
                        text: `User ${userKey} has been unsuspended successfully.`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to unsuspend user: ${error.message}`);
        }
    }
    
    generateSecurePassword() {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return password;
    }
    
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Google Admin MCP server running on stdio");
    }
}

const server = new GoogleAdminMCPServer();
server.run().catch(console.error);
'''
        
        with open(self.google_admin_dir / "server.js", "w") as f:
            f.write(server_js)
        
        # Create .env file
        env_content = f"""# Google Admin MCP Configuration
# Generated by TAURUS AI CORP MCP Integration System

# Google OAuth2 Credentials
GOOGLE_CLIENT_ID={self.google_client_id or 'your_google_client_id_here'}
GOOGLE_CLIENT_SECRET={self.google_client_secret or 'your_google_client_secret_here'}
GOOGLE_REDIRECT_URI={self.google_redirect_uri}

# Google Access Tokens (if available)
GOOGLE_ACCESS_TOKEN={self.google_access_token or 'your_google_access_token_here'}
GOOGLE_REFRESH_TOKEN={self.google_refresh_token or 'your_google_refresh_token_here'}

# Google Workspace Domain
GOOGLE_WORKSPACE_DOMAIN={self.google_workspace_domain or 'your_domain.com'}

# MCP Server Configuration
MCP_SERVER_PORT=3001
MCP_SERVER_DEBUG=true

# Security
REQUIRE_PASSWORD_CHANGE=true
PASSWORD_MIN_LENGTH=12
"""
        
        with open(self.google_admin_dir / ".env", "w") as f:
            f.write(env_content)
        
        # Create MCP server configuration
        mcp_config = {
            "mcpServers": {
                "google-admin": {
                    "command": "node",
                    "args": [str(self.google_admin_dir / "server.js")],
                    "env": {
                        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
                        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
                        "GOOGLE_REDIRECT_URI": "${GOOGLE_REDIRECT_URI}",
                        "GOOGLE_ACCESS_TOKEN": "${GOOGLE_ACCESS_TOKEN}",
                        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}",
                        "GOOGLE_WORKSPACE_DOMAIN": "${GOOGLE_WORKSPACE_DOMAIN}"
                    }
                }
            }
        }
        
        with open(self.google_admin_dir / "mcp-server.json", "w") as f:
            json.dump(mcp_config, f, indent=2)
        
        logger.info("✅ MCP server configuration created")
    
    async def _test_google_admin_api(self) -> Dict[str, Any]:
        """Test Google Admin API access"""
        logger.info("🧪 Testing Google Admin API access...")
        
        try:
            if not self.google_access_token:
                return {
                    "status": "⚠️ No access token",
                    "message": "Google OAuth2 access token not configured. Please set up OAuth2 flow.",
                    "setup_required": True
                }
            
            # Test API access
            headers = {
                'Authorization': f'Bearer {self.google_access_token}',
                'Content-Type': 'application/json'
            }
            
            # Test with Admin Directory API
            test_url = f"https://admin.googleapis.com/admin/directory/v1/users?domain={self.google_workspace_domain or 'example.com'}&maxResults=1"
            
            response = requests.get(test_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                return {
                    "status": "✅ Working",
                    "message": "Google Admin API access confirmed",
                    "setup_required": False
                }
            elif response.status_code == 401:
                return {
                    "status": "❌ Authentication failed",
                    "message": "Google OAuth2 token is invalid or expired",
                    "setup_required": True
                }
            else:
                return {
                    "status": "⚠️ API error",
                    "message": f"Google Admin API returned status {response.status_code}",
                    "setup_required": True
                }
                
        except Exception as e:
            return {
                "status": "❌ Error",
                "message": f"Failed to test Google Admin API: {str(e)}",
                "setup_required": True
            }
    
    def create_oauth_setup_guide(self):
        """Create OAuth2 setup guide for Google Admin MCP"""
        guide_content = f"""# 🔐 Google Admin MCP OAuth2 Setup Guide

## Overview
This guide helps you set up OAuth2 authentication for the Google Admin MCP server to manage your Google Workspace users.

## Prerequisites
- Google Workspace Admin account
- Admin Directory API enabled
- Node.js 20.0.0 or higher

## Step 1: Enable Google Admin Directory API

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Google Workspace project
3. Go to "APIs & Services" > "Library"

### 1.2 Enable Admin Directory API
1. Search for "Admin SDK API"
2. Click on "Admin SDK API"
3. Click "Enable"

## Step 2: Create OAuth2 Credentials

### 2.1 Go to Credentials
1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"

### 2.2 Configure OAuth Client
1. Application type: "Web application"
2. Name: "TAURUS AI CORP Google Admin MCP"
3. Authorized redirect URIs: `http://localhost:8080/callback`
4. Click "Create"

### 2.3 Save Credentials
1. Copy the Client ID and Client Secret
2. Add them to your `master.env` file:
```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8080/callback
GOOGLE_WORKSPACE_DOMAIN=your_domain.com
```

## Step 3: Get OAuth2 Access Token

### 3.1 Use OAuth2 Playground
1. Go to [Google OAuth2 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret

### 3.2 Configure Scopes
In "Step 1", add these scopes:
```
https://www.googleapis.com/auth/admin.directory.user
https://www.googleapis.com/auth/admin.directory.user.readonly
https://www.googleapis.com/auth/admin.directory.user.alias
```

### 3.3 Authorize and Get Token
1. Click "Authorize APIs"
2. Sign in with your Google Workspace Admin account
3. Grant all requested permissions
4. In "Step 2", click "Exchange authorization code for tokens"
5. Copy the "Access token" and "Refresh token"

### 3.4 Add Tokens to Environment
Add to your `master.env` file:
```bash
GOOGLE_ACCESS_TOKEN=your_access_token_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

## Step 4: Test the Integration

### 4.1 Install Dependencies
```bash
cd external-mcps/google-admin-mcp
npm install
```

### 4.2 Test MCP Server
```bash
node server.js
```

### 4.3 Test with MCP Client
```python
# Test the Google Admin MCP
python google_admin_mcp_integrator.py
```

## Step 5: Configure Cursor MCP

### 5.1 Add to Cursor MCP Config
Add this to your Cursor MCP configuration:

```json
{{
    "mcpServers": {{
        "google-admin": {{
            "command": "node",
            "args": ["{self.google_admin_dir}/server.js"],
            "env": {{
                "GOOGLE_CLIENT_ID": "${{GOOGLE_CLIENT_ID}}",
                "GOOGLE_CLIENT_SECRET": "${{GOOGLE_CLIENT_SECRET}}",
                "GOOGLE_REDIRECT_URI": "${{GOOGLE_REDIRECT_URI}}",
                "GOOGLE_ACCESS_TOKEN": "${{GOOGLE_ACCESS_TOKEN}}",
                "GOOGLE_REFRESH_TOKEN": "${{GOOGLE_REFRESH_TOKEN}}",
                "GOOGLE_WORKSPACE_DOMAIN": "${{GOOGLE_WORKSPACE_DOMAIN}}"
            }}
        }}
    }}
}}
```

## Available Tools

### 1. List Users
```python
# List all users in your domain
result = await mcp_client.call_tool("list_users", {{
    "domain": "your_domain.com",
    "maxResults": 50
}})
```

### 2. Get User Details
```python
# Get detailed information about a user
result = await mcp_client.call_tool("get_user", {{
    "userKey": "user@your_domain.com"
}})
```

### 3. Create User
```python
# Create a new user
result = await mcp_client.call_tool("create_user", {{
    "primaryEmail": "newuser@your_domain.com",
    "givenName": "John",
    "familyName": "Doe"
}})
```

### 4. Suspend User
```python
# Suspend a user account
result = await mcp_client.call_tool("suspend_user", {{
    "userKey": "user@your_domain.com"
}})
```

### 5. Unsuspend User
```python
# Unsuspend a user account
result = await mcp_client.call_tool("unsuspend_user", {{
    "userKey": "user@your_domain.com"
}})
```

## Security Best Practices

### 1. Token Management
- Store tokens securely in environment variables
- Never commit tokens to version control
- Rotate tokens regularly (every 90 days)

### 2. Access Control
- Use least privilege principle for OAuth scopes
- Monitor token usage and access patterns
- Implement proper error handling

### 3. Password Security
- Generated passwords are 12+ characters
- Include uppercase, lowercase, numbers, and special characters
- Users must change password on first login

## Troubleshooting

### Common Issues

#### 1. "Authentication failed" Error
- **Cause**: Invalid or expired OAuth2 token
- **Solution**: Refresh the access token using OAuth2 Playground
- **Prevention**: Set up automatic token refresh

#### 2. "Insufficient permissions" Error
- **Cause**: Missing required OAuth scopes
- **Solution**: Add missing scopes in OAuth2 Playground
- **Prevention**: Use comprehensive scope list

#### 3. "Domain not found" Error
- **Cause**: Incorrect GOOGLE_WORKSPACE_DOMAIN setting
- **Solution**: Verify domain name in master.env
- **Prevention**: Use exact domain name from Google Workspace

#### 4. "API not enabled" Error
- **Cause**: Admin Directory API not enabled
- **Solution**: Enable Admin Directory API in Google Cloud Console
- **Prevention**: Verify API status before setup

### Debug Mode
Enable debug logging:
```bash
export GOOGLE_ADMIN_MCP_DEBUG=true
```

## Support Resources

### Google Admin SDK
- [Admin SDK Documentation](https://developers.google.com/admin-sdk)
- [Directory API Reference](https://developers.google.com/admin-sdk/directory/reference/rest)
- [OAuth2 Scopes](https://developers.google.com/admin-sdk/directory/v1/guides/authorizing)

### MCP Integration
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Google Admin MCP Repository](https://github.com/securitylortech/google-admin-mcp)

---
Generated by TAURUS AI CORP MCP Integration System
{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
"""
        
        guide_file = self.google_admin_dir / "OAUTH_SETUP_GUIDE.md"
        with open(guide_file, "w") as f:
            f.write(guide_content)
        
        logger.info(f"✅ OAuth setup guide created: {guide_file}")


async def main():
    """Main function"""
    print("🔐 Google Admin MCP Integrator")
    print("=" * 60)
    
    # Initialize integrator
    integrator = GoogleAdminMCPIntegrator()
    
    # Setup Google Admin MCP
    result = await integrator.setup_google_admin_mcp()
    
    # Create OAuth setup guide
    integrator.create_oauth_setup_guide()
    
    # Print results
    print("\n" + "="*60)
    print("🔐 GOOGLE ADMIN MCP INTEGRATION RESULTS")
    print("="*60)
    
    if result["success"]:
        print("✅ Integration completed successfully!")
        print(f"📁 Location: {result['config_path']}")
        print(f"🧪 Test Result: {result['test_result']['status']} - {result['test_result']['message']}")
        
        if result['test_result'].get('setup_required'):
            print("\n⚠️ OAuth2 Setup Required:")
            print("1. Configure Google OAuth2 credentials in master.env")
            print("2. Enable Google Admin Directory API")
            print("3. Get OAuth2 access token via OAuth2 Playground")
            print("4. Test the integration with your Google Workspace")
        else:
            print("\n🎉 Ready to use Google Admin MCP!")
            print("📋 Available tools:")
            print("  • list_users - List all users in domain")
            print("  • get_user - Get user details")
            print("  • create_user - Create new user")
            print("  • suspend_user - Suspend user account")
            print("  • unsuspend_user - Unsuspend user account")
    else:
        print("❌ Integration failed!")
        print(f"Error: {result['error']}")
        print("\n🔧 Troubleshooting:")
        print("1. Check Google OAuth2 credentials in master.env")
        print("2. Verify Google Admin Directory API is enabled")
        print("3. Check file permissions in the project directory")
    
    print(f"\n📖 OAuth Setup Guide: {integrator.google_admin_dir}/OAUTH_SETUP_GUIDE.md")
    print("="*60)


if __name__ == "__main__":
    asyncio.run(main())
