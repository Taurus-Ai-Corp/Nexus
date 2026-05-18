import React, { useState } from 'react';
import { Button, Input, InputNumber, Select, message, Spin, Form } from 'antd';
import { PlayCircleOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { Item } = Form;

const AgentOrchestrationPanel = () => {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [form] = Form.useForm();

  const handleOrchestrate = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      
      const response = await axios.post('/api/agents/orchestrate', values);
      setLastResult(response.data);
      message.success('Agent orchestration initiated successfully!');
    } catch (error) {
      console.error('Error orchestrating agent:', error);
      message.error('Failed to orchestrate agent');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Property',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const formatResult = (result) => {
    if (!result) return [];
    
    const entries = Object.entries(result).map(([key, value]) => ({
      key: String(key),
      value: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
    }));
    
    return entries;
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2>Agent Orchestration Center</h2>
        <p>Orchestrate BizFlow and NeoVibe AI agents for automated campaign management</p>
      </div>
      
      <Form form={form} layout="vertical">
        <Item label="Agent Platform">
          <Select 
            name="platform"
            placeholder="Select platform"
          >
            <Option value="bizflow">BizFlow (SEO/Analytics)</Option>
            <Option value="neovibe">NeoVibe (Content/Design)</Option>
          </Select>
        </Item>
        
        <Item label="Agent Type">
          <Select 
            name="agent_type"
            placeholder="Select agent type"
          >
            <Option value="orchestrator">Master Orchestrator</Option>
            <Option value="seo">SEO Specialist</Option>
            <Option value="content">Content Creator</Option>
            <Option value="design">Design Specialist</Option>
            <Option value="analytics">Analytics Specialist</Option>
            <Option value="cultural">Cultural Intelligence</Option>
          </Select>
        </Item>
        
        <Item label="Task Description">
          <Input.TextArea 
            name="task_description"
            rows={3}
            placeholder="Describe the task for the agent (e.g., 'Create SEO blog post about PQC migration for UAE financial firms')"
          />
        </Item>
        
        <Item label="Priority">
          <Select 
            name="priority"
            placeholder="Select priority"
          >
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Item>
        
        <Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<PlayCircleOutlined />}
            loading={loading}
          >
            Orchestrate Agent
          </Button>
          <Button 
            style={{ marginLeft: 8 }}
            onClick={() => form.resetFields()}
          >
            Reset
          </Button>
        </Item>
      </Form>

      {lastResult && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <h3>Orchestration Result</h3>
          <Spin indicator={<SyncOutlined spin />} active={loading} style={{ marginBottom: 16 }}>
            <Table 
              columns={columns} 
              dataSource={formatResult(lastResult)} 
              pagination={false}
            />
          </Spin>
        </div>
      )}
    </div>
  );
};

export default AgentOrchestrationPanel;