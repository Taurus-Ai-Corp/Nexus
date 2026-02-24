# BizFlow-NeoVibe Platform

AI-powered marketing automation and creative design ecosystem by **TAURUS AI CORP**.

## Overview

| Platform | Domain | Purpose |
|----------|--------|---------|
| **BizFlow** | bizflow.taurusai.io | Agentic Intelligence Automation |
| **NeoVibe** | neovibe.taurusai.io | Creative Design Studio |

**Revenue Target**: $1.7M Year 1

## Quick Start

```bash
# Clone and setup
cd /Users/user/Documents/BizFlow-NeoVibe-Platform

# Install dependencies
npm install
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development stack
docker-compose up -d

# Run backend
npm run dev:backend

# Run frontend (separate terminal)
npm run dev:frontend
```

## Directory Structure

```
BizFlow-NeoVibe-Platform/
├── 01-CORE-PLATFORM/      # BizFlow backend + NeoVibe studio
├── 02-AGENTS/             # AI orchestrators + MCP integrations
├── 03-CLIENT-MANAGEMENT/  # Custom CRM + HubSpot sync
├── 04-PRODUCT-DEPLOYMENT/ # Docker, K8s, CI/CD
├── 05-DATABASES/          # Supabase + PlanetScale + MongoDB
├── 06-WORKFLOWS/          # N8N + campaign automation
├── 07-API-ROUTES/         # REST APIs + webhooks
├── 08-DOCUMENTATION/      # Technical + user guides
├── 09-ASSETS/             # Design tokens + marketing
└── 10-CONFIG/             # Environment + MCP configs
```

## Technology Stack

- **Backend**: FastAPI (Python 3.12+)
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Databases**: Supabase (PostgreSQL) + PlanetScale (MySQL) + MongoDB Atlas
- **CRM**: Custom + HubSpot sync
- **AI Agents**: Agentuity + Custom orchestrators
- **Automation**: N8N workflows

## Agent Ecosystem

| Agent | Capabilities | Revenue Impact |
|-------|--------------|----------------|
| Cultural Intelligence | Market analysis, cultural adaptation | 40% |
| Content Creation | 50 assets/hour, brand consistency | 60% |
| Campaign Optimization | Real-time A/B testing, 574% ROI | 70% |
| Lead Generation | Lead scoring, nurturing | $750K Q4 |
| Client Communication | Automated reporting | Retention |

## Key Commands

```bash
# Development
npm run dev                    # Start all services
npm run dev:backend           # FastAPI only
npm run dev:frontend          # Next.js only

# Docker
npm run docker:up             # Start containers
npm run docker:down           # Stop containers
npm run docker:logs           # View logs

# Database
npm run db:migrate            # Run migrations
npm run db:reset              # Reset database

# Orchestrator
npm run orchestrator:start    # Start agent orchestrator

# Workflows
npm run n8n:export           # Export N8N workflows
npm run n8n:import           # Import N8N workflows
```

## Development Status

- **Phase 1**: 60% Complete (Core Platform)
- **Phase 2**: Pending (Webflow Integration)
- **Phase 3**: Pending (Content Scaling)
- **Phase 4**: Pending (Landing Page Optimization)

## Performance Targets

| Metric | Target | Industry Avg |
|--------|--------|--------------|
| Engagement Rate | 8.7% | 3.2% |
| Cost Per Lead | $59 | $127 |
| Conversion Rate | 23% | 8% |
| ROI | 574% | 200% |

## Documentation

- [Gemini 3 Continuation Prompt](./GEMINI_CONTINUATION_PROMPT.md)
- [Technical Documentation](./08-DOCUMENTATION/technical/)
- [API Documentation](./08-DOCUMENTATION/api-docs/)

## License

Proprietary - TAURUS AI CORP

---

*Platform Version: 1.0.0*
*Last Updated: December 2025*
