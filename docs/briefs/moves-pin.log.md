# Log — moves-pin

4 November. Branch `development`, from `1fa1003`. One commit, this log
included. This replaces what moves-focus built. The cms work in progress was
stashed by pathspec before starting, so this commit sits on the current
layout. The 3200 dev server stayed up (restarted once for the stash). The
checks ran on `next start -p 3100`.

The brief matched the code.

## 1. Structure

- `.home-moves` → `.home-moves__stage` (heading + `.home-moves__rows`) →
  three `.home-step`. The heading is inside the stage, directly above the
  rows.
- **Pinned mode** (where it applies, see §3):
  - `.home-moves` is the track: `height: calc(3 * var(--scroller-h))`, with no
    padding, which is **2,391px at 1440×900**. The stage pins for the track
    minus one screen (1,594px), so each stream gets about 530px of scroll,
    two thirds of a screen.
  - `.home-moves__stage` is `position: sticky; top: 0`, one `--scroller-h`
    tall (797px at 1440×900), with its content centred.
  - `.home-moves__rows` is a one-cell grid with `align-items: start`. Each row
    is `grid-area: 1 / 1`, so the cell is as tall as the tallest row.
- moves-focus's per-row `min-height: var(--scroller-h)`, its per-row
  `view-timeline` and its `home-step-focus` keyframes are all removed. The
  `--scroller-h` property in `shell.scss` stays, because the track and stage
  use it.
- **Heading-to-row gap: 46px at 1440 and 26px at 390.** This is the heading's
  own `margin-bottom: clamp(26px, 3.2vw, 48px)` from plain flow, unchanged.
  It is the section's normal heading spacing, not a screen. For comparison,
  the partners section head uses `clamp(22px, 3vw, 38px)`, 38px at 1440.

## 2. The swap

- `view-timeline: --moves block` on the section. The rows animate against it
  with `animation-range: contain 0% contain 100%`. The section is taller than
  the scroller, so its `contain` range runs exactly while the stage is
  pinned. **`timeline-scope` is not used:** the rows are descendants of the
  section, so the named timeline is already visible to them. `timeline-scope`
  only matters for non-descendants.
- Three keyframe sets: first, middle and last. With boundaries B at 33.3% and
  66.7% of the track:
  - The outgoing row fades out over B−3.3% → B+1.7%, opacity only.
  - The incoming row fades in over B−1.7% → B+3.3%, with the 12px rise.
  - The outgoing row is above 0.5 until B−0.8%, and the incoming row only from
    B+0.8%.
- `fill: both`: Software is showing before the stage pins, and Websites stays
  after it unpins.
- `pointer-events` is animated alongside opacity. It flips at the midpoint of
  each fade, so a row that isn't showing can't be clicked.

## 3. Fallbacks and accessibility

- The default CSS is plain flow at the moves-flip spacing:
  `& + & { margin-top: clamp(56px, 7vw, 104px) }`, measured at 101px at 1440
  and 56px at 390. Everything pinned sits inside
  `@supports (animation-timeline: view())` and
  `@media (prefers-reduced-motion: no-preference) and (min-width: 980px) and (min-height: 860px)`.
  So Firefox, reduced motion, small screens and no-JS all get plain flow with
  every row visible.
- **The breakpoint, from measurement.** I measured the stage content (heading +
  gap + tallest row) plus the 103px header, which is the viewport height
  needed to pin without clipping:

  | width | 980 | 1024 | 1100 | 1280 | 1366 | 1440 | 1600 | 1920 |
  |---|---|---|---|---|---|---|---|---|
  | needs viewport ≥ | 716 | 733 | 736 | 800 | 831 | 846 | 853 | 853 |

  The worst case is 853px, so the floor is **`min-height: 860px`**. Width is
  floored at the desktop breakpoint (980px). Below it the stacked layout makes
  each row 670–790px tall on its own, more than a phone's scroller. One
  consequence: a 1366×768 laptop gets plain flow. At 1366 it would need 831px.
- **Keyboard: JavaScript, not `:focus-within`.** Forcing a focused row opaque
  in CSS would sit it on top of the row that is showing. Also, tabbing between
  stacked rows never scrolls, because the next link is already "in view". So
  `MovesFocus.tsx`, a client component that renders nothing, listens for
  `focusin` on the section. Only when the stage is actually sticky, and the
  focused row isn't the one showing, it scrolls `#main` instantly to the
  middle of that row's third of the track. In plain flow it does nothing.
- Nothing is `aria-hidden` and nothing uses `visibility`. Every row stays in
  the accessibility tree.

## 4. Comments

`StreamMoves.tsx`'s header is rewritten for the stage. It explains why the
stage is safe: native scroll, the swap in CSS, and a complete fallback to plain
flow. It also explains the one script.

## Verify

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint:ci` | clean |
| `pnpm test:ci` | 594 pass |
| `pnpm build` | passes |

1. **Steps of 5% of the track** (1440 dark; light identical). The stage top is
   measured relative to the scroller; columns are Software / Robotics /
   Websites opacity, then pointer-events:

   ```
    -10%  stageTop   160  1 / 0 / 0     (section arriving, not yet pinned)
      0%  stageTop     1  1 / 0 / 0
   5–30%  stageTop     0  1 / 0 / 0
     35%  stageTop     0  0 / 0.67 / 0
  40–60%  stageTop     0  0 / 1 / 0
     65%  stageTop     0  0 / 0.67 / 0
 70–95%  stageTop     0  0 / 0 / 1
    100%  stageTop    -1  0 / 0 / 1
    110%  stageTop  -160  0 / 0 / 1     (unpinned, scrolling away)
   ```

   The stage holds at 0 through the whole track, and **at most one row is
   above 0.5 at every step**. At 390×844 the stage doesn't pin, which is the
   fallback by design.
2. **Gap: 46px at 1440 and 26px at 390**, the heading's normal
   `margin-bottom` (§1).
3. **Reduced motion and `@supports` forced off** (the rule deleted at
   runtime; Firefox isn't installed for Playwright): the stage is `static`,
   all three rows are in normal flow at opacity 1, with gaps of 101/101px at
   1440 and 56/56px at 390.
4. **Tab:** in pinned mode each link, when focused, is in a row at opacity 1
   with the other two at 0. The link is the element under its own centre, so
   it is clickable. `#main` moved 1070 → 1601 → 2132, one row's third each.
   In plain flow (390) all three are visible and clickable as normal.
5. **axe on `/`:** 0 violations, light and dark, at 1440 and 390.

Also fixed while verifying: in the stage's flex column, the heading's
`margin: 0 auto` shrink-wrapped and centred it. It now has `width: 100%` in
pinned mode and sits on the rows' left edge.

## Screenshots — `C:\tmp\moves-pin\`

- `1440-{light,dark}-pinned-{software,robotics,websites}.png`
- `1440-{light,dark}-focus-{row}.png`
- `390-{light,dark}-flow-{row}.png`, the fallback
- `results.json`, with the full step tables

STATUS: done
