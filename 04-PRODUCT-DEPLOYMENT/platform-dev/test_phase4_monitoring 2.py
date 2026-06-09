"""
Phase 4 Integration Tests: Reliability & Observability.

Tests state machine monitoring, audit trail, metrics, explainability,
and health monitoring.
"""

import sys
import os
import json
import time
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from core.monitoring.state_monitor import (
    StateMachineMonitor,
    StateTransition,
    AnomalyAlert,
    AgentState,
    VALID_TRANSITIONS,
)
from core.monitoring.audit_trail import (
    AuditTrail,
    AuditEntry,
    AuditEventType,
)
from core.monitoring.metrics import (
    MetricsRegistry,
    Counter,
    Gauge,
    Histogram,
    MetricSample,
    setup_default_metrics,
)
from core.monitoring.explainability import (
    ExplainabilityEngine,
    ExplainabilityReport,
    FeatureImportance,
    CounterfactualExplanation,
    ConfidenceInterval,
)
from core.monitoring.health_monitor import (
    HealthMonitor,
    HealthCheck,
    SystemAlert,
    ResourceMetrics,
    HealthStatus,
    AlertSeverity,
)


SAMPLE_FEATURES = {
    "credit_score": 0.65,
    "monthly_income": 25000,
    "loan_amount": 50000,
    "loan_term_months": 12,
    "repayment_history": 0.75,
    "years_in_business": 5,
    "has_bank_account": True,
    "has_upi": True,
    "previous_loans": 2,
    "previous_defaults": 0,
    "economic_factor": 1.05,
    "age": 35,
    "dependents": 2,
}


class TestStateMachineMonitor(unittest.TestCase):
    """Test the state machine monitoring system."""
    
    def setUp(self):
        self.monitor = StateMachineMonitor()
    
    def test_initial_state(self):
        self.assertEqual(self.monitor.current_state, AgentState.IDLE)
    
    def test_valid_transition(self):
        self.monitor.start_transition(AgentState.DATA_INGESTION, borrower_id="BL000001")
        transition = self.monitor.end_transition()
        
        self.assertEqual(transition.from_state, "idle")
        self.assertEqual(transition.to_state, "data_ingestion")
        self.assertEqual(transition.borrower_id, "BL000001")
        self.assertGreaterEqual(transition.duration_ms, 0)
        self.assertTrue(len(transition.transition_hash) > 0)
    
    def test_full_workflow(self):
        workflow = [
            AgentState.DATA_INGESTION,
            AgentState.CASH_FLOW_ANALYSIS,
            AgentState.RISK_ASSESSMENT,
            AgentState.PRICING_DECISION,
            AgentState.COMPLIANCE_VALIDATION,
            AgentState.DECISION_OUTPUT,
            AgentState.IDLE,
        ]
        
        for state in workflow:
            self.monitor.start_transition(state, borrower_id="BL000001")
            transition = self.monitor.end_transition()
            self.assertEqual(transition.to_state, state.value)
        
        self.assertEqual(self.monitor.current_state, AgentState.IDLE)
    
    def test_invalid_transition_detected(self):
        self.monitor.start_transition(AgentState.DATA_INGESTION)
        self.monitor.end_transition()
        
        self.monitor.start_transition(AgentState.DECISION_OUTPUT)
        
        alerts = self.monitor.get_active_alerts()
        anomaly_alerts = [a for a in alerts if a["alert_type"] == "invalid_transition"]
        self.assertGreater(len(anomaly_alerts), 0)
    
    def test_error_transition(self):
        self.monitor.start_transition(AgentState.DATA_INGESTION)
        self.monitor.end_transition()
        
        self.monitor.start_transition(AgentState.ERROR)
        self.monitor.end_transition()
        
        error_rate = self.monitor.get_error_rate()
        self.assertGreater(error_rate, 0)
    
    def test_state_distribution(self):
        self.monitor.start_transition(AgentState.DATA_INGESTION)
        self.monitor.end_transition()
        self.monitor.start_transition(AgentState.CASH_FLOW_ANALYSIS)
        self.monitor.end_transition()
        
        dist = self.monitor.get_state_distribution()
        self.assertIn("data_ingestion", dist)
        self.assertIn("cash_flow_analysis", dist)
    
    def test_transition_graph(self):
        self.monitor.start_transition(AgentState.DATA_INGESTION)
        self.monitor.end_transition()
        
        graph = self.monitor.get_transition_graph()
        self.assertIn("nodes", graph)
        self.assertIn("edges", graph)
        self.assertGreater(len(graph["nodes"]), 0)
        self.assertGreater(len(graph["edges"]), 0)
    
    def test_alert_resolution(self):
        self.monitor.start_transition(AgentState.DATA_INGESTION)
        self.monitor.end_transition()
        self.monitor.start_transition(AgentState.DECISION_OUTPUT)
        
        alerts = self.monitor.get_active_alerts()
        if alerts:
            alert_id = alerts[0]["alert_id"]
            resolved = self.monitor.resolve_alert(alert_id)
            self.assertTrue(resolved)
            
            unresolved = self.monitor.get_active_alerts(unresolved_only=True)
            self.assertNotIn(alert_id, [a["alert_id"] for a in unresolved])
    
    def test_health_summary(self):
        self.monitor.start_transition(AgentState.DATA_INGESTION)
        self.monitor.end_transition()
        
        summary = self.monitor.get_health_summary()
        self.assertIn("status", summary)
        self.assertIn("current_state", summary)
        self.assertIn("total_transitions", summary)
        self.assertIn("error_rate", summary)
    
    def test_export_transitions(self):
        self.monitor.start_transition(AgentState.DATA_INGESTION)
        self.monitor.end_transition()
        
        path = "monitoring/test_transitions.json"
        saved = self.monitor.export_transitions(path)
        self.assertTrue(Path(saved).exists())
        
        with open(saved) as f:
            data = json.load(f)
        self.assertIn("transitions", data)
        self.assertIn("anomalies", data)
        self.assertIn("health_summary", data)
        
        os.remove(saved)
    
    def test_avg_duration(self):
        self.monitor.start_transition(AgentState.DATA_INGESTION)
        self.monitor.end_transition()
        
        avg = self.monitor.get_avg_duration("data_ingestion")
        self.assertGreaterEqual(avg, 0)
    
    def test_empty_monitor(self):
        self.assertEqual(self.monitor.get_error_rate(), 0.0)
        self.assertEqual(self.monitor.get_state_distribution(), {})
        self.assertEqual(self.monitor.get_active_alerts(), [])


class TestAuditTrail(unittest.TestCase):
    """Test the audit trail system."""
    
    def setUp(self):
        self.trail = AuditTrail()
    
    def test_log_entry(self):
        entry = self.trail.log(
            event_type=AuditEventType.DATA_ACCESS,
            actor_id="agent-001",
            actor_type="ai_agent",
            action="accessed borrower profile",
            borrower_id="BL000001",
            details={"fields": ["credit_score", "income"]},
        )
        
        self.assertTrue(entry.entry_id.startswith("AUD-"))
        self.assertEqual(entry.event_type, "data_access")
        self.assertEqual(entry.borrower_id, "BL000001")
        self.assertTrue(len(entry.entry_hash) > 0)
    
    def test_chain_integrity(self):
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000001")
        self.trail.log(AuditEventType.MODEL_PREDICTION, "agent-001", "ai_agent", "predict", "BL000001")
        self.trail.log(AuditEventType.CONSENT_GRANTED, "user-001", "human", "consent", "BL000001")
        
        result = self.trail.verify_chain()
        self.assertTrue(result["valid"])
        self.assertEqual(result["entries_checked"], 3)
    
    def test_query_by_borrower(self):
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000001")
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000002")
        self.trail.log(AuditEventType.MODEL_PREDICTION, "agent-001", "ai_agent", "predict", "BL000001")
        
        results = self.trail.query(borrower_id="BL000001")
        self.assertEqual(len(results), 2)
    
    def test_query_by_event_type(self):
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000001")
        self.trail.log(AuditEventType.MODEL_PREDICTION, "agent-001", "ai_agent", "predict", "BL000001")
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000002")
        
        results = self.trail.query(event_type=AuditEventType.DATA_ACCESS)
        self.assertEqual(len(results), 2)
    
    def test_borrower_audit(self):
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000001")
        self.trail.log(AuditEventType.MODEL_PREDICTION, "agent-001", "ai_agent", "predict", "BL000001")
        
        results = self.trail.get_borrower_audit("BL000001")
        self.assertEqual(len(results), 2)
    
    def test_compliance_report(self):
        self.trail.log(AuditEventType.CONSENT_GRANTED, "user-001", "human", "consent", "BL000001")
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000001")
        self.trail.log(AuditEventType.MODEL_PREDICTION, "agent-001", "ai_agent", "predict", "BL000001")
        self.trail.log(AuditEventType.ERROR, "agent-001", "ai_agent", "error", "BL000001")
        
        report = self.trail.get_compliance_report()
        self.assertIn("total_events", report)
        self.assertIn("event_breakdown", report)
        self.assertIn("consent_metrics", report)
        self.assertIn("chain_integrity", report)
        self.assertEqual(report["total_events"], 4)
    
    def test_save_load(self):
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000001")
        self.trail.log(AuditEventType.MODEL_PREDICTION, "agent-001", "ai_agent", "predict", "BL000001")
        
        path = "monitoring/test_audit.json"
        self.trail.save(path)
        self.assertTrue(Path(path).exists())
        
        trail2 = AuditTrail(storage_path=path)
        self.assertEqual(len(trail2.entries), 2)
        
        os.remove(path)
    
    def test_stats(self):
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000001")
        self.trail.log(AuditEventType.DATA_ACCESS, "agent-002", "human", "view", "BL000002")
        
        stats = self.trail.get_stats()
        self.assertEqual(stats["total_entries"], 2)
        self.assertEqual(stats["unique_borrowers"], 2)
        self.assertEqual(stats["unique_actors"], 2)
    
    def test_entry_serialization(self):
        entry = self.trail.log(
            AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", "BL000001"
        )
        d = entry.to_dict()
        self.assertIn("entry_id", d)
        self.assertIn("entry_hash", d)
        self.assertIn("previous_hash", d)
    
    def test_query_with_limit(self):
        for i in range(50):
            self.trail.log(
                AuditEventType.DATA_ACCESS, "agent-001", "ai_agent", "access", f"BL{i:06d}"
            )
        
        results = self.trail.query(limit=10)
        self.assertEqual(len(results), 10)


class TestMetrics(unittest.TestCase):
    """Test Prometheus-compatible metrics."""
    
    def setUp(self):
        self.registry = MetricsRegistry()
    
    def test_counter(self):
        counter = self.registry.counter("test_counter", "Test counter")
        counter.inc()
        counter.inc(5)
        
        samples = counter.get_samples()
        self.assertGreater(len(samples), 0)
        self.assertEqual(samples[0].value, 6.0)
    
    def test_gauge(self):
        gauge = self.registry.gauge("test_gauge", "Test gauge")
        gauge.set(42.0)
        self.assertEqual(gauge.get_samples()[0].value, 42.0)
        
        gauge.inc(10)
        self.assertEqual(gauge.get_samples()[0].value, 52.0)
        
        gauge.dec(5)
        self.assertEqual(gauge.get_samples()[0].value, 47.0)
    
    def test_histogram(self):
        hist = self.registry.histogram("test_hist", "Test histogram", buckets=[0.1, 0.5, 1.0])
        hist.observe(0.05)
        hist.observe(0.3)
        hist.observe(0.8)
        hist.observe(1.5)
        
        samples = hist.get_samples()
        self.assertGreater(len(samples), 0)
    
    def test_prometheus_render(self):
        self.registry.counter("requests_total", "Total requests").inc(10)
        self.registry.gauge("active_users", "Active users").set(42)
        
        output = self.registry.render_prometheus()
        self.assertIn("requests_total", output)
        self.assertIn("active_users", output)
        self.assertIn("# HELP", output)
        self.assertIn("# TYPE", output)
    
    def test_counter_with_labels(self):
        counter = self.registry.counter("api_calls", "API calls by endpoint")
        counter.inc(labels={"endpoint": "/predict"})
        counter.inc(labels={"endpoint": "/predict"})
        counter.inc(labels={"endpoint": "/reminders"})
        
        samples = counter.get_samples()
        self.assertGreaterEqual(len(samples), 2)
    
    def test_setup_default_metrics(self):
        reg = MetricsRegistry()
        setup_default_metrics(reg)
        
        output = reg.render_prometheus()
        self.assertIn("ml_predictions_total", output)
        self.assertIn("ml_active_borrowers", output)
        self.assertIn("ml_prediction_latency_seconds", output)
    
    def test_get_all_metrics(self):
        self.registry.counter("test_c", "Test").inc(5)
        self.registry.gauge("test_g", "Test").set(10)
        
        metrics = self.registry.get_all_metrics()
        self.assertIn("counters", metrics)
        self.assertIn("gauges", metrics)
        self.assertIn("histograms", metrics)


class TestExplainability(unittest.TestCase):
    """Test explainability features."""
    
    def setUp(self):
        self.engine = ExplainabilityEngine()
    
    def test_explain_prediction(self):
        report = self.engine.explain_prediction(
            borrower_id="BL000001",
            decision_type="loan_approval",
            prediction=0.72,
            features=SAMPLE_FEATURES,
            model_uncertainty=0.08,
        )
        
        self.assertIsInstance(report, ExplainabilityReport)
        self.assertEqual(report.borrower_id, "BL000001")
        self.assertEqual(report.decision_type, "loan_approval")
        self.assertEqual(report.prediction, 0.72)
        self.assertIsInstance(report.feature_importance, list)
        self.assertGreater(len(report.feature_importance), 0)
        self.assertIsInstance(report.confidence_interval, ConfidenceInterval)
        self.assertIsInstance(report.narrative, str)
    
    def test_feature_importance_ordering(self):
        report = self.engine.explain_prediction(
            borrower_id="BL000001",
            decision_type="loan_approval",
            prediction=0.65,
            features=SAMPLE_FEATURES,
        )
        
        importance = report.feature_importance
        for i in range(len(importance) - 1):
            self.assertGreaterEqual(importance[i].importance, importance[i + 1].importance)
    
    def test_feature_importance_values(self):
        report = self.engine.explain_prediction(
            borrower_id="BL000001",
            decision_type="loan_approval",
            prediction=0.65,
            features=SAMPLE_FEATURES,
        )
        
        for fi in report.feature_importance:
            self.assertGreaterEqual(fi.importance, 0)
            self.assertIn(fi.direction, ["positive", "negative"])
            self.assertGreaterEqual(fi.normalized_value, 0)
            self.assertLessEqual(fi.normalized_value, 1.0)
    
    def test_counterfactual_for_low_prediction(self):
        weak_features = {
            "credit_score": 0.25,
            "monthly_income": 8000,
            "loan_amount": 60000,
            "repayment_history": 0.3,
            "previous_defaults": 2,
            "years_in_business": 1,
        }
        
        report = self.engine.explain_prediction(
            borrower_id="BL000002",
            decision_type="loan_approval",
            prediction=0.25,
            features=weak_features,
        )
        
        self.assertIsNotNone(report.counterfactual)
        self.assertIsInstance(report.counterfactual, CounterfactualExplanation)
        cf = report.counterfactual
        assert cf is not None
        self.assertGreater(len(cf.changes_required), 0)
        self.assertGreaterEqual(cf.feasibility_score, 0)
        self.assertLessEqual(cf.feasibility_score, 1)
    
    def test_no_counterfactual_for_high_prediction(self):
        report = self.engine.explain_prediction(
            borrower_id="BL000003",
            decision_type="loan_approval",
            prediction=0.90,
            features={
                "credit_score": 0.95,
                "monthly_income": 80000,
                "loan_amount": 30000,
                "repayment_history": 0.98,
                "previous_defaults": 0,
            },
        )
        
        self.assertIsNone(report.counterfactual)
    
    def test_confidence_interval(self):
        report = self.engine.explain_prediction(
            borrower_id="BL000001",
            decision_type="loan_approval",
            prediction=0.65,
            features=SAMPLE_FEATURES,
            model_uncertainty=0.1,
        )
        
        ci = report.confidence_interval
        self.assertEqual(ci.point_estimate, 0.65)
        self.assertGreaterEqual(ci.lower_bound, 0.0)
        self.assertLessEqual(ci.upper_bound, 1.0)
        self.assertLess(ci.lower_bound, ci.point_estimate)
        self.assertGreater(ci.upper_bound, ci.point_estimate)
        self.assertEqual(ci.confidence_level, 0.95)
    
    def test_narrative_generation(self):
        report = self.engine.explain_prediction(
            borrower_id="BL000001",
            decision_type="loan_approval",
            prediction=0.72,
            features=SAMPLE_FEATURES,
        )
        
        self.assertIn("BL000001", report.narrative)
        self.assertIsInstance(report.narrative, str)
        self.assertGreater(len(report.narrative), 20)
    
    def test_serialization(self):
        report = self.engine.explain_prediction(
            borrower_id="BL000001",
            decision_type="loan_approval",
            prediction=0.65,
            features=SAMPLE_FEATURES,
        )
        
        d = report.to_dict()
        self.assertIn("borrower_id", d)
        self.assertIn("feature_importance", d)
        self.assertIn("confidence_interval", d)
        self.assertIn("narrative", d)
    
    def test_feature_importance_serialization(self):
        fi = FeatureImportance(
            feature_name="credit_score",
            importance=0.3,
            direction="positive",
            value=0.65,
            normalized_value=0.25,
        )
        d = fi.to_dict()
        self.assertEqual(d["feature_name"], "credit_score")


class TestHealthMonitor(unittest.TestCase):
    """Test system health monitoring."""
    
    def setUp(self):
        self.monitor = HealthMonitor()
    
    def test_register_and_run_check(self):
        self.monitor.register_check("api_check", lambda: True)
        check = self.monitor.health_checks.get("api_check")
        self.assertIsNotNone(check)
        assert check is not None
        self.assertEqual(check.status, HealthStatus.HEALTHY)
    
    def test_failing_check(self):
        self.monitor.register_check("failing_check", lambda: False)
        check = self.monitor.health_checks.get("failing_check")
        self.assertIsNotNone(check)
        assert check is not None
        self.assertEqual(check.status, HealthStatus.UNHEALTHY)
    
    def test_exception_check(self):
        def failing_fn():
            raise RuntimeError("Test error")
        
        self.monitor.register_check("exception_check", failing_fn)
        check = self.monitor.health_checks.get("exception_check")
        self.assertIsNotNone(check)
        assert check is not None
        self.assertEqual(check.status, HealthStatus.CRITICAL)
    
    def test_check_health(self):
        self.monitor.register_check("db_check", lambda: {"status": "healthy", "message": "OK"})
        
        health = self.monitor.check_health()
        self.assertIn("overall_status", health)
        self.assertIn("resources", health)
        self.assertIn("checks", health)
        self.assertIn("uptime_seconds", health)
    
    def test_resource_metrics(self):
        resources = self.monitor.collect_resource_metrics()
        self.assertIsInstance(resources, ResourceMetrics)
        self.assertGreaterEqual(resources.cpu_percent, 0)
        self.assertGreaterEqual(resources.memory_mb, 0)
        self.assertGreaterEqual(resources.uptime_seconds, 0)
    
    def test_error_rate_tracking(self):
        for _ in range(10):
            self.monitor.record_request(success=True)
        for _ in range(2):
            self.monitor.record_request(success=False)
        
        error_rate = self.monitor.get_error_rate()
        self.assertAlmostEqual(error_rate, 0.1667, places=3)
    
    def test_alert_generation(self):
        monitor = HealthMonitor(thresholds={
            "cpu_warning": 0.0,
            "cpu_critical": 0.0,
            "memory_warning_mb": 0.0,
            "memory_critical_mb": 0.0,
            "disk_warning": 0.0,
            "disk_critical": 0.0,
            "error_rate_warning": 0.0,
            "error_rate_critical": 0.0,
            "latency_warning_ms": 500,
            "latency_critical_ms": 2000,
        })
        
        monitor.register_check("test", lambda: True)
        monitor.check_health()
        
        alerts = monitor.get_alerts(unacknowledged_only=True)
        self.assertGreater(len(alerts), 0)
    
    def test_alert_acknowledgment(self):
        monitor = HealthMonitor(thresholds={
            "cpu_warning": 0.0,
            "cpu_critical": 0.0,
            "memory_warning_mb": 0.0,
            "memory_critical_mb": 0.0,
            "disk_warning": 0.0,
            "disk_critical": 0.0,
            "error_rate_warning": 0.0,
            "error_rate_critical": 0.0,
            "latency_warning_ms": 500,
            "latency_critical_ms": 2000,
        })
        monitor.register_check("test", lambda: True)
        monitor.check_health()
        
        alerts = monitor.get_alerts(unacknowledged_only=True)
        if alerts:
            alert_id = alerts[0]["alert_id"]
            monitor.acknowledge_alert(alert_id)
            
            remaining = monitor.get_alerts(unacknowledged_only=True)
            self.assertNotIn(alert_id, [a["alert_id"] for a in remaining])
    
    def test_uptime(self):
        uptime = self.monitor.get_uptime()
        self.assertGreater(uptime, 0)
    
    def test_health_check_serialization(self):
        check = HealthCheck(
            name="test",
            status=HealthStatus.HEALTHY,
            message="OK",
            latency_ms=5.2,
        )
        d = check.to_dict()
        self.assertEqual(d["name"], "test")
        self.assertEqual(d["status"], "healthy")
    
    def test_alert_serialization(self):
        alert = SystemAlert(
            alert_id="SYS-000001",
            severity="warning",
            component="cpu",
            message="CPU high",
            timestamp="2025-01-01T00:00:00",
        )
        d = alert.to_dict()
        self.assertEqual(d["alert_id"], "SYS-000001")
        self.assertEqual(d["severity"], "warning")


def run_phase4_tests():
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    suite.addTests(loader.loadTestsFromTestCase(TestStateMachineMonitor))
    suite.addTests(loader.loadTestsFromTestCase(TestAuditTrail))
    suite.addTests(loader.loadTestsFromTestCase(TestMetrics))
    suite.addTests(loader.loadTestsFromTestCase(TestExplainability))
    suite.addTests(loader.loadTestsFromTestCase(TestHealthMonitor))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result


if __name__ == "__main__":
    print("=" * 70)
    print("PHASE 4 INTEGRATION TESTS — Reliability & Observability")
    print("=" * 70)
    result = run_phase4_tests()
    
    print("\n" + "=" * 70)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Status: {'PASSED' if result.wasSuccessful() else 'FAILED'}")
    print("=" * 70)
    
    sys.exit(0 if result.wasSuccessful() else 1)
