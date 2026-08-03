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
    name: 'Craig Schneider',
    role: 'Founder & Technical Director',
    summary: 'Twenty years on the tools before the degrees. Runs the shop.',
    bio: 'Craig spent two decades in residential construction, communications infrastructure and site supervision before formalising any of it — then went and got a computer science degree from QUT and is finishing an electro-mechanical engineering degree on top. That combination is genuinely rare: he can read a wiring diagram and a stack trace, and he has been the person responsible when a site does not pass inspection. It is why we can talk sensibly about the thing the software is attached to.',
  },
  {
    name: 'Simon Hanmer',
    role: 'Lead Developer & UX',
    summary: 'Computer science, and twenty years of dinner service before it.',
    bio: 'Simon builds the front ends and the APIs underneath them. Before computer science at QUT, he spent twenty-odd years running kitchens — launching restaurants, and running services where a hundred covers arrive inside ninety minutes and nothing is permitted to fail quietly. Consistency under load, working to a deadline that does not move, and knowing precisely how much can go wrong at once: that turns out to be most of what shipping software actually is.',
  },
  {
    name: 'Ronan Donahoe',
    role: 'Quality & Documentation',
    summary: 'Finds it before the auditor does.',
    bio: 'Ronan owns testing and documentation, and is halfway through an engineering degree. On a regulated product neither of those is paperwork — the documentation is the evidence that the thing is safe, and the testing is what makes the evidence true. If a build does not behave the way its documentation claims, Ronan finds it first. That is the whole job, and it is the reason we can take on work most studios our size cannot.',
  },
]
