import React, { useState, useEffect } from 'react';
import { Table, Button, Select, message, Spin, Form, Tag, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Item } = Form;

const MOCK_CAMPAIGNS = [
  { id: 1, name: "Toronto Café Summer Push", objective: "lead_gen", platform: "meta", status: "active", budget_daily: 30 },
  { id: 3, name: "Kerala Ayurveda Wellness", objective: "engagement", platform: "meta", status: "paused", budget_daily: 20 },
  { id: 5, name: "PQC Migration Services", objective: "brand_awareness", platform: "meta", status: "draft", budget_daily: 100 }
];

const BizFlowPanel = () => {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '' });
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try { const r = await fetch('/api/bizflow/meta-campaigns'); if (r.ok) setCampaigns(await r.json()); } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCampaigns(); }, [filters]);

  const handlePauseCampaign = (id) => { setCampaigns(p => p.map(c => c.id === id ? {...c, status: 'paused'} : c)); message.success('Paused'); };
  const handleResumeCampaign = (id) => { setCampaigns(p => p.map(c => c.id === id ? {...c, status: 'active'} : c)); message.success('Resumed'); };

  const handleCreateCampaign = async () => {
    try {
      const values = await form.validateFields();
      setCampaigns(p => [...p, { id: Date.now(), ...values, status: 'draft', platform: 'meta' }]);
      message.success('Created!'); form.resetFields(); setCreateModalVisible(false);
    } catch (e) { message.error('Failed'); }
  };

  const filtered = campaigns.filter(c => !filters.status || c.status === filters.status);
  const columns = [
    { title: 'Campaign Name', dataIndex: 'name', key: 'name' },
    { title: 'Objective', dataIndex: 'objective', key: 'objective' },
    { title: 'Budget/Day', dataIndex: 'budget_daily', key: 'budget_daily', render: (v) => `$${v}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'active' ? 'green' : s === 'paused' ? 'orange' : 'default'}>{s.toUpperCase()}</Tag> },
    { title: 'Actions', key: 'actions', render: (_, r) => (<>
      {r.status === 'active' && <Button size="small" onClick={() => handlePauseCampaign(r.id)} icon={<PauseOutlined />}>Pause</Button>}
      {r.status === 'paused' && <Button size="small" onClick={() => handleResumeCampaign(r.id)} icon={<PlayCircleOutlined />}>Resume</Button>}
    </>)},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h2 style={{ margin: 0 }}>BizFlow Campaigns</h2><p style={{ margin: '4px 0 0', color: '#999' }}>Manage your Facebook and Meta advertising campaigns</p></div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>Create Campaign</Button>
      </div>
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Item label="Status"><Select value={filters.status || ''} onChange={(e) => setFilters({...filters, status: e})} style={{ width: 120 }}><Option value="">All</Option><Option value="active">Active</Option><Option value="paused">Paused</Option><Option value="draft">Draft</Option></Select></Item>
        <Item><Button icon={<SearchOutlined />} onClick={fetchCampaigns}>Refresh</Button></Item>
      </Form>
      {loading ? <Spin /> : <Table columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} rowKey="id" />}
      <Modal title="Create Campaign" open={createModalVisible} onCancel={() => setCreateModalVisible(false)} onOk={handleCreateCampaign}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Item name="name" label="Campaign Name" rules={[{ required: true }]}><Input /></Item>
          <Item name="objective" label="Objective" rules={[{ required: true }]}><Select><Option value="lead_gen">Lead Gen</Option><Option value="sales">Sales</Option><Option value="engagement">Engagement</Option><Option value="brand_awareness">Brand Awareness</Option></Select></Item>
          <Item name="budget_daily" label="Daily Budget ($)" rules={[{ required: true }]}><Input type="number" /></Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BizFlowPanel;
