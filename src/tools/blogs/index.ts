import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Blogs-related MCP tools on the server.
 */
export function registerBlogsTools(server: McpServer): void {
    // ── Get Blogs ───────────────────────────────────────────────────────
    server.registerTool(
        'blogs_list',
        {
            description: 'Get all blogs for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                skip: z.number().describe('Number of records to skip'),
                limit: z.number().describe('Maximum number of results'),
                searchTerm: z
                    .string()
                    .optional()
                    .describe('Search term to filter blogs')
            },
            annotations: {
                title: 'List Blogs',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().blogs.getBlogs(
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
                            text: `Error getting blogs: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Blog Authors ────────────────────────────────────────────────
    server.registerTool(
        'blogs_listAuthors',
        {
            description: 'Get blog authors for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                limit: z.number().describe('Maximum number of results'),
                offset: z.number().describe('Offset for pagination')
            },
            annotations: {
                title: 'List Blog Authors',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().blogs.getAllBlogAuthorsByLocation(
                        params
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
                            text: `Error getting blog authors: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Blog Categories ─────────────────────────────────────────────
    server.registerTool(
        'blogs_listCategories',
        {
            description: 'Get blog categories for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                limit: z.number().describe('Maximum number of results'),
                offset: z.number().describe('Offset for pagination')
            },
            annotations: {
                title: 'List Blog Categories',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().blogs.getAllCategoriesByLocation(
                        params
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
                            text: `Error getting blog categories: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Blog Posts by Blog ID ───────────────────────────────────────
    server.registerTool(
        'blogs_listPosts',
        {
            description: 'Get blog posts by blog ID',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                blogId: z.string().describe('The blog ID'),
                limit: z.number().describe('Maximum number of results'),
                offset: z.number().describe('Offset for pagination'),
                searchTerm: z
                    .string()
                    .optional()
                    .describe('Search term to filter posts'),
                status: z.string().optional().describe('Filter by post status')
            },
            annotations: {
                title: 'List Blog Posts',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().blogs.getBlogPost(
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
                            text: `Error getting blog posts: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Create Blog Post ────────────────────────────────────────────────
    server.registerTool(
        'blogs_createPost',
        {
            description: 'Create a new blog post',
            inputSchema: {
                title: z.string().describe('Post title'),
                locationId: z.string().describe('The location ID'),
                blogId: z.string().describe('The blog ID'),
                imageUrl: z.string().describe('Featured image URL'),
                description: z.string().describe('Post description/excerpt'),
                rawHTML: z.string().describe('Raw HTML content'),
                status: z.string().describe('Post status'),
                imageAltText: z.string().describe('Image alt text'),
                categories: z.array(z.string()).describe('Category IDs'),
                tags: z.array(z.string()).optional().describe('Tags'),
                author: z.string().describe('Author ID or name'),
                urlSlug: z.string().describe('URL slug'),
                canonicalLink: z
                    .string()
                    .optional()
                    .describe('Canonical link URL'),
                publishedAt: z.string().describe('Published date (ISO string)')
            },
            annotations: {
                title: 'Create Blog Post',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().blogs.createBlogPost(
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
                            text: `Error creating blog post: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Update Blog Post ────────────────────────────────────────────────
    server.registerTool(
        'blogs_updatePost',
        {
            description: 'Update an existing blog post',
            inputSchema: {
                title: z.string().describe('Post title'),
                locationId: z.string().describe('The location ID'),
                blogId: z.string().describe('The blog ID'),
                imageUrl: z.string().describe('Featured image URL'),
                description: z.string().describe('Post description/excerpt'),
                rawHTML: z.string().describe('Raw HTML content'),
                status: z.string().describe('Post status'),
                imageAltText: z.string().describe('Image alt text'),
                categories: z.array(z.string()).describe('Category IDs'),
                tags: z.array(z.string()).optional().describe('Tags'),
                author: z.string().describe('Author ID or name'),
                urlSlug: z.string().describe('URL slug'),
                canonicalLink: z
                    .string()
                    .optional()
                    .describe('Canonical link URL'),
                publishedAt: z.string().describe('Published date (ISO string)')
            },
            annotations: {
                title: 'Update Blog Post',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().blogs.updateBlogPost(
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
                            text: `Error updating blog post: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Check URL Slug ──────────────────────────────────────────────────
    server.registerTool(
        'blogs_checkUrlSlug',
        {
            description: 'Check if a blog URL slug already exists',
            inputSchema: {
                urlSlug: z.string().describe('The URL slug to check'),
                locationId: z.string().describe('The location ID'),
                postId: z
                    .string()
                    .optional()
                    .describe('Existing post ID to exclude from check')
            },
            annotations: {
                title: 'Check Blog URL Slug',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().blogs.checkUrlSlugExists(
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
                            text: `Error checking URL slug: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
