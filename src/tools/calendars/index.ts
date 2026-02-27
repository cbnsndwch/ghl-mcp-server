import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Calendars-related MCP tools on the server.
 */
export function registerCalendarsTools(server: McpServer): void {
    // ── Get Calendars ───────────────────────────────────────────────────
    server.registerTool(
        'calendars_list',
        {
            description: 'Get all calendars for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                groupId: z.string().optional().describe('Filter by calendar group ID'),
                showDrafted: z.boolean().optional().describe('Include drafted calendars'),
            },
            annotations: {
                title: 'List Calendars',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.getCalendars(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting calendars: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Calendar ─────────────────────────────────────────────────
    server.registerTool(
        'calendars_create',
        {
            description: 'Create a new calendar',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                name: z.string().describe('Calendar name'),
                description: z.string().optional().describe('Calendar description'),
                slug: z.string().optional().describe('Calendar URL slug'),
                widgetSlug: z.string().optional().describe('Widget slug'),
                calendarType: z.string().optional().describe('Calendar type'),
                widgetType: z.string().optional().describe('Widget type'),
                eventTitle: z.string().optional().describe('Default event title'),
                eventColor: z.string().optional().describe('Event color'),
                meetingLocation: z.string().optional().describe('Meeting location'),
                slotDuration: z.number().optional().describe('Slot duration in minutes'),
                slotBuffer: z.number().optional().describe('Buffer between slots in minutes'),
                slotInterval: z.number().optional().describe('Slot interval in minutes'),
                preBuffer: z.number().optional().describe('Pre-buffer time in minutes'),
                appoinmentPerSlot: z.number().optional().describe('Appointments per slot'),
                appoinmentPerDay: z.number().optional().describe('Max appointments per day'),
                openHours: z
                    .array(z.record(z.string(), z.any()))
                    .optional()
                    .describe('Open hours configuration'),
                enableRecurring: z.boolean().optional().describe('Enable recurring appointments'),
                formId: z.string().optional().describe('Form ID'),
                stickyContact: z.boolean().optional().describe('Sticky contact flag'),
                isLivePaymentMode: z.boolean().optional().describe('Live payment mode'),
                autoConfirm: z.boolean().optional().describe('Auto-confirm appointments'),
                consentLabel: z.string().optional().describe('Consent label text'),
                calendarCoverImage: z.string().optional().describe('Cover image URL'),
                notifications: z
                    .array(z.object({
                        type: z.string().optional(),
                        shouldSendToContact: z.boolean(),
                        shouldSendToGuest: z.boolean(),
                        shouldSendToUser: z.boolean(),
                        shouldSendToSelectedUsers: z.boolean(),
                        selectedUsers: z.string(),
                    }))
                    .optional()
                    .describe('Notification settings'),
                groupId: z.string().optional().describe('Calendar group ID'),
                teamMembers: z
                    .array(z.object({
                        userId: z.string(),
                        priority: z.number().optional(),
                        meetingLocationType: z.string().optional(),
                        meetingLocation: z.string().optional(),
                        isPrimary: z.boolean().optional(),
                    }))
                    .optional()
                    .describe('Team members configuration'),
            },
            annotations: {
                title: 'Create Calendar',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.createCalendar(
                    stripUndefined(params) as any
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating calendar: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Calendar ────────────────────────────────────────────────────
    server.registerTool(
        'calendars_get',
        {
            description: 'Get a calendar by ID',
            inputSchema: {
                calendarId: z.string().describe('The calendar ID'),
            },
            annotations: {
                title: 'Get Calendar',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.getCalendar({
                    calendarId: params.calendarId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting calendar: ${error.message}` }],
                };
            }
        }
    );

    // ── Update Calendar ─────────────────────────────────────────────────
    server.registerTool(
        'calendars_update',
        {
            description: 'Update an existing calendar',
            inputSchema: {
                calendarId: z.string().describe('The calendar ID'),
                name: z.string().optional().describe('Calendar name'),
                description: z.string().optional().describe('Calendar description'),
                slug: z.string().optional().describe('Calendar URL slug'),
                widgetSlug: z.string().optional().describe('Widget slug'),
                calendarType: z.string().optional().describe('Calendar type'),
                widgetType: z.string().optional().describe('Widget type'),
                eventTitle: z.string().optional().describe('Default event title'),
                eventColor: z.string().optional().describe('Event color'),
                meetingLocation: z.string().optional().describe('Meeting location'),
                slotDuration: z.number().optional().describe('Slot duration in minutes'),
                slotBuffer: z.number().optional().describe('Buffer between slots in minutes'),
                slotInterval: z.number().optional().describe('Slot interval in minutes'),
                preBuffer: z.number().optional().describe('Pre-buffer time in minutes'),
                appoinmentPerSlot: z.number().optional().describe('Appointments per slot'),
                appoinmentPerDay: z.number().optional().describe('Max appointments per day'),
                openHours: z
                    .array(z.record(z.string(), z.any()))
                    .optional()
                    .describe('Open hours configuration'),
                enableRecurring: z.boolean().optional().describe('Enable recurring appointments'),
                formId: z.string().optional().describe('Form ID'),
                stickyContact: z.boolean().optional().describe('Sticky contact flag'),
                isLivePaymentMode: z.boolean().optional().describe('Live payment mode'),
                autoConfirm: z.boolean().optional().describe('Auto-confirm appointments'),
                consentLabel: z.string().optional().describe('Consent label text'),
                calendarCoverImage: z.string().optional().describe('Cover image URL'),
                notifications: z
                    .array(z.object({
                        type: z.string().optional(),
                        shouldSendToContact: z.boolean(),
                        shouldSendToGuest: z.boolean(),
                        shouldSendToUser: z.boolean(),
                        shouldSendToSelectedUsers: z.boolean(),
                        selectedUsers: z.string(),
                    }))
                    .optional()
                    .describe('Notification settings'),
                groupId: z.string().optional().describe('Calendar group ID'),
                teamMembers: z
                    .array(z.object({
                        userId: z.string(),
                        priority: z.number().optional(),
                        meetingLocationType: z.string().optional(),
                        meetingLocation: z.string().optional(),
                        isPrimary: z.boolean().optional(),
                    }))
                    .optional()
                    .describe('Team members configuration'),
            },
            annotations: {
                title: 'Update Calendar',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { calendarId, ...rest } = params;
                const result = await getGhlClient().calendars.updateCalendar(
                    { calendarId },
                    stripUndefined(rest) as any
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating calendar: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete Calendar ─────────────────────────────────────────────────
    server.registerTool(
        'calendars_delete',
        {
            description: 'Delete a calendar by ID',
            inputSchema: {
                calendarId: z.string().describe('The calendar ID'),
            },
            annotations: {
                title: 'Delete Calendar',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.deleteCalendar({
                    calendarId: params.calendarId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting calendar: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Free Slots ──────────────────────────────────────────────────
    server.registerTool(
        'calendars_get_slots',
        {
            description: 'Get free/available slots for a calendar',
            inputSchema: {
                calendarId: z.string().describe('The calendar ID'),
                startDate: z.number().describe('Start date as Unix timestamp (ms)'),
                endDate: z.number().describe('End date as Unix timestamp (ms)'),
                timezone: z.string().optional().describe('Timezone (e.g. America/New_York)'),
                userId: z.string().optional().describe('Filter by user ID'),
            },
            annotations: {
                title: 'Get Calendar Slots',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.getSlots(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting slots: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Calendar Groups ─────────────────────────────────────────────
    server.registerTool(
        'calendars_get_groups',
        {
            description: 'Get all calendar groups for a location',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
            },
            annotations: {
                title: 'Get Calendar Groups',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.getGroups({
                    locationId: params.locationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting calendar groups: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Calendar Group ───────────────────────────────────────────
    server.registerTool(
        'calendars_create_group',
        {
            description: 'Create a new calendar group',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                name: z.string().describe('Group name'),
                description: z.string().optional().describe('Group description'),
                slug: z.string().describe('Group URL slug'),
            },
            annotations: {
                title: 'Create Calendar Group',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.createCalendarGroup(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating calendar group: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete Calendar Group ───────────────────────────────────────────
    server.registerTool(
        'calendars_delete_group',
        {
            description: 'Delete a calendar group by ID',
            inputSchema: {
                groupId: z.string().describe('The group ID'),
            },
            annotations: {
                title: 'Delete Calendar Group',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.deleteGroup({
                    groupId: params.groupId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting calendar group: ${error.message}` }],
                };
            }
        }
    );

    // ── Edit Calendar Group ─────────────────────────────────────────────
    server.registerTool(
        'calendars_edit_group',
        {
            description: 'Edit an existing calendar group',
            inputSchema: {
                groupId: z.string().describe('The group ID'),
                name: z.string().optional().describe('Group name'),
                description: z.string().optional().describe('Group description'),
                slug: z.string().optional().describe('Group URL slug'),
            },
            annotations: {
                title: 'Edit Calendar Group',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { groupId, ...rest } = params;
                const result = await getGhlClient().calendars.editGroup(
                    { groupId },
                    stripUndefined(rest)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error editing calendar group: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Appointment ──────────────────────────────────────────────
    server.registerTool(
        'calendars_create_appointment',
        {
            description: 'Create a new appointment',
            inputSchema: {
                calendarId: z.string().describe('The calendar ID'),
                locationId: z.string().describe('The location ID'),
                contactId: z.string().describe('The contact ID'),
                startTime: z.string().describe('Start time (ISO 8601)'),
                endTime: z.string().describe('End time (ISO 8601)'),
                title: z.string().optional().describe('Appointment title'),
                appointmentStatus: z.string().optional().describe('Appointment status'),
                assignedUserId: z.string().optional().describe('Assigned user ID'),
                address: z.string().optional().describe('Appointment address'),
                ignoreDateRange: z.boolean().optional().describe('Ignore date range validation'),
                toNotify: z.boolean().optional().describe('Send notifications'),
                notes: z.string().optional().describe('Appointment notes'),
            },
            annotations: {
                title: 'Create Appointment',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.createAppointment(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating appointment: ${error.message}` }],
                };
            }
        }
    );

    // ── Edit Appointment ────────────────────────────────────────────────
    server.registerTool(
        'calendars_edit_appointment',
        {
            description: 'Edit an existing appointment',
            inputSchema: {
                eventId: z.string().describe('The event/appointment ID'),
                calendarId: z.string().optional().describe('The calendar ID'),
                startTime: z.string().optional().describe('Start time (ISO 8601)'),
                endTime: z.string().optional().describe('End time (ISO 8601)'),
                title: z.string().optional().describe('Appointment title'),
                appointmentStatus: z.string().optional().describe('Appointment status'),
                assignedUserId: z.string().optional().describe('Assigned user ID'),
                address: z.string().optional().describe('Appointment address'),
                ignoreDateRange: z.boolean().optional().describe('Ignore date range validation'),
                toNotify: z.boolean().optional().describe('Send notifications'),
                notes: z.string().optional().describe('Appointment notes'),
            },
            annotations: {
                title: 'Edit Appointment',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { eventId, ...rest } = params;
                const result = await getGhlClient().calendars.editAppointment(
                    { eventId },
                    stripUndefined(rest)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error editing appointment: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Appointment ─────────────────────────────────────────────────
    server.registerTool(
        'calendars_get_appointment',
        {
            description: 'Get an appointment by event ID',
            inputSchema: {
                eventId: z.string().describe('The event/appointment ID'),
            },
            annotations: {
                title: 'Get Appointment',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.getAppointment({
                    eventId: params.eventId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting appointment: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Calendar Events ─────────────────────────────────────────────
    server.registerTool(
        'calendars_get_events',
        {
            description: 'Get calendar events within a time range',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                startTime: z.string().describe('Start time (ISO 8601)'),
                endTime: z.string().describe('End time (ISO 8601)'),
                calendarId: z.string().optional().describe('Filter by calendar ID'),
                userId: z.string().optional().describe('Filter by user ID'),
                groupId: z.string().optional().describe('Filter by group ID'),
            },
            annotations: {
                title: 'Get Calendar Events',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.getCalendarEvents(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting calendar events: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete Event ────────────────────────────────────────────────────
    server.registerTool(
        'calendars_delete_event',
        {
            description: 'Delete a calendar event',
            inputSchema: {
                eventId: z.string().describe('The event ID to delete'),
            },
            annotations: {
                title: 'Delete Calendar Event',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.deleteEvent(
                    { eventId: params.eventId },
                    {}
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting event: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Block Slot ───────────────────────────────────────────────
    server.registerTool(
        'calendars_create_block_slot',
        {
            description: 'Create a block slot on a calendar',
            inputSchema: {
                calendarId: z.string().describe('The calendar ID'),
                locationId: z.string().describe('The location ID'),
                startTime: z.string().describe('Start time (ISO 8601)'),
                endTime: z.string().describe('End time (ISO 8601)'),
                title: z.string().optional().describe('Block slot title'),
                assignedUserId: z.string().optional().describe('Assigned user ID'),
            },
            annotations: {
                title: 'Create Block Slot',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().calendars.createBlockSlot(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating block slot: ${error.message}` }],
                };
            }
        }
    );
}
