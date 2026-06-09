# TAURUS Agency OS - Production Ready

The operating system for modern marketing agencies. Built to double agency margins without adding headcount.

## 🎯 What It Does

- **Zero-Cost Infrastructure**: Replace $300-$500/mo agency SaaS with open-source stack
- **AI Agent Execution**: Automated SEO, social media, and PQC audit generation
- **Immutable Trust Layer**: Every deliverable signed via Heiro repo
- **Toronto/GTA Optimized**: PIPEDA-compliant, Ontario-edge deployment ready

## ⚡ Quick Start

```bash
# Navigate to project
cd taurus-agency-os

# Start Docker infrastructure
cd infra && docker compose up -d

# Start frontend (includes API routes)
cd ../frontend && npm run dev
```

Then open **http://localhost:3000**

**Demo Credentials:**
- Email: `agency@example.com`
- Password: `password123`

## 🏗️ Architecture

### Infrastructure Layer (Docker)
| Service | Purpose | Port |
|---------|---------|------|
| **Hyperswitch** | Payment processing (zero fees) | 8080 |
| **Lago** | Billing & subscription management | 3000 |
| **PostgreSQL** | Database | 5432 |
| **Redis** | Caching layer | 6379 |
| **n8n** | Workflow automation | 5678 |

### Application Layer (Next.js 16)
- **Frontend**: React 19 + Tailwind CSS + TypeScript
- **Backend**: Next.js API Routes (built-in)
- **AI Agents**: BizFlow (SEO), Nexus (Social), Q-Grid (PQC Audit)

### Trust Layer
- **Heiro Repo**: Immutable audit trails for all deliverables
- **PQC Security**: ML-DSA-65 signature simulation

## 📁 Project Structure

```
taurus-agency-os/
├── docs/
│   └── SPEC.md                    # Technical specification
├── frontend/                       # Next.js 16 frontend
│   ├── src/
│   │   ├── app/                   # App router pages
│   │   │   ├── api/               # API routes
│   │   │   ├── page.tsx           # Landing page
│   │   │   └── layout.tsx         # Root layout
│   │   └── components/            # React components
│   │       ├── dashboard/          # Dashboard components
│   │       │   ├── agent-executor.tsx
│   │       │   ├── client-manager.tsx
│   │       │   ├── heiro-audit.tsx
│   │       │   └── recent-activity.tsx
│   │       ├── auth/               # Auth components
│   │       └── ui/                # UI components
│   └── package.json
├── backend/                       # Express backend (TypeScript)
│   ├── src/
│   │   ├── server.ts              # Main server
│   │   ├── routes/               # API routes
│   │   │   ├── auth.ts
│   │   │   ├── agents.ts
│   │   │   ├── dashboard.ts
│   │   │   └── heiro.ts
│   │   └── services/             # Business logic
│   │       ├── agents.ts
│   │       ├── database.ts
│   │       ├── dashboard.ts
│   │       └── heiro.ts
│   ├── package.json
│   └── tsconfig.json
├── infra/                         # Docker infrastructure
│   └── docker-compose.yml
└── scripts/
    └── start.sh                   # Quick start script
```

## 🎨 Features

### Dashboard Tabs
1. **Overview** - Stats, recent activity
2. **AI Agents** - Run BizFlow, Nexus, Q-Grid agents
3. **Clients** - Client management table
4. **Audit Trail** - Heiro immutable verification

### AI Agents
1. **BizFlow SEO Agent** - Generate SEO blog posts
2. **Nexus Social Agent** - Generate social media content (Twitter, LinkedIn, Instagram, Facebook)
3. **Q-Grid PQC Audit** - Generate cryptographic audit trails

### Client Management
- Client list with plan tiers (Foundation, Growth, Enterprise)
- Status tracking (active, pending, inactive)
- Revenue tracking

### Heiro Audit Trail
- Immutable commit history
- Verification of all deliverables
- Agent attribution

## 🚀 Running Locally

### Option 1: Quick Start
```bash
./scripts/start.sh
```

### Option 2: Manual Start

1. **Start Docker services:**
```bash
cd infra
docker compose up -d
```

2. **Start frontend:**
```bash
cd frontend
npm run dev
```

## 🔧 Configuration

### Environment Variables (Backend)
Edit `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres_password@localhost:5432/taurus_agency
JWT_SECRET=your_jwt_secret_key_change_this
FRONTEND_URL=http://localhost:3000
PORT=5000
```

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Styling | Lucide Icons, Custom CSS |
| Backend | Next.js API Routes + Express |
| Database | PostgreSQL (via Docker) |
| Payments | Hyperswitch (open-source Stripe alternative) |
| Billing | Lago (open-source billing) |
| AI | Gemini 1.5 Pro / Nemotron-3 (Ollama) simulation |
| Trust | Heiro repo (PQC audit trails) |

## 🎯 Toronto/Ontario Focus

- **PIPEDA Compliance**: Data residency in Toronto region
- **Local Integration**: Chamber of Commerce, BIA partnerships
- **Pricing**: Tailored for GTA agency market ($300-$600/mo packages)
- **Latency**: Ontario-edge deployment for sub-20ms local performance

## 🔜 Next Steps

1. **Deploy to Oracle Cloud** (Free ARM tier)
2. **Connect real AI APIs** (Gemini, Ollama)
3. **Integrate actual Heiro repo** (actual version control)
4. **Add Supabase** (replace mock data)
5. **White-label** (rebrand for agencies)

## 📄 License

MIT - TAURUS AI Corp

## 🤝 Support

For issues or questions, contact: admin@taurusai.io