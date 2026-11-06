# hero-cards: log

6 November. Home page fold stage only, plus one extra request from Simon (the
mill-line bend, at the end).

## What changed

- **The stage is three stacked stream cards from the first paint**
  (`HeroStage.tsx`, `home.scss`). No run window, no crossfade, no settle. The
  server render is the final layout.
  - Each card is one `<a>` (`.home-card`), raised: `--surface-card`, with the
    light on the top edge and a hairline seating the bottom (the `/built`
    card's pair). No drop shadow.
  - **Photo:** `heroPhotos.<stream>.photo`, in a 1:1 box at the left, with
    `$radius-sm` and the recessed edge on a layer above the image. The box is
    the file's shape, and the image is `object-fit: contain`. There is no
    cover crop and no object-position anywhere.
  - **Well:** sunken (`--surface-sunken` and the brief's carve). It holds
    the name (`$font-family-display`, `clamp(22px, 2vw, 32px)`) at its top
    left and, under it, "See more →" in mono and `--route-active`.
  - **Gap** `clamp(14px, 1.4vw, 22px)`. **Photo** `min(30%, the fold
    cap)`: the cap is the room left in the fold divided by the card count,
    so on a short screen the photo shrinks and the name never does.
  - **Hover:** a teal inset rim (the old band rule), and the arrow nudges
    3px right. Under reduced motion the arrow stays put and the rim has no
    transition.
  - **Focus** is a 3px teal `outline` *outside* the card (offset 3px), not
    the rim. Software keeps its current rim after the run, so a focus ring
    drawn the same way would be indistinguishable from it.
  - **Narrow (≤979px):** the same cards stacked full width, photo at 28%.
- **Headline tie-in.** `HeroRun` now exposes `current` (was `active`). It is
  the index of the last word typed: 0 at mount, each word as its last letter
  lands, then 0 (Software) at the end of the run, where it **stays**. It is
  null at the server, without JS and under reduced motion, so there no card is
  lit and nothing moves. HeroStage puts `is-current` on that card. There are
  no timers in the stage.
- **Timeline.** `SETTLE_MS` (600) is gone with the settle. It is replaced by
  `RIM_MS` (200), the rim's transition, which HeroStage passes to the CSS as
  `--home-stage-rim`. It is the last thing that moves, so it is in the 2.2.2
  sum.
  - Three streams: **3,440 ms** (was 3,840). Two: **2,360**.
  - A fourth eight-letter stream would land at 4,520, still past the 4,500
    budget, so that test case is unchanged in meaning.
  - The timeline test is kept, with its numbers updated.

## Removed

- `home-stage__solo`, the band markup and its styles, `is-running`, and the
  `--home-stage-scrim` and `--home-stage-settle` variables.
- `heroPhotos.<stream>.band`. It is out of the `Site` global, `payload-types`
  (regenerated), `src/data` (types and getter), the seed types, `run.ts` and
  `content.ts`.
  - Migration `20261106_035749_hero_cards` drops the three
    `hero_photos_*_band_id` columns, with their FKs and indexes.
- The band media rows are in `retired.media`, so the seed deleted them (below).
- `git rm` of `src/seed/assets/hero/hero-{software,robotics,websites}-band.jpg`.
  - The brief said six `-band` files, but there were three. The other hero
    files (`hero-software.jpg` and `hero-websites.jpg`) are the stream pages'
    `pagePhoto`s, and they stay.
  - ⚠ **`hero-software-band.jpg` and `hero-websites-band.jpg` had uncommitted
    edits in the working tree** (new crops, from before this brief). `git rm
    -f` discarded them along with the files. They were band crops, which
    nothing uses any more, but if those crops were wanted for anything else,
    they are gone from this tree.
- The stage files stay.

## Mill lines (Simon, in the request)

- `PEAK` went from 12 to **24px** in `MillLines.tsx`, which doubles the
  bend. `SIGMA` is unchanged, so its reach is unchanged.
- Lines still cannot cross.
  - The largest spread is K/σ ≈ 0.40, at the centre.
  - The largest squeeze is −0.18, at √3·σ.
  - Crossing needs −1, which would take a PEAK of about 136.
- The comment is updated with these numbers.

## Verify

- `pnpm tsc --noEmit`: clean.
- `pnpm lint`: clean.
- `pnpm test:ci`: 50 suites and **652 passed**, including the timeline test.
- `pnpm build`: ok.
- **Preview migrated:** `20261106_035749_hero_cards` ran in 210 ms.
- **`pnpm seed`:** 0 created, 0 updated, 3 removed (the three band media
  rows), 48 unchanged.
- **Screenshots** are in `C:\tmp\hero-cards\`: 1366×768, 1440×900, 1920×1080
  and 390×844, light and dark, at 0s, 2s and 5s (24 files). The
  measurements are in `verify.json`.
  - They were taken against `next start` of this build on :3201, because
    stopping the :3200 dev server was refused here (see below).
  - **Every photo is uncropped:** a square file (200×200, or 116×116 at
    390) in a square box, `contain`, at every size.
  - The name never shrinks: 27.3px at 1366, 28.8 at 1440, 32 at 1920, 22 at
    390.
  - **1366×768:** the cards run from y=141 to 709, inside the fold. The
    photo is 154px, capped by the fold rule rather than the 30% (~173px).
    1440×900 ends at 761 with the foot at 823; 1920×1080 ends at 838 with
    the foot at 1003.
  - `is-current`: Software at 0s, Robotics at 2s, Software at 5s, and it stays.
- **axe on `/`** at 1440×900 and 390×844, light and dark: **0 violations**.
  The stage has exactly 3 links, each named by its stream ("See more" is
  `aria-hidden`, and the photo's alt is empty).

## Left for Simon

- ⚠ **The :3200 dev server needs a restart.** It is still serving the
  pre-seed state, and killing it was refused in this session. After the
  restart it will pick up the dropped columns.
- ⚠ **`pnpm media:blob` needs re-running for the preview store**, then a
  redeploy: `BLOB_READ_WRITE_TOKEN="<preview store token>" pnpm media:blob
  --run`. No new files were added. The cards use the existing `-stage`
  files, but the band rows are gone.
- Work is committed and pushed to `development` only. Merging is yours.

STATUS: done
