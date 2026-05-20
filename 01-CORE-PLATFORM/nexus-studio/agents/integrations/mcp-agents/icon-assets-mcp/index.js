#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class IconAssetsMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'icon-assets-mcp',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                    resources: {}
                }
            }
        );

        this.icons = this.loadIconLibrary();
        this.setupHandlers();
    }

    setupHandlers() {
        // Register tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'get_icon',
                        description: 'Retrieve icon assets from the library',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'Icon name to retrieve'
                                },
                                framework: {
                                    type: 'string',
                                    description: 'Framework (react, vue, html, etc.)'
                                },
                                size: {
                                    type: 'string',
                                    description: 'Icon size (sm, md, lg, xl)'
                                }
                            },
                            required: ['name']
                        }
                    },
                    {
                        name: 'optimize_svg',
                        description: 'Optimize SVG files for web use',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                svg: {
                                    type: 'string',
                                    description: 'SVG content to optimize'
                                }
                            },
                            required: ['svg']
                        }
                    },
                    {
                        name: 'generate_component',
                        description: 'Create icon components for your framework',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                icon: {
                                    type: 'string',
                                    description: 'Icon name or SVG content'
                                },
                                framework: {
                                    type: 'string',
                                    description: 'Framework (react, vue, html, etc.)'
                                }
                            },
                            required: ['icon', 'framework']
                        }
                    }
                ]
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            
            switch (name) {
                case 'get_icon':
                    return await this.getIcon(args);
                case 'optimize_svg':
                    return await this.optimizeSVG(args);
                case 'generate_component':
                    return await this.generateComponent(args);
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });

        // Handle resource requests
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: 'icons://heroicons',
                        name: 'Heroicons',
                        description: 'Beautiful hand-crafted SVG icons',
                        mimeType: 'application/json'
                    },
                    {
                        uri: 'icons://lucide',
                        name: 'Lucide Icons',
                        description: 'Beautiful & consistent icon toolkit',
                        mimeType: 'application/json'
                    },
                    {
                        uri: 'icons://feather',
                        name: 'Feather Icons',
                        description: 'Simply beautiful open source icons',
                        mimeType: 'application/json'
                    }
                ]
            };
        });
    }

    loadIconLibrary() {
        return {
            arrow: {
                right: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12h14"/>
  <path d="m12 5 7 7-7 7"/>
</svg>`,
                left: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m12 19-7-7 7-7"/>
  <path d="M19 12H5"/>
</svg>`,
                up: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m18 15-6-6-6 6"/>
</svg>`,
                down: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m6 9 6 6 6-6"/>
</svg>`
            },
            search: {
                default: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.35-4.35"/>
</svg>`,
                magnifying: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.35-4.35"/>
  <path d="M11 8v6"/>
  <path d="M8 11h6"/>
</svg>`
            },
            user: {
                default: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
  <circle cx="12" cy="7" r="4"/>
</svg>`,
                profile: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
  <circle cx="12" cy="7" r="4"/>
  <path d="M12 3v4"/>
  <path d="M8 7h8"/>
</svg>`
            },
            menu: {
                hamburger: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="4" x2="20" y1="6" y2="6"/>
  <line x1="4" x2="20" y1="12" y2="12"/>
  <line x1="4" x2="20" y1="18" y2="18"/>
</svg>`,
                dots: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="1"/>
  <circle cx="19" cy="12" r="1"/>
  <circle cx="5" cy="12" r="1"/>
</svg>`
            },
            check: {
                default: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20,6 9,17 4,12"/>
</svg>`,
                circle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
  <polyline points="22,4 12,14.01 9,11.01"/>
</svg>`
            },
            close: {
                default: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</svg>`,
                x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</svg>`
            }
        };
    }

    async getIcon(args) {
        const { name, framework = 'html', size = 'md' } = args;
        
        // Parse icon name (e.g., "arrow.right" -> category: "arrow", icon: "right")
        const [category, icon] = name.includes('.') ? name.split('.') : [name, 'default'];
        
        if (!this.icons[category]) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Icon category '${category}' not found.\n\nAvailable categories: ${Object.keys(this.icons).join(', ')}`
                    }
                ]
            };
        }
        
        if (!this.icons[category][icon]) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Icon '${icon}' not found in category '${category}'.\n\nAvailable icons: ${Object.keys(this.icons[category]).join(', ')}`
                    }
                ]
            };
        }
        
        let svg = this.icons[category][icon];
        
        // Apply size
        const sizes = { sm: 16, md: 24, lg: 32, xl: 48 };
        const iconSize = sizes[size] || 24;
        svg = svg.replace(/width="\d+"/, `width="${iconSize}"`).replace(/height="\d+"/, `height="${iconSize}"`);
        
        // Generate framework-specific code
        let result = `🎨 **Icon: ${category}.${icon}** (${size}, ${framework})\n\n`;
        
        switch (framework.toLowerCase()) {
            case 'react':
                const reactComponent = this.generateReactComponent(category, icon, iconSize);
                result += `**React Component:**\n\`\`\`jsx\n${reactComponent}\n\`\`\`\n\n`;
                break;
            case 'vue':
                const vueComponent = this.generateVueComponent(category, icon, iconSize);
                result += `**Vue Component:**\n\`\`\`vue\n${vueComponent}\n\`\`\`\n\n`;
                break;
            case 'html':
            default:
                result += `**HTML/SVG:**\n\`\`\`html\n${svg}\n\`\`\`\n\n`;
        }
        
        result += `**Raw SVG:**\n\`\`\`svg\n${svg}\n\`\`\``;
        
        return {
            content: [
                {
                    type: 'text',
                    text: result
                }
            ]
        };
    }

    generateReactComponent(category, icon, size) {
        const componentName = `${category.charAt(0).toUpperCase() + category.slice(1)}${icon.charAt(0).toUpperCase() + icon.slice(1)}Icon`;
        
        return `import React from 'react';

export const ${componentName} = ({ className = '', size = ${size}, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    ${this.getIconPaths(category, icon)}
  </svg>
);`;
    }

    generateVueComponent(category, icon, size) {
        const componentName = `${category.charAt(0).toUpperCase() + category.slice(1)}${icon.charAt(0).toUpperCase() + icon.slice(1)}Icon`;
        
        return `<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
    v-bind="$attrs"
  >
    ${this.getIconPaths(category, icon)}
  </svg>
</template>

<script>
export default {
  name: '${componentName}',
  props: {
    size: {
      type: [Number, String],
      default: ${size}
    },
    className: {
      type: String,
      default: ''
    }
  }
}
</script>`;
    }

    getIconPaths(category, icon) {
        const svg = this.icons[category][icon];
        // Extract path elements from SVG
        const pathMatch = svg.match(/<path[^>]*>/g);
        const lineMatch = svg.match(/<line[^>]*>/g);
        const circleMatch = svg.match(/<circle[^>]*>/g);
        const polylineMatch = svg.match(/<polyline[^>]*>/g);
        
        let paths = '';
        if (pathMatch) paths += pathMatch.join('\n    ');
        if (lineMatch) paths += lineMatch.join('\n    ');
        if (circleMatch) paths += circleMatch.join('\n    ');
        if (polylineMatch) paths += polylineMatch.join('\n    ');
        
        return paths || '<!-- Icon paths would go here -->';
    }

    async optimizeSVG(args) {
        const { svg } = args;
        
        if (!svg.includes('<svg')) {
            return {
                content: [
                    {
                        type: 'text',
                        text: '❌ Invalid SVG content provided.'
                    }
                ]
            };
        }
        
        // Basic SVG optimization
        let optimized = svg
            .replace(/\s+/g, ' ') // Remove extra whitespace
            .replace(/>\s+</g, '><') // Remove whitespace between tags
            .replace(/<!--.*?-->/g, '') // Remove comments
            .replace(/\s*\/>/g, '/>') // Clean up self-closing tags
            .trim();
        
        // Remove unnecessary attributes
        optimized = optimized
            .replace(/xmlns="[^"]*"/g, '') // Remove xmlns if not needed
            .replace(/version="[^"]*"/g, '') // Remove version
            .replace(/xml:space="[^"]*"/g, ''); // Remove xml:space
        
        // Add essential attributes if missing
        if (!optimized.includes('xmlns="http://www.w3.org/2000/svg"')) {
            optimized = optimized.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        
        const originalSize = svg.length;
        const optimizedSize = optimized.length;
        const savings = originalSize - optimizedSize;
        const savingsPercent = Math.round((savings / originalSize) * 100);
        
        return {
            content: [
                {
                    type: 'text',
                    text: `🔧 **SVG Optimization Results**\n\n**Original size:** ${originalSize} characters\n**Optimized size:** ${optimizedSize} characters\n**Savings:** ${savings} characters (${savingsPercent}%)\n\n**Optimized SVG:**\n\`\`\`svg\n${optimized}\n\`\`\``
                }
            ]
        };
    }

    async generateComponent(args) {
        const { icon, framework = 'html' } = args;
        
        // Try to find the icon in our library
        let iconData = null;
        let iconName = '';
        
        for (const [category, icons] of Object.entries(this.icons)) {
            for (const [name, svg] of Object.entries(icons)) {
                if (icon.toLowerCase().includes(name.toLowerCase()) || icon.toLowerCase().includes(category.toLowerCase())) {
                    iconData = svg;
                    iconName = `${category}.${name}`;
                    break;
                }
            }
            if (iconData) break;
        }
        
        if (!iconData) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Icon '${icon}' not found in the library.\n\nTry using one of these: ${Object.keys(this.icons).join(', ')}`
                    }
                ]
            };
        }
        
        let result = `🎨 **Generated Component for ${iconName}** (${framework})\n\n`;
        
        switch (framework.toLowerCase()) {
            case 'react':
                const reactComponent = this.generateReactComponent(iconName.split('.')[0], iconName.split('.')[1], 24);
                result += `**React Component:**\n\`\`\`jsx\n${reactComponent}\n\`\`\``;
                break;
            case 'vue':
                const vueComponent = this.generateVueComponent(iconName.split('.')[0], iconName.split('.')[1], 24);
                result += `**Vue Component:**\n\`\`\`vue\n${vueComponent}\n\`\`\``;
                break;
            case 'html':
            default:
                result += `**HTML Component:**\n\`\`\`html\n<div class="icon-container">
  ${iconData}
</div>\n\`\`\``;
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
        console.error('Icon & Assets MCP Server started');
    }
}

// Start the server
const server = new IconAssetsMCPServer();
server.start().catch(console.error);






