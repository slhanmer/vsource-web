# Brief — built-copy

**Repo:** `V Souce Development` · **Branch:** `development` (HEAD `091c5ef`)
**Push:** `development` only. One commit for the code, plus a separate commit for
`docs/briefs/launch-polish.{md,log.md}` and this brief with its log.
**Read `CLAUDE.md` first.**

Real copy for `/built`, approved by Simon on 3 November. **All copy is final.
Use it verbatim** (curly apostrophes as written). Where the brief does not match
the code, stop and log it.

**Still invented after this run, deliberately:** `spider-drones`,
`training-professionals`, `qut-capstones`, the two partner entries, the
engineering proof, and Asuka. They are Craig's or Asuka's to write. Leave their
flags alone.

---

## 1. Remove two entries from `BUILT`

- **`simon-hanmer-studio`**: delete it. Simon does not want it credited here.
- **`youhire`**: delete it. It has been renamed CurbHire and goes in the Coming
  rail (§3).

Neither URL has ever been deployed, so no redirects are needed. Check that
nothing else links to either slug, and that the sitemap drops both.

---

## 2. Rewrite eight entries

In each entry below, set the listed fields exactly as given, then **remove
`placeholder: true`**. Any field not listed stays as it is. `body` replaces the
whole array.

### `aptium-portal`

- `status`: `'building'`
- `line`: `Front end, API, design system and hosting for a regulated device, built to IEC 62304.`
- `lede`: `A clinic-facing portal for a TGA-regulated medical device, built by one small team from the interface down to the hardware it runs on.`
- `body`:
  1. `Clinics use it to manage their scanners, review results and run their own users. Behind it sits an API that handles device communication, scan processing, document generation and notifications, and under both sits infrastructure we own and operate. The same people built every layer, so nothing was handed across a boundary where the reasoning got lost.`
  2. `Because the software is part of a regulated device, the evidence matters as much as the code. It is built to IEC 62304: documentation versioned with the code and true at every commit, tests that stand as evidence rather than reassurance, and a change history that will survive an audit years from now.`
  3. `There are no screenshots here, and there will not be. Aptium can be named; what is on its screens cannot be shown.`

### `sauce`

- `line`: `Our own component library, and the reason nothing on this page looks like a template.`
- `lede`: `SAUCE is the component library our interfaces are built from — written by us, documented, tested, and themed through tokens.`
- `body`:
  1. `Every input, table, modal and control in it is ours, documented in Storybook and covered by tests. A token system sits underneath, so one set of components can carry a different brand per client, or per tenant at runtime, without being forked.`
  2. `We built it instead of reaching for Tailwind, Material UI or a bought template because those optimise for getting something on screen fast, and the cost is that everything built with them looks and behaves alike. A tool for a clinic should not feel like a marketing dashboard. Owning the kit also means a breaking change, a vulnerability or an abandoned package is our problem on our schedule, not someone else’s on theirs.`
- `facts`:
  - `{ label: 'Stream', value: 'Software' }`
  - `{ label: 'Kind', value: 'Our own tooling' }`
  - `{ label: 'Theming', value: 'Tokens, per tenant at runtime' }`
  - `{ label: 'Documented', value: 'Storybook' }`

### `vsource-site`

- `lede`: `The site you are on. No theme, no page builder, no template — our own components on Next.js.`
- `body`:
  1. `A web shop whose own site is a template has already answered the question, so this one is ours from the components up. Every word of it is in the HTML before any JavaScript runs, which is what search engines and AI crawlers actually read.`
  2. `It is held to WCAG 2.2 AA and tested on every route in both light and dark themes, with a pause control on anything that moves and a keyboard path through everything that scrolls. That is the standard the Websites stream sells, so it is the standard this site has to meet first.`
- `facts`:
  - `{ label: 'Stream', value: 'Websites' }`
  - `{ label: 'Built with', value: 'SAUCE, in house' }`
  - `{ label: 'Accessibility', value: 'WCAG 2.2 AA' }`
  - `{ label: 'Framework', value: 'Next.js' }`

### `nug`

- `title` and `client`: `Nug General Store`
- In the media `alt`, change only `The NUG. site:` to `The Nug General Store site:`. The rest of the alt describes the screenshot and stays.
- `body`:
  1. `The menu changes and the hours change, and a site that needs a quote and a fortnight for either quietly goes out of date. This one is edited by the people who run the room — copy and photographs, from an admin with a preview — without a developer in the loop.`
  2. `The design comes out of the room itself: the cream of the menu card, the sage panel, and the line about who does what, because at a place this size the people are the brand.`

### `snug`

- `lede`: `One of three Coorparoo sites we built side by side, each with its own brand and each needing to look like nobody else.`
- `body`:
  1. `The palette comes out of the room rather than off a swatch: olive from the bar, cream from the light the menu sits in, and a photograph of the room at night doing most of the talking.`
  2. `Snug is busy and does not take daytime bookings, so the site leads with what it is and when it is open, and puts booking where it applies — dinner — rather than in front of everyone.`

### `janes-deli`

- `body`:
  1. `The light one of the three. The colour is taken from the signage and the tags rather than described, which is why it looks like the shop.`
  2. `The menu is said in three words before anything else loads — brunch, sandwiches, filter and matcha — with the hours directly under it, because that is what most people opening the site want to know.`

### `bar-coopers`

- `body`:
  1. `One colour, the brick of the oven, used for the booking button and the rule over each menu section, and nothing else competing with it.`
  2. `The oven is the reason for the room, so it is the first photograph, and it sits beside the name rather than underneath it.`

### `don-gino`

- `lede`: `An Italian trattoria on Hardgrave Rd in West End, named for the owner’s father.`
- `body`:
  1. `An earlier draft was built from a verbal description and looked like nobody in particular. This one is sampled off the shopfront — the black fascia, the gold script — because that is what a stranger walks past on Hardgrave Rd.`
  2. `His story comes before the menu, because it is the reason the place exists.`

---

## 3. CurbHire in the Coming rail

`COMING_SOON` becomes, in this order:

```ts
{ name: 'CurbHire', stream: 'software' },
{ name: 'Remy', stream: 'software' },
{ name: 'Paw Connect', stream: 'software' },
```

---

## 4. Stream proof lines (`streams.ts`)

- Software `proof.body`:
  `A TGA-regulated medical device portal for Aptium — front end, API, design system and hosting, built to IEC 62304. Training Professionals, and CurbHire starting now.`
- Websites `proof.body`:
  `This site, and five hospitality sites across Brisbane, all on the Built page. Each one built the way yours would be.`
  and remove `pending: true` from the Websites proof.

---

## 5. Header comment in `built.ts`

The opening comment still says every entry carries `placeholder: true`. Replace
its first paragraph (`⚠ THE NAMES ARE REAL; THE WORDS ARE NOT.` … `the marker
goes with it.`) with:

```
 * ⚠ THREE ENTRIES ARE STILL INVENTED: spider-drones, training-professionals and
 * qut-capstones carry `placeholder: true` and render a marker. They are Craig's
 * to write. Everything else was approved by Simon on 3 November 2026.
```

Leave the rest of the comment.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

Then, on `next start`:

1. `/built` shows 11 cards. Exactly three carry `[placeholder]`: spider-drones,
   training-professionals and qut-capstones.
2. The Coming rail reads CurbHire, Remy, Paw Connect.
3. `/built/youhire` and `/built/simon-hanmer-studio` return 404, and neither is
   in `/sitemap.xml`.
4. `/websites` shows no `[pending]` marker on its proof line.
5. Grep the rendered HTML of every route for `YouHire`, `NUG.` and
   `Placeholder` (case-sensitive). List every hit with its route. The only
   `Placeholder` hits should come from the three entries named above and from
   `/engineering`.
6. axe on `/built` and every project page, light and dark: 0 violations.

---

## The log

Append to `docs/briefs/built-copy.log.md`, in the same format as before. Last
line exactly one of: `STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
