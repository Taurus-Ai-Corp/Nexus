#!/usr/bin/env python3
"""
Public Status Page
Real-time website status communication
"""

from flask import Flask, render_template, jsonify
import sqlite3
import json
from datetime import datetime, timedelta
import statistics

app = Flask(__name__)

class StatusPage:
    def __init__(self):
        self.monitoring_db = 'monitoring_data.db'
        self.alerts_db = 'alerting.db'
        
    def get_current_status(self):
        """Get current overall website status"""
        try:
            conn = sqlite3.connect(self.monitoring_db)
            cursor = conn.cursor()
            
            # Get latest monitoring results (last 5 minutes)
            cursor.execute('''
                SELECT success, response_time, timestamp 
                FROM monitoring_results 
                WHERE timestamp > datetime('now', '-5 minutes')
                ORDER BY timestamp DESC
                LIMIT 10
            ''')
            
            recent_results = cursor.fetchall()
            conn.close()
            
            if not recent_results:
                return {
                    'status': 'unknown',
                    'message': 'No recent monitoring data available',
                    'last_checked': None
                }
            
            # Calculate success rate
            successful_checks = sum(1 for r in recent_results if r[0])
            success_rate = (successful_checks / len(recent_results)) * 100
            
            # Calculate average response time
            response_times = [r[1] for r in recent_results if r[1] is not None]
            avg_response_time = statistics.mean(response_times) if response_times else 0
            
            # Determine status
            if success_rate >= 95:
                if avg_response_time < 2000:  # Less than 2 seconds
                    status = 'operational'
                    message = 'All systems operational'
                else:
                    status = 'degraded'
                    message = 'Slower than normal response times'
            elif success_rate >= 80:
                status = 'degraded'
                message = 'Some connectivity issues detected'
            else:
                status = 'outage'
                message = 'Service disruption detected'
            
            return {
                'status': status,
                'message': message,
                'success_rate': success_rate,
                'avg_response_time': avg_response_time,
                'last_checked': recent_results[0][2] if recent_results else None
            }
            
        except Exception as e:
            return {
                'status': 'unknown',
                'message': f'Status check error: {str(e)}',
                'last_checked': None
            }
    
    def get_uptime_stats(self, days=30):
        """Get uptime statistics for specified period"""
        try:
            conn = sqlite3.connect(self.monitoring_db)
            cursor = conn.cursor()
            
            # Get uptime data for the period
            cursor.execute('''
                SELECT date, uptime_percentage, avg_response_time 
                FROM uptime_summary 
                WHERE date > date('now', '-{} days')
                ORDER BY date DESC
            '''.format(days))
            
            uptime_data = cursor.fetchall()
            conn.close()
            
            if not uptime_data:
                return {
                    'overall_uptime': 0,
                    'avg_response_time': 0,
                    'daily_stats': []
                }
            
            # Calculate overall statistics
            uptimes = [row[1] for row in uptime_data if row[1] is not None]
            response_times = [row[2] for row in uptime_data if row[2] is not None]
            
            overall_uptime = statistics.mean(uptimes) if uptimes else 0
            avg_response_time = statistics.mean(response_times) if response_times else 0
            
            # Format daily stats
            daily_stats = []
            for row in uptime_data:
                daily_stats.append({
                    'date': row[0],
                    'uptime': row[1] or 0,
                    'avg_response_time': row[2] or 0
                })
            
            return {
                'overall_uptime': overall_uptime,
                'avg_response_time': avg_response_time,
                'daily_stats': daily_stats
            }
            
        except Exception as e:
            return {
                'overall_uptime': 0,
                'avg_response_time': 0,
                'daily_stats': [],
                'error': str(e)
            }
    
    def get_active_incidents(self):
        """Get active incidents/alerts"""
        try:
            conn = sqlite3.connect(self.alerts_db)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT alert_id, alert_type, severity, title, message, timestamp 
                FROM alerts 
                WHERE status = 'active' 
                ORDER BY timestamp DESC
            ''')
            
            incidents = cursor.fetchall()
            conn.close()
            
            formatted_incidents = []
            for incident in incidents:
                formatted_incidents.append({
                    'id': incident[0],
                    'type': incident[1],
                    'severity': incident[2],
                    'title': incident[3],
                    'message': incident[4],
                    'started': incident[5],
                    'duration': self.calculate_duration(incident[5])
                })
            
            return formatted_incidents
            
        except Exception as e:
            return []
    
    def get_recent_incidents(self, days=7):
        """Get recent resolved incidents"""
        try:
            conn = sqlite3.connect(self.alerts_db)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT alert_id, alert_type, severity, title, timestamp, resolved_timestamp 
                FROM alerts 
                WHERE status = 'resolved' 
                AND resolved_timestamp > datetime('now', '-{} days')
                ORDER BY resolved_timestamp DESC
                LIMIT 10
            '''.format(days))
            
            incidents = cursor.fetchall()
            conn.close()
            
            formatted_incidents = []
            for incident in incidents:
                formatted_incidents.append({
                    'id': incident[0],
                    'type': incident[1],
                    'severity': incident[2],
                    'title': incident[3],
                    'started': incident[4],
                    'resolved': incident[5],
                    'duration': self.calculate_duration(incident[4], incident[5])
                })
            
            return formatted_incidents
            
        except Exception as e:
            return []
    
    def calculate_duration(self, start_time, end_time=None):
        """Calculate duration between start and end time"""
        try:
            start = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            end = datetime.now() if end_time is None else datetime.fromisoformat(end_time.replace('Z', '+00:00'))
            
            duration = end - start
            
            if duration.days > 0:
                return f"{duration.days}d {duration.seconds // 3600}h"
            elif duration.seconds >= 3600:
                return f"{duration.seconds // 3600}h {(duration.seconds % 3600) // 60}m"
            else:
                return f"{duration.seconds // 60}m"
                
        except:
            return "Unknown"
    
    def get_component_status(self):
        """Get status of individual website components"""
        components = [
            {
                'name': 'Website',
                'description': 'Main website functionality',
                'status': 'operational'
            },
            {
                'name': 'CDN',
                'description': 'Content delivery network',
                'status': 'operational'
            },
            {
                'name': 'SSL Certificate',
                'description': 'Security certificate',
                'status': 'operational'
            },
            {
                'name': 'DNS',
                'description': 'Domain name resolution',
                'status': 'operational'
            }
        ]
        
        # In a real implementation, you would check each component
        # For now, return default operational status
        return components

status_page = StatusPage()

@app.route('/')
def index():
    """Main status page"""
    current_status = status_page.get_current_status()
    uptime_stats = status_page.get_uptime_stats(30)
    active_incidents = status_page.get_active_incidents()
    recent_incidents = status_page.get_recent_incidents(7)
    components = status_page.get_component_status()
    
    return render_template('status_page.html',
                         current_status=current_status,
                         uptime_stats=uptime_stats,
                         active_incidents=active_incidents,
                         recent_incidents=recent_incidents,
                         components=components)

@app.route('/api/status')
def api_status():
    """API endpoint for current status"""
    return jsonify(status_page.get_current_status())

@app.route('/api/uptime')
def api_uptime():
    """API endpoint for uptime statistics"""
    days = request.args.get('days', 30, type=int)
    return jsonify(status_page.get_uptime_stats(days))

@app.route('/api/incidents')
def api_incidents():
    """API endpoint for incidents"""
    return jsonify({
        'active': status_page.get_active_incidents(),
        'recent': status_page.get_recent_incidents()
    })

@app.route('/api/components')
def api_components():
    """API endpoint for component status"""
    return jsonify(status_page.get_component_status())

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8080)
