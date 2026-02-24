import { io, Socket } from 'socket.io-client';
import { RealtimeUpdate, BusinessMetrics } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = process.env.REACT_APP_WS_URL || 'http://localhost:3001';
    
    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'connected' });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.emit('connection', { status: 'disconnected', reason });
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.emit('connection', { status: 'error', error: error.message });
      this.handleReconnect();
    });

    // Business metrics updates
    this.socket.on('metrics:update', (data: BusinessMetrics) => {
      this.emit('metrics:update', data);
    });

    // Real-time alerts
    this.socket.on('alert:new', (alert) => {
      this.emit('alert:new', alert);
    });

    // System status updates
    this.socket.on('system:status', (status) => {
      this.emit('system:status', status);
    });

    // Agent performance updates
    this.socket.on('agent:performance', (performance) => {
      this.emit('agent:performance', performance);
    });

    // Revenue updates
    this.socket.on('revenue:update', (revenue) => {
      this.emit('revenue:update', revenue);
    });

    // User activity updates
    this.socket.on('user:activity', (activity) => {
      this.emit('user:activity', activity);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('connection', { status: 'failed' });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Event subscription methods
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Public methods for specific subscriptions
  subscribeToMetrics(callback: (data: BusinessMetrics) => void) {
    this.on('metrics:update', callback);
  }

  subscribeToAlerts(callback: (alert: any) => void) {
    this.on('alert:new', callback);
  }

  subscribeToSystemStatus(callback: (status: any) => void) {
    this.on('system:status', callback);
  }

  subscribeToAgentPerformance(callback: (performance: any) => void) {
    this.on('agent:performance', callback);
  }

  subscribeToRevenue(callback: (revenue: any) => void) {
    this.on('revenue:update', callback);
  }

  subscribeToUserActivity(callback: (activity: any) => void) {
    this.on('user:activity', callback);
  }

  // Connection management
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  }

  // Manual reconnection
  reconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.reconnectAttempts = 0;
    this.connect();
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Send data to server
  emitToServer(event: string, data: any) {
    if (this.socket && this.isConnected()) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot send data');
    }
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();
export default websocketService;

