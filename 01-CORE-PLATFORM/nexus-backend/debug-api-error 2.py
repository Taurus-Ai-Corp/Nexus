#!/usr/bin/env python3
"""
Debug API Error - Find the source of the 500 error
"""

import requests
import json

def test_api_endpoints():
    """Test various API endpoints to identify the error source"""
    
    endpoints = [
        ("N8N Basic", "http://localhost:5678/"),
        ("N8N Health", "http://localhost:5678/healthz"),
        ("Master Orchestrator", "http://localhost:9000/"),
        ("Master Orchestrator Health", "http://localhost:9000/api/health"),
        ("Master Orchestrator Workflows", "http://localhost:9000/api/workflows"),
    ]
    
    print("🔍 API Error Debugging")
    print("=" * 40)
    
    for name, url in endpoints:
        try:
            print(f"\n📡 Testing {name}:")
            print(f"   URL: {url}")
            
            response = requests.get(url, timeout=10)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ SUCCESS")
                # Print first 200 chars of response
                try:
                    content = response.json()
                    print(f"   Response: {str(content)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"   ❌ ERROR: {response.status_code}")
                print(f"   Error: {response.text[:500]}")
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ CONNECTION ERROR: Service not accessible")
        except requests.exceptions.Timeout:
            print(f"   ❌ TIMEOUT ERROR: Service not responding")
        except Exception as e:
            print(f"   ❌ UNKNOWN ERROR: {str(e)}")
    
    # Test specific API calls that might cause 500 errors
    print(f"\n🧪 Testing Specific Operations:")
    
    # Test Master Orchestrator LinkedIn endpoint
    try:
        print(f"\n📝 Testing LinkedIn Content Creation:")
        response = requests.post(
            "http://localhost:9000/api/linkedin-viral-content",
            json={"message": "Test content"},
            timeout=30
        )
        print(f"   Status: {response.status_code}")
        if response.status_code != 200:
            print(f"   Error: {response.text}")
        else:
            print(f"   ✅ SUCCESS: LinkedIn endpoint working")
            
    except Exception as e:
        print(f"   ❌ LinkedIn test error: {str(e)}")
    
    # Test webhook endpoints
    webhook_endpoints = [
        "http://localhost:5678/webhook/taurus-linkedin-production",
        "http://localhost:5678/webhook/linkedin-automation"
    ]
    
    for webhook_url in webhook_endpoints:
        try:
            print(f"\n🔗 Testing Webhook: {webhook_url}")
            response = requests.post(
                webhook_url,
                json={"message": "Test webhook"},
                timeout=30
            )
            print(f"   Status: {response.status_code}")
            if response.status_code != 200:
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   ❌ Webhook test error: {str(e)}")

def test_anthropic_api():
    """Test Anthropic API directly"""
    print(f"\n🤖 Testing Anthropic API directly:")
    
    try:
        import anthropic
        
        client = anthropic.Anthropic(
            api_key="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"
        )
        
        message = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=100,
            messages=[
                {"role": "user", "content": "Test message"}
            ]
        )
        
        print(f"   ✅ Anthropic API working: {message.content[0].text[:100]}...")
        
    except Exception as e:
        print(f"   ❌ Anthropic API error: {str(e)}")

def test_openrouter_api():
    """Test OpenRouter API directly"""
    print(f"\n🌐 Testing OpenRouter API directly:")
    
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            json={
                "model": "anthropic/claude-3-sonnet",
                "messages": [
                    {"role": "user", "content": "Test message"}
                ],
                "max_tokens": 100
            },
            timeout=30
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ OpenRouter API working: {result['choices'][0]['message']['content'][:100]}...")
        else:
            print(f"   ❌ OpenRouter API error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ OpenRouter API error: {str(e)}")

if __name__ == "__main__":
    test_api_endpoints()
    test_anthropic_api()
    test_openrouter_api()
    
    print(f"\n📊 Debug Summary:")
    print("- Check which endpoints return 500 errors")
    print("- Verify API keys are working")  
    print("- Look for connection or authentication issues")
    print("- Check N8N workflow configuration")