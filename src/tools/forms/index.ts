import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Forms-related MCP tools on the server.
 */
export function registerFormsTools(server: McpServer): void {
    // ── Get Forms ───────────────────────────────────────────────────────
    server.registerTool(
        'forms_list',
        {
            description: 'Get forms for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                skip: z.number().optional().describe('Number of items to skip'),
                limit: z.number().optional().describe('Maximum number of items to return'),
                type: z.string().optional().describe('Filter by form type'),
            },
            annotations: {
                title: 'List Forms',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().forms.getForms(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting forms: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Form Submissions ────────────────────────────────────────────
    server.registerTool(
        'forms_submissions_list',
        {
            description: 'Get form submissions for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                formId: z.string().optional().describe('Filter by form ID'),
                page: z.number().optional().describe('Page number'),
                limit: z.number().optional().describe('Maximum number of items to return'),
                startAt: z.string().optional().describe('Start date filter (ISO string)'),
                endAt: z.string().optional().describe('End date filter (ISO string)'),
                q: z.string().optional().describe('Search query'),
            },
            annotations: {
                title: 'List Form Submissions',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().forms.getFormsSubmissions(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting form submissions: ${error.message}` }],
                };
            }
        }
    );
}
