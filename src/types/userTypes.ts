/**
 * Authenticated user profile returned from the API and stored in the user store.
 * `accessLevel` is a numeric hierarchy — higher values grant broader permissions.
 * `roles` are string identifiers used for route/feature gating alongside `accessLevel`.
 */
export type UserType = {
  firstName: string
  lastName: string
  /** ISO date string (YYYY-MM-DD) */
  dob: string
  userId: string
  /** Set only for users enrolled as students */
  studentId?: number
  username: string
  /** URL path to the user's profile picture, if uploaded */
  profilePic?: string
  email: string
  phone?: string
  /** Numeric permission tier; higher = more access */
  accessLevel: number
  /** Role identifiers used for UI and route gating (e.g. 'trainer', 'admin') */
  roles: string[]
}
