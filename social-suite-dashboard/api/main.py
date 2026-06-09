from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import os

# --- Config ---
SECRET_KEY = os.getenv("JWT_SECRET", "default-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- Models ---

class User(BaseModel):
    id: int
    email: str
    role: str  # admin, employee

class BusinessProfile(BaseModel):
    id: int
    user_id: int
    name: str
    industry: str
    timezone: str
    ig_account_id: Optional[str] = None
    fb_page_id: Optional[str] = None
    google_ads_customer_id: Optional[str] = None

class Campaign(BaseModel):
    id: int
    business_profile_id: int
    name: str
    objective: str  # lead_gen, sales, engagement
    platform: str   # meta, google, instagram
    status: str     # draft, active, paused, completed
    start_date: datetime
    end_date: datetime
    budget_daily: float
    budget_total: float
    targeting_json: dict
    creatives_json: List[int]  # asset IDs
    created_at: datetime
    updated_at: datetime

class Asset(BaseModel):
    id: int
    business_profile_id: int
    type: str  # image, video, copy
    file_path: str
    meta_data: dict
    tags: List[str]
    created_at: datetime

# --- Auth ---

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock user db
fake_users_db = {
    "employee1@taurusai.corp": {
        "id": 1,
        "email": "employee1@taurusai.corp",
        "role": "employee",
        "hashed_password": pwd_context.hash("employee123"),
    }
}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(email: str):
    if email in fake_users_db:
        user_dict = fake_users_db[email]
        return User(**user_dict)

def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- App ---

app = FastAPI(title="Social Suite Dashboard API", version="0.1.0")

@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Campaigns ---

# In-memory storage for demo
campaigns_db = []

@app.get("/api/campaigns", response_model=List[Campaign])
async def list_campaigns(platform: Optional[str] = None, status: Optional[str] = None):
    # Filter by platform/status if provided
    result = campaigns_db
    if platform:
        result = [c for c in result if c.platform == platform]
    if status:
        result = [c for c in result if c.status == status]
    return result

@app.post("/api/campaigns", response_model=Campaign)
async def create_campaign(campaign: Campaign):
    campaign.id = len(campaigns_db) + 1
    campaign.created_at = datetime.utcnow()
    campaign.updated_at = datetime.utcnow()
    campaigns_db.append(campaign)
    return campaign

@app.get("/api/campaigns/{id}", response_model=Campaign)
async def get_campaign(id: int):
    for c in campaigns_db:
        if c.id == id:
            return c
    raise HTTPException(status_code=404, detail="Campaign not found")

@app.patch("/api/campaigns/{id}", response_model=Campaign)
async def update_campaign(id: int, updates: dict):
    for c in campaigns_db:
        if c.id == id:
            for key, value in updates.items():
                if hasattr(c, key):
                    setattr(c, key, value)
            c.updated_at = datetime.utcnow()
            return c
    raise HTTPException(status_code=404, detail="Campaign not found")

@app.post("/api/campaigns/{id}/pause")
async def pause_campaign(id: int):
    for c in campaigns_db:
        if c.id == id:
            c.status = "paused"
            c.updated_at = datetime.utcnow()
            return {"message": f"Campaign {id} paused"}
    raise HTTPException(status_code=404, detail="Campaign not found")

@app.post("/api/campaigns/{id}/resume")
async def resume_campaign(id: int):
    for c in campaigns_db:
        if c.id == id:
            c.status = "active"
            c.updated_at = datetime.utcnow()
            return {"message": f"Campaign {id} resumed"}
    raise HTTPException(status_code=404, detail="Campaign not found")

# --- Assets ---

assets_db = []

@app.get("/api/assets", response_model=List[Asset])
async def list_assets(skip: int = 0, limit: int = 10):
    return assets_db[skip : skip + limit]

@app.post("/api/assets", response_model=Asset)
async def upload_asset(asset: Asset):
    asset.id = len(assets_db) + 1
    asset.created_at = datetime.utcnow()
    assets_db.append(asset)
    return asset

# --- NLP Engine ---
# Enhanced NLP Engine
from enhanced_nlp_engine import interpret_command as nlp_interpret
# Legacy NLP Engine (kept for reference)
# from nlp_engine import interpret_command as nlp_interpret_legacy

# --- NLP ---

class NLPRequest(BaseModel):
    text: str

class NLPResponse(BaseModel):
    intent: str
    entities: dict
    suggested_action: dict

@app.post("/api/nlp/interpret", response_model=NLPResponse)
async def interpret_command_api(request: NLPRequest):
    # Use the NLP engine stub
    result = nlp_interpret(request.text)
    return NLPResponse(**result)

# --- Healthcheck ---



# --- Meta Campaign Endpoints ---

@app.post("/api/nexus/meta-campaigns", response_model=Campaign)
async def create_meta_campaign(campaign: Campaign):
    campaign.id = len(campaigns_db) + 1
    campaign.created_at = datetime.utcnow()
    campaign.updated_at = datetime.utcnow()
    campaigns_db.append(campaign)
    return campaign

@app.get("/api/nexus/meta-campaigns", response_model=List[Campaign])
async def list_meta_campaigns():
    return [c for c in campaigns_db if c.platform == "meta"]

# --- Instagram Campaign Endpoints ---

@app.post("/api/nexus/instagram-campaigns", response_model=Campaign)
async def create_instagram_campaign(campaign: Campaign):
    campaign.id = len(campaigns_db) + 1
    campaign.created_at = datetime.utcnow()
    campaign.updated_at = datetime.utcnow()
    campaigns_db.append(campaign)
    return campaign

@app.get("/api/nexus/instagram-campaigns", response_model=List[Campaign])
async def list_instagram_campaigns():
    return [c for c in campaigns_db if c.platform == "instagram"]

# --- Agent Orchestration Endpoint ---

@app.post("/api/agents/orchestrate")
async def orchestrate_agent(agent_request: dict):
    """
    Orchestrate Nexus agents based on NLP interpretation
    In production, this would connect to actual agent systems like Agentuity
    """
    platform = agent_request.get("platform", "nexus")
    agent_type = agent_request.get("agent_type", "orchestrator")
    task_description = agent_request.get("task_description", "")
    priority = agent_request.get("priority", "medium")
    
    # Mock response - in production this would trigger actual agents
    result = {
        "status": "orchestration_started",
        "platform": platform,
        "agent_type": agent_type,
        "task": task_description,
        "priority": priority,
        "timestamp": datetime.utcnow().isoformat(),
        "message": f"{platform.title()} {agent_type} agent orchestrated for: {task_description}"
    }
    
    return result

@app.get("/")
def read_root():
    return {"message": "Social Suite Dashboard API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)