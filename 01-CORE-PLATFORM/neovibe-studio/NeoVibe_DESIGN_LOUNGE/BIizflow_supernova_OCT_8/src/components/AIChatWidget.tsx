'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AIAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

const aiAgents: AIAgent[] = [
  {
    id: 'support',
    name: 'BizFlow Support Assistant',
    description: 'Handles customer inquiries and provides instant support',
    capabilities: ['Answer product questions', 'Troubleshoot issues', 'Guide through features'],
  },
  {
    id: 'qualification',
    name: 'Lead Qualification Agent',
    description: 'Processes and qualifies inbound leads',
    capabilities: ['Score lead quality', 'Schedule demos', 'Provide personalized demos'],
  },
  {
    id: 'scheduling',
    name: 'Demo Scheduling Agent',
    description: 'Automates demo scheduling and calendar management',
    capabilities: ['Check availability', 'Send calendar invites', 'Reschedule appointments'],
  },
  {
    id: 'documentation',
    name: 'Documentation Assistant',
    description: 'Provides contextual help and documentation',
    capabilities: ['Answer how-to questions', 'Search documentation', 'Create tutorials'],
  },
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your BizFlow assistant. How can I help you automate your business today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AIAgent>(aiAgents[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize 21.dev SDK (placeholder for actual integration)
  useEffect(() => {
    console.log('21.dev SDK would initialize here for AI agent integration');

    // In real implementation, this would be:
    // import { TwentyOneDevSDK } from '@21dev/sdk';
    // const sdk = new TwentyOneDevSDK({ apiKey: process.env.TWENTYONE_DEV_API_KEY });
    // sdk.initialize();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual 21.dev SDK call)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Thanks for your question! I'm ${currentAgent.name}. ${getContextualResponse(inputValue)}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000 + Math.random() * 1000); // 2-3 second response time as specified
  };

  const getContextualResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('demo') || input.includes('schedule')) {
      return "I'd be happy to help you schedule a personalized demo! Our AI scheduling agent can find the perfect time for you. Would you like me to connect you with our scheduling specialist?";
    }

    if (input.includes('pricing') || input.includes('cost')) {
      return "Our pricing is designed to deliver immediate ROI. We offer a free tier to get started, Pro at $97/month, and Enterprise at $297/month. Most clients see payback within 8 months. Would you like a detailed pricing breakdown?";
    }

    if (input.includes('roi') || input.includes('return')) {
      return "Our clients typically achieve 150-300% ROI within 6-8 months. We have detailed case studies showing $500K+ monthly revenue generation from automation. Would you like to see specific examples for your industry?";
    }

    if (input.includes('integration') || input.includes('connect')) {
      return "We integrate with 15+ platforms including Salesforce, HubSpot, Slack, Notion, and more. Our MCP protocol ensures seamless data flow between systems. Which tools are you currently using?";
    }

    return "I understand you're interested in AI automation. Our platform can help automate workflows, predict trends, and make smarter decisions. Could you tell me more about your specific use case or industry?";
  };

  const handleAgentSwitch = (agent: AIAgent) => {
    setCurrentAgent(agent);
    const switchMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Switching to ${agent.name}. ${agent.description}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, switchMessage]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">{currentAgent.name}</h3>
            <p className="text-sm opacity-90">AI Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Agent Selector */}
      <div className="border-b border-gray-200 p-3">
        <select
          value={currentAgent.id}
          onChange={(e) => {
            const agent = aiAgents.find(a => a.id === e.target.value);
            if (agent) handleAgentSwitch(agent);
          }}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-primary-600 focus:outline-none"
        >
          {aiAgents.map(agent => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

