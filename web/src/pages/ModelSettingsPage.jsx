import React, { useState, useEffect } from 'react';
import { Card, Typography, Input, Button, Space, Tag, Divider, message, Table, Modal, Descriptions, Alert, Switch, Select } from 'antd';
import { SaveOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, KeyOutlined, SettingOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const API_URL = import.meta.env.VITE_API_URL || '';

const MODEL_PROVIDERS = [
  { key: 'openrouter_api_key', label: 'OpenRouter', prefix: 'sk-or-', placeholder: 'sk-or-v1-...', docs: 'https://openrouter.ai/keys' },
  { key: 'huggingface_api_key', label: 'HuggingFace', prefix: 'hf_', placeholder: 'hf_...', docs: 'https://huggingface.co/settings/tokens' },
  { key: 'gemini_api_key', label: 'Google Gemini', prefix: 'AIza', placeholder: 'AIzaSy...', docs: 'https://aistudio.google.com/apikey' },
  { key: 'claude_api_key', label: 'Anthropic Claude', prefix: 'sk-ant-', placeholder: 'sk-ant-...', docs: 'https://console.anthropic.com/settings/keys' },
  { key: 'codex_api_key', label: 'OpenAI (Codex/DALL-E)', prefix: 'sk-', placeholder: 'sk-...', docs: 'https://platform.openai.com/api-keys' },
  { key: 'ollama_base_url', label: 'Ollama URL', prefix: 'http', placeholder: 'http://localhost:11434', docs: 'https://ollama.ai', isUrl: true },
];

const ModelSettingsPage = () => {
  const [keys, setKeys] = useState({ models: {}, integrations: {} });
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [testingKey, setTestingKey] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [showKey, setShowKey] = useState({});
  const [preferredModel, setPreferredModel] = useState('');
  const [autoVisuals, setAutoVisuals] = useState(true);
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    fetchKeys();
    fetchModels();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/keys/`);
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      }
    } catch (e) {
      message.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/keys/models`);
      if (res.ok) {
        const data = await res.json();
        setAvailableModels(data.models || []);
      }
    } catch (e) {
      console.error('Failed to fetch models:', e);
    }
  };

  const handleSave = async (keyName) => {
    try {
      const res = await fetch(`${API_URL}/api/user/keys/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_name: keyName, value: editValue }),
      });
      if (res.ok) {
        message.success(`${keyName} saved`);
        setEditingKey(null);
        setEditValue('');
        fetchKeys();
        fetchModels();
      }
    } catch (e) {
      message.error('Failed to save key');
    }
  };

  const handleDelete = async (keyName) => {
    try {
      const res = await fetch(`${API_URL}/api/user/keys/${keyName}`, { method: 'DELETE' });
      if (res.ok) {
        message.success(`${keyName} deleted`);
        fetchKeys();
        fetchModels();
      }
    } catch (e) {
      message.error('Failed to delete key');
    }
  };

  const handleTest = async (keyName, value) => {
    setTestingKey(keyName);
    try {
      const res = await fetch(`${API_URL}/api/user/keys/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_name: keyName, value: value || editValue }),
      });
      if (res.ok) {
        const data = await res.json();
        setTestResults(prev => ({ ...prev, [keyName]: data.valid }));
        message[data.valid ? 'success' : 'error'](`${keyName}: ${data.valid ? 'Valid' : 'Invalid'}`);
      }
    } catch (e) {
      message.error('Test failed');
    } finally {
      setTestingKey(null);
    }
  };

  const modelColumns = [
    {
      title: 'Provider',
      dataIndex: 'label',
      key: 'label',
      render: (text, record) => (
        <Space>
          <KeyOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const modelKey = keys.models?.[record.key];
        if (!modelKey) return <Tag color="default">Not configured</Tag>;
        return modelKey.is_set ? (
          <Tag color="green">
            <CheckCircleOutlined /> Configured
          </Tag>
        ) : (
          <Tag color="default">Not set</Tag>
        );
      },
    },
    {
      title: 'Key',
      key: 'key',
      render: (_, record) => {
        const modelKey = keys.models?.[record.key];
        const isEditing = editingKey === record.key;
        const isVisible = showKey[record.key];

        if (isEditing) {
          return (
            <Space>
              <Input.Password
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={record.placeholder}
                style={{ width: 250 }}
                visibilityToggle={false}
              />
              <Button type="primary" size="small" icon={<SaveOutlined />} onClick={() => handleSave(record.key)}>Save</Button>
              <Button size="small" onClick={() => setEditingKey(null)}>Cancel</Button>
            </Space>
          );
        }

        return (
          <Space>
            <Text code>{modelKey?.masked || 'Not set'}</Text>
            {modelKey?.is_set && (
              <>
                <Button size="small" icon={<EyeOutlined />} onClick={() => setShowKey(prev => ({ ...prev, [record.key]: !isVisible }))} />
                <Button size="small" icon={<SettingOutlined />} onClick={() => { setEditingKey(record.key); setEditValue(''); }} />
                <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
                <Button
                  size="small"
                  icon={testResults[record.key] ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  loading={testingKey === record.key}
                  onClick={() => handleTest(record.key)}
                />
              </>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Available Models',
      key: 'models',
      render: (_, record) => {
        const providerModels = availableModels.filter(m => m.provider === record.key.replace('_api_key', '').replace('_base_url', ''));
        return providerModels.length > 0 ? (
          <Space wrap>
            {providerModels.slice(0, 3).map(m => (
              <Tag key={m.id} color="blue">{m.id.split('/').pop()}</Tag>
            ))}
            {providerModels.length > 3 && <Tag>+{providerModels.length - 3} more</Tag>}
          </Space>
        ) : (
          <Text type="secondary">Configure key to see models</Text>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Model & API Settings</Title>
      <Paragraph type="secondary">
        Configure your AI model API keys. Keys are encrypted and used only for campaign generation.
        You can use system defaults or override with your own keys.
      </Paragraph>

      <Alert
        message="Privacy First"
        description="Your API keys are encrypted at rest and never shared. Each user manages their own keys. System defaults are used when no user key is configured."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Preferred Model */}
      <Card title="Default Model" size="small" style={{ marginBottom: 16 }}>
        <Space>
          <Text strong>Preferred Model:</Text>
          <Select value={preferredModel} onChange={setPreferredModel} style={{ width: 300 }}>
            {availableModels.filter(m => m.available).map(m => (
              <Option key={m.id} value={m.id}>{m.id}</Option>
            ))}
          </Select>
          <Text strong>Auto-generate visuals:</Text>
          <Switch checked={autoVisuals} onChange={setAutoVisuals} />
        </Space>
      </Card>

      {/* Model Providers */}
      <Card title="AI Model Providers" style={{ marginBottom: 16 }}>
        <Table
          columns={modelColumns}
          dataSource={MODEL_PROVIDERS}
          rowKey="key"
          pagination={false}
          size="small"
          loading={loading}
        />
      </Card>

      {/* Available Models Overview */}
      <Card title="Available Models">
        <Space wrap>
          {availableModels.map(m => (
            <Tag key={m.id} color={m.available ? 'green' : 'default'}>
              {m.id} {m.available ? '✓' : '✗'}
            </Tag>
          ))}
        </Space>
      </Card>
    </div>
  );
};

export default ModelSettingsPage;
