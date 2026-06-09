#!/bin/bash
# Deploy the complete BizFlow™ empire

echo "🚀 Deploying BizFlow™ Empire..."

# 1. Start local services
docker-compose up -d

# 2. Deploy to Vercel
vercel --prod

# 3. Configure domains
echo "🌐 Configure domains:"
echo "   Main: taurusai.io"
echo "   Platform: bizflow.taurusai.io"

echo "✅ Empire deployed successfully!"
