import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Surveys-related MCP tools on the server.
 */
export function registerSurveysTools(server: McpServer): void {
    // ── Get Surveys ─────────────────────────────────────────────────────
    server.registerTool(
        'surveys_list',
        {
            description: 'Get surveys for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                skip: z.number().optional().describe('Number of items to skip'),
                limit: z.number().optional().describe('Maximum number of items to return'),
                type: z.string().optional().describe('Filter by survey type'),
            },
            annotations: {
                title: 'List Surveys',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().surveys.getSurveys(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting surveys: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Survey Submissions ──────────────────────────────────────────
    server.registerTool(
        'surveys_submissions_list',
        {
            description: 'Get survey submissions for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                surveyId: z.string().optional().describe('Filter by survey ID'),
                page: z.number().optional().describe('Page number'),
                limit: z.number().optional().describe('Maximum number of items to return'),
                startAt: z.string().optional().describe('Start date filter (ISO string)'),
                endAt: z.string().optional().describe('End date filter (ISO string)'),
                q: z.string().optional().describe('Search query'),
            },
            annotations: {
                title: 'List Survey Submissions',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().surveys.getSurveysSubmissions(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting survey submissions: ${error.message}` }],
                };
            }
        }
    );
}
