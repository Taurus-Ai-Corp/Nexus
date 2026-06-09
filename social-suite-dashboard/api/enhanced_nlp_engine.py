# Enhanced NLP Engine for Social Media Management
# Integrates with Nexus and agent systems

import re
import json
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

def interpret_command(text: str) -> Dict[str, Any]:
    """
    Enhanced NLP interpretation for social media management commands.
    Returns intent, entities, and suggested action for Nexus/Meta/Instagram operations.
    """
    text_lower = text.lower().strip()
    
    # Initialize response structure
    response = {
        'intent': 'unknown',
        'entities': {},
        'suggested_action': {
            'endpoint': '',
            'method': 'GET',
            'payload': {}
        }
    }
    
    # Instagram Campaign Creation (BEFORE general campaign)
    if any(phrase in text_lower for phrase in ['instagram campaign', 'ig campaign', 'instagram ad', 'instagram story', 'instagram reel']):
        response['intent'] = 'create_instagram_campaign'
        response['entities'] = _extract_instagram_entities(text)
        response['suggested_action'] = {
            'endpoint': '/api/nexus/instagram-campaigns',
            'method': 'POST',
            'payload': _build_instagram_campaign_payload(response['entities'])
        }
    
    # Meta Business Suite Campaign Creation
    elif any(phrase in text_lower for phrase in ['meta campaign', 'facebook campaign', 'business suite campaign']):
        response['intent'] = 'create_meta_campaign'
        response['entities'] = _extract_meta_campaign_entities(text)
        response['suggested_action'] = {
            'endpoint': '/api/nexus/meta-campaigns',
            'method': 'POST',
            'payload': _build_meta_campaign_payload(response['entities'])
        }
    
    # Lead Generation Campaign
    elif any(phrase in text_lower for phrase in ['lead gen', 'lead generation', 'leads for']):
        response['intent'] = 'create_lead_gen_campaign'
        response['entities'] = _extract_lead_gen_entities(text)
        response['suggested_action'] = {
            'endpoint': '/api/campaigns',
            'method': 'POST',
            'payload': _build_lead_gen_payload(response['entities'])
        }
    
    # Campaign Status/Listing
    elif any(phrase in text_lower for phrase in ['show campaigns', 'list campaigns', 'campaign status', 'get campaigns', 'see campaigns']):
        response['intent'] = 'list_campaigns'
        response['entities'] = _extract_filter_entities(text)
        response['suggested_action'] = {
            'endpoint': '/api/campaigns',
            'method': 'GET',
            'params': response['entities']
        }
    
    # Pause/Resume Campaign
    elif 'pause' in text_lower and 'campaign' in text_lower:
        response['intent'] = 'pause_campaign'
        campaign_id = _extract_campaign_id(text)
        response['entities'] = {'campaign_id': campaign_id}
        response['suggested_action'] = {
            'endpoint': f'/api/campaigns/{campaign_id}/pause',
            'method': 'POST',
            'payload': {}
        }
    
    elif 'resume' in text_lower and 'campaign' in text_lower:
        response['intent'] = 'resume_campaign'
        campaign_id = _extract_campaign_id(text)
        response['entities'] = {'campaign_id': campaign_id}
        response['suggested_action'] = {
            'endpoint': f'/api/campaigns/{campaign_id}/resume',
            'method': 'POST',
            'payload': {}
        }
    
    # Asset Creation/Upload
    elif any(phrase in text_lower for phrase in ['create asset', 'upload image', 'add creative']):
        response['intent'] = 'create_asset'
        response['entities'] = _extract_asset_entities(text)
        response['suggested_action'] = {
            'endpoint': '/api/assets',
            'method': 'POST',
            'payload': response['entities']
        }
    
    # Agent Orchestration (Nexus)
    elif any(phrase in text_lower for phrase in ['run agent', 'execute agent', 'nexus agent', 'orchestrate agent', 'agent']):
        response['intent'] = 'orchestrate_agent'
        response['entities'] = _extract_agent_entities(text)
        response['suggested_action'] = {
            'endpoint': '/api/agents/orchestrate',
            'method': 'POST',
            'payload': response['entities']
        }
    
    # Analytics/Reporting
    elif any(phrase in text_lower for phrase in ['show analytics', 'campaign performance', 'metrics', 'get analytics', 'performance']):
        response['intent'] = 'get_analytics'
        response['entities'] = _extract_analytics_entities(text)
        response['suggested_action'] = {
            'endpoint': '/api/analytics/campaigns',
            'method': 'GET',
            'params': response['entities']
        }
    
    # Default fallback - treat as general campaign creation
    else:
        response['intent'] = 'create_general_campaign'
        response['entities'] = _extract_general_campaign_entities(text)
        response['suggested_action'] = {
            'endpoint': '/api/campaigns',
            'method': 'POST',
            'payload': _build_general_campaign_payload(response['entities'])
        }
    
    return response

def _extract_meta_campaign_entities(text: str) -> Dict[str, Any]:
    """Extract entities for Meta Business Suite campaign creation"""
    entities = {}
    
    # Extract budget
    budget_match = re.search(r'\$?(\d+(?:\.\d+)?)\s*/?\s*day', text, re.IGNORECASE)
    if budget_match:
        entities['budget_daily'] = float(budget_match.group(1))
    
    total_budget_match = re.search(r'total\s*\$?(\d+(?:\.\d+)?)', text, re.IGNORECASE)
    if total_budget_match:
        entities['budget_total'] = float(total_budget_match.group(1))
    
    # Extract objective
    if 'lead' in text.lower():
        entities['objective'] = 'lead_gen'
    elif 'sales' in text.lower() or 'conversion' in text.lower():
        entities['objective'] = 'sales'
    elif 'engagement' in text.lower():
        entities['objective'] = 'engagement'
    elif 'awareness' in text.lower() or 'reach' in text.lower():
        entities['objective'] = 'brand_awareness'
    else:
        entities['objective'] = 'lead_gen'  # default
    
    # Extract targeting/location
    location_match = re.search(r'(?:targeting|in|for)\s+([^,.]+?)(?:\s+with|\s+and|$)', text, re.IGNORECASE)
    if location_match:
        entities['target_location'] = location_match.group(1).strip()
    
    # Extract audience demographics
    age_match = re.search(r'(\d+)\s*[-to]\s*(\d+)', text)
    if age_match:
        entities['age_range'] = f"{age_match.group(1)}-{age_match.group(2)}"
    
    gender_match = re.search(r'(male|female|men|women)', text, re.IGNORECASE)
    if gender_match:
        entities['gender'] = gender_match.group(1).lower()
    
    # Extract campaign name
    name_match = re.search(r'(?:called|named|campaign\s+)[\"\'”]?([^\"\'”.,]+)[\"\'”]?', text, re.IGNORECASE)
    if name_match:
        entities['name'] = name_match.group(1).strip()
    else:
        entities['name'] = f"Meta Campaign {datetime.now().strftime('%Y%m%d_%H%M')}"
    
    # Extract duration
    days_match = re.search(r'(\d+)\s*day', text, re.IGNORECASE)
    if days_match and 'budget_total' not in entities:
        entities['duration_days'] = int(days_match.group(1))
        if 'budget_daily' in entities:
            entities['budget_total'] = entities['budget_daily'] * entities['duration_days']
    
    return entities

def _extract_instagram_entities(text: str) -> Dict[str, Any]:
    """Extract entities for Instagram campaign creation"""
    entities = _extract_meta_campaign_entities(text)  # Start with Meta base
    
    # Instagram-specific adjustments
    entities['platform'] = 'instagram'
    
    # Instagram ad formats
    if 'story' in text.lower():
        entities['ad_format'] = 'story'
    elif 'reel' in text.lower():
        entities['ad_format'] = 'reel'
    elif 'feed' in text.lower():
        entities['ad_format'] = 'feed'
    elif 'explore' in text.lower():
        entities['ad_format'] = 'explore'
    else:
        entities['ad_format'] = 'feed'  # default
    
    # Instagram-specific objectives
    if 'engagement' in text.lower() or 'likes' in text.lower() or 'comments' in text.lower():
        entities['objective'] = 'engagement'
    elif 'profile visits' in text.lower() or 'followers' in text.lower():
        entities['objective'] = 'profile_visits'
    elif 'website clicks' in text.lower() or 'link clicks' in text.lower():
        entities['objective'] = 'traffic'
    
    return entities

def _extract_lead_gen_entities(text: str) -> Dict[str, Any]:
    """Extract entities for lead generation campaign"""
    entities = {}
    
    # Budget
    budget_match = re.search(r'\$?(\d+(?:\.\d+)?)\s*/?\s*day', text, re.IGNORECASE)
    if budget_match:
        entities['budget_daily'] = float(budget_match.group(1))
    
    # Objective
    entities['objective'] = 'lead_gen'
    entities['platform'] = 'meta'  # default to meta for lead gen
    
    # Location/Targeting
    location_match = re.search(r'(?:for|in|targeting)\s+([^,.]+?)(?:\s+with|\s+and|$)', text, re.IGNORECASE)
    if location_match:
        entities['target_location'] = location_match.group(1).strip()
    
    # Business type/industry
    industry_match = re.search(r'(?:for|of)\s+(cafés?|restaurants?|shops?|stores?|businesses?)\s+in', text, re.IGNORECASE)
    if industry_match:
        entities['industry'] = industry_match.group(1).rstrip('s')
    
    # Campaign name
    if 'windsor' in text.lower():
        entities['name'] = f"Windsor Lead Gen Campaign {datetime.now().strftime('%Y%m%d')}"
    else:
        entities['name'] = f"Lead Gen Campaign {datetime.now().strftime('%Y%m%d_%H%M')}"
    
    return entities

def _extract_general_campaign_entities(text: str) -> Dict[str, Any]:
    """Extract entities for general campaign creation"""
    entities = {}
    
    # Basic info
    entities['name'] = f"Campaign {datetime.now().strftime('%Y%m%d_%H%M')}"
    entities['objective'] = 'engagement'
    entities['platform'] = 'meta'
    entities['status'] = 'draft'
    entities['budget_daily'] = 25.0  # default
    
    # Try to extract any numbers as budget
    budget_nums = re.findall(r'\$?(\d+(?:\.\d+)?)', text)
    if budget_nums:
        entities['budget_daily'] = float(budget_nums[0])
    
    return entities

def _extract_asset_entities(text: str) -> Dict[str, Any]:
    """Extract entities for asset creation/upload"""
    entities = {}
    
    # Asset type
    if 'image' in text.lower() or 'photo' in text.lower():
        entities['type'] = 'image'
    elif 'video' in text.lower() or 'reel' in text.lower():
        entities['type'] = 'video'
    elif 'copy' in text.lower() or 'text' in text.lower():
        entities['type'] = 'copy'
    else:
        entities['type'] = 'image'  # default
    
    # Extract filename or description
    desc_match = re.search(r'(?:called|named|titled)\s+[\"\'”]?([^\"\'”.,]+)[\"\'”]?', text, re.IGNORECASE)
    if desc_match:
        entities['description'] = desc_match.group(1).strip()
        entities['file_path'] = f"assets/{desc_match.group(1).strip().replace(' ', '_')}.jpg"
    else:
        entities['description'] = f"Asset {datetime.now().strftime('%Y%m%d_%H%M')}"
        entities['file_path'] = f"assets/asset_{datetime.now().strftime('%Y%m%d_%H%M')}.jpg"
    
    # Tags
    if 'cafe' in text.lower() or 'coffee' in text.lower():
        entities['tags'] = ['cafe', 'beverage', 'local']
    elif 'windsor' in text.lower():
        entities['tags'] = ['windsor', 'local', 'ontario']
    else:
        entities['tags'] = ['social', 'marketing']
    
    return entities

def _extract_agent_entities(text: str) -> Dict[str, Any]:
    """Extract entities for agent orchestration"""
    entities = {}
    
    # Agent type/platform
    if 'nexus' in text.lower():
        entities['platform'] = 'nexus'
        entities['agent_type'] = 'seo' if 'seo' in text.lower() else 'analytics'
    else:
        entities['platform'] = 'nexus'  # default
        entities['agent_type'] = 'orchestrator'
    
    # Task description
    task_match = re.search(r'(?:run|execute)\s+(?:agent\s+)?[^,.]+?\s+(?:to\s+|for\s+)?([^,.]+)', text, re.IGNORECASE)
    if task_match:
        entities['task_description'] = task_match.group(1).strip()
    else:
        entities['task_description'] = text
    
    # Priority
    if 'urgent' in text.lower() or 'asap' in text.lower():
        entities['priority'] = 'high'
    elif 'low' in text.lower():
        entities['priority'] = 'low'
    else:
        entities['priority'] = 'medium'
    
    return entities

def _extract_filter_entities(text: str) -> Dict[str, Any]:
    """Extract entities for filtering/listing"""
    filters = {}
    
    # Platform filter
    if 'instagram' in text.lower():
        filters['platform'] = 'instagram'
    elif 'meta' in text.lower() or 'facebook' in text.lower():
        filters['platform'] = 'meta'
    
    # Status filter
    if 'active' in text.lower():
        filters['status'] = 'active'
    elif 'paused' in text.lower():
        filters['status'] = 'paused'
    elif 'completed' in text.lower():
        filters['status'] = 'completed'
    elif 'draft' in text.lower():
        filters['status'] = 'draft'
    
    return filters

def _extract_analytics_entities(text: str) -> Dict[str, Any]:
    """Extract entities for analytics requests"""
    entities = {}
    
    # Time range
    if 'week' in text.lower():
        entities['time_range'] = '7d'
    elif 'month' in text.lower():
        entities['time_range'] = '30d'
    elif 'today' in text.lower():
        entities['time_range'] = '1d'
    else:
        entities['time_range'] = '7d'  # default
    
    # Metrics
    metrics = []
    if 'reach' in text.lower() or 'impressions' in text.lower():
        metrics.append('reach')
    if 'engagement' in text.lower() or 'likes' in text.lower():
        metrics.append('engagement')
    if 'clicks' in text.lower() or 'ctr' in text.lower():
        metrics.append('clicks')
    if 'conversions' in text.lower() or 'leads' in text.lower():
        metrics.append('conversions')
    if 'spend' in text.lower() or 'budget' in text.lower():
        metrics.append('spend')
    
    if metrics:
        entities['metrics'] = ','.join(metrics)
    
    return entities

def _extract_campaign_id(text: str) -> Optional[int]:
    """Extract campaign ID from text"""
    # Look for numbers that could be campaign IDs
    numbers = re.findall(r'\b(\d+)\b', text)
    for num in numbers:
        if len(num) <= 4 and int(num) > 0:  # reasonable campaign ID
            return int(num)
    return None

def _build_meta_campaign_payload(entities: Dict[str, Any]) -> Dict[str, Any]:
    """Build payload for Meta campaign creation"""
    payload = {
        'name': entities.get('name', 'Meta Campaign'),
        'objective': entities.get('objective', 'lead_gen'),
        'platform': 'meta',
        'status': 'draft',
        'budget_daily': entities.get('budget_daily', 25.0),
        'targeting_json': {},
        'creatives_json': []
    }
    
    # Add targeting info
    targeting = {}
    if 'target_location' in entities:
        targeting['location'] = entities['target_location']
    if 'age_range' in entities:
        targeting['age_range'] = entities['age_range']
    if 'gender' in entities:
        targeting['gender'] = entities['gender']
    
    payload['targeting_json'] = targeting
    
    # Add duration if specified
    if 'duration_days' in entities:
        payload['end_date'] = datetime.utcnow() + timedelta(days=entities['duration_days'])
    else:
        payload['end_date'] = datetime.utcnow() + timedelta(days=30)  # default 30 days
    
    payload['start_date'] = datetime.utcnow()
    
    return payload

def _build_instagram_campaign_payload(entities: Dict[str, Any]) -> Dict[str, Any]:
    """Build payload for Instagram campaign creation"""
    payload = _build_meta_campaign_payload(entities)
    payload['platform'] = 'instagram'
    payload['targeting_json']['ad_format'] = entities.get('ad_format', 'feed')
    
    # Instagram-specific objective mapping
    obj_mapping = {
        'profile_visits': 'engagement',
        'traffic': 'lead_gen'
    }
    if payload['objective'] in obj_mapping:
        payload['objective'] = obj_mapping[payload['objective']]
    
    return payload

def _build_lead_gen_payload(entities: Dict[str, Any]) -> Dict[str, Any]:
    """Build payload for lead generation campaign"""
    payload = {
        'name': entities.get('name', 'Lead Generation Campaign'),
        'objective': 'lead_gen',
        'platform': entities.get('platform', 'meta'),
        'status': 'draft',
        'budget_daily': entities.get('budget_daily', 25.0),
        'targeting_json': {},
        'creatives_json': []
    }
    
    if 'target_location' in entities:
        payload['targeting_json']['location'] = entities['target_location']
    if 'industry' in entities:
        payload['targeting_json']['industry'] = entities['industry']
    
    payload['start_date'] = datetime.utcnow()
    payload['end_date'] = datetime.utcnow() + timedelta(days=30)
    
    return payload

def _build_general_campaign_payload(entities: Dict[str, Any]) -> Dict[str, Any]:
    """Build payload for general campaign"""
    payload = {
        'name': entities.get('name', 'General Campaign'),
        'objective': entities.get('objective', 'engagement'),
        'platform': entities.get('platform', 'meta'),
        'status': 'draft',
        'budget_daily': entities.get('budget_daily', 25.0),
        'targeting_json': {},
        'creatives_json': []
    }
    
    payload['start_date'] = datetime.utcnow()
    payload['end_date'] = datetime.utcnow() + timedelta(days=30)
    
    return payload

# Legacy function for backward compatibility
def interpret_command_legacy(text: str) -> Dict[str, Any]:
    """Legacy NLP interpretation - kept for compatibility"""
    return {
        'intent': 'launch_campaign',
        'entities': {
            'platform': 'instagram',
            'objective': 'lead_gen',
            'location': 'Windsor',
            'budget_daily': 25
        },
        'action': {
            'endpoint': '/api/campaigns',
            'method': 'POST',
            'payload': {
                'name': 'Auto-generated Campaign',
                'objective': 'lead_gen',
                'platform': 'instagram',
                'status': 'draft'
            }
        }
    }