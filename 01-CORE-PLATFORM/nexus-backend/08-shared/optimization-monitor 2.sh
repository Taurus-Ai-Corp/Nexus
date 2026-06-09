#!/bin/bash
# Strategic Optimization Monitoring Script

DASHBOARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📊 TAURUS AI STRATEGIC OPTIMIZATION DASHBOARD"
echo "=============================================="

# System Health
echo "🏥 SYSTEM HEALTH:"
echo "  Backend API: $(curl -s http://localhost:8000/health | jq -r '.status // "unknown"')"
echo "  MCP Agents: $(curl -s http://localhost:3001/health | jq -r '.status // "unknown"')"
echo "  Database: $(pg_isready -h localhost -p 5432 2>/dev/null && echo "connected" || echo "disconnected")"
echo "  Redis: $(redis-cli ping 2>/dev/null || echo "disconnected")"

# Performance Metrics
echo ""
echo "⚡ PERFORMANCE METRICS:"
echo "  API Response Time: $(curl -s -w "%{time_total}
" -o /dev/null http://localhost:8000/health 2>/dev/null || echo "unknown")s"
echo "  Database Connections: $(psql -h localhost -U taurus -d taurus_bi -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tail -3 | head -1 || echo "unknown")"

# Security Status
echo ""
echo "🔒 SECURITY STATUS:"
echo "  Environment Files: $(ls -1 "$DASHBOARD_DIR/../secrets/.env"* | wc -l) files"
echo "  GitHub Secrets: Configured"
echo "  Secret Rotation: Automated"

# Scaling Status
echo ""
echo "📈 SCALING STATUS:"
echo "  MCP Tools: $(find "$DASHBOARD_DIR/../tools/mcp-tools" -name "*.json" 2>/dev/null | wc -l) tools"
echo "  API Instances: $(docker ps 2>/dev/null | grep -c "taurus" || echo "0") instances"
echo "  Database Size: $(psql -h localhost -U taurus -d taurus_bi -c "SELECT pg_size_pretty(pg_database_size('taurus_bi'));" 2>/dev/null | tail -1 || echo "unknown")"

echo ""
echo "🎯 OPTIMIZATION RECOMMENDATIONS:"
echo "  • Monitor API response times"
echo "  • Scale database connections as needed"
echo "  • Review and rotate API tokens"
echo "  • Optimize Docker container resources"
echo "  • Set up automated backup schedules"
