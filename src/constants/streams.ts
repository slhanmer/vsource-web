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
 * So nothing on this site calls anyone a qualified engineer, and the Robotics
 * stream was renamed from Engineering in November 2026 for the same reason:
 * offering "engineering" is offering the regulated service. Revisit the
 * wording when Craig and Ronan finish, not before. The Robotics copy is
 * Simon's, supplied on 4 November 2026 (Project Arachnid), and is final.
 */
/** The streams, as a closed set. A union rather than `string` so anything
 *  keyed by stream — the home page photographs in photos.ts — fails the type
 *  check when a stream is added without its entry. */
export type StreamId = 'software' | 'robotics' | 'websites'

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
  /** Where someone is now: the past, in the "What changes" row. It sits in a
   *  recessed plate at body-large size, quieter than what follows, so it has
   *  to be one short sentence they would recognise. Written as a situation,
   *  never as a failing: nobody buys from a page that opens by telling them
   *  they got it wrong. */
  problem: string
  /** What they have instead: the short, large line the row is built around.
   *  It sits on the surface, under an "Instead" eyebrow, at the size the
   *  problem used to have, and it is the line the eye should land on. One
   *  line, no capability list. */
  instead: string
  /** The why behind `instead`: one or two sentences of body copy under it.
   *  Rendered only in the "What changes" row on the home page. */
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
   *  Software and Robotics cannot be priced before they are scoped, and
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
    instead: 'One system, built around how you actually work.',
    solution:
      'Off-the-shelf platforms make you work their way. We build to the process you already run, so nothing lives in a side spreadsheet, and when someone asks what happened, the system can show them.',
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
    id: 'robotics',
    name: 'Robotics',
    door: 'Legged robots for places people can’t go.',
    problem: 'The places survivors are trapped are the places rescuers can’t safely go.',
    instead: 'Robots that walk where wheels stop.',
    solution:
      'Each foot picks its own ground, so the robot can step over debris, keep its footing on loose material and carry its sensors into gaps people can’t safely reach.',
    lede: 'Bio-inspired legged robots for terrain too dangerous, too unstable or too confined for people or conventional machines.',
    caps: [
      'Eight-legged platforms with a gait that keeps the body supported at all times',
      'Sensor, camera and compute payloads carried at the centre',
      'Wireless control with live diagnostics and over-the-air updates',
      'Simulated training environments for machine-learned gaits',
    ],
    who: 'For search and rescue, emergency services, and anyone who needs to see inside places people can’t safely enter.',
    proof: {
      label: 'Current work',
      body: 'Project Arachnid: The Huntsman, our first eight-legged prototype, stands, walks, turns, detects obstacles and climbs.',
    },
    pricing: {
      value: 'Scoped per project',
      note: 'Robotics work is research-led. We scope it with you against what the robot has to reach and what it has to bring back.',
    },
    promise: 'Robots that go where people can’t, so rescuers don’t have to.',
    pageLede:
      'After an earthquake, a building collapse or a landslide, the first hours matter most. We build legged robots to put eyes, sensors and eventually supplies into the places rescuers can’t safely reach.',
    sections: [
      {
        id: 'why-legs',
        title: 'Why legs, not wheels',
        body: [
          'Wheels and tracks work well on roads and open ground. Disaster zones offer neither. Debris fields are broken and uneven, with gaps, steps and loose material that can stop a wheeled platform outright.',
          'Legged robots move differently, and go where wheels and rotors can’t. Each foot picks its own contact point, so the robot can step over obstacles, keep its footing on uneven ground and spread its weight across many points of support. An eight-legged design adds redundancy: the robot always has several feet planted, which keeps it stable while carrying a load, and it can hold its position on very little power, so it can stop, wait and listen.',
        ],
      },
      {
        id: 'by-evolution',
        title: 'Designed by evolution',
        body: [
          'Rather than invent locomotion from scratch, we look to the most successful walkers on Earth. Arthropods — insects, spiders and their relatives — have refined their movement over more than 380 million years, and today thrive almost everywhere, from rainforest canopies and desert sand to caves, cliff faces and the gaps beneath fallen debris. Their gaits, body proportions and reflexes are field-tested solutions to the same problems our robots face.',
        ],
        includes: [
          'Carries a payload at its centre, built to hold sensors, cameras and onboard computers',
          'Senses what is ahead, with room for environmental sensor packages',
          'Climbs using a dedicated wave gait that lifts the body over obstacles',
          'Operates wirelessly, with live diagnostics and over-the-air software updates',
        ],
      },
      {
        id: 'next',
        title: 'Where we’re heading',
        body: [
          'The Huntsman has completed its first prototype stage. The second generation, now in development, is built toward a robot that can enter a disaster zone, move through it on its own and send back what it finds — giving rescuers the information they need without putting more lives at risk.',
        ],
        includes: [
          'Stronger joints for heavier payloads',
          'Pressure-sensing feet, so the robot can feel the ground beneath it',
          'Body-orientation sensing, so it can keep its balance on unstable terrain',
          'Simulated playgrounds for machine learning, so it can choose its own path over rough ground',
          'An onboard mesh network to reconnect communications in a blackout',
        ],
      },
    ],
    href: '/robotics',
  },
  {
    id: 'websites',
    name: 'Websites',
    door: 'Fast, accessible, and yours to edit.',
    problem: 'Every change to your site is a quote and a fortnight.',
    instead: 'A site you can change yourself, the afternoon you decide to.',
    solution:
      'Fast, accessible and built for the people who use it. When the menu or the hours change, you change them, without a quote or a fortnight’s wait.',
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
]
