/**
 * The crew.
 *
 * Bios are written to be specific rather than flattering: the point of this
 * section is that a prospective client can tell we are identifiable people with
 * unusual backgrounds, not an anonymous agency.
 *
 * Portraits are pending — the initials fallback is a deliberate look rather
 * than a gap, so there is no rush. Add a `portrait` path when photos exist.
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
  /** Optional portrait in /public/crew. Falls back to initials when absent. */
  portrait?: string
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
    id: 'ronan-donahoe',
    name: 'Ronan Donahoe',
    role: 'Quality & Documentation',
    summary: 'Finds it before the auditor does.',
    bio: 'Ronan owns testing and documentation, and is midway through an engineering degree in mechatronics and mathematics. On a regulated product neither of those is paperwork — the documentation is the evidence that the thing is safe, and the testing is what makes the evidence true. If a build does not behave the way its documentation claims, Ronan finds it first. That is the whole job, and it is the reason we can take on work most studios our size cannot.',
  },
]
