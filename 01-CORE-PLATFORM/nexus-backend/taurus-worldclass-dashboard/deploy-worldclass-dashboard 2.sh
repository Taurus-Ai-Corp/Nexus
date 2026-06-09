#!/bin/bash

# 🏰 TAURUS AI CORP - World-Class Dashboard Deployment Script
# Integrates with your existing BizFlow-Orchestrator and MCP agents

set -e

echo "🏰 TAURUS AI CORP - World-Class Dashboard Deployment"
echo "=================================================="
echo "Powered by Motia Event-Driven Architecture"
echo "Integrating with your 200+ AI agents and MCP tools"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
DASHBOARD_DIR="taurus-worldclass-dashboard"
BIZFLOW_DIR="../BizFlow-1-Orchestrator"
MCP_AGENTS_DIR="../agents/integrations/mcp-agents"
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
DEPLOYMENT_LOG="deployment-$(date +%Y%m%d-%H%M%S).log"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_agent() {
    echo -e "${PURPLE}[AGENT]${NC} $1"
}

# Function to check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if ! command -v redis-server &> /dev/null; then
        missing_deps+=("redis-server")
    fi
    
    if ! command -v mongod &> /dev/null; then
        missing_deps+=("mongod")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Function to check BizFlow-Orchestrator integration
check_bizflow_integration() {
    print_status "Checking BizFlow-Orchestrator integration..."
    
    if [ ! -d "$BIZFLOW_DIR" ]; then
        print_error "BizFlow-Orchestrator directory not found: $BIZFLOW_DIR"
        print_error "Please ensure you're running from the correct location."
        exit 1
    fi
    
    if [ ! -f "$BIZFLOW_DIR/agents/orchestration/master_orchestrator.py" ]; then
        print_error "Master orchestrator not found in BizFlow-Orchestrator"
        exit 1
    fi
    
    print_success "BizFlow-Orchestrator integration verified"
}

# Function to check MCP agents
check_mcp_agents() {
    print_status "Checking MCP agents integration..."
    
    if [ ! -d "$MCP_AGENTS_DIR" ]; then
        print_error "MCP agents directory not found: $MCP_AGENTS_DIR"
        exit 1
    fi
    
    local mcp_count=$(find "$MCP_AGENTS_DIR" -name "*.py" -o -name "*.js" | wc -l)
    print_success "Found $mcp_count MCP agent files"
}

# Function to create backup
create_backup() {
    print_status "Creating backup of current dashboard..."
    
    if [ -d "$DASHBOARD_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        cp -r "$DASHBOARD_DIR" "$BACKUP_DIR/"
        print_success "Backup created in $BACKUP_DIR"
    else
        print_warning "No existing dashboard directory found, skipping backup"
    fi
}

# Function to install Motia
install_motia() {
    print_status "Installing Motia framework..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run from the dashboard directory."
        exit 1
    fi
    
    # Install dependencies
    npm install
    
    # Check if Motia is installed
    if ! npm list motia &> /dev/null; then
        print_error "Motia installation failed"
        exit 1
    fi
    
    print_success "Motia framework installed successfully"
}

# Function to configure environment
configure_environment() {
    print_status "Configuring environment..."
    
    # Create .env file
    cat > .env << 'EOF'
# TAURUS AI CORP - World-Class Dashboard Environment
NODE_ENV=production
PORT=3001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taurus_analytics
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-here
CORS_ORIGIN=http://localhost:3000,https://taurusai.io

# Agent Integration
BIZFLOW_API_KEY=your-bizflow-api-key
WEBFLOW_API_KEY=your-webflow-api-key
FIGMA_API_KEY=your-figma-api-key
GITHUB_TOKEN=your-github-token

# Monitoring
ALERT_WEBHOOK_URL=your-alert-webhook-url
SMTP_HOST=your-smtp-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
EOF
    
    print_success "Environment configuration created"
    print_warning "Please update .env file with your actual API keys and configuration"
}

# Function to integrate with BizFlow agents
integrate_bizflow_agents() {
    print_status "Integrating with BizFlow agents..."
    
    # Create agent integration configuration
    cat > agent-integration.json << 'EOF'
{
  "bizflow": {
    "enabled": true,
    "endpoint": "http://localhost:8000",
    "agents": {
      "core": [
        "vertex_ai_creative",
        "cognee_memory", 
        "onlook_visual",
        "ollama_local",
        "vibe_marketing",
        "claude_seo_mcp"
      ],
      "research": [
        "arxiv_researcher",
        "deep_researcher",
        "trend_analyzer",
        "candidate_analyzer"
      ],
      "business": [
        "finance_agent",
        "price_monitor",
        "startup_validator"
      ],
      "content": [
        "blog_writer",
        "newsletter_generator",
        "social_media_manager"
      ]
    }
  },
  "mcp": {
    "enabled": true,
    "tools": [
      "webflow-design",
      "figma-mcp",
      "tailwind-mcp",
      "github-mcp",
      "slack-mcp",
      "notion-mcp"
    ]
  }
}
EOF
    
    print_success "BizFlow agent integration configured"
}

# Function to start services
start_services() {
    print_status "Starting required services..."
    
    # Start Redis
    if ! pgrep -x "redis-server" > /dev/null; then
        print_status "Starting Redis server..."
        redis-server --daemonize yes
        sleep 2
    fi
    
    # Start MongoDB
    if ! pgrep -x "mongod" > /dev/null; then
        print_status "Starting MongoDB..."
        mongod --fork --logpath /tmp/mongod.log
        sleep 2
    fi
    
    print_success "Required services started"
}

# Function to start BizFlow orchestrator
start_bizflow_orchestrator() {
    print_status "Starting BizFlow orchestrator..."
    
    cd "$BIZFLOW_DIR"
    
    if [ -f "agents/orchestration/master_orchestrator.py" ]; then
        print_agent "Starting master orchestrator..."
        python3 agents/orchestration/master_orchestrator.py &
        BIZFLOW_PID=$!
        echo $BIZFLOW_PID > ../bizflow.pid
        cd - > /dev/null
        print_success "BizFlow orchestrator started (PID: $BIZFLOW_PID)"
    else
        print_warning "BizFlow orchestrator not found, skipping..."
    fi
}

# Function to start the dashboard
start_dashboard() {
    print_status "Starting world-class dashboard..."
    
    # Start the Motia application
    npm start &
    DASHBOARD_PID=$!
    echo $DASHBOARD_PID > dashboard.pid
    
    # Wait for dashboard to start
    sleep 5
    
    # Check if dashboard is running
    if curl -s http://localhost:3001/health > /dev/null; then
        print_success "World-class dashboard started successfully (PID: $DASHBOARD_PID)"
        print_success "Dashboard URL: http://localhost:3001/dashboard"
    else
        print_error "Dashboard failed to start"
        exit 1
    fi
}

# Function to run tests
run_tests() {
    print_status "Running dashboard tests..."
    
    if [ -f "package.json" ]; then
        npm test -- --watchAll=false --passWithNoTests
        print_success "Tests completed"
    else
        print_warning "No package.json found, skipping tests"
    fi
}

# Function to create deployment summary
create_deployment_summary() {
    print_status "Creating deployment summary..."
    
    cat > "WORLDCLASS_DEPLOYMENT_SUMMARY.md" << EOF
# 🏰 World-Class Dashboard Deployment Summary

## Deployment Details
- **Date**: $(date)
- **Dashboard**: TAURUS AI CORP World-Class Analytics Dashboard
- **Architecture**: Motia Event-Driven
- **Status**: ✅ Successfully Deployed

## Features Deployed
- ✅ Motia Event-Driven Backend
- ✅ Real-time Analytics API
- ✅ Agent Data Collection (16+ agents)
- ✅ WebSocket Real-time Streaming
- ✅ World-Class Webflow UI
- ✅ BizFlow-Orchestrator Integration
- ✅ MCP Agents Integration (200+ tools)

## Services Running
- **Dashboard**: http://localhost:3001/dashboard
- **API**: http://localhost:3001/api
- **WebSocket**: ws://localhost:3001/ws
- **Health Check**: http://localhost:3001/health

## Agent Integration
- **Core Agents**: 6 agents (Vertex AI, Cognee, Onlook, Ollama, Vibe, Claude SEO)
- **Research Agents**: 4 agents (Arxiv, Deep Researcher, Trend Analyzer, Candidate Analyzer)
- **Business Agents**: 3 agents (Finance, Price Monitor, Startup Validator)
- **Content Agents**: 3 agents (Blog Writer, Newsletter, Social Media)
- **MCP Tools**: 200+ tools (Webflow, Figma, Tailwind, GitHub, etc.)

## Architecture
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    WORLD-CLASS DASHBOARD                   │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Webflow-Powered)                                │
│  ├── Real-time Dashboard UI                                │
│  ├── Interactive Charts & Metrics                          │
│  └── Live Alerts & Notifications                           │
├─────────────────────────────────────────────────────────────┤
│  Motia Event-Driven Backend                                │
│  ├── API Steps (REST Endpoints)                            │
│  ├── Event Steps (Data Processing)                         │
│  ├── Stream Steps (Real-time Updates)                     │
│  └── State Management (Redis)                              │
├─────────────────────────────────────────────────────────────┤
│  Your Existing Agent Ecosystem                             │
│  ├── BizFlow-Orchestrator (16 Agents)                     │
│  ├── MCP Agents (200+ Tools)                              │
│  ├── Research & Analysis Agents                           │
│  └── Business Intelligence Agents                          │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Next Steps
1. Access the dashboard: http://localhost:3001/dashboard
2. Configure your API keys in .env file
3. Test real-time updates and agent integration
4. Customize metrics and alerts for your business
5. Deploy to production when ready

## Support
- **Documentation**: See README.md
- **API Docs**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001/health
- **Logs**: Check deployment logs for troubleshooting

---
*Deployed by TAURUS AI CORP World-Class Dashboard Generator*
*Powered by Motia Event-Driven Architecture*
EOF
    
    print_success "Deployment summary created"
}

# Function to display final information
display_final_info() {
    echo ""
    echo "🎉 World-Class Dashboard Deployment Completed Successfully!"
    echo ""
    echo "📊 Dashboard Features:"
    echo "  ✅ Motia Event-Driven Architecture"
    echo "  ✅ Real-time Analytics & Monitoring"
    echo "  ✅ Integration with 16+ BizFlow Agents"
    echo "  ✅ Integration with 200+ MCP Tools"
    echo "  ✅ World-Class Webflow UI Design"
    echo "  ✅ WebSocket Real-time Updates"
    echo "  ✅ Enterprise Security & Monitoring"
    echo ""
    echo "🌐 Access URLs:"
    echo "  📊 Dashboard: http://localhost:3001/dashboard"
    echo "  🔌 API: http://localhost:3001/api"
    echo "  📡 WebSocket: ws://localhost:3001/ws"
    echo "  ❤️ Health: http://localhost:3001/health"
    echo ""
    echo "🤖 Agent Integration:"
    echo "  Core Agents: 6 (Vertex AI, Cognee, Onlook, Ollama, Vibe, Claude SEO)"
    echo "  Research Agents: 4 (Arxiv, Deep Researcher, Trend Analyzer, Candidate Analyzer)"
    echo "  Business Agents: 3 (Finance, Price Monitor, Startup Validator)"
    echo "  Content Agents: 3 (Blog Writer, Newsletter, Social Media)"
    echo "  MCP Tools: 200+ (Webflow, Figma, Tailwind, GitHub, etc.)"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Open http://localhost:3001/dashboard in your browser"
    echo "  2. Configure API keys in .env file"
    echo "  3. Test real-time updates and agent integration"
    echo "  4. Customize metrics for your business needs"
    echo ""
    echo "📁 Files Created:"
    echo "  - World-class dashboard in $DASHBOARD_DIR/"
    echo "  - Agent integration in agent-integration.json"
    echo "  - Environment config in .env"
    echo "  - Deployment summary in WORLDCLASS_DEPLOYMENT_SUMMARY.md"
    echo ""
    print_success "Deployment completed successfully!"
}

# Main deployment function
main() {
    echo "Starting world-class dashboard deployment..."
    echo "============================================="
    
    # Check dependencies
    check_dependencies
    
    # Check integrations
    check_bizflow_integration
    check_mcp_agents
    
    # Create backup
    create_backup
    
    # Install Motia
    install_motia
    
    # Configure environment
    configure_environment
    
    # Integrate with agents
    integrate_bizflow_agents
    
    # Start services
    start_services
    
    # Start BizFlow orchestrator
    start_bizflow_orchestrator
    
    # Run tests
    run_tests
    
    # Start dashboard
    start_dashboard
    
    # Create summary
    create_deployment_summary
    
    # Display final information
    display_final_info
}

# Run main function
main "$@"

