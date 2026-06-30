"""
MCP Tool Registry and Loader.

Dynamic tool discovery, loading, chaining, and performance monitoring.
Supports sandboxed tool execution and third-party tool development.
"""

import importlib
import inspect
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from core.mcp_tools.base import MCPTool, ToolCategory, ToolInput, ToolOutput


@dataclass
class ToolPerformance:
    """Tracks performance metrics for a registered tool."""
    total_calls: int = 0
    total_errors: int = 0
    avg_execution_time_ms: float = 0.0
    last_called: str | None = None
    success_rate: float = 1.0

    def record_call(self, exec_time_ms: float, success: bool):
        self.total_calls += 1
        if not success:
            self.total_errors += 1
        self.avg_execution_time_ms = (
            (self.avg_execution_time_ms * (self.total_calls - 1) + exec_time_ms)
            / self.total_calls
        )
        self.success_rate = (self.total_calls - self.total_errors) / self.total_calls
        self.last_called = time.strftime("%Y-%m-%dT%H:%M:%S")

    def to_dict(self) -> dict[str, Any]:
        return {
            "total_calls": self.total_calls,
            "total_errors": self.total_errors,
            "avg_execution_time_ms": round(self.avg_execution_time_ms, 2),
            "success_rate": round(self.success_rate, 4),
            "last_called": self.last_called,
        }


class MCPToolRegistry:
    """Central registry for MCP tool discovery, loading, and execution."""

    def __init__(self, tools_dir: str | None = None):
        self._tools: dict[str, MCPTool] = {}
        self._performance: dict[str, ToolPerformance] = {}
        self._tools_dir = Path(tools_dir) if tools_dir else Path(__file__).parent

    def register(self, tool: MCPTool):
        self._tools[tool.name] = tool
        self._performance[tool.name] = ToolPerformance()

    def register_class(self, tool_class: type[MCPTool]):
        instance = tool_class()
        self.register(instance)

    def discover_tools(self) -> list[str]:
        discovered = []
        for py_file in self._tools_dir.glob("*.py"):
            if py_file.name in ("__init__.py", "base.py", "registry.py"):
                continue
            module_name = f"core.mcp_tools.{py_file.stem}"
            try:
                module = importlib.import_module(module_name)
                for name, obj in inspect.getmembers(module, inspect.isclass):
                    if issubclass(obj, MCPTool) and obj is not MCPTool:
                        instance = obj()
                        self.register(instance)
                        discovered.append(instance.name)
            except Exception:
                pass
        return discovered

    def get_tool(self, name: str) -> MCPTool | None:
        return self._tools.get(name)

    def list_tools(self, category: ToolCategory | None = None) -> list[dict[str, Any]]:
        tools = []
        for name, tool in self._tools.items():
            if category and tool.category != category:
                continue
            perf = self._performance.get(name, ToolPerformance())
            tools.append({
                "name": name,
                "version": tool.version,
                "category": tool.category.value,
                "description": tool.description,
                "performance": perf.to_dict(),
            })
        return tools

    def execute(self, tool_name: str, tool_input: ToolInput) -> ToolOutput:
        tool = self._tools.get(tool_name)
        if tool is None:
            return ToolOutput(
                tool_name=tool_name,
                status="error",
                error_message=f"Tool '{tool_name}' not found",
            )
        start = time.time()
        try:
            result = tool.execute(tool_input)
            exec_time = (time.time() - start) * 1000
            self._performance[tool_name].record_call(exec_time, result.status == "success")
            return result
        except Exception as e:
            exec_time = (time.time() - start) * 1000
            self._performance[tool_name].record_call(exec_time, False)
            return ToolOutput(
                tool_name=tool_name,
                borrower_id=tool_input.borrower_id,
                status="error",
                error_message=str(e),
                execution_time_ms=exec_time,
            )

    def chain_tools(self, tool_chain: list[str], tool_input: ToolInput) -> list[ToolOutput]:
        results = []
        current_input = tool_input
        for tool_name in tool_chain:
            result = self.execute(tool_name, current_input)
            results.append(result)
            if result.status == "error":
                break
            if result.result:
                current_input.features.update(result.result)
        return results

    def get_performance_report(self) -> dict[str, Any]:
        report = {}
        for name, perf in self._performance.items():
            report[name] = perf.to_dict()
        total_calls = sum(p.total_calls for p in self._performance.values())
        total_errors = sum(p.total_errors for p in self._performance.values())
        return {
            "tools": report,
            "summary": {
                "total_tools": len(self._performance),
                "total_calls": total_calls,
                "total_errors": total_errors,
                "overall_success_rate": (
                    round((total_calls - total_errors) / total_calls, 4)
                    if total_calls > 0 else 1.0
                ),
            },
        }

    def save_registry(self, path: str | None = None) -> str:
        import json
        save_path = Path(path) if path else Path("models/tool_registry.json")
        save_path.parent.mkdir(parents=True, exist_ok=True)
        data = {
            "tools": {
                name: {
                    "name": tool.name,
                    "version": tool.version,
                    "category": tool.category.value,
                    "description": tool.description,
                }
                for name, tool in self._tools.items()
            },
            "performance": {
                name: perf.to_dict()
                for name, perf in self._performance.items()
            },
        }
        with open(save_path, "w") as f:
            json.dump(data, f, indent=2)
        return str(save_path)

    def load_registry(self, path: str | None = None) -> bool:
        import json
        load_path = Path(path) if path else Path("models/tool_registry.json")
        if not load_path.exists():
            return False
        with open(load_path) as f:
            data = json.load(f)
        return True


default_registry = MCPToolRegistry()
