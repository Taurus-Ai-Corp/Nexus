#!/usr/bin/env python3
"""
TAURUS AI CORP - Redis Data Schemas
Redis-specific data structures and caching strategies
"""

import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Set
from dataclasses import dataclass, asdict
from enum import Enum
import uuid

# Cache key patterns
class CacheKeyPattern:
    """Standard cache key patterns for consistency"""
    
    # User-related
    USER_BY_ID = "user:{user_id}"
    USER_BY_EMAIL = "user:email:{email}"
    USER_SESSIONS = "user:sessions:{user_id}"
    USER_CAMPAIGNS = "user:campaigns:{user_id}"
    
    # Agent-related
    AGENT_STATUS = "agent:status:{agent_name}"
    AGENT_CONFIG = "agent:config:{agent_name}"
    AGENT_TASKS = "agent:tasks:{agent_name}"
    AGENT_METRICS = "agent:metrics:{agent_name}:{date}"
    
    # Task-related
    TASK_BY_ID = "task:{task_id}"
    TASK_QUEUE = "task:queue:{priority}"
    TASK_RESULTS = "task:results:{task_id}"
    TASK_STATUS = "task:status:{task_id}"
    
    # Campaign-related
    CAMPAIGN_BY_ID = "campaign:{campaign_id}"
    CAMPAIGN_METRICS = "campaign:metrics:{campaign_id}"
    CAMPAIGN_CONTENT = "campaign:content:{campaign_id}"
    
    # Content-related
    CONTENT_BY_ID = "content:{content_id}"
    CONTENT_BY_TYPE = "content:type:{content_type}"
    CONTENT_ANALYTICS = "content:analytics:{content_id}:{date}"
    
    # Intelligence-related
    INTELLIGENCE_COMPETITOR = "intelligence:{competitor_name}:{monitoring_type}"
    INTELLIGENCE_ALERTS = "intelligence:alerts:{severity}"
    INTELLIGENCE_REPORTS = "intelligence:reports:{date}"
    
    # Performance-related
    PERFORMANCE_METRICS = "performance:{entity_type}:{entity_id}:{metric_name}"
    PERFORMANCE_BENCHMARKS = "performance:benchmarks:{component_type}"
    PERFORMANCE_ALERTS = "performance:alerts:{severity}"
    
    # System-related
    SYSTEM_HEALTH = "system:health"
    SYSTEM_CONFIG = "system:config"
    RATE_LIMITS = "rate_limit:{identifier}:{window}"
    
    # Session-related
    SESSION_DATA = "session:{session_id}"
    SESSION_USER = "session:user:{user_id}"

# Cache TTL constants (in seconds)
class CacheTTL:
    """Cache TTL constants for different data types"""
    
    VERY_SHORT = 300      # 5 minutes - Real-time data
    SHORT = 1800          # 30 minutes - Frequently updated
    MEDIUM = 3600         # 1 hour - Regular updates
    LONG = 86400          # 24 hours - Daily updates
    VERY_LONG = 604800    # 7 days - Weekly updates
    PERMANENT = -1        # No expiration

# Redis data structures

@dataclass
class CachedUser:
    """User data structure for Redis caching"""
    id: str
    email: str
    full_name: str
    role: str
    business_vertical: str
    tenant_id: str
    is_active: bool
    last_login: Optional[str] = None
    preferences: Dict[str, Any] = None
    cached_at: str = None
    
    def __post_init__(self):
        if self.cached_at is None:
            self.cached_at = datetime.now().isoformat()
        if self.preferences is None:
            self.preferences = {}

@dataclass
class CachedAgent:
    """Agent data structure for Redis caching"""
    name: str
    agent_type: str
    description: str
    status: str
    config: Dict[str, Any]
    capabilities: List[str]
    health_status: str = "unknown"
    last_health_check: Optional[str] = None
    performance_metrics: Dict[str, float] = None
    cached_at: str = None
    
    def __post_init__(self):
        if self.cached_at is None:
            self.cached_at = datetime.now().isoformat()
        if self.performance_metrics is None:
            self.performance_metrics = {}

@dataclass
class CachedTask:
    """Task data structure for Redis caching"""
    task_id: str
    task_name: str
    task_type: str
    agent_name: str
    status: str
    created_by: str
    parameters: Dict[str, Any]
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: str = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    processing_time: Optional[float] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()

@dataclass
class CachedIntelligence:
    """Intelligence data structure for Redis caching"""
    competitor_name: str
    monitoring_type: str
    data_snapshot: Dict[str, Any]
    changes_detected: List[Dict[str, Any]]
    content_hash: str
    sentiment_score: float
    threat_level: str = "low"
    timestamp: str = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()

@dataclass
class CachedAlert:
    """Alert data structure for Redis caching"""
    alert_id: str
    alert_type: str
    severity: str
    title: str
    description: str
    recommended_action: str
    is_resolved: bool = False
    metadata: Dict[str, Any] = None
    created_at: str = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()
        if self.metadata is None:
            self.metadata = {}

@dataclass
class CachedMetric:
    """Performance metric data structure"""
    metric_name: str
    metric_type: str
    entity_id: str
    value: float
    unit: str
    tags: List[str] = None
    metadata: Dict[str, Any] = None
    recorded_at: str = None
    
    def __post_init__(self):
        if self.recorded_at is None:
            self.recorded_at = datetime.now().isoformat()
        if self.tags is None:
            self.tags = []
        if self.metadata is None:
            self.metadata = {}

# Redis caching service

class RedisCache:
    """High-level Redis caching service"""
    
    def __init__(self, redis_client):
        self.redis = redis_client
    
    # User caching
    async def cache_user(self, user: CachedUser, ttl: int = CacheTTL.LONG) -> bool:
        """Cache user data"""
        try:
            # Cache by ID
            user_key = CacheKeyPattern.USER_BY_ID.format(user_id=user.id)
            await self.redis.setex(user_key, ttl, json.dumps(asdict(user)))
            
            # Cache by email for login lookups
            email_key = CacheKeyPattern.USER_BY_EMAIL.format(email=user.email)
            await self.redis.setex(email_key, ttl, user.id)
            
            return True
        except Exception as e:
            print(f"Failed to cache user {user.id}: {e}")
            return False
    
    async def get_cached_user(self, user_id: str) -> Optional[CachedUser]:
        """Get cached user data"""
        try:
            user_key = CacheKeyPattern.USER_BY_ID.format(user_id=user_id)
            data = await self.redis.get(user_key)
            if data:
                user_dict = json.loads(data)
                return CachedUser(**user_dict)
            return None
        except Exception as e:
            print(f"Failed to get cached user {user_id}: {e}")
            return None
    
    async def get_user_id_by_email(self, email: str) -> Optional[str]:
        """Get user ID by email"""
        try:
            email_key = CacheKeyPattern.USER_BY_EMAIL.format(email=email)
            return await self.redis.get(email_key)
        except Exception as e:
            print(f"Failed to get user ID by email {email}: {e}")
            return None
    
    # Agent caching
    async def cache_agent(self, agent: CachedAgent, ttl: int = CacheTTL.MEDIUM) -> bool:
        """Cache agent data"""
        try:
            agent_key = CacheKeyPattern.AGENT_STATUS.format(agent_name=agent.name)
            await self.redis.setex(agent_key, ttl, json.dumps(asdict(agent)))
            return True
        except Exception as e:
            print(f"Failed to cache agent {agent.name}: {e}")
            return False
    
    async def get_cached_agent(self, agent_name: str) -> Optional[CachedAgent]:
        """Get cached agent data"""
        try:
            agent_key = CacheKeyPattern.AGENT_STATUS.format(agent_name=agent_name)
            data = await self.redis.get(agent_key)
            if data:
                agent_dict = json.loads(data)
                return CachedAgent(**agent_dict)
            return None
        except Exception as e:
            print(f"Failed to get cached agent {agent_name}: {e}")
            return None
    
    async def update_agent_health(self, agent_name: str, health_status: str) -> bool:
        """Update agent health status"""
        try:
            agent = await self.get_cached_agent(agent_name)
            if agent:
                agent.health_status = health_status
                agent.last_health_check = datetime.now().isoformat()
                return await self.cache_agent(agent)
            return False
        except Exception as e:
            print(f"Failed to update agent health {agent_name}: {e}")
            return False
    
    # Task caching
    async def cache_task(self, task: CachedTask, ttl: int = CacheTTL.LONG) -> bool:
        """Cache task data"""
        try:
            task_key = CacheKeyPattern.TASK_BY_ID.format(task_id=task.task_id)
            await self.redis.setex(task_key, ttl, json.dumps(asdict(task)))
            
            # Add to agent's task list
            agent_tasks_key = CacheKeyPattern.AGENT_TASKS.format(agent_name=task.agent_name)
            await self.redis.sadd(agent_tasks_key, task.task_id)
            await self.redis.expire(agent_tasks_key, ttl)
            
            return True
        except Exception as e:
            print(f"Failed to cache task {task.task_id}: {e}")
            return False
    
    async def get_cached_task(self, task_id: str) -> Optional[CachedTask]:
        """Get cached task data"""
        try:
            task_key = CacheKeyPattern.TASK_BY_ID.format(task_id=task_id)
            data = await self.redis.get(task_key)
            if data:
                task_dict = json.loads(data)
                return CachedTask(**task_dict)
            return None
        except Exception as e:
            print(f"Failed to get cached task {task_id}: {e}")
            return None
    
    async def update_task_status(self, task_id: str, status: str, result: Dict[str, Any] = None) -> bool:
        """Update task status"""
        try:
            task = await self.get_cached_task(task_id)
            if task:
                task.status = status
                if status == "running" and not task.started_at:
                    task.started_at = datetime.now().isoformat()
                elif status in ["completed", "failed"] and not task.completed_at:
                    task.completed_at = datetime.now().isoformat()
                    if task.started_at:
                        start_time = datetime.fromisoformat(task.started_at.replace('Z', '+00:00'))
                        end_time = datetime.fromisoformat(task.completed_at.replace('Z', '+00:00'))
                        task.processing_time = (end_time - start_time).total_seconds()
                
                if result:
                    task.result = result
                
                return await self.cache_task(task)
            return False
        except Exception as e:
            print(f"Failed to update task status {task_id}: {e}")
            return False
    
    # Intelligence caching
    async def cache_intelligence(self, intelligence: CachedIntelligence, ttl: int = CacheTTL.MEDIUM) -> bool:
        """Cache intelligence data"""
        try:
            intel_key = CacheKeyPattern.INTELLIGENCE_COMPETITOR.format(
                competitor_name=intelligence.competitor_name,
                monitoring_type=intelligence.monitoring_type
            )
            await self.redis.setex(intel_key, ttl, json.dumps(asdict(intelligence)))
            
            # Add to alerts if high threat level
            if intelligence.threat_level in ["high", "critical"]:
                alerts_key = CacheKeyPattern.INTELLIGENCE_ALERTS.format(severity=intelligence.threat_level)
                await self.redis.sadd(alerts_key, intel_key)
                await self.redis.expire(alerts_key, ttl)
            
            return True
        except Exception as e:
            print(f"Failed to cache intelligence for {intelligence.competitor_name}: {e}")
            return False
    
    async def get_cached_intelligence(self, competitor_name: str, monitoring_type: str) -> Optional[CachedIntelligence]:
        """Get cached intelligence data"""
        try:
            intel_key = CacheKeyPattern.INTELLIGENCE_COMPETITOR.format(
                competitor_name=competitor_name,
                monitoring_type=monitoring_type
            )
            data = await self.redis.get(intel_key)
            if data:
                intel_dict = json.loads(data)
                return CachedIntelligence(**intel_dict)
            return None
        except Exception as e:
            print(f"Failed to get cached intelligence for {competitor_name}: {e}")
            return None
    
    # Alert caching
    async def cache_alert(self, alert: CachedAlert, ttl: int = CacheTTL.VERY_LONG) -> bool:
        """Cache alert data"""
        try:
            alert_key = f"alert:{alert.alert_id}"
            await self.redis.setex(alert_key, ttl, json.dumps(asdict(alert)))
            
            # Add to severity-based alerts
            severity_key = CacheKeyPattern.INTELLIGENCE_ALERTS.format(severity=alert.severity)
            await self.redis.sadd(severity_key, alert.alert_id)
            await self.redis.expire(severity_key, ttl)
            
            return True
        except Exception as e:
            print(f"Failed to cache alert {alert.alert_id}: {e}")
            return False
    
    async def get_cached_alert(self, alert_id: str) -> Optional[CachedAlert]:
        """Get cached alert data"""
        try:
            alert_key = f"alert:{alert_id}"
            data = await self.redis.get(alert_key)
            if data:
                alert_dict = json.loads(data)
                return CachedAlert(**alert_dict)
            return None
        except Exception as e:
            print(f"Failed to get cached alert {alert_id}: {e}")
            return None
    
    async def get_alerts_by_severity(self, severity: str) -> List[CachedAlert]:
        """Get alerts by severity level"""
        try:
            severity_key = CacheKeyPattern.INTELLIGENCE_ALERTS.format(severity=severity)
            alert_ids = await self.redis.smembers(severity_key)
            
            alerts = []
            for alert_id in alert_ids:
                alert = await self.get_cached_alert(alert_id)
                if alert:
                    alerts.append(alert)
            
            return alerts
        except Exception as e:
            print(f"Failed to get alerts by severity {severity}: {e}")
            return []
    
    # Metric caching
    async def cache_metric(self, metric: CachedMetric, ttl: int = CacheTTL.VERY_LONG) -> bool:
        """Cache performance metric"""
        try:
            metric_key = CacheKeyPattern.PERFORMANCE_METRICS.format(
                entity_type=metric.metric_type,
                entity_id=metric.entity_id,
                metric_name=metric.metric_name
            )
            
            # Store as time series (simplified)
            timestamp = metric.recorded_at
            await self.redis.zadd(metric_key, {json.dumps(asdict(metric)): datetime.fromisoformat(timestamp.replace('Z', '+00:00')).timestamp()})
            await self.redis.expire(metric_key, ttl)
            
            return True
        except Exception as e:
            print(f"Failed to cache metric {metric.metric_name}: {e}")
            return False
    
    async def get_metrics_time_series(self, entity_type: str, entity_id: str, metric_name: str, 
                                    hours: int = 24) -> List[CachedMetric]:
        """Get metrics time series"""
        try:
            metric_key = CacheKeyPattern.PERFORMANCE_METRICS.format(
                entity_type=entity_type,
                entity_id=entity_id,
                metric_name=metric_name
            )
            
            # Get metrics from last N hours
            end_time = datetime.now().timestamp()
            start_time = end_time - (hours * 3600)
            
            results = await self.redis.zrangebyscore(metric_key, start_time, end_time, withscores=True)
            
            metrics = []
            for data, score in results:
                metric_dict = json.loads(data)
                metrics.append(CachedMetric(**metric_dict))
            
            return sorted(metrics, key=lambda x: x.recorded_at)
        except Exception as e:
            print(f"Failed to get metrics time series for {metric_name}: {e}")
            return []
    
    # Rate limiting
    async def check_rate_limit(self, identifier: str, limit: int, window: int = 3600) -> tuple:
        """Check rate limit (returns allowed, remaining, reset_time)"""
        try:
            rate_key = CacheKeyPattern.RATE_LIMITS.format(identifier=identifier, window=window)
            
            pipe = self.redis.pipeline()
            pipe.incr(rate_key)
            pipe.expire(rate_key, window)
            results = await pipe.execute()
            
            current = results[0]
            
            if current <= limit:
                return True, limit - current, window
            else:
                return False, 0, window
        except Exception as e:
            print(f"Rate limit check failed for {identifier}: {e}")
            return True, limit, window  # Fail open
    
    # Bulk operations
    async def bulk_cache_agents(self, agents: List[CachedAgent]) -> int:
        """Bulk cache agents"""
        success_count = 0
        for agent in agents:
            if await self.cache_agent(agent):
                success_count += 1
        return success_count
    
    async def bulk_get_tasks(self, task_ids: List[str]) -> List[CachedTask]:
        """Bulk get tasks"""
        tasks = []
        for task_id in task_ids:
            task = await self.get_cached_task(task_id)
            if task:
                tasks.append(task)
        return tasks
    
    # Cleanup operations
    async def cleanup_expired_tasks(self) -> int:
        """Cleanup expired tasks"""
        try:
            pattern = "task:*"
            keys = await self.redis.keys(pattern)
            
            expired_count = 0
            for key in keys:
                ttl = await self.redis.ttl(key)
                if ttl == -2:  # Key doesn't exist
                    expired_count += 1
                elif ttl == -1:  # Key exists but no TTL
                    # Set TTL for keys without expiration
                    await self.redis.expire(key, CacheTTL.LONG)
            
            return expired_count
        except Exception as e:
            print(f"Cleanup expired tasks failed: {e}")
            return 0
    
    async def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            info = await self.redis.info()
            
            # Count keys by pattern
            patterns = {
                'users': 'user:*',
                'agents': 'agent:*',
                'tasks': 'task:*',
                'campaigns': 'campaign:*',
                'content': 'content:*',
                'intelligence': 'intelligence:*',
                'alerts': 'alert:*',
                'sessions': 'session:*'
            }
            
            stats = {
                'redis_info': {
                    'used_memory': info.get('used_memory_human'),
                    'connected_clients': info.get('connected_clients'),
                    'total_connections_received': info.get('total_connections_received'),
                    'uptime_in_seconds': info.get('uptime_in_seconds')
                },
                'key_counts': {}
            }
            
            for category, pattern in patterns.items():
                keys = await self.redis.keys(pattern)
                stats['key_counts'][category] = len(keys)
            
            return stats
        except Exception as e:
            print(f"Failed to get cache stats: {e}")
            return {}