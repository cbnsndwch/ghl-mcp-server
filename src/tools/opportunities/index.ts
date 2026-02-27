import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Opportunities-related MCP tools on the server.
 */
export function registerOpportunitiesTools(server: McpServer): void {
    // ── Search Opportunities ────────────────────────────────────────────
    server.registerTool(
        'opportunities_search',
        {
            description: 'Search opportunities',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                pipelineId: z
                    .string()
                    .optional()
                    .describe('Filter by pipeline ID'),
                contactId: z
                    .string()
                    .optional()
                    .describe('Filter by contact ID'),
                stageId: z.string().optional().describe('Filter by stage ID'),
                status: z
                    .string()
                    .optional()
                    .describe('Opportunity status filter'),
                assignedTo: z
                    .string()
                    .optional()
                    .describe('Filter by assigned user ID'),
                query: z.string().optional().describe('Search query string'),
                limit: z
                    .number()
                    .optional()
                    .describe('Maximum number of results'),
                page: z
                    .number()
                    .optional()
                    .describe('Page number for pagination')
            },
            annotations: {
                title: 'Search Opportunities',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().opportunities.searchOpportunity(
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
                            text: `Error searching opportunities: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Opportunity ─────────────────────────────────────────────────
    server.registerTool(
        'opportunities_get',
        {
            description: 'Get an opportunity by ID',
            inputSchema: {
                id: z.string().describe('The opportunity ID')
            },
            annotations: {
                title: 'Get Opportunity',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().opportunities.getOpportunity({
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
                            text: `Error getting opportunity: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Create Opportunity ──────────────────────────────────────────────
    server.registerTool(
        'opportunities_create',
        {
            description: 'Create a new opportunity',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                pipelineId: z.string().describe('The pipeline ID'),
                name: z.string().describe('Opportunity name'),
                stageId: z.string().describe('The stage ID'),
                contactId: z.string().describe('The contact ID'),
                status: z.string().describe('Opportunity status'),
                monetaryValue: z
                    .number()
                    .optional()
                    .describe('Monetary value of the opportunity'),
                assignedTo: z.string().optional().describe('Assigned user ID')
            },
            annotations: {
                title: 'Create Opportunity',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().opportunities.createOpportunity(
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
                            text: `Error creating opportunity: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Update Opportunity ──────────────────────────────────────────────
    server.registerTool(
        'opportunities_update',
        {
            description: 'Update an existing opportunity',
            inputSchema: {
                id: z.string().describe('The opportunity ID'),
                name: z.string().optional().describe('Opportunity name'),
                stageId: z.string().optional().describe('The stage ID'),
                status: z.string().optional().describe('Opportunity status'),
                monetaryValue: z
                    .number()
                    .optional()
                    .describe('Monetary value of the opportunity'),
                assignedTo: z.string().optional().describe('Assigned user ID')
            },
            annotations: {
                title: 'Update Opportunity',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { id, ...body } = params;
                const result =
                    await getGhlClient().opportunities.updateOpportunity(
                        { id },
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
                            text: `Error updating opportunity: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Delete Opportunity ──────────────────────────────────────────────
    server.registerTool(
        'opportunities_delete',
        {
            description: 'Delete an opportunity',
            inputSchema: {
                id: z.string().describe('The opportunity ID')
            },
            annotations: {
                title: 'Delete Opportunity',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().opportunities.deleteOpportunity({
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
                            text: `Error deleting opportunity: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Upsert Opportunity ──────────────────────────────────────────────
    server.registerTool(
        'opportunities_upsert',
        {
            description: 'Upsert an opportunity (create or update)',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                pipelineId: z.string().describe('The pipeline ID'),
                name: z.string().describe('Opportunity name'),
                stageId: z.string().describe('The stage ID'),
                contactId: z.string().describe('The contact ID'),
                status: z.string().describe('Opportunity status'),
                monetaryValue: z
                    .number()
                    .optional()
                    .describe('Monetary value of the opportunity')
            },
            annotations: {
                title: 'Upsert Opportunity',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().opportunities.upsertOpportunity(
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
                            text: `Error upserting opportunity: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Pipelines ───────────────────────────────────────────────────
    server.registerTool(
        'opportunities_getPipelines',
        {
            description: 'Get all pipelines for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID')
            },
            annotations: {
                title: 'Get Pipelines',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().opportunities.getPipelines({
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
                            text: `Error getting pipelines: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
