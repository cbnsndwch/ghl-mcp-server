import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all SaaS API-related MCP tools on the server.
 */
export function registerSaasApiTools(server: McpServer): void {
    // ── Get SaaS Locations ──────────────────────────────────────────────
    server.registerTool(
        'saas-api_get-locations',
        {
            description: 'Get SaaS-activated locations for a company with pagination',
            inputSchema: {
                companyId: z.string().describe('The company ID'),
                page: z.number().describe('Page number for pagination'),
            },
            annotations: {
                title: 'Get SaaS Locations',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().saasApi.getSaasLocations({
                    companyId: params.companyId,
                    page: params.page,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting SaaS locations: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Location Subscription ───────────────────────────────────────
    server.registerTool(
        'saas-api_get-location-subscription',
        {
            description: 'Get subscription details for a SaaS location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                companyId: z.string().describe('The company ID'),
            },
            annotations: {
                title: 'Get SaaS Location Subscription',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().saasApi.getLocationSubscription({
                    locationId: params.locationId,
                    companyId: params.companyId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting location subscription: ${error.message}` }],
                };
            }
        }
    );

    // ── Enable SaaS for Location ────────────────────────────────────────
    server.registerTool(
        'saas-api_enable-saas',
        {
            description: 'Enable SaaS for a sub-account location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                companyId: z.string().describe('The company ID'),
                isSaaSV2: z.boolean().describe('Whether to use SaaS v2'),
                stripeAccountId: z.string().optional().describe('Stripe account ID'),
                name: z.string().optional().describe('Name'),
                email: z.string().optional().describe('Email'),
                stripeCustomerId: z.string().optional().describe('Stripe customer ID'),
                contactId: z.string().optional().describe('Contact ID'),
                providerLocationId: z.string().optional().describe('Provider location ID'),
                description: z.string().optional().describe('Description'),
                saasPlanId: z.string().optional().describe('SaaS plan ID'),
            },
            annotations: {
                title: 'Enable SaaS for Location',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { locationId, ...body } = params;
                const result = await getGhlClient().saasApi.enableSaasLocation(
                    { locationId },
                    stripUndefined(body) as any
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error enabling SaaS: ${error.message}` }],
                };
            }
        }
    );

    // ── Update Rebilling ────────────────────────────────────────────────
    server.registerTool(
        'saas-api_update-rebilling',
        {
            description: 'Update rebilling configuration',
            inputSchema: {
                companyId: z.string().describe('The company ID'),
                product: z.string().describe('The product identifier'),
                locationIds: z.array(z.string()).describe('Array of location IDs'),
                config: z.record(z.string(), z.any()).describe('Rebilling configuration object'),
            },
            annotations: {
                title: 'Update SaaS Rebilling',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { companyId, ...body } = params;
                const result = await getGhlClient().saasApi.updateRebilling(
                    { companyId },
                    stripUndefined(body) as any
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating rebilling: ${error.message}` }],
                };
            }
        }
    );
}
