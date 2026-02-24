# Claude Code MCP Server - Usage Examples

This document provides comprehensive examples of how to use the Claude Code MCP Server with various tools and scenarios.

## Table of Contents

1. [Code Analysis Examples](#code-analysis-examples)
2. [Code Generation Examples](#code-generation-examples)
3. [Code Refactoring Examples](#code-refactoring-examples)
4. [Documentation Examples](#documentation-examples)
5. [Debugging Examples](#debugging-examples)
6. [Testing Examples](#testing-examples)
7. [Performance Analysis Examples](#performance-analysis-examples)
8. [Security Analysis Examples](#security-analysis-examples)
9. [Git Integration Examples](#git-integration-examples)
10. [Project Management Examples](#project-management-examples)

## Code Analysis Examples

### Basic Code Analysis

```json
{
  "tool": "analyze_code",
  "parameters": {
    "filePath": "src/components/Button.tsx",
    "content": "import React from 'react';\n\ninterface ButtonProps {\n  onClick: () => void;\n  children: React.ReactNode;\n  disabled?: boolean;\n}\n\nexport const Button: React.FC<ButtonProps> = ({ onClick, children, disabled = false }) => {\n  return (\n    <button \n      onClick={onClick} \n      disabled={disabled}\n      className=\"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600\"\n    >\n      {children}\n    </button>\n  );\n};",
    "language": "typescript",
    "focusAreas": ["performance", "maintainability"]
  }
}
```

### Advanced Code Analysis with Project Context

```json
{
  "tool": "analyze_code",
  "parameters": {
    "filePath": "src/services/api.ts",
    "content": "// API service implementation",
    "language": "typescript",
    "projectStructure": [
      "src/",
      "src/components/",
      "src/services/",
      "src/types/",
      "src/utils/"
    ],
    "dependencies": ["axios", "react", "typescript"],
    "focusAreas": ["security", "performance", "maintainability"]
  }
}
```

## Code Generation Examples

### React Component Generation

```json
{
  "tool": "generate_code",
  "parameters": {
    "requirements": "Create a reusable modal component with backdrop, close button, and customizable content",
    "language": "typescript",
    "framework": "react",
    "style": "object-oriented",
    "includeTests": true,
    "includeDocumentation": true,
    "patterns": ["compound-component", "render-props"]
  }
}
```

### API Service Generation

```json
{
  "tool": "generate_code",
  "parameters": {
    "requirements": "Create a REST API service for user management with CRUD operations, authentication, and error handling",
    "language": "typescript",
    "framework": "express",
    "includeTests": true,
    "includeDocumentation": true,
    "constraints": ["Use TypeScript", "Implement proper error handling", "Include input validation"]
  }
}
```

### Python Data Processing

```json
{
  "tool": "generate_code",
  "parameters": {
    "requirements": "Create a data processing pipeline that reads CSV files, cleans data, and exports to JSON",
    "language": "python",
    "includeTests": true,
    "includeDocumentation": true,
    "patterns": ["pipeline", "builder"]
  }
}
```

## Code Refactoring Examples

### Optimization Refactoring

```json
{
  "tool": "refactor_code",
  "parameters": {
    "filePath": "src/utils/dataProcessor.ts",
    "content": "// Original code with performance issues",
    "language": "typescript",
    "refactorType": "optimize",
    "preserveBehavior": true,
    "specificIssues": ["slow loops", "memory leaks", "inefficient algorithms"]
  }
}
```

### Modernization Refactoring

```json
{
  "tool": "refactor_code",
  "parameters": {
    "filePath": "src/components/LegacyComponent.js",
    "content": "// Legacy JavaScript component",
    "language": "javascript",
    "refactorType": "modernize",
    "preserveBehavior": true
  }
}
```

### Code Extraction

```json
{
  "tool": "refactor_code",
  "parameters": {
    "filePath": "src/services/userService.ts",
    "content": "// Large service with multiple responsibilities",
    "language": "typescript",
    "refactorType": "extract",
    "preserveBehavior": true,
    "selection": {
      "start": { "line": 50, "character": 0 },
      "end": { "line": 100, "character": 0 }
    }
  }
}
```

## Documentation Examples

### API Documentation

```json
{
  "tool": "generate_documentation",
  "parameters": {
    "filePath": "src/api/users.ts",
    "content": "// User API endpoints",
    "language": "typescript",
    "docType": "api",
    "targetAudience": "developers",
    "includeExamples": true,
    "includeDiagrams": true
  }
}
```

### Inline Documentation

```json
{
  "tool": "generate_documentation",
  "parameters": {
    "filePath": "src/utils/calculations.ts",
    "content": "// Mathematical utility functions",
    "language": "typescript",
    "docType": "inline",
    "targetAudience": "maintainers"
  }
}
```

### Architecture Documentation

```json
{
  "tool": "generate_documentation",
  "parameters": {
    "filePath": "src/",
    "content": "// Project root",
    "language": "typescript",
    "docType": "architecture",
    "targetAudience": "developers",
    "includeDiagrams": true
  }
}
```

## Debugging Examples

### Error Debugging

```json
{
  "tool": "debug_code",
  "parameters": {
    "filePath": "src/components/DataTable.tsx",
    "content": "// Component with runtime error",
    "language": "typescript",
    "errorMessage": "TypeError: Cannot read property 'map' of undefined",
    "stackTrace": "at DataTable.render (DataTable.tsx:45:12)\nat React.createElement (react-dom.js:1234:5)",
    "debugLevel": "detailed",
    "runtimeEnvironment": "browser"
  }
}
```

### Logic Error Debugging

```json
{
  "tool": "debug_code",
  "parameters": {
    "filePath": "src/services/calculator.ts",
    "content": "// Calculator service with logic errors",
    "language": "typescript",
    "debugLevel": "comprehensive"
  }
}
```

## Testing Examples

### Unit Test Generation

```json
{
  "tool": "generate_tests",
  "parameters": {
    "filePath": "src/services/auth.ts",
    "content": "// Authentication service",
    "language": "typescript",
    "testType": "unit",
    "framework": "jest",
    "includeMocks": true,
    "testCoverage": 90
  }
}
```

### Integration Test Generation

```json
{
  "tool": "generate_tests",
  "parameters": {
    "filePath": "src/api/users.ts",
    "content": "// User API endpoints",
    "language": "typescript",
    "testType": "integration",
    "framework": "supertest",
    "includeMocks": true
  }
}
```

### E2E Test Generation

```json
{
  "tool": "generate_tests",
  "parameters": {
    "filePath": "src/components/CheckoutFlow.tsx",
    "content": "// Checkout flow component",
    "language": "typescript",
    "testType": "e2e",
    "framework": "playwright",
    "includeMocks": false
  }
}
```

## Performance Analysis Examples

### Bottleneck Analysis

```json
{
  "tool": "analyze_performance",
  "parameters": {
    "filePath": "src/components/DataTable.tsx",
    "content": "// Large data table component",
    "language": "typescript",
    "analysisType": "bottlenecks",
    "optimizationLevel": "aggressive",
    "performanceMetrics": {
      "renderTime": 500,
      "memoryUsage": 100,
      "reRenders": 10
    }
  }
}
```

### Memory Analysis

```json
{
  "tool": "analyze_performance",
  "parameters": {
    "filePath": "src/services/dataProcessor.ts",
    "content": "// Data processing service",
    "language": "typescript",
    "analysisType": "memory",
    "targetEnvironment": "node"
  }
}
```

## Security Analysis Examples

### Vulnerability Scanning

```json
{
  "tool": "analyze_security",
  "parameters": {
    "filePath": "src/api/auth.ts",
    "content": "// Authentication API",
    "language": "typescript",
    "securityType": "vulnerabilities",
    "securityStandards": ["OWASP", "NIST"],
    "threatModel": "web-application"
  }
}
```

### Best Practices Check

```json
{
  "tool": "analyze_security",
  "parameters": {
    "filePath": "src/services/userService.ts",
    "content": "// User service implementation",
    "language": "typescript",
    "securityType": "best_practices",
    "complianceFramework": "SOC2"
  }
}
```

## Git Integration Examples

### Commit Message Generation

```json
{
  "tool": "git_integration",
  "parameters": {
    "filePath": "src/components/Button.tsx",
    "content": "// Updated button component",
    "language": "typescript",
    "gitOperation": "commit_message",
    "changedFiles": [
      "src/components/Button.tsx",
      "src/styles/button.css"
    ],
    "gitHistory": [
      "feat: add new button component",
      "fix: resolve button styling issues",
      "refactor: improve button accessibility"
    ]
  }
}
```

### Branch Strategy

```json
{
  "tool": "git_integration",
  "parameters": {
    "filePath": "src/",
    "content": "// Project root",
    "language": "typescript",
    "gitOperation": "branch_strategy",
    "currentBranch": "feature/user-authentication",
    "gitHistory": [
      "feat: add user authentication",
      "feat: implement login form",
      "feat: add password validation"
    ]
  }
}
```

### Merge Conflict Resolution

```json
{
  "tool": "git_integration",
  "parameters": {
    "filePath": "src/components/Header.tsx",
    "content": "// Header component",
    "language": "typescript",
    "gitOperation": "merge_conflict",
    "conflictContent": "<<<<<<< HEAD\nconst Header = () => {\n  return <div>New Header</div>;\n};\n=======\nconst Header = () => {\n  return <header>Updated Header</header>;\n};\n>>>>>>> feature/header-update"
  }
}
```

## Project Management Examples

### Architecture Review

```json
{
  "tool": "project_management",
  "parameters": {
    "filePath": "src/",
    "content": "// Project root",
    "language": "typescript",
    "projectOperation": "architecture_review",
    "projectStructure": [
      "src/",
      "src/components/",
      "src/services/",
      "src/types/",
      "src/utils/",
      "src/hooks/",
      "tests/",
      "docs/"
    ],
    "dependencies": [
      "react",
      "typescript",
      "jest",
      "axios",
      "lodash"
    ],
    "projectGoals": [
      "Scalable frontend architecture",
      "Type safety",
      "Test coverage > 80%",
      "Performance optimization"
    ]
  }
}
```

### Dependency Analysis

```json
{
  "tool": "project_management",
  "parameters": {
    "filePath": "package.json",
    "content": "// Package.json content",
    "language": "json",
    "projectOperation": "dependency_analysis",
    "projectStructure": ["src/", "tests/", "docs/"],
    "dependencies": [
      "react@18.2.0",
      "typescript@4.9.0",
      "jest@29.0.0",
      "axios@1.0.0",
      "lodash@4.17.21"
    ],
    "packageJson": {
      "dependencies": {
        "react": "^18.2.0",
        "typescript": "^4.9.0",
        "jest": "^29.0.0",
        "axios": "^1.0.0",
        "lodash": "^4.17.21"
      }
    }
  }
}
```

### Technical Debt Assessment

```json
{
  "tool": "project_management",
  "parameters": {
    "filePath": "src/",
    "content": "// Project root",
    "language": "typescript",
    "projectOperation": "technical_debt",
    "projectStructure": [
      "src/",
      "src/components/",
      "src/services/",
      "src/utils/"
    ],
    "constraints": [
      "Budget: $10,000",
      "Timeline: 3 months",
      "Team size: 3 developers"
    ]
  }
}
```

### Migration Planning

```json
{
  "tool": "project_management",
  "parameters": {
    "filePath": "src/",
    "content": "// Project root",
    "language": "javascript",
    "projectOperation": "migration_plan",
    "projectStructure": [
      "src/",
      "src/components/",
      "src/services/"
    ],
    "dependencies": [
      "react@16.8.0",
      "javascript",
      "webpack@4.0.0"
    ],
    "projectGoals": [
      "Migrate to TypeScript",
      "Upgrade to React 18",
      "Modernize build tools",
      "Improve performance"
    ]
  }
}
```

## Best Practices

### 1. Provide Context
Always include relevant project context when using tools:
- Project structure
- Dependencies
- Current branch
- Recent changes

### 2. Be Specific
Provide specific requirements and constraints:
- Clear descriptions
- Specific frameworks
- Performance requirements
- Security standards

### 3. Use Appropriate Tools
Choose the right tool for the task:
- Use `analyze_code` for quality assessment
- Use `generate_code` for new implementations
- Use `refactor_code` for improvements
- Use `debug_code` for problem solving

### 4. Iterate and Refine
Use the tools iteratively:
- Start with analysis
- Generate initial code
- Refine based on feedback
- Add tests and documentation

### 5. Monitor Performance
Keep track of tool performance:
- Execution times
- Confidence scores
- Error rates
- User satisfaction

## Error Handling

### Common Error Scenarios

1. **Invalid Input Schema**
   - Ensure all required parameters are provided
   - Check parameter types and formats
   - Validate file paths and content

2. **API Rate Limits**
   - Implement retry logic
   - Use caching when appropriate
   - Monitor API usage

3. **Tool Execution Failures**
   - Check error messages
   - Verify input parameters
   - Review tool-specific requirements

4. **Network Issues**
   - Implement timeout handling
   - Add retry mechanisms
   - Provide fallback options

### Debugging Tips

1. **Enable Debug Logging**
   ```bash
   export LOG_LEVEL=debug
   ```

2. **Check Tool Responses**
   - Review confidence scores
   - Analyze error messages
   - Validate output quality

3. **Test with Simple Cases**
   - Start with basic examples
   - Gradually increase complexity
   - Verify expected behavior

## Conclusion

The Claude Code MCP Server provides powerful tools for code assistance. By following these examples and best practices, you can effectively leverage the server's capabilities to improve your development workflow and code quality.

For more information, refer to the main README.md file and the API documentation.
