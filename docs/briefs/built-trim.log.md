# Log — built-trim

5 November. Run after cms (done, `1a0cd86`), on `development`. Content goes
through the seed. robotics-content was already done, and its last open item
(the seed) closed in cms Stage D.

## What changed

**/built is five cards, each with a real image:** Project Arachnid (lead,
featured), the Aptium portal, Training Professionals, SAUCE, and Five Brisbane
venues, in that order (`order` 10–50).

- **§1 Cut.** `vsource-site`, `qut-capstones` and the five venue entries are
  in `retired` in `src/seed/content.ts`, so the seed deleted them (7 removed).
  All seven slugs now 404 and are gone from the sitemap. Nothing else in the
  code or docs linked to them.
- **§2 `brisbane-venues`.** All copy and the montage are exactly as briefed.
  `client` is `Hospitality group`; the template only shows it as the Client
  fact, so the brief's fallback was not needed. There is a new **`sites`**
  array on `projects` (`name`, `url`, `where`, `screenshot` upload), seeded
  from the five old entries in the order Nug, Snug, Jane’s Deli, Bar Cooper’s,
  Don Gino. Each one reuses its existing screenshot media document, so its alt
  text is the old `/built` alt. It renders as **The sites** on the project
  page: five linked cards with `rel="noopener"`, opening in the same tab. A
  row of five on wide screens, then two, then one (never 3 or 4, which strand
  cards). An empty `sites` renders nothing. The Websites door and row still
  use the Nug and Snug media documents.
  - Its facts are just `Stream: Websites`, the one fact every project
    carries. The brief gave none, and I did not invent any.
- **§3 Training Professionals.** The copy, facts, status and image are as
  briefed, and `placeholder` is off. The generated placeholder still
  (`placeholder-site.jpg`) is removed from the seed and the repo. Its media
  row is still in the preview database, unused, because the seed never
  deletes media. An admin can delete it.
- **§4 SAUCE.** There is a new story, **`Showcase/Overview`**
  (`src/components/ui-kit/Showcase.stories.tsx`): real SAUCE components
  (Input ×3, Dropdown open, Button ×4, Choice ×4, SlideSwitch, Table,
  ProgressBar) on the site's own dark theme. It imports `global.scss` with
  `data-theme="dark"`, not the Storybook preview's purple tenant palette. It
  is a 1280×800 sheet captured at device scale 1.25, which gives
  `sauce.jpg` at 1600×1000. Alt as briefed.
- **§5 Aptium.** There is a new media kind, **`logo`**, in the collection, the
  data layer and `ProjectMedia`: the upload is centred on the light raised
  plate the partner cards use, which fills the normal 16:9 frame. The plate
  colour is now a global token, `--logo-plate`, which the home page's
  `--home-logo-plate` points at. Aptium uses the existing `aptium.png` media
  document, with alt `Aptium logo`. The NDA sentence stays in the body, not
  the alt.
- **§6 Layout.** `.built-grid` is now explicitly two columns above 700px and
  one below, not `auto-fit`. auto-fit gave three columns at 1440 and 1024,
  which orphans the fourth card. The CSS comment says to recheck it when the
  count changes. **`StreamMark` appears nowhere** on `/built` or any project
  page (no `markwrap` in the HTML of any of the six). **The `mark` media kind
  is now unused.** It is left in the type, the collection options and the
  component, as the brief says.

## Where the brief did not match the code

- **Storybook did not start, before any of this.** Two existing faults:
  1. `@storybook/addon-docs` 10.5 needs `storybook` 10.5, but 10.4.6 was
     installed (`ERR_PACKAGE_PATH_NOT_EXPORTED ./open-service`). `storybook`
     is now at `^10.5.0`, which resolves to 10.6.5.
  2. `.storybook/main.ts` injected the tokens with `@use "C:/…/_tokens.scss"`.
     On Windows, Sass reads `C:` as a URL scheme, so **every** SCSS story
     failed with "Can't find stylesheet". It now uses a Sass load path and
     `@use "tokens"`.
- **The Websites stream's proof copy is now out of date, and I have not
  changed it** (it is your copy): "This site, and five hospitality sites
  across Brisbane, all on the Built page." "This site" is no longer on
  `/built`. It is in `streams` → Websites → Proof, and editable in `/admin`.
- The Chakra Petch web font did not report as loaded in Storybook
  (`document.fonts.check` false), so the "SAUCE" heading in the sheet may be
  a fallback face. Plex Sans and Plex Mono loaded. Looking at it, the heading
  reads correctly.

## A cms defect this run found, and its fix

The first build after the seed **served the old `/built`**: all eleven
projects and the old media. `unstable_cache` keeps its entries in the Data
Cache (`.next/cache`), which outlives a build, and a seed runs outside Next,
so it cannot clear the `content` tag. The build read its own stale cache.
On Vercel, a production seed followed by a redeploy would have done the same.
**Fix** (`src/data/index.ts`): the cache key now carries
`VERCEL_DEPLOYMENT_ID`, or a per-process id off Vercel, so every deployment
starts cold and reads the database. Saves within a deployment still clear the
tag as before. After the fix, the new build served the right five.

## SAUCE screenshot: every visible string (verify 4)

`SAUCE` · `COMPONENT LIBRARY · DARK THEME` · `INPUTS` · `Job name` ·
`Stock counts` · `Contact email` · `hello@example.com` · `Notes` ·
`Anything we should know` · `Stream` · `Software` · `Robotics` · `Websites` ·
`ACTIONS AND CHOICES` · `Save` · `Get started` · `Cancel` · `Delete` ·
`Email me when it changes` · `Weekly summary` · `Monthly` · `Yearly` ·
`Live preview` · `TABLE` · `Job` · `Stream` · `Status` · `Updated` ·
`Booking flow` · `Websites` · `Live` · `2 Nov` · `Stock counts` · `Software` ·
`Building` · `4 Nov` · `Gait trials` · `Robotics` · `Testing` · `5 Nov` ·
`Rostering` · `Software` · `Scoping` · `5 Nov` · `PROGRESS` · `68%`.

No client names and no client data. Nothing medical, and no Aptium branding.
The colours are the site's own dark tokens.

## Verify

| Check | Result |
|---|---|
| `pnpm tsc --noEmit` | clean |
| `pnpm lint` | only the known trailing comma in `next.config.ts:61` (see cms log) |
| `pnpm test:ci` | 47 suites, 635 tests pass |
| `pnpm build` | passes |
| 1. Five cards, all real media | yes: one video, three images, one logo. No line drawings, and no `[placeholder]` anywhere on `/built` or the project pages |
| 2. `/built/brisbane-venues` | lists the five, each `<a href=… rel="noopener">` with no target. Live URLs: nuggeneralstore.com, goodsnug.com, janes-deli.com, barcoopers.com and dongino.com.au **all 200** |
| 3. Removed slugs | `vsource-site`, `qut-capstones`, `nug`, `snug`, `janes-deli`, `bar-coopers` and `don-gino` all 404. Sitemap: `project-arachnid`, `aptium-portal`, `training-professionals`, `sauce`, `brisbane-venues` only |
| 4. SAUCE strings | listed above |
| 5. `pnpm seed` twice | first: 4 created, 3 updated, 7 removed. Second: **0 created, 0 updated, 0 removed, 36 unchanged** |
| 6. axe | `/built` and all five project pages, light and dark: **12 runs, 0 violations** |
| Layout | 1440: lead, then 2×2. 1024: lead, then 2×2. 390: one column. No orphan |

Screenshots: `C:\tmp\built-trim\` (`/built` and the five project pages at
1440, 1024 and 390, light and dark), plus `axe.json`.

Migration `20261104_230733_built_trim` (the `logo` enum value and the `sites`
tables) is applied to the preview branch.

A note on servers: something is still listening on port 3100 (PID 28924,
`node.exe`), probably a leftover `next start` of mine from the cms verify. I
couldn't confirm what it is, so I didn't kill it. The verify ran on 3130.
The 3200 dev server is untouched and up.

STATUS: done
