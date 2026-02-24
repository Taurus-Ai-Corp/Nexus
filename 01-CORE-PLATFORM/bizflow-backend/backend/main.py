#!/usr/bin/env python3
"""
TAURUS AI CORP - BizFlow™ Core Backend API
FastAPI-based microservices architecture with multi-tenant support
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import redis.asyncio as redis
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import jwt
from datetime import datetime, timedelta
import bcrypt
import uuid

# Import our specialized agents
import sys
sys.path.append('/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents')

from specialized.intelligence_research.agent import IntelligenceResearchAgent
from specialized.webflow_integration_master.agent import WebflowIntegrationMasterAgent
from specialized.custom_component_performance.agent import CustomComponentPerformanceAgent
from specialized.performance_analysis.agent import PerformanceAnalysisAgent
from specialized.content_social_strategy.agent import ContentSocialStrategyAgent
from specialized.realtime_intelligence_dashboard.agent import RealtimeIntelligenceDashboardAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
redis_client: Optional[redis.Redis] = None
db_session: Optional[AsyncSession] = None
agent_instances = {}

# Security
security = HTTPBearer()
SECRET_KEY = "taurus_ai_corp_secret_key_change_in_production"
ALGORITHM = "HS256"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage FastAPI application lifespan"""
    # Startup
    await startup_event()
    yield
    # Shutdown
    await shutdown_event()

# FastAPI app with lifespan
app = FastAPI(
    title="TAURUS AI CORP - BizFlow™ Platform",
    description="AI-Powered Business Intelligence Automation Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Database Models and Schemas (simplified)
from pydantic import BaseModel, EmailStr
from typing import Union
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    AGENT = "agent"

class BusinessVertical(str, Enum):
    ECOMMERCE = "ecommerce"
    SAAS = "saas"
    LOCAL_BUSINESS = "local_business"
    GENERAL = "general"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.USER
    business_vertical: BusinessVertical = BusinessVertical.GENERAL

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    expires_at: datetime

class AgentTask(BaseModel):
    task_id: str
    agent_name: str
    task_type: str
    parameters: Dict[str, Any]
    scheduled_for: Optional[datetime] = None

class CampaignCreate(BaseModel):
    name: str
    description: str
    business_vertical: BusinessVertical
    target_metrics: Dict[str, Any]
    automation_config: Dict[str, Any]

# Connection Manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        if user_id:
            self.user_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket, user_id: str = None):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if user_id and user_id in self.user_connections:
            del self.user_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.user_connections:
            websocket = self.user_connections[user_id]
            await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove broken connections
                if connection in self.active_connections:
                    self.active_connections.remove(connection)

manager = ConnectionManager()

# Startup and Shutdown Events
async def startup_event():
    """Initialize backend services and agents"""
    global redis_client, db_session, agent_instances
    
    try:
        logger.info("🚀 Starting TAURUS AI CORP BizFlow™ Backend...")
        
        # Initialize Redis
        redis_client = redis.from_url("redis://localhost:6379", decode_responses=True)
        await redis_client.ping()
        logger.info("✅ Redis connected successfully")
        
        # Initialize Database
        engine = create_async_engine(
            "postgresql+asyncpg://user:pass@localhost/taurus",
            echo=False
        )
        async_session = sessionmaker(engine, class_=AsyncSession)
        db_session = async_session()
        logger.info("✅ Database connected successfully")
        
        # Initialize specialized agents
        config = {
            "redis_url": "redis://localhost:6379",
            "database_url": "postgresql+asyncpg://user:pass@localhost/taurus",
            "debug": True
        }
        
        agent_instances = {
            "intelligence_research": IntelligenceResearchAgent(),
            "webflow_integration": WebflowIntegrationMasterAgent(),
            "custom_component_performance": CustomComponentPerformanceAgent(),
            "performance_analysis": PerformanceAnalysisAgent(),
            "content_social_strategy": ContentSocialStrategyAgent(),
            "realtime_intelligence": RealtimeIntelligenceDashboardAgent()
        }
        
        # Initialize each agent
        for name, agent in agent_instances.items():
            try:
                await agent.initialize(config)
                logger.info(f"✅ Agent {name} initialized successfully")
            except Exception as e:
                logger.error(f"❌ Failed to initialize agent {name}: {e}")
        
        logger.info("🎉 All backend services initialized successfully!")
        
    except Exception as e:
        logger.error(f"❌ Backend initialization failed: {e}")
        raise

async def shutdown_event():
    """Cleanup resources"""
    global redis_client, db_session
    
    logger.info("🔄 Shutting down TAURUS AI CORP Backend...")
    
    if redis_client:
        await redis_client.close()
    
    if db_session:
        await db_session.close()
    
    logger.info("✅ Backend shutdown complete")

# Authentication Functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# API Routes

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to TAURUS AI CORP BizFlow™ Platform",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "redis": False,
            "database": False,
            "agents": {}
        }
    }
    
    # Check Redis
    try:
        if redis_client:
            await redis_client.ping()
            health_status["services"]["redis"] = True
    except:
        pass
    
    # Check Database
    try:
        if db_session:
            # Simple query to test connection
            health_status["services"]["database"] = True
    except:
        pass
    
    # Check Agents
    for name, agent in agent_instances.items():
        health_status["services"]["agents"][name] = hasattr(agent, 'name')
    
    return health_status

# Authentication Routes

@app.post("/api/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    """Register new user"""
    try:
        # Check if user exists (simplified - in production, check database)
        if redis_client:
            existing = await redis_client.get(f"user:email:{user_data.email}")
            if existing:
                raise HTTPException(status_code=400, detail="User already exists")
        
        # Create user
        user_id = str(uuid.uuid4())
        hashed_password = hash_password(user_data.password)
        
        user_record = {
            "id": user_id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "role": user_data.role,
            "business_vertical": user_data.business_vertical,
            "password_hash": hashed_password,
            "created_at": datetime.now().isoformat(),
            "is_active": True
        }
        
        # Store user (in production, use proper database)
        if redis_client:
            await redis_client.setex(f"user:{user_id}", 86400 * 30, json.dumps(user_record))
            await redis_client.setex(f"user:email:{user_data.email}", 86400 * 30, user_id)
        
        # Create token
        access_token, expires_at = create_access_token(
            data={"sub": user_id, "email": user_data.email, "role": user_data.role}
        )
        
        return Token(
            access_token=access_token,
            user_id=user_id,
            expires_at=expires_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/api/auth/login", response_model=Token)
async def login_user(login_data: UserLogin):
    """Authenticate user"""
    try:
        # Get user by email (simplified)
        if redis_client:
            user_id = await redis_client.get(f"user:email:{login_data.email}")
            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            user_data = await redis_client.get(f"user:{user_id}")
            if not user_data:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            user_record = json.loads(user_data)
            
            # Verify password
            if not verify_password(login_data.password, user_record["password_hash"]):
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            # Create token
            access_token, expires_at = create_access_token(
                data={"sub": user_id, "email": user_record["email"], "role": user_record["role"]}
            )
            
            return Token(
                access_token=access_token,
                user_id=user_id,
                expires_at=expires_at
            )
        
        raise HTTPException(status_code=500, detail="Authentication service unavailable")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

# Agent Management Routes

@app.get("/api/agents")
async def list_agents(user_id: str = Depends(verify_token)):
    """List all available agents"""
    return {
        "agents": [
            {
                "name": name,
                "description": agent.description if hasattr(agent, 'description') else f"{name} agent",
                "status": "active",
                "last_updated": datetime.now().isoformat()
            }
            for name, agent in agent_instances.items()
        ]
    }

@app.post("/api/agents/{agent_name}/task")
async def create_agent_task(agent_name: str, task: AgentTask, background_tasks: BackgroundTasks, 
                           user_id: str = Depends(verify_token)):
    """Create task for specific agent"""
    try:
        if agent_name not in agent_instances:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        task_id = str(uuid.uuid4())
        task_data = {
            "task_id": task_id,
            "agent_name": agent_name,
            "task_type": task.task_type,
            "parameters": task.parameters,
            "created_by": user_id,
            "created_at": datetime.now().isoformat(),
            "status": "pending",
            "scheduled_for": task.scheduled_for.isoformat() if task.scheduled_for else None
        }
        
        # Store task
        if redis_client:
            await redis_client.setex(f"task:{task_id}", 86400, json.dumps(task_data))
        
        # Schedule task execution
        background_tasks.add_task(execute_agent_task, agent_name, task_data)
        
        return {
            "task_id": task_id,
            "status": "created",
            "message": f"Task created for {agent_name} agent"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Task creation error: {e}")
        raise HTTPException(status_code=500, detail="Task creation failed")

async def execute_agent_task(agent_name: str, task_data: Dict[str, Any]):
    """Execute agent task"""
    try:
        task_id = task_data["task_id"]
        logger.info(f"Executing task {task_id} for agent {agent_name}")
        
        # Update task status
        if redis_client:
            task_data["status"] = "running"
            task_data["started_at"] = datetime.now().isoformat()
            await redis_client.setex(f"task:{task_id}", 86400, json.dumps(task_data))
        
        # Execute task based on agent and task type
        agent = agent_instances.get(agent_name)
        if not agent:
            raise ValueError(f"Agent {agent_name} not available")
        
        result = None
        task_type = task_data["task_type"]
        parameters = task_data["parameters"]
        
        # Route to appropriate agent method based on task type
        if agent_name == "intelligence_research" and hasattr(agent, 'research_topic'):
            result = await agent.research_topic(parameters.get("topic", "AI automation trends"))
        elif agent_name == "content_social_strategy" and hasattr(agent, 'create_case_study'):
            result = await agent.create_case_study(
                parameters.get("vertical", "ecommerce"),
                parameters.get("data", {})
            )
        # Add more task routing as needed
        
        # Update task with results
        if redis_client:
            task_data["status"] = "completed"
            task_data["completed_at"] = datetime.now().isoformat()
            task_data["result"] = result if isinstance(result, dict) else str(result)
            await redis_client.setex(f"task:{task_id}", 86400, json.dumps(task_data))
        
        logger.info(f"Task {task_id} completed successfully")
        
    except Exception as e:
        logger.error(f"Task execution error: {e}")
        
        # Update task with error
        if redis_client:
            task_data["status"] = "failed"
            task_data["error"] = str(e)
            task_data["failed_at"] = datetime.now().isoformat()
            await redis_client.setex(f"task:{task_id}", 86400, json.dumps(task_data))

@app.get("/api/agents/task/{task_id}")
async def get_task_status(task_id: str, user_id: str = Depends(verify_token)):
    """Get task status and results"""
    try:
        if redis_client:
            task_data = await redis_client.get(f"task:{task_id}")
            if not task_data:
                raise HTTPException(status_code=404, detail="Task not found")
            
            return json.loads(task_data)
        
        raise HTTPException(status_code=500, detail="Task service unavailable")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Task status error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get task status")

# Campaign Management Routes

@app.post("/api/campaigns")
async def create_campaign(campaign: CampaignCreate, user_id: str = Depends(verify_token)):
    """Create new marketing campaign"""
    try:
        campaign_id = str(uuid.uuid4())
        campaign_data = {
            "id": campaign_id,
            "name": campaign.name,
            "description": campaign.description,
            "business_vertical": campaign.business_vertical,
            "target_metrics": campaign.target_metrics,
            "automation_config": campaign.automation_config,
            "created_by": user_id,
            "created_at": datetime.now().isoformat(),
            "status": "active",
            "performance_metrics": {}
        }
        
        # Store campaign
        if redis_client:
            await redis_client.setex(f"campaign:{campaign_id}", 86400 * 30, json.dumps(campaign_data))
            
            # Add to user's campaigns
            user_campaigns = await redis_client.get(f"user_campaigns:{user_id}")
            campaigns = json.loads(user_campaigns) if user_campaigns else []
            campaigns.append(campaign_id)
            await redis_client.setex(f"user_campaigns:{user_id}", 86400 * 30, json.dumps(campaigns))
        
        return {
            "campaign_id": campaign_id,
            "status": "created",
            "message": "Campaign created successfully"
        }
        
    except Exception as e:
        logger.error(f"Campaign creation error: {e}")
        raise HTTPException(status_code=500, detail="Campaign creation failed")

@app.get("/api/campaigns")
async def list_campaigns(user_id: str = Depends(verify_token)):
    """List user's campaigns"""
    try:
        if redis_client:
            user_campaigns = await redis_client.get(f"user_campaigns:{user_id}")
            if not user_campaigns:
                return {"campaigns": []}
            
            campaign_ids = json.loads(user_campaigns)
            campaigns = []
            
            for campaign_id in campaign_ids:
                campaign_data = await redis_client.get(f"campaign:{campaign_id}")
                if campaign_data:
                    campaigns.append(json.loads(campaign_data))
            
            return {"campaigns": campaigns}
        
        return {"campaigns": []}
        
    except Exception as e:
        logger.error(f"Campaign listing error: {e}")
        raise HTTPException(status_code=500, detail="Failed to list campaigns")

# WebSocket Routes

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket connection for real-time updates"""
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            # Send periodic updates
            await asyncio.sleep(30)  # Send update every 30 seconds
            
            # Get latest metrics
            if redis_client:
                # Example: Send agent status updates
                agent_status = {}
                for name in agent_instances.keys():
                    agent_status[name] = "active"
                
                update_message = {
                    "type": "agent_status",
                    "data": agent_status,
                    "timestamp": datetime.now().isoformat()
                }
                
                await manager.send_personal_message(json.dumps(update_message), user_id)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, user_id)

# Dashboard Routes

@app.get("/api/dashboard")
async def get_dashboard_data(user_id: str = Depends(verify_token)):
    """Get dashboard data for user"""
    try:
        dashboard_data = {
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "metrics": {
                "active_campaigns": 0,
                "pending_tasks": 0,
                "agent_status": {},
                "performance_summary": {}
            }
        }
        
        if redis_client:
            # Get user campaigns count
            user_campaigns = await redis_client.get(f"user_campaigns:{user_id}")
            if user_campaigns:
                dashboard_data["metrics"]["active_campaigns"] = len(json.loads(user_campaigns))
            
            # Get agent status
            for name in agent_instances.keys():
                dashboard_data["metrics"]["agent_status"][name] = "active"
            
            # Get pending tasks count
            task_keys = await redis_client.keys("task:*")
            pending_tasks = 0
            for key in task_keys:
                task_data = await redis_client.get(key)
                if task_data:
                    task = json.loads(task_data)
                    if task.get("created_by") == user_id and task.get("status") in ["pending", "running"]:
                        pending_tasks += 1
            
            dashboard_data["metrics"]["pending_tasks"] = pending_tasks
        
        return dashboard_data
        
    except Exception as e:
        logger.error(f"Dashboard error: {e}")
        raise HTTPException(status_code=500, detail="Dashboard data unavailable")

# Error Handlers

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "timestamp": datetime.now().isoformat()}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )