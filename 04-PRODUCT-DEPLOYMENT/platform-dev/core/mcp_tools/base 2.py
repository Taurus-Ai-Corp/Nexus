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
    PREDICTION = "prediction"
    EARLY_WARNING = "early_warning"
    PRICING = "pricing"
    COMPLIANCE = "compliance"
    ANALYTICS = "analytics"


class ConfidenceLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"


@dataclass
class ToolInput:
    """Standardized input for MCP tools."""
    borrower_id: str
    features: Dict[str, float]
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ToolInput":
        return cls(
            borrower_id=data["borrower_id"],
            features=data["features"],
            metadata=data.get("metadata", {}),
        )


@dataclass
class ToolExplanation:
    """Explanation for tool output (SHAP/LIME style)."""
    feature_importance: Dict[str, float]
    top_factors: List[Dict[str, Any]]
    counterfactual: Optional[Dict[str, Any]] = None
    narrative: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ToolOutput:
    """Standardized output for MCP tools."""
    tool_name: str
    tool_version: str
    borrower_id: str
    result: Dict[str, Any]
    confidence: float
    confidence_level: ConfidenceLevel
    explanation: ToolExplanation
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    execution_time_ms: float = 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "tool_name": self.tool_name,
            "tool_version": self.tool_version,
            "borrower_id": self.borrower_id,
            "result": self.result,
            "confidence": self.confidence,
            "confidence_level": self.confidence_level.value,
            "explanation": self.explanation.to_dict(),
            "timestamp": self.timestamp,
            "execution_time_ms": self.execution_time_ms,
        }
    
    def to_json(self) -> str:
        return json.dumps(self.to_dict(), indent=2)


class MCPTool(ABC):
    """Base class for all MCP tools."""
    
    name: str = "base_tool"
    version: str = "1.0.0"
    category: ToolCategory = ToolCategory.ANALYTICS
    description: str = ""
    input_schema: Dict[str, Any] = {}
    output_schema: Dict[str, Any] = {}
    
    @abstractmethod
    def execute(self, tool_input: ToolInput) -> ToolOutput:
        """Execute the tool and return standardized output."""
        pass
    
    @abstractmethod
    def train(self, features: List[Dict[str, float]], labels: List[Any], **kwargs) -> Dict[str, Any]:
        """Train or update the tool's underlying model."""
        pass
    
    def validate_input(self, tool_input: ToolInput) -> bool:
        """Validate input against the tool's schema."""
        if not tool_input.borrower_id:
            return False
        if not tool_input.features:
            return False
        return True
    
    def _calculate_confidence(self, prediction_variance: float, n_features: int) -> float:
        """Calculate confidence score from prediction variance."""
        import numpy as np
        base_confidence = 1.0 / (1.0 + prediction_variance)
        feature_bonus = min(n_features / 20.0, 0.2)
        return float(np.clip(base_confidence + feature_bonus, 0.0, 1.0))
    
    def _get_confidence_level(self, confidence: float) -> ConfidenceLevel:
        if confidence >= 0.85:
            return ConfidenceLevel.VERY_HIGH
        elif confidence >= 0.70:
            return ConfidenceLevel.HIGH
        elif confidence >= 0.50:
            return ConfidenceLevel.MEDIUM
        else:
            return ConfidenceLevel.LOW
    
    def get_metadata(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "version": self.version,
            "category": self.category.value,
            "description": self.description,
            "input_schema": self.input_schema,
            "output_schema": self.output_schema,
        }
