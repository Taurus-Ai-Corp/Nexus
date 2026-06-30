#!/usr/bin/env python3
"""
Dataset Validation for Fine-Tuning
Validates JSONL datasets against Anthropic API requirements
"""

import argparse
import json
import logging
from pathlib import Path
from typing import Any

import yaml

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatasetValidator:
    """Validate datasets for fine-tuning"""

    def __init__(self, config_path: str | None = None):
        """Initialize validator with configuration"""
        self.config = self._load_config(config_path)
        self.requirements = self.config.get('claude', {}).get('default_params', {}).get('format_requirements', {})
        self.quality_filters = self.config.get('dataset', {}).get('quality_filters', {})
        self.errors = []
        self.warnings = []

    def _load_config(self, config_path: str | None) -> dict[str, Any]:
        """Load configuration from YAML file"""
        if config_path is None:
            config_path = Path(__file__).parent.parent / "config" / "finetuning_config.yaml"

        config_path = Path(config_path)
        if not config_path.exists():
            logger.warning(f"Config file not found: {config_path}, using defaults")
            return {}

        with open(config_path) as f:
            return yaml.safe_load(f)

    def validate(self, dataset_path: str) -> dict[str, Any]:
        """Validate entire dataset"""
        dataset_path = Path(dataset_path)

        if not dataset_path.exists():
            return {
                'valid': False,
                'errors': [f"Dataset file not found: {dataset_path}"],
                'warnings': [],
                'stats': {}
            }

        examples = []
        self.errors = []
        self.warnings = []

        # Read and validate each example
        with open(dataset_path) as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue

                try:
                    example = json.loads(line)
                    validation_result = self._validate_example(example, line_num)
                    if validation_result['valid']:
                        examples.append(example)
                    else:
                        self.errors.extend(validation_result['errors'])
                        self.warnings.extend(validation_result['warnings'])
                except json.JSONDecodeError as e:
                    self.errors.append(f"Line {line_num}: Invalid JSON - {e}")

        # Calculate statistics
        stats = self._calculate_stats(examples)

        # Overall validation
        valid = len(self.errors) == 0

        return {
            'valid': valid,
            'errors': self.errors,
            'warnings': self.warnings,
            'stats': stats,
            'valid_examples': len(examples),
            'total_lines': line_num
        }

    def _validate_example(self, example: dict[str, Any], line_num: int) -> dict[str, Any]:
        """Validate a single example"""
        errors = []
        warnings = []

        # Check required fields
        required_fields = self.requirements.get('required_fields', ['messages'])
        for field in required_fields:
            if field not in example:
                errors.append(f"Line {line_num}: Missing required field '{field}'")

        # Validate messages
        if 'messages' in example:
            msg_errors, msg_warnings = self._validate_messages(example['messages'], line_num)
            errors.extend(msg_errors)
            warnings.extend(msg_warnings)

        # Validate system message (optional)
        if 'system' in example:
            system_content = example['system']
            if not isinstance(system_content, str):
                errors.append(f"Line {line_num}: System message must be a string")
            elif len(system_content) > 10000:
                warnings.append(f"Line {line_num}: System message is very long ({len(system_content)} chars)")

        # Check for extraneous keys
        allowed_keys = {'messages', 'system'}
        for key in example.keys():
            if key not in allowed_keys:
                warnings.append(f"Line {line_num}: Extraneous key '{key}' (will be ignored)")

        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }

    def _validate_messages(self, messages: list[dict[str, Any]], line_num: int) -> tuple:
        """Validate messages array"""
        errors = []
        warnings = []

        # Check minimum number of messages
        min_turns = self.quality_filters.get('min_conversation_turns', 2)
        if len(messages) < min_turns:
            errors.append(f"Line {line_num}: Need at least {min_turns} messages, got {len(messages)}")

        # Check maximum number of messages
        max_turns = self.quality_filters.get('max_conversation_turns', 50)
        if len(messages) > max_turns:
            warnings.append(f"Line {line_num}: Many messages ({len(messages)}), may exceed context limits")

        # Validate each message
        for i, msg in enumerate(messages):
            msg_errors, msg_warnings = self._validate_message(msg, line_num, i)
            errors.extend(msg_errors)
            warnings.extend(msg_warnings)

        # Check role alternation
        if self.quality_filters.get('required_alternating_roles', True):
            if not self._check_role_alternation(messages):
                errors.append(f"Line {line_num}: Messages must alternate between user and assistant")

        # Check first message is from user
        if messages and messages[0].get('role') != 'user':
            errors.append(f"Line {line_num}: First message must be from 'user', got '{messages[0].get('role')}'")

        # Check last message is from assistant
        if messages and messages[-1].get('role') != 'assistant':
            errors.append(f"Line {line_num}: Last message must be from 'assistant', got '{messages[-1].get('role')}'")

        return errors, warnings

    def _validate_message(self, msg: dict[str, Any], line_num: int, msg_index: int) -> tuple:
        """Validate a single message"""
        errors = []
        warnings = []

        # Check required fields
        if 'role' not in msg:
            errors.append(f"Line {line_num}, message {msg_index}: Missing 'role' field")
        elif msg['role'] not in ['user', 'assistant']:
            errors.append(f"Line {line_num}, message {msg_index}: Invalid role '{msg['role']}', must be 'user' or 'assistant'")

        if 'content' not in msg:
            errors.append(f"Line {line_num}, message {msg_index}: Missing 'content' field")
        else:
            content = msg['content']
            if not isinstance(content, str):
                errors.append(f"Line {line_num}, message {msg_index}: Content must be a string")
            else:
                # Check content length
                min_length = self.quality_filters.get('min_message_length', 10)
                max_length = self.quality_filters.get('max_message_length', 10000)

                if len(content) < min_length:
                    errors.append(f"Line {line_num}, message {msg_index}: Content too short ({len(content)} chars, min {min_length})")
                elif len(content) > max_length:
                    warnings.append(f"Line {line_num}, message {msg_index}: Content very long ({len(content)} chars, max {max_length})")

                # Check for empty content
                if self.quality_filters.get('filter_empty_messages', True) and not content.strip():
                    errors.append(f"Line {line_num}, message {msg_index}: Empty content")

        # Check for extraneous keys
        allowed_keys = {'role', 'content'}
        for key in msg.keys():
            if key not in allowed_keys:
                warnings.append(f"Line {line_num}, message {msg_index}: Extraneous key '{key}' (will be ignored)")

        return errors, warnings

    def _check_role_alternation(self, messages: list[dict[str, Any]]) -> bool:
        """Check that user and assistant messages alternate"""
        for i in range(len(messages) - 1):
            current_role = messages[i].get('role')
            next_role = messages[i + 1].get('role')

            if current_role == next_role:
                return False

            if current_role not in ['user', 'assistant']:
                return False

        return True

    def _calculate_stats(self, examples: list[dict[str, Any]]) -> dict[str, Any]:
        """Calculate dataset statistics"""
        if not examples:
            return {}

        total_messages = sum(len(ex.get('messages', [])) for ex in examples)
        total_chars = sum(
            sum(len(msg.get('content', '')) for msg in ex.get('messages', []))
            for ex in examples
        )

        avg_messages = total_messages / len(examples) if examples else 0
        avg_chars = total_chars / total_messages if total_messages > 0 else 0

        systems_count = sum(1 for ex in examples if 'system' in ex)

        return {
            'total_examples': len(examples),
            'total_messages': total_messages,
            'avg_messages_per_example': round(avg_messages, 2),
            'total_characters': total_chars,
            'avg_characters_per_message': round(avg_chars, 2),
            'examples_with_system': systems_count,
            'examples_without_system': len(examples) - systems_count
        }


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Validate dataset for fine-tuning")
    parser.add_argument(
        '--input',
        type=str,
        required=True,
        help='Input JSONL file path'
    )
    parser.add_argument(
        '--config',
        type=str,
        default=None,
        help='Path to configuration file'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Show detailed validation results'
    )

    args = parser.parse_args()

    validator = DatasetValidator(args.config)
    result = validator.validate(args.input)

    # Print results
    print(f"\n{'='*60}")
    print("Dataset Validation Results")
    print(f"{'='*60}\n")

    if result['valid']:
        print("✅ Dataset is VALID")
    else:
        print("❌ Dataset has ERRORS")

    print("\nStatistics:")
    stats = result['stats']
    for key, value in stats.items():
        print(f"  {key}: {value}")

    if result['errors']:
        print(f"\n❌ Errors ({len(result['errors'])}):")
        for error in result['errors'][:10]:  # Show first 10
            print(f"  - {error}")
        if len(result['errors']) > 10:
            print(f"  ... and {len(result['errors']) - 10} more errors")

    if result['warnings']:
        print(f"\n⚠️  Warnings ({len(result['warnings'])}):")
        for warning in result['warnings'][:10]:  # Show first 10
            print(f"  - {warning}")
        if len(result['warnings']) > 10:
            print(f"  ... and {len(result['warnings']) - 10} more warnings")

    print(f"\n{'='*60}\n")

    return 0 if result['valid'] else 1


if __name__ == '__main__':
    exit(main())


