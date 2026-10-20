import { CONTACT } from '@constants'

import './styles/siteFooter.scss'

/**
 * The end of the page. One line of small print, and that is all.
 *
 * It has been on a diet. It started as two chrome bands — four labelled contact
 * links, then legal — pinned below the scroller, which meant roughly 90px of
 * furniture on screen at all times and out of the fold on every page. The
 * contacts have moved to the right of the header's readout strip, where they
 * are reachable from anywhere without costing anything; what is left is the
 * copyright and the ABN, which nobody needs until they need it.
 *
 * So no band, no border, no background: a footer that looks like chrome invites
 * you to read it. This sits on the page like a colophon and scrolls away with
 * everything else, which is also why it no longer has to pad itself by
 * `--scrollbar-w` — inside the scroller the gutter is already accounted for.
 */
// Module scope, not render: `new Date()` is on the same impure list as
// Date.now() and the compiler rejects it in a render pass. The footer is
// statically built anyway, so the year was already frozen at build time.
const YEAR = new Date().getFullYear()

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer__legal">
        &copy; {YEAR} V Source Development
        <span className="site-footer__abn">ABN {CONTACT.abn}</span>
      </p>
    </footer>
  )
}
