import { describe, it, expect, beforeEach, vi } from 'vitest';

// We need to mock the HighLevel class from the SDK
vi.mock('@cbnsndwch/ghl-sdk', () => {
    class HighLevel {
        _config: unknown;
        contacts = {};
        calendars = {};
        constructor(config: unknown) {
            this._config = config;
        }
    }
    return { HighLevel };
});

// Must re-import after mock setup. The module is stateful (singleton), so we
// need to reset the module registry between tests.
async function freshImport() {
    const mod = await import('../ghl-client.js');
    return mod;
}

describe('ghl-client', () => {
    beforeEach(() => {
        // Reset the module cache so each test starts with _client = null
        vi.resetModules();
    });

    it('initGhlClient() creates and returns a HighLevel instance', async () => {
        const { initGhlClient } = await freshImport();
        const client = initGhlClient('test-token-123');
        expect(client).toBeDefined();
        expect(typeof client).toBe('object');
    });

    it('getGhlClient() throws if not initialized', async () => {
        const { getGhlClient } = await freshImport();
        expect(() => getGhlClient()).toThrow(
            'GHL client not initialized. Call initGhlClient() first.'
        );
    });

    it('getGhlClient() returns the initialized client', async () => {
        const { initGhlClient, getGhlClient } = await freshImport();
        const created = initGhlClient('test-token');
        const retrieved = getGhlClient();
        expect(retrieved).toBe(created);
    });

    it('re-initialization replaces the client', async () => {
        const { initGhlClient, getGhlClient } = await freshImport();
        const first = initGhlClient('token-a');
        const second = initGhlClient('token-b');
        expect(second).not.toBe(first);
        expect(getGhlClient()).toBe(second);
    });
});
