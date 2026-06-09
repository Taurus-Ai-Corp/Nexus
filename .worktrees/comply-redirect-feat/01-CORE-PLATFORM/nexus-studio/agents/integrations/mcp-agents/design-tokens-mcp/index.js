#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs');
const path = require('path');

class DesignTokensMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'design-tokens-mcp',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                    resources: {}
                }
            }
        );

        this.tokensPath = process.env.DESIGN_TOKENS_PATH || path.join(__dirname, 'tokens');
        this.setupHandlers();
    }

    setupHandlers() {
        // Register tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'generate_css_variables',
                        description: 'Generate CSS custom properties from design tokens',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                theme: {
                                    type: 'string',
                                    description: 'Theme name (light, dark, etc.)'
                                },
                                format: {
                                    type: 'string',
                                    description: 'Output format (css, scss, js)'
                                }
                            }
                        }
                    },
                    {
                        name: 'generate_scss_variables',
                        description: 'Generate SCSS variables from design tokens',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                theme: {
                                    type: 'string',
                                    description: 'Theme name (light, dark, etc.)'
                                }
                            }
                        }
                    },
                    {
                        name: 'generate_js_tokens',
                        description: 'Export JavaScript tokens for dynamic theming',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                theme: {
                                    type: 'string',
                                    description: 'Theme name (light, dark, etc.)'
                                }
                            }
                        }
                    },
                    {
                        name: 'validate_tokens',
                        description: 'Validate token structure for consistency',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                tokens: {
                                    type: 'string',
                                    description: 'JSON string of tokens to validate'
                                }
                            },
                            required: ['tokens']
                        }
                    }
                ]
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            
            switch (name) {
                case 'generate_css_variables':
                    return await this.generateCSSVariables(args);
                case 'generate_scss_variables':
                    return await this.generateSCSSVariables(args);
                case 'generate_js_tokens':
                    return await this.generateJSTokens(args);
                case 'validate_tokens':
                    return await this.validateTokens(args);
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });

        // Handle resource requests
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: 'tokens://design-system',
                        name: 'Design Tokens',
                        description: 'Design system tokens and variables',
                        mimeType: 'application/json'
                    },
                    {
                        uri: 'tokens://themes',
                        name: 'Theme Tokens',
                        description: 'Theme-specific design tokens',
                        mimeType: 'application/json'
                    }
                ]
            };
        });
    }

    async generateCSSVariables(args = {}) {
        const { theme = 'default', format = 'css' } = args;
        
        try {
            const tokens = this.loadTokens(theme);
            let css = `/* Design Tokens - ${theme} theme */\n:root {\n`;
            
            Object.entries(tokens).forEach(([category, values]) => {
                css += `  /* ${category} */\n`;
                Object.entries(values).forEach(([name, value]) => {
                    css += `  --${category}-${name}: ${value};\n`;
                });
                css += '\n';
            });
            
            css += '}';
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `🎨 Generated CSS variables for ${theme} theme:\n\n\`\`\`css\n${css}\n\`\`\``
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Failed to generate CSS variables: ${error.message}`
                    }
                ]
            };
        }
    }

    async generateSCSSVariables(args = {}) {
        const { theme = 'default' } = args;
        
        try {
            const tokens = this.loadTokens(theme);
            let scss = `// Design Tokens - ${theme} theme\n`;
            
            Object.entries(tokens).forEach(([category, values]) => {
                scss += `// ${category}\n`;
                Object.entries(values).forEach(([name, value]) => {
                    scss += `$${category}-${name}: ${value};\n`;
                });
                scss += '\n';
            });
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `🎨 Generated SCSS variables for ${theme} theme:\n\n\`\`\`scss\n${scss}\`\`\``
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Failed to generate SCSS variables: ${error.message}`
                    }
                ]
            };
        }
    }

    async generateJSTokens(args = {}) {
        const { theme = 'default' } = args;
        
        try {
            const tokens = this.loadTokens(theme);
            const jsTokens = {};
            
            Object.entries(tokens).forEach(([category, values]) => {
                jsTokens[category] = {};
                Object.entries(values).forEach(([name, value]) => {
                    jsTokens[category][name] = value;
                });
            });
            
            const jsCode = `// Design Tokens - ${theme} theme\nexport const designTokens = ${JSON.stringify(jsTokens, null, 2)};`;
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `🎨 Generated JavaScript tokens for ${theme} theme:\n\n\`\`\`javascript\n${jsCode}\n\`\`\``
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Failed to generate JavaScript tokens: ${error.message}`
                    }
                ]
            };
        }
    }

    async validateTokens(args) {
        const { tokens } = args;
        
        try {
            const tokenData = JSON.parse(tokens);
            const validation = this.validateTokenStructure(tokenData);
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `🔍 Token validation results:\n\n${validation}`
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Failed to validate tokens: ${error.message}`
                    }
                ]
            };
        }
    }

    loadTokens(theme) {
        // Default design tokens if no file exists
        const defaultTokens = {
            colors: {
                primary: '#3b82f6',
                secondary: '#64748b',
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                light: '#f8fafc',
                dark: '#0f172a'
            },
            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '3rem'
            },
            typography: {
                'font-size-xs': '0.75rem',
                'font-size-sm': '0.875rem',
                'font-size-base': '1rem',
                'font-size-lg': '1.125rem',
                'font-size-xl': '1.25rem',
                'font-size-2xl': '1.5rem'
            },
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
        };
        
        return defaultTokens;
    }

    validateTokenStructure(tokens) {
        const issues = [];
        const requiredCategories = ['colors', 'spacing', 'typography'];
        
        // Check for required categories
        requiredCategories.forEach(category => {
            if (!tokens[category]) {
                issues.push(`Missing required category: ${category}`);
            }
        });
        
        // Check token naming conventions
        Object.entries(tokens).forEach(([category, values]) => {
            if (typeof values !== 'object') {
                issues.push(`Category ${category} should be an object`);
                return;
            }
            
            Object.entries(values).forEach(([name, value]) => {
                if (typeof value !== 'string' && typeof value !== 'number') {
                    issues.push(`Token ${category}.${name} should be a string or number`);
                }
                
                // Check naming convention (kebab-case)
                if (!/^[a-z][a-z0-9-]*$/.test(name)) {
                    issues.push(`Token ${category}.${name} should use kebab-case naming`);
                }
            });
        });
        
        if (issues.length === 0) {
            return '✅ All tokens are valid! No issues found.';
        } else {
            return `⚠️ Validation issues found:\n${issues.map(issue => `- ${issue}`).join('\n')}`;
        }
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Design Tokens MCP Server started');
    }
}

// Start the server
const server = new DesignTokensMCPServer();
server.start().catch(console.error);
