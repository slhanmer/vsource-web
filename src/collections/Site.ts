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
       * TWO FILES PER STREAM, CUT FOR THEIR SHAPES (hero-insets-2). One
       * photograph steered into a near-square window and a 3:1 band by a
       * single focus point never worked for both. So `photo` is the square
       * file for the run window and `band` the 3:1 file for the settled
       * band, each shown centred. If a crop is wrong, the fix is a new file,
       * never a position.
       */
      name: 'heroPhotos',
      type: 'group',
      admin: {
        description:
          'The home page fold: two files per stream. The square one fills the stage while its word is typed; then the three 3:1 ones settle into bands that link to the stream pages. Each is shown centred: crop the file, do not expect the site to.',
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
              {
                name: 'photo',
                type: 'upload' as const,
                relationTo: 'media' as const,
                admin: {
                  description:
                    'The run window, while the word is typed. Square, at least 1200×1200.',
                },
              },
              {
                name: 'band',
                type: 'upload' as const,
                relationTo: 'media' as const,
                admin: {
                  description:
                    'The settled band, a link to the stream page. 3:1, at least 1800×600.',
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
