import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ToolRegistrar } from './tools/types.js';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

/**
 * Metadata describing a tool category for the discovery system.
 */
export interface CategoryMetadata {
    /** Unique identifier, e.g. 'contacts' */
    name: string;
    /** Human-readable label, e.g. 'Contacts' */
    label: string;
    /** Short description for the LLM */
    description: string;
}

/**
 * A category definition with its registrar function.
 */
export interface CategoryEntry {
    meta: CategoryMetadata;
    registrar: ToolRegistrar;
}

/**
 * Runtime state for an enabled/disabled category.
 */
interface CategoryState {
    meta: CategoryMetadata;
    toolHandles: RegisteredTool[];
    toolNames: string[];
    enabled: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// ToolCatalog
// ────────────────────────────────────────────────────────────────────────────

/**
 * Manages dynamic tool discovery for the GHL MCP server.
 *
 * Instead of exposing all ~158 tools at once, the catalog:
 * 1. Registers all tools on the McpServer (so handlers exist)
 * 2. Immediately disables them (hidden from `tools/list`)
 * 3. Registers two always-on meta-tools:
 *    - `ghl_list_categories` — lists available categories with tool counts
 *    - `ghl_enable_category` — enables/disables a category
 * 4. When a category is enabled, the underlying tools become visible and the
 *    server sends `notifications/tools/list_changed` to the client.
 *
 * This reduces the initial context window from ~25,000–45,000 tokens to ~600.
 */
export class ToolCatalog {
    private categories = new Map<string, CategoryState>();
    private server: McpServer;

    constructor(server: McpServer, entries: CategoryEntry[]) {
        this.server = server;

        // Register all tools from every category, capturing handles
        for (const entry of entries) {
            const handles = this.captureRegistrations(entry.registrar);
            const toolNames = this.extractToolNames(handles);

            this.categories.set(entry.meta.name, {
                meta: entry.meta,
                toolHandles: handles,
                toolNames,
                enabled: false,
            });

            // Disable all tools initially (they're registered but hidden)
            for (const handle of handles) {
                handle.disable();
            }
        }

        // Register the always-on meta-tools
        this.registerMetaTools();
    }

    // ── Public API ──────────────────────────────────────────────────────

    /**
     * Enable all tools — bypasses the discovery pattern.
     * Useful for clients that don't support `tools/list_changed`.
     */
    enableAll(): void {
        for (const state of this.categories.values()) {
            for (const handle of state.toolHandles) {
                handle.enable();
            }
            state.enabled = true;
        }
    }

    /**
     * Get a snapshot of all categories and their status.
     */
    getCategoryList(): Array<{
        name: string;
        label: string;
        description: string;
        toolCount: number;
        enabled: boolean;
        tools: string[];
    }> {
        return Array.from(this.categories.values()).map((state) => ({
            name: state.meta.name,
            label: state.meta.label,
            description: state.meta.description,
            toolCount: state.toolHandles.length,
            enabled: state.enabled,
            tools: state.toolNames,
        }));
    }

    /**
     * Enable or disable a specific category.
     * Returns the list of affected tool names.
     */
    setCategory(categoryName: string, enabled: boolean): string[] {
        const state = this.categories.get(categoryName);
        if (!state) {
            throw new Error(
                `Unknown category: "${categoryName}". Use ghl_list_categories to see available categories.`
            );
        }

        for (const handle of state.toolHandles) {
            if (enabled) {
                handle.enable();
            } else {
                handle.disable();
            }
        }

        state.enabled = enabled;

        // The SDK automatically sends tools/list_changed on enable()/disable(),
        // but we send it once more explicitly to ensure delivery after batch updates.
        this.server.sendToolListChanged();

        return state.toolNames;
    }

    // ── Private helpers ─────────────────────────────────────────────────

    /**
     * Captures RegisteredTool handles from a registrar by proxying the
     * McpServer's registerTool method during registration.
     *
     * This avoids modifying the ToolRegistrar signature while still
     * capturing every handle that the registrar creates.
     */
    private captureRegistrations(registrar: ToolRegistrar): RegisteredTool[] {
        const captured: RegisteredTool[] = [];
        const originalRegisterTool = this.server.registerTool.bind(this.server);

        // Temporarily replace registerTool to intercept return values
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.server as any).registerTool = (...args: any[]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handle: RegisteredTool = (originalRegisterTool as any)(...args);
            captured.push(handle);
            return handle;
        };

        try {
            registrar(this.server);
        } finally {
            // Restore the original method
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.server as any).registerTool = originalRegisterTool;
        }

        return captured;
    }

    /**
     * Extracts tool names from handles by reading their internal state.
     *
     * The SDK doesn't expose a `name` property on RegisteredTool, but the
     * tools are keyed by name in the server's internal `_registeredTools` map.
     * We work around this by reading the description or by tracking names
     * during the capture phase.
     *
     * For robustness, we access the server's internal _registeredTools map.
     */
    private extractToolNames(handles: RegisteredTool[]): string[] {
        // Access the internal _registeredTools map to find names for our handles
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toolsMap: Record<string, RegisteredTool> = (this.server as any)._registeredTools;
        const names: string[] = [];

        for (const handle of handles) {
            for (const [name, registered] of Object.entries(toolsMap)) {
                if (registered === handle) {
                    names.push(name);
                    break;
                }
            }
        }

        return names;
    }

    /**
     * Registers the two always-on meta-tools.
     */
    private registerMetaTools(): void {
        // ── ghl_list_categories ─────────────────────────────────────────
        this.server.registerTool(
            'ghl_list_categories',
            {
                title: 'List GHL API Categories',
                description:
                    'Lists all available GHL API tool categories with descriptions and tool counts. ' +
                    'Use this to discover what tools are available before enabling a category.',
                annotations: {
                    readOnlyHint: true,
                    destructiveHint: false,
                    idempotentHint: true,
                    openWorldHint: false,
                },
            },
            async () => {
                const categories = this.getCategoryList();
                const summary = categories.map((c) => ({
                    category: c.name,
                    label: c.label,
                    description: c.description,
                    toolCount: c.toolCount,
                    enabled: c.enabled,
                    tools: c.tools,
                }));

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(summary, null, 2),
                        },
                    ],
                };
            }
        );

        // ── ghl_enable_category ─────────────────────────────────────────
        this.server.registerTool(
            'ghl_enable_category',
            {
                title: 'Enable/Disable GHL Tool Category',
                description:
                    'Enables or disables a GHL API tool category. ' +
                    'Once enabled, the category tools become available for use. ' +
                    'Call ghl_list_categories first to see available categories.',
                inputSchema: {
                    category: z
                        .string()
                        .describe('Category name to enable/disable (e.g. "contacts", "calendars")'),
                    enabled: z
                        .boolean()
                        .default(true)
                        .describe('True to enable, false to disable. Defaults to true.'),
                },
                annotations: {
                    readOnlyHint: false,
                    destructiveHint: false,
                    idempotentHint: true,
                    openWorldHint: false,
                },
            },
            async (params) => {
                try {
                    const affectedTools = this.setCategory(params.category, params.enabled);
                    const action = params.enabled ? 'enabled' : 'disabled';

                    return {
                        content: [
                            {
                                type: 'text' as const,
                                text: JSON.stringify(
                                    {
                                        status: 'ok',
                                        category: params.category,
                                        action,
                                        toolCount: affectedTools.length,
                                        tools: affectedTools,
                                    },
                                    null,
                                    2
                                ),
                            },
                        ],
                    };
                } catch (error: any) {
                    return {
                        isError: true,
                        content: [
                            {
                                type: 'text' as const,
                                text: error.message,
                            },
                        ],
                    };
                }
            }
        );
    }
}
