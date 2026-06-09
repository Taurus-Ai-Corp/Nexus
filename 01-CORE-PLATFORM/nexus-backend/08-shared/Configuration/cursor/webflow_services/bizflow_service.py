#!/usr/bin/env python3
"""
🏢 BizFlow Webflow Service
Taurus AI Corp - Specialized Webflow integration for BizFlow CRM
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import json
from webflow_api_client import WebflowAPIClient, WebflowAPIError
from webflow_config import get_project_config

class BizFlowWebflowService:
    """
    Specialized Webflow service for BizFlow CRM operations
    """
    
    def __init__(self, client: WebflowAPIClient):
        self.client = client
        self.config = get_project_config('bizflow')
        self.site_id = self.config.site_id
        
        if not self.site_id:
            raise ValueError("BizFlow site ID not configured. Run webflow_oauth_setup.py first.")
    
    def create_lead(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new lead in Webflow
        
        Args:
            lead_data: Lead information including name, email, company, etc.
            
        Returns:
            Created lead data
        """
        if 'leads' not in self.config.collection_ids:
            raise ValueError("Leads collection not configured")
        
        collection_id = self.config.collection_ids['leads']
        
        # Prepare lead data for Webflow
        webflow_lead = {
            'fieldData': {
                'name': lead_data.get('name', ''),
                'email': lead_data.get('email', ''),
                'company': lead_data.get('company', ''),
                'phone': lead_data.get('phone', ''),
                'source': lead_data.get('source', 'webflow'),
                'status': lead_data.get('status', 'new'),
                'notes': lead_data.get('notes', ''),
                'created-date': datetime.now().isoformat(),
                'lead-score': lead_data.get('lead_score', 0)
            }
        }
        
        # Add custom fields
        webflow_lead['fieldData'].update(self.config.custom_fields)
        
        try:
            result = self.client.create_item(collection_id, webflow_lead, 
                                           is_draft=self.config.draft_mode)
            
            # Auto-publish if configured
            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])
            
            return result
            
        except WebflowAPIError as e:
            raise Exception(f"Failed to create lead: {e.message}")
    
    def update_lead_status(self, lead_id: str, status: str, notes: str = None) -> Dict[str, Any]:
        """
        Update lead status and notes
        
        Args:
            lead_id: Webflow item ID
            status: New status (new, contacted, qualified, etc.)
            notes: Optional notes
            
        Returns:
            Updated lead data
        """
        if 'leads' not in self.config.collection_ids:
            raise ValueError("Leads collection not configured")
        
        collection_id = self.config.collection_ids['leads']
        
        update_data = {
            'fieldData': {
                'status': status,
                'updated-date': datetime.now().isoformat()
            }
        }
        
        if notes:
            update_data['fieldData']['notes'] = notes
        
        try:
            result = self.client.update_item(collection_id, lead_id, update_data,
                                           is_draft=self.config.draft_mode)
            
            # Auto-publish if configured
            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [lead_id])
            
            return result
            
        except WebflowAPIError as e:
            raise Exception(f"Failed to update lead: {e.message}")
    
    def create_campaign(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new marketing campaign
        
        Args:
            campaign_data: Campaign information
            
        Returns:
            Created campaign data
        """
        if 'campaigns' not in self.config.collection_ids:
            raise ValueError("Campaigns collection not configured")
        
        collection_id = self.config.collection_ids['campaigns']
        
        webflow_campaign = {
            'fieldData': {
                'name': campaign_data.get('name', ''),
                'type': campaign_data.get('type', ''),
                'status': campaign_data.get('status', 'draft'),
                'start-date': campaign_data.get('start_date', ''),
                'end-date': campaign_data.get('end_date', ''),
                'budget': campaign_data.get('budget', 0),
                'target-audience': campaign_data.get('target_audience', ''),
                'description': campaign_data.get('description', ''),
                'created-date': datetime.now().isoformat()
            }
        }
        
        webflow_campaign['fieldData'].update(self.config.custom_fields)
        
        try:
            result = self.client.create_item(collection_id, webflow_campaign,
                                           is_draft=self.config.draft_mode)
            
            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])
            
            return result
            
        except WebflowAPIError as e:
            raise Exception(f"Failed to create campaign: {e.message}")
    
    def log_analytics(self, analytics_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Log analytics data to Webflow
        
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
                'date': analytics_data.get('date', datetime.now().isoformat()),
                'source': analytics_data.get('source', 'bizflow'),
                'category': analytics_data.get('category', ''),
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
    
    def create_content(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create content item (blog post, landing page, etc.)
        
        Args:
            content_data: Content information
            
        Returns:
            Created content data
        """
        if 'content' not in self.config.collection_ids:
            raise ValueError("Content collection not configured")
        
        collection_id = self.config.collection_ids['content']
        
        webflow_content = {
            'fieldData': {
                'title': content_data.get('title', ''),
                'content': content_data.get('content', ''),
                'type': content_data.get('type', 'blog_post'),
                'status': content_data.get('status', 'draft'),
                'author': content_data.get('author', ''),
                'tags': content_data.get('tags', ''),
                'seo-title': content_data.get('seo_title', ''),
                'seo-description': content_data.get('seo_description', ''),
                'created-date': datetime.now().isoformat()
            }
        }
        
        webflow_content['fieldData'].update(self.config.custom_fields)
        
        try:
            result = self.client.create_item(collection_id, webflow_content,
                                           is_draft=self.config.draft_mode)
            
            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])
            
            return result
            
        except WebflowAPIError as e:
            raise Exception(f"Failed to create content: {e.message}")
    
    def get_leads(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """Get leads from Webflow"""
        if 'leads' not in self.config.collection_ids:
            raise ValueError("Leads collection not configured")
        
        collection_id = self.config.collection_ids['leads']
        return self.client.get_items(collection_id, limit, offset)
    
    def get_campaigns(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """Get campaigns from Webflow"""
        if 'campaigns' not in self.config.collection_ids:
            raise ValueError("Campaigns collection not configured")
        
        collection_id = self.config.collection_ids['campaigns']
        return self.client.get_items(collection_id, limit, offset)
    
    def get_analytics(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """Get analytics from Webflow"""
        if 'analytics' not in self.config.collection_ids:
            raise ValueError("Analytics collection not configured")
        
        collection_id = self.config.collection_ids['analytics']
        return self.client.get_items(collection_id, limit, offset)
    
    def get_content(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """Get content from Webflow"""
        if 'content' not in self.config.collection_ids:
            raise ValueError("Content collection not configured")
        
        collection_id = self.config.collection_ids['content']
        return self.client.get_items(collection_id, limit, offset)
    
    def setup_webhooks(self) -> List[Dict[str, Any]]:
        """
        Setup webhooks for BizFlow integration
        
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
                        'collectionId': self.config.collection_ids.get('leads', '')
                    }
                }
                
                webhook = self.client.create_webhook(self.site_id, webhook_data)
                webhooks.append(webhook)
                
                print(f"✅ Created webhook for {event_type}")
                
            except WebflowAPIError as e:
                print(f"❌ Failed to create webhook for {event_type}: {e.message}")
        
        return webhooks
    
    def sync_with_crm(self, crm_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Sync CRM data with Webflow
        
        Args:
            crm_data: List of CRM records to sync
            
        Returns:
            Sync results
        """
        results = {
            'created': 0,
            'updated': 0,
            'errors': 0,
            'error_details': []
        }
        
        for record in crm_data:
            try:
                if record.get('action') == 'create':
                    self.create_lead(record)
                    results['created'] += 1
                elif record.get('action') == 'update':
                    self.update_lead_status(record['id'], record['status'], record.get('notes'))
                    results['updated'] += 1
            except Exception as e:
                results['errors'] += 1
                results['error_details'].append({
                    'record': record,
                    'error': str(e)
                })
        
        return results

# Factory function
def create_bizflow_service(client: WebflowAPIClient = None) -> BizFlowWebflowService:
    """
    Create BizFlow Webflow service instance
    
    Args:
        client: Optional Webflow API client
        
    Returns:
        BizFlowWebflowService instance
    """
    if client is None:
        from webflow_api_client import create_webflow_client
        client = create_webflow_client()
    
    return BizFlowWebflowService(client)

# Example usage
if __name__ == "__main__":
    try:
        # Create service
        service = create_bizflow_service()
        
        # Test lead creation
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
        print(f"✅ Created lead: {lead['id']}")
        
        # Test campaign creation
        campaign_data = {
            'name': 'Q1 2024 Campaign',
            'type': 'email',
            'status': 'active',
            'start_date': '2024-01-01',
            'end_date': '2024-03-31',
            'budget': 10000,
            'target_audience': 'SMB',
            'description': 'Q1 email marketing campaign'
        }
        
        campaign = service.create_campaign(campaign_data)
        print(f"✅ Created campaign: {campaign['id']}")
        
        # Test analytics logging
        analytics_data = {
            'metric_name': 'lead_conversion_rate',
            'value': 12.5,
            'date': datetime.now().isoformat(),
            'source': 'bizflow',
            'category': 'conversion',
            'description': 'Monthly lead conversion rate'
        }
        
        analytics = service.log_analytics(analytics_data)
        print(f"✅ Logged analytics: {analytics['id']}")
        
        print("\n🎉 BizFlow Webflow service test completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
