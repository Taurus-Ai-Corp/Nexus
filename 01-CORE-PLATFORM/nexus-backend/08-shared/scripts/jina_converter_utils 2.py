"""
Jina AI Converter Utilities
Simple wrapper functions for easy URL conversion to Markdown or JSON format
"""

from url_to_md_json_converter import JinaAIConverter
import json
from datetime import datetime
from urllib.parse import urlparse
from pathlib import Path

def convert_url_to_markdown(url, use_readerlm_v2=True, gather_links=False, api_key="jina_492c48beb31643e3b5a81c4052fa0628fS7ORRidO2zZAueI2W9OgX1QPDML"):
    """
    Convert a URL to Markdown format

    Args:
        url (str): The URL to convert
        use_readerlm_v2 (bool): Use ReaderLM-v2 for better quality (default: True)
        gather_links (bool): Extract all links from the page (default: False)
        api_key (str): Jina AI API key (optional, uses default if not provided)

    Returns:
        str: Markdown content or None if conversion failed
    """
    converter = JinaAIConverter(api_key)
    return converter.convert_url(
        url,
        use_readerlm_v2=use_readerlm_v2,
        gather_links=gather_links,
        json_response=False
    )

def convert_url_to_json(url, use_readerlm_v2=True, gather_links=False, api_key="jina_492c48beb31643e3b5a81c4052fa0628fS7ORRidO2zZAueI2W9OgX1QPDML"):
    """
    Convert a URL to JSON format

    Args:
        url (str): The URL to convert
        use_readerlm_v2 (bool): Use ReaderLM-v2 for better quality (default: True)
        gather_links (bool): Extract all links from the page (default: False)
        api_key (str): Jina AI API key (optional, uses default if not provided)

    Returns:
        dict: JSON response or None if conversion failed
    """
    converter = JinaAIConverter(api_key)
    return converter.convert_url(
        url,
        use_readerlm_v2=use_readerlm_v2,
        gather_links=gather_links,
        json_response=True
    )

def save_url_content(url, output_format='md', output_file=None, use_readerlm_v2=True, api_key="jina_492c48beb31643e3b5a81c4052fa0628fS7ORRidO2zZAueI2W9OgX1QPDML"):
    """
    Convert URL and save to file

    Args:
        url (str): The URL to convert
        output_format (str): 'md' or 'json' (default: 'md')
        output_file (str): Output filename (optional, auto-generated if not provided)
        use_readerlm_v2 (bool): Use ReaderLM-v2 for better quality (default: True)
        api_key (str): Jina AI API key (optional, uses default if not provided)

    Returns:
        bool: True if successful, False otherwise
    """
    converter = JinaAIConverter(api_key)

    json_response = output_format == 'json'
    content = converter.convert_url(
        url,
        use_readerlm_v2=use_readerlm_v2,
        gather_links=False,
        json_response=json_response
    )

    if content:
        return converter.save_to_file(content, url, output_format, output_file)
    return False

# Example usage functions
def quick_convert_to_markdown(url, filename=None):
    """Quick function to convert URL to markdown and save with auto-generated filename"""
    return save_url_content(url, 'md', filename, use_readerlm_v2=True)

def quick_convert_to_json(url, filename=None):
    """Quick function to convert URL to JSON and save with auto-generated filename"""
    return save_url_content(url, 'json', filename, use_readerlm_v2=True)

if __name__ == "__main__":
    # Simple test
    test_url = "https://example.com"
    print("Testing Jina AI Converter...")

    # Test markdown conversion
    print(f"\nConverting {test_url} to markdown...")
    content = convert_url_to_markdown(test_url)
    if content:
        print("✅ Markdown conversion successful!")
        print(f"Content length: {len(content)} characters")
    else:
        print("❌ Markdown conversion failed")

    # Test JSON conversion
    print(f"\nConverting {test_url} to JSON...")
    json_content = convert_url_to_json(test_url)
    if json_content:
        print("✅ JSON conversion successful!")
        print(f"JSON keys: {list(json_content.keys()) if isinstance(json_content, dict) else 'Not a dict'}")
    else:
        print("❌ JSON conversion failed")
