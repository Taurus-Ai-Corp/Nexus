/**
 * Code Generation Tool - Generates code based on requirements and context
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const CodeGenerationInputSchema = z.object({
  requirements: z.string().describe('Description of what code to generate'),
  filePath: z.string().optional().describe('Target file path for the generated code'),
  content: z.string().optional().describe('Existing code context'),
  language: z.string().optional().describe('Programming language for generated code'),
  framework: z.string().optional().describe('Framework or library to use'),
  style: z.enum(['functional', 'object-oriented', 'procedural']).optional().describe('Code style preference'),
  includeTests: z.boolean().optional().describe('Whether to include test code'),
  includeDocumentation: z.boolean().optional().describe('Whether to include documentation'),
  projectStructure: z.array(z.string()).optional().describe('Project file structure'),
  dependencies: z.array(z.string()).optional().describe('Project dependencies'),
  patterns: z.array(z.string()).optional().describe('Design patterns to follow'),
  constraints: z.array(z.string()).optional().describe('Constraints or requirements'),
});

export class CodeGenerationTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'generate_code';
  }

  getDescription(): string {
    return 'Generate code based on requirements and context. Creates high-quality, production-ready code with proper structure, error handling, and best practices. Supports multiple languages, frameworks, and coding styles.';
  }

  getInputSchema(): z.ZodSchema {
    return CodeGenerationInputSchema;
  }

  getToolDefinition(): any {
    return {
      name: this.getName(),
      description: this.getDescription(),
      inputSchema: {
        type: 'object',
        properties: {
          requirements: {
            type: 'string',
            description: 'Description of what code to generate',
          },
          filePath: {
            type: 'string',
            description: 'Target file path for the generated code',
          },
          content: {
            type: 'string',
            description: 'Existing code context',
          },
          language: {
            type: 'string',
            description: 'Programming language for generated code',
            enum: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'cpp', 'c'],
          },
          framework: {
            type: 'string',
            description: 'Framework or library to use',
          },
          style: {
            type: 'string',
            enum: ['functional', 'object-oriented', 'procedural'],
            description: 'Code style preference',
          },
          includeTests: {
            type: 'boolean',
            description: 'Whether to include test code',
          },
          includeDocumentation: {
            type: 'boolean',
            description: 'Whether to include documentation',
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
          patterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Design patterns to follow',
          },
          constraints: {
            type: 'array',
            items: { type: 'string' },
            description: 'Constraints or requirements',
          },
        },
        required: ['requirements'],
      },
    };
  }

  async execute(args: any): Promise<ToolResult> {
    try {
      const startTime = Date.now();
      
      // Validate input
      const validatedArgs = CodeGenerationInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Prepare generation options
      const options = {
        language: validatedArgs.language,
        framework: validatedArgs.framework,
        style: validatedArgs.style,
        includeTests: validatedArgs.includeTests,
        includeDocumentation: validatedArgs.includeDocumentation,
      };
      
      // Generate code
      const generationResult = await this.claudeAgent.generateCode(
        validatedArgs.requirements,
        context,
        options
      );
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(generationResult, {
        executionTime,
        confidence: this.calculateConfidence(generationResult),
        language: validatedArgs.language || 'typescript',
        framework: validatedArgs.framework,
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private calculateConfidence(generationResult: any): number {
    // Calculate confidence based on the quality of generated code
    let confidence = 0.7; // Base confidence for code generation
    
    if (generationResult.explanation && generationResult.explanation.length > 50) {
      confidence += 0.1;
    }
    
    if (generationResult.tests) {
      confidence += 0.1;
    }
    
    if (generationResult.documentation) {
      confidence += 0.1;
    }
    
    // Check code quality indicators
    const code = generationResult.code || '';
    if (code.includes('try') && code.includes('catch')) confidence += 0.05; // Error handling
    if (code.includes('function') || code.includes('class')) confidence += 0.05; // Structure
    
    return Math.min(confidence, 1.0);
  }
}
