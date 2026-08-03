import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { CONTACT } from '@constants'

import './styles/siteFooter.scss'

/**
 * Site footer — the bottom fascia.
 *
 * Borrows the portal's ContactMenu language: a debossed chrome band carrying an
 * icon-led contact strip. The portal hides that strip behind a rotated opener
 * because screen space is scarce in an app; on a marketing site the contact
 * details are the point, so they are always visible.
 *
 * No nav mirror: the header is sticky and always reachable, so repeating the
 * routes down here is dead weight.
 *
 * Icons come from Font Awesome rather than the @icons barrel: importing from
 * that barrel drags every SVG in the folder through svgr, and the loader does
 * not apply to all of them from a server component.
 *
 * Both tiers are bands that pad by `--scrollbar-w`, so their centred inner
 * containers line up with page content inside the scroller.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__contact-band">
        <div className="site-footer__contact-inner">
          <a className="site-footer__contact" href={`mailto:${CONTACT.email}`}>
            <FontAwesomeIcon icon={faEnvelope} className="site-footer__icon" />
            <span>{CONTACT.email}</span>
          </a>
          <a className="site-footer__contact" href={CONTACT.phoneHref}>
            <FontAwesomeIcon icon={faPhone} className="site-footer__icon" />
            <span>{CONTACT.phone}</span>
          </a>
          <a
            className="site-footer__contact"
            href={CONTACT.locationHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLocationDot} className="site-footer__icon" />
            <span>{CONTACT.location}</span>
          </a>
        </div>
      </div>

      <div className="site-footer__legal">
        <div className="site-footer__legal-inner">
          <Link href="/" className="site-footer__brand" aria-label="V Source home">
            <Image
              src="/logos/vsource-logo-full.png"
              alt="V Source"
              width={1500}
              height={500}
              unoptimized
              className="site-footer__logo"
            />
          </Link>
          <span className="site-footer__legal-text">
            &copy; {year} V Source Development
            <span className="site-footer__abn">ABN {CONTACT.abn}</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
