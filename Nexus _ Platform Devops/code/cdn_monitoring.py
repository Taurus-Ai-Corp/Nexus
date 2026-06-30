#!/usr/bin/env python3
"""
CDN Performance Analytics and Monitoring
Alibaba Cloud CDN monitoring with failover detection
"""

import json
import logging
import sqlite3
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

import requests


class CDNMonitor:
    def __init__(self, config_file='cdn_config.json'):
        self.config = self.load_config(config_file)
        self.setup_database()
        self.setup_logging()

    def load_config(self, config_file):
        """Load CDN monitoring configuration"""
        default_config = {
            "primary_url": "https://vc1j5apvcf.space.minimax.io/features",
            "cdn_endpoints": [
                {
                    "name": "Primary CDN",
                    "url": "https://vc1j5apvcf.space.minimax.io/features",
                    "type": "primary"
                }
            ],
            "test_resources": [
                {
                    "name": "Main CSS",
                    "path": "/styles/main.css",
                    "type": "css",
                    "expected_size_min": 1000
                },
                {
                    "name": "Main JS",
                    "path": "/scripts/main.js",
                    "type": "javascript",
                    "expected_size_min": 5000
                },
                {
                    "name": "Logo Image",
                    "path": "/images/logo.png",
                    "type": "image",
                    "expected_size_min": 2000
                }
            ],
            "monitoring": {
                "check_interval": 300,  # 5 minutes
                "timeout": 30,
                "concurrent_requests": 5,
                "cache_validation": True,
                "gzip_validation": True
            },
            "thresholds": {
                "response_time_warning": 2000,  # 2 seconds
                "response_time_critical": 5000,  # 5 seconds
                "cache_hit_ratio_min": 80,      # 80%
                "availability_min": 99.0        # 99%
            },
            "geographic_tests": [
                {"location": "US-East", "proxy": None},
                {"location": "US-West", "proxy": None},
                {"location": "EU-Central", "proxy": None},
                {"location": "Asia-Pacific", "proxy": None}
            ]
        }

        try:
            with open(config_file) as f:
                config = json.load(f)
                # Merge with defaults
                for key, value in default_config.items():
                    if key not in config:
                        config[key] = value
                return config
        except FileNotFoundError:
            with open(config_file, 'w') as f:
                json.dump(default_config, f, indent=2)
            return default_config

    def setup_database(self):
        """Initialize CDN monitoring database"""
        self.db_path = 'cdn_monitoring.db'
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # CDN performance results
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cdn_performance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                endpoint_name TEXT,
                endpoint_url TEXT,
                location TEXT,
                response_time REAL,
                status_code INTEGER,
                content_length INTEGER,
                cache_status TEXT,
                edge_server TEXT,
                success BOOLEAN,
                error_message TEXT
            )
        ''')

        # Resource performance
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS resource_performance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                resource_name TEXT,
                resource_url TEXT,
                location TEXT,
                response_time REAL,
                status_code INTEGER,
                content_length INTEGER,
                cache_status TEXT,
                compression_type TEXT,
                success BOOLEAN,
                error_message TEXT
            )
        ''')

        # Cache performance metrics
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cache_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                endpoint_name TEXT,
                location TEXT,
                cache_hits INTEGER,
                cache_misses INTEGER,
                cache_hit_ratio REAL,
                avg_response_time REAL,
                total_requests INTEGER
            )
        ''')

        # CDN failover events
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS failover_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                event_type TEXT,
                endpoint_name TEXT,
                location TEXT,
                description TEXT,
                severity TEXT,
                resolved BOOLEAN DEFAULT FALSE,
                resolved_timestamp DATETIME
            )
        ''')

        conn.commit()
        conn.close()

    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('cdn_monitoring.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def test_cdn_endpoint(self, endpoint, location="default"):
        """Test individual CDN endpoint performance"""
        url = endpoint['url']
        name = endpoint['name']

        result = {
            'timestamp': datetime.now(),
            'endpoint_name': name,
            'endpoint_url': url,
            'location': location,
            'success': False,
            'response_time': None,
            'status_code': None,
            'content_length': None,
            'cache_status': None,
            'edge_server': None,
            'error_message': None
        }

        try:
            # Add headers to get CDN information
            headers = {
                'User-Agent': 'CDN-Monitor/1.0',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }

            start_time = time.time()
            response = requests.get(url, headers=headers, timeout=self.config['monitoring']['timeout'])
            end_time = time.time()

            result['success'] = True
            result['response_time'] = (end_time - start_time) * 1000
            result['status_code'] = response.status_code
            result['content_length'] = len(response.content)

            # Extract CDN-specific headers
            result['cache_status'] = self.extract_cache_status(response.headers)
            result['edge_server'] = self.extract_edge_server(response.headers)

            self.logger.info(f"CDN test successful - {name} ({location}): {result['response_time']:.2f}ms")

        except requests.exceptions.Timeout:
            result['error_message'] = "Request timeout"
            self.logger.warning(f"CDN test timeout - {name} ({location})")

        except requests.exceptions.ConnectionError as e:
            result['error_message'] = f"Connection error: {str(e)}"
            self.logger.error(f"CDN test connection error - {name} ({location}): {str(e)}")

        except Exception as e:
            result['error_message'] = str(e)
            self.logger.error(f"CDN test error - {name} ({location}): {str(e)}")

        return result

    def extract_cache_status(self, headers):
        """Extract cache status from response headers"""
        # Common CDN cache status headers
        cache_headers = [
            'X-Cache',           # Cloudflare, others
            'CF-Cache-Status',   # Cloudflare
            'X-Cache-Status',    # Various CDNs
            'Cache-Status',      # Standard
            'Ali-Swift-Global-Savetime',  # Alibaba CDN
            'X-Swift-CacheTime'  # Alibaba CDN
        ]

        for header in cache_headers:
            if header in headers:
                return f"{header}: {headers[header]}"

        # Check for Alibaba CDN specific indicators
        if 'Via' in headers and 'ens-cache' in headers['Via']:
            return f"Alibaba CDN Cache: {headers.get('X-Cache', 'Unknown')}"

        return "Unknown"

    def extract_edge_server(self, headers):
        """Extract edge server information from response headers"""
        # Look for server identification headers
        server_headers = [
            'Server',
            'X-Served-By',
            'X-Cache-Server',
            'Via',
            'EagleId'  # Alibaba CDN
        ]

        server_info = []
        for header in server_headers:
            if header in headers:
                server_info.append(f"{header}: {headers[header]}")

        return "; ".join(server_info) if server_info else "Unknown"

    def test_resource_performance(self, resource, location="default"):
        """Test individual resource performance through CDN"""
        base_url = self.config['primary_url'].rstrip('/')
        resource_url = base_url + resource['path']

        result = {
            'timestamp': datetime.now(),
            'resource_name': resource['name'],
            'resource_url': resource_url,
            'location': location,
            'success': False,
            'response_time': None,
            'status_code': None,
            'content_length': None,
            'cache_status': None,
            'compression_type': None,
            'error_message': None
        }

        try:
            # Test with and without cache
            headers = {
                'User-Agent': 'CDN-Monitor/1.0',
                'Accept-Encoding': 'gzip, deflate, br'
            }

            start_time = time.time()
            response = requests.get(resource_url, headers=headers,
                                  timeout=self.config['monitoring']['timeout'])
            end_time = time.time()

            result['success'] = True
            result['response_time'] = (end_time - start_time) * 1000
            result['status_code'] = response.status_code
            result['content_length'] = len(response.content)
            result['cache_status'] = self.extract_cache_status(response.headers)
            result['compression_type'] = response.headers.get('Content-Encoding', 'none')

            # Validate resource size
            if 'expected_size_min' in resource:
                if result['content_length'] < resource['expected_size_min']:
                    result['error_message'] = f"Content size too small: {result['content_length']} bytes"
                    result['success'] = False

            self.logger.info(f"Resource test - {resource['name']} ({location}): {result['response_time']:.2f}ms")

        except Exception as e:
            result['error_message'] = str(e)
            self.logger.error(f"Resource test error - {resource['name']} ({location}): {str(e)}")

        return result

    def test_cache_behavior(self, endpoint, location="default"):
        """Test CDN cache behavior"""
        url = endpoint['url']
        cache_results = {
            'cache_miss': None,
            'cache_hit': None,
            'cache_efficiency': 0
        }

        try:
            # First request (should be cache miss or fill)
            headers_miss = {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'User-Agent': 'CDN-Monitor/1.0'
            }

            start_time = time.time()
            response_miss = requests.get(url, headers=headers_miss, timeout=30)
            miss_time = (time.time() - start_time) * 1000

            # Second request (should be cache hit)
            headers_hit = {
                'User-Agent': 'CDN-Monitor/1.0'
            }

            start_time = time.time()
            response_hit = requests.get(url, headers=headers_hit, timeout=30)
            hit_time = (time.time() - start_time) * 1000

            cache_results['cache_miss'] = {
                'response_time': miss_time,
                'cache_status': self.extract_cache_status(response_miss.headers)
            }

            cache_results['cache_hit'] = {
                'response_time': hit_time,
                'cache_status': self.extract_cache_status(response_hit.headers)
            }

            # Calculate cache efficiency
            if miss_time > 0 and hit_time > 0:
                cache_results['cache_efficiency'] = ((miss_time - hit_time) / miss_time) * 100

            self.logger.info(f"Cache test - {endpoint['name']} ({location}): "
                           f"Miss: {miss_time:.2f}ms, Hit: {hit_time:.2f}ms, "
                           f"Efficiency: {cache_results['cache_efficiency']:.1f}%")

        except Exception as e:
            self.logger.error(f"Cache test error - {endpoint['name']} ({location}): {str(e)}")

        return cache_results

    def test_failover_scenario(self):
        """Test CDN failover behavior"""
        failover_results = []

        for endpoint in self.config['cdn_endpoints']:
            # Test with various failure scenarios
            test_scenarios = [
                {
                    'name': 'timeout_test',
                    'timeout': 1,  # Very short timeout
                    'description': 'Test with 1-second timeout'
                },
                {
                    'name': 'invalid_headers',
                    'headers': {'Host': 'invalid-host.example.com'},
                    'description': 'Test with invalid host header'
                },
                {
                    'name': 'large_request',
                    'headers': {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' * 100},
                    'description': 'Test with oversized headers'
                }
            ]

            for scenario in test_scenarios:
                try:
                    kwargs = {
                        'timeout': scenario.get('timeout', 30),
                        'headers': scenario.get('headers', {})
                    }

                    start_time = time.time()
                    response = requests.get(endpoint['url'], **kwargs)
                    end_time = time.time()

                    result = {
                        'endpoint_name': endpoint['name'],
                        'scenario': scenario['name'],
                        'description': scenario['description'],
                        'success': True,
                        'response_time': (end_time - start_time) * 1000,
                        'status_code': response.status_code
                    }

                except Exception as e:
                    result = {
                        'endpoint_name': endpoint['name'],
                        'scenario': scenario['name'],
                        'description': scenario['description'],
                        'success': False,
                        'error': str(e)
                    }

                failover_results.append(result)
                self.logger.info(f"Failover test - {endpoint['name']}/{scenario['name']}: "
                               f"{'Success' if result['success'] else 'Failed'}")

        return failover_results

    def run_geographic_tests(self):
        """Run CDN tests from multiple geographic locations"""
        all_results = []

        # Test all endpoints from all locations
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = []

            for location in self.config['geographic_tests']:
                for endpoint in self.config['cdn_endpoints']:
                    future = executor.submit(self.test_cdn_endpoint, endpoint, location['location'])
                    futures.append(future)

                    # Test resources from this location
                    for resource in self.config['test_resources']:
                        future = executor.submit(self.test_resource_performance, resource, location['location'])
                        futures.append(future)

            # Collect results
            for future in as_completed(futures):
                try:
                    result = future.result()
                    all_results.append(result)

                    # Store in database
                    if 'endpoint_name' in result:
                        self.store_cdn_result(result)
                    else:
                        self.store_resource_result(result)

                except Exception as e:
                    self.logger.error(f"Geographic test error: {str(e)}")

        return all_results

    def store_cdn_result(self, result):
        """Store CDN test result in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO cdn_performance 
            (timestamp, endpoint_name, endpoint_url, location, response_time, 
             status_code, content_length, cache_status, edge_server, success, error_message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            result['timestamp'], result['endpoint_name'], result['endpoint_url'],
            result['location'], result['response_time'], result['status_code'],
            result['content_length'], result['cache_status'], result['edge_server'],
            result['success'], result['error_message']
        ))

        conn.commit()
        conn.close()

    def store_resource_result(self, result):
        """Store resource test result in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO resource_performance 
            (timestamp, resource_name, resource_url, location, response_time, 
             status_code, content_length, cache_status, compression_type, success, error_message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            result['timestamp'], result['resource_name'], result['resource_url'],
            result['location'], result['response_time'], result['status_code'],
            result['content_length'], result['cache_status'], result['compression_type'],
            result['success'], result['error_message']
        ))

        conn.commit()
        conn.close()

    def analyze_cache_performance(self):
        """Analyze CDN cache performance over time"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Get cache hit ratio by endpoint and location
        cursor.execute('''
            SELECT endpoint_name, location, cache_status, COUNT(*) as count,
                   AVG(response_time) as avg_response_time
            FROM cdn_performance 
            WHERE timestamp > datetime('now', '-24 hours')
            AND success = 1
            GROUP BY endpoint_name, location, cache_status
        ''')

        cache_data = cursor.fetchall()

        # Calculate cache metrics
        cache_metrics = {}
        for row in cache_data:
            endpoint, location, cache_status, count, avg_response_time = row
            key = f"{endpoint}_{location}"

            if key not in cache_metrics:
                cache_metrics[key] = {
                    'endpoint_name': endpoint,
                    'location': location,
                    'cache_hits': 0,
                    'cache_misses': 0,
                    'total_requests': 0,
                    'avg_response_time': 0
                }

            # Determine if this was a cache hit or miss based on status
            if 'HIT' in cache_status.upper() or 'CACHED' in cache_status.upper():
                cache_metrics[key]['cache_hits'] += count
            else:
                cache_metrics[key]['cache_misses'] += count

            cache_metrics[key]['total_requests'] += count
            cache_metrics[key]['avg_response_time'] = avg_response_time

        # Calculate hit ratios and store
        for key, metrics in cache_metrics.items():
            if metrics['total_requests'] > 0:
                hit_ratio = (metrics['cache_hits'] / metrics['total_requests']) * 100
                metrics['cache_hit_ratio'] = hit_ratio

                # Store in cache_metrics table
                cursor.execute('''
                    INSERT INTO cache_metrics
                    (endpoint_name, location, cache_hits, cache_misses, 
                     cache_hit_ratio, avg_response_time, total_requests)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    metrics['endpoint_name'], metrics['location'],
                    metrics['cache_hits'], metrics['cache_misses'],
                    hit_ratio, metrics['avg_response_time'],
                    metrics['total_requests']
                ))

        conn.commit()
        conn.close()

        return cache_metrics

    def detect_performance_anomalies(self):
        """Detect CDN performance anomalies"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        anomalies = []
        thresholds = self.config['thresholds']

        # Check recent performance against thresholds
        cursor.execute('''
            SELECT endpoint_name, location, AVG(response_time) as avg_response_time,
                   COUNT(*) as total_requests,
                   SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_requests
            FROM cdn_performance 
            WHERE timestamp > datetime('now', '-1 hour')
            GROUP BY endpoint_name, location
        ''')

        performance_data = cursor.fetchall()

        for row in performance_data:
            endpoint, location, avg_response_time, total_requests, successful_requests = row

            # Calculate availability
            availability = (successful_requests / total_requests * 100) if total_requests > 0 else 0

            # Check response time thresholds
            if avg_response_time > thresholds['response_time_critical']:
                anomalies.append({
                    'type': 'slow_response_critical',
                    'endpoint': endpoint,
                    'location': location,
                    'value': avg_response_time,
                    'threshold': thresholds['response_time_critical'],
                    'severity': 'critical'
                })
            elif avg_response_time > thresholds['response_time_warning']:
                anomalies.append({
                    'type': 'slow_response_warning',
                    'endpoint': endpoint,
                    'location': location,
                    'value': avg_response_time,
                    'threshold': thresholds['response_time_warning'],
                    'severity': 'warning'
                })

            # Check availability
            if availability < thresholds['availability_min']:
                anomalies.append({
                    'type': 'low_availability',
                    'endpoint': endpoint,
                    'location': location,
                    'value': availability,
                    'threshold': thresholds['availability_min'],
                    'severity': 'critical'
                })

        conn.close()
        return anomalies

    def generate_cdn_report(self):
        """Generate CDN performance report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'performance_summary': {},
            'cache_analysis': {},
            'anomalies': [],
            'recommendations': []
        }

        # Run analysis
        cache_metrics = self.analyze_cache_performance()
        anomalies = self.detect_performance_anomalies()

        report['cache_analysis'] = cache_metrics
        report['anomalies'] = anomalies

        # Generate recommendations
        recommendations = []

        if anomalies:
            for anomaly in anomalies:
                if anomaly['type'] == 'slow_response_critical':
                    recommendations.append(f"Critical: Investigate slow response times in {anomaly['location']} ({anomaly['value']:.2f}ms)")
                elif anomaly['type'] == 'low_availability':
                    recommendations.append(f"Critical: Low availability in {anomaly['location']} ({anomaly['value']:.1f}%)")

        # Check cache performance
        for key, metrics in cache_metrics.items():
            if metrics.get('cache_hit_ratio', 0) < self.config['thresholds']['cache_hit_ratio_min']:
                recommendations.append(f"Optimize caching for {metrics['endpoint_name']} in {metrics['location']} "
                                     f"(hit ratio: {metrics.get('cache_hit_ratio', 0):.1f}%)")

        if not recommendations:
            recommendations.append("CDN performance is optimal - no issues detected")

        report['recommendations'] = recommendations

        return report

    def start_continuous_monitoring(self):
        """Start continuous CDN monitoring"""
        self.logger.info("Starting CDN continuous monitoring...")

        while True:
            try:
                # Run geographic tests
                self.run_geographic_tests()

                # Test cache behavior
                for endpoint in self.config['cdn_endpoints']:
                    self.test_cache_behavior(endpoint)

                # Analyze performance
                self.analyze_cache_performance()

                # Check for anomalies
                anomalies = self.detect_performance_anomalies()
                if anomalies:
                    self.logger.warning(f"CDN anomalies detected: {len(anomalies)} issues")
                    for anomaly in anomalies:
                        self.logger.warning(f"Anomaly: {anomaly}")

                # Sleep until next check
                time.sleep(self.config['monitoring']['check_interval'])

            except KeyboardInterrupt:
                self.logger.info("CDN monitoring stopped by user")
                break
            except Exception as e:
                self.logger.error(f"CDN monitoring error: {str(e)}")
                time.sleep(60)

def main():
    """Main CDN monitoring function"""
    monitor = CDNMonitor()

    import sys
    if len(sys.argv) > 1:
        if sys.argv[1] == 'test':
            # Single test run
            print("Running CDN performance test...")
            results = monitor.run_geographic_tests()
            print(f"Completed {len(results)} tests")

        elif sys.argv[1] == 'report':
            # Generate report
            report = monitor.generate_cdn_report()
            print(json.dumps(report, indent=2, default=str))

        elif sys.argv[1] == 'failover':
            # Test failover scenarios
            print("Testing CDN failover scenarios...")
            results = monitor.test_failover_scenario()
            print(json.dumps(results, indent=2, default=str))
    else:
        # Continuous monitoring
        monitor.start_continuous_monitoring()

if __name__ == "__main__":
    main()
