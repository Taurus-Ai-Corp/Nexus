'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function AgentExecutor() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const runAgent = async (agentType: string, endpoint: string, payload: any) => {
    setLoading(agentType);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('taurus_token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Agent execution failed');

      const data = await response.json();
      setResult(data);
      toast.success(`${agentType} completed!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Execution failed');
    } finally {
      setLoading(null);
    }
  };

  const agents = [
    {
      name: 'BizFlow SEO Agent',
      description: 'Generate AI-powered SEO blog posts',
      endpoint: '/api/agents/seo/blog',
      payload: { topic: 'Digital Marketing', keywords: ['SEO', 'marketing', 'agency'] }
    },
    {
      name: 'NeoVibe Social Agent',
      description: 'Generate social media content',
      endpoint: '/api/agents/neovibe/social',
      payload: { platform: 'twitter', count: 5 }
    },
    {
      name: 'Q-Grid PQC Audit',
      description: 'Generate post-quantum cryptographic audit trail',
      endpoint: '/api/agents/qgrid/pqc-audit',
      payload: { deliverableId: 'DEL-001', deliverableType: 'blog_post' }
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
            <button
              onClick={() => runAgent(agent.name, agent.endpoint, agent.payload)}
              disabled={loading === agent.name}
              className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading === agent.name ? 'Executing...' : 'Run Agent'}
            </button>
          </div>
        ))}
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Last Result:</h4>
          <pre className="text-sm text-gray-600 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}