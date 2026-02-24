"""
BizFlow-NeoVibe Platform - CRM Client Models
Pydantic models for Client, Lead, Deal, and related entities
"""

from datetime import datetime, date
from decimal import Decimal
from enum import Enum
from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4

from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ===========================================
# ENUMS
# ===========================================

class MarketRegion(str, Enum):
    DUBAI = "dubai"
    INDIA = "india"
    MENA = "mena"
    CANADA = "canada"
    GLOBAL = "global"


class ClientStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    CHURNED = "churned"
    PROSPECT = "prospect"


class ClientTier(str, Enum):
    STARTER = "starter"
    STANDARD = "standard"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    NURTURING = "nurturing"
    CONVERTED = "converted"
    LOST = "lost"


class DealStage(str, Enum):
    DISCOVERY = "discovery"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CONTRACT = "contract"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"


class CampaignStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"


# ===========================================
# CULTURAL CONTEXT
# ===========================================

class CulturalContext(BaseModel):
    """Cultural context for market-specific adaptations"""
    preferred_language: Optional[str] = "english"
    secondary_languages: List[str] = Field(default_factory=list)
    religious_considerations: Optional[str] = None
    cultural_holidays: List[str] = Field(default_factory=list)
    communication_style: Optional[str] = "formal"  # formal, casual, professional
    time_zone: Optional[str] = None
    currency: Optional[str] = "USD"
    local_customs: Dict[str, Any] = Field(default_factory=dict)


# ===========================================
# CLIENT MODEL
# ===========================================

class ClientBase(BaseModel):
    """Base client model with common fields"""
    name: str = Field(..., min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    company_name: Optional[str] = Field(None, max_length=255)
    industry: Optional[str] = Field(None, max_length=100)
    market: MarketRegion = MarketRegion.GLOBAL
    status: ClientStatus = ClientStatus.PROSPECT
    tier: ClientTier = ClientTier.STANDARD
    monthly_budget: Optional[Decimal] = None


class ClientCreate(ClientBase):
    """Model for creating a new client"""
    cultural_context: Optional[CulturalContext] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ClientUpdate(BaseModel):
    """Model for updating a client"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    market: Optional[MarketRegion] = None
    status: Optional[ClientStatus] = None
    tier: Optional[ClientTier] = None
    monthly_budget: Optional[Decimal] = None
    cultural_context: Optional[CulturalContext] = None
    metadata: Optional[Dict[str, Any]] = None


class Client(ClientBase):
    """Full client model with all fields"""
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(default_factory=uuid4)
    hubspot_id: Optional[str] = None
    lifetime_value: Decimal = Decimal("0")
    cultural_context: CulturalContext = Field(default_factory=CulturalContext)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Computed properties
    @property
    def is_active(self) -> bool:
        return self.status == ClientStatus.ACTIVE

    @property
    def is_enterprise(self) -> bool:
        return self.tier == ClientTier.ENTERPRISE


# ===========================================
# LEAD MODEL
# ===========================================

class LeadBase(BaseModel):
    """Base lead model"""
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    company: Optional[str] = Field(None, max_length=255)
    job_title: Optional[str] = Field(None, max_length=100)
    source: Optional[str] = Field(None, max_length=100)


class LeadCreate(LeadBase):
    """Model for creating a new lead"""
    campaign_id: Optional[UUID] = None
    client_id: Optional[UUID] = None
    cultural_context: Optional[CulturalContext] = None


class LeadUpdate(BaseModel):
    """Model for updating a lead"""
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    source: Optional[str] = None
    score: Optional[int] = Field(None, ge=0, le=100)
    status: Optional[LeadStatus] = None


class Lead(LeadBase):
    """Full lead model"""
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(default_factory=uuid4)
    campaign_id: Optional[UUID] = None
    client_id: Optional[UUID] = None
    score: int = Field(default=0, ge=0, le=100)
    status: LeadStatus = LeadStatus.NEW
    cultural_context: CulturalContext = Field(default_factory=CulturalContext)
    engagement_history: List[Dict[str, Any]] = Field(default_factory=list)
    hubspot_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def full_name(self) -> str:
        parts = [self.first_name, self.last_name]
        return " ".join(p for p in parts if p) or "Unknown"

    @property
    def is_qualified(self) -> bool:
        return self.score >= 70 or self.status == LeadStatus.QUALIFIED


# ===========================================
# DEAL MODEL
# ===========================================

class DealBase(BaseModel):
    """Base deal model"""
    name: str = Field(..., min_length=1, max_length=255)
    value: Optional[Decimal] = None
    stage: DealStage = DealStage.DISCOVERY
    probability: int = Field(default=0, ge=0, le=100)
    expected_close_date: Optional[date] = None
    notes: Optional[str] = None


class DealCreate(DealBase):
    """Model for creating a new deal"""
    client_id: UUID
    lead_id: Optional[UUID] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class DealUpdate(BaseModel):
    """Model for updating a deal"""
    name: Optional[str] = None
    value: Optional[Decimal] = None
    stage: Optional[DealStage] = None
    probability: Optional[int] = Field(None, ge=0, le=100)
    expected_close_date: Optional[date] = None
    actual_close_date: Optional[date] = None
    notes: Optional[str] = None


class Deal(DealBase):
    """Full deal model"""
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(default_factory=uuid4)
    client_id: UUID
    lead_id: Optional[UUID] = None
    actual_close_date: Optional[date] = None
    hubspot_deal_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def is_won(self) -> bool:
        return self.stage == DealStage.CLOSED_WON

    @property
    def is_closed(self) -> bool:
        return self.stage in [DealStage.CLOSED_WON, DealStage.CLOSED_LOST]

    @property
    def weighted_value(self) -> Decimal:
        if self.value is None:
            return Decimal("0")
        return self.value * Decimal(self.probability) / Decimal("100")


# ===========================================
# CAMPAIGN MODEL
# ===========================================

class CampaignTargetMetrics(BaseModel):
    """Target metrics for a campaign"""
    reach: Optional[int] = None
    engagement_rate: Optional[float] = None
    conversion_rate: Optional[float] = None
    cost_per_lead: Optional[Decimal] = None
    roi_target: Optional[float] = None


class CampaignBase(BaseModel):
    """Base campaign model"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    campaign_type: Optional[str] = None
    budget: Optional[Decimal] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class CampaignCreate(CampaignBase):
    """Model for creating a new campaign"""
    client_id: UUID
    target_metrics: Optional[CampaignTargetMetrics] = None
    channels: List[str] = Field(default_factory=list)


class Campaign(CampaignBase):
    """Full campaign model"""
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(default_factory=uuid4)
    client_id: UUID
    status: CampaignStatus = CampaignStatus.DRAFT
    spent: Decimal = Decimal("0")
    target_metrics: CampaignTargetMetrics = Field(default_factory=CampaignTargetMetrics)
    actual_metrics: Dict[str, Any] = Field(default_factory=dict)
    cultural_adaptation: Dict[str, Any] = Field(default_factory=dict)
    channels: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def is_active(self) -> bool:
        return self.status == CampaignStatus.ACTIVE

    @property
    def budget_remaining(self) -> Decimal:
        if self.budget is None:
            return Decimal("0")
        return max(Decimal("0"), self.budget - self.spent)

    @property
    def budget_utilization(self) -> float:
        if self.budget is None or self.budget == 0:
            return 0.0
        return float(self.spent / self.budget * 100)
