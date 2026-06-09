import { BusinessMetrics } from '../types';

export class WebflowDataService {
  private static instance: WebflowDataService;
  private ws: WebSocket | null = null;
  private callbacks: ((data: BusinessMetrics) => void)[] = [];

  static getInstance(): WebflowDataService {
    if (!WebflowDataService.instance) {
      WebflowDataService.instance = new WebflowDataService();
    }
    return WebflowDataService.instance;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket('ws://localhost:3001/ws');
    
    this.ws.onopen = () => {
      console.log('Webflow data service connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.callbacks.forEach(callback => callback(data));
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('Webflow data service disconnected');
      // Reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('Webflow data service error:', error);
    };
  }

  subscribe(callback: (data: BusinessMetrics) => void): void {
    this.callbacks.push(callback);
  }

  unsubscribe(callback: (data: BusinessMetrics) => void): void {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const webflowDataService = WebflowDataService.getInstance();
