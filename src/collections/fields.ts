import type { Access, ArrayField, Field } from 'payload'

import { isAdmin, isAdminField, isSignedIn } from '../lib/access'

/*
 * Shared pieces of the four content collections.
 *
 * FIELD NAMES ARE THE OLD CONSTANTS' PROPERTY NAMES (Simon's standing rule), so
 * the front end, the generated types and the database use the same words.
 * Payload reserves `id`, so the constants' `id` is `slug` everywhere.
 */

/*
 * "Composition is ours, content is theirs" — the starter's split. An editor
 * changes words and photographs on what exists; only an admin adds or removes
 * a stream, a project, a person or a partner, because each of those changes
 * what the site claims, not just how it says it.
 */
export const contentAccess = {
  read: (() => true) as Access,
  create: isAdmin,
  update: isSignedIn,
  delete: isAdmin,
}

/** The anchor and URL segment. Explicit, so a title edit cannot break a link. */
export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Used in the URL and as the anchor. Changing it breaks existing links.',
  },
  // A slug is structure, not copy.
  access: { update: isAdminField },
}

/** The admin sorts by it and so does the site. Lower comes first. */
export const orderField: Field = {
  name: 'order',
  type: 'number',
  required: true,
  defaultValue: 0,
  index: true,
  admin: { position: 'sidebar', description: 'Lower comes first, on the site and here.' },
}

/*
 * A list of strings — paragraphs, or the lines of an "includes" list.
 *
 * Stored as an array of `{ text }` rows rather than a `hasMany` text field,
 * which the admin renders as chips: wrong for sentences. src/data/ flattens it
 * back to the `string[]` the components have always taken.
 */
export function lines(
  name: string,
  opts: { label?: string; required?: boolean; long?: boolean; description?: string } = {}
): ArrayField {
  return {
    name,
    type: 'array',
    label: opts.label,
    minRows: opts.required ? 1 : undefined,
    required: opts.required,
    admin: { description: opts.description },
    fields: [
      opts.long === false
        ? { name: 'text', type: 'text', required: true }
        : { name: 'text', type: 'textarea', required: true },
    ],
  }
}

/*
 * Invented or unverified copy. Renders a visible marker on the page. Do not
 * untick it without replacing the words with something someone has confirmed
 * (CLAUDE.md, Content rules).
 */
export function pendingField(name = 'pending', label = 'Pending — unverified copy'): Field {
  return {
    name,
    type: 'checkbox',
    label,
    defaultValue: false,
    admin: {
      description:
        'Shows a visible marker on the page. Untick only when the words have been confirmed.',
    },
  }
}
