/**
 * The showpiece — what is on /built.
 *
 * ⚠ THE NAMES ARE REAL; THE WORDS ARE NOT. Every entry still carries
 * `placeholder: true`, which renders a visible marker on the page, so nothing
 * invented can ship quietly. Delete the flag as each one gets its real copy and
 * the marker goes with it.
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
/*
 * ⚠ PREVIEW URLS — SWAP AT CUTOVER
 *
 * All five websites entries point at Vercel preview deployments because the
 * sites are in testing, and each carries status: 'live' on the assumption that
 * it cuts over before this site redeploys.
 *
 *   nug          nug-preview.vercel.app    → nuggeneralstore.com
 *   snug         snug-preview.vercel.app   → (domain TBC)
 *   janes-deli   janes-preview.vercel.app  → (domain TBC)
 *   bar-coopers  coops-preview.vercel.app  → (domain TBC)
 *   don-gino     don-gino.vercel.app       → (domain TBC)
 *
 * If this site ships before a venue cuts over, that card claims "live" against
 * a preview URL. Check this list before any deploy.
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
    status: 'live',
    line: 'Front end, API, design system and hosting, built to IEC 62304 and still running.',
    lede: 'A TGA-regulated portal, built by four people, with the evidence to prove how it was built.',
    body: [
      'Placeholder for the write-up. The existing /work copy is the raw material for this one \u2014 it is real, it was approved, and it should be cut down rather than replaced.',
      'No screenshots. Aptium can be named; what is on the screens cannot be shown, and that does not change until somebody has it in writing.',
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
    placeholder: true,
  },
  {
    slug: 'youhire',
    title: 'YouHire',
    client: 'YouHire',
    stream: 'software',
    year: '2026',
    status: 'starting',
    line: 'Starting now \u2014 the write-up follows once there is something to write up.',
    lede: 'Placeholder. Work starts the week of 29 September 2026.',
    body: [
      'Placeholder. Nothing here should claim an outcome before there is one \u2014 this entry exists so the project has somewhere to land, not so the page looks fuller.',
      'What it needs: what YouHire does, what we are building for them, and why they came to us rather than to a platform.',
    ],
    facts: [
      { label: 'Stream', value: 'Software' },
      { label: 'Status', value: 'Starting' },
      { label: 'Hosting', value: 'Our own hardware, AU' },
      { label: 'Detail', value: 'Wording needed' },
    ],
    media: {
      kind: 'mark',
      markId: 'software',
      alt: 'No image yet: work on this has not started.',
      width: 260,
      height: 180,
    },
    placeholder: true,
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
    line: 'The component library everything else here is built out of, and one of the QUT capstones.',
    lede: 'Placeholder. Our own component library \u2014 the reason the rest of this list does not look like everyone else\u2019s.',
    body: [
      'Placeholder. SAUCE is the component library, RAMEN is the ORM, and both are ours. It is the honest answer to \u201cwhy does your work not look like a Tailwind template\u201d, and it is also the subject of one of the two QUT capstones.',
      'Worth writing up properly: a tool you built and then built a business on is a stronger argument than any case study about using somebody else\u2019s.',
    ],
    facts: [
      { label: 'Stream', value: 'Software' },
      { label: 'Kind', value: 'Our own tooling' },
      { label: 'Also', value: 'A QUT capstone' },
      { label: 'Detail', value: 'Wording needed' },
    ],
    media: {
      kind: 'mark',
      markId: 'software',
      alt: 'No image yet: SAUCE has not been written up.',
      width: 260,
      height: 180,
    },
    placeholder: true,
  },
  {
    slug: 'vsource-site',
    title: 'This site',
    client: 'V Source',
    stream: 'websites',
    year: '2026',
    status: 'live',
    line: 'Built the way we would build yours, which is the only reason it is on this list.',
    lede: 'Placeholder. The site you are on, built in house on the same stack and the same hardware as everything else.',
    body: [
      'Placeholder. A web shop whose own site is a template has already answered the question. This one is ours top to bottom: our component library, our hosting, no theme and no page builder.',
      'Worth naming the specifics when this gets written properly \u2014 the fold that holds at every viewport, WCAG 2.2 AA, and the fact that every word of it is in the HTML before any JavaScript runs.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Built with', value: 'SAUCE, in house' },
      { label: 'Accessibility', value: 'WCAG 2.2 AA' },
      { label: 'Hosting', value: 'Our own hardware, AU' },
    ],
    media: {
      kind: 'mark',
      markId: 'websites',
      alt: 'No image yet: a screenshot of this site goes here.',
      width: 260,
      height: 180,
    },
    placeholder: true,
  },
  {
    slug: 'simon-hanmer-studio',
    title: 'Simon Hanmer',
    client: 'Simon Hanmer',
    stream: 'websites',
    year: '2026',
    status: 'live',
    line: 'The site the Websites offer is modelled on, including the price.',
    lede: 'Placeholder \u2014 needs its real name and its URL.',
    body: [
      'Placeholder. Simon\u2019s own site, standing in as the worked example of what $150 a month buys until V Source has enough of its own to fill the list.',
      'NEEDS: the actual title, the URL, and a screenshot. Also a decision on how it is credited, given the studio and V Source are not the same thing.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Status', value: 'Name and URL needed' },
      { label: 'Accessibility', value: 'WCAG 2.2 AA' },
      { label: 'Hosting', value: 'Our own hardware, AU' },
    ],
    media: {
      kind: 'image',
      src: '/built/placeholder-site.jpg',
      alt: 'Placeholder graphic standing in for a screenshot of the site.',
      width: 1200,
      height: 675,
    },
    placeholder: true,
  },
  {
    slug: 'nug',
    title: 'NUG.',
    client: 'NUG.',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://nug-preview.vercel.app',
    line: 'Handmade pasta in Bakery Lane, four nights a week.',
    lede: 'A small dining room that changes what it serves often, and needed a site that could keep up without a developer in the loop.',
    body: [
      'Placeholder. The menu changes, the hours change, and a site that needs a quote and a fortnight for either is a site that quietly goes out of date. This one is edited by the people who run the room.',
      'Placeholder. Worth writing up properly: what the brand work was, and what carried over from the room itself.',
    ],
    facts: [
      { label: 'Stream', value: 'Websites' },
      { label: 'Where', value: 'Bakery Lane, Fortitude Valley' },
      { label: 'Open', value: 'Wed \u2013 Sat, 5pm' },
    ],
    media: {
      kind: 'image',
      src: '/built/nug.jpg',
      alt: 'The NUG. site: the wordmark on cream above a photograph of a full dining room with yellow walls and a line-drawn mural, beside a sage panel reading \u201cBen makes everything himself. Ruxi looks after everyone.\u201d',
      width: 1440,
      height: 900,
    },
    placeholder: true,
  },
  {
    slug: 'snug',
    title: 'Snug',
    client: 'Snug',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://snug-preview.vercel.app',
    line: 'Korean-inspired all-day dining in Coorparoo, olive and cream on near-black.',
    lede: 'One of three venues on the same block, each with its own brand, each needing to look like nobody else.',
    body: [
      'Placeholder. The palette comes out of the room — olive from the bar, cream from the light the menu sits in — rather than off a swatch.',
      'Placeholder. Needs the real write-up.',
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
    placeholder: true,
  },
  {
    slug: 'janes-deli',
    title: 'Jane’s Deli',
    client: 'Jane’s Deli',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://janes-preview.vercel.app',
    line: 'Brunch, sandwiches, filter and matcha, in olive and warm paper.',
    lede: 'The light one of the three \u2014 warm paper and a deep olive, with the menu said in three words before anything else loads.',
    body: [
      'Placeholder. Colour taken from the signage and the tags rather than described, which is why it looks like the shop.',
      'Placeholder. Needs the real write-up.',
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
    placeholder: true,
  },
  {
    slug: 'bar-coopers',
    title: 'Bar Cooper’s',
    client: 'Bar Cooper’s',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://coops-preview.vercel.app',
    line: 'A near-black bar with the brick of the oven as its only colour.',
    lede: 'A warm near-black room whose one colour is the brick of the oven, carried onto the page as the only thing that is not type.',
    body: [
      'Placeholder. One colour, used for the button and the rule over a menu section, and nothing else competing with it.',
      'Placeholder. Needs the real write-up.',
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
    placeholder: true,
  },
  {
    slug: 'don-gino',
    title: 'Don Gino',
    client: 'Don Gino',
    stream: 'websites',
    year: '2026',
    status: 'live',
    url: 'https://don-gino.vercel.app',
    line: 'An Italian trattoria on Hardgrave Rd, in gold and yellow on black.',
    lede: 'What a stranger walks past on Hardgrave Rd \u2014 a black fascia and a gold script sign \u2014 which is what the page had to be.',
    body: [
      'Placeholder. An earlier draft was built from a verbal description and looked like nobody in particular; this one is sampled off the shopfront.',
      'Placeholder. Needs the real write-up.',
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
    placeholder: true,
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
  { name: 'Remy', stream: 'software' },
  { name: 'Paw Connect', stream: 'software' },
]
