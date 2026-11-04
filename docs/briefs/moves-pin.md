# Brief — moves-pin

**Run next.** It replaces what `moves-focus` built. Then carry on with the
queue (`hero-doors`, then the rest of `cms`).
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only. One commit. The dev server on 3200 stays up.
**Read `CLAUDE.md` first.**

Simon's review of `moves-focus` (4 November): the one-at-a-time fade is right,
but he meant **scroll in place**. The section should hold still on screen
while you scroll, and the three streams should swap within it. Also, **the gap
between the section heading and the first row is far too big**: the
full-screen row height left a screen of nothing under the heading.

So: a **sticky stage**. This is still native scrolling. No snapping, no wheel
hijacking, and no JavaScript scroll handling if CSS can do it. The page scrolls
as normal; the stage just stays pinned while its section passes underneath.

Where the brief does not match the code, stop and log it.

---

## 1. Structure

- The section (`.home-moves`) is a **tall track**: roughly one scroller-height
  per stream, so 3× `--scroller-h`. Tune it so each stream gets about one
  comfortable flick of reading. Log the value.
- Inside it, a **sticky stage**: `position: sticky; top: 0`, height
  `--scroller-h`, with the content vertically centred. The **section heading
  ("What changes / Where you are now, and what you have instead.") is inside
  the stage**, directly above the row area, so it stays put with the streams.
  The gap between heading and row is the site's normal heading-to-content
  spacing, **not** a screen.
- The three rows are **stacked on top of each other** in the row area (a single
  grid cell, `grid-area: 1 / 1` each). The area is as tall as the tallest row,
  and rows align to its top.
- Remove `moves-focus`'s per-row full-screen `min-height` and per-row
  `view()` animation.

## 2. The swap, driven by scroll position

Pure CSS scroll-driven animation: a `view-timeline` on the section, shared to
the rows with `timeline-scope`, and each row animated against it with its own
`animation-range`.

- Row 1 is fully visible when the section pins, and holds for its third.
- Around each boundary, the outgoing row fades out (opacity only) while the
  incoming row fades in with the 12px rise: a **short crossfade**, roughly the
  last tenth of one third into the first tenth of the next.
- Row 3 holds fully visible until the section unpins and scrolls away.
- At no scroll position are two rows above 0.5 opacity.
- Inactive rows get `pointer-events: none`, so a hidden link cannot be clicked.

## 3. Fallbacks and accessibility (non-negotiable)

When any of these apply, **no sticky stage and no stacking: the three rows
render one after another in normal flow, all visible**, at the old spacing
from `moves-flip`:

- `@supports not (animation-timeline: view())` (Firefox today)
- `prefers-reduced-motion: reduce`
- no JavaScript (a pure-CSS solution gives this for free)
- narrow screens where a row is taller than the stage would allow. Decide the
  breakpoint from measurement and log it. Never clip a row.

Keyboard: if a link in a stacked row receives focus, that row must be the one
showing. Either `:focus-within { opacity: 1; pointer-events: auto }` on the row,
which wins over the animation, or, if that leaves two rows overlapping visibly,
the smallest bit of JavaScript that scrolls `#main` to that row's third on
focus. Log which.

All text stays in the DOM and the accessibility tree. Nothing is
`aria-hidden`.

## 4. Comments

Rewrite `StreamMoves.tsx`'s header comment for the sticky stage, and say why
it is safe: native scroll, CSS-driven, and a full fallback to plain flow.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

Chromium, 1440×900 and 390×844 (or the fallback breakpoint), light and dark:

1. Scroll through the section in steps of 5% of its track. Log each row's
   opacity per step, and the stage's top. The stage stays pinned through the
   track, and never are two rows above 0.5.
2. The heading-to-first-row gap, measured. It matches the site's normal section
   heading spacing.
3. Under reduced motion and with the `@supports` branch forced off: three rows
   in normal flow, all visible.
4. Tab through all three links: each is visible and clickable when focused.
5. axe on `/`, light and dark: 0 violations.

Screenshots at the pinned position for each stream go to `C:\tmp\moves-pin\`.

## The log

Append to `docs/briefs/moves-pin.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
