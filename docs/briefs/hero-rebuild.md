# Brief — hero-rebuild

**Run before `hero-polish`.** This replaces `hero-polish` §1 and §2. Run
`hero-polish` §3, §4 and §5 afterwards as written, and skip its §1 and §2.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only. One commit for the photos, one for the fold.
**Read `CLAUDE.md` first.** `cms` is done, so photos go in through `media`
and the seed, never as files under `public/`.

Simon (5 November): the fold is weak. It has no people in it, and a headline
box plus three cards, each with a different kind of image, reads as a
template. The cards also repeat "What changes", which comes straight after and
links to the same pages. Mik's shoot has landed, so the fold is rebuilt around
a real photograph of the team at work.

Where the brief does not match the code, stop and log it.

---

## 1. Photos into `media` (one commit)

Claude has prepared these in `media-inbox/photos/`. Load them through the seed
(idempotent, upsert by filename) and wire them up:

| file | where | alt |
|---|---|---|
| `at-the-desk.jpg` (1600×2400) | **the new hero** (§2) | `Craig, standing, talks through code on a monitor while Simon types at the keyboard.` |
| `simon-hanmer.jpg` (1200×1500) | Simon's `portrait` | `Simon Hanmer` |
| `ronan-donahoe.jpg` (1200×1500) | Ronan's `portrait` | `Ronan Donahoe` |
| `craig-schneider.jpg` (1200×1500) | Craig's `portrait` | `Craig Schneider` |
| `team-group.jpg` (2400 wide) | `/team` group photo **and** the home "Why we work this way" photo (`site.workingPhoto`) | `Simon, Craig and Ronan in V Source shirts against a wall of jasmine.` |
| `pointing.jpg` (1000×1333) | Software `stepPhoto` (the "What changes" row) | `Craig points to a line of code on a monitor while Simon looks on.` |

- Portraits are real now. **Remove any stock stand-ins** for these three, and
  any `stockPortrait` remnants, from the seed and from `media`. Tom keeps his
  terminal tile. Asuka keeps his photo.
- Software `doorPhoto` is no longer used (§3). Leave the field, but clear it.
- The portrait alts are the person's name, because the portrait sits beside
  their name and role. If the template already labels the image by name,
  `alt=""` is correct instead. Log which.
- Delete the stock files that nothing uses any more from `media` and the seed,
  and list them.

## 2. The fold, rebuilt

Two columns on wide screens:

- **Right: the photo.** `at-the-desk.jpg`, the **full height of the fold**,
  running to the right edge of the viewport (it bleeds past the content
  column), `object-fit: cover`, with `object-position` chosen so both faces
  and Craig's hands stay in frame at every width. Log the value. No radius on
  the outer and bleeding edges. A soft edge where it meets the plate is fine,
  as a gradient into the plate colour, not a shadow. It loads with priority
  (it is the LCP) and with correct `sizes`.
- **Left: the message**, vertically centred in the fold, slightly above
  optical centre:
  1. The rotating headline, unchanged in behaviour (Software → Robotics →
     Websites → Software, under 4.5 s, then still), but **smaller**: it
     should not out-shout the photo. Roughly two thirds of today's size. Log it.
  2. The lede and sub copy, unchanged.
  3. **Start a conversation** (primary, as now), then **See what we've built**
     as a secondary link to `/built`, side by side. Directly under the copy,
     at the normal paragraph-to-button spacing.
- **The three door cards leave the fold.** Delete the doors' markup, CSS and
  the `hero-doors` timeline wiring (keep `headlineTimeline.ts` itself and its
  test). The "What changes" section introduces the streams.
- The foot ("Working with" logos, "More on each") stays on the plate's bottom
  edge.
- **Narrow screens (below the two-column breakpoint):** the photo goes on top,
  full width at about 4:5 and cropped to the two faces, then the message, then
  the buttons. The fold may be taller than one screen there. Never shrink the
  copy to force it to fit.

## 3. Knock-on

- The fold doors were the only users of the stream `doorPhoto` fields and the
  `door` copy lines. **Keep the fields** in the collection, since the stream
  pages may use them, but log every remaining reader. If none, say so, and
  Simon will decide whether to drop them.
- The `hero-doors` teal highlight goes with the doors. Remove its CSS.
- `CLAUDE.md`: update anything that describes the fold (doors, door highlight,
  "the fold has to offer a conversation").

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. Fold screenshots at 1366×768, 1440×900, 1680×1050, 1920×1080 and 390×844,
   light and dark. At every size, both faces are in frame and the CTA is
   visible without scrolling on the wide sizes.
2. LCP is the hero photo, loaded with priority. Log the LCP time on
   `next start`.
3. `/team` shows the group photo and the three real portraits. Tom's terminal
   tile and Asuka's photo are unchanged.
4. Home: the "Why we work this way" photo is the group shot, and the Software
   row in "What changes" shows `pointing.jpg`.
5. `pnpm seed` twice: the second run changes nothing.
6. axe on `/` and `/team`, light and dark: 0 violations.

Screenshots go to `C:\tmp\hero-rebuild\`.

## The log

Append to `docs/briefs/hero-rebuild.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
