#!/bin/bash

# Quick Launch - Get the most impressive agents running NOW
# Focuses on Deep Researcher and other key agents

set -e

echo "🚀 QUICK LAUNCH - SurfSense AI Agent System"
echo "============================================"

BASE_DIR="/Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/TAURUS-BUSINESS-INTELLIGENCE-HUB/TAURUS AI CORP/NeoVibe-Vibe_Marketing_Studio"

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
for port in 8501 8502 8503 8504 8505; do
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
done

# Launch Deep Researcher (Most Impressive - Already has venv)
echo "🔬 Launching Deep Researcher Agent (Port 8501)..."
cd "$BASE_DIR/agents/research/deep_researcher"
if [ -d "venv" ]; then
    nohup ./venv/bin/streamlit run app.py --server.port 8501 --server.headless true > /tmp/deep_researcher.log 2>&1 &
    echo "✅ Deep Researcher launched at http://localhost:8501"
else
    echo "⚠️  Deep Researcher venv not ready yet"
fi

# Launch ArXiv Researcher (if venv exists)
echo "📚 Launching ArXiv Researcher Agent (Port 8502)..."
cd "$BASE_DIR/agents/research/arxiv_researcher"
if [ -d "venv" ]; then
    nohup ./venv/bin/streamlit run app.py --server.port 8502 --server.headless true > /tmp/arxiv_researcher.log 2>&1 &
    echo "✅ ArXiv Researcher launched at http://localhost:8502"
else
    echo "⚠️  ArXiv Researcher venv not ready yet"
fi

# Launch Price Monitor (Business Agent)
echo "💰 Launching Price Monitor Agent (Port 8505)..."
cd "$BASE_DIR/agents/business/price_monitor"
if [ -d "venv" ]; then
    nohup ./venv/bin/streamlit run app.py --server.port 8505 --server.headless true > /tmp/price_monitor.log 2>&1 &
    echo "✅ Price Monitor launched at http://localhost:8505"
else
    # Try without venv using system streamlit
    if command -v streamlit &> /dev/null; then
        nohup streamlit run app.py --server.port 8505 --server.headless true > /tmp/price_monitor.log 2>&1 &
        echo "✅ Price Monitor launched (system Python) at http://localhost:8505"
    fi
fi

echo ""
echo "🎯 DEPLOYMENT SUMMARY"
echo "====================="
echo ""
echo "✅ SurfSense Browser Extension: Running (dev mode)"
echo "   URL: Check Plasmo output for local extension URL"
echo ""
echo "🤖 AI AGENTS LAUNCHED:"
echo "----------------------"
echo "1. Deep Researcher (Most Impressive): http://localhost:8501"
echo "2. ArXiv Researcher: http://localhost:8502"
echo "3. Price Monitor: http://localhost:8505"
echo ""
echo "📊 STATUS CHECK:"
echo "----------------"
sleep 3
echo ""
for port in 8501 8502 8505; do
    if lsof -i:$port > /dev/null 2>&1; then
        echo "✅ Port $port: ACTIVE"
    else
        echo "❌ Port $port: NOT ACTIVE"
    fi
done

echo ""
echo "🔍 LOGS LOCATION:"
echo "-----------------"
echo "Deep Researcher: /tmp/deep_researcher.log"
echo "ArXiv Researcher: /tmp/arxiv_researcher.log"
echo "Price Monitor: /tmp/price_monitor.log"
echo ""
echo "💡 TIP: Check agent status with: lsof -i:8501-8510"
echo ""
echo "🎉 QUICK LAUNCH COMPLETE!"