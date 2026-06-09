import { Router, Response } from 'express';
import { authenticateToken } from './auth';
import { commitToHeiro, verifyHeiroCommit, getHeiroHistory } from '../services/heiro';

const router = Router();

// All Heiro routes require authentication
router.use(authenticateToken);

// Commit data to Heiro (immutable audit trail)
router.post('/commit', async (req, res: Response) => {
  try {
    const { data, description, tags = [] } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const result = await commitToHeiro(data, description, tags);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Heiro commit error:', error);
    res.status(500).json({ error: 'Failed to commit to Heiro' });
  }
});

// Verify a Heiro commit
router.get('/verify/:commitId', async (req, res: Response) => {
  try {
    const { commitId } = req.params;
    const result = await verifyHeiroCommit(commitId);
    res.json(result);
  } catch (error) {
    console.error('Heiro verification error:', error);
    res.status(500).json({ error: 'Failed to verify commit' });
  }
});

// Get commit history
router.get('/history', async (req, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const history = await getHeiroHistory(limit);
    res.json(history);
  } catch (error) {
    console.error('Heiro history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get audit trail for a specific deliverable
router.get('/audit/:deliverableId', async (req, res: Response) => {
  try {
    const { deliverableId } = req.params;
    const audit = await getHeiroHistory(100).then(all => 
      all.filter(h => h.metadata?.deliverableId === deliverableId)
    );
    res.json({ success: true, data: audit });
  } catch (error) {
    console.error('Audit fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch audit trail' });
  }
});

export default router;