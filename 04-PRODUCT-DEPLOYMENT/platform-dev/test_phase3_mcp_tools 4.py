"""
Phase 3 Integration Test — MCP Payoff Tools

Tests the MCP tool interface, repayment predictor, early warning system,
and tool registry for the micro-loan pricing platform.
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from core.mcp_tools.base import (
    ConfidenceLevel,
    ToolCategory,
    ToolExplanation,
    ToolInput,
    ToolOutput,
)
from core.mcp_tools.early_warning import EarlyWarningSystem
from core.mcp_tools.registry import MCPToolRegistry, ToolPerformance
from core.mcp_tools.repayment_predictor import RepaymentPredictionEnhancer


def test_tool_input_output():
    """Test ToolInput and ToolOutput serialization."""
    print("=" * 60)
    print("TEST: ToolInput / ToolOutput")
    print("=" * 60)

    tool_input = ToolInput(
        borrower_id="B001",
        features={"loan_amount": 50000, "credit_score": 720, "monthly_income": 25000},
        metadata={"source": "api"},
    )

    assert tool_input.borrower_id == "B001"
    assert tool_input.features["loan_amount"] == 50000

    d = tool_input.to_dict()
    assert isinstance(d, dict)
    assert d["borrower_id"] == "B001"

    restored = ToolInput.from_dict(d)
    assert restored.borrower_id == "B001"
    print("   ✅ ToolInput serialization round-trip")

    explanation = ToolExplanation(
        feature_importance=[{"feature": "credit_score", "importance": 0.35}],
        top_factors=["credit_score", "monthly_income"],
        narrative="Strong credit profile",
        confidence_score=0.85,
        confidence_level=ConfidenceLevel.high,
    )
    assert explanation.confidence_level == ConfidenceLevel.high
    assert len(explanation.top_factors) == 2
    print("   ✅ ToolExplanation created")

    output = ToolOutput(
        tool_name="test_tool",
        borrower_id="B001",
        result={"score": 0.85},
        explanation=explanation,
        confidence=0.85,
        confidence_level=ConfidenceLevel.high,
    )
    assert output.status == "success"
    assert output.result["score"] == 0.85
    print("   ✅ ToolOutput created")

    json_str = output.to_json()
    parsed = json.loads(json_str)
    assert parsed["tool_name"] == "test_tool"
    print("   ✅ ToolOutput JSON serialization")
    print()


def test_tool_categories():
    """Test ToolCategory and ConfidenceLevel enums."""
    print("=" * 60)
    print("TEST: ToolCategory & ConfidenceLevel")
    print("=" * 60)

    assert ToolCategory.prediction.value == "prediction"
    assert ToolCategory.early_warning.value == "early_warning"
    assert ToolCategory.pricing.value == "pricing"
    assert ToolCategory.compliance.value == "compliance"
    print("   ✅ ToolCategory enum values")

    assert ConfidenceLevel.very_high.value == "very_high"
    assert ConfidenceLevel.high.value == "high"
    assert ConfidenceLevel.medium.value == "medium"
    assert ConfidenceLevel.low.value == "low"
    assert ConfidenceLevel.very_low.value == "very_low"
    print("   ✅ ConfidenceLevel enum values")
    print()


def test_repayment_predictor_fallback():
    """Test repayment predictor fallback (no model trained)."""
    print("=" * 60)
    print("TEST: RepaymentPredictionEnhancer (fallback)")
    print("=" * 60)

    predictor = RepaymentPredictionEnhancer()
    assert predictor.is_trained is False

    tool_input = ToolInput(
        borrower_id="B001",
        features={
            "loan_amount": 50000,
            "interest_rate": 0.18,
            "tenor_months": 12,
            "monthly_income": 25000,
            "monthly_expenses": 15000,
            "debt_to_income": 0.4,
            "credit_score": 720,
            "employment_months": 24,
            "previous_defaults": 0,
            "savings_balance": 10000,
            "transaction_volatility": 0.2,
            "seasonal_income_factor": 1.0,
            "region_risk_score": 0.3,
            "segment": "personal",
        },
    )

    result = predictor.execute(tool_input)
    assert result.status == "success"
    assert result.borrower_id == "B001"
    assert "repayment_probability" in result.result
    assert 0.0 <= result.result["repayment_probability"] <= 1.0
    assert "risk_level" in result.result
    assert result.confidence > 0.0
    assert result.execution_time_ms > 0
    print(f"   ✅ Repayment probability: {result.result['repayment_probability']:.2%}")
    print(f"   ✅ Risk level: {result.result['risk_level']}")
    print(f"   ✅ Confidence: {result.confidence:.2%}")
    print(f"   ✅ Execution time: {result.execution_time_ms:.1f}ms")
    print()


def test_repayment_predictor_edge_cases():
    """Test repayment predictor with edge case inputs."""
    print("=" * 60)
    print("TEST: RepaymentPredictionEnhancer (edge cases)")
    print("=" * 60)

    predictor = RepaymentPredictionEnhancer()

    # High risk borrower
    high_risk = ToolInput(
        borrower_id="B_HIGH",
        features={
            "loan_amount": 200000,
            "interest_rate": 0.36,
            "tenor_months": 36,
            "monthly_income": 8000,
            "monthly_expenses": 7500,
            "debt_to_income": 0.9,
            "credit_score": 400,
            "employment_months": 2,
            "previous_defaults": 3,
            "savings_balance": 0,
            "transaction_volatility": 0.9,
            "seasonal_income_factor": 0.5,
            "region_risk_score": 0.9,
            "segment": "micro",
        },
    )

    result = predictor.execute(high_risk)
    assert result.status == "success"
    assert result.result["repayment_probability"] < 0.5
    print(f"   ✅ High risk borrower: {result.result['repayment_probability']:.2%}")

    # Minimal features
    minimal = ToolInput(
        borrower_id="B_MIN",
        features={"loan_amount": 10000},
    )
    result = predictor.execute(minimal)
    assert result.status == "success"
    print(f"   ✅ Minimal features: {result.result['repayment_probability']:.2%}")
    print()


def test_early_warning_system():
    """Test early warning system risk detection."""
    print("=" * 60)
    print("TEST: EarlyWarningSystem")
    print("=" * 60)

    ews = EarlyWarningSystem()

    # Healthy borrower
    healthy = ToolInput(
        borrower_id="B_HEALTHY",
        features={
            "monthly_income": 30000,
            "monthly_expenses": 15000,
            "savings_balance": 50000,
            "loan_amount": 100000,
            "debt_to_income": 0.3,
            "transaction_volatility": 0.1,
            "days_since_last_transaction": 2,
            "income_trend_3m": 0.05,
            "expense_trend_3m": -0.02,
            "region_risk_score": 0.2,
        },
    )

    result = ews.execute(healthy)
    assert result.status == "success"
    assert result.result["risk_level"] in ("minimal", "low")
    print(f"   ✅ Healthy borrower risk: {result.result['risk_level']}")
    print(f"   ✅ Overall risk score: {result.result['overall_risk_score']:.2f}")

    # Distressed borrower
    distressed = ToolInput(
        borrower_id="B_DISTRESS",
        features={
            "monthly_income": 5000,
            "monthly_expenses": 4800,
            "savings_balance": 100,
            "loan_amount": 100000,
            "debt_to_income": 0.95,
            "transaction_volatility": 0.8,
            "days_since_last_transaction": 20,
            "income_trend_3m": -0.5,
            "expense_trend_3m": 0.6,
            "region_risk_score": 0.8,
        },
    )

    result = ews.execute(distressed)
    assert result.status == "success"
    assert result.result["risk_level"] in ("critical", "high")
    assert result.result["recommended_action"] in ("immediate_intervention", "schedule_counseling")
    print(f"   ✅ Distressed borrower risk: {result.result['risk_level']}")
    print(f"   ✅ Recommended action: {result.result['recommended_action']}")
    print(f"   ✅ Urgency: {result.result['urgency']}")
    print()


def test_tool_registry():
    """Test MCP tool registry discovery and execution."""
    print("=" * 60)
    print("TEST: MCPToolRegistry")
    print("=" * 60)

    registry = MCPToolRegistry()

    # Register tools manually
    predictor = RepaymentPredictionEnhancer()
    ews = EarlyWarningSystem()
    registry.register(predictor)
    registry.register(ews)

    # List tools
    tools = registry.list_tools()
    assert len(tools) == 2
    print(f"   ✅ Registered {len(tools)} tools")

    for t in tools:
        assert "name" in t
        assert "category" in t
        assert "performance" in t
        print(f"   ✅ Tool: {t['name']} ({t['category']})")

    # Execute tool
    tool_input = ToolInput(
        borrower_id="B001",
        features={
            "loan_amount": 50000, "credit_score": 720, "monthly_income": 25000,
            "debt_to_income": 0.4, "interest_rate": 0.18, "tenor_months": 12,
            "monthly_expenses": 15000, "employment_months": 24,
            "previous_defaults": 0, "savings_balance": 10000,
            "transaction_volatility": 0.2, "seasonal_income_factor": 1.0,
            "region_risk_score": 0.3, "segment": "personal",
        },
    )

    result = registry.execute("repayment_prediction_enhancer", tool_input)
    assert result.status == "success"
    print(f"   ✅ Registry execution: {result.result.get('repayment_probability', 'N/A')}")

    # Performance report
    report = registry.get_performance_report()
    assert "tools" in report
    assert "summary" in report
    assert report["summary"]["total_calls"] >= 1
    print(f"   ✅ Performance: {report['summary']['total_calls']} calls, {report['summary']['overall_success_rate']:.0%} success")

    # Non-existent tool
    result = registry.execute("nonexistent_tool", tool_input)
    assert result.status == "error"
    print("   ✅ Error handling for unknown tool")
    print()


def test_tool_performance_tracking():
    """Test ToolPerformance metrics."""
    print("=" * 60)
    print("TEST: ToolPerformance Tracking")
    print("=" * 60)

    perf = ToolPerformance()
    assert perf.total_calls == 0
    assert perf.success_rate == 1.0

    perf.record_call(10.0, True)
    assert perf.total_calls == 1
    assert perf.success_rate == 1.0

    perf.record_call(20.0, True)
    perf.record_call(15.0, False)
    assert perf.total_calls == 3
    assert perf.total_errors == 1
    assert perf.success_rate == 2/3
    assert perf.avg_execution_time_ms > 0

    d = perf.to_dict()
    assert d["total_calls"] == 3
    assert d["total_errors"] == 1
    print(f"   ✅ Performance tracking: {d['total_calls']} calls, {d['success_rate']:.0%} success")
    print()


def run_all_tests():
    """Run all Phase 3 tests."""
    print("\n" + "=" * 60)
    print("  PHASE 3: MCP PAYOFF TOOLS — TEST SUITE")
    print("=" * 60 + "\n")

    tests = [
        ("ToolInput/Output", test_tool_input_output),
        ("Categories", test_tool_categories),
        ("Repayment Predictor (fallback)", test_repayment_predictor_fallback),
        ("Repayment Predictor (edge cases)", test_repayment_predictor_edge_cases),
        ("Early Warning System", test_early_warning_system),
        ("Tool Registry", test_tool_registry),
        ("Performance Tracking", test_tool_performance_tracking),
    ]

    passed = 0
    failed = 0
    for name, test_fn in tests:
        try:
            test_fn()
            passed += 1
        except Exception as e:
            print(f"   ❌ FAILED: {e}")
            failed += 1

    print("=" * 60)
    print(f"  RESULTS: {passed} passed, {failed} failed, {passed + failed} total")
    print("=" * 60)
    return failed == 0


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
