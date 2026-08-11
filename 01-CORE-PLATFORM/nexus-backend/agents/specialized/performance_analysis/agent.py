#!/usr/bin/env python3
"""
TAURUS AI CORP - Performance Analysis Agent
Analyzes component choices and performance trade-offs across the platform
"""

import asyncio
import json
import statistics
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta
from enum import Enum
from pathlib import Path
from typing import Any

import aiofiles
import psutil
import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker


class ComponentType(Enum):
    WEBFLOW = "webflow"
    CUSTOM_REACT = "custom_react"
    HYBRID = "hybrid"

@dataclass
class PerformanceAnalysis:
    component_id: str
    component_type: ComponentType
    metrics: dict[str, float]
    score: float
    recommendation: str
    trade_offs: dict[str, Any]
    cost_benefit: dict[str, float]
    timestamp: datetime

@dataclass
class ComparisonReport:
    webflow_metrics: dict[str, float]
    custom_metrics: dict[str, float]
    winner: ComponentType
    performance_gain: float
    maintenance_cost: float
    recommendation: str
    confidence: float

class PerformanceAnalysisAgent:
    """
    Agent responsible for:
    - Analyzing performance trade-offs between Webflow vs custom components
    - Monitoring site speed, conversion rates, and user experience metrics
    - Generating performance reports and recommendations
    - Cost-benefit analysis of component choices
    """

    def __init__(self):
        self.name = "performance-analysis"
        self.description = "Analyzer of component choices and performance trade-offs"
        self.redis_client: redis.Redis | None = None
        self.db_session: AsyncSession | None = None
        self.analysis_cache = {}
        self.benchmarks = {}

    async def initialize(self, config: dict[str, Any]):
        """Initialize agent with configuration"""
        # Redis connection for metrics storage
        self.redis_client = redis.from_url(
            config.get('redis_url', 'redis://localhost:6379'),
            decode_responses=True
        )

        # Database connection for historical analysis
        engine = create_async_engine(
            config.get('database_url', 'postgresql+asyncpg://user:pass@localhost/taurus'),
            echo=config.get('debug', False)
        )
        async_session = sessionmaker(engine, class_=AsyncSession)
        self.db_session = async_session()

        # Load performance benchmarks
        await self._load_benchmarks()

        print(f"✅ {self.name} agent initialized successfully")

    async def _load_benchmarks(self):
        """Load performance benchmarks for comparison"""
        self.benchmarks = {
            "webflow": {
                "lighthouse_score": 85,
                "load_time": 2.1,
                "bundle_size": 150000,
                "maintenance_hours_per_month": 2,
                "development_cost_multiplier": 0.3
            },
            "custom_react": {
                "lighthouse_score": 92,
                "load_time": 1.8,
                "bundle_size": 80000,
                "maintenance_hours_per_month": 8,
                "development_cost_multiplier": 1.0
            }
        }

    async def compare_components(self, webflow_component: str, custom_component: str) -> ComparisonReport:
        """Compare Webflow vs Custom component performance"""
        try:
            # Analyze Webflow component
            webflow_metrics = await self._analyze_webflow_component(webflow_component)

            # Analyze custom component
            custom_metrics = await self._analyze_custom_component(custom_component)

            # Calculate performance scores
            webflow_score = await self._calculate_performance_score(webflow_metrics, "webflow")
            custom_score = await self._calculate_performance_score(custom_metrics, "custom_react")

            # Determine winner and calculate gains
            if custom_score > webflow_score:
                winner = ComponentType.CUSTOM_REACT
                performance_gain = ((custom_score - webflow_score) / webflow_score) * 100
            else:
                winner = ComponentType.WEBFLOW
                performance_gain = ((webflow_score - custom_score) / custom_score) * 100

            # Calculate maintenance cost difference
            maintenance_cost = await self._calculate_maintenance_cost_difference(winner)

            # Generate recommendation
            recommendation = await self._generate_comparison_recommendation(
                webflow_score, custom_score, maintenance_cost, performance_gain
            )

            # Calculate confidence based on score difference
            confidence = min(abs(custom_score - webflow_score) / 10, 1.0)

            report = ComparisonReport(
                webflow_metrics=webflow_metrics,
                custom_metrics=custom_metrics,
                winner=winner,
                performance_gain=performance_gain,
                maintenance_cost=maintenance_cost,
                recommendation=recommendation,
                confidence=confidence
            )

            # Cache the analysis
            await self._cache_comparison(webflow_component, custom_component, report)

            return report

        except Exception as e:
            print(f"❌ Component comparison failed: {e}")
            raise

    async def _analyze_webflow_component(self, component_id: str) -> dict[str, float]:
        """Analyze Webflow component performance"""
        # Mock Webflow analysis - in production, use Webflow API
        base_metrics = self.benchmarks["webflow"].copy()

        # Add some variance based on component complexity
        complexity_factor = len(component_id) / 100  # Simple heuristic

        return {
            "lighthouse_score": base_metrics["lighthouse_score"] - complexity_factor * 5,
            "load_time": base_metrics["load_time"] + complexity_factor * 0.3,
            "bundle_size": base_metrics["bundle_size"] + complexity_factor * 20000,
            "seo_score": 88,
            "accessibility_score": 90,
            "conversion_impact": 1.0,  # Baseline
            "development_time_hours": 4
        }

    async def _analyze_custom_component(self, component_path: str) -> dict[str, float]:
        """Analyze custom React component performance"""
        # Mock custom component analysis
        base_metrics = self.benchmarks["custom_react"].copy()

        try:
            # Analyze file size and complexity
            if Path(component_path).exists():
                async with aiofiles.open(component_path) as f:
                    content = await f.read()
                    lines = len(content.split('\n'))
                    complexity_factor = lines / 1000
            else:
                complexity_factor = 0.1  # Low complexity for mock

            return {
                "lighthouse_score": base_metrics["lighthouse_score"] - complexity_factor * 3,
                "load_time": base_metrics["load_time"] + complexity_factor * 0.2,
                "bundle_size": base_metrics["bundle_size"] + complexity_factor * 15000,
                "seo_score": 95,
                "accessibility_score": 94,
                "conversion_impact": 1.15,  # Custom components often convert better
                "development_time_hours": 16
            }

        except Exception:
            # Return default metrics if analysis fails
            return {
                "lighthouse_score": 90,
                "load_time": 1.9,
                "bundle_size": 85000,
                "seo_score": 92,
                "accessibility_score": 91,
                "conversion_impact": 1.1,
                "development_time_hours": 12
            }

    async def _calculate_performance_score(self, metrics: dict[str, float], component_type: str) -> float:
        """Calculate weighted performance score"""
        weights = {
            "lighthouse_score": 0.25,
            "load_time": 0.20,  # Lower is better, so invert
            "bundle_size": 0.15,  # Lower is better, so invert
            "seo_score": 0.15,
            "accessibility_score": 0.15,
            "conversion_impact": 0.10
        }

        score = 0
        score += metrics["lighthouse_score"] * weights["lighthouse_score"]
        score += (5.0 - metrics["load_time"]) * 20 * weights["load_time"]  # Invert load time
        score += (200000 - metrics["bundle_size"]) / 2000 * weights["bundle_size"]  # Invert bundle size
        score += metrics["seo_score"] * weights["seo_score"]
        score += metrics["accessibility_score"] * weights["accessibility_score"]
        score += metrics["conversion_impact"] * 100 * weights["conversion_impact"]

        return max(0, min(100, score))

    async def _calculate_maintenance_cost_difference(self, winner: ComponentType) -> float:
        """Calculate monthly maintenance cost difference"""
        webflow_cost = self.benchmarks["webflow"]["maintenance_hours_per_month"] * 50  # $50/hour
        custom_cost = self.benchmarks["custom_react"]["maintenance_hours_per_month"] * 50

        if winner == ComponentType.WEBFLOW:
            return custom_cost - webflow_cost  # Positive = custom costs more
        else:
            return webflow_cost - custom_cost  # Positive = webflow costs more

    async def _generate_comparison_recommendation(self, webflow_score: float, custom_score: float,
                                               maintenance_cost: float, performance_gain: float) -> str:
        """Generate recommendation based on analysis"""
        recommendations = []

        if abs(custom_score - webflow_score) < 5:
            recommendations.append("Performance difference is minimal")

            if maintenance_cost > 200:  # $200/month difference
                recommendations.append("Choose Webflow for lower maintenance costs")
            else:
                recommendations.append("Either option is viable based on team preferences")

        elif custom_score > webflow_score:
            recommendations.append(f"Custom component performs {performance_gain:.1f}% better")

            if maintenance_cost > 300:
                recommendations.append("Consider if performance gain justifies higher maintenance costs")
            else:
                recommendations.append("Recommend custom component for superior performance")

        else:
            recommendations.append(f"Webflow component performs {performance_gain:.1f}% better")
            recommendations.append("Recommend Webflow for better performance and lower maintenance")

        # Add specific optimization suggestions
        if webflow_score < 80 and custom_score < 80:
            recommendations.append("Both options need optimization - consider hybrid approach")

        return "; ".join(recommendations)

    async def _cache_comparison(self, webflow_comp: str, custom_comp: str, report: ComparisonReport):
        """Cache comparison results"""
        try:
            if self.redis_client:
                key = f"comparison:{webflow_comp}:{custom_comp}:{int(datetime.now().timestamp())}"
                await self.redis_client.setex(
                    key,
                    7200,  # 2 hour TTL
                    json.dumps(asdict(report), default=str)
                )
        except Exception as e:
            print(f"⚠️ Failed to cache comparison: {e}")

    async def monitor_site_performance(self) -> dict[str, Any]:
        """Monitor overall site performance metrics"""
        try:
            # Collect real-time metrics
            metrics = {
                "timestamp": datetime.now().isoformat(),
                "server_metrics": {
                    "cpu_usage": psutil.cpu_percent(),
                    "memory_usage": psutil.virtual_memory().percent,
                    "disk_usage": psutil.disk_usage('/').percent
                },
                "performance_alerts": await self._check_performance_alerts(),
                "component_health": await self._assess_component_health()
            }

            # Store in Redis for real-time access
            if self.redis_client:
                await self.redis_client.setex(
                    "site_performance_current",
                    300,  # 5 minute TTL
                    json.dumps(metrics)
                )

            return metrics

        except Exception as e:
            print(f"❌ Performance monitoring failed: {e}")
            return {"error": str(e)}

    async def _check_performance_alerts(self) -> list[dict[str, Any]]:
        """Check for performance-related alerts"""
        alerts = []

        try:
            if self.redis_client:
                # Check recent comparisons for concerning patterns
                keys = await self.redis_client.keys("comparison:*")
                recent_keys = sorted(keys)[-5:]  # Last 5 comparisons

                poor_performers = 0
                for key in recent_keys:
                    data = await self.redis_client.get(key)
                    if data:
                        comparison = json.loads(data)
                        if (comparison.get('webflow_metrics', {}).get('lighthouse_score', 100) < 70 or
                            comparison.get('custom_metrics', {}).get('lighthouse_score', 100) < 70):
                            poor_performers += 1

                if poor_performers >= 3:
                    alerts.append({
                        "type": "performance_degradation",
                        "message": f"{poor_performers} components showing poor performance",
                        "severity": "high",
                        "action": "Review and optimize underperforming components"
                    })

        except Exception as e:
            alerts.append({
                "type": "monitoring_error",
                "message": f"Alert check failed: {e}",
                "severity": "medium",
                "action": "Check monitoring system health"
            })

        return alerts

    async def _assess_component_health(self) -> dict[str, Any]:
        """Assess overall component ecosystem health"""
        try:
            health_score = 85  # Base score
            issues = []

            # Check system resources
            cpu = psutil.cpu_percent()
            memory = psutil.virtual_memory().percent

            if cpu > 80:
                health_score -= 10
                issues.append("High CPU usage detected")

            if memory > 80:
                health_score -= 10
                issues.append("High memory usage detected")

            return {
                "overall_score": health_score,
                "status": "healthy" if health_score > 70 else "needs_attention",
                "issues": issues,
                "recommendations": await self._get_health_recommendations(health_score, issues)
            }

        except Exception as e:
            return {
                "overall_score": 0,
                "status": "error",
                "issues": [f"Health assessment failed: {e}"],
                "recommendations": ["Check monitoring system"]
            }

    async def _get_health_recommendations(self, score: float, issues: list[str]) -> list[str]:
        """Get recommendations based on health assessment"""
        recommendations = []

        if score < 50:
            recommendations.append("Critical: Immediate attention required")
            recommendations.append("Review all component implementations")
        elif score < 70:
            recommendations.append("Warning: Performance optimization needed")
            recommendations.append("Focus on high-impact components first")

        if "High CPU usage" in issues:
            recommendations.append("Optimize component rendering cycles")
            recommendations.append("Consider component lazy loading")

        if "High memory usage" in issues:
            recommendations.append("Review memory leaks in components")
            recommendations.append("Implement proper cleanup in useEffect hooks")

        if not recommendations:
            recommendations.append("System performing well - maintain current practices")

        return recommendations

    async def generate_performance_dashboard_data(self) -> dict[str, Any]:
        """Generate data for performance dashboard"""
        try:
            if not self.redis_client:
                return {"error": "Redis not available"}

            # Get recent comparison data
            keys = await self.redis_client.keys("comparison:*")
            comparisons = []

            for key in sorted(keys)[-10:]:  # Last 10 comparisons
                data = await self.redis_client.get(key)
                if data:
                    comparisons.append(json.loads(data))

            if not comparisons:
                return {"message": "No comparison data available"}

            # Calculate statistics
            webflow_scores = [c['webflow_metrics']['lighthouse_score'] for c in comparisons if 'webflow_metrics' in c]
            custom_scores = [c['custom_metrics']['lighthouse_score'] for c in comparisons if 'custom_metrics' in c]

            dashboard_data = {
                "summary": {
                    "total_comparisons": len(comparisons),
                    "avg_webflow_score": statistics.mean(webflow_scores) if webflow_scores else 0,
                    "avg_custom_score": statistics.mean(custom_scores) if custom_scores else 0,
                    "webflow_wins": len([c for c in comparisons if c.get('winner') == 'webflow']),
                    "custom_wins": len([c for c in comparisons if c.get('winner') == 'custom_react'])
                },
                "trends": {
                    "performance_over_time": await self._get_performance_trends(),
                    "cost_analysis": await self._get_cost_analysis()
                },
                "alerts": await self._check_performance_alerts(),
                "recommendations": await self._get_strategic_recommendations()
            }

            return dashboard_data

        except Exception as e:
            return {"error": f"Dashboard generation failed: {e}"}

    async def _get_performance_trends(self) -> list[dict[str, Any]]:
        """Get performance trends over time"""
        # Mock trend data - in production, analyze historical data
        trends = []
        base_date = datetime.now() - timedelta(days=30)

        for i in range(30):
            date = base_date + timedelta(days=i)
            trends.append({
                "date": date.isoformat(),
                "webflow_avg": 82 + (i * 0.2) + (i % 3),  # Slight upward trend with variance
                "custom_avg": 89 + (i * 0.1) + (i % 5),   # Slight upward trend with variance
                "overall_health": 80 + (i * 0.3) + (i % 4)
            })

        return trends

    async def _get_cost_analysis(self) -> dict[str, Any]:
        """Analyze cost implications of component choices"""
        return {
            "monthly_savings_webflow": 250,  # Average monthly savings choosing Webflow
            "development_cost_difference": 1200,  # One-time development cost difference
            "break_even_months": 4.8,  # Months to break even
            "total_cost_of_ownership_12m": {
                "webflow": 3600,
                "custom": 4800
            }
        }

    async def _get_strategic_recommendations(self) -> list[str]:
        """Get strategic recommendations for component architecture"""
        return [
            "Prioritize Webflow for marketing pages requiring frequent updates",
            "Use custom components for core application functionality",
            "Implement hybrid approach for complex interactive elements",
            "Monitor performance impact of each component choice",
            "Establish performance budgets for different page types"
        ]

# FastAPI integration
app = FastAPI(title="Performance Analysis Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = PerformanceAnalysisAgent()

@app.on_event("startup")
async def startup_event():
    config = {
        "redis_url": "redis://localhost:6379",
        "database_url": "postgresql+asyncpg://user:pass@localhost/taurus",
        "debug": True
    }
    await agent.initialize(config)

@app.post("/analysis/compare")
async def compare_components(webflow_component: str, custom_component: str):
    """Compare Webflow vs Custom component"""
    try:
        report = await agent.compare_components(webflow_component, custom_component)
        return asdict(report)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@app.get("/analysis/performance")
async def get_site_performance():
    """Get current site performance metrics"""
    return await agent.monitor_site_performance()

@app.get("/analysis/dashboard")
async def get_dashboard_data():
    """Get performance dashboard data"""
    return await agent.generate_performance_dashboard_data()

@app.websocket("/ws/analysis")
async def websocket_analysis(websocket: WebSocket):
    """WebSocket for real-time performance analysis"""
    await websocket.accept()
    try:
        while True:
            performance_data = await agent.monitor_site_performance()
            await websocket.send_json(performance_data)
            await asyncio.sleep(30)  # Send update every 30 seconds
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import os

    import uvicorn
    print("🚀 Starting Performance Analysis Agent...")
    # Dev-only standalone entrypoint (not used by backend/main.py, which imports
    # this module's classes directly). Default to loopback; set HOST=0.0.0.0
    # explicitly only for containerized local/dev use.
    uvicorn.run(app, host=os.environ.get("HOST", "127.0.0.1"), port=8004)
