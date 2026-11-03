# Brief — photo-balance

**Order:** run after warmth Stage 2 (the logos) and before `robotics.md`.
**Repo:** `V Souce Development` · **Branch:** `development`
**Push:** `development` only. One commit.
**Read `CLAUDE.md` first.**

Simon's review of the warmth run (3 November): the photographs went in as
thumbnails where the drawings used to be, so they are too small and the
compositions are unbalanced. The scroll reveal in "What changes" also needs a
change. This brief is layout only. No copy changes, and no new photos.

Where the brief does not match the code, stop and log it.

---

## 1. Fold doors: the photo is half the card

Right now each door is a small inset thumbnail with "Learn more" under it,
followed by a wide text column that is mostly empty.

- The photograph fills the **left part of the door, flush to its top, bottom
  and left edges**, about **40% of the door's width**, with `object-fit: cover`.
  No inset padding around it. The door's own radius clips the outer corners,
  and the recessed edge sits on the door, not on the photo.
- The text column keeps its padding. **"Learn more" moves into the text
  column**, under the lede, left-aligned with it.
- The three doors stay equal height. If the photos need more height to read,
  the doors can grow, but **the fold must still fit at 1440×900** with the CTA
  visible. Check that and say what height you landed on.
- Narrow screens: keep whatever the current stacked behaviour is, with the photo
  as a full-width band across the top of each door at a fixed aspect (16:9 or
  close).
- `sizes` updated to match the new rendered widths.

## 2. "What changes": the image arrives with the answer

`StreamMoves.tsx` currently reveals the problem **and the photograph** on beat
one (`is-in`), then the answer on beat two (`is-told`). Simon wants it to read
as problem → **then the answer and the photograph together**.

- Move the photo's hidden/shown rules from `is-out`/`is-in` to the
  `:not(.is-told)`/`.is-told` pair, so it fades in with the answer. Use the same
  transition as the answer.
- Update the component's header comment ("the situation lands on the left while
  a photograph of that work fades in on the right") and the comment over the
  beat-one CSS to match.
- The reduced-motion block keeps everything visible. Update its selector list
  for the moved rule.

**Check that the reveal actually happens.** Load `/` scrolled to the top, then
scroll down through all three steps in Chromium, with `#main` as the scroller,
and capture each step before and after beat two. Simon could not see a fade.
If the first step is already primed as "on screen" at a 1440×900 load, say so.
That would be by design, but it means he would never see it animate at that
size, so report it rather than changing the priming.

## 3. "What changes": a bigger photo, a balanced step

Right now the problem sits on the left with a large empty column under it, and
the reply on the right is a 340px photo with the answer below it.

- The photograph fills the **full width of the reply column**, at 3:2. No 340px
  cap.
- Align the top of the problem with the top of the photo, so the two beats read
  as one row.
- Cut the vertical gap between steps to whatever lets the next step's problem
  start entering as the current answer settles. Use the reveal margins as the
  guide and keep the two-beat scroll. Log the before and after values.
- Narrow screens: problem, then photo full width, then answer.
- `sizes` updated to match.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

On `next start`:

1. The fold at 1440×900 shows all three doors and the CTA, in both themes.
2. The scroll capture from §2, with the photo hidden before beat two and shown
   after.
3. Screenshots of `/` at 1440 and 390, light and dark: the fold and each step.
   List the paths in the log.
4. axe on `/`, light and dark: 0 violations.

---

## The log

Append to `docs/briefs/photo-balance.log.md`. Last line exactly one of:
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
