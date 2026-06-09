import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { initializePerformanceMonitoring } from './utils/performanceMonitor'
import './utils/linkValidator' // Auto-validates links in development
import './utils/testRunner' // Auto-runs comprehensive tests in development
import './index.css'
import App from './App.tsx'

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  initializePerformanceMonitoring();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
