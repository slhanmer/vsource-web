/**
 * Broad purpose of the ticket. Drives backend routing: the (product, type)
 * pair resolves the Jira issue type and notification recipient.
 *
 * Must stay in step with the `tickets.type` enum and TICKET_ROUTES in
 * ticketService.js — an unrecognised pair is rejected at submission.
 */
export type TicketType = 'BUG' | 'SUPPORT' | 'QUALITY' | 'COMPLIANCE' | 'FEATURE'

/**
 * Which product raised the ticket.
 */
export type TicketProduct = 'PORTAL' | 'DEVICE'

/**
 * Triage state.
 *
 * Deliberately small and neutral. Jira owns the real workflow; this only
 * records whether an item has been picked up. Resist adding per-type
 * vocabularies — that is how the previous schema rotted.
 */
export type TicketStatus = 'NEW' | 'TRIAGED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

/** Delivery state of the Jira triage issue. Drives the retry sweep. */
export type TicketJiraState = 'PENDING' | 'SYNCED' | 'FAILED' | 'SKIPPED'

/** Delivery state of the notification email. Drives the retry sweep. */
export type TicketNotifyState = 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED'

/**
 * Reporter-supplied urgency.
 *
 * NOT a column on `tickets` — it travels in `context` and is mapped onto the
 * Jira priority field at issue creation. Jira owns priority thereafter, so a
 * value stored here would drift out of sync with the one triage actually uses.
 */
export type PriorityType = 'CRITICAL' | 'URGENT' | 'STANDARD' | 'LOW' | 'TRIVIAL'

/**
 * Developer-facing area hint on a bug report. Also context-only.
 * `FE` = frontend, `BE` = backend.
 */
export type TicketCategory = 'FE' | 'BE' | 'DATA'

/** Options offered in the Contact Support modal. Context-only. */
export type TicketSupportType = 'SCANNER' | 'SCAN' | 'ACCOUNT' | 'OTHER'

/**
 * A ticket as stored in the master schema and returned by `ticket/list`.
 *
 * No reporter PII. `tenantId` and `userId` are references only — tenant user
 * records live in the tenant database and are resolved on demand, so a ticket
 * never carries a name or email.
 */
export type Ticket = {
  uuid: string
  product: TicketProduct
  type: TicketType
  status: TicketStatus

  /** Tenant that raised it. Null for system-raised tickets. */
  tenantId: string | null
  /** Tenant-database user id. No FK — different schema. */
  userId: string | null

  subject: string
  /** Raw submitted text. Escaped per sink on the way out, never pre-escaped. */
  body: string

  /**
   * Client environment captured at submission — route, appVersion, userAgent,
   * viewport, and where relevant scanId / deviceId / priority / category.
   * Read once at triage, never queried, so the shape is free to change.
   */
  context: Record<string, unknown> | null

  /** Links to an `errors` row when the report followed a caught error. */
  errorEventId: string | null

  /** e.g. `BT-42`. Null until the Jira sync succeeds. */
  jiraIssueKey: string | null
  jiraSyncState: TicketJiraState
  jiraSyncedAt: string | null

  notifyState: TicketNotifyState
  notifiedAt: string | null

  /** ISO datetime of creation */
  created: string
  /** ISO datetime of last update; null if never updated */
  updated: string | null
}

/**
 * A ticket submission.
 *
 * Deliberately narrow. Identity, status, uuid and all downstream state are
 * server-derived — anything else sent is dropped by the backend whitelist, so
 * there is no point sending it.
 */
export type TicketSubmission = {
  type: TicketType
  subject: string
  body: string
  context?: Record<string, unknown>
  errorEventId?: string
  /** Defaults to PORTAL server-side. */
  product?: TicketProduct
}

/** Filters for the operator-facing list view. */
export type TicketListFilters = {
  status?: TicketStatus
  product?: TicketProduct
  type?: TicketType
  limit?: number
  offset?: number
}
