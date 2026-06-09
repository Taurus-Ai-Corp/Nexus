#!/usr/bin/env python3
"""
Automated Technical Audits System
Periodic security, performance, and compatibility testing
"""

import requests
import ssl
import socket
import subprocess
import json
import time
import sqlite3
from datetime import datetime, timedelta
import concurrent.futures
import re
import hashlib
import os
import logging
from urllib.parse import urljoin, urlparse
import threading
import schedule

class AutomatedAuditor:
    def __init__(self, config_file='audit_config.json'):
        self.config = self.load_config(config_file)
        self.setup_database()
        self.setup_logging()
        
    def load_config(self, config_file):
        """Load audit configuration"""
        default_config = {
            "target_website": "https://vc1j5apvcf.space.minimax.io/features",
            "audit_schedule": {
                "security_scan": "daily",      # daily, weekly, monthly
                "performance_test": "hourly",  # hourly, daily, weekly
                "compatibility_test": "weekly",
                "certificate_check": "daily"
            },
            "security_tests": {
                "ssl_configuration": True,
                "header_security": True,
                "vulnerability_scan": True,
                "content_security_policy": True,
                "cookie_security": True
            },
            "performance_benchmarks": {
                "response_time_threshold": 2000,  # milliseconds
                "page_size_threshold": 2048000,   # 2MB
                "resource_count_threshold": 50,
                "lighthouse_audit": True
            },
            "compatibility_matrix": {
                "user_agents": [
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
                    "Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0"
                ],
                "viewport_sizes": [
                    {"width": 1920, "height": 1080, "name": "Desktop FHD"},
                    {"width": 1366, "height": 768, "name": "Desktop HD"},
                    {"width": 768, "height": 1024, "name": "Tablet Portrait"},
                    {"width": 375, "height": 667, "name": "Mobile Portrait"},
                    {"width": 414, "height": 896, "name": "Mobile Large"}
                ]
            },
            "notification_settings": {
                "critical_issues": True,
                "performance_degradation": True,
                "security_vulnerabilities": True,
                "certificate_expiry": True
            }
        }
        
        try:
            with open(config_file, 'r') as f:
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
        """Initialize audit database"""
        self.db_path = 'audit_results.db'
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Security audit results
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS security_audits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                audit_type TEXT,
                url TEXT,
                result_data TEXT,
                score INTEGER,
                issues_found INTEGER,
                critical_issues INTEGER,
                warnings INTEGER,
                passed_checks INTEGER,
                total_checks INTEGER
            )
        ''')
        
        # Performance audit results
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS performance_audits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                url TEXT,
                response_time REAL,
                page_size INTEGER,
                resource_count INTEGER,
                lighthouse_score INTEGER,
                first_contentful_paint REAL,
                largest_contentful_paint REAL,
                cumulative_layout_shift REAL,
                time_to_interactive REAL,
                result_data TEXT
            )
        ''')
        
        # Compatibility audit results
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS compatibility_audits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                url TEXT,
                user_agent TEXT,
                viewport_size TEXT,
                success BOOLEAN,
                response_time REAL,
                error_message TEXT,
                rendering_issues TEXT,
                javascript_errors TEXT
            )
        ''')
        
        # Certificate monitoring
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS certificate_audits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                url TEXT,
                certificate_subject TEXT,
                certificate_issuer TEXT,
                expiry_date TEXT,
                days_until_expiry INTEGER,
                certificate_chain TEXT,
                vulnerabilities TEXT,
                score INTEGER
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
                logging.FileHandler('automated_audits.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def run_security_audit(self, url=None):
        """Comprehensive security audit"""
        target_url = url or self.config['target_website']
        audit_results = {
            'timestamp': datetime.now().isoformat(),
            'url': target_url,
            'tests': {},
            'score': 0,
            'issues': [],
            'recommendations': []
        }
        
        self.logger.info(f"Starting security audit for {target_url}")
        
        # SSL/TLS Configuration Test
        if self.config['security_tests']['ssl_configuration']:
            ssl_result = self.test_ssl_configuration(target_url)
            audit_results['tests']['ssl_configuration'] = ssl_result
            if ssl_result['score'] < 80:
                audit_results['issues'].append(f"SSL configuration issues detected (score: {ssl_result['score']})")
        
        # Security Headers Test
        if self.config['security_tests']['header_security']:
            headers_result = self.test_security_headers(target_url)
            audit_results['tests']['security_headers'] = headers_result
            if headers_result['missing_headers']:
                audit_results['issues'].append(f"Missing security headers: {', '.join(headers_result['missing_headers'])}")
        
        # Content Security Policy Test
        if self.config['security_tests']['content_security_policy']:
            csp_result = self.test_content_security_policy(target_url)
            audit_results['tests']['content_security_policy'] = csp_result
            if not csp_result['has_csp']:
                audit_results['issues'].append("Content Security Policy not implemented")
        
        # Cookie Security Test
        if self.config['security_tests']['cookie_security']:
            cookie_result = self.test_cookie_security(target_url)
            audit_results['tests']['cookie_security'] = cookie_result
            if cookie_result['insecure_cookies']:
                audit_results['issues'].append(f"Insecure cookies detected: {len(cookie_result['insecure_cookies'])}")
        
        # Basic Vulnerability Scan
        if self.config['security_tests']['vulnerability_scan']:
            vuln_result = self.basic_vulnerability_scan(target_url)
            audit_results['tests']['vulnerability_scan'] = vuln_result
            if vuln_result['vulnerabilities']:
                audit_results['issues'].extend(vuln_result['vulnerabilities'])
        
        # Calculate overall security score
        total_score = sum(test.get('score', 0) for test in audit_results['tests'].values())
        test_count = len(audit_results['tests'])
        audit_results['score'] = total_score / test_count if test_count > 0 else 0
        
        # Store results
        self.store_security_audit(audit_results)
        
        self.logger.info(f"Security audit completed. Score: {audit_results['score']:.1f}, Issues: {len(audit_results['issues'])}")
        return audit_results
    
    def test_ssl_configuration(self, url):
        """Test SSL/TLS configuration"""
        result = {
            'score': 0,
            'details': {},
            'issues': []
        }
        
        try:
            hostname = urlparse(url).hostname
            context = ssl.create_default_context()
            
            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    cipher = ssock.cipher()
                    protocol = ssock.version()
                    
            # Check protocol version
            if protocol == 'TLSv1.3':
                protocol_score = 100
            elif protocol == 'TLSv1.2':
                protocol_score = 90
            else:
                protocol_score = 50
                result['issues'].append(f"Outdated TLS version: {protocol}")
            
            # Check cipher strength
            cipher_name = cipher[0] if cipher else 'Unknown'
            if 'AES_256' in cipher_name or 'CHACHA20' in cipher_name:
                cipher_score = 100
            elif 'AES_128' in cipher_name:
                cipher_score = 90
            else:
                cipher_score = 70
                result['issues'].append(f"Weak cipher: {cipher_name}")
            
            # Check certificate expiry
            expiry_date = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
            days_until_expiry = (expiry_date - datetime.now()).days
            
            if days_until_expiry > 30:
                expiry_score = 100
            elif days_until_expiry > 7:
                expiry_score = 80
            else:
                expiry_score = 50
                result['issues'].append(f"Certificate expires soon: {days_until_expiry} days")
            
            result['score'] = (protocol_score + cipher_score + expiry_score) / 3
            result['details'] = {
                'protocol': protocol,
                'cipher': cipher_name,
                'certificate_expiry': expiry_date.isoformat(),
                'days_until_expiry': days_until_expiry
            }
            
        except Exception as e:
            result['score'] = 0
            result['issues'].append(f"SSL test failed: {str(e)}")
        
        return result
    
    def test_security_headers(self, url):
        """Test security headers"""
        result = {
            'score': 0,
            'present_headers': [],
            'missing_headers': [],
            'header_values': {}
        }
        
        security_headers = {
            'strict-transport-security': 20,
            'content-security-policy': 25,
            'x-frame-options': 15,
            'x-content-type-options': 10,
            'x-xss-protection': 10,
            'referrer-policy': 10,
            'permissions-policy': 10
        }
        
        try:
            response = requests.get(url, timeout=30)
            headers = {k.lower(): v for k, v in response.headers.items()}
            
            total_possible_score = sum(security_headers.values())
            achieved_score = 0
            
            for header, score in security_headers.items():
                if header in headers:
                    result['present_headers'].append(header)
                    result['header_values'][header] = headers[header]
                    achieved_score += score
                else:
                    result['missing_headers'].append(header)
            
            result['score'] = (achieved_score / total_possible_score) * 100
            
        except Exception as e:
            result['score'] = 0
            result['missing_headers'] = list(security_headers.keys())
        
        return result
    
    def test_content_security_policy(self, url):
        """Test Content Security Policy implementation"""
        result = {
            'has_csp': False,
            'csp_header': None,
            'directives': {},
            'score': 0,
            'issues': []
        }
        
        try:
            response = requests.get(url, timeout=30)
            
            csp_header = response.headers.get('Content-Security-Policy') or \
                        response.headers.get('content-security-policy')
            
            if csp_header:
                result['has_csp'] = True
                result['csp_header'] = csp_header
                result['score'] = 80  # Base score for having CSP
                
                # Parse CSP directives
                directives = {}
                for directive in csp_header.split(';'):
                    directive = directive.strip()
                    if directive:
                        parts = directive.split(' ', 1)
                        if len(parts) == 2:
                            directives[parts[0]] = parts[1]
                        else:
                            directives[parts[0]] = ''
                
                result['directives'] = directives
                
                # Check for unsafe directives
                unsafe_patterns = ['unsafe-inline', 'unsafe-eval', '*']
                for directive, value in directives.items():
                    for pattern in unsafe_patterns:
                        if pattern in value:
                            result['issues'].append(f"Unsafe CSP directive: {directive} contains {pattern}")
                            result['score'] -= 10
            else:
                result['score'] = 0
                result['issues'].append("No Content Security Policy header found")
                
        except Exception as e:
            result['score'] = 0
            result['issues'].append(f"CSP test failed: {str(e)}")
        
        return result
    
    def test_cookie_security(self, url):
        """Test cookie security configuration"""
        result = {
            'score': 100,
            'cookies': [],
            'insecure_cookies': [],
            'issues': []
        }
        
        try:
            response = requests.get(url, timeout=30)
            
            for cookie in response.cookies:
                cookie_info = {
                    'name': cookie.name,
                    'secure': cookie.secure,
                    'httponly': hasattr(cookie, 'httponly') and cookie.httponly,
                    'samesite': getattr(cookie, 'samesite', None)
                }
                
                result['cookies'].append(cookie_info)
                
                # Check for security issues
                issues = []
                if not cookie.secure:
                    issues.append('not secure')
                if not (hasattr(cookie, 'httponly') and cookie.httponly):
                    issues.append('not httponly')
                if not getattr(cookie, 'samesite', None):
                    issues.append('no samesite attribute')
                
                if issues:
                    result['insecure_cookies'].append({
                        'name': cookie.name,
                        'issues': issues
                    })
                    result['score'] -= 20
            
            if result['insecure_cookies']:
                result['issues'].append(f"Found {len(result['insecure_cookies'])} insecure cookies")
            
        except Exception as e:
            result['score'] = 0
            result['issues'].append(f"Cookie test failed: {str(e)}")
        
        return result
    
    def basic_vulnerability_scan(self, url):
        """Basic vulnerability scanning"""
        result = {
            'score': 100,
            'vulnerabilities': [],
            'tests_run': []
        }
        
        # Test for common vulnerabilities
        vulnerability_tests = [
            self.test_clickjacking_protection,
            self.test_server_disclosure,
            self.test_directory_traversal,
            self.test_sql_injection_basic,
            self.test_xss_basic
        ]
        
        for test_func in vulnerability_tests:
            try:
                test_result = test_func(url)
                result['tests_run'].append(test_result['test_name'])
                
                if test_result['vulnerable']:
                    result['vulnerabilities'].append(test_result['description'])
                    result['score'] -= test_result['severity_score']
                    
            except Exception as e:
                self.logger.error(f"Vulnerability test error: {str(e)}")
        
        result['score'] = max(0, result['score'])  # Ensure score doesn't go below 0
        return result
    
    def test_clickjacking_protection(self, url):
        """Test for clickjacking protection"""
        try:
            response = requests.get(url, timeout=30)
            
            x_frame_options = response.headers.get('X-Frame-Options', '').upper()
            csp = response.headers.get('Content-Security-Policy', '')
            
            protected = bool(x_frame_options in ['DENY', 'SAMEORIGIN'] or 'frame-ancestors' in csp)
            
            return {
                'test_name': 'Clickjacking Protection',
                'vulnerable': not protected,
                'description': 'Missing clickjacking protection (X-Frame-Options or CSP frame-ancestors)',
                'severity_score': 15
            }
        except:
            return {
                'test_name': 'Clickjacking Protection',
                'vulnerable': False,
                'description': 'Test failed',
                'severity_score': 0
            }
    
    def test_server_disclosure(self, url):
        """Test for server information disclosure"""
        try:
            response = requests.get(url, timeout=30)
            
            server_header = response.headers.get('Server', '')
            x_powered_by = response.headers.get('X-Powered-By', '')
            
            disclosed = bool(server_header or x_powered_by)
            
            return {
                'test_name': 'Server Information Disclosure',
                'vulnerable': disclosed,
                'description': f'Server information disclosed: {server_header} {x_powered_by}',
                'severity_score': 5
            }
        except:
            return {
                'test_name': 'Server Information Disclosure',
                'vulnerable': False,
                'description': 'Test failed',
                'severity_score': 0
            }
    
    def test_directory_traversal(self, url):
        """Basic directory traversal test"""
        try:
            test_payloads = ['../../../etc/passwd', '..\\..\\..\\windows\\system32\\config\\sam']
            
            for payload in test_payloads:
                test_url = urljoin(url, payload)
                response = requests.get(test_url, timeout=10)
                
                if response.status_code == 200 and ('root:' in response.text or 'administrators' in response.text.lower()):
                    return {
                        'test_name': 'Directory Traversal',
                        'vulnerable': True,
                        'description': 'Potential directory traversal vulnerability detected',
                        'severity_score': 30
                    }
            
            return {
                'test_name': 'Directory Traversal',
                'vulnerable': False,
                'description': 'No directory traversal vulnerability detected',
                'severity_score': 0
            }
        except:
            return {
                'test_name': 'Directory Traversal',
                'vulnerable': False,
                'description': 'Test failed',
                'severity_score': 0
            }
    
    def test_sql_injection_basic(self, url):
        """Basic SQL injection test"""
        try:
            # Simple SQL injection test
            test_url = url + "?id=1'"
            response = requests.get(test_url, timeout=10)
            
            sql_errors = [
                'sql syntax', 'mysql_fetch', 'ora-01756', 'postgresql',
                'sqlite_', 'sql server', 'odbc', 'jdbc'
            ]
            
            response_text = response.text.lower()
            for error in sql_errors:
                if error in response_text:
                    return {
                        'test_name': 'SQL Injection',
                        'vulnerable': True,
                        'description': 'Potential SQL injection vulnerability detected',
                        'severity_score': 35
                    }
            
            return {
                'test_name': 'SQL Injection',
                'vulnerable': False,
                'description': 'No SQL injection vulnerability detected',
                'severity_score': 0
            }
        except:
            return {
                'test_name': 'SQL Injection',
                'vulnerable': False,
                'description': 'Test failed',
                'severity_score': 0
            }
    
    def test_xss_basic(self, url):
        """Basic XSS test"""
        try:
            xss_payload = '<script>alert("XSS")</script>'
            test_url = url + f"?q={xss_payload}"
            
            response = requests.get(test_url, timeout=10)
            
            if xss_payload in response.text:
                return {
                    'test_name': 'Cross-Site Scripting (XSS)',
                    'vulnerable': True,
                    'description': 'Potential XSS vulnerability detected',
                    'severity_score': 25
                }
            
            return {
                'test_name': 'Cross-Site Scripting (XSS)',
                'vulnerable': False,
                'description': 'No XSS vulnerability detected',
                'severity_score': 0
            }
        except:
            return {
                'test_name': 'Cross-Site Scripting (XSS)',
                'vulnerable': False,
                'description': 'Test failed',
                'severity_score': 0
            }
    
    def run_performance_audit(self, url=None):
        """Comprehensive performance audit"""
        target_url = url or self.config['target_website']
        
        self.logger.info(f"Starting performance audit for {target_url}")
        
        audit_results = {
            'timestamp': datetime.now().isoformat(),
            'url': target_url,
            'metrics': {},
            'lighthouse_score': None,
            'recommendations': []
        }
        
        # Basic performance metrics
        start_time = time.time()
        try:
            response = requests.get(target_url, timeout=30)
            response_time = (time.time() - start_time) * 1000
            
            audit_results['metrics'] = {
                'response_time': response_time,
                'page_size': len(response.content),
                'status_code': response.status_code,
                'headers': dict(response.headers)
            }
            
            # Check thresholds
            thresholds = self.config['performance_benchmarks']
            
            if response_time > thresholds['response_time_threshold']:
                audit_results['recommendations'].append(
                    f"Response time ({response_time:.2f}ms) exceeds threshold ({thresholds['response_time_threshold']}ms)"
                )
            
            if len(response.content) > thresholds['page_size_threshold']:
                audit_results['recommendations'].append(
                    f"Page size ({len(response.content)} bytes) exceeds threshold ({thresholds['page_size_threshold']} bytes)"
                )
            
        except Exception as e:
            audit_results['error'] = str(e)
            self.logger.error(f"Performance audit failed: {str(e)}")
        
        # Store results
        self.store_performance_audit(audit_results)
        
        self.logger.info(f"Performance audit completed for {target_url}")
        return audit_results
    
    def run_compatibility_audit(self, url=None):
        """Browser and device compatibility audit"""
        target_url = url or self.config['target_website']
        
        self.logger.info(f"Starting compatibility audit for {target_url}")
        
        audit_results = {
            'timestamp': datetime.now().isoformat(),
            'url': target_url,
            'results': [],
            'summary': {
                'total_tests': 0,
                'passed_tests': 0,
                'failed_tests': 0
            }
        }
        
        user_agents = self.config['compatibility_matrix']['user_agents']
        
        # Test with different user agents
        for user_agent in user_agents:
            try:
                start_time = time.time()
                headers = {'User-Agent': user_agent}
                response = requests.get(target_url, headers=headers, timeout=30)
                response_time = (time.time() - start_time) * 1000
                
                test_result = {
                    'user_agent': user_agent,
                    'success': response.status_code == 200,
                    'response_time': response_time,
                    'status_code': response.status_code,
                    'content_length': len(response.content)
                }
                
                audit_results['results'].append(test_result)
                audit_results['summary']['total_tests'] += 1
                
                if test_result['success']:
                    audit_results['summary']['passed_tests'] += 1
                else:
                    audit_results['summary']['failed_tests'] += 1
                
                # Store individual result
                self.store_compatibility_result(test_result)
                
            except Exception as e:
                test_result = {
                    'user_agent': user_agent,
                    'success': False,
                    'error': str(e)
                }
                audit_results['results'].append(test_result)
                audit_results['summary']['total_tests'] += 1
                audit_results['summary']['failed_tests'] += 1
        
        self.logger.info(f"Compatibility audit completed. {audit_results['summary']['passed_tests']}/{audit_results['summary']['total_tests']} tests passed")
        return audit_results
    
    def check_certificate_expiry(self, url=None):
        """Check SSL certificate expiry"""
        target_url = url or self.config['target_website']
        hostname = urlparse(target_url).hostname
        
        self.logger.info(f"Checking certificate expiry for {hostname}")
        
        try:
            context = ssl.create_default_context()
            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
            
            expiry_date = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
            days_until_expiry = (expiry_date - datetime.now()).days
            
            result = {
                'timestamp': datetime.now().isoformat(),
                'url': target_url,
                'certificate_subject': dict(x[0] for x in cert['subject']),
                'certificate_issuer': dict(x[0] for x in cert['issuer']),
                'expiry_date': expiry_date.isoformat(),
                'days_until_expiry': days_until_expiry,
                'status': 'valid' if days_until_expiry > 30 else 'expiring_soon' if days_until_expiry > 0 else 'expired'
            }
            
            # Store result
            self.store_certificate_audit(result)
            
            return result
            
        except Exception as e:
            self.logger.error(f"Certificate check failed: {str(e)}")
            return {'error': str(e)}
    
    def store_security_audit(self, audit_results):
        """Store security audit results"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO security_audits 
            (audit_type, url, result_data, score, issues_found, 
             critical_issues, warnings, passed_checks, total_checks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'comprehensive',
            audit_results['url'],
            json.dumps(audit_results),
            audit_results['score'],
            len(audit_results['issues']),
            len([i for i in audit_results['issues'] if 'critical' in i.lower()]),
            len([i for i in audit_results['issues'] if 'warning' in i.lower()]),
            len([t for t in audit_results['tests'].values() if t.get('score', 0) > 80]),
            len(audit_results['tests'])
        ))
        
        conn.commit()
        conn.close()
    
    def store_performance_audit(self, audit_results):
        """Store performance audit results"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        metrics = audit_results.get('metrics', {})
        
        cursor.execute('''
            INSERT INTO performance_audits 
            (url, response_time, page_size, resource_count, lighthouse_score, result_data)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            audit_results['url'],
            metrics.get('response_time'),
            metrics.get('page_size'),
            metrics.get('resource_count', 0),
            audit_results.get('lighthouse_score'),
            json.dumps(audit_results)
        ))
        
        conn.commit()
        conn.close()
    
    def store_compatibility_result(self, result):
        """Store compatibility test result"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO compatibility_audits 
            (url, user_agent, success, response_time, error_message)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            self.config['target_website'],
            result['user_agent'],
            result['success'],
            result.get('response_time'),
            result.get('error')
        ))
        
        conn.commit()
        conn.close()
    
    def store_certificate_audit(self, result):
        """Store certificate audit result"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO certificate_audits 
            (url, certificate_subject, certificate_issuer, expiry_date, days_until_expiry)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            result['url'],
            json.dumps(result['certificate_subject']),
            json.dumps(result['certificate_issuer']),
            result['expiry_date'],
            result['days_until_expiry']
        ))
        
        conn.commit()
        conn.close()
    
    def schedule_audits(self):
        """Schedule automated audits"""
        schedule_config = self.config['audit_schedule']
        
        # Schedule security scans
        if schedule_config['security_scan'] == 'daily':
            schedule.every().day.at("02:00").do(self.run_security_audit)
        elif schedule_config['security_scan'] == 'weekly':
            schedule.every().monday.at("02:00").do(self.run_security_audit)
        
        # Schedule performance tests
        if schedule_config['performance_test'] == 'hourly':
            schedule.every().hour.do(self.run_performance_audit)
        elif schedule_config['performance_test'] == 'daily':
            schedule.every().day.at("01:00").do(self.run_performance_audit)
        
        # Schedule compatibility tests
        if schedule_config['compatibility_test'] == 'weekly':
            schedule.every().sunday.at("03:00").do(self.run_compatibility_audit)
        
        # Schedule certificate checks
        if schedule_config['certificate_check'] == 'daily':
            schedule.every().day.at("00:30").do(self.check_certificate_expiry)
        
        self.logger.info("Automated audit schedules configured")
    
    def start_scheduler(self):
        """Start the audit scheduler"""
        self.schedule_audits()
        self.logger.info("Starting automated audit scheduler...")
        
        while True:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except KeyboardInterrupt:
                self.logger.info("Audit scheduler stopped")
                break
            except Exception as e:
                self.logger.error(f"Scheduler error: {str(e)}")
                time.sleep(300)  # Wait 5 minutes before retrying

def main():
    """Main function for automated audits"""
    auditor = AutomatedAuditor()
    
    import sys
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == 'security':
            result = auditor.run_security_audit()
            print(json.dumps(result, indent=2, default=str))
            
        elif command == 'performance':
            result = auditor.run_performance_audit()
            print(json.dumps(result, indent=2, default=str))
            
        elif command == 'compatibility':
            result = auditor.run_compatibility_audit()
            print(json.dumps(result, indent=2, default=str))
            
        elif command == 'certificate':
            result = auditor.check_certificate_expiry()
            print(json.dumps(result, indent=2, default=str))
            
        elif command == 'all':
            print("Running all audits...")
            security_result = auditor.run_security_audit()
            performance_result = auditor.run_performance_audit()
            compatibility_result = auditor.run_compatibility_audit()
            certificate_result = auditor.check_certificate_expiry()
            
            print("Security Audit:", json.dumps(security_result, indent=2, default=str))
            print("Performance Audit:", json.dumps(performance_result, indent=2, default=str))
            print("Compatibility Audit:", json.dumps(compatibility_result, indent=2, default=str))
            print("Certificate Check:", json.dumps(certificate_result, indent=2, default=str))
            
        elif command == 'schedule':
            auditor.start_scheduler()
        else:
            print("Usage: python automated_audits.py [security|performance|compatibility|certificate|all|schedule]")
    else:
        # Interactive mode
        print("Available commands:")
        print("1. security - Run security audit")
        print("2. performance - Run performance audit")
        print("3. compatibility - Run compatibility audit")
        print("4. certificate - Check certificate expiry")
        print("5. all - Run all audits")
        print("6. schedule - Start automated scheduler")

if __name__ == "__main__":
    main()