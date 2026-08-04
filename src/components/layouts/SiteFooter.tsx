import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { CONTACT } from '@constants'

import './styles/siteFooter.scss'

/**
 * Bottom fascia: a debossed chrome band carrying the contact strip, then legal.
 * No nav mirror — the header is sticky and always reachable.
 *
 * Icons come from Font Awesome, not the @icons barrel: that barrel drags every
 * SVG through svgr and the loader does not apply from a server component.
 *
 * Both tiers pad by `--scrollbar-w` so their inners line up with page content.
 */
// Module scope, not render: `new Date()` is on the same impure list as
// Date.now() and the compiler rejects it in a render pass. The footer is
// statically built anyway, so the year was already frozen at build time.
const YEAR = new Date().getFullYear()

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__contact-band">
        <div className="site-footer__contact-inner">
          <a className="site-footer__contact" href={`mailto:${CONTACT.email}`}>
            <FontAwesomeIcon icon={faEnvelope} className="site-footer__icon" />
            <span className="site-footer__contact-text">{CONTACT.email}</span>
          </a>
          <a className="site-footer__contact" href={CONTACT.phoneHref}>
            <FontAwesomeIcon icon={faPhone} className="site-footer__icon" />
            <span className="site-footer__contact-text">{CONTACT.phone}</span>
          </a>
          <a
            className="site-footer__contact"
            href={CONTACT.locationHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLocationDot} className="site-footer__icon" />
            <span className="site-footer__contact-text">{CONTACT.location}</span>
          </a>
          <a
            className="site-footer__contact"
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedinIn} className="site-footer__icon" />
            <span className="site-footer__contact-text">Follow us on LinkedIn</span>
            <span className="visually-hidden">(opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className="site-footer__legal">
        <div className="site-footer__legal-inner">
          <span className="site-footer__legal-text">
            &copy; {YEAR} V Source Development
            <span className="site-footer__abn">ABN {CONTACT.abn}</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
