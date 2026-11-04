# Log — hero-polish

5 November. Run after cms and built-trim, both done and pushed, on
`development`. One commit per section.

## §2 Doors: always there, highlight only (`acad070`)

The entrance is reverted. `HeroRun` keeps the shared timeline and now carries
only `active` (which door is lit) and `wordTyped`. The door states (`waiting`,
`arriving`, `shown`), `armed` and `arriveNow` are gone, along with the
`.is-armed` / `.is-waiting` / `.is-arriving` CSS and its reduced-motion
override. `HeroDoors` renders all three doors as plain links from the first
paint. The teal kerf (`.is-active`) still moves to each word's door as the word
finishes typing, and clears when the run ends. Never under reduced motion.

## §1 Fold layout

- **CTA:** it no longer takes the column's slack (`margin-top: auto`, which
  stretched the column to the doors' height). It now sits **28px** under the
  sub copy (18px on the short-viewport tier), the same as `.home-close__cta`.
- **Columns:** `align-items: center` on `.home-hero__inner`. The copy block's
  middle is the middle door's middle, to the pixel, at every size measured
  (`copyMid` = `midDoor`). The copy is not stretched.
- **Vertical position:** the plate's grid is now `space 45fr · content ·
  space 55fr · foot`. The plate's old top padding is the first row's minimum
  (`--home-fold-air`), so it counts inside the split instead of on top of it.
  The foot stays on the bottom edge (`grid-row: 4`).

Space above and below the content block (to the foot's top edge where the foot
shows; to the plate's bottom where it is hidden):

| Viewport | Before: above / below | After: above / below | After, split | CTA gap before → after |
|---|---|---|---|---|
| 1440×900 | 104 / 61 | 74 / 91 | 45 / 55 | 108 → 28 |
| 1680×1050 | 183 / 133 | 142 / 173 | 45 / 55 | 105 → 28 |
| 1920×1080 | 201 / 145 | 155 / 190 | 45 / 55 | 105 → 28 |
| 1366×768 (foot hidden) | 143 / 144 | 117 / 170 | 41 / 59 | 92 → 18 |
| 390×844 (stacked) | 122 / 123 | 95 / 145 | 40 / 60 | — |

At 1366 and 390 the foot is hidden, so "below" includes the plate's bottom
padding, which pushes the split past 45/55. Light and dark measure the same.

Already true before this run, and not changed: the plate is 7px taller than
the viewport at every size (for example, its bottom is at 907 on a 900 screen).

Screenshots: `C:\tmp\hero-polish\s1-before\` and `s1-after\`
(`fold-<w>x<h>-<theme>.png`, `fold.json`).
