const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

// Serve static files
app.use(express.static('public'));

// Create public directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Generate the world-class dashboard HTML
const generateDashboardHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏰 TAURUS AI CORP - World-Class Analytics Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
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
    </style>
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
                        <span class="stat-number">$125,000</span>
                        <span class="stat-label">Total Revenue</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">1,250</span>
                        <span class="stat-label">Active Users</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">16</span>
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
                <div class="metric-value">$125,000</div>
                <div class="metric-trend positive">
                    <span class="trend-icon">↗</span>
                    <span>+12.5%</span>
                </div>
                <div class="metric-subtitle">This month</div>
            </div>

            <div class="metric-card success">
                <div class="metric-header">
                    <h3>Active Users</h3>
                    <div class="metric-icon">👥</div>
                </div>
                <div class="metric-value">890</div>
                <div class="metric-trend positive">
                    <span class="trend-icon">↗</span>
                    <span>+8.2%</span>
                </div>
                <div class="metric-subtitle">Currently online</div>
            </div>

            <div class="metric-card warning">
                <div class="metric-header">
                    <h3>AI Agents</h3>
                    <div class="metric-icon">🤖</div>
                </div>
                <div class="metric-value">16</div>
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
                <div class="metric-value">98%</div>
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
                <div class="alert-badge">3 new</div>
            </div>
            <div class="alerts-list">
                <div class="alert-item warning">
                    <div class="alert-icon">⚠️</div>
                    <div class="alert-content">
                        <div class="alert-title">High CPU Usage</div>
                        <div class="alert-message">CPU usage is above 80% on server-01</div>
                        <div class="alert-meta">
                            <span class="alert-source">System Monitor</span>
                            <span class="alert-time">5 minutes ago</span>
                        </div>
                    </div>
                    <button class="alert-action">Acknowledge</button>
                </div>
                <div class="alert-item info">
                    <div class="alert-icon">ℹ️</div>
                    <div class="alert-content">
                        <div class="alert-title">Scheduled Maintenance</div>
                        <div class="alert-message">Scheduled maintenance will occur tonight from 2 AM to 4 AM UTC</div>
                        <div class="alert-meta">
                            <span class="alert-source">Maintenance Bot</span>
                            <span class="alert-time">2 hours ago</span>
                        </div>
                    </div>
                    <button class="alert-action">Acknowledge</button>
                </div>
                <div class="alert-item error">
                    <div class="alert-icon">❌</div>
                    <div class="alert-content">
                        <div class="alert-title">API Rate Limit Exceeded</div>
                        <div class="alert-message">API rate limit exceeded for Perplexity service</div>
                        <div class="alert-meta">
                            <span class="alert-source">API Monitor</span>
                            <span class="alert-time">10 minutes ago</span>
                        </div>
                    </div>
                    <button class="alert-action">Acknowledge</button>
                </div>
            </div>
        </section>

        <!-- Real-time Metrics -->
        <section class="realtime-metrics">
            <div class="metric-item">
                <div class="metric-label">Response Time</div>
                <div class="metric-value">245ms</div>
            </div>
            <div class="metric-item">
                <div class="metric-label">Throughput</div>
                <div class="metric-value">1,250/min</div>
            </div>
            <div class="metric-item">
                <div class="metric-label">Error Rate</div>
                <div class="metric-value">0.5%</div>
            </div>
        </section>
    </main>

    <script>
        // Initialize charts when page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Revenue Chart
            const revenueCtx = document.getElementById('revenueChart');
            new Chart(revenueCtx, {
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

            // User Growth Chart
            const userCtx = document.getElementById('userChart');
            new Chart(userCtx, {
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

            // Agent Performance Chart
            const agentCtx = document.getElementById('agentChart');
            new Chart(agentCtx, {
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

            // System Health Chart
            const systemCtx = document.getElementById('systemChart');
            new Chart(systemCtx, {
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

            // Add click handlers for alert buttons
            document.querySelectorAll('.alert-action').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.textContent = 'Acknowledged';
                    this.disabled = true;
                    this.style.background = '#6b7280';
                });
            });

            // Add click handlers for view toggle buttons
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    console.log('Switched to view:', this.dataset.view);
                });
            });
        });
    </script>
</body>
</html>`;
};

// Routes
app.get('/', (req, res) => {
    res.send(generateDashboardHTML());
});

app.get('/dashboard', (req, res) => {
    res.send(generateDashboardHTML());
});

app.get('/api/analytics/business', (req, res) => {
    res.json({
        success: true,
        data: {
            revenue: {
                total: 125000,
                growth: 12.5,
                trend: 'up',
                period: '24h'
            },
            users: {
                total: 1250,
                active: 890,
                new: 45,
                churned: 12,
                growth: 8.2,
                trend: 'up',
                period: '24h'
            },
            agents: {
                total: 16,
                active: 15,
                avgPerformance: 92
            },
            system: {
                health: 98,
                uptime: 99.8,
                performance: {
                    responseTime: 245,
                    throughput: 1250,
                    errorRate: 1.2
                }
            },
            alerts: [
                {
                    id: '1',
                    type: 'warning',
                    title: 'High CPU Usage',
                    message: 'CPU usage is above 80% on server-01',
                    source: 'System Monitor',
                    severity: 'medium',
                    status: 'active',
                    timestamp: new Date().toISOString()
                }
            ],
            lastUpdated: new Date().toISOString()
        }
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🏰 TAURUS AI CORP - World-Class Dashboard Server');
    console.log('================================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
    console.log(`❤️ Health: http://localhost:${PORT}/health`);
    console.log('🎉 Ready to serve your world-class analytics!');
});

