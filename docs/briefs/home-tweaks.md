# home-tweaks: Robotics clip, Why photo crop, close section

Run after hero-insets-2. Log to `docs/briefs/home-tweaks.log.md`.

## 1. "What changes" → Robotics row: the walking clip, not the still

- Add an optional `stepClip` upload (mp4) to Streams, next to `stepPhoto`. When a stream has a clip, `stepPhoto` is its poster. The poster is what renders without JS, under reduced motion and until the clip plays, so `stepPhoto` stays required. Carry the field through `src/data/types.ts`, `src/data/index.ts`, the seed and a migration under the same name, `stepClip`.
- Robotics: `stepClip: 'built/huntsman-walk'` and `stepPhoto: 'built/huntsman-walk-poster'`, so the poster matches the clip's first frame. `photos/robotics/huntsman-studio` stays as `pagePhoto`.
- Render it with the clip component /built already uses: muted, looping, `playsInline`, the visible pause control (WCAG 2.2.2) and reduced-motion handling. Don't write a second player. Same recessed frame and size as the photos in the other rows.
- Only play while the row is on screen. The observer's `root` is `#main`.

## 2. "Why we work this way" photo, recropped

`media-inbox/photos/at-the-desk.jpg` is a new crop: 1200×1297, from Craig's head down to the keyboard. It replaces `src/seed/assets/photos/at-the-desk.jpg`. Make sure the seed actually replaces the stored file, rather than skipping it because the filename already exists, on local/preview, then delete it from media-inbox. Set the slot's aspect ratio to the file's (≈0.925) so nothing is cropped further, with no `object-position`. Alt text is unchanged.

## 3. Home close section: title and button only

- `.home-close`: remove the `home-close__row` entirely (email, location, ABN). Keep the title and the "Start a conversation" button.
- The title goes on **one line** on desktop: let it use the full content width rather than the narrow measure. It may wrap below a measured breakpoint, but never shrink the type to force it. Record the width it wraps at.
- Footer: add the email (`mailto:`, teal link) and the location next to the existing `© 2026 V Source Development · ABN …`, from `CONTACT`. The ABN stays in the footer only. Check the footer on every page, since it is shared, and on mobile it must wrap cleanly. Still no phone number in the body or the footer (header and /contact only).
- `/contact` has the same title. Leave that page alone.

## 4. /websites "Accessible" section: Nug image at the page's shape

`websites/nug-row.jpg` is 738×848 portrait, so it stands far taller than the other section images on the page (Jane's Deli is 1440×900). `media-inbox/websites/nug-row.jpg` is the replacement: 1229×768 (16:10), cut from the top of the Nug homepage (wordmark, shopfront photo, the green panel with its buttons). Replace the seed asset the same way as §2: the stored file must actually change, with no `-1` duplicate. Then clear it from media-inbox.

New alt for both the media row and the section's `alt`, so they stay identical: "The Nug General Store homepage: the NUG. wordmark above a photograph of the shopfront window with “Handmade pasta” in gold, beside a green panel with Book a table and See the pasta buttons."

Stop it recurring. The section media upload's admin description should say "Landscape, about 16:10 (e.g. 1600×1000). Portrait images stand taller than the text beside them." Also add a seed check that fails if any `sections[].media` image is taller than it is wide.

## Verify

- `pnpm tsc --noEmit`, `pnpm lint`, `pnpm test:ci`, `pnpm build`.
- `pnpm payload migrate` against preview, then `pnpm seed`. Confirm `at-the-desk` is the new 1200×1297 file and that there is no `-1` duplicate.
- Screenshots of the What changes Robotics row (playing, paused, reduced-motion), the Why section, the /websites Accessible section, the close and the footer at 1440×900 and 390×844, saved to `C:\tmp\home-tweaks\`.
- axe on `/` and `/contact`, light and dark: 0 violations.
- Note in the log that `media:blob` needs re-running for preview.

End with `STATUS: done` or `STATUS: blocked — <why>`.
