import Link from 'next/link'
import { SITE_NAV } from './siteNav'

import './styles/siteFooter.scss'

/**
 * Site footer: nav mirror, contact details and legal line.
 *
 * PLACEHOLDER — ABN, email and phone are carried over from the current
 * vsource.dev and need confirming before launch. Deliberately does NOT render
 * the visitor's IP address, which the existing site does.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__wordmark">V&thinsp;Source</span>
          <p className="site-footer__tagline">Software and engineering.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          {SITE_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="site-footer__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__contact">
          <a href="mailto:admin@vsource.dev">admin@vsource.dev</a>
          <span className="site-footer__abn">ABN 51 276 613 779</span>
        </div>
      </div>

      <div className="site-footer__legal">
        <span>&copy; {year} V Source. All rights reserved.</span>
      </div>
    </footer>
  )
}
