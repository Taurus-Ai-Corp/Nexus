#!/usr/bin/env python3
"""
Automated API Key Acquisition Guide
Uses browser automation to guide you through getting API keys
"""

import time
import webbrowser
from pathlib import Path
import subprocess
import sys

def open_browser_and_guide():
    """Open browser and guide through API key acquisition"""
    
    print("🚀 AUTOMATED API KEY ACQUISITION GUIDE")
    print("=" * 60)
    print("I'll open each service in your browser and guide you through the process!")
    print()
    
    # API Key acquisition steps
    services = [
        {
            "name": "Perplexity AI",
            "url": "https://www.perplexity.ai/settings/api",
            "steps": [
                "1. Click 'Continue with Google' or 'Continue with Apple'",
                "2. Sign in with your account",
                "3. Navigate to API settings",
                "4. Click 'Create API Key'",
                "5. Copy the generated key"
            ],
            "key_name": "PERPLEXITY_API_KEY"
        },
        {
            "name": "Firecrawl",
            "url": "https://firecrawl.dev/dashboard",
            "steps": [
                "1. Click 'Sign Up' or 'Log In'",
                "2. Create account or sign in",
                "3. Go to Dashboard",
                "4. Find 'API Keys' section",
                "5. Generate new API key"
            ],
            "key_name": "FIRECRAWL_API_KEY"
        },
        {
            "name": "Anthropic Claude",
            "url": "https://console.anthropic.com/",
            "steps": [
                "1. Click 'Sign Up' or 'Log In'",
                "2. Create account or sign in",
                "3. Go to API Keys section",
                "4. Click 'Create Key'",
                "5. Copy the generated key"
            ],
            "key_name": "ANTHROPIC_API_KEY"
        },
        {
            "name": "OpenAI",
            "url": "https://platform.openai.com/api-keys",
            "steps": [
                "1. Click 'Sign Up' or 'Log In'",
                "2. Create account or sign in",
                "3. Go to API Keys page",
                "4. Click 'Create new secret key'",
                "5. Copy the generated key"
            ],
            "key_name": "OPENAI_API_KEY"
        }
    ]
    
    collected_keys = {}
    
    for i, service in enumerate(services, 1):
        print(f"🔑 STEP {i}/4: {service['name']}")
        print("-" * 40)
        print(f"🌐 Opening: {service['url']}")
        
        # Open in browser
        webbrowser.open(service['url'])
        
        print("📋 Follow these steps:")
        for step in service['steps']:
            print(f"   {step}")
        
        print()
        print("⏳ Take your time to complete the steps above...")
        
        # Wait for user to complete
        while True:
            api_key = input(f"✅ Enter your {service['key_name']} (or 'skip' to continue): ").strip()
            
            if api_key.lower() == 'skip':
                print(f"⏭️  Skipped {service['name']}")
                break
            elif api_key and len(api_key) > 10:  # Basic validation
                collected_keys[service['key_name']] = api_key
                print(f"✅ Saved {service['key_name']}")
                break
            else:
                print("❌ Invalid key. Please try again or type 'skip'")
        
        print()
        time.sleep(1)
    
    # Update the environment file
    if collected_keys:
        update_environment_file(collected_keys)
    
    print("🎉 API Key Collection Complete!")
    print("=" * 60)
    
    if collected_keys:
        print(f"✅ Collected {len(collected_keys)} API keys")
        print("🔧 Environment file updated!")
        print()
        print("🚀 Next steps:")
        print("1. Run: python run_master_orchestrator.py")
        print("2. Test your MCP connections!")
    else:
        print("⚠️  No API keys collected")
        print("You can run this script again anytime!")

def update_environment_file(keys):
    """Update the master.env file with collected keys"""
    env_file = Path(__file__).parent / "master.env"
    
    if not env_file.exists():
        print("❌ Environment file not found!")
        return
    
    # Read current content
    with open(env_file, 'r') as f:
        content = f.read()
    
    # Replace placeholders with real keys
    for key_name, key_value in keys.items():
        placeholder = f"{key_name}=your_{key_name.lower().replace('_', '_')}_here"
        new_line = f"{key_name}={key_value}"
        
        if placeholder in content:
            content = content.replace(placeholder, new_line)
            print(f"✅ Updated {key_name}")
        else:
            # Try alternative placeholder formats
            alt_placeholder = f"{key_name}=your_{key_name.lower()}_here"
            if alt_placeholder in content:
                content = content.replace(alt_placeholder, new_line)
                print(f"✅ Updated {key_name}")
    
    # Write back to file
    with open(env_file, 'w') as f:
        f.write(content)
    
    print("📝 Environment file updated successfully!")

def main():
    print("🤖 Starting Automated API Key Acquisition...")
    print()
    
    try:
        open_browser_and_guide()
    except KeyboardInterrupt:
        print("\n⏹️  Process interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("You can still manually edit the master.env file")

if __name__ == "__main__":
    main()
