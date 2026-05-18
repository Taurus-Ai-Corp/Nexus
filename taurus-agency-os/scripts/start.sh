#!/bin/bash

echo "🚀 Starting TAURUS Agency OS..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Start Docker infrastructure
echo -e "${YELLOW}Starting Docker services (Hyperswitch, Lago, PostgreSQL, Redis)...${NC}"
cd "$(dirname "$0")/infra"
docker compose up -d

# Wait for services to be ready
echo "Waiting for services..."
sleep 5

# Start Backend
echo -e "${GREEN}Starting Backend API server...${NC}"
cd "$(dirname "$0")/backend"
node server.js &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Start Frontend Dev Server
echo -e "${GREEN}Starting Frontend dev server...${NC}"
cd "$(dirname "$0")/frontend"
npm run dev &
FRONTEND_PID=$!

# Summary
echo ""
echo "========================================="
echo "🎉 TAURUS Agency OS is running!"
echo "========================================="
echo ""
echo "Frontend:     http://localhost:3000"
echo "Backend API:  http://localhost:5000"
echo "Health:       http://localhost:5000/health"
echo ""
echo "Demo Credentials:"
echo "  Email:    agency@example.com"
echo "  Password: password123"
echo ""
echo "Services Running:"
echo "  - Hyperswitch (Payments): http://localhost:8080"
echo "  - Lago (Billing):         http://localhost:3000"
echo "  - PostgreSQL:             localhost:5432"
echo "  - Redis:                  localhost:6379"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Handle cleanup
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; cd $(dirname "$0")/infra && docker compose down; exit" INT TERM

# Keep script running
wait