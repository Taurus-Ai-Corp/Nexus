/**
 * Debugging Tool - Debugs code and provides solutions
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const DebuggingInputSchema = z.object({
  filePath: z.string().describe('Path to the file to debug'),
  content: z.string().describe('Content of the file to debug'),
  language: z.string().optional().describe('Programming language of the file'),
  errorMessage: z.string().optional().describe('Error message to debug'),
  stackTrace: z.string().optional().describe('Stack trace information'),
  cursorPosition: z.object({
    line: z.number(),
    character: z.number(),
  }).optional().describe('Current cursor position'),
  selection: z.object({
    start: z.object({ line: z.number(), character: z.number() }),
    end: z.object({ line: z.number(), character: z.number() }),
  }).optional().describe('Selected text range to debug'),
  projectStructure: z.array(z.string()).optional().describe('Project file structure'),
  dependencies: z.array(z.string()).optional().describe('Project dependencies'),
  runtimeEnvironment: z.string().optional().describe('Runtime environment (Node.js, browser, etc.)'),
  debugLevel: z.enum(['basic', 'detailed', 'comprehensive']).optional().describe('Level of debugging detail'),
});

export class DebuggingTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'debug_code';
  }

  getDescription(): string {
    return 'Debug code and provide solutions for errors, bugs, and issues. Analyzes error messages, stack traces, and code logic to identify problems and suggest fixes with detailed explanations.';
  }

  getInputSchema(): z.ZodSchema {
    return DebuggingInputSchema;
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
            description: 'Path to the file to debug',
          },
          content: {
            type: 'string',
            description: 'Content of the file to debug',
          },
          language: {
            type: 'string',
            description: 'Programming language of the file',
            enum: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'cpp', 'c'],
          },
          errorMessage: {
            type: 'string',
            description: 'Error message to debug',
          },
          stackTrace: {
            type: 'string',
            description: 'Stack trace information',
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
            description: 'Selected text range to debug',
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
          runtimeEnvironment: {
            type: 'string',
            description: 'Runtime environment (Node.js, browser, etc.)',
          },
          debugLevel: {
            type: 'string',
            enum: ['basic', 'detailed', 'comprehensive'],
            description: 'Level of debugging detail',
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
      const validatedArgs = DebuggingInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Debug code
      const debuggingResult = await this.claudeAgent.debugCode(
        context,
        validatedArgs.errorMessage,
        validatedArgs.stackTrace
      );
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(debuggingResult, {
        executionTime,
        confidence: this.calculateConfidence(debuggingResult),
        debugLevel: validatedArgs.debugLevel || 'basic',
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Code debugging failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private calculateConfidence(debuggingResult: any): number {
    // Calculate confidence based on the quality of debugging
    let confidence = 0.6; // Base confidence for debugging
    
    if (debuggingResult.issues && debuggingResult.issues.length > 0) {
      confidence += 0.2;
    }
    
    if (debuggingResult.solutions && debuggingResult.solutions.length > 0) {
      confidence += 0.2;
    }
    
    // Check solution quality
    const solutions = debuggingResult.solutions || [];
    const hasHighConfidenceSolution = solutions.some((s: any) => s.confidence > 0.8);
    if (hasHighConfidenceSolution) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
}
