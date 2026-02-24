"""
NeoVibe API Client
Production-ready REST client for creative studio platform
Features: Figma integration, auto-sync, version control, change detection
"""

import requests
import time
import logging
from typing import Dict, List, Optional, Any, Set
from datetime import datetime
import json
from enum import Enum
from dataclasses import dataclass, asdict
import hashlib


class DesignStatus(Enum):
    """Design file statuses"""
    DRAFT = "draft"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    PUBLISHED = "published"


class SyncStatus(Enum):
    """Sync operation statuses"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class DesignChange:
    """Design change record"""
    change_id: str
    file_id: str
    file_name: str
    change_type: str  # created, updated, deleted
    timestamp: datetime
    author: str
    version: str
    description: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        data = asdict(self)
        data['timestamp'] = self.timestamp.isoformat()
        return data


class NeoVibeError(Exception):
    """Base exception for NeoVibe client errors"""
    pass


class FigmaError(NeoVibeError):
    """Raised when Figma integration fails"""
    pass


class SyncError(NeoVibeError):
    """Raised when sync operation fails"""
    pass


class NeoVibeClient:
    """
    Production-ready REST API client for NeoVibe creative platform

    Features:
    - Figma API integration
    - Automated design synchronization
    - Version control for designs
    - Change detection and tracking
    - Asset management
    """

    def __init__(
        self,
        base_url: str,
        api_key: str,
        figma_token: Optional[str] = None,
        timeout: int = 60,
        log_file: Optional[str] = None
    ):
        """
        Initialize NeoVibe API client

        Args:
            base_url: Base URL for NeoVibe API
            api_key: API key for authentication
            figma_token: Figma personal access token
            timeout: Request timeout in seconds
            log_file: Path to log file
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.figma_token = figma_token
        self.timeout = timeout

        # Setup logging
        self.logger = self._setup_logging(log_file)

        # Session management
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
            'User-Agent': 'NeoVibe-Client/1.0'
        })

        # Figma session
        self.figma_session = requests.Session()
        if self.figma_token:
            self.figma_session.headers.update({
                'X-Figma-Token': self.figma_token
            })

        # Change tracking
        self.change_history: List[DesignChange] = []
        self.tracked_files: Dict[str, Dict[str, Any]] = {}

        self.logger.info("NeoVibe client initialized successfully")

    def _setup_logging(self, log_file: Optional[str] = None) -> logging.Logger:
        """Setup structured logging"""
        logger = logging.getLogger('NeoVibeClient')
        logger.setLevel(logging.INFO)

        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)

        if log_file:
            file_handler = logging.FileHandler(log_file)
            file_handler.setLevel(logging.DEBUG)
            logger.addHandler(file_handler)

        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        return logger

    def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make HTTP request to NeoVibe API"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data,
                params=params,
                timeout=self.timeout
            )

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            self.logger.error(f"Request failed: {str(e)}")
            raise NeoVibeError(f"Request failed: {str(e)}")

    def _figma_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make HTTP request to Figma API"""
        if not self.figma_token:
            raise FigmaError("Figma token not configured")

        url = f"https://api.figma.com/v1/{endpoint.lstrip('/')}"

        try:
            response = self.figma_session.request(
                method=method,
                url=url,
                json=data,
                params=params,
                timeout=self.timeout
            )

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            self.logger.error(f"Figma request failed: {str(e)}")
            raise FigmaError(f"Figma request failed: {str(e)}")

    def _calculate_file_hash(self, content: str) -> str:
        """Calculate hash of file content"""
        return hashlib.sha256(content.encode()).hexdigest()

    # ========== Figma Integration ==========

    def get_figma_file(self, file_key: str) -> Dict[str, Any]:
        """
        Get Figma file data

        Args:
            file_key: Figma file key

        Returns:
            Figma file data
        """
        self.logger.info(f"Fetching Figma file: {file_key}")
        return self._figma_request('GET', f'/files/{file_key}')

    def get_figma_file_versions(self, file_key: str) -> List[Dict[str, Any]]:
        """
        Get version history for Figma file

        Args:
            file_key: Figma file key

        Returns:
            List of file versions
        """
        self.logger.info(f"Fetching version history for {file_key}")
        result = self._figma_request('GET', f'/files/{file_key}/versions')
        return result.get('versions', [])

    def export_figma_assets(
        self,
        file_key: str,
        node_ids: List[str],
        format: str = 'png',
        scale: float = 2.0
    ) -> Dict[str, str]:
        """
        Export assets from Figma file

        Args:
            file_key: Figma file key
            node_ids: List of node IDs to export
            format: Export format (png, jpg, svg, pdf)
            scale: Export scale (1.0, 2.0, 3.0, etc.)

        Returns:
            Dictionary mapping node IDs to download URLs
        """
        self.logger.info(f"Exporting {len(node_ids)} assets from {file_key}")

        params = {
            'ids': ','.join(node_ids),
            'format': format,
            'scale': scale
        }

        result = self._figma_request('GET', f'/images/{file_key}', params=params)
        return result.get('images', {})

    # ========== Design Sync ==========

    def sync_figma_file(
        self,
        file_key: str,
        project_id: str,
        auto_update: bool = True
    ) -> Dict[str, Any]:
        """
        Sync Figma file to NeoVibe project

        Args:
            file_key: Figma file key
            project_id: NeoVibe project ID
            auto_update: Enable automatic updates

        Returns:
            Sync result
        """
        self.logger.info(f"Syncing Figma file {file_key} to project {project_id}")

        try:
            # Get Figma file data
            figma_data = self.get_figma_file(file_key)

            # Prepare sync data
            sync_data = {
                'figma_file_key': file_key,
                'project_id': project_id,
                'file_name': figma_data.get('name'),
                'file_data': figma_data,
                'auto_update': auto_update,
                'synced_at': datetime.utcnow().isoformat()
            }

            # Send to NeoVibe
            result = self._request('POST', '/api/v1/designs/sync', data=sync_data)

            # Track file
            self.tracked_files[file_key] = {
                'project_id': project_id,
                'last_sync': datetime.utcnow(),
                'version': figma_data.get('version'),
                'hash': self._calculate_file_hash(json.dumps(figma_data))
            }

            self.logger.info(f"Sync completed: {result.get('status')}")
            return result

        except Exception as e:
            self.logger.error(f"Sync failed: {str(e)}")
            raise SyncError(f"Sync failed: {str(e)}")

    def detect_changes(self, file_key: str) -> List[DesignChange]:
        """
        Detect changes in Figma file since last sync

        Args:
            file_key: Figma file key

        Returns:
            List of detected changes
        """
        self.logger.info(f"Detecting changes for {file_key}")

        if file_key not in self.tracked_files:
            self.logger.warning(f"File {file_key} not tracked")
            return []

        try:
            # Get current file data
            current_data = self.get_figma_file(file_key)
            current_hash = self._calculate_file_hash(json.dumps(current_data))

            # Get tracked data
            tracked = self.tracked_files[file_key]
            previous_hash = tracked.get('hash')

            changes = []

            # Check if file changed
            if current_hash != previous_hash:
                # Get version history
                versions = self.get_figma_file_versions(file_key)

                # Find changes since last sync
                last_sync = tracked.get('last_sync')

                for version in versions:
                    version_date = datetime.fromisoformat(
                        version.get('created_at').replace('Z', '+00:00')
                    )

                    if version_date > last_sync:
                        change = DesignChange(
                            change_id=f"change_{int(time.time() * 1000)}",
                            file_id=file_key,
                            file_name=current_data.get('name'),
                            change_type='updated',
                            timestamp=version_date,
                            author=version.get('user', {}).get('handle', 'unknown'),
                            version=version.get('id'),
                            description=version.get('description')
                        )

                        changes.append(change)
                        self.change_history.append(change)

            self.logger.info(f"Detected {len(changes)} changes")
            return changes

        except Exception as e:
            self.logger.error(f"Change detection failed: {str(e)}")
            raise SyncError(f"Change detection failed: {str(e)}")

    def auto_sync_changed_files(self) -> Dict[str, Any]:
        """
        Automatically sync all tracked files that have changes

        Returns:
            Sync summary
        """
        self.logger.info("Starting auto-sync for all tracked files")

        synced = []
        failed = []

        for file_key, tracking_data in self.tracked_files.items():
            try:
                # Detect changes
                changes = self.detect_changes(file_key)

                if changes:
                    # Sync file
                    result = self.sync_figma_file(
                        file_key=file_key,
                        project_id=tracking_data['project_id'],
                        auto_update=True
                    )

                    synced.append({
                        'file_key': file_key,
                        'changes': len(changes),
                        'status': result.get('status')
                    })

            except Exception as e:
                self.logger.error(f"Auto-sync failed for {file_key}: {str(e)}")
                failed.append({
                    'file_key': file_key,
                    'error': str(e)
                })

        summary = {
            'total_tracked': len(self.tracked_files),
            'synced': len(synced),
            'failed': len(failed),
            'synced_files': synced,
            'failed_files': failed,
            'timestamp': datetime.utcnow().isoformat()
        }

        self.logger.info(f"Auto-sync completed: {len(synced)} synced, {len(failed)} failed")
        return summary

    # ========== Design Management ==========

    def create_design(
        self,
        project_id: str,
        name: str,
        description: str,
        figma_file_key: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create new design in NeoVibe

        Args:
            project_id: Project ID
            name: Design name
            description: Design description
            figma_file_key: Linked Figma file (optional)
            metadata: Additional metadata

        Returns:
            Created design data
        """
        data = {
            'project_id': project_id,
            'name': name,
            'description': description,
            'figma_file_key': figma_file_key,
            'status': DesignStatus.DRAFT.value,
            'metadata': metadata or {},
            'created_at': datetime.utcnow().isoformat()
        }

        self.logger.info(f"Creating design: {name}")
        return self._request('POST', '/api/v1/designs', data=data)

    def get_design(self, design_id: str) -> Dict[str, Any]:
        """Get design by ID"""
        self.logger.info(f"Fetching design {design_id}")
        return self._request('GET', f'/api/v1/designs/{design_id}')

    def update_design(
        self,
        design_id: str,
        updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Update design

        Args:
            design_id: Design ID
            updates: Fields to update

        Returns:
            Updated design data
        """
        self.logger.info(f"Updating design {design_id}")
        return self._request('PUT', f'/api/v1/designs/{design_id}', data=updates)

    def list_designs(
        self,
        project_id: Optional[str] = None,
        status: Optional[DesignStatus] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """List designs with filters"""
        params = {'limit': limit}

        if project_id:
            params['project_id'] = project_id
        if status:
            params['status'] = status.value

        self.logger.info("Fetching design list")
        return self._request('GET', '/api/v1/designs', params=params)

    # ========== Version Control ==========

    def create_version(
        self,
        design_id: str,
        version_name: str,
        description: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create new version of design

        Args:
            design_id: Design ID
            version_name: Version name
            description: Version description

        Returns:
            Created version data
        """
        data = {
            'design_id': design_id,
            'version_name': version_name,
            'description': description,
            'created_at': datetime.utcnow().isoformat()
        }

        self.logger.info(f"Creating version {version_name} for design {design_id}")
        return self._request('POST', '/api/v1/designs/versions', data=data)

    def get_version_history(self, design_id: str) -> List[Dict[str, Any]]:
        """Get version history for design"""
        self.logger.info(f"Fetching version history for {design_id}")
        return self._request('GET', f'/api/v1/designs/{design_id}/versions')

    def rollback_version(
        self,
        design_id: str,
        version_id: str
    ) -> Dict[str, Any]:
        """
        Rollback design to specific version

        Args:
            design_id: Design ID
            version_id: Version ID to rollback to

        Returns:
            Rollback result
        """
        data = {
            'design_id': design_id,
            'version_id': version_id,
            'rollback_at': datetime.utcnow().isoformat()
        }

        self.logger.info(f"Rolling back design {design_id} to version {version_id}")
        return self._request('POST', '/api/v1/designs/rollback', data=data)

    # ========== Analytics & Reporting ==========

    def get_change_history(
        self,
        file_key: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[DesignChange]:
        """
        Get change history with filters

        Args:
            file_key: Filter by file key
            start_date: Start date filter
            end_date: End date filter

        Returns:
            Filtered change history
        """
        history = self.change_history.copy()

        if file_key:
            history = [c for c in history if c.file_id == file_key]

        if start_date:
            history = [c for c in history if c.timestamp >= start_date]

        if end_date:
            history = [c for c in history if c.timestamp <= end_date]

        return history

    def export_change_history(self, filepath: str):
        """Export change history to JSON file"""
        try:
            history_data = [change.to_dict() for change in self.change_history]

            with open(filepath, 'w') as f:
                json.dump(history_data, f, indent=2)

            self.logger.info(f"Change history exported to {filepath}")
        except Exception as e:
            self.logger.error(f"Failed to export change history: {str(e)}")
            raise NeoVibeError(f"Export failed: {str(e)}")

    # ========== Health & Status ==========

    def health_check(self) -> bool:
        """Check API health status"""
        try:
            response = self._request('GET', '/api/v1/health')
            return response.get('status') == 'healthy'
        except Exception as e:
            self.logger.error(f"Health check failed: {str(e)}")
            return False

    def close(self):
        """Close sessions and cleanup resources"""
        self.session.close()
        self.figma_session.close()
        self.logger.info("NeoVibe client closed")


# ========== Usage Example ==========

if __name__ == "__main__":
    # Initialize client
    client = NeoVibeClient(
        base_url="https://api.neovibe.io",
        api_key="your-api-key",
        figma_token="your-figma-token",
        log_file="/tmp/neovibe.log"
    )

    try:
        # Sync Figma file
        sync_result = client.sync_figma_file(
            file_key="abc123",
            project_id="project_456",
            auto_update=True
        )
        print(f"Sync completed: {sync_result}")

        # Detect changes
        changes = client.detect_changes("abc123")
        print(f"Detected {len(changes)} changes")

        # Auto-sync all tracked files
        summary = client.auto_sync_changed_files()
        print(f"Auto-sync summary: {summary}")

        # Export change history
        client.export_change_history("/tmp/neovibe_changes.json")

    finally:
        client.close()
