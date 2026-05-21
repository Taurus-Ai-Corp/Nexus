# NeoVibe Micro-Loan AI Agent Platform

## Overview
AI-powered micro-loan repayment optimization platform for NBFCs/MFIs in India. This platform provides white-label AI agent infrastructure that enables financial institutions to deploy sophisticated cash-flow analysis, personalized reminders, and dynamic pricing experiments.

## Architecture

```
platform-dev/
├── core/
│   ├── analysis/           # Cash-flow pattern analysis
│   │   └── cash_flow_analyzer.py
│   ├── reminders/          # SMS/WhatsApp reminder engine
│   │   └── reminder_engine.py
│   ├── integration/        # Data integration layer
│   │   └── data_layer.py
│   ├── dashboard/          # Web dashboard
│   │   └── index.html
│   └── api/                # REST API (to be implemented)
├── data/                   # Generated sample data
├── venv/                   # Python virtual environment
├── docker-compose.yml      # Docker composition
├── Dockerfile.agent        # AI agent service
├── Dockerfile.dashboard    # Dashboard service
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

## Features

### Phase 1: Core Agent Engine ✅
- **Cash-Flow Analysis**: Segment borrowers (trader/hotelier/grocer) and analyze repayment patterns
- **Reminder Engine**: Generate personalized SMS/WhatsApp reminders in multiple languages (English, Hindi)
- **Data Integration**: CSV import/export with validation and portfolio summary
- **Web Dashboard**: Real-time portfolio overview and AI reminder preview
- **Docker Deployment**: Easy deployment with docker-compose

### Phase 2: Payments & Compliance ✅
- **DPDP Act 2023 Compliance**: Consent management, data principal rights, breach notification (72-hour SLA)
- **Aadhaar eKYC Integration**: Tokenization (never store raw Aadhaar), UIDAI authentication flow, virtual IDs
- **UPI 2.0 Integration**: Collect Request, AutoPay mandates for EMI scheduling, Credit Line, UPI Lite
- **AWS Mumbai (ap-south-1)**: Data localization compliance, continuous verification scripts
- **Settlement & Audit Trail**: Immutable transaction records with UTR tracking

### Phase 3: AI Enhancement (Planned)
- Gymnasium RL environment for dynamic pricing experiments
- AI MCP payoff tools (repayment prediction, early warning)
- State machine monitoring for agent reliability

## Quick Start

### Local Development

1. **Setup virtual environment:**
```bash
cd platform-dev
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Generate sample data:**
```bash
python core/integration/data_layer.py
```

3. **Test cash flow analyzer:**
```bash
python test_cash_flow.py
```

4. **Test reminder engine:**
```bash
python core/reminders/reminder_engine.py
```

5. **Open dashboard:**
```bash
open core/dashboard/index.html
```

### Docker Deployment

```bash
docker-compose up -d
```

This will start:
- AI Agent API on port 8000
- Web Dashboard on port 3000
- PostgreSQL database on port 5432
- Redis cache on port 6379

## API Endpoints (Planned)

- `GET /api/portfolio` - Get portfolio summary
- `GET /api/borrowers` - List all borrowers
- `POST /api/borrowers/{id}/analyze` - Analyze borrower cash flow
- `POST /api/reminders/generate` - Generate reminders
- `POST /api/reminders/send` - Send reminders
- `GET /api/pricing/experiments` - List pricing experiments
- `POST /api/pricing/optimize` - Run pricing optimization

## Compliance

### RBI Data Localization
- All data stored in AWS Mumbai (ap-south-1)
- PostgreSQL database configured for India region
- Audit trails maintained for 7 years

### DPDP Act 2023
- Consent management system (planned)
- Data minimization principles applied
- Right to access/correction/erasure endpoints (planned)

### Aadhaar eKYC
- Tokenization implemented (never store raw Aadhaar)
- UIDAI API integration (planned)
- ASA license required for production

## Testing

```bash
# Run all tests
pytest

# Run specific test
pytest test_cash_flow.py -v
```

## Development Roadmap

| Phase | Timeline | Status |
|-------|----------|--------|
| Phase 1: Core Agent Engine | Week 1-2 | ✅ Complete |
| Phase 2: Payments & Compliance | Week 3-4 | ✅ Complete |
| Phase 3: AI Enhancement | Week 5-6 | 📋 Planned |
| Phase 4: Pilot Deployment | Week 7-8 | 📋 Planned |

## License

Proprietary - NeoVibe by Taurus AI (License #68122, IFZA Dubai)

## Contact

For questions or support, contact the NeoVibe development team.