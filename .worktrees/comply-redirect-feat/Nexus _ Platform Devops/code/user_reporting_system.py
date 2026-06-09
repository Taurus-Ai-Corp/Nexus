#!/usr/bin/env python3
"""
User Issue Reporting System
Web form for issue collection with automated diagnostics
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3
import json
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from datetime import datetime
import uuid
import requests
import logging
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this'

# Configuration
CONFIG = {
    'database_path': 'user_reports.db',
    'upload_folder': 'uploads',
    'max_file_size': 16 * 1024 * 1024,  # 16MB
    'allowed_extensions': {'png', 'jpg', 'jpeg', 'gif', 'txt', 'log', 'json'},
    'notification': {
        'enabled': True,
        'smtp_server': 'smtp.gmail.com',
        'smtp_port': 587,
        'sender_email': 'support@example.com',
        'sender_password': 'your-app-password',
        'recipients': ['support@example.com', 'devops@example.com']
    },
    'auto_diagnostics': {
        'enabled': True,
        'target_url': 'https://vc1j5apvcf.space.minimax.io/features',
        'timeout': 30
    }
}

class UserReportingSystem:
    def __init__(self):
        self.setup_database()
        self.setup_logging()
        self.setup_upload_folder()
    
    def setup_database(self):
        """Initialize user reports database"""
        conn = sqlite3.connect(CONFIG['database_path'])
        cursor = conn.cursor()
        
        # User reports table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_id TEXT UNIQUE NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_email TEXT,
                user_name TEXT,
                issue_type TEXT,
                severity TEXT,
                subject TEXT,
                description TEXT,
                url_affected TEXT,
                browser_info TEXT,
                device_info TEXT,
                network_info TEXT,
                steps_to_reproduce TEXT,
                expected_behavior TEXT,
                actual_behavior TEXT,
                error_messages TEXT,
                additional_info TEXT,
                attachments TEXT,
                status TEXT DEFAULT 'open',
                assigned_to TEXT,
                resolution TEXT,
                resolved_timestamp DATETIME
            )
        ''')
        
        # Automated diagnostics results
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS diagnostic_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_id TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                diagnostic_type TEXT,
                result_data TEXT,
                success BOOLEAN,
                error_message TEXT,
                FOREIGN KEY (report_id) REFERENCES user_reports (report_id)
            )
        ''')
        
        # Report comments/updates
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS report_comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_id TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                author TEXT,
                comment_type TEXT,
                content TEXT,
                internal_only BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (report_id) REFERENCES user_reports (report_id)
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
                logging.FileHandler('user_reporting.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def setup_upload_folder(self):
        """Create upload folder if it doesn't exist"""
        if not os.path.exists(CONFIG['upload_folder']):
            os.makedirs(CONFIG['upload_folder'])
    
    def allowed_file(self, filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in CONFIG['allowed_extensions']
    
    def generate_report_id(self):
        """Generate unique report ID"""
        return f"RPT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    def run_automated_diagnostics(self, report_id, url_affected=None):
        """Run automated diagnostics for the reported issue"""
        if not CONFIG['auto_diagnostics']['enabled']:
            return
        
        target_url = url_affected or CONFIG['auto_diagnostics']['target_url']
        diagnostics = []
        
        # Basic connectivity test
        try:
            connectivity_result = self.test_basic_connectivity(target_url)
            diagnostics.append({
                'type': 'connectivity',
                'result': connectivity_result,
                'success': connectivity_result.get('success', False)
            })
        except Exception as e:
            diagnostics.append({
                'type': 'connectivity',
                'result': {'error': str(e)},
                'success': False
            })
        
        # DNS resolution test
        try:
            dns_result = self.test_dns_resolution(target_url)
            diagnostics.append({
                'type': 'dns',
                'result': dns_result,
                'success': dns_result.get('success', False)
            })
        except Exception as e:
            diagnostics.append({
                'type': 'dns',
                'result': {'error': str(e)},
                'success': False
            })
        
        # SSL certificate test
        try:
            ssl_result = self.test_ssl_certificate(target_url)
            diagnostics.append({
                'type': 'ssl',
                'result': ssl_result,
                'success': ssl_result.get('success', False)
            })
        except Exception as e:
            diagnostics.append({
                'type': 'ssl',
                'result': {'error': str(e)},
                'success': False
            })
        
        # Performance test
        try:
            performance_result = self.test_performance(target_url)
            diagnostics.append({
                'type': 'performance',
                'result': performance_result,
                'success': performance_result.get('success', False)
            })
        except Exception as e:
            diagnostics.append({
                'type': 'performance',
                'result': {'error': str(e)},
                'success': False
            })
        
        # Store diagnostic results
        self.store_diagnostic_results(report_id, diagnostics)
        
        return diagnostics
    
    def test_basic_connectivity(self, url):
        """Test basic connectivity to the URL"""
        try:
            response = requests.get(url, timeout=CONFIG['auto_diagnostics']['timeout'])
            return {
                'success': True,
                'status_code': response.status_code,
                'response_time': response.elapsed.total_seconds(),
                'content_length': len(response.content),
                'headers': dict(response.headers)
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def test_dns_resolution(self, url):
        """Test DNS resolution for the URL"""
        import socket
        try:
            hostname = url.replace('https://', '').replace('http://', '').split('/')[0]
            ip_address = socket.gethostbyname(hostname)
            return {
                'success': True,
                'hostname': hostname,
                'ip_address': ip_address
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def test_ssl_certificate(self, url):
        """Test SSL certificate for the URL"""
        import ssl
        import socket
        try:
            hostname = url.replace('https://', '').replace('http://', '').split('/')[0]
            context = ssl.create_default_context()
            
            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    
            expiry_date = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
            days_until_expiry = (expiry_date - datetime.now()).days
            
            return {
                'success': True,
                'certificate_subject': dict(x[0] for x in cert['subject']),
                'certificate_issuer': dict(x[0] for x in cert['issuer']),
                'expiry_date': cert['notAfter'],
                'days_until_expiry': days_until_expiry,
                'tls_version': ssock.version()
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def test_performance(self, url):
        """Test performance metrics for the URL"""
        import time
        try:
            times = []
            for _ in range(3):
                start_time = time.time()
                response = requests.get(url, timeout=CONFIG['auto_diagnostics']['timeout'])
                end_time = time.time()
                times.append((end_time - start_time) * 1000)
                time.sleep(0.5)
            
            return {
                'success': True,
                'response_times': times,
                'average_response_time': sum(times) / len(times),
                'min_response_time': min(times),
                'max_response_time': max(times)
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def store_diagnostic_results(self, report_id, diagnostics):
        """Store diagnostic results in database"""
        conn = sqlite3.connect(CONFIG['database_path'])
        cursor = conn.cursor()
        
        for diagnostic in diagnostics:
            cursor.execute('''
                INSERT INTO diagnostic_results 
                (report_id, diagnostic_type, result_data, success, error_message)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                report_id,
                diagnostic['type'],
                json.dumps(diagnostic['result']),
                diagnostic['success'],
                diagnostic['result'].get('error') if not diagnostic['success'] else None
            ))
        
        conn.commit()
        conn.close()
    
    def submit_report(self, report_data, files=None):
        """Submit a new user report"""
        report_id = self.generate_report_id()
        
        # Handle file uploads
        attachments = []
        if files:
            for file in files:
                if file and file.filename and self.allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    filename = f"{report_id}_{filename}"
                    file_path = os.path.join(CONFIG['upload_folder'], filename)
                    file.save(file_path)
                    attachments.append(filename)
        
        # Store report in database
        conn = sqlite3.connect(CONFIG['database_path'])
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO user_reports 
            (report_id, user_email, user_name, issue_type, severity, subject, 
             description, url_affected, browser_info, device_info, network_info,
             steps_to_reproduce, expected_behavior, actual_behavior, 
             error_messages, additional_info, attachments)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            report_id,
            report_data.get('user_email'),
            report_data.get('user_name'),
            report_data.get('issue_type'),
            report_data.get('severity'),
            report_data.get('subject'),
            report_data.get('description'),
            report_data.get('url_affected'),
            report_data.get('browser_info'),
            report_data.get('device_info'),
            report_data.get('network_info'),
            report_data.get('steps_to_reproduce'),
            report_data.get('expected_behavior'),
            report_data.get('actual_behavior'),
            report_data.get('error_messages'),
            report_data.get('additional_info'),
            json.dumps(attachments)
        ))
        
        conn.commit()
        conn.close()
        
        # Run automated diagnostics
        self.run_automated_diagnostics(report_id, report_data.get('url_affected'))
        
        # Send notification
        if CONFIG['notification']['enabled']:
            self.send_notification(report_id, report_data)
        
        self.logger.info(f"New report submitted: {report_id}")
        return report_id
    
    def send_notification(self, report_id, report_data):
        """Send email notification for new report"""
        try:
            msg = MimeMultipart()
            msg['From'] = CONFIG['notification']['sender_email']
            msg['To'] = ', '.join(CONFIG['notification']['recipients'])
            msg['Subject'] = f"New User Report: {report_data.get('subject', 'No Subject')} [{report_id}]"
            
            body = f"""
New User Issue Report Submitted

Report ID: {report_id}
Submitted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

User Information:
- Name: {report_data.get('user_name', 'Not provided')}
- Email: {report_data.get('user_email', 'Not provided')}

Issue Details:
- Type: {report_data.get('issue_type', 'Not specified')}
- Severity: {report_data.get('severity', 'Not specified')}
- Subject: {report_data.get('subject', 'Not provided')}
- URL Affected: {report_data.get('url_affected', 'Not provided')}

Description:
{report_data.get('description', 'No description provided')}

Browser Information:
{report_data.get('browser_info', 'Not provided')}

Steps to Reproduce:
{report_data.get('steps_to_reproduce', 'Not provided')}

Expected Behavior:
{report_data.get('expected_behavior', 'Not provided')}

Actual Behavior:
{report_data.get('actual_behavior', 'Not provided')}

Error Messages:
{report_data.get('error_messages', 'None reported')}

Please review and respond to this report promptly.

Best regards,
User Reporting System
            """
            
            msg.attach(MimeText(body, 'plain'))
            
            server = smtplib.SMTP(CONFIG['notification']['smtp_server'], CONFIG['notification']['smtp_port'])
            server.starttls()
            server.login(CONFIG['notification']['sender_email'], CONFIG['notification']['sender_password'])
            server.send_message(msg)
            server.quit()
            
            self.logger.info(f"Notification sent for report: {report_id}")
            
        except Exception as e:
            self.logger.error(f"Failed to send notification for {report_id}: {str(e)}")
    
    def get_report(self, report_id):
        """Get report details by ID"""
        conn = sqlite3.connect(CONFIG['database_path'])
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM user_reports WHERE report_id = ?', (report_id,))
        report = cursor.fetchone()
        
        if report:
            # Get column names
            columns = [description[0] for description in cursor.description]
            report_dict = dict(zip(columns, report))
            
            # Get diagnostic results
            cursor.execute('SELECT * FROM diagnostic_results WHERE report_id = ?', (report_id,))
            diagnostics = cursor.fetchall()
            
            diagnostic_columns = [description[0] for description in cursor.description]
            report_dict['diagnostics'] = [dict(zip(diagnostic_columns, diag)) for diag in diagnostics]
            
            # Get comments
            cursor.execute('SELECT * FROM report_comments WHERE report_id = ? ORDER BY timestamp', (report_id,))
            comments = cursor.fetchall()
            
            comment_columns = [description[0] for description in cursor.description]
            report_dict['comments'] = [dict(zip(comment_columns, comment)) for comment in comments]
            
            conn.close()
            return report_dict
        
        conn.close()
        return None
    
    def get_all_reports(self, status=None, limit=50):
        """Get all reports with optional status filter"""
        conn = sqlite3.connect(CONFIG['database_path'])
        cursor = conn.cursor()
        
        if status:
            cursor.execute('''
                SELECT report_id, timestamp, user_email, issue_type, severity, 
                       subject, status FROM user_reports 
                WHERE status = ? ORDER BY timestamp DESC LIMIT ?
            ''', (status, limit))
        else:
            cursor.execute('''
                SELECT report_id, timestamp, user_email, issue_type, severity, 
                       subject, status FROM user_reports 
                ORDER BY timestamp DESC LIMIT ?
            ''', (limit,))
        
        reports = cursor.fetchall()
        columns = [description[0] for description in cursor.description]
        
        conn.close()
        return [dict(zip(columns, report)) for report in reports]

# Initialize the reporting system
reporting_system = UserReportingSystem()

# Flask routes
@app.route('/')
def index():
    """Main report submission form"""
    return render_template('report_form.html')

@app.route('/submit', methods=['POST'])
def submit_report():
    """Handle report submission"""
    try:
        # Get form data
        report_data = {
            'user_email': request.form.get('user_email'),
            'user_name': request.form.get('user_name'),
            'issue_type': request.form.get('issue_type'),
            'severity': request.form.get('severity'),
            'subject': request.form.get('subject'),
            'description': request.form.get('description'),
            'url_affected': request.form.get('url_affected'),
            'browser_info': request.form.get('browser_info'),
            'device_info': request.form.get('device_info'),
            'network_info': request.form.get('network_info'),
            'steps_to_reproduce': request.form.get('steps_to_reproduce'),
            'expected_behavior': request.form.get('expected_behavior'),
            'actual_behavior': request.form.get('actual_behavior'),
            'error_messages': request.form.get('error_messages'),
            'additional_info': request.form.get('additional_info')
        }
        
        # Get uploaded files
        files = request.files.getlist('attachments')
        
        # Submit report
        report_id = reporting_system.submit_report(report_data, files)
        
        return render_template('report_success.html', report_id=report_id)
        
    except Exception as e:
        app.logger.error(f"Error submitting report: {str(e)}")
        return render_template('error.html', error="Failed to submit report. Please try again."), 500

@app.route('/report/<report_id>')
def view_report(report_id):
    """View report details"""
    report = reporting_system.get_report(report_id)
    if report:
        return render_template('report_details.html', report=report)
    else:
        return render_template('error.html', error="Report not found"), 404

@app.route('/admin')
def admin_dashboard():
    """Admin dashboard for managing reports"""
    reports = reporting_system.get_all_reports()
    return render_template('admin_dashboard.html', reports=reports)

@app.route('/api/reports')
def api_reports():
    """API endpoint for getting reports"""
    status = request.args.get('status')
    limit = int(request.args.get('limit', 50))
    reports = reporting_system.get_all_reports(status, limit)
    return jsonify(reports)

@app.route('/api/report/<report_id>')
def api_report(report_id):
    """API endpoint for getting specific report"""
    report = reporting_system.get_report(report_id)
    if report:
        return jsonify(report)
    else:
        return jsonify({'error': 'Report not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)