# Brief — launch-ready

**Repo:** `V Souce Development` · **Branch:** `development` (HEAD `1b285a7`)
**Push:** `development` only, at the end of each stage.
**Read `CLAUDE.md` first.** Everything in it applies.

The site relaunches once the photos from the 2 November shoot are back. This
brief gets everything that does not depend on those photos, or on copy from
somebody else, to a finished state, and makes the photos a drop-in. Simon then
reviews the whole site by eye and we work through what he finds.

Copy given below is final and is to be used verbatim. Where the brief does not
match the code, stop and log it — do not work around it.

**Out of scope, do not start:** the CMS, the hosting move, the venue
re-capture job, the composition of the home page's lower half, and any copy
for `/engineering`, Asuka, the partners or `/built`. Those have owners.

---

## Stage 0 — the work already in the tree

Seven files are modified and uncommitted: `src/app/styles/{crew,home,stream}.scss`,
`src/app/team/page.tsx`, `src/app/[stream]/page.tsx`, `src/constants/streams.ts`,
`src/styles/global.scss`. They are `StreamSection.link` with the links through
from `/software` and `/websites`, `.home-pending` moved to `global.scss`, and
`crew__pending` removed. Run 2 of `seo-landing-pages` was meant to commit them
and never ran.

Read the diff. If it is what that describes, build it, check the two links
resolve and the `[pending]` marker is styled on a direct load of `/team`, and
commit it as one commit. If the diff contains anything else, stop and log it.

---

## Stage 1 — content fixes

### 1.1 Live venue URLs (`built.ts`)

Confirmed live by Simon on 21 October. Replace each `url`:

| slug | url |
|---|---|
| `nug` | `https://nuggeneralstore.com/` |
| `snug` | `https://goodsnug.com/` |
| `janes-deli` | `https://janes-deli.com/` |
| `bar-coopers` | `https://barcoopers.com/` |
| `don-gino` | `https://don-gino.com.au/` |

Then delete the whole `⚠ PREVIEW URLS — SWAP AT CUTOVER` comment block. Leave
`status: 'live'` and every `placeholder` flag as they are.

### 1.2 `/accessibility` (`landings.ts`)

Its claims were checked against the AHRC *Guidelines on equal access to
digital goods and services* (April 2025) and digital.gov.au on 2 November. One
phrase was wrong: guidance does not extend the Act, it states what the Act
covers.

In the `wcag-22` section, replace the **second** body paragraph with exactly:

> The obligation itself is older and broader than any version number. The Disability Discrimination Act 1992 covers public-facing digital services, and the AHRC’s guidelines treat SaaS and PaaS platforms, CAPTCHAs, two-factor authentication, QR codes and biometric authentication as covered by it — each of which needs an accessible alternative rather than a note in a VPAT. Federal government services carry more again under the DTA’s Digital Experience Policy, in force since 1 January 2025.

Remove `pending: true` from the accessibility entry. In the comment above
`LANDINGS`, replace the paragraph beginning `/accessibility is \`pending\``
with:

```
 * The /accessibility claims were checked on 2 November 2026 against the AHRC
 * Guidelines on equal access to digital goods and services (April 2025) and
 * digital.gov.au. The DX Policy binds Commonwealth entities only; do not word
 * it as though it applies to business.
```

### 1.3 `serviceType`

Add `serviceType: string` (required) to the `Landing` interface, emit it in the
`Service` block in `Landing.tsx`, and set:

- `regulated` → `Medical device software development`
- `accessibility` → `Web accessibility audit and remediation`

Commit stage 1 as one commit.

---

## Stage 2 — photo-ready

### 2.1 Portraits

Convention, written into the comment at the top of `crew.ts` so it is not
re-decided later:

- Files go in `public/crew/<id>.jpg`, where `<id>` is the member's `id`.
- 4:5, at least 1200×1500, **greyscale source** — the duotone is the CSS layer.
- Setting `portrait: '/crew/<id>.jpg'` is the entire change. Nothing reflows.

**Tom and Asuka will not have portraits.** That is permanent, not pending: the
empty plate is their treatment. Say so in that comment.

Confirm both render paths (home `home-face`, `/team` `crew__portrait`) reserve
the 4:5 box before the image loads and use `next/image` with explicit `sizes`.
Fix if not. Test with a temporary greyscale image and do not commit it.

### 2.2 Group and working photographs

The shoot also produced group shots and shots of people at a PC. There is no
slot for either yet. Add one, data-driven like everything else:

- New `src/constants/photos.ts` exporting `PHOTOS: { group?: Photo; working?: Photo }`,
  where `Photo` is `{ src: string; alt: string; width: number; height: number }`.
  Both start `undefined`.
- `group` renders full width under the `/team` page head.
- `working` renders in the home page's "why we work this way" section, beside
  the copy on wide screens and above it on narrow ones.
- **Each renders nothing when unset**, so with both `undefined` the site is
  pixel-identical to today. Verify that.
- Same duotone treatment as the portraits; recessed edge, no shadow.
- `alt` is written from the actual photograph when it lands. Do not add alt
  text now.

Commit stage 2 as one commit.

---

## Stage 3 — debt

### 3.1 Line-height tokens

13 uses of `$line-height-*` outside `_tokens.scss`. Replace each with a
unitless ratio: the token's pixel value divided by the font size in effect for
that rule, rounded to two places. If the font size in effect cannot be
determined from the stylesheet, leave that use and log it. Do not change or
delete the tokens themselves.

### 3.2 Reduced-motion hook

The `useSyncExternalStore` reduced-motion pattern is duplicated. Move it to
`src/hooks/useReducedMotion.ts`, export it from `src/hooks/index.ts`, and use it
everywhere the duplicate appears. Behaviour must not change, including on the
server render.

### 3.3 The two ui-kit test errors

`ButtonLoader.test.tsx` and `DropDown.test.tsx`. **The component is the
truth:** where a test passes a prop the component no longer has, delete that
test case. Do not add props back. After this `pnpm tsc --noEmit` must be
clean.

Commit stage 3 as one commit.

---

## Stage 4 — launch audit (report, do not fix)

This is Simon's review list. Put it in the log as tables.

1. **Every remaining `pending` / `placeholder` flag**: file, line, what is
   invented, who it is waiting on if the file says.
2. **Banned content:** grep the rendered HTML of every route for `Class A`, and
   for `engineer` used as anyone's title. List any hit.
3. **Accessibility:** run axe-core against every route, light and dark theme,
   if it can be run from what is installed (Storybook's a11y addon brings it).
   If it cannot, say so — do not install anything. List every violation with
   route, rule and element.
4. **Links:** every internal link resolves; list every external link with its
   HTTP status.
5. **Anything else you would not ship**, with why.

---

## Verify

```bash
pnpm tsc --noEmit    # expect clean after 3.3
pnpm lint
pnpm build
```

Port 3000 may be held by another project; use a free port and say which.

---

## The log

Append to `docs/briefs/launch-ready.log.md`, same format as
`built-websites.log.md`: what passed, every error verbatim, what you fixed,
what you logged instead of fixing, the commit SHAs, and anything wrong with
this brief. Stage 4 goes at the end.

Last line exactly one of: `STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
