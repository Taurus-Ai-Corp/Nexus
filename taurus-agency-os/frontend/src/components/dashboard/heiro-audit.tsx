'use client';

import { useState, useEffect } from 'react';

interface HeiroCommit {
  id: string;
  commitHash: string;
  dataHash: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export function HeiroAuditTrail() {
  const [commits, setCommits] = useState<HeiroCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/heiro/history?limit=20', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('taurus_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch history');

      const data = await response.json();
      setCommits(data);
    } catch (err) {
      console.error('Error fetching Heiro history:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyCommit = async (commitHash: string) => {
    setVerifying(commitHash);
    try {
      const response = await fetch(`/api/heiro/verify/${commitHash}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('taurus_token')}`
        }
      });

      if (!response.ok) throw new Error('Verification failed');

      const data = await response.json();
      alert(data.valid ? '✅ Commit verified successfully!' : '⚠️ Verification failed');
    } catch (err) {
      alert('❌ Verification failed');
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading audit trail...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          🔐 Heiro Audit Trail
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Immutable verification of all AI-generated deliverables
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {commits.map((commit) => (
          <div key={commit.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {commit.description}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {commit.commitHash.slice(0, 20)}...
                  </span>
                  <span>{new Date(commit.createdAt).toLocaleString()}</span>
                   {commit.metadata?.agent ? (
                     <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                       {String(commit.metadata.agent)}
                     </span>
                   ) : null}
                </div>
              </div>
              <button
                onClick={() => verifyCommit(commit.commitHash)}
                disabled={verifying === commit.commitHash}
                className="ml-4 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {verifying === commit.commitHash ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {commits.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No audit trail entries yet. Run some AI agents to see results here.
        </div>
      )}
    </div>
  );
}