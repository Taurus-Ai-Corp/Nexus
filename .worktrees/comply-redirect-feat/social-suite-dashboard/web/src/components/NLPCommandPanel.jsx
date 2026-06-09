import React, { useState } from 'react';
import { Button, Input, Card, Typography, message } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const NLPCommandPanel = () => {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInterpret = async () => {
    if (!command.trim()) {
      message.warning('Please enter a command');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would point to the NLP service
      const response = await axios.post('http://localhost:8001/interpret', {
        text: command
      });
      
      setResult(response.data);
      message.success('Command interpreted successfully');
    } catch (error) {
      console.error('Error interpreting command:', error);
      message.error('Failed to interpret command');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="NLP Command Interpreter" style={{ margin: '24px 0' }}>
      <Input 
        placeholder="Enter a command like 'Create an Instagram story ad for NeoVibe targeting Detroit females 25-40 with $30/day budget'"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onPressEnter={handleInterpret}
      />
      <Button 
        type="primary" 
        onClick={handleInterpret} 
        loading={loading}
        style={{ marginTop: 16 }}
      >
        Interpret Command
      </Button>
      
      {result && (
        <div style={{ marginTop: 24 }}>
          <Title level={4}>Interpretation Result</Title>
          <Text strong>Intent:</Text> {result.intent}<br/>
          <Text strong>Entities:</Text> {JSON.stringify(result.entities)}<br/>
          <Text strong>Suggested Action:</Text> {JSON.stringify(result.action)}
        </div>
      )}
    </Card>
  );
};

export default NLPCommandPanel;