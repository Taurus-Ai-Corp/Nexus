"""
🗄️ Taurus AI Corp. - Supabase Integration
Complete data storage and analytics system for the Local AI Empire
"""

import os
import asyncio
import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timedelta
import json
from dataclasses import dataclass, asdict
from enum import Enum

import asyncpg
from supabase import create_client, Client
import pandas as pd

logger = logging.getLogger(__name__)

class DataType(Enum):
    AGENT_EXECUTION = "agent_execution"
    WORKFLOW_RUN = "workflow_run"
    AI_MODEL_USAGE = "ai_model_usage"
    BUSINESS_INTELLIGENCE = "business_intelligence"
    CAMPAIGN_DATA = "campaign_data"
    USER_ANALYTICS = "user_analytics"

@dataclass
class AgentExecutionRecord:
    agent_name: str
    task_type: str
    execution_time: float
    model_used: str
    cost: float = 0.0
    success: bool = True
    parameters: Dict[str, Any] = None
    results: Dict[str, Any] = None
    error_message: str = None
    created_at: datetime = None

@dataclass
class WorkflowRecord:
    workflow_id: str
    workflow_type: str
    agents_used: List[str]
    total_execution_time: float
    total_cost: float
    status: str
    parameters: Dict[str, Any] = None
    results: Dict[str, Any] = None
    models_used: List[str] = None
    created_at: datetime = None

@dataclass
class AIModelUsage:
    model_name: str
    model_type: str  # 'local' or 'cloud'
    tokens_used: int
    cost: float = 0.0
    request_type: str = "chat"
    agent_name: str = None
    created_at: datetime = None

class SupabaseIntegration:
    """Complete Supabase integration for Taurus AI Corp. data management"""
    
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "http://localhost:54322")
        self.supabase_key = os.getenv("SUPABASE_KEY", "your-supabase-key")
        self.local_db_url = "postgresql://postgres:your-super-secret-jwt-token-with-at-least-32-characters-long@localhost:54322/taurus_ai"
        
        # Database connections
        self.supabase_client: Optional[Client] = None
        self.local_db_pool: Optional[asyncpg.Pool] = None
        self.is_local_mode = os.getenv("MODE", "local") == "local"
        
        # Analytics cache
        self.analytics_cache = {}
        self.cache_ttl = 300  # 5 minutes
        
    async def initialize(self):
        """Initialize Supabase integration"""
        logger.info("🗄️ Initializing Supabase integration...")
        
        try:
            if self.is_local_mode:
                # Use local PostgreSQL database
                await self._initialize_local_db()
            else:
                # Use cloud Supabase
                await self._initialize_supabase_client()
                
            logger.info("✅ Supabase integration ready")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Supabase integration: {e}")
            # Fallback to local mode
            if not self.is_local_mode:
                logger.info("🔄 Falling back to local database...")
                self.is_local_mode = True
                await self._initialize_local_db()
    
    async def _initialize_local_db(self):
        """Initialize local PostgreSQL connection"""
        try:
            self.local_db_pool = await asyncpg.create_pool(
                self.local_db_url,
                min_size=2,
                max_size=10,
                command_timeout=60
            )
            logger.info("✅ Local PostgreSQL connected")
        except Exception as e:
            logger.warning(f"⚠️ Local database connection failed: {e}")
            
    async def _initialize_supabase_client(self):
        """Initialize Supabase cloud client"""
        if self.supabase_key and self.supabase_key != "your-supabase-key":
            self.supabase_client = create_client(self.supabase_url, self.supabase_key)
            logger.info("✅ Supabase cloud client connected")
        else:
            raise Exception("Supabase API key not configured")
    
    async def record_agent_execution(self, record: AgentExecutionRecord) -> bool:
        """Record an agent execution in the database"""
        try:
            if record.created_at is None:
                record.created_at = datetime.now()
                
            data = {
                "agent_name": record.agent_name,
                "task_type": record.task_type,
                "execution_time": record.execution_time,
                "model_used": record.model_used,
                "cost": record.cost,
                "success": record.success,
                "parameters": json.dumps(record.parameters) if record.parameters else None,
                "results": json.dumps(record.results) if record.results else None,
                "error_message": record.error_message,
                "created_at": record.created_at.isoformat()
            }
            
            if self.is_local_mode and self.local_db_pool:
                await self._insert_local("agent_usage", data)
            elif self.supabase_client:
                self.supabase_client.table("agent_usage").insert(data).execute()
                
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to record agent execution: {e}")
            return False
    
    async def record_workflow_execution(self, record: WorkflowRecord) -> bool:
        """Record a workflow execution"""
        try:
            if record.created_at is None:
                record.created_at = datetime.now()
                
            data = {
                "workflow_id": record.workflow_id,
                "workflow_type": record.workflow_type,
                "agents_used": json.dumps(record.agents_used),
                "parameters": json.dumps(record.parameters) if record.parameters else None,
                "results": json.dumps(record.results) if record.results else None,
                "execution_time": record.total_execution_time,
                "costs": json.dumps({"total": record.total_cost}),
                "models_used": json.dumps(record.models_used) if record.models_used else None,
                "status": record.status,
                "created_at": record.created_at.isoformat()
            }
            
            if self.is_local_mode and self.local_db_pool:
                await self._insert_local("workflow_executions", data)
            elif self.supabase_client:
                self.supabase_client.table("workflow_executions").insert(data).execute()
                
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to record workflow execution: {e}")
            return False
    
    async def record_ai_model_usage(self, usage: AIModelUsage) -> bool:
        """Record AI model usage statistics"""
        try:
            if usage.created_at is None:
                usage.created_at = datetime.now()
                
            data = {
                "model_name": usage.model_name,
                "model_type": usage.model_type,
                "tokens_used": usage.tokens_used,
                "cost": usage.cost,
                "request_type": usage.request_type,
                "agent_name": usage.agent_name,
                "created_at": usage.created_at.isoformat()
            }
            
            if self.is_local_mode and self.local_db_pool:
                await self._insert_local("ai_model_usage", data)
            elif self.supabase_client:
                self.supabase_client.table("ai_model_usage").insert(data).execute()
                
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to record AI model usage: {e}")
            return False
    
    async def store_business_intelligence(self, 
                                        domain: str, 
                                        intelligence_type: str,
                                        data: Dict[str, Any],
                                        embeddings: List[float] = None,
                                        metadata: Dict[str, Any] = None,
                                        confidence_score: float = None) -> bool:
        """Store business intelligence data with optional vector embeddings"""
        try:
            record = {
                "business_domain": domain,
                "intelligence_type": intelligence_type,
                "data": json.dumps(data),
                "embeddings": embeddings,
                "metadata": json.dumps(metadata) if metadata else None,
                "confidence_score": confidence_score,
                "created_by": "taurus_ai_system",
                "created_at": datetime.now().isoformat()
            }
            
            if self.is_local_mode and self.local_db_pool:
                await self._insert_local("business_intelligence", record)
            elif self.supabase_client:
                self.supabase_client.table("business_intelligence").insert(record).execute()
                
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to store business intelligence: {e}")
            return False
    
    async def get_agent_analytics(self, 
                                agent_name: str = None, 
                                days: int = 30) -> Dict[str, Any]:
        """Get comprehensive agent analytics"""
        cache_key = f"agent_analytics_{agent_name}_{days}"
        
        # Check cache first
        if cache_key in self.analytics_cache:
            cached_data, cache_time = self.analytics_cache[cache_key]
            if datetime.now() - cache_time < timedelta(seconds=self.cache_ttl):
                return cached_data
        
        try:
            start_date = datetime.now() - timedelta(days=days)
            
            if self.is_local_mode and self.local_db_pool:
                analytics = await self._get_local_agent_analytics(agent_name, start_date)
            elif self.supabase_client:
                analytics = await self._get_supabase_agent_analytics(agent_name, start_date)
            else:
                return {"error": "No database connection available"}
            
            # Cache the result
            self.analytics_cache[cache_key] = (analytics, datetime.now())
            return analytics
            
        except Exception as e:
            logger.error(f"❌ Failed to get agent analytics: {e}")
            return {"error": str(e)}
    
    async def get_cost_analytics(self, days: int = 30) -> Dict[str, Any]:
        """Get comprehensive cost analytics"""
        try:
            start_date = datetime.now() - timedelta(days=days)
            
            if self.is_local_mode and self.local_db_pool:
                return await self._get_local_cost_analytics(start_date)
            elif self.supabase_client:
                return await self._get_supabase_cost_analytics(start_date)
            else:
                return {"error": "No database connection available"}
                
        except Exception as e:
            logger.error(f"❌ Failed to get cost analytics: {e}")
            return {"error": str(e)}
    
    async def get_business_intelligence(self, 
                                      domain: str = None,
                                      intelligence_type: str = None,
                                      limit: int = 100) -> List[Dict[str, Any]]:
        """Retrieve business intelligence data"""
        try:
            query_conditions = []
            params = []
            
            if domain:
                query_conditions.append("business_domain = ${}".format(len(params) + 1))
                params.append(domain)
            
            if intelligence_type:
                query_conditions.append("intelligence_type = ${}".format(len(params) + 1))
                params.append(intelligence_type)
            
            where_clause = " WHERE " + " AND ".join(query_conditions) if query_conditions else ""
            
            if self.is_local_mode and self.local_db_pool:
                query = f"""
                SELECT business_domain, intelligence_type, data, metadata, 
                       confidence_score, created_at
                FROM business_intelligence
                {where_clause}
                ORDER BY created_at DESC
                LIMIT ${len(params) + 1}
                """
                params.append(limit)
                
                async with self.local_db_pool.acquire() as conn:
                    rows = await conn.fetch(query, *params)
                    return [dict(row) for row in rows]
            
            elif self.supabase_client:
                query = self.supabase_client.table("business_intelligence").select("*")
                
                if domain:
                    query = query.eq("business_domain", domain)
                if intelligence_type:
                    query = query.eq("intelligence_type", intelligence_type)
                
                response = query.order("created_at", desc=True).limit(limit).execute()
                return response.data
            
            return []
            
        except Exception as e:
            logger.error(f"❌ Failed to retrieve business intelligence: {e}")
            return []
    
    async def _insert_local(self, table: str, data: Dict[str, Any]):
        """Insert data into local PostgreSQL"""
        if not self.local_db_pool:
            raise Exception("Local database pool not available")
            
        # Convert data keys and values for SQL insertion
        columns = list(data.keys())
        placeholders = [f"${i+1}" for i in range(len(columns))]
        values = list(data.values())
        
        query = f"""
        INSERT INTO {table} ({', '.join(columns)})
        VALUES ({', '.join(placeholders)})
        """
        
        async with self.local_db_pool.acquire() as conn:
            await conn.execute(query, *values)
    
    async def _get_local_agent_analytics(self, agent_name: str, start_date: datetime) -> Dict[str, Any]:
        """Get agent analytics from local database"""
        async with self.local_db_pool.acquire() as conn:
            # Base query conditions
            where_conditions = ["created_at >= $1"]
            params = [start_date]
            
            if agent_name:
                where_conditions.append("agent_name = $2")
                params.append(agent_name)
            
            where_clause = " AND ".join(where_conditions)
            
            # Get basic statistics
            stats_query = f"""
            SELECT 
                COUNT(*) as total_executions,
                AVG(execution_time) as avg_execution_time,
                SUM(cost) as total_cost,
                SUM(CASE WHEN success THEN 1 ELSE 0 END)::float / COUNT(*) as success_rate,
                COUNT(DISTINCT agent_name) as unique_agents
            FROM agent_usage
            WHERE {where_clause}
            """
            
            stats = await conn.fetchrow(stats_query, *params)
            
            # Get top agents
            top_agents_query = f"""
            SELECT agent_name, COUNT(*) as execution_count, SUM(cost) as total_cost
            FROM agent_usage
            WHERE {where_clause}
            GROUP BY agent_name
            ORDER BY execution_count DESC
            LIMIT 10
            """
            
            top_agents = await conn.fetch(top_agents_query, *params)
            
            # Get model usage
            model_usage_query = f"""
            SELECT model_used, COUNT(*) as usage_count, SUM(cost) as total_cost
            FROM agent_usage
            WHERE {where_clause}
            GROUP BY model_used
            ORDER BY usage_count DESC
            """
            
            model_usage = await conn.fetch(model_usage_query, *params)
            
            return {
                "summary": dict(stats) if stats else {},
                "top_agents": [dict(row) for row in top_agents],
                "model_usage": [dict(row) for row in model_usage],
                "period": f"Last {(datetime.now() - start_date).days} days"
            }
    
    async def _get_local_cost_analytics(self, start_date: datetime) -> Dict[str, Any]:
        """Get cost analytics from local database"""
        async with self.local_db_pool.acquire() as conn:
            # Total costs by model type
            cost_by_type_query = """
            SELECT 
                CASE 
                    WHEN model_name LIKE 'local:%' THEN 'local'
                    ELSE 'cloud'
                END as model_type,
                SUM(cost) as total_cost,
                COUNT(*) as request_count
            FROM ai_model_usage
            WHERE created_at >= $1
            GROUP BY model_type
            """
            
            cost_by_type = await conn.fetch(cost_by_type_query, start_date)
            
            # Daily cost trends
            daily_costs_query = """
            SELECT 
                DATE(created_at) as date,
                SUM(cost) as daily_cost,
                COUNT(*) as daily_requests
            FROM ai_model_usage
            WHERE created_at >= $1
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            LIMIT 30
            """
            
            daily_costs = await conn.fetch(daily_costs_query, start_date)
            
            # Most expensive agents
            expensive_agents_query = """
            SELECT 
                agent_name,
                SUM(cost) as total_cost,
                COUNT(*) as execution_count,
                AVG(cost) as avg_cost_per_execution
            FROM agent_usage
            WHERE created_at >= $1 AND cost > 0
            GROUP BY agent_name
            ORDER BY total_cost DESC
            LIMIT 10
            """
            
            expensive_agents = await conn.fetch(expensive_agents_query, start_date)
            
            return {
                "cost_by_type": [dict(row) for row in cost_by_type],
                "daily_trends": [dict(row) for row in daily_costs],
                "expensive_agents": [dict(row) for row in expensive_agents],
                "period": f"Last {(datetime.now() - start_date).days} days"
            }
    
    async def get_empire_dashboard(self) -> Dict[str, Any]:
        """Get comprehensive empire dashboard data"""
        try:
            # Get current stats
            today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            week_ago = today - timedelta(days=7)
            month_ago = today - timedelta(days=30)
            
            dashboard = {
                "empire_status": "active",
                "total_agents": 3,  # Current registry count
                "total_capabilities": 36,
                "business_domains": 12,
                "costs": {
                    "today": 0.0,
                    "this_week": 0.0,
                    "this_month": 0.0,
                    "local_savings": "100%"  # All local development
                },
                "usage_stats": {
                    "total_executions": 0,
                    "successful_executions": 0,
                    "avg_execution_time": 0.0,
                    "success_rate": 0.0
                },
                "model_distribution": {
                    "local": 0,
                    "cloud": 0
                },
                "last_updated": datetime.now().isoformat()
            }
            
            # Get real usage data if available
            if self.is_local_mode and self.local_db_pool:
                async with self.local_db_pool.acquire() as conn:
                    # Total executions
                    total_executions = await conn.fetchval(
                        "SELECT COUNT(*) FROM agent_usage"
                    )
                    if total_executions:
                        dashboard["usage_stats"]["total_executions"] = total_executions
                    
                    # Success rate
                    success_rate = await conn.fetchval(
                        "SELECT SUM(CASE WHEN success THEN 1 ELSE 0 END)::float / COUNT(*) FROM agent_usage"
                    )
                    if success_rate:
                        dashboard["usage_stats"]["success_rate"] = round(success_rate * 100, 2)
                    
                    # Model distribution
                    model_stats = await conn.fetch("""
                        SELECT 
                            CASE WHEN model_used LIKE 'local:%' THEN 'local' ELSE 'cloud' END as type,
                            COUNT(*) as count
                        FROM agent_usage 
                        GROUP BY type
                    """)
                    
                    for stat in model_stats:
                        dashboard["model_distribution"][stat["type"]] = stat["count"]
            
            return dashboard
            
        except Exception as e:
            logger.error(f"❌ Failed to get empire dashboard: {e}")
            return {
                "error": str(e),
                "empire_status": "error",
                "last_updated": datetime.now().isoformat()
            }
    
    async def cleanup(self):
        """Cleanup database connections"""
        logger.info("🧹 Cleaning up Supabase integration...")
        
        if self.local_db_pool:
            await self.local_db_pool.close()
        
        self.analytics_cache.clear()

# Global instance
supabase_integration = None

def get_supabase_integration() -> SupabaseIntegration:
    """Get the global Supabase integration instance"""
    global supabase_integration
    if supabase_integration is None:
        supabase_integration = SupabaseIntegration()
    return supabase_integration