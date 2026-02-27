import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Funnels-related MCP tools on the server.
 */
export function registerFunnelsTools(server: McpServer): void {
    // ── List Funnels ────────────────────────────────────────────────────
    server.registerTool(
        'funnels_list',
        {
            description: 'List funnels for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                limit: z
                    .string()
                    .optional()
                    .describe('Maximum number of items to return'),
                offset: z
                    .string()
                    .optional()
                    .describe('Number of items to skip'),
                type: z.string().optional().describe('Filter by funnel type'),
                name: z.string().optional().describe('Filter by funnel name'),
                parentId: z.string().optional().describe('Filter by parent ID'),
                category: z.string().optional().describe('Filter by category')
            },
            annotations: {
                title: 'List Funnels',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().funnels.getFunnels(
                    stripUndefined(params)
                );
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
                            text: `Error listing funnels: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── List Funnel Pages ───────────────────────────────────────────────
    server.registerTool(
        'funnels_pages_list',
        {
            description: 'List pages for a funnel',
            inputSchema: {
                funnelId: z.string().describe('The funnel ID'),
                locationId: z.string().describe('The location ID'),
                limit: z
                    .number()
                    .optional()
                    .describe('Maximum number of items to return'),
                offset: z
                    .number()
                    .optional()
                    .describe('Number of items to skip'),
                name: z.string().optional().describe('Filter by page name')
            },
            annotations: {
                title: 'List Funnel Pages',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().funnels.getPagesByFunnelId(
                    stripUndefined(params)
                );
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
                            text: `Error listing funnel pages: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── List Redirects ──────────────────────────────────────────────────
    server.registerTool(
        'funnels_redirects_list',
        {
            description: 'List redirects for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                limit: z
                    .number()
                    .optional()
                    .describe('Maximum number of items to return'),
                offset: z
                    .number()
                    .optional()
                    .describe('Number of items to skip')
            },
            annotations: {
                title: 'List Funnel Redirects',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().funnels.fetchRedirectsList(
                    stripUndefined(params)
                );
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
                            text: `Error listing redirects: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Create Redirect ─────────────────────────────────────────────────
    server.registerTool(
        'funnels_redirects_create',
        {
            description: 'Create a new redirect',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                domain: z.string().describe('The domain for the redirect'),
                path: z.string().describe('The path to redirect from'),
                target: z.string().describe('The target URL to redirect to'),
                action: z.string().describe('The redirect action type')
            },
            annotations: {
                title: 'Create Funnel Redirect',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().funnels.createRedirect(params);
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
                            text: `Error creating redirect: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Update Redirect ─────────────────────────────────────────────────
    server.registerTool(
        'funnels_redirects_update',
        {
            description: 'Update an existing redirect',
            inputSchema: {
                id: z.string().describe('The redirect ID'),
                locationId: z.string().describe('The location ID'),
                target: z.string().describe('The target URL to redirect to'),
                action: z.string().describe('The redirect action type')
            },
            annotations: {
                title: 'Update Funnel Redirect',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { id, ...body } = params;
                const result = await getGhlClient().funnels.updateRedirectById(
                    { id },
                    body
                );
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
                            text: `Error updating redirect: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Delete Redirect ─────────────────────────────────────────────────
    server.registerTool(
        'funnels_redirects_delete',
        {
            description: 'Delete a redirect',
            inputSchema: {
                id: z.string().describe('The redirect ID'),
                locationId: z.string().describe('The location ID')
            },
            annotations: {
                title: 'Delete Funnel Redirect',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().funnels.deleteRedirectById(params);
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
                            text: `Error deleting redirect: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
