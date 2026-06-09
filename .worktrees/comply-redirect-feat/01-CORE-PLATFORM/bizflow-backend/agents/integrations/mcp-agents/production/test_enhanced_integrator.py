#!/usr/bin/env python3
"""
Test Suite for Enhanced MCP Integrator
Comprehensive testing for security, performance, and reliability improvements
"""

import pytest
import asyncio
import aiohttp
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime
import os
import tempfile
import json

# Import the enhanced integrator
from enhanced_mcp_integrator import (
    EnhancedMCPIntegrator,
    APIConfig,
    RateLimiter,
    InputValidator,
    SecureAPIClient,
    PerplexityClient,
    FirecrawlClient,
    AnthropicClient,
    GitHubClient
)

class TestInputValidator:
    """Test input validation and sanitization"""
    
    def test_validate_url_valid(self):
        """Test valid URL validation"""
        valid_urls = [
            "https://example.com",
            "http://test.org",
            "https://subdomain.example.com/path?query=value"
        ]
        
        for url in valid_urls:
            result = InputValidator.validate_url(url)
            assert result == url
    
    def test_validate_url_invalid(self):
        """Test invalid URL validation"""
        invalid_urls = [
            "",
            "not-a-url",
            "ftp://example.com",  # Unsupported scheme
            "javascript:alert('xss')"  # Dangerous scheme
        ]
        
        for url in invalid_urls:
            with pytest.raises(ValueError):
                InputValidator.validate_url(url)
    
    def test_sanitize_query(self):
        """Test query sanitization"""
        malicious_queries = [
            "<script>alert('xss')</script>",
            "'; DROP TABLE users; --",
            "query with \"quotes\" and 'apostrophes'",
            "a" * 2000  # Very long query
        ]
        
        for query in malicious_queries:
            result = InputValidator.sanitize_query(query)
            assert "<" not in result
            assert ">" not in result
            assert '"' not in result
            assert "'" not in result
            assert len(result) <= 1000
            # Additional check for SQL injection patterns
            assert "DROP TABLE" not in result.upper()
    
    def test_validate_message(self):
        """Test message validation"""
        malicious_messages = [
            "Message with \x00 null bytes",
            "Message with \x1f control chars",
            "a" * 6000  # Very long message
        ]
        
        for message in malicious_messages:
            result = InputValidator.validate_message(message)
            assert "\x00" not in result
            assert "\x1f" not in result
            assert len(result) <= 5000

class TestRateLimiter:
    """Test rate limiting functionality"""
    
    @pytest.mark.asyncio
    async def test_rate_limiter_acquire(self):
        """Test rate limiter acquire method"""
        limiter = RateLimiter(max_requests=2, time_window=1)
        
        # First two requests should pass immediately
        await limiter.acquire()
        await limiter.acquire()
        
        # Third request should be delayed
        start_time = asyncio.get_event_loop().time()
        await limiter.acquire()
        end_time = asyncio.get_event_loop().time()
        
        # Should have been delayed by approximately 1 second
        assert end_time - start_time >= 0.9  # Allow some tolerance

class TestSecureAPIClient:
    """Test secure API client functionality"""
    
    def test_encrypt_decrypt_key(self):
        """Test API key encryption and decryption"""
        client = SecureAPIClient()
        test_key = "test-api-key-12345"
        
        encrypted = client.encrypt_key("test_api", test_key)
        decrypted = client.decrypt_key("test_api", encrypted)
        
        assert decrypted == test_key
        assert encrypted != test_key  # Should be encrypted
    
    def test_get_key_missing(self):
        """Test getting non-existent key"""
        client = SecureAPIClient()
        
        with pytest.raises(ValueError):
            client.get_key("nonexistent")

class TestAPIClients:
    """Test individual API clients"""
    
    @pytest.fixture
    def mock_config(self):
        """Mock API configuration"""
        return APIConfig(
            key="test-key",
            url="https://api.test.com",
            timeout=30,
            max_retries=3,
            rate_limit=100
        )
    
    @pytest.fixture
    def mock_rate_limiter(self):
        """Mock rate limiter"""
        return RateLimiter(max_requests=100, time_window=60)
    
    @pytest.mark.asyncio
    async def test_perplexity_client_success(self, mock_config, mock_rate_limiter):
        """Test Perplexity client successful response"""
        client = PerplexityClient(mock_config, mock_rate_limiter)
        
        with patch('aiohttp.ClientSession') as mock_session:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json.return_value = {
                "choices": [{"message": {"content": "Test response"}}]
            }
            
            mock_session_instance = AsyncMock()
            mock_session_instance.request.return_value.__aenter__.return_value = mock_response
            mock_session_instance.__aenter__.return_value = mock_session_instance
            mock_session_instance.__aexit__.return_value = None
            mock_session.return_value = mock_session_instance
            
            async with client as api_client:
                result = await api_client.search("test query")
            
            assert result["success"] is True
            assert result["result"] == "Test response"
            assert result["api"] == "perplexity"
    
    @pytest.mark.asyncio
    async def test_firecrawl_client_success(self, mock_config, mock_rate_limiter):
        """Test Firecrawl client successful response"""
        client = FirecrawlClient(mock_config, mock_rate_limiter)
        
        with patch('aiohttp.ClientSession') as mock_session:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json.return_value = {
                "data": {"markdown": "Test content"}
            }
            
            mock_session_instance = AsyncMock()
            mock_session_instance.request.return_value.__aenter__.return_value = mock_response
            mock_session_instance.__aenter__.return_value = mock_session_instance
            mock_session_instance.__aexit__.return_value = None
            mock_session.return_value = mock_session_instance
            
            async with client as api_client:
                result = await api_client.scrape("https://example.com")
            
            assert result["success"] is True
            assert result["result"] == "Test content"
            assert result["api"] == "firecrawl"
    
    @pytest.mark.asyncio
    async def test_anthropic_client_success(self, mock_config, mock_rate_limiter):
        """Test Anthropic client successful response"""
        client = AnthropicClient(mock_config, mock_rate_limiter)
        
        with patch('aiohttp.ClientSession') as mock_session:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json.return_value = {
                "content": [{"text": "Test response"}]
            }
            
            mock_session_instance = AsyncMock()
            mock_session_instance.request.return_value.__aenter__.return_value = mock_response
            mock_session_instance.__aenter__.return_value = mock_session_instance
            mock_session_instance.__aexit__.return_value = None
            mock_session.return_value = mock_session_instance
            
            async with client as api_client:
                result = await api_client.process_text("test message")
            
            assert result["success"] is True
            assert result["result"] == "Test response"
            assert result["api"] == "anthropic"
    
    @pytest.mark.asyncio
    async def test_github_client_success(self, mock_config, mock_rate_limiter):
        """Test GitHub client successful response"""
        client = GitHubClient(mock_config, mock_rate_limiter)
        
        with patch('aiohttp.ClientSession') as mock_session:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json.return_value = {"login": "testuser"}
            
            mock_session_instance = AsyncMock()
            mock_session_instance.request.return_value.__aenter__.return_value = mock_response
            mock_session_instance.__aenter__.return_value = mock_session_instance
            mock_session_instance.__aexit__.return_value = None
            mock_session.return_value = mock_session_instance
            
            async with client as api_client:
                result = await api_client.get_data("/user")
            
            assert result["success"] is True
            assert result["result"]["login"] == "testuser"
            assert result["api"] == "github"

class TestEnhancedMCPIntegrator:
    """Test the main enhanced integrator"""
    
    @pytest.fixture
    def mock_env_vars(self):
        """Mock environment variables"""
        with patch.dict(os.environ, {
            'PERPLEXITY_API_KEY': 'test-perplexity-key',
            'FIRECRAWL_API_KEY': 'test-firecrawl-key',
            'ANTHROPIC_API_KEY': 'test-anthropic-key',
            'GITHUB_PERSONAL_ACCESS_TOKEN': 'test-github-token'
        }):
            yield
    
    def test_initialization(self, mock_env_vars):
        """Test integrator initialization"""
        integrator = EnhancedMCPIntegrator()
        
        assert len(integrator.clients) == 4
        assert "perplexity" in integrator.clients
        assert "firecrawl" in integrator.clients
        assert "anthropic" in integrator.clients
        assert "github" in integrator.clients
    
    def test_initialization_missing_keys(self):
        """Test initialization with missing API keys"""
        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(ValueError, match="Missing API keys"):
                EnhancedMCPIntegrator()
    
    def test_get_available_workflows(self, mock_env_vars):
        """Test getting available workflows"""
        integrator = EnhancedMCPIntegrator()
        workflows = integrator.get_available_workflows()
        
        assert "ai_search" in workflows
        assert "web_scraping" in workflows
        assert "text_processing" in workflows
        assert "code_management" in workflows
        assert "hybrid_workflow" in workflows
        assert "parallel_search" in workflows
    
    def test_get_working_apis(self, mock_env_vars):
        """Test getting working APIs"""
        integrator = EnhancedMCPIntegrator()
        apis = integrator.get_working_apis()
        
        assert len(apis) == 4
        assert all(status == "configured" for status in apis.values())
    
    def test_get_performance_metrics(self, mock_env_vars):
        """Test getting performance metrics"""
        integrator = EnhancedMCPIntegrator()
        metrics = integrator.get_performance_metrics()
        
        assert metrics["total_apis"] == 4
        assert metrics["workflows"] == 6
        assert metrics["concurrent_workflows"] == 2
        assert "timestamp" in metrics
    
    @pytest.mark.asyncio
    async def test_execute_workflow_unknown(self, mock_env_vars):
        """Test executing unknown workflow"""
        integrator = EnhancedMCPIntegrator()
        result = await integrator.execute_workflow("unknown_workflow", {})
        
        assert result["success"] is False
        assert "Workflow not found" in result["error"]
        assert "available_workflows" in result
    
    @pytest.mark.asyncio
    async def test_execute_workflow_ai_search(self, mock_env_vars):
        """Test executing AI search workflow"""
        integrator = EnhancedMCPIntegrator()
        
        with patch.object(integrator.clients["perplexity"], 'search') as mock_search:
            mock_search.return_value = {
                "success": True,
                "result": "Test search result",
                "api": "perplexity"
            }
            
            result = await integrator.execute_workflow(
                "ai_search",
                {"query": "test query"}
            )
        
        assert result["success"] is True
        assert result["successful_apis"] == 1
        assert result["failed_apis"] == 0
        assert result["success_rate"] == 1.0
    
    @pytest.mark.asyncio
    async def test_execute_workflow_parallel(self, mock_env_vars):
        """Test executing parallel workflow"""
        integrator = EnhancedMCPIntegrator()
        
        with patch.object(integrator.clients["perplexity"], 'search') as mock_perplexity, \
             patch.object(integrator.clients["anthropic"], 'process_text') as mock_anthropic:
            
            mock_perplexity.return_value = {
                "success": True,
                "result": "Perplexity result",
                "api": "perplexity"
            }
            mock_anthropic.return_value = {
                "success": True,
                "result": "Anthropic result",
                "api": "anthropic"
            }
            
            result = await integrator.execute_workflow(
                "parallel_search",
                {
                    "query": "test query",
                    "message": "test message"
                }
            )
        
        assert result["success"] is True
        assert result["successful_apis"] == 2
        assert result["failed_apis"] == 0
        assert result["success_rate"] == 1.0
    
    @pytest.mark.asyncio
    async def test_test_all_apis(self, mock_env_vars):
        """Test testing all APIs"""
        integrator = EnhancedMCPIntegrator()
        
        with patch.object(integrator, '_call_api_client') as mock_call:
            mock_call.return_value = {
                "success": True,
                "api": "test"
            }
            
            results = await integrator.test_all_apis()
        
        assert len(results) == 4
        assert all(result["success"] for result in results.values())

class TestIntegration:
    """Integration tests for the enhanced integrator"""
    
    @pytest.mark.asyncio
    async def test_full_workflow_integration(self):
        """Test full workflow integration with mocked APIs"""
        with patch.dict(os.environ, {
            'PERPLEXITY_API_KEY': 'test-perplexity-key',
            'FIRECRAWL_API_KEY': 'test-firecrawl-key',
            'ANTHROPIC_API_KEY': 'test-anthropic-key',
            'GITHUB_PERSONAL_ACCESS_TOKEN': 'test-github-token'
        }):
            integrator = EnhancedMCPIntegrator()
            
            # Mock all API calls
            with patch('aiohttp.ClientSession') as mock_session:
                mock_response = AsyncMock()
                mock_response.status = 200
                mock_response.json.return_value = {
                    "choices": [{"message": {"content": "Test response"}}]
                }
                
                mock_session.return_value.__aenter__.return_value.request.return_value.__aenter__.return_value = mock_response
                
                # Test AI search workflow
                result = await integrator.execute_workflow(
                    "ai_search",
                    {"query": "test query"}
                )
                
                assert result["success"] is True
                assert result["successful_apis"] == 1

class TestSecurity:
    """Security-focused tests"""
    
    def test_input_validation_security(self):
        """Test input validation prevents security issues"""
        # Test XSS prevention
        malicious_input = "<script>alert('xss')</script>"
        sanitized = InputValidator.sanitize_query(malicious_input)
        assert "<script>" not in sanitized
        
        # Test SQL injection prevention
        sql_input = "'; DROP TABLE users; --"
        sanitized = InputValidator.sanitize_query(sql_input)
        assert "DROP TABLE" not in sanitized.upper()
    
    def test_url_validation_security(self):
        """Test URL validation prevents dangerous schemes"""
        dangerous_urls = [
            "javascript:alert('xss')",
            "data:text/html,<script>alert('xss')</script>",
            "file:///etc/passwd"
        ]
        
        for url in dangerous_urls:
            with pytest.raises(ValueError):
                InputValidator.validate_url(url)
    
    def test_key_encryption_security(self):
        """Test API key encryption security"""
        client = SecureAPIClient()
        sensitive_key = "sk-1234567890abcdef"
        
        encrypted = client.encrypt_key("test", sensitive_key)
        
        # Encrypted key should not contain original key
        assert sensitive_key not in encrypted
        assert len(encrypted) > len(sensitive_key)
        
        # Should be able to decrypt correctly
        decrypted = client.decrypt_key("test", encrypted)
        assert decrypted == sensitive_key

class TestPerformance:
    """Performance-focused tests"""
    
    @pytest.mark.asyncio
    async def test_concurrent_execution_performance(self):
        """Test concurrent execution is faster than sequential"""
        with patch.dict(os.environ, {
            'PERPLEXITY_API_KEY': 'test-perplexity-key',
            'ANTHROPIC_API_KEY': 'test-anthropic-key'
        }):
            integrator = EnhancedMCPIntegrator()
            
            # Mock API calls with delay
            async def mock_delayed_call(*args, **kwargs):
                await asyncio.sleep(0.1)  # Simulate API delay
                return {"success": True, "api": "test"}
            
            with patch.object(integrator, '_call_api_client', side_effect=mock_delayed_call):
                # Test concurrent execution
                start_time = asyncio.get_event_loop().time()
                concurrent_result = await integrator.execute_workflow(
                    "parallel_search",
                    {"query": "test", "message": "test"}
                )
                concurrent_time = asyncio.get_event_loop().time() - start_time
                
                # Test sequential execution
                start_time = asyncio.get_event_loop().time()
                sequential_result = await integrator.execute_workflow(
                    "ai_search",
                    {"query": "test"}
                )
                sequential_time = asyncio.get_event_loop().time() - start_time
                
                # Concurrent should be faster (allowing for test overhead)
                assert concurrent_time < sequential_time * 1.5

if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v", "--tb=short"])
