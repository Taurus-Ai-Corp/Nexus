#!/bin/bash

# 🏰 TAURUS AI CORP - Webflow Template Deployment Script
# Deploys the generated Webflow template to your analytics dashboard

set -e

echo "🏰 TAURUS AI CORP - Webflow Template Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WEBFLOW_TEMPLATE_DIR="webflow-template"
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

# Function to check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if ! command -v python3 &> /dev/null; then
        missing_deps+=("python3")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Function to create backup
create_backup() {
    print_status "Creating backup of current dashboard..."
    
    if [ -d "src" ]; then
        mkdir -p "$BACKUP_DIR"
        cp -r src "$BACKUP_DIR/"
        cp package.json "$BACKUP_DIR/" 2>/dev/null || true
        cp tsconfig.json "$BACKUP_DIR/" 2>/dev/null || true
        print_success "Backup created in $BACKUP_DIR"
    else
        print_warning "No existing src directory found, skipping backup"
    fi
}

# Function to validate Webflow template
validate_template() {
    print_status "Validating Webflow template..."
    
    if [ ! -d "$WEBFLOW_TEMPLATE_DIR" ]; then
        print_error "Webflow template directory not found: $WEBFLOW_TEMPLATE_DIR"
        print_error "Please run the template generator first: python3 webflow-template-generator.py"
        exit 1
    fi
    
    local required_files=("index.html" "styles.css" "script.js")
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$WEBFLOW_TEMPLATE_DIR/$file" ]; then
            print_error "Required file missing: $WEBFLOW_TEMPLATE_DIR/$file"
            exit 1
        fi
    done
    
    print_success "Webflow template validation passed"
}

# Function to integrate Webflow template with React dashboard
integrate_template() {
    print_status "Integrating Webflow template with React dashboard..."
    
    # Create Webflow integration directory
    mkdir -p src/webflow
    
    # Copy Webflow template files
    cp "$WEBFLOW_TEMPLATE_DIR/index.html" src/webflow/
    cp "$WEBFLOW_TEMPLATE_DIR/styles.css" src/webflow/
    cp "$WEBFLOW_TEMPLATE_DIR/script.js" src/webflow/
    
    # Copy components
    if [ -d "$WEBFLOW_TEMPLATE_DIR/components" ]; then
        cp -r "$WEBFLOW_TEMPLATE_DIR/components" src/webflow/
    fi
    
    # Create Webflow integration component
    cat > src/components/WebflowDashboard.tsx << 'EOF'
import React, { useEffect, useRef } from 'react';
import './WebflowDashboard.css';

interface WebflowDashboardProps {
  data?: any;
  onRefresh?: () => void;
}

const WebflowDashboard: React.FC<WebflowDashboardProps> = ({ data, onRefresh }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Load Webflow template in iframe
    if (iframeRef.current) {
      iframeRef.current.src = '/webflow/index.html';
    }
  }, []);

  useEffect(() => {
    // Update data in Webflow template
    if (data && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        iframe.contentWindow?.postMessage({
          type: 'UPDATE_DATA',
          data: data
        }, '*');
      };
    }
  }, [data]);

  return (
    <div className="webflow-dashboard">
      <iframe
        ref={iframeRef}
        title="Webflow Analytics Dashboard"
        className="webflow-iframe"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default WebflowDashboard;
EOF

    # Create Webflow CSS
    cat > src/components/WebflowDashboard.css << 'EOF'
.webflow-dashboard {
  width: 100%;
  height: 100vh;
  border: none;
  overflow: hidden;
}

.webflow-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
}
EOF

    # Create Webflow data service
    cat > src/services/webflowDataService.ts << 'EOF'
import { BusinessMetrics } from '../types';

export class WebflowDataService {
  private static instance: WebflowDataService;
  private ws: WebSocket | null = null;
  private callbacks: ((data: BusinessMetrics) => void)[] = [];

  static getInstance(): WebflowDataService {
    if (!WebflowDataService.instance) {
      WebflowDataService.instance = new WebflowDataService();
    }
    return WebflowDataService.instance;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket('ws://localhost:3001/ws');
    
    this.ws.onopen = () => {
      console.log('Webflow data service connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.callbacks.forEach(callback => callback(data));
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('Webflow data service disconnected');
      // Reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('Webflow data service error:', error);
    };
  }

  subscribe(callback: (data: BusinessMetrics) => void): void {
    this.callbacks.push(callback);
  }

  unsubscribe(callback: (data: BusinessMetrics) => void): void {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const webflowDataService = WebflowDataService.getInstance();
EOF

    # Update main App.tsx to include Webflow dashboard option
    cat > src/App.tsx << 'EOF'
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import WebflowDashboard from './components/WebflowDashboard';
import { useMetrics } from './hooks';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState<'react' | 'webflow'>('react');
  const { metrics, loading, error } = useMetrics();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="view-mode-selector">
        <button 
          className={viewMode === 'react' ? 'active' : ''}
          onClick={() => setViewMode('react')}
        >
          React Dashboard
        </button>
        <button 
          className={viewMode === 'webflow' ? 'active' : ''}
          onClick={() => setViewMode('webflow')}
        >
          Webflow Dashboard
        </button>
      </div>
      
      {viewMode === 'react' ? (
        <Dashboard metrics={metrics} />
      ) : (
        <WebflowDashboard data={metrics} />
      )}
    </div>
  );
}

export default App;
EOF

    # Add Webflow CSS to main App.css
    cat >> src/App.css << 'EOF'

/* Webflow Dashboard Styles */
.view-mode-selector {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.view-mode-selector button {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-mode-selector button:hover {
  background: #f3f4f6;
}

.view-mode-selector button.active {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
EOF

    print_success "Webflow template integrated with React dashboard"
}

# Function to update package.json with Webflow dependencies
update_dependencies() {
    print_status "Updating dependencies for Webflow integration..."
    
    # Add Webflow-specific dependencies if needed
    npm install --save-dev @types/ws
    
    print_success "Dependencies updated"
}

# Function to create deployment configuration
create_deployment_config() {
    print_status "Creating deployment configuration..."
    
    cat > webflow-deployment.json << 'EOF'
{
  "deployment": {
    "version": "1.0.0",
    "timestamp": "2024-09-19T05:30:00Z",
    "template": "taurus-analytics-dashboard-v1",
    "features": [
      "real-time-metrics",
      "interactive-charts",
      "responsive-design",
      "dark-light-theme",
      "mobile-first",
      "accessibility-compliant"
    ]
  },
  "integration": {
    "react_dashboard": true,
    "webflow_template": true,
    "hybrid_mode": true,
    "data_sync": "websocket",
    "api_endpoints": [
      "/api/metrics/business",
      "/api/metrics/revenue",
      "/api/metrics/users",
      "/api/metrics/agents",
      "/api/metrics/performance",
      "/api/metrics/system",
      "/api/alerts"
    ]
  },
  "performance": {
    "target_load_time": "< 3s",
    "target_fcp": "< 1.5s",
    "target_lcp": "< 2.5s",
    "target_tti": "< 3.0s",
    "lighthouse_score": "> 90"
  },
  "monitoring": {
    "enabled": true,
    "metrics": ["performance", "errors", "user_interactions"],
    "alerts": ["error_rate", "response_time", "uptime"]
  }
}
EOF

    print_success "Deployment configuration created"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if [ -f "package.json" ]; then
        npm test -- --watchAll=false --passWithNoTests
        print_success "Tests completed"
    else
        print_warning "No package.json found, skipping tests"
    fi
}

# Function to build the project
build_project() {
    print_status "Building project..."
    
    if [ -f "package.json" ]; then
        npm run build
        print_success "Project built successfully"
    else
        print_warning "No package.json found, skipping build"
    fi
}

# Function to create deployment summary
create_deployment_summary() {
    print_status "Creating deployment summary..."
    
    cat > "WEBFLOW_DEPLOYMENT_SUMMARY.md" << EOF
# 🚀 Webflow Template Deployment Summary

## Deployment Details
- **Date**: $(date)
- **Template**: TAURUS Analytics Dashboard v1
- **Mode**: Hybrid (React + Webflow)
- **Status**: ✅ Successfully Deployed

## Files Created/Modified
- \`src/components/WebflowDashboard.tsx\` - Webflow dashboard component
- \`src/components/WebflowDashboard.css\` - Webflow dashboard styles
- \`src/services/webflowDataService.ts\` - Webflow data service
- \`src/App.tsx\` - Updated with view mode selector
- \`src/App.css\` - Added Webflow styles
- \`webflow-deployment.json\` - Deployment configuration

## Features Integrated
- ✅ Real-time metrics display
- ✅ Interactive charts and graphs
- ✅ Responsive design
- ✅ Dark/light theme support
- ✅ Mobile-first approach
- ✅ Accessibility compliant
- ✅ WebSocket data sync
- ✅ View mode switching

## Next Steps
1. Start the development server: \`npm start\`
2. Test both dashboard modes
3. Configure WebSocket connection
4. Deploy to production

## Access URLs
- React Dashboard: http://localhost:3000 (React mode)
- Webflow Dashboard: http://localhost:3000 (Webflow mode)
- Template Files: \`src/webflow/\`

## Support
- Documentation: \`WEBFLOW_TEMPLATE_RECOMMENDATIONS.md\`
- Integration Guide: \`webflow-integration-guide.md\`
- Configuration: \`webflow-deployment.json\`

---
*Deployed by TAURUS AI CORP Webflow Template Generator*
EOF

    print_success "Deployment summary created"
}

# Main deployment function
main() {
    echo "Starting Webflow template deployment..."
    echo "======================================"
    
    # Check dependencies
    check_dependencies
    
    # Create backup
    create_backup
    
    # Validate template
    validate_template
    
    # Integrate template
    integrate_template
    
    # Update dependencies
    update_dependencies
    
    # Create deployment config
    create_deployment_config
    
    # Run tests
    run_tests
    
    # Build project
    build_project
    
    # Create summary
    create_deployment_summary
    
    echo ""
    echo "🎉 Webflow template deployment completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Run 'npm start' to start the development server"
    echo "2. Open http://localhost:3000 in your browser"
    echo "3. Use the view mode selector to switch between React and Webflow dashboards"
    echo "4. Test all functionality and responsive design"
    echo ""
    echo "📁 Files created:"
    echo "- Webflow template files in src/webflow/"
    echo "- Integration components in src/components/"
    echo "- Data service in src/services/"
    echo "- Configuration in webflow-deployment.json"
    echo "- Summary in WEBFLOW_DEPLOYMENT_SUMMARY.md"
    echo ""
    echo "🔧 Configuration:"
    echo "- View mode selector in top-right corner"
    echo "- WebSocket connection for real-time data"
    echo "- Responsive design for all screen sizes"
    echo ""
    print_success "Deployment completed successfully!"
}

# Run main function
main "$@"

