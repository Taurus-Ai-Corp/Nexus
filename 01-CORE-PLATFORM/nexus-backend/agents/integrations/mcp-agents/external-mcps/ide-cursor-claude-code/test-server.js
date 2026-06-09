#!/usr/bin/env node
/**
 * Simple test script for Claude Code MCP Server
 * Tests basic functionality without requiring full MCP setup
 */

const { ClaudeCodeAgent } = require('./dist/claude-code-agent.js');

async function testClaudeCodeAgent() {
  console.log('🧪 Testing Claude Code Agent...\n');
  
  // Check if API key is provided
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required');
    console.log('Please set your Anthropic API key:');
    console.log('export ANTHROPIC_API_KEY="your-api-key-here"');
    process.exit(1);
  }
  
  try {
    // Initialize the agent
    const agent = new ClaudeCodeAgent(apiKey);
    console.log('✅ Claude Code Agent initialized successfully');
    
    // Test code analysis
    console.log('\n🔍 Testing code analysis...');
    const testCode = `
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
    `.trim();
    
    const context = {
      filePath: 'test.js',
      content: testCode,
      language: 'javascript'
    };
    
    const analysisResult = await agent.analyzeCode(context);
    console.log('✅ Code analysis completed');
    console.log(`   Issues found: ${analysisResult.issues?.length || 0}`);
    console.log(`   Suggestions: ${analysisResult.suggestions?.length || 0}`);
    
    // Test code generation
    console.log('\n🚀 Testing code generation...');
    const generationResult = await agent.generateCode(
      'Create a simple React button component',
      context,
      {
        language: 'typescript',
        framework: 'react',
        includeTests: false,
        includeDocumentation: false
      }
    );
    console.log('✅ Code generation completed');
    console.log(`   Generated code length: ${generationResult.code?.length || 0} characters`);
    
    // Test refactoring
    console.log('\n🔧 Testing code refactoring...');
    const refactoringResult = await agent.refactorCode(
      context,
      'optimize'
    );
    console.log('✅ Code refactoring completed');
    console.log(`   Refactored code length: ${refactoringResult.refactoredCode?.length || 0} characters`);
    
    console.log('\n🎉 All tests passed successfully!');
    console.log('\nClaude Code MCP Server is ready to use.');
    console.log('\nNext steps:');
    console.log('1. Build the project: npm run build');
    console.log('2. Configure MCP in VS Code/Cursor');
    console.log('3. Start using the tools!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your API key is valid');
    console.error('2. Ensure you have internet connectivity');
    console.error('3. Verify the Anthropic API is accessible');
    process.exit(1);
  }
}

// Run the test
testClaudeCodeAgent();
