import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';

/**
 * Register all Workflows-related MCP tools on the server.
 */
export function registerWorkflowsTools(server: McpServer): void {
    // ── Get Workflows ───────────────────────────────────────────────────
    server.registerTool(
        'workflows_list',
        {
            description: 'Get workflows for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID')
            },
            annotations: {
                title: 'List Workflows',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().workflows.getWorkflow({
                    locationId: params.locationId
                });
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text' as const,
                            text: `Error getting workflows: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
