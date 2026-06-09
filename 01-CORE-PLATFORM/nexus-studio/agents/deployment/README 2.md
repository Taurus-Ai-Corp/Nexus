# SurfSense Knowledge System - Agent Deployment Infrastructure

Complete deployment infrastructure for managing 10 AI agents (5 main agents + 5 sub-agents) in the SurfSense Knowledge System.

## Overview

This deployment system provides enterprise-grade orchestration for:

### Main Agents (5)
1. **Deep Researcher** (Port 8501) - Multi-stage research workflow with Agno and Scrapegraph
2. **ArXiv Researcher** (Port 8502) - Research agent with persistent memory for arXiv papers
3. **Candidate Analyzer** (Port 8503) - AI-powered candidate analysis and hiring assistant
4. **Trend Analyzer** (Port 8504) - Market trend analysis using multiple search APIs
5. **Price Monitor** (Port 8505) - Product price tracking with notifications

### Sub-Agents (5)
6. **Startup Validator** (Port 8506) - AI-powered startup idea validator
7. **Blog Writer** (Port 8507) - AI blog writing with style analysis
8. **Newsletter Generator** (Port 8508) - Professional newsletter generation
9. **Social Media Manager** (Port 8509) - Twitter automation with style matching
10. **Job Finder** (Port 8510) - LinkedIn profile analyzer and job search

## Quick Start

### 1. Install Dependencies

```bash
# Install jq (JSON processor)
# macOS:
brew install jq

# Linux:
sudo apt-get install jq
```

### 2. Make Scripts Executable

```bash
cd /Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/TAURUS-BUSINESS-INTELLIGENCE-HUB/TAURUS\ AI\ CORP/Nexus-Vibe_Marketing_Studio/agents/deployment

chmod +x *.sh
```

### 3. Set Environment Variables

Create a `.env` file or export required variables:

```bash
# Core APIs
export NEBIUS_API_KEY="your_key"
export OPENAI_API_KEY="your_key"

# Research Agents
export TAVILY_API_KEY="your_key"
export SCRAPEGRAPH_API_KEY="your_key"
export FIRECRAWL_API_KEY="your_key"
export EXA_API_KEY="your_key"
export GOOGLE_API_KEY="your_key"
export GROQ_API_KEY="your_key"

# Content Agents
export DIGITAL_OCEAN_ENDPOINT="your_endpoint"
export DIGITAL_OCEAN_AGENT_ACCESS_KEY="your_key"
export COMPOSIO_API_KEY="your_key"
export SGAI_API_KEY="your_key"

# Business Agents
export TWILIO_ACCOUNT_SID="your_sid"
export TWILIO_AUTH_TOKEN="your_token"
export TWILIO_PHONE_NUMBER="your_number"
export TWILIO_WHATSAPP_NUMBER="your_number"
export BRIGHT_DATA_API_KEY="your_key"
```

### 4. Deploy Agents

```bash
# Deploy all 10 agents
./deploy_all.sh

# Deploy only main agents (5)
./deploy_all.sh main

# Deploy only sub-agents (5)
./deploy_all.sh sub

# Deploy by category
./deploy_all.sh research   # Research agents
./deploy_all.sh business   # Business agents
./deploy_all.sh content    # Content agents
```

## Individual Agent Management

### Launch Single Agent

```bash
./launch_agent.sh <agent_name>

# Examples:
./launch_agent.sh deep_researcher
./launch_agent.sh arxiv_researcher
./launch_agent.sh blog_writer
```

### Stop Single Agent

```bash
./stop_agent.sh <agent_name>

# Examples:
./stop_agent.sh deep_researcher
./stop_agent.sh price_monitor
```

### Restart Single Agent

```bash
./restart_agent.sh <agent_name>

# Examples:
./restart_agent.sh social_media_manager
./restart_agent.sh job_finder
```

## Bulk Operations

### Stop All Agents

```bash
./stop_all.sh
```

### Check Agent Status

```bash
# Detailed status
./status.sh

# Brief summary
./status.sh brief

# Show only URLs
./status.sh urls
```

## Port Configuration

All agents run on consecutive ports starting from 8501:

| Port | Agent | Category |
|------|-------|----------|
| 8501 | Deep Researcher | Research |
| 8502 | ArXiv Researcher | Research |
| 8503 | Candidate Analyzer | Research |
| 8504 | Trend Analyzer | Research |
| 8505 | Price Monitor | Business |
| 8506 | Startup Validator | Business |
| 8507 | Blog Writer | Content |
| 8508 | Newsletter Generator | Content |
| 8509 | Social Media Manager | Content |
| 8510 | Job Finder | Automation |

## Directory Structure

```
deployment/
├── agent_config.json          # Agent configuration database
├── deploy_all.sh             # Master deployment script
├── launch_agent.sh           # Individual agent launcher
├── stop_agent.sh             # Individual agent stopper
├── stop_all.sh               # Stop all agents
├── restart_agent.sh          # Restart individual agent
├── status.sh                 # Agent status monitor
├── logs/                     # Agent logs (auto-created)
│   ├── deep_researcher.log
│   ├── arxiv_researcher.log
│   └── ...
└── pids/                     # Process ID files (auto-created)
    ├── deep_researcher.pid
    ├── arxiv_researcher.pid
    └── ...
```

## Configuration File

The `agent_config.json` file contains complete configuration for all agents:

```json
{
  "agents": {
    "agent_name": {
      "name": "Display Name",
      "path": "/absolute/path/to/agent",
      "app_file": "app.py",
      "port": 8501,
      "type": "main|sub",
      "category": "research|business|content|automation",
      "dependencies": ["package1", "package2"],
      "env_vars": ["VAR1", "VAR2"],
      "description": "Agent description"
    }
  }
}
```

## Agent Dependencies

### Common Dependencies
- `streamlit` - Web UI framework
- `python-dotenv` - Environment variable management
- `openai` - OpenAI API integration

### Research Agents
- `agno` - Agent framework
- `scrapegraph-py` - Web scraping
- `tavily-python` - Search API
- `memorisdk` - Memory persistence
- `google-adk` - Google Agent Development Kit
- `exa-py`, `firecrawl-py` - Additional search tools

### Business Agents
- `crewai` - Multi-agent orchestration
- `twilio` - SMS/WhatsApp notifications
- `scrapegraphai` - Advanced scraping

### Content Agents
- `composio` - Social media automation
- `pypdf`, `python-docx` - Document processing
- `langchain-*` - Language model chains

## Troubleshooting

### Port Already in Use

```bash
# Check what's using a port
lsof -i :8501

# Kill process on port
kill -9 $(lsof -t -i:8501)
```

### Agent Won't Start

1. Check logs: `cat logs/<agent_name>.log`
2. Verify dependencies: `cd <agent_path> && pip list`
3. Check environment variables: `env | grep API_KEY`
4. Try manual start: `cd <agent_path> && streamlit run app.py`

### Missing Dependencies

```bash
# Navigate to agent directory
cd /path/to/agent

# Install from requirements.txt
pip install -r requirements.txt

# Or install from pyproject.toml
pip install -e .
```

### Virtual Environment Issues

```bash
# Create new virtual environment
cd /path/to/agent
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # or pip install -e .
```

## Monitoring & Logs

### View Real-time Logs

```bash
# Follow logs for specific agent
tail -f logs/deep_researcher.log

# Follow all logs
tail -f logs/*.log
```

### Check System Resources

```bash
# View detailed status with resource usage
./status.sh

# Monitor specific agent
ps aux | grep streamlit
```

### Log Rotation

Logs can grow large. Consider setting up log rotation:

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/surfsense-agents

# Add configuration:
/path/to/deployment/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
```

## Advanced Usage

### Custom Port Configuration

Edit `agent_config.json` to change ports:

```json
{
  "agents": {
    "deep_researcher": {
      "port": 9001  // Change to custom port
    }
  }
}
```

### Deploy with Custom Environment

```bash
# Create agent-specific .env file
cd /path/to/agent
nano .env

# Deploy with custom settings
./launch_agent.sh <agent_name>
```

### Automated Deployment

Add to crontab for auto-restart:

```bash
# Edit crontab
crontab -e

# Add entry (restart all agents at 3 AM)
0 3 * * * cd /path/to/deployment && ./stop_all.sh && ./deploy_all.sh
```

## Performance Optimization

### Memory Management

- Each Streamlit agent typically uses 100-300MB RAM
- Total expected usage: 1-3GB for all 10 agents
- Monitor with: `./status.sh`

### CPU Usage

- Agents are generally I/O bound (API calls)
- High CPU usage indicates active processing
- Use `htop` or `top` to monitor

### Network Optimization

- Configure connection pooling for API clients
- Implement request rate limiting
- Use caching where appropriate

## Security Considerations

1. **API Keys**: Never commit `.env` files
2. **Port Security**: Use firewall rules to restrict access
3. **HTTPS**: Consider reverse proxy with SSL for production
4. **Authentication**: Add Streamlit authentication if exposing publicly

## Integration with TAURUS System

This deployment infrastructure integrates with:

- **TAURUS AI Memory Vault**: Agent state persistence
- **CEO Command System**: Executive orchestration
- **BizFlow AI**: Business intelligence pipeline
- **Nexus Platform**: Content generation workflows

## Support & Maintenance

### Health Checks

```bash
# Quick health check
./status.sh brief

# Detailed diagnostics
./status.sh
```

### Backup Configuration

```bash
# Backup PIDs and logs
tar -czf backup-$(date +%Y%m%d).tar.gz pids/ logs/ agent_config.json
```

### Updates

```bash
# Update agent dependencies
cd /path/to/agent
git pull  # if using git
pip install --upgrade -r requirements.txt
```

## Contact & Documentation

- **Developer**: TAURUS AI Engineering Team
- **Documentation**: See individual agent README files
- **Issues**: Report to TAURUS Business Intelligence Hub

## License

Copyright 2025 TAURUS AI CORP. All rights reserved.

---

**Note**: This deployment system is designed for the SurfSense Knowledge System and integrates with the broader TAURUS AI ecosystem. For production deployment, consider containerization with Docker and orchestration with Kubernetes.