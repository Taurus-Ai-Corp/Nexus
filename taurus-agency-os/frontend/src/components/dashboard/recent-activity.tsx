'use client';

import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  agentType: string;
  taskType: string;
  status: string;
  createdAt: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setActivities([
        { id: '1', agentType: 'BizFlow', taskType: 'SEO Blog Generation', status: 'completed', createdAt: new Date().toISOString() },
        { id: '2', agentType: 'NeoVibe', taskType: 'Social Content', status: 'completed', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', agentType: 'Q-Grid', taskType: 'PQC Audit', status: 'completed', createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: '4', agentType: 'BizFlow', taskType: 'Competitive Analysis', status: 'pending', createdAt: new Date(Date.now() - 10800000).toISOString() },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return <div className="text-gray-500">Loading activities...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr key={activity.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {activity.agentType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {activity.taskType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[activity.status]}`}>
                  {activity.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(activity.createdAt).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}