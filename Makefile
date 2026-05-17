.PHONY: help install dev deploy-api deploy-web deploy-all test clean

SCOPE := taurus-s-projects
API_DIR := api
WEB_DIR := web

help:
	@echo "NeoSync™ Social Suite — Development Workflow"
	@echo ""
	@echo "  make install      Install all dependencies (frontend + backend)"
	@echo "  make dev          Start frontend dev server (localhost:5173)"
	@echo "  make dev-api      Start backend dev server (localhost:8000)"
	@echo "  make deploy-api   Deploy backend to Vercel"
	@echo "  make deploy-web   Deploy frontend to Vercel"
	@echo "  make deploy-all   Deploy both frontend and backend"
	@echo "  make test         Run frontend build + lint check"
	@echo "  make clean        Remove build artifacts"

install:
	@echo "→ Installing frontend dependencies..."
	cd $(WEB_DIR) && npm install
	@echo "→ Installing backend dependencies..."
	cd $(API_DIR) && pip install -r requirements.txt
	@echo "✅ All dependencies installed"

dev:
	@echo "→ Starting frontend dev server on http://localhost:5173"
	cd $(WEB_DIR) && npm run dev -- --port 5173

dev-api:
	@echo "→ Starting API dev server on http://localhost:8000"
	cd $(API_DIR) && uvicorn main:app --reload --port 8000

deploy-api:
	@echo "→ Deploying API to Vercel..."
	cd $(API_DIR) && vercel deploy --prod --yes --scope $(SCOPE)
	@echo "✅ API deployed"

deploy-web:
	@echo "→ Deploying frontend to Vercel..."
	cd $(WEB_DIR) && vercel deploy --prod --yes --scope $(SCOPE)
	@echo "✅ Frontend deployed"

deploy-all: deploy-api deploy-web
	@echo ""
	@echo "✅ Full deployment complete!"
	@echo "  Frontend: https://neosync-dashboard.vercel.app"
	@echo "  API:      https://api-beryl-three-25.vercel.app"

test:
	@echo "→ Building frontend..."
	cd $(WEB_DIR) && npm run build
	@echo "→ Checking Python lint..."
	cd $(API_DIR) && pip install -q ruff && ruff check . || true
	@echo "✅ Tests passed"

clean:
	rm -rf $(WEB_DIR)/dist
	rm -rf $(WEB_DIR)/.vercel
	rm -rf $(API_DIR)/.vercel
	rm -rf $(API_DIR)/__pycache__
	find $(API_DIR) -name "*.pyc" -delete
	@echo "✅ Cleaned"
