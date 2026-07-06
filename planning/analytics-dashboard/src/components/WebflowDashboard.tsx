import React, { useEffect, useRef } from 'react';
import './WebflowDashboard.css';

interface WebflowDashboardProps {
  data?: any;
  onRefresh?: () => void;
}

const WebflowDashboard: React.FC<WebflowDashboardProps> = ({ data, onRefresh }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Load Webflow template in iframe
    if (iframeRef.current) {
      iframeRef.current.src = '/webflow/index.html';
    }
  }, []);

  useEffect(() => {
    // Update data in Webflow template
    if (data && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        iframe.contentWindow?.postMessage({
          type: 'UPDATE_DATA',
          data: data
        }, '*');
      };
    }
  }, [data]);

  return (
    <div className="webflow-dashboard">
      <iframe
        ref={iframeRef}
        title="Webflow Analytics Dashboard"
        className="webflow-iframe"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default WebflowDashboard;
