#!/usr/bin/env python3
"""
TAURUS AI CORP - Database Models
SQLAlchemy models for PostgreSQL with multi-tenant support
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from enum import Enum as PyEnum

from sqlalchemy import Column, String, Text, DateTime, Boolean, JSON, Integer, ForeignKey, Enum, Float, Index
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session
from sqlalchemy.sql import func

Base = declarative_base()

# Enums
class UserRole(PyEnum):
    ADMIN = "admin"
    USER = "user" 
    AGENT = "agent"

class BusinessVertical(PyEnum):
    ECOMMERCE = "ecommerce"
    SAAS = "saas"
    LOCAL_BUSINESS = "local_business"
    GENERAL = "general"

class TaskStatus(PyEnum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class CampaignStatus(PyEnum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class AgentType(PyEnum):
    INTELLIGENCE_RESEARCH = "intelligence_research"
    WEBFLOW_INTEGRATION = "webflow_integration"
    CUSTOM_COMPONENT_PERFORMANCE = "custom_component_performance"
    PERFORMANCE_ANALYSIS = "performance_analysis"
    CONTENT_SOCIAL_STRATEGY = "content_social_strategy"
    REALTIME_INTELLIGENCE = "realtime_intelligence"

class ContentType(PyEnum):
    CASE_STUDY = "case_study"
    VIDEO_SCRIPT = "video_script"
    BLOG_POST = "blog_post"
    SOCIAL_POST = "social_post"
    EMAIL_TEMPLATE = "email_template"

# Models

class User(Base):
    """User model with multi-tenant support"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    business_vertical = Column(Enum(BusinessVertical), default=BusinessVertical.GENERAL, nullable=False)
    
    # Company/Tenant info
    company_name = Column(String(255))
    company_domain = Column(String(255))
    tenant_id = Column(UUID(as_uuid=True), default=uuid.uuid4, nullable=False, index=True)
    
    # Profile
    avatar_url = Column(String(500))
    phone = Column(String(20))
    timezone = Column(String(50), default="UTC")
    preferences = Column(JSONB, default={})
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    last_login = Column(DateTime(timezone=True))
    
    # Audit
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    campaigns = relationship("Campaign", back_populates="owner", cascade="all, delete-orphan")
    tasks = relationship("AgentTask", back_populates="created_by_user", cascade="all, delete-orphan")
    content_pieces = relationship("ContentPiece", back_populates="created_by_user", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_users_tenant_email', 'tenant_id', 'email'),
        Index('ix_users_company_domain', 'company_domain'),
    )

class Agent(Base):
    """Agent registry and configuration"""
    __tablename__ = "agents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True, index=True)
    agent_type = Column(Enum(AgentType), nullable=False)
    description = Column(Text)
    
    # Configuration
    config = Column(JSONB, default={})
    capabilities = Column(ARRAY(String), default=[])
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    version = Column(String(50), default="1.0.0")
    last_health_check = Column(DateTime(timezone=True))
    health_status = Column(String(50), default="unknown")
    
    # Performance metrics
    total_tasks_processed = Column(Integer, default=0)
    average_processing_time = Column(Float, default=0.0)
    success_rate = Column(Float, default=0.0)
    
    # Audit
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    tasks = relationship("AgentTask", back_populates="agent", cascade="all, delete-orphan")

class AgentTask(Base):
    """Agent task tracking"""
    __tablename__ = "agent_tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_name = Column(String(255), nullable=False)
    task_type = Column(String(100), nullable=False)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING, nullable=False, index=True)
    
    # Relationships
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Task data
    parameters = Column(JSONB, default={})
    result = Column(JSONB)
    error_message = Column(Text)
    
    # Timing
    scheduled_for = Column(DateTime(timezone=True))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    processing_time_seconds = Column(Float)
    
    # Priority and retry
    priority = Column(Integer, default=5)  # 1-10, higher is more priority
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # Audit
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    agent = relationship("Agent", back_populates="tasks")
    created_by_user = relationship("User", back_populates="tasks")

    # Indexes
    __table_args__ = (
        Index('ix_agent_tasks_status_priority', 'status', 'priority'),
        Index('ix_agent_tasks_tenant_agent', 'tenant_id', 'agent_id'),
    )

class Campaign(Base):
    """Marketing campaign management"""
    __tablename__ = "campaigns"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT, nullable=False, index=True)
    
    # Relationships
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Campaign configuration
    business_vertical = Column(Enum(BusinessVertical), nullable=False)
    target_audience = Column(JSONB, default={})
    automation_config = Column(JSONB, default={})
    
    # Goals and metrics
    target_metrics = Column(JSONB, default={})
    performance_metrics = Column(JSONB, default={})
    budget = Column(Float)
    
    # Timeline
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    
    # Audit
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="campaigns")
    content_pieces = relationship("ContentPiece", back_populates="campaign", cascade="all, delete-orphan")
    intelligence_reports = relationship("CompetitorIntelligence", back_populates="campaign", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_campaigns_tenant_status', 'tenant_id', 'status'),
        Index('ix_campaigns_vertical_status', 'business_vertical', 'status'),
    )

class ContentPiece(Base):
    """Content management"""
    __tablename__ = "content_pieces"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    content_type = Column(Enum(ContentType), nullable=False, index=True)
    content_body = Column(Text, nullable=False)
    
    # Relationships
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Content metadata
    platform = Column(String(50))  # linkedin, twitter, youtube, etc.
    business_vertical = Column(Enum(BusinessVertical), nullable=False)
    metadata = Column(JSONB, default={})
    
    # Performance tracking
    performance_metrics = Column(JSONB, default={})
    engagement_score = Column(Float, default=0.0)
    conversion_metrics = Column(JSONB, default={})
    
    # Publishing
    is_published = Column(Boolean, default=False, nullable=False)
    published_at = Column(DateTime(timezone=True))
    scheduled_for = Column(DateTime(timezone=True))
    
    # SEO and tags
    seo_tags = Column(ARRAY(String), default=[])
    keywords = Column(ARRAY(String), default=[])
    
    # Audit
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    campaign = relationship("Campaign", back_populates="content_pieces")
    created_by_user = relationship("User", back_populates="content_pieces")

    # Indexes
    __table_args__ = (
        Index('ix_content_tenant_type', 'tenant_id', 'content_type'),
        Index('ix_content_campaign_type', 'campaign_id', 'content_type'),
        Index('ix_content_published', 'is_published', 'published_at'),
    )

class CompetitorIntelligence(Base):
    """Competitor intelligence data"""
    __tablename__ = "competitor_intelligence"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    competitor_name = Column(String(255), nullable=False, index=True)
    monitoring_type = Column(String(100), nullable=False)  # pricing, features, marketing, etc.
    
    # Relationships
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Intelligence data
    data_snapshot = Column(JSONB, nullable=False)
    changes_detected = Column(JSONB, default=[])
    content_hash = Column(String(64), nullable=False)  # MD5 hash for change detection
    
    # Analysis
    sentiment_score = Column(Float, default=0.0)
    threat_level = Column(String(20), default="low")  # low, medium, high, critical
    opportunity_score = Column(Float, default=0.0)
    
    # Audit
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    campaign = relationship("Campaign", back_populates="intelligence_reports")
    alerts = relationship("StrategicAlert", back_populates="intelligence_source", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_intelligence_competitor_type', 'competitor_name', 'monitoring_type'),
        Index('ix_intelligence_tenant_created', 'tenant_id', 'created_at'),
        Index('ix_intelligence_threat_level', 'threat_level'),
    )

class StrategicAlert(Base):
    """Strategic alerts and notifications"""
    __tablename__ = "strategic_alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    alert_type = Column(String(100), nullable=False, index=True)
    severity = Column(String(20), nullable=False, index=True)  # low, medium, high, critical
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    
    # Relationships
    intelligence_id = Column(UUID(as_uuid=True), ForeignKey("competitor_intelligence.id"), index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Alert data
    recommended_action = Column(Text)
    impact_assessment = Column(Text)
    metadata = Column(JSONB, default={})
    
    # Status
    is_resolved = Column(Boolean, default=False, nullable=False, index=True)
    resolved_at = Column(DateTime(timezone=True))
    resolved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    resolution_notes = Column(Text)
    
    # Audit
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    intelligence_source = relationship("CompetitorIntelligence", back_populates="alerts")

    # Indexes
    __table_args__ = (
        Index('ix_alerts_tenant_severity', 'tenant_id', 'severity'),
        Index('ix_alerts_resolved_created', 'is_resolved', 'created_at'),
    )

class IntegrationConfig(Base):
    """Third-party integration configurations"""
    __tablename__ = "integration_configs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    integration_name = Column(String(100), nullable=False, index=True)
    integration_type = Column(String(50), nullable=False)  # webflow, social_media, crm, etc.
    
    # Tenant isolation
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Configuration
    config_data = Column(JSONB, nullable=False)
    credentials = Column(JSONB)  # Encrypted in production
    api_endpoints = Column(JSONB, default={})
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    last_sync = Column(DateTime(timezone=True))
    sync_status = Column(String(50), default="pending")
    error_message = Column(Text)
    
    # Rate limiting
    rate_limit_per_hour = Column(Integer, default=1000)
    requests_this_hour = Column(Integer, default=0)
    rate_limit_reset_at = Column(DateTime(timezone=True))
    
    # Audit
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index('ix_integrations_tenant_type', 'tenant_id', 'integration_type'),
        Index('ix_integrations_active_sync', 'is_active', 'last_sync'),
    )

class PerformanceMetric(Base):
    """Performance metrics tracking"""
    __tablename__ = "performance_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_name = Column(String(255), nullable=False, index=True)
    metric_type = Column(String(100), nullable=False)  # component, campaign, system, etc.
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # ID of related entity
    
    # Tenant isolation
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Metric data
    value = Column(Float, nullable=False)
    unit = Column(String(50))
    metadata = Column(JSONB, default={})
    
    # Time series
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Tags for filtering
    tags = Column(ARRAY(String), default=[])

    # Indexes
    __table_args__ = (
        Index('ix_metrics_tenant_name_recorded', 'tenant_id', 'metric_name', 'recorded_at'),
        Index('ix_metrics_entity_recorded', 'entity_id', 'recorded_at'),
        Index('ix_metrics_type_recorded', 'metric_type', 'recorded_at'),
    )

class AuditLog(Base):
    """Audit logging for compliance and debugging"""
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Event details
    event_type = Column(String(100), nullable=False, index=True)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # User and tenant context
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Event data
    old_values = Column(JSONB)
    new_values = Column(JSONB)
    changes = Column(JSONB)
    metadata = Column(JSONB, default={})
    
    # Request context
    ip_address = Column(String(45))
    user_agent = Column(Text)
    request_id = Column(UUID(as_uuid=True))
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    # Indexes
    __table_args__ = (
        Index('ix_audit_tenant_created', 'tenant_id', 'created_at'),
        Index('ix_audit_user_created', 'user_id', 'created_at'),
        Index('ix_audit_entity', 'entity_type', 'entity_id'),
    )

# Database utilities

def get_model_by_name(model_name: str):
    """Get model class by name"""
    models = {
        'User': User,
        'Agent': Agent, 
        'AgentTask': AgentTask,
        'Campaign': Campaign,
        'ContentPiece': ContentPiece,
        'CompetitorIntelligence': CompetitorIntelligence,
        'StrategicAlert': StrategicAlert,
        'IntegrationConfig': IntegrationConfig,
        'PerformanceMetric': PerformanceMetric,
        'AuditLog': AuditLog
    }
    return models.get(model_name)

def create_tables(engine):
    """Create all tables"""
    Base.metadata.create_all(bind=engine)

def drop_tables(engine):
    """Drop all tables (use with caution!)"""
    Base.metadata.drop_all(bind=engine)