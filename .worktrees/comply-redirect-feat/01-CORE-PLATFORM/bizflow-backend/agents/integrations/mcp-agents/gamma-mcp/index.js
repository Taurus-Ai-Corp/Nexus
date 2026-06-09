/**
 * Gamma MCP Server
 * Provides AI-powered content generation capabilities for presentations, documents, webpages, and social posts
 * Integrates with Gamma API v1.0: https://public-api.gamma.app/v1.0/generations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

class GammaMCPServer {
  constructor() {
    this.apiKey = process.env.GAMMA_API_KEY;
    this.apiBaseUrl = 'https://public-api.gamma.app/v1.0';
    
    if (!this.apiKey) {
      console.error('GAMMA_API_KEY environment variable is required');
      process.exit(1);
    }

    this.server = new Server(
      {
        name: 'gamma-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'gamma_generate_presentation',
            description: 'Generate a presentation from a prompt. Creates a new Gamma presentation with slides based on the provided content.',
            inputSchema: {
              type: 'object',
              properties: {
                inputText: {
                  type: 'string',
                  description: 'The text describing what presentation to generate (e.g., "Create a presentation about AI trends in 2025"). Min 1 character.',
                  minLength: 1,
                },
                textMode: {
                  type: 'string',
                  enum: ['generate', 'condense', 'preserve'],
                  description: 'How Gamma should handle the input text. "generate" = expand into full content, "condense" = summarize, "preserve" = keep as-is.',
                },
              },
              required: ['inputText'],
            },
          },
          {
            name: 'gamma_generate_document',
            description: 'Generate a document from a prompt. Creates a new Gamma document with formatted content.',
            inputSchema: {
              type: 'object',
              properties: {
                inputText: {
                  type: 'string',
                  description: 'The text describing what document to generate (e.g., "Create a business plan for a SaaS startup"). Min 1 character.',
                  minLength: 1,
                },
                textMode: {
                  type: 'string',
                  enum: ['generate', 'condense', 'preserve'],
                  description: 'How Gamma should handle the input text. "generate" = expand into full content, "condense" = summarize, "preserve" = keep as-is.',
                },
              },
              required: ['inputText'],
            },
          },
          {
            name: 'gamma_generate_webpage',
            description: 'Generate a webpage from a prompt. Creates a new Gamma webpage with interactive content.',
            inputSchema: {
              type: 'object',
              properties: {
                inputText: {
                  type: 'string',
                  description: 'The text describing what webpage to generate (e.g., "Create a landing page for a tech product"). Min 1 character.',
                  minLength: 1,
                },
                textMode: {
                  type: 'string',
                  enum: ['generate', 'condense', 'preserve'],
                  description: 'How Gamma should handle the input text. "generate" = expand into full content, "condense" = summarize, "preserve" = keep as-is.',
                },
              },
              required: ['inputText'],
            },
          },
          {
            name: 'gamma_generate_social_post',
            description: 'Generate a social media post from a prompt. Creates content optimized for social platforms.',
            inputSchema: {
              type: 'object',
              properties: {
                inputText: {
                  type: 'string',
                  description: 'The text describing what social post to generate (e.g., "Create a LinkedIn post about AI automation for professionals"). Min 1 character.',
                  minLength: 1,
                },
                textMode: {
                  type: 'string',
                  enum: ['generate', 'condense', 'preserve'],
                  description: 'How Gamma should handle the input text. "generate" = expand into full content, "condense" = summarize, "preserve" = keep as-is.',
                },
              },
              required: ['inputText'],
            },
          },
          {
            name: 'gamma_get_generation_status',
            description: 'Check the status of a generation request. Returns the current status and details of a generation.',
            inputSchema: {
              type: 'object',
              properties: {
                generation_id: {
                  type: 'string',
                  description: 'The ID of the generation to check',
                },
              },
              required: ['generation_id'],
            },
          },
          {
            name: 'gamma_list_generations',
            description: 'List all generations created by the user. Returns a list of all Gamma content items.',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of generations to return (default: 20)',
                },
                offset: {
                  type: 'number',
                  description: 'Offset for pagination (default: 0)',
                },
                type: {
                  type: 'string',
                  description: 'Filter by type (e.g., "presentation", "document", "webpage", "social_post")',
                },
              },
            },
          },
          {
            name: 'gamma_update_generation',
            description: 'Update an existing generation. Modifies content, title, or other properties of a Gamma item.',
            inputSchema: {
              type: 'object',
              properties: {
                generation_id: {
                  type: 'string',
                  description: 'The ID of the generation to update',
                },
                updates: {
                  type: 'object',
                  description: 'Object containing fields to update (e.g., {title: "New Title", content: "Updated content"})',
                },
              },
              required: ['generation_id', 'updates'],
            },
          },
          {
            name: 'gamma_publish_generation',
            description: 'Publish a generation to make it publicly accessible. Returns the published URL.',
            inputSchema: {
              type: 'object',
              properties: {
                generation_id: {
                  type: 'string',
                  description: 'The ID of the generation to publish',
                },
                visibility: {
                  type: 'string',
                  description: 'Visibility setting (e.g., "public", "unlisted", "private")',
                },
              },
              required: ['generation_id'],
            },
          },
        ],
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'gamma_generate_presentation':
            return await this.generatePresentation(args);
          case 'gamma_generate_document':
            return await this.generateDocument(args);
          case 'gamma_generate_webpage':
            return await this.generateWebpage(args);
          case 'gamma_generate_social_post':
            return await this.generateSocialPost(args);
          case 'gamma_get_generation_status':
            return await this.getGenerationStatus(args);
          case 'gamma_list_generations':
            return await this.listGenerations(args);
          case 'gamma_update_generation':
            return await this.updateGeneration(args);
          case 'gamma_publish_generation':
            return await this.publishGeneration(args);
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

  async makeApiRequest(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        url: `${this.apiBaseUrl}${endpoint}`,
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Gamma API error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No response from Gamma API. Please check your connection.');
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  async generatePresentation(args) {
    const { inputText, textMode = 'generate' } = args;

    const payload = {
      inputText,
      textMode,
    };

    const result = await this.makeApiRequest('/generations', 'POST', payload);

    return {
      content: [
        {
          type: 'text',
          text: `Presentation generated successfully!\n\nGeneration ID: ${result.id || result.generation_id}\nTitle: ${result.title || 'Untitled'}\nStatus: ${result.status || 'processing'}\nURL: ${result.url || 'N/A'}\n\n${result.message ? `Message: ${result.message}` : ''}`,
        },
      ],
    };
  }

  async generateDocument(args) {
    const { inputText, textMode = 'generate' } = args;

    const payload = {
      inputText,
      textMode,
    };

    const result = await this.makeApiRequest('/generations', 'POST', payload);

    return {
      content: [
        {
          type: 'text',
          text: `Document generated successfully!\n\nGeneration ID: ${result.id || result.generation_id}\nTitle: ${result.title || 'Untitled'}\nStatus: ${result.status || 'processing'}\nURL: ${result.url || 'N/A'}\n\n${result.message ? `Message: ${result.message}` : ''}`,
        },
      ],
    };
  }

  async generateWebpage(args) {
    const { inputText, textMode = 'generate' } = args;

    const payload = {
      inputText,
      textMode,
    };

    const result = await this.makeApiRequest('/generations', 'POST', payload);

    return {
      content: [
        {
          type: 'text',
          text: `Webpage generated successfully!\n\nGeneration ID: ${result.id || result.generation_id}\nTitle: ${result.title || 'Untitled'}\nStatus: ${result.status || 'processing'}\nURL: ${result.url || 'N/A'}\n\n${result.message ? `Message: ${result.message}` : ''}`,
        },
      ],
    };
  }

  async generateSocialPost(args) {
    const { inputText, textMode = 'generate' } = args;

    const payload = {
      inputText,
      textMode,
    };

    const result = await this.makeApiRequest('/generations', 'POST', payload);

    return {
      content: [
        {
          type: 'text',
          text: `Social post generated successfully!\n\nGeneration ID: ${result.id || result.generation_id}\nStatus: ${result.status || 'processing'}\nContent Preview: ${result.content ? result.content.substring(0, 200) + '...' : 'N/A'}\nURL: ${result.url || 'N/A'}\n\n${result.message ? `Message: ${result.message}` : ''}`,
        },
      ],
    };
  }

  async getGenerationStatus(args) {
    const { generation_id } = args;
    
    const result = await this.makeApiRequest(`/generations/${generation_id}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generation Status:\n\nID: ${result.id || generation_id}\nTitle: ${result.title || 'N/A'}\nType: ${result.type || 'N/A'}\nStatus: ${result.status || 'unknown'}\nCreated: ${result.created_at || 'N/A'}\nUpdated: ${result.updated_at || 'N/A'}\nURL: ${result.url || 'N/A'}\n\n${result.error ? `Error: ${result.error}` : ''}`,
        },
      ],
    };
  }

  async listGenerations(args) {
    const { limit = 20, offset = 0, type } = args;
    
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      ...(type && { type }),
    });

    const result = await this.makeApiRequest(`/generations?${params.toString()}`);
    
    const generations = result.generations || result.items || result.data || [];
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${generations.length} generation(s):\n\n${generations.map((gen, idx) => 
            `${idx + 1}. ${gen.title || 'Untitled'} (${gen.type || 'unknown'})\n   ID: ${gen.id || gen.generation_id}\n   Status: ${gen.status || 'unknown'}\n   URL: ${gen.url || 'N/A'}\n`
          ).join('\n')}\n\nTotal: ${result.total || generations.length}`,
        },
      ],
    };
  }

  async updateGeneration(args) {
    const { generation_id, updates } = args;
    
    const result = await this.makeApiRequest(`/generations/${generation_id}`, 'PATCH', updates);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generation updated successfully!\n\nID: ${result.id || generation_id}\nUpdated fields: ${Object.keys(updates).join(', ')}\nStatus: ${result.status || 'updated'}\nURL: ${result.url || 'N/A'}`,
        },
      ],
    };
  }

  async publishGeneration(args) {
    const { generation_id, visibility = 'public' } = args;
    
    const payload = {
      visibility,
    };

    const result = await this.makeApiRequest(`/generations/${generation_id}/publish`, 'POST', payload);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generation published successfully!\n\nID: ${result.id || generation_id}\nVisibility: ${result.visibility || visibility}\nPublished URL: ${result.published_url || result.url || 'N/A'}\nStatus: ${result.status || 'published'}`,
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Gamma MCP Server running on stdio');
  }
}

// Start the server
const server = new GammaMCPServer();
server.start().catch(console.error);

