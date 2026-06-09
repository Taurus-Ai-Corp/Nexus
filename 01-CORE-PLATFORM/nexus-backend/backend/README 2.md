# 🌊 TAURUS AI CORP - BizFlow™ Backend

> **AI-Powered Business Intelligence Automation Platform**

## 🎯 Overview

The BizFlow™ backend is the core engine of the TAURUS AI CORP ecosystem, providing:

- **Agentic Intelligence Dashboard** - Central command center
- **Multi-Agent Deployment Interface** - Automated business process agents  
- **Campaign Management System** - Intelligent marketing automation
- **Lead Intelligence Pipeline** - AI-powered lead scoring and nurturing
- **Integration Hub** - Connect external tools and platforms
- **Real-Time Analytics** - Performance monitoring and optimization

## 🏗️ Architecture

### Core Components

```
BizFlow™ Backend
├── FastAPI Application Server (Port 8000)
├── PostgreSQL Database (Multi-tenant)  
├── Redis Cache & Session Store
├── 6 Specialized AI Agents (Ports 8001-8006)
├── WebSocket Real-time Updates
└── RESTful API with JWT Authentication
```

### Specialized Agents

1. **Intelligence Research Agent** (8001) - Competitor analysis & market research
2. **Webflow Integration Master** (8002) - Deep Webflow API integration  
3. **Custom Component Performance** (8003) - Performance monitoring & optimization
4. **Performance Analysis Agent** (8004) - Component choice analysis & recommendations
5. **Content Social Strategy** (8005) - Content creation & social media automation
6. **Real-time Intelligence Dashboard** (8006) - Competitive monitoring & alerts

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- 8GB+ RAM recommended

### 1. One-Command Startup

```bash
# Start the entire platform
python startup.py
```

This will:
- ✅ Check requirements and install if needed
- 🐳 Start PostgreSQL & Redis via Docker
- 🤖 Launch all 6 specialized agents
- 🌟 Start the main FastAPI backend
- 📊 Display access information

### 2. Manual Setup (Alternative)

```bash
# Install dependencies  
pip install -r requirements.txt

# Start infrastructure
docker-compose up -d postgres redis

# Start backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Access the Platform

- **Main API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs  
- **Health Check**: http://localhost:8000/api/health
- **Redis UI**: http://localhost:8081 (taurus/taurus_redis_ui_2024)

## 📊 Core Platform Features

### Agentic Intelligence Dashboard

```bash
curl -H "Authorization: Bearer YOUR_JWT" \
     http://localhost:8000/api/platform/dashboard
```

**Returns:**
- Active agent status & health
- Running task monitoring  
- Recent results & metrics
- System performance data
- Real-time alerts

### Multi-Agent Deployment

```bash
curl -X POST http://localhost:8000/api/platform/agents/deploy \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "intelligence_research",
    "config": {"max_concurrent_tasks": 5},
    "auto_start": true,
    "priority": 8
  }'
```

**Features:**
- Dynamic agent deployment
- Configuration management
- Health monitoring
- Load balancing
- Auto-scaling capabilities

### Campaign Management System

```bash
curl -X POST http://localhost:8000/api/platform/campaigns \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q1 Growth Campaign",
    "business_vertical": "saas",
    "target_metrics": {"conversion_rate": 15, "cac": 50},
    "automation_config": {"ab_testing": true, "bid_optimization": true}
  }'
```

**Capabilities:**
- AI-powered audience targeting
- Real-time bid optimization  
- Automated A/B testing
- Performance monitoring
- Budget management

### Lead Intelligence Pipeline

```bash
curl -X POST http://localhost:8000/api/platform/leads/intelligence \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "leads_data": [
      {"email": "prospect@company.com", "company": "TechCorp", "title": "CEO"}
    ],
    "scoring_criteria": {"title_weight": 0.3, "company_size_weight": 0.4},
    "nurturing_config": {"sequence": "high_value_prospect"}
  }'
```

**AI Features:**
- Intelligent lead scoring
- Behavioral analysis
- Intent prediction  
- Automated nurturing sequences
- Real-time notifications

### Integration Hub

```bash
curl -X POST http://localhost:8000/api/platform/integrations \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "salesforce",
    "credentials": {"api_key": "xxx", "secret": "xxx"},
    "sync_config": {"bidirectional": true, "real_time": true}
  }'
```

**Supported Platforms:**
- Salesforce, HubSpot, Pipedrive (CRM)
- Mailchimp, Klaviyo, SendGrid (Email)
- Shopify, WooCommerce (E-commerce)
- Webflow, WordPress (Web platforms)
- Google Analytics, Facebook Ads (Analytics)

## 🗄️ Database Architecture

### PostgreSQL Schema

```sql
-- Multi-tenant architecture with tenant_id isolation
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    tenant_id UUID NOT NULL,
    -- ... other fields
);

CREATE TABLE campaigns (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    business_vertical VARCHAR NOT NULL,
    -- ... campaign data
);

-- Performance metrics time-series
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY,
    metric_name VARCHAR NOT NULL,
    value FLOAT NOT NULL,
    recorded_at TIMESTAMP NOT NULL,
    -- ... other fields
);
```

### Redis Caching Strategy

```python
# Cache patterns for optimal performance
user_cache = "user:{user_id}"           # TTL: 24h
agent_status = "agent:status:{name}"    # TTL: 1h  
task_results = "task:{task_id}"         # TTL: 24h
campaign_metrics = "campaign:metrics:{id}"  # TTL: 1h
intelligence_data = "intelligence:{competitor}" # TTL: 1h
```

## 🤖 Agent Management

### Agent Health Monitoring

```python
# Each agent reports health every 5 minutes
{
    "agent_name": "intelligence_research",
    "status": "healthy",
    "last_check": "2024-01-15T10:30:00Z",
    "performance_metrics": {
        "tasks_processed": 1247,
        "average_response_time": 1.2,
        "success_rate": 98.5,
        "memory_usage": 156.7
    }
}
```

### Task Queue Management

```python
# Priority-based task queuing
task_queue = {
    "priority_1": ["urgent_competitor_alert"],
    "priority_5": ["daily_content_generation"], 
    "priority_10": ["weekly_performance_report"]
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/taurus
REDIS_URL=redis://localhost:6379

# Security  
SECRET_KEY=change_in_production_2024
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# Agents
AGENT_MAX_CONCURRENT_TASKS=10
AGENT_TASK_TIMEOUT=3600
AGENT_HEALTH_CHECK_INTERVAL=300

# External APIs
OPENAI_API_KEY=your_key_here
WEBFLOW_API_KEY=your_key_here
```

### Docker Compose Profiles

```bash
# Development with UI tools
docker-compose --profile development up -d

# Production deployment  
docker-compose --profile production up -d

# Full monitoring stack
docker-compose --profile development --profile monitoring up -d
```

## 📈 Performance & Monitoring

### Health Checks

```bash
# System health
curl http://localhost:8000/api/health

# Agent health  
curl http://localhost:8000/api/agents

# Database performance
curl -H "Authorization: Bearer JWT" \
     http://localhost:8000/api/platform/metrics/realtime
```

### Real-time Metrics Stream

```javascript
// WebSocket connection for live updates
const ws = new WebSocket('ws://localhost:8000/ws/{user_id}');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Real-time update:', data);
};
```

## 🔒 Security

### Multi-Tenant Isolation

- Every request filtered by `tenant_id`
- JWT tokens include tenant context
- Database queries auto-scoped to tenant
- Redis keys namespaced by tenant

### API Authentication

```python
# JWT token required for all platform endpoints
headers = {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "Content-Type": "application/json"
}
```

### Rate Limiting

```python
# Per-user rate limits
rate_limits = {
    "requests_per_minute": 100,
    "requests_per_hour": 1000, 
    "api_calls_per_day": 10000
}
```

## 🚀 Production Deployment

### Docker Production

```bash
# Build production image
docker build --target production -t taurus-bizflow:latest .

# Deploy with production profile
docker-compose --profile production up -d

# Enable monitoring
docker-compose --profile production --profile monitoring up -d
```

### Environment Checklist

- [ ] Change default passwords in `docker-compose.yml`
- [ ] Update `SECRET_KEY` in environment variables  
- [ ] Configure SSL certificates for HTTPS
- [ ] Set up database backups (included in compose)
- [ ] Enable log aggregation (ELK stack available)
- [ ] Configure monitoring alerts (Prometheus/Grafana)

### Scaling Recommendations

```yaml
# Horizontal scaling
web_servers: 3-5 instances behind load balancer
database: Primary + 2 read replicas  
redis: Redis Cluster with 6 nodes
agents: Auto-scaling based on queue depth
```

## 🛠️ Development

### Local Development

```bash
# Hot reload development
uvicorn main:app --reload --log-level debug

# Run specific agent
python agents/specialized/intelligence-research/agent.py

# Database migrations (coming soon)
alembic upgrade head
```

### Testing

```bash
# Unit tests
pytest tests/

# Integration tests  
pytest tests/integration/

# Load testing
locust -f tests/load/test_api.py
```

### Code Quality

```bash
# Format code
black .
isort .

# Lint code  
flake8 .
mypy .

# Security scan
bandit -r .
```

## 📞 Support

### Troubleshooting

**Common Issues:**

1. **Port conflicts**: Ensure ports 8000-8006 are available
2. **Docker issues**: Restart Docker Desktop if containers won't start  
3. **Database connection**: Check PostgreSQL is running and accessible
4. **Agent failures**: Check agent logs in `/app/logs/` directory
5. **Memory issues**: Ensure 8GB+ RAM available for full stack

### Logs

```bash
# Backend logs
docker-compose logs bizflow-api

# Database logs  
docker-compose logs postgres

# Agent logs
tail -f logs/agent_intelligence_research.log
```

### Performance Tuning

```python
# Database connection pool tuning
POSTGRES_POOL_SIZE = 20
POSTGRES_MAX_OVERFLOW = 30

# Redis memory optimization  
REDIS_MAX_MEMORY = "512mb"
REDIS_EVICTION_POLICY = "allkeys-lru"

# Agent concurrency
AGENT_WORKER_THREADS = 4
AGENT_QUEUE_SIZE = 100
```

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] Core platform APIs
- [x] All 6 specialized agents  
- [x] Multi-tenant database
- [x] Redis caching layer
- [x] Docker infrastructure
- [x] JWT authentication

### Phase 2 (Next)
- [ ] Webflow deep integration
- [ ] Performance optimization layer
- [ ] Content automation workflows
- [ ] Real-time competitor alerts
- [ ] Advanced analytics dashboard

### Phase 3 (Future)
- [ ] Mobile app API
- [ ] Advanced ML models
- [ ] Multi-language support  
- [ ] Enterprise SSO
- [ ] Advanced reporting
- [ ] API marketplace

---

**🌊 Built with ❤️ by TAURUS AI CORP**

*Transforming businesses through agentic intelligence automation*