#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class GoogleSheetsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'google-sheets-mcp',
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
            name: 'read_sheet',
            description: 'Read data from a Google Sheet',
            inputSchema: {
              type: 'object',
              properties: {
                spreadsheetId: { type: 'string', description: 'Google Sheets spreadsheet ID' },
                range: { type: 'string', description: 'Sheet range (e.g., A1:C10)' },
              },
              required: ['spreadsheetId', 'range'],
            },
          },
          {
            name: 'write_sheet',
            description: 'Write data to a Google Sheet',
            inputSchema: {
              type: 'object',
              properties: {
                spreadsheetId: { type: 'string', description: 'Google Sheets spreadsheet ID' },
                range: { type: 'string', description: 'Sheet range (e.g., A1:C10)' },
                values: { type: 'array', description: 'Data to write' },
              },
              required: ['spreadsheetId', 'range', 'values'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'read_sheet':
            return {
              content: [
                {
                  type: 'text',
                  text: `Google Sheets MCP: Would read range ${args.range} from spreadsheet ${args.spreadsheetId}`,
                },
              ],
            };

          case 'write_sheet':
            return {
              content: [
                {
                  type: 'text',
                  text: `Google Sheets MCP: Would write data to range ${args.range} in spreadsheet ${args.spreadsheetId}`,
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
    console.error('Google Sheets MCP server running on stdio');
  }
}

const server = new GoogleSheetsMCPServer();
server.run().catch(console.error);












