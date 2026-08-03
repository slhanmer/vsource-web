/**
 * Primary navigation for the marketing site.
 *
 * Single source of truth — the header, the mobile menu and the footer all read
 * from here so a route can't appear in one and not the others.
 */
export interface SiteNavItem {
  label: string
  href: string
}

export const SITE_NAV: SiteNavItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Crew', href: '/crew' },
  { label: 'Contact', href: '/contact' },
]
