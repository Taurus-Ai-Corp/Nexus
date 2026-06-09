---
name: deploy-nexus
description: |
  Deploy the Nexus (NeoSync) platform to Vercel and verify all 7 Docker services,
  AI routing tiers, and health endpoints. Use when deploying the social-suite-dashboard
  or checking platform readiness.

  Triggers: "/deploy-nexus", "deploy nexus", "deploy neosync", "deploy social suite",
  "check deployment health", "verify deployment"
disable-model-invocation: true
---

# Deploy Nexus — Full Deploy + Health Verification

Deploys the Nexus social-suite-dashboard to Vercel (API + web) and verifies all 7 Docker services and 3 AI routing tiers.

## Pre-Deploy Checks

Before deploying, run these checks:

1. **Environment validation** — Verify `.env` has all required keys:
   ```bash
   cd "Nexus _ Platform Devops"
   # Check for placeholder values that must be replaced
   grep -E '(your_|change_me|_HERE)' .env && echo "BLOCKED: Replace placeholder values in .env" && exit 1
   ```

2. **Docker stack health** — Verify all services are running:
   ```bash
   docker compose ps --format "table {{.Name}}\t{{.Status}}"
   ```
   Expected: 7 services (postgres, qdrant, valkey, meilisearch, hf-mcp, api, web) all `Up`.

3. **Database connectivity**:
   ```bash
   curl -s http://localhost:8000/health | python3 -m json.tool
   ```

## Deploy Steps

### Step 1: Deploy API to Vercel
```bash
cd "Nexus _ Platform Devops/social-suite-dashboard/api"
vercel deploy --prod --yes --scope taurus-s-projects
```
Capture the API URL from output.

### Step 2: Update Frontend Environment
```bash
cd "Nexus _ Platform Devops/social-suite-dashboard/web"
echo "VITE_API_URL=<API_URL_FROM_STEP_1>" > .env
```

### Step 3: Deploy Frontend to Vercel
```bash
cd "Nexus _ Platform Devops/social-suite-dashboard/web"
vercel deploy --prod --yes --scope taurus-s-projects
```
Capture the web URL from output.

## Post-Deploy Verification

### Health Check Matrix

Run each check and report pass/fail:

| Service | Endpoint | Expected |
|---------|----------|----------|
| API Health | `GET /health` | `{"status": "healthy"}` |
| PostgreSQL | Port 5432 | `pg_isready` |
| Qdrant | Port 6333 | `{"status": "ok"}` |
| Valkey | Port 6379 | `PONG` |
| Meilisearch | Port 7700/health | `{"status": "available"}` |
| HF MCP | Port 8002 | HTTP 200 |
| Grafana | Port 3001 | Login page |
| Prometheus | Port 9090 | UI reachable |

### AI Routing Tier Check

```bash
# Test each AI tier
curl -s http://localhost:8000/api/nlp -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"command": "schedule post for tomorrow at 9am"}'
```

Verify response includes which tier handled the request.

### Frontend Smoke Test

```bash
# Check frontend loads
curl -sI $WEB_URL | head -5
# Check API connectivity from frontend
curl -s $WEB_URL | grep -o 'VITE_API_URL'
```

## Rollback

If any step fails:

1. **API rollback**: `vercel rollback <deployment-url>`
2. **Frontend rollback**: `vercel rollback <deployment-url>`
3. **Docker rollback**: `docker compose down && docker compose up -d`

## Output Format

After completion, report:
- API URL
- Web URL
- Health check results (pass/fail for each service)
- AI routing tier status
- Any warnings or issues