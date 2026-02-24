# SurfSense Agent Deployment - Quick Start Guide

## TL;DR - Get Started in 3 Minutes

### 1. Install Requirements (30 seconds)
```bash
brew install jq  # macOS
# or
sudo apt-get install jq  # Linux
```

### 2. Make Scripts Executable (10 seconds)
```bash
cd /Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/TAURUS-BUSINESS-INTELLIGENCE-HUB/TAURUS\ AI\ CORP/NeoVibe-Vibe_Marketing_Studio/agents/deployment
chmod +x *.sh
```

### 3. Deploy All Agents (2 minutes)
```bash
./deploy_all.sh
```

That's it! All 10 agents are now running.

---

## Essential Commands

### Deployment
```bash
./deploy_all.sh              # Deploy all 10 agents
./deploy_all.sh main         # Deploy 5 main agents only
./deploy_all.sh sub          # Deploy 5 sub-agents only
```

### Management
```bash
./launch_agent.sh <name>     # Start single agent
./stop_agent.sh <name>       # Stop single agent
./restart_agent.sh <name>    # Restart single agent
./stop_all.sh                # Stop all agents
```

### Monitoring
```bash
./status.sh                  # Full status report
./status.sh brief            # Quick summary
./status.sh urls             # Show access URLs
```

---

## Agent Names (for commands)

### Main Agents
- `deep_researcher`
- `arxiv_researcher`
- `candidate_analyzer`
- `trend_analyzer`
- `price_monitor`

### Sub-Agents
- `startup_validator`
- `blog_writer`
- `newsletter_generator`
- `social_media_manager`
- `job_finder`

---

## Access URLs

Once deployed, access agents at:

| Agent | URL |
|-------|-----|
| Deep Researcher | http://localhost:8501 |
| ArXiv Researcher | http://localhost:8502 |
| Candidate Analyzer | http://localhost:8503 |
| Trend Analyzer | http://localhost:8504 |
| Price Monitor | http://localhost:8505 |
| Startup Validator | http://localhost:8506 |
| Blog Writer | http://localhost:8507 |
| Newsletter Generator | http://localhost:8508 |
| Social Media Manager | http://localhost:8509 |
| Job Finder | http://localhost:8510 |

---

## Common Issues & Fixes

### Issue: "Port already in use"
```bash
# Find what's using the port
lsof -i :8501

# Kill it
kill -9 $(lsof -t -i:8501)

# Restart agent
./restart_agent.sh deep_researcher
```

### Issue: "Agent won't start"
```bash
# Check logs
cat logs/deep_researcher.log

# Check if dependencies are installed
cd /path/to/agent
pip list
```

### Issue: "Missing API key"
```bash
# Set environment variable
export NEBIUS_API_KEY="your_key_here"

# Restart agent
./restart_agent.sh <agent_name>
```

---

## Environment Variables Quick Setup

Create a file `~/.surfsense_env` with your API keys:

```bash
# Core APIs
export NEBIUS_API_KEY="your_key"
export OPENAI_API_KEY="your_key"
export TAVILY_API_KEY="your_key"
export SCRAPEGRAPH_API_KEY="your_key"
export FIRECRAWL_API_KEY="your_key"

# Additional APIs (optional)
export GROQ_API_KEY="your_key"
export EXA_API_KEY="your_key"
export GOOGLE_API_KEY="your_key"
export COMPOSIO_API_KEY="your_key"
export BRIGHT_DATA_API_KEY="your_key"
```

Then source it before deploying:
```bash
source ~/.surfsense_env
./deploy_all.sh
```

---

## Example Workflows

### Scenario 1: Deploy All Agents
```bash
chmod +x *.sh
./deploy_all.sh
./status.sh
# Visit http://localhost:8501-8510
```

### Scenario 2: Deploy Only Research Agents
```bash
./deploy_all.sh research
./status.sh urls
```

### Scenario 3: Restart Problematic Agent
```bash
./status.sh              # Identify problem
./restart_agent.sh price_monitor
tail -f logs/price_monitor.log
```

### Scenario 4: Stop Everything & Clean Up
```bash
./stop_all.sh
rm -rf logs/* pids/*
```

---

## One-Liner Deployment

```bash
cd /Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/TAURUS-BUSINESS-INTELLIGENCE-HUB/TAURUS\ AI\ CORP/NeoVibe-Vibe_Marketing_Studio/agents/deployment && chmod +x *.sh && ./deploy_all.sh
```

---

## Getting Help

```bash
./deploy_all.sh help      # Deployment options
./status.sh help          # Status options
./launch_agent.sh         # List available agents
```

For full documentation, see `README.md`

---

## Emergency Stop

If something goes wrong:
```bash
./stop_all.sh
killall -9 streamlit  # Nuclear option
```

---

## Success Indicators

After deployment, you should see:
- ✅ 10/10 agents deployed successfully
- ✅ All ports 8501-8510 active
- ✅ All PIDs in pids/ directory
- ✅ All logs in logs/ directory
- ✅ All URLs accessible in browser

Verify with:
```bash
./status.sh
```

---

**Ready to deploy? Run: `./deploy_all.sh`**