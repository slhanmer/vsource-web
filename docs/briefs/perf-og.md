# perf-og: performance pass and a new OG image

Log to `docs/briefs/perf-og.log.md`. **Measure on the Vercel preview (production build), not `pnpm dev`.** The preview's deployment protection is off. The baseline is Lighthouse mobile at about 50 performance, with LCP the main problem. Record before and after for `/`, `/software` and `/built`: performance, LCP (and which element it is), CLS, TBT, and total image KB.

## 1. Images

- `next.config.ts` (in scope for this brief): set `images.formats: ['image/avif', 'image/webp']`. Next already serves webp through `/_next/image`, and avif is roughly 20–30% smaller again. Leave `remotePatterns` alone.
- **Fix `sizes` everywhere.** Most are copied from old layouts and request far bigger files than they render. The worst is the hero card photos, which render at roughly 160–200px CSS but ask for the 620px+ size. Set each `sizes` from the rendered width at each breakpoint and measure it; don't guess.
- Payload's generated sizes (`400`, `900`, `1800`) are fine as sources; `next/image` resizes from them.
- Nothing raw: grep for `<img` and for `unoptimized` in site code. Every content image goes through `next/image`, except SVG logos.
- Below the fold: `loading="lazy"`, which is the default. Take off any `preload`, `priority` or `loading="eager"` that isn't on the fold.

## 2. LCP

- Identify the LCP element on the preview at mobile and desktop. It is probably the headline text or the first hero card photo.
- If it is a photo: that one image gets `preload` (`priority`), with correct `sizes` and `fetchPriority="high"`. The other two cards do not get `preload`.
- If it is the headline text: check `next/font` uses `display: 'swap'` for the faces shown above the fold, and that only the weights actually used are loaded. List what is loaded now, and drop any unused weight or axis.
- The headline animation must not delay LCP. The word that is present at first paint must be real text in the server HTML, not something typed in later. Confirm this.

## 3. JavaScript and the rest

- Check the bundle with `ANALYZE` or the build output. Nothing heavy should ship to `/` that `/` doesn't use, for example the Payload admin, video players above their section, or a lightbox. Move client-only widgets below the fold behind `dynamic()` where it is cheap to do.
- Videos: `preload="none"` plus the poster, until in view (the /built player probably does this already; confirm).
- Every image and video has width and height or an aspect-ratio box, so CLS is ≤ 0.05.

## 4. OG image

`public/og.png` is the old site: text only, with the old status bar. Replace it with **`src/app/(site)/opengraph-image.tsx`** using `next/og` (`ImageResponse`), 1200×630:

- The dark plate background, with the V Source wordmark top-left (the existing asset).
- The headline **"Software built to fit."** in Newsreader, with "Software" in the recessed black slot like the hero.
- On the right, `photos/at-the-desk` (Craig and Simon) in a recessed window with `$radius-md`, about 40% of the width, cropped from the top.
- At the bottom, in mono: `V SOURCE DEVELOPMENT · BRISBANE`. Hex values are fine here because tokens don't reach `ImageResponse`; note that in a comment.
- Delete `public/og.png` and take the `images: ['/og.png']` lines out of `layout.tsx` metadata (`openGraph` and `twitter`), since the file convention supplies them. Keep `twitter.card = 'summary_large_image'`.
- Check the result renders by opening `/opengraph-image` on the preview, and record its URL in the log.

## Verify

- `pnpm tsc --noEmit`, `pnpm lint`, `pnpm test:ci`, `pnpm build`. Push to `development`, wait for the preview, then run Lighthouse mobile and desktop on `/`, `/software` and `/built`, and record the before/after table.
- Target: mobile performance ≥ 85 on `/`, LCP < 2.5s, CLS ≤ 0.05. If one target isn't reachable cheaply, say what is left and why.
- axe on `/`: 0 violations.

End with `STATUS: done`, `STATUS: partial — <what's left>` or `STATUS: blocked — <why>`.
