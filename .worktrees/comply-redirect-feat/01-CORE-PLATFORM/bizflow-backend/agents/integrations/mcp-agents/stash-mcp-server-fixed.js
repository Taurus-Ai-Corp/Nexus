/**
 * Stash MCP Server
 * Provides integration with Atlassian Stash/Bitbucket repositories
 * Supports both legacy Stash and modern Bitbucket instances
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

class StashMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'stash-mcp-server',
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
            name: 'list_repositories',
            description: 'List all repositories in Stash/Bitbucket',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'Filter by project key (optional)',
                },
              },
            },
          },
          {
            name: 'get_repository',
            description: 'Get details of a specific repository',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'Project key',
                },
                repository: {
                  type: 'string',
                  description: 'Repository slug',
                },
              },
              required: ['project', 'repository'],
            },
          },
          {
            name: 'list_pull_requests',
            description: 'List pull requests for a repository',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'Project key',
                },
                repository: {
                  type: 'string',
                  description: 'Repository slug',
                },
                state: {
                  type: 'string',
                  enum: ['OPEN', 'MERGED', 'DECLINED'],
                  description: 'Filter by pull request state',
                },
              },
              required: ['project', 'repository'],
            },
          },
          {
            name: 'create_pull_request',
            description: 'Create a new pull request',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'Project key',
                },
                repository: {
                  type: 'string',
                  description: 'Repository slug',
                },
                title: {
                  type: 'string',
                  description: 'Pull request title',
                },
                description: {
                  type: 'string',
                  description: 'Pull request description',
                },
                fromRef: {
                  type: 'string',
                  description: 'Source branch',
                },
                toRef: {
                  type: 'string',
                  description: 'Target branch',
                },
              },
              required: ['project', 'repository', 'title', 'fromRef', 'toRef'],
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
          case 'list_repositories':
            return await this.listRepositories(args);
          case 'get_repository':
            return await this.getRepository(args);
          case 'list_pull_requests':
            return await this.listPullRequests(args);
          case 'create_pull_request':
            return await this.createPullRequest(args);
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

  async getAuthHeaders() {
    const stashUrl = process.env.STASH_URL || process.env.BITBUCKET_URL;
    const username = process.env.STASH_USERNAME || process.env.BITBUCKET_USERNAME;
    const token = process.env.STASH_API_TOKEN || process.env.BITBUCKET_APP_PASSWORD;

    if (!stashUrl || !username || !token) {
      throw new Error('Missing Stash/Bitbucket credentials. Please set STASH_URL, STASH_USERNAME, and STASH_API_TOKEN environment variables.');
    }

    const auth = Buffer.from(`${username}:${token}`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  async listRepositories(args) {
    const headers = await this.getAuthHeaders();
    const stashUrl = process.env.STASH_URL || process.env.BITBUCKET_URL;
    
    let url = `${stashUrl}/rest/api/1.0/repos`;
    if (args.project) {
      url += `?projectKey=${args.project}`;
    }

    const response = await axios.get(url, { headers });
    
    const repositories = response.data.values.map(repo => ({
      project: repo.project.key,
      name: repo.name,
      slug: repo.slug,
      description: repo.description || '',
      public: repo.public,
      links: repo.links,
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${repositories.length} repositories:\n\n${repositories.map(r => `• ${r.project}/${r.slug} - ${r.name}`).join('\n')}`,
        },
      ],
    };
  }

  async getRepository(args) {
    const headers = await this.getAuthHeaders();
    const stashUrl = process.env.STASH_URL || process.env.BITBUCKET_URL;
    
    const url = `${stashUrl}/rest/api/1.0/projects/${args.project}/repos/${args.repository}`;
    const response = await axios.get(url, { headers });
    
    const repo = response.data;
    return {
      content: [
        {
          type: 'text',
          text: `Repository: ${repo.project.key}/${repo.slug}\nName: ${repo.name}\nDescription: ${repo.description || 'No description'}\nPublic: ${repo.public}\nClone URL: ${repo.links.clone?.[0]?.href || 'N/A'}`,
        },
      ],
    };
  }

  async listPullRequests(args) {
    const headers = await this.getAuthHeaders();
    const stashUrl = process.env.STASH_URL || process.env.BITBUCKET_URL;
    
    let url = `${stashUrl}/rest/api/1.0/projects/${args.project}/repos/${args.repository}/pull-requests`;
    if (args.state) {
      url += `?state=${args.state}`;
    }

    const response = await axios.get(url, { headers });
    
    const pullRequests = response.data.values.map(pr => ({
      id: pr.id,
      title: pr.title,
      state: pr.state,
      author: pr.author.user.displayName,
      createdDate: pr.createdDate,
      updatedDate: pr.updatedDate,
      fromRef: pr.fromRef.displayId,
      toRef: pr.toRef.displayId,
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${pullRequests.length} pull requests:\n\n${pullRequests.map(pr => `• #${pr.id} - ${pr.title} (${pr.state}) by ${pr.author}`).join('\n')}`,
        },
      ],
    };
  }

  async createPullRequest(args) {
    const headers = await this.getAuthHeaders();
    const stashUrl = process.env.STASH_URL || process.env.BITBUCKET_URL;
    
    const url = `${stashUrl}/rest/api/1.0/projects/${args.project}/repos/${args.repository}/pull-requests`;
    
    const pullRequestData = {
      title: args.title,
      description: args.description || '',
      fromRef: {
        id: `refs/heads/${args.fromRef}`,
      },
      toRef: {
        id: `refs/heads/${args.toRef}`,
      },
    };

    const response = await axios.post(url, pullRequestData, { headers });
    
    return {
      content: [
        {
          type: 'text',
          text: `Pull request created successfully!\nID: ${response.data.id}\nTitle: ${response.data.title}\nState: ${response.data.state}\nLink: ${response.data.links.self?.[0]?.href || 'N/A'}`,
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('Stash MCP Server running on stdio');
  }
}

// Start the server
const server = new StashMCPServer();
server.start().catch(console.error);



