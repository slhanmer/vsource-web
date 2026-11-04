# Log — cms

4 November. Branch `development` at `1acd8c1` (moves-layout committed and
pushed, as the brief requires). **Nothing from this brief has been changed in
the repo.** No dependencies were added and no files moved. Nothing has
connected to any database.

## Why it stopped: `DATABASE_URL` is not local

The brief's precondition is *"a local `DATABASE_URL` and a `PAYLOAD_SECRET`
in `.env.local`"*, with `docker-compose.yml` giving a local Postgres 17.

Both keys are present, and I read only the key names. But `DATABASE_URL`
points at a **remote Neon database**: host
`ep-silent-pine-a75o68p5.ap-southeast-2.aws.neon.tech`, database `neondb`,
user `neondb_owner` (shown with the password redacted).

That breaks the precondition, and it matters because of what the run does to
the database. It would:

- create the initial migration against it (A.6)
- create admin and editor users (A verify, and verify 2)
- create the schema for four collections and a global, and run a seed that
  upserts every entry and uploads every file to `media` (D)
- make test edits during verification: change Robotics' `door` text, upload a
  portrait for Ronan, publish and then unpublish `spider-drones`

From here I cannot tell whether this Neon database is a scratch dev branch or
the one production will use. The brief's own deployment rule is that preview
must never point at the production database. Writing schema and test content
into an unidentified Neon database is hard to undo, so I stopped, as the brief
says to. I also did not quietly override `DATABASE_URL` with a local one in
my shell. That would have worked, but the 3200 dev server reads `.env.local`,
so it would have been talking to a different database from the one my
migrations went into.

## What Simon needs to do (either one)

1. **Local, as the brief intends.** Put a local URL in `.env.local`. Note that
   ports **5432, 5433 and 5439 are already taken** on this machine by other
   repos' Postgres containers (`starter-db`, `starter-db-1`,
   `starter-modules-db-1`). The copied `docker-compose.yml` will need its own
   port. The starter's file supports that through `STARTER_DB_PORT`, which I
   would rename for this repo. For example:
   `DATABASE_URL=postgres://vsource:vsource@localhost:5440/vsource`.
   I then start it with `docker compose up -d db` in Stage A.5.
2. **Or confirm the Neon database is disposable.** Say it is a dev branch
   that will never be production, and I will run against it as it is.

Then re-run this brief from Stage A.

## Found while reading the starter (read only; nothing written there)

Recorded now so the next run does not rediscover them:

- **Versions to match:** `payload`, `@payloadcms/next`, `db-postgres`,
  `richtext-lexical` and `storage-vercel-blob` at `^3.88.0`;
  `@vercel/blob` `2.3.1`; `sharp` `^0.35.4`; `next` **16.3.3**;
  `react`/`react-dom` **19.2.8**. This repo is on `next ^16.2.11` and
  `react ^19.2.4`, so the bump is a minor version.
- `patches/@payloadcms__drizzle.patch` is wired through
  `pnpm.patchedDependencies` in the starter's `package.json`, as the brief
  expects.
- **Top-level await.** The starter is `"type": "module"`, and its
  `payload.config.ts` uses top-level `await` in exactly two places:
  `blocksForSite(siteConfig)` and `collectionsForSite(siteConfig)`. Both are
  page-builder pieces this brief does not copy, so the V Source config should
  need no `await`. I have not checked the starter's `scripts/*.mjs` and
  `src/db/*.ts` the same way yet.
- The starter's public route group is `(frontend)`. This brief names ours
  `(site)`. That is fine, but the copied `(payload)` files and
  `global-not-found.tsx` need their imports checked for `(frontend)` paths.
- The starter's deploy tests are vitest (`src/db/deploy-plan.test.ts`, plus
  `baseline-plan.test.ts`, which belongs to the baseline tooling the brief
  does not ask for). `deploy-plan` is the pure helper to port to jest.

## Also noted

- The brief says to create the first admin with `pnpm user`, run `pnpm seed`
  against prod at first deploy, and so on. None of that has started.
- The dev server on 3200 is up and unaffected. It is still the pre-Payload
  site.

STATUS: blocked

---

# Re-run from Stage A — 4 November (evening)

Brief updated by Simon: `DATABASE_URL` is the Neon **preview** branch on
purpose; no Docker. That cleared the earlier block. Started from `f5c1926`.

## Done so far (uncommitted, in the working tree)

- **Before screenshots** of 11 routes × 2 sizes × 2 themes:
  `C:\tmp\cms\before\` (44 files), from the build at `f5c1926`.
- **A.1 dependencies**, at the starter's resolved versions: `payload` and the
  four `@payloadcms/*` packages at 3.88.0 (spec `^3.88.0`, as the starter),
  `@vercel/blob` 2.3.1, `sharp` 0.35.4 (`^0.35.4`), `next` 16.3.3,
  `react`/`react-dom` 19.2.8.
- **The drizzle patch applies**, but not from where the starter keeps it.
  This repo runs pnpm 11, which no longer reads `pnpm.patchedDependencies` in
  `package.json` (the starter is pnpm 10). It is in `pnpm-workspace.yaml`
  instead, beside this repo's other pnpm settings. Verified: `insertArrays.js`
  in the installed `@payloadcms/drizzle` now carries the `uuidMap` line.
  `patches/` is copied with its README.
- **A.2 route groups:** everything except `robots.ts`, `sitemap.ts` and
  `api/` moved to `src/app/(site)/` with `git mv`. The document (fonts,
  `<html>`, theme script, JSON-LD, header, scroller, footer) is now
  `components/layouts/SiteDocument.tsx` (+ `fonts.ts`, `SiteProviders.tsx`),
  rendered by both `(site)/layout.tsx` and a new `app/global-not-found.tsx`,
  so an unmatched URL gets our 404 with our chrome. `(payload)/` copied from
  the starter.
- Checked: `withPayload` preserves our webpack function — it calls it first
  and spreads the result, extending only `externals`, `plugins` and `resolve`
  (`@payloadcms/next/dist/withPayload/withPayload.js:143`), so the SCSS token
  injection and svgr rule survive.

## Why it stopped: `next.config.ts` cannot be edited

A.3 needs `next.config.ts` wrapped in `withPayload`, plus the Blob
`remotePatterns` entry and `experimental.globalNotFound`. Both the shell edit
and the Edit tool were **refused by the permission settings**: the file is on
the deny list in `.claude/settings.json`, which I may not change. CLAUDE.md
says "`next.config.ts` only when the task is explicitly about it", and this
one is, but the settings don't make that exception. Without `withPayload`
there is no working `/admin`, so nothing after A.3 can be verified, and a
Stage A commit would not build and pass on its own. **Nothing is committed.**

The public site still runs from this tree on the 3200 dev server (Next
16.3.3): `/`, `/team`, `/built`, `/robotics`, `/built/project-arachnid` all
200; an unknown URL 404s (Next's default page until `globalNotFound` is on).

## What Simon needs to do (either)

1. Allow `Edit(next.config.ts)` in `.claude/settings.json` for this run, or
2. make the change by hand: import `withPayload` from
   `@payloadcms/next/withPayload`, `export default withPayload(nextConfig)`,
   and add to `nextConfig`:
   `images: { remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }] }`
   and `experimental: { globalNotFound: true }`.

Then re-run from A.3; A.1 and A.2 are in the working tree and do not need
redoing.

STATUS: blocked
