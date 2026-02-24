import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
    { name: "component-library-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => {
    return {
        tools: [{
            name: "component_library_mcp_status",
            description: "Check Component Library MCP status",
            inputSchema: { type: "object", properties: {} }
        }]
    };
});

server.setRequestHandler("tools/call", async (request) => {
    if (request.params.name === "component_library_mcp_status") {
        return {
            content: [{ type: "text", text: "Component Library MCP is running but needs proper implementation" }]
        };
    }
    throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(console.error);
