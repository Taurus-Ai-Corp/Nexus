#!/usr/bin/env python3
"""
Comprehensive Website Monitoring System
Multi-geographic uptime and performance monitoring
"""

import requests
import time
import json
import ssl
import socket
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
import logging
import threading
import sqlite3
import os
from concurrent.futures import ThreadPoolExecutor
import statistics

class WebsiteMonitor:
    def __init__(self, config_file='monitoring_config.json'):
        self.config = self.load_config(config_file)
        self.setup_database()
        self.setup_logging()
        
    def load_config(self, config_file):
        """Load monitoring configuration"""
        default_config = {
            "website_url": "https://vc1j5apvcf.space.minimax.io/features",
            "check_interval": 300,  # 5 minutes
            "timeout": 30,
            "alert_thresholds": {
                "response_time": 5000,  # 5 seconds
                "uptime_percentage": 99.0,
                "consecutive_failures": 3
            },
            "monitoring_locations": [
                {"name": "Primary", "enabled": True},
                {"name": "US-East", "proxy": None},
                {"name": "EU-West", "proxy": None},
                {"name": "Asia-Pacific", "proxy": None}
            ],
            "notifications": {
                "email": {
                    "enabled": True,
                    "smtp_server": "smtp.gmail.com",
                    "smtp_port": 587,
                    "sender_email": "monitoring@example.com",
                    "sender_password": "your_app_password",
                    "recipients": ["admin@example.com", "devops@example.com"]
                },
                "webhook": {
                    "enabled": False,
                    "url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
                }
            },
            "ssl_check": {
                "enabled": True,
                "days_before_expiry_alert": 30
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
            # Create default config file
            with open(config_file, 'w') as f:
                json.dump(default_config, f, indent=2)
            return default_config
    
    def setup_database(self):
        """Initialize monitoring database"""
        self.db_path = 'monitoring_data.db'
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create monitoring results table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS monitoring_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                location TEXT,
                url TEXT,
                status_code INTEGER,
                response_time REAL,
                success BOOLEAN,
                error_message TEXT,
                ssl_expiry_days INTEGER,
                content_length INTEGER
            )
        ''')
        
        # Create alerts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                alert_type TEXT,
                severity TEXT,
                message TEXT,
                resolved BOOLEAN DEFAULT FALSE,
                resolved_timestamp DATETIME
            )
        ''')
        
        # Create uptime summary table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS uptime_summary (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE,
                total_checks INTEGER,
                successful_checks INTEGER,
                uptime_percentage REAL,
                avg_response_time REAL,
                max_response_time REAL,
                min_response_time REAL
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
                logging.FileHandler('website_monitoring.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def check_website_health(self, location="Primary"):
        """Perform comprehensive website health check"""
        url = self.config['website_url']
        timeout = self.config['timeout']
        
        result = {
            'timestamp': datetime.now(),
            'location': location,
            'url': url,
            'success': False,
            'status_code': None,
            'response_time': None,
            'error_message': None,
            'ssl_expiry_days': None,
            'content_length': None
        }
        
        try:
            # HTTP health check
            start_time = time.time()
            response = requests.get(url, timeout=timeout, verify=True)
            end_time = time.time()
            
            result['success'] = True
            result['status_code'] = response.status_code
            result['response_time'] = (end_time - start_time) * 1000  # milliseconds
            result['content_length'] = len(response.content)
            
            # SSL certificate check
            if self.config['ssl_check']['enabled']:
                result['ssl_expiry_days'] = self.check_ssl_expiry(url)
            
            self.logger.info(f"Health check successful - {location}: {result['response_time']:.2f}ms")
            
        except requests.exceptions.Timeout:
            result['error_message'] = "Request timeout"
            self.logger.warning(f"Health check timeout - {location}: {url}")
            
        except requests.exceptions.ConnectionError:
            result['error_message'] = "Connection error"
            self.logger.error(f"Health check connection error - {location}: {url}")
            
        except requests.exceptions.SSLError:
            result['error_message'] = "SSL certificate error"
            self.logger.error(f"Health check SSL error - {location}: {url}")
            
        except Exception as e:
            result['error_message'] = str(e)
            self.logger.error(f"Health check unexpected error - {location}: {str(e)}")
        
        return result
    
    def check_ssl_expiry(self, url):
        """Check SSL certificate expiration"""
        try:
            hostname = url.replace('https://', '').replace('http://', '').split('/')[0]
            context = ssl.create_default_context()
            
            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    
            # Parse expiry date
            expiry_date = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
            days_until_expiry = (expiry_date - datetime.now()).days
            
            return days_until_expiry
            
        except Exception as e:
            self.logger.error(f"SSL check error: {str(e)}")
            return None
    
    def store_result(self, result):
        """Store monitoring result in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO monitoring_results 
            (timestamp, location, url, status_code, response_time, success, 
             error_message, ssl_expiry_days, content_length)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            result['timestamp'],
            result['location'],
            result['url'],
            result['status_code'],
            result['response_time'],
            result['success'],
            result['error_message'],
            result['ssl_expiry_days'],
            result['content_length']
        ))
        
        conn.commit()
        conn.close()
    
    def check_alert_conditions(self, result):
        """Check if result triggers any alerts"""
        alerts = []
        thresholds = self.config['alert_thresholds']
        
        # Response time alert
        if result['response_time'] and result['response_time'] > thresholds['response_time']:
            alerts.append({
                'type': 'slow_response',
                'severity': 'warning',
                'message': f"Slow response time: {result['response_time']:.2f}ms from {result['location']}"
            })
        
        # Failure alert
        if not result['success']:
            alerts.append({
                'type': 'service_down',
                'severity': 'critical',
                'message': f"Service down from {result['location']}: {result['error_message']}"
            })
        
        # SSL expiry alert
        if result['ssl_expiry_days'] is not None:
            if result['ssl_expiry_days'] <= self.config['ssl_check']['days_before_expiry_alert']:
                alerts.append({
                    'type': 'ssl_expiry',
                    'severity': 'warning' if result['ssl_expiry_days'] > 7 else 'critical',
                    'message': f"SSL certificate expires in {result['ssl_expiry_days']} days"
                })
        
        return alerts
    
    def send_alert(self, alert):
        """Send alert notification"""
        self.store_alert(alert)
        
        # Email notification
        if self.config['notifications']['email']['enabled']:
            self.send_email_alert(alert)
        
        # Webhook notification (Slack, etc.)
        if self.config['notifications']['webhook']['enabled']:
            self.send_webhook_alert(alert)
    
    def store_alert(self, alert):
        """Store alert in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO alerts (alert_type, severity, message)
            VALUES (?, ?, ?)
        ''', (alert['type'], alert['severity'], alert['message']))
        
        conn.commit()
        conn.close()
    
    def send_email_alert(self, alert):
        """Send email alert"""
        try:
            email_config = self.config['notifications']['email']
            
            msg = MimeMultipart()
            msg['From'] = email_config['sender_email']
            msg['To'] = ', '.join(email_config['recipients'])
            msg['Subject'] = f"Website Alert - {alert['severity'].upper()}: {alert['type']}"
            
            body = f"""
Website Monitoring Alert

Severity: {alert['severity'].upper()}
Type: {alert['type']}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Website: {self.config['website_url']}

Message: {alert['message']}

Please investigate and resolve the issue.

Best regards,
Website Monitoring System
            """
            
            msg.attach(MimeText(body, 'plain'))
            
            server = smtplib.SMTP(email_config['smtp_server'], email_config['smtp_port'])
            server.starttls()
            server.login(email_config['sender_email'], email_config['sender_password'])
            server.send_message(msg)
            server.quit()
            
            self.logger.info(f"Email alert sent: {alert['type']}")
            
        except Exception as e:
            self.logger.error(f"Failed to send email alert: {str(e)}")
    
    def send_webhook_alert(self, alert):
        """Send webhook alert (Slack, Discord, etc.)"""
        try:
            webhook_url = self.config['notifications']['webhook']['url']
            
            payload = {
                "text": f"🚨 Website Alert: {alert['severity'].upper()}",
                "attachments": [
                    {
                        "color": "danger" if alert['severity'] == 'critical' else "warning",
                        "fields": [
                            {"title": "Type", "value": alert['type'], "short": True},
                            {"title": "Severity", "value": alert['severity'], "short": True},
                            {"title": "Website", "value": self.config['website_url'], "short": False},
                            {"title": "Message", "value": alert['message'], "short": False}
                        ],
                        "footer": "Website Monitoring System",
                        "ts": int(time.time())
                    }
                ]
            }
            
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            
            self.logger.info(f"Webhook alert sent: {alert['type']}")
            
        except Exception as e:
            self.logger.error(f"Failed to send webhook alert: {str(e)}")
    
    def run_monitoring_cycle(self):
        """Run one complete monitoring cycle"""
        locations = [loc for loc in self.config['monitoring_locations'] if loc.get('enabled', True)]
        
        # Multi-location monitoring
        with ThreadPoolExecutor(max_workers=len(locations)) as executor:
            future_to_location = {
                executor.submit(self.check_website_health, loc['name']): loc['name'] 
                for loc in locations
            }
            
            for future in future_to_location:
                result = future.result()
                self.store_result(result)
                
                # Check for alerts
                alerts = self.check_alert_conditions(result)
                for alert in alerts:
                    self.send_alert(alert)
    
    def generate_daily_summary(self):
        """Generate daily uptime summary"""
        today = datetime.now().date()
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get today's results
        cursor.execute('''
            SELECT success, response_time FROM monitoring_results
            WHERE DATE(timestamp) = ?
        ''', (today,))
        
        results = cursor.fetchall()
        
        if results:
            total_checks = len(results)
            successful_checks = sum(1 for result in results if result[0])
            uptime_percentage = (successful_checks / total_checks) * 100
            
            response_times = [r[1] for r in results if r[1] is not None]
            avg_response_time = statistics.mean(response_times) if response_times else 0
            max_response_time = max(response_times) if response_times else 0
            min_response_time = min(response_times) if response_times else 0
            
            # Store summary
            cursor.execute('''
                INSERT OR REPLACE INTO uptime_summary
                (date, total_checks, successful_checks, uptime_percentage,
                 avg_response_time, max_response_time, min_response_time)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (today, total_checks, successful_checks, uptime_percentage,
                  avg_response_time, max_response_time, min_response_time))
            
            conn.commit()
        
        conn.close()
    
    def get_monitoring_status(self):
        """Get current monitoring status"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get latest results
        cursor.execute('''
            SELECT location, timestamp, success, response_time, error_message
            FROM monitoring_results
            WHERE timestamp > datetime('now', '-1 hour')
            ORDER BY timestamp DESC
        ''')
        
        recent_results = cursor.fetchall()
        
        # Get uptime statistics
        cursor.execute('''
            SELECT AVG(uptime_percentage), AVG(avg_response_time)
            FROM uptime_summary
            WHERE date > date('now', '-7 days')
        ''')
        
        stats = cursor.fetchone()
        
        conn.close()
        
        return {
            'recent_results': recent_results,
            'weekly_uptime': stats[0] if stats[0] else 0,
            'weekly_avg_response': stats[1] if stats[1] else 0
        }
    
    def start_monitoring(self):
        """Start continuous monitoring"""
        self.logger.info("Starting website monitoring...")
        
        while True:
            try:
                self.run_monitoring_cycle()
                self.generate_daily_summary()
                
                # Sleep until next check
                time.sleep(self.config['check_interval'])
                
            except KeyboardInterrupt:
                self.logger.info("Monitoring stopped by user")
                break
            except Exception as e:
                self.logger.error(f"Monitoring error: {str(e)}")
                time.sleep(60)  # Wait 1 minute before retrying

def main():
    """Main monitoring function"""
    monitor = WebsiteMonitor()
    
    # Check if running as daemon or single check
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'check':
        # Single check mode
        print("Running single health check...")
        result = monitor.check_website_health()
        print(json.dumps({
            'timestamp': result['timestamp'].isoformat(),
            'success': result['success'],
            'response_time': result['response_time'],
            'status_code': result['status_code'],
            'error_message': result['error_message']
        }, indent=2))
    elif len(sys.argv) > 1 and sys.argv[1] == 'status':
        # Status check mode
        status = monitor.get_monitoring_status()
        print("Current Monitoring Status:")
        print(json.dumps(status, indent=2, default=str))
    else:
        # Continuous monitoring mode
        monitor.start_monitoring()

if __name__ == "__main__":
    main()