# Brief — review-1

**Repo:** `V Souce Development` · **Branch:** `development` (HEAD `515ce0f`)
**Push:** `development` only. One commit per section is fine; say which in the log.
**Read `CLAUDE.md` first.**

This is Simon's first screen-by-screen review of the site (3 November). Every
item is his call. Where an item reverses an earlier decision that `CLAUDE.md` or
a comment defends, update the text and do not argue for the old version.

Where the brief does not match the code, stop and log it.

---

## 1. "Working with" strip: logos in full colour

- Remove the one-colour filter and the reduced opacity. Show the logos in their
  own colours, in both themes.
- **QUT:** restore the original `public/logos/partners/qut.png` from before
  `5309eb0` (`git show 5309eb0^:public/logos/partners/qut.png`). The
  transparent-letters version only existed for the filter. Simon will supply
  the official file later; until then the original is the one to use.
- Check that every logo reads against the strip in both themes. If one
  disappears on dark (a dark logo on a dark plate), give the strip's logos a
  small raised light plate, the same treatment as the partners band below. Log
  what you did.

## 2. Hero: the word box keeps one width

The cut slot currently recuts to each word's width. Simon wants it fixed.

- Measure every word in `WORDS` once, after fonts load, and set the slot to the
  **widest** of them. It never changes width after that. Shorter words sit
  left-aligned inside it, on the same baseline.
- Remove the recut beats from the timeline (`CUT_MS` and its six beats) and
  update the arithmetic comment and the ≤4,500 ms test to match.
- The header comment's "the slot is recut to the next word's width first"
  argument is now wrong. Rewrite that paragraph to describe the fixed slot.

## 3. Stream order: Software, Robotics, Websites

Websites moves to third. Reorder `STREAMS` in `streams.ts`. That reorders the
fold doors, the "What changes" sections, the nav and the sitemap. Also:

- `WORDS` becomes `['Software', 'Robotics', 'Websites']`, so the headline runs
  in the same order as the page. It still starts and ends on Software.
- The `#software` anchor target is unchanged.
- Grep for any other place that hardcodes the three in the old order, including
  comments, `CLAUDE.md` and the visually-hidden h1 sentence (`Software, robotics
  and websites, built to fit.`). Update them and list them.

## 4. Image corners: no radius inside a frame

A photo with its own rounded corners inside a frame with different rounded
corners leaves a mismatched gap at each corner. Rule, applied everywhere:

- **A photo never carries its own radius when it sits inside a frame.** The
  frame clips it (`overflow: hidden` plus the frame's radius, or `clip-path` if
  `overflow` would break a reveal). Where the photo touches the frame's edge,
  the corner is the frame's. Where it is inset with padding, its corners are
  square.
- A free-standing `CutPhoto`, not inside any frame, keeps `$radius-md`.
- Check every photo on `/`, `/team` and `/built`: the doors, the "What changes"
  steps, the why section, portraits, and project media. List each one and
  which case it falls under.

## 5. "More on each": exactly one fold

The cue link scrolls past the target. It should land the next section just
under the sticky top bar.

- Work out what overlaps the top of `#main` (the header, the LOC/STATUS
  readout) and its height at each breakpoint.
- Give the target section a `scroll-margin-top` equal to that height (a CSS
  custom property set where the header height is known), so the plain `href`
  anchor lands correctly without JavaScript. Smooth scrolling only when
  `prefers-reduced-motion` is not set.
- Check it at 1440×900 and 390×844: after clicking, the "What changes" eyebrow
  sits immediately under the bar, with nothing hidden behind it.

## 6. "What changes": fade, don't pop

The "Now" problem and the reply block (photo, heading, copy) appear abruptly.
Keep the two beats and their trigger points. Change how each beat arrives:

- `opacity 0 → 1` with a **12px rise** (`translateY(12px) → 0`), **500ms**,
  `ease-out`, once. No clip-path wipes and no scale. If any of those exist on
  these elements, remove them.
- The photo, heading and copy in the reply arrive together as one block.
- `prefers-reduced-motion`: no transition, everything visible.
- Record a short before/after in the log (frame captures at 0, 150, 300 and
  500ms are enough).

## 7. Partner and client cards

- **QUT logo** overflows its white plate. Fit it inside with padding, the same
  way the Training Professionals logo sits. Every logo gets the same inner
  padding.
- **Copy:**
  - QUT `body`: `Full industry partner with QUT, with student capstone teams working on live projects with us.`
    **Remove `pending: true`.** Confirmed by Simon on 3 November.
  - Training Professionals `body`: `Rebuilt a ten-year-old training platform, then added AI marking that runs on hardware we own in Australia, so student work never goes to a third-party AI service.`
    **Remove `pending: true`.**
- No partner is `pending` after this. Keep the field, but reword its doc comment
  so it no longer says the wording comes from Craig.

## 8. Team

- **Order:** Craig, Simon, Ronan, Asuka, **Tom last**. Update the order
  rationale in the `crew.ts` header comment to match.
- **Tom's tile:** he will never have a photo, so the empty plate should look
  intentional rather than missing. Replace the initials plate, for Tom and for
  any future member without a portrait, with a **terminal tile**:
  - The same 4:5 box, edge and radius as the photos.
  - The terminal's colours from the site's tokens: the LOC/STATUS readout's
    face and colours. No new hex values.
  - Two lines in `$font-family-mono`: `$ whoami` then `tom`, where the second
    line is the member's first name, lowercase, derived from `name`. Then a
    block cursor.
  - **The cursor blinks for no more than five seconds, then stays solid.** A
    blink that runs longer than that falls under WCAG 2.2.2 and would need a
    pause control. No blinking at all under reduced motion.
  - The tile is decorative (`aria-hidden`); the name and role are already in
    the text beside it.
  - Same tile on the home team row and on `/team`, sized to each.
- Remove the now-unused initials markup and styles if nothing else uses them.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

On `next start`, at 1440×900 and 390×844, light and dark:

1. The strip shows three logos in colour; QUT renders.
2. The hero slot does not change width at any point in the run. Measure it
   every frame and log the min and max.
3. Doors, sections, nav and headline all run Software → Robotics → Websites.
4. No photo shows a corner gap. List the photos checked.
5. "More on each" lands the next section directly under the bar.
6. Frame captures of the fade.
7. Partner cards: QUT is inside its plate, and neither card shows a marker.
8. Team order ends with Tom, whose terminal tile stops blinking at five seconds
   or less (measure it).
9. axe on every sitemap route plus the 404, light and dark: 0 violations.

Screenshots of each item go to `C:\tmp\review-1\`, listed in the log.

---

## The log

Append to `docs/briefs/review-1.log.md`. Last line exactly one of:
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
