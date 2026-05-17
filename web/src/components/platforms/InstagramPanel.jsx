import React, { useState, useEffect } from 'react';
import { Table, Button, Select, message, Spin, Form, Tag, Modal, Card, Row, Col, Statistic } from 'antd';
import { SearchOutlined, PlusOutlined, PauseOutlined, PlayCircleOutlined, InstagramOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Item } = Form;

const MOCK_CAMPAIGNS = [
  { id: 2, name: "Dubai Luxury Real Estate Q2", objective: "sales", platform: "instagram", status: "active", budget_daily: 75, budget_total: 2250, targeting_json: { location: "Dubai", ad_format: "reel", age_range: "30-55" } },
  { id: 4, name: "NRI Investment Advisory", objective: "lead_gen", platform: "instagram", status: "active", budget_daily: 50, budget_total: 1500, targeting_json: { location: "UAE, UK, USA", ad_format: "story", age_range: "35-60" } }
];

const InstagramPanel = () => {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '' });
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/neovibe/instagram-campaigns');
      if (response.ok) setCampaigns(await response.json());
    } catch (e) { /* use mock */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchCampaigns(); }, [filters]);

  const handlePauseCampaign = (id) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'paused' } : c));
    message.success('Campaign paused');
  };

  const handleResumeCampaign = (id) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
    message.success('Campaign resumed');
  };

  const handleCreateCampaign = async () => {
    try {
      const values = await form.validateFields();
      setCampaigns(prev => [...prev, { id: Date.now(), ...values, status: 'draft', platform: 'instagram', budget_total: values.budget_daily * 30 }]);
      message.success('Campaign created!');
      form.resetFields();
      setCreateModalVisible(false);
    } catch (e) { message.error('Failed to create campaign'); }
  };

  const filtered = campaigns.filter(c => !filters.status || c.status === filters.status);

  const columns = [
    { title: 'Campaign Name', dataIndex: 'name', key: 'name' },
    { title: 'Objective', dataIndex: 'objective', key: 'objective' },
    { title: 'Ad Format', dataIndex: ['targeting_json', 'ad_format'], key: 'ad_format', render: (v) => v || 'feed' },
    { title: 'Budget/Day', dataIndex: 'budget_daily', key: 'budget_daily', render: (v) => `$${v}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'active' ? 'green' : s === 'paused' ? 'orange' : 'default'}>{s.toUpperCase()}</Tag> },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <>
        {record.status === 'active' && <Button size="small" onClick={() => handlePauseCampaign(record.id)} icon={<PauseOutlined />}>Pause</Button>}
        {record.status === 'paused' && <Button size="small" onClick={() => handleResumeCampaign(record.id)} icon={<PlayCircleOutlined />}>Resume</Button>}
      </>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h2 style={{ margin: 0 }}><InstagramOutlined /> Instagram Campaigns</h2><p style={{ margin: '4px 0 0', color: '#999' }}>Manage your Instagram advertising campaigns, posts, and analytics</p></div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>Create Campaign</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}><Card><Statistic title="Impressions" value={12847} prefix={<EyeOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="Reach" value={8932} prefix={<EyeOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="Profile Views" value={1243} prefix={<HeartOutlined />} /></Card></Col>
      </Row>
      
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Item label="Status">
          <Select value={filters.status || ''} onChange={(e) => setFilters({...filters, status: e})} style={{ width: 120 }}>
            <Option value="">All</Option><Option value="active">Active</Option><Option value="paused">Paused</Option><Option value="draft">Draft</Option>
          </Select>
        </Item>
        <Item><Button icon={<SearchOutlined />} onClick={fetchCampaigns}>Refresh</Button></Item>
      </Form>

      {loading ? <Spin /> : <Table columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} rowKey="id" />}

      <Modal title="Create Instagram Campaign" open={createModalVisible} onCancel={() => setCreateModalVisible(false)} onOk={handleCreateCampaign}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Item name="name" label="Campaign Name" rules={[{ required: true }]}><Input /></Item>
          <Item name="objective" label="Objective" rules={[{ required: true }]}><Select><Option value="lead_gen">Lead Gen</Option><Option value="sales">Sales</Option><Option value="engagement">Engagement</Option><Option value="profile_visits">Profile Visits</Option></Select></Item>
          <Item name="budget_daily" label="Daily Budget ($)" rules={[{ required: true }]}><Input type="number" /></Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InstagramPanel;
