# Log — robotics-content

4 November. Branch `development`, from `1a32a7e`. One commit, this log
included.

## The precondition was not met. Simon said to go ahead

The brief says to run after `cms` is committed and seeded, and to put content
through the seed in `src/seed/`. **`cms` is blocked** (see `cms.log.md`), so
there is no Payload, no seed and no database. Simon asked for this to be done
now.

So the content went where the site reads it today, **`src/constants/`**. That
is also what cms Stage D seeds from ("loads every current entry"), so when cms
runs, this copy and media go into the database with everything else. Nothing
here needs redoing.

How the brief's CMS field names map onto the constants:

| Brief (CMS) | Here |
|---|---|
| `published` | No drafts yet. An entry in `BUILT` is on the site |
| stream `doorPhoto` / `stepPhoto` | `PHOTOS.streams.robotics.door` / `.step` in `photos.ts` |
| `media` documents | files under `public/` |
| `pnpm seed` runs twice with no changes (verify 1) | **not run: no seed exists yet** |

The brief also says "Don Gino goes back to an ordinary card". In the
constants Don Gino was never the lead; that change belongs to cms Stage D, which
has not happened. So there was nothing to undo. `project-arachnid` is the only
entry with `featured: true`.

## 1. Project Arachnid

- `spider-drones` is replaced by `project-arachnid` in `built.ts`. Every
  field is verbatim from the brief, curly apostrophes included: title, client,
  stream, year, status, line, lede, the four body paragraphs, the four facts,
  and the video media. It is `featured: true` and has no `placeholder`.
- Media: `public/built/huntsman-walk.mp4` and
  `public/built/huntsman-walk-poster.jpg`, at 1280×720. Checked: H.264
  (`avc1`), **no audio track**, 1.1 MB. ffprobe is not installed here, so this
  was read from the MP4's boxes.
- Removed with `git rm`: `public/built/placeholder-drone.mp4` and `.jpg`.
  Nothing else referenced them.
- The `built.ts` header comment is updated. It now lists two invented entries,
  not three, and the spider-drones and "Robotics has no delivered work"
  paragraphs are replaced by a note on keeping the Arachnid claims to what
  exists today.
- **Additional media below the body: the template has no slot.**
  `app/built/[slug]/page.tsx` renders exactly one `project.media`, and
  `Project.media` is a single object. I did not build one. So
  `huntsman-terrain-trials.jpg`, `huntsman-sim-controls.mp4` and its poster
  are **not used**, and they stay in the inbox. **Simon to decide.**

## 2. The Robotics stream

Every field in the brief is set verbatim in `streams.ts`: door, problem,
solution, lede, promise, pageLede, who, the four caps, proof, pricing and the
three sections. Sections are `why-legs`, `by-evolution` (with `includes`) and
`next` (with `includes`), and they replace `scope` and `proof` entirely.
`StreamSection` already had an `includes` field, so nothing structural
changed. **No `pending` flag is left on the stream**: the proof's and both old
sections' are gone.

- `door` photo: `public/photos/robotics/huntsman-top.jpg` (1600×1217).
  `step` photo: `public/photos/robotics/huntsman-studio.jpg` (1800×1097).
  Alts are verbatim, with no `credit`, because these are ours.
- The old stock pair (`public/photos/stock/robotics-door.jpg`,
  `robotics-step.jpg`) was no longer referenced anywhere, so it was removed
  with `git rm`. The brief didn't name these, but they were dead files.
- The `photos.ts` and `streams.ts` header comments are updated. Stock now
  applies to Software and Websites only. The Robotics copy is now described as
  Simon's and final, not "mine and unverified". A stale "stream 03" is now
  "the Robotics stream".

### Content rules check

- **Nobody is called an engineer.** Searching the new copy for
  `engineer|qualif|certif|accredit|RPEQ` finds nothing. The only matches in
  `streams.ts` are the explanatory header comment. The rendered `/robotics`
  page contains no "engineer", measured in all four views.
- **No qualification is claimed.** The old cap *"…two engineering degrees in
  progress"* is gone with the old caps. The new copy describes the robot and
  the work, not anyone's credentials.
- One thing went with the replaced `scope` section: the paragraph explaining
  RPEQ on the page itself. The brief replaces that section entirely, so this
  is expected. The rule is still documented in `CLAUDE.md` and the
  `streams.ts` header.
- "Class A" and the phone number are not touched.

## 3. Tidy

- `media-inbox/robotics/`: the four used files are deleted (`huntsman-walk.mp4`,
  `huntsman-walk-poster.jpg`, `huntsman-top.jpg`, `huntsman-studio.jpg`), after
  confirming each was byte-identical in `public/`. **Left in the inbox:**
  - `huntsman-sim-steps.mp4` and its poster, `huntsman-sim-rubble.mp4` and its
    poster: unused, as the brief says
  - `huntsman-terrain-trials.jpg`, `huntsman-sim-controls.mp4` and its
    poster: no template slot (above)
  - `huntsman-model.jpg`: **not mentioned in the brief at all**, so left alone
  - `media-inbox/` is untracked and is not in this commit.
- `CLAUDE.md` → Current state is updated to 4 November. It records that the
  Robotics copy is in and that `cms` is blocked. The previous text said
  "every `/built` entry" still had a marker, which was already wrong. **What
  is actually left, from the data:** `placeholder: true` on
  `training-professionals` and `qut-capstones` only. There is no `pending: true`
  anywhere in `src/constants/`.
- Not changed, but worth a look: the `qut-capstones` placeholder still says
  *"one on the drones, one on SAUCE"*. If that capstone is Project Arachnid,
  the line should say so when its real copy is written.

## Found and fixed: the clip's pause control did not work on `/built`

Verify 3 asks for a pause control. One existed, but it did not work, for two
separate reasons. Both predate this brief: the placeholder drone clip had the
same problems in the same spot. The clip loops past five seconds, so this was
a WCAG 2.2.2 failure on the page this site sells accessibility from.

1. **The button sat inside the card's `<Link>`.** On `/built` the whole lead
   card is a link, so clicking or pressing Enter on Pause bubbled to it and
   navigated to `/built/project-arachnid`. What looked like the button "not
   working" was a page navigation. **Fix:** the button's click handler calls
   `preventDefault()` and `stopPropagation()`, and Next's `<Link>` skips
   navigation for a default-prevented click.
2. **Hover and the button shared one flag.** `mouseenter` set it false, the
   click flipped it back to true, and `mouseleave` set it true again. A mouse
   user could never make a pause stick. **Fix:** in `ProjectMedia.tsx`,
   `stopped` (the viewer's choice) and `hovering` (the courtesy pause) are now
   separate. The button's label and `aria-pressed` follow `stopped`. Under
   reduced motion it reads "Play", as before. The `videoPlaying` state, which
   only fed the old label, is removed.

**Measured** on the `/built` lead card, 1440:

| Step | paused | label |
|---|---|---|
| playing on arrival | no | Pause this clip |
| pointer over the clip | yes | Pause this clip |
| click Pause | yes | Play this clip |
| pointer leaves, 1.2 s later | **yes** | Play this clip |
| click Play, pointer leaves | no | Pause this clip |
| keyboard Enter | yes | Play this clip |
| keyboard Enter again | no | Pause this clip |

The card title still navigates to the project page, and the project page's own
control works.

**Left for Simon (structural):** the button is still *inside* an `<a>`. That
is nested interactive content and invalid HTML, although axe does not flag it
here. The clean fix is a card whose link is on the title, stretched over the
card with a pseudo-element, with the control above it. That is a markup change
to `/built`, which this content brief ruled out.

## Verify

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint:ci` | clean |
| `pnpm test:ci` | 42 suites, 594 tests pass |
| `pnpm build` | passes. `/built/project-arachnid` generated, no `spider-drones` |
| 1. seed idempotent | **not run: no seed exists (cms blocked)** |
| 2. `/robotics` | 0 markers, no `[pending]`/`[placeholder]` text. Sections in order: `why-legs`, `by-evolution`, `next`. h1 is the new promise |
| 3. `/built` | leads with Project Arachnid. The first media is `huntsman-walk.mp4`, `muted`, `loop`, playing, with its poster. The pause control works (above). Under reduced motion it is paused at 0 s and shows the poster. `/built/project-arachnid` is 200; `/built/spider-drones` is **404**. The sitemap has the new URL and not the old one |
| 4. Home | Robotics door shows `huntsman-top.jpg`, loaded. The "What changes" row shows `huntsman-studio.jpg`. New door text and problem render |
| 5. axe on `/`, `/robotics`, `/built`, `/built/project-arachnid` × light/dark × 1440/390 | **16 runs, 0 violations** |

All of this ran on `next start -p 3100` after the final build. The dev server
on 3200 was left running.

## Screenshots — `C:\tmp\robotics-content\`

For each of `1440-light`, `1440-dark`, `390-light` and `390-dark`:

- `-robotics.png`
- `-built.png`
- `-project-arachnid.png`
- `-home-doors.png`
- `-home-row-robotics.png`

Also `results.json`.

STATUS: partial

---

# Follow-up from cms Stage D (5 November)

The seed now exists. §2b is done in it: Websites door = Nug, row = Snug,
reusing the `/built` media documents; the stock pair is gone. Verify 1: `pnpm
seed` run twice more after the first load, 0 changes each time.

STATUS: done
