/**
 * End-to-end tests for the MCP server lifecycle.
 *
 * Uses the MCP SDK's `Client` and `InMemoryTransport` to simulate a real
 * client ↔ server conversation over the MCP protocol without any network I/O.
 */
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

// ── Mock the GHL SDK client ────────────────────────────────────────────────
const mockContacts = {
    searchContactsAdvanced: vi.fn().mockResolvedValue({
        contacts: [{ id: 'c-1', name: 'Alice' }],
        total: 1
    }),
    getContact: vi.fn().mockResolvedValue({
        contact: { id: 'c-1', firstName: 'Alice' }
    }),
    createContact: vi.fn().mockResolvedValue({
        contact: { id: 'c-new' }
    })
};

vi.mock('../../ghl-client.js', () => ({
    getGhlClient: () => ({ contacts: mockContacts })
}));

vi.mock('@cbnsndwch/ghl-sdk', () => {
    class HighLevel {
        constructor(_config: unknown) {}
    }
    return { HighLevel };
});

import { createServer } from '../../server.js';

// ── Helpers ────────────────────────────────────────────────────────────────
async function createConnectedPair() {
    const server = createServer();
    const client = new Client({ name: 'test-client', version: '0.0.0' });

    const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();

    await Promise.all([
        server.connect(serverTransport),
        client.connect(clientTransport)
    ]);

    return { server, client, clientTransport, serverTransport };
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe('server lifecycle (e2e)', () => {
    let server: McpServer;
    let client: Client;

    beforeAll(async () => {
        const pair = await createConnectedPair();
        server = pair.server;
        client = pair.client;
    });

    afterAll(async () => {
        await client.close();
        await server.close();
    });

    it('server connects successfully', () => {
        // If we got here, the server is connected
        expect(server).toBeDefined();
        expect(client).toBeDefined();
    });

    it('client can list tools via the MCP protocol', async () => {
        const result = await client.listTools();

        expect(result.tools).toBeDefined();
        expect(Array.isArray(result.tools)).toBe(true);
        expect(result.tools.length).toBeGreaterThan(0);

        // Verify that contacts_search is among the listed tools
        const contactsSearch = result.tools.find(
            t => t.name === 'contacts_search'
        );
        expect(contactsSearch).toBeDefined();
        expect(contactsSearch!.description).toBeTruthy();
        expect(contactsSearch!.inputSchema).toBeDefined();
    });

    it('tool listing includes annotations', async () => {
        const result = await client.listTools();

        const contactsGet = result.tools.find(t => t.name === 'contacts_get');
        expect(contactsGet).toBeDefined();
        expect(contactsGet!.annotations).toBeDefined();
        expect(contactsGet!.annotations!.readOnlyHint).toBe(true);
        expect(contactsGet!.annotations!.openWorldHint).toBe(true);
    });

    it('client can call a tool and receive a result', async () => {
        mockContacts.getContact.mockResolvedValueOnce({
            contact: { id: 'c-42', firstName: 'Bob' }
        });

        const result = await client.callTool({
            name: 'contacts_get',
            arguments: { contactId: 'c-42' }
        });

        expect(result.isError).toBeFalsy();
        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);

        const textContent = result.content as Array<{
            type: string;
            text: string;
        }>;
        expect(textContent[0]!.type).toBe('text');

        const parsed = JSON.parse(textContent[0]!.text);
        expect(parsed.contact.id).toBe('c-42');
        expect(parsed.contact.firstName).toBe('Bob');
    });

    it('tool call error returns isError content', async () => {
        mockContacts.getContact.mockRejectedValueOnce(new Error('Not found'));

        const result = await client.callTool({
            name: 'contacts_get',
            arguments: { contactId: 'bad-id' }
        });

        expect(result.isError).toBe(true);
        const textContent = result.content as Array<{
            type: string;
            text: string;
        }>;
        expect(textContent[0]!.text).toContain('Not found');
    });

    it('calling a non-existent tool returns an error', async () => {
        const result = await client.callTool({
            name: 'nonexistent_tool',
            arguments: {}
        });

        expect(result.isError).toBe(true);
        const textContent = result.content as Array<{
            type: string;
            text: string;
        }>;
        expect(textContent[0]!.text).toContain('nonexistent_tool');
    });
});
