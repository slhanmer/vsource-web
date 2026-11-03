# Brief — crew-bios

**Run after the queue in hand** (warmth Stage 2 → photo-balance → robotics).
**Repo:** `V Souce Development` · **Branch:** `development`
**Push:** `development` only. One commit.
**Read `CLAUDE.md` first.**

Ronan and Asuka have written their own entries (3 November). Their copy is
final. Use it verbatim, curly apostrophes included.

Where the brief does not match the code, stop and log it.

---

## 1. `bio` becomes paragraphs

`CrewMember.bio` changes from `string` to `string[]`, one entry per paragraph.
Convert every existing bio to a one-item array. `/team` (`team/page.tsx:109`)
renders one `<p>` per paragraph, spaced like the rest of the page's body copy.
Check nothing else reads `bio` as a string, including the Person JSON-LD.

## 2. Ronan Donahoe

- `role`: `Testing & Robotics`
- `summary`: unchanged
- `bio`:
  1. `Ronan tests what we build and writes the documentation that proves how it behaves. This is the kind of behind-the-scenes work that can make or break a product’s release or a compliance audit.`
  2. `He’s drawn to problems without an obvious answer, which is exactly the right instinct for the job: good testing requires someone who can look at the system from a different angle than the people who designed it.`
  3. `There is more to Ronan than just testing and documentation though. He is currently studying a double degree in Mechatronics Engineering and Computational & Applied Mathematics: hardware, software, and the maths that ties them together. He uses this range to find solutions that are practical and elegant, which usually means finding a smarter way to make something work rather than a more complicated one.`
  4. `Ronan is another V Source team member with a background in hospitality (by coincidence, not by design). While Simon’s background was in the kitchen, Ronan looked after the front of house, where staying calm under pressure and solving problems on the fly is an indispensable skill. People are unpredictable, and understanding that is invaluable.`

## 3. Asuka Hirai

- `id`: `asuka-hirai`. Grep for anything that links to `#asuka` and update it.
- `name`: `Asuka Hirai`. He goes by Asuka. His full name is not used on the site.
- `role`: `Testing & Machine Learning`
- `summary`: `Tests it until he knows why it works — computer science, with a background in machine learning.`
- `bio` (one paragraph):
  `Asuka holds a Bachelor of Information Technology, majoring in Computer Science, from QUT, with an academic background in machine learning, computer vision, and software development. At V Source, he focuses on software testing and quality assurance, identifying issues that might otherwise go unnoticed and ensuring the final product works as intended. With a particular interest in artificial intelligence and problem-solving, he brings an analytical approach to his work and a curiosity for understanding not just whether something works, but why it works — or why it doesn’t.`
- `portrait`: `/crew/asuka-hirai.jpg`. It is already in the tree: a real photo,
  1200×1500, colour, cropped by Claude. **No `stockPortrait`.**
- Remove `pending: true` and the whole `PLACEHOLDER` comment above the entry.

## 4. Comments and `CLAUDE.md`

- `crew.ts` header: the line saying Tom and Asuka will not have portraits
  becomes **Tom only**. Keep the "permanent, not pending" wording for Tom.
- `CLAUDE.md` → Current state: remove `Asuka` from the invented-copy list, and
  change `Tom and Asuka have no portrait, permanently.` to
  `Tom has no portrait, permanently.`

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

On `next start`:

1. `/team` shows Ronan’s four paragraphs and Asuka’s one, with Asuka’s photo.
   There is no `[pending]` marker anywhere on `/` or `/team`.
2. The home team row shows Asuka’s photo and the new summary. Tom shows the
   empty plate.
3. The `/team` Person JSON-LD has the new name and roles.
4. `VERCEL_ENV=production pnpm build` still fails, but only because of the
   three stock stand-ins (Craig, Simon, Ronan), not because of Asuka.
5. axe on `/` and `/team`, light and dark: 0 violations.

---

## The log

Append to `docs/briefs/crew-bios.log.md`. Last line exactly one of:
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
