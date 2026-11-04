import type { StreamId } from './streams'

/** One block on a landing page. The same block the stream pages render, kept
 *  here because landing pages stay in code (CLAUDE.md, CMS). */
export interface LandingSection {
  /** Anchor id. Explicit, so editing a title cannot silently break a link. */
  id: string
  title: string
  body: string[]
  includes?: string[]
  link?: { href: string; label: string }
  /** Invented or unverified copy. Renders a visible marker. */
  pending?: boolean
}

/**
 * The search landing pages — /regulated and /accessibility.
 *
 * Each of these used to be one section inside a stream page, which is exactly
 * why neither ranked for anything: a bullet list on /software does not compete
 * for "IEC 62304". They are now pages of their own, and the stream sections
 * they grew out of are cut down to a summary and a link, so the two do not
 * compete with each other for the same result.
 *
 * One template (components/landing/Landing.tsx) renders all of them, the same
 * way app/[stream]/ renders the three streams. Adding a third landing page is a
 * data change here plus a two-line route file, not a new page.
 */
export interface Landing {
  /** Route slug, without the leading slash. */
  slug: string
  /** The h1. A claim, not a label. */
  title: string
  /** Browser/SERP title. */
  metaTitle: string
  metaDescription: string
  /** schema.org `serviceType` on the page's Service block. */
  serviceType: string
  /** The paragraph under the h1. */
  lede: string
  sections: LandingSection[]
  /** Which stream page this belongs under, for the back-link and the CTA. */
  stream: StreamId
  /** Unverified copy. Renders a visible marker, same as everywhere else. */
  pending?: boolean
}

/**
 * The regulatory facts on /regulated were checked on 21 October 2026. Do not
 * "update" them from memory: IEC 62304:2006+A1:2015 is the current, declarable
 * edition; Edition 2 is at committee draft (the IEC lists 26 October 2028,
 * slipped from 30 April 2027); Classes A, B and C are current. A client's
 * device classification is theirs to disclose, never ours — explaining the
 * classes generically is fine, saying which one a client's product is, is not.
 *
 * The /accessibility claims were checked on 2 November 2026 against the AHRC
 * Guidelines on equal access to digital goods and services (April 2025) and
 * digital.gov.au. The DX Policy binds Commonwealth entities only; do not word
 * it as though it applies to business.
 */
export const LANDINGS: Landing[] = [
  {
    slug: 'regulated',
    stream: 'software',
    serviceType: 'Medical device software development',
    metaTitle: 'IEC 62304 and regulated software development — Australia',
    metaDescription:
      'Medical device software built to IEC 62304 in Australia, on our own hardware. Documentation, traceability and test evidence produced as the work happens, not reconstructed for an audit.',
    title: 'Software a regulator can audit, written by the people who will maintain it.',
    lede: 'We build medical device software to IEC 62304, in Australia. Regulation is mostly an evidence problem: it is not enough that the software works, you have to be able to demonstrate you knew it worked before you shipped it, and that you would find out if it stopped.',
    sections: [
      {
        id: 'evidence',
        title: 'Regulation is an evidence problem',
        body: [
          'Most teams discover this late. The code is finished, it behaves, and then somebody asks for the documentation that proves it was built the way the standard requires — and it has to be reconstructed from memory, commit messages and good intentions. Reconstructed evidence is both the most expensive kind and the least convincing.',
          'We produce it as the work happens, because that is the only point at which it is cheap and the only point at which it is true. The documentation is a deliverable with the same status as the software, not a thing written afterwards to satisfy somebody.',
        ],
        includes: [
          'Documentation maintained as a deliverable, versioned with the code',
          'Test coverage that constitutes evidence rather than reassurance',
          'A traceable change history that survives scrutiny years later',
          'Handover packs written to survive staff turnover',
        ],
      },
      {
        id: 'iec-62304',
        title: 'What IEC 62304 actually asks for',
        body: [
          'IEC 62304:2006+A1:2015 is the current edition, and it is the one you can declare conformity to. It defines a software life cycle: planning, requirements, architecture, detailed design, implementation, integration, testing, release, and then maintenance and problem resolution as processes in their own right rather than as what happens after the project ends.',
          'How much of it applies depends on the software safety class — A, B or C — which follows from what happens if the software fails. A is the lightest, C the most demanding, and the class drives how much of the standard you must satisfy rather than whether it applies at all.',
          'Edition 2 is in committee draft and is expected to replace those three classes with two process-rigour levels, along with explicit handling for machine learning and for cybersecurity in design control. The IEC currently lists it for late 2028, and it has already slipped once. Until it is published and harmonised, the 2015 edition is the one that counts — and anyone telling you otherwise this year is reading a projection rather than a standard.',
        ],
        includes: [
          'Software development planning, and keeping the plan true as it changes',
          'Requirements and architecture recorded as the design decisions they are',
          'SOUP identified, justified and monitored',
          'Problem resolution and maintenance as live processes, not a closing phase',
        ],
      },
      {
        id: 'what-we-do',
        title: 'What we do, and what we do not claim',
        body: [
          'We are currently building a TGA-regulated medical device portal — front end, API, design system and hosting. One small team does all of it, which is most of why the evidence trail holds together: there is no handover between the people who designed it and the people who maintain it, because they are the same people.',
          'What we are not is a certification body, an auditor, or your regulatory affairs function. We do not issue conformity assessments and we do not sign off on your submission. We build the software and we produce the evidence that goes with it, to the standard your product is held to, in a form the people who do sign off can actually use.',
        ],
        includes: [
          'Front end, API, database and design system, built in house',
          'Hosted on hardware we own, in Australia',
          'The people who scope the work are the people who write it',
          'WCAG 2.2 AA as a floor, including in regulated products',
        ],
      },
    ],
  },
  {
    slug: 'accessibility',
    stream: 'websites',
    serviceType: 'Web accessibility audit and remediation',
    metaTitle: 'WCAG 2.2 AA audit and remediation — Brisbane',
    metaDescription:
      'Accessibility audits that come with the fix. WCAG 2.2 AA tested against real assistive technology, by the same Brisbane team that remediates what the audit finds.',
    title: 'An audit that comes with the fix.',
    lede: 'Most accessibility work in Australia ends with a PDF. Someone audits your site, hands you a list of findings, and you are left to find a development team who can act on it — which is the expensive half, and the half nobody has quoted you for.',
    sections: [
      {
        id: 'the-pdf-problem',
        title: 'The report is not the outcome',
        body: [
          'The national accessibility firms audit. They are good at it. What they generally do not do is remediate, so the finding and the fix sit with different suppliers, and the gap between them is where accessibility work goes to die. You pay for the report, the report is accurate, and twelve months later the site still fails.',
          'We do both, in one team. That changes what the audit is for: not a document that proves you looked, but the first half of a job whose second half is already scoped. It also makes the audit better, because the people writing the findings know what it will cost to fix each one.',
        ],
        includes: [
          'Audit and remediation quoted together, by the same team',
          'Findings written as work, not as a compliance inventory',
          'Real assistive-technology testing, not an automated score',
          'Retest after remediation, so the fix is evidenced',
        ],
      },
      {
        id: 'wcag-22',
        title: 'WCAG 2.2 AA, and what Australia now expects',
        body: [
          'The Australian Human Rights Commission affirmed WCAG 2.2 Level AA as the recommended minimum benchmark in April 2025, replacing WCAG 2.0, which had stood for about a decade. If your last accessibility work was done to 2.0, the bar has moved twice since.',
          'The obligation itself is older and broader than any version number. The Disability Discrimination Act 1992 covers public-facing digital services, and the AHRC’s guidelines treat SaaS and PaaS platforms, CAPTCHAs, two-factor authentication, QR codes and biometric authentication as covered by it — each of which needs an accessible alternative rather than a note in a VPAT. Federal government services carry more again under the DTA’s Digital Experience Policy, in force since 1 January 2025.',
          'One point worth knowing before you sign anything: you can outsource the delivery of a digital service, but not the responsibility for it being accessible. That liability stays with you, which is why accessibility belongs in the contract rather than in the kick-off meeting.',
        ],
        includes: [
          'WCAG 2.2 AA as the build floor, not a finishing task',
          'Conformance measured against the hardware and software people actually use',
          'Accessibility clauses written into the contract, not assumed',
          'Documentation of what was tested and how, for when somebody asks',
        ],
      },
      {
        id: 'overlays',
        title: 'We will not sell you an overlay',
        body: [
          'Overlay widgets — the ones that promise WCAG compliance from a line of JavaScript — do not work. They cannot fix semantics they did not author, they frequently break the assistive technology they claim to help, and the accessibility community regards them as actively harmful. Several vendors have faced legal action from the users they were supposed to be serving.',
          'If an overlay would have fixed your site, your site did not have an accessibility problem. We build it properly instead, which is slower to say and cheaper to own.',
        ],
        includes: [
          'No overlay widgets, under any circumstances',
          'Semantics and keyboard support built in, not bolted on',
          'Content authors given patterns they can use without breaking it',
          'Australian hosting, on the same hardware as everything else we run',
        ],
      },
    ],
  },
]
