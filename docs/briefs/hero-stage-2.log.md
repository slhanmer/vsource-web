# hero-stage-2 — log

5 November, run as step 1 of `final-pass`.

**Commits.** There are two commits, not four. §1–3 all change the same rules
in `home.scss` (the copy block, the stage and the narrow layout), so they go
in one commit, and §4 goes in a second.

## 1. The stage is the hero's size

- The stage now sits **inside `.home-hero__inner`** (the copy block), which
  is `position: relative`. Its `top` and `bottom` are `-20%`, which makes it
  **1.4× the copy block, centred on it**.
  - `right: calc((100% - 100vw) / 2)` keeps it bleeding to the right edge;
    `.home-hero`'s `overflow-x: clip` trims any overshoot.
  - Tab order is unchanged: the two buttons, then the bands.
- **Fades.** The left edge keeps its 72px fade, and the top and bottom now
  fade over 24px. These are masks built in a Sass mixin (`home-stage-fades`).
  - A custom property holding the gradient did not work: it is resolved
    where it is declared, so every band faded top and bottom. With the mixin,
    only the first band fades at the top and only the last at the bottom.
  - The last band's name sits above its bottom fade.
- **The plate's air** on wide screens is now `clamp(72px, 11svh, 120px)`, so
  the stage's overhang never runs under the header. It replaces the
  short-laptop rule, `clamp(20px, 3.4vh, 40px)`.
- **Measured** (settled, light and dark identical):

| viewport | copy block | stage | ratio | stage top in plate | buttons end |
|---|---|---|---|---|---|
| 1366×768 | 409 | 572 | 1.40 | 24 | 617 / 768 |
| 1440×900 | 429 | 600 | 1.40 | 45 | 663 / 900 |
| 1720×1175 | 433 | 607 | 1.40 | 166 | 789 / 1175 |
| 1920×1080 | 433 | 607 | 1.40 | 123 | 746 / 1080 |

  Bands are 187 to 198px tall. The slideshow plays at the same size
  (`frames/`).
- **Focus values:**
  - Software (`62% 40%`) and Robotics (`40% 20%`) are unchanged. The hand
    and screen, and the Huntsman's body, survive the shorter crop.
  - **Websites changed from `0% 0%` to `0% 55%`.** This brief asks for "the
    Snug room", and at `0% 0%` the shorter band showed mostly Snug's nav bar.
    It now shows the lamps and the room. Snug's wordmark is out of the band.
    Seeded.

## 2. More air in the copy

| gap | before | after |
|---|---|---|
| headline → lede | `clamp(22px, 2.4vw, 32px)` | `min(clamp($spacing-xl, 3.6vw, $spacing-2xl), 5.5svh)`: 32–48 |
| lede → sub | `clamp(12px, 1.2vw, 18px)` | `min(clamp($spacing-md, 1.8vw, $spacing-lg + $spacing-2xs), 3.4svh)`: 16–28 |
| sub → buttons | `clamp(22px, 2.2vw, 28px)` | `min(clamp($spacing-xl, 3.3vw, $spacing-xl + $spacing-xs), 4.6svh)`: 32–40 |

- At 1440×900 the gaps measure 48 / 25.9 / 40px. At 1366×768 the `svh` caps
  bring them to 42 / 24.6 / 35px.
- Sub copy goes from 15.5–17.5px to `clamp(16.5px, 1.3vw, 19px)`: 18.7px at
  1440.
- The copy block sits above centre, with 131px of plate above it and 244px
  below at 1440. The foot stays on the bottom edge (it is hidden below 820px
  tall, as before).
- The buttons are above the fold at every size measured.

## 3. Mobile type

At 560px and below, the lede is 20px with a 1.35 line-height, and the sub
copy is 18px with 1.5. Measured at 390×844: lede 20px/27px, sub 18px/27px.

## 4. Stream page project cards

- Each project under the proof line is now a small card using the `/built`
  raised plate (`.built-card--mini`). Each has a thumbnail, the title (h3,
  display face) and the meta line in the mono label style.
  - Thumbnails go through `ProjectMedia`, so `fit` and `logo` behave as they
    do on `/built`. A clip shows as its poster.
  - The thumbnail's alt is empty, because the title names the link.
- **Columns divide the count** (`projectColumns()`): three or fewer cards sit
  in one row, otherwise 3 or 2. Below 768px it is one column.
  - Software: 3 in one row. Robotics and Websites: one card each, kept at
    card width.
  - No orphan on any page at 1440 or 390.
- Every thumbnail loaded, light and dark (`streams/`).

## Verify

- `pnpm tsc --noEmit`: clean.
- `pnpm lint`: clean. That relies on Simon's uncommitted comma fix in
  `next.config.ts`. I left it unstaged; it is his change.
- `pnpm test:ci`: 635 passed. `pnpm build`: ok.
- axe on `/` and the three stream pages, light and dark: 8 runs, 0
  violations.

Screenshots are in `C:\tmp\hero-stage-2\`.

STATUS: done
