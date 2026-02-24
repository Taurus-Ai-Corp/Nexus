/**
 * Claude Code Agent - Core AI assistant for VS Code/Cursor integration
 * Provides intelligent code analysis, generation, and assistance capabilities
 */

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

export interface CodeContext {
  filePath: string;
  content: string;
  language: string;
  cursorPosition?: {
    line: number;
    character: number;
  };
  selection?: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  projectStructure?: string[];
  dependencies?: string[];
  gitHistory?: string[];
}

export interface CodeSuggestion {
  type: 'completion' | 'refactor' | 'fix' | 'optimization' | 'documentation';
  content: string;
  explanation: string;
  confidence: number;
  lineStart?: number;
  lineEnd?: number;
}

export interface AnalysisResult {
  issues: Array<{
    type: 'error' | 'warning' | 'info' | 'suggestion';
    message: string;
    line?: number;
    column?: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    fix?: string;
  }>;
  metrics: {
    complexity: number;
    maintainability: number;
    readability: number;
    testCoverage?: number;
  };
  suggestions: CodeSuggestion[];
}

export class ClaudeCodeAgent {
  private anthropic: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022') {
    this.anthropic = new Anthropic({
      apiKey,
    });
    this.model = model;
  }

  /**
   * Analyze code for issues, metrics, and suggestions
   */
  async analyzeCode(context: CodeContext): Promise<AnalysisResult> {
    const prompt = this.buildAnalysisPrompt(context);
    
    try {
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return this.parseAnalysisResponse(content.text);
      }
      
      throw new Error('Invalid response format from Claude');
    } catch (error) {
      console.error('Code analysis failed:', error);
      throw new Error(`Code analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate code based on requirements and context
   */
  async generateCode(
    requirements: string,
    context: CodeContext,
    options: {
      language?: string;
      framework?: string;
      style?: 'functional' | 'object-oriented' | 'procedural';
      includeTests?: boolean;
      includeDocumentation?: boolean;
    } = {}
  ): Promise<{
    code: string;
    explanation: string;
    tests?: string;
    documentation?: string;
  }> {
    const prompt = this.buildGenerationPrompt(requirements, context, options);
    
    try {
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return this.parseGenerationResponse(content.text);
      }
      
      throw new Error('Invalid response format from Claude');
    } catch (error) {
      console.error('Code generation failed:', error);
      throw new Error(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refactor code to improve quality, readability, or performance
   */
  async refactorCode(
    context: CodeContext,
    refactorType: 'optimize' | 'simplify' | 'modernize' | 'clean' | 'extract'
  ): Promise<{
    refactoredCode: string;
    explanation: string;
    changes: Array<{
      type: string;
      description: string;
      lineStart: number;
      lineEnd: number;
    }>;
  }> {
    const prompt = this.buildRefactoringPrompt(context, refactorType);
    
    try {
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.2,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return this.parseRefactoringResponse(content.text);
      }
      
      throw new Error('Invalid response format from Claude');
    } catch (error) {
      console.error('Code refactoring failed:', error);
      throw new Error(`Code refactoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate comprehensive documentation for code
   */
  async generateDocumentation(
    context: CodeContext,
    docType: 'api' | 'inline' | 'readme' | 'architecture' | 'tutorial'
  ): Promise<{
    documentation: string;
    format: 'markdown' | 'jsdoc' | 'tsdoc' | 'asciidoc';
    sections: string[];
  }> {
    const prompt = this.buildDocumentationPrompt(context, docType);
    
    try {
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return this.parseDocumentationResponse(content.text);
      }
      
      throw new Error('Invalid response format from Claude');
    } catch (error) {
      console.error('Documentation generation failed:', error);
      throw new Error(`Documentation generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Debug code and provide solutions
   */
  async debugCode(
    context: CodeContext,
    errorMessage?: string,
    stackTrace?: string
  ): Promise<{
    issues: Array<{
      type: 'bug' | 'logic_error' | 'performance' | 'security';
      description: string;
      line?: number;
      fix: string;
      explanation: string;
    }>;
    solutions: Array<{
      approach: string;
      code: string;
      explanation: string;
      confidence: number;
    }>;
  }> {
    const prompt = this.buildDebuggingPrompt(context, errorMessage, stackTrace);
    
    try {
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return this.parseDebuggingResponse(content.text);
      }
      
      throw new Error('Invalid response format from Claude');
    } catch (error) {
      console.error('Code debugging failed:', error);
      throw new Error(`Code debugging failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate tests for code
   */
  async generateTests(
    context: CodeContext,
    testType: 'unit' | 'integration' | 'e2e' | 'performance',
    framework?: string
  ): Promise<{
    tests: string;
    framework: string;
    coverage: {
      statements: number;
      branches: number;
      functions: number;
      lines: number;
    };
    testCases: Array<{
      name: string;
      description: string;
      type: 'positive' | 'negative' | 'edge_case';
    }>;
  }> {
    const prompt = this.buildTestingPrompt(context, testType, framework);
    
    try {
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.2,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return this.parseTestingResponse(content.text);
      }
      
      throw new Error('Invalid response format from Claude');
    } catch (error) {
      console.error('Test generation failed:', error);
      throw new Error(`Test generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods for building prompts and parsing responses

  private buildAnalysisPrompt(context: CodeContext): string {
    return `
Analyze the following code and provide a comprehensive analysis:

**File:** ${context.filePath}
**Language:** ${context.language}
${context.cursorPosition ? `**Cursor Position:** Line ${context.cursorPosition.line}, Column ${context.cursorPosition.character}` : ''}
${context.selection ? `**Selection:** Lines ${context.selection.start.line}-${context.selection.end.line}` : ''}

**Code:**
\`\`\`${context.language}
${context.content}
\`\`\`

${context.projectStructure ? `**Project Structure:**
${context.projectStructure.join('\n')}` : ''}

${context.dependencies ? `**Dependencies:**
${context.dependencies.join(', ')}` : ''}

Please provide:
1. **Issues**: List any errors, warnings, or potential problems
2. **Metrics**: Code complexity, maintainability, and readability scores
3. **Suggestions**: Specific improvements and optimizations

Format your response as JSON with the following structure:
{
  "issues": [
    {
      "type": "error|warning|info|suggestion",
      "message": "Description of the issue",
      "line": 123,
      "column": 45,
      "severity": "low|medium|high|critical",
      "fix": "Suggested fix (optional)"
    }
  ],
  "metrics": {
    "complexity": 0-100,
    "maintainability": 0-100,
    "readability": 0-100,
    "testCoverage": 0-100
  },
  "suggestions": [
    {
      "type": "completion|refactor|fix|optimization|documentation",
      "content": "Suggested code",
      "explanation": "Why this suggestion",
      "confidence": 0-1,
      "lineStart": 123,
      "lineEnd": 125
    }
  ]
}
`;
  }

  private buildGenerationPrompt(
    requirements: string,
    context: CodeContext,
    options: any
  ): string {
    return `
Generate code based on the following requirements:

**Requirements:**
${requirements}

**Context:**
- File: ${context.filePath}
- Language: ${options.language || context.language}
- Framework: ${options.framework || 'None specified'}
- Style: ${options.style || 'object-oriented'}
- Include Tests: ${options.includeTests || false}
- Include Documentation: ${options.includeDocumentation || false}

**Existing Code Context:**
\`\`\`${context.language}
${context.content}
\`\`\`

${context.projectStructure ? `**Project Structure:**
${context.projectStructure.join('\n')}` : ''}

Please generate:
1. **Code**: The main implementation
2. **Explanation**: How the code works and why it's structured this way
3. **Tests**: ${options.includeTests ? 'Comprehensive test suite' : 'Not required'}
4. **Documentation**: ${options.includeDocumentation ? 'API documentation and comments' : 'Not required'}

Format your response as JSON with the following structure:
{
  "code": "Generated code here",
  "explanation": "Detailed explanation",
  "tests": "Test code (if requested)",
  "documentation": "Documentation (if requested)"
}
`;
  }

  private buildRefactoringPrompt(context: CodeContext, refactorType: string): string {
    return `
Refactor the following code to ${refactorType} it:

**File:** ${context.filePath}
**Language:** ${context.language}
**Refactor Type:** ${refactorType}

**Code:**
\`\`\`${context.language}
${context.content}
\`\`\`

${context.projectStructure ? `**Project Structure:**
${context.projectStructure.join('\n')}` : ''}

Please provide:
1. **Refactored Code**: The improved version
2. **Explanation**: What changes were made and why
3. **Changes**: Detailed list of modifications

Format your response as JSON with the following structure:
{
  "refactoredCode": "Refactored code here",
  "explanation": "Explanation of changes",
  "changes": [
    {
      "type": "Type of change",
      "description": "What was changed",
      "lineStart": 123,
      "lineEnd": 125
    }
  ]
}
`;
  }

  private buildDocumentationPrompt(context: CodeContext, docType: string): string {
    return `
Generate ${docType} documentation for the following code:

**File:** ${context.filePath}
**Language:** ${context.language}
**Documentation Type:** ${docType}

**Code:**
\`\`\`${context.language}
${context.content}
\`\`\`

${context.projectStructure ? `**Project Structure:**
${context.projectStructure.join('\n')}` : ''}

Please provide comprehensive documentation in the appropriate format.

Format your response as JSON with the following structure:
{
  "documentation": "Generated documentation",
  "format": "markdown|jsdoc|tsdoc|asciidoc",
  "sections": ["Section 1", "Section 2", "Section 3"]
}
`;
  }

  private buildDebuggingPrompt(
    context: CodeContext,
    errorMessage?: string,
    stackTrace?: string
  ): string {
    return `
Debug the following code and provide solutions:

**File:** ${context.filePath}
**Language:** ${context.language}

**Code:**
\`\`\`${context.language}
${context.content}
\`\`\`

${errorMessage ? `**Error Message:** ${errorMessage}` : ''}
${stackTrace ? `**Stack Trace:** ${stackTrace}` : ''}

${context.projectStructure ? `**Project Structure:**
${context.projectStructure.join('\n')}` : ''}

Please provide:
1. **Issues**: Identified bugs and problems
2. **Solutions**: Multiple approaches to fix the issues

Format your response as JSON with the following structure:
{
  "issues": [
    {
      "type": "bug|logic_error|performance|security",
      "description": "Description of the issue",
      "line": 123,
      "fix": "Suggested fix",
      "explanation": "Why this fix works"
    }
  ],
  "solutions": [
    {
      "approach": "Approach name",
      "code": "Fixed code",
      "explanation": "How this solution works",
      "confidence": 0.95
    }
  ]
}
`;
  }

  private buildTestingPrompt(
    context: CodeContext,
    testType: string,
    framework?: string
  ): string {
    return `
Generate ${testType} tests for the following code:

**File:** ${context.filePath}
**Language:** ${context.language}
**Test Type:** ${testType}
**Framework:** ${framework || 'Default for language'}

**Code:**
\`\`\`${context.language}
${context.content}
\`\`\`

${context.projectStructure ? `**Project Structure:**
${context.projectStructure.join('\n')}` : ''}

Please provide comprehensive tests with coverage analysis.

Format your response as JSON with the following structure:
{
  "tests": "Generated test code",
  "framework": "Test framework used",
  "coverage": {
    "statements": 85,
    "branches": 80,
    "functions": 90,
    "lines": 88
  },
  "testCases": [
    {
      "name": "test_example",
      "description": "What this test does",
      "type": "positive|negative|edge_case"
    }
  ]
}
`;
  }

  // Response parsing methods
  private parseAnalysisResponse(response: string): AnalysisResult {
    try {
      const parsed = JSON.parse(response);
      return {
        issues: parsed.issues || [],
        metrics: parsed.metrics || { complexity: 0, maintainability: 0, readability: 0 },
        suggestions: parsed.suggestions || [],
      };
    } catch (error) {
      console.error('Failed to parse analysis response:', error);
      return {
        issues: [],
        metrics: { complexity: 0, maintainability: 0, readability: 0 },
        suggestions: [],
      };
    }
  }

  private parseGenerationResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse generation response:', error);
      return {
        code: response,
        explanation: 'Generated code (parsing failed)',
      };
    }
  }

  private parseRefactoringResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse refactoring response:', error);
      return {
        refactoredCode: response,
        explanation: 'Refactored code (parsing failed)',
        changes: [],
      };
    }
  }

  private parseDocumentationResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse documentation response:', error);
      return {
        documentation: response,
        format: 'markdown',
        sections: [],
      };
    }
  }

  private parseDebuggingResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse debugging response:', error);
      return {
        issues: [],
        solutions: [],
      };
    }
  }

  private parseTestingResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse testing response:', error);
      return {
        tests: response,
        framework: 'unknown',
        coverage: { statements: 0, branches: 0, functions: 0, lines: 0 },
        testCases: [],
      };
    }
  }
}
