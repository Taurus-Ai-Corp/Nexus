/**
 * Base tool interface for Claude Code MCP tools
 */

import { z } from 'zod';
import { ClaudeCodeAgent, CodeContext } from '../claude-code-agent.js';

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    executionTime?: number;
    tokensUsed?: number;
    confidence?: number;
  };
}

export abstract class BaseTool {
  protected claudeAgent: ClaudeCodeAgent;

  constructor(claudeAgent: ClaudeCodeAgent) {
    this.claudeAgent = claudeAgent;
  }

  abstract getName(): string;
  abstract getDescription(): string;
  abstract getInputSchema(): z.ZodSchema;
  abstract getToolDefinition(): any;
  abstract execute(args: any): Promise<ToolResult>;

  protected createCodeContext(args: any): CodeContext {
    return {
      filePath: args.filePath || '',
      content: args.content || '',
      language: args.language || 'typescript',
      cursorPosition: args.cursorPosition,
      selection: args.selection,
      projectStructure: args.projectStructure,
      dependencies: args.dependencies,
      gitHistory: args.gitHistory,
    };
  }

  protected createSuccessResult(data: any, metadata?: any): ToolResult {
    return {
      success: true,
      data,
      metadata,
    };
  }

  protected createErrorResult(error: string, metadata?: any): ToolResult {
    return {
      success: false,
      error,
      metadata,
    };
  }
}
