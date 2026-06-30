import logging
from typing import Any

from .base import handle_freshdesk_error, make_freshdesk_request, remove_none_values

# Configure logging
logger = logging.getLogger(__name__)

async def list_agents(
    email: str | None = None,
    mobile: str | None = None,
    phone: str | None = None,
    state: str | None = None,
    page: int = 1,
    per_page: int = 30,
) -> dict[str, Any]:
    """
    List all agents with optional filtering.
    
    Args:
        email: Filter by email address
        mobile: Filter by mobile number
        phone: Filter by phone number
        state: Filter by state ('fulltime' or 'occasional')
        page: Page number (1-based)
        per_page: Number of results per page (max 100)
        
    Returns:
        Dictionary containing agents and pagination info
    """
    try:
        params = {
            'email': email,
            'mobile': mobile,
            'phone': phone,
            'state': state,
            'page': page,
            'per_page': min(100, max(1, per_page)),
        }
        params = remove_none_values(params)

        response = await make_freshdesk_request(
            'GET',
            '/agents',
            options={"query_params": params}
        )

        return response

    except Exception as e:
        return handle_freshdesk_error(e, 'list', 'agents')


async def get_agent_by_id(agent_id: int) -> dict[str, Any]:
    """
    Get details of a specific agent by ID.
    
    Args:
        agent_id: ID of the agent to retrieve
        
    Returns:
        Dictionary containing agent details
    """
    try:
        return await make_freshdesk_request('GET', f'/agents/{agent_id}')
    except Exception as e:
        return handle_freshdesk_error(e, 'get', 'agent', agent_id)


async def get_current_agent() -> dict[str, Any]:
    """
    Get details of the currently authenticated agent.
    
    Returns:
        Dictionary containing current agent details
    """
    try:
        return await make_freshdesk_request('GET', '/agents/me')
    except Exception as e:
        return handle_freshdesk_error(e, 'get', 'current agent')


async def create_agent(
    email: str,
    name: str,
    ticket_scope: int,
    role_ids: list[int],
    group_ids: list[int] | None = None,
    skill_ids: list[int] | None = None,
    occasional: bool = False,
    signature: str | None = None,
    language: str = 'en',
    time_zone: str | None = None,
    agent_type: int = 1,
    focus_mode: bool = True,
    **kwargs
) -> dict[str, Any]:
    """
    Create a new agent.
    
    Args:
        email: Email address of the agent
        name: Name of the agent
        ticket_scope: Ticket permission (1=Global, 2=Group, 3=Restricted)
        role_ids: List of role IDs for the agent
        group_ids: List of group IDs the agent belongs to
        skill_ids: List of skill IDs for the agent
        occasional: Whether the agent is occasional (True) or full-time (False)
        signature: HTML signature for the agent
        language: Language code (default: 'en')
        time_zone: Time zone for the agent
        agent_type: Type of agent (1=Support, 2=Field, 3=Collaborator)
        focus_mode: Whether focus mode is enabled (default: True)
        
    Returns:
        Dictionary containing the created agent details
    """
    try:
        data = {
            'email': email,
            'name': name,
            'ticket_scope': ticket_scope,
            'role_ids': role_ids,
            'group_ids': group_ids,
            'skill_ids': skill_ids,
            'occasional': occasional,
            'signature': signature,
            'language': language,
            'time_zone': time_zone,
            'agent_type': agent_type,
            'focus_mode': focus_mode,
            **kwargs
        }

        data = remove_none_values(data)

        return await make_freshdesk_request('POST', '/agents', data=data)

    except Exception as e:
        return handle_freshdesk_error(e, 'create', 'agent')


async def update_agent(
    agent_id: int,
    email: str | None = None,
    ticket_scope: int | None = None,
    role_ids: list[int] | None = None,
    group_ids: list[int] | None = None,
    skill_ids: list[int] | None = None,
    occasional: bool | None = None,
    signature: str | None = None,
    language: str | None = None,
    time_zone: str | None = None,
    focus_mode: bool | None = None,
    **kwargs
) -> dict[str, Any]:
    """
    Update an existing agent.
    
    Args:
        agent_id: ID of the agent to update
        email: New email address
        ticket_scope: New ticket permission (1=Global, 2=Group, 3=Restricted)
        role_ids: New list of role IDs
        group_ids: New list of group IDs
        skill_ids: New list of skill IDs
        occasional: Whether the agent is occasional
        signature: New HTML signature
        language: New language code
        time_zone: New time zone
        focus_mode: Whether focus mode is enabled
        
    Returns:
        Dictionary containing the updated agent details
    """
    try:
        data = {
            'email': email,
            'ticket_scope': ticket_scope,
            'role_ids': role_ids,
            'group_ids': group_ids,
            'skill_ids': skill_ids,
            'occasional': occasional,
            'signature': signature,
            'language': language,
            'time_zone': time_zone,
            'focus_mode': focus_mode,
            **kwargs
        }

        data = remove_none_values(data)

        if not data:
            raise ValueError("No fields to update")

        return await make_freshdesk_request('PUT', f'/agents/{agent_id}', data=data)

    except Exception as e:
        return handle_freshdesk_error(e, 'update', 'agent', agent_id)


async def delete_agent(agent_id: int) -> dict[str, Any]:
    """
    Delete an agent (downgrades to contact).
    
    Args:
        agent_id: ID of the agent to delete
        
    Returns:
        Empty dictionary on success
    """
    try:
        await make_freshdesk_request('DELETE', f'/agents/{agent_id}')
        return {'success': True, 'message': f'Agent {agent_id} deleted successfully'}
    except Exception as e:
        return handle_freshdesk_error(e, 'delete', 'agent', agent_id)


async def search_agents(term: str) -> list[dict[str, Any]]:
    """
    Search for agents by name or email.
    
    Args:
        term: Search term (name or email)
        
    Returns:
        List of matching agents
    """
    try:
        return await make_freshdesk_request(
            'GET',
            '/agents/autocomplete',
            options={"query_params": {"term": term}}
        )
    except Exception as e:
        return handle_freshdesk_error(e, 'search', 'agents')


async def bulk_create_agents(agents_data: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Create multiple agents in bulk.
    
    Args:
        agents_data: List of agent data dictionaries
        
    Returns:
        Dictionary with job ID and status URL
    """
    try:
        return await make_freshdesk_request(
            'POST',
            '/agents/bulk',
            data={'agents': agents_data}
        )
    except Exception as e:
        return handle_freshdesk_error(e, 'bulk create', 'agents')
