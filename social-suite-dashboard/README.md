# Social Suite Dashboard – Taurus AI Corp

A web-based platform for employees to manage Meta Business Suite, Instagram, and Nexus campaigns via natural language commands.

## 🚀 Quick Start

1. Clone this repo:
   ```bash
   git clone https://github.com/taurusai/social-suite-dashboard.git
   cd social-suite-dashboard
   ```

2. Create `.env`:
   ```bash
   cp .env.example .env
   # Edit .env to add your DB, JWT_SECRET, and API keys
   ```

3. Run with Docker:
   ```bash
   docker-compose up --build
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## 📁 Structure

- `api/` – FastAPI backend (Python 3.10+)
- `web/` – React frontend (Vite + Ant Design)
- `nlp/` – Node.js NLP service (placeholder for HuggingFace Transformers)
- `docker-compose.yml` – Services orchestration

## 🔧 Development Setup (without Docker)

### Backend

```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### NLP Service

```bash
cd nlp
npm install
node index.js
```

### Frontend

```bash
cd web
npm install
npm run dev
```

## 🧪 Testing the NLP API

```bash
curl -X POST http://localhost:8001/interpret \
  -H "Content-Type: application/json" \
  -d '{"text":"run a lead-gen ad for cafés in Windsor with $25/day"}'
```

## 📦 Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Pydantic
- **Frontend**: React (Vite), Ant Design, Socket.io
- **NLP Engine**: Node.js service (placeholder for HuggingFace Transformers/spaCy)
- **Deployment**: Docker, NGINX, Redis (optional for WebSocket)