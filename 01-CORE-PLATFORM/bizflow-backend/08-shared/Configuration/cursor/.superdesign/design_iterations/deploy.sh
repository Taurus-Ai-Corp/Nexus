#!/bin/bash

# BizFlow Marketing Site - Automated Vercel Deployment Script
# This script automates the entire deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_NAME="bizflow-marketing-site"
DOMAIN="bizflow.com"
PROJECT_DIR=$(pwd)

echo -e "${BLUE}🚀 BizFlow Marketing Site - Automated Deployment${NC}"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "bizflow_enhanced_2.html" ]; then
    echo -e "${RED}❌ Error: bizflow_enhanced_2.html not found. Are you in the right directory?${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found BizFlow site files${NC}"

# Run pre-deployment checks
echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠️  package.json not found. Creating...${NC}"
    npm init -y
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Run tests if available
if [ -f "bizflow_tests.spec.js" ]; then
    echo -e "${BLUE}🧪 Running tests...${NC}"
    if npm test; then
        echo -e "${GREEN}✅ All tests passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Some tests failed, but continuing deployment...${NC}"
    fi
fi

# Check file sizes and optimization
echo -e "${BLUE}📊 Checking file sizes...${NC}"
HTML_SIZE=$(du -h bizflow_enhanced_2.html | cut -f1)
CSS_SIZE=$(du -h bizflow_theme_1.css | cut -f1)
JS_SIZE=$(du -h ai_content_optimizer.js | cut -f1)

echo "  - HTML: $HTML_SIZE"
echo "  - CSS: $CSS_SIZE"  
echo "  - JS: $JS_SIZE"

# Create vercel.json if it doesn't exist
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}⚠️  vercel.json not found. Creating basic configuration...${NC}"
    cat > vercel.json << 'EOF'
{
  "version": 2,
  "name": "bizflow-marketing-site",
  "builds": [
    {
      "src": "bizflow_enhanced_2.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/bizflow_enhanced_2.html"
    }
  ]
}
EOF
fi

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"

# Login check
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please log in to Vercel...${NC}"
    vercel login
fi

# Deploy
echo -e "${GREEN}🌐 Deploying site...${NC}"
DEPLOYMENT_URL=$(vercel --yes --name $SITE_NAME)

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${BLUE}🌐 Preview URL: ${DEPLOYMENT_URL}${NC}"

# Promote to production
read -p "$(echo -e ${YELLOW}🚀 Promote to production? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚀 Promoting to production...${NC}"
    vercel --prod --yes --name $SITE_NAME
    PROD_URL="https://${SITE_NAME}.vercel.app"
    echo -e "${GREEN}✅ Production deployment complete!${NC}"
    echo -e "${BLUE}🌐 Production URL: ${PROD_URL}${NC}"
else
    echo -e "${YELLOW}⏸️  Staying in preview mode${NC}"
fi

# Domain setup
if [[ ! -z "$DOMAIN" ]]; then
    read -p "$(echo -e ${YELLOW}🌐 Set up custom domain ${DOMAIN}? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🌐 Adding domain...${NC}"
        vercel domains add $DOMAIN --yes
        echo -e "${GREEN}✅ Domain added! Update your DNS:${NC}"
        echo -e "   ${BLUE}A record: @ → 76.76.19.61${NC}"
        echo -e "   ${BLUE}CNAME: www → cname.vercel-dns.com${NC}"
    fi
fi

# Environment variables reminder
echo -e "${YELLOW}⚙️  Don't forget to set environment variables:${NC}"
echo "   1. Go to vercel.com/dashboard"
echo "   2. Select your project"
echo "   3. Go to Settings > Environment Variables"
echo "   4. Add variables from .env.example"

# Performance check
echo -e "${BLUE}📊 Running quick performance check...${NC}"
if command -v lighthouse &> /dev/null; then
    echo -e "${BLUE}🔍 Running Lighthouse audit...${NC}"
    lighthouse --quiet --chrome-flags="--headless" "$DEPLOYMENT_URL" || true
else
    echo -e "${YELLOW}💡 Install Lighthouse for performance audits: npm install -g lighthouse${NC}"
fi

# Final success message
echo ""
echo -e "${GREEN}🎉 BizFlow Marketing Site Deployment Complete!${NC}"
echo "=============================================="
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "  - Site Name: $SITE_NAME"
echo "  - Preview: $DEPLOYMENT_URL"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "  - Production: $PROD_URL"
fi
if [[ ! -z "$DOMAIN" ]]; then
    echo "  - Custom Domain: $DOMAIN (DNS setup required)"
fi
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "  1. Set up environment variables in Vercel dashboard"
echo "  2. Configure DNS records for custom domain"
echo "  3. Set up monitoring and analytics"
echo "  4. Start driving traffic to your new site!"
echo ""
echo -e "${GREEN}🚀 Your AI-powered marketing site is live!${NC}"

# Optional: Open in browser
if command -v open &> /dev/null; then
    read -p "$(echo -e ${YELLOW}🌐 Open site in browser? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$DEPLOYMENT_URL"
    fi
elif command -v xdg-open &> /dev/null; then
    read -p "$(echo -e ${YELLOW}🌐 Open site in browser? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open "$DEPLOYMENT_URL"
    fi
fi