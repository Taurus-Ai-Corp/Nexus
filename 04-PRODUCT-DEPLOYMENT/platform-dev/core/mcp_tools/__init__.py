"""
MCP Tools Module.

AI MCP (Model Context Protocol) payoff tools for the micro-loan platform.
Provides standardized prediction, early warning, and analytics capabilities
with SHAP-based explanations and confidence scoring.
"""

from core.mcp_tools.base import (
    MCPTool, ToolInput, ToolOutput, ToolExplanation,
    ToolCategory, ConfidenceLevel,
)
from core.mcp_tools.repayment_predictor import RepaymentPredictionEnhancer
from core.mcp_tools.early_warning import EarlyWarningSystem
from core.mcp_tools.registry import MCPToolRegistry, ToolPerformance, default_registry

__all__ = [
    "MCPTool", "ToolInput", "ToolOutput", "ToolExplanation",
    "ToolCategory", "ConfidenceLevel",
    "RepaymentPredictionEnhancer",
    "EarlyWarningSystem",
    "MCPToolRegistry", "ToolPerformance", "default_registry",
]
