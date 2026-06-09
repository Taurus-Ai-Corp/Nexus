/**
 * Testing Tool - Generates comprehensive tests for code
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const TestingInputSchema = z.object({
  filePath: z.string().describe('Path to the file to test'),
  content: z.string().describe('Content of the file to test'),
  language: z.string().optional().describe('Programming language of the file'),
  testType: z.enum(['unit', 'integration', 'e2e', 'performance']).describe('Type of tests to generate'),
  framework: z.string().optional().describe('Testing framework to use'),
  cursorPosition: z.object({
    line: z.number(),
    character: z.number(),
  }).optional().describe('Current cursor position'),
  selection: z.object({
    start: z.object({ line: z.number(), character: z.number() }),
    end: z.object({ line: z.number(), character: z.number() }),
  }).optional().describe('Selected text range to test'),
  projectStructure: z.array(z.string()).optional().describe('Project file structure'),
  dependencies: z.array(z.string()).optional().describe('Project dependencies'),
  testCoverage: z.number().min(0).max(100).optional().describe('Target test coverage percentage'),
  includeMocks: z.boolean().optional().describe('Whether to include mock implementations'),
  testData: z.record(z.any()).optional().describe('Test data to use'),
});

export class TestingTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'generate_tests';
  }

  getDescription(): string {
    return 'Generate comprehensive tests for code including unit tests, integration tests, end-to-end tests, and performance tests. Supports multiple testing frameworks and provides coverage analysis.';
  }

  getInputSchema(): z.ZodSchema {
    return TestingInputSchema;
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
            description: 'Path to the file to test',
          },
          content: {
            type: 'string',
            description: 'Content of the file to test',
          },
          language: {
            type: 'string',
            description: 'Programming language of the file',
            enum: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'cpp', 'c'],
          },
          testType: {
            type: 'string',
            enum: ['unit', 'integration', 'e2e', 'performance'],
            description: 'Type of tests to generate',
          },
          framework: {
            type: 'string',
            description: 'Testing framework to use',
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
            description: 'Selected text range to test',
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
          testCoverage: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Target test coverage percentage',
          },
          includeMocks: {
            type: 'boolean',
            description: 'Whether to include mock implementations',
          },
          testData: {
            type: 'object',
            description: 'Test data to use',
          },
        },
        required: ['filePath', 'content', 'testType'],
      },
    };
  }

  async execute(args: any): Promise<ToolResult> {
    try {
      const startTime = Date.now();
      
      // Validate input
      const validatedArgs = TestingInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Generate tests
      const testingResult = await this.claudeAgent.generateTests(
        context,
        validatedArgs.testType,
        validatedArgs.framework
      );
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(testingResult, {
        executionTime,
        confidence: this.calculateConfidence(testingResult),
        testType: validatedArgs.testType,
        framework: testingResult.framework,
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Test generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private calculateConfidence(testingResult: any): number {
    // Calculate confidence based on the quality of generated tests
    let confidence = 0.7; // Base confidence for test generation
    
    if (testingResult.tests && testingResult.tests.length > 100) {
      confidence += 0.1;
    }
    
    if (testingResult.testCases && testingResult.testCases.length > 0) {
      confidence += 0.1;
    }
    
    if (testingResult.coverage) {
      const avgCoverage = (
        (testingResult.coverage.statements || 0) +
        (testingResult.coverage.branches || 0) +
        (testingResult.coverage.functions || 0) +
        (testingResult.coverage.lines || 0)
      ) / 4;
      
      if (avgCoverage > 80) confidence += 0.1;
      else if (avgCoverage > 60) confidence += 0.05;
    }
    
    if (testingResult.framework) {
      confidence += 0.05;
    }
    
    return Math.min(confidence, 1.0);
  }
}
