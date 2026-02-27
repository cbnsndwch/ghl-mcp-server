import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { ToolRegistrar } from './tools/types.js';

// Import all tool registrars
import { registerContactsTools } from './tools/contacts/index.js';
import { registerCalendarsTools } from './tools/calendars/index.js';
import { registerConversationsTools } from './tools/conversations/index.js';
import { registerOpportunitiesTools } from './tools/opportunities/index.js';
import { registerWorkflowsTools } from './tools/workflows/index.js';
import { registerUsersTools } from './tools/users/index.js';
import { registerLocationsTools } from './tools/locations/index.js';
import { registerBusinessesTools } from './tools/businesses/index.js';
import { registerCampaignsTools } from './tools/campaigns/index.js';
import { registerFormsTools } from './tools/forms/index.js';
import { registerSurveysTools } from './tools/surveys/index.js';
import { registerFunnelsTools } from './tools/funnels/index.js';
import { registerLinksTools } from './tools/links/index.js';
import { registerMediasTools } from './tools/medias/index.js';
import { registerProductsTools } from './tools/products/index.js';
import { registerPaymentsTools } from './tools/payments/index.js';
import { registerInvoicesTools } from './tools/invoices/index.js';
import { registerEmailsTools } from './tools/emails/index.js';
import { registerCompaniesTools } from './tools/companies/index.js';
import { registerCustomFieldsTools } from './tools/custom-fields/index.js';
import { registerCustomMenusTools } from './tools/custom-menus/index.js';
import { registerCoursesTools } from './tools/courses/index.js';
import { registerBlogsTools } from './tools/blogs/index.js';
import { registerSocialMediaTools } from './tools/social-media/index.js';
import { registerSnapshotsTools } from './tools/snapshots/index.js';
import { registerAssociationsTools } from './tools/associations/index.js';
import { registerObjectsTools } from './tools/objects/index.js';
import { registerSaasApiTools } from './tools/saas-api/index.js';

/**
 * All tool registrars grouped by API resource area.
 */
const ALL_REGISTRARS: ToolRegistrar[] = [
    registerContactsTools,
    registerCalendarsTools,
    registerConversationsTools,
    registerOpportunitiesTools,
    registerWorkflowsTools,
    registerUsersTools,
    registerLocationsTools,
    registerBusinessesTools,
    registerCampaignsTools,
    registerFormsTools,
    registerSurveysTools,
    registerFunnelsTools,
    registerLinksTools,
    registerMediasTools,
    registerProductsTools,
    registerPaymentsTools,
    registerInvoicesTools,
    registerEmailsTools,
    registerCompaniesTools,
    registerCustomFieldsTools,
    registerCustomMenusTools,
    registerCoursesTools,
    registerBlogsTools,
    registerSocialMediaTools,
    registerSnapshotsTools,
    registerAssociationsTools,
    registerObjectsTools,
    registerSaasApiTools,
];

/**
 * Create and configure the MCP server with all HighLevel API tools.
 */
export function createServer(): McpServer {
    const server = new McpServer(
        {
            name: 'ghl-mcp-server',
            version: '0.1.0',
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    // Register all tool groups
    for (const registrar of ALL_REGISTRARS) {
        registrar(server);
    }

    return server;
}
