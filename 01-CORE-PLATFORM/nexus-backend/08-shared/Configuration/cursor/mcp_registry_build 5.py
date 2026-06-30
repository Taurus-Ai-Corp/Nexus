#!/usr/bin/env python3
import json
import os
from pathlib import Path
from typing import Any

HUB_ROOT = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS-BUSINESS-INTELLIGENCE-HUB")
BACKUP_ROOT = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/STRUCTURE_OPTIMIZATION_BACKUP")
REG_DIR = HUB_ROOT / "02-PLATFORM-OPERATIONS/TAURUS AI CORP/BizFlow-Agentic_Intelligent_Orchestrator/08-shared/Configuration/cursor/mcp_registry"
REG_DIR.mkdir(parents=True, exist_ok=True)

SOURCES_LIST = REG_DIR / "sources.txt"
MERGED_JSON = REG_DIR / "mcp_servers_merged.json"

CANDIDATE_NAMES = {
    "cursor-mcp-config.json",
    "CURSOR_MCP_CONFIG_READY.json",
    "local_mcp_servers.json",
}


def find_candidates(root: Path) -> list[Path]:
    out: list[Path] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in {"node_modules", "venv", "site-packages", ".git"}]
        for fn in filenames:
            if fn in CANDIDATE_NAMES or fn.endswith(".cursor/mcp.json"):
                out.append(Path(dirpath) / fn)
            if fn.endswith("mcp.json") and ".cursor" in str(dirpath):
                out.append(Path(dirpath) / fn)
    return out


def safe_load_json(p: Path) -> Any:
    try:
        with p.open("r", encoding="utf-8", errors="ignore") as f:
            return json.load(f)
    except Exception:
        return None


def normalize_entries(data: Any, source: Path) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    if isinstance(data, dict):
        # Try common shapes
        if "servers" in data and isinstance(data["servers"], list):
            for s in data["servers"]:
                if isinstance(s, dict):
                    s_copy = dict(s)
                    s_copy["__source__"] = str(source)
                    entries.append(s_copy)
        elif "mcp_servers" in data and isinstance(data["mcp_servers"], list):
            for s in data["mcp_servers"]:
                if isinstance(s, dict):
                    s_copy = dict(s)
                    s_copy["__source__"] = str(source)
                    entries.append(s_copy)
        else:
            # Maybe this file itself is a server descriptor
            data_copy = dict(data)
            data_copy["__source__"] = str(source)
            entries.append(data_copy)
    elif isinstance(data, list):
        for s in data:
            if isinstance(s, dict):
                s_copy = dict(s)
                s_copy["__source__"] = str(source)
                entries.append(s_copy)
    return entries


def unique_key(entry: dict[str, Any]) -> str:
    # Prefer name or id; fallback to command path
    for k in ("name", "id", "title"):
        if k in entry and isinstance(entry[k], str):
            return entry[k]
    # fallback
    cmd = entry.get("command") or entry.get("cmd") or entry.get("path")
    if isinstance(cmd, str):
        return cmd
    return json.dumps(entry, sort_keys=True)[:80]


def main():
    candidates = find_candidates(HUB_ROOT) + find_candidates(BACKUP_ROOT)
    # de-dup by full path
    seen_paths = set()
    uniq_candidates: list[Path] = []
    for p in candidates:
        s = str(p)
        if s not in seen_paths:
            seen_paths.add(s)
            uniq_candidates.append(p)

    # write sources list
    SOURCES_LIST.write_text("\n".join(str(p) for p in uniq_candidates), encoding="utf-8")

    merged: dict[str, dict[str, Any]] = {}
    for p in uniq_candidates:
        data = safe_load_json(p)
        if data is None:
            continue
        for entry in normalize_entries(data, p):
            key = unique_key(entry)
            if key not in merged:
                merged[key] = entry
            else:
                # Merge shallowly: do not override existing fields, append source
                existing = merged[key]
                for k, v in entry.items():
                    if k == "__source__":
                        continue
                    if k not in existing and v is not None:
                        existing[k] = v
                # track sources
                srcs = set(existing.get("__sources__", []))
                srcs.add(entry.get("__source__", str(p)))
                existing["__sources__"] = sorted(list(srcs))
                merged[key] = existing

    # Output merged servers
    out = {
        "generated_at": os.popen('date -u +%Y-%m-%dT%H:%M:%SZ').read().strip(),
        "count": len(merged),
        "servers": list(merged.values()),
    }
    MERGED_JSON.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"Registry built: {MERGED_JSON}")
    print(f"Sources listed: {SOURCES_LIST}")

if __name__ == "__main__":
    main()
