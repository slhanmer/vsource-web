# Log — launch-ready brief

## Run 1 — 2026-11-02 — development

All four stages are done. Each code stage is one commit, pushed to
`development`. The production server for verification ran on **port 3123**,
because port 3000 was held by another process (PID 43984).

**Before Stage 0 — the toolchain**
- `pnpm build` failed before it reached Next. Verbatim:
  ```
  [ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY] Aborted removal of modules directory due to no TTY
  If you are running pnpm in CI, set the CI environment variable to "true", or set "confirmModulesPurge" to "false".
  ```
  Running `next build` directly showed why: `node_modules` was damaged.
  `Error: Cannot find module '@swc/helpers/_/_interop_require_default'`
  (required from `next/dist/shared/lib/constants.js`).
- Fixed with `CI=true pnpm install --frozen-lockfile`. That rebuilds
  `node_modules` from the lockfile and does not change it. `package.json` and
  `pnpm-lock.yaml` are untouched. Every `pnpm` script has worked since.

**Stage 0 — the work already in the tree**
- I read the diff. It is the three things the brief describes (`StreamSection.link`
  plus the two links, `.home-pending` moved to `global.scss`, `crew__pending`
  removed). It also cuts the `regulated` and `accessibility` section bodies to
  two short paragraphs. That cut is the seo-landing-pages brief's §1.7 trim,
  with the §2.3 copy adapted to the `link` field (the trailing "— see
  [link]" became the separate link). It is part of "the links through", so I
  did not stop on it.
- `pnpm build`: pass, 29 static pages.
- `/software` → `/regulated` and `/websites` → `/accessibility`: both
  `stream__onward` links are in the HTML, and both targets return 200.
- `/team` on a direct load: the `[pending]` span is `class="home-pending"`, and
  the rule `.home-pending{border-bottom:1px dashed …}` is in
  `/_next/static/css/3bee630d77a15e1c.css`, which `/team` links. So it is styled.
- **Commit `78c02ec4db6b48ea5eaf3fb2b282b4552e1b0d8e`**, 7 files.

**Stage 1 — content fixes**
- 1.1: all five URLs replaced as given, and the `⚠ PREVIEW URLS` block
  deleted. `status` and `placeholder` are untouched.
  **One of the five does not resolve.** `don-gino.com.au` is NXDOMAIN on both
  1.1.1.1 and 8.8.8.8. `dongino.com.au` (no hyphen) resolves and serves
  `<title>Don Gino — Come as a guest. Leave as family.</title>`. That is almost
  certainly the intended URL. The brief gives the hyphenated one, so I used it
  as given and did not correct it. **This needs a one-line fix before deploy.**
  The other four return 200.
- 1.2: the `wcag-22` second paragraph is replaced verbatim. I removed
  `pending: true` from `accessibility` and replaced the comment paragraph as
  given. `/accessibility` no longer renders `[pending]`.
- 1.3: `serviceType: string` (required) is on `Landing` and emitted in the
  `Service` JSON-LD. Both values are set as given.
- `tsc --noEmit`: only the two known ui-kit test errors at this point.
- **Commit `5f6807a0aca61ce0ccbcce7386492414d247f785`**.

**Stage 2 — photo-ready**
- 2.1: the convention is written into the header comment of `crew.ts`, as
  specified. It includes that Tom and Asuka permanently have the empty plate.
  I also updated the three comments that still described the 26 October shoot
  as "three portraits and Tom" (`team/page.tsx`, `home.scss`, `crew.ts`).
- Box reservation, checked with a temporary 1200×1500 greyscale JPEG on
  Simon's entry. Every `.jpg` request was held at the network, then released.
  On both paths (`home-face`, `crew__portrait`), at 1440px and 390px, the box
  was identical before and after load: 230.4×288 / 371.3×464.2 at 1440px,
  340×425 / 322×402.5 at 390px, ratio 0.800 in every case. The CSS
  `aspect-ratio: 4 / 5` does the reserving, so this needed no fix.
- `next/image` with explicit `sizes`: both paths now pass `sizes`. **But
  `sizes` is inert here, so the brief and the code do not match.** Every image
  on the site uses `unoptimized`. That is deliberate, per the comment in
  `SiteHeader.tsx`: there is no sharp on the deploy box under
  `output: 'standalone'`. With `unoptimized`, Next does not even emit the
  `sizes` attribute, which I confirmed in the DOM (`sizes=null`). I left
  `unoptimized` in place. As things stand, a 1200×1500 source will be shipped
  at full size into a 230px box. Either export the portraits at display size,
  the way the logo is, or enable optimisation on the deploy box. That is your
  call.
- 2.2: `src/constants/photos.ts` exports `PHOTOS` and `Photo` as specified,
  both `undefined`, and both are re-exported from `@constants`. A new
  `components/photos/TonedPhoto.tsx` gives the same greyscale filter and
  duotone as the portraits, with the recessed edge on its own layer above the
  image (see Stage 4 §5 for why that matters). It has no `alt` text.
  - `group`: full width under the `/team` head.
  - `working`: **the brief and the code do not match.** The beside-the-copy
    slot in "why we work this way" is already taken by the `FitCut`
    illustration. I built it with grid areas that apply only when the photo is
    set: wide is copy | photo, with FitCut under the photo in the same column;
    narrow is photo, copy, FitCut. That meets the brief literally, but it is a
    composition choice in a section the brief puts out of scope. If you want it
    differently, the change is in `.home-why__grid--photo` only.
- Pixel-identical check: I took 26 screenshots (`/` and `/team`, 1440px and
  390px, scrolled through `#main`, reduced motion) before the change. Two runs
  were byte-identical, so the capture is deterministic. After the change, with
  both photos unset, **all 26 are byte-identical to the baseline**, and there
  is no `toned-photo` markup in either page. This was the light theme only.
- The temporary images and the test data were removed before the commit.
  `public/crew/` does not exist in the tree.
- **Commit `dcc73ba65b330d5bf667b1f95b642c026061020d`**.

**Stage 3 — debt**
- 3.1: **there are 11 uses, not 13.** The 13 grep hits include two comments
  (`home.scss:341`, `home.scss:1033`). I converted 8, each as the token's px
  divided by the font size in that rule:

  | file:line | token | font size | ratio |
  |---|---|---|---|
  | `crew.scss:160` | relaxed 28px | `$font-size-sm` 14px | `2` |
  | `home.scss:637` | normal 24px | 17px | `1.41` |
  | `home.scss:1759` | normal 24px | 16px | `1.5` |
  | `home.scss:1836` | normal 24px | 16px | `1.5` |
  | `pages.scss:44` | relaxed 28px | `$font-size-md` 18px | `1.56` |
  | `pages.scss:133` | normal 24px | `$font-size-sm` 14px | `1.71` |
  | `slideSwitch.scss:43` | snug 20px | `$font-size-base` 16px | `1.25` |
  | `spotlight.scss:124` | snug 20px | `$font-size-sm` 14px | `1.43` |

  I left 3 and logged them. The font size in effect cannot be determined from
  the stylesheet for these:
  - `contact.scss:65` (`.contact__sent-body`): no `font-size` anywhere in its
    chain in `contact.scss`. It inherits.
  - `home.scss:1322` (`.home-why__body`): `clamp(18px, 1.5vw, 21px)`.
  - `home.scss:1424` (`.fitcut__caption`): `clamp(17px, 1.35vw, 19.5px)`.

  `crew__bio` comes out at `line-height: 2`. That is what it renders at today
  (28px on 14px), so it is unchanged, but it is loose for body copy. Worth a
  look by eye.
- 3.2: **there were four copies, not three**: `ProjectMedia`,
  `RotatingHeadline`, `StreamMoves` and `HeaderReadout`. All four now use
  `useReducedMotion()` from `@hooks`. The server snapshot is still `false`.
  Behaviour checked in Chromium on `/`: under `reduce` the headline did not
  change over 7s, and under `no-preference` it rotated. `CursorSpark` and
  `ThemeSwitch` do a one-off `matchMedia` inside an effect or handler. That is
  a different pattern, so I left them. CLAUDE.md still says "duplicated in
  three components"; that line is now stale.
- 3.3: I deleted `ButtonLoader` "accepts a custom size without throwing" and
  the `DropDown` `normalCase` describe block (its only case). No props were
  added. `ButtonLoader.tsx` still has a doc comment for a `size` prop it does
  not have. I left it, because the component was not in scope.
- `pnpm tsc --noEmit`: **clean, exit 0.** `pnpm lint`: exit 0. `jest --ci`: 41
  suites, 591 tests pass (593 − the 2 deleted). `pnpm build`: pass.
- **Commit `ad0d2617f5c27be108903a35b37e603fc5be4a56`**.

**Verify (final, at `ad0d261`)**
- `pnpm tsc --noEmit`: exit 0, no output.
- `pnpm lint`: exit 0.
- `pnpm build`: pass, 29 static pages. The only warning is the known
  `NODE_TLS_REJECT_UNAUTHORIZED=0` from `.env.local`, which I did not touch.

**Wrong with the brief**
- 3.1 says 13 uses; there are 11 (two hits are comments).
- 3.2 and CLAUDE.md say three duplicates; there were four.
- 1.1 gives `don-gino.com.au`, which does not exist. It is probably `dongino.com.au`.
- 2.1 asks for explicit `sizes`. Under the site-wide `unoptimized` it does
  nothing.
- 2.2 puts `working` beside the copy, where `FitCut` already is.

**Left alone, as before:** `.claude/settings.json` (modified, not by me),
`.claude/__probe`, `.claude/settings.json.aptium-backup`, `_to_delete/`
(Aptium diagrams), `.env.local`. None of them is staged.

---

## Stage 4 — launch audit

### 1. Every remaining `pending` / `placeholder` flag

| file:line | entry | what is invented | waiting on (if the file says) |
|---|---|---|---|
| `built.ts:120` | spider-drones | lede, body, client ("Placeholder"); the clip is a generated throwaway; Rights "Unconfirmed" | Craig (whose project, footage rights) |
| `built.ts:148` | aptium-portal | the write-up; screens under NDA, so it uses the stream mark | not stated (`work.ts` `CASE_STUDY` is the raw material) |
| `built.ts:176` | youhire | the entry; the work has not started | not stated |
| `built.ts:204` | training-professionals | line and lede | Craig ("has the real wording") |
| `built.ts:232` | qut-capstones | the write-up | not stated |
| `built.ts:260` | sauce | the write-up | not stated |
| `built.ts:288` | vsource-site | body; the screenshot is still to come | not stated |
| `built.ts:316` | simon-hanmer-studio | body | not stated |
| `built.ts:344` | nug | the write-up | not stated |
| `built.ts:372` | snug | the write-up | not stated |
| `built.ts:400` | janes-deli | the write-up | not stated |
| `built.ts:428` | bar-coopers | the write-up | not stated |
| `built.ts:456` | don-gino | the write-up | not stated |
| `crew.ts:102` | Asuka | full name, title wording, summary, bio | Asuka |
| `partners.ts:49` | QUT | body ("Full industry partner with QUT.") | Craig |
| `partners.ts:59` | Training Professionals | body | Craig |
| `streams.ts:208` | websites → proof | "This site, and Simon's…" | not stated |
| `streams.ts:270` | engineering → proof | QUT partnership / capstones line | not stated |
| `streams.ts:287` | engineering → `scope` section | the whole section | Craig |
| `streams.ts:296` | engineering → `proof` section | the whole section | Craig |

That is 13 visible `[placeholder]` markers on `/built` and its pages, and
`[pending]` / `[wording needed]` on `/`, `/team`, `/websites` and `/engineering`.

**Placeholder text with no flag, so no marker:**
- `streams.ts` engineering `pageLede`: "Placeholder — this page needs Craig.
  Every word of this stream is written blind…". **This is also `/engineering`'s
  `<meta name="description">`**, so it is what a search result would show.
- `streams.ts` engineering `pricing.note`: "Placeholder. Scope is Craig's to
  define…"

### 2. Banned content (grepped in the rendered HTML of all 21 sitemap routes)

| term | route | where | hit |
|---|---|---|---|
| `Class A` | — | — | **none**, in any case |
| engineer as a title | `/` | team teaser, `home-person__role` | Tom Lee — "Backend & Platform Engineer" |
| engineer as a title | `/team` | `crew__role` | Tom Lee — "Backend & Platform Engineer" |
| engineer as a title | `/team` | Person JSON-LD `jobTitle` | Tom Lee — "Backend & Platform Engineer" |

Source: `crew.ts:72`. The only other match is "Professional Engineers Act
2002" in the `/engineering` scope section, which names the Act rather than a
person.

### 3. Accessibility — axe-core

This ran from what is installed: axe-core 4.12.1, a transitive dependency of
`@storybook/addon-a11y`, injected with the installed Playwright. Nothing was
added. Tags: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa and best-practice.
It covered all 21 sitemap routes plus a 404, in both light and dark (set via
`localStorage.theme`; `data-theme` confirmed on each load), at 1440px with
reduced motion.

| route | theme | rule | impact | element |
|---|---|---|---|---|
| `/team` | light, dark | `scrollable-region-focusable` (WCAG 2.1.1, 2.1.3) | serious | `div#main.page-container.site-shell` |
| 404 | light, dark | `landmark-one-main` (best practice) | moderate | `html` |
| 404 | light, dark | `region` (best practice) | moderate | `.notfound-card__body` |

`/team` is the only page whose `#main` has no focusable content. The header is
outside the scroller and the team cards have no links. So a keyboard user has
nothing to focus that would let the arrow keys scroll it. Every other route
passes only because it happens to have a link inside `#main`.

These are violations only. axe reports text over gradients and images as
"incomplete" rather than as a violation, so contrast over the duotone and
milled plates still needs checking by eye.

### 4. Links

**Internal:** all 22 distinct targets return 200: `/`, the 3 streams,
`/regulated`, `/accessibility`, `/built` and all 13 project pages, `/team`
and `/contact`. The fragments `#main` (skip link, every page) and `#software`
(home) exist. `/work`, `/services` and `/crew` redirect to `/built`, `/` and
`/team` with **308**, not 301 (`permanent: true` in Next). Search engines
treat the two the same; I note it only because CLAUDE.md says 301.

**External:**

| link | where | status |
|---|---|---|
| `https://nuggeneralstore.com/` | `/built/nug` | 200 |
| `https://goodsnug.com/` | `/built/snug` | 200 |
| `https://janes-deli.com/` | `/built/janes-deli` | 200 |
| `https://barcoopers.com/` | `/built/bar-coopers` | 200 |
| `https://don-gino.com.au/` | `/built/don-gino` | **no response: domain does not exist (NXDOMAIN)** |
| `https://maps.google.com/?q=Brisbane+Queensland` | header, every page | 200, after 2 redirects to google.com/maps |
| `https://www.linkedin.com/company/vsource-development` | header, every page | 999 (LinkedIn's bot block; cannot be confirmed by HTTP, so check it in a browser) |
| `mailto:craig@vsource.dev` | every page | not checkable |
| `tel:+61484325473` | every page | not checkable |

### 5. Anything else I would not ship

| what | why |
|---|---|
| `/built/don-gino` "Visit the site" points at a domain that does not exist | The card says `live` and the link is dead. Probably `dongino.com.au`. |
| Tom's title "Backend & Platform Engineer" | It breaks the engineer-title rule on two pages and in structured data. |
| `/engineering` meta description is an internal note | Search results would show "Placeholder — this page needs Craig. Every word … written blind". |
| `/engineering` scope body: "until Craig and Ronan finish their degrees" | It is flagged as a placeholder, but it is visible on the page and reads as an internal note. |
| 13 `[placeholder]` markers on `/built` | Doing their job, but a relaunch with every project marked as invented copy is not a launch. |
| `/team` `#main` cannot be scrolled from the keyboard | axe serious, WCAG 2.1.1. This is the thing the Websites stream sells. |
| Portrait carve disappears once a photograph lands | `.home-face` and `.crew__portrait` draw the recessed edge as an inset `box-shadow` on the box itself. An inset shadow paints under the box's content, so the `<img>` covers it. I saw this in the temporary-image test. `TonedPhoto` avoids it with a separate edge layer; the portraits need the same before the photographs go in. |
| Portraits will ship at full source size | `unoptimized` plus a ≥1200×1500 source into a ~230px box. See Stage 2. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` cannot be verified from here | Per CLAUDE.md it fails silently if it is set as a runtime variable. Check that the widget actually renders on the deployed `/contact`. |
| `.env.local` sets `NODE_TLS_REJECT_UNAUTHORIZED=0` | It is local, but it must not exist in any environment that builds for production. |
| 404 page has no `<main>` landmark | Minor (axe best practice). |

STATUS: done
