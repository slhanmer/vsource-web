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
```

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
- Env vars live in Vercel, not the repo: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
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
- Copy marked `pending: true` or `placeholder: true` in a constants file is
  **unverified copy I invented**. It renders a visible marker. Do not remove the
  flag without replacing the words with something someone has confirmed.

---

# How the content is wired

The site is data-driven. Pages are templates; the words live in `src/constants/`.

| File | Drives |
|---|---|
| `streams.ts` | the home page moves **and** all three stream pages |
| `built.ts` | `/built` index, every project page, the "Coming" rail |
| `partners.ts` | the partners band |
| `crew.ts` | home team section and `/team` |
| `contact.ts` | header contacts, footer, contact page |

**Adding a fourth stream is a data change, not a new page.** `app/[stream]/`
generates all three from `STREAMS` with `dynamicParams = false`.

`STREAM_COMMON` in `streams.ts` is deliberate: hosting and ongoing support are
the same offer through any stream, so they are one shared list rather than the
same three paragraphs on three pages. Three near-identical pages compete with
each other for one search result. Do not "helpfully" expand it per stream.

`sitemap.ts` is generated from `STREAMS` and `BUILT`, so it stays true on its
own. Do not hand-maintain a URL list.

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

As of 2 November:

- All work is on `development`. The live site is still the 4 August build
  until the Vercel cutover.
- Invented copy still showing a marker: every `/built` entry and
  `/robotics` (Craig's). Both partner entries were confirmed by Simon on
  3 November (review-1). The full list is the Stage 4 audit in
  `docs/briefs/launch-ready.log.md`.
- Photos from the 2 November shoot are coming. Tom has no portrait,
  permanently. Group and working shots go in `src/constants/photos.ts`.
- Next after relaunch: Payload CMS (Neon Postgres, Vercel Blob media).
