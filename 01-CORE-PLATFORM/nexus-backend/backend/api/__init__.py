#!/usr/bin/env python3
"""
TAURUS AI CORP - API Package
All API routes and endpoints for BizFlow™ platform
"""

from .platform_core import router as platform_core_router

__all__ = [
    "platform_core_router"
]