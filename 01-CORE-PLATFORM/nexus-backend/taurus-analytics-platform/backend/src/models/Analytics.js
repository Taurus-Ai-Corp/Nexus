const mongoose = require('mongoose');

// Revenue Analytics Schema
const revenueSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  growth: {
    type: Number,
    required: true
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    required: true
  },
  period: {
    type: String,
    enum: ['1h', '24h', '7d', '30d', '90d', '1y'],
    required: true
  },
  breakdown: {
    subscriptions: Number,
    oneTime: Number,
    refunds: Number,
    discounts: Number
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, {
  timestamps: true
});

// User Analytics Schema
const userSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  active: {
    type: Number,
    required: true,
    min: 0
  },
  new: {
    type: Number,
    required: true,
    min: 0
  },
  churned: {
    type: Number,
    required: true,
    min: 0
  },
  growth: {
    type: Number,
    required: true
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    required: true
  },
  period: {
    type: String,
    enum: ['1h', '24h', '7d', '30d', '90d', '1y'],
    required: true
  },
  demographics: {
    ageGroups: {
      '18-24': Number,
      '25-34': Number,
      '35-44': Number,
      '45-54': Number,
      '55+': Number
    },
    locations: [{
      country: String,
      count: Number
    }],
    devices: {
      mobile: Number,
      desktop: Number,
      tablet: Number
    }
  }
}, {
  timestamps: true
});

// Agent Performance Schema
const agentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  agentId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'error'],
    required: true
  },
  performance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  requests: {
    total: Number,
    successful: Number,
    failed: Number,
    avgResponseTime: Number
  },
  uptime: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  errors: [{
    type: String,
    message: String,
    timestamp: Date,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    }
  }],
  metrics: {
    cpu: Number,
    memory: Number,
    disk: Number,
    network: Number
  }
}, {
  timestamps: true
});

// System Health Schema
const systemSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  health: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  uptime: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  performance: {
    responseTime: Number,
    throughput: Number,
    errorRate: Number
  },
  resources: {
    cpu: {
      usage: Number,
      cores: Number,
      load: Number
    },
    memory: {
      used: Number,
      total: Number,
      percentage: Number
    },
    disk: {
      used: Number,
      total: Number,
      percentage: Number
    },
    network: {
      inbound: Number,
      outbound: Number,
      latency: Number
    }
  },
  services: [{
    name: String,
    status: {
      type: String,
      enum: ['healthy', 'degraded', 'down', 'maintenance']
    },
    responseTime: Number,
    uptime: Number
  }]
}, {
  timestamps: true
});

// Alert Schema
const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
    default: 'active'
  },
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acknowledgedAt: Date,
  resolvedAt: Date,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  tags: [String]
}, {
  timestamps: true
});

// Create indexes for performance
revenueSchema.index({ date: -1, period: 1 });
userSchema.index({ date: -1, period: 1 });
agentSchema.index({ date: -1, agentId: 1 });
systemSchema.index({ date: -1 });
alertSchema.index({ status: 1, type: 1, createdAt: -1 });

module.exports = {
  Revenue: mongoose.model('Revenue', revenueSchema),
  UserAnalytics: mongoose.model('UserAnalytics', userSchema),
  Agent: mongoose.model('Agent', agentSchema),
  SystemHealth: mongoose.model('SystemHealth', systemSchema),
  Alert: mongoose.model('Alert', alertSchema)
};

