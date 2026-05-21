import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Typography, message, Tag, Space, Select, Progress, Collapse, Image, Tabs } from 'antd';
import { SendOutlined, ThunderboltOutlined, SettingOutlined, ReloadOutlined, PictureOutlined, VideoCameraOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const API_URL = import.meta.env.VITE_API_URL || '';

const NLPCommandPanel = () => {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [generateVisuals, setGenerateVisuals] = useState(true);
  const [pipelineStage, setPipelineStage] = useState(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch(`${API_URL}/api/nlp/models`);
      if (res.ok) {
        const data = await res.json();
        setAvailableModels(data.models || []);
        const defaultModel = data.models?.find(m => m.available)?.id || '';
        setSelectedModel(defaultModel);
      }
    } catch (e) {
      console.error('Failed to fetch models:', e);
    }
  };

  const handleInterpret = async () => {
    if (!command.trim()) { message.warning('Please enter a command'); return; }
    setLoading(true);
    setPipelineStage('nlp');
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/nlp/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          model: selectedModel,
          generate_visuals: generateVisuals,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setPipelineStage('complete');
      message.success(`Command interpreted via ${data._provider || 'LLM'}`);
    } catch (error) {
      message.error(`Failed: ${error.message}`);
      setPipelineStage('error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCampaign = async () => {
    if (!command.trim()) { message.warning('Please enter a command'); return; }
    setLoading(true);
    setPipelineStage('nlp');
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/nlp/generate-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          model: selectedModel,
          generate_visuals: generateVisuals,
          auto_launch: false,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setPipelineStage(data.status);
      message.success(`Campaign generated: ${data.status}`);
    } catch (error) {
      message.error(`Failed: ${error.message}`);
      setPipelineStage('error');
    } finally {
      setLoading(false);
    }
  };

  const getModelColor = (provider) => {
    const colors = { ollama: 'green', openrouter: 'blue', huggingface: 'orange', gemini: 'purple', claude: 'magenta', codex: 'cyan' };
    return colors[provider] || 'default';
  };

  return (
    <Card
      title={<><ThunderboltOutlined style={{ color: '#1890ff' }} /> AI Campaign Generator</>}
      extra={
        <Space>
          <Tag color={pipelineStage === 'complete' || pipelineStage === 'launched' ? 'green' : pipelineStage === 'error' ? 'red' : 'blue'}>
            {selectedModel ? selectedModel.split('/')[1] || selectedModel : 'No model'}
          </Tag>
          <Button icon={<SettingOutlined />} size="small" href="/settings/models">
            Model Settings
          </Button>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      {/* Model Selection */}
      <Space style={{ width: '100%', marginBottom: 12 }} wrap>
        <Text strong>Model:</Text>
        <Select
          value={selectedModel}
          onChange={setSelectedModel}
          style={{ width: 250 }}
          placeholder="Select AI model"
          size="small"
        >
          {availableModels.filter(m => m.available).map(m => (
            <Option key={m.id} value={m.id}>
              <Tag color={getModelColor(m.provider)} style={{ marginRight: 4 }}>{m.provider}</Tag>
              {m.id}
            </Option>
          ))}
        </Select>
        <Button icon={<ReloadOutlined />} size="small" onClick={fetchModels}>Refresh</Button>
        <Space.Compact>
          <Button
            type={generateVisuals ? 'primary' : 'default'}
            size="small"
            onClick={() => setGenerateVisuals(!generateVisuals)}
          >
            <PictureOutlined /> Visuals
          </Button>
        </Space.Compact>
      </Space>

      {/* Command Input */}
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder="e.g., Create an Instagram ad campaign for a luxury spa in Dubai, $50/day budget targeting women 25-45"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onPressEnter={handleInterpret}
          size="large"
        />
        <Button type="primary" size="large" onClick={handleInterpret} loading={loading} icon={<SendOutlined />}>
          Interpret
        </Button>
        <Button type="default" size="large" onClick={handleGenerateCampaign} loading={loading}>
          Generate Campaign
        </Button>
      </Space.Compact>

      {/* Pipeline Progress */}
      {loading && (
        <div style={{ marginTop: 12 }}>
          <Text type="secondary">Processing pipeline...</Text>
          <Progress
            percent={pipelineStage === 'nlp' ? 25 : pipelineStage === 'campaign_gen' ? 50 : pipelineStage === 'visuals' ? 75 : 90}
            size="small"
            status="active"
          />
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: 16 }}>
          {/* Status Bar */}
          <Space style={{ marginBottom: 12 }}>
            <Text strong>Status:</Text>
            <Tag color={result.status === 'ready_for_review' || result.status === 'launched' ? 'green' : result.status === 'failed' ? 'red' : 'blue'}>
              {result.status || (result.intent ? 'Interpreted' : 'Unknown')}
            </Tag>
            {result._model_used && (
              <Tag color={getModelColor(result._provider)}>
                {result._model_used}
              </Tag>
            )}
            {result.confidence && (
              <Tag>
                Confidence: {Math.round(result.confidence * 100)}%
              </Tag>
            )}
          </Space>

          {/* Intent & Campaign Info */}
          {result.intent && (
            <Collapse defaultActiveKey={['intent', 'campaign']} size="small" style={{ marginBottom: 12 }}>
              <Panel header={<><FileTextOutlined /> Intent: {result.intent}</>} key="intent">
                <pre style={{ background: '#fafafa', padding: 12, borderRadius: 4, fontSize: 12, maxHeight: 200, overflow: 'auto', margin: 0 }}>
                  {JSON.stringify({ intent: result.intent, entities: result.entities, confidence: result.confidence }, null, 2)}
                </pre>
              </Panel>
              {result.campaign && (
                <Panel header={<><PictureOutlined /> Campaign: {result.campaign.name || result.campaign.campaign_name}</>} key="campaign">
                  <pre style={{ background: '#fafafa', padding: 12, borderRadius: 4, fontSize: 12, maxHeight: 400, overflow: 'auto', margin: 0 }}>
                    {JSON.stringify(result.campaign, null, 2)}
                  </pre>
                </Panel>
              )}
              {result.content_brief && (
                <Panel header="Content Brief" key="content">
                  <Paragraph><Text strong>Copy:</Text> {result.content_brief.copy}</Paragraph>
                  <Paragraph><Text strong>Tone:</Text> {result.content_brief.tone}</Paragraph>
                  <Paragraph><Text strong>CTA:</Text> {result.content_brief.cta}</Paragraph>
                  {result.content_brief.hashtags && (
                    <Paragraph>
                      <Text strong>Hashtags:</Text>{' '}
                      {result.content_brief.hashtags.map((h, i) => <Tag key={i}>{h}</Tag>)}
                    </Paragraph>
                  )}
                </Panel>
              )}
            </Collapse>
          )}

          {/* Pipeline Stages */}
          {result.stages && (
            <Collapse size="small" style={{ marginBottom: 12 }}>
              <Panel header="Pipeline Stages" key="stages">
                {Object.entries(result.stages).map(([stage, data]) => (
                  <div key={stage} style={{ marginBottom: 8 }}>
                    <Tag color={data.status === 'complete' ? 'green' : data.status === 'failed' ? 'red' : data.status === 'running' ? 'blue' : 'default'}>
                      {stage}: {data.status}
                    </Tag>
                    {data.image_count && <Text type="secondary"> ({data.image_count} images)</Text>}
                    {data.error && <Text type="danger"> — {data.error}</Text>}
                  </div>
                ))}
              </Panel>
            </Collapse>
          )}

          {/* Generated Visuals */}
          {result.campaign?.generated_visuals && result.campaign.generated_visuals.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <Text strong><PictureOutlined /> Generated Visuals:</Text>
              <Space wrap style={{ marginTop: 8 }}>
                {result.campaign.generated_visuals.map((img, i) => (
                  img.startsWith('http') ? (
                    <Image key={i} src={img} width={150} height={150} style={{ objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <Image key={i} src={`data:image/png;base64,${img}`} width={150} height={150} style={{ objectFit: 'cover', borderRadius: 8 }} />
                  )
                ))}
              </Space>
            </div>
          )}

          {/* Clarification needed */}
          {result.clarification && (
            <Card size="small" style={{ background: '#fff7e6', borderColor: '#ffd666' }}>
              <Text type="warning">{result.clarification}</Text>
            </Card>
          )}
        </div>
      )}
    </Card>
  );
};

export default NLPCommandPanel;
