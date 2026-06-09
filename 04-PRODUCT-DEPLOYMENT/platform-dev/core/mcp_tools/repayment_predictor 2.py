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
    MCPTool,
    ToolInput,
    ToolOutput,
    ToolExplanation,
    ToolCategory,
    ConfidenceLevel,
)

FEATURE_NAMES = [
    "credit_score",
    "monthly_income",
    "loan_amount",
    "loan_term_months",
    "repayment_history",
    "years_in_business",
    "has_bank_account",
    "has_upi",
    "previous_loans",
    "previous_defaults",
    "economic_factor",
    "age",
    "dependents",
]

SEGMENT_DUMMIES = [
    "segment_agricultural_worker",
    "segment_gig_worker",
    "segment_service_provider",
    "segment_small_retailer",
    "segment_street_vendor",
]

ALL_FEATURES = FEATURE_NAMES + SEGMENT_DUMMIES


class RepaymentPredictionEnhancer(MCPTool):
    """Advanced repayment prediction using XGBoost + SHAP explanations."""
    
    name = "repayment_prediction_enhancer"
    version = "1.0.0"
    category = ToolCategory.PREDICTION
    description = "Predicts borrower repayment probability with SHAP-based explanations and counterfactual analysis"
    
    input_schema = {
        "type": "object",
        "properties": {
            "borrower_id": {"type": "string"},
            "features": {
                "type": "object",
                "properties": {
                    "credit_score": {"type": "number", "minimum": 0, "maximum": 1},
                    "monthly_income": {"type": "number", "minimum": 0},
                    "loan_amount": {"type": "number", "minimum": 0},
                    "loan_term_months": {"type": "integer", "minimum": 1, "maximum": 60},
                    "repayment_history": {"type": "number", "minimum": 0, "maximum": 1},
                    "years_in_business": {"type": "number", "minimum": 0},
                    "has_bank_account": {"type": "boolean"},
                    "has_upi": {"type": "boolean"},
                    "previous_loans": {"type": "integer", "minimum": 0},
                    "previous_defaults": {"type": "integer", "minimum": 0},
                    "economic_factor": {"type": "number"},
                    "age": {"type": "integer", "minimum": 18, "maximum": 100},
                    "dependents": {"type": "integer", "minimum": 0},
                    "segment": {"type": "string"},
                },
                "required": ["credit_score", "monthly_income", "loan_amount"],
            },
        },
        "required": ["borrower_id", "features"],
    }
    
    output_schema = {
        "type": "object",
        "properties": {
            "repayment_probability": {"type": "number", "minimum": 0, "maximum": 1},
            "default_probability": {"type": "number", "minimum": 0, "maximum": 1},
            "risk_category": {"type": "string", "enum": ["low", "medium", "high", "critical"]},
            "expected_value": {"type": "number"},
            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        },
        "required": ["repayment_probability", "default_probability", "risk_category"],
    }
    
    def __init__(self, model_path: Optional[str] = None):
        self.model: Optional[xgb.XGBClassifier] = None
        self.explainer: Optional[shap.TreeExplainer] = None
        self.is_trained = False
        
        if model_path and Path(model_path).exists():
            self.load_model(model_path)
    
    def _prepare_features(self, tool_input: ToolInput) -> np.ndarray:
        features = tool_input.features
        vec = np.zeros(len(ALL_FEATURES), dtype=np.float32)
        
        for i, fname in enumerate(FEATURE_NAMES):
            val = features.get(fname, 0.0)
            if isinstance(val, bool):
                val = float(val)
            vec[i] = float(val)
        
        segment = features.get("segment", "street_vendor")
        seg_key = f"segment_{segment}"
        if seg_key in SEGMENT_DUMMIES:
            idx = len(FEATURE_NAMES) + SEGMENT_DUMMIES.index(seg_key)
            vec[idx] = 1.0
        
        return vec.reshape(1, -1)
    
    def execute(self, tool_input: ToolInput) -> ToolOutput:
        start_time = time.time()
        
        if not self.is_trained or self.model is None:
            return self._fallback_prediction(tool_input, start_time)
        
        X = self._prepare_features(tool_input)
        proba = self.model.predict_proba(X)[0]
        repayment_prob = float(proba[1])
        default_prob = float(proba[0])
        
        shap_values = self._compute_shap(X)
        feature_importance = self._shap_to_importance(shap_values)
        top_factors = self._get_top_factors(feature_importance, tool_input.features)
        counterfactual = self._generate_counterfactual(tool_input.features, repayment_prob)
        
        confidence = self._calculate_confidence(
            prediction_variance=default_prob * repayment_prob,
            n_features=len([v for v in tool_input.features.values() if v != 0]),
        )
        
        risk_category = self._classify_risk(repayment_prob)
        
        narrative = self._generate_narrative(
            tool_input.borrower_id, repayment_prob, risk_category, top_factors
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
                "repayment_probability": round(repayment_prob, 4),
                "default_probability": round(default_prob, 4),
                "risk_category": risk_category,
                "expected_value": round(repayment_prob * tool_input.features.get("loan_amount", 0), 2),
            },
            confidence=round(confidence, 4),
            confidence_level=self._get_confidence_level(confidence),
            explanation=explanation,
            execution_time_ms=round(execution_time, 2),
        )
    
    def _fallback_prediction(self, tool_input: ToolInput, start_time: float) -> ToolOutput:
        features = tool_input.features
        credit_score = features.get("credit_score", 0.5)
        repayment_history = features.get("repayment_history", 0.5)
        income = features.get("monthly_income", 20000)
        loan_amount = features.get("loan_amount", 50000)
        
        base_prob = 0.3 * credit_score + 0.3 * repayment_history + 0.2 * min(income / 50000, 1)
        loan_ratio = loan_amount / max(income * 12, 1)
        base_prob -= 0.1 * min(loan_ratio, 1)
        
        repayment_prob = float(np.clip(base_prob, 0.1, 0.95))
        default_prob = 1.0 - repayment_prob
        
        confidence = self._calculate_confidence(
            prediction_variance=0.25,
            n_features=len(features),
        )
        
        explanation = ToolExplanation(
            feature_importance={"credit_score": 0.3, "repayment_history": 0.3, "income": 0.2},
            top_factors=[
                {"feature": "credit_score", "impact": 0.3, "value": credit_score},
                {"feature": "repayment_history", "impact": 0.3, "value": repayment_history},
            ],
            narrative="Fallback prediction (model not trained). Using heuristic scoring.",
        )
        
        execution_time = (time.time() - start_time) * 1000
        
        return ToolOutput(
            tool_name=self.name,
            tool_version=self.version,
            borrower_id=tool_input.borrower_id,
            result={
                "repayment_probability": round(repayment_prob, 4),
                "default_probability": round(default_prob, 4),
                "risk_category": self._classify_risk(repayment_prob),
                "expected_value": round(repayment_prob * loan_amount, 2),
                "is_fallback": True,
            },
            confidence=round(confidence, 4),
            confidence_level=self._get_confidence_level(confidence),
            explanation=explanation,
            execution_time_ms=round(execution_time, 2),
        )
    
    def _compute_shap(self, X: np.ndarray) -> np.ndarray:
        if self.explainer is None and self.model is not None:
            self.explainer = shap.TreeExplainer(self.model)
        if self.explainer is not None:
            return self.explainer.shap_values(X)
        return np.zeros((1, len(ALL_FEATURES)))
    
    def _shap_to_importance(self, shap_values: np.ndarray) -> Dict[str, float]:
        importance = {}
        for i, fname in enumerate(ALL_FEATURES):
            importance[fname] = round(float(abs(shap_values[0][i])), 4)
        return importance
    
    def _get_top_factors(
        self, importance: Dict[str, float], features: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        sorted_factors = sorted(importance.items(), key=lambda x: x[1], reverse=True)
        top = []
        for fname, impact in sorted_factors[:5]:
            top.append({
                "feature": fname,
                "impact": impact,
                "value": features.get(fname, 0),
            })
        return top
    
    def _generate_counterfactual(
        self, features: Dict[str, Any], current_prob: float
    ) -> Dict[str, Any]:
        suggestions = {}
        
        if features.get("credit_score", 0.5) < 0.6:
            suggestions["credit_score"] = {
                "current": features["credit_score"],
                "target": min(features["credit_score"] + 0.15, 1.0),
                "impact": "+8-12% repayment probability",
            }
        
        if features.get("previous_defaults", 0) > 0:
            suggestions["payment_consistency"] = {
                "current": f"{features['previous_defaults']} defaults",
                "target": "0 defaults over next 6 months",
                "impact": "+5-10% repayment probability",
            }
        
        loan_ratio = features.get("loan_amount", 50000) / max(
            features.get("monthly_income", 20000) * 12, 1
        )
        if loan_ratio > 0.5:
            suggestions["loan_amount"] = {
                "current": round(features["loan_amount"], 2),
                "target": round(features["monthly_income"] * 6, 2),
                "impact": "+10-15% repayment probability",
            }
        
        return suggestions if suggestions else {"message": "Profile is already optimal"}
    
    def _classify_risk(self, repayment_prob: float) -> str:
        if repayment_prob >= 0.80:
            return "low"
        elif repayment_prob >= 0.60:
            return "medium"
        elif repayment_prob >= 0.40:
            return "high"
        else:
            return "critical"
    
    def _generate_narrative(
        self, borrower_id: str, prob: float, risk: str, top_factors: List[Dict]
    ) -> str:
        risk_desc = {
            "low": "strong repayment likelihood",
            "medium": "moderate repayment likelihood",
            "high": "elevated default risk",
            "critical": "high default risk — intervention recommended",
        }
        top_factor = top_factors[0]["feature"] if top_factors else "overall profile"
        return (
            f"Borrower {borrower_id} shows {risk_desc.get(risk, 'unknown risk')}. "
            f"Primary driver: {top_factor.replace('_', ' ')}. "
            f"Repayment probability: {prob:.1%}."
        )
    
    def train(
        self,
        features: List[Dict[str, float]],
        labels: List[Any],
        **kwargs,
    ) -> Dict[str, Any]:
        import pandas as pd
        
        X = np.zeros((len(features), len(ALL_FEATURES)), dtype=np.float32)
        for i, feat in enumerate(features):
            for j, fname in enumerate(FEATURE_NAMES):
                val = feat.get(fname, 0.0)
                if isinstance(val, bool):
                    val = float(val)
                X[i, j] = float(val)
            
            segment = feat.get("segment", "street_vendor")
            seg_key = f"segment_{segment}"
            if seg_key in SEGMENT_DUMMIES:
                idx = len(FEATURE_NAMES) + SEGMENT_DUMMIES.index(seg_key)
                X[i, idx] = 1.0
        
        y = np.array(labels, dtype=np.int32)
        
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
        self.explainer = shap.TreeExplainer(self.model)
        self.is_trained = True
        
        train_pred = self.model.predict(X)
        accuracy = float(np.mean(train_pred == y))
        
        return {
            "status": "trained",
            "n_samples": len(features),
            "n_features": len(ALL_FEATURES),
            "training_accuracy": round(accuracy, 4),
            "model_type": "XGBoost",
        }
    
    def save_model(self, path: str) -> str:
        if self.model is None:
            raise ValueError("No trained model to save")
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        joblib.dump({"model": self.model, "explainer": self.explainer}, path)
        return path
    
    def load_model(self, path: str) -> None:
        data = joblib.load(path)
        self.model = data["model"]
        self.explainer = data.get("explainer")
        self.is_trained = True
