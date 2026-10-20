# Log — built-websites brief

## Run 1 — 2026-10-14 — main (no feature branch: git unavailable, see below)

**Stage 1 — build**
- `pnpm install`: pass ("Already up to date").
- `pnpm tsc --noEmit`: **fail**, exit 1, 2 errors.
- `pnpm build` (`next build --webpack`): **pass**, exit 0. Compiled in 26.0s,
  Next's own TypeScript step passed, 25 static pages generated. Routes built:
  `/`, `/[stream]` → `/software` `/websites` `/engineering`, `/built`,
  `/built/[slug]` (8 paths), `/team`, `/contact`, `/api/contact`, `/sitemap.xml`,
  `/robots.txt`, plus the dead `/crew`, `/services`, `/work`.
  The root-level `[stream]` segment beside the static routes is **not** a
  problem; the fallback in the brief is not needed.
- The only build-log warning is Node's `NODE_TLS_REJECT_UNAUTHORIZED=0` notice,
  coming from `.env.local`. Not touched (`.env*` is off-limits), but that should
  not be set in any environment that builds for production.
- tsc errors, verbatim, all of them:
  ```
  src/__tests__/components/ui-kit/ButtonLoader.test.tsx(32,50): error TS2322: Type '{ size: number; }' is not assignable to type 'IntrinsicAttributes'.
    Property 'size' does not exist on type 'IntrinsicAttributes'.
  src/__tests__/components/ui-kit/DropDown.test.tsx(180,77): error TS2322: Type '{ options: { label: string; value: string; }[]; onSelect: Mock<any, any, any>; value: string; normalCase: true; }' is not assignable to type 'IntrinsicAttributes & DropdownProps'.
    Property 'normalCase' does not exist on type 'IntrinsicAttributes & DropdownProps'.
  ```
  Both are in ui-kit test files that the Sept work never touched. The ui-kit
  components (`ButtonLoader.tsx`, `DropDown.tsx`) are not modified in the
  working tree either, so these were already broken at the 4 August commit.
  They are not caused by the uncommitted work. Next's build-time type check
  does not cover test files, which is why the build passes.
- What I fixed: nothing.
- What I did NOT fix: the two test errors. Each is a test passing a prop
  (`size`, `normalCase`) that the component no longer accepts. The fix is
  either "delete the test case" or "put the prop back on the component", and
  that is a decision, not an obvious mistake.
- Commit SHA of the "Sept work, first build" commit: **none, not made.** Every
  `git` command was denied in this session (`git branch -a`, `git status
  --short`, and `git checkout -b` with and without `-C`). pnpm commands ran
  normally. So I could not:
  - cut the feature branch (the working tree is still on `main`)
  - make the as-is commit
  - `git rm` the dead routes (`src/app/work`, `src/app/services`,
    `src/app/crew`, `src/app/styles/work.scss`, `src/app/styles/services.scss`).
    I deliberately did not plain-`rm` them either, so the working tree is
    exactly what the as-is commit should capture.

**Stage 2 — built.ts**
- **Not started.** The brief says to commit before making any change, so that
  Stage 2 has a clean point to diff against. Without git there is no such
  point: any edit to `built.ts` (an untracked file) would end up inside the
  "as-is" commit. The build is green, so this is not the red-build stop. It is
  the commit-first rule.
- Entries added: none.
- I read `src/constants/built.ts` ahead of the next run. Stage 2 as written
  **cannot be done as a data-only change** even with git working:
  1. **`Project` has no `pending` field.** The only flag is `placeholder?:
     boolean`. Writing `pending: true` on an object literal typed as `Project`
     is an excess-property error under tsc. The brief's verify step 2 (the
     `[pending]` marker) also needs a template change:
     `src/app/built/page.tsx:52,77` and `src/app/built/[slug]/page.tsx:60` only
     render `[placeholder]` when `project.placeholder` is set. The brief forbids
     touching `src/app/built/` unless the build requires it.
  2. **`Project` has no `url` field.** The brief's table gives each venue a
     URL. Storing it needs a new optional field on the type. Showing it as a
     link on the card or project page needs a template change, which is the
     same restriction as above.
  3. **The brief only gives four of the required fields** (slug, title, url,
     line). `Project` also requires `client`, `year`, `lede`, `body: string[]`,
     `facts: {label,value}[]`, and `media` (with `alt`, `width`, `height`).
     Filling those for five venues means writing copy nobody has given me,
     which is what the content rules say not to do.
  4. **Card count.** `BUILT` already has 8 entries. Adding 5 makes 13, not the
     "eleven cards" in verify step 1. Either the brief expects three entries to
     come out, or the number is wrong.
  5. **Cutover comment says "Four of the websites entries"** but lists five.
     `don-gino.vercel.app` is a Vercel URL too.
  6. Minor: `COMING_SOON` writes Jane's with a typographic apostrophe
     (`Jane’s`). Not a problem, but worth knowing when you match on it to
     remove it.

**Verification**
- Not run. There is no Stage 2 change to verify. For the record, the current
  build generates 8 `/built/[slug]` paths, and none of the five new slugs exist
  yet, so all five would 404 today.

**Open / blocked**
- **Git is denied for this session.** Someone needs to allow git, or Simon
  makes the commit himself. Before any `git add -A`, two things in the tree
  should be decided, not swept in:
  - `_to_delete/architecture-APT-DOC-009/` (untracked) holds the Aptium
    portal's architecture diagrams, including `03-scanflow`. That is
    medical-product residue and should not be committed to this repo. Delete
    it, or leave it out of the commit.
  - `docs/briefs/` (untracked) holds this brief and this log. Commit it or not,
    whichever you prefer.
  - `docs/DEPLOYMENT.md` and `src/constants/contact.ts` are already staged; the
    rest is unstaged. That doesn't matter for a single all-in commit. I'm
    noting it in case the split was on purpose.
- **Stage 2 needs these decisions before it is runnable:**
  - (a) Add `pending?: boolean` and `url?: string` to `Project`, and allow edits
    to `src/app/built/page.tsx` and `src/app/built/[slug]/page.tsx` so they
    render `[pending]` and the link. Or reuse `placeholder`, which the brief
    explicitly rules out.
  - (b) Supply `client`, `year`, `lede`, `body`, `facts` and `media` for the
    five venues, or say that minimal stand-ins are acceptable under
    `pending: true`.
  - (c) Confirm the expected card count (13 vs 11).
- Pre-existing, outside this brief: the two ui-kit test type errors above.
  `pnpm test:ci` passes anyway (41 suites, 593 tests), because ts-jest is not
  failing on them. So they only show up under `pnpm tsc --noEmit`. Jest also
  warns about a haste-map name collision with `.next/standalone/package.json`,
  which is harmless but noisy. Adding `.next` to `modulePathIgnorePatterns`
  would silence it.

STATUS: blocked

## Run 2 — 2026-10-20 — development (cut locally off `main` at fc4cd66, not pushed)

Git now works, so this run got further than Run 1. It stopped at the
as-is commit, because the pre-commit hook rejects it.

**Stage 1 — build**
- `pnpm install`: pass ("Already up to date").
- `pnpm tsc --noEmit`: **fail**, exit 2. These are the same two errors as Run 1,
  both in ui-kit test files and both pre-existing (see Run 1). Verbatim:
  ```
  src/__tests__/components/ui-kit/ButtonLoader.test.tsx(32,50): error TS2322: Type '{ size: number; }' is not assignable to type 'IntrinsicAttributes'.
    Property 'size' does not exist on type 'IntrinsicAttributes'.
  src/__tests__/components/ui-kit/DropDown.test.tsx(180,77): error TS2322: Type '{ options: { label: string; value: string; }[]; onSelect: Mock<any, any, any>; value: string; normalCase: true; }' is not assignable to type 'IntrinsicAttributes & DropdownProps'.
    Property 'normalCase' does not exist on type 'IntrinsicAttributes & DropdownProps'.
  ```
- `pnpm build`: **pass**, exit 0 (Next 16.2.11, webpack). 25 static pages.
  `[stream]` builds `/software` `/websites` `/engineering`. `/built/[slug]`
  builds 8 paths. The dead `/crew`, `/services` and `/work` still build, so
  `[stream]` beside the static routes is not a problem. The only warning is
  `NODE_TLS_REJECT_UNAUTHORIZED=0` from `.env.local` (not touched).
- `pnpm test:ci`: pass, 41 suites, 593 tests.
- `pnpm lint`: **fail**, 27 errors. 25 of them are `prettier/prettier`
  formatting. lint-staged's `eslint --fix` rewrites those itself at commit
  time, so they would not block. These are the files:
  `src/app/api/contact/route.ts:225`, `src/app/page.tsx:114,137,138,141`,
  `src/components/built/ProjectMedia.tsx:81,89`,
  `src/components/home/FitCut.tsx:58,150,151,152`,
  `src/components/home/Reveal.tsx:78`,
  `src/components/home/StreamMark.tsx:35,52,55,58,66,67,83,87,88`,
  `src/components/home/StreamMoves.tsx:100`,
  `src/constants/streams.ts:139,240`, `src/constants/work.ts:24`.
  The other **2 cannot be auto-fixed, and they are what blocks the commit:**
  ```
  src/components/built/ProjectMedia.tsx
    67:7  error  Error: Calling setState synchronously within an effect can trigger cascading renders   react-hooks/set-state-in-effect
      > 67 |       setPlaying(false)      (inside `if (reduced || !wanted) { node.pause(); … return }`)
  src/components/home/StreamMoves.tsx
    69:7  error  Error: Calling setState synchronously within an effect can trigger cascading renders   react-hooks/set-state-in-effect
      > 69 |       setArmed(false)        (inside `if (reduced) { … return }`)
  ```
- **The commit was attempted and rejected.** `git commit` ran the husky
  pre-commit hook → lint-staged → `eslint --fix`. It failed on the two errors
  above, and lint-staged reverted to the original state. I checked afterwards:
  the working tree is intact and the 62 files are still staged.
- What I fixed: nothing.
- What I did NOT fix, and why:
  - The two `set-state-in-effect` errors. Each one is the reduced-motion /
    "not wanted" branch of an IntersectionObserver effect resetting state. To
    fix it, `playing` / `armed` would have to be derived during render rather
    than reset in the effect. That changes how two animations hold their state,
    in code that has never been run in a browser. It is a restructure, not an
    obvious mistake. It would also stop the commit being "as-is".
  - I did not pass `--no-verify` to get past the hook. The hook is a quality
    gate somebody chose to install. Rewriting history is not allowed here, so
    once a commit is pushed it cannot be taken back. Skipping a gate on a
    commit that cannot be undone is Simon's call, not mine.
  - The two tsc test errors: see Run 1. Still a decision, not a mistake.
- Staging, for the record: I staged with
  `git add -A -- . ':(exclude)_to_delete' ':(exclude).claude'`, which gives 62
  files. Left out:
  - `_to_delete/architecture-APT-DOC-009/`, the Aptium diagrams. Not
    deleted, just not staged.
  - `.claude/settings.json` (modified), `.claude/__probe` and
    `.claude/settings.json.aptium-backup`, all untracked. `.claude/` is
    off-limits.
  - `.env.local`. `.gitignore:35` `.env*` covers it, confirmed with
    `git check-ignore`.
  
  Note that the staged set *includes* the deletion of the tracked
  `docs/architecture/APT-DOC-009/*` files. That takes the Aptium diagrams
  out of the tree from this commit on. They stay in the history of the
  earlier commits.
- Commit SHA of "Sept work, first build": **none, the commit was refused.**
  `development` exists locally at `main`'s HEAD (fc4cd66). It has not been
  pushed, because it would carry nothing.
- The dead-route `git rm` was not done. It comes after the as-is commit, so
  that it does not get mixed into it.

**Stage 2 — built.ts**
- **Not started.** The as-is commit does not exist yet, and the brief makes
  that commit the precondition.
- Entries added: none.
- The brief still does not match the code, on every point Run 1 raised.
  Nothing in it changed in response:
  1. `Project` has no `pending` field. `pending: true` is a type error, and
     rendering `[pending]` means editing `src/app/built/page.tsx` and
     `src/app/built/[slug]/page.tsx`, which the brief puts off-limits.
  2. `Project` has no `url` field.
  3. `Project` also requires `client`, `year`, `lede`, `body`, `facts` and
     `media`. The brief supplies none of them for the five venues.
  4. 8 existing + 5 new = 13 cards, not the "eleven" in verify step 1.
  5. The cutover comment says "Four of the websites entries" and then lists
     five URLs, all on `vercel.app`.

**Verification**
- Not run. There is no Stage 2 change. The five new slugs would all 404 today,
  because the build generates only the existing 8.

**Open / blocked**
- **Decision needed to get past Stage 1.** Pick one:
  - (a) Commit as-is with `--no-verify` so the checkpoint really is untouched.
    Then fix the two hook errors in their own commit before anything else.
    This keeps "as-is" honest, but puts one commit on `development` that
    fails lint, and CI lints PRs into `development`.
  - (b) Fix the two `set-state-in-effect` errors first, by deriving `playing`
    and `armed` in render. Then commit everything together. This gives a clean
    hook and clean CI, but the "as-is" commit is no longer exactly as-is.
- **Stage 2 needs the Run 1 decisions:** the `pending` and `url` fields plus a
  template edit; the copy for the missing required fields, or permission to
  use minimal stand-ins under `pending: true`; and 11 vs 13 cards.
- Pre-existing, outside this brief: the two ui-kit test type errors. Also,
  `pnpm verify` runs `lint:ci` with `--max-warnings=0`, so it currently fails
  on all 27 lint errors. CI on a PR into `development` would fail the same
  way until the prettier fixes are committed.

STATUS: blocked

## Run 3 — 2026-10-20 — development (local only, still at `main`'s fc4cd66, not pushed)

I was told the two `set-state-in-effect` errors from Run 2 had been fixed, and
to confirm with `pnpm lint` before committing. Lint does not confirm it, so I
made no commit.

**Stage 1 — build**
- `pnpm install`: not re-run. Nothing in `package.json` or the lockfile has
  changed since Run 2.
- `pnpm tsc --noEmit`: **fail**, exit 2. The same two pre-existing ui-kit
  test errors as Runs 1 and 2 (`ButtonLoader.test.tsx(32,50)`,
  `DropDown.test.tsx(180,77)`), verbatim in Run 2. There are no new errors.
- `pnpm build`: **pass**, exit 0. 25 static pages, same routes as Run 2.
- `pnpm test:ci`: pass, 41 suites, 593 tests.
- `pnpm lint`: **fail**, 26 errors. 25 are the same `prettier/prettier`
  formatting errors as Run 2, which lint-staged fixes itself. The 26th still
  blocks the commit:
  ```
  src/components/home/StreamMoves.tsx
    90:5  error  Error: Calling setState synchronously within an effect can trigger cascading renders   react-hooks/set-state-in-effect
      > 90 |     setObserving(true)
        91 |     setSaid((current) => current.map((was, i) => was || onScreen[i]))
        92 |     setReplied((current) => current.map((was, i) => was || onScreen[i]))
  ```
- I reviewed the fixes in the working tree:
  - `ProjectMedia.tsx`: **cleared.** `playing` is now derived
    (`videoPlaying && !reduced && wanted`), and the effect only calls
    setState inside the observer and `play()` callbacks, which the rule
    allows. The logic reads correctly to me.
  - `StreamMoves.tsx`: **moved, not cleared.** The rule reports only the
    *first* synchronous setState in an effect body. In Run 2, `setArmed(false)`
    at line 69 was hiding `setArmed(true)` further down. The fix removed the
    first one, so the rule now reports the next: `setObserving(true)` at
    line 90. `setSaid` and `setReplied` on lines 91–92 run synchronously in the
    same effect body too, so expect them to be reported once line 90 is dealt
    with.
- What I fixed: nothing.
- What I did NOT fix, and why: the line 90–92 block. It measures the DOM
  (`getBoundingClientRect` for what is already on screen at mount) and then
  pushes the result into state. The plausible fixes are behaviour choices,
  not obvious corrections:
  - defer the three setStates into a `requestAnimationFrame` callback, which
    adds one frame before anything is armed;
  - move the on-screen measurement into a ref callback or a lazy initialiser;
  - keep the code and add an `eslint-disable-next-line` with a reason, on the
    grounds that measuring layout on mount is the "sync from an external
    system" case the rule tolerates.
  
  Whoever wrote the Run 2 fix should choose. They know what the first-paint
  behaviour is meant to be.
- Commit SHA of "Sept work, first build": **none.** I did not attempt the
  commit, because the instruction was to confirm lint first.
- Staging is unchanged from Run 2, except that `ProjectMedia.tsx`,
  `StreamMoves.tsx` and this log now have unstaged edits on top of their
  staged versions (`AM`). The commit, when it happens, needs those re-added.
  `_to_delete/`, `.claude/` and `.env.local` are still excluded.
- Dead-route `git rm`: not done. It still waits for the as-is commit.

**Stage 2 — built.ts**
- **Not started.** It is blocked on the Stage 1 commit.
- Entries added: none.
- The brief is unchanged since Run 2 (same size; it still says "eleven cards"
  and "Four of the websites entries"). Every mismatch listed in Runs 1 and 2
  still stands:
  - `Project` has no `pending` or `url` field, and rendering `[pending]`
    needs a template edit that the brief rules out.
  - The required `client`, `year`, `lede`, `body`, `facts` and `media` are
    not supplied for any of the five venues.
  - 13 cards would render, not 11.
  - The cutover comment says four entries and lists five.

**Verification**
- Not run. There is no Stage 2 change.

**Open / blocked**
- `StreamMoves.tsx:90–92` needs a decision and a fix (options above). Then
  `pnpm lint` should show only the 25 prettier errors, and the as-is commit
  can go ahead. Strictly it is no longer "as-is", because it now includes
  the lint fixes. That is option (b) from Run 2, which these fixes imply was
  chosen.
- The Stage 2 decisions from Run 1 are still unanswered.

STATUS: blocked

## Run 4 — 2026-10-20 — development

The brief's Stage 2 was rewritten for this run (13919 bytes, was 7435), and it
answers every mismatch raised in Runs 1–3. `StreamMoves.tsx` was changed again
before this run: all of the first-measure arming now happens in one
`requestAnimationFrame`, and the frame is cancelled on cleanup.

**Stage 1 — build**
- `pnpm install`: up to date.
- `pnpm lint`: before the commit there were 26 errors, **all**
  `prettier/prettier`. No `react-hooks/set-state-in-effect` remained. I
  reviewed the new StreamMoves fix and it reads correctly. The pre-commit
  hook's `eslint --fix` applied the prettier fixes, and `pnpm lint` has
  been clean (exit 0) since that commit.
- `pnpm tsc --noEmit`: **fail**, exit 2. The same two pre-existing ui-kit
  test errors as Runs 1–3 (`ButtonLoader.test.tsx(32,50)`,
  `DropDown.test.tsx(180,77)`, verbatim in Run 2). Nothing else.
- `pnpm build`: **pass**, exit 0, 25 pages.
- `pnpm test:ci`: pass, 41 suites, 593 tests.
- **Commit `b475b4893010204e4e349fe377685c67241baa39`**, "three streams,
  /built and /team — Sept work, first build". It has 62 files. It includes
  the two set-state-in-effect fixes and the hook's prettier formatting, so
  it is "as-is" plus exactly what the hook required (option (b) from Run 2).
  - Excluded from it: `_to_delete/` (not deleted), `.claude/` (modified
    `settings.json`, untracked `__probe` and `settings.json.aptium-backup`)
    and `.env.local`. `.gitignore:35` `.env*` covers `.env.local`.
  - It does include the deletion of the tracked
    `docs/architecture/APT-DOC-009/*`. Those files are still in history
    before this commit.
- Dead routes: **commit `9bd732acbec3237e1f279e31cc89555363190208`**. It
  `git rm`s `src/app/{work,services,crew}` and
  `src/app/styles/{work,services}.scss`. I kept `src/constants/work.ts`. I
  also updated the comment in `src/app/team/page.tsx`, which still said
  `app/crew/` "wants deleting by hand".
  - **The first build after the `git rm` failed.** Verbatim:
    `.next/dev/types/validator.ts:89:39 Type error: Cannot find module
    '../../../src/app/crew/page.js' or its corresponding type declarations.`
    That file is generated (gitignored under `/.next/`), dated 2 October,
    left by an old `next dev`. `tsconfig.json` includes
    `.next/dev/types/**/*.ts`, so the build type-checks stale route
    validators. I deleted `.next/dev/types/`. That was unambiguous: it is a
    generated cache, not source, and Next regenerates it. The build then
    passed with 22 pages (the three dead routes gone).
  - Expect the same thing whenever a route is deleted while an old dev
    cache is lying around.
- Pushed: `git push -u origin development`. The new branch was created on
  origin.

**Stage 2 — built.ts**
- 2.1 Screenshots: `pnpm add -D playwright` (1.64.1, devDependency; it was not
  present) and `npx playwright install chromium`. A one-off script captured a
  1440×900 viewport JPEG at quality 82 after `networkidle` for each venue. All
  five loaded with HTTP 200. They are written to
  `public/built/{nug,snug,janes-deli,bar-coopers,don-gino}.jpg` (66–149 KB).
  I deleted the script afterwards.
- 2.2 `url?: string` is added to `Project`, with the doc comment as given.
  `src/app/built/[slug]/page.tsx` renders "Visit the site →"
  (`target="_blank"`, `rel="noopener noreferrer"`) inside the
  `built-project__stream` paragraph, after the stream link with a ` · `
  separator. No new SCSS. It is not on the index cards. One structural note:
  the paragraph used to render only when `stream` exists. It now renders when
  `stream || project.url`, so a URL is never hidden behind a missing stream.
  All five have a stream, so on today's data this makes no difference.
- 2.3 These entries are appended to `BUILT`, in this order, all with
  `stream: 'websites'`, `year: '2026'` and `placeholder: true`:
  - `nug`: status `live`
  - `snug`: status `live`
  - `janes-deli`: status `live`
  - `bar-coopers`: status `live`
  - `don-gino`: status `live`
  
  The copy is verbatim from the brief. Typographic apostrophes and dashes are
  written as `’` / `—`, to match the rest of the file.
  `COMING_SOON` is now `Remy` and `Paw Connect` only.
- 2.4 The cutover note is in its own block comment directly below the header
  comment, text as given.
- 2.5 `simon-hanmer-studio` and every other entry are untouched. No
  attribution lines.
- Brief vs code: no mismatches this time. Every field, path and class the brief
  names exists as described.

**Verification**

`pnpm tsc --noEmit` shows only the two old test errors. `pnpm lint` exit 0.
`pnpm build` pass, **27 pages** (22 + 5 new project pages). `pnpm test:ci`
593/593.

I could not use port 3000 for `pnpm dev`. It is held by the **YouHire
portal's** dev server. Port 3100 is the **simonhanmer-site** dev server. I
left both running and ran this site's dev server on **:3417** (same command
as `pnpm dev`, different port), then stopped it. The first route check
accidentally hit those other servers and returned 404s, so I discarded those
results.

Then I rendered the pages in Chromium:
1. `/built`: **13 cards** (`a.built-card`). The Coming rail shows exactly
   **Remy** and **Paw Connect**.
2. All five new cards show a visible `[placeholder]` marker, and their
   screenshot loaded (`naturalWidth > 0`, `src /built/<slug>.jpg`).
3. `/built/nug`, `/built/snug`, `/built/janes-deli`, `/built/bar-coopers` and
   `/built/don-gino` all return 200, with the right h1 on each.
   `/built/not-a-slug` returns 404, as it should.
4. Each of the five has "Visit the site →" with `target=_blank`,
   `rel="noopener noreferrer"`, pointing at its preview URL. All five URLs
   returned 200.
5. `/sitemap.xml` lists all 13 `/built/*` URLs, including the five new ones.
6. `/websites` links its proof projects: `vsource-site`, `simon-hanmer-studio`,
   `nug`, `snug`, `janes-deli`, `bar-coopers`, `don-gino`. The two originals
   are still there, and the five are added because the page filters `BUILT` by
   stream.

**Open / blocked**
- **The alt text does not match the screenshots for two venues.** I wrote the
  brief's text in verbatim, and I have not "fixed" it, because it is
  unconfirmed copy under `placeholder: true`. But alt text is what a screen
  reader hears instead of the image, and the `[placeholder]` marker is not
  attached to it. So this is a WCAG 1.1.1 problem the moment it ships:
  - `nug`: the alt says "a dark room, ochre lighting, and the menu for the
    week". The capture is a cream page with a large NUG. wordmark, a photo of
    a busy dining room, and a sage panel with "Ben makes everything himself.
    Ruxi looks after everyone." There is no menu. The site's header says
    **Fortitude Valley**, but the facts say "Bakery Lane, Brisbane".
  - `janes-deli`: the alt says "sage type on warm paper with a kraft band". The
    capture is a warm off-white header, an olive panel with *white*
    "brunch. sandwiches. filter & matcha." type, and a photo of three drinks.
    There is no kraft band.
  - `snug`: roughly right. The header bar is olive with cream type, and the
    hero is a dark photo of the room.
  - `bar-coopers` and `don-gino`: accurate. (Don Gino's yellow chairs are not
    in the fold, but the yellow is everywhere.)
- **Jane's Deli's `line` says "on Chatsworth Rd".** The screenshot shows
  that address on *Bar Cooper's* site ("Shop 4, 321 Chatsworth Road,
  Coorparoo"). Jane's may be on the same road (the brief calls them "three
  venues on the same block"), but nothing in Jane's own fold confirms it.
  Worth checking.
- **Card says LIVE, facts say "In testing".** For nug, snug, janes-deli and
  bar-coopers, the project page shows a `live` status on the card *and* the
  fact "Status: In testing". Both values come from the brief. They will
  contradict each other on the page until cutover. At cutover the fact needs
  flipping along with the URL. I have not added that to the cutover note,
  because the brief gives the note's text verbatim.
- **"Opens in a new tab" is not announced.** The visit link opens a new tab
  with no warning to assistive tech (advisory, WCAG G201, not an AA fail).
  The obvious fix is `<span className="visually-hidden"> (opens in a new
  tab)</span>`, which `ProjectMedia.tsx` already uses. But
  **`.visually-hidden` is only defined in `src/app/styles/home.scss`, which
  only the home page imports.** On a direct load of any `/built/*` page that
  span would render as visible text. That is also a latent bug in
  ProjectMedia's `long` link today (no entry uses `long` yet). Fix: move
  `.visually-hidden` to `global.scss`. That is outside this brief, so I
  have not done it.
- `pnpm peers check` reports an unmet storybook peer (10.4.6 installed,
  addons want ^10.5.0). This is pre-existing and not related to playwright.
- Pre-existing, still open: the two ui-kit test type errors (Run 1).
- Branches: everything is on `development`, pushed. Nothing is merged or
  pushed anywhere else. Merging is Simon's.

STATUS: done

## Run 5 — 2026-10-20 — development

This run follows up Run 4's open items. Simon corrected
`src/constants/built.ts` and `src/app/built/[slug]/page.tsx`. I reviewed
both, ran lint and build, then committed and pushed.

**Stage 1 — build**
- `pnpm lint`: **pass**, exit 0.
- `pnpm build`: **pass**, exit 0, 27 pages (unchanged from Run 4).
- `pnpm tsc --noEmit`: fail, the same two pre-existing ui-kit test errors
  (Run 1). Nothing new.
- What I fixed: nothing. Both files were already corrected when this run
  started.

**Stage 2 — what changed in built.ts and the project page**

I checked each of these against the Run 4 screenshots in `public/built/`:
- **Alt text rewritten for all five.** Each one now describes what is
  actually in the capture: NUG.'s wordmark, dining room and sage panel;
  Snug's olive bar and night photograph; Jane's badge, iced drinks and
  olive panel; Bar Cooper's brick-red name and oven; Don Gino's yellow name
  and three tile motifs. All five match.
- **The live / "In testing" contradiction is removed.** The `Status` fact is
  gone from all five, including Don Gino's `Live`. It is replaced by
  `Open` (NUG.) or `Kind` (the other four). `status: 'live'` stays, as the
  cutover note expects.
- **Addresses tightened from the sites themselves:** NUG. is now "Bakery
  Lane, Fortitude Valley", Bar Cooper's is "Shop 4, 321 Chatsworth Rd,
  Coorparoo" and Don Gino is "65 Hardgrave Rd, West End". All three match
  what the screenshots show. NUG.'s `Open: Wed – Sat, 5pm` matches its
  header.
- **Jane's "on Chatsworth Rd" is gone** from its `line`. The line and lede
  now describe what the fold shows.
- **Snug and Don Gino `line`/`lede` reworded** ("Korean-inspired all-day
  dining…", "An Italian trattoria on Hardgrave Rd…"). Both match the sites'
  own taglines.
- **The visit link now has `<span className="visually-hidden"> (opens in a
  new tab)</span>`.** I confirmed it is in the built HTML for
  `/built/nug`.

**Correction to Run 4**
- **Run 4 was wrong** to say `.visually-hidden` exists only in `home.scss`.
  It is defined in `src/styles/global.scss:443`, and has been since the seed
  commit `37b82d5`. `src/app/layout.tsx:8` imports it on every page. My Run 4
  search piped through `head -5`, which cut the output off before
  `global.scss` appeared. So:
  - there was never a latent bug in `ProjectMedia`'s `long` link;
  - nothing needs moving.
  
  `home.scss:40` holds a second, slightly different copy (it adds
  `clip-path: inset(50%)` and `!important`). On the home page that copy
  overrides the global one. It is harmless, but it is a duplicate that could
  be folded into `global.scss`.

**Verification**
- Lint and build are as above.
- I did not repeat the by-eye pass on `pnpm dev`. This run changed only
  strings and one hidden span, not routes, slugs or structure, and the
  build still generates the same 27 pages, including all five
  `/built/<slug>` paths.

**Open / blocked**
- These details are still unconfirmed against the venues' own folds, and are
  covered by `placeholder: true`:
  - "Coorparoo, Brisbane" for Snug and Jane's (neither address is in the
    screenshot);
  - "one of three venues on the same block" in Snug's lede.
- The cutover note and the five preview URLs are unchanged. Check them before
  any deploy.
- Pre-existing: the two ui-kit test type errors; the storybook peer mismatch.
- Everything is on `development`, pushed. Merging is Simon's.

STATUS: done
