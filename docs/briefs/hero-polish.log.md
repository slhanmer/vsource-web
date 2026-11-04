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

## §3 Websites photos — done in the seed, not photos.ts

cms had already moved the photos into the database, so, as the brief allows,
this was done **in the seed** (cms Stage D, `2fa7214`, which also closed
robotics-content §2b). The Websites `doorPhoto` is the Nug media document and
`stepPhoto` is Snug's, each the same document the `/built` venues use, with
its `/built` alt text. `photos.ts` no longer exists. The two stock files
(`public/photos/stock/websites-*.jpg`) were deleted in that same commit.
Nothing else used them. Verified on `/`: the Websites door and its "What
changes" row both show the venue screenshots.

## §5 "What changes": a shorter pinned track

Measured at 1440×900 (scroller 797px tall) on the dev server, with the stage
pinned (`position: sticky`).

| | Section height | Pinned travel | Per stream |
|---|---|---|---|
| Before | 3× = 2,391px | 1,594px | **531px** (0.67 screen) |
| After | 1.8× = 1,435px | 638px | **213px** (0.27 screen) |

**The brief's arithmetic doesn't match the code, so I followed its explicit
number.** "1.8× in total, so each stream gets roughly 0.6 of a screen"
divides the whole height by three. But the stage stays pinned for the height
*minus one screen*, so per-stream travel is (1.8 − 1) / 3 = 0.27 screen, not
0.6. Hitting 0.6 per stream would mean a 2.8× section, which is barely shorter
than the 3× that read as stuck. I used 1.8×, which answers the complaint: 213px
is two or three wheel notches. If it now feels too quick, 2.2× gives 0.4
screen (≈ 319px) per stream.

**Crossfade:** each stream owns a third of the pinned range. The outgoing row
fades over 26→34% (and 59.67→67.67%); the incoming one over 32→40% (and
65.67→73.67%). Everything else from moves-pin is unchanged: the activation
media query, the `@supports` fallback to plain flow, reduced motion, and
`MovesFocus`, which computes from the live section height, so it follows
the new track.

Opacity of the three rows every 5% of the pinned range (after):

| % | Software | Robotics | Websites |
|---|---|---|---|
| 0–25 | 1 | 0 | 0 |
| 30 | 0.51 | 0 | 0 |
| 35 | 0 | 0.37 | 0 |
| 40–55 | 0 | 1 | 0 |
| 60 | 0 | 0.95 | 0 |
| 65 | 0 | 0.32 | 0 |
| 70 | 0 | 0 | 0.55 |
| 75–100 | 0 | 0 | 1 |

**Two rows are never above 0.5** at any step. Full data:
`C:\tmp\hero-polish\moves-before.json` and `moves-after.json`.
