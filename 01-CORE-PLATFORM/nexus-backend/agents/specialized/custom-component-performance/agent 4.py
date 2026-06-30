#!/usr/bin/env python3
"""
TAURUS AI CORP - Custom Component Performance Agent
Monitors and optimizes component performance vs Webflow trade-offs
"""

import asyncio
import json
import time
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

import aiofiles
import aiohttp
import psutil
import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker


@dataclass
class PerformanceMetric:
    component_name: str
    load_time: float
    bundle_size: int
    core_web_vitals: dict[str, float]
    lighthouse_score: int
    webflow_equivalent_score: int
    recommendation: str
    timestamp: datetime

class CustomComponentPerformanceAgent:
    """
    Agent responsible for:
    - Analyzing custom React component performance
    - Comparing against Webflow equivalent implementations
    - Monitoring Core Web Vitals and Lighthouse scores
    - Providing component optimization recommendations
    """

    def __init__(self):
        self.name = "custom-component-performance"
        self.description = "Performance analysis and optimization for custom components"
        self.redis_client: redis.Redis | None = None
        self.db_session: AsyncSession | None = None
        self.performance_cache = {}

    async def initialize(self, config: dict[str, Any]):
        """Initialize agent with configuration"""
        # Redis connection for real-time metrics
        self.redis_client = redis.from_url(
            config.get('redis_url', 'redis://localhost:6379'),
            decode_responses=True
        )

        # Database connection for historical data
        engine = create_async_engine(
            config.get('database_url', 'postgresql+asyncpg://user:pass@localhost/taurus'),
            echo=config.get('debug', False)
        )
        async_session = sessionmaker(engine, class_=AsyncSession)
        self.db_session = async_session()

        print(f"✅ {self.name} agent initialized successfully")

    async def analyze_component_performance(self, component_path: str, webflow_equivalent: str = None) -> PerformanceMetric:
        """Analyze custom component performance"""
        try:
            start_time = time.time()

            # Analyze bundle size
            bundle_size = await self._get_bundle_size(component_path)

            # Run Lighthouse analysis
            lighthouse_score = await self._run_lighthouse_test(component_path)

            # Get Core Web Vitals
            core_vitals = await self._measure_core_web_vitals(component_path)

            # Compare with Webflow equivalent if provided
            webflow_score = 0
            if webflow_equivalent:
                webflow_score = await self._analyze_webflow_equivalent(webflow_equivalent)

            load_time = time.time() - start_time

            # Generate recommendation
            recommendation = await self._generate_recommendation(
                lighthouse_score, webflow_score, bundle_size, core_vitals
            )

            metric = PerformanceMetric(
                component_name=Path(component_path).stem,
                load_time=load_time,
                bundle_size=bundle_size,
                core_web_vitals=core_vitals,
                lighthouse_score=lighthouse_score,
                webflow_equivalent_score=webflow_score,
                recommendation=recommendation,
                timestamp=datetime.now()
            )

            # Cache results
            await self._cache_performance_data(metric)

            return metric

        except Exception as e:
            print(f"❌ Performance analysis failed: {e}")
            raise

    async def _get_bundle_size(self, component_path: str) -> int:
        """Calculate component bundle size"""
        try:
            # For React components, analyze JS bundle
            if component_path.endswith('.tsx') or component_path.endswith('.jsx'):
                # Use webpack-bundle-analyzer equivalent
                import os
                stat_info = os.stat(component_path)
                return stat_info.st_size
            return 0
        except Exception:
            return 0

    async def _run_lighthouse_test(self, component_path: str) -> int:
        """Run Lighthouse performance audit"""
        try:
            # Mock Lighthouse test - in production, use actual Lighthouse API
            # For now, return mock score based on component complexity
            async with aiofiles.open(component_path) as f:
                content = await f.read()
                lines = len(content.split('\n'))
                # Simple heuristic: fewer lines = better performance
                score = max(50, 100 - (lines // 10))
                return min(score, 100)
        except Exception:
            return 75  # Default score

    async def _measure_core_web_vitals(self, component_path: str) -> dict[str, float]:
        """Measure Core Web Vitals metrics"""
        try:
            # Mock Core Web Vitals - in production, use real browser metrics
            return {
                "lcp": 2.5,  # Largest Contentful Paint
                "fid": 100,  # First Input Delay
                "cls": 0.1,  # Cumulative Layout Shift
                "fcp": 1.8,  # First Contentful Paint
                "ttfb": 600  # Time to First Byte
            }
        except Exception:
            return {}

    async def _analyze_webflow_equivalent(self, webflow_url: str) -> int:
        """Analyze equivalent Webflow component performance"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(webflow_url) as response:
                    if response.status == 200:
                        # Mock Webflow analysis
                        return 85  # Webflow generally performs well
            return 80
        except Exception:
            return 80

    async def _generate_recommendation(self, lighthouse: int, webflow: int, bundle_size: int, vitals: dict) -> str:
        """Generate optimization recommendation"""
        recommendations = []

        if lighthouse < 90:
            recommendations.append("Optimize component rendering and reduce complexity")

        if bundle_size > 100000:  # 100KB
            recommendations.append("Reduce bundle size through code splitting")

        if vitals.get('lcp', 0) > 2.5:
            recommendations.append("Improve Largest Contentful Paint")

        if vitals.get('cls', 0) > 0.1:
            recommendations.append("Reduce Cumulative Layout Shift")

        if lighthouse < webflow - 10:
            recommendations.append("Consider using Webflow equivalent for better performance")
        elif lighthouse > webflow + 10:
            recommendations.append("Custom component outperforms Webflow - keep custom implementation")

        return "; ".join(recommendations) if recommendations else "Performance is optimal"

    async def _cache_performance_data(self, metric: PerformanceMetric):
        """Cache performance data in Redis"""
        try:
            if self.redis_client:
                key = f"performance:{metric.component_name}:{int(metric.timestamp.timestamp())}"
                await self.redis_client.setex(
                    key,
                    3600,  # 1 hour TTL
                    json.dumps(asdict(metric), default=str)
                )
        except Exception as e:
            print(f"⚠️ Failed to cache performance data: {e}")

    async def monitor_continuous_performance(self):
        """Continuous performance monitoring"""
        while True:
            try:
                # Monitor system resources
                cpu_percent = psutil.cpu_percent()
                memory_percent = psutil.virtual_memory().percent

                if cpu_percent > 80 or memory_percent > 80:
                    print(f"⚠️ High resource usage: CPU {cpu_percent}%, Memory {memory_percent}%")

                # Check performance alerts
                await self._check_performance_alerts()

                await asyncio.sleep(30)  # Check every 30 seconds

            except Exception as e:
                print(f"❌ Monitoring error: {e}")
                await asyncio.sleep(60)

    async def _check_performance_alerts(self):
        """Check for performance degradation alerts"""
        try:
            if self.redis_client:
                # Get recent performance data
                keys = await self.redis_client.keys("performance:*")
                recent_keys = sorted(keys)[-10:]  # Last 10 metrics

                for key in recent_keys:
                    data = await self.redis_client.get(key)
                    if data:
                        metric = json.loads(data)
                        if metric['lighthouse_score'] < 70:
                            print(f"🚨 Performance alert: {metric['component_name']} score: {metric['lighthouse_score']}")
        except Exception as e:
            print(f"⚠️ Alert check failed: {e}")

    async def optimize_component_suggestions(self, component_name: str) -> list[str]:
        """Generate specific optimization suggestions"""
        suggestions = [
            "Implement React.memo() for component memoization",
            "Use lazy loading for heavy components",
            "Optimize images with WebP format and responsive sizing",
            "Implement code splitting with dynamic imports",
            "Use React.Suspense for loading states",
            "Minimize bundle size with tree shaking",
            "Implement service worker for caching",
            "Use CSS-in-JS optimizations",
            "Optimize font loading with font-display: swap",
            "Implement virtual scrolling for long lists"
        ]

        # Return relevant suggestions based on component analysis
        return suggestions[:5]  # Top 5 suggestions

    async def generate_performance_report(self) -> dict[str, Any]:
        """Generate comprehensive performance report"""
        try:
            if not self.redis_client:
                return {"error": "Redis not available"}

            # Get all performance data
            keys = await self.redis_client.keys("performance:*")
            metrics = []

            for key in keys:
                data = await self.redis_client.get(key)
                if data:
                    metrics.append(json.loads(data))

            if not metrics:
                return {"message": "No performance data available"}

            # Calculate averages
            avg_lighthouse = sum(m['lighthouse_score'] for m in metrics) / len(metrics)
            avg_load_time = sum(m['load_time'] for m in metrics) / len(metrics)

            # Find worst performers
            worst_performers = sorted(metrics, key=lambda x: x['lighthouse_score'])[:3]

            return {
                "total_components_analyzed": len(metrics),
                "average_lighthouse_score": round(avg_lighthouse, 2),
                "average_load_time": round(avg_load_time, 3),
                "worst_performers": worst_performers,
                "generated_at": datetime.now().isoformat()
            }

        except Exception as e:
            return {"error": f"Report generation failed: {e}"}

# FastAPI integration
app = FastAPI(title="Custom Component Performance Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = CustomComponentPerformanceAgent()

@app.on_event("startup")
async def startup_event():
    config = {
        "redis_url": "redis://localhost:6379",
        "database_url": "postgresql+asyncpg://user:pass@localhost/taurus",
        "debug": True
    }
    await agent.initialize(config)

@app.get("/performance/analyze/{component_name}")
async def analyze_component(component_name: str):
    """Analyze component performance"""
    try:
        # Mock component path for demo
        component_path = f"/components/{component_name}.tsx"
        metric = await agent.analyze_component_performance(component_path)
        return asdict(metric)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/performance/report")
async def get_performance_report():
    """Get comprehensive performance report"""
    return await agent.generate_performance_report()

@app.get("/performance/optimize/{component_name}")
async def get_optimization_suggestions(component_name: str):
    """Get optimization suggestions for component"""
    suggestions = await agent.optimize_component_suggestions(component_name)
    return {"component": component_name, "suggestions": suggestions}

@app.websocket("/ws/performance")
async def websocket_performance(websocket: WebSocket):
    """WebSocket for real-time performance monitoring"""
    await websocket.accept()
    try:
        while True:
            report = await agent.generate_performance_report()
            await websocket.send_json(report)
            await asyncio.sleep(10)  # Send update every 10 seconds
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Custom Component Performance Agent...")
    uvicorn.run(app, host="0.0.0.0", port=8003)
