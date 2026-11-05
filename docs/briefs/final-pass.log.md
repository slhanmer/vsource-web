# final-pass — log

## Simon: run this

_(Filled in at step 4.)_

---

## 1. hero-stage-2: done

See `hero-stage-2.log.md`. Commits `3f586e6` (§4, the stream-page project
cards) and `5a9c61d` (§1–3: the stage at 1.4× the copy, faded on three
sides; more air in the copy; mobile type).

## 2. "Why we work this way": the working shot

- `media-inbox/photos/at-the-desk.jpg` (1200×1800) went in through the seed
  as `photos/at-the-desk`, with the brief's alt text. `site.workingPhoto`
  now points to it. The seed reported `1 created, 1 updated`, and a second
  run `0 created, 0 updated, 0 removed, 46 unchanged`.
  - `at-the-desk.jpg` was in `retired.media`, from hero-rebuild. **I removed
    it from that list**; otherwise the next seed run would have deleted the
    new photo.
- **Blurred the monitors.** At this size a 2× screen fetches the photo at
  almost its native width (544 CSS px; the source is 1200 wide). At that
  width the code was partly legible: `export async function
  syncHolderDeviceModes(tenantId, userId)` on the left screen, and an
  `aptium-pc` docker stack in the right-hand terminal. Aptium is under NDA.
  - A Gaussian blur (radius 5) covers both screens. Pixels that read as skin
    are masked out, so Craig's hands stay sharp, and the mask edge is
    feathered.
  - The blurred file is committed at `src/seed/assets/photos/at-the-desk.jpg`.
    The inbox file is the unblurred original.
- The group shot stays on `/team` only (`team-group-1.jpg`).
  `site.groupPhoto` is unchanged.
- ⚠ **For Simon:** `pointing.jpg` (the Software "What changes" row) and
  `hero-software.jpg` (the fold) come from the same session. They show the
  same editor, with `.claude` and `.github` folders, `devicePresenceService`
  and a few lines of the same code. At their sizes most of it is soft or out
  of focus, but it is the same kind of content I blurred here. I have not
  touched them, because the brief did not ask.
- axe (wcag2a/aa/21aa/22aa), every sitemap route plus the 404, light and
  dark: 30 runs, 0 violations.

Screenshots: `C:\tmp\final-pass\why-*.png`.

## 3. Clear the inbox

- **Deleting was refused** (the auto-mode permission check blocked
  `rm -rf`), so, as the brief says, everything went to
  **`_to_delete/media-inbox/`**:
  - `contact/`: Claude's 17 contact sheets.
  - `update/`: `aptium-logo.png`, `nug.jpg`, `nug-row.jpg` and
    `venues-montage.jpg`. I checked each one with `cmp`: it is byte-identical
    to its seed asset.
  - `photos/`: `at-the-desk.jpg`. This is the **unblurred** original. The
    blurred copy is the seed asset.
  - `hero/`, `built/`, `websites/`: already empty.
- **Kept in `media-inbox/robotics/`, because nothing references them:**
  - `huntsman-sim-rubble.mp4` and `huntsman-sim-rubble-poster.jpg`
  - `huntsman-sim-steps.mp4` and `huntsman-sim-steps-poster.jpg`

  `robotics-content.log.md` already lists them as unused.
- `media-inbox/` and `_to_delete/` are untracked, so this step changes no
  tracked files. This log entry is its commit.
