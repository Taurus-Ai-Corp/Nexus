import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Spin } from 'antd';
import { ArrowUpOutlined, FacebookOutlined, InstagramOutlined, ThunderboltOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MOCK_CAMPAIGNS = [
  { id: 1, name: "Toronto Café Summer Push", objective: "lead_gen", platform: "meta", status: "active", budget_daily: 30 },
  { id: 2, name: "Dubai Luxury Real Estate Q2", objective: "sales", platform: "instagram", status: "active", budget_daily: 75 },
  { id: 3, name: "Kerala Ayurveda Wellness", objective: "engagement", platform: "meta", status: "paused", budget_daily: 20 },
  { id: 4, name: "NRI Investment Advisory", objective: "lead_gen", platform: "instagram", status: "active", budget_daily: 50 },
  { id: 5, name: "PQC Migration Services", objective: "brand_awareness", platform: "meta", status: "draft", budget_daily: 100 }
];

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch('/api/campaigns');
        if (r.ok) setCampaigns(await r.json());
      } catch (e) { /* use mock */ } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><Spin size="large" /><br /><br />Loading dashboard...</div>;

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget_daily || 0), 0);

  const columns = [
    { title: 'Campaign', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
    { title: 'Platform', dataIndex: 'platform', key: 'platform', render: (text) => text === 'meta' ? <Tag color="blue"><FacebookOutlined /> Meta</Tag> : <Tag color="magenta"><InstagramOutlined /> Instagram</Tag> },
    { title: 'Objective', dataIndex: 'objective', key: 'objective' },
    { title: 'Budget/Day', dataIndex: 'budget_daily', key: 'budget_daily', render: (v) => `$${v}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'active' ? 'green' : s === 'paused' ? 'orange' : 'default'}>{s}</Tag> },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Dashboard Overview</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card><Statistic title="Total Campaigns" value={campaigns.length} prefix={<TeamOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card><Statistic title="Active Campaigns" value={activeCampaigns} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card><Statistic title="Daily Budget" value={totalBudget} precision={2} prefix={<DollarOutlined />} suffix="USD" /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card><Statistic title="AI Models Available" value={364} prefix={<ThunderboltOutlined />} /></Card></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}><Card title="AI Routing Tiers" style={{ height: '100%' }}>
          <div style={{ marginBottom: 12 }}><Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>Tier 1: Local Ollama</Tag><Text type="secondary"> — Free, private, local inference</Text><div style={{ marginTop: 4 }}><Tag color="blue">llama3</Tag> <Tag color="blue">qwen2.5</Tag> <Tag color="blue">mistral</Tag> <Tag color="blue">phi3</Tag></div></div>
          <div style={{ marginBottom: 12 }}><Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>Tier 2: OpenRouter</Tag><Text type="secondary"> — 356+ cloud models (Claude, GPT, Gemini)</Text></div>
          <div><Tag color="purple" style={{ fontSize: 14, padding: '4px 12px' }}>Tier 3: HuggingFace</Tag><Text type="secondary"> — Open-source models (Llama, Mistral)</Text></div>
        </Card></Col>
        <Col xs={24} lg={12}><Card title="System Health" style={{ height: '100%' }}>
          <Row gutter={[8, 8]}>
            <Col span={12}><Text>PostgreSQL + pgvector</Text><br /><Tag color="green">healthy</Tag></Col>
            <Col span={12}><Text>Valkey (Cache)</Text><br /><Tag color="green">healthy</Tag></Col>
            <Col span={12}><Text>Meilisearch</Text><br /><Tag color="green">healthy</Tag></Col>
            <Col span={12}><Text>Qdrant (Vector)</Text><br /><Tag color="blue">configured</Tag></Col>
          </Row>
        </Card></Col>
      </Row>

      <Card title="Recent Campaigns" style={{ marginTop: 16 }}>
        <Table columns={columns} dataSource={campaigns.slice(0, 10)} pagination={{ pageSize: 5 }} rowKey="id" />
      </Card>
    </div>
  );
};

export default DashboardOverview;
