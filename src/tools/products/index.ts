import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Products-related MCP tools on the server.
 */
export function registerProductsTools(server: McpServer): void {
    // ── List Products ───────────────────────────────────────────────────
    server.registerTool(
        'products_list',
        {
            description: 'List products for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                limit: z.number().optional().describe('Maximum number of results'),
                offset: z.number().optional().describe('Offset for pagination'),
                search: z.string().optional().describe('Search query'),
            },
            annotations: {
                title: 'List Products',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().products.listInvoices(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error listing products: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Product ─────────────────────────────────────────────────────
    server.registerTool(
        'products_get',
        {
            description: 'Get a product by ID',
            inputSchema: {
                productId: z.string().describe('The product ID'),
                locationId: z.string().describe('The location ID'),
            },
            annotations: {
                title: 'Get Product',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().products.getProductById({
                    productId: params.productId,
                    locationId: params.locationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting product: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Product ──────────────────────────────────────────────────
    server.registerTool(
        'products_create',
        {
            description: 'Create a new product',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                name: z.string().describe('Product name'),
                productType: z.string().describe('Product type'),
                description: z.string().optional().describe('Product description'),
                statementDescriptor: z.string().optional().describe('Statement descriptor for billing'),
                image: z.string().optional().describe('Product image URL'),
            },
            annotations: {
                title: 'Create Product',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().products.createProduct(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating product: ${error.message}` }],
                };
            }
        }
    );

    // ── Update Product ──────────────────────────────────────────────────
    server.registerTool(
        'products_update',
        {
            description: 'Update an existing product',
            inputSchema: {
                productId: z.string().describe('The product ID'),
                locationId: z.string().describe('The location ID'),
                name: z.string().describe('Product name'),
                productType: z.string().describe('Product type'),
                description: z.string().optional().describe('Product description'),
                statementDescriptor: z.string().optional().describe('Statement descriptor for billing'),
                image: z.string().optional().describe('Product image URL'),
            },
            annotations: {
                title: 'Update Product',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { productId, ...body } = params;
                const result = await getGhlClient().products.updateProductById(
                    { productId },
                    stripUndefined(body)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating product: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete Product ──────────────────────────────────────────────────
    server.registerTool(
        'products_delete',
        {
            description: 'Delete a product',
            inputSchema: {
                productId: z.string().describe('The product ID'),
                locationId: z.string().describe('The location ID'),
            },
            annotations: {
                title: 'Delete Product',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().products.deleteProductById({
                    productId: params.productId,
                    locationId: params.locationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting product: ${error.message}` }],
                };
            }
        }
    );
}
