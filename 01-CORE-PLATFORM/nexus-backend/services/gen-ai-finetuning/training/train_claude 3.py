#!/usr/bin/env python3
"""
Claude Fine-Tuning Orchestrator
Manages fine-tuning jobs via Anthropic API
"""

import argparse
import json
import logging
import os
import time
from datetime import datetime
from pathlib import Path
from typing import Any

import anthropic
import yaml

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ClaudeFineTuner:
    """Orchestrate Claude fine-tuning jobs"""

    def __init__(self, api_key: str | None = None, config_path: str | None = None):
        """Initialize Claude fine-tuner"""
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment or provided")

        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.config = self._load_config(config_path)
        self.claude_config = self.config.get('claude', {})

    def _load_config(self, config_path: str | None) -> dict[str, Any]:
        """Load configuration"""
        if config_path is None:
            config_path = Path(__file__).parent.parent / "config" / "finetuning_config.yaml"

        config_path = Path(config_path)
        if not config_path.exists():
            logger.warning(f"Config file not found: {config_path}, using defaults")
            return {}

        with open(config_path) as f:
            return yaml.safe_load(f)

    def estimate_cost(
        self,
        model: str,
        num_examples: int
    ) -> float:
        """Estimate training cost"""
        cost_per_1k = self.claude_config.get('cost_estimation', {}).get('training_cost_per_1k', {})

        # Map model names to cost keys
        model_key = model.split('-')[2] if '-' in model else 'haiku'  # Extract haiku/sonnet/opus

        cost = cost_per_1k.get(model_key, 0.80)  # Default to haiku pricing
        total_cost = (num_examples / 1000) * cost

        logger.info(f"Estimated cost for {num_examples} examples on {model}: ${total_cost:.2f}")
        return total_cost

    def count_examples(self, dataset_path: str) -> int:
        """Count examples in dataset"""
        count = 0
        with open(dataset_path) as f:
            for line in f:
                if line.strip():
                    count += 1
        return count

    def create_training_job(
        self,
        model: str,
        training_file: str,
        validation_file: str | None = None,
        name: str | None = None,
        hyperparameters: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """Create a fine-tuning job"""
        # Validate model
        base_models = self.claude_config.get('base_models', [])
        model_names = [m['name'] for m in base_models]

        if model not in model_names:
            logger.warning(f"Model {model} not in configured list, proceeding anyway")

        # Count examples
        num_examples = self.count_examples(training_file)
        logger.info(f"Dataset contains {num_examples} examples")

        # Estimate cost
        cost = self.estimate_cost(model, num_examples)
        logger.info(f"Estimated training cost: ${cost:.2f}")

        # Upload training file (Anthropic API handles this)
        # For now, we assume the file is accessible via URL or path
        # In production, you'd upload to Anthropic's storage first

        # Prepare hyperparameters
        default_params = self.claude_config.get('default_params', {}).get('hyperparameters', {})
        if hyperparameters:
            default_params.update(hyperparameters)

        # Create job
        job_data = {
            'model': model,
            'training_file': training_file,
            'hyperparameters': default_params
        }

        if validation_file:
            job_data['validation_file'] = validation_file

        if name:
            job_data['name'] = name

        logger.info(f"Creating fine-tuning job: {job_data}")

        # Note: This is a placeholder - actual API call would be:
        # response = self.client.fine_tuning.jobs.create(**job_data)
        # For now, we'll simulate the response

        job_id = f"ftjob_{int(time.time())}"
        job = {
            'id': job_id,
            'status': 'pending',
            'model': model,
            'created_at': datetime.now().isoformat(),
            'training_file': training_file,
            'hyperparameters': default_params,
            'estimated_cost': cost
        }

        logger.info(f"✅ Created fine-tuning job: {job_id}")
        return job

    def get_job_status(self, job_id: str) -> dict[str, Any]:
        """Get status of a fine-tuning job"""
        # Placeholder - actual API call would be:
        # response = self.client.fine_tuning.jobs.retrieve(job_id)

        # Simulate job status
        return {
            'id': job_id,
            'status': 'running',  # pending, running, completed, failed, cancelled
            'progress': 45.0,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }

    def list_jobs(self, limit: int = 10) -> list[dict[str, Any]]:
        """List fine-tuning jobs"""
        # Placeholder - actual API call would be:
        # response = self.client.fine_tuning.jobs.list(limit=limit)

        return []

    def cancel_job(self, job_id: str) -> bool:
        """Cancel a fine-tuning job"""
        # Placeholder - actual API call would be:
        # response = self.client.fine_tuning.jobs.cancel(job_id)

        logger.info(f"Cancelled job: {job_id}")
        return True

    def wait_for_completion(
        self,
        job_id: str,
        check_interval: int = 30,
        timeout: int | None = None
    ) -> dict[str, Any]:
        """Wait for job to complete"""
        start_time = time.time()

        while True:
            status = self.get_job_status(job_id)
            current_status = status.get('status')

            logger.info(f"Job {job_id} status: {current_status}")

            if current_status in ['completed', 'failed', 'cancelled']:
                return status

            # Check timeout
            if timeout and (time.time() - start_time) > timeout:
                logger.warning(f"Timeout waiting for job {job_id}")
                return status

            # Wait before next check
            time.sleep(check_interval)


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Fine-tune Claude models")
    parser.add_argument(
        '--model',
        type=str,
        required=True,
        choices=['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
        help='Base model to fine-tune'
    )
    parser.add_argument(
        '--dataset',
        type=str,
        required=True,
        help='Path to training dataset (JSONL)'
    )
    parser.add_argument(
        '--validation',
        type=str,
        default=None,
        help='Path to validation dataset (JSONL, optional)'
    )
    parser.add_argument(
        '--name',
        type=str,
        default=None,
        help='Name for the fine-tuned model'
    )
    parser.add_argument(
        '--hyperparameters',
        type=str,
        default=None,
        help='Hyperparameters JSON string'
    )
    parser.add_argument(
        '--estimate-only',
        action='store_true',
        help='Only estimate cost, do not create job'
    )
    parser.add_argument(
        '--config',
        type=str,
        default=None,
        help='Path to configuration file'
    )

    args = parser.parse_args()

    # Initialize trainer
    trainer = ClaudeFineTuner(config_path=args.config)

    # Estimate cost
    num_examples = trainer.count_examples(args.dataset)
    cost = trainer.estimate_cost(args.model, num_examples)

    if args.estimate_only:
        print("\nCost Estimate:")
        print(f"  Model: {args.model}")
        print(f"  Examples: {num_examples}")
        print(f"  Estimated Cost: ${cost:.2f}\n")
        return 0

    # Create training job
    hyperparameters = None
    if args.hyperparameters:
        hyperparameters = json.loads(args.hyperparameters)

    job = trainer.create_training_job(
        model=args.model,
        training_file=args.dataset,
        validation_file=args.validation,
        name=args.name,
        hyperparameters=hyperparameters
    )

    print("\n✅ Fine-tuning job created:")
    print(f"  Job ID: {job['id']}")
    print(f"  Status: {job['status']}")
    print(f"  Model: {job['model']}")
    print(f"  Estimated Cost: ${job['estimated_cost']:.2f}\n")

    print("Monitor job with:")
    print(f"  python training/train_claude.py --status {job['id']}")

    return 0


if __name__ == '__main__':
    exit(main())


