import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getGhlClient } from '../../ghl-client.js';
import { stripUndefined } from '../types.js';

/**
 * Register all Conversations-related MCP tools on the server.
 */
export function registerConversationsTools(server: McpServer): void {
    // ── Search Conversations ────────────────────────────────────────────
    server.registerTool(
        'conversations_search',
        {
            description: 'Search conversations',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                contactId: z.string().optional().describe('Filter by contact ID'),
                assignedTo: z.string().optional().describe('Filter by assigned user ID'),
                query: z.string().optional().describe('Search query string'),
                sort: z.string().optional().describe('Sort order'),
                limit: z.number().optional().describe('Maximum number of results'),
                status: z.string().optional().describe('Conversation status filter'),
                lastMessageType: z.string().optional().describe('Filter by last message type'),
            },
            annotations: {
                title: 'Search Conversations',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.searchConversation(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error searching conversations: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Conversation ────────────────────────────────────────────────
    server.registerTool(
        'conversations_get',
        {
            description: 'Get a conversation by ID',
            inputSchema: {
                conversationId: z.string().describe('The conversation ID'),
            },
            annotations: {
                title: 'Get Conversation',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.getConversation({
                    conversationId: params.conversationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting conversation: ${error.message}` }],
                };
            }
        }
    );

    // ── Create Conversation ─────────────────────────────────────────────
    server.registerTool(
        'conversations_create',
        {
            description: 'Create a new conversation',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                contactId: z.string().describe('The contact ID'),
            },
            annotations: {
                title: 'Create Conversation',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.createConversation(
                    params
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error creating conversation: ${error.message}` }],
                };
            }
        }
    );

    // ── Update Conversation ─────────────────────────────────────────────
    server.registerTool(
        'conversations_update',
        {
            description: 'Update a conversation',
            inputSchema: {
                conversationId: z.string().describe('The conversation ID'),
                locationId: z.string().optional().describe('The location ID'),
                assignedTo: z.string().optional().describe('Assigned user ID'),
                starred: z.boolean().optional().describe('Whether the conversation is starred'),
                unreadCount: z.number().optional().describe('Unread message count'),
            },
            annotations: {
                title: 'Update Conversation',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { conversationId, ...body } = params;
                const result = await getGhlClient().conversations.updateConversation(
                    { conversationId },
                    stripUndefined(body)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating conversation: ${error.message}` }],
                };
            }
        }
    );

    // ── Delete Conversation ─────────────────────────────────────────────
    server.registerTool(
        'conversations_delete',
        {
            description: 'Delete a conversation',
            inputSchema: {
                conversationId: z.string().describe('The conversation ID'),
            },
            annotations: {
                title: 'Delete Conversation',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.deleteConversation({
                    conversationId: params.conversationId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error deleting conversation: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Messages ────────────────────────────────────────────────────
    server.registerTool(
        'conversations_getMessages',
        {
            description: 'Get messages for a conversation',
            inputSchema: {
                conversationId: z.string().describe('The conversation ID'),
                lastMessageId: z.string().optional().describe('ID of the last message for pagination'),
                limit: z.number().optional().describe('Maximum number of messages to return'),
                type: z.string().optional().describe('Filter by message type'),
            },
            annotations: {
                title: 'Get Messages',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.getMessages(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting messages: ${error.message}` }],
                };
            }
        }
    );

    // ── Send Message ────────────────────────────────────────────────────
    server.registerTool(
        'conversations_sendMessage',
        {
            description: 'Send a new message',
            inputSchema: {
                type: z.string().describe('Message type (e.g. SMS, Email, WhatsApp)'),
                contactId: z.string().describe('The contact ID'),
                message: z.string().optional().describe('Message body text'),
                subject: z.string().optional().describe('Email subject'),
                html: z.string().optional().describe('HTML content for email'),
                conversationId: z.string().optional().describe('Existing conversation ID'),
                conversationProviderId: z.string().optional().describe('Conversation provider ID'),
                emailFrom: z.string().optional().describe('Email from address'),
            },
            annotations: {
                title: 'Send Message',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.sendANewMessage(
                    stripUndefined(params)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error sending message: ${error.message}` }],
                };
            }
        }
    );

    // ── Add Inbound Message ─────────────────────────────────────────────
    server.registerTool(
        'conversations_addInboundMessage',
        {
            description: 'Add an inbound message to a conversation',
            inputSchema: {
                type: z.string().describe('Message type'),
                conversationId: z.string().describe('The conversation ID'),
                conversationProviderId: z.string().describe('Conversation provider ID'),
                message: z.string().describe('Message body text'),
            },
            annotations: {
                title: 'Add Inbound Message',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.addAnInboundMessage(
                    params
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error adding inbound message: ${error.message}` }],
                };
            }
        }
    );

    // ── Cancel Scheduled Message ────────────────────────────────────────
    server.registerTool(
        'conversations_cancelScheduledMessage',
        {
            description: 'Cancel a scheduled message',
            inputSchema: {
                messageId: z.string().describe('The message ID to cancel'),
            },
            annotations: {
                title: 'Cancel Scheduled Message',
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.cancelScheduledMessage({
                    messageId: params.messageId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error cancelling scheduled message: ${error.message}` }],
                };
            }
        }
    );

    // ── Update Message Status ───────────────────────────────────────────
    server.registerTool(
        'conversations_updateMessageStatus',
        {
            description: 'Update the status of a message',
            inputSchema: {
                messageId: z.string().describe('The message ID'),
                status: z.string().describe('New message status'),
                error: z.string().optional().describe('Error message if applicable'),
            },
            annotations: {
                title: 'Update Message Status',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const { messageId, ...body } = params;
                const result = await getGhlClient().conversations.updateMessageStatus(
                    { messageId },
                    stripUndefined(body)
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error updating message status: ${error.message}` }],
                };
            }
        }
    );

    // ── Get Message Recording ───────────────────────────────────────────
    server.registerTool(
        'conversations_getMessageRecording',
        {
            description: 'Get the recording for a message by message ID',
            inputSchema: {
                locationId: z.string().describe('The location ID'),
                messageId: z.string().describe('The message ID'),
            },
            annotations: {
                title: 'Get Message Recording',
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.getMessageRecording({
                    locationId: params.locationId,
                    messageId: params.messageId,
                });
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error getting message recording: ${error.message}` }],
                };
            }
        }
    );

    // ── Upload File Attachments ─────────────────────────────────────────
    server.registerTool(
        'conversations_uploadFileAttachments',
        {
            description: 'Upload a file attachment to a conversation',
            inputSchema: {
                conversationId: z.string().describe('The conversation ID'),
                locationId: z.string().describe('The location ID'),
                attachmentUrl: z.string().describe('URL of the attachment to upload'),
            },
            annotations: {
                title: 'Upload File Attachments',
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async (params) => {
            try {
                const result = await getGhlClient().conversations.uploadFileAttachments(
                    params
                );
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [{ type: 'text' as const, text: `Error uploading file attachment: ${error.message}` }],
                };
            }
        }
    );
}
