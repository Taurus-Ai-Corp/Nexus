"""
BizFlow API Client
Production-ready REST client for AI orchestration platform
Features: Execution logging, workflow tracking, audit trails, state management
"""

import requests
import time
import logging
from typing import Dict, List, Optional, Any, Callable
from datetime import datetime
from functools import wraps
import json
from enum import Enum
from dataclasses import dataclass, asdict


class WorkflowStatus(Enum):
    """Workflow execution statuses"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAUSED = "paused"


class ExecutionPriority(Enum):
    """Execution priority levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class WorkflowExecution:
    """Workflow execution record"""
    execution_id: str
    workflow_id: str
    status: WorkflowStatus
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_seconds: Optional[float] = None
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary with datetime serialization"""
        data = asdict(self)
        data['status'] = self.status.value
        data['start_time'] = self.start_time.isoformat()
        if self.end_time:
            data['end_time'] = self.end_time.isoformat()
        return data


class BizFlowError(Exception):
    """Base exception for BizFlow client errors"""
    pass


class WorkflowError(BizFlowError):
    """Raised when workflow execution fails"""
    pass


class StateError(BizFlowError):
    """Raised when workflow state is invalid"""
    pass


def log_execution(func: Callable) -> Callable:
    """Decorator to log workflow execution"""
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        execution_id = f"exec_{int(time.time() * 1000)}"
        start_time = datetime.utcnow()

        try:
            result = func(self, *args, **kwargs)

            # Log successful execution
            self._log_execution(
                execution_id=execution_id,
                function_name=func.__name__,
                args=args,
                kwargs=kwargs,
                result=result,
                start_time=start_time,
                status='success'
            )

            return result

        except Exception as e:
            # Log failed execution
            self._log_execution(
                execution_id=execution_id,
                function_name=func.__name__,
                args=args,
                kwargs=kwargs,
                error=str(e),
                start_time=start_time,
                status='failed'
            )
            raise

    return wrapper


class BizFlowClient:
    """
    Production-ready REST API client for BizFlow AI orchestration platform

    Features:
    - Workflow execution management
    - Real-time execution logging
    - Audit trail generation
    - State tracking and recovery
    - Error handling with context
    - Performance monitoring
    """

    def __init__(
        self,
        base_url: str,
        api_key: str,
        timeout: int = 60,
        log_file: Optional[str] = None,
        audit_file: Optional[str] = None
    ):
        """
        Initialize BizFlow API client

        Args:
            base_url: Base URL for BizFlow API
            api_key: API key for authentication
            timeout: Request timeout in seconds
            log_file: Path to execution log file
            audit_file: Path to audit trail file
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.timeout = timeout
        self.audit_file = audit_file

        # Setup logging
        self.logger = self._setup_logging(log_file)

        # Session management
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
            'User-Agent': 'BizFlow-Client/1.0'
        })

        # Execution tracking
        self.execution_log: List[Dict[str, Any]] = []
        self.workflow_states: Dict[str, WorkflowExecution] = {}

        self.logger.info("BizFlow client initialized successfully")

    def _setup_logging(self, log_file: Optional[str] = None) -> logging.Logger:
        """Setup structured logging"""
        logger = logging.getLogger('BizFlowClient')
        logger.setLevel(logging.INFO)

        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)

        # File handler
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

    def _log_execution(
        self,
        execution_id: str,
        function_name: str,
        args: tuple,
        kwargs: dict,
        result: Any = None,
        error: Optional[str] = None,
        start_time: datetime = None,
        status: str = 'success'
    ):
        """Log execution to audit trail"""
        end_time = datetime.utcnow()
        duration = (end_time - start_time).total_seconds() if start_time else 0

        log_entry = {
            'execution_id': execution_id,
            'timestamp': end_time.isoformat(),
            'function': function_name,
            'args': str(args),
            'kwargs': str(kwargs),
            'status': status,
            'duration_seconds': duration,
            'result': str(result) if result else None,
            'error': error
        }

        self.execution_log.append(log_entry)

        # Write to audit file
        if self.audit_file:
            try:
                with open(self.audit_file, 'a') as f:
                    f.write(json.dumps(log_entry) + '\n')
            except Exception as e:
                self.logger.error(f"Failed to write audit log: {str(e)}")

        if error:
            self.logger.error(f"Execution failed: {function_name} - {error}")
        else:
            self.logger.info(f"Execution logged: {function_name} ({duration:.2f}s)")

    def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make HTTP request with error handling"""
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

        except requests.exceptions.Timeout:
            self.logger.error(f"Request timeout for {url}")
            raise BizFlowError(f"Request timeout after {self.timeout}s")

        except requests.exceptions.RequestException as e:
            self.logger.error(f"Request failed: {str(e)}")
            raise BizFlowError(f"Request failed: {str(e)}")

    # ========== Workflow Management ==========

    @log_execution
    def create_workflow(
        self,
        name: str,
        description: str,
        steps: List[Dict[str, Any]],
        priority: ExecutionPriority = ExecutionPriority.MEDIUM,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create a new workflow

        Args:
            name: Workflow name
            description: Workflow description
            steps: List of workflow steps
            priority: Execution priority
            metadata: Additional metadata

        Returns:
            Created workflow data
        """
        data = {
            'name': name,
            'description': description,
            'steps': steps,
            'priority': priority.value,
            'metadata': metadata or {},
            'created_at': datetime.utcnow().isoformat()
        }

        self.logger.info(f"Creating workflow: {name}")
        return self._request('POST', '/api/v1/workflows', data=data)

    @log_execution
    def get_workflow(self, workflow_id: str) -> Dict[str, Any]:
        """Get workflow details"""
        self.logger.info(f"Fetching workflow {workflow_id}")
        return self._request('GET', f'/api/v1/workflows/{workflow_id}')

    @log_execution
    def list_workflows(
        self,
        status: Optional[WorkflowStatus] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """List workflows with optional status filter"""
        params = {'limit': limit}
        if status:
            params['status'] = status.value

        self.logger.info(f"Listing workflows (limit: {limit})")
        return self._request('GET', '/api/v1/workflows', params=params)

    # ========== Workflow Execution ==========

    @log_execution
    def execute_workflow(
        self,
        workflow_id: str,
        input_data: Optional[Dict[str, Any]] = None,
        async_execution: bool = False
    ) -> Dict[str, Any]:
        """
        Execute workflow

        Args:
            workflow_id: Workflow ID to execute
            input_data: Input data for workflow
            async_execution: Run asynchronously

        Returns:
            Execution result or execution ID
        """
        data = {
            'workflow_id': workflow_id,
            'input_data': input_data or {},
            'async': async_execution,
            'timestamp': datetime.utcnow().isoformat()
        }

        self.logger.info(f"Executing workflow {workflow_id} (async={async_execution})")

        result = self._request('POST', '/api/v1/executions', data=data)

        # Track execution state
        execution_id = result.get('execution_id')
        if execution_id:
            self.workflow_states[execution_id] = WorkflowExecution(
                execution_id=execution_id,
                workflow_id=workflow_id,
                status=WorkflowStatus.PENDING,
                start_time=datetime.utcnow()
            )

        return result

    @log_execution
    def get_execution_status(self, execution_id: str) -> Dict[str, Any]:
        """
        Get execution status

        Args:
            execution_id: Execution ID

        Returns:
            Execution status and details
        """
        self.logger.info(f"Fetching execution status {execution_id}")
        status = self._request('GET', f'/api/v1/executions/{execution_id}')

        # Update local state tracking
        if execution_id in self.workflow_states:
            execution = self.workflow_states[execution_id]
            execution.status = WorkflowStatus(status.get('status', 'pending'))

            if status.get('end_time'):
                execution.end_time = datetime.fromisoformat(status['end_time'])
                execution.duration_seconds = status.get('duration_seconds')

            if status.get('error'):
                execution.error_message = status.get('error')

        return status

    @log_execution
    def cancel_execution(self, execution_id: str) -> Dict[str, Any]:
        """Cancel running execution"""
        self.logger.info(f"Cancelling execution {execution_id}")
        result = self._request('POST', f'/api/v1/executions/{execution_id}/cancel')

        # Update state
        if execution_id in self.workflow_states:
            self.workflow_states[execution_id].status = WorkflowStatus.CANCELLED

        return result

    @log_execution
    def pause_execution(self, execution_id: str) -> Dict[str, Any]:
        """Pause running execution"""
        self.logger.info(f"Pausing execution {execution_id}")
        result = self._request('POST', f'/api/v1/executions/{execution_id}/pause')

        if execution_id in self.workflow_states:
            self.workflow_states[execution_id].status = WorkflowStatus.PAUSED

        return result

    @log_execution
    def resume_execution(self, execution_id: str) -> Dict[str, Any]:
        """Resume paused execution"""
        self.logger.info(f"Resuming execution {execution_id}")
        result = self._request('POST', f'/api/v1/executions/{execution_id}/resume')

        if execution_id in self.workflow_states:
            self.workflow_states[execution_id].status = WorkflowStatus.RUNNING

        return result

    # ========== State Management ==========

    def get_workflow_state(self, execution_id: str) -> Optional[WorkflowExecution]:
        """Get local workflow state"""
        return self.workflow_states.get(execution_id)

    def get_all_workflow_states(self) -> Dict[str, WorkflowExecution]:
        """Get all tracked workflow states"""
        return self.workflow_states.copy()

    def export_workflow_states(self, filepath: str):
        """Export workflow states to JSON file"""
        try:
            states = {
                exec_id: execution.to_dict()
                for exec_id, execution in self.workflow_states.items()
            }

            with open(filepath, 'w') as f:
                json.dump(states, f, indent=2)

            self.logger.info(f"Workflow states exported to {filepath}")
        except Exception as e:
            self.logger.error(f"Failed to export workflow states: {str(e)}")
            raise BizFlowError(f"Export failed: {str(e)}")

    # ========== Analytics & Monitoring ==========

    @log_execution
    def get_execution_metrics(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get execution metrics and analytics"""
        params = {}
        if start_date:
            params['start_date'] = start_date.isoformat()
        if end_date:
            params['end_date'] = end_date.isoformat()

        self.logger.info("Fetching execution metrics")
        return self._request('GET', '/api/v1/analytics/metrics', params=params)

    def get_execution_log(
        self,
        status_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get execution log with optional status filter

        Args:
            status_filter: Filter by status (success, failed)

        Returns:
            Filtered execution log
        """
        if status_filter:
            return [
                log for log in self.execution_log
                if log.get('status') == status_filter
            ]
        return self.execution_log.copy()

    def export_execution_log(self, filepath: str):
        """Export execution log to JSON file"""
        try:
            with open(filepath, 'w') as f:
                json.dump(self.execution_log, f, indent=2)
            self.logger.info(f"Execution log exported to {filepath}")
        except Exception as e:
            self.logger.error(f"Failed to export execution log: {str(e)}")
            raise BizFlowError(f"Export failed: {str(e)}")

    def get_audit_trail(
        self,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get audit trail with time filters

        Args:
            start_time: Start time filter
            end_time: End time filter

        Returns:
            Filtered audit trail
        """
        trail = self.execution_log.copy()

        if start_time:
            trail = [
                log for log in trail
                if datetime.fromisoformat(log['timestamp']) >= start_time
            ]

        if end_time:
            trail = [
                log for log in trail
                if datetime.fromisoformat(log['timestamp']) <= end_time
            ]

        return trail

    # ========== Error Recovery ==========

    @log_execution
    def retry_failed_execution(
        self,
        execution_id: str,
        max_retries: int = 3
    ) -> Dict[str, Any]:
        """
        Retry failed execution

        Args:
            execution_id: Failed execution ID
            max_retries: Maximum retry attempts

        Returns:
            New execution result
        """
        self.logger.info(f"Retrying failed execution {execution_id}")

        # Get original execution details
        original = self.get_execution_status(execution_id)
        workflow_id = original.get('workflow_id')
        input_data = original.get('input_data')

        # Retry execution
        return self.execute_workflow(
            workflow_id=workflow_id,
            input_data=input_data,
            async_execution=True
        )

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
        """Close session and cleanup resources"""
        self.session.close()
        self.logger.info("BizFlow client closed")


# ========== Usage Example ==========

if __name__ == "__main__":
    # Initialize client
    client = BizFlowClient(
        base_url="https://api.bizflow.io",
        api_key="your-api-key",
        log_file="/tmp/bizflow_execution.log",
        audit_file="/tmp/bizflow_audit.log"
    )

    try:
        # Create workflow
        workflow = client.create_workflow(
            name="Data Processing Pipeline",
            description="Process customer data and generate reports",
            steps=[
                {"name": "extract", "type": "data_extraction"},
                {"name": "transform", "type": "data_transformation"},
                {"name": "load", "type": "data_loading"}
            ],
            priority=ExecutionPriority.HIGH
        )
        print(f"Created workflow: {workflow['id']}")

        # Execute workflow
        execution = client.execute_workflow(
            workflow_id=workflow['id'],
            input_data={"source": "database", "format": "json"},
            async_execution=True
        )
        print(f"Execution started: {execution['execution_id']}")

        # Monitor execution
        status = client.get_execution_status(execution['execution_id'])
        print(f"Status: {status['status']}")

        # Export audit trail
        client.export_execution_log("/tmp/bizflow_execution_log.json")

    finally:
        client.close()
