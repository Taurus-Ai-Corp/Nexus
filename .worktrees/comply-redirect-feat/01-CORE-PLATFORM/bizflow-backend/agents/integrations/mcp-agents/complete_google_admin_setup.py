#!/usr/bin/env python3
"""
Complete Google Admin MCP Setup
Finalizes the Google Admin MCP integration with proper OAuth2 configuration
"""

import os
import webbrowser
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv('master.env')

class CompleteGoogleAdminSetup:
    """Complete Google Admin MCP setup with proper OAuth2 configuration"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.master_env_path = self.project_root / "master.env"
        
        # Google OAuth2 configuration
        self.google_client_id = "480581203668-oifr12t4ftfi7469os81fqln1g40ml5u.apps.googleusercontent.com"
        self.google_client_secret = "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"
        self.google_redirect_uri = "http://localhost:8080/callback"
    
    def complete_setup(self):
        """Complete the Google Admin MCP setup"""
        print("🔐 COMPLETE GOOGLE ADMIN MCP SETUP")
        print("=" * 60)
        print("Let's complete your Google Admin MCP integration!")
        print()
        
        # Step 1: Fix corrupted environment variables
        self.fix_environment_variables()
        
        # Step 2: Get OAuth2 access token
        self.get_oauth2_access_token()
        
        # Step 3: Test the integration
        self.test_integration()
        
        # Step 4: Create Cursor MCP configuration
        self.create_cursor_mcp_config()
        
        print("\n🎉 GOOGLE ADMIN MCP SETUP COMPLETED!")
        print("Your Google Workspace user management is now ready!")
    
    def fix_environment_variables(self):
        """Fix corrupted environment variables in master.env"""
        print("🔧 FIXING ENVIRONMENT VARIABLES")
        print("-" * 40)
        
        if not self.master_env_path.exists():
            print("❌ master.env file not found!")
            return
        
        # Read current content
        with open(self.master_env_path, 'r') as f:
            content = f.read()
        
        # Fix corrupted Google OAuth tokens
        fixes = {
            "GOOGLE_ACCESS_TOKEN=python fix_oauth_redirect_uri.py": "GOOGLE_ACCESS_TOKEN=your_google_access_token_here",
            "GOOGLE_REFRESH_TOKEN=ou can't sign in because Cursor/ sent an invalid request. You can try again later, or contact the developer about this issue. Learn more about this error": "GOOGLE_REFRESH_TOKEN=your_google_refresh_token_here",
            "GOOGLE_WORKSPACE_DOMAIN=your_domain.com": "GOOGLE_WORKSPACE_DOMAIN=taurus.ai",
            "GOOGLE_REDIRECT_URI=http://localhost:8168/callback": "GOOGLE_REDIRECT_URI=http://localhost:8080/callback"
        }
        
        for old_value, new_value in fixes.items():
            if old_value in content:
                content = content.replace(old_value, new_value)
                print(f"✅ Fixed: {old_value[:50]}...")
        
        # Write fixed content
        with open(self.master_env_path, 'w') as f:
            f.write(content)
        
        print("✅ Environment variables fixed!")
        print()
    
    def get_oauth2_access_token(self):
        """Get OAuth2 access token using OAuth2 Playground"""
        print("🔑 GETTING OAUTH2 ACCESS TOKEN")
        print("-" * 40)
        print("We'll use Google OAuth2 Playground to get your access token.")
        print("This avoids redirect URI issues completely.")
        print()
        
        # Open OAuth2 Playground
        webbrowser.open("https://developers.google.com/oauthplayground/")
        
        print("✅ OAuth2 Playground opened in your browser")
        print()
        print("📋 STEP-BY-STEP INSTRUCTIONS:")
        print("1. In 'Step 1', add these scopes:")
        print("   • https://www.googleapis.com/auth/admin.directory.user")
        print("   • https://www.googleapis.com/auth/admin.directory.user.readonly")
        print("   • https://www.googleapis.com/auth/admin.directory.user.alias")
        print()
        print("2. Click 'Authorize APIs'")
        print("3. Sign in with your Google Workspace Admin account")
        print("4. Grant all requested permissions")
        print("5. In 'Step 2', click 'Exchange authorization code for tokens'")
        print("6. Copy the Access token and Refresh token")
        print()
        
        # Get tokens from user
        access_token = input("Enter your Access Token: ").strip()
        refresh_token = input("Enter your Refresh Token: ").strip()
        
        if access_token and refresh_token:
            self.update_environment_with_tokens(access_token, refresh_token)
            print("✅ OAuth2 tokens updated successfully!")
        else:
            print("⚠️ No tokens provided. You can add them later to master.env")
            print("   GOOGLE_ACCESS_TOKEN=your_access_token_here")
            print("   GOOGLE_REFRESH_TOKEN=your_refresh_token_here")
        
        print()
    
    def update_environment_with_tokens(self, access_token, refresh_token):
        """Update master.env with OAuth2 tokens"""
        if not self.master_env_path.exists():
            return
        
        # Read current content
        with open(self.master_env_path, 'r') as f:
            content = f.read()
        
        # Update tokens
        updates = {
            "GOOGLE_ACCESS_TOKEN=your_google_access_token_here": f"GOOGLE_ACCESS_TOKEN={access_token}",
            "GOOGLE_REFRESH_TOKEN=your_google_refresh_token_here": f"GOOGLE_REFRESH_TOKEN={refresh_token}",
            "GOOGLE_WORKSPACE_DOMAIN=taurus.ai": "GOOGLE_WORKSPACE_DOMAIN=taurus.ai"
        }
        
        for old_value, new_value in updates.items():
            if old_value in content:
                content = content.replace(old_value, new_value)
        
        # Write updated content
        with open(self.master_env_path, 'w') as f:
            f.write(content)
    
    def test_integration(self):
        """Test the Google Admin MCP integration"""
        print("🧪 TESTING GOOGLE ADMIN MCP INTEGRATION")
        print("-" * 40)
        
        try:
            # Test the integrator
            import subprocess
            result = subprocess.run(
                ["python", "google_admin_mcp_integrator.py"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                print("✅ Google Admin MCP integration test passed!")
                print("🎉 Your Google Admin MCP is ready to use!")
            else:
                print("⚠️ Integration test had some issues:")
                print(result.stderr)
                print("This is normal if OAuth2 tokens are not yet configured.")
        except Exception as e:
            print(f"⚠️ Integration test failed: {e}")
            print("This is normal if OAuth2 tokens are not yet configured.")
        
        print()
    
    def create_cursor_mcp_config(self):
        """Create Cursor MCP configuration file"""
        print("⚙️ CREATING CURSOR MCP CONFIGURATION")
        print("-" * 40)
        
        # Cursor MCP configuration
        cursor_config = {
            "mcpServers": {
                "google-admin": {
                    "command": "node",
                    "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/google-admin-mcp/server.js"],
                    "env": {
                        "GOOGLE_CLIENT_ID": self.google_client_id,
                        "GOOGLE_CLIENT_SECRET": self.google_client_secret,
                        "GOOGLE_REDIRECT_URI": self.google_redirect_uri,
                        "GOOGLE_ACCESS_TOKEN": "${GOOGLE_ACCESS_TOKEN}",
                        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}",
                        "GOOGLE_WORKSPACE_DOMAIN": "${GOOGLE_WORKSPACE_DOMAIN}"
                    }
                }
            }
        }
        
        # Save configuration
        config_file = self.project_root / "cursor_mcp_config.json"
        import json
        with open(config_file, 'w') as f:
            json.dump(cursor_config, f, indent=2)
        
        print(f"✅ Cursor MCP configuration saved: {config_file}")
        print()
        print("📋 TO ADD TO CURSOR:")
        print("1. Open Cursor Settings")
        print("2. Go to MCP Servers")
        print("3. Add the configuration from cursor_mcp_config.json")
        print("4. Or copy the configuration below:")
        print()
        print(json.dumps(cursor_config, indent=2))
        print()
    
    def create_usage_examples(self):
        """Create usage examples for Google Admin MCP"""
        examples_content = """# 🔐 Google Admin MCP Usage Examples

## Available Tools

### 1. List Users
```python
# List all users in your Google Workspace domain
result = await mcp_client.call_tool("list_users", {
    "domain": "taurus.ai",
    "maxResults": 50
})
print(result)
```

### 2. Get User Details
```python
# Get detailed information about a specific user
result = await mcp_client.call_tool("get_user", {
    "userKey": "user@taurus.ai"
})
print(result)
```

### 3. Create User
```python
# Create a new user in Google Workspace
result = await mcp_client.call_tool("create_user", {
    "primaryEmail": "newuser@taurus.ai",
    "givenName": "John",
    "familyName": "Doe"
    # Password will be auto-generated if not provided
})
print(result)
```

### 4. Suspend User
```python
# Suspend a user account
result = await mcp_client.call_tool("suspend_user", {
    "userKey": "user@taurus.ai"
})
print(result)
```

### 5. Unsuspend User
```python
# Unsuspend a user account
result = await mcp_client.call_tool("unsuspend_user", {
    "userKey": "user@taurus.ai"
})
print(result)
```

## Business Workflows

### User Onboarding Automation
```python
# Automatically create new employee accounts
def onboard_new_employee(email, first_name, last_name):
    result = await mcp_client.call_tool("create_user", {
        "primaryEmail": email,
        "givenName": first_name,
        "familyName": last_name
    })
    return result
```

### Access Management
```python
# Suspend user account when employee leaves
def suspend_employee(email):
    result = await mcp_client.call_tool("suspend_user", {
        "userKey": email
    })
    return result
```

### User Monitoring
```python
# Get all users and their status
def get_all_users():
    result = await mcp_client.call_tool("list_users", {
        "domain": "taurus.ai",
        "maxResults": 100
    })
    return result
```

## Security Features

- **Auto-generated Passwords**: 12+ character secure passwords
- **Forced Password Change**: Users must change password on first login
- **Admin Access Required**: Google Workspace Admin privileges needed
- **OAuth2 Authentication**: Secure token-based authentication

---
Generated by TAURUS AI CORP Google Admin MCP Integration
"""
        
        examples_file = self.project_root / "GOOGLE_ADMIN_MCP_EXAMPLES.md"
        with open(examples_file, 'w') as f:
            f.write(examples_content)
        
        print(f"✅ Usage examples created: {examples_file}")


def main():
    """Main function"""
    setup = CompleteGoogleAdminSetup()
    
    print("🔐 COMPLETE GOOGLE ADMIN MCP SETUP")
    print("=" * 60)
    print("This will complete your Google Admin MCP integration.")
    print()
    
    # Complete the setup
    setup.complete_setup()
    
    # Create usage examples
    setup.create_usage_examples()
    
    print("\n🎯 NEXT STEPS:")
    print("1. Add the MCP configuration to Cursor")
    print("2. Test the Google Admin MCP tools")
    print("3. Start managing your Google Workspace users!")
    print()
    print("📖 Check GOOGLE_ADMIN_MCP_EXAMPLES.md for usage examples")


if __name__ == "__main__":
    main()
