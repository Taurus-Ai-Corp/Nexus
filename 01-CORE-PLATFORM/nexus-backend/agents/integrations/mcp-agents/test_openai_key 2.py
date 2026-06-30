#!/usr/bin/env python3
"""
Test OpenAI API Key
Simple test to verify the OpenAI API key works
"""

import os

import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('master.env')

def test_openai_key():
    """Test the OpenAI API key"""
    api_key = os.getenv('OPENAI_API_KEY')

    if not api_key:
        print("❌ OPENAI_API_KEY not found in environment")
        return False

    print(f"🔑 Testing OpenAI API key: {api_key[:20]}...")

    # Test with a simple completion request
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "user", "content": "Hello! This is a test message."}
        ],
        "max_tokens": 10
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)

        if response.status_code == 200:
            result = response.json()
            print("✅ OpenAI API key is working!")
            print(f"Response: {result['choices'][0]['message']['content']}")
            return True
        else:
            print(f"❌ API request failed with status {response.status_code}")
            print(f"Error: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error testing API key: {str(e)}")
        return False

def test_mcp_integration():
    """Test MCP integration with working API key"""
    print("\n🧪 Testing MCP Integration...")

    # Test the API key validation
    if test_openai_key():
        print("\n✅ OpenAI API key is valid!")
        print("🚀 MCP Business Integrator should now work properly")
        print("\nNext steps:")
        print("1. Run: python mcp_business_integrator.py")
        print("2. Test workflows: python mcp_examples.py")
        print("3. Set up OAuth tokens for full functionality")
    else:
        print("\n❌ OpenAI API key is not working")
        print("Please check your API key and try again")

if __name__ == "__main__":
    print("🚀 OpenAI API Key Test")
    print("=" * 30)
    test_mcp_integration()
