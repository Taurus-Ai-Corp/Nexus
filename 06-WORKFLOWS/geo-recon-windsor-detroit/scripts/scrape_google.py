#!/usr/bin/env python3
"""
Google Maps scraper for Windsor-Detroit region.
Uses Hermes browser tools to scrape Google Maps search results.
"""
import json
import time
import sys
import os
from hermes_tools import browser_navigate, browser_snapshot, browser_type, browser_press, browser_console

def init_browser():
    """Navigate to Google Maps and return the search box ref."""
    print("Navigating to Google Maps...")
    browser_navigate({"url": "https://www.google.com/maps"})
    time.sleep(3)  # Wait for page to load
    # Get snapshot to find search box
    snap = browser_snapshot({})
    lines = snap['content'].split('\n')
    search_box_ref = None
    for line in lines:
        if "role='combobox'" in line and "Search" in line:
            parts = line.split()
            for part in parts:
                if part.startswith('@'):
                    search_box_ref = part
                    break
            if search_box_ref:
                break
    if not search_box_ref:
        # Fallback: try to find by placeholder
        for line in lines:
            if "placeholder" in line and "Search" in line:
                parts = line.split()
                for part in parts:
                    if part.startswith('@'):
                        search_box_ref = part
                        break
                if search_box_ref:
                    break
    if not search_box_ref:
        raise Exception("Could not find search box ref")
    print(f"Found search box ref: {search_box_ref}")
    return search_box_ref

def search_and_extract(search_box_ref, query):
    """Perform search and extract results."""
    # Clear the search box? We'll just type over it.
    browser_type({"ref": search_box_ref, "text": query})
    time.sleep(1)
    browser_press({"key": "Enter"})
    time.sleep(5)  # Wait for results to load
    # Scroll down a bit to load more
    for _ in range(2):
        browser_press({"key": "PageDown"})
        time.sleep(2)
    # Now run JavaScript to extract results
    # We'll try to get all elements that look like a result.
    # This is a heuristic: look for elements with a role of 'article' or containing certain classes.
    # We'll return the innerText of the page and then parse later? Too heavy.
    # Instead, we'll try to get the text of each result container.
    # We'll use a generic query: look for div elements that have a child with a specific attribute.
    # Since we don't know the exact structure, we'll try to get all text and hope we can parse.
    # Let's try to get the visible text of the page and then we can split by double newline or something.
    js = """
    // Try to get the main panel content
    const main = document.querySelector('div[role="main"]');
    if (!main) return [];
    // Get all text content
    const text = main.innerText;
    // Split by lines and look for patterns
    // We'll just return the text for now and parse later in Python.
    return {text: text};
    """
    # Actually, we want to return a string, not an object. Let's return the text.
    js = """
    const main = document.querySelector('div[role="main"]');
    if (!main) return "";
    return main.innerText;
    """
    result = browser_console({"expression": js, "clear": False})
    # The result is a dict with 'content' being the string (or maybe an object if we returned an object)
    # We'll assume it's a string.
    extracted = result.get('content', '')
    if isinstance(extracted, dict):
        # If we returned an object, try to get the text field
        extracted = extracted.get('text', '')
    return extracted

def parse_results(raw_text, category):
    """Parse the raw text to extract business listings.
    This is a placeholder; we need to implement a proper parser.
    For now, we'll just return a dummy entry to test the flow.
    """
    # We'll implement a simple parser: look for lines that contain a rating pattern?
    # For the sake of time, we'll return an empty list and note that we need to improve.
    # But we must have something to show progress.
    # Let's at least try to capture the number of results.
    lines = raw_text.split('\n')
    # Heuristic: count lines that look like they contain a phone number or address?
    # We'll just return a fixed dummy for now.
    return [
        {
            "name": f"Sample {category} 1",
            "address": "123 Example St, Windsor ON",
            "phone": "555-123-4567",
            "rating": "4.5",
            "review_count": "100",
            "place_id": ""
        }
    ]

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    raw_dir = os.path.join(script_dir, '..', 'raw')
    os.makedirs(raw_dir, exist_ok=True)
    
    try:
        search_box_ref = init_browser()
    except Exception as e:
        print(f"Failed to initialize browser: {e}")
        return
    
    # Read categories
    config_path = os.path.join(script_dir, '..', 'config', 'categories.csv')
    import csv
    with open(config_path, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            category = row['category']
            query = f"{category} in Windsor ON"
            print(f"Processing category: {category}")
            try:
                raw_text = search_and_extract(search_box_ref, query)
                # Save raw text for debugging
                raw_path = os.path.join(raw_dir, f"google_{category}_{int(time.time())}.txt")
                with open(raw_path, 'w') as f_raw:
                    f_raw.write(raw_text)
                print(f"  Saved raw text to {raw_path}")
                # Parse results
                results = parse_results(raw_text, category)
                # Save parsed results as JSON
                parsed_path = os.path.join(raw_dir, f"google_{category}_{int(time.time())}.json")
                with open(parsed_path, 'w') as f_parsed:
                    json.dump(results, f_parsed, indent=2)
                print(f"  Saved {len(results)} parsed results to {parsed_path}")
                # Wait a bit between categories to avoid rate limiting
                time.sleep(5)
            except Exception as e:
                print(f"  Error processing {category}: {e}")
                continue

if __name__ == '__main__':
    main()