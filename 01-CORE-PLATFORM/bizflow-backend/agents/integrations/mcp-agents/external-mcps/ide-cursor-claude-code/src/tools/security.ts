/**
 * Security Tool - Analyzes code for security vulnerabilities and best practices
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const SecurityInputSchema = z.object({
  filePath: z.string().describe('Path to the file to analyze'),
  content: z.string().describe('Content of the file to analyze'),
  language: z.string().optional().describe('Programming language of the file'),
  securityType: z.enum(['vulnerabilities', 'best_practices', 'compliance', 'authentication', 'authorization']).describe('Type of security analysis'),
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
  securityStandards: z.array(z.string()).optional().describe('Security standards to check against (OWASP, NIST, etc.)'),
  threatModel: z.string().optional().describe('Threat model context'),
  complianceFramework: z.string().optional().describe('Compliance framework (SOC2, GDPR, HIPAA, etc.)'),
});

export class SecurityTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'analyze_security';
  }

  getDescription(): string {
    return 'Analyze code for security vulnerabilities, best practices, and compliance issues. Identifies common security flaws, suggests secure coding practices, and ensures adherence to security standards.';
  }

  getInputSchema(): z.ZodSchema {
    return SecurityInputSchema;
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
          securityType: {
            type: 'string',
            enum: ['vulnerabilities', 'best_practices', 'compliance', 'authentication', 'authorization'],
            description: 'Type of security analysis',
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
          securityStandards: {
            type: 'array',
            items: { type: 'string' },
            description: 'Security standards to check against (OWASP, NIST, etc.)',
          },
          threatModel: {
            type: 'string',
            description: 'Threat model context',
          },
          complianceFramework: {
            type: 'string',
            description: 'Compliance framework (SOC2, GDPR, HIPAA, etc.)',
          },
        },
        required: ['filePath', 'content', 'securityType'],
      },
    };
  }

  async execute(args: any): Promise<ToolResult> {
    try {
      const startTime = Date.now();
      
      // Validate input
      const validatedArgs = SecurityInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Perform security analysis using code analysis with security focus
      const analysisResult = await this.claudeAgent.analyzeCode(context);
      
      // Enhance with security-specific analysis
      const securityResult = this.enhanceWithSecurityAnalysis(analysisResult, validatedArgs);
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(securityResult, {
        executionTime,
        confidence: this.calculateConfidence(securityResult),
        securityType: validatedArgs.securityType,
        standards: validatedArgs.securityStandards || [],
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Security analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private enhanceWithSecurityAnalysis(analysisResult: any, args: any): any {
    // Enhance the basic analysis with security-specific insights
    const securityIssues = this.identifySecurityIssues(analysisResult, args);
    const securitySuggestions = this.generateSecuritySuggestions(analysisResult, args);
    const complianceCheck = this.performComplianceCheck(analysisResult, args);

    return {
      ...analysisResult,
      securityAnalysis: {
        type: args.securityType,
        issues: securityIssues,
        suggestions: securitySuggestions,
        compliance: complianceCheck,
        riskLevel: this.calculateRiskLevel(securityIssues),
        recommendations: this.generateSecurityRecommendations(args),
      },
    };
  }

  private identifySecurityIssues(analysisResult: any, args: any): any[] {
    const issues = [];
    const content = args.content.toLowerCase();
    
    // Common security vulnerabilities
    if (content.includes('eval(') || content.includes('new function(')) {
      issues.push({
        type: 'vulnerability',
        severity: 'high',
        category: 'code_injection',
        message: 'Potential code injection vulnerability detected',
        line: this.findLineNumber(args.content, 'eval(') || this.findLineNumber(args.content, 'new function('),
        fix: 'Avoid using eval() or new Function() with user input',
      });
    }
    
    if (content.includes('innerhtml') && content.includes('user')) {
      issues.push({
        type: 'vulnerability',
        severity: 'high',
        category: 'xss',
        message: 'Potential XSS vulnerability - innerHTML with user input',
        line: this.findLineNumber(args.content, 'innerhtml'),
        fix: 'Use textContent or proper sanitization for user input',
      });
    }
    
    if (content.includes('password') && content.includes('console.log')) {
      issues.push({
        type: 'vulnerability',
        severity: 'medium',
        category: 'information_disclosure',
        message: 'Password logging detected',
        line: this.findLineNumber(args.content, 'console.log'),
        fix: 'Remove password logging in production code',
      });
    }
    
    if (content.includes('http://') && !content.includes('localhost')) {
      issues.push({
        type: 'vulnerability',
        severity: 'medium',
        category: 'insecure_communication',
        message: 'Insecure HTTP protocol detected',
        line: this.findLineNumber(args.content, 'http://'),
        fix: 'Use HTTPS for all external communications',
      });
    }
    
    return issues;
  }

  private generateSecuritySuggestions(analysisResult: any, args: any): any[] {
    const suggestions = [];
    
    if (args.securityType === 'authentication') {
      suggestions.push({
        type: 'best_practice',
        message: 'Implement multi-factor authentication',
        priority: 'high',
      });
      suggestions.push({
        type: 'best_practice',
        message: 'Use secure password hashing (bcrypt, scrypt)',
        priority: 'high',
      });
    }
    
    if (args.securityType === 'authorization') {
      suggestions.push({
        type: 'best_practice',
        message: 'Implement role-based access control (RBAC)',
        priority: 'high',
      });
      suggestions.push({
        type: 'best_practice',
        message: 'Validate permissions on every request',
        priority: 'medium',
      });
    }
    
    return suggestions;
  }

  private performComplianceCheck(analysisResult: any, args: any): any {
    const compliance = {
      framework: args.complianceFramework || 'general',
      status: 'unknown',
      issues: [],
      recommendations: [],
    };
    
    if (args.complianceFramework === 'GDPR') {
      compliance.recommendations.push('Implement data encryption at rest and in transit');
      compliance.recommendations.push('Add data retention policies');
      compliance.recommendations.push('Implement user consent management');
    }
    
    if (args.complianceFramework === 'SOC2') {
      compliance.recommendations.push('Implement comprehensive logging and monitoring');
      compliance.recommendations.push('Add access controls and audit trails');
      compliance.recommendations.push('Document security policies and procedures');
    }
    
    return compliance;
  }

  private calculateRiskLevel(securityIssues: any[]): string {
    const highSeverityCount = securityIssues.filter(issue => issue.severity === 'high').length;
    const mediumSeverityCount = securityIssues.filter(issue => issue.severity === 'medium').length;
    
    if (highSeverityCount > 0) return 'high';
    if (mediumSeverityCount > 2) return 'medium';
    if (securityIssues.length > 0) return 'low';
    return 'minimal';
  }

  private generateSecurityRecommendations(args: any): string[] {
    const recommendations = [];
    
    recommendations.push('Implement input validation and sanitization');
    recommendations.push('Use parameterized queries to prevent SQL injection');
    recommendations.push('Implement proper error handling without information disclosure');
    recommendations.push('Use HTTPS for all communications');
    recommendations.push('Implement proper session management');
    recommendations.push('Regular security audits and penetration testing');
    
    return recommendations;
  }

  private findLineNumber(content: string, searchTerm: string): number | null {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(searchTerm.toLowerCase())) {
        return i + 1;
      }
    }
    return null;
  }

  private calculateConfidence(securityResult: any): number {
    // Calculate confidence based on the quality of security analysis
    let confidence = 0.7; // Base confidence for security analysis
    
    if (securityResult.securityAnalysis?.issues?.length > 0) {
      confidence += 0.1;
    }
    
    if (securityResult.securityAnalysis?.suggestions?.length > 0) {
      confidence += 0.1;
    }
    
    if (securityResult.securityAnalysis?.recommendations?.length > 0) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
}
