# Brief — launch-polish

**Repo:** `V Souce Development` · **Branch:** `development` (HEAD `62aecdd`)
**Push:** `development` only. **One commit** for stages 1–2, one for stage 3.
**Read `CLAUDE.md` first.**

Follows `launch-ready`. Everything here comes out of that run's Stage 4 audit.
Where the brief does not match the code, stop and log it.

**Out of scope:** where the `working` photo sits in "why we work this way" (Simon
is reviewing it by eye), `crew__bio` line-height, and all invented copy.

---

## Stage 1 — content

1. `crew.ts`, Tom Lee: `role` becomes **`Backend & Platform Developer`**. Check
   the `/team` Person JSON-LD `jobTitle` picks it up from there, with no second
   copy anywhere.
2. `built.ts`, `don-gino`: `url` becomes **`https://dongino.com.au/`**. Simon has
   confirmed it is the right site. Nothing else in that entry changes.

---

## Stage 2 — accessibility and images

### 2.1 `#main` must be keyboard-scrollable on every page

`#main` (`layout.tsx:170`) is the scroller, and it has `tabIndex={-1}`. On
`/team` nothing inside it can take focus, so the keyboard cannot scroll it (axe
`scrollable-region-focusable`, WCAG 2.1.1). Every other page passes only because
it happens to contain a link.

Change it to `tabIndex={0}`, so no page depends on its content to pass. The skip
link must still land on it. Give it a `:focus-visible` treatment using the
site's existing focus token, inset so it is not clipped by the frame. Do not add
`role` or `aria-label` to it: the `<main>` inside already names the region.
Re-run axe on `/team`, light and dark, and record the result.

### 2.2 The 404 page gets its landmark

`not-found.tsx`: the outer `div.notfound-page` becomes `<main className="notfound-page">`.
Check it does not end up with two `<main>`s, and that the styling is unchanged.
Re-run axe on the 404 page.

### 2.3 Portrait carve

`.home-face` and `.crew__portrait` draw the recessed edge as an inset
`box-shadow` on the box itself, so a photograph covers it. Give both the same
structure as `TonedPhoto`: a separate `__edge` span, `aria-hidden`, above the
image and the tone layer, carrying the shadow, with the shadow removed from the
box. The empty plate (`--empty`) must look exactly as it does now. Check that
with a before/after screenshot of the empty state, the same way as last run's
pixel check. Then use a temporary greyscale portrait to confirm the edge is
visible over a photograph, and do not commit the temporary portrait.

### 2.4 Image optimisation back on

The site is moving to Vercel, which optimises images itself. `unoptimized` was
only there because the Coolify box had no sharp. Remove it from every image:
`page.tsx`, `team/page.tsx`, `ProjectMedia.tsx`, `SiteHeader.tsx`, `TonedPhoto.tsx`.
Replace the comments in `SiteHeader.tsx` and `TonedPhoto.tsx` that justify it.
In `SiteHeader.tsx`, keep the sentence about not pointing back at the PNG and
the `priority` explanation. Make sure each image has an accurate `sizes`. Do not
touch `next.config.ts`. `pnpm build` and the page renders are the check: on
`pnpm start` the `<img>` `src` should now go through `/_next/image`.

---

## Stage 3 — `CLAUDE.md`

Exact replacements. Nothing else in the file changes.

**3.1** Replace the whole `## Deployment — how this site actually ships` section,
up to the `## Imports` heading, with:

```markdown
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
```

**3.2** In the Accessibility list, replace
`The pattern used here is \`useSyncExternalStore\` (currently duplicated in three components — it should move to \`src/hooks\`).`
with `Use \`useReducedMotion\` from \`@hooks\`.`

**3.3** Replace `301s in \`next.config.ts\`:` with
`Permanent redirects (308) in \`next.config.ts\`:`.
Then delete the paragraph that says `src/app/work/`, `src/app/services/`,
`src/app/crew/` and the two scss files are dead and should be deleted. Check
first that they are gone; if any still exists, log it and leave the paragraph.

**3.4** In `## Known traps`, `## 2. \`$line-height-*\` tokens` section, replace
`(Converting these tokens to ratios is on the list; until then, assume every one of them is a trap.)`
with
`Existing uses were converted to ratios on 2 November, except three whose font size is a \`clamp()\` or inherited. Do not add new uses.`

**3.5** Replace the whole `# Current state — read before starting` section, to
the end of the file, with:

```markdown
# Current state — read before starting

As of 2 November:

- All work is on `development`. The live site is still the 4 August build
  until the Vercel cutover.
- Invented copy still showing a marker: every `/built` entry, Asuka, two
  partners, and `/engineering` (Craig's). The full list is the Stage 4 audit in
  `docs/briefs/launch-ready.log.md`.
- Photos from the 2 November shoot are coming. Tom and Asuka have no portrait,
  permanently. Group and working shots go in `src/constants/photos.ts`.
- Next after relaunch: Payload CMS (Neon Postgres, Vercel Blob media).
```

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

Then axe on every sitemap route plus the 404, light and dark, as last run.
Expect **zero violations**. List anything that is not zero.

---

## The log

Append to `docs/briefs/launch-polish.log.md`, same format as last run: what
passed, every error verbatim, what you fixed, what you logged instead, the
commit SHAs, and anything wrong with this brief.

Last line exactly one of: `STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
