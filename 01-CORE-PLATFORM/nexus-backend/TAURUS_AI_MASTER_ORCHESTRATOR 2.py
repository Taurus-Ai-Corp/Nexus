#!/usr/bin/env python3
"""
🏰 TAURUS AI CORP. - MASTER ORCHESTRATOR
Universal AI Automation Command Center

Manages and orchestrates all AI agents, N8N workflows, and automation systems
across the entire TAURUS AI ecosystem.
"""

import asyncio
import json
import logging
import requests
import aiohttp
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class WorkflowInfo:
    """Information about an available workflow"""
    id: str
    name: str
    description: str
    capabilities: List[str]
    webhook_url: Optional[str] = None
    input_schema: Optional[Dict] = None
    output_schema: Optional[Dict] = None

class TaurusAIMasterOrchestrator:
    """
    Master Orchestrator for TAURUS AI CORP
    Manages all AI agents, workflows, and automation systems
    """
    
    def __init__(self):
        self.n8n_base_url = "http://localhost:5678"
        self.n8n_auth = ("taurus_admin", "TaurusAI_Production_2025!")
        self.available_workflows = {}
        self.active_sessions = {}
        
        # Initialize workflow registry
        self.initialize_workflow_registry()
        
    def initialize_workflow_registry(self):
        """Initialize the registry of all available workflows and agents"""
        logger.info("🚀 Initializing TAURUS AI Master Orchestrator...")
        
        # Jack's Automation Workflows
        self.available_workflows = {
            "linkedin_automation": WorkflowInfo(
                id="linkedin_automation",
                name="$10,000 LinkedIn Agent",
                description="4-agent LinkedIn content optimization system with 250+ viral hooks",
                capabilities=[
                    "content_research", "performance_analysis", "script_generation", 
                    "hook_optimization", "viral_content_creation", "audience_targeting"
                ],
                webhook_url="http://localhost:5678/webhook/linkedin-automation",
                input_schema={
                    "message": "str", "metadata": "dict", "target_audience": "str"
                },
                output_schema={
                    "optimized_post": "str", "alternative_hooks": "list", 
                    "research_insights": "list", "performance_predictions": "dict"
                }
            ),
            
            "social_media_scraper": WorkflowInfo(
                id="social_media_scraper",
                name="LinkedIn + Instagram Scraper",
                description="Advanced social media data collection and analysis system",
                capabilities=[
                    "linkedin_scraping", "instagram_scraping", "profile_analysis",
                    "engagement_tracking", "competitor_monitoring", "content_mining"
                ],
                webhook_url="http://localhost:5678/webhook/social-scraper",
                input_schema={
                    "platform": "str", "targets": "list", "scraping_type": "str"
                },
                output_schema={
                    "scraped_data": "list", "profiles": "list", "analytics": "dict"
                }
            ),
            
            "memory_agent": WorkflowInfo(
                id="memory_agent",
                name="Agent with Memory",
                description="AI agent with persistent memory and context awareness",
                capabilities=[
                    "conversation_memory", "context_retention", "personalized_responses",
                    "learning_adaptation", "knowledge_accumulation", "relationship_building"
                ],
                webhook_url="http://localhost:5678/webhook/memory-agent",
                input_schema={
                    "message": "str", "user_id": "str", "context": "dict"
                },
                output_schema={
                    "response": "str", "memory_update": "dict", "context_analysis": "dict"
                }
            ),
            
            "client_intelligence": WorkflowInfo(
                id="client_intelligence", 
                name="Client Intelligence System",
                description="Comprehensive client data processing and relationship management",
                capabilities=[
                    "email_processing", "client_categorization", "meeting_analysis",
                    "relationship_tracking", "communication_automation", "crm_integration"
                ],
                webhook_url="http://localhost:5678/webhook/client-intelligence",
                input_schema={
                    "data_type": "str", "client_data": "dict", "analysis_type": "str"
                },
                output_schema={
                    "processed_data": "dict", "insights": "list", "recommendations": "list"
                }
            ),
            
            # BizFlow Native Agents
            "vertex_ai_creative": WorkflowInfo(
                id="vertex_ai_creative",
                name="Vertex AI Creative Agent", 
                description="Advanced creative content generation with 9 specialized capabilities",
                capabilities=[
                    "engagement_optimization", "visual_storytelling", "emotional_resonance",
                    "conversion_psychology", "brand_voice_alignment", "cultural_sensitivity",
                    "multi_format_adaptation", "seo_integration", "viral_potential_analysis"
                ],
                webhook_url="http://localhost:8000/api/agents/vertex-ai-creative"
            ),
            
            "vibe_marketing": WorkflowInfo(
                id="vibe_marketing",
                name="Vibe Marketing Agent",
                description="Multi-cultural marketing intelligence with 15 capabilities",
                capabilities=[
                    "cultural_adaptation", "global_market_analysis", "multilingual_content",
                    "regional_customization", "cultural_sensitivity", "local_trend_analysis"
                ],
                webhook_url="http://localhost:8000/api/agents/vibe-marketing"
            )
        }
        
        logger.info(f"✅ Initialized {len(self.available_workflows)} workflows and agents")
    
    async def execute_workflow(self, workflow_id: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a specific workflow with given input data"""
        if workflow_id not in self.available_workflows:
            raise ValueError(f"Workflow '{workflow_id}' not found")
        
        workflow = self.available_workflows[workflow_id]
        logger.info(f"🔄 Executing workflow: {workflow.name}")
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    workflow.webhook_url,
                    json=input_data,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        logger.info(f"✅ Workflow '{workflow_id}' completed successfully")
                        return {
                            "status": "success",
                            "workflow_id": workflow_id,
                            "workflow_name": workflow.name,
                            "result": result,
                            "timestamp": datetime.now().isoformat()
                        }
                    else:
                        error_msg = f"Workflow failed with status {response.status}"
                        logger.error(f"❌ {error_msg}")
                        return {
                            "status": "error",
                            "workflow_id": workflow_id,
                            "error": error_msg,
                            "timestamp": datetime.now().isoformat()
                        }
        except Exception as e:
            logger.error(f"❌ Workflow execution error: {e}")
            return {
                "status": "error",
                "workflow_id": workflow_id,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def orchestrate_multi_workflow(self, workflow_chain: List[Dict]) -> Dict[str, Any]:
        """Execute multiple workflows in sequence or parallel"""
        logger.info(f"🔗 Orchestrating {len(workflow_chain)} workflow chain...")
        
        results = []
        context_data = {}
        
        for step in workflow_chain:
            workflow_id = step["workflow_id"]
            input_data = step.get("input_data", {})
            execution_mode = step.get("mode", "sequential")  # or "parallel"
            
            # Merge context from previous steps
            if step.get("use_context", True) and context_data:
                input_data.update({"context": context_data})
            
            # Execute workflow
            result = await self.execute_workflow(workflow_id, input_data)
            results.append(result)
            
            # Update context for next workflow
            if result["status"] == "success":
                context_data[workflow_id] = result["result"]
            
            logger.info(f"📊 Step {len(results)}/{len(workflow_chain)} completed")
        
        return {
            "orchestration_status": "completed",
            "total_workflows": len(workflow_chain),
            "successful_workflows": len([r for r in results if r["status"] == "success"]),
            "results": results,
            "final_context": context_data,
            "timestamp": datetime.now().isoformat()
        }
    
    async def smart_workflow_selection(self, user_intent: str, requirements: Dict) -> List[str]:
        """AI-powered workflow selection based on user intent and requirements"""
        logger.info(f"🧠 Analyzing user intent for smart workflow selection...")
        
        # Intent mapping to workflows
        intent_mappings = {
            "linkedin_content": ["vertex_ai_creative", "linkedin_automation"],
            "social_media_analysis": ["social_media_scraper", "vibe_marketing"],
            "client_management": ["client_intelligence", "memory_agent"],
            "content_creation": ["vertex_ai_creative", "vibe_marketing", "linkedin_automation"],
            "market_research": ["social_media_scraper", "client_intelligence"],
            "viral_content": ["linkedin_automation", "vertex_ai_creative"],
            "global_marketing": ["vibe_marketing", "vertex_ai_creative"],
            "automation_setup": ["client_intelligence", "memory_agent"]
        }
        
        # Simple intent detection (can be enhanced with ML)
        detected_workflows = []
        for intent, workflows in intent_mappings.items():
            if intent.lower() in user_intent.lower():
                detected_workflows.extend(workflows)
        
        # Remove duplicates and ensure workflows exist
        recommended_workflows = list(set(detected_workflows))
        available_workflows = [w for w in recommended_workflows if w in self.available_workflows]
        
        logger.info(f"💡 Recommended {len(available_workflows)} workflows for intent: {user_intent}")
        return available_workflows
    
    def get_workflow_documentation(self) -> Dict[str, Any]:
        """Generate comprehensive documentation of all available workflows"""
        docs = {
            "taurus_ai_master_orchestrator": {
                "version": "2.0.0",
                "total_workflows": len(self.available_workflows),
                "last_updated": datetime.now().isoformat()
            },
            "workflows": {}
        }
        
        for workflow_id, workflow in self.available_workflows.items():
            docs["workflows"][workflow_id] = {
                "name": workflow.name,
                "description": workflow.description,
                "capabilities": workflow.capabilities,
                "webhook_url": workflow.webhook_url,
                "input_schema": workflow.input_schema,
                "output_schema": workflow.output_schema,
                "category": self._get_workflow_category(workflow_id)
            }
        
        return docs
    
    def _get_workflow_category(self, workflow_id: str) -> str:
        """Categorize workflows for better organization"""
        categories = {
            "content": ["linkedin_automation", "vertex_ai_creative"],
            "intelligence": ["social_media_scraper", "client_intelligence"],
            "ai_agents": ["memory_agent", "vibe_marketing"],
            "automation": ["client_intelligence"]
        }
        
        for category, workflows in categories.items():
            if workflow_id in workflows:
                return category
        return "general"

# API Models
class WorkflowExecutionRequest(BaseModel):
    workflow_id: str
    input_data: Dict[str, Any]
    metadata: Optional[Dict[str, Any]] = None

class MultiWorkflowRequest(BaseModel):
    workflow_chain: List[Dict[str, Any]]
    execution_mode: Optional[str] = "sequential"

class SmartOrchestrationRequest(BaseModel):
    user_intent: str
    requirements: Dict[str, Any]
    auto_execute: Optional[bool] = False

# FastAPI Application
app = FastAPI(
    title="TAURUS AI Master Orchestrator",
    description="Universal AI Automation Command Center",
    version="2.0.0"
)

# Initialize orchestrator
orchestrator = TaurusAIMasterOrchestrator()

@app.get("/")
async def orchestrator_status():
    """Get master orchestrator status"""
    return {
        "message": "🏰 TAURUS AI Master Orchestrator",
        "status": "operational",
        "total_workflows": len(orchestrator.available_workflows),
        "n8n_integration": "active",
        "bizflow_integration": "active",
        "capabilities": [
            "workflow_execution",
            "multi_workflow_orchestration", 
            "smart_workflow_selection",
            "context_management",
            "real_time_monitoring"
        ],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/workflows")
async def list_workflows():
    """List all available workflows and their capabilities"""
    return orchestrator.get_workflow_documentation()

@app.post("/api/execute")
async def execute_single_workflow(request: WorkflowExecutionRequest):
    """Execute a single workflow"""
    try:
        result = await orchestrator.execute_workflow(
            request.workflow_id,
            request.input_data
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution error: {str(e)}")

@app.post("/api/orchestrate")
async def orchestrate_workflows(request: MultiWorkflowRequest):
    """Execute multiple workflows in sequence or parallel"""
    try:
        result = await orchestrator.orchestrate_multi_workflow(request.workflow_chain)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Orchestration error: {str(e)}")

@app.post("/api/smart-orchestrate")
async def smart_orchestrate(request: SmartOrchestrationRequest):
    """AI-powered smart workflow orchestration based on user intent"""
    try:
        # Get recommended workflows
        recommended_workflows = await orchestrator.smart_workflow_selection(
            request.user_intent,
            request.requirements
        )
        
        response = {
            "user_intent": request.user_intent,
            "recommended_workflows": recommended_workflows,
            "workflow_details": {
                wf_id: orchestrator.available_workflows[wf_id].__dict__ 
                for wf_id in recommended_workflows
            }
        }
        
        # Auto-execute if requested
        if request.auto_execute and recommended_workflows:
            workflow_chain = [
                {
                    "workflow_id": wf_id,
                    "input_data": request.requirements,
                    "mode": "sequential"
                }
                for wf_id in recommended_workflows
            ]
            
            execution_result = await orchestrator.orchestrate_multi_workflow(workflow_chain)
            response["execution_result"] = execution_result
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Smart orchestration error: {str(e)}")

# Specialized endpoints for common use cases
@app.post("/api/linkedin-viral-content")
async def create_linkedin_viral_content(content_idea: Dict[str, str]):
    """Specialized endpoint for LinkedIn viral content creation"""
    workflow_chain = [
        {
            "workflow_id": "vertex_ai_creative",
            "input_data": {
                "content": content_idea.get("message", ""),
                "enhancement_type": "linkedin_optimization"
            }
        },
        {
            "workflow_id": "linkedin_automation", 
            "input_data": {
                "message": "{{ context.vertex_ai_creative.enhanced_content }}",
                "metadata": {"source": "taurus_ai_orchestrator"}
            }
        }
    ]
    
    return await orchestrator.orchestrate_multi_workflow(workflow_chain)

@app.post("/api/comprehensive-client-analysis")
async def comprehensive_client_analysis(client_data: Dict[str, Any]):
    """Specialized endpoint for comprehensive client intelligence"""
    workflow_chain = [
        {
            "workflow_id": "client_intelligence",
            "input_data": client_data
        },
        {
            "workflow_id": "memory_agent",
            "input_data": {
                "message": "Analyze and remember client insights: {{ context.client_intelligence }}",
                "user_id": client_data.get("client_id", "unknown"),
                "context": {"analysis_type": "comprehensive_profile"}
            }
        }
    ]
    
    return await orchestrator.orchestrate_multi_workflow(workflow_chain)

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "orchestrator": "operational", 
        "workflows_available": len(orchestrator.available_workflows),
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    logger.info("🏰 Starting TAURUS AI Master Orchestrator...")
    uvicorn.run(app, host="0.0.0.0", port=9000, log_level="info")