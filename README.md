# GHL MCP Server Documentation

> **(Unofficial) MCP Server for the HighLevel (GHL) v2 API**

## Overview

The GHL MCP Server exposes the [HighLevel (GoHighLevel)](https://affiliates.gohighlevel.com/?fp_ref=cbnsndwch) v2 API as a set of [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) tools. This allows AI assistants — such as Claude, GitHub Copilot, Cursor, and Cline — to interact with your GHL agency and sub-accounts programmatically through natural language.

### Key Features

- **147 tools** across **28 tool groups** covering the full breadth of the GHL v2 API
- **Private Integration tokens** for authentication — no OAuth flow required
- **Type-safe** parameters validated with Zod schemas
- **MCP tool annotations** for safety metadata (`readOnlyHint`, `destructiveHint`, `idempotentHint`)
- Built on the official [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk) and the [`@cbnsndwch/ghl-sdk`](https://www.npmjs.com/package/@cbnsndwch/ghl-sdk) client

## How It Works

```plain
┌──────────────┐     stdio      ┌──────────────────┐    HTTPS    ┌────────────────┐
│  MCP Client  │ ◄────────────► │  GHL MCP Server  │ ──────────► │  GHL v2 API    │
│ (Claude, etc)│                │  (this project)  │             │  (HighLevel)   │
└──────────────┘                └──────────────────┘             └────────────────┘
```

1. **Your MCP client** (Claude Desktop, Cursor, VS Code Copilot, Cline) connects to the server over **stdio**.
2. The server registers **147 tools** representing GHL API operations.
3. When the AI assistant decides to use a tool, the server validates the input with Zod and forwards the request to the **GHL v2 API** via the SDK.
4. Results are returned as JSON text content back to the assistant.

Authentication is handled through a **Private Integration token** — a long-lived API key created in your GHL agency settings. This avoids the complexity of OAuth flows while providing full API access.

## Tool Groups at a Glance

| Group             | Tools | Description                                                                 |
| ----------------- | ----: | --------------------------------------------------------------------------- |
| **Contacts**      |    20 | Full CRM: search, CRUD, tags, tasks, notes, campaigns, workflows, followers |
| **Calendars**     |    17 | Calendars, groups, appointments, events, slots, block slots                 |
| **Conversations** |    12 | Conversations, messages, attachments, recordings                            |
| **Social Media**  |    12 | Post management, accounts, Google Business, categories, tags                |
| **Locations**     |    11 | Location CRUD, tags, custom fields, custom values, templates                |
| **Invoices**      |     8 | Invoice CRUD, send, void, record payments                                   |
| **Blogs**         |     7 | Blogs, authors, categories, posts, URL slug checks                          |
| **Opportunities** |     7 | Pipeline deals: search, CRUD, upsert, pipelines                             |
| **Payments**      |     7 | Orders, transactions, subscriptions, integrations                           |
| **Funnels**       |     6 | Funnels, pages, redirects                                                   |
| **Objects**       |     6 | Custom objects: schema, record CRUD, search                                 |
| **Businesses**    |     5 | Business CRUD                                                               |
| **Custom Fields** |     5 | Custom field CRUD by object key                                             |
| **Custom Menus**  |     5 | Custom menu link CRUD                                                       |
| **Products**      |     5 | Product catalog CRUD                                                        |
| **Users**         |     5 | User management CRUD                                                        |
| **Links**         |     4 | Link/trigger link CRUD                                                      |
| **SaaS API**      |     4 | SaaS locations, subscriptions, rebilling                                    |
| **Forms**         |     2 | Form listings and submissions                                               |
| **Medias**        |     2 | Media library: list and delete                                              |
| **Snapshots**     |     2 | Snapshot listings and push status                                           |
| **Surveys**       |     2 | Survey listings and submissions                                             |
| **Campaigns**     |     1 | Campaign listings                                                           |
| **Companies**     |     1 | Get company by ID                                                           |
| **Courses**       |     1 | Course import                                                               |
| **Emails**        |     1 | Email template listings                                                     |
| **Workflows**     |     1 | Workflow listings                                                           |
| **Associations**  |     1 | Get association by ID                                                       |

## Documentation

| Document                               | Description                                           |
| -------------------------------------- | ----------------------------------------------------- |
| [Setup Guide](setup.md)                | Installation, configuration, and MCP client setup     |
| [Tool Reference](tools.md)             | Complete reference for all 147 tools across 28 groups |
| [Architecture](architecture.md)        | Project structure, patterns, and technical details    |
| [Testing Guide](testing.md)            | Running tests, writing new tests, sandbox testing     |
| [Contributing Guide](contributing.md)  | How to add tools, naming conventions, PR checklist    |
| [API Coverage Report](api-coverage.md) | Coverage matrix, gaps, and prioritized next steps     |

## Quick Start

```bash
# Install dependencies
pnpm install

# Set your Private Integration token
export GHL_PRIVATE_TOKEN="pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Build and run
pnpm build
node dist/index.js
```

Or configure your MCP client directly — see the [Setup Guide](setup.md) for detailed instructions.

## License

MIT
