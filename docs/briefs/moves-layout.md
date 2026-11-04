# Brief — moves-layout

**Repo:** `V Souce Development` · **Branch:** `development`
**Push:** `development` only. One commit. The dev server on 3200 stays up.
**Read `CLAUDE.md` first.**

Simon's review (4 November) of "What changes" (`StreamMoves.tsx`): make it a
real two-column layout, stop the text from animating, and tie it visually to
the hero. This reverses the two-beat reveal from `photo-balance` and
`review-1`. Rewrite the comments that defend that design; do not keep them.

Where the brief does not match the code, stop and log it.

---

## 1. Layout: two columns that fill

Each stream is one row on wide screens:

| left column (text) | right column (photo) |
|---|---|
| `Now` eyebrow → problem → the stream name in a cut box (§2) → solution → `Sounds familiar? · See how it works` | the step photo |

- The photo's **top aligns with the `Now` eyebrow**, and **its height matches
  the text column** (`align-items: stretch`, photo `object-fit: cover`), with a
  floor of 4:3 so a short text column does not flatten it. There is no empty
  column under the problem any more.
- Columns roughly 1fr / 1fr. The gap stays inside the page's existing column
  grid.
- The image stays on the right for all three rows. Do not alternate sides.
- One consistent vertical gap between rows. Tight enough that each row reads
  as its own unit, without a screen of nothing between them.
- Narrow screens: `Now`/problem, then the photo full width, then the cut box and
  the answer.
- The photo follows the `review-1` corner rule (free-standing, so it keeps
  `$radius-md`).

## 2. The stream name in the hero's black box

The hero's word sits in a black cut slot. Use the **same treatment for the
stream name** in each row (Software / Robotics / Websites) in place of the
plain heading.

- **Static.** No typing, no caret, no animation. The hero already types. A
  second, third and fourth typing animation on one page would compete with it
  and make the page slower to read.
- **Share the styles, don't copy them.** Extract the slot's visual treatment
  (fill, edge, padding, type) from `.rotator__slot` into one shared class or
  small component, used by both the hero and these names. The hero's fixed
  width and typing logic stay in the hero.
- It stays the row's `<h3>` (with the existing `id` for `aria-labelledby`). The
  box is styling on the heading, not a wrapper with a separate heading inside.
- Sized to the step's scale, not the hero's: roughly the current `h3` size.

## 3. Motion: only the photo

- **Text never animates.** The problem, the cut box, the solution and the link
  are rendered visible from the first paint, always.
- **The photo fades in once** as it scrolls into view: opacity 0 → 1 with a
  12px rise, 500ms, `ease-out`, the same values as `review-1`. No motion under
  reduced motion, and it is visible before hydration and without JavaScript.
- That means one `IntersectionObserver` per photo (root `#main`, observe once,
  then unobserve). The two-beat machinery is no longer needed: delete the
  `said`/`replied` state, `REPLY_MARGIN`, `is-told`, and their CSS. Keep the
  priming rule that photos already on screen at load do not animate.
- Keep `#main` as the observer root (see `CLAUDE.md`, "The two rules").

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

At 1440×900 and 390×844, light and dark:

1. Each row: photo top aligned with `Now`, photo height equal to the text
   column (measure both and log them), and no empty column.
2. The stream names render in the same black box as the hero slot, and the hero
   is visually unchanged (before/after screenshot of the fold).
3. Text is visible with JavaScript disabled, and on load before any scroll.
4. Photo fade: frames at 0, 150, 300 and 500ms. None under reduced motion.
5. axe on `/`, light and dark: 0 violations.

Screenshots go to `C:\tmp\moves-layout\`.

## The log

Append to `docs/briefs/moves-layout.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
