# Log — robotics brief

## Run 1 — 2026-11-03 — development

Done, as one commit pushed to `development`. It runs after warmth (complete
as of `5309eb0`) and photo-balance (`3038d35`). Every anchor text the brief
quotes matched the code, so there was nothing to stop on. Verification used
`next start` on **port 3124**.

### 1. The rename

`'engineering'` → `'robotics'`, `Engineering` → `Robotics`, `/engineering` →
`/robotics`:

- `streams.ts`: `StreamId` union, `id`, `name` and `href`. The copy is in §2.
- `siteNav.ts`: label and href.
- `built.ts`: `stream` on `spider-drones` and `qut-capstones`, both `Stream`
  fact values, `markId` on `qut-capstones`, the header-comment bullet, and
  the `qut-capstones` body sentence. Both now read "Robotics has no
  delivered work of its own".
- `StreamMark.tsx`: `EngineeringMark` → `RoboticsMark`, and the id check.
  The drawing is unchanged.
- `photos.ts`: the `streams` key and both `src` paths. The files were
  renamed with `git mv` to `public/photos/stock/robotics-door.jpg` and
  `robotics-step.jpg`. Credits and alt text are unchanged.
- `headlineTimeline.ts`: `WORDS = ['Software', 'Websites', 'Robotics']`.
  The comment's arithmetic is recomputed. All three words are now eight
  letters:
  - holds 3 × 600 = 1,800
  - deletes 24 × 18 = 432
  - cuts 6 × 120 = 720
  - types 24 × 42 = 1,008
  - **Total: 3,960 ms**, down from 4,140.
  - Each hold (600) still outlasts the longest word's typing, now 336 ms.
  - The ≤4,500 ms test passes unchanged, because it sums from the
    constants and has no hardcoded words.
- `RotatingHeadline.tsx`: the visually-hidden sentence is now `Software,
  websites and robotics, built to fit.`. The header comment's two quotes of
  the sentence and the run order in point 3 are updated.
- `page.tsx` metadata title: `Software, websites and robotics — Brisbane`.
- `[stream]/page.tsx` route-list comment.
- **Not in the brief's list, also fixed:** the `pricing` doc comment in the
  `Stream` interface (`streams.ts`) said "Software and Engineering cannot be
  priced before they are scoped". It now says Software and Robotics.

**Remaining `engineering` / `Engineering` hits in `src/`:**

| where | what | why it stays |
|---|---|---|
| `crew.ts:72` | Craig's summary: "Computer science, engineering, and two decades on site" | His degree in progress, not the stream |
| `crew.ts:73` | Craig's bio: "completing an engineering degree" | Degree (expected) |
| `crew.ts:98` | Ronan's bio: "an engineering degree in mechatronics" | Degree (expected) |
| `streams.ts:34` | NOTE comment: "part-way through engineering degrees" | Degrees, in the comment that explains the rule |
| `streams.ts:37` | NOTE comment: "professional engineering services" (the Act) | The Act (expected) |
| `streams.ts:39–40` | NOTE comment: the new sentence about the rename | Required by the brief |
| `streams.ts:266` | caps 1: "two engineering degrees in progress" | Degrees (expected, verbatim from the brief) |
| `streams.ts:290` | scope body: "professional engineering services" | The Act (expected, verbatim from the brief) |
| `streams.ts:299` | proof section, second paragraph: "services.ts dropped engineering as a service line in August…" | Historical, about the August decision, in a `pending: true` placeholder paragraph. The brief says the rest of the entry stays. **It renders on `/robotics`** and names an internal file, so it should go when Craig replaces the proof copy. |
| `services.ts:13–14` | header comment: "Engineering was dropped…" | The August record. `SERVICES` is exported but rendered nowhere: it is seed-era residue. |
| `work.ts:47` | `CASE_STUDY`: "rather than an engineering discipline" | Raw material for the Aptium write-up, not rendered, and it describes a discipline rather than a stream or a title. Worth a look when the case study is written, given the RPEQ rule. |
| `_tokens.scss:144` | comment: "reading as engineering rather than esports" | A design note about the palette |

**Redirect:** `/engineering` does **not** exist on `main`. `git ls-tree
origin/main` has no `[stream]` route and no `engineering` page. Its routes
are `/`, `/work`, `/services`, `/crew` and `/contact`. `git grep` on
`origin/main` finds the word only in `crew.ts`, `services.ts`, `work.ts` and
`_tokens.scss`, none of which is a route or a redirect. It was never
deployed, so **I added no redirect**.

### 2. Stream copy

All of it is verbatim from the brief: `door`, `problem`, `solution`, `lede`,
the four `caps`, `who` and `promise`; both changes to the scope body (first
paragraph "robotics work", and the new second paragraph); and the NOTE
comment sentence. `pageLede`, `proof`, `pricing`, the proof section and every
`pending` flag are unchanged.

This copy is Craig's to confirm today. None of the fields the brief
replaced carries a `pending` flag, so none renders a marker. I did not add
one, because the brief says to leave the flags as they are.

### 3. CLAUDE.md

- Content rules, "Nobody here is called an engineer": the last sentence is
  replaced verbatim.
- Routes: `/engineering` → `/robotics`.
- Current state: `/engineering (Craig's)` → `/robotics (Craig's)`.
- There are no other mentions of the Engineering stream. The remaining
  "engineering" in CLAUDE.md is the Act's "professional engineering
  services", plus the new sentence itself.

### Verify

- `pnpm tsc --noEmit` clean · `pnpm lint` clean · `pnpm test:ci` 42 suites /
  594 tests · `pnpm build` passes. `[stream]` generates `/software`,
  `/websites` and `/robotics`.
1. `GET /robotics` → 200 · `GET /engineering` → **404** (no redirect, per §1).
2. Nav: Software, Websites, Robotics, Built, Contact, in both the header and
   the footer. Doors: Software, Websites and Robotics, with
   `href="/robotics"`. Stream sections: the third step is `id="robotics"`,
   with the h3 "Robotics", and both robotics photos load. The headline runs
   Software → Websites → Robotics → Software and stops on Software. **Last
   change at 3,850 ms from navigation start** (it was ≈4,480 ms with
   Engineering). The h1's hidden sentence is "Software, websites and
   robotics, built to fit."
3. `/sitemap.xml` contains `/robotics` and nothing matching `engineering`.
4. `/built/spider-drones` and `/built/qut-capstones` both show Stream:
   Robotics, link to `/robotics` ("Robotics" ×2 and "See how robotics
   works"), and have no "engineering" anywhere in their visible text.
5. axe-core 4.12.1 on `/`, `/robotics` and `/built`, light and dark, after
   scrolling every reveal in: **0 violations** on all six runs.

Screenshots: `C:\tmp\robotics\home-1440-fold.png` ·
`robotics-light.png` · `robotics-dark.png`.

**Not touched:** `.claude/`, `_to_delete/`, `.env*`. Port 3123 is still held
by an old `next start` from the earlier warmth run, serving a stale build. I
left it running. It is safe to kill.

STATUS: done
