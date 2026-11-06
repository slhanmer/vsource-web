# prod-media-repair: make production media match its Blob store

URGENT. Production (`main`, Neon `main` branch, the production Blob store `store_tyTz3cBDMiljK6JD`) shows no images.

## What is wrong (measured on https://v-source.vercel.app)

- The site requests e.g. `https://tytz3cbdmiljk6jd.public.blob.vercel-storage.com/hero-software-stage-1.jpg`, which returns 404.
- The store HAS `hero-software-stage.jpg`, `hero-software-stage-400x400.jpg`, `at-the-desk.jpg` and `nug.jpg`, all without the suffix.
- The store does NOT have `snug.jpg`, `snug-400x250.jpg`, `qut.png` or `huntsman-walk.mp4`.
- So the production seed wrote many media rows with a `-1` filename suffix that their uploads don't have, and some uploads never happened. `pnpm media:blob` against production listed 30+ `MISSING public/media/*-1.*` (rows 1–13 and more).

## Fix

Simon supplies, in the shell only:
- `DATABASE_URL` = Neon `main`
- `BLOB_READ_WRITE_TOKEN` = the production store's token (Vercel → Storage → that store → `.env.local` → Show secret)

1. Read every row in the production `media` table: `filename` and every `sizes_*_filename`.
2. For each row, the true base name is the seed asset's filename, from `src/seed/content.ts` → `assets[key].file`, matched by the row's seed key or alt. Make the row's `filename` that base name, with no `-N` suffix, and the sizes `<base>-<w>x<h>.<ext>`, using the same size names and dimensions Payload generates.
3. For each resulting filename, `head()` the store. If it is missing, upload it: the original from `src/seed/assets/<file>`, and the sizes generated with sharp at the Media collection's configured sizes. Use `allowOverwrite: true` and no random suffix.
4. Fix the seed so this can't recur. When `BLOB_READ_WRITE_TOKEN` is set, the seed must reuse an existing row by base filename rather than create a `-1` row, and must fail loudly if an upload throws. Add a test.
5. Re-run `pnpm media:blob` (dry run) against production. Expect 0 missing.
6. Redeploy Production (an empty commit to `main` is fine) **only if** the image URLs are cached in the build. Otherwise the fix is live as soon as the rows change, because pages read the database.

## Verify

- Every `<img>` and `<video>` on `/`, `/software`, `/robotics`, `/websites`, `/built`, every project page, `/team` and `/contact` at https://v-source.vercel.app returns 200. Script it, and list any failures.
- The preview database and store are untouched.

End with `STATUS: done` or `STATUS: blocked — <why>`.
