#!/usr/bin/env python3
"""
Dataset Preparation Pipeline for Gen AI Fine-Tuning
Converts various data sources to JSONL format required by Anthropic API
"""

import json
import argparse
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
import yaml

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatasetPreparer:
    """Prepare datasets for fine-tuning from various sources"""
    
    def __init__(self, config_path: Optional[str] = None):
        """Initialize dataset preparer with configuration"""
        self.config = self._load_config(config_path)
        self.quality_filters = self.config.get('dataset', {}).get('quality_filters', {})
    
    def _load_config(self, config_path: Optional[str]) -> Dict[str, Any]:
        """Load configuration from YAML file"""
        if config_path is None:
            config_path = Path(__file__).parent.parent / "config" / "finetuning_config.yaml"
        
        config_path = Path(config_path)
        if not config_path.exists():
            logger.warning(f"Config file not found: {config_path}, using defaults")
            return {}
        
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)
    
    def prepare_from_agent_conversations(
        self,
        conversations: List[Dict[str, Any]],
        output_path: str,
        system_message: Optional[str] = None
    ) -> int:
        """Convert agent conversations to JSONL format"""
        logger.info(f"Preparing dataset from {len(conversations)} conversations")
        
        examples = []
        for conv in conversations:
            example = self._convert_conversation(conv, system_message)
            if self._validate_example(example):
                examples.append(example)
        
        logger.info(f"Validated {len(examples)} examples from {len(conversations)} conversations")
        
        return self._write_jsonl(examples, output_path)
    
    def prepare_from_memory_mcp(
        self,
        knowledge_entries: List[Dict[str, Any]],
        output_path: str,
        system_message: Optional[str] = None
    ) -> int:
        """Extract training examples from Memory MCP knowledge graph"""
        logger.info(f"Preparing dataset from {len(knowledge_entries)} knowledge entries")
        
        examples = []
        for entry in knowledge_entries:
            example = self._convert_knowledge_entry(entry, system_message)
            if self._validate_example(example):
                examples.append(example)
        
        logger.info(f"Validated {len(examples)} examples from {len(knowledge_entries)} entries")
        
        return self._write_jsonl(examples, output_path)
    
    def prepare_from_code_examples(
        self,
        code_examples: List[Dict[str, Any]],
        output_path: str,
        system_message: Optional[str] = None
    ) -> int:
        """Convert code examples to training format"""
        logger.info(f"Preparing dataset from {len(code_examples)} code examples")
        
        examples = []
        for example_data in code_examples:
            example = self._convert_code_example(example_data, system_message)
            if self._validate_example(example):
                examples.append(example)
        
        logger.info(f"Validated {len(examples)} examples from {len(code_examples)} code examples")
        
        return self._write_jsonl(examples, output_path)
    
    def _convert_conversation(
        self,
        conv: Dict[str, Any],
        system_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """Convert a conversation to Anthropic format"""
        messages = []
        
        # Add system message if provided
        if system_message:
            messages.append({"role": "system", "content": system_message})
        
        # Extract messages from conversation
        conv_messages = conv.get('messages', [])
        if not conv_messages and 'content' in conv:
            # Single message format
            conv_messages = [conv]
        
        for msg in conv_messages:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            
            # Map roles to Anthropic format
            if role in ['user', 'assistant']:
                messages.append({"role": role, "content": content})
            elif role == 'system':
                # System messages go in the system field, not messages array
                if not system_message:
                    system_message = content
        
        result = {"messages": messages}
        if system_message:
            result["system"] = system_message
        
        return result
    
    def _convert_knowledge_entry(
        self,
        entry: Dict[str, Any],
        system_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """Convert Memory MCP knowledge entry to training format"""
        messages = []
        
        # Create user message from query/context
        user_content = entry.get('query', entry.get('content', ''))
        if entry.get('context'):
            user_content = f"Context: {entry.get('context')}\n\nQuery: {user_content}"
        
        messages.append({"role": "user", "content": user_content})
        
        # Create assistant message from knowledge/answer
        assistant_content = entry.get('answer', entry.get('knowledge', entry.get('content', '')))
        messages.append({"role": "assistant", "content": assistant_content})
        
        result = {"messages": messages}
        if system_message:
            result["system"] = system_message
        
        return result
    
    def _convert_code_example(
        self,
        example: Dict[str, Any],
        system_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """Convert code example to training format"""
        messages = []
        
        # User asks about code
        code = example.get('code', '')
        language = example.get('language', '')
        question = example.get('question', f'Explain this {language} code:')
        
        user_content = f"{question}\n\n```{language}\n{code}\n```"
        messages.append({"role": "user", "content": user_content})
        
        # Assistant explains
        explanation = example.get('explanation', example.get('answer', ''))
        messages.append({"role": "assistant", "content": explanation})
        
        result = {"messages": messages}
        if system_message:
            result["system"] = system_message
        
        return result
    
    def _validate_example(self, example: Dict[str, Any]) -> bool:
        """Validate example against quality filters"""
        messages = example.get('messages', [])
        
        # Check minimum number of messages
        min_turns = self.quality_filters.get('min_conversation_turns', 2)
        if len(messages) < min_turns:
            return False
        
        # Check message length
        min_length = self.quality_filters.get('min_message_length', 10)
        max_length = self.quality_filters.get('max_message_length', 10000)
        
        for msg in messages:
            content = msg.get('content', '')
            if len(content) < min_length or len(content) > max_length:
                return False
        
        # Check role alternation
        if self.quality_filters.get('required_alternating_roles', True):
            if not self._check_role_alternation(messages):
                return False
        
        # Check required fields
        if 'messages' not in example:
            return False
        
        # Check first and last roles
        if messages[0]['role'] != 'user':
            return False
        
        if messages[-1]['role'] != 'assistant':
            return False
        
        return True
    
    def _check_role_alternation(self, messages: List[Dict[str, Any]]) -> bool:
        """Check that user and assistant messages alternate"""
        for i in range(len(messages) - 1):
            current_role = messages[i]['role']
            next_role = messages[i + 1]['role']
            
            if current_role == next_role:
                return False
            
            if current_role not in ['user', 'assistant']:
                return False
        
        return True
    
    def _write_jsonl(self, examples: List[Dict[str, Any]], output_path: str) -> int:
        """Write examples to JSONL file"""
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            for example in examples:
                f.write(json.dumps(example) + '\n')
        
        logger.info(f"Wrote {len(examples)} examples to {output_path}")
        return len(examples)
    
    def augment_dataset(
        self,
        input_path: str,
        output_path: str,
        augmentation_ratio: float = 0.2
    ) -> int:
        """Augment dataset with variations (placeholder for future implementation)"""
        # TODO: Implement data augmentation
        logger.warning("Data augmentation not yet implemented, copying original dataset")
        
        input_path = Path(input_path)
        output_path = Path(output_path)
        
        # For now, just copy the file
        import shutil
        shutil.copy(input_path, output_path)
        
        # Count examples
        count = 0
        with open(output_path, 'r') as f:
            for line in f:
                if line.strip():
                    count += 1
        
        logger.info(f"Copied {count} examples to {output_path}")
        return count


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Prepare dataset for fine-tuning")
    parser.add_argument(
        '--source',
        choices=['agent_conversations', 'memory_mcp', 'code_examples'],
        required=True,
        help='Data source type'
    )
    parser.add_argument(
        '--input',
        type=str,
        required=True,
        help='Input file path (JSON)'
    )
    parser.add_argument(
        '--output',
        type=str,
        required=True,
        help='Output JSONL file path'
    )
    parser.add_argument(
        '--system',
        type=str,
        default=None,
        help='System message to add to all examples'
    )
    parser.add_argument(
        '--config',
        type=str,
        default=None,
        help='Path to configuration file'
    )
    parser.add_argument(
        '--augment',
        action='store_true',
        help='Apply data augmentation'
    )
    
    args = parser.parse_args()
    
    # Load input data
    input_path = Path(args.input)
    if not input_path.exists():
        logger.error(f"Input file not found: {input_path}")
        return 1
    
    with open(input_path, 'r') as f:
        data = json.load(f)
    
    # Initialize preparer
    preparer = DatasetPreparer(args.config)
    
    # Prepare dataset based on source
    if args.source == 'agent_conversations':
        if isinstance(data, list):
            conversations = data
        else:
            conversations = data.get('conversations', [])
        
        count = preparer.prepare_from_agent_conversations(
            conversations,
            args.output,
            args.system
        )
    
    elif args.source == 'memory_mcp':
        if isinstance(data, list):
            entries = data
        else:
            entries = data.get('entries', data.get('knowledge', []))
        
        count = preparer.prepare_from_memory_mcp(
            entries,
            args.output,
            args.system
        )
    
    elif args.source == 'code_examples':
        if isinstance(data, list):
            examples = data
        else:
            examples = data.get('examples', [])
        
        count = preparer.prepare_from_code_examples(
            examples,
            args.output,
            args.system
        )
    
    # Apply augmentation if requested
    if args.augment:
        augmented_path = args.output.replace('.jsonl', '_augmented.jsonl')
        count = preparer.augment_dataset(args.output, augmented_path)
        logger.info(f"Augmented dataset saved to {augmented_path}")
    
    logger.info(f"✅ Dataset preparation complete: {count} examples")
    return 0


if __name__ == '__main__':
    exit(main())


