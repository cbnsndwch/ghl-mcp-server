import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Payments-related MCP tools on the server.
 */
export function registerPaymentsTools(server: McpServer): void {
    // ── List Orders ─────────────────────────────────────────────────────
    server.registerTool(
        'payments_listOrders',
        {
            description: 'List payment orders',
            inputSchema: {
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                locationId: z.string().optional().describe('The location ID'),
                contactId: z
                    .string()
                    .optional()
                    .describe('Filter by contact ID'),
                limit: z
                    .number()
                    .optional()
                    .describe('Maximum number of results'),
                offset: z.number().optional().describe('Offset for pagination'),
                status: z.string().optional().describe('Order status filter'),
                paymentMode: z
                    .string()
                    .optional()
                    .describe('Payment mode filter'),
                startAt: z
                    .string()
                    .optional()
                    .describe('Start date filter (ISO string)'),
                endAt: z
                    .string()
                    .optional()
                    .describe('End date filter (ISO string)'),
                search: z.string().optional().describe('Search query'),
                funnelProductIds: z
                    .string()
                    .optional()
                    .describe('Funnel product IDs filter')
            },
            annotations: {
                title: 'List Payment Orders',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().payments.listOrders(
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
                            text: `Error listing orders: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Order by ID ─────────────────────────────────────────────────
    server.registerTool(
        'payments_getOrder',
        {
            description: 'Get a payment order by ID',
            inputSchema: {
                orderId: z.string().describe('The order ID'),
                altId: z.string().describe('The alt ID'),
                locationId: z.string().optional().describe('The location ID')
            },
            annotations: {
                title: 'Get Payment Order',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().payments.getOrderById(
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
                            text: `Error getting order: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── List Transactions ───────────────────────────────────────────────
    server.registerTool(
        'payments_listTransactions',
        {
            description: 'List payment transactions',
            inputSchema: {
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                locationId: z.string().optional().describe('The location ID'),
                contactId: z
                    .string()
                    .optional()
                    .describe('Filter by contact ID'),
                limit: z
                    .number()
                    .optional()
                    .describe('Maximum number of results'),
                offset: z.number().optional().describe('Offset for pagination'),
                startAt: z
                    .string()
                    .optional()
                    .describe('Start date filter (ISO string)'),
                endAt: z
                    .string()
                    .optional()
                    .describe('End date filter (ISO string)'),
                search: z.string().optional().describe('Search query'),
                entityId: z.string().optional().describe('Filter by entity ID'),
                entitySourceType: z
                    .string()
                    .optional()
                    .describe('Filter by entity source type'),
                subscriptionId: z
                    .string()
                    .optional()
                    .describe('Filter by subscription ID'),
                paymentMode: z
                    .string()
                    .optional()
                    .describe('Filter by payment mode')
            },
            annotations: {
                title: 'List Payment Transactions',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().payments.listTransactions(
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
                            text: `Error listing transactions: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Transaction by ID ───────────────────────────────────────────
    server.registerTool(
        'payments_getTransaction',
        {
            description: 'Get a payment transaction by ID',
            inputSchema: {
                transactionId: z.string().describe('The transaction ID'),
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                locationId: z.string().optional().describe('The location ID')
            },
            annotations: {
                title: 'Get Payment Transaction',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().payments.getTransactionById(
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
                            text: `Error getting transaction: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── List Subscriptions ──────────────────────────────────────────────
    server.registerTool(
        'payments_listSubscriptions',
        {
            description: 'List payment subscriptions',
            inputSchema: {
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                contactId: z
                    .string()
                    .optional()
                    .describe('Filter by contact ID'),
                limit: z
                    .number()
                    .optional()
                    .describe('Maximum number of results'),
                offset: z.number().optional().describe('Offset for pagination'),
                entityId: z.string().optional().describe('Filter by entity ID'),
                search: z.string().optional().describe('Search query')
            },
            annotations: {
                title: 'List Payment Subscriptions',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().payments.listSubscriptions(
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
                            text: `Error listing subscriptions: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Subscription by ID ──────────────────────────────────────────
    server.registerTool(
        'payments_getSubscription',
        {
            description: 'Get a payment subscription by ID',
            inputSchema: {
                subscriptionId: z.string().describe('The subscription ID'),
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type')
            },
            annotations: {
                title: 'Get Payment Subscription',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().payments.getSubscriptionById({
                        subscriptionId: params.subscriptionId,
                        altId: params.altId,
                        altType: params.altType
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
                            text: `Error getting subscription: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── List Integration Providers ──────────────────────────────────────
    server.registerTool(
        'payments_listIntegrations',
        {
            description: 'List payment integration providers',
            inputSchema: {
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                limit: z
                    .number()
                    .optional()
                    .describe('Maximum number of results'),
                offset: z.number().optional().describe('Offset for pagination')
            },
            annotations: {
                title: 'List Payment Integrations',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().payments.listIntegrationProviders(
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
                            text: `Error listing payment integrations: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
