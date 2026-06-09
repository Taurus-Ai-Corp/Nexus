# Jina AI URL Converter

Convert any web URL to Markdown (.md) or JSON (.json) format using Jina AI ReaderLM-v2 API.

## Quick Start

### Command Line Usage

```bash
# Basic usage - convert to markdown
python url_to_md_json_converter.py https://example.com

# Convert to JSON format
python url_to_md_json_converter.py https://example.com --format json

# Use ReaderLM-v2 for better quality
python url_to_md_json_converter.py https://example.com --readerlm-v2

# Save to specific file
python url_to_md_json_converter.py https://example.com --output my_content.md

# Extract links as well
python url_to_md_json_converter.py https://example.com --gather-links --readerlm-v2
```

### Python Import Usage

```python
from jina_converter_utils import convert_url_to_markdown, convert_url_to_json, save_url_content

# Convert URL to markdown (returns string)
content = convert_url_to_markdown("https://example.com")
print(content)

# Convert URL to JSON (returns dict)
json_data = convert_url_to_json("https://example.com")
print(json_data)

# Convert and save to file
save_url_content("https://example.com", "md", "output.md")

# Quick functions
from jina_converter_utils import quick_convert_to_markdown, quick_convert_to_json
quick_convert_to_markdown("https://example.com")
quick_convert_to_json("https://example.com")
```

## Features

✅ **ReaderLM-v2 Support** - Enhanced content extraction quality
✅ **Multiple Output Formats** - Markdown (.md) and JSON (.json)
✅ **Link Extraction** - Optional gathering of all page links
✅ **Auto File Naming** - Automatic filename generation with timestamps
✅ **Error Handling** - Comprehensive error handling and logging
✅ **Easy Integration** - Import and use in your own scripts

## API Parameters

- `--url` - The URL to convert (required)
- `--format` - Output format: `md` or `json` (default: md)
- `--output` - Output filename (optional, auto-generated if not provided)
- `--readerlm-v2` - Use ReaderLM-v2 for better quality
- `--gather-links` - Extract and include all links from the page
- `--api-key` - Your Jina AI API key (optional, uses default)

## Examples

### Convert a blog post to markdown
```bash
python url_to_md_json_converter.py https://blog.example.com/post-1 --readerlm-v2
```

### Convert documentation to JSON
```bash
python url_to_md_json_converter.py https://docs.example.com/api --format json --output api_docs.json
```

### Batch processing (in Python)
```python
from jina_converter_utils import save_url_content

urls = [
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3"
]

for i, url in enumerate(urls):
    filename = f"page_{i+1}.md"
    save_url_content(url, "md", filename)
```

## Output

### Markdown Format
Clean, readable markdown with proper formatting, headings, links, and structure.

### JSON Format
Structured data including:
- Extracted content
- Metadata
- Links (if requested)
- Processing information

## Configuration

The API key is pre-configured in the script. If you need to use a different key, you can:
1. Pass it via `--api-key` parameter
2. Set it as an environment variable: `export JINA_API_KEY=your_key_here`
3. Modify the default in the script

## Error Handling

The script handles various error scenarios:
- Invalid URLs
- Network timeouts
- API rate limits
- Authentication errors
- File system errors

## Integration with Your Existing System

Since you already have Jina AI integration in your BizFlow-Orchestrator, you can:

1. **Use the command-line script** for quick conversions
2. **Import the utilities** in your existing Python scripts
3. **Combine with your workflow** - the tool works alongside your existing Jina blocks
4. **Batch processing** - convert multiple URLs programmatically

## Tips

- **Use ReaderLM-v2** (`--readerlm-v2`) for better quality content extraction
- **JSON format** is great for programmatic processing
- **Auto-generated filenames** include timestamps to avoid conflicts
- **Link extraction** (`--gather-links`) is useful for content analysis
- **Large pages** may take longer to process - the script has a 30-second timeout

## Troubleshooting

1. **API Key Issues**: Make sure your Jina AI API key is valid and has sufficient credits
2. **Network Issues**: Check your internet connection
3. **Timeout Errors**: Some pages take longer to process - try without ReaderLM-v2 first
4. **Rate Limits**: Jina AI has rate limits - the script will show error messages

Your Jina AI ReaderLM-v2 integration is now ready to use! 🎉
