# Gen AI Fine-Tuning Service

## Overview

This service provides fine-tuning capabilities for both Claude (via Anthropic API) and local Ollama models. It enables customizing AI models for specific domains, tasks, and use cases within the TAURUS AI ecosystem.

## Features

- **Claude Fine-Tuning**: Fine-tune Claude models (Haiku, Sonnet, Opus) via Anthropic API
- **Local Fine-Tuning**: Fine-tune Ollama models (Llama, CodeLlama, Mistral) using LoRA/QLoRA
- **Dataset Management**: Extract and prepare training data from multiple sources
- **Training Monitoring**: Track training progress and metrics
- **Model Registry**: Version control and deployment for fine-tuned models
- **Integration**: Seamless integration with LocalAIRouter and agent orchestrator

## Quick Start

### 1. Install Dependencies

```bash
cd services/gen-ai-finetuning
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Set required environment variables
export ANTHROPIC_API_KEY="your-anthropic-api-key"
export OLLAMA_URL="http://localhost:11434"  # Optional, defaults to localhost
```

### 3. Prepare Dataset

```bash
# Prepare dataset from agent conversations
python data/prepare_dataset.py --source agent_conversations --output data/training/dataset.jsonl

# Validate dataset
python data/validate_dataset.py --input data/training/dataset.jsonl
```

### 4. Start Fine-Tuning Job

```bash
# Fine-tune Claude model
python training/train_claude.py \
  --model claude-3-haiku-20240307 \
  --dataset data/training/dataset.jsonl \
  --name my_custom_model

# Or use the convenience script
./scripts/run_finetuning.sh --model claude --dataset data/training/dataset.jsonl
```

## Directory Structure

```
services/gen-ai-finetuning/
├── config/
│   └── finetuning_config.yaml      # Central configuration
├── data/
│   ├── prepare_dataset.py          # Dataset preparation pipeline
│   └── validate_dataset.py        # Dataset validation
├── training/
│   ├── train_claude.py             # Claude fine-tuning orchestrator
│   └── train_ollama.py             # Local Ollama fine-tuning
├── monitoring/
│   └── training_monitor.py         # Training progress tracking
├── deployment/
│   └── model_registry.py           # Model versioning and deployment
├── scripts/
│   └── run_finetuning.sh           # One-command fine-tuning
└── README.md                       # This file
```

## Configuration

See `config/finetuning_config.yaml` for detailed configuration options including:

- Model selection and parameters
- Dataset requirements and validation
- Training hyperparameters
- Cost estimation
- Integration settings

## Usage Examples

### Fine-Tune Claude for Domain-Specific Tasks

```python
from training.train_claude import ClaudeFineTuner

trainer = ClaudeFineTuner(
    model="claude-3-haiku-20240307",
    dataset_path="data/training/domain_specific.jsonl"
)

job = trainer.create_training_job(
    name="taurus_domain_expert",
    hyperparameters={
        "learning_rate_multiplier": 1.0,
        "n_epochs": 1
    }
)

# Monitor training
trainer.monitor_job(job.id)
```

### Fine-Tune Local Ollama Model

```python
from training.train_ollama import OllamaFineTuner

trainer = OllamaFineTuner(
    model="llama3.1:8b",
    dataset_path="data/training/code_examples.jsonl"
)

job = trainer.finetune(
    lora_rank=16,
    lora_alpha=32,
    num_epochs=3,
    learning_rate=2e-4
)

# Deploy fine-tuned model
trainer.deploy_model(job.model_path, "llama3.1:8b-custom")
```

## Integration with LocalAIRouter

Fine-tuned models are automatically integrated with the LocalAIRouter system:

```python
from registry.local_ai_router import LocalAIRouter

router = LocalAIRouter()
await router.initialize()

# Fine-tuned models are automatically detected and prioritized
response = await router.chat_completion(
    messages=[{"role": "user", "content": "Hello"}],
    model_preference="fine_tuned"  # Use fine-tuned model if available
)
```

## Monitoring

Track training progress and metrics:

```python
from monitoring.training_monitor import TrainingMonitor

monitor = TrainingMonitor()
status = monitor.get_job_status(job_id)
print(f"Status: {status.status}, Progress: {status.progress}%")
```

## Model Registry

Manage fine-tuned model versions:

```python
from deployment.model_registry import ModelRegistry

registry = ModelRegistry()
models = registry.list_models()
latest = registry.get_latest_version("my_custom_model")
registry.deploy_model(latest, "production")
```

## Cost Estimation

Estimate training costs before starting:

```python
from training.train_claude import estimate_cost

cost = estimate_cost(
    model="claude-3-haiku-20240307",
    num_examples=1000
)
print(f"Estimated cost: ${cost:.2f}")
```

## Best Practices

1. **Start Small**: Begin with Claude Haiku (cheapest) and small datasets
2. **Validate Data**: Always validate datasets before training
3. **Monitor Costs**: Track training costs, especially for Claude Opus
4. **Version Control**: Use model registry for versioning and rollback
5. **Test Thoroughly**: Evaluate fine-tuned models before production deployment

## Troubleshooting

### Common Issues

1. **Dataset Format Errors**: Use `validate_dataset.py` to check format
2. **API Rate Limits**: Check rate limits in config, add delays if needed
3. **GPU Memory**: For Ollama fine-tuning, ensure sufficient GPU memory
4. **Cost Overruns**: Set cost limits and monitor usage

## Documentation

- [Configuration Guide](config/finetuning_config.yaml)
- [Dataset Preparation](data/prepare_dataset.py)
- [Training Guide](training/README.md)
- [Model Registry](deployment/README.md)

## Support

For issues or questions, refer to:
- TAURUS AI Development Team
- Anthropic API Documentation: https://docs.anthropic.com
- Ollama Documentation: https://ollama.ai/docs

---

**Last Updated:** November 19, 2025  
**Maintained By:** TAURUS AI Development Team

