import type { CollectionConfig } from 'payload'

import { contentAccess, lines, orderField, pendingField, slugField } from './fields'

/*
 * The three streams. Drives the home page doors and "What changes" rows, and
 * all three stream pages (app/(site)/[stream]/page.tsx). Adding a fourth stream
 * is a new row here, not a new page.
 *
 * Mirrors the old `Stream` in src/constants/streams.ts field for field, with
 * `id` → `slug`. `href` is not stored: it is `/${slug}`, derived in src/data/.
 *
 * NOT HERE, ON PURPOSE: STREAM_COMMON (hosting and support, the same through
 * every stream) stays in src/constants/streams.ts. See CLAUDE.md, CMS.
 *
 * ⚠ The word "engineer". Nobody at V Source is RPEQ-registered, and Queensland
 * regulates who may provide "professional engineering services". Nothing in
 * this copy may call anyone an engineer or offer engineering. The stream is
 * Robotics for that reason; do not rename it back.
 */
export const Streams: CollectionConfig = {
  slug: 'streams',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    description: 'The three lines of work. Each one is a home page door, a row, and its own page.',
  },
  defaultSort: 'order',
  access: contentAccess,
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'Plain, searchable.' } },
    slugField,
    orderField,
    {
      type: 'collapsible',
      label: 'Home page',
      fields: [
        {
          name: 'door',
          type: 'text',
          required: true,
          admin: {
            description:
              'One short line for the door in the hero. Not the same sentence as anything in the row below it.',
          },
        },
        {
          name: 'doorPhoto',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Fills the door on the home page fold.' },
        },
        {
          name: 'problem',
          type: 'text',
          required: true,
          admin: {
            description:
              'Where someone is now. One short sentence they would recognise — a situation, never a failing.',
          },
        },
        {
          name: 'instead',
          type: 'text',
          required: true,
          admin: { description: 'What they have instead. One line, the one the eye lands on.' },
        },
        {
          name: 'solution',
          type: 'textarea',
          required: true,
          admin: { description: 'The why behind "instead": one or two sentences.' },
        },
        {
          name: 'stepPhoto',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Sits beside the stream’s "What changes" row.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Stream page',
      fields: [
        {
          name: 'promise',
          type: 'text',
          required: true,
          admin: { description: 'The h1. A promise, not a label.' },
        },
        { name: 'pageLede', type: 'textarea', required: true },
        {
          name: 'sections',
          type: 'array',
          admin: {
            description:
              'Specific to this stream. Anything true of all three belongs in the shared list, which is in code.',
          },
          fields: [
            {
              name: 'slug',
              type: 'text',
              required: true,
              admin: { description: 'Anchor. Changing it breaks links to this section.' },
            },
            { name: 'title', type: 'text', required: true },
            lines('body', { required: true }),
            lines('includes', { long: false }),
            {
              name: 'link',
              type: 'group',
              admin: { description: 'One optional onward link after the last paragraph.' },
              fields: [
                { name: 'href', type: 'text' },
                { name: 'label', type: 'text' },
              ],
            },
            pendingField(),
          ],
        },
        { name: 'lede', type: 'text', required: true },
        lines('caps', { required: true, long: false, description: 'What a client actually gets.' }),
        { name: 'who', type: 'text', required: true },
        {
          name: 'proof',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
            pendingField(),
          ],
        },
        {
          name: 'pricing',
          type: 'group',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'note', type: 'textarea', required: true },
          ],
        },
      ],
    },
  ],
}
