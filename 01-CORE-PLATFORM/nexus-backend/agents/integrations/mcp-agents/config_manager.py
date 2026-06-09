#!/usr/bin/env python3
"""
Configuration Manager for Enhanced MCP Integrator
Centralized configuration management with validation and encryption
"""

import os
import json
import yaml
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
from pathlib import Path
from cryptography.fernet import Fernet
import logging

@dataclass
class APIConfiguration:
    """Configuration for individual API"""
    name: str
    key: str
    url: str
    timeout: int = 30
    max_retries: int = 3
    rate_limit: int = 100
    retry_delay: float = 1.0
    backoff_multiplier: float = 2.0
    enabled: bool = True
    priority: int = 1  # Higher number = higher priority

@dataclass
class WorkflowConfiguration:
    """Configuration for workflow"""
    name: str
    description: str
    apis: List[str]
    concurrent: bool = False
    timeout: int = 60
    retry_on_failure: bool = True
    max_concurrent_requests: int = 5

@dataclass
class SecurityConfiguration:
    """Security configuration"""
    encrypt_keys: bool = True
    key_rotation_days: int = 90
    max_failed_attempts: int = 5
    lockout_duration_minutes: int = 15
    log_security_events: bool = True
    sanitize_inputs: bool = True

@dataclass
class PerformanceConfiguration:
    """Performance configuration"""
    connection_pool_size: int = 10
    max_concurrent_workflows: int = 5
    request_timeout: int = 30
    response_timeout: int = 60
    enable_caching: bool = True
    cache_ttl_seconds: int = 300

@dataclass
class LoggingConfiguration:
    """Logging configuration"""
    level: str = "INFO"
    format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    file_path: Optional[str] = None
    max_file_size_mb: int = 10
    backup_count: int = 5
    log_security_events: bool = True

@dataclass
class MonitoringConfiguration:
    """Monitoring configuration"""
    enable_metrics: bool = True
    metrics_port: int = 8080
    health_check_interval: int = 30
    alert_on_failures: bool = True
    failure_threshold: int = 5
    alert_webhook_url: Optional[str] = None

@dataclass
class MCPIntegratorConfig:
    """Complete configuration for MCP Integrator"""
    apis: Dict[str, APIConfiguration]
    workflows: Dict[str, WorkflowConfiguration]
    security: SecurityConfiguration
    performance: PerformanceConfiguration
    logging: LoggingConfiguration
    monitoring: MonitoringConfiguration
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary"""
        return {
            "apis": {name: asdict(config) for name, config in self.apis.items()},
            "workflows": {name: asdict(config) for name, config in self.workflows.items()},
            "security": asdict(self.security),
            "performance": asdict(self.performance),
            "logging": asdict(self.logging),
            "monitoring": asdict(self.monitoring)
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'MCPIntegratorConfig':
        """Create configuration from dictionary"""
        apis = {
            name: APIConfiguration(**config) 
            for name, config in data.get("apis", {}).items()
        }
        
        workflows = {
            name: WorkflowConfiguration(**config) 
            for name, config in data.get("workflows", {}).items()
        }
        
        security = SecurityConfiguration(**data.get("security", {}))
        performance = PerformanceConfiguration(**data.get("performance", {}))
        logging_config = LoggingConfiguration(**data.get("logging", {}))
        monitoring = MonitoringConfiguration(**data.get("monitoring", {}))
        
        return cls(apis, workflows, security, performance, logging_config, monitoring)

class ConfigManager:
    """Configuration manager with validation and encryption"""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config_file = config_file or "mcp_config.json"
        self.encryption_key = self._get_or_create_encryption_key()
        self.fernet = Fernet(self.encryption_key)
        self.logger = logging.getLogger('ConfigManager')
    
    def _get_or_create_encryption_key(self) -> bytes:
        """Get or create encryption key for API keys"""
        key_file = Path("mcp_encryption.key")
        
        if key_file.exists():
            with open(key_file, "rb") as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            with open(key_file, "wb") as f:
                f.write(key)
            # Set restrictive permissions
            key_file.chmod(0o600)
            return key
    
    def _encrypt_value(self, value: str) -> str:
        """Encrypt a string value"""
        return self.fernet.encrypt(value.encode()).decode()
    
    def _decrypt_value(self, encrypted_value: str) -> str:
        """Decrypt a string value"""
        return self.fernet.decrypt(encrypted_value.encode()).decode()
    
    def load_config(self) -> MCPIntegratorConfig:
        """Load configuration from file"""
        config_path = Path(self.config_file)
        
        if not config_path.exists():
            self.logger.info(f"Configuration file {self.config_file} not found, creating default")
            return self.create_default_config()
        
        try:
            with open(config_path, 'r') as f:
                if config_path.suffix.lower() == '.yaml' or config_path.suffix.lower() == '.yml':
                    data = yaml.safe_load(f)
                else:
                    data = json.load(f)
            
            config = MCPIntegratorConfig.from_dict(data)
            
            # Decrypt API keys if they are encrypted
            if self._is_encrypted(config):
                config = self._decrypt_config(config)
            
            self.logger.info("Configuration loaded successfully")
            return config
            
        except Exception as e:
            self.logger.error(f"Failed to load configuration: {e}")
            return self.create_default_config()
    
    def save_config(self, config: MCPIntegratorConfig, encrypt_keys: bool = True) -> None:
        """Save configuration to file"""
        config_dict = config.to_dict()
        
        # Encrypt API keys if requested
        if encrypt_keys and config.security.encrypt_keys:
            config_dict = self._encrypt_config_dict(config_dict)
        
        config_path = Path(self.config_file)
        
        try:
            with open(config_path, 'w') as f:
                if config_path.suffix.lower() == '.yaml' or config_path.suffix.lower() == '.yml':
                    yaml.dump(config_dict, f, default_flow_style=False, indent=2)
                else:
                    json.dump(config_dict, f, indent=2)
            
            # Set restrictive permissions
            config_path.chmod(0o600)
            self.logger.info(f"Configuration saved to {self.config_file}")
            
        except Exception as e:
            self.logger.error(f"Failed to save configuration: {e}")
            raise
    
    def _is_encrypted(self, config: MCPIntegratorConfig) -> bool:
        """Check if configuration contains encrypted values"""
        for api_config in config.apis.values():
            if api_config.key.startswith('gAAAAAB'):  # Fernet encrypted strings start with this
                return True
        return False
    
    def _encrypt_config(self, config: MCPIntegratorConfig) -> MCPIntegratorConfig:
        """Decrypt configuration"""
        for api_config in config.apis.values():
            if api_config.key.startswith('gAAAAAB'):
                api_config.key = self._decrypt_value(api_config.key)
        return config
    
    def _encrypt_config_dict(self, config_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Encrypt API keys in configuration dictionary"""
        for api_name, api_config in config_dict.get("apis", {}).items():
            if "key" in api_config and not api_config["key"].startswith('gAAAAAB'):
                api_config["key"] = self._encrypt_value(api_config["key"])
        return config_dict
    
    def create_default_config(self) -> MCPIntegratorConfig:
        """Create default configuration"""
        # Default API configurations
        apis = {
            "perplexity": APIConfiguration(
                name="perplexity",
                key=os.getenv("PERPLEXITY_API_KEY", ""),
                url="https://api.perplexity.ai/chat/completions",
                timeout=30,
                max_retries=3,
                rate_limit=100,
                priority=1
            ),
            "firecrawl": APIConfiguration(
                name="firecrawl",
                key=os.getenv("FIRECRAWL_API_KEY", ""),
                url="https://api.firecrawl.dev/v1/scrape",
                timeout=45,
                max_retries=3,
                rate_limit=50,
                priority=2
            ),
            "anthropic": APIConfiguration(
                name="anthropic",
                key=os.getenv("ANTHROPIC_API_KEY", ""),
                url="https://api.anthropic.com/v1/messages",
                timeout=30,
                max_retries=3,
                rate_limit=200,
                priority=1
            ),
            "github": APIConfiguration(
                name="github",
                key=os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN", ""),
                url="https://api.github.com",
                timeout=30,
                max_retries=3,
                rate_limit=5000,
                priority=3
            )
        }
        
        # Default workflow configurations
        workflows = {
            "ai_search": WorkflowConfiguration(
                name="ai_search",
                description="AI-powered search and research using Perplexity",
                apis=["perplexity"],
                concurrent=False,
                timeout=30
            ),
            "web_scraping": WorkflowConfiguration(
                name="web_scraping",
                description="Web scraping and content analysis using Firecrawl",
                apis=["firecrawl"],
                concurrent=False,
                timeout=60
            ),
            "text_processing": WorkflowConfiguration(
                name="text_processing",
                description="Text processing and analysis using Claude",
                apis=["anthropic"],
                concurrent=False,
                timeout=30
            ),
            "code_management": WorkflowConfiguration(
                name="code_management",
                description="Code management and collaboration using GitHub",
                apis=["github"],
                concurrent=False,
                timeout=30
            ),
            "hybrid_workflow": WorkflowConfiguration(
                name="hybrid_workflow",
                description="Combined AI search, web scraping, and text processing",
                apis=["perplexity", "firecrawl", "anthropic"],
                concurrent=True,
                timeout=90,
                max_concurrent_requests=3
            ),
            "parallel_search": WorkflowConfiguration(
                name="parallel_search",
                description="Parallel AI search using multiple providers",
                apis=["perplexity", "anthropic"],
                concurrent=True,
                timeout=60,
                max_concurrent_requests=2
            )
        }
        
        # Default configurations
        security = SecurityConfiguration()
        performance = PerformanceConfiguration()
        logging_config = LoggingConfiguration()
        monitoring = MonitoringConfiguration()
        
        return MCPIntegratorConfig(
            apis=apis,
            workflows=workflows,
            security=security,
            performance=performance,
            logging=logging_config,
            monitoring=monitoring
        )
    
    def validate_config(self, config: MCPIntegratorConfig) -> List[str]:
        """Validate configuration and return list of issues"""
        issues = []
        
        # Validate API configurations
        for api_name, api_config in config.apis.items():
            if not api_config.key:
                issues.append(f"API key missing for {api_name}")
            
            if not api_config.url:
                issues.append(f"URL missing for {api_name}")
            
            if api_config.timeout <= 0:
                issues.append(f"Invalid timeout for {api_name}: {api_config.timeout}")
            
            if api_config.max_retries < 0:
                issues.append(f"Invalid max_retries for {api_name}: {api_config.max_retries}")
            
            if api_config.rate_limit <= 0:
                issues.append(f"Invalid rate_limit for {api_name}: {api_config.rate_limit}")
        
        # Validate workflow configurations
        for workflow_name, workflow_config in config.workflows.items():
            if not workflow_config.apis:
                issues.append(f"No APIs specified for workflow {workflow_name}")
            
            for api_name in workflow_config.apis:
                if api_name not in config.apis:
                    issues.append(f"Workflow {workflow_name} references unknown API: {api_name}")
            
            if workflow_config.timeout <= 0:
                issues.append(f"Invalid timeout for workflow {workflow_name}: {workflow_config.timeout}")
            
            if workflow_config.max_concurrent_requests <= 0:
                issues.append(f"Invalid max_concurrent_requests for workflow {workflow_name}: {workflow_config.max_concurrent_requests}")
        
        # Validate security configuration
        if config.security.key_rotation_days <= 0:
            issues.append(f"Invalid key_rotation_days: {config.security.key_rotation_days}")
        
        if config.security.max_failed_attempts <= 0:
            issues.append(f"Invalid max_failed_attempts: {config.security.max_failed_attempts}")
        
        # Validate performance configuration
        if config.performance.connection_pool_size <= 0:
            issues.append(f"Invalid connection_pool_size: {config.performance.connection_pool_size}")
        
        if config.performance.max_concurrent_workflows <= 0:
            issues.append(f"Invalid max_concurrent_workflows: {config.performance.max_concurrent_workflows}")
        
        return issues
    
    def update_api_config(self, api_name: str, **kwargs) -> bool:
        """Update API configuration"""
        config = self.load_config()
        
        if api_name not in config.apis:
            self.logger.error(f"API {api_name} not found in configuration")
            return False
        
        api_config = config.apis[api_name]
        
        for key, value in kwargs.items():
            if hasattr(api_config, key):
                setattr(api_config, key, value)
            else:
                self.logger.warning(f"Unknown attribute {key} for API {api_name}")
        
        # Validate updated configuration
        issues = self.validate_config(config)
        if issues:
            self.logger.error(f"Configuration validation failed: {issues}")
            return False
        
        self.save_config(config)
        self.logger.info(f"Updated configuration for API {api_name}")
        return True
    
    def add_workflow(self, workflow_config: WorkflowConfiguration) -> bool:
        """Add new workflow configuration"""
        config = self.load_config()
        
        if workflow_config.name in config.workflows:
            self.logger.error(f"Workflow {workflow_config.name} already exists")
            return False
        
        config.workflows[workflow_config.name] = workflow_config
        
        # Validate updated configuration
        issues = self.validate_config(config)
        if issues:
            self.logger.error(f"Configuration validation failed: {issues}")
            return False
        
        self.save_config(config)
        self.logger.info(f"Added workflow {workflow_config.name}")
        return True
    
    def remove_workflow(self, workflow_name: str) -> bool:
        """Remove workflow configuration"""
        config = self.load_config()
        
        if workflow_name not in config.workflows:
            self.logger.error(f"Workflow {workflow_name} not found")
            return False
        
        del config.workflows[workflow_name]
        self.save_config(config)
        self.logger.info(f"Removed workflow {workflow_name}")
        return True
    
    def export_config(self, file_path: str, include_keys: bool = False) -> bool:
        """Export configuration to file"""
        config = self.load_config()
        config_dict = config.to_dict()
        
        # Remove API keys if not including them
        if not include_keys:
            for api_config in config_dict.get("apis", {}).values():
                api_config["key"] = "***REDACTED***"
        
        try:
            with open(file_path, 'w') as f:
                if file_path.endswith('.yaml') or file_path.endswith('.yml'):
                    yaml.dump(config_dict, f, default_flow_style=False, indent=2)
                else:
                    json.dump(config_dict, f, indent=2)
            
            self.logger.info(f"Configuration exported to {file_path}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to export configuration: {e}")
            return False
    
    def import_config(self, file_path: str) -> bool:
        """Import configuration from file"""
        try:
            with open(file_path, 'r') as f:
                if file_path.endswith('.yaml') or file_path.endswith('.yml'):
                    data = yaml.safe_load(f)
                else:
                    data = json.load(f)
            
            config = MCPIntegratorConfig.from_dict(data)
            
            # Validate imported configuration
            issues = self.validate_config(config)
            if issues:
                self.logger.error(f"Imported configuration validation failed: {issues}")
                return False
            
            self.save_config(config)
            self.logger.info(f"Configuration imported from {file_path}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to import configuration: {e}")
            return False

def main():
    """Main function for configuration management CLI"""
    import argparse
    
    parser = argparse.ArgumentParser(description="MCP Integrator Configuration Manager")
    parser.add_argument("--config", default="mcp_config.json", help="Configuration file path")
    parser.add_argument("--action", choices=["create", "validate", "export", "import"], 
                       default="create", help="Action to perform")
    parser.add_argument("--file", help="File path for export/import")
    parser.add_argument("--include-keys", action="store_true", help="Include API keys in export")
    
    args = parser.parse_args()
    
    config_manager = ConfigManager(args.config)
    
    if args.action == "create":
        config = config_manager.create_default_config()
        config_manager.save_config(config)
        print(f"Default configuration created at {args.config}")
        
    elif args.action == "validate":
        config = config_manager.load_config()
        issues = config_manager.validate_config(config)
        if issues:
            print("Configuration validation failed:")
            for issue in issues:
                print(f"  - {issue}")
        else:
            print("Configuration is valid")
    
    elif args.action == "export":
        if not args.file:
            print("File path required for export")
            return
        success = config_manager.export_config(args.file, args.include_keys)
        if success:
            print(f"Configuration exported to {args.file}")
        else:
            print("Export failed")
    
    elif args.action == "import":
        if not args.file:
            print("File path required for import")
            return
        success = config_manager.import_config(args.file)
        if success:
            print(f"Configuration imported from {args.file}")
        else:
            print("Import failed")

if __name__ == "__main__":
    main()
