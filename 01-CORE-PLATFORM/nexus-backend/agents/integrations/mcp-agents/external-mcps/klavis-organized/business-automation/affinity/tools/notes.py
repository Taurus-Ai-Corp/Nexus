import logging
from typing import Any

from .base import AffinityV1Client

# Configure logging
logger = logging.getLogger(__name__)

async def get_all_notes(
    person_id: int | None = None,
    organization_id: int | None = None,
    opportunity_id: int | None = None,
    page_size: int | None = None,
    page_token: str | None = None
) -> dict[str, Any]:
    """Get all Notes in Affinity.
    
    Args:
        person_id: Filter by person ID
        organization_id: Filter by organization ID
        opportunity_id: Filter by opportunity ID
        page_size: Number of items per page
        page_token: Token for pagination
    """
    logger.info("Executing tool: get_all_notes")
    try:
        params = {}
        if person_id:
            params["person_id"] = person_id
        if organization_id:
            params["organization_id"] = organization_id
        if opportunity_id:
            params["opportunity_id"] = opportunity_id
        if page_size:
            params["page_size"] = page_size
        if page_token:
            params["page_token"] = page_token

        return await AffinityV1Client.make_request("GET", "/notes", params=params)
    except Exception as e:
        logger.exception(f"Error executing tool get_all_notes: {e}")
        raise e

async def get_specific_note(note_id: int) -> dict[str, Any]:
    """Get a specific note by ID.
    
    Args:
        note_id: Note ID
    """
    logger.info(f"Executing tool: get_specific_note with note_id: {note_id}")
    try:
        return await AffinityV1Client.make_request("GET", f"/notes/{note_id}")
    except Exception as e:
        logger.exception(f"Error executing tool get_specific_note: {e}")
        raise e
