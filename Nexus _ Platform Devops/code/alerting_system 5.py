#!/usr/bin/env python3
"""
Communication and Alerting System
Multi-channel notifications with escalation procedures
"""

import json
import logging
import smtplib
import sqlite3
import threading
import time
from datetime import datetime, timedelta
from email.mime.multipart import MimeMultipart
from email.mime.text import MimeText

import requests
from jinja2 import Template


class AlertingSystem:
    def __init__(self, config_file='alerting_config.json'):
        self.config = self.load_config(config_file)
        self.setup_database()
        self.setup_logging()
        self.load_templates()

    def load_config(self, config_file):
        """Load alerting configuration"""
        default_config = {
            "website_url": "https://vc1j5apvcf.space.minimax.io/features",
            "channels": {
                "email": {
                    "enabled": True,
                    "smtp_server": "smtp.gmail.com",
                    "smtp_port": 587,
                    "sender_email": "alerts@example.com",
                    "sender_password": "your-app-password",
                    "use_tls": True
                },
                "slack": {
                    "enabled": False,
                    "webhook_url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
                    "channel": "#alerts",
                    "username": "Website Monitor"
                },
                "discord": {
                    "enabled": False,
                    "webhook_url": "https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK"
                },
                "teams": {
                    "enabled": False,
                    "webhook_url": "https://outlook.office.com/webhook/YOUR/TEAMS/WEBHOOK"
                },
                "sms": {
                    "enabled": False,
                    "provider": "twilio",
                    "account_sid": "your_account_sid",
                    "auth_token": "your_auth_token",
                    "from_number": "+1234567890"
                },
                "pagerduty": {
                    "enabled": False,
                    "integration_key": "your_integration_key",
                    "api_url": "https://events.pagerduty.com/v2/enqueue"
                }
            },
            "stakeholders": {
                "technical_team": {
                    "name": "Technical Team",
                    "email": ["devops@example.com", "sysadmin@example.com"],
                    "slack_users": ["@devops", "@sysadmin"],
                    "phone": ["+1234567891", "+1234567892"],
                    "severity_levels": ["low", "medium", "high", "critical"],
                    "escalation_time": 30  # minutes
                },
                "management": {
                    "name": "Management",
                    "email": ["cto@example.com", "manager@example.com"],
                    "slack_users": ["@cto", "@manager"],
                    "phone": ["+1234567893"],
                    "severity_levels": ["high", "critical"],
                    "escalation_time": 60
                },
                "business_team": {
                    "name": "Business Team",
                    "email": ["support@example.com", "sales@example.com"],
                    "slack_users": ["@support"],
                    "phone": [],
                    "severity_levels": ["medium", "high", "critical"],
                    "escalation_time": 120
                }
            },
            "alert_types": {
                "website_down": {
                    "severity": "critical",
                    "escalation_enabled": True,
                    "auto_resolve": False,
                    "notification_channels": ["email", "slack", "sms"]
                },
                "slow_response": {
                    "severity": "medium",
                    "escalation_enabled": True,
                    "auto_resolve": True,
                    "notification_channels": ["email", "slack"]
                },
                "ssl_expiry": {
                    "severity": "high",
                    "escalation_enabled": True,
                    "auto_resolve": False,
                    "notification_channels": ["email", "slack"]
                },
                "security_issue": {
                    "severity": "critical",
                    "escalation_enabled": True,
                    "auto_resolve": False,
                    "notification_channels": ["email", "slack", "sms", "pagerduty"]
                },
                "performance_degradation": {
                    "severity": "medium",
                    "escalation_enabled": False,
                    "auto_resolve": True,
                    "notification_channels": ["email", "slack"]
                }
            },
            "escalation_rules": {
                "max_escalation_levels": 3,
                "escalation_intervals": [30, 60, 120],  # minutes
                "business_hours": {
                    "start": "09:00",
                    "end": "17:00",
                    "timezone": "UTC",
                    "weekdays_only": True
                }
            },
            "rate_limiting": {
                "max_alerts_per_hour": 10,
                "max_escalations_per_day": 5,
                "cooldown_period": 300  # seconds
            }
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
        """Initialize alerting database"""
        self.db_path = 'alerting.db'
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Alerts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                alert_id TEXT UNIQUE,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                alert_type TEXT,
                severity TEXT,
                title TEXT,
                message TEXT,
                source_data TEXT,
                status TEXT DEFAULT 'active',
                resolved_timestamp DATETIME,
                acknowledged_by TEXT,
                acknowledged_timestamp DATETIME
            )
        ''')

        # Notifications sent
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                alert_id TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                channel TEXT,
                recipient TEXT,
                status TEXT,
                response_data TEXT,
                FOREIGN KEY (alert_id) REFERENCES alerts (alert_id)
            )
        ''')

        # Escalations
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS escalations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                alert_id TEXT,
                escalation_level INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                stakeholder_group TEXT,
                status TEXT,
                FOREIGN KEY (alert_id) REFERENCES alerts (alert_id)
            )
        ''')

        # Rate limiting tracking
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS rate_limiting (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                alert_type TEXT,
                channel TEXT,
                recipient TEXT
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
                logging.FileHandler('alerting_system.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def load_templates(self):
        """Load notification templates"""
        self.templates = {
            'email': {
                'website_down': Template('''
Subject: 🚨 CRITICAL: Website Down - {{ title }}

{{ stakeholder_name }},

URGENT ALERT: The website is currently down and inaccessible.

Alert Details:
- Alert ID: {{ alert_id }}
- Severity: {{ severity|upper }}
- Time: {{ timestamp }}
- Website: {{ website_url }}

Issue Description:
{{ message }}

Immediate Action Required:
1. Investigate server status and connectivity
2. Check hosting provider status
3. Verify DNS resolution
4. Review recent deployments or changes

This alert will escalate every {{ escalation_interval }} minutes until resolved.

Technical Team: Please acknowledge this alert and provide status updates.

---
Website Monitoring System
                '''),

                'slow_response': Template('''
Subject: ⚠️ Performance Alert: Slow Response Times - {{ title }}

{{ stakeholder_name }},

Performance degradation detected on the website.

Alert Details:
- Alert ID: {{ alert_id }}
- Severity: {{ severity|upper }}
- Time: {{ timestamp }}
- Website: {{ website_url }}

Performance Metrics:
{{ message }}

Recommended Actions:
1. Check server load and resources
2. Review CDN performance
3. Analyze database performance
4. Monitor network connectivity

This issue may impact user experience and should be investigated promptly.

---
Website Monitoring System
                '''),

                'ssl_expiry': Template('''
Subject: 🔒 SSL Certificate Expiry Warning - {{ title }}

{{ stakeholder_name }},

SSL certificate expiration alert for {{ website_url }}.

Alert Details:
- Alert ID: {{ alert_id }}
- Severity: {{ severity|upper }}
- Time: {{ timestamp }}
- Website: {{ website_url }}

Certificate Information:
{{ message }}

Required Actions:
1. Renew SSL certificate before expiration
2. Update certificate on all servers
3. Verify certificate chain and configuration
4. Test SSL configuration after renewal

Failure to renew will result in browser security warnings and user access issues.

---
Website Monitoring System
                '''),

                'security_issue': Template('''
Subject: 🛡️ SECURITY ALERT: Vulnerability Detected - {{ title }}

{{ stakeholder_name }},

SECURITY VULNERABILITY DETECTED - Immediate attention required.

Alert Details:
- Alert ID: {{ alert_id }}
- Severity: {{ severity|upper }}
- Time: {{ timestamp }}
- Website: {{ website_url }}

Security Issue:
{{ message }}

IMMEDIATE ACTIONS REQUIRED:
1. Assess the security vulnerability
2. Implement temporary mitigations if possible
3. Deploy security patches or fixes
4. Review security logs for potential exploitation
5. Consider taking affected systems offline if critical

This is a high-priority security alert. Please respond immediately.

---
Website Monitoring System
                ''')
            },

            'slack': {
                'website_down': Template('''
🚨 *CRITICAL ALERT: Website Down*

*Website:* {{ website_url }}
*Alert ID:* {{ alert_id }}
*Time:* {{ timestamp }}
*Severity:* {{ severity|upper }}

*Issue:* {{ message }}

*Immediate Actions Needed:*
• Check server status
• Verify hosting provider
• Review DNS resolution
• Check recent changes

{{ mention_users }}
                '''),

                'slow_response': Template('''
⚠️ *Performance Alert: Slow Response*

*Website:* {{ website_url }}
*Alert ID:* {{ alert_id }}
*Time:* {{ timestamp }}
*Severity:* {{ severity|upper }}

*Performance Issue:* {{ message }}

*Actions:*
• Check server resources
• Review CDN performance
• Monitor database
• Analyze network

{{ mention_users }}
                '''),

                'ssl_expiry': Template('''
🔒 *SSL Certificate Expiry Warning*

*Website:* {{ website_url }}
*Alert ID:* {{ alert_id }}
*Time:* {{ timestamp }}
*Severity:* {{ severity|upper }}

*Certificate Status:* {{ message }}

*Actions Required:*
• Renew SSL certificate
• Update server configuration
• Test SSL setup

{{ mention_users }}
                '''),

                'security_issue': Template('''
🛡️ *SECURITY ALERT: Vulnerability Detected*

*Website:* {{ website_url }}
*Alert ID:* {{ alert_id }}
*Time:* {{ timestamp }}
*Severity:* {{ severity|upper }}

*Security Issue:* {{ message }}

*IMMEDIATE ACTIONS:*
• Assess vulnerability
• Implement mitigations
• Deploy security fixes
• Review security logs

{{ mention_users }}
                ''')
            }
        }

    def generate_alert_id(self):
        """Generate unique alert ID"""
        import uuid
        return f"ALT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

    def create_alert(self, alert_type, title, message, source_data=None):
        """Create new alert"""
        alert_id = self.generate_alert_id()

        # Get alert configuration
        alert_config = self.config['alert_types'].get(alert_type, {})
        severity = alert_config.get('severity', 'medium')

        # Store alert in database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO alerts (alert_id, alert_type, severity, title, message, source_data)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (alert_id, alert_type, severity, title, message, json.dumps(source_data or {})))

        conn.commit()
        conn.close()

        self.logger.info(f"Alert created: {alert_id} - {alert_type} - {severity}")

        # Send notifications
        self.send_notifications(alert_id, alert_type, severity, title, message)

        # Start escalation if enabled
        if alert_config.get('escalation_enabled', False):
            self.start_escalation(alert_id, alert_type, severity)

        return alert_id

    def send_notifications(self, alert_id, alert_type, severity, title, message):
        """Send notifications through configured channels"""
        alert_config = self.config['alert_types'].get(alert_type, {})
        channels = alert_config.get('notification_channels', ['email'])

        # Get relevant stakeholders
        stakeholders = self.get_stakeholders_for_severity(severity)

        for channel in channels:
            if self.config['channels'][channel].get('enabled', False):
                for stakeholder_group, stakeholder_data in stakeholders.items():
                    try:
                        if channel == 'email':
                            self.send_email_notification(alert_id, alert_type, severity, title, message, stakeholder_group, stakeholder_data)
                        elif channel == 'slack':
                            self.send_slack_notification(alert_id, alert_type, severity, title, message, stakeholder_data)
                        elif channel == 'sms':
                            self.send_sms_notification(alert_id, alert_type, severity, title, message, stakeholder_data)
                        elif channel == 'pagerduty':
                            self.send_pagerduty_notification(alert_id, alert_type, severity, title, message)

                    except Exception as e:
                        self.logger.error(f"Failed to send {channel} notification: {str(e)}")

    def get_stakeholders_for_severity(self, severity):
        """Get stakeholders that should be notified for given severity"""
        relevant_stakeholders = {}

        for group_name, group_data in self.config['stakeholders'].items():
            if severity in group_data.get('severity_levels', []):
                relevant_stakeholders[group_name] = group_data

        return relevant_stakeholders

    def send_email_notification(self, alert_id, alert_type, severity, title, message, stakeholder_group, stakeholder_data):
        """Send email notification"""
        if not self.config['channels']['email']['enabled']:
            return

        template = self.templates['email'].get(alert_type)
        if not template:
            template = self.templates['email']['website_down']  # Fallback template

        # Render email content
        email_content = template.render(
            alert_id=alert_id,
            title=title,
            message=message,
            severity=severity,
            timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC'),
            website_url=self.config['website_url'],
            stakeholder_name=stakeholder_data['name'],
            escalation_interval=stakeholder_data.get('escalation_time', 30)
        )

        # Extract subject from email content
        subject_line = email_content.split('\n')[0].replace('Subject: ', '')
        email_body = '\n'.join(email_content.split('\n')[2:])  # Skip subject line and empty line

        # Send to all email addresses in stakeholder group
        for email_address in stakeholder_data.get('email', []):
            try:
                msg = MimeMultipart()
                msg['From'] = self.config['channels']['email']['sender_email']
                msg['To'] = email_address
                msg['Subject'] = subject_line

                msg.attach(MimeText(email_body, 'plain'))

                # Send email
                server = smtplib.SMTP(
                    self.config['channels']['email']['smtp_server'],
                    self.config['channels']['email']['smtp_port']
                )

                if self.config['channels']['email'].get('use_tls', True):
                    server.starttls()

                server.login(
                    self.config['channels']['email']['sender_email'],
                    self.config['channels']['email']['sender_password']
                )

                server.send_message(msg)
                server.quit()

                # Log notification
                self.log_notification(alert_id, 'email', email_address, 'sent')
                self.logger.info(f"Email sent to {email_address} for alert {alert_id}")

            except Exception as e:
                self.log_notification(alert_id, 'email', email_address, 'failed', str(e))
                self.logger.error(f"Failed to send email to {email_address}: {str(e)}")

    def send_slack_notification(self, alert_id, alert_type, severity, title, message, stakeholder_data):
        """Send Slack notification"""
        if not self.config['channels']['slack']['enabled']:
            return

        template = self.templates['slack'].get(alert_type)
        if not template:
            template = self.templates['slack']['website_down']

        # Create mention string for Slack users
        slack_users = stakeholder_data.get('slack_users', [])
        mention_users = ' '.join(slack_users) if slack_users else ''

        # Render Slack content
        slack_content = template.render(
            alert_id=alert_id,
            title=title,
            message=message,
            severity=severity,
            timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC'),
            website_url=self.config['website_url'],
            mention_users=mention_users
        )

        # Prepare Slack payload
        payload = {
            "channel": self.config['channels']['slack']['channel'],
            "username": self.config['channels']['slack']['username'],
            "text": slack_content,
            "icon_emoji": ":warning:" if severity == "medium" else ":rotating_light:"
        }

        try:
            response = requests.post(
                self.config['channels']['slack']['webhook_url'],
                json=payload,
                timeout=30
            )

            if response.status_code == 200:
                self.log_notification(alert_id, 'slack', self.config['channels']['slack']['channel'], 'sent')
                self.logger.info(f"Slack notification sent for alert {alert_id}")
            else:
                self.log_notification(alert_id, 'slack', self.config['channels']['slack']['channel'], 'failed', f"HTTP {response.status_code}")

        except Exception as e:
            self.log_notification(alert_id, 'slack', self.config['channels']['slack']['channel'], 'failed', str(e))
            self.logger.error(f"Failed to send Slack notification: {str(e)}")

    def send_sms_notification(self, alert_id, alert_type, severity, title, message, stakeholder_data):
        """Send SMS notification (Twilio implementation)"""
        if not self.config['channels']['sms']['enabled']:
            return

        # Only send SMS for high/critical severity
        if severity not in ['high', 'critical']:
            return

        # Simple SMS message
        sms_message = f"ALERT [{severity.upper()}]: {title}\n{message[:100]}...\nAlert ID: {alert_id}"

        phone_numbers = stakeholder_data.get('phone', [])

        for phone_number in phone_numbers:
            try:
                # Twilio API call (would need twilio library)
                # This is a placeholder implementation
                sms_payload = {
                    'From': self.config['channels']['sms']['from_number'],
                    'To': phone_number,
                    'Body': sms_message
                }

                # In real implementation, use Twilio client
                self.logger.info(f"SMS would be sent to {phone_number} for alert {alert_id}")
                self.log_notification(alert_id, 'sms', phone_number, 'sent')

            except Exception as e:
                self.log_notification(alert_id, 'sms', phone_number, 'failed', str(e))
                self.logger.error(f"Failed to send SMS to {phone_number}: {str(e)}")

    def send_pagerduty_notification(self, alert_id, alert_type, severity, title, message):
        """Send PagerDuty notification"""
        if not self.config['channels']['pagerduty']['enabled']:
            return

        payload = {
            "routing_key": self.config['channels']['pagerduty']['integration_key'],
            "event_action": "trigger",
            "dedup_key": alert_id,
            "payload": {
                "summary": f"{severity.upper()}: {title}",
                "source": self.config['website_url'],
                "severity": severity,
                "component": "website",
                "group": "monitoring",
                "class": alert_type,
                "custom_details": {
                    "alert_id": alert_id,
                    "message": message,
                    "website_url": self.config['website_url']
                }
            }
        }

        try:
            response = requests.post(
                self.config['channels']['pagerduty']['api_url'],
                json=payload,
                timeout=30
            )

            if response.status_code == 202:
                self.log_notification(alert_id, 'pagerduty', 'incident', 'sent')
                self.logger.info(f"PagerDuty notification sent for alert {alert_id}")
            else:
                self.log_notification(alert_id, 'pagerduty', 'incident', 'failed', f"HTTP {response.status_code}")

        except Exception as e:
            self.log_notification(alert_id, 'pagerduty', 'incident', 'failed', str(e))
            self.logger.error(f"Failed to send PagerDuty notification: {str(e)}")

    def log_notification(self, alert_id, channel, recipient, status, response_data=None):
        """Log notification attempt"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO notifications (alert_id, channel, recipient, status, response_data)
            VALUES (?, ?, ?, ?, ?)
        ''', (alert_id, channel, recipient, status, response_data))

        conn.commit()
        conn.close()

    def start_escalation(self, alert_id, alert_type, severity):
        """Start escalation process for alert"""
        def escalate():
            escalation_intervals = self.config['escalation_rules']['escalation_intervals']
            max_levels = self.config['escalation_rules']['max_escalation_levels']

            for level in range(1, max_levels + 1):
                # Wait for escalation interval
                if level <= len(escalation_intervals):
                    wait_time = escalation_intervals[level - 1] * 60  # Convert to seconds
                else:
                    wait_time = escalation_intervals[-1] * 60

                time.sleep(wait_time)

                # Check if alert is still active
                if not self.is_alert_active(alert_id):
                    self.logger.info(f"Alert {alert_id} resolved, stopping escalation")
                    break

                # Check if alert was acknowledged
                if self.is_alert_acknowledged(alert_id):
                    self.logger.info(f"Alert {alert_id} acknowledged, stopping escalation")
                    break

                # Escalate to next level
                self.escalate_alert(alert_id, level, alert_type, severity)

        # Start escalation in background thread
        escalation_thread = threading.Thread(target=escalate)
        escalation_thread.daemon = True
        escalation_thread.start()

    def escalate_alert(self, alert_id, escalation_level, alert_type, severity):
        """Escalate alert to higher level stakeholders"""
        self.logger.warning(f"Escalating alert {alert_id} to level {escalation_level}")

        # Log escalation
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO escalations (alert_id, escalation_level, stakeholder_group, status)
            VALUES (?, ?, ?, ?)
        ''', (alert_id, escalation_level, 'management', 'active'))

        conn.commit()
        conn.close()

        # Send escalation notifications (typically to management)
        management_stakeholders = {'management': self.config['stakeholders']['management']}

        # Get original alert details
        alert_details = self.get_alert_details(alert_id)
        if alert_details:
            escalation_message = f"ESCALATION LEVEL {escalation_level}: {alert_details['message']}\n\nThis alert has not been acknowledged or resolved within the expected timeframe."

            self.send_notifications(
                alert_id,
                alert_type,
                'critical',  # Escalated alerts are always critical
                f"ESCALATED: {alert_details['title']}",
                escalation_message
            )

    def is_alert_active(self, alert_id):
        """Check if alert is still active"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('SELECT status FROM alerts WHERE alert_id = ?', (alert_id,))
        result = cursor.fetchone()

        conn.close()
        return result and result[0] == 'active'

    def is_alert_acknowledged(self, alert_id):
        """Check if alert was acknowledged"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('SELECT acknowledged_by FROM alerts WHERE alert_id = ?', (alert_id,))
        result = cursor.fetchone()

        conn.close()
        return result and result[0] is not None

    def get_alert_details(self, alert_id):
        """Get alert details from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM alerts WHERE alert_id = ?', (alert_id,))
        result = cursor.fetchone()

        if result:
            columns = [description[0] for description in cursor.description]
            alert_details = dict(zip(columns, result, strict=False))
            conn.close()
            return alert_details

        conn.close()
        return None

    def acknowledge_alert(self, alert_id, acknowledged_by):
        """Acknowledge an alert"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            UPDATE alerts 
            SET acknowledged_by = ?, acknowledged_timestamp = CURRENT_TIMESTAMP
            WHERE alert_id = ?
        ''', (acknowledged_by, alert_id))

        conn.commit()
        conn.close()

        self.logger.info(f"Alert {alert_id} acknowledged by {acknowledged_by}")

    def resolve_alert(self, alert_id, resolved_by=None):
        """Resolve an alert"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            UPDATE alerts 
            SET status = 'resolved', resolved_timestamp = CURRENT_TIMESTAMP
            WHERE alert_id = ?
        ''', (alert_id,))

        conn.commit()
        conn.close()

        self.logger.info(f"Alert {alert_id} resolved by {resolved_by or 'system'}")

    def get_active_alerts(self):
        """Get all active alerts"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT alert_id, alert_type, severity, title, timestamp 
            FROM alerts 
            WHERE status = 'active' 
            ORDER BY timestamp DESC
        ''')

        alerts = cursor.fetchall()
        columns = [description[0] for description in cursor.description]

        conn.close()
        return [dict(zip(columns, alert, strict=False)) for alert in alerts]

    def cleanup_old_alerts(self, days_old=30):
        """Clean up resolved alerts older than specified days"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cutoff_date = datetime.now() - timedelta(days=days_old)

        cursor.execute('''
            DELETE FROM alerts 
            WHERE status = 'resolved' AND resolved_timestamp < ?
        ''', (cutoff_date,))

        deleted_count = cursor.rowcount

        conn.commit()
        conn.close()

        self.logger.info(f"Cleaned up {deleted_count} old alerts")
        return deleted_count

def main():
    """Main function for alerting system"""
    alerting = AlertingSystem()

    import sys
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == 'test':
            # Send test alert
            alert_id = alerting.create_alert(
                'website_down',
                'Test Alert - Website Monitoring',
                'This is a test alert to verify the notification system is working properly.'
            )
            print(f"Test alert created: {alert_id}")

        elif command == 'status':
            # Show active alerts
            active_alerts = alerting.get_active_alerts()
            print(f"Active alerts: {len(active_alerts)}")
            for alert in active_alerts:
                print(f"  {alert['alert_id']}: {alert['title']} ({alert['severity']})")

        elif command == 'acknowledge' and len(sys.argv) > 3:
            # Acknowledge alert
            alert_id = sys.argv[2]
            acknowledged_by = sys.argv[3]
            alerting.acknowledge_alert(alert_id, acknowledged_by)
            print(f"Alert {alert_id} acknowledged by {acknowledged_by}")

        elif command == 'resolve' and len(sys.argv) > 2:
            # Resolve alert
            alert_id = sys.argv[2]
            resolved_by = sys.argv[3] if len(sys.argv) > 3 else 'manual'
            alerting.resolve_alert(alert_id, resolved_by)
            print(f"Alert {alert_id} resolved")

        elif command == 'cleanup':
            # Clean up old alerts
            deleted = alerting.cleanup_old_alerts()
            print(f"Cleaned up {deleted} old alerts")

        else:
            print("Usage: python alerting_system.py [test|status|acknowledge <alert_id> <user>|resolve <alert_id> [user]|cleanup]")
    else:
        print("Alerting system ready. Use with monitoring systems to send alerts.")

if __name__ == "__main__":
    main()
