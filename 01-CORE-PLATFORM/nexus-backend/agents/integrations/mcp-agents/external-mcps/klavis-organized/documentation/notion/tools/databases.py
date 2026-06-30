from typing import Any

from .base import clean_notion_response, get_notion_client, handle_notion_error


async def query_database(
    database_id: str,
    filter_conditions: dict[str, Any] | None = None,
    sorts: list[dict[str, Any]] | None = None,
    start_cursor: str | None = None,
    page_size: int | None = None,
    filter_properties: list[str] | None = None,
    archived: bool | None = None,
    in_trash: bool | None = None
) -> dict[str, Any]:
    """Query a database in Notion."""
    try:
        notion = get_notion_client()

        query_params = {}
        if filter_conditions:
            query_params["filter"] = filter_conditions
        if sorts:
            query_params["sorts"] = sorts
        if start_cursor:
            query_params["start_cursor"] = start_cursor
        if page_size:
            query_params["page_size"] = page_size
        if filter_properties:
            query_params["filter_properties"] = filter_properties
        if archived is not None:
            query_params["archived"] = archived
        if in_trash is not None:
            query_params["in_trash"] = in_trash

        response = notion.databases.query(database_id, **query_params)
        return clean_notion_response(response)

    except Exception as e:
        return handle_notion_error(e)


async def get_database(database_id: str) -> dict[str, Any]:
    """Retrieve a database from Notion."""
    try:
        notion = get_notion_client()
        response = notion.databases.retrieve(database_id)
        return clean_notion_response(response)

    except Exception as e:
        return handle_notion_error(e)


async def create_database(
    parent: dict[str, Any],
    title: list[dict[str, Any]],
    properties: dict[str, Any],
    icon: dict[str, Any] | None = None,
    cover: dict[str, Any] | None = None,
    description: list[dict[str, Any]] | None = None
) -> dict[str, Any]:
    """Create a new database in Notion."""
    try:
        notion = get_notion_client()

        database_data = {
            "parent": parent,
            "title": title,
            "properties": properties
        }

        if icon:
            database_data["icon"] = icon
        if cover:
            database_data["cover"] = cover
        if description:
            database_data["description"] = description

        response = notion.databases.create(**database_data)
        return clean_notion_response(response)

    except Exception as e:
        return handle_notion_error(e)


async def update_database(
    database_id: str,
    title: list[dict[str, Any]] | None = None,
    description: list[dict[str, Any]] | None = None,
    properties: dict[str, Any] | None = None,
    icon: dict[str, Any] | None = None,
    cover: dict[str, Any] | None = None,
    archived: bool | None = None
) -> dict[str, Any]:
    """Update a database in Notion."""
    try:
        notion = get_notion_client()

        update_data = {}
        if title is not None:
            update_data["title"] = title
        if description is not None:
            update_data["description"] = description
        if properties is not None:
            update_data["properties"] = properties
        if icon is not None:
            update_data["icon"] = icon
        if cover is not None:
            update_data["cover"] = cover
        if archived is not None:
            update_data["archived"] = archived

        response = notion.databases.update(database_id, **update_data)
        return clean_notion_response(response)

    except Exception as e:
        return handle_notion_error(e)


async def create_database_item(
    database_id: str,
    properties: dict[str, Any],
    children: list[dict[str, Any]] | None = None,
    icon: dict[str, Any] | None = None,
    cover: dict[str, Any] | None = None
) -> dict[str, Any]:
    """Create a new item (page) in a database."""
    try:
        notion = get_notion_client()

        page_data = {
            "parent": {"database_id": database_id},
            "properties": properties
        }

        if children:
            page_data["children"] = children
        if icon:
            page_data["icon"] = icon
        if cover:
            page_data["cover"] = cover

        response = notion.pages.create(**page_data)
        return clean_notion_response(response)

    except Exception as e:
        return handle_notion_error(e)
