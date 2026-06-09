import { query } from './database';

interface DashboardStats {
  clients: number;
  activeSubscriptions: number;
  jobsLast24h: number;
  monthlyRevenue: number;
}

interface Activity {
  id: string;
  agentType: string;
  taskType: string;
  status: string;
  createdAt: string;
}

interface ClientMetrics {
  total: number;
  active: number;
  newThisMonth: number;
  churnRate: number;
}

// Get dashboard statistics (using mock data for demo)
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // In production, query from database
  // For demo, return realistic mock data
  return {
    clients: 12,
    activeSubscriptions: 8,
    jobsLast24h: 24,
    monthlyRevenue: 7188
  };
};

// Get recent activity
export const getRecentActivity = async (limit: number = 10): Promise<Activity[]> => {
  // In production, query from database
  // For demo, return mock data
  const activities: Activity[] = [
    { id: '1', agentType: 'BizFlow', taskType: 'SEO Blog Generation', status: 'completed', createdAt: new Date().toISOString() },
    { id: '2', agentType: 'NeoVibe', taskType: 'Social Content', status: 'completed', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', agentType: 'Q-Grid', taskType: 'PQC Audit', status: 'completed', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: '4', agentType: 'BizFlow', taskType: 'Competitive Analysis', status: 'pending', createdAt: new Date(Date.now() - 10800000).toISOString() },
    { id: '5', agentType: 'NeoVibe', taskType: 'Ad Creative Generation', status: 'completed', createdAt: new Date(Date.now() - 14400000).toISOString() },
    { id: '6', agentType: 'BizFlow', taskType: 'Keyword Research', status: 'completed', createdAt: new Date(Date.now() - 18000000).toISOString() },
    { id: '7', agentType: 'Q-Grid', taskType: 'Security Audit', status: 'failed', createdAt: new Date(Date.now() - 21600000).toISOString() },
    { id: '8', agentType: 'NeoVibe', taskType: 'Email Newsletter', status: 'completed', createdAt: new Date(Date.now() - 25200000).toISOString() }
  ];
  
  return activities.slice(0, limit);
};

// Get client metrics
export const getClientMetrics = async (): Promise<ClientMetrics> => {
  return {
    total: 12,
    active: 8,
    newThisMonth: 2,
    churnRate: 5.2
  };
};

// Helper to log activity
export const logActivity = async (
  agentType: string,
  taskType: string,
  status: string,
  agencyId: number = 1,
  clientId?: number
) => {
  try {
    await query(
      `INSERT INTO agent_tasks (agency_id, client_id, agent_type, task_type, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [agencyId, clientId || null, agentType, taskType, status]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};