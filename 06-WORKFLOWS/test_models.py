import os

import anthropic
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Test available models
models_to_test = [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet-20241220",
    "claude-3-5-sonnet-latest",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307"
]

for model in models_to_test:
    try:
        response = client.messages.create(
            model=model,
            max_tokens=10,
            messages=[{"role": "user", "content": "Hello"}]
        )
        print(f"✅ {model} - WORKS")
        break
    except Exception as e:
        print(f"❌ {model} - {str(e)[:100]}")
