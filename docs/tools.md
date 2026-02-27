# Tool Reference

Complete reference for all **147 tools** across **28 tool groups** in the GHL MCP Server.

## Annotation Legend

Each tool has safety annotations that MCP clients can use to make decisions:

| Annotation       | Meaning                                                          |
| ---------------- | ---------------------------------------------------------------- |
| 🔒 `readOnly`    | Tool only reads data, never modifies                             |
| 💥 `destructive` | Tool permanently deletes or irreversibly modifies data           |
| 🔄 `idempotent`  | Calling the tool multiple times with same params has same effect |
| 🌐 `openWorld`   | Tool interacts with external systems beyond the MCP server       |

---

## CRM

### Contacts (20 tools)

| Tool                            | Title                         | Description                                                    | Annotations |
| ------------------------------- | ----------------------------- | -------------------------------------------------------------- | ----------- |
| `contacts_search`               | Search Contacts               | Search contacts with advanced filters                          | 🔒 🔄 🌐    |
| `contacts_get`                  | Get Contact                   | Get a contact by ID                                            | 🔒 🔄 🌐    |
| `contacts_create`               | Create Contact                | Create a new contact                                           | 🌐          |
| `contacts_update`               | Update Contact                | Update an existing contact                                     | 🔄 🌐       |
| `contacts_delete`               | Delete Contact                | Delete a contact by ID                                         | 💥 🔄 🌐    |
| `contacts_upsert`               | Upsert Contact                | Upsert a contact (create or update based on matching criteria) | 🌐          |
| `contacts_get_duplicate`        | Get Duplicate Contact         | Get duplicate contact by email or phone number                 | 🔒 🔄 🌐    |
| `contacts_get_by_business`      | Get Contacts by Business      | Get contacts by business ID                                    | 🔒 🔄 🌐    |
| `contacts_add_tags`             | Add Tags to Contact           | Add tags to a contact                                          | 🌐          |
| `contacts_remove_tags`          | Remove Tags from Contact      | Remove tags from a contact                                     | 💥 🔄 🌐    |
| `contacts_get_tasks`            | Get Contact Tasks             | Get all tasks for a contact                                    | 🔒 🔄 🌐    |
| `contacts_create_task`          | Create Contact Task           | Create a task for a contact                                    | 🌐          |
| `contacts_get_notes`            | Get Contact Notes             | Get all notes for a contact                                    | 🔒 🔄 🌐    |
| `contacts_create_note`          | Create Contact Note           | Create a note for a contact                                    | 🌐          |
| `contacts_add_to_campaign`      | Add Contact to Campaign       | Add a contact to a campaign                                    | 🌐          |
| `contacts_remove_from_campaign` | Remove Contact from Campaign  | Remove a contact from a campaign                               | 💥 🔄 🌐    |
| `contacts_add_to_workflow`      | Add Contact to Workflow       | Add a contact to a workflow                                    | 🌐          |
| `contacts_add_followers`        | Add Followers to Contact      | Add followers to a contact                                     | 🌐          |
| `contacts_remove_followers`     | Remove Followers from Contact | Remove followers from a contact                                | 💥 🔄 🌐    |

<details>
<summary><strong>Parameter Details</strong></summary>

**`contacts_search`**

| Parameter    | Type     | Required | Description             |
| ------------ | -------- | -------- | ----------------------- |
| `locationId` | `string` | Yes      | The location ID         |
| `filters`    | `array`  | No       | Array of filter objects |
| `page`       | `number` | No       | Page number             |
| `pageLimit`  | `number` | No       | Results per page        |

**`contacts_get`**

| Parameter   | Type     | Required | Description    |
| ----------- | -------- | -------- | -------------- |
| `contactId` | `string` | Yes      | The contact ID |

**`contacts_create`**

| Parameter      | Type       | Required | Description         |
| -------------- | ---------- | -------- | ------------------- |
| `locationId`   | `string`   | Yes      | The location ID     |
| `firstName`    | `string`   | No       | First name          |
| `lastName`     | `string`   | No       | Last name           |
| `email`        | `string`   | No       | Email address       |
| `phone`        | `string`   | No       | Phone number        |
| `name`         | `string`   | No       | Full name           |
| `dateOfBirth`  | `string`   | No       | Date of birth       |
| `address1`     | `string`   | No       | Address line 1      |
| `city`         | `string`   | No       | City                |
| `state`        | `string`   | No       | State               |
| `postalCode`   | `string`   | No       | Postal code         |
| `website`      | `string`   | No       | Website URL         |
| `timezone`     | `string`   | No       | Timezone            |
| `dnd`          | `boolean`  | No       | Do Not Disturb flag |
| `tags`         | `string[]` | No       | Tags to add         |
| `customFields` | `array`    | No       | Custom field values |
| `source`       | `string`   | No       | Contact source      |
| `country`      | `string`   | No       | Country             |
| `companyName`  | `string`   | No       | Company name        |

**`contacts_update`** — Same parameters as `contacts_create` plus `contactId` (required).

**`contacts_delete`**

| Parameter   | Type     | Required | Description    |
| ----------- | -------- | -------- | -------------- |
| `contactId` | `string` | Yes      | The contact ID |

**`contacts_upsert`** — Same parameters as `contacts_create`.

**`contacts_get_duplicate`**

| Parameter    | Type     | Required | Description           |
| ------------ | -------- | -------- | --------------------- |
| `locationId` | `string` | Yes      | The location ID       |
| `number`     | `string` | No       | Phone number to check |
| `email`      | `string` | No       | Email to check        |

**`contacts_get_by_business`**

| Parameter    | Type     | Required | Description               |
| ------------ | -------- | -------- | ------------------------- |
| `businessId` | `string` | Yes      | The business ID           |
| `locationId` | `string` | Yes      | The location ID           |
| `limit`      | `string` | No       | Maximum number of results |
| `skip`       | `string` | No       | Number of results to skip |
| `query`      | `string` | No       | Search query              |

**`contacts_add_tags` / `contacts_remove_tags`**

| Parameter   | Type       | Required | Description        |
| ----------- | ---------- | -------- | ------------------ |
| `contactId` | `string`   | Yes      | The contact ID     |
| `tags`      | `string[]` | Yes      | Tags to add/remove |

**`contacts_get_tasks` / `contacts_get_notes`**

| Parameter   | Type     | Required | Description    |
| ----------- | -------- | -------- | -------------- |
| `contactId` | `string` | Yes      | The contact ID |

**`contacts_create_task`**

| Parameter    | Type      | Required | Description                   |
| ------------ | --------- | -------- | ----------------------------- |
| `contactId`  | `string`  | Yes      | The contact ID                |
| `title`      | `string`  | Yes      | Task title                    |
| `body`       | `string`  | No       | Task body/description         |
| `dueDate`    | `string`  | Yes      | Due date (ISO 8601)           |
| `completed`  | `boolean` | Yes      | Whether the task is completed |
| `assignedTo` | `string`  | No       | User ID to assign the task to |

**`contacts_create_note`**

| Parameter   | Type     | Required | Description                |
| ----------- | -------- | -------- | -------------------------- |
| `contactId` | `string` | Yes      | The contact ID             |
| `body`      | `string` | Yes      | Note body                  |
| `userId`    | `string` | No       | User ID of the note author |

**`contacts_add_to_campaign` / `contacts_remove_from_campaign`**

| Parameter    | Type     | Required | Description     |
| ------------ | -------- | -------- | --------------- |
| `contactId`  | `string` | Yes      | The contact ID  |
| `campaignId` | `string` | Yes      | The campaign ID |

**`contacts_add_to_workflow`**

| Parameter        | Type     | Required | Description                 |
| ---------------- | -------- | -------- | --------------------------- |
| `contactId`      | `string` | Yes      | The contact ID              |
| `workflowId`     | `string` | Yes      | The workflow ID             |
| `eventStartTime` | `string` | No       | Event start time (ISO 8601) |

**`contacts_add_followers` / `contacts_remove_followers`**

| Parameter   | Type       | Required | Description       |
| ----------- | ---------- | -------- | ----------------- |
| `contactId` | `string`   | Yes      | The contact ID    |
| `followers` | `string[]` | Yes      | Array of user IDs |

</details>

---

### Companies (1 tool)

| Tool            | Title       | Description         | Annotations |
| --------------- | ----------- | ------------------- | ----------- |
| `companies_get` | Get Company | Get a company by ID | 🔒 🔄 🌐    |

---

### Opportunities (7 tools)

| Tool                         | Title                | Description                              | Annotations |
| ---------------------------- | -------------------- | ---------------------------------------- | ----------- |
| `opportunities_search`       | Search Opportunities | Search opportunities                     | 🔒 🔄 🌐    |
| `opportunities_get`          | Get Opportunity      | Get an opportunity by ID                 | 🔒 🔄 🌐    |
| `opportunities_create`       | Create Opportunity   | Create a new opportunity                 | 🌐          |
| `opportunities_update`       | Update Opportunity   | Update an existing opportunity           | 🔄 🌐       |
| `opportunities_delete`       | Delete Opportunity   | Delete an opportunity                    | 💥 🔄 🌐    |
| `opportunities_upsert`       | Upsert Opportunity   | Upsert an opportunity (create or update) | 🌐          |
| `opportunities_getPipelines` | Get Pipelines        | Get all pipelines for a location         | 🔒 🔄 🌐    |

<details>
<summary><strong>Parameter Details</strong></summary>

**`opportunities_search`**

| Parameter    | Type     | Required | Description                |
| ------------ | -------- | -------- | -------------------------- |
| `locationId` | `string` | Yes      | The location ID            |
| `pipelineId` | `string` | No       | Filter by pipeline ID      |
| `contactId`  | `string` | No       | Filter by contact ID       |
| `stageId`    | `string` | No       | Filter by stage ID         |
| `status`     | `string` | No       | Opportunity status filter  |
| `assignedTo` | `string` | No       | Filter by assigned user ID |
| `query`      | `string` | No       | Search query string        |
| `limit`      | `number` | No       | Maximum number of results  |
| `page`       | `number` | No       | Page number for pagination |

**`opportunities_create`**

| Parameter       | Type     | Required | Description        |
| --------------- | -------- | -------- | ------------------ |
| `locationId`    | `string` | Yes      | The location ID    |
| `pipelineId`    | `string` | Yes      | The pipeline ID    |
| `name`          | `string` | Yes      | Opportunity name   |
| `stageId`       | `string` | Yes      | The stage ID       |
| `contactId`     | `string` | Yes      | The contact ID     |
| `status`        | `string` | Yes      | Opportunity status |
| `monetaryValue` | `number` | No       | Monetary value     |
| `assignedTo`    | `string` | No       | Assigned user ID   |

**`opportunities_update`**

| Parameter       | Type     | Required | Description        |
| --------------- | -------- | -------- | ------------------ |
| `id`            | `string` | Yes      | The opportunity ID |
| `name`          | `string` | No       | Opportunity name   |
| `stageId`       | `string` | No       | The stage ID       |
| `status`        | `string` | No       | Opportunity status |
| `monetaryValue` | `number` | No       | Monetary value     |
| `assignedTo`    | `string` | No       | Assigned user ID   |

</details>

---

## Scheduling

### Calendars (17 tools)

| Tool                           | Title                 | Description                             | Annotations |
| ------------------------------ | --------------------- | --------------------------------------- | ----------- |
| `calendars_list`               | List Calendars        | Get all calendars for a location        | 🔒 🔄 🌐    |
| `calendars_create`             | Create Calendar       | Create a new calendar                   | 🌐          |
| `calendars_get`                | Get Calendar          | Get a calendar by ID                    | 🔒 🔄 🌐    |
| `calendars_update`             | Update Calendar       | Update an existing calendar             | 🔄 🌐       |
| `calendars_delete`             | Delete Calendar       | Delete a calendar by ID                 | 💥 🔄 🌐    |
| `calendars_get_slots`          | Get Calendar Slots    | Get free/available slots for a calendar | 🔒 🔄 🌐    |
| `calendars_get_groups`         | Get Calendar Groups   | Get all calendar groups for a location  | 🔒 🔄 🌐    |
| `calendars_create_group`       | Create Calendar Group | Create a new calendar group             | 🌐          |
| `calendars_delete_group`       | Delete Calendar Group | Delete a calendar group by ID           | 💥 🔄 🌐    |
| `calendars_edit_group`         | Edit Calendar Group   | Edit an existing calendar group         | 🔄 🌐       |
| `calendars_create_appointment` | Create Appointment    | Create a new appointment                | 🌐          |
| `calendars_edit_appointment`   | Edit Appointment      | Edit an existing appointment            | 🔄 🌐       |
| `calendars_get_appointment`    | Get Appointment       | Get an appointment by event ID          | 🔒 🔄 🌐    |
| `calendars_get_events`         | Get Calendar Events   | Get calendar events within a time range | 🔒 🔄 🌐    |
| `calendars_delete_event`       | Delete Calendar Event | Delete a calendar event                 | 💥 🔄 🌐    |
| `calendars_create_block_slot`  | Create Block Slot     | Create a block slot on a calendar       | 🌐          |

---

## Messaging

### Conversations (12 tools)

| Tool                                   | Title                    | Description                                   | Annotations |
| -------------------------------------- | ------------------------ | --------------------------------------------- | ----------- |
| `conversations_search`                 | Search Conversations     | Search conversations                          | 🔒 🔄 🌐    |
| `conversations_get`                    | Get Conversation         | Get a conversation by ID                      | 🔒 🔄 🌐    |
| `conversations_create`                 | Create Conversation      | Create a new conversation                     | 🌐          |
| `conversations_update`                 | Update Conversation      | Update a conversation                         | 🔄 🌐       |
| `conversations_delete`                 | Delete Conversation      | Delete a conversation                         | 💥 🔄 🌐    |
| `conversations_getMessages`            | Get Messages             | Get messages for a conversation               | 🔒 🔄 🌐    |
| `conversations_sendMessage`            | Send Message             | Send a new message                            | 🌐          |
| `conversations_addInboundMessage`      | Add Inbound Message      | Add an inbound message to a conversation      | 🌐          |
| `conversations_cancelScheduledMessage` | Cancel Scheduled Message | Cancel a scheduled message                    | 💥 🔄 🌐    |
| `conversations_updateMessageStatus`    | Update Message Status    | Update the status of a message                | 🔄 🌐       |
| `conversations_getMessageRecording`    | Get Message Recording    | Get the recording for a message by message ID | 🔒 🔄 🌐    |
| `conversations_uploadFileAttachments`  | Upload File Attachments  | Upload a file attachment to a conversation    | 🌐          |

### Emails (1 tool)

| Tool          | Title                | Description                        | Annotations |
| ------------- | -------------------- | ---------------------------------- | ----------- |
| `emails_list` | List Email Templates | Get email templates for a location | 🔒 🔄 🌐    |

---

## Marketing

### Campaigns (1 tool)

| Tool             | Title          | Description                  | Annotations |
| ---------------- | -------------- | ---------------------------- | ----------- |
| `campaigns_list` | List Campaigns | Get campaigns for a location | 🔒 🔄 🌐    |

### Social Media (12 tools)

| Tool                                | Title                         | Description                            | Annotations |
| ----------------------------------- | ----------------------------- | -------------------------------------- | ----------- |
| `social-media_get-google-locations` | Get Google Business Locations | Get Google Business locations          | 🔒 🔄 🌐    |
| `social-media_set-google-locations` | Set Google Business Locations | Set Google Business location           | 🔄 🌐       |
| `social-media_get-accounts`         | Get Social Media Accounts     | Get social media accounts              | 🔒 🔄 🌐    |
| `social-media_search-posts`         | Search Social Media Posts     | Search social media posts              | 🔒 🔄 🌐    |
| `social-media_create-post`          | Create Social Media Post      | Create a social media post             | 🌐          |
| `social-media_get-post`             | Get Social Media Post         | Get a social media post by ID          | 🔒 🔄 🌐    |
| `social-media_edit-post`            | Edit Social Media Post        | Edit a social media post               | 🔄 🌐       |
| `social-media_delete-post`          | Delete Social Media Post      | Delete a social media post             | 💥 🔄 🌐    |
| `social-media_get-csv`              | Get Post CSV Report           | Get CSV report for a social media post | 🔒 🔄 🌐    |
| `social-media_get-categories`       | Get Post Categories           | Get social media post categories       | 🔒 🔄 🌐    |
| `social-media_get-tags`             | Get Social Media Tags         | Get social media tags                  | 🔒 🔄 🌐    |
| `social-media_get-tags-by-ids`      | Get Tags by IDs               | Get social media tags by IDs           | 🔒 🔄 🌐    |

### Blogs (7 tools)

| Tool                   | Title                | Description                             | Annotations |
| ---------------------- | -------------------- | --------------------------------------- | ----------- |
| `blogs_list`           | List Blogs           | Get all blogs for a location            | 🔒 🔄 🌐    |
| `blogs_listAuthors`    | List Blog Authors    | Get blog authors for a location         | 🔒 🔄 🌐    |
| `blogs_listCategories` | List Blog Categories | Get blog categories for a location      | 🔒 🔄 🌐    |
| `blogs_listPosts`      | List Blog Posts      | Get blog posts by blog ID               | 🔒 🔄 🌐    |
| `blogs_createPost`     | Create Blog Post     | Create a new blog post                  | 🌐          |
| `blogs_updatePost`     | Update Blog Post     | Update an existing blog post            | 🔄 🌐       |
| `blogs_checkUrlSlug`   | Check URL Slug       | Check if a blog URL slug already exists | 🔒 🔄 🌐    |

---

## Commerce

### Products (5 tools)

| Tool              | Title          | Description                  | Annotations |
| ----------------- | -------------- | ---------------------------- | ----------- |
| `products_list`   | List Products  | List products for a location | 🔒 🔄 🌐    |
| `products_get`    | Get Product    | Get a product by ID          | 🔒 🔄 🌐    |
| `products_create` | Create Product | Create a new product         | 🌐          |
| `products_update` | Update Product | Update an existing product   | 🔄 🌐       |
| `products_delete` | Delete Product | Delete a product             | 💥 🔄 🌐    |

### Payments (7 tools)

| Tool                         | Title              | Description                        | Annotations |
| ---------------------------- | ------------------ | ---------------------------------- | ----------- |
| `payments_listOrders`        | List Orders        | List payment orders                | 🔒 🔄 🌐    |
| `payments_getOrder`          | Get Order          | Get a payment order by ID          | 🔒 🔄 🌐    |
| `payments_listTransactions`  | List Transactions  | List payment transactions          | 🔒 🔄 🌐    |
| `payments_getTransaction`    | Get Transaction    | Get a payment transaction by ID    | 🔒 🔄 🌐    |
| `payments_listSubscriptions` | List Subscriptions | List payment subscriptions         | 🔒 🔄 🌐    |
| `payments_getSubscription`   | Get Subscription   | Get a payment subscription by ID   | 🔒 🔄 🌐    |
| `payments_listIntegrations`  | List Integrations  | List payment integration providers | 🔒 🔄 🌐    |

### Invoices (8 tools)

| Tool                     | Title          | Description                            | Annotations |
| ------------------------ | -------------- | -------------------------------------- | ----------- |
| `invoices_list`          | List Invoices  | List invoices                          | 🔒 🔄 🌐    |
| `invoices_get`           | Get Invoice    | Get an invoice by ID                   | 🔒 🔄 🌐    |
| `invoices_create`        | Create Invoice | Create a new invoice                   | 🌐          |
| `invoices_update`        | Update Invoice | Update an existing invoice             | 🔄 🌐       |
| `invoices_delete`        | Delete Invoice | Delete an invoice                      | 💥 🔄 🌐    |
| `invoices_send`          | Send Invoice   | Send an invoice                        | 🌐          |
| `invoices_void`          | Void Invoice   | Void an invoice                        | 💥 🔄 🌐    |
| `invoices_recordPayment` | Record Payment | Record a manual payment for an invoice | 🌐          |

---

## Sites & Funnels

### Funnels (6 tools)

| Tool                       | Title             | Description                   | Annotations |
| -------------------------- | ----------------- | ----------------------------- | ----------- |
| `funnels_list`             | List Funnels      | List funnels for a location   | 🔒 🔄 🌐    |
| `funnels_pages_list`       | List Funnel Pages | List pages for a funnel       | 🔒 🔄 🌐    |
| `funnels_redirects_list`   | List Redirects    | List redirects for a location | 🔒 🔄 🌐    |
| `funnels_redirects_create` | Create Redirect   | Create a new redirect         | 🌐          |
| `funnels_redirects_update` | Update Redirect   | Update an existing redirect   | 🔄 🌐       |
| `funnels_redirects_delete` | Delete Redirect   | Delete a redirect             | 💥 🔄 🌐    |

### Forms (2 tools)

| Tool                     | Title                 | Description                         | Annotations |
| ------------------------ | --------------------- | ----------------------------------- | ----------- |
| `forms_list`             | List Forms            | Get forms for a location            | 🔒 🔄 🌐    |
| `forms_submissions_list` | List Form Submissions | Get form submissions for a location | 🔒 🔄 🌐    |

### Surveys (2 tools)

| Tool                       | Title                   | Description                           | Annotations |
| -------------------------- | ----------------------- | ------------------------------------- | ----------- |
| `surveys_list`             | List Surveys            | Get surveys for a location            | 🔒 🔄 🌐    |
| `surveys_submissions_list` | List Survey Submissions | Get survey submissions for a location | 🔒 🔄 🌐    |

### Links (4 tools)

| Tool           | Title       | Description              | Annotations |
| -------------- | ----------- | ------------------------ | ----------- |
| `links_list`   | List Links  | Get links for a location | 🔒 🔄 🌐    |
| `links_create` | Create Link | Create a new link        | 🌐          |
| `links_update` | Update Link | Update an existing link  | 🔄 🌐       |
| `links_delete` | Delete Link | Delete a link            | 💥 🔄 🌐    |

---

## Administration

### Locations (11 tools)

| Tool                          | Title                        | Description                            | Annotations |
| ----------------------------- | ---------------------------- | -------------------------------------- | ----------- |
| `locations_get`               | Get Location                 | Get a location by ID                   | 🔒 🔄 🌐    |
| `locations_update`            | Update Location              | Update an existing location            | 🔄 🌐       |
| `locations_search`            | Search Locations             | Search locations                       | 🔒 🔄 🌐    |
| `locations_create`            | Create Location              | Create a new location                  | 🌐          |
| `locations_delete`            | Delete Location              | Delete a location by ID                | 💥 🔄 🌐    |
| `locations_getTags`           | Get Location Tags            | Get tags for a location                | 🔒 🔄 🌐    |
| `locations_createTag`         | Create Location Tag          | Create a tag for a location            | 🌐          |
| `locations_getCustomFields`   | Get Location Custom Fields   | Get custom fields for a location       | 🔒 🔄 🌐    |
| `locations_getCustomValues`   | Get Location Custom Values   | Get custom values for a location       | 🔒 🔄 🌐    |
| `locations_createCustomValue` | Create Location Custom Value | Create a custom value for a location   | 🌐          |
| `locations_getTemplates`      | Get Location Templates       | Get email/SMS templates for a location | 🔒 🔄 🌐    |

### Users (5 tools)

| Tool           | Title        | Description             | Annotations |
| -------------- | ------------ | ----------------------- | ----------- |
| `users_get`    | Get User     | Get a user by ID        | 🔒 🔄 🌐    |
| `users_search` | Search Users | Search users            | 🔒 🔄 🌐    |
| `users_update` | Update User  | Update an existing user | 🔄 🌐       |
| `users_delete` | Delete User  | Delete a user           | 💥 🔄 🌐    |
| `users_create` | Create User  | Create a new user       | 🌐          |

### Businesses (5 tools)

| Tool                | Title           | Description                   | Annotations |
| ------------------- | --------------- | ----------------------------- | ----------- |
| `businesses_list`   | List Businesses | Get businesses for a location | 🔒 🔄 🌐    |
| `businesses_create` | Create Business | Create a new business         | 🌐          |
| `businesses_get`    | Get Business    | Get a business by ID          | 🔒 🔄 🌐    |
| `businesses_update` | Update Business | Update an existing business   | 🔄 🌐       |
| `businesses_delete` | Delete Business | Delete a business by ID       | 💥 🔄 🌐    |

### Workflows (1 tool)

| Tool             | Title          | Description                  | Annotations |
| ---------------- | -------------- | ---------------------------- | ----------- |
| `workflows_list` | List Workflows | Get workflows for a location | 🔒 🔄 🌐    |

---

## Customization

### Custom Fields (5 tools)

| Tool                  | Title               | Description                                    | Annotations |
| --------------------- | ------------------- | ---------------------------------------------- | ----------- |
| `customFields_list`   | List Custom Fields  | Get custom fields by object key for a location | 🔒 🔄 🌐    |
| `customFields_create` | Create Custom Field | Create a new custom field                      | 🌐          |
| `customFields_get`    | Get Custom Field    | Get a custom field or folder by ID             | 🔒 🔄 🌐    |
| `customFields_update` | Update Custom Field | Update an existing custom field                | 🔄 🌐       |
| `customFields_delete` | Delete Custom Field | Delete a custom field by ID                    | 💥 🔄 🌐    |

### Custom Menus (5 tools)

| Tool                 | Title              | Description                     | Annotations |
| -------------------- | ------------------ | ------------------------------- | ----------- |
| `customMenus_list`   | List Custom Menus  | Get custom menus for a location | 🔒 🔄 🌐    |
| `customMenus_create` | Create Custom Menu | Create a new custom menu link   | 🌐          |
| `customMenus_get`    | Get Custom Menu    | Get a custom menu by ID         | 🔒 🔄 🌐    |
| `customMenus_update` | Update Custom Menu | Update an existing custom menu  | 🔄 🌐       |
| `customMenus_delete` | Delete Custom Menu | Delete a custom menu by ID      | 💥 🔄 🌐    |

### Objects (6 tools)

| Tool                     | Title                    | Description                       | Annotations |
| ------------------------ | ------------------------ | --------------------------------- | ----------- |
| `objects_get-by-key`     | Get Object Schema by Key | Get an object schema by key or ID | 🔒 🔄 🌐    |
| `objects_search-records` | Search Object Records    | Search records for an object      | 🔒 🔄 🌐    |
| `objects_get-record`     | Get Object Record        | Get a single object record by ID  | 🔒 🔄 🌐    |
| `objects_create-record`  | Create Object Record     | Create a new object record        | 🌐          |
| `objects_update-record`  | Update Object Record     | Update an existing object record  | 🔄 🌐       |
| `objects_delete-record`  | Delete Object Record     | Delete an object record           | 💥 🔄 🌐    |

### Associations (1 tool)

| Tool               | Title           | Description              | Annotations |
| ------------------ | --------------- | ------------------------ | ----------- |
| `associations_get` | Get Association | Get an association by ID | 🔒 🔄 🌐    |

---

## Media & Content

### Medias (2 tools)

| Tool            | Title        | Description                                    | Annotations |
| --------------- | ------------ | ---------------------------------------------- | ----------- |
| `medias_list`   | List Media   | Get files and folders from the media library   | 🔒 🔄 🌐    |
| `medias_delete` | Delete Media | Delete a file or folder from the media library | 💥 🔄 🌐    |

### Courses (1 tool)

| Tool             | Title          | Description                            | Annotations |
| ---------------- | -------------- | -------------------------------------- | ----------- |
| `courses_import` | Import Courses | Import courses through public channels | 🌐          |

---

## Agency Management

### Snapshots (2 tools)

| Tool                        | Title                    | Description                             | Annotations |
| --------------------------- | ------------------------ | --------------------------------------- | ----------- |
| `snapshots_list`            | List Snapshots           | Get snapshots for a company             | 🔒 🔄 🌐    |
| `snapshots_get-push-status` | Get Snapshot Push Status | Get the last push status for a snapshot | 🔒 🔄 🌐    |

### SaaS API (4 tools)

| Tool                                 | Title                     | Description                                                | Annotations |
| ------------------------------------ | ------------------------- | ---------------------------------------------------------- | ----------- |
| `saas-api_get-locations`             | Get SaaS Locations        | Get SaaS-activated locations for a company with pagination | 🔒 🔄 🌐    |
| `saas-api_get-location-subscription` | Get Location Subscription | Get subscription details for a SaaS location               | 🔒 🔄 🌐    |
| `saas-api_enable-saas`               | Enable SaaS               | Enable SaaS for a sub-account location                     | 🌐          |
| `saas-api_update-rebilling`          | Update Rebilling          | Update rebilling configuration                             | 🌐          |
