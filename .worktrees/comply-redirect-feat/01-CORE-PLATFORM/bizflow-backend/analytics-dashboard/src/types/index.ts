// Business Metrics Types
export interface BusinessMetrics {
  revenue: RevenueMetrics;
  users: UserMetrics;
  agents: AgentMetrics;
  performance: PerformanceMetrics;
  system: SystemMetrics;
  timestamp: string;
}

export interface RevenueMetrics {
  total: number;
  monthly: number;
  daily: number;
  growth: number;
  currency: string;
  breakdown: RevenueBreakdown[];
}

export interface RevenueBreakdown {
  source: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface UserMetrics {
  total: number;
  active: number;
  new: number;
  retention: number;
  engagement: number;
  demographics: UserDemographics;
}

export interface UserDemographics {
  regions: RegionData[];
  ageGroups: AgeGroupData[];
  userTypes: UserTypeData[];
}

export interface RegionData {
  region: string;
  count: number;
  percentage: number;
}

export interface AgeGroupData {
  ageGroup: string;
  count: number;
  percentage: number;
}

export interface UserTypeData {
  type: string;
  count: number;
  percentage: number;
}

export interface AgentMetrics {
  total: number;
  active: number;
  performance: AgentPerformance[];
  utilization: number;
  efficiency: number;
}

export interface AgentPerformance {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  tasksCompleted: number;
  successRate: number;
  avgResponseTime: number;
  uptime: number;
}

export interface PerformanceMetrics {
  responseTime: number;
  errorRate: number;
  availability: number;
  latency: LatencyMetrics;
  throughput: ThroughputMetrics;
}

export interface LatencyMetrics {
  p50: number;
  p95: number;
  p99: number;
  average: number;
}

export interface ThroughputMetrics {
  requestsPerSecond: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  peakThroughput: number;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: NetworkMetrics;
  alerts: Alert[];
  health: 'healthy' | 'warning' | 'critical';
}

export interface NetworkMetrics {
  inbound: number;
  outbound: number;
  latency: number;
  packetLoss: number;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  source: string;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  name: string;
  data: ChartDataPoint[];
  color: string;
  type: 'line' | 'bar' | 'area';
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

// Dashboard Configuration
export interface DashboardConfig {
  refreshInterval: number;
  realTimeEnabled: boolean;
  theme: 'light' | 'dark';
  layout: DashboardLayout;
  widgets: WidgetConfig[];
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
}

export interface WidgetConfig {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'alert';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

export interface RealtimeUpdate {
  type: 'metrics' | 'alert' | 'system';
  data: any;
  timestamp: string;
}

// Filter and Query Types
export interface TimeRange {
  start: string;
  end: string;
  granularity: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

export interface MetricFilter {
  agents?: string[];
  regions?: string[];
  userTypes?: string[];
  timeRange: TimeRange;
}

// Error Types
export interface DashboardError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}
