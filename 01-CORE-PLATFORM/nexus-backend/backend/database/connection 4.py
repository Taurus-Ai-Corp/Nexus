#!/usr/bin/env python3
"""
TAURUS AI CORP - Database Connection Manager
PostgreSQL and Redis connection management with connection pooling
"""

import asyncio
import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import redis.asyncio as redis
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Configure logging
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Centralized database connection manager"""

    def __init__(self):
        self.postgres_engine = None
        self.postgres_session_factory = None
        self.redis_client = None
        self._is_initialized = False

    async def initialize(self,
                        postgres_url: str = "postgresql+asyncpg://user:pass@localhost/taurus",
                        redis_url: str = "redis://localhost:6379",
                        postgres_pool_size: int = 10,
                        postgres_max_overflow: int = 20,
                        redis_max_connections: int = 20):
        """Initialize database connections"""
        try:
            logger.info("Initializing database connections...")

            # Initialize PostgreSQL
            await self._initialize_postgres(postgres_url, postgres_pool_size, postgres_max_overflow)

            # Initialize Redis
            await self._initialize_redis(redis_url, redis_max_connections)

            self._is_initialized = True
            logger.info("✅ Database connections initialized successfully")

        except Exception as e:
            logger.error(f"❌ Database initialization failed: {e}")
            raise

    async def _initialize_postgres(self, postgres_url: str, pool_size: int, max_overflow: int):
        """Initialize PostgreSQL connection"""
        try:
            # Create async engine with connection pooling
            self.postgres_engine = create_async_engine(
                postgres_url,
                echo=False,  # Set to True for SQL debugging
                pool_size=pool_size,
                max_overflow=max_overflow,
                pool_timeout=30,
                pool_recycle=3600,  # Recycle connections every hour
                pool_pre_ping=True,  # Validate connections before use
            )

            # Create session factory
            self.postgres_session_factory = async_sessionmaker(
                self.postgres_engine,
                class_=AsyncSession,
                expire_on_commit=False
            )

            # Test connection
            async with self.postgres_session_factory() as session:
                result = await session.execute("SELECT 1")
                assert result.scalar() == 1

            logger.info("✅ PostgreSQL connection established")

        except Exception as e:
            logger.error(f"❌ PostgreSQL connection failed: {e}")
            raise

    async def _initialize_redis(self, redis_url: str, max_connections: int):
        """Initialize Redis connection"""
        try:
            # Create connection pool
            connection_pool = redis.ConnectionPool.from_url(
                redis_url,
                max_connections=max_connections,
                retry_on_timeout=True,
                decode_responses=True
            )

            # Create Redis client
            self.redis_client = redis.Redis(
                connection_pool=connection_pool,
                socket_keepalive=True,
                socket_keepalive_options={},
                health_check_interval=30
            )

            # Test connection
            await self.redis_client.ping()

            logger.info("✅ Redis connection established")

        except Exception as e:
            logger.error(f"❌ Redis connection failed: {e}")
            raise

    @asynccontextmanager
    async def get_db_session(self) -> AsyncGenerator[AsyncSession, None]:
        """Get PostgreSQL database session"""
        if not self._is_initialized:
            raise RuntimeError("Database manager not initialized")

        async with self.postgres_session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()

    async def get_redis_client(self) -> redis.Redis:
        """Get Redis client"""
        if not self._is_initialized:
            raise RuntimeError("Database manager not initialized")

        if not self.redis_client:
            raise RuntimeError("Redis client not available")

        return self.redis_client

    async def close(self):
        """Close all database connections"""
        logger.info("Closing database connections...")

        try:
            # Close PostgreSQL
            if self.postgres_engine:
                await self.postgres_engine.dispose()
                logger.info("✅ PostgreSQL connections closed")

            # Close Redis
            if self.redis_client:
                await self.redis_client.close()
                logger.info("✅ Redis connections closed")

        except Exception as e:
            logger.error(f"⚠️ Error closing database connections: {e}")

        self._is_initialized = False

    async def health_check(self) -> dict:
        """Check database health status"""
        health = {
            "postgres": {"status": "unknown", "error": None},
            "redis": {"status": "unknown", "error": None},
            "timestamp": asyncio.get_event_loop().time()
        }

        # Check PostgreSQL
        try:
            if self.postgres_session_factory:
                async with self.postgres_session_factory() as session:
                    result = await session.execute("SELECT 1")
                    if result.scalar() == 1:
                        health["postgres"]["status"] = "healthy"
                    else:
                        health["postgres"]["status"] = "unhealthy"
                        health["postgres"]["error"] = "Query returned unexpected result"
            else:
                health["postgres"]["status"] = "not_initialized"
        except Exception as e:
            health["postgres"]["status"] = "unhealthy"
            health["postgres"]["error"] = str(e)

        # Check Redis
        try:
            if self.redis_client:
                pong = await self.redis_client.ping()
                if pong:
                    health["redis"]["status"] = "healthy"
                else:
                    health["redis"]["status"] = "unhealthy"
                    health["redis"]["error"] = "Ping failed"
            else:
                health["redis"]["status"] = "not_initialized"
        except Exception as e:
            health["redis"]["status"] = "unhealthy"
            health["redis"]["error"] = str(e)

        return health

# Global database manager instance
db_manager = DatabaseManager()

# Dependency injection for FastAPI
async def get_database_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for database session"""
    async with db_manager.get_db_session() as session:
        yield session

async def get_redis_client() -> redis.Redis:
    """FastAPI dependency for Redis client"""
    return await db_manager.get_redis_client()

# Redis utilities
class RedisService:
    """High-level Redis service with utilities"""

    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client

    async def cache_set(self, key: str, value: any, ttl: int = 3600) -> bool:
        """Set cache with TTL"""
        try:
            if isinstance(value, (dict, list)):
                import json
                value = json.dumps(value, default=str)

            await self.redis.setex(key, ttl, value)
            return True
        except Exception as e:
            logger.error(f"Cache set failed for key {key}: {e}")
            return False

    async def cache_get(self, key: str, default=None):
        """Get cached value"""
        try:
            value = await self.redis.get(key)
            if value is None:
                return default

            # Try to parse as JSON
            try:
                import json
                return json.loads(value)
            except:
                return value

        except Exception as e:
            logger.error(f"Cache get failed for key {key}: {e}")
            return default

    async def cache_delete(self, key: str) -> bool:
        """Delete cache key"""
        try:
            result = await self.redis.delete(key)
            return result > 0
        except Exception as e:
            logger.error(f"Cache delete failed for key {key}: {e}")
            return False

    async def cache_exists(self, key: str) -> bool:
        """Check if cache key exists"""
        try:
            result = await self.redis.exists(key)
            return result > 0
        except Exception as e:
            logger.error(f"Cache exists check failed for key {key}: {e}")
            return False

    async def cache_keys(self, pattern: str) -> list:
        """Get keys matching pattern"""
        try:
            return await self.redis.keys(pattern)
        except Exception as e:
            logger.error(f"Cache keys search failed for pattern {pattern}: {e}")
            return []

    async def cache_increment(self, key: str, amount: int = 1) -> int:
        """Increment counter"""
        try:
            return await self.redis.incr(key, amount)
        except Exception as e:
            logger.error(f"Cache increment failed for key {key}: {e}")
            return 0

    async def cache_decrement(self, key: str, amount: int = 1) -> int:
        """Decrement counter"""
        try:
            return await self.redis.decr(key, amount)
        except Exception as e:
            logger.error(f"Cache decrement failed for key {key}: {e}")
            return 0

    async def pub_sub_publish(self, channel: str, message: any) -> int:
        """Publish message to channel"""
        try:
            if isinstance(message, (dict, list)):
                import json
                message = json.dumps(message, default=str)

            return await self.redis.publish(channel, message)
        except Exception as e:
            logger.error(f"Pub/Sub publish failed for channel {channel}: {e}")
            return 0

    async def rate_limit_check(self, key: str, limit: int, window: int = 3600) -> tuple:
        """Rate limiting check (returns (allowed, remaining, reset_time))"""
        try:
            pipe = self.redis.pipeline()
            pipe.incr(key)
            pipe.expire(key, window)
            results = await pipe.execute()

            current = results[0]

            if current <= limit:
                return True, limit - current, window
            else:
                return False, 0, window

        except Exception as e:
            logger.error(f"Rate limit check failed for key {key}: {e}")
            return True, limit, window  # Fail open

    async def session_store(self, session_id: str, data: dict, ttl: int = 86400) -> bool:
        """Store session data"""
        try:
            import json
            session_key = f"session:{session_id}"
            session_data = json.dumps(data, default=str)
            await self.redis.setex(session_key, ttl, session_data)
            return True
        except Exception as e:
            logger.error(f"Session store failed for {session_id}: {e}")
            return False

    async def session_get(self, session_id: str) -> dict:
        """Get session data"""
        try:
            session_key = f"session:{session_id}"
            data = await self.redis.get(session_key)
            if data:
                import json
                return json.loads(data)
            return {}
        except Exception as e:
            logger.error(f"Session get failed for {session_id}: {e}")
            return {}

    async def session_delete(self, session_id: str) -> bool:
        """Delete session"""
        try:
            session_key = f"session:{session_id}"
            result = await self.redis.delete(session_key)
            return result > 0
        except Exception as e:
            logger.error(f"Session delete failed for {session_id}: {e}")
            return False

# Database migration utilities
async def run_migrations():
    """Run database migrations"""
    try:
        logger.info("Running database migrations...")

        # Import models to ensure they're registered
        from .models import Base

        if db_manager.postgres_engine:
            # In production, use Alembic for migrations
            # For now, create tables directly
            async with db_manager.postgres_engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            logger.info("✅ Database migrations completed")
        else:
            logger.error("❌ No database engine available for migrations")

    except Exception as e:
        logger.error(f"❌ Database migration failed: {e}")
        raise

# Seed initial data
async def seed_initial_data():
    """Seed initial data"""
    try:
        logger.info("Seeding initial data...")

        from .models import Agent, AgentType

        async with db_manager.get_db_session() as session:
            # Check if agents already exist
            result = await session.execute("SELECT COUNT(*) FROM agents")
            count = result.scalar()

            if count == 0:
                # Create initial agents
                initial_agents = [
                    Agent(
                        name="intelligence_research",
                        agent_type=AgentType.INTELLIGENCE_RESEARCH,
                        description="AI-powered research and competitor intelligence",
                        config={"max_concurrent_tasks": 5},
                        capabilities=["web_scraping", "data_analysis", "report_generation"]
                    ),
                    Agent(
                        name="webflow_integration",
                        agent_type=AgentType.WEBFLOW_INTEGRATION,
                        description="Deep Webflow integration for maximum design flexibility",
                        config={"api_rate_limit": 1000},
                        capabilities=["template_cloning", "cms_sync", "design_automation"]
                    ),
                    Agent(
                        name="custom_component_performance",
                        agent_type=AgentType.CUSTOM_COMPONENT_PERFORMANCE,
                        description="Performance monitoring and optimization for custom components",
                        config={"monitoring_interval": 300},
                        capabilities=["lighthouse_testing", "performance_analysis", "optimization_suggestions"]
                    ),
                    Agent(
                        name="performance_analysis",
                        agent_type=AgentType.PERFORMANCE_ANALYSIS,
                        description="Component choice analysis and performance trade-offs",
                        config={"benchmark_frequency": 3600},
                        capabilities=["comparative_analysis", "cost_benefit_analysis", "recommendation_engine"]
                    ),
                    Agent(
                        name="content_social_strategy",
                        agent_type=AgentType.CONTENT_SOCIAL_STRATEGY,
                        description="Content creation for scaling BizFlow™ across social media",
                        config={"content_generation_rate": 10},
                        capabilities=["case_study_generation", "social_media_posts", "video_scripts", "content_calendar"]
                    ),
                    Agent(
                        name="realtime_intelligence",
                        agent_type=AgentType.REALTIME_INTELLIGENCE,
                        description="Real-time competitor monitoring and strategic alerts",
                        config={"monitoring_frequency": 3600},
                        capabilities=["competitor_tracking", "market_analysis", "strategic_alerts", "threat_detection"]
                    )
                ]

                for agent in initial_agents:
                    session.add(agent)

                await session.commit()
                logger.info(f"✅ Seeded {len(initial_agents)} initial agents")
            else:
                logger.info(f"📊 Database already contains {count} agents - skipping seed")

    except Exception as e:
        logger.error(f"❌ Data seeding failed: {e}")
        raise

# Initialize function for FastAPI startup
async def initialize_database():
    """Initialize database for FastAPI application"""
    await db_manager.initialize()
    await run_migrations()
    await seed_initial_data()

# Cleanup function for FastAPI shutdown
async def cleanup_database():
    """Cleanup database connections"""
    await db_manager.close()
