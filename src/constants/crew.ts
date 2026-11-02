/**
 * The team.
 *
 * Order is Craig, Simon, Tom, Ronan, Asuka: the two who scope and design a job,
 * then the three who make it hold up in production.
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
 * ⚠ PORTRAITS ARE A MIXED ROW, NOT AN EMPTY ONE. The empty plate is designed
 * for that case rather than being a fallback — see `.crew__portrait--empty`.
 *
 * PORTRAIT CONVENTION — decided, do not re-decide it:
 *
 *   - The file goes in `public/crew/<id>.jpg`, where `<id>` is the member's
 *     `id` below.
 *   - 4:5, at least 1200×1500, and a GREYSCALE source. The duotone is the CSS
 *     layer over it; do not bake the colour into the file.
 *   - Setting `portrait: '/crew/<id>.jpg'` is the entire change. The box is the
 *     same size with or without a photograph, so nothing reflows.
 *
 * Tom and Asuka will not have portraits. That is permanent, not pending: the
 * empty plate is their treatment, not a gap waiting to be filled. Do not chase
 * a photograph for either of them, and do not mark their entries as missing
 * one.
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
  /** Fuller bio used on the crew page. */
  bio: string
  /** `/crew/<id>.jpg` — see the convention above. Falls back to the initials
   *  plate when absent. */
  portrait?: string
  /** Invented or unconfirmed copy. Renders a visible marker, same as partners
   *  and projects do. Remove it when the person has read their own entry. */
  pending?: boolean
}

export const CREW: CrewMember[] = [
  {
    id: 'craig-schneider',
    name: 'Craig Schneider',
    role: 'Founder & Technical Director',
    summary: 'Computer science, engineering, and two decades on site. Runs the shop.',
    bio: 'Craig runs V Source. He holds a computer science degree from QUT and is completing an engineering degree in computer and software systems, alongside two decades in residential construction, communications infrastructure and site supervision. That range is why we can talk about the hardware a system runs on and the site it is installed on, not only the code — and why, when an install has to pass inspection, someone here has already been the person accountable for that.',
  },
  {
    id: 'simon-hanmer',
    name: 'Simon Hanmer',
    role: 'Lead Developer & UX',
    summary: 'Designs it and builds it. Twenty years in kitchens before the degree.',
    bio: 'Simon designs and builds the part clients actually use — the interface, the system behind it, and often the brand around it. He holds a computer science degree from QUT, and before it spent twenty-odd years running kitchens — launching restaurants, and running services where a hundred covers arrive inside ninety minutes and nothing is permitted to fail quietly. Consistency under load, working to a deadline that does not move, and knowing precisely how much can go wrong at once: that turns out to be most of what shipping software actually is.',
  },
  {
    id: 'tom-lee',
    name: 'Tom Lee',
    role: 'Backend & Platform Developer',
    summary: 'Backend, and the platform under it. Knows why it broke at 2am.',
    bio: 'Tom writes the code behind the interface \u2014 the services, the data and the integrations that make the visible part work. He has worked backend and full-stack since 2018, starting from a Diploma in Web Development and building the rest of the stack himself, which is how most of the people who are good at this actually learned it. On a system that has to keep running unattended, the code is only half the job; the other half is the platform under it, and Tom owns that too, from the servers and networks up to the pipeline that carries a build to a live site. If something breaks at two in the morning, he is the one who already knows why.',
  },
  {
    id: 'ronan-donahoe',
    name: 'Ronan Donahoe',
    role: 'Quality & Documentation',
    summary: 'Finds it before the auditor does.',
    bio: 'Ronan owns testing and documentation, and is midway through an engineering degree in mechatronics and mathematics. On a regulated product neither of those is paperwork — the documentation is the evidence that the thing is safe, and the testing is what makes the evidence true. If a build does not behave the way its documentation claims, Ronan finds it first. That is the whole job, and it is the reason we can take on work most studios our size cannot.',
  },
  {
    /*
     * PLACEHOLDER. Asuka came on board in October to work on machine learning
     * and testing, and that is the whole of what is confirmed. Everything
     * below needs his own input before it goes anywhere near a deploy:
     *
     *   - full name (the id and the initials are both derived from it)
     *   - how he wants the title written
     *   - what he has worked on, and anything he would want a client to know
     *
     * `pending: true` renders a visible marker on both the home page and
     * /team, so this cannot ship quietly. Remove it once he has read his own
     * entry — not before, and not on his behalf.
     */
    id: 'asuka',
    name: 'Asuka',
    role: 'Machine Learning & Testing',
    summary: 'Placeholder — machine learning and testing. Joined October 2026.',
    bio: 'Placeholder. Asuka joined in October to work on machine learning and testing. The rest of this entry is his to write: what he has built, where the ML experience comes from, and what he would want someone considering us to know about that side of the work. Nothing here should ship as written.',
    pending: true,
  },
]
