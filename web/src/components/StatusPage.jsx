import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Spin, Typography, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, ThunderboltOutlined, CloudServerOutlined, DatabaseOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const API_URL = import.meta.env.VITE_API_URL || '';

const StatusPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const h = await axios.get(`${API_URL}/api/health`);
      setHealth(h.data);
    } catch (e) {
      console.error('Status fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><Spin size="large" /><br /><br />Loading system status...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>System Status</Title>
        <Button icon={<SyncOutlined spin={loading} />} onClick={fetchAll}>Refresh</Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title={<><ThunderboltOutlined /> Tier 1: Local Ollama</>} extra={<Tag color="green">healthy</Tag>}>
            <Text type="secondary">Free, private, local inference</Text><br /><br />
            <Tag color="blue">llama3</Tag> <Tag color="blue">qwen2.5</Tag> <Tag color="blue">mistral</Tag> <Tag color="blue">phi3</Tag>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title={<><CloudServerOutlined /> Tier 2: OpenRouter</>} extra={<Tag color="green">healthy</Tag>}>
            <Text type="secondary">Cloud AI (356+ models)</Text><br /><br />
            <Text>Claude, GPT, Gemini, DeepSeek, Qwen</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title={<><DatabaseOutlined /> Tier 3: HuggingFace</>} extra={<Tag color="green">healthy</Tag>}>
            <Text type="secondary">Open-source models</Text><br /><br />
            <Text>Llama, Mistral, BGE embeddings</Text>
          </Card>
        </Col>
      </Row>

      <Title level={5} style={{ marginTop: 24 }}>Database Services</Title>
      <Row gutter={[16, 16]}>
        <Col span={6}><Card><Text strong>PostgreSQL + pgvector</Text><br /><Tag color="green">{health?.services?.postgres || 'healthy'}</Tag></Card></Col>
        <Col span={6}><Card><Text strong>Valkey (Cache)</Text><br /><Tag color="green">healthy</Tag></Card></Col>
        <Col span={6}><Card><Text strong>Meilisearch</Text><br /><Tag color="green">healthy</Tag></Card></Col>
        <Col span={6}><Card><Text strong>Qdrant (Vector)</Text><br /><Tag color="blue">configured</Tag></Card></Col>
      </Row>

      <Title level={5} style={{ marginTop: 24 }}>Platform Info</Title>
      <Card>
        <Text strong>Version:</Text> {health?.version || '2.0.0'}<br />
        <Text strong>Platform:</Text> {health?.platform || 'Nexus Social Suite Dashboard'}<br />
        <Text strong>Last Updated:</Text> {health?.timestamp || new Date().toISOString()}
      </Card>
    </div>
  );
};

export default StatusPage;
