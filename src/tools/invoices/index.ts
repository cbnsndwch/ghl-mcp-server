import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Invoices-related MCP tools on the server.
 */
export function registerInvoicesTools(server: McpServer): void {
    // ── List Invoices ───────────────────────────────────────────────────
    server.registerTool(
        'invoices_list',
        {
            description: 'List invoices',
            inputSchema: {
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                limit: z
                    .string()
                    .describe('Maximum number of results (as string)'),
                offset: z
                    .string()
                    .describe('Offset for pagination (as string)'),
                status: z.string().optional().describe('Invoice status filter'),
                contactId: z
                    .string()
                    .optional()
                    .describe('Filter by contact ID'),
                startAt: z
                    .string()
                    .optional()
                    .describe('Start date filter (ISO string)'),
                endAt: z
                    .string()
                    .optional()
                    .describe('End date filter (ISO string)'),
                search: z.string().optional().describe('Search query'),
                paymentMode: z
                    .string()
                    .optional()
                    .describe('Payment mode filter'),
                sortField: z.string().optional().describe('Field to sort by'),
                sortOrder: z
                    .string()
                    .optional()
                    .describe('Sort order (asc or desc)')
            },
            annotations: {
                title: 'List Invoices',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().invoices.listInvoices(
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
                            text: `Error listing invoices: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Invoice ─────────────────────────────────────────────────────
    server.registerTool(
        'invoices_get',
        {
            description: 'Get an invoice by ID',
            inputSchema: {
                invoiceId: z.string().describe('The invoice ID'),
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type')
            },
            annotations: {
                title: 'Get Invoice',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().invoices.getInvoice({
                    invoiceId: params.invoiceId,
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
                            text: `Error getting invoice: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Create Invoice ──────────────────────────────────────────────────
    server.registerTool(
        'invoices_create',
        {
            description: 'Create a new invoice',
            inputSchema: {
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                name: z.string().describe('Invoice name'),
                currency: z.string().describe('Currency code (e.g. USD)'),
                issueDate: z.string().describe('Issue date (ISO string)'),
                liveMode: z
                    .boolean()
                    .describe('Whether this is a live invoice'),
                businessDetails: z
                    .record(z.string(), z.any())
                    .describe('Business details'),
                contactDetails: z.any().describe('Contact details'),
                sentTo: z
                    .record(z.string(), z.any())
                    .describe('Sent to details'),
                items: z
                    .array(
                        z.object({
                            name: z.string().describe('Item name'),
                            amount: z.number().describe('Item amount'),
                            qty: z.number().describe('Item quantity')
                        })
                    )
                    .describe('Invoice line items'),
                discount: z
                    .record(z.string(), z.any())
                    .describe('Discount details'),
                dueDate: z
                    .string()
                    .optional()
                    .describe('Due date (ISO string)'),
                title: z.string().optional().describe('Invoice title'),
                termsNotes: z.string().optional().describe('Terms and notes'),
                invoiceNumber: z.string().optional().describe('Invoice number')
            },
            annotations: {
                title: 'Create Invoice',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().invoices.createInvoice(
                    stripUndefined(params) as any
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
                            text: `Error creating invoice: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Update Invoice ──────────────────────────────────────────────────
    server.registerTool(
        'invoices_update',
        {
            description: 'Update an existing invoice',
            inputSchema: {
                invoiceId: z.string().describe('The invoice ID'),
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                name: z.string().describe('Invoice name'),
                currency: z.string().describe('Currency code (e.g. USD)'),
                issueDate: z.string().describe('Issue date (ISO string)'),
                dueDate: z.string().describe('Due date (ISO string)'),
                invoiceItems: z
                    .array(
                        z.object({
                            name: z.string().describe('Item name'),
                            amount: z.number().describe('Item amount'),
                            qty: z.number().describe('Item quantity')
                        })
                    )
                    .describe('Invoice line items'),
                title: z.string().optional().describe('Invoice title'),
                description: z
                    .string()
                    .optional()
                    .describe('Invoice description'),
                termsNotes: z.string().optional().describe('Terms and notes'),
                contactId: z.string().optional().describe('Contact ID')
            },
            annotations: {
                title: 'Update Invoice',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { invoiceId, ...body } = params;
                const result = await getGhlClient().invoices.updateInvoice(
                    { invoiceId },
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
                            text: `Error updating invoice: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Delete Invoice ──────────────────────────────────────────────────
    server.registerTool(
        'invoices_delete',
        {
            description: 'Delete an invoice',
            inputSchema: {
                invoiceId: z.string().describe('The invoice ID'),
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type')
            },
            annotations: {
                title: 'Delete Invoice',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().invoices.deleteInvoice({
                    invoiceId: params.invoiceId,
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
                            text: `Error deleting invoice: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Send Invoice ────────────────────────────────────────────────────
    server.registerTool(
        'invoices_send',
        {
            description: 'Send an invoice',
            inputSchema: {
                invoiceId: z.string().describe('The invoice ID'),
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                userId: z.string().describe('The user ID sending the invoice'),
                action: z.string().describe('Send action (e.g. email, sms)'),
                liveMode: z.boolean().describe('Whether this is live mode')
            },
            annotations: {
                title: 'Send Invoice',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { invoiceId, ...body } = params;
                const result = await getGhlClient().invoices.sendInvoice(
                    { invoiceId },
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
                            text: `Error sending invoice: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Void Invoice ────────────────────────────────────────────────────
    server.registerTool(
        'invoices_void',
        {
            description: 'Void an invoice',
            inputSchema: {
                invoiceId: z.string().describe('The invoice ID'),
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type')
            },
            annotations: {
                title: 'Void Invoice',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { invoiceId, ...body } = params;
                const result = await getGhlClient().invoices.voidInvoice(
                    { invoiceId },
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
                            text: `Error voiding invoice: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Record Payment ──────────────────────────────────────────────────
    server.registerTool(
        'invoices_recordPayment',
        {
            description: 'Record a manual payment for an invoice',
            inputSchema: {
                invoiceId: z.string().describe('The invoice ID'),
                altId: z.string().describe('The alt ID'),
                altType: z.string().describe('The alt type'),
                mode: z.string().describe('Payment mode'),
                card: z.record(z.string(), z.any()).describe('Card details'),
                cheque: z
                    .record(z.string(), z.any())
                    .describe('Cheque details'),
                notes: z.string().describe('Payment notes'),
                amount: z.number().optional().describe('Payment amount')
            },
            annotations: {
                title: 'Record Invoice Payment',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { invoiceId, ...body } = params;
                const result = await getGhlClient().invoices.recordInvoice(
                    { invoiceId },
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
                            text: `Error recording payment: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
