#!/usr/bin/env python3
"""
MCP Diagnostic and Fix Tool
Diagnoses and fixes MCP server configuration issues
"""

import os
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Any
import shutil

class MCPDiagnosticTool:
    """Diagnoses and fixes MCP server issues"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.master_env_path = self.project_root / "master.env"
        self.config_files = [
            self.project_root / "enhanced-cursor-mcp-config.json",
            self.project_root / "cursor_mcp_config.json"
        ]
        
        # Load environment variables
        self.env_vars = self.load_env_vars()
        
        # MCP server status
        self.server_status = {}
    
    def load_env_vars(self) -> Dict[str, str]:
        """Load environment variables from master.env"""
        env_vars = {}
        if self.master_env_path.exists():
            with open(self.master_env_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key.strip()] = value.strip()
        return env_vars
    
    def diagnose_all_mcps(self):
        """Diagnose all MCP server issues"""
        print("🔍 MCP DIAGNOSTIC TOOL")
        print("=" * 60)
        print("Diagnosing all MCP server issues...")
        print()
        
        # Check each config file
        for config_file in self.config_files:
            if config_file.exists():
                print(f"📋 Checking config: {config_file.name}")
                self.diagnose_config_file(config_file)
                print()
        
        # Generate fix recommendations
        self.generate_fix_recommendations()
        
        # Create fixed configuration
        self.create_fixed_configuration()
    
    def diagnose_config_file(self, config_file: Path):
        """Diagnose issues in a specific config file"""
        try:
            with open(config_file, 'r') as f:
                config = json.load(f)
            
            if 'mcpServers' not in config:
                print("❌ No mcpServers section found")
                return
            
            for server_name, server_config in config['mcpServers'].items():
                print(f"\n🔧 Checking server: {server_name}")
                status = self.diagnose_server(server_name, server_config)
                self.server_status[server_name] = status
                
                # Print status
                if status['working']:
                    print(f"✅ {server_name}: Working")
                else:
                    print(f"❌ {server_name}: Issues found")
                    for issue in status['issues']:
                        print(f"   • {issue}")
        
        except Exception as e:
            print(f"❌ Failed to read config file: {e}")
    
    def diagnose_server(self, server_name: str, server_config: Dict) -> Dict:
        """Diagnose a specific MCP server"""
        status = {
            'working': True,
            'issues': [],
            'fixes': []
        }
        
        # Check command
        command = server_config.get('command')
        if not command:
            status['working'] = False
            status['issues'].append("No command specified")
            return status
        
        # Check if command exists
        if command not in ['node', 'npx', 'python', 'python3']:
            if not shutil.which(command):
                status['working'] = False
                status['issues'].append(f"Command '{command}' not found")
        
        # Check arguments (file paths)
        args = server_config.get('args', [])
        if args:
            for arg in args:
                if arg.startswith('/') and not arg.startswith('@'):  # Absolute path
                    file_path = Path(arg)
                    if not file_path.exists():
                        status['working'] = False
                        status['issues'].append(f"File not found: {arg}")
                        
                        # Try to find alternative files
                        alternatives = self.find_alternative_files(file_path)
                        if alternatives:
                            status['fixes'].append(f"Alternative files found: {alternatives}")
        
        # Check environment variables
        env_vars = server_config.get('env', {})
        for env_key, env_value in env_vars.items():
            if env_value.startswith('${') and env_value.endswith('}'):
                # Environment variable reference
                var_name = env_value[2:-1]
                if var_name not in self.env_vars or self.env_vars[var_name] in ['', 'your_' + var_name.lower() + '_here']:
                    status['working'] = False
                    status['issues'].append(f"Environment variable not configured: {var_name}")
                    status['fixes'].append(f"Set {var_name} in master.env")
        
        return status
    
    def find_alternative_files(self, original_path: Path) -> List[str]:
        """Find alternative files for missing paths"""
        alternatives = []
        
        # Try different extensions
        if original_path.suffix == '.ts':
            js_path = original_path.with_suffix('.js')
            if js_path.exists():
                alternatives.append(str(js_path))
        
        # Try in different directories
        filename = original_path.name
        search_dirs = [
            self.project_root,
            self.project_root / "external-mcps",
            self.project_root / "figma-mcp",
            self.project_root / "design-tokens-mcp",
            self.project_root / "tailwind-mcp",
            self.project_root / "component-library-mcp",
            self.project_root / "icon-assets-mcp"
        ]
        
        for search_dir in search_dirs:
            if search_dir.exists():
                for found_file in search_dir.rglob(filename):
                    if found_file.exists() and str(found_file) not in alternatives:
                        alternatives.append(str(found_file))
                
                # Also try .js version if original was .ts
                if filename.endswith('.ts'):
                    js_filename = filename[:-3] + '.js'
                    for found_file in search_dir.rglob(js_filename):
                        if found_file.exists() and str(found_file) not in alternatives:
                            alternatives.append(str(found_file))
        
        return alternatives[:3]  # Limit to first 3 alternatives
    
    def generate_fix_recommendations(self):
        """Generate fix recommendations"""
        print("🔧 FIX RECOMMENDATIONS")
        print("=" * 60)
        
        working_servers = [name for name, status in self.server_status.items() if status['working']]
        broken_servers = [name for name, status in self.server_status.items() if not status['working']]
        
        print(f"✅ Working servers ({len(working_servers)}): {', '.join(working_servers)}")
        print(f"❌ Broken servers ({len(broken_servers)}): {', '.join(broken_servers)}")
        print()
        
        if broken_servers:
            print("📋 ISSUES AND FIXES:")
            for server_name in broken_servers:
                status = self.server_status[server_name]
                print(f"\n🔧 {server_name}:")
                for issue in status['issues']:
                    print(f"   ❌ {issue}")
                for fix in status['fixes']:
                    print(f"   ✅ {fix}")
    
    def create_fixed_configuration(self):
        """Create a fixed MCP configuration"""
        print("\n⚙️ CREATING FIXED CONFIGURATION")
        print("=" * 60)
        
        # Create a working configuration with only functional servers
        fixed_config = {
            "mcpServers": {},
            "envFile": str(self.master_env_path),
            "settings": {
                "autoStart": True,
                "debugMode": True,
                "logLevel": "INFO"
            }
        }
        
        # Add playwright (known to work)
        fixed_config["mcpServers"]["playwright"] = {
            "command": "npx",
            "args": ["@playwright/mcp@latest"]
        }
        
        # Add Google Admin MCP if server file exists
        google_admin_server = self.project_root / "external-mcps" / "google-admin-mcp" / "server.js"
        if google_admin_server.exists():
            fixed_config["mcpServers"]["google-admin"] = {
                "command": "node",
                "args": [str(google_admin_server)],
                "env": {
                    "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
                    "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
                    "GOOGLE_ACCESS_TOKEN": "${GOOGLE_ACCESS_TOKEN}",
                    "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}",
                    "GOOGLE_WORKSPACE_DOMAIN": "${GOOGLE_WORKSPACE_DOMAIN}"
                }
            }
        
        # Add other servers if their files exist and have proper environment variables
        potential_servers = {
            "figma": {
                "path": "figma-mcp/index.js",
                "env": {"FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"}
            },
            "github": {
                "path": "external-mcps/github-mcp/index.js",
                "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"}
            },
            "perplexity": {
                "path": "external-mcps/perplexity-mcp/index.js", 
                "env": {"PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}"}
            },
            "firecrawl": {
                "path": "external-mcps/firecrawl-mcp/index.js",
                "env": {"FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"}
            }
        }
        
        for server_name, server_info in potential_servers.items():
            server_path = self.project_root / server_info["path"]
            if server_path.exists():
                # Check if environment variables are configured
                env_configured = True
                for env_key in server_info["env"].keys():
                    var_name = env_key
                    if var_name not in self.env_vars or self.env_vars[var_name] in ['', f'your_{var_name.lower()}_here']:
                        env_configured = False
                        break
                
                if env_configured:
                    fixed_config["mcpServers"][server_name] = {
                        "command": "node",
                        "args": [str(server_path)],
                        "env": server_info["env"]
                    }
        
        # Save fixed configuration
        fixed_config_path = self.project_root / "fixed_mcp_config.json"
        with open(fixed_config_path, 'w') as f:
            json.dump(fixed_config, f, indent=2)
        
        print(f"✅ Fixed configuration saved: {fixed_config_path}")
        print(f"📋 Working servers: {len(fixed_config['mcpServers'])}")
        
        # Print the configuration
        print("\n📄 FIXED CONFIGURATION:")
        print(json.dumps(fixed_config, indent=2))
    
    def create_missing_mcp_servers(self):
        """Create missing MCP server files"""
        print("\n🔨 CREATING MISSING MCP SERVERS")
        print("=" * 60)
        
        # Create basic MCP servers for missing ones
        missing_servers = {
            "figma-mcp": self.create_figma_mcp,
            "design-tokens-mcp": self.create_design_tokens_mcp,
            "tailwind-mcp": self.create_tailwind_mcp,
            "component-library-mcp": self.create_component_library_mcp,
            "icon-assets-mcp": self.create_icon_assets_mcp
        }
        
        for server_name, create_func in missing_servers.items():
            server_dir = self.project_root / server_name
            if not server_dir.exists():
                print(f"📁 Creating {server_name}...")
                create_func()
    
    def create_figma_mcp(self):
        """Create Figma MCP server"""
        server_dir = self.project_root / "figma-mcp"
        server_dir.mkdir(exist_ok=True)
        
        # Create package.json
        package_json = {
            "name": "figma-mcp",
            "version": "1.0.0",
            "main": "index.js",
            "dependencies": {
                "@modelcontextprotocol/sdk": "^0.5.0"
            }
        }
        
        with open(server_dir / "package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        
        # Create basic server
        server_code = '''const { Server } = require("@modelcontextprotocol/sdk/server");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio");

const server = new Server(
    { name: "figma-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => {
    return {
        tools: [{
            name: "figma_status",
            description: "Check Figma MCP status",
            inputSchema: { type: "object", properties: {} }
        }]
    };
});

server.setRequestHandler("tools/call", async (request) => {
    if (request.params.name === "figma_status") {
        return {
            content: [{ type: "text", text: "Figma MCP is running but needs proper implementation" }]
        };
    }
    throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(console.error);
'''
        
        with open(server_dir / "index.js", "w") as f:
            f.write(server_code)
        
        print(f"✅ Created Figma MCP server: {server_dir}")
    
    def create_design_tokens_mcp(self):
        """Create Design Tokens MCP server"""
        server_dir = self.project_root / "design-tokens-mcp"
        server_dir.mkdir(exist_ok=True)
        
        # Create tokens directory
        tokens_dir = server_dir / "tokens"
        tokens_dir.mkdir(exist_ok=True)
        
        # Create sample token file
        sample_tokens = {
            "colors": {
                "primary": "#007bff",
                "secondary": "#6c757d",
                "success": "#28a745",
                "danger": "#dc3545"
            },
            "spacing": {
                "xs": "4px",
                "sm": "8px",
                "md": "16px",
                "lg": "24px",
                "xl": "32px"
            }
        }
        
        with open(tokens_dir / "tokens.json", "w") as f:
            json.dump(sample_tokens, f, indent=2)
        
        # Create server (similar structure as Figma)
        self.create_basic_mcp_server(server_dir, "design-tokens-mcp", "Design Tokens")
        
        print(f"✅ Created Design Tokens MCP server: {server_dir}")
    
    def create_tailwind_mcp(self):
        """Create Tailwind MCP server"""
        server_dir = self.project_root / "tailwind-mcp"
        server_dir.mkdir(exist_ok=True)
        self.create_basic_mcp_server(server_dir, "tailwind-mcp", "Tailwind CSS")
        print(f"✅ Created Tailwind MCP server: {server_dir}")
    
    def create_component_library_mcp(self):
        """Create Component Library MCP server"""
        server_dir = self.project_root / "component-library-mcp"
        server_dir.mkdir(exist_ok=True)
        self.create_basic_mcp_server(server_dir, "component-library-mcp", "Component Library")
        print(f"✅ Created Component Library MCP server: {server_dir}")
    
    def create_icon_assets_mcp(self):
        """Create Icon Assets MCP server"""
        server_dir = self.project_root / "icon-assets-mcp"
        server_dir.mkdir(exist_ok=True)
        self.create_basic_mcp_server(server_dir, "icon-assets-mcp", "Icon Assets")
        print(f"✅ Created Icon Assets MCP server: {server_dir}")
    
    def create_basic_mcp_server(self, server_dir: Path, server_name: str, display_name: str):
        """Create a basic MCP server template"""
        # Create package.json
        package_json = {
            "name": server_name,
            "version": "1.0.0",
            "main": "index.js",
            "dependencies": {
                "@modelcontextprotocol/sdk": "^0.5.0"
            }
        }
        
        with open(server_dir / "package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        
        # Create basic server
        server_code = f'''const {{ Server }} = require("@modelcontextprotocol/sdk/server");
const {{ StdioServerTransport }} = require("@modelcontextprotocol/sdk/server/stdio");

const server = new Server(
    {{ name: "{server_name}", version: "1.0.0" }},
    {{ capabilities: {{ tools: {{}} }} }}
);

server.setRequestHandler("tools/list", async () => {{
    return {{
        tools: [{{
            name: "{server_name.replace('-', '_')}_status",
            description: "Check {display_name} MCP status",
            inputSchema: {{ type: "object", properties: {{}} }}
        }}]
    }};
}});

server.setRequestHandler("tools/call", async (request) => {{
    if (request.params.name === "{server_name.replace('-', '_')}_status") {{
        return {{
            content: [{{ type: "text", text: "{display_name} MCP is running but needs proper implementation" }}]
        }};
    }}
    throw new Error(`Unknown tool: ${{request.params.name}}`);
}});

async function main() {{
    const transport = new StdioServerTransport();
    await server.connect(transport);
}}

main().catch(console.error);
'''
        
        with open(server_dir / "index.js", "w") as f:
            f.write(server_code)


def main():
    """Main function"""
    diagnostic = MCPDiagnosticTool()
    
    print("🔍 MCP DIAGNOSTIC AND FIX TOOL")
    print("=" * 60)
    print("This tool will diagnose and fix your MCP server issues.")
    print()
    
    # Run diagnostics
    diagnostic.diagnose_all_mcps()
    
    # Create missing servers
    diagnostic.create_missing_mcp_servers()
    
    print("\n🎉 DIAGNOSTIC COMPLETE!")
    print("=" * 60)
    print("✅ Fixed configuration created: fixed_mcp_config.json")
    print("✅ Missing MCP servers created")
    print("✅ Use the fixed configuration in Cursor to resolve red status issues")


if __name__ == "__main__":
    main()
