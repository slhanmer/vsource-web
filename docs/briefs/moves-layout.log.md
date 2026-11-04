# Log — moves-layout

4 November. Branch `development`, from `ab091a7`. One commit, this log
included. The dev server on 3200 stayed up throughout. The checks below ran
against a production build on `next start -p 3100`.

The brief matched the code. Nothing needed stopping.

## 1. Layout

`.home-step` is now a three-area grid. On wide screens it is
`say photo / answer photo`, with columns `1fr 1fr` and rows `auto 1fr`. On
narrow screens (≤ 979px) it stacks as `say / photo / answer`. The markup has
no wrapper per column, so the narrow order needs no duplicate markup. The photo
is on the right in all three rows.

- The photo cell (`.home-step__media`) stretches over both rows. It is an
  inline-size container, so the photo's floor is `min-height: 75cqi`: 4:3 at
  whatever width the column has. That floor is also the cell's contribution to
  the rows, so a short text column grows to the photo instead of flattening
  it. Any spare height goes under the answer (`1fr` row), not between the
  problem and the cut box. The image is absolutely placed with
  `object-fit: cover`, so its own proportions never set the height.
- "Now" is back in flow. The old wide-screen rule that hung it above the
  problem in absolute position is gone, so the row's top *is* the "Now" line.
  The sticky problem column is gone too: it only existed to hold the problem
  while the second beat arrived.
- One gap between rows: `.home-step + .home-step { margin-top: clamp(56px, 7vw, 104px) }`.
  The old per-step top padding, which was sized to space out the two beats, is
  gone.
- The photo is free-standing, so it keeps `$radius-md` (measured: 8px), as the
  review-1 corner rule says.

**Measured** (px; "text" is the top of "Now" to the bottom of the link line):

| View | Row | Now top − photo top | text | photo | 4:3 floor |
|---|---|---|---|---|---|
| 1440 light/dark | Software | 0 | 388.7 | 438.0 | 438.0 |
| | Robotics | 0 | 414.8 | 438.0 | 438.0 |
| | Websites | 0 | 388.7 | 438.0 | 438.0 |
| 1000 | Robotics | 0 | 330.5 | **330.5** | 318.8 |
| 390 light/dark | all three | stacked: say → photo → answer, measured in order | — | 255 (340 wide, 4:3) | — |

At 1440×900 the text column is shorter than a 4:3 photo, so **the floor sets
the height**, and 23–49px of plate shows under the link. The photo matches the
text exactly wherever the text is the taller of the two (1000px, Robotics,
above). The same holds at 1100, 1280 and 1920, all measured: the photo top is
level with "Now" in every row, and the photo is never shorter than the text.
If Simon wants the two exactly equal at 1440, the floor has to go below 4:3,
which the brief rules out.

## 2. The stream name in the cut slot

- `.cut-slot` (in `home.scss`, just above the rotating headline) holds the
  slot's whole visual treatment: fill, inset edge, `4px` radius,
  `clip-path`, the cap-band padding with its `text-box-trim` and fallback, and
  the type (Newsreader, 400). The long comment explaining the cap band moved
  with it. Every measurement is in em, so it sizes to whatever font-size it is
  given.
- `.rotator__slot` keeps only what is the hero's own: the baseline alignment,
  the positioning for the caret, and left text. The fixed width and typing stay
  in `RotatingHeadline.tsx`. The hero's slot is now
  `className="cut-slot rotator__slot"`.
- Each row's name is `<h3 id="{slug}-name" class="home-step__name cut-slot">`.
  The box is styling on the heading itself, so `aria-labelledby` is unchanged.
  It uses the old `h3` size: `clamp(22px, 2.3vw, 32px)`, which measures 32px at
  1440 and 22px at 390. It is static, with no caret and no animation.
- Measured: the name and the hero slot compute identically for background,
  box-shadow, radius, clip-path, font family and weight, in both themes.
- **Hero unchanged:** a pixel diff of the hero and the whole fold, before and
  after, at 1440 and 390 in light and dark, is **0 pixels different** in all
  eight comparisons.

One visible consequence: the names change face from Chakra Petch to
Newsreader, because the type is part of the shared treatment.

## 3. Motion: only the photo

- `StreamMoves.tsx` is rewritten. The `said`/`replied` state,
  `SAY_MARGIN`, `REPLY_MARGIN`, `is-in`/`is-out`/`is-told` on the step, and
  the `__say`/`__reply` reveal CSS (including their reduced-motion overrides)
  are all deleted. The header comment and the CSS comments that defended the
  two-beat design are rewritten, not kept.
- One `IntersectionObserver`, root `#main`, observes each photo cell once and
  unobserves on the first hit. Each photo is in one of three states: `shown`
  (the default: visible, no transition), `waiting` (hidden), or `revealed`
  (visible, transitioning). Priming is kept. Arming waits one frame, and any
  photo already on screen then stays `shown` and never animates. The
  transition is only on `is-revealed`, so hiding a photo off screen does not
  itself animate.
- The fade is `opacity 0 → 1` with `translateY(12px) → 0`, 500ms
  `ease-out`, once. Under reduced motion nothing is armed, and the CSS fallback
  forces `is-waiting` visible too.

**Measured:**

- **Text with JS disabled:** problem, name, solution and link at opacity 1 in
  every row. Photos also at opacity 1, with no state class. (1440 and 390,
  light and dark.)
- **Text with JS on, at load before any scroll:** "Now", problem, name,
  solution and link at opacity 1 with no transform, in every row. Photos below
  the fold are `is-waiting`. The text in the faded row has 0 running
  animations.
- **Photo fade**, measured from the moment `is-revealed` lands:

  | ms | opacity | rise left |
  |---|---|---|
  | 0 | 0.00 | 12px |
  | 150 | 0.36–0.45 | 6.7–7.7px |
  | 300 | 0.75–0.79 | 2.6–3.0px |
  | 500 | 1.00 | ≤ 0.02px |

- **Reduced motion:** after scrolling to the bottom, every photo is
  `home-step__media` (never armed), opacity 1, transition 0s.

## Verify

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint:ci` | clean (two prettier line-wraps fixed with `eslint --fix`) |
| `pnpm test:ci` | 42 suites, 594 tests pass |
| `pnpm build` | passes |
| axe on `/`, light and dark, 1440 and 390 | 0 violations |

## Screenshots — `C:\tmp\moves-layout\`

- `before/{1440,390}-{light,dark}-{fold,hero,moves}.png`: before the change,
  from the dev server
- `{1440,390}-{light,dark}-fold.png`, `-hero.png`: after, for the
  unchanged-hero comparison
- `{…}-moves.png`, `{…}-row-{software,robotics,websites}.png`: the new layout
- `1100-light-row-robotics-stretch.png`
- `{…}-nojs-row-websites.png`: no JavaScript
- `{…}-fade-{0,150,300,500}ms.png`: the photo fade
- `results.json`: every measurement

STATUS: done
