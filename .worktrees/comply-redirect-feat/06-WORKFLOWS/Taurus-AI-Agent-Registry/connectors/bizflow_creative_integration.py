#!/usr/bin/env python3
"""
BizFlow™ Creative Integration
Connects Vertex AI Creative Studio Agent with BizFlow™ for enhanced creative capabilities
"""

import asyncio
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional

# Add registry to path
registry_path = Path(__file__).parent.parent
sys.path.insert(0, str(registry_path))

from registry.agent_registry import get_global_registry
from connectors.bizflow_connector import BizFlowConnector

class BizFlowCreativeIntegration:
    """
    Enhanced BizFlow™ integration with Vertex AI Creative Studio capabilities
    """
    
    def __init__(self):
        self.registry = get_global_registry()
        self.bizflow_connector = None
        self.creative_agent = None
        
    async def initialize(self) -> Dict[str, Any]:
        """Initialize the creative integration for BizFlow™"""
        
        print("🎨 Initializing BizFlow™ Creative Integration")
        print("=" * 60)
        
        # Initialize BizFlow connector
        self.bizflow_connector = BizFlowConnector()
        bizflow_init = await self.bizflow_connector.initialize_for_bizflow()
        
        # Load creative agent specifically
        creative_config = {
            "gcp_project_id": "your-gcp-project",  # To be configured
            "gcp_location": "us-central1",
            "business_domain": "creative_marketing"
        }
        
        try:
            self.creative_agent = await self.registry.load_agent("vertex_ai_creative", creative_config)
            creative_loaded = self.creative_agent is not None
        except Exception as e:
            print(f"   ⚠️ Creative agent requires GCP setup: {e}")
            creative_loaded = False
        
        integration_status = {
            "bizflow_connector": bizflow_init["loaded_agents"],
            "creative_agent_available": creative_loaded,
            "enhanced_capabilities": self._get_enhanced_capabilities(),
            "total_agents": len(bizflow_init["loaded_agents"]) + (1 if creative_loaded else 0)
        }
        
        print(f"📊 Integration Status:")
        print(f"   BizFlow Agents: {len(bizflow_init['loaded_agents'])}")
        print(f"   Creative Agent: {'✅' if creative_loaded else '⚠️ Needs GCP setup'}")
        print(f"   Enhanced Capabilities: {len(integration_status['enhanced_capabilities'])}")
        
        return integration_status
    
    def _get_enhanced_capabilities(self) -> List[str]:
        """Get enhanced capabilities when creative agent is available"""
        
        base_capabilities = [
            "market_research",
            "competitor_analysis", 
            "web_scraping",
            "mcp_integration"
        ]
        
        creative_capabilities = [
            "ai_image_generation",
            "brand_aligned_creative",
            "campaign_asset_creation",
            "visual_content_generation",
            "prompt_optimization",
            "multimodal_content_creation",
            "creative_ideation",
            "marketing_asset_automation"
        ]
        
        return base_capabilities + creative_capabilities
    
    async def execute_enhanced_campaign(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute an enhanced BizFlow™ campaign with creative AI capabilities
        """
        
        print(f"🚀 Executing Enhanced BizFlow™ Campaign: {campaign_data.get('campaign_name')}")
        
        enhanced_results = {
            "campaign_id": campaign_data.get("id"),
            "campaign_name": campaign_data.get("campaign_name"),
            "market_research": {},
            "creative_assets": {},
            "execution_status": "running",
            "enhanced_features_used": [],
            "execution_errors": []
        }
        
        # Phase 1: Market Research (using existing BizFlow agents)
        if self.bizflow_connector and self.bizflow_connector.loaded_agents:
            try:
                print("   🔍 Phase 1: Market Research & Analysis")
                
                research_result = await self.bizflow_connector.execute_orchestrated_campaign(campaign_data)
                enhanced_results["market_research"] = research_result
                enhanced_results["enhanced_features_used"].append("market_research")
                
                print("   ✅ Market research completed")
                
            except Exception as e:
                error_msg = f"Market research failed: {str(e)}"
                enhanced_results["execution_errors"].append(error_msg)
                print(f"   ❌ {error_msg}")
        
        # Phase 2: Creative Asset Generation (using Vertex AI Creative Agent)
        if self.creative_agent:
            try:
                print("   🎨 Phase 2: AI-Powered Creative Generation")
                
                # Extract brand guidelines and creative requirements
                creative_brief = self._create_creative_brief(campaign_data, enhanced_results.get("market_research", {}))
                
                # Generate campaign assets
                creative_assets = await self.creative_agent.generate_campaign_assets(creative_brief)
                enhanced_results["creative_assets"] = creative_assets
                enhanced_results["enhanced_features_used"].append("ai_creative_generation")
                
                print(f"   ✅ Creative assets generated: {creative_assets.get('total_assets', 0)} assets")
                
            except Exception as e:
                error_msg = f"Creative generation failed: {str(e)}"
                enhanced_results["execution_errors"].append(error_msg)
                print(f"   ❌ {error_msg}")
        else:
            print("   ⚠️ Creative agent not available (requires GCP setup)")
        
        # Phase 3: Campaign Optimization (combining insights)
        try:
            print("   ⚡ Phase 3: Campaign Optimization")
            
            optimization_insights = self._generate_optimization_insights(
                enhanced_results["market_research"], 
                enhanced_results["creative_assets"]
            )
            enhanced_results["optimization_insights"] = optimization_insights
            enhanced_results["enhanced_features_used"].append("campaign_optimization")
            
            print("   ✅ Campaign optimization completed")
            
        except Exception as e:
            error_msg = f"Campaign optimization failed: {str(e)}"
            enhanced_results["execution_errors"].append(error_msg)
            print(f"   ❌ {error_msg}")
        
        # Finalize results
        enhanced_results["execution_status"] = "completed" if not enhanced_results["execution_errors"] else "completed_with_errors"
        enhanced_results["total_enhanced_features"] = len(enhanced_results["enhanced_features_used"])
        
        print(f"🎉 Enhanced Campaign Complete!")
        print(f"   Status: {enhanced_results['execution_status']}")
        print(f"   Enhanced features used: {enhanced_results['total_enhanced_features']}")
        print(f"   Errors: {len(enhanced_results['execution_errors'])}")
        
        return enhanced_results
    
    def _create_creative_brief(self, campaign_data: Dict[str, Any], research_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a comprehensive creative brief from campaign and research data"""
        
        # Extract insights from research data for creative guidance
        research_insights = research_data.get("results", {})
        
        creative_brief = {
            "id": campaign_data.get("id"),
            "campaign_name": campaign_data.get("campaign_name"),
            "target_market": campaign_data.get("target_market"),
            "brand_guidelines": {
                "brand_name": "BizFlow™",
                "brand_style": "modern, professional, AI-forward",
                "brand_colors": ["#1E40AF", "#EF4444", "#10B981", "#F59E0B"],
                "brand_voice": "confident, innovative, results-driven"
            },
            "target_audience": campaign_data.get("target_audience", {}).get("primary", "business professionals"),
            "campaign_type": campaign_data.get("campaign_type", "marketing"),
            "objectives": campaign_data.get("objectives", []),
            "research_insights": research_insights,
            "creative_requirements": [
                "professional and trustworthy",
                "AI and technology forward",
                "results and ROI focused",
                "market-specific customization"
            ]
        }
        
        # Add market-specific customizations
        market = campaign_data.get("target_market", "").lower()
        if market == "uae":
            creative_brief["brand_guidelines"]["cultural_considerations"] = [
                "professional business culture",
                "international outlook", 
                "innovation and technology focus"
            ]
        elif market == "india":
            creative_brief["brand_guidelines"]["cultural_considerations"] = [
                "diverse business landscape",
                "digital transformation focus",
                "growth and scalability emphasis"
            ]
        elif market == "canada":
            creative_brief["brand_guidelines"]["cultural_considerations"] = [
                "bilingual considerations",
                "professional business standards",
                "innovation and quality focus"
            ]
        
        return creative_brief
    
    def _generate_optimization_insights(self, research_data: Dict[str, Any], creative_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate campaign optimization insights combining research and creative data"""
        
        optimization_insights = {
            "campaign_strengths": [],
            "improvement_opportunities": [],
            "creative_performance_predictions": {},
            "market_alignment_score": 0.0,
            "recommendations": []
        }
        
        # Analyze research data
        if research_data and research_data.get("results"):
            optimization_insights["campaign_strengths"].append("Comprehensive market research completed")
            optimization_insights["market_alignment_score"] += 0.4
        
        # Analyze creative data
        if creative_data and creative_data.get("total_assets", 0) > 0:
            optimization_insights["campaign_strengths"].append("AI-generated creative assets available")
            optimization_insights["creative_performance_predictions"] = {
                "asset_count": creative_data.get("total_assets", 0),
                "asset_types": creative_data.get("asset_types", []),
                "predicted_engagement": "high"
            }
            optimization_insights["market_alignment_score"] += 0.4
        
        # Generate recommendations
        recommendations = [
            "A/B test creative assets across different audience segments",
            "Leverage market research insights for personalized messaging",
            "Implement AI-generated content in social media campaigns",
            "Monitor performance metrics and iterate on creative approach"
        ]
        
        if creative_data.get("generation_errors"):
            recommendations.append("Address creative generation issues for optimal results")
        
        optimization_insights["recommendations"] = recommendations
        optimization_insights["market_alignment_score"] += 0.2  # Base score
        
        return optimization_insights
    
    def get_integration_capabilities(self) -> Dict[str, Any]:
        """Get comprehensive integration capabilities"""
        
        return {
            "base_bizflow_capabilities": [
                "market_research",
                "competitor_analysis",
                "web_scraping", 
                "mcp_integration"
            ],
            "enhanced_creative_capabilities": [
                "ai_image_generation",
                "brand_aligned_creative",
                "campaign_asset_creation",
                "visual_content_generation",
                "prompt_optimization",
                "multimodal_content_creation"
            ],
            "integration_benefits": [
                "end_to_end_campaign_creation",
                "ai_powered_creative_automation",
                "market_research_driven_creative",
                "brand_consistent_asset_generation",
                "multi_modal_content_creation",
                "scalable_creative_production"
            ],
            "supported_markets": ["UAE", "India", "Canada"],
            "supported_business_types": ["B2B", "B2C", "SME"],
            "integration_status": "active"
        }

# Test the enhanced integration
async def main():
    """Test BizFlow™ Creative Integration"""
    
    integration = BizFlowCreativeIntegration()
    
    # Initialize integration
    status = await integration.initialize()
    print(f"\\n📊 Integration Status: {status}")
    
    # Display capabilities
    capabilities = integration.get_integration_capabilities()
    print(f"\\n🛠️ Integration Capabilities:")
    print(f"   Base Capabilities: {len(capabilities['base_bizflow_capabilities'])}")
    print(f"   Creative Capabilities: {len(capabilities['enhanced_creative_capabilities'])}")
    print(f"   Integration Benefits: {len(capabilities['integration_benefits'])}")
    
    # Test campaign (simplified)
    test_campaign = {
        "id": "enhanced_test_campaign_001",
        "campaign_name": "BizFlow™ UAE Launch with AI Creative",
        "target_market": "UAE",
        "campaign_type": "market_entry",
        "target_audience": {
            "primary": "B2B business owners and marketing managers"
        },
        "objectives": [
            "Generate awareness for BizFlow™",
            "Create compelling visual assets",
            "Establish market presence"
        ]
    }
    
    print(f"\\n🧪 Testing Enhanced Campaign (simplified)...")
    # Note: Full test would require GCP setup and API keys
    print(f"   Campaign: {test_campaign['campaign_name']}")
    print(f"   Market: {test_campaign['target_market']}")
    print(f"   Type: {test_campaign['campaign_type']}")

if __name__ == "__main__":
    asyncio.run(main())