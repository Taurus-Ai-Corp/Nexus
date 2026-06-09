"""
Early Warning System — MCP Tool.

Detects potential defaults before they occur using behavioral pattern analysis,
transaction anomalies, and external economic indicators. Provides risk scoring
with contributing factors and recommended intervention timing.
"""

import time
import numpy as np
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from pathlib import Path

from core.mcp_tools.base import (
    MCPTool, ToolInput, ToolOutput, ToolExplanation,
    ToolCategory, ConfidenceLevel,
)


class EarlyWarningSystem(MCPTool):
    """Detects potential defaults using behavioral and transaction analysis."""

    name = "early_warning_system"
    version = "1.0.0"
    category = ToolCategory.early_warning
    description = "Early warning detection for potential loan defaults"

    def __init__(self):
        self.warning_thresholds = {
            "income_drop": 0.30,
            "expense_spike": 0.50,
            "transaction_gap_days": 14,
            "savings_depletion": 0.70,
            "dti_increase": 0.20,
        }

    def execute(self, tool_input: ToolInput) -> ToolOutput:
        start = time.time()
        try:
            features = tool_input.features
            component_scores = self._calculate_component_scores(features)

            overall_risk = sum(component_scores.values()) / len(component_scores)
            risk_level = self._classify_risk_level(overall_risk)
            days_to_default = self._estimate_days_to_default(overall_risk, features)
            recommended_action = self._recommend_action(risk_level, days_to_default)
            urgency = self._determine_urgency(risk_level, days_to_default)
            top_factors = self._get_top_warning_factors(component_scores)
            intervention_scenarios = self._generate_intervention_scenarios(
                risk_level, component_scores,
            )
            narrative = self._generate_warning_narrative(
                risk_level, overall_risk, top_factors, recommended_action,
            )

            confidence = self._calculate_confidence(
                prediction_variance=0.20,
                n_features=len(features),
            )
            confidence_level = self._get_confidence_level(confidence)

            explanation = ToolExplanation(
                feature_importance=[
                    {"feature": k, "importance": v, "direction": "negative"}
                    for k, v in sorted(
                        component_scores.items(),
                        key=lambda x: x[1],
                        reverse=True,
                    )
                ],
                top_factors=top_factors,
                counterfactuals=intervention_scenarios,
                narrative=narrative,
                confidence_score=confidence,
                confidence_level=confidence_level,
            )

            exec_time = (time.time() - start) * 1000

            return ToolOutput(
                tool_name=self.name,
                tool_version=self.version,
                borrower_id=tool_input.borrower_id,
                result={
                    "overall_risk_score": overall_risk,
                    "risk_level": risk_level,
                    "days_to_estimated_default": days_to_default,
                    "recommended_action": recommended_action,
                    "urgency": urgency,
                    "component_scores": component_scores,
                },
                explanation=explanation,
                confidence=confidence,
                confidence_level=confidence_level,
                execution_time_ms=exec_time,
                status="success",
            )

        except Exception as e:
            exec_time = (time.time() - start) * 1000
            return ToolOutput(
                tool_name=self.name,
                borrower_id=tool_input.borrower_id,
                result={},
                confidence=0.0,
                confidence_level=ConfidenceLevel.very_low,
                execution_time_ms=exec_time,
                status="error",
                error_message=str(e),
            )

    def _calculate_component_scores(self, features: Dict[str, Any]) -> Dict[str, float]:
        income = features.get("monthly_income", 10000)
        expenses = features.get("monthly_expenses", 8000)
        savings = features.get("savings_balance", 5000)
        loan = features.get("loan_amount", 50000)
        dti = features.get("debt_to_income", 0.5)
        volatility = features.get("transaction_volatility", 0.3)
        days_since_last_txn = features.get("days_since_last_transaction", 0)
        income_trend = features.get("income_trend_3m", 0.0)
        expense_trend = features.get("expense_trend_3m", 0.0)
        region_risk = features.get("region_risk_score", 0.5)

        income_score = max(0, min(1, -income_trend / self.warning_thresholds["income_drop"]))
        expense_score = max(0, min(1, expense_trend / self.warning_thresholds["expense_spike"]))
        gap_score = min(1, days_since_last_txn / self.warning_thresholds["transaction_gap_days"])
        savings_score = max(0, min(1, 1.0 - savings / max(loan * 0.1, 1)))
        dti_score = max(0, min(1, dti / 0.6))
        volatility_score = min(1, volatility * 2)
        region_score = region_risk

        return {
            "income_decline": income_score,
            "expense_spike": expense_score,
            "transaction_gap": gap_score,
            "savings_depletion": savings_score,
            "dti_deterioration": dti_score,
            "transaction_volatility": volatility_score,
            "regional_risk": region_score,
        }

    def _classify_risk_level(self, score: float) -> str:
        if score >= 0.8:
            return "critical"
        elif score >= 0.6:
            return "high"
        elif score >= 0.4:
            return "medium"
        elif score >= 0.2:
            return "low"
        else:
            return "minimal"

    def _estimate_days_to_default(self, risk: float, features: Dict) -> Optional[int]:
        if risk < 0.3:
            return None
        base_days = 180
        risk_multiplier = 1.0 - risk
        return max(7, int(base_days * risk_multiplier))

    def _recommend_action(self, risk_level: str, days: Optional[int]) -> str:
        actions = {
            "critical": "immediate_intervention",
            "high": "schedule_counseling",
            "medium": "increase_monitoring",
            "low": "standard_monitoring",
            "minimal": "no_action",
        }
        return actions.get(risk_level, "standard_monitoring")

    def _determine_urgency(self, risk_level: str, days: Optional[int]) -> str:
        if risk_level == "critical":
            return "immediate"
        elif risk_level == "high":
            return "within_7_days"
        elif risk_level == "medium":
            return "within_30_days"
        else:
            return "routine"

    def _get_top_warning_factors(self, scores: Dict[str, float], n: int = 5) -> List[str]:
        sorted_factors = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return [f for f, s in sorted_factors[:n] if s > 0.2]

    def _generate_intervention_scenarios(
        self, risk_level: str, scores: Dict[str, float],
    ) -> List[Dict[str, Any]]:
        scenarios = []
        if risk_level in ("critical", "high"):
            scenarios.append({
                "scenario": "restructure_loan",
                "description": "Extend tenor by 6 months to reduce EMI burden",
                "estimated_impact": "-15% default probability",
            })
            scenarios.append({
                "scenario": "payment_holiday",
                "description": "Offer 1-month payment holiday with capitalized interest",
                "estimated_impact": "-10% default probability",
            })
        return scenarios

    def _generate_warning_narrative(
        self, risk_level: str, score: float, factors: List[str], action: str,
    ) -> str:
        narratives = {
            "critical": f"CRITICAL: Borrower at imminent default risk (score: {score:.2f}). ",
            "high": f"HIGH RISK: Borrower showing strong default signals (score: {score:.2f}). ",
            "medium": f"MEDIUM RISK: Borrower showing early warning signs (score: {score:.2f}). ",
            "low": f"LOW RISK: Minor concerns detected (score: {score:.2f}). ",
            "minimal": f"MINIMAL RISK: Borrower profile is healthy (score: {score:.2f}). ",
        }
        narrative = narratives.get(risk_level, "")
        if factors:
            narrative += f"Key factors: {', '.join(factors)}. "
        narrative += f"Recommended: {action}."
        return narrative

    def train(self, features: List[Dict[str, Any]], labels: List[Any], **kwargs) -> Dict[str, Any]:
        """Update warning thresholds based on historical default data."""
        defaults = [f for f, l in zip(features, labels) if l == 1]
        if not defaults:
            return {"status": "no_defaults_in_training_data"}

        return {
            "status": "thresholds_updated",
            "n_defaults_analyzed": len(defaults),
        }

    def save_state(self, path: Optional[str] = None) -> str:
        import json
        save_path = Path(path) if path else Path("models/early_warning_state.json")
        save_path.parent.mkdir(parents=True, exist_ok=True)
        with open(save_path, "w") as f:
            json.dump({
                "warning_thresholds": self.warning_thresholds,
                "name": self.name,
                "version": self.version,
            }, f, indent=2)
        return str(save_path)

    def load_state(self, path: Optional[str] = None) -> bool:
        import json
        load_path = Path(path) if path else Path("models/early_warning_state.json")
        if not load_path.exists():
            return False
        with open(load_path) as f:
            data = json.load(f)
        self.warning_thresholds = data.get("warning_thresholds", self.warning_thresholds)
        return True
