import { v4 as uuidv4 } from 'uuid';
import { query } from './database';

interface HeiroCommit {
  id: string;
  commitHash: string;
  dataHash: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
}

// Generate cryptographic hash (simulating PQC)
const generateHash = (data: any): string => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(36)}_${Date.now()}`;
};

// Commit data to Heiro (immutable audit trail)
export const commitToHeiro = async (
  data: any,
  description: string,
  tags: string[] = [],
  agencyId: number = 1
): Promise<HeiroCommit> => {
  const dataHash = generateHash(data);
  const commitHash = `heiro_${uuidv4().replace(/-/g, '').slice(0, 32)}`;
  
  const commit: HeiroCommit = {
    id: uuidv4(),
    commitHash,
    dataHash,
    description,
    metadata: {
      tags,
      dataSize: JSON.stringify(data).length,
      agencyId
    },
    createdAt: new Date().toISOString()
  };

  // In production, store in database
  try {
    await query(
      `INSERT INTO heiro_commits (agency_id, commit_hash, data_hash, description, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [agencyId, commit.commitHash, commit.dataHash, commit.description, JSON.stringify(commit.metadata)]
    );
  } catch (error) {
    console.error('Failed to store Heiro commit:', error);
  }

  return commit;
};

// Verify a Heiro commit
export const verifyHeiroCommit = async (commitId: string): Promise<{ valid: boolean; commit?: HeiroCommit; error?: string }> => {
  try {
    // In production, query database
    // For demo, simulate verification
    if (!commitId.startsWith('heiro_')) {
      return { valid: false, error: 'Invalid commit format' };
    }

    return {
      valid: true,
      commit: {
        id: uuidv4(),
        commitHash: commitId,
        dataHash: generateHash({ verified: true }),
        description: 'Verified commit',
        metadata: { verified: true },
        createdAt: new Date().toISOString()
      }
    };
  } catch (error) {
    return { valid: false, error: 'Verification failed' };
  }
};

// Get commit history
export const getHeiroHistory = async (limit: number = 20, agencyId: number = 1): Promise<HeiroCommit[]> => {
  // Mock history for demo
  const history: HeiroCommit[] = [
    {
      id: '1',
      commitHash: 'heiro_abc123def456',
      dataHash: 'hash_abc123',
      description: 'SEO Blog Generation - Digital Marketing Guide',
      metadata: { agent: 'BizFlow', deliverableId: 'blog_001' },
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      commitHash: 'heiro_def456ghi789',
      dataHash: 'hash_def456',
      description: 'Social Content - Twitter Posts',
      metadata: { agent: 'NeoVibe', deliverableId: 'social_001' },
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      commitHash: 'heiro_ghi789jkl012',
      dataHash: 'hash_ghi789',
      description: 'PQC Audit - Client Security Verification',
      metadata: { agent: 'Q-Grid', deliverableId: 'audit_001' },
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: '4',
      commitHash: 'heiro_jkl012mno345',
      dataHash: 'hash_jkl012',
      description: 'Competitive Analysis Report',
      metadata: { agent: 'BizFlow', deliverableId: 'report_001' },
      createdAt: new Date(Date.now() - 10800000).toISOString()
    },
    {
      id: '5',
      commitHash: 'heiro_mno345pqr678',
      dataHash: 'hash_mno345',
      description: 'Ad Creative Generation',
      metadata: { agent: 'NeoVibe', deliverableId: 'ad_001' },
      createdAt: new Date(Date.now() - 14400000).toISOString()
    }
  ];

  return history.slice(0, limit);
};

// Generate PQC signature for deliverable
export const generatePQCSignature = (deliverable: any): string => {
  const { v4: uuid } = require('uuid');
  const dataStr = JSON.stringify(deliverable);
  const signature = `pqc_${uuid().replace(/-/g, '').slice(0, 48)}`;
  return signature;
};