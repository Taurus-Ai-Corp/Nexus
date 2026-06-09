# Platform Rename Source of Truth

> **Created:** 2026-06-09 | **Author:** Claude Code (Nexus Platform Team)
> **Purpose:** Single source of truth for all platform naming, preventing brand drift across the three converging platforms.

---

## Brand Architecture

### Primary Brands

| Brand | Legal Entity | Use Case | Status |
|-------|-------------|----------|--------|
| **NEXUS by Taurus Ai** | TAURUS AI CORP - FZCO (Dubai) | Social suite, Creative Studio, Platform | Active |
| **Gridera by Taurus Ai** | ARQ Quantum LLC (Wyoming) | PQC compliance platform | Active |
| **NEOFLOW™** | TBD | Future merged BizFlow+Nexus | Future (trademark filed) |
| **Taurus AI CORP - FZCO** | TAURUS AI CORP - FZCO | Legal docs only (invoices, contracts) | Legal entity |

### Retired Brands

| Brand | Replaced By | Reason |
|-------|-------------|--------|
| NeoSync | NEXUS by Taurus Ai | Rebranded 2026 |
| NeoVibe | NEXUS by Taurus Ai | Retired 2026 |
| AI Atlas / Atlas AI | N/A | Third-party service, not our product |
| BizFlow | NEXUS by Taurus Ai | Merged into NEXUS ecosystem |
| GridDB | PostgreSQL + pgvector | Obsolete database |

---

## Canonical Naming Rules

### Per `brand_guidelines.md:6` — First Mention Requirements

| Context | Must Use |
|---------|----------|
| Marketing (first mention) | "NEXUS by Taurus Ai" |
| Marketing (subsequent) | "NEXUS" or "Nexus" |
| Developer docs | "Nexus" |
| Legal docs | "TAURUS AI CORP - FZCO" |
| PQC platform (first mention) | "Gridera by Taurus Ai" |
| PQC platform (subsequent) | "Gridera" |
| Future product | "NEOFLOW™" (with trademark symbol) |

---

## Legacy Term → Canonical Replacement

| Legacy Term | Canonical Replacement | Scope |
|-------------|----------------------|-------|
| NeoSync | Nexus / NEXUS by Taurus Ai | All refs except git history |
| NeoSync™ | NEXUS by Taurus Ai | All marketing/docs |
| NeoVibe | NEXUS by Taurus Ai / Nexus_Social | All refs |
| NeoVibe_DESIGN_LOUNGE | design_system / Design System | Directory/file names |
| NeoVibe Connector | Nexus Connector | Code references |
| AI Atlas | N/A (archive) | Do not rebrand |
| Atlas AI | N/A (archive) | Do not rebrand |
| GridDB | PostgreSQL + pgvector | Database refs |
| BizFlow Empire | NEXUS Creative Studio | Config/messaging |
| BizFlow™ | NEXUS by Taurus Ai | Current products |
| NEOFLOW | NEOFLOW™ (with ™) | Future product only |
| NEXUS-PROD-001 | Taurus-Prod-001 | Infrastructure naming |
| Nexosync | Nexus | Git branch naming |
| NeoVibe_DESIGN_LOUNGE | design_system | Directory naming |

---

## Environment Variable Mapping

| Legacy Variable | Canonical Variable | Service |
|----------------|-------------------|---------|
| `NEOSYNC_API_KEY` | `NEXUS_API_KEY` | All services |
| `NEOSYNC_SECRET` | `NEXUS_SECRET` | All services |
| `NEOVIBE_DB_URL` | `NEXUS_DB_URL` | All services |
| `NEOVIBE_REDIS_URL` | `NEXUS_REDIS_URL` | All services |
| `GRIDER_API_KEY` | `GRIDERA_API_KEY` | PQC services |
| `GRIDER_SECRET` | `GRIDERA_SECRET` | PQC services |
| `GRIDER_DB_URL` | `GRIDERA_DB_URL` | PQC services |
| `ATLAS_API_KEY` | N/A (archive) | AI Atlas refs |
| `BIZFLOW_SECRET` | `NEXUS_SECRET` | Creative Studio |

---

## Directory Structure Mapping

| Legacy Path | Canonical Path |
|-------------|----------------|
| `Nexus _ Platform Devops/` | `nexus-social-suite/` (pending rename) |
| `NeoVibe_DESIGN_LOUNGE/` | `design_system/` (pending rename) |
| `BIizflow_supernova_OCT_8/` | `supernova/` (pending rename) |
| `01-CORE-PLATFORM/nexus-studio/` | `01-CORE-PLATFORM/nexus-creative-studio/` (pending rename) |

---

## File Rename Rules

| Pattern | Replacement | Example |
|---------|-------------|---------|
| `*NeoSync*` | `*Nexus*` | `NeoSyncLogo.png` → `NexusLogo.png` |
| `*NeoVibe*` | `*Nexus*` or `*design_system*` | `NeoVibe_DESIGN_LOUNGE` → `design_system` |
| `*neosync*` | `*nexus*` | `neosync-api` → `nexus-api` |
| `*neovibe*` | `*nexus*` or `*design*` | `neovibe-tokens` → `nexus-tokens` |
| `*grider_*` | `*gridera_*` | `grider_api` → `gridera_api` |
| `*bizflow*` | `*nexus*` (current) or `*neoflow*` (future) | Context-dependent |

---

## Git Branch Naming

| Legacy Branch | Canonical Branch |
|---------------|------------------|
| `feat/nexosync-to-nexus-rebrand` | `feat/platform-rebrand` (suggest rename) |
| `fix/neovibe-design-tokens` | `fix/design-tokens` |
| `release/bizflow-v2` | `release/nexus-v2` |

---

## CI/CD Checks

Add to `.github/workflows/ci.yml`:
```yaml
- name: Brand compliance check
  run: |
    # Fail if legacy terms found (excluding git history and this file)
    grep -r "NeoSync\|NeoVibe\|GridDB\|AI Atlas" \
      --include="*.{ts,tsx,js,jsx,py,json,md}" \
      --exclude="*2026-06-09-platform-rename-source-of-truth.md" \
      --exclude-dir=".git" \
      --exclude-dir="node_modules" \
      . && echo "ERROR: Legacy terms found" && exit 1 || echo "PASS"
```

---

## Exceptions (Do Not Rename)

| Term | Reason |
|------|--------|
| Git commit history | Preserved for audit trail |
| `NeoSync™` in archived docs | Historical reference |
| Third-party service names | Atlas AI, etc. — not our brand |
| Legal entity names | TAURUS AI CORP - FZCO (legal only) |

---

## Validation Checklist

- [ ] All `.env` files updated to canonical variable names
- [ ] All code references use canonical names
- [ ] All docs use canonical names
- [ ] All UI text uses canonical names
- [ ] CI brand compliance check passes
- [ ] No legacy terms in `git status` output
- [ ] Directory renames complete
- [ ] Git branch renamed (if applicable)

---

## Sources

- `brand_guidelines.md` — Official brand rules
- `company_hierarchy.md` — Platform hierarchy
- `docs/superpowers/specs/2026-05-18-taurus-ai-brand-architecture.md` — Brand architecture framework
- `docs/session-outputs/PRD-CEO-COMMAND-CENTER 2.md` — CEO Command Center session

---

**Next Review:** After PRD-001 implementation complete
**Owner:** Nexus Platform Team
**Status:** Source of Truth created — awaiting implementation
