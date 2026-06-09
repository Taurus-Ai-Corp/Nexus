# Canva MCP Server

Canva MCP server for TAURUS AI ecosystem - Design creation and management.

## Features

- Create designs (presets and custom dimensions)
- Manage assets and templates
- Edit and update designs
- Publish and download designs
- Full integration with TAURUS AI agent system

## Installation

```bash
npm install
```

## Configuration

Set `CANVA_API_KEY` environment variable:

```bash
export CANVA_API_KEY=your-canva-api-key-here
export CANVA_API_BASE_URL=https://api.canva.com/rest/v1
```

## Usage

The server is automatically registered in the MCP registry and available to all agents.

## Tools

- `canva_create_design` - Create new designs
- `canva_add_asset` - Add assets to designs
- `canva_list_designs` - List all designs
- `canva_get_design` - Get design details
- `canva_update_design` - Update designs
- `canva_publish_design` - Publish designs
- `canva_list_templates` - Browse templates
- `canva_download_design` - Download designs

## Documentation

See main integration guide: `docs/GAMMA_CANVA_MCP_INTEGRATION.md`

