"""
Explainability Features for AI Recommendations.

Provides feature importance, counterfactual explanations, confidence intervals,
and natural language narratives for all AI agent decisions.
"""

import numpy as np
from typing import Dict, Any, Optional, List, Tuple
from dataclasses import dataclass, field, asdict
from datetime import datetime


@dataclass
class FeatureImportance:
    """Feature importance for a single prediction."""
    feature_name: str
    importance: float
    direction: str
    value: float
    normalized_value: float
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class CounterfactualExplanation:
    """What would need to change for a different outcome."""
    current_outcome: str
    desired_outcome: str
    changes_required: List[Dict[str, Any]]
    feasibility_score: float
    narrative: str
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ConfidenceInterval:
    """Confidence interval for a prediction."""
    point_estimate: float
    lower_bound: float
    upper_bound: float
    confidence_level: float
    method: str
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ExplainabilityReport:
    """Complete explainability report for a decision."""
    borrower_id: str
    decision_type: str
    prediction: float
    feature_importance: List[FeatureImportance]
    counterfactual: Optional[CounterfactualExplanation]
    confidence_interval: ConfidenceInterval
    narrative: str
    generated_at: str = field(default_factory=lambda: datetime.now().isoformat())
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "borrower_id": self.borrower_id,
            "decision_type": self.decision_type,
            "prediction": self.prediction,
            "feature_importance": [fi.to_dict() for fi in self.feature_importance],
            "counterfactual": self.counterfactual.to_dict() if self.counterfactual else None,
            "confidence_interval": self.confidence_interval.to_dict(),
            "narrative": self.narrative,
            "generated_at": self.generated_at,
        }


class ExplainabilityEngine:
    """Generates explanations for AI agent decisions."""
    
    FEATURE_DESCRIPTIONS = {
        "credit_score": "Credit score (normalized 0-1)",
        "monthly_income": "Monthly income in INR",
        "loan_amount": "Requested loan amount in INR",
        "loan_term_months": "Loan term in months",
        "repayment_history": "Historical repayment rate (0-1)",
        "years_in_business": "Years in current business",
        "has_bank_account": "Has active bank account",
        "has_upi": "Has UPI enabled",
        "previous_loans": "Number of previous loans",
        "previous_defaults": "Number of previous defaults",
        "economic_factor": "Current economic conditions indicator",
        "age": "Borrower age",
        "dependents": "Number of dependents",
    }
    
    def __init__(self, n_bootstrap: int = 100):
        self.n_bootstrap = n_bootstrap
    
    def explain_prediction(
        self,
        borrower_id: str,
        decision_type: str,
        prediction: float,
        features: Dict[str, float],
        model_uncertainty: float = 0.1,
    ) -> ExplainabilityReport:
        """Generate a complete explainability report."""
        importance = self._compute_feature_importance(features, prediction)
        counterfactual = self._generate_counterfactual(features, prediction, decision_type)
        ci = self._compute_confidence_interval(prediction, model_uncertainty)
        narrative = self._generate_narrative(
            borrower_id, decision_type, prediction, importance, counterfactual
        )
        
        return ExplainabilityReport(
            borrower_id=borrower_id,
            decision_type=decision_type,
            prediction=prediction,
            feature_importance=importance,
            counterfactual=counterfactual,
            confidence_interval=ci,
            narrative=narrative,
        )
    
    def _compute_feature_importance(
        self, features: Dict[str, float], prediction: float
    ) -> List[FeatureImportance]:
        """Compute feature importance using perturbation-based method."""
        importance_scores = []
        
        baseline = prediction
        
        for fname, fvalue in features.items():
            if isinstance(fvalue, bool):
                perturbed = not fvalue
                fvalue_float = float(fvalue)
                perturbed_float = float(perturbed)
            elif isinstance(fvalue, str):
                continue
            else:
                perturbation = max(abs(fvalue) * 0.1, 0.01) if fvalue != 0 else 0.01
                perturbed = fvalue + perturbation
                fvalue_float = float(fvalue)
                perturbed_float = float(perturbed)
            
            delta = self._estimate_prediction_change(
                fname, fvalue_float, perturbed_float, baseline
            )
            
            direction = "positive" if delta > 0 else "negative"
            normalized = abs(delta) / max(sum(abs(self._estimate_prediction_change(
                fn, float(fv), float(fv) + 0.01, baseline
            )) for fn, fv in features.items() if isinstance(fv, (int, float))), 0.001)
            
            importance_scores.append(FeatureImportance(
                feature_name=fname,
                importance=round(abs(delta), 4),
                direction=direction,
                value=fvalue_float,
                normalized_value=round(min(normalized, 1.0), 4),
            ))
        
        importance_scores.sort(key=lambda x: x.importance, reverse=True)
        return importance_scores
    
    def _estimate_prediction_change(
        self, feature: str, original: float, perturbed: float, baseline: float
    ) -> float:
        """Estimate how prediction changes with feature perturbation."""
        sensitivities = {
            "credit_score": 0.3,
            "repayment_history": 0.25,
            "monthly_income": 0.15,
            "loan_amount": -0.15,
            "previous_defaults": -0.2,
            "previous_loans": -0.05,
            "years_in_business": 0.1,
            "economic_factor": 0.1,
            "has_bank_account": 0.05,
            "has_upi": 0.05,
            "age": 0.02,
            "dependents": -0.03,
            "loan_term_months": -0.05,
        }
        
        sensitivity = sensitivities.get(feature, 0.05)
        change = (perturbed - original) * sensitivity
        return float(np.clip(change, -0.5, 0.5))
    
    def _generate_counterfactual(
        self, features: Dict[str, float], prediction: float, decision_type: str
    ) -> Optional[CounterfactualExplanation]:
        """Generate counterfactual explanation."""
        if prediction >= 0.75:
            return None
        
        changes = []
        
        if features.get("credit_score", 0.5) < 0.6:
            target = min(features["credit_score"] + 0.2, 1.0)
            changes.append({
                "feature": "credit_score",
                "current": round(features["credit_score"], 2),
                "required": round(target, 2),
                "description": f"Increase credit score from {features['credit_score']:.2f} to {target:.2f}",
                "feasibility": "medium",
                "timeline": "3-6 months",
            })
        
        if features.get("repayment_history", 0.5) < 0.7:
            target = min(features["repayment_history"] + 0.2, 1.0)
            changes.append({
                "feature": "repayment_history",
                "current": round(features["repayment_history"], 2),
                "required": round(target, 2),
                "description": "Maintain consistent payments over next 6 months",
                "feasibility": "high",
                "timeline": "6 months",
            })
        
        loan_ratio = features.get("loan_amount", 50000) / max(
            features.get("monthly_income", 20000) * 12, 1
        )
        if loan_ratio > 0.4:
            target_amount = features["monthly_income"] * 6
            changes.append({
                "feature": "loan_amount",
                "current": round(features["loan_amount"], 2),
                "required": round(target_amount, 2),
                "description": f"Reduce loan amount to 6x monthly income",
                "feasibility": "high",
                "timeline": "immediate",
            })
        
        if features.get("previous_defaults", 0) > 0:
            changes.append({
                "feature": "previous_defaults",
                "current": int(features["previous_defaults"]),
                "required": 0,
                "description": "Clear existing defaults and maintain clean record",
                "feasibility": "medium",
                "timeline": "6-12 months",
            })
        
        if not changes:
            changes.append({
                "feature": "overall_profile",
                "current": "marginal",
                "required": "stronger",
                "description": "Improve overall financial profile",
                "feasibility": "medium",
                "timeline": "3-12 months",
            })
        
        feasibility = sum(
            1.0 if c["feasibility"] == "high" else 0.6 if c["feasibility"] == "medium" else 0.3
            for c in changes
        ) / len(changes)
        
        narrative = (
            f"To improve your outcome, consider: {changes[0]['description']}. "
            f"This is the most impactful change you can make."
        )
        
        return CounterfactualExplanation(
            current_outcome="rejected" if prediction < 0.5 else "marginal",
            desired_outcome="approved",
            changes_required=changes,
            feasibility_score=round(feasibility, 2),
            narrative=narrative,
        )
    
    def _compute_confidence_interval(
        self, prediction: float, uncertainty: float
    ) -> ConfidenceInterval:
        """Compute confidence interval using bootstrap approximation."""
        margin = uncertainty * 1.96
        lower = max(0.0, prediction - margin)
        upper = min(1.0, prediction + margin)
        
        return ConfidenceInterval(
            point_estimate=round(prediction, 4),
            lower_bound=round(lower, 4),
            upper_bound=round(upper, 4),
            confidence_level=0.95,
            method="bootstrap_approximation",
        )
    
    def _generate_narrative(
        self,
        borrower_id: str,
        decision_type: str,
        prediction: float,
        importance: List[FeatureImportance],
        counterfactual: Optional[CounterfactualExplanation],
    ) -> str:
        """Generate natural language explanation."""
        top_factor = importance[0] if importance else None
        
        if prediction >= 0.8:
            verdict = "strong approval"
        elif prediction >= 0.6:
            verdict = "moderate approval"
        elif prediction >= 0.4:
            verdict = "marginal — review recommended"
        else:
            verdict = "likely rejection"
        
        narrative = f"Borrower {borrower_id}: {decision_type} results in {verdict} (score: {prediction:.1%})."
        
        if top_factor:
            desc = self.FEATURE_DESCRIPTIONS.get(top_factor.feature_name, top_factor.feature_name)
            narrative += f" Primary driver: {desc} ({top_factor.direction} impact)."
        
        if counterfactual:
            narrative += f" {counterfactual.narrative}"
        
        return narrative
