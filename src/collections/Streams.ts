import type { CollectionConfig } from 'payload'

import { contentAccess, lines, orderField, pendingField, slugField } from './fields'

/*
 * The three streams. Drives the home page's "What changes" rows, and
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
    description: 'The three lines of work. Each one is a home page row and its own page.',
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
          admin: {
            description:
              'Sits beside the stream’s "What changes" row. With a clip below, this is its poster: shown without JavaScript, under reduced motion and until the clip plays, so use the clip’s first frame.',
          },
        },
        {
          /* home-tweaks §1: optional, so a migration can add the column to
             existing rows. stepPhoto stays required: it is the poster. */
          name: 'stepClip',
          type: 'upload',
          relationTo: 'media',
          filterOptions: { mimeType: { contains: 'video' } },
          admin: {
            description:
              'Optional: a short muted mp4 (under ten seconds) that plays in place of the photo while the row is on screen, with a pause control.',
          },
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
          /*
           * The photograph in the stream page's head, at its own aspect, where
           * the line-drawn stream mark used to be (review-2).
           */
          name: 'pagePhoto',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'The photograph at the top of this stream’s page.' },
        },
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
            {
              /*
               * Optional. A section with media is two columns, text and media,
               * alternating sides down the page; without, it stays one column.
               * A video follows the /built clip rules: mp4, muted, looping,
               * under ten seconds, with a poster and a pause control.
               */
              name: 'media',
              type: 'group',
              admin: { description: 'Optional: a photograph or a short clip beside this section.' },
              fields: [
                {
                  name: 'upload',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'An image, or an mp4 clip under ten seconds. Landscape, about 16:10 (e.g. 1600×1000). Portrait images stand taller than the text beside them.',
                  },
                },
                {
                  name: 'poster',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Clips only: shown until it plays, and under reduced motion.',
                  },
                },
                {
                  name: 'alt',
                  type: 'textarea',
                  admin: {
                    description: 'What it shows. Leave empty to use the media’s own alt text.',
                  },
                },
              ],
            },
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
