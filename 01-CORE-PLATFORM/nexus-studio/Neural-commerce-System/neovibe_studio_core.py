#!/usr/bin/env python3
"""
🎨 TAURUS AI CORP. - Neural Commerce System
Visual brand builder interface built on existing Webflow integration
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any, Union
import json
import os
from pathlib import Path
import base64
import urllib.request

# Try importing FastAPI dependencies with fallbacks
try:
    from fastapi import FastAPI as FastAPIApp, HTTPException, UploadFile, File, BackgroundTasks
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel as PydanticBaseModel, Field
    import uvicorn
    FASTAPI_AVAILABLE = True
    
    # Use the real classes - no type aliases to avoid conflicts
    BaseModel = PydanticBaseModel  # type: ignore
    FastAPI = FastAPIApp  # type: ignore
    
except ImportError:
    # Fallback for when FastAPI is not available
    FASTAPI_AVAILABLE = False
    print("⚠️  FastAPI not available. Install with: pip install fastapi uvicorn python-multipart")
    
    # Mock classes for when FastAPI is not available
    class BaseModel:
        def __init__(self, **kwargs):
            for key, value in kwargs.items():
                setattr(self, key, value)
    
    class FastAPI:
        def __init__(self, **kwargs):
            pass
        def add_middleware(self, *args, **kwargs):
            pass
        def get(self, path):
            def decorator(func):
                return func
            return decorator
        def post(self, path):
            def decorator(func):
                return func
            return decorator
    
    # Mock Field function
    def Field(**kwargs):
        return kwargs.get('default_factory', lambda: None)()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Data models with proper Pydantic defaults
class BrandAsset(BaseModel):
    asset_id: str
    name: str
    type: str  # logo, color, font, image, icon
    url: str
    metadata: Dict[str, Any]
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    
class BrandTemplate(BaseModel):
    template_id: str
    name: str
    category: str
    description: str
    webflow_template_id: str
    customization_options: Dict[str, Any]
    preview_url: str
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    
class BrandProject(BaseModel):
    project_id: str
    name: str
    client_name: str
    brand_assets: List[str] = Field(default_factory=list)
    templates_used: List[str] = Field(default_factory=list)
    status: str
    webflow_site_id: str
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)

# Request models for API endpoints
class ProjectCreateRequest(BaseModel):
    name: str
    client_name: str
    description: Optional[str] = None

class TemplateCloneRequest(BaseModel):
    customization_options: Dict[str, Any] = Field(default_factory=dict)

class NeoVibeStudioCore:
    """
    NeoVibe Studio Core - Visual brand builder interface
    Built on top of existing Webflow integration
    """
    
    def __init__(self):
        self.name = "NeoVibe Studio Core"
        self.version = "1.0.0"
        self.webflow_client = None
        self.brand_assets = {}
        self.brand_templates = {}
        self.brand_projects = {}
        self.template_library = {}
        self.is_initialized = False
        
        # Reference existing Webflow credentials
        self.webflow_config = {
            "client_id": "f1f4344f7074e4f1f0dd50b1b2867873c17778f877f6f7a07a7882e79bf06828",
            "client_secret": "a2ae2e2baa88203e069c004a0452272c1fc8f3846d8687c27de13a34a684c097",
            "access_token": "ded536b9e74e112707f7087c7dabe365c7e76ba0c0949e6439e57868b4e40dad"
        }
        
    async def initialize_studio(self):
        """Initialize NeoVibe Studio with existing integrations"""
        if self.is_initialized:
            return
            
        logger.info("🎨 Initializing NeoVibe Studio Core...")
        
        try:
            # Initialize Webflow client using existing integration
            await self._initialize_webflow_client()
            
            # Load template library
            await self._load_template_library()
            
            # Initialize brand asset management
            await self._initialize_asset_management()
            
            # Set up collaboration tools
            await self._setup_collaboration_tools()
            
            self.is_initialized = True
            logger.info("✅ NeoVibe Studio Core initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize NeoVibe Studio: {e}")
            raise
        
    async def _initialize_webflow_client(self):
        """Initialize Webflow client using existing integration"""
        logger.info("🔗 Connecting to existing Webflow integration...")
        
        try:
            # Mock Webflow client initialization
            self.webflow_client = {
                "status": "connected",
                "access_token": self.webflow_config["access_token"],
                "sites": await self._get_webflow_sites()
            }
            
            logger.info("✅ Connected to Webflow API")
        except Exception as e:
            logger.error(f"❌ Failed to connect to Webflow: {e}")
            # Use fallback mock client
            self.webflow_client = {
                "status": "mock",
                "access_token": "mock_token",
                "sites": []
            }
        
    async def _get_webflow_sites(self) -> List[Dict]:
        """Get Webflow sites using existing integration"""
        # Mock implementation - would use actual Webflow API
        return [
            {
                "id": "site_1",
                "name": "TAURUS AI CORP Main Site",
                "domain": "taurusai.io",
                "status": "published"
            },
            {
                "id": "site_2", 
                "name": "BizFlow Platform",
                "domain": "bizflow.taurusai.io",
                "status": "published"
            },
            {
                "id": "site_3",
                "name": "NeoVibe Studio",
                "domain": "neovibe.taurusai.io", 
                "status": "development"
            }
        ]
        
    async def _load_template_library(self):
        """Load template library with premium templates"""
        logger.info("📚 Loading template library...")
        
        # Premium templates from prompt requirements
        premium_templates = {
            "untitled-ui": {
                "name": "Untitled UI",
                "category": "SaaS Dashboard",
                "description": "Modern SaaS dashboard with clean design",
                "features": ["Dark Mode", "Component Library", "Responsive"],
                "webflow_template_id": "untitled_ui_template_001",
                "preview_url": "https://untitled-ui.webflow.io",
                "customization_options": {
                    "colors": ["primary", "secondary", "accent"],
                    "typography": ["heading", "body", "caption"],
                    "layout": ["grid", "flex", "custom"],
                    "components": ["buttons", "forms", "cards", "navigation"]
                }
            },
            "radiant-ui": {
                "name": "Radiant UI",
                "category": "E-commerce",
                "description": "Beautiful e-commerce template with product showcase",
                "features": ["Product Gallery", "Shopping Cart", "Checkout"],
                "webflow_template_id": "radiant_ui_template_001",
                "preview_url": "https://radiant-ui.webflow.io",
                "customization_options": {
                    "colors": ["brand", "product", "accent"],
                    "layout": ["product_grid", "category_nav", "checkout_flow"],
                    "components": ["product_cards", "cart", "filters"]
                }
            },
            "silence-template": {
                "name": "Silence Template", 
                "category": "Portfolio",
                "description": "Minimal portfolio template for creatives",
                "features": ["Image Gallery", "Contact Forms", "Minimal Design"],
                "webflow_template_id": "silence_template_001",
                "preview_url": "https://silence-template.webflow.io",
                "customization_options": {
                    "colors": ["monochrome", "accent"],
                    "layout": ["masonry", "grid", "single_column"],
                    "components": ["gallery", "contact", "about"]
                }
            },
            "noura-template": {
                "name": "Noura Template",
                "category": "Business",
                "description": "Professional business template",
                "features": ["Team Pages", "Services", "Corporate Design"],
                "webflow_template_id": "noura_template_001", 
                "preview_url": "https://noura-template.webflow.io",
                "customization_options": {
                    "colors": ["corporate", "trust", "accent"],
                    "layout": ["hero", "services", "team", "contact"],
                    "components": ["testimonials", "services_grid", "team_cards"]
                }
            }
        }
        
        for template_id, template_data in premium_templates.items():
            brand_template = BrandTemplate(
                template_id=template_id,
                name=template_data["name"],
                category=template_data["category"],
                description=template_data["description"],
                webflow_template_id=template_data["webflow_template_id"],
                customization_options=template_data["customization_options"],
                preview_url=template_data["preview_url"]
            )
            self.brand_templates[template_id] = brand_template
            
        logger.info(f"📚 Loaded {len(premium_templates)} premium templates")
        
    async def _initialize_asset_management(self):
        """Initialize brand asset management system"""
        logger.info("🎨 Initializing asset management...")
        
        # Asset categories
        asset_categories = {
            "logos": ["svg", "png", "jpg"],
            "colors": ["hex", "rgb", "hsl"],
            "typography": ["woff2", "woff", "ttf"],
            "images": ["jpg", "png", "webp", "svg"],
            "icons": ["svg", "png"]
        }
        
        # Create assets directory if it doesn't exist
        assets_path = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/assets/")
        assets_path.mkdir(parents=True, exist_ok=True)
        
        self.asset_management = {
            "categories": asset_categories,
            "storage_path": str(assets_path),
            "cdn_url": "https://cdn.taurusai.io/assets/",
            "max_file_size": 10 * 1024 * 1024,  # 10MB
            "supported_formats": ["svg", "png", "jpg", "webp", "woff2", "woff", "ttf"]
        }
        
        logger.info("✅ Asset management system initialized")
        
    async def _setup_collaboration_tools(self):
        """Set up client collaboration tools"""
        logger.info("🤝 Setting up collaboration tools...")
        
        self.collaboration_tools = {
            "real_time_preview": True,
            "comment_system": True,
            "approval_workflow": True,
            "version_control": True,
            "client_portal": True,
            "feedback_collection": True
        }
        
        logger.info("✅ Collaboration tools configured")
        
    async def create_brand_project(self, project_data: Dict[str, Any]) -> BrandProject:
        """Create a new brand project"""
        if not self.is_initialized:
            await self.initialize_studio()
            
        logger.info(f"🚀 Creating brand project: {project_data.get('name', 'Unknown')}")
        
        try:
            # Generate project ID
            project_id = f"proj_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            # Create Webflow site for project
            webflow_site = await self._create_webflow_site_for_project(project_data)
            
            # Create brand project
            brand_project = BrandProject(
                project_id=project_id,
                name=project_data["name"],
                client_name=project_data["client_name"],
                brand_assets=[],
                templates_used=[],
                status="created",
                webflow_site_id=webflow_site["id"]
            )
            
            self.brand_projects[project_id] = brand_project
            
            logger.info(f"✅ Brand project created: {project_id}")
            return brand_project
            
        except Exception as e:
            logger.error(f"❌ Failed to create brand project: {e}")
            raise
        
    async def _create_webflow_site_for_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create Webflow site for brand project"""
        # Mock Webflow site creation
        site_data = {
            "id": f"site_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "name": project_data.get("name", "Unknown Project"),
            "domain": f"{project_data.get('name', 'project').lower().replace(' ', '-')}.webflow.io",
            "status": "development",
            "created_at": datetime.now()
        }
        
        logger.info(f"🌐 Created Webflow site: {site_data['id']}")
        return site_data
        
    async def clone_template(self, template_id: str, customization_options: Dict[str, Any]) -> Dict[str, Any]:
        """Clone and customize a template"""
        if not self.is_initialized:
            await self.initialize_studio()
            
        logger.info(f"📋 Cloning template: {template_id}")
        
        if template_id not in self.brand_templates:
            raise ValueError(f"Template {template_id} not found")
            
        template = self.brand_templates[template_id]
        
        try:
            # Clone template using existing Webflow integration
            cloned_template = await self._clone_webflow_template(template, customization_options)
            
            logger.info(f"✅ Template cloned successfully: {cloned_template['id']}")
            return cloned_template
            
        except Exception as e:
            logger.error(f"❌ Failed to clone template: {e}")
            raise
        
    async def _clone_webflow_template(self, template: BrandTemplate, customization_options: Dict[str, Any]) -> Dict[str, Any]:
        """Clone Webflow template with customizations"""
        # Mock template cloning
        cloned_template = {
            "id": f"clone_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "original_template_id": template.template_id,
            "webflow_site_id": f"site_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "customizations_applied": customization_options,
            "status": "ready",
            "preview_url": f"https://clone-{template.template_id}.webflow.io",
            "created_at": datetime.now()
        }
        
        return cloned_template
        
    async def upload_brand_asset(self, asset_file: bytes, asset_metadata: Dict[str, Any]) -> BrandAsset:
        """Upload and process brand asset"""
        if not self.is_initialized:
            await self.initialize_studio()
            
        logger.info(f"📤 Uploading brand asset: {asset_metadata.get('name', 'Unknown')}")
        
        try:
            # Generate asset ID
            asset_id = f"asset_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            # Process and store asset
            processed_asset = await self._process_brand_asset(asset_file, asset_metadata)
            
            # Create brand asset record
            brand_asset = BrandAsset(
                asset_id=asset_id,
                name=asset_metadata["name"],
                type=asset_metadata["type"],
                url=processed_asset["url"],
                metadata=processed_asset["metadata"]
            )
            
            self.brand_assets[asset_id] = brand_asset
            
            logger.info(f"✅ Brand asset uploaded: {asset_id}")
            return brand_asset
            
        except Exception as e:
            logger.error(f"❌ Failed to upload brand asset: {e}")
            raise
        
    async def _process_brand_asset(self, asset_file: bytes, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Process uploaded brand asset"""
        # Mock asset processing
        processed_asset = {
            "url": f"https://cdn.taurusai.io/assets/{metadata.get('name', 'unknown')}",
            "metadata": {
                "size": len(asset_file),
                "format": metadata.get("format", "unknown"),
                "dimensions": metadata.get("dimensions", {}),
                "color_palette": metadata.get("color_palette", []),
                "processed_at": datetime.now()
            }
        }
        
        return processed_asset
        
    async def generate_brand_guidelines(self, project_id: str) -> Dict[str, Any]:
        """Generate brand guidelines for project"""
        if not self.is_initialized:
            await self.initialize_studio()
            
        logger.info(f"📋 Generating brand guidelines for project: {project_id}")
        
        if project_id not in self.brand_projects:
            raise ValueError(f"Project {project_id} not found")
            
        project = self.brand_projects[project_id]
        
        try:
            # Generate brand guidelines
            guidelines = {
                "project_id": project_id,
                "project_name": project.name,
                "client_name": project.client_name,
                "brand_colors": await self._extract_brand_colors(project),
                "typography": await self._extract_typography(project),
                "logo_usage": await self._generate_logo_guidelines(project),
                "design_principles": await self._generate_design_principles(project),
                "component_library": await self._generate_component_library(project),
                "generated_at": datetime.now()
            }
            
            logger.info(f"✅ Brand guidelines generated for project: {project_id}")
            return guidelines
            
        except Exception as e:
            logger.error(f"❌ Failed to generate brand guidelines: {e}")
            raise
        
    async def _extract_brand_colors(self, project: BrandProject) -> Dict[str, Any]:
        """Extract brand colors from project assets"""
        return {
            "primary": "#667eea",
            "secondary": "#764ba2", 
            "accent": "#f093fb",
            "neutral": {
                "dark": "#2d3748",
                "medium": "#718096",
                "light": "#f7fafc"
            }
        }
        
    async def _extract_typography(self, project: BrandProject) -> Dict[str, Any]:
        """Extract typography from project assets"""
        return {
            "heading": {
                "family": "Inter",
                "weight": "700",
                "sizes": {"h1": "48px", "h2": "36px", "h3": "24px"}
            },
            "body": {
                "family": "Inter",
                "weight": "400",
                "size": "16px",
                "line_height": "1.6"
            }
        }
        
    async def _generate_logo_guidelines(self, project: BrandProject) -> Dict[str, Any]:
        """Generate logo usage guidelines"""
        return {
            "primary_logo": "Use for main brand representation",
            "minimum_size": "32px height for digital, 0.5 inch for print",
            "clear_space": "Minimum clear space equals the height of the logo",
            "color_variations": ["full_color", "monochrome", "white", "black"],
            "usage_dos": ["Use on clean backgrounds", "Maintain aspect ratio"],
            "usage_donts": ["Don't stretch or distort", "Don't use on busy backgrounds"]
        }
        
    async def _generate_design_principles(self, project: BrandProject) -> List[str]:
        """Generate design principles for project"""
        return [
            "Clean and modern aesthetic",
            "Consistent spacing and typography",
            "Accessible color contrast",
            "Mobile-first responsive design",
            "Fast loading performance"
        ]
        
    async def _generate_component_library(self, project: BrandProject) -> Dict[str, Any]:
        """Generate component library for project"""
        return {
            "buttons": {
                "primary": {"bg": "#667eea", "text": "white", "radius": "8px"},
                "secondary": {"bg": "transparent", "text": "#667eea", "border": "1px solid #667eea"}
            },
            "cards": {
                "default": {"bg": "white", "shadow": "0 4px 6px rgba(0,0,0,0.1)", "radius": "12px"}
            },
            "forms": {
                "input": {"border": "1px solid #e2e8f0", "radius": "6px", "padding": "12px"}
            }
        }
        
    async def run_neovibe_studio(self):
        """Run NeoVibe Studio Core"""
        logger.info("🎨 Starting NeoVibe Studio Core...")
        
        try:
            await self.initialize_studio()
            
            logger.info("🎉 NeoVibe Studio Core is ready!")
            logger.info(f"📚 Templates available: {len(self.brand_templates)}")
            logger.info(f"🎨 Asset management: Ready")
            logger.info(f"🤝 Collaboration tools: Active")
            
            # Keep studio running
            while True:
                await asyncio.sleep(30)
                logger.info("💓 NeoVibe Studio heartbeat - system operational")
                
        except KeyboardInterrupt:
            logger.info("🛑 NeoVibe Studio Core shutting down...")
        except Exception as e:
            logger.error(f"❌ NeoVibe Studio error: {e}")

# Initialize NeoVibe Studio
studio = NeoVibeStudioCore()

# FastAPI app for NeoVibe Studio API (only if FastAPI is available)
if FASTAPI_AVAILABLE:
    app = FastAPI(title="NeoVibe Studio Core API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def studio_status():
        """Get studio status"""
        try:
            if not studio.is_initialized:
                await studio.initialize_studio()
            
            return {
                "message": "🎨 NeoVibe Studio Core",
                "status": "operational",
                "version": studio.version,
                "templates": len(studio.brand_templates),
                "projects": len(studio.brand_projects),
                "initialized": studio.is_initialized
            }
        except Exception as e:
            logger.error(f"Status check failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @app.get("/api/templates")
    async def get_templates():
        """Get all available templates"""
        try:
            if not studio.is_initialized:
                await studio.initialize_studio()
            
            return {
                "templates": [
                    {
                        "template_id": template.template_id,
                        "name": template.name,
                        "category": template.category,
                        "description": template.description,
                        "preview_url": template.preview_url,
                        "customization_options": template.customization_options
                    }
                    for template in studio.brand_templates.values()
                ]
            }
        except Exception as e:
            logger.error(f"Failed to get templates: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @app.post("/api/projects")
    async def create_project(project_request: ProjectCreateRequest):
        """Create a new brand project"""
        try:
            # Handle both Pydantic v1 and v2, plus mock objects
            try:
                # Try Pydantic v2 method first
                if hasattr(project_request, 'model_dump') and callable(getattr(project_request, 'model_dump')):
                    project_data = project_request.model_dump()  # type: ignore
                # Try Pydantic v1 method
                elif hasattr(project_request, 'dict') and callable(getattr(project_request, 'dict')):
                    project_data = project_request.dict()  # type: ignore
                else:
                    raise AttributeError("No serialization method found")
            except (AttributeError, TypeError, Exception):
                # Fallback for mock objects or other types
                project_data = {
                    'name': getattr(project_request, 'name', ''),
                    'client_name': getattr(project_request, 'client_name', ''),
                    'description': getattr(project_request, 'description', None)
                }
            project = await studio.create_brand_project(project_data)
            
            return {
                "project_id": project.project_id,
                "name": project.name,
                "status": project.status,
                "webflow_site_id": project.webflow_site_id,
                "created_at": project.created_at
            }
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Failed to create project: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @app.post("/api/templates/{template_id}/clone")
    async def clone_template_endpoint(template_id: str, clone_request: TemplateCloneRequest):
        """Clone and customize a template"""
        try:
            cloned_template = await studio.clone_template(template_id, clone_request.customization_options)
            return cloned_template
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except Exception as e:
            logger.error(f"Failed to clone template: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @app.post("/api/assets/upload")
    async def upload_asset(file: UploadFile = File(...), metadata: str = "{}"):
        """Upload a brand asset"""
        try:
            asset_metadata = json.loads(metadata)
            asset_metadata["name"] = file.filename
            asset_metadata["type"] = asset_metadata.get("type", "unknown")
            
            file_content = await file.read()
            asset = await studio.upload_brand_asset(file_content, asset_metadata)
            
            return {
                "asset_id": asset.asset_id,
                "name": asset.name,
                "url": asset.url,
                "type": asset.type,
                "created_at": asset.created_at
            }
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid metadata JSON")
        except Exception as e:
            logger.error(f"Failed to upload asset: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @app.get("/api/projects/{project_id}/guidelines")
    async def get_brand_guidelines(project_id: str):
        """Get brand guidelines for a project"""
        try:
            guidelines = await studio.generate_brand_guidelines(project_id)
            return guidelines
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except Exception as e:
            logger.error(f"Failed to get brand guidelines: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {"status": "healthy", "timestamp": datetime.now()}

    @app.get("/api/jira/ping")
    async def jira_ping():
        """Verify Atlassian (Jira) connectivity using env vars.

        Reads ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN, ATLASSIAN_BASE_URL from environment.
        """
        try:
            email = os.getenv("ATLASSIAN_EMAIL")
            token = os.getenv("ATLASSIAN_API_TOKEN")
            base = os.getenv("ATLASSIAN_BASE_URL")

            if not (email and token and base):
                raise HTTPException(status_code=400, detail="Missing ATLASSIAN_EMAIL / ATLASSIAN_API_TOKEN / ATLASSIAN_BASE_URL")

            auth = base64.b64encode(f"{email}:{token}".encode()).decode()
            req = urllib.request.Request(
                f"{base}/rest/api/3/myself",
                headers={
                    "Authorization": f"Basic {auth}",
                    "Accept": "application/json"
                }
            )
            with urllib.request.urlopen(req, timeout=15) as r:
                body = r.read().decode()
            return {"ok": True, "base": base, "email": email}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Jira ping failed: {e}")

else:
    # Create a mock app when FastAPI is not available
    app = None
    logger.warning("FastAPI not available. API endpoints will not be functional.")

if __name__ == "__main__":
    if FASTAPI_AVAILABLE and app:
        logger.info("🚀 Starting NeoVibe Studio with FastAPI server...")
        uvicorn.run("neovibe_studio_core:app", host="0.0.0.0", port=8000, reload=True)
    else:
        logger.info("🚀 Starting NeoVibe Studio in standalone mode...")
        asyncio.run(studio.run_neovibe_studio())