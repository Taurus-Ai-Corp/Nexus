#!/usr/bin/env python3
import json
from pathlib import Path

BASE = Path(__file__).parent
COMBINED = BASE / "mcp_servers_combined.json"
ENV_INVENTORY = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS-BUSINESS-INTELLIGENCE-HUB/02-PLATFORM-OPERATIONS/TAURUS AI CORP/BizFlow-Agentic_Intelligent_Orchestrator/08-shared/secrets/env_inventory_vars.txt")

# Minimal static health: ensure every server has a command, args array, and env keys (if present) exist in inventory; check absolute paths exist

def load_env_keys(inv: Path):
    keys=set()
    if not inv.exists():
        return keys
    with inv.open("r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            parts=line.strip().split()
            if len(parts)>=2:
                keys.add(parts[1])
    return keys

def main():
    if not COMBINED.exists():
        print("ERROR: combined registry not found")
        raise SystemExit(1)
    data=json.loads(COMBINED.read_text(encoding="utf-8", errors="ignore"))
    blocks=data.get("servers",[])
    inv_keys=load_env_keys(ENV_INVENTORY)
    ok=True
    for block in blocks:
        m=block.get("mcpServers") or {}
        for name, entry in m.items():
            cmd=entry.get("command")
            args=entry.get("args",[])
            if not cmd or not isinstance(args,list):
                print(f"FAIL: {name}: missing command/args")
                ok=False
            # Check absolute path args existence when path-like
            for a in args:
                if isinstance(a,str) and a.startswith("/"):
                    p=Path(a)
                    if not p.exists():
                        print(f"WARN: {name}: path not found: {a}")
            # Env keys presence check (names only)
            env=entry.get("env",{})
            for k in env.keys():
                if k not in inv_keys:
                    print(f"WARN: {name}: env key not in master inventory: {k}")
    if ok:
        print("HEALTHCHECK: PASS (static checks)")
    else:
        print("HEALTHCHECK: FAIL (see issues above)")
        raise SystemExit(2)

if __name__=="__main__":
    main()
