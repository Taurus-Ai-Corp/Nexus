# 🎨 Taurus AI MCP Agents for UI/UX Design

Professional MCP (Model Context Protocol) agents designed to enhance your UI/UX design workflow in Cursor and Claude.

## 🚀 **Available Agents**

### 1. **Figma MCP** - Design Integration
- **Access Figma files** directly from your AI assistant
- **Extract design tokens** and styles automatically
- **Generate code** from Figma designs
- **Export images** and assets

**Commands:**
- `get_figma_file` - Load Figma file content
- `extract_design_tokens` - Extract design tokens from Figma
- `get_components` - Get component information
- `export_images` - Export images from Figma

### 2. **Design Tokens MCP** - Design System Management
- **Generate CSS variables** from design tokens
- **Create SCSS variables** for advanced styling
- **Export JavaScript tokens** for dynamic theming
- **Validate token structure** for consistency

**Commands:**
- `generate_css_variables` - Create CSS custom properties
- `generate_scss_variables` - Generate SCSS variables
- `generate_js_tokens` - Export JavaScript tokens
- `validate_tokens` - Validate token structure
- `merge_tokens` - Combine multiple token files

### 3. **Tailwind CSS MCP** - Rapid UI Development
- **Generate components** with Tailwind classes
- **Suggest optimal classes** for your needs
- **Optimize class combinations** for performance
- **Create responsive designs** automatically

**Commands:**
- `generate_component` - Create UI components
- `suggest_classes` - Get class recommendations
- `optimize_classes` - Optimize class usage
- `generate_config` - Create Tailwind config
- `responsive_design` - Add responsive classes

### 4. **Component Library MCP** - Professional Components
- **Access pre-built components** for common UI patterns
- **Generate React/Vue components** with best practices
- **Ensure accessibility** compliance
- **Maintain design consistency**

**Commands:**
- `get_component` - Retrieve component templates
- `generate_variant` - Create component variants
- `validate_accessibility` - Check accessibility
- `export_component` - Export components

### 5. **Icon & Assets MCP** - Asset Management
- **Manage icon libraries** (Heroicons, Lucide, etc.)
- **Optimize SVG files** for web use
- **Generate icon components** for your framework
- **Handle asset optimization** and delivery

**Commands:**
- `get_icon` - Retrieve icon assets
- `optimize_svg` - Optimize SVG files
- `generate_component` - Create icon components
- `export_assets` - Export optimized assets

## 🔧 **Installation**

1. **Clone the repository:**
   ```bash
   cd mcp-agents
   chmod +x install-mcp-agents.sh
   ./install-mcp-agents.sh
   ```

2. **Configure Cursor:**
   - Copy the contents of `cursor-mcp-config.json`
   - Paste into your Cursor settings (Cmd/Ctrl + Shift + P → "Preferences: Open Settings (JSON)")
   - Replace `your_figma_token_here` with your actual Figma access token

3. **Set up environment variables:**
   ```bash
   export FIGMA_ACCESS_TOKEN="your_actual_token"
   export DESIGN_TOKENS_PATH="/path/to/your/tokens"
   ```

## 📱 **Usage Examples**

### **Generate a Button Component:**
```
@tailwind generate_component button variant=primary size=lg icon=true
```

### **Extract Design Tokens:**
```
@figma extract_design_tokens fileKey=abc123
```

### **Create CSS Variables:**
```
@design-tokens generate_css_variables theme=dark
```

### **Get Icon Component:**
```
@icons get_icon name=arrow-right framework=react
```

## 🎯 **Best Practices**

1. **Start with Figma MCP** for design-to-code workflow
2. **Use Design Tokens MCP** for consistent styling
3. **Leverage Tailwind MCP** for rapid development
4. **Access Component Library MCP** for professional components
5. **Manage assets with Icon & Assets MCP**

## 🔒 **Security Notes**

- Keep your Figma access token secure
- Don't commit tokens to version control
- Use environment variables for sensitive data
- Regularly rotate access tokens

## 🚀 **Getting Started**

1. **Test the agents:**
   ```bash
   cd figma-mcp && npm start
   cd ../design-tokens-mcp && npm start
   cd ../tailwind-mcp && npm start
   ```

2. **Integrate with your workflow:**
   - Use in Cursor for AI-assisted design
   - Integrate with Claude for design discussions
   - Automate design token generation
   - Streamline component creation

## 📞 **Support**

For issues or questions:
- Check the individual agent directories for specific documentation
- Review the MCP protocol documentation
- Ensure all dependencies are properly installed

---

**Built with ❤️ by Taurus AI Corp**







