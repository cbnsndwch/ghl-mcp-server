import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { initGhlClient } from './ghl-client.js';
import { createServer } from './server.js';

async function main() {
    const token = process.env['GHL_PRIVATE_TOKEN'];
    if (!token) {
        console.error(
            'Missing GHL_PRIVATE_TOKEN environment variable. ' +
                'Set it to your HighLevel Private Integration token.'
        );
        process.exit(1);
    }

    // Initialize the GHL SDK client
    initGhlClient(token);

    // Create the MCP server
    const mcpServer = createServer();

    // Start the server with stdio transport
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
}

main().catch((err: unknown) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
