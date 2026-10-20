/**
 * The current engagement, told as one long-form piece rather than a portfolio
 * grid. A grid with one entry looks thin; a detailed account of a regulated
 * device portal in progress does not.
 *
 * NAME THE CLIENT: flip `NAME_CLIENT` to true once Craig (and Aptium) have
 * signed off. Everything else on the page is written to work either way — the
 * technical detail is what persuades a technical buyer, not the logo.
 */
export const NAME_CLIENT = true

const CLIENT_NAMED = 'Aptium'
const CLIENT_ANON = 'a medical imaging manufacturer'

/** Client reference that respects the toggle. Capitalise at call sites as needed. */
export const client = NAME_CLIENT ? CLIENT_NAMED : CLIENT_ANON

/**
 * Home-page teaser. Same convention as the services: a plain, factual title so
 * a reader knows immediately what the engagement is, and a summary written from
 * their side rather than ours. Its only job is to earn the click.
 */
export const CASE_STUDY_TEASER = {
  title: NAME_CLIENT
    ? 'Aptium — TGA-regulated medical device portal'
    : 'A TGA-regulated medical device portal',
  summary:
    'When software is part of a medical device, "it works" is not enough — you have to be able to prove you knew it worked before you shipped it. That is what we are building right now, front end to hardware.',
  cta: 'Read how it is built',
}

export interface WorkSection {
  heading: string
  body: string[]
}

export const CASE_STUDY = {
  eyebrow: 'Current engagement',
  title: 'A TGA-regulated medical device portal, built from the metal up.',
  lede: `We are building the client portal, the API and the hosting for ${client}'s scanner management suite — a TGA-regulated medical device. It is in development now. This is what it involves and why we build the way we do.`,
  sections: [
    {
      heading: 'The constraint that shapes everything',
      body: [
        'A medical device of this kind is regulated by the TGA, and regulation is mostly an evidence problem. It is not enough for the software to work — you have to be able to demonstrate that it works, that you knew it worked before you shipped it, and that you would find out if it stopped.',
        'In practice that means building compliant with IEC 62304, the standard governing the software lifecycle for medical devices: how the work is planned, how it is documented, how changes are traced, and how you demonstrate any of it later.',
        'It changes how you build. Documentation is not written up afterwards; it is the artefact the auditor reads, so it has to be true at every commit. Testing is not a quality nice-to-have; it is the evidence. Version history has to survive scrutiny years later. Most studios our size cannot take this work on, and most agencies price it as if it were a compliance tax rather than an engineering discipline.',
      ],
    },
    {
      heading: 'What we are building',
      body: [
        'A multi-tenant client portal in Next.js, React and TypeScript, where clinics manage scanners, review scan results and handle their own users. Behind it, a Node API handling device communication, scan processing, document generation and notifications. Alongside it, the infrastructure the whole thing runs on.',
        'Front end, back end, infrastructure and the design system underneath all three, by the same small team. Nothing is handed over at a boundary where the context gets lost.',
      ],
    },
    {
      heading: 'We build our own tools',
      body: [
        'SAUCE is our component library — every input, table, modal and control, written by us, documented in Storybook, tested, and themed through a token system that rebrands per tenant at runtime. RAMEN is our ORM, so the data layer behaves the way our applications need rather than the way a general-purpose library assumes.',
        'We do not use Tailwind, Material UI or a bought template. Those tools optimise for getting something on screen quickly, at the cost of every product built with them looking and behaving like every other product. A medical device portal should not feel like a marketing dashboard, because the person using it is doing a different job under different pressure. Owning the kit means the interface can be designed for the industry and the application rather than assembled from someone else’s defaults.',
        'It also means no dependency roulette. When a third-party component library makes a breaking change, ships a vulnerability, or quietly abandons a package, that becomes your problem on their schedule. Ours is our own problem, on ours.',
      ],
    },
    {
      heading: 'It runs on our hardware',
      body: [
        'We host it ourselves, on our own infrastructure, rather than renting it from a hyperscaler and passing the bill on. That keeps the running cost predictable and low, keeps the data where it is supposed to be, and means when something needs looking at we can look at it rather than raise a ticket.',
        'For a client, the difference is that the cost of the software does not scale with how successful they are. There is no per-seat licence quietly compounding, and no invoice that doubles because usage grew.',
      ],
    },
    {
      heading: 'Where AI actually helps',
      body: [
        'We use AI heavily in how we build — scaffolding, refactoring, test coverage, working through unfamiliar problems faster. What it does not do is replace the judgement about what to build or the responsibility for whether it is correct. On a regulated product especially, someone has to be accountable for every line, and that is a person.',
        'The point of it is the price. Work that would previously have needed a team of eight and a year can be done properly by a handful of people in a fraction of that, which puts genuinely custom software within reach of organisations that would otherwise be stuck adapting their business to whatever off-the-shelf platform they could afford. That is the part worth caring about: not the technology, but who can now afford to have something built properly.',
      ],
    },
  ] as WorkSection[],
  status: 'In development. Ask us for a walkthrough.',
}
