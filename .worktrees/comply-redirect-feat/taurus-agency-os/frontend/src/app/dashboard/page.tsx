'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { StatsCard } from '../../components/ui/stats-card';
import { AgentExecutor } from '../../components/dashboard/agent-executor';
import { RecentActivity } from '../../components/dashboard/recent-activity';
import { HeiroAuditTrail } from '../../components/dashboard/heiro-audit';
import { ClientManager } from '../../components/dashboard/client-manager';

type Tab = 'overview' | 'agents' | 'clients' | 'audit';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [stats, setStats] = useState({
    clients: 0,
    activeSubscriptions: 0,
    jobsLast24h: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = '/';
      return;
    }
    
    if (isSignedIn) {
      fetchDashboardStats();
    }
  }, [isLoaded, isSignedIn]);

  const fetchDashboardStats = async () => {
    try {
      // Get Clerk token for API calls
      const token = await getToken();
      
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Use mock data on error
      setStats({
        clients: 12,
        activeSubscriptions: 8,
        jobsLast24h: 24,
        monthlyRevenue: 7188
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'agents', label: 'AI Agents', icon: '🤖' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'audit', label: 'Audit Trail', icon: '🔐' }
  ];

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-b-blue-600 h-12 w-12"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
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
                Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
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