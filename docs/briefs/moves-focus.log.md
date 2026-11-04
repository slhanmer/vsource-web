# Log — moves-focus

4 November. Branch `development`, from `82df6ad`. One commit, this log
included. Run before cms resumes, as the brief says. The cms work in progress
(A.1–A.2) was set aside with a pathspec `git stash` covering only its own
files, so this commit sits on the current layout. It is restored afterwards.
The 3200 dev server stayed up; it was restarted once onto this tree. The checks
ran against a production build on `next start -p 3100`.

The brief matched the code.

## 1. Each row is one screen

- **The scroller's height without arithmetic.** The shell deliberately has no
  `calc(100dvh - <header>)` anywhere (`shell.scss`, top comment), and there is
  no header-height token to subtract. So `.site-scroll` is now a size
  container (`container-type: size`). It takes its size from the 100dvh flex
  frame, never from its content, so this is safe. A registered property
  `--scroller-h` (`@property … syntax: '<length>'`) is set to `100cqh` on
  `#main`. Because it is registered, it resolves to pixels there and inherits
  as a number, so no nearer container can reinterpret it. Measured: 797px at
  1440×900 and 759px at 390×844, exactly `#main.clientHeight`.
- `.home-step` has `min-height: var(--scroller-h)`, its content centred
  (flex column, `justify-content: center`), and a small block padding. The grid
  moved to a new `.home-step__inner`. The inter-row margin from moves-layout
  is gone.
- Narrow screens grow rather than clip. At 390 the Software row's content
  (726px) plus padding comes to 793px, taller than the 759px screen, and the row
  grew to 793px.

## 2. The fade

- **The timeline is the row, and the content wrapper animates on it.**
  `.home-step` declares `view-timeline: --step block`, and
  `.home-step__inner` runs `animation: home-step-focus linear both;
  animation-timeline: --step; animation-range: cover 0% cover 100%`. The
  brief said `view()` on the content wrapper. I named the row's timeline
  instead because the row is exactly one screen tall, so `cover` maps onto
  "which row is being read" identically for all three, whatever each one's
  content height. The wrapper's own `view()` would shift with its height.
  The nearest scroll container is `#main`, as required. The whole row content
  fades together: cut box, Now plate, Instead, solution, link and photo.
- **Ranges settled on** (percent of `cover`; a one-screen row has the next row
  exactly 50% behind it):

  | cover | opacity | movement |
  |---|---|---|
  | 0–16% | 0 | 12px down |
  | 16–36% | 0 → 1 | rises 12px → 0 |
  | 36–64% | 1 | none (50% = the row exactly fills the screen) |
  | 64–84% | 1 → 0 | none |
  | 84–100% | 0 | none |

  In the brief's terms, the fade-in runs from 32% to 72% of the entry range
  and the fade-out from 28% to 68% of the exit range. Opacity is above 0.5
  only between 26% and 74% of cover, a 48% window, so with rows 50% apart two
  rows can never both be past half.
- **The photo's IntersectionObserver fade is deleted**, along with its
  `is-waiting`/`is-revealed` CSS and the reduced-motion override for it.
  `StreamMoves` no longer needs state or effects, so it is now a **server
  component**: no `'use client'`, nothing to hydrate. Its header comment is
  rewritten. It describes one stream in focus at a time, and keeps the part
  that stays true: the page scrolls normally, with no pinning, no sticky, no
  scroll-jacking and no snapping.
- **Fallbacks.** The animation sits inside
  `@supports (animation-timeline: view())` and
  `@media (prefers-reduced-motion: no-preference)`, so without support or
  with reduced motion nothing is applied and every row is at opacity 1. The
  site's global reduced-motion rule also lists `.home-step__inner`. There is no
  JavaScript involved, and the text is in the HTML regardless.

## 3. Accessibility

- `.home-step:focus-within .home-step__inner { animation: none; opacity: 1 }`
  goes inside the same `@supports`/motion block. The browser scrolls a
  focused link only as far as it must, which can leave the row mid-fade, so
  this rule is needed. It has to drop the animation, because an animation
  outranks a plain declaration.
- Faded rows are not hidden from assistive technology. There is no
  `aria-hidden` and no `visibility`.

## Verify

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean (after clearing stale `.next/dev` types left by the 16.3 dev server) |
| `pnpm lint:ci` | clean |
| `pnpm test:ci` | 594 pass |
| `pnpm build` | passes |

All of the following hold at 1440×900 and 390×844, light and dark, in
Chromium.

1. **Scroll in 10% steps:** at no step were two rows above 0.5. One step
   table, 1440 dark, the handover from Software to Robotics (scrollTop:
   Software / Robotics / Websites):

   ```
   1216: 1    / 0    / 0
   1296: 0.95 / 0    / 0
   1376: 0.7  / 0.2  / 0
   1456: 0.45 / 0.45 / 0
   1535: 0.2  / 0.7  / 0
   1615: 0    / 0.95 / 0
   1695: 0    / 1    / 0
   ```

   At 390 the taller first row shifts the crossover slightly
   (`0.53 / 0.34`, then `0.29 / 0.58`). It is still never two above half. Full
   tables are in `results.json`.
2. **Centred:** with each row centred, it is at 1 and the other two are at 0
   (`[1,0,0]`, `[0,1,0]`, `[0,0,1]`) in every view.
3. **Reduced motion:** every row is at 1 at every position sampled.
4. **No support:** Firefox is not installed for Playwright here, so I
   simulated it in Chromium by deleting the `@supports (animation-timeline…)`
   rule at runtime. Every row is at 1 and the layout is unchanged
   (`-no-support.png`).
5. **Tab:** each "See how it works" link is at opacity 1 the moment it is
   focused, and fully on screen.
6. **axe on `/`:** 0 violations in all four views.

## Screenshots — `C:\tmp\moves-focus\`

- `{1440,390}-{light,dark}-centred-{software,robotics,websites}.png`
- `{…}-focus-{row}.png`
- `{…}-no-support.png`
- `results.json`, with the full step tables

STATUS: done
