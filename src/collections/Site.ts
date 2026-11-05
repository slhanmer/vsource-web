import type { GlobalConfig } from 'payload'

import { isSignedIn } from '../lib/access'

/*
 * The few site-wide things that are content but belong to no collection.
 *
 * `groupPhoto` is not in the brief's list; it is here because the old
 * PHOTOS.group slot on /team (empty, rendering nothing until the shoot's group
 * photograph arrives) needs somewhere to live once photos.ts is gone.
 */
export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Site',
  access: { read: () => true, update: isSignedIn },
  fields: [
    {
      /*
       * The home page fold's stage (hero-stage, 5 November). While the
       * headline runs, each stream's photograph fills the stage as its word
       * finishes typing; then the stage settles into three bands, one per
       * stream, each a link to its stream page. The settled bands are what
       * the server renders, what shows without JavaScript and under reduced
       * motion, and the LCP.
       *
       * `focus` is the photograph's CSS object-position. The stage is tall
       * and each band is wide, so `cover` crops the same photograph two
       * ways; the focus is the point both crops keep.
       */
      name: 'heroPhotos',
      type: 'group',
      admin: {
        description:
          'The home page fold: one photograph per stream. Each fills the stage while its word is typed, then the three settle into bands that link to the stream pages.',
      },
      fields: (['software', 'robotics', 'websites'] as const).map((stream) => ({
        name: stream,
        type: 'group' as const,
        fields: [
          {
            type: 'row' as const,
            fields: [
              /* Not `required` at the database: a NOT NULL column cannot be
                 added to the existing row. src/data/ refuses to render
                 without all three, with a message naming the missing one. */
              { name: 'photo', type: 'upload' as const, relationTo: 'media' as const },
              {
                name: 'focus',
                type: 'text' as const,
                defaultValue: '50% 50%',
                admin: {
                  description:
                    'The point the crop keeps, as CSS object-position: "x% y%". 0% 0% is the top-left corner.',
                },
              },
            ],
          },
        ],
      })),
    },
    {
      name: 'workingPhoto',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'People at work, in the home page’s "why we work this way" section. Only people who are on the team, or alt text that says they are not.',
      },
    },
    {
      name: 'groupPhoto',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'The team together, full width under the /team heading. Empty renders nothing.',
      },
    },
    {
      name: 'comingSoon',
      type: 'array',
      admin: {
        description:
          'Named, real, not started. The quiet "Coming" row on /built. Move one to Projects once there is something to show.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'stream', type: 'relationship', relationTo: 'streams', required: true },
          ],
        },
      ],
    },
  ],
}
