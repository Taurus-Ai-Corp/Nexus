#!/usr/bin/env python3
import json
import sys
from pathlib import Path

BASE = Path(__file__).parent
MERGED = BASE / "mcp_servers_merged.json"
ADDITIONAL = BASE / "additional_mcp_servers.json"
OUT = BASE / "mcp_servers_combined.json"

def load_json(p: Path):
    with p.open("r", encoding="utf-8", errors="ignore") as f:
        return json.load(f)

def main():
    if not MERGED.exists():
        print(f"missing:{MERGED}")
        sys.exit(1)
    merged = load_json(MERGED)
    base_servers = {}
    # normalize into a flat dict name->entry
    for block in merged.get("servers", []):
        m = block.get("mcpServers") or {}
        for name, entry in m.items():
            base_servers[name] = entry
    # overlay additional
    if ADDITIONAL.exists():
        add = load_json(ADDITIONAL)
        for name, entry in (add.get("mcpServers") or {}).items():
            base_servers[name] = entry
    # write combined
    out = {
        "version": "1.0",
        "servers": [{"mcpServers": base_servers}]
    }
    OUT.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"combined:{OUT}")

if __name__ == "__main__":
    main()
