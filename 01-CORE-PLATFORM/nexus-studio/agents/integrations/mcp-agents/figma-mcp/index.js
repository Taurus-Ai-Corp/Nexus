#!/usr/bin/env node

const http = require('http');
const axios = require('axios');
require('dotenv').config();

class FigmaMCPServer {
    constructor() {
        this.figmaToken = process.env.FIGMA_ACCESS_TOKEN;
        this.port = process.env.PORT || 3001;
        this.setupServer();
    }

    setupServer() {
        this.server = http.createServer(async (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            try {
                const url = new URL(req.url, `http://${req.headers.host}`);
                const path = url.pathname;

                if (path === '/health') {
                    res.writeHead(200);
                    res.end(JSON.stringify({ status: 'ok', service: 'figma-mcp' }));
                    return;
                }

                if (path === '/tools/call' && req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });

                    req.on('end', async () => {
                        try {
                            const { name, arguments: args } = JSON.parse(body);
                            let result;

                            switch (name) {
                                case 'get_figma_file':
                                    result = await this.getFigmaFile(args.fileKey);
                                    break;
                                case 'extract_design_tokens':
                                    result = await this.extractDesignTokens(args.fileKey);
                                    break;
                                case 'get_components':
                                    result = await this.getComponents(args.fileKey);
                                    break;
                                default:
                                    res.writeHead(400);
                                    res.end(JSON.stringify({ error: `Unknown tool: ${name}` }));
                                    return;
                            }

                            res.writeHead(200);
                            res.end(JSON.stringify(result));
                        } catch (error) {
                            res.writeHead(400);
                            res.end(JSON.stringify({ error: error.message }));
                        }
                    });
                    return;
                }

                if (path === '/resources/list' && req.method === 'GET') {
                    const resources = {
                        resources: [
                            {
                                uri: 'figma://files',
                                name: 'Figma Files',
                                description: 'Access to Figma design files',
                                mimeType: 'application/json'
                            }
                        ]
                    };
                    res.writeHead(200);
                    res.end(JSON.stringify(resources));
                    return;
                }

                // Default response
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Not found' }));

            } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    }

    async getFigmaFile(fileKey) {
        try {
            if (!this.figmaToken) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: '⚠️ Figma access token not configured. Please set FIGMA_ACCESS_TOKEN environment variable.'
                        }
                    ]
                };
            }

            const response = await axios.get(`https://api.figma.com/v1/files/${fileKey}`, {
                headers: {
                    'X-Figma-Token': this.figmaToken
                }
            });
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Figma file loaded: ${response.data.name}\n\nFile contains ${response.data.document.children.length} main sections.`
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Failed to load Figma file: ${error.message}`
                    }
                ]
            };
        }
    }

    async extractDesignTokens(fileKey) {
        try {
            if (!this.figmaToken) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: '⚠️ Figma access token not configured. Please set FIGMA_ACCESS_TOKEN environment variable.'
                        }
                    ]
                };
            }

            const response = await axios.get(`https://api.figma.com/v1/files/${fileKey}/styles`, {
                headers: {
                    'X-Figma-Token': this.figmaToken
                }
            });
            
            const tokens = response.data.meta.styles.map(style => ({
                name: style.name,
                key: style.key,
                description: style.description || ''
            }));
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `🎨 Design tokens extracted: ${tokens.length} tokens found\n\n${JSON.stringify(tokens, null, 2)}`
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Failed to extract design tokens: ${error.message}`
                    }
                ]
            };
        }
    }

    async getComponents(fileKey) {
        try {
            if (!this.figmaToken) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: '⚠️ Figma access token not configured. Please set FIGMA_ACCESS_TOKEN environment variable.'
                        }
                    ]
                };
            }

            const response = await axios.get(`https://api.figma.com/v1/files/${fileKey}/components`, {
                headers: {
                    'X-Figma-Token': this.figmaToken
                }
            });
            
            const components = response.data.meta.components.map(comp => ({
                name: comp.name,
                key: comp.key,
                description: comp.description || ''
            }));
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `🧩 Components found: ${components.length} components\n\n${JSON.stringify(components, null, 2)}`
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Failed to get components: ${error.message}`
                    }
                ]
            };
        }
    }

    start() {
        this.server.listen(this.port, () => {
            console.error(`🎨 Figma MCP Server running on port ${this.port}`);
            console.error(`📡 Health check: http://localhost:${this.port}/health`);
            console.error(`🔧 Tools endpoint: http://localhost:${this.port}/tools/call`);
            console.error(`📚 Resources endpoint: http://localhost:${this.port}/resources/list`);
        });
    }
}

// Start the server
const server = new FigmaMCPServer();
server.start();
