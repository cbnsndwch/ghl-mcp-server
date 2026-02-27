import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Locations-related MCP tools on the server.
 */
export function registerLocationsTools(server: McpServer): void {
    // ── Get Location ────────────────────────────────────────────────────
    server.registerTool(
        'locations_get',
        {
            description: 'Get a location by ID',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
            },
            annotations: {
                title: 'Get Location',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().locations.getLocation({
                    locationId: params.locationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting location: ${error.message}` }],
                };
            }
        }
    );

    // ── Update Location ─────────────────────────────────────────────────
    server.registerTool(
        'locations_update',
        {
            description: 'Update an existing location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                companyId: z.string().describe('The company ID'),
                name: z.string().optional().describe('Location name'),
                address: z.string().optional().describe('Street address'),
                city: z.string().optional().describe('City'),
                state: z.string().optional().describe('State'),
                country: z.string().optional().describe('Country'),
                postalCode: z.string().optional().describe('Postal code'),
                phone: z.string().optional().describe('Phone number'),
                website: z.string().optional().describe('Website URL'),
                timezone: z.string().optional().describe('Timezone'),
            },
            annotations: {
                title: 'Update Location',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { locationId, ...body } = params;
                const result = await getGhlClient().locations.putLocation(
                    { locationId },
                    stripUndefined(body)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating location: ${error.message}` }],
                };
            }
        }
    );

    // ── Search Locations ────────────────────────────────────────────────
    server.registerTool(
        'locations_search',
        {
            description: 'Search locations',
            inputSchema: {
                companyId: z.string().optional().describe('The company ID'),
                skip: z.string().optional().describe('Number of results to skip'),
                limit: z.string().optional().describe('Maximum number of results'),
                order: z.string().optional().describe('Sort order'),
                email: z.string().optional().describe('Filter by email address'),
            },
            annotations: {
                title: 'Search Locations',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().locations.searchLocations(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error searching locations: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Location ─────────────────────────────────────────────────
    server.registerTool(
        'locations_create',
        {
            description: 'Create a new location',
            inputSchema: {
                companyId: z.string().describe('The company ID'),
                name: z.string().describe('Location name'),
                address: z.string().optional().describe('Street address'),
                city: z.string().optional().describe('City'),
                state: z.string().optional().describe('State'),
                country: z.string().optional().describe('Country'),
                postalCode: z.string().optional().describe('Postal code'),
                phone: z.string().optional().describe('Phone number'),
                website: z.string().optional().describe('Website URL'),
                timezone: z.string().optional().describe('Timezone'),
            },
            annotations: {
                title: 'Create Location',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().locations.createLocation(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating location: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete Location ─────────────────────────────────────────────────
    server.registerTool(
        'locations_delete',
        {
            description: 'Delete a location by ID',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                deleteTwilioAccount: z.boolean().describe('Whether to also delete the associated Twilio account'),
            },
            annotations: {
                title: 'Delete Location',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().locations.deleteLocation({
                    locationId: params.locationId,
                    deleteTwilioAccount: params.deleteTwilioAccount,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting location: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Location Tags ───────────────────────────────────────────────
    server.registerTool(
        'locations_getTags',
        {
            description: 'Get tags for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
            },
            annotations: {
                title: 'Get Location Tags',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().locations.getLocationTags({
                    locationId: params.locationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting location tags: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Location Tag ─────────────────────────────────────────────
    server.registerTool(
        'locations_createTag',
        {
            description: 'Create a tag for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                name: z.string().describe('Tag name'),
            },
            annotations: {
                title: 'Create Location Tag',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { locationId, ...body } = params;
                const result = await getGhlClient().locations.createTag(
                    { locationId },
                    stripUndefined(body)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating location tag: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Location Custom Fields ──────────────────────────────────────
    server.registerTool(
        'locations_getCustomFields',
        {
            description: 'Get custom fields for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
            },
            annotations: {
                title: 'Get Location Custom Fields',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().locations.getCustomFields({
                    locationId: params.locationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting custom fields: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Location Custom Values ──────────────────────────────────────
    server.registerTool(
        'locations_getCustomValues',
        {
            description: 'Get custom values for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
            },
            annotations: {
                title: 'Get Location Custom Values',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().locations.getCustomValues({
                    locationId: params.locationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting custom values: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Location Custom Value ────────────────────────────────
    server.registerTool(
        'locations_createCustomValue',
        {
            description: 'Create a custom value for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                name: z.string().describe('The custom value name'),
                value: z.string().describe('The custom value'),
            },
            annotations: {
                title: 'Create Location Custom Value',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { locationId, ...body } = params;
                const result = await getGhlClient().locations.createCustomValue(
                    { locationId },
                    stripUndefined(body)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating custom value: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Location Templates ──────────────────────────────────────────
    server.registerTool(
        'locations_getTemplates',
        {
            description: 'Get email/SMS templates for a location',
            inputSchema: {
                originId: z.string().describe('The origin ID'),
                locationId: z.string().describe('The location ID'),
                deleted: z.boolean().optional().describe('Include deleted templates'),
                skip: z.string().optional().describe('Number of results to skip'),
                limit: z.string().optional().describe('Maximum number of results'),
                type: z.string().optional().describe('Filter by template type'),
            },
            annotations: {
                title: 'Get Location Templates',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().locations.gETAllOrEmailSmsTemplates(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting location templates: ${error.message}` }],
                };
            }
        }
    );
}
