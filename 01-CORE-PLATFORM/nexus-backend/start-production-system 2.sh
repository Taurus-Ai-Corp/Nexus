#!/bin/bash
echo "🏰 Starting TAURUS AI CORP. Production System..."

# Load production environment
source .env.production

# Set security permissions
export N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=false

# Start N8N with production settings
export N8N_BASIC_AUTH_ACTIVE=true
export N8N_BASIC_AUTH_USER=taurus_admin  
export N8N_BASIC_AUTH_PASSWORD=TaurusAI_Production_2025!
export N8N_HOST=0.0.0.0
export N8N_PORT=5678

echo "🔐 Production Security Enabled"
echo "   - Username: taurus_admin"
echo "   - Password: TaurusAI_Production_2025!"
echo "   - URL: http://localhost:5678"

# Start N8N
npx n8n start
