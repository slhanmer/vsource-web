# hero-cards: three stream cards, photos whole, no slideshow

URGENT: preview for Craig today. Log to `docs/briefs/hero-cards.log.md`. Home fold stage only.

## What it becomes

The stage is **three stacked stream cards from the first paint**: no run window, no crossfade, and no settle into bands. Each card is one link to its stream page.

```
┌──────────────────────────────────────────────┐   raised card (plate surface, light on top edge)
│ ┌──────────┐  ┌────────────────────────────┐ │
│ │  photo   │  │ Software                   │ │   right part: SUNKEN well (recessed carve)
│ │  1:1,    │  │ See more →                 │ │   name in $font-family-display, ~clamp(22px,2vw,32px)
│ │  whole   │  │                            │ │   "See more →" mono, teal (--route-active)
│ └──────────┘  └────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

- **Photo:** the stream's `heroPhotos.photo` (the 1:1 stage file), in a 1:1 box at the card's left. It is shown **whole**: the box is the file's shape, so there is no cover crop and no object-position. It sits in its own small recessed window with `$radius-sm`.
- **Text well:** to the right, sunken (`inset 0 3px 8px -3px var(--carve-dark), inset 0 -1px 0 var(--carve-lip)`), holding the stream name and, under it, "See more →". Pad it so the name sits at the top-left of the well.
- **Card:** raised, with the photo box height setting the card height. The gap between cards is `clamp(14px, 1.4vw, 22px)`. The three cards fit the stage column width, and the photo is about 30% of the card width. If they don't fit the fold at 1366×768, shrink the photo, never the name.
- **Hover/focus:** the card's rim lights teal (the existing band rule) and the arrow nudges 3px right. Honour reduced motion for the nudge.
- **Headline tie-in:** as each word finishes typing (from `headlineTimeline.ts`), its card gets an `is-current` teal rim, and that ends on Software. That is the only motion. No timers of its own.
- **Narrow screens:** the same cards stacked full width, with the photo at about 28%.

## Remove

- The run window (`home-stage__solo`), the band markup and styles, and the `is-running` logic in HeroStage/home.scss.
- `heroPhotos.band` and its six `-band` files: drop them from the collection (migration), the types, the data layer and the seed, and `git rm` the band files from `src/seed/assets/hero/`.
- The stage files stay.

## Verify

- `pnpm tsc --noEmit`, `pnpm lint`, `pnpm test:ci` (keep the timeline test), `pnpm build`. Migrate preview, then `pnpm seed`.
- Screenshots at 1366×768, 1440×900, 1920×1080 and 390×844, light and dark, at 0s, 2s and 5s, saved to `C:\tmp\hero-cards\`. Every photo must be visibly uncropped.
- axe on `/`: 0 violations. Each card is one link named "Software" etc. ("See more" is `aria-hidden` or part of the name, not a second link).
- Note in the log that `media:blob` needs re-running.

End with `STATUS: done` or `STATUS: blocked — <why>`.
