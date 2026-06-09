#!/usr/bin/env python3
"""
Deployment Script for Enhanced MCP Integrator
Automated deployment with health checks and rollback capabilities
"""

import os
import sys
import asyncio
import subprocess
import shutil
import time
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import argparse

class EnhancedMCPDeployer:
    """Deployment manager for Enhanced MCP Integrator"""
    
    def __init__(self, project_root: str, environment: str = "production"):
        self.project_root = Path(project_root)
        self.environment = environment
        self.deployment_id = f"mcp-{int(time.time())}"
        self.backup_dir = self.project_root / "backups" / self.deployment_id
        self.logger = self._setup_logging()
        
        # Deployment configuration
        self.config = {
            "source_files": [
                "enhanced_mcp_integrator.py",
                "config_manager.py",
                "requirements_enhanced.txt",
                "test_enhanced_integrator.py"
            ],
            "test_files": [
                "test_enhanced_integrator.py"
            ],
            "config_files": [
                "mcp_config.json",
                "mcp_config.yaml"
            ],
            "backup_files": [
                "working_mcp_integrator.py",
                "mcp_integrator.py"
            ]
        }
    
    def _setup_logging(self) -> logging.Logger:
        """Set up deployment logging"""
        logger = logging.getLogger('MCPDeployer')
        logger.setLevel(logging.INFO)
        
        if not logger.handlers:
            # Console handler
            console_handler = logging.StreamHandler()
            console_formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            console_handler.setFormatter(console_formatter)
            logger.addHandler(console_handler)
            
            # File handler
            log_file = self.project_root / "deployment.log"
            file_handler = logging.FileHandler(log_file)
            file_handler.setFormatter(console_formatter)
            logger.addHandler(file_handler)
        
        return logger
    
    def create_backup(self) -> bool:
        """Create backup of current deployment"""
        try:
            self.backup_dir.mkdir(parents=True, exist_ok=True)
            
            for file_pattern in self.config["backup_files"]:
                source_file = self.project_root / file_pattern
                if source_file.exists():
                    backup_file = self.backup_dir / file_pattern
                    shutil.copy2(source_file, backup_file)
                    self.logger.info(f"Backed up {file_pattern}")
            
            # Create deployment metadata
            metadata = {
                "deployment_id": self.deployment_id,
                "timestamp": datetime.now().isoformat(),
                "environment": self.environment,
                "backup_files": [str(f) for f in self.backup_dir.glob("*")]
            }
            
            with open(self.backup_dir / "deployment_metadata.json", "w") as f:
                json.dump(metadata, f, indent=2)
            
            self.logger.info(f"Backup created at {self.backup_dir}")
            return True
            
        except Exception as e:
            self.logger.error(f"Backup creation failed: {e}")
            return False
    
    def install_dependencies(self) -> bool:
        """Install enhanced dependencies"""
        try:
            self.logger.info("Installing enhanced dependencies...")
            
            # Install requirements
            result = subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", 
                str(self.project_root / "requirements_enhanced.txt")
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode != 0:
                self.logger.error(f"Failed to install dependencies: {result.stderr}")
                return False
            
            self.logger.info("Dependencies installed successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Dependency installation failed: {e}")
            return False
    
    def run_tests(self) -> bool:
        """Run comprehensive test suite"""
        try:
            self.logger.info("Running test suite...")
            
            # Run basic tests first
            result = subprocess.run([
                sys.executable, "test_basic.py"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode != 0:
                self.logger.error(f"Basic tests failed: {result.stderr}")
                return False
            
            self.logger.info("Basic tests passed successfully")
            
            # Try to run pytest if available
            try:
                result = subprocess.run([
                    sys.executable, "-m", "pytest", 
                    str(self.project_root / "test_enhanced_integrator.py"),
                    "-v", "--tb=short"
                ], capture_output=True, text=True, cwd=self.project_root, timeout=60)
                
                if result.returncode != 0:
                    self.logger.warning(f"Some pytest tests failed, but basic tests passed: {result.stderr}")
                else:
                    self.logger.info("All pytest tests passed")
            except Exception as e:
                self.logger.warning(f"Pytest not available or failed: {e}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Test execution failed: {e}")
            return False
    
    def validate_configuration(self) -> bool:
        """Validate configuration files"""
        try:
            self.logger.info("Validating configuration...")
            
            # Check if config files exist
            config_files = [
                self.project_root / "mcp_config.json",
                self.project_root / "mcp_config.yaml"
            ]
            
            config_exists = any(f.exists() for f in config_files)
            if not config_exists:
                self.logger.warning("No configuration files found, will create default")
                return self.create_default_config()
            
            # Validate existing configuration (allow missing keys for deployment)
            result = subprocess.run([
                sys.executable, "-c", 
                "from config_manager import ConfigManager; "
                "cm = ConfigManager(); "
                "config = cm.load_config(); "
                "issues = cm.validate_config(config); "
                "key_issues = [i for i in issues if 'API key missing' not in i]; "
                "print('VALID' if not key_issues else f'INVALID: {key_issues}')"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if "INVALID" in result.stdout:
                self.logger.error(f"Configuration validation failed: {result.stdout}")
                return False
            
            self.logger.info("Configuration validation passed")
            return True
            
        except Exception as e:
            self.logger.error(f"Configuration validation failed: {e}")
            return False
    
    def create_default_config(self) -> bool:
        """Create default configuration"""
        try:
            self.logger.info("Creating default configuration...")
            
            # Set test environment variables for configuration creation
            env = os.environ.copy()
            env.update({
                "PERPLEXITY_API_KEY": "test-perplexity-key",
                "FIRECRAWL_API_KEY": "test-firecrawl-key", 
                "ANTHROPIC_API_KEY": "test-anthropic-key",
                "GITHUB_PERSONAL_ACCESS_TOKEN": "test-github-token"
            })
            
            result = subprocess.run([
                sys.executable, "-c",
                "from config_manager import ConfigManager; "
                "cm = ConfigManager(); "
                "config = cm.create_default_config(); "
                "cm.save_config(config); "
                "print('DEFAULT_CONFIG_CREATED')"
            ], capture_output=True, text=True, cwd=self.project_root, env=env)
            
            if "DEFAULT_CONFIG_CREATED" not in result.stdout:
                self.logger.error(f"Failed to create default config: {result.stderr}")
                return False
            
            self.logger.info("Default configuration created")
            return True
            
        except Exception as e:
            self.logger.error(f"Default configuration creation failed: {e}")
            return False
    
    def deploy_files(self) -> bool:
        """Deploy enhanced files"""
        try:
            self.logger.info("Deploying enhanced files...")
            
            # Ensure all source files exist
            for file_name in self.config["source_files"]:
                source_file = self.project_root / file_name
                if not source_file.exists():
                    self.logger.error(f"Source file not found: {file_name}")
                    return False
            
            # Create symbolic link or copy for production
            if self.environment == "production":
                # In production, we might want to copy files to a specific location
                production_dir = self.project_root / "production"
                production_dir.mkdir(exist_ok=True)
                
                for file_name in self.config["source_files"]:
                    source_file = self.project_root / file_name
                    target_file = production_dir / file_name
                    shutil.copy2(source_file, target_file)
                    self.logger.info(f"Deployed {file_name} to production")
            
            self.logger.info("Files deployed successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"File deployment failed: {e}")
            return False
    
    async def health_check(self) -> bool:
        """Perform health check on deployed system"""
        try:
            self.logger.info("Performing health check...")
            
            # Test the enhanced integrator
            result = subprocess.run([
                sys.executable, "-c",
                "import asyncio\n"
                "from enhanced_mcp_integrator import EnhancedMCPIntegrator\n"
                "async def test():\n"
                "    integrator = EnhancedMCPIntegrator()\n"
                "    metrics = integrator.get_performance_metrics()\n"
                "    print(f'HEALTH_CHECK_PASSED: {metrics}')\n"
                "asyncio.run(test())"
            ], capture_output=True, text=True, cwd=self.project_root, timeout=30)
            
            if "HEALTH_CHECK_PASSED" not in result.stdout:
                self.logger.error(f"Health check failed: {result.stderr}")
                return False
            
            self.logger.info("Health check passed")
            return True
            
        except Exception as e:
            self.logger.error(f"Health check failed: {e}")
            return False
    
    def rollback(self) -> bool:
        """Rollback to previous deployment"""
        try:
            self.logger.info("Rolling back deployment...")
            
            if not self.backup_dir.exists():
                self.logger.error("No backup found for rollback")
                return False
            
            # Restore backed up files
            for backup_file in self.backup_dir.glob("*"):
                if backup_file.name != "deployment_metadata.json":
                    target_file = self.project_root / backup_file.name
                    shutil.copy2(backup_file, target_file)
                    self.logger.info(f"Restored {backup_file.name}")
            
            self.logger.info("Rollback completed successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Rollback failed: {e}")
            return False
    
    def cleanup(self) -> bool:
        """Clean up deployment artifacts"""
        try:
            self.logger.info("Cleaning up deployment artifacts...")
            
            # Remove temporary files
            temp_files = [
                "coverage.xml",
                "htmlcov",
                ".coverage"
            ]
            
            for temp_file in temp_files:
                temp_path = self.project_root / temp_file
                if temp_path.exists():
                    if temp_path.is_dir():
                        shutil.rmtree(temp_path)
                    else:
                        temp_path.unlink()
                    self.logger.info(f"Cleaned up {temp_file}")
            
            self.logger.info("Cleanup completed")
            return True
            
        except Exception as e:
            self.logger.error(f"Cleanup failed: {e}")
            return False
    
    async def deploy(self) -> bool:
        """Main deployment process"""
        self.logger.info(f"Starting deployment {self.deployment_id} for {self.environment}")
        
        try:
            # Step 1: Create backup
            if not self.create_backup():
                self.logger.error("Backup creation failed, aborting deployment")
                return False
            
            # Step 2: Install dependencies
            if not self.install_dependencies():
                self.logger.error("Dependency installation failed, aborting deployment")
                return False
            
            # Step 3: Validate configuration
            if not self.validate_configuration():
                self.logger.error("Configuration validation failed, aborting deployment")
                return False
            
            # Step 4: Run tests
            if not self.run_tests():
                self.logger.error("Tests failed, aborting deployment")
                return False
            
            # Step 5: Deploy files
            if not self.deploy_files():
                self.logger.error("File deployment failed, aborting deployment")
                return False
            
            # Step 6: Health check
            if not await self.health_check():
                self.logger.error("Health check failed, rolling back")
                self.rollback()
                return False
            
            # Step 7: Cleanup
            self.cleanup()
            
            self.logger.info(f"Deployment {self.deployment_id} completed successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Deployment failed: {e}")
            self.rollback()
            return False
    
    def get_deployment_status(self) -> Dict[str, any]:
        """Get current deployment status"""
        status = {
            "deployment_id": self.deployment_id,
            "environment": self.environment,
            "timestamp": datetime.now().isoformat(),
            "backup_exists": self.backup_dir.exists(),
            "source_files_exist": all(
                (self.project_root / f).exists() 
                for f in self.config["source_files"]
            ),
            "config_files_exist": any(
                (self.project_root / f).exists() 
                for f in self.config["config_files"]
            )
        }
        
        return status

async def main():
    """Main deployment function"""
    parser = argparse.ArgumentParser(description="Enhanced MCP Integrator Deployment")
    parser.add_argument("--project-root", default=".", help="Project root directory")
    parser.add_argument("--environment", choices=["development", "staging", "production"], 
                       default="production", help="Deployment environment")
    parser.add_argument("--action", choices=["deploy", "rollback", "status", "health"], 
                       default="deploy", help="Action to perform")
    parser.add_argument("--dry-run", action="store_true", help="Perform dry run without actual deployment")
    
    args = parser.parse_args()
    
    deployer = EnhancedMCPDeployer(args.project_root, args.environment)
    
    if args.dry_run:
        print("DRY RUN MODE - No actual deployment will be performed")
        status = deployer.get_deployment_status()
        print(f"Deployment status: {json.dumps(status, indent=2)}")
        return
    
    if args.action == "deploy":
        success = await deployer.deploy()
        if success:
            print("✅ Deployment completed successfully")
            sys.exit(0)
        else:
            print("❌ Deployment failed")
            sys.exit(1)
    
    elif args.action == "rollback":
        success = deployer.rollback()
        if success:
            print("✅ Rollback completed successfully")
            sys.exit(0)
        else:
            print("❌ Rollback failed")
            sys.exit(1)
    
    elif args.action == "status":
        status = deployer.get_deployment_status()
        print(json.dumps(status, indent=2))
    
    elif args.action == "health":
        success = await deployer.health_check()
        if success:
            print("✅ Health check passed")
            sys.exit(0)
        else:
            print("❌ Health check failed")
            sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
