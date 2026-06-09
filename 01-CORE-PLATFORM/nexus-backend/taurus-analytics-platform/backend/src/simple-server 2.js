#!/usr/bin/env node
/**
 * 🏰 TAURUS AI CORP - Simple Analytics Server
 * Standalone server without external dependencies
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for demo
const mockData = {
  revenue: {
    total: 125000,
    growth: 12.5,
    trend: 'up',
    period: '24h',
    breakdown: {
      subscriptions: 87500,
      oneTime: 31250,
      refunds: 3750,
      discounts: 2500
    }
  },
  users: {
    total: 1250,
    active: 890,
    new: 45,
    churned: 12,
    growth: 8.2,
    trend: 'up',
    period: '24h',
    demographics: {
      ageGroups: {
        '18-24': 188,
        '25-34': 438,
        '35-44': 313,
        '45-54': 188,
        '55+': 123
      },
      locations: [
        { country: 'US', count: 500 },
        { country: 'UK', count: 250 },
        { country: 'CA', count: 188 },
        { country: 'AU', count: 125 },
        { country: 'Other', count: 187 }
      ],
      devices: {
        mobile: 750,
        desktop: 438,
        tablet: 62
      }
    }
  },
  agents: {
    agents: [
      {
        agentId: 'agent-1',
        name: 'Agent Alpha',
        status: 'active',
        performance: 95.2,
        uptime: 99.8,
        requests: {
          total: 1250,
          successful: 1188,
          failed: 62,
          avgResponseTime: 245
        },
        errorCount: 2
      },
      {
        agentId: 'agent-2',
        name: 'Agent Beta',
        status: 'active',
        performance: 92.1,
        uptime: 98.5,
        requests: {
          total: 980,
          successful: 902,
          failed: 78,
          avgResponseTime: 312
        },
        errorCount: 5
      },
      {
        agentId: 'agent-3',
        name: 'Agent Gamma',
        status: 'maintenance',
        performance: 88.7,
        uptime: 97.2,
        requests: {
          total: 756,
          successful: 671,
          failed: 85,
          avgResponseTime: 389
        },
        errorCount: 8
      }
    ],
    total: 3,
    active: 2,
    avgPerformance: 92.0
  },
  system: {
    health: 98,
    uptime: 99.8,
    performance: {
      responseTime: 245,
      throughput: 1250,
      errorRate: 1.2
    },
    resources: {
      cpu: {
        usage: 45,
        cores: 8,
        load: 2.1
      },
      memory: {
        used: 8192,
        total: 16384,
        percentage: 50
      },
      disk: {
        used: 256000,
        total: 512000,
        percentage: 50
      },
      network: {
        inbound: 1250,
        outbound: 980,
        latency: 25
      }
    },
    services: [
      {
        name: 'API Gateway',
        status: 'healthy',
        responseTime: 45,
        uptime: 99.9
      },
      {
        name: 'Database',
        status: 'healthy',
        responseTime: 25,
        uptime: 99.8
      },
      {
        name: 'Cache',
        status: 'healthy',
        responseTime: 8,
        uptime: 99.5
      }
    ]
  },
  alerts: [
    {
      id: '1',
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Memory usage is above 80% on server-01',
      source: 'System Monitor',
      severity: 'medium',
      status: 'active',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      tags: ['memory', 'performance']
    },
    {
      id: '2',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2 AM to 4 AM UTC',
      source: 'System Scheduler',
      severity: 'low',
      status: 'active',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      tags: ['maintenance', 'scheduled']
    }
  ],
  lastUpdated: new Date().toISOString()
};

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

app.get('/api/docs', (req, res) => {
  res.json({
    title: 'TAURUS Analytics Platform API',
    version: '1.0.0',
    description: 'Complete analytics platform with real-time capabilities',
    endpoints: {
      health: '/health',
      business: '/api/analytics/business',
      revenue: '/api/analytics/revenue',
      users: '/api/analytics/users',
      agents: '/api/analytics/agents',
      system: '/api/analytics/system',
      alerts: '/api/analytics/alerts'
    }
  });
});

// Analytics endpoints
app.get('/api/analytics/business', (req, res) => {
  res.json({
    success: true,
    data: mockData
  });
});

app.get('/api/analytics/revenue', (req, res) => {
  res.json({
    success: true,
    data: mockData.revenue
  });
});

app.get('/api/analytics/users', (req, res) => {
  res.json({
    success: true,
    data: mockData.users
  });
});

app.get('/api/analytics/agents', (req, res) => {
  res.json({
    success: true,
    data: mockData.agents
  });
});

app.get('/api/analytics/system', (req, res) => {
  res.json({
    success: true,
    data: mockData.system
  });
});

app.get('/api/analytics/alerts', (req, res) => {
  res.json({
    success: true,
    data: mockData.alerts
  });
});

app.get('/api/analytics/realtime', (req, res) => {
  res.json({
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      activeUsers: Math.floor(Math.random() * 1000) + 500,
      requestsPerSecond: Math.floor(Math.random() * 100) + 50,
      responseTime: Math.floor(Math.random() * 200) + 100,
      errorRate: Math.random() * 2,
      systemLoad: Math.random() * 100
    }
  });
});

// Serve static files (if frontend is built)
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Catch all handler for React app
app.get('*', (req, res) => {
  res.json({
    message: 'TAURUS Analytics Platform API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /health',
      'GET /api/docs',
      'GET /api/analytics/business',
      'GET /api/analytics/revenue',
      'GET /api/analytics/users',
      'GET /api/analytics/agents',
      'GET /api/analytics/system',
      'GET /api/analytics/alerts',
      'GET /api/analytics/realtime'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏰 TAURUS Analytics Platform - Simple Server`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log(`📚 Docs: http://localhost:${PORT}/api/docs`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
  console.log(`\n🎉 Ready to serve analytics data!`);
});

module.exports = app;

