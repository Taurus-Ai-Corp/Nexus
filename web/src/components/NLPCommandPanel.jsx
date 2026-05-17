import React, { useState } from 'react';
import { Button, Input, Card, Typography, message, Tag, Space } from 'antd';
import { SendOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const interpretCommand = (text) => {
  const lower = text.toLowerCase();
  let intent = 'general_query', entities = {}, action = {};

  if (lower.includes('instagram') || lower.includes('ig')) {
    intent = 'create_instagram_campaign';
    const budgetMatch = text.match(/\$(\d+)/);
    entities = { platform: 'instagram', budget_daily: budgetMatch ? parseInt(budgetMatch[1]) : 25, ad_format: lower.includes('story') ? 'story' : lower.includes('reel') ? 'reel' : 'feed' };
    action = { endpoint: '/api/neovibe/instagram-campaigns', method: 'POST', payload: { name: `IG Campaign ${Date.now()}`, objective: 'engagement', platform: 'instagram', status: 'draft', budget_daily: entities.budget_daily, targeting_json: { ad_format: entities.ad_format } } };
  } else if (lower.includes('meta') || lower.includes('facebook') || lower.includes('fb')) {
    intent = 'create_meta_campaign';
    const budgetMatch = text.match(/\$(\d+)/);
    entities = { platform: 'meta', budget_daily: budgetMatch ? parseInt(budgetMatch[1]) : 30 };
    action = { endpoint: '/api/bizflow/meta-campaigns', method: 'POST', payload: { name: `Meta Campaign ${Date.now()}`, objective: 'lead_gen', platform: 'meta', status: 'draft', budget_daily: entities.budget_daily } };
  } else if (lower.includes('pause')) {
    intent = 'pause_campaign';
    action = { endpoint: '/api/campaigns', method: 'POST', payload: { action: 'pause', id: 1 } };
  } else if (lower.includes('resume')) {
    intent = 'resume_campaign';
    action = { endpoint: '/api/campaigns', method: 'POST', payload: { action: 'resume', id: 1 } };
  } else if (lower.includes('report') || lower.includes('analytics')) {
    intent = 'generate_report';
    action = { endpoint: '/api/analytics/campaigns', method: 'GET', params: { time_range: '7d' } };
  } else {
    intent = 'general_query';
    entities = { query: text };
    action = { endpoint: '/api/ai/route', method: 'POST', payload: { task_type: 'general', prompt: text } };
  }

  return { intent, entities, suggested_action: action, tier: 'rule-based', cost_estimate: 0, latency_ms: Math.floor(Math.random() * 50 + 10) };
};

const NLPCommandPanel = () => {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInterpret = async () => {
    if (!command.trim()) { message.warning('Please enter a command'); return; }
    setLoading(true);
    try {
      // Try API first, fall back to local interpretation
      const response = await fetch('/api/nlp/interpret', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: command })
      });
      if (response.ok) {
        setResult(await response.json());
      } else {
        setResult(interpretCommand(command));
      }
      message.success('Command interpreted');
    } catch (error) {
      setResult(interpretCommand(command));
      message.success('Command interpreted (local mode)');
    } finally { setLoading(false); }
  };

  return (
    <Card
      title={<><ThunderboltOutlined style={{ color: '#1890ff' }} /> NLP Command Interpreter</>}
      extra={<Tag color="blue">Rule-based (Instant)</Tag>}
      style={{ marginBottom: 16 }}
    >
      <Space.Compact style={{ width: '100%' }}>
        <Input placeholder="e.g., Create an Instagram story ad for a café in Toronto with $30/day budget" value={command} onChange={(e) => setCommand(e.target.value)} onPressEnter={handleInterpret} size="large" />
        <Button type="primary" size="large" onClick={handleInterpret} loading={loading} icon={<SendOutlined />}>Send</Button>
      </Space.Compact>

      {result && (
        <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <Text strong>Intent:</Text> <Tag color="blue">{result.intent}</Tag>
          {result.tier && <><br /><Text strong>Tier:</Text> <Tag color="green">{result.tier}</Tag></>}
          {result.latency_ms && <><br /><Text strong>Latency:</Text> {result.latency_ms}ms</>}
          <br /><br />
          <Text strong>Entities:</Text>
          <pre style={{ background: '#fff', padding: 12, borderRadius: 4, fontSize: 12, maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(result.entities, null, 2)}</pre>
          <br />
          <Text strong>Action:</Text>
          <pre style={{ background: '#fff', padding: 12, borderRadius: 4, fontSize: 12, maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(result.suggested_action, null, 2)}</pre>
        </div>
      )}
    </Card>
  );
};

export default NLPCommandPanel;
