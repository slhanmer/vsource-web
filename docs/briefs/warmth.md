# Brief — warmth

**Repo:** `V Souce Development` · **Branch:** `development`
**Push:** `development` only. One commit per stage.
**Read `CLAUDE.md` first.**

Simon's review on 3 November: the home page reads as tech and AI-generated. It
needs real photographs and real logos, and less interface chrome. This brief
reverses three earlier decisions on purpose: the headline pause control, the
greyscale-and-duotone photo treatment, and the line-drawn marks on the home
page. Where `CLAUDE.md` or a code comment defends one of those, it is out of
date. Update it as part of the stage that changes it, and do not argue for the
old version.

Where the brief does not match the code, stop and log it.

---

## Stage 1 — the headline: a full stop, no pause button

`RotatingHeadline.tsx` loops forever, so it needs a pause button to meet WCAG
2.2.2. Simon does not want the button. The compliant way to drop it is to make
the animation **finish within five seconds and stop**. 2.2.2 only applies to
motion lasting longer than five seconds.

- It plays **once**: Software → Websites → Engineering → Software, then stops on
  **Software** and stays there. The server render, and the reduced-motion state,
  are Software, as now.
- Total time from mount to the final character typed: **≤ 4,500 ms**. Retune
  `HOLD_MS`, `TYPE_MS`, `DELETE_MS` and `CUT_MS` to fit, keeping the hold on each
  word longer than the typing. Put the arithmetic in a comment next to the
  constants, because that comment is what stops someone adding a fourth word or
  lengthening a hold later.
- Add a jest test that sums the timeline from those constants and fails if it
  goes over 4,500 ms.
- Delete the pause `<button>`, the `paused` and `hovered` state, and the hover
  and focus handlers. Delete the `.rotator__pause` and `.rotator__icon` styles.
- The tail line always reads `built to fit.`, with a real full stop in the same
  type as the rest of the line.
- Rewrite point 3 of the component's header comment to match: it now meets
  2.2.2 by stopping inside five seconds, and it must stay inside five seconds.
- `CLAUDE.md`, Accessibility → 2.2.2: replace `The rotating headline and every
  \`/built\` video have one.` with `Every \`/built\` video has one. The rotating
  headline has none because it plays once and stops inside five seconds — keep
  it that way.`

---

## Stage 2 — logos in "Working with"

`home-plate__trust` lists the partners as text. Make it the three logos from
`partners.ts` (`partner.logo`).

- Each logo is an `<img>` (via `next/image`) with `alt` set to `partner.name`,
  inside a list (`ul`/`li`), with the "Working with" label kept.
- About 24px tall, width from the image's aspect ratio. Check them at 390px.
- Show them in one colour that adapts to the theme, using a CSS filter (dark
  ink on light, light on dark), at reduced opacity so they sit back from the
  headline. **First check that all three PNGs have transparent backgrounds.** A
  filter on an opaque PNG turns it into a solid block. If any are opaque, stop
  this stage and log which ones.
- Do not change the partners band further down the page.

---

## Stage 3 — photographs in place of the line drawings

### 3.1 The treatment: colour

Photographs now go in **in full colour**. The greyscale filter and the duotone
tone layer come off everywhere, because they are the coldness Simon is objecting
to. The recessed edge stays.

- Rename `TonedPhoto` to `CutPhoto` (file, component, class names, SCSS), drop
  `__tone` and the grayscale filter, and keep `__edge`. Update every import.
- Portraits (`.home-face`, `.crew__portrait`): remove the grayscale filter and
  the tone span. The empty plate is unchanged.
- Update the `crew.ts` portrait convention comment to say **colour source**,
  1200×1500. Update `CLAUDE.md` → "Layout rules": the line `Sources stay
  greyscale; the duotone is a CSS layer over them.` becomes `Photographs go in
  in colour, with no tone layer. Depth comes from the recessed edge.`

### 3.2 The slots

There are seven line drawings on `/`. Each one gets a photograph:

| where | currently | photo slot |
|---|---|---|
| fold doors (`home-door__media`) ×3 | `StreamMark` | `PHOTOS.streams[id].door` |
| stream sections (`StreamMoves`, `home-step__mark`) ×3 | `StreamMark` | `PHOTOS.streams[id].step` |
| "Why we work this way" | `FitCut` | `PHOTOS.working` |

- Extend `photos.ts`: `Photo` gains an optional `credit?: { name: string; url: string }`.
  `PHOTOS` gains `streams: Record<Stream['id'], { door: Photo; step: Photo }>`.
  The stream photos are **required**, so a missing one fails the type check.
- Doors: the photograph fills the door's media column, cropped with
  `object-fit: cover` and a sensible `object-position`. Keep the "Learn more"
  label readable, either under the image or on a scrim at its foot (your call;
  log which). Same height for all three doors.
- Steps: the photograph takes the mark's place, at a size that sits with the
  step copy rather than dominating it.
- Why section: `PHOTOS.working` is set (below), so the photo variant of the
  grid is always active. Remove `FitCut` from the page, and delete
  `components/home/FitCut.tsx` and its styles if nothing else uses them. The
  grid becomes copy | photo on wide screens and photo-then-copy on narrow ones.
  Remove the hidden-when-unset branch and its comment.
- `StreamMark` stays in use on the stream pages and `/built`. Do not touch it
  there.
- `page.tsx` line ~45 has a comment referring to "the cut illustration further
  down". Correct it.

### 3.3 The stock photographs

The shoot photos arrive at the weekend. Until then, these seven slots get stock
photography from **Unsplash or Pexels only**. Both licences allow commercial use
without attribution, but record the credit anyway (`credit`), so each photo can
be found and swapped.

Download into `public/photos/stock/`, named `<slot>.jpg`
(`software-door.jpg`, `software-step.jpg`, …, `working.jpg`). Resize to at most
2000px on the long edge and JPEG quality ~80.

**What to look for.** The point is warmth: real people, real places, natural
light.

- Candid, not posed. No one looking at the camera, no handshakes, no thumbs up.
- **No** glowing screens of code, blue light, holograms, robots, circuit-board
  close-ups, abstract "data", or anything that reads as AI or a tech stock
  library.
- Warm or neutral natural light. Australian-looking settings where you can find
  them.
- Nothing that implies a specific person is on our team.

Per slot:

| slot | brief |
|---|---|
| software door / step | People working through a problem together: at a table, whiteboard, or one laptop shared between two. Hands and paper are better than screens. |
| websites door / step | A small business at work: a café counter, a kitchen pass, a shopkeeper. This is who the Websites stream sells to; the venue sites are hospitality. |
| engineering door / step | Hands on hardware: a workbench, tools, cabling, a site. Practical and physical. No lab coats, no hard-hat-and-clipboard cliché. |
| working | A small team at work around a desk, relaxed and focused. This slot is replaced by the shoot's "at the PC" photos. |

Door and step for the same stream must be different photographs and should not
look like the same shoot.

`alt` describes what is actually in the photo, written after you have looked at
it. Do not describe the people as V Source staff.

**In the log**, for each slot: the chosen photo's URL and photographer, plus
**two alternates** (URLs only), so Simon can swap without another run.

If you cannot reach Unsplash or Pexels from your environment, stop at this
section and log it. Do not substitute generated or placeholder images.

---

## Stage 4 — stand-in portraits, for review only

Simon wants to see the team rows with faces in them before the shoot arrives.
Craig, Simon and Ronan get a stock portrait. **Tom and Asuka keep the empty
plate**, exactly as they will at launch.

These are strangers' faces under real names, so **they must never reach
production**. Build a guard first, then add the photographs:

- `CrewMember` gains `stockPortrait?: boolean`.
- A check that fails the build when `process.env.VERCEL_ENV === 'production'`
  and any crew member has `stockPortrait: true`. Put it where it runs during
  `next build`, for example a module-level throw in `crew.ts` guarded on that
  env var, and say where in the log. Prove it works by running
  `VERCEL_ENV=production pnpm build` and confirming it fails with a clear
  message. Without the env var, the build passes.
- Photos from Unsplash or Pexels: one adult each, head and shoulders, natural
  light, candid or relaxed, in colour, cropped 4:5, 1200×1500. Roughly matched
  to each person's age and look: Craig and Simon are men in their 40s, Ronan is
  a young man in his 20s. Nobody famous or recognisable.
- Save them to `public/crew/stock/<id>.jpg`. Set `portrait` to that path and
  `stockPortrait: true` on those three entries.
- Log each URL and photographer, with two alternates.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci     # includes the new ≤4,500 ms timeline test
pnpm build
```

On `next start`:

1. The headline plays once, stops on Software, and ends with a full stop. There
   is no button in the hero. Time it from load and record the time.
2. The logos render in both themes, at 1440px and 390px.
3. All seven photos render in colour. No `StreamMark` or `FitCut` remains on `/`.
   Craig, Simon and Ronan show stand-in portraits on `/` and `/team`; Tom and
   Asuka show the empty plate. The portrait edge is visible over each photo.
   `VERCEL_ENV=production pnpm build` fails on the stock-portrait guard.
4. `/` HTML: the h1's visually-hidden sentence is unchanged.
5. axe on `/`, `/team`, `/built` and the three stream pages, light and dark: 0
   violations.
6. Screenshot `/` at 1440px and 390px in both themes, and list the paths in the
   log for Simon to review.

---

## The log

Append to `docs/briefs/warmth.log.md`, same format as before. Last line exactly
one of: `STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
