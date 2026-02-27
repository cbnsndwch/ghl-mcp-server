import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Courses-related MCP tools on the server.
 */
export function registerCoursesTools(server: McpServer): void {
    // ── Import Courses ──────────────────────────────────────────────────
    server.registerTool(
        'courses_import',
        {
            description: 'Import courses through public channels',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                userId: z.string().optional().describe('The user ID'),
                products: z
                    .array(z.record(z.string(), z.any()))
                    .describe(
                        'Array of product/course objects to import (each with title, description, categories, etc.)'
                    )
            },
            annotations: {
                title: 'Import Courses',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().courses.importCourses(
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
                            text: `Error importing courses: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
