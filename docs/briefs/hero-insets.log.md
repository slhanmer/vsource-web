# hero-insets — log

5 November, run after `final-pass`. One commit.

## 1. The stage becomes cut windows

- **No masks, fades or bleed.** The `home-stage-fades` mixin, every
  `mask-image` and the viewport bleed are gone. Measured: 0 elements on the
  stage have a mask, at every size.
- **During the run:** one window (`__solo`), with `$radius-md` (8px) and the
  recessed edge from CLAUDE.md
  (`inset 0 3px 8px -3px var(--carve-dark), inset 0 -1px 0 var(--carve-lip)`).
  The edge is on its own span **above** the images (`__edge`, as `CutPhoto`
  does it). Photos crossfade as before.
- **Settled:** three windows with a `$spacing-md` (16px) gap between them.
  I read "the site's standard gap" as that token. Each window has the same
  radius and recessed edge, the edge on the link's `::after`, above the
  photo and scrim.
  - **Hover:** the edge plus a 2px `--route-active` rim.
  - **Focus:** a 3px teal rim with a dark line inside it, shown at once.
  - The scrim under each name stays. It is for contrast, inside the window,
    not an edge.
- **Height** is unchanged: 1.4× the copy block, centred on it. The copy
  block is shorter now that the headline is one line, so the stage is
  shorter too:

| viewport | copy block | stage | windows |
|---|---|---|---|
| 1366×768 | 353 | 494 | 576×154 ×3 |
| 1440×900 | 373 | 522 | 577×163 ×3 |
| 1720×1175 | 377 | 528 | 572×165 ×3 |
| 1920×1080 | 377 | 528 | 572×165 ×3 |
| 390×844 | (stacked) | | 340×191 ×3, 16:9 |

- ⚠ **Brief vs code: the right edge.** The stage now ends at the **content
  column's** right edge (`right: 0` of `.home-hero__inner`, max 1240px). The
  brief says that edge "aligns with the header's content edge", but the two
  are not the same edge in this codebase:
  - `.site-header__inner` is `max-width: 1320px` with 24px padding, and sits
    outside the scroller.
  - The page column is 1240px, inside `#main`, which has a 10px stable
    scrollbar gutter.
  - At 1440 the header's last control ends at x=1346 and the stage at 1335.
    At 1920 they are 1586 and 1575.
  - The copy's left edge already sits 21px inside the logo's for the same
    reason.

  I kept the stage on the page's own column, so it is symmetrical with the
  copy. Making the page column and the header column match is a site-wide
  layout change, left to Simon.
- **Focus values** (`site.heroPhotos.*.focus`):
  - **Websites: `0% 55%` → `50% 70%`**, as the brief suggests. The window now
    shows the room, lamps and table, with Snug's nav out of frame. Seeded.
  - Software `62% 40%` (the hand and screen) and Robotics `40% 20%` (the
    Huntsman's body) are unchanged and still hold at the new ~575px width.
- **Narrow screens:** three windows stacked full width within the gutter,
  16:9, with the same edge. There is no full bleed now: a window is cut into
  the plate.

## 2. The headline on one line

- `.rotator` is now a wrapping flex row aligned on the first baseline. The
  h1 (the cut slot) comes first, then the tail `built to fit.`, with a
  `column-gap` of 0.25em, a word space at headline size (12px at 46px).
  Where the column is too narrow for both, `flex-wrap` drops the tail to a
  second line, with a 0.12em row gap (the old `margin-top`). The type is
  never shrunk.
- The slot keeps its measured fixed width, so nothing shifts while the words
  type.
- The visually-hidden sentence and the h1 semantics are unchanged. Only the
  comments in `RotatingHeadline.tsx` changed.
- **Baselines**, measured with a zero-height probe at `vertical-align:
  baseline` inside the slot's text and inside the tail:

| viewport | slot baseline | tail baseline |
|---|---|---|
| 1366×768 | 282.83 | 282.83 |
| 1440×900 | 308.56 | 308.56 |
| 1720×1175 | 430.19 | 430.19 |
| 1920×1080 | 387.44 | 387.44 |
| 390×844 | 156.81 | 156.81 |

  `.cut-slot`'s `text-box-trim` and its fallback padding are untouched. The
  slot keeps its text baseline because it is still `clip-path`, not
  `overflow` (trap 4).
- **Breakpoint: it never wraps at a supported width.** I swept from 1920 to
  320 in 10px steps with the type at its real size (26px at the bottom of
  the clamp, 46px at the top). It was **one line at every width**, and also
  at 280px. On narrow screens the single column is wide enough for the slot
  plus `built to fit.` at 26px. The wrap is still there for a narrower
  column or a longer word.

## Verify

- `pnpm tsc --noEmit`: clean.
- `pnpm lint`: clean, with Simon's uncommitted `next.config.ts` comma fix.
- `pnpm test:ci`: 641 passed. `pnpm build`: ok.
1. **Frames every 250ms, 0 to 5s, at 1440×900** (`frames/`): one cut window.
   - Software from mount, Robotics at 1,258ms, Websites at 2,515ms.
   - Software retyped at 3,259ms, then three windows from 3,508ms.
   - No fades or bleed, and the edge is visible over every photo.
2. **Settled** at 1366×768, 1440×900, 1720×1175, 1920×1080 and 390×844, light
   and dark (`settled/`). The Websites window shows the room. The buttons
   end at y=587 at 1366×768.
3. The headline is one line at 1440 and wider, and at every other width, with
   the baselines above.
4. axe on `/`, light and dark: 0 violations.

Screenshots are in `C:\tmp\hero-insets\`.

STATUS: done
