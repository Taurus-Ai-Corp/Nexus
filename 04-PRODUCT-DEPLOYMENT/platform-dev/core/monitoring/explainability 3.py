"""
Explainability Features for AI Recommendations.

Provides feature importance, counterfactual explanations, confidence intervals,
and natural language narratives for all AI agent decisions.
"""

from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Any

import numpy as np


@dataclass
class FeatureImportance:
    feature: str
    importance: float
    direction: str = "neutral"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class CounterfactualExplanation:
    feature: str
    current_value: float
    suggested_value: float
    estimated_impact: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class ConfidenceInterval:
    lower: float
    upper: float
    confidence_level: float = 0.95

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class ExplainabilityReport:
    borrower_id: str = ""
    prediction_value: float = 0.0
    feature_importance: list[FeatureImportance] = field(default_factory=list)
    counterfactuals: list[CounterfactualExplanation] = field(default_factory=list)
    confidence_interval: ConfidenceInterval | None = None
    narrative: str = ""
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> dict[str, Any]:
        return {
            "borrower_id": self.borrower_id,
            "prediction_value": self.prediction_value,
            "feature_importance": [f.to_dict() for f in self.feature_importance],
            "counterfactuals": [c.to_dict() for c in self.counterfactuals],
            "confidence_interval": self.confidence_interval.to_dict() if self.confidence_interval else None,
            "narrative": self.narrative,
            "timestamp": self.timestamp,
        }


class ExplainabilityEngine:
    """Generates explanations for AI predictions."""

    def __init__(self, feature_names: list[str] | None = None):
        self.feature_names = feature_names or []

    def explain_prediction(
        self,
        borrower_id: str,
        prediction: float,
        features: dict[str, Any],
        model=None,
        shap_values: np.ndarray | None = None,
        confidence: float = 0.0,
    ) -> ExplainabilityReport:
        importance = self._compute_feature_importance(features, shap_values)
        counterfactuals = self._generate_counterfactual(features, prediction, importance)
        ci = self._compute_confidence_interval(prediction, confidence)
        narrative = self._generate_narrative(
            prediction, importance, counterfactuals, ci,
        )

        return ExplainabilityReport(
            borrower_id=borrower_id,
            prediction_value=prediction,
            feature_importance=importance,
            counterfactuals=counterfactuals,
            confidence_interval=ci,
            narrative=narrative,
        )

    def _compute_feature_importance(
        self, features: dict[str, Any], shap_values: np.ndarray | None = None,
    ) -> list[FeatureImportance]:
        importance = []
        for i, (name, value) in enumerate(features.items()):
            if isinstance(value, (int, float)):
                shap_val = float(shap_values[0, i]) if shap_values is not None else 0.0
                direction = "positive" if shap_val > 0 else "negative" if shap_val < 0 else "neutral"
                importance.append(FeatureImportance(
                    feature=name,
                    importance=abs(shap_val),
                    direction=direction,
                ))
        importance.sort(key=lambda x: x.importance, reverse=True)
        return importance

    def _estimate_prediction_change(
        self, feature: str, delta: float, current_prediction: float,
    ) -> float:
        sensitivity = 0.1
        return current_prediction + delta * sensitivity

    def _generate_counterfactual(
        self, features: dict[str, Any], prediction: float, importance: list[FeatureImportance],
    ) -> list[CounterfactualExplanation]:
        counterfactuals = []
        for imp in importance[:3]:
            current_val = features.get(imp.feature, 0)
            if isinstance(current_val, (int, float)):
                if imp.direction == "negative":
                    suggested = current_val * 0.9
                    impact = f"+{abs(imp.importance):.2f} to prediction"
                else:
                    suggested = current_val * 1.1
                    impact = f"+{abs(imp.importance):.2f} to prediction"
                counterfactuals.append(CounterfactualExplanation(
                    feature=imp.feature,
                    current_value=float(current_val),
                    suggested_value=float(suggested),
                    estimated_impact=impact,
                ))
        return counterfactuals

    def _compute_confidence_interval(
        self, prediction: float, confidence: float,
    ) -> ConfidenceInterval:
        margin = max(0.01, (1.0 - confidence) * 0.5)
        return ConfidenceInterval(
            lower=max(0.0, prediction - margin),
            upper=min(1.0, prediction + margin),
            confidence_level=confidence,
        )

    def _generate_narrative(
        self,
        prediction: float,
        importance: list[FeatureImportance],
        counterfactuals: list[CounterfactualExplanation],
        ci: ConfidenceInterval | None,
    ) -> str:
        narrative = f"Prediction: {prediction:.2%}. "
        if importance:
            top = importance[0]
            narrative += f"Most influential factor: {top.feature} ({top.direction}). "
        if counterfactuals:
            narrative += f"To improve: {counterfactuals[0].feature} could change from {counterfactuals[0].current_value:.1f} to {counterfactuals[0].suggested_value:.1f}. "
        if ci:
            narrative += f"Confidence interval: [{ci.lower:.2%}, {ci.upper:.2%}] at {ci.confidence_level:.0%} level."
        return narrative
