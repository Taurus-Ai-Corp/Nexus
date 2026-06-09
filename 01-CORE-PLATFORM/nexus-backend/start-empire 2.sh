#!/bin/bash
echo "🏰 Starting BizFlow™ Empire..."

# Activate virtual environment
source venv/bin/activate

# Start the registry server
python3 registry/server.py &

# Start the master orchestrator
python3 agents/orchestration/master_orchestrator.py &

echo "✅ Empire started successfully!"
echo "🌐 Registry API: http://localhost:8000"
echo "🎨 Platform: http://localhost:3000"
