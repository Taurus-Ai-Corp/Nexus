#!/usr/bin/env python3
"""
🎨 Vibe Marketing Webflow Service
Taurus AI Corp - Specialized Webflow integration for Vibe Marketing
"""

from datetime import datetime
from typing import Any

from webflow_api_client import WebflowAPIClient, WebflowAPIError
from webflow_config import get_project_config


class VibeMarketingWebflowService:
    """
    Specialized Webflow service for Vibe Marketing operations
    """

    def __init__(self, client: WebflowAPIClient):
        self.client = client
        self.config = get_project_config('vibe_marketing')
        self.site_id = self.config.site_id

        if not self.site_id:
            raise ValueError("Vibe Marketing site ID not configured. Run webflow_oauth_setup.py first.")

    def create_social_post(self, post_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create a new social media post
        
        Args:
            post_data: Post information including content, platform, etc.
            
        Returns:
            Created post data
        """
        if 'social_posts' not in self.config.collection_ids:
            raise ValueError("Social posts collection not configured")

        collection_id = self.config.collection_ids['social_posts']

        webflow_post = {
            'fieldData': {
                'title': post_data.get('title', ''),
                'content': post_data.get('content', ''),
                'platform': post_data.get('platform', ''),
                'post-type': post_data.get('post_type', 'text'),
                'status': post_data.get('status', 'draft'),
                'scheduled-date': post_data.get('scheduled_date', ''),
                'hashtags': post_data.get('hashtags', ''),
                'mentions': post_data.get('mentions', ''),
                'image-url': post_data.get('image_url', ''),
                'video-url': post_data.get('video_url', ''),
                'engagement-goal': post_data.get('engagement_goal', 0),
                'created-date': datetime.now().isoformat()
            }
        }

        webflow_post['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_post,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to create social post: {e.message}")

    def create_campaign(self, campaign_data: dict[str, Any]) -> dict[str, Any]:
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
                'type': campaign_data.get('type', 'social_media'),
                'status': campaign_data.get('status', 'planning'),
                'start-date': campaign_data.get('start_date', ''),
                'end-date': campaign_data.get('end_date', ''),
                'budget': campaign_data.get('budget', 0),
                'target-audience': campaign_data.get('target_audience', ''),
                'objectives': campaign_data.get('objectives', ''),
                'platforms': campaign_data.get('platforms', ''),
                'content-theme': campaign_data.get('content_theme', ''),
                'kpis': campaign_data.get('kpis', ''),
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

    def log_analytics(self, analytics_data: dict[str, Any]) -> dict[str, Any]:
        """
        Log social media analytics data
        
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
                'platform': analytics_data.get('platform', ''),
                'post-id': analytics_data.get('post_id', ''),
                'campaign-id': analytics_data.get('campaign_id', ''),
                'date': analytics_data.get('date', datetime.now().isoformat()),
                'source': analytics_data.get('source', 'vibe_marketing'),
                'category': analytics_data.get('category', 'engagement'),
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

    def create_asset(self, asset_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create marketing asset (image, video, template, etc.)
        
        Args:
            asset_data: Asset information
            
        Returns:
            Created asset data
        """
        if 'assets' not in self.config.collection_ids:
            raise ValueError("Assets collection not configured")

        collection_id = self.config.collection_ids['assets']

        webflow_asset = {
            'fieldData': {
                'name': asset_data.get('name', ''),
                'type': asset_data.get('type', 'image'),
                'file-url': asset_data.get('file_url', ''),
                'thumbnail-url': asset_data.get('thumbnail_url', ''),
                'size': asset_data.get('size', 0),
                'dimensions': asset_data.get('dimensions', ''),
                'format': asset_data.get('format', ''),
                'tags': asset_data.get('tags', ''),
                'description': asset_data.get('description', ''),
                'usage-rights': asset_data.get('usage_rights', ''),
                'created-date': datetime.now().isoformat()
            }
        }

        webflow_asset['fieldData'].update(self.config.custom_fields)

        try:
            result = self.client.create_item(collection_id, webflow_asset,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [result['id']])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to create asset: {e.message}")

    def update_post_engagement(self, post_id: str, engagement_data: dict[str, Any]) -> dict[str, Any]:
        """
        Update post with engagement metrics
        
        Args:
            post_id: Webflow item ID
            engagement_data: Engagement metrics
            
        Returns:
            Updated post data
        """
        if 'social_posts' not in self.config.collection_ids:
            raise ValueError("Social posts collection not configured")

        collection_id = self.config.collection_ids['social_posts']

        update_data = {
            'fieldData': {
                'likes': engagement_data.get('likes', 0),
                'shares': engagement_data.get('shares', 0),
                'comments': engagement_data.get('comments', 0),
                'clicks': engagement_data.get('clicks', 0),
                'reach': engagement_data.get('reach', 0),
                'impressions': engagement_data.get('impressions', 0),
                'engagement-rate': engagement_data.get('engagement_rate', 0),
                'updated-date': datetime.now().isoformat()
            }
        }

        try:
            result = self.client.update_item(collection_id, post_id, update_data,
                                           is_draft=self.config.draft_mode)

            if self.config.auto_publish and not self.config.draft_mode:
                self.client.publish_items(collection_id, [post_id])

            return result

        except WebflowAPIError as e:
            raise Exception(f"Failed to update post engagement: {e.message}")

    def get_social_posts(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get social posts from Webflow"""
        if 'social_posts' not in self.config.collection_ids:
            raise ValueError("Social posts collection not configured")

        collection_id = self.config.collection_ids['social_posts']
        return self.client.get_items(collection_id, limit, offset)

    def get_campaigns(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get campaigns from Webflow"""
        if 'campaigns' not in self.config.collection_ids:
            raise ValueError("Campaigns collection not configured")

        collection_id = self.config.collection_ids['campaigns']
        return self.client.get_items(collection_id, limit, offset)

    def get_analytics(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get analytics from Webflow"""
        if 'analytics' not in self.config.collection_ids:
            raise ValueError("Analytics collection not configured")

        collection_id = self.config.collection_ids['analytics']
        return self.client.get_items(collection_id, limit, offset)

    def get_assets(self, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        """Get assets from Webflow"""
        if 'assets' not in self.config.collection_ids:
            raise ValueError("Assets collection not configured")

        collection_id = self.config.collection_ids['assets']
        return self.client.get_items(collection_id, limit, offset)

    def setup_webhooks(self) -> list[dict[str, Any]]:
        """
        Setup webhooks for Vibe Marketing integration
        
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
                        'collectionId': self.config.collection_ids.get('social_posts', '')
                    }
                }

                webhook = self.client.create_webhook(self.site_id, webhook_data)
                webhooks.append(webhook)

                print(f"✅ Created webhook for {event_type}")

            except WebflowAPIError as e:
                print(f"❌ Failed to create webhook for {event_type}: {e.message}")

        return webhooks

    def sync_social_media_data(self, social_data: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Sync social media data with Webflow
        
        Args:
            social_data: List of social media records to sync
            
        Returns:
            Sync results
        """
        results = {
            'posts_created': 0,
            'analytics_logged': 0,
            'assets_created': 0,
            'errors': 0,
            'error_details': []
        }

        for record in social_data:
            try:
                record_type = record.get('type', 'post')

                if record_type == 'post':
                    self.create_social_post(record)
                    results['posts_created'] += 1
                elif record_type == 'analytics':
                    self.log_analytics(record)
                    results['analytics_logged'] += 1
                elif record_type == 'asset':
                    self.create_asset(record)
                    results['assets_created'] += 1

            except Exception as e:
                results['errors'] += 1
                results['error_details'].append({
                    'record': record,
                    'error': str(e)
                })

        return results

    def create_content_calendar(self, calendar_data: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Create content calendar entries
        
        Args:
            calendar_data: List of calendar entries
            
        Returns:
            Creation results
        """
        results = {
            'created': 0,
            'errors': 0,
            'error_details': []
        }

        for entry in calendar_data:
            try:
                # Create as social post
                post_data = {
                    'title': entry.get('title', ''),
                    'content': entry.get('content', ''),
                    'platform': entry.get('platform', ''),
                    'post_type': entry.get('post_type', 'text'),
                    'status': 'scheduled',
                    'scheduled_date': entry.get('scheduled_date', ''),
                    'hashtags': entry.get('hashtags', ''),
                    'mentions': entry.get('mentions', ''),
                    'image_url': entry.get('image_url', ''),
                    'video_url': entry.get('video_url', '')
                }

                self.create_social_post(post_data)
                results['created'] += 1

            except Exception as e:
                results['errors'] += 1
                results['error_details'].append({
                    'entry': entry,
                    'error': str(e)
                })

        return results

# Factory function
def create_vibe_marketing_service(client: WebflowAPIClient = None) -> VibeMarketingWebflowService:
    """
    Create Vibe Marketing Webflow service instance
    
    Args:
        client: Optional Webflow API client
        
    Returns:
        VibeMarketingWebflowService instance
    """
    if client is None:
        from webflow_api_client import create_webflow_client
        client = create_webflow_client()

    return VibeMarketingWebflowService(client)

# Example usage
if __name__ == "__main__":
    try:
        # Create service
        service = create_vibe_marketing_service()

        # Test social post creation
        post_data = {
            'title': 'New Product Launch',
            'content': 'Excited to announce our new product! 🚀 #innovation #tech',
            'platform': 'instagram',
            'post_type': 'image',
            'status': 'scheduled',
            'scheduled_date': '2024-01-15T10:00:00Z',
            'hashtags': '#innovation #tech #productlaunch',
            'mentions': '@company',
            'image_url': 'https://example.com/image.jpg',
            'engagement_goal': 1000
        }

        post = service.create_social_post(post_data)
        print(f"✅ Created social post: {post['id']}")

        # Test campaign creation
        campaign_data = {
            'name': 'Q1 Social Media Campaign',
            'type': 'social_media',
            'status': 'active',
            'start_date': '2024-01-01',
            'end_date': '2024-03-31',
            'budget': 5000,
            'target_audience': 'millennials',
            'objectives': 'brand_awareness',
            'platforms': 'instagram,facebook,twitter',
            'content_theme': 'innovation',
            'kpis': 'engagement,reach,conversions'
        }

        campaign = service.create_campaign(campaign_data)
        print(f"✅ Created campaign: {campaign['id']}")

        # Test analytics logging
        analytics_data = {
            'metric_name': 'engagement_rate',
            'value': 4.2,
            'platform': 'instagram',
            'post_id': post['id'],
            'campaign_id': campaign['id'],
            'date': datetime.now().isoformat(),
            'source': 'vibe_marketing',
            'category': 'engagement',
            'description': 'Daily engagement rate for Instagram posts'
        }

        analytics = service.log_analytics(analytics_data)
        print(f"✅ Logged analytics: {analytics['id']}")

        # Test asset creation
        asset_data = {
            'name': 'Product Launch Image',
            'type': 'image',
            'file_url': 'https://example.com/product-image.jpg',
            'thumbnail_url': 'https://example.com/thumb.jpg',
            'size': 2048000,
            'dimensions': '1080x1080',
            'format': 'jpg',
            'tags': 'product,launch,marketing',
            'description': 'Main product image for launch campaign',
            'usage_rights': 'commercial'
        }

        asset = service.create_asset(asset_data)
        print(f"✅ Created asset: {asset['id']}")

        print("\n🎉 Vibe Marketing Webflow service test completed successfully!")

    except Exception as e:
        print(f"❌ Test failed: {e}")
