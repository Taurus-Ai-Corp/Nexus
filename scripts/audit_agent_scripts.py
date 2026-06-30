#!/usr/bin/env python3
"""Audit untracked agent scripts and produce KEEP/MERGE/DELETE recommendations.

The script walks the configured agent-related directories, inspects the first 20
lines of each untracked ``.py`` file, and classifies it as:

* KEEP — unique, referenced, or has a clear entry point.
* MERGE — overlaps with an existing committed file and should be merged.
* DELETE — numbered duplicate, empty file, or trivial stub.

Outputs:

* JSON report at ``/tmp/agent-audit-report.json``.
* Markdown manifest at ``06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md``.

No files are moved or deleted by this script. Destructive archiving requires a
separate human approval step.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import List

ROOT = "/Users/taurus_ai/Documents/Nexus-Platform"
MANIFEST_PATH = os.path.join(
    ROOT, "06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md"
)
REPORT_PATH = "/tmp/agent-audit-report.json"

WATCH_DIRS = [
    "06-WORKFLOWS",
    "04-PRODUCT-DEPLOYMENT/platform-dev",
    "01-CORE-PLATFORM/nexus-backend/agents",
    "social-suite-dashboard",
]

EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    ".venv",
    "__pycache__",
    ".pytest_cache",
    ".hermes",
}


@dataclass
class AuditItem:
    relative_path: str
    absolute_path: str
    decision: str
    size_bytes: int
    sha256: str
    has_main: bool = False
    has_async_def: bool = False
    classes: List[str] = field(default_factory=list)
    top_functions: List[str] = field(default_factory=list)
    top_imports: List[str] = field(default_factory=list)
    reason: str = ""
    duplicate_of: str | None = None


def _run_git_status() -> List[str]:
    """Return paths of untracked files in the main worktree only.

    ``git status --short`` reports untracked files relative to the main worktree.
    Linked worktrees under ``.worktrees/`` are ignored so the audit does not
    accidentally operate across worktree boundaries. Directories are returned as
    untracked too, but we only use this set for file-level membership checks.
    """
    result = subprocess.run(
        ["git", "-C", ROOT, "status", "--short"],
        capture_output=True,
        text=True,
        check=True,
    )
    paths: List[str] = []
    for line in result.stdout.splitlines():
        if not line.startswith("??"):
            continue
        raw = line[3:]
        # Drop linked-worktree paths (reported as .worktrees/<name>/path).
        if raw.startswith(".worktrees/"):
            continue
        paths.append(raw)
    return paths


def _is_untracked(rel_path: str, untracked_set: set[str]) -> bool:
    """Return True if ``rel_path`` is considered untracked.

    Git status may report an untracked directory with a trailing slash (e.g.
    ``06-WORKFLOWS/``). We therefore check whether the file is listed exactly or
    whether any of its parent directories are untracked.
    """
    if rel_path in untracked_set:
        return True
    parts = Path(rel_path).parts
    for i in range(1, len(parts)):
        prefix = "/".join(parts[:i]) + "/"
        if prefix in untracked_set:
            return True
    return False


def _list_tracked_files() -> set[str]:
    """Return all tracked files under the repository root (not worktrees)."""
    result = subprocess.run(
        ["git", "-C", ROOT, "ls-files"],
        capture_output=True,
        text=True,
        check=True,
    )
    return set(result.stdout.splitlines())


def _is_excluded_dir(path: str) -> bool:
    parts = path.split(os.sep)
    return any(part in EXCLUDED_DIRS for part in parts)


def _is_inside_git_dir(path: str) -> bool:
    """Return True if path is inside a .git directory or git worktree metadata."""
    parts = path.split(os.sep)
    if ".git" in parts:
        return True
    # Git worktrees expose a nested repository; skip them to avoid cross-worktree noise.
    if parts and parts[0] == ".worktrees":
        return True
    return False


def _normalize_name(filename: str) -> str:
    """Return a canonical base name for duplicate detection.

    ``file 2.py`` and ``file.py`` share ``file.py``. Numbered suffixes that
    appear before the extension are stripped.
    """
    base = re.sub(r" \d+(?=\.py$)", "", filename, flags=re.IGNORECASE)
    return base.lower()


def _sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def _inspect_head(path: str) -> tuple[List[str], List[str], List[str], bool, bool]:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            lines = [line.rstrip("\n") for line in f.readlines()[:20]]
    except OSError:
        return [], [], [], False, False

    imports: List[str] = []
    classes: List[str] = []
    functions: List[str] = []
    has_main = False
    has_async = False

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("import ") or stripped.startswith("from "):
            imports.append(stripped)
        cls_match = re.match(r"^class\s+(\w+)", stripped)
        if cls_match:
            classes.append(cls_match.group(1))
        def_match = re.match(r"^(async\s+)?def\s+(\w+)", stripped)
        if def_match:
            func_name = def_match.group(2)
            functions.append(func_name)
            if def_match.group(1):
                has_async = True
        if "if __name__" in stripped:
            has_main = True

    return imports, classes, functions, has_main, has_async


def _is_numbered_duplicate(filename: str) -> bool:
    return bool(re.search(r" \d+\.py$", filename, re.IGNORECASE))


def _is_trivial(path: str) -> bool:
    try:
        size = os.path.getsize(path)
    except OSError:
        return True
    if size == 0:
        return True
    if size <= 256:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        if content.strip().startswith("#") or not content.strip():
            return True
    return False


def _is_merge_candidate(
    item: AuditItem, committed_files: set[str]
) -> str | None:
    """Return the committed file path if this looks like a duplicate/merge candidate."""
    candidate_relative = _normalize_name(os.path.basename(item.relative_path))
    # Find committed files in the same directory with the same canonical name.
    rel_dir = os.path.dirname(item.relative_path)
    for committed in committed_files:
        if not committed.endswith(".py"):
            continue
        if os.path.dirname(committed) != rel_dir:
            continue
        if _normalize_name(os.path.basename(committed)) == candidate_relative:
            return committed
    return None


def _audit() -> List[AuditItem]:
    untracked = set(_run_git_status())
    if not untracked:
        return []

    tracked_set = _list_tracked_files()

    items: List[AuditItem] = []
    for watch_dir in WATCH_DIRS:
        abs_watch_dir = os.path.join(ROOT, watch_dir)
        if not os.path.isdir(abs_watch_dir):
            continue
        for dirpath, _, filenames in os.walk(abs_watch_dir):
            if _is_excluded_dir(dirpath):
                continue
            for filename in filenames:
                if not filename.endswith(".py"):
                    continue
                abs_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(abs_path, ROOT)
                if not _is_untracked(rel_path, untracked):
                    continue

                imports, classes, functions, has_main, has_async = _inspect_head(
                    abs_path
                )
                size = os.path.getsize(abs_path)
                sha = _sha256_file(abs_path)

                item = AuditItem(
                    relative_path=rel_path,
                    absolute_path=abs_path,
                    decision="KEEP",
                    size_bytes=size,
                    sha256=sha,
                    has_main=has_main,
                    has_async_def=has_async,
                    classes=classes,
                    top_functions=functions,
                    top_imports=imports,
                )

                duplicate_of = _is_merge_candidate(item, tracked_set)
                if _is_numbered_duplicate(filename):
                    item.decision = "DELETE"
                    item.reason = "numbered duplicate copy"
                    item.duplicate_of = duplicate_of or "canonical base file"
                elif _is_trivial(abs_path):
                    item.decision = "DELETE"
                    item.reason = "empty or trivial stub"
                elif duplicate_of:
                    item.decision = "MERGE"
                    item.reason = f"overlaps committed file: {duplicate_of}"
                    item.duplicate_of = duplicate_of
                else:
                    if has_main:
                        item.reason = "has __main__/entry point and is unique"
                    elif classes or functions:
                        item.reason = "contains classes/functions, no obvious duplicate"
                    else:
                        item.reason = "unique untracked utility/script"

                items.append(item)

    return sorted(items, key=lambda x: (x.decision, x.relative_path))


def _write_json_report(items: List[AuditItem]) -> None:
    report = {
        "generated_at": subprocess.run(
            ["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"],
            capture_output=True,
            text=True,
            check=True,
        ).stdout.strip(),
        "root": ROOT,
        "summary": {
            "KEEP": len([i for i in items if i.decision == "KEEP"]),
            "MERGE": len([i for i in items if i.decision == "MERGE"]),
            "DELETE": len([i for i in items if i.decision == "DELETE"]),
            "total": len(items),
        },
        "items": [asdict(i) for i in items],
    }
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)


def _write_manifest(items: List[AuditItem]) -> None:
    os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)

    counts = {
        "KEEP": len([i for i in items if i.decision == "KEEP"]),
        "MERGE": len([i for i in items if i.decision == "MERGE"]),
        "DELETE": len([i for i in items if i.decision == "DELETE"]),
    }

    lines = [
        "# Taurus-AI-Agent-Registry MANIFEST",
        "",
        "Generated by `scripts/audit_agent_scripts.py`.",
        "",
        "## Summary",
        "",
        f"- **KEEP**: {counts['KEEP']} files",
        f"- **MERGE**: {counts['MERGE']} files",
        f"- **DELETE**: {counts['DELETE']} files",
        f"- **Total untracked .py scanned**: {len(items)}",
        "",
        "## KEEP / MERGE / DELETE Table",
        "",
        "| Decision | File | Size | Reason | Duplicate Of | Notes |",
        "|----------|------|------|--------|--------------|-------|",
    ]

    for item in items:
        notes = []
        if item.has_main:
            notes.append("has __main__")
        if item.has_async_def:
            notes.append("has async def")
        if item.classes:
            notes.append(f"classes: {', '.join(item.classes)}")
        if item.top_functions:
            notes.append(f"functions: {', '.join(item.top_functions[:3])}")
        note_str = "; ".join(notes) if notes else "—"
        lines.append(
            f"| {item.decision} | `{item.relative_path}` | {item.size_bytes} | "
            f"{item.reason} | {item.duplicate_of or '—'} | {note_str} |"
        )

    lines.extend(
        [
            "",
            "## Next Step",
            "",
            "DELETE files will be moved to `.hermes/archive/deleted-agent-scripts-2026-06-30/` "
            "after explicit human approval. No permanent deletion is performed by this scanner.",
            "",
        ]
    )

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main() -> int:
    items = _audit()
    _write_json_report(items)
    _write_manifest(items)

    counts = {
        "KEEP": len([i for i in items if i.decision == "KEEP"]),
        "MERGE": len([i for i in items if i.decision == "MERGE"]),
        "DELETE": len([i for i in items if i.decision == "DELETE"]),
    }

    print("Agent script audit complete.")
    print(f"  KEEP:  {counts['KEEP']}")
    print(f"  MERGE: {counts['MERGE']}")
    print(f"  DELETE:{counts['DELETE']}")
    print(f"  Total: {len(items)}")
    print(f"  JSON report:  {REPORT_PATH}")
    print(f"  Manifest:     {MANIFEST_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
