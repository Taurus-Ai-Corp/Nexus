import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
    { name: "icon-assets-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => {
    return {
        tools: [{
            name: "icon_assets_mcp_status",
            description: "Check Icon Assets MCP status",
            inputSchema: { type: "object", properties: {} }
        }]
    };
});

server.setRequestHandler("tools/call", async (request) => {
    if (request.params.name === "icon_assets_mcp_status") {
        return {
            content: [{ type: "text", text: "Icon Assets MCP is running but needs proper implementation" }]
        };
    }
    throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(console.error);
