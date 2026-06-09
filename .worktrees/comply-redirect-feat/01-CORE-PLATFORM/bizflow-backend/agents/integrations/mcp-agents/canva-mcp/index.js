/**
 * Canva MCP Server
 * Provides design creation and management capabilities for Canva platform
 * Integrates with Canva API for design operations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

class CanvaMCPServer {
  constructor() {
    this.apiKey = process.env.CANVA_API_KEY;
    this.apiBaseUrl = process.env.CANVA_API_BASE_URL || 'https://api.canva.com/rest/v1';
    
    if (!this.apiKey) {
      console.error('CANVA_API_KEY environment variable is required');
      // Don't exit - allow server to start but tools will fail gracefully
    }

    this.server = new Server(
      {
        name: 'canva-mcp-server',
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
            name: 'canva_create_design',
            description: 'Create a new Canva design. Can use preset dimensions (e.g., "Instagram Post", "Facebook Cover") or custom dimensions.',
            inputSchema: {
              type: 'object',
              properties: {
                preset: {
                  type: 'string',
                  description: 'Preset design type (e.g., "Instagram Post", "Facebook Cover", "LinkedIn Post", "Presentation", "Document")',
                },
                width: {
                  type: 'number',
                  description: 'Custom width in pixels (required if preset not provided)',
                },
                height: {
                  type: 'number',
                  description: 'Custom height in pixels (required if preset not provided)',
                },
                title: {
                  type: 'string',
                  description: 'Optional title for the design',
                },
                template_id: {
                  type: 'string',
                  description: 'Optional template ID to start from',
                },
              },
            },
          },
          {
            name: 'canva_add_asset',
            description: 'Add an asset (image, text, shape, etc.) to a design. Uploads or adds assets to an existing design.',
            inputSchema: {
              type: 'object',
              properties: {
                design_id: {
                  type: 'string',
                  description: 'The ID of the design to add the asset to',
                },
                asset_type: {
                  type: 'string',
                  description: 'Type of asset (e.g., "image", "text", "shape", "icon")',
                },
                asset_data: {
                  type: 'object',
                  description: 'Asset data (content, position, size, etc.)',
                },
                url: {
                  type: 'string',
                  description: 'URL of image to add (for image assets)',
                },
              },
              required: ['design_id', 'asset_type'],
            },
          },
          {
            name: 'canva_list_designs',
            description: 'List all designs created by the user. Returns a list of designs with metadata.',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of designs to return (default: 20)',
                },
                offset: {
                  type: 'number',
                  description: 'Offset for pagination (default: 0)',
                },
                folder_id: {
                  type: 'string',
                  description: 'Optional folder ID to filter designs',
                },
              },
            },
          },
          {
            name: 'canva_get_design',
            description: 'Retrieve detailed information about a specific design. Returns design metadata, elements, and properties.',
            inputSchema: {
              type: 'object',
              properties: {
                design_id: {
                  type: 'string',
                  description: 'The ID of the design to retrieve',
                },
              },
              required: ['design_id'],
            },
          },
          {
            name: 'canva_update_design',
            description: 'Update design elements, properties, or content. Modifies existing design elements.',
            inputSchema: {
              type: 'object',
              properties: {
                design_id: {
                  type: 'string',
                  description: 'The ID of the design to update',
                },
                updates: {
                  type: 'object',
                  description: 'Object containing updates (e.g., {title: "New Title", elements: [...]})',
                },
              },
              required: ['design_id', 'updates'],
            },
          },
          {
            name: 'canva_publish_design',
            description: 'Publish a design to make it accessible. Can publish as image, PDF, or shareable link.',
            inputSchema: {
              type: 'object',
              properties: {
                design_id: {
                  type: 'string',
                  description: 'The ID of the design to publish',
                },
                format: {
                  type: 'string',
                  description: 'Export format (e.g., "png", "jpg", "pdf", "link")',
                },
                quality: {
                  type: 'string',
                  description: 'Quality setting (e.g., "high", "medium", "low")',
                },
              },
              required: ['design_id'],
            },
          },
          {
            name: 'canva_list_templates',
            description: 'Browse available Canva templates. Search and filter templates by category, style, or keywords.',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for templates',
                },
                category: {
                  type: 'string',
                  description: 'Template category (e.g., "Social Media", "Marketing", "Education")',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of templates to return (default: 20)',
                },
              },
            },
          },
          {
            name: 'canva_download_design',
            description: 'Download a design as a file. Exports the design in the specified format.',
            inputSchema: {
              type: 'object',
              properties: {
                design_id: {
                  type: 'string',
                  description: 'The ID of the design to download',
                },
                format: {
                  type: 'string',
                  description: 'Export format (e.g., "png", "jpg", "pdf")',
                },
                quality: {
                  type: 'string',
                  description: 'Quality setting (e.g., "high", "medium", "low")',
                },
                scale: {
                  type: 'number',
                  description: 'Scale factor (default: 1.0)',
                },
              },
              required: ['design_id', 'format'],
            },
          },
        ],
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (!this.apiKey) {
          throw new Error('CANVA_API_KEY is not configured. Please set the environment variable.');
        }

        switch (name) {
          case 'canva_create_design':
            return await this.createDesign(args);
          case 'canva_add_asset':
            return await this.addAsset(args);
          case 'canva_list_designs':
            return await this.listDesigns(args);
          case 'canva_get_design':
            return await this.getDesign(args);
          case 'canva_update_design':
            return await this.updateDesign(args);
          case 'canva_publish_design':
            return await this.publishDesign(args);
          case 'canva_list_templates':
            return await this.listTemplates(args);
          case 'canva_download_design':
            return await this.downloadDesign(args);
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
          'Authorization': `Bearer ${this.apiKey}`,
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
        throw new Error(`Canva API error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No response from Canva API. Please check your connection and API key.');
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  getPresetDimensions(preset) {
    const presets = {
      'Instagram Post': { width: 1080, height: 1080 },
      'Instagram Story': { width: 1080, height: 1920 },
      'Facebook Cover': { width: 1200, height: 630 },
      'Facebook Post': { width: 1200, height: 630 },
      'LinkedIn Post': { width: 1200, height: 627 },
      'LinkedIn Cover': { width: 1584, height: 396 },
      'Twitter Post': { width: 1200, height: 675 },
      'Twitter Header': { width: 1500, height: 500 },
      'Presentation': { width: 1920, height: 1080 },
      'Document': { width: 816, height: 1056 },
      'YouTube Thumbnail': { width: 1280, height: 720 },
      'Pinterest Pin': { width: 1000, height: 1500 },
    };

    return presets[preset] || null;
  }

  async createDesign(args) {
    const { preset, width, height, title, template_id } = args;
    
    let designWidth = width;
    let designHeight = height;

    if (preset) {
      const dimensions = this.getPresetDimensions(preset);
      if (dimensions) {
        designWidth = dimensions.width;
        designHeight = dimensions.height;
      } else {
        throw new Error(`Unknown preset: ${preset}. Available presets: ${Object.keys(this.getPresetDimensions('')).join(', ')}`);
      }
    }

    if (!designWidth || !designHeight) {
      throw new Error('Either preset or both width and height must be provided');
    }

    const payload = {
      width: designWidth,
      height: designHeight,
      ...(title && { title }),
      ...(template_id && { template_id }),
    };

    const result = await this.makeApiRequest('/designs', 'POST', payload);
    
    return {
      content: [
        {
          type: 'text',
          text: `Design created successfully!\n\nDesign ID: ${result.id || result.design_id}\nTitle: ${result.title || title || 'Untitled'}\nDimensions: ${designWidth}x${designHeight}\nPreset: ${preset || 'Custom'}\nEdit URL: ${result.edit_url || result.url || 'N/A'}\n\n${result.message ? `Message: ${result.message}` : ''}`,
        },
      ],
    };
  }

  async addAsset(args) {
    const { design_id, asset_type, asset_data, url } = args;
    
    const payload = {
      type: asset_type,
      ...(asset_data && asset_data),
      ...(url && { url }),
    };

    const result = await this.makeApiRequest(`/designs/${design_id}/assets`, 'POST', payload);
    
    return {
      content: [
        {
          type: 'text',
          text: `Asset added successfully!\n\nDesign ID: ${design_id}\nAsset Type: ${asset_type}\nAsset ID: ${result.id || result.asset_id || 'N/A'}\nStatus: ${result.status || 'added'}`,
        },
      ],
    };
  }

  async listDesigns(args) {
    const { limit = 20, offset = 0, folder_id } = args;
    
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      ...(folder_id && { folder_id }),
    });

    const result = await this.makeApiRequest(`/designs?${params.toString()}`);
    
    const designs = result.designs || result.items || result.data || [];
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${designs.length} design(s):\n\n${designs.map((design, idx) => 
            `${idx + 1}. ${design.title || 'Untitled'}\n   ID: ${design.id || design.design_id}\n   Dimensions: ${design.width || 'N/A'}x${design.height || 'N/A'}\n   Created: ${design.created_at || 'N/A'}\n   Edit URL: ${design.edit_url || design.url || 'N/A'}\n`
          ).join('\n')}\n\nTotal: ${result.total || designs.length}`,
        },
      ],
    };
  }

  async getDesign(args) {
    const { design_id } = args;
    
    const result = await this.makeApiRequest(`/designs/${design_id}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `Design Details:\n\nID: ${result.id || design_id}\nTitle: ${result.title || 'N/A'}\nDimensions: ${result.width || 'N/A'}x${result.height || 'N/A'}\nCreated: ${result.created_at || 'N/A'}\nUpdated: ${result.updated_at || 'N/A'}\nEdit URL: ${result.edit_url || result.url || 'N/A'}\nElements: ${result.elements ? result.elements.length : 0}\n\n${result.description ? `Description: ${result.description}\n` : ''}`,
        },
      ],
    };
  }

  async updateDesign(args) {
    const { design_id, updates } = args;
    
    const result = await this.makeApiRequest(`/designs/${design_id}`, 'PATCH', updates);
    
    return {
      content: [
        {
          type: 'text',
          text: `Design updated successfully!\n\nID: ${result.id || design_id}\nUpdated fields: ${Object.keys(updates).join(', ')}\nTitle: ${result.title || 'N/A'}\nStatus: ${result.status || 'updated'}`,
        },
      ],
    };
  }

  async publishDesign(args) {
    const { design_id, format = 'link', quality = 'high' } = args;
    
    const payload = {
      format,
      quality,
    };

    const result = await this.makeApiRequest(`/designs/${design_id}/publish`, 'POST', payload);
    
    return {
      content: [
        {
          type: 'text',
          text: `Design published successfully!\n\nID: ${result.id || design_id}\nFormat: ${result.format || format}\nPublished URL: ${result.published_url || result.url || 'N/A'}\nDownload URL: ${result.download_url || 'N/A'}\nStatus: ${result.status || 'published'}`,
        },
      ],
    };
  }

  async listTemplates(args) {
    const { query, category, limit = 20 } = args;
    
    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(query && { query }),
      ...(category && { category }),
    });

    const result = await this.makeApiRequest(`/templates?${params.toString()}`);
    
    const templates = result.templates || result.items || result.data || [];
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${templates.length} template(s):\n\n${templates.map((template, idx) => 
            `${idx + 1}. ${template.title || 'Untitled'}\n   ID: ${template.id || template.template_id}\n   Category: ${template.category || 'N/A'}\n   Preview: ${template.preview_url || 'N/A'}\n`
          ).join('\n')}\n\nTotal: ${result.total || templates.length}`,
        },
      ],
    };
  }

  async downloadDesign(args) {
    const { design_id, format, quality = 'high', scale = 1.0 } = args;
    
    const payload = {
      format,
      quality,
      scale,
    };

    const result = await this.makeApiRequest(`/designs/${design_id}/download`, 'POST', payload);
    
    return {
      content: [
        {
          type: 'text',
          text: `Design download initiated!\n\nID: ${result.id || design_id}\nFormat: ${format}\nDownload URL: ${result.download_url || result.url || 'N/A'}\nFile Size: ${result.file_size || 'N/A'}\nStatus: ${result.status || 'ready'}\n\n${result.expires_at ? `Download expires: ${result.expires_at}` : ''}`,
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Canva MCP Server running on stdio');
  }
}

// Start the server
const server = new CanvaMCPServer();
server.start().catch(console.error);

