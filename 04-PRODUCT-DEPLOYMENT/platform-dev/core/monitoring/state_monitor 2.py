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
    REMINDER_GENERATION = "reminder_generation"
    EARLY_WARNING_CHECK = "early_warning_check"
    COMPLIANCE_VALIDATION = "compliance_validation"
    DECISION_OUTPUT = "decision_output"
    ERROR = "error"


VALID_TRANSITIONS = {
    AgentState.IDLE: {AgentState.DATA_INGESTION, AgentState.ERROR},
    AgentState.DATA_INGESTION: {AgentState.CASH_FLOW_ANALYSIS, AgentState.ERROR},
    AgentState.CASH_FLOW_ANALYSIS: {AgentState.RISK_ASSESSMENT, AgentState.ERROR},
    AgentState.RISK_ASSESSMENT: {
        AgentState.PRICING_DECISION,
        AgentState.EARLY_WARNING_CHECK,
        AgentState.ERROR,
    },
    AgentState.PRICING_DECISION: {AgentState.COMPLIANCE_VALIDATION, AgentState.ERROR},
    AgentState.EARLY_WARNING_CHECK: {
        AgentState.REMINDER_GENERATION,
        AgentState.COMPLIANCE_VALIDATION,
        AgentState.ERROR,
    },
    AgentState.REMINDER_GENERATION: {AgentState.COMPLIANCE_VALIDATION, AgentState.ERROR},
    AgentState.COMPLIANCE_VALIDATION: {AgentState.DECISION_OUTPUT, AgentState.ERROR},
    AgentState.DECISION_OUTPUT: {AgentState.IDLE, AgentState.ERROR},
    AgentState.ERROR: {AgentState.IDLE},
}


@dataclass
class StateTransition:
    """Records a single state transition."""
    from_state: str
    to_state: str
    timestamp: str
    duration_ms: float
    borrower_id: Optional[str] = None
    decision_context: Dict[str, Any] = field(default_factory=dict)
    transition_hash: str = ""
    
    def __post_init__(self):
        if not self.transition_hash:
            content = f"{self.from_state}:{self.to_state}:{self.timestamp}:{self.borrower_id}"
            self.transition_hash = hashlib.sha256(content.encode()).hexdigest()[:16]
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class AnomalyAlert:
    """Detected anomaly in agent behavior."""
    alert_id: str
    alert_type: str
    severity: str
    description: str
    timestamp: str
    context: Dict[str, Any] = field(default_factory=dict)
    resolved: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class StateMachineMonitor:
    """Monitors AI agent state transitions and detects anomalies."""
    
    def __init__(
        self,
        max_transitions: int = 10000,
        anomaly_thresholds: Optional[Dict[str, float]] = None,
    ):
        self.transitions: List[StateTransition] = []
        self.max_transitions = max_transitions
        self.current_state = AgentState.IDLE
        self.transition_counts: Dict[Tuple[str, str], int] = defaultdict(int)
        self.state_durations: Dict[str, List[float]] = defaultdict(list)
        self.anomalies: List[AnomalyAlert] = []
        self.anomaly_thresholds = anomaly_thresholds or {
            "max_loop_count": 5,
            "max_error_rate": 0.1,
            "max_state_duration_ms": 30000,
            "unusual_transition_threshold": 0.05,
        }
        self._alert_counter = 0
        self._start_time: Optional[float] = None
    
    def start_transition(self, to_state: AgentState, borrower_id: Optional[str] = None, context: Optional[Dict] = None):
        """Record the start of a state transition."""
        if to_state not in VALID_TRANSITIONS.get(self.current_state, set()):
            self._raise_anomaly(
                "invalid_transition",
                "high",
                f"Invalid transition: {self.current_state.value} -> {to_state.value}",
                {"from": self.current_state.value, "to": to_state.value},
            )
            to_state = AgentState.ERROR
        
        self._start_time = time.time()
        self._pending_transition = {
            "from_state": self.current_state.value,
            "to_state": to_state.value,
            "borrower_id": borrower_id,
            "context": context or {},
        }
    
    def end_transition(self) -> StateTransition:
        """Complete the current transition and record it."""
        if not hasattr(self, "_pending_transition"):
            raise RuntimeError("No pending transition. Call start_transition first.")
        
        duration_ms = (time.time() - self._start_time) * 1000 if self._start_time else 0
        transition = StateTransition(
            from_state=self._pending_transition["from_state"],
            to_state=self._pending_transition["to_state"],
            timestamp=datetime.now().isoformat(),
            duration_ms=round(duration_ms, 2),
            borrower_id=self._pending_transition.get("borrower_id"),
            decision_context=self._pending_transition.get("context", {}),
        )
        
        self.transitions.append(transition)
        if len(self.transitions) > self.max_transitions:
            self.transitions = self.transitions[-self.max_transitions:]
        
        key = (transition.from_state, transition.to_state)
        self.transition_counts[key] += 1
        self.state_durations[transition.to_state].append(transition.duration_ms)
        
        self.current_state = AgentState(transition.to_state)
        
        if duration_ms > self.anomaly_thresholds["max_state_duration_ms"]:
            self._raise_anomaly(
                "slow_transition",
                "medium",
                f"Transition {transition.from_state} -> {transition.to_state} took {duration_ms:.0f}ms",
                {"duration_ms": duration_ms, "threshold_ms": self.anomaly_thresholds["max_state_duration_ms"]},
            )
        
        self._check_loop_anomaly()
        
        del self._pending_transition
        del self._start_time
        
        return transition
    
    def _raise_anomaly(self, alert_type: str, severity: str, description: str, context: Dict[str, Any]):
        self._alert_counter += 1
        alert = AnomalyAlert(
            alert_id=f"ANM-{self._alert_counter:06d}",
            alert_type=alert_type,
            severity=severity,
            description=description,
            timestamp=datetime.now().isoformat(),
            context=context,
        )
        self.anomalies.append(alert)
    
    def _check_loop_anomaly(self):
        recent = self.transitions[-20:] if len(self.transitions) >= 20 else self.transitions
        state_sequence = [t.to_state for t in recent]
        
        for state in set(state_sequence):
            count = state_sequence.count(state)
            if count > self.anomaly_thresholds["max_loop_count"]:
                self._raise_anomaly(
                    "state_loop",
                    "high",
                    f"Agent stuck in '{state}' state ({count} times in last 20 transitions)",
                    {"state": state, "count": count},
                )
    
    def get_state_distribution(self) -> Dict[str, int]:
        """Get count of transitions per state."""
        dist = defaultdict(int)
        for t in self.transitions:
            dist[t.to_state] += 1
        return dict(dist)
    
    def get_error_rate(self) -> float:
        """Calculate the error transition rate."""
        if not self.transitions:
            return 0.0
        error_count = sum(1 for t in self.transitions if t.to_state == "error")
        return error_count / len(self.transitions)
    
    def get_avg_duration(self, state: str) -> float:
        """Get average duration for a specific state."""
        durations = self.state_durations.get(state, [])
        return sum(durations) / len(durations) if durations else 0.0
    
    def get_transition_graph(self) -> Dict[str, Any]:
        """Build a transition graph for visualization."""
        nodes = list(AgentState)
        edges = []
        for (from_s, to_s), count in self.transition_counts.items():
            edges.append({
                "from": from_s,
                "to": to_s,
                "count": count,
            })
        
        total = sum(self.transition_counts.values())
        for edge in edges:
            edge["probability"] = round(edge["count"] / max(total, 1), 4)
        
        return {
            "nodes": [s.value for s in nodes],
            "edges": edges,
            "current_state": self.current_state.value,
            "total_transitions": total,
        }
    
    def get_active_alerts(self, unresolved_only: bool = True) -> List[Dict[str, Any]]:
        """Get active anomaly alerts."""
        alerts = self.anomalies
        if unresolved_only:
            alerts = [a for a in alerts if not a.resolved]
        return [a.to_dict() for a in alerts]
    
    def resolve_alert(self, alert_id: str) -> bool:
        """Mark an alert as resolved."""
        for alert in self.anomalies:
            if alert.alert_id == alert_id:
                alert.resolved = True
                return True
        return False
    
    def get_health_summary(self) -> Dict[str, Any]:
        """Get overall monitoring health summary."""
        error_rate = self.get_error_rate()
        active_alerts = len([a for a in self.anomalies if not a.resolved])
        
        if error_rate > self.anomaly_thresholds["max_error_rate"] or active_alerts > 10:
            status = "degraded"
        elif active_alerts > 0:
            status = "warning"
        else:
            status = "healthy"
        
        return {
            "status": status,
            "current_state": self.current_state.value,
            "total_transitions": len(self.transitions),
            "error_rate": round(error_rate, 4),
            "active_alerts": active_alerts,
            "state_distribution": self.get_state_distribution(),
            "avg_durations": {
                state: round(sum(durs) / len(durs), 2)
                for state, durs in self.state_durations.items()
                if durs
            },
        }
    
    def export_transitions(self, path: str) -> str:
        """Export all transitions to a JSON file."""
        import os
        from pathlib import Path
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        data = {
            "transitions": [t.to_dict() for t in self.transitions],
            "anomalies": [a.to_dict() for a in self.anomalies],
            "health_summary": self.get_health_summary(),
            "exported_at": datetime.now().isoformat(),
        }
        with open(path, "w") as f:
            json.dump(data, f, indent=2)
        return path
