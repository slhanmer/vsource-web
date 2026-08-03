/**
 * A single item in the application header navigation.
 * Items can be nested (via `children`) for dropdown menus.
 * Visibility is gated by `roles`, `minAccessLevel`, `maxAccessLevel`, and `featureFlag`.
 */
export type HeaderMenuItem = {
  label: string
  /** Internal path (must start with `/`) or an absolute external URL */
  path?: `/${string}` | `https${string}`
  /** Icon identifier string resolved by the icon component */
  icon?: string
  /** Role strings required to see this item; empty/absent = visible to all */
  roles?: string[]
  /** Minimum `accessLevel` required to see this item */
  minAccessLevel?: number
  /** Feature flag key; item is hidden when the flag is disabled for the tenant */
  featureFlag?: string
  children?: HeaderMenuItem[]
  /** When true, the link opens in a new tab */
  external?: boolean
  disabled?: boolean
  /** Maximum `accessLevel` that can see this item (used to hide admin items from super-admins) */
  maxAccessLevel?: number
}

/** The four quadrants of the PDCA (Plan-Do-Check-Act) quality cycle. */
export type PDCAQuadrant = 'plan' | 'do' | 'check' | 'act'
