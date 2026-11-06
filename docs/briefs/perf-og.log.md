# perf-og: log

6 November. Measured on the Vercel preview
(`https://v-source-git-development-simonhanmer.vercel.app`), production build.

## Before and after

Lighthouse 12. Mobile is the median of three runs (all three in brackets);
desktop is one run. "Img KB" is image bytes transferred.

- **Before:** 7253828.
- **After:** 05b2cde.
- The raw JSON for every run is in `C:\tmp\perf-og\before\` and `…\after\`.

| Page | Form | Perf before → after | LCP before → after | LCP element (after) | CLS after | TBT after | Img KB before → after |
|---|---|---|---|---|---|---|---|
| `/` | mobile | 75 (71/75/77) → **76** (76/76/80) | 6.03 → **5.47s** | `p.home-hero__sub` (text), unchanged | 0.001 | 104ms | 188 → 143 |
| `/` | desktop | 90 → **94** | 1.97 → **1.60s** | `p.home-hero__sub` (text) | 0.001 | 0ms | 236 → 189 |
| `/software` | mobile | 70 (69/70/72) → **83** (77/83/91) | 7.49 → **4.26s** | the head photo, `cut-photo__img` | 0.000 | 48ms | 79 → 99 |
| `/software` | desktop | 87 → **94** | 2.36 → **1.56s** | a section photo, `cut-photo__img` | 0.001 | 0ms | 55 → 71 |
| `/built` | mobile | 72 (71/72/75) → **80** (78/80/80) | 7.19 → **4.47s** | the lead card's still, `built-media__poster` (was the `<video>` poster) | 0.001 | 158ms | 148 → 92 |
| `/built` | desktop | 95 → **98** | 1.51 → **1.09s** | as mobile | 0.032 | 0ms | 121 → 92 |

- **Image bytes:** `/software`'s went up by design. Its section images were
  being *under*-requested (`sizes` said 560px; they render at 607px).
- **CLS** is at most 0.032 everywhere, inside the 0.05 target.
- **Targets:**
  - `/` mobile: performance 85 and LCP under 2.5s are **not met**. The
    reason is below.
  - Every other page and form factor improved, and every desktop run is 94
    or better.

## 1. Images

- **`images.formats: ['image/avif', 'image/webp']` is NOT in.**
  - `next.config.ts` is denied by `.claude/settings.json`. Both a scripted
    edit and the Edit tool were refused ("File is in a directory that is
    denied by your permission settings").
  - It is one line, under `images:` in `next.config.ts`:
    `formats: ['image/avif', 'image/webp'],`
  - Simon, if you add it, the image KB column above should drop by roughly a
    further 20–30%.
- **`sizes`, every one measured.**
  - A Playwright pass read each `next/image`'s rendered CSS width on the
    preview, at 360, 390, 600, 768, 900, 1024, 1280, 1366, 1440, 1920 and
    2560 wide, on `/`, `/software`, `/robotics`, `/built`, four project pages
    and `/team`.
  - Each `sizes` below is set from those widths.

  | Where | Was | Now |
  |---|---|---|
  | hero cards | `(max-width: 979px) 30vw, 200px` | `(max-width: 979px) 25vw, 170px` |
  | home "Why" photo | `… 100vw, 580px` | `(max-width: 979px) 92vw, (max-width: 1366px) 40vw, 545px` |
  | home "What changes" photo / clip | `… 44vw, 600px` | `(max-width: 979px) 92vw, (max-width: 1366px) 43vw, 585px` |
  | home team faces | `… 33vw, 240px` | `(max-width: 560px) 92vw, (max-width: 979px) 31vw, (max-width: 1366px) 18vw, 245px` |
  | stream head photo | `(max-width: 768px) 100vw, 460px` | `(max-width: 768px) 93vw, (max-width: 1440px) 32vw, 460px` |
  | stream section image / clip | `… 100vw, 560px` (under-asked) | `(max-width: 979px) 94vw, (max-width: 1366px) 46vw, 610px` |
  | stream project cards | `(max-width: 700px) 100vw, 300px` | `(max-width: 540px) 77vw, (max-width: 979px) 405px, 285px` |
  | `/built` lead | `… 100vw, 710px` | `(max-width: 979px) 91vw, (max-width: 1366px) 51vw, 690px` |
  | `/built` grid | `… 50vw, 400px` (under-asked: renders 580) | `(max-width: 700px) 87vw, (max-width: 1366px) 44vw, 580px` |
  | project page lead | `(max-width: 1320px) 100vw, 1280px` | `(max-width: 1366px) 94vw, 1275px` |
  | venue screenshots | `… 50vw, 260px` | `(max-width: 559px) 92vw, (max-width: 1099px) 47vw, 235px` (the grid's real breakpoints) |
  | `/team` group | `(max-width: 1320px) 100vw, 1320px` | `(max-width: 1366px) 96vw, 1275px` |
  | `/team` portraits | `… 30vw, 380px` | `(max-width: 860px) 88vw, (max-width: 1366px) 28vw, 375px` |
  | client logos (NDA plates) | `320px` fixed (blurry at 707px on the Aptium page) | the media's own `sizes` |

  - **The hero cards were not asking for 620px** on this build: hero-cards
    had already set 200px. They are now 170px.
- **Nothing raw.**
  - There is no `<img` in site code except the OG card, where
    `ImageResponse` needs one, and no `unoptimized` anywhere.
  - **Clip posters were raw**: the `<video poster>` attribute fetched the
    full blob upload, eagerly, wherever the clip sat. On `/` that was the
    59KB Huntsman still, far below the fold.
  - The poster is now a `next/image` (`fill`) **under** the video, which has
    no `poster` attribute. A video with no frame paints nothing, so the still
    shows through until it plays.
  - It is lazy by default and preloaded only where it is the LCP. On `/` that
    59KB is now 6–14KB.
  - Checked with reduced motion: the still shows and the video is paused at
    0. With motion: it plays (`C:\tmp\perf-og\check\`).
- **Preloads.**
  - Removed from the three hero cards (the fold's LCP is text, below).
  - `priority` (deprecated in Next 16) is replaced by `preload` +
    `fetchPriority="high"`, only on each page's LCP image: the stream head
    photo, the `/built` lead and the project page lead.
  - The header logo keeps its preload. It is on the fold on every page, and
    6KB.

## 2. LCP

- **`/`, mobile and desktop: the text `p.home-hero__sub`**, before and after.
  It is not a photo, so no card is preloaded.
- **Fonts**, measured by walking every text node's computed face on 13
  routes at 1440 and 390:
  - **Was:** Chakra Petch 400/500/600/700, Plex Sans 400/500/600/700, Plex
    Mono 400/500, and Newsreader 300/400 in normal and italic. Every one was
    preloaded, as **9 files, ~352KB, before first paint**.
  - On the preview, each preloaded font was also fetched **twice**, under two
    Vercel deployment ids (`dpl_C3k…` and `dpl_BW7S…`). After this deploy,
    every asset on `/` carries one id.
  - **Rendered nowhere:** Plex Sans 500 and 700, and every Newsreader
    italic.
  - Plex Mono 500 stays, for the venue list's heading on
    `/built/brisbane-venues`.
  - **Now:** only Newsreader (the reading face, which is the LCP text's face)
    preloads. The other three load from the CSS and swap in.
  - All four were already `display: 'swap'`. next/font's metric-matched
    fallbacks keep the swap from shifting layout (CLS 0.001).
  - Fonts on `/`: **352KB → 135KB**.
- **The headline's first word is server HTML.**
  - The `h1` is "Software, robotics and websites, built to fit." (visually
    hidden), followed by the slot's characters S-o-f-t-w-a-r-e, all present
    in the HTML as served.
  - Nothing is typed in before first paint.

### Why `/` mobile is still 76

- **The page paints at about 480ms** on the preview, unthrottled, and the
  sub copy is the LCP at that same paint.
- **The 5.5s is Lighthouse's simulation, not a real paint.** For a text LCP,
  Lantern charges the LCP with every request that *started* before that
  paint, then replays them on a slow 4G link. That is about 460KB:
  - **Fonts:** 136KB.
  - **JavaScript:** 185KB, almost all of it Next and React.
  - **Images:** 143KB, mostly the "What changes" and "Why" photos.
- **Those photos are `loading="lazy"`.** But they sit within Chrome's
  lazy-load distance of a 412×823 fold, so Chrome fetches them at once, at
  271ms.
- **The cheap cuts are done:**
  - Fonts went from 352 to 135KB.
  - Initial JS went from 291 to 178KB gzipped.
  - The poster went from 59 to 14KB.
- **What is left needs more work than "cheap":**
  1. **AVIF**: the one-line config change above. It takes about 30KB off
     those images.
  2. **Defer the below-fold photographs until after first paint.** For
     example, a client wrapper that mounts the "What changes" media only
     once `#main` scrolls near it, rendering an empty sized box first.
     - That keeps the server HTML free of the images, which costs no-JS
       visitors the photos.
     - It is a design decision, not a perf tweak.
  3. **Drop FontAwesome from the header** (23KB gzipped on every page) for
     inline SVGs of the four contact icons and the menu.
  4. **Paint earlier.** About 250ms passes between the CSS landing (224ms)
     and first paint (477ms), with the main thread in style, layout and
     script evaluation. The cause is unknown. It needs a real trace, not
     Lighthouse.
- With 1 and 3, a mobile score in the low 80s is plausible. 85 most likely
  needs 2 as well.

## 3. JavaScript and the rest

- **The ui-kit barrel was in every page.**
  - `SiteProviders` (every page) imported `ToastProvider` from
    `@components`.
  - The 404 boundary, which ships with every page, imported `Button` from
    the barrel, and `Button` imports the `@utils` and `@hooks` barrels.
  - The ui-kit's per-component SCSS imports are side effects, so webpack
    kept every module behind those barrels: react-datepicker, react-colorful,
    date-fns, dnd-kit, and the rest of the Aptium-era kit.
- **The fix is in site code only:**
  - Direct module imports (`@/components/ui-kit/Toast`,
    `@/hooks/useReducedMotion`, `@/constants/contact`, …) in SiteProviders,
    HeroRun, RotatingHeadline, MillLines, HeaderReadout, HeaderContacts,
    ProjectMedia and ContactForm.
  - The 404 uses two plain `<button>`s in the kit's own `.basic-button`
    classes. Rendering and behaviour are the same.
  - I first changed the ui-kit's own imports. That broke 7 ported ui-kit
    test suites, which mock the barrels, so I reverted it: the ui-kit is
    untouched.
- **Initial JS on `/`** (script tags in the HTML, gzipped, polyfills
  excluded): **291KB → 178KB**.
  - What remains is Next's framework (64KB), react-dom (61KB), FontAwesome
    (23KB) and the site's own client code.
  - There is no Payload admin, no player and no lightbox on `/`.
  - The contact form's chunks now load only as the prefetch of `/contact`,
    after the page is up.
- **`ANALYZE` / bundle analyzer:** neither is installed, and it would need
  `next.config.ts`. The chunk contents were identified from their string
  literals instead.
- **`dynamic()`:** nothing worth it on `/`.
  - The client components on the fold are the fold.
  - `ProjectMedia` (the one below-fold widget) is small, and its clip already
    fetches nothing until it is in view.
- **Videos:** `preload="none"` is confirmed on every clip. They start and
  stop from an observer rooted on `#main`.
- **Dimensions:** every image has width and height, or `fill` in an
  aspect-ratio box. Every video has width, height and the 16:9 box. Measured
  CLS is at most 0.032.

## 4. OG image

- **`src/app/(site)/opengraph-image.tsx`**, using `next/og` at 1200×630,
  generated at build time. It shows:
  - the dark plate gradient
  - the wordmark (`public/logos/vsource-logo-full.png`) top left
  - "Software built to fit." in Newsreader Light, with "Software" in the
    recessed slot
  - `photos/at-the-desk` (Craig and Simon, screens blurred, as on the site)
    at 40% width in a recessed window with an 8px radius, cropped from the
    top
  - `V SOURCE DEVELOPMENT · BRISBANE` in Plex Mono along the bottom
- **Hex values** are copied from the dark theme, each named for its token,
  with a comment saying why: tokens do not reach `ImageResponse`.
- **Fonts:** Satori cannot read WOFF2 or variable fonts, so two static,
  OFL-licensed TTFs are in `src/assets/og/`: Newsreader Light and IBM Plex
  Mono Medium.
- **`twitter-image.tsx`** draws the same card for `twitter:image`.
  `twitter.card` stays `summary_large_image`.
- **`public/og.png` is deleted**, and both `images: ['/og.png']` lines are
  out of `layout.tsx`.
- **Inner pages had no share image at all, before this brief as well.**
  - Next merges metadata one key deep, so any page with its own `openGraph`
    (every stream, `/built`, each project, `/team`, `/contact`, `/regulated`
    and `/accessibility`) dropped the layout's image.
  - `src/app/(site)/shareCard.ts` (`withShareCard`) copies the image the
    layout resolved into the page's own `openGraph`.
  - All of those pages now carry the card.
- **Renders on the preview:**
  - **Image:**
    https://v-source-git-development-simonhanmer.vercel.app/opengraph-image-12o0cb?ad0041ee26af8250
    returns 200, `image/png`, 557KB.
  - **Old file:** `/og.png` now returns 404.
  - **Copy:** saved as `C:\tmp\perf-og\og-preview.png`.

## Verify

- `pnpm tsc --noEmit`: clean.
- `pnpm lint:ci`: clean, with zero warnings.
- `pnpm test:ci`: 50 suites and **652 passed**.
- `pnpm build`: ok.
  - One earlier build failed in `next/font` ("Cannot read properties of null
    (reading '1')") while fetching the changed weights from Google. The same
    tree rebuilt cleanly at once.
- **axe on `/`:** light and dark, at 1440×900 and 390×844, **0 violations**.
- **Commits.** Pushed to `development` as **c687070 and 05b2cde**.
  - c687070 contains *only* the `public/og.png` deletion. A `git add` failed
    on the already-staged deletion and staged nothing else, and I committed
    without checking.
  - 05b2cde, pushed straight after, carries everything its message
    describes. History was not rewritten.
  - The one preview built from c687070 pointed `og:image` at a deleted file.
    05b2cde's preview supersedes it.
- `public/llms.txt` (untracked, not mine) is left out.

## Left for Simon

- Add `formats: ['image/avif', 'image/webp']` to `images` in
  `next.config.ts` (I can't edit that file here).
- Decide on items 2–4 under "Why `/` mobile is still 76" if 85 matters.
- **Orphaned `next start` servers from my verification**, which stopping my
  background tasks did not kill on Windows (and killing them by PID was
  refused):
  - :3201 (PID 50184, from the hero-cards run)
  - :3202 (PID 63672)
  - :3203 (PID 57936)
  - :3204 (PID 48256)
  - :3200 (PID 52744) is yours and untouched.

STATUS: partial — `/` mobile is 76 (LCP 5.5s simulated, about 480ms
observed), not 85. The AVIF config line is blocked by permissions, and the
remaining gains need below-fold media deferral or a header icon swap (see
above). Everything else in the brief is done.
