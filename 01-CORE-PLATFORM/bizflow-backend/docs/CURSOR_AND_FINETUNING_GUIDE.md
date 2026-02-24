# Cursor IDE Subscription & Gen AI Fine-Tuning Complete Guide

**Date:** November 19, 2025  
**Status:** ✅ Implementation Complete

---

## Table of Contents

1. [Cursor IDE Subscription Configuration](#cursor-ide-subscription-configuration)
2. [Gen AI Fine-Tuning Infrastructure](#gen-ai-fine-tuning-infrastructure)
3. [Integration Guide](#integration-guide)
4. [Troubleshooting](#troubleshooting)
5. [Quick Reference](#quick-reference)

---

## Part 1: Cursor IDE Subscription Configuration

### Overview

This system configures Cursor IDE to prioritize your Claude.ai subscription over API keys for chat functionality, while keeping API keys available for MCP servers that require external service authentication.

### Key Files

- `.cursor/settings.json` - Cursor IDE settings with subscription preference
- `.cursor/subscription_config.json` - Explicit subscription configuration
- `agents/integrations/mcp-agents/cursor-mcp-config.json` - MCP server configuration
- `scripts/switch_cursor_mode.sh` - Switch between subscription/API modes
- `scripts/verify_cursor_subscription.sh` - Verify subscription status

### Quick Setup

```bash
# 1. Copy configuration files to global Cursor config (optional)
cp .cursor/settings.json ~/.cursor/settings.json
cp .cursor/subscription_config.json ~/.cursor/subscription_config.json

# 2. Verify subscription status
./scripts/verify_cursor_subscription.sh

# 3. Restart Cursor IDE
# Cursor will now use subscription for chat
```

### Environment Files

- `.env.subscription` - Subscription mode (ANTHROPIC_API_KEY commented out)
- `.env.api` - API mode (ANTHROPIC_API_KEY active)

Switch modes:
```bash
./scripts/switch_cursor_mode.sh subscription  # Use subscription
./scripts/switch_cursor_mode.sh api          # Use API key
```

### MCP Server Configuration

MCP servers use API keys for external services:
- **Perplexity** → `PERPLEXITY_API_KEY`
- **Firecrawl** → `FIRECRAWL_API_KEY`
- **GitHub** → `GITHUB_PERSONAL_ACCESS_TOKEN`
- **Google Services** → `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Slack** → `SLACK_BOT_TOKEN`, `SLACK_USER_TOKEN`
- **Notion** → `NOTION_API_KEY`

**Important:** `ANTHROPIC_API_KEY` is NOT required in MCP configs. Cursor chat uses subscription.

### Verification

Run verification script:
```bash
./scripts/verify_cursor_subscription.sh
```

Expected output:
```
✅ Subscription mode is enabled in config
✅ ANTHROPIC_API_KEY is commented out (subscription mode)
✅ MCP config does not include ANTHROPIC_API_KEY (correct)
✅ ANTHROPIC_API_KEY is not set in environment (good for subscription)
```

---

## Part 2: Gen AI Fine-Tuning Infrastructure

### Overview

Complete fine-tuning system for Claude (via Anthropic API) and local Ollama models. Supports dataset preparation, training, monitoring, and model deployment.

### Directory Structure

```
services/gen-ai-finetuning/
├── config/
│   └── finetuning_config.yaml      # Central configuration
├── data/
│   ├── prepare_dataset.py          # Dataset preparation
│   └── validate_dataset.py         # Dataset validation
├── training/
│   ├── train_claude.py             # Claude fine-tuning
│   └── train_ollama.py             # Ollama fine-tuning (placeholder)
├── monitoring/
│   └── training_monitor.py         # Job monitoring
├── deployment/
│   └── model_registry.py           # Model versioning
└── scripts/
    └── run_finetuning.sh           # One-command execution
```

### Quick Start

#### 1. Prepare Dataset

```bash
# From agent conversations
python data/prepare_dataset.py \
  --source agent_conversations \
  --input data/conversations.json \
  --output data/training/dataset.jsonl

# Validate dataset
python data/validate_dataset.py --input data/training/dataset.jsonl
```

#### 2. Estimate Cost

```bash
python training/train_claude.py \
  --model claude-3-haiku-20240307 \
  --dataset data/training/dataset.jsonl \
  --estimate-only
```

#### 3. Start Training

```bash
python training/train_claude.py \
  --model claude-3-haiku-20240307 \
  --dataset data/training/dataset.jsonl \
  --name my_custom_model \
  --validation data/training/validation.jsonl
```

#### 4. Monitor Training

```bash
# Check job status
python monitoring/training_monitor.py --job-id ftjob_1234567890

# List all jobs
python monitoring/training_monitor.py --list

# Get summary
python monitoring/training_monitor.py --summary
```

#### 5. Register Model

```python
from deployment.model_registry import ModelRegistry

registry = ModelRegistry()
registry.register_model(
    model_id="my_custom_model",
    base_model="claude-3-haiku-20240307",
    model_path="path/to/model",
    training_examples=1000,
    performance_metrics={"accuracy": 0.95}
)
```

### Dataset Format

JSONL format required by Anthropic API:

```json
{"messages": [{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hi there!"}], "system": "You are a helpful assistant."}
{"messages": [{"role": "user", "content": "What is AI?"}, {"role": "assistant", "content": "AI is..."}]}
```

### Cost Estimation

| Model | Cost per 1K Examples | Example (1K examples) |
|-------|---------------------|------------------------|
| Claude Haiku | $0.80 | $0.80 |
| Claude Sonnet | $3.00 | $3.00 |
| Claude Opus | $15.00 | $15.00 |

### Model Integration

Fine-tuned models are automatically integrated with LocalAIRouter:

```python
from registry.local_ai_router import LocalAIRouter

router = LocalAIRouter()
await router.initialize()

# Fine-tuned models are automatically detected
response = await router.chat_completion(
    messages=[{"role": "user", "content": "Hello"}],
    model_preference="fine_tuned"  # Use fine-tuned if available
)
```

---

## Part 3: Integration Guide

### LocalAIRouter Integration

The LocalAIRouter automatically:
1. Loads fine-tuned models on initialization
2. Prefers fine-tuned models when available (if `PREFER_FINE_TUNED=true`)
3. Falls back to base models if fine-tuned unavailable
4. Tracks fine-tuned model usage separately

### Register Fine-Tuned Model

```python
from registry.local_ai_router import LocalAIRouter

router = LocalAIRouter()
await router.initialize()

# Register a fine-tuned model
router.register_fine_tuned_model(
    model_id="ft:my-custom-model",
    base_model="claude-3-haiku-20240307",
    metadata={
        "best_for": ["domain_specific", "custom_tasks"],
        "training_date": "2025-11-19"
    }
)

# Check registered models
models = await router.get_fine_tuned_models()
print(models)
```

### Agent Orchestrator Integration

Fine-tuned models can be used by agents:

```python
from agents.orchestration.master_orchestrator import BizFlowMasterOrchestrator

orchestrator = BizFlowMasterOrchestrator()

# Agents will automatically use fine-tuned models when appropriate
task = orchestrator.create_task(
    task_type="domain_specific",
    complexity="moderate"
)
```

---

## Part 4: Troubleshooting

### Cursor Subscription Issues

**Problem:** Cursor still using API key

**Solutions:**
1. Verify signed in: Settings → Account → Check subscription
2. Remove `ANTHROPIC_API_KEY` from environment: `unset ANTHROPIC_API_KEY`
3. Restart Cursor completely
4. Check `.cursor/settings.json` has `preferSubscription: true`

**Problem:** MCP servers not working

**Solutions:**
1. Verify MCP config has correct API keys for external services
2. Check environment file is loaded: `master.env`
3. Restart Cursor after changing MCP config

### Fine-Tuning Issues

**Problem:** Dataset validation fails

**Solutions:**
1. Run validation: `python data/validate_dataset.py --input dataset.jsonl`
2. Check format matches Anthropic requirements
3. Ensure messages alternate between user/assistant
4. Verify first message is from user, last from assistant

**Problem:** Training job fails

**Solutions:**
1. Check job status: `python monitoring/training_monitor.py --job-id <id>`
2. Review error messages in job status
3. Verify API key is valid: `ANTHROPIC_API_KEY`
4. Check dataset size (min 10 examples, max 10,000)

**Problem:** Fine-tuned model not detected

**Solutions:**
1. Register model: `router.register_fine_tuned_model(...)`
2. Check `PREFER_FINE_TUNED` environment variable
3. Verify model registry: `python deployment/model_registry.py --list`
4. Restart LocalAIRouter after registering models

---

## Part 5: Quick Reference

### Cursor Commands

```bash
# Verify subscription
./scripts/verify_cursor_subscription.sh

# Switch to subscription mode
./scripts/switch_cursor_mode.sh subscription

# Switch to API mode
./scripts/switch_cursor_mode.sh api
```

### Fine-Tuning Commands

```bash
# Prepare dataset
python data/prepare_dataset.py --source agent_conversations --input data.json --output dataset.jsonl

# Validate dataset
python data/validate_dataset.py --input dataset.jsonl

# Estimate cost
python training/train_claude.py --model claude-3-haiku-20240307 --dataset dataset.jsonl --estimate-only

# Start training
python training/train_claude.py --model claude-3-haiku-20240307 --dataset dataset.jsonl --name my_model

# Monitor jobs
python monitoring/training_monitor.py --list
python monitoring/training_monitor.py --job-id <id>
python monitoring/training_monitor.py --summary

# Model registry
python deployment/model_registry.py --list
python deployment/model_registry.py --model-id my_model
python deployment/model_registry.py --model-id my_model --deploy production
```

### Python API

```python
# Dataset preparation
from data.prepare_dataset import DatasetPreparer
preparer = DatasetPreparer()
preparer.prepare_from_agent_conversations(conversations, "output.jsonl")

# Training
from training.train_claude import ClaudeFineTuner
trainer = ClaudeFineTuner()
job = trainer.create_training_job(model="claude-3-haiku-20240307", training_file="dataset.jsonl")

# Monitoring
from monitoring.training_monitor import TrainingMonitor
monitor = TrainingMonitor()
status = monitor.get_job_status(job.id)

# Model registry
from deployment.model_registry import ModelRegistry
registry = ModelRegistry()
registry.register_model(model_id="my_model", base_model="claude-3-haiku-20240307", ...)

# Router integration
from registry.local_ai_router import LocalAIRouter
router = LocalAIRouter()
await router.initialize()
router.register_fine_tuned_model(model_id="ft:my-model", base_model="claude-3-haiku-20240307", ...)
```

---

## Success Metrics

### Cursor Configuration
- ✅ Cursor chat uses subscription (not API key)
- ✅ MCP servers functional with their API keys
- ✅ Easy switching between subscription/API modes
- ✅ Clear documentation for team members

### Fine-Tuning System
- ✅ Can fine-tune Claude models via Anthropic API
- ✅ Fine-tuned models integrated into agent routing
- ✅ Training jobs can be triggered programmatically
- ✅ Model performance improvements measurable
- ✅ Complete monitoring and versioning system

---

## Additional Resources

- [Cursor Subscription Setup](./CURSOR_SUBSCRIPTION_SETUP.md)
- [Fine-Tuning README](../services/gen-ai-finetuning/README.md)
- [Configuration Reference](../services/gen-ai-finetuning/config/finetuning_config.yaml)
- [LocalAIRouter Documentation](../registry/local_ai_router.py)

---

**Last Updated:** November 19, 2025  
**Maintained By:** TAURUS AI Development Team


