# Log — crew-bios brief

## Run 1 — 2026-11-03 — development

Done, as one commit pushed to `development`, after robotics (`4af5ad0`).
Ronan's and Asuka's copy is verbatim from the brief, curly apostrophes
included. Every anchor text the brief quotes matched the code.
Verification used `next start` on **port 3124**.

### 1. `bio` becomes paragraphs

- `CrewMember.bio` is now `string[]`. Craig, Simon and Tom are one-item
  arrays, with their text unchanged.
- `team/page.tsx` renders one `<p className="crew__bio">` per paragraph.
  The `[pending]` marker, still supported for future entries, attaches to
  the last paragraph only.
- `crew.scss`: `&__bio + &__bio { margin-top: $spacing-md }`, which is
  16px, the same gap the stream pages put between body paragraphs
  (`stream.scss` `&__para`).
- **Other readers of `bio`:** none. The home teaser renders `summary`. The
  Person JSON-LD on `/team` uses only `id`, `name` and `role`. The `bio` hits
  in `Input.test.tsx` are a form field's `name`, unrelated. `tsc` is clean,
  which confirms nothing else reads it as a string.

### 2. Ronan Donahoe

`role` is now `Testing & Robotics`, `summary` is unchanged, and `bio` is the
four paragraphs. The third paragraph names his degree, "Mechatronics
Engineering", which is a qualification in progress and is allowed by the
content rule.

### 3. Asuka Hirai

- `id` is now `asuka-hirai`, `name` `Asuka Hirai`, `role` `Testing & Machine
  Learning`, and the summary and the one-paragraph bio are as given.
- `portrait: '/crew/asuka-hirai.jpg'`. The file is 1200×1500 RGB and is
  committed with this change. There is no `stockPortrait`.
- `pending: true` and the whole PLACEHOLDER comment are removed.
- **Links to `#asuka`:** none. I grepped `src/`, `public/` and the briefs.
  Nothing linked to the old id.
- **Something for Simon to confirm:** the brief sets `name: 'Asuka Hirai'`
  and also says "His full name is not used on the site". The name field
  renders, so "Asuka Hirai" now appears on `/`, `/team` and in the JSON-LD.
  I read the note as meaning that any longer legal name is not used, and
  applied the field as written. If it meant "show only Asuka", `name`
  should be `'Asuka'`. The id can stay as it is.

### 4. Comments and `CLAUDE.md`

- `crew.ts` header: now covers Tom only, keeping "permanent, not pending".
- **Two more comments said the same, also updated:** `team/page.tsx`'s
  header ("Tom will never have a photograph") and the empty-plate comment
  in `home.scss` ("portraits for four, and Tom, who will not have one").
- `CLAUDE.md` → Current state: Asuka is removed from the invented-copy list,
  and the portrait line is now `Tom has no portrait, permanently.`

### Verify

- `pnpm tsc --noEmit` clean · `pnpm lint` clean · `pnpm test:ci` 42 suites /
  594 tests · `pnpm build` passes, 27/27.
1. `/team`: Ronan has 4 `crew__bio` paragraphs, 16px apart, with curly
   apostrophes. Asuka has 1, and his photo loads. Tom has the empty plate.
   There are 0 `.home-pending` elements and no "[pending]" text on `/team`
   or `/`.
2. The home team row has Asuka's photo (`/crew/asuka-hirai.jpg`), the role
   "Testing & Machine Learning" and the new summary. Tom has the empty
   plate. Ronan shows "Testing & Robotics".
3. `/team` Person JSON-LD:
   `ronan-donahoe | Ronan Donahoe | Testing & Robotics` and
   `asuka-hirai | Asuka Hirai | Testing & Machine Learning`. The other three
   are unchanged.
4. `VERCEL_ENV=production pnpm build` still fails, naming only the three
   stand-ins: "Stock stand-in portraits must not ship to production: Craig
   Schneider, Simon Hanmer, Ronan Donahoe." Asuka is not listed.
5. axe-core 4.12.1 on `/` and `/team`, light and dark, after scrolling every
   reveal in: **0 violations** on all four runs.

Screenshots: `C:\tmp\crew-bios\home-team-row.png` · `team-1440-full.png`.
`team-cards.png` is a broken element capture: Playwright does not handle the
`#main` scroller. The text checks above are the evidence, not that image.

**Not committed:** an uncommitted edit to `src/constants/streams.ts` that I
did not make was already in the tree when this run started. It replaces the
"services.ts dropped engineering…" placeholder paragraph on `/robotics`. It
is left in the working tree for its author. The usual exclusions also apply:
`.claude/`, `_to_delete/` and `.env*`.

STATUS: done
