"""
NeoVibe Platform Routes
Creative studio with Figma integration, design management, and version control
"""

import logging
import sys
from datetime import datetime
from enum import Enum
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, Field, HttpUrl

sys.path.append('..')
from api_server import TokenData, verify_token

logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================================================
# MODELS
# ============================================================================

class DesignType(str, Enum):
    """Design type"""
    UI_UX = "ui_ux"
    GRAPHIC = "graphic"
    BRANDING = "branding"
    ILLUSTRATION = "illustration"
    ANIMATION = "animation"
    PROTOTYPE = "prototype"


class DesignStatus(str, Enum):
    """Design status"""
    DRAFT = "draft"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class SyncStatus(str, Enum):
    """Sync status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class ExportFormat(str, Enum):
    """Export format"""
    PNG = "png"
    JPG = "jpg"
    SVG = "svg"
    PDF = "pdf"
    FIGMA = "figma"
    SKETCH = "sketch"


class Design(BaseModel):
    """Design model"""
    design_id: str
    user_id: str
    name: str
    description: str | None = None
    design_type: DesignType
    status: DesignStatus = DesignStatus.DRAFT
    figma_file_id: str | None = None
    figma_url: HttpUrl | None = None
    thumbnail_url: HttpUrl | None = None
    tags: list[str] = []
    collaborators: list[str] = []
    version: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: datetime | None = None
    metadata: dict[str, Any] = {}


class CreateDesignRequest(BaseModel):
    """Create design request"""
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=1000)
    design_type: DesignType
    figma_file_id: str | None = None
    figma_url: HttpUrl | None = None
    tags: list[str] = []
    collaborators: list[str] = []


class UpdateDesignRequest(BaseModel):
    """Update design request"""
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = Field(None, max_length=1000)
    status: DesignStatus | None = None
    figma_url: HttpUrl | None = None
    tags: list[str] | None = None
    collaborators: list[str] | None = None


class DesignVersion(BaseModel):
    """Design version model"""
    version_id: str
    design_id: str
    version_number: int
    changes_description: str
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    figma_version_id: str | None = None
    thumbnail_url: HttpUrl | None = None
    file_size_bytes: int | None = None


class CreateVersionRequest(BaseModel):
    """Create version request"""
    changes_description: str = Field(..., min_length=1, max_length=500)
    figma_version_id: str | None = None


class FigmaSync(BaseModel):
    """Figma sync model"""
    sync_id: str
    design_id: str
    figma_file_id: str
    status: SyncStatus
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = None
    changes_detected: int = 0
    changes_synced: int = 0
    error_message: str | None = None
    metadata: dict[str, Any] = {}


class SyncRequest(BaseModel):
    """Sync request"""
    design_id: str
    force_sync: bool = False


class ExportJob(BaseModel):
    """Export job model"""
    export_id: str
    design_id: str
    format: ExportFormat
    status: SyncStatus
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = None
    file_url: str | None = None
    file_size_bytes: int | None = None
    error_message: str | None = None


class ExportRequest(BaseModel):
    """Export request"""
    design_id: str
    format: ExportFormat
    options: dict[str, Any] = {}


# ============================================================================
# DESIGN ENDPOINTS
# ============================================================================

@router.get("/designs", response_model=list[Design])
async def get_designs(
    design_type: DesignType | None = None,
    status: DesignStatus | None = None,
    tag: str | None = None,
    token_data: TokenData = Depends(verify_token),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    Get all designs for the authenticated user

    - **design_type**: Filter by design type (optional)
    - **status**: Filter by design status (optional)
    - **tag**: Filter by tag (optional)
    - **limit**: Maximum number of designs to return
    - **offset**: Number of designs to skip
    """
    logger.info(f"Getting designs for user {token_data.user_id}")

    # Mock data - replace with actual database query
    designs = [
        Design(
            design_id="dsn_001",
            user_id=token_data.user_id,
            name="AssetGrid Mobile App UI",
            description="Mobile application UI design for AssetGrid crypto platform",
            design_type=DesignType.UI_UX,
            status=DesignStatus.APPROVED,
            figma_file_id="abc123xyz",
            figma_url="https://www.figma.com/file/abc123xyz/AssetGrid-Mobile",
            thumbnail_url="https://cdn.neovibe.io/thumbnails/dsn_001.png",
            tags=["mobile", "crypto", "ui", "assetgrid"],
            collaborators=["designer1@taurus.ai", "designer2@taurus.ai"],
            version=3,
            created_at=datetime(2024, 11, 1, 10, 0, 0),
            updated_at=datetime.utcnow(),
            published_at=datetime(2024, 11, 15, 14, 30, 0),
            metadata={
                "screens": 25,
                "components": 150,
                "colors": 8,
                "fonts": 2
            }
        )
    ]

    # Apply filters
    if design_type:
        designs = [d for d in designs if d.design_type == design_type]
    if status:
        designs = [d for d in designs if d.status == status]
    if tag:
        designs = [d for d in designs if tag in d.tags]

    return designs[offset:offset + limit]


@router.post("/designs", response_model=Design, status_code=status.HTTP_201_CREATED)
async def create_design(
    request: CreateDesignRequest,
    token_data: TokenData = Depends(verify_token)
):
    """
    Create a new design

    - **name**: Design name
    - **description**: Design description (optional)
    - **design_type**: Type of design
    - **figma_file_id**: Figma file ID (optional)
    - **figma_url**: Figma file URL (optional)
    - **tags**: Tags for organization
    - **collaborators**: List of collaborator emails
    """
    logger.info(f"Creating design '{request.name}' for user {token_data.user_id}")

    # Mock data - replace with actual database insert
    design = Design(
        design_id=f"dsn_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        user_id=token_data.user_id,
        name=request.name,
        description=request.description,
        design_type=request.design_type,
        figma_file_id=request.figma_file_id,
        figma_url=request.figma_url,
        tags=request.tags,
        collaborators=request.collaborators
    )

    return design


@router.get("/designs/{design_id}", response_model=Design)
async def get_design(
    design_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Get design by ID"""
    logger.info(f"Getting design {design_id}")

    # Mock data - replace with actual database query
    design = Design(
        design_id=design_id,
        user_id=token_data.user_id,
        name="AssetGrid Mobile App UI",
        description="Mobile application UI design for AssetGrid crypto platform",
        design_type=DesignType.UI_UX,
        status=DesignStatus.APPROVED,
        figma_file_id="abc123xyz",
        figma_url="https://www.figma.com/file/abc123xyz/AssetGrid-Mobile",
        tags=["mobile", "crypto", "ui"],
        version=3
    )

    return design


@router.put("/designs/{design_id}", response_model=Design)
async def update_design(
    design_id: str,
    request: UpdateDesignRequest,
    token_data: TokenData = Depends(verify_token)
):
    """Update design"""
    logger.info(f"Updating design {design_id}")

    # Mock data - replace with actual database update
    design = Design(
        design_id=design_id,
        user_id=token_data.user_id,
        name=request.name or "AssetGrid Mobile App UI",
        description=request.description,
        design_type=DesignType.UI_UX,
        status=request.status or DesignStatus.APPROVED,
        tags=request.tags or [],
        updated_at=datetime.utcnow()
    )

    return design


@router.delete("/designs/{design_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_design(
    design_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Delete design"""
    logger.info(f"Deleting design {design_id}")

    # Mock data - replace with actual database delete
    return None


@router.patch("/designs/{design_id}/publish")
async def publish_design(
    design_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Publish design"""
    logger.info(f"Publishing design {design_id}")

    return {
        "design_id": design_id,
        "status": DesignStatus.PUBLISHED,
        "published_at": datetime.utcnow().isoformat()
    }


@router.patch("/designs/{design_id}/archive")
async def archive_design(
    design_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Archive design"""
    logger.info(f"Archiving design {design_id}")

    return {
        "design_id": design_id,
        "status": DesignStatus.ARCHIVED,
        "archived_at": datetime.utcnow().isoformat()
    }


# ============================================================================
# VERSION ENDPOINTS
# ============================================================================

@router.get("/designs/{design_id}/versions", response_model=list[DesignVersion])
async def get_design_versions(
    design_id: str,
    token_data: TokenData = Depends(verify_token),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    Get all versions of a design

    - **limit**: Maximum number of versions to return
    - **offset**: Number of versions to skip
    """
    logger.info(f"Getting versions for design {design_id}")

    # Mock data - replace with actual database query
    versions = [
        DesignVersion(
            version_id="ver_001",
            design_id=design_id,
            version_number=3,
            changes_description="Updated color scheme and typography",
            created_by=token_data.username,
            created_at=datetime.utcnow(),
            thumbnail_url="https://cdn.neovibe.io/versions/ver_001.png",
            file_size_bytes=2548736
        ),
        DesignVersion(
            version_id="ver_002",
            design_id=design_id,
            version_number=2,
            changes_description="Added new components and screens",
            created_by=token_data.username,
            created_at=datetime(2024, 11, 15, 10, 0, 0),
            thumbnail_url="https://cdn.neovibe.io/versions/ver_002.png",
            file_size_bytes=2248736
        )
    ]

    return versions[offset:offset + limit]


@router.post("/designs/{design_id}/versions", response_model=DesignVersion, status_code=status.HTTP_201_CREATED)
async def create_design_version(
    design_id: str,
    request: CreateVersionRequest,
    token_data: TokenData = Depends(verify_token)
):
    """
    Create a new version of a design

    - **changes_description**: Description of changes in this version
    - **figma_version_id**: Figma version ID (optional)
    """
    logger.info(f"Creating new version for design {design_id}")

    # Mock data - replace with actual version creation
    version = DesignVersion(
        version_id=f"ver_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        design_id=design_id,
        version_number=4,  # Would be calculated from existing versions
        changes_description=request.changes_description,
        created_by=token_data.username,
        figma_version_id=request.figma_version_id
    )

    return version


@router.get("/designs/{design_id}/versions/{version_id}", response_model=DesignVersion)
async def get_design_version(
    design_id: str,
    version_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Get specific version of a design"""
    logger.info(f"Getting version {version_id} for design {design_id}")

    # Mock data - replace with actual database query
    version = DesignVersion(
        version_id=version_id,
        design_id=design_id,
        version_number=3,
        changes_description="Updated color scheme and typography",
        created_by=token_data.username,
        created_at=datetime.utcnow()
    )

    return version


# ============================================================================
# FIGMA SYNC ENDPOINTS
# ============================================================================

@router.post("/sync", response_model=FigmaSync, status_code=status.HTTP_201_CREATED)
async def sync_from_figma(
    request: SyncRequest,
    token_data: TokenData = Depends(verify_token)
):
    """
    Sync design from Figma

    - **design_id**: Design ID to sync
    - **force_sync**: Force sync even if no changes detected
    """
    logger.info(f"Syncing design {request.design_id} from Figma")

    # Mock data - replace with actual Figma sync
    sync = FigmaSync(
        sync_id=f"sync_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        design_id=request.design_id,
        figma_file_id="abc123xyz",
        status=SyncStatus.COMPLETED,
        completed_at=datetime.utcnow(),
        changes_detected=5,
        changes_synced=5,
        metadata={
            "sync_type": "full" if request.force_sync else "incremental",
            "components_updated": 3,
            "screens_updated": 2
        }
    )

    return sync


@router.get("/sync", response_model=list[FigmaSync])
async def get_sync_history(
    design_id: str | None = None,
    status: SyncStatus | None = None,
    token_data: TokenData = Depends(verify_token),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    Get Figma sync history

    - **design_id**: Filter by design ID (optional)
    - **status**: Filter by sync status (optional)
    - **limit**: Maximum number of sync records to return
    - **offset**: Number of sync records to skip
    """
    logger.info(f"Getting sync history for user {token_data.user_id}")

    # Mock data - replace with actual database query
    syncs = [
        FigmaSync(
            sync_id="sync_001",
            design_id="dsn_001",
            figma_file_id="abc123xyz",
            status=SyncStatus.COMPLETED,
            started_at=datetime(2024, 11, 29, 10, 0, 0),
            completed_at=datetime(2024, 11, 29, 10, 2, 15),
            changes_detected=5,
            changes_synced=5
        )
    ]

    # Apply filters
    if design_id:
        syncs = [s for s in syncs if s.design_id == design_id]
    if status:
        syncs = [s for s in syncs if s.status == status]

    return syncs[offset:offset + limit]


@router.get("/sync/{sync_id}", response_model=FigmaSync)
async def get_sync(
    sync_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Get sync record by ID"""
    logger.info(f"Getting sync record {sync_id}")

    # Mock data - replace with actual database query
    sync = FigmaSync(
        sync_id=sync_id,
        design_id="dsn_001",
        figma_file_id="abc123xyz",
        status=SyncStatus.COMPLETED,
        changes_detected=5,
        changes_synced=5
    )

    return sync


# ============================================================================
# EXPORT ENDPOINTS
# ============================================================================

@router.post("/exports", response_model=ExportJob, status_code=status.HTTP_201_CREATED)
async def export_design(
    request: ExportRequest,
    token_data: TokenData = Depends(verify_token)
):
    """
    Export design to specified format

    - **design_id**: Design ID to export
    - **format**: Export format (PNG, JPG, SVG, PDF, FIGMA, SKETCH)
    - **options**: Export options (resolution, scale, etc.)
    """
    logger.info(f"Exporting design {request.design_id} to {request.format}")

    # Mock data - replace with actual export job
    export = ExportJob(
        export_id=f"exp_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        design_id=request.design_id,
        format=request.format,
        status=SyncStatus.COMPLETED,
        completed_at=datetime.utcnow(),
        file_url=f"https://cdn.neovibe.io/exports/{request.design_id}.{request.format}",
        file_size_bytes=3548736
    )

    return export


@router.get("/exports", response_model=list[ExportJob])
async def get_exports(
    design_id: str | None = None,
    format: ExportFormat | None = None,
    token_data: TokenData = Depends(verify_token),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    Get export history

    - **design_id**: Filter by design ID (optional)
    - **format**: Filter by export format (optional)
    - **limit**: Maximum number of export records to return
    - **offset**: Number of export records to skip
    """
    logger.info(f"Getting export history for user {token_data.user_id}")

    # Mock data - replace with actual database query
    exports = [
        ExportJob(
            export_id="exp_001",
            design_id="dsn_001",
            format=ExportFormat.PNG,
            status=SyncStatus.COMPLETED,
            completed_at=datetime.utcnow(),
            file_url="https://cdn.neovibe.io/exports/dsn_001.png",
            file_size_bytes=3548736
        )
    ]

    # Apply filters
    if design_id:
        exports = [e for e in exports if e.design_id == design_id]
    if format:
        exports = [e for e in exports if e.format == format]

    return exports[offset:offset + limit]


@router.get("/exports/{export_id}", response_model=ExportJob)
async def get_export(
    export_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Get export job by ID"""
    logger.info(f"Getting export job {export_id}")

    # Mock data - replace with actual database query
    export = ExportJob(
        export_id=export_id,
        design_id="dsn_001",
        format=ExportFormat.PNG,
        status=SyncStatus.COMPLETED,
        file_url="https://cdn.neovibe.io/exports/dsn_001.png"
    )

    return export


# ============================================================================
# HEALTH CHECK
# ============================================================================

@router.get("/health")
async def health_check():
    """NeoVibe service health check"""
    return {
        "service": "neovibe",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "integrations": {
            "figma_api": "connected",
            "storage": "healthy",
            "export_service": "operational"
        }
    }


# ============================================================================
# LOGS
# ============================================================================

@router.get("/logs")
async def get_logs(
    design_id: str | None = None,
    sync_id: str | None = None,
    export_id: str | None = None,
    token_data: TokenData = Depends(verify_token),
    limit: int = Query(100, ge=1, le=1000),
    level: str | None = Query(None, regex="^(INFO|WARNING|ERROR)$")
):
    """
    Get NeoVibe service logs

    - **design_id**: Filter by design ID (optional)
    - **sync_id**: Filter by sync ID (optional)
    - **export_id**: Filter by export ID (optional)
    - **limit**: Maximum number of log entries to return
    - **level**: Filter by log level (INFO, WARNING, ERROR)
    """
    logger.info(f"Getting logs for user {token_data.user_id}")

    # Mock data - replace with actual log retrieval
    logs = [
        {
            "timestamp": datetime.utcnow().isoformat(),
            "level": "INFO",
            "message": "Design synced successfully from Figma",
            "design_id": "dsn_001",
            "sync_id": "sync_001"
        }
    ]

    # Apply filters
    if design_id:
        logs = [log for log in logs if log.get("design_id") == design_id]
    if sync_id:
        logs = [log for log in logs if log.get("sync_id") == sync_id]
    if export_id:
        logs = [log for log in logs if log.get("export_id") == export_id]
    if level:
        logs = [log for log in logs if log["level"] == level]

    return logs[:limit]
