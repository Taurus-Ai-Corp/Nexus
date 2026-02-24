#!/bin/bash
# 🚀 Taurus AI Corp. - Workspace Setup Script
# Automatically configures your development environment

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏰 Setting up Taurus AI Corp. Workspace...${NC}"
echo "=================================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$SCRIPT_DIR"

echo -e "${YELLOW}📍 Workspace Directory:${NC} $WORKSPACE_DIR"
echo ""

# Function to add aliases to shell profile
setup_aliases() {
    echo -e "${YELLOW}🔧 Setting up shell aliases...${NC}"
    
    # Determine shell profile
    if [[ "$SHELL" == *"zsh"* ]]; then
        PROFILE_FILE="$HOME/.zshrc"
        SHELL_NAME="zsh"
    elif [[ "$SHELL" == *"bash"* ]]; then
        PROFILE_FILE="$HOME/.bashrc"
        SHELL_NAME="bash"
    else
        echo -e "${RED}❌ Unsupported shell: $SHELL${NC}"
        return 1
    fi
    
    echo -e "${BLUE}Using $SHELL_NAME profile: $PROFILE_FILE${NC}"
    
    # Check if aliases already exist
    if grep -q "alias taurus=" "$PROFILE_FILE"; then
        echo -e "${YELLOW}⚠️ Aliases already exist in $PROFILE_FILE${NC}"
    else
        # Add aliases
        echo "" >> "$PROFILE_FILE"
        echo "# 🏰 Taurus AI Corp. Workspace Aliases" >> "$PROFILE_FILE"
        echo "alias taurus='cd \"$WORKSPACE_DIR/Taurus-AI-Agent-Registry\"'" >> "$PROFILE_FILE"
        echo "alias bizflow='cd \"$WORKSPACE_DIR/BizFlow\"'" >> "$PROFILE_FILE"
        echo "alias workspace='cd \"$WORKSPACE_DIR\"'" >> "$PROFILE_FILE"
        echo "alias nav='source \"$WORKSPACE_DIR/navigate.sh\"'" >> "$PROFILE_FILE"
        echo "" >> "$PROFILE_FILE"
        
        echo -e "${GREEN}✅ Aliases added to $PROFILE_FILE${NC}"
        echo -e "${BLUE}💡 Run 'source $PROFILE_FILE' to activate aliases${NC}"
    fi
}

# Function to test navigation script
test_navigation() {
    echo -e "${YELLOW}🧪 Testing navigation script...${NC}"
    
    if [ -f "$WORKSPACE_DIR/navigate.sh" ]; then
        echo -e "${GREEN}✅ Navigation script found${NC}"
        
        # Test basic functionality
        cd "$WORKSPACE_DIR"
        if source navigate.sh status > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Navigation script working${NC}"
        else
            echo -e "${RED}❌ Navigation script has issues${NC}"
        fi
    else
        echo -e "${RED}❌ Navigation script not found${NC}"
    fi
}

# Function to test projects
test_projects() {
    echo -e "${YELLOW}🧪 Testing projects...${NC}"
    
    # Test Taurus AI Agent Registry
    if [ -d "$WORKSPACE_DIR/Taurus-AI-Agent-Registry" ]; then
        echo -e "${GREEN}✅ Taurus AI Agent Registry found${NC}"
        
        # Quick test
        cd "$WORKSPACE_DIR/Taurus-AI-Agent-Registry/agents"
        if [ -f "test_agents.py" ]; then
            echo -e "${GREEN}✅ Test file found${NC}"
        else
            echo -e "${YELLOW}⚠️ Test file not found${NC}"
        fi
    else
        echo -e "${RED}❌ Taurus AI Agent Registry not found${NC}"
    fi
    
    # Test BizFlow
    if [ -d "$WORKSPACE_DIR/BizFlow" ]; then
        echo -e "${GREEN}✅ BizFlow project found${NC}"
        
        # Quick test
        cd "$WORKSPACE_DIR/BizFlow"
        if [ -f "test_campaign.py" ]; then
            echo -e "${GREEN}✅ Test file found${NC}"
        else
            echo -e "${YELLOW}⚠️ Test file not found${NC}"
        fi
    else
        echo -e "${RED}❌ BizFlow project not found${NC}"
    fi
}

# Function to create Cursor workspace instructions
create_cursor_instructions() {
    echo -e "${YELLOW}📱 Creating Cursor workspace instructions...${NC}"
    
    INSTRUCTIONS_FILE="$WORKSPACE_DIR/CURSOR_SETUP.md"
    
    cat > "$INSTRUCTIONS_FILE" << 'EOF'
# 🖥️ Cursor IDE Setup Instructions

## 🚀 **Quick Setup (Recommended)**

1. **Open Cursor**
2. **File → Open Folder**
3. **Navigate to**: `/Users/user/Documents/Taurus AI Corp./Cursor:Claude`
4. **Select the folder and click "Open"**

## 🎯 **Alternative: Use Workspace File**

1. **Open Cursor**
2. **File → Open Workspace from File...**
3. **Select**: `taurus-workspace.code-workspace`
4. **Click "Open"**

## ✨ **What You'll Get**

- **Multi-project workspace** with both Taurus AI and BizFlow
- **Organized file structure** with clear project separation
- **Integrated terminal** starting in your workspace
- **Python support** with linting and formatting
- **Git integration** for version control

## 🔧 **Workspace Features**

- **Taurus AI Agent Registry**: AI agents and marketing content
- **BizFlow**: AI marketing campaigns and business intelligence
- **Shared navigation**: Easy switching between projects
- **Unified settings**: Consistent development environment

## 🎉 **You're Ready!**

Your Taurus AI Corp. workspace is now fully configured in Cursor!
EOF

    echo -e "${GREEN}✅ Cursor setup instructions created: $INSTRUCTIONS_FILE${NC}"
}

# Main setup process
main() {
    echo -e "${BLUE}🚀 Starting workspace setup...${NC}"
    echo ""
    
    # Setup aliases
    setup_aliases
    echo ""
    
    # Test navigation
    test_navigation
    echo ""
    
    # Test projects
    test_projects
    echo ""
    
    # Create Cursor instructions
    create_cursor_instructions
    echo ""
    
    # Final summary
    echo -e "${GREEN}🎉 Workspace Setup Complete!${NC}"
    echo "=================================================="
    echo ""
    echo -e "${BLUE}📁 Your workspace is located at:${NC}"
    echo "   $WORKSPACE_DIR"
    echo ""
    echo -e "${BLUE}⚡ Quick commands (after reloading shell):${NC}"
    echo "   • taurus      # Go to Taurus AI Registry"
    echo "   • bizflow     # Go to BizFlow"
    echo "   • workspace   # Go to main workspace"
    echo "   • nav         # Use navigation script"
    echo ""
    echo -e "${BLUE}📱 To open in Cursor:${NC}"
    echo "   • File → Open Folder → $WORKSPACE_DIR"
    echo "   • Or use: taurus-workspace.code-workspace"
    echo ""
    echo -e "${YELLOW}💡 Next steps:${NC}"
    echo "   1. Reload your shell: source ~/.zshrc (or ~/.bashrc)"
    echo "   2. Open Cursor and navigate to this workspace"
    echo "   3. Test everything: nav test-all"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

# Run main setup
main
