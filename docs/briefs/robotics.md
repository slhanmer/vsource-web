# Brief — robotics

**Run after `warmth` is committed.** It touches the same files (`photos.ts`,
the headline timeline).

**Repo:** `V Souce Development` · **Branch:** `development`
**Push:** `development` only. One commit.
**Read `CLAUDE.md` first.**

The Engineering stream is renamed **Robotics** (Simon, 3 November). The reason
is legal, not cosmetic. Queensland restricts "professional engineering services"
to RPEQ-registered people (Professional Engineers Act 2002), and nobody here is
registered. A stream called Engineering offers exactly that, even if no person
is ever called an engineer.

Where the brief does not match the code, stop and log it.

---

## 1. The rename

Every reference to the stream changes: id `'engineering'` → `'robotics'`, name
`Engineering` → `Robotics`, href `/engineering` → `/robotics`. At minimum:

- `streams.ts`: `id`, `name`, `href` (copy in §2)
- `siteNav.ts`: label and href
- `built.ts`: `stream` on `spider-drones` and `qut-capstones`; the `Stream` fact
  value; `markId` on `qut-capstones`; the header-comment bullet and the
  `qut-capstones` body sentence that say "Engineering has no delivered work"
  (now "Robotics has…")
- `StreamMark.tsx`: `EngineeringMark` → `RoboticsMark`, and the id check. Keep the
  drawing.
- `photos.ts`: the `streams` key. Rename the stock files
  `engineering-door.jpg` / `engineering-step.jpg` → `robotics-*`.
- `headlineTimeline.ts`: `WORDS` becomes `['Software', 'Websites', 'Robotics']`.
  Recompute the comment's arithmetic, since the longest word changes. The ≤4,500 ms
  test must still pass.
- `RotatingHeadline.tsx`: the visually-hidden sentence becomes
  `Software, websites and robotics, built to fit.` Update its header comment to
  match.
- `page.tsx` metadata title: `Software, websites and robotics — Brisbane`
- `[stream]/page.tsx` comment listing the routes.

Then grep `src/` for `engineering` / `Engineering` and list every remaining hit
in the log. The ones that should remain are the degrees in `crew.ts` and
`streams.ts` caps, and the Professional Engineers Act. Everything else should be
explained or fixed.

**Redirect:** check whether `/engineering` exists on `main`, which is the August
build and the only thing ever deployed. If it does not, which is expected, add
no redirect and say so in the log. If it does, add
`{ source: '/engineering', destination: '/robotics', permanent: true }` with a
one-line comment, as the existing three have.

---

## 2. Stream copy (`streams.ts`, the robotics entry)

Craig confirms or rewrites this today. Use it verbatim for now.

- `door`: `Machines that move, and the software that keeps them moving.`
- `problem`: `The hardware works on the bench and nowhere else.`
- `solution`: `The machine, its control loop and the software around it, built by the people who have to make it work in the field.`
- `lede`: `Robotics and automation — the mechanism, the control loop and the software, worked out together rather than handed between teams.`
- `caps`:
  1. `Computer systems and mechatronics backgrounds, with two engineering degrees in progress`
  2. `Control software for platforms that walk, roll or fly`
  3. `Sensors, embedded hardware and the code that reads them`
  4. `Systems where the software and the hardware have to agree with each other`
- `who`: `For work where the software has to drive something physical.`
- `promise`: `Machines that move, and the software that keeps them moving — built together.`
- `pageLede`: unchanged.
- `sections` → `scope` → body, second paragraph:
  `One thing constrains whatever goes in: nobody here is RPEQ-registered, and Queensland regulates who may provide "professional engineering services" under the Professional Engineers Act 2002. That is why this stream is called Robotics, and why this page describes work, not titles.`
  In the first paragraph, `what kind of engineering work` becomes `what kind of robotics work`.
- Everything else in the entry, including the `pending` flags, stays.

In the `NOTE — the word "engineer"` comment at the top of `streams.ts`, replace
`and stream 03 no longer claims the title either — it describes the work instead.`
with `and stream 03 was renamed from Engineering to Robotics in November 2026 for
the same reason: offering "engineering" is offering the regulated service.`

---

## 3. `CLAUDE.md`

- Content rules, the "Nobody here is called an engineer" bullet: replace its last
  sentence (`The Engineering stream describes *work*, never a title or a qualification.`)
  with `The same goes for the offer: the third stream is **Robotics**, not
  Engineering, because a stream called Engineering offers the regulated service.
  Do not rename it back.`
- Routes: `/engineering` → `/robotics`.
- Current state: `/engineering (Craig's)` → `/robotics (Craig's)`.
- Any other mention of the Engineering stream: update it and list it in the log.

---

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

On `next start`:

1. `/robotics` renders and `/engineering` 404s, or redirects if §1 found it on
   `main`.
2. The nav, the fold doors, the stream sections and the headline all say
   Robotics. The headline still stops on Software within 4.5 s.
3. `/sitemap.xml` has `/robotics` and not `/engineering`.
4. `/built/spider-drones` and `/built/qut-capstones` show Stream: Robotics and
   link back to `/robotics`.
5. axe on `/`, `/robotics` and `/built`, light and dark: 0 violations.

---

## The log

Append to `docs/briefs/robotics.log.md`. Last line exactly one of:
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
