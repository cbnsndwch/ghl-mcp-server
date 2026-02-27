import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Custom Fields-related MCP tools on the server.
 */
export function registerCustomFieldsTools(server: McpServer): void {
    // ── Get Custom Fields by Object Key ─────────────────────────────────
    server.registerTool(
        'customFields_list',
        {
            description: 'Get custom fields by object key for a location',
            inputSchema: {
                objectKey: z
                    .string()
                    .describe('The object key (e.g. "contact", "company")'),
                locationId: z.string().describe('The location ID')
            },
            annotations: {
                title: 'List Custom Fields',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().customFields.getCustomFieldsByObjectKey(
                        {
                            objectKey: params.objectKey,
                            locationId: params.locationId
                        }
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
                            text: `Error getting custom fields: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Create Custom Field ─────────────────────────────────────────────
    server.registerTool(
        'customFields_create',
        {
            description: 'Create a new custom field',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                name: z.string().optional().describe('Custom field name'),
                description: z
                    .string()
                    .optional()
                    .describe('Custom field description'),
                placeholder: z.string().optional().describe('Placeholder text'),
                showInForms: z.boolean().describe('Whether to show in forms'),
                dataType: z.string().describe('Data type of the custom field'),
                fieldKey: z.string().describe('The field key'),
                objectKey: z.string().describe('The object key'),
                parentId: z.string().describe('Parent folder ID'),
                options: z
                    .array(
                        z.object({
                            key: z.string(),
                            label: z.string(),
                            url: z.string().optional()
                        })
                    )
                    .optional()
                    .describe('Options for selection fields'),
                acceptedFormats: z
                    .string()
                    .optional()
                    .describe('Accepted file formats'),
                maxFileLimit: z
                    .number()
                    .optional()
                    .describe('Maximum file upload limit'),
                allowCustomOption: z
                    .boolean()
                    .optional()
                    .describe('Allow custom options')
            },
            annotations: {
                title: 'Create Custom Field',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().customFields.createCustomField(
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
                            text: `Error creating custom field: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Custom Field by ID ──────────────────────────────────────────
    server.registerTool(
        'customFields_get',
        {
            description: 'Get a custom field or folder by ID',
            inputSchema: {
                id: z.string().describe('The custom field ID')
            },
            annotations: {
                title: 'Get Custom Field',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().customFields.getCustomFieldById({
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
                            text: `Error getting custom field: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Update Custom Field ─────────────────────────────────────────────
    server.registerTool(
        'customFields_update',
        {
            description: 'Update an existing custom field',
            inputSchema: {
                id: z.string().describe('The custom field ID'),
                locationId: z.string().describe('The location ID'),
                name: z.string().optional().describe('Custom field name'),
                description: z
                    .string()
                    .optional()
                    .describe('Custom field description'),
                placeholder: z.string().optional().describe('Placeholder text'),
                showInForms: z.boolean().describe('Whether to show in forms'),
                options: z
                    .array(
                        z.object({
                            key: z.string(),
                            label: z.string(),
                            url: z.string().optional()
                        })
                    )
                    .optional()
                    .describe('Options for selection fields'),
                acceptedFormats: z
                    .string()
                    .optional()
                    .describe('Accepted file formats'),
                maxFileLimit: z
                    .number()
                    .optional()
                    .describe('Maximum file upload limit')
            },
            annotations: {
                title: 'Update Custom Field',
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
                    await getGhlClient().customFields.updateCustomField(
                        { id },
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
                            text: `Error updating custom field: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Delete Custom Field ─────────────────────────────────────────────
    server.registerTool(
        'customFields_delete',
        {
            description: 'Delete a custom field by ID',
            inputSchema: {
                id: z.string().describe('The custom field ID')
            },
            annotations: {
                title: 'Delete Custom Field',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().customFields.deleteCustomField({
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
                            text: `Error deleting custom field: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
