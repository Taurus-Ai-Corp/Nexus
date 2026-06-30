"""
BizFlow-NeoVibe Platform - CRM Client Models
Pydantic models for Client, Lead, Deal, and related entities
"""

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Any
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, EmailStr, Field

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
    preferred_language: str | None = "english"
    secondary_languages: list[str] = Field(default_factory=list)
    religious_considerations: str | None = None
    cultural_holidays: list[str] = Field(default_factory=list)
    communication_style: str | None = "formal"  # formal, casual, professional
    time_zone: str | None = None
    currency: str | None = "USD"
    local_customs: dict[str, Any] = Field(default_factory=dict)


# ===========================================
# CLIENT MODEL
# ===========================================

class ClientBase(BaseModel):
    """Base client model with common fields"""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr | None = None
    phone: str | None = Field(None, max_length=50)
    company_name: str | None = Field(None, max_length=255)
    industry: str | None = Field(None, max_length=100)
    market: MarketRegion = MarketRegion.GLOBAL
    status: ClientStatus = ClientStatus.PROSPECT
    tier: ClientTier = ClientTier.STANDARD
    monthly_budget: Decimal | None = None


class ClientCreate(ClientBase):
    """Model for creating a new client"""
    cultural_context: CulturalContext | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ClientUpdate(BaseModel):
    """Model for updating a client"""
    name: str | None = Field(None, min_length=1, max_length=255)
    email: EmailStr | None = None
    phone: str | None = None
    company_name: str | None = None
    industry: str | None = None
    market: MarketRegion | None = None
    status: ClientStatus | None = None
    tier: ClientTier | None = None
    monthly_budget: Decimal | None = None
    cultural_context: CulturalContext | None = None
    metadata: dict[str, Any] | None = None


class Client(ClientBase):
    """Full client model with all fields"""
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(default_factory=uuid4)
    hubspot_id: str | None = None
    lifetime_value: Decimal = Decimal("0")
    cultural_context: CulturalContext = Field(default_factory=CulturalContext)
    metadata: dict[str, Any] = Field(default_factory=dict)
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
    email: EmailStr | None = None
    phone: str | None = None
    first_name: str | None = Field(None, max_length=100)
    last_name: str | None = Field(None, max_length=100)
    company: str | None = Field(None, max_length=255)
    job_title: str | None = Field(None, max_length=100)
    source: str | None = Field(None, max_length=100)


class LeadCreate(LeadBase):
    """Model for creating a new lead"""
    campaign_id: UUID | None = None
    client_id: UUID | None = None
    cultural_context: CulturalContext | None = None


class LeadUpdate(BaseModel):
    """Model for updating a lead"""
    email: EmailStr | None = None
    phone: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    company: str | None = None
    job_title: str | None = None
    source: str | None = None
    score: int | None = Field(None, ge=0, le=100)
    status: LeadStatus | None = None


class Lead(LeadBase):
    """Full lead model"""
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(default_factory=uuid4)
    campaign_id: UUID | None = None
    client_id: UUID | None = None
    score: int = Field(default=0, ge=0, le=100)
    status: LeadStatus = LeadStatus.NEW
    cultural_context: CulturalContext = Field(default_factory=CulturalContext)
    engagement_history: list[dict[str, Any]] = Field(default_factory=list)
    hubspot_id: str | None = None
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
    value: Decimal | None = None
    stage: DealStage = DealStage.DISCOVERY
    probability: int = Field(default=0, ge=0, le=100)
    expected_close_date: date | None = None
    notes: str | None = None


class DealCreate(DealBase):
    """Model for creating a new deal"""
    client_id: UUID
    lead_id: UUID | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class DealUpdate(BaseModel):
    """Model for updating a deal"""
    name: str | None = None
    value: Decimal | None = None
    stage: DealStage | None = None
    probability: int | None = Field(None, ge=0, le=100)
    expected_close_date: date | None = None
    actual_close_date: date | None = None
    notes: str | None = None


class Deal(DealBase):
    """Full deal model"""
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(default_factory=uuid4)
    client_id: UUID
    lead_id: UUID | None = None
    actual_close_date: date | None = None
    hubspot_deal_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
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
    reach: int | None = None
    engagement_rate: float | None = None
    conversion_rate: float | None = None
    cost_per_lead: Decimal | None = None
    roi_target: float | None = None


class CampaignBase(BaseModel):
    """Base campaign model"""
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    campaign_type: str | None = None
    budget: Decimal | None = None
    start_date: date | None = None
    end_date: date | None = None


class CampaignCreate(CampaignBase):
    """Model for creating a new campaign"""
    client_id: UUID
    target_metrics: CampaignTargetMetrics | None = None
    channels: list[str] = Field(default_factory=list)


class Campaign(CampaignBase):
    """Full campaign model"""
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(default_factory=uuid4)
    client_id: UUID
    status: CampaignStatus = CampaignStatus.DRAFT
    spent: Decimal = Decimal("0")
    target_metrics: CampaignTargetMetrics = Field(default_factory=CampaignTargetMetrics)
    actual_metrics: dict[str, Any] = Field(default_factory=dict)
    cultural_adaptation: dict[str, Any] = Field(default_factory=dict)
    channels: list[str] = Field(default_factory=list)
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
