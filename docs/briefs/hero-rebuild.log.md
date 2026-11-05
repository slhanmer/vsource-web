# Log — hero-rebuild

5 November. Run on `development` after cms and built-trim, both done. Simon
asked for built-trim "if it hasn't run": it had (`b8672eb`), so it was not
re-run. hero-polish §1 and §2 had already run before this brief arrived; the
fold rebuild here replaces both, as the brief says. hero-polish §3–§5 were
already done and stand (see that log).

## §1 Photos into media (`0cfefae`)

All six files are in `src/seed/assets/` and loaded through the seed, upserted
by filename, with the alt text the brief gives:

| file | where |
|---|---|
| `photos/at-the-desk.jpg` | `site.heroPhoto`, a **new** field on the `site` global (the fold had nowhere to keep it) |
| `crew/simon-hanmer.jpg`, `crew/ronan-donahoe.jpg`, `crew/craig-schneider.jpg` | each person's `portrait` |
| `photos/team-group.jpg` | `site.groupPhoto` (`/team`) **and** `site.workingPhoto` (home "Why we work this way"), one media document |
| `photos/pointing.jpg` | Software `stepPhoto` |

- **No stock stand-ins existed to remove.** They were never seeded (cms
  Stage D), and `media` had no stock portrait rows. `stockPortrait` was
  already gone with `crew.ts`. Tom keeps his terminal tile and Asuka his
  photo.
- **Software `doorPhoto` is cleared.** The field stays, but it is no longer
  required (`doorPhoto` was `required`, so that had to change, in migration
  `20261105_003136_hero_rebuild`, together with `site.heroPhoto`).
- **Portrait alts:** the media documents carry the person's name. The
  template renders portraits with **`alt=""`**: on `/team` the portrait box is
  `aria-hidden` and sits beside an h2 of the name, and on the home teaser it
  sits above the name in a figcaption. So the empty alt is correct, and was
  already in place.
- **Stock files deleted from media and the seed** (`retired.media` in
  `content.ts`, a new, explicit list the seed deletes last):
  `software-door.jpg`, `software-step.jpg`, `working.jpg` (all Unsplash
  stock), plus `placeholder-site.jpg` (the generated still built-trim left
  orphaned). Their asset files are removed from `src/seed/assets/`. **No
  stock photograph is left on the site.**
- Seed: first run 6 created, 5 updated, 4 removed. **Second run: 0 created,
  0 updated, 0 removed, 41 unchanged.**

## §2 The fold, rebuilt

- **Right: the photograph.** It is a `figure` in the plate, positioned from
  the message column's edge (`50% + gap/2`) to the right edge, top to bottom
  of the plate: the full height of the fold at every wide size (top and
  bottom within 1px of the plate). No radius. The edge where it meets the
  plate is a 72px **mask** fade, so it fades into whatever the plate is (slab
  and mill lines) rather than a colour that has to be matched. No shadow.
- **`object-position: 40% 35%`.** The photo is portrait (2:3), so every wide
  slot crops top and bottom. 35% keeps Craig's head, Simon's face and Craig's
  raised hands in frame; 40% keeps both faces where a narrow slot crops the
  sides. Checked at all five sizes: both faces are in frame at every size.
- It stops 10px short of the window edge. That 10px is the scroller's
  reserved scrollbar gutter (`scrollbar-gutter: stable`, CLAUDE.md rule 1),
  which is where the scrollbar draws. It runs to the edge of the page area.
- **LCP:** `priority` (Next preloads it; there is a `<link rel=preload
  as=image>`), and `sizes="(max-width: 979px) 100vw, 50vw"`.
- **Left: the message**, in the plate's existing 45/55 rows, so slightly above
  centre. Headline, lede and sub copy are unchanged in content and
  behaviour. Then **Start a conversation** (primary) and **See what we've
  built** → `/built` (`basic-button secondary-button`, an outline), side by
  side, 28px under the copy.
- **Headline size:** `clamp(32px, 5vw, 68px)` → **`clamp(26px, 3.35vw,
  46px)`**, two thirds (68 → 46px at 1440 and up). At 1366×768 it is 46px.
  The old short-screen tier had squeezed it to 40px there to fit the doors,
  and that tier is gone (see below). On phones it stays 26px, as before.
- **Doors deleted:** `HeroDoors.tsx`, `HeroRun.tsx`, all `.home-door*` CSS,
  the door highlight, and the `wordTyped` wiring in `RotatingHeadline`.
  `headlineTimeline.ts` and its test are kept, with the comment about the
  doors removed.
- **The foot** stays on the plate's bottom edge, but on wide screens it is
  the **message column's width**, ending at the photo, not running across
  it. That's the only way to keep both "on the bottom edge" and "photo full
  height".
- **Narrow screens (≤979px):** photo first, full bleed, 4:5 (capped at 88svh
  on an upright tablet), then the message, then the buttons. The fold is
  taller than a screen on a phone (buttons at 932px on 390×844), as the brief
  allows.
- **No copy is shrunk to fit.** The old responsive tiers shrank the lede and
  sub, and on screens under 680px tall **hid the sub copy**, all to squeeze
  three doors into one screen. They are replaced by the narrow-screen rules
  above and one spacing-only rule for short laptops.

## §3 Knock-on

- **Readers of `door` and `doorPhoto`: none on the site.** The only code that
  touches them is the data layer, which maps them into the `Stream` shape
  (`src/data/index.ts`). No component, page or the sitemap reads them. Both
  fields are kept and labelled "Not shown anywhere at present" in the admin.
  **Simon to decide whether to drop them.** Robotics and Websites still have
  door photos set (Huntsman top, Snug door).
- The door highlight CSS is gone with the doors.
- `CLAUDE.md`: the content table (`streams` no longer drives doors; `site`
  has `heroPhoto`), and "Current state" now describes the new fold, the mill
  lines, the real portraits, and that no stock photograph is left. The page
  comment that said "the fold has to offer a conversation" is rewritten for
  the two buttons.

## Verify (production build, `next start -p 3130`)

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint` | only the known trailing comma in `next.config.ts:61` |
| `pnpm test:ci` | 47 suites, 635 tests pass (`headlineTimeline` test kept) |
| `pnpm build` | passes |
| 1. Fold, five sizes × light/dark | `C:\tmp\hero-rebuild\fold-<w>x<h>-<theme>.png`. Both faces in frame at every size. Buttons in the first screen at every wide size: bottom at 600 of 768, 639 of 900, 708 of 1050, 722 of 1080. At 390×844 they are below the photo and copy (932), as the brief allows |
| 2. LCP | **the hero photo** on every load (`.home-hero__photo-img`), preloaded. `next start`, local: **1440×900: 240ms cold, 108ms warm; 390×844: 128ms cold, 68–76ms warm** |
| 3. `/team` | group photo (`team-group.jpg`) under the heading; Craig, Simon and Ronan show their real portraits; Asuka's photo and Tom's terminal tile are unchanged (`C:\tmp\hero-rebuild\pages\`) |
| 4. Home | "Why we work this way" is `team-group.jpg`; the Software row is `pointing.jpg`; no door elements in the DOM |
| 5. `pnpm seed` twice | second run: 0 created, 0 updated, 0 removed |
| 6. axe on `/` and `/team`, light and dark | **4 runs, 0 violations** |

Figures: `C:\tmp\hero-rebuild\fold.json` and `verify.json`.

STATUS: done
