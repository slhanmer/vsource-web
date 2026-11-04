# Brief — hero-polish

**Run after `cms` and `built-trim`**, or between them if `cms` blocks again.
It touches only the fold, `photos.ts` and one new component.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only. One commit per section.
**Read `CLAUDE.md` first.**

Simon's review of the fold (5 November): the layout feels off, the doors
arriving with the typed words doesn't work, and he wants the mill lines to bend
a little around the cursor. Also, the Websites photos in "What changes" are
still stock.

Where the brief does not match the code, stop and log it.

---

## 1. Fold layout

What is off, measured from Simon's 1680-wide screenshot:

- **The CTA is stranded.** "Start a conversation" sits about 150px below the
  copy, pinned to the bottom so it lines up with the last door. It reads as a
  separate object, not the end of the paragraph above it. Fix: the CTA follows
  the sub copy at the normal paragraph-to-button spacing used elsewhere.
- **The left column is then shorter than the doors.** Centre the left column
  vertically against the door stack, so the copy block's middle aligns with the
  middle door. Do not stretch the copy to fill.
- **Dead space above and below.** Roughly 270px above the content and 250px
  below it, at 1680×1143. The content should sit in the fold with even space
  above and below, slightly above optical centre (more space below than above,
  about 45/55). The foot ("Working with" and "More on each") stays on the
  plate's bottom edge.
- Check at 1440×900, 1680×1050, 1920×1080 and 1366×768. Log the space above and
  below the content block at each.

## 2. Doors: always there, highlight only

Revert `hero-doors`' **entrance**: all three doors are visible from first paint
and never fade or rise in. **Keep the teal edge highlight following the typed
word**, since it ties word to card without moving anything, and it still clears
when the run ends. Delete the code and CSS for the entrance. Keep the shared
timeline.

## 3. Websites photos: Snug on the door, Nug on the row, cropped for their slots

Simon (5 November): Snug suits the site's colours, so it goes on the fold door,
and the full screenshots were being cut badly by `object-fit: cover` (the Nug
wordmark half gone, Snug's caption chopped). Claude has made purpose-cropped
versions in `media-inbox/websites/`:

- `snug-door.jpg` (1200×900, 4:3): Snug's wordmark, nav and room photo, with
  its caption. Fold door. Alt: `The Snug website: its wordmark over a dark photograph of the room at night, captioned “a tiny café, a neighbourhood wine bar”.`
- `nug-row.jpg` (864×858): the Nug wordmark, the Bakery Lane line and the
  dining-room photo. The "What changes" Websites row. Alt: `The Nug General Store website: the NUG. wordmark above a photograph of a full dining room with a painted mural.`

Both use `object-position: top` in their slots, so if `cover` trims anything,
it trims the bottom and never the wordmarks. Put them in the same place the
current Websites photos come from (media and seed if `cms` has landed, else
`photos.ts`), replacing the stock files, and say which you did. Delete the
`websites-*` stock photos if nothing else uses them. Screenshot both slots at
1440 and 390 and confirm both wordmarks are whole.

## 4. Mill lines that bend around the cursor

The fold plate (`.home-plate`) and `.home-moves` draw their brushed-metal mill
lines with a `repeating-linear-gradient` (1px lines every 4px). Make the
lines on **the fold plate only** bend gently around the pointer, like a
magnet under brushed steel.

- A `<canvas>` layer inside `.home-plate`, behind the content, `aria-hidden`,
  `pointer-events: none`, that draws the same lines (same colour token
  `--home-mill`, same 4px rhythm). Each line is displaced vertically near the
  pointer by a smooth falloff: roughly a Gaussian about **160px radius, peak
  displacement about 6px**, so lines bulge around the cursor and are straight
  elsewhere. Tune by eye and log the values.
- **It springs back.** The displacement eases toward the pointer and relaxes
  to straight when the pointer leaves or stops (lerp per frame). No
  bounce.
- **Cheap:** `requestAnimationFrame` only while the pointer is moving or the
  lines are still settling; idle means zero frames. Device pixel ratio capped
  at 2. Pause when the tab is hidden. It must not drop a frame on a mid laptop.
  Measure and log the frame time.
- **Only where it makes sense:** `(pointer: fine)` and `(hover: hover)` only,
  never on touch. Under `prefers-reduced-motion: reduce`, no canvas: the CSS
  gradient lines stay exactly as now. When the canvas is active, the CSS
  gradient's line layer is turned off on the plate so the lines are not drawn
  twice. The slab gradient stays in CSS.
- Before hydration or without JavaScript, the CSS lines render as now. The
  fold must look identical to today until the pointer moves.
- `CursorSpark` (the shake easter egg) stays. Log whether the two read as
  competing.

## 5. "What changes": a shorter pinned track

Simon (5 November): the pinned section takes too long to scroll through, and it
feels stuck and unresponsive. Each stream holds for about a full screen of
scroll before anything changes.

- Cut the track from 3× `--scroller-h` to about **1.8×** in total, so each
  stream gets roughly 0.6 of a screen. Simon should feel the swap happen
  within an ordinary flick or two of the wheel.
- Tighten the crossfade with it, so the swap starts as soon as you scroll. The
  outgoing row starts fading near the end of its share, not after a long hold.
  Keep "never two rows above 0.5".
- Keep everything else from `moves-pin`: the activation threshold, the
  fallbacks, the focus script.
- Log the old and new track length, and the scroll distance per stream in
  pixels at 1440×900.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. Fold screenshots at the four sizes, light and dark, with space above and
   below logged, and the CTA directly under the copy.
2. Doors are visible in frame 0 of a load capture; the highlight still follows
   the word and clears at the end.
3. Websites door shows Snug, row shows Nug, both wordmarks whole.
4. Mill lines: a short screen recording or frame sequence of the pointer
   crossing the fold; idle frame count (zero) after it stops; under reduced
   motion and on a touch emulation, no canvas in the DOM.
5. The track length and per-stream distance (§5), with the 5% opacity table
   re-run.
6. axe on `/`, light and dark: 0 violations.

Screenshots go to `C:\tmp\hero-polish\`.

## The log

Append to `docs/briefs/hero-polish.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
