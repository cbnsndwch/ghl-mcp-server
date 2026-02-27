# Architecture

Technical overview of the GHL MCP Server design, patterns, and implementation details.

## Project Structure

```plain
ghl-mcp-server/
├── package.json                # Package metadata, scripts, dependencies
├── tsconfig.json               # TypeScript config (ES2024, NodeNext)
├── tsup.config.ts              # Build config (bundled ESM output)
├── vitest.config.ts            # Test config (Vitest, V8 coverage)
├── pnpm-workspace.yaml         # pnpm workspace config
├── docs/                       # Documentation
│   ├── README.md               # Main docs overview
│   ├── setup.md                # Setup & configuration guide
│   ├── tools.md                # Complete tool reference
│   ├── architecture.md         # This file
│   ├── testing.md              # Testing guide
│   ├── contributing.md         # Contributing guide
│   └── api-coverage.md         # API coverage report
├── src/
│   ├── index.ts                # Entry point — reads token, starts server
│   ├── server.ts               # MCP server creation and tool registration
│   ├── ghl-client.ts           # HighLevel SDK client singleton
│   └── tools/
│       ├── types.ts            # Shared types and utilities
│       ├── contacts/index.ts   # Contact tools (20 tools)
│       ├── calendars/index.ts  # Calendar tools (17 tools)
│       ├── conversations/...   # ... and 26 more tool groups
│       └── ...
└── dist/                       # Build output (ESM bundle)
    └── index.js
```

## Core Components

### Entry Point (`src/index.ts`)

The entry point handles the startup sequence:

1. **Read the token** from `GHL_PRIVATE_TOKEN` environment variable
2. **Initialize the GHL SDK client** via `initGhlClient(token)`
3. **Create the MCP server** via `createServer()`
4. **Connect transport** using `StdioServerTransport` for stdio communication

```typescript
const token = process.env['GHL_PRIVATE_TOKEN'];
initGhlClient(token);
const mcpServer = createServer();
const transport = new StdioServerTransport();
await mcpServer.connect(transport);
```

### GHL Client Singleton (`src/ghl-client.ts`)

The GHL SDK client is managed as a module-level singleton:

```typescript
let _client: HighLevel | null = null;

export function initGhlClient(privateIntegrationToken: string): HighLevel {
    _client = new HighLevel({ privateIntegrationToken });
    return _client;
}

export function getGhlClient(): HighLevel {
    if (!_client) throw new Error('GHL client not initialized.');
    return _client;
}
```

This pattern:

- Ensures the client is initialized exactly once at startup
- Provides a safe accessor that throws if used before initialization
- Allows all tool handlers to share the same authenticated client instance

### Server Setup (`src/server.ts`)

The server module:

1. Imports all 28 tool registrar functions
2. Collects them into the `ALL_REGISTRARS` array
3. Creates an `McpServer` instance with tool capabilities
4. Iterates registrars, each adding their tools to the server

```typescript
const ALL_REGISTRARS: ToolRegistrar[] = [
    registerContactsTools,
    registerCalendarsTools,
    // ... 26 more
];

export function createServer(): McpServer {
    const server = new McpServer(
        { name: 'ghl-mcp-server', version: '0.1.0' },
        { capabilities: { tools: {} } },
    );
    for (const registrar of ALL_REGISTRARS) {
        registrar(server);
    }
    return server;
}
```

## Tool Registration Pattern

Every tool group follows an identical structure. Each file exports a single `register*Tools` function that receives the `McpServer` and calls `server.registerTool()` for each operation.

### `server.registerTool()` Signature

```typescript
server.registerTool(
    'tool_name',              // Unique tool identifier
    {
        description: '...',   // Human-readable description
        inputSchema: { ... }, // Zod schema for parameters
        annotations: { ... }, // Safety/behavior metadata
    },
    async (params) => { ... } // Handler function
);
```

### Anatomy of a Tool Handler

```typescript
server.registerTool(
    'contacts_get',
    {
        description: 'Get a contact by ID',
        inputSchema: {
            contactId: z.string().describe('The contact ID'),
        },
        annotations: {
            title: 'Get Contact',
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    async (params) => {
        try {
            const result = await getGhlClient().contacts.getContact({
                contactId: params.contactId,
            });
            return {
                content: [
                    { type: 'text', text: JSON.stringify(result, null, 2) },
                ],
            };
        } catch (error: any) {
            return {
                isError: true,
                content: [
                    {
                        type: 'text',
                        text: `Error getting contact: ${error.message}`,
                    },
                ],
            };
        }
    },
);
```

### Key Patterns in Tool Handlers

1. **Zod input validation** — The MCP SDK validates inputs against the Zod schema before calling the handler.
2. **`getGhlClient()`** — Every handler retrieves the shared SDK client.
3. **`stripUndefined()`** — Removes `undefined` keys from objects to satisfy `exactOptionalPropertyTypes` in the TypeScript config.
4. **Try/catch** — All handlers wrap SDK calls in try/catch and return `isError: true` with a descriptive message on failure.
5. **JSON response** — Results are always serialized to pretty-printed JSON text.

## Tool Annotations System

MCP tool annotations provide metadata about tool behavior. They help AI assistants make informed decisions about when and how to use tools.

| Annotation        | Type      | Purpose                                                           |
| ----------------- | --------- | ----------------------------------------------------------------- |
| `title`           | `string`  | Human-readable display name for the tool                          |
| `readOnlyHint`    | `boolean` | `true` if the tool only reads data (GET operations)               |
| `destructiveHint` | `boolean` | `true` if the tool deletes or irreversibly modifies data          |
| `idempotentHint`  | `boolean` | `true` if calling multiple times with same params has same effect |
| `openWorldHint`   | `boolean` | `true` if the tool interacts with systems beyond the MCP server   |

### Annotation Patterns by Operation Type

| Operation               | readOnly | destructive | idempotent | openWorld |
| ----------------------- | -------- | ----------- | ---------- | --------- |
| **List / Search / Get** | `true`   | `false`     | `true`     | `true`    |
| **Create**              | `false`  | `false`     | `false`    | `true`    |
| **Update**              | `false`  | `false`     | `true`     | `true`    |
| **Delete**              | `false`  | `true`      | `true`     | `true`    |
| **Upsert**              | `false`  | `false`     | `false`    | `true`    |
| **Send / Void**         | `false`  | varies      | varies     | `true`    |

> **Note:** `openWorldHint` is `true` for all tools since they all call the external GHL API.

## GHL SDK Integration

The server uses the `@cbnsndwch/ghl-sdk` package which provides a typed `HighLevel` class. The SDK organizes API resources as properties on the client:

```typescript
const client = getGhlClient();

client.contacts; // → Contact CRUD, tags, tasks, notes, etc.
client.calendars; // → Calendar CRUD, slots, appointments, etc.
client.conversations; // → Conversation/message management
client.opportunities; // → Deal/pipeline management
client.invoices; // → Invoice CRUD, send, void, payments
client.products; // → Product catalog CRUD
client.blogs; // → Blog, author, category, post management
client.socialMediaPosting; // → Social media post management
client.objects; // → Custom object records
// ... and more
```

Each SDK resource has methods that map directly to GHL v2 API endpoints.

## Type Safety

### Zod Schemas

All tool input parameters are defined as Zod schemas. This provides:

- **Runtime validation** — Invalid inputs are rejected before reaching the handler
- **Type inference** — TypeScript types are automatically derived from schemas
- **Self-documenting** — Each field has a `.describe()` annotation that MCP clients display

### `exactOptionalPropertyTypes`

The project uses TypeScript's `exactOptionalPropertyTypes` compiler option, which means optional properties can't be explicitly set to `undefined`. The `stripUndefined()` utility in `types.ts` handles this:

```typescript
export function stripUndefined<T extends Record<string, any>>(obj: T) {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined),
    );
}
```

This is necessary because Zod optional fields resolve to `T | undefined`, but the SDK expects the keys to be absent entirely.

## Error Handling

All tool handlers follow a consistent error handling pattern:

1. **SDK errors** are caught and returned as `isError: true` responses with a descriptive message.
2. **The server never crashes** on individual tool errors — each error is scoped to its request.
3. **Error messages** include the operation name for context (e.g., "Error getting contact: ...").

```typescript
try {
    const result = await getGhlClient().contacts.getContact({ contactId });
    return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
} catch (error: any) {
    return {
        isError: true,
        content: [
            { type: 'text', text: `Error getting contact: ${error.message}` },
        ],
    };
}
```

## Build Configuration

### TypeScript (`tsconfig.json`)

| Setting                      | Value      | Notes                        |
| ---------------------------- | ---------- | ---------------------------- |
| `target`                     | `es2024`   | Modern JavaScript output     |
| `module`                     | `nodenext` | Node.js ESM modules          |
| `strict`                     | `true`     | All strict checks enabled    |
| `exactOptionalPropertyTypes` | `true`     | Strict optional handling     |
| `verbatimModuleSyntax`       | `true`     | Explicit import/export types |

### tsup (`tsup.config.ts`)

| Setting     | Value              | Notes                                  |
| ----------- | ------------------ | -------------------------------------- |
| `bundle`    | `true`             | All source bundled into one file       |
| `format`    | `['esm']`          | ES module output only                  |
| `dts`       | `true`             | TypeScript declaration files generated |
| `sourcemap` | `true`             | Source maps for debugging              |
| `platform`  | `node`             | Node.js platform target                |
| `entry`     | `['src/index.ts']` | Single entry point                     |

## Data Flow

```plain
1. MCP Client sends tool call request
       │
       ▼
2. StdioServerTransport receives JSON-RPC message
       │
       ▼
3. McpServer routes to registered tool handler
       │
       ▼
4. Zod validates input parameters
       │
       ▼
5. Handler calls getGhlClient().{resource}.{method}(params)
       │
       ▼
6. SDK makes HTTPS request to GHL v2 API
       │
       ▼
7. Response parsed and returned as JSON text content
       │
       ▼
8. StdioServerTransport sends JSON-RPC response back to client
```
