/**
 * The showpiece — what is on /built.
 *
 * ⚠ THREE ENTRIES ARE STILL INVENTED: spider-drones, training-professionals and
 * qut-capstones carry `placeholder: true` and render a marker. They are Craig's
 * to write. Everything else was approved by Simon on 3 November 2026.
 *
 * What is actually known, and is reflected here:
 *
 *   - **Aptium may be named; its screens are under NDA.** So its entry uses the
 *     stream mark rather than a screenshot, and it stays that way until somebody
 *     gets that in writing.
 *   - **"Class A" appears nowhere on this site.** TGA-regulated is the claim.
 *     The device classification is the client's to disclose, not ours.
 *   - **The spider drones are the reason this page carries video at all.** Whose
 *     project it is and whether the footage is ours to publish are Craig's to
 *     answer; the clip in /public/built is a six-second throwaway, not the real
 *     thing.
 *   - **Engineering has no delivered work of its own.** The QUT partnership and
 *     the two WIL capstones are what that stream can honestly point at. If the
 *     drones turn out not to be ours to show, that gap should be stated rather
 *     than filled.
 *   - **Simon's own site and this one are on the list deliberately**, as the
 *     worked examples of the Websites offer until V Source has enough of its
 *     own. A web shop whose own site is a template has already answered the
 *     question.
 *
 * MEDIA RULE — short clips self-hosted, long-form linked out. Clips are muted,
 * looping, under ten seconds, and carry a poster so nothing but the still is
 * fetched until it is on screen. Anything long-form gets a `long` link out to
 * Vimeo or YouTube behind a click, so no third-party script and no cookie
 * consent surface loads on our own page unless somebody asks for it.
 */
import type { Stream } from './streams'

export type MediaKind = 'video' | 'image' | 'mark'

export interface ProjectMedia {
  kind: MediaKind
  /** video or image. Local, under /public. */
  src?: string
  /** Video only. Shown until the clip is on screen, and instead of it under
   *  prefers-reduced-motion. */
  poster?: string
  /** `mark` only — one of the stream marks, for work that cannot be shown. */
  markId?: Stream['id']
  /** Describes the content for anyone who cannot see it. Empty string only if
   *  the media is decorative, which on this page it never is. */
  alt: string
  /** Intrinsic size, so the space is reserved before anything loads. */
  width: number
  height: number
  /** The full-length version, off-site and behind a click. */
  long?: { href: string; label: string }
}

/**
 * Where a project is up to. Drives a small label on the card, so "starting next
 * week" and "running since 2025" do not read as the same claim.
 */
export type ProjectStatus = 'live' | 'building' | 'starting'

export interface Project {
  slug: string
  title: string
  /** Who it was for. "—" where there is no client to name. */
  client: string
  /** Which stream it belongs to. Ties the page back to the offer. */
  stream: Stream['id']
  year: string
  /** One line, for the index. */
  line: string
  /** The opener on the project's own page. */
  lede: string
  /** The body of the project page. */
  body: string[]
  /** What it touched — standards, hardware, scale. Two columns on the page. */
  facts: Array<{ label: string; value: string }>
  status: ProjectStatus
  /** The live site, where there is one to visit. Rendered as a link on the
   *  project page. Absent for work that cannot be shown. */
  url?: string
  media: ProjectMedia
  /** The one that leads the page, full width. Exactly one should have it. */
  featured?: boolean
  /** Invented copy. Renders a marker. Remove when the real words land. */
  placeholder?: boolean
}

export const BUILT: Project[] = [
  {
    slug: 'spider-drones',
    title: 'Spider drones',
    client: 'Placeholder',
    stream: 'engineering',
    year: '2026',
    status: 'building',
    line: 'A walking platform, and the control loop that keeps it walking.',
    lede: 'Placeholder — Craig has this one.',
    body: [
      'Placeholder. This is where the drones get written up properly: what the machine is for, what was hard about it, and what was learned that is worth someone else knowing.',
      'The clip above is a throwaway I generated to exercise the video path — muted, six seconds, self-hosted. Replace it with the real footage and the page needs no other change.',
    ],
    facts: [
      { label: 'Stream', value: 'Engineering' },
      { label: 'Status', value: 'Placeholder' },
      { label: 'Media', value: 'Clip on our own hardware' },
      { label: 'Rights', value: 'Unconfirmed' },
    ],
    media: {
      kind: 'video',
      src: '/built/placeholder-drone.mp4',
      poster: '/built/placeholder-drone.jpg',
      alt: 'Placeholder animation: a six-legged platform stepping, with a scanning line passing across it.',
      width: 960,
      height: 540,
    },
    featured: true,
    placeholder: true,
  },
  {
    slug: 'aptium-portal',
    title: 'A TGA-regulated medical device portal',
    client: 'Aptium',
    stream: 'software',
    year: '2025\u2013',
    status: 'building',
    line: 'Front end, API, design system and hosting for a regulated device, built to IEC 62304.',
    lede: 'A clinic-facing portal for a TGA-regulated medical device, built by one small team from the interface down to the hardware it runs on.',
    body: [
      'Clinics use it to manage their scanners, review results and run their own users. Behind it sits an API that handles device communication, scan processing, document generation and notifications, and under both sits infrastructure we own and operate. The same people built every layer, so nothing was handed across a boundary where the reasoning got lost.',
      'Because the software is part of a regulated device, the evidence matters as much as the code. It is built to IEC 62304: documentation versioned with the code and true at every commit, tests that stand as evidence rather than reassurance, and a change history that will survive an audit years from now.',
      'There are no screenshots here, and there will not be. Aptium can be named; what is on its screens cannot be shown.',
    ],
    facts: [
      { label: 'Stream', value: 'Software' },
      { label: 'Standard', value: 'IEC 62304' },
      { label: 'Accessibility', value: 'WCAG 2.2 AA' },
      { label: 'Hosting', value: 'Our own hardware, AU' },
    ],
    media: {
      kind: 'mark',
      markId: 'software',
      alt: 'No image: this client\u2019s screens are under a non-disclosure agreement.',
      width: 260,
      height: 180,
    },
  },
  {
    slug: 'training-professionals',
    title: 'Training Professionals',
    client: 'Training Professionals',
    stream: 'software',
    year: '2026',
    status: 'live',
    line: 'Placeholder \u2014 Craig has the real wording for this one.',
    lede: 'Placeholder. Craig has the real wording for this one.',
    body: [
      'Placeholder. partners.ts already carries a \u201c[wording needed]\u201d marker against Training Professionals for the same reason: what we say about this relationship is not ours to write.',
      'The still above is generated, not a screenshot of anything real.',
    ],
    facts: [
      { label: 'Stream', value: 'Software' },
      { label: 'Status', value: 'Wording needed' },
      { label: 'Accessibility', value: 'WCAG 2.2 AA' },
      { label: 'Hosting', value: 'Our own hardware, AU' },
    ],
    media: {
      kind: 'image',
      src: '/built/placeholder-site.jpg',
      alt: 'Placeholder graphic standing in for a screenshot.',
      width: 1200,
      height: 675,
    },
    placeholder: true,
  },
  {
    slug: 'qut-capstones',
    title: 'QUT capstones',
    client: 'Queensland University of Technology',
    stream: 'engineering',
    year: '2026',
    status: 'building',
    line: 'Two Work Integrated Learning capstones running now \u2014 one on the drones, one on SAUCE.',
    lede: 'Placeholder. Two WIL capstone teams are running with QUT: one on the drone work, one on SAUCE.',
    body: [
      'Placeholder. This is the entry for the QUT partnership and the two capstones currently running under Work Integrated Learning \u2014 what each team is working on, what V Source brought to it, and what comes out the other end.',
      'It matters more than a normal entry, because Engineering has no delivered work of its own yet. Until it does, this and the partnership are what that stream can honestly point at.',
    ],
    facts: [
      { label: 'Stream', value: 'Engineering' },
      { label: 'Partner', value: 'QUT' },
      { label: 'Programme', value: 'Work Integrated Learning' },
      { label: 'Running', value: 'Two capstones' },
    ],
    media: {
      kind: 'mark',
      markId: 'engineering',
      alt: 'No image yet: the capstone projects have not been written up.',
      width: 260,
      height: 180,
    },
    placeholder: true,
  },
  {
    slug: 'sauce',
    title: 'SAUCE',
    client: 'V Source',
    stream: 'software',
    year: '2025\u2013',
    status: 'live',
    line: 'Our own component library, and the reason nothing on this page looks like a template.',
    lede: 'SAUCE is the component library our interfaces are built from \u2014 written by us, documented, tested, and themed through tokens.',
    body: [
      'Every input, table, modal and control in it is ours, documented in Storybook and covered by tests. A token system sits underneath, so one set of components can carry a different brand per client, or per tenant at runtime, without being forked.',
      'We built it instead of reaching for Tailwind, Material UI or a bought template because those optimise for getting something on screen fast, and the cost is that everything built with them looks and behaves alike. A tool for a clinic should not feel like a marketing dashboard. Owning the kit also means a breaking change, a vulnerability or an abandoned package is our problem on our schedule, not someone else\u2019s on theirs.',
    ],
    facts: [
      { label: 'Stream', value: 'Software' },
      { label: 'Kind', value: 'Our own tooling' },
      { label: 'Theming', value: 'Tokens, per tenant at runtime' },
      { label: 'Documented', value: 'Storybook' },
    ],
    media: {
      kind: 'mark',
      markId: 'software',
      alt: 'No image yet: SAUCE has not been written up.',
      width: 260,
      height: 180,
    },
  },
  {
    slug: 'vsource-site',
    title: 'This site',
    client: 'V Source',
    stream: 'websites',
    year: '2026',
    status: 'live',
    line: 'Built the way we would build yours, which is the only reason it is on this list.',
    lede: 'The site you are on. No theme, no page builder, no template \u2014 our own components on Next.js.',
    body: [
      'A web shop whose own site is a template has already answered the question, so this one is ours from the components up. Every word of it is in the HTML before any JavaScript runs, which is what search engines and AI crawlers actually read.',
      'It is held to WCAG 2.2 AA and tested on every route in both light and dark themes, with a pause control on anything that moves and a keyboard path through everything that scrolls. That is the standard the Websites stream sells, so it is the standard this site has to meet first.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Built with', value: 'SAUCE, in house' },
      { label: 'Accessibility', value: 'WCAG 2.2 AA' },
      { label: 'Framework', value: 'Next.js' },
    ],
    media: {
      kind: 'mark',
      markId: 'websites',
      alt: 'No image yet: a screenshot of this site goes here.',
      width: 260,
      height: 180,
    },
  },
  {
    slug: 'nug',
    title: 'Nug General Store',
    client: 'Nug General Store',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://nuggeneralstore.com/',
    line: 'Handmade pasta in Bakery Lane, four nights a week.',
    lede: 'A small dining room that changes what it serves often, and needed a site that could keep up without a developer in the loop.',
    body: [
      'The menu changes and the hours change, and a site that needs a quote and a fortnight for either quietly goes out of date. This one is edited by the people who run the room — copy and photographs, from an admin with a preview — without a developer in the loop.',
      'The design comes out of the room itself: the cream of the menu card, the sage panel, and the line about who does what, because at a place this size the people are the brand.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'Bakery Lane, Fortitude Valley' },
      { label: 'Open', value: 'Wed \u2013 Sat, 5pm' },
    ],
    media: {
      kind: 'image',
      src: '/built/nug.jpg',
      alt: 'The Nug General Store site: the wordmark on cream above a photograph of a full dining room with yellow walls and a line-drawn mural, beside a sage panel reading \u201cBen makes everything himself. Ruxi looks after everyone.\u201d',
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'snug',
    title: 'Snug',
    client: 'Snug',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://goodsnug.com/',
    line: 'Korean-inspired all-day dining in Coorparoo, olive and cream on near-black.',
    lede: 'One of three Coorparoo sites we built side by side, each with its own brand and each needing to look like nobody else.',
    body: [
      'The palette comes out of the room rather than off a swatch: olive from the bar, cream from the light the menu sits in, and a photograph of the room at night doing most of the talking.',
      'Snug is busy and does not take daytime bookings, so the site leads with what it is and when it is open, and puts booking where it applies — dinner — rather than in front of everyone.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'Coorparoo, Brisbane' },
      { label: 'Kind', value: 'Caf\u00e9 and wine bar' },
    ],
    media: {
      kind: 'image',
      src: '/built/snug.jpg',
      alt: 'The Snug site: a cream wordmark on an olive bar above a dark photograph of the room at night, seen through the window, captioned \u201ca tiny caf\u00e9, a neighbourhood wine bar\u201d.',
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'janes-deli',
    title: 'Jane’s Deli',
    client: 'Jane’s Deli',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://janes-deli.com/',
    line: 'Brunch, sandwiches, filter and matcha, in olive and warm paper.',
    lede: 'The light one of the three \u2014 warm paper and a deep olive, with the menu said in three words before anything else loads.',
    body: [
      'The light one of the three. The colour is taken from the signage and the tags rather than described, which is why it looks like the shop.',
      'The menu is said in three words before anything else loads — brunch, sandwiches, filter and matcha — with the hours directly under it, because that is what most people opening the site want to know.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'Coorparoo, Brisbane' },
      { label: 'Kind', value: 'Deli and brunch' },
    ],
    media: {
      kind: 'image',
      src: '/built/janes-deli.jpg',
      alt: 'The Jane’s Deli site: a scalloped olive badge logo on warm paper, a photograph of three iced drinks on a pale green table, and an olive panel reading “brunch. sandwiches. filter & matcha.”',
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'bar-coopers',
    title: 'Bar Cooper’s',
    client: 'Bar Cooper’s',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://barcoopers.com/',
    line: 'A near-black bar with the brick of the oven as its only colour.',
    lede: 'A warm near-black room whose one colour is the brick of the oven, carried onto the page as the only thing that is not type.',
    body: [
      'One colour, the brick of the oven, used for the booking button and the rule over each menu section, and nothing else competing with it.',
      'The oven is the reason for the room, so it is the first photograph, and it sits beside the name rather than underneath it.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'Shop 4, 321 Chatsworth Rd, Coorparoo' },
      { label: 'Kind', value: 'Wood-fired bistro' },
    ],
    media: {
      kind: 'image',
      src: '/built/bar-coopers.jpg',
      alt: 'The Bar Cooper’s site: the name set large in brick-red on near-black beside a photograph of the restored wood-fired oven, lit, in its tiled surround.',
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'don-gino',
    title: 'Don Gino',
    client: 'Don Gino',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://dongino.com.au/',
    line: 'An Italian trattoria on Hardgrave Rd, in gold and yellow on black.',
    lede: 'An Italian trattoria on Hardgrave Rd in West End, named for the owner\u2019s father.',
    body: [
      'An earlier draft was built from a verbal description and looked like nobody in particular. This one is sampled off the shopfront \u2014 the black fascia, the gold script \u2014 because that is what a stranger walks past on Hardgrave Rd.',
      'His story comes before the menu, because it is the reason the place exists.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: '65 Hardgrave Rd, West End' },
      { label: 'Kind', value: 'Italian trattoria' },
    ],
    media: {
      kind: 'image',
      src: '/built/don-gino.jpg',
      alt: 'The Don Gino site: the name set large in yellow on black under a gold script logo, with three circular Italian tile motifs labelled Famiglia, Menu and Hours.',
      width: 1440,
      height: 900,
    },
  },
]

/**
 * Named, real, and not started yet.
 *
 * A quiet row of names rather than eight more cards with nothing in them. The
 * point of saying them out loud is that a list with things coming reads as a
 * business with a pipeline; eight empty cards read as a business padding.
 *
 * Promote one into BUILT the moment there is something to show.
 */
export interface Upcoming {
  name: string
  stream: Project['stream']
}

export const COMING_SOON: Upcoming[] = [
  { name: 'CurbHire', stream: 'software' },
  { name: 'Remy', stream: 'software' },
  { name: 'Paw Connect', stream: 'software' },
]
