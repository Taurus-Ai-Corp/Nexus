#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class NotionMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'notion-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_page',
            description: 'Create a new Notion page',
            inputSchema: {
              type: 'object',
              properties: {
                parentId: { type: 'string', description: 'Parent page or database ID' },
                title: { type: 'string', description: 'Page title' },
                content: { type: 'string', description: 'Page content' },
              },
              required: ['parentId', 'title'],
            },
          },
          {
            name: 'search_pages',
            description: 'Search for Notion pages',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
                limit: { type: 'number', description: 'Maximum number of results', default: 10 },
              },
              required: ['query'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_page':
            return {
              content: [
                {
                  type: 'text',
                  text: `Notion MCP: Would create page "${args.title}" in parent ${args.parentId}`,
                },
              ],
            };

          case 'search_pages':
            return {
              content: [
                {
                  type: 'text',
                  text: `Notion MCP: Would search for "${args.query}" (limit: ${args.limit || 10})`,
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Notion MCP server running on stdio');
  }
}

const server = new NotionMCPServer();
server.run().catch(console.error);












