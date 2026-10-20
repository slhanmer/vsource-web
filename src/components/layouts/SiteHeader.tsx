'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import HeaderContacts from './HeaderContacts'
import HeaderReadout from './HeaderReadout'
import ThemeSwitch from './ThemeSwitch'
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
 *
 * The header is present on every page, including the home page. It used to hide
 * on `/` and slide in once the hero had scrolled past, because the hero carried
 * the full lockup at size and a second mark 40px above it was noise. The hero
 * no longer carries a lockup — the mark here is the only one — so there is
 * nothing to defer to, and the home page stops being the one page with a
 * bespoke header. The `#home-navcue` sentinel went with it.
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
            {/*
              600x200 WebP. `unoptimized` is deliberate — with output:'standalone',
              Next image optimisation needs sharp on the deploy box, so we ship a
              correctly sized file instead. The 1500x500 PNG source is 315KB and
              preloads via `priority`; do not point back at it.

              `priority` everywhere now. It used to be off on the home page
              because the hero lockup was the LCP element there and preloading
              both fetched the same artwork twice. The hero lockup is gone, so
              this is the one mark on the page.
            */}
            <Image
              src="/logos/vsource-logo-full.webp"
              alt="V Source"
              width={600}
              height={200}
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

          <div className="site-header__controls">
            <ThemeSwitch />

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
      </div>

      {/*
        Tier 2. The readings at one end, the contact links at the other — the
        strip had two readings and a screen's worth of nothing to their right,
        and the contacts were costing a whole band of their own at the bottom of
        every page.
      */}
      <div className="site-header__readout">
        <div className="site-header__readout-inner">
          <HeaderReadout />
          <HeaderContacts />
        </div>
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
