'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { CONTACT } from '@/constants/contact'

/**
 * The four ways to reach us, at the right of the readout strip.
 *
 * They were a labelled row in the footer. Up here they are reachable from any
 * page without a band of their own — the strip was carrying two readings and a
 * lot of empty space on the right, and this is what that space is for.
 *
 * Icon only, so each link carries a visually-hidden label: without one these
 * have no accessible name at all. `title` gives a mouse the same text.
 *
 * Icons come from Font Awesome, not the @icons barrel: that barrel drags every
 * SVG through svgr and the loader does not apply here.
 */
const LINKS = [
  { key: 'email', icon: faEnvelope, href: `mailto:${CONTACT.email}`, label: CONTACT.email },
  { key: 'phone', icon: faPhone, href: CONTACT.phoneHref, label: CONTACT.phone },
  {
    key: 'where',
    icon: faLocationDot,
    href: CONTACT.locationHref,
    label: CONTACT.location,
    external: true,
  },
  {
    key: 'linkedin',
    icon: faLinkedinIn,
    href: CONTACT.linkedin,
    label: 'Follow us on LinkedIn',
    external: true,
  },
] as const

export default function HeaderContacts() {
  return (
    <nav className="site-header__contacts" aria-label="Contact">
      {LINKS.map((link) => (
        <a
          key={link.key}
          className="site-header__contact"
          href={link.href}
          title={link.label}
          {...('external' in link && link.external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          <FontAwesomeIcon icon={link.icon} className="site-header__contact-icon" />
          <span className="visually-hidden">
            {link.label}
            {'external' in link && link.external ? ' (opens in a new tab)' : ''}
          </span>
        </a>
      ))}
    </nav>
  )
}
