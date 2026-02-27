import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Mock the GHL SDK so tool registrars don't need a real client at import time
vi.mock('@cbnsndwch/ghl-sdk', () => {
    const HighLevel = vi.fn().mockImplementation(() => ({}));
    return { HighLevel };
});

import { createServer } from '../server.js';

describe('createServer', () => {
    it('returns a McpServer instance', () => {
        const server = createServer();
        expect(server).toBeInstanceOf(McpServer);
    });

    it('has the correct name and version', () => {
        const server = createServer();
        // The underlying Server is accessible via server.server and stores serverInfo
        // Access _registeredTools via the McpServer to indirectly confirm it was configured
        // The server info is passed to the protocol-level Server constructor
        const serverInfo = (server.server as any)._serverInfo as {
            name: string;
            version: string;
        };
        expect(serverInfo.name).toBe('ghl-mcp-server');
        expect(serverInfo.version).toBe('0.1.0');
    });

    it('registers all 28 tool groups (tools are present)', () => {
        const server = createServer();
        const registeredTools = (server as any)._registeredTools as Record<
            string,
            unknown
        >;
        const toolNames = Object.keys(registeredTools);

        // There should be a significant number of tools registered (28 groups, each with 1+ tools)
        expect(toolNames.length).toBeGreaterThan(0);

        // Verify representative tools from different groups exist
        const expectedPrefixes = [
            'contacts_',
            'calendars_',
            'conversations_',
            'opportunities_',
            'workflows_',
            'users_',
            'locations_',
            'businesses_',
            'campaigns_',
            'forms_',
            'surveys_',
            'funnels_',
            'links_',
            'medias_',
            'products_',
            'payments_',
            'invoices_',
            'emails_',
            'companies_',
            'customFields_',
            'customMenus_',
            'courses_',
            'blogs_',
            'social-media_',
            'snapshots_',
            'associations_',
            'objects_',
            'saas-api_'
        ];

        for (const prefix of expectedPrefixes) {
            const hasToolsWithPrefix = toolNames.some(name =>
                name.startsWith(prefix)
            );
            expect(
                hasToolsWithPrefix,
                `Expected at least one tool starting with "${prefix}"`
            ).toBe(true);
        }
    });

    it('each registered tool has a description', () => {
        const server = createServer();
        const registeredTools = (server as any)._registeredTools as Record<
            string,
            { description?: string }
        >;

        for (const [name, tool] of Object.entries(registeredTools)) {
            expect(
                tool.description,
                `Tool "${name}" should have a description`
            ).toBeTruthy();
        }
    });
});
