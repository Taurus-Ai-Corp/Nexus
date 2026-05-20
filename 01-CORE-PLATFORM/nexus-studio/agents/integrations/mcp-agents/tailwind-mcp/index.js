#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class TaurusResponsiveTailwindMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'taurus-responsive-tailwind-mcp',
                version: '2.0.0',
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
                        name: 'generate_responsive_component',
                        description: 'Generate enterprise-grade responsive UI component with TAURUS design tokens',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                component: {
                                    type: 'string',
                                    description: 'Component type (button, card, input, metric, chart, dashboard-grid, etc.)'
                                },
                                variant: {
                                    type: 'string',
                                    description: 'Component variant (primary, secondary, success, warning, danger, glass, neon)'
                                },
                                size: {
                                    type: 'string',
                                    description: 'Component size (xs, sm, md, lg, xl, 2xl)'
                                },
                                responsive: {
                                    type: 'boolean',
                                    description: 'Generate responsive classes for all breakpoints',
                                    default: true
                                },
                                darkMode: {
                                    type: 'boolean',
                                    description: 'Include dark mode variants',
                                    default: true
                                },
                                animation: {
                                    type: 'string',
                                    description: 'Animation type (none, fade, slide, pulse, glow, data-flow)'
                                }
                            },
                            required: ['component']
                        }
                    },
                    {
                        name: 'generate_responsive_layout',
                        description: 'Generate responsive layout with TAURUS breakpoints and design tokens',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                layoutType: {
                                    type: 'string',
                                    description: 'Layout type (dashboard-grid, competitive-intelligence, metrics-overview, chart-gallery)'
                                },
                                breakpoints: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Target breakpoints (mobile, tablet, desktop, 4k)',
                                    default: ['mobile', 'tablet', 'desktop']
                                },
                                components: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Components to include in layout'
                                }
                            },
                            required: ['layoutType']
                        }
                    },
                    {
                        name: 'optimize_responsive_classes',
                        description: 'Optimize responsive Tailwind classes for performance and consistency',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                classes: {
                                    type: 'string',
                                    description: 'Current Tailwind classes to optimize'
                                },
                                target: {
                                    type: 'string',
                                    description: 'Optimization target (performance, consistency, accessibility)',
                                    default: 'performance'
                                }
                            },
                            required: ['classes']
                        }
                    },
                    {
                        name: 'generate_design_tokens',
                        description: 'Generate TAURUS AI design tokens for competitive intelligence dashboard',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                theme: {
                                    type: 'string',
                                    description: 'Theme variant (intelligence, enterprise, cyberpunk, minimal)',
                                    default: 'intelligence'
                                },
                                includeAnimations: {
                                    type: 'boolean',
                                    description: 'Include animation tokens',
                                    default: true
                                }
                            }
                        }
                    }
                ]
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            
            switch (name) {
                case 'generate_responsive_component':
                    return await this.generateResponsiveComponent(args);
                case 'generate_responsive_layout':
                    return await this.generateResponsiveLayout(args);
                case 'optimize_responsive_classes':
                    return await this.optimizeResponsiveClasses(args);
                case 'generate_design_tokens':
                    return await this.generateDesignTokens(args);
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });

        // Handle resource requests
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: 'taurus://design-tokens',
                        name: 'TAURUS Design Tokens',
                        description: 'Enterprise design tokens for competitive intelligence dashboard',
                        mimeType: 'application/json'
                    },
                    {
                        uri: 'taurus://responsive-components',
                        name: 'Responsive Components',
                        description: 'Enterprise-grade responsive components library',
                        mimeType: 'application/json'
                    },
                    {
                        uri: 'taurus://breakpoint-system',
                        name: 'Breakpoint System',
                        description: 'TAURUS responsive breakpoint configuration',
                        mimeType: 'application/json'
                    }
                ]
            };
        });
    }

    async generateResponsiveComponent(args) {
        const { 
            component = 'button', 
            variant = 'primary', 
            size = 'md', 
            responsive = true,
            darkMode = true,
            animation = 'none'
        } = args;
        
        let classes = '';
        let html = '';
        let css = '';
        
        switch (component.toLowerCase()) {
            case 'metric-card':
                classes = this.generateMetricCardClasses(variant, size, responsive, darkMode, animation);
                html = this.generateMetricCardHTML(variant, size);
                css = this.generateMetricCardCSS();
                break;
            case 'dashboard-grid':
                classes = this.generateDashboardGridClasses(responsive);
                html = this.generateDashboardGridHTML();
                css = this.generateDashboardGridCSS();
                break;
            case 'competitor-card':
                classes = this.generateCompetitorCardClasses(variant, size, responsive, darkMode);
                html = this.generateCompetitorCardHTML(variant);
                css = this.generateCompetitorCardCSS();
                break;
            case 'intelligence-chart':
                classes = this.generateChartClasses(variant, size, responsive);
                html = this.generateChartHTML(variant);
                css = this.generateChartCSS();
                break;
            case 'responsive-button':
                classes = this.generateResponsiveButtonClasses(variant, size, responsive, darkMode, animation);
                html = this.generateResponsiveButtonHTML(variant, size);
                break;
            default:
                classes = this.generateDefaultResponsiveClasses(component, variant, size, responsive);
                html = `<div class="${classes}">${component}</div>`;
        }
        
        return {
            content: [
                {
                    type: 'text',
                    text: `🚀 Generated TAURUS ${component} component:\n\n**Responsive Classes:**\n\`${classes}\`\n\n**HTML:**\n\`\`\`html\n${html}\n\`\`\`${css ? `\n\n**Custom CSS (if needed):**\n\`\`\`css\n${css}\n\`\`\`` : ''}`
                }
            ]
        };
    }

    generateMetricCardCSS() {
        return `.taurus-metric-card {
  background: linear-gradient(135deg, 
    var(--taurus-bg-secondary) 0%, 
    var(--taurus-bg-primary) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.taurus-metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    var(--taurus-primary-500), 
    var(--taurus-primary-600));
}`;
    }
    
    generateDashboardGridCSS() {
        return `.taurus-dashboard-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (min-width: 768px) {
  .taurus-dashboard-grid {
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@media (min-width: 1024px) {
  .taurus-dashboard-grid {
    gap: 2rem;
    grid-template-columns: repeat(4, 1fr);
  }
}`;
    }
    
    generateCompetitorCardCSS() {
        return `.taurus-competitor-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.taurus-competitor-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.taurus-competitor-card.monitoring {
  border-left: 4px solid var(--taurus-success-500);
}

.taurus-competitor-card.threat {
  border-left: 4px solid var(--taurus-danger-500);
}`;
    }
    
    generateChartClasses(variant, size, responsive) {
        let classes = 'backdrop-blur-lg bg-slate-900/95 border border-slate-600/50 rounded-xl';
        
        if (responsive) {
            classes += ' w-full h-64 sm:h-80 lg:h-96';
            classes += ' p-4 sm:p-6';
        } else {
            classes += ' w-full h-80 p-6';
        }
        
        return classes;
    }
    
    generateChartHTML(variant) {
        return `<div class="${this.generateChartClasses(variant, 'md', true)}">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg sm:text-xl font-semibold text-white">Market Intelligence</h3>
    <div class="flex items-center space-x-2">
      <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span class="text-xs sm:text-sm text-slate-400">Live Data</span>
    </div>
  </div>
  
  <!-- Chart container -->
  <div class="relative h-48 sm:h-56 lg:h-64">
    <canvas id="intelligenceChart" class="w-full h-full"></canvas>
  </div>
  
  <!-- Chart legend -->
  <div class="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm">
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 bg-blue-500 rounded"></div>
      <span class="text-slate-300">Market Share</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 bg-red-500 rounded"></div>
      <span class="text-slate-300">Threats</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 bg-green-500 rounded"></div>
      <span class="text-slate-300">Opportunities</span>
    </div>
  </div>
</div>`;
    }
    
    generateChartCSS() {
        return `.taurus-chart-container {
  position: relative;
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.95) 0%, 
    rgba(30, 41, 59, 0.9) 100%);
}

.taurus-chart-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, 
    rgba(59, 130, 246, 0.1) 0%, 
    transparent 70%);
  pointer-events: none;
}`;
    }
    
    getCompetitiveIntelligenceLayout(breakpoints) {
        return 'min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8';
    }
    
    getCompetitiveIntelligenceHTML() {
        return `<!-- TAURUS Competitive Intelligence Layout -->
<div class="${this.getCompetitiveIntelligenceLayout()}">
  <!-- Intelligence Header -->
  <div class="backdrop-blur-lg bg-slate-900/90 border border-slate-600/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Primary Metrics -->
      <div class="lg:col-span-2">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Competitive Intelligence</h1>
        <p class="text-sm sm:text-base text-slate-400">Real-time market surveillance and analysis</p>
      </div>
      
      <!-- Status Panel -->
      <div class="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-xs sm:text-sm text-green-400">12 Active Monitors</span>
        </div>
        <div class="text-xs sm:text-sm text-slate-500 font-mono">
          Last update: 2m ago
        </div>
      </div>
    </div>
  </div>
  
  <!-- Main Intelligence Grid -->
  <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">
    <!-- Competitor Overview -->
    <div class="xl:col-span-3">
      <!-- Threat Level Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <!-- High, Medium, Low threat cards -->
      </div>
      
      <!-- Market Position Chart -->
      <div class="backdrop-blur-lg bg-slate-900/95 border border-slate-600/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 class="text-lg sm:text-xl font-semibold text-white mb-4">Market Positioning Matrix</h2>
        <div class="h-64 sm:h-80 lg:h-96">
          <!-- Positioning chart goes here -->
        </div>
      </div>
    </div>
    
    <!-- Intelligence Sidebar -->
    <div class="xl:col-span-1">
      <!-- Active Competitors -->
      <div class="backdrop-blur-lg bg-slate-900/95 border border-slate-600/50 rounded-xl p-4 sm:p-6 mb-6">
        <h3 class="text-base sm:text-lg font-semibold text-white mb-4">Active Competitors</h3>
        <div class="space-y-3 sm:space-y-4">
          <!-- Competitor cards go here -->
        </div>
      </div>
      
      <!-- AI Insights -->
      <div class="backdrop-blur-lg bg-slate-900/95 border border-slate-600/50 rounded-xl p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-semibold text-white mb-4">AI Insights</h3>
        <div class="space-y-3 sm:space-y-4">
          <!-- AI insight cards go here -->
        </div>
      </div>
    </div>
  </div>
</div>`;
    }
    
    getCompetitiveIntelligenceGuidelines() {
        return `**🎯 Competitive Intelligence Layout:**
- Mobile: Single column, stacked components
- Tablet: 2-3 column metrics, main content stacked
- Desktop: 4-column grid with 3/4 + 1/4 sidebar layout
- Ultra-wide: Enhanced spacing for executive displays

**🔍 Intelligence-Specific Features:**
- Real-time status indicators with pulse animations
- Threat level color coding (red, yellow, green)
- Glassmorphism cards for premium feel
- Responsive chart containers that scale properly

**📊 Data Visualization:**
- Mobile: Simplified charts with essential data
- Tablet: Enhanced charts with more detail
- Desktop: Full-featured interactive charts
- 4K: High-resolution charts for presentations`;
    }
    
    getMetricsOverviewLayout(breakpoints) {
        return 'grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6';
    }
    
    getMetricsOverviewHTML() {
        return `<!-- TAURUS Metrics Overview Layout -->
<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 lg:p-8">
  <!-- Metrics Grid -->
  <div class="${this.getMetricsOverviewLayout()}">
    <!-- Key Performance Indicators -->
    <div class="sm:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-6">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Performance Overview</h1>
      <p class="text-slate-400 mb-6 sm:mb-8">Real-time business intelligence metrics</p>
    </div>
    
    <!-- Revenue Metrics -->
    <div class="backdrop-blur-lg bg-slate-900/95 border border-emerald-500/30 rounded-xl p-4 sm:p-6">
      <div class="flex items-center space-x-3 mb-4">
        <div class="p-2 bg-emerald-500/20 rounded-lg">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <div>
          <p class="text-xs text-slate-400 uppercase tracking-wider">Revenue</p>
          <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-white">$2.3M</p>
        </div>
      </div>
      <div class="text-xs sm:text-sm text-emerald-400">+15.3% vs last month</div>
    </div>
    
    <!-- User Growth -->
    <div class="backdrop-blur-lg bg-slate-900/95 border border-blue-500/30 rounded-xl p-4 sm:p-6">
      <div class="flex items-center space-x-3 mb-4">
        <div class="p-2 bg-blue-500/20 rounded-lg">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <div>
          <p class="text-xs text-slate-400 uppercase tracking-wider">Users</p>
          <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-white">12.5K</p>
        </div>
      </div>
      <div class="text-xs sm:text-sm text-blue-400">+8.7% growth rate</div>
    </div>
    
    <!-- Continue with more metric cards... -->
  </div>
</div>`;
    }
    
    getMetricsOverviewGuidelines() {
        return `**📊 Metrics Overview Layout:**
- Mobile: Single column, stacked metrics
- Small tablet: 2-column grid
- Large tablet: 3-column grid
- Desktop: 4-column grid
- Ultra-wide: 6-column grid for executive dashboards

**🎨 Visual Hierarchy:**
- Color-coded metric categories
- Consistent icon system
- Progressive disclosure on mobile
- Emphasis on key performance indicators

**📱 Mobile Optimizations:**
- Larger touch targets
- Simplified metric displays
- Swipe gestures for navigation
- Collapsible detail sections`;
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('🚀 TAURUS Responsive Tailwind MCP Server started - Ready for enterprise dashboard design!');
    }
}

    // Advanced responsive component generators
    generateMetricCardClasses(variant, size, responsive, darkMode, animation) {
        let classes = 'relative overflow-hidden border';
        
        // Base responsive classes
        if (responsive) {
            classes += ' w-full sm:w-auto';
        }
        
        // Size classes with responsive scaling
        switch (size) {
            case 'xs':
                classes += responsive ? ' p-3 sm:p-4' : ' p-3';
                break;
            case 'sm':
                classes += responsive ? ' p-4 sm:p-5' : ' p-4';
                break;
            case 'lg':
                classes += responsive ? ' p-6 sm:p-7 lg:p-8' : ' p-6';
                break;
            case 'xl':
                classes += responsive ? ' p-7 sm:p-8 lg:p-10' : ' p-7';
                break;
            default: // md
                classes += responsive ? ' p-5 sm:p-6' : ' p-5';
        }
        
        // Variant classes with TAURUS design tokens
        switch (variant) {
            case 'primary':
                classes += ' bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30';
                if (darkMode) classes += ' dark:from-slate-800 dark:to-slate-700';
                break;
            case 'glass':
                classes += ' backdrop-blur-lg bg-slate-900/90 border-slate-600/50';
                if (darkMode) classes += ' dark:bg-slate-800/90';
                break;
            case 'neon':
                classes += ' bg-slate-900 border-cyan-400/50 shadow-lg shadow-cyan-400/20';
                break;
            case 'success':
                classes += ' bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-500/30';
                break;
            case 'warning':
                classes += ' bg-gradient-to-br from-amber-900 to-amber-800 border-amber-500/30';
                break;
            case 'danger':
                classes += ' bg-gradient-to-br from-red-900 to-red-800 border-red-500/30';
                break;
            default:
                classes += ' bg-gradient-to-br from-slate-900 to-slate-800 border-slate-600/30';
        }
        
        // Animation classes
        switch (animation) {
            case 'pulse':
                classes += ' animate-pulse-slow';
                break;
            case 'glow':
                classes += ' hover:shadow-xl hover:shadow-blue-500/25 transition-shadow duration-300';
                break;
            case 'data-flow':
                classes += ' relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-blue-400/20 before:to-transparent before:translate-x-[-100%] hover:before:animate-pulse';
                break;
        }
        
        // Responsive text and layout
        if (responsive) {
            classes += ' rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105';
        } else {
            classes += ' rounded-xl';
        }
        
        return classes;
    }
    
    generateMetricCardHTML(variant, size) {
        return `<div class="${this.generateMetricCardClasses(variant, size, true, true, 'glow')}">
  <!-- Metric Header -->
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-3">
      <div class="p-2 bg-blue-500/20 rounded-lg">
        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-slate-400 uppercase tracking-wider">Intelligence Score</p>
        <p class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">94.7</p>
      </div>
    </div>
    <div class="text-right">
      <span class="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+2.3%</span>
    </div>
  </div>
  
  <!-- Progress Bar -->
  <div class="w-full bg-slate-700/50 rounded-full h-2">
    <div class="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style="width: 94.7%"></div>
  </div>
  
  <!-- Footer -->
  <div class="mt-3 text-xs text-slate-500">
    Last updated: <span class="text-slate-400">2 minutes ago</span>
  </div>
</div>`;
    }
    
    generateDashboardGridClasses(responsive) {
        let classes = 'grid gap-4 sm:gap-6 lg:gap-8';
        
        if (responsive) {
            // Mobile-first responsive grid
            classes += ' grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
            classes += ' auto-rows-auto';
        } else {
            classes += ' grid-cols-4';
        }
        
        return classes;
    }
    
    generateDashboardGridHTML() {
        return `<div class="${this.generateDashboardGridClasses(true)}">
  <!-- Grid items will be automatically responsive -->
  <div class="col-span-1 sm:col-span-2 lg:col-span-1"><!-- Metric Card 1 --></div>
  <div class="col-span-1"><!-- Metric Card 2 --></div>
  <div class="col-span-1"><!-- Metric Card 3 --></div>
  <div class="col-span-1 sm:col-span-2 lg:col-span-1"><!-- Metric Card 4 --></div>
  
  <!-- Chart Section -->
  <div class="col-span-1 sm:col-span-2 lg:col-span-3"><!-- Main Chart --></div>
  <div class="col-span-1 sm:col-span-2 lg:col-span-1"><!-- Side Panel --></div>
</div>`;
    }
    
    generateCompetitorCardClasses(variant, size, responsive, darkMode) {
        let classes = 'group cursor-pointer transition-all duration-300 border rounded-xl overflow-hidden';
        
        // Responsive sizing
        if (responsive) {
            classes += ' p-4 sm:p-5 lg:p-6';
        } else {
            classes += ' p-5';
        }
        
        // Variant styling
        switch (variant) {
            case 'monitoring':
                classes += ' bg-slate-900/95 border-green-500/30 hover:border-green-400/50';
                break;
            case 'threat':
                classes += ' bg-slate-900/95 border-red-500/30 hover:border-red-400/50';
                break;
            case 'opportunity':
                classes += ' bg-slate-900/95 border-blue-500/30 hover:border-blue-400/50';
                break;
            default:
                classes += ' bg-slate-900/95 border-slate-600/30 hover:border-slate-500/50';
        }
        
        // Hover effects
        classes += ' hover:scale-102 hover:shadow-xl hover:shadow-black/20';
        
        return classes;
    }
    
    generateCompetitorCardHTML(variant) {
        const statusColors = {
            monitoring: 'text-green-400 bg-green-400/10',
            threat: 'text-red-400 bg-red-400/10',
            opportunity: 'text-blue-400 bg-blue-400/10'
        };
        
        const statusColor = statusColors[variant] || 'text-slate-400 bg-slate-400/10';
        
        return `<div class="${this.generateCompetitorCardClasses(variant, 'md', true, true)}">
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
        TC
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-semibold text-white">TechCorp Solutions</h3>
        <p class="text-xs sm:text-sm text-slate-400">Enterprise Software</p>
      </div>
    </div>
    <span class="text-xs px-2 py-1 rounded-full ${statusColor} capitalize">${variant}</span>
  </div>
  
  <div class="grid grid-cols-2 gap-4 text-center">
    <div>
      <p class="text-lg sm:text-xl font-bold text-white">73%</p>
      <p class="text-xs text-slate-500">Market Share</p>
    </div>
    <div>
      <p class="text-lg sm:text-xl font-bold text-white">$2.3B</p>
      <p class="text-xs text-slate-500">Revenue</p>
    </div>
  </div>
  
  <div class="mt-4 flex items-center justify-between text-xs text-slate-500">
    <span>Updated 5m ago</span>
    <svg class="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </div>
</div>`;
    }
    
    generateResponsiveButtonClasses(variant, size, responsive, darkMode, animation) {
        let classes = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
        
        // Responsive sizing
        if (responsive) {
            switch (size) {
                case 'xs':
                    classes += ' px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm';
                    break;
                case 'sm':
                    classes += ' px-3 py-1.5 text-sm sm:px-4 sm:py-2';
                    break;
                case 'lg':
                    classes += ' px-5 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg';
                    break;
                case 'xl':
                    classes += ' px-6 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl';
                    break;
                default: // md
                    classes += ' px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base';
            }
        }
        
        // Variant classes with TAURUS design tokens
        switch (variant) {
            case 'primary':
                classes += ' bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500';
                break;
            case 'glass':
                classes += ' backdrop-blur-sm bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:ring-white/50';
                break;
            case 'neon':
                classes += ' bg-transparent text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10 hover:shadow-lg hover:shadow-cyan-400/25 focus:ring-cyan-400';
                break;
            case 'success':
                classes += ' bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500';
                break;
            case 'danger':
                classes += ' bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500';
                break;
            default:
                classes += ' bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 focus:ring-slate-500';
        }
        
        // Animation classes
        if (animation === 'pulse') {
            classes += ' animate-pulse-slow';
        } else if (animation === 'glow') {
            classes += ' hover:shadow-xl';
        }
        
        // Responsive border radius
        classes += responsive ? ' rounded-md sm:rounded-lg' : ' rounded-lg';
        
        return classes;
    }
    
    generateResponsiveButtonHTML(variant, size) {
        return `<button class="${this.generateResponsiveButtonClasses(variant, size, true, true, 'glow')}">
  <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
  </svg>
  <span class="hidden sm:inline">Analyze Intelligence</span>
  <span class="sm:hidden">Analyze</span>
</button>`;
    }
    
    generateDefaultResponsiveClasses(component, variant, size, responsive) {
        let classes = 'block w-full';
        
        if (responsive) {
            classes += ' text-sm sm:text-base lg:text-lg';
            classes += ' p-3 sm:p-4 lg:p-5';
            classes += ' rounded-lg sm:rounded-xl';
        } else {
            classes += ' text-base p-4 rounded-xl';
        }
        
        // Default styling
        classes += ' bg-slate-900/95 border border-slate-600/30 text-white';
        
        return classes;
    }
    
    async generateResponsiveLayout(args) {
        const { layoutType, breakpoints = ['mobile', 'tablet', 'desktop'], components = [] } = args;
        
        let layoutClasses = '';
        let layoutHTML = '';
        let guidelines = '';
        
        switch (layoutType) {
            case 'dashboard-grid':
                layoutClasses = this.getDashboardGridLayout(breakpoints);
                layoutHTML = this.getDashboardGridHTML();
                guidelines = this.getDashboardGridGuidelines();
                break;
            case 'competitive-intelligence':
                layoutClasses = this.getCompetitiveIntelligenceLayout(breakpoints);
                layoutHTML = this.getCompetitiveIntelligenceHTML();
                guidelines = this.getCompetitiveIntelligenceGuidelines();
                break;
            case 'metrics-overview':
                layoutClasses = this.getMetricsOverviewLayout(breakpoints);
                layoutHTML = this.getMetricsOverviewHTML();
                guidelines = this.getMetricsOverviewGuidelines();
                break;
            default:
                layoutClasses = 'grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
                layoutHTML = '<div class="' + layoutClasses + '"><!-- Your content here --></div>';
                guidelines = 'Standard responsive grid layout';
        }
        
        return {
            content: [
                {
                    type: 'text',
                    text: `📱 Generated responsive ${layoutType} layout:\n\n**Layout Classes:**\n\`${layoutClasses}\`\n\n**HTML Structure:**\n\`\`\`html\n${layoutHTML}\n\`\`\`\n\n**📋 Implementation Guidelines:**\n${guidelines}\n\n**🎯 Breakpoints Optimized For:**\n${breakpoints.map(bp => `- ${bp.charAt(0).toUpperCase() + bp.slice(1)}`).join('\n')}`
                }
            ]
        };
    }
    
    getDashboardGridLayout(breakpoints) {
        return 'min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8';
    }
    
    getDashboardGridHTML() {
        return `<!-- TAURUS AI Competitive Intelligence Dashboard -->
<div class="${this.getDashboardGridLayout()}">
  <!-- Header -->
  <header class="mb-6 sm:mb-8">
    <div class="backdrop-blur-lg bg-slate-900/90 border border-slate-600/50 rounded-xl p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Intelligence Dashboard</h1>
          <p class="text-sm sm:text-base text-slate-400 mt-1">Real-time competitive analysis</p>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-4">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-xs sm:text-sm text-slate-300">Live</span>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Metrics Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
    <!-- Metric cards will go here -->
  </div>
  
  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
    <!-- Charts Section -->
    <div class="lg:col-span-2">
      <!-- Chart components -->
    </div>
    
    <!-- Sidebar -->
    <div class="lg:col-span-1">
      <!-- AI insights and competitor cards -->
    </div>
  </div>
</div>`;
    }
    
    getDashboardGridGuidelines() {
        return `**📐 Layout Structure:**
- Mobile: Single column, stacked layout
- Tablet: 2-column metrics, main content stacked
- Desktop: 4-column metrics, 2/3 + 1/3 main layout
- 4K: Enhanced spacing and typography scaling

**🎨 Design Tokens Used:**
- Background: Gradient from slate-900 to slate-800
- Glass morphism: backdrop-blur-lg with bg-slate-900/90
- Borders: slate-600/50 for subtle definition
- Spacing: Responsive padding (p-4 → sm:p-6 → lg:p-8)

**♿ Accessibility:**
- Focus indicators on interactive elements
- High contrast ratios (WCAG AA compliant)
- Proper heading hierarchy
- Screen reader friendly structure`;
    }
    
    async generateDesignTokens(args) {
        const { theme = 'intelligence', includeAnimations = true } = args;
        
        const tokens = this.getTaurusDesignTokens(theme, includeAnimations);
        
        return {
            content: [
                {
                    type: 'text',
                    text: `🎨 TAURUS AI Design Tokens (${theme} theme):\n\n**CSS Custom Properties:**\n\`\`\`css\n${tokens.css}\n\`\`\`\n\n**Tailwind Config Extension:**\n\`\`\`javascript\n${tokens.tailwindConfig}\n\`\`\`\n\n**Usage Examples:**\n${tokens.examples}`
                }
            ]
        };
    }
    
    getTaurusDesignTokens(theme, includeAnimations) {
        const baseTokens = {
            css: `:root {
  /* TAURUS AI Brand Colors */
  --taurus-primary-50: #eff6ff;
  --taurus-primary-500: #3b82f6;
  --taurus-primary-600: #2563eb;
  --taurus-primary-900: #1e3a8a;
  
  /* Intelligence Theme */
  --taurus-bg-primary: #0f172a;
  --taurus-bg-secondary: #1e293b;
  --taurus-bg-glass: rgba(15, 23, 42, 0.95);
  
  /* Success/Warning/Danger */
  --taurus-success-500: #10b981;
  --taurus-warning-500: #f59e0b;
  --taurus-danger-500: #ef4444;
  
  /* Typography */
  --taurus-font-sans: 'Inter', system-ui, sans-serif;
  --taurus-font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing Scale */
  --taurus-space-xs: 0.25rem;
  --taurus-space-sm: 0.5rem;
  --taurus-space-md: 1rem;
  --taurus-space-lg: 1.5rem;
  --taurus-space-xl: 2rem;
  
  /* Border Radius */
  --taurus-radius-sm: 0.375rem;
  --taurus-radius-md: 0.5rem;
  --taurus-radius-lg: 0.75rem;
  --taurus-radius-xl: 1rem;
  
  /* Shadows */
  --taurus-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --taurus-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --taurus-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --taurus-shadow-glow: 0 0 20px rgb(59 130 246 / 0.4);
}`,
            tailwindConfig: `// Extend your tailwind.config.js
{
  theme: {
    extend: {
      colors: {
        taurus: {
          primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            600: '#2563eb',
            900: '#1e3a8a'
          },
          bg: {
            primary: '#0f172a',
            secondary: '#1e293b',
            glass: 'rgba(15, 23, 42, 0.95)'
          }
        }
      },
      fontFamily: {
        'taurus-sans': ['Inter', 'system-ui', 'sans-serif'],
        'taurus-mono': ['JetBrains Mono', 'monospace']
      },
      spacing: {
        'taurus-xs': '0.25rem',
        'taurus-sm': '0.5rem',
        'taurus-md': '1rem',
        'taurus-lg': '1.5rem',
        'taurus-xl': '2rem'
      },
      borderRadius: {
        'taurus-sm': '0.375rem',
        'taurus-md': '0.5rem',
        'taurus-lg': '0.75rem',
        'taurus-xl': '1rem'
      },
      boxShadow: {
        'taurus-glow': '0 0 20px rgb(59 130 246 / 0.4)'
      }${includeAnimations ? `,
      animation: {
        'taurus-pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'taurus-fade-in': 'fadeIn 0.6s ease-in-out',
        'taurus-slide-up': 'slideUp 0.6s ease-out',
        'taurus-data-flow': 'dataFlow 2s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        dataFlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }` : ''}
    }
  }
}`,
            examples: `**🔧 Usage Examples:**

1. **Metric Card:**
   \`bg-taurus-bg-glass border border-taurus-primary-500/30 rounded-taurus-xl\`

2. **Responsive Button:**
   \`bg-gradient-to-r from-taurus-primary-500 to-taurus-primary-600 px-4 py-2 sm:px-6 sm:py-3\`

3. **Dashboard Container:**
   \`min-h-screen bg-gradient-to-br from-taurus-bg-primary to-taurus-bg-secondary p-taurus-md sm:p-taurus-lg\`

4. **Glass Card:**
   \`backdrop-blur-lg bg-taurus-bg-glass border border-slate-600/50 rounded-taurus-xl shadow-taurus-glow\`${includeAnimations ? `

5. **Animated Elements:**
   \`animate-taurus-fade-in hover:animate-taurus-pulse\`` : ''}`
        };
        
        return baseTokens;
    }
    
    async optimizeResponsiveClasses(args) {
        const { classes, target = 'performance' } = args;
        
        let optimizations = [];
        let suggestions = [];
        
        // Analyze classes for common responsive optimization opportunities
        if (classes.includes('px-4') && classes.includes('py-4') && !classes.includes('p-4')) {
            optimizations.push('Combine `px-4 py-4` into `p-4` for cleaner code');
        }
        
        if (classes.includes('w-full') && classes.includes('sm:w-auto') && classes.includes('lg:w-full')) {
            suggestions.push('Consider using `w-full lg:w-auto xl:w-full` for better tablet experience');
        }
        
        // Check for missing responsive variants
        if (classes.includes('text-sm') && !classes.includes('sm:text-base')) {
            suggestions.push('Add responsive typography: `text-sm sm:text-base lg:text-lg`');
        }
        
        if (classes.includes('p-4') && !classes.includes('sm:p-')) {
            suggestions.push('Add responsive padding: `p-4 sm:p-6 lg:p-8`');
        }
        
        // Performance optimizations
        if (target === 'performance') {
            if (classes.includes('transition-all')) {
                optimizations.push('Replace `transition-all` with specific properties like `transition-colors duration-200` for better performance');
            }
        }
        
        // Consistency optimizations
        if (target === 'consistency') {
            if (classes.includes('rounded-lg') && classes.includes('rounded-xl')) {
                optimizations.push('Use consistent border radius - pick either `rounded-lg` or `rounded-xl`');
            }
        }
        
        let result = `🔧 **Responsive Class Optimization**\n\n**Input:** \`${classes}\`\n\n`;
        
        if (optimizations.length > 0) {
            result += '**✅ Optimizations:**\n' + optimizations.map(opt => `- ${opt}`).join('\n') + '\n\n';
        }
        
        if (suggestions.length > 0) {
            result += '**💡 Suggestions:**\n' + suggestions.map(sug => `- ${sug}`).join('\n') + '\n\n';
        }
        
        if (optimizations.length === 0 && suggestions.length === 0) {
            result += '✨ Your responsive classes look well-optimized!';
        }
        
        result += `\n**🎯 Optimization Target:** ${target.charAt(0).toUpperCase() + target.slice(1)}`;
        
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
        console.error('🚀 TAURUS Responsive Tailwind MCP Server started - Ready for enterprise dashboard design!');
    }
}

// Start the server
const server = new TaurusResponsiveTailwindMCPServer();
server.start().catch(console.error);
