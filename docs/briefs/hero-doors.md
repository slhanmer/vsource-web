# Brief — hero-doors

**Run after `moves-focus`, before `cms`.**
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only. One commit. The dev server on 3200 stays up.
**Read `CLAUDE.md` first.**

Simon's review (4 November): the fold is static. The headline types Software →
Robotics → Websites → Software and stops, while the three doors beside it just
sit there. **Tie them together: each door arrives as its word is typed.**

Where the brief does not match the code, stop and log it.

---

## 1. One timeline, not two

The doors are driven by the **same timeline** as the headline
(`headlineTimeline.ts`), not by timers of their own. Expose the run's progress
(which word is on screen, and when the run ends) from the headline to the
doors: a small context or an event, whichever fits. The two can never drift,
and the doors finish when the headline finishes. The whole run stays
**≤ 4,500 ms** (the existing test), so WCAG 2.2.2 still needs no pause control.
Do not lengthen it.

## 2. What the doors do

Doors run in page order: Software, Robotics, Websites, the same order as
`WORDS`.

- **At mount:** the Software door is in (its word is already on screen). The
  Robotics and Websites doors start out (opacity 0, 12px lower).
- **When a word finishes typing:** that word's door arrives, opacity 0 → 1 with
  the 12px rise, 500ms, `ease-out` (the site's standard entrance from
  `review-1`).
- **While a word is on screen, its door is active:** the raised edge picks up
  the teal (`--route-active`, since cyan points), so the eye links the word to
  the card. When the word moves on, the highlight moves with it.
- **When the run ends** (back on Software): all three doors are in, and **no
  door is highlighted**. The fold comes to rest, still.

## 3. Fallbacks (non-negotiable)

- **Before hydration and without JavaScript, all three doors are fully visible.**
  Arm the hidden state only once the client has mounted, the same priming
  pattern the rest of the home page uses. A door must never be invisible
  because a script failed.
- `prefers-reduced-motion: reduce`: no entrance and no highlight. All visible,
  as now.
- Every door is a working link from the first paint. A door that is mid-
  entrance is still clickable and focusable. If a door receives focus before
  its turn, it appears immediately.

## 4. Comments

Note in `headlineTimeline.ts`, next to the arithmetic, that the doors run off
this timeline too, so anyone changing a hold knows they are changing the fold.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci   # the ≤4,500 ms test still passes
pnpm build
```

In Chromium at 1440×900 and 390×844, light and dark:

1. Frame captures every 250ms from load to 5s: doors arrive in order with
   their words, the highlight follows the word, and at the end all three are
   in with none highlighted. Log each door's arrival time against its word's
   typed time; they should match to within one frame.
2. With JavaScript disabled, and under reduced motion, all three doors are
   visible from the first paint.
3. Tabbing to the Websites door at load brings it in immediately.
4. axe on `/`, light and dark: 0 violations.

Screenshots and frames go to `C:\tmp\hero-doors\`.

## The log

Append to `docs/briefs/hero-doors.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
