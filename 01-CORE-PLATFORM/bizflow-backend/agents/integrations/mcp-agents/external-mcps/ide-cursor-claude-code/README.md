# Claude Code for VS Code MCP Server

**Version:** 1.0.93  
**Publisher:** Anthropic  
**Description:** Harness the power of Claude Code without leaving your IDE

## Overview

The Claude Code MCP Server provides intelligent code assistance directly within VS Code and Cursor through the Model Context Protocol (MCP). This server offers comprehensive code analysis, generation, refactoring, documentation, debugging, testing, performance optimization, security analysis, Git integration, and project management capabilities.

## Features

### 🔍 Code Analysis
- Comprehensive code quality assessment
- Complexity, maintainability, and readability metrics
- Issue detection and suggestions
- Performance and security analysis

### 🚀 Code Generation
- Intelligent code generation based on requirements
- Support for multiple languages and frameworks
- Context-aware suggestions
- Test and documentation generation

### 🔧 Code Refactoring
- Optimization and simplification
- Modernization and cleaning
- Code extraction and restructuring
- Behavior-preserving transformations

### 📚 Documentation
- API documentation generation
- Inline code comments
- README and architecture docs
- Tutorial and guide creation

### 🐛 Debugging
- Error analysis and solutions
- Stack trace interpretation
- Bug identification and fixes
- Performance issue detection

### 🧪 Testing
- Unit, integration, and E2E test generation
- Test coverage analysis
- Mock implementation
- Test case recommendations

### ⚡ Performance
- Bottleneck identification
- Memory and CPU optimization
- Profiling recommendations
- Performance metrics analysis

### 🔒 Security
- Vulnerability detection
- Security best practices
- Compliance checking
- Threat analysis

### 🌿 Git Integration
- Commit message generation
- Branch strategy recommendations
- Merge conflict resolution
- Code review analysis

### 📋 Project Management
- Architecture review
- Dependency analysis
- Code organization
- Technical debt assessment
- Migration planning

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- Anthropic API key
- VS Code or Cursor with MCP support

### Setup

1. **Clone and Install Dependencies**
   ```bash
   cd ide-cursor-claude-code
   npm install
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Set Environment Variables**
   ```bash
   export ANTHROPIC_API_KEY="your-anthropic-api-key-here"
   ```

4. **Configure MCP in VS Code/Cursor**
   
   Add to your MCP configuration:
   ```json
   {
     "mcpServers": {
       "claude-code-cursor": {
         "command": "node",
         "args": ["dist/server.js"],
         "cwd": "/path/to/ide-cursor-claude-code",
         "env": {
           "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
         }
       }
     }
   }
   ```

## Usage

### Code Analysis

Analyze code for issues, metrics, and suggestions:

```typescript
// Tool: analyze_code
{
  "filePath": "src/components/Button.tsx",
  "content": "// Your code here",
  "language": "typescript",
  "focusAreas": ["performance", "security", "maintainability"]
}
```

### Code Generation

Generate code based on requirements:

```typescript
// Tool: generate_code
{
  "requirements": "Create a React component for user authentication",
  "language": "typescript",
  "framework": "react",
  "includeTests": true,
  "includeDocumentation": true
}
```

### Code Refactoring

Refactor code to improve quality:

```typescript
// Tool: refactor_code
{
  "filePath": "src/utils/helpers.ts",
  "content": "// Your code here",
  "refactorType": "optimize",
  "preserveBehavior": true
}
```

### Documentation Generation

Generate comprehensive documentation:

```typescript
// Tool: generate_documentation
{
  "filePath": "src/api/users.ts",
  "content": "// Your code here",
  "docType": "api",
  "targetAudience": "developers",
  "includeExamples": true
}
```

### Debugging

Debug code and find solutions:

```typescript
// Tool: debug_code
{
  "filePath": "src/components/Calculator.tsx",
  "content": "// Your code here",
  "errorMessage": "TypeError: Cannot read property 'value' of undefined",
  "debugLevel": "detailed"
}
```

### Test Generation

Generate comprehensive tests:

```typescript
// Tool: generate_tests
{
  "filePath": "src/services/auth.ts",
  "content": "// Your code here",
  "testType": "unit",
  "framework": "jest",
  "includeMocks": true
}
```

### Performance Analysis

Analyze and optimize performance:

```typescript
// Tool: analyze_performance
{
  "filePath": "src/components/DataTable.tsx",
  "content": "// Your code here",
  "analysisType": "bottlenecks",
  "optimizationLevel": "aggressive"
}
```

### Security Analysis

Analyze code for security issues:

```typescript
// Tool: analyze_security
{
  "filePath": "src/api/auth.ts",
  "content": "// Your code here",
  "securityType": "vulnerabilities",
  "securityStandards": ["OWASP", "NIST"]
}
```

### Git Integration

Get Git-related assistance:

```typescript
// Tool: git_integration
{
  "filePath": "src/components/Header.tsx",
  "content": "// Your code here",
  "gitOperation": "commit_message",
  "changedFiles": ["src/components/Header.tsx", "src/styles/header.css"]
}
```

### Project Management

Get project-level insights:

```typescript
// Tool: project_management
{
  "filePath": "src/index.ts",
  "content": "// Your code here",
  "projectOperation": "architecture_review",
  "projectStructure": ["src/", "tests/", "docs/"],
  "dependencies": ["react", "typescript", "jest"]
}
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)
- `NODE_ENV`: Environment (development, production)
- `LOG_LEVEL`: Logging level (debug, info, warn, error)

### Tool Configuration

Each tool can be configured with specific parameters:

- **Language Support**: TypeScript, JavaScript, Python, Java, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, C++, C
- **Framework Support**: React, Vue, Angular, Express, Next.js, and more
- **Analysis Depth**: Basic, detailed, comprehensive
- **Optimization Level**: Basic, aggressive, maximum

## Development

### Project Structure

```
ide-cursor-claude-code/
├── src/
│   ├── server.ts                 # MCP server entry point
│   ├── claude-code-agent.ts      # Core Claude agent
│   └── tools/                    # Individual tool implementations
│       ├── base-tool.ts
│       ├── code-analysis.ts
│       ├── code-generation.ts
│       ├── code-refactoring.ts
│       ├── documentation.ts
│       ├── debugging.ts
│       ├── testing.ts
│       ├── performance.ts
│       ├── security.ts
│       ├── git-integration.ts
│       └── project-management.ts
├── dist/                         # Compiled JavaScript
├── package.json
├── tsconfig.json
├── mcp-server.json
└── README.md
```

### Building

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Adding New Tools

1. Create a new tool class extending `BaseTool`
2. Implement required methods: `getName()`, `getDescription()`, `getInputSchema()`, `getToolDefinition()`, `execute()`
3. Register the tool in `server.ts`
4. Add comprehensive tests
5. Update documentation

## API Reference

### ClaudeCodeAgent

The core agent class that handles communication with Claude.

#### Methods

- `analyzeCode(context: CodeContext): Promise<AnalysisResult>`
- `generateCode(requirements: string, context: CodeContext, options: any): Promise<any>`
- `refactorCode(context: CodeContext, refactorType: string): Promise<any>`
- `generateDocumentation(context: CodeContext, docType: string): Promise<any>`
- `debugCode(context: CodeContext, errorMessage?: string, stackTrace?: string): Promise<any>`
- `generateTests(context: CodeContext, testType: string, framework?: string): Promise<any>`

### BaseTool

Abstract base class for all MCP tools.

#### Methods

- `getName(): string`
- `getDescription(): string`
- `getInputSchema(): z.ZodSchema`
- `getToolDefinition(): any`
- `execute(args: any): Promise<ToolResult>`

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure `ANTHROPIC_API_KEY` is set in your environment
   - Check that the API key is valid and has sufficient credits

2. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration in `tsconfig.json`

3. **MCP Connection Issues**
   - Verify the MCP server configuration in VS Code/Cursor
   - Check that the server is running and accessible
   - Review logs for error messages

4. **Tool Execution Failures**
   - Ensure input parameters match the expected schema
   - Check that the file paths are valid and accessible
   - Verify that the code content is properly formatted

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
export LOG_LEVEL=debug
```

### Logs

Logs are written to stderr and can be viewed in the VS Code/Cursor output panel or terminal.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:

- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the API documentation
- Contact Anthropic support for API-related issues

## Changelog

### Version 1.0.93

- Initial release
- Core Claude Code agent implementation
- 10 comprehensive tools for code assistance
- MCP server integration
- TypeScript support
- Comprehensive documentation

---

**Made with ❤️ by Anthropic**
