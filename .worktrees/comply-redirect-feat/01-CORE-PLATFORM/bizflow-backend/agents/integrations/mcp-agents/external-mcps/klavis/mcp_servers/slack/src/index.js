#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class SlackMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'slack-mcp',
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
            name: 'send_message',
            description: 'Send a message to a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: { type: 'string', description: 'Slack channel ID or name' },
                text: { type: 'string', description: 'Message text' },
              },
              required: ['channel', 'text'],
            },
          },
          {
            name: 'list_channels',
            description: 'List available Slack channels',
            inputSchema: {
              type: 'object',
              properties: {
                limit: { type: 'number', description: 'Maximum number of channels to return', default: 20 },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'send_message':
            return {
              content: [
                {
                  type: 'text',
                  text: `Slack MCP: Would send message to channel ${args.channel}: "${args.text}"`,
                },
              ],
            };

          case 'list_channels':
            return {
              content: [
                {
                  type: 'text',
                  text: `Slack MCP: Would list ${args.limit || 20} channels`,
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
    console.error('Slack MCP server running on stdio');
  }
}

const server = new SlackMCPServer();
server.run().catch(console.error);












