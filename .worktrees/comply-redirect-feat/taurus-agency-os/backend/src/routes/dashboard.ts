import { Router, Response } from 'express';
import { authenticateToken } from './auth';
import { getDashboardStats, getRecentActivity, getClientMetrics } from '../services/dashboard';

const router = Router();

// All dashboard routes require authentication
router.use(authenticateToken);

// Get dashboard statistics
router.get('/stats', async (req, res: Response) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get recent activity
router.get('/activity', async (req, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const activity = await getRecentActivity(limit);
    res.json(activity);
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Get client metrics
router.get('/clients', async (req, res: Response) => {
  try {
    const metrics = await getClientMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Client metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch client metrics' });
  }
});

// Get revenue data
router.get('/revenue', async (req, res: Response) => {
  try {
    const period = req.query.period as string || 'month';
    // Mock revenue data - in production, fetch from database
    const revenue = {
      current: 7188,
      previous: 5420,
      growth: 32.6,
      history: [
        { month: 'Jan', value: 4200 },
        { month: 'Feb', value: 4800 },
        { month: 'Mar', value: 5100 },
        { month: 'Apr', value: 5420 },
        { month: 'May', value: 6100 },
        { month: 'Jun', value: 7188 }
      ]
    };
    res.json(revenue);
  } catch (error) {
    console.error('Revenue fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

export default router;