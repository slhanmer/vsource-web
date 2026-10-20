# Log — seo-landing-pages brief

## Run 1 — 2026-10-21 — development

Started on `development` at `3d645d7`, as the brief says. The working tree
had only the usual out-of-scope items: modified `.claude/settings.json`,
untracked `.claude/__probe`, `.claude/settings.json.aptium-backup` and
`_to_delete/`. None of them were touched or staged. The brief itself was
untracked, and it went into the plumbing commit.

**Two items were logged and not done** (details under "Logged, not done"):
- the links in from `/software` and `/websites` (1.7.1, 1.7.2, all of 2.3)
- the `/built/aptium-portal` change (1.7.3)

Everything else in the brief is done.

**Stage 1 — plumbing** — commit `190094acc2c327348dc05e6ff64a505848deff9d`, pushed

- `src/constants/landings.ts`: the `Landing` interface exactly as given.
  `sections` reuses `StreamSection` from `streams.ts` as a type import, with no
  second interface. `LANDINGS` is empty in this commit. Both `LANDINGS` and
  `type Landing` are exported from `@constants`.
- `src/components/landing/Landing.tsx`: one template. It has a default export
  `Landing({ slug })` and a `landingMetadata(slug)` helper, and calls
  `notFound()` for an unknown slug. It imports `pages.scss` and `stream.scss`
  through `@/app/styles/…` and uses only `.page__*`, `.stream__*`,
  `.basic-button` and `.home-pending`, the same classes as
  `app/[stream]/page.tsx`. There is no new SCSS file.
- `src/app/regulated/page.tsx` and `src/app/accessibility/page.tsx`: each is a
  thin route file (`metadata = landingMetadata(slug)` plus one component).
- Metadata: `title` comes from `metaTitle` and `description` from
  `metaDescription`. `alternates.canonical` is `/regulated` or
  `/accessibility`. `openGraph` has `url`, `title` and `description`. No new
  OG image.
- JSON-LD: a `Service` block with the `#organisation` provider and
  `areaServed: 'AU'`, and a `BreadcrumbList` block (Home → stream → page).
  Both are injected the same way as in `[stream]/page.tsx`.
- Sitemap: `...LANDINGS.map(...)` sits after the streams, with priority 0.9 and
  monthly frequency, the same as the stream pages. No hand-added URLs.
- Checks before the commit: `pnpm tsc --noEmit` gave the two known errors
  only. `pnpm lint` exit 0. `pnpm build` exit 0, 29 pages. The pre-commit
  hook (lint-staged `eslint --fix`) passed.

**Stage 2 — copy** — the commit that carries this log, pushed

- Both entries in `LANDINGS` are verbatim from 2.1 and 2.2. I wrote typographic
  `’` and `—` as literal characters, which matches `streams.ts`. I joined each
  hard-wrapped brief paragraph with single spaces.
- `/accessibility` has `pending: true`. `/regulated` does not.
- I checked the copy by script, not by eye. Every blockquote paragraph,
  `includes` item, section title, and meta/title/lede field in 2.1–2.2 was
  extracted from the brief and string-matched against `landings.ts`. Result:
  14 paragraphs, 24 items, 6 titles and 8 fields, with 0 missing.
- A comment above `LANDINGS` records the 21 October regulatory facts and the
  reason for `pending`, so nobody "updates" them from memory later.
- Content rules check: the literal "Class A" does not appear (the copy says
  "class — A, B or C"). No client classification is stated. Aptium is not
  named. Nobody is called an engineer. There is no phone number in the body.

**Verify**

- `pnpm tsc --noEmit`: exit 2, the two known ui-kit test errors only,
  verbatim as in `built-websites.log.md` Run 2
  (`ButtonLoader.test.tsx(32,50)`, `DropDown.test.tsx(180,77)`). Nothing new.
- `pnpm lint`: exit 0.
- `pnpm build`: exit 0, 29 static pages. The route table shows `○ /regulated`
  and `○ /accessibility` as static routes. Next to them, `● /[stream]` still
  generates `/software`, `/websites` and `/engineering`, so there is **no
  collision, checked in the build output.**
- `pnpm test:ci`: 41 suites, 593 tests, all pass.
- Dev server: **port 3100** (`pnpm exec cross-env APP_ENV=dev next dev
  --webpack -p 3100`). Port 3000 was actually free this time, but I used 3100
  anyway so I could not collide with another project. All checks were done
  with `curl` against the first response:
  1. `/regulated` 200, `/accessibility` 200, each with exactly one `<h1`.
  2. `/software`, `/websites` and `/engineering` are all 200, with their own
     h1s. They are not shadowed.
  3. `/accessibility` contains
     `<span class="home-pending" title="Unverified copy — not signed off"> [pending]`.
     `/regulated` has 0 matches for `[pending]`.
  4. Links from `/software` and `/websites`: **not present.** This is
     deliberate, see "Logged, not done". Both stream pages have 0
     `href="/regulated"` / `href="/accessibility"`.
  5. `/sitemap.xml` contains `<loc>https://www.vsource.dev/regulated</loc>`
     and `<loc>https://www.vsource.dev/accessibility</loc>`.
  6. In view-source on each page, the `Service` block is present with
     `"areaServed":"AU"` and the right `@id`
     (`https://www.vsource.dev/regulated#service`, `…/accessibility#service`),
     and so is `BreadcrumbList` (Home → Software → regulated; Home → Websites
     → accessibility). The canonical, `<title>`, `og:title`, `og:description`
     and `og:url` are all correct.
  7. Copy in the first response:
     `curl -s :3100/regulated | grep -c "evidence problem"` → `1`.
     `curl -s :3100/accessibility | grep -c "An audit that comes with the fix"`
     → `1`. The template is a server component with no `'use client'`.
- Errors during the run: none. Nothing failed, so nothing needed fixing.

**Logged, not done**

1. **1.7.1 / 1.7.2 / 2.3: the links in from `/software` and `/websites`.**
   `StreamSection.body` is `string[]`, and `app/[stream]/page.tsx` renders
   each entry as plain text inside `<p className="stream__para">{para}</p>`.
   It cannot render an inline `<Link>`. The brief says to stop and log rather
   than change the renderer, so I left both `body` arrays in `streams.ts`
   **untouched**. I did not trim them either. Trimmed copy with the link
   written as literal `[…](/regulated)` would be worse than the current copy.
   Until this is done, each stream section and its landing page still compete
   for the same result, which is the problem 1.7 was meant to fix. To unblock
   it, pick one:
   - (a) allow `body` entries to carry a link. For example, add
     `link?: { href: string; label: string }` to `StreamSection` and have the
     template render the label as a `<Link>` at the end of the last
     paragraph. The brief's two link texts both sit at the very end of a
     paragraph, so this would be enough.
   - (b) allow a small inline-markup renderer for `[text](/path)`.
2. **1.7.3: `/built/aptium-portal`.** The brief says to log this if it needs
   more than adding a fact row. It does:
   - The `IEC 62304` fact **already exists**: `facts` has
     `{ label: 'Standard', value: 'IEC 62304' }` (`src/constants/built.ts:153`).
     Adding it again would be a duplicate row.
   - The "stream line" is rendered by the shared template
     (`src/app/built/[slug]/page.tsx`, `built-project__stream`). It always
     links to `stream.href` with the text "See how software works". Pointing
     it at `/regulated` for one project means a template change or a new
     field on `Project`. That entry is `placeholder: true` and the copy is
     Craig's.
   
   So I made no change to `built.ts` or the project page.

**Decisions I made where the brief was silent** — each is small and easy to reverse:

- **`serviceType` left out of the `Service` JSON-LD.** 1.5 lists it but gives
  no value, and nothing in `Landing` maps to it. Writing one would mean
  inventing copy. Give me the two values and they can go in as a field on
  `Landing` or as a constant.
- **`Service.name` and the third breadcrumb `name` are `metaTitle`.**
  `description` is `metaDescription`. The h1 is a sentence-long claim, and
  `metaTitle` is the nearest thing to a name. Swap them if you prefer the h1.
- **The breadcrumb's first item is labelled `Home`.** It appears in JSON-LD
  only, not on the page.
- **Inline emphasis dropped.** The brief puts `` `IEC 62304:2006+A1:2015` ``
  in code style and **WCAG 2.2 Level AA** in bold. The body is plain strings
  (see 1 above), so the markup cannot render. The words are verbatim and the
  marks are not, because literal backticks or asterisks would show on the
  page.
- **Back-link:** the eyebrow (`page__eyebrow`) is a `<Link>` to the parent
  stream, labelled with `stream.name`. `stream.scss` has no back-link class.
  The `/built` project page uses `.built-project__back` from `built.scss`,
  which this template does not import, so the link takes the eyebrow's
  styling and the global link style. That looks fine, but there is no
  hover-underline rule of its own. Per 1.3 I logged this and did not add a
  class.
- **CTA:** it is the same "Start a conversation" → `/contact` button as the
  stream pages, which is existing copy. The brief says `stream` feeds "the
  CTA" but gives no stream-specific CTA wording, so the stream is not used
  there.
- **Stream mark:** the head uses the parent stream's `StreamMark`, the same as
  the stream page, so the two heads are identical.
- **No `STREAM_COMMON`, pricing or proof blocks.** The brief does not ask for
  them, and the common list would repeat across five pages instead of three.

**Pre-existing, outside this brief**

- `.home-pending` is styled only in `home.scss`, which only the home page
  imports. On a direct load of `/accessibility` (and of `/software` and
  `/built/*`, which already use the class), the `[pending]` text renders but
  without its dashed underline, unless home.scss is already loaded from an
  earlier client-side navigation. The marker is still visible as text.
  `crew.scss:159` copies the rule locally for this reason. The fix is to move
  `.home-pending` to `global.scss`.
- The build warns about `NODE_TLS_REJECT_UNAUTHORIZED=0` from `.env.local`,
  the same as every earlier run. Not touched.

**Anything wrong with the brief**

- 1.7.3 assumes the `IEC 62304` fact is missing. It is already there.
- 1.5 says "two blocks, following the pattern already in
  `[stream]/page.tsx`", but that page has only one block (`Service`, without
  `serviceType`). I followed the injection pattern and added the second block.
- 1.5 names `serviceType` without a value.
- 2.3 depends on links in section bodies, which the renderer does not support.
  The brief anticipated this, but it means the "links in" part, which it says
  "matter more than the pages", cannot be done in this run.

STATUS: partial
