import type { Access, CollectionConfig } from 'payload'

import { contentAccess, lines, orderField, slugField } from './fields'

/*
 * What is on /built: the index, every project page, and the projects listed
 * under each stream. Mirrors the old `Project` in src/constants/built.ts.
 *
 * DRAFTS ARE OFF THE SITE. `versions.drafts` gives every project a published
 * and a draft state; the site only ever reads published ones (src/data/), and
 * an anonymous API request can only see published ones (read access below).
 * Publishing a new project puts it on /built and at /built/<slug> without a
 * deploy: that route has dynamicParams on.
 *
 * Content rules that apply here (CLAUDE.md):
 *   - "Class A" appears nowhere. The claim about Aptium is TGA-regulated.
 *   - Aptium may be named; its screens are under NDA. No screenshot of it.
 *   - `placeholder` marks invented copy and renders a visible marker.
 *
 * MEDIA RULE — short clips self-hosted, long-form linked out. Clips are muted,
 * looping, under ten seconds, with a poster, so nothing but the still is
 * fetched until the clip is on screen. Anything long goes behind `media.long`.
 */
const publishedOrSignedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'stream', 'status', 'order', '_status'],
    description: 'The /built page. A draft is not on the site until it is published.',
  },
  defaultSort: 'order',
  versions: { drafts: true },
  access: { ...contentAccess, read: publishedOrSignedIn },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    orderField,
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Leads /built at full width. Exactly one project should have it.',
      },
    },
    {
      name: 'placeholder',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Invented copy: shows a [placeholder] marker. Untick only when the real words are in.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'client',
          type: 'text',
          required: true,
          admin: { description: 'Who it was for. "—" where there is no client to name.' },
        },
        { name: 'stream', type: 'relationship', relationTo: 'streams', required: true },
        { name: 'year', type: 'text', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'live',
          options: ['live', 'building', 'starting'],
          /*
           * ⚠ Its own enum name. Left to the default, Payload names this
           * `enum_projects_status` — the same name drafts give `_status` — and
           * the migration fails creating the type twice.
           */
          enumName: 'enum_projects_project_status',
        },
      ],
    },
    { name: 'line', type: 'text', required: true, admin: { description: 'One line, for /built.' } },
    { name: 'lede', type: 'textarea', required: true, admin: { description: 'The page opener.' } },
    lines('body', { required: true }),
    {
      name: 'facts',
      type: 'array',
      admin: { description: 'Standards, hardware, scale. Two columns on the page.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      admin: { description: 'The live site, if there is one to visit.' },
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video clip', value: 'video' },
            { label: 'Stream mark (work that cannot be shown)', value: 'mark' },
          ],
        },
        {
          name: 'upload',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'The image, or the mp4 clip.',
            condition: (_, sibling) => sibling?.kind !== 'mark',
          },
        },
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Video only. Shown until the clip plays, and under reduced motion.',
            condition: (_, sibling) => sibling?.kind === 'video',
          },
        },
        {
          name: 'markId',
          type: 'select',
          options: ['software', 'robotics', 'websites'],
          admin: { condition: (_, sibling) => sibling?.kind === 'mark' },
        },
        {
          name: 'alt',
          type: 'textarea',
          required: true,
          admin: {
            description:
              'What it shows, for anyone who cannot see it. Written by someone who has looked at it.',
          },
        },
        {
          name: 'long',
          type: 'group',
          admin: {
            description: 'Optional: the full-length version, off-site, behind a click.',
          },
          fields: [
            { name: 'href', type: 'text' },
            { name: 'label', type: 'text' },
          ],
        },
      ],
    },
  ],
}
