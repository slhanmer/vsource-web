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
