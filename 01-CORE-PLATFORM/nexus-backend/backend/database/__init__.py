#!/usr/bin/env python3
"""
TAURUS AI CORP - Database Package
Database models, connections, and utilities
"""

from .models import (
    # Models
    Base,
    User,
    Agent,
    AgentTask,
    Campaign,
    ContentPiece,
    CompetitorIntelligence,
    StrategicAlert,
    IntegrationConfig,
    PerformanceMetric,
    AuditLog,
    
    # Enums
    UserRole,
    BusinessVertical,
    TaskStatus,
    CampaignStatus,
    AgentType,
    ContentType,
    
    # Utilities
    get_model_by_name,
    create_tables,
    drop_tables
)

from .connection import (
    # Database manager
    DatabaseManager,
    db_manager,
    
    # Dependencies
    get_database_session,
    get_redis_client,
    
    # Services
    RedisService,
    
    # Initialization
    initialize_database,
    cleanup_database,
    run_migrations,
    seed_initial_data
)

from .redis_schemas import (
    # Cache patterns
    CacheKeyPattern,
    CacheTTL,
    
    # Cached data structures
    CachedUser,
    CachedAgent,
    CachedTask,
    CachedIntelligence,
    CachedAlert,
    CachedMetric,
    
    # Redis cache service
    RedisCache
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