# Token Reduction Strategy for GHL MCP Server

## Problem Statement

The GHL MCP server currently registers **~158 tools across 28 groups**. When an MCP client (Claude Desktop, Cursor, etc.) connects, it calls `tools/list` and receives the complete catalog — every tool name, description, JSON Schema for input parameters, and annotations.

### Token Cost Estimate

A typical tool definition with name, description, parameter schema (3–6 params with descriptions), and annotations occupies **~150–300 tokens** in serialized JSON Schema form. For 158 tools:

| Metric | Low Estimate | High Estimate |
|---|---|---|
| Tokens per tool | 150 | 300 |
| Total tools | 158 | 158 |
| **Initial context cost** | **~23,700 tokens** | **~47,400 tokens** |

This context is injected into every LLM turn, even when the user only needs 1–2 API categories. At $15/M input tokens (Claude Opus), this adds **$0.35–$0.71 per conversation** in wasted context, and degrades tool-selection accuracy as the model must choose from 158 options.

### Current Architecture

```
server.ts
  └─ createServer()
       └─ for (registrar of ALL_REGISTRARS) { registrar(server); }
            └─ Each registrar calls server.registerTool() N times
```

Each `ToolRegistrar` is a function `(server: McpServer) => void` that imperatively registers tools. There is no metadata layer — tool names, descriptions, and counts are embedded inside each registrar function.

---

## Approach Analysis

### 1. Dynamic Tool Discovery (Enable/Disable)

**Concept:** Register all 158 tools at startup, but immediately `disable()` all except 2–3 "meta" tools. When the model calls `ghl_enable_category('contacts')`, enable just those tools and fire `tools/list_changed`.

**SDK Support:**

- `RegisteredTool.enable()` / `disable()` — sets `enabled` flag; the `ListTools` handler filters by `tool.enabled`
- `McpServer.sendToolListChanged()` — sends `notifications/tools/list_changed` to the client
- `listChanged: true` capability is auto-registered by the SDK

**Token Savings:**

- Initial context: **~2–3 meta-tools ≈ 600 tokens** (vs. 23,700–47,400)
- After enabling one category: ~600 + category tools (e.g., contacts = 19 tools ≈ 3,600 additional)
- **85–97% reduction** in initial context

**Pros:**

- Works with the existing MCP protocol — no extensions needed
- All tools are pre-registered; enable/disable is a flag flip (no re-registration)
- `tools/list_changed` is part of the MCP spec; compliant clients will re-fetch
- Preserves full type safety and validation
- Can enable multiple categories simultaneously
- Model learns which categories exist via the meta-tool

**Cons:**

- Client must support `tools/list_changed` notification (Claude Desktop does; some clients may not)
- Adds one extra round-trip per category activation
- If a client ignores `tools/list_changed`, it won't see newly-enabled tools
- 158 tools are still registered in memory (negligible RAM cost)

**Complexity:** Low — Refactor `server.ts` to track `RegisteredTool` handles and add 2 meta-tools.

**Client Compatibility:**

| Client | `tools/list_changed` Support |
|---|---|
| Claude Desktop | ✅ Yes |
| Cursor | ✅ Yes |
| VS Code Copilot | ✅ Yes |
| Continue.dev | ✅ Yes |
| Generic MCP clients | Varies — fallback: all tools enabled |

---

### 2. Tool Group Pagination (MCP Cursor-Based Pagination)

**Concept:** Use the MCP `tools/list` request's optional `cursor` parameter to paginate — return 20 tools per page.

**SDK Support:**

- The MCP spec supports cursor-based pagination for `tools/list`.
- However, the `McpServer` high-level API's `ListTools` handler returns all tools at once with no pagination hook.
- Would require dropping to the low-level `Server` class and implementing a custom `setRequestHandler(ListToolsRequestSchema, ...)`.

**Token Savings:**

- Per-page: 20 tools × 200 tokens = ~4,000 tokens
- But clients typically fetch ALL pages to build the complete tool list, so **net savings ≈ 0**

**Pros:**

- Standard MCP feature
- Reduces per-response payload size

**Cons:**

- **Clients fetch all pages anyway** — no token savings in the LLM context window
- The context window cost comes from the client injecting the complete tool list into the prompt, not from the MCP response size
- Requires low-level SDK usage, losing `McpServer` conveniences
- Does not solve the core problem

**Complexity:** Medium — Must bypass `McpServer` for tool listing.

**Verdict:** ❌ **Not recommended.** Pagination helps transport efficiency, not LLM token costs.

---

### 3. Condensed Tool Descriptions

**Concept:** Shorten descriptions, remove redundant parameter descriptions, and use `title` annotation.

**Example before:**

```json
{
  "name": "contacts_search",
  "description": "Search contacts with advanced filters including custom field values, tags, and date ranges",
  "inputSchema": {
    "properties": {
      "locationId": { "type": "string", "description": "The unique identifier of the location/sub-account" },
      "page": { "type": "number", "description": "The page number for pagination (1-indexed)" }
    }
  }
}
```

**Example after:**

```json
{
  "name": "contacts_search",
  "title": "Search Contacts",
  "description": "Advanced contact search with filters",
  "inputSchema": {
    "properties": {
      "locationId": { "type": "string", "description": "Location ID" },
      "page": { "type": "number" }
    }
  }
}
```

**Token Savings:**

- ~30–50% reduction per tool (from ~200 to ~120 tokens average)
- Total: ~18,960 tokens → ~12,000 tokens
- **~35% reduction**

**Pros:**

- Zero protocol changes
- Works with ALL clients
- Cumulative with other approaches
- No behavioral changes

**Cons:**

- Limited savings alone (still 12k+ tokens for 158 tools)
- Risk of reducing model accuracy if descriptions become too terse
- Manual effort to rewrite 158 tool descriptions
- Parameter descriptions may be needed for non-obvious fields

**Complexity:** Low — Purely editorial changes.

**Verdict:** ✅ **Recommended as a complement**, not as the primary strategy.

---

### 4. Hybrid Code Mode (Without Workers)

**Concept:** Expose 2 tools — `ghl_search_api` and `ghl_execute` — where the model writes JavaScript code that runs against the GHL SDK client in a sandboxed `vm` context.

```typescript
// Model calls:
ghl_execute({
  code: `
    const contacts = await ghl.contacts.searchContactsAdvanced({
      locationId: "loc_123",
      filters: [{ field: "email", operator: "contains", value: "@acme.com" }]
    });
    return contacts;
  `
})
```

**Token Savings:**

- Only 2 tools in context ≈ **~500 tokens** (99% reduction)
- But must include API reference/examples in tool descriptions or system prompt (~2,000–5,000 tokens)
- **Net savings: 80–90%**

**Pros:**

- Massive token reduction
- Model can compose multi-step API calls in a single tool invocation
- Cloudflare has validated this pattern works well

**Cons:**

- **Security risk:** Even with `vm.runInNewContext`, Node.js `vm` is NOT a security boundary (can escape sandbox via prototype chain)
- Requires `isolated-vm` or similar for true isolation (native dependency, platform-specific builds)
- Model must know the GHL SDK API surface (requires documentation in context or `ghl_search_api`)
- Debugging is harder — code errors are opaque
- Loses JSON Schema validation on inputs/outputs
- TypeScript types not available at runtime in `vm`
- Significantly more complex error handling

**Complexity:** High — Sandboxing, SDK injection, error handling, API documentation generation.

**Verdict:** ⚠️ **Interesting but high-risk.** Consider as a Phase 3 experiment. The `vm` module is explicitly documented as not a security mechanism. Using `isolated-vm` adds native build complexity.

---

### 5. Lazy Registration with Tool Manifests

**Concept:** Register tools with only name + short description (no `inputSchema`). When a tool is called, look up the full schema and validate.

**SDK Behavior:**

- The SDK's `CallTool` handler validates input against `tool.inputSchema` before calling the handler
- If `inputSchema` is omitted, the SDK uses `EMPTY_OBJECT_JSON_SCHEMA` (accepts `{}` only)
- The model sees tools without parameter info and must guess parameters — this **will not work**

**Alternative:** Register all tools with full schemas but store them externally and inject lazily:

- Not supported by the SDK — schemas are set at registration time
- Could use `RegisteredTool.update()` to inject schema on first call, but the model needs the schema BEFORE calling

**Token Savings:** Theoretical ~60% if schemas were omitted. But models cannot use tools without knowing parameters.

**Pros:**

- Conceptually elegant

**Cons:**

- **Fundamentally broken** — LLMs need parameter schemas to generate correct tool calls
- SDK doesn't support lazy schema loading
- Would require protocol extensions

**Complexity:** N/A — Not feasible.

**Verdict:** ❌ **Not recommended.** The model needs schemas to call tools correctly.

---

## Recommended Strategy

### Phased approach combining Dynamic Tool Discovery + Condensed Descriptions

#### Phase 1: Dynamic Tool Discovery (Primary — High Impact)

Implement the `ToolCatalog` pattern:

1. All 158 tools are registered at startup but **disabled by default**
2. Two meta-tools are always enabled:
   - `ghl_list_categories` — Returns available categories with tool counts and descriptions
   - `ghl_enable_category` — Enables all tools in a category (or disables to free context)
3. The SDK's `tools/list_changed` notification informs compliant clients
4. Include a **fallback mode** for clients that don't support `tools/list_changed`: an environment variable `GHL_ENABLE_ALL_TOOLS=true` that skips the discovery pattern

**Estimated savings:** 85–97% reduction in initial context tokens.

#### Phase 2: Condensed Descriptions (Complementary — Medium Impact)

After Phase 1, optimize the per-tool token cost:

1. Audit all 158 tool descriptions — cap at ~15 words
2. Remove parameter descriptions where the name is self-documenting (e.g., `locationId`, `page`, `limit`)
3. Use `title` annotation for human-readable names, keep `description` for LLM-facing text
4. Standardize description format: `<verb> <noun> [qualifier]` (e.g., "Search contacts with filters")

**Estimated additional savings:** 30–40% per-tool when enabled.

#### Phase 3 (Future): Hybrid Code Mode Exploration

- Prototype `ghl_execute` with `isolated-vm` for true sandboxing
- Benchmark model accuracy: structured tools vs. code generation
- Consider as an opt-in "power user" mode

---

## Implementation Plan

### Phase 1: Dynamic Tool Discovery

**Files to create/modify:**

| File | Action |
|---|---|
| `src/discovery.ts` | NEW — `ToolCatalog` class + meta-tool definitions |
| `src/server.ts` | MODIFY — Use `ToolCatalog` instead of direct registration |
| `src/tools/types.ts` | MODIFY — Add `CategoryMetadata` type |

**Step-by-step:**

1. **Define category metadata** in each tool registrar (or a central map):

   ```typescript
   interface CategoryMetadata {
     name: string;         // e.g., 'contacts'
     label: string;        // e.g., 'Contacts'
     description: string;  // e.g., 'Create, search, update, and manage contacts'
     toolCount: number;    // Computed at registration time
   }
   ```

2. **Create `ToolCatalog`** class:
   - Accepts `McpServer` + array of `{ category: CategoryMetadata, registrar: ToolRegistrar }`
   - Calls each registrar to register tools on the server
   - Tracks returned `RegisteredTool` handles per category
   - Disables all tools initially
   - Registers the 2 meta-tools (always enabled)

3. **`ghl_list_categories` meta-tool:**
   - Returns JSON array of categories with name, description, tool count, and enabled status
   - Read-only, idempotent

4. **`ghl_enable_category` meta-tool:**
   - Input: `{ category: string, enabled?: boolean }`
   - Enables/disables all tools in the specified category
   - Returns confirmation with list of affected tool names

5. **Fallback mode:**
   - `GHL_ENABLE_ALL_TOOLS=true` env var → skip disable step, register everything as enabled

**Estimated effort:** 2–4 hours

### Phase 2: Condensed Descriptions

1. Create a linting script that measures token count per tool description
2. Establish description guidelines (max 15 words, no redundant param descriptions)
3. Audit and rewrite descriptions across all 28 tool modules
4. Validate with LLM accuracy testing

**Estimated effort:** 4–6 hours (mostly editorial)

### Phase 3: Future Exploration

- Prototype `ghl_execute` + `ghl_search_api` behind a feature flag
- Evaluate `isolated-vm` vs. Deno subhosting vs. QuickJS WASM for sandboxing
- Benchmark: tool-call accuracy, latency, security surface

---

## Summary

| Approach | Token Savings | Feasibility | Complexity | Recommended |
|---|---|---|---|---|
| Dynamic Tool Discovery | 85–97% | ✅ Full SDK support | Low | ✅ **Phase 1** |
| Condensed Descriptions | 30–40% | ✅ No changes needed | Low | ✅ **Phase 2** |
| Tool Pagination | ~0% | ⚠️ Partial | Medium | ❌ |
| Hybrid Code Mode | 80–90% | ⚠️ Security concerns | High | ⚠️ Phase 3 |
| Lazy Manifests | ~60% theoretical | ❌ Models need schemas | N/A | ❌ |

**The recommended combined strategy (Phase 1 + 2) achieves 90–98% token reduction** while maintaining full compatibility with the MCP protocol and existing clients.
