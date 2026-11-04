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
