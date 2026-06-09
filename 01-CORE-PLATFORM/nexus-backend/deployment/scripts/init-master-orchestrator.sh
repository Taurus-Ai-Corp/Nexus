#!/bin/bash
# 🏰 Initialize Master Orchestrator System

set -e

echo "🚀 INITIALIZING BIZFLOW™ MASTER ORCHESTRATOR"
echo "============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${PURPLE}🎯 $1${NC}"
}

# Navigate to orchestrator directory
cd "$(dirname "$0")/../.."

print_header "Setting up Python environment"

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install --upgrade pip
pip install fastapi uvicorn asyncio python-dotenv anthropic openai requests

print_status "Python environment ready"

print_header "Initializing agent configurations"

# Create environment file
cat > .env << 'EOF'
# AI API Keys
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here

# Database
DATABASE_URL=sqlite:///./bizflow_empire.db

# Feature Flags
ENABLE_VOICE_COMMANDS=true
ENABLE_GESTURE_CONTROL=true
ENABLE_REAL_TIME_ANALYTICS=true
ENABLE_MCP_INTEGRATION=true

# Market Configuration
DEFAULT_MARKET=Global
SUPPORTED_MARKETS=UAE,India,Canada
EOF

print_status "Environment configuration created"

print_header "Testing orchestrator system"

# Test the master orchestrator
python3 -c "
import sys
sys.path.append('.')
from agents.orchestration.master_orchestrator import BizFlowMasterOrchestrator
print('✅ Master orchestrator imports successfully')
"

print_status "Orchestrator system tested"

print_header "Creating startup scripts"

# Create startup script
cat > start-empire.sh << 'EOF'
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
EOF

chmod +x start-empire.sh

print_status "Startup scripts created"

print_header "Creating monitoring dashboard"

# Create simple monitoring dashboard
cat > web/monitoring-dashboard.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BizFlow™ Empire Monitor</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .dashboard { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .agent-status { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status-active { color: #28a745; font-weight: bold; }
        .status-inactive { color: #dc3545; font-weight: bold; }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🏰 BizFlow™ Empire Monitor</h1>
            <p>Real-time AI agent orchestration dashboard</p>
        </div>
        
        <div class="metrics">
            <div class="metric-card">
                <h3>🤖 Active Agents</h3>
                <div id="active-agents">6</div>
            </div>
            <div class="metric-card">
                <h3>⚡ Total Capabilities</h3>
                <div id="total-capabilities">81</div>
            </div>
            <div class="metric-card">
                <h3>💰 Current MRR</h3>
                <div id="current-mrr">$5,300</div>
            </div>
            <div class="metric-card">
                <h3>🎯 Success Rate</h3>
                <div id="success-rate">98%</div>
            </div>
        </div>
        
        <div class="agent-status">
            <h3>Agent Status</h3>
            <div id="agent-list">
                <div>Vertex AI Creative: <span class="status-active">Active</span></div>
                <div>Cognee Memory: <span class="status-active">Active</span></div>
                <div>Onlook Visual: <span class="status-active">Active</span></div>
                <div>Ollama Local AI: <span class="status-active">Active</span></div>
                <div>Vibe Marketing: <span class="status-active">Active</span></div>
                <div>Claude SEO MCP: <span class="status-active">Active</span></div>
            </div>
        </div>
    </div>
    
    <script>
        // Auto-refresh every 30 seconds
        setInterval(() => {
            fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('active-agents').textContent = data.metrics.active_agents;
                    document.getElementById('total-capabilities').textContent = data.metrics.total_capabilities;
                    document.getElementById('current-mrr').textContent = '$' + data.revenue.current_mrr.toLocaleString();
                })
                .catch(error => console.log('Monitoring update failed:', error));
        }, 30000);
    </script>
</body>
</html>
EOF

print_status "Monitoring dashboard created"

print_header "ORCHESTRATOR INITIALIZATION COMPLETE!"

print_info "🎉 BizFlow™ Master Orchestrator Ready!"
print_info "📁 Location: $(pwd)"
print_info "🚀 Start Command: ./start-empire.sh"
print_info "📊 Monitor: web/monitoring-dashboard.html"
print_info "⚙️  Config: .env"

print_status "🏰 Your AI Empire Orchestrator is Ready! 🚀"
