"""
State Machine Monitoring for AI Agent Decisions.

Tracks agent state transitions, logs decision paths, detects anomalies
in agent behavior, and provides visualizable state machine representations.
"""

import time
import hashlib
import json
from enum import Enum
from typing import Dict, Any, Optional, List, Tuple
from dataclasses import dataclass, field, asdict
from datetime import datetime
from collections import defaultdict


class AgentState(str, Enum):
    IDLE = "idle"
    DATA_INGESTION = "data_ingestion"
    CASH_FLOW_ANALYSIS = "cash_flow_analysis"
    RISK_ASSESSMENT = "risk_assessment"
    PRICING_DECISION = "pricing_decision"
    EARLY_WARNING_CHECK = "early_warning_check"
    COMPLIANCE_VALIDATION = "compliance_validation"
    REMINDER_GENERATION = "reminder_generation"
    DECISION_OUTPUT = "decision_output"
    ERROR = "error"


VALID_TRANSITIONS: Dict[str, List[str]] = {
    AgentState.IDLE: [AgentState.DATA_INGESTION, AgentState.ERROR],
    AgentState.DATA_INGESTION: [AgentState.CASH_FLOW_ANALYSIS, AgentState.ERROR],
    AgentState.CASH_FLOW_ANALYSIS: [AgentState.RISK_ASSESSMENT, AgentState.ERROR],
    AgentState.RISK_ASSESSMENT: [
        AgentState.PRICING_DECISION,
        AgentState.EARLY_WARNING_CHECK,
        AgentState.ERROR,
    ],
    AgentState.PRICING_DECISION: [
        AgentState.COMPLIANCE_VALIDATION,
        AgentState.EARLY_WARNING_CHECK,
        AgentState.ERROR,
    ],
    AgentState.EARLY_WARNING_CHECK: [
        AgentState.COMPLIANCE_VALIDATION,
        AgentState.REMINDER_GENERATION,
        AgentState.ERROR,
    ],
    AgentState.COMPLIANCE_VALIDATION: [
        AgentState.DECISION_OUTPUT,
        AgentState.REMINDER_GENERATION,
        AgentState.ERROR,
    ],
    AgentState.REMINDER_GENERATION: [AgentState.DECISION_OUTPUT, AgentState.ERROR],
    AgentState.DECISION_OUTPUT: [AgentState.IDLE, AgentState.ERROR],
    AgentState.ERROR: [AgentState.IDLE],
}


@dataclass
class StateTransition:
    from_state: str
    to_state: str
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    duration_ms: float = 0.0
    agent_id: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)
    transition_hash: str = ""

    def __post_init__(self):
        if not self.transition_hash:
            raw = f"{self.from_state}:{self.to_state}:{self.timestamp}:{self.agent_id}"
            self.transition_hash = hashlib.sha256(raw.encode()).hexdigest()[:16]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class AnomalyAlert:
    alert_id: str
    alert_type: str
    severity: str
    description: str
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    resolved: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class StateMachineMonitor:
    """Monitors AI agent state transitions and detects anomalies."""

    def __init__(self, agent_id: str = "default", loop_threshold: int = 5):
        self.agent_id = agent_id
        self.loop_threshold = loop_threshold
        self.transitions: List[StateTransition] = []
        self.alerts: List[AnomalyAlert] = []
        self.current_state: str = AgentState.IDLE
        self.transition_start_time: Optional[float] = None
        self.state_counts: Dict[str, int] = defaultdict(int)
        self.recent_states: List[str] = []

    def start_transition(self, from_state: str, to_state: str, metadata: Optional[Dict] = None):
        if to_state not in VALID_TRANSITIONS.get(from_state, []):
            self._raise_anomaly(
                "invalid_transition",
                "high",
                f"Invalid transition: {from_state} -> {to_state}",
                metadata={"from": from_state, "to": to_state},
            )
            return

        self.current_state = to_state
        self.transition_start_time = time.time()
        self.state_counts[to_state] += 1
        self.recent_states.append(to_state)
        self._check_loop_anomaly()

    def end_transition(self, metadata: Optional[Dict] = None):
        if self.transition_start_time is None:
            return

        duration_ms = (time.time() - self.transition_start_time) * 1000
        prev_state = self.recent_states[-2] if len(self.recent_states) > 1 else AgentState.IDLE
        transition = StateTransition(
            from_state=prev_state,
            to_state=self.current_state,
            duration_ms=duration_ms,
            agent_id=self.agent_id,
            metadata=metadata or {},
        )
        self.transitions.append(transition)
        self.transition_start_time = None

    def _raise_anomaly(self, alert_type: str, severity: str, description: str, metadata: Optional[Dict] = None):
        alert = AnomalyAlert(
            alert_id=hashlib.sha256(f"{alert_type}:{time.time()}".encode()).hexdigest()[:12],
            alert_type=alert_type,
            severity=severity,
            description=description,
            metadata=metadata or {},
        )
        self.alerts.append(alert)

    def _check_loop_anomaly(self):
        if len(self.recent_states) < self.loop_threshold:
            return
        recent = self.recent_states[-self.loop_threshold:]
        if len(set(recent)) == 1:
            self._raise_anomaly(
                "state_loop",
                "medium",
                f"Agent stuck in state '{recent[0]}' for {self.loop_threshold} transitions",
                metadata={"state": recent[0], "count": self.loop_threshold},
            )

    def get_state_distribution(self) -> Dict[str, int]:
        return dict(self.state_counts)

    def get_error_rate(self) -> float:
        total = len(self.transitions)
        if total == 0:
            return 0.0
        errors = sum(1 for t in self.transitions if t.to_state == AgentState.ERROR)
        return errors / total

    def get_avg_duration(self, state: Optional[str] = None) -> float:
        transitions = self.transitions
        if state:
            transitions = [t for t in transitions if t.to_state == state]
        if not transitions:
            return 0.0
        return sum(t.duration_ms for t in transitions) / len(transitions)

    def get_transition_graph(self) -> Dict[str, Dict[str, int]]:
        graph: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
        for t in self.transitions:
            graph[t.from_state][t.to_state] += 1
        return {k: dict(v) for k, v in graph.items()}

    def get_active_alerts(self, severity: Optional[str] = None) -> List[AnomalyAlert]:
        alerts = [a for a in self.alerts if not a.resolved]
        if severity:
            alerts = [a for a in alerts if a.severity == severity]
        return alerts

    def resolve_alert(self, alert_id: str):
        for alert in self.alerts:
            if alert.alert_id == alert_id:
                alert.resolved = True
                break

    def get_health_summary(self) -> Dict[str, Any]:
        total_transitions = len(self.transitions)
        error_rate = self.get_error_rate()
        active_alerts = len(self.get_active_alerts())
        avg_duration = self.get_avg_duration()

        status = "healthy"
        if error_rate > 0.1:
            status = "degraded"
        if error_rate > 0.25 or active_alerts > 5:
            status = "critical"

        return {
            "agent_id": self.agent_id,
            "current_state": self.current_state,
            "total_transitions": total_transitions,
            "error_rate": round(error_rate, 4),
            "active_alerts": active_alerts,
            "avg_transition_duration_ms": round(avg_duration, 2),
            "status": status,
            "state_distribution": self.get_state_distribution(),
        }

    def export_transitions(self, path: Optional[str] = None) -> str:
        import json
        from pathlib import Path
        export_path = Path(path) if path else Path("monitoring/transitions.json")
        export_path.parent.mkdir(parents=True, exist_ok=True)
        data = [t.to_dict() for t in self.transitions]
        with open(export_path, "w") as f:
            json.dump(data, f, indent=2)
        return str(export_path)
