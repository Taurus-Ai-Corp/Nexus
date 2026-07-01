# Numbered Duplicate Triage Notes

## Current status

- 2,347 duplicate files deleted from the main worktree in total.
- `.worktrees/comply-redirect-feat/` left untouched — separate linked worktree for GRIDERA|Comply.
- Zero numbered duplicate files remain in the main worktree.

## Decisions made

| Duplicate | Canonical | Action | Reason |
|-----------|-----------|--------|--------|
| `package 2.json` | `package.json` | Deleted | Canonical has `nodemailer` needed by contact form |
| `progress 2.md` | `progress.md` | Deleted | Older, empty progress file |
| `Dockerfile 2` | `Dockerfile` | Deleted | Older BizFlow branding |
| `trace-build 2` | `trace-build` | Deleted | Build cache artifact |
| `.gitignore 2` | `.gitignore` | Deleted | Canonical excludes `.env.local` (more secure) |
| `Screenshot ... PM 2.png` | `Screenshot ... PM.png` | Deleted | Duplicate screenshot |
| `design_ai_mcp 2.py` | `design_ai_mcp.py` | Deleted | Duplicate had hardcoded credentials |
| `webflow_design_mcp 2.py` | `webflow_design_mcp.py` | Deleted | Older formatting-only variant |
| `infographic_generator 2.py` | `infographic_generator.py` | Deleted | Older typing variant |
| `job_generator 2.py` | `job_generator.py` | Deleted | Older typing variant |
| `merge_all_registries 2.py` | `merge_all_registries.py` | Deleted | Whitespace-only differences |
| `mcp_healthcheck 2.py` | `mcp_healthcheck.py` | Deleted | Minor import differences |
| `merge_registry 2.py` | `merge_registry.py` | Deleted | Minor import differences |
| `demo-github-mcp 2.py` | `demo-github-mcp.py` | Deleted | Placeholder token variant |
| nexus-studio `... 2` symlinks | originals | Deleted | Broken duplicate symlinks to external BizFlow repo |
| `.next/cache/* 2` files | originals | Deleted | Build cache duplicates |

## Guardrail

`tests/test_repo_cleanup.py` now fails if any numbered duplicate file reappears.
