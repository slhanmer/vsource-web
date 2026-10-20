# Brief — `/built`: five venue sites out of Coming, into real cards

**Repo:** `V-Source` (this one)
**Branch:** `development`, cut off `main`. It does not exist yet — create it.
**Push:** to `development` only, at the end of each stage. Do not merge, and do
not push anywhere else; `main`, `staging` and `production` are denied.
**Read `CLAUDE.md` first.** Everything in it applies; nothing below overrides it.

---

## Stage 1 — the gate (do this before touching anything)

The working tree holds roughly two weeks of uncommitted work that has **never
been built or type-checked**. Do not add to it blind.

```bash
pnpm install
pnpm tsc --noEmit
pnpm build
```

- **If the build fails:** stop. Log every error with file and line, fix only
  what is unambiguously a mistake (a bad import, a missing type), and log
  anything that looks like a design decision rather than fixing it. Do not start
  Stage 2 on a red build.
- **If it passes:** commit the existing work as-is, in one commit, before making
  any change of your own. That gives a clean point to diff Stage 2 against.
  Suggested message: `three streams, /built and /team — Sept work, first build`.
  Then `git push -u origin development`.

**Before you `git add -A`, two things must not be swept in:**

- `_to_delete/architecture-APT-DOC-009/` is untracked and holds the Aptium
  portal's architecture diagrams, including the scan flow. That is a client's
  medical-product material and it does not belong in this repo's history. Leave
  it out of the commit. Do not delete it either — just do not stage it.
- `.env.local` must stay untracked. Check `.gitignore` covers it before staging.

`docs/briefs/` — this brief and its log — should be committed.

Likeliest failure point is the root-level dynamic segment `src/app/[stream]/`
sitting alongside the static `/built`, `/team`, `/contact`. If it is the
problem, the fallback is three one-line page files re-exporting a shared
component instead of the dynamic route — but log it and ask before switching.

Also in this stage, delete the dead routes (they are unreachable behind the
301s already in `next.config.ts`):

```bash
git rm -r src/app/work src/app/services src/app/crew
git rm src/app/styles/work.scss src/app/styles/services.scss
```

Keep `src/constants/work.ts` — `CASE_STUDY` is raw material for the Aptium
write-up.

---

## Stage 2 — the content change

**Rewritten 20 October, Run 4.** Runs 1, 2 and 3 all reported that the previous
version of this stage did not match the code. They were right on every point,
and this is the correction. If something below still does not match, that is
another brief bug — log it and stop, do not invent your way round it.

What changed, and why:

- **`pending: true` is gone.** `Project` has no such field and never did.
  `placeholder: true` already exists and already renders a marker, and it means
  exactly the right thing here: *these words were invented and nobody has
  confirmed them*. All five entries use it. No type change, no template change.
- **`url` is a real addition**, and it does need a type change and one template
  edit, which this stage now authorises explicitly. A card for a site that is
  live and has nothing to click is not worth shipping.
- **All eleven required fields are supplied below.** The previous version gave
  four and left the agent to invent `client`, `year`, `lede`, `body`, `facts`
  and `media`, which the content rules forbid.
- **Card count is 13**, not 11. 8 existing + 5 new. The old number was wrong.
- The cutover note said "four" and listed five. It says five now.

### 2.1 — Capture the screenshots first

`media` is required and there is no imagery for these five. Capture it:

```bash
pnpm add -D playwright          # if not already present
npx playwright install chromium # if not already present
```

Then a short script, run from the repo root, that for each pair below opens the
URL at **1440×900**, waits for network idle, and writes a **JPEG, quality 82**
to `public/built/<slug>.jpg`:

| slug | URL |
|---|---|
| `nug` | `https://nug-preview.vercel.app` |
| `snug` | `https://snug-preview.vercel.app` |
| `janes-deli` | `https://janes-preview.vercel.app` |
| `bar-coopers` | `https://coops-preview.vercel.app` |
| `don-gino` | `https://don-gino.vercel.app` |

Viewport screenshot, not full page — these are cards, not archives. Delete the
script afterwards; it is not part of the site.

**If any URL will not load, stop and log which.** Do not substitute a stream
mark to get the stage finished — a card claiming a live site, showing a generic
mark, is worse than no card.

### 2.2 — Add `url` to `Project`

In `src/constants/built.ts`, on the `Project` interface:

```ts
  /** The live site, where there is one to visit. Rendered as a link on the
   *  project page. Absent for work that cannot be shown. */
  url?: string
```

Then in `src/app/built/[slug]/page.tsx`, render it inside the existing
`built-project__stream` paragraph area — a plain anchor, label **"Visit the
site →"**, `target="_blank"` with `rel="noopener noreferrer"`. Use
`var(--route-active)` via the existing `.built-project__stream a` rule, which
already styles a link in that block, so no new SCSS is needed. Do not add it to
the index cards: the whole card is already a link to the project page, and a
link inside a link is invalid HTML.

### 2.3 — Move the five out of `COMING_SOON` into `BUILT`

Remove `Nug`, `Snug`, `Jane's` and `Bar Coopers` from `COMING_SOON`. Note that
`Jane's` is written there with a typographic apostrophe (`Jane’s`), so match on
that. **`Remy` and `Paw Connect` stay** — they are the only two left.

Append these five to `BUILT`. Every one is `stream: 'websites'`,
`status: 'live'`, `placeholder: true`, and `year: '2026'`.

```ts
  {
    slug: 'nug',
    title: 'NUG.',
    client: 'NUG.',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://nug-preview.vercel.app',
    line: 'Handmade pasta in Bakery Lane, four nights a week.',
    lede: 'A small dining room that changes what it serves often, and needed a site that could keep up without a developer in the loop.',
    body: [
      'Placeholder. The menu changes, the hours change, and a site that needs a quote and a fortnight for either is a site that quietly goes out of date. This one is edited by the people who run the room.',
      'Placeholder. Worth writing up properly: what the brand work was, and what carried over from the room itself.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'Bakery Lane, Brisbane' },
      { label: 'Status', value: 'In testing' },
    ],
    media: {
      kind: 'image',
      src: '/built/nug.jpg',
      alt: 'The NUG. site: a dark room, ochre lighting, and the menu for the week.',
      width: 1440,
      height: 900,
    },
    placeholder: true,
  },
  {
    slug: 'snug',
    title: 'Snug',
    client: 'Snug',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://snug-preview.vercel.app',
    line: 'Olive and cream on a near-black room in Coorparoo.',
    lede: 'One of three venues on the same block, each with its own brand, each needing to look like nobody else.',
    body: [
      'Placeholder. The palette comes out of the room — olive from the bar, cream from the light the menu sits in — rather than off a swatch.',
      'Placeholder. Needs the real write-up.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'Coorparoo, Brisbane' },
      { label: 'Status', value: 'In testing' },
    ],
    media: {
      kind: 'image',
      src: '/built/snug.jpg',
      alt: 'The Snug site: olive and cream type on a near-black ground.',
      width: 1440,
      height: 900,
    },
    placeholder: true,
  },
  {
    slug: 'janes-deli',
    title: 'Jane’s Deli',
    client: 'Jane’s Deli',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://janes-preview.vercel.app',
    line: 'A deli on Chatsworth Rd, in sage and kraft off their own signage.',
    lede: 'The light one of the three. Sage ink on warm paper, with the kraft of the price tags as the band.',
    body: [
      'Placeholder. Colour taken from the signage and the tags rather than described, which is why it looks like the shop.',
      'Placeholder. Needs the real write-up.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'Coorparoo, Brisbane' },
      { label: 'Status', value: 'In testing' },
    ],
    media: {
      kind: 'image',
      src: '/built/janes-deli.jpg',
      alt: 'The Jane’s Deli site: sage type on warm paper with a kraft band.',
      width: 1440,
      height: 900,
    },
    placeholder: true,
  },
  {
    slug: 'bar-coopers',
    title: 'Bar Cooper’s',
    client: 'Bar Cooper’s',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://coops-preview.vercel.app',
    line: 'A near-black bar with the brick of the oven as its only colour.',
    lede: 'A warm near-black room whose one colour is the brick of the oven, carried onto the page as the only thing that is not type.',
    body: [
      'Placeholder. One colour, used for the button and the rule over a menu section, and nothing else competing with it.',
      'Placeholder. Needs the real write-up.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'Coorparoo, Brisbane' },
      { label: 'Status', value: 'In testing' },
    ],
    media: {
      kind: 'image',
      src: '/built/bar-coopers.jpg',
      alt: 'The Bar Cooper’s site: pale type on near-black, with brick-red as the only colour.',
      width: 1440,
      height: 900,
    },
    placeholder: true,
  },
  {
    slug: 'don-gino',
    title: 'Don Gino',
    client: 'Don Gino',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://don-gino.vercel.app',
    line: 'West End. Black fascia, gold script, a row of yellow chairs.',
    lede: 'What a stranger walks past on Hardgrave Rd, which is what the page had to be.',
    body: [
      'Placeholder. An earlier draft was built from a verbal description and looked like nobody in particular; this one is sampled off the shopfront.',
      'Placeholder. Needs the real write-up.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'West End, Brisbane' },
      { label: 'Status', value: 'Live' },
    ],
    media: {
      kind: 'image',
      src: '/built/don-gino.jpg',
      alt: 'The Don Gino site: gold script on black, with the yellow of the chairs.',
      width: 1440,
      height: 900,
    },
    placeholder: true,
  },
```

### 2.4 — Add the cutover note

At the top of `built.ts`, below the existing header comment:

```
 * ⚠ PREVIEW URLS — SWAP AT CUTOVER
 *
 * All five websites entries point at Vercel preview deployments because the
 * sites are in testing, and each carries status: 'live' on the assumption that
 * it cuts over before this site redeploys.
 *
 *   nug          nug-preview.vercel.app    → nuggeneralstore.com
 *   snug         snug-preview.vercel.app   → (domain TBC)
 *   janes-deli   janes-preview.vercel.app  → (domain TBC)
 *   bar-coopers  coops-preview.vercel.app  → (domain TBC)
 *   don-gino     don-gino.vercel.app       → (domain TBC)
 *
 * If this site ships before a venue cuts over, that card claims "live" against
 * a preview URL. Check this list before any deploy.
```

### 2.5 — Leave alone

- `simon-hanmer-studio` stays as it is.
- The other `BUILT` entries keep `placeholder: true`.
- No credit or attribution line on any venue card. Who invoices is not the
  visitor's business, and a disclaimer reads worse than silence.

---

## Verify before you log done

```bash
pnpm tsc --noEmit
pnpm lint
pnpm build
```

Then by eye on `pnpm dev`:

1. `/built` renders **13** cards; the Coming rail has exactly two names left.
2. All five new cards show the `[placeholder]` marker and their screenshot.
3. `/built/nug`, `/built/snug`, `/built/janes-deli`, `/built/bar-coopers`,
   `/built/don-gino` all resolve — the slugs feed `generateStaticParams`, so a
   typo is a 404 rather than a type error.
4. Each of those five shows a working **Visit the site →** link.
5. `/sitemap.xml` contains all five. It generates from `BUILT`, so if they are
   missing the entries are shaped wrong.
6. `/websites` still lists its proof projects correctly — same file.

Then commit and `git push origin development`.

---
## The log — required, and it is the deliverable

Write to **`docs/briefs/built-websites.log.md`**. Create it if it does not
exist; **append** a new run block if it does, never overwrite a previous run.

Simon and Claude both read this file to decide what happens next, so write it
for someone who was not watching. Facts, not reassurance — "the build failed on
X" is useful, "everything went well" is not.

```markdown
## Run <N> — <ISO date> — <branch>

**Stage 1 — build**
- `pnpm tsc --noEmit`: pass / fail
- `pnpm build`: pass / fail
- Errors, verbatim, with file and line. All of them, not a sample.
- What I fixed, and why it was unambiguous.
- What I did NOT fix, and why it looked like a decision rather than a mistake.
- Commit SHA of the "Sept work, first build" commit, if it was made.

**Stage 2 — built.ts**
- Entries added, with slug and status as written.
- Anything in the brief that did not match the actual code, and what I did.

**Verification**
- Each of the five checks: what I saw. A route that 404s is a result, not a
  failure to report.

**Open / blocked**
- Anything I could not do, with the reason.
- Anything I think is wrong with the brief itself.
```

Last line of the run block is one of exactly: `STATUS: done`,
`STATUS: partial`, or `STATUS: blocked`.
