# Brief — hero-stage-2

**Run after `hero-stage`.** One commit per section.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only.
**Read `CLAUDE.md` first.**

Simon's pass on `hero-stage` (5 November). The idea is right, but the
proportions are not.

Where the brief does not match the code, stop and log it.

---

## 1. The stage is the hero's size, not the fold's

The three bands run the full fold height (about 1,170px at 1720×1175), so they
dwarf the copy block (about 390px, headline to buttons) and the fold reads as a
wall of photo with a little text beside it.

- **Stage height:** about **1.4× the copy block's height**, vertically centred
  on it. Not full height. Log the ratio and the pixel heights at 1440×900 and
  1920×1080.
- It still **bleeds to the right edge** of the viewport, and keeps its soft
  gradient into the plate on the left. Its top and bottom edges now sit inside
  the plate, so give them the same soft fade (about 24px) rather than a hard
  cut, so the stage floats in the plate.
- The three bands keep their order, labels, links and focus treatment, and get
  proportionally shorter. Re-check each band's `focus` so the subject still
  survives the shorter crop (hand and screen, the Huntsman's body, the Snug
  room) and log any values you change.
- The slideshow (one big photo per word, then the settle) plays at the new
  stage size.

## 2. More air in the copy

The copy block is tight against itself. Spread it:

- More space between the headline and the lede, the lede and the sub copy, and
  the sub copy and the buttons. Roughly 1.5× the current gaps, using the
  spacing tokens. Log the before and after.
- Sub copy one step up in size on wide screens (it is the smallest text in the
  fold and reads as fine print).
- The content block, copy and stage together, sits slightly above the fold's
  optical centre, with clear plate above and below. The foot (logos and "More
  on each") stays on the bottom edge.
- Check 1366×768: the larger gaps must not push the buttons below the fold.
  If they would, scale the gaps with the viewport height (`clamp` against
  `svh`) rather than shrinking the type.

## 3. Mobile type, first pass

On narrow screens (≤ 560px), the lede and sub copy are too small. Lede to at
least 20px and sub copy to at least 18px, with line-heights as unitless ratios
(see `CLAUDE.md`, rule 2). The full mobile review comes next. This is only the
fold copy.

## 4. Stream pages: the project list runs together

Under each stream page's proof line, `.stream__projects` renders as
`A TGA-REGULATED MEDICAL DEVICE PORTAL  TRAINING PROFESSIONALS  SAUCE`: three
links with nothing between them. Make them **small project cards**:

- One card per project, in a row (wrapping), each a link to `/built/<slug>`.
- Each card has the project's media as a small thumbnail (honouring its `fit`
  and `logo` kind) above the title in the display face, with the meta line
  (`stream · year · status`) under it in the mono label style. It uses the
  same raised plate as the `/built` cards, at a smaller scale.
- No orphan on the last row (the team-grid rule).

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. Settled fold at 1366×768, 1440×900, 1720×1175 and 1920×1080, light and dark:
   the stage at ~1.4× the copy height, faded on three sides, bleeding right;
   the copy airier, and the buttons above the fold at every size.
2. The slideshow frames at 1440×900 show the stage at its new size.
3. 390×844: lede ≥ 20px and sub ≥ 18px (log computed sizes).
4. `/software`, `/robotics` and `/websites`: the project cards render with
   thumbnails and no orphan.
5. axe on `/` and the three stream pages, light and dark: 0 violations.

Screenshots go to `C:\tmp\hero-stage-2\`.

## The log

Append to `docs/briefs/hero-stage-2.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
