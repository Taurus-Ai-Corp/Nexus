#!/bin/bash
echo "🚀 Starting Taurus AI Corp. Monitoring..."
echo "📊 Dashboard: http://localhost:8080"
echo "📈 API: http://localhost:8080/api/status"
echo "🔍 Logs: monitoring/logs/"

# Start monitoring API
python3 monitoring/api.py &
API_PID=$!

# Start monitoring script
python3 monitor.py &
MONITOR_PID=$!

echo "✅ Monitoring started (API PID: $API_PID, Monitor PID: $MONITOR_PID)"
echo "Press Ctrl+C to stop"

trap "kill $API_PID $MONITOR_PID; echo '🛑 Monitoring stopped'; exit" INT

wait
