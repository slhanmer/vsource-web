/**
 * The three streams.
 *
 * As of Craig's meeting on 24 September the business presents as three lines of
 * work rather than one. They are peers on the home page, held together by the
 * thing they share — one small team, our own tools, our own hardware — rather
 * than by being the same kind of job.
 *
 * `problem` and `solution` are what the home page is built from now. The page
 * shows one move per stream, left to right: the situation someone is in, then
 * what they have instead once we are done. Both are written generic on purpose
 * — the home page is there to make someone recognise themselves, not to prove
 * anything. The proof belongs on the stream pages, which is where `lede`,
 * `caps`, `who` and `proof` are headed; nothing renders them today.
 *
 * The numbers are gone. 01/02/03 were on the doors, on the bands and stamped in
 * the margin — three numberings of the same three things on one screen, and
 * nothing anywhere referred to one of them.
 *
 * `href` is the stream's own route. Nothing else hardcodes a destination, so
 * moving a stream is one edit here.
 *
 * The stream pages are driven entirely from this file by one template
 * (app/[stream]/page.tsx). `promise`, `pageLede` and `sections` are the page;
 * `caps`, `who` and `proof` sit alongside it. Adding a fourth stream is a data
 * change, not a page.
 *
 * DUPLICATE CONTENT — deliberate design. Hosting and ongoing support are the
 * same offer whichever stream you arrive through, so they are NOT repeated as
 * paragraphs on three pages (three near-identical pages is how a site competes
 * with itself). They are one short shared list, STREAM_COMMON, rendered on all
 * three. Everything in `sections` is specific to its stream.
 *
 * NOTE — the word "engineer". Craig and Ronan are part-way through engineering
 * degrees; Simon holds computer science; Tom a diploma plus eight years. Nobody
 * here is RPEQ-registered, and Queensland regulates who may provide
 * "professional engineering services" (Professional Engineers Act 2002, BPEQ).
 * So nothing on this site calls anyone a qualified engineer, and stream 03 no
 * longer claims the title either — it describes the work instead. Revisit the
 * wording when Craig and Ronan finish, not before. The scope of what that
 * stream actually sells is still Craig's to define; this copy is mine and
 * unverified.
 */
/** The streams, as a closed set. A union rather than `string` so anything
 *  keyed by stream — the home page photographs in photos.ts — fails the type
 *  check when a stream is added without its entry. */
export type StreamId = 'software' | 'websites' | 'engineering'

export interface Stream {
  /** Anchor id, also used for the row id and the nav link. */
  id: StreamId
  /** Plain, searchable name. */
  name: string
  /** One short line for the door in the hero. Deliberately NOT the same
   *  sentence as anything below — the door and the row sit on the same page,
   *  and repeating a sentence verbatim a screen apart is most of what makes a
   *  page feel busy. The door says what it is; the row says what it changes. */
  door: string
  /** Where someone is before they call. This is set at headline size with
   *  nothing around it, so it has to be one short sentence — long enough to be
   *  specific, short enough to read as a statement rather than a paragraph.
   *  Written as a situation they would recognise, never as a failing: nobody
   *  buys from a page that opens by telling them they got it wrong. */
  problem: string
  /** What they have instead. One sentence, no capability list. */
  solution: string
  /** ── for the stream pages, not rendered on the home page ─────────────── */
  /** One line: the situation, not the capability. */
  lede: string
  /** Concrete capabilities — what a client actually gets. */
  caps: string[]
  /** Who this stream is for. */
  who: string
  /** Proof. Label plus body; `pending` marks copy that is not ours yet. */
  proof: { label: string; body: string; pending?: boolean }
  /** What it costs, said on the page rather than hidden behind a form.
   *  Software and Engineering cannot be priced before they are scoped, and
   *  saying so plainly is more useful than "contact us for pricing". */
  pricing: { value: string; note: string }
  /** The h1 on the stream's own page. A promise, not a label. */
  promise: string
  /** The paragraph under it. */
  pageLede: string
  /** The body of the stream page. Specific to this stream — anything true of
   *  all three belongs in STREAM_COMMON instead. */
  sections: StreamSection[]
  /** Destination. */
  href: string
}

/** One block on a stream page. */
export interface StreamSection {
  /** Anchor id. Explicit, so editing a title cannot silently break a link. */
  id: string
  title: string
  body: string[]
  /** Concrete deliverables. Optional — not every section has a list. */
  includes?: string[]
  /** An onward link, rendered after the last paragraph.
   *
   *  `body` entries are plain strings and the template renders them as text, so
   *  a link cannot be written inline without either a markup renderer or markdown
   *  leaking onto the page. This is the smaller answer: one optional link per
   *  section, which is all any of them need.
   *
   *  It exists so a section can hand off to the page that covers the subject
   *  properly instead of competing with it — same reasoning as STREAM_COMMON. */
  link?: { href: string; label: string }
  /** Invented or unverified copy. Renders a visible marker. */
  pending?: boolean
}

/**
 * True of all three streams, so it is written once and shown on each.
 *
 * Short by design: a shared *list* on three pages is a fact stated three times,
 * which is fine. Shared *paragraphs* on three pages are three pages competing
 * for the same search result, which is not.
 */
export const STREAM_COMMON = {
  heading: 'Whichever one you arrive through',
  items: [
    'Hosted on hardware we own, in Australia, with no licence fee that grows every year',
    'The people who scope the work are the people who write it — there is no account manager',
    'Maintained and extended after launch, by the person who already knows your system',
    'Documentation written as we build rather than reconstructed afterwards',
  ],
}

export const STREAMS: Stream[] = [
  {
    id: 'software',
    name: 'Software',
    door: 'Systems built to your process, not someone else’s platform.',
    problem: 'Your process lives in a spreadsheet and three people’s heads.',
    solution:
      'One system that follows the process you actually use, and can show what happened when someone asks.',
    lede: 'The thing your business actually does — not the nearest platform that almost does it.',
    caps: [
      'Business systems, portals and internal tools, built to your process rather than around someone else’s',
      'Regulated work with the evidence to prove it: IEC 62304 for medical device software',
      'WCAG 2.2 AA accessibility as a floor, not an afterthought',
      'Hosted on hardware we own, in Australia, with no licence fee that grows every year',
    ],
    who: 'For organisations whose work does not fit a platform.',
    proof: {
      label: 'Current work',
      body: 'A TGA-regulated medical device portal for Aptium — front end, API, design system and hosting, built to IEC 62304. Training Professionals, and CurbHire starting now.',
    },
    pricing: {
      value: 'Priced per project',
      note: 'Nothing here can be honestly priced before it is scoped. Discovery is quoted first and separately, so you find out what it costs before you commit to building it.',
    },
    promise:
      'The thing your business actually does, instead of the nearest platform that almost does it.',
    pageLede:
      'We build the system your work already implies, rather than reshaping how you work to fit something that nearly fits. Next.js, React and TypeScript on the front, Node and MySQL behind it, and a design system built for your industry instead of assembled from a component shop.',
    sections: [
      {
        id: 'custom-software',
        title: 'Built to your process',
        body: [
          'Most software work fails at the boundaries — between front end and back end, between build and handover, between the people who designed it and the people who maintain it. We do not have those boundaries, because the same small team does all of it.',
          'That is also why the price works. Genuinely custom software has been out of reach for most organisations, which is why so many end up bending their operation around a platform that nearly fits. Owning our own tools and running our own hardware is what changes that arithmetic.',
        ],
        includes: [
          'Discovery and scoping, priced before we start',
          'Front end, API and database',
          'A design system specific to your product',
          'Documentation written as we build, not afterwards',
        ],
      },
      {
        id: 'regulated',
        title: 'Regulated and safety-critical work',
        /* Deliberately shorter than it was. The full argument lives on
           /regulated now, and two pages making the same case in the same words
           are two pages competing for one search result — the same reasoning as
           STREAM_COMMON. Do not expand this back out. */
        body: [
          'We build medical device software to IEC 62304, and regulation is mostly an evidence problem: it is not enough that the software works, you have to be able to demonstrate you knew it worked before you shipped it.',
          'There is a longer piece on how we do that, and on what the standard actually requires.',
        ],
        link: { href: '/regulated', label: 'What regulated work involves' },
        includes: [
          'Documentation maintained as a deliverable',
          'Test coverage as audit evidence',
          'Traceable change history',
          'Handover packs that survive staff turnover',
        ],
      },
    ],
    href: '/software',
  },
  {
    id: 'websites',
    name: 'Websites',
    door: 'Fast, accessible, and yours to edit.',
    problem: 'Every change to your site is a quote and a fortnight.',
    solution:
      'A site that loads fast, reads well, and that you can change yourself the afternoon you decide to.',
    lede: 'A site that loads fast, reads well, and that you can actually edit without calling us.',
    caps: [
      'Marketing sites and web applications, designed and built in house',
      'Accessible and fast by default — measured, not asserted',
      'Content you can change yourself, without a licence per seat',
      'Australian hosting on the same hardware as everything else we run',
    ],
    who: 'For businesses whose site is doing less than it should.',
    proof: {
      label: 'Current work',
      body: 'This site, and five hospitality sites across Brisbane, all on the Built page. Each one built the way yours would be.',
    },
    pricing: {
      value: 'From $150 a month',
      note: 'On a 12-month term, for a straightforward business site: design, build, hosting, and changes you can make yourself — no setup fee and no per-edit charge. That is the floor, not the average. Anything with the complexity of this site is quoted.',
    },
    promise: 'A site that loads fast, reads well, and that you can change yourself.',
    pageLede:
      'Designed and built here, on the same stack and the same hardware as everything else we run. Not a theme with your logo on it, and not something you have to ring us about every time a price changes.',
    sections: [
      {
        id: 'accessibility',
        title: 'Accessible, and measured rather than asserted',
        /* Shorter than it was, for the same reason as the regulated section
           above: /accessibility carries the argument now. */
        body: [
          'WCAG 2.2 AA is the level most Australian organisations are now expected to meet, and it covers considerably more than people expect. We build to it from the start, because retrofitting costs several times what designing for it does.',
          'The national firms audit but do not remediate. We do both, in one team.',
        ],
        link: { href: '/accessibility', label: 'Audits that come with the fix' },
        includes: [
          'WCAG 2.2 AA as a floor, not a finishing task',
          'Audit and remediation by the same team',
          'Real assistive-technology testing, not an overlay widget',
          'Performance measured on the hardware people actually use',
        ],
      },
      {
        id: 'yours-to-edit',
        title: 'Yours to edit',
        body: [
          'A site nobody but us can change is a site that quietly goes out of date. You get the ability to change copy, prices, people and pages yourself, without a per-seat licence and without a ticket.',
          'We are still here when you want more than that — but wanting a new paragraph on a Tuesday should not be a project.',
        ],
        includes: [
          'Content you can change yourself',
          'No licence per seat, no per-edit charge',
          'Designed and built in house, not from a template',
          'Australian hosting on the same hardware as everything else we run',
        ],
      },
    ],
    href: '/websites',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    door: 'The problem worked out properly, before anyone builds.',
    problem: 'Nobody has written down what it actually has to do.',
    solution:
      'The problem written down properly first — what it has to do, and how you will know when it does.',
    lede: 'Working out what the system actually has to do — before anyone writes code, or instead of writing any.',
    caps: [
      'Computer systems and mechatronics backgrounds, with two engineering degrees in progress',
      'Working out the requirement properly before a build is committed to',
      'Documentation and traceability that stands up to an audit',
      'Systems where the software and the hardware have to agree with each other',
    ],
    who: 'For work that needs the problem defined, not just built.',
    proof: {
      label: 'Partnership',
      body: 'Full industry partner with QUT, with two Work Integrated Learning capstones running — one on the drone work, one on SAUCE.',
      pending: true,
    },
    pricing: {
      value: 'Priced per engagement',
      note: 'Placeholder. Scope is Craig\u2019s to define, and the price follows the scope.',
    },
    promise: 'The problem worked out properly, before anyone commits to building it.',
    pageLede:
      'Placeholder — this page needs Craig. Every word of this stream is written blind and none of it has been checked against what is actually being sold.',
    sections: [
      {
        id: 'scope',
        title: 'What this stream actually is',
        body: [
          'Placeholder. Craig defines the scope here: what kind of engineering work is being taken on, at what stage of a project, and for whom.',
          'Two things constrain whatever goes in: nobody here is RPEQ-registered, and Queensland regulates who may provide "professional engineering services" under the Professional Engineers Act 2002. So this page describes work, not titles, until Craig and Ronan finish their degrees.',
        ],
        pending: true,
      },
      {
        id: 'proof',
        title: 'What we can point at',
        body: [
          'Placeholder, and the honest gap on this site. Software has Aptium and Websites has the venue sites; this stream has a QUT partnership with two capstones running and no delivered work of its own.',
          'services.ts dropped engineering as a service line in August for exactly this reason — a vague claim is worse than an honest gap. That judgement still stands, and this page should either get real proof or say plainly that it is new.',
        ],
        pending: true,
      },
    ],
    href: '/engineering',
  },
]
