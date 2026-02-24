#!/usr/bin/env python3
"""
API Key Addition Script
Quick script to add real API keys to the master.env file
"""

import os
import sys
from pathlib import Path

def add_api_key(key_name, current_value, new_value):
    """Add or update an API key in the master.env file"""
    env_file = Path(__file__).parent / "master.env"
    
    if not env_file.exists():
        print(f"❌ Environment file not found: {env_file}")
        return False
    
    # Read the file
    with open(env_file, 'r') as f:
        content = f.read()
    
    # Replace the placeholder with the real key
    if current_value in content:
        new_content = content.replace(current_value, new_value)
        
        # Write back to file
        with open(env_file, 'w') as f:
            f.write(new_content)
        
        print(f"✅ Updated {key_name}")
        return True
    else:
        print(f"⚠️  Could not find {current_value} in environment file")
        return False

def main():
    print("🔑 API Key Addition Script")
    print("=" * 50)
    
    # Define the critical keys that need to be updated
    critical_keys = {
        'PERPLEXITY_API_KEY': 'your_perplexity_key_here',
        'FIRECRAWL_API_KEY': 'your_firecrawl_key_here', 
        'ANTHROPIC_API_KEY': 'your_anthropic_key_here',
        'OPENAI_API_KEY': 'your_openai_key_here'
    }
    
    print("🚨 CRITICAL API KEYS NEEDED:")
    print("These 4 keys are required for MCP to work properly:")
    print()
    
    for key, placeholder in critical_keys.items():
        print(f"📝 {key}:")
        print(f"   Current: {placeholder}")
        new_key = input(f"   Enter your {key}: ").strip()
        
        if new_key and new_key != placeholder:
            add_api_key(key, placeholder, new_key)
        else:
            print(f"   ⏭️  Skipped {key}")
        print()
    
    print("🎯 Next Steps:")
    print("1. Run: python sub-agents/api_key_discovery_agent.py")
    print("2. Run: python run_master_orchestrator.py")
    print("3. Test your MCP connections!")

if __name__ == "__main__":
    main()
