#!/usr/bin/env python3
"""
Advanced Website Diagnostic Analysis
Comprehensive testing for https://vc1j5apvcf.space.minimax.io/features
"""

import json
import socket
import ssl
import statistics
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

import dns.resolver
import requests


class WebsiteDiagnostics:
    def __init__(self, url):
        self.url = url
        self.domain = url.replace('https://', '').replace('http://', '').split('/')[0]
        self.results = {}

    def log(self, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {message}")

    def test_response_times(self, iterations=10):
        """Test server response times with multiple iterations"""
        self.log("Testing server response times...")
        response_times = []
        errors = []

        for i in range(iterations):
            try:
                start_time = time.time()
                response = requests.get(self.url, timeout=30)
                end_time = time.time()

                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                response_times.append(response_time)

                self.log(f"Attempt {i+1}: {response_time:.2f}ms - Status: {response.status_code}")
                time.sleep(1)  # Small delay between requests

            except Exception as e:
                errors.append(str(e))
                self.log(f"Attempt {i+1}: ERROR - {str(e)}")

        if response_times:
            self.results['response_times'] = {
                'times_ms': response_times,
                'min': min(response_times),
                'max': max(response_times),
                'avg': statistics.mean(response_times),
                'median': statistics.median(response_times),
                'errors': errors,
                'success_rate': len(response_times) / iterations * 100
            }

        return self.results['response_times']

    def test_different_user_agents(self):
        """Test with different user agents"""
        self.log("Testing with different user agents...")

        user_agents = [
            # Desktop browsers
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',

            # Mobile browsers
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',

            # Bots and crawlers
            'Googlebot/2.1 (+http://www.google.com/bot.html)',
            'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',

            # Minimal/basic user agents
            'curl/7.68.0',
            'wget/1.20.3',
            ''  # Empty user agent
        ]

        results = {}

        def test_user_agent(ua):
            try:
                headers = {'User-Agent': ua} if ua else {}
                response = requests.get(self.url, headers=headers, timeout=15)
                return {
                    'user_agent': ua or 'Empty',
                    'status_code': response.status_code,
                    'response_time': response.elapsed.total_seconds() * 1000,
                    'content_length': len(response.content),
                    'headers': dict(response.headers),
                    'success': True
                }
            except Exception as e:
                return {
                    'user_agent': ua or 'Empty',
                    'error': str(e),
                    'success': False
                }

        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_ua = {executor.submit(test_user_agent, ua): ua for ua in user_agents}

            for future in as_completed(future_to_ua):
                result = future.result()
                ua_key = result['user_agent'].split('/')[0] if '/' in result['user_agent'] else result['user_agent']
                results[ua_key] = result

                if result['success']:
                    self.log(f"User-Agent {ua_key}: {result['status_code']} - {result['response_time']:.2f}ms")
                else:
                    self.log(f"User-Agent {ua_key}: ERROR - {result['error']}")

        self.results['user_agent_tests'] = results
        return results

    def test_different_methods(self):
        """Test different HTTP methods"""
        self.log("Testing different HTTP methods...")

        methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
        results = {}

        for method in methods:
            try:
                response = requests.request(method, self.url, timeout=15)
                results[method] = {
                    'status_code': response.status_code,
                    'headers': dict(response.headers),
                    'success': True,
                    'response_time': response.elapsed.total_seconds() * 1000
                }
                self.log(f"Method {method}: {response.status_code}")

            except Exception as e:
                results[method] = {
                    'error': str(e),
                    'success': False
                }
                self.log(f"Method {method}: ERROR - {str(e)}")

        self.results['http_methods'] = results
        return results

    def analyze_dns_infrastructure(self):
        """Analyze DNS and infrastructure details"""
        self.log("Analyzing DNS and infrastructure...")

        dns_results = {}

        # DNS resolution for different record types
        record_types = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS']

        for record_type in record_types:
            try:
                answers = dns.resolver.resolve(self.domain, record_type)
                dns_results[record_type] = [str(answer) for answer in answers]
                self.log(f"DNS {record_type}: {dns_results[record_type]}")
            except Exception as e:
                dns_results[record_type] = f"Error: {str(e)}"

        # IP geolocation and network info
        try:
            ip_address = socket.gethostbyname(self.domain)
            dns_results['ip_address'] = ip_address

            # Additional network information
            try:
                # Reverse DNS lookup
                hostname = socket.gethostbyaddr(ip_address)[0]
                dns_results['reverse_dns'] = hostname
            except:
                dns_results['reverse_dns'] = "Not available"

        except Exception as e:
            dns_results['ip_resolution_error'] = str(e)

        self.results['dns_analysis'] = dns_results
        return dns_results

    def analyze_ssl_certificate(self):
        """Analyze SSL/TLS certificate details"""
        self.log("Analyzing SSL/TLS certificate...")

        try:
            # Create SSL context
            context = ssl.create_default_context()

            # Connect and get certificate
            with socket.create_connection((self.domain, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=self.domain) as ssock:
                    cert = ssock.getpeercert()
                    cipher = ssock.cipher()

            ssl_results = {
                'certificate': {
                    'subject': dict(x[0] for x in cert['subject']),
                    'issuer': dict(x[0] for x in cert['issuer']),
                    'version': cert['version'],
                    'serial_number': cert['serialNumber'],
                    'not_before': cert['notBefore'],
                    'not_after': cert['notAfter'],
                    'subject_alt_name': cert.get('subjectAltName', [])
                },
                'cipher_suite': cipher,
                'protocol_version': ssock.version()
            }

            self.log(f"SSL Certificate: {ssl_results['certificate']['subject']}")
            self.log(f"Cipher: {cipher}")

        except Exception as e:
            ssl_results = {'error': str(e)}
            self.log(f"SSL Analysis Error: {str(e)}")

        self.results['ssl_analysis'] = ssl_results
        return ssl_results

    def test_rate_limiting(self):
        """Test for rate limiting and geographic restrictions"""
        self.log("Testing for rate limiting...")

        # Test rapid requests
        rapid_requests = []
        errors = []

        def make_request(i):
            try:
                start_time = time.time()
                response = requests.get(self.url, timeout=10)
                end_time = time.time()
                return {
                    'request_num': i,
                    'status_code': response.status_code,
                    'response_time': (end_time - start_time) * 1000,
                    'timestamp': datetime.now().isoformat()
                }
            except Exception as e:
                return {
                    'request_num': i,
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }

        # Make 20 rapid requests
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request, i) for i in range(20)]

            for future in as_completed(futures):
                result = future.result()
                rapid_requests.append(result)

                if 'error' in result:
                    self.log(f"Rapid request {result['request_num']}: ERROR - {result['error']}")
                else:
                    self.log(f"Rapid request {result['request_num']}: {result['status_code']} - {result['response_time']:.2f}ms")

        # Analyze results for rate limiting patterns
        status_codes = [r.get('status_code') for r in rapid_requests if 'status_code' in r]
        error_count = len([r for r in rapid_requests if 'error' in r])

        rate_limit_analysis = {
            'total_requests': len(rapid_requests),
            'successful_requests': len(status_codes),
            'error_count': error_count,
            'status_code_distribution': {code: status_codes.count(code) for code in set(status_codes)},
            'potential_rate_limiting': error_count > 5 or any(code in [429, 503] for code in status_codes)
        }

        self.results['rate_limiting'] = rate_limit_analysis
        return rate_limit_analysis

    def test_intermittent_connectivity(self, duration_minutes=2):
        """Test for intermittent connectivity issues"""
        self.log(f"Testing intermittent connectivity for {duration_minutes} minutes...")

        end_time = time.time() + (duration_minutes * 60)
        connectivity_results = []

        while time.time() < end_time:
            try:
                start_time = time.time()
                response = requests.get(self.url, timeout=10)
                end_time_req = time.time()

                result = {
                    'timestamp': datetime.now().isoformat(),
                    'status_code': response.status_code,
                    'response_time': (end_time_req - start_time) * 1000,
                    'success': True
                }

            except Exception as e:
                result = {
                    'timestamp': datetime.now().isoformat(),
                    'error': str(e),
                    'success': False
                }

            connectivity_results.append(result)
            time.sleep(10)  # Test every 10 seconds

        # Analyze connectivity stability
        successful_tests = [r for r in connectivity_results if r.get('success', False)]
        failed_tests = [r for r in connectivity_results if not r.get('success', True)]

        connectivity_analysis = {
            'total_tests': len(connectivity_results),
            'successful_tests': len(successful_tests),
            'failed_tests': len(failed_tests),
            'success_rate': len(successful_tests) / len(connectivity_results) * 100 if connectivity_results else 0,
            'avg_response_time': statistics.mean([r['response_time'] for r in successful_tests]) if successful_tests else 0,
            'connectivity_stable': len(failed_tests) == 0
        }

        self.results['intermittent_connectivity'] = connectivity_analysis
        return connectivity_analysis

    def run_full_diagnostics(self):
        """Run all diagnostic tests"""
        self.log("Starting comprehensive website diagnostics...")

        # Run all tests
        self.test_response_times()
        self.test_different_user_agents()
        self.test_different_methods()
        self.analyze_dns_infrastructure()
        self.analyze_ssl_certificate()
        self.test_rate_limiting()
        self.test_intermittent_connectivity()

        # Generate summary
        self.results['diagnostic_summary'] = {
            'timestamp': datetime.now().isoformat(),
            'url_tested': self.url,
            'total_tests_run': len(self.results),
            'overall_accessibility': self.assess_overall_accessibility()
        }

        return self.results

    def assess_overall_accessibility(self):
        """Assess overall accessibility based on test results"""
        issues = []

        # Check response times
        if 'response_times' in self.results:
            rt = self.results['response_times']
            if rt['success_rate'] < 90:
                issues.append(f"Low success rate: {rt['success_rate']:.1f}%")
            if rt['avg'] > 5000:  # 5 seconds
                issues.append(f"Slow average response time: {rt['avg']:.1f}ms")

        # Check user agent compatibility
        if 'user_agent_tests' in self.results:
            ua_failures = [ua for ua, result in self.results['user_agent_tests'].items() if not result.get('success', False)]
            if ua_failures:
                issues.append(f"User agent failures: {', '.join(ua_failures)}")

        # Check rate limiting
        if 'rate_limiting' in self.results:
            if self.results['rate_limiting']['potential_rate_limiting']:
                issues.append("Potential rate limiting detected")

        # Check intermittent connectivity
        if 'intermittent_connectivity' in self.results:
            ic = self.results['intermittent_connectivity']
            if ic['success_rate'] < 95:
                issues.append(f"Intermittent connectivity issues: {ic['success_rate']:.1f}% success rate")

        return {
            'status': 'GOOD' if not issues else 'ISSUES_DETECTED',
            'issues_found': issues,
            'recommendations': self.generate_recommendations(issues)
        }

    def generate_recommendations(self, issues):
        """Generate recommendations based on identified issues"""
        recommendations = []

        for issue in issues:
            if 'response time' in issue.lower():
                recommendations.append("Consider implementing CDN or optimizing server performance")
            elif 'user agent' in issue.lower():
                recommendations.append("Review server configuration for user agent blocking")
            elif 'rate limiting' in issue.lower():
                recommendations.append("Implement proper rate limiting handling in client applications")
            elif 'connectivity' in issue.lower():
                recommendations.append("Investigate network infrastructure stability")

        if not recommendations:
            recommendations.append("Website appears to be functioning normally from a technical perspective")

        return recommendations

if __name__ == "__main__":
    # Run diagnostics
    url = "https://vc1j5apvcf.space.minimax.io/features"
    diagnostics = WebsiteDiagnostics(url)
    results = diagnostics.run_full_diagnostics()

    # Save results
    with open('/workspace/data/advanced_diagnostics_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)

    print("\n" + "="*80)
    print("DIAGNOSTIC SUMMARY")
    print("="*80)
    print(json.dumps(results['diagnostic_summary'], indent=2, default=str))
