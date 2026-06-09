"""
Phase 3 Integration Tests: AI MCP Payoff Tools.

Tests the MCP tool interface, Repayment Prediction Enhancer,
Early Warning System, and tool registry.
"""

import sys
import os
import json
import unittest
import numpy as np
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from core.mcp_tools.base import (
    MCPTool,
    ToolInput,
    ToolOutput,
    ToolExplanation,
    ToolCategory,
    ConfidenceLevel,
)
from core.mcp_tools.repayment_predictor import RepaymentPredictionEnhancer
from core.mcp_tools.early_warning import EarlyWarningSystem
from core.mcp_tools.registry import MCPToolRegistry, ToolPerformance, default_registry


SAMPLE_BORROWER_FEATURES = {
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
    "segment": "small_retailer",
}

SAMPLE_EWS_FEATURES = {
    "credit_score": 0.55,
    "monthly_income": 18000,
    "loan_amount": 40000,
    "repayment_history": 0.60,
    "previous_defaults": 1,
    "days_since_last_payment": 20,
    "payment_trend": -0.1,
    "income_volatility": 0.3,
    "economic_factor": 0.9,
    "seasonal_risk": 0.2,
    "contact_responsiveness": 0.6,
    "business_stability": 0.5,
}


def make_tool_input(features: dict, borrower_id: str = "BL000001") -> ToolInput:
    return ToolInput(
        borrower_id=borrower_id,
        features=features,
    )


class TestMCPToolBase(unittest.TestCase):
    """Test the MCP tool base class and data structures."""
    
    def test_tool_input_creation(self):
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        self.assertEqual(ti.borrower_id, "BL000001")
        self.assertIn("credit_score", ti.features)
    
    def test_tool_input_serialization(self):
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        d = ti.to_dict()
        self.assertIn("borrower_id", d)
        self.assertIn("features", d)
        
        ti2 = ToolInput.from_dict(d)
        self.assertEqual(ti2.borrower_id, ti.borrower_id)
    
    def test_tool_explanation(self):
        exp = ToolExplanation(
            feature_importance={"credit_score": 0.3, "income": 0.2},
            top_factors=[
                {"feature": "credit_score", "impact": 0.3, "value": 0.65},
            ],
            counterfactual={"credit_score": {"current": 0.65, "target": 0.80}},
            narrative="Test narrative",
        )
        d = exp.to_dict()
        self.assertIn("feature_importance", d)
        self.assertIn("top_factors", d)
        self.assertIn("counterfactual", d)
    
    def test_tool_output(self):
        exp = ToolExplanation(
            feature_importance={"f1": 0.5},
            top_factors=[{"feature": "f1", "impact": 0.5, "value": 1}],
        )
        output = ToolOutput(
            tool_name="test_tool",
            tool_version="1.0.0",
            borrower_id="BL000001",
            result={"prediction": 0.75},
            confidence=0.85,
            confidence_level=ConfidenceLevel.HIGH,
            explanation=exp,
            execution_time_ms=12.5,
        )
        d = output.to_dict()
        self.assertEqual(d["tool_name"], "test_tool")
        self.assertEqual(d["confidence_level"], "high")
        self.assertIn("execution_time_ms", d)
        
        j = output.to_json()
        parsed = json.loads(j)
        self.assertEqual(parsed["borrower_id"], "BL000001")
    
    def test_confidence_levels(self):
        self.assertEqual(ConfidenceLevel.LOW.value, "low")
        self.assertEqual(ConfidenceLevel.VERY_HIGH.value, "very_high")
    
    def test_tool_category(self):
        self.assertEqual(ToolCategory.PREDICTION.value, "prediction")
        self.assertEqual(ToolCategory.EARLY_WARNING.value, "early_warning")


class TestRepaymentPredictionEnhancer(unittest.TestCase):
    """Test the Repayment Prediction Enhancer MCP tool."""
    
    def setUp(self):
        self.tool = RepaymentPredictionEnhancer()
    
    def test_tool_metadata(self):
        meta = self.tool.get_metadata()
        self.assertEqual(meta["name"], "repayment_prediction_enhancer")
        self.assertEqual(meta["category"], "prediction")
        self.assertIn("input_schema", meta)
        self.assertIn("output_schema", meta)
    
    def test_fallback_prediction(self):
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        output = self.tool.execute(ti)
        
        self.assertEqual(output.tool_name, "repayment_prediction_enhancer")
        self.assertIn("repayment_probability", output.result)
        self.assertIn("default_probability", output.result)
        self.assertIn("risk_category", output.result)
        self.assertGreaterEqual(output.result["repayment_probability"], 0.1)
        self.assertLessEqual(output.result["repayment_probability"], 0.95)
        self.assertIn(output.result["risk_category"], ["low", "medium", "high", "critical"])
        self.assertGreater(output.confidence, 0.0)
        self.assertLessEqual(output.confidence, 1.0)
    
    def test_fallback_is_marked(self):
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        output = self.tool.execute(ti)
        self.assertTrue(output.result.get("is_fallback", False))
    
    def test_explanation_present(self):
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        output = self.tool.execute(ti)
        self.assertIsNotNone(output.explanation)
        self.assertIsInstance(output.explanation.feature_importance, dict)
        self.assertIsInstance(output.explanation.top_factors, list)
    
    def test_training_and_prediction(self):
        features_list = [
            {**SAMPLE_BORROWER_FEATURES, "credit_score": 0.8, "repayment_history": 0.9},
            {**SAMPLE_BORROWER_FEATURES, "credit_score": 0.3, "repayment_history": 0.3},
            {**SAMPLE_BORROWER_FEATURES, "credit_score": 0.6, "repayment_history": 0.7},
            {**SAMPLE_BORROWER_FEATURES, "credit_score": 0.9, "repayment_history": 0.95},
            {**SAMPLE_BORROWER_FEATURES, "credit_score": 0.2, "repayment_history": 0.2},
        ] * 20
        labels = [1, 0, 1, 1, 0] * 20
        
        result = self.tool.train(features_list, labels, n_estimators=50)
        self.assertEqual(result["status"], "trained")
        self.assertGreater(result["training_accuracy"], 0.5)
        
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        output = self.tool.execute(ti)
        
        self.assertFalse(output.result.get("is_fallback", False))
        self.assertIn("repayment_probability", output.result)
        self.assertGreater(output.execution_time_ms, 0)
    
    def test_counterfactual_generation(self):
        weak_features = {
            "credit_score": 0.3,
            "monthly_income": 10000,
            "loan_amount": 80000,
            "previous_defaults": 2,
        }
        cf = self.tool._generate_counterfactual(weak_features, 0.3)
        self.assertIsInstance(cf, dict)
        self.assertTrue(len(cf) > 0)
    
    def test_risk_classification(self):
        self.assertEqual(self.tool._classify_risk(0.85), "low")
        self.assertEqual(self.tool._classify_risk(0.70), "medium")
        self.assertEqual(self.tool._classify_risk(0.50), "high")
        self.assertEqual(self.tool._classify_risk(0.20), "critical")
    
    def test_save_load_model(self):
        features_list = [SAMPLE_BORROWER_FEATURES for _ in range(50)]
        labels = [1] * 30 + [0] * 20
        self.tool.train(features_list, labels, n_estimators=20)
        
        path = "models/test_repayment_model.pkl"
        saved_path = self.tool.save_model(path)
        self.assertTrue(Path(saved_path).exists())
        
        tool2 = RepaymentPredictionEnhancer(model_path=saved_path)
        self.assertTrue(tool2.is_trained)
        
        os.remove(saved_path)
    
    def test_input_validation(self):
        valid = make_tool_input(SAMPLE_BORROWER_FEATURES)
        self.assertTrue(self.tool.validate_input(valid))
        
        invalid = ToolInput(borrower_id="", features={})
        self.assertFalse(self.tool.validate_input(invalid))
    
    def test_multiple_borrower_predictions(self):
        borrowers = [
            make_tool_input({**SAMPLE_BORROWER_FEATURES, "segment": seg}, f"BL{i:06d}")
            for i, seg in enumerate(["street_vendor", "small_retailer", "service_provider"])
        ]
        
        outputs = [self.tool.execute(ti) for ti in borrowers]
        for output in outputs:
            self.assertIn("repayment_probability", output.result)
            self.assertGreaterEqual(output.result["repayment_probability"], 0.1)


class TestEarlyWarningSystem(unittest.TestCase):
    """Test the Early Warning System MCP tool."""
    
    def setUp(self):
        self.tool = EarlyWarningSystem()
    
    def test_tool_metadata(self):
        meta = self.tool.get_metadata()
        self.assertEqual(meta["name"], "early_warning_system")
        self.assertEqual(meta["category"], "early_warning")
    
    def test_green_risk(self):
        healthy_features = {
            "credit_score": 0.85,
            "monthly_income": 40000,
            "loan_amount": 30000,
            "repayment_history": 0.95,
            "previous_defaults": 0,
            "days_since_last_payment": 2,
            "payment_trend": 0.05,
            "income_volatility": 0.1,
            "economic_factor": 1.1,
            "seasonal_risk": 0.05,
            "contact_responsiveness": 0.95,
            "business_stability": 0.9,
        }
        ti = make_tool_input(healthy_features)
        output = self.tool.execute(ti)
        
        self.assertEqual(output.result["risk_level"], "green")
        self.assertLess(output.result["default_risk_score"], 0.25)
        self.assertEqual(output.result["intervention_urgency"], "none")
    
    def test_red_risk(self):
        stressed_features = {
            "credit_score": 0.25,
            "monthly_income": 8000,
            "loan_amount": 60000,
            "repayment_history": 0.20,
            "previous_defaults": 3,
            "days_since_last_payment": 45,
            "payment_trend": -0.3,
            "income_volatility": 0.5,
            "economic_factor": 0.7,
            "seasonal_risk": 0.4,
            "contact_responsiveness": 0.1,
            "business_stability": 0.2,
        }
        ti = make_tool_input(stressed_features)
        output = self.tool.execute(ti)
        
        self.assertEqual(output.result["risk_level"], "red")
        self.assertGreater(output.result["default_risk_score"], 0.75)
        self.assertEqual(output.result["intervention_urgency"], "escalate")
    
    def test_yellow_risk(self):
        ti = make_tool_input(SAMPLE_EWS_FEATURES)
        output = self.tool.execute(ti)
        
        self.assertIn(output.result["risk_level"], ["green", "yellow", "orange", "red"])
        self.assertGreaterEqual(output.result["default_risk_score"], 0.0)
        self.assertLessEqual(output.result["default_risk_score"], 1.0)
    
    def test_component_scores(self):
        ti = make_tool_input(SAMPLE_EWS_FEATURES)
        output = self.tool.execute(ti)
        
        scores = output.result.get("component_scores", {})
        self.assertIn("payment_delay", scores)
        self.assertIn("repayment_decline", scores)
        self.assertIn("previous_defaults", scores)
    
    def test_top_warning_factors(self):
        scores = self.tool._calculate_component_scores(SAMPLE_EWS_FEATURES)
        factors = self.tool._get_top_warning_factors(scores, SAMPLE_EWS_FEATURES)
        
        self.assertIsInstance(factors, list)
        self.assertGreater(len(factors), 0)
        self.assertLessEqual(len(factors), 5)
        self.assertIn("factor", factors[0])
        self.assertIn("risk_contribution", factors[0])
    
    def test_intervention_scenarios(self):
        scenarios = self.tool._generate_intervention_scenarios(SAMPLE_EWS_FEATURES, 0.6)
        self.assertIsInstance(scenarios, dict)
        self.assertGreater(len(scenarios), 0)
    
    def test_warning_narrative(self):
        narrative = self.tool._generate_warning_narrative(
            "BL000001", 0.65, "orange",
            [{"factor": "payment delay", "risk_contribution": 0.2, "raw_score": 0.67, "status": "warning"}]
        )
        self.assertIsInstance(narrative, str)
        self.assertIn("BL000001", narrative)
    
    def test_training(self):
        features = [SAMPLE_EWS_FEATURES for _ in range(100)]
        labels = [0] * 80 + [1] * 20
        
        result = self.tool.train(features, labels)
        self.assertEqual(result["status"], "calibrated")
        self.assertEqual(result["n_samples"], 100)
    
    def test_save_load_state(self):
        path = "models/test_ews_state.json"
        self.tool.save_state(path)
        self.assertTrue(Path(path).exists())
        
        tool2 = EarlyWarningSystem()
        tool2.load_state(path)
        self.assertEqual(tool2.thresholds, self.tool.thresholds)
        
        os.remove(path)
    
    def test_days_to_default_estimation(self):
        self.assertGreater(self.tool._estimate_days_to_default(0.1, {}), 100)
        self.assertLess(self.tool._estimate_days_to_default(0.9, {"days_since_last_payment": 30}), 30)


class TestMCPToolRegistry(unittest.TestCase):
    """Test the MCP tool registry."""
    
    def setUp(self):
        self.registry = MCPToolRegistry()
    
    def test_register_tool(self):
        tool = RepaymentPredictionEnhancer()
        name = self.registry.register(tool)
        self.assertEqual(name, "repayment_prediction_enhancer")
        self.assertIsNotNone(self.registry.get_tool(name))
    
    def test_register_class(self):
        name = self.registry.register_class(EarlyWarningSystem)
        self.assertEqual(name, "early_warning_system")
        tool = self.registry.get_tool(name)
        self.assertIsInstance(tool, EarlyWarningSystem)
    
    def test_list_tools(self):
        self.registry.register_class(RepaymentPredictionEnhancer)
        self.registry.register_class(EarlyWarningSystem)
        
        tools = self.registry.list_tools()
        self.assertEqual(len(tools), 2)
        
        prediction_tools = self.registry.list_tools(category=ToolCategory.PREDICTION)
        self.assertEqual(len(prediction_tools), 1)
    
    def test_execute_tool(self):
        self.registry.register_class(RepaymentPredictionEnhancer)
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        
        output = self.registry.execute("repayment_prediction_enhancer", ti)
        self.assertIsInstance(output, ToolOutput)
        self.assertIn("repayment_probability", output.result)
    
    def test_execute_nonexistent_tool(self):
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        with self.assertRaises(ValueError):
            self.registry.execute("nonexistent_tool", ti)
    
    def test_performance_tracking(self):
        self.registry.register_class(RepaymentPredictionEnhancer)
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        
        self.registry.execute("repayment_prediction_enhancer", ti)
        self.registry.execute("repayment_prediction_enhancer", ti)
        
        report = self.registry.get_performance_report()
        perf = report["repayment_prediction_enhancer"]
        self.assertEqual(perf["total_calls"], 2)
        self.assertEqual(perf["total_errors"], 0)
        self.assertGreater(perf["avg_execution_time_ms"], 0)
    
    def test_chain_tools(self):
        self.registry.register_class(RepaymentPredictionEnhancer)
        self.registry.register_class(EarlyWarningSystem)
        
        ti = make_tool_input({
            **SAMPLE_BORROWER_FEATURES,
            "days_since_last_payment": 5,
            "payment_trend": 0,
            "income_volatility": 0.2,
            "contact_responsiveness": 0.8,
            "business_stability": 0.7,
        })
        
        chain = [
            {"tool": "repayment_prediction_enhancer"},
            {"tool": "early_warning_system"},
        ]
        
        results = self.registry.chain_tools(chain, ti)
        self.assertEqual(len(results), 2)
        self.assertIsInstance(results[0], ToolOutput)
        self.assertIsInstance(results[1], ToolOutput)
    
    def test_performance_report_summary(self):
        self.registry.register_class(RepaymentPredictionEnhancer)
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        self.registry.execute("repayment_prediction_enhancer", ti)
        
        report = self.registry.get_performance_report()
        self.assertIn("_summary", report)
        self.assertEqual(report["_summary"]["total_tools"], 1)
        self.assertEqual(report["_summary"]["total_calls"], 1)
    
    def test_save_load_registry(self):
        self.registry.register_class(RepaymentPredictionEnhancer)
        ti = make_tool_input(SAMPLE_BORROWER_FEATURES)
        self.registry.execute("repayment_prediction_enhancer", ti)
        
        path = "models/test_registry.json"
        self.registry.save_registry(path)
        self.assertTrue(Path(path).exists())
        
        registry2 = MCPToolRegistry()
        registry2.register_class(RepaymentPredictionEnhancer)
        registry2.load_registry(path)
        
        report = registry2.get_performance_report()
        self.assertGreater(report["repayment_prediction_enhancer"]["total_calls"], 0)
        
        os.remove(path)


def run_phase3_tests():
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    suite.addTests(loader.loadTestsFromTestCase(TestMCPToolBase))
    suite.addTests(loader.loadTestsFromTestCase(TestRepaymentPredictionEnhancer))
    suite.addTests(loader.loadTestsFromTestCase(TestEarlyWarningSystem))
    suite.addTests(loader.loadTestsFromTestCase(TestMCPToolRegistry))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result


if __name__ == "__main__":
    print("=" * 70)
    print("PHASE 3 INTEGRATION TESTS — AI MCP Payoff Tools")
    print("=" * 70)
    result = run_phase3_tests()
    
    print("\n" + "=" * 70)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Status: {'PASSED' if result.wasSuccessful() else 'FAILED'}")
    print("=" * 70)
    
    sys.exit(0 if result.wasSuccessful() else 1)
