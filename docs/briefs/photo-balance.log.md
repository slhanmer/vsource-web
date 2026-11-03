# Log — photo-balance brief

## Run 1 — 2026-11-03 — development

All three sections are done, as one commit pushed to `development`, after
warmth Stage 2 (`5309eb0`). This is layout only: no copy changes and no new
photos. One deviation, the reply margin in §2/§3, is explained below.
Verification used `next start` on **port 3124**, in Chromium.

### 1. Fold doors

- The photograph is the door's first grid column at **40%**, flush to the
  top, bottom and left edges, with no padding. The opening has
  `overflow: hidden`, so its radius clips the photo's outer corners. The
  image is `position: absolute` inside its figure with `object-fit: cover`,
  so it fills whatever height the door has and never sets that height
  itself. `object-position` is the default centre. All six crops read
  correctly at that position, so no per-photo value was needed.
- **The recessed edge is on the door, not the photo.** It is drawn by
  `.home-door__cut::after` over both the photo and the copy. The
  CutPhoto's own `__edge` is hidden in the door. The hover and focus ring
  moved to that layer too.
- "Learn more" is now inside `home-door__body`, under the lede and
  left-aligned with it. The `home-door__media` wrapper is gone.
- **Equal height:** `.home-doors` has `grid-auto-rows: 1fr`.
- **Height landed on: 172px per door at 1440×900** (577px wide, photo
  231×172). The fold fits in both themes: the CTA bottom is at 762px and the
  plate foot's bottom at 878px of 900. The doors were about 200px tall
  before; they now take their height from the column beside them. A 231×172
  photo reads well, so I did not force them taller.
- **A fix this needed:** `.home-hero__inner` got `width: 100%`. Its
  `margin: 0 auto` inside the plate's grid shrink-wraps it to its content,
  and a 40% column has no content width, so on the first build the doors
  narrowed to 482px. This is the same trap as CLAUDE.md #3, on a grid item.
- `sizes`: `(max-width: 480px) 64px, (max-width: 979px) 36vw,
  (max-width: 1440px) 17vw, 232px`.
- The compact-tier padding rules (`max-height: 820px`, 481–979px, 680px
  tall, 420×680) moved from `__cut` to `__body`. The dead
  `.home-door__media` gap rules and the 76px photo width went with them.

**Brief vs code, narrow screens:** the brief says to "keep whatever the
current stacked behaviour is, with the photo as a full-width band across the
top". The doors are not stacked at any width. At ≤480px each door is a row:
the name on the left, with the lede hidden, and a 64px 4:3 thumbnail on the
right. The CSS comment says that layout exists because a stacked door
"pushed the plate's foot off a 390x844 screen". Three 16:9 bands at 390px
would be about 3 × 190px of photo on top of the copy, and would push the
doors well past the fold. **I kept the current row layout and did not add
the band.** The only change at that size is that "Learn more" now sits under
the name instead of beside the thumbnail. At 390×844 the doors are 73px
tall and all three fit. If Simon wants the band anyway, the fold promise has
to give at that width, and that is his call.

### 2. "What changes": the photo arrives with the answer

- The photo's hidden and shown rules moved from `is-out`/`is-in` to
  `:not(.is-told)`/`.is-told`. They now share one selector list with the
  answer, so the transition is identical (`opacity 0.55s`, `transform
  0.75s`, translateY 18px).
- Updated: the component's header comment, the doc comments on both margin
  constants, the beat-one CSS comment (now "the situation states itself; the
  photograph and the answer are still waiting"), and the reduced-motion
  selector list (`.home-step:not(.is-told) .home-step__photo`).
- Two stale CSS comments still said "the mark draws itself beside it", left
  over from before warmth Stage 3. I corrected them while I was in there.

**Priming at 1440×900:** the first step is **not** primed. Its top is at
1,057px in `#main` on load, below the 797px scroller, so it starts `is-out`
and animates. Simon should see it at that size.

**Scroll capture**, from the top, with `#main.scrollTop` stepped in 10px
increments:

| step | beat one (`is-in`) | beat two (`is-told`) | photo opacity after beat two: +0 / +250ms / +1050ms |
|---|---|---|---|
| software | 450 | 830 | 0.001 / 0.79 / 1 |
| websites | 1050 | 1440 | 0.001 / 0.79 / 1 |
| engineering | 1660 | 2040 | 0.001 / 0.72 / 1 |

At beat one the photo and the answer both measure opacity 0.001. Captures:
- `C:\tmp\photo-balance\scroll-software-1-before-beat-two.png` · `scroll-software-2-after-beat-two.png`
- `C:\tmp\photo-balance\scroll-websites-1-before-beat-two.png` · `scroll-websites-2-after-beat-two.png`
- `C:\tmp\photo-balance\scroll-engineering-1-before-beat-two.png` · `scroll-engineering-2-after-beat-two.png`

**Deviation: `REPLY_MARGIN` changed from `-52%` to `-70%`.** With the photo
at full column width, the first capture run (on `-52%`) fired beat two while
the answer's top was at **834px in a 797px scroller**. The photo faded in on
screen, but the answer faded in below the bottom edge, so it was already in
place by the time you scrolled to it. That is the "could not see a fade"
problem again, in a new place. At `-70%` the answer's top is at **680–685px
of 797** when it arrives, so both are visible as they fade in. It is a
one-line constant with a comment, if Simon wants it back.

### 3. "What changes": a bigger photo, a balanced step

- The photo is `align-self: stretch` with `aspect-ratio: 3 / 2`, and the
  340px cap is gone. At 1440 it is **570×380**.
- **Top alignment:** on wide screens the "Now" line is absolutely positioned
  above the problem, in the step's top padding, so it no longer pushes the
  problem down. The problem has `text-box-trim: trim-start` with
  `text-box-edge: cap alphabetic`, behind `@supports`. Measured offset
  between the problem's top and the photo's top: **0px** on all three steps.
- **Gap between steps:**

  | | before | after |
  |---|---|---|
  | step `min-height` | `min(68svh, 680px)` = 612px | none |
  | step `padding-top` | `clamp(24px, 5vh, 64px)` = 45px | `clamp(44px, 6vh, 64px)` = 54px |
  | step pitch at 1440×900 | 612px | 606px (content, not slack) |
  | `REPLY_MARGIN` | −52% | −70% |
  | scroll from one answer (`is-told`) to the next problem (`is-in`) | 380px | **220px** |
  | scroll between a step's two beats | 230px | 380px |

  The step is now as tall as its content: 54px padding, a 380px photo,
  then the answer. The empty space that used to sit under each answer is
  gone. The next problem starts entering 220px after the answer arrives,
  which is about when the answer has scrolled fully into view. That is the
  brief's "as the current answer settles".
- Narrow screens (≤979px) stack the step as problem, photo at full width,
  then answer. The "Now" line is back in flow there.
- `sizes`: `(max-width: 979px) 92vw, (max-width: 1440px) 40vw, 580px`.

### Verify

- `pnpm tsc --noEmit` clean · `pnpm lint` clean · `pnpm test:ci` 42 suites /
  594 tests · `pnpm build` passes.
1. The fold at 1440×900 shows all three doors and the CTA, in both themes.
   The numbers are above.
2. The scroll capture is above: the photo is hidden before beat two and
   shown after it.
3. Screenshots, taken on `next start` after the headline had stopped:
   - Fold: `C:\tmp\photo-balance\home-1440-light-fold.png` · `home-1440-dark-fold.png` · `home-390-light-fold.png` · `home-390-dark-fold.png`
   - Steps: `C:\tmp\photo-balance\home-{1440,390}-{light,dark}-step-{software,websites,engineering}.png` (12 files)
4. axe-core 4.12.1 on `/` at 1440, light and dark, after the steps were
   revealed: **0 violations**.

STATUS: done
