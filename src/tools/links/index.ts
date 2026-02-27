import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Links-related MCP tools on the server.
 */
export function registerLinksTools(server: McpServer): void {
    // ── Get Links ───────────────────────────────────────────────────────
    server.registerTool(
        'links_list',
        {
            description: 'Get links for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID')
            },
            annotations: {
                title: 'List Links',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().links.getLinks(params);
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
                            text: `Error getting links: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Create Link ─────────────────────────────────────────────────────
    server.registerTool(
        'links_create',
        {
            description: 'Create a new link',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                name: z.string().describe('The link name'),
                redirectTo: z.string().describe('The URL to redirect to')
            },
            annotations: {
                title: 'Create Link',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().links.createLink(params);
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
                            text: `Error creating link: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Update Link ─────────────────────────────────────────────────────
    server.registerTool(
        'links_update',
        {
            description: 'Update an existing link',
            inputSchema: {
                linkId: z.string().describe('The link ID'),
                name: z.string().optional().describe('The link name'),
                redirectTo: z
                    .string()
                    .optional()
                    .describe('The URL to redirect to')
            },
            annotations: {
                title: 'Update Link',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { linkId, ...body } = params;
                const result = await getGhlClient().links.updateLink(
                    { linkId },
                    stripUndefined(body)
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
                            text: `Error updating link: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Delete Link ─────────────────────────────────────────────────────
    server.registerTool(
        'links_delete',
        {
            description: 'Delete a link',
            inputSchema: {
                linkId: z.string().describe('The link ID')
            },
            annotations: {
                title: 'Delete Link',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().links.deleteLink(params);
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
                            text: `Error deleting link: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
