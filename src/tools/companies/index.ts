import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';

/**
 * Register all Companies-related MCP tools on the server.
 */
export function registerCompaniesTools(server: McpServer): void {
    // ── Get Company ─────────────────────────────────────────────────────
    server.registerTool(
        'companies_get',
        {
            description: 'Get a company by ID',
            inputSchema: {
                companyId: z.string().describe('The company ID')
            },
            annotations: {
                title: 'Get Company',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result = await getGhlClient().companies.getCompany({
                    companyId: params.companyId
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
                            text: `Error getting company: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
