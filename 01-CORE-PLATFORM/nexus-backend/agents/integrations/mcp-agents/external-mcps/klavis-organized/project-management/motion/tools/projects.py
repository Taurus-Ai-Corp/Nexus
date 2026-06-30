import logging
from typing import Any

from .base import make_api_request

# Configure logging
logger = logging.getLogger(__name__)

async def get_projects(workspace_id: str | None = None) -> dict[str, Any]:
    """Get all projects."""
    logger.info("Executing tool: get_projects")
    try:
        endpoint = "/projects"
        if workspace_id:
            endpoint += f"?workspaceId={workspace_id}"

        return await make_api_request(endpoint)
    except Exception as e:
        logger.exception(f"Error executing tool get_projects: {e}")
        raise e

async def get_project(project_id: str) -> dict[str, Any]:
    """Get a specific project by ID."""
    logger.info(f"Executing tool: get_project with project_id={project_id}")
    try:
        endpoint = f"/projects/{project_id}"
        return await make_api_request(endpoint)
    except Exception as e:
        logger.exception(f"Error executing tool get_project: {e}")
        raise e

async def create_project(
    name: str,
    workspace_id: str,
    description: str | None = None,
    status: str | None = None
) -> dict[str, Any]:
    """Create a new project."""
    logger.info(f"Executing tool: create_project with name={name}")
    try:
        data = {
            "name": name,
            "workspaceId": workspace_id
        }

        if description:
            data["description"] = description
        if status:
            data["status"] = status

        return await make_api_request("/projects", method="POST", data=data)
    except Exception as e:
        logger.exception(f"Error executing tool create_project: {e}")
        raise e
