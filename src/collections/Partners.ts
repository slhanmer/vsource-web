import type { CollectionConfig } from 'payload'

import { contentAccess, orderField, pendingField, slugField } from './fields'

/*
 * Clients and partners: the home page band and the fold's "Working with"
 * strip. Mirrors the old `Partner` in src/constants/partners.ts.
 *
 * Deliberately short and specific: three real names beat a wall of logos.
 * Logos sit on a light plate in both themes, in their own colours — they are
 * supplied artwork designed for white, and recolouring them is not ours to do.
 */
export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'order'],
  },
  defaultSort: 'order',
  access: contentAccess,
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField,
    orderField,
    pendingField('pending', 'Pending — not yet checked with the partner'),
    {
      name: 'kind',
      type: 'text',
      required: true,
      admin: { description: 'Client, Industry partner, and so on.' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Their own artwork, as supplied. Shown on a light plate.' },
    },
    { name: 'body', type: 'textarea', required: true },
  ],
}
