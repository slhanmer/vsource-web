# Log — moves-flip

4 November. Branch `development`, from `9faeea5`. One commit, this log
included. The dev server on 3200 stayed up. The checks below ran against a
production build on `next start -p 3100`.

The brief matched the code. Nothing needed stopping.

## 1. Data: `instead`

- `Stream` gains `instead: string`. All three values, and the three new
  `solution` values, are verbatim from the brief, curly apostrophes included.
  `problem` is unchanged for all three. Robotics' is the one from
  robotics-content.
- The doc comments are rewritten for the new roles. `problem` is the past, in a
  recessed plate at body-large size. `instead` is the short, large line the row
  is built around. `solution` is the why under it.
- **Where `solution` is rendered:** only in `StreamMoves.tsx`. It is not used
  on the stream pages, in metadata or in landings (grep across `src/`). So
  there were no other uses to leave alone.

## 2. The row

The left column is now four grid areas. On wide screens it is
`name / past / answer` beside `photo`, with rows `auto auto 1fr`. Narrow
screens stack `name / past / photo / answer`.

1. **Name**: the `<h3>` with `cut-slot`, moved to the top of the row as its
   label (`justify-self: start`, so it shrink-wraps).
2. **Now plate** (`.home-step__past`): `--home-well` fill with the design
   language's recessed edge, `inset 0 3px 8px -3px var(--carve-dark), inset 0 -1px 0 var(--carve-lip)`,
   `$radius-md`, and padding of `clamp(16–24px) clamp(18–28px)`. The fill is
   `--home-well`, the home page's own recess colour, not `--surface-recessed`
   or `--surface-sunken`. In the light theme both of those are *lighter* than
   the plate, so they would read as raised, not cut in. The problem is
   Newsreader 400 in `--text-secondary`.
3. **Instead**: an "Instead" eyebrow in the same mono style as "Now" (one
   shared `.home-step__eyebrow` class). Then the `instead` line at the problem's
   old face and size: Newsreader 300, `clamp(27px, 3.6vw, 50px)`, primary.
4. **Solution**: body copy in `--text-primary` (was muted
   `--text-secondary`), at a 62ch measure, the stream pages' body measure.
5. The link line is unchanged.

The photo still spans the column on the right, now from the top of the cut
box. The single-photo fade from moves-layout is untouched.

"Now" and "Instead" are `<span>` eyebrows, not headings. The row's only
heading is the `<h3>`, and `aria-labelledby` is unchanged.

**One contrast fix found while verifying:** axe flagged the "Now" eyebrow in
the light theme. `--text-subtle` on the darker well fails AA. Inside the plate
the eyebrow now uses `--text-secondary`, the same colour as the problem.

## 3. Comments

The `StreamMoves.tsx` header is rewritten. It describes the five-part row as
the before/after the section heading promises, carried by recessed versus
surface, and where the photo sits on each layout. Nothing describing the old
hierarchy (the problem as the headline, the answer as small copy) is left. The
CSS comments on the row are rewritten to match.

## Verify

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint:ci` | clean |
| `pnpm test:ci` | 594 pass |
| `pnpm build` | passes |

### 1. Order and sizes (all three rows, all four views)

The order measured as cut box → Now plate → Instead → solution → link in every
row. On narrow screens the photo sits between the plate and "Instead". The
`instead` line is the largest text in every row.

| | problem | instead | solution | name |
|---|---|---|---|---|
| 1440 | 20.9px | **50px** | 18px | 32px |
| 390 | 18px | **27px** | 16px | 22px |

### 2. Contrast (WCAG ratios, measured from computed colours)

| | light | dark |
|---|---|---|
| problem on the plate | **4.66:1** | 9.24:1 |
| "Now" eyebrow on the plate | 4.66:1 | 9.24:1 |
| solution on the section plate (top / bottom of its gradient) | 9.39 / 7.65 | 11.33 / 15.75 |

All pass AA. The light-theme problem at 4.66:1 clears 4.5 with little to
spare, which is by design: it is the past, set in the secondary colour on the
darkest fill on the page. The next step quieter would fail.

### 3. Photo alignment

At 1440 the photo's top minus the cut box's top is **0** in every row. The
photo height equals the column (cut box top to link bottom) in every row:
578 / 520.5 / 521.8px. The column is now taller than the 4:3 floor (438px), so
unlike moves-layout the photo matches the text exactly. At 390 the photo is
full width at 4:3 (255px), between the plate and "Instead".

The fade still works: the three photos go from `is-waiting` to `is-revealed`
at opacity 1 when scrolled to.

### 4. axe on `/`

0 violations in light and dark, at 1440 and 390, after the eyebrow fix.

## Screenshots — `C:\tmp\moves-flip\`

- `{1440,390}-{light,dark}-row-{software,robotics,websites}.png`: all three
  rows, both sizes, both themes
- `results.json`

STATUS: done
