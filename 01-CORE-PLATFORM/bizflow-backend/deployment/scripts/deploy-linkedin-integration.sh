#!/bin/bash

# 🚀 Deploy LinkedIn + Vertex AI Integration Script
# Sets up the integrated BizFlow + N8N LinkedIn automation system

set -e

echo "🏰 TAURUS AI CORP. - LinkedIn Integration Deployment"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if we're in the right directory
if [[ ! -d "03-integrations/n8n-workflows" ]]; then
    print_error "Please run this script from the BizFlow-Agentic_Intelligent_Orchestrator root directory"
    exit 1
fi

print_status "Starting LinkedIn + Vertex AI integration deployment..."

# Step 1: Check prerequisites
print_status "Step 1: Checking prerequisites..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed. Please install Node.js first."
    exit 1
else
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is required but not installed."
    exit 1
else
    PYTHON_VERSION=$(python3 --version)
    print_success "Python found: $PYTHON_VERSION"
fi

# Step 2: Install N8N if not already installed
print_status "Step 2: Setting up N8N workflow engine..."

if ! command -v n8n &> /dev/null; then
    print_warning "N8N not found. Installing globally..."
    npm install n8n -g
    print_success "N8N installed successfully"
else
    N8N_VERSION=$(n8n --version)
    print_success "N8N already installed: $N8N_VERSION"
fi

# Step 3: Set up Python virtual environment
print_status "Step 3: Setting up Python virtual environment..."

if [[ ! -d "venv" ]]; then
    python3 -m venv venv
    print_success "Virtual environment created"
else
    print_success "Virtual environment already exists"
fi

# Activate virtual environment
source venv/bin/activate
print_success "Virtual environment activated"

# Install Python dependencies
if [[ -f "requirements.txt" ]]; then
    pip install -r requirements.txt
    print_success "Python dependencies installed"
fi

# Install additional dependencies for the integration
pip install httpx fastapi uvicorn python-multipart
print_success "Integration dependencies installed"

# Step 4: Set up N8N workspace and import Jack's workflows
print_status "Step 4: Setting up N8N workspace..."

# Create N8N data directory if it doesn't exist
mkdir -p ~/.n8n

# Create N8N configuration
cat > ~/.n8n/config <<EOF
{
  "database": {
    "type": "sqlite",
    "database": "database.sqlite"
  },
  "credentials": {
    "overwrite": {
      "data": "ask"
    }
  },
  "nodes": {
    "exclude": []
  }
}
EOF

print_success "N8N configuration created"

# Step 5: Prepare LinkedIn workflow import
print_status "Step 5: Preparing LinkedIn workflow import..."

LINKEDIN_WORKFLOW="03-integrations/n8n-workflows/linkedin-automation/\$10,000 LinkedIn agent.json"

if [[ -f "$LINKEDIN_WORKFLOW" ]]; then
    print_success "Jack's LinkedIn workflow found and ready for import"
else
    print_error "LinkedIn workflow file not found at: $LINKEDIN_WORKFLOW"
    print_warning "Please ensure Jack's workflow file is copied to the correct location"
fi

# Step 6: Create integration bridge configuration
print_status "Step 6: Creating integration bridge configuration..."

cat > 03-integrations/n8n-workflows/linkedin-automation/integration-config.json <<EOF
{
  "integration_name": "linkedin_vertex_ai_bridge",
  "version": "1.0.0",
  "components": {
    "n8n_webhook_url": "http://localhost:5678/webhook-test/87cfc04e-369f-4ebf-8821-bd1affd0b42f",
    "bizflow_agent_url": "http://localhost:8000/api/agents/vertex-ai-creative",
    "linkedin_workflow_id": "IndKbWsFAHaTYUCB"
  },
  "capabilities": [
    "content_enhancement",
    "linkedin_automation",
    "engagement_optimization",
    "viral_potential_analysis",
    "multi_hook_generation",
    "performance_insights"
  ],
  "settings": {
    "enhancement_timeout": 30,
    "linkedin_timeout": 60,
    "batch_size": 5,
    "rate_limit_delay": 2
  }
}
EOF

print_success "Integration configuration created"

# Step 7: Create startup scripts
print_status "Step 7: Creating startup scripts..."

# N8N startup script
cat > start-n8n.sh <<'EOF'
#!/bin/bash
echo "🔄 Starting N8N workflow engine..."
export N8N_BASIC_AUTH_ACTIVE=true
export N8N_BASIC_AUTH_USER=admin
export N8N_BASIC_AUTH_PASSWORD=password
export N8N_HOST=0.0.0.0
export N8N_PORT=5678
n8n start
EOF

chmod +x start-n8n.sh
print_success "N8N startup script created"

# BizFlow orchestrator startup script  
cat > start-orchestrator.sh <<'EOF'
#!/bin/bash
echo "🏰 Starting Enhanced BizFlow Orchestrator..."
source venv/bin/activate
cd agents/orchestration
python3 enhanced_linkedin_orchestrator.py
EOF

chmod +x start-orchestrator.sh
print_success "Orchestrator startup script created"

# Integration bridge startup script
cat > start-integration-bridge.sh <<'EOF'
#!/bin/bash
echo "🌉 Starting LinkedIn + Vertex AI Integration Bridge..."
source venv/bin/activate
cd 03-integrations/n8n-workflows/linkedin-automation
python3 vertex-ai-integration.py
EOF

chmod +x start-integration-bridge.sh
print_success "Integration bridge startup script created"

# Step 8: Create testing script
print_status "Step 8: Creating test automation..."

cat > test-linkedin-integration.py <<'EOF'
#!/usr/bin/env python3
"""
Test script for LinkedIn + Vertex AI integration
"""
import asyncio
import json
import sys
sys.path.append('03-integrations/n8n-workflows/linkedin-automation')

from vertex_ai_integration import LinkedInVertexAIBridge

async def test_integration():
    print("🧪 Testing LinkedIn + Vertex AI Integration...")
    
    bridge = LinkedInVertexAIBridge()
    
    # Test content
    test_content = """
    Small businesses can now leverage AI agents to compete with Fortune 500 marketing teams.
    The automation revolution is here, and it's more accessible than ever.
    Here's what I learned implementing AI systems for 50+ businesses...
    """
    
    print("📝 Processing test content through integrated pipeline...")
    result = await bridge.process_content_pipeline(test_content)
    
    print("\n✅ Integration Test Results:")
    print(f"Original Content: {result['input_content'][:100]}...")
    if 'final_output' in result:
        print(f"Enhanced Content: {result['final_output'].get('enhanced_content', 'N/A')[:100]}...")
        print(f"LinkedIn Post: {result['final_output'].get('linkedin_post', 'N/A')[:100]}...")
    
    print(f"Processing Steps: {len(result.get('processing_steps', []))}")
    print("🎯 Integration test completed!")

if __name__ == "__main__":
    asyncio.run(test_integration())
EOF

chmod +x test-linkedin-integration.py
print_success "Test script created"

# Step 9: Final setup instructions
print_status "Step 9: Generating setup instructions..."

cat > LINKEDIN_INTEGRATION_SETUP.md <<'EOF'
# 🚀 LinkedIn + Vertex AI Integration Setup

## Quick Start

### 1. Start N8N (Terminal 1)
```bash
./start-n8n.sh
```
Access N8N at: http://localhost:5678
- Username: admin  
- Password: password

### 2. Import Jack's LinkedIn Workflow
1. Open N8N web interface
2. Click "Import from File"
3. Select: `03-integrations/n8n-workflows/linkedin-automation/$10,000 LinkedIn agent.json`
4. Configure API keys:
   - OpenRouter API key
   - Google Docs OAuth
   - Tavily API key
   - Anthropic API key

### 3. Start BizFlow Orchestrator (Terminal 2)
```bash
./start-orchestrator.sh
```

### 4. Start Integration Bridge (Terminal 3)
```bash
./start-integration-bridge.sh
```

### 5. Test Integration
```bash
python3 test-linkedin-integration.py
```

## API Endpoints

- **N8N Webhook**: http://localhost:5678/webhook-test/87cfc04e-369f-4ebf-8821-bd1affd0b42f
- **BizFlow Orchestrator**: http://localhost:8000
- **LinkedIn Integration**: http://localhost:8000/api/linkedin-content

## Workflow Process

1. **Input**: Raw content idea
2. **Vertex AI Enhancement**: AI-powered content optimization  
3. **LinkedIn 4-Agent System**:
   - Research Agent: Trend analysis
   - Performance Agent: Historical data analysis
   - Script Agent: Content creation
   - Hook Agent: 3 viral hooks from 250+ examples
4. **Output**: Optimized LinkedIn post with alternatives

## Configuration

Edit `03-integrations/n8n-workflows/linkedin-automation/integration-config.json` to customize:
- API endpoints
- Timeout settings
- Batch processing limits
- Rate limiting

## Troubleshooting

1. **N8N Connection Issues**: Check if N8N is running on port 5678
2. **API Key Errors**: Verify all API keys in N8N workflow nodes
3. **Integration Failures**: Check logs in integration bridge terminal
4. **Performance Issues**: Adjust timeout settings in configuration

## Support

For issues or questions, check the orchestrator logs or run the health check:
```bash
curl http://localhost:8000/api/n8n-status
```
EOF

print_success "Setup documentation created: LINKEDIN_INTEGRATION_SETUP.md"

# Final summary
echo ""
echo "🎉 LinkedIn + Vertex AI Integration Deployment Complete!"
echo "======================================================"
echo ""
print_success "✅ N8N workflow engine ready"
print_success "✅ Python environment configured"  
print_success "✅ Integration bridge created"
print_success "✅ Startup scripts ready"
print_success "✅ Test automation prepared"
print_success "✅ Documentation generated"
echo ""
echo "📚 Next Steps:"
echo "1. Read LINKEDIN_INTEGRATION_SETUP.md for detailed instructions"
echo "2. Start the three services in separate terminals"
echo "3. Import Jack's LinkedIn workflow into N8N"
echo "4. Run the integration test"
echo ""
print_status "Ready to revolutionize your LinkedIn marketing! 🚀"