/**
 * The team.
 *
 * Order is Craig, Simon, Ronan, Asuka, Tom: the two who scope and design a
 * job, then the three who make it hold up in production, with Tom last. His is
 * the one tile with no photograph, and at the end of the row it closes the set
 * instead of interrupting the faces (Simon's call, review-1, 3 November).
 *
 * Bios are written to be specific rather than flattering: the point of this
 * section is that a prospective client can tell we are identifiable people with
 * unusual backgrounds, not an anonymous agency.
 *
 * ⚠ FIVE PEOPLE CHANGED THE GRID. The old rule was "1, 2, 4 — never 3", which
 * only ever meant "a row the team divides into". Five is prime, so four-across
 * strands one person on a second row, which is the exact thing that rule
 * exists to prevent. The grids are now 5 → 3 → 1 on the home teaser and
 * 3 → 1 on this page; see the note at the top of crew.scss for why the two
 * differ. A sixth person needs neither changed.
 *
 * ⚠ PORTRAITS ARE A MIXED ROW, NOT AN EMPTY ONE. The no-portrait tile is
 * designed for that case rather than being a fallback — see TerminalTile.
 *
 * PORTRAIT CONVENTION — decided, do not re-decide it:
 *
 *   - The file goes in `public/crew/<id>.jpg`, where `<id>` is the member's
 *     `id` below.
 *   - 4:5, at least 1200×1500, and a COLOUR source. There is no tone layer;
 *     the recessed edge is the only thing drawn over it.
 *   - Setting `portrait: '/crew/<id>.jpg'` is the entire change. The box is the
 *     same size with or without a photograph, so nothing reflows.
 *
 * ⚠ STOCK STAND-INS. Until the shoot lands, Craig, Simon and Ronan carry a
 * stock portrait from Unsplash (`public/crew/stock/`), flagged
 * `stockPortrait: true`, so the rows can be reviewed with faces in them.
 * Those are strangers' faces under real names, so they must never reach
 * production: the guard at the foot of this file fails `next build` when
 * VERCEL_ENV is 'production' and any entry still has the flag. Replace the
 * file, point `portrait` at `/crew/<id>.jpg`, and delete the flag.
 *
 * Tom will not have a portrait. That is permanent, not pending: the terminal
 * tile is his treatment, not a gap waiting to be filled. Do not chase a
 * photograph for him, and do not mark his entry as missing one.
 */
export interface CrewMember {
  /** Anchor id. Explicit, so a name or title edit cannot break inbound links. */
  id: string
  /** Full name as it should appear. */
  name: string
  /** Job title. */
  role: string
  /** One-line summary used on the home page teaser. */
  summary: string
  /** Fuller bio used on the team page, one entry per paragraph. */
  bio: string[]
  /** `/crew/<id>.jpg` — see the convention above. Falls back to the terminal
   *  tile when absent. */
  portrait?: string
  /** The portrait is a stock stand-in, not the person. Review only: the guard
   *  below fails a production build while any entry has it. */
  stockPortrait?: boolean
  /** Invented or unconfirmed copy. Renders a visible marker, same as partners
   *  and projects do. Remove it when the person has read their own entry. */
  pending?: boolean
}

export const CREW: CrewMember[] = [
  {
    id: 'craig-schneider',
    name: 'Craig Schneider',
    role: 'Founder & Technical Director',
    portrait: '/crew/stock/craig-schneider.jpg',
    stockPortrait: true,
    summary: 'Computer science, engineering, and two decades on site. Runs the shop.',
    bio: [
      'Craig runs V Source. He holds a computer science degree from QUT and is completing an engineering degree in computer and software systems, alongside two decades in residential construction, communications infrastructure and site supervision. That range is why we can talk about the hardware a system runs on and the site it is installed on, not only the code — and why, when an install has to pass inspection, someone here has already been the person accountable for that.',
    ],
  },
  {
    id: 'simon-hanmer',
    name: 'Simon Hanmer',
    role: 'Lead Developer & UX',
    portrait: '/crew/stock/simon-hanmer.jpg',
    stockPortrait: true,
    summary: 'Designs it and builds it. Twenty years in kitchens before the degree.',
    bio: [
      'Simon designs and builds the part clients actually use — the interface, the system behind it, and often the brand around it. He holds a computer science degree from QUT, and before it spent twenty-odd years running kitchens — launching restaurants, and running services where a hundred covers arrive inside ninety minutes and nothing is permitted to fail quietly. Consistency under load, working to a deadline that does not move, and knowing precisely how much can go wrong at once: that turns out to be most of what shipping software actually is.',
    ],
  },
  {
    id: 'ronan-donahoe',
    name: 'Ronan Donahoe',
    role: 'Testing & Robotics',
    portrait: '/crew/stock/ronan-donahoe.jpg',
    stockPortrait: true,
    summary: 'Finds it before the auditor does.',
    bio: [
      'Ronan tests what we build and writes the documentation that proves how it behaves. This is the kind of behind-the-scenes work that can make or break a product’s release or a compliance audit.',
      'He’s drawn to problems without an obvious answer, which is exactly the right instinct for the job: good testing requires someone who can look at the system from a different angle than the people who designed it.',
      'There is more to Ronan than just testing and documentation though. He is currently studying a double degree in Mechatronics Engineering and Computational & Applied Mathematics: hardware, software, and the maths that ties them together. He uses this range to find solutions that are practical and elegant, which usually means finding a smarter way to make something work rather than a more complicated one.',
      'Ronan is another V Source team member with a background in hospitality (by coincidence, not by design). While Simon’s background was in the kitchen, Ronan looked after the front of house, where staying calm under pressure and solving problems on the fly is an indispensable skill. People are unpredictable, and understanding that is invaluable.',
    ],
  },
  {
    id: 'asuka-hirai',
    name: 'Asuka Hirai',
    role: 'Testing & Machine Learning',
    portrait: '/crew/asuka-hirai.jpg',
    summary:
      'Tests it until he knows why it works — computer science, with a background in machine learning.',
    bio: [
      'Asuka holds a Bachelor of Information Technology, majoring in Computer Science, from QUT, with an academic background in machine learning, computer vision, and software development. At V Source, he focuses on software testing and quality assurance, identifying issues that might otherwise go unnoticed and ensuring the final product works as intended. With a particular interest in artificial intelligence and problem-solving, he brings an analytical approach to his work and a curiosity for understanding not just whether something works, but why it works — or why it doesn’t.',
    ],
  },
  {
    id: 'tom-lee',
    name: 'Tom Lee',
    role: 'Backend & Platform Developer',
    summary: 'Backend, and the platform under it. Knows why it broke at 2am.',
    bio: [
      'Tom writes the code behind the interface \u2014 the services, the data and the integrations that make the visible part work. He has worked backend and full-stack since 2018, starting from a Diploma in Web Development and building the rest of the stack himself, which is how most of the people who are good at this actually learned it. On a system that has to keep running unattended, the code is only half the job; the other half is the platform under it, and Tom owns that too, from the servers and networks up to the pipeline that carries a build to a live site. If something breaks at two in the morning, he is the one who already knows why.',
    ],
  },
]

/*
 * The stock-portrait guard. Module scope, so it runs wherever this file is
 * evaluated — which, during `next build`, is the prerender of `/` and `/team`.
 * Vercel sets VERCEL_ENV to 'production' only for the production deployment,
 * so previews still build with the stand-ins and production refuses to.
 */
const stockPortraits = CREW.filter((member) => member.stockPortrait)
if (process.env.VERCEL_ENV === 'production' && stockPortraits.length > 0) {
  throw new Error(
    `Stock stand-in portraits must not ship to production: ${stockPortraits
      .map((member) => member.name)
      .join(', ')}. Replace each with the real photograph and remove ` +
      '`stockPortrait: true` in src/constants/crew.ts.'
  )
}
