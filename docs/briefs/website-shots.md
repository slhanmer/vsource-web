# website-shots: website screenshots are shown whole, never cropped

Log to `docs/briefs/website-shots.log.md`.

## Rule

A screenshot of a website is shown **whole**, at its own 16:10 shape. Every one we have is a 1440×900 capture: `built/snug`, `built/janes-deli`, `built/bar-coopers`, `built/don-gino`, plus `built/nug` once Simon's new 1440×900 capture lands. No `object-fit: cover` and no `object-position` on them, anywhere. Wherever one appears, the slot takes `aspect-ratio: 16 / 10` from the image, the same way the Built cards do. Photographs (people, the robot) keep `cover` with their purpose-cut files.

Add a `kind: 'photo' | 'screenshot'` select to Media, default `photo`. Seed the five website captures as `screenshot`. Any component that renders media reads `kind`: a screenshot gets the 16:10 whole treatment, a photo gets the current behaviour. Use the same name in the type, the data layer and the migration.

## Where it applies

1. **Home "What changes", Websites row:** `stepPhoto: 'built/nug'`. The slot is 16:10 at the column width and is vertically centred against the text, instead of stretching to the text column's height. Delete `websites/nug-step` and `websites/nug-row` from the seed and their files (`git rm`). Remove the `#websites .home-step__photo` object-position rule.
2. **/websites "Accessible" section:** `built/nug` as well, shown whole.
3. **Hero, Websites:**
   - The run window shows `built/snug` whole, 16:10, centred in the square window on `--surface-recessed`. That reads as a site on a screen, with no crop.
   - The band stays `hero/hero-websites-band`: the top strip of the Snug page, with the full nav bar and the room. It is the only 3:1 cut and already reads as a site.
   - Drop `hero/hero-websites-stage`.
4. Check every other place a `built/*` capture renders (the /built cards and the project pages) and confirm each one follows the rule.

## Verify

- `pnpm tsc --noEmit`, `pnpm lint`, `pnpm test:ci`, `pnpm build`. Migrate preview, then `pnpm seed`.
- Screenshots at 1440×900 and 390×844 of the home Websites row, the /websites Accessible section and the hero Websites window, saved to `C:\tmp\website-shots\`. Each site's wordmark and nav must be fully visible.
- axe on `/` and `/websites`: 0 violations.
- Note in the log that `media:blob` needs re-running for preview.

End with `STATUS: done` or `STATUS: blocked — <why>`.
