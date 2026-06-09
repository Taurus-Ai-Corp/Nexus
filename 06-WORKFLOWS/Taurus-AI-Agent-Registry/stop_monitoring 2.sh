#!/bin/bash
echo "🛑 Stopping Taurus AI Corp. Monitoring..."

# Kill monitoring processes
pkill -f "monitor.py"
pkill -f "api.py"

echo "✅ Monitoring stopped"
