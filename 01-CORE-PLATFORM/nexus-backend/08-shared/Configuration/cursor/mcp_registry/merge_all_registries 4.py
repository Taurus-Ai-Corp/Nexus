#!/usr/bin/env python3
import json
from pathlib import Path

BASE = Path(__file__).parent
MERGED = BASE / "mcp_servers_merged.json"
ADDITIONAL = BASE / "additional_mcp_servers.json"
AUTOMATION = BASE / "automation_mcp_servers.json"
FINAL = BASE / "mcp_servers_final.json"

def load_json(p: Path):
    if not p.exists():
        return {}
    with p.open("r", encoding="utf-8", errors="ignore") as f:
        return json.load(f)

def main():
    # Load all registries
    merged = load_json(MERGED)
    additional = load_json(ADDITIONAL)
    automation = load_json(AUTOMATION)

    # Collect all servers
    all_servers = {}

    # From merged (original)
    for block in merged.get("servers", []):
        m = block.get("mcpServers") or {}
        for name, entry in m.items():
            all_servers[name] = entry

    # From additional (infrastructure MCPs)
    for name, entry in (additional.get("mcpServers") or {}).items():
        all_servers[name] = entry

    # From automation (specialized tools)
    for name, entry in (automation.get("mcpServers") or {}).items():
        all_servers[name] = entry

    # Build final registry
    final = {
        "version": "2.0",
        "generated_at": "2025-09-30T23:00:00Z",
        "description": "TAURUS AI Complete MCP Registry - All Tools and Servers",
        "total_servers": len(all_servers),
        "categories": {
            "infrastructure": ["playwright", "figma", "design-tokens", "tailwind", "components", "icons"],
            "communications": ["gmail", "slack", "google-sheets"],
            "business_ops": ["notion", "hubspot", "airtable", "linear", "clickup"],
            "development": ["chrome-devtools", "coinbase"],
            "regulatory": ["regulatory_diff", "licensing_checklist", "doc_pack_generator", "canada_disclaimer"],
            "custody": ["custody_readiness_check", "safe_deployer", "risk_controls_matrix"],
            "investment": ["investor_gating", "product_brief", "kyc_pack"],
            "marketing": ["seo_analyzer", "brand_guard", "content_generator"],
            "localization": ["localization", "india_compliance_note"],
            "intelligence": ["research_fetch", "intel_diff"]
        },
        "servers": [{"mcpServers": all_servers}]
    }

    FINAL.write_text(json.dumps(final, indent=2), encoding="utf-8")
    print(f"Final registry created: {FINAL}")
    print(f"Total servers: {len(all_servers)}")

    # List all servers for verification
    print("\nAll registered servers:")
    for name in sorted(all_servers.keys()):
        print(f"  - {name}")

if __name__ == "__main__":
    main()
