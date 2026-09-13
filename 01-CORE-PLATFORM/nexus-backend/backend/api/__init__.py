#!/usr/bin/env python3
"""
TAURUS AI CORP - API Package
All API routes and endpoints for NEORM-ERA platform
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
# free_tier.py IS exported, because it does not have either problem above:
#
#   * Imports are flat (`from services.tenancy import ...`), matching how
#     main.py puts backend/ on sys.path — so it imports cleanly rather than
#     raising "attempted relative import beyond top-level package".
#   * It is not mock-backed. It calls the real generate_and_bill contract, and
#     its behaviour is covered by tests/test_free_tier_endpoint.py (12 tests)
#     and tests/test_free_tier.py (19).
#
# Mounting it IS a feature launch, per the reasoning above, and it was an owner
# decision on 2026-09-13: free tier, 2 generations per email per month.
#
# Quotas are durable as of the SupabaseLedger swap: free_tier builds a
# SupabaseLedger from DATABASE_URL, and the monthly grant is enforced by the
# UNIQUE index on credit_ledger.idempotency_key rather than by anything held in
# process memory. It previously used an in-memory Ledger, which meant every
# deploy silently reset every user's allowance while reporting success.
#
# Two deployment prerequisites, both of which turn the tier OFF (503) rather
# than degrading it if missing — never a silent fallback:
#
#   * DATABASE_URL, with migrations 0001-0003 applied. 0003 in particular adds
#     generation_jobs.quota_credits; without it every free job is rejected by
#     the free_must_consume_quota constraint.
#   * FREE_TIER_API_KEY, so free traffic can never spend the platform key.
from .free_tier import router as free_tier_router  # noqa: E402

__all__: list[str] = ["free_tier_router"]
