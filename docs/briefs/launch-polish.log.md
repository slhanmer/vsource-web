# Log — launch-polish brief

## Run 1 — 2026-11-02 — development

All three stages are done, as two commits, both pushed to `development`.
Verification used the production server (`next start`) on **port 3123**,
because port 3000 is held by another process.

**Stage 1 — content**
- Tom Lee's `role` is now `Backend & Platform Developer` (`crew.ts:72`). The
  `/team` Person JSON-LD sets `jobTitle: person.role` (`team/page.tsx:48`), and
  the rendered `/team` shows `"jobTitle":"Backend & Platform Developer"`. There
  is no second copy: the old title appears nowhere in `src/`, `public/` or
  `docs/*.md`, and "Platform Engineer" is gone from the HTML of `/` and `/team`.
- The `don-gino` `url` is now `https://dongino.com.au/`; nothing else in the
  entry changed. `/built/don-gino` renders `href="https://dongino.com.au/"`.

**Stage 2 — accessibility and images**
- 2.1: `#main` is `tabIndex={0}`, with no role or label. The `:focus-visible`
  rule (`shell.scss`) is `outline: $stroke-thick solid $text-primary;
  outline-offset: -$stroke-thick`. That is the same ring as the skip link and
  the header controls, drawn inside the box.
  - **Brief vs code:** the only token actually named "focus" is
    `$border-focus` (1.5px, `$action-primary` green). Only three ui-kit inputs
    use it. Every focus ring in the site chrome uses `$stroke-thick solid
    $text-primary`, and green is the "acts" colour. I took the chrome ring to
    be "the site's existing focus token". If you meant `$border-focus`, it is
    a one-line change.
  - Keyboard check in Chromium on `/team`: the first Tab lands on the skip
    link; Enter moves focus to `#main`, where `:focus-visible` is true and the
    ring is visible on all four sides (screenshot checked). PageDown then
    scrolls `#main` from 0 to 697. A mouse click on a fresh load focuses
    `#main` with no ring.
  - axe on `/team`, light and dark: **0 violations**
    (`scrollable-region-focusable` cleared).
- 2.2: in `not-found.tsx`, the outer wrapper is now `<main className="notfound-page">`.
  There is one `<main>` on the 404, and one on `/` and `/team`. axe on the 404,
  light and dark: **0 violations** (`landmark-one-main` and `region` both
  cleared).
  - Styling: compared with the baseline, **0 pixels differ below the header
    band** at 1440px or 390px in either theme. The header band does differ,
    but that is the logo being resized by the optimiser (2.4), not the
    landmark.
  - Note: `.page-container.site-shell > main { flex: 1 0 auto }` (shell.scss)
    now applies to the 404 wrapper and outranks its own `flex: 1 1 auto`. It
    makes no visible difference. The rule in `not-found.scss`,
    `.page-container.site-shell > main:has(.notfound-page)`, never matched
    before this change and still does not; it is dead code. I left both alone.
- 2.3: `.home-face__edge` and `.crew__portrait-edge` are `aria-hidden` spans,
  the last child of the box, so they sit above the image, the tone and the
  initials. They carry the inset shadow, and the box no longer has one
  (`box-shadow: none` measured on both). The edge renders in both states, so
  the empty plate keeps its carve.
  - Empty-plate check: I took a 44-shot baseline before the change (every
    empty plate on `/` and `/team`, plus the 404; 1440px and 390px; light and
    dark). Two baseline runs were byte-identical. After the change, **the
    plates are not byte-identical:** each differs by 18–50 pixels, with a
    maximum difference of 8/255. Every one of those pixels is within 14px of a
    corner, and none is elsewhere. The cause is that the shadow is now drawn on
    a child and clipped by the box's rounded `overflow: hidden`, so the corner
    curve is anti-aliased twice. It is visually identical, but not "exactly"
    the same in the pixel sense. Getting byte-identity would mean taking
    `overflow: hidden` off the box and clipping the image itself, which breaks
    the blur/scale reveal on `.home-face__img`. I did not do that.
  - Over a photograph: with a temporary greyscale 1200×1500 portrait on Simon's
    entry, the dark top rim and light bottom lip are visible over the image on
    both paths, light and dark (2× screenshots checked). The temporary file and
    the `crew.ts` edit were removed before commit. `public/crew/` does not
    exist.
- 2.4: `unoptimized` is removed from all six images. Every `<img>` `src` on
  `next start` is now `/_next/image?url=…`, and the optimiser answers 200. The
  `SiteHeader.tsx` and `TonedPhoto.tsx` comments are replaced; the "do not
  point back at the PNG" and `priority` explanations are kept.
  `next.config.ts` is untouched.
  - `sizes` values come from measuring the rendered width at 11 viewports
    (360–1920px):

    | image | rendered width | `sizes` |
    |---|---|---|
    | header logo | 102px ≤480, else 222px (CSS height 34/74px, 3:1) | `(max-width: 480px) 102px, 222px` |
    | partner logos | fixed, 92–203px at every width | `210px` |
    | home portraits | 100vw ≤560 · ≈29vw to 979 · max 230px | `(max-width: 560px) 100vw, (max-width: 979px) 33vw, 240px` (unchanged) |
    | `/team` portraits | 100vw ≤860 · 26–28vw to 1320 · max 371px | `(max-width: 860px) 100vw, (max-width: 1320px) 30vw, 380px` (was 33vw / 420px) |
    | `/built` lead card | ≈100vw ≤979 · max 710px | `(max-width: 979px) 100vw, 710px` |
    | `/built` grid cards | 100vw to ~560 · ≈50vw to ~1080 · max 397px | `(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 400px` |
    | project page | ≈100vw to 1320 · max 1272px | `(max-width: 1320px) 100vw, 1280px` |
    | `TonedPhoto` | set where it is used (last run) | unchanged |

  - `ProjectMedia` gains a **required** `sizes` prop, because the same
    component renders at three very different widths. Each of its three
    callers passes its own value. The brief does not ask for this, but there
    is no accurate single value.
  - At 2× DPR the browser picked the 640w variant for the 230px home portrait
    and 828w for the 371px `/team` portrait.
  - Format: with a browser `Accept` header, the logo comes back as
    `image/webp`, so its transparency is kept. A client that accepts neither
    WebP nor AVIF gets `image/jpeg` with the alpha flattened. No current
    browser does that.
- `pnpm lint`: exit 0. `pnpm test:ci`: 41 suites, 591 tests. `pnpm build`:
  pass.
- **Commit `e067aa837b7488fa11d54c6dbee8911be20ca9b3`** (stages 1–2).

**Stage 3 — CLAUDE.md**
- 3.1–3.5 are applied with the brief's text. 3.2 and 3.4 targeted sentences
  that are hard-wrapped across two lines in the file, so I matched them across
  the line break. The 3.4 replacement is re-wrapped to the file's line length;
  the words are exactly as given.
- 3.3: I checked first that `src/app/work/`, `src/app/services/`,
  `src/app/crew/`, `src/app/styles/work.scss` and
  `src/app/styles/services.scss` are all gone. **I deviated from the brief
  here.** The paragraph to delete also says "`src/constants/work.ts` stays:
  `CASE_STUDY` is raw material for the real Aptium write-up", which is still
  true and still needed. I deleted the dead-routes sentence and kept that one
  as its own paragraph. To match the brief exactly, delete those two lines.
- 3.4: **the brief places this in the wrong section.** The line-height text is
  in `# The two rules that break things silently` → `## 2.`, not under
  `## Known traps`. The text was unique, so the replacement was unambiguous.
- The diff touches only the five targets.
- **Commit `091c5efc030515d4ff9a478e244909a12d158522`**.

**Verify (at `091c5ef`)**
- `pnpm tsc --noEmit`: exit 0.
- `pnpm lint`: exit 0.
- `pnpm test:ci`: 41 suites, 591 tests, all pass.
- `pnpm build`: exit 0, 29 static pages. The only warning is the known
  `NODE_TLS_REJECT_UNAUTHORIZED=0` from `.env.local` (not touched).
- axe-core 4.12.1 (installed, nothing added): all 21 sitemap routes plus the
  404, light and dark, with tags wcag2a/aa, wcag21a/aa, wcag22aa and
  best-practice. **0 violations.**

**Left stale, outside this brief's exact replacements**
- The `CLAUDE.md` Stack section still says "`output: 'standalone'` — deployed
  as a self-contained Node server". The new Deployment section contradicts it.
- The old Deployment section pointed to `docs/DEPLOYMENT.md`, which presumably
  still describes Coolify. Nothing points to it now.
- `home.scss` `.home-org__plate` hardcodes `background: #f4f7f5`. CLAUDE.md
  says never hardcode a hex. This is pre-existing and was not touched.

**Wrong with the brief**
- 3.3: deleting the whole paragraph would also delete the `work.ts` note
  (kept; see above).
- 3.4: wrong section heading.
- 2.1: "the site's existing focus token" is ambiguous between `$border-focus`
  and the ring the chrome actually uses.
- 2.3: "exactly as it does now" cannot be met to the pixel with the required
  structure; it is met visually.
- 2.4: `ProjectMedia` had no way to receive an accurate `sizes`.

**Not committed:** this log and `docs/briefs/launch-polish.md`. The brief allows
exactly two commits. Commit them with the next docs change, or tell me to.
`.claude/`, `_to_delete/` and `.env.local` were left alone, as before.

STATUS: done
