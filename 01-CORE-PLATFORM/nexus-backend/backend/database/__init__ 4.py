#!/usr/bin/env python3
"""
TAURUS AI CORP - Database Package
Database models, connections, and utilities
"""

from .connection import (
    # Database manager
    DatabaseManager,
    # Services
    RedisService,
    cleanup_database,
    db_manager,
    # Dependencies
    get_database_session,
    get_redis_client,
    # Initialization
    initialize_database,
    run_migrations,
    seed_initial_data,
)
from .models import (
    Agent,
    AgentTask,
    AgentType,
    AuditLog,
    # Models
    Base,
    BusinessVertical,
    Campaign,
    CampaignStatus,
    CompetitorIntelligence,
    ContentPiece,
    ContentType,
    IntegrationConfig,
    PerformanceMetric,
    StrategicAlert,
    TaskStatus,
    User,
    # Enums
    UserRole,
    create_tables,
    drop_tables,
    # Utilities
    get_model_by_name,
)
from .redis_schemas import (
    CachedAgent,
    CachedAlert,
    CachedIntelligence,
    CachedMetric,
    CachedTask,
    # Cached data structures
    CachedUser,
    # Cache patterns
    CacheKeyPattern,
    CacheTTL,
    # Redis cache service
    RedisCache,
)

__all__ = [
    # Models
    'Base',
    'User',
    'Agent',
    'AgentTask',
    'Campaign',
    'ContentPiece',
    'CompetitorIntelligence',
    'StrategicAlert',
    'IntegrationConfig',
    'PerformanceMetric',
    'AuditLog',

    # Enums
    'UserRole',
    'BusinessVertical',
    'TaskStatus',
    'CampaignStatus',
    'AgentType',
    'ContentType',

    # Database manager
    'DatabaseManager',
    'db_manager',

    # Dependencies
    'get_database_session',
    'get_redis_client',

    # Services
    'RedisService',
    'RedisCache',

    # Cache utilities
    'CacheKeyPattern',
    'CacheTTL',
    'CachedUser',
    'CachedAgent',
    'CachedTask',
    'CachedIntelligence',
    'CachedAlert',
    'CachedMetric',

    # Initialization
    'initialize_database',
    'cleanup_database',
    'run_migrations',
    'seed_initial_data',

    # Utilities
    'get_model_by_name',
    'create_tables',
    'drop_tables'
]
