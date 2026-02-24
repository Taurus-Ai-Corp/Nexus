import React, { useState, useEffect } from 'react';
import { useMetrics, useRealtime } from '../hooks';
import MetricCard from './MetricCard';
import Chart, { RevenueChart, UserGrowthChart, AgentPerformanceChart, SystemHealthChart } from './Chart';
import AlertPanel from './AlertPanel';
import { 
  DollarSign, 
  Users, 
  Bot, 
  Activity, 
  Server, 
  TrendingUp,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    end: new Date().toISOString(),
    granularity: 'day' as const
  });

  const { data: metrics, loading, error, refresh, lastUpdated } = useMetrics({
    realTime: true,
    refreshInterval: 30000,
    filter: { timeRange }
  });

  const { 
    data: realtimeData, 
    connectionStatus, 
    isConnected,
    acknowledgeAlert 
  } = useRealtime({
    enableMetrics: true,
    enableAlerts: true,
    enableSystemStatus: true,
    enableAgentPerformance: true,
    enableRevenue: true,
    enableUserActivity: true
  });

  // Mock data for demonstration
  const mockRevenueData = [
    { date: '2024-01-01', revenue: 12000 },
    { date: '2024-01-02', revenue: 15000 },
    { date: '2024-01-03', revenue: 18000 },
    { date: '2024-01-04', revenue: 16000 },
    { date: '2024-01-05', revenue: 20000 },
    { date: '2024-01-06', revenue: 22000 },
    { date: '2024-01-07', revenue: 25000 },
  ];

  const mockUserData = [
    { date: '2024-01-01', users: 150 },
    { date: '2024-01-02', users: 175 },
    { date: '2024-01-03', users: 200 },
    { date: '2024-01-04', users: 225 },
    { date: '2024-01-05', users: 250 },
    { date: '2024-01-06', users: 275 },
    { date: '2024-01-07', users: 300 },
  ];

  const mockAgentData = [
    { agent: 'Claude Code', performance: 95 },
    { agent: 'GPT Assistant', performance: 88 },
    { agent: 'Gemini Pro', performance: 92 },
    { agent: 'Custom Agent', performance: 85 },
  ];

  const mockSystemHealthData = [
    { name: 'Healthy', value: 75 },
    { name: 'Warning', value: 20 },
    { name: 'Critical', value: 5 },
  ];

  const mockAlerts = [
    {
      id: '1',
      type: 'warning' as const,
      message: 'High CPU usage detected on server-01',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      resolved: false,
      source: 'System Monitor',
      acknowledged: false
    },
    {
      id: '2',
      type: 'info' as const,
      message: 'Scheduled maintenance completed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      resolved: true,
      source: 'Maintenance Bot',
      acknowledged: true
    },
    {
      id: '3',
      type: 'error' as const,
      message: 'API rate limit exceeded for Perplexity service',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      resolved: false,
      source: 'API Monitor',
      acknowledged: false
    }
  ];

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-taurus-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-taurus-600 text-white rounded-lg hover:bg-taurus-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TAURUS AI CORP</h1>
              <span className="ml-4 text-sm text-gray-500">Analytics Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="w-5 h-5 text-success-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-danger-500" />
                )}
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {/* Last Updated */}
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                </div>
              )}
              
              {/* Refresh Button */}
              <button
                onClick={refresh}
                className="px-3 py-1 text-sm bg-taurus-100 text-taurus-700 rounded hover:bg-taurus-200 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={metrics?.revenue?.total || 125000}
            type="currency"
            trend={12.5}
            subtitle="This month"
            icon={<DollarSign className="w-6 h-6" />}
            color="success"
          />
          
          <MetricCard
            title="Active Users"
            value={metrics?.users?.active || 1250}
            type="number"
            trend={8.2}
            subtitle="Currently online"
            icon={<Users className="w-6 h-6" />}
            color="primary"
          />
          
          <MetricCard
            title="AI Agents"
            value={metrics?.agents?.total || 15}
            type="number"
            trend={0}
            subtitle="Deployed agents"
            icon={<Bot className="w-6 h-6" />}
            color="warning"
          />
          
          <MetricCard
            title="System Health"
            value={metrics?.system?.health === 'healthy' ? 98 : 85}
            type="percentage"
            trend={2.1}
            subtitle="Uptime"
            icon={<Activity className="w-6 h-6" />}
            color={metrics?.system?.health === 'healthy' ? 'success' : 'warning'}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart data={mockRevenueData} height={300} />
          <UserGrowthChart data={mockUserData} height={300} />
        </div>

        {/* Performance and Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AgentPerformanceChart data={mockAgentData} height={300} />
          <SystemHealthChart data={mockSystemHealthData} height={300} />
        </div>

        {/* Alerts Panel */}
        <div className="mb-8">
          <AlertPanel
            alerts={mockAlerts}
            onAcknowledge={acknowledgeAlert}
            maxAlerts={5}
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Response Time"
            value={metrics?.performance?.responseTime || 245}
            type="number"
            subtitle="Average (ms)"
            icon={<Activity className="w-6 h-6" />}
            color="primary"
            size="sm"
          />
          
          <MetricCard
            title="Throughput"
            value={metrics?.performance?.throughput?.requestsPerMinute || 1250}
            type="number"
            subtitle="Requests/min"
            icon={<TrendingUp className="w-6 h-6" />}
            color="success"
            size="sm"
          />
          
          <MetricCard
            title="Error Rate"
            value={metrics?.performance?.errorRate || 0.5}
            type="percentage"
            subtitle="Last 24h"
            icon={<AlertCircle className="w-6 h-6" />}
            color="danger"
            size="sm"
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
