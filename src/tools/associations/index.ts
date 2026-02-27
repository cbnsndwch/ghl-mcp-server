import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';

/**
 * Register all Associations-related MCP tools on the server.
 */
export function registerAssociationsTools(server: McpServer): void {
    // ── Get Association ─────────────────────────────────────────────────
    server.registerTool(
        'associations_get',
        {
            description: 'Get an association by ID',
            inputSchema: {
                associationId: z.string().describe('The association ID'),
            },
            annotations: {
                title: 'Get Association',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().associations.getAssociationByID({
                    associationId: params.associationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting association: ${error.message}` }],
                };
            }
        }
    );
}
