# Brief — hero-insets

**Run after `final-pass`.** It replaces the stage's edge treatment from
`hero-stage` and `hero-stage-2` §1. Everything else those briefs built stays.
One commit.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only.
**Read `CLAUDE.md` first.**

Simon (5 November): the torn, faded edges are not right. The bands bleed into
each other and into the plate, and the stage looks muddy. The stage should use
the site's own language, **insets**: windows cut cleanly into the plate. And
the headline should sit on one line now that there is room.

Where the brief does not match the code, stop and log it.

---

## 1. The stage becomes cut windows

- **No gradient fades and no bleed.** Remove every mask and gradient edge on
  the stage and bands. The stage sits **inside the content column**, so its
  right edge aligns with the header's content edge, not the viewport.
- **During the run:** one window, holding the current word's photo, with the
  **recessed** treatment from `CLAUDE.md` → Design language
  (`inset 0 3px 8px -3px var(--carve-dark), inset 0 -1px 0 var(--carve-lip)`,
  on its own edge layer **above** the image, as `CutPhoto` does, so the photo
  does not cover it) and `$radius-md`. Crossfades as now.
- **Settled:** the one window becomes **three windows** stacked with the
  site's standard gap between them, each with the same recessed edge and
  radius. Each is a link with its stream name, as now. Hover and focus light
  the rim in `--route-active` teal. Focus always visible.
- Stage height stays as `hero-stage-2` set it (about 1.4× the copy block,
  centred on it). The three windows divide it evenly.
- **Websites window:** the crop currently shows mostly Snug's nav bar. Set its
  `focus` so the window shows the room (around `50% 70%`) and the nav is
  mostly out of frame, and check the other two windows' focus still holds at
  the new width. Log the values.
- Narrow screens: three windows stacked full width, about 16:9, with the same
  edge.

## 2. The headline on one line

On wide screens the headline is one line: the cut word slot, then
`built to fit.` on the **same baseline**, with a normal word space between
them. The slot keeps its fixed width (the widest word) so nothing shifts as
the words change.

- Below the width where it fits at its current size, it wraps to two lines as
  now. Measure the breakpoint and log it. Never shrink the type to force one
  line.
- The visually-hidden sentence and the h1 semantics are unchanged.
- Check the slot and the tail share a baseline (`text-box-trim` /
  `text-box-edge` as `CLAUDE.md` trap 5 describes, with the existing fallback).

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. Frame captures every 250ms from load to 5s at 1440×900: one cut window
   cycling through the photos, then three cut windows. No fades or bleed
   anywhere, and the edge is visible over every photo.
2. The settled fold at 1366×768, 1440×900, 1720×1175 and 1920×1080, plus
   390×844, light and dark. The Websites window shows the room.
3. The headline is on one line at 1440 and wider, with a shared baseline
   (log the measured baselines), and wraps cleanly below the breakpoint.
4. axe on `/`, light and dark: 0 violations.

Screenshots go to `C:\tmp\hero-insets\`.

## The log

Append to `docs/briefs/hero-insets.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
