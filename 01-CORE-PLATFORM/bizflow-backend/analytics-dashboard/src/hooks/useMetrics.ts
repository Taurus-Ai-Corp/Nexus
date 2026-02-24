import { useState, useEffect, useCallback } from 'react';
import { BusinessMetrics, TimeRange, MetricFilter } from '../types';
import { analyticsAPI } from '../services/api';
import { websocketService } from '../services/websocket';

interface UseMetricsOptions {
  realTime?: boolean;
  refreshInterval?: number;
  filter?: MetricFilter;
}

interface UseMetricsReturn {
  data: BusinessMetrics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: string | null;
}

export const useMetrics = (options: UseMetricsOptions = {}): UseMetricsReturn => {
  const {
    realTime = true,
    refreshInterval = 30000, // 30 seconds
    filter
  } = options;

  const [data, setData] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsAPI.getBusinessMetrics(filter);
      
      if (response.success) {
        setData(response.data);
        setLastUpdated(new Date().toISOString());
      } else {
        setError(response.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Initial fetch
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Real-time updates via WebSocket
  useEffect(() => {
    if (!realTime) return;

    const handleMetricsUpdate = (newData: BusinessMetrics) => {
      setData(newData);
      setLastUpdated(new Date().toISOString());
    };

    websocketService.subscribeToMetrics(handleMetricsUpdate);

    return () => {
      websocketService.off('metrics:update', handleMetricsUpdate);
    };
  }, [realTime]);

  // Polling fallback
  useEffect(() => {
    if (!realTime || websocketService.isConnected()) return;

    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [realTime, refreshInterval, fetchMetrics]);

  return {
    data,
    loading,
    error,
    refresh: fetchMetrics,
    lastUpdated
  };
};

// Hook for specific metric types
export const useRevenueMetrics = (timeRange: TimeRange) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await analyticsAPI.getRevenueMetrics(timeRange);
        
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error || 'Failed to fetch revenue metrics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [timeRange]);

  return { data, loading, error };
};

export const useUserMetrics = (timeRange: TimeRange) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await analyticsAPI.getUserMetrics(timeRange);
        
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error || 'Failed to fetch user metrics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [timeRange]);

  return { data, loading, error };
};

export const useAgentMetrics = (timeRange: TimeRange) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await analyticsAPI.getAgentMetrics(timeRange);
        
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error || 'Failed to fetch agent metrics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [timeRange]);

  return { data, loading, error };
};

export const usePerformanceMetrics = (timeRange: TimeRange) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await analyticsAPI.getPerformanceMetrics(timeRange);
        
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error || 'Failed to fetch performance metrics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [timeRange]);

  return { data, loading, error };
};

export const useSystemMetrics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await analyticsAPI.getSystemMetrics();
        
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error || 'Failed to fetch system metrics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSystem();
    
    // Refresh system metrics every 10 seconds
    const interval = setInterval(fetchSystem, 10000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};

