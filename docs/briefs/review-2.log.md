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

## §3 Stream pages: photographs, staggered sections

- **`pagePhoto`** (a new upload field) replaces `StreamMark` in each stream
  page's head, at its own aspect (`CutPhoto`, 260–460px wide; full width under
  the title on narrow screens). Software → `hero-software.jpg`, Robotics →
  `huntsman-studio.jpg`, Websites → `hero-websites.jpg`.
- **`sections[].media`** (optional group: `upload`, `poster`, `alt`, where an
  empty alt falls back to the media's own alt). Images render with
  `CutPhoto` at their own aspect. An mp4 renders with the `/built`
  `ProjectMedia` (muted, loop, poster, `preload="none"`, pause control,
  poster only under reduced motion), so the stream page now imports
  `built.scss`. Kind comes from the file's MIME type. Migration
  `20261105_012459_stream_media`.
- **Layout:** a section with media is two columns, alternating sides (the
  first media section has the media on the right, the next on the left).
  Sections without media stay one column and don't count towards the
  alternation. At ≤979px: text, then media.
- **Seeded:**
  - Robotics: `why-legs` → terrain trials, `by-evolution` → CAD render,
    `next` → `huntsman-sim-controls.mp4` (9.0s, read from the mp4 header) with
    its poster. The terrain-trials photo and the clip came from
    `media-inbox/robotics/`; the brief gave no alt for them, so I wrote alt
    text from the images (terrain trials: the four trials with their distances
    and results; clip: The Huntsman walking in MuJoCo with its gait controls
    on screen).
  - Websites: `accessibility` → Nug, `yours-to-edit` → Jane's Deli.
  - Software: `custom-software` → `pointing.jpg`, `regulated` → the Training
    Professionals composite.
  - Software and Websites have **two** sections each, so SAUCE and Bar
    Cooper's (the brief's "if there is one") are not used.
- **`StreamMark` is on no stream page** (0 `.markwrap` on all three). It is
  **not deleted**: the `/regulated` and `/accessibility` landing pages still
  use it in their heads, and so does `/built`'s (now unused) `mark` media kind.
- Seed: 4 created, 3 updated; second run 0 changes.

| Page | Head photo | Sections (media, side) |
|---|---|---|
| /software | hero-software | custom-software image right · regulated image left |
| /robotics | huntsman-studio | why-legs image right · by-evolution image left · next **video** right |
| /websites | hero-websites | accessibility image right · yours-to-edit image left |

Robotics clip: muted, loop, poster, **playing** in view (t = 1.49s). The pause
control click → paused, with the label switched to "Play this clip".
Screenshots: `C:\tmp\review-2\streams\<slug>-{1440,390}.png`.
