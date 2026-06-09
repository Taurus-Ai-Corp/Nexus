# BIZFLOW INTEGRATION - QUICK REFERENCE CARD

## File Locations

```
/Users/user/Documents/TAURUS-LOCAL-WORKSPACE/
├── BIZFLOW_INTEGRATION_COMPLETE.md    # Full deployment guide (51KB)
├── bizflow_integration_validator.py   # Validation suite (29KB)
├── bizflow_webhook_config.json        # Webhook config (19KB)
├── BIZFLOW_INTEGRATION_SUMMARY.md     # Executive summary (16KB)
└── BIZFLOW_QUICK_REFERENCE.md         # This file
```

## Quick Commands

### Deployment
```bash
# Full deployment
bash /Users/user/Documents/TAURUS-LOCAL-WORKSPACE/deploy_bizflow_production.sh

# Database setup
psql -U taurus_admin -d taurus_production -f database_schema.sql

# Start API server
gunicorn api_server:app --bind 0.0.0.0:8000 --workers 4 --daemon

# Start n8n
docker run -d --name bizflow-n8n -p 5678:5678 \
  --env-file .env.bizflow n8nio/n8n

# Start agent monitor
python3 mcp_agent_manager.py &
```

### Validation
```bash
# Run all tests
python3 bizflow_integration_validator.py

# Check specific components
curl http://localhost:8000/health                    # API
psql -U taurus_admin -d taurus_production -c "SELECT 1"  # DB
curl http://localhost:5678/healthz                   # n8n
redis-cli ping                                       # Redis
```

### Monitoring
```bash
# View logs
tail -f /var/log/bizflow/*.log

# Check agent status
psql -U taurus_admin -d taurus_production -c \
  "SELECT agent_name, status, health_status FROM bizflow.mcp_agents"

# View metrics
curl http://localhost:9090/metrics  # Prometheus
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | API health check |
| `/api/bizflow/workflows` | GET/POST | Manage workflows |
| `/api/bizflow/workflows/{id}` | GET/PUT/DELETE | Workflow operations |
| `/api/bizflow/executions` | GET/POST | Manage executions |
| `/api/bizflow/analytics/overview` | GET | System analytics |

## Webhook Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/webhook/bizflow-exec-sync` | Execution sync |
| `/webhook/agent-health-update` | Agent health |
| `/webhook/workflow-schedule-trigger` | Schedule trigger |
| `/webhook/external-integration` | External systems |

## Environment Variables

```bash
# API
BIZFLOW_API_URL=https://bizflow.taurusai.io
BIZFLOW_JWT_SECRET=<generated>

# Database
BIZFLOW_DATABASE_URL=postgresql://taurus_admin:pass@localhost:5432/taurus_production

# Redis
BIZFLOW_REDIS_URL=redis://localhost:6379/0

# n8n
N8N_HOST=n8n.taurusai.io
N8N_PORT=5678
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<generated>

# Webhooks
BIZFLOW_WEBHOOK_SECRET=<generated>

# Monitoring
ELASTICSEARCH_HOST=localhost:9200
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
```

## Troubleshooting

### API won't start
```bash
lsof -i :8000
pkill -f "gunicorn api_server"
tail -f /var/log/bizflow/error.log
```

### Database connection failed
```bash
psql -U taurus_admin -d taurus_production -c "SELECT 1"
systemctl restart postgresql
```

### Workflow not executing
```bash
docker logs bizflow-n8n
curl -u admin:password http://localhost:5678/api/v1/workflows
```

### Agent unhealthy
```bash
psql -U taurus_admin -d taurus_production -c \
  "SELECT * FROM bizflow.mcp_agents WHERE health_status != 'healthy'"
python3 mcp_agent_manager.py --restart-all
```

## Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time | < 100ms (P95) |
| Database Query | < 50ms (avg) |
| Workflow Execution | > 96% success |
| Agent Availability | > 99% |
| System Uptime | 99.9% |

## Alert Thresholds

| Alert | Threshold | Action |
|-------|-----------|--------|
| Execution failure rate | > 10% | Investigate workflows |
| Agent down | > 2 min | Auto-restart |
| API slow | P95 > 1s | Scale workers |
| DB pool exhausted | > 90% | Increase pool |

## Support

- **Documentation**: BIZFLOW_INTEGRATION_COMPLETE.md
- **Email**: devops@taurusai.io
- **Slack**: #bizflow-support
- **On-call**: PagerDuty

## Quick Reference

```bash
# Status check
curl https://bizflow.taurusai.io/health

# View workflows
curl -H "Authorization: Bearer $TOKEN" \
  https://bizflow.taurusai.io/api/bizflow/workflows

# Execute workflow
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"workflow_id":"wf_001","priority":"high"}' \
  https://bizflow.taurusai.io/api/bizflow/executions

# Check analytics
curl -H "Authorization: Bearer $TOKEN" \
  https://bizflow.taurusai.io/api/bizflow/analytics/overview
```

---

**Status**: PRODUCTION READY  
**Version**: 1.0.0  
**Last Updated**: 2025-11-30
