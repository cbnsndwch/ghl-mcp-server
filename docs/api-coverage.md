# GHL MCP Server — API Coverage Report

> **Generated:** 2026-02-26
> **SDK Version:** `@cbnsndwch/ghl-sdk-core@0.5.1`
> **MCP Server Tool Groups:** 28

---

## 1. Current MCP Tool Inventory

### Contacts (20 tools)

| Tool Name                       | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `contacts_search`               | Search contacts with advanced filters                          |
| `contacts_get`                  | Get a contact by ID                                            |
| `contacts_create`               | Create a new contact                                           |
| `contacts_update`               | Update an existing contact                                     |
| `contacts_delete`               | Delete a contact by ID                                         |
| `contacts_upsert`               | Upsert a contact (create or update based on matching criteria) |
| `contacts_get_duplicate`        | Get duplicate contact by email or phone number                 |
| `contacts_get_by_business`      | Get contacts by business ID                                    |
| `contacts_add_tags`             | Add tags to a contact                                          |
| `contacts_remove_tags`          | Remove tags from a contact                                     |
| `contacts_get_tasks`            | Get all tasks for a contact                                    |
| `contacts_create_task`          | Create a task for a contact                                    |
| `contacts_get_notes`            | Get all notes for a contact                                    |
| `contacts_create_note`          | Create a note for a contact                                    |
| `contacts_add_to_campaign`      | Add a contact to a campaign                                    |
| `contacts_remove_from_campaign` | Remove a contact from a campaign                               |
| `contacts_add_to_workflow`      | Add a contact to a workflow                                    |
| `contacts_add_followers`        | Add followers to a contact                                     |
| `contacts_remove_followers`     | Remove followers from a contact                                |

### Calendars (17 tools)

| Tool Name                      | Description                             |
| ------------------------------ | --------------------------------------- |
| `calendars_list`               | Get all calendars for a location        |
| `calendars_create`             | Create a new calendar                   |
| `calendars_get`                | Get a calendar by ID                    |
| `calendars_update`             | Update an existing calendar             |
| `calendars_delete`             | Delete a calendar by ID                 |
| `calendars_get_slots`          | Get free/available slots for a calendar |
| `calendars_get_groups`         | Get all calendar groups for a location  |
| `calendars_create_group`       | Create a new calendar group             |
| `calendars_delete_group`       | Delete a calendar group by ID           |
| `calendars_edit_group`         | Edit an existing calendar group         |
| `calendars_create_appointment` | Create a new appointment                |
| `calendars_edit_appointment`   | Edit an existing appointment            |
| `calendars_get_appointment`    | Get an appointment by event ID          |
| `calendars_get_events`         | Get calendar events within a time range |
| `calendars_delete_event`       | Delete a calendar event                 |
| `calendars_create_block_slot`  | Create a block slot on a calendar       |

### Conversations (12 tools)

| Tool Name                              | Description                                   |
| -------------------------------------- | --------------------------------------------- |
| `conversations_search`                 | Search conversations                          |
| `conversations_get`                    | Get a conversation by ID                      |
| `conversations_create`                 | Create a new conversation                     |
| `conversations_update`                 | Update a conversation                         |
| `conversations_delete`                 | Delete a conversation                         |
| `conversations_getMessages`            | Get messages for a conversation               |
| `conversations_sendMessage`            | Send a new message                            |
| `conversations_addInboundMessage`      | Add an inbound message to a conversation      |
| `conversations_cancelScheduledMessage` | Cancel a scheduled message                    |
| `conversations_updateMessageStatus`    | Update the status of a message                |
| `conversations_getMessageRecording`    | Get the recording for a message by message ID |
| `conversations_uploadFileAttachments`  | Upload a file attachment to a conversation    |

### Opportunities (7 tools)

| Tool Name                    | Description                              |
| ---------------------------- | ---------------------------------------- |
| `opportunities_search`       | Search opportunities                     |
| `opportunities_get`          | Get an opportunity by ID                 |
| `opportunities_create`       | Create a new opportunity                 |
| `opportunities_update`       | Update an existing opportunity           |
| `opportunities_delete`       | Delete an opportunity                    |
| `opportunities_upsert`       | Upsert an opportunity (create or update) |
| `opportunities_getPipelines` | Get all pipelines for a location         |

### Workflows (1 tool)

| Tool Name        | Description                  |
| ---------------- | ---------------------------- |
| `workflows_list` | Get workflows for a location |

### Users (5 tools)

| Tool Name      | Description             |
| -------------- | ----------------------- |
| `users_get`    | Get a user by ID        |
| `users_search` | Search users            |
| `users_update` | Update an existing user |
| `users_delete` | Delete a user           |
| `users_create` | Create a new user       |

### Locations (11 tools)

| Tool Name                     | Description                            |
| ----------------------------- | -------------------------------------- |
| `locations_get`               | Get a location by ID                   |
| `locations_update`            | Update an existing location            |
| `locations_search`            | Search locations                       |
| `locations_create`            | Create a new location                  |
| `locations_delete`            | Delete a location by ID                |
| `locations_getTags`           | Get tags for a location                |
| `locations_createTag`         | Create a tag for a location            |
| `locations_getCustomFields`   | Get custom fields for a location       |
| `locations_getCustomValues`   | Get custom values for a location       |
| `locations_createCustomValue` | Create a custom value for a location   |
| `locations_getTemplates`      | Get email/SMS templates for a location |

### Businesses (5 tools)

| Tool Name           | Description                   |
| ------------------- | ----------------------------- |
| `businesses_list`   | Get businesses for a location |
| `businesses_create` | Create a new business         |
| `businesses_get`    | Get a business by ID          |
| `businesses_update` | Update an existing business   |
| `businesses_delete` | Delete a business by ID       |

### Campaigns (1 tool)

| Tool Name        | Description                  |
| ---------------- | ---------------------------- |
| `campaigns_list` | Get campaigns for a location |

### Forms (2 tools)

| Tool Name                | Description                         |
| ------------------------ | ----------------------------------- |
| `forms_list`             | Get forms for a location            |
| `forms_submissions_list` | Get form submissions for a location |

### Surveys (2 tools)

| Tool Name                  | Description                           |
| -------------------------- | ------------------------------------- |
| `surveys_list`             | Get surveys for a location            |
| `surveys_submissions_list` | Get survey submissions for a location |

### Funnels (6 tools)

| Tool Name                  | Description                   |
| -------------------------- | ----------------------------- |
| `funnels_list`             | List funnels for a location   |
| `funnels_pages_list`       | List pages for a funnel       |
| `funnels_redirects_list`   | List redirects for a location |
| `funnels_redirects_create` | Create a new redirect         |
| `funnels_redirects_update` | Update an existing redirect   |
| `funnels_redirects_delete` | Delete a redirect             |

### Links (4 tools)

| Tool Name      | Description              |
| -------------- | ------------------------ |
| `links_list`   | Get links for a location |
| `links_create` | Create a new link        |
| `links_update` | Update an existing link  |
| `links_delete` | Delete a link            |

### Medias (2 tools)

| Tool Name       | Description                                    |
| --------------- | ---------------------------------------------- |
| `medias_list`   | Get files and folders from the media library   |
| `medias_delete` | Delete a file or folder from the media library |

### Products (5 tools)

| Tool Name         | Description                  |
| ----------------- | ---------------------------- |
| `products_list`   | List products for a location |
| `products_get`    | Get a product by ID          |
| `products_create` | Create a new product         |
| `products_update` | Update an existing product   |
| `products_delete` | Delete a product             |

### Payments (7 tools)

| Tool Name                    | Description                        |
| ---------------------------- | ---------------------------------- |
| `payments_listOrders`        | List payment orders                |
| `payments_getOrder`          | Get a payment order by ID          |
| `payments_listTransactions`  | List payment transactions          |
| `payments_getTransaction`    | Get a payment transaction by ID    |
| `payments_listSubscriptions` | List payment subscriptions         |
| `payments_getSubscription`   | Get a payment subscription by ID   |
| `payments_listIntegrations`  | List payment integration providers |

### Invoices (8 tools)

| Tool Name                | Description                            |
| ------------------------ | -------------------------------------- |
| `invoices_list`          | List invoices                          |
| `invoices_get`           | Get an invoice by ID                   |
| `invoices_create`        | Create a new invoice                   |
| `invoices_update`        | Update an existing invoice             |
| `invoices_delete`        | Delete an invoice                      |
| `invoices_send`          | Send an invoice                        |
| `invoices_void`          | Void an invoice                        |
| `invoices_recordPayment` | Record a manual payment for an invoice |

### Emails (1 tool)

| Tool Name     | Description                        |
| ------------- | ---------------------------------- |
| `emails_list` | Get email templates for a location |

### Companies (1 tool)

| Tool Name       | Description         |
| --------------- | ------------------- |
| `companies_get` | Get a company by ID |

### Custom Fields (5 tools)

| Tool Name             | Description                                    |
| --------------------- | ---------------------------------------------- |
| `customFields_list`   | Get custom fields by object key for a location |
| `customFields_create` | Create a new custom field                      |
| `customFields_get`    | Get a custom field or folder by ID             |
| `customFields_update` | Update an existing custom field                |
| `customFields_delete` | Delete a custom field by ID                    |

### Custom Menus (5 tools)

| Tool Name            | Description                     |
| -------------------- | ------------------------------- |
| `customMenus_list`   | Get custom menus for a location |
| `customMenus_create` | Create a new custom menu link   |
| `customMenus_get`    | Get a custom menu by ID         |
| `customMenus_update` | Update an existing custom menu  |
| `customMenus_delete` | Delete a custom menu by ID      |

### Courses (1 tool)

| Tool Name        | Description                            |
| ---------------- | -------------------------------------- |
| `courses_import` | Import courses through public channels |

### Blogs (7 tools)

| Tool Name              | Description                             |
| ---------------------- | --------------------------------------- |
| `blogs_list`           | Get all blogs for a location            |
| `blogs_listAuthors`    | Get blog authors for a location         |
| `blogs_listCategories` | Get blog categories for a location      |
| `blogs_listPosts`      | Get blog posts by blog ID               |
| `blogs_createPost`     | Create a new blog post                  |
| `blogs_updatePost`     | Update an existing blog post            |
| `blogs_checkUrlSlug`   | Check if a blog URL slug already exists |

### Social Media (12 tools)

| Tool Name                           | Description                            |
| ----------------------------------- | -------------------------------------- |
| `social-media_get-google-locations` | Get Google Business locations          |
| `social-media_set-google-locations` | Set Google Business location           |
| `social-media_get-accounts`         | Get social media accounts              |
| `social-media_search-posts`         | Search social media posts              |
| `social-media_create-post`          | Create a social media post             |
| `social-media_get-post`             | Get a social media post by ID          |
| `social-media_edit-post`            | Edit a social media post               |
| `social-media_delete-post`          | Delete a social media post             |
| `social-media_get-csv`              | Get CSV report for a social media post |
| `social-media_get-categories`       | Get social media post categories       |
| `social-media_get-tags`             | Get social media tags                  |
| `social-media_get-tags-by-ids`      | Get social media tags by IDs           |

### Snapshots (2 tools)

| Tool Name                   | Description                             |
| --------------------------- | --------------------------------------- |
| `snapshots_list`            | Get snapshots for a company             |
| `snapshots_get-push-status` | Get the last push status for a snapshot |

### Associations (1 tool)

| Tool Name          | Description              |
| ------------------ | ------------------------ |
| `associations_get` | Get an association by ID |

### Objects (6 tools)

| Tool Name                | Description                       |
| ------------------------ | --------------------------------- |
| `objects_get-by-key`     | Get an object schema by key or ID |
| `objects_search-records` | Search records for an object      |
| `objects_get-record`     | Get a single object record by ID  |
| `objects_create-record`  | Create a new object record        |
| `objects_update-record`  | Update an existing object record  |
| `objects_delete-record`  | Delete an object record           |

### SaaS API (4 tools)

| Tool Name                            | Description                                                |
| ------------------------------------ | ---------------------------------------------------------- |
| `saas-api_get-locations`             | Get SaaS-activated locations for a company with pagination |
| `saas-api_get-location-subscription` | Get subscription details for a SaaS location               |
| `saas-api_enable-saas`               | Enable SaaS for a sub-account location                     |
| `saas-api_update-rebilling`          | Update rebilling configuration                             |

### Summary

| Metric              | Count |
| ------------------- | ----- |
| **Tool Groups**     | 28    |
| **Total MCP Tools** | 147   |

---

## 2. GHL v2 API Endpoints NOT Currently Covered

The following API areas are documented in the GHL v2 API but have **no corresponding MCP tools** in our server. These are identified by cross-referencing the SDK resource classes (which are auto-generated from the GHL OpenAPI spec) against our tool registrations.

### 2.1 Completely Missing Resource Groups (No MCP tools at all)

| API Area                              | SDK Class     | Description                                          | SDK Methods Available                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | ------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Email ISV**                         | `EmailIsv`    | Email verification service                           | `verifyEmail`                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Marketplace**                       | `Marketplace` | Wallet charges, app management, installer details    | `charge`, `getCharges`, `deleteCharge`, `getSpecificCharge`, `hasFunds`, `uninstallApplication`, `getInstallerDetails`                                                                                                                                                                                                                                                                                                |
| **OAuth**                             | `Oauth`       | Token management, authorization flows                | `getAuthorizationUrl`, `refreshToken`, `getAccessToken`, `getLocationAccessToken`, `getInstalledLocation`                                                                                                                                                                                                                                                                                                             |
| **Phone System**                      | `PhoneSystem` | Phone number management, number pools                | `getNumberPoolList`, `activeNumbers`                                                                                                                                                                                                                                                                                                                                                                                  |
| **Proposals / Documents & Contracts** | `Proposals`   | Documents, contracts, and templates                  | `listDocumentsContracts`, `sendDocumentsContracts`, `listDocumentsContractsTemplates`, `sendDocumentsContractsTemplate`                                                                                                                                                                                                                                                                                               |
| **Store**                             | `Store`       | E-commerce shipping zones, rates, carriers, settings | `createShippingZone`, `listShippingZones`, `getShippingZones`, `updateShippingZone`, `deleteShippingZone`, `getAvailableShippingZones`, `createShippingRate`, `listShippingRates`, `getShippingRates`, `updateShippingRate`, `deleteShippingRate`, `createShippingCarrier`, `listShippingCarriers`, `getShippingCarriers`, `updateShippingCarrier`, `deleteShippingCarrier`, `createStoreSetting`, `getStoreSettings` |
| **Voice AI**                          | `VoiceAi`     | Voice AI agent management, call logs, actions        | `createAgent`, `getAgents`, `patchAgent`, `getAgent`, `deleteAgent`, `getCallLogs`, `getCallLog`, `createAction`, `updateAction`, `getAction`, `deleteAction`                                                                                                                                                                                                                                                         |

### 2.2 Partially Covered Resource Groups (Some endpoints missing)

| API Area         | What We Have                                                                | What's Missing                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contacts**     | 20 tools covering CRUD, tags, tasks, notes, campaigns, workflows, followers | Missing: `updateTask`, `deleteTask`, `getTask`, `updateNote`, `deleteNote`, `removeContactFromWorkflow`, `getContactAppointments` (if SDK supports) |
| **Calendars**    | 17 tools                                                                    | Missing: `updateBlockSlot`, `deleteBlockSlot`, `getBlockSlots` (if SDK supports)                                                                    |
| **Workflows**    | 1 tool (list only)                                                          | Missing: No additional SDK methods currently — but the API may support workflow execution triggers                                                  |
| **Campaigns**    | 1 tool (list only)                                                          | Missing: No additional SDK methods currently                                                                                                        |
| **Emails**       | 1 tool (list templates only)                                                | Missing: No additional email send/verify endpoints exposed yet                                                                                      |
| **Companies**    | 1 tool (get only)                                                           | Missing: No update company endpoint exposed yet                                                                                                     |
| **Courses**      | 1 tool (import only)                                                        | Missing: Course listing, getting individual courses, managing enrollments                                                                           |
| **Associations** | 1 tool (get only)                                                           | Missing: Create, update, delete, list associations                                                                                                  |
| **Medias**       | 2 tools (list + delete)                                                     | Missing: Upload media file endpoint                                                                                                                 |
| **Products**     | 5 tools (CRUD)                                                              | Missing: Product prices/variants management                                                                                                         |
| **Payments**     | 7 tools (read-only)                                                         | Missing: Create/manage custom orders, refunds                                                                                                       |
| **Snapshots**    | 2 tools (list + push status)                                                | Missing: Create snapshot, push snapshot to location                                                                                                 |

---

## 3. SDK Resources: Full Inventory vs MCP Coverage

### 3.1 SDK Resource Coverage Matrix

| SDK Resource         | SDK Property         | MCP Tool Group   | Coverage Status                     |
| -------------------- | -------------------- | ---------------- | ----------------------------------- |
| `Associations`       | `associations`       | `associations/`  | ⚠️ Partial (1 of ~4 methods)        |
| `Blogs`              | `blogs`              | `blogs/`         | ✅ Good (7 tools)                   |
| `Businesses`         | `businesses`         | `businesses/`    | ✅ Full CRUD                        |
| `Calendars`          | `calendars`          | `calendars/`     | ✅ Good (17 tools)                  |
| `Campaigns`          | `campaigns`          | `campaigns/`     | ⚠️ Partial (list only)              |
| `Companies`          | `companies`          | `companies/`     | ⚠️ Partial (get only)               |
| `Contacts`           | `contacts`           | `contacts/`      | ✅ Good (20 tools)                  |
| `Conversations`      | `conversations`      | `conversations/` | ✅ Good (12 tools)                  |
| `Courses`            | `courses`            | `courses/`       | ⚠️ Partial (import only)            |
| `CustomFields`       | `customFields`       | `custom-fields/` | ✅ Full CRUD                        |
| `CustomMenus`        | `customMenus`        | `custom-menus/`  | ✅ Full CRUD                        |
| `EmailIsv`           | `emailIsv`           | —                | ❌ Not covered                      |
| `Emails`             | `emails`             | `emails/`        | ⚠️ Partial (templates only)         |
| `Forms`              | `forms`              | `forms/`         | ✅ Good (list + submissions)        |
| `Funnels`            | `funnels`            | `funnels/`       | ✅ Good (6 tools)                   |
| `Invoices`           | `invoices`           | `invoices/`      | ✅ Full CRUD + send/void/record     |
| `Links`              | `links`              | `links/`         | ✅ Full CRUD                        |
| `Locations`          | `locations`          | `locations/`     | ✅ Good (11 tools)                  |
| `Marketplace`        | `marketplace`        | —                | ❌ Not covered                      |
| `Medias`             | `medias`             | `medias/`        | ⚠️ Partial (list + delete)          |
| `Oauth`              | `oauth`              | —                | ❌ Not covered (handled internally) |
| `Objects`            | `objects`            | `objects/`       | ✅ Full CRUD + search               |
| `Opportunities`      | `opportunities`      | `opportunities/` | ✅ Full CRUD + upsert + pipelines   |
| `Payments`           | `payments`           | `payments/`      | ✅ Good (7 tools, read-focused)     |
| `PhoneSystem`        | `phoneSystem`        | —                | ❌ Not covered                      |
| `Products`           | `products`           | `products/`      | ✅ Full CRUD                        |
| `Proposals`          | `proposals`          | —                | ❌ Not covered                      |
| `SaasApi`            | `saasApi`            | `saas-api/`      | ✅ Good (4 tools)                   |
| `Snapshots`          | `snapshots`          | `snapshots/`     | ⚠️ Partial (list + push status)     |
| `SocialMediaPosting` | `socialMediaPosting` | `social-media/`  | ✅ Good (12 tools)                  |
| `Store`              | `store`              | —                | ❌ Not covered                      |
| `Surveys`            | `surveys`            | `surveys/`       | ✅ Good (list + submissions)        |
| `Users`              | `users`              | `users/`         | ✅ Full CRUD                        |
| `VoiceAi`            | `voiceAi`            | —                | ❌ Not covered                      |
| `Workflows`          | `workflows`          | `workflows/`     | ⚠️ Partial (list only)              |

### 3.2 Coverage Summary

| Status                  | Count  | Percentage |
| ----------------------- | ------ | ---------- |
| ✅ Good / Full coverage | 21     | 60%        |
| ⚠️ Partial coverage     | 8      | 23%        |
| ❌ Not covered          | 6      | 17%        |
| **Total SDK Resources** | **35** | —          |

> **Note:** `Oauth` is intentionally not covered as MCP tools since authentication is handled internally by the SDK client. It should remain excluded from MCP tooling.

---

## 4. Prioritized Next Steps

### Priority 1 — High Value, Ready to Implement (SDK already has methods)

These resources exist in the SDK and have significant user value. MCP tool registration can be implemented directly in this repo.

| #   | Action                             | Effort | Impact    | Notes                                                                                            |
| --- | ---------------------------------- | ------ | --------- | ------------------------------------------------------------------------------------------------ |
| 1   | **Add `proposals/` tool group**    | Medium | 🔴 High   | Documents & Contracts — 4 SDK methods ready. Critical for agencies managing proposals/contracts. |
| 2   | **Add `store/` tool group**        | Large  | 🔴 High   | E-commerce shipping management — 17 SDK methods ready. Essential for e-commerce sub-accounts.    |
| 3   | **Add `voice-ai/` tool group**     | Large  | 🔴 High   | Voice AI agents — 11 SDK methods ready. Rapidly growing feature in GHL.                          |
| 4   | **Add `phone-system/` tool group** | Small  | 🟡 Medium | Phone number management — 2 SDK methods. Quick win.                                              |
| 5   | **Add `marketplace/` tool group**  | Medium | 🟡 Medium | Wallet charges & app management — 7 SDK methods. Useful for agency-level integrations.           |
| 6   | **Add `email-isv/` tool group**    | Small  | 🟢 Low    | Email verification — 1 SDK method. Quick win but niche.                                          |

### Priority 2 — Expand Partial Coverage (SDK methods available, just need MCP wrappers)

| #   | Action                           | Effort | Impact    | Notes                                                            |
| --- | -------------------------------- | ------ | --------- | ---------------------------------------------------------------- |
| 7   | **Expand `contacts/` tools**     | Small  | 🟡 Medium | Add update/delete task, update/delete note, remove from workflow |
| 8   | **Expand `associations/` tools** | Small  | 🟡 Medium | Add create, update, delete, list associations                    |
| 9   | **Expand `medias/` tools**       | Small  | 🟡 Medium | Add upload media file                                            |
| 10  | **Expand `snapshots/` tools**    | Small  | 🟢 Low    | Add push snapshot to location                                    |
| 11  | **Expand `courses/` tools**      | Small  | 🟢 Low    | Review SDK for list/get course methods                           |
| 12  | **Expand `companies/` tools**    | Small  | 🟢 Low    | Review SDK for update company                                    |

### Priority 3 — SDK Gaps (Need new SDK methods before MCP tools can be added)

These are API endpoints that exist in the GHL v2 API documentation but may not yet be fully implemented in `@cbnsndwch/ghl-sdk-core`. Work should go back to the SDK repo first.

| #   | API Area                                 | What's Needed in SDK                        | Notes                         |
| --- | ---------------------------------------- | ------------------------------------------- | ----------------------------- |
| 13  | **Contacts — Bulk Operations**           | Bulk create/update/delete contacts endpoint | High volume use case          |
| 14  | **Opportunities — Followers**            | Add/remove followers from opportunities     | Parity with contacts          |
| 15  | **Payments — Order Fulfillment**         | Create order fulfillment, manage refunds    | Write operations for payments |
| 16  | **Locations — Timezone/Tax**             | Additional location settings endpoints      | Advanced location config      |
| 17  | **Workflows — Trigger Execution**        | Programmatic workflow trigger/execution     | Highly requested feature      |
| 18  | **Calendars — Blocked Slots Management** | Update/delete blocked slots                 | Complete blocked slots CRUD   |
| 19  | **Emails — Send Email**                  | Transactional email sending endpoint        | Beyond template listing       |
| 20  | **Campaigns — Campaign Management**      | Create/update/delete campaigns              | Beyond listing                |
| 21  | **Products — Prices/Variants**           | Price and variant management endpoints      | E-commerce depth              |

### Priority 4 — Known GHL v2 API Areas Not Yet in SDK

Based on the GHL v2 API documentation, these additional API categories may exist but are not yet represented as SDK resource classes:

| API Area                      | Description                            | Action Required                                  |
| ----------------------------- | -------------------------------------- | ------------------------------------------------ |
| **Triggers / Webhooks**       | Webhook registration and management    | Evaluate if SDK should wrap these                |
| **Reporting / Analytics**     | Dashboard stats, conversion reporting  | Check API availability                           |
| **Reviews / Reputation**      | Google/Facebook review management      | New in recent API updates                        |
| **Certificates**              | SSL/domain certificate management      | Agency-level feature                             |
| **TikTok / LinkedIn Posting** | Extended social media platform support | May be covered by existing social-media resource |

---

## 5. Architecture Notes

### Tool Naming Convention

Current tools follow these patterns:

- `{resource}_{action}` — e.g., `contacts_search`, `calendars_create`
- `{resource}_{sub-resource}_{action}` — e.g., `funnels_redirects_create`, `forms_submissions_list`
- `{resource}_{action}-{modifier}` — e.g., `social-media_get-google-locations`, `objects_get-by-key`

**Recommendation:** Standardize on `{resource}_{action}` with underscores only (no hyphens) for consistency. Consider migrating existing hyphenated names in a future breaking change.

### File Organization

Each tool group has its own directory under `src/tools/` with an `index.ts` that exports a `register{Group}Tools(server: McpServer)` function. New tool groups should follow this pattern.

### Adding a New Tool Group

1. Create `src/tools/{resource}/index.ts`
2. Export `register{Resource}Tools(server: McpServer): void`
3. Register in `src/server.ts`
4. Build and test

---

## Appendix: Tool Count by Group

| Group         | Tools   |
| ------------- | ------- |
| Contacts      | 20      |
| Calendars     | 17      |
| Conversations | 12      |
| Social Media  | 12      |
| Locations     | 11      |
| Invoices      | 8       |
| Blogs         | 7       |
| Opportunities | 7       |
| Payments      | 7       |
| Funnels       | 6       |
| Objects       | 6       |
| Businesses    | 5       |
| Custom Fields | 5       |
| Custom Menus  | 5       |
| Products      | 5       |
| Users         | 5       |
| Links         | 4       |
| SaaS API      | 4       |
| Forms         | 2       |
| Medias        | 2       |
| Snapshots     | 2       |
| Surveys       | 2       |
| Campaigns     | 1       |
| Companies     | 1       |
| Courses       | 1       |
| Emails        | 1       |
| Workflows     | 1       |
| Associations  | 1       |
| **TOTAL**     | **147** |
