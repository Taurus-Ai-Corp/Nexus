#!/usr/bin/env python3
"""
🏰 TAURUS AI CORP. - Webflow Template Generator for Analytics Dashboard
Generates Webflow-optimized template for the analytics dashboard
"""

import json
import os
from pathlib import Path

class WebflowTemplateGenerator:
    def __init__(self):
        self.template_config = self.load_template_config()
        self.output_dir = Path("webflow-template")
        
    def load_template_config(self):
        """Load the template configuration"""
        config_path = Path("webflow-template-config.json")
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return {}
    
    def generate_html_template(self):
        """Generate HTML template for Webflow"""
        html_template = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{self.template_config.get('template_name', 'Analytics Dashboard')}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        {self.generate_css()}
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Header -->
        <header class="dashboard-header">
            <div class="header-content">
                <div class="logo-section">
                    <h1 class="logo">TAURUS AI CORP</h1>
                    <span class="subtitle">Analytics Dashboard</span>
                </div>
                <div class="header-actions">
                    <div class="connection-status">
                        <span class="status-icon">📶</span>
                        <span class="status-text">Connected</span>
                    </div>
                    <button class="refresh-btn">Refresh</button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="dashboard-main">
            <!-- Key Metrics Section -->
            <section class="key-metrics">
                <div class="metric-card revenue">
                    <div class="metric-header">
                        <h3>Total Revenue</h3>
                        <span class="metric-icon">💰</span>
                    </div>
                    <div class="metric-value">$125,000</div>
                    <div class="metric-trend positive">+12.5%</div>
                </div>
                
                <div class="metric-card users">
                    <div class="metric-header">
                        <h3>Active Users</h3>
                        <span class="metric-icon">👥</span>
                    </div>
                    <div class="metric-value">1,250</div>
                    <div class="metric-trend positive">+8.2%</div>
                </div>
                
                <div class="metric-card agents">
                    <div class="metric-header">
                        <h3>AI Agents</h3>
                        <span class="metric-icon">🤖</span>
                    </div>
                    <div class="metric-value">15</div>
                    <div class="metric-trend neutral">0%</div>
                </div>
                
                <div class="metric-card health">
                    <div class="metric-header">
                        <h3>System Health</h3>
                        <span class="metric-icon">📊</span>
                    </div>
                    <div class="metric-value">98%</div>
                    <div class="metric-trend positive">+2.1%</div>
                </div>
            </section>

            <!-- Charts Section -->
            <section class="charts-section">
                <div class="chart-container">
                    <h3>Revenue Over Time</h3>
                    <div class="chart-placeholder">
                        <p>Revenue chart will be rendered here</p>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3>User Growth</h3>
                    <div class="chart-placeholder">
                        <p>User growth chart will be rendered here</p>
                    </div>
                </div>
            </section>

            <!-- Performance Section -->
            <section class="performance-section">
                <div class="chart-container">
                    <h3>Agent Performance</h3>
                    <div class="chart-placeholder">
                        <p>Agent performance chart will be rendered here</p>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3>System Health Distribution</h3>
                    <div class="chart-placeholder">
                        <p>System health pie chart will be rendered here</p>
                    </div>
                </div>
            </section>

            <!-- Alerts Section -->
            <section class="alerts-section">
                <div class="alert-panel">
                    <div class="alert-header">
                        <h3>System Alerts</h3>
                        <span class="alert-count">3 total alerts</span>
                    </div>
                    <div class="alert-list">
                        <div class="alert-item warning">
                            <div class="alert-icon">⚠️</div>
                            <div class="alert-content">
                                <p>High CPU usage detected on server-01</p>
                                <div class="alert-meta">
                                    <span>warning</span> • <span>System Monitor</span> • <span>5 minutes ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Additional Metrics -->
            <section class="additional-metrics">
                <div class="metric-card-small">
                    <h4>Response Time</h4>
                    <div class="metric-value-small">245ms</div>
                    <div class="metric-subtitle">Average</div>
                </div>
                
                <div class="metric-card-small">
                    <h4>Throughput</h4>
                    <div class="metric-value-small">1,250</div>
                    <div class="metric-subtitle">Requests/min</div>
                </div>
                
                <div class="metric-card-small">
                    <h4>Error Rate</h4>
                    <div class="metric-value-small">0.5%</div>
                    <div class="metric-subtitle">Last 24h</div>
                </div>
            </section>
        </main>
    </div>

    <script>
        {self.generate_javascript()}
    </script>
</body>
</html>
        """
        return html_template
    
    def generate_css(self):
        """Generate CSS styles for the template"""
        design_system = self.template_config.get('design_system', {})
        colors = design_system.get('colors', {})
        
        css = f"""
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Inter', system-ui, sans-serif;
            background-color: {colors.get('primary', {}).get('50', '#f9fafb')};
            color: #111827;
            line-height: 1.6;
        }}
        
        .dashboard-container {{
            min-height: 100vh;
        }}
        
        .dashboard-header {{
            background: white;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }}
        
        .header-content {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }}
        
        .logo-section {{
            display: flex;
            align-items: center;
        }}
        
        .logo {{
            font-size: 1.5rem;
            font-weight: 700;
            color: {colors.get('primary', {}).get('600', '#0ea5e9')};
            margin-right: 1rem;
        }}
        
        .subtitle {{
            color: #6b7280;
            font-size: 0.875rem;
        }}
        
        .header-actions {{
            display: flex;
            align-items: center;
            gap: 1rem;
        }}
        
        .connection-status {{
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: {colors.get('success', {}).get('600', '#22c55e')};
            font-size: 0.875rem;
        }}
        
        .refresh-btn {{
            background: #f3f4f6;
            color: #374151;
            border: none;
            border-radius: 0.375rem;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }}
        
        .refresh-btn:hover {{
            background: #e5e7eb;
        }}
        
        .dashboard-main {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }}
        
        .key-metrics {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }}
        
        .metric-card {{
            background: white;
            border-radius: 0.75rem;
            border: 2px solid;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        }}
        
        .metric-card:hover {{
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }}
        
        .metric-card.revenue {{
            border-color: {colors.get('success', {}).get('200', '#bbf7d0')};
            background: {colors.get('success', {}).get('50', '#f0fdf4')};
        }}
        
        .metric-card.users {{
            border-color: {colors.get('primary', {}).get('200', '#bae6fd')};
            background: {colors.get('primary', {}).get('50', '#f0f9ff')};
        }}
        
        .metric-card.agents {{
            border-color: {colors.get('warning', {}).get('200', '#fde68a')};
            background: {colors.get('warning', {}).get('50', '#fffbeb')};
        }}
        
        .metric-card.health {{
            border-color: {colors.get('success', {}).get('200', '#bbf7d0')};
            background: {colors.get('success', {}).get('50', '#f0fdf4')};
        }}
        
        .metric-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }}
        
        .metric-header h3 {{
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
        }}
        
        .metric-icon {{
            font-size: 1.5rem;
        }}
        
        .metric-value {{
            font-size: 2rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
        }}
        
        .metric-trend {{
            font-size: 0.875rem;
            font-weight: 500;
        }}
        
        .metric-trend.positive {{
            color: {colors.get('success', {}).get('600', '#22c55e')};
        }}
        
        .metric-trend.negative {{
            color: {colors.get('danger', {}).get('600', '#ef4444')};
        }}
        
        .metric-trend.neutral {{
            color: #6b7280;
        }}
        
        .charts-section, .performance-section {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }}
        
        .chart-container {{
            background: white;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }}
        
        .chart-container h3 {{
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #111827;
        }}
        
        .chart-placeholder {{
            height: 300px;
            background: #f9fafb;
            border: 2px dashed #d1d5db;
            border-radius: 0.375rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6b7280;
        }}
        
        .alerts-section {{
            margin-bottom: 2rem;
        }}
        
        .alert-panel {{
            background: white;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }}
        
        .alert-header {{
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        .alert-header h3 {{
            font-size: 1.125rem;
            font-weight: 600;
        }}
        
        .alert-count {{
            color: #6b7280;
            font-size: 0.875rem;
        }}
        
        .alert-list {{
            max-height: 24rem;
            overflow-y: auto;
        }}
        
        .alert-item {{
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }}
        
        .alert-item:last-child {{
            border-bottom: none;
        }}
        
        .alert-item.warning {{
            border-left: 4px solid {colors.get('warning', {}).get('400', '#fbbf24')};
            background: {colors.get('warning', {}).get('50', '#fffbeb')};
        }}
        
        .alert-icon {{
            font-size: 1.25rem;
            margin-top: 0.25rem;
        }}
        
        .alert-content p {{
            font-weight: 500;
            margin-bottom: 0.5rem;
        }}
        
        .alert-meta {{
            font-size: 0.75rem;
            color: #6b7280;
        }}
        
        .additional-metrics {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }}
        
        .metric-card-small {{
            background: white;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
            padding: 1rem;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }}
        
        .metric-card-small h4 {{
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            margin-bottom: 0.5rem;
        }}
        
        .metric-value-small {{
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.25rem;
        }}
        
        .metric-subtitle {{
            font-size: 0.75rem;
            color: #6b7280;
        }}
        
        @media (max-width: 768px) {{
            .header-content {{
                padding: 0 1rem;
                flex-direction: column;
                height: auto;
                padding: 1rem;
            }}
            
            .logo-section {{
                margin-bottom: 1rem;
            }}
            
            .dashboard-main {{
                padding: 1rem;
            }}
            
            .key-metrics {{
                grid-template-columns: 1fr;
            }}
            
            .charts-section, .performance-section {{
                grid-template-columns: 1fr;
            }}
        }}
        """
        return css
    
    def generate_javascript(self):
        """Generate JavaScript for the template"""
        js = """
        // Dashboard functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Refresh button functionality
            const refreshBtn = document.querySelector('.refresh-btn');
            refreshBtn.addEventListener('click', function() {
                // Add loading state
                refreshBtn.textContent = 'Refreshing...';
                refreshBtn.disabled = true;
                
                // Simulate refresh
                setTimeout(() => {
                    refreshBtn.textContent = 'Refresh';
                    refreshBtn.disabled = false;
                    console.log('Dashboard refreshed');
                }, 1000);
            });
            
            // Connection status simulation
            const connectionStatus = document.querySelector('.connection-status');
            let isConnected = true;
            
            setInterval(() => {
                isConnected = !isConnected;
                const statusIcon = connectionStatus.querySelector('.status-icon');
                const statusText = connectionStatus.querySelector('.status-text');
                
                if (isConnected) {
                    statusIcon.textContent = '📶';
                    statusText.textContent = 'Connected';
                    connectionStatus.style.color = '#22c55e';
                } else {
                    statusIcon.textContent = '📵';
                    statusText.textContent = 'Disconnected';
                    connectionStatus.style.color = '#ef4444';
                }
            }, 10000); // Toggle every 10 seconds for demo
            
            // Animate metric cards on load
            const metricCards = document.querySelectorAll('.metric-card');
            metricCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
        """
        return js
    
    def generate_webflow_export(self):
        """Generate Webflow export files"""
        self.output_dir.mkdir(exist_ok=True)
        
        # Generate HTML template
        html_content = self.generate_html_template()
        with open(self.output_dir / "index.html", "w") as f:
            f.write(html_content)
        
        # Generate CSS file
        css_content = self.generate_css()
        with open(self.output_dir / "styles.css", "w") as f:
            f.write(css_content)
        
        # Generate JavaScript file
        js_content = self.generate_javascript()
        with open(self.output_dir / "script.js", "w") as f:
            f.write(js_content)
        
        # Generate Webflow component files
        self.generate_webflow_components()
        
        print(f"✅ Webflow template generated in {self.output_dir}")
        print("📁 Files created:")
        print("  - index.html (Main template)")
        print("  - styles.css (Custom styles)")
        print("  - script.js (Interactive functionality)")
        print("  - components/ (Webflow components)")
    
    def generate_webflow_components(self):
        """Generate Webflow component files"""
        components_dir = self.output_dir / "components"
        components_dir.mkdir(exist_ok=True)
        
        # Metric Card Component
        metric_card_component = {
            "name": "Metric Card",
            "type": "div",
            "classes": ["metric-card"],
            "children": [
                {
                    "type": "div",
                    "classes": ["metric-header"],
                    "children": [
                        {"type": "h3", "text": "{{title}}"},
                        {"type": "span", "classes": ["metric-icon"], "text": "{{icon}}"}
                    ]
                },
                {"type": "div", "classes": ["metric-value"], "text": "{{value}}"},
                {"type": "div", "classes": ["metric-trend"], "text": "{{trend}}"}
            ]
        }
        
        with open(components_dir / "metric-card.json", "w") as f:
            json.dump(metric_card_component, f, indent=2)
        
        # Chart Container Component
        chart_component = {
            "name": "Chart Container",
            "type": "div",
            "classes": ["chart-container"],
            "children": [
                {"type": "h3", "text": "{{title}}"},
                {"type": "div", "classes": ["chart-placeholder"], "text": "Chart will be rendered here"}
            ]
        }
        
        with open(components_dir / "chart-container.json", "w") as f:
            json.dump(chart_component, f, indent=2)

def main():
    """Main function to generate Webflow template"""
    print("🏰 TAURUS AI CORP. - Webflow Template Generator")
    print("=" * 50)
    
    generator = WebflowTemplateGenerator()
    generator.generate_webflow_export()
    
    print("\n🎉 Template generation completed!")
    print("\n📋 Next steps:")
    print("1. Import the generated files into Webflow")
    print("2. Connect your data sources")
    print("3. Customize the design as needed")
    print("4. Publish your dashboard")

if __name__ == "__main__":
    main()

