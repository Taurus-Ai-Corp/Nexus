# 🚀 Taurus AI Corp. - Quick Start Guide

## 📁 **Your New Workspace Structure**
```
/Users/user/Documents/Taurus AI Corp./Cursor:Claude/
├── Taurus-AI-Agent-Registry/     # AI agents for marketing & local AI
├── BizFlow/                      # AI marketing campaigns & business flow
├── navigate.sh                   # Navigation script
└── quick-start.md               # This guide
```

## ⚡ **Quick Navigation Commands**

### **From Any Terminal:**
```bash
# Navigate to your workspace
cd "/Users/user/Documents/Taurus AI Corp./Cursor:Claude"

# Use the navigation script
source navigate.sh help           # Show all options
source navigate.sh taurus         # Go to Taurus AI Registry
source navigate.sh bizflow        # Go to BizFlow
source navigate.sh status         # Show project status
source navigate.sh test-all       # Test all projects
```

### **Shortcuts (add to your ~/.zshrc or ~/.bashrc):**
```bash
# Add these lines to your shell profile
alias taurus='cd "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/Taurus-AI-Agent-Registry"'
alias bizflow='cd "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/BizFlow"'
alias workspace='cd "/Users/user/Documents/Taurus AI Corp./Cursor:Claude"'
alias nav='source "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/navigate.sh"'
```

## 🧪 **Testing Your Projects**

### **Test Taurus AI Agent Registry:**
```bash
cd "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/Taurus-AI-Agent-Registry"
cd agents
python3 test_agents.py           # Test all agents
python3 demo_agents.py           # Run interactive demo
```

### **Test BizFlow:**
```bash
cd "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/BizFlow"
python3 test_models.py           # Test AI models
python3 test_campaign.py         # Run test campaigns
```

## 🎯 **What Each Project Does**

### **Taurus AI Agent Registry**
- **Vibe Marketing Agent**: Creates culturally-aware marketing content
- **Ollama Local Agent**: Provides local AI capabilities
- **Agent Registry**: Manages all AI agents centrally
- **Use Cases**: Marketing content, local AI development, content generation

### **BizFlow**
- **AI Marketing Campaigns**: Automated campaign generation
- **Market Research**: AI-powered competitive analysis
- **Business Intelligence**: Data-driven marketing insights
- **Use Cases**: Marketing campaigns, market research, business strategy

## 🔧 **Setup Instructions**

### **1. Add Aliases to Your Shell Profile:**
```bash
# Open your shell profile
nano ~/.zshrc  # or ~/.bashrc

# Add these lines:
alias taurus='cd "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/Taurus-AI-Agent-Registry"'
alias bizflow='cd "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/BizFlow"'
alias workspace='cd "/Users/user/Documents/Taurus AI Corp./Cursor:Claude"'
alias nav='source "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/navigate.sh"'

# Save and reload
source ~/.zshrc  # or source ~/.bashrc
```

### **2. Test Everything:**
```bash
# Test all projects
workspace
nav test-all

# Test individual projects
taurus && cd agents && python3 test_agents.py
bizflow && python3 test_campaign.py
```

## 🚀 **Daily Workflow**

### **Morning Setup:**
```bash
workspace                    # Go to main workspace
nav status                  # Check project status
```

### **Working on Taurus AI:**
```bash
taurus                      # Go to Taurus AI Registry
cd agents                   # Enter agents directory
python3 demo_agents.py      # Run demo
```

### **Working on BizFlow:**
```bash
bizflow                     # Go to BizFlow
python3 test_campaign.py    # Run campaigns
```

### **Quick Testing:**
```bash
nav test-all               # Test everything at once
```

## 📱 **Cursor IDE Setup**

1. **Open Cursor**
2. **File → Open Folder**
3. **Navigate to**: `/Users/user/Documents/Taurus AI Corp./Cursor:Claude`
4. **Select the folder and click "Open"**

Now you have both projects in one Cursor workspace!

## 🆘 **Troubleshooting**

### **Navigation Script Not Working:**
```bash
# Make sure it's executable
chmod +x "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/navigate.sh"

# Test it
source "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/navigate.sh" help
```

### **Projects Not Found:**
```bash
# Check if directories exist
ls -la "/Users/user/Documents/Taurus AI Corp./Cursor:Claude/"

# Verify paths are correct
pwd
```

### **Python Issues:**
```bash
# Check Python version
python3 --version

# Install requirements
cd Taurus-AI-Agent-Registry
pip3 install -r requirements.txt
```

## 🎉 **You're All Set!**

Your Taurus AI Corp. workspace is now:
- ✅ **Organized**: Clean, logical structure
- ✅ **Accessible**: Easy navigation commands
- ✅ **Tested**: All projects working
- ✅ **Documented**: Clear usage instructions

**Happy coding! 🚀**
