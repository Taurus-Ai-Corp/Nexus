#!/usr/bin/env python3
"""
Jina AI URL Converter Script
Converts web URLs to Markdown or JSON format using Jina AI ReaderLM-v2 API

Usage:
    python url_to_md_json_converter.py <url> [--format md|json] [--output filename] [--readerlm-v2]

Examples:
    python url_to_md_json_converter.py https://example.com
    python url_to_md_json_converter.py https://example.com --format json --output output.json
    python url_to_md_json_converter.py https://example.com --readerlm-v2
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

import requests


class JinaAIConverter:
    def __init__(self, api_key="jina_492c48beb31643e3b5a81c4052fa0628fS7ORRidO2zZAueI2W9OgX1QPDML"):
        self.api_key = api_key
        self.base_url = "https://r.jina.ai/"

    def convert_url(self, url, use_readerlm_v2=False, gather_links=False, json_response=False):
        """Convert URL to markdown or JSON using Jina AI API"""

        # Clean the URL
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url

        # Construct the API URL
        api_url = f"{self.base_url}{url}"

        # Prepare headers
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Accept': 'application/json' if json_response else 'text/plain'
        }

        # Add optional headers
        if use_readerlm_v2:
            headers['X-Respond-With'] = 'readerlm-v2'

        if gather_links:
            headers['X-With-Links-Summary'] = 'true'

        try:
            print(f"🔄 Converting URL: {url}")
            print(f"📊 Using ReaderLM-v2: {'✅' if use_readerlm_v2 else '❌'}")
            print(f"🔗 Gathering links: {'✅' if gather_links else '❌'}")

            response = requests.get(api_url, headers=headers, timeout=120)
            response.raise_for_status()

            if json_response:
                result = response.json()
                # Jina AI returns data in result['data'] field
                if 'data' in result:
                    return result['data']
                return result
            else:
                # For markdown, clean up the response if it's wrapped in markdown code blocks
                text = response.text
                if text.startswith('```markdown') and text.endswith('```'):
                    text = text[11:-3].strip()
                elif text.startswith('```') and text.endswith('```'):
                    # Handle other code block formats
                    lines = text.split('\n')
                    if len(lines) > 2:
                        text = '\n'.join(lines[1:-1])
                return text

        except requests.exceptions.RequestException as e:
            print(f"❌ Error converting URL: {e}")
            return None
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return None

    def save_to_file(self, content, url, output_format, output_file=None):
        """Save content to file with automatic filename generation if needed"""

        if not content:
            print("❌ No content to save")
            return False

        # Generate filename if not provided
        if not output_file:
            domain = urlparse(url).netloc.replace('www.', '')
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"{domain}_{timestamp}.{output_format}"

        # Ensure output directory exists
        Path(output_file).parent.mkdir(parents=True, exist_ok=True)

        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                if isinstance(content, dict):
                    json.dump(content, f, indent=2, ensure_ascii=False)
                else:
                    f.write(content)
            print(f"✅ Content saved to: {output_file}")
            return True
        except Exception as e:
            print(f"❌ Error saving file: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Convert URLs to Markdown or JSON using Jina AI')
    parser.add_argument('url', help='URL to convert')
    parser.add_argument('--format', '-f', choices=['md', 'json'], default='md',
                       help='Output format (default: md)')
    parser.add_argument('--output', '-o', help='Output filename')
    parser.add_argument('--readerlm-v2', action='store_true',
                       help='Use ReaderLM-v2 for better quality')
    parser.add_argument('--gather-links', action='store_true',
                       help='Extract and include all links from the page')
    parser.add_argument('--api-key', help='Jina AI API key (optional, uses default if not provided)')

    args = parser.parse_args()

    # Initialize converter
    api_key = args.api_key or "jina_492c48beb31643e3b5a81c4052fa0628fS7ORRidO2zZAueI2W9OgX1QPDML"
    converter = JinaAIConverter(api_key)

    # Convert URL
    json_response = args.format == 'json'
    content = converter.convert_url(
        args.url,
        use_readerlm_v2=args.readerlm_v2,
        gather_links=args.gather_links,
        json_response=json_response
    )

    if content:
        # Save to file
        success = converter.save_to_file(content, args.url, args.format, args.output)

        if success:
            # Also print to console for immediate viewing
            print("\n" + "="*60)
            print("📄 CONVERTED CONTENT:")
            print("="*60)
            if args.format == 'json':
                print(json.dumps(content, indent=2, ensure_ascii=False))
            else:
                print(content)
            print("="*60)
        else:
            print("❌ Failed to save content to file")
    else:
        print("❌ Failed to convert URL")
        sys.exit(1)

if __name__ == "__main__":
    main()
