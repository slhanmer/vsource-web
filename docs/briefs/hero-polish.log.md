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

## §3 Websites photos — in the seed (revised brief)

**First pass (`a2e6942`, log only):** under the brief as first written (Nug
door, Snug row), there was nothing to do. cms Stage D had already put the Nug
and Snug media on Websites' door and row in the seed, and deleted the stock
`websites-*` files.

**Simon revised §3 during the run** (Snug on the door, Nug on the row,
purpose-cropped). Done **in the seed and media**, since cms has landed:

- `media-inbox/websites/snug-door.jpg` (1200×900) and `nug-row.jpg` (864×858)
  moved to `src/seed/assets/websites/`, as new media documents with the alt
  text the brief gives. Websites `doorPhoto` → `websites/snug-door`,
  `stepPhoto` → `websites/nug-row`. Seed: 2 created, 1 updated. The full
  Nug and Snug screenshots stay, used by the `/built` venues' sites.
- `object-position: top` on just those two slots
  (`.home-door--websites` and `#websites .home-step__photo`; the door now
  carries a per-stream `home-door--<slug>` class). The Software and Robotics
  photos keep their centred framing.
- The stock `websites-*` photos were already gone (cms D).
- Screenshots: `C:\tmp\hero-polish\websites-door-{1440,390}.png` and
  `websites-row-{1440,390}.png`. **Both wordmarks are whole at both widths:**
  Snug's wordmark and nav at the top of the door, with the caption in view at
  1440; and NUG. with "Handmade pasta" and the Bakery Lane line at the top of
  the row. At 390 the door's photo is a 64px thumbnail, as it always is on a
  phone, and the Snug wordmark sits along its top edge.

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

## §4 Mill lines that bend around the cursor

`src/components/home/MillLines.tsx`: a `<canvas>` inside `.home-plate`,
behind the content (`z-index` 0 under the content's 1), `aria-hidden`,
`pointer-events: none`. It draws the same lines as the CSS (1px of
`--home-mill` at offset 3 of every 4px), then adds `.has-mill-canvas`, which
leaves only the slab gradient in CSS. `.home-moves` is untouched.

**Values (tuned for the shape; see the caveat below):**

| | |
|---|---|
| Peak displacement | 6px, at ±80px from the pointer |
| Gaussian sigma | 80px, so the reach is about 160px (2.5px left at ±160, ~0.5 at ±220) |
| Shape | dipole: lines above the pointer go up, below go down, so they part round it |
| Follow (centre lerp per frame) | 0.22 |
| Ease (strength lerp per frame) | 0.12, no overshoot, so no bounce |
| "Stopped" | 140ms without a move. The lines then relax to straight |
| DPR | capped at 2 |

Measured from the canvas pixels at 1440×900 (each line's position in a column
through the bend, against a column far from it). Line offset from the
pointer: vertical shift.

`-160: -2.5 · -120: -4.5 · -80: -6 · -40: -4 · 0: 0 · +40: +4.5 · +80: +6 · +120: +4.5 · +160: +2.5`

| Check | Result |
|---|---|
| Identical to the CSS lines until the pointer moves | the same page with the canvas, then with it removed and the CSS layer back: lines on **exactly the same rows**. The canvas line is 1/255 fainter, and the slab gradient's dithering differs by ≤4/255. Nothing visible |
| Frame time (rAF callback), pointer crossing the fold | **0.29ms mean, 0.4 p95, 1.0 max**. With CPU throttled 4× (a stand-in for a mid laptop): **1.3 mean, 1.7 p95, 1.8 max**, against a 16.7ms frame |
| Idle | **0 rAF calls** in the 2s after the pointer stops, at 1× and 4× |
| Hidden tab | the loop is cancelled on `visibilitychange`, and resumes only if the lines are still bent |
| Reduced motion | no canvas in the DOM, and the CSS lines are on |
| Touch (`hasTouch`, `isMobile`, 1024×1366) | no canvas in the DOM, and the CSS lines are on |
| Before hydration / without JS | the component renders nothing on the server, so the CSS lines show as before |
| Theme switch | redraws in the new `--home-mill` (MutationObserver on `data-theme`) |

Frames as the pointer crosses the fold: `C:\tmp\hero-polish\mill\frame-00…05.png`
and `frame-settled.png`. The numbers are in `mill.json` and `bend-profile.json`.

**Caveat, and the one call for Simon:** `--home-mill` is a whisper: 2% black
on light and 1.4% white on dark. At that strength **I could not see the bend
in any screenshot, even contrast-stretched**; the slab gradient's dither
swamps it, which is why the evidence above is measured, not pictured. It may
be just as hard to see on a real screen. If it is, the lever is visibility,
not shape: raise `PEAK` (it is a constant at the top of the file), or let the
canvas draw the lines slightly stronger near the pointer. I have not changed
the token, because the fold must look identical until the pointer moves.

**CursorSpark** (the shake easter egg) is unchanged. They don't compete: the
spark is an overlay that only appears after a deliberate shake, and the bend
is an almost subliminal change in the plate's texture. During a shake both
are active; the spark draws the eye, and the lines simply part under it.

## §4, second pass: stronger, after Simon couldn't see it

Simon (5 November): the bend was invisible, so it had to be stronger.

- **PEAK 6 → 12px, SIGMA 80 → 100px.** The reach is now about 200px. The
  slope is at most ~20% of the line spacing, so lines still never cross.
- **A glint.** While the lines are bent, they are drawn through a radial
  gradient centred on the bend: **6×** the token's alpha at the centre, 35%
  of that boost at 45% of the reach, and the token's own strength at the
  edge. It scales with the bend's strength, so a still pointer leaves the
  plate exactly as the CSS draws it. That is the main reason it can be seen
  now: a 2% line moving 12px is still hard to spot, but one that also
  catches the light is not.
- Real contrast, no stretching, pointer mid-move:
  `C:	mp\hero-polish\millend-v2-light.png` and `bend-v2-dark.png`. The
  lines visibly part and brighten round the pointer in both themes.
- Re-measured on the production build (`C:	mp\hero-polish\mill-v2\`):
  frame time **0.42ms mean / 0.6 p95 / 1.5 max**, and **1.88 / 2.4 / 2.6**
  at 4× CPU throttle. Still identical to the CSS lines before the pointer
  moves. **0 idle frames** at both speeds once it has settled. At 4×, the
  settle tail (~43 frames) outlasts a 1.5s wait, so the idle count is taken
  after 4s. No canvas under reduced motion or on touch.
- If it now reads too strong, `GLINT` is the dial, at the top of
  `MillLines.tsx`. Shape (`PEAK`, `SIGMA`) and visibility (`GLINT`) are
  separate.

## Verify (production build, `next start -p 3130`, against the seeded preview branch)

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint` | only the known trailing comma in `next.config.ts:61` (see cms log) |
| `pnpm test:ci` | 47 suites, 635 tests pass |
| `pnpm build` | passes |
| 1. Fold at four sizes | the §1 table, re-measured on the production build: identical numbers. The CTA is directly under the copy (28px; 18px at 1366×768). Screenshots in `C:\tmp\hero-polish\fold\`, light and dark |
| 2. Doors | sampled every frame from the first (79ms): **all three at opacity 1 with no transform in all 356 samples**. Highlight: none at first paint → Software at 194ms → Robotics at 1,311ms → Websites at 2,461ms → none at 3,577ms, each as its word finishes. `C:\tmp\hero-polish\doors.json` |
| 3. Websites door and row | door `/media/snug-door.jpg`, row `/media/nug-row.jpg`, both wordmarks whole (§3) |
| 4. Mill lines | §4 above: frames, 0 idle frames, no canvas under reduced motion or touch |
| 5. Track | §5 above: 3× → 1.8×, 531 → 213px per stream at 1440×900, never two rows above 0.5 (the same on the production build) |
| 6. axe on `/` | light and dark: **0 violations** |

The 3200 dev server is up throughout. All commits are on `development` and
pushed. Merging is Simon's.

STATUS: done
