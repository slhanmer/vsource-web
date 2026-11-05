# Log — review-2

5 November. Run on `development` after hero-rebuild. One commit per section.

## §1 The fold: the three streams, then the team

- **`site.heroPhoto` → `site.heroPhotos`** `{ software, robotics, websites,
  team }` (migration `20261105_011354_hero_photos`). The four files from
  `media-inbox/hero/` are in the seed, with the brief's alt text.
  `at-the-desk.jpg` is retired from `media` and the seed.
  `hero-software.jpg` is used as delivered (monitors softened, not sharpened).
  - The four uploads are **not `required` at the database**: Payload made them
    `NOT NULL`, which cannot be added to the existing `site` row, so the first
    generated migration would have failed on the preview DB. I caught it
    before applying, regenerated it nullable, and `src/data/` refuses to
    render without all four, naming the missing one.
- **`HeroFrame.tsx`:** a 3:2 frame in the right column, vertically centred
  against the copy, with the standard photo radius and recessed edge (the
  same as `.cut-photo`). The four photos are stacked in it and crossfade on
  opacity, 400ms. Hidden ones are `alt=""` and `aria-hidden`.
- **Stream links under the frame:** `Software · Robotics · Websites`, in mono
  labels, linking to the stream pages. They are plain links in a list from
  the first paint. The dots are CSS, so a screen reader hears three links.
  The one whose word is on screen is `--route-active`; at rest none is.
  Targets are 28px tall.
- **Timing, one source:** `HeroRun.tsx` is back as a small shared timeline
  (`active` only). `RotatingHeadline` reports each word as it finishes
  typing; the frame and the links read from that. The run is unchanged and
  still under 4.5s, so the `headlineTimeline` test stands.
- **Fallbacks:** the server render, no JS and reduced motion all show the team
  photo with no link lit. `hero-team.jpg` has `priority` (the settled LCP),
  and the three stream photos `loading="eager"` without priority.
- **Narrow screens:** the frame and links come first, at full width and 3:2,
  then the copy and buttons. The left column is unchanged from hero-rebuild.
  The hero-rebuild full-bleed photo CSS is removed, and the foot spans the
  content width again, since nothing sits on the right edge now.

Frames every 250ms from load, at 1440×900 (`C:\tmp\review-2\fold\frames\`):

| ms | photo shown | link lit |
|---|---|---|
| 0–750 | software | Software |
| 1,500–2,000 | robotics | Robotics |
| 2,500–3,500 | websites | Websites |
| 3,750 → 5,000 | **team** | **none** |

Each change lands in the frame after its word finishes typing.

| State | Photo | Links |
|---|---|---|
| no JS | team | none lit, all three visible |
| reduced motion | team | none lit, all three visible |

Settled fold: the buttons and links are in the first screen at every wide size
(links bottom: 627/768, 662/900, 727/1050, 741/1080). The frame is about
576×384. At 390×844 the frame, the links, then the copy. Screenshots:
`C:\tmp\review-2\fold\fold-<w>x<h>-<theme>.png`.

## §2 The other group shot

The new `team-group.jpg` replaces the file of the **same media document**
(id 29), which is `/team`'s group photo and the home "Why" photo. Same alt.

**A seed bug this found, and its fix.** When the seed swaps a changed file
into an existing row, Payload finds the old file still on disk and saves the
new one as `team-group-1.jpg`. The next seed run looked up the exact name
`team-group.jpg`, didn't find it, and **created a second document** (id 35),
pointing the site at it. Fixed in `src/seed/run.ts`: `byFilename` now treats
`name-N.ext` as the same asset and takes the oldest matching row. I then
deleted the duplicate (id 35, checked by filename before deleting) through
the admin API. Result: one document, the original id 29, holding the new
file (536,740 bytes), used by both slots. **Two further seed runs: 0
changes.**
