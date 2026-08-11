#!/usr/bin/env python3
"""
TAURUS AI CORP - API Package
All API routes and endpoints for BizFlow™ platform
"""

# platform_core_router was previously re-exported here, but it was never
# importable: platform_core.py uses relative imports (`from ..auth import
# verify_token`, `from ..database import ...`) that require `backend` to be
# a package. `backend/` has no `__init__.py` (main.py instead puts `backend/`
# on sys.path and imports flat), so `from api import platform_core_router`
# raised "ImportError: attempted relative import beyond top-level package".
# The router is also not mounted anywhere in main.py and its 9 endpoints
# (platform_core.py) are unrun, mock-data-backed code — mounting them is a
# feature launch, not a lint/cleanup fix. Re-add the export only alongside a
# real fix to platform_core.py's imports and a decision to ship those routes.
__all__: list[str] = []
