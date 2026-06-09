const { Revenue, UserAnalytics, Agent, SystemHealth, Alert } = require('../models/Analytics');
const { broadcastAnalyticsUpdate, broadcastMetricUpdate, broadcastAlert } = require('./websocket');
const logger = require('../utils/logger');

let isRunning = false;
let intervalId = null;

const startDataGenerator = (io) => {
  if (isRunning) return;
  
  isRunning = true;
  logger.info('🔄 Starting data generator...');
  
  // Generate initial data
  generateInitialData();
  
  // Start periodic data generation
  intervalId = setInterval(() => {
    generateRealtimeData();
  }, 5000); // Generate data every 5 seconds
};

const stopDataGenerator = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isRunning = false;
  logger.info('⏹️ Data generator stopped');
};

const generateInitialData = async () => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Generate revenue data for the last 24 hours
    for (let i = 0; i < 24; i++) {
      const date = new Date(oneDayAgo.getTime() + i * 60 * 60 * 1000);
      const revenue = generateRevenueData(date);
      await Revenue.create(revenue);
    }
    
    // Generate user analytics data
    for (let i = 0; i < 24; i++) {
      const date = new Date(oneDayAgo.getTime() + i * 60 * 60 * 1000);
      const users = generateUserData(date);
      await UserAnalytics.create(users);
    }
    
    // Generate agent data
    const agents = ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-5'];
    for (const agentId of agents) {
      for (let i = 0; i < 24; i++) {
        const date = new Date(oneDayAgo.getTime() + i * 60 * 60 * 1000);
        const agent = generateAgentData(agentId, `Agent ${agentId.split('-')[1]}`, date);
        await Agent.create(agent);
      }
    }
    
    // Generate system health data
    for (let i = 0; i < 24; i++) {
      const date = new Date(oneDayAgo.getTime() + i * 60 * 60 * 1000);
      const system = generateSystemData(date);
      await SystemHealth.create(system);
    }
    
    // Generate some initial alerts
    const alerts = generateInitialAlerts();
    for (const alert of alerts) {
      await Alert.create(alert);
    }
    
    logger.info('✅ Initial data generated successfully');
    
  } catch (error) {
    logger.error('❌ Error generating initial data:', error);
  }
};

const generateRealtimeData = async () => {
  try {
    const now = new Date();
    
    // Generate new revenue data point
    const revenue = generateRevenueData(now);
    await Revenue.create(revenue);
    
    // Generate new user analytics data point
    const users = generateUserData(now);
    await UserAnalytics.create(users);
    
    // Generate new agent data for all agents
    const agents = ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-5'];
    for (const agentId of agents) {
      const agent = generateAgentData(agentId, `Agent ${agentId.split('-')[1]}`, now);
      await Agent.create(agent);
    }
    
    // Generate new system health data
    const system = generateSystemData(now);
    await SystemHealth.create(system);
    
    // Occasionally generate alerts
    if (Math.random() < 0.1) { // 10% chance
      const alert = generateRandomAlert();
      await Alert.create(alert);
      broadcastAlert(alert);
    }
    
    // Broadcast updates
    const realtimeData = {
      revenue: revenue.total,
      users: users.total,
      activeUsers: users.active,
      systemHealth: system.health,
      timestamp: now.toISOString()
    };
    
    broadcastAnalyticsUpdate(realtimeData);
    broadcastMetricUpdate('revenue', { value: revenue.total, trend: revenue.trend });
    broadcastMetricUpdate('users', { value: users.total, active: users.active });
    broadcastMetricUpdate('system', { health: system.health, uptime: system.uptime });
    
  } catch (error) {
    logger.error('❌ Error generating real-time data:', error);
  }
};

const generateRevenueData = (date) => {
  const baseRevenue = 100000;
  const variation = (Math.random() - 0.5) * 20000;
  const total = Math.max(0, baseRevenue + variation);
  
  return {
    date,
    total: Math.round(total),
    growth: (Math.random() - 0.5) * 20,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    period: '1h',
    breakdown: {
      subscriptions: Math.round(total * 0.7),
      oneTime: Math.round(total * 0.25),
      refunds: Math.round(total * 0.03),
      discounts: Math.round(total * 0.02)
    },
    currency: 'USD'
  };
};

const generateUserData = (date) => {
  const baseUsers = 1000;
  const variation = (Math.random() - 0.5) * 200;
  const total = Math.max(0, baseUsers + variation);
  const active = Math.round(total * (0.7 + Math.random() * 0.2));
  
  return {
    date,
    total: Math.round(total),
    active: Math.round(active),
    new: Math.round(Math.random() * 50),
    churned: Math.round(Math.random() * 20),
    growth: (Math.random() - 0.5) * 15,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    period: '1h',
    demographics: {
      ageGroups: {
        '18-24': Math.round(total * 0.15),
        '25-34': Math.round(total * 0.35),
        '35-44': Math.round(total * 0.25),
        '45-54': Math.round(total * 0.15),
        '55+': Math.round(total * 0.10)
      },
      locations: [
        { country: 'US', count: Math.round(total * 0.4) },
        { country: 'UK', count: Math.round(total * 0.2) },
        { country: 'CA', count: Math.round(total * 0.15) },
        { country: 'AU', count: Math.round(total * 0.1) },
        { country: 'Other', count: Math.round(total * 0.15) }
      ],
      devices: {
        mobile: Math.round(total * 0.6),
        desktop: Math.round(total * 0.35),
        tablet: Math.round(total * 0.05)
      }
    }
  };
};

const generateAgentData = (agentId, name, date) => {
  const statuses = ['active', 'inactive', 'maintenance', 'error'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const performance = Math.max(0, Math.min(100, 80 + (Math.random() - 0.5) * 40));
  const uptime = Math.max(0, Math.min(100, 95 + (Math.random() - 0.5) * 10));
  
  return {
    date,
    agentId,
    name,
    status,
    performance: Math.round(performance),
    requests: {
      total: Math.round(Math.random() * 1000),
      successful: Math.round(Math.random() * 950),
      failed: Math.round(Math.random() * 50),
      avgResponseTime: Math.round(100 + Math.random() * 200)
    },
    uptime: Math.round(uptime),
    errors: Math.random() < 0.1 ? [{
      type: 'API_ERROR',
      message: 'Connection timeout',
      timestamp: date,
      severity: 'medium'
    }] : [],
    metrics: {
      cpu: Math.round(Math.random() * 100),
      memory: Math.round(Math.random() * 100),
      disk: Math.round(Math.random() * 100),
      network: Math.round(Math.random() * 100)
    }
  };
};

const generateSystemData = (date) => {
  const health = Math.max(0, Math.min(100, 90 + (Math.random() - 0.5) * 20));
  const uptime = Math.max(0, Math.min(100, 99 + (Math.random() - 0.5) * 2));
  
  return {
    date,
    health: Math.round(health),
    uptime: Math.round(uptime),
    performance: {
      responseTime: Math.round(100 + Math.random() * 300),
      throughput: Math.round(1000 + Math.random() * 2000),
      errorRate: Math.round(Math.random() * 5 * 100) / 100
    },
    resources: {
      cpu: {
        usage: Math.round(Math.random() * 100),
        cores: 8,
        load: Math.round(Math.random() * 10 * 100) / 100
      },
      memory: {
        used: Math.round(Math.random() * 16 * 1024),
        total: 16 * 1024,
        percentage: Math.round(Math.random() * 100)
      },
      disk: {
        used: Math.round(Math.random() * 500 * 1024),
        total: 1000 * 1024,
        percentage: Math.round(Math.random() * 100)
      },
      network: {
        inbound: Math.round(Math.random() * 1000),
        outbound: Math.round(Math.random() * 1000),
        latency: Math.round(10 + Math.random() * 50)
      }
    },
    services: [
      {
        name: 'API Gateway',
        status: 'healthy',
        responseTime: Math.round(50 + Math.random() * 100),
        uptime: 99.9
      },
      {
        name: 'Database',
        status: 'healthy',
        responseTime: Math.round(20 + Math.random() * 50),
        uptime: 99.8
      },
      {
        name: 'Cache',
        status: 'healthy',
        responseTime: Math.round(5 + Math.random() * 20),
        uptime: 99.5
      }
    ]
  };
};

const generateInitialAlerts = () => {
  return [
    {
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance will occur tonight from 2 AM to 4 AM UTC',
      source: 'System Scheduler',
      severity: 'low',
      status: 'active',
      tags: ['maintenance', 'scheduled']
    },
    {
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Memory usage is above 80% on server-01',
      source: 'System Monitor',
      severity: 'medium',
      status: 'active',
      tags: ['memory', 'performance']
    }
  ];
};

const generateRandomAlert = () => {
  const alertTypes = [
    {
      type: 'warning',
      title: 'High CPU Usage',
      message: 'CPU usage is above 85% on server-02',
      source: 'System Monitor',
      severity: 'medium'
    },
    {
      type: 'error',
      title: 'Database Connection Failed',
      message: 'Failed to connect to primary database',
      source: 'Database Monitor',
      severity: 'high'
    },
    {
      type: 'info',
      title: 'New User Registration',
      message: 'A new user has registered for the platform',
      source: 'User Management',
      severity: 'low'
    }
  ];
  
  const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  
  return {
    ...randomAlert,
    status: 'active',
    tags: ['auto-generated']
  };
};

module.exports = {
  startDataGenerator,
  stopDataGenerator
};

