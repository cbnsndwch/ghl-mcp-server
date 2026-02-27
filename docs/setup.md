# Setup & Configuration Guide

## Prerequisites

| Requirement    | Version | Notes                                      |
| -------------- | ------- | ------------------------------------------ |
| **Node.js**    | 20+     | LTS recommended (`node --version`)         |
| **pnpm**       | 10+     | Package manager (`pnpm --version`)         |
| **GHL Agency** | —       | A HighLevel agency account with API access |

## Installation

```bash
# Clone the repository
git clone https://github.com/cbnsndwch/ghl-mcp-server.git
cd ghl-mcp-server

# Install dependencies
pnpm install

# Build the project
pnpm build
```

## Getting a Private Integration Token

The GHL MCP Server uses **Private Integration tokens** for authentication. These are long-lived API keys scoped to your agency that don't require an OAuth flow.

### Steps to Create a Token

1. Log in to your **HighLevel agency** account.
2. Navigate to **Settings → Integrations → Private Integrations** (or visit `https://app.gohighlevel.com/`).
3. Click **Create Private Integration**.
4. Give it a descriptive name (e.g., "MCP Server").
5. Select the **scopes** you need. For full access, enable all available scopes.
6. Click **Create** and copy the generated token.

> **Important:** The token is only shown once. Store it securely. If lost, you'll need to create a new one.

The token will look something like:

```plain
pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Environment Variables

| Variable            | Required | Description                              |
| ------------------- | -------- | ---------------------------------------- |
| `GHL_PRIVATE_TOKEN` | **Yes**  | Your HighLevel Private Integration token |

The server reads `GHL_PRIVATE_TOKEN` at startup and will exit with an error message if it's missing.

## MCP Client Configuration

### Claude Desktop

Add to your Claude Desktop configuration file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
    "mcpServers": {
        "ghl": {
            "command": "node",
            "args": ["/absolute/path/to/ghl-mcp-server/dist/index.js"],
            "env": {
                "GHL_PRIVATE_TOKEN": "pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
        }
    }
}
```

### Cursor IDE

Add to your Cursor MCP settings (`.cursor/mcp.json` in your project root or global settings):

```json
{
    "mcpServers": {
        "ghl": {
            "command": "node",
            "args": ["/absolute/path/to/ghl-mcp-server/dist/index.js"],
            "env": {
                "GHL_PRIVATE_TOKEN": "pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
        }
    }
}
```

### VS Code Copilot

Add to `.vscode/mcp.json` in your workspace:

```json
{
    "servers": {
        "ghl": {
            "type": "stdio",
            "command": "node",
            "args": ["/absolute/path/to/ghl-mcp-server/dist/index.js"],
            "env": {
                "GHL_PRIVATE_TOKEN": "pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
        }
    }
}
```

### Cline

Add to your Cline MCP settings (`cline_mcp_settings.json`):

```json
{
    "mcpServers": {
        "ghl": {
            "command": "node",
            "args": ["/absolute/path/to/ghl-mcp-server/dist/index.js"],
            "env": {
                "GHL_PRIVATE_TOKEN": "pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
        }
    }
}
```

> **Tip:** Replace `/absolute/path/to/ghl-mcp-server` with the actual path on your system. On Windows, use forward slashes or escaped backslashes: `"C:/Users/you/ghl-mcp-server/dist/index.js"`.

## Development Mode

For local development, you can run the server directly with `tsx` (included as a dev dependency):

```bash
# Set the token
export GHL_PRIVATE_TOKEN="pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Run with tsx (no build step needed)
npx tsx src/index.ts
```

You can also point your MCP client to the source directly for faster iteration:

```json
{
    "mcpServers": {
        "ghl": {
            "command": "npx",
            "args": ["tsx", "/absolute/path/to/ghl-mcp-server/src/index.ts"],
            "env": {
                "GHL_PRIVATE_TOKEN": "pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
        }
    }
}
```

## Building for Production

```bash
# Clean previous build artifacts
pnpm clean

# Build the project (produces dist/index.js)
pnpm build
```

The build uses [tsup](https://tsup.egoist.dev/) to bundle the project into a single ESM module at `dist/index.js`, including:

- Bundled output (all source in one file)
- TypeScript declarations (`.d.ts`)
- Source maps

## Verification

After configuring your MCP client, verify the server is working by asking your AI assistant to list available tools or perform a simple read operation:

> "List the calendars for location `<your-location-id>`"

If the server is correctly configured, you'll see the API response with your calendar data.

## Troubleshooting

| Symptom                           | Likely Cause                 | Fix                                                       |
| --------------------------------- | ---------------------------- | --------------------------------------------------------- |
| "Missing GHL_PRIVATE_TOKEN" error | Token not set in environment | Add `GHL_PRIVATE_TOKEN` to your MCP client's `env` config |
| Server won't start                | Node.js version too old      | Upgrade to Node.js 20+                                    |
| "Cannot find module" errors       | Not built yet                | Run `pnpm build` first                                    |
| API returns 401                   | Token expired or invalid     | Generate a new Private Integration token                  |
| API returns 403                   | Insufficient scopes          | Check token scopes in GHL settings                        |
| No tools appear in client         | MCP config path wrong        | Verify the `args` path points to `dist/index.js`          |
