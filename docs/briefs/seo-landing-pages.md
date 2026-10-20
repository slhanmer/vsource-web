# Brief — the two SEO landing pages

**Repo:** `V-Source` · **Branch:** `development` (already exists, HEAD `3d645d7`)
**Push:** `development` only, at the end of each stage.
**Read `CLAUDE.md` first.** Everything in it applies.

These are the two pages the SEO strategy calls "the whole strategy": `/regulated`
and `/accessibility`. They exist as bullets inside the stream pages today, which
is exactly why they rank for nothing.

**All copy below is final and written to be used verbatim.** Nothing here is for
you to invent, improve or paraphrase. If something does not fit the code, stop
and log it — do not work around it. Three runs of the last brief were lost to a
brief that did not match the code, and that was the brief's fault, not the
agent's.

---

## Before anything: the regulatory facts, and why they are what they are

These were checked on 21 October 2026. **Do not "update" them from memory.**

- **The current, declarable edition is `IEC 62304:2006+A1:2015`.** Conformity can
  only be declared to a published edition.
- **Edition 2 is NOT published.** It is at committee draft. The IEC currently
  lists **26 October 2028**, having slipped from 30 April 2027. At least one
  widely-cited article claims it published in August 2026 — that was a
  projection and it did not happen.
- **Software safety Classes A, B and C are current** and will be for years.
  Edition 2 is expected to collapse them into two process-rigour levels, but
  that is not in force.
- **Never state a client's device classification.** That is theirs to disclose,
  not ours. Explaining the standard's classes generically is fine; saying which
  one Aptium's product is, is not. See the content rules in `CLAUDE.md`.
- **Accessibility:** the AHRC affirmed **WCAG 2.2 Level AA** as the recommended
  minimum in **April 2025**, replacing WCAG 2.0 after about a decade. The DDA
  1992 obligations extend to SaaS and PaaS platforms, CAPTCHAs, two-factor
  authentication, QR codes and biometric authentication. The DTA's Digital
  Experience Policy took effect **1 January 2025** and applies to government.

The accessibility figures above come from a vendor summary of AHRC and DTA
material. **Mark the whole `/accessibility` page `pending: true`** (see 1.2) so
Simon can check them against the primary sources before it ships.

---

## Stage 1 — the plumbing

### 1.1 Routes

Two top-level static routes. They take precedence over the root-level dynamic
`[stream]` segment, which has `dynamicParams = false` and only generates
`software`, `websites` and `engineering` — so these cannot collide. **Verify
that in the build output rather than assuming it.**

```
src/app/regulated/page.tsx
src/app/accessibility/page.tsx
```

Each is a thin route file. The page itself is one shared component, the same
way `[stream]` is one template for three streams — adding a third landing page
should be a data change, not a new page.

```
src/constants/landings.ts          ← the content
src/components/landing/Landing.tsx ← the template
```

### 1.2 The data shape

`landings.ts` exports `LANDINGS: Landing[]`. Reuse the existing
`StreamSection` interface from `streams.ts` for `sections` — do not define a
second one.

```ts
export interface Landing {
  /** Route slug, without the leading slash. */
  slug: string
  /** The h1. A claim, not a label. */
  title: string
  /** Browser/SERP title. */
  metaTitle: string
  metaDescription: string
  /** The paragraph under the h1. */
  lede: string
  sections: StreamSection[]
  /** Which stream page this belongs under, for the back-link and the CTA. */
  stream: Stream['id']
  /** Unverified copy. Renders a visible marker, same as everywhere else. */
  pending?: boolean
}
```

### 1.3 Styling

**Reuse `src/app/styles/stream.scss` as-is.** These pages are documents, the
same as the stream pages, and they should look identical — a landing page that
looks different from the rest of the site reads as a landing page. Import it in
the shared component and use `.stream__*` classes. Add no new SCSS file.

If something genuinely does not exist in `stream.scss`, log it rather than
inventing a class.

### 1.4 Metadata, per page

- `title` from `metaTitle`, `description` from `metaDescription`
- `alternates.canonical` — `/regulated`, `/accessibility`
- `openGraph` with `url`, `title`, `description`. The root `og.png` is inherited;
  do not generate a new image.

### 1.5 JSON-LD, per page

Two blocks, following the pattern already in `src/app/[stream]/page.tsx`:

- **`Service`** — `provider: { '@id': 'https://www.vsource.dev/#organisation' }`,
  `serviceType`, `areaServed: 'AU'`, `name` and `description` from the page.
  **`areaServed` is `'AU'` for both of these, not Brisbane.** Buyers looking for
  regulated or specialist capability search nationally; proximity stops
  mattering. That is a deliberate call from the SEO strategy.
- **`BreadcrumbList`** — Home → the parent stream → this page.

### 1.6 Sitemap

`src/app/sitemap.ts` generates from `STREAMS` and `BUILT`. **Add `LANDINGS`**, so
it keeps staying true on its own. Do not hand-add two URLs.

### 1.7 The links in

Three, and they matter more than the pages:

1. **`/software`** — in `streams.ts`, the `regulated` section. Trim its `body`
   to the two sentences given in 2.3 and add the link. Right now that section
   and the new page would compete for the same search result, which is the
   thing `STREAM_COMMON` exists to prevent.
2. **`/websites`** — same, for the `accessibility` section. Copy in 2.3.
3. **`/built/aptium-portal`** — add `IEC 62304` to its `facts` and link the
   project page's stream line to `/regulated`. **Log this one rather than doing
   it if it needs more than adding a fact row** — that entry is still
   `placeholder: true` and its copy is Craig's.

---

## Stage 2 — the copy

Verbatim. Typographic apostrophes and em dashes, matching the rest of the file.

### 2.1 `/regulated`

```
slug: 'regulated'
stream: 'software'

metaTitle: 'IEC 62304 and regulated software development — Australia'

metaDescription: 'Medical device software built to IEC 62304 in Australia, on
our own hardware. Documentation, traceability and test evidence produced as the
work happens, not reconstructed for an audit.'

title: 'Software a regulator can audit, written by the people who will maintain it.'

lede: 'We build medical device software to IEC 62304, in Australia. Regulation
is mostly an evidence problem: it is not enough that the software works, you
have to be able to demonstrate you knew it worked before you shipped it, and
that you would find out if it stopped.'
```

**Section 1** — `id: 'evidence'`, title **"Regulation is an evidence problem"**

> Most teams discover this late. The code is finished, it behaves, and then
> somebody asks for the documentation that proves it was built the way the
> standard requires — and it has to be reconstructed from memory, commit
> messages and good intentions. Reconstructed evidence is both the most
> expensive kind and the least convincing.
>
> We produce it as the work happens, because that is the only point at which it
> is cheap and the only point at which it is true. The documentation is a
> deliverable with the same status as the software, not a thing written
> afterwards to satisfy somebody.

`includes`:
- Documentation maintained as a deliverable, versioned with the code
- Test coverage that constitutes evidence rather than reassurance
- A traceable change history that survives scrutiny years later
- Handover packs written to survive staff turnover

**Section 2** — `id: 'iec-62304'`, title **"What IEC 62304 actually asks for"**

> `IEC 62304:2006+A1:2015` is the current edition, and it is the one you can
> declare conformity to. It defines a software life cycle: planning,
> requirements, architecture, detailed design, implementation, integration,
> testing, release, and then maintenance and problem resolution as processes in
> their own right rather than as what happens after the project ends.
>
> How much of it applies depends on the software safety class — A, B or C —
> which follows from what happens if the software fails. A is the lightest, C
> the most demanding, and the class drives how much of the standard you must
> satisfy rather than whether it applies at all.
>
> Edition 2 is in committee draft and is expected to replace those three classes
> with two process-rigour levels, along with explicit handling for machine
> learning and for cybersecurity in design control. The IEC currently lists it
> for late 2028, and it has already slipped once. Until it is published and
> harmonised, the 2015 edition is the one that counts — and anyone telling you
> otherwise this year is reading a projection rather than a standard.

`includes`:
- Software development planning, and keeping the plan true as it changes
- Requirements and architecture recorded as the design decisions they are
- SOUP identified, justified and monitored
- Problem resolution and maintenance as live processes, not a closing phase

**Section 3** — `id: 'what-we-do'`, title **"What we do, and what we do not claim"**

> We are currently building a TGA-regulated medical device portal — front end,
> API, design system and hosting. One small team does all of it, which is most
> of why the evidence trail holds together: there is no handover between the
> people who designed it and the people who maintain it, because they are the
> same people.
>
> What we are not is a certification body, an auditor, or your regulatory
> affairs function. We do not issue conformity assessments and we do not sign
> off on your submission. We build the software and we produce the evidence
> that goes with it, to the standard your product is held to, in a form the
> people who do sign off can actually use.

`includes`:
- Front end, API, database and design system, built in house
- Hosted on hardware we own, in Australia
- The people who scope the work are the people who write it
- WCAG 2.2 AA as a floor, including in regulated products

### 2.2 `/accessibility`

**Set `pending: true` on this one.** The Australian regulatory dates come from a
secondary source and Simon wants them checked against AHRC and DTA primaries
before this ships.

```
slug: 'accessibility'
stream: 'websites'

metaTitle: 'WCAG 2.2 AA audit and remediation — Brisbane'

metaDescription: 'Accessibility audits that come with the fix. WCAG 2.2 AA
tested against real assistive technology, by the same Brisbane team that
remediates what the audit finds.'

title: 'An audit that comes with the fix.'

lede: 'Most accessibility work in Australia ends with a PDF. Someone audits your
site, hands you a list of findings, and you are left to find a development team
who can act on it — which is the expensive half, and the half nobody has
quoted you for.'
```

**Section 1** — `id: 'the-pdf-problem'`, title **"The report is not the outcome"**

> The national accessibility firms audit. They are good at it. What they
> generally do not do is remediate, so the finding and the fix sit with
> different suppliers, and the gap between them is where accessibility work
> goes to die. You pay for the report, the report is accurate, and twelve
> months later the site still fails.
>
> We do both, in one team. That changes what the audit is for: not a document
> that proves you looked, but the first half of a job whose second half is
> already scoped. It also makes the audit better, because the people writing
> the findings know what it will cost to fix each one.

`includes`:
- Audit and remediation quoted together, by the same team
- Findings written as work, not as a compliance inventory
- Real assistive-technology testing, not an automated score
- Retest after remediation, so the fix is evidenced

**Section 2** — `id: 'wcag-22'`, title **"WCAG 2.2 AA, and what Australia now expects"**

> The Australian Human Rights Commission affirmed **WCAG 2.2 Level AA** as the
> recommended minimum benchmark in April 2025, replacing WCAG 2.0, which had
> stood for about a decade. If your last accessibility work was done to 2.0,
> the bar has moved twice since.
>
> The obligation itself is older and broader than any version number. The
> Disability Discrimination Act 1992 covers public-facing digital services, and
> AHRC guidance extends that to SaaS and PaaS platforms, CAPTCHAs, two-factor
> authentication, QR codes and biometric authentication — each of which needs an
> accessible alternative rather than a note in a VPAT. Federal government
> services carry more again under the DTA's Digital Experience Policy, in force
> since 1 January 2025.
>
> One point worth knowing before you sign anything: you can outsource the
> delivery of a digital service, but not the responsibility for it being
> accessible. That liability stays with you, which is why accessibility belongs
> in the contract rather than in the kick-off meeting.

`includes`:
- WCAG 2.2 AA as the build floor, not a finishing task
- Conformance measured against the hardware and software people actually use
- Accessibility clauses written into the contract, not assumed
- Documentation of what was tested and how, for when somebody asks

**Section 3** — `id: 'overlays'`, title **"We will not sell you an overlay"**

> Overlay widgets — the ones that promise WCAG compliance from a line of
> JavaScript — do not work. They cannot fix semantics they did not author, they
> frequently break the assistive technology they claim to help, and the
> accessibility community regards them as actively harmful. Several vendors have
> faced legal action from the users they were supposed to be serving.
>
> If an overlay would have fixed your site, your site did not have an
> accessibility problem. We build it properly instead, which is slower to say
> and cheaper to own.

`includes`:
- No overlay widgets, under any circumstances
- Semantics and keyboard support built in, not bolted on
- Content authors given patterns they can use without breaking it
- Australian hosting, on the same hardware as everything else we run

### 2.3 The two trimmed stream sections

In `src/constants/streams.ts`, **replace the `body` arrays** of these sections.
Keep their `includes` lists as they are.

`software` → section `regulated`:

> We build medical device software to IEC 62304, and regulation is mostly an
> evidence problem: it is not enough that the software works, you have to be
> able to demonstrate you knew it worked before you shipped it.
>
> There is a longer piece on how we do that, and on what the standard actually
> requires — see [what regulated work involves](/regulated).

`websites` → section `accessibility`:

> WCAG 2.2 AA is the level most Australian organisations are now expected to
> meet, and it covers considerably more than people expect. We build to it from
> the start, because retrofitting costs several times what designing for it does.
>
> The national firms audit but do not remediate. We do both — see
> [audits that come with the fix](/accessibility).

Render the links as real `<Link>` elements, not literal markdown. If the
section body renderer does not support inline links today, **stop and log it**
rather than changing the renderer on your own initiative.

---

## Verify

```bash
pnpm tsc --noEmit    # expect only the two known ui-kit test errors
pnpm lint
pnpm build
```

Then on `pnpm dev` — **note that port 3000 may be held by another project's dev
server, as it was in Run 4; use a free port and say which in the log:**

1. `/regulated` and `/accessibility` both render, with one `h1` each.
2. `/software`, `/websites` and `/engineering` still render — the new static
   routes have not shadowed the dynamic segment.
3. `/accessibility` shows the `[pending]` marker; `/regulated` does not.
4. The links from `/software` and `/websites` resolve.
5. `/sitemap.xml` contains both new URLs.
6. View source on each: the `Service` and `BreadcrumbList` JSON-LD are present,
   and `areaServed` is `AU`.
7. **The copy is in the HTML of the first response**, not painted in by
   JavaScript. This is the entire point of both pages — AI crawlers largely do
   not execute JS. Check with `curl -s <url> | grep -c "evidence problem"`
   rather than by eye in devtools.

Commit as two commits — plumbing, then copy — and push to `development`.

---

## The log

Append **Run 1** to `docs/briefs/seo-landing-pages.log.md`, same format as
`built-websites.log.md`: what passed, every error verbatim, what you fixed,
what you logged instead of fixing, the commit SHAs, what you saw on each check,
and anything wrong with this brief.

Last line exactly one of: `STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
