'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { SITE_STATUS } from '@constants'
import { SITE_NAV } from './siteNav'

import './styles/siteHeader.scss'

/**
 * Site header — the instrument fascia.
 *
 * Two tiers, following the portal's header + breadcrumb pattern:
 *
 *   1. A debossed chrome band carrying the mark and the nav. Nav items are
 *      machined keys — embossed proud of the band, with the active route
 *      pressed into it. That inversion is the whole idea: the current page is
 *      the key that is depressed.
 *   2. A readout strip cut deeper still, carrying real state (see
 *      constants/status.ts). It is what makes the header inform rather than
 *      merely navigate, and it is the reason this does not read as the
 *      logo-left / nav-right bar every site builder ships.
 *
 * The drawer closes on the click that navigates rather than in an effect
 * watching the pathname — synchronous setState inside an effect forces a second
 * render pass, and the click is the only way the drawer can navigate anyway.
 */
export default function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="site-header__band">
        <div className="site-header__inner">
          <Link
            href="/"
            className="site-header__brand"
            aria-label="V Source home"
            onClick={closeMenu}
          >
            <Image
              src="/logos/vsource-logo-full.png"
              alt="V Source"
              width={1500}
              height={500}
              unoptimized
              priority
              className="site-header__logo"
            />
          </Link>

          <nav className="site-header__nav" aria-label="Primary">
            {SITE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`site-header__key ${pathname === item.href ? 'is-active' : ''}`}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="site-header__toggle"
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>

      <div className="site-header__readout">
        <dl className="site-header__readout-inner">
          {SITE_STATUS.map((entry) => (
            <div key={entry.label} className="site-header__stat">
              <dt className="site-header__stat-label">{entry.label}</dt>
              <dd className="site-header__stat-value">
                {entry.live && <span className="site-header__dot" aria-hidden="true" />}
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <nav
        id="site-mobile-nav"
        className={`site-header__drawer ${menuOpen ? 'is-open' : ''}`}
        aria-label="Primary mobile"
        hidden={!menuOpen}
      >
        {SITE_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`site-header__drawer-link ${pathname === item.href ? 'is-active' : ''}`}
            aria-current={pathname === item.href ? 'page' : undefined}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
