import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

// Webflow Dashboard API Step - Serves the world-class dashboard
export const config: ApiRouteConfig = {
  type: 'api',
  name: 'GetWebflowDashboard',
  description: 'Serves the world-class Webflow-powered analytics dashboard',
  method: 'GET',
  path: '/dashboard',
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      html: z.string(),
      css: z.string(),
      js: z.string(),
      metadata: z.object({
        title: z.string(),
        description: z.string(),
        version: z.string(),
        lastUpdated: z.string()
      })
    })
  },
  emits: ['dashboard.served', 'webflow.template.rendered'],
  flows: ['dashboard-serving', 'webflow-integration']
}

export const handler: Handlers['GetWebflowDashboard'] = async (req, { emit, logger, state }) => {
  try {
    logger.info('Generating world-class Webflow dashboard')
    
    // Get latest analytics data
    const businessData = await state.get('analytics', 'business')
    const agentData = await state.get('agents', 'performance')
    
    // Generate world-class HTML using Webflow design principles
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TAURUS AI CORP - World-Class Analytics Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/dashboard.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/date-fns@2.29.3/index.min.js"></script>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <div class="logo">
                    <div class="logo-icon">🏰</div>
                    <span class="logo-text">TAURUS AI CORP</span>
                </div>
            </div>
            <div class="nav-actions">
                <div class="connection-status">
                    <div class="status-indicator connected"></div>
                    <span>Connected</span>
                </div>
                <div class="view-toggle">
                    <button class="toggle-btn active" data-view="overview">Overview</button>
                    <button class="toggle-btn" data-view="agents">Agents</button>
                    <button class="toggle-btn" data-view="analytics">Analytics</button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Dashboard -->
    <main class="dashboard">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">World-Class Analytics Dashboard</h1>
                <p class="hero-subtitle">Real-time insights from your 200+ AI agents and MCP tools</p>
                <div class="hero-stats">
                    <div class="stat-item">
                        <span class="stat-number">${businessData?.revenue?.total || 0}</span>
                        <span class="stat-label">Total Revenue</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${businessData?.users?.total || 0}</span>
                        <span class="stat-label">Active Users</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${Object.keys(agentData || {}).length}</span>
                        <span class="stat-label">AI Agents</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Metrics Grid -->
        <section class="metrics-grid">
            <div class="metric-card primary">
                <div class="metric-header">
                    <h3>Total Revenue</h3>
                    <div class="metric-icon">💰</div>
                </div>
                <div class="metric-value">$${businessData?.revenue?.total?.toLocaleString() || '0'}</div>
                <div class="metric-trend positive">
                    <span class="trend-icon">↗</span>
                    <span>+${businessData?.revenue?.growth || 0}%</span>
                </div>
                <div class="metric-subtitle">This month</div>
            </div>

            <div class="metric-card success">
                <div class="metric-header">
                    <h3>Active Users</h3>
                    <div class="metric-icon">👥</div>
                </div>
                <div class="metric-value">${businessData?.users?.active?.toLocaleString() || '0'}</div>
                <div class="metric-trend positive">
                    <span class="trend-icon">↗</span>
                    <span>+${businessData?.users?.growth || 0}%</span>
                </div>
                <div class="metric-subtitle">Currently online</div>
            </div>

            <div class="metric-card warning">
                <div class="metric-header">
                    <h3>AI Agents</h3>
                    <div class="metric-icon">🤖</div>
                </div>
                <div class="metric-value">${Object.keys(agentData || {}).length}</div>
                <div class="metric-trend neutral">
                    <span class="trend-icon">→</span>
                    <span>0%</span>
                </div>
                <div class="metric-subtitle">Deployed agents</div>
            </div>

            <div class="metric-card info">
                <div class="metric-header">
                    <h3>System Health</h3>
                    <div class="metric-icon">⚡</div>
                </div>
                <div class="metric-value">${businessData?.system?.health || 0}%</div>
                <div class="metric-trend positive">
                    <span class="trend-icon">↗</span>
                    <span>+2.1%</span>
                </div>
                <div class="metric-subtitle">Uptime</div>
            </div>
        </section>

        <!-- Charts Section -->
        <section class="charts-section">
            <div class="chart-container">
                <h3>Revenue Over Time</h3>
                <canvas id="revenueChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>User Growth</h3>
                <canvas id="userChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Agent Performance</h3>
                <canvas id="agentChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>System Health Distribution</h3>
                <canvas id="systemChart"></canvas>
            </div>
        </section>

        <!-- Real-time Alerts -->
        <section class="alerts-section">
            <div class="alerts-header">
                <h3>System Alerts</h3>
                <div class="alert-badge">${businessData?.alerts?.length || 0} new</div>
            </div>
            <div class="alerts-list">
                ${(businessData?.alerts || []).map(alert => `
                    <div class="alert-item ${alert.severity}">
                        <div class="alert-icon">${alert.type === 'warning' ? '⚠️' : alert.type === 'error' ? '❌' : 'ℹ️'}</div>
                        <div class="alert-content">
                            <div class="alert-title">${alert.title}</div>
                            <div class="alert-message">${alert.message}</div>
                            <div class="alert-meta">
                                <span class="alert-source">${alert.source}</span>
                                <span class="alert-time">${new Date(alert.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                        <button class="alert-action">Acknowledge</button>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Real-time Metrics -->
        <section class="realtime-metrics">
            <div class="metric-item">
                <div class="metric-label">Response Time</div>
                <div class="metric-value">${businessData?.system?.performance?.responseTime || 0}ms</div>
            </div>
            <div class="metric-item">
                <div class="metric-label">Throughput</div>
                <div class="metric-value">${businessData?.system?.performance?.throughput || 0}/min</div>
            </div>
            <div class="metric-item">
                <div class="metric-label">Error Rate</div>
                <div class="metric-value">${businessData?.system?.performance?.errorRate || 0}%</div>
            </div>
        </section>
    </main>

    <script src="/dashboard.js"></script>
</body>
</html>`

    // Generate world-class CSS
    const css = `
/* World-Class Dashboard Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #1a202c;
}

.navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo-icon {
    font-size: 2rem;
}

.logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.connection-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: 2rem;
}

.status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.view-toggle {
    display: flex;
    gap: 0.5rem;
}

.toggle-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
}

.toggle-btn.active {
    background: #667eea;
    color: white;
}

.dashboard {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

.hero-section {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
}

.hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: 2rem;
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 2rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 1rem;
    opacity: 0.8;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.metric-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.metric-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
}

.metric-icon {
    font-size: 1.5rem;
}

.metric-value {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #1a202c;
}

.metric-trend {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.metric-trend.positive {
    color: #10b981;
}

.metric-trend.negative {
    color: #ef4444;
}

.metric-trend.neutral {
    color: #6b7280;
}

.trend-icon {
    font-size: 1rem;
}

.metric-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
}

.charts-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.chart-container {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a202c;
}

.alerts-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.alerts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.alerts-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
}

.alert-badge {
    background: #ef4444;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
}

.alerts-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.alert-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid;
}

.alert-item.warning {
    background: #fef3c7;
    border-left-color: #f59e0b;
}

.alert-item.error {
    background: #fee2e2;
    border-left-color: #ef4444;
}

.alert-item.info {
    background: #dbeafe;
    border-left-color: #3b82f6;
}

.alert-icon {
    font-size: 1.5rem;
}

.alert-content {
    flex: 1;
}

.alert-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #1a202c;
}

.alert-message {
    color: #6b7280;
    margin-bottom: 0.5rem;
}

.alert-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #9ca3af;
}

.alert-action {
    padding: 0.5rem 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    transition: background 0.2s;
}

.alert-action:hover {
    background: #5a67d8;
}

.realtime-metrics {
    display: flex;
    justify-content: space-around;
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.metric-item {
    text-align: center;
}

.metric-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
}

.metric-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a202c;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-stats {
        flex-direction: column;
        gap: 1rem;
    }
    
    .metrics-grid {
        grid-template-columns: 1fr;
    }
    
    .charts-section {
        grid-template-columns: 1fr;
    }
    
    .realtime-metrics {
        flex-direction: column;
        gap: 1rem;
    }
}
`

    // Generate JavaScript for interactivity
    const js = `
// World-Class Dashboard JavaScript
class TaurusDashboard {
    constructor() {
        this.charts = {};
        this.ws = null;
        this.init();
    }

    init() {
        this.setupCharts();
        this.setupWebSocket();
        this.setupEventListeners();
        this.startDataRefresh();
    }

    setupCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            this.charts.revenue = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue',
                        data: [12000, 19000, 15000, 25000, 22000, 30000],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // User Growth Chart
        const userCtx = document.getElementById('userChart');
        if (userCtx) {
            this.charts.users = new Chart(userCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Users',
                        data: [150, 200, 180, 250, 300, 350],
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Agent Performance Chart
        const agentCtx = document.getElementById('agentChart');
        if (agentCtx) {
            this.charts.agents = new Chart(agentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Claude Code', 'Vertex AI', 'Cognee Memory', 'Others'],
                    datasets: [{
                        data: [35, 25, 20, 20],
                        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // System Health Chart
        const systemCtx = document.getElementById('systemChart');
        if (systemCtx) {
            this.charts.system = new Chart(systemCtx, {
                type: 'pie',
                data: {
                    labels: ['Healthy', 'Warning', 'Critical'],
                    datasets: [{
                        data: [75, 20, 5],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    setupWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = \`\${protocol}//\${window.location.host}/ws\`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.updateConnectionStatus(true);
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleRealtimeUpdate(data);
        };
        
        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.updateConnectionStatus(false);
            // Reconnect after 5 seconds
            setTimeout(() => this.setupWebSocket(), 5000);
        };
    }

    setupEventListeners() {
        // View toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchView(e.target.dataset.view);
            });
        });

        // Alert acknowledge buttons
        document.querySelectorAll('.alert-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.textContent = 'Acknowledged';
                e.target.disabled = true;
                e.target.style.background = '#6b7280';
            });
        });
    }

    startDataRefresh() {
        // Refresh data every 30 seconds
        setInterval(() => {
            this.fetchLatestData();
        }, 30000);
    }

    async fetchLatestData() {
        try {
            const response = await fetch('/api/analytics/business');
            const data = await response.json();
            if (data.success) {
                this.updateDashboard(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch latest data:', error);
        }
    }

    handleRealtimeUpdate(data) {
        console.log('Real-time update received:', data);
        this.updateDashboard(data.data);
    }

    updateDashboard(data) {
        // Update metrics
        if (data.business) {
            this.updateBusinessMetrics(data.business);
        }
        
        if (data.agents) {
            this.updateAgentMetrics(data.agents);
        }
        
        if (data.system) {
            this.updateSystemMetrics(data.system);
        }
    }

    updateBusinessMetrics(data) {
        // Update revenue
        const revenueElement = document.querySelector('.metric-card.primary .metric-value');
        if (revenueElement && data.revenue) {
            revenueElement.textContent = \`$\${data.revenue.total.toLocaleString()}\`;
        }

        // Update users
        const usersElement = document.querySelector('.metric-card.success .metric-value');
        if (usersElement && data.users) {
            usersElement.textContent = data.users.active.toLocaleString();
        }
    }

    updateAgentMetrics(data) {
        // Update agent count
        const agentsElement = document.querySelector('.metric-card.warning .metric-value');
        if (agentsElement) {
            agentsElement.textContent = Object.keys(data).length;
        }
    }

    updateSystemMetrics(data) {
        // Update system health
        const healthElement = document.querySelector('.metric-card.info .metric-value');
        if (healthElement && data.health) {
            healthElement.textContent = \`\${data.health}%\`;
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.connection-status span');
        
        if (statusElement && statusText) {
            if (connected) {
                statusElement.classList.add('connected');
                statusElement.classList.remove('disconnected');
                statusText.textContent = 'Connected';
            } else {
                statusElement.classList.remove('connected');
                statusElement.classList.add('disconnected');
                statusText.textContent = 'Disconnected';
            }
        }
    }

    switchView(view) {
        console.log('Switching to view:', view);
        // Implement view switching logic
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaurusDashboard();
});
`

    // Store dashboard data
    await state.set('dashboard', 'webflow', {
      html,
      css,
      js,
      lastUpdated: new Date().toISOString()
    })
    
    // Emit events
    await emit({
      topic: 'dashboard.served',
      data: {
        timestamp: new Date().toISOString(),
        clientIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }
    })
    
    await emit({
      topic: 'webflow.template.rendered',
      data: {
        template: 'world-class-dashboard',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    })
    
    logger.info('World-class Webflow dashboard generated successfully')
    
    return {
      status: 200,
      body: {
        success: true,
        html,
        css,
        js,
        metadata: {
          title: 'TAURUS AI CORP - World-Class Analytics Dashboard',
          description: 'Real-time insights from your 200+ AI agents and MCP tools',
          version: '1.0.0',
          lastUpdated: new Date().toISOString()
        }
      }
    }
    
  } catch (error) {
    logger.error('Failed to generate Webflow dashboard', { error: error.message })
    return {
      status: 500,
      body: {
        success: false,
        error: 'Failed to generate dashboard'
      }
    }
  }
}

