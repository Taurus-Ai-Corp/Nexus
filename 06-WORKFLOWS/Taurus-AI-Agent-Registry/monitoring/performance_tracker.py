#!/usr/bin/env python3
"""
🏰 Taurus AI Corp. - Performance Tracking System
Comprehensive monitoring and analytics for your AI empire
"""

import os
import json
import time
import sqlite3
import requests
import psutil
import docker
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging
from dataclasses import dataclass, asdict
import threading
import schedule

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('taurus_performance.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class AgentPerformance:
    """Agent performance metrics"""
    agent_name: str
    status: str
    response_time: float
    success_rate: float
    requests_processed: int
    errors: int
    last_activity: datetime
    market: str = "global"

@dataclass
class RevenueMetrics:
    """Revenue tracking metrics"""
    date: str
    mrr: float
    new_clients: int
    churn_rate: float
    average_deal_size: float
    conversion_rate: float
    market: str

@dataclass
class LeadMetrics:
    """Lead generation metrics"""
    date: str
    total_leads: int
    qualified_leads: int
    conversion_rate: float
    source: str
    market: str
    cost_per_lead: float

@dataclass
class SystemHealth:
    """System health metrics"""
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    network_io: float
    docker_containers: int
    active_services: int
    uptime: float

class TaurusPerformanceTracker:
    """Comprehensive performance tracking for Taurus AI Corp."""
    
    def __init__(self):
        self.db_path = "taurus_analytics.db"
        self.docker_client = docker.from_env()
        self.init_database()
        self.monitoring_active = False
        
    def init_database(self):
        """Initialize SQLite database for analytics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Agent performance table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS agent_performance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                agent_name TEXT,
                status TEXT,
                response_time REAL,
                success_rate REAL,
                requests_processed INTEGER,
                errors INTEGER,
                last_activity TIMESTAMP,
                market TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Revenue metrics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS revenue_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                mrr REAL,
                new_clients INTEGER,
                churn_rate REAL,
                average_deal_size REAL,
                conversion_rate REAL,
                market TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Lead metrics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS lead_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                total_leads INTEGER,
                qualified_leads INTEGER,
                conversion_rate REAL,
                source TEXT,
                market TEXT,
                cost_per_lead REAL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # System health table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS system_health (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cpu_usage REAL,
                memory_usage REAL,
                disk_usage REAL,
                network_io REAL,
                docker_containers INTEGER,
                active_services INTEGER,
                uptime REAL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Analytics database initialized")
    
    def track_agent_performance(self, agent_name: str, market: str = "global") -> AgentPerformance:
        """Track individual agent performance"""
        try:
            # Simulate agent performance metrics
            response_time = self._measure_response_time(agent_name)
            success_rate = self._calculate_success_rate(agent_name)
            requests_processed = self._get_requests_processed(agent_name)
            errors = self._get_errors(agent_name)
            
            performance = AgentPerformance(
                agent_name=agent_name,
                status="active",
                response_time=response_time,
                success_rate=success_rate,
                requests_processed=requests_processed,
                errors=errors,
                last_activity=datetime.now(),
                market=market
            )
            
            # Store in database
            self._store_agent_performance(performance)
            
            return performance
            
        except Exception as e:
            logger.error(f"Error tracking agent performance: {e}")
            return None
    
    def track_revenue_metrics(self, market: str = "global") -> RevenueMetrics:
        """Track revenue metrics"""
        try:
            # Calculate revenue metrics
            mrr = self._calculate_mrr(market)
            new_clients = self._get_new_clients(market)
            churn_rate = self._calculate_churn_rate(market)
            average_deal_size = self._calculate_average_deal_size(market)
            conversion_rate = self._calculate_conversion_rate(market)
            
            metrics = RevenueMetrics(
                date=datetime.now().strftime("%Y-%m-%d"),
                mrr=mrr,
                new_clients=new_clients,
                churn_rate=churn_rate,
                average_deal_size=average_deal_size,
                conversion_rate=conversion_rate,
                market=market
            )
            
            # Store in database
            self._store_revenue_metrics(metrics)
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error tracking revenue metrics: {e}")
            return None
    
    def track_lead_metrics(self, source: str, market: str = "global") -> LeadMetrics:
        """Track lead generation metrics"""
        try:
            # Calculate lead metrics
            total_leads = self._get_total_leads(source, market)
            qualified_leads = self._get_qualified_leads(source, market)
            conversion_rate = self._calculate_lead_conversion_rate(source, market)
            cost_per_lead = self._calculate_cost_per_lead(source, market)
            
            metrics = LeadMetrics(
                date=datetime.now().strftime("%Y-%m-%d"),
                total_leads=total_leads,
                qualified_leads=qualified_leads,
                conversion_rate=conversion_rate,
                source=source,
                market=market,
                cost_per_lead=cost_per_lead
            )
            
            # Store in database
            self._store_lead_metrics(metrics)
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error tracking lead metrics: {e}")
            return None
    
    def track_system_health(self) -> SystemHealth:
        """Track system health metrics"""
        try:
            # Get system metrics
            cpu_usage = psutil.cpu_percent(interval=1)
            memory_usage = psutil.virtual_memory().percent
            disk_usage = psutil.disk_usage('/').percent
            network_io = self._get_network_io()
            docker_containers = len(self.docker_client.containers.list())
            active_services = self._get_active_services()
            uptime = time.time() - self._get_start_time()
            
            health = SystemHealth(
                cpu_usage=cpu_usage,
                memory_usage=memory_usage,
                disk_usage=disk_usage,
                network_io=network_io,
                docker_containers=docker_containers,
                active_services=active_services,
                uptime=uptime
            )
            
            # Store in database
            self._store_system_health(health)
            
            return health
            
        except Exception as e:
            logger.error(f"Error tracking system health: {e}")
            return None
    
    def generate_performance_report(self, market: str = "global", days: int = 30) -> Dict[str, Any]:
        """Generate comprehensive performance report"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            # Agent performance summary
            cursor.execute('''
                SELECT agent_name, AVG(response_time), AVG(success_rate), SUM(requests_processed), SUM(errors)
                FROM agent_performance 
                WHERE timestamp BETWEEN ? AND ? AND market = ?
                GROUP BY agent_name
            ''', (start_date, end_date, market))
            
            agent_summary = cursor.fetchall()
            
            # Revenue summary
            cursor.execute('''
                SELECT AVG(mrr), SUM(new_clients), AVG(churn_rate), AVG(average_deal_size), AVG(conversion_rate)
                FROM revenue_metrics 
                WHERE timestamp BETWEEN ? AND ? AND market = ?
            ''', (start_date, end_date, market))
            
            revenue_summary = cursor.fetchone()
            
            # Lead summary
            cursor.execute('''
                SELECT SUM(total_leads), SUM(qualified_leads), AVG(conversion_rate), AVG(cost_per_lead)
                FROM lead_metrics 
                WHERE timestamp BETWEEN ? AND ? AND market = ?
            ''', (start_date, end_date, market))
            
            lead_summary = cursor.fetchone()
            
            # System health summary
            cursor.execute('''
                SELECT AVG(cpu_usage), AVG(memory_usage), AVG(disk_usage), AVG(uptime)
                FROM system_health 
                WHERE timestamp BETWEEN ? AND ?
            ''', (start_date, end_date))
            
            system_summary = cursor.fetchone()
            
            conn.close()
            
            return {
                "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
                "market": market,
                "agent_performance": agent_summary,
                "revenue_metrics": revenue_summary,
                "lead_metrics": lead_summary,
                "system_health": system_summary,
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating performance report: {e}")
            return {}
    
    def start_monitoring(self):
        """Start continuous monitoring"""
        self.monitoring_active = True
        
        # Schedule monitoring tasks
        schedule.every(30).seconds.do(self._monitor_agents)
        schedule.every(5).minutes.do(self._monitor_system_health)
        schedule.every(1).hour.do(self._monitor_revenue)
        schedule.every(1).hour.do(self._monitor_leads)
        
        logger.info("Performance monitoring started")
        
        # Run monitoring loop
        while self.monitoring_active:
            schedule.run_pending()
            time.sleep(1)
    
    def stop_monitoring(self):
        """Stop continuous monitoring"""
        self.monitoring_active = False
        logger.info("Performance monitoring stopped")
    
    # Helper methods for metrics calculation
    def _measure_response_time(self, agent_name: str) -> float:
        """Measure agent response time"""
        try:
            start_time = time.time()
            # Simulate API call to agent
            response = requests.get(f"http://localhost:8000/agents/{agent_name}/health", timeout=5)
            response_time = time.time() - start_time
            return response_time
        except:
            return 0.0
    
    def _calculate_success_rate(self, agent_name: str) -> float:
        """Calculate agent success rate"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT SUM(requests_processed), SUM(errors) 
                FROM agent_performance 
                WHERE agent_name = ? AND timestamp > datetime('now', '-1 hour')
            ''', (agent_name,))
            result = cursor.fetchone()
            conn.close()
            
            if result and result[0] > 0:
                return ((result[0] - result[1]) / result[0]) * 100
            return 100.0
        except:
            return 100.0
    
    def _get_requests_processed(self, agent_name: str) -> int:
        """Get requests processed by agent"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT SUM(requests_processed) 
                FROM agent_performance 
                WHERE agent_name = ? AND timestamp > datetime('now', '-1 hour')
            ''', (agent_name,))
            result = cursor.fetchone()
            conn.close()
            return result[0] if result[0] else 0
        except:
            return 0
    
    def _get_errors(self, agent_name: str) -> int:
        """Get errors for agent"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT SUM(errors) 
                FROM agent_performance 
                WHERE agent_name = ? AND timestamp > datetime('now', '-1 hour')
            ''', (agent_name,))
            result = cursor.fetchone()
            conn.close()
            return result[0] if result[0] else 0
        except:
            return 0
    
    def _calculate_mrr(self, market: str) -> float:
        """Calculate Monthly Recurring Revenue"""
        # Simulate MRR calculation
        base_mrr = {"UAE": 5000, "India": 3000, "Canada": 4000, "global": 12000}
        return base_mrr.get(market, 0)
    
    def _get_new_clients(self, market: str) -> int:
        """Get new clients count"""
        # Simulate new clients
        return 5
    
    def _calculate_churn_rate(self, market: str) -> float:
        """Calculate churn rate"""
        return 2.5  # 2.5% churn rate
    
    def _calculate_average_deal_size(self, market: str) -> float:
        """Calculate average deal size"""
        deal_sizes = {"UAE": 2500, "India": 1500, "Canada": 2000, "global": 2000}
        return deal_sizes.get(market, 2000)
    
    def _calculate_conversion_rate(self, market: str) -> float:
        """Calculate conversion rate"""
        return 15.0  # 15% conversion rate
    
    def _get_total_leads(self, source: str, market: str) -> int:
        """Get total leads"""
        return 100
    
    def _get_qualified_leads(self, source: str, market: str) -> int:
        """Get qualified leads"""
        return 25
    
    def _calculate_lead_conversion_rate(self, source: str, market: str) -> float:
        """Calculate lead conversion rate"""
        return 25.0  # 25% conversion rate
    
    def _calculate_cost_per_lead(self, source: str, market: str) -> float:
        """Calculate cost per lead"""
        return 50.0  # $50 per lead
    
    def _get_network_io(self) -> float:
        """Get network I/O"""
        return psutil.net_io_counters().bytes_sent + psutil.net_io_counters().bytes_recv
    
    def _get_active_services(self) -> int:
        """Get active services count"""
        return len(self.docker_client.containers.list())
    
    def _get_start_time(self) -> float:
        """Get system start time"""
        return psutil.boot_time()
    
    # Database storage methods
    def _store_agent_performance(self, performance: AgentPerformance):
        """Store agent performance in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO agent_performance 
            (agent_name, status, response_time, success_rate, requests_processed, errors, last_activity, market)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (performance.agent_name, performance.status, performance.response_time, 
              performance.success_rate, performance.requests_processed, performance.errors,
              performance.last_activity, performance.market))
        conn.commit()
        conn.close()
    
    def _store_revenue_metrics(self, metrics: RevenueMetrics):
        """Store revenue metrics in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO revenue_metrics 
            (date, mrr, new_clients, churn_rate, average_deal_size, conversion_rate, market)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (metrics.date, metrics.mrr, metrics.new_clients, metrics.churn_rate,
              metrics.average_deal_size, metrics.conversion_rate, metrics.market))
        conn.commit()
        conn.close()
    
    def _store_lead_metrics(self, metrics: LeadMetrics):
        """Store lead metrics in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO lead_metrics 
            (date, total_leads, qualified_leads, conversion_rate, source, market, cost_per_lead)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (metrics.date, metrics.total_leads, metrics.qualified_leads, metrics.conversion_rate,
              metrics.source, metrics.market, metrics.cost_per_lead))
        conn.commit()
        conn.close()
    
    def _store_system_health(self, health: SystemHealth):
        """Store system health in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO system_health 
            (cpu_usage, memory_usage, disk_usage, network_io, docker_containers, active_services, uptime)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (health.cpu_usage, health.memory_usage, health.disk_usage, health.network_io,
              health.docker_containers, health.active_services, health.uptime))
        conn.commit()
        conn.close()
    
    # Scheduled monitoring methods
    def _monitor_agents(self):
        """Monitor all agents"""
        agents = ["vibe_marketing", "ollama_local", "vertex_ai_creative", "cognee_memory", "onlook_visual", "claude_seo_mcp"]
        markets = ["UAE", "India", "Canada"]
        
        for agent in agents:
            for market in markets:
                self.track_agent_performance(agent, market)
    
    def _monitor_system_health(self):
        """Monitor system health"""
        self.track_system_health()
    
    def _monitor_revenue(self):
        """Monitor revenue metrics"""
        markets = ["UAE", "India", "Canada", "global"]
        for market in markets:
            self.track_revenue_metrics(market)
    
    def _monitor_leads(self):
        """Monitor lead metrics"""
        sources = ["linkedin", "instagram", "email", "website"]
        markets = ["UAE", "India", "Canada"]
        
        for source in sources:
            for market in markets:
                self.track_lead_metrics(source, market)

if __name__ == "__main__":
    # Initialize and start monitoring
    tracker = TaurusPerformanceTracker()
    
    print("🏰 Taurus AI Corp. - Performance Tracking System")
    print("=" * 50)
    
    # Start monitoring
    tracker.start_monitoring()
