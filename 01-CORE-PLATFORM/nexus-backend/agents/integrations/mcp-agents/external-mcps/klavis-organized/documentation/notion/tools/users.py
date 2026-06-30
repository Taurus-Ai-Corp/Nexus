from typing import Any

from .base import clean_notion_response, get_notion_client, handle_notion_error


async def get_user(user_id: str) -> dict[str, Any]:
    """Retrieve a user from Notion."""
    try:
        notion = get_notion_client()
        response = notion.users.retrieve(user_id)
        return clean_notion_response(response)

    except Exception as e:
        return handle_notion_error(e)


async def get_me() -> dict[str, Any]:
    """Retrieve your token's bot user information."""
    try:
        notion = get_notion_client()
        response = notion.users.me()
        return clean_notion_response(response)

    except Exception as e:
        return handle_notion_error(e)


async def list_users(
    start_cursor: str | None = None,
    page_size: int | None = None
) -> dict[str, Any]:
    """List all users in the workspace."""
    try:
        notion = get_notion_client()

        params = {}
        if start_cursor:
            params["start_cursor"] = start_cursor
        if page_size:
            params["page_size"] = page_size

        response = notion.users.list(**params)
        return clean_notion_response(response)

    except Exception as e:
        return handle_notion_error(e)


