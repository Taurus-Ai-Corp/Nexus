import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { UserOutlined, FileTextOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import NLPCommandPanel from './components/NLPCommandPanel';
import BizFlowPanel from './components/platforms/BizFlowPanel';
import NeoVibePanel from './components/platforms/NeoVibePanel';
import AgentOrchestrationPanel from './components/platforms/AgentOrchestrationPanel';
import './App.css';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1'); // Default to BizFlow Campaigns
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline" onClick={(e) => setSelectedKey(e.key)}>
          <Menu.Item key="1" icon={<FileTextOutlined />}>
            BizFlow Campaigns
          </Menu.Item>
          <Menu.Item key="2" icon={<BarChartOutlined />}>
            NeoVibe Campaigns
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Agent Orchestration
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer }}>
          <NLPCommandPanel />
          <div style={{ marginTop: 24 }}>
            {selectedKey === '1' && <BizFlowPanel />}
            {selectedKey === '2' && <NeoVibePanel />}
            {selectedKey === '3' && <AgentOrchestrationPanel />}
            {selectedKey === '4' && (
              <div style={{ padding: 24 }}>
                <h2>Settings</h2>
                <p>Configure your account, integrations, and preferences.</p>
                <p>Settings panel coming soon...</p>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;