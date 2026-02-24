/**
 * Project Management Tool - Provides project-level code assistance
 */

import { z } from 'zod';
import { BaseTool, ToolResult } from './base-tool.js';
import { ClaudeCodeAgent } from '../claude-code-agent.js';

const ProjectManagementInputSchema = z.object({
  filePath: z.string().describe('Path to the file to analyze'),
  content: z.string().describe('Content of the file to analyze'),
  language: z.string().optional().describe('Programming language of the file'),
  projectOperation: z.enum(['architecture_review', 'dependency_analysis', 'code_organization', 'technical_debt', 'migration_plan']).describe('Type of project management operation'),
  projectStructure: z.array(z.string()).describe('Project file structure'),
  dependencies: z.array(z.string()).optional().describe('Project dependencies'),
  packageJson: z.record(z.any()).optional().describe('Package.json content'),
  tsconfig: z.record(z.any()).optional().describe('TypeScript configuration'),
  buildConfig: z.record(z.any()).optional().describe('Build configuration'),
  testConfig: z.record(z.any()).optional().describe('Test configuration'),
  cursorPosition: z.object({
    line: z.number(),
    character: z.number(),
  }).optional().describe('Current cursor position'),
  selection: z.object({
    start: z.object({ line: z.number(), character: z.number() }),
    end: z.object({ line: z.number(), character: z.number() }),
  }).optional().describe('Selected text range'),
  projectGoals: z.array(z.string()).optional().describe('Project goals and objectives'),
  constraints: z.array(z.string()).optional().describe('Project constraints'),
});

export class ProjectManagementTool extends BaseTool {
  constructor(claudeAgent: ClaudeCodeAgent) {
    super(claudeAgent);
  }

  getName(): string {
    return 'project_management';
  }

  getDescription(): string {
    return 'Provides project-level code assistance including architecture review, dependency analysis, code organization recommendations, technical debt assessment, and migration planning.';
  }

  getInputSchema(): z.ZodSchema {
    return ProjectManagementInputSchema;
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
          projectOperation: {
            type: 'string',
            enum: ['architecture_review', 'dependency_analysis', 'code_organization', 'technical_debt', 'migration_plan'],
            description: 'Type of project management operation',
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
          packageJson: {
            type: 'object',
            description: 'Package.json content',
          },
          tsconfig: {
            type: 'object',
            description: 'TypeScript configuration',
          },
          buildConfig: {
            type: 'object',
            description: 'Build configuration',
          },
          testConfig: {
            type: 'object',
            description: 'Test configuration',
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
          projectGoals: {
            type: 'array',
            items: { type: 'string' },
            description: 'Project goals and objectives',
          },
          constraints: {
            type: 'array',
            items: { type: 'string' },
            description: 'Project constraints',
          },
        },
        required: ['filePath', 'content', 'projectOperation', 'projectStructure'],
      },
    };
  }

  async execute(args: any): Promise<ToolResult> {
    try {
      const startTime = Date.now();
      
      // Validate input
      const validatedArgs = ProjectManagementInputSchema.parse(args);
      
      // Create code context
      const context = this.createCodeContext(validatedArgs);
      
      // Perform project management operation
      const projectResult = await this.performProjectOperation(validatedArgs, context);
      
      const executionTime = Date.now() - startTime;
      
      return this.createSuccessResult(projectResult, {
        executionTime,
        confidence: this.calculateConfidence(projectResult),
        projectOperation: validatedArgs.projectOperation,
      });
      
    } catch (error) {
      return this.createErrorResult(
        `Project management analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private async performProjectOperation(args: any, context: any): Promise<any> {
    switch (args.projectOperation) {
      case 'architecture_review':
        return this.reviewArchitecture(args, context);
      case 'dependency_analysis':
        return this.analyzeDependencies(args, context);
      case 'code_organization':
        return this.analyzeCodeOrganization(args, context);
      case 'technical_debt':
        return this.assessTechnicalDebt(args, context);
      case 'migration_plan':
        return this.createMigrationPlan(args, context);
      default:
        throw new Error(`Unknown project operation: ${args.projectOperation}`);
    }
  }

  private async reviewArchitecture(args: any, context: any): Promise<any> {
    const architectureAnalysis = this.analyzeProjectArchitecture(args);
    
    return {
      operation: 'architecture_review',
      analysis: architectureAnalysis,
      recommendations: this.generateArchitectureRecommendations(architectureAnalysis),
      patterns: this.identifyArchitecturePatterns(args),
      concerns: this.identifyArchitectureConcerns(args),
    };
  }

  private async analyzeDependencies(args: any, context: any): Promise<any> {
    const dependencyAnalysis = this.analyzeProjectDependencies(args);
    
    return {
      operation: 'dependency_analysis',
      dependencies: dependencyAnalysis.dependencies,
      vulnerabilities: dependencyAnalysis.vulnerabilities,
      outdated: dependencyAnalysis.outdated,
      recommendations: dependencyAnalysis.recommendations,
    };
  }

  private async analyzeCodeOrganization(args: any, context: any): Promise<any> {
    const organizationAnalysis = this.analyzeProjectOrganization(args);
    
    return {
      operation: 'code_organization',
      structure: organizationAnalysis.structure,
      issues: organizationAnalysis.issues,
      recommendations: organizationAnalysis.recommendations,
      refactoring: organizationAnalysis.refactoring,
    };
  }

  private async assessTechnicalDebt(args: any, context: any): Promise<any> {
    const debtAssessment = this.assessProjectTechnicalDebt(args);
    
    return {
      operation: 'technical_debt',
      debt: debtAssessment.debt,
      priority: debtAssessment.priority,
      recommendations: debtAssessment.recommendations,
      timeline: debtAssessment.timeline,
    };
  }

  private async createMigrationPlan(args: any, context: any): Promise<any> {
    const migrationPlan = this.createProjectMigrationPlan(args);
    
    return {
      operation: 'migration_plan',
      plan: migrationPlan.plan,
      phases: migrationPlan.phases,
      risks: migrationPlan.risks,
      timeline: migrationPlan.timeline,
    };
  }

  private analyzeProjectArchitecture(args: any): any {
    const structure = args.projectStructure;
    const dependencies = args.dependencies || [];
    
    return {
      layers: this.identifyArchitectureLayers(structure),
      patterns: this.identifyArchitecturePatterns(args),
      coupling: this.analyzeCoupling(structure),
      cohesion: this.analyzeCohesion(structure),
      scalability: this.assessScalability(structure, dependencies),
    };
  }

  private identifyArchitectureLayers(structure: string[]): string[] {
    const layers = [];
    
    if (structure.some(file => file.includes('controller') || file.includes('api'))) {
      layers.push('Presentation Layer');
    }
    
    if (structure.some(file => file.includes('service') || file.includes('business'))) {
      layers.push('Business Logic Layer');
    }
    
    if (structure.some(file => file.includes('model') || file.includes('entity'))) {
      layers.push('Data Layer');
    }
    
    if (structure.some(file => file.includes('util') || file.includes('helper'))) {
      layers.push('Utility Layer');
    }
    
    return layers;
  }

  private identifyArchitecturePatterns(args: any): string[] {
    const patterns = [];
    const structure = args.projectStructure;
    
    if (structure.some(file => file.includes('component'))) {
      patterns.push('Component-Based Architecture');
    }
    
    if (structure.some(file => file.includes('module'))) {
      patterns.push('Modular Architecture');
    }
    
    if (structure.some(file => file.includes('service'))) {
      patterns.push('Service-Oriented Architecture');
    }
    
    if (structure.some(file => file.includes('api'))) {
      patterns.push('API-First Architecture');
    }
    
    return patterns;
  }

  private analyzeCoupling(structure: string[]): string {
    // Simple coupling analysis based on file structure
    const depth = Math.max(...structure.map(file => file.split('/').length));
    
    if (depth > 5) return 'High';
    if (depth > 3) return 'Medium';
    return 'Low';
  }

  private analyzeCohesion(structure: string[]): string {
    // Simple cohesion analysis
    const uniqueFolders = new Set(structure.map(file => file.split('/')[0]));
    const totalFiles = structure.length;
    const avgFilesPerFolder = totalFiles / uniqueFolders.size;
    
    if (avgFilesPerFolder > 10) return 'High';
    if (avgFilesPerFolder > 5) return 'Medium';
    return 'Low';
  }

  private assessScalability(structure: string[], dependencies: string[]): string {
    let score = 0;
    
    // Check for modular structure
    if (structure.some(file => file.includes('module'))) score += 1;
    
    // Check for separation of concerns
    if (structure.some(file => file.includes('service'))) score += 1;
    
    // Check for configuration management
    if (structure.some(file => file.includes('config'))) score += 1;
    
    // Check for testing structure
    if (structure.some(file => file.includes('test'))) score += 1;
    
    if (score >= 3) return 'High';
    if (score >= 2) return 'Medium';
    return 'Low';
  }

  private generateArchitectureRecommendations(analysis: any): string[] {
    const recommendations = [];
    
    if (analysis.coupling === 'High') {
      recommendations.push('Reduce coupling between modules');
    }
    
    if (analysis.cohesion === 'Low') {
      recommendations.push('Improve cohesion within modules');
    }
    
    if (analysis.scalability === 'Low') {
      recommendations.push('Implement modular architecture for better scalability');
    }
    
    return recommendations;
  }

  private identifyArchitectureConcerns(args: any): string[] {
    const concerns = [];
    const structure = args.projectStructure;
    
    if (!structure.some(file => file.includes('test'))) {
      concerns.push('Missing test structure');
    }
    
    if (!structure.some(file => file.includes('config'))) {
      concerns.push('Missing configuration management');
    }
    
    if (!structure.some(file => file.includes('util') || file.includes('helper'))) {
      concerns.push('Missing utility layer');
    }
    
    return concerns;
  }

  private analyzeProjectDependencies(args: any): any {
    const dependencies = args.dependencies || [];
    const packageJson = args.packageJson || {};
    
    return {
      dependencies: dependencies,
      vulnerabilities: this.checkVulnerabilities(dependencies),
      outdated: this.checkOutdatedDependencies(packageJson),
      recommendations: this.generateDependencyRecommendations(dependencies),
    };
  }

  private checkVulnerabilities(dependencies: string[]): string[] {
    // Mock vulnerability check
    const vulnerabilities = [];
    
    if (dependencies.includes('lodash') && dependencies.includes('lodash@4.17.0')) {
      vulnerabilities.push('lodash@4.17.0 has known security vulnerabilities');
    }
    
    return vulnerabilities;
  }

  private checkOutdatedDependencies(packageJson: any): string[] {
    const outdated = [];
    
    if (packageJson.dependencies) {
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        if (typeof version === 'string' && version.startsWith('^0.')) {
          outdated.push(`${name}@${version} is outdated`);
        }
      });
    }
    
    return outdated;
  }

  private generateDependencyRecommendations(dependencies: string[]): string[] {
    const recommendations = [];
    
    if (dependencies.length > 50) {
      recommendations.push('Consider reducing the number of dependencies');
    }
    
    if (dependencies.some(dep => dep.includes('@types/'))) {
      recommendations.push('Good use of TypeScript type definitions');
    }
    
    return recommendations;
  }

  private analyzeProjectOrganization(args: any): any {
    const structure = args.projectStructure;
    
    return {
      structure: this.analyzeFileStructure(structure),
      issues: this.identifyOrganizationIssues(structure),
      recommendations: this.generateOrganizationRecommendations(structure),
      refactoring: this.suggestRefactoring(structure),
    };
  }

  private analyzeFileStructure(structure: string[]): any {
    const folders = new Set();
    const files = new Set();
    
    structure.forEach(item => {
      if (item.includes('/')) {
        folders.add(item.split('/')[0]);
      } else {
        files.add(item);
      }
    });
    
    return {
      totalFiles: structure.length,
      folders: Array.from(folders),
      rootFiles: Array.from(files),
      depth: Math.max(...structure.map(file => file.split('/').length)),
    };
  }

  private identifyOrganizationIssues(structure: string[]): string[] {
    const issues = [];
    
    if (structure.length > 100) {
      issues.push('Large number of files - consider better organization');
    }
    
    if (structure.some(file => file.includes(' '))) {
      issues.push('File names contain spaces - use hyphens or underscores');
    }
    
    if (structure.some(file => file.includes('UPPERCASE'))) {
      issues.push('Inconsistent naming convention - use lowercase');
    }
    
    return issues;
  }

  private generateOrganizationRecommendations(structure: string[]): string[] {
    const recommendations = [];
    
    recommendations.push('Use consistent naming conventions');
    recommendations.push('Group related files in folders');
    recommendations.push('Separate source code from configuration');
    recommendations.push('Create clear folder hierarchy');
    
    return recommendations;
  }

  private suggestRefactoring(structure: string[]): string[] {
    const suggestions = [];
    
    if (structure.length > 50) {
      suggestions.push('Consider splitting into smaller modules');
    }
    
    if (structure.some(file => file.includes('index'))) {
      suggestions.push('Use index files for clean imports');
    }
    
    return suggestions;
  }

  private assessProjectTechnicalDebt(args: any): any {
    const structure = args.projectStructure;
    const content = args.content;
    
    return {
      debt: this.calculateTechnicalDebt(structure, content),
      priority: this.assessDebtPriority(structure, content),
      recommendations: this.generateDebtRecommendations(structure, content),
      timeline: this.estimateDebtTimeline(structure, content),
    };
  }

  private calculateTechnicalDebt(structure: string[], content: string): number {
    let debt = 0;
    
    // File count debt
    if (structure.length > 100) debt += 20;
    
    // Code complexity debt (simplified)
    if (content.includes('TODO') || content.includes('FIXME')) debt += 10;
    
    // Naming debt
    if (content.includes('temp') || content.includes('test')) debt += 5;
    
    return Math.min(debt, 100);
  }

  private assessDebtPriority(structure: string[], content: string): string {
    const debt = this.calculateTechnicalDebt(structure, content);
    
    if (debt > 70) return 'High';
    if (debt > 40) return 'Medium';
    return 'Low';
  }

  private generateDebtRecommendations(structure: string[], content: string): string[] {
    const recommendations = [];
    
    if (content.includes('TODO')) {
      recommendations.push('Address TODO comments');
    }
    
    if (structure.length > 100) {
      recommendations.push('Refactor large codebase into smaller modules');
    }
    
    recommendations.push('Improve code documentation');
    recommendations.push('Add comprehensive tests');
    
    return recommendations;
  }

  private estimateDebtTimeline(structure: string[], content: string): string {
    const debt = this.calculateTechnicalDebt(structure, content);
    
    if (debt > 70) return '2-4 weeks';
    if (debt > 40) return '1-2 weeks';
    return '3-5 days';
  }

  private createProjectMigrationPlan(args: any): any {
    const currentTech = this.identifyCurrentTechnology(args);
    const targetTech = this.suggestTargetTechnology(currentTech);
    
    return {
      plan: this.createMigrationStrategy(currentTech, targetTech),
      phases: this.defineMigrationPhases(currentTech, targetTech),
      risks: this.identifyMigrationRisks(currentTech, targetTech),
      timeline: this.estimateMigrationTimeline(currentTech, targetTech),
    };
  }

  private identifyCurrentTechnology(args: any): string[] {
    const tech = [];
    const structure = args.projectStructure;
    const dependencies = args.dependencies || [];
    
    if (structure.some(file => file.includes('.ts'))) tech.push('TypeScript');
    if (structure.some(file => file.includes('.js'))) tech.push('JavaScript');
    if (structure.some(file => file.includes('.py'))) tech.push('Python');
    
    if (dependencies.includes('react')) tech.push('React');
    if (dependencies.includes('vue')) tech.push('Vue');
    if (dependencies.includes('angular')) tech.push('Angular');
    
    return tech;
  }

  private suggestTargetTechnology(currentTech: string[]): string[] {
    const suggestions = [];
    
    if (currentTech.includes('JavaScript') && !currentTech.includes('TypeScript')) {
      suggestions.push('TypeScript');
    }
    
    if (!currentTech.includes('React') && !currentTech.includes('Vue')) {
      suggestions.push('Modern Frontend Framework');
    }
    
    return suggestions;
  }

  private createMigrationStrategy(currentTech: string[], targetTech: string[]): string[] {
    const strategy = [];
    
    if (currentTech.includes('JavaScript') && targetTech.includes('TypeScript')) {
      strategy.push('Gradual TypeScript migration');
      strategy.push('Add type definitions incrementally');
    }
    
    return strategy;
  }

  private defineMigrationPhases(currentTech: string[], targetTech: string[]): any[] {
    return [
      { phase: 1, name: 'Assessment', duration: '1 week' },
      { phase: 2, name: 'Planning', duration: '1 week' },
      { phase: 3, name: 'Implementation', duration: '2-4 weeks' },
      { phase: 4, name: 'Testing', duration: '1 week' },
      { phase: 5, name: 'Deployment', duration: '1 week' },
    ];
  }

  private identifyMigrationRisks(currentTech: string[], targetTech: string[]): string[] {
    return [
      'Breaking changes in dependencies',
      'Performance impact during migration',
      'Team learning curve for new technology',
      'Integration issues with existing systems',
    ];
  }

  private estimateMigrationTimeline(currentTech: string[], targetTech: string[]): string {
    return '6-8 weeks';
  }

  private calculateConfidence(projectResult: any): number {
    // Calculate confidence based on the quality of project analysis
    let confidence = 0.6; // Base confidence for project management
    
    if (projectResult.analysis || projectResult.recommendations) {
      confidence += 0.2;
    }
    
    if (projectResult.patterns && projectResult.patterns.length > 0) {
      confidence += 0.1;
    }
    
    if (projectResult.issues && projectResult.issues.length > 0) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
}
