# Master Workspace Rename Plan: Nexus → Nexus

> **For agentic workers:** Use superpowers:subagent-driven-development
> This is a LARGE rename operation. Execute in waves, respecting dependencies.

**Date:** 2026-05-19
**Workspace:** `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/`
**Strategy:** Keep workspace root. Only rename products/subdirectories.

---

## WAVE SUMMARY

| Wave | Tasks | Dependency | Risk |
|------|-------|------------|------|
| Wave 1 | Directory renames | First | HIGH |
| Wave 2 | Package.json + configs | After Wave 1 | HIGH |
| Wave 3 | Code files (types, imports) | After Wave 2 | MEDIUM |
| Wave 4 | Env files + docker configs | After Wave 2 | MEDIUM |
| Wave 5 | Markdown docs (bulk) | After Wave 3 | LOW |
| Wave 6 | Memory/Agent/Skill files | After Wave 5 | LOW |
| Wave 7 | Manual external updates | After Wave 6 | MANUAL |

---

## WAVE 1: Directory Renames

### Task W1-1: Rename nexus-studio → nexus-studio

**CRITICAL:** This must happen BEFORE any package.json or import updates.

**Path:** `01-CORE-PLATFORM/nexus-studio`
**Target:** `01-CORE-PLATFORM/nexus-studio`

```bash
cd /Users/taurus_ai/Documents/BizFlow-Nexus-Platform/01-CORE-PLATFORM
mv nexus-studio nexus-studio
```

**After rename:**
- Verify: `ls nexus-studio` exists
- Verify: `.vercel/project.json` updated (checked in Wave 2)

---

### Task W1-2: Rename taurus-nexus-creative → taurus-nexus-creative

**Path:** `taurus-nexus-creative`
**Target:** `taurus-nexus-creative`

```bash
cd /Users/taurus_ai/Documents/BizFlow-Nexus-Platform
mv taurus-nexus-creative taurus-nexus-creative
```

---

### Task W1-3: Rename social-suite-dashboard contents

**Path:** `Nexus _ Platform Devops/social-suite-dashboard`
**Target:** Already done (Nexus _ Platform Devops exists)

**Check:** Verify all contents are properly under Nexus directory

---

## WAVE 2: Package.json + Config Updates

### Task W2-1: Update root package.json

**File:** `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/package.json`

Changes:
- Line 2: `"name": "bizflow-nexus-platform"` → `"name": "bizflow-nexus-platform"`
- Line 8: workspace `"01-CORE-PLATFORM/nexus-studio"` → `"01-CORE-PLATFORM/nexus-studio"`
- Lines 11, 14, 15, 17, 21, 23: scripts `dev:nexus`, `build:nexus` → `dev:nexus`, `build:nexus`
- Line 47: git remote URL → `bizflow-nexus-platform`
- Line 55: keywords remove `"nexus"`, add `"nexus"`

```bash
# Backup first
cp package.json package.json.bak

# Use sed for replacements
sed -i '' 's/bizflow-nexus-platform/bizflow-nexus-platform/g' package.json
sed -i '' 's/nexus-studio/nexus-studio/g' package.json
sed -i '' 's/dev:nexus/dev:nexus/g' package.json
sed -i '' 's/build:nexus/build:nexus/g' package.json
sed -i '' 's/lint:nexus/lint:nexus/g' package.json
```

---

### Task W2-2: Update nexus-studio (now nexus-studio) package.json

**File:** `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/01-CORE-PLATFORM/nexus-studio/package.json`

Changes:
- `"name": "nexus-studio"` → `"name": "nexus-studio"`
- Update description

---

### Task W2-3: Update taurus-nexus-creative (was taurus-nexus-creative) package.json

**File:** `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/taurus-nexus-creative/package.json`

Changes:
- `"name": "taurus-nexus-creative"` → `"name": "taurus-nexus-creative"`
- Update description

---

### Task W2-4: Update Vercel project configs

**Files to check:**
- `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/01-CORE-PLATFORM/nexus-studio/.vercel/project.json`
- `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/taurus-nexus-creative/nexus/.vercel/project.json`

Change: `"projectName": "nexus-studio"` → `"projectName": "nexus-studio"`

```bash
# For nexus-studio
sed -i '' 's/"projectName": "nexus-studio"/"projectName": "nexus-studio"/g' 01-CORE-PLATFORM/nexus-studio/.vercel/project.json

# For taurus-nexus-creative/nexus
sed -i '' 's/"projectName": "nexus"/"projectName": "nexus"/g' taurus-nexus-creative/nexus/.vercel/project.json
```

---

## WAVE 3: Code File Updates

### Task W3-1: Update type definitions

**Files:**
- `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/03-CLIENT-MANAGEMENT/onboarding-portal/src/types/index.ts`

Changes in type definitions:
- `platform: 'nexus'` → `platform: 'nexus'`
- `nexus: 'Nexus by Taurus AI'` → `nexus: 'Nexus by Taurus AI'`
- `{ value: 'Praveen Varkey', label: 'Praveen Varkey (Nexus Kerala)' }` → `{ value: 'Praveen Varkey', label: 'Praveen Varkey (Nexus Kerala)' }`

```bash
sed -i '' "s/'nexus'/'nexus'/g" 03-CLIENT-MANAGEMENT/onboarding-portal/src/types/index.ts
sed -i '' "s/nexus.taurusai.io/nexus.taurusai.io/g" 03-CLIENT-MANAGEMENT/onboarding-portal/src/types/index.ts
sed -i '' 's/Nexus by Taurus AI/Nexus by Taurus AI/g' 03-CLIENT-MANAGEMENT/onboarding-portal/src/types/index.ts
sed -i '' 's/(Nexus/(Nexus/g' 03-CLIENT-MANAGEMENT/onboarding-portal/src/types/index.ts
```

---

### Task W3-2: Update wizard/PlatformSelectStep.tsx

**File:** `03-CLIENT-MANAGEMENT/onboarding-portal/src/components/wizard/PlatformSelectStep.tsx`

```bash
sed -i '' "s/'nexus'/'nexus'/g" 03-CLIENT-MANAGEMENT/onboarding-portal/src/components/wizard/PlatformSelectStep.tsx
sed -i '' "s/'Nexus'/'Nexus'/g" 03-CLIENT-MANAGEMENT/onboarding-portal/src/components/wizard/PlatformSelectStep.tsx
```

---

### Task W3-3: Update store.ts

**File:** `03-CLIENT-MANAGEMENT/onboarding-portal/src/lib/store.ts`

```bash
sed -i '' "s/platform: 'nexus'/platform: 'nexus'/g" 03-CLIENT-MANAGEMENT/onboarding-portal/src/lib/store.ts
```

---

### Task W3-4: Update taurus-agency-os files

**Files:**
- `taurus-agency-os/frontend/src/components/dashboard/agent-executor.tsx`
- `taurus-agency-os/backend/src/routes/agents.ts`

```bash
sed -i '' 's/nexus/nexus/g' taurus-agency-os/frontend/src/components/dashboard/agent-executor.tsx
sed -i '' 's/nexus/nexus/g' taurus-agency-os/backend/src/routes/agents.ts
```

---

## WAVE 4: Env Files + Docker

### Task W4-1: Update root .env.example

**File:** `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/.env.example`

Changes:
- `APP_NAME=BizFlow-Nexus-Platform` → `APP_NAME=BizFlow-Nexus-Platform`
- `Nexus_DOMAIN=nexus.taurusai.io` → `NEXUS_DOMAIN=nexus.taurusai.io`

```bash
sed -i '' 's/BizFlow-Nexus-Platform/BizFlow-Nexus-Platform/g' .env.example
sed -i '' 's/Nexus_DOMAIN/NEXUS_DOMAIN/g' .env.example
sed -i '' 's/nexus.taurusai.io/nexus.taurusai.io/g' .env.example
```

---

### Task W4-2: Update docker-compose.yml

**File:** `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/docker-compose.yml`

Changes:
- Line 52: `nexus-studio:` → `nexus-studio:`
- Line 54: `context: ./01-CORE-PLATFORM/nexus-studio` → `context: ./01-CORE-PLATFORM/nexus-studio`
- Line 56: `container_name: nexus-studio` → `container_name: nexus-studio`

```bash
sed -i '' 's/nexus-studio/nexus-studio/g' docker-compose.yml
sed -i '' 's/nexus-studio/nexus-studio/g' "Nexus _ Platform Devops/docker-compose.yml"
```

---

### Task W4-3: Update N8N integration configs

**Files:**
- `/Users/taurus_ai/Documents/BizFlow-Nexus-Platform/01-CORE-PLATFORM/bizflow-backend/03-integrations/N8N/production-config.json`

```bash
sed -i '' 's/nexus.taurusai.io/nexus.taurusai.io/g' 01-CORE-PLATFORM/bizflow-backend/03-integrations/N8N/production-config.json
# Don't change section labels like "nexus" for API keys - those are internal identifiers
```

---

## WAVE 5: Bulk Markdown Docs

### Task W5-1: Replace all Nexus references in docs

**CRITICAL:** Execute AFTER directory renames complete.

```bash
cd /Users/taurus_ai/Documents/BizFlow-Nexus-Platform

# Replace in all markdown files
find . -name "*.md" -exec grep -l "Nexus\|nexus\|Nexus\|nexus-studio" {} \; 2>/dev/null | while read f; do
  sed -i '' 's/Nexus/Nexus/g' "$f"
  sed -i '' 's/nexus/nexus/g' "$f"
  sed -i '' 's/Nexus/Nexus/g' "$f"
  sed -i '' 's/nexus-studio/nexus-studio/g' "$f"
done
```

---

## WAVE 6: Memory/Agent/Skill Files

### Task W6-1: Update project memory files

**Files in:** `/Users/taurus_ai/.claude/projects/-Users-taurus-ai-Documents-BizFlow-Nexus-Platform/memory/`

```bash
cd /Users/taurus_ai/.claude/projects/-Users-taurus-ai-Documents-BizFlow-Nexus-Platform/memory
for f in *.md; do
  sed -i '' 's/Nexus/Nexus/g' "$f"
  sed -i '' 's/nexus/nexus/g' "$f"
  sed -i '' 's/Nexus/Nexus/g' "$f"
done
```

---

### Task W6-2: Update agent configs

**Files:**
- `/Users/taurus_ai/.claude/agents/nexus-freelance.md` (already renamed)
- `/Users/taurus_ai/.claude/agents/proposal-generator.md`
- `/Users/taurus_ai/.claude/agents/web-architect.md`

```bash
sed -i '' 's/Nexus/Nexus/g' /Users/taurus_ai/.claude/agents/proposal-generator.md
sed -i '' 's/nexus/nexus/g' /Users/taurus_ai/.claude/agents/proposal-generator.md
sed -i '' 's/Nexus/Nexus/g' /Users/taurus_ai/.claude/agents/web-architect.md
sed -i '' 's/nexus/nexus/g' /Users/taurus_ai/.claude/agents/web-architect.md
```

---

### Task W6-3: Update skill configs

**Files:**
- `/Users/taurus_ai/.claude/skills/nexus-design-system/skill.md` → rename to `nexus-design-system/skill.md`
- `/Users/taurus_ai/.claude/skills/cinematic-video/skill.md`

```bash
# Rename nexus-design-system directory
mv /Users/taurus_ai/.claude/skills/nexus-design-system /Users/taurus_ai/.claude/skills/nexus-design-system

# Update content
sed -i '' 's/Nexus/Nexus/g' /Users/taurus_ai/.claude/skills/nexus-design-system/skill.md
sed -i '' 's/nexus/nexus/g' /Users/taurus_ai/.claude/skills/nexus-design-system/skill.md

# Update cinematic-video
sed -i '' 's/Nexus/Nexus/g' /Users/taurus_ai/.claude/skills/cinematic-video/skill.md
sed -i '' 's/nexus/nexus/g' /Users/taurus_ai/.claude/skills/cinematic-video/skill.md
```

---

## WAVE 7: Manual External Updates (Required After Automated Updates)

### Task W7-1: Vercel Dashboard - Rename projects

**Required manual actions:**
1. Go to https://vercel.com/dashboard
2. Rename `nexus-studio` → `nexus-studio`
3. Rename `nexus` → `nexus` (in taurus-nexus-creative/nexus)
4. Rename `social-suite-dashboard` → `nexus-dashboard`

### Task W7-2: GitHub - Rename repos if needed

**Check these repos for nexus in name:**
- `taurus-nexus-creative` → `taurus-nexus-creative`
- Any other repos with nexus in name

```bash
# Example rename
gh api repos/Taurus-Ai-Corp/taurus-nexus-creative --method PATCH --field name=taurus-nexus-creative
```

### Task W7-3: Domain DNS updates

**If you control DNS for:**
- `nexus.taurusai.io` → update to point to `nexus.taurusai.io`
- Create CNAME record for `nexus.taurusai.io`

### Task W7-4: HEDERA workspace updates

**After all changes, update HEDERA references:**
- `/Users/taurus_ai/Documents/HEDERA/CONTEXT_RECALL.md` - update any remaining nexus references
- `/Users/taurus_ai/Documents/HEDERA/CLAUDE.md` - check for nexus references

---

## DEPENDENCY ORDER FOR EXECUTION

```
WAVE 1 (Directory Renames) →
  WAVE 2 (Package.json + Configs) →
    WAVE 3 (Code Files) + WAVE 4 (Env + Docker) → parallel
      WAVE 5 (Bulk Docs) →
        WAVE 6 (Memory + Agents) →
          WAVE 7 (Manual External)
```

---

## VERIFICATION CHECKLIST

After each wave, verify:

- [ ] Directory names changed
- [ ] package.json names updated
- [ ] Imports resolved (no broken paths)
- [ ] Vercel configs updated
- [ ] Docker compose updated
- [ ] Env files updated
- [ ] Docs updated (grep for nexus returns 0)
- [ ] Memory/Agents updated
- [ ] External services (manual steps complete)

---

## ESTIMATED BREAKAGE RISK

| Wave | Risk | Mitigation |
|------|------|-----------|
| W1 | HIGH | Directory rename is single atomic operation |
| W2 | HIGH | Backup package.json before sed |
| W3 | MEDIUM | Type changes are localized |
| W4 | MEDIUM | Env vars have fallbacks |
| W5 | LOW | Bulk sed, verify after |
| W6 | LOW | Only text replacements |
| W7 | MANUAL | Requires dashboard access |

---

**End of Master Plan**