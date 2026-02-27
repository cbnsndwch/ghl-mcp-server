import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Custom Menus-related MCP tools on the server.
 */
export function registerCustomMenusTools(server: McpServer): void {
    // ── Get Custom Menus ────────────────────────────────────────────────
    server.registerTool(
        'customMenus_list',
        {
            description: 'Get custom menus for a location',
            inputSchema: {
                locationId: z.string().optional().describe('The location ID'),
                skip: z.number().optional().describe('Number of records to skip'),
                limit: z.number().optional().describe('Maximum number of results'),
                query: z.string().optional().describe('Search query'),
                showOnCompany: z.boolean().optional().describe('Filter by show on company'),
            },
            annotations: {
                title: 'List Custom Menus',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().customMenus.getCustomMenus(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting custom menus: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Custom Menu ──────────────────────────────────────────────
    server.registerTool(
        'customMenus_create',
        {
            description: 'Create a new custom menu link',
            inputSchema: {
                title: z.string().describe('Menu title'),
                url: z.string().describe('Menu URL'),
                icon: z.any().describe('Icon object'),
                showOnCompany: z.boolean().describe('Show on company'),
                showOnLocation: z.boolean().describe('Show on location'),
                showToAllLocations: z.boolean().describe('Show to all locations'),
                openMode: z.string().describe('Open mode (e.g. "iframe", "new_tab")'),
                locations: z.array(z.string()).describe('Location IDs'),
                userRole: z.string().describe('User role'),
                allowCamera: z.boolean().optional().describe('Allow camera access'),
                allowMicrophone: z.boolean().optional().describe('Allow microphone access'),
            },
            annotations: {
                title: 'Create Custom Menu',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().customMenus.createCustomMenu(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating custom menu: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Custom Menu by ID ───────────────────────────────────────────
    server.registerTool(
        'customMenus_get',
        {
            description: 'Get a custom menu by ID',
            inputSchema: {
                customMenuId: z.string().describe('The custom menu ID'),
            },
            annotations: {
                title: 'Get Custom Menu',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().customMenus.getCustomMenuById({
                    customMenuId: params.customMenuId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting custom menu: ${error.message}` }],
                };
            }
        }
    );

    // ── Update Custom Menu ──────────────────────────────────────────────
    server.registerTool(
        'customMenus_update',
        {
            description: 'Update an existing custom menu',
            inputSchema: {
                customMenuId: z.string().describe('The custom menu ID'),
                title: z.string().optional().describe('Menu title'),
                url: z.string().optional().describe('Menu URL'),
                icon: z.any().optional().describe('Icon object'),
                showOnCompany: z.boolean().optional().describe('Show on company'),
                showOnLocation: z.boolean().optional().describe('Show on location'),
                showToAllLocations: z.boolean().optional().describe('Show to all locations'),
                openMode: z.string().optional().describe('Open mode'),
                locations: z.array(z.string()).optional().describe('Location IDs'),
                userRole: z.string().optional().describe('User role'),
                allowCamera: z.boolean().optional().describe('Allow camera access'),
                allowMicrophone: z.boolean().optional().describe('Allow microphone access'),
            },
            annotations: {
                title: 'Update Custom Menu',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { customMenuId, ...body } = params;
                const result = await getGhlClient().customMenus.updateCustomMenu(
                    { customMenuId },
                    stripUndefined(body)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating custom menu: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete Custom Menu ──────────────────────────────────────────────
    server.registerTool(
        'customMenus_delete',
        {
            description: 'Delete a custom menu by ID',
            inputSchema: {
                customMenuId: z.string().describe('The custom menu ID'),
            },
            annotations: {
                title: 'Delete Custom Menu',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().customMenus.deleteCustomMenu({
                    customMenuId: params.customMenuId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting custom menu: ${error.message}` }],
                };
            }
        }
    );
}
