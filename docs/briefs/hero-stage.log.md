# hero-stage — log

5 November, run after `hero-streams` (`2ad85ac`). One commit.

## 1. The stage

- The geometry and the soft edge are restored from **`0ef66a5`**
  (hero-rebuild 2, "the fold is the message and a photograph"):
  - `position: absolute`, top/bottom/right 0, with `left: calc(50% +
    var(--home-hero-gap) / 2)`, so it runs the full fold height, from the
    message column's edge to the screen's right edge.
  - The `linear-gradient(90deg, transparent, #000 72px)` mask fades it into
    the plate. There is no line and no shadow.
- The rule from the same commit that keeps the plate's foot under the message
  column on wide screens is restored too. Without it the foot would run
  under the stage.
- The left column is unchanged. Its grid keeps an empty second column, as in
  hero-rebuild.
- The stage is now a direct child of the plate. `HeroRunProvider` wraps both
  the copy and the stage, and renders no DOM of its own.

## 2. During the run

- `HeroStage.tsx` reads `active` from `HeroRun.tsx`, and that timing comes
  only from `headlineTimeline.ts`. Each big photo crossfades in over 0.4s as
  its word finishes typing.
- **`focus`** is a new field on each hero photo. `site.heroPhotos.<stream>`
  is now a group `{ photo, focus }`, and `focus` is the CSS object-position,
  with a default of `50% 50%`. Values set in the seed:

| stream | focus | why |
|---|---|---|
| Software | `62% 40%` | keeps the hand and fingertip and the screen in the tall crop, and the hand in the wide band |
| Robotics | `40% 20%` | keeps the Huntsman's body and battery: the body sits high in the frame |
| Websites | `0% 0%` | anchors left and top, so the Snug wordmark and nav bar, then the room |

## 3. The settle

- When the headline lands back on Software, the stage crossfades over
  `SETTLE_MS` (600ms) into three stacked bands with a 6px gap. Each band is
  one link to its stream page: the photo, cover with the same `focus`, and
  the name in Chakra Petch, bottom-left, on a short dark scrim. The name sits
  past the fade.
- **Contrast** was measured by hiding the name, reading every pixel under it,
  and comparing `--text-on-dark` with the **brightest** pixel. Across 26
  measurements (5 sizes × 2 themes × 3 bands, less the two 390 bands below
  the first screen), the **worst case is 6.54:1** (Software, dark,
  1680×1050), and the lowest mean is 11.21:1. AA for large text is 3:1, and
  for normal text 4.5:1.
- **Hover:** the photo brightens (`brightness(1.1)`) and a 2px
  `--route-active` edge lights. **Focus:** a 3px `--route-active` ring with a
  dark line inside it, shown at once with no transition.
- **Settled is the default state.** It is what the server renders, what
  shows without JS and under reduced motion, and what remains after the run.
  The three band images use Next 16's `preload`, since `priority` is
  deprecated there.
  - Each photo has one URL. The big photo and its band share `src` and
    `sizes`, so each file is fetched once.
  - `sizes` is `(max-width: 979px) 100vw, calc((100vh - 96px) * 1.5)`,
    because a 3:2 photo covering the full-height stage renders 1.5× the fold
    height wide.
- **Timeline:** `timelineMs()` is now the typing (3,240ms) plus `SETTLE_MS`,
  which totals **3,840ms**, under the 4,500 budget. `typedMs()` keeps the old
  sum. The test asserts both, and the header arithmetic is updated.
  - The note about a fourth word changed with it: it now lands at 4,920ms,
    past the budget.
- **Bands during the run** are transparent with `pointer-events: none`, so a
  click on the big Robotics photo cannot open whichever band is underneath.
  `:focus-within` brings them back, so a keyboard user who tabs in mid-run
  sees the band they are on.

## 4. Removed

- `HeroFrame.tsx` (`git rm`), its `.home-frame` styles, and the
  `SOFTWARE · ROBOTICS · WEBSITES` row.
- `heroPhotos.team` is removed from the global, the data layer, the seed
  types and `content.ts`.
- **Migration `20261105_052747_hero_stage`**, created with Drizzle's prompts
  answered "create column". I then hand-added `UPDATE` statements so the
  three photo ids move to the new `*_photo_id` columns before the old columns
  are dropped, and back again in `down`. It applied cleanly to the preview
  branch.
  - The next seed run changed only `global site` (the focus values), so the
    photos survived the migration.
  - A second seed run: `0 created, 0 updated, 0 removed, 45 unchanged`.
- ⚠ **Brief vs code:** the brief says the team media stays "since `/team` and
  the Why section use it". They do not use it. They use `photos/team-group`,
  a separate media document of the same shot. `hero/hero-team` is now
  **referenced by nothing**. As the brief says, I kept it, in `media` and in
  the seed assets. Deleting it is one line in `retired.media` if Simon wants
  it gone.

## 5. Narrow screens

At 979px and below the copy comes first, then the three bands full-bleed,
each 16:9 (380×214 at 390 wide), already settled. The slideshow layer is
`display: none`, and the bands ignore `.is-running`. The Software band
starts at y=477 at 390×844.

## Verify

- `pnpm tsc --noEmit`: clean. `pnpm test:ci`: 47 suites, 635 tests passed.
  `pnpm build`: ok.
- `pnpm lint`: the one known error, the trailing comma at
  `next.config.ts:61`. Unchanged and Simon's.
1. **Frames every 250ms, 0 to 5s** (`frames/`):

   | | 1440×900 | 1920×1080 |
   |---|---|---|
   | bands (server render) | 17ms | 17ms |
   | big Software | 261 | 254 |
   | Robotics photo | 1,256 | 1,266 |
   | Websites photo | 2,516 | 2,511 |
   | Software retyped | 3,260 | 3,267 |
   | bands settling | 3,509 | 3,513 |

   The bands' opacity is 1 from about 4,000ms, and nothing moves after that.
2. **Settled** at 1366×768, 1440×900, 1680×1050, 1920×1080 and 390×844, light
   and dark (`settled/`): all three subjects are in their bands and the names
   are readable.
   - Band sizes run from 637×220 at 1366 to 907×324 at 1920.
   - At 1366×768 the buttons end at y=600, inside the first screen.
3. **No JS:** no `.is-running`, three band links, bands at opacity 1, the
   slideshow at 0 (`nojs-1440.png`). **Reduced motion:** 20 samples over 5s
   were never running, and the bands' opacity was 1 throughout
   (`reduced-1440.png`).
4. **Tab order, light and dark:** *Start a conversation* → *See what we've
   built* → Software → Robotics → Websites. Every band shows the ring at
   1440 and at 390 (`focus/`).
5. **axe** (wcag2a/aa/21aa/22aa), every sitemap route plus the 404, light and
   dark: 30 runs, 0 violations.

**LCP.** At first paint the LCP is the Software band (112–124ms). When the
run starts, the big Software photo then becomes the final LCP candidate at
about 620–630ms, because it is larger. It is the same file, already in the
cache. Making the band the final LCP would mean not running the slideshow
at all, so I am noting it rather than changing it.

**Still open from hero-streams.** On `/`, the Software band
(`hero-software`) and the Software "What changes" photo (`pointing`) are the
same shot, cropped differently. With the band now permanent, they are both
on the home page for good. Choosing another "What changes" photo is a
content call, left for Simon.

Screenshots and JSON are in `C:\tmp\hero-stage\`.

STATUS: done
