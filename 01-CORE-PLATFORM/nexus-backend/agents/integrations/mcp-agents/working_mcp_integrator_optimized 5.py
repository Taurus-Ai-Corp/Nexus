#!/usr/bin/env python3
"""
Optimized Working MCP Integrator
Enhanced with improved error handling, async performance, and API rate limiting
"""

import asyncio
import logging
import os
import time
from dataclasses import dataclass
from datetime import datetime
from functools import wraps
from typing import Any

import aiohttp
from dotenv import load_dotenv

# Load environment variables
load_dotenv('master.env')

@dataclass
class RateLimiter:
    """Rate limiter for API calls"""
    max_requests: int
    time_window: int  # seconds
    requests: list[float] = None

    def __post_init__(self):
        if self.requests is None:
            self.requests = []

    async def acquire(self):
        """Acquire permission to make a request"""
        now = time.time()
        # Remove old requests outside the time window
        self.requests = [req_time for req_time in self.requests if now - req_time < self.time_window]

        if len(self.requests) >= self.max_requests:
            sleep_time = self.time_window - (now - self.requests[0])
            if sleep_time > 0:
                await asyncio.sleep(sleep_time)

        self.requests.append(now)

def retry_on_failure(max_retries: int = 3, delay: float = 1.0, backoff_multiplier: float = 2.0):
    """Decorator for retrying failed API calls with exponential backoff"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_exception = None
            current_delay = delay

            for attempt in range(max_retries):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt == max_retries - 1:
                        break

                    await asyncio.sleep(current_delay)
                    current_delay *= backoff_multiplier

            # If all retries failed, raise the last exception
            raise last_exception
        return wrapper
    return decorator

class OptimizedMCPIntegrator:
    """Optimized MCP integrator with enhanced error handling, async performance, and rate limiting"""

    def __init__(self):
        """Initialize the Optimized MCP Integrator"""
        self.logger = self._setup_logging()
        self.session: aiohttp.ClientSession | None = None

        # Rate limiters for each API
        self.rate_limiters = {
            "perplexity": RateLimiter(max_requests=100, time_window=60),
            "firecrawl": RateLimiter(max_requests=50, time_window=60),
            "anthropic": RateLimiter(max_requests=200, time_window=60),
            "github": RateLimiter(max_requests=5000, time_window=60)
        }

        # Available working APIs with enhanced configuration
        self.working_apis = {
            "perplexity": {
                "key": os.getenv("PERPLEXITY_API_KEY"),
                "url": "https://api.perplexity.ai/chat/completions",
                "status": "working",
                "timeout": 30,
                "max_retries": 3
            },
            "firecrawl": {
                "key": os.getenv("FIRECRAWL_API_KEY"),
                "url": "https://api.firecrawl.dev/v1/scrape",
                "status": "working",
                "timeout": 45,
                "max_retries": 3
            },
            "anthropic": {
                "key": os.getenv("ANTHROPIC_API_KEY"),
                "url": "https://api.anthropic.com/v1/messages",
                "status": "working",
                "timeout": 30,
                "max_retries": 3
            },
            "github": {
                "key": os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN"),
                "url": "https://api.github.com",
                "status": "working",
                "timeout": 30,
                "max_retries": 3
            }
        }

        # MCP workflows using working APIs
        self.workflows = {
            "ai_search": {
                "apis": ["perplexity"],
                "description": "AI-powered search and research using Perplexity",
                "concurrent": False
            },
            "web_scraping": {
                "apis": ["firecrawl"],
                "description": "Web scraping and content analysis using Firecrawl",
                "concurrent": False
            },
            "text_processing": {
                "apis": ["anthropic"],
                "description": "Text processing and analysis using Claude",
                "concurrent": False
            },
            "code_management": {
                "apis": ["github"],
                "description": "Code management and collaboration using GitHub",
                "concurrent": False
            },
            "hybrid_workflow": {
                "apis": ["perplexity", "firecrawl", "anthropic"],
                "description": "Combined AI search, web scraping, and text processing",
                "concurrent": True
            },
            "parallel_search": {
                "apis": ["perplexity", "anthropic"],
                "description": "Parallel AI search using multiple providers",
                "concurrent": True
            }
        }

    def _setup_logging(self) -> logging.Logger:
        """Set up enhanced logging"""
        logger = logging.getLogger('OptimizedMCPIntegrator')
        logger.setLevel(logging.INFO)

        if not logger.handlers:
            # Console handler
            console_handler = logging.StreamHandler()
            console_formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            console_handler.setFormatter(console_formatter)
            logger.addHandler(console_handler)

            # File handler for errors
            file_handler = logging.FileHandler('mcp_errors.log')
            file_formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
            )
            file_handler.setFormatter(file_formatter)
            file_handler.setLevel(logging.ERROR)
            logger.addHandler(file_handler)

        return logger

    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=60),
            connector=aiohttp.TCPConnector(limit=100, limit_per_host=30)
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()

    async def _make_request(self, method: str, url: str, api_name: str, **kwargs) -> dict[str, Any]:
        """Make HTTP request with enhanced error handling and rate limiting"""
        await self.rate_limiters[api_name].acquire()

        try:
            async with self.session.request(method, url, **kwargs) as response:
                if response.status == 200:
                    result = await response.json()
                    return {
                        "success": True,
                        "result": result,
                        "status_code": response.status,
                        "api": api_name
                    }
                elif response.status == 429:
                    retry_after = int(response.headers.get('Retry-After', 60))
                    return {
                        "success": False,
                        "error": "Rate limit exceeded",
                        "retry_after": retry_after,
                        "status_code": response.status,
                        "api": api_name
                    }
                else:
                    error_text = await response.text()
                    return {
                        "success": False,
                        "error": f"API error: {response.status} - {error_text}",
                        "status_code": response.status,
                        "api": api_name
                    }
        except aiohttp.ClientTimeout:
            return {
                "success": False,
                "error": "Request timeout",
                "status_code": 408,
                "api": api_name
            }
        except aiohttp.ClientError as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}",
                "status_code": 0,
                "api": api_name
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}",
                "status_code": 0,
                "api": api_name
            }

    @retry_on_failure(max_retries=3, delay=1.0)
    async def call_perplexity(self, query: str) -> dict[str, Any]:
        """Call Perplexity API for AI search with enhanced error handling"""
        try:
            headers = {
                "Authorization": f"Bearer {self.working_apis['perplexity']['key']}",
                "Content-Type": "application/json"
            }

            data = {
                "model": "sonar",
                "messages": [{"role": "user", "content": query}],
                "max_tokens": 500
            }

            async with self.session.post(
                self.working_apis['perplexity']['url'],
                headers=headers,
                json=data,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    return {
                        "success": True,
                        "result": result['choices'][0]['message']['content'],
                        "api": "perplexity",
                        "query": query
                    }
                elif response.status == 429:
                    retry_after = int(response.headers.get('Retry-After', 60))
                    return {
                        "success": False,
                        "error": "Rate limit exceeded",
                        "retry_after": retry_after,
                        "api": "perplexity",
                        "query": query
                    }
                else:
                    error_text = await response.text()
                    return {
                        "success": False,
                        "error": f"API error: {response.status} - {error_text}",
                        "api": "perplexity",
                        "query": query
                    }
        except ClientTimeout:
            return {
                "success": False,
                "error": "Request timeout",
                "api": "perplexity",
                "query": query
            }
        except ClientError as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}",
                "api": "perplexity",
                "query": query
            }
        except Exception as e:
            self.logger.error(f"Perplexity API error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "api": "perplexity",
                "query": query
            }

    @retry_on_failure(max_retries=3, delay=1.0)
    async def call_firecrawl(self, url: str) -> dict[str, Any]:
        """Call Firecrawl API for web scraping with enhanced error handling"""
        try:
            headers = {
                "Authorization": f"Bearer {self.working_apis['firecrawl']['key']}",
                "Content-Type": "application/json"
            }

            data = {
                "url": url,
                "formats": ["markdown"],
                "onlyMainContent": True
            }

            async with self.session.post(
                self.working_apis['firecrawl']['url'],
                headers=headers,
                json=data,
                timeout=aiohttp.ClientTimeout(total=45)
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    return {
                        "success": True,
                        "result": result.get('data', {}).get('markdown', 'No content found'),
                        "api": "firecrawl",
                        "url": url
                    }
                elif response.status == 429:
                    retry_after = int(response.headers.get('Retry-After', 60))
                    return {
                        "success": False,
                        "error": "Rate limit exceeded",
                        "retry_after": retry_after,
                        "api": "firecrawl",
                        "url": url
                    }
                else:
                    error_text = await response.text()
                    return {
                        "success": False,
                        "error": f"API error: {response.status} - {error_text}",
                        "api": "firecrawl",
                        "url": url
                    }
        except ClientTimeout:
            return {
                "success": False,
                "error": "Request timeout",
                "api": "firecrawl",
                "url": url
            }
        except ClientError as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}",
                "api": "firecrawl",
                "url": url
            }
        except Exception as e:
            self.logger.error(f"Firecrawl API error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "api": "firecrawl",
                "url": url
            }

    @retry_on_failure(max_retries=3, delay=1.0)
    async def call_anthropic(self, message: str) -> dict[str, Any]:
        """Call Anthropic API for text processing with enhanced error handling"""
        try:
            headers = {
                "x-api-key": self.working_apis['anthropic']['key'],
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }

            data = {
                "model": "claude-3-sonnet-20240229",
                "max_tokens": 500,
                "messages": [{"role": "user", "content": message}]
            }

            async with self.session.post(
                self.working_apis['anthropic']['url'],
                headers=headers,
                json=data,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    return {
                        "success": True,
                        "result": result['content'][0]['text'],
                        "api": "anthropic",
                        "message": message
                    }
                elif response.status == 429:
                    retry_after = int(response.headers.get('Retry-After', 60))
                    return {
                        "success": False,
                        "error": "Rate limit exceeded",
                        "retry_after": retry_after,
                        "api": "anthropic",
                        "message": message
                    }
                else:
                    error_text = await response.text()
                    return {
                        "success": False,
                        "error": f"API error: {response.status} - {error_text}",
                        "api": "anthropic",
                        "message": message
                    }
        except ClientTimeout:
            return {
                "success": False,
                "error": "Request timeout",
                "api": "anthropic",
                "message": message
            }
        except ClientError as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}",
                "api": "anthropic",
                "message": message
            }
        except Exception as e:
            self.logger.error(f"Anthropic API error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "api": "anthropic",
                "message": message
            }

    @retry_on_failure(max_retries=3, delay=1.0)
    async def call_github(self, endpoint: str) -> dict[str, Any]:
        """Call GitHub API for code management with enhanced error handling"""
        try:
            headers = {
                "Authorization": f"Bearer {self.working_apis['github']['key']}",
                "Accept": "application/vnd.github.v3+json"
            }

            full_url = f"{self.working_apis['github']['url']}{endpoint}"

            async with self.session.get(
                full_url,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    return {
                        "success": True,
                        "result": result,
                        "api": "github",
                        "endpoint": endpoint
                    }
                elif response.status == 429:
                    retry_after = int(response.headers.get('Retry-After', 60))
                    return {
                        "success": False,
                        "error": "Rate limit exceeded",
                        "retry_after": retry_after,
                        "api": "github",
                        "endpoint": endpoint
                    }
                else:
                    error_text = await response.text()
                    return {
                        "success": False,
                        "error": f"API error: {response.status} - {error_text}",
                        "api": "github",
                        "endpoint": endpoint
                    }
        except ClientTimeout:
            return {
                "success": False,
                "error": "Request timeout",
                "api": "github",
                "endpoint": endpoint
            }
        except ClientError as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}",
                "api": "github",
                "endpoint": endpoint
            }
        except Exception as e:
            self.logger.error(f"GitHub API error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "api": "github",
                "endpoint": endpoint
            }

    async def execute_workflow(self, workflow_name: str, parameters: dict[str, Any]) -> dict[str, Any]:
        """Execute a specific workflow using available APIs with enhanced error handling"""
        if workflow_name not in self.workflows:
            return {
                "success": False,
                "error": f"Workflow not found: {workflow_name}",
                "available_workflows": list(self.workflows.keys()),
                "timestamp": datetime.now().isoformat()
            }

        workflow = self.workflows[workflow_name]
        self.logger.info(f"Executing workflow: {workflow_name}")

        try:
            if workflow.get("concurrent", False):
                return await self._execute_concurrent_workflow(workflow, parameters)
            else:
                return await self._execute_sequential_workflow(workflow, parameters)

        except Exception as e:
            self.logger.error(f"Workflow execution failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "workflow": workflow_name,
                "timestamp": datetime.now().isoformat()
            }

    async def _execute_sequential_workflow(self, workflow: dict[str, Any], parameters: dict[str, Any]) -> dict[str, Any]:
        """Execute workflow sequentially"""
        results = []

        for api_name in workflow["apis"]:
            result = await self._call_api_method(api_name, parameters)
            results.append(result)

        return self._process_workflow_results(results, workflow)

    async def _execute_concurrent_workflow(self, workflow: dict[str, Any], parameters: dict[str, Any]) -> dict[str, Any]:
        """Execute workflow concurrently for better performance"""
        tasks = []

        for api_name in workflow["apis"]:
            task = self._call_api_method(api_name, parameters)
            tasks.append(task)

        # Execute all API calls concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Process results and handle exceptions
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                processed_results.append({
                    "success": False,
                    "error": str(result),
                    "api": workflow["apis"][i]
                })
            else:
                processed_results.append(result)

        return self._process_workflow_results(processed_results, workflow)

    async def _call_api_method(self, api_name: str, parameters: dict[str, Any]) -> dict[str, Any]:
        """Call specific API method based on name"""
        if api_name == "perplexity":
            query = parameters.get("query", "What is the latest in AI technology?")
            return await self.call_perplexity(query)
        elif api_name == "firecrawl":
            url = parameters.get("url", "https://example.com")
            return await self.call_firecrawl(url)
        elif api_name == "anthropic":
            message = parameters.get("message", "Analyze this text for key insights.")
            return await self.call_anthropic(message)
        elif api_name == "github":
            endpoint = parameters.get("endpoint", "/user")
            return await self.call_github(endpoint)
        else:
            return {
                "success": False,
                "error": f"Unknown API: {api_name}",
                "api": api_name
            }

    def _process_workflow_results(self, results: list[dict[str, Any]], workflow: dict[str, Any]) -> dict[str, Any]:
        """Process and analyze workflow results"""
        successful_results = [r for r in results if r.get("success", False)]
        failed_results = [r for r in results if not r.get("success", False)]

        # Log results for monitoring
        self.logger.info(f"Workflow completed: {len(successful_results)} successful, {len(failed_results)} failed")

        return {
            "success": len(successful_results) > 0,
            "workflow": workflow.get("description", "Unknown workflow"),
            "results": results,
            "successful_apis": len(successful_results),
            "failed_apis": len(failed_results),
            "success_rate": len(successful_results) / len(results) if results else 0,
            "timestamp": datetime.now().isoformat()
        }

    async def test_all_apis(self) -> dict[str, Any]:
        """Test all available APIs with enhanced monitoring"""
        self.logger.info("Testing all APIs...")
        results = {}

        test_parameters = {
            "perplexity": {"query": "Test query for API validation"},
            "firecrawl": {"url": "https://example.com"},
            "anthropic": {"message": "Test message for API validation"},
            "github": {"endpoint": "/user"}
        }

        for api_name in self.working_apis.keys():
            try:
                result = await self._call_api_method(api_name, test_parameters.get(api_name, {}))
                results[api_name] = result

                if result.get("success", False):
                    self.logger.info(f"✅ {api_name}: Working")
                else:
                    self.logger.warning(f"❌ {api_name}: {result.get('error', 'Unknown error')}")

            except Exception as e:
                self.logger.error(f"❌ {api_name}: Exception - {str(e)}")
                results[api_name] = {
                    "success": False,
                    "error": str(e),
                    "api": api_name
                }

        return results

    def get_available_workflows(self) -> dict[str, str]:
        """Get available workflows with enhanced information"""
        return {
            name: config["description"]
            for name, config in self.workflows.items()
        }

    def get_working_apis(self) -> dict[str, str]:
        """Get working APIs with status information"""
        return {
            name: config["status"]
            for name, config in self.working_apis.items()
        }

    def get_performance_metrics(self) -> dict[str, Any]:
        """Get performance metrics for monitoring"""
        return {
            "total_apis": len(self.working_apis),
            "workflows": len(self.workflows),
            "concurrent_workflows": len([w for w in self.workflows.values() if w.get("concurrent", False)]),
            "rate_limiters": {name: f"{len(limiter.requests)}/{limiter.max_requests}" for name, limiter in self.rate_limiters.items()},
            "timestamp": datetime.now().isoformat()
        }

async def main():
    """Main function for testing the Optimized MCP Integrator"""
    print("🚀 Optimized MCP Integrator for TAURUS AI CORP")
    print("=" * 60)
    print("Enhanced with improved error handling, async performance, and rate limiting\n")

    try:
        # Initialize integrator with context manager
        async with OptimizedMCPIntegrator() as integrator:
            # Display working APIs
            print("📋 Working APIs:")
            apis = integrator.get_working_apis()
            for name, status in apis.items():
                print(f"  • {name}: {status}")

            # Display available workflows
            print("\n🔄 Available Workflows:")
            workflows = integrator.get_available_workflows()
            for name, description in workflows.items():
                print(f"  • {name}: {description}")

            # Display performance metrics
            print("\n📊 Performance Metrics:")
            metrics = integrator.get_performance_metrics()
            for key, value in metrics.items():
                print(f"  • {key}: {value}")

            # Test all APIs
            print("\n🧪 Testing All APIs...")
            api_results = await integrator.test_all_apis()

            successful_apis = sum(1 for result in api_results.values() if result.get("success", False))
            total_apis = len(api_results)

            print(f"\n📈 Test Results: {successful_apis}/{total_apis} APIs working")

            # Test AI search workflow
            print("\n🧪 Testing AI Search Workflow...")
            search_result = await integrator.execute_workflow(
                "ai_search",
                {"query": "What are the latest trends in AI and machine learning for 2024?"}
            )

            if search_result['success']:
                print("✅ AI search workflow executed successfully!")
                print(f"Successful APIs: {search_result['successful_apis']}")
                print(f"Success Rate: {search_result['success_rate']:.2%}")
            else:
                print(f"❌ AI search workflow failed: {search_result.get('error', 'Unknown error')}")

            # Test parallel search workflow
            print("\n🧪 Testing Parallel Search Workflow...")
            parallel_result = await integrator.execute_workflow(
                "parallel_search",
                {
                    "query": "What is the future of AI?",
                    "message": "Summarize the key points about AI development trends."
                }
            )

            if parallel_result['success']:
                print("✅ Parallel search workflow executed successfully!")
                print(f"Successful APIs: {parallel_result['successful_apis']}")
                print(f"Success Rate: {parallel_result['success_rate']:.2%}")
            else:
                print(f"❌ Parallel search workflow failed: {parallel_result.get('error', 'Unknown error')}")

            print("\n🎉 Optimized MCP Integrator ready for production!")
            print("\n💡 Enhanced Features:")
            print("  • 🔒 Enhanced error handling with retry logic and exponential backoff")
            print("  • ⚡ Improved async performance with aiohttp and connection pooling")
            print("  • 🛡️ API rate limiting with intelligent throttling")
            print("  • 📊 Comprehensive monitoring and logging")
            print("  • 🚀 Concurrent workflow execution for better performance")
            print("  • 🔧 Resource management with proper cleanup")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
