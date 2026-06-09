#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class GmailMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'gmail-mcp',
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
            name: 'send_email',
            description: 'Send an email via Gmail',
            inputSchema: {
              type: 'object',
              properties: {
                to: { type: 'string', description: 'Recipient email address' },
                subject: { type: 'string', description: 'Email subject' },
                body: { type: 'string', description: 'Email body content' },
              },
              required: ['to', 'subject', 'body'],
            },
          },
          {
            name: 'list_emails',
            description: 'List recent emails from Gmail',
            inputSchema: {
              type: 'object',
              properties: {
                maxResults: { type: 'number', description: 'Maximum number of emails to return', default: 10 },
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
          case 'send_email':
            return {
              content: [
                {
                  type: 'text',
                  text: `Gmail MCP: Would send email to ${args.to} with subject "${args.subject}"`,
                },
              ],
            };

          case 'list_emails':
            return {
              content: [
                {
                  type: 'text',
                  text: `Gmail MCP: Would list ${args.maxResults || 10} recent emails`,
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
    console.error('Gmail MCP server running on stdio');
  }
}

const server = new GmailMCPServer();
server.run().catch(console.error);












