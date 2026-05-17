import React, { useState } from 'react';
import { Button, Input, Select, message, Form, Card, Table } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

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
      setLastResult({
        status: 'orchestrated',
        session_id: `sess_${Date.now()}`,
        platform: values.platform,
        agent_type: values.agent_type,
        priority: values.priority,
        plan: {
          steps: [
            { step: 1, action: 'analyze_task', description: `Parse: ${values.task_description}` },
            { step: 2, action: 'select_agent', description: `${values.agent_type} on ${values.platform}` },
            { step: 3, action: 'execute', description: 'Running agent task...' },
            { step: 4, action: 'review', description: 'Validating results' }
          ],
          estimated_duration: '2-5 minutes'
        },
        timestamp: new Date().toISOString()
      });
      message.success('Agent orchestration initiated!');
    } catch (error) {
      message.error('Failed to orchestrate agent');
    } finally { setLoading(false); }
  };

  const columns = [
    { title: 'Property', dataIndex: 'key', key: 'key' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  const formatResult = (result) => {
    if (!result) return [];
    return Object.entries(result).map(([key, value]) => ({
      key: String(key),
      value: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
    }));
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>Agent Orchestration Center</h2>
        <p>Orchestrate BizFlow and NeoVibe AI agents for automated campaign management</p>
      </div>
      
      <Form form={form} layout="vertical">
        <Item label="Agent Platform" name="platform" rules={[{ required: true }]}><Select placeholder="Select platform"><Option value="bizflow">BizFlow (SEO/Analytics)</Option><Option value="neovibe">NeoVibe (Content/Design)</Option></Select></Item>
        <Item label="Agent Type" name="agent_type" rules={[{ required: true }]}><Select placeholder="Select agent type"><Option value="orchestrator">Master Orchestrator</Option><Option value="seo">SEO Specialist</Option><Option value="content">Content Creator</Option><Option value="design">Design Specialist</Option><Option value="analytics">Analytics Specialist</Option></Select></Item>
        <Item label="Task Description" name="task_description" rules={[{ required: true }]}><Input.TextArea rows={3} placeholder="Describe the task for the agent" /></Item>
        <Item label="Priority" name="priority"><Select><Option value="low">Low</Option><Option value="medium">Medium</Option><Option value="high">High</Option></Select></Item>
        <Item><Button type="primary" htmlType="submit" icon={<PlayCircleOutlined />} loading={loading} onClick={handleOrchestrate}>Orchestrate Agent</Button></Item>
      </Form>

      {lastResult && (
        <Card title="Orchestration Result" style={{ marginTop: 24 }}>
          <Table columns={columns} dataSource={formatResult(lastResult)} pagination={false} />
        </Card>
      )}
    </div>
  );
};

export default AgentOrchestrationPanel;
