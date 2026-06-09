"""
MCP Tool Interface Standard.

Defines the base class and metadata schema for AI MCP (Model Context Protocol)
payoff tools. Each tool provides standardized input/output formats, explanation,
and confidence scores.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field, asdict
from typing import Dict, Any, Optional, List, Union
from enum import Enum
from datetime import datetime
import json


class ToolCategory(str, Enum):
    prediction = "prediction"
    early_warning = "early_warning"
    pricing = "pricing"
    compliance = "compliance"
    analytics = "analytics"
    reporting = "reporting"
    risk_assessment = "risk_assessment"
    cash_flow = "cash_flow"
    reminder = "reminder"
    data_ingestion = "data_ingestion"


class ConfidenceLevel(str, Enum):
    very_low = "very_low"
    low = "low"
    medium = "medium"
    high = "high"
    very_high = "very_high"


@dataclass
class ToolInput:
    """Standardized input for MCP tools."""
    borrower_id: str
    features: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ToolInput":
        return cls(
            borrower_id=data.get("borrower_id", ""),
            features=data.get("features", {}),
            metadata=data.get("metadata", {}),
        )


@dataclass
class ToolExplanation:
    """Explanation for tool output (SHAP/LIME style)."""
    feature_importance: List[Dict[str, Any]] = field(default_factory=list)
    top_factors: List[str] = field(default_factory=list)
    counterfactuals: List[Dict[str, Any]] = field(default_factory=list)
    narrative: str = ""
    confidence_score: float = 0.0
    confidence_level: ConfidenceLevel = ConfidenceLevel.medium

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ToolOutput:
    """Standardized output for MCP tools."""
    tool_name: str = ""
    tool_version: str = "1.0.0"
    borrower_id: str = ""
    result: Dict[str, Any] = field(default_factory=dict)
    explanation: Optional[ToolExplanation] = None
    confidence: float = 0.0
    confidence_level: ConfidenceLevel = ConfidenceLevel.medium
    execution_time_ms: float = 0.0
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    status: str = "success"
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        return d

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), indent=2)


class MCPTool(ABC):
    """Base class for all MCP tools."""

    name: str = "base_tool"
    version: str = "1.0.0"
    category: ToolCategory = ToolCategory.analytics
    description: str = ""

    @abstractmethod
    def execute(self, tool_input: ToolInput) -> ToolOutput:
        """Execute the tool and return standardized output."""
        pass

    def train(self, features: List[Dict[str, Any]], labels: List[Any], **kwargs) -> Dict[str, Any]:
        """Train or update the tool's underlying model."""
        return {"status": "not_implemented"}

    def validate_input(self, tool_input: ToolInput) -> bool:
        """Validate input against the tool's schema."""
        return bool(tool_input.borrower_id and tool_input.features)

    def _calculate_confidence(self, prediction_variance: float, n_features: int) -> float:
        """Calculate confidence score from prediction variance."""
        if prediction_variance <= 0:
            return 1.0
        base_confidence = max(0.0, 1.0 - prediction_variance)
        feature_bonus = min(0.2, n_features * 0.01)
        return min(1.0, base_confidence + feature_bonus)

    def _get_confidence_level(self, confidence: float) -> ConfidenceLevel:
        if confidence >= 0.9:
            return ConfidenceLevel.very_high
        elif confidence >= 0.7:
            return ConfidenceLevel.high
        elif confidence >= 0.5:
            return ConfidenceLevel.medium
        elif confidence >= 0.3:
            return ConfidenceLevel.low
        else:
            return ConfidenceLevel.very_low

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "version": self.version,
            "category": self.category.value,
            "description": self.description,
        }
