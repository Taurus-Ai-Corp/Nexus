import logging
from typing import Any

from .base import make_airtable_request

# Configure logging
logger = logging.getLogger("airtable_tools")


async def get_bases_info() -> dict[str, Any]:
    """Get information about all bases."""
    endpoint = "meta/bases"
    logger.info("Executing tool: get_bases_info")
    return await make_airtable_request("GET", endpoint)
