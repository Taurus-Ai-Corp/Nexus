'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard } from './ui/stats-card';
import { AgentExecutor } from './dashboard/agent-executor';
import { RecentActivity } from './dashboard/recent-activity';
import { HeiroAuditTrail } from './dashboard/heiro-audit';
import { ClientManager } from './dashboard/client-manager';

type Tab = 'overview' | 'agents' | 'clients' | 'audit';

export function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    activeSubscriptions: 0,
    jobsLast24h: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('taurus_token');
    if (!token) {
      router.push('/');
      return;
    }

    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('taurus_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('taurus_token');
    localStorage.removeItem('taurus_user');
    router.push('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'agents', label: 'AI Agents', icon: '🤖' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'audit', label: 'Audit Trail', icon: '🔐' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-b-blue-600 h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                TAURUS Agency OS
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Your agency's operating system
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Row */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard 
                title="Active Clients" 
                value={stats.clients} 
                trend="+12%" 
                icon="Users"
                color="blue"
              />
              <StatsCard 
                title="Active Subscriptions" 
                value={stats.activeSubscriptions} 
                trend="+8%" 
                icon="CreditCard"
                color="green"
              />
              <StatsCard 
                title="Jobs (24h)" 
                value={stats.jobsLast24h} 
                trend="+24%" 
                icon="Zap"
                color="purple"
              />
              <StatsCard 
                title="Monthly Revenue" 
                value={`$${stats.monthlyRevenue.toLocaleString()}`} 
                trend="+18%" 
                icon="DollarSign"
                color="emerald"
              />
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <RecentActivity />
            </div>
          </>
        )}

        {/* AI Agents Tab */}
        {activeTab === 'agents' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🤖 AI Agent Execution
            </h2>
            <p className="text-gray-600 mb-6">
              Run AI agents to generate content, perform audits, and automate your agency operations.
            </p>
            <AgentExecutor />
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              👥 Client Management
            </h2>
            <p className="text-gray-600 mb-6">
              Manage your agency clients, subscriptions, and billing.
            </p>
            <ClientManager />
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🔐 Heiro Audit Trail
            </h2>
            <p className="text-gray-600 mb-6">
              View immutable verification records of all AI-generated deliverables.
            </p>
            <HeiroAuditTrail />
          </div>
        )}
      </main>
    </div>
  );
}