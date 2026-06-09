# Nexus Platform Security Remediation Plan

> Generated: 2026-05-21 | Based on OWASP Top 10 + Docker + AI-Routing + Frontend audit
> Overall Risk Score: **8.2/10 (HIGH)** → Target: **3.0/10 (MODERATE)** by Phase 2

## Status Legend
- ✅ = Fixed in this session
- 🔲 = Not yet started
- 🔄 = In progress

---

## Phase 1: CRITICAL (Immediate — Before Any Public Deployment)

| # | Finding | Severity | Status | File | Fix |
|---|---------|----------|--------|------|-----|
| 04 | JWT secret hardcoded as fallback | CRITICAL | ✅ | main.py:32 | Removed fallback; app refuses start if `JWT_SECRET` missing or weak |
| 05 | Database password hardcoded as fallback | CRITICAL | ✅ | database.py:13 | Removed fallback; app refuses start if `DATABASE_URL` missing |
| 12 | .env committed to git, no .gitignore | CRITICAL | ✅ | .env, .gitignore | Created `.gitignore`; replaced secrets with `CHANGE_ME` placeholders |
| 22 | Stripe error details leaked to client | CRITICAL | ✅ | main.py:680-682 | Specific exception types with generic messages; no `str(e)` to client |
| 26 | SSRF via unvalidated callback_url | CRITICAL | ✅ | main.py:872-876 | Added `_validate_callback_url()` — HTTPS-only, blocks private IPs, optional domain allowlist |
| 28 | Hardcoded/default Docker passwords | CRITICAL | ✅ | .env, docker-compose.yml | Replaced all defaults with `CHANGE_ME`; added security warning header |
| 01 | No RBAC; hardcoded seed users | CRITICAL | ✅ | main.py:208-211 | Removed hardcoded passwords; seed from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars only |

**Post-Phase 1 actions required:**
1. Rotate ALL secrets (generate new JWT_SECRET, POSTGRES_PASSWORD, MEILI_MASTER_KEY, GRAFANA_PASSWORD)
2. Run `git log --all --full-history -- ".env"` to check if `.env` was ever committed; if so, use `git filter-branch` to purge
3. Generate strong secrets: `python3 -c "import secrets; print(secrets.token_urlsafe(48))"`

---

## Phase 2: HIGH (Within 1 Week)

| # | Finding | Severity | Status | File | Fix |
|---|---------|----------|--------|------|-----|
| 02 | No tenant isolation on campaigns | HIGH | ✅ | main.py:443-465 | Added `_verify_owner()` for tenant isolation; `list_campaigns` scopes to `user_id` |
| 03 | Access tokens passed via query params | HIGH | ✅ | main.py:795-805 | Moved `access_token` from query param to `X-Meta-Token` header; tokens stored server-side in `meta_sessions` table |
| 06 | Sensitive data in logs; TOTP secret returned | HIGH | ✅ | main.py:300,378,530,682,725,902,970,1006,1043 | Masked emails (→user_id), truncated webhook data, generic error type names only |
| 07 | SQL injection via dict keys | HIGH | ✅ | database.py:89-104 | Added `CAMPAIGN_UPDATEABLE_COLUMNS` and `AGENT_SESSION_UPDATEABLE_COLUMNS` allowlists |
| 08 | SQL injection via time_range | HIGH | ✅ | database.py:128 | Added `VALID_TIME_RANGES` allowlist; rejects invalid intervals |
| 10 | In-memory rate limiter; no account lockout | HIGH | ✅ | main.py:61-100 | Added `AccountLockout` class with exponential backoff (5 attempts → 15min lockout, doubling) |
| 13 | Hardcoded default users with weak passwords | HIGH | ✅ | main.py:208-211 | Removed hardcoded users; seed from env vars only |
| 16 | Outdated bcrypt (4.0.1); passlib unmaintained | HIGH | ✅ | requirements.txt | Upgraded `bcrypt>=4.1.0`; removed `passlib`; direct bcrypt usage |
| 19 | No account lockout; weak rate limiting | HIGH | ✅ | main.py:293-308 | Login endpoint checks `account_lockout.is_locked()`, records failures, shows remaining attempts |
| 23 | Meta access token sent to browser | HIGH | ✅ | main.py:743-790 | Tokens stored server-side in `meta_sessions` table; frontend receives only `meta_session_id` |
| 25 | Sensitive data logged | HIGH | ✅ | main.py:300,312,530,682,725,902,970,1006,1043 | Masked emails (→user_id), truncated webhook data, generic error type names only |
| 29 | All service ports exposed to host | HIGH | ✅ | docker-compose.yml | Removed host ports for postgres, valkey, meilisearch, hf-mcp; only 8000, 3000, 3001, 9090, 6333 exposed |
| 30 | Service images use `:latest` tags | HIGH | ✅ | docker-compose.yml | Pinned all images: `pgvector:pg16`, `qdrant:v1.13.4`, `valkey:7.2-alpine`, `meilisearch:v1.12.8`, `hf-mcp:0.6.2`, `grafana:11.4.0`, `prometheus:v2.55.1` |
| 34 | Prompt injection via orchestration endpoint | HIGH | ✅ | main.py:614-625 | Added `OrchestrateRequest` Pydantic model with validation, length limit, allowlists |
| 38 | Hardcoded credentials in frontend | HIGH | ✅ | AuthContext.jsx | Removed `DEMO_USERS` dict and mock auth fallback; added `API_URL` required check; marked localStorage→httpOnly migration TODO |

---

## Phase 3: MEDIUM (Within 1 Month)

| # | Finding | Severity | Status | File | Fix |
|---|---------|----------|--------|------|-----|
| 09 | Prompt injection via task_description | MEDIUM | ✅ | main.py:614-625 | Truncated to 2000 chars; validated platform/agent_type/priority allowlists |
| 11 | Development CORS origins in production | MEDIUM | ✅ | .env, main.py | Default CORS set to production URL; ENV defaults to `production` |
| 14 | Weak predictable Docker passwords | MEDIUM | ✅ | .env | Replaced with `CHANGE_ME` placeholders |
| 15 | ENV defaults to "development" | MEDIUM | ✅ | main.py:36 | Changed default to `"production"` |
| 17 | python-multipart pin allows vulnerable version | MEDIUM | 🔲 | requirements.txt | Pin to `python-multipart>=0.0.18` |
| 18 | Outdated frontend dependencies | MEDIUM | 🔲 | package.json | Update axios, react, vite to latest stable |
| 20 | No refresh token rotation | MEDIUM | 🔲 | main.py:330-343 | Implement token rotation with blacklisting |
| 21 | JWT in localStorage; hardcoded frontend creds | MEDIUM | 🔲 | AuthContext.jsx | Migrate to httpOnly secure cookies |
| 24 | Unvalidated AI responses returned | MEDIUM | 🔲 | routing_engine.py | Add output sanitization; strip HTML; validate JSON schema |
| 31 | Bind mounts + --reload in production | MEDIUM | 🔲 | docker-compose.yml | Remove bind mounts; remove `--reload`; use multi-stage builds |
| 32 | No resource limits or security hardening | MEDIUM | 🔲 | docker-compose.yml | Add `deploy.resources.limits`, `read_only: true`, `cap_drop: ALL` |
| 35 | Raw AI output returned without sanitization | MEDIUM | 🔲 | routing_engine.py | Strip HTML, validate response schema |
| 36 | No rate limiting on AI endpoints | MEDIUM | 🔲 | main.py | Add per-user token/day limits; enforce `max_tokens` server-side |
| 39 | CSP header blocks frontend functionality | MEDIUM | ✅ | main.py:238 | Changed from `default-src 'none'` to permissive CSP allowing self + external APIs |
| 40 | Unvalidated price_id in Stripe checkout | MEDIUM | 🔲 | main.py:660-682 | Validate price_id against allowlist of valid product IDs |

---

## Phase 4: LOW (Backlog)

| # | Finding | Severity | Status | File | Fix |
|---|---------|----------|--------|------|-----|
| 27 | External AI URLs from env without validation | LOW | 🔲 | routing_engine.py | Pin OLLAMA_BASE_URL to expected hosts; add model allowlist |
| 33 | Single flat Docker network | LOW | 🔲 | docker-compose.yml | Create `backend-net`, `monitoring-net`, `ai-net` for isolation |
| 37 | Inaccurate AI cost estimation | LOW | 🔲 | routing_engine.py | Use tiktoken for accurate token counting; dynamic pricing |

---

## Quick Reference: Generate Secrets

```bash
# Generate all required secrets at once
python3 -c "
import secrets
print('JWT_SECRET=' + secrets.token_urlsafe(48))
print('POSTGRES_PASSWORD=' + secrets.token_urlsafe(32))
print('MEILI_MASTER_KEY=' + secrets.token_urlsafe(32))
print('GRAFANA_PASSWORD=' + secrets.token_urlsafe(16))
print('ADMIN_PASSWORD=' + secrets.token_urlsafe(16))
"
```

## Quick Reference: Remove .env from Git History

```bash
# If .env was ever committed, purge it from history
cd "Nexus _ Platform Devops"
git rm --cached .env
git commit -m "security: remove .env from git tracking"
# For full history purge (DESTRUCTIVE — coordinate with team):
# git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty -- --all
```

## Verification Checklist

After completing all phases, run:
```bash
# 1. Verify app refuses to start with weak JWT
JWT_SECRET=changeme python3 -c "from api.main import app" 2>&1 | grep FATAL

# 2. Verify .gitignore covers .env
git check-ignore .env  # Should output ".env"

# 3. Verify no secrets in git history
git log --all --full-history -- ".env"  # Should return empty

# 4. Run the Docker compose validator agent
# (invoke via: /docker-compose-validator)

# 5. Run the security auditor agent
# (invoke via: /security-auditor)
```