#!/usr/bin/env python3
"""
🏰 Local AI Empire Startup Script
Starts the complete local AI ecosystem with Docker services
"""

import asyncio
import logging
import os
import subprocess
import sys
import time
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class LocalEmpireManager:
    """Manages the Local AI Empire startup and health checks"""

    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.docker_compose_file = self.project_root / "docker-compose.yml"

        # Service health check endpoints
        self.health_checks = {
            "ollama": "http://localhost:11434/api/tags",
            "registry": "http://localhost:8000/health",
            "supabase": "postgresql://postgres:your-super-secret-jwt-token-with-at-least-32-characters-long@localhost:54322/taurus_ai",
            "chromadb": "http://localhost:8001/api/v1/heartbeat",
            "redis": "redis://localhost:6379"
        }

        # Essential Ollama models
        self.essential_models = [
            "llama3.1:8b",      # General intelligence
            "phi3:mini",        # Lightweight tasks
            "mistral:7b",       # Fast responses
            "nomic-embed-text"  # Embeddings
        ]

    def check_prerequisites(self):
        """Check if Docker and required tools are installed"""
        logger.info("🔍 Checking prerequisites...")

        # Check Docker
        try:
            result = subprocess.run(["docker", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                logger.info(f"✅ Docker: {result.stdout.strip()}")
            else:
                raise Exception("Docker not responding")
        except Exception:
            logger.error("❌ Docker not found. Please install Docker Desktop")
            return False

        # Check Docker Compose
        try:
            result = subprocess.run(["docker", "compose", "version"], capture_output=True, text=True)
            if result.returncode == 0:
                logger.info(f"✅ Docker Compose: {result.stdout.strip()}")
            else:
                raise Exception("Docker Compose not responding")
        except Exception:
            logger.error("❌ Docker Compose not found")
            return False

        # Check if docker-compose.yml exists
        if not self.docker_compose_file.exists():
            logger.error(f"❌ docker-compose.yml not found at {self.docker_compose_file}")
            return False

        logger.info("✅ All prerequisites met")
        return True

    def start_services(self):
        """Start all Docker services"""
        logger.info("🚀 Starting Local AI Empire services...")

        try:
            # Change to project directory
            os.chdir(self.project_root)

            # Start services
            cmd = ["docker", "compose", "up", "-d", "--build"]
            logger.info(f"Running: {' '.join(cmd)}")

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                logger.info("✅ Docker services started successfully")
                logger.info(result.stdout)
                return True
            else:
                logger.error(f"❌ Failed to start services: {result.stderr}")
                return False

        except Exception as e:
            logger.error(f"❌ Error starting services: {e}")
            return False

    async def wait_for_services(self, timeout=300):
        """Wait for all services to become healthy"""
        logger.info("⏳ Waiting for services to become ready...")

        start_time = time.time()
        ready_services = set()

        while time.time() - start_time < timeout:
            # Check Ollama
            if "ollama" not in ready_services:
                if await self.check_ollama_health():
                    ready_services.add("ollama")
                    logger.info("✅ Ollama is ready")

            # Check Registry
            if "registry" not in ready_services:
                if await self.check_http_health(self.health_checks["registry"]):
                    ready_services.add("registry")
                    logger.info("✅ Registry is ready")

            # Check database services
            for service in ["supabase", "chromadb", "redis"]:
                if service not in ready_services:
                    if await self.check_service_health(service):
                        ready_services.add(service)
                        logger.info(f"✅ {service.title()} is ready")

            if len(ready_services) == len(self.health_checks):
                logger.info("🎉 All services are ready!")
                return True

            await asyncio.sleep(5)

        logger.warning(f"⚠️ Timeout waiting for services. Ready: {list(ready_services)}")
        return False

    async def check_ollama_health(self):
        """Check if Ollama is responding"""
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get("http://localhost:11434/api/tags", timeout=5) as response:
                    return response.status == 200
        except:
            return False

    async def check_http_health(self, url):
        """Check HTTP service health"""
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=5) as response:
                    return response.status == 200
        except:
            return False

    async def check_service_health(self, service_name):
        """Check individual service health"""
        if service_name == "supabase":
            # Check if PostgreSQL is accepting connections
            try:
                result = subprocess.run([
                    "docker", "exec", "taurus-supabase-db",
                    "pg_isready", "-U", "postgres"
                ], capture_output=True, text=True, timeout=10)
                return result.returncode == 0
            except:
                return False

        elif service_name == "redis":
            try:
                result = subprocess.run([
                    "docker", "exec", "taurus-redis",
                    "redis-cli", "ping"
                ], capture_output=True, text=True, timeout=10)
                return "PONG" in result.stdout
            except:
                return False

        elif service_name == "chromadb":
            return await self.check_http_health("http://localhost:8001/api/v1/heartbeat")

        return False

    async def setup_ollama_models(self):
        """Pull essential Ollama models"""
        logger.info("📥 Setting up essential AI models...")

        for model in self.essential_models:
            logger.info(f"📥 Pulling {model}...")
            try:
                cmd = ["docker", "exec", "taurus-ollama", "ollama", "pull", model]
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)

                if result.returncode == 0:
                    logger.info(f"✅ {model} ready")
                else:
                    logger.warning(f"⚠️ Failed to pull {model}: {result.stderr}")
            except subprocess.TimeoutExpired:
                logger.warning(f"⚠️ Timeout pulling {model} (this may take a while)")
            except Exception as e:
                logger.warning(f"⚠️ Error pulling {model}: {e}")

    def show_status(self):
        """Show the status of the Local AI Empire"""
        logger.info("📊 Local AI Empire Status:")
        print("\n🏰 LOCAL AI EMPIRE - STATUS DASHBOARD")
        print("=" * 50)

        # Service status
        print("\n🔧 SERVICES:")
        services = ["taurus-registry", "taurus-ollama", "taurus-supabase-db", "taurus-chroma", "taurus-redis"]

        for service in services:
            try:
                result = subprocess.run([
                    "docker", "ps", "--filter", f"name={service}", "--format", "table {{.Names}}\\t{{.Status}}"
                ], capture_output=True, text=True)

                if service in result.stdout:
                    status_line = [line for line in result.stdout.split('\n') if service in line]
                    if status_line:
                        print(f"  ✅ {service}: {status_line[0].split(service)[1].strip()}")
                    else:
                        print(f"  ❌ {service}: Not running")
                else:
                    print(f"  ❌ {service}: Not found")
            except Exception:
                print(f"  ❓ {service}: Error checking status")

        # Access URLs
        print("\n🌐 ACCESS POINTS:")
        print("  📊 Registry API: http://localhost:8000")
        print("  🤖 Ollama API: http://localhost:11434")
        print("  🗄️ Supabase DB: localhost:54322")
        print("  🔍 ChromaDB: http://localhost:8001")
        print("  ⚡ Redis: localhost:6379")
        print("  📈 Monitoring: http://localhost:3000 (if enabled)")

        # Costs
        print("\n💰 COSTS:")
        print("  🆓 Local Models: $0/month")
        print("  🐳 Docker: $0/month")
        print("  ☁️ Cloud APIs: Pay-per-use only")
        print("  💎 Total: $0/month for development!")

        print("\n🚀 Your Local AI Empire is ready!")
        print("   Visit http://localhost:8000/health to verify")

async def main():
    """Main startup sequence"""
    print("🏰 STARTING LOCAL AI EMPIRE")
    print("=" * 40)

    empire = LocalEmpireManager()

    # Check prerequisites
    if not empire.check_prerequisites():
        sys.exit(1)

    # Start services
    if not empire.start_services():
        sys.exit(1)

    # Wait for services
    if not await empire.wait_for_services():
        logger.warning("⚠️ Some services may not be fully ready")

    # Setup Ollama models (non-blocking)
    asyncio.create_task(empire.setup_ollama_models())

    # Show status
    empire.show_status()

    logger.info("🎉 Local AI Empire startup complete!")

if __name__ == "__main__":
    asyncio.run(main())
