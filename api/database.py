# PostgreSQL Database Module for NeoSync™
# TAURUS AI CORP - FZCO | Replaces GridDB

import os
import json
import asyncpg
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neosync:neosync_secure_2026@localhost:5432/neosync")


class PostgresClient:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None

    async def init(self):
        """Initialize connection pool"""
        self.pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
        logger.info("PostgreSQL connection pool initialized")

    async def close(self):
        """Close connection pool"""
        if self.pool:
            await self.pool.close()

    async def execute(self, query: str, *args):
        async with self.pool.acquire() as conn:
            return await conn.execute(query, *args)

    async def fetch(self, query: str, *args):
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(query, *args)
            return [dict(r) for r in rows]

    async def fetchrow(self, query: str, *args):
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(query, *args)
            return dict(row) if row else None

    # ── USERS ──
    async def get_user_by_email(self, email: str) -> Optional[Dict]:
        return await self.fetchrow("SELECT * FROM users WHERE email = $1", email)

    async def create_user(self, email: str, hashed_password: str, role: str = "employee") -> Dict:
        row = await self.fetchrow(
            "INSERT INTO users (email, hashed_password, role) VALUES ($1, $2, $3) RETURNING *",
            email, hashed_password, role
        )
        return row

    # ── CAMPAIGNS ──
    async def get_campaigns(self, platform: Optional[str] = None, status: Optional[str] = None, user_id: Optional[int] = None) -> List[Dict]:
        query = "SELECT * FROM campaigns WHERE 1=1"
        params = []
        idx = 1
        if platform:
            query += f" AND platform = ${idx}"
            params.append(platform)
            idx += 1
        if status:
            query += f" AND status = ${idx}"
            params.append(status)
            idx += 1
        if user_id:
            query += f" AND user_id = ${idx}"
            params.append(user_id)
            idx += 1
        query += " ORDER BY created_at DESC"
        return await self.fetch(query, *params)

    async def get_campaign_by_id(self, campaign_id: int) -> Optional[Dict]:
        return await self.fetchrow("SELECT * FROM campaigns WHERE id = $1", campaign_id)

    async def create_campaign(self, data: Dict) -> Dict:
        row = await self.fetchrow(
            """INSERT INTO campaigns (user_id, name, objective, platform, status, start_date, end_date, budget_daily, budget_total, targeting_json, creatives_json)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *""",
            data.get("user_id"), data["name"], data.get("objective", ""), data.get("platform", ""),
            data.get("status", "draft"), data.get("start_date"), data.get("end_date"),
            data.get("budget_daily", 0), data.get("budget_total", 0),
            json.dumps(data.get("targeting_json", {})), json.dumps(data.get("creatives_json", []))
        )
        return row

    async def update_campaign(self, campaign_id: int, updates: Dict) -> Optional[Dict]:
        set_clauses = []
        params = []
        idx = 1
        for key, value in updates.items():
            if key in ["targeting_json", "creatives_json"]:
                set_clauses.append(f"{key} = ${idx}::jsonb")
                params.append(json.dumps(value))
            else:
                set_clauses.append(f"{key} = ${idx}")
                params.append(value)
            idx += 1
        set_clauses.append("updated_at = NOW()")
        params.append(campaign_id)
        query = f"UPDATE campaigns SET {', '.join(set_clauses)} WHERE id = ${idx} RETURNING *"
        return await self.fetchrow(query, *params)

    # ── ASSETS ──
    async def get_assets(self, skip: int = 0, limit: int = 10) -> List[Dict]:
        return await self.fetch("SELECT * FROM assets ORDER BY created_at DESC LIMIT $1 OFFSET $2", limit, skip)

    async def create_asset(self, data: Dict) -> Dict:
        row = await self.fetchrow(
            """INSERT INTO assets (user_id, campaign_id, type, file_path, meta_data, tags)
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *""",
            data.get("user_id"), data.get("campaign_id"), data.get("type", ""),
            data.get("file_path", ""), json.dumps(data.get("meta_data", {})),
            data.get("tags", [])
        )
        return row

    # ── ANALYTICS ──
    async def record_analytics(self, campaign_id: int, metric_name: str, metric_value: float, platform: str = "", tags: Dict = None):
        await self.execute(
            "INSERT INTO analytics_events (time, campaign_id, metric_name, metric_value, platform, tags) VALUES (NOW(), $1, $2, $3, $4, $5)",
            campaign_id, metric_name, metric_value, platform, json.dumps(tags or {})
        )

    async def get_analytics(self, campaign_id: Optional[int] = None, time_range: str = "7d", metrics: Optional[str] = None) -> List[Dict]:
        query = f"SELECT * FROM analytics_events WHERE time >= NOW() - INTERVAL '{time_range}'"
        params = []
        if campaign_id:
            query += " AND campaign_id = $1"
            params.append(campaign_id)
        if metrics:
            metric_list = metrics.split(",")
            placeholders = ", ".join([f"${i+1}" for i in range(len(params), len(params) + len(metric_list))])
            query += f" AND metric_name IN ({placeholders})"
            params.extend(metric_list)
        query += " ORDER BY time DESC"
        return await self.fetch(query, *params)

    # ── AGENT SESSIONS ──
    async def create_agent_session(self, data: Dict) -> Dict:
        row = await self.fetchrow(
            """INSERT INTO agent_sessions (agent_type, platform, task_description, status, input_data, priority)
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *""",
            data.get("agent_type", ""), data.get("platform", ""), data.get("task_description", ""),
            data.get("status", "pending"), json.dumps(data.get("input_data", {})), data.get("priority", "medium")
        )
        return row

    async def update_agent_session(self, session_id: int, updates: Dict) -> Optional[Dict]:
        set_clauses = []
        params = []
        idx = 1
        for key, value in updates.items():
            if key in ["input_data", "output_data"]:
                set_clauses.append(f"{key} = ${idx}::jsonb")
                params.append(json.dumps(value))
            else:
                set_clauses.append(f"{key} = ${idx}")
                params.append(value)
            idx += 1
        params.append(session_id)
        query = f"UPDATE agent_sessions SET {', '.join(set_clauses)} WHERE id = ${idx} RETURNING *"
        return await self.fetchrow(query, *params)

    # ── EMBEDDINGS ──
    async def store_embedding(self, content_id: int, content_type: str, embedding: List[float], metadata: Dict = None):
        await self.execute(
            "INSERT INTO content_embeddings (content_id, content_type, embedding, metadata) VALUES ($1, $2, $3, $4)",
            content_id, content_type, embedding, json.dumps(metadata or {})
        )

    async def search_similar(self, embedding: List[float], limit: int = 10) -> List[Dict]:
        return await self.fetch(
            "SELECT *, embedding <=> $1 AS distance FROM content_embeddings ORDER BY distance LIMIT $2",
            embedding, limit
        )


db = PostgresClient()
