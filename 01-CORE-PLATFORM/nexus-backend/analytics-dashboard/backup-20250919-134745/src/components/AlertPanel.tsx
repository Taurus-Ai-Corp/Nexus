import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { formatRelativeTime, formatStatus } from '../utils/formatters';

interface AlertData {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  source: string;
  acknowledged?: boolean;
}

interface AlertPanelProps {
  alerts: AlertData[];
  onAcknowledge?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  maxAlerts?: number;
  className?: string;
}

const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  onAcknowledge,
  onDismiss,
  maxAlerts = 10,
  className = ''
}) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-danger-500 bg-danger-50 text-danger-900';
      case 'error':
        return 'border-danger-400 bg-danger-50 text-danger-800';
      case 'warning':
        return 'border-warning-400 bg-warning-50 text-warning-800';
      case 'info':
        return 'border-taurus-400 bg-taurus-50 text-taurus-800';
      default:
        return 'border-gray-400 bg-gray-50 text-gray-800';
    }
  };

  const getAlertIconColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-danger-500';
      case 'error':
        return 'text-danger-500';
      case 'warning':
        return 'text-warning-500';
      case 'info':
        return 'text-taurus-500';
      default:
        return 'text-gray-500';
    }
  };

  const displayedAlerts = alerts.slice(0, maxAlerts);
  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged && !alert.resolved).length;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            System Alerts
            {unacknowledgedCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                {unacknowledgedCount} new
              </span>
            )}
          </h3>
          <div className="text-sm text-gray-500">
            {alerts.length} total alerts
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {displayedAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-success-500" />
            <p>No alerts at this time</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {displayedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-l-4 ${getAlertColor(alert.type)} ${
                  alert.acknowledged ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 mr-3 ${getAlertIconColor(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {alert.message}
                      </p>
                      <div className="flex items-center space-x-2">
                        {!alert.acknowledged && onAcknowledge && (
                          <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="text-xs px-2 py-1 rounded bg-taurus-100 text-taurus-700 hover:bg-taurus-200 transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        {onDismiss && (
                          <button
                            onClick={() => onDismiss(alert.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <span className="capitalize">{alert.type}</span>
                      <span className="mx-2">•</span>
                      <span>{alert.source}</span>
                      <span className="mx-2">•</span>
                      <span>{formatRelativeTime(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {alerts.length > maxAlerts && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-sm text-taurus-600 hover:text-taurus-800 font-medium">
            View all {alerts.length} alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
