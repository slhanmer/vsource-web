'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { SITE_NAV } from './siteNav'

import './styles/siteHeader.scss'

/**
 * Site header: wordmark, primary nav, and a mobile drawer.
 *
 * The drawer closes on the click that navigates rather than in an effect
 * watching the pathname — synchronous setState inside an effect forces a second
 * render pass, and the click is the only way the drawer can trigger navigation
 * anyway.
 *
 * PLACEHOLDER — the wordmark is set in type until the V Source logo lands, at
 * which point this should render a `VSourceWordmark` component the same way the
 * portal renders `AptiumWordmark`.
 */
export default function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href="/"
          className="site-header__brand"
          aria-label="V Source home"
          onClick={closeMenu}
        >
          V&thinsp;Source
        </Link>

        <nav className="site-header__nav" aria-label="Primary">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`site-header__link ${pathname === item.href ? 'is-active' : ''}`}
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
