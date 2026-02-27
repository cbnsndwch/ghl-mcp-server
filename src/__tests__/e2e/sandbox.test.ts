/**
 * End-to-end sandbox tests that run against a real GHL sandbox agency.
 *
 * These tests are **skipped by default** unless the `GHL_SANDBOX_TOKEN`
 * environment variable is set to a valid HighLevel Private Integration token.
 *
 * Usage:
 *   GHL_SANDBOX_TOKEN=<token> GHL_SANDBOX_LOCATION_ID=<locId> pnpm vitest run src/__tests__/e2e/sandbox.test.ts
 */
import { describe, it, expect, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

import { initGhlClient } from '../../ghl-client.js';
import { createServer } from '../../server.js';

const SANDBOX_TOKEN = process.env['GHL_SANDBOX_TOKEN'];
const LOCATION_ID = process.env['GHL_SANDBOX_LOCATION_ID'] ?? '';

// ── Helpers ────────────────────────────────────────────────────────────────
async function createSandboxPair() {
    // Initialize the real GHL client
    initGhlClient(SANDBOX_TOKEN!);

    const server = createServer();
    const client = new Client({ name: 'sandbox-test', version: '0.0.0' });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([
        server.connect(serverTransport),
        client.connect(clientTransport),
    ]);

    return { server, client };
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe.skipIf(!SANDBOX_TOKEN)('sandbox e2e', () => {
    let client: Client;
    let cleanup: () => Promise<void>;

    // Track contact IDs created during tests so we can clean up
    const createdContactIds: string[] = [];

    // One-time setup: create the connected client/server pair
    // Using a lazy init pattern since beforeAll can't be inside skipIf easily
    async function ensureClient() {
        if (!client) {
            const pair = await createSandboxPair();
            client = pair.client;
            cleanup = async () => {
                await pair.client.close();
                await pair.server.close();
            };
        }
        return client;
    }

    afterAll(async () => {
        // Clean up any contacts created during tests
        if (client) {
            for (const contactId of createdContactIds) {
                try {
                    await client.callTool({
                        name: 'contacts_delete',
                        arguments: { contactId },
                    });
                } catch {
                    // Ignore cleanup errors
                }
            }
            await cleanup();
        }
    });

    it('lists contacts', async () => {
        const c = await ensureClient();

        const result = await c.callTool({
            name: 'contacts_search',
            arguments: {
                locationId: LOCATION_ID,
                page: 1,
                pageLimit: 5,
            },
        });

        expect(result.isError).toBeFalsy();
        const textContent = result.content as Array<{ type: string; text: string }>;
        const parsed = JSON.parse(textContent[0]!.text);
        expect(parsed).toBeDefined();
    });

    it('creates and deletes a contact', async () => {
        const c = await ensureClient();

        // Create
        const createResult = await c.callTool({
            name: 'contacts_create',
            arguments: {
                locationId: LOCATION_ID,
                firstName: 'Test',
                lastName: 'Sandbox',
                email: `sandbox-${Date.now()}@test.example.com`,
            },
        });

        expect(createResult.isError).toBeFalsy();
        const created = JSON.parse(
            (createResult.content as Array<{ text: string }>)[0]!.text
        );
        const contactId = created.contact?.id;
        expect(contactId).toBeTruthy();

        // Track for cleanup
        createdContactIds.push(contactId);

        // Delete
        const deleteResult = await c.callTool({
            name: 'contacts_delete',
            arguments: { contactId },
        });

        expect(deleteResult.isError).toBeFalsy();

        // Remove from cleanup since already deleted
        const idx = createdContactIds.indexOf(contactId);
        if (idx >= 0) createdContactIds.splice(idx, 1);
    });

    it('lists calendars', async () => {
        const c = await ensureClient();

        const result = await c.callTool({
            name: 'calendars_list',
            arguments: { locationId: LOCATION_ID },
        });

        expect(result.isError).toBeFalsy();
        const textContent = result.content as Array<{ type: string; text: string }>;
        const parsed = JSON.parse(textContent[0]!.text);
        expect(parsed).toBeDefined();
    });

    it('lists conversations', async () => {
        const c = await ensureClient();

        const result = await c.callTool({
            name: 'conversations_search',
            arguments: { locationId: LOCATION_ID },
        });

        expect(result.isError).toBeFalsy();
        const textContent = result.content as Array<{ type: string; text: string }>;
        const parsed = JSON.parse(textContent[0]!.text);
        expect(parsed).toBeDefined();
    });
});
