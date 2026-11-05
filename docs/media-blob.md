# Moving this site's media to Vercel Blob

Adapted from the starter's `docs/media-blob.md` for this repo: one site, one
shared preview database, and `public/media/` gitignored rather than
committed.

Every media row created locally, by `pnpm seed` or an upload in a local
`/admin`, has its file in `public/media/` on that laptop and nowhere else. A
deployment with `BLOB_READ_WRITE_TOKEN` builds every image URL as a Blob URL
from the row's filename, so until the file is in that Blob store it is a
broken image. `pnpm media:blob` puts the files there.

## What it does

`pnpm media:blob [--run]` (`scripts/media-to-blob.mjs` → `src/db/media-blob.ts`):

- reads every media row in the database `DATABASE_URL` names (by default
  `.env.local`'s: the **preview** Neon branch);
- for each row's file, and each generated size (`thumb`, `card`, `wide`),
  checks the Blob store with `head`;
- **uploads only what is missing or a different size**. A file Blob already
  holds at the same size is skipped, so a rerun, or a run after an
  interrupted one, is safe;
- **writes nothing to the database.** The plugin builds the URL from the
  filename on every read, so uploading is the whole move;
- **without `--run` it is a dry run**: it lists what it would upload and
  writes nothing;
- exits 1 if a row names a file that isn't in `public/media/`. Each of those
  would be a broken image; fix it before relying on the store.

`NODE_ENV=production` is set by the wrapper so Payload cannot push schema at
the shared database.

## Steps (preview)

1. **Get the preview store's token.** Vercel → the project → Storage → the
   preview Blob store → the `.env.local` tab → copy `BLOB_READ_WRITE_TOKEN`.
   (`vercel env pull` writes `[encrypted]` for secrets, not the value.)
2. **Dry run, then upload**, from this repo, with the token in the shell for
   that command only:

   ```bash
   BLOB_READ_WRITE_TOKEN="<preview store token>" pnpm media:blob
   BLOB_READ_WRITE_TOKEN="<preview store token>" pnpm media:blob --run
   ```

   `DATABASE_URL` comes from `.env.local` (the preview branch). Do not put
   the token in `.env.local`: local dev must keep writing to `public/media/`.
3. **Redeploy the preview** (Vercel → Deployments → the latest preview →
   Redeploy, or push a commit).
4. **Check**: every `<img>` on the preview should load; image URLs go
   through `/_next/image` with a `blob.vercel-storage.com` source.

## Production, later

The same command against the production database and the production store:
`DATABASE_URL="<production string>" BLOB_READ_WRITE_TOKEN="<production
store token>" pnpm media:blob --run`. Only needed for rows created without
the production token; seeding production with its token set (DEPLOYMENT.md
§4) uploads straight to Blob.

## Afterwards

Anything seeded or uploaded locally into the preview database later is in
`public/media/` only. Rerun `pnpm media:blob --run` with the preview token
after each such change: it uploads only the new files.
