# Testing Guide

## Test Framework

The GHL MCP Server uses [Vitest](https://vitest.dev/) (v4) as its test framework, configured in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // describe, it, expect available globally
        environment: 'node', // Node.js test environment
        coverage: {
            provider: 'v8', // V8 native code coverage
            reporter: ['text', 'json', 'html']
        }
    }
});
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (during development)
pnpm vitest

# Run tests with coverage report
pnpm vitest run --coverage

# Run a specific test file
pnpm vitest run src/tools/contacts/contacts.test.ts

# Run tests matching a pattern
pnpm vitest run -t "contacts"
```

## Test Categories

### Unit Tests

Unit tests validate individual functions and utilities in isolation.

**What to test:**

- `stripUndefined()` utility function
- Input validation edge cases
- Error message formatting

**File naming:** `*.test.ts` alongside the source file

**Example:**

```typescript
// src/tools/types.test.ts
import { describe, it, expect } from 'vitest';
import { stripUndefined } from './types.js';

describe('stripUndefined', () => {
    it('removes undefined values', () => {
        const input = { a: 1, b: undefined, c: 'hello' };
        expect(stripUndefined(input)).toEqual({ a: 1, c: 'hello' });
    });

    it('returns empty object for all-undefined input', () => {
        expect(stripUndefined({ a: undefined })).toEqual({});
    });

    it('passes through objects with no undefined values', () => {
        const input = { a: 1, b: 'test' };
        expect(stripUndefined(input)).toEqual(input);
    });
});
```

### Tool Tests

Tool tests verify that tool registrars correctly register tools on a mock `McpServer`.

**What to test:**

- Tools are registered with correct names
- Input schemas have expected fields
- Annotations are set correctly

**Example:**

```typescript
// src/tools/contacts/contacts.test.ts
import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerContactsTools } from './index.js';

describe('registerContactsTools', () => {
    it('registers all expected contact tools', () => {
        const server = new McpServer(
            { name: 'test', version: '0.0.1' },
            { capabilities: { tools: {} } }
        );
        const spy = vi.spyOn(server, 'registerTool');

        registerContactsTools(server);

        const registeredNames = spy.mock.calls.map(call => call[0]);
        expect(registeredNames).toContain('contacts_search');
        expect(registeredNames).toContain('contacts_get');
        expect(registeredNames).toContain('contacts_create');
        expect(registeredNames).toContain('contacts_update');
        expect(registeredNames).toContain('contacts_delete');
        expect(registeredNames).toHaveLength(20);
    });
});
```

### End-to-End (E2E) Tests

E2E tests validate the full server lifecycle: creating a server, connecting a transport, invoking tools, and receiving responses.

**What to test:**

- Server starts and lists tools correctly
- Tool invocation returns expected response structure
- Error responses are formatted correctly

**Example:**

```typescript
// src/server.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createServer } from './server.js';

describe('createServer', () => {
    it('creates a server with all tool groups', () => {
        const server = createServer();
        // Server should be an McpServer instance
        expect(server).toBeDefined();
    });
});
```

### Sandbox Tests (Live API)

Sandbox tests execute against a real GHL agency for integration validation. These are **not run in CI** — they require a live token and are intended for manual verification.

**Setup:**

1. Create a dedicated **test location** in your GHL agency
2. Generate a Private Integration token with appropriate scopes
3. Set the environment variable:

```bash
export GHL_PRIVATE_TOKEN="pit-your-sandbox-token"
export GHL_TEST_LOCATION_ID="your-test-location-id"
```

**Running sandbox tests:**

```bash
# Run only sandbox tests (by convention, use .sandbox.test.ts suffix)
pnpm vitest run --testPathPattern="sandbox"
```

**Example:**

```typescript
// src/tools/contacts/contacts.sandbox.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { initGhlClient, getGhlClient } from '../../ghl-client.js';

describe('Contacts Sandbox', () => {
    beforeAll(() => {
        const token = process.env['GHL_PRIVATE_TOKEN'];
        if (!token)
            throw new Error('GHL_PRIVATE_TOKEN required for sandbox tests');
        initGhlClient(token);
    });

    it('can search contacts', async () => {
        const locationId = process.env['GHL_TEST_LOCATION_ID']!;
        const result = await getGhlClient().contacts.searchContactsAdvanced({
            locationId,
            page: 1,
            pageLimit: 5
        });
        expect(result).toBeDefined();
    });
});
```

> **Caution:** Sandbox tests interact with real data. Use a dedicated test location to avoid affecting production data. Mark create/update/delete tests with descriptive prefixes so test data can be easily identified and cleaned up.

## Writing New Tests

### File Placement

Place test files alongside the source they test:

```plain
src/
  tools/
    contacts/
      index.ts                    # Source
      contacts.test.ts            # Unit/tool tests
      contacts.sandbox.test.ts    # Sandbox tests (optional)
  ghl-client.ts
  ghl-client.test.ts
```

### Test Naming Conventions

- Use descriptive `describe` blocks matching the module name
- Use `it('should ...')` or `it('verb + expected behavior')` for test names
- Group related tests with nested `describe` blocks

### Mocking the GHL Client

For unit tests that don't need real API calls, mock the GHL client:

```typescript
import { vi } from 'vitest';

vi.mock('../../ghl-client.js', () => ({
    getGhlClient: () => ({
        contacts: {
            getContact: vi.fn().mockResolvedValue({
                contact: { id: 'test-id', firstName: 'John' }
            })
        }
    })
}));
```

## Coverage

Generate a coverage report:

```bash
pnpm vitest run --coverage
```

This produces:

- **Terminal output** — summary table
- **`coverage/`** directory — HTML report (open `coverage/index.html`)
- **JSON report** — machine-readable for CI integration
