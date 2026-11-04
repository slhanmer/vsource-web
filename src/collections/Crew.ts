import type { CollectionConfig } from 'payload'

import { contentAccess, lines, orderField, pendingField, slugField } from './fields'

/*
 * The team: the home page teaser and /team. Mirrors the old `CrewMember` in
 * src/constants/crew.ts, with `id` → `slug` (still the #anchor on /team).
 *
 * PORTRAITS. 4:5, at least 1200×1500, in COLOUR. There is no tone layer; the
 * recessed edge is the only thing drawn over it. The box is the same size with
 * or without one, so uploading a portrait reflows nothing. With no portrait the
 * box holds the terminal tile.
 *
 * Tom will not have a portrait. That is permanent: the terminal tile is his
 * treatment, not a gap. Do not chase a photograph for him.
 *
 * No stock faces. The old `stockPortrait` stand-ins were never seeded, so the
 * guard that kept them out of production is gone with them. Only a photograph
 * of the actual person goes here.
 *
 * LAYOUT: cards go into a row the team divides into (CLAUDE.md). Adding or
 * removing a person means rechecking the column counts in crew.scss/home.scss.
 */
export const Crew: CollectionConfig = {
  slug: 'crew',
  labels: { singular: 'Person', plural: 'Crew' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
    description:
      'The team. Adding or removing someone changes the grid: tell whoever looks after the site.',
  },
  defaultSort: 'order',
  access: contentAccess,
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField,
    orderField,
    pendingField('pending', 'Pending — the person has not read their own entry'),
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: { description: 'Job title. Nobody here is called an engineer (CLAUDE.md).' },
    },
    {
      name: 'summary',
      type: 'text',
      required: true,
      admin: { description: 'One line, for the home page teaser.' },
    },
    lines('bio', { required: true, description: 'The /team bio, one row per paragraph.' }),
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          '4:5, at least 1200×1500, in colour, of this person. Leave empty for the terminal tile.',
      },
    },
  ],
}
