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

/**
 * The three streams first, because they are what is being sold, then the proof
 * and the way to start.
 *
 * Team is deliberately NOT here. Five nav items plus a mark and a theme switch
 * is more than a 68px band can hold honestly, and of the five the people page
 * is the one nobody navigates to before they are already interested. It stays
 * reachable from the home page's team section, from the footer and from the
 * sitemap — see the note in SiteFooter about giving it a link there.
 */
export const SITE_NAV: SiteNavItem[] = [
  { label: 'Software', href: '/software' },
  { label: 'Websites', href: '/websites' },
  { label: 'Engineering', href: '/engineering' },
  { label: 'Built', href: '/built' },
  { label: 'Contact', href: '/contact' },
]
