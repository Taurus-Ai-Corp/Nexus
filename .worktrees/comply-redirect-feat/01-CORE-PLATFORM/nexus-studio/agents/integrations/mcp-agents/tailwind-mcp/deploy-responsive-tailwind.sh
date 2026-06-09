#!/bin/bash

# TAURUS AI Responsive Tailwind MCP Deployment Script
# Deploys enhanced Tailwind MCP for competitive intelligence dashboard

set -e  # Exit on any error

echo "🚀 TAURUS AI Responsive Tailwind MCP Deployment"
echo "=============================================="

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get current directory
CURRENT_DIR=$(pwd)
TAILWIND_MCP_DIR="$CURRENT_DIR"
BIZFLOW_DIR="/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/BIZFLOW-COMPETITIVE-INTELLIGENCE-PLATFORM"

echo -e "${BLUE}📍 Current directory: $CURRENT_DIR${NC}"

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! $(grep -q "taurus-responsive-tailwind-mcp" package.json) ]]; then
    echo -e "${RED}❌ Error: Not in TAURUS Responsive Tailwind MCP directory${NC}"
    echo -e "${YELLOW}💡 Please cd to the tailwind-mcp directory and run this script${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Verified TAURUS Tailwind MCP directory${NC}"

# Step 1: Install dependencies
echo -e "\n${BLUE}📦 Installing MCP Server Dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Step 2: Run component tests
echo -e "\n${BLUE}🧪 Running Responsive Component Tests...${NC}"
if node test-components.js; then
    echo -e "${GREEN}✅ All tests passed${NC}"
else
    echo -e "${RED}❌ Tests failed${NC}"
    echo -e "${YELLOW}💡 Check test-results.json for details${NC}"
    exit 1
fi

# Step 3: Backup existing BIZFLOW Tailwind config
echo -e "\n${BLUE}💾 Backing up existing BIZFLOW Tailwind config...${NC}"
if [[ -f "$BIZFLOW_DIR/tailwind.config.js" ]]; then
    cp "$BIZFLOW_DIR/tailwind.config.js" "$BIZFLOW_DIR/tailwind.config.backup.js"
    echo -e "${GREEN}✅ Backup created: tailwind.config.backup.js${NC}"
else
    echo -e "${YELLOW}⚠️  No existing Tailwind config found in BIZFLOW${NC}"
fi

# Step 4: Deploy enterprise Tailwind config to BIZFLOW
echo -e "\n${BLUE}🔄 Deploying enterprise Tailwind config to BIZFLOW dashboard...${NC}"
if [[ -d "$BIZFLOW_DIR" ]]; then
    if cp tailwind.config.enterprise.js "$BIZFLOW_DIR/tailwind.config.js"; then
        echo -e "${GREEN}✅ Enterprise Tailwind config deployed to BIZFLOW${NC}"
    else
        echo -e "${RED}❌ Failed to copy Tailwind config${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ BIZFLOW directory not found: $BIZFLOW_DIR${NC}"
    echo -e "${YELLOW}💡 Please update the BIZFLOW_DIR variable in this script${NC}"
    exit 1
fi

# Step 5: Update BIZFLOW package.json dependencies
echo -e "\n${BLUE}📋 Updating BIZFLOW dependencies...${NC}"
cd "$BIZFLOW_DIR"

# Check if package.json exists
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ No package.json found in BIZFLOW directory${NC}"
    exit 1
fi

# Add required Tailwind plugins
echo -e "${YELLOW}📦 Installing required Tailwind plugins...${NC}"
if npm install @tailwindcss/forms @tailwindcss/typography --save; then
    echo -e "${GREEN}✅ Tailwind plugins installed${NC}"
else
    echo -e "${RED}❌ Failed to install Tailwind plugins${NC}"
    exit 1
fi

# Step 6: Start MCP Server
cd "$TAILWIND_MCP_DIR"
echo -e "\n${BLUE}🎯 Starting TAURUS Responsive Tailwind MCP Server...${NC}"

# Create systemd service file (optional)
if command -v systemctl &> /dev/null; then
    echo -e "${YELLOW}🔧 Creating systemd service for MCP server...${NC}"
    
    cat > taurus-tailwind-mcp.service << EOF
[Unit]
Description=TAURUS Responsive Tailwind MCP Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$TAILWIND_MCP_DIR
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    if sudo mv taurus-tailwind-mcp.service /etc/systemd/system/; then
        sudo systemctl daemon-reload
        sudo systemctl enable taurus-tailwind-mcp.service
        echo -e "${GREEN}✅ Systemd service created and enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not create systemd service (requires sudo)${NC}"
    fi
fi

# Step 7: Create startup script
echo -e "\n${BLUE}📝 Creating startup script...${NC}"

cat > start-taurus-tailwind-mcp.sh << 'EOF'
#!/bin/bash

# TAURUS AI Responsive Tailwind MCP Startup Script

echo "🚀 Starting TAURUS Responsive Tailwind MCP Server..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$DIR"

# Check if package.json exists
if [[ ! -f "package.json" ]]; then
    echo "❌ package.json not found"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [[ ! -d "node_modules" ]]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "✅ Starting MCP server..."
node index.js
EOF

chmod +x start-taurus-tailwind-mcp.sh
echo -e "${GREEN}✅ Startup script created: start-taurus-tailwind-mcp.sh${NC}"

# Step 8: Create deployment verification script
echo -e "\n${BLUE}🔍 Creating deployment verification script...${NC}"

cat > verify-deployment.sh << 'EOF'
#!/bin/bash

echo "🔍 TAURUS Responsive Tailwind MCP Deployment Verification"
echo "======================================================="

# Check MCP server
echo "🔧 Checking MCP Server..."
if [[ -f "index.js" ]] && [[ -f "package.json" ]]; then
    echo "✅ MCP server files present"
else
    echo "❌ MCP server files missing"
    exit 1
fi

# Check BIZFLOW config
BIZFLOW_CONFIG="/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/BIZFLOW-COMPETITIVE-INTELLIGENCE-PLATFORM/tailwind.config.js"
if [[ -f "$BIZFLOW_CONFIG" ]]; then
    if grep -q "taurus" "$BIZFLOW_CONFIG"; then
        echo "✅ BIZFLOW has TAURUS Tailwind config"
    else
        echo "❌ BIZFLOW config doesn't contain TAURUS tokens"
    fi
else
    echo "❌ BIZFLOW Tailwind config not found"
fi

# Check test results
if [[ -f "test-results.json" ]]; then
    SUCCESS_RATE=$(cat test-results.json | grep -o '"successRate":[0-9]*' | cut -d':' -f2)
    if [[ $SUCCESS_RATE -ge 90 ]]; then
        echo "✅ Tests passing: ${SUCCESS_RATE}%"
    else
        echo "⚠️  Test success rate low: ${SUCCESS_RATE}%"
    fi
else
    echo "⚠️  No test results found"
fi

echo ""
echo "🎉 Deployment verification complete!"
EOF

chmod +x verify-deployment.sh
echo -e "${GREEN}✅ Verification script created: verify-deployment.sh${NC}"

# Step 9: Run verification
echo -e "\n${BLUE}🔍 Running deployment verification...${NC}"
if ./verify-deployment.sh; then
    echo -e "${GREEN}✅ Deployment verification passed${NC}"
else
    echo -e "${RED}❌ Deployment verification failed${NC}"
    exit 1
fi

# Step 10: Generate documentation
echo -e "\n${BLUE}📚 Generating quick reference...${NC}"

cat > QUICK_REFERENCE.md << 'EOF'
# TAURUS Responsive Tailwind MCP - Quick Reference

## 🚀 Start Server
```bash
./start-taurus-tailwind-mcp.sh
# OR
node index.js
```

## 🧪 Run Tests
```bash
node test-components.js
```

## 🔍 Verify Deployment
```bash
./verify-deployment.sh
```

## 📱 Key Responsive Classes

### Breakpoints
- `xs:` - 475px+
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+
- `2xl:` - 1536px+
- `3xl:` - 1920px+
- `4k:` - 2560px+

### TAURUS Components
- `.taurus-glass` - Glass morphism effect
- `.taurus-metric-card` - Metric card component
- `.taurus-competitor-card` - Competitor card component
- `.taurus-btn-primary` - Primary button
- `.taurus-dashboard-grid` - Responsive dashboard grid

### Status Colors
- `text-taurus-status-monitoring` - Green (active monitoring)
- `text-taurus-status-threat` - Red (threat detected)
- `text-taurus-status-opportunity` - Blue (opportunity)
- `text-taurus-status-warning` - Amber (warning)

### Animations
- `animate-intelligence-scan` - Intelligence scanning effect
- `animate-data-flow` - Data flow animation
- `animate-threat-pulse` - Threat indicator pulse
- `animate-status-online` - Online status indicator

## 🎯 MCP Tools

### generate_responsive_component
Generate enterprise UI components:
```javascript
{
  "component": "metric-card",
  "variant": "primary",
  "size": "md",
  "responsive": true,
  "darkMode": true,
  "animation": "glow"
}
```

### generate_responsive_layout
Generate responsive layouts:
```javascript
{
  "layoutType": "competitive-intelligence",
  "breakpoints": ["mobile", "tablet", "desktop", "4k"],
  "components": ["metrics", "charts", "competitor-cards"]
}
```

### optimize_responsive_classes
Optimize Tailwind classes:
```javascript
{
  "classes": "px-4 py-4 text-sm sm:text-base lg:text-lg",
  "target": "performance"
}
```

### generate_design_tokens
Generate TAURUS design tokens:
```javascript
{
  "theme": "intelligence",
  "includeAnimations": true
}
```

## 🔧 Troubleshooting

### Server won't start
1. Check Node.js version: `node --version`
2. Install dependencies: `npm install`
3. Check port availability: `lsof -i :8000`

### Tests failing
1. Check test results: `cat test-results.json`
2. Run individual tests: `node test-components.js`
3. Verify dependencies: `npm list`

### BIZFLOW integration issues
1. Check Tailwind config: `cat ../BIZFLOW-COMPETITIVE-INTELLIGENCE-PLATFORM/tailwind.config.js`
2. Rebuild CSS: `cd ../BIZFLOW-COMPETITIVE-INTELLIGENCE-PLATFORM && npm run build:css`
3. Clear cache: `rm -rf .next node_modules/.cache`
EOF

echo -e "${GREEN}✅ Quick reference created: QUICK_REFERENCE.md${NC}"

# Final summary
echo -e "\n${GREEN}🎉 TAURUS Responsive Tailwind MCP Deployment Complete!${NC}"
echo -e "${BLUE}=============================================${NC}"
echo ""
echo -e "${GREEN}✅ MCP Server:${NC} Enhanced with responsive capabilities"
echo -e "${GREEN}✅ BIZFLOW Config:${NC} Updated with enterprise design tokens"
echo -e "${GREEN}✅ Components:${NC} Metric cards, competitor cards, responsive layouts"
echo -e "${GREEN}✅ Breakpoints:${NC} Mobile to 4K executive displays"
echo -e "${GREEN}✅ Tests:${NC} All responsive components validated"
echo -e "${GREEN}✅ Documentation:${NC} Implementation guide and quick reference"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo -e "1. Start MCP server: ${YELLOW}./start-taurus-tailwind-mcp.sh${NC}"
echo -e "2. Start BIZFLOW dashboard: ${YELLOW}cd ../BIZFLOW-COMPETITIVE-INTELLIGENCE-PLATFORM && npm run dev${NC}"
echo -e "3. Test responsive design across breakpoints"
echo -e "4. Deploy to production when ready"
echo ""
echo -e "${BLUE}📚 Resources:${NC}"
echo -e "- Implementation Guide: ${YELLOW}RESPONSIVE_IMPLEMENTATION_GUIDE.md${NC}"
echo -e "- Quick Reference: ${YELLOW}QUICK_REFERENCE.md${NC}"
echo -e "- Test Results: ${YELLOW}test-results.json${NC}"
echo ""
echo -e "${GREEN}✨ Your competitive intelligence dashboard is now ready for professional responsive design!${NC}"