from typing import Any

from .base import clean_notion_response, get_notion_client, handle_notion_error


async def search_notion(
    query: str | None = None,
    sort: dict[str, Any] | None = None,
    filter_conditions: dict[str, Any] | None = None,
    start_cursor: str | None = None,
    page_size: int | None = None
) -> dict[str, Any]:
    """Search for pages and databases in Notion."""
    try:
        notion = get_notion_client()

        search_params = {}
        if query:
            search_params["query"] = query
        if sort:
            search_params["sort"] = sort
        if filter_conditions:
            search_params["filter"] = filter_conditions
        if start_cursor:
            search_params["start_cursor"] = start_cursor
        if page_size:
            search_params["page_size"] = page_size

        response = notion.search(**search_params)
        return clean_notion_response(response)

    except Exception as e:
        return handle_notion_error(e)
