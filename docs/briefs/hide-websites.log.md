# hide-websites — log

5 November. Websites is off the site; **bringing it back is unticking one box
in `/admin`** (Streams → Websites → Hidden). There is no commented-out code.

## Mechanism

- **`hidden` checkbox on Streams**, default false, in the sidebar, with the
  brief's description: "Hidden streams have no page, and appear nowhere on
  the site."
  - Update access is **admin only** (`isAdminField`). Which streams exist is
    composition, and CLAUDE.md gives composition to admins.
  - Migration `20261105_081531_stream_hidden` adds `streams.hidden boolean
    DEFAULT false`. Applied to the preview branch.
- **One list.** `getStreams()` returns visible streams only, through a pure
  filter in `src/data/visible.ts` (`visibleOnly`). Everything reads that list,
  so no surface has a special case:
  - **Header nav:** `SITE_NAV` is now `siteNav(streams)`. `SiteDocument`
    (now async) fetches the streams and passes the nav to `SiteHeader`.
  - **The hero.** `WORDS` and `SEQUENCE` are gone. The page passes
    `HeroRunProvider` the visible names, and the headline, the run and the
    stage all read them from it. `headlineTimeline.ts` takes the words:
    `sequenceOf(words)`, `typedMs(words)`, `timelineMs(words)`, plus
    `sentenceOf(words)`, which builds the h1's visually-hidden sentence.
  - **The stage:** one 3:1 band per visible stream (`--home-stage-count`
    from `HeroStage`), and the width cap is generalised to n bands and n − 1
    gaps.
  - **Everything else:** What changes, `generateStaticParams` and the
    stream page, and the sitemap already read `getStreams()`. The footer
    has no stream links. "More on each" is an anchor to `#what-changes`.
  - **Home title and description:** these named "software, robotics and
    websites", so they are now `generateMetadata` from the visible streams:
    "Software and robotics — Brisbane".
- **Timeline with two words:** 2,160ms typed and **2,760ms** still, with
  Software the word it lands on. With three it is 3,840 as before. The budget
  is 4,500.
- **Seed:** Websites has `hidden: true`. Its content and media are untouched.
  The seed run reported `1 updated` (streams websites), and a second run
  `0 created, 0 updated, 0 removed, 51 unchanged`.

## Two places I did not follow the brief to the letter

1. ⚠ **The redirect is not in `next.config.ts`.** A fixed redirect there would
   keep sending `/websites` to `/` **after the box is unticked**, until
   someone edited code. That breaks "bringing it back must be one checkbox,
   not a code change".
   - So the redirect is read from the data. In `[stream]/page.tsx` a slug
     that isn't visible but is a hidden stream (`getHiddenStreamSlugs()`)
     calls `redirect('/')`.
   - That is a temporary **307** (Next's `redirect()` status), not a 302.
     Both are temporary; 307 also keeps the method.
   - Measured: hidden, `/websites` gives **307 → `/`**; unticked, `/websites`
     gives **200**. An unknown slug still 404s.
   - `next.config.ts` is untouched by me. (Simon's own uncommitted comma fix
     is still in the working tree.)
2. ⚠ **`dynamicParams` stays `true`.** The brief says
   `dynamicParams = false` "already" gives the 404. In this code it is
   `true`, and CLAUDE.md says it must stay `true` (with `false`, a save in
   `/admin` 404s every stream page until the next deploy). A hidden stream is
   out of the params, and the page's own `getStream()` then redirects it (or
   404s an unknown slug). Same result, without the regression.

## Kept

- **`/built` venue projects stay.**
  - Their `/built` cards show the stream as a text tag ("websites"), not a
    link, so nothing points at `/websites`.
  - On `/built/brisbane-venues`, the "This is websites work. See how
    websites works" link was already conditional on `getStream()`, so with
    the stream hidden it simply isn't rendered.
- **`/accessibility` stays.** It belongs to the Websites stream, and
  `Landing.tsx` used to `notFound()` when its stream was missing, so hiding
  Websites would have **404'd `/accessibility`**. Now:
  - the eyebrow "Websites" links to **`/contact`** while the stream is
    hidden;
  - the breadcrumb JSON-LD drops the stream level (Home → page);
  - the stream mark is drawn from the landing's own `stream` id.

  Unticked, the eyebrow goes back to `/websites` (checked).

## Verify

- `pnpm tsc --noEmit`: clean. `pnpm lint`: clean (with Simon's uncommitted
  `next.config.ts` comma fix). `pnpm build`: ok, prerendering `/software` and
  `/robotics` only.
- `pnpm test:ci`: **652 passed**.
  - New: `src/data/tests/hidden-stream.test.ts`. It checks that a hidden
    stream is absent from the nav (`siteNav`), from the hero words (with the
    sequence still landing on Software, and the hidden sentence "Software
    and robotics, built to fit.") and from the **sitemap**, which runs the
    real `sitemap()` with the data module mocked from the visible list. It
    also checks that unticking brings all three back.
  - `headlineTimeline.test.ts` now covers three words, two words, and a
    fourth word failing the budget.
- **Migrated the preview branch, then seeded** (above).
- **Toggle test.** I set `hidden: false` on Websites through Payload, rebuilt,
  and confirmed:

  | | 1440 | 390 |
  |---|---|---|
  | nav | /software /robotics /websites /built /contact | the same |
  | hero words | Software, Robotics, Websites | the same |
  | stage | 568×614, 3 bands | 340×372 |

  Also: three What changes rows, `/websites` 200, and the `/accessibility`
  eyebrow back on `/websites`. That matches hero-insets-2's numbers exactly,
  so the three streams come back untouched. Then I set it back to `true`,
  rebuilt, and the seed confirmed `51 unchanged`. The throwaway toggle script
  is deleted.
- **Hidden** (screenshots in `C:\tmp\hide-websites\`; the unticked set is in
  `unhidden\`):

  | | 1440 | 390 |
  |---|---|---|
  | nav | /software /robotics /built /contact | the same |
  | hero words | Software, Robotics | the same |
  | bands | **2 × 577×192**, stage 577×408: two bands plus one 23px gap | 2 × 340×113, stage 340×243 |
  | What changes | software, robotics | the same |
  | footer | unchanged | unchanged |

  The shots cover the fold during the run and settled, the nav, What changes
  and the footer.
- **No `/websites` links:** 0 in the HTML of `/`, `/software`, `/robotics`,
  `/built`, `/built/brisbane-venues`, `/accessibility`, `/regulated`, `/team`,
  `/contact` and `/sitemap.xml`, and 0 `"/websites"` in the build's HTML
  output.
- axe on `/` and `/accessibility`, light and dark: 0 violations.
- The dev server on 3200 is restarted, so localhost shows the two-stream
  site.

## Note on the working tree

Simon's uncommitted changes are left uncommitted:
- the six recropped hero files;
- `websites/nug-step.jpg`, and the `content.ts` lines that make it the
  Websites step photo;
- the `next.config.ts` comma.

They were already in the database (the seed found them unchanged). My
commit stages only my own line in `content.ts` (`hidden: true`).

STATUS: done
