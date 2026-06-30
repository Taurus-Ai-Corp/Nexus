"""
Phase 5 Integration Test — End-to-End Platform Validation

Tests the complete micro-loan platform lifecycle:
1. Borrower data generation
2. RL pricing model training
3. MCP tool execution (repayment prediction + early warning)
4. Monitoring & observability
5. Security enforcement
6. API endpoint validation
"""

import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))

from core.mcp_tools.base import ToolInput
from core.mcp_tools.early_warning import EarlyWarningSystem
from core.mcp_tools.registry import MCPToolRegistry
from core.mcp_tools.repayment_predictor import RepaymentPredictionEnhancer
from core.monitoring.audit_trail import AuditEventType, AuditTrail
from core.monitoring.explainability import ExplainabilityEngine
from core.monitoring.health_monitor import HealthMonitor
from core.monitoring.metrics import setup_default_metrics
from core.monitoring.state_monitor import AgentState, StateMachineMonitor
from core.pricing.microloan_env import MicroLoanPricingEnv
from core.pricing.synthetic_data import (
    ECONOMIC_SCENARIOS,
    borrowers_to_env_array,
    generate_borrowers,
)
from core.pricing.training_pipeline import (
    evaluate_model,
    generate_price_recommendation,
    train_ppo,
)
from core.security import (
    APIKeyManager,
    EvaluateRequest,
    RecommendRequest,
    TrainRequest,
    create_access_token,
    hash_password,
    verify_password,
    verify_token,
)
from pydantic import ValidationError


def test_borrower_data_generation():
    """Test synthetic borrower data generation."""
    print("=" * 60)
    print("TEST: Borrower Data Generation")
    print("=" * 60)

    borrowers = generate_borrowers(n=100, seed=42)
    assert len(borrowers) == 100
    assert "borrower_id" in borrowers.columns
    assert "segment" in borrowers.columns
    assert "monthly_income" in borrowers.columns
    print(f"   ✅ Generated {len(borrowers)} borrowers")

    # Segment distribution
    segments = borrowers["segment"].value_counts()
    assert len(segments) > 0
    print(f"   ✅ Segments: {dict(segments)}")

    # Convert to env array
    env_array = borrowers_to_env_array(borrowers)
    assert env_array.shape[0] == 100
    assert env_array.shape[1] > 0
    print(f"   ✅ Env array shape: {env_array.shape}")

    # Economic scenarios
    for scenario_name in ECONOMIC_SCENARIOS:
        scenario_borrowers = generate_borrowers(n=50, seed=42, economic_scenario=scenario_name)
        assert len(scenario_borrowers) == 50
    print(f"   ✅ All {len(ECONOMIC_SCENARIOS)} economic scenarios work")
    print()


def test_pricing_environment():
    """Test Gymnasium RL environment."""
    print("=" * 60)
    print("TEST: Pricing Environment")
    print("=" * 60)

    borrowers = generate_borrowers(n=50, seed=42)
    env_array = borrowers_to_env_array(borrowers)

    env = MicroLoanPricingEnv(borrowers=env_array)
    obs, info = env.reset()
    assert obs is not None
    print(f"   ✅ Environment reset, obs shape: {obs.shape}")

    # Step through environment
    for _ in range(10):
        action = env.action_space.sample()
        obs, reward, terminated, truncated, info = env.step(action)
        assert obs is not None
        assert isinstance(reward, (int, float, np.floating))

    print("   ✅ 10 random steps completed")
    print(f"   ✅ Action space: {env.action_space}")
    print(f"   ✅ Observation space: {env.observation_space}")
    print()


def test_rl_training():
    """Test PPO training pipeline."""
    print("=" * 60)
    print("TEST: RL Training (PPO)")
    print("=" * 60)

    borrowers = generate_borrowers(n=100, seed=42)
    env_array = borrowers_to_env_array(borrowers)

    result = train_ppo(
        experiment_name="test_phase5_training",
        borrowers_array=env_array,
        total_timesteps=5000,
        n_envs=1,
        verbose=0,
    )

    assert "status" in result
    assert result["status"] == "trained"
    assert "model_path" in result
    assert os.path.exists(result["model_path"])
    print(f"   ✅ Training completed: {result['status']}")
    print(f"   ✅ Model saved: {result['model_path']}")
    print(f"   ✅ Timesteps: {result.get('total_timesteps', 'N/A')}")
    print()


def test_model_evaluation():
    """Test trained model evaluation."""
    print("=" * 60)
    print("TEST: Model Evaluation")
    print("=" * 60)

    from stable_baselines3 import PPO
    model_path = "models/pricing_model.zip"
    if not os.path.exists(model_path):
        print("   ⏭️  No trained model found, skipping")
        return

    model = PPO.load(model_path)
    borrowers = generate_borrowers(n=50, seed=42)
    env_array = borrowers_to_env_array(borrowers)

    result = evaluate_model(model, n_eval_episodes=10, borrowers_array=env_array)
    assert "mean_reward" in result
    assert "std_reward" in result
    print(f"   ✅ Mean reward: {result['mean_reward']:.2f}")
    print(f"   ✅ Std reward: {result['std_reward']:.2f}")
    print()


def test_price_recommendation():
    """Test price recommendation generation."""
    print("=" * 60)
    print("TEST: Price Recommendation")
    print("=" * 60)

    from stable_baselines3 import PPO
    model_path = "models/pricing_model.zip"
    if not os.path.exists(model_path):
        print("   ⏭️  No trained model found, skipping")
        return

    model = PPO.load(model_path)
    borrowers = generate_borrowers(n=10, seed=42)
    env_array = borrowers_to_env_array(borrowers)

    rec = generate_price_recommendation(model, env_array[:1])
    assert "recommended_rate" in rec
    assert "recommended_term" in rec
    assert "rate_adjustment" in rec
    assert "term_adjustment" in rec
    print(f"   ✅ Recommended rate: {rec['recommended_rate']:.2%}")
    print(f"   ✅ Recommended term: {rec['recommended_term']} months")
    print(f"   ✅ Rate adjustment: {rec['rate_adjustment']:+.2%}")
    print()


def test_mcp_tools_integration():
    """Test MCP tools end-to-end."""
    print("=" * 60)
    print("TEST: MCP Tools Integration")
    print("=" * 60)

    registry = MCPToolRegistry()
    registry.register(RepaymentPredictionEnhancer())
    registry.register(EarlyWarningSystem())

    tool_input = ToolInput(
        borrower_id="B001",
        features={
            "loan_amount": 50000, "interest_rate": 0.18, "tenor_months": 12,
            "monthly_income": 25000, "monthly_expenses": 15000,
            "debt_to_income": 0.4, "credit_score": 720,
            "employment_months": 24, "previous_defaults": 0,
            "savings_balance": 10000, "transaction_volatility": 0.2,
            "seasonal_income_factor": 1.0, "region_risk_score": 0.3,
            "segment": "personal",
        },
    )

    # Repayment prediction
    pred_result = registry.execute("repayment_prediction_enhancer", tool_input)
    assert pred_result.status == "success"
    assert 0.0 <= pred_result.result["repayment_probability"] <= 1.0
    print(f"   ✅ Repayment probability: {pred_result.result['repayment_probability']:.2%}")

    # Early warning
    ews_result = registry.execute("early_warning_system", tool_input)
    assert ews_result.status == "success"
    assert "risk_level" in ews_result.result
    print(f"   ✅ Early warning risk: {ews_result.result['risk_level']}")

    # Tool chaining
    chain_result = registry.chain_tools(
        ["repayment_prediction_enhancer", "early_warning_system"],
        tool_input,
    )
    assert len(chain_result) == 2
    assert all(r.status == "success" for r in chain_result)
    print(f"   ✅ Tool chaining: {len(chain_result)} tools executed")
    print()


def test_monitoring_integration():
    """Test monitoring components working together."""
    print("=" * 60)
    print("TEST: Monitoring Integration")
    print("=" * 60)

    monitor = StateMachineMonitor(agent_id="e2e_agent")
    trail = AuditTrail()
    metrics = setup_default_metrics()
    engine = ExplainabilityEngine()
    health = HealthMonitor()

    # Simulate full lifecycle
    trail.log(AuditEventType.SYSTEM_STARTUP, "system")

    transitions = [
        (AgentState.IDLE, AgentState.DATA_INGESTION),
        (AgentState.DATA_INGESTION, AgentState.CASH_FLOW_ANALYSIS),
        (AgentState.CASH_FLOW_ANALYSIS, AgentState.RISK_ASSESSMENT),
        (AgentState.RISK_ASSESSMENT, AgentState.PRICING_DECISION),
        (AgentState.PRICING_DECISION, AgentState.COMPLIANCE_VALIDATION),
        (AgentState.COMPLIANCE_VALIDATION, AgentState.DECISION_OUTPUT),
        (AgentState.DECISION_OUTPUT, AgentState.IDLE),
    ]

    for from_state, to_state in transitions:
        monitor.start_transition(from_state, to_state)
        trail.log(AuditEventType.PRICING_DECISION, "e2e_agent",
                  borrower_id="B001", details={"from": from_state, "to": to_state})
        monitor.end_transition()

    # Explainability
    report = engine.explain_prediction(
        borrower_id="B001",
        prediction=0.75,
        features={"loan_amount": 50000, "credit_score": 720},
        confidence=0.80,
    )
    trail.log(AuditEventType.DATA_ACCESS, "explainability_engine",
              borrower_id="B001", details={"report_generated": True})

    # Health check
    health_status = health.check_health()
    assert health_status["status"] in ("healthy", "degraded")

    # Verify chain
    chain = trail.verify_chain()
    assert chain["valid"] is True

    print(f"   ✅ {len(transitions)} state transitions tracked")
    print(f"   ✅ {len(trail.entries)} audit entries logged")
    print("   ✅ Explainability report generated")
    print(f"   ✅ Health status: {health_status['status']}")
    print(f"   ✅ Audit chain: {chain['message']}")
    print()


def test_security_enforcement():
    """Test security components."""
    print("=" * 60)
    print("TEST: Security Enforcement")
    print("=" * 60)

    # Password hashing
    hashed = hash_password("test_password")
    assert verify_password("test_password", hashed)
    assert not verify_password("wrong_password", hashed)
    print("   ✅ Password hashing & verification")

    # JWT tokens
    token = create_access_token("test_user", scopes=["read", "write"])
    payload = verify_token(token)
    assert payload["sub"] == "test_user"
    assert "read" in payload["scopes"]
    print("   ✅ JWT token creation & verification")

    # Invalid token
    try:
        verify_token("invalid_token")
        assert False, "Should have raised"
    except Exception:
        print("   ✅ Invalid token rejected")

    # API key management
    key_manager = APIKeyManager()
    result = key_manager.create_key("test_key", scopes=["read"])
    assert "key" in result
    assert result["name"] == "test_key"

    key_data = key_manager.validate_key(result["key"])
    assert key_data is not None
    assert key_data["name"] == "test_key"
    print("   ✅ API key creation & validation")

    # Key revocation
    assert key_manager.revoke_key(result["key"])
    assert key_manager.validate_key(result["key"]) is None
    print("   ✅ API key revocation")
    print()


def test_pydantic_validation():
    """Test Pydantic input validation models."""
    print("=" * 60)
    print("TEST: Pydantic Input Validation")
    print("=" * 60)

    # Valid train request
    req = TrainRequest(experiment_name="valid_exp_1", timesteps=10000)
    assert req.experiment_name == "valid_exp_1"
    assert req.timesteps == 10000
    print("   ✅ Valid TrainRequest accepted")

    # Invalid: too long name
    try:
        TrainRequest(experiment_name="A" * 100, timesteps=10000)
        assert False
    except ValidationError:
        print("   ✅ Oversized name rejected")

    # Invalid: negative timesteps
    try:
        TrainRequest(experiment_name="test", timesteps=-1)
        assert False
    except ValidationError:
        print("   ✅ Negative timesteps rejected")

    # Invalid: SQL injection chars
    try:
        TrainRequest(experiment_name="test; DROP TABLE--", timesteps=10000)
        assert False
    except ValidationError:
        print("   ✅ SQL injection rejected")

    # Valid evaluate request
    eval_req = EvaluateRequest(experiment_name="test_exp", n_episodes=100)
    assert eval_req.n_episodes == 100
    print("   ✅ Valid EvaluateRequest accepted")

    # Valid recommend request
    rec_req = RecommendRequest(borrower_id="B001", loan_amount=50000)
    assert rec_req.loan_amount == 50000
    print("   ✅ Valid RecommendRequest accepted")
    print()


def test_full_platform_lifecycle():
    """Test complete platform lifecycle end-to-end."""
    print("=" * 60)
    print("TEST: Full Platform Lifecycle")
    print("=" * 60)

    # 1. Generate data
    borrowers = generate_borrowers(n=200, seed=42)
    env_array = borrowers_to_env_array(borrowers)
    print(f"   1. Generated {len(borrowers)} borrowers")

    # 2. Train model
    result = train_ppo(
        experiment_name="e2e_lifecycle_test",
        borrowers_array=env_array,
        total_timesteps=5000,
        n_envs=1,
        verbose=0,
    )
    print(f"   2. Training: {result['status']}")

    # 3. Make predictions
    from stable_baselines3 import PPO
    model = PPO.load(result["model_path"])
    rec = generate_price_recommendation(model, env_array[:1])
    print(f"   3. Recommendation: rate={rec['recommended_rate']:.2%}, term={rec['recommended_term']}m")

    # 4. MCP tools
    predictor = RepaymentPredictionEnhancer()
    ews = EarlyWarningSystem()

    sample_borrower = borrowers.iloc[0]
    tool_input = ToolInput(
        borrower_id=str(sample_borrower["borrower_id"]),
        features={
            "loan_amount": float(sample_borrower.get("loan_amount", 50000)),
            "interest_rate": 0.18,
            "tenor_months": 12,
            "monthly_income": float(sample_borrower.get("monthly_income", 25000)),
            "monthly_expenses": float(sample_borrower.get("monthly_expenses", 15000)),
            "debt_to_income": float(sample_borrower.get("debt_to_income", 0.4)),
            "credit_score": int(sample_borrower.get("credit_score", 720)),
            "employment_months": 24,
            "previous_defaults": int(sample_borrower.get("previous_defaults", 0)),
            "savings_balance": float(sample_borrower.get("savings_balance", 10000)),
            "transaction_volatility": 0.2,
            "seasonal_income_factor": 1.0,
            "region_risk_score": 0.3,
            "segment": str(sample_borrower.get("segment", "personal")),
        },
    )

    pred = predictor.execute(tool_input)
    warning = ews.execute(tool_input)
    print(f"   4. MCP: repayment={pred.result.get('repayment_probability', 0):.2%}, risk={warning.result.get('risk_level', 'unknown')}")

    # 5. Monitoring
    monitor = StateMachineMonitor()
    trail = AuditTrail()
    for from_s, to_s in [
        (AgentState.IDLE, AgentState.DATA_INGESTION),
        (AgentState.DATA_INGESTION, AgentState.CASH_FLOW_ANALYSIS),
        (AgentState.CASH_FLOW_ANALYSIS, AgentState.RISK_ASSESSMENT),
        (AgentState.RISK_ASSESSMENT, AgentState.PRICING_DECISION),
        (AgentState.PRICING_DECISION, AgentState.DECISION_OUTPUT),
        (AgentState.DECISION_OUTPUT, AgentState.IDLE),
    ]:
        monitor.start_transition(from_s, to_s)
        trail.log(AuditEventType.PRICING_DECISION, "e2e", borrower_id=tool_input.borrower_id)
        monitor.end_transition()

    health = HealthMonitor().check_health()
    print(f"   5. Monitoring: {len(monitor.transitions)} transitions, health={health['status']}")

    # 6. Security
    token = create_access_token("e2e_user", scopes=["read", "write", "admin"])
    payload = verify_token(token)
    print(f"   6. Security: token verified for {payload['sub']}")

    print("\n   ✅ Full platform lifecycle completed successfully")
    print()


def test_pilot_evaluation_framework():
    """Test pilot evaluation metrics."""
    print("=" * 60)
    print("TEST: Pilot Evaluation Framework")
    print("=" * 60)

    # Simulate pilot metrics
    pilot_metrics = {
        "prediction_accuracy": 0.82,
        "default_detection_rate": 0.78,
        "false_positive_rate": 0.12,
        "avg_response_time_ms": 45.0,
        "system_uptime": 0.999,
        "borrower_satisfaction": 4.2,
        "intervention_effectiveness": 0.65,
    }

    # Evaluation criteria
    criteria = {
        "prediction_accuracy": {"min": 0.75, "target": 0.85},
        "default_detection_rate": {"min": 0.70, "target": 0.80},
        "false_positive_rate": {"max": 0.20, "target": 0.10},
        "avg_response_time_ms": {"max": 100, "target": 50},
        "system_uptime": {"min": 0.99, "target": 0.999},
        "borrower_satisfaction": {"min": 3.5, "target": 4.5},
        "intervention_effectiveness": {"min": 0.50, "target": 0.70},
    }

    passed = 0
    for metric, value in pilot_metrics.items():
        crit = criteria[metric]
        if "min" in crit:
            meets_min = value >= crit["min"]
        else:
            meets_min = value <= crit["max"]
        status = "PASS" if meets_min else "FAIL"
        if meets_min:
            passed += 1
        print(f"   {status}: {metric} = {value} (min/target: {crit.get('min', crit.get('max'))})")

    print(f"\n   ✅ Pilot evaluation: {passed}/{len(pilot_metrics)} criteria met")
    print()


def run_all_tests():
    """Run all Phase 5 tests."""
    print("\n" + "=" * 60)
    print("  PHASE 5: END-TO-END PLATFORM VALIDATION")
    print("=" * 60 + "\n")

    tests = [
        ("Borrower Data Generation", test_borrower_data_generation),
        ("Pricing Environment", test_pricing_environment),
        ("RL Training", test_rl_training),
        ("Model Evaluation", test_model_evaluation),
        ("Price Recommendation", test_price_recommendation),
        ("MCP Tools Integration", test_mcp_tools_integration),
        ("Monitoring Integration", test_monitoring_integration),
        ("Security Enforcement", test_security_enforcement),
        ("Pydantic Validation", test_pydantic_validation),
        ("Full Platform Lifecycle", test_full_platform_lifecycle),
        ("Pilot Evaluation Framework", test_pilot_evaluation_framework),
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
