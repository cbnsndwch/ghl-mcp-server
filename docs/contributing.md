# Contributing Guide

## Overview

This guide walks through the process of adding new tools, following project conventions, and submitting quality contributions to the GHL MCP Server.

## How to Add a New Tool Group

### Step 1: Create the Tool File

Create a new directory and `index.ts` under `src/tools/`:

```bash
mkdir src/tools/my-resource
touch src/tools/my-resource/index.ts
```

### Step 2: Implement the Registrar Function

Follow the established pattern:

```typescript
// src/tools/my-resource/index.ts
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all MyResource-related MCP tools on the server.
 */
export function registerMyResourceTools(server: McpServer): void {
    // ── List Resources ──────────────────────────────────────────────────
    server.registerTool(
        'myResource_list',
        {
            description: 'List resources for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                limit: z
                    .number()
                    .optional()
                    .describe('Maximum number of results'),
            },
            annotations: {
                title: 'List Resources',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().myResource.list(
                    stripUndefined(params),
                );
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text' as const,
                            text: `Error listing resources: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );

    // Add more tools following the same pattern...
}
```

### Step 3: Register in `server.ts`

Add your registrar to the server:

```typescript
// src/server.ts

// 1. Add the import
import { registerMyResourceTools } from './tools/my-resource/index.js';

// 2. Add to ALL_REGISTRARS array
const ALL_REGISTRARS: ToolRegistrar[] = [
    // ... existing registrars
    registerMyResourceTools,
];
```

### Step 4: Build and Test

```bash
# Verify it compiles
pnpm build

# Run tests
pnpm test
```

### Step 5: Update Documentation

- Add the new tool group to `docs/tools.md`
- Update the tool count in `docs/README.md`
- Update `docs/api-coverage.md` if covering previously-uncovered endpoints

## Tool Naming Conventions

### Tool Names

Tools are named using the pattern: `{group}_{action}` or `{group}_{subResource}_{action}`

| Pattern                          | Example                    | When to Use                 |
| -------------------------------- | -------------------------- | --------------------------- |
| `{group}_{action}`               | `contacts_search`          | Primary resource operations |
| `{group}_{subResource}_{action}` | `funnels_redirects_create` | Sub-resource operations     |
| `{group}_{action}-{modifier}`    | `objects_get-by-key`       | Specialized variants        |

**Rules:**

- Group names should match the SDK resource property name (e.g., `contacts`, `calendars`)
- Use camelCase for multi-word actions: `getMessages`, `sendMessage`
- Use underscores `_` to separate group from action
- Use hyphens `-` within actions for readability when needed

### Registrar Function Names

Follow the pattern: `register{GroupName}Tools`

```plain
registerContactsTools
registerCalendarsTools
registerSocialMediaTools
registerCustomFieldsTools
```

### File Structure

```plain
src/tools/{group-name}/index.ts    # kebab-case directory, always index.ts
```

## Annotation Guidelines

Set annotations accurately — they affect AI assistant behavior and user safety.

### Decision Matrix

| Question                                                             | If Yes                  | If No                    |
| -------------------------------------------------------------------- | ----------------------- | ------------------------ |
| Does this tool only read data?                                       | `readOnlyHint: true`    | `readOnlyHint: false`    |
| Does this tool permanently delete data or make irreversible changes? | `destructiveHint: true` | `destructiveHint: false` |
| If called twice with same params, is the result the same?            | `idempotentHint: true`  | `idempotentHint: false`  |
| Does this tool interact with external systems?                       | `openWorldHint: true`   | `openWorldHint: false`   |

### Common Patterns

| Operation Type           | readOnly | destructive | idempotent | openWorld |
| ------------------------ | -------- | ----------- | ---------- | --------- |
| **GET / List / Search**  | `true`   | `false`     | `true`     | `true`    |
| **POST / Create**        | `false`  | `false`     | `false`    | `true`    |
| **PUT / Update**         | `false`  | `false`     | `true`     | `true`    |
| **DELETE**               | `false`  | `true`      | `true`     | `true`    |
| **Upsert**               | `false`  | `false`     | `false`    | `true`    |
| **Send (email/invoice)** | `false`  | `false`     | `false`    | `true`    |
| **Void (invoice)**       | `false`  | `true`      | `true`     | `true`    |

### Title Convention

The `title` annotation should be a human-readable action phrase:

- ✅ `"List Contacts"`, `"Create Calendar"`, `"Delete Invoice"`
- ❌ `"contacts_list"`, `"Calendar creation tool"`, `"delete"`

## Input Schema Guidelines

### Required vs Optional

- Mark fields as required (plain `z.string()`) only if the GHL API requires them
- Mark fields as optional (`z.string().optional()`) if the API accepts them but doesn't require them
- Always add `.describe()` to every field — this is shown to AI assistants

### Type Choices

| GHL API Type     | Zod Schema                                                               |
| ---------------- | ------------------------------------------------------------------------ |
| String           | `z.string()`                                                             |
| Number           | `z.number()`                                                             |
| Boolean          | `z.boolean()`                                                            |
| Array of strings | `z.array(z.string())`                                                    |
| Array of objects | `z.array(z.object({ ... }))` or `z.array(z.record(z.string(), z.any()))` |
| Freeform object  | `z.record(z.string(), z.any())`                                          |

### Using `stripUndefined()`

Always wrap params with `stripUndefined()` before passing to the SDK, unless you're passing individual named parameters:

```typescript
// ✅ Good — wrapping the full params object
const result = await getGhlClient().contacts.searchContactsAdvanced(
    stripUndefined(params),
);

// ✅ Good — destructuring and passing individually
const { contactId, ...body } = params;
const result = await getGhlClient().contacts.updateContact(
    { contactId },
    stripUndefined(body),
);

// ❌ Bad — passing raw params with potential undefined values
const result = await getGhlClient().contacts.updateContact(params);
```

## Error Handling

Always follow the try/catch pattern:

```typescript
async (params) => {
    try {
        const result = await getGhlClient().resource.method(params);
        return {
            content: [
                {
                    type: 'text' as const,
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    } catch (error: any) {
        return {
            isError: true,
            content: [
                {
                    type: 'text' as const,
                    text: `Error <doing thing>: ${error.message}`,
                },
            ],
        };
    }
};
```

**Rules:**

- Always return `isError: true` on failure — never throw from a handler
- Include the operation name in the error message for context
- Use `error.message` (not the full error object) to keep responses clean

## PR Checklist

Before submitting a pull request, verify:

### Code Quality

- [ ] `pnpm build` succeeds with no errors
- [ ] `pnpm test` passes all tests
- [ ] `pnpm lint` reports no new warnings/errors
- [ ] No `console.log` statements left in tool handlers (use MCP response content instead)

### Tool Implementation

- [ ] Every tool has a unique name following naming conventions
- [ ] Every tool has a `description` and `title` annotation
- [ ] Every input field has a `.describe()` annotation
- [ ] Annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) are set correctly
- [ ] `stripUndefined()` is used where appropriate
- [ ] Error handling follows the standard try/catch pattern
- [ ] Error messages include the operation name

### Registration

- [ ] Registrar function is exported from `src/tools/{group}/index.ts`
- [ ] Registrar is imported in `src/server.ts`
- [ ] Registrar is added to `ALL_REGISTRARS` array

### Documentation

- [ ] New tools documented in `docs/tools.md`
- [ ] Tool count updated in `docs/README.md`
- [ ] `docs/api-coverage.md` updated if applicable

### Tests

- [ ] Unit tests added for new utility functions
- [ ] Tool registration tests verify tool names and counts
- [ ] Sandbox tests added (optional but encouraged for new groups)

## Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feat/add-voice-ai-tools

# 2. Implement the tool group
#    - Create src/tools/voice-ai/index.ts
#    - Register in src/server.ts

# 3. Build and verify
pnpm build

# 4. Run tests
pnpm test

# 5. Lint
pnpm lint

# 6. Update docs
#    - docs/tools.md
#    - docs/README.md
#    - docs/api-coverage.md

# 7. Commit and push
git add .
git commit -m "feat: add Voice AI tool group (11 tools)"
git push origin feat/add-voice-ai-tools
```
