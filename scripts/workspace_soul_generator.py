#!/usr/bin/env python3
"""
workspace_soul_generator.py

Analyze a workspace and emit:
- /tmp/<profile_name>-SOUL.md  (proposed Hermes profile identity)
- <workspace>/AGENTS.md         (project-specific context loaded by Hermes)

Usage:
    python3 scripts/workspace_soul_generator.py <workspace_path> [--name <profile>] [--platform <nexus|q-grid|comply|custom>]
"""
import argparse
import json
import os
import re
from pathlib import Path


def detect_stack(workspace: Path):
    signals = {
        "languages": set(),
        "frameworks": set(),
        "package_managers": set(),
        "build_commands": set(),
        "cloud_targets": set(),
        "ci_cd": set(),
        "key_files": {},
    }

    files = {
        "package.json": workspace / "package.json",
        "pyproject.toml": workspace / "pyproject.toml",
        "requirements.txt": workspace / "requirements.txt",
        "Cargo.toml": workspace / "Cargo.toml",
        "go.mod": workspace / "go.mod",
        "Dockerfile": workspace / "Dockerfile",
        "docker-compose.yml": workspace / "docker-compose.yml",
        "vercel.json": workspace / "vercel.json",
        "next.config.js": workspace / "next.config.js",
        "tailwind.config.js": workspace / "tailwind.config.js",
        "tailwind.config.ts": workspace / "tailwind.config.ts",
        ".github/workflows": workspace / ".github/workflows",
        ".pre-commit-config.yaml": workspace / ".pre-commit-config.yaml",
        "README.md": workspace / "README.md",
        "CLAUDE.md": workspace / "CLAUDE.md",
        "AGENTS.md": workspace / "AGENTS.md",
    }

    for name, path in files.items():
        if path.exists():
            signals["key_files"][name] = str(path.relative_to(workspace))

    if (workspace / "package.json").exists():
        signals["package_managers"].add("npm")
        signals["languages"].add("JavaScript/Node")
        try:
            data = json.loads((workspace / "package.json").read_text(encoding="utf-8"))
            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
            if any(k in deps for k in ["next", "react", "react-dom"]):
                signals["frameworks"].add("Next.js/React")
            if "tailwindcss" in deps:
                signals["frameworks"].add("Tailwind CSS")
            if "typescript" in deps:
                signals["languages"].add("TypeScript")
            scripts = data.get("scripts", {})
            for script in scripts:
                if any(k in script for k in ["build", "dev", "test", "lint", "start"]):
                    signals["build_commands"].add(f"npm run {script}")
        except Exception:
            pass

    if (workspace / "pyproject.toml").exists():
        signals["package_managers"].add("poetry/uv")
        signals["languages"].add("Python")
        text = (workspace / "pyproject.toml").read_text(encoding="utf-8", errors="replace")
        if "fastapi" in text.lower():
            signals["frameworks"].add("FastAPI")
        if "django" in text.lower():
            signals["frameworks"].add("Django")

    if (workspace / "requirements.txt").exists():
        signals["package_managers"].add("pip")
        signals["languages"].add("Python")

    if (workspace / "Dockerfile").exists() or (workspace / "docker-compose.yml").exists():
        signals["cloud_targets"].add("Docker")

    if (workspace / "vercel.json").exists():
        signals["cloud_targets"].add("Vercel")

    if (workspace / ".github" / "workflows").is_dir():
        signals["ci_cd"].add("GitHub Actions")

    if (workspace / ".pre-commit-config.yaml").exists():
        signals["ci_cd"].add("pre-commit")

    # Walk for common top-level patterns
    for entry in workspace.iterdir():
        if entry.is_dir():
            name = entry.name.lower()
            if name in {"platform", "frontend", "backend", "api", "app", "web"}:
                signals["frameworks"].add(name)

    return {k: sorted(v) if isinstance(v, set) else v for k, v in signals.items()}


def read_project_docs(workspace: Path):
    docs = {}
    for filename in ["README.md", "CLAUDE.md", "AGENTS.md", ".cursorrules"]:
        path = workspace / filename
        if path.exists():
            try:
                text = path.read_text(encoding="utf-8", errors="replace")
                # truncate long docs to first 120 lines
                lines = text.splitlines()
                docs[filename] = "\n".join(lines[:120])
            except Exception as e:
                docs[filename] = f"[error reading {filename}: {e}]"
    return docs


def generate_soul(name: str, platform: str, signals: dict, docs: dict) -> str:
    stack_summary = ", ".join(signals["languages"][:3] + signals["frameworks"][:3])
    deploy = ", ".join(signals["cloud_targets"]) or "local/dev"
    ci = ", ".join(signals["ci_cd"]) or "none"
    build = ", ".join(sorted(signals["build_commands"])[:4]) or "custom"

    platform_voice = {
        "nexus": "Nexus platform agent: SaaS go-to-market, client ops, Vercel deploys, and revenue-first execution.",
        "q-grid": "Q-Grid platform agent: PQC-attested AI guardrails, security tooling, and deep-tech credibility.",
        "comply": "GRIDERA|Comply agent: regulatory compliance, audit trails, and enterprise-readiness.",
    }.get(platform.lower(), f"{platform} product agent: shipping features and revenue for the {platform} platform.")

    return f"""# Soul
You are the {platform_voice} You operate inside a {stack_summary} stack deployed to {deploy} with {ci}. Your priority is shipping useful increments without breaking existing pipelines.

## Voice
Direct and action-first. Lead with the one recommended next step and why. Use exact file paths, verification commands, and numbers. Avoid hype and filler. If a request is a distraction from the current 90-day goal, say so immediately.

## Operations
Start every session by scanning the workspace and any existing AGENTS.md. Prefer small, test-backed changes on feature branches. Run dry-runs before destructive work. Ask explicit approval before merge-to-main, production deploys, credential writes, or schema changes. Typical build/test surface: {build}.

## Restrictions
Never deploy to production or run vercel --prod without explicit user approval. Never modify shell rc or credential files without approval. Never fabricate evidence, legal documents, or damage claims. Never run blanket git reset, git clean, or global staging without approval. If paid APIs are unavailable, pivot to free cloud endpoints and organic GTM.
"""


def generate_agents(workspace: Path, platform: str, signals: dict, docs: dict) -> str:
    stack_lines = []
    for category, items in signals.items():
        if category == "key_files":
            continue
        if items:
            stack_lines.append(f"- {category}: {', '.join(items)}")

    existing = ""
    for filename in ["README.md", "CLAUDE.md"]:
        if filename in docs:
            existing += f"\n## From {filename}\n{docs[filename]}\n"

    return f"""# {platform.title()} Agent Context

## Stack
{chr(10).join(stack_lines) if stack_lines else "- Unknown — manual review needed"}

## Key Files
{chr(10).join(f"- {fname}: {path}" for fname, path in signals.get("key_files", {}).items()) or "- None detected"}

## Project Conventions
- Work on feature branches; user runs final merge-to-main.
- Do not touch production deploys or production environment variables.
- Prefer revenue-generating or shipping actions over analysis-only work.
- Verify with commands like `dig`, `curl`, or test runners before declaring success.
- Respect the user's explicit blocks on destructive git ops and credential writes.

{existing}
"""


def main():
    parser = argparse.ArgumentParser(description="Generate a workspace-grounded SOUL.md proposal and AGENTS.md")
    parser.add_argument("workspace", type=Path, help="Path to the workspace to analyze")
    parser.add_argument("--name", default="project", help="Profile name for the SOUL.md proposal")
    parser.add_argument("--platform", default="custom", help="Platform/product name (nexus, q-grid, comply, etc.)")
    args = parser.parse_args()

    workspace = args.workspace.resolve()
    if not workspace.is_dir():
        print(f"ERROR: {workspace} is not a directory")
        return 1

    signals = detect_stack(workspace)
    docs = read_project_docs(workspace)

    soul = generate_soul(args.name, args.platform, signals, docs)
    agents = generate_agents(workspace, args.platform, signals, docs)

    soul_path = Path(f"/tmp/{args.name}-SOUL.md")
    agents_path = workspace / "AGENTS.md"

    soul_path.write_text(soul, encoding="utf-8")
    agents_path.write_text(agents, encoding="utf-8")

    print(f"Generated SOUL proposal: {soul_path}")
    print(f"Generated AGENTS.md:     {agents_path}")
    print(f"\nDetected stack:")
    print(json.dumps(signals, indent=2))
    print(f"\nTo activate:")
    print(f"  hermes profile create {args.name} --clone")
    print(f"  cp {soul_path} ~/.hermes/profiles/{args.name}/SOUL.md")
    print(f"Then start a new Hermes session from {workspace}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
