#!/usr/bin/env node
/**
 * 🚀 VERCEL MCP SERVER
 * 
 * Deploy your Vibe Marketing portfolio to Vercel with one command
 * 
 * Features:
 * - Deploy static sites to Vercel
 * - Get deployment URLs
 * - Check deployment status
 * - Domain management
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class VercelMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'vercel-mcp',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.vercelToken = process.env.VERCEL_TOKEN;
        this.baseURL = 'https://api.vercel.com';
        
        this.setupToolHandlers();
    }

    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'deploy_to_vercel',
                    description: 'Deploy files to Vercel',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            projectPath: {
                                type: 'string',
                                description: 'Path to the project directory to deploy'
                            },
                            projectName: {
                                type: 'string',
                                description: 'Name for the Vercel project'
                            }
                        },
                        required: ['projectPath', 'projectName']
                    }
                },
                {
                    name: 'get_deployments',
                    description: 'List all deployments for a project',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            projectName: {
                                type: 'string',
                                description: 'Name of the Vercel project'
                            }
                        },
                        required: ['projectName']
                    }
                },
                {
                    name: 'check_deployment_status',
                    description: 'Check the status of a specific deployment',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            deploymentId: {
                                type: 'string',
                                description: 'Deployment ID to check'
                            }
                        },
                        required: ['deploymentId']
                    }
                },
                {
                    name: 'setup_custom_domain',
                    description: 'Add a custom domain to a Vercel project',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            projectName: {
                                type: 'string',
                                description: 'Name of the Vercel project'
                            },
                            domain: {
                                type: 'string',
                                description: 'Custom domain to add'
                            }
                        },
                        required: ['projectName', 'domain']
                    }
                },
                {
                    name: 'deploy_vibe_portfolio',
                    description: 'Quick deploy Vibe Marketing portfolio with optimizations',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            includeAssets: {
                                type: 'boolean',
                                description: 'Include all marketing assets',
                                default: true
                            }
                        }
                    }
                }
            ]
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                switch (name) {
                    case 'deploy_to_vercel':
                        return await this.deployToVercel(args.projectPath, args.projectName);
                    
                    case 'get_deployments':
                        return await this.getDeployments(args.projectName);
                    
                    case 'check_deployment_status':
                        return await this.checkDeploymentStatus(args.deploymentId);
                    
                    case 'setup_custom_domain':
                        return await this.setupCustomDomain(args.projectName, args.domain);
                    
                    case 'deploy_vibe_portfolio':
                        return await this.deployVibePortfolio(args.includeAssets);
                    
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error executing ${name}: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        });
    }

    async deployToVercel(projectPath, projectName) {
        if (!this.vercelToken) {
            throw new Error('VERCEL_TOKEN environment variable is required');
        }

        try {
            // Use Vercel CLI for deployment
            const { stdout } = await execAsync(`cd "${projectPath}" && npx vercel --prod --token ${this.vercelToken} --name ${projectName} --yes`);
            
            const deploymentUrl = stdout.trim().split('\n').pop();
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Successfully deployed to Vercel!\n\n🚀 Live URL: ${deploymentUrl}\n\nProject: ${projectName}\nStatus: Production Ready`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Deployment failed: ${error.message}`);
        }
    }

    async getDeployments(projectName) {
        if (!this.vercelToken) {
            throw new Error('VERCEL_TOKEN environment variable is required');
        }

        try {
            const response = await axios.get(`${this.baseURL}/v6/deployments`, {
                headers: {
                    'Authorization': `Bearer ${this.vercelToken}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    projectId: projectName
                }
            });

            const deployments = response.data.deployments.slice(0, 10); // Latest 10
            
            let result = `📋 Latest Deployments for ${projectName}:\n\n`;
            
            deployments.forEach((deployment, index) => {
                result += `${index + 1}. ${deployment.url}\n`;
                result += `   Status: ${deployment.state}\n`;
                result += `   Created: ${new Date(deployment.createdAt).toLocaleString()}\n`;
                result += `   ID: ${deployment.uid}\n\n`;
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: result
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to get deployments: ${error.message}`);
        }
    }

    async checkDeploymentStatus(deploymentId) {
        if (!this.vercelToken) {
            throw new Error('VERCEL_TOKEN environment variable is required');
        }

        try {
            const response = await axios.get(`${this.baseURL}/v13/deployments/${deploymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.vercelToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const deployment = response.data;
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `🔍 Deployment Status:\n\n` +
                              `URL: https://${deployment.url}\n` +
                              `Status: ${deployment.state}\n` +
                              `Created: ${new Date(deployment.createdAt).toLocaleString()}\n` +
                              `Ready: ${deployment.ready ? 'Yes' : 'No'}\n` +
                              `ID: ${deployment.uid}`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to check deployment status: ${error.message}`);
        }
    }

    async setupCustomDomain(projectName, domain) {
        if (!this.vercelToken) {
            throw new Error('VERCEL_TOKEN environment variable is required');
        }

        try {
            const response = await axios.post(`${this.baseURL}/v9/projects/${projectName}/domains`, {
                name: domain
            }, {
                headers: {
                    'Authorization': `Bearer ${this.vercelToken}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Custom domain added successfully!\n\n` +
                              `Domain: ${domain}\n` +
                              `Project: ${projectName}\n` +
                              `Status: ${response.data.verification ? 'Verified' : 'Pending verification'}\n\n` +
                              `Next steps:\n` +
                              `1. Update your DNS records\n` +
                              `2. Wait for verification (usually 5-10 minutes)`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to add custom domain: ${error.message}`);
        }
    }

    async deployVibePortfolio(includeAssets = true) {
        try {
            // Get the current directory (should be in the project root)
            const projectRoot = process.cwd();
            const portfolioPath = path.join(projectRoot, '../../');
            
            // Create a deployment-ready structure
            const deployPath = path.join(projectRoot, 'vibe-deployment');
            
            // Ensure deployment directory exists
            if (!fs.existsSync(deployPath)) {
                fs.mkdirSync(deployPath, { recursive: true });
            }

            // Copy essential files
            const filesToCopy = [
                'vibe-marketing-portfolio-preview.html',
                'VIBE_EMPIRE_PORTFOLIO_PACKAGE.md',
                '.superdesign/design_iterations/default_ui_darkmode.css'
            ];

            if (includeAssets) {
                filesToCopy.push(
                    'social_media_assets/',
                    'generated_content/'
                );
            }

            // Copy files to deployment directory
            for (const file of filesToCopy) {
                const srcPath = path.join(portfolioPath, file);
                const destPath = path.join(deployPath, file);
                
                if (fs.existsSync(srcPath)) {
                    if (fs.lstatSync(srcPath).isDirectory()) {
                        await execAsync(`cp -r "${srcPath}" "${destPath}"`);
                    } else {
                        // Ensure destination directory exists
                        fs.mkdirSync(path.dirname(destPath), { recursive: true });
                        fs.copyFileSync(srcPath, destPath);
                    }
                }
            }

            // Create index.html pointing to the portfolio
            const indexContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=vibe-marketing-portfolio-preview.html">
    <title>Vibe Marketing Empire</title>
</head>
<body>
    <p>Redirecting to <a href="vibe-marketing-portfolio-preview.html">Vibe Marketing Portfolio</a>...</p>
</body>
</html>`;

            fs.writeFileSync(path.join(deployPath, 'index.html'), indexContent);

            // Deploy to Vercel
            const projectName = 'vibe-marketing-empire';
            const deployResult = await this.deployToVercel(deployPath, projectName);
            
            // Clean up deployment directory
            await execAsync(`rm -rf "${deployPath}"`);

            return {
                content: [
                    {
                        type: 'text',
                        text: `🎪 VIBE MARKETING EMPIRE DEPLOYED! 🚀\n\n` +
                              `${deployResult.content[0].text}\n\n` +
                              `📦 Included Files:\n` +
                              `✅ Interactive Portfolio Preview\n` +
                              `✅ Complete Business Package\n` +
                              `✅ Dark Mode Design System\n` +
                              `${includeAssets ? '✅ Marketing Assets & Generated Content\n' : ''}\n` +
                              `🎯 Your business portfolio is now live and ready to share with investors!`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to deploy Vibe portfolio: ${error.message}`);
        }
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('🚀 Vercel MCP server running on stdio');
    }
}

const server = new VercelMCPServer();
server.run().catch(console.error);




