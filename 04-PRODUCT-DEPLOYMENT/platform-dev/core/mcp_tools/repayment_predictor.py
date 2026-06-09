"""
Repayment Prediction Enhancer — MCP Tool.

Uses XGBoost for advanced repayment probability prediction with
SHAP-based feature importance and counterfactual explanations.
"""

import time
import numpy as np
from typing import Dict, Any, Optional, List, Tuple
from pathlib import Path
import joblib
import xgboost as xgb
import shap

from core.mcp_tools.base import (
    MCPTool, ToolInput, ToolOutput, ToolExplanation,
    ToolCategory, ConfidenceLevel, ToolExplanation,
)

FEATURE_NAMES = [
    "loan_amount", "interest_rate", "tenor_months", "monthly_income",
    "monthly_expenses", "debt_to_income", "credit_score", "employment_months",
    "previous_defaults", "savings_balance", "transaction_volatility",
    "seasonal_income_factor", "region_risk_score",
]

SEGMENT_DUMMIES = ["agri", "micro", "sme", "personal", "housing"]
ALL_FEATURES = FEATURE_NAMES + SEGMENT_DUMMIES


class RepaymentPredictionEnhancer(MCPTool):
    """XGBoost-based repayment prediction with SHAP explanations."""

    name = "repayment_prediction_enhancer"
    version = "1.0.0"
    category = ToolCategory.prediction
    description = "Predicts repayment probability using XGBoost with SHAP explanations"

    def __init__(self, model_path: Optional[str] = None):
        self.model: Optional[xgb.XGBClassifier] = None
        self.shap_explainer: Optional[shap.TreeExplainer] = None
        self.model_path = Path(model_path) if model_path else Path("models/repayment_model.pkl")
        self.is_trained = False

    def _prepare_features(self, features: Dict[str, Any]) -> np.ndarray:
        feature_vector = []
        for name in FEATURE_NAMES:
            val = features.get(name, 0.0)
            if isinstance(val, (int, float)):
                feature_vector.append(float(val))
            else:
                feature_vector.append(0.0)

        segment = features.get("segment", "personal")
        for seg in SEGMENT_DUMMIES:
            feature_vector.append(1.0 if seg == segment else 0.0)

        return np.array(feature_vector).reshape(1, -1)

    def execute(self, tool_input: ToolInput) -> ToolOutput:
        start = time.time()
        try:
            X = self._prepare_features(tool_input.features)

            if self.model is not None and self.is_trained:
                proba = self.model.predict_proba(X)[0]
                repayment_prob = float(proba[1])
            else:
                repayment_prob = self._fallback_prediction(tool_input.features)

            confidence = self._calculate_confidence(
                prediction_variance=0.15,
                n_features=len(tool_input.features),
            )
            confidence_level = self._get_confidence_level(confidence)

            shap_values = self._compute_shap(X) if self.shap_explainer else None
            feature_importance = self._shap_to_importance(shap_values) if shap_values is not None else []
            top_factors = self._get_top_factors(feature_importance, n=5)
            counterfactuals = self._generate_counterfactual(X, repayment_prob)
            risk_label = self._classify_risk(repayment_prob)
            narrative = self._generate_narrative(
                repayment_prob, risk_label, top_factors, counterfactuals,
            )

            explanation = ToolExplanation(
                feature_importance=feature_importance,
                top_factors=top_factors,
                counterfactuals=counterfactuals,
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
                    "repayment_probability": repayment_prob,
                    "default_probability": 1.0 - repayment_prob,
                    "risk_level": risk_label,
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

    def _fallback_prediction(self, features: Dict[str, Any]) -> float:
        dti = features.get("debt_to_income", 0.5)
        credit = features.get("credit_score", 650)
        income = features.get("monthly_income", 10000)
        loan = features.get("loan_amount", 50000)
        prev_defaults = features.get("previous_defaults", 0)
        employment = features.get("employment_months", 12)
        savings = features.get("savings_balance", 0)
        volatility = features.get("transaction_volatility", 0.5)
        seasonal = features.get("seasonal_income_factor", 1.0)
        region_risk = features.get("region_risk_score", 0.5)
        rate = features.get("interest_rate", 0.12)
        tenor = features.get("tenor_months", 12)

        dti_score = max(0, 1.0 - dti * 1.5)
        credit_score = min(1.0, max(0, (credit - 300) / 550))
        income_ratio = min(1.0, income / max(loan * 0.1, 1))
        default_penalty = 1.0 - (prev_defaults * 0.2)
        employment_bonus = min(0.2, employment / 120)
        savings_buffer = min(0.15, savings / max(loan * 0.5, 1))
        volatility_penalty = volatility * 0.3
        seasonal_adj = 1.0 - abs(1.0 - seasonal) * 0.2
        region_penalty = region_risk * 0.2
        rate_penalty = rate * 2.0
        tenor_penalty = tenor / 120

        raw = (
            dti_score * 0.20 + credit_score * 0.20 + income_ratio * 0.10
            + default_penalty * 0.15 + employment_bonus + savings_buffer
            - volatility_penalty + seasonal_adj * 0.05 - region_penalty
            - rate_penalty - tenor_penalty
        )

        return max(0.0, min(1.0, 0.5 + raw * 0.5))

    def _compute_shap(self, X: np.ndarray) -> Optional[np.ndarray]:
        if self.shap_explainer is None:
            return None
        return self.shap_explainer.shap_values(X)

    def _shap_to_importance(self, shap_values: np.ndarray) -> List[Dict[str, Any]]:
        importance = []
        abs_values = np.abs(shap_values).mean(axis=0) if shap_values.ndim > 1 else np.abs(shap_values)
        for i, name in enumerate(ALL_FEATURES):
            if i < len(abs_values):
                importance.append({
                    "feature": name,
                    "importance": float(abs_values[i]),
                    "direction": "positive" if shap_values[0, i] > 0 else "negative",
                })
        importance.sort(key=lambda x: x["importance"], reverse=True)
        return importance

    def _get_top_factors(self, importance: List[Dict[str, Any]], n: int = 5) -> List[str]:
        return [f["feature"] for f in importance[:n]]

    def _generate_counterfactual(self, X: np.ndarray, current_prob: float) -> List[Dict[str, Any]]:
        scenarios = []
        if current_prob < 0.7:
            scenarios.append({
                "change": "Increase credit score by 50 points",
                "feature": "credit_score",
                "delta": 50,
                "estimated_impact": "+0.08 repayment probability",
            })
            scenarios.append({
                "change": "Reduce debt-to-income ratio by 10%",
                "feature": "debt_to_income",
                "delta": -0.10,
                "estimated_impact": "+0.05 repayment probability",
            })
        return scenarios

    def _classify_risk(self, prob: float) -> str:
        if prob >= 0.9:
            return "very_low_risk"
        elif prob >= 0.7:
            return "low_risk"
        elif prob >= 0.5:
            return "medium_risk"
        elif prob >= 0.3:
            return "high_risk"
        else:
            return "very_high_risk"

    def _generate_narrative(
        self, prob: float, risk: str, factors: List[str], counterfactuals: List[Dict],
    ) -> str:
        risk_desc = {
            "very_low_risk": "excellent repayment capacity",
            "low_risk": "strong repayment capacity",
            "medium_risk": "moderate repayment capacity",
            "high_risk": "elevated default risk",
            "very_high_risk": "high default risk",
        }
        narrative = f"Borrower shows {risk_desc.get(risk, 'unknown risk')}. "
        if factors:
            narrative += f"Key factors: {', '.join(factors[:3])}. "
        if counterfactuals:
            narrative += f"Improvement: {counterfactuals[0]['change']}. "
        return narrative

    def train(self, features: List[Dict[str, Any]], labels: List[Any], **kwargs) -> Dict[str, Any]:
        start = time.time()
        X = np.array([self._prepare_features(f).flatten() for f in features])
        y = np.array(labels)

        self.model = xgb.XGBClassifier(
            n_estimators=kwargs.get("n_estimators", 100),
            max_depth=kwargs.get("max_depth", 6),
            learning_rate=kwargs.get("learning_rate", 0.1),
            subsample=kwargs.get("subsample", 0.8),
            colsample_bytree=kwargs.get("colsample_bytree", 0.8),
            random_state=kwargs.get("random_state", 42),
            eval_metric="logloss",
            use_label_encoder=False,
        )
        self.model.fit(X, y)
        self.shap_explainer = shap.TreeExplainer(self.model)
        self.is_trained = True

        train_time = time.time() - start
        return {
            "status": "trained",
            "n_samples": len(X),
            "n_features": X.shape[1],
            "training_time_seconds": train_time,
        }

    def save_model(self, path: Optional[str] = None) -> str:
        save_path = Path(path) if path else self.model_path
        save_path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump({
            "model": self.model,
            "shap_explainer": self.shap_explainer,
            "is_trained": self.is_trained,
        }, save_path)
        return str(save_path)

    def load_model(self, path: Optional[str] = None) -> bool:
        load_path = Path(path) if path else self.model_path
        if not load_path.exists():
            return False
        data = joblib.load(load_path)
        self.model = data.get("model")
        self.shap_explainer = data.get("shap_explainer")
        self.is_trained = data.get("is_trained", False)
        return True
