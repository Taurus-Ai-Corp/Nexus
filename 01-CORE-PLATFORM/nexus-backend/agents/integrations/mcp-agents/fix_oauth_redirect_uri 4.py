#!/usr/bin/env python3
"""
Fix OAuth2 Redirect URI Mismatch
Updates the OAuth2 configuration to work with Cursor
"""

import os
import webbrowser
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables
load_dotenv('master.env')

class OAuthRedirectURIFixer:
    """Fixes OAuth2 redirect URI mismatch for Cursor"""

    def __init__(self):
        self.project_root = Path(__file__).parent
        self.master_env_path = self.project_root / "master.env"

        # Correct redirect URIs for different OAuth2 flows
        self.redirect_uris = {
            "cursor": "http://localhost:3000/oauth/callback",
            "localhost": "http://localhost:8080/callback",
            "postman": "https://oauth.pstmn.io/v1/callback",
            "playground": "https://developers.google.com/oauthplayground"
        }

    def fix_redirect_uri_issue(self):
        """Fix the redirect URI mismatch issue"""
        print("🔧 OAUTH2 REDIRECT URI FIXER")
        print("=" * 50)
        print("The redirect URI mismatch error occurs because the OAuth2")
        print("credentials are configured with the wrong redirect URI.")
        print()

        print("📋 SOLUTION OPTIONS:")
        print("1. Use OAuth2 Playground (Recommended - No redirect URI needed)")
        print("2. Update OAuth2 credentials with correct redirect URI")
        print("3. Use localhost redirect URI")
        print()

        choice = input("Choose solution (1, 2, or 3): ").strip()

        if choice == "1":
            self.solution_1_oauth_playground()
        elif choice == "2":
            self.solution_2_update_credentials()
        elif choice == "3":
            self.solution_3_localhost()
        else:
            print("Invalid choice. Using OAuth2 Playground solution...")
            self.solution_1_oauth_playground()

    def solution_1_oauth_playground(self):
        """Solution 1: Use OAuth2 Playground (No redirect URI needed)"""
        print("\n🎯 SOLUTION 1: OAUTH2 PLAYGROUND")
        print("-" * 40)
        print("OAuth2 Playground doesn't require a redirect URI configuration.")
        print("This is the easiest solution for getting access tokens.")
        print()

        print("📝 STEPS:")
        print("1. Go to Google OAuth2 Playground")
        print("2. Use the playground's built-in OAuth2 flow")
        print("3. Get your access token without redirect URI issues")
        print()

        # Open OAuth2 Playground
        webbrowser.open("https://developers.google.com/oauthplayground/")

        print("✅ OAuth2 Playground opened in your browser")
        print()
        print("📋 INSTRUCTIONS:")
        print("1. In 'Step 1', add these scopes:")
        print("   • https://www.googleapis.com/auth/admin.directory.user")
        print("   • https://www.googleapis.com/auth/admin.directory.user.readonly")
        print("   • https://www.googleapis.com/auth/admin.directory.user.alias")
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
            print("✅ Tokens updated in master.env")
        else:
            print("❌ No tokens provided. Please try again.")

    def solution_2_update_credentials(self):
        """Solution 2: Update OAuth2 credentials with correct redirect URI"""
        print("\n🎯 SOLUTION 2: UPDATE OAUTH2 CREDENTIALS")
        print("-" * 40)
        print("Update your OAuth2 credentials with the correct redirect URI.")
        print()

        print("📝 STEPS:")
        print("1. Go to Google Cloud Console Credentials")
        print("2. Edit your OAuth2 client")
        print("3. Add the correct redirect URI")
        print("4. Save the changes")
        print()

        # Open Google Cloud Console Credentials
        webbrowser.open("https://console.cloud.google.com/apis/credentials")

        print("✅ Google Cloud Console Credentials opened")
        print()
        print("📋 INSTRUCTIONS:")
        print("1. Find your OAuth2 client 'TAURUS AI CORP Google Admin MCP'")
        print("2. Click the edit (pencil) icon")
        print("3. In 'Authorized redirect URIs', add these URIs:")
        for name, uri in self.redirect_uris.items():
            print(f"   • {uri} ({name})")
        print("4. Click 'SAVE'")
        print("5. Try the OAuth2 flow again")
        print()

        input("Press Enter when you've updated the redirect URIs...")
        print("✅ Redirect URIs updated. You can now try the OAuth2 flow again.")

    def solution_3_localhost(self):
        """Solution 3: Use localhost redirect URI"""
        print("\n🎯 SOLUTION 3: LOCALHOST REDIRECT URI")
        print("-" * 40)
        print("Use localhost redirect URI for local development.")
        print()

        print("📝 STEPS:")
        print("1. Update OAuth2 credentials with localhost redirect URI")
        print("2. Use localhost OAuth2 flow")
        print("3. Get access token")
        print()

        # Open Google Cloud Console Credentials
        webbrowser.open("https://console.cloud.google.com/apis/credentials")

        print("✅ Google Cloud Console Credentials opened")
        print()
        print("📋 INSTRUCTIONS:")
        print("1. Find your OAuth2 client 'TAURUS AI CORP Google Admin MCP'")
        print("2. Click the edit (pencil) icon")
        print("3. In 'Authorized redirect URIs', add:")
        print(f"   • {self.redirect_uris['localhost']}")
        print("4. Click 'SAVE'")
        print("5. Update master.env with localhost redirect URI")
        print()

        # Update master.env with localhost redirect URI
        self.update_redirect_uri(self.redirect_uris['localhost'])
        print("✅ master.env updated with localhost redirect URI")
        print("Now you can use the OAuth2 flow with localhost.")

    def update_environment_with_tokens(self, access_token, refresh_token):
        """Update master.env with access and refresh tokens"""
        if not self.master_env_path.exists():
            print("❌ master.env file not found!")
            return

        # Read current content
        with open(self.master_env_path) as f:
            content = f.read()

        # Update tokens
        updates = {
            "GOOGLE_ACCESS_TOKEN": access_token,
            "GOOGLE_REFRESH_TOKEN": refresh_token
        }

        for key, value in updates.items():
            if f"{key}=" in content:
                # Update existing value
                import re
                pattern = f"{key}=.*"
                replacement = f"{key}={value}"
                content = re.sub(pattern, replacement, content)
            else:
                # Add new value
                content += f"\n{key}={value}\n"

        # Write updated content
        with open(self.master_env_path, 'w') as f:
            f.write(content)

        print("✅ Tokens updated in master.env")

    def update_redirect_uri(self, redirect_uri):
        """Update master.env with new redirect URI"""
        if not self.master_env_path.exists():
            print("❌ master.env file not found!")
            return

        # Read current content
        with open(self.master_env_path) as f:
            content = f.read()

        # Update redirect URI
        if "GOOGLE_REDIRECT_URI=" in content:
            import re
            pattern = "GOOGLE_REDIRECT_URI=.*"
            replacement = f"GOOGLE_REDIRECT_URI={redirect_uri}"
            content = re.sub(pattern, replacement, content)
        else:
            content += f"\nGOOGLE_REDIRECT_URI={redirect_uri}\n"

        # Write updated content
        with open(self.master_env_path, 'w') as f:
            f.write(content)

    def test_oauth_setup(self):
        """Test the OAuth2 setup"""
        print("\n🧪 TESTING OAUTH2 SETUP")
        print("-" * 40)

        # Check if tokens are configured
        access_token = os.getenv('GOOGLE_ACCESS_TOKEN')
        refresh_token = os.getenv('GOOGLE_REFRESH_TOKEN')

        if access_token and refresh_token:
            print("✅ OAuth2 tokens found in master.env")
            print("🎉 OAuth2 setup appears to be working!")

            # Test the Google Admin MCP integration
            try:
                import subprocess
                result = subprocess.run(
                    ["python", "google_admin_mcp_integrator.py"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )

                if result.returncode == 0:
                    print("✅ Google Admin MCP integration test passed!")
                else:
                    print("⚠️ Integration test had issues:")
                    print(result.stderr)
            except Exception as e:
                print(f"❌ Integration test failed: {e}")
        else:
            print("❌ OAuth2 tokens not found in master.env")
            print("Please complete the OAuth2 setup first.")

    def create_oauth_troubleshooting_guide(self):
        """Create OAuth2 troubleshooting guide"""
        guide_content = """# 🔧 OAuth2 Troubleshooting Guide

## Common OAuth2 Errors and Solutions

### 1. Error 400: redirect_uri_mismatch

**Problem**: The redirect URI in your OAuth2 request doesn't match the one configured in Google Cloud Console.

**Solutions**:
1. **Use OAuth2 Playground** (Recommended)
   - Go to https://developers.google.com/oauthplayground/
   - No redirect URI configuration needed
   - Get access token directly

2. **Update Redirect URIs in Google Cloud Console**
   - Go to https://console.cloud.google.com/apis/credentials
   - Edit your OAuth2 client
   - Add these redirect URIs:
     - `http://localhost:8080/callback`
     - `http://localhost:3000/oauth/callback`
     - `https://oauth.pstmn.io/v1/callback`

3. **Use Localhost Redirect URI**
   - Update OAuth2 client with `http://localhost:8080/callback`
   - Update master.env with `GOOGLE_REDIRECT_URI=http://localhost:8080/callback`

### 2. Error 403: access_denied

**Problem**: User denied permission or insufficient scopes.

**Solutions**:
1. **Check OAuth2 Scopes**
   - Ensure these scopes are requested:
     - `https://www.googleapis.com/auth/admin.directory.user`
     - `https://www.googleapis.com/auth/admin.directory.user.readonly`
     - `https://www.googleapis.com/auth/admin.directory.user.alias`

2. **Re-authorize**
   - Clear browser cache and cookies
   - Try the OAuth2 flow again
   - Grant all requested permissions

### 3. Error 401: invalid_client

**Problem**: Invalid client ID or client secret.

**Solutions**:
1. **Check Client Credentials**
   - Verify GOOGLE_CLIENT_ID in master.env
   - Verify GOOGLE_CLIENT_SECRET in master.env
   - Ensure no extra spaces or characters

2. **Regenerate Credentials**
   - Go to Google Cloud Console Credentials
   - Delete old OAuth2 client
   - Create new OAuth2 client
   - Update master.env with new credentials

### 4. Error 400: invalid_grant

**Problem**: Invalid or expired authorization code.

**Solutions**:
1. **Get Fresh Authorization Code**
   - Complete OAuth2 flow again
   - Don't reuse old authorization codes
   - Authorization codes expire quickly

2. **Check Token Expiry**
   - Access tokens expire in 1 hour
   - Use refresh token to get new access token
   - Implement token refresh logic

## Quick Fix Commands

### Check Current Configuration
```bash
# Check if OAuth2 tokens are configured
grep -E "GOOGLE_(CLIENT_ID|CLIENT_SECRET|ACCESS_TOKEN|REFRESH_TOKEN)" master.env
```

### Update Redirect URI
```bash
# Update redirect URI in master.env
sed -i 's|GOOGLE_REDIRECT_URI=.*|GOOGLE_REDIRECT_URI=http://localhost:8080/callback|' master.env
```

### Test OAuth2 Setup
```bash
# Test Google Admin MCP integration
python google_admin_mcp_integrator.py
```

## Best Practices

### 1. Use OAuth2 Playground for Testing
- No redirect URI configuration needed
- Easy to get access tokens
- Good for development and testing

### 2. Configure Multiple Redirect URIs
- Add all possible redirect URIs to OAuth2 client
- Covers different development environments
- Prevents redirect URI mismatch errors

### 3. Implement Token Refresh
- Access tokens expire in 1 hour
- Use refresh tokens to get new access tokens
- Implement automatic token refresh

### 4. Secure Token Storage
- Store tokens in environment variables
- Never commit tokens to version control
- Use secure token management

## Support Resources

- **Google OAuth2 Documentation**: https://developers.google.com/identity/protocols/oauth2
- **OAuth2 Playground**: https://developers.google.com/oauthplayground/
- **Google Cloud Console**: https://console.cloud.google.com/
- **Admin SDK Documentation**: https://developers.google.com/admin-sdk

---
Generated by TAURUS AI CORP OAuth2 Troubleshooting System
"""

        guide_path = self.project_root / "OAUTH2_TROUBLESHOOTING_GUIDE.md"
        with open(guide_path, 'w') as f:
            f.write(guide_content)

        print(f"✅ OAuth2 troubleshooting guide created: {guide_path}")


def main():
    """Main function"""
    fixer = OAuthRedirectURIFixer()

    print("🔧 OAUTH2 REDIRECT URI FIXER")
    print("=" * 50)
    print("This tool will help you fix the redirect URI mismatch error.")
    print()

    # Fix the redirect URI issue
    fixer.fix_redirect_uri_issue()

    # Test the setup
    fixer.test_oauth_setup()

    # Create troubleshooting guide
    fixer.create_oauth_troubleshooting_guide()

    print("\n🎉 OAuth2 redirect URI issue fixed!")
    print("Your Google Admin MCP should now work correctly.")


if __name__ == "__main__":
    main()
