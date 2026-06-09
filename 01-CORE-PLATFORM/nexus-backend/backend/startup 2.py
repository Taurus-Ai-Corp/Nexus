#!/usr/bin/env python3
"""
TAURUS AI CORP - Startup Script
Initialize and start the complete BizFlow™ platform
"""

import asyncio
import subprocess
import sys
import time
from pathlib import Path

def check_requirements():
    """Check if all requirements are installed"""
    try:
        import fastapi
        import redis
        import sqlalchemy
        import uvicorn
        print("✅ All Python requirements are available")
        return True
    except ImportError as e:
        print(f"❌ Missing Python requirement: {e}")
        print("🔧 Installing requirements...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        return True

def check_docker():
    """Check if Docker is available and running"""
    try:
        result = subprocess.run(["docker", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Docker available: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        print("❌ Docker not found. Please install Docker Desktop")
        return False

def start_infrastructure():
    """Start PostgreSQL and Redis using Docker Compose"""
    print("🚀 Starting database infrastructure...")
    
    try:
        # Start only the core infrastructure
        result = subprocess.run([
            "docker-compose", "up", "-d", 
            "postgres", "redis"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Database infrastructure started successfully")
            
            # Wait for services to be ready
            print("⏳ Waiting for databases to be ready...")
            time.sleep(10)
            
            # Check PostgreSQL
            pg_result = subprocess.run([
                "docker-compose", "exec", "-T", "postgres",
                "pg_isready", "-U", "taurus_user", "-d", "taurus"
            ], capture_output=True, text=True)
            
            if pg_result.returncode == 0:
                print("✅ PostgreSQL is ready")
            else:
                print("⚠️ PostgreSQL not ready, but continuing...")
            
            # Check Redis
            redis_result = subprocess.run([
                "docker-compose", "exec", "-T", "redis",
                "redis-cli", "ping"
            ], capture_output=True, text=True)
            
            if "PONG" in redis_result.stdout:
                print("✅ Redis is ready")
            else:
                print("⚠️ Redis not ready, but continuing...")
            
            return True
        else:
            print(f"❌ Failed to start infrastructure: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Infrastructure startup failed: {e}")
        return False

def start_agents():
    """Start specialized agents"""
    print("🤖 Starting specialized agents...")
    
    agent_ports = {
        "intelligence_research": 8001,
        "webflow_integration": 8002,
        "custom_component_performance": 8003,
        "performance_analysis": 8004,
        "content_social_strategy": 8005,
        "realtime_intelligence": 8006
    }
    
    agent_processes = []
    
    for agent_name, port in agent_ports.items():
        try:
            agent_path = Path(f"agents/specialized/{agent_name.replace('_', '-')}/agent.py")
            if agent_path.exists():
                print(f"🚀 Starting {agent_name} on port {port}")
                
                process = subprocess.Popen([
                    sys.executable, str(agent_path)
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                agent_processes.append((agent_name, process))
                time.sleep(2)  # Stagger agent startup
            else:
                print(f"⚠️ Agent file not found: {agent_path}")
                
        except Exception as e:
            print(f"❌ Failed to start {agent_name}: {e}")
    
    print(f"✅ Started {len(agent_processes)} specialized agents")
    return agent_processes

def start_backend():
    """Start the main FastAPI backend"""
    print("🌟 Starting BizFlow™ Backend API...")
    
    try:
        # Start the FastAPI server
        process = subprocess.Popen([
            sys.executable, "-m", "uvicorn",
            "main:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload",
            "--log-level", "info"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        time.sleep(5)  # Give it time to start
        
        # Check if it's running
        if process.poll() is None:
            print("✅ BizFlow™ Backend API started successfully")
            print("🌐 Access the API at: http://localhost:8000")
            print("📚 API Documentation: http://localhost:8000/api/docs")
            return process
        else:
            stdout, stderr = process.communicate()
            print(f"❌ Backend failed to start: {stderr.decode()}")
            return None
            
    except Exception as e:
        print(f"❌ Backend startup failed: {e}")
        return None

def show_status():
    """Show platform status and access information"""
    print("\n" + "="*60)
    print("🎉 TAURUS AI CORP BizFlow™ Platform Started!")
    print("="*60)
    print("\n📊 Platform Components:")
    print("  • Main API:          http://localhost:8000")
    print("  • API Docs:          http://localhost:8000/api/docs")
    print("  • Health Check:      http://localhost:8000/api/health")
    print("  • Dashboard:         http://localhost:8000/api/platform/dashboard")
    print("\n🗄️ Database Components:")
    print("  • PostgreSQL:        localhost:5432 (taurus/taurus_user)")
    print("  • Redis:             localhost:6379")
    print("  • Redis UI:          http://localhost:8081 (taurus/taurus_redis_ui_2024)")
    print("\n🤖 Specialized Agents:")
    print("  • Intelligence Research:        Port 8001")
    print("  • Webflow Integration:          Port 8002") 
    print("  • Component Performance:        Port 8003")
    print("  • Performance Analysis:         Port 8004")
    print("  • Content Social Strategy:      Port 8005")
    print("  • Real-time Intelligence:       Port 8006")
    print("\n🚀 Quick Start:")
    print("  1. Visit http://localhost:8000/api/docs")
    print("  2. Register a user via POST /api/auth/register")
    print("  3. Login via POST /api/auth/login")
    print("  4. Access platform features with your JWT token")
    print("\n⚠️  Production Notes:")
    print("  • Change default passwords in docker-compose.yml")
    print("  • Update JWT secret key in main.py")
    print("  • Configure SSL certificates for HTTPS")
    print("  • Set up proper environment variables")
    print("\n" + "="*60)

def main():
    """Main startup sequence"""
    print("🌊 TAURUS AI CORP BizFlow™ Platform Startup")
    print("=" * 50)
    
    # Step 1: Check requirements
    if not check_requirements():
        print("❌ Requirements check failed")
        sys.exit(1)
    
    # Step 2: Check Docker
    if not check_docker():
        print("❌ Docker check failed")
        sys.exit(1)
    
    # Step 3: Start infrastructure
    if not start_infrastructure():
        print("❌ Infrastructure startup failed")
        sys.exit(1)
    
    # Step 4: Start agents
    agent_processes = start_agents()
    
    # Step 5: Start backend
    backend_process = start_backend()
    if not backend_process:
        print("❌ Backend startup failed")
        sys.exit(1)
    
    # Step 6: Show status
    show_status()
    
    try:
        # Keep running
        print("\n💡 Press Ctrl+C to stop all services")
        while True:
            time.sleep(1)
            
            # Check if backend is still running
            if backend_process.poll() is not None:
                print("❌ Backend process died, restarting...")
                backend_process = start_backend()
                if not backend_process:
                    break
                    
    except KeyboardInterrupt:
        print("\n🛑 Shutting down TAURUS AI CORP BizFlow™ Platform...")
        
        # Stop backend
        if backend_process and backend_process.poll() is None:
            backend_process.terminate()
            print("✅ Backend stopped")
        
        # Stop agents
        for agent_name, process in agent_processes:
            if process.poll() is None:
                process.terminate()
                print(f"✅ {agent_name} stopped")
        
        # Stop infrastructure
        print("🛑 Stopping database infrastructure...")
        subprocess.run(["docker-compose", "down"], capture_output=True)
        print("✅ Infrastructure stopped")
        
        print("👋 TAURUS AI CORP BizFlow™ Platform stopped successfully")

if __name__ == "__main__":
    main()