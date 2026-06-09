#!/bin/bash

# 🔄 Start N8N Locally (BizFlow Integration)

echo "🔄 Starting N8N workflow engine locally..."
echo "=========================================="

export N8N_BASIC_AUTH_ACTIVE=true
export N8N_BASIC_AUTH_USER=admin
export N8N_BASIC_AUTH_PASSWORD=password
export N8N_HOST=0.0.0.0
export N8N_PORT=5678

# Create .n8n directory if it doesn't exist
mkdir -p ~/.n8n

echo "✅ N8N Configuration:"
echo "   - URL: http://localhost:5678"
echo "   - Username: admin"
echo "   - Password: password"
echo ""
echo "🔗 To import Jack's LinkedIn workflow:"
echo "   1. Open http://localhost:5678 in your browser"
echo "   2. Login with admin/password"
echo "   3. Click 'Import from file'"
echo "   4. Select: 03-integrations/n8n-workflows/linkedin-automation/\$10,000 LinkedIn agent.json"
echo ""

# Start N8N using locally installed version
npx n8n start