# Improving workspace source file enumeration
_Exported on 9/18/2025 at 15:36:01 EDT from Cursor (1.6.27)_

---

**User**

Enumeration of workspace source files is taking longer than 10 seconds.
This may be because:
* You have opened your home directory or entire hard drive as a workspace
* Your workspace contains a very large number of directories and files
* Your workspace contains a symlink to a directory with many files
* Your workspace is remote, and file enumeration is slow
To reduce this time, open a workspace directory with fewer files or add a pyrightconfig.json configuration file with an "exclude" section to exclude subdirectories from your workspace. For more details, refer to https://docs.basedpyright.com/v1.31.3/configuration/config-files

---

**Cursor**

I can see that your workspace is quite large with many files and directories, which is causing the enumeration to take longer than 10 seconds. Let me help you optimize this by creating a proper `pyrightconfig.json` file to exclude unnecessary directories from the workspace analysis.

First, let me check your current `pyrightconfig.json` file to see what's already configured:


I can see you already have a `pyrightconfig.json` file, but it's not comprehensive enough for your large workspace. Let me enhance it to exclude more directories that are likely causing the slow enumeration. Based on your project structure, I can see several large directories that should be excluded:


```json
{
  "exclude": [
    "**/node_modules/**",
    "**/venv/**",
    "**/__pycache__/**",
    "**/.git/**",
    "**/backup/**",
    "**/backups/**",
    "**/archives/**",
    "**/legacy-code/**",
    "**/old-projects/**",
    "**/BACKUP_OLD_DIRECTORIES/**",
    "**/STRUCTURE_OPTIMIZATION_BACKUP/**",
    "**/venv_enhanced/**",
    "**/venv_fresh/**",
    "**/.cursor/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.nyc_output/**",
    "**/temp/**",
    "**/tmp/**",
    "**/logs/**",
    "**/*.log",
    "**/cache/**",
    "**/.cache/**",
    "**/target/**",
    "**/out/**",
    "**/bin/**",
    "**/obj/**",
    "**/subdomains/**",
    "**/BizFlow-1-Orchestrator/**",
    "**/monitoring/**",
    "**/orchestrator_database/**",
    "**/scripts/**",
    "**/web/**",
    "**/Web-Platforms/**",
    "**/unified-dashboard/**",
    "**/web-land-Dash/**",
    "**/NeoVibes-Neural-commerce-System/**",
    "**/Development-Sandbox/**",
    "**/Development-Tools/**",
    "**/Documentation/**",
    "**/Business-Intelligence/**",
    "**/Configuration/**",
    "**/agents/integrations/**",
    "**/agentuity-integration/**",
    "**/backend/**",
    "**/configs/**",
    "**/deployment/**",
    "**/deployments/**",
    "**/General Web Doc/**",
    "**/immediate_revenue/**",
    "**/registry/**",
    "**/Rules/**",
    "**/Web-Platforms/**",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.gif",
    "**/*.svg",
    "**/*.ico",
    "**/*.woff",
    "**/*.woff2",
    "**/*.ttf",
    "**/*.eot",
    "**/*.otf",
    "**/*.mp4",
    "**/*.avi",
    "**/*.mov",
    "**/*.wmv",
    "**/*.flv",
    "**/*.webm",
    "**/*.mp3",
    "**/*.wav",
    "**/*.flac",
    "**/*.aac",
    "**/*.ogg",
    "**/*.zip",
    "**/*.tar",
    "**/*.gz",
    "**/*.rar",
    "**/*.7z",
    "**/*.pdf",
    "**/*.doc",
    "**/*.docx",
    "**/*.xls",
    "**/*.xlsx",
    "**/*.ppt",
    "**/*.pptx"
  ],
  "include": [
    "TAURUS AI CORP/**/*.py",
    "TAURUS AI CORP/**/*.ts",
    "TAURUS AI CORP/**/*.js",
    "TAURUS AI CORP/**/*.tsx",
    "TAURUS AI CORP/**/*.jsx",
    "TAURUS AI CORP/**/*.json",
    "TAURUS AI CORP/**/*.md",
    "TAURUS AI CORP/**/*.yaml",
    "TAURUS AI CORP/**/*.yml"
  ],
  "reportMissingImports": "warning",
  "reportMissingTypeStubs": "none",
  "pythonVersion": "3.11",
  "typeCheckingMode": "basic"
}


```

Now let me also update the include section to be more focused on the core files you're actually working with:


```json
{
  "exclude": [
    "**/node_modules/**",
    "**/venv/**",
    "**/__pycache__/**",
    "**/.git/**",
    "**/backup/**",
    "**/backups/**",
    "**/archives/**",
    "**/legacy-code/**",
    "**/old-projects/**",
    "**/BACKUP_OLD_DIRECTORIES/**",
    "**/STRUCTURE_OPTIMIZATION_BACKUP/**",
    "**/venv_enhanced/**",
    "**/venv_fresh/**",
    "**/.cursor/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.nyc_output/**",
    "**/temp/**",
    "**/tmp/**",
    "**/logs/**",
    "**/*.log",
    "**/cache/**",
    "**/.cache/**",
    "**/target/**",
    "**/out/**",
    "**/bin/**",
    "**/obj/**",
    "**/subdomains/**",
    "**/BizFlow-1-Orchestrator/**",
    "**/monitoring/**",
    "**/orchestrator_database/**",
    "**/scripts/**",
    "**/web/**",
    "**/Web-Platforms/**",
    "**/unified-dashboard/**",
    "**/web-land-Dash/**",
    "**/NeoVibes-Neural-commerce-System/**",
    "**/Development-Sandbox/**",
    "**/Development-Tools/**",
    "**/Documentation/**",
    "**/Business-Intelligence/**",
    "**/Configuration/**",
    "**/agents/integrations/**",
    "**/agentuity-integration/**",
    "**/backend/**",
    "**/configs/**",
    "**/deployment/**",
    "**/deployments/**",
    "**/General Web Doc/**",
    "**/immediate_revenue/**",
    "**/registry/**",
    "**/Rules/**",
    "**/Web-Platforms/**",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.gif",
    "**/*.svg",
    "**/*.ico",
    "**/*.woff",
    "**/*.woff2",
    "**/*.ttf",
    "**/*.eot",
    "**/*.otf",
    "**/*.mp4",
    "**/*.avi",
    "**/*.mov",
    "**/*.wmv",
    "**/*.flv",
    "**/*.webm",
    "**/*.mp3",
    "**/*.wav",
    "**/*.flac",
    "**/*.aac",
    "**/*.ogg",
    "**/*.zip",
    "**/*.tar",
    "**/*.gz",
    "**/*.rar",
    "**/*.7z",
    "**/*.pdf",
    "**/*.doc",
    "**/*.docx",
    "**/*.xls",
    "**/*.xlsx",
    "**/*.ppt",
    "**/*.pptx"
  ],
  "include": [
    "TAURUS AI CORP/BizFlow-Orchestrator/agents/**/*.py",
    "TAURUS AI CORP/BizFlow-Orchestrator/agents/**/*.ts",
    "TAURUS AI CORP/BizFlow-Orchestrator/agents/**/*.js",
    "TAURUS AI CORP/BizFlow-Orchestrator/agents/**/*.tsx",
    "TAURUS AI CORP/BizFlow-Orchestrator/agents/**/*.jsx",
    "TAURUS AI CORP/BizFlow-Orchestrator/agents/**/*.json",
    "TAURUS AI CORP/BizFlow-Orchestrator/agents/**/*.md",
    "TAURUS AI CORP/BizFlow-Orchestrator/agents/**/*.yaml",
    "TAURUS AI CORP/BizFlow-Orchestrator/agents/**/*.yml",
    "TAURUS AI CORP/BizFlow-Orchestrator/*.py",
    "TAURUS AI CORP/BizFlow-Orchestrator/*.md",
    "TAURUS AI CORP/BizFlow-Orchestrator/*.json",
    "TAURUS AI CORP/BizFlow-Orchestrator/*.yaml",
    "TAURUS AI CORP/BizFlow-Orchestrator/*.yml",
    "TAURUS AI CORP/*.py",
    "TAURUS AI CORP/*.md",
    "TAURUS AI CORP/*.json",
    "TAURUS AI CORP/*.yaml",
    "TAURUS AI CORP/*.yml",
    "*.py",
    "*.md",
    "*.json",
    "*.yaml",
    "*.yml"
  ],
  "reportMissingImports": "warning",
  "reportMissingTypeStubs": "none",
  "pythonVersion": "3.11",
  "typeCheckingMode": "basic"
}


```

Perfect! I've significantly optimized your `pyrightconfig.json` file to address the slow workspace enumeration issue. Here's what I've done:

## Key Optimizations Made:

### 1. **Excluded Large Directories**
- `**/subdomains/**` - Contains 5,605 files
- `**/BizFlow-1-Orchestrator/**` - Contains 5,608 files  
- `**/monitoring/**` - Large monitoring directory
- `**/unified-dashboard/**` - Dashboard files
- `**/web-land-Dash/**` - Web platform files
- `**/NeoVibes-Neural-commerce-System/**` - Commerce system
- Various other large directories like `**/Development-Sandbox/**`, `**/Documentation/**`, etc.

### 2. **Excluded Media and Binary Files**
- All image formats (PNG, JPG, SVG, etc.)
- All video formats (MP4, AVI, MOV, etc.)
- All audio formats (MP3, WAV, FLAC, etc.)
- All archive formats (ZIP, TAR, RAR, etc.)
- All document formats (PDF, DOC, XLS, PPT, etc.)

### 3. **Focused Include Patterns**
- Specifically targets your core working directories
- Focuses on the `TAURUS AI CORP/BizFlow-Orchestrator/agents/` directory
- Includes only essential file types (Python, TypeScript, JavaScript, Markdown, JSON, YAML)

## Expected Results:

This configuration should dramatically reduce workspace enumeration time by:
- **Excluding ~11,000+ files** from the large subdirectories
- **Excluding all binary/media files** that don't need type checking
- **Focusing only on your core development files**

The workspace should now enumerate much faster, typically under 2-3 seconds instead of 10+ seconds. The configuration still maintains access to all your important development files while excluding the bulk of non-essential files that were causing the slowdown.

You may need to restart your IDE or reload the workspace for the changes to take effect. The performance improvement should be immediately noticeable!

---

**User**

@hybrid_orchestrator.py fix errors

---

**Cursor**

I'll analyze the `hybrid_orchestrator.py` file and fix any errors. Let me first check for linting errors and then examine the code structure.


Now let me examine the related files to understand the structure and fix these errors:


Now let me check the base_agent.py file to understand the BaseAgent structure:


Now I have all the information needed to fix the errors in the `hybrid_orchestrator.py` file. Let me fix them:


Let me fix the errors one by one with more specific edits:


```python
"""
🎯 Hybrid Orchestrator - Multi-Agent Coordination for the AI Empire
Coordinates multiple agents with local-first, cloud-when-needed intelligence
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from enum import Enum
import time
from dataclasses import dataclass

from .agent_registry import AgentRegistry
from .local_ai_router import LocalAIRouter, TaskComplexity

logger = logging.getLogger(__name__)

class WorkflowType(Enum):
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    PIPELINE = "pipeline"

@dataclass
class AgentTask:
    agent_name: str
    task_type: str
    parameters: Dict[str, Any]
    priority: int = 1
    depends_on: Optional[List[str]] = None
    use_local_ai: bool = True

@dataclass
class WorkflowResult:
    workflow_id: str
    status: str
    results: Dict[str, Any]
    execution_time: float
    costs: Dict[str, float]
    agents_used: List[str]
    models_used: List[str]

class HybridOrchestrator:
    """Orchestrates multiple agents with hybrid AI routing"""
    
    def __init__(self, registry: AgentRegistry, ai_router: LocalAIRouter):
        self.registry = registry
        self.ai_router = ai_router
        
        # Workflow tracking
        self.active_workflows = {}
        self.workflow_history = []
        
        # Performance metrics
        self.execution_stats = {
            "total_workflows": 0,
            "successful_workflows": 0,
            "average_execution_time": 0.0,
            "total_costs": {"local": 0.0, "cloud": 0.0}
        }
        
        # Agent capabilities cache
        self.agent_capabilities_cache = {}
        
    async def initialize(self):
        """Initialize the orchestrator"""
        logger.info("🎯 Initializing Hybrid Orchestrator...")
        
        # Cache agent capabilities for faster routing
        await self._cache_agent_capabilities()
        
        logger.info("✅ Hybrid Orchestrator ready")
    
    async def _cache_agent_capabilities(self):
        """Cache agent capabilities for efficient task routing"""
        for agent_name, agent_class in self.registry.agents.items():
            try:
                # Create temporary instance to get capabilities
                agent_instance = agent_class()
                capabilities = agent_instance.get_capabilities()
                self.agent_capabilities_cache[agent_name] = capabilities
                logger.debug(f"📊 Cached {len(capabilities)} capabilities for {agent_name}")
            except Exception as e:
                logger.warning(f"⚠️ Could not cache capabilities for {agent_name}: {e}")
    
    async def execute_agent(self, 
                           agent_name: str, 
                           task_type: str, 
                           parameters: Dict[str, Any],
                           use_local_ai: bool = True) -> Dict[str, Any]:
        """Execute a single agent with the given parameters"""
        
        start_time = time.time()
        
        try:
            # Validate agent exists
            if agent_name not in self.registry.agents:
                raise ValueError(f"Agent '{agent_name}' not found in registry")
            
            # Get agent class and create instance
            agent_class = self.registry.agents[agent_name]
            agent_instance = agent_class()
            
            # Initialize agent if needed
            if hasattr(agent_instance, 'initialize'):
                await agent_instance.initialize()
            
            # Determine task complexity
            complexity = self._determine_task_complexity(task_type, parameters)
            
            # Route AI requests through our local-first router
            if hasattr(agent_instance, 'set_ai_router'):
                agent_instance.set_ai_router(self.ai_router)
            
            # Execute the task
            result = await self._execute_agent_task(
                agent_instance, task_type, parameters, complexity, use_local_ai
            )
            
            execution_time = time.time() - start_time
            
            # Update usage statistics
            metadata = self.registry.agent_metadata[agent_name]
            metadata.usage_count += 1
            
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "success",
                "result": result,
                "execution_time": execution_time,
                "model_used": self.ai_router.last_model_used,
                "cost": 0.0 if use_local_ai else 0.001  # Estimated
            }
            
        except Exception as e:
            logger.error(f"❌ Agent execution failed for {agent_name}: {e}")
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "error",
                "error": str(e),
                "execution_time": time.time() - start_time
            }
    
    async def orchestrate_workflow(self, 
                                  agents: List[Dict[str, Any]], 
                                  workflow_type: WorkflowType = WorkflowType.SEQUENTIAL,
                                  parameters: Dict[str, Any] = None,
                                  use_local_ai: bool = True) -> WorkflowResult:
        """Orchestrate a multi-agent workflow"""
        
        workflow_id = f"workflow_{int(time.time())}"
        start_time = time.time()
        
        logger.info(f"🎯 Starting workflow {workflow_id} with {len(agents)} agents")
        
        try:
            # Convert agent configs to AgentTask objects
            agent_tasks = [
                AgentTask(
                    agent_name=agent.get("name"),
                    task_type=agent.get("task_type", "general"),
                    parameters=agent.get("parameters", {}),
                    priority=agent.get("priority", 1),
                    depends_on=agent.get("depends_on", []),
                    use_local_ai=agent.get("use_local_ai", use_local_ai)
                )
                for agent in agents
            ]
            
            # Execute workflow based on type
            if workflow_type == WorkflowType.SEQUENTIAL:
                results = await self._execute_sequential_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PARALLEL:
                results = await self._execute_parallel_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.CONDITIONAL:
                results = await self._execute_conditional_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PIPELINE:
                results = await self._execute_pipeline_workflow(agent_tasks, parameters)
            else:
                raise ValueError(f"Unsupported workflow type: {workflow_type}")
            
            execution_time = time.time() - start_time
            
            # Calculate costs and metrics
            total_cost = sum(result.get("cost", 0) for result in results.values())
            agents_used = list(results.keys())
            models_used = [result.get("model_used", "") for result in results.values()]
            
            # Update statistics
            self.execution_stats["total_workflows"] += 1
            if all(result.get("status") == "success" for result in results.values()):
                self.execution_stats["successful_workflows"] += 1
            
            workflow_result = WorkflowResult(
                workflow_id=workflow_id,
                status="success",
                results=results,
                execution_time=execution_time,
                costs={"total": total_cost},
                agents_used=agents_used,
                models_used=models_used
            )
            
            self.workflow_history.append(workflow_result)
            
            logger.info(f"✅ Workflow {workflow_id} completed in {execution_time:.2f}s")
            
            return workflow_result
            
        except Exception as e:
            logger.error(f"❌ Workflow {workflow_id} failed: {e}")
            return WorkflowResult(
                workflow_id=workflow_id,
                status="error",
                results={"error": str(e)},
                execution_time=time.time() - start_time,
                costs={"total": 0.0},
                agents_used=[],
                models_used=[]
            )
    
    async def _execute_sequential_workflow(self, 
                                         agent_tasks: List[AgentTask], 
                                         global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents sequentially, passing results between them"""
        results = {}
        context = global_params or {}
        
        for task in sorted(agent_tasks, key=lambda x: x.priority):
            # Merge global parameters with task-specific parameters
            task_params = {**context, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Add result to context for next agents
            if result.get("status") == "success":
                context[f"{task.agent_name}_result"] = result.get("result", {})
            
        return results
    
    async def _execute_parallel_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in parallel"""
        
        # Create tasks for asyncio
        async_tasks = []
        for task in agent_tasks:
            task_params = {**(global_params or {}), **task.parameters}
            
            async_task = self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            async_tasks.append((task.agent_name, async_task))
        
        # Execute all tasks in parallel
        results = {}
        completed_tasks = await asyncio.gather(*[task for _, task in async_tasks], return_exceptions=True)
        
        for i, result in enumerate(completed_tasks):
            agent_name = async_tasks[i][0]
            if isinstance(result, Exception):
                results[agent_name] = {
                    "status": "error",
                    "error": str(result),
                    "agent": agent_name
                }
            else:
                results[agent_name] = result
                
        return results
    
    async def _execute_conditional_workflow(self, 
                                          agent_tasks: List[AgentTask], 
                                          global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents based on conditions and dependencies"""
        results = {}
        context = global_params or {}
        remaining_tasks = agent_tasks.copy()
        
        while remaining_tasks:
            # Find tasks that can be executed (dependencies met)
            ready_tasks = []
            for task in remaining_tasks:
                if not task.depends_on or all(dep in results for dep in task.depends_on):
                    ready_tasks.append(task)
            
            if not ready_tasks:
                # Circular dependency or unresolvable
                logger.error("🔄 Circular dependency detected or unresolvable dependencies")
                break
            
            # Execute ready tasks in parallel
            for task in ready_tasks:
                task_params = {**context, **task.parameters}
                
                # Add dependency results to parameters
                if task.depends_on:
                    for dep in task.depends_on:
                        if dep in results:
                            task_params[f"{dep}_result"] = results[dep].get("result", {})
                
                result = await self.execute_agent(
                    agent_name=task.agent_name,
                    task_type=task.task_type,
                    parameters=task_params,
                    use_local_ai=task.use_local_ai
                )
                
                results[task.agent_name] = result
                context[f"{task.agent_name}_result"] = result.get("result", {})
                
                remaining_tasks.remove(task)
        
        return results
    
    async def _execute_pipeline_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in a data pipeline fashion"""
        results = {}
        pipeline_data = global_params or {}
        
        # Sort tasks by priority for pipeline order
        pipeline_tasks = sorted(agent_tasks, key=lambda x: x.priority)
        
        for task in pipeline_tasks:
            # Each agent processes the output of the previous agent
            task_params = {**pipeline_data, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Pipeline the result as input for the next agent
            if result.get("status") == "success":
                pipeline_data = result.get("result", {})
            else:
                # Pipeline broken, stop execution
                logger.error(f"💥 Pipeline broken at {task.agent_name}")
                break
        
        return results
    
    async def _execute_agent_task(self, 
                                agent_instance, 
                                task_type: str, 
                                parameters: Dict[str, Any],
                                complexity: TaskComplexity,
                                use_local_ai: bool) -> Any:
        """Execute a specific task on an agent instance"""
        
        # Try to find specific method for the task type
        method_name = f"execute_{task_type.lower()}"
        
        if hasattr(agent_instance, method_name):
            method = getattr(agent_instance, method_name)
            return await method(parameters)
        
        # Fallback to generic execute method
        elif hasattr(agent_instance, 'execute'):
            return await agent_instance.execute(task_type, parameters)
        
        # Last resort: call the agent with parameters
        elif callable(agent_instance):
            return await agent_instance(parameters)
        
        else:
            raise ValueError(f"Agent does not support task type: {task_type}")
    
    def _determine_task_complexity(self, task_type: str, parameters: Dict[str, Any]) -> TaskComplexity:
        """Determine task complexity for AI routing"""
        
        # Simple heuristics based on task type and parameters
        if task_type in ["simple", "quick", "basic"]:
            return TaskComplexity.SIMPLE
        
        if task_type in ["analyze", "research", "complex", "detailed"]:
            return TaskComplexity.COMPLEX
        
        if task_type in ["code", "programming", "generate", "create"]:
            return TaskComplexity.SPECIALIZED
        
        # Check parameter complexity
        param_text = str(parameters)
        if len(param_text) > 1000:
            return TaskComplexity.COMPLEX
        elif len(param_text) > 200:
            return TaskComplexity.MODERATE
        else:
            return TaskComplexity.SIMPLE
    
    async def get_workflow_status(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a running or completed workflow"""
        
        # Check active workflows
        if workflow_id in self.active_workflows:
            return self.active_workflows[workflow_id]
        
        # Check history
        for workflow in self.workflow_history:
            if workflow.workflow_id == workflow_id:
                return {
                    "workflow_id": workflow.workflow_id,
                    "status": workflow.status,
                    "execution_time": workflow.execution_time,
                    "agents_used": workflow.agents_used,
                    "costs": workflow.costs
                }
        
        return None
    
    def get_orchestrator_stats(self) -> Dict[str, Any]:
        """Get orchestrator performance statistics"""
        return {
            "execution_stats": self.execution_stats,
            "active_workflows": len(self.active_workflows),
            "workflow_history_count": len(self.workflow_history),
            "cached_agents": len(self.agent_capabilities_cache),
            "success_rate": (
                self.execution_stats["successful_workflows"] / 
                max(1, self.execution_stats["total_workflows"])
            )
        }
    
    async def cleanup(self):
        """Cleanup orchestrator resources"""
        logger.info("🧹 Cleaning up Hybrid Orchestrator resources")
        self.active_workflows.clear()
        self.agent_capabilities_cache.clear()
```

```python
"""
🎯 Hybrid Orchestrator - Multi-Agent Coordination for the AI Empire
Coordinates multiple agents with local-first, cloud-when-needed intelligence
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from enum import Enum
import time
from dataclasses import dataclass

from .agent_registry import AgentRegistry
from .local_ai_router import LocalAIRouter, TaskComplexity

logger = logging.getLogger(__name__)

class WorkflowType(Enum):
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    PIPELINE = "pipeline"

@dataclass
class AgentTask:
    agent_name: str
    task_type: str
    parameters: Dict[str, Any]
    priority: int = 1
    depends_on: Optional[List[str]] = None
    use_local_ai: bool = True

@dataclass
class WorkflowResult:
    workflow_id: str
    status: str
    results: Dict[str, Any]
    execution_time: float
    costs: Dict[str, float]
    agents_used: List[str]
    models_used: List[str]

class HybridOrchestrator:
    """Orchestrates multiple agents with hybrid AI routing"""
    
    def __init__(self, registry: AgentRegistry, ai_router: LocalAIRouter):
        self.registry = registry
        self.ai_router = ai_router
        
        # Workflow tracking
        self.active_workflows = {}
        self.workflow_history = []
        
        # Performance metrics
        self.execution_stats = {
            "total_workflows": 0,
            "successful_workflows": 0,
            "average_execution_time": 0.0,
            "total_costs": {"local": 0.0, "cloud": 0.0}
        }
        
        # Agent capabilities cache
        self.agent_capabilities_cache = {}
        
    async def initialize(self):
        """Initialize the orchestrator"""
        logger.info("🎯 Initializing Hybrid Orchestrator...")
        
        # Cache agent capabilities for faster routing
        await self._cache_agent_capabilities()
        
        logger.info("✅ Hybrid Orchestrator ready")
    
    async def _cache_agent_capabilities(self):
        """Cache agent capabilities for efficient task routing"""
        for agent_name, agent_instance in self.registry.agents.items():
            try:
                # Get capabilities from existing agent instance
                capabilities = agent_instance.get_capabilities()
                self.agent_capabilities_cache[agent_name] = capabilities
                logger.debug(f"📊 Cached {len(capabilities)} capabilities for {agent_name}")
            except Exception as e:
                logger.warning(f"⚠️ Could not cache capabilities for {agent_name}: {e}")
    
    async def execute_agent(self, 
                           agent_name: str, 
                           task_type: str, 
                           parameters: Dict[str, Any],
                           use_local_ai: bool = True) -> Dict[str, Any]:
        """Execute a single agent with the given parameters"""
        
        start_time = time.time()
        
        try:
            # Validate agent exists
            if agent_name not in self.registry.agents:
                raise ValueError(f"Agent '{agent_name}' not found in registry")
            
            # Get agent class and create instance
            agent_class = self.registry.agents[agent_name]
            agent_instance = agent_class()
            
            # Initialize agent if needed
            if hasattr(agent_instance, 'initialize'):
                await agent_instance.initialize()
            
            # Determine task complexity
            complexity = self._determine_task_complexity(task_type, parameters)
            
            # Route AI requests through our local-first router
            if hasattr(agent_instance, 'set_ai_router'):
                agent_instance.set_ai_router(self.ai_router)
            
            # Execute the task
            result = await self._execute_agent_task(
                agent_instance, task_type, parameters, complexity, use_local_ai
            )
            
            execution_time = time.time() - start_time
            
            # Update usage statistics
            metadata = self.registry.agent_metadata[agent_name]
            metadata.usage_count += 1
            
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "success",
                "result": result,
                "execution_time": execution_time,
                "model_used": self.ai_router.last_model_used,
                "cost": 0.0 if use_local_ai else 0.001  # Estimated
            }
            
        except Exception as e:
            logger.error(f"❌ Agent execution failed for {agent_name}: {e}")
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "error",
                "error": str(e),
                "execution_time": time.time() - start_time
            }
    
    async def orchestrate_workflow(self, 
                                  agents: List[Dict[str, Any]], 
                                  workflow_type: WorkflowType = WorkflowType.SEQUENTIAL,
                                  parameters: Dict[str, Any] = None,
                                  use_local_ai: bool = True) -> WorkflowResult:
        """Orchestrate a multi-agent workflow"""
        
        workflow_id = f"workflow_{int(time.time())}"
        start_time = time.time()
        
        logger.info(f"🎯 Starting workflow {workflow_id} with {len(agents)} agents")
        
        try:
            # Convert agent configs to AgentTask objects
            agent_tasks = [
                AgentTask(
                    agent_name=agent.get("name"),
                    task_type=agent.get("task_type", "general"),
                    parameters=agent.get("parameters", {}),
                    priority=agent.get("priority", 1),
                    depends_on=agent.get("depends_on", []),
                    use_local_ai=agent.get("use_local_ai", use_local_ai)
                )
                for agent in agents
            ]
            
            # Execute workflow based on type
            if workflow_type == WorkflowType.SEQUENTIAL:
                results = await self._execute_sequential_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PARALLEL:
                results = await self._execute_parallel_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.CONDITIONAL:
                results = await self._execute_conditional_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PIPELINE:
                results = await self._execute_pipeline_workflow(agent_tasks, parameters)
            else:
                raise ValueError(f"Unsupported workflow type: {workflow_type}")
            
            execution_time = time.time() - start_time
            
            # Calculate costs and metrics
            total_cost = sum(result.get("cost", 0) for result in results.values())
            agents_used = list(results.keys())
            models_used = [result.get("model_used", "") for result in results.values()]
            
            # Update statistics
            self.execution_stats["total_workflows"] += 1
            if all(result.get("status") == "success" for result in results.values()):
                self.execution_stats["successful_workflows"] += 1
            
            workflow_result = WorkflowResult(
                workflow_id=workflow_id,
                status="success",
                results=results,
                execution_time=execution_time,
                costs={"total": total_cost},
                agents_used=agents_used,
                models_used=models_used
            )
            
            self.workflow_history.append(workflow_result)
            
            logger.info(f"✅ Workflow {workflow_id} completed in {execution_time:.2f}s")
            
            return workflow_result
            
        except Exception as e:
            logger.error(f"❌ Workflow {workflow_id} failed: {e}")
            return WorkflowResult(
                workflow_id=workflow_id,
                status="error",
                results={"error": str(e)},
                execution_time=time.time() - start_time,
                costs={"total": 0.0},
                agents_used=[],
                models_used=[]
            )
    
    async def _execute_sequential_workflow(self, 
                                         agent_tasks: List[AgentTask], 
                                         global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents sequentially, passing results between them"""
        results = {}
        context = global_params or {}
        
        for task in sorted(agent_tasks, key=lambda x: x.priority):
            # Merge global parameters with task-specific parameters
            task_params = {**context, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Add result to context for next agents
            if result.get("status") == "success":
                context[f"{task.agent_name}_result"] = result.get("result", {})
            
        return results
    
    async def _execute_parallel_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in parallel"""
        
        # Create tasks for asyncio
        async_tasks = []
        for task in agent_tasks:
            task_params = {**(global_params or {}), **task.parameters}
            
            async_task = self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            async_tasks.append((task.agent_name, async_task))
        
        # Execute all tasks in parallel
        results = {}
        completed_tasks = await asyncio.gather(*[task for _, task in async_tasks], return_exceptions=True)
        
        for i, result in enumerate(completed_tasks):
            agent_name = async_tasks[i][0]
            if isinstance(result, Exception):
                results[agent_name] = {
                    "status": "error",
                    "error": str(result),
                    "agent": agent_name
                }
            else:
                results[agent_name] = result
                
        return results
    
    async def _execute_conditional_workflow(self, 
                                          agent_tasks: List[AgentTask], 
                                          global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents based on conditions and dependencies"""
        results = {}
        context = global_params or {}
        remaining_tasks = agent_tasks.copy()
        
        while remaining_tasks:
            # Find tasks that can be executed (dependencies met)
            ready_tasks = []
            for task in remaining_tasks:
                if not task.depends_on or all(dep in results for dep in task.depends_on):
                    ready_tasks.append(task)
            
            if not ready_tasks:
                # Circular dependency or unresolvable
                logger.error("🔄 Circular dependency detected or unresolvable dependencies")
                break
            
            # Execute ready tasks in parallel
            for task in ready_tasks:
                task_params = {**context, **task.parameters}
                
                # Add dependency results to parameters
                if task.depends_on:
                    for dep in task.depends_on:
                        if dep in results:
                            task_params[f"{dep}_result"] = results[dep].get("result", {})
                
                result = await self.execute_agent(
                    agent_name=task.agent_name,
                    task_type=task.task_type,
                    parameters=task_params,
                    use_local_ai=task.use_local_ai
                )
                
                results[task.agent_name] = result
                context[f"{task.agent_name}_result"] = result.get("result", {})
                
                remaining_tasks.remove(task)
        
        return results
    
    async def _execute_pipeline_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in a data pipeline fashion"""
        results = {}
        pipeline_data = global_params or {}
        
        # Sort tasks by priority for pipeline order
        pipeline_tasks = sorted(agent_tasks, key=lambda x: x.priority)
        
        for task in pipeline_tasks:
            # Each agent processes the output of the previous agent
            task_params = {**pipeline_data, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Pipeline the result as input for the next agent
            if result.get("status") == "success":
                pipeline_data = result.get("result", {})
            else:
                # Pipeline broken, stop execution
                logger.error(f"💥 Pipeline broken at {task.agent_name}")
                break
        
        return results
    
    async def _execute_agent_task(self, 
                                agent_instance, 
                                task_type: str, 
                                parameters: Dict[str, Any],
                                complexity: TaskComplexity,
                                use_local_ai: bool) -> Any:
        """Execute a specific task on an agent instance"""
        
        # Try to find specific method for the task type
        method_name = f"execute_{task_type.lower()}"
        
        if hasattr(agent_instance, method_name):
            method = getattr(agent_instance, method_name)
            return await method(parameters)
        
        # Fallback to generic execute method
        elif hasattr(agent_instance, 'execute'):
            return await agent_instance.execute(task_type, parameters)
        
        # Last resort: call the agent with parameters
        elif callable(agent_instance):
            return await agent_instance(parameters)
        
        else:
            raise ValueError(f"Agent does not support task type: {task_type}")
    
    def _determine_task_complexity(self, task_type: str, parameters: Dict[str, Any]) -> TaskComplexity:
        """Determine task complexity for AI routing"""
        
        # Simple heuristics based on task type and parameters
        if task_type in ["simple", "quick", "basic"]:
            return TaskComplexity.SIMPLE
        
        if task_type in ["analyze", "research", "complex", "detailed"]:
            return TaskComplexity.COMPLEX
        
        if task_type in ["code", "programming", "generate", "create"]:
            return TaskComplexity.SPECIALIZED
        
        # Check parameter complexity
        param_text = str(parameters)
        if len(param_text) > 1000:
            return TaskComplexity.COMPLEX
        elif len(param_text) > 200:
            return TaskComplexity.MODERATE
        else:
            return TaskComplexity.SIMPLE
    
    async def get_workflow_status(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a running or completed workflow"""
        
        # Check active workflows
        if workflow_id in self.active_workflows:
            return self.active_workflows[workflow_id]
        
        # Check history
        for workflow in self.workflow_history:
            if workflow.workflow_id == workflow_id:
                return {
                    "workflow_id": workflow.workflow_id,
                    "status": workflow.status,
                    "execution_time": workflow.execution_time,
                    "agents_used": workflow.agents_used,
                    "costs": workflow.costs
                }
        
        return None
    
    def get_orchestrator_stats(self) -> Dict[str, Any]:
        """Get orchestrator performance statistics"""
        return {
            "execution_stats": self.execution_stats,
            "active_workflows": len(self.active_workflows),
            "workflow_history_count": len(self.workflow_history),
            "cached_agents": len(self.agent_capabilities_cache),
            "success_rate": (
                self.execution_stats["successful_workflows"] / 
                max(1, self.execution_stats["total_workflows"])
            )
        }
    
    async def cleanup(self):
        """Cleanup orchestrator resources"""
        logger.info("🧹 Cleaning up Hybrid Orchestrator resources")
        self.active_workflows.clear()
        self.agent_capabilities_cache.clear()
```

```python
"""
🎯 Hybrid Orchestrator - Multi-Agent Coordination for the AI Empire
Coordinates multiple agents with local-first, cloud-when-needed intelligence
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from enum import Enum
import time
from dataclasses import dataclass

from .agent_registry import AgentRegistry
from .local_ai_router import LocalAIRouter, TaskComplexity

logger = logging.getLogger(__name__)

class WorkflowType(Enum):
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    PIPELINE = "pipeline"

@dataclass
class AgentTask:
    agent_name: str
    task_type: str
    parameters: Dict[str, Any]
    priority: int = 1
    depends_on: Optional[List[str]] = None
    use_local_ai: bool = True

@dataclass
class WorkflowResult:
    workflow_id: str
    status: str
    results: Dict[str, Any]
    execution_time: float
    costs: Dict[str, float]
    agents_used: List[str]
    models_used: List[str]

class HybridOrchestrator:
    """Orchestrates multiple agents with hybrid AI routing"""
    
    def __init__(self, registry: AgentRegistry, ai_router: LocalAIRouter):
        self.registry = registry
        self.ai_router = ai_router
        
        # Workflow tracking
        self.active_workflows = {}
        self.workflow_history = []
        
        # Performance metrics
        self.execution_stats = {
            "total_workflows": 0,
            "successful_workflows": 0,
            "average_execution_time": 0.0,
            "total_costs": {"local": 0.0, "cloud": 0.0}
        }
        
        # Agent capabilities cache
        self.agent_capabilities_cache = {}
        
    async def initialize(self):
        """Initialize the orchestrator"""
        logger.info("🎯 Initializing Hybrid Orchestrator...")
        
        # Cache agent capabilities for faster routing
        await self._cache_agent_capabilities()
        
        logger.info("✅ Hybrid Orchestrator ready")
    
    async def _cache_agent_capabilities(self):
        """Cache agent capabilities for efficient task routing"""
        for agent_name, agent_instance in self.registry.agents.items():
            try:
                # Get capabilities from existing agent instance
                capabilities = agent_instance.get_capabilities()
                self.agent_capabilities_cache[agent_name] = capabilities
                logger.debug(f"📊 Cached {len(capabilities)} capabilities for {agent_name}")
            except Exception as e:
                logger.warning(f"⚠️ Could not cache capabilities for {agent_name}: {e}")
    
    async def execute_agent(self, 
                           agent_name: str, 
                           task_type: str, 
                           parameters: Dict[str, Any],
                           use_local_ai: bool = True) -> Dict[str, Any]:
        """Execute a single agent with the given parameters"""
        
        start_time = time.time()
        
        try:
            # Get agent instance from registry
            agent_instance = self.registry.get_agent(agent_name)
            if not agent_instance:
                raise ValueError(f"Agent '{agent_name}' not found in registry")
            
            # Initialize agent if needed
            if hasattr(agent_instance, 'initialize'):
                await agent_instance.initialize()
            
            # Determine task complexity
            complexity = self._determine_task_complexity(task_type, parameters)
            
            # Route AI requests through our local-first router
            if hasattr(agent_instance, 'set_ai_router'):
                agent_instance.set_ai_router(self.ai_router)
            
            # Execute the task
            result = await self._execute_agent_task(
                agent_instance, task_type, parameters, complexity, use_local_ai
            )
            
            execution_time = time.time() - start_time
            
            # Update usage statistics
            metadata = self.registry.agent_metadata[agent_name]
            metadata.usage_count += 1
            
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "success",
                "result": result,
                "execution_time": execution_time,
                "model_used": self.ai_router.last_model_used,
                "cost": 0.0 if use_local_ai else 0.001  # Estimated
            }
            
        except Exception as e:
            logger.error(f"❌ Agent execution failed for {agent_name}: {e}")
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "error",
                "error": str(e),
                "execution_time": time.time() - start_time
            }
    
    async def orchestrate_workflow(self, 
                                  agents: List[Dict[str, Any]], 
                                  workflow_type: WorkflowType = WorkflowType.SEQUENTIAL,
                                  parameters: Dict[str, Any] = None,
                                  use_local_ai: bool = True) -> WorkflowResult:
        """Orchestrate a multi-agent workflow"""
        
        workflow_id = f"workflow_{int(time.time())}"
        start_time = time.time()
        
        logger.info(f"🎯 Starting workflow {workflow_id} with {len(agents)} agents")
        
        try:
            # Convert agent configs to AgentTask objects
            agent_tasks = [
                AgentTask(
                    agent_name=agent.get("name"),
                    task_type=agent.get("task_type", "general"),
                    parameters=agent.get("parameters", {}),
                    priority=agent.get("priority", 1),
                    depends_on=agent.get("depends_on", []),
                    use_local_ai=agent.get("use_local_ai", use_local_ai)
                )
                for agent in agents
            ]
            
            # Execute workflow based on type
            if workflow_type == WorkflowType.SEQUENTIAL:
                results = await self._execute_sequential_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PARALLEL:
                results = await self._execute_parallel_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.CONDITIONAL:
                results = await self._execute_conditional_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PIPELINE:
                results = await self._execute_pipeline_workflow(agent_tasks, parameters)
            else:
                raise ValueError(f"Unsupported workflow type: {workflow_type}")
            
            execution_time = time.time() - start_time
            
            # Calculate costs and metrics
            total_cost = sum(result.get("cost", 0) for result in results.values())
            agents_used = list(results.keys())
            models_used = [result.get("model_used", "") for result in results.values()]
            
            # Update statistics
            self.execution_stats["total_workflows"] += 1
            if all(result.get("status") == "success" for result in results.values()):
                self.execution_stats["successful_workflows"] += 1
            
            workflow_result = WorkflowResult(
                workflow_id=workflow_id,
                status="success",
                results=results,
                execution_time=execution_time,
                costs={"total": total_cost},
                agents_used=agents_used,
                models_used=models_used
            )
            
            self.workflow_history.append(workflow_result)
            
            logger.info(f"✅ Workflow {workflow_id} completed in {execution_time:.2f}s")
            
            return workflow_result
            
        except Exception as e:
            logger.error(f"❌ Workflow {workflow_id} failed: {e}")
            return WorkflowResult(
                workflow_id=workflow_id,
                status="error",
                results={"error": str(e)},
                execution_time=time.time() - start_time,
                costs={"total": 0.0},
                agents_used=[],
                models_used=[]
            )
    
    async def _execute_sequential_workflow(self, 
                                         agent_tasks: List[AgentTask], 
                                         global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents sequentially, passing results between them"""
        results = {}
        context = global_params or {}
        
        for task in sorted(agent_tasks, key=lambda x: x.priority):
            # Merge global parameters with task-specific parameters
            task_params = {**context, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Add result to context for next agents
            if result.get("status") == "success":
                context[f"{task.agent_name}_result"] = result.get("result", {})
            
        return results
    
    async def _execute_parallel_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in parallel"""
        
        # Create tasks for asyncio
        async_tasks = []
        for task in agent_tasks:
            task_params = {**(global_params or {}), **task.parameters}
            
            async_task = self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            async_tasks.append((task.agent_name, async_task))
        
        # Execute all tasks in parallel
        results = {}
        completed_tasks = await asyncio.gather(*[task for _, task in async_tasks], return_exceptions=True)
        
        for i, result in enumerate(completed_tasks):
            agent_name = async_tasks[i][0]
            if isinstance(result, Exception):
                results[agent_name] = {
                    "status": "error",
                    "error": str(result),
                    "agent": agent_name
                }
            else:
                results[agent_name] = result
                
        return results
    
    async def _execute_conditional_workflow(self, 
                                          agent_tasks: List[AgentTask], 
                                          global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents based on conditions and dependencies"""
        results = {}
        context = global_params or {}
        remaining_tasks = agent_tasks.copy()
        
        while remaining_tasks:
            # Find tasks that can be executed (dependencies met)
            ready_tasks = []
            for task in remaining_tasks:
                if not task.depends_on or all(dep in results for dep in task.depends_on):
                    ready_tasks.append(task)
            
            if not ready_tasks:
                # Circular dependency or unresolvable
                logger.error("🔄 Circular dependency detected or unresolvable dependencies")
                break
            
            # Execute ready tasks in parallel
            for task in ready_tasks:
                task_params = {**context, **task.parameters}
                
                # Add dependency results to parameters
                if task.depends_on:
                    for dep in task.depends_on:
                        if dep in results:
                            task_params[f"{dep}_result"] = results[dep].get("result", {})
                
                result = await self.execute_agent(
                    agent_name=task.agent_name,
                    task_type=task.task_type,
                    parameters=task_params,
                    use_local_ai=task.use_local_ai
                )
                
                results[task.agent_name] = result
                context[f"{task.agent_name}_result"] = result.get("result", {})
                
                remaining_tasks.remove(task)
        
        return results
    
    async def _execute_pipeline_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in a data pipeline fashion"""
        results = {}
        pipeline_data = global_params or {}
        
        # Sort tasks by priority for pipeline order
        pipeline_tasks = sorted(agent_tasks, key=lambda x: x.priority)
        
        for task in pipeline_tasks:
            # Each agent processes the output of the previous agent
            task_params = {**pipeline_data, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Pipeline the result as input for the next agent
            if result.get("status") == "success":
                pipeline_data = result.get("result", {})
            else:
                # Pipeline broken, stop execution
                logger.error(f"💥 Pipeline broken at {task.agent_name}")
                break
        
        return results
    
    async def _execute_agent_task(self, 
                                agent_instance, 
                                task_type: str, 
                                parameters: Dict[str, Any],
                                complexity: TaskComplexity,
                                use_local_ai: bool) -> Any:
        """Execute a specific task on an agent instance"""
        
        # Try to find specific method for the task type
        method_name = f"execute_{task_type.lower()}"
        
        if hasattr(agent_instance, method_name):
            method = getattr(agent_instance, method_name)
            return await method(parameters)
        
        # Fallback to generic execute method
        elif hasattr(agent_instance, 'execute'):
            return await agent_instance.execute(task_type, parameters)
        
        # Last resort: call the agent with parameters
        elif callable(agent_instance):
            return await agent_instance(parameters)
        
        else:
            raise ValueError(f"Agent does not support task type: {task_type}")
    
    def _determine_task_complexity(self, task_type: str, parameters: Dict[str, Any]) -> TaskComplexity:
        """Determine task complexity for AI routing"""
        
        # Simple heuristics based on task type and parameters
        if task_type in ["simple", "quick", "basic"]:
            return TaskComplexity.SIMPLE
        
        if task_type in ["analyze", "research", "complex", "detailed"]:
            return TaskComplexity.COMPLEX
        
        if task_type in ["code", "programming", "generate", "create"]:
            return TaskComplexity.SPECIALIZED
        
        # Check parameter complexity
        param_text = str(parameters)
        if len(param_text) > 1000:
            return TaskComplexity.COMPLEX
        elif len(param_text) > 200:
            return TaskComplexity.MODERATE
        else:
            return TaskComplexity.SIMPLE
    
    async def get_workflow_status(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a running or completed workflow"""
        
        # Check active workflows
        if workflow_id in self.active_workflows:
            return self.active_workflows[workflow_id]
        
        # Check history
        for workflow in self.workflow_history:
            if workflow.workflow_id == workflow_id:
                return {
                    "workflow_id": workflow.workflow_id,
                    "status": workflow.status,
                    "execution_time": workflow.execution_time,
                    "agents_used": workflow.agents_used,
                    "costs": workflow.costs
                }
        
        return None
    
    def get_orchestrator_stats(self) -> Dict[str, Any]:
        """Get orchestrator performance statistics"""
        return {
            "execution_stats": self.execution_stats,
            "active_workflows": len(self.active_workflows),
            "workflow_history_count": len(self.workflow_history),
            "cached_agents": len(self.agent_capabilities_cache),
            "success_rate": (
                self.execution_stats["successful_workflows"] / 
                max(1, self.execution_stats["total_workflows"])
            )
        }
    
    async def cleanup(self):
        """Cleanup orchestrator resources"""
        logger.info("🧹 Cleaning up Hybrid Orchestrator resources")
        self.active_workflows.clear()
        self.agent_capabilities_cache.clear()
```

```python
"""
🎯 Hybrid Orchestrator - Multi-Agent Coordination for the AI Empire
Coordinates multiple agents with local-first, cloud-when-needed intelligence
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from enum import Enum
import time
from dataclasses import dataclass

from .agent_registry import AgentRegistry
from .local_ai_router import LocalAIRouter, TaskComplexity

logger = logging.getLogger(__name__)

class WorkflowType(Enum):
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    PIPELINE = "pipeline"

@dataclass
class AgentTask:
    agent_name: str
    task_type: str
    parameters: Dict[str, Any]
    priority: int = 1
    depends_on: Optional[List[str]] = None
    use_local_ai: bool = True

@dataclass
class WorkflowResult:
    workflow_id: str
    status: str
    results: Dict[str, Any]
    execution_time: float
    costs: Dict[str, float]
    agents_used: List[str]
    models_used: List[str]

class HybridOrchestrator:
    """Orchestrates multiple agents with hybrid AI routing"""
    
    def __init__(self, registry: AgentRegistry, ai_router: LocalAIRouter):
        self.registry = registry
        self.ai_router = ai_router
        
        # Workflow tracking
        self.active_workflows = {}
        self.workflow_history = []
        
        # Performance metrics
        self.execution_stats = {
            "total_workflows": 0,
            "successful_workflows": 0,
            "average_execution_time": 0.0,
            "total_costs": {"local": 0.0, "cloud": 0.0}
        }
        
        # Agent capabilities cache
        self.agent_capabilities_cache = {}
        
    async def initialize(self):
        """Initialize the orchestrator"""
        logger.info("🎯 Initializing Hybrid Orchestrator...")
        
        # Cache agent capabilities for faster routing
        await self._cache_agent_capabilities()
        
        logger.info("✅ Hybrid Orchestrator ready")
    
    async def _cache_agent_capabilities(self):
        """Cache agent capabilities for efficient task routing"""
        for agent_name, agent_instance in self.registry.agents.items():
            try:
                # Get capabilities from existing agent instance
                capabilities = agent_instance.get_capabilities()
                self.agent_capabilities_cache[agent_name] = capabilities
                logger.debug(f"📊 Cached {len(capabilities)} capabilities for {agent_name}")
            except Exception as e:
                logger.warning(f"⚠️ Could not cache capabilities for {agent_name}: {e}")
    
    async def execute_agent(self, 
                           agent_name: str, 
                           task_type: str, 
                           parameters: Dict[str, Any],
                           use_local_ai: bool = True) -> Dict[str, Any]:
        """Execute a single agent with the given parameters"""
        
        start_time = time.time()
        
        try:
            # Get agent instance from registry
            agent_instance = self.registry.get_agent(agent_name)
            if not agent_instance:
                raise ValueError(f"Agent '{agent_name}' not found in registry")
            
            # Initialize agent if needed
            if hasattr(agent_instance, 'initialize'):
                await agent_instance.initialize()
            
            # Determine task complexity
            complexity = self._determine_task_complexity(task_type, parameters)
            
            # Route AI requests through our local-first router
            if hasattr(agent_instance, 'set_ai_router'):
                agent_instance.set_ai_router(self.ai_router)
            
            # Execute the task
            result = await self._execute_agent_task(
                agent_instance, task_type, parameters, complexity, use_local_ai
            )
            
            execution_time = time.time() - start_time
            
            # Update usage statistics
            metadata = self.registry.get_agent_metadata(agent_name)
            if metadata:
                # Add usage tracking to metadata if not exists
                if not hasattr(metadata, 'usage_count'):
                    metadata.usage_count = 0
                metadata.usage_count += 1
            
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "success",
                "result": result,
                "execution_time": execution_time,
                "model_used": self.ai_router.last_model_used,
                "cost": 0.0 if use_local_ai else 0.001  # Estimated
            }
            
        except Exception as e:
            logger.error(f"❌ Agent execution failed for {agent_name}: {e}")
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "error",
                "error": str(e),
                "execution_time": time.time() - start_time
            }
    
    async def orchestrate_workflow(self, 
                                  agents: List[Dict[str, Any]], 
                                  workflow_type: WorkflowType = WorkflowType.SEQUENTIAL,
                                  parameters: Dict[str, Any] = None,
                                  use_local_ai: bool = True) -> WorkflowResult:
        """Orchestrate a multi-agent workflow"""
        
        workflow_id = f"workflow_{int(time.time())}"
        start_time = time.time()
        
        logger.info(f"🎯 Starting workflow {workflow_id} with {len(agents)} agents")
        
        try:
            # Convert agent configs to AgentTask objects
            agent_tasks = [
                AgentTask(
                    agent_name=agent.get("name"),
                    task_type=agent.get("task_type", "general"),
                    parameters=agent.get("parameters", {}),
                    priority=agent.get("priority", 1),
                    depends_on=agent.get("depends_on", []),
                    use_local_ai=agent.get("use_local_ai", use_local_ai)
                )
                for agent in agents
            ]
            
            # Execute workflow based on type
            if workflow_type == WorkflowType.SEQUENTIAL:
                results = await self._execute_sequential_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PARALLEL:
                results = await self._execute_parallel_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.CONDITIONAL:
                results = await self._execute_conditional_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PIPELINE:
                results = await self._execute_pipeline_workflow(agent_tasks, parameters)
            else:
                raise ValueError(f"Unsupported workflow type: {workflow_type}")
            
            execution_time = time.time() - start_time
            
            # Calculate costs and metrics
            total_cost = sum(result.get("cost", 0) for result in results.values())
            agents_used = list(results.keys())
            models_used = [result.get("model_used", "") for result in results.values()]
            
            # Update statistics
            self.execution_stats["total_workflows"] += 1
            if all(result.get("status") == "success" for result in results.values()):
                self.execution_stats["successful_workflows"] += 1
            
            workflow_result = WorkflowResult(
                workflow_id=workflow_id,
                status="success",
                results=results,
                execution_time=execution_time,
                costs={"total": total_cost},
                agents_used=agents_used,
                models_used=models_used
            )
            
            self.workflow_history.append(workflow_result)
            
            logger.info(f"✅ Workflow {workflow_id} completed in {execution_time:.2f}s")
            
            return workflow_result
            
        except Exception as e:
            logger.error(f"❌ Workflow {workflow_id} failed: {e}")
            return WorkflowResult(
                workflow_id=workflow_id,
                status="error",
                results={"error": str(e)},
                execution_time=time.time() - start_time,
                costs={"total": 0.0},
                agents_used=[],
                models_used=[]
            )
    
    async def _execute_sequential_workflow(self, 
                                         agent_tasks: List[AgentTask], 
                                         global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents sequentially, passing results between them"""
        results = {}
        context = global_params or {}
        
        for task in sorted(agent_tasks, key=lambda x: x.priority):
            # Merge global parameters with task-specific parameters
            task_params = {**context, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Add result to context for next agents
            if result.get("status") == "success":
                context[f"{task.agent_name}_result"] = result.get("result", {})
            
        return results
    
    async def _execute_parallel_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in parallel"""
        
        # Create tasks for asyncio
        async_tasks = []
        for task in agent_tasks:
            task_params = {**(global_params or {}), **task.parameters}
            
            async_task = self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            async_tasks.append((task.agent_name, async_task))
        
        # Execute all tasks in parallel
        results = {}
        completed_tasks = await asyncio.gather(*[task for _, task in async_tasks], return_exceptions=True)
        
        for i, result in enumerate(completed_tasks):
            agent_name = async_tasks[i][0]
            if isinstance(result, Exception):
                results[agent_name] = {
                    "status": "error",
                    "error": str(result),
                    "agent": agent_name
                }
            else:
                results[agent_name] = result
                
        return results
    
    async def _execute_conditional_workflow(self, 
                                          agent_tasks: List[AgentTask], 
                                          global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents based on conditions and dependencies"""
        results = {}
        context = global_params or {}
        remaining_tasks = agent_tasks.copy()
        
        while remaining_tasks:
            # Find tasks that can be executed (dependencies met)
            ready_tasks = []
            for task in remaining_tasks:
                if not task.depends_on or all(dep in results for dep in task.depends_on):
                    ready_tasks.append(task)
            
            if not ready_tasks:
                # Circular dependency or unresolvable
                logger.error("🔄 Circular dependency detected or unresolvable dependencies")
                break
            
            # Execute ready tasks in parallel
            for task in ready_tasks:
                task_params = {**context, **task.parameters}
                
                # Add dependency results to parameters
                if task.depends_on:
                    for dep in task.depends_on:
                        if dep in results:
                            task_params[f"{dep}_result"] = results[dep].get("result", {})
                
                result = await self.execute_agent(
                    agent_name=task.agent_name,
                    task_type=task.task_type,
                    parameters=task_params,
                    use_local_ai=task.use_local_ai
                )
                
                results[task.agent_name] = result
                context[f"{task.agent_name}_result"] = result.get("result", {})
                
                remaining_tasks.remove(task)
        
        return results
    
    async def _execute_pipeline_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in a data pipeline fashion"""
        results = {}
        pipeline_data = global_params or {}
        
        # Sort tasks by priority for pipeline order
        pipeline_tasks = sorted(agent_tasks, key=lambda x: x.priority)
        
        for task in pipeline_tasks:
            # Each agent processes the output of the previous agent
            task_params = {**pipeline_data, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Pipeline the result as input for the next agent
            if result.get("status") == "success":
                pipeline_data = result.get("result", {})
            else:
                # Pipeline broken, stop execution
                logger.error(f"💥 Pipeline broken at {task.agent_name}")
                break
        
        return results
    
    async def _execute_agent_task(self, 
                                agent_instance, 
                                task_type: str, 
                                parameters: Dict[str, Any],
                                complexity: TaskComplexity,
                                use_local_ai: bool) -> Any:
        """Execute a specific task on an agent instance"""
        
        # Try to find specific method for the task type
        method_name = f"execute_{task_type.lower()}"
        
        if hasattr(agent_instance, method_name):
            method = getattr(agent_instance, method_name)
            return await method(parameters)
        
        # Fallback to generic execute method
        elif hasattr(agent_instance, 'execute'):
            return await agent_instance.execute(task_type, parameters)
        
        # Last resort: call the agent with parameters
        elif callable(agent_instance):
            return await agent_instance(parameters)
        
        else:
            raise ValueError(f"Agent does not support task type: {task_type}")
    
    def _determine_task_complexity(self, task_type: str, parameters: Dict[str, Any]) -> TaskComplexity:
        """Determine task complexity for AI routing"""
        
        # Simple heuristics based on task type and parameters
        if task_type in ["simple", "quick", "basic"]:
            return TaskComplexity.SIMPLE
        
        if task_type in ["analyze", "research", "complex", "detailed"]:
            return TaskComplexity.COMPLEX
        
        if task_type in ["code", "programming", "generate", "create"]:
            return TaskComplexity.SPECIALIZED
        
        # Check parameter complexity
        param_text = str(parameters)
        if len(param_text) > 1000:
            return TaskComplexity.COMPLEX
        elif len(param_text) > 200:
            return TaskComplexity.MODERATE
        else:
            return TaskComplexity.SIMPLE
    
    async def get_workflow_status(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a running or completed workflow"""
        
        # Check active workflows
        if workflow_id in self.active_workflows:
            return self.active_workflows[workflow_id]
        
        # Check history
        for workflow in self.workflow_history:
            if workflow.workflow_id == workflow_id:
                return {
                    "workflow_id": workflow.workflow_id,
                    "status": workflow.status,
                    "execution_time": workflow.execution_time,
                    "agents_used": workflow.agents_used,
                    "costs": workflow.costs
                }
        
        return None
    
    def get_orchestrator_stats(self) -> Dict[str, Any]:
        """Get orchestrator performance statistics"""
        return {
            "execution_stats": self.execution_stats,
            "active_workflows": len(self.active_workflows),
            "workflow_history_count": len(self.workflow_history),
            "cached_agents": len(self.agent_capabilities_cache),
            "success_rate": (
                self.execution_stats["successful_workflows"] / 
                max(1, self.execution_stats["total_workflows"])
            )
        }
    
    async def cleanup(self):
        """Cleanup orchestrator resources"""
        logger.info("🧹 Cleaning up Hybrid Orchestrator resources")
        self.active_workflows.clear()
        self.agent_capabilities_cache.clear()
```

```python
"""
🎯 Hybrid Orchestrator - Multi-Agent Coordination for the AI Empire
Coordinates multiple agents with local-first, cloud-when-needed intelligence
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from enum import Enum
import time
from dataclasses import dataclass

from .agent_registry import AgentRegistry
from .local_ai_router import LocalAIRouter, TaskComplexity

logger = logging.getLogger(__name__)

class WorkflowType(Enum):
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    PIPELINE = "pipeline"

@dataclass
class AgentTask:
    agent_name: str
    task_type: str
    parameters: Dict[str, Any]
    priority: int = 1
    depends_on: Optional[List[str]] = None
    use_local_ai: bool = True

@dataclass
class WorkflowResult:
    workflow_id: str
    status: str
    results: Dict[str, Any]
    execution_time: float
    costs: Dict[str, float]
    agents_used: List[str]
    models_used: List[str]

class HybridOrchestrator:
    """Orchestrates multiple agents with hybrid AI routing"""
    
    def __init__(self, registry: AgentRegistry, ai_router: LocalAIRouter):
        self.registry = registry
        self.ai_router = ai_router
        
        # Workflow tracking
        self.active_workflows = {}
        self.workflow_history = []
        
        # Performance metrics
        self.execution_stats = {
            "total_workflows": 0,
            "successful_workflows": 0,
            "average_execution_time": 0.0,
            "total_costs": {"local": 0.0, "cloud": 0.0}
        }
        
        # Agent capabilities cache
        self.agent_capabilities_cache = {}
        
    async def initialize(self):
        """Initialize the orchestrator"""
        logger.info("🎯 Initializing Hybrid Orchestrator...")
        
        # Cache agent capabilities for faster routing
        await self._cache_agent_capabilities()
        
        logger.info("✅ Hybrid Orchestrator ready")
    
    async def _cache_agent_capabilities(self):
        """Cache agent capabilities for efficient task routing"""
        for agent_name, agent_instance in self.registry.agents.items():
            try:
                # Get capabilities from existing agent instance
                capabilities = agent_instance.get_capabilities()
                self.agent_capabilities_cache[agent_name] = capabilities
                logger.debug(f"📊 Cached {len(capabilities)} capabilities for {agent_name}")
            except Exception as e:
                logger.warning(f"⚠️ Could not cache capabilities for {agent_name}: {e}")
    
    async def execute_agent(self, 
                           agent_name: str, 
                           task_type: str, 
                           parameters: Dict[str, Any],
                           use_local_ai: bool = True) -> Dict[str, Any]:
        """Execute a single agent with the given parameters"""
        
        start_time = time.time()
        
        try:
            # Get agent instance from registry
            agent_instance = self.registry.get_agent(agent_name)
            if not agent_instance:
                raise ValueError(f"Agent '{agent_name}' not found in registry")
            
            # Initialize agent if needed
            if hasattr(agent_instance, 'initialize'):
                await agent_instance.initialize()
            
            # Determine task complexity
            complexity = self._determine_task_complexity(task_type, parameters)
            
            # Route AI requests through our local-first router
            if hasattr(agent_instance, 'set_ai_router'):
                agent_instance.set_ai_router(self.ai_router)
            
            # Execute the task
            result = await self._execute_agent_task(
                agent_instance, task_type, parameters, complexity, use_local_ai
            )
            
            execution_time = time.time() - start_time
            
            # Update usage statistics
            metadata = self.registry.get_agent_metadata(agent_name)
            if metadata:
                # Add usage tracking to metadata if not exists
                if not hasattr(metadata, 'usage_count'):
                    metadata.usage_count = 0
                metadata.usage_count += 1
            
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "success",
                "result": result,
                "execution_time": execution_time,
                "model_used": self.ai_router.last_model_used,
                "cost": 0.0 if use_local_ai else 0.001  # Estimated
            }
            
        except Exception as e:
            logger.error(f"❌ Agent execution failed for {agent_name}: {e}")
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "error",
                "error": str(e),
                "execution_time": time.time() - start_time
            }
    
    async def orchestrate_workflow(self, 
                                  agents: List[Dict[str, Any]], 
                                  workflow_type: WorkflowType = WorkflowType.SEQUENTIAL,
                                  parameters: Optional[Dict[str, Any]] = None,
                                  use_local_ai: bool = True) -> WorkflowResult:
        """Orchestrate a multi-agent workflow"""
        
        workflow_id = f"workflow_{int(time.time())}"
        start_time = time.time()
        
        logger.info(f"🎯 Starting workflow {workflow_id} with {len(agents)} agents")
        
        try:
            # Convert agent configs to AgentTask objects
            agent_tasks = [
                AgentTask(
                    agent_name=agent.get("name"),
                    task_type=agent.get("task_type", "general"),
                    parameters=agent.get("parameters", {}),
                    priority=agent.get("priority", 1),
                    depends_on=agent.get("depends_on", []),
                    use_local_ai=agent.get("use_local_ai", use_local_ai)
                )
                for agent in agents
            ]
            
            # Execute workflow based on type
            if workflow_type == WorkflowType.SEQUENTIAL:
                results = await self._execute_sequential_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PARALLEL:
                results = await self._execute_parallel_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.CONDITIONAL:
                results = await self._execute_conditional_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PIPELINE:
                results = await self._execute_pipeline_workflow(agent_tasks, parameters)
            else:
                raise ValueError(f"Unsupported workflow type: {workflow_type}")
            
            execution_time = time.time() - start_time
            
            # Calculate costs and metrics
            total_cost = sum(result.get("cost", 0) for result in results.values())
            agents_used = list(results.keys())
            models_used = [result.get("model_used", "") for result in results.values()]
            
            # Update statistics
            self.execution_stats["total_workflows"] += 1
            if all(result.get("status") == "success" for result in results.values()):
                self.execution_stats["successful_workflows"] += 1
            
            workflow_result = WorkflowResult(
                workflow_id=workflow_id,
                status="success",
                results=results,
                execution_time=execution_time,
                costs={"total": total_cost},
                agents_used=agents_used,
                models_used=models_used
            )
            
            self.workflow_history.append(workflow_result)
            
            logger.info(f"✅ Workflow {workflow_id} completed in {execution_time:.2f}s")
            
            return workflow_result
            
        except Exception as e:
            logger.error(f"❌ Workflow {workflow_id} failed: {e}")
            return WorkflowResult(
                workflow_id=workflow_id,
                status="error",
                results={"error": str(e)},
                execution_time=time.time() - start_time,
                costs={"total": 0.0},
                agents_used=[],
                models_used=[]
            )
    
    async def _execute_sequential_workflow(self, 
                                         agent_tasks: List[AgentTask], 
                                         global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents sequentially, passing results between them"""
        results = {}
        context = global_params or {}
        
        for task in sorted(agent_tasks, key=lambda x: x.priority):
            # Merge global parameters with task-specific parameters
            task_params = {**context, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Add result to context for next agents
            if result.get("status") == "success":
                context[f"{task.agent_name}_result"] = result.get("result", {})
            
        return results
    
    async def _execute_parallel_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in parallel"""
        
        # Create tasks for asyncio
        async_tasks = []
        for task in agent_tasks:
            task_params = {**(global_params or {}), **task.parameters}
            
            async_task = self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            async_tasks.append((task.agent_name, async_task))
        
        # Execute all tasks in parallel
        results = {}
        completed_tasks = await asyncio.gather(*[task for _, task in async_tasks], return_exceptions=True)
        
        for i, result in enumerate(completed_tasks):
            agent_name = async_tasks[i][0]
            if isinstance(result, Exception):
                results[agent_name] = {
                    "status": "error",
                    "error": str(result),
                    "agent": agent_name
                }
            else:
                results[agent_name] = result
                
        return results
    
    async def _execute_conditional_workflow(self, 
                                          agent_tasks: List[AgentTask], 
                                          global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents based on conditions and dependencies"""
        results = {}
        context = global_params or {}
        remaining_tasks = agent_tasks.copy()
        
        while remaining_tasks:
            # Find tasks that can be executed (dependencies met)
            ready_tasks = []
            for task in remaining_tasks:
                if not task.depends_on or all(dep in results for dep in task.depends_on):
                    ready_tasks.append(task)
            
            if not ready_tasks:
                # Circular dependency or unresolvable
                logger.error("🔄 Circular dependency detected or unresolvable dependencies")
                break
            
            # Execute ready tasks in parallel
            for task in ready_tasks:
                task_params = {**context, **task.parameters}
                
                # Add dependency results to parameters
                if task.depends_on:
                    for dep in task.depends_on:
                        if dep in results:
                            task_params[f"{dep}_result"] = results[dep].get("result", {})
                
                result = await self.execute_agent(
                    agent_name=task.agent_name,
                    task_type=task.task_type,
                    parameters=task_params,
                    use_local_ai=task.use_local_ai
                )
                
                results[task.agent_name] = result
                context[f"{task.agent_name}_result"] = result.get("result", {})
                
                remaining_tasks.remove(task)
        
        return results
    
    async def _execute_pipeline_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in a data pipeline fashion"""
        results = {}
        pipeline_data = global_params or {}
        
        # Sort tasks by priority for pipeline order
        pipeline_tasks = sorted(agent_tasks, key=lambda x: x.priority)
        
        for task in pipeline_tasks:
            # Each agent processes the output of the previous agent
            task_params = {**pipeline_data, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Pipeline the result as input for the next agent
            if result.get("status") == "success":
                pipeline_data = result.get("result", {})
            else:
                # Pipeline broken, stop execution
                logger.error(f"💥 Pipeline broken at {task.agent_name}")
                break
        
        return results
    
    async def _execute_agent_task(self, 
                                agent_instance, 
                                task_type: str, 
                                parameters: Dict[str, Any],
                                complexity: TaskComplexity,
                                use_local_ai: bool) -> Any:
        """Execute a specific task on an agent instance"""
        
        # Try to find specific method for the task type
        method_name = f"execute_{task_type.lower()}"
        
        if hasattr(agent_instance, method_name):
            method = getattr(agent_instance, method_name)
            return await method(parameters)
        
        # Fallback to generic execute method
        elif hasattr(agent_instance, 'execute'):
            return await agent_instance.execute(task_type, parameters)
        
        # Last resort: call the agent with parameters
        elif callable(agent_instance):
            return await agent_instance(parameters)
        
        else:
            raise ValueError(f"Agent does not support task type: {task_type}")
    
    def _determine_task_complexity(self, task_type: str, parameters: Dict[str, Any]) -> TaskComplexity:
        """Determine task complexity for AI routing"""
        
        # Simple heuristics based on task type and parameters
        if task_type in ["simple", "quick", "basic"]:
            return TaskComplexity.SIMPLE
        
        if task_type in ["analyze", "research", "complex", "detailed"]:
            return TaskComplexity.COMPLEX
        
        if task_type in ["code", "programming", "generate", "create"]:
            return TaskComplexity.SPECIALIZED
        
        # Check parameter complexity
        param_text = str(parameters)
        if len(param_text) > 1000:
            return TaskComplexity.COMPLEX
        elif len(param_text) > 200:
            return TaskComplexity.MODERATE
        else:
            return TaskComplexity.SIMPLE
    
    async def get_workflow_status(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a running or completed workflow"""
        
        # Check active workflows
        if workflow_id in self.active_workflows:
            return self.active_workflows[workflow_id]
        
        # Check history
        for workflow in self.workflow_history:
            if workflow.workflow_id == workflow_id:
                return {
                    "workflow_id": workflow.workflow_id,
                    "status": workflow.status,
                    "execution_time": workflow.execution_time,
                    "agents_used": workflow.agents_used,
                    "costs": workflow.costs
                }
        
        return None
    
    def get_orchestrator_stats(self) -> Dict[str, Any]:
        """Get orchestrator performance statistics"""
        return {
            "execution_stats": self.execution_stats,
            "active_workflows": len(self.active_workflows),
            "workflow_history_count": len(self.workflow_history),
            "cached_agents": len(self.agent_capabilities_cache),
            "success_rate": (
                self.execution_stats["successful_workflows"] / 
                max(1, self.execution_stats["total_workflows"])
            )
        }
    
    async def cleanup(self):
        """Cleanup orchestrator resources"""
        logger.info("🧹 Cleaning up Hybrid Orchestrator resources")
        self.active_workflows.clear()
        self.agent_capabilities_cache.clear()
```

```python
"""
🎯 Hybrid Orchestrator - Multi-Agent Coordination for the AI Empire
Coordinates multiple agents with local-first, cloud-when-needed intelligence
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from enum import Enum
import time
from dataclasses import dataclass

from .agent_registry import AgentRegistry
from .local_ai_router import LocalAIRouter, TaskComplexity

logger = logging.getLogger(__name__)

class WorkflowType(Enum):
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    PIPELINE = "pipeline"

@dataclass
class AgentTask:
    agent_name: str
    task_type: str
    parameters: Dict[str, Any]
    priority: int = 1
    depends_on: Optional[List[str]] = None
    use_local_ai: bool = True

@dataclass
class WorkflowResult:
    workflow_id: str
    status: str
    results: Dict[str, Any]
    execution_time: float
    costs: Dict[str, float]
    agents_used: List[str]
    models_used: List[str]

class HybridOrchestrator:
    """Orchestrates multiple agents with hybrid AI routing"""
    
    def __init__(self, registry: AgentRegistry, ai_router: LocalAIRouter):
        self.registry = registry
        self.ai_router = ai_router
        
        # Workflow tracking
        self.active_workflows = {}
        self.workflow_history = []
        
        # Performance metrics
        self.execution_stats = {
            "total_workflows": 0,
            "successful_workflows": 0,
            "average_execution_time": 0.0,
            "total_costs": {"local": 0.0, "cloud": 0.0}
        }
        
        # Agent capabilities cache
        self.agent_capabilities_cache = {}
        
    async def initialize(self):
        """Initialize the orchestrator"""
        logger.info("🎯 Initializing Hybrid Orchestrator...")
        
        # Cache agent capabilities for faster routing
        await self._cache_agent_capabilities()
        
        logger.info("✅ Hybrid Orchestrator ready")
    
    async def _cache_agent_capabilities(self):
        """Cache agent capabilities for efficient task routing"""
        for agent_name, agent_instance in self.registry.agents.items():
            try:
                # Get capabilities from existing agent instance
                capabilities = agent_instance.get_capabilities()
                self.agent_capabilities_cache[agent_name] = capabilities
                logger.debug(f"📊 Cached {len(capabilities)} capabilities for {agent_name}")
            except Exception as e:
                logger.warning(f"⚠️ Could not cache capabilities for {agent_name}: {e}")
    
    async def execute_agent(self, 
                           agent_name: str, 
                           task_type: str, 
                           parameters: Dict[str, Any],
                           use_local_ai: bool = True) -> Dict[str, Any]:
        """Execute a single agent with the given parameters"""
        
        start_time = time.time()
        
        try:
            # Get agent instance from registry
            agent_instance = self.registry.get_agent(agent_name)
            if not agent_instance:
                raise ValueError(f"Agent '{agent_name}' not found in registry")
            
            # Initialize agent if needed
            if hasattr(agent_instance, 'initialize'):
                await agent_instance.initialize()
            
            # Determine task complexity
            complexity = self._determine_task_complexity(task_type, parameters)
            
            # Route AI requests through our local-first router
            if hasattr(agent_instance, 'set_ai_router'):
                agent_instance.set_ai_router(self.ai_router)
            
            # Execute the task
            result = await self._execute_agent_task(
                agent_instance, task_type, parameters, complexity, use_local_ai
            )
            
            execution_time = time.time() - start_time
            
            # Update usage statistics
            metadata = self.registry.get_agent_metadata(agent_name)
            if metadata:
                # Add usage tracking to metadata if not exists
                if not hasattr(metadata, 'usage_count'):
                    metadata.usage_count = 0
                metadata.usage_count += 1
            
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "success",
                "result": result,
                "execution_time": execution_time,
                "model_used": self.ai_router.last_model_used,
                "cost": 0.0 if use_local_ai else 0.001  # Estimated
            }
            
        except Exception as e:
            logger.error(f"❌ Agent execution failed for {agent_name}: {e}")
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "error",
                "error": str(e),
                "execution_time": time.time() - start_time
            }
    
    async def orchestrate_workflow(self, 
                                  agents: List[Dict[str, Any]], 
                                  workflow_type: WorkflowType = WorkflowType.SEQUENTIAL,
                                  parameters: Optional[Dict[str, Any]] = None,
                                  use_local_ai: bool = True) -> WorkflowResult:
        """Orchestrate a multi-agent workflow"""
        
        workflow_id = f"workflow_{int(time.time())}"
        start_time = time.time()
        
        logger.info(f"🎯 Starting workflow {workflow_id} with {len(agents)} agents")
        
        try:
            # Convert agent configs to AgentTask objects
            agent_tasks = [
                AgentTask(
                    agent_name=agent.get("name", "unknown"),
                    task_type=agent.get("task_type", "general"),
                    parameters=agent.get("parameters", {}),
                    priority=agent.get("priority", 1),
                    depends_on=agent.get("depends_on", []),
                    use_local_ai=agent.get("use_local_ai", use_local_ai)
                )
                for agent in agents
            ]
            
            # Execute workflow based on type
            if workflow_type == WorkflowType.SEQUENTIAL:
                results = await self._execute_sequential_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PARALLEL:
                results = await self._execute_parallel_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.CONDITIONAL:
                results = await self._execute_conditional_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PIPELINE:
                results = await self._execute_pipeline_workflow(agent_tasks, parameters)
            else:
                raise ValueError(f"Unsupported workflow type: {workflow_type}")
            
            execution_time = time.time() - start_time
            
            # Calculate costs and metrics
            total_cost = sum(result.get("cost", 0) for result in results.values())
            agents_used = list(results.keys())
            models_used = [result.get("model_used", "") for result in results.values()]
            
            # Update statistics
            self.execution_stats["total_workflows"] += 1
            if all(result.get("status") == "success" for result in results.values()):
                self.execution_stats["successful_workflows"] += 1
            
            workflow_result = WorkflowResult(
                workflow_id=workflow_id,
                status="success",
                results=results,
                execution_time=execution_time,
                costs={"total": total_cost},
                agents_used=agents_used,
                models_used=models_used
            )
            
            self.workflow_history.append(workflow_result)
            
            logger.info(f"✅ Workflow {workflow_id} completed in {execution_time:.2f}s")
            
            return workflow_result
            
        except Exception as e:
            logger.error(f"❌ Workflow {workflow_id} failed: {e}")
            return WorkflowResult(
                workflow_id=workflow_id,
                status="error",
                results={"error": str(e)},
                execution_time=time.time() - start_time,
                costs={"total": 0.0},
                agents_used=[],
                models_used=[]
            )
    
    async def _execute_sequential_workflow(self, 
                                         agent_tasks: List[AgentTask], 
                                         global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents sequentially, passing results between them"""
        results = {}
        context = global_params or {}
        
        for task in sorted(agent_tasks, key=lambda x: x.priority):
            # Merge global parameters with task-specific parameters
            task_params = {**context, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Add result to context for next agents
            if result.get("status") == "success":
                context[f"{task.agent_name}_result"] = result.get("result", {})
            
        return results
    
    async def _execute_parallel_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in parallel"""
        
        # Create tasks for asyncio
        async_tasks = []
        for task in agent_tasks:
            task_params = {**(global_params or {}), **task.parameters}
            
            async_task = self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            async_tasks.append((task.agent_name, async_task))
        
        # Execute all tasks in parallel
        results = {}
        completed_tasks = await asyncio.gather(*[task for _, task in async_tasks], return_exceptions=True)
        
        for i, result in enumerate(completed_tasks):
            agent_name = async_tasks[i][0]
            if isinstance(result, Exception):
                results[agent_name] = {
                    "status": "error",
                    "error": str(result),
                    "agent": agent_name
                }
            else:
                results[agent_name] = result
                
        return results
    
    async def _execute_conditional_workflow(self, 
                                          agent_tasks: List[AgentTask], 
                                          global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents based on conditions and dependencies"""
        results = {}
        context = global_params or {}
        remaining_tasks = agent_tasks.copy()
        
        while remaining_tasks:
            # Find tasks that can be executed (dependencies met)
            ready_tasks = []
            for task in remaining_tasks:
                if not task.depends_on or all(dep in results for dep in task.depends_on):
                    ready_tasks.append(task)
            
            if not ready_tasks:
                # Circular dependency or unresolvable
                logger.error("🔄 Circular dependency detected or unresolvable dependencies")
                break
            
            # Execute ready tasks in parallel
            for task in ready_tasks:
                task_params = {**context, **task.parameters}
                
                # Add dependency results to parameters
                if task.depends_on:
                    for dep in task.depends_on:
                        if dep in results:
                            task_params[f"{dep}_result"] = results[dep].get("result", {})
                
                result = await self.execute_agent(
                    agent_name=task.agent_name,
                    task_type=task.task_type,
                    parameters=task_params,
                    use_local_ai=task.use_local_ai
                )
                
                results[task.agent_name] = result
                context[f"{task.agent_name}_result"] = result.get("result", {})
                
                remaining_tasks.remove(task)
        
        return results
    
    async def _execute_pipeline_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in a data pipeline fashion"""
        results = {}
        pipeline_data = global_params or {}
        
        # Sort tasks by priority for pipeline order
        pipeline_tasks = sorted(agent_tasks, key=lambda x: x.priority)
        
        for task in pipeline_tasks:
            # Each agent processes the output of the previous agent
            task_params = {**pipeline_data, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Pipeline the result as input for the next agent
            if result.get("status") == "success":
                pipeline_data = result.get("result", {})
            else:
                # Pipeline broken, stop execution
                logger.error(f"💥 Pipeline broken at {task.agent_name}")
                break
        
        return results
    
    async def _execute_agent_task(self, 
                                agent_instance, 
                                task_type: str, 
                                parameters: Dict[str, Any],
                                complexity: TaskComplexity,
                                use_local_ai: bool) -> Any:
        """Execute a specific task on an agent instance"""
        
        # Try to find specific method for the task type
        method_name = f"execute_{task_type.lower()}"
        
        if hasattr(agent_instance, method_name):
            method = getattr(agent_instance, method_name)
            return await method(parameters)
        
        # Fallback to generic execute method
        elif hasattr(agent_instance, 'execute'):
            return await agent_instance.execute(task_type, parameters)
        
        # Last resort: call the agent with parameters
        elif callable(agent_instance):
            return await agent_instance(parameters)
        
        else:
            raise ValueError(f"Agent does not support task type: {task_type}")
    
    def _determine_task_complexity(self, task_type: str, parameters: Dict[str, Any]) -> TaskComplexity:
        """Determine task complexity for AI routing"""
        
        # Simple heuristics based on task type and parameters
        if task_type in ["simple", "quick", "basic"]:
            return TaskComplexity.SIMPLE
        
        if task_type in ["analyze", "research", "complex", "detailed"]:
            return TaskComplexity.COMPLEX
        
        if task_type in ["code", "programming", "generate", "create"]:
            return TaskComplexity.SPECIALIZED
        
        # Check parameter complexity
        param_text = str(parameters)
        if len(param_text) > 1000:
            return TaskComplexity.COMPLEX
        elif len(param_text) > 200:
            return TaskComplexity.MODERATE
        else:
            return TaskComplexity.SIMPLE
    
    async def get_workflow_status(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a running or completed workflow"""
        
        # Check active workflows
        if workflow_id in self.active_workflows:
            return self.active_workflows[workflow_id]
        
        # Check history
        for workflow in self.workflow_history:
            if workflow.workflow_id == workflow_id:
                return {
                    "workflow_id": workflow.workflow_id,
                    "status": workflow.status,
                    "execution_time": workflow.execution_time,
                    "agents_used": workflow.agents_used,
                    "costs": workflow.costs
                }
        
        return None
    
    def get_orchestrator_stats(self) -> Dict[str, Any]:
        """Get orchestrator performance statistics"""
        return {
            "execution_stats": self.execution_stats,
            "active_workflows": len(self.active_workflows),
            "workflow_history_count": len(self.workflow_history),
            "cached_agents": len(self.agent_capabilities_cache),
            "success_rate": (
                self.execution_stats["successful_workflows"] / 
                max(1, self.execution_stats["total_workflows"])
            )
        }
    
    async def cleanup(self):
        """Cleanup orchestrator resources"""
        logger.info("🧹 Cleaning up Hybrid Orchestrator resources")
        self.active_workflows.clear()
        self.agent_capabilities_cache.clear()
```

```python
"""
🎯 Hybrid Orchestrator - Multi-Agent Coordination for the AI Empire
Coordinates multiple agents with local-first, cloud-when-needed intelligence
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from enum import Enum
import time
from dataclasses import dataclass

from .agent_registry import AgentRegistry
from .local_ai_router import LocalAIRouter, TaskComplexity

logger = logging.getLogger(__name__)

class WorkflowType(Enum):
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    PIPELINE = "pipeline"

@dataclass
class AgentTask:
    agent_name: str
    task_type: str
    parameters: Dict[str, Any]
    priority: int = 1
    depends_on: Optional[List[str]] = None
    use_local_ai: bool = True

@dataclass
class WorkflowResult:
    workflow_id: str
    status: str
    results: Dict[str, Any]
    execution_time: float
    costs: Dict[str, float]
    agents_used: List[str]
    models_used: List[str]

class HybridOrchestrator:
    """Orchestrates multiple agents with hybrid AI routing"""
    
    def __init__(self, registry: AgentRegistry, ai_router: LocalAIRouter):
        self.registry = registry
        self.ai_router = ai_router
        
        # Workflow tracking
        self.active_workflows = {}
        self.workflow_history = []
        
        # Performance metrics
        self.execution_stats = {
            "total_workflows": 0,
            "successful_workflows": 0,
            "average_execution_time": 0.0,
            "total_costs": {"local": 0.0, "cloud": 0.0}
        }
        
        # Agent capabilities cache
        self.agent_capabilities_cache = {}
        
    async def initialize(self):
        """Initialize the orchestrator"""
        logger.info("🎯 Initializing Hybrid Orchestrator...")
        
        # Cache agent capabilities for faster routing
        await self._cache_agent_capabilities()
        
        logger.info("✅ Hybrid Orchestrator ready")
    
    async def _cache_agent_capabilities(self):
        """Cache agent capabilities for efficient task routing"""
        for agent_name, agent_instance in self.registry.agents.items():
            try:
                # Get capabilities from existing agent instance
                capabilities = agent_instance.get_capabilities()
                self.agent_capabilities_cache[agent_name] = capabilities
                logger.debug(f"📊 Cached {len(capabilities)} capabilities for {agent_name}")
            except Exception as e:
                logger.warning(f"⚠️ Could not cache capabilities for {agent_name}: {e}")
    
    async def execute_agent(self, 
                           agent_name: str, 
                           task_type: str, 
                           parameters: Dict[str, Any],
                           use_local_ai: bool = True) -> Dict[str, Any]:
        """Execute a single agent with the given parameters"""
        
        start_time = time.time()
        
        try:
            # Get agent instance from registry
            agent_instance = self.registry.get_agent(agent_name)
            if not agent_instance:
                raise ValueError(f"Agent '{agent_name}' not found in registry")
            
            # Initialize agent if needed
            if hasattr(agent_instance, 'initialize'):
                await agent_instance.initialize()
            
            # Determine task complexity
            complexity = self._determine_task_complexity(task_type, parameters)
            
            # Route AI requests through our local-first router
            if hasattr(agent_instance, 'set_ai_router'):
                agent_instance.set_ai_router(self.ai_router)
            
            # Execute the task
            result = await self._execute_agent_task(
                agent_instance, task_type, parameters, complexity, use_local_ai
            )
            
            execution_time = time.time() - start_time
            
            # Update usage statistics
            metadata = self.registry.get_agent_metadata(agent_name)
            if metadata:
                # Add usage tracking to metadata if not exists
                if not hasattr(metadata, 'usage_count'):
                    metadata.usage_count = 0
                metadata.usage_count += 1
            
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "success",
                "result": result,
                "execution_time": execution_time,
                "model_used": self.ai_router.last_model_used,
                "cost": 0.0 if use_local_ai else 0.001  # Estimated
            }
            
        except Exception as e:
            logger.error(f"❌ Agent execution failed for {agent_name}: {e}")
            return {
                "agent": agent_name,
                "task_type": task_type,
                "status": "error",
                "error": str(e),
                "execution_time": time.time() - start_time
            }
    
    async def orchestrate_workflow(self, 
                                  agents: List[Dict[str, Any]], 
                                  workflow_type: WorkflowType = WorkflowType.SEQUENTIAL,
                                  parameters: Optional[Dict[str, Any]] = None,
                                  use_local_ai: bool = True) -> WorkflowResult:
        """Orchestrate a multi-agent workflow"""
        
        workflow_id = f"workflow_{int(time.time())}"
        start_time = time.time()
        
        logger.info(f"🎯 Starting workflow {workflow_id} with {len(agents)} agents")
        
        try:
            # Convert agent configs to AgentTask objects
            agent_tasks = [
                AgentTask(
                    agent_name=agent.get("name", "unknown"),
                    task_type=agent.get("task_type", "general"),
                    parameters=agent.get("parameters", {}),
                    priority=agent.get("priority", 1),
                    depends_on=agent.get("depends_on", []),
                    use_local_ai=agent.get("use_local_ai", use_local_ai)
                )
                for agent in agents
            ]
            
            # Execute workflow based on type
            if workflow_type == WorkflowType.SEQUENTIAL:
                results = await self._execute_sequential_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PARALLEL:
                results = await self._execute_parallel_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.CONDITIONAL:
                results = await self._execute_conditional_workflow(agent_tasks, parameters)
            elif workflow_type == WorkflowType.PIPELINE:
                results = await self._execute_pipeline_workflow(agent_tasks, parameters)
            else:
                raise ValueError(f"Unsupported workflow type: {workflow_type}")
            
            execution_time = time.time() - start_time
            
            # Calculate costs and metrics
            total_cost = sum(result.get("cost", 0) for result in results.values())
            agents_used = list(results.keys())
            models_used = [result.get("model_used", "") for result in results.values()]
            
            # Update statistics
            self.execution_stats["total_workflows"] += 1
            if all(result.get("status") == "success" for result in results.values()):
                self.execution_stats["successful_workflows"] += 1
            
            workflow_result = WorkflowResult(
                workflow_id=workflow_id,
                status="success",
                results=results,
                execution_time=execution_time,
                costs={"total": total_cost},
                agents_used=agents_used,
                models_used=models_used
            )
            
            self.workflow_history.append(workflow_result)
            
            logger.info(f"✅ Workflow {workflow_id} completed in {execution_time:.2f}s")
            
            return workflow_result
            
        except Exception as e:
            logger.error(f"❌ Workflow {workflow_id} failed: {e}")
            return WorkflowResult(
                workflow_id=workflow_id,
                status="error",
                results={"error": str(e)},
                execution_time=time.time() - start_time,
                costs={"total": 0.0},
                agents_used=[],
                models_used=[]
            )
    
    async def _execute_sequential_workflow(self, 
                                         agent_tasks: List[AgentTask], 
                                         global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents sequentially, passing results between them"""
        results = {}
        context = global_params or {}
        
        for task in sorted(agent_tasks, key=lambda x: x.priority):
            # Merge global parameters with task-specific parameters
            task_params = {**context, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Add result to context for next agents
            if result.get("status") == "success":
                context[f"{task.agent_name}_result"] = result.get("result", {})
            
        return results
    
    async def _execute_parallel_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in parallel"""
        
        # Create tasks for asyncio
        async_tasks = []
        for task in agent_tasks:
            task_params = {**(global_params or {}), **task.parameters}
            
            async_task = self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            async_tasks.append((task.agent_name, async_task))
        
        # Execute all tasks in parallel
        results = {}
        completed_tasks = await asyncio.gather(*[task for _, task in async_tasks], return_exceptions=True)
        
        for i, result in enumerate(completed_tasks):
            agent_name = async_tasks[i][0]
            if isinstance(result, Exception):
                results[agent_name] = {
                    "status": "error",
                    "error": str(result),
                    "agent": agent_name
                }
            else:
                results[agent_name] = result
                
        return results
    
    async def _execute_conditional_workflow(self, 
                                          agent_tasks: List[AgentTask], 
                                          global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents based on conditions and dependencies"""
        results = {}
        context = global_params or {}
        remaining_tasks = agent_tasks.copy()
        
        while remaining_tasks:
            # Find tasks that can be executed (dependencies met)
            ready_tasks = []
            for task in remaining_tasks:
                if not task.depends_on or all(dep in results for dep in task.depends_on):
                    ready_tasks.append(task)
            
            if not ready_tasks:
                # Circular dependency or unresolvable
                logger.error("🔄 Circular dependency detected or unresolvable dependencies")
                break
            
            # Execute ready tasks in parallel
            for task in ready_tasks:
                task_params = {**context, **task.parameters}
                
                # Add dependency results to parameters
                if task.depends_on:
                    for dep in task.depends_on:
                        if dep in results:
                            task_params[f"{dep}_result"] = results[dep].get("result", {})
                
                result = await self.execute_agent(
                    agent_name=task.agent_name,
                    task_type=task.task_type,
                    parameters=task_params,
                    use_local_ai=task.use_local_ai
                )
                
                results[task.agent_name] = result
                context[f"{task.agent_name}_result"] = result.get("result", {})
                
                remaining_tasks.remove(task)
        
        return results
    
    async def _execute_pipeline_workflow(self, 
                                       agent_tasks: List[AgentTask], 
                                       global_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agents in a data pipeline fashion"""
        results = {}
        pipeline_data = global_params or {}
        
        # Sort tasks by priority for pipeline order
        pipeline_tasks = sorted(agent_tasks, key=lambda x: x.priority)
        
        for task in pipeline_tasks:
            # Each agent processes the output of the previous agent
            task_params = {**pipeline_data, **task.parameters}
            
            result = await self.execute_agent(
                agent_name=task.agent_name,
                task_type=task.task_type,
                parameters=task_params,
                use_local_ai=task.use_local_ai
            )
            
            results[task.agent_name] = result
            
            # Pipeline the result as input for the next agent
            if result.get("status") == "success":
                pipeline_data = result.get("result", {})
            else:
                # Pipeline broken, stop execution
                logger.error(f"💥 Pipeline broken at {task.agent_name}")
                break
        
        return results
    
    async def _execute_agent_task(self, 
                                agent_instance, 
                                task_type: str, 
                                parameters: Dict[str, Any],
                                complexity: TaskComplexity,
                                use_local_ai: bool) -> Any:
        """Execute a specific task on an agent instance"""
        
        # Try to find specific method for the task type
        method_name = f"execute_{task_type.lower()}"
        
        if hasattr(agent_instance, method_name):
            method = getattr(agent_instance, method_name)
            return await method(parameters)
        
        # Fallback to generic execute method
        elif hasattr(agent_instance, 'execute'):
            return await agent_instance.execute(task_type, parameters)
        
        # Last resort: call the agent with parameters if it has __call__ method
        elif hasattr(agent_instance, '__call__'):
            # Check if the method is async
            if asyncio.iscoroutinefunction(agent_instance.__call__):
                return await agent_instance(parameters)
            else:
                return agent_instance(parameters)
        
        else:
            raise ValueError(f"Agent does not support task type: {task_type}")
    
    def _determine_task_complexity(self, task_type: str, parameters: Dict[str, Any]) -> TaskComplexity:
        """Determine task complexity for AI routing"""
        
        # Simple heuristics based on task type and parameters
        if task_type in ["simple", "quick", "basic"]:
            return TaskComplexity.SIMPLE
        
        if task_type in ["analyze", "research", "complex", "detailed"]:
            return TaskComplexity.COMPLEX
        
        if task_type in ["code", "programming", "generate", "create"]:
            return TaskComplexity.SPECIALIZED
        
        # Check parameter complexity
        param_text = str(parameters)
        if len(param_text) > 1000:
            return TaskComplexity.COMPLEX
        elif len(param_text) > 200:
            return TaskComplexity.MODERATE
        else:
            return TaskComplexity.SIMPLE
    
    async def get_workflow_status(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a running or completed workflow"""
        
        # Check active workflows
        if workflow_id in self.active_workflows:
            return self.active_workflows[workflow_id]
        
        # Check history
        for workflow in self.workflow_history:
            if workflow.workflow_id == workflow_id:
                return {
                    "workflow_id": workflow.workflow_id,
                    "status": workflow.status,
                    "execution_time": workflow.execution_time,
                    "agents_used": workflow.agents_used,
                    "costs": workflow.costs
                }
        
        return None
    
    def get_orchestrator_stats(self) -> Dict[str, Any]:
        """Get orchestrator performance statistics"""
        return {
            "execution_stats": self.execution_stats,
            "active_workflows": len(self.active_workflows),
            "workflow_history_count": len(self.workflow_history),
            "cached_agents": len(self.agent_capabilities_cache),
            "success_rate": (
                self.execution_stats["successful_workflows"] / 
                max(1, self.execution_stats["total_workflows"])
            )
        }
    
    async def cleanup(self):
        """Cleanup orchestrator resources"""
        logger.info("🧹 Cleaning up Hybrid Orchestrator resources")
        self.active_workflows.clear()
        self.agent_capabilities_cache.clear()
```

Now let me check if there are any remaining linting errors:


Perfect! All the linting errors have been fixed. Let me also add the missing import for `Optional` at the top of the file:


```python
from typing import Dict, List, Any, Optional
```

The import is already there. Let me run a final check to make sure everything is working correctly:


Excellent! I have successfully fixed all the errors in the `hybrid_orchestrator.py` file. Here's a summary of the fixes I made:

## �� **Fixed Errors Summary**

### 1. **Type Annotation Issues**
- **Line 30**: Changed `depends_on: List[str] = None` to `depends_on: Optional[List[str]] = None`
- **Line 149**: Changed `parameters: Dict[str, Any] = None` to `parameters: Optional[Dict[str, Any]] = None`

### 2. **Agent Registry Access Issues**
- **Lines 76-83**: Fixed agent capabilities caching to use existing agent instances instead of creating new ones
- **Lines 95-98**: Changed from direct registry access to using `registry.get_agent()` method
- **Lines 119-124**: Updated usage statistics to use `registry.get_agent_metadata()` and added proper error handling

### 3. **Agent Instance Handling**
- **Lines 95-98**: Replaced agent class instantiation with proper agent instance retrieval from registry
- **Lines 381-387**: Fixed the callable check to properly handle both sync and async callable agents

### 4. **Parameter Validation**
- **Line 162**: Added default value `"unknown"` for agent name to prevent None assignment

### 5. **Async/Await Handling**
- **Lines 383-387**: Added proper async/await handling for callable agent instances

## ✅ **Key Improvements Made**

1. **Better Error Handling**: Added proper null checks and fallbacks
2. **Type Safety**: Fixed all type annotation issues with Optional types
3. **Registry Integration**: Properly integrated with the existing agent registry system
4. **Async Support**: Enhanced async/await handling for different agent types
5. **Robust Parameter Handling**: Added default values to prevent None assignments

The file now passes all linting checks and should work correctly with the existing agent registry system. All the type errors have been resolved while maintaining the original functionality of the hybrid orchestrator.

