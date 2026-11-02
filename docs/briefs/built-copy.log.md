# Log — built-copy brief

## Run 1 — 2026-11-03 — development

Everything in the brief is done. There are two commits, both pushed to
`development`: one for the code (`src/constants/built.ts`, `streams.ts`) and
one for the docs (`launch-polish.{md,log.md}`, this brief, and this log).
Verification used the production server (`next start`) on **port 3123**,
as last time.

**§1 — removals**
- `youhire` and `simon-hanmer-studio` are deleted from `BUILT`. Neither slug
  appears anywhere else in `src/`. The only other reference was the YouHire
  name in the Software proof line, which §4 replaces.
- `/built/youhire` and `/built/simon-hanmer-studio` both return **404**
  (`dynamicParams = false`). Neither is in `/sitemap.xml`, which now lists 22
  URLs, 11 of them project pages.

**§2 — rewrites**
- All eight entries are set verbatim from the brief, with curly apostrophes and
  em dashes as written, and `placeholder: true` is removed from each. Every
  field the brief does not list is unchanged.
- `aptium-portal`: `status` is now `'building'`.
- `sauce` and `vsource-site`: `facts` are replaced as given. `vsource-site`
  loses `Hosting` and gains `Framework: Next.js`.
- `nug`: `title`/`client` is `Nug General Store`. In the alt, only the
  `The NUG. site:` prefix changed.

**§3 — Coming rail:** `COMING_SOON` is CurbHire, Remy, Paw Connect. The
rendered rail reads `COMING CurbHire SOFTWARE Remy SOFTWARE Paw Connect
SOFTWARE`.

**§4 — stream proof:** the Software and Websites `proof.body` are set
verbatim, and `pending: true` is removed from Websites.

**§5 — header comment:** the first paragraph is replaced verbatim, and the
rest of the comment is untouched.

**Verify**
- `pnpm tsc --noEmit` clean · `pnpm lint` clean · `pnpm test:ci` 41 suites /
  591 tests passed · `pnpm build` succeeded, with 11 `/built/[slug]` paths.
- 1: `/built` renders **11 cards** (1 lead + 10 grid). The three with
  `[placeholder]` are exactly spider-drones, training-professionals and
  qut-capstones.
- 2: Coming rail correct (above).
- 3: both removed slugs 404, and neither is in the sitemap (above).
- 4: `/websites` has no marker. The stream-page marker text is
  `[wording needed]`, not `[pending]`; only `/engineering` shows it (2).
- 5: case-sensitive grep of the rendered HTML (including the RSC payload) of
  all 20 routes:
  - `YouHire`: **0 hits**.
  - `NUG.`: **0 hits**.
  - `Placeholder`: `/built/spider-drones` 15, `/built/training-professionals`
    11, `/built/qut-capstones` 9, `/built` 6 (all from those three cards' line,
    alt and media), `/engineering` 20.
  - **Outside the brief's expected list:** `/` 2 and `/team` 2. Both are
    Asuka's bio (`crew.ts`), which the brief names as deliberately still
    invented. It is expected; the brief's list just did not mention it.
- 6: axe-core 4.12.1 (wcag2a/aa, 21a/aa, 22aa, best-practice) on `/built` and
  all 11 project pages, light and dark: **0 violations** on all 24 runs.

**Left stale, outside this brief's exact replacements**
- `sauce` media alt still reads "No image yet: SAUCE has not been written up."
  It now has been written up. The brief said unlisted fields stay, so it stays.
- The `built.ts` header comment still has the bullet "Simon's own site and
  this one are on the list deliberately". Simon's site is gone. The brief said
  to leave the rest of the comment.
- `aptium-portal` facts still include `Hosting: Our own hardware, AU` and
  `Accessibility: WCAG 2.2 AA`. Neither was in the brief, so both are unchanged.
- `/engineering`'s `proof` section (still `pending`, Craig's) says "Websites
  has Training Professionals". Websites' proof is now the hospitality sites,
  and Training Professionals is a Software entry. Not touched.

**Not touched:** `.claude/`, `_to_delete/` and `.env.local`.

STATUS: done
