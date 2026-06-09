/**
 * Git Integration Tool - Provides Git-related code assistance
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const GitIntegrationInputSchema = z.object({
  filePath: z.string().describe('Path to the file to analyze'),
  content: z.string().describe('Content of the file to analyze'),
  language: z.string().optional().describe('Programming language of the file'),
  gitOperation: z.enum(['commit_message', 'branch_strategy', 'merge_conflict', 'code_review', 'blame_analysis']).describe('Type of Git operation'),
  gitHistory: z.array(z.string()).optional().describe('Recent git commit history'),
  currentBranch: z.string().optional().describe('Current git branch'),
  changedFiles: z.array(z.string()).optional().describe('Files changed in current commit'),
  commitMessage: z.string().optional().describe('Proposed commit message'),
  conflictContent: z.string().optional().describe('Merge conflict content'),
  reviewComments: z.array(z.string()).optional().describe('Code review comments'),
  cursorPosition: z.object({
    line: z.number(),
    character: z.number(),
  }).optional().describe('Current cursor position'),
  selection: z.object({
    start: z.object({ line: z.number(), character: z.number() }),
    end: z.object({ line: z.number(), character: z.number() }),
  }).optional().describe('Selected text range'),
});

export class GitIntegrationTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'git_integration';
  }

  getDescription(): string {
    return 'Provides Git-related code assistance including commit message generation, branch strategy recommendations, merge conflict resolution, code review analysis, and git blame insights.';
  }

  getInputSchema(): z.ZodSchema {
    return GitIntegrationInputSchema;
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
          gitOperation: {
            type: 'string',
            enum: ['commit_message', 'branch_strategy', 'merge_conflict', 'code_review', 'blame_analysis'],
            description: 'Type of Git operation',
          },
          gitHistory: {
            type: 'array',
            items: { type: 'string' },
            description: 'Recent git commit history',
          },
          currentBranch: {
            type: 'string',
            description: 'Current git branch',
          },
          changedFiles: {
            type: 'array',
            items: { type: 'string' },
            description: 'Files changed in current commit',
          },
          commitMessage: {
            type: 'string',
            description: 'Proposed commit message',
          },
          conflictContent: {
            type: 'string',
            description: 'Merge conflict content',
          },
          reviewComments: {
            type: 'array',
            items: { type: 'string' },
            description: 'Code review comments',
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
        },
        required: ['filePath', 'content', 'gitOperation'],
      },
    };
  }

  async execute(args: any): Promise<ToolResult> {
    try {
      const startTime = Date.now();
      
      // Validate input
      const validatedArgs = GitIntegrationInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Perform Git-specific analysis
      const gitResult = await this.performGitOperation(validatedArgs, context);
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(gitResult, {
        executionTime,
        confidence: this.calculateConfidence(gitResult),
        gitOperation: validatedArgs.gitOperation,
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Git integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private async performGitOperation(args: any, context: any): Promise<any> {
    switch (args.gitOperation) {
      case 'commit_message':
        return this.generateCommitMessage(args, context);
      case 'branch_strategy':
        return this.recommendBranchStrategy(args, context);
      case 'merge_conflict':
        return this.resolveMergeConflict(args, context);
      case 'code_review':
        return this.analyzeCodeReview(args, context);
      case 'blame_analysis':
        return this.analyzeGitBlame(args, context);
      default:
        throw new Error(`Unknown Git operation: ${args.gitOperation}`);
    }
  }

  private async generateCommitMessage(args: any, context: any): Promise<any> {
    const changes = this.analyzeChanges(args.content, args.changedFiles);
    const commitType = this.determineCommitType(changes);
    
    const commitMessage = this.createCommitMessage(commitType, changes, args.filePath);
    
    return {
      operation: 'commit_message',
      commitMessage,
      commitType,
      changes: changes,
      suggestions: this.generateCommitSuggestions(changes),
    };
  }

  private async recommendBranchStrategy(args: any, context: any): Promise<any> {
    const branchAnalysis = this.analyzeBranchPattern(args.currentBranch, args.gitHistory);
    
    return {
      operation: 'branch_strategy',
      currentBranch: args.currentBranch,
      recommendations: branchAnalysis.recommendations,
      strategy: branchAnalysis.strategy,
      nextSteps: branchAnalysis.nextSteps,
    };
  }

  private async resolveMergeConflict(args: any, context: any): Promise<any> {
    const conflictResolution = this.analyzeMergeConflict(args.conflictContent);
    
    return {
      operation: 'merge_conflict',
      conflicts: conflictResolution.conflicts,
      resolution: conflictResolution.resolution,
      explanation: conflictResolution.explanation,
      recommendations: conflictResolution.recommendations,
    };
  }

  private async analyzeCodeReview(args: any, context: any): Promise<any> {
    const reviewAnalysis = this.analyzeReviewComments(args.reviewComments, args.content);
    
    return {
      operation: 'code_review',
      comments: args.reviewComments,
      analysis: reviewAnalysis.analysis,
      suggestions: reviewAnalysis.suggestions,
      priority: reviewAnalysis.priority,
    };
  }

  private async analyzeGitBlame(args: any, context: any): Promise<any> {
    const blameAnalysis = this.analyzeBlameHistory(args.gitHistory, args.content);
    
    return {
      operation: 'blame_analysis',
      history: args.gitHistory,
      analysis: blameAnalysis.analysis,
      insights: blameAnalysis.insights,
      recommendations: blameAnalysis.recommendations,
    };
  }

  private analyzeChanges(content: string, changedFiles: string[]): any {
    // Analyze the changes made to generate appropriate commit message
    const changes = {
      added: 0,
      modified: 0,
      deleted: 0,
      features: [],
      fixes: [],
      refactors: [],
    };
    
    // Simple analysis based on content patterns
    if (content.includes('function') || content.includes('class')) {
      changes.features.push('New functionality added');
    }
    
    if (content.includes('fix') || content.includes('bug')) {
      changes.fixes.push('Bug fixes implemented');
    }
    
    if (content.includes('refactor') || content.includes('optimize')) {
      changes.refactors.push('Code refactoring');
    }
    
    return changes;
  }

  private determineCommitType(changes: any): string {
    if (changes.features.length > 0) return 'feat';
    if (changes.fixes.length > 0) return 'fix';
    if (changes.refactors.length > 0) return 'refactor';
    return 'chore';
  }

  private createCommitMessage(commitType: string, changes: any, filePath: string): string {
    const scope = this.extractScope(filePath);
    const description = this.generateDescription(changes);
    
    return `${commitType}${scope ? `(${scope})` : ''}: ${description}`;
  }

  private extractScope(filePath: string): string {
    const parts = filePath.split('/');
    if (parts.length > 1) {
      return parts[parts.length - 2];
    }
    return '';
  }

  private generateDescription(changes: any): string {
    if (changes.features.length > 0) {
      return changes.features[0].toLowerCase();
    }
    if (changes.fixes.length > 0) {
      return changes.fixes[0].toLowerCase();
    }
    if (changes.refactors.length > 0) {
      return changes.refactors[0].toLowerCase();
    }
    return 'update code';
  }

  private generateCommitSuggestions(changes: any): string[] {
    const suggestions = [];
    
    if (changes.features.length > 0) {
      suggestions.push('Consider adding tests for new features');
      suggestions.push('Update documentation if needed');
    }
    
    if (changes.fixes.length > 0) {
      suggestions.push('Add regression tests for bug fixes');
      suggestions.push('Consider adding changelog entry');
    }
    
    return suggestions;
  }

  private analyzeBranchPattern(currentBranch: string, gitHistory: string[]): any {
    const recommendations = [];
    let strategy = 'feature-branch';
    
    if (currentBranch === 'main' || currentBranch === 'master') {
      recommendations.push('Consider creating a feature branch for new changes');
      strategy = 'main-branch';
    } else if (currentBranch.startsWith('feature/')) {
      recommendations.push('Good use of feature branch naming');
      strategy = 'feature-branch';
    } else if (currentBranch.startsWith('hotfix/')) {
      recommendations.push('Hotfix branch detected - ensure quick merge to main');
      strategy = 'hotfix-branch';
    }
    
    return {
      strategy,
      recommendations,
      nextSteps: this.generateNextSteps(strategy),
    };
  }

  private generateNextSteps(strategy: string): string[] {
    switch (strategy) {
      case 'feature-branch':
        return ['Complete feature development', 'Write tests', 'Create pull request'];
      case 'hotfix-branch':
        return ['Fix the issue', 'Test thoroughly', 'Merge to main and develop'];
      default:
        return ['Review changes', 'Test functionality', 'Commit with descriptive message'];
    }
  }

  private analyzeMergeConflict(conflictContent: string): any {
    const conflicts = conflictContent.split('<<<<<<<').length - 1;
    
    return {
      conflicts,
      resolution: 'Manual resolution required',
      explanation: 'Merge conflicts detected - review and resolve manually',
      recommendations: [
        'Review each conflict carefully',
        'Choose the correct version or merge both',
        'Test the resolved code',
        'Commit the resolution',
      ],
    };
  }

  private analyzeReviewComments(comments: string[], content: string): any {
    const analysis = {
      critical: 0,
      suggestions: 0,
      questions: 0,
    };
    
    comments.forEach(comment => {
      if (comment.toLowerCase().includes('critical') || comment.toLowerCase().includes('urgent')) {
        analysis.critical++;
      } else if (comment.toLowerCase().includes('suggest') || comment.toLowerCase().includes('consider')) {
        analysis.suggestions++;
      } else if (comment.includes('?')) {
        analysis.questions++;
      }
    });
    
    return {
      analysis,
      suggestions: this.generateReviewSuggestions(analysis),
      priority: analysis.critical > 0 ? 'high' : 'medium',
    };
  }

  private generateReviewSuggestions(analysis: any): string[] {
    const suggestions = [];
    
    if (analysis.critical > 0) {
      suggestions.push('Address critical issues immediately');
    }
    
    if (analysis.suggestions > 0) {
      suggestions.push('Consider implementing suggested improvements');
    }
    
    if (analysis.questions > 0) {
      suggestions.push('Respond to reviewer questions');
    }
    
    return suggestions;
  }

  private analyzeBlameHistory(history: string[], content: string): any {
    const analysis = {
      totalCommits: history.length,
      recentChanges: history.slice(0, 5),
      patterns: this.identifyPatterns(history),
    };
    
    return {
      analysis,
      insights: this.generateBlameInsights(analysis),
      recommendations: this.generateBlameRecommendations(analysis),
    };
  }

  private identifyPatterns(history: string[]): string[] {
    const patterns = [];
    
    if (history.some(commit => commit.includes('fix'))) {
      patterns.push('Bug fixes');
    }
    
    if (history.some(commit => commit.includes('refactor'))) {
      patterns.push('Refactoring');
    }
    
    if (history.some(commit => commit.includes('feat'))) {
      patterns.push('Feature additions');
    }
    
    return patterns;
  }

  private generateBlameInsights(analysis: any): string[] {
    const insights = [];
    
    if (analysis.totalCommits > 10) {
      insights.push('This file has been modified frequently');
    }
    
    if (analysis.patterns.includes('Bug fixes')) {
      insights.push('This file has had multiple bug fixes');
    }
    
    return insights;
  }

  private generateBlameRecommendations(analysis: any): string[] {
    const recommendations = [];
    
    if (analysis.totalCommits > 10) {
      recommendations.push('Consider refactoring this file to reduce complexity');
    }
    
    if (analysis.patterns.includes('Bug fixes')) {
      recommendations.push('Add more comprehensive tests for this file');
    }
    
    return recommendations;
  }

  private calculateConfidence(gitResult: any): number {
    // Calculate confidence based on the quality of Git analysis
    let confidence = 0.6; // Base confidence for Git operations
    
    if (gitResult.commitMessage || gitResult.recommendations || gitResult.analysis) {
      confidence += 0.2;
    }
    
    if (gitResult.suggestions && gitResult.suggestions.length > 0) {
      confidence += 0.1;
    }
    
    if (gitResult.insights && gitResult.insights.length > 0) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
}
