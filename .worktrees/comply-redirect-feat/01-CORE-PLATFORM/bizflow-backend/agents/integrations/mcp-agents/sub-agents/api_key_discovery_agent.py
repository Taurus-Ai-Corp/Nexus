#!/usr/bin/env python3
"""
API Key Discovery Agent
Master Orchestrator Sub-Agent for MCP API Keys Fix System

This agent scans the entire codebase to discover all required API keys
and generates a comprehensive inventory of missing and placeholder keys.
"""

import os
import re
import json
import glob
from pathlib import Path
from typing import Dict, List, Set, Tuple
from dataclasses import dataclass
from datetime import datetime

@dataclass
class APIKeyInfo:
    """Information about an API key requirement"""
    key_name: str
    current_value: str
    status: str  # 'missing', 'placeholder', 'valid', 'unknown'
    file_path: str
    line_number: int
    context: str
    priority: str  # 'high', 'medium', 'low'
    required_for: List[str]

class APIKeyDiscoveryAgent:
    """Discovers all API key requirements across the codebase"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.discovered_keys: Dict[str, APIKeyInfo] = {}
        self.placeholder_patterns = [
            r'your_.*_key_here',
            r'your_.*_token_here',
            r'your_.*_api_key_here',
            r'your_.*_secret_here',
            r'your_.*_id_here',
            r'sk-your-api-key-here',
            r'xoxb-your-slack-bot-token-here',
            r'xoxp-your-slack-user-token-here',
            r'secret_your_.*_api_key_here',
            r'figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            r'mm-your_actual_.*_api_key_here'
        ]
        
        # High priority API keys for MCP functionality
        self.high_priority_keys = {
            'PERPLEXITY_API_KEY': ['AI-powered search', 'MCP integration'],
            'FIRECRAWL_API_KEY': ['Web scraping', 'Content analysis', 'MCP integration'],
            'ANTHROPIC_API_KEY': ['Claude AI integration', 'MCP integration'],
            'OPENAI_API_KEY': ['ChatGPT integration', 'MCP integration']
        }
        
        # Medium priority keys for workflow integrations
        self.medium_priority_keys = {
            'FIGMA_ACCESS_TOKEN': ['Design file access'],
            'GOOGLE_CLIENT_ID': ['Gmail/Sheets integration'],
            'GOOGLE_CLIENT_SECRET': ['Google services'],
            'SLACK_BOT_TOKEN': ['Slack automation'],
            'SLACK_USER_TOKEN': ['Slack user actions']
        }
        
        # Low priority keys for business tools
        self.low_priority_keys = {
            'HUBSPOT_ACCESS_TOKEN': ['CRM integration'],
            'WEBFLOW_ACCESS_TOKEN': ['Web design platform'],
            'WEBFLOW_CLIENT_ID': ['Webflow OAuth'],
            'WEBFLOW_CLIENT_SECRET': ['Webflow OAuth'],
            'GITHUB_PERSONAL_ACCESS_TOKEN': ['GitHub integration']
        }

    def discover_all_keys(self) -> Dict[str, APIKeyInfo]:
        """Main discovery method - scans entire codebase for API keys"""
        print("🔍 Starting API Key Discovery Agent...")
        
        # Define directories to skip
        skip_dirs = {'.venv', 'venv', 'node_modules', 'site-packages', '__pycache__', '.git', '.vscode', '.idea'}
        
        # Scan different file types
        self._scan_env_files(skip_dirs)
        self._scan_python_files(skip_dirs)
        self._scan_typescript_files(skip_dirs)
        self._scan_javascript_files(skip_dirs)
        self._scan_json_files(skip_dirs)
        self._scan_md_files(skip_dirs)
        
        # Generate comprehensive report
        self._generate_discovery_report()
        
        return self.discovered_keys

    def _scan_env_files(self, skip_dirs: set):
        """Scan all .env files for API key definitions"""
        print("📁 Scanning .env files...")
        
        env_files = list(self.project_root.rglob("*.env*"))
        # Filter out files in skipped directories
        env_files = [f for f in env_files if not any(skip_dir in str(f) for skip_dir in skip_dirs)]
        for env_file in env_files:
            try:
                with open(env_file, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f, 1):
                        if '=' in line and not line.strip().startswith('#'):
                            key, value = line.strip().split('=', 1)
                            key = key.strip()
                            value = value.strip()
                            
                            if self._is_api_key(key):
                                status = self._determine_key_status(value)
                                priority = self._get_key_priority(key)
                                
                                self.discovered_keys[key] = APIKeyInfo(
                                    key_name=key,
                                    current_value=value,
                                    status=status,
                                    file_path=str(env_file),
                                    line_number=line_num,
                                    context=line.strip(),
                                    priority=priority,
                                    required_for=self._get_required_for(key)
                                )
            except Exception as e:
                print(f"⚠️  Error scanning {env_file}: {e}")

    def _scan_python_files(self, skip_dirs: set):
        """Scan Python files for API key references"""
        print("🐍 Scanning Python files...")
        
        python_files = list(self.project_root.rglob("*.py"))
        # Filter out files in skipped directories
        python_files = [f for f in python_files if not any(skip_dir in str(f) for skip_dir in skip_dirs)]
        for py_file in python_files:
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Look for environment variable references
                    env_pattern = r'os\.getenv\([\'"]([A-Z_]+)[\'"]\)'
                    matches = re.finditer(env_pattern, content)
                    
                    for match in matches:
                        key_name = match.group(1)
                        if self._is_api_key(key_name):
                            line_num = content[:match.start()].count('\n') + 1
                            
                            if key_name not in self.discovered_keys:
                                self.discovered_keys[key_name] = APIKeyInfo(
                                    key_name=key_name,
                                    current_value="Not found in .env files",
                                    status="missing",
                                    file_path=str(py_file),
                                    line_number=line_num,
                                    context=match.group(0),
                                    priority=self._get_key_priority(key_name),
                                    required_for=self._get_required_for(key_name)
                                )
            except Exception as e:
                print(f"⚠️  Error scanning {py_file}: {e}")

    def _scan_typescript_files(self, skip_dirs: set):
        """Scan TypeScript files for API key references"""
        print("📘 Scanning TypeScript files...")
        
        ts_files = list(self.project_root.rglob("*.ts"))
        # Filter out files in skipped directories
        ts_files = [f for f in ts_files if not any(skip_dir in str(f) for skip_dir in skip_dirs)]
        for ts_file in ts_files:
            try:
                with open(ts_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Look for process.env references
                    env_pattern = r'process\.env\.([A-Z_]+)'
                    matches = re.finditer(env_pattern, content)
                    
                    for match in matches:
                        key_name = match.group(1)
                        if self._is_api_key(key_name):
                            line_num = content[:match.start()].count('\n') + 1
                            
                            if key_name not in self.discovered_keys:
                                self.discovered_keys[key_name] = APIKeyInfo(
                                    key_name=key_name,
                                    current_value="Not found in .env files",
                                    status="missing",
                                    file_path=str(ts_file),
                                    line_number=line_num,
                                    context=match.group(0),
                                    priority=self._get_key_priority(key_name),
                                    required_for=self._get_required_for(key_name)
                                )
            except Exception as e:
                print(f"⚠️  Error scanning {ts_file}: {e}")

    def _scan_javascript_files(self, skip_dirs: set):
        """Scan JavaScript files for API key references"""
        print("📗 Scanning JavaScript files...")
        
        js_files = list(self.project_root.rglob("*.js"))
        # Filter out files in skipped directories
        js_files = [f for f in js_files if not any(skip_dir in str(f) for skip_dir in skip_dirs)]
        for js_file in js_files:
            try:
                with open(js_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Look for process.env references
                    env_pattern = r'process\.env\.([A-Z_]+)'
                    matches = re.finditer(env_pattern, content)
                    
                    for match in matches:
                        key_name = match.group(1)
                        if self._is_api_key(key_name):
                            line_num = content[:match.start()].count('\n') + 1
                            
                            if key_name not in self.discovered_keys:
                                self.discovered_keys[key_name] = APIKeyInfo(
                                    key_name=key_name,
                                    current_value="Not found in .env files",
                                    status="missing",
                                    file_path=str(js_file),
                                    line_number=line_num,
                                    context=match.group(0),
                                    priority=self._get_key_priority(key_name),
                                    required_for=self._get_required_for(key_name)
                                )
            except Exception as e:
                print(f"⚠️  Error scanning {js_file}: {e}")

    def _scan_json_files(self, skip_dirs: set):
        """Scan JSON configuration files for API key references"""
        print("📄 Scanning JSON files...")
        
        json_files = list(self.project_root.rglob("*.json"))
        # Filter out files in skipped directories
        json_files = [f for f in json_files if not any(skip_dir in str(f) for skip_dir in skip_dirs)]
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Look for API key patterns in JSON
                    key_pattern = r'["\']([A-Z_]+)["\']\s*:\s*["\']([^"\']+)["\']'
                    matches = re.finditer(key_pattern, content)
                    
                    for match in matches:
                        key_name = match.group(1)
                        value = match.group(2)
                        
                        if self._is_api_key(key_name):
                            line_num = content[:match.start()].count('\n') + 1
                            
                            if key_name not in self.discovered_keys:
                                status = self._determine_key_status(value)
                                self.discovered_keys[key_name] = APIKeyInfo(
                                    key_name=key_name,
                                    current_value=value,
                                    status=status,
                                    file_path=str(json_file),
                                    line_number=line_num,
                                    context=match.group(0),
                                    priority=self._get_key_priority(key_name),
                                    required_for=self._get_required_for(key_name)
                                )
            except Exception as e:
                print(f"⚠️  Error scanning {json_file}: {e}")

    def _scan_md_files(self, skip_dirs: set):
        """Scan Markdown files for API key documentation"""
        print("📝 Scanning Markdown files...")
        
        md_files = list(self.project_root.rglob("*.md"))
        # Filter out files in skipped directories
        md_files = [f for f in md_files if not any(skip_dir in str(f) for skip_dir in skip_dirs)]
        for md_file in md_files:
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Look for API key documentation patterns
                    doc_pattern = r'([A-Z_]+)\s*[:=]\s*([^\n]+)'
                    matches = re.finditer(doc_pattern, content)
                    
                    for match in matches:
                        key_name = match.group(1)
                        value = match.group(2).strip()
                        
                        if self._is_api_key(key_name) and key_name not in self.discovered_keys:
                            status = self._determine_key_status(value)
                            line_num = content[:match.start()].count('\n') + 1
                            
                            self.discovered_keys[key_name] = APIKeyInfo(
                                key_name=key_name,
                                current_value=value,
                                status=status,
                                file_path=str(md_file),
                                line_number=line_num,
                                context=match.group(0),
                                priority=self._get_key_priority(key_name),
                                required_for=self._get_required_for(key_name)
                            )
            except Exception as e:
                print(f"⚠️  Error scanning {md_file}: {e}")

    def _is_api_key(self, key_name: str) -> bool:
        """Check if a key name looks like an API key"""
        api_key_patterns = [
            r'.*API_KEY$',
            r'.*ACCESS_TOKEN$',
            r'.*CLIENT_ID$',
            r'.*CLIENT_SECRET$',
            r'.*BOT_TOKEN$',
            r'.*USER_TOKEN$',
            r'.*PERSONAL_ACCESS_TOKEN$'
        ]
        
        return any(re.match(pattern, key_name) for pattern in api_key_patterns)

    def _determine_key_status(self, value: str) -> str:
        """Determine the status of an API key value"""
        if not value or value == "":
            return "missing"
        
        for pattern in self.placeholder_patterns:
            if re.search(pattern, value, re.IGNORECASE):
                return "placeholder"
        
        # Check if it looks like a real key (basic validation)
        if len(value) > 10 and not any(char in value for char in [' ', '\n', '\t']):
            return "valid"
        
        return "unknown"

    def _get_key_priority(self, key_name: str) -> str:
        """Get priority level for a key"""
        if key_name in self.high_priority_keys:
            return "high"
        elif key_name in self.medium_priority_keys:
            return "medium"
        elif key_name in self.low_priority_keys:
            return "low"
        else:
            return "unknown"

    def _get_required_for(self, key_name: str) -> List[str]:
        """Get list of what this key is required for"""
        all_keys = {**self.high_priority_keys, **self.medium_priority_keys, **self.low_priority_keys}
        return all_keys.get(key_name, ["Unknown purpose"])

    def _generate_discovery_report(self):
        """Generate comprehensive discovery report"""
        print("\n" + "="*80)
        print("🔍 API KEY DISCOVERY REPORT")
        print("="*80)
        
        # Group by priority
        high_priority = {k: v for k, v in self.discovered_keys.items() if v.priority == "high"}
        medium_priority = {k: v for k, v in self.discovered_keys.items() if v.priority == "medium"}
        low_priority = {k: v for k, v in self.discovered_keys.items() if v.priority == "low"}
        
        # Group by status
        missing = {k: v for k, v in self.discovered_keys.items() if v.status == "missing"}
        placeholder = {k: v for k, v in self.discovered_keys.items() if v.status == "placeholder"}
        valid = {k: v for k, v in self.discovered_keys.items() if v.status == "valid"}
        
        print(f"\n📊 SUMMARY:")
        print(f"   Total Keys Found: {len(self.discovered_keys)}")
        print(f"   High Priority: {len(high_priority)}")
        print(f"   Medium Priority: {len(medium_priority)}")
        print(f"   Low Priority: {len(low_priority)}")
        print(f"   Missing: {len(missing)}")
        print(f"   Placeholder: {len(placeholder)}")
        print(f"   Valid: {len(valid)}")
        
        # High Priority Issues
        if high_priority:
            print(f"\n🚨 HIGH PRIORITY ISSUES:")
            for key, info in high_priority.items():
                status_icon = "❌" if info.status in ["missing", "placeholder"] else "✅"
                print(f"   {status_icon} {key}: {info.status.upper()}")
                print(f"      Current Value: {info.current_value}")
                print(f"      Required For: {', '.join(info.required_for)}")
                print(f"      Found In: {info.file_path}:{info.line_number}")
                print()
        
        # Save detailed report
        self._save_detailed_report()

    def _save_detailed_report(self):
        """Save detailed discovery report to file"""
        report_data = {
            "timestamp": datetime.now().isoformat(),
            "project_root": str(self.project_root),
            "total_keys": len(self.discovered_keys),
            "keys": {}
        }
        
        for key, info in self.discovered_keys.items():
            report_data["keys"][key] = {
                "key_name": info.key_name,
                "current_value": info.current_value,
                "status": info.status,
                "file_path": info.file_path,
                "line_number": info.line_number,
                "context": info.context,
                "priority": info.priority,
                "required_for": info.required_for
            }
        
        report_file = self.project_root / "api_key_discovery_report.json"
        with open(report_file, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"📄 Detailed report saved to: {report_file}")

def main():
    """Main execution function"""
    project_root = "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects"
    
    agent = APIKeyDiscoveryAgent(project_root)
    discovered_keys = agent.discover_all_keys()
    
    print(f"\n✅ Discovery complete! Found {len(discovered_keys)} API key requirements.")
    return discovered_keys

if __name__ == "__main__":
    main()
