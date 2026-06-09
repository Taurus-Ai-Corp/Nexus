import { Router, Response } from 'express';
import { authenticateToken } from './auth';
import { generateSEOBlog, generateSocialContent, generatePQCAudit } from '../services/agents';

const router = Router();

// All agent routes require authentication
router.use(authenticateToken);

// BizFlow SEO Agent - Generate blog posts
router.post('/seo/blog', async (req, res: Response) => {
  try {
    const { topic, keywords = [] } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const result = await generateSEOBlog(topic, keywords);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('SEO blog generation error:', error);
    res.status(500).json({ error: 'Failed to generate SEO blog' });
  }
});

// NeoVibe Social Agent - Generate social media content
router.post('/neovibe/social', async (req, res: Response) => {
  try {
    const { platform, count = 5 } = req.body;

    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }

    const result = await generateSocialContent(platform, count);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Social content generation error:', error);
    res.status(500).json({ error: 'Failed to generate social content' });
  }
});

// Q-Grid PQC Audit Agent - Generate audit trails
router.post('/qgrid/pqc-audit', async (req, res: Response) => {
  try {
    const { deliverableId, deliverableType } = req.body;

    if (!deliverableId || !deliverableType) {
      return res.status(400).json({ error: 'Deliverable ID and type are required' });
    }

    const result = await generatePQCAudit(deliverableId, deliverableType);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('PQC audit generation error:', error);
    res.status(500).json({ error: 'Failed to generate PQC audit' });
  }
});

// Batch execution - Run multiple agents at once
router.post('/batch', async (req, res: Response) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Tasks array is required' });
    }

    const results = await Promise.allSettled(
      tasks.map(async (task: { type: string; payload: any }) => {
        switch (task.type) {
          case 'seo':
            return generateSEOBlog(task.payload.topic, task.payload.keywords || []);
          case 'social':
            return generateSocialContent(task.payload.platform, task.payload.count || 5);
          case 'pqc':
            return generatePQCAudit(task.payload.deliverableId, task.payload.deliverableType);
          default:
            throw new Error(`Unknown task type: ${task.type}`);
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failed = results.filter(r => r.status === 'rejected').map(r => (r as any).reason);

    res.json({
      success: true,
      summary: {
        total: tasks.length,
        successful: successful.length,
        failed: failed.length
      },
      results: successful,
      errors: failed
    });
  } catch (error) {
    console.error('Batch execution error:', error);
    res.status(500).json({ error: 'Failed to execute batch tasks' });
  }
});

export default router;