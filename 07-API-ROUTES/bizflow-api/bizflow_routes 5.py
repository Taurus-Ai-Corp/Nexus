"""
BizFlow Platform Routes
AI orchestration and workflow management with execution tracking
"""

import logging
import sys
from datetime import datetime
from enum import Enum
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, Field, validator

sys.path.append('..')
from api_server import TokenData, verify_token

logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================================================
# MODELS
# ============================================================================

class WorkflowStatus(str, Enum):
    """Workflow status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAUSED = "paused"


class ExecutionPriority(str, Enum):
    """Execution priority"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TriggerType(str, Enum):
    """Workflow trigger type"""
    MANUAL = "manual"
    SCHEDULED = "scheduled"
    WEBHOOK = "webhook"
    EVENT = "event"


class Workflow(BaseModel):
    """Workflow model"""
    workflow_id: str
    user_id: str
    name: str
    description: str | None = None
    trigger_type: TriggerType
    schedule: str | None = None  # Cron expression
    enabled: bool = True
    steps: list[dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_executed_at: datetime | None = None


class CreateWorkflowRequest(BaseModel):
    """Create workflow request"""
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=1000)
    trigger_type: TriggerType
    schedule: str | None = None
    steps: list[dict[str, Any]] = Field(default_factory=list)

    @validator('schedule')
    def validate_schedule(cls, v, values):
        """Validate schedule is provided for scheduled workflows"""
        if values.get('trigger_type') == TriggerType.SCHEDULED and not v:
            raise ValueError("Schedule is required for scheduled workflows")
        return v


class WorkflowExecution(BaseModel):
    """Workflow execution model"""
    execution_id: str
    workflow_id: str
    status: WorkflowStatus
    priority: ExecutionPriority = ExecutionPriority.MEDIUM
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: datetime | None = None
    duration_seconds: float | None = None
    steps_completed: int = 0
    steps_total: int = 0
    error_message: str | None = None
    logs: list[str] = []
    metadata: dict[str, Any] = {}


class ExecuteWorkflowRequest(BaseModel):
    """Execute workflow request"""
    workflow_id: str
    priority: ExecutionPriority = ExecutionPriority.MEDIUM
    parameters: dict[str, Any] = {}


class WorkflowAnalytics(BaseModel):
    """Workflow analytics model"""
    workflow_id: str
    total_executions: int
    successful_executions: int
    failed_executions: int
    success_rate: float
    average_duration_seconds: float
    last_execution: WorkflowExecution | None = None
    executions_by_status: dict[str, int]
    executions_last_24h: int
    executions_last_7d: int
    executions_last_30d: int
    generated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# WORKFLOW ENDPOINTS
# ============================================================================

@router.get("/workflows", response_model=list[Workflow])
async def get_workflows(
    token_data: TokenData = Depends(verify_token),
    enabled: bool | None = None,
    trigger_type: TriggerType | None = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    Get all workflows for the authenticated user

    - **enabled**: Filter by enabled status (optional)
    - **trigger_type**: Filter by trigger type (optional)
    - **limit**: Maximum number of workflows to return
    - **offset**: Number of workflows to skip
    """
    logger.info(f"Getting workflows for user {token_data.user_id}")

    # Mock data - replace with actual database query
    workflows = [
        Workflow(
            workflow_id="wf_001",
            user_id=token_data.user_id,
            name="Daily Portfolio Sync",
            description="Synchronize portfolio data across platforms",
            trigger_type=TriggerType.SCHEDULED,
            schedule="0 0 * * *",  # Daily at midnight
            enabled=True,
            steps=[
                {"step": 1, "action": "fetch_portfolio", "platform": "assetgrid"},
                {"step": 2, "action": "sync_to_database", "database": "main"},
                {"step": 3, "action": "send_notification", "channels": ["email"]}
            ],
            created_at=datetime(2024, 1, 1, 10, 0, 0),
            updated_at=datetime.utcnow(),
            last_executed_at=datetime.utcnow()
        )
    ]

    # Apply filters
    if enabled is not None:
        workflows = [w for w in workflows if w.enabled == enabled]
    if trigger_type:
        workflows = [w for w in workflows if w.trigger_type == trigger_type]

    return workflows[offset:offset + limit]


@router.post("/workflows", response_model=Workflow, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    request: CreateWorkflowRequest,
    token_data: TokenData = Depends(verify_token)
):
    """
    Create a new workflow

    - **name**: Workflow name
    - **description**: Workflow description (optional)
    - **trigger_type**: How the workflow is triggered
    - **schedule**: Cron expression (required for scheduled workflows)
    - **steps**: List of workflow steps
    """
    logger.info(f"Creating workflow '{request.name}' for user {token_data.user_id}")

    # Mock data - replace with actual database insert
    workflow = Workflow(
        workflow_id=f"wf_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        user_id=token_data.user_id,
        name=request.name,
        description=request.description,
        trigger_type=request.trigger_type,
        schedule=request.schedule,
        steps=request.steps
    )

    return workflow


@router.get("/workflows/{workflow_id}", response_model=Workflow)
async def get_workflow(
    workflow_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Get workflow by ID"""
    logger.info(f"Getting workflow {workflow_id}")

    # Mock data - replace with actual database query
    workflow = Workflow(
        workflow_id=workflow_id,
        user_id=token_data.user_id,
        name="Daily Portfolio Sync",
        description="Synchronize portfolio data across platforms",
        trigger_type=TriggerType.SCHEDULED,
        schedule="0 0 * * *",
        enabled=True,
        steps=[
            {"step": 1, "action": "fetch_portfolio", "platform": "assetgrid"},
            {"step": 2, "action": "sync_to_database", "database": "main"}
        ]
    )

    return workflow


@router.put("/workflows/{workflow_id}", response_model=Workflow)
async def update_workflow(
    workflow_id: str,
    request: CreateWorkflowRequest,
    token_data: TokenData = Depends(verify_token)
):
    """Update workflow"""
    logger.info(f"Updating workflow {workflow_id}")

    # Mock data - replace with actual database update
    workflow = Workflow(
        workflow_id=workflow_id,
        user_id=token_data.user_id,
        name=request.name,
        description=request.description,
        trigger_type=request.trigger_type,
        schedule=request.schedule,
        steps=request.steps,
        updated_at=datetime.utcnow()
    )

    return workflow


@router.delete("/workflows/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(
    workflow_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Delete workflow"""
    logger.info(f"Deleting workflow {workflow_id}")

    # Mock data - replace with actual database delete
    return None


@router.patch("/workflows/{workflow_id}/enable")
async def enable_workflow(
    workflow_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Enable workflow"""
    logger.info(f"Enabling workflow {workflow_id}")

    return {"workflow_id": workflow_id, "enabled": True}


@router.patch("/workflows/{workflow_id}/disable")
async def disable_workflow(
    workflow_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Disable workflow"""
    logger.info(f"Disabling workflow {workflow_id}")

    return {"workflow_id": workflow_id, "enabled": False}


# ============================================================================
# EXECUTION ENDPOINTS
# ============================================================================

@router.post("/executions", response_model=WorkflowExecution, status_code=status.HTTP_201_CREATED)
async def execute_workflow(
    request: ExecuteWorkflowRequest,
    token_data: TokenData = Depends(verify_token)
):
    """
    Execute a workflow

    - **workflow_id**: Workflow ID to execute
    - **priority**: Execution priority (LOW, MEDIUM, HIGH, CRITICAL)
    - **parameters**: Workflow parameters (optional)
    """
    logger.info(f"Executing workflow {request.workflow_id} with priority {request.priority}")

    # Mock data - replace with actual workflow execution
    execution = WorkflowExecution(
        execution_id=f"exec_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}",
        workflow_id=request.workflow_id,
        status=WorkflowStatus.RUNNING,
        priority=request.priority,
        steps_total=3,
        steps_completed=0,
        logs=["Workflow execution started"],
        metadata=request.parameters
    )

    return execution


@router.get("/executions", response_model=list[WorkflowExecution])
async def get_executions(
    workflow_id: str | None = None,
    status: WorkflowStatus | None = None,
    token_data: TokenData = Depends(verify_token),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    Get workflow executions

    - **workflow_id**: Filter by workflow ID (optional)
    - **status**: Filter by execution status (optional)
    - **limit**: Maximum number of executions to return
    - **offset**: Number of executions to skip
    """
    logger.info(f"Getting executions for user {token_data.user_id}")

    # Mock data - replace with actual database query
    executions = [
        WorkflowExecution(
            execution_id="exec_001",
            workflow_id="wf_001",
            status=WorkflowStatus.COMPLETED,
            priority=ExecutionPriority.MEDIUM,
            start_time=datetime(2024, 11, 29, 10, 0, 0),
            end_time=datetime(2024, 11, 29, 10, 5, 30),
            duration_seconds=330.0,
            steps_completed=3,
            steps_total=3,
            logs=[
                "Workflow execution started",
                "Step 1: Fetch portfolio completed",
                "Step 2: Sync to database completed",
                "Step 3: Send notification completed",
                "Workflow execution completed"
            ]
        )
    ]

    # Apply filters
    if workflow_id:
        executions = [e for e in executions if e.workflow_id == workflow_id]
    if status:
        executions = [e for e in executions if e.status == status]

    return executions[offset:offset + limit]


@router.get("/executions/{execution_id}", response_model=WorkflowExecution)
async def get_execution(
    execution_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Get execution by ID"""
    logger.info(f"Getting execution {execution_id}")

    # Mock data - replace with actual database query
    execution = WorkflowExecution(
        execution_id=execution_id,
        workflow_id="wf_001",
        status=WorkflowStatus.COMPLETED,
        priority=ExecutionPriority.MEDIUM,
        start_time=datetime(2024, 11, 29, 10, 0, 0),
        end_time=datetime(2024, 11, 29, 10, 5, 30),
        duration_seconds=330.0,
        steps_completed=3,
        steps_total=3,
        logs=[
            "Workflow execution started",
            "Step 1: Fetch portfolio completed",
            "Step 2: Sync to database completed",
            "Step 3: Send notification completed",
            "Workflow execution completed"
        ]
    )

    return execution


@router.post("/executions/{execution_id}/cancel", status_code=status.HTTP_200_OK)
async def cancel_execution(
    execution_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Cancel a running execution"""
    logger.info(f"Cancelling execution {execution_id}")

    return {
        "execution_id": execution_id,
        "status": WorkflowStatus.CANCELLED,
        "message": "Execution cancelled successfully"
    }


@router.post("/executions/{execution_id}/pause", status_code=status.HTTP_200_OK)
async def pause_execution(
    execution_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Pause a running execution"""
    logger.info(f"Pausing execution {execution_id}")

    return {
        "execution_id": execution_id,
        "status": WorkflowStatus.PAUSED,
        "message": "Execution paused successfully"
    }


@router.post("/executions/{execution_id}/resume", status_code=status.HTTP_200_OK)
async def resume_execution(
    execution_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Resume a paused execution"""
    logger.info(f"Resuming execution {execution_id}")

    return {
        "execution_id": execution_id,
        "status": WorkflowStatus.RUNNING,
        "message": "Execution resumed successfully"
    }


# ============================================================================
# ANALYTICS ENDPOINTS
# ============================================================================

@router.get("/workflows/{workflow_id}/analytics", response_model=WorkflowAnalytics)
async def get_workflow_analytics(
    workflow_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """
    Get workflow analytics

    Returns comprehensive analytics including:
    - Total executions and success rate
    - Average execution duration
    - Execution trends over time
    - Last execution details
    """
    logger.info(f"Getting analytics for workflow {workflow_id}")

    # Mock data - replace with actual analytics calculation
    analytics = WorkflowAnalytics(
        workflow_id=workflow_id,
        total_executions=150,
        successful_executions=145,
        failed_executions=5,
        success_rate=96.67,
        average_duration_seconds=325.5,
        executions_by_status={
            "completed": 145,
            "failed": 5,
            "running": 0,
            "cancelled": 0
        },
        executions_last_24h=5,
        executions_last_7d=35,
        executions_last_30d=150
    )

    return analytics


@router.get("/analytics/overview")
async def get_analytics_overview(
    token_data: TokenData = Depends(verify_token)
):
    """
    Get overall BizFlow analytics

    Returns system-wide analytics including:
    - Total workflows and executions
    - Overall success rate
    - Active workflows
    - Recent activity
    """
    logger.info(f"Getting analytics overview for user {token_data.user_id}")

    # Mock data - replace with actual analytics calculation
    return {
        "total_workflows": 25,
        "active_workflows": 18,
        "total_executions": 3750,
        "successful_executions": 3625,
        "failed_executions": 125,
        "overall_success_rate": 96.67,
        "executions_today": 45,
        "executions_this_week": 315,
        "average_execution_time_seconds": 285.3,
        "most_active_workflows": [
            {"workflow_id": "wf_001", "name": "Daily Portfolio Sync", "executions": 150},
            {"workflow_id": "wf_002", "name": "Hourly Price Updates", "executions": 720}
        ]
    }


# ============================================================================
# HEALTH CHECK
# ============================================================================

@router.get("/health")
async def health_check():
    """BizFlow service health check"""
    return {
        "service": "bizflow",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "active_executions": 12,
        "queued_executions": 3
    }


# ============================================================================
# LOGS
# ============================================================================

@router.get("/logs")
async def get_logs(
    workflow_id: str | None = None,
    execution_id: str | None = None,
    token_data: TokenData = Depends(verify_token),
    limit: int = Query(100, ge=1, le=1000),
    level: str | None = Query(None, regex="^(INFO|WARNING|ERROR)$")
):
    """
    Get BizFlow service logs

    - **workflow_id**: Filter by workflow ID (optional)
    - **execution_id**: Filter by execution ID (optional)
    - **limit**: Maximum number of log entries to return
    - **level**: Filter by log level (INFO, WARNING, ERROR)
    """
    logger.info(f"Getting logs for user {token_data.user_id}")

    # Mock data - replace with actual log retrieval
    logs = [
        {
            "timestamp": datetime.utcnow().isoformat(),
            "level": "INFO",
            "message": "Workflow execution completed successfully",
            "workflow_id": "wf_001",
            "execution_id": "exec_001"
        }
    ]

    # Apply filters
    if workflow_id:
        logs = [log for log in logs if log.get("workflow_id") == workflow_id]
    if execution_id:
        logs = [log for log in logs if log.get("execution_id") == execution_id]
    if level:
        logs = [log for log in logs if log["level"] == level]

    return logs[:limit]
