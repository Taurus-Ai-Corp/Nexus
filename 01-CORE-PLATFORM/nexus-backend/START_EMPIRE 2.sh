#!/bin/bash
# 🏰 TAURUS AI CORP. - QUICK START SCRIPT
# This script launches your empire without terminal issues

echo "🚀 LAUNCHING TAURUS AI EMPIRE"
echo "============================="

cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/BizFlow-Orchestrator"

# Activate virtual environment
source venv/bin/activate

# Start the empire
python -m uvicorn registry.server:app --host 0.0.0.0 --port 8000 --reload
