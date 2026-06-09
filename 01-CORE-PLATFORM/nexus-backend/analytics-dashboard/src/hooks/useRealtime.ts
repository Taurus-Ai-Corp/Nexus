import { useState, useEffect, useCallback } from 'react';
import { websocketService } from '../services/websocket';

interface RealtimeData {
  metrics: any;
  alerts: any[];
  systemStatus: any;
  agentPerformance: any[];
  revenue: any;
  userActivity: any;
}

interface UseRealtimeOptions {
  enableMetrics?: boolean;
  enableAlerts?: boolean;
  enableSystemStatus?: boolean;
  enableAgentPerformance?: boolean;
  enableRevenue?: boolean;
  enableUserActivity?: boolean;
}

export const useRealtime = (options: UseRealtimeOptions = {}) => {
  const {
    enableMetrics = true,
    enableAlerts = true,
    enableSystemStatus = true,
    enableAgentPerformance = true,
    enableRevenue = true,
    enableUserActivity = true
  } = options;

  const [data, setData] = useState<RealtimeData>({
    metrics: null,
    alerts: [],
    systemStatus: null,
    agentPerformance: [],
    revenue: null,
    userActivity: null
  });

  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    reconnectAttempts: 0,
    lastConnected: null as string | null
  });

  const [error, setError] = useState<string | null>(null);

  // Update connection status
  const updateConnectionStatus = useCallback((status: any) => {
    setConnectionStatus(prev => ({
      ...prev,
      connected: status.status === 'connected',
      reconnectAttempts: websocketService.getConnectionStatus().reconnectAttempts,
      lastConnected: status.status === 'connected' ? new Date().toISOString() : prev.lastConnected
    }));
  }, []);

  // Handle metrics updates
  const handleMetricsUpdate = useCallback((metrics: any) => {
    setData(prev => ({ ...prev, metrics }));
  }, []);

  // Handle new alerts
  const handleNewAlert = useCallback((alert: any) => {
    setData(prev => ({
      ...prev,
      alerts: [alert, ...prev.alerts].slice(0, 50) // Keep last 50 alerts
    }));
  }, []);

  // Handle system status updates
  const handleSystemStatus = useCallback((status: any) => {
    setData(prev => ({ ...prev, systemStatus: status }));
  }, []);

  // Handle agent performance updates
  const handleAgentPerformance = useCallback((performance: any) => {
    setData(prev => ({
      ...prev,
      agentPerformance: Array.isArray(performance) ? performance : [performance]
    }));
  }, []);

  // Handle revenue updates
  const handleRevenueUpdate = useCallback((revenue: any) => {
    setData(prev => ({ ...prev, revenue }));
  }, []);

  // Handle user activity updates
  const handleUserActivity = useCallback((activity: any) => {
    setData(prev => ({ ...prev, userActivity: activity }));
  }, []);

  // Setup WebSocket listeners
  useEffect(() => {
    // Connection status listener
    websocketService.on('connection', updateConnectionStatus);

    // Metrics listener
    if (enableMetrics) {
      websocketService.subscribeToMetrics(handleMetricsUpdate);
    }

    // Alerts listener
    if (enableAlerts) {
      websocketService.subscribeToAlerts(handleNewAlert);
    }

    // System status listener
    if (enableSystemStatus) {
      websocketService.subscribeToSystemStatus(handleSystemStatus);
    }

    // Agent performance listener
    if (enableAgentPerformance) {
      websocketService.subscribeToAgentPerformance(handleAgentPerformance);
    }

    // Revenue listener
    if (enableRevenue) {
      websocketService.subscribeToRevenue(handleRevenueUpdate);
    }

    // User activity listener
    if (enableUserActivity) {
      websocketService.subscribeToUserActivity(handleUserActivity);
    }

    // Initial connection status
    const initialStatus = websocketService.getConnectionStatus();
    setConnectionStatus({
      ...initialStatus,
      lastConnected: initialStatus.connected ? new Date().toISOString() : null
    });

    return () => {
      // Cleanup listeners
      websocketService.off('connection', updateConnectionStatus);
      websocketService.off('metrics:update', handleMetricsUpdate);
      websocketService.off('alert:new', handleNewAlert);
      websocketService.off('system:status', handleSystemStatus);
      websocketService.off('agent:performance', handleAgentPerformance);
      websocketService.off('revenue:update', handleRevenueUpdate);
      websocketService.off('user:activity', handleUserActivity);
    };
  }, [
    enableMetrics,
    enableAlerts,
    enableSystemStatus,
    enableAgentPerformance,
    enableRevenue,
    enableUserActivity,
    updateConnectionStatus,
    handleMetricsUpdate,
    handleNewAlert,
    handleSystemStatus,
    handleAgentPerformance,
    handleRevenueUpdate,
    handleUserActivity
  ]);

  // Manual reconnection
  const reconnect = useCallback(() => {
    websocketService.reconnect();
  }, []);

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setData(prev => ({ ...prev, alerts: [] }));
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    }));
  }, []);

  return {
    data,
    connectionStatus,
    error,
    reconnect,
    clearAlerts,
    acknowledgeAlert,
    isConnected: connectionStatus.connected
  };
};

// Hook for specific real-time data
export const useRealtimeMetrics = () => {
  const { data, connectionStatus, isConnected } = useRealtime({
    enableMetrics: true,
    enableAlerts: false,
    enableSystemStatus: false,
    enableAgentPerformance: false,
    enableRevenue: false,
    enableUserActivity: false
  });

  return {
    metrics: data.metrics,
    isConnected,
    connectionStatus
  };
};

export const useRealtimeAlerts = () => {
  const { data, connectionStatus, isConnected, clearAlerts, acknowledgeAlert } = useRealtime({
    enableMetrics: false,
    enableAlerts: true,
    enableSystemStatus: false,
    enableAgentPerformance: false,
    enableRevenue: false,
    enableUserActivity: false
  });

  return {
    alerts: data.alerts,
    isConnected,
    connectionStatus,
    clearAlerts,
    acknowledgeAlert
  };
};

export const useRealtimeSystemStatus = () => {
  const { data, connectionStatus, isConnected } = useRealtime({
    enableMetrics: false,
    enableAlerts: false,
    enableSystemStatus: true,
    enableAgentPerformance: false,
    enableRevenue: false,
    enableUserActivity: false
  });

  return {
    systemStatus: data.systemStatus,
    isConnected,
    connectionStatus
  };
};
