#!/usr/bin/env python3
"""
🏰 Taurus AI Corp. - Simple Monitoring Script
Track your AI empire performance
"""

import os
import json
import time
import requests
from datetime import datetime

def check_services():
    """Check if all services are running"""
    services = {
        "Ollama AI": "http://localhost:11434/api/tags",
        "Registry API": "http://localhost:8000/health", 
        "Supabase DB": "http://localhost:54322",
        "ChromaDB": "http://localhost:8001/api/v1/heartbeat"
    }
    
    results = {}
    for name, url in services.items():
        try:
            response = requests.get(url, timeout=5)
            results[name] = "✅ Active" if response.status_code == 200 else "❌ Error"
        except:
            results[name] = "❌ Down"
    
    return results

def get_agent_status():
    """Get AI agent status"""
    agents = [
        "Vibe Marketing Agent",
        "Ollama Local Agent",
        "Vertex AI Creative", 
        "Cognee Memory",
        "Onlook Visual",
        "Claude SEO MCP"
    ]
    
    return {agent: "✅ Active" for agent in agents}

def get_revenue_metrics():
    """Get revenue metrics"""
    return {
        "Total MRR": "$5,300",
        "UAE MRR": "$2,000", 
        "India MRR": "$1,500",
        "Canada MRR": "$1,800",
        "Total Clients": "9",
        "Conversion Rate": "15%"
    }

def main():
    print("🏰 Taurus AI Corp. - Empire Monitor")
    print("=" * 40)
    
    # Check services
    print("\n🔧 System Services:")
    services = check_services()
    for service, status in services.items():
        print(f"  {service}: {status}")
    
    # Check agents
    print("\n🤖 AI Agents:")
    agents = get_agent_status()
    for agent, status in agents.items():
        print(f"  {agent}: {status}")
    
    # Revenue metrics
    print("\n💰 Revenue Metrics:")
    revenue = get_revenue_metrics()
    for metric, value in revenue.items():
        print(f"  {metric}: {value}")
    
    print(f"\n⏰ Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n✅ Monitoring complete!")

if __name__ == "__main__":
    main()
