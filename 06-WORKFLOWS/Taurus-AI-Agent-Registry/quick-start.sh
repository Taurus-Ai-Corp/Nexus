#!/bin/bash

# 🏰 Taurus AI Corp. - Local AI Empire Quick Start
echo "🏰 Starting Taurus AI Corp. Local AI Empire..."
echo "💰 Cost: $0/month for unlimited development!"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start the empire
echo "🚀 Starting all services..."
docker-compose up -d --build

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check Ollama
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama is running on http://localhost:11434"
else
    echo "⚠️  Ollama starting up..."
fi

# Check Registry
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Registry is running on http://localhost:8000"
else
    echo "⚠️  Registry starting up..."
fi

# Check Database
if docker exec taurus-supabase-db pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is running on localhost:54322"
else
    echo "⚠️  Database starting up..."
fi

echo ""
echo "🎉 Taurus AI Corp. Local AI Empire Status:"
echo "📊 Registry API: http://localhost:8000"
echo "🤖 Ollama API: http://localhost:11434"
echo "🗄️ Database: localhost:54322"
echo "🔍 Vector DB: http://localhost:8001"
echo ""
echo "💰 Current Costs: $0/month"
echo "🚀 Your empire is ready for development!"
echo ""
echo "Next steps:"
echo "1. Visit http://localhost:8000/health to verify"
echo "2. Pull AI models: docker exec taurus-ollama ollama pull llama3.1:8b"
echo "3. Start building your agents!"