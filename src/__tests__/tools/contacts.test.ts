/**
 * Unit tests for the contacts tool group.
 *
 * Pattern:
 *  1. Mock `../../ghl-client.js` so `getGhlClient()` returns a fake client.
 *  2. Create an McpServer, register the contacts tools.
 *  3. Invoke the tool callbacks directly via the internal `_registeredTools` map.
 *  4. Assert the correct SDK method was called with the expected parameters.
 *
 * This pattern can be replicated for any other tool group by swapping the
 * registrar import, the mock methods, and the tool names.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// ── Build a mock GHL client ────────────────────────────────────────────────
const mockContacts = {
    searchContactsAdvanced: vi.fn(),
    getContact: vi.fn(),
    createContact: vi.fn(),
    updateContact: vi.fn(),
    deleteContact: vi.fn(),
    upsertContact: vi.fn(),
    getDuplicateContact: vi.fn(),
    getContactsByBusinessId: vi.fn(),
    addTags: vi.fn(),
    removeTags: vi.fn(),
    getAllTasks: vi.fn(),
    createTask: vi.fn(),
    getAllNotes: vi.fn(),
    createNote: vi.fn(),
    addContactToCampaign: vi.fn(),
    removeContactFromCampaign: vi.fn(),
    addContactToWorkflow: vi.fn(),
    addFollowersContact: vi.fn(),
    removeFollowersContact: vi.fn(),
};

const mockClient = { contacts: mockContacts };

vi.mock('../../ghl-client.js', () => ({
    getGhlClient: () => mockClient,
}));

import { registerContactsTools } from '../../tools/contacts/index.js';

// ── Helpers ────────────────────────────────────────────────────────────────
interface RegisteredTool {
    handler: { call: (params: any, extra: any) => Promise<any> } | ((params: any, extra: any) => Promise<any>);
}

function createTestServer(): McpServer {
    const server = new McpServer(
        { name: 'test', version: '0.0.0' },
        { capabilities: { tools: {} } }
    );
    registerContactsTools(server);
    return server;
}

function getTool(server: McpServer, name: string): RegisteredTool {
    const tools = (server as any)._registeredTools as Record<string, RegisteredTool>;
    const tool = tools[name];
    if (!tool) {
        throw new Error(`Tool "${name}" not found. Available: ${Object.keys(tools).join(', ')}`);
    }
    return tool;
}

async function callTool(server: McpServer, name: string, params: Record<string, unknown> = {}) {
    const tool = getTool(server, name);
    // The handler can be either a direct function or an object with a `call` method
    const handler = typeof tool.handler === 'function' ? tool.handler : tool.handler.call;
    return handler(params, {});
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe('contacts tools', () => {
    let server: McpServer;

    beforeEach(() => {
        vi.clearAllMocks();
        server = createTestServer();
    });

    // ── contacts_search ────────────────────────────────────────────────
    describe('contacts_search', () => {
        it('calls searchContactsAdvanced with correct params', async () => {
            mockContacts.searchContactsAdvanced.mockResolvedValue({ contacts: [] });

            const result = await callTool(server, 'contacts_search', {
                locationId: 'loc-123',
                page: 1,
                pageLimit: 10,
            });

            expect(mockContacts.searchContactsAdvanced).toHaveBeenCalledWith({
                locationId: 'loc-123',
                page: 1,
                pageLimit: 10,
            });
            expect(result.content[0]!.type).toBe('text');
            expect(result.isError).toBeUndefined();
        });

        it('returns isError on failure', async () => {
            mockContacts.searchContactsAdvanced.mockRejectedValue(
                new Error('API down')
            );

            const result = await callTool(server, 'contacts_search', {
                locationId: 'loc-123',
            });

            expect(result.isError).toBe(true);
            expect(result.content[0]!.text).toContain('API down');
        });
    });

    // ── contacts_get ───────────────────────────────────────────────────
    describe('contacts_get', () => {
        it('calls getContact with the contact ID', async () => {
            mockContacts.getContact.mockResolvedValue({ contact: { id: 'c-1' } });

            const result = await callTool(server, 'contacts_get', {
                contactId: 'c-1',
            });

            expect(mockContacts.getContact).toHaveBeenCalledWith({ contactId: 'c-1' });
            expect(result.isError).toBeUndefined();

            const parsed = JSON.parse(result.content[0]!.text);
            expect(parsed.contact.id).toBe('c-1');
        });

        it('returns isError on failure', async () => {
            mockContacts.getContact.mockRejectedValue(new Error('Not found'));

            const result = await callTool(server, 'contacts_get', {
                contactId: 'bad-id',
            });

            expect(result.isError).toBe(true);
            expect(result.content[0]!.text).toContain('Not found');
        });
    });

    // ── contacts_create ────────────────────────────────────────────────
    describe('contacts_create', () => {
        it('calls createContact with params', async () => {
            mockContacts.createContact.mockResolvedValue({ contact: { id: 'new-1' } });

            const params = {
                locationId: 'loc-1',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
            };

            const result = await callTool(server, 'contacts_create', params);

            expect(mockContacts.createContact).toHaveBeenCalledWith(params);
            expect(result.isError).toBeUndefined();
        });

        it('returns isError on failure', async () => {
            mockContacts.createContact.mockRejectedValue(new Error('Validation error'));

            const result = await callTool(server, 'contacts_create', {
                locationId: 'loc-1',
            });

            expect(result.isError).toBe(true);
            expect(result.content[0]!.text).toContain('Validation error');
        });
    });

    // ── contacts_update ────────────────────────────────────────────────
    describe('contacts_update', () => {
        it('calls updateContact with contactId and body', async () => {
            mockContacts.updateContact.mockResolvedValue({ contact: { id: 'c-1' } });

            await callTool(server, 'contacts_update', {
                contactId: 'c-1',
                firstName: 'Updated',
            });

            expect(mockContacts.updateContact).toHaveBeenCalledWith(
                { contactId: 'c-1' },
                { firstName: 'Updated' }
            );
        });
    });

    // ── contacts_delete ────────────────────────────────────────────────
    describe('contacts_delete', () => {
        it('calls deleteContact with the contact ID', async () => {
            mockContacts.deleteContact.mockResolvedValue({ succeded: true });

            const result = await callTool(server, 'contacts_delete', {
                contactId: 'c-1',
            });

            expect(mockContacts.deleteContact).toHaveBeenCalledWith({ contactId: 'c-1' });
            expect(result.isError).toBeUndefined();
        });

        it('returns isError on failure', async () => {
            mockContacts.deleteContact.mockRejectedValue(new Error('Forbidden'));

            const result = await callTool(server, 'contacts_delete', {
                contactId: 'c-1',
            });

            expect(result.isError).toBe(true);
            expect(result.content[0]!.text).toContain('Forbidden');
        });
    });

    // ── contacts_add_tags ──────────────────────────────────────────────
    describe('contacts_add_tags', () => {
        it('calls addTags with contactId and tags', async () => {
            mockContacts.addTags.mockResolvedValue({ tags: ['vip'] });

            await callTool(server, 'contacts_add_tags', {
                contactId: 'c-1',
                tags: ['vip'],
            });

            expect(mockContacts.addTags).toHaveBeenCalledWith(
                { contactId: 'c-1' },
                { tags: ['vip'] }
            );
        });
    });

    // ── contacts_get_notes ─────────────────────────────────────────────
    describe('contacts_get_notes', () => {
        it('calls getAllNotes with the contact ID', async () => {
            mockContacts.getAllNotes.mockResolvedValue({ notes: [] });

            const result = await callTool(server, 'contacts_get_notes', {
                contactId: 'c-1',
            });

            expect(mockContacts.getAllNotes).toHaveBeenCalledWith({ contactId: 'c-1' });
            expect(result.isError).toBeUndefined();
        });
    });
});
