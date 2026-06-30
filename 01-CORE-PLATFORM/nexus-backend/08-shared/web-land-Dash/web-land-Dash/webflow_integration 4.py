#!/usr/bin/env python3
"""
📊 Webflow Integration for Web-land-Dash Platform
Taurus AI Corp - Webflow API integration for Web-land-Dash project
"""

import os
import sys
from datetime import datetime
from typing import Any

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from webflow_api_client import create_webflow_client
from webflow_services import get_service


class WebLandDashWebflowIntegration:
    """
    Webflow integration for Web-land-Dash Platform
    """

    def __init__(self):
        self.client = create_webflow_client()
        self.dash_service = get_service('web_land_dash', self.client)

    def sync_dashboard_configurations(self, dashboards: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync dashboard configurations from external systems
        
        Args:
            dashboards: List of dashboard configurations
            
        Returns:
            Sync result
        """
        try:
            results = {
                'created': 0,
                'updated': 0,
                'errors': 0,
                'error_details': []
            }

            for dashboard in dashboards:
                try:
                    # Create dashboard in Webflow
                    webflow_dashboard = self.dash_service.create_dashboard(dashboard)
                    results['created'] += 1

                    # Log analytics
                    analytics_data = {
                        'metric_name': 'dashboard_configuration_sync',
                        'value': 1,
                        'dashboard_id': webflow_dashboard['id'],
                        'date': datetime.now().isoformat(),
                        'source': 'web_land_dash',
                        'category': 'configuration',
                        'description': f'Dashboard {dashboard.get("name", "Unknown")} synced'
                    }
                    self.dash_service.log_analytics(analytics_data)

                except Exception as e:
                    results['errors'] += 1
                    results['error_details'].append({
                        'dashboard': dashboard,
                        'error': str(e)
                    })

            return {
                'success': True,
                'results': results,
                'message': f'Dashboard sync completed: {results["created"]} created, {results["errors"]} errors'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def sync_widget_configurations(self, widgets: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync widget configurations from external systems
        
        Args:
            widgets: List of widget configurations
            
        Returns:
            Sync result
        """
        try:
            results = {
                'created': 0,
                'updated': 0,
                'errors': 0,
                'error_details': []
            }

            for widget in widgets:
                try:
                    # Create widget in Webflow
                    webflow_widget = self.dash_service.create_widget(widget)
                    results['created'] += 1

                except Exception as e:
                    results['errors'] += 1
                    results['error_details'].append({
                        'widget': widget,
                        'error': str(e)
                    })

            return {
                'success': True,
                'results': results,
                'message': f'Widget sync completed: {results["created"]} created, {results["errors"]} errors'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def sync_user_data(self, users: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync user data from external systems
        
        Args:
            users: List of user data
            
        Returns:
            Sync result
        """
        try:
            results = {
                'created': 0,
                'updated': 0,
                'errors': 0,
                'error_details': []
            }

            for user in users:
                try:
                    # Create user in Webflow
                    webflow_user = self.dash_service.create_user(user)
                    results['created'] += 1

                except Exception as e:
                    results['errors'] += 1
                    results['error_details'].append({
                        'user': user,
                        'error': str(e)
                    })

            return {
                'success': True,
                'results': results,
                'message': f'User sync completed: {results["created"]} created, {results["errors"]} errors'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def sync_platform_analytics(self, analytics_data: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync platform analytics data
        
        Args:
            analytics_data: List of analytics records
            
        Returns:
            Sync result
        """
        try:
            results = {
                'logged': 0,
                'errors': 0,
                'error_details': []
            }

            for analytics in analytics_data:
                try:
                    # Log analytics
                    self.dash_service.log_analytics(analytics)
                    results['logged'] += 1

                except Exception as e:
                    results['errors'] += 1
                    results['error_details'].append({
                        'analytics': analytics,
                        'error': str(e)
                    })

            return {
                'success': True,
                'results': results,
                'message': f'Analytics sync completed: {results["logged"]} logged, {results["errors"]} errors'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def create_dashboard_from_template(self, template_name: str, customizations: dict[str, Any]) -> dict[str, Any]:
        """
        Create dashboard from template with customizations
        
        Args:
            template_name: Name of the template
            customizations: Customization parameters
            
        Returns:
            Creation result
        """
        try:
            # Define templates
            templates = {
                'sales_analytics': {
                    'dashboard': {
                        'name': f'Sales Analytics Dashboard - {customizations.get("name", "Default")}',
                        'description': 'Comprehensive sales analytics and reporting dashboard',
                        'type': 'analytics',
                        'layout': 'grid',
                        'theme': customizations.get('theme', 'default'),
                        'permissions': customizations.get('permissions', 'admin'),
                        'owner': customizations.get('owner', ''),
                        'tags': 'sales,analytics,reporting',
                        'is_active': True,
                        'refresh_interval': 300
                    },
                    'widgets': [
                        {
                            'name': 'Sales Chart Widget',
                            'type': 'chart',
                            'title': 'Sales Over Time',
                            'description': 'Line chart showing sales trends',
                            'data_source': 'sales_api',
                            'configuration': '{"type":"line","xAxis":"date","yAxis":"sales"}',
                            'position': 'top-left',
                            'size': 'large',
                            'refresh_interval': 60,
                            'is_active': True
                        },
                        {
                            'name': 'Revenue Metric Widget',
                            'type': 'metric',
                            'title': 'Total Revenue',
                            'description': 'Current total revenue display',
                            'data_source': 'revenue_api',
                            'configuration': '{"format":"currency","prefix":"$"}',
                            'position': 'top-right',
                            'size': 'medium',
                            'refresh_interval': 60,
                            'is_active': True
                        },
                        {
                            'name': 'Top Products Widget',
                            'type': 'table',
                            'title': 'Top Selling Products',
                            'description': 'Table of best performing products',
                            'data_source': 'products_api',
                            'configuration': '{"columns":["name","sales","revenue"],"limit":10}',
                            'position': 'bottom',
                            'size': 'large',
                            'refresh_interval': 300,
                            'is_active': True
                        }
                    ]
                },
                'marketing_analytics': {
                    'dashboard': {
                        'name': f'Marketing Analytics Dashboard - {customizations.get("name", "Default")}',
                        'description': 'Marketing performance and campaign analytics',
                        'type': 'marketing',
                        'layout': 'grid',
                        'theme': customizations.get('theme', 'default'),
                        'permissions': customizations.get('permissions', 'marketing'),
                        'owner': customizations.get('owner', ''),
                        'tags': 'marketing,analytics,campaigns',
                        'is_active': True,
                        'refresh_interval': 300
                    },
                    'widgets': [
                        {
                            'name': 'Campaign Performance Widget',
                            'type': 'chart',
                            'title': 'Campaign Performance',
                            'description': 'Bar chart showing campaign metrics',
                            'data_source': 'campaigns_api',
                            'configuration': '{"type":"bar","xAxis":"campaign","yAxis":"conversions"}',
                            'position': 'top',
                            'size': 'large',
                            'refresh_interval': 300,
                            'is_active': True
                        },
                        {
                            'name': 'Conversion Rate Widget',
                            'type': 'metric',
                            'title': 'Conversion Rate',
                            'description': 'Overall conversion rate percentage',
                            'data_source': 'conversions_api',
                            'configuration': '{"format":"percentage","suffix":"%"}',
                            'position': 'top-right',
                            'size': 'medium',
                            'refresh_interval': 60,
                            'is_active': True
                        }
                    ]
                }
            }

            if template_name not in templates:
                raise ValueError(f"Unknown template: {template_name}. Available templates: {list(templates.keys())}")

            template = templates[template_name]

            # Create dashboard from template
            result = self.dash_service.create_dashboard_template(template)

            return result

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def export_dashboard_configuration(self, dashboard_id: str) -> dict[str, Any]:
        """
        Export dashboard configuration for backup or migration
        
        Args:
            dashboard_id: Dashboard ID to export
            
        Returns:
            Export result
        """
        try:
            # Export dashboard configuration
            config = self.dash_service.export_dashboard_config(dashboard_id)

            return {
                'success': True,
                'configuration': config,
                'message': 'Dashboard configuration exported successfully'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def update_dashboard_layout(self, dashboard_id: str, layout_data: dict[str, Any]) -> dict[str, Any]:
        """
        Update dashboard layout configuration
        
        Args:
            dashboard_id: Dashboard ID
            layout_data: New layout configuration
            
        Returns:
            Update result
        """
        try:
            # Update dashboard layout
            updated_dashboard = self.dash_service.update_dashboard_layout(dashboard_id, layout_data)

            # Log analytics
            analytics_data = {
                'metric_name': 'dashboard_layout_update',
                'value': 1,
                'dashboard_id': dashboard_id,
                'date': datetime.now().isoformat(),
                'source': 'web_land_dash',
                'category': 'configuration',
                'description': f'Dashboard {dashboard_id} layout updated'
            }
            self.dash_service.log_analytics(analytics_data)

            return {
                'success': True,
                'dashboard_id': dashboard_id,
                'message': 'Dashboard layout updated successfully'
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def get_platform_analytics_report(self) -> dict[str, Any]:
        """
        Generate platform analytics report
        
        Returns:
            Analytics report
        """
        try:
            # Get analytics data
            analytics = self.dash_service.get_analytics()

            # Get dashboards data
            dashboards = self.dash_service.get_dashboards()

            # Get users data
            users = self.dash_service.get_users()

            # Generate report
            report = {
                'total_dashboards': len(dashboards.get('items', [])),
                'total_users': len(users.get('items', [])),
                'total_analytics_records': len(analytics.get('items', [])),
                'active_dashboards': len([d for d in dashboards.get('items', []) if d.get('fieldData', {}).get('is-active', False)]),
                'active_users': len([u for u in users.get('items', []) if u.get('fieldData', {}).get('is-active', False)]),
                'generated_at': datetime.now().isoformat()
            }

            return {
                'success': True,
                'report': report
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# Integration endpoints for Web-land-Dash API
def create_web_land_dash_webflow_endpoints():
    """
    Create Webflow integration endpoints for Web-land-Dash API
    """

    integration = WebLandDashWebflowIntegration()

    endpoints = {
        '/api/webflow/dash/sync-dashboards': {
            'method': 'POST',
            'handler': integration.sync_dashboard_configurations,
            'description': 'Sync dashboard configurations from external systems'
        },
        '/api/webflow/dash/sync-widgets': {
            'method': 'POST',
            'handler': integration.sync_widget_configurations,
            'description': 'Sync widget configurations from external systems'
        },
        '/api/webflow/dash/sync-users': {
            'method': 'POST',
            'handler': integration.sync_user_data,
            'description': 'Sync user data from external systems'
        },
        '/api/webflow/dash/sync-analytics': {
            'method': 'POST',
            'handler': integration.sync_platform_analytics,
            'description': 'Sync platform analytics data'
        },
        '/api/webflow/dash/create-from-template': {
            'method': 'POST',
            'handler': integration.create_dashboard_from_template,
            'description': 'Create dashboard from template with customizations'
        },
        '/api/webflow/dash/export-config': {
            'method': 'GET',
            'handler': integration.export_dashboard_configuration,
            'description': 'Export dashboard configuration for backup or migration'
        },
        '/api/webflow/dash/update-layout': {
            'method': 'POST',
            'handler': integration.update_dashboard_layout,
            'description': 'Update dashboard layout configuration'
        },
        '/api/webflow/dash/analytics-report': {
            'method': 'GET',
            'handler': integration.get_platform_analytics_report,
            'description': 'Generate platform analytics report'
        }
    }

    return endpoints

# Example usage and testing
if __name__ == "__main__":
    print("📊 Testing Webflow Integration for Web-land-Dash Platform")
    print("=" * 60)

    try:
        # Create integration
        integration = WebLandDashWebflowIntegration()

        # Test dashboard sync
        print("\n📊 Testing Dashboard Configuration Sync...")
        dashboards = [
            {
                'name': 'Executive Dashboard',
                'description': 'High-level executive overview dashboard',
                'type': 'executive',
                'layout': 'grid',
                'widgets': 'kpi-metrics,revenue-chart,top-performers',
                'theme': 'dark',
                'permissions': 'executive',
                'owner': 'ceo@company.com',
                'tags': 'executive,overview,kpi',
                'is_active': True,
                'refresh_interval': 600
            },
            {
                'name': 'Operations Dashboard',
                'description': 'Day-to-day operations monitoring dashboard',
                'type': 'operations',
                'layout': 'grid',
                'widgets': 'system-status,alerts,performance-metrics',
                'theme': 'light',
                'permissions': 'operations',
                'owner': 'ops@company.com',
                'tags': 'operations,monitoring,alerts',
                'is_active': True,
                'refresh_interval': 60
            }
        ]

        dashboard_result = integration.sync_dashboard_configurations(dashboards)
        print(f"✅ Dashboard sync: {dashboard_result}")

        # Test widget sync
        print("\n🔧 Testing Widget Configuration Sync...")
        widgets = [
            {
                'name': 'KPI Metrics Widget',
                'type': 'metrics',
                'title': 'Key Performance Indicators',
                'description': 'Display of key business metrics',
                'data_source': 'kpi_api',
                'configuration': '{"metrics":["revenue","users","conversions"],"format":"number"}',
                'position': 'top',
                'size': 'large',
                'refresh_interval': 300,
                'is_active': True,
                'dashboard_id': 'dashboard_1'
            },
            {
                'name': 'System Status Widget',
                'type': 'status',
                'title': 'System Health',
                'description': 'Real-time system status monitoring',
                'data_source': 'system_api',
                'configuration': '{"services":["api","database","cache"],"thresholds":{"warning":80,"critical":95}}',
                'position': 'top-right',
                'size': 'medium',
                'refresh_interval': 30,
                'is_active': True,
                'dashboard_id': 'dashboard_2'
            }
        ]

        widget_result = integration.sync_widget_configurations(widgets)
        print(f"✅ Widget sync: {widget_result}")

        # Test user sync
        print("\n👥 Testing User Data Sync...")
        users = [
            {
                'name': 'John Executive',
                'email': 'john@company.com',
                'role': 'executive',
                'permissions': 'read,export,admin',
                'dashboard_access': 'dashboard_1,dashboard_2',
                'preferences': '{"theme":"dark","refresh":300,"notifications":true}',
                'last_login': datetime.now().isoformat(),
                'is_active': True
            },
            {
                'name': 'Sarah Operations',
                'email': 'sarah@company.com',
                'role': 'operations',
                'permissions': 'read,write',
                'dashboard_access': 'dashboard_2',
                'preferences': '{"theme":"light","refresh":60,"notifications":true}',
                'last_login': datetime.now().isoformat(),
                'is_active': True
            }
        ]

        user_result = integration.sync_user_data(users)
        print(f"✅ User sync: {user_result}")

        # Test template creation
        print("\n📋 Testing Dashboard Template Creation...")
        template_result = integration.create_dashboard_from_template(
            'sales_analytics',
            {
                'name': 'Q1 2024 Sales',
                'theme': 'dark',
                'permissions': 'sales_team',
                'owner': 'sales@company.com'
            }
        )
        print(f"✅ Template creation: {template_result}")

        # Test analytics report
        print("\n📈 Testing Analytics Report...")
        report_result = integration.get_platform_analytics_report()
        print(f"✅ Analytics report: {report_result}")

        print("\n🎉 All Web-land-Dash integration tests completed successfully!")

    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        import traceback
        traceback.print_exc()
