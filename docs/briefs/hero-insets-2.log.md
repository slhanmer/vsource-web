# hero-insets-2 — log

5 November, run after hero-insets. Home fold only.

## 1. Two purpose-cut files per stream

- ⚠ **Brief vs code: the field's shape.** The brief describes
  `Site.heroPhotos[]` as an array of rows `{ stream, photo, band }`. In the
  code `heroPhotos` is a **group keyed by stream**
  (`heroPhotos.software.photo` and so on), not an array. I kept that shape
  and replaced `focus` with `band` in each entry:
  `heroPhotos.<stream>.{ photo, band }`. The names match the brief
  everywhere (Site.ts, `HeroPhoto` in `src/data/types.ts`, `getSite`, the
  seed types and run, and `HeroStage`). The stream is the group's key, so
  there is no `stream` field.
- **Admin descriptions:**
  - `photo`: "The run window, while the word is typed. Square, at least
    1200×1200."
  - `band`: "The settled band, a link to the stream page. 3:1, at least
    1800×600."
  - The group description says each file is shown centred.
- **Migration `20261105_065118_hero_bands`** adds the three `*_band_id`
  columns (FK and index) and drops the three `*_focus` columns. Drizzle
  asked nothing ambiguous. Applied to the preview branch:
  `Migrated: 20261105_065118_hero_bands`.
- **Seed:** the six files from `media-inbox/hero-crops/` are seed assets
  under `hero/` (`cmp`: byte-identical).
  - The first run: `6 created, 1 updated, 2 removed`. Created: the six
    `hero-*-stage` and `hero-*-band` rows. Updated: the site global. Removed:
    `hero-robotics.jpg` and `hero-team.jpg`, through `retired.media`.
  - The second run: `0 created, 0 updated, 0 removed, 50 unchanged`.
  - **No duplicates:** 33 media rows, and no base filename appears twice.
    The five `-1` names (team-group, nug-row, venues-montage, aptium, nug)
    are single rows from earlier file replacements.
- **Alt text** for the six new files, which I wrote. The band images render
  with an empty alt because the stream name labels the link; the stage
  files' alt is read while their word is up:
  - Software: "A hand points to code on a monitor."
  - Robotics: "The Huntsman, an eight-legged robot, on a stone bench."
  - Websites: "Inside Snug at night, through the window: table lamps,
    glasses and plates on the counter."
- **Old files:**
  - `git rm src/seed/assets/hero/hero-robotics.jpg` and `hero-team.jpg`:
    nothing referenced them.
  - ⚠ **`hero-software.jpg` and `hero-websites.jpg` stay.** They are still
    the **Software and Websites stream pages' `pagePhoto`**, so the
    condition "once nothing references them" is not met.
- **`object-position` is gone** from the stage and from `HeroStage.tsx`.
  Every image is centred.

## 2. Geometry locked to the ratios

- Each band is `aspect-ratio: 3 / 1`. The stage is in the copy block's
  second column, **in the flow**, `justify-self: end`. The grid's
  `align-items: center` centres it on the copy; measured, the copy's centre
  and the stage's centre are the same pixel at every size. This replaces
  `top/bottom: -20%`.
- The run window is `absolute; inset: 0` over the same box. The box is
  roughly square (568×614 at 1440), so the square file covers it with a
  sliver trimmed.
- **Short screens:** the stage width is `min(100%, 100svh − header −
  2 × fold-air − foot − 2 × gap − 28px)`, so the stage shrinks and the bands
  keep 3:1. `--home-foot-h` is 72px where the foot shows and 0 where it is
  hidden (≤820px tall).
- **Narrow:** the bands stack at 3:1 using the band file. The 16:9 rule is
  gone.
- `sizes` is `(max-width: 979px) 100vw, 620px` for both files. The bands
  have `preload` (the LCP). The stage files load eagerly without preload.

| viewport | stage | bands | gap | stage to foot rule |
|---|---|---|---|---|
| 1366×768 | 523×567 (capped) | 523×174 (3.0) | 22 | foot hidden; 75 to plate bottom |
| 1440×900 | 568×614 | 568×189 (3.0) | 23 | 58 (air there is 45) |
| 1920×1080 | 562×618 | 562×187 (3.0) | 28 | 155 |
| 390×844 | 340×372 | 340×113 (3.0) | 16 | foot hidden |

## 3. Band labels during the run

- **Fix:** during the run the run window is above the bands (`z-index: 2`),
  the bands go transparent, and every band name is
  **`visibility: hidden`**. Entering the run is now instant (no
  transition), so the bands never ghost through a half-faded window.
  Leaving it (the settle) still fades over `SETTLE_MS`.
- **Deviation: the links themselves are not `visibility: hidden`.** A
  `visibility: hidden` link cannot take focus, so the brief's focus-within
  exception could never fire. Hiding the names and covering the bands with
  the opaque run window removes every label pixel while keeping the
  exception. Tabbing into a band during the run brings the bands forward
  (`z-index: 3`), names and all.
- **Measured**, frames every 250ms at 1440×900: from 17ms to 3,259ms all
  three names are `visibility: hidden` and the run window is opaque, at
  z-index 2. They are visible again from the settle at about 3,508ms.

## 4. The foot at full width

- The desktop rule that narrowed `.home-plate__foot` to the message column
  is removed. At 1440 the foot is 1240px wide from x=95, and "More on each"
  ends at x=1335, the content column's right edge. At 1920: 1240px, ending
  at 1575.
- The stage ends 58px above the foot's rule at 1440 (`--home-fold-air` is
  45px there) and 155px above it at 1920.
- `--home-fold-air` on wide screens is now `clamp(32px, 5svh, 64px)`. The
  72–120px it replaced was sized for hero-stage-2's overhang, which is gone.

## 5. More air, bigger type

- Band gap: `clamp(16px, 1.6vw, 28px)`. Copy-to-stage gap
  (`--home-hero-gap`): top raised from 96px to 128px. Band names:
  `clamp(22px, 2vw, 34px)`.
- **Headline: `clamp(30px, 4.39vw, 60px)`.**
  - **Measured, not guessed:** at the old size (45.76px at 1366) the line
    "slot + gap + built to fit." was 404px in a 576px message column, and
    it scales with the font size (the slot is 4.311em, set to the widest
    word). So the largest size that fits on one line at 1366×768 is
    **65.3px**.
  - At 1440, 1680, 1920 and 2560 the limits are 65.4, 64.6, 63.8 and 63.0px.
  - The 60px cap therefore applies, reached at 1366 (4.39vw).
  - Re-measured: 59.97px at 1366, 60px from 1440 up, one line at every
    size.
- Lede `clamp(20px, 1.9vw, 30px)`, body `clamp(17px, 1.4vw, 21px)`.
  Measured: 25.95 / 19.12px at 1366, 27.36 / 20.16px at 1440, and 30 / 21px
  at 1920.
- **Buttons at 1366×768 end at y=618**, inside the 768px viewport. At 1440
  they end at 661, at 1920 at 749.
- **Mobile:** the headline floor is 30px. At 390×844 it is 30px and still
  one line ("Software built to fit."). Lede 20px, sub 18px (the ≤560px
  rule).

## Verify

- `pnpm tsc --noEmit`: clean.
- `pnpm lint`: clean (with Simon's uncommitted `next.config.ts` comma fix).
- `pnpm test:ci`: 641 passed. The timeline test is unchanged and still
  ≤4,500ms (3,840).
- `pnpm build`: ok.
- Migrated the preview branch, then `pnpm seed`: the six new media rows, no
  duplicates (above).
- **Frames, 0 to 5s at 1440×900** (`frames/`): no band labels during the
  run (above).
  - The Websites run window shows the room, with no nav bar:
    `hero-websites-stage` from 2,513ms.
  - Software shows from mount, Robotics from 1,261ms, and the bands from
    3,508ms.
- **Settled** at 1366×768, 1440×900, 1920×1080 and 390×844, light and dark:
  `C:\tmp\hero-insets-2\settled\`.
- axe on `/`, light and dark: 0 violations.
- `media-inbox/hero-crops/` is cleared. Deleting is refused here, so it is
  in `_to_delete/media-inbox/hero-crops/`. Each file was checked
  byte-identical to its seed asset first.
- ⚠ **`pnpm media:blob` needs re-running for the preview store.** The six
  new files (and their generated sizes) are only in `public/media/` on this
  laptop: `BLOB_READ_WRITE_TOKEN="<preview store token>" pnpm media:blob
  --run`, then redeploy.

STATUS: done
