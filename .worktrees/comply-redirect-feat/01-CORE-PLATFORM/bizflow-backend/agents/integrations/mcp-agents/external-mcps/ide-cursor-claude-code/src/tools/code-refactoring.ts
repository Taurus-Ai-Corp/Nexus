/**
 * Code Refactoring Tool - Refactors code to improve quality and maintainability
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const CodeRefactoringInputSchema = z.object({
  filePath: z.string().describe('Path to the file to refactor'),
  content: z.string().describe('Content of the file to refactor'),
  language: z.string().optional().describe('Programming language of the file'),
  refactorType: z.enum(['optimize', 'simplify', 'modernize', 'clean', 'extract']).describe('Type of refactoring to perform'),
  cursorPosition: z.object({
    line: z.number(),
    character: z.number(),
  }).optional().describe('Current cursor position'),
  selection: z.object({
    start: z.object({ line: z.number(), character: z.number() }),
    end: z.object({ line: z.number(), character: z.number() }),
  }).optional().describe('Selected text range to refactor'),
  projectStructure: z.array(z.string()).optional().describe('Project file structure'),
  dependencies: z.array(z.string()).optional().describe('Project dependencies'),
  specificIssues: z.array(z.string()).optional().describe('Specific issues to address'),
  preserveBehavior: z.boolean().optional().describe('Whether to preserve existing behavior'),
});

export class CodeRefactoringTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'refactor_code';
  }

  getDescription(): string {
    return 'Refactor code to improve quality, readability, performance, and maintainability. Supports optimization, simplification, modernization, cleaning, and extraction refactoring patterns while preserving functionality.';
  }

  getInputSchema(): z.ZodSchema {
    return CodeRefactoringInputSchema;
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
            description: 'Path to the file to refactor',
          },
          content: {
            type: 'string',
            description: 'Content of the file to refactor',
          },
          language: {
            type: 'string',
            description: 'Programming language of the file',
            enum: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'cpp', 'c'],
          },
          refactorType: {
            type: 'string',
            enum: ['optimize', 'simplify', 'modernize', 'clean', 'extract'],
            description: 'Type of refactoring to perform',
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
            description: 'Selected text range to refactor',
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
          specificIssues: {
            type: 'array',
            items: { type: 'string' },
            description: 'Specific issues to address',
          },
          preserveBehavior: {
            type: 'boolean',
            description: 'Whether to preserve existing behavior',
          },
        },
        required: ['filePath', 'content', 'refactorType'],
      },
    };
  }

  async execute(args: any): Promise<ToolResult> {
    try {
      const startTime = Date.now();
      
      // Validate input
      const validatedArgs = CodeRefactoringInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Perform refactoring
      const refactoringResult = await this.claudeAgent.refactorCode(
        context,
        validatedArgs.refactorType
      );
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(refactoringResult, {
        executionTime,
        confidence: this.calculateConfidence(refactoringResult),
        refactorType: validatedArgs.refactorType,
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Code refactoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private calculateConfidence(refactoringResult: any): number {
    // Calculate confidence based on the quality of refactoring
    let confidence = 0.6; // Base confidence for refactoring
    
    if (refactoringResult.explanation && refactoringResult.explanation.length > 100) {
      confidence += 0.1;
    }
    
    if (refactoringResult.changes && refactoringResult.changes.length > 0) {
      confidence += 0.2;
    }
    
    // Check if refactored code is different from original
    const refactoredCode = refactoringResult.refactoredCode || '';
    if (refactoredCode.length > 0) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
}
