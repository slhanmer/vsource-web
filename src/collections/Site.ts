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
       * The home page fold's stage (hero-cards, 6 November): three stream
       * cards, one per stream, each a link to its stream page, from the first
       * paint. Each card shows its stream's square photograph WHOLE, in a 1:1
       * box: no cover crop, no position. If a crop is wrong, the fix is a new
       * file. (The 3:1 `band` files of hero-insets-2 are gone.)
       */
      name: 'heroPhotos',
      type: 'group',
      admin: {
        description:
          'The home page fold: one square photograph per stream, shown whole on its stream card. Crop the file; the site will not.',
      },
      fields: (['software', 'robotics', 'websites'] as const).map((stream) => ({
        name: stream,
        type: 'group' as const,
        fields: [
          /* Not `required` at the database: a NOT NULL column cannot be
             added to the existing row. src/data/ refuses to render without
             all three, with a message naming the missing one. */
          {
            name: 'photo',
            type: 'upload' as const,
            relationTo: 'media' as const,
            admin: {
              description: 'The stream card. Square, at least 1200×1200.',
            },
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
