interface PerformanceMetrics {
  // Core Web Vitals
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
  
  // Navigation timing
  domContentLoaded?: number;
  loadComplete?: number;
  
  // Resource timing
  resourceCount?: number;
  totalResourceSize?: number;
  
  // Memory (if available)
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  
  // Custom metrics
  timeToInteractive?: number;
  timestamp: number;
  url: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    timestamp: Date.now(),
    url: window.location.href
  };

  private observer?: PerformanceObserver;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Wait for page to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.collectMetrics();
      });
    } else {
      this.collectMetrics();
    }

    // Monitor performance entries
    if ('PerformanceObserver' in window) {
      this.setupPerformanceObserver();
    }

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
  }

  private setupPerformanceObserver() {
    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      // Observe different types of performance entries
      this.observer.observe({ entryTypes: ['navigation', 'paint', 'resource', 'measure'] });
    } catch (error) {
      console.warn('Performance Observer not fully supported:', error);
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'navigation':
        this.handleNavigationEntry(entry as PerformanceNavigationTiming);
        break;
      case 'paint':
        this.handlePaintEntry(entry as PerformancePaintTiming);
        break;
      case 'resource':
        this.handleResourceEntry(entry as PerformanceResourceTiming);
        break;
    }
  }

  private handleNavigationEntry(entry: PerformanceNavigationTiming) {
    this.metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.fetchStart;
    this.metrics.loadComplete = entry.loadEventEnd - entry.fetchStart;
    this.metrics.TTFB = entry.responseStart - entry.fetchStart;
  }

  private handlePaintEntry(entry: PerformancePaintTiming) {
    if (entry.name === 'first-contentful-paint') {
      this.metrics.FCP = entry.startTime;
    }
  }

  private handleResourceEntry(entry: PerformanceResourceTiming) {
    // Aggregate resource metrics
    if (!this.metrics.resourceCount) this.metrics.resourceCount = 0;
    if (!this.metrics.totalResourceSize) this.metrics.totalResourceSize = 0;
    
    this.metrics.resourceCount++;
    if (entry.transferSize) {
      this.metrics.totalResourceSize += entry.transferSize;
    }
  }

  private monitorCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    this.observeLCP();
    
    // FID (First Input Delay)
    this.observeFID();
    
    // CLS (Cumulative Layout Shift)
    this.observeCLS();
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.LCP = lastEntry.startTime;
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP observation not supported:', error);
      }
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-input') {
              this.metrics.FID = (entry as any).processingStart - entry.startTime;
            }
          }
        });
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID observation not supported:', error);
      }
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              this.metrics.CLS = clsValue;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS observation not supported:', error);
      }
    }
  }

  private collectMetrics() {
    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.usedJSHeapSize = memory.usedJSHeapSize;
      this.metrics.totalJSHeapSize = memory.totalJSHeapSize;
    }

    // Time to Interactive (simplified)
    this.calculateTimeToInteractive();
  }

  private calculateTimeToInteractive() {
    // Simplified TTI calculation
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.timeToInteractive = navigationEntry.domInteractive - navigationEntry.fetchStart;
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public logMetrics() {
    console.group('🚀 Performance Metrics');
    
    // Core Web Vitals
    console.group('Core Web Vitals');
    if (this.metrics.LCP) {
      const lcpRating = this.metrics.LCP <= 2500 ? '✅ Good' : this.metrics.LCP <= 4000 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`LCP: ${this.metrics.LCP.toFixed(2)}ms ${lcpRating}`);
    }
    if (this.metrics.FID) {
      const fidRating = this.metrics.FID <= 100 ? '✅ Good' : this.metrics.FID <= 300 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`FID: ${this.metrics.FID.toFixed(2)}ms ${fidRating}`);
    }
    if (this.metrics.CLS) {
      const clsRating = this.metrics.CLS <= 0.1 ? '✅ Good' : this.metrics.CLS <= 0.25 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`CLS: ${this.metrics.CLS.toFixed(3)} ${clsRating}`);
    }
    if (this.metrics.FCP) {
      const fcpRating = this.metrics.FCP <= 1800 ? '✅ Good' : this.metrics.FCP <= 3000 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`FCP: ${this.metrics.FCP.toFixed(2)}ms ${fcpRating}`);
    }
    console.groupEnd();

    // Navigation timing
    console.group('Navigation Timing');
    if (this.metrics.TTFB) {
      console.log(`TTFB: ${this.metrics.TTFB.toFixed(2)}ms`);
    }
    if (this.metrics.domContentLoaded) {
      console.log(`DOM Content Loaded: ${this.metrics.domContentLoaded.toFixed(2)}ms`);
    }
    if (this.metrics.loadComplete) {
      console.log(`Load Complete: ${this.metrics.loadComplete.toFixed(2)}ms`);
    }
    if (this.metrics.timeToInteractive) {
      console.log(`Time to Interactive: ${this.metrics.timeToInteractive.toFixed(2)}ms`);
    }
    console.groupEnd();

    // Resource metrics
    if (this.metrics.resourceCount) {
      console.group('Resources');
      console.log(`Resource Count: ${this.metrics.resourceCount}`);
      if (this.metrics.totalResourceSize) {
        console.log(`Total Resource Size: ${(this.metrics.totalResourceSize / 1024).toFixed(2)}KB`);
      }
      console.groupEnd();
    }

    // Memory usage
    if (this.metrics.usedJSHeapSize) {
      console.group('Memory Usage');
      console.log(`Used JS Heap: ${(this.metrics.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Total JS Heap: ${(this.metrics.totalJSHeapSize! / 1024 / 1024).toFixed(2)}MB`);
      console.groupEnd();
    }

    console.groupEnd();
  }

  public getPerformanceScore(): number {
    let score = 100;

    // Deduct points based on Core Web Vitals
    if (this.metrics.LCP) {
      if (this.metrics.LCP > 4000) score -= 20;
      else if (this.metrics.LCP > 2500) score -= 10;
    }

    if (this.metrics.FID) {
      if (this.metrics.FID > 300) score -= 20;
      else if (this.metrics.FID > 100) score -= 10;
    }

    if (this.metrics.CLS) {
      if (this.metrics.CLS > 0.25) score -= 20;
      else if (this.metrics.CLS > 0.1) score -= 10;
    }

    if (this.metrics.FCP) {
      if (this.metrics.FCP > 3000) score -= 15;
      else if (this.metrics.FCP > 1800) score -= 8;
    }

    return Math.max(0, Math.min(100, score));
  }

  public saveMetrics() {
    try {
      const existingMetrics = JSON.parse(localStorage.getItem('ai_atlas_performance') || '[]');
      existingMetrics.push(this.metrics);
      
      // Keep only last 10 entries
      if (existingMetrics.length > 10) {
        existingMetrics.splice(0, existingMetrics.length - 10);
      }
      
      localStorage.setItem('ai_atlas_performance', JSON.stringify(existingMetrics));
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  }

  public disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Global performance monitoring
let performanceMonitor: PerformanceMonitor;

export const initializePerformanceMonitoring = () => {
  performanceMonitor = new PerformanceMonitor();
  
  // Log metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logMetrics();
      performanceMonitor.saveMetrics();
    }, 1000);
  });

  // Add to window for manual access
  (window as any).performanceMonitor = performanceMonitor;
};

export const getPerformanceMetrics = () => {
  return performanceMonitor?.getMetrics();
};

export const getPerformanceScore = () => {
  return performanceMonitor?.getPerformanceScore() || 0;
};

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  document.addEventListener('DOMContentLoaded', initializePerformanceMonitoring);
}
