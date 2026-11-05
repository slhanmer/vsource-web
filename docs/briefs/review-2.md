# Brief — review-2

**Run next.** Simon's second screen-by-screen review, 5 November. Six areas,
one commit per section.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only.
**Read `CLAUDE.md` first.** Photos go in through `media` and the seed.

Where the brief does not match the code, stop and log it.

---

## 1. The fold: the three streams, then the team

Simon on `hero-rebuild`: with the doors gone, nothing above the fold shows the
three streams, and Craig looks angry in the desk shot. The fix is that **the
photo follows the headline**: each stream gets its own picture while its word
is typed, and the fold then settles on the team.

**Photos**, prepared in `media-inbox/hero/`, all 1800×1200 (3:2):

| file | shown while | alt |
|---|---|---|
| `hero-software.jpg` | "Software" (at mount) | `A hand points to a line of code on a monitor while Simon looks on.` |
| `hero-robotics.jpg` | "Robotics" | `The Huntsman, an eight-legged robot, on a stone bench.` |
| `hero-websites.jpg` | "Websites" | `The Snug website: its wordmark over a dark photograph of the room at night.` |
| `hero-team.jpg` | the end of the run, then permanently | `Simon, Craig and Ronan in V Source shirts against a wall of jasmine.` |

The monitors in `hero-software.jpg` are softened on purpose, so the code
cannot be read. Do not sharpen it.

**Layout:**

- The photo is **no longer full-bleed and full-height**. It is a **3:2 frame**
  in the right column, vertically centred against the copy, with the standard
  photo radius and edge. The four photos are stacked in one frame and crossfade
  (opacity only, ~400ms) as the words change.
- **Under the frame**, a row of three stream links (`Software` · `Robotics` ·
  `Websites`) to the stream pages, in the mono label style. The one whose word
  is on screen is highlighted (the `--route-active` teal), and when the run
  ends all three sit at rest, unhighlighted. **This row is what shows the
  streams above the fold**, so it must be visible and usable from the first
  paint.
- Timing comes from `headlineTimeline.ts`, one source as before: each photo
  arrives as its word **finishes** typing, and the team photo arrives when the
  run ends (back on Software). The whole run stays under 4.5 s, so the
  existing test stands and WCAG 2.2.2 needs no control.
- Left column: unchanged from `hero-rebuild` (headline, lede, sub, two
  buttons).
- **Fallbacks:** server render, no JS and reduced motion show **the team photo
  only**, with the stream links visible. Priority-load `hero-team.jpg` (it is
  the settled LCP). Load the three stream photos eagerly but not with
  priority.
- Narrow screens: frame above the copy, full width at 3:2, links under it.
- `site.heroPhoto` becomes `site.heroPhotos`: `{ software, robotics, websites, team }`.
  `at-the-desk.jpg` is no longer used. Remove it from `media` and the seed.

## 2. `/team` and the "Why" section: the other group shot

Swap `team-group.jpg` for the new file of the same name now in
`media-inbox/photos/` (Simon was mid-laugh in the old one). Same alt. Replace
the media document's file; do not create a second one.

## 3. Stream pages: photographs, and a page you want to read

Each stream page still opens with a line drawing (`StreamMark`) in the head,
and the body is one long text column. Simon wants photographs, and the
sections staggered left and right.

- **Head:** replace `StreamMark` with a photo, the stream's `pagePhoto` (a new
  upload field), in the same box, at its own aspect, with no line drawing.
  - Software: `hero-software.jpg`
  - Robotics: `huntsman-studio.jpg` (already in `media`)
  - Websites: `hero-websites.jpg`
- **Sections:** `sections[]` gains an optional `media` (upload: image or
  video, with alt; video follows the `/built` clip rules: muted, loop, pause
  control, poster, under 10 s). A section **with** media renders as two
  columns, text and media, **alternating sides** down the page (first text
  left / media right, next reversed). A section without media stays a single
  text column. Narrow screens: text then media.
- Seed the media per section (all already in `media`, except where noted):
  - **Robotics:** `why-legs` → `huntsman-terrain-trials.jpg`;
    `by-evolution` → `huntsman-model.jpg` (the CAD render, alt `A CAD render of The Huntsman showing its eight legs, servos and central payload bay.`);
    `next` → `huntsman-sim-controls.mp4` with its poster.
  - **Websites:** first section → `nug-row.jpg`; second → the Jane's Deli
    screenshot; a third, if there is one → Bar Cooper's.
  - **Software:** first section → `pointing.jpg`; then the Training
    Professionals composite; then the SAUCE sheet. As many as there are
    sections, in that order.
- `StreamMark` must not appear on any stream page afterwards. If it is now
  unused everywhere, delete the component and its styles.

## 4. `/built`

- **Aptium logo:** far too small on its plate. Size the logo to about **60%
  of the plate's width** (capped by height), centred. Same for any `logo`
  media kind.
- **Screenshots are being clipped** (Training Professionals' composite, the
  venue montage). Add `fit: 'cover' | 'contain'` to project media
  (default `cover`). `contain` shows the whole image on the card's plate
  colour, never cropped. Set `contain` on Training Professionals, Five
  Brisbane venues and SAUCE.
- **Cards need separating.** It is unclear where one project ends and the next
  begins. Each card becomes a **raised plate** (the site's raised treatment:
  lighter fill, light on the top edge, no drop shadow) containing its media,
  meta line, title, line and link, with internal padding and a clear gap
  between cards.
- **Coming rail:** the heading becomes **Coming soon**, and the items render
  as `CurbHire · software`, with the stream as a separate, quieter label. They
  currently run together as `CurbHiresoftware`. Fix the markup, not just the
  spacing: name and stream are separate elements, and the screen-reader text
  reads "CurbHire, software".

## 5. Drop the dead door fields

`door` and `doorPhoto` on `streams` are read by nothing (`hero-rebuild` log
§3). Remove them from the collection, the data layer, the seed and the
types, with a migration. Remove their media if nothing else uses it
(`huntsman-top.jpg` stays if the hero uses it, which it does via
`hero-robotics.jpg`. Check by reference, not by name).

## 6. Docs

`CLAUDE.md` → "Current state" and the content table: the fold (photo frame
plus stream links), stream pages (`pagePhoto`, section media), `/built` cards.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. Fold frame captures every 250ms from load to 5s at 1440×900: photo and
   highlight change with each word, and the fold ends on the team photo with
   no highlight. With no JS and under reduced motion: team photo, links
   visible.
2. All three stream pages: a photo in the head, alternating sections, and the
   Robotics video plays muted with a working pause.
3. `/built`: the Aptium logo is about 60% of its plate; Training Professionals,
   the venues and SAUCE show their whole image; cards are visibly separate;
   the Coming soon rail reads correctly.
4. `pnpm seed` twice: the second run changes nothing. The migration applies
   cleanly on the preview DB.
5. axe on every sitemap route, light and dark: 0 violations.

Screenshots go to `C:\tmp\review-2\`.

## The log

Append to `docs/briefs/review-2.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
