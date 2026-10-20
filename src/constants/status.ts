/**
 * The header readout strip.
 *
 * This is the second tier of the fascia and it only works if every line is
 * true and worth knowing. Fake telemetry — blinking "SYSTEM NOMINAL" and the
 * like — would undo the credibility the rest of the site is building.
 *
 * Two entries, not four. Four was a line of small mono type running most of
 * the way across the screen directly under the nav, and it was reading as a
 * fifth thing to parse before anyone got to the headline. Where we are and
 * whether we can take the work are the two a visitor actually acts on; how we
 * build and where it is hosted are arguments, and arguments belong in the page
 * where there is room to make them.
 *
 * The two that were cut, verbatim, in case they come back:
 *
 *   { label: 'Built',  value: 'In house — SAUCE + RAMEN' },
 *   { label: 'Hosted', value: 'Our own hardware, AU' },
 *
 * DRAFT: `availability` is invented. Confirm with Craig before launch, or drop
 * the entry entirely — one honest readout beats two with one made up.
 */
export interface StatusEntry {
  label: string
  value: string
  /** Renders a small indicator dot before the value. */
  live?: boolean
}

export const SITE_STATUS: StatusEntry[] = [
  { label: 'Loc', value: 'Brisbane / UTC+10' },
  { label: 'Status', value: 'Taking work', live: true },
]
