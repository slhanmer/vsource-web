# home-tweaks — log

5 November, run after hero-insets-2.

## 1. "What changes", Robotics row: the walking clip

- **Schema:** `stepClip` is an optional upload on Streams, beside
  `stepPhoto`, filtered to video. `stepPhoto` stays required and its admin
  description now says it is the clip's poster.
  - Migration `20261105_070136_step_clip` adds `streams.step_clip_id` with
    an FK and index. It is applied to the preview branch.
- **Through the layers:** `Stream.stepClip?: ProjectMedia` in `types.ts`.
  `stepClip()` in `src/data/index.ts` builds a `kind: 'video'` spec with
  `stepPhoto` as its poster and its width and height. The seed types and
  `shape.ts` carry it (`null` where a stream has none).
- **Robotics:** `stepClip: 'built/huntsman-walk'` and `stepPhoto:
  'built/huntsman-walk-poster'`. `huntsman-studio` stays as Robotics'
  `pagePhoto`.
- **Rendering:** `StreamMoves` uses `ProjectMedia`, /built's player, so no
  second player. That gives it muted, `loop`, `playsInline`,
  `preload="none"`, the visible keyboard pause control, reduced-motion
  handling, and the IntersectionObserver with `root: #main`.
  - The row's frame is the photos' box (`.home-step__photo`).
  - The recessed edge is on an `::after` above the video, with the pause
    control above that.
  - `built.scss` is now imported by the home page for the player's frame and
    control.
- **Measured:**

| | 1440 | 390 |
|---|---|---|
| playing | `paused: false`, muted, looping, `playsInline` | the same |
| after Enter on **Pause this clip** | `paused: true`, button reads **Play this clip** | the same |
| reduced motion | `paused: true` at t=0, the poster shown | the same |
| frame | 584 wide, the same width as the Software photo | 340×255, the same size as the Software photo |

- ⚠ **"Only while on screen."** The player starts and stops on its
  observer, rooted at `#main`, as the brief asks. On wide screens "What
  changes" is a pinned stage where the three rows are **stacked in one
  place**, and only the current one is opaque. So the Robotics clip counts
  as on screen, and plays, while the stage is up, even during Software's
  and Websites' thirds, when Robotics is transparent. Stopping it then would
  mean tying the player to the scroll-driven row swap, which is CSS-only
  today. I left it; say if you want it.

## 2. "Why we work this way", recropped

- `media-inbox/photos/at-the-desk.jpg` (1200×1297) replaces the seed asset.
  It was cut from the blurred version, so both screens stay unreadable.
- **Replaced in place:** the seed reported `media photos/at-the-desk (file
  200544 -> 169501 bytes)`. The stored row is the **same document (id 40)**,
  now `at-the-desk-1.jpg` at 1200×1297, with no duplicate. The alt text is
  unchanged.
- **Aspect ratio:** I added no CSS rule because none is needed. The slot is a
  `CutPhoto`, which renders the image at its own width and height
  (`height: auto`, nothing crops it). Measured at 1440 and 390: frame ratio
  0.925, image ratio 0.925, file ratio 0.925, and `object-position` is the
  default `50% 50%` with `object-fit: fill`. No other position is set.
- The inbox file is moved to `_to_delete/media-inbox/home-tweaks/photos/`
  (deletes are refused here). It was byte-identical to the seed asset.

## 3. Home close: title and button only

- `home-close__row` (email, location, ABN) is removed from the markup and
  its styles, along with the now-unused `CONTACT` import on the home page.
  The title and **Start a conversation** stay.
- **The title is on one line on desktop:** `max-width: none` replaces `22ch`.
  Measured: one line at 1440. Sweeping down in 10px steps, it first wraps at
  **410px**, so it is one line at every width above that, phones included.
  The type is never shrunk.
- **Footer** (`SiteFooter.tsx`): `© 2026 V Source Development · ABN … ·
  craig@vsource.dev · Brisbane, Queensland`, from `CONTACT`.
  - The email is a `mailto:` in `--route-active` teal, with a 24px target
    height.
  - Each item is `white-space: nowrap`, so it wraps between items, never
    inside one.
  - Checked on `/`, `/software`, `/robotics`, `/websites`, `/built`,
    `/built/sauce`, `/team`, `/contact`, `/regulated` and `/accessibility`:
    four items, no overflow, and **no `tel:` link** anywhere in the footer or
    the close.
  - At 1440 it is one visual line (the 24px link sits a few pixels off the
    text's top, which my line counter read as 2). At 390 it is two centred
    lines (`footer-contact-390.png`).
- `/contact` is untouched.

## 4. /websites "Accessible": Nug at the page's shape

- `media-inbox/websites/nug-row.jpg` (1229×768) replaces the seed asset.
  Replaced in place: `media websites/nug-row (file 106174 -> 115369 bytes)`,
  **the same document (id 24)**, now 1229×768, with no duplicate.
- The new alt is identical on the media row and the section's `alt`. It is
  also the alt on the Websites "What changes" row, which uses the same media.
- Measured on /websites: the Nug image renders **607×380 at 1440**, exactly
  the size of Jane's Deli on the same page. At 390 both are 356×223.
- **Stopping it recurring:**
  - The section media upload's admin description now ends: "Landscape, about
    16:10 (e.g. 1600×1000). Portrait images stand taller than the text
    beside them."
  - The **seed refuses** a portrait section image before it writes
    anything. `src/seed/checks.ts` (`portraitSectionMedia`) is pure. The run
    reads sizes with `sharp` and checks a clip by its poster. Three jest
    tests in `src/seed/tests/checks.test.ts`, one of them the old 738×848
    case.
- The inbox file is moved to `_to_delete/media-inbox/home-tweaks/websites/`
  (byte-identical to the seed asset). `media-inbox/` now holds only the
  unused robotics sim clips.

## Verify

- `pnpm tsc --noEmit`: clean.
- `pnpm lint`: clean (with Simon's uncommitted `next.config.ts` comma fix).
- `pnpm test:ci`: 644 passed (3 new). `pnpm build`: ok.
- Migrated the preview branch, then `pnpm seed`: `0 created, 4 updated`
  (nug-row, at-the-desk, Robotics, and Websites for the alt). A second run:
  `0 created, 0 updated, 0 removed, 50 unchanged`. 33 media rows, and no base
  filename appears twice.
- **Screenshots** in `C:\tmp\home-tweaks\`, at 1440×900 and 390×844:
  - the Robotics row playing, paused and under reduced motion;
  - the Why section;
  - /websites "Accessible";
  - the close;
  - the footer on `/` and `/contact`.
- axe on `/` and `/contact`, light and dark: 4 runs, 0 violations.
- ⚠ **`pnpm media:blob` needs re-running for the preview store.** The two
  replaced files (and their sizes) are only in `public/media/` here, as are
  hero-insets-2's six: `BLOB_READ_WRITE_TOKEN="<preview store token>" pnpm
  media:blob --run`, then redeploy. The replaced files have new filenames,
  so the script will upload them.

STATUS: done
