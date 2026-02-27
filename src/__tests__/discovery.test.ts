import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Mock the GHL SDK so tool registrars don't need a real client at import time
vi.mock('@cbnsndwch/ghl-sdk', () => {
    const HighLevel = vi.fn().mockImplementation(() => ({}));
    return { HighLevel };
});

import { ToolCatalog } from '../discovery.js';
import type { CategoryEntry } from '../discovery.js';
import type { ToolRegistrar } from '../tools/types.js';

// ── Helpers ─────────────────────────────────────────────────────────────

/** Creates a minimal registrar that registers N dummy tools. */
function makeDummyRegistrar(prefix: string, count: number): ToolRegistrar {
    return (server: McpServer) => {
        for (let i = 1; i <= count; i++) {
            server.registerTool(
                `${prefix}_tool_${i}`,
                {
                    description: `Dummy tool ${i} in ${prefix}`
                },
                async () => ({
                    content: [{ type: 'text' as const, text: 'ok' }]
                })
            );
        }
    };
}

function makeEntries(): CategoryEntry[] {
    return [
        {
            meta: { name: 'alpha', label: 'Alpha', description: 'Alpha tools' },
            registrar: makeDummyRegistrar('alpha', 3)
        },
        {
            meta: { name: 'beta', label: 'Beta', description: 'Beta tools' },
            registrar: makeDummyRegistrar('beta', 2)
        }
    ];
}

// ── Tests ───────────────────────────────────────────────────────────────

describe('ToolCatalog', () => {
    it('creates without errors', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const catalog = new ToolCatalog(server, makeEntries());
        expect(catalog).toBeDefined();
    });

    it('all category tools start disabled', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const catalog = new ToolCatalog(server, makeEntries());
        const registeredTools = (server as any)._registeredTools as Record<
            string,
            { enabled: boolean }
        >;

        // Alpha and beta tools should be disabled
        for (const [name, tool] of Object.entries(registeredTools)) {
            if (name.startsWith('alpha_') || name.startsWith('beta_')) {
                expect(tool.enabled, `Tool "${name}" should be disabled`).toBe(
                    false
                );
            }
        }
    });

    it('meta-tools (ghl_list_categories, ghl_enable_category) are always enabled', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const _catalog = new ToolCatalog(server, makeEntries());
        const registeredTools = (server as any)._registeredTools as Record<
            string,
            { enabled: boolean }
        >;

        expect(registeredTools['ghl_list_categories']?.enabled).toBe(true);
        expect(registeredTools['ghl_enable_category']?.enabled).toBe(true);
    });

    it('getCategoryList returns correct metadata', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const catalog = new ToolCatalog(server, makeEntries());
        const list = catalog.getCategoryList();

        expect(list).toHaveLength(2);

        const alpha = list.find(c => c.name === 'alpha');
        expect(alpha).toBeDefined();
        expect(alpha!.label).toBe('Alpha');
        expect(alpha!.description).toBe('Alpha tools');
        expect(alpha!.toolCount).toBe(3);
        expect(alpha!.enabled).toBe(false);
        expect(alpha!.tools).toEqual([
            'alpha_tool_1',
            'alpha_tool_2',
            'alpha_tool_3'
        ]);

        const beta = list.find(c => c.name === 'beta');
        expect(beta).toBeDefined();
        expect(beta!.toolCount).toBe(2);
    });

    it('setCategory enables tools and updates state', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const catalog = new ToolCatalog(server, makeEntries());
        const registeredTools = (server as any)._registeredTools as Record<
            string,
            { enabled: boolean }
        >;

        // Enable alpha
        const affected = catalog.setCategory('alpha', true);
        expect(affected).toEqual([
            'alpha_tool_1',
            'alpha_tool_2',
            'alpha_tool_3'
        ]);

        // Alpha tools should be enabled
        expect(registeredTools['alpha_tool_1']?.enabled).toBe(true);
        expect(registeredTools['alpha_tool_2']?.enabled).toBe(true);
        expect(registeredTools['alpha_tool_3']?.enabled).toBe(true);

        // Beta tools should still be disabled
        expect(registeredTools['beta_tool_1']?.enabled).toBe(false);
        expect(registeredTools['beta_tool_2']?.enabled).toBe(false);

        // Category list reflects the change
        const list = catalog.getCategoryList();
        expect(list.find(c => c.name === 'alpha')!.enabled).toBe(true);
        expect(list.find(c => c.name === 'beta')!.enabled).toBe(false);
    });

    it('setCategory disables tools', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const catalog = new ToolCatalog(server, makeEntries());
        const registeredTools = (server as any)._registeredTools as Record<
            string,
            { enabled: boolean }
        >;

        catalog.setCategory('alpha', true);
        expect(registeredTools['alpha_tool_1']?.enabled).toBe(true);

        catalog.setCategory('alpha', false);
        expect(registeredTools['alpha_tool_1']?.enabled).toBe(false);
    });

    it('setCategory throws for unknown category', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const catalog = new ToolCatalog(server, makeEntries());

        expect(() => catalog.setCategory('nonexistent', true)).toThrow(
            'Unknown category: "nonexistent"'
        );
    });

    it('enableAll enables all category tools', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const catalog = new ToolCatalog(server, makeEntries());
        const registeredTools = (server as any)._registeredTools as Record<
            string,
            { enabled: boolean }
        >;

        catalog.enableAll();

        for (const [name, tool] of Object.entries(registeredTools)) {
            expect(
                tool.enabled,
                `Tool "${name}" should be enabled after enableAll()`
            ).toBe(true);
        }

        const list = catalog.getCategoryList();
        for (const cat of list) {
            expect(cat.enabled).toBe(true);
        }
    });

    it('can enable multiple categories independently', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const catalog = new ToolCatalog(server, makeEntries());
        const registeredTools = (server as any)._registeredTools as Record<
            string,
            { enabled: boolean }
        >;

        catalog.setCategory('alpha', true);
        catalog.setCategory('beta', true);

        expect(registeredTools['alpha_tool_1']?.enabled).toBe(true);
        expect(registeredTools['beta_tool_1']?.enabled).toBe(true);

        // Disable alpha, beta stays enabled
        catalog.setCategory('alpha', false);
        expect(registeredTools['alpha_tool_1']?.enabled).toBe(false);
        expect(registeredTools['beta_tool_1']?.enabled).toBe(true);
    });

    it('total registered tools = category tools + meta-tools', () => {
        const server = new McpServer({ name: 'test', version: '0.0.1' });
        const _catalog = new ToolCatalog(server, makeEntries());
        const registeredTools = (server as any)._registeredTools as Record<
            string,
            unknown
        >;
        const toolNames = Object.keys(registeredTools);

        // 3 (alpha) + 2 (beta) + 2 (meta) = 7
        expect(toolNames).toHaveLength(7);
    });
});
