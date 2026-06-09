import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, message, Spin, Form } from 'antd';
import { SearchOutlined, PlusOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { Item } = Form;

const NeoVibePanel = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ platform: '', status: '' });
  const [form] = Form.useForm();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.status) params.append('status', filters.status);
      
      const response = await axios.get(`/api/neovibe/instagram-campaigns?${params.toString()}`);
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching NeoVibe campaigns:', error);
      message.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.post('/api/neovibe/instagram-campaigns', {
        ...values,
        platform: 'instagram',
        status: 'draft',
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        targeting_json: values.targeting_json || {},
        creatives_json: []
      });
      message.success('NeoVibe campaign created successfully!');
      form.resetFields();
      fetchCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      message.error('Failed to create campaign');
    }
  };

  const handlePauseCampaign = async (id) => {
    try {
      await axios.post(`/api/campaigns/${id}/pause`);
      message.success('Campaign paused');
      fetchCampaigns();
    } catch (error) {
      console.error('Error pausing campaign:', error);
      message.error('Failed to pause campaign');
    }
  };

  const handleResumeCampaign = async (id) => {
    try {
      await axios.post(`/api/campaigns/${id}/resume`);
      message.success('Campaign resumed');
      fetchCampaigns();
    } catch (error) {
      console.error('Error resuming campaign:', error);
      message.error('Failed to resume campaign');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [filters]);

  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Objective',
      dataIndex: 'objective',
      key: 'objective',
    },
    {
      title: 'Budget/Day',
      dataIndex: 'budget_daily',
      key: 'budget_daily',
      render: (text) => `$${text}`,
    },
    {
      title: 'Ad Format',
      dataIndex: 'targeting_json.ad_format',
      key: 'ad_format',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = '';
        switch (text) {
          case 'active': color = 'green'; break;
          case 'paused': color = 'orange'; break;
          case 'completed': color = 'blue'; break;
          default: color = 'gray';
        }
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          {record.status === 'active' && (
            <Button 
              size="small" 
              onClick={() => handlePauseCampaign(record.id)}
              icon={<PauseOutlined />}
            >
              Pause
            </Button>
          )}
          {record.status === 'paused' && (
            <Button 
              size="small" 
              onClick={() => handleResumeCampaign(record.id)}
              icon={<PlayCircleOutlined />}
            >
              Resume
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2>NeoVibe Instagram Campaigns</h2>
        <p>Manage your Instagram advertising campaigns</p>
      </div>
      
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Item label="Platform">
          <Select 
            value={filters.platform || ''} 
            onChange={(e) => setFilters({...filters, platform: e.target.value})}
            style={{ width: 120 }}
          >
            <Option value="">All Platforms</Option>
            <Option value="instagram">Instagram</Option>
          </Select>
        </Item>
        
        <Item label="Status">
          <Select 
            value={filters.status || ''} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            style={{ width: 120 }}
          >
            <Option value="">All Statuses</Option>
            <Option value="draft">Draft</Option>
            <Option value="active">Active</Option>
            <Option value="paused">Paused</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Item>
        
        <Item>
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            onClick={() => fetchCampaigns()}
            style={{ marginLeft: 8 }}
          >
            Filter
          </Button>
        </Item>
      </Form>

      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => form.setFieldsValue({})}
        style={{ marginBottom: 16 }}
      >
        Create New Campaign
      </Button>

      {loading ? (
        <Spin tip="Loading campaigns..." style={{ height: 200 }} />
      ) : (
        <Form form={form} layout="vertical">
          <Item label="Campaign Name">
            <Input placeholder="Enter campaign name" name="name" />
          </Item>
          
          <Item label="Objective">
            <Select name="objective">
              <Option value="lead_gen">Lead Generation</Option>
              <Option value="sales">Sales/Conversions</Option>
              <Option value="engagement">Engagement</Option>
              <Option value="profile_visits">Profile Visits</Option>
              <Option value="traffic">Traffic (Link Clicks)</Option>
            </Select>
          </Item>
          
          <Item label="Daily Budget ($)">
            <Input type="number" placeholder="Enter daily budget" name="budget_daily" />
          </Item>
          
          <Item label="Ad Format">
            <Select name="targeting_json.ad_format">
              <Option value="feed">Feed</Option>
              <Option value="story">Story</Option>
              <Option value="reel">Reel</Option>
              <Option value="explore">Explore</Option>
            </Select>
          </Item>
          
          <Item label="Targeting (JSON)">
            <Input.TextArea 
              rows={4} 
              placeholder='{"location": "Detroit", "age_range": "25-45", "gender": "female"}' 
              name="targeting_json"
            />
          </Item>
          
          <Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<PlusOutlined />}
            >
              Create Campaign
            </Button>
          </Item>
        </Form>
      )}

      {campaigns.length > 0 && (
        <Table 
          columns={columns} 
          dataSource={campaigns} 
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      )}

      {campaigns.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>No NeoVibe campaigns found. Create your first campaign above.</p>
        </div>
      )}
    </div>
  );
};

export default NeoVibePanel;