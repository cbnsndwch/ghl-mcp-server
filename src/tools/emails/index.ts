import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Emails-related MCP tools on the server.
 */
export function registerEmailsTools(server: McpServer): void {
    // ── Get Email Templates ─────────────────────────────────────────────
    server.registerTool(
        'emails_list',
        {
            description: 'Get email templates for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                limit: z.string().optional().describe('Maximum number of results'),
                offset: z.string().optional().describe('Offset for pagination'),
                search: z.string().optional().describe('Search query'),
                sortByDate: z.string().optional().describe('Sort by date'),
                archived: z.string().optional().describe('Filter archived templates'),
                builderVersion: z.string().optional().describe('Builder version filter'),
                name: z.string().optional().describe('Filter by template name'),
                parentId: z.string().optional().describe('Parent folder ID'),
                originId: z.string().optional().describe('Origin ID filter'),
                templatesOnly: z.string().optional().describe('Return templates only'),
            },
            annotations: {
                title: 'List Email Templates',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().emails.fetchTemplate(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting emails: ${error.message}` }],
                };
            }
        }
    );
}
