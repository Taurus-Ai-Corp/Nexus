import React, { useState } from 'react';
import ContentAssistant from '../components/ai/ContentAssistant';
import KeywordOptimizer from '../components/ai/KeywordOptimizer';
import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ai-tools-tabpanel-${index}`}
      aria-labelledby={`ai-tools-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `ai-tools-tab-${index}`,
    'aria-controls': `ai-tools-tabpanel-${index}`,
  };
}

const AIToolsPage: React.FC = () => {
  const [value, setValue] = useState(0);
  const [content, setContent] = useState<string>('Your content goes here. This text will be analyzed and optimized.');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const updateContent = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          AI Content Tools
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Optimize your content with our cutting-edge AI tools
        </Typography>

        <Paper sx={{ width: '100%', mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="AI tools tabs"
              centered
            >
              <Tab label="Content Assistant" {...a11yProps(0)} />
              <Tab label="Keyword Optimizer" {...a11yProps(1)} />
            </Tabs>
          </Box>
          
          <TabPanel value={value} index={0}>
            <ContentAssistant 
              initialContent={content} 
              onContentChange={updateContent} 
            />
          </TabPanel>
          
          <TabPanel value={value} index={1}>
            <KeywordOptimizer 
              content={content} 
              onOptimizedContentChange={updateContent} 
            />
          </TabPanel>
        </Paper>

        <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Our AI tools use advanced natural language processing to help you create better content.
            The Content Assistant helps you draft and improve your writing, while the Keyword Optimizer
            analyzes your text and suggests keyword improvements for better SEO performance.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AIToolsPage;
