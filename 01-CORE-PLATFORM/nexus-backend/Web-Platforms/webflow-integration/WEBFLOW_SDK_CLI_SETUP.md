# 🌐 Webflow SDK & CLI Setup Guide
## Taurus AI Corp - Complete Webflow Integration with SDK and CLI Tools

This guide covers the complete setup including official Webflow SDK and CLI tools for both Python and Node.js environments.

## 📋 What's Included

### ✅ Python Integration (Primary)
- **Custom Webflow API Client** - Full OAuth2 and API functionality
- **Project-Specific Services** - BizFlow, Vibe Marketing, KAYA-RATTAN, Web-land-Dash
- **CLI Tool** - Command-line interface for easy management
- **Configuration Manager** - Centralized settings and project templates

### ✅ Node.js Integration (Optional)
- **Official Webflow JavaScript SDK** - `webflow-api` package
- **Webflow CLI** - `@webflow/webflow-cli` for Designer Extensions
- **Package.json** - Ready-to-use Node.js setup

## 🚀 Quick Setup

### 1. Python Setup (Primary)
```bash
# Install Python dependencies
pip install -r requirements_webflow.txt

# Setup Webflow integration
python webflow_cli.py setup

# Authenticate
python webflow_cli.py auth

# Test integration
python webflow_cli.py test
```

### 2. Node.js Setup (Optional)
```bash
# Install Node.js dependencies
npm install

# Install Webflow CLI globally
npm run install-webflow-cli

# Install Webflow SDK
npm run install-webflow-sdk
```

## 🔧 Python CLI Commands

### Setup & Authentication
```bash
# Initial setup
python webflow_cli.py setup

# Authenticate with Webflow
python webflow_cli.py auth

# Check status
python webflow_cli.py status
```

### Site Management
```bash
# List all sites
python webflow_cli.py sites

# List collections for a site
python webflow_cli.py collections <site_id>
```

### Project Configuration
```bash
# Configure BizFlow project
python webflow_cli.py configure bizflow --site-id <site_id>

# Configure Vibe Marketing project
python webflow_cli.py configure vibe_marketing --site-id <site_id>

# Configure KAYA-RATTAN project
python webflow_cli.py configure kaya_rattan --site-id <site_id>

# Configure Web-land-Dash project
python webflow_cli.py configure web_land_dash --site-id <site_id>
```

### Testing
```bash
# Test entire integration
python webflow_cli.py test
```

## 📦 Node.js SDK Usage

### Basic Setup
```javascript
import { WebflowClient } from "webflow-api";

const webflow = new WebflowClient({ 
  accessToken: 'your_access_token' 
});

// Get sites
const sites = await webflow.sites.list();

// Get collections
const collections = await webflow.collections.list('site_id');

// Get items
const items = await webflow.items.list('collection_id');
```

### Advanced Usage
```javascript
// Create item
const newItem = await webflow.items.create('collection_id', {
  fieldData: {
    name: 'New Item',
    description: 'Item description'
  }
});

// Update item
const updatedItem = await webflow.items.update('collection_id', 'item_id', {
  fieldData: {
    name: 'Updated Item'
  }
});

// Publish items
await webflow.items.publish('collection_id', ['item_id1', 'item_id2']);
```

## 🛠️ Webflow CLI (Node.js)

### Installation
```bash
npm install -g @webflow/webflow-cli
```

### Designer Extensions
```bash
# Create new extension
webflow extension init my-extension

# Run extension locally
cd my-extension
npm run dev
```

### Site Management
```bash
# List sites
webflow sites list

# Get site details
webflow sites get <site_id>

# Publish site
webflow sites publish <site_id>
```

## 🔗 Your New Webflow App Settings

### App Configuration
- **Name**: `Taurus AI Integration`
- **Redirect URI**: `http://localhost:8168/callback`
- **Scopes**: 
  - `sites:read`
  - `sites:write`
  - `cms:read`
  - `cms:write`

### Create Your App
1. Go to: https://webflow.com/dashboard/account/apps
2. Click "Create App"
3. Use the settings above
4. Get your Client ID and Client Secret

## 📚 Project-Specific Usage

### BizFlow CRM
```python
from webflow_services import create_bizflow_service

service = create_bizflow_service()

# Create lead
lead = service.create_lead({
    'name': 'John Doe',
    'email': 'john@example.com',
    'company': 'Acme Corp',
    'source': 'website'
})

# Create campaign
campaign = service.create_campaign({
    'name': 'Q1 2024 Campaign',
    'type': 'email',
    'budget': 10000
})
```

### Vibe Marketing
```python
from webflow_services import create_vibe_marketing_service

service = create_vibe_marketing_service()

# Create social post
post = service.create_social_post({
    'title': 'New Product Launch',
    'content': 'Excited to announce our new product! 🚀',
    'platform': 'instagram',
    'hashtags': '#innovation #tech'
})

# Log analytics
analytics = service.log_analytics({
    'metric_name': 'engagement_rate',
    'value': 4.2,
    'platform': 'instagram'
})
```

### KAYA-RATTAN E-commerce
```python
from webflow_services import create_kaya_rattan_service

service = create_kaya_rattan_service()

# Create product
product = service.create_product({
    'name': 'Rattan Dining Chair',
    'price': 299.99,
    'sku': 'RAT-DIN-001',
    'category': 'dining'
})

# Create order
order = service.create_order({
    'order_number': 'ORD-2024-001',
    'customer_name': 'John Smith',
    'total': 672.98
})
```

### Web-land-Dash Platform
```python
from webflow_services import create_web_land_dash_service

service = create_web_land_dash_service()

# Create dashboard
dashboard = service.create_dashboard({
    'name': 'Sales Analytics Dashboard',
    'type': 'analytics',
    'theme': 'dark'
})

# Create widget
widget = service.create_widget({
    'name': 'Sales Chart Widget',
    'type': 'chart',
    'dashboard_id': dashboard['id']
})
```

## 🔔 Webhook Integration

### Setup Webhooks
```python
# Setup webhooks for a project
service = create_bizflow_service()
webhooks = service.setup_webhooks()
```

### Webhook Endpoints
- **BizFlow**: `https://api.bizflow.com/webhooks/webflow/`
- **Vibe Marketing**: `https://api.vibemarketing.com/webhooks/webflow/`
- **KAYA-RATTAN**: `https://api.kayarattan.com/webhooks/webflow/`
- **Web-land-Dash**: `https://api.weblanddash.com/webhooks/webflow/`

## 🧪 Testing & Examples

### Run Examples
```bash
# Test all integrations
python webflow_examples.py

# Test specific project
python -c "from webflow_services import create_bizflow_service; service = create_bizflow_service(); print('BizFlow service ready!')"
```

### CLI Testing
```bash
# Test connection
python webflow_cli.py test

# Check status
python webflow_cli.py status

# List sites
python webflow_cli.py sites
```

## 📁 File Structure

```
/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/
├── webflow_api_client.py          # Core API client
├── webflow_cli.py                 # CLI tool
├── webflow_config.py              # Configuration manager
├── webflow_oauth_setup.py         # OAuth setup
├── webflow_examples.py            # Examples and tests
├── requirements_webflow.txt       # Python dependencies
├── package.json                   # Node.js dependencies
├── webflow_services/              # Project-specific services
│   ├── __init__.py
│   ├── bizflow_service.py
│   ├── vibe_marketing_service.py
│   ├── kaya_rattan_service.py
│   └── web_land_dash_service.py
├── webflow_configs/               # Configuration files
│   ├── global_config.json
│   ├── bizflow_config.json
│   ├── vibe_marketing_config.json
│   ├── kaya_rattan_config.json
│   └── web_land_dash_config.json
└── WEBFLOW_SDK_CLI_SETUP.md      # This guide
```

## 🎯 Next Steps

1. **Create your Webflow OAuth app** with the settings above
2. **Run**: `python webflow_cli.py setup`
3. **Enter your credentials** when prompted
4. **Authenticate**: `python webflow_cli.py auth`
5. **Configure projects**: `python webflow_cli.py configure <project>`
6. **Test integration**: `python webflow_cli.py test`
7. **Start building** with the Webflow API!

## 🆘 Troubleshooting

### Common Issues
- **Authentication fails**: Check redirect URI matches exactly
- **No sites found**: Verify you have sites in your Webflow account
- **Permission errors**: Ensure your app has the correct scopes

### Get Help
- **CLI Help**: `python webflow_cli.py --help`
- **Command Help**: `python webflow_cli.py <command> --help`
- **Test Integration**: `python webflow_cli.py test`

---

**Taurus AI Corp** - Universal Webflow Integration with SDK & CLI
*Complete integration solution for all your projects*
