#!/usr/bin/env python3
"""
🌐 Webflow Services Package
Taurus AI Corp - Universal Webflow integration services for all projects
"""

from .bizflow_service import BizFlowWebflowService, create_bizflow_service
from .kaya_rattan_service import KayaRattanWebflowService, create_kaya_rattan_service
from .vibe_marketing_service import VibeMarketingWebflowService, create_vibe_marketing_service
from .web_land_dash_service import WebLandDashWebflowService, create_web_land_dash_service

__all__ = [
    'BizFlowWebflowService',
    'create_bizflow_service',
    'VibeMarketingWebflowService',
    'create_vibe_marketing_service',
    'KayaRattanWebflowService',
    'create_kaya_rattan_service',
    'WebLandDashWebflowService',
    'create_web_land_dash_service'
]

# Service factory for easy access
def get_service(project_name: str, client=None):
    """
    Factory function to get the appropriate service for a project
    
    Args:
        project_name: Name of the project (bizflow, vibe_marketing, kaya_rattan, web_land_dash)
        client: Optional Webflow API client
        
    Returns:
        Appropriate service instance
    """
    if client is None:
        from webflow_api_client import create_webflow_client
        client = create_webflow_client()

    project_services = {
        'bizflow': create_bizflow_service,
        'vibe_marketing': create_vibe_marketing_service,
        'kaya_rattan': create_kaya_rattan_service,
        'web_land_dash': create_web_land_dash_service
    }

    if project_name not in project_services:
        raise ValueError(f"Unknown project: {project_name}. Available projects: {list(project_services.keys())}")

    return project_services[project_name](client)
