import { CONTACT } from '@constants'
import { getStreams } from '@/data'
import CursorSpark from './CursorSpark'
import { fontVariables } from './fonts'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'
import { siteNav } from './siteNav'
import { Providers } from './SiteProviders'
import '@styles/global.scss'
import '@/app/(site)/styles/shell.scss'
import '@configs/fontawesome'

export const SITE_URL = 'https://www.vsource.dev'

/**
 * Structured data. Tells a crawler — and an LLM answering "who builds custom
 * software in Brisbane" — that this is one organisation, in one place, doing
 * these things. Cheapest high-value SEO on the site.
 */
const ORGANISATION = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organisation`,
  name: 'V Source Development',
  url: SITE_URL,
  description:
    'Custom software development, design, accessibility and Australian hosting for regulated and technical industries.',
  areaServed: 'AU',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Brisbane',
    addressRegion: 'QLD',
    addressCountry: 'AU',
  },
  email: CONTACT.email,
  telephone: CONTACT.phoneHref.replace('tel:', ''),
  identifier: { '@type': 'PropertyValue', name: 'ABN', value: CONTACT.abn },
  sameAs: [CONTACT.linkedin],
  knowsAbout: [
    'Custom software development',
    'Web accessibility',
    'WCAG 2.2 AA',
    'IEC 62304',
    'Medical device software',
    'Design systems',
  ],
}

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'V Source Development',
  publisher: { '@id': `${SITE_URL}/#organisation` },
  inLanguage: 'en-AU',
}

/**
 * The whole public document: <html>, the theme script, the header, the
 * scroller, the footer.
 *
 * Its own component because two roots render it. `app/(site)/layout.tsx` is
 * the root layout for every public page, and `app/global-not-found.tsx`
 * renders a URL that matches no route at all with NO layout above it — the
 * app has two root layouts, (site) and (payload), so nothing sits over both.
 * Sharing this is what makes that 404 the same page, with the same chrome, as
 * a notFound() inside the site.
 *
 * `data-theme="dark"` is set server-side so the dark ground is the default and
 * there is no flash of light theme before hydration. The inline script below
 * only overrides it when the visitor has explicitly chosen a theme — it runs
 * before paint, which is why it is inline and not a component.
 */
export default async function SiteDocument({ children }: { children: React.ReactNode }) {
  // The nav's streams are the visible ones (hide-websites).
  const nav = siteNav(await getStreams())
  return (
    <html lang="en-AU" data-theme="dark" className={fontVariables} suppressHydrationWarning>
      {/* This is an App Router root document (rendered by app/(site)/layout.tsx
          and app/global-not-found.tsx), where <head> is correct. The lint rule
          only recognises a file named app/layout as one. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}var c=window.crypto;if(c&&typeof c.randomUUID!=='function'){var g=function(){var b=new Uint8Array(16);if(c.getRandomValues){c.getRandomValues(b);}else{for(var i=0;i<16;i++)b[i]=Math.floor(Math.random()*256);}b[6]=(b[6]&0x0f)|0x40;b[8]=(b[8]&0x3f)|0x80;for(var h=[],j=0;j<16;j++)h.push((b[j]+0x100).toString(16).slice(1));return h[0]+h[1]+h[2]+h[3]+'-'+h[4]+h[5]+'-'+h[6]+h[7]+'-'+h[8]+h[9]+'-'+h[10]+h[11]+h[12]+h[13]+h[14]+h[15];};try{Object.defineProperty(c,'randomUUID',{value:g,writable:true,configurable:true});}catch(e){try{c.randomUUID=g;}catch(e2){}}}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([ORGANISATION, WEBSITE]) }}
        />
        <Providers>
          <div className="site-frame">
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <SiteHeader nav={nav} />
            <div className="site-scroll">
              {/*
                The footer is INSIDE the scroller now. It used to be pinned
                below it, which meant a band of chrome on screen at all times
                and out of the fold on every page — and once the contacts moved
                up into the readout strip there was nothing left in it but a
                line of small print, which does not earn being permanently
                visible. It sits at the end of the page and scrolls away.

                tabIndex 0, not -1: this is the element that scrolls, so it has
                to be reachable from the keyboard on its own. At -1 a page with
                nothing focusable inside it (/team) could not be scrolled
                without a mouse (WCAG 2.1.1). No role or label — the <main>
                inside already names the region.
              */}
              <div id="main" tabIndex={0} className="page-container top-align site-shell">
                {children}
                <SiteFooter />
              </div>
            </div>
          </div>
          <CursorSpark />
        </Providers>
      </body>
    </html>
  )
}
