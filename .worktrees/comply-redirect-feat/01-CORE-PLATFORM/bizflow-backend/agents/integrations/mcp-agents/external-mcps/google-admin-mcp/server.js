#!/usr/bin/env node
/**
 * Google Admin MCP Server
 * Manages Google Workspace users via Admin Directory API
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

class GoogleAdminMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: "google-admin-mcp",
                version: "1.0.0",
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );
        
        this.setupToolHandlers();
        this.setupGoogleAuth();
    }
    
    setupGoogleAuth() {
        // Google OAuth2 configuration
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        // Set credentials if available
        if (process.env.GOOGLE_ACCESS_TOKEN) {
            this.oauth2Client.setCredentials({
                access_token: process.env.GOOGLE_ACCESS_TOKEN,
                refresh_token: process.env.GOOGLE_REFRESH_TOKEN
            });
        }
        
        this.admin = google.admin({ version: 'directory_v1', auth: this.oauth2Client });
    }
    
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "list_users",
                        description: "List all users in the Google Workspace domain",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: "Domain to list users from (optional)"
                                },
                                maxResults: {
                                    type: "number",
                                    description: "Maximum number of results to return (default: 100)"
                                }
                            }
                        }
                    },
                    {
                        name: "get_user",
                        description: "Get detailed information about a specific user",
                        inputSchema: {
                            type: "object",
                            properties: {
                                userKey: {
                                    type: "string",
                                    description: "User's email address or unique ID"
                                }
                            },
                            required: ["userKey"]
                        }
                    },
                    {
                        name: "create_user",
                        description: "Create a new user in Google Workspace",
                        inputSchema: {
                            type: "object",
                            properties: {
                                primaryEmail: {
                                    type: "string",
                                    description: "Primary email address for the new user"
                                },
                                givenName: {
                                    type: "string",
                                    description: "User's first name"
                                },
                                familyName: {
                                    type: "string",
                                    description: "User's last name"
                                },
                                password: {
                                    type: "string",
                                    description: "Password for the new user (optional, will generate if not provided)"
                                }
                            },
                            required: ["primaryEmail", "givenName", "familyName"]
                        }
                    },
                    {
                        name: "suspend_user",
                        description: "Suspend a user account",
                        inputSchema: {
                            type: "object",
                            properties: {
                                userKey: {
                                    type: "string",
                                    description: "User's email address or unique ID"
                                }
                            },
                            required: ["userKey"]
                        }
                    },
                    {
                        name: "unsuspend_user",
                        description: "Unsuspend a user account",
                        inputSchema: {
                            type: "object",
                            properties: {
                                userKey: {
                                    type: "string",
                                    description: "User's email address or unique ID"
                                }
                            },
                            required: ["userKey"]
                        }
                    }
                ]
            };
        });
        
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            
            try {
                switch (name) {
                    case "list_users":
                        return await this.listUsers(args);
                    case "get_user":
                        return await this.getUser(args);
                    case "create_user":
                        return await this.createUser(args);
                    case "suspend_user":
                        return await this.suspendUser(args);
                    case "unsuspend_user":
                        return await this.unsuspendUser(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error.message}`
                        }
                    ]
                };
            }
        });
    }
    
    async listUsers(args) {
        const { domain, maxResults = 100 } = args;
        
        try {
            const response = await this.admin.users.list({
                domain: domain || process.env.GOOGLE_WORKSPACE_DOMAIN,
                maxResults: maxResults,
                orderBy: 'email'
            });
            
            const users = response.data.users || [];
            
            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${users.length} users:\n\n` +
                              users.map(user => 
                                `• ${user.primaryEmail} (${user.name?.fullName || 'No name'}) - ${user.suspended ? 'Suspended' : 'Active'}`
                              ).join('\n')
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to list users: ${error.message}`);
        }
    }
    
    async getUser(args) {
        const { userKey } = args;
        
        try {
            const response = await this.admin.users.get({
                userKey: userKey
            });
            
            const user = response.data;
            
            return {
                content: [
                    {
                        type: "text",
                        text: `User Details:\n` +
                              `• Email: ${user.primaryEmail}\n` +
                              `• Name: ${user.name?.fullName || 'Not set'}\n` +
                              `• Status: ${user.suspended ? 'Suspended' : 'Active'}\n` +
                              `• Last Login: ${user.lastLoginTime || 'Never'}\n` +
                              `• Creation Time: ${user.creationTime || 'Unknown'}`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }
    
    async createUser(args) {
        const { primaryEmail, givenName, familyName, password } = args;
        
        try {
            // Generate secure password if not provided
            const userPassword = password || this.generateSecurePassword();
            
            const userData = {
                primaryEmail: primaryEmail,
                name: {
                    givenName: givenName,
                    familyName: familyName
                },
                password: userPassword,
                changePasswordAtNextLogin: true
            };
            
            const response = await this.admin.users.insert({
                requestBody: userData
            });
            
            return {
                content: [
                    {
                        type: "text",
                        text: `User created successfully!\n` +
                              `• Email: ${primaryEmail}\n` +
                              `• Name: ${givenName} ${familyName}\n` +
                              `• Password: ${userPassword}\n` +
                              `• Note: User must change password on first login`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
    
    async suspendUser(args) {
        const { userKey } = args;
        
        try {
            await this.admin.users.update({
                userKey: userKey,
                requestBody: {
                    suspended: true
                }
            });
            
            return {
                content: [
                    {
                        type: "text",
                        text: `User ${userKey} has been suspended successfully.`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to suspend user: ${error.message}`);
        }
    }
    
    async unsuspendUser(args) {
        const { userKey } = args;
        
        try {
            await this.admin.users.update({
                userKey: userKey,
                requestBody: {
                    suspended: false
                }
            });
            
            return {
                content: [
                    {
                        type: "text",
                        text: `User ${userKey} has been unsuspended successfully.`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to unsuspend user: ${error.message}`);
        }
    }
    
    generateSecurePassword() {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return password;
    }
    
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Google Admin MCP server running on stdio");
    }
}

const server = new GoogleAdminMCPServer();
server.run().catch(console.error);
