#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class TailwindMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'tailwind-mcp',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                    resources: {}
                }
            }
        );

        this.setupHandlers();
    }

    setupHandlers() {
        // Register tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'generate_component',
                        description: 'Generate a UI component with Tailwind CSS classes',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                component: {
                                    type: 'string',
                                    description: 'Component type (button, card, input, etc.)'
                                },
                                variant: {
                                    type: 'string',
                                    description: 'Component variant (primary, secondary, etc.)'
                                },
                                size: {
                                    type: 'string',
                                    description: 'Component size (sm, md, lg, xl)'
                                },
                                icon: {
                                    type: 'boolean',
                                    description: 'Whether to include an icon'
                                }
                            },
                            required: ['component']
                        }
                    },
                    {
                        name: 'suggest_classes',
                        description: 'Suggest optimal Tailwind CSS classes for your needs',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                purpose: {
                                    type: 'string',
                                    description: 'What you want to achieve (layout, spacing, colors, etc.)'
                                },
                                context: {
                                    type: 'string',
                                    description: 'Additional context about your use case'
                                }
                            },
                            required: ['purpose']
                        }
                    },
                    {
                        name: 'optimize_classes',
                        description: 'Optimize Tailwind CSS class combinations for performance',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                classes: {
                                    type: 'string',
                                    description: 'Current Tailwind classes to optimize'
                                }
                            },
                            required: ['classes']
                        }
                    }
                ]
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            
            switch (name) {
                case 'generate_component':
                    return await this.generateComponent(args);
                case 'suggest_classes':
                    return await this.suggestClasses(args);
                case 'optimize_classes':
                    return await this.optimizeClasses(args);
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });

        // Handle resource requests
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: 'tailwind://components',
                        name: 'Tailwind Components',
                        description: 'Pre-built Tailwind CSS components',
                        mimeType: 'application/json'
                    },
                    {
                        uri: 'tailwind://classes',
                        name: 'Tailwind Classes',
                        description: 'Tailwind CSS utility classes reference',
                        mimeType: 'application/json'
                    }
                ]
            };
        });
    }

    async generateComponent(args) {
        const { component = 'button', variant = 'primary', size = 'md', icon = false } = args;
        
        let classes = '';
        let html = '';
        
        switch (component.toLowerCase()) {
            case 'button':
                classes = this.generateButtonClasses(variant, size, icon);
                html = this.generateButtonHTML(variant, size, icon);
                break;
            case 'card':
                classes = this.generateCardClasses(variant, size);
                html = this.generateCardHTML(variant, size);
                break;
            case 'input':
                classes = this.generateInputClasses(variant, size);
                html = this.generateInputHTML(variant, size);
                break;
            default:
                classes = 'bg-gray-500 text-white px-4 py-2 rounded';
                html = `<div class="${classes}">${component}</div>`;
        }
        
        return {
            content: [
                {
                    type: 'text',
                    text: `🎨 Generated ${component} component:\n\n**Classes:**\n\`${classes}\`\n\n**HTML:**\n\`${html}\``
                }
            ]
        };
    }

    generateButtonClasses(variant, size, icon) {
        let classes = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
        
        // Variant classes
        switch (variant) {
            case 'primary':
                classes += ' bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
                break;
            case 'secondary':
                classes += ' bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
                break;
            case 'success':
                classes += ' bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
                break;
            case 'danger':
                classes += ' bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
                break;
            default:
                classes += ' bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
        }
        
        // Size classes
        switch (size) {
            case 'sm':
                classes += ' px-3 py-1.5 text-sm';
                break;
            case 'md':
                classes += ' px-4 py-2 text-base';
                break;
            case 'lg':
                classes += ' px-6 py-3 text-lg';
                break;
            case 'xl':
                classes += ' px-8 py-4 text-xl';
                break;
            default:
                classes += ' px-4 py-2 text-base';
        }
        
        // Icon spacing
        if (icon) {
            classes += ' gap-2';
        }
        
        return classes;
    }

    generateButtonHTML(variant, size, icon) {
        const text = variant.charAt(0).toUpperCase() + variant.slice(1);
        if (icon) {
            return `<button class="${this.generateButtonClasses(variant, size, icon)}">
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
  </svg>
  ${text}
</button>`;
        }
        return `<button class="${this.generateButtonClasses(variant, size, icon)}">${text}</button>`;
    }

    generateCardClasses(variant, size) {
        let classes = 'bg-white rounded-lg shadow-md border border-gray-200';
        
        switch (size) {
            case 'sm':
                classes += ' p-4';
                break;
            case 'md':
                classes += ' p-6';
                break;
            case 'lg':
                classes += ' p-8';
                break;
            default:
                classes += ' p-6';
        }
        
        return classes;
    }

    generateCardHTML(variant, size) {
        return `<div class="${this.generateCardClasses(variant, size)}">
  <h3 class="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
  <p class="text-gray-600">This is a ${size} ${variant} card component.</p>
</div>`;
    }

    generateInputClasses(variant, size) {
        let classes = 'w-full border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
        
        switch (size) {
            case 'sm':
                classes += ' py-2 text-sm';
                break;
            case 'md':
                classes += ' py-2.5 text-base';
                break;
            case 'lg':
                classes += ' py-3 text-lg';
                break;
            default:
                classes += ' py-2.5 text-base';
        }
        
        return classes;
    }

    generateInputHTML(variant, size) {
        return `<input type="text" class="${this.generateInputClasses(variant, size)}" placeholder="Enter text...">`;
    }

    async suggestClasses(args) {
        const { purpose, context = '' } = args;
        
        let suggestions = '';
        
        switch (purpose.toLowerCase()) {
            case 'layout':
                suggestions = `📐 **Layout Classes:**\n- \`flex\` - Flexbox container\n- \`grid\` - CSS Grid container\n- \`container\` - Responsive container\n- \`mx-auto\` - Center horizontally\n- \`text-center\` - Center text`;
                break;
            case 'spacing':
                suggestions = `📏 **Spacing Classes:**\n- \`p-4\` - Padding all sides\n- \`px-6\` - Horizontal padding\n- \`py-2\` - Vertical padding\n- \`m-4\` - Margin all sides\n- \`space-y-4\` - Vertical spacing between children`;
                break;
            case 'colors':
                suggestions = `🎨 **Color Classes:**\n- \`bg-blue-500\` - Blue background\n- \`text-gray-900\` - Dark text\n- \`border-red-300\` - Red border\n- \`hover:bg-blue-600\` - Hover state\n- \`focus:ring-blue-500\` - Focus ring`;
                break;
            case 'typography':
                suggestions = `📝 **Typography Classes:**\n- \`text-2xl\` - Large heading\n- \`font-bold\` - Bold text\n- \`text-center\` - Centered text\n- \`leading-relaxed\` - Line height\n- \`tracking-wide\` - Letter spacing`;
                break;
            default:
                suggestions = `💡 **General Classes:**\n- \`rounded-lg\` - Rounded corners\n- \`shadow-md\` - Box shadow\n- \`transition-all\` - Smooth transitions\n- \`hover:scale-105\` - Hover effects\n- \`focus:outline-none\` - Remove focus outline`;
        }
        
        return {
            content: [
                {
                    type: 'text',
                    text: `${suggestions}\n\n${context ? `**Context:** ${context}` : ''}`
                }
            ]
        };
    }

    async optimizeClasses(args) {
        const { classes } = args;
        
        // Simple optimization suggestions
        let optimizations = [];
        
        if (classes.includes('p-4') && classes.includes('px-4')) {
            optimizations.push('Remove redundant `px-4` since `p-4` already includes horizontal padding');
        }
        
        if (classes.includes('m-4') && classes.includes('mx-4')) {
            optimizations.push('Remove redundant `mx-4` since `m-4` already includes horizontal margin');
        }
        
        if (classes.includes('text-white') && classes.includes('text-gray-100')) {
            optimizations.push('Remove conflicting text colors - use only one');
        }
        
        if (classes.includes('bg-blue-500') && classes.includes('bg-blue-600')) {
            optimizations.push('Remove conflicting background colors - use only one');
        }
        
        let result = `🔧 **Class Optimization for:** \`${classes}\`\n\n`;
        
        if (optimizations.length > 0) {
            result += '**Optimizations:**\n' + optimizations.map(opt => `- ${opt}`).join('\n');
        } else {
            result += '✅ No obvious optimizations found. Your classes look good!';
        }
        
        return {
            content: [
                {
                    type: 'text',
                    text: result
                }
            ]
        };
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Tailwind MCP Server started');
    }
}

// Start the server
const server = new TailwindMCPServer();
server.start().catch(console.error);
