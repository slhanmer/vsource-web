# Log — warmth brief

## Run 1 — 2026-11-03 — development

Stages 1, 3 and 4 are done, as one commit each, pushed to `development`.
**Stage 2 is blocked:** the QUT logo is an opaque PNG (details below).
Verification used the production server (`next start`) on **port 3123**.

| Stage | Commit |
|---|---|
| 1 — headline | `e5079c6` |
| 2 — logos | not done: blocked |
| 3 — photographs | `d231fd9` |
| 4 — stand-in portraits | `fde807e` |

### Stage 1 — the headline

- It plays once: Software → Websites → Engineering → Software, then stops on
  Software. The server render and the reduced-motion state are both Software.
  The tail reads `built to fit.`, a real full stop in the same span and type.
- The timing moved into `src/components/home/headlineTimeline.ts`. The
  arithmetic is written out next to the constants:
  `HOLD 600 · TYPE 42 · DELETE 18 · CUT 120`.
  - 3 holds = 1,800 ms
  - 27 characters deleted = 486 ms
  - 6 cut beats = 720 ms
  - 27 characters typed = 1,134 ms
  - **Total: 4,140 ms from mount.**
  - Each 600 ms hold is longer than typing the longest word (Engineering,
    462 ms).
- `tests/headlineTimeline.test.ts` sums the timeline from the constants and
  fails over 4,500 ms. It also checks that the run ends on Software and that
  each hold outlasts the typing. Tests: 41 → 42 suites, 594 tests.
- Deleted: the pause `<button>`, the `paused` and `hovered` state, the hover
  and focus handlers, `.rotator__pause`, `.rotator__icon`, and the comments
  that defended them. Point 3 of the header comment is rewritten. The
  CLAUDE.md 2.2.2 line is replaced verbatim.
- Under reduced motion, the component now derives the final word at render
  instead of setting state in the effect. The repo's
  `react-hooks/set-state-in-effect` lint rule rejects the latter.
- **Measured on `next start`, in Chromium at 1440×900:** the last change to
  the word lands at **4,493 / 4,480 / 4,464 ms from navigation start**
  across three runs. That includes roughly 300 ms before the component
  mounts, plus timer slippage. It ends on "Software" with no caret, and the
  hero contains no `<button>`.

### Stage 2 — logos in "Working with": BLOCKED

The transparency check came first, as the brief requires. I read every
pixel's alpha:

| file | mode | transparent pixels | corners |
|---|---|---|---|
| `aptium.png` | RGBA | 72% | alpha 0 |
| `qut.png` | RGBA | **0%** | **alpha 255 (opaque)** |
| `training-professionals.png` | RGBA | 61% | alpha 0 |

**`qut.png` is opaque.** A colour filter would turn it into a solid block.
Per the brief, I stopped this stage and changed nothing. It needs a
transparent QUT mark, usually available from QUT's brand kit, exported at
roughly 94×96 or larger.

Something to know before this stage is picked up again: at ≤480px wide, and
on any screen shorter than 820px, `.home-plate__foot` (the "Working with"
line) is `display: none`. That is the existing fold rule, so the logos would
not be visible at 390px anyway. Decide whether that is acceptable, or whether
the foot needs a mobile treatment, before the logo work is redone.

### Stage 3 — photographs

**3.1 Colour**
- `TonedPhoto` is now `CutPhoto` (`git mv`, so history follows): the file, the
  component, `.cut-photo*` classes and `cutPhoto.scss`. `__tone` and the
  greyscale filter are gone; `__edge` stays. Every import is updated
  (`page.tsx`, `team/page.tsx`).
- Portraits on `/` and `/team` no longer have the filter or the tone span.
  The `.home-face__tone` and `.crew__portrait-tone` styles are deleted. The
  reveal's blurred start state is `blur(14px) saturate(0.2)` with no
  greyscale. Under reduced motion the filter is `none`.
- The empty plate is unchanged. Its long comment no longer refers to "duotone
  portraits".
- The `crew.ts` convention now reads COLOUR source, 1200×1500. The CLAUDE.md
  layout-rules line is replaced verbatim.

**3.2 Slots**
- `Photo` gains an optional `credit`. `PHOTOS` gains `streams`, typed as
  `Record<Stream['id'], { door; step }>`, and `working` is now required.
- **Brief vs code:** `Stream['id']` was `string`. A `Record` keyed on a plain
  string does not make a missing stream a type error, so the brief's "a
  missing one fails the type check" could not hold as written. I added
  `export type StreamId = 'software' | 'websites' | 'engineering'` in
  `streams.ts` and typed `id` with it. Nothing else needed changing.
  **Consequence:** a fourth stream is now data plus one edit to that union,
  plus its two photos, which the type checker will demand.
- **Doors:** the photo is a fixed 4:3 window,
  `clamp(104px, 10.5vw, 168px)` wide (76px in the 481–979px tier), with
  `object-fit: cover`. **"Learn more" sits under the image**, not on a scrim.
  That keeps it in `--route-active` on the page ground, so its contrast never
  depends on the photograph. At ≤480px the label and the photo (64px) sit
  side by side instead. Stacked, they added about 180px across three doors
  and pushed the plate off the screen at 390×844. All three doors are the
  same height at every viewport I measured:
  - 1440×900 — 200px
  - 1440×768 — 166px
  - 1280×720 — 154px
  - 1024×768 — 134px
  - 768×1024 — 98px
  - 600×800 — 98px
  - 390×844 — 74px
  - 360×640 — 66px
  - 320×568 — 66px

  The last door ends inside the screen at all nine.
- **`object-position`:** I left the default centre, because all seven crops
  looked right in the screenshots. If one needs nudging, add a per-photo
  position to `Photo`; I did not add one speculatively.
- **Steps:** a 4:3 `CutPhoto`, `clamp(220px, 24vw, 340px)` wide, takes the
  mark's place above the answer. It fades in on the first beat (`is-in`), and
  the reduced-motion block shows it at rest. The `.home-step .markwrap` and
  `.home-door .markwrap` rules are deleted.
- **Why section:** the grid is copy | photo, with photo then copy below
  979px. FitCut is out of the page. `components/home/FitCut.tsx` and all of
  its styles (the `.fitcut` section, the `fc-*` keyframes and the
  reduced-motion overrides) are deleted, since nothing else used them. The
  hidden-when-unset branch and its comment are gone.
- `StreamMark` is untouched on the stream pages, `/built` and the landings.
  The shared `.markwrap` rules in `home.scss` are untouched too.
- The `page.tsx` comment about "the cut illustration further down" is
  corrected. So is the "cut animation" mention in its header comment, and the
  wording in StreamMoves' header comment.

**3.3 Stock photographs: how they were sourced**
- unsplash.com search pages could be read with the web-fetch tool. The
  `/photos/<id>/download` endpoint answered one plain request, then began
  serving a bot challenge (`/.within.website`). Faking a browser to get past
  it was refused by the permission guard, and I did not try to work round
  that.
- What I did instead: I read each candidate's `images.unsplash.com` address
  from the search page and downloaded it directly from Unsplash's image CDN.
  I then checked **every chosen photo** against its own photo page:
  photographer, image address, and "Free to use under the Unsplash License".
  None is Unsplash+.
- Pexels was not needed. Its site returns 403 to plain requests.
- I looked at every candidate on contact sheets before choosing, and at each
  chosen file again before writing its alt text.
- Files are 2000px on the long edge, JPEG q80, in `public/photos/stock/`.
- **Rejected on sight:** the Sweet Life table shots, which have "Diabetes
  Advocacy" written on the table and would read badly next to a medical
  client; anything with masks (they date the photo); posed-to-camera staff
  shots; and circuit-board close-ups.

| slot | chosen | photographer | alternates |
|---|---|---|---|
| software-door | https://unsplash.com/photos/z1hePtraqbo | Yegor Makarenko | https://unsplash.com/photos/i4BPnD5nrPc · https://unsplash.com/photos/oB-uQQ2i0Cg |
| software-step | https://unsplash.com/photos/6jg8KPfEOtU | Cabri Caldwell | https://unsplash.com/photos/tLG2hcpITZE · https://unsplash.com/photos/7okkFhxrxNw |
| websites-door | https://unsplash.com/photos/Oyf1-w0lxbE | Toa Heftiba | https://unsplash.com/photos/Kx3o6_m1Yv8 · https://unsplash.com/photos/8jp-6SjVibM |
| websites-step | https://unsplash.com/photos/hM6MSq__M0Q | Stella He | https://unsplash.com/photos/y-XZf_TNRms · https://unsplash.com/photos/cC-OMDTczoA |
| engineering-door | https://unsplash.com/photos/9Foi-h8zmIU | Hasan Mrad | https://unsplash.com/photos/HmhztfWua-E · https://unsplash.com/photos/i0clSU4T_bU |
| engineering-step | https://unsplash.com/photos/y25LI38cd9w | Eric Stoynov | https://unsplash.com/photos/MCKz5KGAmdQ · https://unsplash.com/photos/Ou6MDRwsFOY |
| working | https://unsplash.com/photos/dWYU3i-mqEo | Annie Spratt | https://unsplash.com/photos/Of_m3hMsoAA · https://unsplash.com/photos/TxSVqNgnjq4 |

The alternates came from searches filtered to free licences. I have not
opened each alternate's own page, so check the licence line on the page when
swapping one in.

**Worth a look before launch:**
- **websites-door** is Camber Coffee in Newcastle, UK. "CAMBER COFFEE NCL"
  is on the back wall under the menu. At door size (≤168px) it is not
  legible, but it is a real business's name on our page. The drinks menu
  (piccolo, flat white) is the most Australian-looking thing I found, which
  is why I kept it. Swap it for `Kx3o6_m1Yv8` if you would rather not.
- **engineering-step** has a ThinkPad logo on the laptop lid. The screen is
  not visible.
- **engineering-door** is an artisan making souvenirs in Djerba, Tunisia:
  hands on a jig at a wooden bench. It reads as workshop craft rather than
  electrical or systems work. It is the warmest on the list, but if the
  Engineering door should read as systems work, `HmhztfWua-E` is closer.

### Stage 4 — stand-in portraits

- `CrewMember` gains `stockPortrait?: boolean`.
- **The guard** is a module-level `throw` at the foot of
  `src/constants/crew.ts`. It fires when `process.env.VERCEL_ENV ===
  'production'` and any member has `stockPortrait: true`, and the message
  names them. It runs in `next build`'s "Collecting page data" step, because
  the root layout imports the constants. Vercel sets `VERCEL_ENV=production`
  only for the production deployment, so previews of `development` still
  build with the faces.
  - `VERCEL_ENV=production pnpm build` → **exit 1**:
    `Error: Failed to collect configuration for /_not-found … [cause]: Error:
    Stock stand-in portraits must not ship to production: Craig Schneider,
    Simon Hanmer, Ronan Donahoe. Replace each with the real photograph and
    remove \`stockPortrait: true\` in src/constants/crew.ts.`
  - `pnpm build` without the variable → passes, 27/27 pages.
  - **This means merging `development` into `main` will fail the production
    deploy until the real portraits replace these.** That is the point of the
    guard, but plan the merge around it.
- **Files:** `public/crew/stock/craig-schneider.jpg`, `simon-hanmer.jpg` and
  `ronan-donahoe.jpg`. The brief says `<id>.jpg`, and the ids are the full
  hyphenated names, so the files use those. Each is cropped 4:5 from the
  original and resized to 1200×1500, JPEG q80. The `next/image` width and
  height on both pages are now 1200×1500; they were 880×1100, the same
  aspect ratio.
- Tom and Asuka keep the empty plate, which I confirmed on both pages.
- Portraits are `alt=""` inside an `aria-hidden` box, as before; the name is
  in the caption.
- The crew.ts header has a "STOCK STAND-INS" note explaining all of this.

| who | chosen | photographer | alternates |
|---|---|---|---|
| Craig (40s) | https://unsplash.com/photos/Jv6n-gNdxfc | Griffin Wooldridge | https://unsplash.com/photos/d8OX1jeN5Ac · https://unsplash.com/photos/sY1pkXxz_pM |
| Simon (40s) | https://unsplash.com/photos/oz2wj86hGxA | Greg Edwards | https://unsplash.com/photos/qqHh6go1i4s · https://unsplash.com/photos/EZ4TYgXPNWk |
| Ronan (20s) | https://unsplash.com/photos/xvumNdWowcM | Tim Bernhard | https://unsplash.com/photos/tsicWqYNB-8 · https://unsplash.com/photos/k1-aCVxTZto |

I left out the most heavily reused Unsplash faces (for example
`7YVZYZeITc8` and `iFgRcqHznqg`): they are recognisable as stock, which
breaks "nobody recognisable" in its own way.

### Verify

- `pnpm tsc --noEmit` clean · `pnpm lint` clean · `pnpm test:ci` 42 suites /
  594 tests passed · `pnpm build` 27/27.
1. Headline: plays once and stops on Software with a full stop, and there is
   no button in the hero. Timed at **≈4,480 ms from navigation start** to the
   last character (three runs above).
2. Logos: **not done** (Stage 2 is blocked).
3. All seven photos load with `filter: none` and no tone layer.
   - No `markwrap`, `mark` or `fitcut` markup remains on `/`.
   - Craig, Simon and Ronan show their stand-ins on `/` and `/team`, and Tom
     and Asuka show the empty plate. There are 12 edge layers on `/` (7
     photos + 5 faces) and 5 on `/team`.
   - `VERCEL_ENV=production pnpm build` fails on the guard.
4. The `/` h1's visually-hidden sentence is unchanged: "Software, websites
   and engineering, built to fit."
5. axe-core 4.12.1 (wcag2a/aa, 21a/aa, 22aa, best-practice), after scrolling
   every reveal in, on `/`, `/team`, `/built`, `/software`, `/websites` and
   `/engineering`, light and dark: **0 violations** on all 12 runs.
6. Screenshots for review, taken on `next start` after the headline had
   stopped:
   - `C:\tmp\warmth\home-1440-light-fold.png` · `home-1440-light-full.png`
   - `C:\tmp\warmth\home-1440-dark-fold.png` · `home-1440-dark-full.png`
   - `C:\tmp\warmth\home-390-light-fold.png` · `home-390-light-full.png`
   - `C:\tmp\warmth\home-390-dark-fold.png` · `home-390-dark-full.png`

**Not touched:** `.claude/`, `_to_delete/`, `.env.local`, and
`docs/briefs/robotics.md`, which appeared in the tree during this run and is
not mine.

STATUS: partial
