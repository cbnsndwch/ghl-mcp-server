import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Medias-related MCP tools on the server.
 */
export function registerMediasTools(server: McpServer): void {
    // ── Get Files / Folders ─────────────────────────────────────────────
    server.registerTool(
        'medias_list',
        {
            description: 'Get files and folders from the media library',
            inputSchema: {
                altId: z
                    .string()
                    .describe('The alt ID (location or agency ID)'),
                altType: z.string().describe('The alt type (e.g. location)'),
                sortBy: z.string().describe('Field to sort by'),
                sortOrder: z.string().describe('Sort order (asc or desc)'),
                type: z.string().describe('File type filter'),
                limit: z
                    .string()
                    .optional()
                    .describe('Maximum number of results'),
                offset: z.string().optional().describe('Offset for pagination'),
                query: z.string().optional().describe('Search query'),
                parentId: z.string().optional().describe('Parent folder ID'),
                fetchAll: z
                    .string()
                    .optional()
                    .describe('Whether to fetch all results')
            },
            annotations: {
                title: 'List Media Files',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().medias.fetchMediaContent(
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
                            text: `Error getting media files: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Delete File or Folder ───────────────────────────────────────────
    server.registerTool(
        'medias_delete',
        {
            description: 'Delete a file or folder from the media library',
            inputSchema: {
                id: z.string().describe('The file or folder ID'),
                altType: z.string().describe('The alt type (e.g. location)'),
                altId: z.string().describe('The alt ID (location or agency ID)')
            },
            annotations: {
                title: 'Delete Media File',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().medias.deleteMediaContent({
                    id: params.id,
                    altType: params.altType,
                    altId: params.altId
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
                            text: `Error deleting media file: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
