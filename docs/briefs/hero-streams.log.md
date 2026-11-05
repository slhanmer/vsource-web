# hero-streams — log

5 November. As instructed, only the two "Also" sections were run. The stream
tiles and fold balance are superseded by `hero-stage.md` and were not built.

## Robotics `why-legs`

- The section's media is now `built/huntsman-walk` with poster
  `built/huntsman-walk-poster`. These are the same media documents `/built`
  uses, so nothing was uploaded twice. Its alt is the one the brief gave.
- `huntsman-terrain-trials.jpg` was referenced only by that section. It is
  **deleted**: removed from the seed assets with `git rm`, listed in
  `retired.media`, and its media document removed by the seed.

## Media fixes

Each file was copied over its seed asset path and swapped into the
**existing** media document, so every reference keeps the same id:

| media | new file | bytes |
|---|---|---|
| `logos/partners/aptium` | `aptium-logo.png` (664×224) | 15,437 → 81,161 |
| `built/nug` | `nug.jpg` (1229×1044) | 136,677 → 163,501 |
| `websites/nug-row` | `nug-row.jpg` (738×848) | 107,442 → 106,174 |
| `built/venues-montage` | `venues-montage.jpg` | 199,193 → 190,394 |

Payload saved the files as `aptium-1.png`, `nug-1.jpg` and so on. The seed's
`byFilename` already matches those names, and a second seed run reported
`0 created, 0 updated, 0 removed, 45 unchanged`, so no duplicate document was
made.

**Nug alt text.**
- `built/nug` takes the brief's text word for word.
- `websites/nug-row`, on the asset and on the Websites `accessibility`
  section, takes the same text **without the sage-panel clause**. The row
  crop (wordmark, address line, shopfront) has no sage panel, so describing
  one would be false. The text is: *The Nug General Store website: the NUG.
  wordmark over a photograph of the shopfront window, its gold lettering
  reading "Handmade pasta".*
- The montage alt names the five sites but describes none of them, so it is
  unchanged.

**Software sections.** The first section is now
`built/training-professionals` and the second is `built/sauce`. Stream
section images render at their own aspect ratio (`CutPhoto` with the
intrinsic width and height, and no crop anywhere in `stream.scss`), so both
are already shown whole. No `fit` field was needed.

**`pointing.jpg` is kept.** Software is no longer using it, but it is still
the home page's Software "What changes" photo (`stepPhoto`).

## Verify

- `pnpm tsc --noEmit`: clean. `pnpm test:ci`: 635 passed. `pnpm build`: ok.
- `pnpm lint`: one error, the trailing comma at `next.config.ts:61`. This is
  the same one as before; the file is Simon's.
- `/robotics` `why-legs` plays `huntsman-walk.mp4` with its poster, muted.
  **Pause this clip**, reached by keyboard and pressed with Enter, pauses it,
  and pressing again resumes it. No terrain image is left on the page.
  Screenshot: `robotics-why-legs.png`.
- **Aptium at 2× DPR.** The plate is 348 CSS px wide, and Next serves the
  640w rendition of the 664px source, so the browser draws it at about 1:1.
  It is as sharp as the file allows, but **the new PNG is itself soft**: its
  edges are blurred at native size. It reads as an upscaled raster rather
  than a true 2× export. A vector (SVG) from Aptium, or the portal's own
  asset, is the real fix. Screenshot: `aptium-2x.png`.
- **The new Nug is everywhere it should be.**
  - `/built/brisbane-venues` shows `nug-1.jpg` in its sites list and
    `venues-montage-1.jpg` as the montage.
  - `/` and `/websites` show `nug-row-1.jpg`.
- **Repeats** (every `img` and video poster, by file, on `/`, the three
  stream pages, `/built` and `/built/brisbane-venues`):
  - No photograph repeats on any stream page or on `/built`.
  - On `/`, the three partner logos appear twice: the fold's "Working with"
    strip and the partners band. That is by design, not a photo.
  - ⚠ **Not caught by file name:** on `/`, `hero-software.jpg` (the fold) and
    `pointing.jpg` (the Software "What changes" row) are **the same shot,
    cropped differently**. This is the duplicate the brief fixed on
    `/software`. Until `hero-stage`, the fold showed `hero-software` only
    during the run. After `hero-stage` its Software band is permanent, so the
    two sit on the home page for good. Fixing it means choosing a different
    "What changes" photo for Software, which is a content choice, so it is
    left for Simon.
- axe (wcag2a/aa/21aa/22aa) on `/`, `/robotics`, `/software`, `/websites`,
  `/built` and `/built/brisbane-venues`, light and dark: 12 runs, 0
  violations.

Screenshots and JSON are in `C:\tmp\hero-streams\`.

STATUS: done
