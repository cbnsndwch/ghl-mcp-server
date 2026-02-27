import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';

// Mock the GHL SDK so tool registrars don't need a real client
vi.mock('@cbnsndwch/ghl-sdk', () => {
    class HighLevel {
        constructor(_config: unknown) { }
    }
    return { HighLevel };
});

import { createServer } from '../../server.js';

interface RegisteredTool {
    title?: string;
    description?: string;
    annotations?: ToolAnnotations;
    enabled: boolean;
}

/**
 * Helper: get all registered tools from the server.
 * `_registeredTools` is a plain object keyed by tool name.
 */
function getRegisteredTools(server: McpServer): Record<string, RegisteredTool> {
    return (server as any)._registeredTools;
}

describe('tool annotations', () => {
    const server = createServer();
    const tools = getRegisteredTools(server);
    const toolEntries = Object.entries(tools);

    it('should have at least one registered tool', () => {
        expect(toolEntries.length).toBeGreaterThan(0);
    });

    it('every tool has annotations defined', () => {
        for (const [name, tool] of toolEntries) {
            expect(
                tool.annotations,
                `Tool "${name}" is missing annotations`
            ).toBeDefined();
        }
    });

    it('every tool has openWorldHint: true', () => {
        for (const [name, tool] of toolEntries) {
            expect(
                tool.annotations?.openWorldHint,
                `Tool "${name}" should have openWorldHint: true`
            ).toBe(true);
        }
    });

    it('every tool has a title annotation', () => {
        for (const [name, tool] of toolEntries) {
            // Title may be stored at tool.title (top-level config) or
            // inside tool.annotations.title depending on how it was registered.
            const title = tool.title ?? (tool.annotations as any)?.title;
            expect(
                title,
                `Tool "${name}" should have a title`
            ).toBeTruthy();
        }
    });

    it('read-only tools (get/list/search) have readOnlyHint: true', () => {
        // Tools whose names contain patterns like _get, _list, _search should be read-only
        const readOnlyPatterns = /_(get|list|search)/i;

        for (const [name, tool] of toolEntries) {
            if (readOnlyPatterns.test(name)) {
                expect(
                    tool.annotations?.readOnlyHint,
                    `Tool "${name}" looks read-only but readOnlyHint is not true`
                ).toBe(true);
            }
        }
    });

    it('delete tools have destructiveHint: true', () => {
        // Tools whose names contain _delete or _remove should be destructive
        const destructivePatterns = /_(delete|remove)/i;

        for (const [name, tool] of toolEntries) {
            if (destructivePatterns.test(name)) {
                expect(
                    tool.annotations?.destructiveHint,
                    `Tool "${name}" looks destructive but destructiveHint is not true`
                ).toBe(true);
            }
        }
    });

    it('non-read-only tools do not have readOnlyHint: true', () => {
        // Tools that mutate (create, update, delete, add, remove, upsert) should NOT be read-only
        const mutationPatterns = /_(create|update|delete|add|remove|upsert|set|enable|disable)/i;

        for (const [name, tool] of toolEntries) {
            if (mutationPatterns.test(name)) {
                expect(
                    tool.annotations?.readOnlyHint,
                    `Tool "${name}" looks like a mutation but has readOnlyHint: true`
                ).not.toBe(true);
            }
        }
    });
});
