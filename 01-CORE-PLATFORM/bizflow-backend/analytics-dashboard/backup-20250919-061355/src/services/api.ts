import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BusinessMetrics, ApiResponse, TimeRange, MetricFilter } from '../types';

class AnalyticsAPI {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Business Metrics API
  async getBusinessMetrics(filter?: MetricFilter): Promise<ApiResponse<BusinessMetrics>> {
    try {
      const response = await this.api.get('/metrics/business', {
        params: filter,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch business metrics');
    }
  }

  async getRevenueMetrics(timeRange: TimeRange): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/metrics/revenue', {
        params: timeRange,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch revenue metrics');
    }
  }

  async getUserMetrics(timeRange: TimeRange): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/metrics/users', {
        params: timeRange,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch user metrics');
    }
  }

  async getAgentMetrics(timeRange: TimeRange): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/metrics/agents', {
        params: timeRange,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch agent metrics');
    }
  }

  async getPerformanceMetrics(timeRange: TimeRange): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/metrics/performance', {
        params: timeRange,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch performance metrics');
    }
  }

  async getSystemMetrics(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/metrics/system');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch system metrics');
    }
  }

  // Real-time Data API
  async getRealtimeMetrics(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/metrics/realtime');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch real-time metrics');
    }
  }

  // Historical Data API
  async getHistoricalData(
    metric: string,
    timeRange: TimeRange,
    granularity: string = 'hour'
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get(`/metrics/historical/${metric}`, {
        params: { ...timeRange, granularity },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch historical data');
    }
  }

  // Alerts API
  async getAlerts(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/alerts');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch alerts');
    }
  }

  async acknowledgeAlert(alertId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post(`/alerts/${alertId}/acknowledge`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to acknowledge alert');
    }
  }

  // Export API
  async exportMetrics(
    format: 'csv' | 'json' | 'pdf',
    timeRange: TimeRange,
    metrics: string[]
  ): Promise<Blob> {
    try {
      const response = await this.api.post('/export', {
        format,
        timeRange,
        metrics,
      }, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to export metrics');
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Health check failed');
    }
  }

  private handleError(error: any, message: string): Error {
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || message;
      return new Error(`${errorMessage} (${error.response.status})`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error: No response from server');
    } else {
      // Something else happened
      return new Error(`${message}: ${error.message}`);
    }
  }
}

// Create singleton instance
export const analyticsAPI = new AnalyticsAPI();
export default analyticsAPI;
