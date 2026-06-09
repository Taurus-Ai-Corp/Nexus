#!/usr/bin/env node

/**
 * MCP Server Fix Script
 * Fixes all MCP servers to use proper ES module syntax and correct imports
 */

import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class MCPServerFixer {
  constructor() {
    this.basePath = '/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents';
    this.fixedServers = [];
    this.failedServers = [];
  }

  async fixAllServers() {
    console.log('🔧 Starting MCP Server Fix Process...\n');

    const serversToFix = [
      'figma-mcp/index.js',
      'design-tokens-mcp/index.js',
      'tailwind-mcp/index.js',
      'component-library-mcp/index.js',
      'icon-assets-mcp/index.js',
      'stash-mcp-server.js',
      'genspark-mcp-server.js'
    ];

    for (const serverPath of serversToFix) {
      try {
        await this.fixServer(serverPath);
        this.fixedServers.push(serverPath);
      } catch (error) {
        console.error(`❌ Failed to fix ${serverPath}:`, error.message);
        this.failedServers.push({ path: serverPath, error: error.message });
      }
    }

    await this.testServers();
    this.generateReport();
  }

  async fixServer(serverPath) {
    const fullPath = path.join(this.basePath, serverPath);
    console.log(`🔧 Fixing ${serverPath}...`);

    let content = await fs.readFile(fullPath, 'utf8');

    // Fix CommonJS imports to ES modules
    const fixes = [
      {
        from: /const\s*{\s*Server\s*}\s*=\s*require\(['"]@modelcontextprotocol\/sdk\/server['"]\);?/g,
        to: 'import { Server } from "@modelcontextprotocol/sdk/server/index.js";'
      },
      {
        from: /const\s*{\s*Server\s*}\s*=\s*require\(['"]@modelcontextprotocol\/sdk\/server\/index\.js['"]\);?/g,
        to: 'import { Server } from "@modelcontextprotocol/sdk/server/index.js";'
      },
      {
        from: /const\s*{\s*StdioServerTransport\s*}\s*=\s*require\(['"]@modelcontextprotocol\/sdk\/server\/stdio['"]\);?/g,
        to: 'import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";'
      },
      {
        from: /const\s*{\s*StdioServerTransport\s*}\s*=\s*require\(['"]@modelcontextprotocol\/sdk\/server\/stdio\.js['"]\);?/g,
        to: 'import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";'
      },
      {
        from: /const\s*{\s*CallToolRequestSchema,\s*ListToolsRequestSchema,\s*}\s*=\s*require\(['"]@modelcontextprotocol\/sdk\/types\.js['"]\);?/g,
        to: 'import {\n  CallToolRequestSchema,\n  ListToolsRequestSchema,\n} from "@modelcontextprotocol/sdk/types.js";'
      },
      {
        from: /const\s*{\s*CallToolRequestSchema,\s*ListToolsRequestSchema,\s*}\s*=\s*require\(['"]@modelcontextprotocol\/sdk\/types['"]\);?/g,
        to: 'import {\n  CallToolRequestSchema,\n  ListToolsRequestSchema,\n} from "@modelcontextprotocol/sdk/types.js";'
      }
    ];

    // Apply fixes
    for (const fix of fixes) {
      content = content.replace(fix.from, fix.to);
    }

    // Add missing imports if needed
    if (content.includes('CallToolRequestSchema') && !content.includes('import { CallToolRequestSchema')) {
      const importStatement = 'import {\n  CallToolRequestSchema,\n  ListToolsRequestSchema,\n} from "@modelcontextprotocol/sdk/types.js";\n\n';
      content = importStatement + content;
    }

    // Write fixed content
    await fs.writeFile(fullPath, content, 'utf8');
    console.log(`✅ Fixed ${serverPath}`);
  }

  async testServers() {
    console.log('\n🧪 Testing Fixed Servers...\n');

    const testServers = [
      'figma-mcp/index.js',
      'design-tokens-mcp/index.js',
      'tailwind-mcp/index.js',
      'component-library-mcp/index.js',
      'icon-assets-mcp/index.js',
      'stash-mcp-server.js',
      'genspark-mcp-server.js'
    ];

    for (const serverPath of testServers) {
      try {
        const fullPath = path.join(this.basePath, serverPath);
        console.log(`🧪 Testing ${serverPath}...`);
        
        // Test with timeout
        const { stdout, stderr } = await execAsync(`timeout 5s node "${fullPath}"`, { 
          cwd: this.basePath 
        });
        
        if (stderr && !stderr.includes('Server running')) {
          console.log(`⚠️  ${serverPath}: ${stderr.trim()}`);
        } else {
          console.log(`✅ ${serverPath}: Working`);
        }
      } catch (error) {
        if (error.code === 124) { // timeout
          console.log(`✅ ${serverPath}: Working (timeout expected)`);
        } else {
          console.log(`❌ ${serverPath}: ${error.message}`);
        }
      }
    }
  }

  generateReport() {
    console.log('\n📊 MCP Server Fix Report');
    console.log('========================\n');

    console.log(`✅ Successfully Fixed: ${this.fixedServers.length}`);
    this.fixedServers.forEach(server => console.log(`  - ${server}`));

    if (this.failedServers.length > 0) {
      console.log(`\n❌ Failed to Fix: ${this.failedServers.length}`);
      this.failedServers.forEach(({ path, error }) => {
        console.log(`  - ${path}: ${error}`);
      });
    }

    console.log('\n🎯 Next Steps:');
    console.log('1. Restart Cursor to load fixed MCP servers');
    console.log('2. Test MCP server functionality');
    console.log('3. Verify all 18 MCP servers are working');
  }
}

// Run the fixer
const fixer = new MCPServerFixer();
fixer.fixAllServers().catch(console.error);



