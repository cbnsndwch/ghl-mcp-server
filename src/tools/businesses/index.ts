import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Businesses-related MCP tools on the server.
 */
export function registerBusinessesTools(server: McpServer): void {
    // ── Get Businesses by Location ──────────────────────────────────────
    server.registerTool(
        'businesses_list',
        {
            description: 'Get businesses for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
            },
            annotations: {
                title: 'List Businesses',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().businesses.getBusinessesByLocation({
                    locationId: params.locationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting businesses: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Business ─────────────────────────────────────────────────
    server.registerTool(
        'businesses_create',
        {
            description: 'Create a new business',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                name: z.string().describe('Business name'),
                phone: z.string().optional().describe('Phone number'),
                email: z.string().optional().describe('Email address'),
                website: z.string().optional().describe('Website URL'),
                address: z.string().optional().describe('Street address'),
                city: z.string().optional().describe('City'),
                state: z.string().optional().describe('State'),
                postalCode: z.string().optional().describe('Postal code'),
                country: z.string().optional().describe('Country'),
                description: z.string().optional().describe('Business description'),
            },
            annotations: {
                title: 'Create Business',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().businesses.createBusiness(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating business: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Business ────────────────────────────────────────────────────
    server.registerTool(
        'businesses_get',
        {
            description: 'Get a business by ID',
            inputSchema: {
                businessId: z.string().describe('The business ID'),
            },
            annotations: {
                title: 'Get Business',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().businesses.getBusiness({
                    businessId: params.businessId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting business: ${error.message}` }],
                };
            }
        }
    );

    // ── Update Business ─────────────────────────────────────────────────
    server.registerTool(
        'businesses_update',
        {
            description: 'Update an existing business',
            inputSchema: {
                businessId: z.string().describe('The business ID'),
                name: z.string().optional().describe('Business name'),
                phone: z.string().optional().describe('Phone number'),
                email: z.string().optional().describe('Email address'),
                website: z.string().optional().describe('Website URL'),
                address: z.string().optional().describe('Street address'),
                city: z.string().optional().describe('City'),
                state: z.string().optional().describe('State'),
                postalCode: z.string().optional().describe('Postal code'),
                country: z.string().optional().describe('Country'),
                description: z.string().optional().describe('Business description'),
            },
            annotations: {
                title: 'Update Business',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { businessId, ...body } = params;
                const result = await getGhlClient().businesses.updateBusiness(
                    { businessId },
                    stripUndefined(body)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating business: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete Business ─────────────────────────────────────────────────
    server.registerTool(
        'businesses_delete',
        {
            description: 'Delete a business by ID',
            inputSchema: {
                businessId: z.string().describe('The business ID'),
            },
            annotations: {
                title: 'Delete Business',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().businesses.deleteBusiness({
                    businessId: params.businessId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting business: ${error.message}` }],
                };
            }
        }
    );
}
