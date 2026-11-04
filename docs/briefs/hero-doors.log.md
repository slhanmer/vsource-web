# Log — hero-doors

4 November. Branch `development`, from `20cdb5c`. One commit, this log
included. This ran after moves-pin and before cms resumes. The cms work in
progress is still stashed by pathspec, so this sits on the current layout. The
3200 dev server stayed up. The checks ran on `next start -p 3100`.

The brief matched the code, with one wording difference. The brief calls the
door's edge "raised", but the doors are cuts (recessed openings). Their edge
is the `::after` kerf ring that hover already lights, so that is where the
teal goes.

## 1. One timeline

- **`HeroRun.tsx`** (new, client): a small context provider wrapped around the
  fold's headline and doors in `page.tsx`. It holds the doors' state
  (`waiting` / `arriving` / `shown`), which door is active, and whether the
  fold is armed.
- **The headline reports into it; the doors only read it.**
  `RotatingHeadline` calls `wordTyped(step)` from inside the same timer step
  that types a word's last letter, alongside `setTyping(false)`. React
  batches those updates, so a door and its word land in the same render. The
  doors have no timers of their own and cannot drift.
- `wordTyped` has a stable identity (`useCallback`), so adding it to the run
  effect's dependencies does not restart the run.
- **The timeline itself is unchanged.** It is still 3,240 ms by the arithmetic,
  and the ≤ 4,500 ms test still passes, so no pause control is needed under
  WCAG 2.2.2.

## 2. What the doors do

- **`HeroDoors.tsx`** (new, client) renders the three doors in `STREAMS`
  order, the same order as `WORDS`. They replace the `<Reveal>` wrapper they
  used to sit in, and the old `.is-out/.is-in .home-door` rules (a 22px rise
  with staggered delays) are removed.
- **At mount** (armed one frame after mount): Software is `shown` and
  active, and Robotics and Websites are `waiting` (opacity 0, 12px lower).
- **A word finishes typing:** its door goes to `arriving` (12px rise, 500ms
  `ease-out`) and becomes the active one. **Active** lights the kerf ring in
  `--route-active`, the way hover lights it in `--brand-highlight`. The
  highlight moves from the previous word's door at the same moment.
- **Run ends** (Software retyped): all doors in, none active.
- The `headlineTimeline.ts` arithmetic comment now carries a ⚠ note that the
  doors run off this timeline, so changing a hold changes the whole fold.

## 3. Fallbacks

- **Before hydration and without JavaScript every door is visible.** The
  provider starts with every door `shown`, and the hidden state only exists
  under `.home-doors.is-armed`, which is set a frame after mount.
- **Reduced motion:** the provider never arms and `active` is forced to null.
  The site's reduced-motion block also lists the waiting state.
- **Every door is a link from the first paint.** A waiting door is
  transparent, not removed, so it can still be clicked and focused.
  `onFocus` sets it to `shown` immediately, with no transition.

## Verify

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint:ci` | clean |
| `pnpm test:ci` | 594 pass, including the ≤ 4,500 ms timeline test |
| `pnpm build` | passes |

1. **Doors against words**, measured on every animation frame from page start
   (ms; "frame Δ" counts frames between the word completing and its door
   arriving):

   | View | Robotics typed / door | Websites typed / door | Software retyped / none lit | frame Δ |
   |---|---|---|---|---|
   | 1440 light | 1313 / 1313 | 2430 / 2430 | 3579 / 3579 | **0, 0, 0** |
   | 1440 dark | 1287 / 1287 | 2420 / 2420 | 3539 / 3539 | 0, 0, 0 |
   | 390 light | 1281 / 1281 | 2414 / 2414 | 3548 / 3548 | 0, 0, 0 |
   | 390 dark | 1268 / 1268 | 2402 / 2402 | 3535 / 3535 | 0, 0, 0 |

   In every view the highlight moved to each door in the frame its word was
   typed. It was armed at 148–197 ms with `[shown+active, waiting, waiting]`.
   At the end (6 s) all three doors are at opacity 1 and none is active.
   Frames every 250 ms from 0 to 5 s are in `frames/`.
2. **No JS and reduced motion:** all three doors are at opacity 1 from the
   first paint, with no highlight. With JavaScript on, the very first sampled
   frame also has all three at 1, before arming.
3. **Tab to the Websites door at load**, reached about 80 ms in while
   "Software" was still the word: the door is `shown` at opacity 1, with no
   entrance.
4. **axe on `/`:** 0 violations, light and dark, at 1440 and 390.

## Screenshots — `C:\tmp\hero-doors\`

- `frames/{1440,390}-{light,dark}-{0000…5000}ms.png`: every 250 ms
- `{…}-rest.png`: the fold at rest
- `{…}-tab-websites.png`
- `results.json`

STATUS: done
