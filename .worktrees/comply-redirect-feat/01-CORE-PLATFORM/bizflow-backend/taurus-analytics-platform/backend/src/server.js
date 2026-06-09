#!/usr/bin/env node
/**
 * 🏰 TAURUS AI CORP - Analytics Platform Backend Server
 * Complete full-stack analytics solution with real-time capabilities
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/users');
const agentRoutes = require('./routes/agents');
const systemRoutes = require('./routes/system');
const alertRoutes = require('./routes/alerts');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');
const { validateRequest } = require('./middleware/validation');

// Import services
const { connectDatabase } = require('./services/database');
const { initializeRedis } = require('./services/redis');
const { setupWebSocket } = require('./services/websocket');
const { startDataGenerator } = require('./services/dataGenerator');
const { startScheduler } = require('./services/scheduler');

// Import logger
const logger = require('./utils/logger');

class TaurusAnalyticsServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    this.port = process.env.PORT || 3001;
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  async initialize() {
    try {
      logger.info('🚀 Starting TAURUS Analytics Platform Backend...');
      
      // Connect to database
      await connectDatabase();
      logger.info('✅ Database connected');

      // Initialize Redis
      await initializeRedis();
      logger.info('✅ Redis connected');

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup WebSocket
      setupWebSocket(this.io);
      logger.info('✅ WebSocket server initialized');

      // Start data generator (for demo purposes)
      startDataGenerator(this.io);
      logger.info('✅ Data generator started');

      // Start scheduler
      startScheduler();
      logger.info('✅ Scheduler started');

      // Error handling
      this.app.use(errorHandler);

      // Start server
      this.server.listen(this.port, () => {
        logger.info(`🎉 TAURUS Analytics Backend running on port ${this.port}`);
        logger.info(`📊 Dashboard: http://localhost:${this.port}`);
        logger.info(`🔌 WebSocket: ws://localhost:${this.port}`);
        logger.info(`📚 API Docs: http://localhost:${this.port}/api/docs`);
      });

    } catch (error) {
      logger.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use('/api/', limiter);

    // Compression
    this.app.use(compression());

    // Logging
    this.app.use(morgan(this.isProduction ? 'combined' : 'dev'));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static files
    this.app.use('/uploads', express.static('uploads'));

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });
  }

  setupRoutes() {
    // API documentation
    this.app.get('/api/docs', (req, res) => {
      res.json({
        title: 'TAURUS Analytics Platform API',
        version: '1.0.0',
        description: 'Complete analytics platform with real-time capabilities',
        endpoints: {
          auth: '/api/auth',
          analytics: '/api/analytics',
          users: '/api/users',
          agents: '/api/agents',
          system: '/api/system',
          alerts: '/api/alerts'
        },
        websocket: 'ws://localhost:3001',
        documentation: 'https://github.com/taurus-ai/analytics-platform'
      });
    });

    // Public routes
    this.app.use('/api/auth', authRoutes);
    
    // Protected routes
    this.app.use('/api/analytics', authenticateToken, analyticsRoutes);
    this.app.use('/api/users', authenticateToken, userRoutes);
    this.app.use('/api/agents', authenticateToken, agentRoutes);
    this.app.use('/api/system', authenticateToken, systemRoutes);
    this.app.use('/api/alerts', authenticateToken, alertRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableRoutes: [
          'GET /health',
          'GET /api/docs',
          'POST /api/auth/login',
          'POST /api/auth/register',
          'GET /api/analytics/*',
          'GET /api/users/*',
          'GET /api/agents/*',
          'GET /api/system/*',
          'GET /api/alerts/*'
        ]
      });
    });
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const server = new TaurusAnalyticsServer();
server.initialize();

module.exports = server;
