#!/usr/bin/env python3
"""
Network Analysis for Website Accessibility Issues
Testing various network conditions and edge cases
"""

import json
import socket
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

import requests


def test_connection_timeouts():
    """Test different timeout scenarios"""
    url = "https://vc1j5apvcf.space.minimax.io/features"
    timeout_tests = [1, 2, 5, 10, 15, 30]
    results = {}

    print("🕐 TIMEOUT RESILIENCE TESTING")
    print("-" * 40)

    for timeout in timeout_tests:
        try:
            start_time = time.time()
            response = requests.get(url, timeout=timeout)
            end_time = time.time()

            actual_time = end_time - start_time
            results[f"{timeout}s_timeout"] = {
                'success': True,
                'status_code': response.status_code,
                'actual_time': actual_time,
                'within_timeout': actual_time < timeout
            }
            print(f"  ✅ {timeout}s timeout: Success ({actual_time:.2f}s)")

        except requests.exceptions.Timeout:
            results[f"{timeout}s_timeout"] = {
                'success': False,
                'error': 'Timeout',
                'timeout_value': timeout
            }
            print(f"  ⏰ {timeout}s timeout: TIMEOUT")

        except Exception as e:
            results[f"{timeout}s_timeout"] = {
                'success': False,
                'error': str(e),
                'timeout_value': timeout
            }
            print(f"  ❌ {timeout}s timeout: ERROR - {e}")

    return results

def test_session_persistence():
    """Test session persistence and connection reuse"""
    url = "https://vc1j5apvcf.space.minimax.io/features"
    print("\n🔗 SESSION PERSISTENCE TESTING")
    print("-" * 40)

    # Test with session (connection reuse)
    print("  Testing with session (connection reuse):")
    session = requests.Session()
    session_times = []

    for i in range(5):
        start_time = time.time()
        response = session.get(url)
        end_time = time.time()
        session_times.append(end_time - start_time)
        print(f"    Request {i+1}: {(end_time - start_time)*1000:.2f}ms")

    # Test without session (new connections)
    print("  Testing without session (new connections):")
    no_session_times = []

    for i in range(5):
        start_time = time.time()
        response = requests.get(url)
        end_time = time.time()
        no_session_times.append(end_time - start_time)
        print(f"    Request {i+1}: {(end_time - start_time)*1000:.2f}ms")

    session.close()

    session_avg = sum(session_times) / len(session_times) * 1000
    no_session_avg = sum(no_session_times) / len(no_session_times) * 1000

    print(f"  📊 Session average: {session_avg:.2f}ms")
    print(f"  📊 No session average: {no_session_avg:.2f}ms")
    print(f"  📊 Connection reuse benefit: {((no_session_avg - session_avg) / no_session_avg * 100):.1f}% faster")

    return {
        'session_times': session_times,
        'no_session_times': no_session_times,
        'session_avg': session_avg,
        'no_session_avg': no_session_avg,
        'connection_reuse_benefit': (no_session_avg - session_avg) / no_session_avg * 100
    }

def test_keepalive_behavior():
    """Test HTTP keep-alive behavior"""
    url = "https://vc1j5apvcf.space.minimax.io/features"
    print("\n❤️  HTTP KEEP-ALIVE TESTING")
    print("-" * 40)

    # Test with keep-alive enabled
    session = requests.Session()
    session.headers.update({'Connection': 'keep-alive'})

    keepalive_times = []
    for i in range(10):
        start_time = time.time()
        response = session.get(url)
        end_time = time.time()
        keepalive_times.append((end_time - start_time) * 1000)
        print(f"  Keep-alive request {i+1}: {keepalive_times[-1]:.2f}ms - Connection: {response.headers.get('Connection', 'unknown')}")
        time.sleep(0.1)

    session.close()

    # Test with keep-alive disabled
    no_keepalive_times = []
    for i in range(5):
        start_time = time.time()
        response = requests.get(url, headers={'Connection': 'close'})
        end_time = time.time()
        no_keepalive_times.append((end_time - start_time) * 1000)
        print(f"  No keep-alive request {i+1}: {no_keepalive_times[-1]:.2f}ms")
        time.sleep(0.1)

    keepalive_avg = sum(keepalive_times) / len(keepalive_times)
    no_keepalive_avg = sum(no_keepalive_times) / len(no_keepalive_times)

    print(f"  📊 Keep-alive average: {keepalive_avg:.2f}ms")
    print(f"  📊 No keep-alive average: {no_keepalive_avg:.2f}ms")

    return {
        'keepalive_times': keepalive_times,
        'no_keepalive_times': no_keepalive_times,
        'keepalive_avg': keepalive_avg,
        'no_keepalive_avg': no_keepalive_avg
    }

def test_concurrent_load():
    """Test concurrent load scenarios"""
    url = "https://vc1j5apvcf.space.minimax.io/features"
    print("\n🚀 CONCURRENT LOAD TESTING")
    print("-" * 40)

    def make_request(request_id):
        try:
            start_time = time.time()
            response = requests.get(url, timeout=30)
            end_time = time.time()
            return {
                'id': request_id,
                'success': True,
                'status_code': response.status_code,
                'response_time': (end_time - start_time) * 1000,
                'content_length': len(response.content)
            }
        except Exception as e:
            return {
                'id': request_id,
                'success': False,
                'error': str(e)
            }

    # Test different concurrency levels
    concurrency_levels = [1, 5, 10, 20, 50]
    load_results = {}

    for concurrency in concurrency_levels:
        print(f"  Testing {concurrency} concurrent requests:")

        start_time = time.time()
        with ThreadPoolExecutor(max_workers=concurrency) as executor:
            futures = [executor.submit(make_request, i) for i in range(concurrency)]
            results = [future.result() for future in as_completed(futures)]
        end_time = time.time()

        successful_requests = [r for r in results if r.get('success', False)]
        failed_requests = [r for r in results if not r.get('success', True)]

        if successful_requests:
            avg_response_time = sum(r['response_time'] for r in successful_requests) / len(successful_requests)
            min_response_time = min(r['response_time'] for r in successful_requests)
            max_response_time = max(r['response_time'] for r in successful_requests)
        else:
            avg_response_time = min_response_time = max_response_time = 0

        total_time = (end_time - start_time) * 1000
        success_rate = len(successful_requests) / len(results) * 100

        load_results[f"concurrency_{concurrency}"] = {
            'total_requests': len(results),
            'successful_requests': len(successful_requests),
            'failed_requests': len(failed_requests),
            'success_rate': success_rate,
            'total_time': total_time,
            'avg_response_time': avg_response_time,
            'min_response_time': min_response_time,
            'max_response_time': max_response_time,
            'requests_per_second': len(results) / (total_time / 1000) if total_time > 0 else 0
        }

        print(f"    ✅ Success rate: {success_rate:.1f}%")
        print(f"    ⏱️  Avg response: {avg_response_time:.2f}ms")
        print(f"    🔥 Requests/sec: {load_results[f'concurrency_{concurrency}']['requests_per_second']:.2f}")

        if failed_requests:
            print(f"    ❌ Failed requests: {len(failed_requests)}")

    return load_results

def test_edge_cases():
    """Test edge cases and potential failure scenarios"""
    url = "https://vc1j5apvcf.space.minimax.io/features"
    print("\n🎯 EDGE CASE TESTING")
    print("-" * 40)

    edge_cases = {
        'very_large_accept_header': {
            'headers': {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' * 10}
        },
        'unusual_user_agent': {
            'headers': {'User-Agent': 'Test/1.0 (Unusual Browser; Edge Case Testing)'}
        },
        'custom_headers': {
            'headers': {
                'X-Forwarded-For': '127.0.0.1',
                'X-Real-IP': '192.168.1.1',
                'X-Custom-Header': 'EdgeCaseTest'
            }
        },
        'multiple_accept_encodings': {
            'headers': {'Accept-Encoding': 'gzip, deflate, br, compress, identity'}
        },
        'unusual_accept_language': {
            'headers': {'Accept-Language': 'tlh-Latn,x-klingon,en-US;q=0.9'}  # Klingon
        },
        'empty_headers': {
            'headers': {}
        }
    }

    edge_results = {}

    for test_name, test_config in edge_cases.items():
        try:
            response = requests.get(url, **test_config, timeout=15)
            edge_results[test_name] = {
                'success': True,
                'status_code': response.status_code,
                'response_time': response.elapsed.total_seconds() * 1000,
                'content_length': len(response.content)
            }
            print(f"  ✅ {test_name}: {response.status_code} ({response.elapsed.total_seconds()*1000:.2f}ms)")

        except Exception as e:
            edge_results[test_name] = {
                'success': False,
                'error': str(e)
            }
            print(f"  ❌ {test_name}: ERROR - {e}")

    return edge_results

def test_dns_resolution_consistency():
    """Test DNS resolution consistency"""
    domain = "vc1j5apvcf.space.minimax.io"
    print("\n🌐 DNS RESOLUTION CONSISTENCY")
    print("-" * 40)

    ip_addresses = []
    resolution_times = []

    for i in range(10):
        try:
            start_time = time.time()
            ip = socket.gethostbyname(domain)
            end_time = time.time()

            ip_addresses.append(ip)
            resolution_times.append((end_time - start_time) * 1000)
            print(f"  Resolution {i+1}: {ip} ({resolution_times[-1]:.2f}ms)")

        except Exception as e:
            print(f"  Resolution {i+1}: ERROR - {e}")

    unique_ips = list(set(ip_addresses))
    avg_resolution_time = sum(resolution_times) / len(resolution_times) if resolution_times else 0

    print(f"  📊 Unique IPs: {len(unique_ips)} ({unique_ips})")
    print(f"  📊 Average resolution time: {avg_resolution_time:.2f}ms")
    print(f"  📊 DNS consistency: {'Good' if len(unique_ips) <= 2 else 'Variable'}")

    return {
        'ip_addresses': ip_addresses,
        'unique_ips': unique_ips,
        'resolution_times': resolution_times,
        'avg_resolution_time': avg_resolution_time,
        'dns_consistency': len(unique_ips) <= 2
    }

def run_full_network_analysis():
    """Run complete network analysis"""
    print("🔬 COMPREHENSIVE NETWORK ANALYSIS")
    print("=" * 80)

    results = {
        'timestamp': datetime.now().isoformat(),
        'url_tested': "https://vc1j5apvcf.space.minimax.io/features"
    }

    # Run all tests
    results['timeout_tests'] = test_connection_timeouts()
    results['session_persistence'] = test_session_persistence()
    results['keepalive_behavior'] = test_keepalive_behavior()
    results['concurrent_load'] = test_concurrent_load()
    results['edge_cases'] = test_edge_cases()
    results['dns_consistency'] = test_dns_resolution_consistency()

    # Generate analysis summary
    print("\n" + "=" * 80)
    print("📋 NETWORK ANALYSIS SUMMARY")
    print("=" * 80)

    issues_found = []

    # Analyze timeout tests
    timeout_failures = [k for k, v in results['timeout_tests'].items() if not v.get('success', False)]
    if timeout_failures:
        issues_found.append(f"Timeout failures: {timeout_failures}")

    # Analyze load tests
    for concurrency_test, data in results['concurrent_load'].items():
        if data['success_rate'] < 95:
            issues_found.append(f"Low success rate in {concurrency_test}: {data['success_rate']:.1f}%")

    # Analyze edge cases
    edge_failures = [k for k, v in results['edge_cases'].items() if not v.get('success', False)]
    if edge_failures:
        issues_found.append(f"Edge case failures: {edge_failures}")

    # Analyze DNS consistency
    if not results['dns_consistency']['dns_consistency']:
        issues_found.append("DNS resolution inconsistency detected")

    if not issues_found:
        print("✅ No network-level issues detected")
        print("🌟 Website demonstrates excellent network resilience")
    else:
        print("⚠️  Network issues detected:")
        for issue in issues_found:
            print(f"   - {issue}")

    # Save results
    with open('/workspace/data/network_analysis_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)

    print("\n📁 Results saved to: /workspace/data/network_analysis_results.json")

    return results

if __name__ == "__main__":
    run_full_network_analysis()
