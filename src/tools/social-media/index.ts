import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Social Media Posting-related MCP tools on the server.
 */
export function registerSocialMediaTools(server: McpServer): void {
    // ── Get Google Business Locations ───────────────────────────────────
    server.registerTool(
        'social-media_get-google-locations',
        {
            description: 'Get Google Business locations',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                accountId: z.string().describe('The Google account ID')
            },
            annotations: {
                title: 'Get Google Business Locations',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().socialMediaPosting.getGoogleLocations({
                        locationId: params.locationId,
                        accountId: params.accountId
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
                            text: `Error getting Google Business locations: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Set Google Business Locations ───────────────────────────────────
    server.registerTool(
        'social-media_set-google-locations',
        {
            description: 'Set Google Business location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                accountId: z.string().describe('The Google account ID'),
                location: z
                    .record(z.string(), z.any())
                    .optional()
                    .describe('Google Business location object'),
                account: z
                    .record(z.string(), z.any())
                    .optional()
                    .describe('Google account object'),
                companyId: z.string().optional().describe('The company ID')
            },
            annotations: {
                title: 'Set Google Business Locations',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { locationId, accountId, ...body } = params;
                const result =
                    await getGhlClient().socialMediaPosting.setGoogleLocations(
                        { locationId, accountId },
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
                            text: `Error setting Google Business locations: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Accounts List ───────────────────────────────────────────────
    server.registerTool(
        'social-media_get-accounts',
        {
            description: 'Get social media accounts',
            inputSchema: {
                locationId: z.string().describe('The location ID')
            },
            annotations: {
                title: 'Get Social Media Accounts',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().socialMediaPosting.getAccount({
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
                            text: `Error getting social media accounts: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Search Posts ────────────────────────────────────────────────────
    server.registerTool(
        'social-media_search-posts',
        {
            description: 'Search social media posts',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                type: z.string().optional().describe('Post type filter'),
                accounts: z
                    .string()
                    .optional()
                    .describe('Comma-separated account IDs'),
                skip: z
                    .string()
                    .optional()
                    .describe('Number of records to skip (as string)'),
                limit: z
                    .string()
                    .optional()
                    .describe('Maximum number of results (as string)'),
                fromDate: z
                    .string()
                    .optional()
                    .describe('Start date filter (ISO string)'),
                toDate: z
                    .string()
                    .optional()
                    .describe('End date filter (ISO string)'),
                includeUsers: z
                    .string()
                    .optional()
                    .describe('Whether to include user details'),
                postType: z.string().optional().describe('Post type filter')
            },
            annotations: {
                title: 'Search Social Media Posts',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { locationId, ...body } = params;
                const result = await getGhlClient().socialMediaPosting.getPosts(
                    { locationId },
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
                            text: `Error searching posts: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Create Post ─────────────────────────────────────────────────────
    server.registerTool(
        'social-media_create-post',
        {
            description: 'Create a social media post',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                accountIds: z
                    .array(z.string())
                    .describe('Array of account IDs to post to'),
                summary: z.string().optional().describe('Post content/summary'),
                media: z
                    .array(z.record(z.string(), z.any()))
                    .optional()
                    .describe('Array of media objects to attach'),
                type: z.string().optional().describe('Post type'),
                scheduleDate: z
                    .string()
                    .optional()
                    .describe('Scheduled publish date (ISO string)'),
                status: z.string().optional().describe('Post status'),
                tags: z
                    .array(z.string())
                    .optional()
                    .describe('Tags for the post'),
                categoryId: z
                    .string()
                    .optional()
                    .describe('Category ID for the post')
            },
            annotations: {
                title: 'Create Social Media Post',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { locationId, ...body } = params;
                const result =
                    await getGhlClient().socialMediaPosting.createPost(
                        { locationId },
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
                            text: `Error creating post: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Post ────────────────────────────────────────────────────────
    server.registerTool(
        'social-media_get-post',
        {
            description: 'Get a social media post by ID',
            inputSchema: {
                id: z.string().describe('The post ID'),
                locationId: z.string().describe('The location ID')
            },
            annotations: {
                title: 'Get Social Media Post',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().socialMediaPosting.getPost({
                    id: params.id,
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
                            text: `Error getting post: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Edit Post ───────────────────────────────────────────────────────
    server.registerTool(
        'social-media_edit-post',
        {
            description: 'Edit a social media post',
            inputSchema: {
                id: z.string().describe('The post ID'),
                locationId: z.string().describe('The location ID'),
                accountIds: z
                    .array(z.string())
                    .optional()
                    .describe('Array of account IDs'),
                summary: z.string().optional().describe('Post content/summary'),
                media: z
                    .array(z.record(z.string(), z.any()))
                    .optional()
                    .describe('Array of media objects to attach'),
                scheduleDate: z
                    .string()
                    .optional()
                    .describe('Scheduled publish date (ISO string)'),
                status: z.string().optional().describe('Post status'),
                type: z.string().optional().describe('Post type'),
                tags: z
                    .array(z.string())
                    .optional()
                    .describe('Tags for the post'),
                categoryId: z
                    .string()
                    .optional()
                    .describe('Category ID for the post')
            },
            annotations: {
                title: 'Edit Social Media Post',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { id, locationId, ...body } = params;
                const result = await getGhlClient().socialMediaPosting.editPost(
                    { id, locationId },
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
                            text: `Error editing post: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Delete Post ─────────────────────────────────────────────────────
    server.registerTool(
        'social-media_delete-post',
        {
            description: 'Delete a social media post',
            inputSchema: {
                id: z.string().describe('The post ID'),
                locationId: z.string().describe('The location ID')
            },
            annotations: {
                title: 'Delete Social Media Post',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().socialMediaPosting.deletePost({
                        id: params.id,
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
                            text: `Error deleting post: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get CSV by Post ID ──────────────────────────────────────────────
    server.registerTool(
        'social-media_get-csv',
        {
            description: 'Get CSV report for a social media post',
            inputSchema: {
                id: z.string().describe('The post/CSV ID'),
                locationId: z.string().describe('The location ID'),
                skip: z
                    .string()
                    .optional()
                    .describe('Number of records to skip'),
                limit: z
                    .string()
                    .optional()
                    .describe('Maximum number of results')
            },
            annotations: {
                title: 'Get Social Media Post CSV',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().socialMediaPosting.getCsvPost(
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
                            text: `Error getting CSV report: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Category List ───────────────────────────────────────────────
    server.registerTool(
        'social-media_get-categories',
        {
            description: 'Get social media post categories',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                searchText: z
                    .string()
                    .optional()
                    .describe('Search text to filter categories'),
                limit: z
                    .string()
                    .optional()
                    .describe('Maximum number of results'),
                skip: z
                    .string()
                    .optional()
                    .describe('Number of records to skip')
            },
            annotations: {
                title: 'Get Social Media Categories',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().socialMediaPosting.getCategoriesLocationId(
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
                            text: `Error getting categories: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Tags ────────────────────────────────────────────────────────
    server.registerTool(
        'social-media_get-tags',
        {
            description: 'Get social media tags',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                searchText: z
                    .string()
                    .optional()
                    .describe('Search text to filter tags'),
                limit: z
                    .string()
                    .optional()
                    .describe('Maximum number of results'),
                skip: z
                    .string()
                    .optional()
                    .describe('Number of records to skip')
            },
            annotations: {
                title: 'Get Social Media Tags',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().socialMediaPosting.getTagsLocationId(
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
                            text: `Error getting tags: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Tags by IDs ─────────────────────────────────────────────────
    server.registerTool(
        'social-media_get-tags-by-ids',
        {
            description: 'Get social media tags by IDs',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                ids: z.array(z.string()).optional().describe('Array of tag IDs')
            },
            annotations: {
                title: 'Get Social Media Tags by IDs',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const { locationId, ...body } = params;
                const result =
                    await getGhlClient().socialMediaPosting.getTagsByIds(
                        { locationId },
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
                            text: `Error getting tags by IDs: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
