# Brief — hero-streams

**Run next.** Small, fold only. One commit.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only.
**Read `CLAUDE.md` first.**

(Originally a fold brief; see Superseded.) Simon (5 November, after `review-2`): the fold flows well now, but once the
slideshow settles on the team photo, there is no real entry point to the three
streams. The `SOFTWARE · ROBOTICS · WEBSITES` line under the photo reads as a
caption, not as three ways in.

Where the brief does not match the code, stop and log it.

---

## Superseded (5 November)

The stream tiles and fold balance that were here are **replaced by
`hero-stage.md`**. Do not build them. Run only the two sections below, then
`hero-stage.md`.

## Also: the Robotics page's first section image

The terrain-trials strip on `/robotics` (`why-legs`) shows two of the four
runs **failing** (stalls at 50 mm steps, snags on 80 mm rubble, with red
badges), right next to copy arguing that legs beat wheels on exactly that
ground. Replace that section's media with the real walking clip
(`huntsman-walk.mp4` with `huntsman-walk-poster.jpg`, the same media `/built`
uses; reuse it, don't upload a duplicate), alt `The Huntsman, an eight-legged black robot, walking across a timber floor.`
Remove `huntsman-terrain-trials.jpg` from that section and from the seed. Keep
the media document if anything else references it; otherwise delete it, and
log which.

## Also: media fixes from Simon's pass (5 November)

Files are in `media-inbox/update/`. **Replace the file on the existing media
document** in each case (keep its id, so every reference follows), and update
the seed to match.

1. **Aptium logo is soft.** Replace the `aptium` logo media with
   `aptium-logo.png` (664×224, transparent, taken from the portal's sign-in
   screen at 2×). This is the logo only. **No screenshot of the portal goes on
   the site**, since the screens are under NDA.
2. **Nug looks nothing like that any more.** The site has been redesigned.
   Replace:
   - the `nug` screenshot media with `nug.jpg` (1229×1044, the current
     homepage). It is used by the `brisbane-venues` `sites` list and anywhere
     else that references it;
   - the `nug-row` media with `nug-row.jpg` (738×848: wordmark, address line
     and the shopfront photo), for the Websites row in "What changes" and the
     Websites page's first section;
   - the `venues-montage` media with `venues-montage.jpg` (rebuilt with the new
     Nug).
   Update the Nug alt text everywhere it appears to: `The Nug General Store website: the NUG. wordmark over a photograph of the shopfront window, its gold lettering reading “Handmade pasta”, beside a sage panel reading “Ben makes everything himself. Ruxi looks after everyone.”`
3. **The Software page shows the same photo twice in a row:** the head
   (`hero-software`) and the first section (`pointing`) are the same shot.
   Set Software's sections to: first → the Training Professionals composite,
   second → the SAUCE sheet (both `contain`, never cropped). `pointing.jpg` is
   then unused by Software. Remove it from `media` and the seed if nothing else
   references it, and log which.

Verify: the Aptium card is sharp at 2× DPR; Nug's new screenshot shows on
`/built/brisbane-venues`, in the montage, and in the Websites row; no photo
appears twice on any one page (check all three stream pages and `/`).

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. `/robotics` `why-legs` shows the walking clip, muted, with a working pause.
2. axe on `/` and `/robotics`, light and dark: 0 violations.

Screenshots go to `C:\tmp\hero-streams\`.

## The log

Append to `docs/briefs/hero-streams.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
