# hero-insets-2 — fixed crops, full-width foot, more air, bigger type

Runs after hero-insets (done). Home fold only. Log to `docs/briefs/hero-insets-2.log.md`.

## Why the crops keep going wrong

One 3:2 file per stream is cropped into two shapes: a near-square run window and a ~3.5:1 band, steered by a single `focus` point. No single point works for both, and the Websites source is a screenshot of Snug's site, so any tall crop shows its nav bar and tagline. Stop steering crops. **Fix the shapes and supply a file cut for each one.**

## 1. Two purpose-cut images per stream

Hand-cut files are in `media-inbox/hero-crops/`:

| stream | stage (1:1, 1200²) | band (3:1, 1800×600) |
|---|---|---|
| software | `hero-software-stage.jpg` | `hero-software-band.jpg` |
| robotics | `hero-robotics-stage.jpg` | `hero-robotics-band.jpg` |
| websites | `hero-websites-stage.jpg` | `hero-websites-band.jpg` |

- `Site.heroPhotos[]`: replace `focus` with a second upload, `band`. The row becomes `{ stream, photo, band }`: `photo` is the 1:1 stage image, `band` is the 3:1 one. Use the same names in types, the data layer, the seed and the component. Write a migration that drops `focus`.
- The seed uploads these six, replacing the current `hero-*.jpg` rows (upsert by filename as now). Delete `src/seed/assets/hero/hero-{software,robotics,websites}.jpg` with `git rm` once nothing references them. `hero-team.jpg` is unused: remove it too.
- `object-position` goes away everywhere in the stage (centre). If a crop is wrong, the fix is a new file, never a position.
- Admin field descriptions state the ratios: "Square, at least 1200×1200" and "3:1, at least 1800×600".

## 2. Lock the stage geometry to those ratios

- Each band is `aspect-ratio: 3 / 1`. The stage is the column width, and its height is the three bands plus two gaps. This replaces the "1.4× copy height" rule (`top/bottom: -20%`). Centre the stage vertically on the copy block.
- The run window fills that same box. It is roughly square, so the 1:1 stage file covers it with only a sliver trimmed.
- Narrow screens: the bands stack at 3:1 using the band file. Drop the 16:9 rule.
- `sizes`: stage ≈ `(max-width: 979px) 100vw, 620px`; band the same. The stage file is not preloaded. The band files are preloaded (they are the LCP).

## 3. Bug: band labels show through during the run

In the running frames the band names ("Softw…", "Robotic…", "Website…") are faintly visible over the run window. During the run the bands must be `visibility: hidden` as well as transparent, with the focus-within exception kept. Verify that no label pixels appear in any run frame.

## 4. "Working with" foot back to full width

`.home-plate__foot` goes back to the full content width (`max-width: 1240px`, centred) on every breakpoint. Remove the desktop rule that narrows it to the message column. "More on each" sits at the right end of the full width. The stage must end above the foot's rule with at least `--home-fold-air` between them. If it would collide on short viewports, shrink the stage width (the bands keep 3:1), never the foot.

## 5. More air, bigger type

- Gap between bands: `$spacing-md` → `clamp(16px, 1.6vw, 28px)`.
- Gap between the copy and the stage: raise the top of `--home-hero-gap` from 96px to 128px.
- Band names: `clamp(22px, 2vw, 34px)`.
- Headline: raise the top of the clamp to the largest size that keeps "Robotics built to fit." (the longest word) on **one line at 1366×768** inside the message column. Cap it at 60px. Measure it; don't guess. Record the value in the log.
- Lede: `clamp(20px, 1.9vw, 30px)`. Body: `clamp(17px, 1.4vw, 21px)`. Recheck that the buttons still sit above the fold at 1366×768, and record the y position.
- Mobile: headline bottom of the clamp to 30px. Check it still fits on one line at 390px or wraps cleanly.

## Verify

- `pnpm tsc --noEmit`, `pnpm lint`, `pnpm test:ci`, `pnpm build`. The headline timeline test stays ≤4,500ms.
- `pnpm payload migrate` against preview, then `pnpm seed`. Confirm the six new media rows and that no duplicate `-1` rows exist.
- Frames every 250ms from 0 to 5s at 1440×900: no labels during the run, and no nav bar in any Websites frame.
- Settled screenshots at 1366×768, 1440×900, 1920×1080 and 390×844, light and dark, saved to `C:\tmp\hero-insets-2\`.
- axe on `/` in light and dark: 0 violations.
- Clear `media-inbox/hero-crops/` once the files are seeded. After that, `media:blob` needs re-running for the preview store. Say so in the log.

End the log with `STATUS: done` or `STATUS: blocked — <why>`.
