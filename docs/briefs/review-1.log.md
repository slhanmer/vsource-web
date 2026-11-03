# Log — review-1

4 November. Branch `development`, started at HEAD `515ce0f`.

## Before anything: the working tree was not clean

The brief assumes HEAD `515ce0f`. HEAD matched, but the working tree held
about 360 lines of **uncommitted, unlogged work on this brief**, from
3 November 16:39–16:53. It touched all eight sections and included the new
`TerminalTile` files and before/after captures in `C:\tmp\review-1\`
(`before/`, `before.mjs`, `fade.mjs`, `verify.mjs`). There was no log and no
commit. It looks like an earlier run of this brief that stopped before writing
anything up.

I did not discard it. I checked each section against the brief, fixed where it
differed (below), and verified the result myself. Where this log says "done",
I measured it in this session. It does not rely on that run's own claims.

Where it differed from the brief:

- **Section 7 copy was wrong.** QUT read *"Industry partner with QUT, putting
  students and researchers on real client work."* and still had
  `pending: true`. Training Professionals read *"…runs on their own hardware,
  so student work never leaves the building."* That is a different factual
  claim from the confirmed wording, which says the hardware is ours. Both are
  now word for word as in the brief, and QUT's `pending` is gone.
- **One stale old-order string was missed:** the home page meta description,
  `Custom software, websites and systems work, …`. It now reads
  `Custom software, robotics and websites, …`.
- `docs/DEPLOYMENT.md` still said "initials are used until [portraits]
  exist". Updated to the terminal tile.
- `CLAUDE.md` "Current state" said two partners still show a marker. Updated.

Left alone and **not committed**, because they are outside this brief or
outside what I may touch: `.claude/settings.json` (modified),
`.claude/__probe`, `.claude/settings.json.aptium-backup`, and `_to_delete/`
(an empty `architecture-APT-DOC-009` folder, Aptium residue). They are all
still in the working tree for Simon.

## Commits

One commit for all eight sections: **`836ab64`**, plus this log. The sections
share `home.scss` hunk by hunk, and splitting them needs interactive staging,
which this environment does not have. The commit message lists the eight
sections separately. Pushed to `development` only.

## 1. "Working with" strip: full colour

- `filter: var(--home-logo-ink)` and `opacity: 0.6` are removed, and so is the
  `--home-logo-ink` token.
- `qut.png` is byte-identical to `5309eb0^` (blob `5ad6e00`, checked with
  `git hash-object`).
- **Raised plate added.** Against the dark plate, Aptium's purple and Training
  Professionals' navy disappear. Each logo now sits on a small raised light
  plate: `--home-logo-plate`, padding 4px 8px, 32px tall, `$radius-sm`, light
  on the top edge and a hairline seat underneath. That is the partners band's
  ground. The band now uses the same token instead of a hardcoded `#f4f7f5`.
- Measured at 1440, light and dark: 3 logos, all loaded (natural width > 0),
  `filter: none`, `opacity: 1`, plate `rgb(244, 247, 245)`.
- **At 390×844 the strip does not render.** The whole fold foot is hidden at
  `max-width: 720px` or `max-height: 820px`. That was already the case and is
  not part of this brief, so the strip can only be checked at 1440. The logos
  still appear on mobile in the partners band.

## 2. Hero: fixed slot

- Every word in `WORDS` is measured once, after `document.fonts.ready`, from a
  clone of the inner span. The slot is set to the widest word plus its padding,
  stored in `em` so it follows the headline's `clamp()` without measuring
  again. The resize listener is gone. Text is left-aligned and the width
  transition is removed.
- `CUT_MS` and its six beats are gone. The arithmetic comment now sums to
  **3,240 ms** (holds 1,800 + deletes 432 + types 1,008). The test asserts
  3240 exactly and checks it against `BUDGET_MS` (4,500).
- The header comment's "recut to the next word's width" paragraph is rewritten
  to describe the fixed slot.
- **Measured every animation frame for 6 s** from first paint. That covers the
  whole run: Software, Robotics, Websites and back to Software.

  | View | min | max | changes |
  |---|---|---|---|
  | 1440 light | 293.16 | 294.31 | 294.31 → 293.20 at ~100 ms, → 293.16 at ~140 ms |
  | 1440 dark | 293.16 | 294.31 | same, at 120 / 144 ms |
  | 390 light | 112.09 | 112.53 | 112.53 → 112.14 → 112.09 by ~120 ms |
  | 390 dark | 112.09 | 112.53 | same |

  For the honest reading: the slot settles once, by 1.15px at 1440 and
  0.44px at 390. That happens in the first ~150 ms, before the measurement
  lands, while the slot is still sized to "Software" as rendered. It is inside
  the first 600 ms hold, before any character is deleted. **From then to the
  end of the run the width does not change at all** (0.000px). The second
  0.05px step is sub-pixel rounding of the `em` value.

## 3. Stream order

`STREAMS` is reordered. Every place that hardcoded the old order and was
changed:

- `src/constants/streams.ts`: `STREAMS` order, `StreamId` union order
- `src/components/home/headlineTimeline.ts`: `WORDS` =
  `['Software', 'Robotics', 'Websites']`, plus the run comment
- `src/components/home/RotatingHeadline.tsx`: header comment (twice) and the
  visually-hidden h1, now `Software, robotics and websites, built to fit.`
- `src/components/layouts/siteNav.ts`: `SITE_NAV`, plus a note to keep it in
  step with `STREAMS`
- `src/constants/photos.ts`: keys reordered (cosmetic only, keyed by id)
- `src/components/home/StreamMark.tsx`: branch order (cosmetic)
- `src/app/page.tsx`: metadata title and description
- `src/app/[stream]/page.tsx`: header comment
- `CLAUDE.md`: Routes line, and "the third stream is Robotics" → "the stream
  is Robotics"

Sitemap, doors and "What changes" sections follow from `STREAMS` on their own.
Measured, at both sizes in both themes: doors, steps, nav (header and footer)
and the sitemap all run Software → Robotics → Websites. `#software` still
exists on the first step.

## 4. Image corners

The rule is now written in `cutPhoto.scss` and beside each override. Every
photo was checked by computed style at 1440 and 390, light and dark:

| Photo | Case | Result |
|---|---|---|
| `/` doors ×3 (`.home-door__photo`) | In a frame. `.home-door__cut` (8px, `overflow: hidden`) clips it | own radius 0 |
| `/` door phone thumbnail (narrow layout) | In a frame, inset | square (its `$radius-md` removed) |
| `/` "What changes" steps ×3 | Free-standing `CutPhoto` | keeps `$radius-md` (8px) |
| `/` why section | Free-standing `CutPhoto` | keeps 8px |
| `/` team portraits ×4 (`.home-face`) | `.home-face` is the frame: 8px, overflow hidden; the img has none | img 0 |
| `/team` portraits ×4 (`.crew__portrait`) | Inset in the card's padding | square (was `$radius-sm` inside the card's 8px) |
| `/built` index media ×6 | `.built-media` frame (8px, overflow hidden) | img 0 |
| `/built/{training-professionals, nug, snug, janes-deli, bar-coopers, don-gino}` | Same `.built-media` frame | img 0 |

The other five `/built/*` pages carry no photographs. The terminal tile
inherits the box's corners on each page.

The door override needed two classes (`.home-door .home-door__photo`).
`cutPhoto.scss` loads after `home.scss`, and at one class the phone thumbnail
kept its 8px corners.

## 5. "More on each"

**This does not match the brief's premise, so here is what was measured
instead.** Nothing overlaps the top of `#main`. The header (68px band, 56px on
mobile, plus the 28px LOC/STATUS readout) is a flex item *above*
`.site-scroll`, not over it. Its `position: sticky` never engages because the
frame does not scroll. `#main`'s top edge is the bar's bottom edge at every
breakpoint: 103px at 1440 and 85px at 390.

The real cause of the overshoot was the target. The cue pointed at
`#software`, the first step *inside* "What changes", which had a hand-set
`scroll-margin-top: 110px`. Changes:

- The cue's `href` is now `#what-changes`, a new id on the section.
- `--scroll-clearance: 0px` is set in `shell.scss`, where the chrome is
  defined, with the reasoning in a comment. The section, the step rows and the
  two other anchored sections use `scroll-margin-top: var(--scroll-clearance)`,
  replacing the hardcoded 90px and 110px. If chrome is ever moved inside the
  scroller, set its height there.
- Smooth scrolling already followed the brief: `scroll-behavior: smooth` on the
  scroller, `auto` under `prefers-reduced-motion` (`shell.scss:67–70`). No
  JavaScript.

Measured after the jump:

| View | bar bottom | section top | eyebrow top |
|---|---|---|---|
| 1440×900 light/dark | 103 | 103 | 190 |
| 390×844 light/dark | 85 | 85 | 130 |

The section lands flush under the bar with nothing behind it. The eyebrow sits
below that by the section's own top padding (87px / 45px). It is fully visible,
but not literally touching the bar. If Simon wants the eyebrow itself against
the bar, the change is to trim that padding. A negative margin would cut off
the section's top lip.

**At 390 the cue itself is not rendered**: it is in the fold foot, hidden on
mobile (see §1). At 390 I checked the plain anchor (`/#what-changes`), which
behaves the same.

## 6. "What changes": fade

- Both beats: `opacity 0 → 1` and `translateY(12px) → 0`, **500ms `ease-out`
  on both properties**, once. Before, the rise was 16px/18px on a 0.7–0.75s
  springy cubic-bezier, with opacity on a different 0.5–0.55s `ease`. The
  block was opaque while still moving, which is the "pop".
- The photo and the answer used to animate as two siblings. They now animate as
  one `.home-step__reply` block.
- No clip-path and no scale on these elements, confirmed: computed `clip-path`
  is `none` and `scale` is `none` on every frame.
- Reduced motion: both blocks at opacity 1, transition `0s`.
- Measured from the moment each class lands (identical at both sizes and in
  both themes, within 0.1px):

  | ms | opacity | rise left |
  |---|---|---|
  | 0 | 0.00 | 12px |
  | 150 | 0.40 | 7.19px |
  | 300 | 0.75 | 2.96px |
  | 500 | 1.00 | 0.02px |

- Captures. **After**: `C:\tmp\review-1\{1440,390}-{light,dark}-6-fade-{0,150,300,500}ms.png`.
  **Before**: `C:\tmp\review-1\before\fade-say-*.png` and
  `before\fade-reply-*.png` (1440). The earlier run took these against a build
  of `515ce0f`. I did not re-take them.

## 7. Partner and client cards

- The band plate now has a pinned grid row (`grid-template-rows:
  minmax(0, 1fr)`), and logos are capped with `max-width`/`max-height: 100%`.
  Before, the auto row grew to QUT's 96px image, so `max-height` measured
  against itself. Every logo now sits inside the same 14px padding.
- Copy is word for word as in the brief. Neither entry has `pending`. The
  field's doc comment no longer names Craig, and neither does the marker's
  `title`.
- Measured, at both sizes in both themes: all three logos are inside the
  plate's padding box (QUT 65×66 in a 96px plate at 1440), and no card shows a
  marker.

## 8. Team

- `CREW` order: Craig, Simon, Ronan, Asuka, Tom. The `crew.ts` header comment
  is updated with the reason (Simon's call).
- `TerminalTile` (`src/components/photos/`): fills the 4:5 portrait box,
  which still draws the edge and radius over it. The face is
  `--surface-chrome-dark`, with `$ whoami` in `--text-subtle`, the name in
  `--text-secondary`, and a `--route-active` block cursor. These are the
  readout's tokens; no new hex. It is `$font-family-mono`, and the login is
  derived from `name` (first word, lowercased). It is `aria-hidden` and sized
  from its own width with container units, so one rule fits the home teaser and
  `/team`.
- Cursor: `animation: … 1s steps(1, end) 4`, so it blinks four times and ends
  solid. On `/` it waits for the team row's reveal before starting. Under
  reduced motion there is no animation (measured: `animation-name: none`).
- **Measured blink** (Web Animations timing plus per-frame opacity sampling):
  active duration **4,000 ms**, 8 opacity changes, then solid (opacity 1) for
  the rest of the 7 s window, in all eight runs (`/` and `/team` × 2 sizes × 2
  themes).
- The initials markup and styles are removed from `page.tsx`,
  `team/page.tsx`, `home.scss` (`--empty`, `__initials`, and the now-unused
  `--home-hatch-line`) and `crew.scss`. Nothing else used them.
- Home row and `/team` both end with Tom Lee, measured.

## Verify

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint:ci` (max-warnings 0) | clean |
| `pnpm test:ci` | 42 suites, 594 tests, all pass |
| `pnpm build` | passes; `/software`, `/robotics`, `/websites` generated in that order |
| axe-core 4.12.1 (wcag2a/aa, 21a/aa, 22aa): 20 sitemap routes + a 404, × light/dark × 1440/390 | **84 runs, 0 violations** |

The browser checks ran on `next start` with Playwright/Chromium. The
verification script is not in the repo.

## Screenshots — `C:\tmp\review-1\`

This session, for each of `1440-light`, `1440-dark`, `390-light` and
`390-dark`:

- `-1-fold.png`; `-1-strip.png` (1440 only, see §1)
- `-2-hero-slot.png`
- `-4-built.png`
- `-5-after-cue.png`
- `-6-fade-0ms.png`, `-150ms`, `-300ms`, `-500ms`
- `-7-partners.png`
- `-8-team-home.png`, `-8-team-page.png`, `-8-terminal-tile.png`

Also `results.json`, with every measurement above.

The earlier run (3 November) also left `before/*`, `fold-*`, `strip-*`,
`cue-landing-*`, `partners-*`, `home-team-*`, `team-tom-*` and `doors-*` in the
same folder. They are kept, and only `before/` is cited here.

## For Simon

- §5: the eyebrow sits one section-padding below the bar, not against it.
  Your call whether to trim the padding.
- The uncommitted `.claude/settings.json` rewrite and `_to_delete/` are still
  in your working tree, untouched.
- QUT's official logo file is still to come. `qut.png` is the original until
  then.

STATUS: done
