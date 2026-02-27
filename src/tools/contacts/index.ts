import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Contacts-related MCP tools on the server.
 */
export function registerContactsTools(server: McpServer): void {
    // ── Search Contacts (Advanced) ──────────────────────────────────────
    server.registerTool(
        'contacts_search',
        {
            description: 'Search contacts with advanced filters',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                filters: z
                    .array(z.record(z.string(), z.any()))
                    .optional()
                    .describe('Array of filter objects'),
                page: z.number().optional().describe('Page number'),
                pageLimit: z.number().optional().describe('Results per page'),
            },
            annotations: {
                title: 'Search Contacts',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.searchContactsAdvanced(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error searching contacts: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Contact ─────────────────────────────────────────────────────
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
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting contact: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Contact ──────────────────────────────────────────────────
    server.registerTool(
        'contacts_create',
        {
            description: 'Create a new contact',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                firstName: z.string().optional().describe('First name'),
                lastName: z.string().optional().describe('Last name'),
                email: z.string().optional().describe('Email address'),
                phone: z.string().optional().describe('Phone number'),
                name: z.string().optional().describe('Full name'),
                dateOfBirth: z.string().optional().describe('Date of birth'),
                address1: z.string().optional().describe('Address line 1'),
                city: z.string().optional().describe('City'),
                state: z.string().optional().describe('State'),
                postalCode: z.string().optional().describe('Postal code'),
                website: z.string().optional().describe('Website URL'),
                timezone: z.string().optional().describe('Timezone'),
                dnd: z.boolean().optional().describe('Do Not Disturb flag'),
                tags: z.array(z.string()).optional().describe('Tags to add'),
                customFields: z
                    .array(z.record(z.string(), z.any()))
                    .optional()
                    .describe('Custom field values'),
                source: z.string().optional().describe('Contact source'),
                country: z.string().optional().describe('Country'),
                companyName: z.string().optional().describe('Company name'),
            },
            annotations: {
                title: 'Create Contact',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.createContact(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating contact: ${error.message}` }],
                };
            }
        }
    );

    // ── Update Contact ──────────────────────────────────────────────────
    server.registerTool(
        'contacts_update',
        {
            description: 'Update an existing contact',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                firstName: z.string().optional().describe('First name'),
                lastName: z.string().optional().describe('Last name'),
                email: z.string().optional().describe('Email address'),
                phone: z.string().optional().describe('Phone number'),
                name: z.string().optional().describe('Full name'),
                dateOfBirth: z.string().optional().describe('Date of birth'),
                address1: z.string().optional().describe('Address line 1'),
                city: z.string().optional().describe('City'),
                state: z.string().optional().describe('State'),
                postalCode: z.string().optional().describe('Postal code'),
                website: z.string().optional().describe('Website URL'),
                timezone: z.string().optional().describe('Timezone'),
                dnd: z.boolean().optional().describe('Do Not Disturb flag'),
                tags: z.array(z.string()).optional().describe('Tags'),
                customFields: z
                    .array(z.record(z.string(), z.any()))
                    .optional()
                    .describe('Custom field values'),
                source: z.string().optional().describe('Contact source'),
                country: z.string().optional().describe('Country'),
                companyName: z.string().optional().describe('Company name'),
            },
            annotations: {
                title: 'Update Contact',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { contactId, ...rest } = params;
                const result = await getGhlClient().contacts.updateContact(
                    { contactId },
                    stripUndefined(rest)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating contact: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete Contact ──────────────────────────────────────────────────
    server.registerTool(
        'contacts_delete',
        {
            description: 'Delete a contact by ID',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
            },
            annotations: {
                title: 'Delete Contact',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.deleteContact({
                    contactId: params.contactId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting contact: ${error.message}` }],
                };
            }
        }
    );

    // ── Upsert Contact ──────────────────────────────────────────────────
    server.registerTool(
        'contacts_upsert',
        {
            description: 'Upsert a contact (create or update based on matching criteria)',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                firstName: z.string().optional().describe('First name'),
                lastName: z.string().optional().describe('Last name'),
                email: z.string().optional().describe('Email address'),
                phone: z.string().optional().describe('Phone number'),
                name: z.string().optional().describe('Full name'),
                dateOfBirth: z.string().optional().describe('Date of birth'),
                address1: z.string().optional().describe('Address line 1'),
                city: z.string().optional().describe('City'),
                state: z.string().optional().describe('State'),
                postalCode: z.string().optional().describe('Postal code'),
                website: z.string().optional().describe('Website URL'),
                timezone: z.string().optional().describe('Timezone'),
                dnd: z.boolean().optional().describe('Do Not Disturb flag'),
                tags: z.array(z.string()).optional().describe('Tags'),
                customFields: z
                    .array(z.record(z.string(), z.any()))
                    .optional()
                    .describe('Custom field values'),
                source: z.string().optional().describe('Contact source'),
                country: z.string().optional().describe('Country'),
                companyName: z.string().optional().describe('Company name'),
            },
            annotations: {
                title: 'Upsert Contact',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.upsertContact(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error upserting contact: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Duplicate Contact ───────────────────────────────────────────
    server.registerTool(
        'contacts_get_duplicate',
        {
            description: 'Get duplicate contact by email or phone number',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                number: z.string().optional().describe('Phone number to check'),
                email: z.string().optional().describe('Email to check'),
            },
            annotations: {
                title: 'Get Duplicate Contact',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.getDuplicateContact(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting duplicate contact: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Contacts by Business ID ─────────────────────────────────────
    server.registerTool(
        'contacts_get_by_business',
        {
            description: 'Get contacts by business ID',
            inputSchema: {
                businessId: z.string().describe('The business ID'),
                locationId: z.string().describe('The location ID'),
                limit: z.string().optional().describe('Maximum number of results'),
                skip: z.string().optional().describe('Number of results to skip'),
                query: z.string().optional().describe('Search query'),
            },
            annotations: {
                title: 'Get Contacts by Business',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.getContactsByBusinessId(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting contacts by business: ${error.message}` }],
                };
            }
        }
    );

    // ── Add Tags ────────────────────────────────────────────────────────
    server.registerTool(
        'contacts_add_tags',
        {
            description: 'Add tags to a contact',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                tags: z.array(z.string()).describe('Tags to add'),
            },
            annotations: {
                title: 'Add Tags to Contact',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.addTags(
                    { contactId: params.contactId },
                    { tags: params.tags }
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error adding tags: ${error.message}` }],
                };
            }
        }
    );

    // ── Remove Tags ─────────────────────────────────────────────────────
    server.registerTool(
        'contacts_remove_tags',
        {
            description: 'Remove tags from a contact',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                tags: z.array(z.string()).describe('Tags to remove'),
            },
            annotations: {
                title: 'Remove Tags from Contact',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.removeTags(
                    { contactId: params.contactId },
                    { tags: params.tags }
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error removing tags: ${error.message}` }],
                };
            }
        }
    );

    // ── Get All Tasks ───────────────────────────────────────────────────
    server.registerTool(
        'contacts_get_tasks',
        {
            description: 'Get all tasks for a contact',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
            },
            annotations: {
                title: 'Get Contact Tasks',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.getAllTasks({
                    contactId: params.contactId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting tasks: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Task ─────────────────────────────────────────────────────
    server.registerTool(
        'contacts_create_task',
        {
            description: 'Create a task for a contact',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                title: z.string().describe('Task title'),
                body: z.string().optional().describe('Task body/description'),
                dueDate: z.string().describe('Due date (ISO 8601)'),
                completed: z.boolean().describe('Whether the task is completed'),
                assignedTo: z.string().optional().describe('User ID to assign the task to'),
            },
            annotations: {
                title: 'Create Contact Task',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { contactId, ...rest } = params;
                const result = await getGhlClient().contacts.createTask(
                    { contactId },
                    stripUndefined(rest)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating task: ${error.message}` }],
                };
            }
        }
    );

    // ── Get All Notes ───────────────────────────────────────────────────
    server.registerTool(
        'contacts_get_notes',
        {
            description: 'Get all notes for a contact',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
            },
            annotations: {
                title: 'Get Contact Notes',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.getAllNotes({
                    contactId: params.contactId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting notes: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Note ─────────────────────────────────────────────────────
    server.registerTool(
        'contacts_create_note',
        {
            description: 'Create a note for a contact',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                body: z.string().describe('Note body'),
                userId: z.string().optional().describe('User ID of the note author'),
            },
            annotations: {
                title: 'Create Contact Note',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { contactId, ...rest } = params;
                const result = await getGhlClient().contacts.createNote(
                    { contactId },
                    stripUndefined(rest)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating note: ${error.message}` }],
                };
            }
        }
    );

    // ── Add Contact to Campaign ─────────────────────────────────────────
    server.registerTool(
        'contacts_add_to_campaign',
        {
            description: 'Add a contact to a campaign',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                campaignId: z.string().describe('The campaign ID'),
            },
            annotations: {
                title: 'Add Contact to Campaign',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.addContactToCampaign(
                    { contactId: params.contactId, campaignId: params.campaignId },
                    {}
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error adding contact to campaign: ${error.message}` }],
                };
            }
        }
    );

    // ── Remove Contact from Campaign ────────────────────────────────────
    server.registerTool(
        'contacts_remove_from_campaign',
        {
            description: 'Remove a contact from a campaign',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                campaignId: z.string().describe('The campaign ID'),
            },
            annotations: {
                title: 'Remove Contact from Campaign',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.removeContactFromCampaign({
                    contactId: params.contactId,
                    campaignId: params.campaignId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error removing contact from campaign: ${error.message}` }],
                };
            }
        }
    );

    // ── Add Contact to Workflow ──────────────────────────────────────────
    server.registerTool(
        'contacts_add_to_workflow',
        {
            description: 'Add a contact to a workflow',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                workflowId: z.string().describe('The workflow ID'),
                eventStartTime: z.string().optional().describe('Event start time (ISO 8601)'),
            },
            annotations: {
                title: 'Add Contact to Workflow',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.addContactToWorkflow(
                    { contactId: params.contactId, workflowId: params.workflowId },
                    stripUndefined({ eventStartTime: params.eventStartTime })
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error adding contact to workflow: ${error.message}` }],
                };
            }
        }
    );

    // ── Add Followers to Contact ────────────────────────────────────────
    server.registerTool(
        'contacts_add_followers',
        {
            description: 'Add followers to a contact',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                followers: z.array(z.string()).describe('Array of user IDs to add as followers'),
            },
            annotations: {
                title: 'Add Followers to Contact',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.addFollowersContact(
                    { contactId: params.contactId },
                    { followers: params.followers }
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error adding followers: ${error.message}` }],
                };
            }
        }
    );

    // ── Remove Followers from Contact ───────────────────────────────────
    server.registerTool(
        'contacts_remove_followers',
        {
            description: 'Remove followers from a contact',
            inputSchema: {
                contactId: z.string().describe('The contact ID'),
                followers: z.array(z.string()).describe('Array of user IDs to remove as followers'),
            },
            annotations: {
                title: 'Remove Followers from Contact',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().contacts.removeFollowersContact(
                    { contactId: params.contactId },
                    { followers: params.followers }
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error removing followers: ${error.message}` }],
                };
            }
        }
    );
}
