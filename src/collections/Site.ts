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
       * The home page fold's photographs (review-2, 5 November). The photo
       * follows the headline: each stream's picture while its word is typed,
       * then the team, which stays. All four are 3:2 and share one frame.
       *
       * `team` is what the server renders, what shows without JavaScript and
       * under reduced motion, and what the fold settles on, so it is the LCP
       * and the one loaded with priority.
       */
      name: 'heroPhotos',
      type: 'group',
      admin: {
        description:
          'The home page fold: one 3:2 photograph per stream, shown while its word is typed, then the team photograph, which stays.',
      },
      fields: [
        /* Not `required` at the database: a NOT NULL column cannot be added
           to the existing row. src/data/ refuses to render without all
           four, with a message naming the missing one. */
        { name: 'software', type: 'upload', relationTo: 'media' },
        { name: 'robotics', type: 'upload', relationTo: 'media' },
        { name: 'websites', type: 'upload', relationTo: 'media' },
        {
          name: 'team',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Where the fold settles, and all that shows without motion.' },
        },
      ],
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
