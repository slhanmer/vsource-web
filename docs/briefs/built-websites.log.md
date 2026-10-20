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
