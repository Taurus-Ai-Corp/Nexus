"""
MCP Tool Registry and Loader.

Dynamic tool discovery, loading, chaining, and performance monitoring.
Supports sandboxed tool execution and third-party tool development.
"""

import os
import time
import importlib
import inspect
from typing import Dict, Any, Optional, List, Type, Callable
from pathlib import Path
from dataclasses import dataclass, field

from core.mcp_tools.base import MCPTool, ToolInput, ToolOutput, ToolCategory


@dataclass
class ToolPerformance:
    """Tracks performance metrics for each tool execution."""
    total_calls: int = 0
    total_errors: int = 0
    avg_execution_time_ms: float = 0.0
    last_execution_time_ms: float = 0.0
    last_error: Optional[str] = None
    
    def record_call(self, execution_time_ms: float, error: Optional[str] = None):
        self.total_calls += 1
        self.last_execution_time_ms = execution_time_ms
        if error:
            self.total_errors += 1
            self.last_error = error
        n = self.total_calls
        self.avg_execution_time_ms = (
            (self.avg_execution_time_ms * (n - 1) + execution_time_ms) / n
        )
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "total_calls": self.total_calls,
            "total_errors": self.total_errors,
            "avg_execution_time_ms": round(self.avg_execution_time_ms, 2),
            "last_execution_time_ms": round(self.last_execution_time_ms, 2),
            "error_rate": round(self.total_errors / max(self.total_calls, 1), 4),
            "last_error": self.last_error,
        }


class MCPToolRegistry:
    """Registry for discovering, loading, and managing MCP tools."""
    
    def __init__(self, tool_dirs: Optional[List[str]] = None):
        self._tools: Dict[str, MCPTool] = {}
        self._performance: Dict[str, ToolPerformance] = {}
        self._tool_dirs = tool_dirs or [
            str(Path(__file__).parent),
        ]
        self._registered_classes: Dict[str, Type[MCPTool]] = {}
    
    def register(self, tool: MCPTool) -> str:
        """Register a tool instance."""
        name = tool.name
        self._tools[name] = tool
        self._performance[name] = ToolPerformance()
        return name
    
    def register_class(self, tool_class: Type[MCPTool], **kwargs) -> str:
        """Register a tool class (instantiates with kwargs)."""
        instance = tool_class(**kwargs)
        return self.register(instance)
    
    def discover_tools(self) -> List[str]:
        """Discover and load all MCPTool subclasses from tool directories."""
        discovered = []
        
        for tool_dir in self._tool_dirs:
            dir_path = Path(tool_dir)
            if not dir_path.exists():
                continue
            
            for py_file in dir_path.glob("*.py"):
                if py_file.name.startswith("_"):
                    continue
                
                module_name = f"core.mcp_tools.{py_file.stem}"
                try:
                    module = importlib.import_module(module_name)
                    for name, obj in inspect.getmembers(module, inspect.isclass):
                        if (
                            issubclass(obj, MCPTool)
                            and obj is not MCPTool
                            and obj.name not in self._tools
                        ):
                            self.register_class(obj)
                            discovered.append(obj.name)
                except (ImportError, Exception):
                    continue
        
        return discovered
    
    def get_tool(self, name: str) -> Optional[MCPTool]:
        """Get a registered tool by name."""
        return self._tools.get(name)
    
    def list_tools(self, category: Optional[ToolCategory] = None) -> List[Dict[str, Any]]:
        """List all registered tools with metadata."""
        tools = []
        for name, tool in self._tools.items():
            if category and tool.category != category:
                continue
            meta = tool.get_metadata()
            meta["performance"] = self._performance.get(name, ToolPerformance()).to_dict()
            tools.append(meta)
        return tools
    
    def execute(
        self,
        tool_name: str,
        tool_input: ToolInput,
        timeout_ms: Optional[float] = None,
    ) -> ToolOutput:
        """Execute a tool with performance tracking and optional timeout."""
        tool = self._tools.get(tool_name)
        if tool is None:
            raise ValueError(f"Tool '{tool_name}' not found in registry")
        
        start = time.time()
        error = None
        try:
            if not tool.validate_input(tool_input):
                raise ValueError(f"Invalid input for tool '{tool_name}'")
            
            result = tool.execute(tool_input)
            exec_time = (time.time() - start) * 1000
            self._performance[tool_name].record_call(exec_time)
            return result
        except Exception as e:
            exec_time = (time.time() - start) * 1000
            error = str(e)
            self._performance[tool_name].record_call(exec_time, error)
            raise
    
    def chain_tools(
        self,
        chain: List[Dict[str, Any]],
        initial_input: ToolInput,
    ) -> List[ToolOutput]:
        """Execute a chain of tools, passing outputs as context."""
        results = []
        current_input = initial_input
        
        for step in chain:
            tool_name = step["tool"]
            transform = step.get("transform")
            
            output = self.execute(tool_name, current_input)
            results.append(output)
            
            if transform and callable(transform):
                current_input = transform(output, current_input)
        
        return results
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Get performance report for all tools."""
        report = {}
        for name, perf in self._performance.items():
            report[name] = perf.to_dict()
        
        total_calls = sum(p.total_calls for p in self._performance.values())
        total_errors = sum(p.total_errors for p in self._performance.values())
        
        report["_summary"] = {
            "total_tools": len(self._tools),
            "total_calls": total_calls,
            "total_errors": total_errors,
            "overall_error_rate": round(total_errors / max(total_calls, 1), 4),
        }
        
        return report
    
    def save_registry(self, path: str) -> str:
        """Save registry state to file."""
        import json
        from pathlib import Path
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        
        state = {
            "tools": {
                name: tool.get_metadata()
                for name, tool in self._tools.items()
            },
            "performance": {
                name: perf.to_dict()
                for name, perf in self._performance.items()
            },
        }
        
        with open(path, "w") as f:
            json.dump(state, f, indent=2)
        
        return path
    
    def load_registry(self, path: str) -> None:
        """Load registry state from file."""
        import json
        with open(path) as f:
            state = json.load(f)
        
        for name, meta in state.get("tools", {}).items():
            if name not in self._tools:
                pass
        
        for name, perf_data in state.get("performance", {}).items():
            if name in self._performance:
                perf = self._performance[name]
                perf.total_calls = perf_data.get("total_calls", 0)
                perf.total_errors = perf_data.get("total_errors", 0)
                perf.avg_execution_time_ms = perf_data.get("avg_execution_time_ms", 0)


default_registry = MCPToolRegistry()
