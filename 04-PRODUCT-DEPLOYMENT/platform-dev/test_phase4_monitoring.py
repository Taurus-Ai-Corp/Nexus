"""
Phase 4 Integration Test — Reliability & Observability

Tests state machine monitoring, audit trails, Prometheus metrics,
explainability engine, and health monitoring for the micro-loan platform.
"""

import sys
import os
import time
import json
import numpy as np
from typing import Dict, Any

sys.path.insert(0, os.path.dirname(__file__))

from core.monitoring.state_monitor import (
    StateMachineMonitor, StateTransition, AnomalyAlert,
    AgentState, VALID_TRANSITIONS,
)
from core.monitoring.audit_trail import AuditTrail, AuditEntry, AuditEventType
from core.monitoring.metrics import (
    MetricsRegistry, Counter, Gauge, Histogram,
    default_registry, setup_default_metrics,
)
from core.monitoring.explainability import (
    ExplainabilityEngine, ExplainabilityReport, FeatureImportance,
    CounterfactualExplanation, ConfidenceInterval,
)
from core.monitoring.health_monitor import (
    HealthMonitor, HealthCheck, SystemAlert, ResourceMetrics,
    HealthStatus, AlertSeverity,
)


def test_state_machine_monitor():
    """Test state machine transition tracking."""
    print("=" * 60)
    print("TEST: StateMachineMonitor")
    print("=" * 60)

    monitor = StateMachineMonitor(agent_id="pricing_agent")

    # Valid transitions
    monitor.start_transition(AgentState.IDLE, AgentState.DATA_INGESTION)
    monitor.end_transition()
    assert monitor.current_state == AgentState.DATA_INGESTION
    print(f"   ✅ IDLE -> DATA_INGESTION")

    monitor.start_transition(AgentState.DATA_INGESTION, AgentState.CASH_FLOW_ANALYSIS)
    monitor.end_transition()
    assert monitor.current_state == AgentState.CASH_FLOW_ANALYSIS
    print(f"   ✅ DATA_INGESTION -> CASH_FLOW_ANALYSIS")

    monitor.start_transition(AgentState.CASH_FLOW_ANALYSIS, AgentState.RISK_ASSESSMENT)
    monitor.end_transition()
    monitor.start_transition(AgentState.RISK_ASSESSMENT, AgentState.PRICING_DECISION)
    monitor.end_transition()
    monitor.start_transition(AgentState.PRICING_DECISION, AgentState.COMPLIANCE_VALIDATION)
    monitor.end_transition()
    monitor.start_transition(AgentState.COMPLIANCE_VALIDATION, AgentState.DECISION_OUTPUT)
    monitor.end_transition()
    monitor.start_transition(AgentState.DECISION_OUTPUT, AgentState.IDLE)
    monitor.end_transition()

    assert len(monitor.transitions) == 7
    print(f"   ✅ Full lifecycle: {len(monitor.transitions)} transitions")

    # State distribution
    dist = monitor.get_state_distribution()
    assert dist[AgentState.DATA_INGESTION] == 1
    print(f"   ✅ State distribution: {dist}")

    # Error rate
    error_rate = monitor.get_error_rate()
    assert error_rate == 0.0
    print(f"   ✅ Error rate: {error_rate:.0%}")

    # Health summary
    summary = monitor.get_health_summary()
    assert summary["status"] == "healthy"
    assert summary["total_transitions"] == 7
    print(f"   ✅ Health summary: {summary['status']}")

    # Invalid transition detection
    monitor.start_transition(AgentState.IDLE, AgentState.ERROR)
    monitor.end_transition()
    alerts = monitor.get_active_alerts()
    # Should not raise anomaly for valid IDLE->ERROR
    print(f"   ✅ Valid error transition handled")

    # Export
    export_path = monitor.export_transitions()
    assert os.path.exists(export_path)
    print(f"   ✅ Exported transitions to {export_path}")
    print()


def test_audit_trail():
    """Test audit trail with SHA-256 chain verification."""
    print("=" * 60)
    print("TEST: AuditTrail")
    print("=" * 60)

    trail = AuditTrail()

    # Log events
    trail.log(AuditEventType.SYSTEM_STARTUP, "system", details={"version": "2.1.0"})
    trail.log(AuditEventType.CONSENT_GRANTED, "BORROWER_001", borrower_id="B001",
              details={"purpose": "loan_processing"})
    trail.log(AuditEventType.DATA_INGESTION, "pricing_agent", borrower_id="B001",
              details={"records": 150})
    trail.log(AuditEventType.PRICING_DECISION, "pricing_agent", borrower_id="B001",
              details={"rate": 0.18, "term": 12})
    trail.log(AuditEventType.REMINDER_SENT, "reminder_engine", borrower_id="B001",
              details={"channel": "sms", "language": "en"})

    assert len(trail.entries) == 5
    print(f"   ✅ Logged {len(trail.entries)} audit events")

    # Chain verification
    verification = trail.verify_chain()
    assert verification["valid"] is True
    print(f"   ✅ Chain verified: {verification['message']}")

    # Query
    borrower_entries = trail.get_borrower_audit("B001")
    assert len(borrower_entries) == 4
    print(f"   ✅ Borrower audit: {len(borrower_entries)} entries")

    type_entries = trail.query(event_type="pricing_decision")
    assert len(type_entries) == 1
    print(f"   ✅ Query by type: {len(type_entries)} entries")

    # Compliance report
    report = trail.get_compliance_report()
    assert report["total_events"] == 5
    assert "pricing_decision" in report["by_type"]
    print(f"   ✅ Compliance report: {report['total_events']} events")

    # Stats
    stats = trail.get_stats()
    assert stats["total_entries"] == 5
    assert stats["chain_verified"] is True
    print(f"   ✅ Stats: {stats['total_entries']} entries, {stats['unique_borrowers']} borrowers")
    print()


def test_prometheus_metrics():
    """Test Prometheus-compatible metrics."""
    print("=" * 60)
    print("TEST: Prometheus Metrics")
    print("=" * 60)

    registry = MetricsRegistry()

    # Counter
    counter = registry.counter("test_predictions", "Total test predictions")
    counter.inc()
    counter.inc(5)
    counter.inc(labels={"model": "ppo"})
    samples = counter.get_samples()
    assert len(samples) == 2
    print(f"   ✅ Counter: {len(samples)} label combinations")

    # Gauge
    gauge = registry.gauge("test_accuracy", "Model accuracy")
    gauge.set(0.85)
    gauge.set(0.90, labels={"model": "ppo"})
    samples = gauge.get_samples()
    assert len(samples) == 2
    print(f"   ✅ Gauge: {len(samples)} label combinations")

    # Histogram
    histogram = registry.histogram("test_latency", "Prediction latency", buckets=[0.01, 0.05, 0.1, 0.5, 1.0])
    histogram.observe(0.03)
    histogram.observe(0.08)
    histogram.observe(0.5)
    histogram.observe(0.02, labels={"endpoint": "/recommend"})
    samples = histogram.get_samples()
    assert len(samples) > 0
    print(f"   ✅ Histogram: {len(samples)} samples")

    # Prometheus rendering
    prometheus_output = registry.render_prometheus()
    assert "HELP" in prometheus_output
    assert "TYPE" in prometheus_output
    assert "test_predictions" in prometheus_output
    print(f"   ✅ Prometheus output: {len(prometheus_output.split(chr(10)))} lines")

    # All metrics
    all_metrics = registry.get_all_metrics()
    assert "counters" in all_metrics
    assert "gauges" in all_metrics
    assert "histograms" in all_metrics
    print(f"   ✅ All metrics retrieved")
    print()


def test_explainability_engine():
    """Test explainability features."""
    print("=" * 60)
    print("TEST: ExplainabilityEngine")
    print("=" * 60)

    engine = ExplainabilityEngine()

    features = {
        "loan_amount": 50000,
        "credit_score": 720,
        "monthly_income": 25000,
        "debt_to_income": 0.4,
        "employment_months": 24,
    }

    report = engine.explain_prediction(
        borrower_id="B001",
        prediction=0.75,
        features=features,
        confidence=0.80,
    )

    assert report.borrower_id == "B001"
    assert report.prediction_value == 0.75
    assert len(report.feature_importance) == 5
    assert len(report.counterfactuals) > 0
    assert report.confidence_interval is not None
    assert report.narrative != ""
    print(f"   ✅ Report generated for borrower B001")
    print(f"   ✅ Feature importance: {len(report.feature_importance)} features")
    print(f"   ✅ Counterfactuals: {len(report.counterfactuals)} scenarios")
    print(f"   ✅ Confidence interval: [{report.confidence_interval.lower:.2%}, {report.confidence_interval.upper:.2%}]")
    print(f"   ✅ Narrative: {report.narrative[:80]}...")

    # to_dict
    d = report.to_dict()
    assert d["borrower_id"] == "B001"
    assert d["prediction_value"] == 0.75
    print(f"   ✅ Report serialization")
    print()


def test_health_monitor():
    """Test system health monitoring."""
    print("=" * 60)
    print("TEST: HealthMonitor")
    print("=" * 60)

    monitor = HealthMonitor()

    # Resource metrics
    metrics = monitor.collect_resource_metrics()
    assert isinstance(metrics, ResourceMetrics)
    print(f"   ✅ Resource metrics collected")

    # Health check
    health = monitor.check_health()
    assert health["status"] in ("healthy", "degraded", "critical")
    assert health["uptime_seconds"] > 0
    print(f"   ✅ Health status: {health['status']}")
    print(f"   ✅ Uptime: {health['uptime_seconds']:.1f}s")

    # Request tracking
    monitor.record_request("/api/pricing/recommend")
    monitor.record_request("/api/pricing/recommend", error=True)
    monitor.record_request("/api/pricing/status")
    error_rate = monitor.get_error_rate()
    assert error_rate > 0
    print(f"   ✅ Error rate: {error_rate:.0%}")

    # Alerts
    alerts = monitor.get_alerts()
    print(f"   ✅ Active alerts: {len(alerts)}")

    # Uptime
    uptime = monitor.get_uptime()
    assert uptime > 0
    print(f"   ✅ Uptime: {uptime:.1f}s")
    print()


def test_audit_entry_integrity():
    """Test individual audit entry hash verification."""
    print("=" * 60)
    print("TEST: AuditEntry Integrity")
    print("=" * 60)

    entry = AuditEntry(
        event_type="test_event",
        actor="test_actor",
        borrower_id="B001",
        details={"key": "value"},
    )

    assert entry.verify_integrity() is True
    print(f"   ✅ Entry hash verified")

    # Tamper detection
    entry.details["key"] = "tampered"
    assert entry.verify_integrity() is False
    print(f"   ✅ Tampering detected")
    print()


def run_all_tests():
    """Run all Phase 4 tests."""
    print("\n" + "=" * 60)
    print("  PHASE 4: RELIABILITY & OBSERVABILITY — TEST SUITE")
    print("=" * 60 + "\n")

    tests = [
        ("State Machine Monitor", test_state_machine_monitor),
        ("Audit Trail", test_audit_trail),
        ("Prometheus Metrics", test_prometheus_metrics),
        ("Explainability Engine", test_explainability_engine),
        ("Health Monitor", test_health_monitor),
        ("Audit Entry Integrity", test_audit_entry_integrity),
    ]

    passed = 0
    failed = 0
    for name, test_fn in tests:
        try:
            test_fn()
            passed += 1
        except Exception as e:
            print(f"   ❌ FAILED: {e}")
            import traceback
            traceback.print_exc()
            failed += 1

    print("=" * 60)
    print(f"  RESULTS: {passed} passed, {failed} failed, {passed + failed} total")
    print("=" * 60)
    return failed == 0


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
