# hide-websites: take the Websites stream off the site, reversibly

Log to `docs/briefs/hide-websites.log.md`. Simon is showing Craig a two-stream site. If Craig is happy, Websites is deleted later. If not, it comes back. **Bringing it back must be one checkbox, not a code change.** No commented-out code.

## Mechanism

- Add a `hidden` checkbox to Streams, default false, with the admin description "Hidden streams have no page, and appear nowhere on the site." Add a migration and use the same name everywhere.
- The data layer exposes only visible streams. Everything below reads that one list, so nothing needs a special case:
  - the header nav
  - the hero headline words and stage windows
  - the What changes rows
  - "More on each"
  - `generateStaticParams` for `[stream]`
  - the sitemap
  - the footer
- **The hero headline has to follow the data.** `WORDS` and `headlineTimeline.ts` must be derived from the visible streams, not hardcoded at three. With two words, the timeline test still holds at ≤4,500ms and Software is still the word it lands on. The stage settles into two bands at 3:1, so the stage height is two bands plus one gap.
- `/websites` returns 404 while the stream is hidden (`dynamicParams = false` already does this once it is out of the params). Add a 302 from `/websites` to `/` in `next.config.ts`, marked temporary, because the old live site and any links point there. The `next.config.ts` change is in scope for this brief only.
- Seed: Websites gets `hidden: true`. Leave its content and media in place.

## Kept

- `/built` venue projects stay: they are real client work. Remove only the stream link or tag on them if it points at `/websites`. Make the link conditional on the stream being visible.
- `/accessibility` stays. Point any "Websites" link on it to `/contact` while hidden.

## Verify

- `pnpm tsc --noEmit`, `pnpm lint`, `pnpm test:ci` (add a test that a hidden stream is absent from nav, hero words and sitemap), `pnpm build`. Migrate preview, then `pnpm seed`.
- Toggle `hidden` off locally and confirm all three streams return untouched, including the three-word hero. Then toggle it back on.
- Screenshots at 1440×900 and 390×844 of the home fold during the run and settled, the nav, What changes and the footer, saved to `C:\tmp\hide-websites\`.
- axe on `/`: 0 violations. Grep the build output for `/websites` links: there should be none.

End with `STATUS: done` or `STATUS: blocked — <why>`.
