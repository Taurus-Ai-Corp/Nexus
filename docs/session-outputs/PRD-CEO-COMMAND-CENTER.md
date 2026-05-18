# PRD: Quantum-Secure CEO Command Center

**Date:** April 1, 2026  
**Platform:** TAURUS AI Corp (Canada Federal)  
**Status:** Phase 1 Complete — Backend Running via PM2

---

## 1. Executive Summary

A quantum-secure command platform that allows the CEO to control company operations through Telegram and a web dashboard. The system uses brain focus scores (GCR) to determine how much autonomy AI agents have, with post-quantum cryptography signing all governance decisions.

---

## 2. Corporate Structure

```
TAURUS AI CORP (Canada Federal) — Parent Company / HQ
    │   Corporation #: 1702855-5
    │   Ontario OCN: 1001270625
    │
    ├── TAURUS AI Corp - FZCO (Dubai) — Operating Entity
    │       License #68122, IFZA Dubai
    │       │
    │       ├── NeoVibe Platform (Luxury Design)
    │       └── BizFlow Platform (Business Automation)
    │
    └── ARQ QUANTUM LLC (Wyoming, USA) — Operating Entity
            WY SOS ID: 2026-001887149
            │
            └── Q-Grid Platform (PQC Services)
```

---

## 3. What Was Built (This Session)

### 3.1 Backend Server (RUNNING)
- **File:** `/Users/taurus_ai/Documents/HEDERA/hedera-orchestrator/src/simple-unified.ts`
- **Port:** 3006
- **Process Manager:** PM2 (`taurus-backend`)
- **Status:** ✅ Running 24/7, auto-restart on boot

### 3.2 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Server health check |
| `/api/cognitive-state` | GET | GCR focus score + autonomy level |
| `/api/set-gcr?score=0.92` | GET | Manual GCR override (for demos) |
| `/api/execute` | POST | Execute commands with governance check |

### 3.3 Telegram Bot Commands

| Command | Syntax | What It Does |
|---------|--------|--------------|
| `/help` | `/help` | Shows all commands |
| `/start` | `/start` | Same as /help |
| `/status` | `/status` | System health + GCR score |
| `/balance` | `/balance` | Hedera account info |
| `/platforms` | `/platforms` | List all platforms + URLs |
| `/deploy` | `/deploy <platform> <staging\|production>` | Deploy to URL |
| `/setgcr` | `/setgcr 0-100` | Set focus score (demo) |
| `/resetgcr` | `/resetgcr` | Reset to live GCR |
| `/confirm` | `CONFIRM <platform> <env>` | Confirm production deploy |

### 3.4 Web Dashboard (Cursor-Built)
- **File:** `/Users/taurus_ai/Documents/HEDERA/apps/taurusai-io/`
- **Port:** 3010
- **Auth:** Telegram Login Widget → HMAC-SHA-256 → JWT session
- **Pages:** `/login`, `/admin` (protected)

---

## 4. Platform URLs

| Platform | Staging | Production | Operating Entity |
|----------|---------|------------|------------------|
| **NeoVibe** | staging-neovibe.taurusai.io | neovibe.taurusai.io | TAURUS AI Corp - FZCO |
| **BizFlow** | staging-bizflow.taurusai.io | bizflow.taurusai.io | TAURUS AI Corp - FZCO |
| **Q-Grid** | staging-qgrid.taurusai.io | q-grid.net | ARQ QUANTUM LLC |

---

## 5. Credentials & Config

### Telegram Bot
```
BOT_TOKEN: 8717284863:AAG_ldBIxMdD2xT1V7_1pQfVAzdRv0C9V_I
BOT_NAME: @TaurusAIOpsBot
```

### Hedera Testnet
```
ACCOUNT_ID: 0.0.7231851
NETWORK: testnet
GOVERNANCE_TOPIC: 0.0.8076305
```

### Environment Files
- Backend: `/Users/taurus_ai/Documents/HEDERA/hedera-orchestrator/.env`
- Web Dashboard: `/Users/taurus_ai/Documents/HEDERA/apps/taurusai-io/.env.local`

---

## 6. Files Created/Modified This Session

### New Files
| File | Purpose |
|------|---------|
| `simple-unified.ts` | Backend server (Telegram bot + API) |
| `pqc_executive_security.py` | ML-DSA-65 PQC signing |
| `telegram_command_listener.py` | PQC command verification |
| `neuromorphic_governance.py` | GCR cognitive state engine |
| `hedera_hcs_governance.py` | HCS audit trails |
| `ceo_command_center.html` | Alpine.js login widget |
| `docs/session-outputs/PRD-CEO-COMMAND-CENTER.md` | This file |
| `docs/session-outputs/TAURUS-AI-Executive-Command-Platform-Session-Output.md` | Session summary |
| `docs/session-outputs/TAURUS-AI-Executive-Command-Platform-Session-Output.pdf` | PDF version |

### Modified Files
| File | Change |
|------|--------|
| `simple-unified.ts` | Added platform config, /deploy, /platforms, /help |
| `nav.tsx` | Added lock icon linking to /admin |

---

## 7. How to Run Everything

### Start Backend (24/7)
```bash
# Check status
pm2 status

# If not running:
cd /Users/taurus_ai/Documents/HEDERA/hedera-orchestrator
pm2 start "npx ts-node src/simple-unified.ts" --name taurus-backend
pm2 save

# Auto-start on boot (run once):
sudo env PATH=$PATH:/opt/homebrew/Cellar/node/25.8.1_1/bin /opt/homebrew/lib/node_modules/pm2/bin/pm2 startup launchd -u taurus_ai --hp /Users/taurus_ai
```

### Start Web Dashboard
```bash
cd /Users/taurus_ai/Documents/HEDERA/apps/taurusai-io
pnpm dev
# Runs on http://localhost:3010
```

### PM2 Management
```bash
pm2 status           # Check status
pm2 logs taurus-backend  # View logs
pm2 restart taurus-backend  # Restart
pm2 stop taurus-backend     # Stop
```

---

## 8. How GCR (Focus Score) Works

### Measurement Flow
```
EEG Device (Muse 2/OpenBCI)
    ↓ (256 samples/sec)
Phase Locking Value Algorithm
    ↓ (every 5-10 seconds)
GCR Score (0.0 - 1.0)
    ↓
Autonomy Level Calculation:
  90%+ → 90% autonomy (AI does almost anything)
  75%+ → 70% autonomy (AI does most things)
  60%+ → 50% autonomy (AI asks for risky stuff)
  <60% → 30% autonomy (AI asks for everything)
```

### Current Status
- **GCR API:** Broken (returns HTML instead of JSON)
- **Fallback:** Hardcoded 0.85 (85%)
- **Manual Override:** `/setgcr 90` for demos
- **Real EEG:** Not connected (needs Muse 2 / OpenBCI hardware)

---

## 9. How Deploy Works

### Command Syntax
```
/deploy <platform> <environment>

Examples:
  /deploy neovibe staging
  /deploy bizflow production
  /deploy q-grid staging
```

### Flow
```
1. User sends /deploy neovibe staging
2. System checks GCR score
3. If autonomy >= 50% (staging) or >= 70% (production):
   → Auto-approve deployment
   → Generate execution hash
   → Store governance record
   → Return target URL + execution ID
4. If autonomy too low:
   → Ask for CONFIRM
   → User replies: CONFIRM neovibe staging
   → Deploy proceeds
```

### URLs Deployed To
| Command | URL |
|---------|-----|
| `/deploy neovibe staging` | staging-neovibe.taurusai.io |
| `/deploy neovibe production` | neovibe.taurusai.io |
| `/deploy bizflow staging` | staging-bizflow.taurusai.io |
| `/deploy bizflow production` | bizflow.taurusai.io |
| `/deploy q-grid staging` | staging-qgrid.taurusai.io |
| `/deploy q-grid production` | q-grid.net |

---

## 10. Test Commands

### Test Backend
```bash
# Health check
curl http://localhost:3006/health

# Cognitive state (focus score)
curl http://localhost:3006/api/cognitive-state

# Set GCR override (demo)
curl "http://localhost:3006/api/set-gcr?score=0.92"

# Execute command
curl -X POST http://localhost:3006/api/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "analyze", "params": {"target": "https://github.com/hiero-ledger"}, "userId": "ceo"}'
```

### Test Telegram
Send these to @TaurusAIOpsBot:
```
/start       → Shows all commands
/status      → System status
/platforms   → List platforms + URLs
/setgcr 90   → Set focus to 90%
/deploy neovibe staging → Deploy NeoVibe to staging
```

### Test Web Dashboard
```bash
open http://localhost:3010/login
# Login with Telegram account
# Access /admin dashboard
```

---

## 11. What's NOT Done Yet

### Critical
1. **GCR API Broken** — HuggingFace endpoint returns HTML, not JSON
2. **No Real EEG** — Need Muse 2 ($250) or OpenBCI ($500+) hardware
3. **No Actual Deploy Pipeline** — URLs return 404 (not connected to Vercel)
4. **No PQC Integration** — Python PQC module not connected to Node.js server
5. **No HCS Audit** — Hedera topic messages not being submitted

### Nice to Have
6. **No /transfer command** — HBAR transfers not implemented
7. **No /recon command** — Reconnaissance features not implemented
8. **No monitoring** — No uptime monitoring for backend
9. **No SSL** — Backend running HTTP only

---

## 12. Next Steps (Priority Order)

### Phase 1: Stabilize (Do First)
1. Fix GCR API or add manual input UI
2. Connect to actual Vercel deploy API
3. Add PQC signing to Node.js server
4. Test full flow: Telegram → Backend → Deploy

### Phase 2: Enhance
5. Add /recon command (brave-search + playwright)
6. Add /transfer command (HBAR transfers)
7. Add monitoring (uptime, alerts)
8. Add SSL/certificates for backend

### Phase 3: Hardware
9. Buy Muse 2 EEG headset ($250)
10. Connect real GCR scores
11. Test focus-based autonomy flow
12. Document real-world usage

---

## 13. Known Issues & Fixes

### Issue 1: PM2 Process Keeps Restarting
**Symptom:** `↺` count increases
**Fix:** Check logs with `pm2 logs taurus-backend`
**Cause:** Usually syntax error in TypeScript

### Issue 2: GCR API Returns HTML
**Symptom:** GCR score stays at 0.85
**Fix:** Use manual override `/setgcr 90`
**Root Cause:** HuggingFace endpoint broken

### Issue 3: Telegram Widget Not Showing
**Symptom:** curl doesn't see Telegram script
**Fix:** Normal — script injected client-side via useEffect
**Verify:** Open in actual browser, not curl

### Issue 4: /admin Returns 401/307
**Symptom:** Redirected to /login
**Fix:** Normal — auth working correctly
**Login:** Use Telegram Login Widget at /login

---

## 14. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CEO COMMAND CENTER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Telegram   │    │  Web Login   │    │   REST API   │       │
│  │     Bot      │    │   (Widget)   │    │  (Port 3006) │       │
│  │  @TaurusAI   │    │  Port 3010   │    │              │       │
│  │  OpsBot      │    │              │    │              │       │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘       │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │   NEUROMORPHIC  │                          │
│                    │   GOVERNANCE    │                          │
│                    │   (GCR-Based)   │                          │
│                    └────────┬────────┘                          │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐               │
│         │                   │                   │               │
│  ┌──────▼───────┐    ┌──────▼───────┐    ┌──────▼───────┐       │
│  │     PQC      │    │   Hedera     │    │   PM2        │       │
│  │   Security   │    │     HCS      │    │  (24/7 Run)  │       │
│  │  (ML-DSA-65) │    │  (Testnet)   │    │              │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 15. Handoff Checklist for Next Agent

Before continuing, verify:

- [ ] PM2 backend running: `pm2 status`
- [ ] Backend healthy: `curl http://localhost:3006/health`
- [ ] Telegram bot responding: Send `/start` to @TaurusAIOpsBot
- [ ] GCR override works: `curl "http://localhost:3006/api/set-gcr?score=0.92"`
- [ ] Platform config in place: Send `/platforms` to bot
- [ ] All docs exist: `ls docs/session-outputs/`

---

## 16. Code References

| What | Where |
|------|-------|
| Platform config (URLs) | `simple-unified.ts:17-26` |
| GCR override logic | `simple-unified.ts:60-85` |
| Deploy command handler | `simple-unified.ts:265-300` |
| /platforms command | `simple-unified.ts:300-320` |
| /help command | `simple-unified.ts:225-244` |
| Telegram polling | `simple-unified.ts:187-392` |
| PM2 config | `~/.pm2/dump.pm2` |

---

**Document Complete**  
**Ready for Next Agent Handoff**
