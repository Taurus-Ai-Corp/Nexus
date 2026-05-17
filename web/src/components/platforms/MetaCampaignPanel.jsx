import React, { useState, useEffect } from 'react';
import { Table, Button, Select, message, Spin, Form, Tag, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, PauseOutlined, PlayCircleOutlined, FacebookOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Item } = Form;

const MOCK_CAMPAIGNS = [
  { id: 1, name: "Toronto Café Summer Push", objective: "lead_gen", platform: "meta", status: "active", budget_daily: 30, budget_total: 900, targeting_json: { location: "Toronto", age_range: "25-45" } },
  { id: 3, name: "Kerala Ayurveda Wellness", objective: "engagement", platform: "meta", status: "paused", budget_daily: 20, budget_total: 600, targeting_json: { location: "Kerala, India", age_range: "28-50" } },
  { id: 5, name: "PQC Migration Services", objective: "brand_awareness", platform: "meta", status: "draft", budget_daily: 100, budget_total: 3000, targeting_json: { location: "Global", age_range: "30-65" } }
];

const MetaCampaignPanel = () => {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '' });
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bizflow/meta-campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      // Use mock data if API unavailable
    } finally {
      setLoading(false);
    }
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
      const newCampaign = { id: Date.now(), ...values, status: 'draft', platform: 'meta', budget_total: values.budget_daily * 30 };
      setCampaigns(prev => [...prev, newCampaign]);
      message.success('Campaign created!');
      form.resetFields();
      setCreateModalVisible(false);
    } catch (error) {
      message.error('Failed to create campaign');
    }
  };

  const filtered = campaigns.filter(c => !filters.status || c.status === filters.status);

  const columns = [
    { title: 'Campaign Name', dataIndex: 'name', key: 'name' },
    { title: 'Objective', dataIndex: 'objective', key: 'objective' },
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
        <div><h2 style={{ margin: 0 }}><FacebookOutlined /> Meta Campaigns</h2><p style={{ margin: '4px 0 0', color: '#999' }}>Manage your Facebook and Meta advertising campaigns</p></div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>Create Campaign</Button>
      </div>
      
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Item label="Status">
          <Select value={filters.status || ''} onChange={(e) => setFilters({...filters, status: e})} style={{ width: 120 }}>
            <Option value="">All Statuses</Option>
            <Option value="draft">Draft</Option>
            <Option value="active">Active</Option>
            <Option value="paused">Paused</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Item>
        <Item><Button icon={<SearchOutlined />} onClick={fetchCampaigns}>Refresh</Button></Item>
      </Form>

      {loading ? <Spin tip="Loading..." /> : <Table columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} rowKey="id" />}

      <Modal title="Create New Campaign" open={createModalVisible} onCancel={() => setCreateModalVisible(false)} onOk={handleCreateCampaign} okText="Create" cancelText="Cancel">
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Item name="name" label="Campaign Name" rules={[{ required: true }]}><Input placeholder="Enter campaign name" /></Item>
          <Item name="objective" label="Objective" rules={[{ required: true }]}><Select><Option value="lead_gen">Lead Generation</Option><Option value="sales">Sales/Conversions</Option><Option value="engagement">Engagement</Option><Option value="brand_awareness">Brand Awareness</Option></Select></Item>
          <Item name="budget_daily" label="Daily Budget ($)" rules={[{ required: true }]}><Input type="number" placeholder="Enter daily budget" /></Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MetaCampaignPanel;
