const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { commitToHeiro } = require('./heiro'); // Adjust path as needed

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple in-memory storage for demo (use database in production)
const assessments = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main assessment endpoint
app.post('/assess', async (req, res) => {
  try {
    const { inventory } = req.body; // Expected: array of {algorithm, keySize, usage, location}
    
    if (!inventory || !Array.isArray(inventory)) {
      return res.status(400).json({ error: 'Invalid inventory format' });
    }

    // Process inventory - simplified logic
    const results = inventory.map(item => {
      const isPQCReady = item.algorithm.includes('ML-DSA') || item.algorithm.includes('ML-KEM');
      return {
        ...item,
        pqcReady: isPQCReady,
        recommendation: isPQCReady ? 'COMPLIANT' : 'PLAN_MIGRATION'
      };
    });

    // Calculate overall readiness score
    const readyCount = results.filter(r => r.pqcReady).length;
    const readinessScore = Math.round((readyCount / results.length) * 100);

    // Generate migration roadmap (simplified)
    const migrationRoadmap = generateMigrationRoadmap(results);

    // Create assessment record
    const assessmentId = uuidv4();
    const assessment = {
      id: assessmentId,
      timestamp: new Date().toISOString(),
      inventory,
      results,
      readinessScore,
      migrationRoadmap
    };

    assessments.set(assessmentId, assessment);

    // Commit to Heiro for immutable audit trail
    await commitToHeiro(
      {
        assessmentId,
        readinessScore,
        totalItems: inventory.length,
        pqcReadyCount: readyCount
      },
      `PQC Completion Assessment - ${assessmentId}`,
      ['pqc-assessment', 'compliance']
    );

    // Return results
    res.json({
      success: true,
      assessmentId,
      readinessScore,
      results,
      migrationRoadmap,
      heiroCommit: true
    });

  } catch (error) {
    console.error('Assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assessment by ID
app.get('/assess/:id', (req, res) => {
  const assessment = assessments.get(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }
  res.json(assessment);
});

// Simple migration roadmap generator
function generateMigrationRoadmap(results) {
  const nonPqcItems = results.filter(r => !r.pqcReady);
  
  if (nonPqcItems.length === 0) {
    return [
      { year: 2026, action: 'MAINTAIN', description: 'All systems already PQC-ready' }
    ];
  }

  // Group by usage type for prioritization
  const byUsage = {};
  nonPqcItems.forEach(item => {
    if (!byUsage[item.usage]) {
      byUsage[item.usage] = [];
    }
    byUsage[item.usage].push(item);
  });

  const roadmap = [];
  let currentYear = 2026;

  // Priority order: critical infrastructure first
  const priorityOrder = ['payment_processing', 'core_banking', 'customer_data', 'internal_tools'];

  priorityOrder.forEach(usage => {
    if (byUsage[usage]) {
      roadmap.push({
        year: currentYear,
        action: 'MIGRATE',
        usage: usage,
        items: byUsage[usage].map(i => ({ algorithm: i.algorithm, keySize: i.keySize })),
        description: `Migrate ${byUsage[usage].length} ${usage} systems to PQC`
      });
      currentYear++;
    }
  });

  // Handle remaining items
  const remaining = Object.keys(byUsage).filter(u => !priorityOrder.includes(u)).flatMap(u => byUsage[u]);
  if (remaining.length > 0) {
    roadmap.push({
      year: currentYear,
      action: 'MIGRATE',
      usage: 'remaining',
      items: remaining.map(i => ({ algorithm: i.algorithm, keySize: i.keySize })),
      description: `Migrate ${remaining.length} remaining systems to PQC`
    });
  }

  return roadmap;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;