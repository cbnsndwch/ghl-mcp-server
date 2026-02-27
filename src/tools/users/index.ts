import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Users-related MCP tools on the server.
 */
export function registerUsersTools(server: McpServer): void {
    // ── Get User ────────────────────────────────────────────────────────
    server.registerTool(
        'users_get',
        {
            description: 'Get a user by ID',
            inputSchema: {
                userId: z.string().describe('The user ID'),
            },
            annotations: {
                title: 'Get User',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().users.getUser({
                    userId: params.userId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting user: ${error.message}` }],
                };
            }
        }
    );

    // ── Search Users ────────────────────────────────────────────────────
    server.registerTool(
        'users_search',
        {
            description: 'Search users',
            inputSchema: {
                companyId: z.string().describe('The company ID'),
                locationId: z.string().optional().describe('Filter by location ID'),
                query: z.string().optional().describe('Search query string'),
                limit: z.string().optional().describe('Maximum number of results'),
                skip: z.string().optional().describe('Number of results to skip'),
                type: z.string().optional().describe('User type filter'),
                role: z.string().optional().describe('User role filter'),
                ids: z.string().optional().describe('Comma-separated user IDs'),
                sort: z.string().optional().describe('Sort field'),
                sortDirection: z.string().optional().describe('Sort direction (asc or desc)'),
                enabled2waySync: z.boolean().optional().describe('Filter by 2-way sync enabled'),
            },
            annotations: {
                title: 'Search Users',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().users.searchUsers(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error searching users: ${error.message}` }],
                };
            }
        }
    );

    // ── Update User ─────────────────────────────────────────────────────
    server.registerTool(
        'users_update',
        {
            description: 'Update an existing user',
            inputSchema: {
                firstName: z.string().optional().describe('First name'),
                lastName: z.string().optional().describe('Last name'),
                email: z.string().optional().describe('Email address'),
                phone: z.string().optional().describe('Phone number'),
                type: z.string().optional().describe('User type'),
                role: z.string().optional().describe('User role'),
                companyId: z.string().optional().describe('Company ID'),
                locationIds: z.array(z.string()).optional().describe('Location IDs'),
            },
            annotations: {
                title: 'Update User',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().users.updateUser(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating user: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete User ─────────────────────────────────────────────────────
    server.registerTool(
        'users_delete',
        {
            description: 'Delete a user',
            inputSchema: {},
            annotations: {
                title: 'Delete User',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async () => {
            try {
                const result = await getGhlClient().users.deleteUser();
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting user: ${error.message}` }],
                };
            }
        }
    );

    // ── Create User ─────────────────────────────────────────────────────
    server.registerTool(
        'users_create',
        {
            description: 'Create a new user',
            inputSchema: {
                companyId: z.string().describe('The company ID'),
                firstName: z.string().describe('First name'),
                lastName: z.string().describe('Last name'),
                email: z.string().describe('Email address'),
                password: z.string().describe('Password'),
                phone: z.string().optional().describe('Phone number'),
                type: z.string().describe('User type'),
                role: z.string().describe('User role'),
                locationIds: z.array(z.string()).describe('Location IDs to assign'),
            },
            annotations: {
                title: 'Create User',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().users.createUser(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating user: ${error.message}` }],
                };
            }
        }
    );
}
