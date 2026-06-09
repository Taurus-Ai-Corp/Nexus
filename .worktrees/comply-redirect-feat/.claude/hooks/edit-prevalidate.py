#!/usr/bin/env python3
"""
Claude Code PreToolUse hook: Edit / MultiEdit validator.

Blocks Edit/MultiEdit calls where any old_string does not appear verbatim
in the target file, before the API roundtrip happens.

Why: Edit failures cost a full billed turn (model regenerates after seeing the
"old_string not found" error). Catching the mismatch locally turns a wasted
roundtrip into an instant local error, and Claude can re-Read the file before
retrying.

Behavior:
- Allows the call (exit 0, no output) for: non-Edit tools, missing files,
  empty old_string (file creation patterns), binary files, files >5MB,
  unreadable files.
- Denies (prints JSON, exit 0) when at least one old_string is missing.

Hook config (~/.claude/settings.json):
    {
      "hooks": {
        "PreToolUse": [
          { "matcher": "Edit|MultiEdit",
            "hooks": [{ "type": "command",
                        "command": "python3 $HOME/.claude/hooks/edit-prevalidate.py",
                        "timeout": 10 }] }
        ]
      }
    }
"""
import json
import os
import sys

MAX_BYTES = 5 * 1024 * 1024  # 5 MB
SNIPPET_CHARS = 140


def allow():
    sys.exit(0)


def deny(reason: str):
    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": reason,
            }
        },
        sys.stdout,
    )
    sys.exit(0)


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        allow()

    tool = payload.get("tool_name", "")
    if tool not in ("Edit", "MultiEdit"):
        allow()

    ti = payload.get("tool_input") or {}
    fp = ti.get("file_path", "")
    if not fp or not os.path.isfile(fp):
        allow()

    try:
        if os.path.getsize(fp) > MAX_BYTES:
            allow()
    except OSError:
        allow()

    try:
        with open(fp, "rb") as f:
            head = f.read(8192)
            if b"\x00" in head:
                allow()
            f.seek(0)
            content = f.read().decode("utf-8", errors="replace")
    except OSError:
        allow()

    if tool == "Edit":
        old_strings = [ti.get("old_string") or ""]
    else:
        old_strings = [
            (e or {}).get("old_string") or "" for e in (ti.get("edits") or [])
        ]

    old_strings = [s for s in old_strings if s]
    if not old_strings:
        allow()

    for s in old_strings:
        if s not in content:
            snippet = s[:SNIPPET_CHARS].replace("\n", "\\n").replace("\t", "\\t")
            ellipsis = "..." if len(s) > SNIPPET_CHARS else ""
            reason = (
                f"old_string not found verbatim in {fp}. "
                "Re-read the file with the Read tool first — the file "
                "may have changed since you last read it, or whitespace / "
                "indentation differs from your copy. Common causes: stale "
                "view, line-number prefix from cat -n included by mistake, "
                "tabs vs spaces, or trailing-whitespace mismatch. "
                f'Missing snippet: "{snippet}{ellipsis}"'
            )
            deny(reason)

    allow()


if __name__ == "__main__":
    main()
