#!/bin/bash

echo "🏰 Taurus AI Corp. - Monitoring Setup"
echo "====================================="

# Make scripts executable
chmod +x monitor.py
chmod +x monitoring/quick_monitor.py

# Install required Python packages
echo "📦 Installing monitoring dependencies..."
pip install requests docker psutil schedule

# Create monitoring directory structure
echo "📁 Creating monitoring structure..."
mkdir -p monitoring/logs
mkdir -p monitoring/reports
mkdir -p monitoring/alerts

# Create monitoring configuration
cat > monitoring/config.json << EOF
{
  "monitoring": {
    "check_interval": 30,
    "alert_threshold": 0.9,
    "log_level": "INFO",
    "services": [
      "ollama",
      "registry", 
      "supabase",
      "chromadb"
    ],
    "agents": [
      "vibe_marketing_agent",
      "ollama_local_agent",
      "vertex_ai_creative",
      "cognee_memory", 
      "onlook_visual",
      "claude_seo_mcp"
    ],
    "markets": [
      "UAE",
      "India", 
      "Canada"
    ]
  },
  "alerts": {
    "email": false,
    "slack": false,
    "webhook": false
  },
  "metrics": {
    "retention_days": 30,
    "backup_enabled": true,
    "export_format": "json"
  }
}
EOF

# Create monitoring service
cat > monitoring/taurus_monitor.service << EOF
[Unit]
Description=Taurus AI Corp. Monitoring Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/python3 monitor.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create monitoring dashboard
cat > monitoring/dashboard.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>🏰 Taurus AI Corp. - Monitor</title>
    <meta http-equiv="refresh" content="30">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .status { padding: 10px; margin: 5px; border-radius: 5px; }
        .active { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>🏰 Taurus AI Corp. - Live Monitor</h1>
    <div id="status"></div>
    <div id="metrics"></div>
    <script>
        fetch('/api/status')
            .then(response => response.json())
            .then(data => {
                document.getElementById('status').innerHTML = JSON.stringify(data, null, 2);
            });
    </script>
</body>
</html>
EOF

# Create monitoring API
cat > monitoring/api.py << EOF
#!/usr/bin/env python3
from flask import Flask, jsonify
from monitor import check_services, get_agent_status, get_revenue_metrics

app = Flask(__name__)

@app.route('/api/status')
def status():
    return jsonify({
        'services': check_services(),
        'agents': get_agent_status(),
        'revenue': get_revenue_metrics(),
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
EOF

# Create monitoring startup script
cat > start_monitoring.sh << EOF
#!/bin/bash
echo "🚀 Starting Taurus AI Corp. Monitoring..."
echo "📊 Dashboard: http://localhost:8080"
echo "📈 API: http://localhost:8080/api/status"
echo "🔍 Logs: monitoring/logs/"

# Start monitoring API
python3 monitoring/api.py &
API_PID=\$!

# Start monitoring script
python3 monitor.py &
MONITOR_PID=\$!

echo "✅ Monitoring started (API PID: \$API_PID, Monitor PID: \$MONITOR_PID)"
echo "Press Ctrl+C to stop"

trap "kill \$API_PID \$MONITOR_PID; echo '🛑 Monitoring stopped'; exit" INT

wait
EOF

chmod +x start_monitoring.sh

# Create monitoring stop script
cat > stop_monitoring.sh << EOF
#!/bin/bash
echo "🛑 Stopping Taurus AI Corp. Monitoring..."

# Kill monitoring processes
pkill -f "monitor.py"
pkill -f "api.py"

echo "✅ Monitoring stopped"
EOF

chmod +x stop_monitoring.sh

# Create monitoring logs
touch monitoring/logs/taurus_monitor.log
touch monitoring/logs/taurus_api.log

echo "✅ Monitoring setup complete!"
echo ""
echo "🚀 To start monitoring:"
echo "   ./start_monitoring.sh"
echo ""
echo "🛑 To stop monitoring:"
echo "   ./stop_monitoring.sh"
echo ""
echo "📊 Access dashboard:"
echo "   http://localhost:8080"
echo ""
echo "📈 API endpoint:"
echo "   http://localhost:8080/api/status"
