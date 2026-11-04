# Brief — cms

**Run after `moves-layout` is committed.**
**Repo:** `V Souce Development` · **Branch:** `development`
**Push:** `development` only. **One commit per stage**, each building and
passing on its own.
**Read `CLAUDE.md` first.** Then read the starter at
`C:\Users\SLHan\Desktop\Dev\starter`: its `CLAUDE.md`, `payload.config.ts`,
`next.config.ts`, `docs/migrations.md`, `docs/media-blob.md`, and the files
named below. **Read only; never write to the starter.**

V Source moves to Vercel with Payload, the same way every site built from the
starter runs. The point is that copy and photos (Robotics copy, Mik's portraits,
the shoot photos) go in through `/admin` without a deploy.

**Rule for this brief: copy the starter's working pieces; don't redesign them.**
Where the starter has solved something (Blob uploads, migrations on deploy,
roles, cache invalidation), use its solution and its version numbers, and keep
its explanatory comments. What is *not* copied is the starter's page builder:
no `pages` collection, no blocks, no skins, no `site.config`. V Source's pages
stay as they are, written in code. Only their content moves to the database.

**Before starting:** `.env.local` has `DATABASE_URL` and `PAYLOAD_SECRET`. You
do not touch `.env*`. **`DATABASE_URL` is the Neon `preview` branch, on
purpose** (Simon, 4 November). That is how all his sites work: local development
and Vercel Preview share the preview database, and production has its own.
Migrating and seeding it is expected. It is never the production branch. Do not
add Docker or a local Postgres. Skip `docker-compose.yml` in A.5.

Where the brief does not match the code, stop and log it.

---

## Stage A — Payload in, with nothing moved yet

1. **Dependencies, matching the starter exactly:** `payload`, `@payloadcms/next`,
   `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`,
   `@payloadcms/storage-vercel-blob` and `@vercel/blob` at the starter's
   versions, plus `sharp`. Bump `next`, `react` and `react-dom` to the
   starter's exact versions. Copy `patches/@payloadcms__drizzle.patch` and its
   `pnpm.patchedDependencies` entry, with `patches/README.md`.
2. **Route groups.** Move everything under `src/app/` except `robots.ts`,
   `sitemap.ts` and `api/` into `src/app/(site)/`, and the root layout becomes
   `(site)/layout.tsx`. Copy `(payload)/` from the starter: `layout.tsx`,
   `custom.css`, `admin/[[...segments]]`, `admin/importMap.js`, `api/[...slug]`,
   `api/graphql*`. Add `global-not-found.tsx` and
   `experimental.globalNotFound` as the starter does, rendering **our** 404
   (same component, same chrome).
3. **`next.config.ts`:** wrap it in `withPayload`. **Keep the `--webpack` flags
   and the SCSS token injection**, and confirm `withPayload` preserves our
   `webpack` function (log how). Add the starter's
   `images.remotePatterns` entry for `*.public.blob.vercel-storage.com`.
   `tsconfig.json`: add `@payload-config`.
4. **`payload.config.ts`** at the repo root, modelled on the starter's:
   - The `users` collection with roles and access copied from the starter's
     `src/lib/access.ts` (only what we use: `isAdmin`, `isSignedIn`,
     `isAdminOrSelf`, `isAdminField`, `ROLES`).
   - The `media` collection exactly as the starter has it (Blob plugin
     settings, the `afterRead` hook, delete admin-only, `alt` required,
     `imageSizes`), except that `mimeTypes` also allows `video/mp4`.
   - `push: process.env.PAYLOAD_PUSH === '1'`, `sharp`, and `admin.dependencies`
     pinning the Blob upload handler.
   - No top-level `await`: this repo is not `"type": "module"`. If a piece of
     the starter's config needs it, log it and adapt.
5. **Migrations and deploy**, copied from the starter: `scripts/deploy-build.mjs`,
   `scripts/lib/deploy.mjs`, `src/db/deploy-migrate.ts`, `src/db/deploy-plan.ts`,
   `scripts/user.mjs`, and `vercel.json` with `"buildCommand": "pnpm build:deploy"`.
   Add the `build:deploy`, `user` and `payload` scripts. The starter's tests for
   these are vitest. **Port the pure-helper tests to jest**; skip the rest and
   say which.
6. Create the **initial migration** against the local database
   (`pnpm payload migrate:create initial`).

Verify: `pnpm build` passes, `/admin` loads locally, you can create the first
admin user with `pnpm user`, and every public page is visually unchanged
(screenshot diff of `/`, `/team`, `/built`, `/software` before and after).
Commit.

## Stage B — collections that mirror the constants

**Field names match the constants' property names exactly**, so the front end,
types and database all use the same words (Simon's standing rule). Payload
reserves `id`, so the constants' `id` becomes **`slug`** everywhere, front end
included (`Stream.id` → `Stream.slug`, and so on). `built.ts` already uses
`slug`.

Every collection gets an `order` number (the admin sorts by it, and so does
the site). Editors update; only admins create or delete (the starter's
"composition is ours, content is theirs").

| collection | mirrors | notes |
|---|---|---|
| `streams` | `Stream` in `streams.ts` | Every field, including `caps`, `proof`, `pricing` and `sections`, plus `pending` flags. `door` and `step` photos become **upload** fields (`doorPhoto`, `stepPhoto`) to `media`. `href` is derived from `slug`, not stored. |
| `projects` | `Project` in `built.ts` | Every field. `media` becomes a group: `kind`, `upload` (image or video), `poster` (upload), `markId`, `alt`, `long`. **`versions: { drafts: true }`**: a draft is not on the site. |
| `crew` | `CrewMember` | `bio` as an array of paragraphs, `portrait` as an optional upload. `stockPortrait` is gone (see Stage D). |
| `partners` | `Partner` | `logo` as an upload. |

**Global `site`:** `workingPhoto` (upload) and `comingSoon` (array of
`{ name, stream }`).

**Stays in code**, because a bad edit there is a factual or legal problem
rather than bad copy: `landings.ts` (`/regulated`, `/accessibility`),
`STREAM_COMMON`, `contact.ts`, and the headline words. Say so in `CLAUDE.md`.

Generate `payload-types.ts` and a migration. Commit.

## Stage C — the site reads from Payload

- A small data layer (`src/data/`): one cached getter per collection
  (`unstable_cache`, one tag `content`), the same shape as the constants it
  replaces, so components change as little as possible. Cache invalidation is
  the starter's `withPageRevalidation` pattern (`src/lib/revalidate.ts`), with
  our tag, attached to every collection but `users`, and to the global.
- Pages stay statically rendered: `generateStaticParams` for `[stream]` and
  `built/[slug]` comes from the database, and saves revalidate the tag. Set
  `dynamicParams` to `true` on `built/[slug]` so a newly published project
  works without a deploy. Unknown slugs still 404.
- `sitemap.ts` reads from the database, so it stays true on its own.
- Photos render through `next/image` from the Blob URLs. `CutPhoto`, portraits,
  logos and project media all take the media document's `url`, `alt`, `width`
  and `height`. `photos.ts` is removed.
- Order everywhere comes from `order`.

## Stage D — seed, then retire the constants

- `pnpm seed` (`payload run`): idempotent, upserting by `slug`. It loads every
  current entry and uploads every file it references into `media`: the stock
  photos, venue screenshots, partner logos, Asuka's portrait and the drone clip
  and poster.
  - **Craig's, Simon's and Ronan's stock stand-ins are NOT seeded.** Their
    `portrait` is empty, so they show the terminal tile until Mik's photos are
    uploaded through the admin. That retires the `stockPortrait` guard; remove
    it and its test.
  - **`spider-drones` is seeded as a draft**, so it is off the site until Craig
    confirms the footage. Don Gino becomes the lead project (`featured`).
- The seed data lives in `src/seed/`. **Delete the runtime constants**
  (`streams.ts` apart from `STREAM_COMMON`, `built.ts`, `crew.ts`,
  `partners.ts`, `photos.ts`) once nothing imports them, so there is exactly
  one source of truth.
- Commit.

## Stage E — docs

- `CLAUDE.md`: a CMS section (what lives where and why, the
  blast-radius line, editors vs admins, migrations-only, `pnpm user`,
  `pnpm seed`), and update "How the content is wired" and "Current state".
- `docs/DEPLOYMENT.md`: replace it with the Vercel + Neon + Blob setup. The env
  vars per environment are `DATABASE_URL`, `PAYLOAD_SECRET`,
  `BLOB_READ_WRITE_TOKEN` and `NEXT_PUBLIC_SITE_URL`, plus the existing Resend
  and Turnstile vars. Include the starter's rule that **Preview deployments
  must never point at the production database** (a separate Neon branch).
  Also: the first-deploy order (env → deploy → `pnpm seed` against prod →
  `pnpm user` → upload real portraits), and the DNS note (apex and `www` only;
  Resend's records stay).
- Commit.

---

## Verify (end of run, local, against the seeded local database)

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. Every public route renders the same as before the run, apart from the three
   stand-in portraits, now terminal tiles, and spider drones being gone.
   Screenshot diff `/`, `/team`, `/built`, `/robotics`, `/software` and
   `/websites` at 1440 and 390.
2. In `/admin` as an **editor**: change Robotics' `door` text and upload a
   portrait for Ronan. Both appear on the next page load without a rebuild.
   An editor cannot create or delete a project.
3. Publish `spider-drones` as an admin: it appears on `/built` and at
   `/built/spider-drones` without a rebuild. Unpublish it again.
4. `VERCEL_ENV=production pnpm build:deploy` with a bad `DATABASE_URL` refuses
   with the starter's message.
5. axe on every sitemap route plus the 404, light and dark: 0 violations.

Screenshots go to `C:\tmp\cms\`.

## The log

Append to `docs/briefs/cms.log.md`. Record any starter piece you could not copy
as-is and why. Last line exactly one of `STATUS: done`, `STATUS: partial`,
`STATUS: blocked`.
