/**
 * What we sell.
 *
 * Titles stay plain and searchable — a buyer looking for "custom software"
 * needs to see those words. Summaries are written from the reader's side: the
 * situation they recognise, not the capability we have. That split is the
 * whole convention here, so keep it when adding a service.
 *
 * Order is deliberate: the two things people arrive wanting (software,
 * hosting) come first, the differentiator (regulated work) next, and support
 * last because it is the one nobody asks about until it is too late.
 *
 * Engineering was dropped: no paid non-software engineering work to point at
 * yet, and a vague claim is worse than an honest gap. The engineering
 * background does real work inside the regulated and custom-software copy
 * instead, where it is evidenced rather than asserted.
 */
export interface Service {
  /** Anchor id. Explicit, so editing a title cannot silently break inbound links. */
  id: string
  /** Short label, used as the heading. */
  title: string
  /** One line under the heading. */
  summary: string
  /** Body paragraphs. */
  body: string[]
  /** Concrete deliverables — what a client actually receives. */
  includes: string[]
}

export const SERVICES: Service[] = [
  {
    id: 'custom-software',
    title: 'Custom software',
    summary:
      'The thing your business actually does, instead of the nearest platform that almost does it.',
    body: [
      'We build the thing your business actually needs, rather than reshaping how you work to fit a platform that almost does it. Next.js, React and TypeScript on the front, Node and MySQL behind it, and a design system built for your industry instead of assembled from a component shop.',
      'Most software work fails at the boundaries — between front end and back end, between build and handover, between the people who designed it and the people who maintain it. We do not have those boundaries, because the same small team does all of it.',
    ],
    includes: [
      'Discovery and scoping, priced before we start',
      'Front end, API and database',
      'A design system specific to your product',
      'Documentation written as we build, not afterwards',
    ],
  },
  {
    id: 'design',
    title: 'Design and accessibility',
    summary:
      'Software people can actually use, meeting standards most organisations do not know they are held to.',
    body: [
      'Design is a separate discipline from building, and on most projects it quietly gets absorbed into the build. We design the thing before we build it — how it is laid out, what happens in what order, and what someone sees at the moment it goes wrong. That work is usually the difference between software people tolerate and software they trust.',
      'Accessibility is part of the same job, not a box at the end. WCAG 2.2 AA is the level most organisations are expected to meet, and it covers considerably more than people expect. We build to it as a minimum, from the start, because retrofitting accessibility afterwards costs several times what designing for it does.',
      'We do the visual side too — identity, design systems, the way the thing actually looks. A product that works well but looks unconsidered still gets judged on the second one, and for a small company the software is often the most public thing they own.',
    ],
    includes: [
      'Interaction and interface design before code',
      'WCAG 2.2 AA as a minimum, built in from the start',
      'A design system specific to your product',
      'Brand and visual identity where you need it',
    ],
  },
  {
    id: 'hosting',
    title: 'Hosting on our own hardware',
    summary:
      'Australian-hosted, on hardware we own, with no cloud bill that grows every time you do.',
    body: [
      'We own the metal rather than renting it from a hyperscaler. That keeps running costs low and predictable, keeps your data in Australia, and means when something needs looking at, the people looking at it already know your product.',
      'The practical difference is that your costs do not scale with your success. No per-seat licence quietly compounding, no invoice that doubles because you grew.',
    ],
    includes: [
      'Deployment, monitoring and backups',
      'Australian-hosted, no offshore data movement',
      'Predictable monthly cost, not usage-metered',
      'Staging environments as standard',
    ],
  },
  {
    id: 'regulated',
    title: 'Regulated and safety-critical work',
    summary: 'When an auditor asks how you know it works, there is an answer.',
    body: [
      'We are currently building a TGA-regulated medical device portal for Aptium. Regulation is mostly an evidence problem: it is not enough that the software works, you have to be able to demonstrate you knew it worked before you shipped, and that you would find out if it stopped.',
      'That means documentation the auditor can read, testing that constitutes evidence rather than reassurance, and a version history that survives scrutiny years later. We work compliant with whichever standard your product is held to, and we have someone whose whole job is that discipline.',
    ],
    includes: [
      'Documentation maintained as a deliverable',
      'Test coverage as audit evidence',
      'Traceable change history',
      'Handover packs that survive staff turnover',
    ],
  },
  {
    id: 'ongoing-support',
    title: 'Ongoing support',
    summary: 'Still here in three years, when it needs to change.',
    body: [
      'Software is not finished when it launches; it is finished when it is switched off. We keep maintaining, patching and extending what we build, and because we own the stack top to bottom there is no third party to wait on when something needs fixing.',
      'If you have inherited something built by someone else and it needs looking after, we will take a look and tell you honestly whether it is worth keeping.',
    ],
    includes: [
      'Maintenance and security patching',
      'Feature work at an agreed rate',
      'A named person who knows your system',
      'Honest advice on inherited codebases',
    ],
  },
]

/**
 * The argument that ties the services together — kept separate because it is
 * positioning, not a product.
 */
export const APPROACH = {
  heading: 'Why we can do this at the price we do',
  body: [
    'We build our own tools. SAUCE is our component library and RAMEN is our ORM — both written by us, both maintained by us. We do not use Tailwind, Material UI or a bought template, because those optimise for getting something on screen fast at the cost of every product looking and behaving like every other product. Owning the stack means the interface can be designed for your industry and your users, and it means a third party cannot break your product on their release schedule.',
    'We use AI heavily in how we build — scaffolding, refactoring, test coverage, moving through unfamiliar problems faster. It does not make the decisions and it does not carry the accountability; a person does, particularly on regulated work. What it changes is the arithmetic. Work that used to need a team of eight for a year gets done properly by three in a fraction of that.',
    'That is the whole point. Genuinely custom software has been priced out of reach for most organisations, which is why so many end up bending their operation around an off-the-shelf platform that nearly fits. It does not have to be that way any more.',
  ],
}
