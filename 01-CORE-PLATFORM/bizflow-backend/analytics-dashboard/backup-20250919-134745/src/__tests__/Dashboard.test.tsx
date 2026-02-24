import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/Dashboard';

// Mock the hooks
jest.mock('../hooks', () => ({
  useMetrics: () => ({
    data: {
      revenue: { total: 125000 },
      users: { active: 1250 },
      agents: { total: 15 },
      system: { health: 'healthy' },
      performance: {
        responseTime: 245,
        throughput: 1250,
        errorRate: 0.5
      }
    },
    loading: false,
    error: null,
    refresh: jest.fn(),
    lastUpdated: new Date().toISOString()
  }),
  useRealtime: () => ({
    data: {
      metrics: null,
      alerts: [],
      systemStatus: null,
      agentPerformance: [],
      revenue: null,
      userActivity: null
    },
    connectionStatus: {
      connected: true,
      reconnectAttempts: 0,
      lastConnected: new Date().toISOString()
    },
    isConnected: true,
    acknowledgeAlert: jest.fn()
  })
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  DollarSign: () => <div data-testid="dollar-icon">$</div>,
  Users: () => <div data-testid="users-icon">👥</div>,
  Bot: () => <div data-testid="bot-icon">🤖</div>,
  Activity: () => <div data-testid="activity-icon">📊</div>,
  Server: () => <div data-testid="server-icon">🖥️</div>,
  TrendingUp: () => <div data-testid="trending-up-icon">📈</div>,
  AlertCircle: () => <div data-testid="alert-icon">⚠️</div>,
  Wifi: () => <div data-testid="wifi-icon">📶</div>,
  WifiOff: () => <div data-testid="wifi-off-icon">📵</div>
}));

// Mock recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Area: () => <div data-testid="area" />,
  Bar: () => <div data-testid="bar" />,
  Pie: () => <div data-testid="pie" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Cell: () => <div data-testid="cell" />
}));

describe('Dashboard', () => {
  it('renders dashboard header', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('TAURUS AI CORP')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('renders connection status', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByTestId('wifi-icon')).toBeInTheDocument();
  });

  it('renders key metrics cards', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('AI Agents')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();
  });

  it('renders metric values correctly', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('$125,000')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
  });

  it('renders charts', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Revenue Over Time')).toBeInTheDocument();
    expect(screen.getByText('User Growth')).toBeInTheDocument();
    expect(screen.getByText('Agent Performance')).toBeInTheDocument();
    expect(screen.getByText('System Health Distribution')).toBeInTheDocument();
  });

  it('renders additional metrics', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Response Time')).toBeInTheDocument();
    expect(screen.getByText('Throughput')).toBeInTheDocument();
    expect(screen.getByText('Error Rate')).toBeInTheDocument();
  });

  it('renders refresh button', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('renders alerts panel', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('System Alerts')).toBeInTheDocument();
  });

  it('shows loading state when loading', () => {
    // Mock loading state
    jest.doMock('../src/hooks', () => ({
      useMetrics: () => ({
        data: null,
        loading: true,
        error: null,
        refresh: jest.fn(),
        lastUpdated: null
      }),
      useRealtime: () => ({
        data: { metrics: null, alerts: [], systemStatus: null, agentPerformance: [], revenue: null, userActivity: null },
        connectionStatus: { connected: false, reconnectAttempts: 0, lastConnected: null },
        isConnected: false,
        acknowledgeAlert: jest.fn()
      })
    }));

    render(<Dashboard />);
    
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('shows error state when error occurs', () => {
    // Mock error state
    jest.doMock('../src/hooks', () => ({
      useMetrics: () => ({
        data: null,
        loading: false,
        error: 'Failed to load data',
        refresh: jest.fn(),
        lastUpdated: null
      }),
      useRealtime: () => ({
        data: { metrics: null, alerts: [], systemStatus: null, agentPerformance: [], revenue: null, userActivity: null },
        connectionStatus: { connected: false, reconnectAttempts: 0, lastConnected: null },
        isConnected: false,
        acknowledgeAlert: jest.fn()
      })
    }));

    render(<Dashboard />);
    
    expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('renders with correct grid layout', () => {
    const { container } = render(<Dashboard />);
    
    // Check for grid classes
    expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
    expect(container.querySelector('.lg\\:grid-cols-4')).toBeInTheDocument();
  });
});
