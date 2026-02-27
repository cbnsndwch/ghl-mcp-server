import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Campaigns-related MCP tools on the server.
 */
export function registerCampaignsTools(server: McpServer): void {
    // ── Get Campaigns ───────────────────────────────────────────────────
    server.registerTool(
        'campaigns_list',
        {
            description: 'Get campaigns for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                status: z.string().optional().describe('Filter by campaign status'),
            },
            annotations: {
                title: 'List Campaigns',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().campaigns.getCampaigns(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting campaigns: ${error.message}` }],
                };
            }
        }
    );
}
