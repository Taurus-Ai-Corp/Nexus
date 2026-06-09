"""
🌉 Taurus AI Corp. - Hybrid Cloud/Local Deployment System
Intelligent deployment orchestration between local and cloud resources
"""

import os
import asyncio
import logging
from typing import Dict, List, Any, Optional
from enum import Enum
from dataclasses import dataclass
import json
import yaml
from datetime import datetime

import docker
import boto3
from google.cloud import compute_v1
import kubernetes
from kubernetes import client, config

logger = logging.getLogger(__name__)

class DeploymentMode(Enum):
    LOCAL_ONLY = "local_only"
    HYBRID = "hybrid"
    CLOUD_ONLY = "cloud_only"
    AUTO_SCALING = "auto_scaling"

class CloudProvider(Enum):
    AWS = "aws"
    GCP = "gcp"
    AZURE = "azure"
    DIGITAL_OCEAN = "digital_ocean"

@dataclass
class DeploymentConfig:
    mode: DeploymentMode
    local_resources: Dict[str, Any]
    cloud_config: Dict[str, Any]
    scaling_rules: Dict[str, Any]
    cost_limits: Dict[str, float]

@dataclass
class DeploymentStatus:
    deployment_id: str
    mode: DeploymentMode
    local_services: List[str]
    cloud_services: List[str]
    status: str
    cost_estimate: float
    created_at: datetime
    last_updated: datetime

class HybridDeployer:
    """Intelligent hybrid deployment system for Taurus AI Corp."""
    
    def __init__(self):
        self.docker_client = None
        self.k8s_client = None
        self.aws_client = None
        self.gcp_client = None
        
        # Deployment configurations
        self.deployment_configs = {
            "development": DeploymentConfig(
                mode=DeploymentMode.LOCAL_ONLY,
                local_resources={
                    "cpu_limit": "4",
                    "memory_limit": "8Gi",
                    "storage_limit": "50Gi"
                },
                cloud_config={},
                scaling_rules={"enabled": False},
                cost_limits={"daily": 0.0, "monthly": 0.0}
            ),
            "staging": DeploymentConfig(
                mode=DeploymentMode.HYBRID,
                local_resources={
                    "cpu_limit": "2",
                    "memory_limit": "4Gi",
                    "storage_limit": "20Gi"
                },
                cloud_config={
                    "provider": "aws",
                    "region": "us-east-1",
                    "instance_type": "t3.medium"
                },
                scaling_rules={
                    "enabled": True,
                    "min_replicas": 1,
                    "max_replicas": 3,
                    "cpu_threshold": 70
                },
                cost_limits={"daily": 10.0, "monthly": 200.0}
            ),
            "production": DeploymentConfig(
                mode=DeploymentMode.AUTO_SCALING,
                local_resources={},
                cloud_config={
                    "provider": "aws",
                    "region": "us-east-1",
                    "instance_type": "t3.large",
                    "multi_az": True,
                    "load_balancer": True
                },
                scaling_rules={
                    "enabled": True,
                    "min_replicas": 2,
                    "max_replicas": 10,
                    "cpu_threshold": 60,
                    "memory_threshold": 80
                },
                cost_limits={"daily": 50.0, "monthly": 1000.0}
            )
        }
        
        # Active deployments
        self.active_deployments: Dict[str, DeploymentStatus] = {}
        
        # Cost tracking
        self.cost_tracker = {
            "daily_spend": 0.0,
            "monthly_spend": 0.0,
            "last_reset": datetime.now()
        }
    
    async def initialize(self):
        """Initialize the hybrid deployment system"""
        logger.info("🌉 Initializing Hybrid Deployment System...")
        
        try:
            # Initialize Docker client for local deployments
            await self._initialize_docker()
            
            # Initialize cloud clients if credentials are available
            await self._initialize_cloud_clients()
            
            # Initialize Kubernetes if available
            await self._initialize_kubernetes()
            
            logger.info("✅ Hybrid Deployment System ready")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize deployment system: {e}")
    
    async def _initialize_docker(self):
        """Initialize Docker client for local deployments"""
        try:
            self.docker_client = docker.from_env()
            # Test connection
            self.docker_client.ping()
            logger.info("🐳 Docker client initialized")
        except Exception as e:
            logger.warning(f"⚠️ Docker client initialization failed: {e}")
    
    async def _initialize_cloud_clients(self):
        """Initialize cloud provider clients"""
        
        # AWS
        if os.getenv("AWS_ACCESS_KEY_ID"):
            try:
                self.aws_client = boto3.client('ec2')
                logger.info("☁️ AWS client initialized")
            except Exception as e:
                logger.warning(f"⚠️ AWS client initialization failed: {e}")
        
        # GCP
        if os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            try:
                self.gcp_client = compute_v1.InstancesClient()
                logger.info("☁️ GCP client initialized")
            except Exception as e:
                logger.warning(f"⚠️ GCP client initialization failed: {e}")
    
    async def _initialize_kubernetes(self):
        """Initialize Kubernetes client"""
        try:
            # Try in-cluster config first
            try:
                config.load_incluster_config()
            except:
                # Fall back to local kubeconfig
                config.load_kube_config()
            
            self.k8s_client = client.ApiClient()
            logger.info("⚓ Kubernetes client initialized")
            
        except Exception as e:
            logger.warning(f"⚠️ Kubernetes client initialization failed: {e}")
    
    async def deploy_local(self, 
                          environment: str = "development",
                          services: List[str] = None) -> DeploymentStatus:
        """Deploy services locally using Docker Compose"""
        
        deployment_id = f"local-{environment}-{int(datetime.now().timestamp())}"
        logger.info(f"🏠 Starting local deployment: {deployment_id}")
        
        try:
            config = self.deployment_configs.get(environment, self.deployment_configs["development"])
            
            # Create Docker Compose configuration
            compose_config = await self._generate_local_compose(config, services)
            
            # Write compose file
            compose_path = f"/tmp/docker-compose-{deployment_id}.yml"
            with open(compose_path, 'w') as f:
                yaml.dump(compose_config, f, default_flow_style=False)
            
            # Start services using Docker Compose
            if self.docker_client:
                # Use docker-compose command
                import subprocess
                result = subprocess.run([
                    "docker-compose", "-f", compose_path, "up", "-d"
                ], capture_output=True, text=True)
                
                if result.returncode == 0:
                    status = DeploymentStatus(
                        deployment_id=deployment_id,
                        mode=DeploymentMode.LOCAL_ONLY,
                        local_services=services or ["registry", "ollama", "supabase", "redis"],
                        cloud_services=[],
                        status="running",
                        cost_estimate=0.0,  # Local is free!
                        created_at=datetime.now(),
                        last_updated=datetime.now()
                    )
                    
                    self.active_deployments[deployment_id] = status
                    logger.info(f"✅ Local deployment successful: {deployment_id}")
                    return status
                else:
                    raise Exception(f"Docker Compose failed: {result.stderr}")
            else:
                raise Exception("Docker client not available")
                
        except Exception as e:
            logger.error(f"❌ Local deployment failed: {e}")
            return DeploymentStatus(
                deployment_id=deployment_id,
                mode=DeploymentMode.LOCAL_ONLY,
                local_services=[],
                cloud_services=[],
                status="failed",
                cost_estimate=0.0,
                created_at=datetime.now(),
                last_updated=datetime.now()
            )
    
    async def deploy_hybrid(self, 
                           environment: str = "staging",
                           local_services: List[str] = None,
                           cloud_services: List[str] = None) -> DeploymentStatus:
        """Deploy in hybrid mode: some services local, some in cloud"""
        
        deployment_id = f"hybrid-{environment}-{int(datetime.now().timestamp())}"
        logger.info(f"🌉 Starting hybrid deployment: {deployment_id}")
        
        try:
            config = self.deployment_configs.get(environment, self.deployment_configs["staging"])
            
            # Default service distribution
            if not local_services:
                local_services = ["ollama", "redis"]  # Keep AI models and cache local
            if not cloud_services:
                cloud_services = ["registry", "supabase", "monitoring"]  # Scale these in cloud
            
            # Deploy local services
            local_status = await self.deploy_local("development", local_services)
            
            # Deploy cloud services
            cloud_status = await self._deploy_cloud_services(config, cloud_services)
            
            # Create hybrid deployment status
            status = DeploymentStatus(
                deployment_id=deployment_id,
                mode=DeploymentMode.HYBRID,
                local_services=local_services,
                cloud_services=cloud_services,
                status="running" if local_status.status == "running" and cloud_status else "partial",
                cost_estimate=self._estimate_cloud_cost(config, cloud_services),
                created_at=datetime.now(),
                last_updated=datetime.now()
            )
            
            self.active_deployments[deployment_id] = status
            logger.info(f"✅ Hybrid deployment ready: {deployment_id}")
            return status
            
        except Exception as e:
            logger.error(f"❌ Hybrid deployment failed: {e}")
            return DeploymentStatus(
                deployment_id=deployment_id,
                mode=DeploymentMode.HYBRID,
                local_services=[],
                cloud_services=[],
                status="failed",
                cost_estimate=0.0,
                created_at=datetime.now(),
                last_updated=datetime.now()
            )
    
    async def deploy_cloud(self, 
                          environment: str = "production",
                          provider: CloudProvider = CloudProvider.AWS) -> DeploymentStatus:
        """Deploy fully to cloud with auto-scaling"""
        
        deployment_id = f"cloud-{provider.value}-{environment}-{int(datetime.now().timestamp())}"
        logger.info(f"☁️ Starting cloud deployment: {deployment_id}")
        
        try:
            config = self.deployment_configs.get(environment, self.deployment_configs["production"])
            
            # Check cost limits
            estimated_cost = self._estimate_cloud_cost(config, ["registry", "ollama", "supabase", "redis", "monitoring"])
            if not self._within_cost_limits(estimated_cost, config):
                raise Exception(f"Deployment would exceed cost limits: ${estimated_cost}/day")
            
            # Deploy based on provider
            if provider == CloudProvider.AWS:
                success = await self._deploy_aws(config, deployment_id)
            elif provider == CloudProvider.GCP:
                success = await self._deploy_gcp(config, deployment_id)
            else:
                raise Exception(f"Provider {provider.value} not yet supported")
            
            status = DeploymentStatus(
                deployment_id=deployment_id,
                mode=DeploymentMode.CLOUD_ONLY,
                local_services=[],
                cloud_services=["registry", "ollama", "supabase", "redis", "monitoring"],
                status="running" if success else "failed",
                cost_estimate=estimated_cost,
                created_at=datetime.now(),
                last_updated=datetime.now()
            )
            
            self.active_deployments[deployment_id] = status
            logger.info(f"✅ Cloud deployment ready: {deployment_id}")
            return status
            
        except Exception as e:
            logger.error(f"❌ Cloud deployment failed: {e}")
            return DeploymentStatus(
                deployment_id=deployment_id,
                mode=DeploymentMode.CLOUD_ONLY,
                local_services=[],
                cloud_services=[],
                status="failed",
                cost_estimate=0.0,
                created_at=datetime.now(),
                last_updated=datetime.now()
            )
    
    async def _generate_local_compose(self, 
                                    config: DeploymentConfig, 
                                    services: List[str]) -> Dict[str, Any]:
        """Generate Docker Compose configuration for local deployment"""
        
        compose = {
            "version": "3.8",
            "services": {},
            "volumes": {
                "ollama_data": {"driver": "local"},
                "supabase_data": {"driver": "local"},
                "redis_data": {"driver": "local"},
                "chroma_data": {"driver": "local"}
            },
            "networks": {
                "taurus-empire": {"driver": "bridge"}
            }
        }
        
        # Add services based on request
        service_configs = {
            "registry": {
                "build": ".",
                "container_name": "taurus-registry",
                "ports": ["8000:8000"],
                "environment": [
                    "MODE=local",
                    "OLLAMA_URL=http://ollama:11434"
                ],
                "volumes": [
                    "./agents:/app/agents",
                    "./configs:/app/configs"
                ],
                "depends_on": ["ollama", "supabase"],
                "networks": ["taurus-empire"],
                "deploy": {
                    "resources": {
                        "limits": {
                            "cpus": config.local_resources.get("cpu_limit", "2"),
                            "memory": config.local_resources.get("memory_limit", "4Gi")
                        }
                    }
                }
            },
            "ollama": {
                "image": "ollama/ollama:latest",
                "container_name": "taurus-ollama",
                "ports": ["11434:11434"],
                "volumes": [
                    "ollama_data:/root/.ollama",
                    "/var/run/docker.sock:/var/run/docker.sock"
                ],
                "environment": ["OLLAMA_ORIGINS=*"],
                "networks": ["taurus-empire"],
                "deploy": {
                    "resources": {
                        "limits": {
                            "cpus": "2",
                            "memory": "6Gi"
                        }
                    }
                }
            },
            "supabase": {
                "image": "postgres:15",
                "container_name": "taurus-supabase",
                "ports": ["54322:5432"],
                "environment": [
                    "POSTGRES_DB=taurus_ai",
                    "POSTGRES_USER=postgres",
                    "POSTGRES_PASSWORD=your-super-secret-jwt-token-with-at-least-32-characters-long"
                ],
                "volumes": [
                    "supabase_data:/var/lib/postgresql/data",
                    "./database/init.sql:/docker-entrypoint-initdb.d/init.sql"
                ],
                "networks": ["taurus-empire"]
            },
            "redis": {
                "image": "redis:7-alpine",
                "container_name": "taurus-redis",
                "ports": ["6379:6379"],
                "volumes": ["redis_data:/data"],
                "command": "redis-server --appendonly yes",
                "networks": ["taurus-empire"]
            }
        }
        
        # Add requested services
        for service in (services or service_configs.keys()):
            if service in service_configs:
                compose["services"][service] = service_configs[service]
        
        return compose
    
    async def _deploy_cloud_services(self, 
                                   config: DeploymentConfig, 
                                   services: List[str]) -> bool:
        """Deploy services to cloud provider"""
        
        # This would implement actual cloud deployment
        # For now, return simulated success
        logger.info(f"☁️ Deploying cloud services: {services}")
        
        # Simulate deployment time
        await asyncio.sleep(2)
        
        return True
    
    async def _deploy_aws(self, config: DeploymentConfig, deployment_id: str) -> bool:
        """Deploy to AWS using ECS/EKS"""
        
        if not self.aws_client:
            raise Exception("AWS client not initialized")
        
        # Implementation would create ECS cluster, tasks, etc.
        logger.info(f"🚀 Deploying to AWS: {deployment_id}")
        
        # Simulate deployment
        await asyncio.sleep(5)
        return True
    
    async def _deploy_gcp(self, config: DeploymentConfig, deployment_id: str) -> bool:
        """Deploy to Google Cloud Platform"""
        
        if not self.gcp_client:
            raise Exception("GCP client not initialized")
        
        # Implementation would create GKE cluster, compute instances, etc.
        logger.info(f"🚀 Deploying to GCP: {deployment_id}")
        
        # Simulate deployment
        await asyncio.sleep(5)
        return True
    
    def _estimate_cloud_cost(self, config: DeploymentConfig, services: List[str]) -> float:
        """Estimate daily cost for cloud deployment"""
        
        base_costs = {
            "registry": 2.50,      # App service
            "ollama": 15.00,       # GPU instance for AI models
            "supabase": 5.00,      # Managed database
            "redis": 1.50,         # Cache instance
            "monitoring": 1.00     # Monitoring service
        }
        
        total_cost = sum(base_costs.get(service, 1.0) for service in services)
        
        # Apply scaling multiplier
        scaling_rules = config.scaling_rules
        if scaling_rules.get("enabled", False):
            max_replicas = scaling_rules.get("max_replicas", 1)
            # Estimate average utilization at 60% of max
            scaling_factor = max_replicas * 0.6
            total_cost *= scaling_factor
        
        return round(total_cost, 2)
    
    def _within_cost_limits(self, estimated_cost: float, config: DeploymentConfig) -> bool:
        """Check if deployment is within cost limits"""
        
        daily_limit = config.cost_limits.get("daily", 100.0)
        monthly_limit = config.cost_limits.get("monthly", 1000.0)
        
        # Check daily limit
        if estimated_cost > daily_limit:
            return False
        
        # Check monthly projection
        monthly_projection = estimated_cost * 30
        if monthly_projection > monthly_limit:
            return False
        
        return True
    
    async def get_deployment_status(self, deployment_id: str) -> Optional[DeploymentStatus]:
        """Get status of a specific deployment"""
        return self.active_deployments.get(deployment_id)
    
    async def list_active_deployments(self) -> List[DeploymentStatus]:
        """List all active deployments"""
        return list(self.active_deployments.values())
    
    async def scale_deployment(self, 
                             deployment_id: str, 
                             replicas: int) -> bool:
        """Scale a deployment to specified number of replicas"""
        
        deployment = self.active_deployments.get(deployment_id)
        if not deployment:
            logger.error(f"❌ Deployment not found: {deployment_id}")
            return False
        
        try:
            logger.info(f"📈 Scaling deployment {deployment_id} to {replicas} replicas")
            
            # Implementation would scale actual services
            # For now, just update the status
            deployment.last_updated = datetime.now()
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to scale deployment: {e}")
            return False
    
    async def stop_deployment(self, deployment_id: str) -> bool:
        """Stop and cleanup a deployment"""
        
        deployment = self.active_deployments.get(deployment_id)
        if not deployment:
            logger.error(f"❌ Deployment not found: {deployment_id}")
            return False
        
        try:
            logger.info(f"🛑 Stopping deployment: {deployment_id}")
            
            # Stop local services if any
            if deployment.local_services and self.docker_client:
                # Stop Docker Compose services
                compose_path = f"/tmp/docker-compose-{deployment_id}.yml"
                if os.path.exists(compose_path):
                    import subprocess
                    subprocess.run([
                        "docker-compose", "-f", compose_path, "down", "-v"
                    ], capture_output=True)
                    os.remove(compose_path)
            
            # Stop cloud services if any
            if deployment.cloud_services:
                # Implementation would cleanup cloud resources
                pass
            
            # Remove from active deployments
            del self.active_deployments[deployment_id]
            
            logger.info(f"✅ Deployment stopped: {deployment_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to stop deployment: {e}")
            return False
    
    async def get_cost_summary(self) -> Dict[str, Any]:
        """Get cost summary for all deployments"""
        
        total_daily_cost = sum(
            deployment.cost_estimate 
            for deployment in self.active_deployments.values()
        )
        
        return {
            "active_deployments": len(self.active_deployments),
            "total_daily_cost": round(total_daily_cost, 2),
            "estimated_monthly_cost": round(total_daily_cost * 30, 2),
            "cost_breakdown": {
                deployment.deployment_id: deployment.cost_estimate
                for deployment in self.active_deployments.values()
            },
            "local_deployments": len([
                d for d in self.active_deployments.values() 
                if d.mode == DeploymentMode.LOCAL_ONLY
            ]),
            "cloud_deployments": len([
                d for d in self.active_deployments.values() 
                if d.mode in [DeploymentMode.CLOUD_ONLY, DeploymentMode.HYBRID]
            ])
        }
    
    async def cleanup(self):
        """Cleanup all deployments and resources"""
        logger.info("🧹 Cleaning up Hybrid Deployment System...")
        
        # Stop all active deployments
        for deployment_id in list(self.active_deployments.keys()):
            await self.stop_deployment(deployment_id)
        
        # Close connections
        if self.docker_client:
            self.docker_client.close()

# Global instance
hybrid_deployer = None

def get_hybrid_deployer() -> HybridDeployer:
    """Get the global hybrid deployer instance"""
    global hybrid_deployer
    if hybrid_deployer is None:
        hybrid_deployer = HybridDeployer()
    return hybrid_deployer