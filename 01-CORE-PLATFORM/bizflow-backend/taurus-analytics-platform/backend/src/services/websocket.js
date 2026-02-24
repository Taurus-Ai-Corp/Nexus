const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

let io;

const setupWebSocket = (socketIo) => {
  io = socketIo;

  io.on('connection', async (socket) => {
    try {
      // Authenticate user
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        socket.emit('error', { message: 'Authentication required' });
        socket.disconnect();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        socket.disconnect();
        return;
      }

      // Store user info in socket
      socket.userId = user._id;
      socket.userRole = user.role;
      socket.userEmail = user.email;

      logger.info(`WebSocket connected: ${user.email} (${socket.id})`);

      // Join user to their personal room
      socket.join(`user_${user._id}`);
      
      // Join user to role-based rooms
      socket.join(`role_${user.role}`);
      
      // Join user to general analytics room
      socket.join('analytics');

      // Send connection confirmation
      socket.emit('connected', {
        message: 'Connected to TAURUS Analytics Platform',
        userId: user._id,
        role: user.role,
        timestamp: new Date().toISOString()
      });

      // Handle analytics subscriptions
      socket.on('subscribe_analytics', (data) => {
        const { metrics, timeRange = '24h' } = data;
        
        if (Array.isArray(metrics)) {
          metrics.forEach(metric => {
            socket.join(`metric_${metric}`);
          });
        }
        
        socket.emit('subscribed', {
          metrics: metrics || 'all',
          timeRange,
          timestamp: new Date().toISOString()
        });
      });

      // Handle real-time data requests
      socket.on('get_realtime_data', async () => {
        try {
          const realtimeData = await getRealtimeData();
          socket.emit('realtime_data', realtimeData);
        } catch (error) {
          socket.emit('error', { message: 'Failed to fetch real-time data' });
        }
      });

      // Handle alert acknowledgments
      socket.on('acknowledge_alert', async (data) => {
        try {
          const { alertId } = data;
          // This would update the alert in the database
          // For now, just broadcast to admin users
          socket.to('role_admin').emit('alert_acknowledged', {
            alertId,
            acknowledgedBy: user.email,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          socket.emit('error', { message: 'Failed to acknowledge alert' });
        }
      });

      // Handle custom queries
      socket.on('custom_query', async (data) => {
        try {
          const { query, parameters } = data;
          // This would execute custom analytics queries
          // For now, return mock data
          const result = await executeCustomQuery(query, parameters);
          socket.emit('query_result', result);
        } catch (error) {
          socket.emit('error', { message: 'Query execution failed' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        logger.info(`WebSocket disconnected: ${user.email} (${socket.id}) - ${reason}`);
      });

    } catch (error) {
      logger.error('WebSocket connection error:', error);
      socket.emit('error', { message: 'Connection failed' });
      socket.disconnect();
    }
  });
};

// Broadcast analytics update to all connected clients
const broadcastAnalyticsUpdate = (data) => {
  if (io) {
    io.to('analytics').emit('analytics_update', {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
};

// Broadcast to specific metric subscribers
const broadcastMetricUpdate = (metric, data) => {
  if (io) {
    io.to(`metric_${metric}`).emit('metric_update', {
      metric,
      data,
      timestamp: new Date().toISOString()
    });
  }
};

// Broadcast alert to admin users
const broadcastAlert = (alert) => {
  if (io) {
    io.to('role_admin').emit('new_alert', {
      ...alert,
      timestamp: new Date().toISOString()
    });
  }
};

// Broadcast system status update
const broadcastSystemUpdate = (status) => {
  if (io) {
    io.to('analytics').emit('system_update', {
      ...status,
      timestamp: new Date().toISOString()
    });
  }
};

// Send notification to specific user
const sendUserNotification = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });
  }
};

// Get real-time data
const getRealtimeData = async () => {
  // This would typically fetch from Redis or live system metrics
  return {
    activeUsers: Math.floor(Math.random() * 1000) + 500,
    requestsPerSecond: Math.floor(Math.random() * 100) + 50,
    responseTime: Math.floor(Math.random() * 200) + 100,
    errorRate: Math.random() * 2,
    systemLoad: Math.random() * 100,
    memoryUsage: Math.random() * 100,
    cpuUsage: Math.random() * 100,
    diskUsage: Math.random() * 100
  };
};

// Execute custom query (mock implementation)
const executeCustomQuery = async (query, parameters) => {
  // This would execute actual database queries
  // For now, return mock data
  return {
    query,
    parameters,
    result: {
      rows: [],
      count: 0,
      executionTime: Math.random() * 100
    }
  };
};

// Get connected users count
const getConnectedUsersCount = () => {
  return io ? io.engine.clientsCount : 0;
};

// Get connected users by role
const getConnectedUsersByRole = (role) => {
  if (!io) return 0;
  
  const sockets = Array.from(io.sockets.sockets.values());
  return sockets.filter(socket => socket.userRole === role).length;
};

module.exports = {
  setupWebSocket,
  broadcastAnalyticsUpdate,
  broadcastMetricUpdate,
  broadcastAlert,
  broadcastSystemUpdate,
  sendUserNotification,
  getConnectedUsersCount,
  getConnectedUsersByRole
};

