#!/usr/bin/env python3
"""
🏰 TAURUS AI CORP. - Registry Server
Real-time AI agent orchestration and management system
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import uvicorn
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="TAURUS AI CORP. Registry Server",
    description="Real-time AI agent orchestration and management",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Agent(BaseModel):
    id: str
    name: str
    status: str
    capabilities: List[str]
    last_seen: datetime
    performance_metrics: Dict

class Campaign(BaseModel):
    id: str
    name: str
    status: str
    agents_involved: List[str]
    created_at: datetime
    metrics: Dict

# In-memory storage (replace with database in production)
agents: Dict[str, Agent] = {}
campaigns: Dict[str, Campaign] = {}
websocket_connections: List[WebSocket] = []

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                self.active_connections.remove(connection)

manager = ConnectionManager()

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "🏰 TAURUS AI CORP. Registry Server",
        "status": "operational",
        "agents_count": len(agents),
        "campaigns_count": len(campaigns),
        "websocket_connections": len(manager.active_connections)
    }

@app.get("/api/status")
async def get_status():
    return {
        "metrics": {
            "active_agents": len([a for a in agents.values() if a.status == "active"]),
            "total_capabilities": sum(len(a.capabilities) for a in agents.values()),
            "active_campaigns": len([c for c in campaigns.values() if c.status == "active"])
        },
        "revenue": {
            "current_mrr": 5300
        },
        "agents": list(agents.values()),
        "campaigns": list(campaigns.values())
    }

@app.post("/api/agents/register")
async def register_agent(agent: Agent):
    agents[agent.id] = agent
    await manager.broadcast({
        "type": "agent_registered",
        "agent": agent.dict()
    })
    logger.info(f"Agent registered: {agent.name}")
    return {"message": "Agent registered successfully"}

@app.post("/api/campaigns/create")
async def create_campaign(campaign: Campaign):
    campaigns[campaign.id] = campaign
    await manager.broadcast({
        "type": "campaign_created",
        "campaign": campaign.dict()
    })
    logger.info(f"Campaign created: {campaign.name}")
    return {"message": "Campaign created successfully"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            elif message.get("type") == "agent_update":
                agent_id = message.get("agent_id")
                if agent_id in agents:
                    agents[agent_id].last_seen = datetime.now()
                    await manager.broadcast({
                        "type": "agent_updated",
                        "agent_id": agent_id
                    })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Initialize with sample data
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting TAURUS AI CORP. Registry Server...")
    
    # Initialize sample agents
    sample_agents = [
        Agent(
            id="vertex-ai-creative",
            name="Vertex AI Creative",
            status="active",
            capabilities=["content_generation", "brand_analysis", "creative_optimization"],
            last_seen=datetime.now(),
            performance_metrics={"success_rate": 0.98, "avg_response_time": 1.2}
        ),
        Agent(
            id="cognee-memory",
            name="Cognee Memory",
            status="active",
            capabilities=["memory_management", "context_retention", "learning_optimization"],
            last_seen=datetime.now(),
            performance_metrics={"success_rate": 0.95, "avg_response_time": 0.8}
        ),
        Agent(
            id="onlook-visual",
            name="Onlook Visual",
            status="active",
            capabilities=["image_analysis", "visual_optimization", "design_insights"],
            last_seen=datetime.now(),
            performance_metrics={"success_rate": 0.97, "avg_response_time": 2.1}
        ),
        Agent(
            id="ollama-local-ai",
            name="Ollama Local AI",
            status="active",
            capabilities=["local_processing", "privacy_ai", "offline_analysis"],
            last_seen=datetime.now(),
            performance_metrics={"success_rate": 0.92, "avg_response_time": 3.5}
        ),
        Agent(
            id="vibe-marketing",
            name="Vibe Marketing",
            status="active",
            capabilities=["brand_positioning", "market_analysis", "campaign_optimization"],
            last_seen=datetime.now(),
            performance_metrics={"success_rate": 0.96, "avg_response_time": 1.8}
        ),
        Agent(
            id="claude-seo-mcp",
            name="Claude SEO MCP",
            status="active",
            capabilities=["seo_optimization", "content_strategy", "ranking_analysis"],
            last_seen=datetime.now(),
            performance_metrics={"success_rate": 0.94, "avg_response_time": 2.3}
        )
    ]
    
    for agent in sample_agents:
        agents[agent.id] = agent
    
    logger.info(f"✅ Initialized {len(agents)} agents")
    logger.info("🏰 TAURUS AI CORP. Registry Server ready!")

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )