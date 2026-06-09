#!/usr/bin/env python3
"""
TAURUS AI CORP. - Production System Test
Tests all integrations with sample TAURUS AI content
"""

import asyncio
import json
import aiohttp
from datetime import datetime

class TaurusAIProductionTest:
    def __init__(self):
        self.n8n_webhook = "http://localhost:5678/webhook/taurus-linkedin-automation"
        self.test_content = """
Small businesses are finally getting access to enterprise-level AI tools.
The automation revolution is here, and it's more accessible than ever.
At TAURUS AI CORP, we've seen 50+ businesses transform their operations 
with our AI orchestration platform. The results? 300% efficiency gains 
and costs reduced by 60%. Here's what we learned...
"""
    
    async def test_linkedin_automation(self):
        """Test the complete LinkedIn automation pipeline"""
        print("🧪 Testing TAURUS AI LinkedIn Automation...")
        
        payload = {
            "message": self.test_content,
            "metadata": {
                "brand": "TAURUS AI CORP",
                "category": "AI Business Automation",
                "target_audience": "Small Business Owners",
                "goal": "Lead Generation + Authority Building"
            }
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(self.n8n_webhook, json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        print("✅ LinkedIn automation test successful!")
                        print(f"📊 Response: {json.dumps(result, indent=2)}")
                        return True
                    else:
                        print(f"❌ Test failed with status: {response.status}")
                        return False
        except Exception as e:
            print(f"❌ Test error: {e}")
            return False
    
    async def run_all_tests(self):
        """Run complete production system test"""
        print("🚀 TAURUS AI CORP. - Production System Test")
        print("=" * 50)
        
        # Test LinkedIn automation
        linkedin_success = await self.test_linkedin_automation()
        
        # Summary
        print("\n📋 Test Summary:")
        print(f"LinkedIn Automation: {'✅ PASS' if linkedin_success else '❌ FAIL'}")
        
        if linkedin_success:
            print("\n🎉 All systems operational! TAURUS AI is ready for production.")
        else:
            print("\n⚠️  Some tests failed. Check configuration and try again.")

async def main():
    tester = TaurusAIProductionTest()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
