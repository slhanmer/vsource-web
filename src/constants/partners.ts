/**
 * Clients and partners.
 *
 * This is the only proof the home page carries, so it is deliberately short and
 * deliberately specific — three real names beat a wall of logos nobody
 * recognises. Aptium's screens are under NDA, which is why the proof here is
 * words rather than a product shot.
 *
 * In the partners band, logos sit on a light plate regardless of theme, in
 * their own colours: they are supplied artwork designed for white. The fold's
 * "Working with" strip shows the same files flattened to one theme ink by a CSS
 * filter, which only works because every file has a transparent background.
 * Keep it that way when a logo is replaced.
 *
 * `pending` marks copy that is not ours yet. It renders as a visible query on
 * the page rather than silently reading as finished text — better that a
 * placeholder looks like a question during review than that it ships.
 */
export interface Partner {
  id: string
  name: string
  /** Client, industry partner, and so on. */
  kind: string
  /** Path under /public. */
  logo: string
  width: number
  height: number
  body: string
  /** True while the wording still needs to come from Craig. */
  pending?: boolean
}

export const PARTNERS: Partner[] = [
  {
    id: 'aptium',
    name: 'Aptium',
    kind: 'Client',
    logo: '/logos/partners/aptium.png',
    width: 185,
    height: 56,
    body: 'A TGA-regulated medical device portal — front end, API, design system and hosting, built to IEC 62304.',
  },
  {
    id: 'qut',
    name: 'QUT',
    kind: 'Industry partner',
    logo: '/logos/partners/qut.png',
    width: 94,
    height: 96,
    body: 'Full industry partner with QUT.',
    pending: true,
  },
  {
    id: 'training-professionals',
    name: 'Training Professionals',
    kind: 'Client',
    logo: '/logos/partners/training-professionals.png',
    width: 85,
    height: 72,
    body: 'Training Professionals.',
    pending: true,
  },
]
