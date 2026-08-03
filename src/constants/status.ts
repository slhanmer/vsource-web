/**
 * The header readout strip.
 *
 * This is the second tier of the fascia and it only works if every line is
 * true and worth knowing. Fake telemetry — blinking "SYSTEM NOMINAL" and the
 * like — would undo the credibility the rest of the site is building.
 *
 * DRAFT: `availability` is invented. Confirm with Craig before launch, or drop
 * the entry entirely — three honest readouts beat four with one made up.
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
  { label: 'Built', value: 'In house — SAUCE + RAMEN' },
  { label: 'Hosted', value: 'Our own hardware, AU' },
]
