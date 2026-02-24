# 🌐 Webflow API Integration Guide
## Taurus AI Corp - Universal Webflow Integration for All Projects

This comprehensive guide covers the complete Webflow API integration setup for all your Cursor projects, including BizFlow, Vibe Marketing, KAYA-RATTAN, and Web-land-Dash.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Installation & Setup](#installation--setup)
3. [Authentication](#authentication)
4. [Project-Specific Services](#project-specific-services)
5. [Integration Examples](#integration-examples)
6. [API Endpoints](#api-endpoints)
7. [Webhook Configuration](#webhook-configuration)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

## 🚀 Quick Start

### 1. Run Initial Setup
```bash
cd "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects"
python webflow_config.py
```

### 2. Authenticate with Webflow
```bash
python webflow_oauth_setup.py
```

### 3. Test Integration
```bash
python webflow_api_client.py
```

## 📦 Installation & Setup

### Prerequisites
- Python 3.7+
- Webflow account with API access
- Your Webflow credentials (already configured)

### File Structure
```
/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/
├── webflow_api_client.py          # Core API client
├── webflow_config.py              # Configuration manager
├── webflow_oauth_setup.py         # OAuth2 setup
├── webflow_services/              # Project-specific services
│   ├── __init__.py
│   ├── bizflow_service.py
│   ├── vibe_marketing_service.py
│   ├── kaya_rattan_service.py
│   └── web_land_dash_service.py
├── BizFlow-Vibe-Marketing-Ecosystem/
│   └── webflow_integration.py     # BizFlow & Vibe integration
├── KAYA-RATTAN/
│   └── webflow_integration.py     # KAYA-RATTAN integration
└── web-land-Dash/
    └── webflow_integration.py     # Web-land-Dash integration
```

## 🔐 Authentication

### Your Webflow Credentials
- **Client ID**: `f1f4344f7074e4f1f0dd50b1b2867873c17778f877f6f7a07a7882e79bf06828`
- **Client Secret**: `a2ae2e2baa88203e069c004a0452272c1fc8f3846d8687c27de13a34a684c097`

### Authentication Flow
1. **Generate Auth URL**: The system creates an OAuth2 authorization URL
2. **User Authorization**: You authorize the application in your browser
3. **Token Exchange**: The system exchanges the authorization code for access tokens
4. **Token Storage**: Tokens are saved for future use with automatic refresh

### Environment Variables
The system automatically creates a `.env` file with:
```env
WEBFLOW_CLIENT_ID=f1f4344f7074e4f1f0dd50b1b2867873c17778f877f6f7a07a7882e79bf06828
WEBFLOW_CLIENT_SECRET=a2ae2e2baa88203e069c004a0452272c1fc8f3846d8687c27de13a34a684c097
WEBFLOW_BASE_URL=https://api.webflow.com/v2
WEBFLOW_REDIRECT_URI=http://localhost:8080/callback
```

## 🏢 Project-Specific Services

### 1. BizFlow CRM Service
```python
from webflow_services import create_bizflow_service

# Create service
service = create_bizflow_service()

# Create a lead
lead_data = {
    'name': 'John Doe',
    'email': 'john@example.com',
    'company': 'Acme Corp',
    'phone': '+1234567890',
    'source': 'website',
    'status': 'new',
    'notes': 'Interested in CRM solution',
    'lead_score': 85
}
lead = service.create_lead(lead_data)

# Create a campaign
campaign_data = {
    'name': 'Q1 2024 Campaign',
    'type': 'email',
    'status': 'active',
    'start_date': '2024-01-01',
    'end_date': '2024-03-31',
    'budget': 10000,
    'target_audience': 'SMB'
}
campaign = service.create_campaign(campaign_data)
```

### 2. Vibe Marketing Service
```python
from webflow_services import create_vibe_marketing_service

# Create service
service = create_vibe_marketing_service()

# Create a social media post
post_data = {
    'title': 'New Product Launch',
    'content': 'Excited to announce our new product! 🚀',
    'platform': 'instagram',
    'post_type': 'image',
    'status': 'scheduled',
    'scheduled_date': '2024-01-15T10:00:00Z',
    'hashtags': '#innovation #tech #productlaunch'
}
post = service.create_social_post(post_data)

# Log analytics
analytics_data = {
    'metric_name': 'engagement_rate',
    'value': 4.2,
    'platform': 'instagram',
    'post_id': post['id'],
    'category': 'engagement'
}
analytics = service.log_analytics(analytics_data)
```

### 3. KAYA-RATTAN E-commerce Service
```python
from webflow_services import create_kaya_rattan_service

# Create service
service = create_kaya_rattan_service()

# Create a product
product_data = {
    'name': 'Rattan Dining Chair',
    'description': 'Beautiful handcrafted rattan dining chair',
    'price': 299.99,
    'compare_price': 399.99,
    'sku': 'RAT-DIN-001',
    'category': 'dining',
    'material': 'rattan',
    'color': 'natural',
    'in_stock': True,
    'stock_quantity': 50
}
product = service.create_product(product_data)

# Create an order
order_data = {
    'order_number': 'ORD-2024-001',
    'customer_name': 'John Smith',
    'customer_email': 'john@example.com',
    'total': 672.98,
    'status': 'pending',
    'payment_status': 'paid'
}
order = service.create_order(order_data)
```

### 4. Web-land-Dash Platform Service
```python
from webflow_services import create_web_land_dash_service

# Create service
service = create_web_land_dash_service()

# Create a dashboard
dashboard_data = {
    'name': 'Sales Analytics Dashboard',
    'description': 'Comprehensive sales analytics and reporting',
    'type': 'analytics',
    'layout': 'grid',
    'theme': 'dark',
    'permissions': 'admin',
    'owner': 'admin@company.com'
}
dashboard = service.create_dashboard(dashboard_data)

# Create a widget
widget_data = {
    'name': 'Sales Chart Widget',
    'type': 'chart',
    'title': 'Sales Over Time',
    'data_source': 'sales_api',
    'configuration': '{"type":"line","xAxis":"date","yAxis":"sales"}',
    'dashboard_id': dashboard['id']
}
widget = service.create_widget(widget_data)
```

## 🔗 Integration Examples

### BizFlow & Vibe Marketing Integration
```python
from BizFlow-Vibe-Marketing-Ecosystem.webflow_integration import BizFlowWebflowIntegration

# Create integration
integration = BizFlowWebflowIntegration()

# Sync lead from Webflow form
form_data = {
    'name': 'Jane Smith',
    'email': 'jane@example.com',
    'company': 'Tech Corp',
    'phone': '+1234567890',
    'message': 'Interested in your CRM solution'
}
result = integration.sync_lead_from_form(form_data)

# Sync campaign data
campaign_data = {
    'name': 'Q1 2024 Marketing Campaign',
    'type': 'email',
    'status': 'active',
    'budget': 10000,
    'target_audience': 'SMB'
}
result = integration.sync_campaign_data(campaign_data)
```

### KAYA-RATTAN E-commerce Integration
```python
from KAYA-RATTAN.webflow_integration import KayaRattanWebflowIntegration

# Create integration
integration = KayaRattanWebflowIntegration()

# Sync product catalog
products = [
    {
        'name': 'Rattan Dining Set',
        'price': 899.99,
        'sku': 'RAT-DIN-SET-001',
        'category': 'dining',
        'in_stock': True,
        'stock_quantity': 25
    }
]
result = integration.sync_product_catalog(products)

# Process order fulfillment
fulfillment_data = {
    'order_id': 'order_123',
    'status': 'fulfilled',
    'tracking_number': 'TRK123456789',
    'items': [
        {'product_id': 'prod_1', 'quantity': 1}
    ]
}
result = integration.process_order_fulfillment(fulfillment_data)
```

### Web-land-Dash Platform Integration
```python
from web-land-Dash.webflow_integration import WebLandDashWebflowIntegration

# Create integration
integration = WebLandDashWebflowIntegration()

# Create dashboard from template
result = integration.create_dashboard_from_template(
    'sales_analytics',
    {
        'name': 'Q1 2024 Sales',
        'theme': 'dark',
        'permissions': 'sales_team',
        'owner': 'sales@company.com'
    }
)

# Export dashboard configuration
config = integration.export_dashboard_configuration('dashboard_123')
```

## 🌐 API Endpoints

### BizFlow Endpoints
- `POST /api/webflow/bizflow/sync-lead` - Sync lead from Webflow form
- `POST /api/webflow/bizflow/sync-campaign` - Sync campaign data
- `POST /api/webflow/bizflow/sync-content` - Sync content assets

### Vibe Marketing Endpoints
- `POST /api/webflow/vibe/sync-social` - Sync social media data
- `POST /api/webflow/vibe/create-calendar` - Create content calendar
- `POST /api/webflow/vibe/sync-engagement` - Sync engagement metrics

### KAYA-RATTAN Endpoints
- `POST /api/webflow/kaya/sync-products` - Sync product catalog
- `POST /api/webflow/kaya/sync-order` - Sync order from Webflow
- `POST /api/webflow/kaya/update-inventory` - Update inventory levels
- `POST /api/webflow/kaya/fulfill-order` - Process order fulfillment
- `GET /api/webflow/kaya/inventory-report` - Generate inventory report

### Web-land-Dash Endpoints
- `POST /api/webflow/dash/sync-dashboards` - Sync dashboard configurations
- `POST /api/webflow/dash/sync-widgets` - Sync widget configurations
- `POST /api/webflow/dash/create-from-template` - Create dashboard from template
- `GET /api/webflow/dash/export-config` - Export dashboard configuration
- `GET /api/webflow/dash/analytics-report` - Generate analytics report

## 🔔 Webhook Configuration

### Supported Webhook Events
- `form_submission` - Form submissions from Webflow
- `item_created` - New items created in collections
- `item_updated` - Items updated in collections
- `item_deleted` - Items deleted from collections

### Webhook Setup
```python
# Setup webhooks for a project
service = create_bizflow_service()
webhooks = service.setup_webhooks()
```

### Webhook Endpoints
- BizFlow: `https://api.bizflow.com/webhooks/webflow/`
- Vibe Marketing: `https://api.vibemarketing.com/webhooks/webflow/`
- KAYA-RATTAN: `https://api.kayarattan.com/webhooks/webflow/`
- Web-land-Dash: `https://api.weblanddash.com/webhooks/webflow/`

## 🛠️ Troubleshooting

### Common Issues

#### 1. Authentication Errors
```python
# Check if tokens are valid
client = create_webflow_client()
if not client.test_connection():
    print("Authentication failed. Run webflow_oauth_setup.py")
```

#### 2. Collection Not Found
```python
# Check if collections are configured
config = get_project_config('bizflow')
if not config.collection_ids.get('leads'):
    print("Leads collection not configured. Run webflow_oauth_setup.py")
```

#### 3. Rate Limiting
The client automatically handles rate limiting with exponential backoff.

#### 4. Token Refresh
Tokens are automatically refreshed when they expire.

### Debug Mode
```python
import logging
logging.basicConfig(level=logging.DEBUG)

# Your code here
```

## 📚 Best Practices

### 1. Error Handling
```python
try:
    result = service.create_lead(lead_data)
    print(f"✅ Lead created: {result['id']}")
except Exception as e:
    print(f"❌ Error: {e}")
    # Handle error appropriately
```

### 2. Batch Operations
```python
# Process multiple items efficiently
results = service.sync_with_crm(crm_data)
print(f"Created: {results['created']}, Errors: {results['errors']}")
```

### 3. Data Validation
```python
# Validate data before sending to Webflow
if not lead_data.get('email'):
    raise ValueError("Email is required for lead creation")
```

### 4. Configuration Management
```python
# Use project-specific configurations
config = get_project_config('bizflow')
if config.auto_publish:
    # Auto-publish items
    pass
```

### 5. Monitoring & Analytics
```python
# Log all operations for monitoring
analytics_data = {
    'metric_name': 'operation_success',
    'value': 1,
    'operation': 'lead_creation',
    'source': 'bizflow'
}
service.log_analytics(analytics_data)
```

## 🎯 Next Steps

1. **Run Initial Setup**: Execute `python webflow_config.py`
2. **Authenticate**: Run `python webflow_oauth_setup.py`
3. **Configure Projects**: Set up site IDs and collection mappings
4. **Test Integration**: Run individual service tests
5. **Deploy**: Integrate with your existing API servers
6. **Monitor**: Set up webhooks and analytics tracking

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the example implementations
3. Test with the provided test scripts
4. Check Webflow API documentation

## 🔄 Updates

This integration is designed to be:
- **Modular**: Each project has its own service
- **Scalable**: Easy to add new projects
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new features

---

**Taurus AI Corp** - Universal Webflow Integration
*Empowering all your projects with seamless Webflow connectivity*
