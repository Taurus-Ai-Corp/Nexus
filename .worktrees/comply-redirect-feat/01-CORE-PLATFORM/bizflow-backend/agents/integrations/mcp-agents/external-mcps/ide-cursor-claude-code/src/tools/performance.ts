/**
 * Performance Tool - Analyzes and optimizes code performance
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const PerformanceInputSchema = z.object({
  filePath: z.string().describe('Path to the file to analyze'),
  content: z.string().describe('Content of the file to analyze'),
  language: z.string().optional().describe('Programming language of the file'),
  analysisType: z.enum(['bottlenecks', 'optimization', 'profiling', 'memory', 'cpu']).describe('Type of performance analysis'),
  cursorPosition: z.object({
    line: z.number(),
    character: z.number(),
  }).optional().describe('Current cursor position'),
  selection: z.object({
    start: z.object({ line: z.number(), character: z.number() }),
    end: z.object({ line: z.number(), character: z.number() }),
  }).optional().describe('Selected text range to analyze'),
  projectStructure: z.array(z.string()).optional().describe('Project file structure'),
  dependencies: z.array(z.string()).optional().describe('Project dependencies'),
  performanceMetrics: z.record(z.number()).optional().describe('Current performance metrics'),
  targetEnvironment: z.string().optional().describe('Target runtime environment'),
  optimizationLevel: z.enum(['basic', 'aggressive', 'maximum']).optional().describe('Level of optimization'),
});

export class PerformanceTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'analyze_performance';
  }

  getDescription(): string {
    return 'Analyze and optimize code performance including identifying bottlenecks, memory leaks, CPU usage, and providing optimization recommendations. Supports multiple analysis types and optimization levels.';
  }

  getInputSchema(): z.ZodSchema {
    return PerformanceInputSchema;
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
          analysisType: {
            type: 'string',
            enum: ['bottlenecks', 'optimization', 'profiling', 'memory', 'cpu'],
            description: 'Type of performance analysis',
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
            description: 'Selected text range to analyze',
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
          performanceMetrics: {
            type: 'object',
            description: 'Current performance metrics',
          },
          targetEnvironment: {
            type: 'string',
            description: 'Target runtime environment',
          },
          optimizationLevel: {
            type: 'string',
            enum: ['basic', 'aggressive', 'maximum'],
            description: 'Level of optimization',
          },
        },
        required: ['filePath', 'content', 'analysisType'],
      },
    };
  }

  async execute(args: any): Promise<ToolResult> {
    try {
      const startTime = Date.now();
      
      // Validate input
      const validatedArgs = PerformanceInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Perform performance analysis using code analysis with performance focus
      const analysisResult = await this.claudeAgent.analyzeCode(context);
      
      // Enhance with performance-specific analysis
      const performanceResult = this.enhanceWithPerformanceAnalysis(analysisResult, validatedArgs);
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(performanceResult, {
        executionTime,
        confidence: this.calculateConfidence(performanceResult),
        analysisType: validatedArgs.analysisType,
        optimizationLevel: validatedArgs.optimizationLevel || 'basic',
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Performance analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private enhanceWithPerformanceAnalysis(analysisResult: any, args: any): any {
    // Enhance the basic analysis with performance-specific insights
    const performanceIssues = analysisResult.issues?.filter((issue: any) => 
      issue.message.toLowerCase().includes('performance') ||
      issue.message.toLowerCase().includes('slow') ||
      issue.message.toLowerCase().includes('bottleneck') ||
      issue.message.toLowerCase().includes('memory') ||
      issue.message.toLowerCase().includes('cpu')
    ) || [];

    const performanceSuggestions = analysisResult.suggestions?.filter((suggestion: any) =>
      suggestion.type === 'optimization' ||
      suggestion.explanation.toLowerCase().includes('performance') ||
      suggestion.explanation.toLowerCase().includes('optimize')
    ) || [];

    return {
      ...analysisResult,
      performanceAnalysis: {
        type: args.analysisType,
        issues: performanceIssues,
        suggestions: performanceSuggestions,
        metrics: {
          ...analysisResult.metrics,
          performanceScore: this.calculatePerformanceScore(analysisResult),
          optimizationPotential: this.calculateOptimizationPotential(analysisResult),
        },
        recommendations: this.generatePerformanceRecommendations(analysisResult, args),
      },
    };
  }

  private calculatePerformanceScore(analysisResult: any): number {
    // Calculate performance score based on code quality metrics
    const complexity = analysisResult.metrics?.complexity || 0;
    const maintainability = analysisResult.metrics?.maintainability || 0;
    const readability = analysisResult.metrics?.readability || 0;
    
    // Lower complexity and higher maintainability/readability = better performance potential
    const performanceScore = Math.max(0, 100 - (complexity * 0.3) + (maintainability * 0.4) + (readability * 0.3));
    return Math.min(performanceScore, 100);
  }

  private calculateOptimizationPotential(analysisResult: any): number {
    // Calculate how much the code can be optimized
    const issues = analysisResult.issues?.length || 0;
    const suggestions = analysisResult.suggestions?.length || 0;
    
    // More issues and suggestions = higher optimization potential
    const potential = Math.min((issues * 10) + (suggestions * 5), 100);
    return potential;
  }

  private generatePerformanceRecommendations(analysisResult: any, args: any): string[] {
    const recommendations = [];
    
    if (args.analysisType === 'bottlenecks') {
      recommendations.push('Use profiling tools to identify actual bottlenecks');
      recommendations.push('Consider caching frequently accessed data');
      recommendations.push('Optimize database queries and API calls');
    }
    
    if (args.analysisType === 'memory') {
      recommendations.push('Check for memory leaks in event listeners');
      recommendations.push('Use weak references where appropriate');
      recommendations.push('Implement proper cleanup in component unmounting');
    }
    
    if (args.analysisType === 'cpu') {
      recommendations.push('Optimize loops and recursive functions');
      recommendations.push('Use Web Workers for CPU-intensive tasks');
      recommendations.push('Implement lazy loading for heavy computations');
    }
    
    return recommendations;
  }

  private calculateConfidence(performanceResult: any): number {
    // Calculate confidence based on the quality of performance analysis
    let confidence = 0.6; // Base confidence for performance analysis
    
    if (performanceResult.performanceAnalysis?.issues?.length > 0) {
      confidence += 0.1;
    }
    
    if (performanceResult.performanceAnalysis?.suggestions?.length > 0) {
      confidence += 0.1;
    }
    
    if (performanceResult.performanceAnalysis?.recommendations?.length > 0) {
      confidence += 0.1;
    }
    
    if (performanceResult.performanceAnalysis?.metrics?.performanceScore > 70) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
}
