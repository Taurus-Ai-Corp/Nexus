/**
 * Genspark MCP Server
 * Provides system browsing and online research capabilities
 * Can discover and update configuration information automatically
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';

const execAsync = promisify(exec);

class GensparkMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'genspark-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'browse_system',
            description: 'Browse the local file system and discover files',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to browse (default: current directory)',
                },
                depth: {
                  type: 'number',
                  description: 'Maximum depth to search (default: 2)',
                },
                pattern: {
                  type: 'string',
                  description: 'File pattern to match (e.g., "*.js", "*.json")',
                },
              },
            },
          },
          {
            name: 'search_online',
            description: 'Search for information online using web search',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                max_results: {
                  type: 'number',
                  description: 'Maximum number of results (default: 5)',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'discover_atlassian_info',
            description: 'Discover Atlassian configuration information',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'update_config',
            description: 'Update configuration files with discovered information',
            inputSchema: {
              type: 'object',
              properties: {
                file_path: {
                  type: 'string',
                  description: 'Path to configuration file',
                },
                updates: {
                  type: 'object',
                  description: 'Key-value pairs to update',
                },
              },
              required: ['file_path', 'updates'],
            },
          },
          {
            name: 'analyze_project_structure',
            description: 'Analyze the project structure and identify components',
            inputSchema: {
              type: 'object',
              properties: {
                root_path: {
                  type: 'string',
                  description: 'Root path of the project to analyze',
                },
              },
            },
          },
        ],
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'browse_system':
            return await this.browseSystem(args);
          case 'search_online':
            return await this.searchOnline(args);
          case 'discover_atlassian_info':
            return await this.discoverAtlassianInfo();
          case 'update_config':
            return await this.updateConfig(args);
          case 'analyze_project_structure':
            return await this.analyzeProjectStructure(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async browseSystem(args) {
    const targetPath = args.path || process.cwd();
    const maxDepth = args.depth || 2;
    const pattern = args.pattern || '*';

    const results = await this.scanDirectory(targetPath, maxDepth, pattern);

    return {
      content: [
        {
          type: 'text',
          text: `Found ${results.files.length} files and ${results.directories.length} directories in ${targetPath}:\n\nDirectories:\n${results.directories.map(d => `• ${d}`).join('\n')}\n\nFiles:\n${results.files.map(f => `• ${f}`).join('\n')}`,
        },
      ],
    };
  }

  async scanDirectory(dirPath, maxDepth, pattern, currentDepth = 0) {
    const files = [];
    const directories = [];

    if (currentDepth >= maxDepth) {
      return { files, directories };
    }

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(process.cwd(), fullPath);

        if (entry.isDirectory()) {
          directories.push(relativePath);
          const subResults = await this.scanDirectory(fullPath, maxDepth, pattern, currentDepth + 1);
          files.push(...subResults.files);
          directories.push(...subResults.directories);
        } else if (entry.isFile()) {
          if (this.matchesPattern(entry.name, pattern)) {
            files.push(relativePath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }

    return { files, directories };
  }

  matchesPattern(filename, pattern) {
    if (pattern === '*') return true;
    if (pattern.startsWith('*.')) {
      const ext = pattern.substring(1);
      return filename.endsWith(ext);
    }
    return filename.includes(pattern);
  }

  async searchOnline(args) {
    const query = args.query;
    const maxResults = args.max_results || 5;

    try {
      // Use a simple web search (in a real implementation, you'd use a proper search API)
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      
      return {
        content: [
          {
            type: 'text',
            text: `Search results for "${query}":\n\nNote: This is a placeholder implementation. In a real scenario, you would integrate with a proper search API like Google Custom Search, Bing, or DuckDuckGo.\n\nSearch URL: ${searchUrl}\n\nFor now, you can manually search for: ${query}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async discoverAtlassianInfo() {
    const discoveries = {
      domain: null,
      username: null,
      email: null,
      apiToken: null,
    };

    try {
      // Check for common Atlassian domain patterns
      const possibleDomains = [
        'taurus.atlassian.net',
        'taurus-ai.atlassian.net',
        'taurusai.atlassian.net',
      ];

      for (const domain of possibleDomains) {
        try {
          const response = await axios.head(`https://${domain}`, { timeout: 5000 });
          if (response.status === 200 || response.status === 302) {
            discoveries.domain = domain;
            break;
          }
        } catch (error) {
          // Domain not accessible
        }
      }

      // Check for common username patterns
      const possibleUsernames = [
        'Taurus-ai',
        'taurus-ai',
        'taurusai',
        'Taurus.ai',
      ];

      discoveries.username = possibleUsernames[0]; // Default to first option

      // Check for common email patterns
      const possibleEmails = [
        'Taurus.ai@taas-ai.com',
        'taurus@taas-ai.com',
        'admin@taurus.ai',
      ];

      discoveries.email = possibleEmails[0]; // Default to first option

    } catch (error) {
      // Discovery failed
    }

    return {
      content: [
        {
          type: 'text',
          text: `Atlassian Discovery Results:\n\nDomain: ${discoveries.domain || 'Not found'}\nUsername: ${discoveries.username || 'Not found'}\nEmail: ${discoveries.email || 'Not found'}\nAPI Token: ${discoveries.apiToken || 'Not found'}\n\nNote: These are discovered/guessed values. Please verify and update as needed.`,
        },
      ],
    };
  }

  async updateConfig(args) {
    const { file_path, updates } = args;

    try {
      let content = await fs.readFile(file_path, 'utf8');

      // Update environment variables
      for (const [key, value] of Object.entries(updates)) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        const newLine = `${key}=${value}`;
        
        if (regex.test(content)) {
          content = content.replace(regex, newLine);
        } else {
          content += `\n${newLine}`;
        }
      }

      await fs.writeFile(file_path, content, 'utf8');

      return {
        content: [
          {
            type: 'text',
            text: `Configuration updated successfully!\nFile: ${file_path}\nUpdates: ${JSON.stringify(updates, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to update config: ${error.message}`);
    }
  }

  async analyzeProjectStructure(args) {
    const rootPath = args.root_path || process.cwd();

    const analysis = {
      projectType: 'unknown',
      frameworks: [],
      languages: [],
      configFiles: [],
      sourceDirectories: [],
      buildFiles: [],
    };

    try {
      const entries = await fs.readdir(rootPath, { withFileTypes: true });

      for (const entry of entries) {
        const name = entry.name.toLowerCase();

        // Detect project type
        if (name === 'package.json') {
          analysis.projectType = 'node';
          analysis.configFiles.push('package.json');
        } else if (name === 'requirements.txt' || name === 'pyproject.toml') {
          analysis.projectType = 'python';
          analysis.configFiles.push(entry.name);
        } else if (name === 'cargo.toml') {
          analysis.projectType = 'rust';
          analysis.configFiles.push('cargo.toml');
        } else if (name === 'go.mod') {
          analysis.projectType = 'go';
          analysis.configFiles.push('go.mod');
        }

        // Detect frameworks
        if (name.includes('react')) analysis.frameworks.push('React');
        if (name.includes('vue')) analysis.frameworks.push('Vue');
        if (name.includes('angular')) analysis.frameworks.push('Angular');
        if (name.includes('next')) analysis.frameworks.push('Next.js');
        if (name.includes('nuxt')) analysis.frameworks.push('Nuxt.js');

        // Detect build files
        if (name.includes('webpack')) analysis.buildFiles.push('Webpack');
        if (name.includes('vite')) analysis.buildFiles.push('Vite');
        if (name.includes('rollup')) analysis.buildFiles.push('Rollup');
        if (name.includes('esbuild')) analysis.buildFiles.push('esbuild');

        // Detect source directories
        if (entry.isDirectory()) {
          if (['src', 'lib', 'app', 'components', 'pages'].includes(name)) {
            analysis.sourceDirectories.push(entry.name);
          }
        }
      }

      // Detect languages by file extensions
      const languageMap = {
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.jsx': 'React/JSX',
        '.tsx': 'React/TSX',
        '.py': 'Python',
        '.rs': 'Rust',
        '.go': 'Go',
        '.java': 'Java',
        '.cpp': 'C++',
        '.c': 'C',
        '.php': 'PHP',
        '.rb': 'Ruby',
        '.swift': 'Swift',
        '.kt': 'Kotlin',
      };

      const allFiles = await this.getAllFiles(rootPath);
      const extensions = new Set();
      allFiles.forEach(file => {
        const ext = path.extname(file);
        if (languageMap[ext]) {
          extensions.add(languageMap[ext]);
        }
      });

      analysis.languages = Array.from(extensions);

    } catch (error) {
      // Analysis failed
    }

    return {
      content: [
        {
          type: 'text',
          text: `Project Structure Analysis:\n\nProject Type: ${analysis.projectType}\nFrameworks: ${analysis.frameworks.join(', ') || 'None detected'}\nLanguages: ${analysis.languages.join(', ') || 'None detected'}\nConfig Files: ${analysis.configFiles.join(', ') || 'None detected'}\nSource Directories: ${analysis.sourceDirectories.join(', ') || 'None detected'}\nBuild Tools: ${analysis.buildFiles.join(', ') || 'None detected'}`,
        },
      ],
    };
  }

  async getAllFiles(dirPath, allFiles = []) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          await this.getAllFiles(fullPath, allFiles);
        } else {
          allFiles.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }

    return allFiles;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('Genspark MCP Server running on stdio');
  }
}

// Start the server
const server = new GensparkMCPServer();
server.start().catch(console.error);
