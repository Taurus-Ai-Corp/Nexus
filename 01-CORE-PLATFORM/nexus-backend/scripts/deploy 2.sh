#!/bin/bash
# ===========================================
# BizFlow Backend - Production Deployment Script
# ===========================================

set -e

echo "🚀 BizFlow Backend Production Deployment"
echo "========================================"

# Check for required environment variables
required_vars=("JWT_SECRET_KEY" "DATABASE_URL" "REDIS_URL")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Copy .env.example to .env and fill in the values."
    exit 1
fi

echo "✅ Environment variables validated"

# Pull latest code (if using git)
# git pull origin main

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Run database migrations (if using Alembic)
# alembic upgrade head

# Start the application
echo "🚀 Starting BizFlow Backend..."
echo ""
echo "========================================"
echo "Production deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure Nginx reverse proxy"
echo "2. Set up SSL certificates"
echo "3. Configure firewall"
echo "4. Set up monitoring/alerting"
echo "========================================"
