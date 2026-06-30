"""
Monitoring Module.

Reliability & observability suite for the micro-loan platform.
Includes state machine monitoring, audit trails, Prometheus metrics,
explainability features, and system health monitoring.
"""

from core.monitoring.audit_trail import AuditEntry, AuditEventType, AuditTrail
from core.monitoring.explainability import (
    ConfidenceInterval,
    CounterfactualExplanation,
    ExplainabilityEngine,
    ExplainabilityReport,
    FeatureImportance,
)
from core.monitoring.health_monitor import (
    AlertSeverity,
    HealthCheck,
    HealthMonitor,
    HealthStatus,
    ResourceMetrics,
    SystemAlert,
)
from core.monitoring.metrics import (
    Counter,
    Gauge,
    Histogram,
    MetricSample,
    MetricsRegistry,
    default_registry,
    setup_default_metrics,
)
from core.monitoring.state_monitor import (
    VALID_TRANSITIONS,
    AgentState,
    AnomalyAlert,
    StateMachineMonitor,
    StateTransition,
)

__all__ = [
    "StateMachineMonitor", "StateTransition", "AnomalyAlert",
    "AgentState", "VALID_TRANSITIONS",
    "AuditTrail", "AuditEntry", "AuditEventType",
    "MetricsRegistry", "Counter", "Gauge", "Histogram",
    "MetricSample", "default_registry", "setup_default_metrics",
    "ExplainabilityEngine", "ExplainabilityReport", "FeatureImportance",
    "CounterfactualExplanation", "ConfidenceInterval",
    "HealthMonitor", "HealthCheck", "SystemAlert", "ResourceMetrics",
    "HealthStatus", "AlertSeverity",
]
