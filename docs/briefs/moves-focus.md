# Brief — moves-focus

**Run next, before `cms` resumes.** CSS-led, small.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only. One commit. The dev server on 3200 stays up.
**Read `CLAUDE.md` first.**

Simon's review (4 November, after `moves-flip`): "What changes" is too busy,
with all three rows on screen at once. He wants **one stream in focus at a
time**: as you scroll, a row fades in, holds while it is the one you are
reading, then fades out as the next arrives.

This reverses the "nothing leaves" decision in `StreamMoves.tsx`'s header
comment. Rewrite that comment; do not defend the old one. What it got right,
and must stay true: **the page scrolls normally.** No pinning, no
`position: sticky` stage, no scroll-jacking, no snapping. A row is a normal
block in the flow, and only its opacity responds to where it is.

Where the brief does not match the code, stop and log it.

---

## 1. Each row is one screen

- Each `.home-step` gets `min-height` equal to the scroller's visible height
  (`#main`'s height, not `100vh`, since the header sits outside it; use a
  custom property set where that height is known, or `100svh` minus the
  header token if that is how the site already does it). Its content is
  vertically centred inside that height.
- Remove the inter-row margin from `moves-layout`. The row height now does the
  spacing.
- Narrow screens: if a row's content is taller than the screen, the row grows
  to fit it. Never clip.

## 2. The fade, driven by scroll position

Use **CSS scroll-driven animations**: `animation-timeline: view()` on each row's
content wrapper. The nearest scroll container is `#main`, which is correct (see
`CLAUDE.md`, "The two rules").

- One keyframe set on the whole row content (cut box, Now plate, Instead,
  solution, link and photo together):
  - entering: opacity 0 → 1 with the 12px rise, over the first ~35% of the
    entry range
  - holding at 1 through the middle
  - leaving: opacity 1 → 0 over the last ~35% of the exit range, no movement
- Tune `animation-range` so **at any scroll position at most one row is above
  ~0.5 opacity**, and the row centred on screen is at 1. Log the ranges you
  settled on.
- **Delete the photo's IntersectionObserver fade** from `moves-layout`. The row
  fade replaces it. If the component no longer needs to be a client component,
  make it a server component.

### Fallbacks (non-negotiable)

- `@supports not (animation-timeline: view())`: no animation, everything fully
  visible. Firefox ships without it today.
- `prefers-reduced-motion: reduce`: no animation, everything fully visible.
- No JavaScript: everything visible. A pure-CSS solution gives this for free.
- The text is in the HTML and readable by a crawler regardless.

## 3. Accessibility

- Tabbing to a row's link must bring it into view at full opacity. Check that
  the focused link is never sitting in a faded row. If it can be, give
  `:focus-within` on the row `opacity: 1` (overriding the animation).
- Text in a fully faded row is still in the accessibility tree. That is
  correct; do not `aria-hide` it.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

In Chromium, at 1440×900 and 390×844, light and dark:

1. Scroll through the section in steps of 10% of the screen height. At each
   step, log every row's computed opacity. At no step should two rows be above
   0.5.
2. Screenshots at the moment each row is centred: only that row is visible.
3. Under `prefers-reduced-motion: reduce`, all three rows are at opacity 1.
4. Simulate no support (disable the `@supports` branch or test in Firefox if
   available): all rows visible, nothing broken.
5. Tab through the links: each one is at opacity 1 when focused.
6. axe on `/`, light and dark: 0 violations.

Screenshots go to `C:\tmp\moves-focus\`.

## The log

Append to `docs/briefs/moves-focus.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
