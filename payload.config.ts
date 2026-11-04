import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig, type CollectionConfig } from 'payload'
import sharp from 'sharp'

import { isAdmin, isAdminField, isAdminOrSelf, isSignedIn, ROLES } from './src/lib/access'

/*
 * Payload for the V Source site, modelled on the starter's payload.config.ts.
 *
 * What is copied: the users collection and its roles, the media collection
 * (Blob storage, the static-URL hook, admin-only delete), migrations-only
 * schema changes, and the admin import-map pin. What is not: the starter's
 * page builder — no `pages`, no blocks, no skins, no site.config. This site's
 * pages are written in code; only their content lives here.
 *
 * ⚠ NO import.meta, NO TOP-LEVEL await. This repo is not "type": "module", so
 * the Payload CLI (`payload migrate`, `payload run`) loads this file as
 * CommonJS, where neither exists. The starter derives its directory from
 * import.meta.url; here it is the working directory, which is the repo root
 * for `next`, for every `pnpm` script and for Vercel's build alike.
 */
const dirname = path.resolve(process.cwd())

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    /*
     * ⚠️ NO DEV PUSH UNLESS ASKED FOR. Payload's default rewrites the database
     * to match the config on every connect outside production — `pnpm dev`,
     * `pnpm seed`, `payload run`. That is how every client database was built,
     * and it is why none of them could take a migration: the schema was
     * whatever the last laptop to connect had in its config.
     *
     * Migrations in src/migrations are the record. `PAYLOAD_PUSH=1` turns push
     * back on for a throwaway database only. Never set it against this site's
     * databases — the local and preview database here is a shared Neon branch.
     */
    push: process.env.PAYLOAD_PUSH === '1',
    /*
     * src/db/migrations, not the starter's src/migrations. The Payload CLI
     * loads migrations as ESM only under a {"type": "module"} package.json
     * (see src/db/package.json and CLAUDE.md), and migrate:create would read
     * a package.json inside the migrations folder itself as a schema snapshot.
     * So they live under src/db, whose marker already covers them.
     */
    migrationDir: path.resolve(dirname, 'src/db/migrations'),
  }),
  /*
   * NO RICH-TEXT EDITOR — a deliberate deviation from the starter. Nothing on
   * this site is rich text: every field mirrors a plain string or a list of
   * paragraphs in the old constants. And @payloadcms/richtext-lexical's
   * entry point uses top-level await, which cannot be loaded by the Payload
   * CLI in a repo that is not "type": "module" (ERR_REQUIRE_ASYNC_MODULE on
   * `payload migrate:create`). The package stays installed at the starter's
   * version; add `editor: lexicalEditor()` back the day a richText field is
   * needed, and solve the module question then.
   */
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      /*
       * read and update are scoped to self for anyone who is not an admin.
       * Left at Payload's default they permit any signed-in user, which lets an
       * editor open the other accounts on the site.
       */
      access: {
        create: isAdmin,
        delete: isAdmin,
        read: isAdminOrSelf,
        update: isAdminOrSelf,
      },
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'editor',
          options: [...ROLES],
          // Self-update would otherwise be a promotion route.
          access: { create: isAdminField, update: isAdminField },
          admin: {
            description:
              'admin creates and deletes entries and manages accounts. editor changes copy and images only.',
          },
        },
      ],
    },
    {
      slug: 'media',
      /*
       * ⚠️ DELETE IS ADMIN-ONLY. Left at Payload's default, any signed-in user
       * could delete a photograph a page is showing, and the page would
       * carry on pointing at nothing. An editor replaces a photograph by
       * uploading a new one and choosing it; the old one stays until an admin
       * tidies up.
       */
      access: { read: () => true, create: isSignedIn, update: isSignedIn, delete: isAdmin },
      /*
       * WHERE THE FILES LIVE, AND WHY THERE ARE TWO ANSWERS.
       *
       * With BLOB_READ_WRITE_TOKEN set (every Vercel deployment), the
       * vercelBlobStorage plugin below takes over: uploads go to the project's
       * Blob store and `url` is the Blob CDN address. That is what makes an
       * upload in the admin work on Vercel at all — a serverless function's
       * filesystem is read-only and gone after the request, so a file written
       * to public/media there never existed for the next one.
       *
       * Without the token (local dev, CI), files go to public/media and this
       * hook rewrites Payload's /api/media/file/<name> to /media/<name>, so they
       * are served as static files rather than through a function. On a Blob
       * site the URLs are absolute and the hook is a no-op.
       */
      hooks: {
        afterRead: [
          ({ doc }) => {
            const staticUrl = (url: unknown) =>
              typeof url === 'string' ? url.replace(/^\/api\/media\/file\//, '/media/') : url

            doc.url = staticUrl(doc.url)
            for (const size of Object.values(doc.sizes ?? {})) {
              if (size && typeof size === 'object') {
                ;(size as { url?: unknown }).url = staticUrl((size as { url?: unknown }).url)
              }
            }
            return doc
          },
        ],
      },
      upload: {
        staticDir: path.resolve(dirname, 'public/media'),
        // The starter's image-only list, plus mp4: /built carries short,
        // muted, self-hosted clips (see the media rule in the projects data).
        mimeTypes: ['image/*', 'video/mp4'],
        imageSizes: [
          { name: 'thumb', width: 400 },
          { name: 'card', width: 900 },
          { name: 'wide', width: 1800 },
        ],
      },
      fields: [{ name: 'alt', type: 'text', required: true }],
    },
  ] satisfies CollectionConfig[],
  admin: {
    user: 'users',
    /*
     * ⚠️ ALWAYS IN THE IMPORT MAP, TOKEN OR NOT. The plugin only registers its
     * browser upload handler when it is enabled, and `next dev` regenerates the
     * import map from the running config — so a local session without a token
     * would delete the entry, and a deployment with one would ask for a
     * component the committed map does not have. Listing it here pins it.
     */
    dependencies: {
      vercelBlobClientUploadHandler: {
        type: 'component',
        path: '@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler',
      },
    },
  },
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
  sharp,
  plugins: [
    /*
     * MEDIA IN VERCEL BLOB when the token is set, local disk otherwise — see
     * the note on the media collection.
     *
     * ⚠️ `alwaysInsertFields`: the plugin adds a `prefix` column to media. Left
     * to the default it only does so when enabled, so the schema would differ
     * between an environment with a token and one without, and a migration
     * generated on one would not match the other.
     *
     * `disablePayloadAccessControl`: `url` is the Blob CDN address rather than
     * Payload's /api/media/file route, which would proxy every photograph
     * through a function. Media is public-read already, so nothing is lost.
     *
     * `clientUploads`: the browser uploads straight to Blob. Vercel caps a
     * function's request body at 4.5MB, and a photograph off a phone is often
     * more than that.
     */
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      alwaysInsertFields: true,
      clientUploads: true,
      /*
       * ⚠️ `prefix: ''` IS NOT A NO-OP. In 3.88 `alwaysInsertFields` only
       * reaches the DISABLED path; enabled, the plugin adds the `prefix`
       * column only when the collection names a prefix. Without this an
       * environment with a token and one without have different media tables.
       * An empty prefix still keys every file by its bare filename.
       */
      collections: { media: { disablePayloadAccessControl: true, prefix: '' } },
    }),
  ],
  cors: {
    origins: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
  },
})
