#!/usr/bin/env python3
"""
TAURUS AI CORP - BizFlow™ Core Backend API
FastAPI-based microservices architecture with multi-tenant support
"""

import asyncio
import json
import logging
import os

# Import our specialized agents
import sys
import uuid
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import Any

import redis.asyncio as redis
import uvicorn
from auth import (
    create_access_token,
    hash_password,
    verify_password,
    verify_telegram_auth,
    verify_token,
    verify_token_string,
)
from fastapi import (
    BackgroundTasks,
    Depends,
    FastAPI,
    HTTPException,
    Request,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel as PydanticBaseModel
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Resolve the agents package relative to this file rather than an absolute path.
# The previous hardcoded path pointed at a different machine's home directory, so the
# six `from specialized.*` imports below raised ImportError before `app` was created.
_BACKEND_DIR = Path(__file__).resolve().parent
_AGENTS_DIR = _BACKEND_DIR.parent / "agents"
for _p in (str(_AGENTS_DIR), str(_BACKEND_DIR)):
    if _p not in sys.path:
        sys.path.insert(0, _p)

# ruff: the imports below must follow the sys.path mutation above, so E402 is expected.
# Vector retrieval service (turbovec-powered RAG layer)
from services.vector_retrieval import vector_store  # noqa: E402
from specialized.content_social_strategy.agent import (  # noqa: E402
    ContentSocialStrategyAgent,
)
from specialized.custom_component_performance.agent import (  # noqa: E402
    CustomComponentPerformanceAgent,
)
from specialized.intelligence_research.agent import (  # noqa: E402
    IntelligenceResearchAgent,
)
from specialized.performance_analysis.agent import (  # noqa: E402
    PerformanceAnalysisAgent,
)
from specialized.realtime_intelligence_dashboard.agent import (  # noqa: E402
    RealtimeIntelligenceDashboardAgent,
)
from specialized.webflow_integration_master.agent import (  # noqa: E402
    WebflowIntegrationMasterAgent,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
redis_client: redis.Redis | None = None
db_session: AsyncSession | None = None
agent_instances = {}

# Security: SECRET_KEY/ALGORITHM/security(HTTPBearer) intentionally NOT
# redeclared here — main.py used to duplicate these (and the four functions
# below) alongside auth.py's copies, which is exactly the F811 shadowing
# this stage fixes. auth.py is the single source of truth now; nothing in
# main.py (including the /ws handler, routed through verify_token_string)
# needs these constants directly. See docs/plans/2026-08-10-w1-auth-token-shadowing.md §2.2.

# Rate Limiting
limiter = Limiter(key_func=get_remote_address)


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
    lifespan=lifespan,
)

# Attach rate limiter to app state
app.state.limiter = limiter


# Rate limit exceeded handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Rate limit exceeded. Please try again later.",
            "retry_after": exc.detail,
        },
        headers={"Retry-After": "60"},
    )


# Middleware - CORS with specific origins
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://localhost:3002",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
    max_age=600,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Security Headers Middleware
# Sentry Error Tracking
import sentry_sdk
from middleware.security_headers import SecurityHeadersMiddleware
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.redis import RedisIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[
        FastApiIntegration(),
        RedisIntegration(),
    ],
    traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
    environment=os.getenv("ENVIRONMENT", "development"),
    before_send=lambda event, hint: None if os.getenv("SENTRY_DSN") is None else event,
)

app.add_middleware(
    SecurityHeadersMiddleware,
    csp_report_uri=os.getenv("CSP_REPORT_URI"),
    hsts_max_age=31536000,
    hsts_include_subdomains=True,
    hsts_preload=True,
    frame_options="DENY",
)

# Database Models and Schemas (simplified)
import re
from enum import Enum

from pydantic import BaseModel, EmailStr, validator


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    AGENT = "agent"


class BusinessVertical(str, Enum):
    ECOMMERCE = "ecommerce"
    SAAS = "saas"
    LOCAL_BUSINESS = "local_business"
    GENERAL = "general"


# Common passwords list for basic check
_COMMON_PASSWORDS = {
    "password",
    "12345678",
    "123456789",
    "qwerty",
    "abc123",
    "password1",
    "iloveyou",
    "admin123",
    "letmein",
    "welcome",
}


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.USER
    business_vertical: BusinessVertical = BusinessVertical.GENERAL

    @validator("password")
    def validate_password(cls, v):
        if len(v) < 12:
            raise ValueError("Password must be at least 12 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain an uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain a lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain a digit")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain a special character")
        if v.lower() in _COMMON_PASSWORDS:
            raise ValueError("Password is too common")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"  # noqa: S105
    user_id: str
    expires_at: datetime


class AgentTask(BaseModel):
    task_id: str
    agent_name: str
    task_type: str
    parameters: dict[str, Any]
    scheduled_for: datetime | None = None


class CampaignCreate(BaseModel):
    name: str
    description: str
    business_vertical: BusinessVertical
    target_metrics: dict[str, Any]
    automation_config: dict[str, Any]


# Connection Manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.user_connections: dict[str, WebSocket] = {}

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
            except Exception as e:
                logger.warning(f"Broadcast failed, dropping dead connection: {e}")
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
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise RuntimeError("DATABASE_URL environment variable is required")
        engine = create_async_engine(database_url, echo=False)
        async_session = sessionmaker(engine, class_=AsyncSession)
        db_session = async_session()
        logger.info("✅ Database connected successfully")

        # Initialize specialized agents
        config = {
            "redis_url": os.getenv("REDIS_URL", "redis://localhost:6379"),
            "database_url": os.getenv("DATABASE_URL", ""),
            "debug": os.getenv("DEBUG", "false").lower() == "true",
        }

        agent_instances = {
            "intelligence_research": IntelligenceResearchAgent(),
            "webflow_integration": WebflowIntegrationMasterAgent(),
            "custom_component_performance": CustomComponentPerformanceAgent(),
            "performance_analysis": PerformanceAnalysisAgent(),
            "content_social_strategy": ContentSocialStrategyAgent(),
            "realtime_intelligence": RealtimeIntelligenceDashboardAgent(),
        }

        # Initialize each agent
        for name, agent in agent_instances.items():
            try:
                await agent.initialize(config)
                logger.info(f"✅ Agent {name} initialized successfully")
            except Exception as e:
                logger.error(f"❌ Failed to initialize agent {name}: {e}")

        # Initialize vector retrieval service (turbovec-powered RAG)
        try:
            await vector_store.initialize(config)
            logger.info(
                f"✅ Vector retrieval service initialized "
                f"(dim={vector_store.dim}, bit_width={vector_store.bit_width}, "
                f"size={vector_store.size})"
            )
        except Exception as e:
            logger.error(f"❌ Vector retrieval service init failed (non-fatal): {e}")

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


# Authentication Functions: create_access_token, verify_token, hash_password,
# and verify_password are imported from auth.py (see import block above).
# They used to be redefined here too (24h expiry, no `type` claim, no
# WWW-Authenticate header) — Python name binding meant this LOCAL copy always
# won over the auth.py import, silently shadowing it (F811). Deleted per
# docs/plans/2026-08-10-w1-auth-token-shadowing.md §2.1; the auth.py imports
# above are now live.


# API Routes


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to TAURUS AI CORP BizFlow™ Platform",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {"redis": False, "database": False, "agents": {}},
    }

    # Check Redis
    try:
        if redis_client:
            await redis_client.ping()
            health_status["services"]["redis"] = True
    except Exception as e:
        logger.warning(f"Redis health check failed: {e}")

    # Check Database
    try:
        if db_session:
            # Simple query to test connection
            health_status["services"]["database"] = True
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")

    # Check Agents
    for name, agent in agent_instances.items():
        health_status["services"]["agents"][name] = hasattr(agent, "name")

    return health_status


# Authentication Routes

# Brute force protection constants
MAX_FAILED_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_SECONDS = 15 * 60  # 15 minutes
FAILED_ATTEMPT_WINDOW_SECONDS = 3600  # 1 hour


@app.post("/api/auth/register", response_model=Token)
@limiter.limit("3/minute")
async def register_user(request: Request, user_data: UserCreate):
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
            "is_active": True,
            "token_version": 1,  # For session invalidation on password change
        }

        # Store user (in production, use proper database)
        if redis_client:
            await redis_client.setex(
                f"user:{user_id}", 86400 * 30, json.dumps(user_record)
            )
            await redis_client.setex(
                f"user:email:{user_data.email}", 86400 * 30, user_id
            )

        # Create token
        access_token, expires_at = create_access_token(
            data={"sub": user_id, "email": user_data.email, "role": user_data.role}
        )

        return Token(access_token=access_token, user_id=user_id, expires_at=expires_at)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed") from e


@app.post("/api/auth/login", response_model=Token)
@limiter.limit("5/minute")
async def login_user(request: Request, login_data: UserLogin):
    """Authenticate user with brute force protection"""
    try:
        email = login_data.email.lower()

        if redis_client:
            # Check if account is locked out
            lockout_key = f"lockout:{email}"
            if await redis_client.get(lockout_key):
                raise HTTPException(
                    status_code=423,
                    detail=f"Account temporarily locked. Try again in {LOCKOUT_DURATION_SECONDS // 60} minutes.",
                )

            # Track failed attempts
            failed_key = f"failed:{email}"
            failed_count = int(await redis_client.get(failed_key) or 0)

            # Get user by email
            user_id = await redis_client.get(f"user:email:{email}")
            if not user_id:
                # Still increment failed attempts to prevent email enumeration timing
                await redis_client.incr(failed_key)
                await redis_client.expire(failed_key, FAILED_ATTEMPT_WINDOW_SECONDS)
                raise HTTPException(status_code=401, detail="Invalid credentials")

            user_data = await redis_client.get(f"user:{user_id}")
            if not user_data:
                await redis_client.incr(failed_key)
                await redis_client.expire(failed_key, FAILED_ATTEMPT_WINDOW_SECONDS)
                raise HTTPException(status_code=401, detail="Invalid credentials")

            user_record = json.loads(user_data)

            # Verify password
            if not verify_password(login_data.password, user_record["password_hash"]):
                failed_count += 1
                await redis_client.set(failed_key, str(failed_count))
                await redis_client.expire(failed_key, FAILED_ATTEMPT_WINDOW_SECONDS)

                # Check if we should lock the account
                if failed_count >= MAX_FAILED_LOGIN_ATTEMPTS:
                    await redis_client.setex(lockout_key, LOCKOUT_DURATION_SECONDS, "1")
                    raise HTTPException(
                        status_code=423,
                        detail=f"Account locked after {MAX_FAILED_LOGIN_ATTEMPTS} failed attempts. Try again in {LOCKOUT_DURATION_SECONDS // 60} minutes.",
                    )

                remaining = MAX_FAILED_LOGIN_ATTEMPTS - failed_count
                raise HTTPException(
                    status_code=401,
                    detail=f"Invalid credentials. {remaining} attempts remaining.",
                )

            # Success: clear failed attempts
            await redis_client.delete(failed_key)

            # Create token
            access_token, expires_at = create_access_token(
                data={
                    "sub": user_id,
                    "email": user_record["email"],
                    "role": user_record["role"],
                }
            )

            return Token(
                access_token=access_token, user_id=user_id, expires_at=expires_at
            )

        raise HTTPException(
            status_code=500, detail="Authentication service unavailable"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed") from e


@app.post("/api/auth/telegram", response_model=Token)
@limiter.limit("3/minute")
async def login_telegram(request: Request, auth_data: dict[str, Any]):
    """Authenticate CEO via Telegram Login Widget"""
    try:
        # Get bot token from environment
        bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        if not bot_token:
            logger.error("TELEGRAM_BOT_TOKEN not configured in backend")
            raise HTTPException(status_code=500, detail="Telegram auth not configured")

        # Verify Telegram data
        if not verify_telegram_auth(auth_data, bot_token):
            raise HTTPException(
                status_code=401, detail="Invalid Telegram authentication"
            )

        # In a real system, you'd find or create the user in your DB based on Telegram ID
        # For TAURUS AI, we'll map the Telegram ID to the CEO/Admin account
        telegram_id = str(auth_data.get("id"))

        # Security: Only allowlisted Telegram IDs can get admin access
        admin_telegram_ids = [
            tid.strip()
            for tid in os.getenv("ADMIN_TELEGRAM_IDS", "").split(",")
            if tid.strip()
        ]
        is_admin = telegram_id in admin_telegram_ids

        email = f"ceo_{telegram_id}@taurusai.io"  # Virtual email for CEO

        # Check if CEO exists in Redis, otherwise create
        user_id = None
        if redis_client:
            user_id = await redis_client.get(f"user:telegram:{telegram_id}")

            if not user_id:
                # First time login - create profile (admin only if allowlisted)
                user_id = str(uuid.uuid4())
                user_record = {
                    "id": user_id,
                    "telegram_id": telegram_id,
                    "email": email,
                    "full_name": auth_data.get("first_name", "Taurus CEO"),
                    "role": UserRole.ADMIN if is_admin else UserRole.USER,
                    "business_vertical": BusinessVertical.GENERAL,
                    "created_at": datetime.now().isoformat(),
                    "is_active": True,
                }
                await redis_client.setex(
                    f"user:{user_id}", 86400 * 30, json.dumps(user_record)
                )
                await redis_client.setex(
                    f"user:telegram:{telegram_id}", 86400 * 30, user_id
                )
            else:
                # Load existing record
                user_data = await redis_client.get(f"user:{user_id}")
                user_record = json.loads(user_data)

        # Create token
        access_token, expires_at = create_access_token(
            data={
                "sub": user_id,
                "email": email,
                "role": UserRole.ADMIN if is_admin else UserRole.USER,
            }
        )

        logger.info(f"🛡️ CEO authenticated via Telegram: {auth_data.get('first_name')}")

        return Token(access_token=access_token, user_id=user_id, expires_at=expires_at)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Telegram Login error: {e}")
        raise HTTPException(status_code=500, detail="Telegram Login failed") from e


# Agent Management Routes


@app.get("/api/agents")
async def list_agents(user_id: str = Depends(verify_token)):
    """List all available agents"""
    return {
        "agents": [
            {
                "name": name,
                "description": agent.description
                if hasattr(agent, "description")
                else f"{name} agent",
                "status": "active",
                "last_updated": datetime.now().isoformat(),
            }
            for name, agent in agent_instances.items()
        ]
    }


@app.post("/api/agents/{agent_name}/task")
@limiter.limit("10/minute")
async def create_agent_task(
    request: Request,
    agent_name: str,
    task: AgentTask,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(verify_token),
):
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
            "scheduled_for": task.scheduled_for.isoformat()
            if task.scheduled_for
            else None,
        }

        # Store task
        if redis_client:
            await redis_client.setex(f"task:{task_id}", 86400, json.dumps(task_data))

        # Schedule task execution
        background_tasks.add_task(execute_agent_task, agent_name, task_data)

        return {
            "task_id": task_id,
            "status": "created",
            "message": f"Task created for {agent_name} agent",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Task creation error: {e}")
        raise HTTPException(status_code=500, detail="Task creation failed") from e


async def execute_agent_task(agent_name: str, task_data: dict[str, Any]):
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
        # NOTE: routing below branches on agent_name/hasattr only, never on
        # task_type — a caller-supplied task_type is accepted by the API but
        # has no effect on dispatch. Logging it here at least makes the gap
        # observable; the real fix (branch on task_type per agent) is
        # unfinished wiring, not addressed by this lint pass.
        logger.info(f"Task {task_id} requested task_type={task_type!r} for agent {agent_name}")

        # Route to appropriate agent method based on task type
        if agent_name == "intelligence_research" and hasattr(agent, "research_topic"):
            result = await agent.research_topic(
                parameters.get("topic", "AI automation trends")
            )
        elif agent_name == "content_social_strategy" and hasattr(
            agent, "create_case_study"
        ):
            result = await agent.create_case_study(
                parameters.get("vertical", "ecommerce"), parameters.get("data", {})
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
    """Get task status and results — with ownership check (IDOR prevention)"""
    try:
        if redis_client:
            task_data = await redis_client.get(f"task:{task_id}")
            if not task_data:
                raise HTTPException(status_code=404, detail="Task not found")

            task = json.loads(task_data)

            # IDOR prevention: verify task ownership
            if task.get("created_by") != user_id:
                raise HTTPException(
                    status_code=403, detail="Access denied: you do not own this task"
                )

            return task

        raise HTTPException(status_code=500, detail="Task service unavailable")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Task status error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get task status") from e


# Campaign Management Routes


@app.post("/api/campaigns")
@limiter.limit("5/minute")
async def create_campaign(
    request: Request, campaign: CampaignCreate, user_id: str = Depends(verify_token)
):
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
            "performance_metrics": {},
        }

        # Store campaign
        if redis_client:
            await redis_client.setex(
                f"campaign:{campaign_id}", 86400 * 30, json.dumps(campaign_data)
            )

            # Add to user's campaigns
            user_campaigns = await redis_client.get(f"user_campaigns:{user_id}")
            campaigns = json.loads(user_campaigns) if user_campaigns else []
            campaigns.append(campaign_id)
            await redis_client.setex(
                f"user_campaigns:{user_id}", 86400 * 30, json.dumps(campaigns)
            )

        return {
            "campaign_id": campaign_id,
            "status": "created",
            "message": "Campaign created successfully",
        }

    except Exception as e:
        logger.error(f"Campaign creation error: {e}")
        raise HTTPException(status_code=500, detail="Campaign creation failed") from e


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
        raise HTTPException(status_code=500, detail="Failed to list campaigns") from e


# WebSocket Routes


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket connection for real-time updates — JWT authenticated"""
    try:
        # Extract token from query parameter
        token = websocket.query_params.get("token")
        if not token:
            await websocket.close(code=4001, reason="Missing authentication token")
            return

        # Verify JWT — routed through auth.verify_token_string() so this
        # endpoint enforces the exact same type-claim / legacy-window rules
        # as the 9 REST endpoints on Depends(verify_token), instead of
        # decoding the token directly and bypassing the type check (the
        # divergence documented in
        # docs/plans/2026-08-10-w1-auth-token-shadowing.md §2.5 / §3 item 4).
        try:
            user_id = verify_token_string(token)
        except HTTPException:
            await websocket.close(code=4001, reason="Invalid authentication token")
            return

        await manager.connect(websocket, user_id)

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
                    "timestamp": datetime.now().isoformat(),
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
                "performance_summary": {},
            },
        }

        if redis_client:
            # Get user campaigns count
            user_campaigns = await redis_client.get(f"user_campaigns:{user_id}")
            if user_campaigns:
                dashboard_data["metrics"]["active_campaigns"] = len(
                    json.loads(user_campaigns)
                )

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
                    if task.get("created_by") == user_id and task.get("status") in [
                        "pending",
                        "running",
                    ]:
                        pending_tasks += 1

            dashboard_data["metrics"]["pending_tasks"] = pending_tasks

        return dashboard_data

    except Exception as e:
        logger.error(f"Dashboard error: {e}")
        raise HTTPException(status_code=500, detail="Dashboard data unavailable") from e


# ─── Knowledge / Vector Search Routes (turbovec-powered RAG) ───


class IngestRequest(PydanticBaseModel):
    """Request body for /api/knowledge/ingest."""
    documents: list[dict[str, Any]]  # [{"text": "...", "metadata": {...}}, ...]


class SearchRequest(PydanticBaseModel):
    """Request body for /api/knowledge/search."""
    query: str
    k: int = 10
    allowlist: list[int] | None = None


@app.post("/api/knowledge/ingest")
async def ingest_documents(
    request: IngestRequest,
    user_id: str = Depends(verify_token),
):
    """
    Ingest text documents into the vector store for semantic search.
    Documents are embedded via OpenAI and stored in the turbovec index.

    Requires authentication. Each document: {"text": "...", "metadata": {...}}
    """
    try:
        if not request.documents:
            raise HTTPException(status_code=400, detail="No documents provided")

        ids = vector_store.ingest_documents(request.documents)
        return {
            "status": "success",
            "ingested": len(ids),
            "ids": ids,
            "total_documents": vector_store.size,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Knowledge ingest error: {e}")
        raise HTTPException(status_code=500, detail="Ingest failed") from e


@app.post("/api/knowledge/search")
async def search_knowledge(
    request: SearchRequest,
    user_id: str = Depends(verify_token),
):
    """
    Semantic search over the knowledge base using turbovec.

    Returns top-k matching documents with relevance scores.
    Optional allowlist restricts search to specific document ids.
    """
    try:
        if not request.query:
            raise HTTPException(status_code=400, detail="Query is required")

        results = vector_store.search(
            query=request.query,
            k=request.k,
            allowlist=request.allowlist,
        )
        return {
            "status": "success",
            "query": request.query,
            "results": [
                {
                    "id": r.id,
                    "score": r.score,
                    "text": r.text,
                    "metadata": r.metadata,
                }
                for r in results
            ],
            "total": len(results),
            "index_size": vector_store.size,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Knowledge search error: {e}")
        raise HTTPException(status_code=500, detail="Search failed") from e


@app.get("/api/knowledge/status")
async def knowledge_status(user_id: str = Depends(verify_token)):
    """Get vector store status — size, dimension, bit width."""
    return {
        "status": "ready" if vector_store.is_ready else "empty",
        "dim": vector_store.dim,
        "bit_width": vector_store.bit_width,
        "size": vector_store.size,
        "documents": len(vector_store._documents),
    }


# Error Handlers


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler — no stack traces exposed"""
    # Structured security event logging
    logger.error(
        "unhandled_exception",
        error=str(exc),
        path=request.url.path,
        method=request.method,
        ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        timestamp=datetime.utcnow().isoformat(),
    )
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "timestamp": datetime.now().isoformat(),
        },
    )


# Security Event Logging Helper


async def log_security_event(event_type: str, user_id: str, details: dict):
    """Log security events for audit trail and anomaly detection"""
    logger.info(
        "security_event",
        event_type=event_type,
        user_id=user_id,
        ip=details.get("ip"),
        user_agent=details.get("user_agent"),
        timestamp=datetime.utcnow().isoformat(),
        **details,
    )


# Anomaly Detection Thresholds
ALERT_THRESHOLDS = {
    "failed_logins_per_minute": 10,
    "new_admin_accounts_per_hour": 3,
    "api_errors_per_minute": 100,
}


async def check_anomaly(metric: str, value: int):
    """Check if a metric exceeds anomaly threshold"""
    threshold = ALERT_THRESHOLDS.get(metric, float("inf"))
    if value > threshold:
        logger.warning(
            "security_anomaly",
            metric=metric,
            value=value,
            threshold=threshold,
            timestamp=datetime.utcnow().isoformat(),
        )


if __name__ == "__main__":
    # Dev-only standalone entrypoint — the Docker/production CMD invokes
    # `uvicorn`/`gunicorn` directly against `main:app` (see backend/Dockerfile),
    # never `python main.py`, so this block never runs in production. Default
    # to loopback; set HOST=0.0.0.0 explicitly only for containerized local/dev
    # use, matching the same pattern applied to the agents/specialized/*/agent.py
    # dev entrypoints.
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "127.0.0.1"),
        port=8000,
        reload=True,
        log_level="info",
    )
