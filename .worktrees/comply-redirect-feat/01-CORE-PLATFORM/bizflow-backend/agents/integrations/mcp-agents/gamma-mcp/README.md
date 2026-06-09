# Gamma MCP Server

Gamma AI MCP server for TAURUS AI ecosystem - AI-powered content generation.

## Features

- Generate presentations, documents, webpages, and social posts
- Manage and update generations
- Publish content to Gamma platform
- Full integration with TAURUS AI agent system

## Installation

```bash
npm install
```

## Configuration

Set `GAMMA_API_KEY` environment variable:

```bash
export GAMMA_API_KEY=sk-gamma-your-api-key-here
```

## Usage

The server is automatically registered in the MCP registry and available to all agents.

## Tools

- `gamma_generate_presentation` - Create presentations
- `gamma_generate_document` - Generate documents
- `gamma_generate_webpage` - Create webpages
- `gamma_generate_social_post` - Generate social posts
- `gamma_get_generation_status` - Check status
- `gamma_list_generations` - List all generations
- `gamma_update_generation` - Update generations
- `gamma_publish_generation` - Publish content

## Documentation

See main integration guide: `docs/GAMMA_CANVA_MCP_INTEGRATION.md`

