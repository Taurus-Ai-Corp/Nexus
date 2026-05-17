#!/bin/bash
set -e

echo "╔══════════════════════════════════════════╗"
echo "║  NeoSync™ — Local Setup Script           ║"
echo "║  TAURUS AI CORP - FZCO                   ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "→ Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required. Install from https://nodejs.org"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 required. Install from https://python.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm required (comes with Node.js)"; exit 1; }
echo "✅ Prerequisites OK"
echo ""

# Frontend setup
echo "→ Setting up frontend..."
cd web
npm install
echo "✅ Frontend ready (http://localhost:5173)"
cd ..
echo ""

# Backend setup
echo "→ Setting up backend..."
cd api
python3 -m venv .venv 2>/dev/null || true
source .venv/bin/activate 2>/dev/null || true
pip install -r requirements.txt -q
echo "✅ Backend ready (http://localhost:8000)"
cd ..
echo ""

# Create .env if not exists
if [ ! -f api/.env ]; then
    echo "→ Creating api/.env from template..."
    cp api/.env.example api/.env
    echo "⚠️  Edit api/.env with your database credentials"
    echo ""
fi

echo "╔══════════════════════════════════════════╗"
echo "║  Setup Complete!                         ║"
echo "╠══════════════════════════════════════════╣"
echo "║  Frontend:  cd web && npm run dev        ║"
echo "║  Backend:   cd api && uvicorn main:app   ║"
echo "║  Both:      make dev                     ║"
echo "╚══════════════════════════════════════════╝"
