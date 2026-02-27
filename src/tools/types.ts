import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * A function that registers MCP tools on the server instance.
 */
export type ToolRegistrar = (server: McpServer) => void;

/**
 * Remove keys whose values are `undefined` from an object.
 *
 * Zod optional fields resolve to `T | undefined` at the type level, which
 * conflicts with `exactOptionalPropertyTypes`. This helper strips those
 * keys at runtime and casts the result so it satisfies SDK parameter types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stripUndefined<T extends Record<string, any>>(
    obj: T
): { [K in keyof T]: Exclude<T[K], undefined> } {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
    ) as any;
}
