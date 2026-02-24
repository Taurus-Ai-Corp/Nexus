/**
 * Code Analysis Tool - Analyzes code for issues, metrics, and suggestions
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const CodeAnalysisInputSchema = z.object({
  filePath: z.string().describe('Path to the file to analyze'),
  content: z.string().describe('Content of the file to analyze'),
  language: z.string().optional().describe('Programming language of the file'),
  cursorPosition: z.object({
    line: z.number(),
    character: z.number(),
  }).optional().describe('Current cursor position'),
  selection: z.object({
    start: z.object({ line: z.number(), character: z.number() }),
    end: z.object({ line: z.number(), character: z.number() }),
  }).optional().describe('Selected text range'),
  projectStructure: z.array(z.string()).optional().describe('Project file structure'),
  dependencies: z.array(z.string()).optional().describe('Project dependencies'),
  gitHistory: z.array(z.string()).optional().describe('Recent git history'),
  focusAreas: z.array(z.enum(['performance', 'security', 'maintainability', 'readability', 'testing'])).optional().describe('Specific areas to focus analysis on'),
});

export class CodeAnalysisTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'analyze_code';
  }

  getDescription(): string {
    return 'Analyze code for issues, metrics, and improvement suggestions. Provides comprehensive code quality assessment including complexity analysis, potential bugs, performance issues, and refactoring recommendations.';
  }

  getInputSchema(): z.ZodSchema {
    return CodeAnalysisInputSchema;
  }

  getToolDefinition(): any {
    return {
      name: this.getName(),
      description: this.getDescription(),
      inputSchema: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Path to the file to analyze',
          },
          content: {
            type: 'string',
            description: 'Content of the file to analyze',
          },
          language: {
            type: 'string',
            description: 'Programming language of the file',
            enum: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'cpp', 'c'],
          },
          cursorPosition: {
            type: 'object',
            description: 'Current cursor position',
            properties: {
              line: { type: 'number' },
              character: { type: 'number' },
            },
          },
          selection: {
            type: 'object',
            description: 'Selected text range',
            properties: {
              start: {
                type: 'object',
                properties: {
                  line: { type: 'number' },
                  character: { type: 'number' },
                },
              },
              end: {
                type: 'object',
                properties: {
                  line: { type: 'number' },
                  character: { type: 'number' },
                },
              },
            },
          },
          projectStructure: {
            type: 'array',
            items: { type: 'string' },
            description: 'Project file structure',
          },
          dependencies: {
            type: 'array',
            items: { type: 'string' },
            description: 'Project dependencies',
          },
          gitHistory: {
            type: 'array',
            items: { type: 'string' },
            description: 'Recent git history',
          },
          focusAreas: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['performance', 'security', 'maintainability', 'readability', 'testing'],
            },
            description: 'Specific areas to focus analysis on',
          },
        },
        required: ['filePath', 'content'],
      },
    };
  }

  async execute(args: any): Promise<ToolResult> {
    try {
      const startTime = Date.now();
      
      // Validate input
      const validatedArgs = CodeAnalysisInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Perform analysis
      const analysisResult = await this.claudeAgent.analyzeCode(context);
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(analysisResult, {
        executionTime,
        confidence: this.calculateConfidence(analysisResult),
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Code analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private calculateConfidence(analysisResult: any): number {
    // Calculate confidence based on the quality of analysis
    const issueCount = analysisResult.issues?.length || 0;
    const suggestionCount = analysisResult.suggestions?.length || 0;
    const hasMetrics = analysisResult.metrics && Object.keys(analysisResult.metrics).length > 0;
    
    let confidence = 0.5; // Base confidence
    
    if (hasMetrics) confidence += 0.2;
    if (suggestionCount > 0) confidence += 0.2;
    if (issueCount > 0) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
}
