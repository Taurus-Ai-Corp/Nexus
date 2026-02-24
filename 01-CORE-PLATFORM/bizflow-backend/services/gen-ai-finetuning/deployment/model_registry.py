#!/usr/bin/env python3
"""
Model Registry
Version control and deployment for fine-tuned models
"""

import json
import shutil
import logging
from pathlib import Path
from typing import Dict, Any, Optional, List
from datetime import datetime
from dataclasses import dataclass, asdict
import yaml

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class ModelVersion:
    """Model version metadata"""
    version: str
    model_id: str
    base_model: str
    model_path: str
    training_date: str
    training_examples: int
    performance_metrics: Dict[str, Any]
    deployment_status: str  # staging, production, archived
    metadata: Dict[str, Any]


class ModelRegistry:
    """Manage fine-tuned model versions"""
    
    def __init__(self, registry_path: Optional[str] = None):
        """Initialize model registry"""
        if registry_path is None:
            registry_path = Path(__file__).parent.parent / "deployment" / "models"
        else:
            registry_path = Path(registry_path)
        
        self.registry_path = registry_path
        self.registry_path.mkdir(parents=True, exist_ok=True)
        self.registry_file = self.registry_path / "registry.json"
        self.models: Dict[str, List[ModelVersion]] = {}  # {model_id: [versions]}
        self._load_registry()
    
    def _load_registry(self):
        """Load registry from storage"""
        if self.registry_file.exists():
            try:
                with open(self.registry_file, 'r') as f:
                    data = json.load(f)
                    for model_id, versions in data.items():
                        self.models[model_id] = [
                            ModelVersion(**v) for v in versions
                        ]
                logger.info(f"Loaded registry with {len(self.models)} models")
            except Exception as e:
                logger.warning(f"Could not load registry: {e}")
    
    def _save_registry(self):
        """Save registry to storage"""
        data = {
            model_id: [asdict(v) for v in versions]
            for model_id, versions in self.models.items()
        }
        with open(self.registry_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def _generate_version(self, model_id: str) -> str:
        """Generate next version number"""
        if model_id not in self.models or not self.models[model_id]:
            return "1.0.0"
        
        # Get latest version
        latest = self.models[model_id][-1]
        version_parts = latest.version.split('.')
        
        # Increment patch version
        major, minor, patch = int(version_parts[0]), int(version_parts[1]), int(version_parts[2])
        patch += 1
        
        return f"{major}.{minor}.{patch}"
    
    def register_model(
        self,
        model_id: str,
        base_model: str,
        model_path: str,
        training_examples: int,
        performance_metrics: Dict[str, Any],
        metadata: Optional[Dict[str, Any]] = None,
        version: Optional[str] = None
    ) -> ModelVersion:
        """Register a new model version"""
        if version is None:
            version = self._generate_version(model_id)
        
        model_version = ModelVersion(
            version=version,
            model_id=model_id,
            base_model=base_model,
            model_path=model_path,
            training_date=datetime.now().isoformat(),
            training_examples=training_examples,
            performance_metrics=performance_metrics,
            deployment_status="staging",
            metadata=metadata or {}
        )
        
        if model_id not in self.models:
            self.models[model_id] = []
        
        self.models[model_id].append(model_version)
        self._save_registry()
        
        logger.info(f"Registered model: {model_id} v{version}")
        return model_version
    
    def get_latest_version(self, model_id: str) -> Optional[ModelVersion]:
        """Get latest version of a model"""
        if model_id not in self.models or not self.models[model_id]:
            return None
        
        return self.models[model_id][-1]
    
    def get_version(self, model_id: str, version: str) -> Optional[ModelVersion]:
        """Get specific version of a model"""
        if model_id not in self.models:
            return None
        
        for v in self.models[model_id]:
            if v.version == version:
                return v
        
        return None
    
    def list_models(self) -> List[str]:
        """List all registered model IDs"""
        return list(self.models.keys())
    
    def list_versions(self, model_id: str) -> List[ModelVersion]:
        """List all versions of a model"""
        return self.models.get(model_id, [])
    
    def deploy_model(
        self,
        model_id: str,
        version: Optional[str] = None,
        stage: str = "production"
    ) -> bool:
        """Deploy a model version"""
        if version is None:
            model_version = self.get_latest_version(model_id)
        else:
            model_version = self.get_version(model_id, version)
        
        if not model_version:
            logger.error(f"Model version not found: {model_id} v{version}")
            return False
        
        model_version.deployment_status = stage
        self._save_registry()
        
        logger.info(f"Deployed {model_id} v{model_version.version} to {stage}")
        return True
    
    def archive_model(self, model_id: str, version: str) -> bool:
        """Archive a model version"""
        model_version = self.get_version(model_id, version)
        if not model_version:
            return False
        
        model_version.deployment_status = "archived"
        self._save_registry()
        
        logger.info(f"Archived {model_id} v{version}")
        return True
    
    def get_deployed_models(self, stage: str = "production") -> List[ModelVersion]:
        """Get all deployed models for a stage"""
        deployed = []
        for versions in self.models.values():
            for v in versions:
                if v.deployment_status == stage:
                    deployed.append(v)
        return deployed


def main():
    """Main entry point for CLI"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Model Registry")
    parser.add_argument(
        '--list',
        action='store_true',
        help='List all models'
    )
    parser.add_argument(
        '--model-id',
        type=str,
        help='Model ID'
    )
    parser.add_argument(
        '--version',
        type=str,
        help='Model version'
    )
    parser.add_argument(
        '--deploy',
        type=str,
        choices=['staging', 'production'],
        help='Deploy model to stage'
    )
    
    args = parser.parse_args()
    
    registry = ModelRegistry()
    
    if args.list:
        models = registry.list_models()
        print(f"\nRegistered Models ({len(models)}):")
        for model_id in models:
            latest = registry.get_latest_version(model_id)
            print(f"  {model_id}: v{latest.version} ({latest.deployment_status})")
        print()
    
    elif args.model_id:
        if args.version:
            version = registry.get_version(args.model_id, args.version)
            if version:
                print(f"\nModel: {args.model_id} v{args.version}")
                print(f"  Base Model: {version.base_model}")
                print(f"  Training Date: {version.training_date}")
                print(f"  Examples: {version.training_examples}")
                print(f"  Status: {version.deployment_status}")
                print()
            else:
                print(f"Version not found: {args.model_id} v{args.version}")
        else:
            versions = registry.list_versions(args.model_id)
            print(f"\nVersions for {args.model_id}:")
            for v in versions:
                print(f"  v{v.version}: {v.deployment_status} ({v.training_date})")
            print()
    
    elif args.deploy and args.model_id:
        success = registry.deploy_model(args.model_id, args.version, args.deploy)
        if success:
            print(f"✅ Deployed {args.model_id} to {args.deploy}")
        else:
            print(f"❌ Failed to deploy {args.model_id}")
    
    else:
        parser.print_help()


if __name__ == '__main__':
    main()


