"""
Video management tools for HeyGen API.
"""

from typing import Any

from .base import make_request


async def heygen_list_videos(
    limit: int | None = 20,
    offset: int | None = 0
) -> dict[str, Any]:
    """
    Retrieve a list of videos from your HeyGen account.
    
    Args:
        limit: Maximum number of videos to return (default: 20)
        offset: Number of videos to skip (default: 0)
        
    Returns:
        Dict containing list of videos
    """
    params = {
        "limit": limit,
        "offset": offset
    }
    return await make_request("GET", "/v1/video.list", params=params)

async def heygen_delete_video(video_id: str) -> dict[str, Any]:
    """
    Delete a video from your HeyGen account.
    
    Args:
        video_id: The ID of the video to delete
        
    Returns:
        Dict containing deletion confirmation
    """
    return await make_request("DELETE", "/v1/video.delete", params={"video_id": video_id})
