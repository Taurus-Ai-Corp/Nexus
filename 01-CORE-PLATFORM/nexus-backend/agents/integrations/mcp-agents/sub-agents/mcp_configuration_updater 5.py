#!/usr/bin/env python3
"""
MCP Configuration Updater Agent
Master Orchestrator Sub-Agent for MCP API Keys Fix System

This agent updates all MCP configuration files to use the correct
environment file paths and ensures proper MCP server configuration.
"""

import json
import os
from datetime import datetime
from pathlib import Path


class MCPConfigurationUpdater:
    """Updates MCP configuration files with correct paths and settings"""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.master_env_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "master.env"
        self.updated_configs: list[Path] = []
        self.errors: list[str] = []

        # Standard MCP server configurations
        self.mcp_servers = {
            "playwright": {
                "command": "npx",
                "args": ["@playwright/mcp@latest"]
            },
            "figma": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/figma-mcp/index.js"],
                "env": {
                    "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
                }
            },
            "design-tokens": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/design-tokens-mcp/index.js"],
                "env": {
                    "DESIGN_TOKENS_PATH": "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/design-tokens-mcp/tokens"
                }
            },
            "tailwind": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/tailwind-mcp/index.js"]
            },
            "components": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/component-library-mcp/index.js"]
            },
            "icons": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/icon-assets-mcp/index.js"]
            },
            "gmail": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/klavis/mcp_servers/gmail/src/index.ts"],
                "env": {
                    "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
                    "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}"
                }
            },
            "google-sheets": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/klavis/mcp_servers/google-sheets/src/index.ts"],
                "env": {
                    "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
                    "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}"
                }
            },
            "slack": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/klavis/mcp_servers/slack/src/index.ts"],
                "env": {
                    "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
                    "SLACK_USER_TOKEN": "${SLACK_USER_TOKEN}"
                }
            },
            "notion": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/klavis/mcp_servers/notion/src/index.ts"],
                "env": {
                    "NOTION_API_KEY": "${NOTION_API_KEY}"
                }
            },
            "github": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/klavis/mcp_servers/github/src/index.ts"],
                "env": {
                    "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
                }
            },
            "perplexity": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/klavis/mcp_servers/perplexity/src/index.ts"],
                "env": {
                    "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}"
                }
            },
            "firecrawl": {
                "command": "node",
                "args": ["/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/external-mcps/klavis/mcp_servers/firecrawl_deep_research/src/index.ts"],
                "env": {
                    "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"
                }
            }
        }

    def update_all_configurations(self) -> dict[str, list[str]]:
        """Update all MCP configuration files"""
        print("🔧 Starting MCP Configuration Updater...")

        results = {
            "updated_files": [],
            "created_files": [],
            "errors": []
        }

        # Find all MCP configuration files
        mcp_config_files = self._find_mcp_config_files()
        print(f"🔍 Found {len(mcp_config_files)} MCP configuration files")

        # Update each configuration file
        for config_file in mcp_config_files:
            try:
                self._update_config_file(config_file)
                results["updated_files"].append(str(config_file))
                print(f"✅ Updated: {config_file}")
            except Exception as e:
                error_msg = f"Error updating {config_file}: {str(e)}"
                results["errors"].append(error_msg)
                print(f"❌ {error_msg}")

        # Create new standard configurations
        self._create_standard_configurations(results)

        # Update Cursor IDE configuration
        self._update_cursor_configuration(results)

        # Generate environment loader script
        self._create_environment_loader(results)

        return results

    def _find_mcp_config_files(self) -> list[Path]:
        """Find all MCP configuration files in the project"""
        config_files = []

        # Search for various MCP config file patterns
        patterns = [
            "*mcp*config*.json",
            "cursor-mcp-config.json",
            "enhanced-cursor-mcp-config.json",
            "mcp.json",
            "mcp_config.json"
        ]

        for pattern in patterns:
            found_files = list(self.project_root.rglob(pattern))
            config_files.extend(found_files)

        # Remove duplicates and sort
        config_files = list(set(config_files))
        config_files.sort()

        return config_files

    def _update_config_file(self, config_file: Path):
        """Update a specific MCP configuration file"""
        if not config_file.exists():
            print(f"⚠️  Config file not found: {config_file}")
            return

        # Read existing configuration
        with open(config_file) as f:
            try:
                config_data = json.load(f)
            except json.JSONDecodeError:
                print(f"⚠️  Invalid JSON in {config_file}")
                return

        # Update configuration based on file type
        if "mcpServers" in config_data:
            # Cursor MCP configuration format
            self._update_cursor_mcp_config(config_data, config_file)
        elif "servers" in config_data:
            # Standard MCP configuration format
            self._update_standard_mcp_config(config_data, config_file)
        else:
            # Unknown format, create standard format
            self._create_standard_format(config_data, config_file)

    def _update_cursor_mcp_config(self, config_data: dict, config_file: Path):
        """Update Cursor MCP configuration format"""
        # Update environment file reference
        config_data["envFile"] = str(self.master_env_file)

        # Update MCP servers
        if "mcpServers" not in config_data:
            config_data["mcpServers"] = {}

        # Add/update each MCP server
        for server_name, server_config in self.mcp_servers.items():
            config_data["mcpServers"][server_name] = server_config

        # Add metadata
        config_data["_metadata"] = {
            "updated_by": "Master Orchestrator - MCP Configuration Updater",
            "updated_at": datetime.now().isoformat(),
            "env_file": str(self.master_env_file)
        }

        # Write updated configuration
        with open(config_file, 'w') as f:
            json.dump(config_data, f, indent=2)

    def _update_standard_mcp_config(self, config_data: dict, config_file: Path):
        """Update standard MCP configuration format"""
        # Update environment file reference
        config_data["envFile"] = str(self.master_env_file)

        # Update servers
        if "servers" not in config_data:
            config_data["servers"] = {}

        # Add/update each MCP server
        for server_name, server_config in self.mcp_servers.items():
            config_data["servers"][server_name] = server_config

        # Add metadata
        config_data["_metadata"] = {
            "updated_by": "Master Orchestrator - MCP Configuration Updater",
            "updated_at": datetime.now().isoformat(),
            "env_file": str(self.master_env_file)
        }

        # Write updated configuration
        with open(config_file, 'w') as f:
            json.dump(config_data, f, indent=2)

    def _create_standard_format(self, config_data: dict, config_file: Path):
        """Create standard MCP configuration format"""
        new_config = {
            "mcpServers": self.mcp_servers,
            "envFile": str(self.master_env_file),
            "_metadata": {
                "updated_by": "Master Orchestrator - MCP Configuration Updater",
                "updated_at": datetime.now().isoformat(),
                "env_file": str(self.master_env_file)
            }
        }

        # Write new configuration
        with open(config_file, 'w') as f:
            json.dump(new_config, f, indent=2)

    def _create_standard_configurations(self, results: dict):
        """Create standard MCP configuration files"""
        print("📝 Creating standard MCP configurations...")

        # Main Cursor MCP configuration
        cursor_config_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "cursor-mcp-config.json"

        cursor_config = {
            "mcpServers": self.mcp_servers,
            "envFile": str(self.master_env_file),
            "_metadata": {
                "updated_by": "Master Orchestrator - MCP Configuration Updater",
                "updated_at": datetime.now().isoformat(),
                "env_file": str(self.master_env_file)
            }
        }

        with open(cursor_config_file, 'w') as f:
            json.dump(cursor_config, f, indent=2)

        results["created_files"].append(str(cursor_config_file))
        print(f"✅ Created: {cursor_config_file}")

        # Enhanced configuration with all servers
        enhanced_config_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "enhanced-cursor-mcp-config.json"

        enhanced_config = {
            "mcpServers": self.mcp_servers,
            "envFile": str(self.master_env_file),
            "settings": {
                "autoStart": True,
                "debugMode": True,
                "logLevel": "INFO"
            },
            "_metadata": {
                "updated_by": "Master Orchestrator - MCP Configuration Updater",
                "updated_at": datetime.now().isoformat(),
                "env_file": str(self.master_env_file)
            }
        }

        with open(enhanced_config_file, 'w') as f:
            json.dump(enhanced_config, f, indent=2)

        results["created_files"].append(str(enhanced_config_file))
        print(f"✅ Created: {enhanced_config_file}")

    def _update_cursor_configuration(self, results: dict):
        """Update Cursor IDE configuration"""
        print("🎯 Updating Cursor IDE configuration...")

        # Cursor configuration directory
        cursor_config_dir = Path.home() / ".cursor"
        cursor_config_dir.mkdir(exist_ok=True)

        # MCP configuration for Cursor
        cursor_mcp_config = cursor_config_dir / "mcp.json"

        cursor_config = {
            "mcpServers": self.mcp_servers,
            "envFile": str(self.master_env_file),
            "_metadata": {
                "updated_by": "Master Orchestrator - MCP Configuration Updater",
                "updated_at": datetime.now().isoformat(),
                "env_file": str(self.master_env_file)
            }
        }

        with open(cursor_mcp_config, 'w') as f:
            json.dump(cursor_config, f, indent=2)

        results["updated_files"].append(str(cursor_mcp_config))
        print(f"✅ Updated Cursor config: {cursor_mcp_config}")

    def _create_environment_loader(self, results: dict):
        """Create environment loader script"""
        print("📜 Creating environment loader script...")

        loader_script = f"""#!/bin/bash
# Environment Loader Script for MCP Integration
# Generated by Master Orchestrator - MCP Configuration Updater

# Load environment variables from master .env file
export ENV_FILE="{self.master_env_file}"

if [ -f "$ENV_FILE" ]; then
    echo "Loading environment variables from: $ENV_FILE"
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    echo "Environment variables loaded successfully"
else
    echo "Error: Environment file not found at $ENV_FILE"
    exit 1
fi

# Start MCP servers
echo "Starting MCP servers..."

# Add your MCP server startup commands here
# Example:
# node /path/to/mcp-server-1/index.js &
# node /path/to/mcp-server-2/index.js &

echo "MCP servers started"
"""

        loader_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "load_environment.sh"

        with open(loader_file, 'w') as f:
            f.write(loader_script)

        # Make executable
        os.chmod(loader_file, 0o755)

        results["created_files"].append(str(loader_file))
        print(f"✅ Created: {loader_file}")

    def generate_cursor_setup_instructions(self) -> str:
        """Generate Cursor IDE setup instructions"""
        instructions = f"""# 🎯 Cursor IDE MCP Setup Instructions

## Quick Setup

1. **Copy the MCP configuration:**
   ```bash
   cp "{self.project_root}/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/cursor-mcp-config.json" ~/.cursor/mcp.json
   ```

2. **Set up environment variables:**
   ```bash
   # Load environment variables
   source "{self.project_root}/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/load_environment.sh"
   ```

3. **Restart Cursor IDE:**
   - Close Cursor completely
   - Reopen Cursor
   - Check MCP settings in Cursor preferences

## Manual Setup

1. Open Cursor IDE
2. Go to Settings (Cmd/Ctrl + ,)
3. Search for "MCP" or "Model Context Protocol"
4. Add the configuration from `cursor-mcp-config.json`
5. Set environment file path to: `{self.master_env_file}`

## Verification

1. Open Cursor Chat (Cmd/Ctrl + L)
2. Try using MCP tools:
   - "Create a new Figma design"
   - "Search the web for latest AI news"
   - "Generate a React component"

## Troubleshooting

- Ensure all API keys are set in the environment file
- Check that MCP servers are running
- Verify Cursor IDE has access to the environment file
- Restart Cursor IDE after configuration changes

---
*Generated by Master Orchestrator - MCP Configuration Updater*
"""

        instructions_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "CURSOR_SETUP_INSTRUCTIONS.md"

        with open(instructions_file, 'w') as f:
            f.write(instructions)

        print(f"📋 Created setup instructions: {instructions_file}")
        return str(instructions_file)

def main():
    """Main execution function"""
    project_root = "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects"

    updater = MCPConfigurationUpdater(project_root)
    results = updater.update_all_configurations()

    print("\n" + "="*80)
    print("🔧 MCP CONFIGURATION UPDATER RESULTS")
    print("="*80)
    print(f"✅ Updated files: {len(results['updated_files'])}")
    print(f"📝 Created files: {len(results['created_files'])}")
    print(f"❌ Errors: {len(results['errors'])}")

    if results['errors']:
        print("\n❌ ERRORS:")
        for error in results['errors']:
            print(f"   - {error}")

    # Generate setup instructions
    instructions_file = updater.generate_cursor_setup_instructions()
    print(f"\n📋 Setup instructions: {instructions_file}")

    return results

if __name__ == "__main__":
    main()
