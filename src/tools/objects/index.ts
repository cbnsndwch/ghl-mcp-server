import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Objects-related MCP tools on the server.
 */
export function registerObjectsTools(server: McpServer): void {
    // ── Get Object Schema by Key ────────────────────────────────────────
    server.registerTool(
        'objects_get-by-key',
        {
            description: 'Get an object schema by key or ID',
            inputSchema: {
                key: z.string().describe('The object key or ID'),
                locationId: z.string().describe('The location ID'),
                fetchProperties: z
                    .string()
                    .optional()
                    .describe('Whether to fetch properties')
            },
            annotations: {
                title: 'Get Object Schema by Key',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().objects.getObjectSchemaByKey(
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
                            text: `Error getting object: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Search Object Records ───────────────────────────────────────────
    server.registerTool(
        'objects_search-records',
        {
            description: 'Search records for an object',
            inputSchema: {
                schemaKey: z
                    .string()
                    .optional()
                    .describe('The object schema key'),
                locationId: z.string().describe('The location ID'),
                query: z.string().describe('Search query string'),
                searchAfter: z
                    .array(z.string())
                    .optional()
                    .describe('Pagination cursor (searchAfter tokens)'),
                page: z.number().describe('Page number'),
                pageLimit: z.number().describe('Number of results per page')
            },
            annotations: {
                title: 'Search Object Records',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { schemaKey, ...body } = params;
                const result = await getGhlClient().objects.searchObjectRecords(
                    stripUndefined({ schemaKey }),
                    stripUndefined(body) as any
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
                            text: `Error searching object records: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Object Record ───────────────────────────────────────────────
    server.registerTool(
        'objects_get-record',
        {
            description: 'Get a single object record by ID',
            inputSchema: {
                schemaKey: z.string().describe('The object schema key'),
                id: z.string().describe('The record ID')
            },
            annotations: {
                title: 'Get Object Record',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().objects.getRecordById({
                    schemaKey: params.schemaKey,
                    id: params.id
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
                            text: `Error getting object record: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Create Object Record ────────────────────────────────────────────
    server.registerTool(
        'objects_create-record',
        {
            description: 'Create a new object record',
            inputSchema: {
                schemaKey: z.string().describe('The object schema key'),
                locationId: z.string().describe('The location ID'),
                properties: z
                    .record(z.string(), z.any())
                    .optional()
                    .describe('Record properties'),
                owners: z
                    .array(z.string())
                    .optional()
                    .describe('Array of owner IDs')
            },
            annotations: {
                title: 'Create Object Record',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { schemaKey, ...body } = params;
                const result = await getGhlClient().objects.createObjectRecord(
                    { schemaKey },
                    stripUndefined(body) as any
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
                            text: `Error creating object record: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Update Object Record ────────────────────────────────────────────
    server.registerTool(
        'objects_update-record',
        {
            description: 'Update an existing object record',
            inputSchema: {
                schemaKey: z.string().describe('The object schema key'),
                id: z.string().describe('The record ID'),
                locationId: z.string().describe('The location ID'),
                properties: z
                    .record(z.string(), z.any())
                    .optional()
                    .describe('Record properties to update'),
                owners: z
                    .array(z.string())
                    .optional()
                    .describe('Array of owner IDs')
            },
            annotations: {
                title: 'Update Object Record',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { schemaKey, id, locationId, ...body } = params;
                const result = await getGhlClient().objects.updateObjectRecord(
                    { schemaKey, id, locationId },
                    stripUndefined(body) as any
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
                            text: `Error updating object record: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Delete Object Record ────────────────────────────────────────────
    server.registerTool(
        'objects_delete-record',
        {
            description: 'Delete an object record',
            inputSchema: {
                schemaKey: z.string().describe('The object schema key'),
                id: z.string().describe('The record ID')
            },
            annotations: {
                title: 'Delete Object Record',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().objects.deleteObjectRecord({
                    schemaKey: params.schemaKey,
                    id: params.id
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
                            text: `Error deleting object record: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
