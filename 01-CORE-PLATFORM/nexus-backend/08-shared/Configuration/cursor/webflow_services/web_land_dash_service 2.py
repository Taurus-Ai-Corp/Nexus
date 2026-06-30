#!/usr/bin/env python3
"""
📊 Web-land-Dash Webflow Service
Taurus AI Corp - Specialized Webflow integration for Web-land-Dash Platform
"""

from datetime import datetime
from typing import Any

from webflow_api_client import WebflowAPIClient, WebflowAPIError
from webflow_config import get_project_config


class WebLandDashWebflowService:
    """
    Specialized Webflow service for Web-land-Dash platform operations
    """

    def __init__(self, client: WebflowAPIClient):
        self.client = client
        self.config = get_project_config('web_land_dash')
        self.site_id = self.config.site_id

        if not self.site_id:
            raise ValueError("Web-land-Dash site ID not configured. Run webflow_oauth_setup.py first.")

    def create_dashboard(self, dashboard_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create a new dashboard configuration
        
        Args:
            dashboard_data: Dashboard information including widgets, layout, etc.
            
        Returns:
            Created dashboard data
        """
        if 'dashboards' not in self.config.collection_ids:
            raise ValueError("Dashboards collection not configured")

        collection_id = self.config.collection_ids['dashboards']

        webflow_dashboard = {
            'fieldData': {
                'name': dashboard_data.get('name', ''),
                'description': dashboard_data.get('description', ''),
                'type': dashboard_data.get('type', 'analytics'),
                'layout': dashboard_data.get('layout', 'grid'),
                'widgets': dashboard_data.get('widgets', ''),
                'theme': dashboard_data.get('theme', 'default'),
                'permissions': dashboard_data.get('permissions', 'public'),
                'owner': dashboard_data.get('owner', ''),
                'tags': dashboard_data.get('tags', ''),
                'is-active': dashboard_data.get('is_active', True),
                'refresh-interval': dashboard_data.get('refresh_interval', 300),
                'created-date': datetime.now().isoformat()
            }
        }

        webflow_dashboard['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_dashboard,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to create dashboard: {e.message}")

    def create_widget(self, widget_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create a new dashboard widget
        
        Args:
            widget_data: Widget information including type, configuration, etc.
            
        Returns:
            Created widget data
        """
        if 'widgets' not in self.config.collection_ids:
            raise ValueError("Widgets collection not configured")

        collection_id = self.config.collection_ids['widgets']

        webflow_widget = {
            'fieldData': {
                'name': widget_data.get('name', ''),
                'type': widget_data.get('type', 'chart'),
                'title': widget_data.get('title', ''),
                'description': widget_data.get('description', ''),
                'data-source': widget_data.get('data_source', ''),
                'configuration': widget_data.get('configuration', ''),
                'position': widget_data.get('position', ''),
                'size': widget_data.get('size', 'medium'),
                'refresh-interval': widget_data.get('refresh_interval', 60),
                'is-active': widget_data.get('is_active', True),
                'dashboard-id': widget_data.get('dashboard_id', ''),
                'created-date': datetime.now().isoformat()
            }
        }

        webflow_widget['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_widget,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to create widget: {e.message}")

    def create_user(self, user_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create a new user
        
        Args:
            user_data: User information
            
        Returns:
            Created user data
        """
        if 'users' not in self.config.collection_ids:
            raise ValueError("Users collection not configured")

        collection_id = self.config.collection_ids['users']

        webflow_user = {
            'fieldData': {
                'name': user_data.get('name', ''),
                'email': user_data.get('email', ''),
                'role': user_data.get('role', 'user'),
                'permissions': user_data.get('permissions', ''),
                'dashboard-access': user_data.get('dashboard_access', ''),
                'preferences': user_data.get('preferences', ''),
                'last-login': user_data.get('last_login', ''),
                'is-active': user_data.get('is_active', True),
                'created-date': datetime.now().isoformat()
            }
        }

        webflow_user['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_user,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to create user: {e.message}")

    def log_analytics(self, analytics_data: dict[str, Any]) -> dict[str, Any]:
        """
        Log platform analytics data
        
        Args:
            analytics_data: Analytics metrics and data
            
        Returns:
            Created analytics record
        """
        if 'analytics' not in self.config.collection_ids:
            raise ValueError("Analytics collection not configured")

        collection_id = self.config.collection_ids['analytics']

        webflow_analytics = {
            'fieldData': {
                'metric-name': analytics_data.get('metric_name', ''),
                'value': analytics_data.get('value', 0),
                'dashboard-id': analytics_data.get('dashboard_id', ''),
                'widget-id': analytics_data.get('widget_id', ''),
                'user-id': analytics_data.get('user_id', ''),
                'date': analytics_data.get('date', datetime.now().isoformat()),
                'source': analytics_data.get('source', 'web_land_dash'),
                'category': analytics_data.get('category', 'usage'),
                'description': analytics_data.get('description', '')
            }
        }

        webflow_analytics['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_analytics,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to log analytics: {e.message}")

    def update_dashboard_layout(self, dashboard_id: str, layout_data: dict[str, Any]) -> dict[str, Any]:
        """
        Update dashboard layout
        
        Args:
            dashboard_id: Dashboard ID
            layout_data: New layout configuration
            
        Returns:
            Updated dashboard data
        """
        if 'dashboards' not in self.config.collection_ids:
            raise ValueError("Dashboards collection not configured")

        collection_id = self.config.collection_ids['dashboards']

        update_data = {
            'fieldData': {
                'layout': layout_data.get('layout', 'grid'),
                'widgets': layout_data.get('widgets', ''),
                'updated-date': datetime.now().isoformat()
            }
        }

        try:
            result = self.client.update_item(collection_id, dashboard_id, update_data,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [dashboard_id])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to update dashboard layout: {e.message}")

    def update_widget_configuration(self, widget_id: str, config_data: dict[str, Any]) -> dict[str, Any]:
        """
        Update widget configuration
        
        Args:
            widget_id: Widget ID
            config_data: New configuration data
            
        Returns:
            Updated widget data
        """
        if 'widgets' not in self.config.collection_ids:
            raise ValueError("Widgets collection not configured")

        collection_id = self.config.collection_ids['widgets']

        update_data = {
            'fieldData': {
                'configuration': config_data.get('configuration', ''),
                'data-source': config_data.get('data_source', ''),
                'refresh-interval': config_data.get('refresh_interval', 60),
                'updated-date': datetime.now().isoformat()
            }
        }

        try:
            result = self.client.update_item(collection_id, widget_id, update_data,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [widget_id])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to update widget configuration: {e.message}")

    def get_dashboards(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get dashboards from Webflow"""
        if 'dashboards' not in self.config.collection_ids:
            raise ValueError("Dashboards collection not configured")

        collection_id = self.config.collection_ids['dashboards']
        return self.client.get_items(collection_id, limit, offset)

    def get_widgets(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get widgets from Webflow"""
        if 'widgets' not in self.config.collection_ids:
            raise ValueError("Widgets collection not configured")

        collection_id = self.config.collection_ids['widgets']
        return self.client.get_items(collection_id, limit, offset)

    def get_users(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get users from Webflow"""
        if 'users' not in self.config.collection_ids:
            raise ValueError("Users collection not configured")

        collection_id = self.config.collection_ids['users']
        return self.client.get_items(collection_id, limit, offset)

    def get_analytics(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get analytics from Webflow"""
        if 'analytics' not in self.config.collection_ids:
            raise ValueError("Analytics collection not configured")

        collection_id = self.config.collection_ids['analytics']
        return self.client.get_items(collection_id, limit, offset)

    def setup_webhooks(self) -> list[dict[str, Any]]:
        """
        Setup webhooks for Web-land-Dash integration
        
        Returns:
            List of created webhooks
        """
        webhooks = []

        for event_type, endpoint_url in self.config.webhook_endpoints.items():
            try:
                webhook_data = {
                    'triggerType': event_type,
                    'url': endpoint_url,
                    'filter': {
                        'collectionId': self.config.collection_ids.get('dashboards', '')
                    }
                }

                webhook = self.client.create_webhook(self.site_id, webhook_data)
                webhooks.append(webhook)

                print(f"✅ Created webhook for {event_type}")

            except WebflowAPIError as e:
                print(f"❌ Failed to create webhook for {event_type}: {e.message}")

        return webhooks

    def sync_platform_data(self, platform_data: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync platform data with Webflow
        
        Args:
            platform_data: List of platform records to sync
            
        Returns:
            Sync results
        """
        results = {
            'dashboards_created': 0,
            'widgets_created': 0,
            'users_created': 0,
            'analytics_logged': 0,
            'errors': 0,
            'error_details': []
        }

        for record in platform_data:
            try:
                record_type = record.get('type', 'dashboard')

                if record_type == 'dashboard':
                    self.create_dashboard(record)
                    results['dashboards_created'] += 1
                elif record_type == 'widget':
                    self.create_widget(record)
                    results['widgets_created'] += 1
                elif record_type == 'user':
                    self.create_user(record)
                    results['users_created'] += 1
                elif record_type == 'analytics':
                    self.log_analytics(record)
                    results['analytics_logged'] += 1

            except Exception as e:
                results['errors'] += 1
                results['error_details'].append({
                    'record': record,
                    'error': str(e)
                })

        return results

    def create_dashboard_template(self, template_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create a dashboard from template
        
        Args:
            template_data: Template configuration
            
        Returns:
            Created dashboard and widgets
        """
        try:
            # Create dashboard
            dashboard = self.create_dashboard(template_data['dashboard'])

            # Create widgets
            widgets = []
            for widget_config in template_data.get('widgets', []):
                widget_config['dashboard_id'] = dashboard['id']
                widget = self.create_widget(widget_config)
                widgets.append(widget)

            return {
                'dashboard': dashboard,
                'widgets': widgets,
                'success': True
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def export_dashboard_config(self, dashboard_id: str) -> dict[str, Any]:
        """
        Export dashboard configuration
        
        Args:
            dashboard_id: Dashboard ID
            
        Returns:
            Dashboard configuration
        """
        try:
            # Get dashboard
            dashboard = self.client.get_item(
                self.config.collection_ids['dashboards'],
                dashboard_id
            )

            # Get associated widgets
            widgets = self.get_widgets()
            dashboard_widgets = [
                widget for widget in widgets.get('items', [])
                if widget.get('fieldData', {}).get('dashboard-id') == dashboard_id
            ]

            return {
                'dashboard': dashboard,
                'widgets': dashboard_widgets,
                'export_date': datetime.now().isoformat()
            }

        except Exception as e:
            return {
                'error': str(e),
                'export_date': datetime.now().isoformat()
            }

# Factory function
def create_web_land_dash_service(client: WebflowAPIClient = None) -> WebLandDashWebflowService:
    """
    Create Web-land-Dash Webflow service instance
    
    Args:
        client: Optional Webflow API client
        
    Returns:
        WebLandDashWebflowService instance
    """
    if client is None:
        from webflow_api_client import create_webflow_client
        client = create_webflow_client()

    return WebLandDashWebflowService(client)

# Example usage
if __name__ == "__main__":
    try:
        # Create service
        service = create_web_land_dash_service()

        # Test dashboard creation
        dashboard_data = {
            'name': 'Sales Analytics Dashboard',
            'description': 'Comprehensive sales analytics and reporting',
            'type': 'analytics',
            'layout': 'grid',
            'widgets': 'sales-chart,revenue-metric,top-products',
            'theme': 'dark',
            'permissions': 'admin',
            'owner': 'admin@company.com',
            'tags': 'sales,analytics,reporting',
            'is_active': True,
            'refresh_interval': 300
        }

        dashboard = service.create_dashboard(dashboard_data)
        print(f"✅ Created dashboard: {dashboard['id']}")

        # Test widget creation
        widget_data = {
            'name': 'Sales Chart Widget',
            'type': 'chart',
            'title': 'Sales Over Time',
            'description': 'Line chart showing sales trends',
            'data_source': 'sales_api',
            'configuration': '{"type":"line","xAxis":"date","yAxis":"sales"}',
            'position': 'top-left',
            'size': 'large',
            'refresh_interval': 60,
            'is_active': True,
            'dashboard_id': dashboard['id']
        }

        widget = service.create_widget(widget_data)
        print(f"✅ Created widget: {widget['id']}")

        # Test user creation
        user_data = {
            'name': 'John Doe',
            'email': 'john@company.com',
            'role': 'analyst',
            'permissions': 'read,export',
            'dashboard_access': dashboard['id'],
            'preferences': '{"theme":"light","refresh":300}',
            'last_login': datetime.now().isoformat(),
            'is_active': True
        }

        user = service.create_user(user_data)
        print(f"✅ Created user: {user['id']}")

        # Test analytics logging
        analytics_data = {
            'metric_name': 'dashboard_views',
            'value': 150,
            'dashboard_id': dashboard['id'],
            'widget_id': widget['id'],
            'user_id': user['id'],
            'date': datetime.now().isoformat(),
            'source': 'web_land_dash',
            'category': 'usage',
            'description': 'Daily dashboard view count'
        }

        analytics = service.log_analytics(analytics_data)
        print(f"✅ Logged analytics: {analytics['id']}")

        print("\n🎉 Web-land-Dash Webflow service test completed successfully!")

    except Exception as e:
        print(f"❌ Test failed: {e}")
