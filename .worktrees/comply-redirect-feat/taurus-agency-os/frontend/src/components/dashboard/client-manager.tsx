'use client';

import { useState, useEffect } from 'react';

interface Client {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
  revenue: number;
  createdAt: string;
}

export function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/dashboard/clients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('taurus_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch clients');
      
      // Mock data for demo
      setClients([
        { id: 1, name: 'Acme Corp', email: 'contact@acme.com', plan: 'Growth', status: 'active', revenue: 599, createdAt: '2024-01-15' },
        { id: 2, name: 'TechStart Inc', email: 'hello@techstart.io', plan: 'Enterprise', status: 'active', revenue: 1199, createdAt: '2024-02-20' },
        { id: 3, name: 'Local Bakery', email: 'owner@bakery.com', plan: 'Foundation', status: 'active', revenue: 299, createdAt: '2024-03-05' },
        { id: 4, name: 'Green Valley Farms', email: 'info@greenvalley.ca', plan: 'Growth', status: 'pending', revenue: 0, createdAt: '2024-03-10' },
        { id: 5, name: 'Downtown Auto', email: 'service@downtownauto.com', plan: 'Foundation', status: 'inactive', revenue: 0, createdAt: '2023-12-01' },
      ]);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-gray-100 text-gray-800'
  };

  const planColors: Record<string, string> = {
    Foundation: 'bg-blue-100 text-blue-800',
    Growth: 'bg-purple-100 text-purple-800',
    Enterprise: 'bg-emerald-100 text-emerald-800'
  };

  if (loading) {
    return <div className="text-gray-500">Loading clients...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            👥 Client Management
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage your agency clients and subscriptions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Client
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${planColors[client.plan]}`}>
                    {client.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[client.status]}`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${client.revenue}/mo
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {client.createdAt}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 text-sm mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing {clients.length} clients • Total MRR: ${clients.reduce((sum, c) => sum + c.revenue, 0)}/mo
        </p>
      </div>
    </div>
  );
}