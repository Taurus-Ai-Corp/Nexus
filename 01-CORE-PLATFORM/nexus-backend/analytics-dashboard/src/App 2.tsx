import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import WebflowDashboard from './components/WebflowDashboard';
import { useMetrics } from './hooks';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState<'react' | 'webflow'>('react');
  const { metrics, loading, error } = useMetrics();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="view-mode-selector">
        <button 
          className={viewMode === 'react' ? 'active' : ''}
          onClick={() => setViewMode('react')}
        >
          React Dashboard
        </button>
        <button 
          className={viewMode === 'webflow' ? 'active' : ''}
          onClick={() => setViewMode('webflow')}
        >
          Webflow Dashboard
        </button>
      </div>
      
      {viewMode === 'react' ? (
        <Dashboard metrics={metrics} />
      ) : (
        <WebflowDashboard data={metrics} />
      )}
    </div>
  );
}

export default App;
