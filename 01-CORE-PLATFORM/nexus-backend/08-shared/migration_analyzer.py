#!/usr/bin/env python3
"""
🏰 TAURUS AI CORP - Smart Migration Analyzer
Analyzes current structure and creates optimal migration plan
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

class TaurusMigrationAnalyzer:
    def __init__(self):
        self.root_dir = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP")
        self.bizflow_dir = self.root_dir / "BizFlow-Agentic_Intelligent_Orchestrator"
        self.neovibe_dir = self.root_dir / "NeoVibe-Vibe_Marketing_Studio"
        
        # Migration mapping
        self.migration_map = {
            "BizFlow": {
                "folders": [
                    "BizFlow-Agentic_Intelligent_Orchestrator",
                    "BizFlow-Orchestrator", 
                    "BizFlow-Automation-SaaS"
                ],
                "files": [
                    "bizflow_orchestrator_prompt.md",
                    "BIZFLOW_ORCHESTRATOR_EXECUTION_REPORT.md",
                    "COMPREHENSIVE_INTEGRATION_EXECUTION_REPORT.md"
                ],
                "target": "BizFlow-Agentic_Intelligent_Orchestrator"
            },
            "NeoVibe": {
                "folders": [
                    "NeoVibe-Vibe_Marketing_Studio"
                ],
                "files": [
                    "create-social-assets.py"
                ],
                "target": "NeoVibe-Vibe_Marketing_Studio"
            },
            "Shared": {
                "folders": [
                    "Configuration",
                    "Development-Sandbox", 
                    "Development-Tools",
                    "Documentation",
                    "scripts",
                    "web-land-Dash",
                    "Web-Platforms"
                ],
                "files": [
                    ".windsurfrules",
                    "OPTIMAL_BUSINESS_STRUCTURE.md",
                    "README.md",
                    "UNIFIED_TAURUS_AI_CORP_ANALYSIS.md"
                ],
                "target": "shared"
            }
        }
        
    def analyze_current_structure(self) -> Dict[str, Any]:
        """Analyze current folder structure"""
        print("🔍 Analyzing current TAURUS AI CORP structure...")
        
        analysis = {
            "timestamp": datetime.now().isoformat(),
            "total_items": 0,
            "folders": [],
            "files": [],
            "migration_plan": {}
        }
        
        # Scan current directory
        for item in self.root_dir.iterdir():
            if item.is_dir():
                analysis["folders"].append({
                    "name": item.name,
                    "path": str(item),
                    "size": self._get_folder_size(item),
                    "items": len(list(item.rglob("*")))
                })
            elif item.is_file():
                analysis["files"].append({
                    "name": item.name,
                    "path": str(item),
                    "size": item.stat().st_size
                })
            analysis["total_items"] += 1
        
        return analysis
    
    def _get_folder_size(self, folder_path: Path) -> int:
        """Calculate folder size"""
        total_size = 0
        try:
            for file_path in folder_path.rglob("*"):
                if file_path.is_file():
                    total_size += file_path.stat().st_size
        except (OSError, PermissionError):
            pass
        return total_size
    
    def create_migration_plan(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Create detailed migration plan"""
        print("📋 Creating migration plan...")
        
        migration_plan = {
            "bizflow_migrations": [],
            "neovibe_migrations": [],
            "shared_migrations": [],
            "conflicts": [],
            "recommendations": []
        }
        
        # Process folders
        for folder in analysis["folders"]:
            folder_name = folder["name"]
            
            if any(bf_folder in folder_name for bf_folder in self.migration_map["BizFlow"]["folders"]):
                migration_plan["bizflow_migrations"].append({
                    "type": "folder",
                    "source": folder["path"],
                    "target": f"{self.bizflow_dir}/04-platforms/{folder_name}",
                    "size": folder["size"],
                    "items": folder["items"]
                })
            elif any(nv_folder in folder_name for nv_folder in self.migration_map["NeoVibe"]["folders"]):
                migration_plan["neovibe_migrations"].append({
                    "type": "folder", 
                    "source": folder["path"],
                    "target": f"{self.neovibe_dir}/02-web-platforms/{folder_name}",
                    "size": folder["size"],
                    "items": folder["items"]
                })
            elif any(shared_folder in folder_name for shared_folder in self.migration_map["Shared"]["folders"]):
                migration_plan["shared_migrations"].append({
                    "type": "folder",
                    "source": folder["path"],
                    "target": f"{self.bizflow_dir}/08-shared/{folder_name}",
                    "size": folder["size"],
                    "items": folder["items"]
                })
        
        # Process files
        for file in analysis["files"]:
            file_name = file["name"]
            
            if any(bf_file in file_name for bf_file in self.migration_map["BizFlow"]["files"]):
                migration_plan["bizflow_migrations"].append({
                    "type": "file",
                    "source": file["path"],
                    "target": f"{self.bizflow_dir}/07-docs/{file_name}",
                    "size": file["size"]
                })
            elif any(nv_file in file_name for nv_file in self.migration_map["NeoVibe"]["files"]):
                migration_plan["neovibe_migrations"].append({
                    "type": "file",
                    "source": file["path"], 
                    "target": f"{self.neovibe_dir}/05-content-creation/{file_name}",
                    "size": file["size"]
                })
            elif any(shared_file in file_name for shared_file in self.migration_map["Shared"]["files"]):
                migration_plan["shared_migrations"].append({
                    "type": "file",
                    "source": file["path"],
                    "target": f"{self.bizflow_dir}/08-shared/{file_name}",
                    "size": file["size"]
                })
        
        return migration_plan
    
    def generate_migration_script(self, migration_plan: Dict[str, Any]) -> str:
        """Generate automated migration script"""
        script_content = f'''#!/usr/bin/env python3
"""
🏰 TAURUS AI CORP - Automated Migration Script
Generated: {datetime.now().isoformat()}
"""

import os
import shutil
import json
from pathlib import Path

def migrate_taurus_structure():
    """Execute TAURUS AI CORP migration"""
    print("🚀 Starting TAURUS AI CORP migration...")
    
    root_dir = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP")
    
    # Create backup
    backup_dir = root_dir / "BACKUP_BEFORE_MIGRATION"
    if not backup_dir.exists():
        print("📦 Creating backup...")
        shutil.copytree(root_dir, backup_dir, ignore=shutil.ignore_patterns('BACKUP_*'))
    
    # Migration operations
    migrations = {json.dumps(migration_plan, indent=2)}
    
    success_count = 0
    error_count = 0
    
    for migration_type, items in migrations.items():
        print(f"\\n📁 Processing {{migration_type}}...")
        for item in items:
            try:
                source = Path(item["source"])
                target = Path(item["target"])
                
                # Create target directory if needed
                target.parent.mkdir(parents=True, exist_ok=True)
                
                if source.exists():
                    if item["type"] == "folder":
                        shutil.move(str(source), str(target))
                    else:
                        shutil.move(str(source), str(target))
                    print(f"✅ Moved: {{source.name}} → {{target}}")
                    success_count += 1
                else:
                    print(f"⚠️  Source not found: {{source}}")
                    
            except Exception as e:
                print(f"❌ Error moving {{item['source']}}: {{e}}")
                error_count += 1
    
    print(f"\\n🎉 Migration complete!")
    print(f"✅ Success: {{success_count}}")
    print(f"❌ Errors: {{error_count}}")
    
    # Create symlinks for shared resources
    create_shared_symlinks()
    
    # Generate documentation
    generate_master_documentation()

def create_shared_symlinks():
    """Create symlinks for shared resources"""
    print("🔗 Creating shared resource symlinks...")
    
    bizflow_shared = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Agentic_Intelligent_Orchestrator/08-shared")
    neovibe_shared = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/NeoVibe-Vibe_Marketing_Studio/10-shared")
    
    if bizflow_shared.exists():
        for item in bizflow_shared.iterdir():
            target = neovibe_shared / item.name
            if not target.exists():
                target.symlink_to(item)
                print(f"🔗 Created symlink: {{target}} → {{item}}")

def generate_master_documentation():
    """Generate master documentation"""
    print("📚 Generating master documentation...")
    
    docs_content = """# 🏰 TAURUS AI CORP - Master Index

## 📁 New Structure

### 🤖 BizFlow-Agentic_Intelligent_Orchestrator/
- **01-core/**: Core business logic and orchestration
- **02-agents/**: AI agents and automation
- **03-integrations/**: External integrations and MCPs
- **04-platforms/**: Web platforms and tools
- **05-intelligence/**: Business intelligence and analytics
- **06-tools/**: Development tools and utilities
- **07-docs/**: Documentation and guides
- **08-shared/**: Shared resources (symlinked to NeoVibe)

### 🎨 NeoVibe-Vibe_Marketing_Studio/
- **01-neural-commerce/**: Core marketing platform
- **02-web-platforms/**: Marketing web tools
- **03-social-media/**: Social media assets and tools
- **04-design-templates/**: Design templates and assets
- **05-content-creation/**: Content generation tools
- **06-client-collaboration/**: Client management
- **07-intelligence/**: Marketing analytics
- **08-tools/**: Marketing-specific tools
- **09-docs/**: Marketing documentation
- **10-shared/**: Shared resources (symlinked to BizFlow)

## 🔗 Shared Resources
All shared resources are accessible from both units via symlinks.

## 📞 Quick Navigation
- **BizFlow**: AI automation and business intelligence
- **NeoVibe**: Marketing, design, and creative tools
- **Shared**: Common tools and resources

Generated: {datetime.now().isoformat()}
"""
    
    with open("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/MASTER_INDEX.md", "w") as f:
        f.write(docs_content)

if __name__ == "__main__":
    migrate_taurus_structure()
'''
        return script_content
    
    def run_analysis(self):
        """Run complete analysis"""
        print("🏰 TAURUS AI CORP - Migration Analysis")
        print("=" * 50)
        
        # Analyze current structure
        analysis = self.analyze_current_structure()
        
        # Create migration plan
        migration_plan = self.create_migration_plan(analysis)
        
        # Generate migration script
        migration_script = self.generate_migration_script(migration_plan)
        
        # Save results
        with open(self.root_dir / "migration_analysis.json", "w") as f:
            json.dump({
                "analysis": analysis,
                "migration_plan": migration_plan
            }, f, indent=2)
        
        with open(self.root_dir / "migrate_taurus.py", "w") as f:
            f.write(migration_script)
        
        print(f"✅ Analysis complete!")
        print(f"📊 Total items to migrate: {analysis['total_items']}")
        print(f"📁 Folders: {len(analysis['folders'])}")
        print(f"📄 Files: {len(analysis['files'])}")
        print(f"🤖 BizFlow migrations: {len(migration_plan['bizflow_migrations'])}")
        print(f"🎨 NeoVibe migrations: {len(migration_plan['neovibe_migrations'])}")
        print(f"🔗 Shared migrations: {len(migration_plan['shared_migrations'])}")
        
        return analysis, migration_plan

if __name__ == "__main__":
    analyzer = TaurusMigrationAnalyzer()
    analyzer.run_analysis()
