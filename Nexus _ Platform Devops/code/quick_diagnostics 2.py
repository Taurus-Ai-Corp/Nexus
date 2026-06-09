#!/usr/bin/env python3
"""
Quick Website Diagnostic Analysis
"""

import requests
import time
import socket
import ssl
import json
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import statistics

def test_website_comprehensive():
    url = "https://vc1j5apvcf.space.minimax.io/features"
    domain = "vc1j5apvcf.space.minimax.io"
    results = {}
    
    print(f"🔍 Starting comprehensive diagnostics for {url}")
    print("="*80)
    
    # 1. Basic connectivity test
    print("\n📡 BASIC CONNECTIVITY TEST")
    try:
        response = requests.get(url, timeout=10)
        print(f"✅ HTTP Status: {response.status_code}")
        print(f"✅ Response Time: {response.elapsed.total_seconds():.3f}s")
        print(f"✅ Content Length: {len(response.content)} bytes")
        print(f"✅ Server: {response.headers.get('Server', 'Unknown')}")
        
        results['basic_connectivity'] = {
            'status_code': response.status_code,
            'response_time': response.elapsed.total_seconds(),
            'content_length': len(response.content),
            'server': response.headers.get('Server', 'Unknown'),
            'headers': dict(response.headers)
        }
    except Exception as e:
        print(f"❌ Basic connectivity failed: {e}")
        results['basic_connectivity'] = {'error': str(e)}
    
    # 2. Response time analysis
    print("\n⏱️  RESPONSE TIME ANALYSIS")
    response_times = []
    try:
        for i in range(10):
            start = time.time()
            response = requests.get(url, timeout=10)
            end = time.time()
            rt = (end - start) * 1000
            response_times.append(rt)
            print(f"  Request {i+1}: {rt:.2f}ms")
            time.sleep(0.5)
        
        results['response_times'] = {
            'times': response_times,
            'min': min(response_times),
            'max': max(response_times),
            'avg': statistics.mean(response_times),
            'median': statistics.median(response_times)
        }
        
        print(f"📊 Min: {min(response_times):.2f}ms")
        print(f"📊 Max: {max(response_times):.2f}ms") 
        print(f"📊 Avg: {statistics.mean(response_times):.2f}ms")
        print(f"📊 Median: {statistics.median(response_times):.2f}ms")
        
    except Exception as e:
        print(f"❌ Response time test failed: {e}")
        results['response_times'] = {'error': str(e)}
    
    # 3. Different user agents test
    print("\n🤖 USER AGENT COMPATIBILITY TEST")
    user_agents = {
        'Chrome_Desktop': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Firefox_Desktop': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Safari_Desktop': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        'Mobile_Chrome': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
        'Mobile_Firefox': 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
        'Googlebot': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
        'curl': 'curl/7.68.0',
        'Empty': ''
    }
    
    ua_results = {}
    for name, ua in user_agents.items():
        try:
            headers = {'User-Agent': ua} if ua else {}
            response = requests.get(url, headers=headers, timeout=10)
            ua_results[name] = {
                'status_code': response.status_code,
                'response_time': response.elapsed.total_seconds() * 1000,
                'success': True
            }
            print(f"  ✅ {name}: {response.status_code} ({response.elapsed.total_seconds()*1000:.2f}ms)")
        except Exception as e:
            ua_results[name] = {'error': str(e), 'success': False}
            print(f"  ❌ {name}: {e}")
    
    results['user_agents'] = ua_results
    
    # 4. HTTP methods test
    print("\n🔧 HTTP METHODS TEST")
    methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    method_results = {}
    
    for method in methods:
        try:
            response = requests.request(method, url, timeout=10)
            method_results[method] = {
                'status_code': response.status_code,
                'success': True
            }
            print(f"  {method}: {response.status_code}")
        except Exception as e:
            method_results[method] = {'error': str(e), 'success': False}
            print(f"  {method}: ERROR - {e}")
    
    results['http_methods'] = method_results
    
    # 5. DNS and SSL analysis
    print("\n🌐 DNS & SSL ANALYSIS")
    try:
        # IP resolution
        ip = socket.gethostbyname(domain)
        print(f"  IP Address: {ip}")
        
        # SSL certificate info
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                cipher = ssock.cipher()
                
        print(f"  SSL Subject: {dict(x[0] for x in cert['subject'])}")
        print(f"  SSL Issuer: {dict(x[0] for x in cert['issuer'])}")
        print(f"  SSL Valid Until: {cert['notAfter']}")
        print(f"  TLS Version: {ssock.version()}")
        print(f"  Cipher: {cipher[0]}")
        
        results['dns_ssl'] = {
            'ip_address': ip,
            'ssl_subject': dict(x[0] for x in cert['subject']),
            'ssl_issuer': dict(x[0] for x in cert['issuer']),
            'ssl_valid_until': cert['notAfter'],
            'tls_version': ssock.version(),
            'cipher': cipher[0]
        }
        
    except Exception as e:
        print(f"  ❌ DNS/SSL analysis failed: {e}")
        results['dns_ssl'] = {'error': str(e)}
    
    # 6. Concurrent request test (rate limiting check)
    print("\n🚀 CONCURRENT REQUEST TEST")
    try:
        def make_request(i):
            start = time.time()
            response = requests.get(url, timeout=10)
            end = time.time()
            return {
                'request_id': i,
                'status_code': response.status_code,
                'response_time': (end - start) * 1000
            }
        
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request, i) for i in range(20)]
            concurrent_results = []
            
            for future in as_completed(futures):
                result = future.result()
                concurrent_results.append(result)
                print(f"  Request {result['request_id']}: {result['status_code']} ({result['response_time']:.2f}ms)")
        
        # Analyze for rate limiting
        status_codes = [r['status_code'] for r in concurrent_results]
        success_rate = len([c for c in status_codes if c == 200]) / len(status_codes) * 100
        
        results['concurrent_test'] = {
            'results': concurrent_results,
            'success_rate': success_rate,
            'potential_rate_limiting': success_rate < 90
        }
        
        print(f"📊 Success Rate: {success_rate:.1f}%")
        print(f"📊 Rate Limiting Detected: {'Yes' if success_rate < 90 else 'No'}")
        
    except Exception as e:
        print(f"❌ Concurrent test failed: {e}")
        results['concurrent_test'] = {'error': str(e)}
    
    # 7. Infrastructure analysis from headers
    print("\n🏗️  INFRASTRUCTURE ANALYSIS")
    try:
        response = requests.get(url, timeout=10)
        headers = response.headers
        
        infrastructure_info = {
            'server': headers.get('Server', 'Unknown'),
            'cdn_indicators': [],
            'hosting_platform': 'Unknown',
            'caching_info': {}
        }
        
        # Analyze headers for infrastructure clues
        if 'x-oss-' in str(headers).lower():
            infrastructure_info['hosting_platform'] = 'Alibaba Cloud OSS'
            infrastructure_info['cdn_indicators'].append('Alibaba Cloud CDN')
        
        if 'ali-swift' in str(headers).lower():
            infrastructure_info['cdn_indicators'].append('Alibaba Swift CDN')
            
        if 'Via' in headers:
            infrastructure_info['cdn_indicators'].append(f"Via: {headers['Via']}")
            
        if 'X-Cache' in headers:
            infrastructure_info['caching_info']['cache_status'] = headers['X-Cache']
            
        if 'Age' in headers:
            infrastructure_info['caching_info']['cache_age'] = headers['Age']
            
        print(f"  🖥️  Server: {infrastructure_info['server']}")
        print(f"  ☁️  Hosting: {infrastructure_info['hosting_platform']}")
        print(f"  🌐 CDN: {', '.join(infrastructure_info['cdn_indicators']) if infrastructure_info['cdn_indicators'] else 'None detected'}")
        print(f"  💾 Cache: {infrastructure_info['caching_info']}")
        
        results['infrastructure'] = infrastructure_info
        
    except Exception as e:
        print(f"❌ Infrastructure analysis failed: {e}")
        results['infrastructure'] = {'error': str(e)}
    
    # 8. Geographic and accessibility analysis
    print("\n🌍 GEOGRAPHIC ACCESSIBILITY")
    try:
        # Test with different accept-language headers
        languages = ['en-US', 'zh-CN', 'ja-JP', 'ko-KR', 'de-DE', 'fr-FR']
        geo_results = {}
        
        for lang in languages:
            try:
                headers = {'Accept-Language': lang}
                response = requests.get(url, headers=headers, timeout=10)
                geo_results[lang] = {
                    'status_code': response.status_code,
                    'response_time': response.elapsed.total_seconds() * 1000,
                    'content_length': len(response.content)
                }
                print(f"  {lang}: {response.status_code} ({response.elapsed.total_seconds()*1000:.2f}ms)")
            except Exception as e:
                geo_results[lang] = {'error': str(e)}
                print(f"  {lang}: ERROR - {e}")
        
        results['geographic'] = geo_results
        
    except Exception as e:
        print(f"❌ Geographic test failed: {e}")
        results['geographic'] = {'error': str(e)}
    
    # Save results
    results['timestamp'] = datetime.now().isoformat()
    results['url_tested'] = url
    
    with open('/workspace/data/quick_diagnostics_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n✅ Diagnostics complete! Results saved to /workspace/data/quick_diagnostics_results.json")
    
    return results

if __name__ == "__main__":
    test_website_comprehensive()
