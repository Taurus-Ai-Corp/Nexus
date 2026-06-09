const express = require('express');
const router = express.Router();
const { Revenue, UserAnalytics, Agent, SystemHealth } = require('../models/Analytics');
const { validateRequest } = require('../middleware/validation');
const { analyticsValidation } = require('../validators/analytics');
const logger = require('../utils/logger');

// Get comprehensive business metrics
router.get('/business', validateRequest(analyticsValidation.getBusinessMetrics), async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const startDate = calculateStartDate(now, timeRange);
    
    // Fetch all metrics in parallel
    const [revenue, users, agents, system] = await Promise.all([
      getRevenueMetrics(startDate, now),
      getUserMetrics(startDate, now),
      getAgentMetrics(startDate, now),
      getSystemMetrics(startDate, now)
    ]);

    const businessMetrics = {
      revenue,
      users,
      agents,
      system,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: businessMetrics
    });

  } catch (error) {
    logger.error('Error fetching business metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business metrics',
      message: error.message
    });
  }
});

// Get revenue analytics
router.get('/revenue', validateRequest(analyticsValidation.getRevenue), async (req, res) => {
  try {
    const { timeRange = '24h', granularity = 'hour' } = req.query;
    const now = new Date();
    const startDate = calculateStartDate(now, timeRange);
    
    const revenue = await getRevenueMetrics(startDate, now, granularity);
    
    res.json({
      success: true,
      data: revenue
    });

  } catch (error) {
    logger.error('Error fetching revenue analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue analytics',
      message: error.message
    });
  }
});

// Get user analytics
router.get('/users', validateRequest(analyticsValidation.getUsers), async (req, res) => {
  try {
    const { timeRange = '24h', granularity = 'hour' } = req.query;
    const now = new Date();
    const startDate = calculateStartDate(now, timeRange);
    
    const users = await getUserMetrics(startDate, now, granularity);
    
    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    logger.error('Error fetching user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics',
      message: error.message
    });
  }
});

// Get agent performance
router.get('/agents', validateRequest(analyticsValidation.getAgents), async (req, res) => {
  try {
    const { timeRange = '24h', agentId } = req.query;
    const now = new Date();
    const startDate = calculateStartDate(now, timeRange);
    
    const agents = await getAgentMetrics(startDate, now, agentId);
    
    res.json({
      success: true,
      data: agents
    });

  } catch (error) {
    logger.error('Error fetching agent analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent analytics',
      message: error.message
    });
  }
});

// Get system health
router.get('/system', validateRequest(analyticsValidation.getSystem), async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    const now = new Date();
    const startDate = calculateStartDate(now, timeRange);
    
    const system = await getSystemMetrics(startDate, now);
    
    res.json({
      success: true,
      data: system
    });

  } catch (error) {
    logger.error('Error fetching system analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system analytics',
      message: error.message
    });
  }
});

// Get real-time metrics
router.get('/realtime', async (req, res) => {
  try {
    const realtimeData = await getRealtimeMetrics();
    
    res.json({
      success: true,
      data: realtimeData
    });

  } catch (error) {
    logger.error('Error fetching real-time metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch real-time metrics',
      message: error.message
    });
  }
});

// Helper functions
function calculateStartDate(now, timeRange) {
  const ranges = {
    '1h': 1 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
    '1y': 365 * 24 * 60 * 60 * 1000
  };
  
  return new Date(now.getTime() - (ranges[timeRange] || ranges['24h']));
}

async function getRevenueMetrics(startDate, endDate, granularity = 'hour') {
  const pipeline = [
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$total' },
        avgGrowth: { $avg: '$growth' },
        latestTrend: { $last: '$trend' },
        breakdown: {
          $push: '$breakdown'
        }
      }
    }
  ];

  const result = await Revenue.aggregate(pipeline);
  
  if (result.length === 0) {
    return {
      total: 0,
      growth: 0,
      trend: 'stable',
      period: '24h',
      breakdown: {
        subscriptions: 0,
        oneTime: 0,
        refunds: 0,
        discounts: 0
      }
    };
  }

  const data = result[0];
  return {
    total: data.total,
    growth: data.avgGrowth,
    trend: data.latestTrend,
    period: '24h',
    breakdown: data.breakdown[0] || {
      subscriptions: 0,
      oneTime: 0,
      refunds: 0,
      discounts: 0
    }
  };
}

async function getUserMetrics(startDate, endDate, granularity = 'hour') {
  const pipeline = [
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $max: '$total' },
        active: { $max: '$active' },
        new: { $sum: '$new' },
        churned: { $sum: '$churned' },
        avgGrowth: { $avg: '$growth' },
        latestTrend: { $last: '$trend' },
        demographics: { $last: '$demographics' }
      }
    }
  ];

  const result = await UserAnalytics.aggregate(pipeline);
  
  if (result.length === 0) {
    return {
      total: 0,
      active: 0,
      new: 0,
      churned: 0,
      growth: 0,
      trend: 'stable',
      period: '24h',
      demographics: {
        ageGroups: {},
        locations: [],
        devices: { mobile: 0, desktop: 0, tablet: 0 }
      }
    };
  }

  const data = result[0];
  return {
    total: data.total,
    active: data.active,
    new: data.new,
    churned: data.churned,
    growth: data.avgGrowth,
    trend: data.latestTrend,
    period: '24h',
    demographics: data.demographics || {
      ageGroups: {},
      locations: [],
      devices: { mobile: 0, desktop: 0, tablet: 0 }
    }
  };
}

async function getAgentMetrics(startDate, endDate, agentId = null) {
  const matchStage = {
    date: { $gte: startDate, $lte: endDate }
  };
  
  if (agentId) {
    matchStage.agentId = agentId;
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: '$agentId',
        name: { $first: '$name' },
        status: { $last: '$status' },
        avgPerformance: { $avg: '$performance' },
        avgUptime: { $avg: '$uptime' },
        totalRequests: { $sum: '$requests.total' },
        successfulRequests: { $sum: '$requests.successful' },
        failedRequests: { $sum: '$requests.failed' },
        avgResponseTime: { $avg: '$requests.avgResponseTime' },
        errorCount: { $sum: { $size: '$errors' } }
      }
    },
    {
      $project: {
        agentId: '$_id',
        name: 1,
        status: 1,
        performance: { $round: ['$avgPerformance', 2] },
        uptime: { $round: ['$avgUptime', 2] },
        requests: {
          total: '$totalRequests',
          successful: '$successfulRequests',
          failed: '$failedRequests',
          avgResponseTime: { $round: ['$avgResponseTime', 2] }
        },
        errorCount: 1
      }
    }
  ];

  const agents = await Agent.aggregate(pipeline);
  
  return {
    agents,
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    avgPerformance: agents.reduce((sum, a) => sum + a.performance, 0) / agents.length || 0
  };
}

async function getSystemMetrics(startDate, endDate) {
  const latest = await SystemHealth.findOne({
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: -1 });

  if (!latest) {
    return {
      health: 100,
      uptime: 100,
      performance: {
        responseTime: 0,
        throughput: 0,
        errorRate: 0
      },
      resources: {
        cpu: { usage: 0, cores: 0, load: 0 },
        memory: { used: 0, total: 0, percentage: 0 },
        disk: { used: 0, total: 0, percentage: 0 },
        network: { inbound: 0, outbound: 0, latency: 0 }
      },
      services: []
    };
  }

  return {
    health: latest.health,
    uptime: latest.uptime,
    performance: latest.performance,
    resources: latest.resources,
    services: latest.services
  };
}

async function getRealtimeMetrics() {
  // This would typically fetch real-time data from Redis or live system metrics
  return {
    timestamp: new Date().toISOString(),
    activeUsers: Math.floor(Math.random() * 1000) + 500,
    requestsPerSecond: Math.floor(Math.random() * 100) + 50,
    responseTime: Math.floor(Math.random() * 200) + 100,
    errorRate: Math.random() * 2,
    systemLoad: Math.random() * 100
  };
}

module.exports = router;

