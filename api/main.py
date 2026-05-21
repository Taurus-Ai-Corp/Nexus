# Nexus Social Suite Dashboard API
# TAURUS AI CORP - FZCO | Three-Tier AI Routing | PostgreSQL + pgvector
# Version: 3.2.0 — MFA + WhatsApp/Telegram + Security Hardened

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
import jwt
from passlib.context import CryptContext
import pyotp
import qrcode
import base64
import io
import os
import httpx
import json
import logging
import secrets
import time
from collections import defaultdict

from database import db
from routing_engine import router, AIRoutingError
from enhanced_nlp_engine import interpret_command as nlp_interpret

# ── Config ──
SECRET_KEY = os.getenv("JWT_SECRET", "nexus_jwt_secret_change_in_production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_DAYS", "7"))
ENV = os.getenv("ENV", "development")

BIZFLOW_API_URL = os.getenv("BIZFLOW_API_URL", "http://bizflow-backend:4000")
BIZFLOW_API_KEY = os.getenv("BIZFLOW_API_KEY", "")
NEOVIBE_API_URL = os.getenv("NEOVIBE_API_URL", "http://neovibe-core:3001")
NEOVIBE_API_KEY = os.getenv("NEOVIBE_API_KEY", "")
META_APP_ID = os.getenv("META_APP_ID", "")
META_APP_SECRET = os.getenv("META_APP_SECRET", "")
IG_ACCESS_TOKEN = os.getenv("IG_ACCESS_TOKEN", "")
IG_BUSINESS_ACCOUNT_ID = os.getenv("IG_BUSINESS_ACCOUNT_ID", "")
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN", "")
WHATSAPP_PHONE_ID = os.getenv("WHATSAPP_PHONE_ID", "")
WHATSAPP_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "nexus_wa_webhook")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,https://nexus-social.vercel.app").split(",") if o.strip()]

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO").upper())
logger = logging.getLogger(__name__)

# ── Rate Limiter (in-memory sliding window) ──
class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: dict = defaultdict(list)

    def is_allowed(self, key: str) -> bool:
        now = time.time()
        self.requests[key] = [t for t in self.requests[key] if now - t < self.window_seconds]
        if len(self.requests[key]) >= self.max_requests:
            return False
        self.requests[key].append(now)
        return True

login_limiter = RateLimiter(max_requests=5, window_seconds=60)
register_limiter = RateLimiter(max_requests=3, window_seconds=300)

# ── Pydantic Models ──
class User(BaseModel):
    id: int
    email: str
    role: str
    mfa_enabled: bool = False

class Campaign(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    name: str
    objective: str = ""
    platform: str = ""
    status: str = "draft"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget_daily: float = 0.0
    budget_total: float = 0.0
    targeting_json: dict = {}
    creatives_json: list = []

class Asset(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    campaign_id: Optional[int] = None
    type: str = ""
    file_path: str = ""
    meta_data: dict = {}
    tags: list = []

class NLPRequest(BaseModel):
    text: str

class AIRouteRequest(BaseModel):
    task_type: str
    prompt: str
    system_prompt: str = ""
    max_tokens: int = 1024
    temperature: float = 0.7

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str

class MFASetupResponse(BaseModel):
    totp_uri: str
    secret: str
    qr_code_base64: str

class MFAVerifyRequest(BaseModel):
    code: str

class MFAEnableRequest(BaseModel):
    code: str

class LoginMFARequest(BaseModel):
    email: str
    password: str
    mfa_code: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class CheckoutRequest(BaseModel):
    price_id: Optional[str] = None

# ── Auth ──
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {**data, "exp": expire, "type": "refresh"}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") == "refresh":
            raise credentials_exception
        email = payload.get("sub")
        if not email:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = await db.get_user_by_email(email)
    if not user:
        raise credentials_exception
    return User(id=user["id"], email=user["email"], role=user["role"], mfa_enabled=user.get("mfa_enabled", False))

async def get_client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"

# ── App ──
async def _run_migrations():
    import pathlib
    migrations_dir = pathlib.Path(__file__).parent / "migrations"
    if not migrations_dir.exists():
        logger.warning("No migrations directory found, skipping auto-migration")
        return
    migration_files = sorted(migrations_dir.glob("*.sql"))
    for mf in migration_files:
        try:
            sql = mf.read_text()
            await db.execute(sql)
            logger.info(f"Applied migration: {mf.name}")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                logger.info(f"Migration {mf.name} already applied (tables exist)")
            else:
                logger.error(f"Failed to apply migration {mf.name}: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.init()
    await _run_migrations()
    if not await db.get_user_by_email("employee@taurusai.io"):
        await db.create_user("employee@taurusai.io", pwd_context.hash("employee123"), "employee")
    if not await db.get_user_by_email("admin@taurusai.io"):
        await db.create_user("admin@taurusai.io", pwd_context.hash("admin123"), "admin")
    logger.info("Nexus API v3.0.0 started — PostgreSQL + migrations + rate limiting")
    yield
    await db.close()

app = FastAPI(
    title="Nexus Social Suite Dashboard API",
    version="3.2.0",
    lifespan=lifespan,
    docs_url="/docs" if ENV == "development" else None,
    redoc_url="/redoc" if ENV == "development" else None,
    openapi_url="/openapi.json" if ENV == "development" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["X-Request-Id"],
    max_age=600,
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
    return response

# ── Health (public) ──
@app.get("/")
def root():
    return {"message": "Nexus Social Suite Dashboard API — TAURUS AI CORP - FZCO", "version": "3.2.0"}

@app.get("/health")
async def health():
    services = {}
    try:
        await db.fetch("SELECT 1")
        services["postgres"] = "healthy"
    except Exception:
        services["postgres"] = "unhealthy"
    services["ollama"] = "configured" if os.getenv("OLLAMA_BASE_URL") else "not_configured"
    services["openrouter"] = "configured" if os.getenv("OPENROUTER_API_KEY") else "not_configured"
    services["huggingface"] = "configured" if os.getenv("HUGGINGFACE_API_KEY") else "not_configured"
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat(), "services": services}

@app.get("/health/models")
async def model_health():
    tiers = {}
    try:
        async with httpx.AsyncClient(timeout=5.0) as c:
            r = await c.get(f"{os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')}/api/tags")
            tiers["ollama"] = {"status": "healthy", "models": [m["name"] for m in r.json().get("models", [])]}
    except Exception as e:
        tiers["ollama"] = {"status": "unhealthy", "error": str(e)}
    try:
        async with httpx.AsyncClient(timeout=5.0) as c:
            r = await c.get("https://openrouter.ai/api/v1/key", headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY', '')}"})
            tiers["openrouter"] = {"status": "healthy" if r.status_code == 200 else "unhealthy"}
    except Exception as e:
        tiers["openrouter"] = {"status": "unhealthy", "error": str(e)}
    try:
        async with httpx.AsyncClient(timeout=5.0) as c:
            r = await c.get("https://huggingface.co/api/whoami-v2", headers={"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY', '')}"})
            tiers["huggingface"] = {"status": "healthy" if r.status_code == 200 else "unhealthy"}
    except Exception as e:
        tiers["huggingface"] = {"status": "unhealthy", "error": str(e)}
    return tiers

@app.get("/health/ai/routes")
async def ai_routes():
    return {"available_models": router.get_available_models(), "routing_table": {k: list(v.keys()) for k, v in router.ROUTING_TABLE.items()}}

# ── Auth ──
@app.post("/api/auth/login")
async def login(req: LoginRequest, request: Request):
    ip = await get_client_ip(request)
    if not login_limiter.is_allowed(f"login:{ip}"):
        raise HTTPException(status_code=429, detail="Too many login attempts. Try again in 60 seconds.")
    user = await db.get_user_by_email(req.email)
    if not user or not pwd_context.verify(req.password, user["hashed_password"]):
        logger.warning(f"Failed login attempt for {req.email} from {ip}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # MFA check
    if user.get("mfa_enabled") and user.get("totp_secret"):
        if not req.mfa_code:
            return {"mfa_required": True, "email": user["email"], "message": "MFA code required"}
        totp = pyotp.TOTP(user["totp_secret"])
        if not totp.verify(req.mfa_code):
            logger.warning(f"Invalid MFA code for {user['email']} from {ip}")
            raise HTTPException(status_code=401, detail="Invalid MFA code")
    access = create_access_token({"sub": user["email"], "role": user["role"]})
    refresh = create_refresh_token({"sub": user["email"]})
    logger.info(f"Successful login: {user['email']} from {ip}")
    return TokenResponse(access_token=access, refresh_token=refresh, user={"id": user["id"], "email": user["email"], "role": user["role"], "mfa_enabled": user.get("mfa_enabled", False)})

@app.post("/api/auth/register")
async def register(req: RegisterRequest, request: Request):
    ip = await get_client_ip(request)
    if not register_limiter.is_allowed(f"register:{ip}"):
        raise HTTPException(status_code=429, detail="Too many registration attempts. Try again in 5 minutes.")
    existing = await db.get_user_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    # SECURITY: Always assign "employee" role — never trust client-supplied role
    user = await db.create_user(req.email, pwd_context.hash(req.password), "employee")
    access = create_access_token({"sub": user["email"], "role": user["role"]})
    refresh = create_refresh_token({"sub": user["email"]})
    logger.info(f"New user registered: {user['email']} from {ip}")
    return TokenResponse(access_token=access, refresh_token=refresh, user={"id": user["id"], "email": user["email"], "role": user["role"]})

@app.post("/api/auth/refresh")
async def refresh_token_endpoint(refresh: str):
    try:
        payload = jwt.decode(refresh, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        email = payload.get("sub")
        user = await db.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token({"sub": user["email"], "role": user["role"]})
        return {"access_token": access, "token_type": "bearer"}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@app.get("/api/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "role": user.role}

# ── MFA (TOTP) ──
@app.get("/api/auth/mfa/status")
async def mfa_status(user: User = Depends(get_current_user)):
    db_user = await db.get_user_by_email(user.email)
    return {"mfa_enabled": db_user.get("mfa_enabled", False) if db_user else False}

@app.post("/api/auth/mfa/setup")
async def mfa_setup(user: User = Depends(get_current_user)):
    """Generate TOTP secret and QR code for MFA setup"""
    db_user = await db.get_user_by_email(user.email)
    if not db_user:
        raise HTTPException(404, "User not found")
    if db_user.get("mfa_enabled"):
        raise HTTPException(400, "MFA already enabled. Disable first to re-setup.")
    # Generate TOTP secret
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    # Create URI for authenticator apps
    issuer = "Nexus"
    totp_uri = totp.provisioning_uri(name=user.email, issuer_name=issuer)
    # Generate QR code as base64 PNG
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(totp_uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_base64 = base64.b64encode(buf.getvalue()).decode()
    # Store secret temporarily (not enabled yet)
    await db.execute("UPDATE users SET totp_secret = $1 WHERE id = $2", secret, user.id)
    return {"totp_uri": totp_uri, "secret": secret, "qr_code_base64": qr_base64, "message": "Scan QR code with your authenticator app, then verify with /api/auth/mfa/enable"}

@app.post("/api/auth/mfa/enable")
async def mfa_enable(req: MFAEnableRequest, user: User = Depends(get_current_user)):
    """Verify TOTP code and enable MFA"""
    db_user = await db.get_user_by_email(user.email)
    if not db_user or not db_user.get("totp_secret"):
        raise HTTPException(400, "MFA not set up. Call /api/auth/mfa/setup first.")
    if db_user.get("mfa_enabled"):
        raise HTTPException(400, "MFA already enabled.")
    totp = pyotp.TOTP(db_user["totp_secret"])
    if not totp.verify(req.code):
        raise HTTPException(401, "Invalid TOTP code")
    await db.execute("UPDATE users SET mfa_enabled = TRUE WHERE id = $1", user.id)
    logger.info(f"MFA enabled for {user.email}")
    return {"mfa_enabled": True, "message": "MFA enabled successfully"}

@app.post("/api/auth/mfa/disable")
async def mfa_disable(req: MFAVerifyRequest, user: User = Depends(get_current_user)):
    """Disable MFA (requires current TOTP code)"""
    db_user = await db.get_user_by_email(user.email)
    if not db_user or not db_user.get("mfa_enabled"):
        raise HTTPException(400, "MFA is not enabled.")
    totp = pyotp.TOTP(db_user["totp_secret"])
    if not totp.verify(req.code):
        raise HTTPException(401, "Invalid TOTP code")
    await db.execute("UPDATE users SET mfa_enabled = FALSE, totp_secret = NULL WHERE id = $1", user.id)
    logger.info(f"MFA disabled for {user.email}")
    return {"mfa_enabled": False, "message": "MFA disabled successfully"}

from fastapi.responses import RedirectResponse, HTMLResponse

@app.get("/api/auth/meta/authorize")
async def meta_authorize(user: User = Depends(get_current_user)):
    redirect_uri = os.getenv("META_OAUTH_REDIRECT_URI", "https://api-beryl-three-25.vercel.app/api/auth/meta/callback")
    frontend_url = os.getenv("FRONTEND_URL", "https://nexus-social.vercel.app")
    state = secrets.token_urlsafe(16)
    auth_url = f"https://www.facebook.com/v18.0/dialog/oauth?client_id={META_APP_ID}&redirect_uri={redirect_uri}&scope=ads_management,instagram_content_publish,instagram_manage_insights,pages_show_list,pages_manage_posts&state={state}&response_type=code"
    return RedirectResponse(url=auth_url)

# ── Campaigns (auth required) ──
@app.get("/api/campaigns")
async def list_campaigns(platform: Optional[str] = None, status: Optional[str] = None, user: User = Depends(get_current_user)):
    return await db.get_campaigns(platform=platform, status=status)

@app.post("/api/campaigns")
async def create_campaign(campaign: Campaign, user: User = Depends(get_current_user)):
    data = campaign.model_dump()
    data["user_id"] = user.id
    data["start_date"] = data.get("start_date") or datetime.utcnow()
    data["end_date"] = data.get("end_date") or (datetime.utcnow() + timedelta(days=30))
    return await db.create_campaign(data)

@app.get("/api/campaigns/{cid}")
async def get_campaign(cid: int, user: User = Depends(get_current_user)):
    result = await db.get_campaign_by_id(cid)
    if not result:
        raise HTTPException(404, "Campaign not found")
    return result

@app.patch("/api/campaigns/{cid}")
async def update_campaign(cid: int, updates: dict, user: User = Depends(get_current_user)):
    result = await db.update_campaign(cid, updates)
    if not result:
        raise HTTPException(404, "Campaign not found")
    return result

@app.post("/api/campaigns/{cid}/pause")
async def pause_campaign(cid: int, user: User = Depends(get_current_user)):
    result = await db.update_campaign(cid, {"status": "paused"})
    if not result:
        raise HTTPException(404, "Campaign not found")
    return result

@app.post("/api/campaigns/{cid}/resume")
async def resume_campaign(cid: int, user: User = Depends(get_current_user)):
    result = await db.update_campaign(cid, {"status": "active"})
    if not result:
        raise HTTPException(404, "Campaign not found")
    return result

@app.delete("/api/campaigns/{cid}")
async def delete_campaign(cid: int, user: User = Depends(get_current_user)):
    result = await db.fetch("DELETE FROM campaigns WHERE id = $1 RETURNING *", cid)
    if not result:
        raise HTTPException(404, "Campaign not found")
    return {"deleted": True, "id": cid}

# ── Assets (auth required) ──
@app.get("/api/assets")
async def list_assets(skip: int = 0, limit: int = 10, user: User = Depends(get_current_user)):
    return await db.get_assets(skip=skip, limit=limit)

@app.post("/api/assets")
async def create_asset(asset: Asset, user: User = Depends(get_current_user)):
    data = asset.model_dump()
    data["user_id"] = user.id
    return await db.create_asset(data)

# ── NLP — Three-Tier AI Routing (auth required) ──

@app.post("/api/nlp/debug")
async def debug_nlp(user: User = Depends(get_current_user)):
    """Debug endpoint to test LLM call directly"""
    import traceback
    try:
        from multi_model_router import MultiModelRouter
        
        mr = MultiModelRouter()
        models = mr.get_available_models()
        available = [m for m in models if m.get("available")]
        
        # Test direct LLM call
        messages = [
            {'role': 'system', 'content': 'Respond with only JSON: {"test": true}' },
            {"role": "user", "content": "Test"},
        ]
        llm_result = await mr.generate_text(
            model="google/gemini-2.5-flash:free",
            messages=messages,
            temperature=0.1,
            max_tokens=50,
        )
        
        # Now test full NLP engine step by step
        from llm_nlp_engine import LLMNLPInterpreter, NLP_SYSTEM_PROMPT
        nlp = LLMNLPInterpreter(router=mr, default_model="google/gemini-2.5-flash:free")
        
        # Test direct LLM call with NLP prompt
        messages = [
            {"role": "system", "content": NLP_SYSTEM_PROMPT[:500]},
            {"role": "user", "content": "Command: Create an Instagram ad for a luxury spa"},
        ]
        raw_result = await mr.generate_text(
            model="google/gemini-2.5-flash:free",
            messages=messages,
            temperature=0.1,
            max_tokens=2048,
        )
        
        # Try to parse JSON
        raw_content = raw_result.get("content", "")
        try:
            parsed = json.loads(raw_content)
            parse_status = "success"
        except json.JSONDecodeError as e:
            parsed = None
            parse_status = f"failed: {str(e)}"
        
        return {
            "status": "success",
            "available_models": len(available),
            "raw_llm_content": raw_content[:500],
            "parse_status": parse_status,
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "type": type(e).__name__,
            "traceback": traceback.format_exc()[:1000],
        }

@app.post("/api/nlp/interpret")
async def interpret_command(req: NLPRequest, user: User = Depends(get_current_user)):
    """LLM-powered NLP interpretation with multi-model support"""
    import time
    from multi_model_router import MultiModelRouter
    from llm_nlp_engine import LLMNLPInterpreter
    
    mr = MultiModelRouter()
    model = "google/gemini-2.5-flash:free"  # Free tier model
    nlp = LLMNLPInterpreter(router=mr, default_model=model)
    
    start = time.time()
    result = await nlp.interpret_command(req.text, model=model)
    elapsed = int((time.time() - start) * 1000)
    
    return {**result, "processing_time_ms": elapsed}

@app.post("/api/nlp/iterate")
async def nlp_iterate(req: NLPRequest, user: User = Depends(get_current_user)):
    try:
        result = await router.route("nlp_iterate", req.text, system_prompt="You are an NLP interpreter for a social media management dashboard. Parse natural language commands into structured JSON with intent, entities, and suggested_action fields.")
        return result
    except AIRoutingError as e:
        return {"error": str(e), "fallback": nlp_interpret(req.text)}

@app.post("/api/ai/route")
async def ai_route(req: AIRouteRequest, user: User = Depends(get_current_user)):
    try:
        result = await router.route(req.task_type, req.prompt, req.system_prompt, max_tokens=req.max_tokens, temperature=req.temperature)
        return result
    except AIRoutingError as e:
        raise HTTPException(502, str(e))

@app.post("/api/ai/generate-content")
async def generate_content(req: AIRouteRequest, user: User = Depends(get_current_user)):
    try:
        result = await router.route("content_generation", req.prompt, req.system_prompt or "Write engaging social media content.", max_tokens=req.max_tokens, temperature=req.temperature)
        return result
    except AIRoutingError as e:
        raise HTTPException(502, str(e))

@app.post("/api/ai/embed")
async def embed_texts(texts: List[str], user: User = Depends(get_current_user)):
    try:
        result = await router.route("embeddings", json.dumps(texts))
        return result
    except AIRoutingError as e:
        raise HTTPException(502, str(e))

# ── Meta Business Suite (auth required) ──
@app.get("/api/meta/accounts")
async def get_meta_accounts(user: User = Depends(get_current_user)):
    if not IG_ACCESS_TOKEN:
        return {"error": "IG_ACCESS_TOKEN not configured"}
    async with httpx.AsyncClient() as c:
        r = await c.get("https://graph.facebook.com/v18.0/me/accounts", params={"access_token": IG_ACCESS_TOKEN})
        return r.json()

@app.post("/api/meta/instagram/publish")
async def publish_instagram(caption: str, media_url: str, media_type: str = "IMAGE", user: User = Depends(get_current_user)):
    if not IG_ACCESS_TOKEN or not IG_BUSINESS_ACCOUNT_ID:
        raise HTTPException(400, "IG credentials not configured")
    async with httpx.AsyncClient() as c:
        create_r = await c.post(f"https://graph.facebook.com/v18.0/{IG_BUSINESS_ACCOUNT_ID}/media", params={"image_url": media_url if media_type == "IMAGE" else None, "video_url": media_url if media_type == "VIDEO" else None, "caption": caption, "media_type": media_type, "access_token": IG_ACCESS_TOKEN})
        if create_r.status_code != 200:
            return {"error": "Failed to create container", "details": create_r.json()}
        creation_id = create_r.json().get("id")
        publish_r = await c.post(f"https://graph.facebook.com/v18.0/{IG_BUSINESS_ACCOUNT_ID}/media_publish", params={"creation_id": creation_id, "access_token": IG_ACCESS_TOKEN})
        return publish_r.json()

@app.get("/api/meta/instagram/insights")
async def get_ig_insights(metric: str = "impressions,reach,profile_views", period: str = "day", user: User = Depends(get_current_user)):
    if not IG_ACCESS_TOKEN or not IG_BUSINESS_ACCOUNT_ID:
        raise HTTPException(400, "IG credentials not configured")
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://graph.facebook.com/v18.0/{IG_BUSINESS_ACCOUNT_ID}/insights", params={"metric": metric, "period": period, "access_token": IG_ACCESS_TOKEN})
        return r.json()

# ── BizFlow Connector (auth required) ──
@app.get("/api/bizflow/clients")
async def list_bizflow_clients(user: User = Depends(get_current_user)):
    try:
        async with httpx.AsyncClient() as c:
            r = await c.get(f"{BIZFLOW_API_URL}/api/clients", headers={"Authorization": f"Bearer {BIZFLOW_API_KEY}"})
            return r.json()
    except Exception as e:
        return {"error": str(e), "clients": []}

@app.post("/api/bizflow/meta-campaigns")
async def create_meta_campaign(campaign: Campaign, user: User = Depends(get_current_user)):
    campaign.platform = "meta"
    campaign.user_id = user.id
    result = await db.create_campaign(campaign.model_dump())
    try:
        async with httpx.AsyncClient() as c:
            await c.post(f"{BIZFLOW_API_URL}/api/campaigns", json=result, headers={"Authorization": f"Bearer {BIZFLOW_API_KEY}"})
    except Exception:
        pass
    return result

@app.get("/api/bizflow/meta-campaigns")
async def list_meta_campaigns(user: User = Depends(get_current_user)):
    return await db.get_campaigns(platform="meta")

# ── NeoVibe Connector (auth required) ──
@app.post("/api/neovibe/instagram-campaigns")
async def create_ig_campaign(campaign: Campaign, user: User = Depends(get_current_user)):
    campaign.platform = "instagram"
    campaign.user_id = user.id
    result = await db.create_campaign(campaign.model_dump())
    try:
        async with httpx.AsyncClient() as c:
            await c.post(f"{NEOVIBE_API_URL}/api/campaigns", json=result, headers={"Authorization": f"Bearer {NEOVIBE_API_KEY}"})
    except Exception:
        pass
    return result

@app.get("/api/neovibe/instagram-campaigns")
async def list_ig_campaigns(user: User = Depends(get_current_user)):
    return await db.get_campaigns(platform="instagram")

@app.get("/api/neovibe/analytics")
async def get_neovibe_analytics(time_range: str = "7d", user: User = Depends(get_current_user)):
    try:
        async with httpx.AsyncClient() as c:
            r = await c.get(f"{NEOVIBE_API_URL}/api/analytics", params={"range": time_range}, headers={"Authorization": f"Bearer {NEOVIBE_API_KEY}"})
            return r.json()
    except Exception as e:
        return {"error": str(e), "analytics": {}}

# ── Agent Orchestration (auth required) ──
@app.post("/api/agents/orchestrate")
async def orchestrate_agent(req: dict, user: User = Depends(get_current_user)):
    task_desc = req.get("task_description", "")
    platform = req.get("platform", "bizflow")
    agent_type = req.get("agent_type", "orchestrator")
    priority = req.get("priority", "medium")
    session = await db.create_agent_session({"agent_type": agent_type, "platform": platform, "task_description": task_desc, "priority": priority, "input_data": req})
    try:
        plan = await router.route("agent_orchestration", f"Plan agent orchestration: platform={platform}, type={agent_type}, task={task_desc}, priority={priority}", system_prompt="You are an agent orchestration planner. Return a JSON execution plan with steps, estimated duration, and required tools.")
        await db.update_agent_session(session["id"], {"status": "planned", "output_data": {"plan": plan}})
        return {"status": "orchestrated", "session_id": session["id"], "plan": plan}
    except AIRoutingError as e:
        return {"status": "orchestrated", "session_id": session["id"], "plan": {"error": str(e), "fallback": "manual execution required"}}

@app.post("/api/agents/claude-code")
async def trigger_claude_code(task: dict, user: User = Depends(get_current_user)):
    return {"status": "queued", "agent": "claude-code", "task": task, "timestamp": datetime.utcnow().isoformat()}

@app.post("/api/agents/opencode")
async def trigger_opencode(task: dict, user: User = Depends(get_current_user)):
    return {"status": "queued", "agent": "opencode", "task": task, "timestamp": datetime.utcnow().isoformat()}

# ── Analytics (auth required) ──
@app.get("/api/analytics/campaigns")
async def get_campaign_analytics(time_range: str = "7d", platform: Optional[str] = None, user: User = Depends(get_current_user)):
    campaigns = await db.get_campaigns(platform=platform)
    analytics = []
    for c in campaigns:
        metrics = await db.get_analytics(campaign_id=c["id"], time_range=time_range)
        analytics.append({"campaign_id": c["id"], "name": c["name"], "platform": c["platform"], "status": c["status"], "metrics": metrics})
    return {"time_range": time_range, "analytics": analytics}

@app.post("/api/analytics/record")
async def record_analytics(campaign_id: int, metric_name: str, metric_value: float, platform: str = "", user: User = Depends(get_current_user)):
    await db.record_analytics(campaign_id, metric_name, metric_value, platform)
    return {"status": "recorded"}

# ── Stripe Payments ──
import stripe as stripe_lib

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
STRIPE_PRO_PRICE_ID = os.getenv("STRIPE_PRO_PRICE_ID", "")
STRIPE_RESELLER_PRICE_ID = os.getenv("STRIPE_RESELLER_PRICE_ID", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://nexus-social.vercel.app")
stripe_lib.api_key = STRIPE_SECRET_KEY

@app.post("/api/stripe/create-checkout-session")
async def create_checkout_session(req: CheckoutRequest, user: User = Depends(get_current_user)):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=503, detail="Payments not configured. Contact admin@taurusai.io")
    price_id = req.price_id or STRIPE_PRO_PRICE_ID
    if not price_id:
        raise HTTPException(status_code=400, detail="No price ID configured. Contact admin@taurusai.io")
    try:
        session = stripe_lib.checkout.Session.create(
            mode="subscription" if price_id.startswith("price_") else "payment",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=f"{FRONTEND_URL}/dashboard?session_id={{CHECKOUT_SESSION_ID}}&checkout=success",
            cancel_url=f"{FRONTEND_URL}/?canceled=true",
            metadata={"source": "nexus_dashboard", "user_id": str(user.id), "user_email": user.email},
            customer_email=user.email,
        )
        return {"url": session.url}
    except stripe_lib.error.InvalidRequestError as e:
        logger.error(f"Stripe invalid request: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid price ID: {price_id}. Contact admin@taurusai.io")
    except Exception as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request):
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=503, detail="Webhook not configured")
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    try:
        event = stripe_lib.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        event_type = event["type"]
        data = event["data"]["object"]
        logger.info(f"Stripe webhook received: {event_type}")
        if event_type == "checkout.session.completed":
            customer_email = data.get("customer_email", "")
            subscription_id = data.get("subscription", "")
            logger.info(f"Checkout completed: {customer_email} -> {subscription_id}")
        elif event_type == "invoice.payment_succeeded":
            subscription_id = data.get("subscription", "")
            logger.info(f"Payment succeeded for subscription: {subscription_id}")
        elif event_type == "customer.subscription.deleted":
            subscription_id = data.get("id", "")
            logger.info(f"Subscription cancelled: {subscription_id}")
        return {"received": True}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe_lib.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

# ── Meta OAuth Callback ──
@app.get("/api/auth/meta/callback")
async def meta_callback(code: str, state: Optional[str] = None):
    """OAuth callback: exchange code for token, store it, redirect to frontend"""
    redirect_uri = os.getenv("META_OAUTH_REDIRECT_URI", "https://api-beryl-three-25.vercel.app/api/auth/meta/callback")
    frontend_url = os.getenv("FRONTEND_URL", "https://nexus-social.vercel.app")
    try:
        async with httpx.AsyncClient() as c:
            # Exchange code for short-lived token
            token_r = await c.get("https://graph.facebook.com/v18.0/oauth/access_token", params={
                "client_id": META_APP_ID, "client_secret": META_APP_SECRET, "redirect_uri": redirect_uri, "code": code,
            })
            if token_r.status_code != 200:
                logger.error(f"Meta token exchange failed: {token_r.text}")
                return f'<script>window.opener.postMessage({{"error":"Meta connection failed"}}, "{frontend_url}"); window.close();</script>'
            
            token_data = token_r.json()
            access_token = token_data.get("access_token")
            
            # Exchange for long-lived token (60 days)
            long_r = await c.get("https://graph.facebook.com/v18.0/oauth/access_token", params={
                "grant_type": "fb_exchange_token", "client_id": META_APP_ID, "client_secret": META_APP_SECRET, "fb_exchange_token": access_token,
            })
            if long_r.status_code == 200:
                access_token = long_r.json().get("access_token", access_token)
            
            # Get ad accounts
            accounts_r = await c.get("https://graph.facebook.com/v18.0/me/adaccounts", params={
                "access_token": access_token, "fields": "id,name,account_status,currency",
            })
            ad_accounts = accounts_r.json().get("data", []) if accounts_r.status_code == 200 else []
            
            # Get Instagram business account
            ig_account = None
            pages_r = await c.get("https://graph.facebook.com/v18.0/me/accounts", params={
                "access_token": access_token, "fields": "id,name,instagram_business_account",
            })
            if pages_r.status_code == 200:
                for page in pages_r.json().get("data", []):
                    if page.get("instagram_business_account"):
                        ig_account = page["instagram_business_account"]
                        break
            
            # Return HTML that posts message to opener and closes
            result = {
                "success": True,
                "access_token": access_token,
                "ad_accounts": ad_accounts,
                "instagram_account": ig_account,
                "message": "Meta account connected successfully"
            }
            import json
            return f'<script>window.opener.postMessage({json.dumps(result)}, "{frontend_url}"); window.close();</script>'
    except Exception as e:
        logger.error(f"Meta OAuth error: {e}")
        return f'<script>window.opener.postMessage({{"error":"{str(e)}"}}, "{frontend_url}"); window.close();</script>'

# ── Facebook Ads Marketing API ──
class AdCampaignCreate(BaseModel):
    ad_account_id: str
    name: str
    objective: str = "OUTCOME_LEADS"
    status: str = "PAUSED"
    budget_daily: float = 30.0
    targeting: dict = {}

class AdSetCreate(BaseModel):
    campaign_id: str
    name: str
    budget_daily: float = 30.0
    targeting: dict = {}
    optimization_goal: str = "LINK_CLICKS"
    billing_event: str = "IMPRESSIONS"
    bid_amount: float = 100

class AdCreativeCreate(BaseModel):
    adset_id: str
    name: str
    title: str = ""
    body: str = ""
    image_url: str = ""
    link_url: str = ""
    call_to_action_type: str = "LEARN_MORE"

def _get_meta_token(access_token: Optional[str] = None) -> str:
    token = access_token or IG_ACCESS_TOKEN
    if not token:
        raise HTTPException(400, "No access token provided")
    return token

@app.get("/api/meta/adaccounts")
async def get_ad_accounts(access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    async with httpx.AsyncClient() as c:
        r = await c.get("https://graph.facebook.com/v18.0/me/adaccounts", params={"access_token": token, "fields": "id,name,account_status,currency,spend_cap,balance"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.get("/api/meta/adaccounts/{ad_account_id}/campaigns")
async def get_ad_campaigns(ad_account_id: str, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://graph.facebook.com/v18.0/act_{ad_account_id}/campaigns", params={"access_token": token, "fields": "id,name,status,objective,created_time,updated_time,buying_type,smart_promotion_type"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.post("/api/meta/adaccounts/{ad_account_id}/campaigns")
async def create_ad_campaign(ad_account_id: str, campaign: AdCampaignCreate, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    async with httpx.AsyncClient() as c:
        r = await c.post(f"https://graph.facebook.com/v18.0/act_{ad_account_id}/campaigns", params={"access_token": token, "name": campaign.name, "objective": campaign.objective, "status": campaign.status, "special_ad_categories": "NONE"})
        result = r.json()
        if r.status_code == 200 and "id" in result:
            await c.post(f"https://graph.facebook.com/v18.0/{result['id']}", params={"access_token": token, "daily_budget": int(campaign.budget_daily * 100)})
        return result if r.status_code == 200 else {"error": r.json()}

@app.get("/api/meta/campaigns/{campaign_id}/adsets")
async def get_adsets(campaign_id: str, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://graph.facebook.com/v18.0/{campaign_id}/adsets", params={"access_token": token, "fields": "id,name,status,bid_amount,budget_remaining,daily_budget,lifetime_budget,targeting,optimization_goal,billing_event"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.post("/api/meta/campaigns/{campaign_id}/adsets")
async def create_adset(campaign_id: str, adset: AdSetCreate, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    targeting = adset.targeting or {"geo_locations": {"countries": ["US"]}, "age_min": 25, "age_max": 50}
    async with httpx.AsyncClient() as c:
        r = await c.post(f"https://graph.facebook.com/v18.0/{campaign_id}/adsets", params={"access_token": token, "name": adset.name, "campaign_id": campaign_id, "daily_budget": int(adset.budget_daily * 100), "optimization_goal": adset.optimization_goal, "billing_event": adset.billing_event, "bid_amount": int(adset.bid_amount * 100), "targeting": json.dumps(targeting), "status": "PAUSED"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.get("/api/meta/adsets/{adset_id}/ads")
async def get_ads(adset_id: str, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://graph.facebook.com/v18.0/{adset_id}/ads", params={"access_token": token, "fields": "id,name,status,creative,effective_status,preview_shareable_link"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.post("/api/meta/adsets/{adset_id}/ads")
async def create_ad(adset_id: str, ad: AdCreativeCreate, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    creative_spec = {"name": ad.name, "object_story_spec": {"link_data": {"link": ad.link_url, "message": ad.body, "name": ad.title, "image_hash": "", "call_to_action": {"type": ad.call_to_action_type}}, "page_id": ""}}
    async with httpx.AsyncClient() as c:
        r = await c.post(f"https://graph.facebook.com/v18.0/{adset_id}/ads", params={"access_token": token, "name": ad.name, "adset_id": adset_id, "creative": json.dumps(creative_spec), "status": "PAUSED"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.get("/api/meta/insights/{ad_account_id}")
async def get_ad_insights(ad_account_id: str, level: str = "campaign", access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    fields = "campaign_name,impressions,clicks,spend,ctr,cpc,cpm,actions,reach,frequency,conversions,roas"
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://graph.facebook.com/v18.0/act_{ad_account_id}/insights", params={"access_token": token, "level": level, "fields": fields, "time_range": json.dumps({"since": "2026-01-01", "until": "2026-12-31"})})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.get("/api/meta/insights/{ad_account_id}/realtime")
async def get_realtime_insights(ad_account_id: str, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://graph.facebook.com/v18.0/act_{ad_account_id}/insights", params={"access_token": token, "level": "ad", "fields": "ad_name,impressions,clicks,spend,ctr,actions,reach", "time_range": json.dumps({"since": "today", "until": "today"}), "use_account_attribution_setting": "true"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

# ── Meta Webhook Subscriptions ──
@app.post("/api/meta/webhooks/subscribe")
async def subscribe_meta_webhook(ad_account_id: str, callback_url: str, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    async with httpx.AsyncClient() as c:
        r = await c.post(f"https://graph.facebook.com/v18.0/{ad_account_id}/subscribed_apps", params={"access_token": token, "callback_url": callback_url, "fields": "ads,adsets,campaigns"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.get("/api/meta/webhooks/subscriptions/{ad_account_id}")
async def get_webhook_subscriptions(ad_account_id: str, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://graph.facebook.com/v18.0/{ad_account_id}/subscribed_apps", params={"access_token": token})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.delete("/api/meta/webhooks/subscribe/{ad_account_id}")
async def unsubscribe_meta_webhook(ad_account_id: str, access_token: Optional[str] = None, user: User = Depends(get_current_user)):
    token = _get_meta_token(access_token)
    async with httpx.AsyncClient() as c:
        r = await c.delete(f"https://graph.facebook.com/v18.0/{ad_account_id}/subscribed_apps", params={"access_token": token})
        return r.json() if r.status_code == 200 else {"error": r.json()}

# ── Meta Webhook Receiver (for Facebook to call) ──
@app.get("/api/meta/webhook")
async def meta_webhook_verify(hub_mode: str = "", hub_verify_token: str = "", hub_challenge: str = ""):
    if hub_mode == "subscribe" and hub_verify_token == os.getenv("META_WEBHOOK_VERIFY_TOKEN", "nexus_webhook_token"):
        return int(hub_challenge)
    return {"error": "Verification failed"}

@app.post("/api/meta/webhook")
async def meta_webhook_receive(request: Request):
    data = await request.json()
    logger.info(f"Meta webhook received: {json.dumps(data)[:500]}")
    for entry in data.get("entry", []):
        for change in entry.get("changes", []):
            field = change.get("field")
            value = change.get("value")
            logger.info(f"Meta webhook field={field}, value={json.dumps(value)[:200]}")
    return {"success": True}

# ── WhatsApp Cloud API (competes with BotCommerce) ──
class WhatsAppMessage(BaseModel):
    to: str
    message: str
    template_name: Optional[str] = None
    template_language: Optional[str] = "en_US"

@app.get("/api/whatsapp/phone-numbers")
async def get_whatsapp_phones(user: User = Depends(get_current_user)):
    """List WhatsApp phone numbers registered with Meta"""
    if not WHATSAPP_TOKEN:
        return {"error": "WHATSAPP_TOKEN not configured"}
    async with httpx.AsyncClient() as c:
        r = await c.get("https://graph.facebook.com/v18.0/me/phone_numbers", params={"access_token": WHATSAPP_TOKEN})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.post("/api/whatsapp/send")
async def send_whatsapp(msg: WhatsAppMessage, user: User = Depends(get_current_user)):
    """Send WhatsApp message via Cloud API"""
    if not WHATSAPP_TOKEN or not WHATSAPP_PHONE_ID:
        raise HTTPException(400, "WhatsApp credentials not configured")
    async with httpx.AsyncClient() as c:
        if msg.template_name:
            # Template message (for conversations outside 24h window)
            payload = {
                "messaging_product": "whatsapp",
                "to": msg.to,
                "type": "template",
                "template": {"name": msg.template_name, "language": {"code": msg.template_language}}
            }
        else:
            # Text message (within 24h window)
            payload = {
                "messaging_product": "whatsapp",
                "to": msg.to,
                "type": "text",
                "text": {"body": msg.message}
            }
        r = await c.post(f"https://graph.facebook.com/v18.0/{WHATSAPP_PHONE_ID}/messages", json=payload, headers={"Authorization": f"Bearer {WHATSAPP_TOKEN}"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.get("/api/whatsapp/conversations")
async def get_whatsapp_conversations(phone_number_id: Optional[str] = None, user: User = Depends(get_current_user)):
    """Get WhatsApp conversation analytics"""
    if not WHATSAPP_TOKEN:
        raise HTTPException(400, "WhatsApp credentials not configured")
    pid = phone_number_id or WHATSAPP_PHONE_ID
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://graph.facebook.com/v18.0/{pid}/conversations", params={"access_token": WHATSAPP_TOKEN, "fields": "conversation_type,conversation_direction,conversation_origin"})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.get("/api/whatsapp/webhook")
async def whatsapp_webhook_verify(hub_mode: str = "", hub_verify_token: str = "", hub_challenge: str = ""):
    if hub_mode == "subscribe" and hub_verify_token == WHATSAPP_VERIFY_TOKEN:
        return int(hub_challenge)
    return {"error": "Verification failed"}

@app.post("/api/whatsapp/webhook")
async def whatsapp_webhook_receive(request: Request):
    data = await request.json()
    logger.info(f"WhatsApp webhook received: {json.dumps(data)[:500]}")
    for entry in data.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            messages = value.get("messages", [])
            statuses = value.get("statuses", [])
            for m in messages:
                logger.info(f"WhatsApp message from {m.get('from')}: {m.get('text',{}).get('body','')[:200]}")
            for s in statuses:
                logger.info(f"WhatsApp status: {s.get('id')} -> {s.get('status')}")
    return {"success": True}

# ── Telegram Bot API (competes with BotCommerce) ──
class TelegramMessage(BaseModel):
    chat_id: str
    message: str
    parse_mode: Optional[str] = None

@app.get("/api/telegram/bot-info")
async def get_telegram_bot(user: User = Depends(get_current_user)):
    """Get Telegram bot info"""
    if not TELEGRAM_BOT_TOKEN:
        return {"error": "TELEGRAM_BOT_TOKEN not configured"}
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getMe")
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.post("/api/telegram/send")
async def send_telegram(msg: TelegramMessage, user: User = Depends(get_current_user)):
    """Send Telegram message"""
    if not TELEGRAM_BOT_TOKEN:
        raise HTTPException(400, "Telegram credentials not configured")
    params = {"chat_id": msg.chat_id, "text": msg.message}
    if msg.parse_mode:
        params["parse_mode"] = msg.parse_mode
    async with httpx.AsyncClient() as c:
        r = await c.post(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage", json=params)
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.get("/api/telegram/updates")
async def get_telegram_updates(offset: Optional[int] = None, limit: int = 100, user: User = Depends(get_current_user)):
    """Get Telegram bot updates"""
    if not TELEGRAM_BOT_TOKEN:
        raise HTTPException(400, "Telegram credentials not configured")
    params = {"limit": limit}
    if offset:
        params["offset"] = offset
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates", params=params)
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.post("/api/telegram/webhook/set")
async def set_telegram_webhook(url: str, user: User = Depends(get_current_user)):
    """Set Telegram webhook URL"""
    if not TELEGRAM_BOT_TOKEN:
        raise HTTPException(400, "Telegram credentials not configured")
    async with httpx.AsyncClient() as c:
        r = await c.post(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook", json={"url": url})
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.get("/api/telegram/webhook/info")
async def get_telegram_webhook(user: User = Depends(get_current_user)):
    """Get Telegram webhook info"""
    if not TELEGRAM_BOT_TOKEN:
        raise HTTPException(400, "Telegram credentials not configured")
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getWebhookInfo")
        return r.json() if r.status_code == 200 else {"error": r.json()}

@app.post("/api/telegram/webhook")
async def telegram_webhook_receive(request: Request):
    data = await request.json()
    logger.info(f"Telegram webhook received: {json.dumps(data)[:500]}")
    if "message" in data:
        msg = data["message"]
        logger.info(f"Telegram message from {msg.get('from',{}).get('username','?')}: {msg.get('text','')[:200]}")
    return {"success": True}

# ── Storage Security (hunter report finding #5) ──
@app.get("/api/storage/config")
async def get_storage_config(user: User = Depends(get_current_user)):
    """Get storage bucket configuration (security audit)"""
    configs = await db.fetch("SELECT * FROM storage_config ORDER BY created_at DESC")
    return {"buckets": configs, "security_note": "All buckets are private by default. Use signed URLs for temporary access. Never expose bucket URLs publicly."}

@app.post("/api/storage/generate-signed-url")
async def generate_signed_url(file_key: str, expires_in_seconds: int = 3600, user: User = Depends(get_current_user)):
    """Generate a signed URL for private file access (replaces public bucket URLs)"""
    # In production, this would use boto3/botocore to generate presigned URLs
    # For now, return a placeholder that demonstrates the pattern
    expires_at = datetime.utcnow() + timedelta(seconds=expires_in_seconds)
    return {
        "file_key": file_key,
        "signed_url": f"/api/storage/serve/{file_key}?token=PLACEHOLDER&expires={expires_at.isoformat()}",
        "expires_at": expires_at.isoformat(),
        "security_note": "Signed URLs expire automatically. Never share permanent bucket URLs."
    }

@app.get("/api/storage/security-audit")
async def storage_security_audit(user: User = Depends(get_current_user)):
    """Run storage security audit (checks for public buckets, exposed URLs, etc.)"""
    audits = []
    configs = await db.fetch("SELECT * FROM storage_config")
    for cfg in configs:
        policy = cfg.get("access_policy", {})
        if policy.get("public_read"):
            audits.append({"severity": "HIGH", "bucket": cfg["bucket_name"], "issue": "Bucket has public read access", "recommendation": "Set public_read=false and use signed URLs"})
        if not policy.get("signed_urls"):
            audits.append({"severity": "MEDIUM", "bucket": cfg["bucket_name"], "issue": "Signed URLs not enabled", "recommendation": "Enable signed URLs for temporary access"})
        if policy.get("cors_origins") == ["*"]:
            audits.append({"severity": "MEDIUM", "bucket": cfg["bucket_name"], "issue": "CORS allows all origins", "recommendation": "Restrict CORS to specific domains"})
    if not audits:
        audits.append({"severity": "PASS", "message": "All storage buckets follow security best practices"})
    return {"audit_results": audits, "total_buckets": len(configs), "timestamp": datetime.utcnow().isoformat()}


# ── Customer API Key Management ──
try:
    from customer_keys_endpoints import router as keys_router
    app.include_router(keys_router)
except Exception as e:
    logger.warning(f"Customer keys router not loaded: {e}")
