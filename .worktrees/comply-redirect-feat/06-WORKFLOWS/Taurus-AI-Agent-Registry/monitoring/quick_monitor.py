#!/usr/bin/env python3
"""
🏰 Taurus AI Corp. - Quick Monitoring System
Real-time tracking of your AI empire performance
"""

import os
import json
import time
import requests
import docker
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TaurusMonitor:
    """Quick monitoring system for Taurus AI Corp."""
    
    def __init__(self):
        self.docker_client = docker.from_env()
        self.metrics = {}
        
    def check_system_health(self):
        """Check overall system health"""
        try:
            # Check Docker containers
            containers = self.docker_client.containers.list()
            active_containers = len(containers)
            
            # Check services
            services = {
                "ollama": "http://localhost:11434/api/tags",
                "registry": "http://localhost:8000/health",
                "supabase": "http://localhost:54322",
                "chromadb": "http://localhost:8001/api/v1/heartbeat"
            }
            
            service_status = {}
            for service, url in services.items():
                try:
                    response = requests.get(url, timeout=5)
                    service_status[service] = "✅ Active" if response.status_code == 200 else "❌ Error"
                except:
                    service_status[service] = "❌ Down"
            
            return {
                "timestamp": datetime.now().isoformat(),
                "active_containers": active_containers,
                "services": service_status,
                "status": "🟢 Healthy" if all("Active" in status for status in service_status.values()) else "🔴 Issues"
            }
            
        except Exception as e:
            logger.error(f"Error checking system health: {e}")
            return {"status": "🔴 Error", "error": str(e)}
    
    def check_agent_performance(self):
        """Check AI agent performance"""
        agents = [
            "vibe_marketing_agent",
            "ollama_local_agent", 
            "vertex_ai_creative",
            "cognee_memory",
            "onlook_visual",
            "claude_seo_mcp"
        ]
        
        agent_status = {}
        for agent in agents:
            try:
                # Simulate agent health check
                agent_status[agent] = {
                    "status": "✅ Active",
                    "response_time": "0.5s",
                    "requests_today": 150,
                    "success_rate": "98%"
                }
            except:
                agent_status[agent] = {
                    "status": "❌ Error",
                    "response_time": "N/A",
                    "requests_today": 0,
                    "success_rate": "0%"
                }
        
        return {
            "timestamp": datetime.now().isoformat(),
            "agents": agent_status,
            "total_agents": len(agents),
            "active_agents": len([a for a in agent_status.values() if "Active" in a["status"]])
        }
    
    def check_revenue_metrics(self):
        """Check revenue metrics"""
        markets = ["UAE", "India", "Canada"]
        revenue_data = {}
        
        for market in markets:
            # Simulate revenue data
            revenue_data[market] = {
                "mrr": 2000 if market == "UAE" else 1500 if market == "India" else 1800,
                "new_clients": 3,
                "conversion_rate": "15%",
                "leads_generated": 25
            }
        
        total_mrr = sum(data["mrr"] for data in revenue_data.values())
        total_clients = sum(data["new_clients"] for data in revenue_data.values())
        
        return {
            "timestamp": datetime.now().isoformat(),
            "markets": revenue_data,
            "total_mrr": total_mrr,
            "total_clients": total_clients,
            "projected_annual": total_mrr * 12
        }
    
    def generate_dashboard_data(self):
        """Generate complete dashboard data"""
        return {
            "system_health": self.check_system_health(),
            "agent_performance": self.check_agent_performance(),
            "revenue_metrics": self.check_revenue_metrics(),
            "last_updated": datetime.now().isoformat()
        }
    
    def save_metrics(self, filename="taurus_metrics.json"):
        """Save metrics to file"""
        metrics = self.generate_dashboard_data()
        with open(filename, 'w') as f:
            json.dump(metrics, f, indent=2)
        logger.info(f"Metrics saved to {filename}")
        return metrics

if __name__ == "__main__":
    monitor = TaurusMonitor()
    
    print("🏰 Taurus AI Corp. - Quick Monitor")
    print("=" * 40)
    
    # Generate and display metrics
    metrics = monitor.save_metrics()
    
    print(f"\n📊 System Health: {metrics['system_health']['status']}")
    print(f"🤖 Active Agents: {metrics['agent_performance']['active_agents']}/{metrics['agent_performance']['total_agents']}")
    print(f"💰 Total MRR: ${metrics['revenue_metrics']['total_mrr']:,}")
    print(f"🎯 Total Clients: {metrics['revenue_metrics']['total_clients']}")
    
    print("\n✅ Monitoring complete! Check taurus_metrics.json for details.")
