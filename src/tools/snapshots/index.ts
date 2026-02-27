import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';

/**
 * Register all Snapshots-related MCP tools on the server.
 */
export function registerSnapshotsTools(server: McpServer): void {
    // ── Get Snapshots ───────────────────────────────────────────────────
    server.registerTool(
        'snapshots_list',
        {
            description: 'Get snapshots for a company',
            inputSchema: {
                companyId: z.string().describe('The company ID')
            },
            annotations: {
                title: 'List Snapshots',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().snapshots.getCustomSnapshots({
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
                            text: `Error getting snapshots: ${error.message}`
                        }
                    ]
                };
            }
        }
    );

    // ── Get Last Push Status ────────────────────────────────────────────
    server.registerTool(
        'snapshots_get-push-status',
        {
            description: 'Get the last push status for a snapshot',
            inputSchema: {
                companyId: z.string().describe('The company ID'),
                snapshotId: z.string().describe('The snapshot ID'),
                locationId: z.string().describe('The location ID')
            },
            annotations: {
                title: 'Get Snapshot Push Status',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true
            }
        },
        async params => {
            try {
                const result =
                    await getGhlClient().snapshots.getLatestSnapshotPush({
                        companyId: params.companyId,
                        snapshotId: params.snapshotId,
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
                            text: `Error getting snapshot push status: ${error.message}`
                        }
                    ]
                };
            }
        }
    );
}
