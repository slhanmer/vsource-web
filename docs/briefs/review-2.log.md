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

## §4 `/built`

- **Logo size:** the `logo` kind now sizes the logo to **60% of the plate's
  width**, capped at 70% of its height, centred. That applies to any `logo`
  media, not only Aptium. Measured: 60% wide, 32% tall. **Note:** the only
  Aptium artwork is a 185×56 PNG, so at 60% of a ~560px plate it is upscaled
  about 1.8× and slightly soft on a high-DPI screen. A larger PNG or an SVG
  from Aptium would fix that; just upload it to the same media document.
- **`fit: 'cover' | 'contain'`** on project media (images; default `cover`;
  migration `20261105_012946_media_fit`). `contain` shows the whole image on
  the card's plate colour, never cropped. It is set on Training
  Professionals (2.11:1 image in a 1.78 frame), SAUCE (1.6:1) and Five
  Brisbane venues (1.91:1). All three now show edge to edge.
- **Cards are raised plates:** `--surface-card` fill, light on the top edge
  (`inset 0 1px 0 var(--carve-lip)`), a hairline seating it, internal
  padding, no drop shadow. The media inside stays recessed. The lead card
  gets the same treatment. Gaps between cards: 40px across, 58px down at 1440.
- **Coming soon:** the heading says so, and each item is three elements: the
  name, a visually hidden ", ", and an `aria-hidden` "·", then the stream.
  The eye sees "CurbHire · software"; a screen reader hears "CurbHire,
  software". Before, the two spans had nothing between them but a CSS gap,
  so read as text they ran together as "CurbHiresoftware".

Screenshots: `C:\tmp\review-2\built\built-{1440,390}-{light,dark}.png`;
numbers in `built.json`.

## §5 Drop the dead door fields

`door` and `doorPhoto` are removed from the `streams` collection, the data
layer, the seed (content, types, shape) and the generated types. Migration
`20261105_013331_drop_door_fields` drops `door`, `door_photo_id`, their index
and their foreign key, and applies cleanly on the preview DB.

**Media, checked by reference, not by name.** After the fields went, two
assets were referenced by nothing in the content: `websites/snug-door` and
`photos/robotics/huntsman-top`. Both are deleted from `media` (via
`retired.media`) and their files removed from `src/seed/assets/`.

**The brief didn't match the code here.** It expected `huntsman-top.jpg` to
stay because "the hero uses it via `hero-robotics.jpg`". It doesn't:
`hero-robotics.jpg` is a separate file and its own media document (from
`media-inbox/hero/`, added in §1), so nothing referenced `huntsman-top`.
Following "check by reference", it was removed. The Huntsman photos still on
the site are `hero-robotics` (the fold), `huntsman-studio` (the Robotics page
head) and the walking clip and poster on `/built`. The full Snug screenshot
(`built/snug`) stays, as one of the venue sites.

Seed: 2 removed; second run 0 changes.

## §6 Docs

`CLAUDE.md`, in the content table and "Current state": `streams` (now with
`pagePhoto` and section `media`), `projects` (the media kinds and `fit`),
`site` (`heroPhotos`, "Coming soon"), the fold (photo frame following the
headline, stream links, fallbacks), stream pages (photo head, alternating
sections; `StreamMark` only on the landing pages), and `/built` (logo at
60%, raised cards, `contain` screenshots).

## Verify (production build, `next start -p 3130`, seeded preview DB)

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint` | only the known trailing comma in `next.config.ts:61` (not mine to edit) |
| `pnpm test:ci` | 47 suites, 635 tests pass (`headlineTimeline` test unchanged) |
| `pnpm build` | passes |
| 1. Fold frames, 1440×900, every 250ms to 5s | software → robotics (1,500ms) → websites (2,500ms) → **team, nothing lit** (3,750ms on). No JS and reduced motion: team photo, links visible, none lit |
| 2. Stream pages | all three: a photo in the head, media sections alternating right/left, 0 `StreamMark`. Robotics clip: muted, loop, poster, playing; pause → paused, label "Play this clip" |
| 3. `/built` | Aptium logo 60% of its plate; Training Professionals, venues and SAUCE whole (`contain`); cards are raised plates 40/58px apart; "Coming soon", "CurbHire, software" |
| 4. Seed and migrations | every section's seed run ends with a second run at 0 changes. Five migrations this run (`hero_photos`, `stream_media`, `media_fit`, `drop_door_fields`), all applied cleanly to the preview DB through `deploy-migrate.ts` |
| 5. axe | all 14 sitemap routes plus the 404, light and dark: **30 runs, 0 violations** |

Screenshots: `C:\tmp\review-2\` (`fold\`, `streams\`, `built\`), with
`axe.json`.

## Decisions for Simon

- **Aptium logo resolution:** the 185×56 PNG is upscaled about 1.8× at 60%
  of the plate. Upload a larger PNG or an SVG to the same media document if
  it looks soft.
- **`huntsman-top.jpg` is gone** (§5): nothing referenced it once the door
  fields went. It is still in git history if you want it back for a page.

STATUS: done
