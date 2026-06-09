#!/usr/bin/env python3
"""
Test Webflow Integration for Web-land-Dash Platform
"""

import sys
import os
import requests
import json
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from webflow_integration import WebLandDashWebflowIntegration

def test_webflow_api_connection():
    """Test Webflow API connection"""
    print("🔗 Testing Webflow API Connection...")
    
    # Test with different API versions
    api_versions = [
        "https://api.webflow.com/v2",
        "https://api.webflow.com/v1", 
        "https://api.webflow.com"
    ]
    
    headers = {
        'Authorization': 'Bearer ded536b9e74e112707f7087c7dabe365c7e76ba0c0949e6439e57868b4e40dad',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    for base_url in api_versions:
        print(f"\n📡 Testing {base_url}...")
        
        # Test sites endpoint
        try:
            response = requests.get(f"{base_url}/sites", headers=headers, timeout=10)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Response: {json.dumps(data, indent=2)}")
                return base_url, data
            else:
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   Exception: {e}")
    
    return None, None

def test_webflow_integration():
    """Test the Webflow integration"""
    print("\n🚀 Testing Webflow Integration...")
    
    try:
        # Create integration instance
        integration = WebLandDashWebflowIntegration()
        print("✅ Integration created successfully")
        
        # Test dashboard creation
        print("\n📊 Testing Dashboard Creation...")
        test_dashboard = {
            'name': 'Test Dashboard - Web-land-Dash',
            'description': 'Test dashboard for Web-land-Dash platform',
            'type': 'test',
            'layout': 'grid',
            'theme': 'default',
            'permissions': 'admin',
            'owner': 'test@taurusai.io',
            'tags': 'test,dashboard,web-land-dash',
            'is_active': True,
            'refresh_interval': 300
        }
        
        result = integration.sync_dashboard_configurations([test_dashboard])
        print(f"✅ Dashboard sync result: {result}")
        
        # Test template creation
        print("\n📋 Testing Template Creation...")
        template_result = integration.create_dashboard_from_template(
            'sales_analytics',
            {
                'name': 'Test Sales Analytics',
                'theme': 'dark',
                'permissions': 'test',
                'owner': 'test@taurusai.io'
            }
        )
        print(f"✅ Template creation result: {template_result}")
        
        return True
        
    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main test function"""
    print("🧪 Webflow Integration Test Suite")
    print("=" * 50)
    
    # Test API connection
    base_url, sites_data = test_webflow_api_connection()
    
    if base_url:
        print(f"\n✅ Found working API: {base_url}")
        if sites_data and 'sites' in sites_data and sites_data['sites']:
            print(f"📊 Found {len(sites_data['sites'])} sites:")
            for site in sites_data['sites']:
                print(f"   - {site.get('name', 'Unknown')} (ID: {site.get('id', 'Unknown')})")
        else:
            print("📊 No sites found - you may need to create a site first")
    else:
        print("\n❌ No working API endpoint found")
        print("💡 You may need to:")
        print("   1. Check your Webflow access token")
        print("   2. Create a site in your Webflow dashboard")
        print("   3. Get the site ID from the dashboard")
    
    # Test integration
    success = test_webflow_integration()
    
    if success:
        print("\n🎉 All tests completed!")
    else:
        print("\n❌ Some tests failed - check the errors above")

if __name__ == "__main__":
    main()







