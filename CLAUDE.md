# V Source — marketing site

## What this is

The public marketing site for **V Source Development**, a Brisbane software
company. Live at `https://www.vsource.dev`.

This repo was **seeded from the Aptium portal** in August and stripped back to a
marketing shell, keeping the ui-kit and the token system. Some scaffolding from
that origin is still present (`src/features/`, `src/services/`, `src/stores/`,
tenant-era naming). **Nothing in this repo is the Aptium portal, is regulated,
or touches patient or device data.** If a file or comment reads as though it
belongs to a medical product, it is residue — flag it, do not build on it.

Aptium is a *client*, described on this site. That is the whole relationship.

## Stack

- Next.js **16** (App Router) · React **19** · TypeScript
- Plain **SCSS**, not CSS modules
- **pnpm** (11.x, pinned via `packageManager`)
- Custom in-house ui-kit at `src/components/ui-kit` — no Tailwind, no MUI, no
  component library. Do not add one.
- `output: 'standalone'` — deployed as a self-contained Node server
- `next/font` (Google, self-hosted at build time)

## Commands

```bash
pnpm dev          # localhost:3000
pnpm build        # the real check
pnpm lint         # eslint
pnpm test:ci      # jest, non-watch
pnpm verify       # install --frozen-lockfile && lint:ci && test:ci && build
pnpm seed         # load src/seed/content.ts into DATABASE_URL (idempotent)
pnpm user <email> [admin|editor] --generate   # create an /admin account
pnpm payload ...  # the Payload CLI (migrate:create, generate:types, run)
```

`pnpm build` reads the database: every public page is rendered from Payload.
It needs `DATABASE_URL` (in `.env.local`, the Neon preview branch) and a
seeded database.

`dev` and `build` both pass **`--webpack`** deliberately. Next 16 defaults to
Turbopack; this project cannot use it, because the SCSS token injection in
`next.config.ts` patches a webpack loader's `additionalData`, and `@svgr/webpack`
is wired the same way. **Do not remove the `--webpack` flags** to "modernise" the
scripts — the build will stop injecting tokens and every SCSS file will fail on
an undefined variable.

Anything written to this repo by a tool outside the dev server (a file bridge, a
sync) needs `pnpm dev` restarted before it is picked up. `next/font` changes
always need a restart.

## Permissions

Enforced in `.claude/settings.json`; this is the plain-English version.

- **Work on a feature branch.** Cut it, stage, commit, stash, delete dead files
  with `git rm` — all of that is yours.
- **Push to `development`, and nowhere else.** That is the one branch on the
  allow list. `main`, `staging` and `production` are denied, as is force-push.
  Cut `development` off `main` if it does not exist yet.
- **Merging is Simon's, always**, and so is every promotion up the chain.
  Finish on `development`, say so in the log, and leave it there.
- **History is not yours to rewrite.** No rebase, no `reset --hard`, no
  `clean`, no `filter-branch`.
- Never touch `.env*`, `.github/`, or `.claude/`.
- `next.config.ts` only when the task is explicitly about it.

## Deployment — how this site ships

- **Vercel**, from GitHub. Production branch is `main`; every push to
  `development` gets a preview deploy. Promotion is Simon merging
  `development` into `main`, and nobody else.
- Env vars live in Vercel, not the repo: `DATABASE_URL`, `PAYLOAD_SECRET`,
  `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`,
  `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `TURNSTILE_SECRET_KEY`,
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. **Preview never points at the production
  database.** The full setup, and the first-deploy order, is in
  `docs/DEPLOYMENT.md`.
  `NEXT_PUBLIC_*` values are compiled in at build. After changing one,
  redeploy, then check the Turnstile widget actually renders on `/contact`. A
  missing key errors nowhere; the widget is simply absent.
- Images are optimised by Vercel. Do not add `unoptimized`. Export sources at
  the size given where each image is wired up (portraits 1200×1500).
- DNS: only the apex and `www` point at Vercel. The `send.vsource.dev` DKIM, SPF
  and MX records are Resend's and stay in Hostinger. Moving them stops the
  contact form sending.
- The `Dockerfile`, `output: 'standalone'` and the `development → staging →
  production` workflow are left over from Coolify and the Aptium seed. Vercel
  ignores them. Do not build on them.
- This site being on Vercel does not contradict the "hosted on our own hardware,
  in Australia" copy. That hardware is for client software, which this site
  is not.

## Imports

Path aliases are defined in both `tsconfig.json` and `next.config.ts` and must
stay in sync. Use them; do not write deep relative paths.

`@/*` `@components` `@styles` `@hooks` `@utils` `@types` `@stores` `@constants`
`@providers` `@configs` `@features` `@services` `@assets` `@images` `@icons`

`@tokens` resolves to `src/styles/_tokens.scss` and is for the SCSS injection
only.

---

# The two rules that break things silently

## 1. The scroller is `#main`, never the window

The shell is `html { overflow: hidden }` → `.site-frame` (flex column) → header
→ `.site-scroll` → `#main.page-container.site-shell`.

**`#main` is the element that scrolls.** Any `IntersectionObserver` must pass it
as `root`. An observer left on the default root watches the viewport, which never
scrolls, so every entry fires once on mount and never again — the symptom is
"the animation plays immediately and then nothing ever reveals". Same for
`scroll` listeners and any scroll-position maths.

`.page-container` also sets `scrollbar-gutter: stable`, so a full-bleed bar
rendered *inside* the scroller is visibly short on the right. Full-bleed chrome
belongs outside it.

## 2. `$line-height-*` tokens are absolute pixel values

`$line-height-tight` is **`14px`**, not `1.14`. Setting it on anything above
~14px type lays the lines on top of each other. They happen to work on 16–17px
body copy, where 24px reads as ≈1.5, and nowhere else.

Write an explicit unitless ratio for headings. Existing uses were converted to
ratios on 2 November, except three whose font size is a `clamp()` or inherited.
Do not add new uses.

---

# Design language

The site is **machined metal**: a plate with things cut into it and raised out of
it. Light comes **from above**, consistently, everywhere.

- **Recessed** = darker fill, light catching the *lower* inner rim
  (`inset 0 3px 8px -3px var(--carve-dark), inset 0 -1px 0 var(--carve-lip)`)
- **Raised** = lighter fill, light on the *top* edge
- **No drop shadows.** Depth is edge treatment, not a shadow under a card. If
  something needs to read as separate, cut it in or raise it — do not float it.

## Colour

Two brand colours, both swapped by theme in `src/styles/global.scss`:

| Token | Light | Dark |
|---|---|---|
| `--brand-accent` (green) | `#215c30` | `#4fb56c` |
| `--brand-highlight` (teal) | `#13696b` | `#1edcea` |

The light teal is **not** the neon. `#19a5a8` measures 2.86:1 as text on the
light page and fails WCAG 1.4.3; `#13696b` was derived to pass against the
darkest surface it sits on. Do not "restore" the brighter value on light.

**Cyan points, green acts.** `--route-active` (teal) for navigation and anything
that merely indicates. `--action-primary` (green) for anything that commits.
**Headings are never coloured.**

Never hardcode a hex. Every colour, space, radius and font comes from a token;
tokens are injected globally, so never `@use` or `@import` them in a file.

## Type

| Token | Family | Role |
|---|---|---|
| `$font-family-read` | Newsreader | headlines and body — the reading face |
| `$font-family-display` | Chakra Petch | section headings, buttons, project titles |
| `$font-family-ui` | IBM Plex Sans | interface text |
| `$font-family-mono` | IBM Plex Mono | eyebrows, readouts, status labels |

## Accessibility — WCAG 2.2 AA is the floor, not a pass

It is also the thing the Websites stream sells, so the site failing it is a
business problem, not a lint warning.

- **2.2.2** — anything that auto-animates for more than 5s needs a visible,
  keyboard-reachable pause control. Every `/built` video has one. The rotating
  headline has none because it plays once and stops inside five seconds — keep
  it that way. Do not add motion without one.
- **2.5.8** — 24px minimum target, with the inline exception for targets sitting
  in a line of text.
- Honour `prefers-reduced-motion`. Use `useReducedMotion` from `@hooks`.
- Controls must be findable without hovering. A control that only appears on
  hover does not exist for a keyboard user.

---

# Content rules

These are commitments, not preferences. Breaking one is a factual or legal
problem, not a style note.

- **"Class A" appears nowhere.** The claim about Aptium is **TGA-regulated**.
  `IEC 62304` is fine — it is a standard, not a classification.
- **Nobody here is called an engineer.** Queensland regulates who may provide
  "professional engineering services" (Professional Engineers Act 2002, BPEQ)
  and nobody at V Source is RPEQ-registered. The same goes for the offer: the
  stream is **Robotics**, not Engineering, because a stream called
  Engineering offers the regulated service. Do not rename it back.
- **The phone number appears twice, deliberately:** the header contacts and
  `/contact`. It was pulled off the home page fold and the home page close
  because three copies of one number on a screen is clutter, not availability —
  not because the number is secret. It is also in the Organization JSON-LD in
  `layout.tsx`, which is correct for local search. Do not add it to a page body.
- Copy marked `pending` or `placeholder` (a checkbox in `/admin`, or a flag in
  `src/seed/content.ts` and `landings.ts`) is **unverified copy I invented**. It renders a visible marker. Do not remove the
  flag without replacing the words with something someone has confirmed.

---

# How the content is wired

The site is data-driven. Pages are templates. Most of the words and every
photograph are in **Payload** (see CMS below), and a few are in code.

| Where | Drives |
|---|---|
| `streams` collection | the home page's "What changes" rows, **and** all three stream pages: the head photo (`pagePhoto`) and each section's optional `media` |
| `projects` collection | `/built`, every project page, the projects under each stream. Media kinds `image` (with `fit: cover \| contain`), `video`, `logo`, `mark` (unused) |
| `crew` collection | home team section and `/team` |
| `partners` collection | the fold's "Working with" strip and the partners band |
| `site` global | the home fold photos (`heroPhotos`: software, robotics, websites, team), the home "why" photo, the `/team` group photo, the "Coming soon" row |
| `src/constants/contact.ts` | header contacts, footer, contact page |
| `src/constants/landings.ts` | `/regulated` and `/accessibility` |
| `src/constants/streams.ts` | `STREAM_COMMON` only |

Pages read content through `src/data/`, never Payload directly: cached getters
that return plain shapes (`src/data/types.ts`), with every image as a `Photo`
(`src`, `alt`, `width`, `height`).

**Adding a fourth stream is a data change, not a new page.** `app/(site)/[stream]/`
generates every stream from the `streams` collection, with no redeploy. It
does need a stream mark in `StreamMark`, which is drawn in code.

⚠ **`dynamicParams` stays `true` on `[stream]` and `built/[slug]`.** With
`false`, a save in `/admin` invalidates the `content` tag, and Next then
404s every prerendered page in that route (`NoFallbackError`) until the next
deploy. Unknown slugs 404 through the page's own `notFound()`.

`STREAM_COMMON` in `streams.ts` is deliberate: hosting and ongoing support are
the same offer through any stream, so they are one shared list rather than the
same three paragraphs on three pages. Three near-identical pages compete with
each other for one search result. Do not "helpfully" expand it per stream.

`sitemap.ts` is generated from the same getters, so it stays true on its own.
Do not hand-maintain a URL list.

## CMS — Payload

`/admin`, Payload 3 on Neon Postgres, media in Vercel Blob. Config is
`payload.config.ts` and the collections are in `src/collections/`.

- **What lives where, and why.** Copy and photographs are in the database, so
  they change without a deploy. **What stays in code is the blast-radius
  line:** anything where a bad edit is a factual or legal problem rather than
  bad copy. That covers `landings.ts` (the regulatory and accessibility
  claims), `STREAM_COMMON` (the hosting claim), `contact.ts`, and the
  headline words. Keep it that way. Do not move them into the admin.
- **Editors vs admins.** Editors change words and photographs on what exists.
  Admins also create and delete streams, projects, people and partners,
  change slugs, and manage accounts ("composition is ours, content is
  theirs"). Media delete is admin-only.
- **Drafts.** Projects have drafts. A draft is in the admin only, and a
  published project appears on `/built` and at `/built/<slug>` without a
  deploy (`dynamicParams` is on there).
- **Saves are live on the next load.** Every collection but `users`, and the
  `site` global, clears the `content` cache tag on save
  (`src/lib/revalidate.ts`).
- **Migrations only.** Schema changes go through
  `pnpm payload migrate:create <name>` into `src/db/migrations`, and deploys
  apply them (`pnpm build:deploy`). Dev push is off unless `PAYLOAD_PUSH=1`,
  for a throwaway database only. Never set it here: local and preview share
  one Neon branch.
- **`pnpm user`** creates accounts on whatever `DATABASE_URL` names. It prints
  a generated password once and never stores it.
- **`pnpm seed`** loads `src/seed/content.ts`, with files from
  `src/seed/assets/`. It is idempotent: it writes only what differs. It
  **refuses** to overwrite a row edited in `/admin` since it last wrote it,
  and lists the rows (`--force` overrides). Once the site has been edited
  in the admin, the database is the source of truth and `content.ts` is
  history.
- **Module format.** The repo is CommonJS (`next.config.ts` uses
  `__dirname`), but the Payload CLI needs ESM. So `src/lib`, `src/db`,
  `src/seed` and `src/collections` each carry a `{"type": "module"}`
  `package.json`, and CLI scripts load the config through
  `src/db/load-config.ts`. Code those folders import from Next must import
  `next/cache.js`, not `next/cache`. There is no rich-text editor:
  `richtext-lexical` uses top-level await, which this setup cannot load.

## Routes

`/` · `/software` · `/robotics` · `/websites` · `/built` · `/built/[slug]` ·
`/team` · `/contact`

Permanent redirects (308) in `next.config.ts`: `/work` → `/built`, `/services` → `/`, `/crew` → `/team`.

`src/constants/work.ts` stays: `CASE_STUDY` is raw material for the real
Aptium write-up.

## Layout rules that are not arbitrary

- **Team cards go into a row the team divides into**, so nobody is stranded
  alone on a second row looking like they resigned. That is the whole rule; the
  column counts follow from the headcount and must be rechecked whenever it
  changes. At five people: home teaser **5 → 3 → 1**, `/team` **3 → 1**. Two
  and four are both skipped — each gives an orphan at five. The two pages
  differ because the teaser carries a one-line summary and `/team` carries the
  full bio, which needs roughly 55 characters a line rather than 30.
- Portrait boxes are 4:5 and the **same size with or without a photograph**, so
  the page does not reflow on the day the photos land. Photographs go in in
  colour, with no tone layer. Depth comes from the recessed edge.

---

# Known traps in this codebase

Each of these cost real time. They look like style nits and are not.

1. **A `<button>` does not inherit its font.** `em` units inside one resolve
   against the browser default (~13.3px), not the parent's size. Set
   `font-size: inherit` before using `em` for anything positional.
2. **`.basic-button` anchors must be `display: inline-flex`.** As `display:
   inline` they silently ignore `width` and `height`, and the label will not
   vertically centre.
3. **A flex *item* shrink-wraps.** `justify-content: space-between` on a child
   does nothing until that child has `flex: 1 1 auto`.
4. **`overflow` on an inline-block moves its baseline** to the bottom margin edge
   (CSS 2.1 §10.8.1). Use `clip-path` to clip without touching layout.
5. **Centring text in a box: centre the cap band, not the ink box.** Descenders
   hang below the band the eye reads, so centring the full ink box always reads
   high. Use `text-box-trim: trim-both` + `text-box-edge: cap alphabetic`, with a
   hand-calibrated padding fallback for older engines. Do not hand-tune — the
   asymmetry moves with font size and optical size.
6. **`pathLength` is an SVG attribute.** Setting it from CSS does nothing.

---

# Current state — read before starting

As of 5 November:

- All work is on `development`. The live site is still the 4 August build
  until the Vercel cutover, and that cutover now needs the database steps in
  `docs/DEPLOYMENT.md` §4.
- **Content is in Payload** (cms brief, stages A–E). The preview Neon branch is
  migrated and seeded. `src/constants/built.ts`, `crew.ts`, `partners.ts` and
  `photos.ts` are gone.
- **The fold** (hero-rebuild, then review-2, 5 November): the message on the
  left (the rotating headline at two thirds of its old size, the lede and sub
  copy, **Start a conversation** and **See what we've built**). On the right
  is a 3:2 photo frame that **follows the headline**: each stream's photo as
  its word finishes typing, then the team photo, which stays. Under it are
  the three streams as links (`Software · Robotics · Websites`), the current
  one lit in `--route-active`. That row is what shows the streams above the
  fold, so it is usable from the first paint. One timeline drives it all
  (`headlineTimeline.ts` → `HeroRun.tsx` → `HeroFrame.tsx`), and the run is
  under 4.5 s. The server render, no JS and reduced motion show the team
  photo with no link lit. Narrow screens: frame and links first. **The copy
  is never shrunk to fit.**
- **Stream pages** open with a photograph (`pagePhoto`), not a line drawing.
  Sections with `media` (an image, or an mp4 under 10 s with a poster and a
  pause control) are two columns, alternating sides. `StreamMark` is now only
  on the `/regulated` and `/accessibility` landing pages.
- The mill lines on the fold bend round the cursor wherever it rests on the
  plate (`MillLines.tsx`). Nothing runs on touch or under reduced motion.
- Robotics copy is in (Simon, 4 November). Project Arachnid leads `/built`
  with The Huntsman's walking clip, and `spider-drones` is gone. The Websites
  row shows our own Nug site, cropped for its slot and anchored to the top so
  the wordmark is never cut.
- `/built` is five cards, every one with a real image (built-trim, then
  review-2): Project Arachnid (lead), the Aptium portal (its logo at 60% of a
  light plate, media kind `logo`, because the screens are under NDA), Training
  Professionals, SAUCE (a Storybook sheet, `Showcase/Overview`), and Five
  Brisbane venues, which lists the five venue sites on its page. Each card is
  a raised plate. Screenshots use `fit: 'contain'`, so they are never cropped.
  The grid is two columns, so four cards never leave an orphan. Recheck it
  when the count changes.
- Nothing is flagged `placeholder` or `pending` anywhere.
- Real portraits from Mik's shoot for Craig, Simon and Ronan; Asuka's as
  before. Tom has no portrait, permanently: the terminal tile is his. The
  group shot is on `/team` and is the home page's "Why we work this way"
  photo, and Software's "What changes" photo is `pointing.jpg`, also from the
  shoot. No stock photograph is left anywhere on the site.
- Preview deployments will show broken images until the seeded media is in the
  preview Blob store (`docs/DEPLOYMENT.md` §5).
- Further photographs go in through `/admin`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
