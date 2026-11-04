# Brief — built-trim

**Run after `robotics-content`.** Content goes through the seed, as before.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only. One commit.
**Read `CLAUDE.md` first.**

Simon's review of `/built` (4 November): too many websites, and no more line
drawings. Six of the cards are website work, and five are venues, so the page
reads like a hospitality web shop and drowns out the software and robotics
work. Four cards are line drawings. After this run, **every card has a real
image, and the page has five cards.**

Where the brief does not match the code, stop and log it.

---

## 1. Cut

- **`vsource-site` ("This site"):** remove. It is the page the visitor is
  already on, and it has no image.
- **`qut-capstones`:** remove. The QUT partner card on the home page carries
  the partnership, and the capstones are named in Project Arachnid and SAUCE.
- **The five venue entries** (`nug`, `snug`, `janes-deli`, `bar-coopers`,
  `don-gino`) are folded into one entry (§2). Their slugs 404 afterwards. They
  have never been live, so no redirects are needed.

Check that nothing else links to the removed slugs, and that the sitemap
drops them.

## 2. One entry for the venues: `brisbane-venues`

- `title`: `Five Brisbane venues`
- `client`: `Hospitality group`. If the template needs a single client name,
  log it and use this.
- `stream`: `websites` · `year`: `2026` · `status`: `live`
- `line`: `Five venue sites, each with its own brand, all edited by the people who run the room.`
- `lede`: `A pasta bar, a café and wine bar, a deli, a wood-fired bistro and a trattoria — five venues across Brisbane, each needing to look like nobody else.`
- `body`:
  1. `Each site starts from the room rather than a swatch: the palette comes from the signage, the bar and the light the menu sits in, which is why each one looks like the place rather than like a template.`
  2. `The menu changes, the hours change, and a site that needs a quote and a fortnight for either quietly goes out of date. These are edited by the people who run the venues, copy and photographs, from an admin with a preview, without a developer in the loop.`
- `media`: image `media-inbox/built/venues-montage.jpg` (1800×942), alt
  `Five venue websites side by side: Nug General Store, Snug, Jane’s Deli, Bar Cooper’s and Don Gino.`
- **New field `sites`** on `projects`: an array of `{ name, url, where, screenshot (upload) }`,
  rendered on the project page as a small grid of the five, each linking out
  (`rel="noopener"`, opens in the same tab), with its own screenshot and alt.
  Seed it from the five old entries: their `title`, `url`, the `Where` fact,
  and their existing screenshot media and alt text. Order: Nug, Snug, Jane’s
  Deli, Bar Cooper’s, Don Gino. Empty `sites` renders nothing, so other
  projects are unaffected.
- The fold door and "What changes" row for Websites keep using the Nug and Snug
  media (`robotics-content` §2b). Reuse those media documents; do not delete
  them with the old entries.

## 3. Training Professionals: real copy

Remove `placeholder`. Set:

- `status`: `live`
- `line`: `A ten-year-old training platform, rebuilt, with AI marking that runs on hardware we own.`
- `lede`: `Training Professionals had a platform that had grown for a decade. We rebuilt it, then added AI-assisted marking.`
- `body`:
  1. `We rebuilt a ten-year-old training platform from the ground up.`
  2. `On top of it sits an AI marking pipeline: student work is read with OCR and assessed by an open-weight model running on hardware we own in Australia, so it never goes to a third-party AI service. The marking shipped as an MVP and is in use.`
- `facts`:
  - `{ label: 'Stream', value: 'Software' }`
  - `{ label: 'Work', value: 'Platform rebuild' }`
  - `{ label: 'AI', value: 'OCR and marking, open-weight model' }`
  - `{ label: 'Hosting', value: 'Our own hardware, AU' }`
- `media`: image `media-inbox/built/training-professionals.jpg` (1800×859), alt
  `Two screens from the Training Professionals platform: the live assessment editor, and a marking view comparing a candidate’s answers with the answer guide.`

## 4. SAUCE: a real screenshot

Replace the stream-mark media with a **screenshot of SAUCE itself**, from this
repo's Storybook (`pnpm storybook`, or `build-storybook` and a static serve).

- Compose one frame, 1600×1000, of a handful of real components together
  (inputs, buttons, a table, a dropdown) on the site's dark theme, as a
  designed sheet rather than one bare story. A Storybook docs page or a
  purpose-made story is fine. If you add a story for it, name it
  `Showcase/Overview`.
- **Nothing in it may show Aptium branding, Aptium data, or anything medical.**
  Check every visible string.
- Save it to `media-inbox/built/sauce.jpg`, seed it, alt
  `A sheet of SAUCE components — inputs, buttons, a table and a dropdown — on a dark theme.`

## 5. Aptium: the logo, not a drawing

Aptium's screens stay under NDA, so the card shows **Aptium's logo**: the
existing `aptium.png` media from the partners, centred on a light raised plate
with generous padding, the same treatment as the partner cards on the home
page. Fill the card's media box at its normal aspect ratio, so the card is the
same size as the others. Alt: `Aptium logo`. Keep the NDA note out of the alt;
if the page needs to say it, it says it in the body.

Make "logo on a plate" a proper media kind (`kind: 'logo'`, using the upload
and a plate), not a one-off, so another client under NDA can use it later.

## 6. Order and layout

Order: Project Arachnid (featured), the Aptium portal, Training Professionals,
SAUCE, Five Brisbane venues.

That is the lead card plus four. **No orphan on the last row** (the same rule as
the team grid in `CLAUDE.md`): at widths where the grid would be three columns,
use two for these four. Check at 1440, 1024 and 390.

`StreamMark` must no longer appear anywhere on `/built` or project pages. If a
`mark` media kind is now unused, leave the type in place, but log that nothing
uses it.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. `/built` shows five cards, each with a photograph, screenshot or video. No
   line drawings, no `[placeholder]` markers except where the log explains one.
2. `/built/brisbane-venues` lists the five sites, each linking to its live URL
   (all five return 200).
3. The removed slugs 404 and are not in the sitemap.
4. The SAUCE screenshot contains no Aptium or medical content. List every
   string visible in it in the log.
5. `pnpm seed` twice: the second run changes nothing.
6. axe on `/built` and every project page, light and dark: 0 violations.

Screenshots go to `C:\tmp\built-trim\`.

## The log

Append to `docs/briefs/built-trim.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
