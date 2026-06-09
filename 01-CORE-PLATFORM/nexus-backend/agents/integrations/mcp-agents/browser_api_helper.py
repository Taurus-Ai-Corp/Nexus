#!/usr/bin/env python3
"""
Browser API Helper
Uses Playwright to help automate API key acquisition process
"""

import asyncio
import time
from playwright.async_api import async_playwright

async def help_with_perplexity():
    """Help with Perplexity API key acquisition"""
    print("🔑 Helping with Perplexity API Key...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            # Navigate to Perplexity
            await page.goto("https://www.perplexity.ai/settings/api")
            await page.wait_for_load_state('networkidle')
            
            print("✅ Perplexity page loaded")
            print("📋 Instructions:")
            print("1. Sign in with your account")
            print("2. Look for 'API Keys' or 'Settings' section")
            print("3. Click 'Create API Key' or similar button")
            print("4. Copy the generated key")
            
            # Wait for user to complete
            input("Press Enter when you have your Perplexity API key...")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            await browser.close()

async def help_with_firecrawl():
    """Help with Firecrawl API key acquisition"""
    print("🔑 Helping with Firecrawl API Key...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            # Navigate to Firecrawl
            await page.goto("https://firecrawl.dev/dashboard")
            await page.wait_for_load_state('networkidle')
            
            print("✅ Firecrawl page loaded")
            print("📋 Instructions:")
            print("1. Sign up or log in")
            print("2. Go to Dashboard")
            print("3. Find 'API Keys' section")
            print("4. Generate new API key")
            
            # Wait for user to complete
            input("Press Enter when you have your Firecrawl API key...")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            await browser.close()

async def help_with_anthropic():
    """Help with Anthropic API key acquisition"""
    print("🔑 Helping with Anthropic API Key...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            # Navigate to Anthropic
            await page.goto("https://console.anthropic.com/")
            await page.wait_for_load_state('networkidle')
            
            print("✅ Anthropic page loaded")
            print("📋 Instructions:")
            print("1. Sign up or log in")
            print("2. Go to API Keys section")
            print("3. Click 'Create Key'")
            print("4. Copy the generated key")
            
            # Wait for user to complete
            input("Press Enter when you have your Anthropic API key...")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            await browser.close()

async def help_with_openai():
    """Help with OpenAI API key acquisition"""
    print("🔑 Helping with OpenAI API Key...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            # Navigate to OpenAI
            await page.goto("https://platform.openai.com/api-keys")
            await page.wait_for_load_state('networkidle')
            
            print("✅ OpenAI page loaded")
            print("📋 Instructions:")
            print("1. Sign up or log in")
            print("2. Go to API Keys page")
            print("3. Click 'Create new secret key'")
            print("4. Copy the generated key")
            
            # Wait for user to complete
            input("Press Enter when you have your OpenAI API key...")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            await browser.close()

async def main():
    """Main function to help with all API keys"""
    print("🤖 Browser API Helper")
    print("=" * 40)
    print("I'll open each service and guide you through the process!")
    print()
    
    services = [
        ("Perplexity", help_with_perplexity),
        ("Firecrawl", help_with_firecrawl),
        ("Anthropic", help_with_anthropic),
        ("OpenAI", help_with_openai)
    ]
    
    for name, func in services:
        print(f"🚀 Starting {name}...")
        await func()
        print(f"✅ {name} completed!")
        print()
        time.sleep(2)
    
    print("🎉 All services completed!")
    print("Now run: python add_api_keys.py")

if __name__ == "__main__":
    asyncio.run(main())
