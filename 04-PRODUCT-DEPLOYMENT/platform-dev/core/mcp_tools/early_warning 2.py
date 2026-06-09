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

from core.mcp_tools.base import (
    MCPTool,
    ToolInput,
    ToolOutput,
    ToolExplanation,
    ToolCategory,
    ConfidenceLevel,
)


class EarlyWarningSystem(MCPTool):
    """Early default detection with risk scoring and intervention recommendations."""
    
    name = "early_warning_system"
    version = "1.0.0"
    category = ToolCategory.EARLY_WARNING
    description = "Detects potential defaults early using behavioral patterns, transaction anomalies, and economic indicators"
    
    input_schema = {
        "type": "object",
        "properties": {
            "borrower_id": {"type": "string"},
            "features": {
                "type": "object",
                "properties": {
                    "credit_score": {"type": "number"},
                    "monthly_income": {"type": "number"},
                    "loan_amount": {"type": "number"},
                    "repayment_history": {"type": "number"},
                    "previous_defaults": {"type": "integer"},
                    "days_since_last_payment": {"type": "integer"},
                    "payment_trend": {"type": "number"},
                    "income_volatility": {"type": "number"},
                    "economic_factor": {"type": "number"},
                    "seasonal_risk": {"type": "number"},
                    "contact_responsiveness": {"type": "number"},
                    "business_stability": {"type": "number"},
                },
                "required": ["borrower_id", "features"],
            },
        },
    }
    
    output_schema = {
        "type": "object",
        "properties": {
            "default_risk_score": {"type": "number", "minimum": 0, "maximum": 1},
            "risk_level": {"type": "string", "enum": ["green", "yellow", "orange", "red"]},
            "days_to_potential_default": {"type": "integer"},
            "recommended_action": {"type": "string"},
            "intervention_urgency": {"type": "string", "enum": ["none", "monitor", "contact", "escalate"]},
        },
        "required": ["default_risk_score", "risk_level", "recommended_action"],
    }
    
    WARNING_WEIGHTS = {
        "payment_delay": 0.25,
        "repayment_decline": 0.20,
        "previous_defaults": 0.15,
        "income_volatility": 0.10,
        "economic_pressure": 0.10,
        "contact_avoidance": 0.10,
        "business_instability": 0.05,
        "seasonal_risk": 0.05,
    }
    
    def __init__(self, thresholds: Optional[Dict[str, float]] = None):
        self.thresholds = thresholds or {
            "green": 0.25,
            "yellow": 0.50,
            "orange": 0.75,
        }
        self.historical_patterns: Dict[str, List[float]] = {}
    
    def execute(self, tool_input: ToolInput) -> ToolOutput:
        start_time = time.time()
        
        features = tool_input.features
        risk_scores = self._calculate_component_scores(features)
        
        weighted_risk = sum(
            risk_scores[component] * weight
            for component, weight in self.WARNING_WEIGHTS.items()
        )
        
        default_risk = float(np.clip(weighted_risk, 0.0, 1.0))
        risk_level = self._classify_risk_level(default_risk)
        days_to_default = self._estimate_days_to_default(default_risk, features)
        recommended_action = self._recommend_action(risk_level, features)
        intervention_urgency = self._determine_urgency(risk_level)
        
        feature_importance = {
            component: round(score * weight, 4)
            for component, (score, weight) in zip(
                risk_scores.keys(),
                [(risk_scores[c], w) for c, w in self.WARNING_WEIGHTS.items()],
            )
        }
        
        top_factors = self._get_top_warning_factors(risk_scores, features)
        counterfactual = self._generate_intervention_scenarios(features, default_risk)
        
        confidence = self._calculate_confidence(
            prediction_variance=0.1,
            n_features=len([v for v in features.values() if v is not None]),
        )
        
        narrative = self._generate_warning_narrative(
            tool_input.borrower_id, default_risk, risk_level, top_factors
        )
        
        execution_time = (time.time() - start_time) * 1000
        
        explanation = ToolExplanation(
            feature_importance=feature_importance,
            top_factors=top_factors,
            counterfactual=counterfactual,
            narrative=narrative,
        )
        
        return ToolOutput(
            tool_name=self.name,
            tool_version=self.version,
            borrower_id=tool_input.borrower_id,
            result={
                "default_risk_score": round(default_risk, 4),
                "risk_level": risk_level,
                "days_to_potential_default": days_to_default,
                "recommended_action": recommended_action,
                "intervention_urgency": intervention_urgency,
                "component_scores": {k: round(v, 4) for k, v in risk_scores.items()},
            },
            confidence=round(confidence, 4),
            confidence_level=self._get_confidence_level(confidence),
            explanation=explanation,
            execution_time_ms=round(execution_time, 2),
        )
    
    def _calculate_component_scores(self, features: Dict[str, Any]) -> Dict[str, float]:
        scores = {}
        
        days_since = features.get("days_since_last_payment", 0)
        scores["payment_delay"] = float(np.clip(days_since / 30.0, 0, 1))
        
        repayment = features.get("repayment_history", 0.8)
        payment_trend = features.get("payment_trend", 0)
        scores["repayment_decline"] = float(np.clip(
            (1 - repayment) * 0.6 + max(0, -payment_trend) * 0.4, 0, 1
        ))
        
        prev_defaults = features.get("previous_defaults", 0)
        scores["previous_defaults"] = float(np.clip(prev_defaults / 3.0, 0, 1))
        
        income_vol = features.get("income_volatility", 0.2)
        scores["income_volatility"] = float(np.clip(income_vol / 0.5, 0, 1))
        
        economic = features.get("economic_factor", 1.0)
        scores["economic_pressure"] = float(np.clip(max(0, 1.2 - economic) / 0.5, 0, 1))
        
        contact_resp = features.get("contact_responsiveness", 0.8)
        scores["contact_avoidance"] = float(np.clip(1 - contact_resp, 0, 1))
        
        business_stab = features.get("business_stability", 0.7)
        scores["business_instability"] = float(np.clip(1 - business_stab, 0, 1))
        
        seasonal = features.get("seasonal_risk", 0.1)
        scores["seasonal_risk"] = float(np.clip(seasonal, 0, 1))
        
        return scores
    
    def _classify_risk_level(self, risk_score: float) -> str:
        if risk_score < self.thresholds["green"]:
            return "green"
        elif risk_score < self.thresholds["yellow"]:
            return "yellow"
        elif risk_score < self.thresholds["orange"]:
            return "orange"
        else:
            return "red"
    
    def _estimate_days_to_default(self, risk_score: float, features: Dict[str, Any]) -> int:
        if risk_score < 0.25:
            return 365
        elif risk_score < 0.50:
            return int(180 - (risk_score - 0.25) * 400)
        elif risk_score < 0.75:
            return int(60 - (risk_score - 0.50) * 200)
        else:
            days_since = features.get("days_since_last_payment", 0)
            return max(1, 30 - days_since)
    
    def _recommend_action(self, risk_level: str, features: Dict[str, Any]) -> str:
        actions = {
            "green": "Continue standard monitoring. No action required.",
            "yellow": "Increase monitoring frequency. Send gentle payment reminder.",
            "orange": "Contact borrower within 7 days. Offer restructuring options if needed.",
            "red": "Immediate intervention required. Escalate to collections team. Consider loan restructuring.",
        }
        return actions.get(risk_level, "Monitor")
    
    def _determine_urgency(self, risk_level: str) -> str:
        urgency_map = {
            "green": "none",
            "yellow": "monitor",
            "orange": "contact",
            "red": "escalate",
        }
        return urgency_map.get(risk_level, "monitor")
    
    def _get_top_warning_factors(
        self, risk_scores: Dict[str, float], features: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        weighted = {
            comp: score * self.WARNING_WEIGHTS[comp]
            for comp, score in risk_scores.items()
        }
        sorted_factors = sorted(weighted.items(), key=lambda x: x[1], reverse=True)
        
        top = []
        for comp, weighted_score in sorted_factors[:5]:
            raw_score = risk_scores[comp]
            top.append({
                "factor": comp.replace("_", " "),
                "risk_contribution": round(weighted_score, 4),
                "raw_score": round(raw_score, 4),
                "status": "critical" if raw_score > 0.7 else "warning" if raw_score > 0.4 else "normal",
            })
        return top
    
    def _generate_intervention_scenarios(
        self, features: Dict[str, Any], current_risk: float
    ) -> Dict[str, Any]:
        scenarios = {}
        
        if features.get("days_since_last_payment", 0) > 15:
            scenarios["immediate_payment"] = {
                "action": "Request immediate payment of overdue amount",
                "estimated_risk_reduction": "-15-20%",
                "timeline": "Within 48 hours",
            }
        
        if features.get("repayment_history", 0.8) < 0.6:
            scenarios["restructuring"] = {
                "action": "Offer loan restructuring with extended term",
                "estimated_risk_reduction": "-10-15%",
                "timeline": "Within 7 days",
            }
        
        if features.get("contact_responsiveness", 0.8) < 0.5:
            scenarios["field_visit"] = {
                "action": "Schedule field visit to verify business status",
                "estimated_risk_reduction": "-5-10%",
                "timeline": "Within 14 days",
            }
        
        return scenarios if scenarios else {"message": "No immediate interventions needed"}
    
    def _generate_warning_narrative(
        self, borrower_id: str, risk: float, level: str, top_factors: List[Dict]
    ) -> str:
        level_desc = {
            "green": "healthy repayment trajectory",
            "yellow": "early signs of repayment stress",
            "orange": "significant default risk developing",
            "red": "imminent default — urgent action required",
        }
        primary = top_factors[0]["factor"] if top_factors else "multiple factors"
        return (
            f"Warning for {borrower_id}: {level_desc.get(level, 'unknown')}. "
            f"Primary concern: {primary}. Risk score: {risk:.2f}."
        )
    
    def train(
        self,
        features: List[Dict[str, float]],
        labels: List[Any],
        **kwargs,
    ) -> Dict[str, Any]:
        n_samples = len(features)
        n_defaults = sum(1 for label in labels if label == 1)
        default_rate = n_defaults / max(n_samples, 1)
        
        self.historical_patterns = {
            "default_rate": float(default_rate),
            "n_samples": n_samples,
            "n_defaults": n_defaults,
            "last_updated": datetime.now().isoformat(),
        }
        
        return {
            "status": "calibrated",
            "n_samples": n_samples,
            "default_rate": round(default_rate, 4),
            "thresholds": self.thresholds,
        }
    
    def save_state(self, path: str) -> str:
        import json
        from pathlib import Path
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        state = {
            "thresholds": self.thresholds,
            "historical_patterns": self.historical_patterns,
            "name": self.name,
            "version": self.version,
        }
        with open(path, "w") as f:
            json.dump(state, f, indent=2)
        return path
    
    def load_state(self, path: str) -> None:
        import json
        with open(path) as f:
            state = json.load(f)
        self.thresholds = state.get("thresholds", self.thresholds)
        self.historical_patterns = state.get("historical_patterns", {})
