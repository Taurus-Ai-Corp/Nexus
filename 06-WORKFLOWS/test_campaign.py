#!/usr/bin/env python3
"""
Nexus™ Comprehensive Test Campaign
Demonstrates full agentic ecosystem capabilities for Taurus AI Corp
"""

import asyncio
import json
import logging
from datetime import datetime

from ai_agents.mcp_integration_agent import MCPIntegrationAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_comprehensive_test_campaign():
    """
    Run a full test campaign showcasing Nexus™ capabilities
    """

    print("🚀 Starting Nexus™ Comprehensive Test Campaign")
    print("=" * 60)

    # Initialize MCP Integration Agent
    agent = MCPIntegrationAgent()

    # Display system status
    status = agent.get_system_status()
    print("\n📊 System Status:")
    for tool_name, tool_info in status['tools'].items():
        emoji = "✅" if tool_info['status'] == 'Active' else "⚠️"
        print(f"  {emoji} {tool_name}: {tool_info['status']}")

    # Test Campaign Data - Nexus™ Launch Campaign
    test_campaigns = [
        {
            "id": "nexus-uae-launch-001",
            "campaign_name": "Nexus™ UAE Market Entry - Vibe Marketing Revolution",
            "target_market": "UAE",
            "campaign_type": "market_entry",
            "industry": "digital marketing",
            "budget": 15000,
            "duration_days": 45,
            "objectives": [
                "Establish Nexus™ brand presence in UAE",
                "Generate 500+ qualified leads",
                "Position as premium AI-powered marketing solution",
                "Build local partnerships and networks"
            ],
            "target_audience": {
                "primary": "B2B companies with 50-500 employees",
                "secondary": "SMEs seeking digital transformation",
                "tertiary": "Marketing agencies looking for AI tools"
            }
        },
        {
            "id": "nexus-india-launch-002",
            "campaign_name": "Nexus™ India Expansion - AI Marketing for Every Business",
            "target_market": "India",
            "campaign_type": "market_expansion",
            "industry": "digital marketing",
            "budget": 12000,
            "duration_days": 60,
            "objectives": [
                "Scale Nexus™ presence in Indian market",
                "Target Kerala and Mumbai business hubs",
                "Generate 1000+ leads across B2B/B2C segments",
                "Establish regional partnerships"
            ],
            "target_audience": {
                "primary": "Startups and growing businesses",
                "secondary": "Traditional businesses going digital",
                "tertiary": "Marketing professionals and agencies"
            }
        },
        {
            "id": "nexus-canada-launch-003",
            "campaign_name": "Nexus™ Canada Launch - AI-Powered Growth Marketing",
            "target_market": "Canada",
            "campaign_type": "home_market_launch",
            "industry": "digital marketing",
            "budget": 18000,
            "duration_days": 30,
            "objectives": [
                "Launch Nexus™ in home Canadian market",
                "Establish credibility and case studies",
                "Generate 750+ high-quality leads",
                "Build referral and partnership network"
            ],
            "target_audience": {
                "primary": "Mid-market businesses (100-1000 employees)",
                "secondary": "Tech companies and SaaS businesses",
                "tertiary": "Marketing agencies and consultants"
            }
        }
    ]

    # Run test campaigns for each market
    campaign_results = []

    for campaign_data in test_campaigns:
        print(f"\n🎯 Running Campaign: {campaign_data['campaign_name']}")
        print(f"   Market: {campaign_data['target_market']} | Budget: ${campaign_data['budget']:,}")
        print("-" * 60)

        try:
            # Execute campaign using MCP orchestration
            result = await agent.orchestrate_marketing_campaign(campaign_data)

            if result and not result.get("error"):
                print("   ✅ Campaign executed successfully")
                print(f"   📊 Research completed: {bool(result.get('research'))}")
                print(f"   📝 Content generated: {bool(result.get('content'))}")
                print(f"   💾 Data stored: {result.get('storage', {}).get('campaign_stored', False)}")
                print(f"   📈 Analytics generated: {bool(result.get('analytics'))}")

                # Extract key insights
                if result.get('research') and result['research'].get('research_results'):
                    research_data = result['research']['research_results']
                    successful_queries = len([r for r in research_data.values() if not r.get('error')])
                    print(f"   🔍 Market research: {successful_queries} queries successful")

                campaign_results.append({
                    "campaign": campaign_data,
                    "result": result,
                    "status": "success"
                })
            else:
                error_msg = result.get("error", "Unknown error") if result else "No result returned"
                print(f"   ❌ Campaign failed: {error_msg}")
                campaign_results.append({
                    "campaign": campaign_data,
                    "error": error_msg,
                    "status": "failed"
                })

        except Exception as e:
            print(f"   💥 Campaign exception: {str(e)}")
            campaign_results.append({
                "campaign": campaign_data,
                "error": str(e),
                "status": "error"
            })

        # Rate limiting between campaigns
        print("   ⏳ Waiting 3 seconds before next campaign...")
        await asyncio.sleep(3)

    # Generate comprehensive test report
    print("\n📋 Test Campaign Summary")
    print("=" * 60)

    successful_campaigns = len([r for r in campaign_results if r['status'] == 'success'])
    total_campaigns = len(campaign_results)

    print(f"Total Campaigns: {total_campaigns}")
    print(f"Successful: {successful_campaigns}")
    print(f"Failed: {total_campaigns - successful_campaigns}")
    print(f"Success Rate: {(successful_campaigns/total_campaigns*100):.1f}%")

    # Export detailed test results
    test_report = {
        "test_metadata": {
            "test_name": "Nexus™ Comprehensive Test Campaign",
            "test_date": datetime.now().isoformat(),
            "system_status": status,
            "total_campaigns": total_campaigns,
            "successful_campaigns": successful_campaigns,
            "success_rate": f"{(successful_campaigns/total_campaigns*100):.1f}%"
        },
        "campaign_results": campaign_results,
        "system_capabilities_demonstrated": [
            "Multi-market campaign orchestration",
            "Real-time market research via Perplexity AI",
            "AI-powered competitive analysis via Claude",
            "Content generation and optimization",
            "Cross-platform integration (MCP)",
            "Scalable agent coordination",
            "Comprehensive reporting and analytics"
        ],
        "next_steps": [
            "Deploy additional MCP integrations",
            "Add more specialized agents",
            "Implement Supabase for data persistence",
            "Build high-converting landing pages",
            "Create lead scoring and pipeline management",
            "Launch live campaigns across all markets"
        ]
    }

    # Save test report
    report_filename = f"nexus_test_campaign_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_filename, 'w', encoding='utf-8') as f:
        json.dump(test_report, f, indent=2, default=str)

    print(f"\n💾 Detailed test report saved: {report_filename}")

    # Cleanup
    await agent.cleanup()

    print("\n🎉 Nexus™ Test Campaign Complete!")
    print(f"   System Status: {'🟢 Operational' if successful_campaigns > 0 else '🔴 Needs Attention'}")
    print(f"   Ready for: {'✅ Production deployment' if successful_campaigns == total_campaigns else '⚠️ Additional testing'}")

    return test_report

if __name__ == "__main__":
    # Run the comprehensive test
    asyncio.run(run_comprehensive_test_campaign())
