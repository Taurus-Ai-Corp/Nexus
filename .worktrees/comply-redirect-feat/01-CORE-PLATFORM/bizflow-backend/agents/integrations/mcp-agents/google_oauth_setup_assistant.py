#!/usr/bin/env python3
"""
Google OAuth2 Setup Assistant
Automates the OAuth2 setup process for Google Admin MCP
"""

import webbrowser
import time
import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv('master.env')

class GoogleOAuthSetupAssistant:
    """Assists with Google OAuth2 setup for Google Admin MCP"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.master_env_path = self.project_root / "master.env"
        
        # OAuth2 setup URLs
        self.urls = {
            "google_cloud_console": "https://console.cloud.google.com/",
            "apis_library": "https://console.cloud.google.com/apis/library",
            "credentials": "https://console.cloud.google.com/apis/credentials",
            "oauth_playground": "https://developers.google.com/oauthplayground/",
            "admin_sdk_api": "https://console.cloud.google.com/apis/library/admin.googleapis.com"
        }
        
        # Required OAuth2 scopes
        self.required_scopes = [
            "https://www.googleapis.com/auth/admin.directory.user",
            "https://www.googleapis.com/auth/admin.directory.user.readonly",
            "https://www.googleapis.com/auth/admin.directory.user.alias"
        ]
    
    def start_oauth_setup(self):
        """Start the OAuth2 setup process"""
        print("🔐 GOOGLE OAUTH2 SETUP ASSISTANT")
        print("=" * 60)
        print("I'll guide you through the complete OAuth2 setup process.")
        print("This will enable Google Admin MCP to manage your Google Workspace users.")
        print()
        
        # Step 1: Google Cloud Console
        self.step_1_google_cloud_console()
        
        # Step 2: Enable Admin Directory API
        self.step_2_enable_admin_api()
        
        # Step 3: Create OAuth2 Credentials
        self.step_3_create_credentials()
        
        # Step 4: Get Access Token
        self.step_4_get_access_token()
        
        # Step 5: Update Environment
        self.step_5_update_environment()
        
        # Step 6: Test Integration
        self.step_6_test_integration()
    
    def step_1_google_cloud_console(self):
        """Step 1: Open Google Cloud Console"""
        print("📋 STEP 1: GOOGLE CLOUD CONSOLE")
        print("-" * 40)
        print("Opening Google Cloud Console...")
        
        webbrowser.open(self.urls["google_cloud_console"])
        
        print("✅ Google Cloud Console opened in your browser")
        print("📝 Instructions:")
        print("1. Sign in with your Google Workspace Admin account")
        print("2. Select your Google Workspace project")
        print("3. If you don't have a project, create one")
        print()
        
        input("Press Enter when you're signed in and have selected your project...")
        print()
    
    def step_2_enable_admin_api(self):
        """Step 2: Enable Admin Directory API"""
        print("📋 STEP 2: ENABLE ADMIN DIRECTORY API")
        print("-" * 40)
        print("Opening APIs & Services Library...")
        
        webbrowser.open(self.urls["apis_library"])
        
        print("✅ APIs & Services Library opened")
        print("📝 Instructions:")
        print("1. Search for 'Admin SDK API' in the search box")
        print("2. Click on 'Admin SDK API' from the results")
        print("3. Click the 'ENABLE' button")
        print("4. Wait for the API to be enabled (may take a few minutes)")
        print()
        
        input("Press Enter when the Admin SDK API is enabled...")
        print()
    
    def step_3_create_credentials(self):
        """Step 3: Create OAuth2 Credentials"""
        print("📋 STEP 3: CREATE OAUTH2 CREDENTIALS")
        print("-" * 40)
        print("Opening Credentials page...")
        
        webbrowser.open(self.urls["credentials"])
        
        print("✅ Credentials page opened")
        print("📝 Instructions:")
        print("1. Click 'CREATE CREDENTIALS' > 'OAuth client ID'")
        print("2. If prompted, configure the OAuth consent screen first")
        print("3. Application type: 'Web application'")
        print("4. Name: 'TAURUS AI CORP Google Admin MCP'")
        print("5. Authorized redirect URIs: http://localhost:8080/callback")
        print("6. Click 'CREATE'")
        print("7. Copy the Client ID and Client Secret")
        print()
        
        # Get credentials from user
        client_id = input("Enter your Client ID: ").strip()
        client_secret = input("Enter your Client Secret: ").strip()
        
        # Store credentials temporarily
        self.temp_credentials = {
            "client_id": client_id,
            "client_secret": client_secret
        }
        
        print("✅ Credentials captured")
        print()
    
    def step_4_get_access_token(self):
        """Step 4: Get Access Token from OAuth2 Playground"""
        print("📋 STEP 4: GET ACCESS TOKEN")
        print("-" * 40)
        print("Opening OAuth2 Playground...")
        
        webbrowser.open(self.urls["oauth_playground"])
        
        print("✅ OAuth2 Playground opened")
        print("📝 Instructions:")
        print("1. Click the gear icon (⚙️) in the top right")
        print("2. Check 'Use your own OAuth credentials'")
        print(f"3. Enter Client ID: {self.temp_credentials['client_id']}")
        print(f"4. Enter Client Secret: {self.temp_credentials['client_secret']}")
        print("5. Click 'Close'")
        print()
        print("6. In 'Step 1', add these scopes:")
        for scope in self.required_scopes:
            print(f"   • {scope}")
        print("7. Click 'Authorize APIs'")
        print("8. Sign in with your Google Workspace Admin account")
        print("9. Grant all requested permissions")
        print("10. In 'Step 2', click 'Exchange authorization code for tokens'")
        print("11. Copy the Access token and Refresh token")
        print()
        
        # Get tokens from user
        access_token = input("Enter your Access Token: ").strip()
        refresh_token = input("Enter your Refresh Token: ").strip()
        
        # Store tokens temporarily
        self.temp_credentials.update({
            "access_token": access_token,
            "refresh_token": refresh_token
        })
        
        print("✅ Tokens captured")
        print()
    
    def step_5_update_environment(self):
        """Step 5: Update master.env with OAuth2 credentials"""
        print("📋 STEP 5: UPDATE ENVIRONMENT")
        print("-" * 40)
        
        if not self.master_env_path.exists():
            print("❌ master.env file not found!")
            return
        
        # Read current content
        with open(self.master_env_path, 'r') as f:
            content = f.read()
        
        # Update Google OAuth2 credentials
        updates = {
            "GOOGLE_CLIENT_ID": self.temp_credentials['client_id'],
            "GOOGLE_CLIENT_SECRET": self.temp_credentials['client_secret'],
            "GOOGLE_ACCESS_TOKEN": self.temp_credentials['access_token'],
            "GOOGLE_REFRESH_TOKEN": self.temp_credentials['refresh_token']
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
        
        print("✅ master.env updated with OAuth2 credentials")
        print()
    
    def step_6_test_integration(self):
        """Step 6: Test the integration"""
        print("📋 STEP 6: TEST INTEGRATION")
        print("-" * 40)
        
        print("Testing Google Admin MCP integration...")
        
        # Test the integrator
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
                print("🎉 OAuth2 setup completed successfully!")
            else:
                print("⚠️ Integration test had issues:")
                print(result.stderr)
        except Exception as e:
            print(f"❌ Integration test failed: {e}")
        
        print()
        print("🎯 NEXT STEPS:")
        print("1. Test the MCP tools with your Google Workspace")
        print("2. Add Google Admin MCP to your Cursor MCP configuration")
        print("3. Start using Google Workspace user management!")
        print()
    
    def create_quick_setup_script(self):
        """Create a quick setup script for future use"""
        script_content = '''#!/usr/bin/env python3
"""
Quick Google OAuth2 Setup Script
Run this to quickly set up OAuth2 for Google Admin MCP
"""

import webbrowser
import time

def quick_setup():
    print("🚀 QUICK GOOGLE OAUTH2 SETUP")
    print("=" * 40)
    
    # Step 1: Google Cloud Console
    print("1. Opening Google Cloud Console...")
    webbrowser.open("https://console.cloud.google.com/")
    input("Press Enter when you're signed in...")
    
    # Step 2: Enable Admin Directory API
    print("2. Opening Admin SDK API...")
    webbrowser.open("https://console.cloud.google.com/apis/library/admin.googleapis.com")
    input("Press Enter when Admin SDK API is enabled...")
    
    # Step 3: Create OAuth2 Credentials
    print("3. Opening Credentials page...")
    webbrowser.open("https://console.cloud.google.com/apis/credentials")
    input("Press Enter when OAuth2 credentials are created...")
    
    # Step 4: Get Access Token
    print("4. Opening OAuth2 Playground...")
    webbrowser.open("https://developers.google.com/oauthplayground/")
    input("Press Enter when you have your access token...")
    
    print("✅ Quick setup completed!")
    print("Now run: python google_admin_mcp_integrator.py")

if __name__ == "__main__":
    quick_setup()
'''
        
        script_path = self.project_root / "quick_google_oauth_setup.py"
        with open(script_path, 'w') as f:
            f.write(script_content)
        
        print(f"✅ Quick setup script created: {script_path}")


def main():
    """Main function"""
    assistant = GoogleOAuthSetupAssistant()
    
    print("🔐 GOOGLE OAUTH2 SETUP ASSISTANT")
    print("=" * 60)
    print("This assistant will guide you through the complete OAuth2 setup")
    print("for Google Admin MCP integration.")
    print()
    
    choice = input("Choose setup method:\n1. Full guided setup (recommended)\n2. Quick setup\nEnter choice (1 or 2): ").strip()
    
    if choice == "1":
        assistant.start_oauth_setup()
    elif choice == "2":
        assistant.create_quick_setup_script()
        print("✅ Quick setup script created. Run it with: python quick_google_oauth_setup.py")
    else:
        print("Invalid choice. Starting full guided setup...")
        assistant.start_oauth_setup()
    
    print("\n🎉 Google OAuth2 setup process completed!")
    print("Your Google Admin MCP is now ready for use!")


if __name__ == "__main__":
    main()
