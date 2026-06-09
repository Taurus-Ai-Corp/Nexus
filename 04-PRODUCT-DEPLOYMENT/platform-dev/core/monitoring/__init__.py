"""
Monitoring Module.

Reliability & observability suite for the micro-loan platform.
Includes state machine monitoring, audit trails, Prometheus metrics,
explainability features, and system health monitoring.
"""

from core.monitoring.state_monitor import (
    StateMachineMonitor, StateTransition, AnomalyAlert,
    AgentState, VALID_TRANSITIONS,
)
from core.monitoring.audit_trail import AuditTrail, AuditEntry, AuditEventType
from core.monitoring.metrics import (
    MetricsRegistry, Counter, Gauge, Histogram,
    MetricSample, default_registry, setup_default_metrics,
)
from core.monitoring.explainability import (
    ExplainabilityEngine, ExplainabilityReport, FeatureImportance,
    CounterfactualExplanation, ConfidenceInterval,
)
from core.monitoring.health_monitor import (
    HealthMonitor, HealthCheck, SystemAlert, ResourceMetrics,
    HealthStatus, AlertSeverity,
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
