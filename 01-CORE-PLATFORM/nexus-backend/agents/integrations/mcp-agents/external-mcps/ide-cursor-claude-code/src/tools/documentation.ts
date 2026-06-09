/**
 * Documentation Tool - Generates comprehensive documentation for code
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const DocumentationInputSchema = z.object({
  filePath: z.string().describe('Path to the file to document'),
  content: z.string().describe('Content of the file to document'),
  language: z.string().optional().describe('Programming language of the file'),
  docType: z.enum(['api', 'inline', 'readme', 'architecture', 'tutorial']).describe('Type of documentation to generate'),
  cursorPosition: z.object({
    line: z.number(),
    character: z.number(),
  }).optional().describe('Current cursor position'),
  selection: z.object({
    start: z.object({ line: z.number(), character: z.number() }),
    end: z.object({ line: z.number(), character: z.number() }),
  }).optional().describe('Selected text range to document'),
  projectStructure: z.array(z.string()).optional().describe('Project file structure'),
  dependencies: z.array(z.string()).optional().describe('Project dependencies'),
  targetAudience: z.enum(['developers', 'users', 'maintainers', 'beginners']).optional().describe('Target audience for documentation'),
  includeExamples: z.boolean().optional().describe('Whether to include code examples'),
  includeDiagrams: z.boolean().optional().describe('Whether to include diagrams'),
});

export class DocumentationTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'generate_documentation';
  }

  getDescription(): string {
    return 'Generate comprehensive documentation for code including API docs, inline comments, README files, architecture diagrams, and tutorials. Supports multiple formats and target audiences.';
  }

  getInputSchema(): z.ZodSchema {
    return DocumentationInputSchema;
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
            description: 'Path to the file to document',
          },
          content: {
            type: 'string',
            description: 'Content of the file to document',
          },
          language: {
            type: 'string',
            description: 'Programming language of the file',
            enum: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'cpp', 'c'],
          },
          docType: {
            type: 'string',
            enum: ['api', 'inline', 'readme', 'architecture', 'tutorial'],
            description: 'Type of documentation to generate',
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
            description: 'Selected text range to document',
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
          targetAudience: {
            type: 'string',
            enum: ['developers', 'users', 'maintainers', 'beginners'],
            description: 'Target audience for documentation',
          },
          includeExamples: {
            type: 'boolean',
            description: 'Whether to include code examples',
          },
          includeDiagrams: {
            type: 'boolean',
            description: 'Whether to include diagrams',
          },
        },
        required: ['filePath', 'content', 'docType'],
      },
    };
  }

  async execute(args: any): Promise<ToolResult> {
    try {
      const startTime = Date.now();
      
      // Validate input
      const validatedArgs = DocumentationInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Generate documentation
      const documentationResult = await this.claudeAgent.generateDocumentation(
        context,
        validatedArgs.docType
      );
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(documentationResult, {
        executionTime,
        confidence: this.calculateConfidence(documentationResult),
        docType: validatedArgs.docType,
        format: documentationResult.format,
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Documentation generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private calculateConfidence(documentationResult: any): number {
    // Calculate confidence based on the quality of documentation
    let confidence = 0.7; // Base confidence for documentation
    
    if (documentationResult.documentation && documentationResult.documentation.length > 200) {
      confidence += 0.1;
    }
    
    if (documentationResult.sections && documentationResult.sections.length > 0) {
      confidence += 0.1;
    }
    
    if (documentationResult.format) {
      confidence += 0.1;
    }
    
    // Check for common documentation quality indicators
    const doc = documentationResult.documentation || '';
    if (doc.includes('##') || doc.includes('#')) confidence += 0.05; // Headers
    if (doc.includes('```')) confidence += 0.05; // Code blocks
    
    return Math.min(confidence, 1.0);
  }
}
