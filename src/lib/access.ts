import type { Access, FieldAccess } from 'payload'

/*
 * Roles and access, copied from the starter's src/lib/access.ts — only the
 * parts this site uses. The starter's block-structure lock and jobs access are
 * not here: this site has no page builder and no scheduled publishing.
 *
 * Composition is ours, content is theirs: editors change copy and images in
 * the documents that exist; only admins create or delete them, and only
 * admins manage accounts.
 */
export const ROLES = ['admin', 'editor'] as const
export type Role = (typeof ROLES)[number]

/*
 * Read off req.user structurally rather than from the generated User type.
 * payload-types is generated FROM this config, so typing against it here is a
 * chicken-and-egg problem every time the users collection changes.
 */
function roleOf(user: unknown): Role | null {
  if (user && typeof user === 'object' && 'role' in user) {
    const role = (user as { role?: unknown }).role
    if (role === 'admin' || role === 'editor') return role
  }
  return null
}

function idOf(user: unknown): string | number | null {
  if (user && typeof user === 'object' && 'id' in user) {
    const id = (user as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return null
}

export const isAdmin: Access = ({ req }) => roleOf(req.user) === 'admin'
export const isSignedIn: Access = ({ req }) => Boolean(req.user)

/** Field-level access takes a different signature to collection-level. */
export const isAdminField: FieldAccess = ({ req }) => roleOf(req.user) === 'admin'

/*
 * Admins see every user. Everyone else sees exactly one row: themselves.
 *
 * Returning a query rather than false is the point — an editor keeps the
 * ability to change their own password without gaining any view of, or reach
 * over, the other accounts on the site.
 */
export const isAdminOrSelf: Access = ({ req }) => {
  if (roleOf(req.user) === 'admin') return true
  const id = idOf(req.user)
  if (id === null) return false
  return { id: { equals: id } }
}
