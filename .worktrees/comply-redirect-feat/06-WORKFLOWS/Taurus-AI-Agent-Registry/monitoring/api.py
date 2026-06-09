#!/usr/bin/env python3
from flask import Flask, jsonify
from monitor import check_services, get_agent_status, get_revenue_metrics

app = Flask(__name__)

@app.route('/api/status')
def status():
    return jsonify({
        'services': check_services(),
        'agents': get_agent_status(),
        'revenue': get_revenue_metrics(),
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
