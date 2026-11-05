# Brief — hero-stage

**Run after `hero-streams`.** It replaces `review-2` §1's photo frame and the
stream link row. One commit.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only.
**Read `CLAUDE.md` first.**

Simon (5 November): go back to the **big photo with the faded edge** from
`hero-rebuild` (full height, bleeding to the right, fading into the plate), but
make it the **slideshow**: one big stream photo per typed word. When the run
finishes, it **settles into one picture for each stream**. Those three
pictures are the entry points to the streams. The team photo leaves the fold;
it has `/team` and "Why we work this way".

Where the brief does not match the code, stop and log it.

---

## 1. The stage

- The right side of the fold is a **stage**, as in `hero-rebuild`: the full
  fold height, bleeding past the content column to the viewport's right edge,
  with the **soft gradient edge** into the plate on its left (no hard line, no
  shadow). Restore that treatment from git history rather than reinventing it,
  and log the commit you took it from.
- Left column: unchanged (headline, lede, sub, two buttons), vertically centred.

## 2. During the run: one big photo per word

Timing comes from `headlineTimeline.ts`, still the single source of truth:

| word on screen | stage shows |
|---|---|
| Software (at mount) | `site.heroPhotos.software`, full stage |
| Robotics | `site.heroPhotos.robotics`, full stage |
| Websites | `site.heroPhotos.websites`, full stage |

- Each photo crossfades in (opacity, ~400ms) as its word **finishes** typing.
- `object-fit: cover`, with a per-photo `object-position` chosen so the subject
  survives the stage's tall crop: the hand and screen for Software, the
  Huntsman's body for Robotics, and the Snug wordmark and room for Websites
  (anchor left). Make it a field on each hero photo (`focus`), not hardcoded.
  Log the values.

## 3. When the run ends: it settles into three

When the headline lands back on Software, the stage crossfades (~600ms) from
the single big photo into **three stacked bands**, one per stream, filling the
stage top to bottom with a thin gap between them:

- Each band is **one link** to its stream page, showing that stream's photo
  (cover, with the same `focus`) and the stream name in the display face,
  bottom-left, on a short dark scrim so it passes AA contrast. Measure and log.
- Hover and focus: the band's photo brightens slightly and its edge lights in
  `--route-active` teal. Focus is always visible.
- **This settled state is the permanent state.** It is also what renders on the
  server, without JavaScript, and under reduced motion: the three bands,
  immediately, with no slideshow. LCP is the settled stage. Priority-load the
  three band photos.
- The whole run, including the settle, stays under the existing 4,500 ms test.
  Add the settle to the timeline arithmetic and the test.

## 4. Remove

- The 3:2 photo frame and the `SOFTWARE · ROBOTICS · WEBSITES` text row from
  `review-2`.
- The team photo from the fold: drop `heroPhotos.team` from the global, the
  data layer and the seed. The media stays, since `/team` and the Why section
  use it.

## 5. Narrow screens

Below the two-column breakpoint: copy first, then the stage as three bands
stacked full width, each about 16:9, already settled. No slideshow on narrow
screens.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. Frame captures every 250ms from load to 5s at 1440×900 and 1920×1080: three
   big photos in turn with their words, then the settle into three bands.
2. The settled stage at 1366×768, 1440×900, 1680×1050, 1920×1080 and 390×844,
   light and dark: all three subjects in frame in their bands, names readable.
3. No JS and reduced motion: the settled bands from the first paint.
4. Tab order: the two buttons, then the three bands, each with a visible focus
   ring.
5. axe on `/`, light and dark: 0 violations.

Screenshots go to `C:\tmp\hero-stage\`.

## The log

Append to `docs/briefs/hero-stage.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
