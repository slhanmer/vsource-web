# Brief — moves-flip

**Run first**, before `cms`. It is a constants and layout change, and `cms`
then mirrors the new field.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only. One commit. The dev server on 3200 stays up.
**Read `CLAUDE.md` first.**

Simon's review (4 November): "What changes" reads flat. The section's job is to
show the change, from where a visitor is now to what they get. At the moment
the problem is the loudest line on screen and the answer is small grey body
copy, so the payoff arrives in a whisper, and the "Instead" half of
"Where you are now, and what you have instead" is never labelled.

**Flip the hierarchy, and use the site's own design language to carry it:**
the past is *recessed* (cut into the plate, darker, quieter) and what you get
is on the surface (bright, large). See `CLAUDE.md` → Design language.

Keep everything `moves-layout` built: the two columns, the photo on the right
stretched to the text, the photo-only fade, and the static cut box. Copy below
is final.

Where the brief does not match the code, stop and log it.

---

## 1. Data: a new `instead` field

`Stream` gains `instead: string`: the short, large line. `solution` stays and
becomes the *why*: the supporting sentence or two under it. Set:

| stream | `problem` | `instead` | `solution` |
|---|---|---|---|
| software | unchanged | `One system, built around how you actually work.` | `Off-the-shelf platforms make you work their way. We build to the process you already run, so nothing lives in a side spreadsheet, and when someone asks what happened, the system can show them.` |
| robotics | unchanged | `Robots that walk where wheels stop.` | `Each foot picks its own ground, so the robot can step over debris, keep its footing on loose material and carry its sensors into gaps people can’t safely reach.` |
| websites | unchanged | `A site you can change yourself, the afternoon you decide to.` | `Fast, accessible and built for the people who use it. When the menu or the hours change, you change them, without a quote or a fortnight’s wait.` |

Update the doc comments on `problem`, `instead` and `solution` in the `Stream`
interface to describe these roles. Check whether `solution` is rendered
anywhere else (stream pages, metadata). If it is, log where, and leave those
uses alone.

## 2. The row, top to bottom (left column)

1. **The stream name in its cut box**, as now, but moved to the **top of the
   row** as the label. The photo's top aligns with it.
2. **"Now" + the problem, recessed.** A carved plate: the recessed treatment
   from `CLAUDE.md` (`inset 0 3px 8px -3px var(--carve-dark), inset 0 -1px 0 var(--carve-lip)`
   on a darker fill), with comfortable padding. Inside it, the `Now` eyebrow and
   the problem at **roughly body-large size** (not the current display size),
   in the secondary text colour. It should read as the past: quieter, not
   hidden. Contrast must still pass WCAG AA against the plate's fill (measure
   it and log the ratio).
3. **"Instead" + the `instead` line, on the surface.** A new `Instead` eyebrow
   in the same mono style as `Now`, then the `instead` line at the **size and
   face the problem uses today**, in the primary text colour. This is the line
   the eye should land on.
4. **The `solution`** as body copy under it, in a readable colour (primary or
   near it, **not** the current muted grey), at the measure body text uses
   elsewhere.
5. `Sounds familiar? · See how it works`, unchanged.

The photo stays on the right, top aligned with the cut box and stretched to the
height of the left column, with the same fade.

Narrow screens: cut box, recessed Now plate, photo, then Instead, solution and
link.

Heading semantics: the stream name stays the row's `<h3>`. "Now" and
"Instead" are eyebrows, not headings.

## 3. Comments

Rewrite the header comment of `StreamMoves.tsx` to describe this structure and
why it exists (the before/after the section heading promises), and drop
anything that describes the previous hierarchy.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

At 1440×900 and 390×844, light and dark:

1. Each row reads cut box → recessed Now → Instead (largest text in the row) →
   solution → link. Log the font sizes you landed on for the problem, the
   instead line and the solution.
2. Contrast for the problem inside the plate, and for the solution: both pass
   AA. Log the ratios.
3. Photo top aligns with the cut box (log the offset), and photo height matches
   the column.
4. axe on `/`, light and dark: 0 violations.

Screenshots of all three rows at both sizes and in both themes go to
`C:\tmp\moves-flip\`.

## The log

Append to `docs/briefs/moves-flip.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
