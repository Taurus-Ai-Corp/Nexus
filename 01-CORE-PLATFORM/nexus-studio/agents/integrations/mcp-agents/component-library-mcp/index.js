#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class ComponentLibraryMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'component-library-mcp',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                    resources: {}
                }
            }
        );

        this.components = this.loadComponentLibrary();
        this.setupHandlers();
    }

    setupHandlers() {
        // Register tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'get_component',
                        description: 'Retrieve component templates from the library',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'Component name to retrieve'
                                },
                                framework: {
                                    type: 'string',
                                    description: 'Framework (react, vue, html, etc.)'
                                }
                            },
                            required: ['name']
                        }
                    },
                    {
                        name: 'generate_variant',
                        description: 'Create component variants with different props',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                component: {
                                    type: 'string',
                                    description: 'Base component name'
                                },
                                variant: {
                                    type: 'string',
                                    description: 'Variant type (primary, secondary, etc.)'
                                },
                                framework: {
                                    type: 'string',
                                    description: 'Framework (react, vue, html, etc.)'
                                }
                            },
                            required: ['component', 'variant']
                        }
                    },
                    {
                        name: 'validate_accessibility',
                        description: 'Check component accessibility compliance',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                component: {
                                    type: 'string',
                                    description: 'Component HTML/JSX to validate'
                                }
                            },
                            required: ['component']
                        }
                    }
                ]
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            
            switch (name) {
                case 'get_component':
                    return await this.getComponent(args);
                case 'generate_variant':
                    return await this.generateVariant(args);
                case 'validate_accessibility':
                    return await this.validateAccessibility(args);
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });

        // Handle resource requests
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: 'components://ui',
                        name: 'UI Components',
                        description: 'Pre-built UI components',
                        mimeType: 'application/json'
                    },
                    {
                        uri: 'components://forms',
                        name: 'Form Components',
                        description: 'Form and input components',
                        mimeType: 'application/json'
                    },
                    {
                        uri: 'components://navigation',
                        name: 'Navigation Components',
                        description: 'Navigation and menu components',
                        mimeType: 'application/json'
                    }
                ]
            };
        });
    }

    loadComponentLibrary() {
        return {
            button: {
                react: {
                    primary: `<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  {children}
</button>`,
                    secondary: `<button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  {children}
</button>`,
                    outline: `<button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors">
  {children}
</button>`
                },
                vue: {
                    primary: `<button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  <slot />
</button>`,
                    secondary: `<button class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  <slot />
</button>`
                },
                html: {
                    primary: `<button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Button Text
</button>`,
                    secondary: `<button class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Button Text
</button>`
                }
            },
            card: {
                react: {
                    default: `<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
  <p className="text-gray-600">{description}</p>
  {children}
</div>`,
                    elevated: `<div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200 transform hover:scale-105 transition-transform">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
  <p className="text-gray-600">{description}</p>
  {children}
</div>`
                },
                html: {
                    default: `<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  <h3 class="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
  <p class="text-gray-600">Card description goes here.</p>
</div>`
                }
            },
            input: {
                react: {
                    default: `<input 
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder={placeholder}
  value={value}
  onChange={onChange}
/>`,
                    search: `<div className="relative">
  <input 
    type="search"
    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Search..."
  />
  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</div>`
                },
                html: {
                    default: `<input 
  type="text"
  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter text..."
/>`
                }
            }
        };
    }

    async getComponent(args) {
        const { name, framework = 'html' } = args;
        
        if (!this.components[name]) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Component '${name}' not found in the library.\n\nAvailable components: ${Object.keys(this.components).join(', ')}`
                    }
                ]
            };
        }
        
        const component = this.components[name];
        const frameworks = Object.keys(component);
        
        if (!component[framework]) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Framework '${framework}' not available for component '${name}'.\n\nAvailable frameworks: ${frameworks.join(', ')}`
                    }
                ]
            };
        }
        
        const variants = Object.keys(component[framework]);
        let result = `🧩 **Component: ${name}** (${framework})\n\n`;
        
        variants.forEach(variant => {
            result += `**${variant} variant:**\n\`\`\`${framework === 'html' ? 'html' : framework}\n${component[framework][variant]}\n\`\`\`\n\n`;
        });
        
        return {
            content: [
                {
                    type: 'text',
                    text: result
                }
            ]
        };
    }

    async generateVariant(args) {
        const { component, variant, framework = 'html' } = args;
        
        if (!this.components[component]) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Component '${component}' not found in the library.`
                    }
                ]
            };
        }
        
        if (!this.components[component][framework]) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Framework '${framework}' not available for component '${component}'.`
                    }
                ]
            };
        }
        
        // Generate a new variant based on existing ones
        const existingVariants = Object.keys(this.components[component][framework]);
        const baseVariant = existingVariants[0] || 'default';
        const baseCode = this.components[component][framework][baseVariant];
        
        let newVariant = baseCode;
        
        // Apply variant-specific modifications
        switch (variant.toLowerCase()) {
            case 'large':
                newVariant = newVariant.replace(/py-\d+/, 'py-4').replace(/px-\d+/, 'px-6').replace(/text-\w+/, 'text-lg');
                break;
            case 'small':
                newVariant = newVariant.replace(/py-\d+/, 'py-1').replace(/px-\d+/, 'px-2').replace(/text-\w+/, 'text-sm');
                break;
            case 'success':
                newVariant = newVariant.replace(/bg-blue-\d+/, 'bg-green-600').replace(/hover:bg-blue-\d+/, 'hover:bg-green-700').replace(/focus:ring-blue-\d+/, 'focus:ring-green-500');
                break;
            case 'warning':
                newVariant = newVariant.replace(/bg-blue-\d+/, 'bg-yellow-600').replace(/hover:bg-blue-\d+/, 'hover:bg-yellow-700').replace(/focus:ring-blue-\d+/, 'focus:ring-yellow-500');
                break;
            case 'danger':
                newVariant = newVariant.replace(/bg-blue-\d+/, 'bg-red-600').replace(/hover:bg-blue-\d+/, 'hover:bg-red-700').replace(/focus:ring-blue-\d+/, 'focus:ring-red-500');
                break;
            default:
                // Custom variant - add a custom class
                newVariant = newVariant.replace(/class="/, 'class="custom-' + variant + ' ');
        }
        
        return {
            content: [
                {
                    type: 'text',
                    text: `🎨 Generated ${variant} variant for ${component} (${framework}):\n\n\`\`\`${framework === 'html' ? 'html' : framework}\n${newVariant}\n\`\`\``
                }
            ]
        };
    }

    async validateAccessibility(args) {
        const { component } = args;
        
        const checks = [
            { name: 'Semantic HTML', passed: component.includes('<button') || component.includes('<input') || component.includes('<nav') || component.includes('<main') },
            { name: 'ARIA Labels', passed: component.includes('aria-label') || component.includes('aria-labelledby') || component.includes('aria-describedby') },
            { name: 'Focus Management', passed: component.includes('focus:') || component.includes('tabindex') },
            { name: 'Color Contrast', passed: !component.includes('text-white') || component.includes('bg-gray-900') || component.includes('bg-blue-900') },
            { name: 'Keyboard Navigation', passed: component.includes('onKeyDown') || component.includes('onKeyPress') || !component.includes('onClick') }
        ];
        
        const passed = checks.filter(check => check.passed).length;
        const total = checks.length;
        
        let result = `♿ **Accessibility Validation Results**\n\n`;
        result += `**Score:** ${passed}/${total} (${Math.round(passed/total*100)}%)\n\n`;
        
        checks.forEach(check => {
            result += `${check.passed ? '✅' : '❌'} ${check.name}\n`;
        });
        
        if (passed === total) {
            result += '\n🎉 All accessibility checks passed!';
        } else {
            result += '\n⚠️ Some accessibility improvements needed.';
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
        console.error('Component Library MCP Server started');
    }
}

// Start the server
const server = new ComponentLibraryMCPServer();
server.start().catch(console.error);






