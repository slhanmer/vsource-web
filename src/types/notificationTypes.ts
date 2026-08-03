/**
 * Delivery channel for a notification.
 * `SMOKE` is a test/canary notification used to verify pipeline health.
 */
export type NotificationType = 'EMAIL' | 'SMS' | 'INTERNAL' | 'WORKFLOW' | 'SMOKE'

/** Who receives a notification — an individual user, a role group, or a system process. */
export type recipientType = 'USER' | 'GROUP' | 'SYSTEM'

/** A notification recipient descriptor attached to a form or assessment payload. */
export type NotificationDetails = {
  /** Optional UUID for an existing notification record */
  uuid?: string
  /** Recipient identifier (userId, groupId, or system key depending on `recipientType`) */
  id: string
  recipientType: string
  type: NotificationType
}
