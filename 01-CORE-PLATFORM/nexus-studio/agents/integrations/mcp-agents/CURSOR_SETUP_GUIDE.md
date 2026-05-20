# Cursor MCP Setup Guide

## Overview
This guide shows how to set up and use the Taurus AI MCP agents with Cursor IDE.

## Available Agents

### 1. Figma MCP Agent
- **Purpose**: Access and extract design data from Figma files
- **Tools**: 
  - `get_figma_file` - Load Figma file metadata
  - `extract_design_tokens` - Extract design tokens from Figma
  - `get_components` - Get component information
- **Requirements**: FIGMA_ACCESS_TOKEN environment variable

### 2. Tailwind MCP Agent  
- **Purpose**: Generate and optimize Tailwind CSS classes
- **Tools**:
  - `generate_component` - Generate UI components with Tailwind classes
  - `suggest_classes` - Suggest optimal Tailwind classes
  - `optimize_classes` - Optimize class combinations

### 3. Design Tokens MCP Agent
- **Purpose**: Generate and validate design tokens
- **Tools**:
  - `generate_css_variables` - Convert tokens to CSS custom properties
  - `generate_scss_variables` - Convert tokens to SCSS variables
  - `generate_js_tokens` - Export tokens for JavaScript
  - `validate_tokens` - Validate token structure

### 4. Component Library MCP Agent
- **Purpose**: Generate and manage UI components
- **Tools**:
  - `get_component` - Retrieve component templates
  - `generate_variant` - Create component variants
  - `validate_accessibility` - Check accessibility compliance

### 5. Icon Assets MCP Agent
- **Purpose**: Manage and optimize icon assets
- **Tools**:
  - `get_icon` - Retrieve icons from library
  - `optimize_svg` - Optimize SVG files
  - `generate_component` - Create icon components

## Cursor Setup

### Step 1: Configure MCP in Cursor
1. Open Cursor IDE settings
2. Navigate to MCP (Model Context Protocol) settings
3. Add the configuration from `cursor-mcp-config.json`

### Step 2: Environment Variables (Optional)
If using the Figma agent, set your Figma access token:
```bash
export FIGMA_ACCESS_TOKEN="your_figma_token_here"
```

### Step 3: Manual Agent Testing
You can test individual agents using the MCP protocol:

```bash
# Test Tailwind agent
cd tailwind-mcp
echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {"tools": {}}, "clientInfo": {"name": "test", "version": "1.0.0"}}}' | node index.js

# Test Design Tokens agent  
cd design-tokens-mcp
echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {"tools": {}}, "clientInfo": {"name": "test", "version": "1.0.0"}}}' | node index.js
```

## Usage Examples

### Using Tailwind Agent
Ask Cursor:
- "Generate a primary button component using Tailwind classes"
- "Suggest Tailwind classes for a responsive card layout"
- "Optimize these Tailwind classes: bg-red-500 text-white p-4 m-2"

### Using Design Tokens Agent
Ask Cursor:
- "Generate CSS custom properties for my light theme"
- "Convert my design tokens to SCSS variables"
- "Validate this token structure: {...}"

### Using Component Library Agent
Ask Cursor:
- "Get the button component template for React"
- "Create a secondary variant of the card component"
- "Check the accessibility of this component code"

### Using Icon Assets Agent
Ask Cursor:
- "Get the home icon in React format"
- "Optimize this SVG icon: <svg>...</svg>"
- "Create an icon component for Vue.js"

## Troubleshooting

### Agents Not Starting
- Ensure Node.js is installed and accessible
- Check that all dependencies are installed: `npm install`
- Verify file paths in the Cursor configuration are correct

### No Response from Agents  
- Check that the MCP protocol is properly configured in Cursor
- Verify agents are running with proper MCP protocol support
- Test individual agents manually using the commands above

### Environment Variables Not Working
- Make sure environment variables are set before starting Cursor
- For Figma integration, obtain a valid access token from Figma Developer Settings

## Status
✅ All MCP agents are fixed and working with proper MCP protocol support
✅ Cursor configuration is ready for use
✅ Individual agent testing confirmed working