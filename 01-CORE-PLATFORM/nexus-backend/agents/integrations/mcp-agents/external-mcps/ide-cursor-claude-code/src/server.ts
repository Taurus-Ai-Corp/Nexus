#!/usr/bin/env node
/**
 * Claude Code for VS Code MCP Server
 * Harness the power of Claude Code without leaving your IDE
 * 
 * @author Anthropic
 * @version 1.0.93
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { ClaudeCodeAgent } from './claude-code-agent.js';
import { CodeAnalysisTool } from './tools/code-analysis.js';
import { CodeGenerationTool } from './tools/code-generation.js';
import { CodeRefactoringTool } from './tools/code-refactoring.js';
import { DocumentationTool } from './tools/documentation.js';
import { DebuggingTool } from './tools/debugging.js';
import { TestingTool } from './tools/testing.js';
import { PerformanceTool } from './tools/performance.js';
import { SecurityTool } from './tools/security.js';
import { GitIntegrationTool } from './tools/git-integration.js';
import { ProjectManagementTool } from './tools/project-management.js';

// Environment configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY environment variable is required');
  process.exit(1);
}

// Initialize Claude Code Agent
const claudeAgent = new ClaudeCodeAgent(ANTHROPIC_API_KEY);

// Initialize MCP Server
const server = new Server(
  {
    name: 'claude-code-cursor-agent',
    version: '1.0.93',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register all tools
const tools = [
  new CodeAnalysisTool(claudeAgent),
  new CodeGenerationTool(claudeAgent),
  new CodeRefactoringTool(claudeAgent),
  new DocumentationTool(claudeAgent),
  new DebuggingTool(claudeAgent),
  new TestingTool(claudeAgent),
  new PerformanceTool(claudeAgent),
  new SecurityTool(claudeAgent),
  new GitIntegrationTool(claudeAgent),
  new ProjectManagementTool(claudeAgent),
];

// Register tools with server
tools.forEach(tool => {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [tool.getToolDefinition()],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === tool.getName()) {
      try {
        const result = await tool.execute(request.params.arguments);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
  });
});

// Error handling
server.onerror = (error) => {
  console.error('[MCP Error]', error);
};

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 Claude Code Cursor Agent MCP Server started');
}

main().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
